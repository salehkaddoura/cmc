'use strict';
var express = require('express');
var router = express.Router();
var passportAuth = require('../../config/passport.js');

router.get('/login', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
});

router.post('/login', passportAuth.authenticate('local-login', {
    successRedirect: '/v1/user',
    failureRedirect: '/v1/login',
    failureFlash: true
}));

router.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('signupMessage') });
});

router.post('/signup', passportAuth.authenticate('local-signup', {
    successRedirect: '/v1/user',
    failureRedirect: '/v1/signup',
    failureFlash: true
}));

router.get('/auth/facebook', passportAuth.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passportAuth.authenticate('facebook', {
    successRedirect: '/v1/user',
    failureRedirect: '/v1/login',
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;