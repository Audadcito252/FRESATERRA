import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <XCircle size={64} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pago Fallido</h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, no se pudo procesar tu pago. Por favor, inténtalo de nuevo o prueba con otro método de pago.
        </p>
        <div className="space-y-3">
          <Link 
            to="/checkout" 
            className="w-full inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Intentar de Nuevo
          </Link>
          <Link 
            to="/products" 
            className="w-full inline-block px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
