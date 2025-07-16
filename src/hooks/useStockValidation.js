import { useCallback, useMemo } from 'react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

/**
 * Hook personalizado para validar stock de productos
 * Proporciona validaciones inmediatas y coherentes en toda la aplicación
 */
const useStockValidation = () => {
  const { cart } = useShoppingCart();

  /**
   * Valida si se puede agregar una cantidad específica de un producto al carrito
   * @param {Object} product - Objeto producto con información de stock
   * @param {number} requestedQuantity - Cantidad que se quiere agregar
   * @returns {Object} { isValid, message, maxAllowed }
   */
  const validateAddToCart = useCallback((product, requestedQuantity = 1) => {
    // Información de stock del producto
    const availableStock = product.cantidad_disponible || product.stock || 0;
    const isInStock = product.en_stock !== undefined ? product.en_stock : product.inStock;
    
    // Cantidad actual en el carrito para este producto
    const currentCartItem = cart?.items?.find(item => item.id === product.id);
    const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
    
    // Validaciones
    if (!isInStock) {
      return {
        isValid: false,
        message: 'Producto agotado',
        maxAllowed: 0
      };
    }
    
    if (availableStock <= 0) {
      return {
        isValid: false,
        message: 'No hay stock disponible',
        maxAllowed: 0
      };
    }
    
    const totalQuantityRequested = currentCartQuantity + requestedQuantity;
    
    if (totalQuantityRequested > availableStock) {
      const remaining = availableStock - currentCartQuantity;
      
      if (remaining <= 0) {
        return {
          isValid: false,
          message: 'Ya tienes el máximo disponible en tu carrito',
          maxAllowed: 0
        };
      } else {
        return {
          isValid: false,
          message: `Solo puedes agregar ${remaining} unidad${remaining !== 1 ? 'es' : ''} más. Stock disponible: ${availableStock}`,
          maxAllowed: remaining
        };
      }
    }
    
    return {
      isValid: true,
      message: 'Producto disponible para agregar',
      maxAllowed: availableStock - currentCartQuantity
    };
  }, [cart]);

  /**
   * Obtiene el estado del stock de un producto
   * @param {Object} product - Objeto producto
   * @param {boolean} showQuantity - Si debe mostrar la cantidad específica o mensaje genérico
   * @returns {Object} Estado del stock con información visual
   */
  const getStockStatus = useCallback((product, showQuantity = true) => {
    const availableStock = product.cantidad_disponible || product.stock || 0;
    const isInStock = product.en_stock !== undefined ? product.en_stock : product.inStock;
    
    if (!isInStock || availableStock <= 0) {
      return {
        status: 'out-of-stock',
        text: 'Sin stock',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        available: 0
      };
    }
    
    if (availableStock <= 3) {
      return {
        status: 'low-stock',
        text: showQuantity ? `Últimas ${availableStock} unidades` : `Stock limitado`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        available: availableStock
      };
    }
    
    if (availableStock <= 10) {
      return {
        status: 'medium-stock',
        text: showQuantity ? `Stock limitado (${availableStock} unidades)` : `Stock limitado`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        available: availableStock
      };
    }
    
    return {
      status: 'in-stock',
      text: 'En stock',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      available: availableStock
    };
  }, []);

  /**
   * Verifica si un producto puede ser agregado al carrito
   * @param {Object} product - Objeto producto
   * @returns {boolean} true si el producto puede ser agregado
   */
  const canAddToCart = useCallback((product) => {
    const validation = validateAddToCart(product, 1);
    return validation.isValid;
  }, [validateAddToCart]);

  /**
   * Obtiene la cantidad máxima que se puede agregar de un producto
   * @param {Object} product - Objeto producto
   * @returns {number} Cantidad máxima disponible
   */
  const getMaxAvailable = useCallback((product) => {
    const validation = validateAddToCart(product, 1);
    return validation.maxAllowed;
  }, [validateAddToCart]);

  return {
    validateAddToCart,
    getStockStatus,
    canAddToCart,
    getMaxAvailable
  };
};

export default useStockValidation;
