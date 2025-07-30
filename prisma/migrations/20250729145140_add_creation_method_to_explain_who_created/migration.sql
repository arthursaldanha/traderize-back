/*
  Warnings:

  - Added the required column `creationMethod` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreationMethod" AS ENUM ('MANUAL', 'AUTOMATION');

-- AlterTable
ALTER TABLE "journals" ADD COLUMN     "creationMethod" "CreationMethod" NOT NULL;
