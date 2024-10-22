var express = require('express');
var router = express.Router();
const { verifyJwt } = require('../controllers/auth.controller.js');

const {
    addObject,
    readObject,
    deleteObject,
    updateObject,
    getAllObjects,
    getObjectQR
  } = require('../controllers/objects.controller.js');

const  {
    loanObject,
    loanDeleteObject,
    loanReadObject,
    loanUpdateObject,
    getAllLoans,
    returnObject,
    getLoanByObjectId	
} = require('../controllers/loan.controller.js');

const {
  searchObj, searchLoan,changeStatus
} = require('../controllers/searchObject.controller.js')

const { logAction } = require('../controllers/log.controller.js');

  router.get('/getObjectQR',verifyJwt,getObjectQR);
  router.post('/addObject',verifyJwt,addObject);
  router.post('/readObject',verifyJwt,readObject);
  router.post('/deleteObject',verifyJwt,deleteObject);


  router.post('/loanObject',loanObject);
  router.post('/loanReadObject',loanReadObject);
  router.post('/loanDeleteObject',loanDeleteObject);

  router.get('/getAllObjects',verifyJwt,getAllObjects);
  router.put('/updateObject',verifyJwt, updateObject);
  router.put('/loanUpdateObject', loanUpdateObject);
  router.get('/getAllLoans',verifyJwt,getAllLoans);
  router.post('/returnLoan', returnObject); 
  router.get('/getLoanByObjectId', getLoanByObjectId); 


  router.get('/searchObject',searchObj)
  router.get('/searchLoan',verifyJwt,searchLoan)
  router.get('/changeStatus',verifyJwt,changeStatus)

  router.post('/logs',logAction);

  module.exports = router;
    
