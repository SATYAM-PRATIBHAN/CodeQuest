/*
  Warnings:

  - You are about to drop the column `starterCode` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "starterCode",
ADD COLUMN     "starterCodeJS" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "starterCodePY" TEXT NOT NULL DEFAULT '';
