import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

// Server Action
async function updateProduct(formData: FormData) {
  "use server";
  
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string; 
  const price = parseFloat(formData.get("price") as string);
  
  // 👇 NUEVO: Capturamos la ocasión
  const occasion = formData.get("occasion") as string; 

  // Lógica de Ofertas
  const discountPrice = formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : null;
  const startStr = formData.get("discountStart") as string;
  const endStr = formData.get("discountEnd") as string;
  const discountStart = startStr ? new Date(startStr) : null;
  const discountEnd = endStr ? new Date(endStr) : null;

  await prisma.product.update({
    where: { id },
    data: { 
        name, 
        description, 
        price,
        occasion, // 👈 Guardamos la ocasión
        discountPrice,
        discountStart,
        discountEnd
    }
  });

  redirect("/dashboard/products");
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  });

  if (!product) return <div>Producto no encontrado</div>;

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Producto 🛠️</h1>
        <Link href="/dashboard/products" className="text-sm text-gray-500 hover:text-gray-900">Cancelar</Link>
      </div>

      <form action={updateProduct} className="space-y-6">
        <input type="hidden" name="id" value={product.id} />

        {/* 1. Datos Básicos */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                <input name="name" defaultValue={product.name} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-bloomly-olive" required />
            </div>
            
            {/* 👇 NUEVO: SELECTOR DE OCASIÓN */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ocasión Principal</label>
                <div className="relative">
                    <select 
                        name="occasion" 
                        defaultValue={product.occasion || ""} 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-bloomly-olive appearance-none bg-white"
                    >
                        <option value="">-- Sin categoría --</option>
                        <option value="love">❤️ Amor y Romance</option>
                        <option value="birthday">🎂 Cumpleaños</option>
                        <option value="anniversary">💐 Aniversario</option>
                        <option value="condolences">🕊️ Condolencias</option>
                        <option value="any">✨ Toda Ocasión</option>
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none text-xs">▼</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Esto hará que aparezca en la sección "Explora por Ocasión".</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea name="description" defaultValue={product.description || ""} rows={3} className="w-full p-3 border border-gray-200 rounded-lg outline-none resize-none" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Precio ($)</label>
                <input type="number" name="price" defaultValue={product.price} className="w-full p-3 border border-gray-200 rounded-lg outline-none" required />
            </div>
        </div>

        {/* 2. Ofertas (Igual que antes) */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="font-bold text-bloomly-olive mb-4 flex items-center gap-2">🏷️ Oferta Flash</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Oferta</label>
                    <input type="number" name="discountPrice" defaultValue={product.discountPrice || ""} className="w-full p-3 border border-green-200 rounded-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inicia</label>
                    <input type="datetime-local" name="discountStart" defaultValue={formatDate(product.discountStart)} className="w-full p-3 border border-green-200 rounded-lg text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Termina</label>
                    <input type="datetime-local" name="discountEnd" defaultValue={formatDate(product.discountEnd)} className="w-full p-3 border border-green-200 rounded-lg text-sm" />
                </div>
            </div>
        </div>

        <button type="submit" className="w-full bg-bloomly-olive text-white font-bold py-4 rounded-xl hover:bg-bloomly-green transition-all shadow-lg">
            Guardar Cambios
        </button>
      </form>
    </div>
  );
}