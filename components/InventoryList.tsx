"use client";

import { reportWaste } from "@/app/actions/inventory";

interface Batch {
  id: number;
  flowerType: string;
  quantity: number;
  originalQty: number;
  purchaseDate: Date;
  status: string;
}

export default function InventoryList({ batches }: { batches: Batch[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-400 font-bold text-[10px] uppercase">
          <tr>
            <th className="p-4">Flor</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Stock</th>
            <th className="p-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {batches.map((batch) => (
            <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-bold text-gray-700">{batch.flowerType}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  batch.status === 'RISK' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {batch.status}
                </span>
              </td>
              <td className="p-4 text-gray-500">
                {batch.quantity} / <span className="text-[10px]">{batch.originalQty}</span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => {
                    if(confirm("¿Marcar este lote como merma (basura)?")) {
                        reportWaste(batch.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-600 text-xs font-bold"
                >
                  🗑️ Merma
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}