import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Package, Clock, Receipt } from 'lucide-react';

const PaymentSuccessPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link to="/products" className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                            <ArrowLeft size={18} className="mr-2" />
                            <span>Continuar comprando</span>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pago Exitoso</h1>
                </div>

                {/* Main Content */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Confirmado!</h2>
                            <p className="text-gray-600">
                                Tu pago ha sido procesado exitosamente por Mercado Pago.
                            </p>
                        </div>

                        {/* Success Details */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                                <CheckCircle size={16} className="mr-2" />
                                Tu transacción fue exitosa
                            </h3>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• El pago se procesó correctamente</li>
                                <li>• Tu pedido está siendo preparado</li>
                                <li>• El estado de tu pedido se actualizará en tiempo real</li>
                            </ul>
                        </div>

                        {/* Next Steps */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué sigue ahora?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Receipt className="h-5 w-5 text-blue-600 mt-0.5" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-gray-900">Revisar tu pedido</h4>
                                        <p className="text-sm text-gray-500">Consulta los detalles de tu compra y el estado de entrega en tu panel de pedidos.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-gray-900">Tiempo de preparación</h4>
                                        <p className="text-sm text-gray-500">Estamos preparando tu pedido con el máximo cuidado y frescura.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/orders"
                                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <Receipt size={18} className="mr-2" />
                                Ver Mis Pedidos
                            </Link>
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <Package size={18} className="mr-2" />
                                Seguir Comprando
                            </Link>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-100">
                        <h3 className="text-lg font-semibold text-green-900 mb-3">🎉 ¡Gracias por tu compra!</h3>
                        <div className="space-y-3 text-sm text-green-800">
                            <p>
                                <strong>Confirmación:</strong> Hemos recibido tu pago exitosamente.
                                Tu pedido será procesado y enviado según nuestros tiempos de entrega.
                            </p>
                            <p>
                                <strong>Notificaciones:</strong> Te mantendremos informado sobre el estado de tu pedido
                                mediante correo electrónico y podrás seguirlo en tiempo real desde tu panel de usuario.
                            </p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Tienes alguna pregunta?</h3>
                        <p className="text-gray-600 mb-4">
                            Si necesitas ayuda o tienes alguna consulta sobre tu pedido,
                            no dudes en contactarnos. Estamos aquí para ayudarte.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="mailto:soporte@fresaterra.com"
                                className="inline-flex items-center justify-center px-4 py-2 border border-green-700 text-green-700 hover:bg-green-50 font-medium rounded-lg transition-colors text-sm"
                            >
                                Contactar Soporte
                            </a>
                            <a
                                href="tel:+51-929-714-978"
                                className="inline-flex items-center justify-center px-4 py-2 border border-green-700 text-green-700 hover:bg-green-50 font-medium rounded-lg transition-colors text-sm"
                            >
                                Llamar: +51 929 714 978
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
