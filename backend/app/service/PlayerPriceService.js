const fetch = require("node-fetch");

const PlayerPriceService = {
    getPlayerPrice: function (futbinId) {
        // let result;
        console.log('https://www.futbin.com/21/playerPrices?player=' + futbinId);
        return fetch('https://www.futbin.com/21/playerPrices?player=' + futbinId)
        // const response = await fetch('https://www.futbin.com/20/playerPrices?player=' + futbinId)
        //return await response.json();
        // .then(response => response.json())
        // .then(data => {
        //     result = data[futbinId]["prices"]["ps"]["LCPrice"];
        //     // console.log(data[futbinId]["prices"]["ps"]["LCPrice"]);
        //     console.log(result);
        //     return result;
        // })
        // .catch(error => console.error(error));
    },

    getHourlyTodayPlayerPrice: function (futbinId) {
        console.log('https://www.futbin.com/21/playerGraph?type=today&year=21&player=' + futbinId);
        return fetch('https://www.futbin.com/21/playerGraph?type=today&year=21&player=' + futbinId)
            .then(response => response.json());
    },

    getDailyPlayerPrice: function (futbinId) {
        return fetch('https://www.futbin.com/21/playerGraph?type=daily_graph&year=21&player=' + futbinId)
            .then(response => response.json());
    },

    getDailyLowestPlayerPrice: function (data, platform) {
        let dailyPriceArray = data[platform];
        // Array element is of this type [1578355200000,357000]
        // basically take the second part which is the price
        if (dailyPriceArray == null) {
            //console.log("Untradable card, not calculating lowest daily price");
            return 0;
        }
        let minPrice = dailyPriceArray[0][1];
        for (let i = 1; i < dailyPriceArray.length; i++) {
            if (dailyPriceArray[i][1] < minPrice) {
                minPrice = dailyPriceArray[i][1];
            }
        }
        //console.log("Daily Lowest price is: ", minPrice);
        return minPrice;
    },

    getDailyHighestPlayerPrice: function (data, platform) {
        let dailyPriceArray = data[platform];
        // Array element is of this type [1578355200000,357000]
        // basically take the second part which is the price
        if (dailyPriceArray == null) {
            //console.log("Untradable card, not calculating highest daily price");
            return 0;
        }
        let maxPrice = dailyPriceArray[0][1];
        for (let i = 1; i < dailyPriceArray.length; i++) {
            if (dailyPriceArray[i][1] > maxPrice) {
                maxPrice = dailyPriceArray[i][1];
            }
        }
        //console.log("Daily Highest price is: ", maxPrice);
        return maxPrice;
    },
    constructDailyPlayerPrice: function (futbinId) {
        let playerPrice = {};
        let psPrice = {};
        let xboxPrice = {};
        let pcPrice = {};

        return this.getPlayerPrice(futbinId)
            .then(response => response.json())
            .then(data => {
                if (data[futbinId] === undefined) return;
                let fetchedPsPrice = data[futbinId]["prices"]["ps"]["LCPrice"];
                let fetchedXboxPrice = data[futbinId]["prices"]["xbox"]["LCPrice"];
                let fetchedPcPrice = data[futbinId]["prices"]["pc"]["LCPrice"];

                psPrice.currentPrice = typeof fetchedPsPrice === "string" ? parseInt(fetchedPsPrice.replace(/,/g, '')) : fetchedPsPrice;
                xboxPrice.currentPrice = typeof fetchedXboxPrice === "string" ? parseInt(fetchedXboxPrice.replace(/,/g, '')) : fetchedXboxPrice;
                pcPrice.currentPrice = typeof fetchedPcPrice === "string" ? parseInt(fetchedPcPrice.replace(/,/g, '')) : fetchedPcPrice;
            })
            .then(data => {
                return this.getHourlyTodayPlayerPrice(futbinId)
                    .then(data => {
                        psPrice.dailyLowestPrice = this.getDailyLowestPlayerPrice(data, "ps");
                        xboxPrice.dailyLowestPrice = this.getDailyLowestPlayerPrice(data, "xbox");
                        pcPrice.dailyLowestPrice = this.getDailyLowestPlayerPrice(data, "pc");

                        psPrice.dailyHighestPrice = this.getDailyHighestPlayerPrice(data, "ps");
                        xboxPrice.dailyHighestPrice = this.getDailyHighestPlayerPrice(data, "xbox");
                        pcPrice.dailyHighestPrice = this.getDailyHighestPlayerPrice(data, "pc");
                    })
                    .then(data => {
                        playerPrice.psPrice = psPrice;
                        playerPrice.xboxPrice = xboxPrice;
                        playerPrice.pcPrice = pcPrice;

                        return playerPrice
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    },
};

module.exports = PlayerPriceService;