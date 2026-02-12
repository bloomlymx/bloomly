"use client";

import { addFlowerBatch } from "@/app/actions/inventory";

export default function AddBatchBtn() {
  return (
    <form action={addFlowerBatch} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-2">📥 Nueva Entrada de Inventario</h3>
      
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Flor</label>
        <input 
          name="flowerType" 
          placeholder="Ej: Rosas Rojas" 
          required 
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Cantidad (Tallos)</label>
          <input 
            type="number" 
            name="quantity" 
            placeholder="144" 
            required 
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Costo Total</label>
          <input 
            type="number" 
            step="0.01" 
            name="purchasePrice" 
            placeholder="$ 0.00" 
            required 
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none text-sm"
          />
        </div>
      </div>

      <button className="w-full bg-bloomly-olive text-white font-bold py-2 rounded-lg hover:bg-bloomly-green transition-all text-sm shadow-sm">
        + Registrar Lote
      </button>
    </form>
  );
}