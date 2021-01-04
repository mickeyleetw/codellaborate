const crypto = require('crypto');
const router = require('express').Router();
const { signup, signin, userfile, profile } = require('../controller/user_controller.js');


// -------------------------------------------------------------------------
router.post('/signup', signup)

// -------------------------------------------------------------------------
router.post('/signin', signin)

// -------------------------------------------------------------------------
router.get('/profile', profile)

// -------------------------------------------------------------------------
router.post('/userFile', userfile)

// -------------------------------------------------------------------------
module.exports = router;
