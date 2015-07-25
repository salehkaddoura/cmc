var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../app/models/users');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    // async [User.findOne wont fire unless data is sent back]
    process.nextTick(function() {
        User.findOne({ 'local.email' : email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var newUser = new User();

                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log('NEW USER: ', newUser);
                    return done(null, newUser);
                })
            }
        })
    })
}));

passport.use('local-login', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({ 'local.email' : email }, function(err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
        }

        if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        }

        return done(null, user);
    });
}));
    
module.exports = passport;