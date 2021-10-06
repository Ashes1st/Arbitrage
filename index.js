const { Graph } = require('./files/Graph')
const { BigNumber } = require('bignumber.js');
const utils = require('./files/Utils');
const fs = require('fs');
const Web3 = require('web3');
const { infuraProjecSecure, network, infuraProjectId } = require('./config');

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

let json = fs.readFileSync("./files/pairs.json", "utf-8");
const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://young-polished-dew.bsc.quiknode.pro/5b7143ea2f5c8dabdc55045a218c2bcc9880fe69/"));

const graph = new Graph(web3);
graph.fetchInfo(json);
graph.findAllPathes(2);
console.log("Finded");

console.log("Subsctiption turn on");
var subscription = web3.eth.subscribe('newBlockHeaders', async function(error, result){
    if (!error) {
        // console.log("new block");
        graph.updateReserves().then(()=>{
            // console.log("===========START===========");
            graph.searchOpportunity();
            // console.log("============END============");
        });
        
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
