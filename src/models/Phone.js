import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';

export const Phone = sequelize.define('phone', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    // autoIncrement: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  namespaceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacityAvailable: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priceRegular: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  priceDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  colorsAvailable: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  description: {
    type: DataTypes.ARRAY(DataTypes.JSONB), // Stores array of objects
    allowNull: false,
    validate: {
      isValidDescription(value) {
        if (!Array.isArray(value)) {
          throw new Error('Description must be an array');
        }
        value.forEach(item => {
          if (typeof item.title !== 'string' || !Array.isArray(item.text)) {
            throw new Error(
              'Each description item must have a title (string) and text (string[])',
            );
          }
          if (!item.text.every(t => typeof t === 'string')) {
            throw new Error('All text entries must be strings');
          }
        });
      },
    },
    // type: DataTypes.ARRAY(DataTypes.JSONB || DataTypes.STRING), // Array of JSON objects
    // defaultValue: [],
  },
  screen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resolution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  processor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ram: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  camera: {
    type: DataTypes.STRING,
    allowNull: false,
    allowNull: true,
  },
  zoom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cell: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
