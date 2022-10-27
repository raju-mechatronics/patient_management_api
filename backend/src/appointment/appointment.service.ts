import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export enum appointmentType {
  'newReservations' = 'New reservations',
  'surgeries' = 'Surgeries',
  'patientsCheckup' = 'Patients checkup'
}

async function initAppointmentType() {
  const count = await prisma.appointment_Type.count();
  console.log(count);
  if (count !== 3) {
    await prisma.appointment_Type.deleteMany();
    await Promise.all([
      prisma.appointment_Type.create({
        data: {
          name: 'New reservations'
        }
      }),
      prisma.appointment_Type.create({
        data: {
          name: 'Surgeries'
        }
      }),
      prisma.appointment_Type.create({
        data: {
          name: 'Patients checkup'
        }
      })
    ]);
  }
}

initAppointmentType();

export async function createAppointment(
  appointment: Prisma.AppointmentCreateInput
) {
  return await prisma.appointment.create({
    data: appointment
  });
}

export async function getAppointment(id: number) {
  return await prisma.appointment.findUnique({
    where: {
      id: id
    }
  });
}

export async function getAllAppointment() {
  return await prisma.appointment.findMany();
}

export async function getAllAppointmentOfType(type: string) {
  return await prisma.appointment.findMany({ where: { name: type } });
}

export async function deleteAppointment(id: number) {
  return await prisma.appointment.delete({ where: { id: id } });
}

export async function updateAppointment(
  id: number,
  appointment: Prisma.AppointmentUpdateInput
) {
  return await prisma.appointment.update({
    where: { id: id },
    data: appointment
  });
}
