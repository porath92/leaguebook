module.exports = function(app) {
  var express = require('express');
  var router = express.Router();

  router.get('/ajax/schools', function(req, res) {
    req.psql.psqlQuery(req.sql.select(['name', 'college_id', 'slug'], 'college', "LOWER(name) LIKE LOWER('%" + req.query.name + "%')"), function (err, data) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(data.rows));
      res.end();
    });
  });

  return router;
}
