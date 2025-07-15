import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

const StockAlert = ({ product, className = '' }) => {
  // Verificar información de stock del producto usando múltiples fuentes
  const enStock = product?.en_stock;
  
  const cantidadDisponible = product?.cantidad_disponible || 
                            product?.inventario_info?.cantidad_disponible ||
                            (product?.inventarios?.[0]?.cantidad_disponible);
  
  const estadoInventario = product?.inventario_info?.estado_inventario ||
                          product?.inventarios?.[0]?.estado;

  // Si no hay información de stock en absoluto, mostrar como no disponible
  if (enStock === undefined && cantidadDisponible === undefined) {
    return (
      <div className={`flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md text-sm ${className}`}>
        <Package className="w-4 h-4" />
        <span className="font-medium">Información de stock no disponible</span>
      </div>
    );
  }

  // Producto agotado
  if (enStock === false || cantidadDisponible === 0 || estadoInventario === 'agotado') {
    return (
      <div className={`flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md text-sm ${className}`}>
        <Package className="w-4 h-4" />
        <span className="font-medium">Agotado</span>
      </div>
    );
  }
  
  // Stock bajo (menos de 10 unidades)
  if (cantidadDisponible && cantidadDisponible <= 10 && cantidadDisponible > 0) {
    return (
      <div className={`flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-md text-sm ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span className="font-medium">
          Solo {cantidadDisponible} {cantidadDisponible === 1 ? 'unidad disponible' : 'unidades disponibles'}
        </span>
      </div>
    );
  }
  
  // Stock normal - no mostrar nada
  return null;
};

export default StockAlert;
