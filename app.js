
/**
 * Module dependencies.
 */

var express = require('express');
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

app.get('/', function(req, res) {res.render('index')});
app.get('/api/poll', twitter.poll);
app.get('/api/gen/:user', function(req, res) {
  user = req.params['user'];
  twitter.generateTweet(user, function(message) {
    res.send("<p>@" + user + " " + message + "</p>");
  });
});

app.get('/api/get/:user', function(req, res) {
  user = req.params['user'];
  twitter.getTweets(user, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      data = data.map(function(tweet) {
        return "<div class='tweet-box'><span class='tweet-time'>"
          + tweet.created_at + "</span><p class='tweet-text'>"
          + tweet.text + "</p></div>";
      });
      res.send(data.join('\n'));
    }
  });
});
app.get('/api/send/:user/:message', function(req, res) {
  user = req.params['user'];
  message = req.params['message'];
  twitter.sendTweet(user, message, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      res.end(JSON.stringify(data));
    }
  });
});

interval = setInterval(function() {
  var date = new Date();
  console.log(date.getSeconds());
  if ( date.getSeconds() === 0 ) {
    twitter.poll();
  }
}, 1000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
