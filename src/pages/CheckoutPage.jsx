import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import addressesService from '../services/addressesService';
import ordersService from '../services/ordersService';
import paymentsService from '../services/paymentsService';
import useAddresses from '../hooks/useAddresses';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useShoppingCart();
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Hook para manejo de direcciones
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    creating: creatingAddress,
    defaultAddress,
    createAddress,
    getDefaultAddress,
    hasAddresses,
    clearError: clearAddressError
  } = useAddresses();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'mercado-pago'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');  const [addressOption, setAddressOption] = useState('profile'); // 'profile', 'select' o 'new'
  const [selectedAddressId, setSelectedAddressId] = useState(null);  const [newAddress, setNewAddress] = useState({
    calle: '',
    numero: '',
    distrito: '',
    ciudad: 'Cusco', // Default city
    referencia: '',
  });
  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user && isAuthenticated) {
      // Sincronizar datos del usuario con el formulario
      setFormData(prevData => ({
        ...prevData,
        firstName: user.nombre || '',
        lastName: user.apellidos || '',
        email: user.email || '',
        phone: user.telefono || ''
      }));
    }
  }, [user, isAuthenticated]);  // Función para guardar la nueva dirección
  const handleSaveNewAddress = async () => {
    if (!newAddress.calle || !newAddress.numero || !newAddress.distrito || !newAddress.referencia) {
      toast.error('Por favor, completa todos los campos de la dirección');
      return;
    }

    try {
      const addressData = {
        calle: newAddress.calle,
        numero: newAddress.numero,
        distrito: newAddress.distrito,
        ciudad: newAddress.ciudad,
        referencia: newAddress.referencia,
        predeterminada: false // La guardamos como no predeterminada por defecto
      };

      const success = await createAddress(addressData);
      
      if (success) {
        toast.success('Dirección guardada exitosamente');        // Resetear el formulario de nueva dirección
        setNewAddress({
          calle: '',
          numero: '',
          distrito: '',
          ciudad: 'Cusco',
          referencia: '',
        });
      } else {
        toast.error('Error al guardar la dirección. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error guardando la dirección:', error);
      toast.error('Error al guardar la dirección. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Redirigir si el carrito está vacío y no estamos en el paso de confirmación
    if (cartItems.length === 0 && currentStep !== 3) {
      navigate('/products');
    }
  }, [cartItems.length, navigate, currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (currentStep === 1) {
      // Validar que se tenga una dirección válida antes de proceder
      let hasValidAddress = false;
      
      if (addressOption === 'profile') {
        hasValidAddress = getDefaultAddress() !== null;
      } else if (addressOption === 'select') {
        hasValidAddress = selectedAddressId !== null;
      } else if (addressOption === 'new') {
        // Verificar que todos los campos estén llenos
        hasValidAddress = newAddress.calle && newAddress.numero && 
                         newAddress.distrito && newAddress.ciudad && newAddress.referencia;
      }
      
      if (!hasValidAddress) {
        setIsSubmitting(false);
        if (addressOption === 'new') {
          toast.error('Por favor, completa todos los campos de la dirección.');
        } else if (addressOption === 'select') {
          toast.error('Por favor, selecciona una dirección para continuar.');
        } else {
          toast.error('Por favor, selecciona una dirección válida para continuar.');
        }
        return;
      }
      
      // Si todo está bien, avanzar al siguiente paso
      setCurrentStep(2);
      setIsSubmitting(false);
      return;
    }
    
    if (currentStep === 2) {
      // Paso 1: Crear el pedido en la base de datos ANTES de procesar el pago
      try {        // Preparar datos del checkout para el backend
        const checkoutData = {
          items: cartItems.map(item => ({
            product_id: parseInt(item.product.id), // Convertir string a número para que coincida con id_producto
            quantity: item.quantity,
            price: parseFloat(item.product.salePrice || item.product.price)
          })),
          monto_total: parseFloat(orderTotal.toFixed(2)), // Total incluyendo envío
          subtotal: parseFloat(cartTotal.toFixed(2)), // Subtotal sin envío
          shipping_cost: parseFloat(shippingCost.toFixed(2)), // Costo de envío calculado
          has_free_shipping: hasStrawberryPackOffer, // Indicador de envío gratis
          strawberry_packs_subtotal: parseFloat(strawberryPacksSubtotal.toFixed(2)), // Subtotal de paquetes de fresas
          shipping_info: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            email: formData.email || '',
            phone: formData.phone || ''
          },
          address_info: {},
          notes: `Pedido realizado desde el checkout. Envío: ${hasStrawberryPackOffer ? 'GRATIS' : `S/ ${shippingCost.toFixed(2)}`}`
        };

        // Determinar la información de dirección según la opción seleccionada
        if (addressOption === 'profile') {
          const defaultAddr = getDefaultAddress();
          if (defaultAddr) {
            checkoutData.address_info = {
              type: 'profile',
              address_id: parseInt(defaultAddr.id_direccion)
            };
          }
        } else if (addressOption === 'select' && selectedAddressId) {
          checkoutData.address_info = {
            type: 'select',
            address_id: parseInt(selectedAddressId)
          };
        } else if (addressOption === 'new') {
          checkoutData.address_info = {
            type: 'new',
            new_address: {
              calle: newAddress.calle || '',
              numero: newAddress.numero || '',
              distrito: newAddress.distrito || '',
              ciudad: newAddress.ciudad || 'Cusco', // Default city
              referencia: newAddress.referencia || ''
            }
          };
        }        console.log('Creando pedido con datos:', checkoutData);
        
        // Crear el pedido en la base de datos
        const orderResponse = await ordersService.createOrder(checkoutData);
        console.log('Respuesta del servidor:', orderResponse);
        
        if (orderResponse && orderResponse.order_id) {
          const newOrderId = orderResponse.order_id;
          setOrderId(newOrderId);
          
          toast.success('Pedido creado exitosamente. Redirigiendo a Mercado Pago...');
          
          // Paso 2: Crear preferencia de Mercado Pago
          const itemsForMercadoPago = cartItems.map(item => ({
            title: item.product.name,
            quantity: item.quantity,
            unit_price: Math.round(parseFloat(item.product.salePrice || item.product.price)),
            description: item.product.description || undefined,
          }));

          // Agregar el costo de envío como un item adicional si no es gratis
          if (shippingCost > 0) {
            itemsForMercadoPago.push({
              title: "Costo de envío",
              quantity: 1,
              unit_price: Math.round(shippingCost),
              description: "Envío a domicilio"
            });
          }          // Crear preferencia de Mercado Pago con referencia al pedido
          const mercadoPagoData = {
            items: itemsForMercadoPago,
            external_reference: newOrderId.toString(),
            back_urls: {
              success: `${window.location.origin}/register/pago-exitoso?order_id=${newOrderId}`,
              failure: `${window.location.origin}/register/pago-fallido?order_id=${newOrderId}`,
              pending: `${window.location.origin}/register/pago-pendiente?order_id=${newOrderId}`
            }
          };

          const response = await api.post('/create-preference', mercadoPagoData);
          
          setIsSubmitting(false); // Detener el indicador de carga después de la respuesta

          if (response.init_point) {
            window.location.href = response.init_point;
          } else if (response.sandbox_init_point) { // Para entorno de pruebas
            window.location.href = response.sandbox_init_point;
          } else {
            console.error('No init_point received from Mercado Pago');
            toast.error('Error: No se recibió el punto de inicio para el pago de Mercado Pago.');
          }
        } else {
          throw new Error('Error al crear el pedido: No se recibió order_id');
        }} catch (error) {
        setIsSubmitting(false);
        console.error('Error en el proceso de checkout:', error);
        
        // Acceder a los datos del error de manera más robusta
        let errorData = null;
        if (error.response) {
          errorData = error.response.data;
        } else if (error.data) {
          errorData = error.data;
        }
        
        console.log('Error data:', errorData);
          if (errorData) {
          // Si hay errores de validación específicos (422), mostrarlos
          if (error.response?.status === 422 && errorData.error) {
            const validationErrors = errorData.error;
            console.log('Validation errors:', validationErrors);
            
            let errorMessages = [];
              // Convertir los errores de validación en un array de mensajes
            if (typeof validationErrors === 'object' && validationErrors !== null) {
              Object.keys(validationErrors).forEach(field => {
                if (Array.isArray(validationErrors[field])) {
                  validationErrors[field].forEach(msg => {
                    errorMessages.push(`${field}: ${msg}`);
                  });
                } else {
                  // Convertir a string si no es array
                  errorMessages.push(`${field}: ${String(validationErrors[field])}`);
                }
              });
            } else {
              // Convertir a string si no es un objeto
              errorMessages.push(String(validationErrors));
            }
              // Mostrar cada error por separado
            errorMessages.forEach(msg => {
              // Asegurar que el mensaje es una cadena antes de mostrarlo
              const errorMsg = typeof msg === 'string' ? msg : JSON.stringify(msg);
              toast.error(errorMsg);
            });
          } else {
            toast.error(errorData.message || errorData.error || 'Error en el checkout');
          }
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Error de conexión. Por favor, intenta de nuevo.');
        }
      }
    } else {
      // Lógica para otros pasos (avanzar al siguiente paso)
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep(currentStep + 1);
      }, 1500); // Simulación de carga
    }
  };
  // OFERTA: Envío gratis para cualquier combinación de paquetes de fresas (categoryId: '1') si el subtotal de esos productos es >= 30
  const strawberryPackCategoryId = '1';
  
  // Calcular el subtotal solo de los paquetes de fresas (categoryId: '1')
  const strawberryPacksSubtotal = cartItems
    .filter(item => item.product.categoryId === strawberryPackCategoryId)
    .reduce((total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 0);
  
  // Verificar si aplica la oferta de envío gratis (subtotal de paquetes >= S/ 30)
  const hasStrawberryPackOffer = strawberryPacksSubtotal >= 30;

  // Costo de envío: gratis si aplica la oferta, sino S/ 5.99
  const shippingCost = hasStrawberryPackOffer ? 0 : 5.99;
  
  // Total final: subtotal de todos los productos + envío (sin impuestos según requerimientos)
  const orderTotal = cartTotal + shippingCost;  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
              <ArrowLeft size={18} className="mr-2" />
              <span>Volver al carrito</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Finalizar compra</h1>
        </div>

        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-green-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="mt-2 text-sm text-gray-600">Datos de envío</span>
            </div>
            <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-green-700' : 'bg-gray-300'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-green-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="mt-2 text-sm text-gray-600">Pago</span>
            </div>
            <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-green-700' : 'bg-gray-300'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-green-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="mt-2 text-sm text-gray-600">Confirmación</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Truck className="mr-3 text-green-700" size={22} />
                  Información de envío
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="tu@correo.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="123-456-7890"
                      />
                    </div>
                  </div>
                  {/* Dirección */}                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={addressOption}
                      onChange={e => {
                        setAddressOption(e.target.value);
                        setSelectedAddressId(null); // Reset selected address when changing option
                        clearAddressError();
                      }}
                    >
                      <option value="profile">Usar mi dirección predeterminada</option>
                      {hasAddresses && addresses.length > 1 && (
                        <option value="select">Seleccionar otra dirección guardada</option>
                      )}
                      <option value="new">Ingresar nueva dirección</option>
                    </select>

                    {/* Mostrar errores de direcciones si existen */}
                    {addressesError && (
                      <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {typeof addressesError === 'object' 
                          ? Object.values(addressesError).flat().join('\n')
                          : addressesError
                        }
                      </div>
                    )}

                    {addressOption === 'profile' ? (
                      <div className="bg-gray-50 p-3 rounded-lg border text-gray-700">
                        {addressesLoading ? (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span>Cargando dirección...</span>
                          </div>
                        ) : selectedAddressId && addresses.find(addr => addr.id_direccion === selectedAddressId) ? (
                          (() => {
                            const address = addresses.find(addr => addr.id_direccion === selectedAddressId);
                            return (
                              <>
                                <div><span className="font-medium">Calle:</span> {address.calle}</div>
                                <div><span className="font-medium">Número:</span> {address.numero}</div>
                                <div><span className="font-medium">Distrito:</span> {address.distrito}</div>
                                <div><span className="font-medium">Ciudad:</span> {address.ciudad}</div>
                                {address.referencia && (
                                  <div><span className="font-medium">Referencia:</span> {address.referencia}</div>
                                )}
                              </>
                            );
                          })()
                        ) : getDefaultAddress() ? (
                          <>
                            <div><span className="font-medium">Calle:</span> {getDefaultAddress().calle}</div>
                            <div><span className="font-medium">Número:</span> {getDefaultAddress().numero}</div>
                            <div><span className="font-medium">Distrito:</span> {getDefaultAddress().distrito}</div>
                            <div><span className="font-medium">Ciudad:</span> {getDefaultAddress().ciudad}</div>
                            {getDefaultAddress().referencia && (
                              <div><span className="font-medium">Referencia:</span> {getDefaultAddress().referencia}</div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500 italic">
                            <p>No tienes una dirección predeterminada configurada.</p>
                            <p className="text-sm mt-1">Selecciona "Ingresar nueva dirección" para continuar.</p>
                          </div>
                        )}
                      </div>                    ) : addressOption === 'select' ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 mb-3">Selecciona una de tus direcciones guardadas:</p>
                        {addresses.filter(address => !address.predeterminada || address.predeterminada === 'no').map(address => (
                          <div 
                            key={address.id_direccion} 
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedAddressId === address.id_direccion 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-gray-300 hover:border-red-300'
                            }`}
                            onClick={() => {
                              setSelectedAddressId(address.id_direccion);
                              toast.success(`Dirección seleccionada: ${address.calle} ${address.numero}, ${address.distrito}`);
                              // Scroll to top
                              window.scrollTo(0, 0);
                              // Change address option to show the selected address in the profile view
                              setAddressOption('profile');
                            }}
                          >
                            <div className="text-gray-700">
                              <div><span className="font-medium">Calle:</span> {address.calle} {address.numero}</div>
                              <div><span className="font-medium">Distrito:</span> {address.distrito}, {address.ciudad}</div>
                              {address.referencia && (
                                <div className="text-sm text-gray-600">Referencia: {address.referencia}</div>
                              )}
                            </div>
                          </div>
                        ))}
                        {addresses.filter(address => !address.predeterminada || address.predeterminada === 'no').length === 0 && (
                          <div className="text-gray-500 italic text-center py-4">
                            No tienes otras direcciones guardadas además de la predeterminada.
                          </div>
                        )}
                      </div>) : (
                      <div>
                        {/* Formulario para ingresar nueva dirección */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                            <input
                              type="text"
                              name="calle"
                              value={newAddress.calle}
                              onChange={e => setNewAddress({ ...newAddress, calle: e.target.value })}
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: Av. Primavera"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                            <input
                              type="text"
                              name="numero"
                              value={newAddress.numero}
                              onChange={e => setNewAddress({ ...newAddress, numero: e.target.value })}
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: 123"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                            <select
                              name="distrito"
                              value={newAddress.distrito}
                              onChange={e => setNewAddress({ ...newAddress, distrito: e.target.value })}
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">Selecciona un distrito</option>
                              <option value="Santiago">Santiago</option>
                              <option value="San Jeronimo">San Jeronimo</option>
                              <option value="Cusco">Cusco</option>
                              <option value="San Sebastian">San Sebastian</option>
                              <option value="Wanchaq">Wanchaq</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <input
                              type="text"
                              name="ciudad"
                              value={newAddress.ciudad}
                              readOnly
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                              placeholder="Cusco"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                            <input
                              type="text"
                              name="referencia"
                              value={newAddress.referencia}
                              onChange={e => setNewAddress({ ...newAddress, referencia: e.target.value })}
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: Puerta marrón, frente a parque"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>                  <div className="pt-4 flex justify-end space-x-3">
                    {addressOption === 'new' ? (
                      <button
                        type="button"
                        onClick={handleSaveNewAddress}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 mr-3"
                        disabled={creatingAddress}
                      >
                        {creatingAddress ? "Guardando..." : "Guardar dirección"}
                      </button>
                    ) : null}
                    
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Validando..." : "Continuar al pago"}
                    </button>
                  </div>
                </form>
              </div>
            )}{currentStep === 2 && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="mr-3 text-green-700" size={22} />
                  Información de pago
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Mercado Pago como única opción */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Método de pago principal */}
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                          <input 
                            id="mercado-pago" 
                            name="paymentMethod" 
                            type="radio"
                            value="mercado-pago"
                            checked={formData.paymentMethod === 'mercado-pago'}
                            onChange={handleInputChange} 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="mercado-pago" className="ml-3 flex items-center">
                            <img 
                              src="/img/Logos Mercado Pago/Uso digital - RGB/PNGs/MP_RGB_HANDSHAKE_color-azul_hori-izq.png" 
                              alt="Mercado Pago" 
                              className="h-8 w-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                            <span className="hidden text-lg font-semibold text-blue-600">Mercado Pago</span>
                          </label>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>
                        <p className="text-xs text-gray-500">Transacción 100% segura y protegida</p>
                      </div>
                    </div>

                    {/* Métodos incluidos (informativo) */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-700 mb-3">Métodos de pago incluidos:</h3>
                      <div className="space-y-3">
                        {/* Yape */}
                        <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                            YAPE
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Yape</p>
                            <p className="text-xs text-gray-500">Pago inmediato desde tu app</p>
                          </div>
                        </div>

                        {/* Tarjetas */}
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">
                            💳
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Tarjetas de crédito/débito</p>
                            <p className="text-xs text-gray-500">Visa, Mastercard, y más</p>
                          </div>                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setCurrentStep(1)}
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Confirmar pedido"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="mb-6 flex justify-center">
                  <CheckCircle2 size={64} className="text-green-700" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">¡Pedido confirmado!</h2>
                <p className="text-gray-600 mb-8">
                  Gracias por tu compra. Hemos recibido tu pedido y te enviaremos un correo electrónico con los detalles y el estado de tu envío.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold mb-2">Número de pedido: <span className="text-green-700">#{orderId}</span></h3>
                  <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Link to="/products" className="inline-block px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors">
                    Seguir comprando
                  </Link>
                  <Link to="/orders" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                    Ver mis pedidos
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4 pb-4 border-b">Resumen del pedido</h2>
              <div className="space-y-3 max-h-56 overflow-y-auto mb-4">
                {cartItems.map(({ id, product, quantity }) => (
                  <div key={id} className="flex items-center gap-3 py-2">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md border" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Cantidad: {quantity}</p>
                        <p className="text-sm font-medium">
                          S/ {((product.salePrice || product.price) * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span>S/ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Envío</span>
                  <span>{hasStrawberryPackOffer ? <span className="text-green-600 font-semibold">GRATIS</span> : `S/ ${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-lg text-red-600">S/ {orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {currentStep < 3 && (
                <div className="mt-6 pt-4 border-t border-dashed">
                  <div className="flex items-center text-green-700 text-sm mb-1">
                    <Truck size={16} className="mr-2" />
                    <span>Envío en 1-2 horas hábiles</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Todos los pedidos están sujetos a disponibilidad y se procesarán en un plazo de 1 hora.
                  </div>
                </div>
              )}
              {hasStrawberryPackOffer && (
                <div className="text-xs text-green-700 font-semibold mt-1">¡Envío gratis aplicado por tu compra de paquetes de fresas!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;