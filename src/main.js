var express = require('express');
var http = require('http');
var path = require('path');
var engines = require('consolidate');
var viewsBase = path.join(__dirname, 'views');
var riotAPI = require('./helpers/riot_api');
var app = express();

//view engine
app.set('views', viewsBase);
app.set('view engine', 'html');
app.set("view options", { layout: true });
app.engine('.html', engines.handlebars);

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(riotAPI);
app.use(express.favicon());
app.use(express.methodOverride()); 
app.use(app.router); 

require('./routes')(app);

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function() {
    console.log('Listening on port ' + port);
});

module.exports = app;
