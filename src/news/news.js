'use strict'
const request = require('request')

const newsApiBaseUrl = 'https://newsapi.org/v2'
const apiKey = require('../api-keys').newsApiKey
const config = require('../../config.js')

const news = {
  
  getNews: function (phrase) {
    return new Promise((resolve, reject) => {
      getNewsArticlesForPhrase(phrase)
        .then(articles => resolve(articles))
        .catch(error => reject(error))
    })
  }
}

function getNewsArticlesForPhrase (phrase) {
  return new Promise((resolve, reject) => {
    const options = {
      url: newsApiBaseUrl + '/everything?q=' + encodeURIComponent(phrase) + `&pageSize=${config.maxArticlesPerTrend}`,
      headers: {
        'Authorization': apiKey
      }
    }

    request(options, (error, response) => {
      if (error) {
        reject(new Error(error))
        return
      }

      const responseJson = JSON.parse(response.body)
      if (responseJson.status !== 'ok') {
        reject(new Error(responseJson.message))
        return
      }

      resolve(responseJson.articles.map(article => ({
        title: article.title,
        description: article.description,
        timestamp: new Date(article.publishedAt).getTime() / 1000,
        source: article.source.name,
        link: article.url,
        media: article.urlToImage
      })))
    })
  })
}

module.exports = news
