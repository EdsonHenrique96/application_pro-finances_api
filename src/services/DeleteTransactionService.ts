// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import APP_ERRORS from '../errors/types';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transactionExists = await transactionRepository.findOne(id);

    if (!transactionExists) {
      throw new AppError(
        `Transaction ${id} does not exist`,
        APP_ERRORS.TRANSACTION_NOT_FOUND,
      );
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
