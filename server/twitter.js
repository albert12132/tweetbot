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
    count: 100,
  },
  accessToken,
  accessSecret,
  function(error, data) {
    if (error) {
      console.log(error);
    } else {
      users = [];
      for (var i = 0; i < data.length; i++) {
        user = data[i].user.screen_name;
        if (users.indexOf(user) == -1) {
          users.push(data[i].user.screen_name);
          getTweetsForUser(user);
        }
      }
      if (res) {
        res.end(JSON.stringify(users));
      }
    }
  });
}

function getTweetsForUser(user) {
  twitter.getTimeline("user", {
    screen_name: user,
    count: 100,
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
};

function getTweets(req, res) {
  user = req.params['user'];
  twitter.getTimeline("user", {
    screen_name: user,
    count: 100,
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

function sendTweet(req, res) {
  user = req.params['user'];
  message = req.params['message'];
  console.log(accessToken);
  console.log(accessSecret);
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
