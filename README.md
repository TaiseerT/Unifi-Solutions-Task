# Unifi-Solutions-Task
Unifi Solutions Backend Task

# Installation:

To install the project, follow these steps:

1. Clone the repository:
   git clone git@github.com:TaiseerT/Unifi-Solutions-Task.git
2. Navigate to the project directory:
   cd unifi-solutions-task
3. Install dependencies:
   npm install

# Configuration:

Create a .env file containing the following environment variables:
PORT = 4000
DB_URL = mongodb://localhost:27017/your-db-name
ACCESS_TOKEN = Generate a random access token using this command in your cli:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
DB_NAME = your-db-name

# Running the Server:

To start the server, run:
npx tsx src/index.ts

# API Endpoints

Refer to the Postman collection attached for detailed endpoint usage.

# Running the APIs:

To run the APIs, send requests to
http://localhost:4000/api/endpoint.

# Testing

A Postman collection is included for testing the APIs. Ensure to import it into your Postman application.

# Error Handling

Error responses and field validations are implemented to guide users through correct API usage.