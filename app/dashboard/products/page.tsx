import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AddProductBtn from "@/components/AddProductBtn";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-bloomly-bg font-sans p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
            <Link href="/dashboard" className="text-sm text-bloomly-olive hover:underline mb-2 block">← Volver al Dashboard</Link>
            <h1 className="text-4xl font-bold text-bloomly-olive tracking-tight">Catálogo de Diseño 💐</h1>
            <p className="text-gray-500 mt-1">Tus arreglos disponibles para venta online.</p>
        </div>
        <AddProductBtn />
      </div>

      {/* Grid de Productos */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Empty State (Si no hay nada) */}
        {products.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-bloomly-olive/20 rounded-2xl bg-white/50">
            <p className="text-gray-400 text-lg mb-2">Tu catálogo está vacío 🍂</p>
            <p className="text-sm text-gray-500">Agrega tu primer arreglo floral para empezar a vender.</p>
          </div>
        )}
      </div>

    </main>
  );
}