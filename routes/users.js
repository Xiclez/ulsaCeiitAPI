var express = require('express');
var router = express.Router();

const {
  registrarUsuario,iniciarSesion,buscarUsuario
} = require('../controllers/user.controller.js');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registrar', registrarUsuario);
router.post('/iniciar_sesion', iniciarSesion);
router.get('/buscar_usuario',buscarUsuario);

module.exports = router;

