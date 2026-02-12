import Sidebar from "@/components/Sidebar"; // Asegúrate de que la ruta sea correcta

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* 1. EL SIDEBAR (Fijo a la izquierda) */}
      <aside className="w-64 h-full hidden md:block fixed left-0 top-0 z-10">
        <Sidebar />
      </aside>

      {/* 2. EL CONTENIDO (Cambiante a la derecha) */}
      {/* Dejamos un margen a la izquierda (ml-64) para que no se encime con el sidebar */}
      <main className="flex-1 ml-0 md:ml-64 p-8 overflow-y-auto h-full">
        {children}
      </main>

    </div>
  );
}