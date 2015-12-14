$(function() {
    $('#all').hide();
    serverHost = "http://localhost:3000//";
    loadUserPreviews();    
});

$("#idform").submit(function(e) {
    e.preventDefault();
    submit();
});

var playerPreviewList = ["76561198025207102", "76561197967853593", "76561198023545004", "76561198028934613", "76561197984820423", "76561198056146892"];

function submit() { // JD: 2, 6
    $('#all').show();
    $(document).ready(function() { // JD: 3, 6, 14, 19
        document.getElementById("main").innerHTML = ""; // JD: 18
        document.getElementById("userInfo").innerHTML = "";
        document.getElementById("profilePicture").innerHTML = "";
        document.getElementById("profileInfo").innerHTML = "";
        document.getElementById("gameStats").innerHTML = "";
        document.getElementById("recentGames").innerHTML = "";

        // JD: 20
        document.getElementById("loader").innerHTML = '<div class="alert alert-info"' 
        + 'role="alert"><strong>Loading User Info</strong> Please wait momentarily</div>';

        sid = document.getElementById("idform").elements[0].value; // JD: 18
        console.log(sid);        

        // JD: 21
        $.getJSON(serverHost + "?sid=", {
            sid: sid,
            flag: 1
        }, function(result) { // JD: 3, 6
            document.getElementById("main").innerHTML = ""; // JD: 18
            console.log(result);
            var user = result.response.players[0]; // JD: 22
            if (user !== undefined) {
                var vState = user.communityvisibilitystate;
                
                loadProfilePicture(user);
                loadUserInfo(user);
                loadProfileInfo(user, vState);
                loadGameplayStats(user, vState);
                loadRecentGames(user);
                
                document.getElementById("loader").innerHTML = "";
            } else {
                document.getElementById("loader").innerHTML = '<div class="alert alert-danger" role="alert">' 
                + '<strong>User Could Not Be Found</strong> Please input an existing steam user id</div>';
            }
        });


    });
} // JD: 31

function loadUserPreviews() {
    var sidUrl = "";
    for (var i=0; i< playerPreviewList.length; i++){
        sidUrl += playerPreviewList[i];
        if(i < playerPreviewList.length-1){
            sidUrl+=",";
        }
    }
    $.getJSON(serverHost + "?sid=", {
        sid: sidUrl,
        flag: 1
    }, function(result) {
        console.log(result);
        for (var i=0; i<result.response.players.length; i++){
            var picture = result.response.players[i].avatarfull;
            picture = newImage("" + picture);
            document.getElementById("previewUsers").appendChild(picture);
        }

        $("#previewUsers").children().dragAndDrop();
    });
}

function newImage(src) { // JD: 2
    var img = document.createElement("img");
    img.src = src;
    return img;
}

function processTime(timeStamp) { // JD: 2, 6
    var date = new Date(timeStamp * 1000); // JD: 7
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var hours = date.getHours();
    var night = "AM";
    if (hours >= 12) { // JD: 6, 15
        night = "PM";
        if (hours !== 12) {
            hours = hours - 12;
        } // JD: 16
    }
    if (hours === 0) {
        hours = 12;
    } // JD: 16, 17
    var day = "0" + date.getDate();
    var minutes = "0" + date.getMinutes();
    // JD: 15
    return (month + ' ' + day.substr(-2) + ' ' + year + ' at ' + hours + ':' + minutes.substr(-2) + ' ' + night);
}

function processPlaytime(minutes) { // JD: 2, 6
    if (minutes < 60) { // JD: 6
        var unit = " minute";
        if (minutes > 1) {
            unit += "s";
        } // JD: 7, 16
        return minutes + unit;
    }
    var hours = minutes / 60; // JD: 7
    hours = Math.round(hours * 10) / 10;
    if (hours < 24) {
        var unit = " hour";
        if (hours > 1) {
            unit += "s";
        } // JD: 7, 16
        return hours + unit;
    }
    var days = hours / 24; // JD: 7
    days = Math.round(days * 10) / 10;
    if (days < 365) {
        var unit = " day";
        if (days > 1) {
            unit += "s";
        } // JD: 7, 16
        return days + unit + " or " + hours + " hours";
    }
    var years = days / 365; // JD: 7
    years = Math.round(years * 10) / 10;
    var unit = " year";
    if (years > 1) {
        unit += "s";
    } // JD: 7, 16
    return years + unit + " or " + days + " days or " + hours + " hours"; // JD: 12

}

function place(output, element) { // JD: 2, 6
    if (element === undefined) {
        element = "main";
    } // JD: 5, 16, 17
    document.getElementById(element).appendChild(document.createTextNode(output)); // JD: 18
    document.getElementById(element).appendChild(document.createElement("br"));
}

function loadProfilePicture(user) {
    document.getElementById("profilePicture").appendChild(newImage("" + user.avatarfull));
}

function loadOnlineState(user) {
    var pState = user.personastate;
    var output = "User is: ";
    var state = "info";
    if (pState === 0) { // JD: 6, 15, 24
        output += "Offline";
        state = "danger";
    } else if (pState === 1) {
        output += "Online";
        state = "success";
    } else if (pState === 2) {
        output += "Busy";
    } // JD: 16, 17, 25
    else if (pState === 3) {
        output += "Away";
    } // JD: 16, 17, 25
    else if (pState === 4) {
        output += "Snooze";
    } // JD: 16, 17, 25
    else if (pState === 5) {
        output += "Looking to trade";
    } // JD: 16, 17, 25
    else if (pState === 5) {
        output += "Looking to play";
    } // JD: 16, 17, 25
    // JD: 18, 20
    document.getElementById("userInfo").innerHTML += "<h3><span class='label label-" + state 
    + "'>" + output + "</span><br></h3>"

    if (pState === 0) { // JD: 6, 15, 17
        place("Last online: " + processTime(user.lastlogoff), "userInfo");
    } else { // JD 6
        if (user.gameextrainfo) { // JD: 6, 15
            place("Currently playing : " + user.gameextrainfo, "userInfo"); // JD: 18, 26
        } else {
            place("Not currently in game", "userInfo");
        }
    }
}

function loadRealNameandLocation(user) {
    if (user.realname) {
        place("Real name : " + user.realname, "userInfo");
    } // JD: 6, 15, 16
    var country = user.loccountrycode;
    var state = user.locstatecode;
    var city = user.loccityid;


    $.getJSON("https://raw.githubusercontent.com/Holek/steam-friends-countries/master/data/steam_countries.json", function(result) {
        if (country) {
            country = result[country];
            state = country.states[state];
            city = state.cities[city];
            if (state) {
                state = state.name + ","
            } else {
                state = "";
            } // JD: 28
            if (city) {
                city = city.name + ","
            } else {
                city = "";
            }
            place("Lives in : " + city + " " + state + " " + country.name, "userInfo");
        }
        if (user.steamid === "76561198023545004") {
            document.getElementById("userInfo").innerHTML += "<mark>★ ☆ Creator of this webapp!☆ ★ </mark>";
        }
    });
}

function loadUserInfo(user) {
    var name = document.createElement("h3") // JD: 18
    name.appendChild(document.createTextNode(user.personaname));
    document.getElementById("userInfo").appendChild(name);
    loadOnlineState(user);
    loadRealNameandLocation(user);
}

function loadProfileInfo(user, vState) {
    place('');
    place("Steam id: " + user.steamid, "profileInfo");
    if (user.timecreated) {
        place("Profile created on: " + processTime(user.timecreated), "profileInfo");
    }
    var output = "Profile access : ";
    if (vState === 1) {
        output += "Private";
    } else if (vState === 2) {
        output += "Friends only";
    } else if (vState === 3) {
        output += "Friends of friends";
    } else if (vState === 4) {
        output += "Users only";
    } else if (vState === 5) {
        output += "Public";
    }
    place(output, "profileInfo");
    var profileLink = "Steam Community Profile Page".link("http://steamcommunity.com/profiles/" + user.steamid);
    document.getElementById("profileInfo").innerHTML += profileLink;
    place('', "profileInfo")
    place('', "profileInfo")
}

function loadGameplayStats(user, vState) {

    if (vState !== 1) {
        // JD: 29
        $.getJSON(serverHost + "?sid=", {
            sid: sid,
            flag: 2
        }, function(result) {
            console.log(result);
            var userGames = result.response;

            if (userGames.game_count) {
                place("Games owned : " + userGames.game_count, "gameStats");
                var totalPlaytime = 0;
                var playedGames = 0;
                for (i in userGames.games) {
                    var playtime = userGames.games[i].playtime_forever;
                    totalPlaytime += playtime;
                    if (playtime > 10) {
                        playedGames += 1;
                    }
                }
                var totalPlayedPercent = (playedGames / userGames.game_count) * 100;
                totalPlayedPercent = Math.round(totalPlayedPercent * 10) / 10;
                var averagePlaytime = totalPlaytime / playedGames;
                averagePlaytime = Math.round(averagePlaytime * 10) / 10;
                place("Total time in-game : " + processPlaytime(totalPlaytime), "gameStats");
                place("Played : " + totalPlayedPercent + "% of owned games (" + playedGames + '/' + userGames.game_count + ')', "gameStats");
                place("Average playtime per game : " + processPlaytime(averagePlaytime), "gameStats");
                place('', "gameStats");
            } else {
                place("User owns no games", "gameStats");
                place('', "gameStats");
                place('', "gameStats");
                place('', "gameStats");
                place('', "gameStats");
            }
        });
    } else {
        place('No public game statistics', "gameStats");
        place('', "gameStats");
        place('', "gameStats");
        place('', "gameStats");
    }
}

function loadRecentGames(user) {
    $.getJSON(serverHost + "?sid=", {
        sid: sid,
        flag: 3
    }, function(result) {
        console.log(result);
        if (result.response.games) {
            var games = result.response.games;
            for (var i = 0; i < games.length; i++) {
                if (games[i].name === undefined) {
                    continue;
                }
                var src = "http://media.steampowered.com/steamcommunity/public/images/apps/" 
                + games[i].appid + "/" + games[i].img_logo_url + ".jpg";
                var name = document.createElement("h4")
                name.appendChild(document.createTextNode(games[i].name));
                document.getElementById("recentGames").appendChild(name)
                document.getElementById("recentGames").appendChild(newImage(src));
                place("", "recentGames");
                place("Last two weeks played : " + processPlaytime(games[i].playtime_2weeks), "recentGames");
                place("Total playtime : " + processPlaytime(games[i].playtime_forever), "recentGames");
                place('', "recentGames");
            }
        } else {
            place("No recently played games", "recentGames")
        }

    });
}