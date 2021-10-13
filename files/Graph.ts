
import * as BN from 'bignumber.js';
import Web3 from 'web3';
import { Network } from './Network';
import { computeCircleProfitMaximization } from './Utils';

let network: Network;

let BUSDAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
let WBNBAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

class Pair {
    address: string;
    token0: Token;
    token1: Token;
    reserve0: string;
    reserve1: string;

    constructor(_token0: Token, _token1: Token, _address: string) {
        this.token0 = _token0;
        this.token1 = _token1;
        this.address = _address;
        this.reserve0 = "0";
        this.reserve1 = "0";
    }

    setReserve(_reserve0: string, _reserve1: string){
        let fBN = BN.BigNumber.clone({ DECIMAL_PLACES: this.token0.decimal })
        let sBN = BN.BigNumber.clone({ DECIMAL_PLACES: this.token1.decimal })
        this.reserve0 = (new fBN(_reserve0).div((new fBN(10).pow(this.token0.decimal)))).toString();
        this.reserve1 = (new sBN(_reserve1).div((new sBN(10).pow(this.token1.decimal)))).toString();
    }
}

class Token {
    name: string;
    symbol: string;
    connectedPairs: Map<string, Pair>;
    decimal: number;
    address: string;
    constructor(_name: string, _address: string){
        this.name = _name;
        this.connectedPairs = new Map([]);
        this.address = _address;
        this.symbol = _name;
    }

    setDecimal(_decimal: number){
        this.decimal = _decimal;
    }
}

class Graph {
    tokens: Map<string, Token>;
    
    constructor(_web3: Web3) {
        this.tokens = new Map([]);

        this.checked = [];
        this.nameStartDFSToken = ""
        this.allCount = 0;
        this.currentPath = [];

        network = new Network(_web3);
    }

    addToken(name:string, address: string, decimal: number){
        if(this.tokens.get(address) == undefined){
            let token = new Token(name, address);
            token.setDecimal(decimal);
            this.tokens.set(address, token);
        }
    }

    addEdge(nameTokenFrom: string, nameTokenTo: string, pairAddress: string){
        if(pairAddress == undefined){
            console.log(nameTokenFrom + " and " + nameTokenTo + "address pair undefined");
        } else {
            if(this.tokens.has(nameTokenFrom) && this.tokens.has(nameTokenTo)){
                if(!this.tokens.get(nameTokenTo).connectedPairs.has(nameTokenFrom)){
                    let pair = new Pair(this.tokens.get(nameTokenFrom), this.tokens.get(nameTokenTo), pairAddress);
                    this.tokens.get(nameTokenFrom).connectedPairs.set(nameTokenTo, pair);
                    this.tokens.get(nameTokenTo).connectedPairs.set(nameTokenFrom, pair);
                }
            }
        }
    }

    nameStartDFSToken: string;
    allCount: number;
    currentPath: string[];
    usedPathes: string[][] = [];
    checked: string[] = [];
    usedNames: string[] = [];
    usedPairsAddress: Map<Pair, string> = new Map([]);

    dfs(currentTokenName: string, count: number, deep: number){
        
        this.checked.push(currentTokenName);

        for(let nextTokenName of this.tokens.get(currentTokenName).connectedPairs.keys()){
            this.currentPath.push(nextTokenName);
            
            if(nextTokenName == this.nameStartDFSToken){
                if(count == deep){
                    for(var i = 0; i < this.currentPath.length-1; i++){
                        if(!this.usedPairsAddress.has(this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i+1]))){
                            if(this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i+1]) != undefined){
                                this.usedPairsAddress.set(this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i+1]), this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i+1]).address);
                            }
                        }
                    }
                    for(var element of this.currentPath.slice(1, 3)){
                        if(!this.usedNames.includes(element)){
                            this.usedNames.push(element);
                        }
                    }

                    let _path: string[] = [];
                    _path = _path.concat(this.currentPath);
                    this.usedPathes.push(_path);
                    
                    this.allCount++;
                }
                this.currentPath.pop();
                continue;
            }
            
            if(count == deep){
                this.currentPath.pop();
                continue;
            }

            if(!this.checked.includes(nextTokenName)){
                this.dfs(nextTokenName, count+1, deep);
            }

            this.currentPath.pop();
        }

        this.checked.splice(this.checked.indexOf(currentTokenName), 1);
    }

    findAllPathFor(nameStartToken: string, deep: number) {
        this.nameStartDFSToken = nameStartToken;
        
        var currentToken = this.tokens.get(nameStartToken);
        var countPathTokens = 0;
        this.currentPath.push(currentToken.address);
        this.checked.push(currentToken.address);

        this.usedNames.push(this.nameStartDFSToken);
        
        for(let tokenName of currentToken.connectedPairs.keys()){
            this.currentPath.push(tokenName);
            this.dfs(tokenName, countPathTokens+1, deep);
            this.currentPath.pop();
        }

        this.checked.splice(this.checked.indexOf(nameStartToken), 1);
        this.checked.pop();
        this.currentPath.pop();
    }

    printAllTokensInfo() {
        for(let entry of this.tokens.values()){
            console.log("Symbol: " + entry.name + ", address: " + entry.address);
        }
    }

    async updateReserves(){
        let promiseReserves: string[][];
        var addresses: string[] = [];
        for(let address of this.usedPairsAddress.values()){
            addresses.push(address);
        }
        promiseReserves = await network.getReservesPairs(addresses);
        let i = 0;
        for(let address of this.usedPairsAddress.keys()){
            address.setReserve(promiseReserves[i][0],promiseReserves[i][1]);
            i++;
        }

    }
    
    logInfo(){
        for(let _path of this.usedPathes){
            console.log(_path);
            for(var i = 0; i < _path.length-1; i++){                
                console.log(this.tokens.get(_path[i]).connectedPairs.get(_path[i+1]).token0.name + " reserve: " + this.tokens.get(_path[i]).connectedPairs.get(_path[i+1]).reserve0);
                console.log(this.tokens.get(_path[i]).connectedPairs.get(_path[i+1]).token1.name + " reserve: " + this.tokens.get(_path[i]).connectedPairs.get(_path[i+1]).reserve1);
            }
            console.log('---------');
        }
    }

    getTxFeeForSymbol(symbol: string){
        let txFeeInEth = 0.001;
        if(symbol == WBNBAddress){
            return 0.004;
        } else if(symbol == BUSDAddress){
            return 2;
        }
        // let pair = this.tokens.get("WETH").connectedPairs.get(symbol)
        // if(pair != undefined){
        //     if(pair.token0.symbol == "WETH"){
        //         let wethRes = pair.reserve0;  
        //         let coinRes = pair.reserve1;
        //         return getTxFee(wethRes,coinRes);
        //     } else {
        //         let wethRes = pair.reserve1;
        //         let coinRes = pair.reserve0;
        //         return getTxFee(wethRes,coinRes);
        //     }
        // }
        return "999999999999999999999999999999999999999999999999";
    }

    searchOpportunity(){
        for(let _path of this.usedPathes){
            var a1: string;
            var b1: string;
            var b2: string;
            var c2: string;
            var c3: string;
            var a3: string;
            var p1: Pair;
            var p2: Pair;
            var p3: Pair;
            p1 = this.tokens.get(_path[0]).connectedPairs.get(_path[1]);
            p2 = this.tokens.get(_path[1]).connectedPairs.get(_path[2]);
            p3 = this.tokens.get(_path[2]).connectedPairs.get(_path[3]);
            if(p1.token0.address == _path[0]){
                a1 = p1.reserve0;
                b1 = p1.reserve1;
                if(p1.token1.address == p2.token0.address){
                    b2 = p2.reserve0;
                    c2 = p2.reserve1;
                    if(p2.token1.address == p3.token0.address){
                        c3 = p3.reserve0;
                        a3 = p3.reserve1;
                    } else {
                        c3 = p3.reserve1;
                        a3 = p3.reserve0;
                    }
                } else {
                    b2 = p2.reserve1;
                    c2 = p2.reserve0;
                    if(p2.token0.address == p3.token0.address){
                        c3 = p3.reserve0;
                        a3 = p3.reserve1;
                    } else {
                        c3 = p3.reserve1;
                        a3 = p3.reserve0;
                    }
                }
            } else {
                a1 = p1.reserve1;
                b1 = p1.reserve0;
                if(p1.token0.address == p2.token1.address){
                    b2 = p2.reserve1;
                    c2 = p2.reserve0;
                    if(p2.token0.address == p3.token0.address){
                        c3 = p3.reserve0;
                        a3 = p3.reserve1;
                    } else {
                        c3 = p3.reserve1;
                        a3 = p3.reserve0;
                    }
                } else {
                    b2 = p2.reserve0;
                    c2 = p2.reserve1;
                    if(p2.token1.address == p3.token0.address){
                        c3 = p3.reserve0;
                        a3 = p3.reserve1;
                    } else {
                        c3 = p3.reserve1;
                        a3 = p3.reserve0;
                    }
                }
            }
            
            computeCircleProfitMaximization(a1,b1,b2,c2,c3,a3, _path, this.getTxFeeForSymbol(_path[0]));
        }
    }

    getAllSymbols(): string[] {
        var allSymbols: string[] = []
        for(let token of this.tokens.keys()){
            allSymbols.push(token);
        }
        return allSymbols;
    }

    findAllPathes(deep: number){
        let allSymbols = this.getAllSymbols();

        // this.findAllPathFor(WBNBAddress, deep);
        this.findAllPathFor(BUSDAddress, deep);

        // for(let symbol of allSymbols){
        //     this.findAllPathFor(symbol, deep);
        // }
        console.log(this.allCount + " pathes was found");
    }

    getPartPairs(){
        network.getPartPairs();
    }

    fetchInfo(_json) {
        let parsedJson = JSON.parse(_json);

        for (let i = 0; i < parsedJson.length; i++) {
            const element = parsedJson[i];
            this.addToken(element['token0']['symbol'], element['token0']['address'], element['token0']['decimal']);
            this.addToken(element['token1']['symbol'], element['token1']['address'], element['token1']['decimal']);
            this.addEdge(element['token0']['address'], element['token1']['address'], element['address']);
        }
        
        console.log("Pairs data is loaded:");
        console.log(parsedJson.length + ": pairs count");
        console.log(this.tokens.size + ": tokens count");
    }

    logUsedPasses(){
        for(let path of this.usedPathes){
            console.log(path[0] + " tx: " + this.getTxFeeForSymbol(path[0]));
            
        }
    }
}

export { Token, Pair, Graph };