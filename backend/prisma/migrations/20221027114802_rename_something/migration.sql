/*
  Warnings:

  - You are about to drop the column `appointment_Type_Name` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `Type_Name` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Type_Name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "appointment_at" DATETIME NOT NULL,
    CONSTRAINT "Appointment_Type_Name_fkey" FOREIGN KEY ("Type_Name") REFERENCES "Appointment_Type" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("appointment_at", "description", "id", "name", "phone_number") SELECT "appointment_at", "description", "id", "name", "phone_number" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
