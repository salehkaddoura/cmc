var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('signupMessage') });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;