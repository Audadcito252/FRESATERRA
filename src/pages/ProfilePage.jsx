import React, { useEffect, useState } from 'react';
import { User, MapPin, Package, CreditCard, Settings, ChevronRight, Edit, Plus, Trash2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useAddresses from '../hooks/useAddresses';

const ProfilePage = () => {
  const { user, updateProfile, changePassword, deactivateAccount, logout } = useAuth();
    // Hook para manejo de direcciones
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    creating: creatingAddress,
    updating: updatingAddress,
    settingDefault: settingDefaultAddress,
    defaultAddress,
    createAddress,
    updateAddress,
    setAddressAsDefault,
    clearError: clearAddressError,
    hasAddresses,
    getDefaultAddress
  } = useAddresses();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeactivateAccount, setShowDeactivateAccount] = useState(false);  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  
  // Solo los campos que maneja el backend actual
  const [userData, setUserData] = useState({
    nombre: '',     // nombre del backend
    apellidos: '',  // apellidos del backend  
    email: '',      // email del backend
    telefono: ''    // telefono del backend
  });
  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });  // Estado para desactivación de cuenta
  const [deactivationPassword, setDeactivationPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
    // Estado para nueva dirección
  const [newAddress, setNewAddress] = useState({
    calle: '',
    numero: '',
    distrito: '',
    ciudad: '',
    referencia: '',
    predeterminada: false
  });

  // Estado para editar dirección
  const [editAddressData, setEditAddressData] = useState({
    calle: '',
    numero: '',
    distrito: '',
    ciudad: '',
    referencia: '',
    predeterminada: false
  });
  // Effect to synchronize user data from context to local state
  useEffect(() => {
    if (user) {
      setUserData({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || ''
      });
    } else {
      // Reset form if user logs out or is not available
      setUserData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: ''
      });
    }
  }, [user]); // Re-run this effect when the user object from AuthContext changes  // Lista de pedidos - usar órdenes del usuario si existen
  const userOrders = user?.orders || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Limpiar errores de direcciones cuando se cambia de tab
  useEffect(() => {
    if (activeTab !== 'addresses') {
      clearAddressError();
    }
  }, [activeTab, clearAddressError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressData({
      ...editAddressData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address.id_direccion);
    setEditAddressData({
      calle: address.calle,
      numero: address.numero,
      distrito: address.distrito,
      ciudad: address.ciudad,
      referencia: address.referencia || '',
      predeterminada: address.predeterminada === 'si'
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateMessage('');

    const success = await updateAddress(editingAddress, editAddressData);
    
    if (success) {
      setUpdateMessage('Dirección actualizada exitosamente');
      setEditingAddress(null);
      setEditAddressData({
        calle: '',
        numero: '',
        distrito: '',
        ciudad: '',
        referencia: '',
        predeterminada: false
      });
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setUpdateMessage(''), 3000);
    } else {
      if (addressesError) {
        setUpdateError(
          typeof addressesError === 'object' 
            ? Object.values(addressesError).flat().join('\n')
            : addressesError
        );
      }
    }
  };

  const handleSetAsDefault = async (addressId) => {
    setUpdateError('');
    setUpdateMessage('');

    const success = await setAddressAsDefault(addressId);
    
    if (success) {
      setUpdateMessage('Dirección establecida como predeterminada');
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setUpdateMessage(''), 3000);
    } else {
      if (addressesError) {
        setUpdateError(addressesError);
      }
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateMessage('');

    const success = await createAddress(newAddress);
    
    if (success) {
      setUpdateMessage('Dirección agregada exitosamente');
      setShowAddAddress(false);
      setNewAddress({
        calle: '',
        numero: '',
        distrito: '',
        ciudad: '',
        referencia: '',
        predeterminada: false
      });
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setUpdateMessage(''), 3000);
    } else {
      // El error ya se maneja en el hook useAddresses
      if (addressesError) {
        setUpdateError(
          typeof addressesError === 'object' 
            ? Object.values(addressesError).flat().join('\n')
            : addressesError
        );
      }
    }
  };
  const handleDeactivateAccount = async (e) => {
    e.preventDefault();
    
    if (!deactivationPassword.trim()) {
      setUpdateError('Por favor, ingresa tu contraseña actual');
      return;
    }

    if (!confirmationText.trim()) {
      setUpdateError('Por favor, escribe la palabra "DESACTIVAR" para confirmar');
      return;
    }

    if (confirmationText.trim() !== 'DESACTIVAR') {
      setUpdateError('Debes escribir exactamente "DESACTIVAR" para confirmar');
      return;
    }

    if (!window.confirm('¿Estás absolutamente seguro de que deseas desactivar tu cuenta? Esta acción requerirá contactar al soporte para reactivarla.')) {
      return;
    }

    setIsUpdating(true);
    setUpdateMessage('');
    setUpdateError('');

    try {
      const result = await deactivateAccount(deactivationPassword);
      
      if (result.success) {
        setUpdateMessage(result.message);
        // Redirigir a la página de inicio después de 2 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setUpdateError(result.error);
      }
    } catch (error) {
      setUpdateError('Error al desactivar la cuenta');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setUpdateMessage('');
    setUpdateError('');
    
    try {
      const result = await updateProfile(userData);
      
      if (result.success) {
        setUpdateMessage(result.message);
        setIsEditing(false);
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateError(result.error);
      }
    } catch (error) {
      setUpdateError('Error al actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');
    setUpdateError('');

    // Validación básica
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setUpdateError('Las contraseñas no coinciden');
      setIsUpdating(false);
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      if (result.success) {
        setUpdateMessage(result.message);
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateError(result.error);
      }
    } catch (error) {
      setUpdateError('Error al cambiar la contraseña');
    } finally {
      setIsUpdating(false);
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
                </div>                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{userData.nombre} {userData.apellidos}</h2>
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
                  </li>                  <li>
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className={`flex items-center w-full px-4 py-3 rounded-md ${activeTab === 'addresses' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <MapPin size={18} className="mr-3" />
                      <span>Mis Direcciones</span>
                      {hasAddresses && (
                        <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          {addresses.length}
                        </span>
                      )}
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
            <div className="bg-white rounded-lg shadow-sm">              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className="p-6">
                  {/* Mensajes de feedback */}
                  {updateMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                      {updateMessage}
                    </div>
                  )}
                  
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md whitespace-pre-line">
                      {updateError}
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                        disabled={isUpdating}
                      >
                        <Edit size={16} className="mr-1" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-6">                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={userData.nombre}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                          <input
                            type="text"
                            id="apellidos"
                            name="apellidos"
                            value={userData.apellidos}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
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
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                          <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={userData.telefono}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                        <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setUpdateError('');
                            setUpdateMessage('');
                            // Restaurar datos originales
                            if (user) {
                              setUserData({
                                nombre: user.nombre || '',
                                apellidos: user.apellidos || '',
                                email: user.email || '',
                                telefono: user.telefono || ''
                              });
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                          disabled={isUpdating}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                      </div>
                    </div>
                  ) : (                    // View mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Nombre completo</label>
                          <p className="text-gray-900">{userData.nombre} {userData.apellidos}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{userData.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                          <p className="text-gray-900">{userData.telefono}</p>
                        </div>                        <div>
                          <label className="block text-sm font-medium text-gray-500">Dirección predeterminada</label>
                          {getDefaultAddress() ? (
                            <div className="text-gray-900">
                              <p className="font-medium">{getDefaultAddress().calle} {getDefaultAddress().numero}</p>
                              <p className="text-sm text-gray-600">{getDefaultAddress().distrito}, {getDefaultAddress().ciudad}</p>
                              {getDefaultAddress().referencia && (
                                <p className="text-xs text-gray-500 mt-1">{getDefaultAddress().referencia}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No tienes una dirección predeterminada. 
                              <button 
                                onClick={() => setActiveTab('addresses')}
                                className="text-red-600 hover:text-red-800 ml-1"
                              >
                                Agregar dirección
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}              {/* Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  {/* Mensajes de feedback */}
                  {updateMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                      {updateMessage}
                    </div>
                  )}
                  
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md whitespace-pre-line">
                      {updateError}
                    </div>
                  )}

                  {addressesError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md whitespace-pre-line">
                      {typeof addressesError === 'object' 
                        ? Object.values(addressesError).flat().join('\n')
                        : addressesError
                      }
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mis Direcciones</h2>
                    {!showAddAddress && (
                      <button 
                        onClick={() => setShowAddAddress(true)}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                        disabled={creatingAddress}
                      >
                        <Plus size={16} className="mr-1" />
                        <span>Agregar Dirección</span>
                      </button>
                    )}
                  </div>

                  {/* Formulario para agregar nueva dirección */}
                  {showAddAddress && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Dirección</h3>
                      
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                              Calle <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="calle"
                              name="calle"
                              value={newAddress.calle}
                              onChange={handleAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: Av. Los Olivos"
                              required
                              minLength="5"
                              maxLength="100"
                            />
                          </div>

                          <div>
                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                              Número <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="numero"
                              name="numero"
                              value={newAddress.numero}
                              onChange={handleAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: 123"
                              required
                              maxLength="10"
                            />
                          </div>

                          <div>
                            <label htmlFor="distrito" className="block text-sm font-medium text-gray-700 mb-1">
                              Distrito <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="distrito"
                              name="distrito"
                              value={newAddress.distrito}
                              onChange={handleAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: Miraflores"
                              required
                              minLength="3"
                              maxLength="50"
                            />
                          </div>

                          <div>
                            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                              Ciudad <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="ciudad"
                              name="ciudad"
                              value={newAddress.ciudad}
                              onChange={handleAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Ej: Lima"
                              required
                              minLength="3"
                              maxLength="50"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">
                            Referencia (Opcional)
                          </label>
                          <textarea
                            id="referencia"
                            name="referencia"
                            value={newAddress.referencia}
                            onChange={handleAddressChange}
                            rows="3"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Casa de dos pisos, puerta verde, al lado de la farmacia"
                            maxLength="255"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="predeterminada"
                            name="predeterminada"
                            checked={newAddress.predeterminada}
                            onChange={handleAddressChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="predeterminada" className="ml-2 block text-sm text-gray-700">
                            Establecer como dirección predeterminada
                          </label>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddAddress(false);
                              setNewAddress({
                                calle: '',
                                numero: '',
                                distrito: '',
                                ciudad: '',
                                referencia: '',
                                predeterminada: false
                              });
                              setUpdateError('');
                              clearAddressError();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={creatingAddress}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={creatingAddress}
                          >
                            {creatingAddress ? 'Guardando...' : 'Guardar Dirección'}
                          </button>
                        </div>
                      </form>
                    </div>                  )}

                  {/* Formulario para editar dirección */}
                  {editingAddress && (
                    <div className="mb-6 p-4 border border-blue-200 rounded-md bg-blue-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Dirección</h3>
                      
                      <form onSubmit={handleUpdateAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="edit-calle" className="block text-sm font-medium text-gray-700 mb-1">
                              Calle <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="edit-calle"
                              name="calle"
                              value={editAddressData.calle}
                              onChange={handleEditAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ej: Av. Los Olivos"
                              required
                              minLength="5"
                              maxLength="100"
                            />
                          </div>

                          <div>
                            <label htmlFor="edit-numero" className="block text-sm font-medium text-gray-700 mb-1">
                              Número <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="edit-numero"
                              name="numero"
                              value={editAddressData.numero}
                              onChange={handleEditAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ej: 123"
                              required
                              maxLength="10"
                            />
                          </div>

                          <div>
                            <label htmlFor="edit-distrito" className="block text-sm font-medium text-gray-700 mb-1">
                              Distrito <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="edit-distrito"
                              name="distrito"
                              value={editAddressData.distrito}
                              onChange={handleEditAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ej: Miraflores"
                              required
                              minLength="3"
                              maxLength="50"
                            />
                          </div>

                          <div>
                            <label htmlFor="edit-ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                              Ciudad <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="edit-ciudad"
                              name="ciudad"
                              value={editAddressData.ciudad}
                              onChange={handleEditAddressChange}
                              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ej: Lima"
                              required
                              minLength="3"
                              maxLength="50"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="edit-referencia" className="block text-sm font-medium text-gray-700 mb-1">
                            Referencia (Opcional)
                          </label>
                          <textarea
                            id="edit-referencia"
                            name="referencia"
                            value={editAddressData.referencia}
                            onChange={handleEditAddressChange}
                            rows="3"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Casa de dos pisos, puerta verde, al lado de la farmacia"
                            maxLength="255"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="edit-predeterminada"
                            name="predeterminada"
                            checked={editAddressData.predeterminada}
                            onChange={handleEditAddressChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="edit-predeterminada" className="ml-2 block text-sm text-gray-700">
                            Establecer como dirección predeterminada
                          </label>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddress(null);
                              setEditAddressData({
                                calle: '',
                                numero: '',
                                distrito: '',
                                ciudad: '',
                                referencia: '',
                                predeterminada: false
                              });
                              setUpdateError('');
                              clearAddressError();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={updatingAddress}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={updatingAddress}
                          >
                            {updatingAddress ? 'Actualizando...' : 'Actualizar Dirección'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Lista de direcciones */}
                  {addressesLoading ? (
                    <div className="text-center p-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                      <p className="mt-2 text-gray-500">Cargando direcciones...</p>
                    </div>
                  ) : hasAddresses ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id_direccion} 
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-gray-500" />
                                {address.predeterminada === 'si' && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                    <Star size={12} className="mr-1" />
                                    Predeterminada
                                  </span>
                                )}
                              </div>
                              
                              <p className="font-medium text-gray-900">
                                {address.calle} {address.numero}
                              </p>
                              <p className="text-gray-600">
                                {address.distrito}, {address.ciudad}
                              </p>
                              {address.referencia && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium">Referencia:</span> {address.referencia}
                                </p>
                              )}
                            </div>
                              <div className="flex items-center space-x-2 ml-4">
                              {/* Botón para editar */}
                              <button 
                                onClick={() => handleEditAddress(address)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Editar dirección"
                                disabled={updatingAddress || settingDefaultAddress}
                              >
                                <Edit size={16} />
                              </button>
                              
                              {/* Botón para establecer como predeterminada */}
                              {address.predeterminada !== 'si' && (
                                <button 
                                  onClick={() => handleSetAsDefault(address.id_direccion)}
                                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                  title="Establecer como predeterminada"
                                  disabled={updatingAddress || settingDefaultAddress}
                                >
                                  <Star size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                      <p className="text-gray-500 mb-4">
                        Agrega una dirección para facilitar tus futuras compras.
                      </p>
                      {!showAddAddress && (
                        <button 
                          onClick={() => setShowAddAddress(true)}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <Plus size={16} className="mr-2" />
                          Agregar mi primera dirección
                        </button>
                      )}
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
                  {/* Mensajes de feedback */}
                  {updateMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                      {updateMessage}
                    </div>
                  )}
                  
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md whitespace-pre-line">
                      {updateError}
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de la cuenta</h2>
                    
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">Cambiar Contraseña</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Actualiza tu contraseña para mantener tu cuenta segura.
                        </p>
                        
                        {!showChangePassword ? (
                          <button 
                            onClick={() => setShowChangePassword(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Cambiar Contraseña
                          </button>
                        ) : (
                          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                            <div>
                              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña actual
                              </label>
                              <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Nueva contraseña
                              </label>
                              <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                minLength="10"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Mínimo 10 caracteres
                              </p>
                            </div>
                            
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar nueva contraseña
                              </label>
                              <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowChangePassword(false);
                                  setPasswordData({
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                  });
                                  setUpdateError('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isUpdating}
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUpdating}
                              >
                                {isUpdating ? 'Cambiando...' : 'Cambiar Contraseña'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>                      <div className="pt-4">
                        <h3 className="font-medium mb-2 text-gray-700">Desactivar cuenta</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Al desactivar tu cuenta, no podrás iniciar sesión pero tus datos se conservarán. 
                          Puedes contactar al soporte para reactivarla.
                        </p>
                        
                        {!showDeactivateAccount ? (
                          <button 
                            onClick={() => setShowDeactivateAccount(true)}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Desactivar mi cuenta
                          </button>                        ) : (
                          <form onSubmit={handleDeactivateAccount} className="space-y-4 mt-4">
                            <div>
                              <label htmlFor="deactivationPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirma tu contraseña actual
                              </label>
                              <input
                                type="password"
                                id="deactivationPassword"
                                value={deactivationPassword}
                                onChange={(e) => setDeactivationPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Ingresa tu contraseña actual"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="confirmationText" className="block text-sm font-medium text-gray-700 mb-1">
                                Para confirmar, escribe la palabra: <span className="font-bold text-red-600">DESACTIVAR</span>
                              </label>
                              <input
                                type="text"
                                id="confirmationText"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Escribe exactamente: DESACTIVAR"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Debes escribir exactamente "DESACTIVAR" (en mayúsculas) para continuar
                              </p>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                              <p className="text-sm text-yellow-800">
                                <strong>⚠️ Advertencia:</strong> Tu cuenta será desactivada y no podrás iniciar sesión. 
                                Para reactivarla deberás contactar al soporte técnico.
                              </p>
                            </div>
                            
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowDeactivateAccount(false);
                                  setDeactivationPassword('');
                                  setConfirmationText('');
                                  setUpdateError('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isUpdating}
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUpdating}
                              >
                                {isUpdating ? 'Desactivando...' : 'Desactivar Cuenta'}
                              </button>
                            </div>
                          </form>
                        )}
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