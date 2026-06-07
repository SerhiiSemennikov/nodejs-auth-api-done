/**
 * Transfer JSON file data into PostgreSQL with separate columns
 * Requires: npm install pg
 */

import 'dotenv/config';
import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// Path to JSON file
const jsonFilePath =
  'C:\\reactPhoneCatalog\\react_phone-catalog\\public\\api\\accessories.json';

// Async function to load JSON and insert into DB
async function transferJsonToPostgres() {
  try {
    // Connect to PostgreSQL
    await client.connect();

    // Read and parse JSON file
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    let records;
    try {
      records = JSON.parse(rawData);
    } catch (err) {
      throw new Error('Invalid JSON format in file.');
    }

    // Ensure it's an array
    if (!Array.isArray(records)) {
      throw new Error('JSON file must contain an array of objects.');
    }

    // Example: Insert into table "accessories" with columns: id, name, email
    const insertQuery = `
      INSERT INTO accessories (id, name, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO NOTHING
    `;

    for (const rec of records) {
      // Validate required fields
      if (!rec.id || !rec.name || !rec.email) {
        console.warn('Skipping record due to missing fields:', rec);
        continue;
      }

      await client.query(insertQuery, [rec.id, rec.name, rec.email]);
    }

    console.log('Data transfer completed successfully.');
  } catch (err) {
    console.error('Error transferring data:', err.message);
  } finally {
    await client.end();
  }
}

// Run the transfer
transferJsonToPostgres();
