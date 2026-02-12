import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateSettings(formData: FormData) {
  "use server";
  
  const shopName = formData.get("shopName") as string;

  // Usamos upsert: Si existe lo actualiza, si no existe lo crea (ID siempre 1)
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: { shopName },
    create: { id: 1, shopName }
  });

  revalidatePath("/"); // Actualiza la tienda pública
  revalidatePath("/dashboard"); // Actualiza el dashboard
}

export default async function SettingsPage() {
  // Buscamos la configuración actual (si existe)
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 }
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuración de Tienda 🏪</h1>
      <p className="text-gray-500 mb-8">Personaliza cómo ven tus clientes tu negocio.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form action={updateSettings} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de tu Florería</label>
            <input 
              name="shopName" 
              defaultValue={settings?.shopName || "Mi Florería"} 
              className="w-full p-4 border border-gray-200 rounded-xl focus:border-bloomly-olive outline-none text-lg font-medium"
              placeholder="Ej: Florería Las Lilas"
            />
            <p className="text-xs text-gray-400 mt-2">Este nombre aparecerá en el encabezado de tu tienda online.</p>
          </div>

          <button type="submit" className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-black transition-all shadow-lg w-full md:w-auto">
            Guardar Cambios 💾
          </button>

        </form>
      </div>
    </div>
  );
}