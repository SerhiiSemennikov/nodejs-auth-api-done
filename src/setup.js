import 'dotenv/config';
import { sequelize } from './utils/db.js';
import  './models/User.js';
import './models/Token.js';
import './models/Todo.js';
import './models/Product.js';
import './models/Accessory.js';
import './models/Phone.js';
import './models/Tablet.js';

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
}).catch((err) => {
  console.error('Unable to synchronize the database:', err);
});
 