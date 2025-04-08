import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Gelen veri:', body)

    const doktor = await prisma.doktor.create({
      data: {
        ad: body.ad,
        soyad: body.soyad,
        sicilNo: body.sicilNo,
        brans: body.brans,
        uzmanlik: body.uzmanlik || null,
        telefon: body.telefon || null,
        email: body.email || null,
      }
    })

    console.log('Oluşturulan doktor:', doktor)
    return { doktor }
  } catch (error: any) {
    console.error('Doktor oluşturma hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'Doktor oluşturulurken bir hata oluştu'
    })
  }
}) 