import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

const createPatient = async (patient: Prisma.PatientCreateInput) => {
  const createdPatient = await prisma.patient.create({
    data: {
      ...patient
    }
  });
  return createdPatient;
};

const getAllPatient = async () => {
  const patients = prisma.patient.findMany();
  return patients;
};

const getPatient = async (patient_id: number) => {
  return await prisma.patient.findUnique({
    where: {
      id: patient_id
    },
    include: {
      Extra_Info: true,
      Payment: true
    }
  });
};

const updatePatient = async (
  patientId: number,
  patient: Prisma.PatientUpdateInput
) => {
  const updatedPatient = await prisma.patient.update({
    data: patient,
    where: {
      id: patientId
    }
  });
  return updatedPatient;
};

const deletePatient = async (patientId: number) => {
  const deleted = await prisma.patient.delete({
    where: {
      id: patientId
    }
  });
  return deleted;
};

export {
  createPatient,
  getAllPatient,
  updatePatient,
  deletePatient,
  getPatient
};
