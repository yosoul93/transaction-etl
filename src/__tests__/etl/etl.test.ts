import api from '../../api';
import { OUTPUT_PATH } from '../../config';
import { runETLProcess } from '../../etl';
import { writeTransactionsToCSV } from '../../etl/csvWriter';
import { TransactionQuery, TransactionResponseData } from '../../api/types';

jest.mock('../../api', () => ({
  transaction: {
    getTransactions: jest.fn(),
  },
}));
jest.mock('../../etl/csvWriter');

const mockedGetTransactions = api.transaction.getTransactions as jest.MockedFunction<typeof api.transaction.getTransactions>;
const mockedWriteTransactionsToCSV = writeTransactionsToCSV as jest.MockedFunction<typeof writeTransactionsToCSV>;

describe('ETL process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions and write to CSV', async () => {
    const mockTransactions: TransactionResponseData = {
      data: [
        { date: '15-09', amount: '100.00', description: 'Test transaction' }
      ]
    };
    mockedGetTransactions.mockResolvedValue(mockTransactions);

    const query: TransactionQuery = {
      fromDate: '2024-09-10',
      toDate: '2024-09-16'
    };
    
    await runETLProcess(query);

    expect(mockedGetTransactions).toHaveBeenCalledWith({ fromDate: '2024-09-10', toDate: '2024-09-16' });
    expect(mockedWriteTransactionsToCSV).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2024-15-09',
          amount: '100.00',
          description: 'Test transaction'
        })
      ]),
      expect.stringContaining(OUTPUT_PATH)
    );
  });

  it('should handle errors during the ETL process', async () => {
    mockedGetTransactions.mockRejectedValue(new Error('API error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const query: TransactionQuery = {
      fromDate: '2024-09-10',
      toDate: '2024-09-16'
    };

    await runETLProcess(query);

    expect(consoleSpy).toHaveBeenCalledWith('Error during ETL process:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});