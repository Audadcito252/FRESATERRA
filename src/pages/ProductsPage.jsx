import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts, mockCategories } from '../data/mockData';

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Parse URL parameters
  const initialCategory = searchParams.get('category') || '';
  const initialSearchQuery = searchParams.get('search') || '';
  
  // State for products and filters
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOption, setSortOption] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Precio mínimo y máximo
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Get products data
  useEffect(() => {
    // In a real app, these would be API calls
    setProducts(mockProducts);
    setCategories(mockCategories);
    
    // Encontrar el precio mínimo y máximo real en los productos
    if (mockProducts.length > 0) {
      const productPrices = mockProducts.map(p => p.salePrice || p.price);
      const calculatedMinPrice = Math.floor(Math.min(...productPrices));
      const calculatedMaxPrice = Math.ceil(Math.max(...productPrices));
      
      setMinPrice(calculatedMinPrice);
      setMaxPrice(calculatedMaxPrice);
      setPriceRange([calculatedMinPrice, calculatedMaxPrice]);
    }
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => {
        const category = categories.find(c => c.slug === selectedCategory);
        return category ? product.categoryId === category.id : true;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sort products
    switch (sortOption) {
      case 'priceLow':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'priceHigh':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'nameAZ':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // In a real app, we would sort by date
        // For mock data, just leaving the default order
        break;
      default:
        // relevance - in a real app, this would use a more complex algorithm
        // For mock data, prioritize featured products
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, categories, selectedCategory, searchQuery, priceRange, sortOption]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    // Restablecer al rango de precios inicial calculado de los productos
    setPriceRange([minPrice, maxPrice]);
    setSortOption('relevance');
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
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.slug}
                        onChange={() => setSelectedCategory(category.slug)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Rango de precio</h3>
                <div className="px-2 space-y-6">
                  <div>
                    <label htmlFor="min-price-range" className="block text-sm text-gray-600 mb-1">
                      Precio mínimo: S/ {priceRange[0].toFixed(2)}
                    </label>
                    <input
                      id="min-price-range"
                      type="range"
                      min={minPrice}
                      max={maxPrice}
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
                      min={minPrice}
                      max={maxPrice}
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

              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Restablecer filtros
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-gray-600 mb-2 sm:mb-0">
                Mostrando {filteredProducts.length} productos
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">
                  Ordenar por:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="priceLow">Precio: menor a mayor</option>
                  <option value="priceHigh">Precio: mayor a menor</option>
                  <option value="nameAZ">Nombre: A-Z</option>
                  <option value="nameZA">Nombre: Z-A</option>
                  <option value="newest">Más nuevos primero</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tu búsqueda o los filtros para encontrar lo que buscas.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;