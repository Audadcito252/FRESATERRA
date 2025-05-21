import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

const SearchBar = ({ onClose, autoFocus = false, isMobile = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Focus input based on autoFocus prop
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle search query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // In a real app, this would be an API call
    // Using setTimeout to simulate API delay
    const timer = setTimeout(() => {
      const filteredResults = mockProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Only close the SearchBar when submitting the form with Enter key or clicking on a result
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setQuery('');
      if (onClose) onClose();
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`);
    setQuery('');
    if (onClose) onClose();
  };

  // Clear input without closing the search
  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full relative">
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center w-full relative bg-white z-[60]">
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mr-2 p-2 text-gray-500 hover:text-gray-700"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className={`relative flex-grow w-full ${isMobile ? 'flex-1' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos de fresa..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
        <button
          type="submit"
          className={`ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors ${
            isMobile ? 'hidden sm:block' : ''
          }`}
        >
          Buscar
        </button>
      </form>

      {/* Search Results */}
      {query.trim().length > 0 && (
        <div
          ref={resultsRef}
          className={`
            bg-white shadow-lg overflow-y-auto border border-gray-200 
            ${isMobile 
              ? 'fixed left-0 right-0 top-[6.5rem] bottom-0 max-h-none mt-0 z-50' 
              : 'absolute left-1/2 -translate-x-1/2 top-full mt-2 max-h-96 w-full sm:w-[420px] rounded-lg z-50'}
          `}
          style={{ minWidth: isMobile ? '100%' : '280px', maxWidth: isMobile ? '100%' : '98vw' }}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Buscando...</div>
          ) : results.length > 0 ? (
            <ul className="pt-5">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleResultClick(product.id)}
                    className="flex items-center w-full p-3 hover:bg-gray-50 text-left border-b border-gray-100"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        S/ {product.salePrice || product.price}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No se encontraron productos para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;