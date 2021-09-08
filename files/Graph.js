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
exports.Graph = exports.Pair = exports.Token = void 0;
var BN = require("bignumber.js");
var Network_1 = require("./Network");
var Utils_1 = require("./Utils");
var network;
var Pair = /** @class */ (function () {
    function Pair(_token0, _token1, _address) {
        this.token0 = _token0;
        this.token1 = _token1;
        this.address = _address;
        this.reserve0 = "0";
        this.reserve1 = "0";
    }
    Pair.prototype.setReserve = function (_reserve0, _reserve1) {
        var fBN = BN.BigNumber.clone({ DECIMAL_PLACES: this.token0.decimal });
        var sBN = BN.BigNumber.clone({ DECIMAL_PLACES: this.token1.decimal });
        this.reserve0 = (new fBN(_reserve0).div((new fBN(10).pow(this.token0.decimal)))).toString();
        this.reserve1 = (new sBN(_reserve1).div((new sBN(10).pow(this.token1.decimal)))).toString();
    };
    return Pair;
}());
exports.Pair = Pair;
var Token = /** @class */ (function () {
    function Token(_name, _address) {
        this.name = _name;
        this.connectedPairs = new Map([]);
        this.address = _address;
    }
    Token.prototype.setDecimal = function (_decimal) {
        this.decimal = _decimal;
    };
    return Token;
}());
exports.Token = Token;
var Graph = /** @class */ (function () {
    function Graph(_web3, _json) {
        this.usedPathes = [];
        this.usedPairsAddress = new Map([]);
        this.tokens = new Map([]);
        this.checked = [];
        this.nameStartDFSToken = "";
        this.allCount = 0;
        this.currentPath = [];
        network = new Network_1.Network(_web3);
        this.fetchInfoFromJson(_json);
    }
    Graph.prototype.addToken = function (name, address, decimal) {
        if (this.tokens.get(name) == undefined) {
            var token = new Token(name, address);
            token.setDecimal(decimal);
            this.tokens.set(name, token);
        }
    };
    Graph.prototype.addEdge = function (nameTokenFrom, nameTokenTo, pairAddress) {
        if (pairAddress == undefined) {
            console.log(nameTokenFrom + " and " + nameTokenTo + "address pair undefined");
        }
        else {
            if (this.tokens.has(nameTokenFrom) && this.tokens.has(nameTokenTo)) {
                if (!this.tokens.get(nameTokenTo).connectedPairs.has(nameTokenFrom)) {
                    var pair = new Pair(this.tokens.get(nameTokenFrom), this.tokens.get(nameTokenTo), pairAddress);
                    this.tokens.get(nameTokenFrom).connectedPairs.set(nameTokenTo, pair);
                    this.tokens.get(nameTokenTo).connectedPairs.set(nameTokenFrom, pair);
                }
            }
        }
    };
    Graph.prototype.dfs = function (currentTokenName, count, deep) {
        var e_1, _a, e_2, _b;
        this.checked.push(currentTokenName);
        try {
            for (var _c = __values(this.tokens.get(currentTokenName).connectedPairs.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var nextTokenName = _d.value;
                this.currentPath.push(nextTokenName);
                if (nextTokenName == this.nameStartDFSToken) {
                    if (count == deep) {
                        for (var i = 0; i < this.currentPath.length - 1; i++) {
                            if (!this.usedPairsAddress.has(this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i + 1]))) {
                                if (this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i + 1]) != undefined) {
                                    this.usedPairsAddress.set(this.tokens.get(this.currentPath[i]).connectedPairs.get(this.currentPath[i + 1]), true);
                                }
                            }
                        }
                        try {
                            for (var _e = (e_2 = void 0, __values(this.currentPath.slice(1, 3))), _f = _e.next(); !_f.done; _f = _e.next()) {
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
                        var _path = [];
                        _path = _path.concat(this.currentPath);
                        this.usedPathes.push(_path);
                        this.allCount++;
                    }
                    this.currentPath.pop();
                    continue;
                }
                if (!this.checked.includes(nextTokenName)) {
                    this.dfs(nextTokenName, count + 1, deep);
                }
                this.currentPath.pop();
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
        this.currentPath.push(currentToken.name);
        this.checked.push(currentToken.name);
        this.usedNames = [this.nameStartDFSToken];
        try {
            for (var _b = __values(currentToken.connectedPairs.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tokenName = _c.value;
                this.currentPath.push(tokenName);
                this.dfs(tokenName, countPathTokens + 1, deep);
                this.currentPath.pop();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.currentPath.pop();
        var returned = this.allCount;
        this.allCount = 0;
    };
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
    Graph.prototype.updateReserves = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promiseReserves, _a, _b, pair, reserves, i, _c, _d, pair, _e, _f, _g, e_5_1;
            var e_6, _h, e_5, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        promiseReserves = [];
                        try {
                            for (_a = __values(this.usedPairsAddress.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                pair = _b.value;
                                reserves = network.getReservesPair(pair.address);
                                promiseReserves.push(reserves);
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_h = _a["return"])) _h.call(_a);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        i = 0;
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 7, 8, 9]);
                        _c = __values(this.usedPairsAddress.keys()), _d = _c.next();
                        _k.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 6];
                        pair = _d.value;
                        _f = (_e = pair).setReserve;
                        return [4 /*yield*/, promiseReserves[i]];
                    case 3:
                        _g = [(_k.sent()).reserve0];
                        return [4 /*yield*/, promiseReserves[i]];
                    case 4:
                        _f.apply(_e, _g.concat([(_k.sent()).reserve1]));
                        i++;
                        _k.label = 5;
                    case 5:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_5_1 = _k.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_d && !_d.done && (_j = _c["return"])) _j.call(_c);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Graph.prototype.logInfo = function () {
        var e_7, _a;
        try {
            for (var _b = __values(this.usedPathes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _path = _c.value;
                console.log(_path);
                for (var i = 0; i < _path.length - 1; i++) {
                    console.log(this.tokens.get(_path[i]).connectedPairs.get(_path[i + 1]).token0.name + " reserve: " + this.tokens.get(_path[i]).connectedPairs.get(_path[i + 1]).reserve0);
                    console.log(this.tokens.get(_path[i]).connectedPairs.get(_path[i + 1]).token1.name + " reserve: " + this.tokens.get(_path[i]).connectedPairs.get(_path[i + 1]).reserve1);
                }
                console.log('---------');
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    Graph.prototype.searchOpportunity = function () {
        var e_8, _a;
        try {
            for (var _b = __values(this.usedPathes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _path = _c.value;
                var a1;
                var b1;
                var b2;
                var c2;
                var c3;
                var a3;
                var p1;
                var p2;
                var p3;
                p1 = this.tokens.get(_path[0]).connectedPairs.get(_path[1]);
                p2 = this.tokens.get(_path[1]).connectedPairs.get(_path[2]);
                p3 = this.tokens.get(_path[2]).connectedPairs.get(_path[3]);
                if (p1.token0.name == this.nameStartDFSToken) {
                    a1 = p1.reserve0;
                    b1 = p1.reserve1;
                    if (p1.token1.name == p2.token0.name) {
                        b2 = p2.reserve0;
                        c2 = p2.reserve1;
                        if (p2.token1.name == p3.token0.name) {
                            c3 = p3.reserve0;
                            a3 = p3.reserve1;
                        }
                        else {
                            c3 = p3.reserve1;
                            a3 = p3.reserve0;
                        }
                    }
                    else {
                        b2 = p2.reserve1;
                        c2 = p2.reserve0;
                        if (p2.token0.name == p3.token0.name) {
                            c3 = p3.reserve0;
                            a3 = p3.reserve1;
                        }
                        else {
                            c3 = p3.reserve1;
                            a3 = p3.reserve0;
                        }
                    }
                }
                else {
                    a1 = p1.reserve1;
                    b1 = p1.reserve0;
                    if (p1.token0.name == p2.token1.name) {
                        b2 = p2.reserve1;
                        c2 = p2.reserve0;
                        if (p2.token0.name == p3.token0.name) {
                            c3 = p3.reserve0;
                            a3 = p3.reserve1;
                        }
                        else {
                            c3 = p3.reserve1;
                            a3 = p3.reserve0;
                        }
                    }
                    else {
                        b2 = p2.reserve0;
                        c2 = p2.reserve1;
                        if (p2.token1.name == p3.token0.name) {
                            c3 = p3.reserve0;
                            a3 = p3.reserve1;
                        }
                        else {
                            c3 = p3.reserve1;
                            a3 = p3.reserve0;
                        }
                    }
                }
                (0, Utils_1.computeCircleProfitMaximization)(a1, b1, b2, c2, c3, a3, _path);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    Graph.prototype.fetchInfoFromJson = function (_json) {
        var parsedJson = JSON.parse(_json);
        for (var i = 0; i < parsedJson.length; i++) {
            var element = parsedJson[i];
            this.addToken(element['token0']['symbol'], element['token0']['address'], element['token0']['decimal']);
            this.addToken(element['token1']['symbol'], element['token1']['address'], element['token1']['decimal']);
            this.addEdge(element['token0']['symbol'], element['token1']['symbol'], element['address']);
        }
    };
    return Graph;
}());
exports.Graph = Graph;
