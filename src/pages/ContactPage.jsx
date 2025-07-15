import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import SEOHelmet from '../components/SEOHelmet';

const initialErrors = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
};

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const fieldError = validate({ ...formData })[name];
        setErrors(prev => ({ ...prev, [name]: fieldError }));
    };

    // Validaciones robustas para cada campo
    const validate = (data) => {
        const newErrors = {};
        // Nombre: solo letras y espacios, mínimo 2 caracteres
        if (!data.name.trim()) {
            newErrors.name = 'El nombre es obligatorio.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(data.name.trim())) {
            newErrors.name = 'El nombre solo debe contener letras y espacios (mínimo 2 caracteres).';
        }
        // Correo: formato válido
        if (!data.email.trim()) {
            newErrors.email = 'El correo es obligatorio.';
        } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
            newErrors.email = 'El correo no es válido.';
        }
        // Teléfono: 9 dígitos, empieza con 9, solo números
        if (!data.phone.trim()) {
            newErrors.phone = 'El teléfono es obligatorio.';
        } else if (!/^9\d{8}$/.test(data.phone.trim())) {
            newErrors.phone = 'El teléfono debe tener 9 dígitos, empezar con 9 y no incluir el código de país.';
        }
        // Asunto: obligatorio y válido
        if (!data.subject.trim()) {
            newErrors.subject = 'Selecciona un asunto.';
        } else if (!['producto', 'pedido', 'envio', 'calidad', 'productor', 'otro'].includes(data.subject)) {
            newErrors.subject = 'El asunto seleccionado no es válido.';
        }
        // Mensaje: obligatorio, mínimo 10 caracteres
        if (!data.message.trim()) {
            newErrors.message = 'El mensaje es obligatorio.';
        } else if (data.message.trim().length < 10) {
            newErrors.message = 'El mensaje debe tener al menos 10 caracteres.';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, phone: true, subject: true, message: true });
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        const hasErrors = Object.values(validationErrors).some(Boolean);
        if (hasErrors) return;
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('¡Mensaje enviado correctamente! Te responderemos pronto.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTouched({});
            setErrors(initialErrors);
        } catch (error) {
            toast.error('Error al enviar el mensaje. Por favor, intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Solo letras y espacios para nombre (en onChange y onKeyDown)
    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
        setFormData(prev => ({ ...prev, name: value }));
        setTouched(prev => ({ ...prev, name: true }));
        setErrors(prev => ({ ...prev, name: '' }));
    };
    const handleNameKeyDown = (e) => {
        // Permitir teclas de control, espacio y letras
        if (
            !(
                (e.key.length === 1 && /[A-Za-zÁÉÍÓÚáéíóúÑñ ]/.test(e.key)) ||
                ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
            )
        ) {
            e.preventDefault();
        }
    };
    // Solo números para teléfono (en onChange y onKeyDown)
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 9) value = value.slice(0, 9);
        setFormData(prev => ({ ...prev, phone: value }));
        setTouched(prev => ({ ...prev, phone: true }));
        setErrors(prev => ({ ...prev, phone: '' }));
    };
    const handlePhoneKeyDown = (e) => {
        // Permitir solo números y teclas de control
        if (
            !(
                (e.key.length === 1 && /[0-9]/.test(e.key)) ||
                ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
            )
        ) {
            e.preventDefault();
        }
    };

    return (
        <>
            <SEOHelmet 
                title="Contáctanos"
                description="Contáctanos - FresaTerra Cusco | Fresas frescas entregadas en 1-2 horas. Atención personalizada, WhatsApp directo y respuesta en 24 horas. ¡Estamos aquí para ayudarte!"
                keywords="contacto fresaterra, servicio cliente cusco, whatsapp fresas, soporte fresaterra, contactar fresas cusco"
                canonical="/contact"
                ogTitle="Contáctanos - FresaTerra Cusco"
                ogDescription="¿Necesitas ayuda? Contáctanos vía WhatsApp, email o teléfono. Atención personalizada para tu pedido de fresas frescas en Cusco."
            />
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
                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                                                    onChange={handleNameChange}
                                                    onKeyDown={handleNameKeyDown}
                                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Tu nombre completo"
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
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
                                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono *
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
                                                    onChange={handlePhoneChange}
                                                    onKeyDown={handlePhoneKeyDown}
                                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="900000000"
                                                    maxLength={9}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
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
                                                className={`block w-full py-3 px-3 border rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Selecciona un asunto</option>
                                                <option value="producto">Consulta sobre productos</option>
                                                <option value="pedido">Problema con mi pedido</option>
                                                <option value="envio">Consulta sobre envíos</option>
                                                <option value="calidad">Reclamo de calidad</option>
                                                <option value="productor">Quiero ser productor</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                            {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
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
                                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Cuéntanos cómo podemos ayudarte..."
                                            />
                                        </div>
                                        {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                       
                                        <button
                                            type="button"
                                            className="w-full sm:w-1/2 inline-flex items-center justify-center py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-base shadow-sm"
                                            onClick={() => {
                                                const validationErrors = validate(formData);
                                                setErrors(validationErrors);
                                                if (Object.keys(validationErrors).length > 0) {
                                                    toast.error('Por favor corrige los errores antes de continuar a WhatsApp.');
                                                    return;
                                                }
                                                const url = buildWhatsAppUrl(formData);
                                                window.open(url, '_blank');
                                            }}
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-5 mr-2" />
                                            WhatsApp
                                        </button>
                                    </div>
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
        </>
    );
};

export default ContactPage;
