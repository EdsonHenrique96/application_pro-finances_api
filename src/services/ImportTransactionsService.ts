import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getRepository, getCustomRepository } from 'typeorm';
import TransactionCustomRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category, { CATEGORY } from '../models/Category';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionsRecords: any[] = [];
    const categories: string[] = [];

    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(
      TransactionCustomRepository,
    );

    const csvFilePath = path.resolve(__dirname, `../../tmp/${filename}`);

    const parseCsvStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const readFileSteam = fs.createReadStream(csvFilePath);

    const csvStream = readFileSteam.pipe(parseCsvStream);

    csvStream.on('data', async line => {
      const [title, type, value, category] = line;

      if (!title || !type || !value || !category) return;

      transactionsRecords.push({ title, type, value, category });
      categories.push(category);
    });

    await new Promise(resolve => {
      csvStream.on('end', async () => {
        fs.unlink(csvFilePath, err => {
          if (err) {
            console.info(`could not delete csv file: ${filename}`);
          }

          resolve();
        });
      });
    });

    const notDuplicatedCategories = categories.filter(
      (category, index, self) => self.indexOf(category) === index,
    );

    const existentCategories = await categoryRepository.find({
      where: { title: notDuplicatedCategories },
    });

    const existentCategoriesTitle = existentCategories.map(
      category => category.title,
    );

    const notExistentCategoriesTitle = notDuplicatedCategories.filter(
      category => !existentCategoriesTitle.includes(category),
    );

    const newCategories = categoryRepository.create(
      notExistentCategoriesTitle.map(title => ({
        title,
      })),
    );

    await categoryRepository.save(newCategories);

    const allCategories = [...existentCategories, ...newCategories];

    const createdTransactions = transactionRepository.create(
      transactionsRecords.map(transaction => ({
        title: transaction.title,
        type: transaction.type as CATEGORY,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
