import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const PaymentPendingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-200 p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <AlertTriangle size={64} className="text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pago Pendiente</h1>
        <p className="text-gray-600 mb-6">
          Tu pago está actualmente pendiente de confirmación.
        </p>
        <p className="text-gray-600 mb-8">
          Recibirás una notificación una vez que el pago haya sido procesado. Si elegiste un método de pago en efectivo, por favor sigue las instrucciones proporcionadas para completarlo.
        </p>
        <div className="space-y-3">
          <Link 
            to="/orders" 
            className="w-full inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
          >
            Ver Mis Pedidos
          </Link>
          <Link 
            to="/" 
            className="w-full inline-block px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;
