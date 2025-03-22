/*
  Warnings:

  - You are about to drop the column `location` on the `property` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `property` DROP COLUMN `location`,
    ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
