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
  durum: z.enum(['DEVAM_EDIYOR', 'TAMAMLANDI', 'IPTAL']).default('DEVAM_EDIYOR')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = muayeneSchema.parse(body)

    const muayene = await prisma.muayene.create({
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

    throw createError({
      statusCode: 500,
      message: 'Muayene oluşturulurken bir hata oluştu'
    })
  }
}) 