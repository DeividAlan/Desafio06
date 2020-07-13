import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const ttIncome = transactions.reduce((total, next) => {
      if (next.type === 'income') {
        return total + Number(next.value);
      }
      return total + 0;
    }, 0);

    const ttOutcome = transactions.reduce((total, next) => {
      if (next.type === 'outcome') {
        return total + Number(next.value);
      }
      return total + 0;
    }, 0);

    const balance: Balance = {
      income: ttIncome,
      outcome: ttOutcome,
      total: ttIncome - ttOutcome,
    };

    return balance;
  }

  public async getTransactionCategory(): Promise<Transaction[]> {
    const transactions = await this.find({
      relations: ['category'],
      select: [
        'id',
        'title',
        'value',
        'type',
        'category',
        'created_at',
        'updated_at',
      ],
    });

    return transactions;
  }
}

export default TransactionsRepository;
