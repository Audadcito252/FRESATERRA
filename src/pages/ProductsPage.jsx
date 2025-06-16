import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsService } from '../services/productsService';

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Parse URL parameters
  const initialCategory = searchParams.get('category') || '';
  const initialSearchQuery = searchParams.get('search') || '';  // State for products and filters
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOption, setSortOption] = useState('relevancia');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filtros de precio dinámicos
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);  // Fetch data from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir filtros para el backend
      const filters = {
        ordenar: sortOption,
        direccion: sortOption === 'priceHigh' || sortOption === 'nameZA' ? 'desc' : 'asc',
        solo_disponibles: showOnlyAvailable,
        page: currentPage,
        por_pagina: 12
      };

      // Mapear opciones de ordenamiento frontend a backend
      switch (sortOption) {
        case 'priceLow':
        case 'priceHigh':
          filters.ordenar = 'precio';
          break;
        case 'nameAZ':
        case 'nameZA':
          filters.ordenar = 'nombre';
          break;
        case 'newest':
          filters.ordenar = 'fecha_creacion';
          break;
        case 'rating':
          filters.ordenar = 'rating';
          break;
        case 'popularidad':
          filters.ordenar = 'popularidad';
          break;
        default:
          filters.ordenar = 'relevancia';
          break;
      }
      
      if (selectedCategory) {
        // Buscar el ID de la categoría si se pasó un slug
        const category = categories.find(c => 
          c.id.toString() === selectedCategory || c.slug === selectedCategory
        );
        if (category) {
          filters.categoria = category.id;
        }
      }
      
      if (searchQuery) {
        filters.busqueda = searchQuery;
      }
      
      if (priceRange[0] > 0) {
        filters.precio_min = priceRange[0];
      }
      
      if (priceRange[1] < 1000) { // Usar un valor alto por defecto
        filters.precio_max = priceRange[1];
      }
      
      if (minRating > 0) {
        filters.rating_min = minRating;
      }
      
      // Fetch products and categories/stats from backend
      const promises = [
        productsService.getProducts(filters)
      ];
      
      // Solo fetch categories y stats si no los tenemos
      if (categories.length === 0) {
        promises.push(productsService.getCategories());
      }
      
      if (!stats) {
        promises.push(productsService.getProductStats());
      }
      
      const results = await Promise.all(promises);
      const productsResponse = results[0];
      
      // Transform backend data to frontend format
      const transformedProducts = productsResponse.data.data.map(product => {
        // Usar la URL completa que viene del backend
        let imageUrl = '';
        if (product.url_imagen_completa) {
          imageUrl = product.url_imagen_completa;
        } else {
          // Fallback: construir URL manualmente si no viene la completa
          imageUrl = product.url_imagen ? 
            `http://127.0.0.1:8000/storage/${product.url_imagen}` : 
            '/images/placeholder-strawberry.jpg';
        }

        return {
          id: product.id_producto.toString(),
          name: product.nombre,
          description: product.descripcion,
          price: parseFloat(product.precio),
          salePrice: null, // Backend doesn't have sale prices yet
          images: [imageUrl],
          categoryId: product.categorias_id_categoria,
          featured: product.destacado || false,
          inStock: product.estado === 'activo',
          weight: product.peso,
          stock: 100, // Placeholder since backend doesn't track stock yet
          averageRating: product.comentarios_avg_calificacion ? parseFloat(product.comentarios_avg_calificacion) : 0,
          totalReviews: product.comentarios_count || 0,
          reviews: [] // Placeholder reviews array
        };
      });
      
      setProducts(transformedProducts);
      setTotalProducts(productsResponse.data.total || 0);
      setTotalPages(productsResponse.data.last_page || 1);
      
      // Procesar categorías si se obtuvieron
      if (results.length > 1 && results[1]) {
        const categoriesResponse = results[1];
        const transformedCategories = categoriesResponse.data.map(category => ({
          id: category.id_categoria,
          name: category.nombre,
          slug: category.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o').replace(/[úùüû]/g, 'u')
        }));
        setCategories(transformedCategories);
      }
      
      // Procesar estadísticas si se obtuvieron
      if (results.length > 2 && results[2]) {
        const statsResponse = results[2];
        setStats(statsResponse.data);
        
        // Inicializar rangos de precio si es la primera vez
        if (priceRange[0] === 0 && priceRange[1] === 100) {
          setPriceRange([
            Math.floor(statsResponse.data.precio.min),
            Math.ceil(statsResponse.data.precio.max)
          ]);
        }
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortOption, priceRange, minRating, showOnlyAvailable, currentPage, categories, stats]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinRating(0);
    setShowOnlyAvailable(true);
    setSortOption('relevancia');
    setCurrentPage(1);
    
    // Restablecer al rango de precios inicial de las estadísticas
    if (stats) {
      setPriceRange([
        Math.floor(stats.precio.min),
        Math.ceil(stats.precio.max)
      ]);
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Nuestros productos de fresa</h1>
          <p className="text-gray-600">
            Descubre nuestra selección de fresas premium y paquetes especiales
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Cargando productos...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al cargar productos</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Mobile filters toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2"
          >
            <span className="flex items-center">
              <Filter size={18} className="mr-2" />
              Filtros
            </span>
            <ChevronDown size={18} className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          <div 
            className={`md:w-1/4 md:pr-6 ${
              isMobileFilterOpen ? 'block' : 'hidden'
            } md:block`}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Buscar</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Categorías</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="category-all"
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label htmlFor="category-all" className="ml-2 text-gray-700">
                      Todos los productos
                    </label>
                  </div>                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id.toString() || selectedCategory === category.slug}
                        onChange={() => setSelectedCategory(category.id.toString())}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Rango de precio</h3>
                <div className="px-2 space-y-6">
                  <div>
                    <label htmlFor="min-price-range" className="block text-sm text-gray-600 mb-1">
                      Precio mínimo: S/ {priceRange[0].toFixed(2)}
                    </label>
                    <input
                      id="min-price-range"
                      type="range"
                      min={stats ? Math.floor(stats.precio.min) : 0}
                      max={stats ? Math.ceil(stats.precio.max) : 100}
                      step="1"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value <= priceRange[1]) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price-range" className="block text-sm text-gray-600 mb-1">
                      Precio máximo: S/ {priceRange[1].toFixed(2)}
                    </label>
                    <input
                      id="max-price-range"
                      type="range"
                      min={stats ? Math.floor(stats.precio.min) : 0}
                      max={stats ? Math.ceil(stats.precio.max) : 100}
                      step="1"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= priceRange[0]) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Rango: S/ {priceRange[0].toFixed(2)} - S/ {priceRange[1].toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Filtro de calificación */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Calificación mínima</h3>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        id={`rating-${rating}`}
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center text-gray-700">
                        {rating === 0 ? (
                          'Todas las calificaciones'
                        ) : (
                          <>
                            {Array.from({ length: rating }, (_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                            <span className="ml-1">y más</span>
                          </>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro de disponibilidad */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="only-available"
                    type="checkbox"
                    checked={showOnlyAvailable}
                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="only-available" className="ml-2 text-gray-700">
                    Solo productos disponibles
                  </label>
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Restablecer filtros
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-gray-600 mb-2 sm:mb-0">
                Mostrando {products.length} de {totalProducts} productos
                {currentPage > 1 && ` (Página ${currentPage} de ${totalPages})`}
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">
                  Ordenar por:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1); // Reset to first page when sorting changes
                  }}
                  className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="priceLow">Precio: menor a mayor</option>
                  <option value="priceHigh">Precio: mayor a menor</option>
                  <option value="nameAZ">Nombre: A-Z</option>
                  <option value="nameZA">Nombre: Z-A</option>
                  <option value="newest">Más nuevos primero</option>
                  <option value="rating">Mejor calificados</option>
                  <option value="popularidad">Más populares</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : 
                                      currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                      currentPage - 2 + i;
                        
                        if (pageNum <= 0 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-red-600 text-white'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory ? 
                    'Intenta ajustar tu búsqueda o los filtros para encontrar lo que buscas.' :
                    'No hay productos disponibles en este momento.'
                  }
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;