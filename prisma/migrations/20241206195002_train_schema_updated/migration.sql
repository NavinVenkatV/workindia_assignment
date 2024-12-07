/*
  Warnings:

  - You are about to drop the column `number` on the `Train` table. All the data in the column will be lost.
  - The `createdAt` column on the `Train` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `updatedAt` on the `Train` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Train_id_key";

-- AlterTable
ALTER TABLE "Train" DROP COLUMN "number",
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
