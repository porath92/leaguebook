require('newrelic')
// Top-level dependencies
var express             = require('express'),
    http                = require('http'),
    path                = require('path'),
    hogan               = require('hogan-express'),
    favicon             = require('serve-favicon'),
    cookieParser        = require('cookie-parser'),
    bodyParser          = require('body-parser'),
    morgan              = require('morgan'),
    methodOverride      = require('method-override'),
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
app.use(cookieParser()); // Parse cookies to object

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(favicon(__dirname + '/public/images/lb_fav.ico'));
app.use(morgan('combined'))
app.use(methodOverride()); // Allow requests to set request method as param

//routes
//app.use(app.router); // Got through all that? Neat. Hit the app.
app.use(require('./routes/index')(app));
app.use(require('./routes/search')(app));
app.use(require('./routes/schools')(app));
app.use(require('./routes/registration')(app));
app.use(require('./routes/ajax')(app));

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
