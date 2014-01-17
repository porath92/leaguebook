var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    'user_id'         : {'type' : 'int', 'primaryKey' : true, 'autoIncrement' : true},
    'college_id'      : {'type' : 'decimal'},
    'email'           : {'type' : 'string', 'length' : 50, 'notNull' : true},
    'name'            : 'string',
    'summoner_id'     : 'decimal',
    'tier'            : {'type' : 'string', 'length' : 12},
    'rank'            : 'decimal',
    'profile_icon_id' : 'decimal',
    'confirmation_id' : 'uuid',
    'create_date'     : {'type' : 'datetime', 'defaultValue' : 'now()'}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
