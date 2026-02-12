import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicOrder } from "@/app/actions/shop";
import DedicationWizard from "@/components/DedicationWizard"; // 👈 IMPORTAMOS EL COMPONENTE

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  });

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      {/* Navbar Simple */}
      <nav className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-50">
        <Link href="/shop" className="text-sm font-bold text-gray-500 hover:text-bloomly-olive flex items-center gap-2">
          ← Volver al Catálogo
        </Link>
        <div className="font-bold text-bloomly-olive">Las Lilas</div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 lg:p-12">
        
        {/* COLUMNA IZQUIERDA: La Foto */}
        <div className="relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden shadow-sm bg-gray-50 sticky top-24">
          <img 
            src={product.imageUrl || "/placeholder.jpg"} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="opacity-90 text-lg">{product.description}</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: El Formulario */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">${product.price.toLocaleString()}</h2>
            <p className="text-gray-500 text-sm">Incluye tarjeta dedicatoria, moño y garantía de frescura de 5 días.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl text-bloomly-olive mb-6 flex items-center gap-2">
              ✨ Personaliza tu regalo
            </h3>

            <form action={createPublicOrder} className="space-y-5">
              
              {/* Campos Ocultos */}
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="price" value={product.price} />

              {/* 1. ¿Cuándo y Quién? */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fecha de Entrega</label>
                  <input type="date" name="deliveryDate" required className="w-full p-3 rounded-lg border border-gray-200 focus:border-bloomly-olive outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">¿Quién Recibe?</label>
                  <input type="text" name="recipientName" placeholder="Ej: María Pérez" required className="w-full p-3 rounded-lg border border-gray-200 focus:border-bloomly-olive outline-none" />
                </div>
              </div>

              {/* 2. Dedicatoria con IA (AQUÍ ESTÁ EL CAMBIO) 👇 */}
              <DedicationWizard />

              {/* 3. Dirección */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección de Entrega 📍</label>
                <input type="text" name="address" placeholder="Calle, Número, Colonia, Referencias..." required className="w-full p-3 rounded-lg border border-gray-200 focus:border-bloomly-olive outline-none" />
              </div>

              <hr className="border-gray-200 my-4" />

              {/* 4. Tus Datos */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3">Tus Datos de Contacto</h4>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="clientName" placeholder="Tu Nombre" required className="w-full p-3 rounded-lg border border-gray-200 focus:border-bloomly-olive outline-none text-sm" />
                    <input type="tel" name="clientPhone" placeholder="Tu WhatsApp" required className="w-full p-3 rounded-lg border border-gray-200 focus:border-bloomly-olive outline-none text-sm" />
                </div>
                <p className="text-xs text-gray-400 mt-2">* Te enviaremos la confirmación y foto del arreglo por WhatsApp.</p>
              </div>

              {/* Botón de Compra */}
              <button type="submit" className="w-full bg-bloomly-olive text-white font-bold py-4 rounded-xl hover:bg-bloomly-green transition-all shadow-lg hover:shadow-bloomly-olive/30 transform hover:-translate-y-0.5 mt-4">
                Confirmar Pedido — ${product.price.toLocaleString()}
              </button>
              
              <div className="flex justify-center gap-4 text-xs text-gray-400 mt-4">
                <span className="flex items-center gap-1">🔒 Pago Seguro</span>
                <span className="flex items-center gap-1">🚚 Envío Garantizado</span>
              </div>

            </form>
          </div>
        </div>

      </div>
    </main>
  );
}