import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id as string)
    
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz muayene ID'
      })
    }

    const muayene = await prisma.muayene.findUnique({
      where: { id },
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      }
    })

    if (!muayene) {
      throw createError({
        statusCode: 404,
        message: 'Muayene bulunamadı'
      })
    }

    return muayene
  } catch (error) {
    if (error === 400 || error === 404) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Muayene detayı alınırken bir hata oluştu'
    })
  }
}) 