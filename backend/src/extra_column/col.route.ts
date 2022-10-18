import express, { Request, Response } from 'express';
import {
  createColumn,
  deleteColumn,
  getExtraColumns,
  updateColumn
} from './col.service';

const colRouter = express.Router();

colRouter.get('/', async (req: Request, res: Response) => {
  const cols = await getExtraColumns();
  res.json(cols);
});

colRouter.post('/', async (req: Request, res: Response) => {
  const { name } = req.body;
  const col = await createColumn(name);
  res.json(col);
});

colRouter.patch('/:id', async (req: Request, res: Response) => {
  const { name } = req.body;
  const id = parseInt(req.params.id);
  const col = await updateColumn(id, name);
  res.json(col);
});

colRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const col = await deleteColumn(id);
  res.json(col);
});

export default colRouter;
