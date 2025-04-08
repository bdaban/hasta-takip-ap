-- DropForeignKey
ALTER TABLE `muayene` DROP FOREIGN KEY `Muayene_doktorId_fkey`;

-- DropForeignKey
ALTER TABLE `randevu` DROP FOREIGN KEY `Randevu_doktorId_fkey`;

-- DropForeignKey
ALTER TABLE `takip` DROP FOREIGN KEY `Takip_doktorId_fkey`;

-- DropIndex
DROP INDEX `Muayene_doktorId_fkey` ON `muayene`;

-- DropIndex
DROP INDEX `Randevu_doktorId_fkey` ON `randevu`;

-- DropIndex
DROP INDEX `Takip_doktorId_fkey` ON `takip`;

-- CreateTable
CREATE TABLE `Doktor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(191) NOT NULL,
    `soyad` VARCHAR(191) NOT NULL,
    `brans` VARCHAR(191) NOT NULL,
    `sicilNo` VARCHAR(191) NOT NULL,
    `telefon` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `unvan` VARCHAR(191) NULL,
    `uzmanlik` VARCHAR(191) NULL,
    `notlar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Doktor_sicilNo_key`(`sicilNo`),
    UNIQUE INDEX `Doktor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Takip` ADD CONSTRAINT `Takip_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `Doktor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Randevu` ADD CONSTRAINT `Randevu_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `Doktor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muayene` ADD CONSTRAINT `Muayene_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `Doktor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
