'use strict';
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var User = require('../app/models/users');
var configAuth = require('./fbAuth.js');

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

// Facebook login strategy
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
}, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({ 'facebook.id': profile.id }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, user);
            } else {
                console.log('## Profile', profile);

                var newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;

                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    };

                    return done(null, newUser);
                });
            };
        });
    });
}));
    
module.exports = passport;