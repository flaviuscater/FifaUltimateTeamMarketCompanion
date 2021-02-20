const axios = require('axios');
const cheerio = require('cheerio');
require('./app/repository/repository');
const Player = require('./app/models/persistence/Player');
const playerPriceService = require('./app/service/PlayerPriceService');

const url = 'https://www.futbin.com/21/players';

function fetchAllFutPlayers() {
    let fifaPlayers = [];

    for (let i = 1; i <= 31; i++) {
        axios(url + "?page=" + i)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const playersTableRows = $('#repTb > tbody > tr ');

                playersTableRows.each(function () {
                    let player = new Player();

                    player.name = $(this).find('.player_name_players_table').text().replace(/\s*$/, "");
                    player.imageUrl = $(this).find('.player_img').attr('data-original').replace(/\s*$/, "");
                    player._id = player.imageUrl.substring(player.imageUrl.lastIndexOf('/') + 1, (player.imageUrl.lastIndexOf('.')));

                    //Remove 'p' character in some of the futbinIds (todo: make a more general solution if it's the case)
                    if (player._id.indexOf('p') > -1) {
                        player._id = player._id.substring(player._id.indexOf('p') + 1);
                    }
                    const clubNationsLeague = $(this).find('.players_club_nation > a ');
                    player.club = clubNationsLeague.first().attr('data-original-title').replace(/\s*$/, "");
                    player.nationality = clubNationsLeague.first().next().attr('data-original-title').replace(/\s*$/, "");
                    player.league = clubNationsLeague.first().next().next().attr('data-original-title').replace(/\s*$/, "");

                    player.rating = $(this).find('.form.rating.ut21').text();
                    player.position = $(this).find('td').first().next().next().text().replace(/\s*$/, "");
                    player.version = $(this).find('.mobile-hide-table-col').text();
                    // skip CL players due to having the same id as gold cards
                    if (player.version === "CL" || player.version === "Icon") {
                        return;
                    }
                    // playerPriceService.constructDailyPlayerPrice(player._id)
                    //     .then( async playerPrice => {
                    //         player.currentPrice = playerPrice.psPrice.currentPrice;
                    //         // sleep 2 seconds

                    //         if (player.currentPrice > 0) {

                                Player.findOneAndUpdate({
                                    _id: player._id
                                }, player, {upsert: true}, function (err, res) {
                                    if (err != null) {
                                        console.log(err);
                                    } else if (res != null) {
                                        console.log(res)
                                    }
                                })
                            // }

                            // await new Promise(r => setTimeout(r, 3000));
                        // });

                    fifaPlayers.push(player);
                    // player.save()
                    //     .catch(error => console.log(error));
                });
                //console.log(fifaPlayers);
            })
            .catch(console.error);
    }
    console.log("Finished Scraping all the players")

    /*    Player.insertMany(fifaPlayers, {ordered: false})
            .catch(error => console.log(error))*/
}

fetchAllFutPlayers();
