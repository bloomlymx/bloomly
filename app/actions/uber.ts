"use server";

// ==========================================
// 1. FUNCIÓN DE PRUEBA (La que ya funciona)
// ==========================================
export async function testUberConnection() {
  const params = new URLSearchParams();
  params.append("client_id", process.env.UBER_CLIENT_ID!);
  params.append("client_secret", process.env.UBER_CLIENT_SECRET!);
  params.append("grant_type", "client_credentials");
  params.append("scope", "eats.store.orders.read");

  try {
    const response = await fetch("https://sandbox-login.uber.com/oauth/v2/token", {
      method: "POST",
      body: params,
      cache: "no-store"
    });

    const data = await response.json();
    
    if (data.access_token) {
      console.log("Token de Prueba:", data.access_token.slice(0, 15) + "...");
      return { success: true, message: "¡Conexión Exitosa con Uber! 🚗💨" };
    } else {
      console.log("Error de Uber (Prueba):", data);
      return { success: false, message: "Rechazado por Uber: Revisa tu terminal." };
    }
  } catch (error) {
    return { success: false, message: "Error de red al intentar conectar." };
  }
}

// ==========================================
// 2. NUEVA FUNCIÓN: COTIZADOR DE ENVÍOS (MODO SIMULACIÓN) 💰
// ==========================================
export async function quoteUberDelivery() {
  try {
    console.log("🟡 Ejecutando cotización en MODO SIMULACIÓN (Mock)...");
    
    // Fingimos que estamos esperando a que los servidores de Uber contesten (1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generamos un precio y tiempo aleatorios para que se sienta real en tus pruebas
    const costoSimulado = (Math.random() * (80 - 35) + 35).toFixed(2); // Costo entre $35 y $80 MXN
    const tiempoSimulado = Math.floor(Math.random() * (30 - 10) + 10); // Tiempo entre 10 y 30 mins

    console.log(`🟢 Simulación Exitosa: $${costoSimulado} MXN, ${tiempoSimulado} min.`);

    // Devolvemos el éxito simulado a tu Dashboard
    return { 
      success: true, 
      message: `¡Viaje cotizado! Costo: $${costoSimulado} MXN - Llegada aprox: ${tiempoSimulado} min. (Simulacro)` 
    };

  } catch (error) {
    console.error("🔴 Error en la simulación:", error);
    return { success: false, message: "Falló el sistema de simulación." };
  }
}