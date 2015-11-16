    $(function() {
        $('#all').hide();
    }); // JD: 14
    
    $("#idform").submit(function(e){
        e.preventDefault();
        submit();
    });    
    
    function newImage(src) { // JD: 2
        var img = document.createElement("img");
        img.src = src;
        img.hspace=0; // JD: 7, 23
        img.vspace=0; // JD: 7, 23
        return img;
    }

    function processTime(timeStamp){ // JD: 2, 6
        var date = new Date(timeStamp*1000); // JD: 7
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var hours = date.getHours();
        var night = "AM";
        if(hours >= 12){ // JD: 6, 15
            night = "PM";
            if(hours!==12){hours = hours - 12;}    // JD: 16
        }
        if(hours == 0){hours = 12;} // JD: 16, 17
        var day = "0" + date.getDate();
        var minutes = "0" + date.getMinutes();
        // JD: 15
        return(month + ' ' + day.substr(-2) + ' ' +year + ' at ' + hours + ':' + minutes.substr(-2) + ' ' + night);
    }
    
    function processPlaytime(minutes){ // JD: 2, 6
        if (minutes < 60){ // JD: 6
            var unit = " minute";
            if(minutes>1){unit += "s";} // JD: 7, 16
            return minutes + unit;
        }
        var hours = minutes/60; // JD: 7
        hours = Math.round(hours * 10) / 10;
        if (hours < 24) {
            var unit = " hour";
            if(hours>1){unit += "s";} // JD: 7, 16
            return hours + unit;
        }
        var days = hours/24; // JD: 7
        days = Math.round(days * 10) / 10;
        if (days < 365) {
            var unit = " day";
            if(days>1){unit += "s";} // JD: 7, 16
            return days + unit + " or " + hours + " hours";
        }
        var years = days/365; // JD: 7
        years = Math.round(years * 10) / 10;
        var unit = " year";
        if(years>1){unit += "s";} // JD: 7, 16
            return years + unit + " or " + days + " days or " + hours + " hours"; // JD: 12
        
    }

    function place(output, element){ // JD: 2, 6
        if(element == undefined ){element = "main"} // JD: 5, 16, 17
        document.getElementById(element).appendChild(document.createTextNode(output)); // JD: 18
        document.getElementById(element).appendChild(document.createElement("br"));
    }
            
    function submit(){       // JD: 2, 6
        
        $('#all').show();
        $(document).ready(function(){ // JD: 3, 6, 14, 19
            document.getElementById("main").innerHTML = ""; // JD: 18
            document.getElementById("userInfo").innerHTML = "";
            document.getElementById("profilePicture").innerHTML = "";
            document.getElementById("profileInfo").innerHTML = "";
            document.getElementById("gameStats").innerHTML = "";
            document.getElementById("recentGames").innerHTML = "";

            // JD: 20
            document.getElementById("loader").innerHTML ='<div class="alert alert-info" role="alert"><strong>Loading User Info</strong> Please wait momentarily</div>';
            
            var sid = document.getElementById("idform").elements[0].value; // JD: 18
            console.log(sid);

            // JD: 21
            $.getJSON("http://localhost:3000//?sid=", {sid:sid, flag:1}, function(result){ // JD: 3, 6
                document.getElementById("main").innerHTML = ""; // JD: 18
                console.log(result);
                var user = result.response.players[0]; // JD: 22
                
                //profilePicture
                
                document.getElementById("profilePicture").appendChild(newImage(""+user.avatarfull));
                
                //userInfo
                
                var name = document.createElement("h3") // JD: 18
                name.appendChild(document.createTextNode(user.personaname));
                document.getElementById("userInfo").appendChild(name);
                
                var pState = user.personastate;
                var output = "User is: ";
                var state = "info";
                if(pState == 0){ // JD: 6, 15, 24
                    output += "Offline"; 
                    state = "danger";
                } // JD: 25
                else if(pState == 1){
                    output += "Online";
                    state = "success";
                }
                else if(pState == 2){output += "Busy";} // JD: 16, 17, 25
                else if(pState == 3){output += "Away"; } // JD: 16, 17, 25
                else if(pState == 4){output += "Snooze"; } // JD: 16, 17, 25
                else if(pState == 5){output += "Looking to trade"; } // JD: 16, 17, 25
                else if(pState == 5){output += "Looking to play"; } // JD: 16, 17, 25
                // JD: 18, 20
                document.getElementById("userInfo").innerHTML += "<h3><span class='label label-"+state+"'>"+output+"</span><br></h3>"
                
                if(pState == 0){ // JD: 6, 15, 17
                    place("Last online: " + processTime(user.lastlogoff), "userInfo");
                }else{ // JD 6
                    if(user.gameextrainfo){ // JD: 6, 15
                        place("Currently playing : " + user.gameextrainfo, "userInfo"); // JD: 18, 26
                    }else{
                        place("Not currently in game", "userInfo");
                    }
                }
                
                if(user.realname){place("Real name : " + user.realname, "userInfo");} // JD: 6, 15, 16
                var country = user.loccountrycode;
                var state = user.locstatecode;
                var city = user.loccityid;

                // JD: 27

                $.getJSON("https://raw.githubusercontent.com/Holek/steam-friends-countries/master/data/steam_countries.json", function(result){
                    if(country){
                        country = result[country];
                        state = country.states[state];
                        city = state.cities[city];
                        if(state){state = state.name + ","}else{state = '';} // JD: 28
                        if(city){city = city.name + ","}else{city = '';}
                        place("Lives in : " + city + " " + state + " " + country.name, "userInfo");
                    }
                    if(user.steamid == 76561198023545004){
                        document.getElementById("userInfo").innerHTML += "<mark>★ ☆ Creator of this webapp!☆ ★ </mark>";
                    }
                });
                
                //profileInfo
                
                place('');                
                place("Steam id: " + user.steamid, "profileInfo");
                
                if(user.timecreated){place("Profile created on: " + processTime(user.timecreated), "profileInfo");}
                
                var vState = user.communityvisibilitystate;
                var output = "Profile access : ";
                if(vState == 1){output += "Private";}
                else if(vState == 2){output += "Friends only";}
                else if(vState == 3){output += "Friends of friends";}
                else if(vState == 4){output += "Users only"; }
                else if(vState == 5){output += "Public"; }
                place(output, "profileInfo");
                document.getElementById("profileInfo").innerHTML+="Steam Community Profile Page".link("http://steamcommunity.com/profiles/"+user.steamid);
                place('', "profileInfo")
                place('', "profileInfo")
                
                //gameStats
                if(vState!==1){
                    // JD: 29
                    $.getJSON("http://localhost:3000//?sid=", {sid:sid, flag:2}, function(result){
                        console.log(result);
                        var userGames = result.response;

                        if(userGames.game_count){place("Games owned : " + userGames.game_count, "gameStats");}
                        
                        var totalPlaytime = 0;
                        var playedGames = 0;
                        for(i in userGames.games){
                            var playtime = userGames.games[i].playtime_forever;
                            // JD: 30
                            if(userGames.games[i].appid == 570){console.log(playtime);}
                            totalPlaytime += playtime;
                            if(playtime > 10){playedGames+=1;}
                            
                        }
                        var totalPlayedPercent = (playedGames/userGames.game_count)*100;
                        totalPlayedPercent = Math.round(totalPlayedPercent * 10) / 10;
                        var averagePlaytime = totalPlaytime/playedGames;
                        averagePlaytime = Math.round(averagePlaytime * 10) / 10;
                        
                        console.log(totalPlaytime)
                        console.log(averagePlaytime)
                        place("Total time in-game : " + processPlaytime(totalPlaytime), "gameStats");
                        place("Played : " + totalPlayedPercent + "% of owned games (" + playedGames + '/' + userGames.game_count + ')', "gameStats");
                        place("Average playtime per game : " + processPlaytime(averagePlaytime), "gameStats");
                        place('', "gameStats"); 
                    });
                }else{
                    place('No public game statistics', "gameStats"); 
                    place('', "gameStats"); 
                    place('', "gameStats"); 
                    place('', "gameStats"); 
                }
                //recentGames
                
                $.getJSON("http://localhost:3000//?sid=", {sid:sid, flag:3}, function(result){
                    console.log(result);
                    if (result.response.games){                        
                        var games = result.response.games;
                        for(var i=0; i<games.length; i++){
                            if(games[i].name == undefined){continue;}                     
                            var src = "http://media.steampowered.com/steamcommunity/public/images/apps/"+ games[i].appid + "/" + games[i].img_logo_url + ".jpg";
                            var name = document.createElement("h4")
                            name.appendChild(document.createTextNode(games[i].name));
                            document.getElementById("recentGames").appendChild(name)
                            document.getElementById("recentGames").appendChild(newImage(src));                        
                            place("", "recentGames");
                            place("Last two weeks played : " + processPlaytime(games[i].playtime_2weeks), "recentGames");
                            place("Total playtime : " + processPlaytime(games[i].playtime_forever), "recentGames");
                            place('', "recentGames");
                        }
                    }else{
                        place("No recently played games", "recentGames")
                    }
                    
                });
                
                document.getElementById("loader").innerHTML = "";
                
            });
            

        });
    } // JD: 31