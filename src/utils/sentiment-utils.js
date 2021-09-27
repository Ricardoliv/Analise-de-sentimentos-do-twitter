'use strict'
var config = require('../../config')

const sentimentUtils = {

  
//pega uma descrição legível por humanos da pontuação de sentimento fornecida 
  getSentimentDescription: function (score) {
    return config.sentimentDescriptions.find(descrip => {
      if (descrip.max >= score && descrip.min <= score) {
        return descrip.text
      }
    }).text
  }
}

module.exports = sentimentUtils
