import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicOrder } from "@/app/actions/shop";
import DedicationWizard from "@/components/DedicationWizard";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  });

  if (!product) return notFound();

  // 👇 LÓGICA CORREGIDA DE LA OFERTA: Verificamos fechas de expiración
  let hasDiscount = false;
  
  if (product.discountPrice && product.discountPrice > 0) {
    const now = new Date(); // Qué día/hora es hoy
    
    // Verificamos si ya empezó (o si no tiene fecha de inicio, la damos por válida)
    const isAfterStart = !product.discountStart || product.discountStart <= now;
    // Verificamos si aún no expira (o si no tiene fecha de fin, es permanente)
    const isBeforeEnd = !product.discountEnd || product.discountEnd >= now;
    
    // Si cumple ambas condiciones temporales, ¡la oferta es válida!
    if (isAfterStart && isBeforeEnd) {
      hasDiscount = true;
    }
  }

  // Si hasDiscount es true, cobra el descuento. Si es false (porque expiró), cobra normal.
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    // CONTENEDOR PRINCIPAL: Flex vertical en móvil, Horizontal en PC
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* ==============================================
          COLUMNA IZQUIERDA (IMAGEN) 
         ============================================== */}
      <div className="w-full lg:w-1/2 h-[45vh] lg:h-screen relative lg:sticky lg:top-0 bg-gray-100">
        
        <img 
          src={product.imageUrl || "/placeholder.jpg"} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <Link 
            href="/shop" 
            className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-white/40 transition flex items-center gap-2"
        >
            ← Volver
        </Link>

        <div className="absolute bottom-8 left-6 right-6 text-white z-10">
          <h1 className="text-3xl lg:text-5xl font-bold mb-2 shadow-sm">{product.name}</h1>
          <p className="text-white/90 text-sm lg:text-lg line-clamp-2">{product.description}</p>
        </div>
      </div>

      {/* ==============================================
          COLUMNA DERECHA (FORMULARIO) 
         ============================================== */}
      <div className="w-full lg:w-1/2 bg-white relative z-10 -mt-6 rounded-t-3xl lg:mt-0 lg:rounded-none px-6 py-8 flex flex-col lg:overflow-y-auto lg:h-screen lg:py-12 lg:px-16 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
        
        {/* Precio y Garantía */}
        <div className="border-b border-gray-100 pb-6 mb-8">
            <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">Precio Total</span>
                
                <div className="text-right">
                    {hasDiscount && (
                        <span className="text-xl lg:text-2xl text-gray-400 line-through mr-3 font-normal">
                            ${product.price.toLocaleString()}
                        </span>
                    )}
                    <h2 className={`text-4xl font-bold ${hasDiscount ? 'text-red-500' : 'text-gray-900'}`}>
                        ${currentPrice!.toLocaleString()}
                    </h2>
                </div>
            </div>
            <p className="text-xs text-green-600 bg-green-50 inline-block px-3 py-1 rounded-full font-medium">
                🌱 Garantía de frescura de 5 días incluida
            </p>
            {hasDiscount && (
                 <span className="text-xs text-white bg-red-500 inline-block px-3 py-1 rounded-full font-bold ml-2 animate-pulse">
                 🔥 ¡Oferta Especial!
             </span>
            )}
        </div>

        {/* Formulario */}
        <form action={createPublicOrder} className="space-y-6 flex-1">
            <input type="hidden" name="productId" value={product.id} />
            {/* BACKEND: Se enviará el currentPrice ya validado */}
            <input type="hidden" name="price" value={currentPrice!} />

            {/* SECCIÓN 1: DETALLES DE ENTREGA */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    🚚 Datos de Entrega
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Fecha</label>
                        <input type="date" name="deliveryDate" required className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-bloomly-olive focus:ring-0 transition-all outline-none font-medium text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nombre de quien recibe</label>
                        <input type="text" name="recipientName" placeholder="Ej: María Pérez" required className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-bloomly-olive focus:ring-0 transition-all outline-none font-medium text-gray-700 placeholder:font-normal" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Dirección Exacta</label>
                    <input type="text" name="address" placeholder="Calle, Número, Colonia, Referencias..." required className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-bloomly-olive focus:ring-0 transition-all outline-none font-medium text-gray-700 placeholder:font-normal" />
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                        ¿Qué estamos celebrando? (Opcional, para recordarte el próximo año)
                    </label>
                    <select name="orderOccasion" className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-bloomly-olive focus:ring-0 transition-all outline-none font-medium text-gray-700 cursor-pointer">
                        <option value="">Selecciona una opción...</option>
                        <option value="Cumpleaños">🎂 Cumpleaños</option>
                        <option value="Aniversario de Novios">❤️ Aniversario de Novios</option>
                        <option value="Aniversario de Bodas">💍 Aniversario de Bodas</option>
                        <option value="Condolencias">🕊️ Condolencias</option>
                        <option value="Nacimiento / Baby Shower">🍼 Nacimiento</option>
                        <option value="Pedir Perdón">🥺 Pedir Perdón</option>
                        <option value="Solo porque sí">✨ Solo porque sí</option>
                    </select>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* SECCIÓN 2: DEDICATORIA IA */}
            <div className="space-y-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    💌 Dedicatoria
                </h3>
                <DedicationWizard />
            </div>

            <hr className="border-gray-100" />

            {/* SECCIÓN 3: TUS DATOS */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    👤 Tus Datos (Contacto)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="clientName" placeholder="Tu Nombre" required className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-bloomly-olive focus:ring-0 transition-all outline-none text-sm" />
                    <input type="tel" name="clientPhone" placeholder="Tu WhatsApp" required className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-bloomly-olive focus:ring-0 transition-all outline-none text-sm" />
                </div>
            </div>

            {/* Espacio extra abajo en celular para no tapar con bordes de pantalla */}
            <div className="pt-4 pb-12 lg:pb-0">
                <button type="submit" className="w-full bg-gray-900 text-white font-bold text-lg py-5 rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex justify-center items-center gap-2">
                    <span>Hacer Pedido</span>
                    <span className="opacity-60">|</span>
                    <span>${currentPrice!.toLocaleString()}</span>
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Confirmaremos tu pedido y el pago vía WhatsApp.
                </p>
            </div>

        </form>
      </div>
    </div>
  );
}