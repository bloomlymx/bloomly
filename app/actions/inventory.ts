"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Registrar nueva entrada (Compra a proveedor)
export async function addFlowerBatch(formData: FormData) {
  const flowerType = formData.get("flowerType") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const purchasePrice = parseFloat(formData.get("purchasePrice") as string);

  await prisma.flowerBatch.create({
    data: {
      flowerType,
      quantity,
      originalQty: quantity,
      purchasePrice,
      purchaseDate: new Date(), // Entran HOY
      status: "FRESH"
    }
  });

  revalidatePath("/inventory");
  revalidatePath("/"); // Para actualizar el dashboard también
}

// 2. Reportar Merma (Tirar a la basura)
export async function reportWaste(id: number) {
  await prisma.flowerBatch.update({
    where: { id },
    data: { status: "WASTE", quantity: 0 } // Se marca como basura y stock 0
  });
  revalidatePath("/inventory");
  revalidatePath("/");
}

// 3. Simular el paso del tiempo (Para pruebas)
// ARREGLO: Quitamos el revalidatePath para que no truene al cargar la página.
export async function checkFreshness() {
    const batches = await prisma.flowerBatch.findMany({
        where: { status: "FRESH" }
    });

    for (const batch of batches) {
        const daysOld = Math.floor((new Date().getTime() - new Date(batch.purchaseDate).getTime()) / (1000 * 3600 * 24));
        
        // Regla de Negocio: Si tiene más de 7 días, es RIESGO
        if (daysOld >= 7) {
            await prisma.flowerBatch.update({
                where: { id: batch.id },
                data: { status: "RISK" }
            });
        }
    }
    // NOTA: Eliminamos revalidatePath aquí para evitar el error de renderizado.
    // Como esta función se llama justo antes de leer los datos en la página,
    // el usuario verá los cambios reflejados automáticamente.
}