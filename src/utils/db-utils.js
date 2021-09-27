'use strict'
const Trend = require('../models/trend')
const config = require('../../config')
const sentimentUtils = require('./sentiment-utils')


 //Contém funções utilitárias usadas para consultar e atualizar o banco de dados.
 
const dbUtils = {
  

//Remove todas as trends da database não localizada no array atual.
  removeOldTrends: function (currTrends) {
    return new Promise((resolve, reject) => {
      Trend.remove({name: {$nin: currTrends}})
      .then(resolve)
      .catch(reject)
    })
  },

  
  processTrend: function (trendData, newsArticles, tweets, streamData) 
  {
    return new Promise((resolve, reject) => {
      const fullTrendData = {
        name: trendData.name,
        rank: trendData.rank,
        locations: trendData.locations,
        articles: newsArticles,
        tweets: tweets,
        sentiment_score: streamData ? streamData.sentiment : null,
        sentiment_description: streamData ? sentimentUtils.getSentimentDescription(streamData.sentiment) : null,
        tweets_analyzed: streamData ? streamData.tweets_analyzed : 0,
        keywords: streamData ? streamData.keywords : []
      }
 
      Trend.findOne({name: trendData.name})
      .then(doc => {
            if (doc) {
                dbUtils.updateExistingTrend(doc, fullTrendData).then(resolve)
            } else {
                dbUtils.createNewTrend(fullTrendData).then(resolve)
            }
        }).catch(reject)
      })
  },
   

 
//Atualiza as trends.
  updateExistingTrend: function (existingTrendData, currentTrendData) 
  {
    return new Promise((resolve, reject) => {
      const newTweetsAnalyzed = existingTrendData.tweets_analyzed + currentTrendData.tweets_analyzed

      // Calcula a nova pontuação de sentimento (ponderando para tweets_analyzed e evitando dividir por zero)
      let newSentimentScore = newTweetsAnalyzed > 0
        ? (currentTrendData.sentiment_score * currentTrendData.tweets_analyzed +
        existingTrendData.sentiment_score * existingTrendData.tweets_analyzed) /
        newTweetsAnalyzed : null

      newSentimentScore = newSentimentScore === null ? null : Math.round(newSentimentScore * 1000) / 1000 // Arredondar para o milésimo mais próximo se não for nulo

      // Create a new keyword array (removing duplicates)
      const keywordsExisting = {}
      let newKeywords = existingTrendData.keywords.concat(currentTrendData.keywords)
      .filter(keyword => {
        if (keywordsExisting[keyword.word]) {
          return false
        } else {
            keywordsExisting[keyword.word] = true
            return true }
      })
      newKeywords.sort((a, b) => {
        return b.occurences - a.occurences
      })
      newKeywords = newKeywords.slice(0, config.maxKeywordsPerTrend)

      Trend.findOneAndUpdate({name: existingTrendData.name},
        {
          $set: {
            sentiment_score: newSentimentScore,
            sentiment_description: newSentimentScore !== null ? sentimentUtils.getSentimentDescription(newSentimentScore) : null,
            tweets_analyzed: newTweetsAnalyzed,
            rank: currentTrendData.rank,
            keywords: newKeywords,
            tweets: currentTrendData.tweets,
            articles: currentTrendData.articles
          }
        })
      .then(resolve)
      .catch(reject)
    })
  },


//Cria uma nova trend no banco de dados. Retorna uma promise
  createNewTrend: function (trendData) 
  {
    return new Promise((resolve, reject) => {
      new Trend(trendData).save()
      .then(resolve)
      .catch(reject)
    })
  }
}

module.exports = dbUtils
