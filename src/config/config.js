// Configuración centralizada de la aplicación
// Este archivo maneja todas las variables de entorno y configuraciones

class Config {
  constructor() {
    // URLs base
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://api.fresaterra.shop/api/v1';
    this.frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    
    // Entorno de ejecución
    this.nodeEnv = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';
    this.isDevelopment = this.nodeEnv === 'development';
    this.isProduction = this.nodeEnv === 'production';
    
    // Debug
    this.debug = import.meta.env.VITE_DEBUG === 'true' || this.isDevelopment;
    
    // Mercado Pago
    this.mercadoPagoPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
  }

  // Método para obtener la URL completa de la API
  getApiUrl(endpoint = '') {
    const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  // Método para obtener URLs de autenticación social
  getGoogleAuthUrl() {
    return this.getApiUrl('/auth/google/redirect');
  }

  getFacebookAuthUrl() {
    return this.getApiUrl('/auth/facebook/redirect');
  }

  // Método para obtener la URL del frontend
  getFrontendUrl(path = '') {
    const baseUrl = this.frontendUrl.endsWith('/') ? this.frontendUrl.slice(0, -1) : this.frontendUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  // Método para logging condicional
  log(...args) {
    if (this.debug) {
      console.log('[FRESATERRA]', ...args);
    }
  }

  // Método para mostrar la configuración actual (solo en desarrollo)
  showConfig() {
    if (this.isDevelopment) {
      console.group('🔧 Configuración de FRESATERRA');
      console.log('🌐 API URL:', this.apiUrl);
      console.log('🏠 Frontend URL:', this.frontendUrl);
      console.log('📦 Entorno:', this.nodeEnv);
      console.log('🐛 Debug:', this.debug);
      console.log('💳 Mercado Pago Key:', this.mercadoPagoPublicKey ? '✅ Configurado' : '❌ No configurado');
      console.groupEnd();
    }
  }
}

// Exportar una instancia única de la configuración
const config = new Config();

// Mostrar configuración en desarrollo
if (config.isDevelopment) {
  config.showConfig();
}

export default config;
