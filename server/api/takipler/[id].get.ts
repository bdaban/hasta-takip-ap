import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const idParam = event.context.params?.id
    if (!idParam) {
      throw createError({ statusCode: 400, message: 'ID parametresi eksik' })
    }

    const id = parseInt(idParam)
    
    if (isNaN(id) || id <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz takip ID'
      })
    }
    
    const takip = await prisma.takip.findUnique({
      where: { id },
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      }
    })
    
    if (!takip) {
      throw createError({
        statusCode: 404,
        message: 'Takip bulunamadı'
      })
    }
    
    return takip
  } catch (error: any) {
    console.error('Takip getirilirken hata oluştu:', error)
    
    if (error.statusCode === 400 || error.statusCode === 404) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: 'Takip getirilirken bir hata oluştu'
    })
  }
}) 