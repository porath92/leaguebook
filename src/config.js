module.exports.configData = {
  'dbURL' : process.env.HEROKU_POSTGRESQL_BLACK_URL || 'postgres://twitzer:twitzer@localhost:5432/twitzer'
}
