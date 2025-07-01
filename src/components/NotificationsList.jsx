import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificacionesService from '../services/notificaciones';
import { formatearFechaRelativa, formatearFechaCompleta } from '../utils/dateHelpers';

// Componente para mostrar el icono de tipo de notificación
const NotificationIcon = ({ tipo }) => {
  const getIcon = () => {
    switch (tipo) {
      case 'promocion':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'pedido':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'sistema':
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'alerta':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.726-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5V9a9.5 9.5 0 0 1 19 0v8z" />
          </svg>
        );
    }
  };

  return <div className="flex-shrink-0">{getIcon()}</div>;
};

const NotificationsList = () => {
  const { user, isAuthenticated } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, filter]);

  const loadNotifications = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (filter === 'unread') {
        data = await notificacionesService.getUnreadNotifications();
      } else {
        data = await notificacionesService.getAllNotifications(page);
      }
      
      if (page === 1) {
        setNotificaciones(data);
      } else {
        setNotificaciones(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 20); // Asumiendo 20 items por página
      setCurrentPage(page);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError("Error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificacionesService.marcarComoLeida(id);
      // Actualizar la notificación en el estado local
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id_notificacion === id 
            ? { ...notif, leida: true, read_at: new Date().toISOString() }
            : notif
        )
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };  const handleMarkAllAsRead = async () => {
    try {
      console.log("Marcando todas las notificaciones como leídas...");
      
      // Usar directamente el método alternativo que sabemos que funciona
      await notificacionesService.marcarTodasComoLeidasAlternativo();
      console.log("✅ Todas las notificaciones marcadas como leídas exitosamente");
      
      // Recargar las notificaciones desde el servidor para obtener el estado actualizado
      await loadNotifications(1);
      
      console.log("🔄 Notificaciones recargadas desde el servidor");
      
    } catch (err) {
      console.error("Error al marcar todas las notificaciones como leídas:", err);
      // Mostrar error al usuario
      alert("Error al marcar las notificaciones como leídas. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificacionesService.eliminarNotificacion(id);
      setNotificaciones(prev => prev.filter(notif => notif.id_notificacion !== id));
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      return formatearFechaCompleta(dateString);
    } catch (error) {
      return formatearFechaRelativa(dateString);
    }
  };
  const filteredNotifications = notificaciones.filter(notif => {
    const isUnread = !notif.leida && !notif.read_at && !notif.fecha_lectura;
    const isRead = notif.leida || notif.read_at || notif.fecha_lectura;
    
    if (filter === 'unread') return isUnread;
    if (filter === 'read') return isRead;
    return true; // 'all'
  });

  const unreadCount = notificaciones.filter(notif => 
    !notif.leida && !notif.read_at && !notif.fecha_lectura
  ).length;

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Debes iniciar sesión para ver tus notificaciones.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header con filtros y acciones */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas ({notificaciones.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              No leídas ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leídas ({notificaciones.length - unreadCount})
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="divide-y divide-gray-100">
        {loading && notificaciones.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando notificaciones...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadNotifications()}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Reintentar
            </button>
          </div>        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="text-gray-500 text-lg">
              {filter === 'unread' ? 'No tienes notificaciones sin leer' :
               filter === 'read' ? 'No tienes notificaciones leídas' :
               'No tienes notificaciones'}
            </p>
          </div>) : (
          filteredNotifications.map((notificacion) => {
            const isUnread = !notificacion.leida && !notificacion.read_at && !notificacion.fecha_lectura;
            return (
              <div 
                key={notificacion.id_notificacion}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  isUnread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <NotificationIcon tipo={notificacion.data?.tipo || 'sistema'} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notificacion.mensaje?.tipo || 'Notificación'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {notificacion.mensaje?.contenido || notificacion.data?.mensaje || 'Sin contenido'}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {formatDate(notificacion.fecha_creacion || notificacion.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {isUnread && (
                          <button
                            onClick={() => handleMarkAsRead(notificacion.id_notificacion)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Marcar como leída
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notificacion.id_notificacion)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cargar más */}
      {hasMore && filteredNotifications.length > 0 && (
        <div className="p-6 text-center border-t border-gray-200">
          <button
            onClick={() => loadNotifications(currentPage + 1)}
            disabled={loading}
            className="px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Cargando...' : 'Cargar más notificaciones'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
