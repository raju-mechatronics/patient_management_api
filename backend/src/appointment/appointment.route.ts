import express, { Request, Response } from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAllAppointment,
  getAppointment,
  getAppointmentByDate,
  updateAppointment
} from './appointment.service';
import { Prisma } from '@prisma/client';

const appointmentRouter = express.Router();

appointmentRouter.get('/', async (req: Request, res: Response) => {
  const appointments = await getAllAppointment();
  res.json(appointments);
});
appointmentRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const appointment = await getAppointment(id);
  res.json(appointment);
});
appointmentRouter.post('/', async (req: Request, res: Response) => {
  const appointment: Prisma.AppointmentCreateInput = req.body;
  const createdAppointment = await createAppointment(appointment);
  res.json(createdAppointment);
});
appointmentRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deletedAppointment = await deleteAppointment(id);
  res.json(deletedAppointment);
});
appointmentRouter.patch('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const appointmentBody: Prisma.AppointmentUpdateInput = req.body;
  const updatedAppointment = await updateAppointment(id, appointmentBody);
  res.json(updatedAppointment);
});

appointmentRouter.get(
  '/:year/:month/:day?',
  async (req: Request, res: Response) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const day = parseInt(req.params.day) || 0;
    console.log(day, year, month);
    const appointments = await getAppointmentByDate(year, month, day);
    res.json(appointments);
  }
);

export { appointmentRouter };
