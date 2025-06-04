import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <div className="mb-1">
              <img 
                src="/logofresaterra.svg" 
                alt="FresaTerra" 
                className="h-40 w-40 object-contain" 
              />
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed text-center lg:text-left">
              Las mejores fresas, calidad premium, entregadas frescas a tu puerta. 
              Cultivamos con amor y cuidado para ofrecerte el mejor sabor.
            </p>            <div className="flex space-x-4">
              <a href="https://www.instagram.com/fresaterra?igsh=cWhoYTRxZ2U3YjR2" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800">
                <Instagram size={24} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61576327966854" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800">
                <Facebook size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Atención al cliente</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span className="text-gray-300">929 714 978</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span className="text-gray-300">fresaterra@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FRESATERRA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;