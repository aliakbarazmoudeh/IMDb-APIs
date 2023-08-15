const express = require('express');
const router = express.Router();
const { logIn, logOut, register } = require('../controllers/authController');

router.route('/login').post(logIn);
router.route('/register').post(register);
router.route('/logout').get(logOut);

module.exports = router