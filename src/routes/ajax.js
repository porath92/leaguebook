module.exports = function(app) {
  var express = require('express'),
      router  = express.Router(),
      sql     = require('../helpers/sql'),
      db      = require('../helpers/db');

  router.get('/ajax/schools', function(req, res) {
    db.psqlQuery(sql.select(['name', 'college_id', 'slug'], 'college', "LOWER(name) LIKE LOWER('%" + req.query.name + "%')"),
      function (err, data) {
        if(!err) {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write(JSON.stringify(data.rows));
          res.end();
        }else {
          console.log(err);
          res.status(500);
          res.end();
        }
      }
    );
  });

  return router;
}
