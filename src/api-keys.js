'use strict'

const apiKeys = {
  newsApiKey: process.env.NEWS_API_KEY,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterAccessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,

  
  verify: function () {
    return (apiKeys.newsApiKey !== '1231312313') &&
      (apiKeys.twitterConsumerKey !== 'I50e586cbF7GQojrWiZTTNPND') &&
      (apiKeys.twitterConsumerSecret !== 'CqkoepdRRVpHEzIkNKleQL44lMhCj88HGQXXJjXe9gxlcoZg7M') &&
      (apiKeys.twitterAccessTokenKey !== '1125814813840617472-25Qsma5lZVOLLHA5B6uNqrrcwoZPRK') &&
      (apiKeys.twitterAccessTokenSecret !== 'N6nn8tae1pNZL6SRomYRwizI9TsSyNLEHov9fVPURekFX')
  }

}

module.exports = apiKeys
