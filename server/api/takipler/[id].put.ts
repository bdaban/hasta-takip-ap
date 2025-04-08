import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)
    
    console.log('Gelen veri:', body)
    
    // Tarih formatını düzelt
    let tarih = body.tarih
    if (tarih && !tarih.includes('Z') && !tarih.includes('+')) {
      tarih = tarih + 'Z'
    }
    
    // Takip verilerini hazırla
    const takipData = {
      tarih: tarih,
      sikayet: body.sikayet || null,
      tani: body.tani || null,
      tedavi: body.tedavi || null,
      durum: body.durum,
      notlar: body.notlar || null
    }
    
    console.log('İşlenecek veri:', takipData)
    
    // Takibi güncelle
    const updatedTakip = await prisma.takip.update({
      where: { id },
      data: takipData,
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      }
    })
    
    return updatedTakip
  } catch (error) {
    console.error('Takip güncellenirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Takip güncellenirken bir hata oluştu'
    })
  }
}) 