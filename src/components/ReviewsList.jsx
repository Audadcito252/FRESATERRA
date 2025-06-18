import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ReviewsList = ({ reviews, onEditReview }) => {
  const { user } = useAuth();
  
  // Ordenar las reseñas, colocando primero la del usuario actual si existe
  const sortedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0 || !user) {
      return reviews || [];
    }
    
    // Crear una nueva lista ordenada con la reseña del usuario al principio
    return [...reviews].sort((a, b) => {
      if (a.usuarios_id_usuario === user.id_usuario) return -1;
      if (b.usuarios_id_usuario === user.id_usuario) return 1;
      return 0;
    });
  }, [reviews, user]);

  if (!sortedReviews || sortedReviews.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No hay reseñas disponibles para este producto.
      </div>
    );
  }

  return (    <div className="space-y-4">
      {sortedReviews.map((review) => (
        <div 
          key={review.id_resena} 
          className={`bg-white rounded-lg p-4 shadow-sm border ${
            user && user.id_usuario === review.usuarios_id_usuario 
              ? 'border-red-200 bg-red-50' 
              : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {review.usuario ? `${review.usuario.nombre} ${review.usuario.apellidos || ''}` : 'Usuario'}
                </span>
                <div className="text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.calificacion ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(review.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
            {user && user.id_usuario === review.usuarios_id_usuario && (
              <button
                onClick={() => onEditReview(review)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Editar
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-700">{review.contenido}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;