import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addpayment = async (patientId: number, amount: number) => {
  const payment = await prisma.payment.create({
    data: {
      amount: amount,
      patientId: patientId
    }
  });
  return payment;
};

export const getTotalPayment = async (patientId: number) => {
  const sumobj = await prisma.payment.aggregate({
    where: {
      patientId: patientId
    },
    _sum: {
      amount: true
    }
  });
  return sumobj._sum.amount;
};

export const editPayment = async (paymentId: number, amount: number) => {
  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: { amount: amount }
  });
  return updated;
};

export const deletePayment = async (paymentId: number) => {
  const deleted = await prisma.payment.delete({
    where: { id: paymentId }
  });
  return deleted;
};

export const getPaymentList = async (patientId: number) => {
  const list = await prisma.payment.findMany({
    where: {
      patientId: patientId
    }
  });
  return list;
};
