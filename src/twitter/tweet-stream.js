'use strict'
const Twitter = require('twitter')
const apiKeys = require('../api-keys')
const KeywordBank = require('./keyword-bank')
const SentimentBank = require('./sentiment-bank')
const config = require('../../config')

var client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})

//Construtor para um objeto que gerencia uma conexão com a API de streaming, monitorando uma lista fornecida de trends e 
//coletando informações sobre elas.
function TweetStream () {
  let stream = null

  let trendData = {}

  let trendRegexes = []

  this.startTracking = function (trends) {
    
    this.closeStream()

    
    trendRegexes = trends.map(trendName => {
      
      return {name: trendName, regex: new RegExp(trendName, 'i')}
    })

    trendData = {}
    trends.forEach(trend => {
      trendData[trend] = {
        sentimentBank: new SentimentBank(trend),
        keywordBank: new KeywordBank(),
        tweets_analyzed: 0
      }
    })

    stream = client.stream('statuses/filter', {track: trends.join(','), language: 'en'})

    stream.on('data', event => {
      
      if (event.warning) {
        console.error('Warning from streaming API: ', event)
        return
      } else if (!event.text) {
       
        return
      }

      trendRegexes.forEach(trendRegex => {
        if (event.text.match(trendRegex.regex)) {
          trendData[trendRegex.name].sentimentBank.addText(event.text)
          trendData[trendRegex.name].keywordBank.addText(event.text)
          trendData[trendRegex.name].tweets_analyzed++
        }
      })
    })

    stream.on('error', error => {
      console.error(error)
    })
  }

 
  this.closeStream = function () {
    if (stream) {
      stream.destroy()
    }
  }

  //Retorna os dados coletados até agora para cada tendência da API de streaming. 
  this.getData = function () {
    const returnTrendData = {}

    Object.keys(trendData).forEach(trend => {

      returnTrendData[trend] = {}

      returnTrendData[trend].sentiment = trendData[trend].sentimentBank.getSentiment()
      returnTrendData[trend].keywords = trendData[trend].keywordBank.getTopKeywords(config.maxKeywordsPerTrend)
      returnTrendData[trend].tweets_analyzed = trendData[trend].tweets_analyzed
    })

    return returnTrendData
  }
}

module.exports = TweetStream
