import express, { Request, Response } from 'express';
import {
  createPatient,
  deletePatient,
  getAllPatient,
  getPatient,
  updatePatient
} from './patient.service';

const patientRouter = express.Router();

patientRouter.get('/', async (req: Request, res: Response) => {
  const patients = await getAllPatient();
  res.json(patients);
});

patientRouter.post('/', async (req: Request, res: Response) => {
  const patientBody = req.body;
  console.log(patientBody);
  const patient = await createPatient(patientBody);
  console.log(patient);
  res.json(patient);
});

patientRouter.get('/:patientId', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.patientId);
  console.log(id);
  const patient = await getPatient(id);
  console.log(patient);
  res.json(patient);
});

patientRouter.delete('/:patientId', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.patientId);
  console.log(id);
  const patient = await deletePatient(id);
  console.log(patient);
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
