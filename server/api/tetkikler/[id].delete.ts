import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const idParam = event.context.params?.id
    if (!idParam) {
      throw createError({ statusCode: 400, message: 'ID parametresi eksik' })
    }

    const id = parseInt(idParam)

    await prisma.tetkik.delete({ where: { id } })

    return { success: true }
  } catch (error) {
    console.error('Tetkik silinirken hata oluştu:', error)
    throw createError({
      statusCode: 500,
      message: 'Tetkik silinirken bir hata oluştu'
    })
  }
})
