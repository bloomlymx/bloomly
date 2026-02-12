"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Mover tarjeta (Cambiar estatus)
export async function updateOrderStatus(orderId: number, newStatus: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath("/orders");
  revalidatePath("/");
}

// 2. CREAR PEDIDO REAL (Desde el formulario con Producto Seleccionado)
export async function createRealOrder(formData: FormData) {
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const productPrice = parseFloat(formData.get("price") as string);
  
  // 👇 CAMBIO CLAVE: Obtenemos el ID del producto que seleccionaste en el formulario
  // Si por alguna razón falla (NaN), usamos 1 como fallback, pero el select tiene 'required'.
  const productId = parseInt(formData.get("productId") as string) || 1;

  // Buscamos o creamos al cliente
  let customer = await prisma.customer.findFirst({
    where: { phone: clientPhone }
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: { name: clientName, phone: clientPhone, email: "" }
    });
  }

  // Creamos el pedido
  await prisma.order.create({
    data: {
      deliveryDate: new Date(), // Por defecto entrega hoy
      status: 'PENDING',
      total: productPrice,
      customerId: customer.id,
      items: {
        create: {
          quantity: 1,
          price: productPrice,
          productId: productId // 👈 Aquí guardamos el producto real seleccionado
        }
      }
    }
  });

  revalidatePath("/orders");
  revalidatePath("/");
}

// 3. ELIMINAR PEDIDO (Basurero 🗑️)
export async function deleteOrder(orderId: number) {
  try {
    // Primero borramos los items del pedido (por seguridad de clave foránea)
    await prisma.orderItem.deleteMany({
      where: { orderId: orderId }
    });
    
    // Luego borramos el pedido
    await prisma.order.delete({
      where: { id: orderId }
    });

    revalidatePath("/orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// 4. Simular Pedido Rápido (Legacy/Pruebas)
export async function createQuickOrder() {
  const product = await prisma.product.findFirst();
  const customer = await prisma.customer.findFirst();

  if (!product || !customer) return;

  await prisma.order.create({
    data: {
      deliveryDate: new Date(),
      status: 'PENDING',
      total: product.price,
      customerId: customer.id,
      items: {
        create: { quantity: 1, price: product.price, productId: product.id }
      }
    }
  });
  
  revalidatePath("/orders");
  revalidatePath("/");
}