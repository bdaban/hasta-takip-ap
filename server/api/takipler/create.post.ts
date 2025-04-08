import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Gelen veri:', body)
    
    // Tarih formatını düzelt
    let tarih = body.tarih
    if (!tarih.includes('Z') && !tarih.includes('+')) {
      tarih = `${tarih}Z`
    }
    
    const takip = await prisma.takip.create({
      data: {
        hastaId: body.hastaId,
        doktorId: body.doktorId,
        tarih: new Date(tarih),
        sikayet: body.sikayet || null,
        tani: body.tani || null,
        tedavi: body.tedavi || null,
        durum: body.durum || 'DEVAM_EDIYOR',
        notlar: body.notlar || null
      },
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      }
    })
    
    console.log('Oluşturulan takip:', takip)
    return { takip }
  } catch (error: any) {
    console.error('Takip oluşturulurken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Takip oluşturulurken bir hata oluştu'
    })
  }
}) 