import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  // Estados para manejar los valores del formulario
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect para hacer scroll hacia arriba al entrar a la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validación simple de contraseñas
    if (password === '' || confirmPassword === '') {
      setError('Por favor, ingresa ambas contraseñas.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    // Simulación de procesamiento
    setTimeout(() => {
      // Si todo es correcto, reseteamos el formulario y mostramos un mensaje de éxito
      setError('');
      toast.success('Contraseña restablecida con éxito.');
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] py-16 px-4 mt-10 md:mt-12">
      <div className="container w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg my-5">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-1 text-center">Restablecer Contraseña</h1>
          <p className="text-sm text-center text-gray-500 mb-6">Ingresa tu nueva contraseña</p>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">{error}</div>}
          
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group mb-5">
              <label htmlFor="password" className="block text-black mb-2 font-medium">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full p-3 pl-10 pr-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group mb-8">
              <label htmlFor="confirmPassword" className="block text-black mb-2 font-medium">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full p-3 pl-10 pr-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full py-3.5 px-4 bg-[#EC0617] text-white border-none rounded text-base font-semibold cursor-pointer transition-colors hover:bg-[#c00513] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Restableciendo...
                </span>
              ) : 'Restablecer Contraseña'}
            </button>

            <div className="login-link text-center mt-5 text-sm text-[#555]">
              <Link to="/login" className="text-[#EC0617] font-semibold no-underline hover:underline">Volver a Inicio de Sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
