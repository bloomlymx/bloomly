"use client";

import { Product } from "@prisma/client";
import Link from "next/link"; // 👈 Importante: Importamos Link
import { deleteProduct } from "@/app/actions/product"; // Si tenías acción de borrar

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all">
      
      {/* Imagen del Producto */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img 
          src={product.imageUrl || "/placeholder.jpg"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge de Precio */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
            ${product.price}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-4 line-clamp-2">
            {product.description || "Incluye tarjeta y moño."}
        </p>

        {/* 👇 AQUÍ ESTÁ EL CAMBIO IMPORTANTE 👇 */}
        {/* En lugar de <button>, usamos <Link> que lleva a la página de edición */}
        <div className="mt-auto pt-4 flex gap-2">
            <Link 
                href={`/dashboard/products/${product.id}`} 
                className="flex-1 text-center bg-gray-800 text-white font-bold text-[10px] uppercase py-3 rounded-xl hover:bg-gray-900 transition-colors tracking-wide"
            >
                Ver Detalle / Oferta
            </Link>
        </div>

      </div>
    </div>
  );
}