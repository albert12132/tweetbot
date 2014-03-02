var EOL = "\0"
var SOL = "\2"
var MAX_TWEET_LENGTH = 140 - " #tweetLIkeMe".length;
var TWEET_SIGNATURE = "#tweetLikeMe";

/**
 * Trains the tweetbot given list of tweets.
 * Generates counts for words and stores counts into global variable wordCounts.
 **/
function trainTweetBot(tweetList) {
    var nextWordCounts = {};
    for (var i=0; i<tweetList.length; i++) {
        var wordList = parseWords(tweetList[i]);
        updateWordCounts(nextWordCounts, wordList);
    } return nextWordCounts;
}

/**
 * Parses the tweet and returns list of valid words.
 * @params tweet json tweet object.
 **/
function parseWords(tweet) {
    var tweetText = tweet.text;
    tweetText = tweetText.replace(/(\W)/g, ' $1 ');
    tweetText = SOL + " " + tweetText; 

    var wordList = tweetText.split(' ');
    for (i=wordList.length-1; i >= 0; i--) {
        wordList[i] = wordList[i].toLowerCase();
        var word = wordList[i]
        if (notValidWord(word)) {
            wordList.splice(i, 1);
        }
    } return wordList;
}

/**
 * Returns true if the word is a valid word.
 * Return false i the word matches '@*'
 **/
function notValidWord(word) {
    var userRegex = new RegExp("@.*")
    return userRegex.test(word)
}

/**
 * Adds up counts of words in dict.
 * @params wordList list of strings
 * */
function updateWordCounts(dict, wordList) {
    var word = wordList[0];
    var nextWord;
    for (var i=1; i < wordList.length; i++) {
        nextWord = wordList[i];
        if (!dict.hasOwnProperty(word)) {
            dict[word] = {};
        }
        if (!dict[word].hasOwnProperty(nextWord)) {
            dict[word][nextWord] = 0;
        }
        dict[word][nextWord]++;
        word = nextWord;
    }
    if (!dict.hasOwnProperty(word)) {
        dict[word] = {};
    }
    if (!dict[word].hasOwnProperty(String("EOL"))) {
        dict[word][EOL] = 0;
    } dict[word][EOL]++;
}


/**
 * Processes recent tweets and returns a string of a tweet 
 * @params tweets json object of list of tweets
 * */
function generateTweet(tweetList) {
    var tweet = "";
    var nextWordsDict = trainTweetBot(tweetList);
    var word = randomNextWord(nextWordsDict, SOL);
    tweet += word;
    while (tweet.length < MAX_TWEET_LENGTH) {
        var nextWord = randomNextWord(nextWordsDict, word); 
        if (tweet.length + nextWord.length + 1 > MAX_TWEET_LENGTH ||
                nextWord === EOL) {
            tweet += TWEET_SIGNATURE;
            break;
        } 
        var punctation = /\W/;
        if (punctuation.test(nextWord)) {
            tweet += nextWord;
        } else {  
            tweet += ' ' + nextWord;
        } 
        word = nextWord;
    }
    return tweet.trim();
}

/**
 * Returns a random word that follows input 'word'
 * based on probability distribution.
 * @params dict object
 * @params word String
 * */
function randomNextWord(dict, word) {
    var distribution = [];
    var nextWords = dict[word];
    var totalWords = 0;
    var cumulativeProb = 0.0;

    for (var nextWord in nextWords) {
        totalWords += nextWords[nextWord];
    }

    for (var nextWord in nextWords) {
        var prob = nextWords[nextWord]/totalWords;
        distribution.push([cumulativeProb,nextWord]);
        cumulativeProb += prob;
    }

    var rand = Math.random();
    var prevProb = distribution[0][0];
    for (var i=1; i < distribution.length; i++) {
        if (rand > prevProb) {
            return distribution[i][1];
        } prevProb = distribution[i][0]
    }
    return distribution[distribution.length - 1][1]
}

exports.generateTweet = generateTweet

