import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Crear Productos del Catálogo
  // Nota: Usamos 'create' simple. Si corres esto muchas veces se duplicarán los ramos, 
  // pero para la primera vez está bien.
  const ramoRosas = await prisma.product.create({
    data: {
      name: 'Ramo Eternidad (24 Rosas)',
      description: 'Rosas rojas de invernadero premium',
      price: 850.00,
      occasion: 'love', // Usamos 'occasion' (el campo correcto)
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80&w=800' // Usamos 'imageUrl' (el campo correcto)
    }
  })

  // 2. Crear Clientes
  // CORRECCIÓN: Usamos 'phone' en el 'where' porque tu base de datos requiere un campo único
  const cliente = await prisma.customer.upsert({
    where: { phone: '5551234567' }, // 👈 CAMBIO AQUÍ (Antes era email)
    update: {},
    create: {
      name: 'Ana García',
      phone: '5551234567',
      email: 'ana@gmail.com'
    }
  })

  // 3. Crear Lotes de Flores (Aquí simulamos la MERMA)
  console.log('🌱 Plantando flores frescas...')
  
  // Lote Fresco
  await prisma.flowerBatch.create({
    data: {
      flowerType: 'Girasol',
      quantity: 50,
      arrivalDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Caduca en 7 días
      status: 'FRESH',
      purchasePrice: 15.00
    }
  })

  console.log('🥀 Plantando flores podridas (simulación de riesgo)...')

  // Lote EN RIESGO (Esto debería activar tu alerta roja)
  await prisma.flowerBatch.create({
    data: {
      flowerType: 'Rosa Roja',
      quantity: 150, // ¡150 rosas en riesgo!
      arrivalDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Caduca MAÑANA
      status: 'RISK',
      purchasePrice: 12.50
    }
  })

  console.log('✅ ¡Datos sembrados con éxito!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })