const express = require('express');
const router = express.Router();

const { createUserCtrl } = require('../controllers/auth.controller');

router.post('/register', createUserCtrl);

module.exports = router