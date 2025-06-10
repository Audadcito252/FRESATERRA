import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificacionesService from '../services/notificaciones';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar notificaciones del usuario
  const loadNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificacionesService.getUserNotifications(params);
      setNotifications(response.datos || []);
      
      // Contar no leídas
      const unread = (response.datos || []).filter(n => n.estado === 'no_leida').length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Cargar solo notificaciones no leídas
  const loadUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await notificacionesService.getUnreadNotifications();
      const unreadNotifications = response.datos || [];
      setUnreadCount(unreadNotifications.length);
      return unreadNotifications;
    } catch (err) {
      console.error('Error al cargar notificaciones no leídas:', err);
      return [];
    }
  }, [isAuthenticated, user]);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificacionesService.marcarComoLeida(notificationId);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id_notificacion === notificationId 
            ? { ...notification, estado: 'leida' }
            : notification
        )
      );
      
      // Actualizar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success('Notificación marcada como leída');
    } catch (err) {
      console.error('Error al marcar como leída:', err);
      toast.error('Error al marcar la notificación como leída');
    }
  }, []);

  // Marcar notificación como no leída
  const markAsUnread = useCallback(async (notificationId) => {
    try {
      await notificacionesService.marcarComoNoLeida(notificationId);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id_notificacion === notificationId 
            ? { ...notification, estado: 'no_leida' }
            : notification
        )
      );
      
      // Actualizar contador
      setUnreadCount(prev => prev + 1);
      
      toast.success('Notificación marcada como no leída');
    } catch (err) {
      console.error('Error al marcar como no leída:', err);
      toast.error('Error al marcar la notificación como no leída');
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await notificacionesService.marcarTodasComoLeidas();
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, estado: 'leida' }))
      );
      setUnreadCount(0);
      
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
      toast.error('Error al marcar todas las notificaciones como leídas');
    }
  }, [user]);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificacionesService.deleteUserNotification(notificationId);
      
      // Actualizar estado local
      const deletedNotification = notifications.find(n => n.id_notificacion === notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id_notificacion !== notificationId)
      );
      
      // Actualizar contador si era no leída
      if (deletedNotification && deletedNotification.estado === 'no_leida') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notificación eliminada');
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      toast.error('Error al eliminar la notificación');
    }
  }, [notifications]);

  // Obtener estadísticas
  const getStats = useCallback(async () => {
    try {
      const stats = await notificacionesService.getNotificationStats();
      return stats;
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      return null;
    }
  }, []);

  // Actualizar automáticamente cada cierto tiempo
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Cargar notificaciones iniciales
    loadNotifications();

    // Configurar actualización automática cada 5 minutos
    const interval = setInterval(() => {
      loadUnreadNotifications();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated, user, loadNotifications, loadUnreadNotifications]);

  // Función para refrescar manualmente
  const refresh = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Función para obtener notificaciones por tipo
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notification => 
      notification.mensaje?.tipo === type
    );
  }, [notifications]);

  // Función para obtener notificaciones recientes (últimas 24 horas)
  const getRecentNotifications = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.fecha_creacion);
      return notificationDate >= yesterday;
    });
  }, [notifications]);

  return {
    // Estado
    notifications,
    unreadCount,
    loading,
    error,
    
    // Acciones
    loadNotifications,
    loadUnreadNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    refresh,
    
    // Utilidades
    getStats,
    getNotificationsByType,
    getRecentNotifications,
    
    // Estado derivado
    hasUnread: unreadCount > 0,
    isEmpty: notifications.length === 0
  };
};

export default useNotifications;