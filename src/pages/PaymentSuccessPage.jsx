import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Package, Clock, Receipt } from 'lucide-react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import paymentsService from '../services/paymentsService';
import { toast } from 'react-toastify';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const { clearCart } = useShoppingCart();
    const navigate = useNavigate();
    const [orderInfo, setOrderInfo] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Memoize the payment confirmation function to prevent recreating on every render
    const handlePaymentConfirmation = useCallback(async (orderId, paymentId, status) => {
        if (isProcessing) return; // Prevent multiple calls
        
        setIsProcessing(true);
        
        try {
            await paymentsService.handlePaymentSuccess({
                order_id: orderId,
                payment_id: paymentId,
                status: status
            });
            
            console.log('Pago confirmado exitosamente');
            toast.success('¡Pago confirmado exitosamente!');
        } catch (error) {
            console.error('Error confirmando pago:', error);
            // Don't show error toast as payment was already successful from MP perspective
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Obtener información de la URL
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');

        if (orderId) {
            setOrderInfo({
                orderId,
                paymentId,
                status
            });

            // Confirmar el pago en el backend solo una vez
            handlePaymentConfirmation(orderId, paymentId, status);

            // Limpiar el carrito ya que el pago fue exitoso
            clearCart();
        }

        // Redirigir automáticamente después de 10 segundos
        const timer = setTimeout(() => {
            navigate('/');
        }, 10000);

        return () => clearTimeout(timer);
    }, [searchParams.get('order_id')]); // Only depend on order_id to prevent infinite loops

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
                            </div>                            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Confirmado!</h2>
                            <p className="text-gray-600">
                                Tu pago ha sido procesado exitosamente y tu pedido está siendo preparado.
                            </p>
                        </div>

                        {/* Order Info */}
                        {orderInfo && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Información del Pedido:</h3>
                                <p className="text-sm text-gray-600">
                                    <strong>Pedido #:</strong> {orderInfo.orderId}
                                </p>
                                {orderInfo.paymentId && (
                                    <p className="text-sm text-gray-600">
                                        <strong>ID de Pago:</strong> {orderInfo.paymentId}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    <strong>Estado:</strong> <span className="text-green-600">Confirmado</span>
                                </p>
                            </div>
                        )}

                        {/* Success Details */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                                <CheckCircle size={16} className="mr-2" />
                                Tu transacción fue exitosa
                            </h3>                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• El pago se procesó correctamente</li>
                                <li>• Tu pedido está registrado en nuestro sistema</li>
                                <li>• El envío será programado según tu dirección</li>
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
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">                            <Link
                                to="/profile"
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
