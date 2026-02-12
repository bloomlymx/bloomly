import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function CustomersPage() {
  
  // Traemos los clientes
  const customers = await prisma.customer.findMany({
    include: {
      orders: true 
    },
    orderBy: { name: 'asc' }
  });

  // Helper para obtener iniciales (Ej: Ana García -> AG)
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        {/* CORRECCIÓN 1: El enlace de volver ahora va al Dashboard real */}
        <Link href="/dashboard" className="text-sm text-bloomly-olive hover:underline mb-2 block">← Volver al Dashboard</Link>
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-4xl font-bold text-bloomly-olive tracking-tight">Mis Clientes 👥</h1>
                <p className="text-gray-500 mt-1">Gestiona tu cartera y fideliza a tus compradores.</p>
            </div>
            <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase block">Total Registrados</span>
                <span className="text-2xl font-bold text-bloomly-olive">{customers.length}</span>
            </div>
        </div>
      </div>

      {/* Grid de Tarjetas PRO */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {customers.map((client) => {
          const totalSpent = client.orders.reduce((acc, order) => acc + order.total, 0);
          const totalOrders = client.orders.length;
          const isVIP = totalSpent > 2000;

          return (
            // CORRECCIÓN 2: Actualizamos la ruta para incluir /dashboard
            <Link key={client.id} href={`/dashboard/customers/${client.id}`} className="group">
              <div className={`
                relative bg-white rounded-2xl p-6 transition-all duration-300
                border hover:-translate-y-1 hover:shadow-xl
                ${isVIP ? 'border-l-4 border-l-yellow-400 border-t-gray-100 border-r-gray-100 border-b-gray-100' : 'border-gray-100'}
              `}>
                
                {/* Badge VIP Flotante */}
                {isVIP && (
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        ⭐ VIP
                    </div>
                )}

                {/* Cabecera: Avatar e Info */}
                <div className="flex items-center gap-4 mb-6">
                    {/* Avatar con Iniciales */}
                    <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm
                        ${isVIP ? 'bg-bloomly-olive text-white' : 'bg-bloomly-pink/20 text-bloomly-olive'}
                    `}>
                        {getInitials(client.name)}
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-xl text-gray-800 group-hover:text-bloomly-olive transition-colors leading-tight">
                            {client.name}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            📱 {client.phone}
                        </p>
                    </div>
                </div>

                {/* Métricas Visuales */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pedidos</span>
                        <span className="text-lg font-bold text-gray-700">{totalOrders}</span>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                        <span className="block text-[10px] text-green-600/70 font-bold uppercase tracking-wider">LTV (Gastado)</span>
                        <span className="text-lg font-bold text-bloomly-olive">${totalSpent.toLocaleString()}</span>
                    </div>
                </div>

                {/* Botón Call To Action */}
                <div className="w-full py-2.5 rounded-lg border border-bloomly-olive/30 text-bloomly-olive text-center text-sm font-bold group-hover:bg-bloomly-olive group-hover:text-white transition-all flex items-center justify-center gap-2">
                    📂 Ver Expediente
                </div>

              </div>
            </Link>
          );
        })}
        
        {/* Empty State */}
        {customers.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 text-lg">Aún no hay clientes.</p>
            <p className="text-sm text-gray-400">Registra un pedido para verlos aquí.</p>
          </div>
        )}

      </div>
    </main>
  );
}