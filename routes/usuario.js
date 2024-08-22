const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/registrar', async (req, res) => {
  const { nombreDeUsuario, contrasena, numeroDeCliente, turno, nombre, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;

  try {
    let usuario = await Usuario.findOne({ nombreDeUsuario });
    if (usuario) {
      return res.status(400).json({ msg: 'Usuario ya existe' });
    }
    
    // Validar campos obligatorios
    if (!nombreDeUsuario || !contrasena || !numeroDeCliente || !turno || !nombre || !fechaDeNacimiento || !edad || !numeroTelefonico || !correoElectronico || !ocupacion) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }

    // Crear nuevo usuario
    usuario = new Usuario({
      nombreDeUsuario,
      contrasena: await bcrypt.hash(contrasena, 10),
      numeroDeCliente,
      turno,
      nombre,
      descripcion,
      fechaDeNacimiento,
      edad,
      numeroTelefonico,
      correoElectronico,
      ocupacion
    });

    await usuario.save();
    res.status(201).json({ msg: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error en el servidor');
  }
});


// Inicio de sesión de usuario
router.post('/iniciar-sesion', async (req, res) => {
  const { nombreDeUsuario, contrasena, numeroDeCliente } = req.body;

  try {
    // Buscar usuario por nombre de usuario y número de cliente
    let usuario = await Usuario.findOne({ nombreDeUsuario, numeroDeCliente });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales incorrectas' });
    }

    // Verificar la contraseña
    const esCoincidente = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esCoincidente) {
      return res.status(400).json({ msg: 'Credenciales incorrectas' });
    }

    // Crear y enviar token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta de búsqueda
router.get('/buscar', async (req, res) => {
  const { nombre, nombreDeUsuario, numeroDeCliente } = req.query;

  try {
    const query = {};
    if (nombre) query.nombre = nombre;
    if (nombreDeUsuario) query.nombreDeUsuario = nombreDeUsuario;
    if (numeroDeCliente) query.numeroDeCliente = numeroDeCliente;

    const usuarios = await Usuario.find(query);
    res.json(usuarios);
  } catch (err) {
    console.error('Error en la búsqueda:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Actualisacion

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
      const usuarios = await Usuario.find();
      res.json(usuarios);
  } catch (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) {
          return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
      res.json(usuario);
  } catch (err) {
      console.error('Error al obtener usuario:', err);
      res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Ruta para actualizar un usuario por ID
router.put('/:id', async (req, res) => {
  const { nombreDeUsuario, contrasena, numeroDeCliente, turno, nombre, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;

  try {
      // Encuentra el usuario por ID
      let usuario = await Usuario.findById(req.params.id);
      if (!usuario) {
          return res.status(404).json({ msg: 'Usuario no encontrado' });
      }

      // Actualiza los campos del usuario
      usuario.nombreDeUsuario = nombreDeUsuario || usuario.nombreDeUsuario;
      usuario.numeroDeCliente = numeroDeCliente || usuario.numeroDeCliente;
      usuario.turno = turno || usuario.turno;
      usuario.nombre = nombre || usuario.nombre;
      usuario.descripcion = descripcion || usuario.descripcion;
      usuario.fechaDeNacimiento = fechaDeNacimiento || usuario.fechaDeNacimiento;
      usuario.edad = edad || usuario.edad;
      usuario.numeroTelefonico = numeroTelefonico || usuario.numeroTelefonico;
      usuario.correoElectronico = correoElectronico || usuario.correoElectronico;
      usuario.ocupacion = ocupacion || usuario.ocupacion;

      // Si se proporciona una nueva contraseña, encripta y actualiza
      if (contrasena) {
          usuario.contrasena = await bcrypt.hash(contrasena, 10);
      }

      await usuario.save();
      res.json({ msg: 'Usuario actualizado exitosamente' });
  } catch (err) {
      console.error('Error al actualizar usuario:', err);
      res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
