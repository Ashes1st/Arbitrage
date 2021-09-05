const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Token } = require('@uniswap/sdk');
const sushiSwapAPI = require('sushiswap-api');
const fs = require('fs');
// const _graph = require('./files/Graph.js');
const Web3 = require('web3');
const { ethers } = require('ethers');
const { infuraProjecSecure, network, infuraProjectId, privateKey } = require('./config');
const { BigNumber } = require('bignumber.js');
const utils = require('./files/Utils');

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

//ABIs
const IFactory = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const IPair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');  

const IRouter = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
// const Utils = require('../build/contracts/Utils.json')
const IERC20 = require('@uniswap/v2-periphery/build/IERC20.json')

const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const addrUFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const addrURouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const addrSFactory = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";
const addrSRouter = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";

const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://:" + infuraProjecSecure + "@" + network + ".infura.io/ws/v3/" + infuraProjectId));

//contracts
const uFactory = new web3.eth.Contract(IFactory.abi,addrUFactory)
const uRouter = new web3.eth.Contract(IRouter.abi,addrURouter)
const sFactory = new web3.eth.Contract(IFactory.abi,addrSFactory)//sushiswap, same ABIs, sushiswap forked uniswap so, basically same contracts
const sRouter = new web3.eth.Contract(IRouter.abi,addrSRouter)
const token0 = new web3.eth.Contract(IERC20.abi,wethAddress)//henceforth T0
const token1 = new web3.eth.Contract(IERC20.abi,usdtAddress)//and T1

//asyncs variables
let uPair0,uPair1,sPair,myAccount,token0Name,token1Name,token0Symbol,token1Symbol
var dirUtoS = true
async function asyncsVar() {
    //will be used to determine eth price later
    uPair0 = new web3.eth.Contract(IPair.abi, (await uFactory.methods.getPair(wethAddress, usdtAddress).call()) )
    //token pairs
    uPair1 = new web3.eth.Contract(IPair.abi, (await uFactory.methods.getPair(token0.options.address, token1.options.address).call()) )
    sPair = new web3.eth.Contract(IPair.abi, (await sFactory.methods.getPair(token0.options.address, token1.options.address).call()) )

    //account with you will be using to sign the transactions
    const accountObj = await web3.eth.accounts.privateKeyToAccount(privateKey)
    myAccount = accountObj.address

    token0Name = await token0.methods.name().call()
    token0Symbol = await token0.methods.symbol().call()
    token1Name = await token1.methods.name().call()
    token1Symbol = await token1.methods.symbol().call()
}

asyncsVar()

console.log("Subsctiption turn on");
var subscription = web3.eth.subscribe('newBlockHeaders', async function(error, result){
    if (!error) {
        let uReserves, uReserve0, uReserve1, sReserves, sReserve0, sReserve1
        
        eBN = BigNumber.clone({ DECIMAL_PLACES: 18 })
        uBN = BigNumber.clone({ DECIMAL_PLACES: 6 })
        //tokens reserves on uniswap
        uReserves = await uPair0.methods.getReserves().call()
        uReserve0 = eBN(uReserves[0]).div(eBN(eBN(10).pow(18))).toFixed(); //T0
        uReserve1 = uBN(uReserves[1]).div(uBN(uBN(10).pow(6))).toFixed(); //T1
        let uPrice = uReserve1/uReserve0;

        //tokens reserves on sushiswap
        sReserves = await sPair.methods.getReserves().call()
        sReserve0 = eBN(sReserves[0]).div(eBN(eBN(10).pow(18))).toFixed(); //T0
        sReserve1 = uBN(sReserves[1]).div(uBN(uBN(10).pow(6))).toFixed();
        let sPrice = sReserve1/sReserve0;
        // console.log(uReserves)
        // console.log(sReserves)
        //UNISWAP 3009
        var u0 = 7133480;
        var u1 = 2350;
        //SUSHISWAP 3035
        var s0 = 129501070;
        var s1 = 43026;
        var amountIn = 0;

        if(uPrice > sPrice){
            dirUtoS = false;
        } else {
            dirUtoS = true;
        }
        amountIn = utils.computeProfitMaximizing(uReserve0,uReserve1,sReserve0,sReserve1, result.number, dirUtoS);


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
