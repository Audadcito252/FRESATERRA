// utils/whatsapp.js

/**
 * Genera un mensaje de WhatsApp con los datos del formulario de contacto.
 * @param {Object} formData - Los datos del formulario.
 * @returns {string} - URL lista para abrir en WhatsApp.
 */
export function buildWhatsAppUrl(formData) {
  const phone = '51929714978';
  const subjectMap = {
    producto: 'Consulta sobre productos',
    pedido: 'Problema con mi pedido',
    envio: 'Consulta sobre envíos',
    calidad: 'Reclamo de calidad',
    productor: 'Quiero ser productor',
    otro: 'Otro',
    '': 'Sin asunto'
  };
  const subjectText = subjectMap[formData.subject] || formData.subject || 'Sin asunto';
  const message =
    `*Nuevo mensaje de contacto desde la web FresaTerra*%0A%0A` +
    `Estimado equipo de FresaTerra,%0A%0A` +
    `He completado el formulario de contacto y agradecería su amable atención a mi consulta.%0A%0A` +
    `*Datos del usuario:*%0A` +
    `- Nombre: ${formData.name || '-'}%0A` +
    `- Correo: ${formData.email || '-'}%0A` +
    `- Teléfono: ${formData.phone || '-'}%0A` +
    `- Asunto: ${subjectText}%0A%0A` +
    `*Mensaje:*%0A${formData.message || '-'}%0A%0A` +
    `Por favor, agradeceré su pronta respuesta.%0A%0A` +
    `Saludos cordiales,%0A${formData.name || '-'}%0A`;
  return `https://wa.me/${phone}?text=${message}`;
}
