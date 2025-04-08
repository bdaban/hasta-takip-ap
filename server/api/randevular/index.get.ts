import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const randevular = await prisma.randevu.findMany({
      include: {
        hasta: true,
        doktor: true
      },
      orderBy: {
        tarih: 'desc'
      }
    })

    return randevular
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Randevular getirilirken bir hata oluştu'
    })
  }
}) 