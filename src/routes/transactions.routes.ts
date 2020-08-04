import { Router } from 'express';
import CreateTransactionService from '../services/CreateTransactionService';
import { CATEGORY } from '../models/Category';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  if (!(type === CATEGORY.OUTCOME) && !(type === CATEGORY.INCOME)) {
    return response.status(400).json({
      error: `type must be ${CATEGORY.INCOME} or ${CATEGORY.OUTCOME}`,
    });
  }
  const transactionCreator = new CreateTransactionService();
  const createdTransaction = await transactionCreator.execute({
    title,
    value,
    type,
    category,
  });

  return response.status(201).json(createdTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
