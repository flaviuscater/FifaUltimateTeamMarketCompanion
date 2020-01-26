const axios = require('axios');
const cheerio = require('cheerio');
require('./app/graphQL/config');
const Player = require('./app/models/Player');

const url = 'https://www.futbin.com/20/players';

function fetchAllFutPlayers() {
    let fifaPlayers = [];

    for (let i = 1; i <= 30; i++) {
        axios(url + "?page=" + i)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const playersTableRows = $('#repTb > tbody > tr ');

                playersTableRows.each(function () {
                    let player = new Player();

                    player.name = $(this).find('.player_name_players_table').text().replace(/\s*$/,"");
                    player.imagePath = $(this).find('.player_img').attr('data-original').replace(/\s*$/, "");
                    player._id = player.imagePath.substring(player.imagePath.lastIndexOf('/') + 1, (player.imagePath.lastIndexOf('.')));

                    //Remove 'p' character in some of the futbinIds (todo: make a more general solution if it's the case)
                    if (player._id.indexOf('p') > -1) {
                        player._id = player._id.substring(player._id.indexOf('p') + 1);
                    }
                    const clubNationsLeague = $(this).find('.players_club_nation > a ');
                    player.club = clubNationsLeague.first().attr('data-original-title').replace(/\s*$/, "");
                    player.nationality = clubNationsLeague.first().next().attr('data-original-title').replace(/\s*$/, "");
                    player.league = clubNationsLeague.first().next().next().attr('data-original-title').replace(/\s*$/, "");

                    player.rating = $(this).find('.form.rating.ut20').text();
                    player.position = $(this).find('td').first().next().next().text().replace(/\s*$/, "");
                    player.version = $(this).find('.mobile-hide-table-col').text();
                    // skip CL players due to having the same id as gold cards
                    if (player.version === "CL") {
                        return;
                    }

                    fifaPlayers.push(player);
                    // player.save()
                    //     .catch(error => console.log(error));

                    Player.findOneAndUpdate({
                        _id: player._id
                    }, player, {upsert: true}, function (err, res) {
                        if (err != null) {
                            console.log(err);
                        } else if(res != null) {
                            console.log(res)
                        }
                    })
                });
                //console.log(fifaPlayers);
            })
            .catch(console.error);
    }

    /*    Player.insertMany(fifaPlayers, {ordered: false})
            .catch(error => console.log(error))*/
}

fetchAllFutPlayers();
