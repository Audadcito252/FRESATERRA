import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import comentariosService from '../Services/comentarios';

// Componente para mostrar estrellas de valoración
const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editable && setRating(star)}
          className={editable ? "focus:outline-none" : "cursor-default"}
          disabled={!editable}
        >
          <span 
            className={`text-2xl ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        </button>
      ))}
      <span className="ml-2 text-gray-600">({rating}/5)</span>
    </div>
  );
};

const ProductReview = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [rating, setRating] = useState(5);
  const [contenido, setContenido] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [comentarioId, setComentarioId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar comentarios al iniciar
  useEffect(() => {
    loadComentarios();
    // Si es necesario, también cargar datos de usuarios
    if (isAuthenticated) {
      loadUsuarios();
    }
  }, [productId, isAuthenticated]);

  // Cargar comentarios desde la API
  const loadComentarios = async () => {
    try {
      setLoading(true);
      const data = await comentariosService.getComentarios();
      console.log("Comentarios recibidos:", data);
      
      // En una implementación real, aquí filtrarías los comentarios por ID de producto
      // Por ejemplo, si el modelo en backend tuviera un campo producto_id:
      // const filteredData = data.filter(comentario => comentario.producto_id === productId);
      // setComentarios(filteredData);
      
      setComentarios(data);
      
      // Calcular promedio de calificaciones
      if (data && data.length > 0) {
        const suma = data.reduce((acc, item) => acc + (item.calificacion || 0), 0);
        setPromedio((suma / data.length).toFixed(1));
      } else {
        setPromedio(0);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
      setError("No se pudieron cargar los comentarios");
      setLoading(false);
    }
  };
  
  // Cargar usuarios si es necesario
  const loadUsuarios = async () => {
    try {
      const usuarios = await comentariosService.getUsuarios();
      console.log("Usuarios cargados:", usuarios);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  // Encontrar comentario del usuario actual
  const userComentario = user && comentarios.find(c => 
    c.usuarios_id_usuario === user.id_usuario
  );

  // Manejar edición de comentario
  const handleEditComentario = (comentario) => {
    setRating(comentario.calificacion || 5);
    setContenido(comentario.contenido || '');
    setComentarioId(comentario.id_resena);
    setIsEditing(true);
    
    // Scroll al formulario
    setTimeout(() => {
      const formElement = document.getElementById('comentario-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Enviar comentario (crear nuevo o actualizar)
  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    if (!contenido.trim()) {
      alert('Por favor, ingrese un comentario');
      return;
    }
    
    try {
      // Asegúrate de que el ID del usuario sea el correcto, según la estructura en AuthContext
      // AuthContext usa 'id', pero el backend parece esperar 'usuarios_id_usuario'
      const comentarioData = {
        calificacion: rating,
        contenido: contenido,
        usuarios_id_usuario: user.id || 1, // Usar user.id o un valor por defecto para pruebas
        producto_id: productId // Añadir el ID del producto para asociar el comentario
      };
      
      console.log("Enviando datos:", comentarioData);
      
      if (isEditing) {
        // Actualizar comentario existente
        await comentariosService.actualizarComentario(comentarioId, comentarioData);
        console.log("Comentario actualizado con ID:", comentarioId);
      } else {
        // Crear nuevo comentario
        const response = await comentariosService.crearComentario(comentarioData);
        console.log("Nuevo comentario creado:", response);
      }
      
      // Recargar comentarios
      loadComentarios();
      
      // Limpiar formulario si es un nuevo comentario
      if (!isEditing) {
        setRating(5);
        setContenido('');
      }
      
      setIsEditing(false);
      
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      alert("Hubo un error al enviar tu comentario. Inténtalo de nuevo.");
    }
  };

  // Eliminar comentario
  const handleDeleteComentario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      try {
        console.log("Eliminando comentario con ID:", id);
        await comentariosService.eliminarComentario(id);
        loadComentarios();
      } catch (err) {
        console.error("Error al eliminar comentario:", err);
        alert("No se pudo eliminar el comentario");
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return dateString;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando comentarios...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        {/* Promedio y estadísticas */}
        <div className="mb-6 md:w-1/3">
          <h2 className="font-semibold text-xl mb-2 text-gray-800">Promedio:</h2>
          <div className="text-2xl font-bold text-yellow-500 mb-2">{promedio} / 5</div>
          <div className="text-gray-600">
            {comentarios.length} {comentarios.length === 1 ? 'reseña' : 'reseñas'}
          </div>
        </div>

        {/* Lista de reseñas */}
        <div className="md:w-2/3">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">Reseñas:</h2>
          
          {comentarios.length === 0 ? (
            <div className="text-gray-500 italic">
              No hay reseñas disponibles para este producto.
            </div>
          ) : (
            <div className="space-y-4">
              {comentarios.map((comentario) => (
                <div 
                  key={comentario.id_resena} 
                  className={`bg-white rounded-lg p-4 shadow-sm border ${
                    user && user.id_usuario === comentario.usuarios_id_usuario 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {comentario.usuario && comentario.usuario.name 
                            ? comentario.usuario.name 
                            : 'Usuario'}
                        </span>
                        <StarRating rating={comentario.calificacion || 0} />
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDate(comentario.fecha_creacion)}
                      </p>
                    </div>
                    {user && user.id_usuario === comentario.usuarios_id_usuario && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditComentario(comentario)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteComentario(comentario.id_resena)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700">{comentario.contenido}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Formulario para agregar o editar reseña */}
          <div id="comentario-form" className="mt-8">
            {!isAuthenticated ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-200">
                <p className="text-gray-700">Inicia sesión para dejar una reseña</p>
              </div>
            ) : (!userComentario || isEditing ? (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {isEditing ? 'Editar tu reseña' : 'Agregar una reseña'}
                  </h3>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setRating(5);
                        setContenido('');
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
                <form onSubmit={handleSubmitComentario}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Calificación</label>
                    <StarRating rating={rating} setRating={setRating} editable={true} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contenido" className="block text-gray-700 mb-2">
                      Comentario
                    </label>
                    <textarea
                      id="contenido"
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows="4"
                      placeholder="Comparte tu opinión sobre este producto..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className={`text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center ${
                      isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Actualizar reseña
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Publicar reseña
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-700">Ya has dejado una reseña para este producto.</p>
                <button
                  onClick={() => handleEditComentario(userComentario)}
                  className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modificar mi reseña
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;