const express = require('express');
const router = express.Router();

const { getAllUsersCtrl } = require('../controllers/users.controller');

router.get("/", getAllUsersCtrl);

module.exports = router