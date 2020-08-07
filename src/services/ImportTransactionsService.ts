import loadCsv from '../configs/csvParse';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';
import { CATEGORY } from '../models/Category';
import AppError from '../errors/AppError';
import APP_ERRORS from '../errors/types';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const records = await loadCsv(filename);
    try {
      const createTransaction = new CreateTransactionService();
      const transactions: Transaction[] = [];
      for (let i = 0; records.length >= i; i += 1) {
        const transaction = await createTransaction.execute({ // eslint-disable-line
          title: records[i][0],
          type: records[i][1] as CATEGORY,
          value: parseFloat(records[i][2]),
          category: records[i][3],
        });
        transactions.push(transaction);
      }

      return transactions;
    } catch (error) {
      throw new AppError(
        'Coul did not create all transactions',
        APP_ERRORS.TRANSACTION_CREATED_FAILED,
      );
    }
  }
}

export default ImportTransactionsService;
