import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, AlertCircle, FileText, Download, User, Mail, Phone, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

const ComplaintsBookPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Datos del consumidor
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    
    // Identificación del bien contratado
    tipoReclamo: 'RECLAMO', // RECLAMO o QUEJA
    montoReclamado: '',
    descripcionProducto: '',
    
    // Detalle de la reclamación
    detalleReclamo: '',
    fechaIncidente: '',
    pedidoRelacionado: '',
    
    // Pedido del consumidor
    pedidoConsumidor: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [numeroHojaReclamacion, setNumeroHojaReclamacion] = useState('');

  // Scroll automático hacia arriba al cargar el componente
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateComplaintNumber = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const numero = Math.floor(Math.random() * 9999) + 1;
    return `LR-${año}${mes}${dia}-${String(numero).padStart(4, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generar número de hoja de reclamación
    const numeroReclamo = generateComplaintNumber();
    setNumeroHojaReclamacion(numeroReclamo);
    
    // Aquí se enviaría al backend cuando esté implementado
    console.log('Datos del reclamo:', { ...formData, numeroHojaReclamacion: numeroReclamo });
    
    // Simular almacenamiento local temporal
    const reclamo = {
      ...formData,
      numeroHojaReclamacion: numeroReclamo,
      fechaPresentacion: new Date().toISOString(),
      estado: 'RECIBIDO'
    };
    
    const reclamos = JSON.parse(localStorage.getItem('reclamos') || '[]');
    reclamos.push(reclamo);    localStorage.setItem('reclamos', JSON.stringify(reclamos));
    
    setSubmitted(true);
    
    // Scroll automático hacia arriba al mostrar confirmación
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const downloadPDF = () => {
    // Función para generar PDF (simplificada para el ejemplo)
    alert('Función de descarga PDF será implementada. Por ahora, guarde su número de reclamo: ' + numeroHojaReclamacion);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="flex justify-center items-center mb-6">
                <div className="bg-green-100 rounded-full p-4 mr-4">
                  <BookOpen className="h-12 w-12 text-green-600" />
                </div>
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reclamo Registrado Exitosamente
              </h2>
              <p className="text-gray-600">
                Su reclamo ha sido registrado en nuestro libro de reclamaciones.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Número de Hoja de Reclamación:</h3>
              <p className="text-2xl font-mono font-bold text-green-700">{numeroHojaReclamacion}</p>
              <p className="text-sm text-green-600 mt-2">
                Guarde este número para hacer seguimiento a su reclamo
              </p>
            </div>
            
            <div className="space-y-4 text-left bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-800">Información importante:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Su reclamo será atendido en un plazo máximo de 30 días calendario.</li>
                <li>• Recibirá una respuesta a través del email proporcionado.</li>
                <li>• Una copia de este reclamo ha sido enviada a INDECOPI.</li>
                <li>• Puede descargar una copia de su reclamo en formato PDF.</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <BookOpen className="mx-auto h-20 w-20 text-red-600 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Libro de Reclamaciones</h1>
              <p className="text-lg text-gray-600">
                Formulario oficial conforme a la normativa peruana
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-800 mb-1">Marco Legal</p>
                  <p className="text-blue-700">
                    Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, 
                    Ley N° 29571, FRESATERRA pone a disposición el presente Libro de Reclamaciones.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">RECLAMO:</h3>
                <p className="text-gray-600">
                  Disconformidad relacionada a los productos o servicios.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">QUEJA:</h3>
                <p className="text-gray-600">
                  Disconformidad no relacionada a los productos o servicios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Datos del Consumidor */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="mr-2 h-5 w-5" />
                1. Identificación del Consumidor Reclamante
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">Carné de Extranjería</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="RUC">RUC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia *
                  </label>
                  <input
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distrito *
                  </label>
                  <input
                    type="text"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Identificación del Bien */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                2. Identificación del Bien Contratado
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipoReclamo"
                        value="RECLAMO"
                        checked={formData.tipoReclamo === 'RECLAMO'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Reclamo
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipoReclamo"
                        value="QUEJA"
                        checked={formData.tipoReclamo === 'QUEJA'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Queja
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Reclamado (S/)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="montoReclamado"
                    value={formData.montoReclamado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Producto/Servicio *
                </label>
                <textarea
                  name="descripcionProducto"
                  value={formData.descripcionProducto}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describa el producto o servicio objeto del reclamo..."
                />
              </div>
            </div>

            {/* Detalle de la Reclamación */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                3. Detalle de la Reclamación y Pedido del Consumidor
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Incidente
                  </label>
                  <input
                    type="date"
                    name="fechaIncidente"
                    value={formData.fechaIncidente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Pedido (si aplica)
                  </label>
                  <input
                    type="text"
                    name="pedidoRelacionado"
                    value={formData.pedidoRelacionado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ej: #12345"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalle de la Reclamación *
                </label>
                <textarea
                  name="detalleReclamo"
                  value={formData.detalleReclamo}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describa detalladamente los hechos que motivan el reclamo..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pedido del Consumidor *
                </label>
                <textarea
                  name="pedidoConsumidor"
                  value={formData.pedidoConsumidor}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Indique qué solicita como solución a su reclamo..."
                />
              </div>
            </div>

            {/* Información Legal */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Información Legal</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>FRESATERRA</strong></p>
                <p><strong>RUC:</strong> [Número de RUC de la empresa]</p>
                <p><strong>Dirección:</strong> [Dirección de la empresa]</p>
                <p><strong>Teléfono:</strong> 929 714 978</p>
                <p><strong>Email:</strong> fresaterra@gmail.com</p>
                <p className="mt-4">
                  <strong>Plazo de respuesta:</strong> La empresa responderá su reclamo en un plazo no mayor a treinta (30) días calendario, 
                  pudiendo ampliar el plazo hasta por treinta (30) días más, previa comunicación al consumidor.
                </p>
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-600">
                  Al enviar este reclamo, acepto que la información proporcionada es veraz y autorizo a FRESATERRA 
                  a utilizarla para dar respuesta a mi reclamo. Asimismo, autorizo el envío de una copia de este 
                  reclamo a INDECOPI conforme a la normativa vigente.
                </span>
              </label>
            </div>

            {/* Botón de Envío */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Registrar Reclamo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsBookPage;
