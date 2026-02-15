import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  
  // Extraemos la categoría de la URL si es que existe
  const { categoria } = await searchParams;

  // 1. Buscamos PRODUCTOS NORMALES
  const products = await prisma.product.findMany({
    where: categoria ? {
      // Buscamos que la palabra clave en inglés esté en cualquiera de estos campos
      OR: [
        { name: { contains: categoria, mode: 'insensitive' } },
        { description: { contains: categoria, mode: 'insensitive' } },
        { category: { contains: categoria, mode: 'insensitive' } },
        { occasion: { contains: categoria, mode: 'insensitive' } }
      ]
    } : {},
    orderBy: { price: 'asc' }
  });

  // 2. Buscamos FLORES EN RIESGO para Ofertas Relámpago ⚡
  const riskBatches = await prisma.flowerBatch.findMany({
    where: { status: 'RISK', quantity: { gt: 0 } }
  });

  // 3. Obtenemos la fecha actual
  const now = new Date();

  // 4. Traer configuración de la tienda 🏪
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 }
  });
  const shopName = settings?.shopName || "Florería Demo";

  // 👇 LA SOLUCIÓN DEFINITIVA: 
  // Conectamos el nombre visual de la tarjeta (español) con la opción real de tu base de datos (inglés)
  const categories = [
    { name: "San Valentín", searchKey: "love", image: "https://static.wixstatic.com/media/e50e1f_7a38499be5c541d281e8aed4f99e467c~mv2.png/v1/fill/w_556,h_834,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/e50e1f_7a38499be5c541d281e8aed4f99e467c~mv2.png" },
    { name: "Cumpleaños", searchKey: "birthday", image: "https://i0.wp.com/floresyregalosmx.com/wp-content/uploads/Captura-de-pantalla-2024-12-11-a-las-12.09.40%E2%80%AFa.m.png?fit=1094%2C1432&ssl=1" },
    { name: "Aniversario", searchKey: "anniversary", image: "https://www.floreriabloom.com/cdn/shop/files/BUCHON_100ROSAS.jpg?v=1748289881&width=1200" },
    { name: "Condolencias", searchKey: "condolences", image: "https://lavioletera.com.mx/cdn/shop/products/condolenciasarreglo2_600x.jpg?v=1654558723" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. HEADER */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="bg-bloomly-olive text-white text-[10px] md:text-xs font-bold text-center py-2 tracking-widest uppercase">
          🌿 Envío GRATIS en zona centro • Pedidos para hoy antes de las 2:00 PM
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-bloomly-pink rounded-full flex items-center justify-center text-white font-bold text-lg">
                {shopName.charAt(0)}
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">{shopName}</span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/shop" className="hidden md:block hover:text-bloomly-olive transition-colors">Catálogo</Link>
            <Link href="#" className="hidden md:block hover:text-bloomly-olive transition-colors">Nosotros</Link>
            <div className="flex items-center gap-2 text-gray-800 hover:text-bloomly-olive cursor-pointer bg-gray-100 px-3 py-1.5 rounded-full transition-colors">
              <span>🛍️</span>
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      {!categoria && (
        <section className="relative h-[550px] w-full bg-[#1c2e22] flex items-center justify-center">
            <img 
            src="https://img.freepik.com/fotos-premium/hermosas-flores-colores-floreria_290431-15121.jpg" 
            alt="Flores frescas"
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c2e22] via-transparent to-[#1c2e22]/30"></div>
            
            <div className="relative z-10 w-full max-w-5xl px-4 text-center mt-10">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs font-bold mb-4 backdrop-blur-md border border-white/20 uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-700">
                Florería Boutique & Diseño Floral
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Creamos momentos <br/><span className="text-bloomly-pink font-serif italic">inolvidables</span>
            </h1>

            {/* BARRA FLOTANTE (Visual) */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center max-w-3xl mx-auto animate-in zoom-in duration-500 delay-200">
                <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-left">
                    ¿QUÉ CELEBRAS?
                </label>
                <select className="w-full bg-transparent font-bold text-gray-800 outline-none cursor-pointer text-sm md:text-base">
                    <option>❤️ Amor y Romance</option>
                    <option>🎂 Cumpleaños</option>
                    <option>💐 Aniversario</option>
                    <option>🕊️ Condolencias</option>
                    <option>✨ Solo porque sí</option>
                </select>
                </div>
                
                <div className="flex-1 w-full px-4 py-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-left">
                    ¿CUÁNDO ENTREGAMOS?
                </label>
                <select className="w-full bg-transparent font-bold text-gray-800 outline-none cursor-pointer text-sm md:text-base">
                    <option>🚀 Hoy Mismo (Express)</option>
                    <option>📅 Mañana</option>
                    <option>🗓️ Elegir fecha...</option>
                </select>
                </div>

                <button className="w-full md:w-auto bg-bloomly-olive text-white font-bold py-4 px-8 rounded-xl hover:bg-bloomly-green transition-all shadow-lg hover:shadow-bloomly-olive/30 transform hover:scale-105 whitespace-nowrap">
                Buscar Regalo ➜
                </button>
            </div>
            </div>
        </section>
      )}

      {/* 3. CATEGORÍAS */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Explora por Ocasión</h2>
            <Link href="/shop" className="text-xs font-bold text-bloomly-olive border-b border-bloomly-olive pb-0.5 hover:opacity-80">VER TODO</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            // Usamos searchKey para mandar la palabra clave correcta a la URL
            <Link key={idx} href={`/shop?categoria=${cat.searchKey}`} className="group relative h-60 rounded-xl overflow-hidden cursor-pointer shadow-md block">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 w-full p-4">
                <p className="text-white font-bold text-lg transform translate-y-1 group-hover:translate-y-0 transition-transform">{cat.name}</p>
                <div className="h-0.5 w-8 bg-bloomly-pink mt-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. PRODUCTOS */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                {/* Mostramos el nombre visual (en español) dependiendo del filtro */}
                {categoria 
                  ? `Arreglos para ${categories.find(c => c.searchKey === categoria)?.name || categoria} 💐` 
                  : "Favoritos de la Semana 🌟"}
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                {categoria 
                    ? `Encontramos ${products.length} opciones perfectas para esta ocasión.` 
                    : "Nuestros arreglos más populares, diseñados con flores frescas de esta mañana."}
            </p>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => {
                    
                    const isOfferActive = 
                        product.discountPrice && 
                        product.discountStart && 
                        product.discountEnd &&
                        now >= product.discountStart && 
                        now <= product.discountEnd;

                    return (
                        <Link key={product.id} href={`/shop/${product.id}`} className="group block">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                            {product.imageUrl ? (
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50 text-gray-300">🌸</div>
                            )}
                            
                            <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button className={`w-full backdrop-blur font-bold py-3 rounded-xl shadow-lg transition-colors text-sm ${isOfferActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/90 text-gray-900 hover:bg-bloomly-pink hover:text-white'}`}>
                                    {isOfferActive 
                                        ? `Comprar Oferta — $${product.discountPrice}` 
                                        : `Añadir al Carrito — $${product.price}`}
                                </button>
                            </div>

                            <div className="absolute top-3 right-3">
                                {isOfferActive ? (
                                    <span className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm animate-pulse">
                                        OFERTA FLASH
                                    </span>
                                ) : (
                                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-900 shadow-sm">
                                        NUEVO
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-bloomly-olive transition-colors leading-tight">
                            {product.name}
                        </h3>

                        <div className="mt-1">
                            {isOfferActive ? (
                                <div className="flex items-center gap-2">
                                     <span className="text-lg font-bold text-red-600">${product.discountPrice?.toLocaleString()}</span>
                                     <span className="text-xs text-gray-400 line-through">${product.price.toLocaleString()}</span>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm font-medium">${product.price.toLocaleString()}</p>
                            )}
                        </div>
                        
                        </Link>
                    );
                })}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-xl text-gray-400 font-medium mb-4">No encontramos flores para esta ocasión aún.</p>
                    <Link href="/shop" className="bg-bloomly-olive text-white px-6 py-2 rounded-lg font-bold inline-block">
                        Ver todo el catálogo
                    </Link>
                </div>
            )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-serif italic mb-4">{shopName}</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                Llevando alegría a los hogares desde 2015.
            </p>
            <div className="flex justify-center gap-6 text-sm font-bold text-gray-300">
                <Link href="#" className="hover:text-white">Instagram</Link>
                <Link href="#" className="hover:text-white">Facebook</Link>
                <Link href="#" className="hover:text-white">WhatsApp</Link>
            </div>
            <div className="mt-8 text-xs text-gray-600">Powered by Bloomly SaaS</div>
        </div>
      </footer>

    </main>
  );
}