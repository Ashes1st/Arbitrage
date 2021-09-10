import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'

//ABIs
import * as IFactory from '@uniswap/v2-core/build/IUniswapV2Factory.json';
import * as IPair from '@uniswap/v2-core/build/IUniswapV2Pair.json';  
import * as IRouter from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import * as IERC20 from '@uniswap/v2-periphery/build/IERC20.json';
import * as IFlashBotUniswapQuery from './ABI/FlashSwapQueryContractABI.json';

const addrUFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const addrURouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const addrFlashBotUniswapQuery = "0xf522b378273394Bea84a31Db3D627c9a6fd522F0";

class Network {
    private uFactory: Contract;
    private uRouter: Contract;
    private web3: Web3;
    private contractsPair: Map<string, Contract> = new Map([]);
    private flashBotUniswapContract: Contract;

    constructor(_web3: Web3){
        this.web3 = _web3;
        this.uFactory = new this.web3.eth.Contract(IFactory.abi as AbiItem[],addrUFactory);
        this.uRouter = new this.web3.eth.Contract(IRouter.abi as AbiItem[],addrURouter);
        this.flashBotUniswapContract = new this.web3.eth.Contract(IFlashBotUniswapQuery as AbiItem[], addrFlashBotUniswapQuery);
    }

    async getReservesPair(pairAddress: string): Promise<{ reserve0: string; reserve1: string; }>{
        var _reserve0: string = "";
        var _reserve1: string = "";
        var pair: Contract;
        
        if(!this.contractsPair.has(pairAddress)){
            pair = new this.web3.eth.Contract(IPair.abi as AbiItem[], pairAddress);
            this.contractsPair.set(pairAddress, pair);
        }

        let reserves = await this.contractsPair.get(pairAddress).methods.getReserves().call();
        _reserve0 = reserves[0];
        _reserve1 = reserves[1];

        return {reserve0: _reserve0, reserve1: _reserve1};
    }

    async getReservesPairs(addressesPairs: string[]): Promise<string[][]>{
        let reserves = await this.flashBotUniswapContract.methods.getReservesByPairs(addressesPairs).call();

        return reserves;
    }
}

export { Network };
