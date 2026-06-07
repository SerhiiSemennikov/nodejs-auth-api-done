// Required dependencies

import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// --------------------
// 1. Database connection
// --------------------
import 'dotenv/config';
import { sequelize } from './utils/db.js';
// --------------------
// 2. Define Sequelize model
// --------------------
import { Accessory } from './models/Accessory.js';
import { Phone } from './models/Phone.js';
import { Tablet } from './models/Tablet.js';

// --------------------
// 3. Load JSON file
// --------------------
//const filepath = path.join(__dirname, 'data.json');
function loadJson(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    // console.log(rawData);
    const jsonData = JSON.parse(rawData);
    // console.log(jsonData);
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON file must contain an array of objects.');
    }
    return jsonData;
  } catch (err) {
    console.error('Error reading JSON file:', err.message);
    process.exit(1);
  }
}

// --------------------
// 4. Insert into DB
// --------------------
async function importData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // Ensure table exists
    await sequelize.sync();

    // Load JSON data
    const jsonFilePath =
      'C:\\reactPhoneCatalog\\react_phone-catalog\\public\\api\\tablets.json';
    const records = loadJson(jsonFilePath);
    //console.log(records);
    // Validate and map data
    if (!Array.isArray(records)) {
      throw new Error('Expected an array of records in JSON file.');
    }
    // console.log(Object.entries(records));
    const validRecords = Object.keys(records)
      .map(key => {
        const item = records[key];
        //console.log(`Processing record at key ${key}:`, item);
        if (
          !item.id ||
          !item.category ||
          !item.namespaceId ||
          !item.name ||
          !item.capacityAvailable ||
          !item.capacity ||
          !item.priceRegular ||
          !item.priceDiscount ||
          !item.colorsAvailable ||
          !item.color ||
          !item.images ||
          !item.description ||
          !item.screen ||
          !item.resolution ||
          !item.processor ||
          !item.ram ||
          !item.camera ||
          !item.zoom ||
          !item.cell
        ) {
          console.warn(
            `Skipping record ${item.name} at index ${key} due to missing required fields.`,
          );
          return null;
        }

        return {
          id: item.id !== undefined ? String(item.id).trim() : null,
          category: String(item.category).trim(),
          namespaceId: String(item.namespaceId).trim(),
          name: String(item.name).trim(),
          capacityAvailable: Array.isArray(item.capacityAvailable)
            ? item.capacityAvailable.map(String)
            : null,
          capacity: String(item.capacity).trim(),
          priceRegular:
            item.priceRegular !== undefined ? Number(item.priceRegular) : null,
          priceDiscount:
            item.priceDiscount !== undefined
              ? Number(item.priceDiscount)
              : null,
          colorsAvailable: Array.isArray(item.colorsAvailable)
            ? item.colorsAvailable.map(String)
            : null,
          color: String(item.color).trim(),
          images: Array.isArray(item.images) ? item.images.map(String) : null,
          description: Array.isArray(item.description)
            ? item.description.map(desc => {
                if (typeof desc === 'object' && desc !== null) {
                  return {
                    title: String(desc.title).trim(),
                    text: Array.isArray(desc.text)
                      ? desc.text.map(String)
                      : null,
                  };
                }
                return String(desc).trim();
              })
            : null,
          screen: String(item.screen).trim(),
          resolution: String(item.resolution).trim(),
          processor: String(item.processor).trim(),
          ram: String(item.ram).trim(),
          camera: String(item.camera).trim(),
          zoom: String(item.zoom).trim(),
          cell: Array.isArray(item.cell) ? item.cell.map(String) : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
      .filter(Boolean);
    //console.log(`✅ Valid records to insert: ${validRecords}`);
    if (validRecords.length === 0) {
      console.warn('No valid records to insert.');
      return;
    }

    // Bulk insert
    await Tablet.bulkCreate(
      validRecords,
      { ignoreDuplicates: true },
      { validate: true },
    );
    console.log(`✅ Successfully inserted ${validRecords.length} records.`);
  } catch (err) {
    console.error('❌ Error importing data:', err.message);
  } finally {
    await sequelize.close();
  }
}

// Run the import
importData();
