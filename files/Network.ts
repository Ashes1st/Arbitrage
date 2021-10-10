import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'

//ABIs
import * as IFactory from './ABI/factory.json';
import * as IPair from './ABI/pair.json';  
import * as IRouter from './ABI/router.json';
import * as BEP20 from './ABI/bep20.json';
import * as IFlashBotUniswapQuery from './ABI/FlashSwapQueryContractABI.json';

const addrUFactory = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
const addrURouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const addrFlashBotUniswapQuery = "0xD89da700352418842bF47c5d9A598B62592c531A";

var bullet = 1;

class Network {
    private uFactory: Contract;
    private uRouter: Contract;
    private web3: Web3;
    private contractsPair: Map<string, Contract> = new Map([]);
    private flashBotUniswapContract: Contract;

    constructor(_web3: Web3){
        this.web3 = _web3;
        this.uFactory = new this.web3.eth.Contract(IFactory as AbiItem[],addrUFactory);
        this.uRouter = new this.web3.eth.Contract(IRouter as AbiItem[],addrURouter);
        this.flashBotUniswapContract = new this.web3.eth.Contract(IFlashBotUniswapQuery as AbiItem[], addrFlashBotUniswapQuery);
    }

    async getReservesPair(pairAddress: string): Promise<{ reserve0: string; reserve1: string; }>{
        var _reserve0: string = "";
        var _reserve1: string = "";
        var pair: Contract;
        
        if(!this.contractsPair.has(pairAddress)){
            pair = new this.web3.eth.Contract(IPair as AbiItem[], pairAddress);
            this.contractsPair.set(pairAddress, pair);
        }

        let reserves = await this.contractsPair.get(pairAddress).methods.getReserves().call();
        _reserve0 = reserves[0];
        _reserve1 = reserves[1];

        return {reserve0: _reserve0, reserve1: _reserve1};
    }

    async getReservesPairs(addressesPairs: string[]): Promise<string[][]>{
        // console.log("here");
        
        let reserves = await this.flashBotUniswapContract.methods.getReservesByPairs(addressesPairs).call();
        // console.log(reserves);
        
        return reserves;
    }

    async getTokenInfo(tokenAddress: string): Promise<string[]>{
        const token = new this.web3.eth.Contract(BEP20 as AbiItem[], tokenAddress);
        const symbol = await token.methods.symbol().call();
        const decimal = await token.methods.decimals().call();

        // console.log(tokenAddress + " " + symbol + " " + decimal);
        return [tokenAddress, symbol, decimal];
    }

    async getPartPairs(): Promise<string[][]>{
        console.log("[");
        
        let result = await this.flashBotUniswapContract.methods.getPairsByIndexRange(addrUFactory, 253, 1500).call();
        // console.log(result);

        for(const element of result){
            console.log("{");
            console.log('"address":"' + element[2] + '",');
            const token0 = await this.getTokenInfo(element[0])// token 0
            console.log('"token0":{"decimal":'+token0[2]+',');
            console.log('"address":"'+token0[0]+'",');
            console.log('"symbol":"'+token0[1]+'"},')
            
             
            const token1 = await this.getTokenInfo(element[1]) // token 1
            console.log('"token1":{"decimal":'+token1[2]+',');
            console.log('"address":"'+token1[0]+'",');
            console.log('"symbol":"'+token1[1]+'"}')
            // console.log(element[2]) // pair
            // console.log(element);

            console.log("},");
        }

        console.log("]");

        return result;
    }

    async doArbitrage(amountIn: string, path: string[]){
        // let result = await this.uRouter.methods.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, deadline).call()
    }
}

export { Network };
