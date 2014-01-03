function routes(app) {
  var _ = require('underscore');
  
  app.get('/', function(req, res){

    var champions = [
      'Jinx',
      'Ashe',
      'Nocturne',
      'Hecarim'
    ];
    var champion = champions[Math.floor(Math.random() * champions.length)];
    
    var registered = (req.query.r == 1) ? false : true;
    res.render('index',
    {
      champion: champion,
      registered: registered
    });
    
  });

  require('./ajax')(app);
  require('./registration')(app);
  require('./schools')(app);
}

module.exports = routes;
