var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var hbs = require('hbs');
// var configDB = require('./config/database.js');
// mongoose.connect(configDB.url);

var port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(cookieParser('ilovecmc'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static(__dirname + '/public'));
// app.use(favicon(__dirname + '/favicon.ico' ));

app.use(session({ secret: 'cmcisgod', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/', function(req, res) {
    res.render('index');
});


app.listen(port);
console.log('The magic happens on port -> ' + port);