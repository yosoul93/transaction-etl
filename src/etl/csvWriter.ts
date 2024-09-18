import { createObjectCsvWriter } from 'csv-writer';
import { Transaction } from '../api/types';

export async function writeTransactionsToCSV(transactions: Transaction[], outputPath: string): Promise<void> {
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'date', title: 'Date' },
      { id: 'amount', title: 'Amount' },
      { id: 'description', title: 'Description' }
    ]
  });

  await csvWriter.writeRecords(transactions);
}