/*
  Warnings:

  - Added the required column `doktorId` to the `Tetkik` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hastaId` to the `Tetkik` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tetkik` DROP FOREIGN KEY `Tetkik_muayeneId_fkey`;

-- DropForeignKey
ALTER TABLE `tetkik` DROP FOREIGN KEY `Tetkik_takipId_fkey`;

-- DropIndex
DROP INDEX `Tetkik_muayeneId_fkey` ON `tetkik`;

-- DropIndex
DROP INDEX `Tetkik_takipId_fkey` ON `tetkik`;

-- AlterTable
ALTER TABLE `tetkik` ADD COLUMN `doktorId` INTEGER NOT NULL,
    ADD COLUMN `hastaId` INTEGER NOT NULL,
    MODIFY `takipId` INTEGER NULL,
    MODIFY `muayeneId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Tetkik` ADD CONSTRAINT `Tetkik_hastaId_fkey` FOREIGN KEY (`hastaId`) REFERENCES `Hasta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tetkik` ADD CONSTRAINT `Tetkik_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `Doktor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tetkik` ADD CONSTRAINT `Tetkik_takipId_fkey` FOREIGN KEY (`takipId`) REFERENCES `Takip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tetkik` ADD CONSTRAINT `Tetkik_muayeneId_fkey` FOREIGN KEY (`muayeneId`) REFERENCES `Muayene`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
