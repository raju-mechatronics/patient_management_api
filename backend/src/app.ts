import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '../config';
import { patientRouter } from './patient/patient.route';
import colRouter from './extra_column/col.route';
import extraFieldRouter from './extra_info/extraField.route';
import { appointmentRouter } from './appointment/appointment.route';
import './appointment/appointment.service';
import reportRoute from "./reports/report.route";

const app = express();
app.use(morgan('tiny'));

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  console.log('req');
  res.send('pong');
});

app.use('/patient', patientRouter);
app.use('/col', colRouter);
app.use('/extra', extraFieldRouter);
app.use('/appointment', appointmentRouter);
app.use('/report', reportRoute);

if (!config.isTestEnvironment) {
  app.listen(config.port);
  console.info('App is listening on port:', config.port);
}

export { app };
