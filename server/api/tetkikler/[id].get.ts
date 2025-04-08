import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    
    if (isNaN(id) || id <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz tetkik ID'
      })
    }
    
    const tetkik = await prisma.tetkik.findUnique({
      where: { id },
      include: {
        hasta: true,
        doktor: true,
        takip: true,
        muayene: true
      }
    })
    
    if (!tetkik) {
      throw createError({
        statusCode: 404,
        message: 'Tetkik bulunamadı'
      })
    }
    
    return tetkik
  } catch (error: any) {
    console.error('Tetkik getirilirken hata oluştu:', error)
    
    if (error.statusCode === 400 || error.statusCode === 404) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: 'Tetkik getirilirken bir hata oluştu'
    })
  }
}) 