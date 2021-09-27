'use strict'
const Twitter = require('twitter')
const apiKeys = require('../api-keys')
var config = require('../../config')

const client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})


const trends = {
  //Obt茅m uma s茅rie das tend锚ncias mais populares para cada um dos locais especificado na configura莽茫o a ser rastreada, 
  //retorna uma promessa.
  getTrends: function () {
    return new Promise((resolve, reject) => {
      getCountryCodes().then(countryCodes => {
        const locationTrendsPromise = getLocationTrends(countryCodes)
        const worldwideTrendsPromise = getTrendsForLocation(1)

        Promise.all([worldwideTrendsPromise, locationTrendsPromise]).then(values => {
          const worldwideTrends = values[0]
          const locationTrends = values[1]

          resolve(reduceTrends(worldwideTrends, locationTrends))
        })
      })
    })
  }
}

// Obtenhe c贸digos de pa铆s para cada um dos woeids em config.locationsTracking.
  // Retorna uma promessa que resolve com um mapeamento de objeto woeid para o c贸digo do pa铆s
 
function getCountryCodes () {
  return new Promise((resolve, reject) => {
    const countryCodes = {}

    client.get('trends/available', {}).then(locations => {
      locations.forEach(location => {
        if (config.locationsTracking.indexOf(location.woeid) !== -1) {
          countryCodes[location.woeid] = location.countryCode
        }
      })
      resolve(countryCodes)
    }).catch(reject)
  })
}

 // pega t贸picos de trends em um local espec铆fico. 
  //Retorna uma promessa que resolve com uma lista de t贸picos de trends.
function getTrendsForLocation (woeid) {
  return new Promise((resolve, reject) => {
    return client.get('trends/place', {id: woeid})
    .then(data => {
      resolve(data[0].trends.map(trend => {
        return {name: trend.name, tweet_volume: trend.tweet_volume}
      }))
    }).catch(reject)
  })
}

// pega trends de todos os locais especificados em config.locationsTracking.
  // retorna uma promise que se resolve com um objeto mapeando c贸digos de pa铆s para matrizes
  // dos t贸picos de tend锚ncia para aquele local.
 
function getLocationTrends (countryCodes) {
  return new Promise((resolve, reject) => {
    let fufilled = 0

    const locationTrends = {}

    config.locationsTracking.forEach(woeid => {
      getTrendsForLocation(woeid).then(trends => {
        locationTrends[countryCodes[woeid]] = trends

        fufilled++
        if (fufilled === config.locationsTracking.length) {
          resolve(locationTrends)
        }
      }).catch(reject)
    })
  })
}

//Inclui uma s茅rie de t贸picos de tend锚ncias mundiais e um objeto de mapeamento de pa铆ses
//codifica os t贸picos de trends e retorna uma variedade de t贸picos de trendd em todo o mundo cada um contendo uma matriz de localiza莽茫o
function reduceTrends (worldwideTrends, locationTrends) {
  const trendsToTrack = []
  let rank = 1
  
  worldwideTrends.forEach(worldwideTrend => {
    const trend = {name: worldwideTrend.name, locations: [], tweet_volume: worldwideTrend.tweet_volume}
    Object.keys(locationTrends).forEach(countryCode => {
      locationTrends[countryCode].forEach(locationTrend => {
        if (worldwideTrend.name === locationTrend.name) {
          trend.locations.push(countryCode)
        }
      })
    })

    
    if (trend.locations.length > 0) {
      trend.rank = rank
      rank++

      trendsToTrack.push(trend)
    }
  })

  return trendsToTrack.slice(0, config.maxTrends)
}

module.exports = trends
