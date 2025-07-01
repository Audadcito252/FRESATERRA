import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMercadoPagoAbandonment } from '../hooks/useMercadoPagoAbandonment';

/**
 * Componente que se encarga de manejar el abandono de Mercado Pago.
 * Se coloca dentro del contexto del Router para poder usar useNavigate.
 */
const MercadoPagoHandler = () => {
  // Este componente no renderiza nada, solo ejecuta el hook
  useMercadoPagoAbandonment();
  
  return null;
};

export default MercadoPagoHandler;
