// fix-db.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Arreglando base de datos para soportar emojis...");

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE Customer CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Order\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE Product CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    
    console.log("✅ ¡Listo! Ahora tu base de datos soporta emojis 💐✨");
  } catch (e) {
    console.error("❌ Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();