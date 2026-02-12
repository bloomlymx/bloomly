"use client";

import { useState } from "react";

export default function AiDedicationBtn({ setDedication, recipientName }: { setDedication: (text: string) => void, recipientName: string }) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!recipientName) {
      alert("Primero escribe el nombre de quién recibe para inspirarme 🤖");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/generate-dedication", {
        method: "POST",
        body: JSON.stringify({ 
            occasion: "Ocasión Especial", // Podrías hacerlo dinámico
            recipient: recipientName 
        }),
      });
      const data = await res.json();
      setDedication(data.text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      type="button"
      onClick={generate}
      disabled={loading}
      className="text-xs font-bold text-bloomly-olive flex items-center gap-1 mt-2 hover:bg-green-50 px-2 py-1 rounded transition-colors"
    >
      {loading ? "✨ Pensando..." : "✨ ¿Sin ideas? Usar IA"}
    </button>
  );
}