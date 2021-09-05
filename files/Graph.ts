import { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import { stripZeros } from 'ethers/lib/utils';
import * as fs from 'fs';
import * as BN from 'bignumber.js';

class Pair {
    address: string;
    token0: Token;
    token1: Token;
    reserve0: BN.BigNumber;
    reserve1: BN.BigNumber;

    constructor(_token0: Token, _token1: Token, _address: string) {
        this.token0 = _token0;
        this.token1 = _token1;
        this.address = _address;
    }
}

class Token {
    name: string;
    symbol: string;
    connectedPairs: Map<string, Pair>;
    // pairData: [];
    decimal: number;
    address: string;
    constructor(_name: string, _address: string){
        this.name = _name;
        this.connectedPairs = new Map([]);
        // this.pairData = [];
        this.address = _address;
    }
}

class Graph {
    tokens: Map<string, Token>;
    
    constructor() {
        this.tokens = new Map([]);

        this.checked = [];
        this.nameStartDFSToken = ""
        this.allCount = 0;
        this.path = [];
    }

    addToken(name:string, address: string){
        if(this.tokens.get(name) == undefined){
            this.tokens.set(name, new Token(name, address))
        }
    }

    addEdge(nameTokenFrom: string, nameTokenTo: string, pairAddress: string){
        if(this.tokens.has(nameTokenFrom) && this.tokens.has(nameTokenTo)){
            if(!this.tokens.get(nameTokenTo).connectedPairs.has(nameTokenFrom)){
                let pair = new Pair(this.tokens.get(nameTokenFrom), this.tokens.get(nameTokenTo), pairAddress);
                this.tokens.get(nameTokenFrom).connectedPairs.set(nameTokenTo, pair);
                this.tokens.get(nameTokenTo).connectedPairs.set(nameTokenFrom, pair);
            }
        }
    }

    nameStartDFSToken: string;
    allCount: number;
    path: string[];
    checked: string[];
    usedNames: string[];

    dfs(currentTokenName: string, count: number, deep: number){
        
        this.checked.push(currentTokenName);

        for(let nextTokenName of this.tokens.get(currentTokenName).connectedPairs.keys()){
            this.path.push(nextTokenName);
            
            if(nextTokenName == this.nameStartDFSToken){
                if(count == deep){
                    console.log(this.path);
                    for(var element of this.path.slice(1, 3)){
                        if(!this.usedNames.includes(element)){
                            this.usedNames.push(element);
                        }
                    }
                    this.allCount++;
                }
                this.path.pop();
                continue;
            }

            if(!this.checked.includes(nextTokenName)){
                this.dfs(nextTokenName, count+1, deep);
            }

            this.path.pop();
        }

        this.checked.splice(this.checked.indexOf(currentTokenName), 1);
    }

    findAllPathFor(nameStartToken: string, deep: number) {
        this.nameStartDFSToken = nameStartToken;
        
        var currentToken = this.tokens.get(nameStartToken);
        var countPathTokens = 0;
        this.path.push(currentToken.name);
        this.checked.push(currentToken.name);

        this.usedNames = [this.nameStartDFSToken];

        for(let tokenName of currentToken.connectedPairs.keys()){
            this.path.push(tokenName);
            this.dfs(tokenName, countPathTokens+1, deep);
            this.path.pop();
        }
        
        console.log(this.allCount);
        console.log(this.usedNames);
        let returned = this.allCount;
        this.allCount = 0;
        return returned;
    }

    // async fetchAllData() {
    //     const chainId = ChainId.MAINNET;
    //     const myF = async () => {
    //         for (let i = 0; i < this.tokens.length; i++) {
    //             const element = this.tokens[i];
    //             try {
    //                 this.tokenData[i] = Fetcher.fetchTokenData(chainId, element.address, provider);
    //             } catch (error) {
    //                 console.log(error); 
    //             }
    //         }
    //     }

    //     myF()

    //     for (let i = 0; i < this.tokens.length; i++) {
    //         const element = this.tokens[i];
    //         try {
    //             console.log(await this.tokenData[i]);
    //         } catch (error) {
    //             console.log("error");
    //         }
            
    //     }
    //     // const chainId = ChainId.MAINNET;
    //     // const dai = await Fetcher.fetchTokenData(chainId, "0x6b175474e89094c44da98b954eedeac495271d0f");
    //     // //const weth = WETH[chainId];
    //     // const weth = await Fetcher.fetchTokenData(chainId, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
    //     // const pair = await Fetcher.fetchPairData(dai,weth);
    //     // const route = new Route([pair], weth);

    //     // const trade = new Trade(route, new TokenAmount(weth, "100000000000000000"), TradeType.EXACT_INPUT);
    // }

    printAllTokensInfo() {
        for(let entry of this.tokens.values()){
            console.log("Symbol: " + entry.name + ", address: " + entry.address);
        }
    }

}

var graph = new Graph();

const fun = async () => {
    
    // const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    // console.log(dai);
    
    let pairs = fs.readFileSync("main_pairs.json", "utf-8");
    let parsedJson = JSON.parse(pairs);

    // console.log(parsedJson.slice(0, 20));
    
    for (let i = 0; i < parsedJson.length; i++) {
        const element = parsedJson[i];
        graph.addToken(element['token0']['symbol'], element['token0']['address']);
        graph.addToken(element['token1']['symbol'], element['token1']['address']);
        graph.addEdge(element['token0']['symbol'], element['token1']['symbol'], element['address']);
    }
    

    // graph.printAllTokensInfo();
    // graph.fetchAllData();
    
    console.log(parsedJson.length + " - json length");
    console.log(graph.findAllPathFor("WETH", 2));

    // for (let i = 0; i < graph.nameTokens.length; i++) {
    //     const element = graph.nameTokens[i];
    //     console.log("For " + element + " we have " + graph.findAllPathFor(element) + " cycles.");
    // }
}

fun();