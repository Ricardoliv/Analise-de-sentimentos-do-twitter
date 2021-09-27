var Trend = require('../models/trend')

const trendController = function (req, res) 
{
  res.set('Access-Control-Allow-Origin', '*')

  if (!req.params.name) 
  {
    res.status(400).send('Invalido nome da trend')
    return
  }
// busca apenas uma trend
  Trend.findOne({name: req.params.name}, (err, trend) => {
        if (err) {
            res.status(500).send('Erro interno ao recuperar informações da trend')
        } else if (!trend) {
            res.status(404).send('Trend não encontrada')
        } else {
            res.json(trend)
        }
  }).select({_id: 0, __v: 0})
}

module.exports = trendController
