const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/alive', (req, res) => {
  res.status(200).send('OK');
});

router.get('/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send(`Database connection failed: ${err.message}`);
  }
});

module.exports = router;
