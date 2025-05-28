import React, { useEffect, useState } from 'react';
import { User, MapPin, Package, CreditCard, Settings, ChevronRight, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Lista de pedidos - usar órdenes del usuario si existen, o usar datos mock
  const userOrders = user?.orders || [];
  const mockOrders = userOrders.length > 0 ? userOrders : [
    {
      id: 'ORD-1234-5678',
      date: '12/04/2025',
      total: 49.98,
      status: 'Entregado',
      items: [
        { name: 'Fresas Premium 1kg', price: 12.99, quantity: 2 },
        { name: 'Mermelada de Fresa 250g', price: 7.99, quantity: 3 }
      ]
    },
    {
      id: 'ORD-8765-4321',
      date: '28/03/2025',
      total: 34.97,
      status: 'Procesando',
      items: [
        { name: 'Mix de Fresas Orgánicas 500g', price: 9.99, quantity: 1 },
        { name: 'Cesta de Regalo Deluxe', price: 24.99, quantity: 1 }
      ]
    }
  ];
  
  // Direcciones guardadas
  const savedAddresses = [
    {
      id: 1,
      name: 'Casa',
      address: '123 Strawberry Lane',
      city: 'Berry City',
      state: 'Frutalia',
      zipCode: '12345',
      isDefault: true
    },
    {
      id: 2,
      name: 'Trabajo',
      address: '456 Office Plaza',
      city: 'Berry City',
      state: 'Frutalia',
      zipCode: '12346',
      isDefault: false
    }
  ];
  


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

  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);
    const result = await updateProfile({ name: userData.name, email: userData.email });
    if (result.success) {
      setIsEditing(false);
      setSuccess(result.message || 'Perfil actualizado exitosamente');
    } else {
      setError(result.error || 'Error al actualizar el perfil');
    }
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
                <h2 className="font-semibold text-lg text-gray-800">{user?.name || ''}</h2>
                {/* <p className="text-sm text-gray-500">{userData.email}</p> */}
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
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={userData.name}
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
                      </div>
                      {error && <div className="text-red-600 text-sm">{error}</div>}
                      {success && <div className="text-green-600 text-sm">{success}</div>}
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
                          <p className="text-gray-900">{userData.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{userData.email}</p>
                        </div>
                      </div>
                      {success && <div className="text-green-600 text-sm">{success}</div>}
                    </div>
                  )}
                </div>
              )}
              
              {/* Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mis Direcciones</h2>
                    <button className="flex items-center text-red-600 hover:text-red-800 transition-colors">
                      <Plus size={16} className="mr-1" />
                      <span>Añadir Nueva</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {savedAddresses.map(address => (
                      <div key={address.id} className="border rounded-lg p-4 relative hover:border-red-300 transition-colors">
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                            Predeterminada
                          </span>
                        )}
                        <h3 className="font-medium text-lg">{address.name}</h3>
                        <p className="text-gray-700">{address.address}</p>
                        <p className="text-gray-700">{address.city}, {address.state} {address.zipCode}</p>
                        
                        <div className="mt-4 flex space-x-4 text-sm">
                          <button className="text-red-600 hover:text-red-800 transition-colors">Editar</button>
                          <button className="text-gray-600 hover:text-gray-800 transition-colors">Eliminar</button>
                          {!address.isDefault && (
                            <button className="text-gray-600 hover:text-gray-800 transition-colors">
                              Establecer como predeterminada
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Orders History */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mis Pedidos</h2>
                  </div>
                  
                  {mockOrders.length > 0 ? (
                    <div className="space-y-6">
                      {mockOrders.map(order => (
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