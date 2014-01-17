var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('college', {
    'college_id' : {'type' : 'int', 'primaryKey' : true, 'autoIncrement' : true},
    'name'       : {'type' : 'string', 'notNull' : true},
    'slug'       : {'type' : 'string', 'notNull' : true},
    'size'       : {'type' : 'string', 'length' : 20},
    'state'      : {'type' : 'string', 'length' : 20},
    'unitid'     : {'type' : 'decimal', 'length' : 10},
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('college', callback);
};
