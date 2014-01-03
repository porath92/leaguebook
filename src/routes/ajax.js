module.exports = function(app) {
  app.get('/ajax/schools', function(req, res) {
    app.psql.query(app.sql.select(['name', 'college_id'], 'college', "LOWER(name) LIKE LOWER('%" + req.query.name + "%')"), function (err, data) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(data.rows));
      res.end();
    });
  });
}