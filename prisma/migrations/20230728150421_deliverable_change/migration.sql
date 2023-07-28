/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Deliverable` will be added. If there are existing duplicate values, this will fail.
  - Made the column `creatorId` on table `Deliverable` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_creatorId_fkey";

-- AlterTable
ALTER TABLE "Deliverable" ALTER COLUMN "creatorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deliverable_name_key" ON "Deliverable"("name");

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
