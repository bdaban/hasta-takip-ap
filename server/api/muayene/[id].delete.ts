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

    await prisma.muayene.delete({
      where: { id }
    })

    return { message: 'Muayene başarıyla silindi' }
  } catch (error) {
    if (error === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Muayene bulunamadı'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Muayene silinirken bir hata oluştu'
    })
  }
}) 