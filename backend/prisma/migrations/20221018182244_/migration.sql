/*
  Warnings:

  - A unique constraint covering the columns `[extra_Info_ColId,patientId]` on the table `Extra_Info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Extra_Info_extra_Info_ColId_patientId_key" ON "Extra_Info"("extra_Info_ColId", "patientId");
