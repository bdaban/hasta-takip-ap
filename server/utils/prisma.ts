import { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null

// Prisma istemcisini oluştur ve önbelleğe al
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient()
  }
  return prismaInstance
}

// Serverless ortamda bağlantıyı kapatma (opsiyonel)
export async function closePrismaConnection(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect()
    prismaInstance = null
  }
} 