const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async(req, res=response) => {
    
    const eventos = await Evento.find()
                                .populate('user', 'name');


    res.status(201).json({
        ok: true,
        eventos,
    })
};

const crearEvento = async (req, res=response) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid;

        const eventoDB = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoDB
        })
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            ok: false,
            msg: 'Error en la creación de un evento'
        })
    }
};

const actualizarEvento = async(req, res=response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'id del evento no existe'
            });
        };

        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'no tiene el privilegio de editar este evento'
            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true, } );

        return res.status(201).json({
            ok: true,
            evento: eventoActualizado
        })

        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            ok: false,
            msg: 'Problema interno'
        })
    }
};

const eliminarEvento = async(req, res=response) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no encontrado',
            });
        };

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no tiene ese privilegio',
            });
        };

        await Evento.findByIdAndDelete(eventoId)

        res.json({ok: true,})
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno',
        });
    };

};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}