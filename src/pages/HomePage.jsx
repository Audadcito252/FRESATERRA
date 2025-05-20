import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react'; // Ya importado para el ícono de la flecha
import { Star } from 'lucide-react'; // Importamos el ícono de estrella desde Lucide
import ProductCard from '../components/ProductCard';
import { mockProducts, mockCategories } from '../data/mockData';

// Función para obtener la imagen adecuada según la categoría
const getCategoryImage = (slug) => {
  switch (slug) {
    case 'fresh-strawberry-packs':
      return '/img/paquetesfresas.jpg'; // Imagen local desde la carpeta public/img
    case 'jams':
      return '/img/mermeladasfresas.jpg'; // Imagen local desde la carpeta public/img
    case 'dried-strawberries':
      return '/img/deshidratadasfresas.jpg'; // Imagen local desde la carpeta public/img;
    case 'special-bundles':
      return '/img/combosfresas.jpg'; // Imagen local desde la carpeta public/img;
    default:
      return 'https://images.pexels.com/photos/1703272/pexels-photo-1703272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  }
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // En una app real, estos serían llamados a una API
    setFeaturedProducts(mockProducts.filter(product => product.featured).slice(0, 4));
    setBestSellers(mockProducts.slice(0, 4));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center flex items-center" 
        style={{ backgroundImage: 'url("/img/fresasfondo.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresas frescas a domicilio</h1>
            <p className="text-xl mb-8">Las fresas más dulces y jugosas, directas de nuestros campos a tu mesa.</p>
            <Link 
              to="/products" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Comprar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Compra por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockCategories.map(category => (
              <Link 
                to={`/products?category=${category.slug}`}
                key={category.id}
                className="group relative rounded-lg overflow-hidden h-40 shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={getCategoryImage(category.slug)} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Productos destacados</h2>
            <Link 
              to="/products" 
              className="flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Fresas 100% orgánicas</h2>
              <p className="text-lg mb-6">
                Nuestras fresas se cultivan con métodos orgánicos, sin pesticidas ni fertilizantes sintéticos.
                Estamos comprometidos con la agricultura sostenible y la mejor calidad.
              </p>
              <Link 
                to="/about" 
                className="inline-block bg-white text-red-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Saber más
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="img/fresasfondo.png"
                alt="Fresas orgánicas" 
                className="rounded-lg shadow-lg w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Más vendidos</h2>
            <Link 
              to="/products" 
              className="flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que opinan nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Las fresas de FRESATERRA son increíblemente frescas y dulces. ¡A mi familia le encantan! La entrega fue rápida y el empaque excelente."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-medium">Cliente {i}</p>
                    <p className="text-sm text-gray-500">Comprador verificado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Suscríbete a nuestro boletín</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Recibe novedades, ofertas especiales y recetas de temporada directamente en tu correo.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-grow px-4 py-3 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-r-lg transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
