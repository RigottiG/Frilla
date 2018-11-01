const router = require('express').Router();
const async = require('async');
const Frilla = require('../models/frilla');
const User = require('../models/user');

/* Funções de Middleware 
 * Acesso ao objeto de solicitação (req)
 * Objeto de resposta (res)
 * Proxima função de middleware no ciclo solicitação-resposta (next).
*/


// Objeto vazio para trazer todos os Frillas na pagina principal
router.get('/', (req, res, next) => {
    Frilla.find( {} , function(err, frilla){
        res.render('main/home', {frillas:frilla});
    })
});

// Passar o ID do usuario para preencher somente com os Frillas desse usuario
router.get('/meus-frillas', (req, res, next) => {
    Frilla.find({dono: req.user._id}, function(err, frilla){
        res.render('main/meus-frillas', {frillas:frilla});
    })
});


router.route('/add-novo-frilla')
    .get((req, res, next) => {
        res.render('main/add-novo-frilla');
    })
    .post((req, res, next) => {
        async.waterfall([
            function (callback) {
                var frilla = new Frilla();
                frilla.dono = req.user._id;
                frilla.titulo = req.body.frilla_titulo;
                frilla.categoria = req.body.frilla_categoria;
                frilla.sobre = req.body.frilla_sobre;
                frilla.preco = req.body.frilla_preco;
                frilla.save(function (err) {
                    callback(err, frilla);
                });
            },

            function (frilla,callback) {
                User.update({
                    _id: req.user._id
                }, {
                    $push: {
                        frilla: frilla._id
                    }
                }, function (err, count) {
                    res.redirect('/meus-frillas');
                })
            }
        ])
    })


router.get('/servico_detalhes/:id', (req, res, next) => {
     Frilla.findOne({_id: req.params.id})
           .populate('dono')
           .exec(function(err, frilla){
               res.render('main/servico_detalhes', {frilla: frilla});
        });
});
module.exports = router;