import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useOrders from '../hooks/useOrders';
import { ShoppingCart, Package, Truck, RefreshCw, Calendar, CreditCard, MapPin, Eye, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

function OrdersPage() {
  const { user } = useAuth();

  // Estado para el modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para la búsqueda por ID
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Hook para manejo de pedidos
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    fetchOrders,
    getOrderDetails,
    formatOrderStatus,
    getStatusClass,
    formatDate,
    getPaymentMethodName,
    hasOrders
  } = useOrders();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  // Efecto para deshabilitar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  // Limpiar errores de búsqueda cuando el componente se desmonta
  useEffect(() => {
    return () => {
      setSearchError(null);
    };
  }, []);
  useEffect(() => {
    // Fetch orders when component mounts
    fetchOrders();
  }, [fetchOrders]);

  // Función para abrir el modal con los detalles del pedido
  const openOrderDetails = (order) => {
    console.log('🔍 Opening modal for order:', order);
    console.log('🔍 Order detalles:', order.detalles);
    console.log('🔍 Order pago:', order.pago);
    console.log('🔍 Order metodo_pago:', order.metodo_pago);
    console.log('🔍 Order envio:', order.envio);

    // Debug adicional para la dirección de envío
    if (order.envio && order.envio.direccion) {
      console.log('🔍 Dirección de envío (nueva estructura):', order.envio.direccion);
    }

    // Debug adicional para productos
    if (order.detalles && Array.isArray(order.detalles)) {
      console.log('🔍 Total productos en detalles:', order.detalles.length);
      order.detalles.forEach((detalle, index) => {
        console.log(`🔍 Producto ${index + 1}:`, detalle);
      });
    }

    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  // Función para calcular el total de productos en un pedido
  const getTotalProducts = (order) => {
    if (!order.detalles || !Array.isArray(order.detalles)) return 0;
    return order.detalles.reduce((total, detalle) => total + (parseInt(detalle.cantidad) || 0), 0);
  }  // Función para buscar pedido por ID
  const handleSearchOrder = async () => {
    if (!searchOrderId.trim()) {
      toast.error('Por favor, ingresa un ID de pedido válido');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const orderDetails = await getOrderDetails(searchOrderId.trim());

      if (orderDetails) {
        // Normalizar la estructura del pedido encontrado
        const normalizedOrder = {
          ...orderDetails,
          detalles: orderDetails.pedido_items || orderDetails.detalles || [],
          envio: Array.isArray(orderDetails.envios) ? orderDetails.envios[0] : orderDetails.envio || orderDetails.envios,
          pago: Array.isArray(orderDetails.pagos) ? orderDetails.pagos[0] : orderDetails.pago || orderDetails.pagos,
        };

        // Mostrar mensaje de éxito
        toast.success(`Pedido #${searchOrderId} encontrado`);
        openOrderDetails(normalizedOrder);
      } else {
        toast.error('Pedido no encontrado');
      }
    } catch (error) {
      console.error('Error searching order:', error);

      // Manejar diferentes tipos de errores con toasts
      if (error.response?.status === 404) {
        toast.error('Pedido no encontrado');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para ver este pedido');
      } else if (error.response?.status === 401) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
      } else {
        // Error genérico
        const errorMessage = error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Error al buscar el pedido. Por favor, intenta nuevamente.';
        toast.error(errorMessage);
      }
    } finally {
      setSearchLoading(false);
    }
  };  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchOrderId('');
    setSearchError(null);
    // Recargar la lista de pedidos para mostrarlos nuevamente
    fetchOrders();
  };

  return (
    <div className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <button
            onClick={() => fetchOrders()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            disabled={ordersLoading}
          >
            {ordersLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Actualizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Actualizar pedidos
              </>
            )}
          </button>
        </div>

        {/* Barra de búsqueda por ID */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Buscar Pedido por ID</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchOrder()}
                  placeholder="Ingresa el ID del pedido (ej: 123)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>            <div className="flex gap-2">
              <button
                onClick={handleSearchOrder}
                disabled={searchLoading || !searchOrderId.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Buscar'
                )}
              </button>
              {searchOrderId && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
        {ordersError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {typeof ordersError === 'string' ? ordersError : JSON.stringify(ordersError)}
          </div>
        )}

        {/* Loading state */}
        {ordersLoading && !orders.length && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Cargando pedidos...</span>
          </div>
        )}        {/* Orders List - Vista en columnas */}
        {!ordersLoading && !ordersError && hasOrders ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header de la tabla - Solo visible en desktop */}
            <div className="hidden md:block bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 font-medium text-gray-700 text-sm">
                <div className="col-span-2">Pedido</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2">Productos</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Acciones</div>
              </div>
            </div>

            {/* Filas de pedidos */}
            <div className="divide-y divide-gray-200">
              {orders.map(order => (
                <div key={order.id_pedido} className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Vista Desktop */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    {/* Número de pedido */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">#{order.id_pedido}</span>
                      </div>
                    </div>

                    {/* Fecha */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600">
                        {order.fecha_creacion ? new Date(order.fecha_creacion).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="col-span-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.estado)}`}>
                        {formatOrderStatus(order.estado)}
                      </span>
                    </div>

                    {/* Productos */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600">
                        {getTotalProducts(order)} {getTotalProducts(order) === 1 ? 'producto' : 'productos'}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-2">
                      <span className="font-medium text-gray-900">
                        S/ {parseFloat(order.monto_total || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="col-span-2">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </button>
                    </div>
                  </div>

                  {/* Vista Mobile */}
                  <div className="md:hidden space-y-3">
                    {/* Header con número y fecha */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">Pedido #{order.id_pedido}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.fecha_creacion ? new Date(order.fecha_creacion).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </div>

                    {/* Estado y total */}
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.estado)}`}>
                        {formatOrderStatus(order.estado)}
                      </span>
                      <span className="font-medium text-gray-900">
                        S/ {parseFloat(order.monto_total || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Productos y acción */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {getTotalProducts(order)} {getTotalProducts(order) === 1 ? 'producto' : 'productos'}
                      </div>
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !ordersLoading && !ordersError && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos realizados</h3>
              <p className="text-gray-500 mb-6">
                Cuando realices tu primera compra, aparecerá aquí.
              </p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <ShoppingCart size={20} className="mr-2" />
                Comenzar a comprar
              </a>
            </div>
          ))}        {/* Modal de detalles del pedido */}
        {isModalOpen && selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] my-4 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ margin: '2rem' }}
            >
              {/* Header del modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      Pedido #{selectedOrder.id_pedido}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Realizado el {selectedOrder.fecha_creacion ? formatDate(selectedOrder.fecha_creacion) : 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Contenido del modal con scroll */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1">
                {/* Información general del pedido */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  {/* Estado del pedido */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-gray-600" />
                      <h3 className="font-medium text-gray-900">Estado</h3>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(selectedOrder.estado)}`}>
                      {formatOrderStatus(selectedOrder.estado)}
                    </span>
                  </div>                  {/* Método de pago */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <h3 className="font-medium text-gray-900">Pago</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      {getPaymentMethodName(selectedOrder)}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">Total</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-green-600">
                      S/ {parseFloat(selectedOrder.monto_total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>                {/* Información de envío */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900">Información de Envío</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Estado del envío */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-600" />
                        <h4 className="font-medium text-gray-900">Estado</h4>
                      </div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedOrder.envio?.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          selectedOrder.envio?.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                            selectedOrder.envio?.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {selectedOrder.envio?.estado ?
                          selectedOrder.envio.estado.charAt(0).toUpperCase() + selectedOrder.envio.estado.slice(1) :
                          'Pendiente'
                        }
                      </span>
                    </div>

                    {/* Costo de envío */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">Costo de Envío</h4>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">
                        S/ {selectedOrder.envio?.monto_envio ?
                          parseFloat(selectedOrder.envio.monto_envio).toFixed(2) :
                          selectedOrder.costo_envio ?
                            parseFloat(selectedOrder.costo_envio).toFixed(2) :
                            '0.00'
                        }
                      </p>
                    </div>

                    {/* Fecha de envío */}
                    {selectedOrder.envio?.fecha_envio && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <h4 className="font-medium text-gray-900">Fecha de Envío</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          {new Date(selectedOrder.envio.fecha_envio).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}                    {/* Dirección de envío - siempre mostrar si existe */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">Dirección de Entrega</h4>                          {(() => {
                            console.log('Información de dirección en selectedOrder:', {
                              shipping_info: selectedOrder.shipping_info,
                              direccion_envio: selectedOrder.direccion_envio,
                              envio: selectedOrder.envio,
                              direccion: selectedOrder.direccion,
                              envios: selectedOrder.envios,
                              direccion_completa: selectedOrder.direccion_completa,
                              direccion_calle: selectedOrder.direccion_calle,
                            });

                            // NUEVO: Intentar primero la nueva estructura donde envio tiene relación con dirección
                            if (selectedOrder.envio && selectedOrder.envio.direccion) {
                              const direccion = selectedOrder.envio.direccion;
                              let direccionTexto = '';

                              // Si tiene la propiedad formatted_address, usamos esa
                              if (direccion.formatted_address) {
                                direccionTexto = direccion.formatted_address;
                              } else {
                                // Construimos manualmente a partir de los campos individuales
                                const partes = [];
                                if (direccion.calle) partes.push(direccion.calle);
                                if (direccion.numero) partes.push(direccion.numero);
                                if (direccion.distrito) partes.push(direccion.distrito);
                                if (direccion.ciudad) partes.push(direccion.ciudad || 'Cusco');

                                direccionTexto = partes.join(', ');
                              }

                              if (direccionTexto) {
                                return <p className="text-sm text-gray-700">{direccionTexto}</p>;
                              }
                            }

                            // 1. Intenta usar la información de shipping_info (LEGACY)
                            if (selectedOrder.shipping_info) {
                              const info = selectedOrder.shipping_info;
                              let direccionTexto = '';

                              if (info.address) {
                                direccionTexto = info.address;
                              } else {
                                // Construir desde partes individuales si están disponibles
                                const partes = [];
                                if (info.calle) partes.push(info.calle);
                                if (info.numero) partes.push(info.numero);
                                if (info.distrito) partes.push(info.distrito);
                                if (info.ciudad) partes.push(info.ciudad || 'Cusco');

                                direccionTexto = partes.join(', ');
                              }

                              if (direccionTexto) {
                                return <p className="text-sm text-gray-700">{direccionTexto}</p>;
                              }
                            }

                            // 2. Usar dirección_envio si existe (puede ser una cadena completa) (LEGACY)
                            if (selectedOrder.direccion_envio) {
                              return <p className="text-sm text-gray-700">{selectedOrder.direccion_envio}</p>;
                            }

                            // 3. Usar dirección desde el objeto envío si existe (LEGACY)
                            if (selectedOrder.envio) {
                              // Construir desde partes individuales del envío
                              const env = selectedOrder.envio;
                              if (env.calle || env.numero) {
                                let direccionTexto = '';
                                if (env.calle) direccionTexto += env.calle;
                                if (env.numero) direccionTexto += ' ' + env.numero;
                                if (env.distrito) direccionTexto += ', ' + env.distrito;
                                if (env.ciudad) direccionTexto += ', ' + env.ciudad;
                                else direccionTexto += ', Cusco';

                                return <p className="text-sm text-gray-700">{direccionTexto}</p>;
                              }
                            }

                            // 4. Buscar en el primer envío del array envios si existe (LEGACY)
                            if (selectedOrder.envios && selectedOrder.envios.length > 0) {
                              const primerEnvio = selectedOrder.envios[0];
                              if (primerEnvio.direccion) {
                                const direccion = primerEnvio.direccion;
                                let direccionTexto = '';

                                if (direccion.formatted_address) {
                                  direccionTexto = direccion.formatted_address;
                                } else {
                                  // Construimos manualmente a partir de los campos individuales
                                  const partes = [];
                                  if (direccion.calle) partes.push(direccion.calle);
                                  if (direccion.numero) partes.push(direccion.numero);
                                  if (direccion.distrito) partes.push(direccion.distrito);
                                  if (direccion.ciudad) partes.push(direccion.ciudad || 'Cusco');

                                  direccionTexto = partes.join(', ');
                                }

                                if (direccionTexto) {
                                  return <p className="text-sm text-gray-700">{direccionTexto}</p>;
                                }
                              }
                            }

                            // 5. Usar objeto direccion si existe (LEGACY)
                            if (selectedOrder.direccion) {
                              const dir = selectedOrder.direccion;
                              // Si la dirección tiene un método formateado
                              if (dir.formatted_address) {
                                return <p className="text-sm text-gray-700">{dir.formatted_address}</p>;
                              }

                              // Intentar construir a partir de las partes
                              if (dir.calle || dir.numero) {
                                let direccionTexto = '';
                                if (dir.calle) direccionTexto += dir.calle;
                                if (dir.numero) direccionTexto += ' ' + dir.numero;
                                if (dir.distrito) direccionTexto += ', ' + dir.distrito;
                                if (dir.ciudad) direccionTexto += ', ' + dir.ciudad;
                                else direccionTexto += ', Cusco';

                                return <p className="text-sm text-gray-700">{direccionTexto}</p>;
                              }
                            }

                            // 6. Buscar componentes individuales en el objeto principal (LEGACY)
                            const calle = selectedOrder.direccion_calle || selectedOrder.calle;
                            const numero = selectedOrder.direccion_numero || selectedOrder.numero;
                            const distrito = selectedOrder.direccion_distrito || selectedOrder.distrito;
                            const ciudad = selectedOrder.direccion_ciudad || selectedOrder.ciudad || 'Cusco';

                            if (calle || numero) {
                              return (
                                <p className="text-sm text-gray-700">
                                  {calle || ''} {numero || ''}{distrito ? `, ${distrito}` : ''}{ciudad ? `, ${ciudad}` : ', Cusco'}
                                </p>
                              );
                            }

                            // Si llegamos aquí, no encontramos ninguna información de dirección
                            return <p className="text-sm text-gray-700">Dirección no especificada</p>;
                          })()}
                          {(() => {
                            // Buscar cualquier referencia disponible
                            const referencia = selectedOrder.envio?.direccion?.referencia ||
                              selectedOrder.referencias_envio ||
                              selectedOrder.envio?.referencias ||
                              selectedOrder.envio?.referencia ||
                              selectedOrder.direccion?.referencia;

                            if (referencia) {
                              return (
                                <p className="text-sm text-gray-500 mt-1">
                                  <strong>Referencias:</strong> {referencia}
                                </p>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del transportista */}
                  {selectedOrder.envio?.transportista && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-4 h-4 text-gray-600" />
                        <h4 className="font-medium text-gray-900">Transportista</h4>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p><strong>Nombre:</strong> {selectedOrder.envio.transportista.nombre || 'No especificado'}</p>
                        {selectedOrder.envio.transportista.telefono && (
                          <p><strong>Teléfono:</strong> {selectedOrder.envio.transportista.telefono}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>                {/* Productos del pedido */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Productos ({(() => {
                        const productos = selectedOrder.detalles ||
                          selectedOrder.pedido_items ||
                          selectedOrder.items ||
                          selectedOrder.productos ||
                          [];
                        return productos?.length || 0;
                      })()})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {(() => {
                      // Obtener productos de múltiples posibles ubicaciones
                      const productos = selectedOrder.detalles ||
                        selectedOrder.pedido_items ||
                        selectedOrder.items ||
                        selectedOrder.productos ||
                        [];

                      return productos && Array.isArray(productos) && productos.length > 0 ? (
                        productos.map((detalle, index) => {
                          // Log solo para debug, sin mostrar en UI
                          if (process.env.NODE_ENV === 'development') {
                            console.log(`🔍 Producto ${index + 1}:`, detalle);
                          }

                          // Crear una clave única más específica
                          const uniqueKey = detalle.id_detalle_pedido ||
                            detalle.id_pedido_items ||
                            detalle.id_producto ||
                            detalle.producto?.id_producto ||
                            `${selectedOrder.id_pedido}-${index}`;

                          return (
                            <div key={`producto-${uniqueKey}`} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                  {/* Información del producto */}
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Imagen del producto */}
                                    {(detalle.url_imagen || detalle.producto?.url_imagen || detalle.producto?.imagen) && (
                                      <img
                                        src={detalle.url_imagen || detalle.producto?.url_imagen || detalle.producto?.imagen}
                                        alt={detalle.nombre_producto || detalle.producto?.nombre || 'Producto'}
                                        className="w-16 h-16 object-cover rounded-lg bg-gray-100 mx-auto md:mx-0"
                                        onError={(e) => {
                                          e.target.style.display = 'none'; // Oculta la imagen si hay error al cargarla
                                        }}
                                      />
                                    )}
                                    <div className="flex-1 text-center md:text-left">
                                      <h4 className="font-medium text-gray-900 mb-1">
                                        {detalle.nombre_producto ||
                                          detalle.producto?.nombre ||
                                          detalle.nombre ||
                                          detalle.producto?.nombre_producto ||
                                          'Producto sin nombre'}
                                      </h4>
                                      {(detalle.descripcion || detalle.producto?.descripcion) && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                          {detalle.descripcion || detalle.producto?.descripcion}
                                        </p>
                                      )}
                                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                                        <span className="text-gray-600">
                                          <strong>Cantidad:</strong> {detalle.cantidad || 0}
                                        </span>
                                        <span className="text-gray-600">
                                          <strong>Precio unitario:</strong> S/ {parseFloat(
                                            detalle.precio_unitario ||
                                            detalle.precio ||
                                            detalle.price ||
                                            detalle.producto?.precio ||
                                            0
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Subtotal del producto */}
                                <div className="text-center md:text-right md:ml-4">
                                  <div className="bg-green-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                                    <p className="text-lg font-bold text-green-600">
                                      S/ {(detalle.subtotal ?
                                        parseFloat(detalle.subtotal).toFixed(2) :
                                        (
                                          parseFloat(detalle.cantidad || 0) *
                                          parseFloat(
                                            detalle.precio_unitario ||
                                            detalle.precio ||
                                            detalle.price ||
                                            detalle.producto?.precio ||
                                            0
                                          )
                                        ).toFixed(2)
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-lg mb-2">No hay productos en este pedido</p>
                          <p className="text-gray-400 text-sm">Los detalles del pedido no están disponibles</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Resumen del pedido */}
                <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">                      <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">
                        S/ {(() => {
                          const productos = selectedOrder.detalles ||
                            selectedOrder.pedido_items ||
                            selectedOrder.items ||
                            selectedOrder.productos ||
                            [];

                          return productos && Array.isArray(productos)
                            ? productos.reduce((total, detalle) => {
                              // Si hay subtotal directo, usarlo
                              if (detalle.subtotal) {
                                return total + parseFloat(detalle.subtotal);
                              }
                              // Si no, calcular cantidad * precio
                              const cantidad = parseFloat(detalle.cantidad || 0);
                              const precio = parseFloat(
                                detalle.precio_unitario ||
                                detalle.precio ||
                                detalle.price ||
                                detalle.producto?.precio ||
                                0
                              );
                              return total + (cantidad * precio);
                            }, 0).toFixed(2)
                            : '0.00';
                        })()}
                      </span>
                    </div>
                      {/* Mostrar costo de envío si está disponible (incluyendo S/ 0.00 si es gratis) */}
                      {(() => {
                        const rawCost = selectedOrder.costo_envio ?? selectedOrder.envio?.monto_envio;
                        // Check if rawCost is defined (not null or undefined)
                        if (rawCost !== undefined && rawCost !== null) {
                          const numericCost = parseFloat(rawCost);
                          // Check if parsing was successful and resulted in a number
                          if (!isNaN(numericCost)) {
                            // Render if cost is defined and is a number (including 0)
                            return (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Envío:</span>
                                <span className="text-gray-900">
                                  S/ {numericCost.toFixed(2)}
                                </span>
                              </div>
                            );
                          }
                        }
                        // If rawCost is not defined, or not a valid number, render nothing.
                        return null;
                      })()}
                      <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t border-gray-300">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-green-600">S/ {parseFloat(selectedOrder.monto_total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>              {/* Footer del modal */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 md:px-6 py-4 z-10">
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="w-full md:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;