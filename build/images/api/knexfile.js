require('dotenv').config(); // Load environment variables from the .env file

module.exports = {
  // Configuration for the development environment
  development: {
    client: 'pg', // Use PostgreSQL as the database client
    connection: {
      host: process.env.DB_HOST, // Hostname of the database server
      user: process.env.DB_USER, // Username for the database
      password: process.env.DB_PASSWORD, // Password for the database
      database: process.env.DB_NAME // Database name
    },
    migrations: {
      directory: './src/migrations' // Directory where migration files are stored
    }
  },

  // Configuration for the staging environment
  staging: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2, // Minimum number of connections in the pool
      max: 10 // Maximum number of connections in the pool
    },
    migrations: {
      directory: './src/migrations'
    }
  },

  // Configuration for the production environment
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/migrations'
    }
  },

  // Configuration for the test environment
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST, // Hostname for the test database
      user: process.env.DB_USER, // Username for the test database
      password: process.env.DB_PASSWORD, // Password for the test database
      database: process.env.DB_NAME_TEST // Name of the test database
    },
    migrations: {
      directory: './src/migrations' // Directory for migration files
    }  
  }
};
