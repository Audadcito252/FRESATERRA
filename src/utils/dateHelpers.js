/**
 * Funciones utilitarias para formatear fechas
 */

/**
 * Formatea una fecha relativa (ej: "hace 2 horas", "hace 3 días")
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFechaRelativa = (fecha) => {
  const ahora = new Date();
  const fechaNotificacion = new Date(fecha);
  const diferencia = ahora - fechaNotificacion;
  
  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  
  if (segundos < 60) {
    return 'Ahora mismo';
  } else if (minutos < 60) {
    return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  } else if (horas < 24) {
    return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  } else if (dias < 7) {
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  } else if (semanas < 4) {
    return `Hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
  } else if (meses < 12) {
    return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
  } else {
    return fechaNotificacion.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

/**
 * Formatea una fecha en formato completo
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFechaCompleta = (fecha) => {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea una fecha en formato corto
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFechaCorta = (fecha) => {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Verifica si una fecha es de hoy
 * @param {string|Date} fecha - Fecha a verificar
 * @returns {boolean} True si es de hoy
 */
export const esHoy = (fecha) => {
  const hoy = new Date();
  const fechaObj = new Date(fecha);
  
  return hoy.getDate() === fechaObj.getDate() &&
    hoy.getMonth() === fechaObj.getMonth() &&
    hoy.getFullYear() === fechaObj.getFullYear();
};

/**
 * Verifica si una fecha es de ayer
 * @param {string|Date} fecha - Fecha a verificar
 * @returns {boolean} True si es de ayer
 */
export const esAyer = (fecha) => {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaObj = new Date(fecha);
  
  return ayer.getDate() === fechaObj.getDate() &&
    ayer.getMonth() === fechaObj.getMonth() &&
    ayer.getFullYear() === fechaObj.getFullYear();
};