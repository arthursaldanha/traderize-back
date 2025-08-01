/*
  Warnings:

  - You are about to drop the column `strategyId` on the `journals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "journals" DROP CONSTRAINT "journals_strategyId_fkey";

-- DropIndex
DROP INDEX "journals_accountId_strategyId_idx";

-- AlterTable
ALTER TABLE "journals" DROP COLUMN "strategyId";

-- CreateTable
CREATE TABLE "_JournalStrategies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JournalStrategies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JournalStrategies_B_index" ON "_JournalStrategies"("B");

-- AddForeignKey
ALTER TABLE "_JournalStrategies" ADD CONSTRAINT "_JournalStrategies_A_fkey" FOREIGN KEY ("A") REFERENCES "journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalStrategies" ADD CONSTRAINT "_JournalStrategies_B_fkey" FOREIGN KEY ("B") REFERENCES "strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
