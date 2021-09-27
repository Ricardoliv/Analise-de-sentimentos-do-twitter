'use strict'
const keywordExtractor = require('keyword-extractor')

const stopRegexes = [
  /http.*/, // Desconsidera links
  /^rt$|^retweet$/i, // Desconsidera 'rt' e 'retweetar'
  /[^a-zA-z0-9#]/ // Desconsidera palavras com quaisquer caracteres não alfanuméricos (exceto # para hashtags)
]


function KeywordBank () {
  const keywords = {}

  //Adiciona o text ao KeywordBank
   
  this.addText = function (text) {
    const extractedKeywords = keywordExtractor.extract(text)

    extractedKeywords.forEach(keyword => {
      if (stopRegexes.some(regex => { return keyword.match(regex) })) {
        return
      }

      if (keywords[keyword]) {
        keywords[keyword]++
      } else {
        keywords[keyword] = 1
      }
    })
  }

  //Retorna uma lista das principais palavras-chave sem KeywordBank na forma de uma matriz de objetos
  this.getTopKeywords = function (num) {
    
    const keywordArray = Object.keys(keywords).map(keyword => {
      return {word: keyword, occurences: keywords[keyword]}
    })

    keywordArray.sort((a, b) => {
      return b.occurences - a.occurences
    })
    return keywordArray.slice(0, num)
  }
}

module.exports = KeywordBank
