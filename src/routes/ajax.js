module.exports = function(app) {
  app.get('/ajax/schools', function(req, res) {
    req.psql.query(req.sql.select(['name', 'college_id', 'slug'], 'college', "LOWER(name) LIKE LOWER('%" + req.query.name + "%')"), function (err, data) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(data.rows));
      res.end();
    });
  });
}
