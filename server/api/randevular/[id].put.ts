import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const randevuSchema = z.object({
  hastaId: z.number(),
  doktorId: z.number(),
  tarih: z.string().datetime(),
  saat: z.string(),
  tip: z.enum(['MUAYENE', 'KONTROL', 'ACIL']),
  durum: z.enum(['BEKLIYOR', 'TAMAMLANDI', 'IPTAL']),
  notlar: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id as string)
    
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz randevu ID'
      })
    }

    const body = await readBody(event)
    const validatedData = randevuSchema.parse(body)

    const randevu = await prisma.randevu.update({
      where: { id },
      data: validatedData,
      include: {
        hasta: true,
        doktor: true
      }
    })

    return randevu
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz randevu bilgileri',
        data: error.errors
      })
    }

    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Randevu güncellenirken bir hata oluştu'
    })
  }
}) 