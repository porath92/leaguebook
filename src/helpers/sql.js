var _ = require('underscore');

var quote = function (str) {
  if (str) {
    if (typeof str === 'string') {
      str = str.replace(/'/g, "''");
    }
    return "'" + str + "'";
  } else {
    return 'null';
  }
}

var buildWhere = function (where, operator) {
  var query = where ? ' WHERE ' : ';';

  if (!operator) {
    operator = 'AND';
  }

  for (var x in where) {
    query += x + ' = ' + quote(where[x]) + ' ' + operator + ' ';
  }

  return query.replace(new RegExp(' ' + operator + ' $'), '');
}

/*
 *@param {Array} columns
 *@param {String} table
 *@param {Object} where
 */
module.exports = {

  select: function (columns, table, where, limit) {
    var query = 'SELECT ';

    if (typeof columns != 'string') {
      for (var x = 0; x < columns.length; x++) {
        query += columns[x];
        x != columns.length - 1 ? query += ', ' : query += ' ';
      }
    } else {
      query += columns + ' ';
    }

    query += 'FROM ' + table;

    if (typeof where != 'string') {
      query += buildWhere(where);
    } else {
      query += ' WHERE ' + where;
    }

    if (limit) {
      query += ' LIMIT ' + limit;
    }

    query += ';';

    return query;
  },

  /*
   *@param {String} table
   *@param {Object} pairs
   */
  insert: function (table, pairs, returnColumn) {
    var query   = 'INSERT INTO ' + table + ' (';
    var columns = '';
    var values  = '';

    for (var x in pairs) {
      columns += x + ', ';
      
      if(_.isNumber(pairs[x])){
        values += pairs[x] + ', ';
      } else {
        values += quote(pairs[x]) + ', ';
      }
    }
    columns = columns.replace(/, $/, '');
    values  = values.replace(/, $/, '');

    query = query += columns + ') VALUES (' + values + ')';

    if (returnColumn) {
      query += ' RETURNING ' + returnColumn + ';';
    } else {
      query += ';';
    }

    return query;
  },

  insertMulti: function (table, rows, returnColumn) {
    var query = '';
    for (var x = 0; x < rows.length; x++) {
      query += module.exports.insert(table, rows[x], returnColumn);
    }

    return query;
  },

  /*
   *@param {String} table
   *@param {Object} where
   */
  delete: function (table, where) {
    var query = 'DELETE FROM ' + table + ' WHERE ';

    for (var x in where) {
      query += x;
      if (where[x] instanceof Array) {
        query += ' IN (';
        var values = where[x];
        for (var y = 0; y < values.length; y++) {
          query += values[y];
          if (y != values.length-1) {
            query += ', ';
          } else {
            query += ')';
          }
        }
      } else {
        query += ' = ' + quote(where[x]);
      }

      query += ' AND ';
    }
    query = query.replace(/ AND $/, ';');

    return query;
  },

  /*
   *@param {String} table
   *@param {Object} fields
   *@param {Object} where
   */
  update: function (table, fields, where, returnColumn) {
    var query = 'UPDATE ' + table + ' SET ';

    for (var x in fields) {
      if(_.isNumber(fields[x])){
        query += x + ' = ' + fields[x] + ', '
      } else {
        query += x + ' = ' + quote(fields[x]) + ', '
      }
    }
    query = query.replace(/, $/, '');

    query += buildWhere(where);

    if (returnColumn) {
      query += ' RETURNING ' + returnColumn;
    }

    query += ';';

    return query;
  },

  updateUser: function (summoner, lastUpdated) {
    return "UPDATE users SET last_updated = " + "'" + lastUpdated + "'" +
      ", tier = " + "'" + summoner.tier.toLowerCase() + "'" +
      ", rank = " + "'" + summoner.rank + "'" +
      ", level = " + "'" + summoner.level + "'" +
      ", profile_icon_id = " + "'" + summoner.profile_icon_id + "'" +
      " WHERE summoner_id = " + summoner.summoner_id + ";";
  },

  getColleges: function () {
    var query = 'SELECT distinct(college_id), * FROM college WHERE college_id IN (SELECT college_id FROM users WHERE college_id > 0);';

    return query;
  },

  getUsers: function (college_id) {
    var query = 'SELECT * FROM users WHERE college_id = ' + college_id + ' ORDER BY rank DESC;';

    return query;
  },

  getUserByName: function (username) {
    var query = "SELECT * FROM users WHERE name = '" + username + "';";
    return query;
  },

  getUsersFromColleges: function (collegeIds, eachLimit) {
    var query = '';

    for (var x = 0; x < collegeIds.length; x++) {
      query += module.exports.select('*', 'users', {
        'college_id' : collegeIds[x]
      }, eachLimit);
    }

    return query;
  }
}
