var _ = require('underscore');

module.exports = function(app) {
  app.get('/search', function(req, res) {
    app.psql.query("SELECT * FROM college WHERE (LOWER(name) LIKE LOWER('%" + req.query.keyword + "%')) ORDER BY name", function (err, data) {

      res.render('search',
      {
        keyword: req.query.keyword,
        schools: data.rows
      });
    });
  });
};
