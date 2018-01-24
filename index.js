// index.js
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 5000);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// The passport module Facebook strategy routes
require('./passport.js')(app);

// Set environment variables
// If they are defined, then the app knows it's running on
// Heroku, and not locally
if(process.env.PASSPORT_CLIENT_ID == undefined){
	require('./env.js');
}

// Application root route page, aspireapp.herokuapp.com/
app.get('/', loggedIn, function(req, res){
	res.send('Hello World!');
});

app.get('/login', function(req, res){
	res.render('login', {user: req.user});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function loggedIn(req, res, next) {
  if (req.user) {
  	console.log(req.user);
    next();
  } else {
  	console.log(req.user);
    res.redirect('/login');
  }
}