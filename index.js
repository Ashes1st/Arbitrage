const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Token } = require('@uniswap/sdk');
const fs = require('fs');
// const Graph = require("graph-data-structure");
const _graph = require('./files/Graph.js')

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

var graph = new _graph.Graph();
// graph.addToken("ETH");
// graph.addToken("BTC");
// graph.addToken("LTC");
// graph.addToken("BTC");
// graph.addEdge("ETH", "LTC");
// graph.addEdge("BTC", "LTC");

// console.log(graph.Tokens);
// console.log(graph.nameTokens);


const fun = async () => {
    
    // const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    // console.log(dai);
    
    let pairs = fs.readFileSync("./files/main_pairs.json", "utf-8");
    let parsedJson = JSON.parse(pairs);

    for (let i = 0; i < parsedJson.length; i++) {
        const element = parsedJson[i];
        graph.addToken(element['token0']['symbol']);
        graph.addToken(element['token1']['symbol']);
        graph.addEdge(element['token0']['symbol'], element['token1']['symbol']);
        graph.addEdge(element['token1']['symbol'], element['token0']['symbol']);
    }

    // console.log(graph.adjacent('Wrapped Ether'));
    
    // console.log(graph.Tokens);
    // console.log(graph.nameTokens);

    // for (let i = 0; i < graph.nameTokens.length; i++) {
    //     const element = graph.nameTokens[i];
    //     console.log("For " + element + " we have " + graph.findAllPathFor(element) + " cycles.");
    // }
}

// fun();

const init = async () => {


    
    const dai = await Fetcher.fetchTokenData(chainId, "0x6b175474e89094c44da98b954eedeac495271d0f");
    //const weth = WETH[chainId];
    const weth = await Fetcher.fetchTokenData(chainId, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], weth);

    const trade = new Trade(route, new TokenAmount(weth, "100000000000000000"), TradeType.EXACT_INPUT);
    console.log("1 ETH = " + route.midPrice.toSignificant(6) + " DAI");
    console.log("1 DAI = " + route.midPrice.invert().toSignificant(6) + " ETH");
    console.log(trade.executionPrice.toSignificant(6));
    console.log(trade.nextMidPrice.toSignificant(6));
}

init();

// {
//     "address": "0x5916953296edf0996a0e77488b3af450095e2a35", 
//     "reserve0": "135.91097378957627205", 
//     "reserve1": "6506556.008749346239147824", 
//     "reserveETH": "271.8219475791525441", 
//     "reserveUSD": "97445.42119545569198109346991136598", 
//     "token0": {
//         "decimal": 18, 
//         "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 
//         "name": "Wrapped Ether", 
//         "symbol": "WETH"
//     }, 
//     "token1": {
//         "decimal": 18, 
//         "address": "0xf29992d7b589a0a6bd2de7be29a97a6eb73eaf85", 
//         "name": "DMScript", 
//         "symbol": "DMST"
//     }
// }

// {"index": 10828, 
// "address": "0x9C06E8E136ffDeC7A19352434E5D4192a55bAD29", 
// "token0": {
//     "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 
//     "symbol": "UNI", 
//     "decimal": 18
// }, 
// "token1": {
//     "address": "0x26a662539008d36fa3246be2c04e8F9919E2c02f", 
//     "symbol": "MANY", 
//     "decimal": 18
// }, 
// "reserve0": 21798603758414032044, 
// "reserve1": 1802509847000000000000
// }