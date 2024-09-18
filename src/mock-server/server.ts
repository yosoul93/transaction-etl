import express from 'express';
import { Transaction, TransactionResponseData } from '../api/types';

export const app = express();
const PORT = 3000;

const mockData: Transaction[] = (() => {

  const getRandomFormattedDate = (): string => {
    const start = new Date(new Date().getFullYear() - 3, 0, 1); // 3 years ago
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };
  
  const descriptions = [
    'Grocery shopping', 'Utility bill', 'Salary deposit', 'Restaurant meal',
    'Online purchase', 'Fuel', 'Movie tickets', 'Subscription fee',
    'Healthcare expense', 'Home repair', 'Gift purchase', 'Travel booking'
  ];

  // Generate 10,000 transactions
  return Array.from({ length: 10000 }, () => ({
    date: getRandomFormattedDate(),
    amount: (Math.random() * 10000).toLocaleString(),
    description: descriptions[Math.floor(Math.random() * descriptions.length)]
  }));
})();

app.get('/transactions', (req, res) => {
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: 'Missing date parameters' });
  }

  // Parse dates
  const from = new Date(fromDate as string);
  const to = new Date(toDate as string);

  // Error handling for invalid date formats
  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Error handling for date range that's too large (more than 31 days)
  const daysDifference = (to.getTime() - from.getTime()) / (1000 * 3600 * 24);
  if (daysDifference > 31) {
    return res.status(400).json({ error: 'Date range too large. Maximum range is 31 days.' });
  }

  // Filter transactions based on date range
  const filteredData = mockData.filter(transaction => {
    const [day, month] = transaction.date.split('-').map(Number);
    const year = from.getFullYear(); // Assume the year of fromDate
    const transactionDate = new Date(year, month - 1, day);
    
    // Adjust for year boundary
    if (transactionDate > to) {
      transactionDate.setFullYear(year - 1);
    }

    return transactionDate >= from && transactionDate <= to;
  });

  const response: TransactionResponseData = { data: filteredData };
  res.json(response);
});

// Export a function to start the server
export function startServer() {
  return app.listen(PORT, () => {
    console.log(`Mock API is running on http://localhost:${PORT}`);
    console.log(`Generated ${mockData.length} mock transactions`);
  });
}

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}