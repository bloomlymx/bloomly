"use client";

import { useState } from "react";

export default function DedicationWizard() {
  const [dedication, setDedication] = useState("");
  const [loading, setLoading] = useState(false);
  const [occasion, setOccasion] = useState("Amor"); // Por defecto Amor

  const handleGenerate = async () => {
    // 1. Buscamos el nombre de quien recibe (está fuera de este componente)
    const recipientInput = document.querySelector('input[name="recipientName"]') as HTMLInputElement;
    const recipientName = recipientInput?.value;

    if (!recipientName) {
      alert("Por favor escribe arriba '¿Quién Recibe?' para que la IA sepa a quién escribirle. 🤖");
      return;
    }

    setLoading(true);
    try {
      // 2. Le mandamos a la API el nombre Y LA OCASIÓN seleccionada
      const res = await fetch("/api/generate-dedication", {
        method: "POST",
        body: JSON.stringify({ 
            occasion: occasion, 
            recipient: recipientName 
        }),
      });
      
      const data = await res.json();
      if(data.text) setDedication(data.text);
      
    } catch (error) {
      console.error(error);
      alert("Error conectando con la IA. Revisa tu API KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-gray-400 uppercase">
            Mensaje para la Tarjeta 💌
        </label>
        
        {/* Selector de Vibe/Ocasión */}
        <select 
            value={occasion} 
            onChange={(e) => setOccasion(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none text-bloomly-olive font-bold cursor-pointer hover:border-bloomly-olive"
        >
            <option value="Amor Romántico">❤️ Amor</option>
            <option value="Cumpleaños Festivo">🎂 Cumpleaños</option>
            <option value="Aniversario Elegante">💍 Aniversario</option>
            <option value="Pedir Perdón">🥺 Perdón</option>
            <option value="Condolencias y Respeto">🕊️ Condolencias</option>
            <option value="Agradecimiento Profesional">💼 Agradecimiento</option>
            <option value="Conquista / Ligal">😏 Conquista</option>
        </select>
      </div>

      <div className="relative">
        <textarea
          name="dedication"
          rows={4}
          value={dedication}
          onChange={(e) => setDedication(e.target.value)}
          placeholder={`Selecciona "Ayúdame IA" para escribir una carta de ${occasion}...`}
          className="w-full p-3 rounded-lg border border-gray-200 focus:border-bloomly-olive outline-none resize-none bg-white text-sm shadow-inner"
        />
        
        {/* Botón Mágico */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="absolute bottom-3 right-3 text-xs bg-gradient-to-r from-bloomly-olive to-green-600 text-white px-3 py-1.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1 shadow-md"
        >
          {loading ? (
            <span className="animate-pulse">✨ Escribiendo...</span>
          ) : (
            <>
              <span>✨ Generar con IA</span>
            </>
          )}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-right">Powered by Google Gemini</p>
    </div>
  );
}