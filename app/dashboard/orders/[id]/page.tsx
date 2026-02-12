import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/orders";
import PrintButton from "@/components/PrintButton"; // 👈 Importamos el botón nuevo

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = parseInt(id);

  if (isNaN(orderId)) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) return notFound();

  const formattedDate = new Date(order.deliveryDate).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const whatsappMsg = `Hola ${order.customer.name}, te escribimos de Florería Las Lilas sobre tu pedido #${order.id}...`;
  const whatsappUrl = `https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <main className="min-h-screen bg-bloomly-bg font-sans p-8 print:p-0 print:bg-white">
      
      {/* ==========================================
          VISTA DE PANTALLA (Se oculta al imprimir)
         ========================================== */}
      <div className="print:hidden">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <Link href="/orders" className="text-sm font-bold text-gray-500 hover:text-bloomly-olive flex items-center gap-2">
            ← Volver al Tablero
          </Link>
          <div className="flex gap-3">
             <PrintButton /> {/* 👈 Aquí está el botón */}
             
             <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${
               order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' :
               order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
               'bg-blue-100 text-blue-700 border-blue-200'
             }`}>
               {order.status === 'PENDING' ? '⏳ POR ACEPTAR' : 
                order.status === 'DESIGNING' ? '✂️ EN DISEÑO' : '✅ ENTREGADO'}
             </span>
          </div>
        </div>

        {/* ... (El resto del diseño de pantalla que ya teníamos) ... */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-bloomly-olive/10 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <h1 className="font-bold text-xl text-gray-800">Pedido #{order.id}</h1>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contenido</h3>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center mb-4">
                      <img src={item.product.imageUrl || "/placeholder.jpg"} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{item.product.name}</p>
                        <p className="text-sm text-bloomly-olive font-bold">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-100 my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">📅 Fecha de Entrega</h3>
                    <p className="font-bold text-gray-800 capitalize">{formattedDate}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">👤 Recibe</h3>
                    <p className="font-bold text-gray-800">{order.recipientName || "Mismo cliente"}</p>
                  </div>
                  <div className="md:col-span-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">📍 Dirección de Entrega</h3>
                    <p className="text-gray-800 font-medium text-sm">{order.address || "Recoger en tienda"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-bloomly-olive/10 p-6 relative">
              <div className="absolute top-0 left-6 -mt-3 bg-bloomly-pink text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                💌 Para la Tarjeta
              </div>
              <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-600 font-serif text-lg text-center leading-relaxed">
                "{order.dedication || "Sin mensaje."}"
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-bloomly-olive/10 p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Datos del Comprador</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-bloomly-olive/10 flex items-center justify-center font-bold text-bloomly-olive">{order.customer.name.charAt(0)}</div>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">{order.customer.name}</p>
                  <p className="text-xs text-gray-400">{order.customer.phone}</p>
                </div>
              </div>
              <a href={whatsappUrl} target="_blank" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors text-sm shadow-sm">
                <span>💬</span> Contactar
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-bloomly-olive/10 p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Gestión</h3>
                <form action={async () => { "use server"; await updateOrderStatus(orderId, "DELIVERED"); }}>
                    <button className="w-full bg-green-50 text-green-700 hover:bg-green-100 font-bold py-3 rounded-xl transition-colors text-sm">🚚 Marcar Entregado</button>
                </form>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          VISTA DE IMPRESIÓN (Solo sale en papel)
         ========================================== */}
      <div className="hidden print:block font-mono text-black">
        
        {/* Encabezado TICKET INTERNO */}
        <div className="border-b-2 border-black pb-4 mb-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold uppercase">Orden de Trabajo #{order.id}</h1>
                    <p className="text-sm">Florería Las Lilas • Bloomly System</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                    <p className="text-xs uppercase">Fecha de Entrega</p>
                </div>
            </div>
        </div>

        {/* Cuerpo de la Orden */}
        <div className="grid grid-cols-2 gap-8 mb-8">
            
            {/* Columna Izquierda: LOGÍSTICA */}
            <div>
                <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">📍 Datos de Entrega</h3>
                <div className="mb-4">
                    <p className="font-bold text-lg">{order.recipientName || order.customer.name}</p>
                    <p className="text-lg leading-tight mt-1">{order.address || "RECOGER EN TIENDA"}</p>
                </div>

                <h3 className="font-bold border-b border-black mb-2 uppercase text-sm mt-6">📞 Contacto Comprador</h3>
                <p>{order.customer.name} - {order.customer.phone}</p>
            </div>

            {/* Columna Derecha: RECETA / PRODUCTO */}
            <div>
                <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">💐 Detalles del Arreglo</h3>
                {order.items.map((item) => (
                    <div key={item.id} className="mb-2">
                        <p className="font-bold text-xl">1x {item.product.name}</p>
                        <p className="text-xs italic">{item.product.description || "Diseño estándar"}</p>
                    </div>
                ))}
                
                <div className="mt-8 border border-black p-2 text-center text-xs">
                    ESPACIO PARA CONTROL DE CALIDAD
                    <br/><br/><br/>
                    __________________________<br/>
                    Firma Florista
                </div>
            </div>
        </div>

        {/* Línea de corte */}
        <div className="w-full border-t border-dashed border-gray-400 my-8 flex items-center justify-center">
            <span className="bg-white px-4 text-xs text-gray-500">✂️ RECORTAR TARJETA (OPCIONAL)</span>
        </div>

        {/* TARJETA DE REGALO */}
        <div className="border-4 border-double border-gray-300 p-8 text-center max-w-2xl mx-auto rounded-xl">
            <div className="mb-6">
                <span className="font-bold text-xs uppercase tracking-[0.3em] text-gray-400">Dedicatoria</span>
            </div>
            
            {/* Fuente Serif para simular elegancia */}
            <p className="text-3xl font-serif italic leading-relaxed px-8">
                "{order.dedication}"
            </p>

            <div className="mt-10 flex justify-center">
                <div className="w-16 h-1 bg-gray-200"></div>
            </div>
            
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase">
                {order.status === 'DELIVERED' ? 'Entregado con amor' : 'Florería Las Lilas'}
            </p>
        </div>

      </div>

    </main>
  );
}