import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulamos el envío del formulario
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('¡Mensaje enviado correctamente! Te responderemos pronto.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Error al enviar el mensaje. Por favor, intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">Contáctanos</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre completo *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                                                    placeholder="Tu nombre completo"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Correo electrónico *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                                                    placeholder="+51 900 000 000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Asunto *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                                            >
                                                <option value="">Selecciona un asunto</option>
                                                <option value="producto">Consulta sobre productos</option>
                                                <option value="pedido">Problema con mi pedido</option>
                                                <option value="envio">Consulta sobre envíos</option>
                                                <option value="calidad">Reclamo de calidad</option>
                                                <option value="productor">Quiero ser productor</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mensaje *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <MessageSquare size={18} className="text-gray-400" />
                                            </div>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                                                placeholder="Cuéntanos cómo podemos ayudarte..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Enviar mensaje
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        {/* Contact Details */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de contacto</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
                                            <Phone size={18} className="text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Teléfono</h4>
                                            <p className="mt-1 text-sm text-gray-600">+51 929 714 978</p>
                                            <p className="text-xs text-gray-500 mt-1">Lunes a Viernes, 8:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
                                            <Mail size={18} className="text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Email</h4>
                                            <p className="mt-1 text-sm text-gray-600">fresaterra@gmail.com</p>
                                            <p className="text-xs text-gray-500 mt-1">Respuesta en 24 horas</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
                                            <MapPin size={18} className="text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Ubicación</h4>
                                            <p className="mt-1 text-sm text-gray-600">Cusco, Perú</p>
                                            <p className="text-xs text-gray-500 mt-1">Zona de cobertura: Cusco y alrededores</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
                                            <Clock size={18} className="text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Horarios de atención</h4>
                                            <div className="mt-1 text-sm text-gray-600">
                                                <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
                                                <p>Sábados: 9:00 AM - 2:00 PM</p>
                                                <p>Domingos: Cerrado</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Quick Links */}
                        <div className="bg-red-50 rounded-xl shadow-sm overflow-hidden p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Preguntas frecuentes</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">¿Cuánto tiempo demoran los envíos?</p>
                                    <p className="text-sm text-gray-600 mt-1">Entre 1-2 horas en Cusco ciudad</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">¿Cuál es el pedido mínimo?</p>
                                    <p className="text-sm text-gray-600 mt-1">No tenemos pedido mínimo</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">¿Hacen entregas los fines de semana?</p>
                                    <p className="text-sm text-gray-600 mt-1">Sí, sábados hasta las 2:00 PM</p>
                                </div>
                            </div>                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
