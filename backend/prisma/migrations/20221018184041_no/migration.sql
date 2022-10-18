-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "date", "id", "patientId") SELECT "amount", "date", "id", "patientId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_Extra_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "extra_Info_ColId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Extra_Info_extra_Info_ColId_fkey" FOREIGN KEY ("extra_Info_ColId") REFERENCES "Extra_Info_Col" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Extra_Info_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Extra_Info" ("extra_Info_ColId", "id", "patientId", "value") SELECT "extra_Info_ColId", "id", "patientId", "value" FROM "Extra_Info";
DROP TABLE "Extra_Info";
ALTER TABLE "new_Extra_Info" RENAME TO "Extra_Info";
CREATE UNIQUE INDEX "Extra_Info_extra_Info_ColId_patientId_key" ON "Extra_Info"("extra_Info_ColId", "patientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
