"use client";

import { useState } from "react";
import { quoteUberDelivery } from "@/app/actions/uber";

export default function TestUberButton() {
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{ costo: string, tiempo: string } | null>(null);

  const handleQuote = async () => {
    setLoading(true);
    setQuoteResult(null); // Limpiamos si había una cotización anterior
    
    try {
      const res = await quoteUberDelivery();
      if (res.success) {
        // Extraemos los números del mensaje simulado usando un poco de magia de texto
        // Mensaje esperado: "... Costo: $45.00 MXN - Llegada aprox: 15 min..."
        const costoMatch = res.message.match(/\$(\d+\.\d+)/);
        const tiempoMatch = res.message.match(/(\d+) min/);
        
        if (costoMatch && tiempoMatch) {
            setQuoteResult({
                costo: costoMatch[1],
                tiempo: tiempoMatch[1]
            });
        }
      } else {
        alert("🔴 " + res.message); 
      }
    } catch (error) {
      alert("🔴 Error en el sistema");
    }
    setLoading(false);
  };

  const handleAcceptDelivery = () => {
      alert(`🎉 ¡Chofer en camino! Se cobrarán $${quoteResult?.costo} MXN de tu saldo.`);
      setQuoteResult(null); // Cerramos la tarjeta simulando que ya se pidió
  };

  return (
    <div className="relative">
        {/* Botón Principal */}
        <button 
        onClick={handleQuote}
        disabled={loading}
        className="bg-bloomly-olive text-white hover:bg-green-800 border border-green-900 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
        title="Probar Cotización de Uber"
        >
        <span>{loading ? "⏳" : "💰"}</span> 
        {loading ? "Calculando ruta..." : "Cotizar Envío"}
        </button>

        {/* Tarjeta de Resultado (Solo aparece si hay una cotización exitosa) */}
        {quoteResult && (
            <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800">Resumen de Envío</h4>
                    <button onClick={() => setQuoteResult(null)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Costo Uber Direct:</span>
                        <span className="font-black text-lg text-bloomly-olive">${quoteResult.costo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Llegada aprox:</span>
                        <span className="font-bold text-gray-700">{quoteResult.tiempo} min 🛵</span>
                    </div>
                </div>

                <button 
                    onClick={handleAcceptDelivery}
                    className="w-full bg-bloomly-pink text-bloomly-olive hover:bg-pink-300 font-bold py-3 rounded-xl shadow-sm transition-all text-sm"
                >
                    Confirmar y Pedir Chofer
                </button>
            </div>
        )}
    </div>
  );
}