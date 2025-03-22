/*
  Warnings:

  - Added the required column `status` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `status` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `property` ADD COLUMN `status` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` INTEGER NOT NULL;
