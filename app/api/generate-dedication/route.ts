import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Solución al error de apiKey:
    // Le decimos: "Si no existe, usa un string vacío", y luego validamos.
    const apiKey = process.env.GOOGLE_API_KEY || "";
    
    if (!apiKey) {
      console.error("❌ Falta la API Key en el archivo .env");
      return NextResponse.json({ text: "Error de configuración (API Key)." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Usamos el modelo que APARECIÓ EN TU LISTA.
    // 'gemini-flash-latest' está disponible en tu cuenta.
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 3. Solución al error de occasion y recipient:
    // Le decimos a TypeScript exactamente qué forma tienen los datos.
    const body = await req.json();
    const occasion = body.occasion as string || "Ocasión Especial";
    const recipient = body.recipient as string || "Alguien especial";

    const prompt = `Actúa como un poeta experto en flores. Escribe una dedicatoria corta (máximo 25 palabras) para una tarjeta de regalo.
    Ocasión: ${occasion}.
    Destinatario: ${recipient}.
    Tono: Emotivo, cálido, elegante y personal. Evita frases genéricas.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("🔥 ERROR IA:", error.message);
    
    // Mensaje de respaldo por si algo falla
    return NextResponse.json({ 
        text: `Con todo mi cariño para ${req.headers.get("recipient") || "ti"}. Espero que estas flores alegren tu día.` 
    });
  }
}