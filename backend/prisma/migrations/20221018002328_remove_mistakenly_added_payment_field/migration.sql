/*
  Warnings:

  - You are about to drop the column `payment` on the `Patient` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "paymentId" INTEGER NOT NULL
);
INSERT INTO "new_Patient" ("date", "description", "id", "name", "paymentId", "phone_number") SELECT "date", "description", "id", "name", "paymentId", "phone_number" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_phone_number_key" ON "Patient"("phone_number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
