
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// twitter
var twitter = require('./server/twitter');

app.get('/', routes.index);
app.get('/poll', twitter.poll);
app.get('/get/:user', twitter.getTweets);
app.get('/send/:user/:message', twitter.sendTweet);

// interval = setInterval(function() {
//   var date = new Date();
//   console.log(date.getSeconds());
//   if ( date.getSeconds() === 0 ) {
//     twitter.poll();
//   }
// }, 1000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
