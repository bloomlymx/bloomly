"use client";

import { useState } from "react";
import { createProduct } from "@/app/actions/products";

export default function AddProductBtn() {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createProduct(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-bloomly-olive text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-bloomly-green transition-colors flex items-center gap-2 text-sm"
      >
        <span>+</span> Nuevo Arreglo
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-bloomly-olive p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">🌸 Nuevo Producto</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">✕</button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nombre del Arreglo</label>
                <input name="name" required placeholder="Ej: Ramo Buchón 50 Rosas" className="w-full border p-3 rounded-lg focus:outline-none focus:border-bloomly-olive" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">URL de la Imagen</label>
                <input name="imageUrl" placeholder="https://..." className="w-full border p-3 rounded-lg focus:outline-none focus:border-bloomly-olive" />
                <p className="text-[10px] text-gray-400 mt-1">*Tip: Copia la dirección de una imagen de Google</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Precio de Venta ($)</label>
                <input name="price" type="number" required placeholder="0.00" className="w-full border p-3 rounded-lg focus:outline-none focus:border-bloomly-olive" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Descripción</label>
                <textarea name="description" placeholder="Incluye tarjeta y moño..." className="w-full border p-3 rounded-lg focus:outline-none focus:border-bloomly-olive" rows={3} />
              </div>

              <button type="submit" className="w-full bg-bloomly-olive text-white font-bold py-3 rounded-xl hover:bg-bloomly-green shadow-lg mt-2">
                Guardar Producto
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}