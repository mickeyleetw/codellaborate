const router = require('express').Router();
const {dropAlltables,createAlltables,createDB} = require('../controller/admin_controller.js');

// --------------------------------------------------------------------------
// Create DB
router.get('/createDB', (req, res) => {
  createDB();
});

// -------------------------------Drop Tables if Exits-----------------------

router.get('/DropTables', (req, res) => {
  dropAlltables();

});
// -------------------------------Create Tables------------------------------

router.get('/createAllTables', (req, res) => {
  createAlltables();
});

// --------------------------------------------------------------------------
module.exports = router;

