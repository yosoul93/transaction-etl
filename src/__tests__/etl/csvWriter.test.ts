import { createObjectCsvWriter } from 'csv-writer';
import { Transaction } from '../../api/types';
import { OUTPUT_PATH } from '../../config';
import { writeTransactionsToCSV } from '../../etl/csvWriter';

jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn().mockReturnValue({
    writeRecords: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('writeTransactionsToCSV', () => {
  const mockTransactions: Transaction[] = [
    { date: '15-09', amount: '100.00', description: 'Test transaction 1' },
    { date: '16-09', amount: '200.00', description: 'Test transaction 2' }
  ];

  it('should write transactions to CSV file', async () => {
    await writeTransactionsToCSV(mockTransactions, OUTPUT_PATH);

    expect(createObjectCsvWriter).toHaveBeenCalledWith({
      path: OUTPUT_PATH,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'amount', title: 'Amount' },
        { id: 'description', title: 'Description' }
      ]
    });

    expect(createObjectCsvWriter({} as any).writeRecords).toHaveBeenCalledWith(mockTransactions);
  });
});