-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "payment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "paymentId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Extra_Info_Col" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Extra_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "extra_Info_ColId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Extra_Info_extra_Info_ColId_fkey" FOREIGN KEY ("extra_Info_ColId") REFERENCES "Extra_Info_Col" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Extra_Info_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_number_key" ON "Patient"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Extra_Info_Col_name_key" ON "Extra_Info_Col"("name");
