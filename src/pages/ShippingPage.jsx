import React, { useEffect } from 'react';
import { Truck, Clock, Package, MapPin, RefreshCw, AlertCircle, CheckCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
                        Envíos y Devoluciones
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Toda la información que necesitas sobre nuestros servicios de entrega y política de devoluciones
                    </p>
                </div>

                {/* Shipping Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Shipping Details */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-red-50 rounded-full mr-4">
                                    <Truck size={24} className="text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Información de Envíos</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-green-50 rounded-full mr-4">
                                        <MapPin size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Zonas de Cobertura</h3>
                                        <p className="text-gray-700 mb-2">
                                            Realizamos entregas únicamente en los siguientes distritos de Cusco:
                                        </p>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• Cusco (Centro Histórico)</li>
                                            <li>• Santiago</li>
                                            <li>• San Sebastián</li>
                                            <li>• San Jerónimo</li>
                                            <li>• Wanchaq</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full mr-4">
                                        <Clock size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Tiempos de Entrega</h3>
                                        <p className="text-gray-700 mb-2">
                                            <strong>Dentro de Cusco ciudad:</strong> 1-2 horas
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Los tiempos pueden variar según la demanda del día y las condiciones climáticas.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-purple-50 rounded-full mr-4">
                                        <Package size={18} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Horarios de Entrega</h3>
                                        <div className="text-gray-700 space-y-1">
                                            <p><strong>Lunes a Viernes:</strong> 8:00 AM - 6:00 PM</p>
                                            <p><strong>Sábados:</strong> 9:00 AM - 2:00 PM</p>
                                            <p><strong>Domingos:</strong> No hay entregas</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Costs */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-green-50 rounded-full mr-4">
                                    <CheckCircle size={24} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Costos de Envío</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-green-50 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-green-800 mb-2">¡ENVÍO GRATIS!</h3>
                                    <p className="text-green-700 mb-3">
                                        En compras mayores a <span className="font-bold text-xl">S/ 30.00</span>
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        *Solo se considera el valor de los productos (sin incluir envíos previos)
                                    </p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Envío Regular</h3>
                                    <p className="text-gray-700">
                                        Para compras menores a S/ 30.00: <span className="font-bold">S/ 5.00</span>
                                    </p>
                                </div>

                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-1">Importante</h4>
                                            <p className="text-yellow-700 text-sm">
                                                No es posible programar una hora exacta de entrega. Las entregas se realizan 
                                                dentro del tiempo estimado una vez confirmado el pago.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Process */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Proceso de tu Pedido
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    step: 1,
                                    title: "Confirmación",
                                    description: "Confirmas tu pedido y realizas el pago",
                                    icon: CheckCircle,
                                    color: "bg-green-50 text-green-600"
                                },
                                {
                                    step: 2,
                                    title: "Preparación",
                                    description: "Cosechamos y empacamos tus fresas frescas",
                                    icon: Package,
                                    color: "bg-blue-50 text-blue-600"
                                },
                                {
                                    step: 3,
                                    title: "En Camino",
                                    description: "Tu pedido está siendo enviado a tu dirección",
                                    icon: Truck,
                                    color: "bg-purple-50 text-purple-600"
                                },
                                {
                                    step: 4,
                                    title: "Entregado",
                                    description: "¡Disfruta de tus fresas frescas!",
                                    icon: CheckCircle,
                                    color: "bg-red-50 text-red-600"
                                }
                            ].map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
                                        <step.icon size={24} />
                                    </div>
                                    <div className="mb-2">
                                        <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
                                            Paso {step.step}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Returns Policy */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
                    <div className="p-8">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-orange-50 rounded-full mr-4">
                                <RefreshCw size={24} className="text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Política de Devoluciones</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Casos Aceptados</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <CheckCircle size={18} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                                        <p className="text-gray-700">Productos que lleguen en mal estado o dañados</p>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle size={18} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                                        <p className="text-gray-700">Fresas que no cumplan con nuestros estándares de calidad</p>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle size={18} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                                        <p className="text-gray-700">Pedidos incorrectos (producto diferente al solicitado)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Importante</h3>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-red-800 font-medium mb-2">Política de No Cancelación</p>
                                            <p className="text-red-700 text-sm">
                                                No aceptamos cancelaciones ni realizamos reembolsos una vez confirmado el pago. 
                                                El proceso de preparación inicia inmediatamente después de la confirmación.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Cómo solicitar una devolución?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center">
                                    <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">1</span>
                                    <span className="text-gray-700">Contáctanos inmediatamente al recibir el producto</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">2</span>
                                    <span className="text-gray-700">Proporciona fotos del producto y número de pedido</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">3</span>
                                    <span className="text-gray-700">Procesaremos tu solicitud en 24 horas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-red-50 rounded-xl shadow-sm p-8">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            ¿Tienes dudas sobre tu envío?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Nuestro equipo está listo para ayudarte con cualquier consulta sobre envíos y devoluciones
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
    );
};

export default ShippingPage;
