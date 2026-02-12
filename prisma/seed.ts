import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Crear Productos del Catálogo
  const ramoRosas = await prisma.product.create({
    data: {
      name: 'Ramo Eternidad (24 Rosas)',
      description: 'Rosas rojas de invernadero premium',
      price: 850.00,
      category: 'Ramo',
      image: '/roses.jpg'
    }
  })

  // 2. Crear Clientes
  const cliente = await prisma.customer.create({
    data: {
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
      status: 'FRESH'
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
      status: 'RISK'
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