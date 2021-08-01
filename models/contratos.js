const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
// let date = new Date()
const ContratosSchema = new Schema({
    contrato: {
        type: String,
        required: true
    },
    proyecto: {
        type: String,
        required: true
    },
    inicio: {
        type: Date,
        default: Date.now
    },
    fin: {
        type: Date,
        default: new Date( (new Date).setMonth(((new Date).getMonth()+1) ))
    },
    estado: {
        type: Boolean,
        default: true
    },
    ncontrato: {
        type: String,
        required: true
    },
    cantidades: {
        type: Array,
        required: true
    }
});
module.exports = Contratos =mongoose.model("contratos",ContratosSchema) 