/*
  Warnings:

  - Added the required column `externalId` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "description" TEXT,
ADD COLUMN     "externalId" TEXT NOT NULL;
