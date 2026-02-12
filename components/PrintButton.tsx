"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm border border-gray-200"
    >
      <span>🖨️</span>
      <span className="hidden sm:inline">Imprimir Orden</span>
    </button>
  );
}