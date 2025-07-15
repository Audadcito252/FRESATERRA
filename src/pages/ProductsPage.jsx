import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsService } from '../services/productsService';
import searchService from '../services/searchService';
import config from '../config/config';
import SEOHelmet from '../components/SEOHelmet';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Parse URL parameters
  const initialCategory = searchParams.get('category') || '';
  const initialSearchQuery = searchParams.get('search') || '';
  
  // State for products and filters
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOption, setSortOption] = useState('relevancia');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filtros dinámicos (aplicados en frontend para mayor flexibilidad)
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  
  // Estado interno para el input de búsqueda (debounced)
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  
  // Estado interno para el rango de precio (debounced)
  const [priceInputRange, setPriceInputRange] = useState([0, 100]);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 12;
  
  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // Esperar 300ms después de que el usuario deje de escribir
    
    return () => clearTimeout(timer);
  }, [searchInput]);
  
  // Debounce para el rango de precio
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceRange(priceInputRange);
    }, 150); // Más rápido para los sliders
    
    return () => clearTimeout(timer);
  }, [priceInputRange]);// Función para cargar todos los productos del backend (solo una vez)
  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los productos sin filtros de backend
      const filters = {
        por_pagina: 1000, // Obtener todos los productos
        solo_disponibles: false // Obtener todos, incluso no disponibles
      };
      
      // Fetch products, categories and stats
      const promises = [
        productsService.getProducts(filters),
        productsService.getCategories(),
        productsService.getProductStats()
      ];
      
      const [productsResponse, categoriesResponse, statsResponse] = await Promise.all(promises);
      
      // Transform backend products data to frontend format
      const transformedProducts = productsResponse.data.data.map(product => {
        const imageUrl = product.url_imagen_completa || (product.url_imagen ? config.getApiUrl(`/storage/${product.url_imagen}`) : '/images/placeholder-strawberry.jpg');

        return {
          id: product.id_producto.toString(),
          name: product.nombre,
          description: product.descripcion,
          price: parseFloat(product.precio),
          salePrice: null,
          images: [imageUrl],
          categoryId: product.categorias_id_categoria,
          featured: product.destacado || false,
          inStock: product.en_stock || false, // Usar el estado real del inventario
          weight: product.peso,
          stock: product.cantidad_disponible || 0, // Usar la cantidad real disponible del inventario
          averageRating: product.comentarios_avg_calificacion ? parseFloat(product.comentarios_avg_calificacion) : 0,
          totalReviews: product.comentarios_count || 0,
          reviews: [],
          
          // Datos de stock necesarios para stockService
          en_stock: product.en_stock,
          cantidad_disponible: product.cantidad_disponible,
          inventario_info: product.inventario_info,
          inventarios: product.inventarios
        };
      });
      
      setAllProducts(transformedProducts);
      
      // Transform categories
      const transformedCategories = categoriesResponse.data.map(category => ({
        id: category.id_categoria,
        name: category.nombre,
        slug: category.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o').replace(/[úùüû]/g, 'u')
      }));
      setCategories(transformedCategories);
        // Set stats and initialize price ranges
      setStats(statsResponse.data);
      const minPrice = Math.floor(statsResponse.data.precio.min);
      const maxPrice = Math.ceil(statsResponse.data.precio.max);
      setPriceRange([minPrice, maxPrice]);
      setPriceInputRange([minPrice, maxPrice]);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data only once on component mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);  // Filtrar, ordenar y paginar productos en el frontend
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];
    
    // Filtro por búsqueda (nombre y descripción)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filtro por categoría
    if (selectedCategory) {
      const category = categories.find(c => 
        c.id.toString() === selectedCategory || c.slug === selectedCategory
      );
      if (category) {
        filtered = filtered.filter(product => 
          product.categoryId === category.id
        );
      }
    }
    
    // Filtro por rango de precio
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filtro por calificación mínima
    if (minRating > 0) {
      filtered = filtered.filter(product => 
        product.averageRating >= minRating
      );
    }
    
    // Filtro por disponibilidad
    if (showOnlyAvailable) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'nameZA':
          return b.name.localeCompare(a.name);
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'newest':
          // Si no tenemos fecha de creación, usamos el ID como proxy
          return parseInt(b.id) - parseInt(a.id);
        case 'popularidad':
          return b.totalReviews - a.totalReviews;
        default: // relevancia
          return 0;
      }
    });
    
    return filtered;
  }, [allProducts, searchQuery, selectedCategory, priceRange, minRating, showOnlyAvailable, sortOption, categories]);
  
  // Paginación en el frontend
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);
    // Calcular información de paginación
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
    // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    if (!stats) return false;
    
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== '' ||
      priceRange[0] !== Math.floor(stats.precio.min) ||
      priceRange[1] !== Math.ceil(stats.precio.max) ||
      minRating > 0 ||
      !showOnlyAvailable
    );
  }, [searchQuery, selectedCategory, priceRange, minRating, showOnlyAvailable, stats]);
  
  // Verificar si estamos procesando filtros
  const isProcessingFilters = useMemo(() => {
    return (
      searchInput !== searchQuery ||
      (priceInputRange[0] !== priceRange[0] || priceInputRange[1] !== priceRange[1])
    );
  }, [searchInput, searchQuery, priceInputRange, priceRange]);
    // Reset página cuando cambian los filtros (pero no cuando cambia solo el ordenamiento)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, minRating, showOnlyAvailable]);// Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSearchInput(''); // También resetear el input
    setMinRating(0);
    setShowOnlyAvailable(true);
    setSortOption('relevancia');
    setCurrentPage(1);
    
    // Restablecer al rango de precios inicial de las estadísticas
    if (stats) {
      const minPrice = Math.floor(stats.precio.min);
      const maxPrice = Math.ceil(stats.precio.max);
      setPriceRange([minPrice, maxPrice]);
      setPriceInputRange([minPrice, maxPrice]);
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <>
      <SEOHelmet 
        title="Productos de Fresas Premium en Cusco | Paquetes 1kg, 2kg, 5kg"
        description="Descubre nuestros productos de fresas frescas en Cusco. Paquetes de 1kg, 2kg y 5kg. Calidad premium, entrega rápida. ¡Elige tu paquete ideal en FresaTerra!"
        keywords="productos fresas cusco, paquetes fresas 1kg 2kg 5kg, fresas premium cusco, productos fresaterra, catálogo fresas"
        canonical="/products"
        ogTitle="Productos de Fresas Premium - FresaTerra Cusco"
        ogDescription="Explora nuestro catálogo de fresas frescas. Paquetes de diferentes tamaños, calidad premium y entrega rápida en Cusco."
      />
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
                <h3 className="font-medium text-lg mb-3">Buscar</h3>                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchInput && (
                    <button
                      onClick={() => {
                        setSearchInput('');
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                  {searchInput !== searchQuery && searchInput && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    </div>
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
                <h3 className="font-medium text-lg mb-3">Rango de precio</h3>                <div className="px-2 space-y-6">
                  <div>
                    <label htmlFor="min-price-range" className="block text-sm text-gray-600 mb-1">
                      Precio mínimo: S/ {priceInputRange[0].toFixed(2)}
                    </label>
                    <input
                      id="min-price-range"
                      type="range"
                      min={stats ? Math.floor(stats.precio.min) : 0}
                      max={stats ? Math.ceil(stats.precio.max) : 100}
                      step="1"
                      value={priceInputRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value <= priceInputRange[1]) {
                          setPriceInputRange([value, priceInputRange[1]]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price-range" className="block text-sm text-gray-600 mb-1">
                      Precio máximo: S/ {priceInputRange[1].toFixed(2)}
                    </label>
                    <input
                      id="max-price-range"
                      type="range"
                      min={stats ? Math.floor(stats.precio.min) : 0}
                      max={stats ? Math.ceil(stats.precio.max) : 100}
                      step="1"
                      value={priceInputRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= priceInputRange[0]) {
                          setPriceInputRange([priceInputRange[0], value]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Rango: S/ {priceRange[0].toFixed(2)} - S/ {priceRange[1].toFixed(2)}</span>
                    {(priceInputRange[0] !== priceRange[0] || priceInputRange[1] !== priceRange[1]) && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    )}
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
              <div className="mb-2 sm:mb-0">
                <p className="text-gray-600">
                  Mostrando {paginatedProducts.length} de {totalProducts} productos
                  {currentPage > 1 && ` (Página ${currentPage} de ${totalPages})`}
                </p>                {hasActiveFilters && (
                  <div className="mt-2">
                    {isProcessingFilters && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2 inline-block"></div>
                    )}
                    <button 
                      onClick={handleResetFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Borrar filtros
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">
                  Ordenar por:
                </label>
                <select
                  id="sort"
                  value={sortOption}                  onChange={(e) => {
                    setSortOption(e.target.value);
                    // No resetear la página al cambiar ordenamiento
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
            </div>            {/* Products */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
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
    </>
  );
};

export default ProductsPage;