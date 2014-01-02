function routes(app) {
  app.get('/', function(req, res){
    res.render('index',
    {
      title: 'LeagueBook'
    });
  });

  //require('./registration')(app);
}

module.exports = routes;
