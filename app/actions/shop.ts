"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPublicOrder(formData: FormData) {
  const productId = parseInt(formData.get("productId") as string);
  const price = parseFloat(formData.get("price") as string);
  
  // Datos del Cliente (Comprador)
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string;
  
  // Datos de Entrega
  const recipientName = formData.get("recipientName") as string;
  const address = formData.get("address") as string;
  const dedication = formData.get("dedication") as string;
  const deliveryDateStr = formData.get("deliveryDate") as string; // YYYY-MM-DD

  // 1. Buscar o Crear Cliente
  let customer = await prisma.customer.findFirst({
    where: { phone: clientPhone }
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: { name: clientName, phone: clientPhone }
    });
  }

  // 2. Crear el Pedido
  await prisma.order.create({
    data: {
      total: price,
      status: "PENDING",
      deliveryDate: new Date(deliveryDateStr), 
      address: address,
      dedication: dedication,
      recipientName: recipientName,
      customerId: customer.id,
      items: {
        create: {
          productId: productId,
          quantity: 1,
          price: price
        }
      }
    }
  });

  // 3. Notificar al sistema
  revalidatePath("/");
  revalidatePath("/orders");

// 4. CAMBIO AQUÍ: Redirigir a la página de éxito dedicada
  redirect("/shop/success");
}