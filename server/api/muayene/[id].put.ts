import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const muayeneSchema = z.object({
  hastaId: z.number(),
  doktorId: z.number(),
  tarih: z.string().datetime(),
  sikayet: z.string().optional(),
  tani: z.string().optional(),
  tedavi: z.string().optional(),
  notlar: z.string().optional(),
  durum: z.enum(['DEVAM_EDIYOR', 'TAMAMLANDI', 'IPTAL'])
})

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id as string)
    
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz muayene ID'
      })
    }

    const body = await readBody(event)
    const validatedData = muayeneSchema.parse(body)

    const muayene = await prisma.muayene.update({
      where: { id },
      data: {
        hastaId: validatedData.hastaId,
        doktorId: validatedData.doktorId,
        tarih: new Date(validatedData.tarih),
        sikayet: validatedData.sikayet,
        tani: validatedData.tani,
        tedavi: validatedData.tedavi,
        notlar: validatedData.notlar,
        durum: validatedData.durum
      },
      include: {
        hasta: true,
        doktor: true,
        tetkikler: true
      }
    })

    return muayene
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz muayene bilgileri',
        data: error.errors
      })
    }

    if (error === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Muayene bulunamadı'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Muayene güncellenirken bir hata oluştu'
    })
  }
}) 