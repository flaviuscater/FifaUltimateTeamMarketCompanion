const axios = require('axios');
const cheerio = require('cheerio');
const Player = require('./app/models/Player');

const url = 'https://www.futbin.com/20/players';

function getAllFutPlayers() {
    let fifaPlayers = [];

    for(let i = 1; i < 10; i ++) {
        axios(url + "?page=" + i)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const playersTableRows = $('#repTb > tbody > tr ');

                playersTableRows.each(function () {
                    let player = new Player();

                    player.imagePath = $(this).find('.player_img').attr('data-original');
                    const clubNationsLeague = $(this).find('.players_club_nation > a ');
                    player.club = clubNationsLeague.first().attr('data-original-title');
                    player.nationality = clubNationsLeague.first().next().attr('data-original-title');
                    player.league = clubNationsLeague.first().next().next().attr('data-original-title');

                    player.rating = $(this).find('.form.rating.ut20').text();
                    player.position = $(this).find('td').first().next().next().text();
                    player.psPrice = $(this).find('.ps4_color.font-weight-bold').text();

                    fifaPlayers.push(player);
                });
                console.log(fifaPlayers);
                return fifaPlayers;
            })
            .catch(console.error);
    }
}

console.log(getAllFutPlayers());
