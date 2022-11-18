import express, { Request, Response } from 'express';
import {
  addpayment,
  deletePayment,
  editPayment,
  getPaymentList,
  getTotalPayment
} from './payment.service';

const paymentRoute = express.Router();

paymentRoute.get('/:patientId', async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.patientId);
  const payments = await getPaymentList(patientId);
  res.json(payments);
});

paymentRoute.get(
  '/totalPayment/:patientId',
  async (req: Request, res: Response) => {
    const patientId = parseInt(req.params.patientId);

    const payments = await getTotalPayment(patientId);
    res.json(payments);
  }
);

paymentRoute.post('/', async (req: Request, res: Response) => {
  const { patientId, amount } = req.body;
  try {
    const payment = await addpayment(parseInt(patientId), parseFloat(amount));
    res.json(payment);
  } catch (err) {
    res.status(404).json({ created: false });
  }
});

paymentRoute.delete('/:paymentId', async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  try {
    const payment = await deletePayment(parseInt(paymentId));
    res.json({ deleted: true });
  } catch (err) {
    res.status(404).json({ deleted: false });
  }
});

paymentRoute.patch('/:paymentId', async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.paymentId);
  const amount = parseFloat(req.body.amount);
  try {
    const payment = await editPayment(paymentId, amount);
    res.json(payment);
  } catch (err) {
    res.status(404).json({ updated: false });
  }
});

export default paymentRoute;
