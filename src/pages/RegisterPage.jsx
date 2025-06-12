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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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

  // Estados para interfaz dinámica
  const [focusedField, setFocusedField] = useState('');
  const [touchedFields, setTouchedFields] = useState({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  // Función para obtener los requisitos de contraseña con su estado
  const getPasswordRequirements = (password) => {
    return [
      {
        text: 'Mínimo 10 caracteres',
        met: password.length >= 10,
        icon: password.length >= 10 ? '✓' : '○'
      },
      {
        text: 'Al menos 1 letra mayúscula (A-Z)',
        met: /[A-Z]/.test(password),
        icon: /[A-Z]/.test(password) ? '✓' : '○'
      },
      {
        text: 'Al menos 1 letra minúscula (a-z)',
        met: /[a-z]/.test(password),
        icon: /[a-z]/.test(password) ? '✓' : '○'
      },
      {
        text: 'Al menos 1 número (0-9)',
        met: /\d/.test(password),
        icon: /\d/.test(password) ? '✓' : '○'
      },
      {
        text: 'Caracteres especiales opcionales (!@#$%^&*)',
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        icon: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○',
        optional: true
      }
    ];
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const checkPasswordStrength = (password) => {
    if (!password) {
      return '';
    }
    
    const hasLength = password.length >= 10; // Cambiado a 10 caracteres
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
  };const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'Por favor ingresa tu nombre';
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Por favor ingresa tu apellido';
        if (value.trim().length < 3) return 'El apellido debe tener al menos 3 caracteres';
        if (value.trim().length > 250) return 'El apellido no puede exceder 250 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El apellido solo puede contener letras';
        return '';
      case 'email':
        if (!value) return 'Por favor ingresa tu correo electrónico';
        if (value.length > 100) return 'El correo no puede exceder 100 caracteres';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Formato de correo inválido. Ejemplo: juan@gmail.com' : '';
      case 'phone':
        if (!value) return 'Por favor ingresa tu número de teléfono';
        if (value.length < 7) return 'El teléfono debe tener al menos 7 caracteres';
        if (value.length > 15) return 'El teléfono no puede exceder 15 caracteres';
        if (!/^\d+$/.test(value)) return 'Solo se permiten números';
        // Opcional: validación específica para números peruanos
        const phoneRegex = /^9\d{8}$/;
        if (!phoneRegex.test(value)) {
          return 'Formato recomendado para Perú: 9 seguido de 8 dígitos (ej: 987654321)';
        }
        return '';
      case 'password':
        if (!value) return 'Por favor ingresa una contraseña';
        if (value.length < 10) return 'La contraseña debe tener al menos 10 caracteres';
        
        const hasLength = value.length >= 10;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        const requirements = [];
        if (!hasLength) requirements.push('mínimo 10 caracteres');
        if (!hasUpperCase) requirements.push('al menos 1 mayúscula');
        if (!hasLowerCase) requirements.push('al menos 1 minúscula');
        if (!hasNumbers) requirements.push('al menos 1 número');
        
        if (requirements.length > 0) {
          return `Falta: ${requirements.join(', ')}`;
        }
        
        // Calculamos fuerza con base en 10 caracteres
        const strength = [hasLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
        if (strength <= 2) {
          return 'La contraseña es muy débil. Añade más variedad de caracteres.';
        }
        return '';
      case 'confirmPassword':
        if (!value) return 'Por favor confirma tu contraseña';
        return value !== formData.password ? 'Las contraseñas no son iguales' : '';
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
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };

    setErrors(newErrors);

    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error !== '')) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    try {
      // Pasar los datos exactamente como los espera el backend
      await register(formData.email, formData.password, formData.firstName, formData.lastName, formData.phone);
      toast.success('¡Registro exitoso! Bienvenido a Fresaterra');
      navigate('/');
    } catch (error) {
      console.error('Error de registro:', error);
      
      // Manejar errores específicos del backend
      if (error.message && error.message.includes('email')) {
        toast.error('Este correo electrónico ya está registrado');
      } else if (error.message && error.message.includes('telefono')) {
        toast.error('Error en el número de teléfono');
      } else if (error.message && error.message.includes('password')) {
        toast.error('Error en la contraseña. Asegúrate de que tenga al menos 10 caracteres');
      } else {
        toast.error(error.message || 'Error al crear la cuenta. Por favor intenta nuevamente');
      }
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
        
          <form onSubmit={handleSubmit} autoComplete="off">            <div className="form-row flex gap-4 mb-5">              <div className="form-group flex-1">
                <label htmlFor="firstName" className="block text-black mb-2 font-medium">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className={`w-full p-3 pl-10 border rounded text-base focus:outline-none transition-all ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 
                      formData.firstName && !errors.firstName ? 'border-green-500 focus:border-green-600' :
                      'border-[#ddd] focus:border-[#EC0617]'
                    }`}
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {errors.firstName && (
                  <p className="error-message text-[#EC0617] text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="form-group flex-1">
                <label htmlFor="lastName" className="block text-black mb-2 font-medium">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className={`w-full p-3 pl-10 border rounded text-base focus:outline-none transition-all ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : 
                      formData.lastName && !errors.lastName ? 'border-green-500 focus:border-green-600' :
                      'border-[#ddd] focus:border-[#EC0617]'
                    }`}
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {errors.lastName && (
                  <p className="error-message text-[#EC0617] text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>            <div className="form-group mb-5">
              <label htmlFor="email" className="block text-black mb-2 font-medium">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full p-3 pl-10 border rounded text-base focus:outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 
                    formData.email && !errors.email ? 'border-green-500 focus:border-green-600' :
                    'border-[#ddd] focus:border-[#EC0617]'
                  }`}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.email}</p>
              )}
            </div>            <div className="form-group mb-5">
              <label htmlFor="phone" className="block text-black mb-2 font-medium">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className={`w-full p-3 pl-10 border rounded text-base focus:outline-none transition-all ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 
                    formData.phone && !errors.phone ? 'border-green-500 focus:border-green-600' :
                    'border-[#ddd] focus:border-[#EC0617]'
                  }`}
                  placeholder="987654321"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.phone}</p>
              )}
            </div><div className="form-group mb-5">
              <label htmlFor="password" className="block text-black mb-2 font-medium">
                Contraseña <span className="text-red-500">*</span>
              </label>              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full p-3 pl-10 pr-10 border rounded text-base focus:outline-none transition-all ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 
                    formData.password && !errors.password && passwordStrength === 'strength-strong' ? 'border-green-500 focus:border-green-600' :
                    formData.password && !errors.password && passwordStrength === 'strength-medium' ? 'border-yellow-500 focus:border-yellow-600' :
                    'border-[#ddd] focus:border-[#EC0617]'
                  }`}
                  placeholder="Mínimo 10 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
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
              
              {/* Indicador de fuerza más sutil */}
              {formData.password && (
                <div className="flex items-center justify-between mt-2">
                  <div className={`password-strength flex h-1 w-20 ${passwordStrength}`}>
                    <div className="strength-segment flex-1 mr-1 bg-[#ddd] rounded-sm transition-colors"></div>
                    <div className="strength-segment flex-1 mr-1 bg-[#ddd] rounded-sm transition-colors"></div>
                    <div className="strength-segment flex-1 bg-[#ddd] rounded-sm transition-colors"></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {passwordStrength === 'strength-weak' ? 'Débil' :
                     passwordStrength === 'strength-medium' ? 'Buena' :
                     passwordStrength === 'strength-strong' ? 'Excelente' : ''}
                  </span>
                </div>
              )}

              {/* Ayuda dinámica solo cuando hay errores */}
              {errors.password && (
                <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-1">Mejora tu contraseña:</p>
                  <div className="space-y-1">
                    {getPasswordRequirements(formData.password)
                      .filter(req => !req.met && !req.optional)
                      .map((req, index) => (
                        <p key={index} className="text-xs text-red-600">• {req.text}</p>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>            <div className="form-group mb-5">
              <label htmlFor="confirmPassword" className="block text-black mb-2 font-medium">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`w-full p-3 pl-10 pr-10 border rounded text-base focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 
                    formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-green-500 focus:border-green-600' :
                    'border-[#ddd] focus:border-[#EC0617]'
                  }`}
                  placeholder="Repetir contraseña"
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
              
              {/* Indicador sutil de coincidencia */}
              {formData.confirmPassword && formData.password && (
                <div className="flex items-center mt-1">
                  {formData.confirmPassword === formData.password ? (
                    <span className="text-xs text-green-600">✓ Las contraseñas coinciden</span>
                  ) : (
                    <span className="text-xs text-red-500">Las contraseñas no coinciden</span>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && (
                <p className="error-message text-[#EC0617] text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div><button
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
              ) : 'Crear mi cuenta'}            </button>

            <div className="login-link text-center mt-6 text-sm text-[#555]">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-[#EC0617] font-semibold no-underline hover:underline">Iniciar Sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
