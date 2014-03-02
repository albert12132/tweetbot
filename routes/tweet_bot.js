var EOL = "\0"
var MAX_TWEET_LENGTH = 140;

/**
 * Gets list of user ids tweeted to our account.
 * @params tweet json object of tweet
 **/
function getUsersOnWall(tweet) {
    var userIds = []; 
    for (var i =0; i < tweet.length; i++) {
        var mentions = tweet[i].entities.user_mentions;
        for (var j=0; j<mentions.length; j++) {
            userIds.append(mentions[j].id_str);    
        } 
    } 
    return userIds; 
} 

/**
 * Trains the tweetbot given list of tweets. 
 * Generates counts for words and stores counts into global variable wordCounts.
 **/
function trainTweetBot(tweetList) {
    var nextWordCounts = {};
    for (var i=0; i<tweets.length; i++) {
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
    var wordList = tweetText.split(' ');
    for (i=wordList.length-1; i >= 0; i++) {
        wordList[i] = wordList[i].toLowerCase(); 
        var word = wordList[i]
        if (!isValidWord(word)) {
            wordList.splice(i, 1);
        }  
    } return wordList; 
} 

/**
 * Returns true if the word is a valid word. 
 * Return false i the word matches '@*'
 **/
function isValidWord(word) {
    var userRegex = new RegExp["@.*"]
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
        if (!dict[word].hasOwnPropety(nextWord)) {
            dict[word][nextWord] = 0;
        } 
        dict[word][nextWord]++; 
        word = nextWord;
    } 
    if (!dict[word].hasOwnProperty(String("EOL"))) {
        dict[word][EOL] = 0; 
    } dict[word][EOL]++;
}


/**
 * Processes last X tweets and returns a string tweet
 * @params tweets json object of list of tweets 
 * */
function generateTweet(tweetList) {
    var tweet = ""
    var nextWordsDict = trainTweetBot(tweetList);   
    var word = pickRandomProperty(nextWordsDict);
    tweet += word;
    while (tweet.length < MAX_TWEET_LENGTH) {
        var nextWord = randomNextWord(nextWordsDict, word);
        if (tweet.length + nextWord.length > TWEET_MAX_LENGTH ||
                nextWord.equals(EOL)) {
            break; 
        } tweet += nextWord; 
        word = nextWord;
    } 
    return tweet; 
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
    var prevProb = distribution[0][0] 
    for (var i=1; i < distribution.length; i++) {
        if (rand > prevProb) {
            return distribution[i][1];
        } prevProb = distribution[i][0]  
    } 
} 

function pickRandomProperty(obj) {
   var result;
   var count = 0;
   for (var prop in obj) {
        if (Math.random() < 1/++count) {
            result = prop;
        }
   } 
   return result;
}



