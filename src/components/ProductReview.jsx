// filepath: c:\laragon\www\fresaterracommerce\src\components\ProductReview.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProductReview = ({ productId, existingReview, onReviewSubmit }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 5);
  const [comment, setComment] = useState(existingReview ? existingReview.comment : '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Si hay una reseña existente del usuario, cargar sus datos
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setIsEditing(true);
    } else {
      setRating(5);
      setComment('');
      setIsEditing(false);
    }
  }, [existingReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert('Por favor, ingrese un comentario');
      return;
    }

    const reviewData = {
      id: existingReview ? existingReview.id : `new-${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName?.charAt(0) || ''}`,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    onReviewSubmit(reviewData, isEditing);
    
    if (!isEditing) {
      // Si es un nuevo comentario, limpiar el formulario
      setRating(5);
      setComment('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-200">
        <p className="text-gray-700">Inicia sesión para dejar una reseña</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Editar tu reseña' : 'Agregar una reseña'}
      </h3>
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          {isEditing ? 'Actualizar reseña' : 'Publicar reseña'}
        </button>
      </form>
    </div>
  );
};

export default ProductReview;