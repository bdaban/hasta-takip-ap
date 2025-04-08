/*
  Warnings:

  - Added the required column `tip` to the `Randevu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `randevu` ADD COLUMN `tip` VARCHAR(191) NOT NULL;
