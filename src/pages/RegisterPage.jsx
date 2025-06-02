import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Add phone to errors state
    password: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const checkPasswordStrength = (password) => {
    if (!password) {
      return '';
    }
    
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (strength <= 2) {
      return 'strength-weak';
    } else if (strength <= 4) {
      return 'strength-medium';
    } else {
      return 'strength-strong';
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'El nombre es obligatorio' : '';
      case 'lastName':
        return !value.trim() ? 'El apellido es obligatorio' : '';
      case 'email':
        return !value || !value.includes('@') || !value.includes('.') 
          ? 'Por favor ingresa un correo electrónico válido' : '';
      case 'phone': // Add phone validation
        if (!value) return 'El teléfono es obligatorio';
        const phoneRegex = /^9\d{8}$/; // Peruvian phone: 9 digits, starts with 9
        return !phoneRegex.test(value) ? 'El número de teléfono no es válido (ej: 987654321)' : '';
      case 'password':
        const hasLength = value.length >= 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        // Calcula la fuerza de la contraseña para validarla
        const strength = [hasLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
        
        // Solo validamos si la contraseña es muy débil (nivel <= 2)
        // Permitimos contraseñas de nivel medio (naranja) o fuerte
        if (strength <= 2) {
          return 'La contraseña no cumple con los requisitos mínimos';
        }
        return '';
      case 'confirmPassword':
        return value !== formData.password ? 'Las contraseñas no coinciden' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));

    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== (name === 'password' ? value : formData.password) 
          ? 'Las contraseñas no coinciden' : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone), // Validate phone
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
      
    };

    setErrors(newErrors);

    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsLoading(true);
    try {
      // Pasar el nombre, apellido y teléfono como parámetros separados a register
      await register(formData.email, formData.password, formData.firstName, formData.lastName, formData.phone);
      toast.success('¡Registro exitoso!');
      navigate('/');
    } catch (error) {
      toast.error('Error al crear la cuenta');
      console.error('Error de registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] py-16 px-4 mt-10 md:mt-12">
      <div className="container w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg my-5">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-1 text-center">Crear una cuenta</h1>
          <p className="text-sm text-center text-gray-500 mb-6">O <Link to="/login" className="text-[#EC0617]">inicia sesión en tu cuenta</Link></p>
        
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-row flex gap-4 mb-5">
              <div className="form-group flex-1">
                <label htmlFor="firstName" className="block text-black mb-2 font-medium">
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full p-3 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="error-message text-[#EC0617] text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="form-group flex-1">
                <label htmlFor="lastName" className="block text-black mb-2 font-medium">
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full p-3 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="error-message text-[#EC0617] text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                  autoComplete="email"
                  required
                  className="w-full p-3 pl-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="ejemplo@dominio.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="form-group mb-5">
              <label htmlFor="phone" className="block text-black mb-2 font-medium">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  // required // Será obligatorio después
                  className="w-full p-3 pl-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="987654321"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.phone}</p>
              )}
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
                  autoComplete="new-password"
                  required
                  className="w-full p-3 pl-10 pr-10 border border-[#ddd] rounded text-base focus:outline-none focus:border-[#EC0617] transition-all"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
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
              <div className={`password-strength flex mt-2 h-[5px] ${passwordStrength}`}>
                <div className="strength-segment flex-1 mr-[5px] bg-[#ddd] rounded-sm transition-colors"></div>
                <div className="strength-segment flex-1 mr-[5px] bg-[#ddd] rounded-sm transition-colors"></div>
                <div className="strength-segment flex-1 bg-[#ddd] rounded-sm transition-colors"></div>
              </div>
              <p className="password-requirements text-xs text-[#777] mt-2.5">
                Para una contraseña segura: al menos 8 caracteres, incluyendo números, letras mayúsculas y minúsculas. Se acepta nivel medio (naranja) o superior.
              </p>
              {errors.password && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="form-group mb-5">
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
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              {errors.confirmPassword && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.confirmPassword}</p>
              )}
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
                  Creando cuenta...
                </span>
              ) : 'Registrarse'}
            </button>

            <div className="login-link text-center mt-5 text-sm text-[#555]">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-[#EC0617] font-semibold no-underline hover:underline">Iniciar Sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
