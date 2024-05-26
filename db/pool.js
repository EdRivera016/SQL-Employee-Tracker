// Import the 'pg' module to interact with PostgreSQL databases
const { Pool } = require('pg');
// Load environment variables from a .env file into process.env
require('dotenv').config();

// Log the database connection configuration for debugging purposes
console.log({
  user: process.env.PGUSER, // PostgreSQL user
  host: process.env.PGHOST, // PostgreSQL server host
  database: process.env.PGDATABASE, // Name of the PostgreSQL database
  password: process.env.PGPASSWORD, // Password for the PostgreSQL user
  port: process.env.PGPORT, // Port on which PostgreSQL server is running
});

// Create a new instance of Pool to manage PostgreSQL connections
const pool = new Pool({
  user: process.env.PGUSER, // PostgreSQL user
  host: process.env.PGHOST, // PostgreSQL server host
  database: process.env.PGDATABASE, // Name of the PostgreSQL database
  password: process.env.PGPASSWORD, // Password for the PostgreSQL user
  port: process.env.PGPORT,  // Port on which PostgreSQL server is running
});

// Export the pool instance to be used in other parts of the application
module.exports = pool;
