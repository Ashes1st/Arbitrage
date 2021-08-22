const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Token } = require('@uniswap/sdk');
const sushiSwapAPI = require('sushiswap-api');
const fs = require('fs');
// const _graph = require('./files/Graph.js');
const Web3 = require('web3');
const { ethers } = require('ethers');
const { infuraProjecSecure, network, infuraProjectId, privateKey } = require('./config');
const { BigNumber } = require('bignumber.js');


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

function computeProfitMaximizing(uRusdt, uRweth, sRusdt, sRweth, blockNumber) {
    var x = 0;
    var a,b,c,d;
    
    if(dirUtoS){
        var c = BigNumber(sRweth);
        var d = BigNumber(sRusdt);
        var a = BigNumber(uRweth);
        var b = BigNumber(uRusdt);
    } else {
        var c = BigNumber(uRweth);
        var d = BigNumber(uRusdt);
        var a = BigNumber(sRweth);
        var b = BigNumber(sRusdt);
    }
    
    const partx1 = BigNumber(-10).times(BigNumber(2515).sqrt());
    const partx2 = BigNumber(10).times(BigNumber(2515).sqrt());
    // console.log(part1.toString());
    const part2 = (a.times(b).times(c).times(d).times((b.plus(d)).pow(2))).sqrt();
    // console.log(part2.toString())
    const part3 = BigNumber(503).times(a).times(b).times(d);
    // console.log(part3.toString());
    const part4 = BigNumber(503).times(a).times(d.pow(2));
    // console.log(part4.toString());
    const part5 = BigNumber(503).times((b.plus(d)).pow(2));
    // console.log(part5.toString());
    
    const x1 = ((partx1.times(part2)).minus(part3).minus(part4)).div(part5).toNumber();
    const x2 = ((partx2.times(part2)).minus(part3).minus(part4)).div(part5).toNumber();

    if((x1>0) || (x2>0)){
        if(x1>0){
            x = x1;
        }else if (x2 > 0){
            x = x2;
        }
    } else {
        return 0;
    }
    
    fee = x * 0.006;
    let bProfit;

    if(dirUtoS){
        console.log("U->S");
        // bProfit = b.minus((b.times(a)).div(a.plus(c).minus((c.times(d)).div(d.plus(BigNumber(x)))))).toNumber() -x
        bProfit = c.minus(c.times(d).div(d.plus(b).minus(b.times(a.div((a.plus(BigNumber(x)))))))).toNumber()-x;
    } else {
        console.log("S->U");
        // bProfit = d.minus(d.times(c).div(c.plus(a).minus(a.times(b).div(b.plus(BigNumber(x)))))).toNumber() -x
        // bProfit = b.minus((b.times(a)).div(a.plus(c).minus((c.times(d)).div(d.plus(BigNumber(x)))))).toNumber() -x
        // bProfit = c-c*d/(d+b-b*a/(a+x))-x;
        bProfit = c.minus(c.times(d).div(d.plus(b).minus(b.times(a.div((a.plus(BigNumber(x)))))))).toNumber()-x;

    }
    
    console.log(blockNumber);
    console.log("UNISWAP: resUSDT " + uRweth + ", resWETH " + uRusdt + ", price WETH " + uRweth/uRusdt);
    console.log("SUSHISWAP: resUSDT " + sRweth + ", resWETH " + sRusdt + ", price WETH " + sRweth/sRusdt);
    console.log("We need " + x.toFixed(2) + " USDT for " + bProfit.toFixed(2) + "USDT black profit (" + (bProfit*100/x).toFixed(3) + "%), fee " + fee + " USDT, white profit " + (bProfit-fee) + " USDT, clear profit "+(bProfit*100/x-0.6).toFixed(3)+"%");
    // console.log(res-fee);
    return x;
}

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
        amountIn = computeProfitMaximizing(uReserve0,uReserve1,sReserve0,sReserve1, result.number);


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

// const fun = async () => {
    
//     // const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
//     // console.log(dai);
    
//     let pairs = fs.readFileSync("./files/main_pairs.json", "utf-8");
//     let parsedJson = JSON.parse(pairs);

//     // console.log(parsedJson.slice(0, 20));

//     for (let i = 0; i < parsedJson.length; i++) {
//         const element = parsedJson[i];
//         graph.addToken(element['token0']['symbol'], element['token0']['address']);
//         graph.addToken(element['token1']['symbol'], element['token1']['address']);
//         graph.addEdge(element['token0']['symbol'], element['token1']['symbol']);
//         graph.addEdge(element['token1']['symbol'], element['token0']['symbol']);
//     }

//     graph.printAllTokensInfo();
//     graph.fetchAllData();
//     console.log(graph.adjacent('Wrapped Ether'));
    
//     console.log(graph.Tokens);
//     console.log(graph.nameTokens);

//     for (let i = 0; i < graph.nameTokens.length; i++) {
//         const element = graph.nameTokens[i];
//         console.log("For " + element + " we have " + graph.findAllPathFor(element) + " cycles.");
//     }
// }

// fun();


