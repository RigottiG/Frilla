const router = require('express').Router();
const stripe = require('stripe')('sk_test_l8lQjV5iZtMB5ktSUkxcXdau')
const Frilla = require('../models/frilla');
const Contrato = require('../models/contratos');
const taxa = 2.50;

router.get('/contratar/contratar_frilla/:id', (req, res, next) => {
    Frilla.findOne({
        _id: req.params.id
    }, function (err, frilla) {
        var precoTotal = frilla.preco + taxa;
        req.session.frilla = frilla;
        req.session.preco = precoTotal;
        res.render('contratar/contratar_frilla', {
            frilla: frilla,
            precoTotal
        });
    });
});

router.route('/pagamento').get((req, res, next) => {
        res.render('contratar/pagamento');
    })
    .post((req, res, next) => {
        var frilla = req.session.frilla;
        var preco = req.session.preco;
        preco *= 100;
        stripe.customers.create({
            email: req.user.email
        }).then((customer) => {
            return stripe.customers.createSource(customer.id, {
                source: req.body.stripeToken
            });
        }).then((source) => {
            return stripe.charges.create({
                amount: preco,
                currency: 'usd',
                customer: source.customer
            });
        }).then((charge) => {
            // CONFIRMAR COMPRA
            var contrato = new Contrato();
            contrato.contratante = req.user._id;
            contrato.contratado = frilla.dono;
            contrato.frilla = frilla._id;
            contrato.save(function (err) {
                req.session.frilla = null;
                req.session.preco = null;
                res.redirect('/users/' + req.user._id + '/contratos/' + contrato._id);
            });

        }).catch((err) => {
            // ERRO
        });
    })

router.get('/users/:userId/contratos/:contratoId', (req, res, next) => {
    req.session.contratoId = req.params.contratoId;
    Contrato.findOne({
            _id: req.params.contratoId
        })
        .populate('contratante')
        .populate('contratado')
        .populate('frilla')
        .exec(function (err, contrato) {
            res.render('/contrato/contratos-room', {
                layout: 'chat_layout',
                contrato: contrato
            });
        });
});

module.exports = router;