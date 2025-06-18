import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviewsService } from '../services/reviewsService';

const ProductReview = ({ productId, existingReview, onReviewSubmit, onCancel }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(existingReview ? existingReview.calificacion : 5);
  const [comment, setComment] = useState(existingReview ? existingReview.contenido : '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Si hay una reseña existente del usuario, cargar sus datos para edición
    if (existingReview && existingReview.id_resena) {
      setRating(existingReview.calificacion);
      setComment(existingReview.contenido);
      setIsEditing(true);
    } else {
      // Nueva reseña
      setRating(5);
      setComment('');
      setIsEditing(false);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Por favor, ingrese un comentario');
      return;
    }

    if (comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reviewData = {
        productos_id_producto: productId,
        calificacion: rating,
        contenido: comment.trim()
      };

      let result;
      if (isEditing && existingReview) {
        // Actualizar reseña existente
        result = await reviewsService.updateReview(existingReview.id_resena, reviewData);
      } else {
        // Crear nueva reseña
        result = await reviewsService.createReview(reviewData);
      }

      if (result.success) {
        // Llamar al callback del componente padre para actualizar la lista
        onReviewSubmit(result.data, isEditing);
        
        if (!isEditing) {
          // Si es un nuevo comentario, limpiar el formulario
          setRating(5);
          setComment('');
        }
      } else {
        setError(result.message || 'Error al procesar la reseña');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error inesperado al procesar la reseña');    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Fallback: resetear formulario si no hay función onCancel
      setRating(5);
      setComment('');
      setIsEditing(false);
      setError(null);
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm border border-gray-200">
        <div className="text-gray-400 mb-3">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">¿Quieres dejar una reseña?</h3>
        <p className="text-gray-600 mb-4">Inicia sesión para compartir tu opinión sobre este producto</p>
        <a href="/login" className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors">
          Iniciar sesión
        </a>
      </div>
    );
  }

  // Si no hay reseña existente y no estamos editando, mostrar formulario inicial
  if (!existingReview && !isEditing) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Comparte tu experiencia!</h3>
          <p className="text-gray-600 mb-4">Aún no has dejado una reseña para este producto</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Escribir reseña
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing && existingReview?.id_resena ? 'Editar tu reseña' : 'Escribir nueva reseña'}
      </h3>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Calificación</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
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
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Comentario
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows="4"
            placeholder="Comparte tu opinión sobre este producto..."
            required
          ></textarea>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? (isEditing && existingReview?.id_resena ? 'Actualizando...' : 'Publicando...') 
              : (isEditing && existingReview?.id_resena ? 'Actualizar reseña' : 'Publicar reseña')
            }
          </button>          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductReview;