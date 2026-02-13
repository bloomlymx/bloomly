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

  return (
    // CONTENEDOR PRINCIPAL: Flex vertical en móvil, Horizontal en PC
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* ==============================================
          COLUMNA IZQUIERDA (IMAGEN) 
         ============================================== */}
      {/* Móvil: Altura 45vh (45% de la pantalla). PC: Altura 100vh y "sticky" para que no se mueva al scrollear */}
      <div className="w-full lg:w-1/2 h-[45vh] lg:h-screen relative lg:sticky lg:top-0 bg-gray-100">
        
        {/* Imagen de fondo */}
        <img 
          src={product.imageUrl || "/placeholder.jpg"} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Degradado oscuro para que el texto blanco se lea perfecto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Botón Flotante "Volver" (Reemplaza al Navbar tradicional para este diseño limpio) */}
        <Link 
            href="/shop" 
            className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-white/40 transition flex items-center gap-2"
        >
            ← Volver
        </Link>

        {/* Título y Descripción sobre la imagen */}
        <div className="absolute bottom-8 left-6 right-6 text-white z-10">
          <h1 className="text-3xl lg:text-5xl font-bold mb-2 shadow-sm">{product.name}</h1>
          <p className="text-white/90 text-sm lg:text-lg line-clamp-2">{product.description}</p>
        </div>
      </div>

      {/* ==============================================
          COLUMNA DERECHA (FORMULARIO) 
         ============================================== */}
      {/* Móvil: Fondo blanco, sube un poco (-mt-6) y bordes redondeados arriba. PC: Scroll normal */}
      <div className="w-full lg:w-1/2 bg-white relative z-10 -mt-6 rounded-t-3xl lg:mt-0 lg:rounded-none px-6 py-8 flex flex-col lg:overflow-y-auto lg:h-screen lg:py-12 lg:px-16 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
        
        {/* Precio y Garantía */}
        <div className="border-b border-gray-100 pb-6 mb-8">
            <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">Precio Total</span>
                <h2 className="text-4xl font-bold text-gray-900">${product.price.toLocaleString()}</h2>
            </div>
            <p className="text-xs text-green-600 bg-green-50 inline-block px-3 py-1 rounded-full font-medium">
                🌱 Garantía de frescura de 5 días incluida
            </p>
        </div>

        {/* Formulario */}
        <form action={createPublicOrder} className="space-y-6 flex-1">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="price" value={product.price} />

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
                    <span>Pagar al Entregar</span>
                    <span className="opacity-60">|</span>
                    <span>${product.price.toLocaleString()}</span>
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Pago seguro contra entrega o transferencia.
                </p>
            </div>

        </form>
      </div>
    </div>
  );
}