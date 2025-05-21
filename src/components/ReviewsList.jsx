// filepath: c:\laragon\www\fresaterracommerce\src\components\ReviewsList.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ReviewsList = ({ reviews, onEditReview }) => {
  const { user } = useAuth();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No hay reseñas disponibles para este producto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className={`bg-white rounded-lg p-4 shadow-sm border ${
            user && user.id === review.userId 
              ? 'border-red-200 bg-red-50' 
              : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{review.userName}</span>
                <div className="text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">{new Date(review.date).toLocaleDateString()}</p>
            </div>
            {user && user.id === review.userId && (
              <button
                onClick={() => onEditReview(review)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Editar
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;