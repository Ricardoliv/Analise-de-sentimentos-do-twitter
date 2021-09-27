'use strict'
const sentiment = require('sentiment')

//Constrói um novo objeto SentmentBank. 
//Um SentimentBank é usado para manter o controle de sentimento para o texto recebido sobre um tópico específico.
 
function SentimentBank (trendName = '') {
  let analyzed = 0
  let totalSentiment = 0

  // Ignora as palavras que ocorrem no nome da trend em cálculos de sentimento
  const ignoreQuery = {}
  trendName.split(' ').map(word => { return word.replace(/[^a-zA-Z]/g, '').toLowerCase() })
  .forEach(word => { ignoreQuery[word] = 0 })

  //Adiciona um tweet à análise de sentimento do tweet.
  this.addText = function (tweet) {
    totalSentiment += sentiment(tweet, ignoreQuery).score
    analyzed++
  }

  //Retorna o sentimento médio para os tweets analisados.
  this.getSentiment = function () {
    return analyzed !== 0 ? totalSentiment / analyzed : 0
  }

  //Retorna o numero de tweets analisados.
  this.getAnalyzed = function () {
    return analyzed
  }
}

module.exports = SentimentBank
