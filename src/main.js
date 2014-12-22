require('newrelic')
// Top-level dependencies
var express             = require('express'),
    http                = require('http'),
    path                = require('path'),
    hogan               = require('hogan-express'),
    riotAPI             = require('./helpers/riot_api');
    // APPLICATION
    app                 = express();
// Get view engine config
var viewEngine = 'html',
    viewsBase = path.join(__dirname, 'views'),
    layoutDefault = path.join(viewsBase, 'layouts', 'default.html');

// Configure view engine
app.set('views', viewsBase);
app.set('layout', layoutDefault);
app.set('view engine', viewEngine);
app.engine('html', hogan);

// Layer up the middleware
app.use(express.static(path.join(__dirname, 'public'))); // Public folder first, before constraint middleware
app.use(express.cookieParser()); // Parse cookies to object
app.use(express.bodyParser()); // Parse form params to object

app.use(express.favicon()); // derp
app.use(express.logger('dev')); // TODO configure me from config object
app.use(express.methodOverride()); // Allow requests to set request method as param
app.use(require('./helpers/db').connect);
app.use(app.router); // Got through all that? Neat. Hit the app.

// Handle 404
app.use(function(req, res) {
  res.status(404);
  res.render('404', {title: '404: File Not Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500);
  res.render('500', {title:'500: Internal Server Error', error: error});
});

require('./routes')(app);
  
var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function() {
  console.log('Listening on port ' + port);
});
  
module.exports = app;
