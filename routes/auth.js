var express = require('express');
var router = express.Router();

const  {
    firmaJwt,
    verifyJwt
} = require('../controllers/auth.controller')
/* GET home page. */
router.post('/get-jwt', firmaJwt );
router.post('/verify-jwt', verifyJwt );


module.exports = router;
