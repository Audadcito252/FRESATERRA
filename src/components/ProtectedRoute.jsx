import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);

  // Mostrar spinner solo después de un pequeño delay para evitar flashes
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowSpinner(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [isLoading]);

  // Si está cargando y hemos esperado lo suficiente, mostrar spinner
  if (isLoading && showSpinner) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, redirigir al login
  if (!isLoading && !user) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    console.log('Current location:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay usuario o aún está cargando (sin mostrar spinner), permitir acceso
  if (user) {
    console.log('ProtectedRoute: User authenticated, allowing access to:', location.pathname);
    return children;
  }

  // Durante la carga inicial (sin spinner), no renderizar nada
  return null;
};

export default ProtectedRoute;
