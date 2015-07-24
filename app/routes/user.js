var express = require('express');
var router = express.Router();

router.get('/:id', isLoggedIn, function(req, res) {
    res.render('profile', {
        user: req.user
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = router;

