// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category, { CATEGORY } from '../models/Category';

interface CreateTransactionServiceDTO {
  title: string;
  value: number;
  type: CATEGORY.INCOME | CATEGORY.OUTCOME;
  category: 'string';
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionServiceDTO): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let transactionCategory;

    transactionCategory = await categoryRepository.findOne({
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
