
import * as BN from 'bignumber.js';
import Web3 from 'web3';
import { Network } from './Network';

let network: Network;

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
        this.reserve0 = new BN.BigNumber(0);
        this.reserve1 = new BN.BigNumber(0);
    }

    setReserve(_reserve0: string, _reserve1: string){
        this.reserve0 = new BN.BigNumber(_reserve0);
        this.reserve1 = new BN.BigNumber(_reserve1);
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

    setDecimal(_decimal: number){
        this.decimal = _decimal;
    }
}

class Graph {
    tokens: Map<string, Token>;
    
    constructor(_web3: Web3, _json: string) {
        this.tokens = new Map([]);

        this.checked = [];
        this.nameStartDFSToken = ""
        this.allCount = 0;
        this.path = [];

        network = new Network(_web3);

        this.fetchInfoFromJson(_json);
    }

    addToken(name:string, address: string, decimal: number){
        if(this.tokens.get(name) == undefined){
            let token = new Token(name, address);
            token.setDecimal(decimal);
            this.tokens.set(name, token);
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
    path: string[];
    usedPathes: string[][] = [];
    checked: string[];
    usedNames: string[];
    usedPairsAddress: Map<Pair, boolean> = new Map([]);

    dfs(currentTokenName: string, count: number, deep: number){
        
        this.checked.push(currentTokenName);

        for(let nextTokenName of this.tokens.get(currentTokenName).connectedPairs.keys()){
            this.path.push(nextTokenName);
            
            if(nextTokenName == this.nameStartDFSToken){
                if(count == deep){
                    for(var i = 0; i < this.path.length-1; i++){
                        if(!this.usedPairsAddress.has(this.tokens.get(this.path[i]).connectedPairs.get(this.path[i+1]))){
                            if(this.tokens.get(this.path[i]).connectedPairs.get(this.path[i+1]) != undefined){
                                this.usedPairsAddress.set(this.tokens.get(this.path[i]).connectedPairs.get(this.path[i+1]), true);
                            }
                        }
                    }
                    for(var element of this.path.slice(1, 3)){
                        if(!this.usedNames.includes(element)){
                            this.usedNames.push(element);
                        }
                    }

                    let _path: string[] = [];
                    _path = _path.concat(this.path);
                    this.usedPathes.push(_path);
                    
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
        this.path.pop();

        let returned = this.allCount;
        this.allCount = 0;
    }

    printAllTokensInfo() {
        for(let entry of this.tokens.values()){
            console.log("Symbol: " + entry.name + ", address: " + entry.address);
        }
    }

    async updateReserves(){
        for(let pair of this.usedPairsAddress.keys()){
            let reserves = await network.getReservesPair(pair.address);
            pair.reserve0 = new BN.BigNumber(reserves.reserve0);
            pair.reserve1 = new BN.BigNumber(reserves.reserve1);
        }
    }
    logUsedPairs(){
        for(let key of this.usedPairsAddress.keys()){
            console.log("Pair " + key.token0.name + " <=> " + key.token1.name);
            console.log(key.address);
        }
    }
    logInfo(){
        for(let path of this.usedPathes){
            console.log(path);
            for(var i = 0; i < path.length-1; i++){                
                console.log(this.tokens.get(path[i]).connectedPairs.get(path[i+1]).token0.name + " reserve: " + this.tokens.get(path[i]).connectedPairs.get(path[i+1]).reserve0);
                console.log(this.tokens.get(path[i]).connectedPairs.get(path[i+1]).token1.name + " reserve: " + this.tokens.get(path[i]).connectedPairs.get(path[i+1]).reserve1);
            }
            console.log('---------');
        }
    }

    private fetchInfoFromJson(_json: string) {
        let parsedJson = JSON.parse(_json);

        
        for (let i = 0; i < parsedJson.length; i++) {
            const element = parsedJson[i];
            this.addToken(element['token0']['symbol'], element['token0']['address'], element['token0']['decimal']);
            this.addToken(element['token1']['symbol'], element['token1']['address'], element['token1']['decimal']);
            this.addEdge(element['token0']['symbol'], element['token1']['symbol'], element['address']);
        }
    }
}

export { Token, Pair, Graph };