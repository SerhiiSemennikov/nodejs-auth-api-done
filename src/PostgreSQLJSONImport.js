/**
 * Transfer JSON file data into a PostgreSQL table
 * Requires: npm install pg
 */
import 'dotenv/config';
import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST, // DB host
  port: process.env.POSTGRES_PORT, // Default PostgreSQL port
  user: process.env.POSTGRES_USER, // DB username
  password: process.env.POSTGRES_PASSWORD, // DB password
  database: process.env.POSTGRES_DB, // DB name
});

async function importJsonToPostgres(jsonFilePath) {
  try {
    // 1. Read and parse JSON file
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`File not found: ${jsonFilePath}`);
    }
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    let jsonData;
    try {
      jsonData = JSON.parse(rawData);
    } catch (err) {
      throw new Error('Invalid JSON format.');
    }

    // 2. Connect to PostgreSQL
    await client.connect();

    // 3. Ensure table exists (example table with JSONB column)
    await client.query(`
      CREATE TABLE IF NOT EXISTS my_table (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    // 4. Insert JSON data
    // If jsonData is an array, insert each item
    if (Array.isArray(jsonData)) {
      for (const item of jsonData) {
        await client.query('INSERT INTO my_table (data) VALUES ($1)', [item]);
      }
    } else {
      // Single JSON object
      await client.query('INSERT INTO my_table (data) VALUES ($1)', [jsonData]);
    }

    console.log('✅ JSON data successfully imported into PostgreSQL.');
  } catch (err) {
    console.error('❌ Error importing JSON:', err.message);
  } finally {
    // 5. Close connection
    await client.end();
  }
}

// Run the import
importJsonToPostgres(
  'C:\\reactPhoneCatalog\\react_phone-catalog\\public\\api\\accessories.json',
);
