/**
 * Utilidades para mostrar toast personalizados con mejor feedback
 */
import toast from 'react-hot-toast';

export const showStockToast = {
  success: (productName, quantity = 1) => {
    toast.success(
      `${productName} ${quantity > 1 ? `(${quantity} unidades)` : ''} agregado al carrito`,
      {
        duration: 2000,
        style: {
          background: '#10B981',
          color: 'white',
        },
      }
    );
  },

  stockLimited: (message, availableStock) => {
    toast.error(
      `${message}`,
      {
        duration: 3000,
        style: {
          background: '#F59E0B',
          color: 'white',
        },
      }
    );
  },

  outOfStock: (productName) => {
    toast.error(
      `${productName} está agotado`,
      {
        duration: 2500,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      }
    );
  },

  alreadyAdding: () => {
    toast.error(
      'Ya se está agregando este producto al carrito',
      {
        duration: 1500,
        style: {
          background: '#6B7280',
          color: 'white',
        },
      }
    );
  },

  loginRequired: () => {
    toast.error(
      'Debes iniciar sesión para agregar productos al carrito',
      {
        duration: 3000,
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      }
    );
  }
};

export default showStockToast;
