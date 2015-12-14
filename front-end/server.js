var express = require('express'); // JD: 1
var request = require('request');
var app = express();

function proxy() { // JD: 2
    app.use('/', function(req, res) { // JD: 3
        console.log(req.query);
        var sid = req.query.sid[1].trim();
        var flag = req.query.flag;
        // JD: 4
        var GetPlayerSummaries = "ISteamUser/GetPlayerSummaries/v0002/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamids=";
        var ResolveVanityUrl = "ISteamUser/ResolveVanityURL/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&vanityurl=";
        var RecentlyPlayedGames = "IPlayerService/GetRecentlyPlayedGames/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamid=";
        var GetOwnedGames = "IPlayerService/GetOwnedGames/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamid=";
        var url = "http://api.steampowered.com/"

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(url + ResolveVanityUrl + sid, function(error, response, body) { // JD: 3
            var newid = JSON.parse(body).response.steamid // JD: 5
            if (newid !== undefined) {
                sid = newid;
            }
            if (flag === '1') { // JD: 6
                url += GetPlayerSummaries + sid; // JD: 7
            } else if (flag === '2') { // JD: 6 (2x)
                url += GetOwnedGames + sid + "&include_played_free_games=1"; // JD: 7
            } else if (flag === '3') { // JD: 6 (2x)
                url += RecentlyPlayedGames + sid; // JD: 7
            }
            console.log(res);
            req.pipe(request(url)).pipe(res);
        });
    });
}

proxy();
app.listen(process.env.PORT || 3000);