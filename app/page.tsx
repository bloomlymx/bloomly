import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
      
      {/* Tarjeta Central de Acceso */}
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        
        {/* Logo / Icono */}
        <div className="w-20 h-20 bg-bloomly-olive text-white rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-bloomly-olive/20 mx-auto mb-6 transform -rotate-3">
          B
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          Bloomly
        </h1>
        
        <p className="text-gray-500 mb-8 text-sm">
          Sistema Operativo de Gestión Floral.<br/>
          Acceso restringido únicamente a personal autorizado.
        </p>

        {/* Botón Único: ADMIN */}
        <Link 
            href="/login" 
            className="group relative flex items-center justify-center gap-3 w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
        >
            {/* Efecto de brillo al pasar el mouse */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            
            <span>🔐</span>
            <span>Ingresar a Bloomly</span>
        </Link>

        {/* Footer discreto */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-wider">
            <span>v1.0.0 Stable</span>
            <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Online
            </span>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        © 2026 Bloomly SaaS. Todos los derechos reservados.
      </p>

    </div>
  );
}