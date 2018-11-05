const moongose = require('mongoose');
const Schema = moongose.Schema;

const Contratos = new Schema({
    contratante: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contratado: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    frilla: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    mensagem: [{
        mensagem: {
            type: String
        },
        criador: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        data: {
            type: Date
        }
    }],
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = moongose.model('Contratos', Contratos);