import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { CATEGORY } from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
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
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
