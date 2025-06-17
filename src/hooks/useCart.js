import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  // Transformar datos del backend al formato del frontend
  const transformCartData = useCallback((backendCart) => {
    console.log('Transforming cart data:', backendCart); // Debug log
    
    if (!backendCart) {
      return {
        items: [],
        total: 0,
        count: 0
      };
    }    // Si no hay items o es un array vacío
    if (!backendCart.items || !Array.isArray(backendCart.items) || backendCart.items.length === 0) {
      console.log('No items in cart, returning empty cart');
      return {
        items: [],
        total: 0,
        count: 0
      };
    }const transformedItems = backendCart.items.map(item => {
      // Manejar diferentes estructuras posibles del backend
      const producto = item.producto || item.product;
      
      return {
        id: producto.id_producto.toString(),
        product: {
          id: producto.id_producto.toString(),
          name: producto.nombre || producto.name,
          price: parseFloat(producto.precio || producto.price),
          images: [producto.url_imagen_completa || `/storage/${producto.url_imagen}` || producto.image],
          categoryId: producto.categorias_id_categoria || producto.category_id,
          inStock: producto.estado === 'activo' || producto.status === 'active' || true
        },
        quantity: parseInt(item.cantidad || item.quantity),
        cartItemId: item.id_carrito_items || item.id // ID del item en el carrito para operaciones
      };
    });    // Calcular el total en el frontend basado en los items
    const calculatedTotal = transformedItems.reduce((total, item) => {
      const itemTotal = item.product.price * item.quantity;
      console.log(`Item: ${item.product.name}, Price: ${item.product.price}, Quantity: ${item.quantity}, Subtotal: ${itemTotal}`);
      return total + itemTotal;
    }, 0);

    console.log('Final calculated total:', calculatedTotal);

    return {
      items: transformedItems,
      total: calculatedTotal, // Usar el total calculado en lugar del backend
      count: transformedItems.reduce((total, item) => total + item.quantity, 0)
    };
  }, []);
  // Cargar carrito del backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0, count: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cartService.getCart();
      console.log('Cart response:', response); // Debug log
      
      // Ajustar según la estructura real de la respuesta
      let cartData = null;
      if (response.data && response.data.cart) {
        cartData = response.data.cart;
      } else if (response.data) {
        cartData = response.data;
      } else if (response.cart) {
        cartData = response.cart;
      } else {
        // Si no hay carrito, crear uno vacío
        cartData = { items: [], total: 0 };
      }
      
      const transformedCart = transformCartData(cartData);
      setCart(transformedCart);
    } catch (err) {
      console.error('Error fetching cart:', err);
      // Si es un error 404 (carrito no encontrado), crear carrito vacío
      if (err.response && err.response.status === 404) {
        setCart({ items: [], total: 0, count: 0 });
      } else {
        setError(err.message);
        setCart({ items: [], total: 0, count: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, transformCartData]);
  // Agregar producto al carrito
  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.addToCart(parseInt(product.id), quantity);
      console.log('Add to cart response:', response); // Debug log
      
      await fetchCart(); // Recargar carrito
      toast.success(`${product.name} agregado al carrito`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.response?.data?.message || 'Error al agregar producto al carrito');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);
  // Actualizar cantidad
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!isAuthenticated) return;

    const cartItem = cart?.items.find(item => item.id === productId);
    if (!cartItem) return;

    try {
      setLoading(true);
      if (newQuantity <= 0) {
        await cartService.removeFromCart(cartItem.cartItemId);
      } else {
        await cartService.updateCartItem(cartItem.cartItemId, newQuantity);
      }
      await fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar cantidad');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, cart, fetchCart]);

  // Eliminar del carrito
  const removeFromCart = useCallback(async (productId) => {
    if (!isAuthenticated) return;

    const cartItem = cart?.items.find(item => item.id === productId);
    if (!cartItem) return;

    try {
      setLoading(true);
      await cartService.removeFromCart(cartItem.cartItemId);
      await fetchCart();
      toast.success('Producto eliminado del carrito');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error(err.response?.data?.message || 'Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, cart, fetchCart]);
  // Limpiar carrito (local y backend)
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0, count: 0 });
      return;
    }

    try {
      setLoading(true);
      await cartService.clearCart();
      setCart({ items: [], total: 0, count: 0 });
      console.log('Carrito vaciado exitosamente en frontend y backend');
    } catch (err) {
      console.error('Error vaciando el carrito:', err);
      toast.error(err.response?.data?.message || 'Error al vaciar el carrito');
      // Intentamos refrescar el carrito para mantener la consistencia
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  // Cargar carrito al montar o cuando cambie la autenticación
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    cartItems: cart?.items || [],
    cartTotal: cart?.total || 0,
    cartCount: cart?.count || 0,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  };
};

export default useCart;
