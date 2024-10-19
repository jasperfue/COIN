var express = require('express');
var router = express.Router();
var { Pool } = require('pg');
const userDataRoutes = require('./user-data');
require('dotenv').config();


const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET home page
router.get('/', function (req, res, next) {
  res.send({ title: 'Express' });
});


router.get('/db-connection', async (req, res) => {
  try {
    const client = await pool.connect();
    res.send('Verbindung mit DB hergestellt');
    client.release();
  } catch (err) {
    console.error('Verbindung mit DB fehlgeschlagen', err);
    res.status(500).send('Verbindung mit DB fehlgeschlagen');
  }
});

router.use('/user-data', userDataRoutes);

module.exports = router;
