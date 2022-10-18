import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

const fieldEntry = async (data: {
  value: string;
  extra_Info_ColId: number;
  patientId: number;
}) => {
  const col = await prisma.extra_Info.create({
    data: data
  });
  return col;
};

const updateField = async (id: number, value: string) => {
  const updated = await prisma.extra_Info.update({
    where: {
      id: id
    },
    data: {
      value: value
    }
  });
  return updated;
};

export { fieldEntry, updateField };
