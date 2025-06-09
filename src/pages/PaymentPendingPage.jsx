import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import paymentsService from '../services/paymentsService';
import toast from 'react-hot-toast';

const PaymentPendingPage = () => {
  const [searchParams] = useSearchParams();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  useEffect(() => {
    // Actualizar estados automáticamente cuando se carga la página
    const updatePaymentStatus = async () => {
      try {
        setIsUpdatingStatus(true);
        
        // Obtener parámetros de Mercado Pago desde la URL
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const paymentType = searchParams.get('payment_type');
        
        if (orderId) {
          console.log('Actualizando estado de pago pendiente para pedido:', orderId);
          
          // Llamar al endpoint para actualizar los estados
          const response = await paymentsService.updateStatusFromMercadoPago({
            order_id: parseInt(orderId),
            payment_status: 'pending', // Pago pendiente
            payment_id: paymentId,
            payment_type: paymentType
          });
          
          console.log('Estados actualizados:', response);
          setStatusUpdated(true);
          
          toast.info('Pago pendiente. Los estados han sido actualizados.');
        } else {
          console.warn('No se encontró order_id en los parámetros de la URL');
        }
      } catch (error) {
        console.error('Error actualizando estados:', error);
        toast.error('Error al actualizar el estado del pago. Contacta al soporte.');
      } finally {
        setIsUpdatingStatus(false);
      }
    };
    
    // Solo actualizar si no se ha hecho ya
    if (!statusUpdated && !isUpdatingStatus) {
      updatePaymentStatus();
    }
  }, [searchParams, statusUpdated, isUpdatingStatus]);
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
