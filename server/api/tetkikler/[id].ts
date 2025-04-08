import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tekil tetkik getir
export const GET = async (event: any) => {
  try {
    const id = parseInt(event.context.params.id)
    
    const tetkik = await prisma.tetkik.findUnique({
      where: { id },
      include: {
        hasta: true,
        doktor: true
      }
    })
    
    if (!tetkik) {
      throw createError({
        statusCode: 404,
        message: 'Tetkik bulunamadı'
      })
    }
    
    return tetkik
  } catch (error) {
    console.error('Tetkik getirilirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkik getirilirken bir hata oluştu'
    })
  }
}

// Tetkik güncelle
export const PUT = async (event: any) => {
  try {
    const id = parseInt(event.context.params.id)
    const body = await readBody(event)
    
    // Tarih formatını düzelt
    let tarih = body.tarih
    if (!tarih.includes('Z') && !tarih.includes('+')) {
      tarih = `${tarih}Z`
    }
    
    const tetkik = await prisma.tetkik.update({
      where: { id },
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
    console.error('Tetkik güncellenirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkik güncellenirken bir hata oluştu'
    })
  }
}

// Tetkik sil
export const DELETE = async (event: any) => {
  try {
    const id = parseInt(event.context.params.id)
    
    await prisma.tetkik.delete({
      where: { id }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Tetkik silinirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkik silinirken bir hata oluştu'
    })
  }
} 