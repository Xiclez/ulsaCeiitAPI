const bcrypt = require('bcrypt');
const User = require("../models/user.models").User;
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { firmaJwt } = require('./auth.controller');
const { logAction } = require('../controllers/log.controller');

// Buscar usuario
async function buscarUsuario(req, res) {
  const { name, tuition, surName } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }
    if (tuition) {
      query.tuition = tuition;
    }
    if (surName) {
      query.surName = { $regex: new RegExp(surName, "i") };
    }

    const usuarios = await User.find(query);

    // Log the search action
    await logAction({
      user: req.user ? req.user.username : 'anonymous',
      action: 'search',
      element: 'user search',
      date: new Date()
    });

    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error al buscar usuarios" });
  }
}

// Registrar usuario
async function registrarUsuario(req, res) {
  const { usrn, password, tuition, name, surName, role = 'Usuario'} = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: usrn,
      password: hashedPassword,
      tuition,
      name,
      surName,
      role
    });

    await newUser.save();

    // Log the registration action
    await logAction({
      user: req.user ? req.user.username : 'anonymous',
      action: 'register',
      element: `user:${newUser._id}:${newUser.username}`,
      date: new Date()
    });

    res.json({
      obj: newUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Hubo un error al registrar el usuario" });
  }
}

// Iniciar sesión
async function iniciarSesion(req, res) {
  const { usrn, password } = req.body;

  try {
    const user = await User.findOne({ username: usrn });

    if (!user) {
      return res.status(401).json({ mensaje: "No se encontró el usuario" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    req.body.username = usrn; 
    await firmaJwt(req, res);

    // Log the login action
    await logAction({
      user: usrn,
      action: 'login',
      element: `user:${user._id}:${usrn}`,
      date: new Date()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Hubo un error al iniciar sesión" });
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  buscarUsuario
};
