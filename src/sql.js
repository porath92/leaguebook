var quote = function (str) {
  if (str) {
    str = str.replace("'", "''");
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
module.exports.select = function (columns, table, where) {
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
    query += buildWhere(where) + ';';
  } else {
    query += ' WHERE ' + where + ';';
  }
  console.log(query);
  return query;
}

/*
 *@param {String} table
 *@param {Object} pairs
 */
module.exports.insert = function (table, pairs, returnColumn) {
  var query   = 'INSERT INTO ' + table + ' (';
  var columns = '';
  var values  = '';

  for (var x in pairs) {
    columns += x + ', ';
    values += quote(pairs[x]) + ', ';
  }
  columns = columns.replace(/, $/, '');
  values  = values.replace(/, $/, '');

  query = query += columns + ') VALUES (' + values + ')';

  if (returnColumn) {
    query += ' RETURNING ' + returnColumn + ';';
  } else {
    query += ';';
  }

  console.log(query);
  return query;
}

module.exports.insertMulti = function (table, rows, returnColumn) {
  var query = '';
  for (var x = 0; x < rows.length; x++) {
    query += module.exports.insert(table, rows[x], returnColumn);
  }

  return query;
}

/*
 *@param {String} table
 *@param {Object} where
 */
module.exports.delete = function (table, where) {
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

  console.log(query);
  return query;
}

/*
 *@param {String} table
 *@param {Object} fields
 *@param {Object} where
 */
module.exports.update = function (table, fields, where, returnColumn) {
  var query = 'UPDATE ' + table + ' SET ';

  for (var x in fields) {
    query += x + ' = ' + quote(fields[x]) + ', '
  }
  query = query.replace(/, $/, '');

  query += buildWhere(where);

  if (returnColumn) {
    query += ' RETURNING ' + returnColumn;
  }

  query += ';';

  console.log(query);
  return query;
}
