/*
  Warnings:

  - You are about to drop the column `point_owned` on the `Reward` table. All the data in the column will be lost.
  - Added the required column `point_transaction` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "point_owned",
ADD COLUMN     "point_transaction" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "point_transaction" INTEGER NOT NULL DEFAULT 0;
