import fs from 'fs';
import path from 'path';
import api from '../api';
import { Transaction, TransactionQuery } from '../api/types';
import { OUTPUT_PATH } from '../config';
import { writeTransactionsToCSV } from './csvWriter'

export async function runETLProcess(query: TransactionQuery) {
  try {
    console.log(`Fetching transactions from ${query.fromDate} to ${query.toDate}...`);
    const response = await api.transaction.getTransactions(query);

    console.log(`Processing ${response.data.length} transactions...`);
    const processedTransactions = response.data.map((transaction: Transaction) => {
      const year = new Date(query.fromDate).getFullYear();
      return {
        date: `${year}-${transaction.date}`,
        amount: transaction.amount.replace(',', ''),
        description: transaction.description
      };
    });
    
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    console.log(`Writing transactions to ${OUTPUT_PATH}...`);
    await writeTransactionsToCSV(processedTransactions, OUTPUT_PATH);
    console.log('ETL process completed successfully!');
  } catch (error) {
    console.error('Error during ETL process:', error);
  }
}