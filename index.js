const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Token } = require('@uniswap/sdk');
const sushiSwapAPI = require('sushiswap-api');
const fs = require('fs');
// const _graph = require('./files/Graph.js');
const Web3 = require('web3');
const { ethers } = require('ethers');
const { infuraProjecSecure, network, infuraProjectId } = require('./config');
const { BigNumber } = require('bignumber.js');


// получаем данные пары с юнисвап
// получаем данные пары с сушисвап
// анализируем разницу цен без учета комиссий
// анализируем разницу цен с учетом комиссий

//ABIs
const IFactory = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const IPair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');  

// const IRouter = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
// const Utils = require('../build/contracts/Utils.json')
// const IERC20 = require('@uniswap/v2-periphery/build/IERC20.json')

const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const UNIwethTousdtContract = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852";
const SUSHIwethTousdtContract = "0x06da0fd433C1A5d7a4faa01111c044910A184553";

const web3 = new Web3(new Web3.providers.HttpProvider("https://:" + infuraProjecSecure + "@" + network +".infura.io/v3/" + infuraProjectId));

// uniPrice < sushiprice
function computeProfitMaximizing(uReserv0, uReserv1, sReserv0, sReserv1) {
    var x = 0;
    var c = BigNumber(uReserv0);
    var d = BigNumber(uReserv1);
    var a = BigNumber(sReserv0);
    var b = BigNumber(sReserv1);
    
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
    
    if(x1 > x2){
        if(x1>0){
            x = x1;
        }
    }else{
        if(x2>0){
            x = x2;
        }
    }
    
    fee = x * 0.006;
    const res = u0-u0*u1/(u1+s1-s1*s0/(s0+x))-x;
    
    console.log("UNISWAP: resUSDT " + u0 + ", resWETH " + u1 + ", price WETH " + u0/u1);
    console.log("SUSHISWAP: resUSDT " + s0 + ", resWETH " + s1 + ", price WETH " + s0/s1);
    console.log("We need " + x.toFixed(2) + " USDT for " + res.toFixed(2) + "USDT black profit (" + (res*100/x).toFixed(3) + "%), fee " + fee + " USDT, white profit " + (res-fee) + " USDT, clear profit "+(res*100/x-0.6).toFixed(3)+"%");
    console.log(res-fee);
    return x;
}

//UNISWAP 3009
var u0 = 7133480;
var u1 = 2350;
//SUSHISWAP 3035
var s0 = 129501070;
var s1 = 43026;


console.log(computeProfitMaximizing(u0,u1,s0,s1));

// web3.eth.getBalance("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", function(err, result) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(web3.utils.fromWei(result, "ether") + " ETH")
//   }
// })

// web3.eth.

// const provider = new ethers.providers.InfuraProvider("homestead", {
//     projectId: infuraProjectId,
//     projectSecret: infuraProjecSecure
// });

// const chainId = ChainId.MAINNET;

// const getUniInfo = async () => {
    
//     const usdt = await Fetcher.fetchTokenData(chainId, wethAddress, provider);
//     const weth = await Fetcher.fetchTokenData(chainId, usdtAddress, provider);
//     const pair = await Fetcher.fetchPairData(usdt,weth, provider);
//     const route = new Route([pair], weth);

//     const trade = new Trade(route, new TokenAmount(weth, 1 * 10^18), TradeType.EXACT_INPUT);
//     console.log("------UNISWAP-V2------");
//     // console.log(pair);
//     console.log(pair.reserve0.toSignificant() + " - rWETH");
//     console.log(pair.reserve1.toSignificant() + " - rUSDT");
    // console.log("1 USDT = " + route.midPrice.toSignificant(6) + " WETH");
    // console.log("1 WETH = " + route.midPrice.invert().toSignificant(6) + " USDT");
    // console.log(trade.executionPrice.toSignificant(6));
    // // console.log(trade.nextMidPrice.toSignificant(6));
    // console.log(); 
// }

// getUniInfo();

// const getSushiInfo = async () => {
//     console.log("-----SUSHISWAP------");
// 	sushiSwapAPI.getPair(1,'0x06da0fd433C1A5d7a4faa01111c044910A184553').then(	function(res) {
//         res.forEach( function(Pair) {
//             console.log(Pair);
//             // console.log("1 USDT = " + Pair.Token_1_price + " WETH");
//             // console.log("1 WETH = " + Pair.Token_2_price + " USDT"); 
//             // console.log();
//             }
//         );
//     }
//     );
    // sushiSwapAPI.getPairsByToken(chainId, wethAddress).then( function(res) {
    //     res.forEach( function(Pair) {
    //         console.log();
    //     }
    //     );
    // });
    // sushiSwapAPI.getAllPairs(chainId).then( function(res) {
    //     res.forEach( function(Pair) {
    //         console.log(Pair);
    //     }
    //     );
    // });
// }

// getSushiInfo();

// console.log("null");

// // {
// //     "address": "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", 
// //     "reserve0": "609235.131228316693832659", 
// //     "reserve1": "218989813.891283", 
// //     "reserveETH": "1218470.262456633387665318", 
// //     "reserveUSD": "436758794.4192405496002251187916122", 
// //     "token0": 
// //     {
// //         "decimal": 18, 
// //         "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 
// //         "name": "Wrapped Ether", 
// //         "symbol": "WETH"
// //     }, 
// //     "token1": 
// //     {
// //         "decimal": 6, 
// //         "address": "0xdac17f958d2ee523a2206206994597c13d831ec7", 
// //         "name": "Tether USD", 
// //         "symbol": "USDT"
// //     }
// // }

// const init = async () => {
    
//     const dai = await Fetcher.fetchTokenData(chainId, utils.toChecksumAddress("0x6b175474e89094c44da98b954eedeac495271d0f", chainId), provider);
//     const weth = await Fetcher.fetchTokenData(chainId, utils.toChecksumAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", chainId), provider);
//     const pair = await Fetcher.fetchPairData(dai,weth, provider);
//     const route = new Route([pair], weth);

//     const trade = new Trade(route, new TokenAmount(weth, 1 * 10^18), TradeType.EXACT_INPUT);
//     console.log("1 ETH = " + route.midPrice.toSignificant(6) + " DAI");
//     console.log("1 DAI = " + route.midPrice.invert().toSignificant(6) + " ETH");
//     console.log(trade.executionPrice.toSignificant(6));
//     console.log(trade.nextMidPrice.toSignificant(6));
// }

// // init();

// // const mnemonic = "galaxy father prison tell labor easy beach gossip turkey shrug valley rude"
// // const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic);
// // const w = async () => {
// //     return walletMnemonic.connect(provider);
// // }
// // const wallet = w();
// // console.log(wallet.getAddress());
// // console.log(wallet.getBalance(provider));
// // var graph = new _graph.Graph();

// // const fun = async () => {
    
// //     // const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
// //     // console.log(dai);
    
// //     let pairs = fs.readFileSync("./files/main_pairs.json", "utf-8");
// //     let parsedJson = JSON.parse(pairs);

// //     // console.log(parsedJson.slice(0, 20));

// //     for (let i = 0; i < parsedJson.length; i++) {
// //         const element = parsedJson[i];
// //         graph.addToken(element['token0']['symbol'], element['token0']['address']);
// //         graph.addToken(element['token1']['symbol'], element['token1']['address']);
// //         graph.addEdge(element['token0']['symbol'], element['token1']['symbol']);
// //         graph.addEdge(element['token1']['symbol'], element['token0']['symbol']);
// //     }

// //     graph.printAllTokensInfo();
// //     graph.fetchAllData();
// //     // console.log(graph.adjacent('Wrapped Ether'));
    
// //     // console.log(graph.Tokens);
// //     // console.log(graph.nameTokens);

// //     // for (let i = 0; i < graph.nameTokens.length; i++) {
// //     //     const element = graph.nameTokens[i];
// //     //     console.log("For " + element + " we have " + graph.findAllPathFor(element) + " cycles.");
// //     // }
// // }

// // // fun();


