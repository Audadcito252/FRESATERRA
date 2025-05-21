import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import SearchBar from './SearchBar';
import QuickCart from './QuickCart';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useShoppingCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCartOpen, setIsQuickCartOpen] = useState(false);
  const location = useLocation();
  const searchBarRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    // Don't close search automatically on route change
    // to prevent it from disappearing during search
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicks outside of search area to allow closing
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        // Only close if the click is not inside the search bar
        // and not on the search button itself
        const searchButton = document.querySelector('[aria-label="Buscar"]');
        if (searchButton && !searchButton.contains(event.target)) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Toggle search with a proper handler
  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    // Close menu when opening search
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  // Handler común para abrir el carrito
  const handleOpenCart = () => {
    setIsQuickCartOpen(true);
    setIsSearchOpen(false); // Siempre cerrar la búsqueda al abrir el carrito
    setIsMenuOpen(false);   // Cerrar el menú móvil al abrir el carrito
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[90] transition-colors duration-300 ${
        isScrolled || isMenuOpen || isSearchOpen || isQuickCartOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-16 md:h-20 ${isQuickCartOpen ? 'opacity-100 md:opacity-100' : ''}`}>
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 relative z-[70]">
            <Link 
              to="/" 
              className="flex items-center"
              onClick={() => isQuickCartOpen && setIsQuickCartOpen(false)}
            >
              <img 
                src="/logofresaterra.svg" 
                alt="FresaTerra" 
                className="h-12 md:h-16 w-auto" 
                style={{
                  minWidth: '200px', 
                  minHeight: '200px',
                  position: 'relative',
                  top: '10px'
                }} 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <Link to="/" className="text-gray-800 hover:text-red-600 transition-colors">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-800 hover:text-red-600 transition-colors">
              Productos
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-red-600 transition-colors">
              Nosotros
            </Link>
          </nav>

          {/* SearchBar - Desktop */}
          <div className={`hidden md:block flex-1 max-w-md mx-4 ${isQuickCartOpen ? 'opacity-60 pointer-events-none' : ''}`}>
            <SearchBar />
          </div>

          {/* Icons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleOpenCart}
              className="relative text-gray-800 hover:text-red-600 transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-800 hover:text-red-600 transition-colors">
                  <User size={20} />
                  <span className="ml-2">{user?.firstName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50">
                    Perfil
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50">
                    Mis pedidos
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-red-600 transition-colors">
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-3 md:hidden relative z-[70]">
            <button
              onClick={toggleSearch}
              className={`text-gray-800 hover:text-red-600 transition-colors p-1 ${isSearchOpen ? 'text-red-600' : ''}`}
              aria-label="Buscar"
            >
              {/* Mostrar sólo el icono de búsqueda, no la X */}
              <Search size={20} />
            </button>
            
            <button
              onClick={handleOpenCart}
              className="relative text-gray-800 hover:text-red-600 transition-colors p-1"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (!isMenuOpen) setIsSearchOpen(false);
              }}
              className="text-gray-800 p-1"
              aria-label="Menú"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        
        {/* Mobile SearchBar */}
        {isSearchOpen && (
          <div 
            ref={searchBarRef} 
            className="py-3 px-2 border-t border-gray-100 bg-white relative z-[55]"
          >
            <SearchBar 
              onClose={() => setIsSearchOpen(false)} 
              autoFocus={true}
              isMobile={true}
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 relative z-[54]">
            <div className="container mx-auto">
              <nav className="flex flex-col">
                <Link to="/" className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50">
                  <Home size={18} className="mr-3" />
                  Inicio
                </Link>
                <Link to="/products" className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50">
                  <Package size={18} className="mr-3" />
                  Productos
                </Link>
                <Link to="/about" className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  Nosotros
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50">
                      <User size={18} className="mr-3" />
                      Perfil
                    </Link>
                    <Link to="/orders" className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50">
                      <ShoppingCart size={18} className="mr-3" />
                      Mis pedidos
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-3 text-gray-800 hover:bg-gray-50 text-left"
                    >
                      <LogOut size={18} className="mr-3" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50">
                    <User size={18} className="mr-3" />
                    Iniciar sesión
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Quick Cart - ahora fuera del div container para que ocupe toda la pantalla */}
        <QuickCart open={isQuickCartOpen} onClose={() => setIsQuickCartOpen(false)} />
      </div>
    </header>
  );
};

export default Navbar;