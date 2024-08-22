const express = require('express');
const router = express.Router();
const Medicion = require('../models/Medicion');
const { check, validationResult } = require('express-validator');


// Registrar una nueva medición
router.post('/registrar', [
    check('numeroDeCliente', 'El ID del cliente es obligatorio').not().isEmpty(),
    check('estatura', 'La estatura es obligatoria').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    check('porcentajeDeGrasa', 'El porcentaje de grasa es obligatorio').not().isEmpty(),
    check('imc', 'El IMC es obligatorio').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { numeroDeCliente, estatura, peso, porcentajeDeGrasa, imc } = req.body;
    try {
        let medicion = new Medicion({
            numeroDeCliente,
            estatura,
            peso,
            porcentajeDeGrasa,
            imc,
        });
        await medicion.save();
        res.status(201).json({ msg: 'Medición registrada', medicion });
    } catch (err) {
        console.error(err.message); // Añadir registro del error
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});

// Obtener todas las mediciones
router.get('/', async (req, res) => {
    try {
        const mediciones = await Medicion.find();
        res.json(mediciones);
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});

// Ruta para obtener el progreso de un cliente específico
router.get('/progreso/:clienteId', async (req, res) => {
    try {
        const mediciones = await Medicion.find({ numeroDeCliente: req.params.clienteId });
        res.json(mediciones);
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});

// Ruta para obtener el ranking de todos los clientes
router.get('/ranking', async (req, res) => {
    try {
        const mediciones = await Medicion.find().sort({ imc: -1 }).limit(10); // Por ejemplo, los 10 mejores IMC
        res.json(mediciones);
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});


module.exports = router;
