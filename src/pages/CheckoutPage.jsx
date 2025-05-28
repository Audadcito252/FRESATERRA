import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useShoppingCart();
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    phone: user?.phone || '',
    paymentMethod: 'credit-card'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (currentStep === 2) {
      // Lógica para Mercado Pago
      const itemsForMercadoPago = cartItems.map(item => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: parseFloat(item.product.salePrice || item.product.price),
        description: item.product.description || undefined, // Asegúrate que tu backend maneje 'undefined' o no lo envíe
        // currency_id: 'PEN' // El backend ya debería manejar esto o puedes añadirlo si es necesario
      }));

      try {
        // Asegúrate de que esta URL es la correcta para tu backend de Laravel
        const response = await fetch('http://127.0.0.1:8000/api/v1/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Si tienes autenticación de API, añade el token aquí
            // 'Authorization': `Bearer ${tuTokenDeAutenticacionApi}`,
          },
          body: JSON.stringify({ items: itemsForMercadoPago }),
        });

        setIsSubmitting(false); // Detener el indicador de carga después de la respuesta

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error creating Mercado Pago preference:', errorData);
          alert(`Error del servidor: ${errorData.message || 'No se pudo iniciar el pago con Mercado Pago.'}`);
          return;
        }

        const preference = await response.json();

        if (preference.init_point) {
          window.location.href = preference.init_point;
        } else if (preference.sandbox_init_point) { // Para entorno de pruebas
          window.location.href = preference.sandbox_init_point;
        } else {
          console.error('No init_point received from Mercado Pago');
          alert('Error: No se recibió el punto de inicio para el pago de Mercado Pago.');
        }
        // No se limpia el carrito ni se avanza al paso 3 aquí.
        // Eso ocurrirá después de la redirección de Mercado Pago.

      } catch (error) {
        setIsSubmitting(false);
        console.error('Network error or other issue with Mercado Pago:', error);
        alert('Error de conexión al intentar procesar el pago con Mercado Pago.');
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
  };

  // Calcular costos adicionales
  const shippingCost = 5.99;
  const taxRate = 0.07;
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingCost + taxAmount;

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
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Calle, número, colonia"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Estado"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="12345"
                      />
                    </div>
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
            )}

            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="mr-3 text-green-700" size={22} />
                  Información de pago
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <input 
                        id="credit-card" 
                        name="paymentMethod" 
                        type="radio"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleInputChange} 
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Tarjeta de crédito/débito
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="paypal" 
                        name="paymentMethod" 
                        type="radio"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange} 
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === 'credit-card' && (
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</label>
                          <input
                            type="text"
                            id="expiration"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                        <input
                          type="text"
                          id="cardHolder"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="JUAN PÉREZ"
                        />
                      </div>
                    </div>
                  )}

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
                  <span>S/ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Impuestos</span>
                  <span>S/ {taxAmount.toFixed(2)}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;