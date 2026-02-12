"use client";

interface WhatsAppBtnProps {
  phone: string;
  recipientName: string;
  className?: string;
}

export default function WhatsAppBtn({ phone, recipientName, className }: WhatsAppBtnProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitamos cualquier navegación rara

    // 1. Limpieza de teléfono (Tu lógica exacta)
    let cleanNumber = phone.replace(/\D/g, '');
    let finalPhone = cleanNumber;

    if (cleanNumber.length === 10) finalPhone = `52${cleanNumber}`;
    else if (cleanNumber.length === 11 && cleanNumber.startsWith('1')) finalPhone = cleanNumber;

    // 2. Mensaje con emojis (Al estar en el cliente, esto NO fallará)
    const mensaje = `Hola ${recipientName} 👋, soy el repartidor de Las Lilas 🌸.\n\nTengo una entrega para ti 🎁🚚.\n\n¿Te encuentras en el domicilio?`;

    // 3. Abrir WhatsApp
    const url = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className={className}
    >
      📞 Avisar
    </button>
  );
}