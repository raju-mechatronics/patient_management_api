import express, { Request, Response } from 'express';
import { fieldEntry, updateField } from './extraField.service';

const extraFieldRouter = express.Router();

extraFieldRouter.post('/', async (req: Request, res: Response) => {
  const fieldAttr = req.body;
  const field = await fieldEntry(fieldAttr);
  res.json(field);
});

extraFieldRouter.patch('/:id', async (req: Request, res: Response) => {
  const { value } = req.body;
  const id = parseInt(req.params.id);
  const field = await updateField(id, value);
  res.json(field);
});

export default extraFieldRouter;
