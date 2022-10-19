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

export async function mapColNameWithID(colName: string | string[]) {
  const cols = await getExtraColumns();
  if (typeof colName === 'string') colName = [colName];
  return cols
    .map((id) => cols.filter((e) => e.name == colName)[0])
    .map((e) => (e ? e.id : null));
}

export async function mapColIdWithName(colId: number | number[]) {
  const cols = await getExtraColumns();
  if (typeof colId === 'number') colId = [colId];
  return colId
    .map((id) => cols.filter((e) => e.id == id)[0])
    .map((e) => (e ? e.name : null));
}

export { deleteColumn, updateColumn, createColumn, getExtraColumns };
