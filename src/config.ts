import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export configuration variables
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
export const OUTPUT_PATH = process.env.OUTPUT_PATH || './data/output.csv';

// You can also add a function to validate required env variables
export function validateEnv() {
  const required = ['API_BASE_URL', 'OUTPUT_PATH'];
  for (const name of required) {
    if (!process.env[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
}