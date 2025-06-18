import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const savedAdmin = localStorage.getItem('adminUser');
    const adminToken = localStorage.getItem('adminAuthToken');
    
    if (savedAdmin && adminToken) {
      try {
        setAdminUser(JSON.parse(savedAdmin));
        // Set the admin token in API headers
        api.defaults.headers.common['X-Admin-Authorization'] = `Bearer ${adminToken}`;
      } catch (error) {
        console.error('Error parsing admin data from localStorage:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthToken');
      }
    }
    setIsAdminLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    setIsAdminLoading(true);
    try {
      // TODO: Replace with your actual admin login endpoint
      // For now, we'll simulate a login for testing
      if (email === 'admin@fresaterra.com' && password === 'admin123') {
        const mockAdminUser = {
          id: 1,
          email: email,
          name: 'Administrador',
          role: 'admin'
        };
        const mockToken = 'mock-admin-token-' + Date.now();
        
        setAdminUser(mockAdminUser);
        localStorage.setItem('adminUser', JSON.stringify(mockAdminUser));
        localStorage.setItem('adminAuthToken', mockToken);
        
        // Set the admin token in API headers
        api.defaults.headers.common['X-Admin-Authorization'] = `Bearer ${mockToken}`;
        
        return { success: true, user: mockAdminUser };
      } else {
        throw new Error('Credenciales de administrador inválidas');
      }
      
      // TODO: Uncomment and modify this when you have a real admin login endpoint
      /*
      const response = await api.post('/admin/login', { email, password });
      
      if (response && response.token) {
        const adminUser = response.admin || response.user;
        const token = response.token;
        
        setAdminUser(adminUser);
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminAuthToken', token);
        
        // Set the admin token in API headers
        api.defaults.headers.common['X-Admin-Authorization'] = `Bearer ${token}`;
        
        return { success: true, user: adminUser };
      }
      */
    } catch (error) {
      console.error('Admin login failed:', error);
      throw new Error(error.message || 'Error al iniciar sesión como administrador');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const adminLogout = async () => {
    try {
      // TODO: Call admin logout endpoint if needed
      // await api.post('/admin/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminAuthToken');
      delete api.defaults.headers.common['X-Admin-Authorization'];
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isAdminLoading,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
