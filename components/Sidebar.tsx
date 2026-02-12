"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Definimos las rutas de tu sistema
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Pedidos", path: "/dashboard/orders", icon: "🛍️" },
    { name: "Inventario", path: "/dashboard/inventory", icon: "🌹" },
    { name: "Catálogo", path: "/dashboard/products", icon: "📸" },
    { name: "Clientes", path: "/dashboard/customers", icon: "👥" },
    { name: "Configuración", path: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
      
      {/* 1. LOGO */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-bloomly-olive text-white rounded-lg flex items-center justify-center font-bold shadow-lg shadow-bloomly-olive/20">
          B
        </div>
        <span className="font-bold text-xl text-gray-800 tracking-tight">Bloomly.</span>
      </div>

      {/* 2. MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          // Verificamos si esta es la página activa para pintarla de verde
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-bloomly-olive text-white shadow-md shadow-bloomly-olive/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. FOOTER DEL SIDEBAR */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900">Administrador</p>
            <p className="text-[10px] text-gray-400 truncate">admin@bloomly.com</p>
          </div>
        </div>
        
        <Link 
            href="/" 
            className="block text-center text-[10px] font-bold text-gray-400 mt-3 hover:text-red-400 transition-colors"
        >
            Cerrar Sesión
        </Link>
      </div>
    </div>
  );
}