import { useState, useEffect, useCallback } from 'react';
import stockService from '../services/stockService';
import toast from 'react-hot-toast';

const useStockVerification = (cartItems = []) => {
  const [stockIssues, setStockIssues] = useState([]);
  const [checkingStock, setCheckingStock] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  // Verificar stock completo del carrito
  const checkCartStock = useCallback(async (showToasts = false) => {
    if (!cartItems || cartItems.length === 0) {
      setStockIssues([]);
      return { success: true, message: 'Carrito vacío' };
    }

    try {
      setCheckingStock(true);
      
      const items = cartItems.map(item => ({
        producto_id: item.id,
        cantidad: item.quantity
      }));

      const stockCheck = await stockService.checkStock(items);
      
      if (!stockCheck.data?.available) {
        const unavailableItems = stockCheck.data?.details?.filter(item => !item.disponible) || [];
        setStockIssues(unavailableItems);
        
        if (showToasts) {
          toast.error('Algunos productos no tienen stock suficiente');
          unavailableItems.forEach(item => {
            toast.error(`${item.producto_nombre}: Solo ${item.cantidad_disponible} disponibles`);
          });
        }
        
        return {
          success: false,
          message: 'Algunos productos no tienen stock suficiente',
          unavailableItems,
          details: stockCheck.data?.details
        };
      }

      setStockIssues([]);
      setLastCheckTime(new Date());
      
      if (showToasts) {
        toast.success('Stock verificado correctamente');
      }
      
      return {
        success: true,
        message: 'Stock verificado correctamente',
        details: stockCheck.data?.details
      };
    } catch (error) {
      console.error('Error verificando stock del carrito:', error);
      
      if (showToasts) {
        toast.error('Error al verificar el stock del carrito');
      }
      
      return {
        success: false,
        message: 'Error al verificar el stock del carrito'
      };
    } finally {
      setCheckingStock(false);
    }
  }, [cartItems]);

  // Verificar stock individual de un producto
  const checkProductStock = useCallback(async (productId, quantity) => {
    try {
      const stockCheck = await stockService.checkStock([{
        producto_id: productId,
        cantidad: quantity
      }]);

      const productStock = stockCheck.data?.details?.[0];
      
      if (!productStock?.disponible) {
        const available = productStock?.cantidad_disponible || 0;
        return {
          success: false,
          message: `Solo hay ${available} unidades disponibles`,
          available
        };
      }

      return {
        success: true,
        message: 'Stock disponible'
      };
    } catch (error) {
      console.error('Error verificando stock del producto:', error);
      return {
        success: false,
        message: 'Error al verificar disponibilidad del producto'
      };
    }
  }, []);

  // Verificar si un producto específico tiene problemas de stock
  const getProductStockIssue = useCallback((productId) => {
    return stockIssues.find(issue => issue.producto_id === productId);
  }, [stockIssues]);

  // Verificar automáticamente cuando cambian los items del carrito
  useEffect(() => {
    if (cartItems.length > 0) {
      // Debounce para evitar muchas verificaciones
      const timeoutId = setTimeout(() => {
        checkCartStock(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setStockIssues([]);
    }
  }, [cartItems, checkCartStock]);

  return {
    stockIssues,
    checkingStock,
    lastCheckTime,
    checkCartStock,
    checkProductStock,
    getProductStockIssue,
    hasStockIssues: stockIssues.length > 0
  };
};

export default useStockVerification;
