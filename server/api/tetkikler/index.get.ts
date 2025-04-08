import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const tetkikler = await prisma.tetkik.findMany({
      include: {
        hasta: true,
        doktor: true,
        takip: true,
        muayene: true
      },
      orderBy: {
        tarih: 'desc'
      }
    })
    
    return tetkikler
  } catch (error) {
    console.error('Tetkikler getirilirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkikler getirilirken bir hata oluştu'
    })
  }
}) 