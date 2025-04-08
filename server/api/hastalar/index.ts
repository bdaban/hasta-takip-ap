import { getPrismaClient } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const prisma = getPrismaClient()
    const hastalar = await prisma.hasta.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return hastalar
  } catch (error) {
    console.error('Hastalar alınırken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Hastalar alınırken bir hata oluştu',
    })
  }
}) 