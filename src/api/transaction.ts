import fetchApi from './fetchApi';
import { TransactionResponseData, TransactionQuery } from './types';

export default {
  getTransactions: (query: TransactionQuery): Promise<TransactionResponseData> =>
    fetchApi({
      url: '/transactions',
      params: { ...query },
    })
};