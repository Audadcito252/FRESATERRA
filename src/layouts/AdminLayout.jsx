import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

// Simple Admin Protected Route Logic (can be expanded)
const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null; // Or a loading spinner
  }

  return children;
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-gray-800 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/admin/notifications" className="text-xl font-bold hover:text-red-300">
              Panel de Administración FRESATERRA
            </Link>
            <nav>
              {/* Add more admin navigation links here if needed */}
              <Link to="/admin/notifications" className="px-3 py-2 rounded hover:bg-gray-700">
                Notificaciones
              </Link>
              {/* Example: <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-gray-700">Usuarios</Link> */}
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4">
          <Outlet />
        </main>
        <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
          &copy; {new Date().getFullYear()} FRESATERRA Admin
        </footer>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminLayout;
