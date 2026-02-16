import Link from "next/link";
import prisma from "@/lib/prisma";

// Evitamos el caché para que siempre esté en vivo
export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  
  // 1. Traemos TODOS los pedidos entregados o en ruta
  const pastOrders = await prisma.order.findMany({
    where: { 
        status: { not: "PENDING" }, // Ignoramos los que apenas acaban de entrar
        occasion: { not: null }     // Solo los que sí llenaron el campo de Ocasión
    },
    include: {
      customer: true,
      items: {
        include: { product: true }
      }
    },
    orderBy: { deliveryDate: 'desc' }
  });

  // 2. LÓGICA DEL VENDEDOR SILENCIOSO 🧠
  let opportunities = pastOrders.map(order => {
    const occasion = order.occasion;
    if (!occasion) return null;

    let icon = "🌸";
    let isRecurring = false;

    // Filtramos SOLO las ocasiones que se celebran cada año
    if (occasion === "Cumpleaños") {
        icon = "🎂";
        isRecurring = true;
    } else if (occasion === "Aniversario de Novios" || occasion === "Aniversario de Bodas") {
        icon = "💍";
        isRecurring = true;
    }

    // Si fue por "Pedir perdón" o "Condolencias", no les recordamos al año siguiente
    if (!isRecurring) return null;

    const product = order.items[0]?.product;
    const productName = product?.name || "un hermoso arreglo";

    // Calculamos el próximo evento (sumamos 1 año a la fecha de entrega original)
    const lastDelivery = new Date(order.deliveryDate);
    const nextEventDate = new Date(lastDelivery);
    nextEventDate.setFullYear(nextEventDate.getFullYear() + 1);

    // Formateamos la fecha bonita (ej. "14 de Febrero")
    const dateFormatted = nextEventDate.toLocaleDateString('es-MX', { month: 'long', day: 'numeric' });

    // 💬 EL TRUCO DE MAGIA: El mensaje a prueba de balas para emojis
    const mensajeCrudo = `¡Hola ${order.customer.name}! 👋 Soy Uziel de la florería.\n\n` +
    `Me apareció en mi calendario que pronto se acerca una fecha súper especial: tu ${occasion} 📅.\n\n` +
    `El año pasado te ayudamos con "${productName}". ¿Te gustaría que te mande opciones para este año y te aparto el espacio de entrega? Tenemos unas flores increíbles recién llegadas. ✨`;

    // Usamos URLSearchParams que es el estándar de internet para textos complejos
    const whatsappMsg = new URLSearchParams({ text: mensajeCrudo }).toString();

    return {
        ...order,
        productName,
        occasion,
        icon,
        nextEventDate,
        dateFormatted,
        whatsappMsg
    };
  }).filter(Boolean); // Limpiamos los nulos

  // 3. Ordenamos para que las fechas más próximas salgan primero
  opportunities.sort((a: any, b: any) => a.nextEventDate.getTime() - b.nextEventDate.getTime());

  return (
    <main className="min-h-screen bg-bloomly-bg text-bloomly-gray font-sans p-8">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <Link href="/dashboard" className="text-sm text-bloomly-olive hover:underline mb-2 block">← Volver al Dashboard</Link>
            <h1 className="text-3xl font-bold text-bloomly-olive flex items-center gap-3">
                Radar de Ventas 🎯
            </h1>
            <p className="text-gray-500 mt-1 max-w-2xl text-sm leading-relaxed">
                Tu vendedor silencioso. El sistema detecta fechas recurrentes de tus clientes (Cumpleaños y Aniversarios) basándose en sus compras pasadas para que ofrezcas el arreglo perfecto justo a tiempo.
            </p>
        </div>
        <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-black text-sm shadow-sm border border-green-200 flex items-center gap-2">
            <span>🔥</span> {opportunities.length} Oportunidades
        </div>
      </div>

      {/* TARJETAS DE OPORTUNIDAD */}
      <div className="max-w-6xl mx-auto">
        {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opp: any) => (
                    <div key={opp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-lg transition-all flex flex-col h-full">
                        
                        {/* Decoración superior */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-bloomly-pink to-bloomly-olive opacity-80"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl shadow-inner border border-gray-100">
                                {opp.icon}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Próximo Evento</p>
                                <p className="font-black text-bloomly-olive text-lg">{opp.dateFormatted}</p>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">{opp.customer.name}</h3>
                            <p className="text-xs text-gray-500 mb-4 font-medium">
                                📞 {opp.customer.phone}
                            </p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <span>📝</span> El año pasado compró:
                                </p>
                                <p className="text-sm font-bold text-gray-700 leading-tight mb-1">{opp.productName}</p>
                                <p className="text-xs font-medium text-gray-500 flex justify-between">
                                    <span>Motivo: {opp.occasion}</span>
                                    <span className="text-bloomly-olive font-bold">Ticket: ${opp.total}</span>
                                </p>
                            </div>
                        </div>

                        {/* BOTÓN MÁGICO DE VENTAS */}
                        <a 
                            href={`https://api.whatsapp.com/send?phone=52${opp.customer.phone}&${opp.whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>💬</span> Enviar Oferta por WhatsApp
                        </a>
                    </div>
                ))}
            </div>
        ) : (
            // ESTADO VACÍO ELEGANTE
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto">
                <div className="text-6xl mb-6 grayscale opacity-60">🕵️‍♂️</div>
                <h3 className="text-2xl font-black text-gray-800 mb-3">Tu radar está limpio</h3>
                <p className="text-gray-500 leading-relaxed">
                    Conforme tus clientes realicen compras seleccionando <strong>Cumpleaños</strong> o <strong>Aniversarios</strong> en el formulario, el sistema calculará automáticamente sus fechas para el próximo año y te mostrará aquí a quién debes contactar para cerrar ventas seguras.
                </p>
            </div>
        )}
      </div>

    </main>
  );
}