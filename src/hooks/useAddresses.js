import { useState, useEffect, useCallback } from 'react';
import addressesService from '../services/addressesService.js';

/**
 * Hook personalizado para manejo de direcciones
 * Proporciona funcionalidades para obtener y crear direcciones de usuario
 */
const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [total, setTotal] = useState(0);

  /**
   * Obtener todas las direcciones del usuario
   */
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addressesService.getAddresses();
      
      if (result.success) {
        setAddresses(result.addresses);
        setTotal(result.total);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar las direcciones');
      console.error('Error en fetchAddresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear una nueva dirección
   * @param {Object} addressData - Datos de la nueva dirección
   * @returns {Promise<boolean>} true si se creó exitosamente
   */
  const createAddress = useCallback(async (addressData) => {
    // Validar datos antes de enviar
    const validation = addressesService.validateAddressData(addressData);
    if (!validation.isValid) {
      setError(validation.errors);
      return false;
    }

    setCreating(true);
    setError(null);

    try {
      const result = await addressesService.createAddress(addressData);
      
      if (result.success) {
        // Actualizar la lista de direcciones agregando la nueva
        setAddresses(prevAddresses => {
          const newAddresses = [result.address, ...prevAddresses];
          // Si la nueva dirección es predeterminada, actualizar las demás
          if (result.address.predeterminada === 'si') {
            return newAddresses.map(addr => 
              addr.id_direccion === result.address.id_direccion 
                ? addr 
                : { ...addr, predeterminada: 'no' }
            );
          }
          return newAddresses;
        });
        setTotal(prevTotal => prevTotal + 1);
        return true;
      } else {
        setError(result.message);
        return false;
      }    } catch (err) {
      console.error('Error en createAddress:', err);
      
      if (err.validationErrors) {
        setError(err.validationErrors);
      } else if (err.serverError) {
        // Mostrar error del servidor si está disponible
        console.error('Server error details:', err.serverError);
        setError(`Error del servidor: ${err.message}`);
      } else {
        setError(err.message || 'Error al crear la dirección');
      }
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  /**
   * Actualizar una dirección existente
   * @param {string} addressId - ID de la dirección
   * @param {Object} addressData - Datos actualizados
   * @returns {Promise<boolean>} true si se actualizó exitosamente
   */
  const updateAddress = useCallback(async (addressId, addressData) => {
    // Validar datos antes de enviar
    const validation = addressesService.validateAddressData(addressData);
    if (!validation.isValid) {
      setError(validation.errors);
      return false;
    }

    setUpdating(true);
    setError(null);

    try {
      const result = await addressesService.updateAddress(addressId, addressData);
      
      if (result.success) {
        // Actualizar la dirección en la lista local
        setAddresses(prevAddresses => 
          prevAddresses.map(addr => 
            addr.id_direccion === parseInt(addressId) 
              ? result.address 
              : addr
          )
        );

        // Si la dirección actualizada es predeterminada, actualizar las demás
        if (result.address.predeterminada === 'si') {
          setAddresses(prevAddresses => 
            prevAddresses.map(addr => 
              addr.id_direccion === result.address.id_direccion 
                ? addr 
                : { ...addr, predeterminada: 'no' }
            )
          );
          setDefaultAddress(result.address);
        }

        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      console.error('Error en updateAddress:', err);
      
      if (err.validationErrors) {
        setError(err.validationErrors);
      } else {
        setError(err.message || 'Error al actualizar la dirección');
      }
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  /**
   * Establecer una dirección como predeterminada
   * @param {string} addressId - ID de la dirección
   * @returns {Promise<boolean>} true si se estableció exitosamente
   */
  const setAddressAsDefault = useCallback(async (addressId) => {
    setSettingDefault(true);
    setError(null);

    try {
      const result = await addressesService.setAsDefault(addressId);
      
      if (result.success) {
        // Actualizar todas las direcciones en la lista local
        setAddresses(prevAddresses => 
          prevAddresses.map(addr => ({
            ...addr,
            predeterminada: addr.id_direccion === parseInt(addressId) ? 'si' : 'no'
          }))
        );

        // Actualizar la dirección predeterminada
        setDefaultAddress(result.address);
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      console.error('Error en setAddressAsDefault:', err);
      setError(err.message || 'Error al establecer dirección predeterminada');
      return false;
    } finally {
      setSettingDefault(false);
    }
  }, []);

  /**
   * Obtener la dirección predeterminada
   */
  const fetchDefaultAddress = useCallback(async () => {
    try {
      const result = await addressesService.getDefaultAddress();
      
      if (result.success) {
        setDefaultAddress(result.address);
      }
    } catch (err) {
      console.error('Error al obtener dirección predeterminada:', err);
      // No mostramos error aquí porque es normal no tener dirección predeterminada
    }
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Recargar direcciones
   */
  const refreshAddresses = useCallback(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  // Cargar direcciones al montar el componente
  useEffect(() => {
    fetchAddresses();
    fetchDefaultAddress();
  }, [fetchAddresses, fetchDefaultAddress]);

  /**
   * Obtener la dirección predeterminada
   */
  const getDefaultAddress = useCallback(() => {
    return defaultAddress || addresses.find(address => address.predeterminada === 'si') || null;
  }, [defaultAddress, addresses]);

  return {
    // Estado
    addresses,
    loading,
    error,
    creating,
    updating,
    settingDefault,
    defaultAddress,
    total,
    
    // Acciones
    createAddress,
    updateAddress,
    setAddressAsDefault,
    refreshAddresses,
    fetchDefaultAddress,
    clearError,
    
    // Helpers
    getDefaultAddress,
    
    // Información adicional
    hasAddresses: addresses.length > 0,
    hasDefaultAddress: addresses.some(addr => addr.predeterminada === 'si')
  };
};

export default useAddresses;
