import Link from "next/link";
import prisma from "@/lib/prisma";
import { updateOrderStatus } from "@/app/actions/orders";
import WhatsAppBtn from "@/components/WhatsAppBtn"; // 👈 Importamos el componente nuevo

export default async function DeliveryPage() {
  
  const deliveries = await prisma.order.findMany({
    where: { status: "IN_ROUTE" },
    include: {
      customer: true,
      items: { include: { product: true } }
    },
    orderBy: { deliveryDate: 'asc' }
  });

  return (
    <main className="min-h-screen bg-gray-100 font-sans pb-20">
      
      <nav className="bg-bloomly-olive text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <div className="font-bold text-lg flex items-center gap-2">
          <span>🚚</span> Ruta Activa
        </div>
        <Link href="/" className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
          Salir
        </Link>
      </nav>

      <div className="bg-white p-4 mb-4 border-b border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm">Paquetes en la camioneta:</p>
        <h1 className="text-3xl font-bold text-gray-800">{deliveries.length} Paradas</h1>
      </div>

      <div className="px-4 space-y-4">
        {deliveries.map((order) => {
          
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address || "")}`;
          const dateStr = new Date(order.deliveryDate).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-200 ring-1 ring-blue-50">
              
              <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-start">
                <div>
                    <div className="flex gap-2 mb-1">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            #{order.id}
                        </span>
                        <span className="bg-white text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                            📅 {dateStr}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{order.recipientName || order.customer.name}</h3>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                   🎁
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl mt-0.5">📍</span>
                    <div className="w-full">
                        <p className="text-sm font-bold text-gray-800 leading-snug">
                            {order.address || "Dirección no especificada"}
                        </p>
                        <a href={mapsUrl} target="_blank" className="text-xs text-blue-600 font-bold mt-1 inline-block underline">
                            Ver en mapa
                        </a>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-5 border border-gray-100 flex gap-3 items-center">
                    <span className="text-lg">💐</span>
                    <div>
                        <span className="font-bold text-gray-800 text-xs block">Lleva:</span>
                        {order.items[0]?.product.name}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <a href={mapsUrl} target="_blank" className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm border border-gray-200">
                        🗺️ Navegar
                    </a>
                    
                    {/* 👇 AQUÍ USAMOS TU COMPONENTE CLIENTE */}
                    <WhatsAppBtn 
                        phone={order.customer.phone} 
                        recipientName={order.recipientName || order.customer.name}
                        className="flex items-center justify-center gap-2 bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition-colors text-sm border border-green-200"
                    />
                </div>

                <form action={async () => { "use server"; await updateOrderStatus(order.id, "DELIVERED"); }}>
                    <button className="w-full bg-bloomly-olive text-white font-bold py-4 rounded-xl shadow-md hover:bg-bloomly-green transition-all flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-wide">
                        ✅ Confirmar Entrega
                    </button>
                </form>
              </div>
            </div>
          );
        })}

        {deliveries.length === 0 && (
            <div className="text-center py-20 opacity-60">
                <p>No hay entregas en ruta.</p>
                <Link href="dashboard/orders" className="text-bloomly-olive underline">Ir al Tablero</Link>
            </div>
        )}
      </div>
    </main>
  );
}