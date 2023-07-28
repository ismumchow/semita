/*
  Warnings:

  - You are about to drop the column `statusId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_statusId_fkey";

-- DropIndex
DROP INDEX "Item_statusId_key";

-- DropIndex
DROP INDEX "Status_name_key";

-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "statusId";

-- CreateTable
CREATE TABLE "ItemStatus" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,

    CONSTRAINT "ItemStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemStatus_itemId_statusId_key" ON "ItemStatus"("itemId", "statusId");

-- AddForeignKey
ALTER TABLE "ItemStatus" ADD CONSTRAINT "ItemStatus_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStatus" ADD CONSTRAINT "ItemStatus_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
