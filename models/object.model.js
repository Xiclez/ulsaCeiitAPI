const mongoose = require('mongoose');

const objSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    codigoQR: {
        type: String,
        required: true,
        unique: true
    },
    numeroSerie: {
        type: Number,
        default: null
    },
    estado: {
        type: String,
        required: true
    },
    loanId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        default: null
    },
    ubicacion: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    fechaAdquisicion: {
        type: Date,
        default: null
    },
    valor: {
        type: Number,
        default: null
    },
    fechaUltimoMantenimiento: {
        type: Date,
        default: null
    },
    urlImagen: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { collection: 'objetos' }); 

const Objeto = mongoose.model('Objeto', objSchema);

module.exports = {
    Objeto
};
