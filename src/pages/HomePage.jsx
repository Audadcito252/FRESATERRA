import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Truck } from 'lucide-react'; // Iconos necesarios
import ProductCard from '../components/ProductCard';
import { productsService } from '../services/productsService';
import config from '../config/config';
import SEOHelmet from '../components/SEOHelmet';

// Función para obtener la imagen adecuada según la categoría del backend
const getCategoryImage = (categoryName) => {
  const normalizedName = categoryName.toLowerCase();
  
  if (normalizedName.includes('paquetes')) {
    return '/img/paquetesfresas.jpg';
  } else if (normalizedName.includes('mermeladas')) {
    return '/img/mermeladasfresas.jpg';
  } else if (normalizedName.includes('deshidratadas')) {
    return '/img/deshidratadasfresas.jpg';
  } else if (normalizedName.includes('combos') || normalizedName.includes('especiales')) {
    return '/img/combosfresas.jpg';
  } else {
    return 'https://images.pexels.com/photos/1703272/pexels-photo-1703272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  }
};

const getImageUrl = (product) => {
  if (product.url_imagen_completa) {
    return product.url_imagen_completa; // Usar la URL completa si está disponible
  }
  if (product.url_imagen) {
    return config.getApiUrl(`/storage/${product.url_imagen}`); // Construir la URL dinámica
  }
  return '/images/placeholder-strawberry.jpg'; // Fallback para imágenes faltantes
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);        // Obtener productos destacados y categorías del backend
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsService.getFeaturedProducts(),
          productsService.getCategories()
        ]);
        
        console.log('Featured products response:', productsResponse);
        console.log('Categories response:', categoriesResponse);
        
        // Transformar datos del backend al formato del frontend
        // Nota: /products/featured devuelve data directamente, no data.data como /products
        const productsData = productsResponse.data.data || productsResponse.data;
        console.log('Products data to transform:', productsData);
        
        if (!Array.isArray(productsData)) {
          throw new Error('La respuesta no contiene un array de productos válido');
        }
        
        const transformedProducts = productsData.map(product => {
          const imageUrl = getImageUrl(product); // Usar la función dinámica para obtener la URL de la imagen

          return {
            id: product.id_producto.toString(),
            name: product.nombre,
            description: product.descripcion,
            price: parseFloat(product.precio),
            salePrice: null, // Backend doesn't have sale prices yet
            images: [imageUrl],
            categoryId: product.categorias_id_categoria,
            featured: true, // Los productos destacados son featured por definición
            inStock: product.en_stock || false, // Usar el estado real del inventario
            weight: product.peso,
            stock: product.cantidad_disponible || 0, // Usar la cantidad real disponible del inventario
            averageRating: product.comentarios_avg_calificacion ? parseFloat(product.comentarios_avg_calificacion) : 0,
            totalReviews: product.comentarios_count || 0,
            reviews: [] // Placeholder reviews array
          };
        });
        
        // Transformar categorías del backend
        const transformedCategories = categoriesResponse.data.map(category => ({
          id: category.id_categoria,
          name: category.nombre,
          slug: category.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o').replace(/[úùüû]/g, 'u')
        }));
        
        setFeaturedProducts(transformedProducts);
        setBestSellers(transformedProducts.slice(0, 4)); // Usar los mismos productos como best sellers por ahora
        setCategories(transformedCategories);
          } catch (err) {
        console.error('Error fetching featured products:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });        setError('Error al cargar los datos');
        // En caso de error, usar arrays vacíos para que no se rompa la UI
        setFeaturedProducts([]);
        setBestSellers([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHelmet 
        title="FresaTerra | Fresas Frescas en Cusco | Entrega en 1-2 horas"
        description="Fresas frescas de calidad premium en Cusco. Entrega rápida en 1-2 horas. Paquetes de 1kg, 2kg y 5kg. Directo del productor a tu mesa. ¡Ordena ahora en FresaTerra!"
        keywords="fresas cusco, fresas frescas, entrega fresas cusco, fresas premium, frutas frescas cusco, delivery fresas, paquetes fresas, fresaterra"
        canonical="/"
        ogTitle="FresaTerra - Fresas Frescas Premium en Cusco"
        ogDescription="Las mejores fresas frescas de Cusco con entrega en 1-2 horas. Calidad premium, paquetes desde 1kg. ¡Ordena ya!"
        ogType="website"
      />
      <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center flex items-center" 
        style={{ backgroundImage: 'url("/img/fresasfondo.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresas frescas a domicilio</h1>
            <p className="text-xl mb-8">Las fresas más dulces y jugosas, directas de nuestros invernaderos a tu mesa.</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">Compra por categoría</h2>          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link 
                to={`/products?category=${category.id}`}
                key={category.id}
                className="group relative rounded-lg overflow-hidden h-40 shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={getCategoryImage(category.name)} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>      </section>      {/* Free Shipping Offer Section */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 text-center lg:text-left mb-6 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Truck size={48} className="text-white mr-4" />
                <h2 className="text-3xl lg:text-4xl font-bold">¡ENVÍO GRATIS!</h2>
              </div>              <p className="text-xl lg:text-2xl mb-2">
                En todas tus compras desde <span className="font-bold text-yellow-300">S/ 30</span>
              </p>
              <p className="text-lg opacity-90">
                Disfruta de nuestras fresas frescas con envío gratuito a domicilio
              </p>
            </div>
            <div className="lg:w-1/3 text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-8 inline-block backdrop-blur-sm">
                <div className="text-6xl font-bold text-yellow-300">S/ 30</div>
                <div className="text-lg font-medium">Compra mínima</div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">              <Link 
              to="/products" 
              className="inline-block bg-white hover:bg-gray-100 text-red-600 font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ¡Comprar ahora!
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
      </section>      {/* Featured Products Section */}
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
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gray-300 h-56 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos destacados disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
      </section>      {/* Best Sellers Section */}
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
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gray-300 h-56 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>{/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que opinan nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">            {[
              {
                name: "María García",
                avatar: "https://elperuano.pe/fotografia/thumbnail/2021/09/02/000130694M.jpg",
                comment: "Las fresas de FRESATERRA son increíblemente frescas y dulces. ¡A mi familia le encantan! La entrega fue rápida y el empaque excelente."
              },
              {
                name: "Carlos Mendoza",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
                comment: "Excelente calidad y sabor auténtico. Desde que probé estas fresas no compro en otro lugar. Totalmente recomendadas para toda la familia."
              },
              {
                name: "Ana Rodríguez",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
                comment: "Me encanta la frescura y el dulzor natural de estas fresas. Son perfectas para mis postres y batidos. ¡Seguiré comprando aquí!"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "{testimonial.comment}"
                </p>                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
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
    </>
  );
};

export default HomePage;
