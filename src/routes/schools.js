module.exports = function(app) {

  app.get('/schools', function(req, res) {

    var schools = [
      {
        rank: 1,
        name: 'College of Saint Rose',
        slug: 'college-of-saint-rose',
        summoner_count: 2
      },
      {
        rank: 2,
        name: 'Harvard University',
        slug: 'harvard-university',
        summoner_count: 1
      }
    ];

    res.render('schools-index',
    {
      schools: schools
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
