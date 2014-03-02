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
    count: 200,
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
        if (users.indexOf(user) == -1 && currentTime - time <= 60000) {
          users.push(data[i].user.screen_name);
          generateTweet(user, function(message) {
          });
        }
      }
    }
  });
}

function getTweets(user, callback) {
  twitter.getTimeline("user", {
    screen_name: user,
    count: 200,
    exclude_replies: true,
    include_rts: false,
  },
  accessToken,
  accessSecret,
  callback);
};

function generateTweet(user, callback) {
  getTweets(user, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      tweet = bot.generateTweet(user, data);
      sendTweet(user, tweet, function() {});
      callback(tweet);
    }
  });
}

function sendTweet(user, tweet, callback) {
  twitter.statuses("update", {
    status: "@" + user + " " + tweet,
  },
  accessToken,
  accessSecret,
  callback);
}

exports.getTweets = getTweets
exports.poll = poll
exports.sendTweet = sendTweet
exports.generateTweet = generateTweet
