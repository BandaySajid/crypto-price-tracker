const process = require('process');
//BTC-USD

const prices = {};
if(!process.argv[2]){
    return console.log('please supply some coins in argument, example : BTC !');
};

for (const coin of process.argv.slice(2)){
    prices[coin] = 0.00;
}

async function update_price(coin){
    const url = `https://api.bittrex.com/v3/markets/${coin.toUpperCase()}-USD/ticker`;
    setInterval(async()=>{
        const resp = await fetch(url, {
            method : 'GET',
            header : {
                'Content-Type' : 'application/json'
            }
        });
        const data = await resp.json();
        prices[coin] = data.askRate;
    }, 3000);
}

Object.entries(prices).forEach(async(coin)=>{
    await update_price(coin[0]);
});

setInterval(()=>{
    process.stdout.write('\x1Bc')
    console.log(prices);
}, 500)