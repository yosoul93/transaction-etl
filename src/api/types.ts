export interface TransactionQuery {
  fromDate: string;
  toDate: string;
}

export interface Transaction {
  date: string;
  amount: string;
  description: string;
}

export interface TransactionResponseData {
  data: Transaction[];
}