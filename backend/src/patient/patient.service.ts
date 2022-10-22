import { Patient } from './../../interfaces/prismaTypes';
import { PrismaClient, Prisma, Extra_Info_Col } from '@prisma/client';
import { getExtraColumns, mapColNameWithID } from '../extra_column/col.service';
const prisma = new PrismaClient();

//create a patient
//take a patinet input and the extra in which the extra is a object that save extra column name and value {"colname": "value"}
const createPatient = async (
  patient: Prisma.PatientCreateInput,
  extra: { [p: string]: string } = {}
) => {
  //extra column name
  const extraCols = Object.keys(extra);
  //map extra column name to its id and validate that if the column exist
  const validated = await mapColNameWithID(extraCols);
  //now create a object of extra column field
  const validatedExtraInfo = validated
    .map((e, i) => {
      if (e)
        return {
          extra_Info_ColId: e,
          value: extra[extraCols[i]]
        };
      else return null;
    })
    .filter((e) => e && e.value);
  console.log(validatedExtraInfo);
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
  return await getPatient(createdPatient.id);
};

const getAllPatient = async (page: number | null = null, perPage = 10) => {
  const patients = await prisma.patient.findMany({
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
    },
    take: page ? perPage : 9999999999999,
    skip: page ? (page - 1) * perPage : 0
  });
  const allCols = await getExtraColumns();
  console.log(patients);
  return await Promise.all(
    patients.map((e) => normalizeExtraInfo(e as Patient, allCols))
  );
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
  const normalizedPatient = await normalizeExtraInfo(patient as Patient);
  return normalizedPatient;
};

const updatePatient = async (
  patientId: number,
  patient: Prisma.PatientUpdateInput
) => {
  console.log(patient);
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

async function normalizeExtraInfo(
  patient: Patient,
  allCols: Extra_Info_Col[] | null = null
) {
  const extra_info = patient?.Extra_Info;
  if (allCols == null) allCols = await getExtraColumns();
  const allColNameValue = allCols
    .map((e) => e.name)
    .reduce((prev: { [p: string]: string }, curr) => {
      prev[curr] = '';
      return prev;
    }, {});
  const normalized_extra: { [p: string]: string } = {};
  if (extra_info) {
    extra_info.forEach((e) => (normalized_extra[e.column.name] = e.value));
    (patient as any)['Extra_Info'] = {
      ...allColNameValue,
      ...normalized_extra
    };
    return patient;
  } else {
    return patient;
  }
}

export {
  createPatient,
  getAllPatient,
  updatePatient,
  deletePatient,
  getPatient
};
