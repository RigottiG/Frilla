const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FrillaSchema = new Schema({
    dono: { type: Schema.Types.ObjectId, ref: 'User' },
    titulo: String,
    categoria: String,
    sobre: String,
    preco: Number,
    foto: { type: String, default: 'http://placehold.it/350x150' },
    created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Frilla', FrillaSchema);