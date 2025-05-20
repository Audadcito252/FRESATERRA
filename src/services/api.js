import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Ajusta esto a tu URL de Laravel

// Crear una instancia de axios
// con la URL base de la API de Laravel
const api = axios.create({
    baseURL: API_URL,
    //withCredentials: true, // Importante para cookies/CSRF
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Opcional: redirigir al login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;