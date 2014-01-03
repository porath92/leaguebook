var _ = require('underscore');

module.exports = function(app) {

  app.get('/schools', function(req, res) {

    app.psql.query('SELECT name, slug FROM college ORDER BY name', function (err, data) {

      res.render('schools-index',
      {
        schools: data.rows
      });
    });

  });

  app.get('/schools/:school', function(req, res) {

    var summoners = [
      {
        rank: 1,
        summoner: 'Shockem'
      },
      {
        rank: 2,
        summoner: 'ClayBot9000'
      }
    ];

    res.render('schools-show',
    {
      school: 'College of Saint Rose',
      summoners: summoners
    });

  });
};
