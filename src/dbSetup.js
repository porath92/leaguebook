var pg         = require('pg');
var configData = require('./config').configData;
var psql       = new pg.Client(configData.dbURL);

psql.connect();

psql.query("\
DROP TABLE IF EXISTS users; \
DROP TABLE IF EXISTS college; \
DROP TABLE IF EXISTS user_college_lnk; \
DROP SEQUENCE IF EXISTS user_id_seq; \
DROP SEQUENCE IF EXISTS college_id_seq; \
\
CREATE SEQUENCE user_id_seq \
  INCREMENT BY 1 \
  MINVALUE 1 \
  NO MAXVALUE \
  START WITH 1; \
\
CREATE TABLE users ( \
  user_id         numeric NOT NULL PRIMARY KEY DEFAULT nextval('user_id_seq'), \
  college_id      numeric, \
  email           varchar(50) NOT NULL, \
  confirmation_id uuid NOT NULL, \
  create_date     date NOT NULL DEFAULT now() \
); \
CREATE SEQUENCE college_id_seq \
  INCREMENT BY 1 \
  MINVALUE 1 \
  NO MAXVALUE \
  START WITH 1; \
\
CREATE TABLE college ( \
  college_id numeric NOT NULL PRIMARY KEY DEFAULT nextval('college_id_seq'), \
  name       varchar NOT NULL, \
  size       varchar(20), \
  state      varchar(20) NOT NULL, \
  unitid     numeric(10) NOT NULL \
); \
\
", function (res) {
  console.log(res);
  psql.end();
});
