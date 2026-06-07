import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';

export const Todo = sequelize.define('todo', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    allowNaN: true,
    // autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
});
