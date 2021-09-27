'use strict'
const Twitter = require('twitter')
const apiKeys = require('../api-keys')

const client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})


const tweetSearch = {

  
/* este get é uma amostra de tweets populares e recentes dos dados do trend , 
chamando a função de retorno de chamada com uma matriz de objetos de tweets. 
Cada objeto de tweet contém o id, o texto e a popularidade, e os tweets são classificados por popularidade.*/
   
  getTweetSample: function (trend, num) {
    return new Promise((resolve, reject) => {
      client.get('search/tweets', {q: trend, result_type: 'popular', count: num})
      .then(result => {
        const tweets = []
        result.statuses.forEach(tweet => {
          
          tweets.push({
            embed_id: tweet.id_str
          })
        })

        resolve(tweets)
      }).catch(reject)
    })
  }
}

module.exports = tweetSearch
