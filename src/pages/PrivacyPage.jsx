import React, { useEffect } from 'react';
import { Shield, Lock, Eye, Database, Mail, Phone, User, Clock, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
                        Política de Privacidad
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        En FresaTerra valoramos y protegemos tu privacidad. Conoce cómo recopilamos, usamos y protegemos tu información personal.
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                        <p>Última actualización: 10 de junio de 2025</p>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
                    <div className="p-8">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-blue-50 rounded-full mr-4">
                                <FileText size={24} className="text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Tabla de Contenidos</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'informacion-general', title: '1. Información General' },
                                { id: 'informacion-recopilada', title: '2. Información que Recopilamos' },
                                { id: 'uso-informacion', title: '3. Uso de la Información' },
                                { id: 'proteccion-datos', title: '4. Protección de Datos' },
                                { id: 'compartir-informacion', title: '5. Compartir Información' },
                                { id: 'cookies', title: '6. Cookies y Tecnologías' },
                                { id: 'derechos-usuario', title: '7. Derechos del Usuario' },
                                { id: 'menores-edad', title: '8. Menores de Edad' },
                                { id: 'cambios-politica', title: '9. Cambios en la Política' },
                                { id: 'contacto', title: '10. Contacto' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleScrollToSection(item.id)}
                                    className="text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-red-200"
                                >
                                    <span className="text-red-600 hover:text-red-700 font-medium">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Privacy Policy Sections */}
                <div className="space-y-8">
                    {/* 1. Información General */}
                    <div id="informacion-general" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-green-50 rounded-full mr-4">
                                    <Shield size={24} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">1. Información General</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-4">
                                    FresaTerra ("nosotros", "nuestro" o "la empresa") está comprometida con la protección 
                                    de la privacidad y los datos personales de nuestros usuarios. Esta Política de Privacidad 
                                    describe cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando 
                                    utiliza nuestros servicios de entrega de fresas frescas en Cusco, Perú.
                                </p>
                                <p className="mb-4">
                                    Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. 
                                    Si no está de acuerdo con algún aspecto de esta política, le pedimos que no utilice 
                                    nuestros servicios.
                                </p>
                                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <p className="text-blue-800 text-sm">
                                            Esta política se aplica únicamente a los servicios proporcionados por FresaTerra 
                                            y no cubre sitios web o servicios de terceros que puedan estar vinculados desde 
                                            nuestra plataforma.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Información que Recopilamos */}
                    <div id="informacion-recopilada" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-purple-50 rounded-full mr-4">
                                    <Database size={24} className="text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">2. Información que Recopilamos</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Personal</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <User size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Nombre completo</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Mail size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Dirección de correo electrónico</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Phone size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Número de teléfono</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Database size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Dirección de entrega</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de Uso</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <Eye size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Historial de pedidos</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Clock size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Preferencias de productos</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Database size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Información de pago (procesada por MercadoPago)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Eye size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>Interacciones con nuestro servicio</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Uso de la Información */}
                    <div id="uso-informacion" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-blue-50 rounded-full mr-4">
                                    <Eye size={24} className="text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">3. Uso de la Información</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-4">Utilizamos su información personal para los siguientes propósitos:</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-800 mb-2">Servicios Principales</h4>
                                        <ul className="text-green-700 text-sm space-y-1">
                                            <li>• Procesar y entregar sus pedidos</li>
                                            <li>• Comunicarnos sobre el estado de su pedido</li>
                                            <li>• Coordinar entregas y horarios</li>
                                            <li>• Procesar pagos de manera segura</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-800 mb-2">Mejora del Servicio</h4>
                                        <ul className="text-blue-700 text-sm space-y-1">
                                            <li>• Personalizar su experiencia</li>
                                            <li>• Mejorar nuestros productos y servicios</li>
                                            <li>• Atención al cliente y soporte técnico</li>
                                            <li>• Análisis y estadísticas internas</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="bg-yellow-50 rounded-lg p-4 mt-6">
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-1">Comunicaciones</h4>
                                            <p className="text-yellow-700 text-sm">
                                                Solo enviamos comunicaciones relacionadas con sus pedidos y actualizaciones 
                                                importantes del servicio. No enviamos correos promocionales sin su consentimiento explícito.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Protección de Datos */}
                    <div id="proteccion-datos" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-red-50 rounded-full mr-4">
                                    <Lock size={24} className="text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">4. Protección de Datos</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-6">
                                    Implementamos medidas de seguridad técnicas y organizativas para proteger su información 
                                    personal contra acceso no autorizado, alteración, divulgación o destrucción.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Lock size={24} className="text-red-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Encriptación</h4>
                                        <p className="text-gray-600 text-sm">
                                            Todos los datos sensibles se almacenan y transmiten de forma encriptada
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Shield size={24} className="text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Acceso Limitado</h4>
                                        <p className="text-gray-600 text-sm">
                                            Solo personal autorizado tiene acceso a su información personal
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="p-4 bg-green-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Database size={24} className="text-green-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Respaldos Seguros</h4>
                                        <p className="text-gray-600 text-sm">
                                            Realizamos copias de seguridad regulares en servidores protegidos
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Compartir Información */}
                    <div id="compartir-informacion" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-orange-50 rounded-full mr-4">
                                    <User size={24} className="text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">5. Compartir Información</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-4">
                                    No vendemos, alquilamos ni compartimos su información personal con terceros para 
                                    fines comerciales. Solo compartimos información en las siguientes circunstancias:
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-1">Proveedores de Servicios</h4>
                                        <p className="text-gray-600 text-sm">
                                            Con MercadoPago para procesar pagos de forma segura (sujeto a su propia política de privacidad)
                                        </p>
                                    </div>
                                    
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-1">Requerimientos Legales</h4>
                                        <p className="text-gray-600 text-sm">
                                            Cuando sea requerido por ley o por autoridades competentes
                                        </p>
                                    </div>
                                    
                                    <div className="border-l-4 border-red-500 pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-1">Protección de Derechos</h4>
                                        <p className="text-gray-600 text-sm">
                                            Para proteger nuestros derechos, propiedad o seguridad, o los de nuestros usuarios
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Cookies */}
                    <div id="cookies" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-purple-50 rounded-full mr-4">
                                    <Database size={24} className="text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">6. Cookies y Tecnologías Similares</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-4">
                                    Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Cookies Esenciales</h4>
                                        <ul className="text-gray-600 text-sm space-y-1">
                                            <li>• Funcionalidad básica del carrito de compras</li>
                                            <li>• Mantener su sesión iniciada</li>
                                            <li>• Recordar sus preferencias</li>
                                            <li>• Seguridad y autenticación</li>
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Cookies de Análisis</h4>
                                        <ul className="text-gray-600 text-sm space-y-1">
                                            <li>• Entender cómo usa nuestro sitio</li>
                                            <li>• Mejorar el rendimiento</li>
                                            <li>• Identificar problemas técnicos</li>
                                            <li>• Estadísticas de uso anónimas</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                                    <p className="text-gray-700 text-sm">
                                        <strong>Control de Cookies:</strong> Puede configurar su navegador para rechazar cookies, 
                                        aunque esto puede afectar la funcionalidad de algunos aspectos de nuestro servicio.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7. Derechos del Usuario */}
                    <div id="derechos-usuario" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-green-50 rounded-full mr-4">
                                    <User size={24} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">7. Derechos del Usuario</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-6">
                                    Usted tiene los siguientes derechos respecto a su información personal:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="p-2 bg-blue-50 rounded-full mr-3 mt-1">
                                                <Eye size={16} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Acceso</h4>
                                                <p className="text-gray-600 text-sm">Solicitar una copia de la información que tenemos sobre usted</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="p-2 bg-green-50 rounded-full mr-3 mt-1">
                                                <FileText size={16} className="text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Rectificación</h4>
                                                <p className="text-gray-600 text-sm">Corregir información inexacta o incompleta</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="p-2 bg-red-50 rounded-full mr-3 mt-1">
                                                <AlertCircle size={16} className="text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Eliminación</h4>
                                                <p className="text-gray-600 text-sm">Solicitar la eliminación de su información personal</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="p-2 bg-purple-50 rounded-full mr-3 mt-1">
                                                <Lock size={16} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Limitación</h4>
                                                <p className="text-gray-600 text-sm">Restringir el procesamiento de su información</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="p-2 bg-orange-50 rounded-full mr-3 mt-1">
                                                <Database size={16} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Portabilidad</h4>
                                                <p className="text-gray-600 text-sm">Recibir sus datos en un formato estructurado</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="p-2 bg-yellow-50 rounded-full mr-3 mt-1">
                                                <Shield size={16} className="text-yellow-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Oposición</h4>
                                                <p className="text-gray-600 text-sm">Oponerse al procesamiento de su información</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                    <p className="text-blue-800 text-sm">
                                        <strong>Ejercer sus derechos:</strong> Para ejercer cualquiera de estos derechos, 
                                        contáctenos a través de los medios indicados en la sección de contacto. 
                                        Responderemos a su solicitud dentro de 30 días calendario.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 8. Menores de Edad */}
                    <div id="menores-edad" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-yellow-50 rounded-full mr-4">
                                    <AlertCircle size={24} className="text-yellow-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">8. Menores de Edad</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-4">
                                    Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos 
                                    conscientemente información personal de menores de edad sin el consentimiento parental apropiado.
                                </p>
                                
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-1">Importante</h4>
                                            <p className="text-yellow-700 text-sm">
                                                Si descubrimos que hemos recopilado información de un menor de 18 años sin 
                                                el consentimiento parental adecuado, tomaremos medidas para eliminar esa 
                                                información de nuestros sistemas lo antes posible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 9. Cambios en la Política */}
                    <div id="cambios-politica" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-blue-50 rounded-full mr-4">
                                    <Clock size={24} className="text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">9. Cambios en la Política</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-4">
                                    Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. 
                                    Cuando realicemos cambios significativos, le notificaremos mediante:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-800 mb-2">Notificación Directa</h4>
                                        <ul className="text-blue-700 text-sm space-y-1">
                                            <li>• Correo electrónico</li>
                                            <li>• Mensaje en el sitio web</li>
                                            <li>• Notificación en la aplicación</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-800 mb-2">Publicación</h4>
                                        <ul className="text-green-700 text-sm space-y-1">
                                            <li>• Actualización en esta página</li>
                                            <li>• Nueva fecha de "última actualización"</li>
                                            <li>• Aviso en redes sociales</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <p className="mt-4 text-sm text-gray-600">
                                    <strong>Uso continuado:</strong> Su uso continuado de nuestros servicios después de que 
                                    los cambios entren en vigencia constituye su aceptación de la nueva política.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 10. Contacto */}
                    <div id="contacto" className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-red-50 rounded-full mr-4">
                                    <Mail size={24} className="text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">10. Contacto</h2>
                            </div>
                            
                            <div className="prose max-w-none text-gray-700">
                                <p className="mb-6">
                                    Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad 
                                    o el manejo de su información personal, puede contactarnos a través de:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-50 rounded-lg p-6">
                                        <h4 className="font-semibold text-red-800 mb-4">Información de Contacto</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <Mail size={18} className="text-red-600 mr-3" />
                                                <span className="text-red-700">info@fresaterra.com</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone size={18} className="text-red-600 mr-3" />
                                                <span className="text-red-700">929 714 978</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="font-semibold text-gray-800 mb-4">Tiempo de Respuesta</h4>
                                        <div className="space-y-2 text-gray-700">
                                            <p className="text-sm">• Consultas generales: 24-48 horas</p>
                                            <p className="text-sm">• Solicitudes de derechos: Máximo 30 días</p>
                                            <p className="text-sm">• Emergencias de privacidad: Inmediato</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-red-50 rounded-xl shadow-sm p-8 mt-12">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            ¿Preguntas sobre tu privacidad?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Estamos comprometidos con la transparencia. No dudes en contactarnos si tienes alguna duda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Mail size={18} className="mr-2" />
                                Enviar consulta
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
    );
};

export default PrivacyPage;
