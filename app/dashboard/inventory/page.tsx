import prisma from "@/lib/prisma";
import { addFlowerBatch, reportWaste, checkFreshness } from "@/app/actions/inventory";
import Link from "next/link";

export default async function InventoryPage() {
  
  // Forzamos el chequeo de frescura al entrar (Solo para demo)
  await checkFreshness();

  // Traer lotes activos (Frescos o en Riesgo)
  const batches = await prisma.flowerBatch.findMany({
    where: { 
        status: { in: ["FRESH", "RISK"] },
        quantity: { gt: 0 } 
    },
    orderBy: { purchaseDate: 'asc' } // Lo más viejo primero (FIFO)
  });

  return (
    <main className="min-h-screen bg-bloomly-bg font-sans p-8">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-bloomly-olive">Inventario de Taller ✂️</h1>
            <p className="text-gray-500">Gestiona la vida útil de tus insumos.</p>
        </div>
        <Link href="/" className="text-sm font-bold text-gray-500 hover:text-bloomly-olive">
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA 1: Registrar Entrada */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                📥 Registrar Entrada
            </h3>
            <form action={addFlowerBatch} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Tipo de Flor</label>
                    <select name="flowerType" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none mt-1">
                        <option value="Rosas Rojas">🌹 Rosas Rojas</option>
                        <option value="Rosas Blancas">🤍 Rosas Blancas</option>
                        <option value="Girasoles">🌻 Girasoles</option>
                        <option value="Tulipanes">🌷 Tulipanes</option>
                        <option value="Gerberas">🌼 Gerberas</option>
                        <option value="Follaje">🌿 Follaje / Verdes</option>
                    </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Cantidad (Tallos)</label>
                        <input type="number" name="quantity" placeholder="Ej: 144" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Costo Total ($)</label>
                        <input type="number" step="0.01" name="purchasePrice" placeholder="$" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none mt-1" />
                    </div>
                </div>

                <button className="w-full bg-bloomly-olive text-white font-bold py-3 rounded-xl hover:bg-bloomly-green transition-colors shadow-sm">
                    + Agregar Stock
                </button>
            </form>
        </div>

        {/* COLUMNA 2 y 3: Tabla de Lotes */}
        <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Lotes Activos</h3>
                    <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">FIFO: First In, First Out</span>
                </div>
                
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-gray-400 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Flor / Lote</th>
                            <th className="p-4">Edad</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {batches.map((batch) => {
                            const daysOld = Math.floor((new Date().getTime() - new Date(batch.purchaseDate).getTime()) / (1000 * 3600 * 24));
                            const isRisk = batch.status === 'RISK' || daysOld >= 7;

                            return (
                                <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800">{batch.flowerType}</p>
                                        <p className="text-xs text-gray-400">Lote #{batch.id}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                            isRisk ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {daysOld} días
                                            {isRisk && <span>⚠️</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">
                                        {batch.quantity} <span className="text-gray-400 text-xs">/ {batch.originalQty}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <form action={reportWaste.bind(null, batch.id)}>
                                            <button 
                                                className="text-red-400 hover:text-red-600 font-bold text-xs underline decoration-dotted"
                                                title="Marcar todo el restante como basura"
                                            >
                                                🗑️ Merma
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                        {batches.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                    No hay inventario registrado. Empieza agregando flores.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Nota educativa */}
            <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-xs rounded-xl border border-yellow-100">
                💡 <b>Tip de Negocio:</b> El sistema marca automáticamente como "RIESGO" las flores con más de 7 días. Úsalas primero para arreglos pequeños o promociones.
            </div>
        </div>

      </div>
    </main>
  );
}