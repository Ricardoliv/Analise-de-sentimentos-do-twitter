'use strict'
var trends = require('./twitter/trends')
var dbUtils = require('./utils/db-utils')
var TweetStream = require('./twitter/tweet-stream')
var tweetSearch = require('./twitter/tweet-search')
var news = require('./news/news')

var tweetStream = new TweetStream()

// Atualiza todas as trends no banco de dadods
function updateTrends () {
  return new Promise((resolve, reject) => {
    tweetStream.closeStream()
    const streamData = tweetStream.getData()

    trends.getTrends()
    .then(trends => {
      
      dbUtils.removeOldTrends(trends.map(trendInfo => { return trendInfo.name }))

      let trendsProcessed = 0

      trends.forEach(trend => {
        getDataAndProcess(trend, streamData[trend.name]).then(() => {
          trendsProcessed++
          if (trendsProcessed === trends.length) {
            resolve()
          }
        })
      })

      
      tweetStream.startTracking(trends.map(trendData => { return trendData.name }))
    })
  })
}


 
function getDataAndProcess (trendInfo, streamData) {
  return new Promise((resolve, reject) => {
    const tweetSearchPromise = tweetSearch.getTweetSample(trendInfo.name)
    const newsPromise = news.getNews(trendInfo.name)

    Promise.all([tweetSearchPromise, newsPromise]).then(values => {
      const tweets = values[0]
      const news = values[1]
      dbUtils.processTrend(trendInfo, news, tweets, streamData).then(resolve)
    })
  })
}

module.exports = updateTrends
