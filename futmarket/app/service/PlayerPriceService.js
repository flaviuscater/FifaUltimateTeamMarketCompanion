const PlayerPriceService = {
    getPlayerPrice: function (futbinId) {
        // let result;
        return fetch('https://www.futbin.com/20/playerPrices?player=' + futbinId)
            // .then(response => response.json())
            // .then(data => {
            //     result = data[futbinId]["prices"]["ps"]["LCPrice"];
            //     // console.log(data[futbinId]["prices"]["ps"]["LCPrice"]);
            //     console.log(result);
            //     return result;
            // })
            // .catch(error => console.error(error));
    }
};

export default PlayerPriceService;