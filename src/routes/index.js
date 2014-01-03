function routes(app) {
  var _ = require('underscore');
  
  app.get('/', function(req, res){
    
    var registered = (req.query.r == 1) ? false : true;
    res.render('index',
    {
      registered: registered
    });
    
  });

  require('./ajax')(app);
  require('./registration')(app);
  require('./schools')(app);
}

module.exports = routes;
