import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <img 
          src={item.producto.url_imagen} 
          alt={item.producto.nombre}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="font-medium text-gray-800">{item.producto.nombre}</h3>
          <p className="text-sm text-gray-500">Precio: S/ {item.producto.precio}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id_item_carrito, Math.max(0, item.cantidad - 1))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{item.cantidad}</span>
          <button
            onClick={() => onUpdateQuantity(item.id_item_carrito, item.cantidad + 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="text-right">
          <p className="font-medium">S/ {(item.producto.precio * item.cantidad).toFixed(2)}</p>
          <button
            onClick={() => onRemove(item.id_item_carrito)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 