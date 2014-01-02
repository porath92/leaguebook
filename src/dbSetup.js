var configData = require('./config').configData;
var pg         = require('pg');
var psql       = new pg.Client(configData.dbURL);
var waterfall  = require('async').waterfall;

waterfall([
  function (callback) {
    psql.connect(function (err, res) {
      console.log(err);
      callback();
    });
  }, function (callback) {
    psql.query('' +
'DROP TABLE IF EXISTS account; ' +
'' +
'DROP SEQUENCE IF EXISTS account_id_seq; ' +
'' +
'CREATE SEQUENCE account_id_seq ' +
'  INCREMENT BY 1' +
'  MINVALUE 1 ' +
'  NO MAXVALUE ' +
'  START WITH 1; ' +
'CREATE TABLE account ( ' +
"  account_id numeric NOT NULL PRIMARY KEY DEFAULT nextval('account_id_seq')," +
'  username   varchar(50) NOT NULL,' +
'  followers  numeric NOT NULL DEFAULT 0,' +
'  deaths     numeric NOT NULL DEFAULT 0,' +
'  kills      numeric NOT NULL DEFAULT 0, ' +
'  last_mentione_id numeric' +
')' +
    '', function (err, res) {
      console.log(err);
      callback();
    });
  }
], function (err, res) {
  psql.end();
});
