import { useEffect } from 'react';
import api from '../services/api';

export const useMercadoPagoAbandonment = () => {
  useEffect(() => {
    // Esta función se ejecutará cuando la aplicación se cargue
    const checkForAbandonedCheckout = async () => {
      console.log('🔍 Verificando abandono de Mercado Pago...');
      
      // Verificar si el usuario fue redirigido a Mercado Pago
      const mpRedirectFlag = sessionStorage.getItem('redirectedToMercadoPago');
      const pendingOrderId = sessionStorage.getItem('pendingOrderId');
      
      console.log('📋 Banderas de sessionStorage:', {
        redirectedToMercadoPago: mpRedirectFlag,
        pendingOrderId: pendingOrderId
      });
      
      if (mpRedirectFlag === 'true' && pendingOrderId) {
        console.log(`⚠️ Detectado posible abandono para pedido ${pendingOrderId}`);
        
        try {          // Verificar el estado del pedido
          console.log(`🔄 Consultando estado del pedido ${pendingOrderId}...`);
          const response = await api.get(`/orders/${pendingOrderId}/status`);
          
          // Como el interceptor de API retorna response.data directamente,
          // la respuesta ya es el objeto de datos
          const orderStatus = response.status || response.estado;
          
          console.log('📊 Estado del pedido consultado:', {
            orderId: pendingOrderId,
            currentStatus: orderStatus,
            fullResponse: response
          });
          
          // Solo marcar como abandonado si el pedido está en estado 'pendiente'
          // y NO está en 'confirmado' o 'completado'
          if (orderStatus === 'pendiente') {            console.log(`🚨 Marcando pedido ${pendingOrderId} como abandonado...`);
            const updateResponse = await api.patch(`/orders/${pendingOrderId}/status`, { estado: 'abandonado' });
            console.log('✅ Pedido marcado como abandonado exitosamente:', updateResponse);
          } else if (orderStatus === 'confirmado' || orderStatus === 'completado') {
            console.log(`✅ Pedido ${pendingOrderId} ya fue confirmado/completado, no se marca como abandonado`);
          } else {
            console.log(`ℹ️ Pedido ${pendingOrderId} en estado '${orderStatus}', no se requiere acción`);
          }        } catch (error) {
          console.error('❌ Error verificando pedido abandonado:', error);
          console.error('📋 Detalles del error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
            // Si hay error de autenticación, usar el endpoint especial sin autenticación
          if (error.response?.status === 401) {
            console.log('🔑 Error de autenticación detectado, usando endpoint especial...');            try {
              // Usar el endpoint especial que no requiere autenticación
              const specialResponse = await api.post(`/orders/${pendingOrderId}/mark-abandoned`);
              console.log('✅ Pedido marcado como abandonado via endpoint especial:', specialResponse);
            }catch (secondError) {
              console.error('❌ Error en endpoint especial:', secondError);
            }
          }
        }finally {
          // Limpiar las banderas de sesión
          console.log('🧹 Limpiando banderas de sessionStorage...');
          sessionStorage.removeItem('redirectedToMercadoPago');
          sessionStorage.removeItem('pendingOrderId');
          console.log('✅ Banderas de sessionStorage limpiadas por useMercadoPagoAbandonment');
        }
      } else {
        console.log('ℹ️ No se detectaron banderas de abandono de Mercado Pago');
      }
    };
    
    // Agregar un pequeño delay para asegurarse de que la aplicación esté completamente cargada
    const timer = setTimeout(() => {
      checkForAbandonedCheckout();
    }, 1000); // 1 segundo de delay
    
    return () => clearTimeout(timer);
  }, []);
};
