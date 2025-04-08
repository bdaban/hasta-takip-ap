import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id as string)

  try {
    // Önce hastayı ve ilişkili kayıtları kontrol et
    const existingHasta = await prisma.hasta.findUnique({
      where: { id },
      include: {
        takipler: true,
        randevular: true
      }
    })

    if (!existingHasta) {
      throw createError({
        statusCode: 404,
        message: 'Hasta bulunamadı'
      })
    }

    // İlişkili kayıtları silme işlemleri
    const deleteTakipler = prisma.takip.deleteMany({
      where: { hastaId: id }
    })

    const deleteRandevular = prisma.randevu.deleteMany({
      where: { hastaId: id }
    })

    const deleteHasta = prisma.hasta.delete({
      where: { id }
    })

    // Tüm silme işlemlerini transaction içinde gerçekleştir
    await prisma.$transaction([
      deleteTakipler,
      deleteRandevular,
      deleteHasta
    ])

    return { success: true, message: 'Hasta ve ilişkili kayıtlar başarıyla silindi' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Hasta silinirken bir hata oluştu'
    })
  }
}) 