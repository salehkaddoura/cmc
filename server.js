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
mongoose.connect('mongodb://localhost/cmc_test');
// var configDB = require('./config/database.js');

// require('./config/passport')(passport);

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

app.use('/v1', require('./app/routes/auth'));
app.use('/v1/user', require('./app/routes/user'));

app.listen(port);
console.log('The magic happens on port -> ' + port);