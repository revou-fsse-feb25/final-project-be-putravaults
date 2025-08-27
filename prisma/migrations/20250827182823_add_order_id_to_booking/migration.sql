/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."bookings" DROP COLUMN "totalAmount",
ADD COLUMN     "orderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_orderId_key" ON "public"."bookings"("orderId");
