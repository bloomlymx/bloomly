import Link from "next/link";
import prisma from "@/lib/prisma";
import OrderBoard from "@/components/OrderBoard"; 

export default async function OrdersPage() {
  
  // 1. Traemos los PEDIDOS (con sus relaciones)
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Traemos los PRODUCTOS (Para el formulario de nuevo pedido)
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="min-h-screen bg-bloomly-bg text-bloomly-gray font-sans p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-4">
        <div>
            <Link href="/dashboard" className="text-sm text-bloomly-olive hover:underline mb-2 block">← Volver al Dashboard</Link>
            <h1 className="text-3xl font-bold text-bloomly-olive">Tablero de Pedidos 📋</h1>
            <p className="text-gray-500">Gestión visual de flujo de trabajo</p>
        </div>
      </div>

      {/* 3. Pasamos los pedidos Y los productos al tablero */}
      <div className="max-w-7xl mx-auto">
        <OrderBoard orders={orders} products={products} />
      </div>

    </main>
  );
}