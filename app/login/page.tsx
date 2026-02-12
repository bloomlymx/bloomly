"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Enviamos la contraseña a nuestra API para verificarla
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard"); // Si es correcta, vamos al dashboard
      router.refresh();
    } else {
      setError("Contraseña incorrecta. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-bloomly-olive text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-bloomly-olive/20">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido a Bloomly</h1>
          <p className="text-gray-500 text-sm">Tu sistema operativo floral.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Contraseña de Acceso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-bloomly-olive focus:ring-4 focus:ring-bloomly-olive/10 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-bloomly-olive text-white font-bold py-4 rounded-xl hover:bg-bloomly-green transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 Bloomly SaaS • Acceso Privado
        </div>
      </div>
    </div>
  );
}