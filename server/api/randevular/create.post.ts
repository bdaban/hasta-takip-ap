import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Gelen veri:', body)
    
    // Durum değerini dönüştür
    if (body.durum === 'Devam Ediyor') {
      body.durum = 'BEKLIYOR'
    }
    
    // Tarih formatını düzelt
    let tarih = body.tarih
    if (tarih) {
      // Tarih string'ini Date nesnesine çevir
      const date = new Date(tarih)
      // ISO string formatına çevir
      tarih = date.toISOString()
    }
    
    // Varsayılan değerleri ayarla
    const randevuData = {
      hastaId: body.hastaId,
      doktorId: body.doktorId,
      tarih: tarih,
      tip: body.tip || 'MUAYENE',
      durum: body.durum || 'BEKLIYOR',
      notlar: body.notlar || '',

          }
    
    console.log('İşlenecek veri:', randevuData)

    const randevu = await prisma.randevu.create({
      data: randevuData,
      include: {
        hasta: true,
        doktor: true
      }
    })

    return { randevu }
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error)
    
    throw createError({
      statusCode: 500,
      message: 'Randevu oluşturulurken bir hata oluştu'
    })
  }
}) 