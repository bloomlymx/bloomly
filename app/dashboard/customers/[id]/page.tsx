import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// ⚠️ CAMBIO IMPORTANTE: Definimos params como una Promesa
export default async function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. "Esperamos" a que lleguen los parámetros (Desempaquetar la promesa)
  const { id } = await params;

  console.log("--- INTENTANDO VER PERFIL ---");
  console.log("ID recibido en URL:", id);

  const customerId = parseInt(id);
  
  // Validación de seguridad
  if (isNaN(customerId)) {
    return notFound();
  }

  // 2. Buscamos al cliente en la Base de Datos
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });

  // 3. Si no existe en BD, lanzamos 404
  if (!customer) {
    return notFound();
  }

  // --- CÁLCULOS ---
  const totalSpent = customer.orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = customer.orders.length;
  // Calculamos promedio evitando división por cero
  const averageTicket = totalOrders > 0 ? (totalSpent / totalOrders) : 0;
  
  // Limpiamos el teléfono para el link de WhatsApp
  const cleanPhone = customer.phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(customer.name)},%20te%20escribimos%20de%20Bloomly...`;

  return (
    <main className="min-h-screen bg-bloomly-bg font-sans p-8">
      
      {/* Navegación */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/dashboard/customers" className="text-sm text-gray-400 hover:text-bloomly-olive transition-colors font-bold">
          ← Volver al Directorio
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Perfil */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-bloomly-olive/10 text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
              👤
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
            <p className="text-gray-500 text-sm mb-6">Cliente registrado</p>
            
            <a 
              href={whatsappUrl} 
              target="_blank" 
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-200"
            >
              💬 Enviar WhatsApp
            </a>

            <div className="mt-6 text-left space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block">Teléfono</label>
                <p className="text-gray-700 font-medium">{customer.phone}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block">Email</label>
                <p className="text-gray-700 font-medium">{customer.email || "No registrado"}</p>
              </div>
            </div>
          </div>

          {/* Tarjeta LTV */}
          <div className="bg-bloomly-olive text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xs font-bold text-white/70 uppercase mb-4">Valor del Cliente (LTV)</h3>
            <div className="text-4xl font-bold mb-1">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-sm text-white/80">Total gastado</p>
            
            <div className="mt-6 pt-6 border-t border-white/20 flex justify-between">
              <div>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <div className="text-xs opacity-70">Pedidos</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${Math.round(averageTicket)}</div>
                <div className="text-xs opacity-70">Ticket Promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Historial */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-bloomly-olive mb-4">📜 Historial de Compras</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {customer.orders.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {customer.orders.map((order) => (
                  <li key={order.id} className="p-5 hover:bg-gray-50 flex justify-between items-center border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-bloomly-pink/20 rounded-lg flex items-center justify-center text-lg">
                            🎁
                        </div>
                        <div>
                        <h4 className="font-bold text-gray-800">
                            {order.items[0]?.product?.name || "Pedido Personalizado"}
                             {order.items.length > 1 && <span className="text-xs text-gray-400 font-normal ml-1">(+ items)</span>}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">${order.total}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status === 'DELIVERED' ? 'Entregado' : 
                         order.status === 'PENDING' ? 'Pendiente' : order.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-10 text-center text-gray-400">Sin historial de compras.</div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}