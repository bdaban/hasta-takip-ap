import { getPrismaClient } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Zorunlu alanları kontrol et
    if (!body.ad || !body.soyad || !body.tc || !body.dogumTarihi || !body.cinsiyet) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Eksik veya hatalı bilgi',
      })
    }
    
    const prisma = getPrismaClient()
    
    // TC kimlik numarası benzersiz olmalı
    const existingTC = await prisma.hasta.findUnique({
      where: { tc: body.tc },
    })
    
    if (existingTC) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bu TC kimlik numarasına sahip bir hasta zaten kayıtlı',
      })
    }
    
    // Yeni hasta oluştur
    const hasta = await prisma.hasta.create({
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
      message: 'Hasta başarıyla kaydedildi',
      hasta,
    }
  } catch (error) {
    console.error('Hasta oluşturulurken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Hasta oluşturulurken bir hata oluştu',
    })
  }
}) 