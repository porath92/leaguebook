module.exports = function(app) {
  var express = require('express'),
      router  = express.Router(),
      sql     = require('../helpers/sql'),
      db      = require('../helpers/db'),
      cache   = require('basic-cache');

  router.get('/ajax/schools', function(req, res) {
    var cacheKey = 'ajax:search:' + req.query.name;
    var cachedSearch = cache.get(cacheKey);

    if(cachedSearch) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(cachedSearch));
      res.end();
    }else {
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
    }
  });

  return router;
}
