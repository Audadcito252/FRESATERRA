import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSocialAuthCallback } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          toast.error('Error en la autenticación social. Por favor intenta de nuevo.');
          navigate('/login');
          return;
        }

        if (!token) {
          toast.error('No se recibió el token de autenticación.');
          navigate('/login');
          return;
        }

        // Procesar el token y obtener datos del usuario
        await handleSocialAuthCallback(token);
        
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/');
      } catch (error) {
        console.error('Error processing social auth callback:', error);
        toast.error(error.message || 'Error al procesar la autenticación.');
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleSocialAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC0617] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {isProcessing ? 'Procesando autenticación...' : 'Redirigiendo...'}
        </h2>
        <p className="text-gray-600">
          Por favor espera mientras completamos tu inicio de sesión.
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage; 