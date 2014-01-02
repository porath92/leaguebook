module.exports.configData = {
  'baseURL'   : process.env.HEROKU_URL                  || 'localhost:3000', 
  'dbURL'     : process.env.HEROKU_POSTGRESQL_BLACK_URL || 'postgres://leaguebook:leaguebook@localhost:5432/leaguebook'
}
