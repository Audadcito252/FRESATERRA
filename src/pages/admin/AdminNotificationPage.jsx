import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Assuming your API service is here
import { toast } from 'react-hot-toast'; // For user feedback

const AdminNotificationPage = () => {  const navigate = useNavigate();  
  // Initial form data with field names matching api requirements
  const initialFormData = {
    usuario_id: '', // Will be converted to user_id in payload
    tipo: '', // Message type
    asunto: '', // Subject
    contenido: '', // Content
    prioridad: 'normal', // Priority with default value
    tipoEnvio: 'completa', // Siempre usar notificación completa (In-App + Email)
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);  const [users, setUsers] = useState([]); // To populate user selection

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    const adminToken = localStorage.getItem('adminToken');
    
    if (isAdmin !== 'true' || !adminToken) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        // Intentar primero con la ruta de admin protegida
        let response;
        try {
          response = await api.get('/admin/users/registered');
          console.log('Admin users response:', response);
        } catch (adminError) {
          console.warn('Admin route failed, trying public route:', adminError.message);
          // Si falla la ruta de admin, usar la ruta pública como fallback
          response = await api.get('/users/registered');
          console.log('Public users response:', response);
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
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar la lista de usuarios: ' + (error.message || 'Error desconocido'));
        setUsers([]);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.usuario_id || !formData.contenido) {
      toast.error('Por favor selecciona un usuario y escribe un mensaje.');
      setIsLoading(false);
      return;
    }

    try {
      // Siempre usar el método completo (In-App + Email)
      const payload = {
        user_id: parseInt(formData.usuario_id),
        data: {
          mensaje: formData.contenido,
          tipo: formData.tipo,
          asunto: formData.asunto,
          prioridad: formData.prioridad,
          enviar_a_todos: false
        },
        tipo: formData.tipo,
        asunto: formData.asunto,
        send_email: true
      };
      
      console.log('Enviando notificación completa (In-App + Email):', payload);
      const response = await api.post('/admin/notificaciones/send-complete', payload);
      
      console.log('Notification sent response:', response);
      toast.success(response.message || '¡Notificación enviada con éxito!');
      setFormData(initialFormData); // Reset form
    } catch (error) {
      console.error('Error sending notification:', error);
      let errorMsg = 'Error al enviar la notificación.';
      
      // Handle validation errors (422) or other structured errors
      if (error.validationErrors) {
        errorMsg = Object.values(error.validationErrors).flat().join(' ');
      } else if (error.message) {
        errorMsg = error.message;
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
          <div className="mb-4">            <label htmlFor="usuario_id" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario Destinatario
            </label>
            <select
              id="usuario_id"
              name="usuario_id"
              value={formData.usuario_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Seleccione un usuario</option>
              {users.map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Tipo (Mensaje) */}
          <div className="mb-4">            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Mensaje
            </label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              placeholder="Ej: Promoción, Aviso, Recordatorio"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Asunto (Mensaje) */}
          <div className="mb-4 md:col-span-2">            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
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
          <div className="mb-4 md:col-span-2">            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1">
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
          <div className="mb-4">            <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full bg-red-600 text-white py-2.5 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-400"
          >
            {isLoading ? 'Enviando...' : 'Enviar Notificación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNotificationPage;
