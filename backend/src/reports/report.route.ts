import express, { Request, Response } from 'express';
import { patientsGraph } from './patient.service';
import {
  appointmentCompareGraph,
  appointmentGraph
} from './appointment.service';
import { appointmentType } from '../appointment/appointment.service';
import { paymentGraph } from './payment.service';

const reportRoute = express.Router();

reportRoute.get('/patient', async (req: Request, res: Response) => {
  const query = req.query;
  console.log(query);
  const data = await patientsGraph(
    query.period as 'day' | 'month' | 'year' | 'week',
    !!query.compare
  );
  res.json(data);
});

reportRoute.get('/appointment', async (req: Request, res: Response) => {
  const query = req.query;
  console.log(query);
  const data = await appointmentGraph(
    query.period as 'day' | 'month' | 'year' | 'week',
    query.type ? (query.type as appointmentType) : null
  );
  res.json(data);
});

reportRoute.get('/appointmentCompare', async (req: Request, res: Response) => {
  const query = req.query;
  console.log(query);
  const data = await appointmentCompareGraph(
    query.period as 'day' | 'month' | 'year' | 'week',
    !!query.compare,
    query.type ? (query.type as appointmentType) : null
  );
  res.json(data);
});

reportRoute.get('/payment', async (req: Request, res: Response) => {
  const query = req.query;
  console.log(query);
  const data = await paymentGraph(
    query.period as 'day' | 'month' | 'year' | 'week',
    !!query.compare
  );
  res.json(data);
});

export default reportRoute;
