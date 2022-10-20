import { Extra_Info } from './../../interfaces/prismaTypes';
import { Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';
import {
  createPatient,
  deletePatient,
  getAllPatient,
  getPatient,
  updatePatient
} from './patient.service';

const patientRouter = express.Router();

//if pagination needed add query(page and perpage)
patientRouter.get('/', async (req: Request, res: Response) => {
  const { page, perpage } = req.query;
  const patients = await getAllPatient(
    parseInt(page as string),
    parseInt(perpage as string)
  );
  res.json(patients);
});

patientRouter.post('/', async (req: Request, res: Response) => {
  const patientBody = req.body;
  const PATIENT: Prisma.PatientCreateInput = {
    name: patientBody.name,
    date: patientBody.date || Date.now().toString(),
    description: patientBody.description,
    phone_number: patientBody.phone_number
  };
  const extra = patientBody.Extra_Info;
  const patient = await createPatient(PATIENT, extra);

  res.json(patient);
});

patientRouter.get('/:patientId', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.patientId);
  const patient = await getPatient(id);
  res.json(patient);
});

patientRouter.delete('/:patientId', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.patientId);
  const patient = await deletePatient(id);
  res.json(patient);
});

patientRouter.patch('/:patientId', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.patientId);
  const patientBody = req.body;
  console.log(id);
  const patient = await updatePatient(id, patientBody);
  console.log(patient);
  res.json(patient);
});

export { patientRouter };
