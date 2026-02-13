"use client"; // 👈 NECESARIO para que funcione el botón

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* 1. FONDO OSCURO (Solo móvil, cuando abres el menú) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. EL SIDEBAR (Adaptable) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:shadow-none
        `}
      >
        <div className="h-full overflow-y-auto">
            {/* Botón X para cerrar (solo móvil) dentro del sidebar si quieres, 
                o simplemente al hacer click afuera se cierra */}
             <Sidebar />
        </div>
      </aside>

      {/* 3. EL CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER MÓVIL (Barra superior que solo sale en celular) */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
           <h1 className="font-bold text-gray-800 text-lg">Bloomly 🌸</h1>
           
           {/* Botón Hamburguesa 🍔 */}
           <button 
             onClick={() => setSidebarOpen(true)} 
             className="p-2 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
        </header>

        {/* CONTENIDO DE LA PÁGINA */}
        {/* Quitamos el ml-64 porque ahora usamos flexbox real */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>

    </div>
  );
}