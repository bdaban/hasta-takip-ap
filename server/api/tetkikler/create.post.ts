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
    
    const tetkik = await prisma.tetkik.create({
      data: {
        hastaId: body.hastaId,
        doktorId: body.doktorId,
        takipId: body.takipId || null,
        muayeneId: body.muayeneId || null,
        tip: body.tip,
        tarih: new Date(tarih),
        sonuc: body.sonuc || null
      },
      include: {
        hasta: true,
        doktor: true,
        takip: true,
        muayene: true
      }
    })
    
    console.log('Oluşturulan tetkik:', tetkik)
    return { tetkik }
  } catch (error: any) {
    console.error('Tetkik oluşturulurken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkik oluşturulurken bir hata oluştu'
    })
  }
}) 