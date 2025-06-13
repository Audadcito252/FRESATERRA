import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { adminLogin } = useAuth(); // Placeholder for admin login logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
      try {
      // Llamada al endpoint real de admin login
      const response = await api.post('admin/login', { email, password });
        // La respuesta viene directamente en response, no en response.data
      if (response && (response.token || (response.data && response.data.token))) {
        // Intentar obtener los datos del administrador y el token del lugar correcto
        const adminData = response.user || response.data?.user || response;
        const token = response.token || response.data?.token;
        
        // Guardar datos de admin en localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Es importante que adminData sea un objeto antes de stringify. 
        // Si response.data es el objeto de usuario directamente, está bien.
        localStorage.setItem('adminUser', JSON.stringify(adminData)); 
        localStorage.setItem('adminToken', token);
        
        console.log('Admin login successful:', adminData);
        navigate('/admin/notifications');
      } else {
        // Si la respuesta no tiene el token o la estructura esperada pero no es un error HTTP
        const errorMessage = response?.data?.message || response?.message || 'Respuesta de login inválida del servidor. No se recibió token.';
        console.error('Admin login response error:', response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      // Mostrar el mensaje de error de la API si está disponible (ej. error.response.data.message), 
      // o el mensaje de error genérico de la excepción, o un mensaje por defecto.
      const apiErrorMessage = error.response?.data?.message || error.message;
      alert(apiErrorMessage || 'Error al iniciar sesión como administrador. Verifique sus credenciales o intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Admin Login</h2>
        
        {/* Instrucciones temporales */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Para pruebas, usar:</strong><br/>
            Email: admin@fresaterra.com<br/>
            Password: admin123
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
