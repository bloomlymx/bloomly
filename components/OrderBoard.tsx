"use client";

import Link from "next/link";
import { updateOrderStatus, deleteOrder } from "@/app/actions/orders";
import CreateOrderBtn from "./CreateOrderBtn";

interface Order {
  id: number;
  customer: { name: string; phone: string };
  status: string;
  total: number;
  items: { product: { name: string } }[];
  address?: string | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function OrderBoard({ orders, products }: { orders: Order[], products: Product[] }) {
  
  const pending = orders.filter((o) => o.status === "PENDING");
  const designing = orders.filter((o) => o.status === "DESIGNING");
  
  // 3. Juntamos "En Ruta" y "Entregados" en la última columna, pero los diferenciamos visualmente
  const completedOrRoute = orders.filter((o) => o.status === "IN_ROUTE" || o.status === "DELIVERED");

  return (
    <div className="mt-8">
      <div className="mb-6 flex justify-end">
        <CreateOrderBtn products={products} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        
        {/* COLUMNA 1: POR HACER */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col">
          <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2">
            📋 Por Aceptar <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">{pending.length}</span>
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1">
            {pending.map((order) => (
              <OrderCard key={order.id} order={order} nextStatus="DESIGNING" nextLabel="A Diseño →" color="bg-white border-l-4 border-l-red-400" />
            ))}
          </div>
        </div>

        {/* COLUMNA 2: EN DISEÑO */}
        <div className="bg-bloomly-light/50 rounded-2xl p-4 border border-bloomly-olive/10 flex flex-col">
          <h3 className="font-bold text-bloomly-olive mb-4 flex items-center gap-2">
            ✂️ En Mesa de Diseño <span className="bg-bloomly-olive text-white text-xs px-2 py-1 rounded-full">{designing.length}</span>
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1">
            {designing.map((order) => (
              // 👇 AQUÍ ESTÁ EL CAMBIO: Ahora pasa a "IN_ROUTE", no a "DELIVERED"
              <OrderCard key={order.id} order={order} nextStatus="IN_ROUTE" nextLabel="Enviar a Ruta 🚚" color="bg-white border-l-4 border-l-bloomly-olive" />
            ))}
          </div>
        </div>

        {/* COLUMNA 3: RUTA Y COMPLETADOS */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex flex-col">
          <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
            🚚 Ruta / Listo <span className="bg-green-200 text-xs px-2 py-1 rounded-full">{completedOrRoute.length}</span>
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1">
            {completedOrRoute.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="block group relative">
                <div className={`p-4 rounded-xl shadow-sm border transition-all hover:shadow-md cursor-pointer
                    ${order.status === 'IN_ROUTE' 
                        ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' // Estilo destacado para EN RUTA
                        : 'bg-white/60 border-green-100 opacity-70 hover:opacity-100' // Estilo apagado para ENTREGADO
                    }
                `}>
                    
                    {/* Botón Borrar */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if(confirm('¿Eliminar historial de este pedido?')) deleteOrder(order.id);
                        }}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-2 z-10"
                    >
                        ✕
                    </button>
                    
                    <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-800">#{order.id}</span>
                        {/* Badge dinámico según estatus */}
                        {order.status === 'IN_ROUTE' ? (
                             <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">🚚 EN CAMINO</span>
                        ) : (
                             <span className="text-green-600 font-bold text-xs">✔ ENTREGADO</span>
                        )}
                    </div>
                    
                    <p className="font-medium text-sm text-gray-700 mb-1">{order.customer.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{order.items[0]?.product.name}</p>
                    
                    {/* Si está en ruta, mostramos botón para forzar entrega manual si el chofer falla */}
                    {order.status === 'IN_ROUTE' && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order.id, "DELIVERED");
                            }}
                            className="w-full mt-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold rounded border border-green-200 transition-colors z-20 relative"
                        >
                            Forzar "Entregado"
                        </button>
                    )}

                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function OrderCard({ order, nextStatus, nextLabel, color }: any) {
  return (
    <Link href={`/orders/${order.id}`} className="block group relative">
        <div className={`${color} p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer`}>
        
        <button 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if(confirm('¿Borrar este pedido?')) deleteOrder(order.id);
            }}
            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 font-bold z-10"
        >
            ✕
        </button>

        <div className="flex justify-between items-start mb-2 pr-6">
            <span className="font-bold text-gray-800">#{order.id}</span>
            <span className="text-xs font-bold text-gray-400">${order.total}</span>
        </div>
        <p className="font-medium text-sm text-gray-700 mb-1">{order.customer.name}</p>
        
        <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-500 line-clamp-1">{order.items[0]?.product.name || "Varios"}</p>
            {order.address && (
                <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">WEB</span>
            )}
        </div>
        
        <button 
            onClick={(e) => {
                e.preventDefault();
                updateOrderStatus(order.id, nextStatus);
            }}
            className="w-full py-2 bg-gray-100 hover:bg-bloomly-olive hover:text-white text-gray-600 text-xs font-bold rounded-lg transition-colors relative z-10"
        >
            {nextLabel}
        </button>
        </div>
    </Link>
  );
}