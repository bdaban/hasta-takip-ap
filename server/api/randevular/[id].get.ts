import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id as string)
    
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz randevu ID'
      })
    }

    const randevu = await prisma.randevu.findUnique({
      where: { id },
      include: {
        hasta: true,
        doktor: true
      }
    })

    if (!randevu) {
      throw createError({
        statusCode: 404,
        message: 'Randevu bulunamadı'
      })
    }

    return randevu
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Randevu getirilirken bir hata oluştu'
    })
  }
}) 