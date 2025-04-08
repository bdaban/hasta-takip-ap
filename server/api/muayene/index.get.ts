import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const muayeneler = await prisma.muayene.findMany({
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      },
      orderBy: {
        tarih: 'desc'
      }
    })

    return muayeneler
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Muayeneler getirilirken bir hata oluştu'
    })
  }
}) 