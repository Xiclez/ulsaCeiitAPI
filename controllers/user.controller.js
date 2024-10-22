const bcrypt = require('bcrypt');
const User = require("../models/user.model").User;
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { firmaJwt } = require('./auth.controller');

// Buscar usuario por parámetros generales (nombre, matrícula, apellido, ID)
async function buscarUsuario(req, res) {
  const { name, tuition, surName, id } = req.query;

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
    if (id) {
      query._id = id;
    }

    // Exclude password and role from the response
    const usuarios = await User.find(query).select('-password -role');

    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error al buscar usuarios" });
  }
}

// Buscar usuario por codigoQR
async function buscarUsuarioPorQr(req, res) {
  const { codigoQR } = req.query;

  try {
    // Exclude password and role from the response
    const usuario = await User.findOne({ codigoQR }).select('-password -role');

    if (!usuario) {
      return res.status(404).json({ mensaje: "No se encontró el usuario con el código QR proporcionado" });
    }

    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error al buscar el usuario por código QR" });
  }
}

// Registrar usuario
async function registrarUsuario(req, res) {
  const { usrn, password, tuition, name, surName, role, codigoQR } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: usrn,
      password: hashedPassword,
      tuition,
      name,
      surName,
      role,
      codigoQR
    });

    await newUser.save();

    // Exclude password and role from the response
    const userWithoutSensitiveData = await User.findById(newUser._id).select('-password -role');

    res.json({
      obj: userWithoutSensitiveData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Hubo un error al registrar el usuario" });
  }
}

// Iniciar sesión (this doesn't need modifications for password/role exclusion as it doesn't return user details directly)
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Hubo un error al iniciar sesión" });
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  buscarUsuario,
  buscarUsuarioPorQr
};
