const process = require('process');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter{};

const price_update_event = new MyEmitter();

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
        if(prices[coin] !== data.askRate){
            prices[coin] = data.askRate;
            price_update_event.emit("price_update");
        }
    }, 3000);
}

Object.entries(prices).forEach(async(coin)=>{
    await update_price(coin[0]);
});

price_update_event.on("price_update", ()=>{
    process.stdout.write('\x1Bc')
    for(coin in prices){
        console.log(`${coin} --> ${prices[coin]}`);
    }
    console.log('updating prices in realtime....')
})