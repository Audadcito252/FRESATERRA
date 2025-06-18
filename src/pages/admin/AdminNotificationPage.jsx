import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Assuming your API service is here
import { toast } from 'react-hot-toast'; // For user feedback

const AdminNotificationPage = () => {  const navigate = useNavigate();  
  // Initial form data with field names matching api requirements
  const initialFormData = {
    usuario_id: '', // Will be converted to user_id in payload
    todos_los_usuarios: false, // New field for sending to all users
    tipo: '', // Message type
    asunto: '', // Subject
    contenido: '', // Content
    prioridad: 'normal', // Priority with default value
    tipoEnvio: 'completa', // Siempre usar notificación completa (In-App + Email)
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);  
  const [users, setUsers] = useState([]); // To populate user selection
  const [usersCount, setUsersCount] = useState(0); // Count of active users
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmation modal
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    const adminToken = localStorage.getItem('adminToken');
    
    console.log('Admin Authentication Check:', {
      isAdmin,
      adminToken: adminToken ? 'Token exists' : 'No token',
      tokenLength: adminToken ? adminToken.length : 0
    });
    
    if (isAdmin !== 'true' || !adminToken) {
      console.log('Not authenticated as admin, redirecting to login');
      navigate('/admin/login');
      return;
    }    const fetchUsers = async () => {
      try {
        console.log('Fetching users with admin token');
          // Primero probar la autenticación
        try {
          console.log('Testing admin authentication...');
          const testResponse = await api.get('/admin/test-auth');
          console.log('Admin auth test response:', testResponse);
        } catch (testError) {
          console.error('Admin auth test failed:', testError);
        }        // Probar middleware admin completo
        try {
          console.log('Testing admin middleware...');
          const adminMiddlewareTest = await api.get('/admin/test-admin-middleware');
          console.log('Admin middleware test response:', adminMiddlewareTest);
        } catch (middlewareError) {
          console.error('Admin middleware test failed:', middlewareError);
        }

        // Probar el grupo admin/users
        try {
          console.log('Testing admin/users group...');
          const usersGroupTest = await api.get('/admin/users/test-users-group');
          console.log('Admin users group test response:', usersGroupTest);
        } catch (groupError) {
          console.error('Admin users group test failed:', groupError);
        }
        
        // Obtener lista de usuarios
        let response;
        try {
          console.log('Making request to /admin/users/registered');
          response = await api.get('/admin/users/registered');
          console.log('Admin users response:', response);
        } catch (adminError) {
          console.error('Admin route failed:', adminError);
          console.error('Error details:', {
            message: adminError.message,
            status: adminError.status,
            response: adminError.response
          });
          
          // Si falla, no hay ruta pública alternativa para esta funcionalidad
          throw new Error('No se pudo acceder a la lista de usuarios. Error: ' + adminError.message);
        }
        
        // Ajustar según la estructura de respuesta de tu backend
        if (response && (response.usuarios || response.users || response.data || Array.isArray(response))) {
          const usersArray = response.usuarios || response.users || response.data || response;
          setUsers(Array.isArray(usersArray) ? usersArray : []);
          console.log('Users loaded:', usersArray);
        } else {
          setUsers([]);
          toast.error('No se pudieron cargar los usuarios.');
        }

        // Obtener conteo de usuarios activos
        try {
          const countResponse = await api.get('/admin/users/count');
          if (countResponse.data && countResponse.data.total_usuarios_activos) {
            setUsersCount(countResponse.data.total_usuarios_activos);
          } else {
            // Si no hay respuesta del endpoint, usar el conteo de usuarios cargados
            const loadedUsers = response.usuarios || response.users || response.data || response;
            setUsersCount(Array.isArray(loadedUsers) ? loadedUsers.length : 0);
          }
        } catch (countError) {
          console.warn('Error getting users count:', countError.message);
          // Usar el conteo de usuarios cargados como fallback
          const loadedUsers = response.usuarios || response.users || response.data || response;
          setUsersCount(Array.isArray(loadedUsers) ? loadedUsers.length : 0);
        }

      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar la lista de usuarios: ' + (error.message || 'Error desconocido'));
        setUsers([]);
        setUsersCount(0);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'usuario_id') {
      // Si seleccionamos "todos", marcamos todos_los_usuarios como true
      if (value === 'todos') {
        setFormData(prev => ({ 
          ...prev, 
          usuario_id: '',
          todos_los_usuarios: true 
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          usuario_id: value,
          todos_los_usuarios: false 
        }));
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!formData.usuario_id && !formData.todos_los_usuarios) || !formData.contenido) {
      toast.error('Por favor selecciona un destinatario y escribe un mensaje.');
      return;
    }

    // Si es para todos los usuarios, mostrar confirmación
    if (formData.todos_los_usuarios && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }

    await sendNotification();
  };

  const sendNotification = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);

    try {  
      // Preparar el payload según si es para todos los usuarios o uno específico
      const payload = {
        tipo_mensaje: formData.tipo || 'general',
        asunto: formData.asunto,
        contenido_mensaje: formData.contenido,
        prioridad: formData.prioridad
      };

      // Si es para todos los usuarios
      if (formData.todos_los_usuarios) {
        payload.todos_los_usuarios = true;
      } else {
        payload.id_usuario = parseInt(formData.usuario_id);
      }
      
      console.log('Enviando notificación:', payload);
      const response = await api.post('/admin/notificaciones', payload);
      
      console.log('Notification sent response:', response);
      
      // Mostrar mensaje de éxito más detallado
      const successMessage = response.data?.mensaje || '¡Notificación enviada con éxito!';
      toast.success(successMessage, { duration: 4000 });
      
      setFormData(initialFormData); // Reset form
    } catch (error) {
      console.error('Error sending notification:', error);
      let errorMsg = 'Error al enviar la notificación.';
      
      // Handle validation errors (422) or other structured errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMsg = Object.values(validationErrors).flat().join(' ');
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Si hay información de debug, mostrarla en consola
      if (error.response?.data?.debug) {
        console.log('Debug info:', error.response.data.debug);
        errorMsg += ` (Debug: ${JSON.stringify(error.response.data.debug)})`;
      }
      
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
    const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enviar Notificación</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Cerrar Sesión Admin
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Selection */}
          <div className="mb-4">
            <label htmlFor="usuario_id" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario Destinatario
            </label>
            <select
              id="usuario_id"
              name="usuario_id"
              value={formData.todos_los_usuarios ? 'todos' : formData.usuario_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Seleccione un usuario</option>
              <option value="todos" className="font-bold bg-blue-50">
                📢 Todos los usuarios registrados
              </option>
              {users.map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre} ({user.email})
                </option>
              ))}
            </select>
            {formData.todos_los_usuarios && (
              <div className="text-sm text-blue-600 mt-1 p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <div>
                    <p className="font-semibold">Esta notificación se enviará a todos los usuarios registrados</p>
                    <p className="text-xs text-blue-500">
                      Total de usuarios activos: <strong>{usersCount > 0 ? usersCount : users.length}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tipo (Mensaje) */}
          <div className="mb-4">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Mensaje
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Seleccione el tipo</option>
              <option value="general">General</option>
              <option value="promocion">Promoción</option>
              <option value="sistema">Sistema</option>
              <option value="urgente">Urgente</option>
              <option value="novedad">Novedad</option>
            </select>
          </div>

          {/* Asunto (Mensaje) */}
          <div className="mb-4 md:col-span-2">
            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
              Asunto del Mensaje
            </label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Contenido (Mensaje) */}
          <div className="mb-4 md:col-span-2">
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido del Mensaje
            </label>
            <textarea
              id="contenido"
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            ></textarea>
          </div>
          
          {/* Prioridad (Mensaje) */}
          <div className="mb-4">
            <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad del Mensaje
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="baja">Baja</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 font-semibold ${
              formData.todos_los_usuarios 
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
            } disabled:bg-gray-400`}
          >
            {isLoading 
              ? 'Enviando...' 
              : formData.todos_los_usuarios 
                ? `📢 Enviar a Todos los Usuarios (${usersCount > 0 ? usersCount : users.length})` 
                : 'Enviar Notificación'
            }
          </button>
        </div>
      </form>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirmar Envío Masivo
                </h3>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Estás a punto de enviar esta notificación a <strong>todos los usuarios registrados</strong> en el sistema.
              </p>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm"><strong>Tipo:</strong> {formData.tipo}</p>
                <p className="text-sm"><strong>Asunto:</strong> {formData.asunto}</p>
                <p className="text-sm"><strong>Destinatarios:</strong> {usersCount > 0 ? usersCount : users.length} usuarios</p>
                <p className="text-sm"><strong>Prioridad:</strong> {formData.prioridad}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ¿Estás seguro de que quieres continuar?
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={sendNotification}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isLoading ? 'Enviando...' : 'Sí, Enviar a Todos'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationPage;
