import { TransactionQuery } from './api/types';
import { validateEnv } from './config';
import { runETLProcess } from './etl';

validateEnv();

const query: TransactionQuery = {
  fromDate: '2024-09-10',
  toDate: '2024-09-16'
};

runETLProcess(query);