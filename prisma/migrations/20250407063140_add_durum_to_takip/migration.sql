/*
  Warnings:

  - Added the required column `durum` to the `Takip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muayeneId` to the `Tetkik` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `takip` ADD COLUMN `durum` VARCHAR(191) NOT NULL,
    ADD COLUMN `notlar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tetkik` ADD COLUMN `muayeneId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Muayene` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hastaId` INTEGER NOT NULL,
    `doktorId` INTEGER NOT NULL,
    `tarih` DATETIME(3) NOT NULL,
    `sikayet` VARCHAR(191) NULL,
    `tani` VARCHAR(191) NULL,
    `tedavi` VARCHAR(191) NULL,
    `notlar` VARCHAR(191) NULL,
    `durum` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tetkik` ADD CONSTRAINT `Tetkik_muayeneId_fkey` FOREIGN KEY (`muayeneId`) REFERENCES `Muayene`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muayene` ADD CONSTRAINT `Muayene_hastaId_fkey` FOREIGN KEY (`hastaId`) REFERENCES `Hasta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muayene` ADD CONSTRAINT `Muayene_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
