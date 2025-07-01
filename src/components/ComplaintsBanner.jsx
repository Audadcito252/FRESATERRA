import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const ComplaintsBanner = () => {
  const navigate = useNavigate();

  const handleComplaintsClick = (e) => {
    e.preventDefault();
    navigate('/complaints-book');
    // El scroll se maneja en el componente ComplaintsBookPage
  };

  return (
    <div className="bg-red-600 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <BookOpen className="h-4 w-4" />
          <span>¿Tienes algún reclamo?</span>
          <button 
            onClick={handleComplaintsClick}
            className="underline hover:no-underline font-semibold cursor-pointer"
          >
            Accede a nuestro Libro de Reclamaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsBanner;
