const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const config = require('./secret');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/*  
  * Entrar com email e senha 
  * Add facebook, g+ e github depois
  * 
*/
passport.use('local-login', new LocalStrategy({
  // usar usuario como email.
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // passar toda a req pro retorno da chamada
}, function(req, email, password, done) { // retorno com email e senha

 /* 
    * Procurar usuario que email == email do form
    * Verificar se o usuario que esta logando já existe
*/
  User.findOne({ email:  email }, function(err, user) {
    // Retornar o erro
    if (err)
    return done(err);

    // Se não achar usuario, retornar mensagem
    if (!user)
    return done(null, false, req.flash('loginMessage', 'Usuario nao encontrado.')); // req.flash == flashdata

    // Se achar usuario mas a senha estiver errada
    if (!user.comparePassword(password))
    return done(null, false, req.flash('loginMessage', 'Oops! senha errada.')); // setar flashdata pra login errado

    // Se deu bom userGOD se deu ruim userLIXO xDxDxD
    return done(null, user);
  });

}));


exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}
