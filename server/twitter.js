var bot = require('../routes/tweet_bot');

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callback: 'http://yoururl.tld/something'
});

var accessToken = process.env.ACCESS_TOKEN;
var accessSecret = process.env.ACCESS_SECRET;

function poll(req, res) {
  twitter.getTimeline("mentions", {
  },
  accessToken,
  accessSecret,
  function(error, data) {
    if (error) {
      console.log(error);
    } else {
      users = [];
      currentTime = Date.now();
      for (var i = 0; i < data.length; i++) {
        user = data[i].user.screen_name;
        time = new Date(Date.parse(data[i].created_at));
        if (users.indexOf(user) == -1
            && currentTime - time <= 60000
            ) {
          users.push(data[i].user.screen_name);
          generateTweet(req, res, user);
        }
      }
    }
  });
}

function getTweets(req, res, user) {
  if (!user) {
    user = req.params['user'];
  }
  twitter.getTimeline("user", {
    screen_name: user,
  },
  accessToken,
  accessSecret,
  function(error, data) {
    if (error) {
      console.log(error);
    } else {
      res.end(JSON.stringify(data));
    }
  });
};

function generateTweet(req, res, user) {
  if (!user) {
    user = req.params['user'];
  }
  twitter.getTimeline("user", {
    screen_name: user,
  },
  accessToken,
  accessSecret,
  function(error, data) {
    if (error) {
      console.log(error);
    } else {
      tweet = bot.generateTweet(data);
      sendTweetToUser(user, tweet);
      if (res) {
        res.end(tweet);
      }
    }
  });
};


function sendTweetToUser(user, message) {
  twitter.statuses("update", {
    status: "@" + user + " " + message,
  },
  accessToken,
  accessSecret,
  function(error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
}

function sendTweet(req, res) {
  user = req.params['user'];
  message = req.params['message'];
  twitter.statuses("update", {
    status: "@" + user + " " + message,
  },
  accessToken,
  accessSecret,
  function(error, data) {
    if (error) {
      console.log(error);
    } else if (res) {
      res.end(JSON.stringify(data));
    } else {
      console.log(data);
    }
  });
}

exports.getTweets = getTweets
exports.poll = poll
exports.sendTweet = sendTweet
exports.generateTweet = generateTweet
