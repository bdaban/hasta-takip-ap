// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      String
  createdAt DateTime @default(now())
  takipler  Takip[]
}

model Hasta {
  id           Int       @id @default(autoincrement())
  ad           String
  soyad        String
  tc           String    @unique
  telefon      String?
  adres        String?
  dogumTarihi  DateTime
  cinsiyet     String
  notlar       String?
  createdAt    DateTime  @default(now())
  takipler     Takip[]
  randevular   Randevu[]
}

model Takip {
  id         Int      @id @default(autoincrement())
  hastaId    Int
  tarih      DateTime
  sikayet    String?
  tani       String?
  tedavi     String?
  doktorId   Int
  createdAt  DateTime @default(now())

  hasta      Hasta    @relation(fields: [hastaId], references: [id])
  doktor     User     @relation(fields: [doktorId], references: [id])
  tetkikler  Tetkik[]
}

model Randevu {
  id         Int      @id @default(autoincrement())
  hastaId    Int
  doktorId   Int
  tarih      DateTime
  durum      String   // "bekliyor", "tamamlandı", "iptal"
  notlar     String?
  createdAt  DateTime @default(now())

  hasta      Hasta    @relation(fields: [hastaId], references: [id])
  doktor     User     @relation(fields: [doktorId], references: [id])
}

model Teshis {
  id        Int     @id @default(autoincrement())
  ad        String  @unique
  aciklama  String?
}

model Tetkik {
  id        Int      @id @default(autoincrement())
  takipId   Int
  tip       String   // "kan", "idrar", "röntgen", vs.
  sonuc     String?
  tarih     DateTime @default(now())
  
  takip     Takip    @relation(fields: [takipId], references: [id])
} 