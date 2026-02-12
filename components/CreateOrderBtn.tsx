"use client";

import { useState } from "react";
import { createRealOrder } from "@/app/actions/orders";

export default function CreateOrderBtn({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  // Estado para el precio dinámico
  const [selectedPrice, setSelectedPrice] = useState<number | string>("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    await createRealOrder(formData);
    setIsPending(false);
    setIsOpen(false);
    setSelectedPrice(""); // Resetear precio
  }

  // Cuando cambia el select, actualizamos el precio automáticamente
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedPrice(product.price);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm bg-bloomly-olive text-white px-4 py-2 rounded-lg hover:bg-bloomly-green font-bold shadow-md transition-colors flex items-center gap-2"
      >
        <span>+</span> Nuevo Pedido
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-bloomly-olive p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">📝 Tomar Pedido</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">✕</button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                  <input name="clientName" required placeholder="Nombre" className="w-full border border-gray-300 rounded-lg p-2 focus:border-bloomly-olive focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                  <input name="clientPhone" required placeholder="55..." className="w-full border border-gray-300 rounded-lg p-2 focus:border-bloomly-olive focus:outline-none" />
                </div>
              </div>

              {/* SELECTOR DE PRODUCTOS (Nuevo) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Producto</label>
                <select 
                  name="productId" 
                  required 
                  onChange={handleProductChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:border-bloomly-olive focus:outline-none bg-white"
                >
                  <option value="">-- Selecciona un arreglo --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Total ($)</label>
                <input 
                  name="price" 
                  type="number" 
                  required 
                  // El valor cambia según lo que seleccionamos, pero permite editarlo si queremos dar descuento
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  placeholder="0.00" 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:border-bloomly-olive focus:outline-none text-lg font-bold text-bloomly-olive" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={isPending} className="flex-1 py-3 bg-bloomly-olive text-white font-bold rounded-xl hover:bg-bloomly-green shadow-lg">
                  {isPending ? "Guardando..." : "Crear Pedido"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}