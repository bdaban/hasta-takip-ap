import { getPrismaClient } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçersiz hasta ID',
      })
    }
    
    // Zorunlu alanları kontrol et
    if (!body.ad || !body.soyad || !body.tc || !body.dogumTarihi || !body.cinsiyet) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Eksik veya hatalı bilgi',
      })
    }
    
    const prisma = getPrismaClient()
    
    // Güncellenecek hastayı kontrol et
    const existingHasta = await prisma.hasta.findUnique({
      where: { id },
    })
    
    if (!existingHasta) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Hasta bulunamadı',
      })
    }
    
    // TC kimlik numarası değiştiyse, yeni TC'nin benzersiz olduğunu kontrol et
    if (body.tc !== existingHasta.tc) {
      const existingTC = await prisma.hasta.findUnique({
        where: { tc: body.tc },
      })
      
      if (existingTC) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bu TC kimlik numarasına sahip başka bir hasta zaten kayıtlı',
        })
      }
    }
    
    // Hastayı güncelle
    const updatedHasta = await prisma.hasta.update({
      where: { id },
      data: {
        ad: body.ad,
        soyad: body.soyad,
        tc: body.tc,
        telefon: body.telefon || null,
        adres: body.adres || null,
        dogumTarihi: new Date(body.dogumTarihi),
        cinsiyet: body.cinsiyet,
        notlar: body.notlar || null,
      },
    })
    
    return {
      message: 'Hasta bilgileri başarıyla güncellendi',
      hasta: updatedHasta,
    }
  } catch (error) {
    console.error('Hasta güncellenirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Hasta güncellenirken bir hata oluştu',
    })
  }
}) 