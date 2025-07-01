import { createContext, useContext } from 'react';
import useCart from '../hooks/useCart';

const ShoppingCartContext = createContext(null);

export const ShoppingCartProvider = ({ children }) => {
  const cartData = useCart();

  return (
    <ShoppingCartContext.Provider value={cartData}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};