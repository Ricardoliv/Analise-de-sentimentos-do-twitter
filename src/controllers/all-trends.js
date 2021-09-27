var Trend = require('../models/trend')

const allTrendsController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  Trend.find({}, (err, trends) => {
    if (err) {
      res.status(500).send('Erro interno ao recuperar informações da trend')
    } else {
      const resData = {trends: trends}
      res.json(resData)
    }
  }).select({name: 1, rank: 1, sentiment_score: 1, _id: 0}).sort({rank: 1})
}

module.exports = allTrendsController
