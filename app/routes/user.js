var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res) {
    res.render('profile', {
        user: req.user
    });
});

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = router;

