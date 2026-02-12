"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. CREAR PRODUCTO
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      // Si no ponen foto, ponemos una genérica de flores bonita
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=800",
    },
  });

  revalidatePath("/products");
  revalidatePath("/");
}

// 2. ELIMINAR PRODUCTO
export async function deleteProduct(productId: number) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    });
    revalidatePath("dashboard/products");
    revalidatePath("/shop");
  } catch (error) {
    console.error("Error borrando producto", error);
  }
}