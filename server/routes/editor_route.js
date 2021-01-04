const fs = require('fs');
const url = require('url');
const { createNeweditor,runCode,verifyEditor,saveEditor,userEditor } = require('../controller/editor_controller.js');
// const moment = require('moment-timezone');
const childProcess = require('child_process')
const router = require('express').Router();

// --------------------Create New Editor----------------------------------------
router.post('/', createNeweditor);

// --------------------驗證 Editor----------------------------------------------
router.get('/:id', verifyEditor);

// --------------------Run Code-------------------------------------------------
router.post('/runcode',  runCode);

// --------------------Save Current Editor--------------------------------------
router.post('/saveEditor',saveEditor)

// --------------------GET SAVED CODE FROM DB-----------------------------------
router.post('/usereditor', userEditor)


module.exports = router;