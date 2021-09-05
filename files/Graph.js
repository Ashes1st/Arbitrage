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
var fs = require("fs");
var Pair = /** @class */ (function () {
    function Pair(_token0, _token1, _address) {
        this.token0 = _token0;
        this.token1 = _token1;
        this.address = _address;
    }
    return Pair;
}());
var Token = /** @class */ (function () {
    function Token(_name, _address) {
        this.name = _name;
        this.connectedPairs = new Map([]);
        // this.pairData = [];
        this.address = _address;
    }
    return Token;
}());
var Graph = /** @class */ (function () {
    function Graph() {
        this.tokens = new Map([]);
        this.checked = [];
        this.nameStartDFSToken = "";
        this.allCount = 0;
        this.path = [];
    }
    Graph.prototype.addToken = function (name, address) {
        if (this.tokens.get(name) == undefined) {
            this.tokens.set(name, new Token(name, address));
        }
    };
    Graph.prototype.addEdge = function (nameTokenFrom, nameTokenTo, pairAddress) {
        if (this.tokens.has(nameTokenFrom) && this.tokens.has(nameTokenTo)) {
            if (!this.tokens.get(nameTokenTo).connectedPairs.has(nameTokenFrom)) {
                var pair = new Pair(this.tokens.get(nameTokenFrom), this.tokens.get(nameTokenTo), pairAddress);
                this.tokens.get(nameTokenFrom).connectedPairs.set(nameTokenTo, pair);
                this.tokens.get(nameTokenTo).connectedPairs.set(nameTokenFrom, pair);
            }
        }
    };
    Graph.prototype.dfs = function (currentTokenName, count, deep) {
        var e_1, _a, e_2, _b;
        this.checked.push(currentTokenName);
        try {
            for (var _c = __values(this.tokens.get(currentTokenName).connectedPairs.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var nextTokenName = _d.value;
                this.path.push(nextTokenName);
                if (nextTokenName == this.nameStartDFSToken) {
                    if (count == deep) {
                        console.log(this.path);
                        try {
                            for (var _e = (e_2 = void 0, __values(this.path.slice(1, 3))), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var element = _f.value;
                                if (!this.usedNames.includes(element)) {
                                    this.usedNames.push(element);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        this.allCount++;
                    }
                    this.path.pop();
                    continue;
                }
                if (!this.checked.includes(nextTokenName)) {
                    this.dfs(nextTokenName, count + 1, deep);
                }
                this.path.pop();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.checked.splice(this.checked.indexOf(currentTokenName), 1);
    };
    Graph.prototype.findAllPathFor = function (nameStartToken, deep) {
        var e_3, _a;
        this.nameStartDFSToken = nameStartToken;
        var currentToken = this.tokens.get(nameStartToken);
        var countPathTokens = 0;
        this.path.push(currentToken.name);
        this.checked.push(currentToken.name);
        this.usedNames = [this.nameStartDFSToken];
        try {
            for (var _b = __values(currentToken.connectedPairs.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tokenName = _c.value;
                this.path.push(tokenName);
                this.dfs(tokenName, countPathTokens + 1, deep);
                this.path.pop();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        console.log(this.allCount);
        console.log(this.usedNames);
        var returned = this.allCount;
        this.allCount = 0;
        return returned;
    };
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
    Graph.prototype.printAllTokensInfo = function () {
        var e_4, _a;
        try {
            for (var _b = __values(this.tokens.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                console.log("Symbol: " + entry.name + ", address: " + entry.address);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    return Graph;
}());
var graph = new Graph();
var fun = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pairs, parsedJson, i, element;
    return __generator(this, function (_a) {
        pairs = fs.readFileSync("main_pairs.json", "utf-8");
        parsedJson = JSON.parse(pairs);
        // console.log(parsedJson.slice(0, 20));
        for (i = 0; i < parsedJson.length; i++) {
            element = parsedJson[i];
            graph.addToken(element['token0']['symbol'], element['token0']['address']);
            graph.addToken(element['token1']['symbol'], element['token1']['address']);
            graph.addEdge(element['token0']['symbol'], element['token1']['symbol'], element['address']);
        }
        // graph.printAllTokensInfo();
        // graph.fetchAllData();
        console.log(parsedJson.length + " - json length");
        console.log(graph.findAllPathFor("WETH", 2));
        return [2 /*return*/];
    });
}); };
fun();
