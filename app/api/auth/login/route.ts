import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // Verificamos contra la variable de entorno (o la forzada si sigues con el fix anterior)
    // Recomendación: Usa process.env.ADMIN_PASSWORD
    const correctPassword = process.env.ADMIN_PASSWORD || "flores2026";

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });

      // Aquí creamos la "Cookie VIP"
      response.cookies.set("bloomly_session", "true", {
        httpOnly: true, // No accesible por JS (seguridad)
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // Dura 1 semana
      });

      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}