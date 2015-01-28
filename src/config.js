module.exports.configData = {
  baseURL    : process.env.BASE_URL                    || 'http://localhost:3000', 
  dbURL      : process.env.HEROKU_POSTGRESQL_BLUE_URL  || 'postgres://leaguebook:leaguebook@localhost:5432/leaguebook',
  riotAPIKey : '47319b52-dccf-41f9-a4dd-1b594255f0e6',
  mail       : 'Madglory21'
}
