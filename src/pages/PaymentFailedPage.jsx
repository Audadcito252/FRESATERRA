import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CreditCard, RefreshCw, Clock } from 'lucide-react';

const PaymentFailedPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/checkout" className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
              <ArrowLeft size={18} className="mr-2" />
              <span>Volver al checkout</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Estado del Pago</h1>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Incompleto</h2>
              <p className="text-gray-600">
                No hemos recibido confirmación de tu pago desde Mercado Pago.
              </p>
            </div>

            {/* Info Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <Clock size={16} className="mr-2" />
                ¿Qué puede estar pasando?
              </h3>              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Saliste de Mercado Pago antes de completar el pago</li>
                <li>• Tu pago posiblemente fue rechazado</li>
                <li>• Hubo un problema temporal con la conexión</li>
                <li>• Decidiste no completar la transacción</li>
              </ul>
            </div>            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué puedes hacer ahora?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Verificar el estado del pago</h4>
                    <p className="text-sm text-gray-500">Revisa tu cuenta de Mercado Pago o tu correo para confirmar si el pago se procesó.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-green-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Reintentar el pago</h4>
                    <p className="text-sm text-gray-500">Si no se completó, puedes volver a intentar el proceso de pago.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-purple-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Usar otro método</h4>
                    <p className="text-sm text-gray-500">Prueba con una tarjeta diferente o contacta tu banco si hay problemas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/orders" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Clock size={18} className="mr-2" />
                Ver Mis Pedidos
              </Link>
              <Link 
                to="/checkout" 
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw size={18} className="mr-2" />
                Intentar de Nuevo
              </Link>
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>          {/* Important Notice */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Importante</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <p>
                <strong>Si completaste el pago:</strong> Los pagos pueden tardar hasta 24 horas en procesarse.
              </p>
              <p>
                <strong>Si no completaste el pago:</strong> Tu carrito se mantiene guardado. 
                Puedes volver al checkout cuando estés listo para finalizar tu compra.
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h3>
            <p className="text-gray-600 mb-4">
              Si tienes dudas sobre el estado de tu pago o necesitas asistencia, 
              nuestro equipo de soporte está aquí para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:soporte@fresaterra.com" 
                className="inline-flex items-center justify-center px-4 py-2 border border-green-700 text-green-700 hover:bg-green-50 font-medium rounded-lg transition-colors text-sm"
              >
                Contactar Soporte
              </a>
              <a 
                href="tel:+51-999-999-999" 
                className="inline-flex items-center justify-center px-4 py-2 border border-green-700 text-green-700 hover:bg-green-50 font-medium rounded-lg transition-colors text-sm"
              >
                Llamar: +51 929 714 978
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
