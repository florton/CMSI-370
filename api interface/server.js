var express = require('express');  
var request = require('request');

var app = express();  
function proxy(){
  app.use('/', function(req, res) {
    var sid = req.query.sid[1].trim();
    var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamids="    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    
    if (!/[\d]{17}/.test(sid)) {
        request("http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&&vanityurl="+sid
        , function (error, response, body){
           var newid = JSON.parse(body).response.steamid
           req.pipe(request(url+newid)).pipe(res);
        });
    }else{
        req.pipe(request(url+sid)).pipe(res);
    }  

  });
}

try{
    proxy();
}catch(exception){
    proxy();
}

app.listen(process.env.PORT || 3000); 