import api from './api';

/**
 * Servicio para manejo de inventario y stock
 */
const stockService = {
  /**
   * Verificar disponibilidad de stock para múltiples productos
   * @param {Array} items - Array de objetos con {producto_id, cantidad}
   * @returns {Promise} Respuesta con información de disponibilidad
   */
  checkStock: async (items) => {
    try {
      const response = await api.post('/products/check-stock', {
        items: items
      });
      
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error('Respuesta inválida del backend');
      }
    } catch (error) {
      console.error('Error verificando stock:', error);
      
      // Si falla la verificación, devolver un formato compatible
      return {
        success: false,
        data: {
          available: false,
          details: items.map(item => ({
            producto_id: item.producto_id,
            cantidad_solicitada: item.cantidad,
            cantidad_disponible: 0,
            disponible: false,
            producto_nombre: 'Producto no encontrado'
          }))
        }
      };
    }
  },

  /**
   * Obtener información de stock para un producto específico
   * @param {number} productId - ID del producto
   * @returns {Promise} Información de stock del producto
   */
  getStockInfo: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/stock`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo información de stock:', error);
      throw error;
    }
  },

  /**
   * Verificar si un producto tiene stock suficiente para una cantidad
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad solicitada
   * @returns {Promise} true si hay stock suficiente, false si no
   */
  isStockAvailable: async (productId, quantity) => {
    try {
      const stockInfo = await stockService.getStockInfo(productId);
      return stockInfo.data && 
             stockInfo.data.en_stock && 
             stockInfo.data.cantidad_disponible >= quantity;
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return false;
    }
  },

  /**
   * Verificar stock antes de agregar al carrito
   * @param {Object} product - Objeto del producto
   * @param {number} quantity - Cantidad a agregar
   * @param {number} currentCartQuantity - Cantidad actual en el carrito (opcional)
   * @returns {Promise} Objeto con resultado de la verificación
   */
  checkStockBeforeAddToCart: async (product, quantity, currentCartQuantity = 0) => {
    try {
      const totalQuantity = quantity + currentCartQuantity;
      
      // Si el producto ya tiene información de stock, usarla primero
      if (product.en_stock !== undefined && product.cantidad_disponible !== undefined) {
        const available = product.cantidad_disponible;
        
        if (!product.en_stock || available < totalQuantity) {
          const maxCanAdd = Math.max(0, available - currentCartQuantity);
          
          return {
            success: false,
            message: maxCanAdd > 0 
              ? `Solo puedes agregar ${maxCanAdd} unidades más. Stock disponible: ${available}`
              : `Producto agotado. Stock disponible: ${available}`
          };
        }

        return {
          success: true,
          message: 'Stock disponible'
        };
      }
      
      // Si no tiene información de stock en el producto, usar el endpoint
      const stockCheck = await stockService.checkStock([{
        producto_id: product.id,
        cantidad: totalQuantity
      }]);

      const productStock = stockCheck.data?.details?.[0];
      
      if (!productStock) {
        return {
          success: false,
          message: 'No se pudo verificar el stock del producto'
        };
      }

      if (!productStock.disponible) {
        const available = productStock.cantidad_disponible || 0;
        const maxCanAdd = Math.max(0, available - currentCartQuantity);
        
        return {
          success: false,
          message: maxCanAdd > 0 
            ? `Solo puedes agregar ${maxCanAdd} unidades más. Stock disponible: ${available}`
            : `Producto agotado. Stock disponible: ${available}`
        };
      }

      return {
        success: true,
        message: 'Stock disponible'
      };
    } catch (error) {
      console.error('Error verificando stock antes de agregar al carrito:', error);
      return {
        success: false,
        message: 'Error al verificar disponibilidad del producto'
      };
    }
  },

  /**
   * Verificar stock completo del carrito antes del checkout
   * @param {Array} cartItems - Items del carrito
   * @returns {Promise} Resultado de la verificación completa
   */
  checkCartStock: async (cartItems) => {
    try {
      if (!cartItems || cartItems.length === 0) {
        return {
          success: true,
          message: 'Carrito vacío'
        };
      }

      const items = cartItems.map(item => {
        const productoId = item.product?.id || item.id;
        return {
          producto_id: parseInt(productoId),
          cantidad: item.quantity
        };
      });
      
      const response = await api.post('/products/check-stock', { items });
      const stockCheck = response.data;
      
      const isAvailable = stockCheck.available === true;
      
      if (!isAvailable) {
        const unavailableItems = stockCheck.details?.filter(item => !item.disponible) || [];
        
        return {
          success: false,
          message: 'Algunos productos no tienen stock suficiente',
          unavailableItems,
          details: stockCheck.details
        };
      }

      return {
        success: true,
        message: 'Stock verificado correctamente',
        details: stockCheck.details
      };
    } catch (error) {
      console.error('Error verificando stock del carrito:', error);
      return {
        success: false,
        message: 'Error al verificar el stock del carrito'
      };
    }
  }
};

export default stockService;
