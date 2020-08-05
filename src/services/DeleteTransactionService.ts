// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transactionExists = await transactionRepository.findOne(id);

    if (!transactionExists) {
      throw new Error(`Transaction ${id} does not exist.`);
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
