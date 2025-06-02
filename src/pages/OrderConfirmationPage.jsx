import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 pt-24">      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-600">Gracias por tu compra</p>
          <p className="text-gray-500 mt-1">ID del Pedido: {id}</p>
        </div>        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Qué sigue ahora?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Rastrear tu Pedido</h3>
                <p className="text-sm text-gray-500">Puedes seguir el estado de tu pedido en tu panel de usuario.</p>
              </div>
            </div>
          </div>
        </div>        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/orders"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Ver Pedidos
          </a>          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#EC0617] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Seguir Comprando
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;