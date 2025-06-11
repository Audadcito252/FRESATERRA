import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItems, setExpandedItems] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const faqData = [
        {
            id: 1,
            category: 'productos',
            question: '¿Qué tipos de fresas venden?',
            answer: 'Ofrecemos fresas frescas de la más alta calidad, cultivadas en nuestros invernaderos en Cusco. Nuestras fresas son dulces, jugosas y están disponibles en diferentes presentaciones: 1kg, 2kg y 5kg.'
        },
        {
            id: 2,
            category: 'productos',
            question: '¿Las fresas son orgánicas?',
            answer: 'Sí, todas nuestras fresas son cultivadas con prácticas sostenibles y respetuosas con el medio ambiente. Utilizamos métodos de cultivo responsable sin pesticidas dañinos.'
        },
        {
            id: 3,
            category: 'productos',
            question: '¿Cómo conservo las fresas para que duren más?',
            answer: 'Recomendamos guardar las fresas en el refrigerador, preferiblemente en el cajón de verduras. No las laves hasta que vayas a consumirlas. En condiciones óptimas, pueden durar de 3 a 5 días.'
        },
        {
            id: 4,
            category: 'envios',
            question: '¿Cuánto tiempo demoran los envíos?',
            answer: 'Realizamos envíos únicamente dentro de la ciudad del Cusco, específicamente en los distritos de Cusco, Santiago, San Sebastián, San Jerónimo y Wanchaq. Los pedidos dentro de estos distritos suelen entregarse en un tiempo estimado de 1 a 2 horas. Por el momento, no realizamos entregas fuera de estos distritos debido a limitaciones logísticas.'
        },
        {
            id: 5,
            category: 'envios',
            question: '¿Hacen entregas los fines de semana?',
            answer: 'Sí, realizamos entregas los sábados de 9:00 AM a 2:00 PM. Los domingos no tenemos servicio de entrega para garantizar el descanso de nuestro equipo.'
        },        {
            id: 6,
            category: 'envios',
            question: '¿Cuál es el costo de envío?',
            answer: 'El envío cuesta S/ 5.00 si el total de tu compra es menor a S/ 30.00. Si tu compra supera los S/ 30.00 en productos, el envío es completamente gratis. Nota: Solo se toma en cuenta el valor de los productos para aplicar el envío gratuito.'
        },
        {
            id: 7,
            category: 'envios',
            question: '¿Puedo programar una entrega para una hora específica?',
            answer: 'No es posible programar una hora exacta de entrega. Las entregas se realizan dentro de un tiempo estimado una vez confirmado el pago y el pedido. A partir de esa confirmación, el envío suele demorar entre 1 a 2 horas, según la zona y la demanda del día.'
        },
        {
            id: 8,
            category: 'pedidos',
            question: '¿Cuál es el pedido mínimo?',
            answer: 'No tenemos pedido mínimo. Puedes ordenar desde 1kg de fresas hasta la cantidad que necesites.'
        },
        {
            id: 9,
            category: 'pedidos',
            question: '¿Puedo cancelar mi pedido?',
            answer: 'Por el momento, no aceptamos cancelaciones ni realizamos reembolsos una vez confirmado el pago. Antes de hacer un pedido, asegúrate de que estás completamente seguro, ya que el proceso inicia inmediatamente después de la confirmación. Esta política está detallada en nuestros Términos y Condiciones.'
        },
        {
            id: 10,
            category: 'pedidos',
            question: '¿Cómo puedo rastrear mi pedido?',
            answer: 'No contamos con rastreo en tiempo real. Sin embargo, puedes verificar el estado de tu pedido ingresando a la sección “Mis Pedidos” en tu perfil dentro de nuestra aplicación web. Ahí verás las actualizaciones según el avance del pedido.'
        },
        {
            id: 11,
            category: 'pagos',
            question: '¿Qué métodos de pago aceptan?',
            answer: 'Aceptamos pagos a través de Mercado Pago, que incluye: tarjetas de débito y crédito, transferencias bancarias, Yape y más opciones disponibles en la plataforma. No aceptamos pagos contra entrega.'
        },
        {
            id: 12,
            category: 'pagos',
            question: '¿Es seguro pagar en línea?',
            answer: 'Absolutamente seguro. Utilizamos Mercado Pago, una plataforma de pagos líder en Latinoamérica que cuenta con los más altos estándares de seguridad. Todos los datos de tu tarjeta están encriptados y protegidos.'
        },
        {
            id: 13,
            category: 'pagos',            question: '¿Puedo obtener una factura o boleta?',
            answer: 'Por el momento, no emitimos facturas ni boletas electrónicas, ya que estamos en una etapa inicial de crecimiento. Agradecemos tu comprensión mientras seguimos desarrollando y mejorando nuestro servicio.'
        },
        {
            id: 14,
            category: 'cuenta',
            question: '¿Necesito crear una cuenta para comprar?',
            answer: 'Sí, necesitas crear una cuenta para realizar pedidos. Esto nos permite ofrecerte un mejor servicio personalizado, guardar tus direcciones de entrega y mantener un historial completo de tus pedidos.'
        },
        {
            id: 15,
            category: 'cuenta',
            question: '¿Cómo cambio mi contraseña?',
            answer: 'Puedes cambiar tu contraseña desde tu perfil en la sección "Configuración" o utilizando la opción "Olvidé mi contraseña" en la página de inicio de sesión.'
        },
        {
            id: 16,
            category: 'cuenta',
            question: '¿Puedo tener múltiples direcciones de entrega?',
            answer: 'Sí, puedes agregar y guardar múltiples direcciones de entrega en tu perfil. Esto te permite enviar pedidos a diferentes ubicaciones fácilmente.'
        },        {
            id: 17,
            category: 'calidad',
            question: '¿Cómo garantizan la frescura de las fresas?',
            answer: 'Las fresas se cosechan directamente del invernadero una vez que recibimos tu pedido. Luego se empacan cuidadosamente en envases especiales y se envían el mismo día, asegurando su máxima frescura y calidad al momento de la entrega.'
        },
        {
            id: 18,
            category: 'otros',
            question: '¿Hacen entregas fuera de Cusco?',
            answer: 'Por el momento, solo realizamos entregas dentro de la ciudad del Cusco y alrededores. Estamos evaluando la posibilidad de expandir nuestro servicio a otras ciudades del Perú en el futuro cercano.'
        },
        {
            id: 19,
            category: 'otros',
            question: '¿Puedo visitarlos físicamente?',
            answer: 'Somos un negocio principalmente online para garantizar la frescura del producto. Si deseas visitarnos, puedes coordinar una cita previa escribiéndonos por Facebook, Instagram o a nuestro correo electrónico.'
        }
    ];

    const categories = [
        { id: 'all', name: 'Todas las preguntas', count: faqData.length },
        { id: 'productos', name: 'Productos', count: faqData.filter(item => item.category === 'productos').length },
        { id: 'envios', name: 'Envíos', count: faqData.filter(item => item.category === 'envios').length },
        { id: 'pedidos', name: 'Pedidos', count: faqData.filter(item => item.category === 'pedidos').length },
        { id: 'pagos', name: 'Pagos', count: faqData.filter(item => item.category === 'pagos').length },
        { id: 'cuenta', name: 'Mi Cuenta', count: faqData.filter(item => item.category === 'cuenta').length },
        { id: 'calidad', name: 'Calidad', count: faqData.filter(item => item.category === 'calidad').length },
        { id: 'otros', name: 'Otros', count: faqData.filter(item => item.category === 'otros').length }
    ];

    const filteredFAQs = faqData.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleExpanded = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={20} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar en preguntas frecuentes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>
                                <ul className="space-y-2">
                                    {categories.map(category => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                    selectedCategory === category.id
                                                        ? 'bg-red-50 text-red-600 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{category.name}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        selectedCategory === category.id
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {category.count}
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="lg:col-span-3">
                        {filteredFAQs.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No se encontraron resultados
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    No encontramos preguntas que coincidan con tu búsqueda.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    Ver todas las preguntas
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFAQs.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <button
                                            onClick={() => toggleExpanded(item.id)}
                                            className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-medium text-gray-900 pr-4">
                                                    {item.question}
                                                </h3>
                                                {expandedItems[item.id] ? (
                                                    <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                                                )}
                                            </div>
                                        </button>
                                        {expandedItems[item.id] && (
                                            <div className="px-6 pb-4">
                                                <div className="border-t border-gray-100 pt-4">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Contact Section */}
                        <div className="mt-12 bg-red-50 rounded-xl shadow-sm p-8">
                            <div className="text-center">
                                <MessageCircle size={48} className="text-red-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    ¿No encontraste lo que buscabas?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Nuestro equipo está aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                                </p>                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Mail size={18} className="mr-2" />
                                        Enviar mensaje
                                    </Link>
                                    <div className="flex items-center text-red-600 font-medium">
                                        <Phone size={18} className="mr-2" />
                                        <span>929 714 978</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
