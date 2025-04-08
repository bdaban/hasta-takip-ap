-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hasta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(191) NOT NULL,
    `soyad` VARCHAR(191) NOT NULL,
    `tc` VARCHAR(191) NOT NULL,
    `telefon` VARCHAR(191) NULL,
    `adres` VARCHAR(191) NULL,
    `dogumTarihi` DATETIME(3) NOT NULL,
    `cinsiyet` VARCHAR(191) NOT NULL,
    `notlar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Hasta_tc_key`(`tc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Takip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hastaId` INTEGER NOT NULL,
    `tarih` DATETIME(3) NOT NULL,
    `sikayet` VARCHAR(191) NULL,
    `tani` VARCHAR(191) NULL,
    `tedavi` VARCHAR(191) NULL,
    `doktorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Randevu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hastaId` INTEGER NOT NULL,
    `doktorId` INTEGER NOT NULL,
    `tarih` DATETIME(3) NOT NULL,
    `durum` VARCHAR(191) NOT NULL,
    `notlar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teshis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(191) NOT NULL,
    `aciklama` VARCHAR(191) NULL,

    UNIQUE INDEX `Teshis_ad_key`(`ad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tetkik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `takipId` INTEGER NOT NULL,
    `tip` VARCHAR(191) NOT NULL,
    `sonuc` VARCHAR(191) NULL,
    `tarih` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Takip` ADD CONSTRAINT `Takip_hastaId_fkey` FOREIGN KEY (`hastaId`) REFERENCES `Hasta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Takip` ADD CONSTRAINT `Takip_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Randevu` ADD CONSTRAINT `Randevu_hastaId_fkey` FOREIGN KEY (`hastaId`) REFERENCES `Hasta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Randevu` ADD CONSTRAINT `Randevu_doktorId_fkey` FOREIGN KEY (`doktorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tetkik` ADD CONSTRAINT `Tetkik_takipId_fkey` FOREIGN KEY (`takipId`) REFERENCES `Takip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
