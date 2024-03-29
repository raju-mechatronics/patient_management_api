import { Patient } from '../../generate';
import { Extra_Info_Col, Prisma, PrismaClient } from '@prisma/client';
import {
  createColumn,
  getExtraColumns,
  mapColNameWithID
} from '../extra_column/col.service';
import { getTotalPayment } from '../payment/payment.service';

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
  const validatedExtraInfo = (
    await Promise.all(
      validated.map(async (e, i) => {
        if (e)
          return {
            extra_Info_ColId: e,
            value: extra[extraCols[i]]
          };
        else {
          const col = await createColumn(extraCols[i]);
          return {
            extra_Info_ColId: col.id,
            value: extra[extraCols[i]]
          };
        }
      })
    )
  ).filter((e) => e && e.value);
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

const getPatientAt = async ({
  year,
  month,
  day
}: {
  year: number;
  month: number;
  day: number;
}) => {
  if (month === 0) {
    return await prisma.patient.findMany({
      where: {
        created_at: {
          gt: new Date(year, 0, 0),
          lt: new Date(year + 1, 0)
        }
      }
    });
  }
  if (day === 0) {
    return await prisma.patient.findMany({
      where: {
        created_at: {
          gt: new Date(year, month - 1),
          lte: new Date(year, month)
        }
      }
    });
  } else {
    return await prisma.patient.findMany({
      where: {
        created_at: {
          gte: new Date(year, month - 1, day, 0, 0, 0),
          lt: new Date(year, month - 1, day, 23, 59, 59)
        }
      }
    });
  }
};

const getAllPatient = async (
  page: number | null = null,
  order: 'asc' | 'desc' = 'asc',
  perPage: number | undefined = 10
) => {
  const patients = await prisma.patient.findMany({
    orderBy: {
      created_at: order
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
      Payment: true
    },
    take: page ? perPage : 9999999999999,
    skip: page ? (page - 1) * perPage : 0
  });
  const allCols = await getExtraColumns();
  const patientAll = await Promise.all(
    patients.map((e) => normalizeExtraInfo(e as Patient, allCols))
  );
  const count = await prisma.patient.count();
  return { patients: patientAll, count };
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
      Payment: true
    }
  });
  const normalizedPatient = await normalizeExtraInfo(patient as Patient);
  // @ts-ignore
  normalizedPatient['total payment'] = await getTotalPayment(patient_id);
  return normalizedPatient;
};

const updatePatient = async (
  patientId: number,
  patient: Prisma.PatientUpdateInput
) => {
  console.log(patient);
  const updatedPatient = await prisma.patient.update({
    data: {
      ...patient
    },
    where: {
      id: patientId
    }
  });
  return updatedPatient;
};

const putPatient = async (
  patientId: number,
  patient: Prisma.PatientCreateInput,
  extra: { [p: string]: string } = {}
) => {
  const deleted = await prisma.extra_Info.deleteMany({
    where: {
      patientId: patientId
    }
  });
  console.log(deleted);
  //extra column name
  const extraCols = Object.keys(extra);
  //map extra column name to its id and validate that if the column exist
  const validated = await mapColNameWithID(extraCols);
  //now create a object of extra column field
  const validatedExtraInfo = (
    await Promise.all(
      validated.map(async (e, i) => {
        if (e)
          return {
            extra_Info_ColId: e,
            value: extra[extraCols[i]]
          };
        else {
          const col = await createColumn(extraCols[i]);
          return {
            extra_Info_ColId: col.id,
            value: extra[extraCols[i]]
          };
        }
      })
    )
  ).filter((e) => e && e.value);
  console.log(validatedExtraInfo);
  const createdPatient = await prisma.patient.update({
    where: {
      id: patientId
    },
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

async function searchPatients(name: string) {
  const patients = await prisma.patient.findMany({
    where: {
      name: {
        contains: name
      }
    }
  });
  return patients;
}

export {
  createPatient,
  getAllPatient,
  updatePatient,
  deletePatient,
  getPatient,
  putPatient,
  searchPatients,
  getPatientAt
};
