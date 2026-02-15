"use client";

import { useState } from "react";
import { updateOrderStatus, deleteOrder } from "@/app/actions/orders";
import CreateOrderBtn from "./CreateOrderBtn";

interface Order {
  id: number;
  customer: { name: string; phone: string };
  status: string;
  total: number;
  items: { product: { name: string } }[];
  address?: string | null;
  dedication?: string | null;
  recipientName?: string | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function OrderBoard({ orders, products }: { orders: Order[], products: Product[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const pending = orders.filter((o) => o.status === "PENDING");
  const designing = orders.filter((o) => o.status === "DESIGNING");
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
              <OrderCard key={order.id} order={order} nextStatus="DESIGNING" nextLabel="A Diseño →" color="bg-white border-l-4 border-l-red-400" onOpen={() => setSelectedOrder(order)} />
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
              <OrderCard key={order.id} order={order} nextStatus="IN_ROUTE" nextLabel="Enviar a Ruta 🚚" color="bg-white border-l-4 border-l-bloomly-olive" onOpen={() => setSelectedOrder(order)} />
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
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className="block group relative cursor-pointer"
              >
                <div className={`p-4 rounded-xl shadow-sm border transition-all hover:shadow-md
                    ${order.status === 'IN_ROUTE' 
                        ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' 
                        : 'bg-white/60 border-green-100 opacity-70 hover:opacity-100'
                    }
                `}>
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
                        {order.status === 'IN_ROUTE' ? (
                             <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">🚚 EN CAMINO</span>
                        ) : (
                             <span className="text-green-600 font-bold text-xs">✔ ENTREGADO</span>
                        )}
                    </div>
                    
                    <p className="font-medium text-sm text-gray-700 mb-1">{order.customer.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{order.items[0]?.product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLES CON BOTÓN DE WHATSAPP DIRECTO */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h4 className="font-black text-xl text-gray-800">Pedido #{selectedOrder.id}</h4>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">✕</button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cliente</p>
                  <p className="font-black text-xl text-gray-800 leading-none">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-500 mb-3">{selectedOrder.customer.phone}</p>
                  
                  {/* BOTÓN WHATSAPP DIRECTO */}
                  <a 
                    href={`https://wa.me/52${selectedOrder.customer.phone}?text=${encodeURIComponent(`Hola ${selectedOrder.customer.name}, te contacto de la florería respecto a tu pedido #${selectedOrder.id} 🌸`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#20bd5a] transition-all shadow-md active:scale-95"
                  >
                    <span>💬</span> Hablar por WhatsApp
                  </a>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="font-black text-2xl text-bloomly-olive">${selectedOrder.total}</p>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Dirección de Entrega</p>
                <p className="text-sm text-blue-900 font-medium flex items-start gap-2">
                  <span>📍</span> {selectedOrder.address || "No especificada"}
                </p>
              </div>

              <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2">Mensaje de Dedicatoria</p>
                <p className="text-sm italic text-pink-900 font-serif">
                  " {selectedOrder.dedication || "Sin mensaje" } "
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Resumen de Productos</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-700 text-sm">{item.product.name}</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-xs font-black text-gray-400 border border-gray-100">x1</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full py-4 bg-white border border-gray-200 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all active:scale-[0.98]"
               >
                 Cerrar Detalles
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, nextStatus, nextLabel, color, onOpen }: any) {
  return (
    <div onClick={onOpen} className="block group relative cursor-pointer">
        <div className={`${color} p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all`}>
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
            <p className="text-xs text-gray-500 line-clamp-1">{order.items[0]?.product.name || "Varios"}</p>
            
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateOrderStatus(order.id, nextStatus);
                }}
                className="w-full mt-4 py-2 bg-gray-100 hover:bg-bloomly-olive hover:text-white text-gray-600 text-[10px] font-black rounded-lg transition-colors"
            >
                {nextLabel}
            </button>
        </div>
    </div>
  );
}