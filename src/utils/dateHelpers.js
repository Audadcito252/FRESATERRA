/**
 * Utilidades para el manejo y formateo de fechas
 */

/**
 * Formatea una fecha en formato relativo (ej: "hace 5 minutos")
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} - Texto con el tiempo relativo
 */
export const formatearFechaRelativa = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `Hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
    
    return `Hace ${Math.floor(diffInMonths / 12)} año${Math.floor(diffInMonths / 12) > 1 ? 's' : ''}`;
  } catch (error) {
    console.error('Error al formatear fecha relativa:', error);
    return dateString;
  }
};

/**
 * Formatea una fecha en formato completo legible
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} - Texto con la fecha formateada
 */
export const formatearFechaCompleta = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha completa:', error);
    return dateString;
  }
};