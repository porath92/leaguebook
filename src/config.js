module.exports.configData = {
  'baseURL'   : process.env.BASE_URL                    || 'http://localhost:3000', 
  'dbURL'     : process.env.HEROKU_POSTGRESQL_BLUE_URL  || 'postgres://leaguebook:leaguebook@localhost:5432/leaguebook'
}
