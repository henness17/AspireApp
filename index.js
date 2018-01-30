const main = async () => {
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

// The passport module Facebook strategy routes
require('./routes/passport.js')(app);
require('./routes/pages.js')(app);
require('./routes/postgres.js')(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
}
main();