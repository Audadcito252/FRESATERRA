import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const initialCategory = searchParams.get('category') || '';
  const initialSearchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Aquí puedes cargar categorías si tienes API
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOption, setSortOption] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Fetch products from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/productos');
        const data = await response.json();

        const mappedProducts = data.map(product => ({
          id: product.id,
          name: product.nombre,
          description: product.descripcion || '',
          price: parseFloat(product.precio),
          salePrice: null,  // Ajusta si tienes precio en oferta
          categoryId: product.categoria_id || null,
          featured: false,
          imageUrl: product.url_imagen,
          reviews: product.reviews || [], // Por si tienes reseñas
          averageRating: product.averageRating || 0,
          stock: product.stock ?? 0,
        }));

        setProducts(mappedProducts);

        if (mappedProducts.length > 0) {
          const prices = mappedProducts.map(p => p.salePrice ?? p.price);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setMinPrice(min);
          setMaxPrice(max);
          setPriceRange([min, max]);
        }

      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchData();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => {
        const category = categories.find(c => c.slug === selectedCategory);
        return category ? product.categoryId === category.id : true;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(product => {
      const price = product.salePrice ?? product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortOption) {
      case 'priceLow':
        filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'priceHigh':
        filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case 'nameAZ':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // No se ordena porque no hay fecha, puedes agregar fecha si tienes
        break;
      default:
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, categories, selectedCategory, searchQuery, priceRange, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange([minPrice, maxPrice]);
    setSortOption('relevance');
  };

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
        {/* Mobile filter toggle */}
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
          <div className={`md:w-1/4 md:pr-6 ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
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

              {/* Rango de precio */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Rango de precio</h3>
                <div className="px-2 space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Precio mínimo: S/ {priceRange[0].toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value <= priceRange[1]) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Precio máximo: S/ {priceRange[1].toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= priceRange[0]) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rango: S/ {priceRange[0]} - S/ {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Restablecer filtros
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">
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
                  className="border border-gray-300 rounded-md py-1 px-2"
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
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
