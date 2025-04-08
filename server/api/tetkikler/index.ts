import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tüm tetkikleri getir
export const GET = async () => {
  try {
    const tetkikler = await prisma.tetkik.findMany({
      include: {
        hasta: true,
        doktor: true
      },
      orderBy: {
        tarih: 'desc'
      }
    })
    
    return tetkikler
  } catch (error) {
    console.error('Tetkikler getirilirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkikler getirilirken bir hata oluştu'
    })
  }
}

// Yeni tetkik oluştur
export const POST = async (event: any) => {
  try {
    const body = await readBody(event)
    
    // Tarih formatını düzelt
    let tarih = body.tarih
    if (!tarih.includes('Z') && !tarih.includes('+')) {
      tarih = `${tarih}Z`
    }
    
    const tetkik = await prisma.tetkik.create({
      data: {
        hastaId: body.hastaId,
        doktorId: body.doktorId,
        tip: body.tip,
        tarih: new Date(tarih),
        sonuc: body.sonuc || null
      },
      include: {
        hasta: true,
        doktor: true
      }
    })
    
    return { tetkik }
  } catch (error) {
    console.error('Tetkik oluşturulurken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkik oluşturulurken bir hata oluştu'
    })
  }
} 