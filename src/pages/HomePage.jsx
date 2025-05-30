import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/productos');
        const data = await res.json();

        const formatted = data.map((product, index) => ({
          id: product.id ?? `temp-id-${index}`,
          name: product.nombre,
          description: product.descripcion || '',
          price: parseFloat(product.precio),
          salePrice: null,
          categoryId: product.categoria_id || null,
          featured: Boolean(product.destacado),
          imageUrl: product.url_imagen,
          reviews: product.reviews || [],
          averageRating: product.averageRating || 0,
          stock: product.stock ?? 0,
        }));

        setProducts(formatted);
        setFeaturedProducts(formatted.filter(p => p.featured).slice(0, 4));
        setBestSellers(formatted.slice(0, 4));
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url("/img/fresasfondo.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresas frescas a domicilio</h1>
            <p className="text-xl mb-8">
              Las fresas más dulces y jugosas, directas de nuestros invernaderos a tu mesa.
            </p>
            <Link
              to="/products"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Comprar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Productos destacados</h2>
            <Link to="/products" className="flex items-center text-red-600 hover:text-red-700 font-medium">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          {loadingProducts ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Fresas 100% orgánicas</h2>
              <p className="text-lg mb-6">
                Nuestras fresas se cultivan con métodos orgánicos, sin pesticidas ni fertilizantes sintéticos.
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
                src="/img/fresasfondo.png"
                alt="Fresas orgánicas"
                className="rounded-lg shadow-lg w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Más vendidos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Más vendidos</h2>
            <Link to="/products" className="flex items-center text-red-600 hover:text-red-700 font-medium">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          {loadingProducts ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
