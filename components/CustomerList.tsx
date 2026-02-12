"use client";

import { useState } from "react";

// Definimos qué datos necesitamos del cliente
interface Customer {
  id: number;
  name: string;
  phone: string;
  orders: {
    id: number;
    total: number;
    createdAt: Date;
    status: string;
  }[];
}

export default function CustomerList({ customers }: { customers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Función para abrir WhatsApp
  const openWhatsApp = (phone: string, name: string) => {
    // Limpiamos el teléfono (quitamos guiones o espacios si los hubiera)
    const cleanPhone = phone.replace(/\D/g, ''); 
    const message = `Hola ${name}, te saludamos de Bloomly 🌿...`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filtramos clientes por búsqueda
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-bloomly-olive/5 overflow-hidden">
      
      {/* Barra de Búsqueda */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre o teléfono..." 
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-bloomly-olive text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full text-left">
        <thead className="bg-white text-gray-500 text-xs uppercase font-bold tracking-wider">
          <tr>
            <th className="p-4">Cliente</th>
            <th className="p-4">Nivel / Estatus</th>
            <th className="p-4 text-center">Pedidos</th>
            <th className="p-4 text-right">Total Gastado (LTV)</th>
            <th className="p-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {filteredCustomers.map((client) => {
            
            // 🧠 CÁLCULOS AUTOMÁTICOS
            const totalSpent = client.orders.reduce((acc, order) => acc + order.total, 0);
            const totalOrders = client.orders.length;
            const lastOrder = client.orders.length > 0 ? new Date(client.orders[0].createdAt).toLocaleDateString() : "N/A";
            
            // Lógica VIP: Si ha gastado más de $2000 es VIP
            const isVIP = totalSpent > 2000;

            return (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-gray-800">{client.name}</div>
                  <div className="text-xs text-gray-400">Tel: {client.phone}</div>
                </td>
                
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {isVIP ? (
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                        ⭐ CLIENTE VIP
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                        👤 REGULAR
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">Última compra: {lastOrder}</span>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span className="font-bold bg-bloomly-olive/10 text-bloomly-olive px-2 py-1 rounded-md">
                    {totalOrders}
                  </span>
                </td>

                <td className="p-4 text-right font-bold text-gray-700">
                  ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>

                <td className="p-4 text-center">
                  <button 
                    onClick={() => openWhatsApp(client.phone, client.name)}
                    className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
                    title="Enviar WhatsApp"
                  >
                    💬
                  </button>
                  {/* Aquí podríamos agregar un botón "Ver Historial" en el futuro */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredCustomers.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No encontramos clientes con ese nombre.
        </div>
      )}
    </div>
  );
}