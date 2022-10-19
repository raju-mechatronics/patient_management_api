import { PrismaClient, Prisma } from '@prisma/client';
import { getExtraColumns, mapColNameWithID } from '../extra_column/col.service';
const prisma = new PrismaClient();

const createPatient = async (
  patient: Prisma.PatientCreateInput,
  extra: { [p: string]: string } = {}
) => {
  const extraCols = Object.keys(extra);
  const validated = await mapColNameWithID(extraCols);
  const validatedExtraInfo = validated
    .map((e, i) => {
      if (e)
        return {
          extra_Info_ColId: e,
          value: extra[extraCols[i]]
        };
      else return null;
    })
    .filter((e) => e && !!e.value);

  const createdPatient = await prisma.patient.create({
    data: {
      ...patient,
      Extra_Info: {
        create: validatedExtraInfo as {
          extra_Info_ColId: number;
          value: string;
        }[]
      }
    }
  });
  const id = createdPatient.id;

  return createdPatient;
};

const getAllPatient = async () => {
  const patients = prisma.patient.findMany();
  return patients;
};

const getPatient = async (patient_id: number) => {
  const patient = await prisma.patient.findUnique({
    where: {
      id: patient_id
    },
    include: {
      Extra_Info: {
        select: {
          column: {
            select: {
              name: true
            }
          },
          value: true
        }
      },
      Payment: {
        select: {
          amount: true
        }
      }
    }
  });
  const extra_info = patient?.Extra_Info;
  const allCols = (await getExtraColumns())
    .map((e) => e.name)
    .reduce((prev: { [p: string]: string }, curr) => {
      prev[curr] = '';
      return prev;
    }, {});
  const normalized_extra: { [p: string]: string } = {};
  if (extra_info) {
    extra_info.forEach((e) => (normalized_extra[e.column.name] = e.value));
    (patient as any)['Extra_Info'] = {
      ...allCols,
      ...normalized_extra
    };
    return patient;
  } else {
    return patient;
  }
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
