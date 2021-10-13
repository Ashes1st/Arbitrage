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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.Network = void 0;
//ABIs
var IFactory = require("./ABI/factory.json");
var IPair = require("./ABI/pair.json");
var IRouter = require("./ABI/router.json");
var BEP20 = require("./ABI/bep20.json");
var IFlashBotUniswapQuery = require("./ABI/FlashSwapQueryContractABI.json");
var addrUFactory = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
var addrURouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
var addrFlashBotUniswapQuery = "0xD89da700352418842bF47c5d9A598B62592c531A";
var bullet = 1;
var Network = /** @class */ (function () {
    function Network(_web3) {
        this.contractsPair = new Map([]);
        this.web3 = _web3;
        this.uFactory = new this.web3.eth.Contract(IFactory, addrUFactory);
        this.uRouter = new this.web3.eth.Contract(IRouter, addrURouter);
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
                            pair = new this.web3.eth.Contract(IPair, pairAddress);
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
    Network.prototype.getTokenInfo = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var token, symbol, decimal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = new this.web3.eth.Contract(BEP20, tokenAddress);
                        return [4 /*yield*/, token.methods.symbol().call()];
                    case 1:
                        symbol = _a.sent();
                        return [4 /*yield*/, token.methods.decimals().call()];
                    case 2:
                        decimal = _a.sent();
                        // console.log(tokenAddress + " " + symbol + " " + decimal);
                        return [2 /*return*/, [tokenAddress, symbol, decimal]];
                }
            });
        });
    };
    Network.prototype.getPartPairs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, result_1, result_1_1, element, token0, token1, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("[");
                        return [4 /*yield*/, this.flashBotUniswapContract.methods.getPairsByIndexRange(addrUFactory, 1501, 2500).call()];
                    case 1:
                        result = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, 9, 10]);
                        result_1 = __values(result), result_1_1 = result_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!result_1_1.done) return [3 /*break*/, 7];
                        element = result_1_1.value;
                        console.log("{");
                        console.log('"address":"' + element[2] + '",');
                        return [4 /*yield*/, this.getTokenInfo(element[0])]; // token 0
                    case 4:
                        token0 = _b.sent() // token 0
                        ;
                        console.log('"token0":{"decimal":' + token0[2] + ',');
                        console.log('"address":"' + token0[0] + '",');
                        console.log('"symbol":"' + token0[1] + '"},');
                        return [4 /*yield*/, this.getTokenInfo(element[1])]; // token 1
                    case 5:
                        token1 = _b.sent() // token 1
                        ;
                        console.log('"token1":{"decimal":' + token1[2] + ',');
                        console.log('"address":"' + token1[0] + '",');
                        console.log('"symbol":"' + token1[1] + '"}');
                        // console.log(element[2]) // pair
                        // console.log(element);
                        console.log("},");
                        _b.label = 6;
                    case 6:
                        result_1_1 = result_1.next();
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (result_1_1 && !result_1_1.done && (_a = result_1["return"])) _a.call(result_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        console.log("]");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Network.prototype.doArbitrage = function (amountIn, path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return Network;
}());
exports.Network = Network;
