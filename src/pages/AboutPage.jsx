import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Award, Heart, Clock, Users, Phone } from 'lucide-react';

const AboutPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">Nuestra Historia</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Un viaje de sabor, frescura y compromiso con la excelencia
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">De una pequeña finca a tu mesa</h2>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    FresaTerra nació en 2010 de un sueño compartido entre agricultores locales y
                                    emprendedores apasionados por las frutas frescas. Lo que comenzó como una pequeña
                                    cooperativa de agricultores de fresas en las afueras de Lima, ha crecido hasta
                                    convertirse en uno de los principales proveedores de fresas y otros productos
                                    frescos en todo el país.
                                </p>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Nuestra misión ha sido clara desde el principio: conectar directamente a los
                                    consumidores con los mejores productos frescos del campo, eliminando intermediarios
                                    y garantizando la máxima frescura y calidad en cada envío.
                                </p>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    En FresaTerra, no sólo vendemos fresas y otros productos; compartimos nuestra
                                    pasión por la agricultura sostenible, el comercio justo y la alimentación saludable.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-8 border-t border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nuestros Valores</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0 mt-1">
                                            <Heart size={20} className="text-red-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-md font-medium text-gray-900">Pasión</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Amamos lo que hacemos y eso se refleja en cada uno de nuestros productos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0 mt-1">
                                            <Award size={20} className="text-green-700" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-md font-medium text-gray-900">Calidad</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                No comprometeremos nunca la calidad de nuestros productos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0 mt-1">
                                            <Users size={20} className="text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-md font-medium text-gray-900">Comunidad</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Apoyamos a los agricultores locales y promovemos la agricultura sostenible.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0 mt-1">
                                            <Clock size={20} className="text-purple-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-md font-medium text-gray-900">Puntualidad</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Entregamos en el tiempo prometido, sin excusas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Promesa</h2>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    En FresaTerra nos comprometemos a ofrecer productos frescos de la más alta calidad,
                                    cultivados con prácticas sostenibles y respetuosas con el medio ambiente.
                                    Trabajamos directamente con agricultores locales para asegurar que reciban una
                                    compensación justa por su trabajo, al tiempo que nuestros clientes disfrutan de
                                    precios accesibles y la mejor experiencia en cada compra.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <img
                                            src="https://images.unsplash.com/photo-1621062228387-da22e72d13f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                            alt="Cultivo de fresas"
                                            className="rounded-lg shadow-sm w-full h-48 object-cover"
                                        />
                                        <p className="mt-3 text-sm text-gray-500 italic text-center">
                                            Nuestros campos de cultivo ecológico
                                        </p>
                                    </div>
                                    <div>
                                        <img
                                            src="https://images.unsplash.com/photo-1658171757201-41b9aa2b3848?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                            alt="Proceso de selección"
                                            className="rounded-lg shadow-sm w-full h-48 object-cover"
                                        />
                                        <p className="mt-3 text-sm text-gray-500 italic text-center">
                                            Proceso de selección manual de las fresas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">¿Por qué elegirnos?</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
                                            <Truck size={18} className="text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Envío rápido</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Entregamos en 24-48 horas para garantizar la máxima frescura.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-green-50 rounded-full">
                                            <Award size={18} className="text-green-700" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Calidad premium</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Solo vendemos productos que cumplen nuestros estándares de excelencia.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
                                            <Heart size={18} className="text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-medium text-gray-900">Cultivo responsable</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Prácticas agrícolas sostenibles y respetuosas con el medio ambiente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contáctanos</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Phone size={18} className="text-gray-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-600">+51 923 456 789</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-600">info@fresaterra.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-600">
                                                Av. Los Frutales 123, Lima<br />
                                                Perú
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-xl shadow-sm overflow-hidden p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">¿Eres productor?</h3>
                            <p className="text-gray-700 mb-4">
                                Estamos buscando expandir nuestra red de agricultores. Si cultivas fresas u otras frutas de calidad, nos encantaría hablar contigo.
                            </p>
                            <Link to="/contact" className="inline-block px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                                Únete a nosotros
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nuestro Equipo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden text-center">
                            <img
                                src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3"
                                alt="CEO"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">Carlos Mendoza</h3>
                                <p className="text-gray-600 mb-2">Fundador & CEO</p>
                                <p className="text-sm text-gray-600">
                                    Con más de 20 años de experiencia en agricultura sostenible.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden text-center">
                            <img
                                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3"
                                alt="COO"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">Laura Gutiérrez</h3>
                                <p className="text-gray-600 mb-2">Directora de Operaciones</p>
                                <p className="text-sm text-gray-600">
                                    Experta en logística y cadena de suministro alimentario.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden text-center">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3"
                                alt="Agricultural Director"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">Miguel Sánchez</h3>
                                <p className="text-gray-600 mb-2">Director Agrícola</p>
                                <p className="text-sm text-gray-600">
                                    Ingeniero agrónomo especializado en cultivos de bayas.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden text-center">
                            <img
                                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3"
                                alt="Customer Experience"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">Ana Torres</h3>
                                <p className="text-gray-600 mb-2">Directora de Experiencia del Cliente</p>
                                <p className="text-sm text-gray-600">
                                    Dedicada a asegurar la satisfacción total de nuestros clientes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-8 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                ¿Listo para probar lo mejor?
                            </h2>
                            <p className="mt-3 max-w-3xl text-lg text-red-100">
                                Disfruta de nuestras fresas premium y otros productos frescos entregados directamente en tu puerta.
                            </p>
                        </div>
                        <div className="mt-8 flex lg:mt-0 lg:shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
                                >
                                    Ver productos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
