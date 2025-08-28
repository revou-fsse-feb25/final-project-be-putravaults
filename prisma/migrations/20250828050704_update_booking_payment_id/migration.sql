/*
  Warnings:

  - You are about to drop the column `orderId` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."bookings_orderId_key";

-- AlterTable
ALTER TABLE "public"."bookings" DROP COLUMN "orderId",
ADD COLUMN     "paymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_paymentId_key" ON "public"."bookings"("paymentId");
