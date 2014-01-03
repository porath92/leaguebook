function routes(app) {
  var _ = require('underscore');
  
  app.get('/', function(req, res){

    var champions = [
      'Ahri','Akali','Alistar','Amumu','Anivia','Annie','Ashe','Blitzcrank','Brand',
      'Caitlyn','Cassiopeia','Chogath','Corki','Darius','Diana','DrMundo','Draven',
      'Elise','Evelynn','Ezreal','Fiddlesticks','Fiora','Fizz','Galio','Gangplank',
      'Garen','Gragas','Graves','Hecarim','Heimerdinger','Irelia','Janna','JarvanIV',
      'Jax','Jayce','Karma','Karthus','Kassadin','Katarina','Kayle','Kennen','Khazix',
      'Kogqaw','Leblanc','LeeSin','Leona','Lissandra','Lulu','Lux','Malphite','Malzahar',
      'Maokai','MasterYi','MissFortune','Mordekaiser','Morgana','Nami','Nasus','Nautilus',
      'Nidalee','Nocturne','Nunu','Olaf','Orianna','Pantheon','Poppy','Quinn','Rammus','Renekton',
      'Rengar','Riven','Rumble','Ryze','Sejuani','Shaco','Shen','Shyvana','Singed','Sion','Sivir',
      'Skarner','Sona','Soraka','Swain','Syndra','Talon','Taric','Teemo','Thresh','Tristana',
      'Trundle','Tryndamere','TwistedFate','Twitch','Udyr','Urgot','Varus','Vayne','Veigar','Vi',
      'Viktor','Vladimir','Volibear','Warwick','MonkeyKing','Xerath','XinZhao','Yorick','Zac',
      'Zed','Ziggs','Zilean','Zyra'
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
