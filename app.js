'use strict'
const mongoose = require('mongoose')
const api = require('./src/api')
const config = require('./config')
const apiKeys = require('./src/api-keys')
const storage = require('node-persist')
const updateTrends = require('./src/update-trends')

mongoose.Promise = global.Promise

// Verifique se todas as chaves de API estão presentes e inicie o back-end
if (apiKeys.verify()) {
  start()
} else {
  console.error('Algumas chaves de API não foram encontradas, verifique suas variáveis de ambiente')
}

function start () {
  mongoose.connect('mongodb://' + config.dbAddress + '/' + config.dbName)

  const db = mongoose.connection

  db.on('error', console.error)

  db.once('open', () => {
    console.log('Successfully connected to MongoDB server ' + config.dbAddress)

    api.start().then(() => {
      console.log('API Listening on port ' + config.apiPort.toString())
    })

    storage.initSync()
    const timeToInitUpdate = getTimeToNextUpdate()

    setTimeout(() => {
      updateTrends()
      setInterval(() => {
        storage.setItemSync('last_update', Date.now())
        updateTrends()
      }, config.intervalLength * 1000)
    }, timeToInitUpdate)
  })
}


function getTimeToNextUpdate () {
  const lastUpdateTime = storage.getItemSync('last_update')

  if (lastUpdateTime !== undefined) {
    config.intervalLength * 1000 - (Date.now() - lastUpdateTime)
  } else {
    return 0
  }
}
