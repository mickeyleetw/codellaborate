/* eslint-disable dot-notation */
/* eslint-disable eqeqeq */
const express = require('express');
const router = express.Router();
const functions = require('../../util/functions');

// --------------------------------------------------------------------------
// Create DB
router.get('/createDB', (req, res) => {
  const sql = 'CREATE DATABASE JS Online';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.send('Database created');
  });
});

// Drop Tables if Exits
router.get('/DropTables', (req, res) => {
  functions.dropTables();
  res.send('All Tables dropped');
});

// Create Tables
router.get('/createAllTables', (req, res) => {
  functions.createAllTables();
  res.send('All Tables created');
});

// --------------------------------------------------------------------------


module.exports = router;

