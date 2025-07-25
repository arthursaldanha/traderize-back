/*
  Warnings:

  - The values [LONG,SHORT] on the enum `Direction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `asset` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `tradeDate` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the `class_managers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `journal_comments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,externalId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,externalTradeId]` on the table `journals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalTradeId` to the `journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeDateStart` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Direction_new" AS ENUM ('BUY', 'SELL');
ALTER TABLE "journals" ALTER COLUMN "direction" TYPE "Direction_new" USING ("direction"::text::"Direction_new");
ALTER TYPE "Direction" RENAME TO "Direction_old";
ALTER TYPE "Direction_new" RENAME TO "Direction";
DROP TYPE "Direction_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "class_managers" DROP CONSTRAINT "class_managers_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_managers" DROP CONSTRAINT "class_managers_userId_fkey";

-- DropForeignKey
ALTER TABLE "class_students" DROP CONSTRAINT "class_students_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_students" DROP CONSTRAINT "class_students_userId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_adminId_fkey";

-- DropForeignKey
ALTER TABLE "journal_comments" DROP CONSTRAINT "journal_comments_classId_fkey";

-- DropForeignKey
ALTER TABLE "journal_comments" DROP CONSTRAINT "journal_comments_tradeId_fkey";

-- DropForeignKey
ALTER TABLE "journal_comments" DROP CONSTRAINT "journal_comments_userId_fkey";

-- AlterTable
ALTER TABLE "journals" DROP COLUMN "asset",
DROP COLUMN "tradeDate",
ADD COLUMN     "commission" DECIMAL(65,30),
ADD COLUMN     "externalTradeId" TEXT NOT NULL,
ADD COLUMN     "fee" DECIMAL(65,30),
ADD COLUMN     "swap" DECIMAL(65,30),
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "timeDateEnd" TIMESTAMP(3),
ADD COLUMN     "timeDateStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "total" DECIMAL(65,30),
ADD COLUMN     "tradeDuration" INTEGER;

-- DropTable
DROP TABLE "class_managers";

-- DropTable
DROP TABLE "class_students";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "journal_comments";

-- CreateTable
CREATE TABLE "journal_detail_mt5" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "externalTradeId" TEXT NOT NULL,
    "ticket" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "comment" TEXT,
    "lots" DECIMAL(65,30) NOT NULL,
    "entryPrice" DECIMAL(65,30) NOT NULL,
    "stopPrice" DECIMAL(65,30) NOT NULL,
    "takePrice" DECIMAL(65,30) NOT NULL,
    "investment" DECIMAL(65,30) NOT NULL,
    "riskRewardRatio" DECIMAL(65,30) NOT NULL,
    "result" DECIMAL(65,30) NOT NULL,
    "commission" DECIMAL(65,30) NOT NULL,
    "swap" DECIMAL(65,30) NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "entry" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,
    "magic" INTEGER NOT NULL,

    CONSTRAINT "journal_detail_mt5_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journal_detail_mt5_accountId_idx" ON "journal_detail_mt5"("accountId");

-- CreateIndex
CREATE INDEX "journal_detail_mt5_externalTradeId_idx" ON "journal_detail_mt5"("externalTradeId");

-- CreateIndex
CREATE INDEX "journal_detail_mt5_accountId_externalTradeId_idx" ON "journal_detail_mt5"("accountId", "externalTradeId");

-- CreateIndex
CREATE INDEX "journal_detail_mt5_accountId_externalTradeId_ticket_idx" ON "journal_detail_mt5"("accountId", "externalTradeId", "ticket");

-- CreateIndex
CREATE INDEX "accounts_userId_externalId_idx" ON "accounts"("userId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_userId_externalId_key" ON "accounts"("userId", "externalId");

-- CreateIndex
CREATE INDEX "journals_accountId_idx" ON "journals"("accountId");

-- CreateIndex
CREATE INDEX "journals_accountId_strategyId_idx" ON "journals"("accountId", "strategyId");

-- CreateIndex
CREATE INDEX "journals_accountId_externalTradeId_idx" ON "journals"("accountId", "externalTradeId");

-- CreateIndex
CREATE INDEX "journals_accountId_symbol_idx" ON "journals"("accountId", "symbol");

-- CreateIndex
CREATE INDEX "journals_accountId_symbol_direction_idx" ON "journals"("accountId", "symbol", "direction");

-- CreateIndex
CREATE INDEX "journals_accountId_timeDateStart_timeDateEnd_idx" ON "journals"("accountId", "timeDateStart", "timeDateEnd");

-- CreateIndex
CREATE UNIQUE INDEX "journals_accountId_externalTradeId_key" ON "journals"("accountId", "externalTradeId");

-- AddForeignKey
ALTER TABLE "journal_detail_mt5" ADD CONSTRAINT "journal_detail_mt5_accountId_externalTradeId_fkey" FOREIGN KEY ("accountId", "externalTradeId") REFERENCES "journals"("accountId", "externalTradeId") ON DELETE RESTRICT ON UPDATE CASCADE;
