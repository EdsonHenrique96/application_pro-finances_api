import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import { CATEGORY } from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === CATEGORY.INCOME) {
          acc.income += transaction.value;
          acc.total += transaction.value;
        }
        if (transaction.type === CATEGORY.OUTCOME) {
          acc.outcome += transaction.value;
          acc.total -= transaction.value;
        }

        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    // parse total to 2 decimal places
    balance.total = parseFloat(balance.total.toFixed(2));

    return balance;
  }
}

export default TransactionsRepository;
