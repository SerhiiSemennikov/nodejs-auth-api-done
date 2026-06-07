import express from 'express';
import https from 'https';
import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config();
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IMAGE_DIR = path.join(__dirname, 'img');
const IMAGES_DIR = path.join(__dirname, 'img');
// import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from './routes/authRouter.js';
import { userRouter } from './routes/userRouter.js';
import { todosRouter } from './routes/todosRouter.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { Product } from './models/Product.js';
import { Accessory } from './models/Accessory.js';
import { Phone } from './models/Phone.js';
import { Tablet } from './models/Tablet.js';
import { sequelize } from './utils/db.js';
const app = express();
app.use('/static', express.static(IMAGE_DIR));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  );
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0'); // Modern browsers use CSP instead
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  console.log(
    `${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`,
  );

  next();
});
app.use(
  cors({
    tls: { rejectUnauthorized: true },
    origin: process.env.CLIENT_URL,
    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

    statusCode: 200,

    header: 'Access-Control-Allow-Origin: *',
    header:
      'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH',
    header:
      'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With',
  }),
);
// Routes
app.use(authRouter);
app.use('/users', userRouter);
app.use('/todos', todosRouter);
app.use(errorMiddleware);
app.get('/products', async (req, res) => {
  res.json({
    status: 'success',
    data: await getProducts(), // Assume getProducts() is defined elsewhere
  });
});
app.get('/accessories', async (req, res) => {
  res.json({
    status: 'success',
    data: await getAccessory(), // Assume getAccessory() is defined elsewhere
  });
});
app.get('/phones', async (req, res) => {
  res.json({
    status: 'success',
    data: await getPhone(), // Assume getPhone() is defined elsewhere
  });
});
app.get('/tablets', async (req, res) => {
  res.json({
    status: 'success',
    data: await getTablet(), // Assume getTablet() is defined elsewhere
  });
});

/**
 * Recursively get all image file paths from a directory
 */
function getImages(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            // Recursively search subfolders
            results = results.concat(getImages(filePath));
        } else {
            // Only include image files
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                // Convert to URL path for client
                results.push('/images' + filePath.replace(IMAGES_DIR, '').replace(/\\/g, '/'));
            }
        }
    });

    return results;
}

// API endpoint to get all image paths
app.get('/api/images', async (req, res) => {
    try {
        const images = await getImages(IMAGES_DIR);
        res.json({ images });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read images' });
    }
});

// Serve client HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

async function getProducts() {
  return await Product.findAll({
    attributes: [
      'id',
      'category',
      'itemId',
      'name',
      'fullPrice',
      'price',
      'screen',
      'capacity',
      'color',
      'ram',
      'year',
      'image',
    ],
    order: [
      ['id', 'ASC'],
      // [sequelize.literal(`(name)`), 'ASC'],
    ],
  }); // Sequelize method to fetch a single product from the database
}

async function getAccessory() {
  return await Accessory.findAll({
    attributes: [
      'id',
      'category',
      'namespaceId',
      'name',
      'capacityAvailable',
      'capacity',
      'priceRegular',
      'priceDiscount',
      'colorsAvailable',
      'color',
      'images',
      'description',
      'screen',
      'resolution',
      'processor',
      'ram',
      'cell',
    ],
    order: [
      ['id', 'ASC'],
      //[sequelize.literal(`(description->0->>'title')`), 'ASC'],
    ],
  });
}
async function getPhone() {
  return await Phone.findAll({
    attributes: [
      'id',
      'category',
      'namespaceId',
      'name',
      'capacityAvailable',
      'capacity',
      'priceRegular',
      'priceDiscount',
      'colorsAvailable',
      'color',
      'images',
      'description',
      'screen',
      'resolution',
      'processor',
      'ram',
      'camera',
      'zoom',
      'cell',
    ],
    order: [['id', 'ASC']],
  });
}

async function getTablet() {
  return await Tablet.findAll({
    attributes: [
      'id',
      'category',
      'namespaceId',
      'name',
      'capacityAvailable',
      'capacity',
      'priceRegular',
      'priceDiscount',
      'colorsAvailable',
      'color',
      'images',
      'description',
      'screen',
      'resolution',
      'processor',
      'ram',
      'camera',
      'zoom',
      'cell',
    ],
    order: [['id', 'ASC']],
  });
}

// Middleware to serve static images directly
app.use('/img', express.static(IMAGES_DIR));

// Route to serve an image by filename with validation

app.get('/img/:filename', (req, res) => {
  
  try {
// const files = fsReadDir(IMAGES_DIR);
    // Read all files in the images directory
     const files =  fs.readdirSync(IMAGES_DIR);
    
    if (!files || files.length === 0) {
      console.warn('No images found in the directory.');
      return res.status(404).json({ error: 'No images found' });
    } 
    // Filter only image files (basic check by extension)
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file),
    );

    // Map to full URLs
    const imageUrls = imageFiles.map(
      file =>
        `${req.protocol}://${req.get('host')}/img/${encodeURIComponent(file)}`,
    );

    // const filename = req.params.filename;

    // Security: prevent directory traversal attacks
    /* if (!/^[\w,\s-]+\.[A-Za-z]{3,4}$/.test(filename)) {
      return res.status(400).send('Invalid filename.');
    }*/

    // const filePath = path.join(IMAGE_DIR, filename);

    // Check if file exists
    /* if (!fs.existsSync(filePath)) {
      return res.status(404).send('Image not found.');
    }*/

    // Send the file
    //res.json({ img: imageUrls });
    if (imageUrls.length === 0) {
      console.warn('No valid image URLs to return.');
      return res.status(404).json({ error: 'No images found' });
    }

    res.status(200).json({ img: imageUrls });
    //res.sendFile(filePath);
  } catch (err) {
    console.error('Error reading images:', err);
    res.status(500).json({ error: 'Unable to fetch images' });
    //console.error(err);
    //res.status(500).send('Server error.');
  }
});
 
function fsAccess(filePath, mode) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, mode, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function fsReadDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/*app.get('/img/:name', (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(IMAGE_DIR, fileName);
fsAccess(filePath, fs.constants.F_OK)
    .then(() => {
      console.log(`Serving image: ${fileName}`);
      res.sendFile(filePath);
    })
    .catch(err => {
      console.error(`Error accessing image ${fileName}:`, err);
      res.status(404).send('Image not found');
    });
  // Validate file existence
  /* fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      return res.status(404).send('Image not found');
    }
    console.log(`Serving image: ${fileName}`);
    res.sendFile(filePath);
  });*/
//});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    uptime: process.uptime(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    uptime: process.uptime(),
  });
});
app.get('/api/info', (req, res) => {
  res.json({
    status: 'info',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    uptime: process.uptime(),
  });
});

app.get('/api/secure-data', (req, res) => {
  res.json({
    status: 'success',
    data: 'This is secure data!',
  });
});

app.get('/api/request-info', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Secure Node.js Server</h1><p>Your connection is secure!</p>');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ssl/tls options
const sslOptions = {
  key: fs.readFileSync('certs/localhost-key.pem'), // key.pem
  cert: fs.readFileSync('certs/localhost.pem'), // cert.pem
  ca: fs.readFileSync('certs/localhost.pem'), // cert.pem For self-signed certs, use the same cert as CA

  // Enable HTTP/2 if available
  allowHTTP1: true,
  // Recommended security options
  minVersion: 'TLSv1.2',
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    '!DSS',
    '!aNULL',
    '!eNULL',
    '!EXPORT',
    '!DES',
    '!RC4',
    '!3DES',
    '!MD5',
    '!PSK',
  ].join(':'),
  honorCipherOrder: true,
};
console.log('SSL/TLS options configured:', {
  key: sslOptions.key ? 'Loaded' : 'Not Loaded',
  cert: sslOptions.cert ? 'Loaded' : 'Not Loaded',
  ca: sslOptions.ca ? 'Loaded' : 'Not Loaded',
});

const PORT = process.env.PORT || 4000;
const server = https.createServer(sslOptions, app, (req, res) => {
  // Security headers
  const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle requests
  // console.log(`Received request: ${req.method} ${req.url}`);
});

/*const server = https.createServer(sslOptions,app, (req, res) => {
  // Security headers
  const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle requests
  if (req.url === '/request-info') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Secure Node.js Server</h1><p>Your connection is secure!</p>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});*/

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit with failure code
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exit with failure code
});

const gracefulShutdown = signal => {
  console.log(
    `Received shutdown signal (${signal}), shutting down gracefully...`,
  );
  server.close(() => {
    console.log('HTTPS Server closed.');
    process.exit(0);
  });
  // Force shutdown after 10 seconds if not closed
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown.');
    process.exit(1);
  }, 10000);
};
// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
const HOST = process.env.HOST || '127.0.0.1'; // HOST can be set to 'localhost' or '0.0.0.0'
server.listen(PORT, () => {
  console.log(`HTTPS server running at https://${HOST}:${PORT}`);

  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Press Ctrl+C to stop the server');
});
