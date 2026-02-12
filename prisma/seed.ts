import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Crear Productos
  const ramoRosas = await prisma.product.create({
    data: {
      name: 'Ramo Eternidad (24 Rosas)',
      description: 'Rosas rojas de invernadero premium',
      price: 850.00,
      occasion: 'love', 
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80&w=800'
    }
  })

  // 2. Crear Clientes (Buscando por teléfono)
  const cliente = await prisma.customer.upsert({
    where: { phone: '5551234567' },
    update: {},
    create: {
      name: 'Ana García',
      phone: '5551234567',
      email: 'ana@gmail.com'
    }
  })

  // 3. Crear Lotes de Flores
  console.log('🌱 Plantando flores frescas...')
  
  // Lote Fresco
  await prisma.flowerBatch.create({
    data: {
      flowerType: 'Girasol',
      quantity: 50,
      // arrivalDate: ...  <-- BORRAMOS ESTA LÍNEA (Usará createdAt automático)
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
      status: 'FRESH',
      purchasePrice: 15.00
    }
  })

  console.log('🥀 Plantando flores podridas...')

  // Lote EN RIESGO
  await prisma.flowerBatch.create({
    data: {
      flowerType: 'Rosa Roja',
      quantity: 150,
      // arrivalDate: ... <-- BORRAMOS ESTA LÍNEA TAMBIÉN
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
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