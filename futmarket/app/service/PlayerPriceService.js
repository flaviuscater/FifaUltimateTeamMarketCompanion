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
    },

    getDailyPlayerPrice: function (futbinId) {
        return fetch('https://www.futbin.com/20/playerGraph?type=today&year=20&player=' + futbinId)
    },

    getDailyLowestPlayerPrice: function (data, platform) {
        let dailyPriceArray = data[platform];
        // Array element is of this type [1578355200000,357000]
        // basically take the second part which is the price
        let minPrice = dailyPriceArray[0][1];
        for (let i = 1; i < dailyPriceArray.length; i++) {
            if (dailyPriceArray[i][1] < minPrice) {
                minPrice = dailyPriceArray[i][1];
            }
        }
        console.log("Daily Lowest price is: ", minPrice);
        return minPrice;
    },

    getDailyHighestPlayerPrice: function (data, platform) {
        let dailyPriceArray = data[platform];
        // Array element is of this type [1578355200000,357000]
        // basically take the second part which is the price
        let maxPrice = dailyPriceArray[0][1];
        for (let i = 1; i < dailyPriceArray.length; i++) {
            if (dailyPriceArray[i][1] > maxPrice) {
                maxPrice = dailyPriceArray[i][1];
            }
        }
        console.log("Daily Highest price is: ", maxPrice);
        return maxPrice;
    }
};

export default PlayerPriceService;