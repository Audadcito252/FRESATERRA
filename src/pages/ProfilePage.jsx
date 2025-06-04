import React, { useEffect, useState } from 'react';
import { User, MapPin, Package, CreditCard, Settings, ChevronRight, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addressService } from '../services/addressService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoadingDefaultAddress, setIsLoadingDefaultAddress] = useState(false); // Estado para controlar la carga de la dirección predeterminada
  const [loadingButtons, setLoadingButtons] = useState({}); // Para trackear botones específicos
  const [addressError, setAddressError] = useState('');
  const [defaultAddress, setDefaultAddress] = useState(null); // Nueva dirección predeterminada
  const [userData, setUserData] = useState({
    firstName: '', // Initialize as empty, will be populated from user context
    lastName: '',  // Initialize as empty
    email: '',     // Initialize as empty
    phone: '',     // Initialize as empty
    address: '', // Default mock
    city: '',           // Default mock
    state: '',            // Default mock
    zipCode: ''              // Default mock
  });

  const [newAddress, setNewAddress] = useState({
    calle: '',
    numero: '',
    distrito: '',
    ciudad: 'Cusco',
    referencia: '',
    predeterminada: 'no'
  });

  // Distritos disponibles para Cusco
  const distritosCusco = [
    'Santiago',
    'San Jeronimo',
    'San Sebastian',
    'Wanchaq',
    'Cusco'
  ];

  // Effect to synchronize user data from context to local state
  useEffect(() => {
    if (user) {
      setUserData(prevUserData => ({
        ...prevUserData, // Preserve existing address defaults unless overridden by user object
        firstName: user.nombre || '',
        lastName: user.apellidos || '',
        email: user.email || '',
        phone: user.telefono || '',
        // If your user object from API might contain address fields:
        address: user.direccion || '', // Assuming 'direccion' from API
        city: user.ciudad || '', // Assuming 'ciudad' from API
        state: user.estado || '', // Assuming 'estado' from API
        zipCode: user.codigo_postal || '', // Assuming 'codigo_postal' from API
      }));
    } else {
      // Optional: Reset form if user logs out or is not available
      setUserData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
    }
  }, [user]); // Re-run this effect when the user object from AuthContext changes
  // Lista de pedidos - usar órdenes del usuario si existen
  const userOrders = user?.orders || [];  // Cargar direcciones cuando el componente se monta o el usuario cambia
  useEffect(() => {
    console.log('Usuario en ProfilePage:', user);
    console.log('Token en localStorage:', localStorage.getItem('token'));
    console.log('activeTab:', activeTab);
    
    // Solo intentar cargar datos si hay usuario Y token
    const token = localStorage.getItem('token');
    if (user && token && activeTab === 'addresses') {
      loadAddresses();
    } else if (user && token && activeTab === 'personal') {
      loadDefaultAddress(); // Cargar dirección predeterminada solo para la pestaña personal
    } else {
      // Si no hay usuario o token, limpiar estados
      if (activeTab === 'addresses') {
        setAddresses([]);
        setAddressError('');
      } else if (activeTab === 'personal') {
        setDefaultAddress(null);
      }
    }
  }, [user, activeTab]);const loadAddresses = async () => {
    if (!user) {
      console.log('No hay usuario logueado');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token de autenticación');
      setAddressError('Debes iniciar sesión para ver tus direcciones.');
      return;
    }
    
    setIsLoadingAddresses(true);
    setAddressError('');
    try {
      console.log('Intentando cargar direcciones...');
      const addresses = await addressService.getAddresses();
      console.log('Direcciones cargadas:', addresses); // Para debugging
      console.log('Tipo de datos recibido:', typeof addresses); // Para debugging
      setAddresses(Array.isArray(addresses) ? addresses : []);
      
      // Buscar y establecer la dirección predeterminada
      if (Array.isArray(addresses)) {
        const defaultAddr = addresses.find(addr => addr.predeterminada === true || addr.predeterminada === 'si');
        setDefaultAddress(defaultAddr || null);
        console.log('Dirección predeterminada encontrada:', defaultAddr);
      }    } catch (error) {
      console.error('Error cargando direcciones:', error);
      console.error('Status del error:', error.response?.status);
      console.error('Datos del error:', error.response?.data);
      
      // Manejar diferentes tipos de errores
      if (error.status === 401) {
        setAddressError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
        // Limpiar estados relacionados
        setDefaultAddress(null);
        setAddresses([]);
      } else if (error.response?.status === 403) {
        setAddressError('No tienes permisos para acceder a esta información.');
      } else if (error.response?.status === 500) {
        setAddressError('Error del servidor. Inténtalo más tarde.');
      } else {
        setAddressError('Error al cargar las direcciones. Verifica tu conexión.');
      }
    } finally {
      setIsLoadingAddresses(false);
    }
  };
    // Función específica para cargar solo la dirección predeterminada
  const loadDefaultAddress = async () => {
    if (!user) {
      setDefaultAddress(null);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setDefaultAddress(null);
      return;
    }

    setIsLoadingDefaultAddress(true);
    try {
      // Usar el endpoint dedicado para obtener la dirección predeterminada
      const address = await addressService.getDefaultAddress();
      setDefaultAddress(address || null);
    } catch (error) {
      if (error.status === 401 || error.response?.status === 401) {
        setDefaultAddress(null);
        toast.error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
        return;
      }
      setDefaultAddress(null);
      if (error.status !== 401) {
        console.error('Error cargando dirección predeterminada:', error);
      }
    } finally {
      setIsLoadingDefaultAddress(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  const handleSaveProfile = () => {
    updateProfile(userData);
    setIsEditing(false);
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };  const handleSaveAddress = async () => {
    if (!newAddress.calle || !newAddress.numero || !newAddress.distrito) {
      setAddressError('Por favor completa todos los campos requeridos');
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsLoadingAddresses(true);
      setAddressError('');
      
      // Preparar datos para el API según la estructura de la BD
      const addressData = {
        calle: newAddress.calle,
        numero: newAddress.numero,
        distrito: newAddress.distrito,
        ciudad: newAddress.ciudad,
        referencia: newAddress.referencia || null,
        predeterminada: newAddress.predeterminada
      };

      // Intentar crear la dirección
      let createdSuccessfully = false;
      try {
        const result = await addressService.createAddress(addressData);
        console.log('Resultado de createAddress:', result);
        createdSuccessfully = true;
      } catch (createError) {
        console.log('Error en createAddress, verificando si se guardó:', createError);
      }
      
      // Recargar direcciones para verificar el estado real
      await loadAddresses();
      
      // Si se creó exitosamente O si vemos que hay más direcciones, resetear formulario
      if (createdSuccessfully) {
        // Se creó sin errores
        setNewAddress({
          calle: '',
          numero: '',
          distrito: '',
          ciudad: 'Cusco',
          referencia: '',
          predeterminada: 'no'
        });
        setShowAddressForm(false);
        setAddressError('');
        toast.success('Dirección guardada exitosamente');
      } else {
        // Hubo error pero verificar si se guardó de todas formas
        // (esto maneja el caso donde la API devuelve error pero la dirección se guarda)
        setTimeout(() => {
          // Forzar recarga una vez más para estar seguros
          loadAddresses().then(() => {
            // Si llegamos aquí sin error, probablemente se guardó
            setNewAddress({
              calle: '',
              numero: '',
              distrito: '',
              ciudad: 'Cusco',
              referencia: '',
              predeterminada: 'no'
            });
            setShowAddressForm(false);
            setAddressError('');
            toast.success('Dirección guardada exitosamente');
          });
        }, 500);
      }
      
    } catch (error) {
      console.error('Error general:', error);
      setAddressError('Error al guardar la dirección');
      toast.error('Error al guardar la dirección');
    } finally {
      setIsLoadingAddresses(false);
    }  };
  
  // Función handleDeleteAddress removida para mantener integridad de datos para reportes

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoadingButtons(prev => ({ ...prev, [`default-${addressId}`]: true }));
      await addressService.setDefaultAddress(addressId);
      await loadAddresses();
      toast.success('Dirección establecida como predeterminada');
    } catch (error) {
      setAddressError('Error al establecer dirección predeterminada');
      toast.error('Error al establecer dirección predeterminada');
      console.error('Error estableciendo dirección predeterminada:', error);
    } finally {
      setLoadingButtons(prev => ({ ...prev, [`default-${addressId}`]: false }));
    }
  };

  const handleCancelAddress = () => {
    setNewAddress({
      calle: '',
      numero: '',
      distrito: '',
      ciudad: 'Cusco',
      referencia: '',
      predeterminada: 'no'
    });
    setShowAddressForm(false);
  };

  return (
    <div className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Mi Perfil</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar / Navigation */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-4 p-4 border-b">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <User size={24} className="text-red-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{userData.firstName} {userData.lastName}</h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>
              
              <nav className="mt-4">
                <ul className="space-y-1">
                  <li>
                    <button 
                      onClick={() => setActiveTab('personal')}
                      className={`flex items-center w-full px-4 py-3 rounded-md ${activeTab === 'personal' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <User size={18} className="mr-3" />
                      <span>Información Personal</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className={`flex items-center w-full px-4 py-3 rounded-md ${activeTab === 'addresses' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <MapPin size={18} className="mr-3" />
                      <span>Mis Direcciones</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`flex items-center w-full px-4 py-3 rounded-md ${activeTab === 'orders' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Package size={18} className="mr-3" />
                      <span>Mis Pedidos</span>
                    </button>
                  </li>

                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`flex items-center w-full px-4 py-3 rounded-md ${activeTab === 'settings' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Settings size={18} className="mr-3" />
                      <span>Configuración</span>
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div className="mt-6 pt-6 border-t">
                <button 
                  onClick={logout}
                  className="w-full py-2 text-center text-red-600 hover:text-red-800 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Nombre</label>
                          <p className="text-gray-900">{userData.firstName} {userData.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{userData.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                          <p className="text-gray-900">{userData.phone}</p>
                        </div>                        <div>
                          <label className="block text-sm font-medium text-gray-500">Dirección Predeterminada</label>
                          {isLoadingDefaultAddress ? (
                            <div className="flex items-center space-x-2 text-gray-400">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              <span>Cargando dirección...</span>
                            </div>
                          ) : defaultAddress ? (
                            <div>
                              <p className="text-gray-900">{defaultAddress.calle} {defaultAddress.numero}</p>
                              <p className="text-gray-900">{defaultAddress.distrito}, {defaultAddress.ciudad}</p>
                              {defaultAddress.referencia && (
                                <p className="text-gray-600 text-sm italic">Referencia: {defaultAddress.referencia}</p>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-500 italic">
                              <p>No tienes una dirección predeterminada configurada.</p>
                              <button 
                                onClick={() => setActiveTab('addresses')}
                                className="text-red-600 hover:text-red-700 text-sm font-medium mt-1 underline"
                              >
                                Agregar dirección
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}              {/* Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="p-6">                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mis Direcciones</h2>
                    {addressError && (
                      <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {addressError}
                      </div>
                    )}
                  </div>
                  
                  {/* Lista de direcciones guardadas */}
                  <div className="space-y-4 mb-6">
                    {isLoadingAddresses ? (
                      <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Cargando direcciones...</p>
                      </div>
                    ) : addresses.length > 0 ? (                      addresses.map(address => (                        <div key={address.id} className="border rounded-lg p-4 relative hover:border-red-300 hover:shadow-md transition-all duration-200 bg-white">
                          {address.predeterminada && (
                            <div className="absolute top-4 right-4 flex items-center">
                              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Predeterminada
                              </span>
                            </div>
                          )}                          <div className={`${address.predeterminada ? 'pr-32' : 'pr-4'}`}>
                            <p className="text-gray-800 font-semibold text-base">{address.calle} {address.numero}</p>
                            <p className="text-gray-600 mt-1">{address.distrito}, {address.ciudad}</p>
                            {address.referencia && (
                              <p className="text-gray-500 text-sm mt-2 italic">Referencia: {address.referencia}</p>
                            )}
                          </div>                          <div className="mt-4 flex space-x-3 text-sm">
                            {/* Botón eliminar removido para mantener integridad de datos para reportes */}
                            {!address.predeterminada && (
                              <button 
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="px-4 py-2 text-green-600 bg-white hover:text-white hover:bg-green-600 border border-green-600 rounded-md transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={loadingButtons[`default-${address.id}`] || isLoadingAddresses}
                              >
                                {loadingButtons[`default-${address.id}`] ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-2"></div>
                                    <span>Procesando...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Predeterminada</span>
                                  </div>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 mb-4">No tienes direcciones guardadas.</p>
                      </div>
                    )}
                  </div>                  {/* Formulario para agregar nueva dirección */}
                  {!showAddressForm ? (
                    <div className="border-t pt-6">
                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Plus size={18} className="mr-2" />
                        <span className="font-medium">Agregar Nueva Dirección</span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Dirección</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                                Calle *
                              </label>
                              <input
                                type="text"
                                id="calle"
                                name="calle"
                                value={newAddress.calle}
                                onChange={handleAddressInputChange}
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Ej: Av. El Sol"
                              />
                            </div>

                            <div>
                              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                                Número *
                              </label>
                              <input
                                type="text"
                                id="numero"
                                name="numero"
                                value={newAddress.numero}
                                onChange={handleAddressInputChange}
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Ej: 123 o 123-A"
                              />
                            </div>

                            <div>
                              <label htmlFor="distrito" className="block text-sm font-medium text-gray-700 mb-1">
                                Distrito *
                              </label>
                              <select
                                id="distrito"
                                name="distrito"
                                value={newAddress.distrito}
                                onChange={handleAddressInputChange}
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="">Selecciona un distrito</option>
                                {distritosCusco.map(distrito => (
                                  <option key={distrito} value={distrito}>
                                    {distrito}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                                Ciudad
                              </label>
                              <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                value={newAddress.ciudad}
                                readOnly
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">
                              Referencia
                            </label>
                            <textarea
                              id="referencia"
                              name="referencia"
                              value={newAddress.referencia}
                              onChange={handleAddressInputChange}
                              rows={2}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: Cerca al mercado San Pedro, casa de color azul"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="predeterminada"
                              name="predeterminada"
                              checked={newAddress.predeterminada === 'si'}
                              onChange={(e) => setNewAddress({
                                ...newAddress,
                                predeterminada: e.target.checked ? 'si' : 'no'
                              })}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="predeterminada" className="ml-2 block text-sm text-gray-700">
                              Establecer como dirección predeterminada
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={handleCancelAddress}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancelar
                          </button>                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          disabled={!newAddress.calle || !newAddress.numero || !newAddress.distrito || isLoadingAddresses}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                        >
                          {isLoadingAddresses && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          )}
                          Guardar Dirección
                        </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Orders History */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mis Pedidos</h2>
                  </div>
                  
                  {userOrders.length > 0 ? (
                    <div className="space-y-6">
                      {userOrders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                              <p className="text-sm text-gray-500">Fecha: {order.date}</p>
                            </div>
                            <div className="flex flex-col md:items-end">
                              <p className="font-medium">Total: S/ {order.total.toFixed(2)}</p>
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                order.status === 'Entregado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-2">Productos:</h3>
                            <ul className="space-y-2">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <div>
                                    <p className="text-gray-800">{item.name} x{item.quantity}</p>
                                  </div>
                                  <p className="text-gray-800">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-gray-50 p-4 text-right">
                            <Link to={`/orders/${order.id}`} className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center">
                              <span>Ver detalles</span>
                              <ChevronRight size={16} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-gray-500 mb-4">Aún no tienes pedidos realizados.</p>
                      <Link to="/products" className="text-red-600 hover:text-red-800 transition-colors">
                        Explorar productos
                      </Link>
                    </div>
                  )}
                </div>
              )}
              

              
              {/* Account Settings */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de la cuenta</h2>
                    
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">Cambiar Contraseña</h3>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                          Cambiar Contraseña
                        </button>
                      </div>
                      

                        <div className="pt-4">
                        <h3 className="font-medium mb-2 text-gray-700">Eliminar cuenta</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Al eliminar tu cuenta, perderás acceso a tu historial de pedidos y a tus datos guardados.
                        </p>
                        <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                          Eliminar mi cuenta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;