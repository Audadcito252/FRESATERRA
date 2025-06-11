import React, { useEffect } from 'react';
import { FileText, Shield, CreditCard, Truck, Users, AlertTriangle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
                        Términos y Condiciones
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones de uso
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        Última actualización: Enero 2025
                    </p>
                </div>

                {/* Terms Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido</h3>
                                <nav className="space-y-2">
                                    <a href="#general" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        1. Información General
                                    </a>
                                    <a href="#servicios" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        2. Servicios Ofrecidos
                                    </a>
                                    <a href="#registro" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        3. Registro y Cuentas
                                    </a>
                                    <a href="#pedidos" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        4. Pedidos y Precios
                                    </a>
                                    <a href="#pagos" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        5. Pagos y Facturación
                                    </a>
                                    <a href="#envios" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        6. Envíos y Entregas
                                    </a>
                                    <a href="#devoluciones" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        7. Devoluciones
                                    </a>
                                    <a href="#responsabilidades" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        8. Responsabilidades
                                    </a>
                                    <a href="#limitaciones" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        9. Limitaciones
                                    </a>
                                    <a href="#modificaciones" className="block text-sm text-gray-600 hover:text-red-600 transition-colors">
                                        10. Modificaciones
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Terms Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* General Information */}
                        <section id="general" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-blue-50 rounded-full mr-4">
                                        <FileText size={24} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">1. Información General</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        <strong>FresaTerra</strong> es un servicio de venta y entrega de fresas frescas 
                                        que opera en la ciudad de Cusco, Perú. Al acceder y utilizar nuestro sitio web 
                                        y servicios, aceptas cumplir con estos términos y condiciones.
                                    </p>
                                    <p>
                                        Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                                        Los cambios entrarán en vigor inmediatamente después de su publicación en 
                                        nuestro sitio web.
                                    </p>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-blue-800 text-sm">
                                            <strong>Importante:</strong> Si no estás de acuerdo con alguno de estos términos, 
                                            te recomendamos no utilizar nuestros servicios.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Services */}
                        <section id="servicios" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-green-50 rounded-full mr-4">
                                        <Shield size={24} className="text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">2. Servicios Ofrecidos</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        FresaTerra ofrece la venta y entrega a domicilio de fresas frescas cultivadas 
                                        en nuestros invernaderos ubicados en Cusco.
                                    </p>
                                    <h4 className="font-semibold text-gray-900">Nuestros servicios incluyen:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Venta de fresas frescas en diferentes presentaciones (1kg, 2kg, 5kg)</li>
                                        <li>Entrega a domicilio en distritos específicos de Cusco</li>
                                        <li>Plataforma web para realizar pedidos</li>
                                        <li>Atención al cliente vía teléfono y correo electrónico</li>
                                    </ul>
                                    <p>
                                        Nos esforzamos por mantener la disponibilidad de nuestros productos, pero 
                                        no garantizamos que siempre estén en stock debido a la naturaleza perecedera 
                                        de los productos frescos.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Registration */}
                        <section id="registro" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-purple-50 rounded-full mr-4">
                                        <Users size={24} className="text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">3. Registro y Cuentas de Usuario</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        Para realizar pedidos en FresaTerra, es obligatorio crear una cuenta de usuario 
                                        proporcionando información veraz y actualizada.
                                    </p>
                                    <h4 className="font-semibold text-gray-900">Responsabilidades del usuario:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Proporcionar información personal veraz y completa</li>
                                        <li>Mantener actualizada tu información de contacto y direcciones</li>
                                        <li>Proteger la confidencialidad de tu contraseña</li>
                                        <li>Notificar inmediatamente cualquier uso no autorizado de tu cuenta</li>
                                        <li>Ser responsable de todas las actividades realizadas desde tu cuenta</li>
                                    </ul>
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <AlertTriangle size={20} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-yellow-800 text-sm">
                                                Nos reservamos el derecho de suspender o cancelar cuentas que proporcionen 
                                                información falsa o que violen estos términos.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Orders and Pricing */}
                        <section id="pedidos" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-orange-50 rounded-full mr-4">
                                        <FileText size={24} className="text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">4. Pedidos y Precios</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <h4 className="font-semibold text-gray-900">Realización de Pedidos:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Los pedidos se confirman únicamente después del pago exitoso</li>
                                        <li>Una vez confirmado el pago, el pedido entra inmediatamente en preparación</li>
                                        <li>No se aceptan cancelaciones una vez confirmado el pago</li>
                                        <li>No tenemos pedido mínimo</li>
                                    </ul>
                                    
                                    <h4 className="font-semibold text-gray-900">Precios:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Todos los precios están expresados en soles peruanos (S/)</li>
                                        <li>Los precios incluyen IGV cuando corresponda</li>
                                        <li>Nos reservamos el derecho de modificar precios sin previo aviso</li>
                                        <li>Los precios vigentes son los mostrados al momento de realizar el pedido</li>
                                    </ul>

                                    <div className="bg-red-50 rounded-lg p-4">
                                        <p className="text-red-800 text-sm font-medium">
                                            Política de No Cancelación: Una vez confirmado el pago, no se aceptan 
                                            cancelaciones ni reembolsos, ya que iniciamos inmediatamente el proceso 
                                            de cosecha y preparación de tu pedido.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payments */}
                        <section id="pagos" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-green-50 rounded-full mr-4">
                                        <CreditCard size={24} className="text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">5. Pagos y Facturación</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <h4 className="font-semibold text-gray-900">Métodos de Pago Aceptados:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Tarjetas de débito y crédito (a través de Mercado Pago)</li>
                                        <li>Transferencias bancarias (Mercado Pago)</li>
                                        <li>Yape y otros métodos disponibles en Mercado Pago</li>
                                    </ul>
                                    
                                    <h4 className="font-semibold text-gray-900">Condiciones de Pago:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>El pago debe realizarse al momento de confirmar el pedido</li>
                                        <li>No aceptamos pagos contra entrega</li>
                                        <li>Utilizamos Mercado Pago como procesador de pagos seguro</li>
                                        <li>No almacenamos información de tarjetas de crédito en nuestros servidores</li>
                                    </ul>

                                    <h4 className="font-semibold text-gray-900">Facturación:</h4>
                                    <p>
                                        Actualmente no emitimos facturas ni boletas electrónicas, ya que nos encontramos 
                                        en una etapa inicial de desarrollo. Agradecemos tu comprensión mientras 
                                        implementamos estos servicios.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Shipping */}
                        <section id="envios" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-blue-50 rounded-full mr-4">
                                        <Truck size={24} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">6. Envíos y Entregas</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <h4 className="font-semibold text-gray-900">Cobertura de Entregas:</h4>
                                    <p>Realizamos entregas únicamente en los siguientes distritos de Cusco:</p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Cusco (Centro Histórico)</li>
                                        <li>Santiago</li>
                                        <li>San Sebastián</li>
                                        <li>San Jerónimo</li>
                                        <li>Wanchaq</li>
                                    </ul>
                                    
                                    <h4 className="font-semibold text-gray-900">Condiciones de Entrega:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Tiempo estimado: 1-2 horas desde la confirmación del pago</li>
                                        <li>Horarios: Lunes a viernes 8:00 AM - 6:00 PM, sábados 9:00 AM - 2:00 PM</li>
                                        <li>Envío gratis en compras mayores a S/ 30.00</li>
                                        <li>Costo de envío regular: S/ 5.00</li>
                                        <li>No es posible programar hora exacta de entrega</li>
                                    </ul>

                                    <p>
                                        El cliente debe estar disponible en la dirección proporcionada durante el 
                                        horario de entrega. No nos hacemos responsables por direcciones incorrectas 
                                        o falta de disponibilidad del cliente.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Returns */}
                        <section id="devoluciones" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-red-50 rounded-full mr-4">
                                        <AlertTriangle size={24} className="text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">7. Política de Devoluciones</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <h4 className="font-semibold text-gray-900">Casos en los que Aceptamos Devoluciones:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Productos que lleguen en mal estado o dañados</li>
                                        <li>Fresas que no cumplan con nuestros estándares de calidad</li>
                                        <li>Pedidos incorrectos (producto diferente al solicitado)</li>
                                    </ul>
                                    
                                    <h4 className="font-semibold text-gray-900">Proceso para Solicitar Devolución:</h4>
                                    <ol className="list-decimal pl-6 space-y-2">
                                        <li>Contactar inmediatamente al recibir el producto problemático</li>
                                        <li>Proporcionar fotos del producto y número de pedido</li>
                                        <li>Esperar la evaluación de nuestro equipo (máximo 24 horas)</li>
                                    </ol>

                                    <div className="bg-red-50 rounded-lg p-4">
                                        <p className="text-red-800 text-sm font-medium">
                                            Importante: No aceptamos devoluciones por cambio de opinión, 
                                            cancelaciones tardías o problemas de disponibilidad del cliente 
                                            durante la entrega.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Responsibilities */}
                        <section id="responsabilidades" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-purple-50 rounded-full mr-4">
                                        <Shield size={24} className="text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">8. Responsabilidades</h2>
                                </div>
                                
                                <div className="space-y-6 text-gray-700">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Responsabilidades de FresaTerra:</h4>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Entregar productos frescos y de calidad</li>
                                            <li>Cumplir con los tiempos de entrega estimados</li>
                                            <li>Mantener la seguridad de los datos del cliente</li>
                                            <li>Proporcionar atención al cliente adecuada</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Responsabilidades del Cliente:</h4>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Proporcionar información correcta y actualizada</li>
                                            <li>Estar disponible durante la entrega</li>
                                            <li>Verificar el producto al momento de la entrega</li>
                                            <li>Reportar cualquier problema inmediatamente</li>
                                            <li>Usar el servicio de manera responsable</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Limitations */}
                        <section id="limitaciones" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-yellow-50 rounded-full mr-4">
                                        <AlertTriangle size={24} className="text-yellow-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">9. Limitaciones de Responsabilidad</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        FresaTerra no será responsable por daños indirectos, incidentales, 
                                        especiales o consecuentes que resulten del uso de nuestros servicios.
                                    </p>
                                    
                                    <h4 className="font-semibold text-gray-900">Limitaciones específicas:</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Retrasos en entregas debido a condiciones climáticas adversas</li>
                                        <li>Interrupciones del servicio por mantenimiento técnico</li>
                                        <li>Problemas con el procesador de pagos (Mercado Pago)</li>
                                        <li>Falta de disponibilidad de productos por factores externos</li>
                                    </ul>

                                    <p>
                                        Nuestra responsabilidad máxima se limitará al valor del pedido 
                                        específico en cuestión.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Modifications */}
                        <section id="modificaciones" className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-indigo-50 rounded-full mr-4">
                                        <FileText size={24} className="text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">10. Modificaciones y Contacto</h2>
                                </div>
                                
                                <div className="space-y-4 text-gray-700">
                                    <h4 className="font-semibold text-gray-900">Modificaciones a los Términos:</h4>
                                    <p>
                                        Nos reservamos el derecho de modificar estos términos y condiciones en 
                                        cualquier momento. Los cambios serán efectivos inmediatamente después de 
                                        su publicación en nuestro sitio web.
                                    </p>
                                    
                                    <p>
                                        Es responsabilidad del usuario revisar periódicamente estos términos 
                                        para mantenerse informado de cualquier cambio.
                                    </p>

                                    <h4 className="font-semibold text-gray-900">Ley Aplicable:</h4>
                                    <p>
                                        Estos términos se rigen por las leyes de la República del Perú. 
                                        Cualquier disputa será resuelta en los tribunales competentes de Cusco, Perú.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="bg-red-50 rounded-xl shadow-sm">
                            <div className="p-8 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    ¿Preguntas sobre nuestros términos?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Si tienes dudas sobre estos términos y condiciones, no dudes en contactarnos
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
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
