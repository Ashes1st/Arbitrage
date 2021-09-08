const { Graph } = require('./files/Graph')
const { BigNumber } = require('bignumber.js');
const utils = require('./files/Utils');
const fs = require('fs');
const Web3 = require('web3');
const { infuraProjecSecure, network, infuraProjectId, privateKey } = require('./config');

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

let json = fs.readFileSync("./files/main_pairs.json", "utf-8");
const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://:" + infuraProjecSecure + "@" + network + ".infura.io/ws/v3/" + infuraProjectId));
const graph = new Graph(web3, json);

graph.findAllPathFor("WETH", 2);

console.log("Subsctiption turn on");
var subscription = web3.eth.subscribe('newBlockHeaders', async function(error, result){
    if (!error) {
        console.log("NewBlock");
        
        // graph.logUsedPairs();
        graph.updateReserves().then(()=>{
            graph.logInfo();
        });
        
        // if(false){
        //     let uReserves, uReserve0, uReserve1, sReserves, sReserve0, sReserve1
        
        //     eBN = BigNumber.clone({ DECIMAL_PLACES: 18 })
        //     uBN = BigNumber.clone({ DECIMAL_PLACES: 6 })
        //     //tokens reserves on uniswap
        //     uReserves = await uPair0.methods.getReserves().call()
        //     uReserve0 = eBN(uReserves[0]).div(eBN(eBN(10).pow(18))).toFixed(); //T0
        //     uReserve1 = uBN(uReserves[1]).div(uBN(uBN(10).pow(6))).toFixed(); //T1
        //     let uPrice = uReserve1/uReserve0;
    
        //     //tokens reserves on sushiswap
        //     sReserves = await sPair.methods.getReserves().call()
        //     sReserve0 = eBN(sReserves[0]).div(eBN(eBN(10).pow(18))).toFixed(); //T0
        //     sReserve1 = uBN(sReserves[1]).div(uBN(uBN(10).pow(6))).toFixed();
        //     let sPrice = sReserve1/sReserve0;
    
        //     var amountIn = 0;
    
        //     if(uPrice > sPrice){
        //         dirUtoS = false;
        //     } else {
        //         dirUtoS = true;
        //     }
        //     amountIn = utils.computeProfitMaximizing(uReserve0,uReserve1,sReserve0,sReserve1, result.number, dirUtoS);
    
        // }
        
        return;
    }

    console.error(error);
})
.on("connected", function(subscriptionId){
    console.log(subscriptionId);
})
.on("data", function(blockHeader){
    console.log(blockHeader.number);
})
.on("error", console.error);

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if (success) {
        console.log('Successfully unsubscribed!');
    }
});
