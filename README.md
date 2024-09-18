# Transaction ETL

This project is an ETL (Extract, Transform, Load) script for fetching transaction data, transforming it, and writing it to a CSV file.

## Features

- Fetches transaction data from an API
- Processes and transforms the data
- Writes the transformed data to a CSV file
- Include a mock server for testing
- Include tests for the ETL script and server

## Project Structure

project-root/
├── src/
│   ├── api/
│   │   ├── fetchApi/
│   │   │   ├── index.ts
│   │   │   ├── request.ts
│   │   │   ├── RequestHandler.ts
│   │   │   └── types.ts
│   │   ├── index.ts
│   │   ├── transaction.ts
│   │   └── types.ts
│   ├── etl/
│   │   ├── csvWriter.ts
│   │   └── index.ts
│   ├── mock-server/
│   │   └── server.ts
│   ├── __tests__/
│   │   ├── api/
│   │   │   └── fetchApi.test.ts
│   │   ├── etl/
│   │   │   ├── csvWriter.test.ts
│   │   │   └── etl.test.ts
│   │   └── mock-server/
│   │       └── server.test.ts
│   ├── config.ts
│   └── index.ts
├── data/
│   └── output.csv
├── .env
├── .env.test
├── .gitignore
├── jest.config.js
├── jest.setup.ts
├── package.json
├── tsconfig.json
└── README.md

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd transaction-etl
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add:
   ```
   API_BASE_URL=http://localhost:3000
   OUTPUT_PATH=./data/output.csv
   ```

4. Create a `.env.test` file for testing:
   ```
   API_BASE_URL=http://localhost:3000
   OUTPUT_PATH=./data/test-output.csv
   ```

## Running the Project

The project consists of two main parts: the mock server and the ETL script.

### Starting the Mock Server

The mock server simulates the API that provides transaction data.

1. Open a terminal in the project root directory.
2. Run the following command:
   ```
   npm run start:mock
   ```
3. The server will start on `http://localhost:3000`.

### Running the ETL Script

The ETL script fetches data from the mock server, processes it, and outputs a CSV file.

1. Open a new terminal in the project root directory.
2. Run the following command:
   ```
   npm run start:etl
   ```
3. The script will generate an `data/output.csv` file in the project root.

## Configuration

- To change the date range for transaction fetching, modify the `fromDate` and `toDate` constants in `src/index.ts`.
- The mock server generates 10,000 random transactions by default. To change this, modify the `generateMockData` function call in `src/mock-server/server.ts`.

## Testing

Tests are organized in the `src/__tests__` directory, mirroring the structure of the source code:

- `api/`: Contains tests for the API calls
- `etl/`: Contains tests for the ETL process components
- `mock-server/`: Contains tests for the mock server

To run tests:

1. Open a terminal in the project root directory.
2. Run the following command:
   ```
   npm run test
   ```

## Scripts

- `npm run start:mock`: Start the mock server
- `npm run start:etl`: Run the ETL script
- `npm run build`: Compile TypeScript to JavaScript
- `npm run test`: Run tests

## Project Structure

- `src/etl/csvWriter.ts`: Handles writing processed data to CSV.
- `src/api/fetchApi`: Handles API requests with retry logic and error handling
  - `index.ts`: Main entry point for the fetchApi module
  - `request.ts`: Implements the request function
  - `RequestHandler.ts`: Implements the RequestHandler class for managing retries and error handling
  - `types.ts`: Defines types used in the fetchApi module
- `src/etl/index.ts`: Main ETL script that orchestrates the data processing.
- `src/index.ts`: Main entry point
- `src/mock-server/server.ts`: Implements the mock API server.
- `src/__tests__/api/fetchApi.test.ts`: Tests for API requests with retry logic
- `src/__tests__/etl/csvWriter.test.ts`: Tests for CSV writing functionality.
- `src/__tests__/etl/index.test.ts`: Tests for main ETL process.
- `src/__tests__/mock-server/server.test.ts`: Tests for mock server functionality.

## Error Handling

- The mock server returns a 400 error for date ranges exceeding 30 days.
- The ETL script includes basic error handling and logging.

## Dependencies

- axios: HTTP client
- csv-writer: CSV file writing
- dotenv: Environment variable management
- express: Mock server framework

## License

MIT