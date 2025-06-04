import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import NotificationsList from '../components/NotificationsList';

const NotificationsPage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
          <p className="text-gray-600">Mantente al día con todas tus notificaciones</p>
        </div>
        
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationsPage;
