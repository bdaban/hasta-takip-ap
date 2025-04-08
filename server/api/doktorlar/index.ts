import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    try {
      const doktorlar = await prisma.doktor.findMany({
        select: {
          id: true,
          ad: true,
          soyad: true,
          uzmanlik: true,
          telefon: true,
          email: true
        }
      })
      return doktorlar
    } catch (error) {
      console.error('Doktorlar getirilirken hata:', error)
      throw createError({
        statusCode: 500,
        message: 'Doktorlar getirilirken bir hata oluştu'
      })
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
}) 