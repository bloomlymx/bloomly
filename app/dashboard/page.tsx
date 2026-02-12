import Link from "next/link";
import prisma from "@/lib/prisma"; 
import WasteChart from "@/components/WasteChart"; 

export default async function DashboardPage() {
  
  // --- ZONA DE DATOS (BACKEND) ---
  
  // 1. Calcular MERMA (Flores en riesgo - RISK)
  const batchesInRisk = await prisma.flowerBatch.findMany({
    where: { status: 'RISK' }
  });
  const mermaCount = batchesInRisk.reduce((acc, batch) => acc + batch.quantity, 0);

  // 2. Calcular PEDIDOS PENDIENTES
  const pendingOrders = await prisma.order.count({
    where: { status: 'PENDING' }
  });

  // 3. Calcular VENTAS COBRADAS (Solo DELIVERED)
  const completedOrders = await prisma.order.findMany({
    where: { status: 'DELIVERED' }
  });
  
  const totalSales = completedOrders.reduce((acc, order) => acc + order.total, 0);

  // 4. DATOS PARA LA GRÁFICA DE MERMA (Status: WASTE)
  const wastedBatches = await prisma.flowerBatch.findMany({
    where: { status: 'WASTE' }
  });

  const wasteSummary = wastedBatches.reduce((acc: any, batch) => {
    if (!acc[batch.flowerType]) {
      acc[batch.flowerType] = 0;
    }
    acc[batch.flowerType] += batch.purchasePrice;
    return acc;
  }, {});

  const chartData = Object.keys(wasteSummary).map(key => ({
    name: key,
    perdidda: wasteSummary[key]
  }));

  const totalWasteMoney = chartData.reduce((acc, item) => acc + item.perdidda, 0);

  // 5. NUEVO: Traer configuración de la tienda (Nombre) 🏪
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 }
  });
  const shopName = settings?.shopName || "Florería Demo";

  // Formateador de dinero
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // --- ZONA DE DISEÑO (FRONTEND) ---
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* 1. HEADER LIMPIO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        
        {/* Izquierda: Saludo Dinámico */}
        <div>
          {/* 👇 AQUÍ ESTÁ EL CAMBIO: Usamos {shopName} */}
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            Hola, {shopName} 🌿
          </h1>
          <p className="text-gray-500 mt-1">
            Aquí tienes el pulso de tu negocio hoy.
          </p>
        </div>

        {/* Derecha: Acciones y Herramientas */}
        <div className="flex items-center gap-3">
            
            {/* Indicador de Tienda Activa */}
            <div className="hidden md:flex bg-white border border-green-100 px-4 py-2 rounded-full items-center gap-2 shadow-sm mr-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Tienda Activa</span>
            </div>

            {/* Botón: Ver Tienda */}
            <Link 
              href="/shop" 
              target="_blank"
              className="bg-white text-gray-700 hover:text-bloomly-olive border border-gray-200 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <span>↗</span> Ver Tienda
            </Link>

            {/* Botón: Modo Ruta */}
            <Link 
              href="/delivery"
              className="bg-gray-900 text-white hover:bg-black font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
            >
              <span>🚚</span> Modo Ruta
            </Link>

            {/* Avatar */}
            <div className="w-10 h-10 bg-bloomly-pink text-white rounded-full flex items-center justify-center font-bold shadow-md ml-2 border-2 border-white uppercase">
                {shopName.charAt(0)}
            </div>
        </div>
      </div>

      {/* 2. GRID DE ESTADÍSTICAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card: Pedidos */}
          <Link href="/dashboard/orders">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer h-full group">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Pedidos Pendientes</h3>
                <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-bloomly-olive group-hover:text-gray-800 transition-colors">{pendingOrders}</span>
                <span className="text-sm text-bloomly-pink font-bold bg-bloomly-pink/10 px-2 py-1 rounded-full">Por aceptar</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Requieren tu atención inmediata</p>
            </div>
          </Link>

          {/* Card: Ventas */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Ventas Cobradas</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-bloomly-olive">{formatter.format(totalSales)}</span>
              <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">{completedOrders.length} envíos</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Total histórico entregado</p>
          </div>

          {/* Card: Merma (Riesgo) */}
          <Link href="/dashboard/inventory" className="group block h-full">
            <div className="bg-bloomly-olive text-white p-6 rounded-2xl shadow-lg relative overflow-hidden h-full border border-bloomly-olive hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Riesgo de Merma</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white group-hover:bg-white group-hover:text-bloomly-olive transition-colors">Ver detalle →</span>
              </div>
              <div className="relative z-10">
                <span className="text-4xl font-bold">{mermaCount} Flores</span>
                <p className="text-sm text-white/80 mt-1">Detectadas en estado crítico</p>
                {mermaCount > 0 && (
                  <div className="mt-5 w-full bg-bloomly-pink text-bloomly-olive text-sm font-bold py-3 rounded-xl text-center shadow-md group-hover:bg-white group-hover:scale-105 transition-all">
                    ⚡ ¡Lanzar Oferta!
                  </div>
                )}
              </div>
            </div>
          </Link>
      </div>

      {/* 3. SECCIÓN DE GRÁFICAS Y DETALLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Gráfica de Pérdidas Reales (Merma confirmada) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Pérdida por Merma 🗑️</h3>
                <p className="text-xs text-gray-400 italic">Dinero perdido en flores desechadas</p>
              </div>
              <span className="text-xl font-bold text-red-500">
                {formatter.format(totalWasteMoney)}
              </span>
            </div>
            
            {chartData.length > 0 ? (
              <WasteChart data={chartData} />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-300 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No hay mermas registradas aún.
              </div>
            )}
          </div>

          {/* Lista de lotes en riesgo */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Stock Crítico 🥀</h3>
              <Link href="/dashboard/inventory" className="text-xs text-bloomly-olive font-bold hover:underline">Gestionar Inventario</Link>
            </div>
            
            {batchesInRisk.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {batchesInRisk.map((batch) => (
                  <li key={batch.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <span className="font-medium text-gray-700 text-sm">{batch.flowerType}</span>
                    </span>
                    <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs">{batch.quantity} tallos</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100 h-[250px] flex flex-col items-center justify-center">
                  <span className="text-4xl mb-2">🌿</span>
                  <p className="text-green-700 font-bold text-lg">¡Todo fresco!</p>
                  <p className="text-green-600/70 text-sm">No hay flores en riesgo hoy.</p>
              </div>
            )}
          </div>
      </div>

    </div>
  );
}