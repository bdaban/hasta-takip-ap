import { getPrismaClient } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçersiz hasta ID',
      })
    }
    
    const prisma = getPrismaClient()
    const hasta = await prisma.hasta.findUnique({
      where: { id },
      include: {
        takipler: {
          include: {
            doktor: true,
          },
          orderBy: {
            tarih: 'desc',
          },
        },
        randevular: {
          include: {
            doktor: true,
          },
          orderBy: {
            tarih: 'desc',
          },
        },
      },
    })
    
    if (!hasta) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Hasta bulunamadı',
      })
    }
    
    return hasta
  } catch (error) {
    console.error('Hasta detayı alınırken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Hasta detayı alınırken bir hata oluştu',
    })
  }
}) 