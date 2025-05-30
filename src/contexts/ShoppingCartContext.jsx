// src/contexts/ShoppingCartContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/cart/api/v1'; // Cambia esto si estás en producción

const ShoppingCartContext = createContext(null);

export const ShoppingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener carrito desde la API
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      const carrito = response.data;

      if (carrito && carrito.items) {
        const items = carrito.items.map(item => ({
          id: item.id_item_carrito,
          product: {
            id: item.producto.id_producto,
            name: item.producto.nombre,
            brand: item.producto.marca,
            price: item.producto.precio,
            salePrice: item.producto.precio_oferta,
            images: [item.producto.imagen], // Asegúrate de tener el campo 'imagen'
          },
          quantity: item.cantidad,
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  const addToCart = async (product, quantity = 1) => {
    try {
      await axios.post(`${API_URL}/`, {
        carritos_id_carrito: 1, // Usar ID fijo o dinámico si tienes login
        productos_id_producto: product.id,
        cantidad: quantity,
      });
      await fetchCart();
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (!item) return;
    try {
      // Opción 1: Actualizar a cantidad 0
      await axios.put(`${API_URL}/${item.id}`, { cantidad: 0 });

      // Opción 2: Si agregas DELETE en tu API:
      // await axios.delete(`${API_URL}/${item.id}`);

      await fetchCart();
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`${API_URL}/${item.id}`, { cantidad: quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const clearCart = async () => {
    for (const item of cartItems) {
      await removeFromCart(item.product.id);
    }
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
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
