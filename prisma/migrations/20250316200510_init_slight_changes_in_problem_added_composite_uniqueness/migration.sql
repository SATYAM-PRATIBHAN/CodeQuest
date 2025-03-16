/*
  Warnings:

  - A unique constraint covering the columns `[userId,problemId]` on the table `UserProblemStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProblemStatus_userId_problemId_key" ON "UserProblemStatus"("userId", "problemId");
