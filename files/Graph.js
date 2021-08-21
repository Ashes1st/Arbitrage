const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType} = require('@uniswap/sdk');
const { ethers } = require("ethers");

var web3 = require('web3');

const network = "homestead";
const infuraProjectId = "https://mainnet.infura.io/v3/ae3a3878141d4d9e84d0bd5d7f7354e0";
// const provider = new ethers.providers.InfuraProvider(network, infuraProjectId);

const provider = ethers.getDefaultProvider(network, {
    etherscan: infuraProjectId,
});

class Pair {
    nameToken0;
    nameToken1;
    addressPair;
    route;
    // reserv1
    // reserv2
}

class Token {
    name;
    pairIndexes;
    pairData;
    address;
    constructor(_name, _address){
        this.name = _name;
        this.pairIndexes = [];
        this.pairData = [];
        this.address = _address;
    }
}

class Graph {
    tokens; // index => Token 
    nameTokens; // index => token name correlation
    tokenData;
    
    constructor() {
        this.tokens = [];
        this.nameTokens = [];
        this.tokenData = [];
    }

    addToken(name, address){
        if(this.nameTokens.indexOf(name) == -1){
            this.tokens.push(new Token(name, address));
            this.nameTokens.push(name);
        } else {
            // console.log("Token with name %s alredy exist", name);
        }
        
    }

    addEdge(nameTokenFrom, nameTokenTo){
        if((this.nameTokens.indexOf(nameTokenFrom) != -1) || (this.nameTokens.indexOf(nameTokenTo) != 1)) {
            if(this.tokens[this.nameTokens.indexOf(nameTokenTo)].pairIndexes.indexOf(this.nameTokens.indexOf(nameTokenFrom)) == -1){
                this.tokens[this.nameTokens.indexOf(nameTokenFrom)].pairIndexes.push(this.nameTokens.indexOf(nameTokenTo));
                this.tokens[this.nameTokens.indexOf(nameTokenTo)].pairIndexes.push(this.nameTokens.indexOf(nameTokenFrom));
            }
            
        } else {
            // console.log("One of tokens is not exist");
        }
        
    }


    nameStartDFSToken = ""
    allCount = 0;
    path = []
    dfs(index, checkedTokens, count){
        
        
        checkedTokens.push(index);
        for (let i = 0; i < this.tokens[index].pairIndexes.length; i++) {
            const newIndex = this.tokens[index].pairIndexes[i];
            
            // console.log('\n' + checkedTokens + " checked indexes");
            // console.log(newIndex + " - " + checkedTokens.indexOf(newIndex));

            // console.log(newIndex);
            if(this.nameTokens[newIndex] == this.nameStartDFSToken) { // Path was found
                this.path.push(this.tokens[newIndex].name);
                if(count > 1) {
                    // this.nameTokens[newIndex] == this.nameStartDFSToken
                    // console.log(checkedTokens + " = " + newIndex + " path is: " + this.path);
                    this.allCount++;
                }
                this.path.pop();
                continue;
            }
            
            
            
            if(checkedTokens.indexOf(newIndex) == -1){
                this.path.push(this.tokens[newIndex].name);
                count++;
                // console.log(newIndex + " - new index\n");
                this.dfs(newIndex, checkedTokens, count);
                count--;
                this.path.pop();
            }
            
        }
        checkedTokens.splice(checkedTokens.indexOf(index), 1);
    }

    findAllPathFor(nameStartToken) {
        this.nameStartDFSToken = nameStartToken;
        var checked = [];
        var currentIndex = this.nameTokens.indexOf(nameStartToken);
        var countPathTokens = 0;
        this.path.push(this.tokens[currentIndex].name);
        checked.push(currentIndex);
        // checked.push(currentIndex);
        for (let i = 0; i < this.tokens[currentIndex].pairIndexes.length; i++) {
            const element = this.tokens[currentIndex].pairIndexes[i];
            // checked.push(element);

            
            this.path.push(this.tokens[element].name);
            countPathTokens++;
            this.dfs(element, checked, countPathTokens);
            countPathTokens--;
            this.path.pop();
            // checked.pop(element);
        }
        
        // console.log(this.allCount);
        let returned = this.allCount;
        this.allCount = 0;
        return returned;
    }

    async fetchAllData() {
        const chainId = ChainId.MAINNET;
        const myF = async () => {
            for (let i = 0; i < this.tokens.length; i++) {
                const element = this.tokens[i];
                try {
                    this.tokenData[i] = Fetcher.fetchTokenData(chainId, web3.toChecksumAddress(element.address, chainId), provider);
                } catch (error) {
                    console.log(error); 
                }
            }
        }

        myF()

        for (let i = 0; i < this.tokens.length; i++) {
            const element = this.tokens[i];
            try {
                console.log(await this.tokenData[i]);
            } catch (error) {
                console.log("error");
            }
            
        }
        // const chainId = ChainId.MAINNET;
        // const dai = await Fetcher.fetchTokenData(chainId, "0x6b175474e89094c44da98b954eedeac495271d0f");
        // //const weth = WETH[chainId];
        // const weth = await Fetcher.fetchTokenData(chainId, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
        // const pair = await Fetcher.fetchPairData(dai,weth);
        // const route = new Route([pair], weth);

        // const trade = new Trade(route, new TokenAmount(weth, "100000000000000000"), TradeType.EXACT_INPUT);
    }

    printAllTokensInfo() {
        for (let i = 0; i < this.tokens.length; i++) {
            const element = this.tokens[i];
            console.log("Symbol: " + element.name + ", address: " + element.address);
            
        }
    }

}

module.exports.Graph = Graph;