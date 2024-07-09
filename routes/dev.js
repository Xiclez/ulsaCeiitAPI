var express = require('express');
var router = express.Router();

const { verifyJwt } = require('../controllers/auth.controller.js');
const { getAllLogs, logAction } = require('../controllers/log.controller.js');


router.get('/getAllLogs', verifyJwt, getAllLogs);