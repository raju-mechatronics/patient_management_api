import { Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const appointmentRouter = express.Router();

appointmentRouter.get('/', (req: Request, res: Response) => {});
appointmentRouter.get('/:id', (req: Request, res: Response) => {});
appointmentRouter.post('/', (req: Request, res: Response) => {});
appointmentRouter.delete('/:id', (req: Request, res: Response) => {});
appointmentRouter.patch('/:id', (req: Request, res: Response) => {});

export { appointmentRouter };
