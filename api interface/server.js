var express = require('express');  
var request = require('request');

var app = express();  
function proxy(){
  app.use('/', function(req, res) {
    var sid = req.query.sid;   
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamids="+ sid;    
    req.pipe(request(url)).pipe(res);
  });
}

try{
    proxy();
}catch(exception){
    proxy();
}

app.listen(process.env.PORT || 3000); 