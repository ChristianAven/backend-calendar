/*~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^
    Rutas de evento            |
    host + /api/events         |
 ~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~
*/
const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt")
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const isDate = require("../helpers/isDate");
const router = Router();


router.use(validarJWT);

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title','El titlulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de fin es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento);

// Actualizar un evento
router.put(
    '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ], 
    actualizarEvento);

// Borrar un evento
router.delete('/:id', eliminarEvento);

module.exports = router