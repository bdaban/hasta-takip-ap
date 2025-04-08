import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const takipler = await prisma.takip.findMany({
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      },
      orderBy: {
        tarih: 'desc'
      }
    })
    
    return takipler
  } catch (error) {
    console.error('Takipler getirilirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Takipler getirilirken bir hata oluştu'
    })
  }
}) 