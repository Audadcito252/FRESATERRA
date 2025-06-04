import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useShoppingCart();
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    paymentMethod: 'mercado-pago'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [addressOption, setAddressOption] = useState('profile'); // 'profile' o 'new'
  const [newAddress, setNewAddress] = useState({
    street: '',
    number: '',
    district: '',
    city: '',
    reference: '',
  });

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
    
    if (currentStep === 2) {
      // Lógica para Mercado Pago
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
      }

      try {
        // Usar el servicio API configurado
        const response = await api.post('/create-preference', { items: itemsForMercadoPago });

        setIsSubmitting(false); // Detener el indicador de carga después de la respuesta

        if (response.init_point) {
          window.location.href = response.init_point;
        } else if (response.sandbox_init_point) { // Para entorno de pruebas
          window.location.href = response.sandbox_init_point;
        } else {
          console.error('No init_point received from Mercado Pago');
          alert('Error: No se recibió el punto de inicio para el pago de Mercado Pago.');
        }
        // No se limpia el carrito ni se avanza al paso 3 aquí.
        // Eso ocurrirá después de la redirección de Mercado Pago.
      } catch (error) {
        setIsSubmitting(false);
        console.error('Error creating Mercado Pago preference:', error);
        
        // Manejar el error con más detalle
        if (error.data) {
          console.error('Error details:', error.data);
          alert(`Error del servidor: ${error.data.error || error.message || 'No se pudo iniciar el pago con Mercado Pago.'}`);
        } else {
          console.error('Network error or other issue with Mercado Pago:', error);
          alert('Error de conexión al intentar procesar el pago con Mercado Pago.');
        }
      }

    } else {
      // Lógica para otros pasos (avanzar al siguiente paso)
      // La generación de orderId, updateProfile y clearCart se movieron de aquí
      // ya que deben ocurrir DESPUÉS de un pago exitoso.
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep(currentStep + 1);
      }, 1500); // Simulación de carga
    }
  };  // Calcular costos adicionales
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
  const orderTotal = cartTotal + shippingCost;

  return (
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
                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={addressOption}
                      onChange={e => setAddressOption(e.target.value)}
                    >
                      <option value="profile">Usar mi dirección predeterminada</option>
                      <option value="new">Ingresar nueva dirección</option>
                    </select>
                    {addressOption === 'profile' ? (
                      <div className="bg-gray-50 p-3 rounded-lg border text-gray-700">
                        <div><span className="font-medium">Calle:</span> {user?.address?.street || ''}</div>
                        <div><span className="font-medium">Número:</span> {user?.address?.number || ''}</div>
                        <div><span className="font-medium">Distrito:</span> {user?.address?.district || ''}</div>
                        <div><span className="font-medium">Ciudad:</span> {user?.address?.city || ''}</div>
                        <div><span className="font-medium">Referencia:</span> {user?.address?.reference || ''}</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                          <input
                            type="text"
                            name="street"
                            value={newAddress.street}
                            onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Av. Primavera"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                          <input
                            type="text"
                            name="number"
                            value={newAddress.number}
                            onChange={e => setNewAddress({ ...newAddress, number: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: 123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                          <select
                            name="district"
                            value={newAddress.district}
                            onChange={e => setNewAddress({ ...newAddress, district: e.target.value })}
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
                            name="city"
                            value={newAddress.city}
                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Lima"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                          <input
                            type="text"
                            name="reference"
                            value={newAddress.reference}
                            onChange={e => setNewAddress({ ...newAddress, reference: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Puerta marrón, frente a parque"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Continuar al pago"}
                    </button>
                  </div>
                </form>
              </div>
            )}            {currentStep === 2 && (
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
                          </div>
                        </div>                        {/* Transferencia bancaria */}
                        <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">
                            🏦
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Transferencia bancaria</p>
                            <p className="text-xs text-gray-500">Transferencia directa a cuenta</p>
                          </div>
                        </div>

                        {/* Otros */}
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">
                            +
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Y muchos más</p>
                            <p className="text-xs text-gray-500">Billeteras digitales y bancos</p>
                          </div>
                        </div>
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