const router = require('express').Router();
const Frilla = require('../models/frilla');
const taxa = 2.50;

router.get('/contratar/contratar_frilla/:id', (req,res,next) =>{
    Frilla.findOne({_id: req.params.id}, function(err, frilla){
        var precoTotal = frilla.preco + taxa;
        req.session.frilla = frilla;
        req.session.preco = precoTotal;
        res.render('contratar/contratar_frilla', {frilla: frilla, precoTotal});
    });
});

router.route('/pagamento').get((req,res,next) => {
    res.render('contratar/pagamento');
})


module.exports = router;