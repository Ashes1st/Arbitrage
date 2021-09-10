"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Network = void 0;
//ABIs
var IFactory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
var IPair = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
var IRouter = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
var IFlashBotUniswapQuery = require("./ABI/FlashSwapQueryContractABI.json");
var addrUFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
var addrURouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
var addrFlashBotUniswapQuery = "0xf522b378273394Bea84a31Db3D627c9a6fd522F0";
var Network = /** @class */ (function () {
    function Network(_web3) {
        this.contractsPair = new Map([]);
        this.web3 = _web3;
        this.uFactory = new this.web3.eth.Contract(IFactory.abi, addrUFactory);
        this.uRouter = new this.web3.eth.Contract(IRouter.abi, addrURouter);
        this.flashBotUniswapContract = new this.web3.eth.Contract(IFlashBotUniswapQuery, addrFlashBotUniswapQuery);
    }
    Network.prototype.getReservesPair = function (pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _reserve0, _reserve1, pair, reserves;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _reserve0 = "";
                        _reserve1 = "";
                        if (!this.contractsPair.has(pairAddress)) {
                            pair = new this.web3.eth.Contract(IPair.abi, pairAddress);
                            this.contractsPair.set(pairAddress, pair);
                        }
                        return [4 /*yield*/, this.contractsPair.get(pairAddress).methods.getReserves().call()];
                    case 1:
                        reserves = _a.sent();
                        _reserve0 = reserves[0];
                        _reserve1 = reserves[1];
                        return [2 /*return*/, { reserve0: _reserve0, reserve1: _reserve1 }];
                }
            });
        });
    };
    Network.prototype.getReservesPairs = function (addressesPairs) {
        return __awaiter(this, void 0, void 0, function () {
            var reserves;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.flashBotUniswapContract.methods.getReservesByPairs(addressesPairs).call()];
                    case 1:
                        reserves = _a.sent();
                        // console.log(reserves);
                        return [2 /*return*/, reserves];
                }
            });
        });
    };
    return Network;
}());
exports.Network = Network;
