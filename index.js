// index.js
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 5000);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Set environment variables
// If they are defined, then the app knows it's running on
// Heroku, and not locally
if(process.env.PASSPORT_CLIENT_ID == undefined){
	require('./env.js');
}

// Application root route page, aspireapp.herokuapp.com/
app.get('/', function(req, res){
	res.send('Hello World!');
});

// The passport module Facebook strategy routes
require('./passport.js')(app);
app.get('/login', function(req, res){
	res.render('login', {user: req.user});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});