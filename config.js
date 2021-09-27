'use strict'

const config = {
  // Endereço do banco de dados MongoDB para armazenar informações da trend 
   dbAddress: 'localhost',

   // Nome do banco de dados MongoDB para armazenar informações da trend 
   dbName: '......',

   // Porta que a API escuta
   apiPort: 8080,

   // Número máximo de trends para rastrear
   maxTrends: 5,

   // Número máximo de artigos a serem armazenados para cada trend
   maxArticlesPerTrend: 10,

   // Número máximo de tweets populares para armazenar para cada trend
   maxTweetsPerTrend: 5,

   // Número máximo de palavras-chave a serem armazenadas para cada trend
   maxKeywordsPerTrend: 40,

   // Comprimento do intervalo do servidor em segundos (as tendências são atualizadas a cada este
   // segundos), (900 são 15 minutos)
   intervalLength: 900,

  // Descrições legíveis por humanos de valores de sentimento para retornar por meio da API
  sentimentDescriptions: [
    {max: Infinity, min: 3, text: 'Extremely Positive'},
    {max: 3, min: 1.5, text: 'Very Positive'},
    {max: 1.5, min: 1, text: 'Positive'},
    {max: 1, min: 0.25, text: 'Slightly Positive'},
    {max: 0.25, min: -0.25, text: 'Neutral'},
    {max: -0.25, min: -1, text: 'Slightly Negative'},
    {max: -1, min: -1.5, text: 'Negative'},
    {max: -1.5, min: -3, text: 'Very Negative'},
    {max: -3, min: -Infinity, text: 'Extremely Negative'}
  ],

  
  locationsTracking: [
    23424977, // United States
    23424775, // Canada
    23424975, // United Kingdom
    23424803, // Ireland
    23424748, // Australia
    23424916  // New Zealand
  ]
}

module.exports = config
