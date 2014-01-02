module.exports = function(app) {

  app.get('/schools/:school', function(req, res) {
    
    res.render('builder',
    {
      layout: false,
      tournament: JSON.stringify(tournament)
    });
    
  });

  app.get('/schools/:school', function(req, res) {
    
    res.render('builder',
    {
      layout: false,
      tournament: JSON.stringify(tournament)
    });

  });
};