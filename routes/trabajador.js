const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Trabajador = require('../models/Trabajador');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Registro de trabajador
router.post(
    '/registrar',
    [
        check('nombreDeUsuario', 'Nombre de usuario es requerido').not().isEmpty(),
        check('contrasena', 'Contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 })
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { nombreDeUsuario, contrasena } = req.body;
        try {
            let trabajador = await Trabajador.findOne({ nombreDeUsuario });
            if (trabajador) {
                return res.status(400).json({ msg: 'Trabajador ya existe' });
            }
            trabajador = new Trabajador({
                nombreDeUsuario,
                contrasena: await bcrypt.hash(contrasena, 10),
            });
            await trabajador.save();
            res.status(201).json({ msg: 'Trabajador registrado' });
        } catch (err) {
            next(err);
        }
    }
);

// Inicio de sesión de trabajador
router.post(
    '/login',
    [
        check('nombreDeUsuario', 'Nombre de usuario es requerido').not().isEmpty(),
        check('contrasena', 'Contraseña es requerida').exists()
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { nombreDeUsuario, contrasena } = req.body;
        try {
            const trabajador = await Trabajador.findOne({ nombreDeUsuario });
            if (!trabajador) {
                return res.status(400).json({ msg: 'Credenciales incorrectas' });
            }
            const esCoincidente = await bcrypt.compare(contrasena, trabajador.contrasena);
            if (!esCoincidente) {
                return res.status(400).json({ msg: 'Credenciales incorrectas' });
            }
            const token = jwt.sign({ id: trabajador._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (err) {
            next(err);
        }
    }
);

// Obtener todos los trabajadores
router.get('/', auth, async (req, res, next) => {
    try {
        const trabajadores = await Trabajador.find();
        res.json(trabajadores);
    } catch (err) {
        next(err);
    }
});

// Actualizar un trabajador
router.put('/:id', auth, async (req, res, next) => {
    const { nombreDeUsuario, contrasena } = req.body;
    try {
        let trabajador = await Trabajador.findById(req.params.id);
        if (!trabajador) {
            return res.status(404).json({ msg: 'Trabajador no encontrado' });
        }
        if (nombreDeUsuario) trabajador.nombreDeUsuario = nombreDeUsuario;
        if (contrasena) trabajador.contrasena = await bcrypt.hash(contrasena, 10);

        await trabajador.save();
        res.json(trabajador);
    } catch (err) {
        next(err);
    }
});

// Eliminar un trabajador
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const trabajador = await Trabajador.findById(req.params.id);
        if (!trabajador) {
            return res.status(404).json({ msg: 'Trabajador no encontrado' });
        }
        await trabajador.remove();
        res.json({ msg: 'Trabajador eliminado' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
