import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Buscamos el pedido. Incluimos sus "items" y dentro de los items, el "product"
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { 
        items: {
            include: { product: true }
        }
    }
  });

  if (!order) return notFound();

  // 2. Extraemos el nombre del producto (tomamos el primero de la lista de items)
  const productName = order.items[0]?.product?.name || "Arreglo Floral";

  // 👇 3. AQUÍ PON TU NÚMERO REAL
  // Ponlo con el código de país (52 para México) pero sin el signo de "+". 
  // Ejemplo: "526621234567"
  const MI_NUMERO_WHATSAPP = "526623154025"; 

  // 4. Armamos el mensaje automático para WhatsApp
  const mensajeFormateado = encodeURIComponent(
    `¡Hola! Acabo de hacer un pedido en la tienda.\n\n` +
    `🛒 *Folio:* #${order.id}\n` +
    `🌸 *Arreglo:* ${productName}\n` +
    `💰 *Total:* $${order.total.toLocaleString()}\n\n` +
    `Quiero coordinar el pago, aquí les mando mi comprobante de transferencia: `
  );

  const whatsappLink = `https://wa.me/${MI_NUMERO_WHATSAPP}?text=${mensajeFormateado}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
        
        {/* Confeti y decoración visual */}
        <div className="absolute top-0 left-0 w-full h-2 bg-bloomly-olive"></div>
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
          ✓
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">¡Pedido Recibido!</h1>
        <p className="text-gray-500 mb-8">
          Tu arreglo se está preparando con flores frescas.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tu Folio de Orden</p>
          <p className="text-4xl font-black text-bloomly-olive mb-4">#{order.id}</p>
          
          <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-4 mt-2">
            <span className="text-gray-500">Total a pagar:</span>
            <span className="font-bold text-gray-900 text-lg">${order.total.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 font-medium">
          Para comenzar con tu envío, por favor mándanos un mensaje para confirmarte los datos de transferencia.
        </p>

        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex justify-center items-center gap-2 mb-4"
        >
          <span>💬</span> Enviar Comprobante
        </a>

        <Link href="/shop" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}