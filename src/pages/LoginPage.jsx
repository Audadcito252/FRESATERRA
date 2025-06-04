import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');    } catch (error) {
      console.error('Login error:', error);
      
      // Verificar si es error de cuenta desactivada
      if (error.message && error.message.includes('desactivada')) {
        toast.error(
          'Tu cuenta ha sido desactivada. Por favor, contacta al soporte para reactivarla.',
          {
            duration: 6000,
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA'
            }
          }
        );
      } else if (error.status === 403) {
        // Error 403 del backend cuando la cuenta está desactivada
        toast.error(
          'Tu cuenta ha sido desactivada. Por favor, contacta al soporte para reactivarla.',
          {
            duration: 6000,
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA'
            }
          }
        );
      } else if (error.status === 401) {
        // Credenciales incorrectas
        toast.error('Correo o contraseña incorrectos. Por favor intenta de nuevo.');
      } else {
        // Cualquier otro error
        toast.error(error.message || 'Error al iniciar sesión. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      toast.success('¡Inicio de sesión con Google exitoso!');
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Error al iniciar sesión con Google. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] py-16 px-4 pt-32 md:pt-40">
      <div className="container w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg my-5">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-1 text-center">Iniciar sesión</h1>
          <p className="text-sm text-center text-gray-500 mb-6">O <Link to="/register" className="text-[#EC0617]">crea una cuenta nueva</Link></p>        
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-5">
              <label htmlFor="email" className="block text-black mb-2 font-medium">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className="w-full p-3 pl-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="ejemplo@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group mb-5">
              <label htmlFor="password" className="block text-black mb-2 font-medium">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full p-3 pl-10 pr-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="Tu contraseña"
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

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#EC0617] focus:ring-[#EC0617] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recuérdame
                </label>
              </div>

              <div className="text-sm">
                <Link to="/reset-password" className="text-[#EC0617] font-semibold no-underline hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
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
                  Iniciando sesión...
                </span>
              ) : 'Iniciar sesión'}
            </button>

            <div className="divider flex items-center my-5">
              <div className="flex-1 h-[1px] bg-[#ddd]"></div>
              <span className="px-2.5 text-[#777] text-sm">O</span>
              <div className="flex-1 h-[1px] bg-[#ddd]"></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="google-btn flex items-center justify-center w-full p-3 bg-white border border-[#ddd] rounded text-base cursor-pointer transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMC42NiAxMi42OWMwLS41Ny0uMDUtMS4xMi0uMTUtMS42N0gxMnYzLjE2aDQuODRhNC4xNCA0LjE0IDAgMCAxLTEuNzkgMi43djIuMjVoMi45YTguNzcgOC43NyAwIDAgMCAyLjcxLTYuNDR6IiBmaWxsPSIjNDI4NUY0Ii8+PHBhdGggZD0iTTEyIDIxYzIuNDMgMCA0LjQ3LS44IDUuOTUtMi4xOGwtMi45LTIuMjVjLS44LjU0LTEuODMuODYtMy4wNS44Ni0yLjM1IDAtNC4zNC0xLjU5LTUuMDUtMy43M0gzLjk1djIuMzJBOC45OTcgOC45OTcgMCAwIDAgMTIgMjF6IiBmaWxsPSIjMzRBODUzIi8+PHBhdGggZD0iTTYuOTUgMTMuMmMtLjE4LS41NC0uMjgtMS4xMy0uMjgtMS43MnMuMS0xLjE4LjI4LTEuNzJWNy40NEgzLjk1QTguOTk2IDguOTk2IDAgMCAwIDMgMTIuMDFjMCAxLjYuMzkgMy4xIDEuMDYgNC40MmwyLjg5LTIuMjN6IiBmaWxsPSIjRkJCQzA1Ii8+PHBhdGggZD0iTTEyIDYuNThjMS4zMiAwIDIuNS40NSAzLjQ0IDEuMzVsMi41OC0yLjU4QzE2LjQ2IDMuODkgMTQuNDMgMyAxMiAzQTguOTk3IDguOTk3IDAgMCAwIDMuOTUgNy40NGwyLjg5IDIuMjVDNy42NiA4LjE0IDkuNjUgNi41OCAxMiA2LjU4eiIgZmlsbD0iI0VBNDMzNSIvPjxwYXRoIGQ9Ik0zIDNoMTh2MThoLTE4eiIvPjwvZz48L3N2Zz4="
                alt="Google"
                className="mr-2.5 w-5 h-5"
              />
              Iniciar sesión con Google
            </button>

            <div className="register-link text-center mt-5 text-sm text-[#555]">
              ¿No tienes una cuenta? <Link to="/register" className="text-[#EC0617] font-semibold no-underline hover:underline">Registrarse</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;