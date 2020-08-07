// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionCustomRepository from '../repositories/TransactionsRepository';
import Category, { CATEGORY } from '../models/Category';
import AppError from '../errors/AppError';
import APP_ERRORS from '../errors/types';

interface CreateTransactionServiceDTO {
  title: string;
  value: number;
  type: CATEGORY.INCOME | CATEGORY.OUTCOME;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionServiceDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(
      TransactionCustomRepository,
    );
    const categoryRepository = getRepository(Category);

    if (type === CATEGORY.OUTCOME) {
      const balance = await transactionRepository.getBalance();
      if (balance.total - value < 0) {
        throw new AppError(
          'insufficient funds',
          APP_ERRORS.INSUFFICIENTS_FUNDS,
        );
      }
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(transactionCategory);
    }

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });
    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
