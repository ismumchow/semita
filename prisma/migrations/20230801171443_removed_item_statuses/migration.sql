/*
  Warnings:

  - You are about to drop the `ItemStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemStatus" DROP CONSTRAINT "ItemStatus_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemStatus" DROP CONSTRAINT "ItemStatus_statusId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'not started';

-- DropTable
DROP TABLE "ItemStatus";
