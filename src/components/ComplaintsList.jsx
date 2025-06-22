import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, Eye, Download } from 'lucide-react';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  useEffect(() => {
    // Cargar reclamos desde localStorage (temporal)
    const storedComplaints = JSON.parse(localStorage.getItem('reclamos') || '[]');
    setComplaints(storedComplaints);
    setFilteredComplaints(storedComplaints);
  }, []);

  useEffect(() => {
    // Filtrar reclamos por número o nombre
    const filtered = complaints.filter(complaint =>
      complaint.numeroHojaReclamacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComplaints(filtered);
  }, [searchTerm, complaints]);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'RECIBIDO':
        return 'bg-blue-100 text-blue-800';
      case 'EN_PROCESO':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESUELTO':
        return 'bg-green-100 text-green-800';
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-red-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Reclamos</h1>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por número de reclamo, nombre o apellido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Reclamos */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {complaints.length === 0 ? 'No hay reclamos registrados' : 'No se encontraron reclamos'}
                </h3>
                <p className="text-gray-500">
                  {complaints.length === 0 
                    ? 'Cuando se registren reclamos, aparecerán aquí.'
                    : 'Intenta con otros términos de búsqueda.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reclamante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredComplaints.map((complaint, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {complaint.numeroHojaReclamacion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {complaint.nombres} {complaint.apellidos}
                          </div>
                          <div className="text-sm text-gray-500">
                            {complaint.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {complaint.tipoReclamo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(complaint.fechaPresentacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.estado)}`}>
                            {complaint.estado.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-red-600 hover:text-red-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Información Legal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-blue-800 mb-2">Información sobre el Libro de Reclamaciones</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• El Libro de Reclamaciones está a disposición de todos los consumidores.</p>
              <p>• La empresa debe responder los reclamos en un plazo máximo de 30 días calendario.</p>
              <p>• Una copia de cada reclamo se envía automáticamente a INDECOPI.</p>
              <p>• Para más información, visite: <a href="https://www.indecopi.gob.pe" target="_blank" rel="noopener noreferrer" className="underline">www.indecopi.gob.pe</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;
