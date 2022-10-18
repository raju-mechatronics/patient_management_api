import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createColumn = async (name: string) => {
  const col = await prisma.extra_Info_Col.create({
    data: {
      name
    }
  });
  return col;
};

const deleteColumn = async (id: number) => {
  const deleted = await prisma.extra_Info_Col.delete({
    where: {
      id: id
    }
  });
  return deleted;
};

const updateColumn = async (id: number, name: string) => {
  const updated = await prisma.extra_Info_Col.update({
    where: {
      id: id
    },
    data: {
      name: name
    }
  });
  return updated;
};

const getExtraColumns = async () => {
  const cols = await prisma.extra_Info_Col.findMany();
  return cols;
};

export { deleteColumn, updateColumn, createColumn, getExtraColumns };
