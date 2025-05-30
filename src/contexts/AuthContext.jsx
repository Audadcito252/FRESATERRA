import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Efecto para cargar el usuario desde el almacenamiento local al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error al analizar el usuario almacenado:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      // Simulación de inicio de sesión - en una implementación real, aquí harías una llamada a tu API
      // const response = await fetch('http://localhost:8000/api/login', {...});
      
      // Simulación de una respuesta exitosa
      const userData = {
        id: 1,
        name: 'Usuario Demo',
        email: email,
        role: 'user'
      };
      
      // Almacenar el usuario en el estado y en el almacenamiento local
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
      throw err;
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (name, email, password) => {
    try {
      // Simulación de registro - en una implementación real, aquí harías una llamada a tu API
      // const response = await fetch('http://localhost:8000/api/register', {...});
      
      // Simulación de una respuesta exitosa
      const userData = {
        id: Date.now(), // ID provisional para fines de demostración
        name: name,
        email: email,
        role: 'user'
      };
      
      // Almacenar el usuario en el estado y en el almacenamiento local
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError('Error al registrar el usuario.');
      throw err;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };
  // Valor que se proporcionará a través del contexto
  const value = {
    currentUser,
    user: currentUser, // Alias para compatibilidad con componentes existentes
    isAuthenticated: !!currentUser, // Propiedad booleana para verificar autenticación
    login,
    register,
    logout,
    error,
    setError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
