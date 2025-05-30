import axios from 'axios';

// URL base de la API - Ajusta esto a la URL donde se está ejecutando tu API Laravel
const API_URL = 'http://localhost:8000/api/v1/comments';

// Configurar Axios con opciones globales
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },  // Opcional: establecer timeout para las solicitudes
  timeout: 30000 // 30 segundos
});

// Interceptor para logs (útil para debuggear)
apiClient.interceptors.request.use(request => {
  console.log('Haciendo solicitud a:', request.url);
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('Respuesta recibida:', response.status);
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout en la conexión: Verifique que el servidor esté funcionando');
    } else if (!error.response) {
      console.error('Error de conexión: Verifique que el servidor API esté funcionando en', API_URL);
    } else {
      console.error('Error en respuesta:', error.response ? error.response.data : error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Clase para gestionar las peticiones a la API de comentarios
 */
class ComentariosService {
  /**
   * Obtener todos los comentarios
   * @returns {Promise} Promesa con la lista de comentarios
   */
  async getComentarios() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  }

  /**
   * Obtener un comentario por su ID
   * @param {number} id - ID del comentario (id_resena)
   * @returns {Promise} Promesa con el comentario solicitado
   */
  async getComentario(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener comentario con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo comentario
   * @param {Object} comentarioData - Datos del comentario
   * @param {number} comentarioData.calificacion - Calificación (1-5)
   * @param {string} comentarioData.contenido - Contenido del comentario
   * @param {number} comentarioData.usuarios_id_usuario - ID del usuario
   * @returns {Promise} Promesa con el comentario creado
   */
  async crearComentario(comentarioData) {
    try {
      const response = await apiClient.post('/', comentarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  }

  /**
   * Actualizar un comentario existente
   * @param {number} id - ID del comentario (id_resena)
   * @param {Object} comentarioData - Datos a actualizar
   * @returns {Promise} Promesa con el comentario actualizado
   */
  async actualizarComentario(id, comentarioData) {
    try {
      const response = await apiClient.patch(`/${id}`, comentarioData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar comentario con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un comentario
   * @param {number} id - ID del comentario a eliminar (id_resena)
   * @returns {Promise} Promesa con la respuesta
   */
  async eliminarComentario(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar comentario con ID ${id}:`, error);
      throw error;
    }
  }
  /**
   * Obtener la lista de usuarios
   * @returns {Promise} Promesa con la lista de usuarios
   */
  async getUsuarios() {
    try {
      // Cambiamos la ruta para usar un endpoint separado de usuarios
      // Asumiendo que tienes un endpoint en tu API para obtener usuarios
      const response = await axios.get('http://localhost:8000/api/v1/users');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }
}

// Exportamos una instancia del servicio para su uso en componentes
const comentariosService = new ComentariosService();
export default comentariosService;