import axios from 'axios';

// URL base de la API - Ajusta esto a la URL donde se está ejecutando tu API Laravel
const API_URL = 'http://localhost:8000/api/v1/Email';

// Configurar Axios con opciones globales
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Opcional: establecer timeout para las solicitudes
  timeout: 30000 // 30 segundos
});

// Interceptor para logs (útil para debuggear)
apiClient.interceptors.request.use(request => {
  console.log('Haciendo solicitud a notificaciones:', request.url);
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('Respuesta de notificaciones recibida:', response.status);
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout en la conexión de notificaciones: Verifique que el servidor esté funcionando');
    } else if (!error.response) {
      console.error('Error de conexión de notificaciones: Verifique que el servidor API esté funcionando en', API_URL);
    } else {
      console.error('Error en respuesta de notificaciones:', error.response ? error.response.data : error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Clase para gestionar las peticiones a la API de notificaciones
 */
class NotificacionesService {
  /**
   * Obtener todas las notificaciones
   * @returns {Promise} Promesa con la lista de notificaciones
   */
  async getNotificaciones() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener una notificación por su ID
   * @param {number} id - ID de la notificación
   * @returns {Promise} Promesa con la notificación solicitada
   */
  async getNotificacion(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener notificación con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener notificaciones del usuario autenticado
   * @returns {Promise} Promesa con las notificaciones del usuario
   */
  async getUserNotifications() {
    try {
      const response = await apiClient.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener notificaciones no leídas del usuario autenticado
   * @returns {Promise} Promesa con las notificaciones no leídas
   */
  async getUnreadNotifications() {
    try {
      const response = await apiClient.get('/unread');
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      throw error;
    }
  }

  /**
   * Crear una nueva notificación
   * @param {Object} notificacionData - Datos de la notificación
   * @param {string} notificacionData.estado - Estado de la notificación
   * @param {Date} notificacionData.fecha_creacion - Fecha de creación
   * @param {number} notificacionData.usuarios_id_usuario - ID del usuario
   * @param {number} notificacionData.mensajes_id_mensaje - ID del mensaje
   * @returns {Promise} Promesa con la notificación creada
   */
  async crearNotificacion(notificacionData) {
    try {
      const response = await apiClient.post('/', notificacionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }

  /**
   * Crear notificación usando mensaje existente
   * @param {Object} data - Datos para crear la notificación
   * @param {number} data.user_id - ID del usuario
   * @param {number} data.mensaje_id - ID del mensaje
   * @param {string} data.tipo - Tipo de notificación
   * @returns {Promise} Promesa con la notificación creada
   */
  async notificarConMensaje(data) {
    try {
      const response = await apiClient.post('/notify-with-message', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear notificación con mensaje:', error);
      throw error;
    }
  }

  /**
   * Actualizar una notificación existente
   * @param {number} id - ID de la notificación
   * @param {Object} notificacionData - Datos a actualizar
   * @returns {Promise} Promesa con la notificación actualizada
   */
  async actualizarNotificacion(id, notificacionData) {
    try {
      const response = await apiClient.patch(`/${id}`, notificacionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar notificación con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Marcar una notificación como leída
   * @param {number} id - ID de la notificación
   * @returns {Promise} Promesa con la respuesta
   */
  async marcarComoLeida(id) {
    try {
      const response = await apiClient.patch(`/${id}/mark-read`);
      return response.data;
    } catch (error) {
      console.error(`Error al marcar notificación ${id} como leída:`, error);
      throw error;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise} Promesa con la respuesta
   */
  async marcarTodasComoLeidas() {
    try {
      const response = await apiClient.patch('/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  /**
   * Eliminar una notificación
   * @param {number} id - ID de la notificación a eliminar
   * @returns {Promise} Promesa con la respuesta
   */
  async eliminarNotificacion(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar notificación con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener la lista de mensajes disponibles
   * @returns {Promise} Promesa con la lista de mensajes
   */
  async getMensajes() {
    try {
      // Endpoint separado para obtener mensajes
      const response = await axios.get('http://localhost:8000/api/v1/messages');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  }
}

// Exportamos una instancia del servicio para su uso en componentes
const notificacionesService = new NotificacionesService();
export default notificacionesService;
