/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'AUDITOR';

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "public"."Item"("name");
