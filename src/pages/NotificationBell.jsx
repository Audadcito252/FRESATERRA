import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import notificacionesService from '../services/notificaciones';
import { formatearFechaRelativa } from '../utils/dateHelpers';

const NotificationBell = () => {
  const { user, isAuthenticated } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cargar notificaciones no leídas
  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadNotifications();
      // Configurar polling cada 30 segundos para obtener nuevas notificaciones
      const interval = setInterval(loadUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadUnreadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificacionesService.getUnreadNotifications();
      setNotificaciones(data.slice(0, 5)); // Solo mostrar las 5 más recientes
      setUnreadCount(data.length);
    } catch (err) {
      console.error("Error al cargar notificaciones no leídas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificacionesService.marcarComoLeida(id);
      loadUnreadNotifications();
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };
  // Usamos la función importada de utilidades para mantener consistencia
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Para la campanita usamos un formato más compacto
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Ahora';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h`;
      
      return `${Math.floor(diffInHours / 24)}d`;
    } catch (error) {
      return '';
    }
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="relative flex items-center h-full" ref={dropdownRef}>
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-600 hover:text-red-600 transition-colors flex items-center justify-center"
        aria-label="Notificaciones"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        
        {/* Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 sm:max-w-[320px]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-500">{unreadCount} sin leer</span>
              )}
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Cargando...
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5V9a9.5 9.5 0 0 1 19 0v8z" />
                </svg>
                <p className="text-sm">No hay notificaciones nuevas</p>
              </div>
            ) : (
              notificaciones.map((notificacion) => (
                <div 
                  key={notificacion.id_notificacion}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Icono */}
                    <div className="flex-shrink-0 mt-1">
                      {notificacion.data?.tipo === 'promocion' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {notificacion.data?.tipo === 'pedido' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {notificacion.data?.tipo === 'alerta' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {(!notificacion.data?.tipo || notificacion.data?.tipo === 'sistema') && (
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {notificacion.mensaje?.tipo || 'Notificación'}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {notificacion.mensaje?.contenido || notificacion.data?.mensaje || 'Sin contenido'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(notificacion.fecha_creacion || notificacion.created_at)}
                        </span>
                        <button
                          onClick={() => handleMarkAsRead(notificacion.id_notificacion)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Marcar como leída
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>          {/* Footer */}
          {notificaciones.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <Link
                to="/profile"
                className="block text-center text-sm text-red-600 hover:text-red-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;