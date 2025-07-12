import { useEffect } from 'react';
import api from '../services/api';

export const useMercadoPagoReturn = () => {
  useEffect(() => {
    // Esta función se ejecutará cuando la aplicación se cargue
    const checkForMercadoPagoReturn = async () => {
      console.log('🔍 Verificando estado del pago en Mercado Pago...');
      
      // Verificar si el usuario fue redirigido a Mercado Pago
      const mpRedirectFlag = sessionStorage.getItem('redirectedToMercadoPago');
      const pendingOrderId = sessionStorage.getItem('pendingOrderId');
      
      console.log('📋 Banderas de sessionStorage:', {
        redirectedToMercadoPago: mpRedirectFlag,
        pendingOrderId: pendingOrderId
      });
      
      if (mpRedirectFlag === 'true' && pendingOrderId) {
        console.log(`⚠️ Usuario regresó de MercadoPago para pedido ${pendingOrderId}`);
        
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
          
          // Solo procesar si el pedido está en estado 'pendiente'
          // NO cambiar el estado, solo limpiar las banderas
          if (orderStatus === 'pendiente') {
            console.log(`ℹ️ Pedido ${pendingOrderId} permanece en estado pendiente (pago no completado)`);
          } else if (orderStatus === 'confirmado' || orderStatus === 'completado') {
            console.log(`✅ Pedido ${pendingOrderId} ya fue confirmado/completado`);
          } else {
            console.log(`ℹ️ Pedido ${pendingOrderId} en estado '${orderStatus}'`);
          }        } catch (error) {
          console.error('❌ Error verificando pedido abandonado:', error);
          console.error('📋 Detalles del error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          // Si hay error de autenticación, solo limpiar las banderas
          if (error.response?.status === 401) {
            console.log('🔑 Error de autenticación detectado, pedido permanece en estado pendiente');
            // Ya no intentamos marcar como abandonado, solo limpiamos las banderas
          }
        }finally {
          // Limpiar las banderas de sesión
          console.log('🧹 Limpiando banderas de sessionStorage...');
          sessionStorage.removeItem('redirectedToMercadoPago');
          sessionStorage.removeItem('pendingOrderId');
          console.log('✅ Banderas de sessionStorage limpiadas');
        }
      } else {
        console.log('ℹ️ No se detectaron banderas de retorno de Mercado Pago');
      }
    };
    
    // Agregar un pequeño delay para asegurarse de que la aplicación esté completamente cargada
    const timer = setTimeout(() => {
      checkForMercadoPagoReturn();
    }, 1000); // 1 segundo de delay
    
    return () => clearTimeout(timer);
  }, []);
};
