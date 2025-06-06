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

  // Cargar notificaciones al inicializar
  useEffect(() => {
    if (isAuthenticated) {
      loadNotificaciones();
    }
  }, [isAuthenticated, filter]);

  // Cargar notificaciones desde la API
  const loadNotificaciones = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (filter) {
        case 'unread':
          data = await notificacionesService.getUnreadNotifications();
          break;
        case 'read':
          const allNotifications = await notificacionesService.getUserNotifications();
          data = allNotifications.filter(n => n.read_at !== null);
          break;
        default:
          data = await notificacionesService.getUserNotifications();
      }
      
      console.log("Notificaciones recibidas:", data);
      setNotificaciones(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError("No se pudieron cargar las notificaciones");
      setLoading(false);
    }
  };

  // Marcar notificación como leída
  const handleMarkAsRead = async (id) => {
    try {
      await notificacionesService.marcarComoLeida(id);
      // Recargar notificaciones para reflejar el cambio
      loadNotificaciones();
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
      alert("No se pudo marcar la notificación como leída");
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await notificacionesService.marcarTodasComoLeidas();
      loadNotificaciones();
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
      alert("No se pudieron marcar todas las notificaciones como leídas");
    }
  };

  // Eliminar notificación
  const handleDeleteNotification = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      try {
        await notificacionesService.eliminarNotificacion(id);
        loadNotificaciones();
      } catch (err) {
        console.error("Error al eliminar notificación:", err);
        alert("No se pudo eliminar la notificación");
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Hace un momento';
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-700">Inicia sesión para ver tus notificaciones</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Cargando notificaciones...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const unreadCount = notificaciones.filter(n => !n.read_at).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 && (
                  <span className="text-red-600 font-medium">
                    {unreadCount} sin leer
                  </span>
                )}
                {unreadCount === 0 && "Todas las notificaciones están al día"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas ({notificaciones.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sin leer ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leídas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-4">
        {notificaciones.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5V9a9.5 9.5 0 0 1 19 0v8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No hay notificaciones</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'unread' && "No tienes notificaciones sin leer"}
              {filter === 'read' && "No tienes notificaciones leídas"}
              {filter === 'all' && "No tienes notificaciones"}
            </p>
          </div>
        ) : (
          notificaciones.map((notificacion) => (
            <div 
              key={notificacion.id_notificacion}
              className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
                !notificacion.read_at 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icono de tipo */}
                  <NotificationIcon tipo={notificacion.data?.tipo || 'sistema'} />
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          !notificacion.read_at ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notificacion.mensaje?.tipo || 'Notificación'}
                        </h3>
                        <p className={`mt-1 ${
                          !notificacion.read_at ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notificacion.mensaje?.contenido || notificacion.data?.mensaje || 'Sin contenido'}
                        </p>
                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <span>{formatDate(notificacion.fecha_creacion || notificacion.created_at)}</span>
                          {!notificacion.read_at && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notificacion.read_at && (
                          <button
                            onClick={() => handleMarkAsRead(notificacion.id_notificacion)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            title="Marcar como leída"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notificacion.id_notificacion)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          title="Eliminar notificación"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsList;