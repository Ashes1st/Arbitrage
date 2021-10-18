const { BigNumber } = require('bignumber.js');
const fs = require('fs');
var util = require('util');

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// module.exports.getTxFee = function (res0, res1) {
//     let txFee = BigNumber("0.004158");
//     let wethRes = BigNumber(res0);
//     let coinRes = BigNumber(res1);

//     return txFee.times(coinRes.div(wethRes)).toString();
// }

function getAmountOut(amountIn, reserveIn, reserveOut) {
    var amountInWithFee = amountIn.times(BigNumber(9975));
    var numerator = amountInWithFee.times(reserveOut);
    var denominator = reserveIn.times(BigNumber(10000)).plus(amountInWithFee);
    amountOut = numerator.div(denominator);
    return amountOut;
}

//a1>b1>b2>c2>c3>a3  a3-a1 = profit
module.exports.computeCircleProfitMaximization = function (_a1,_b1,_b2,_c2,_c3,_a3,path, _txFee) {
    
    let txFee = BigNumber(_txFee);
    var a1 = BigNumber(_a1);
    var b1 = BigNumber(_b1);
    var b2 = BigNumber(_b2);
    var c2 = BigNumber(_c2);
    var c3 = BigNumber(_c3);
    var a3 = BigNumber(_a3);

    //(0.00099108*(-1004.49*sqrt(a1*a3*b1*b2*c2*c3*(b1*c2+b1*c3+b2*c3)^2)-1009*a1*b1*b2*c2*c3-1009*a1*b1*b2*c3^2-1009*a1*b2^2*c3^2))/(b1*c2+b1*c3+b2*c3)^2;
 
    var x;
   
    let x1 = (BigNumber(0.00099108).times(
        BigNumber(1004.49).times(
            (a1.times(
            a3).times(
            b1).times(
            b2).times(
            c2).times(
            c3).times(
                (b1.times(c2)).plus(
                b1.times(c3)).plus(
                b2.times(c3)).pow(2))).sqrt()
        ).minus(
            BigNumber(1009).times(
            a1).times(
            b1).times(
            b2).times(
            c2).times(c3)
        ).minus(
            BigNumber(1009).times(
            a1).times(
            b1).times(
            b2).times(
            c3.pow(2))
        ).minus(
            BigNumber(1009).times(
            a1).times(
            b2.pow(2)).times(
            c3.pow(2))
        )
    )).div(
        ((b1.times(c2)).plus(
        b1.times(c3)).plus(
        (b2.times(c3)))).pow(2)
    )

    let x2 = (BigNumber(0.00099108).times(
        BigNumber(1004.49).times(
            (a1.times(
            a3).times(
            b1).times(
            b2).times(
            c2).times(
            c3).times(
                (b1.times(c2)).plus(
                b1.times(c3)).plus(
                b2.times(c3)).pow(2))).sqrt()
        ).minus(
            BigNumber(1009).times(
            a1).times(
            b1).times(
            b2).times(
            c2).times(c3)
        ).minus(
            BigNumber(1009).times(
            a1).times(
            b1).times(
            b2).times(
            c3.pow(2))
        ).minus(
            BigNumber(1009).times(
            a1).times(
            b2.pow(2)).times(
            c3.pow(2))
        )
    )).div(
        ((b1.times(c2)).plus(
        b1.times(c3)).plus(
        (b2.times(c3)))).pow(2)
    )

    if(x1.isGreaterThan(BigNumber(0)) || x2.isGreaterThan(BigNumber(0))){
        if(x1.isGreaterThan(BigNumber(0))){
            x = x1;
        }else {
            x = x2;
        }
    } else {
        return 0;
    }
    let currentBalance = BigNumber("0.498000000000000001");
    // let profit = (a3.minus(c3.times(a3).div(c3.plus(c2).minus(b2.times(c2).div(b2.plus(b1).minus(a1.times(b1).div(a1.plus(x)))))))).minus(x.minus(BigNumber(3).times(BigNumber(0.0025)).times(x))).minus(txFee);
    if(x.isGreaterThan(currentBalance)){
        x = currentBalance;
    }
    let profit = getAmountOut(getAmountOut(getAmountOut(x, a1, b1), b2, c2), c3, a3).minus(x).minus(txFee);
    // let p = a1.plus(x.times(BigNumber(0.9975))
    
    if(profit.isGreaterThan(BigNumber(0))){
        console.log(path);
        console.log("Profit: " + profit.toString() + " " + path[0] + 
                    ", input: " + x.toString() + " " + path[0] + 
                    ", % profit: " + profit.times(BigNumber(100)).div(x).toString() + "%" + 
                    ", txFee: " + txFee.toString() + " " + path[0]);
        return x.toString();
    } else {
        return 0;
    }
}

// Computing profit accross two DEXes
module.exports.computeProfitMaximizing = function (uRusdt, uRweth, sRusdt, sRweth, blockNumber, dirUtoS) {
    var x = 0;
    var a,b,c,d;
    
    if(dirUtoS){
        var c = BigNumber(sRweth);
        var d = BigNumber(sRusdt);
        var a = BigNumber(uRweth);
        var b = BigNumber(uRusdt);
    } else {
        var c = BigNumber(uRweth);
        var d = BigNumber(uRusdt);
        var a = BigNumber(sRweth);
        var b = BigNumber(sRusdt);
    }
    
    const partx1 = BigNumber(-10).times(BigNumber(2515).sqrt());
    const partx2 = BigNumber(10).times(BigNumber(2515).sqrt());
    const part2 = (a.times(b).times(c).times(d).times((b.plus(d)).pow(2))).sqrt();
    const part3 = BigNumber(503).times(a).times(b).times(d);
    const part4 = BigNumber(503).times(a).times(d.pow(2));
    const part5 = BigNumber(503).times((b.plus(d)).pow(2));
    
    const x1 = ((partx1.times(part2)).minus(part3).minus(part4)).div(part5).toNumber();
    const x2 = ((partx2.times(part2)).minus(part3).minus(part4)).div(part5).toNumber();

    if((x1>0) || (x2>0)){
        if(x1>0){
            x = x1;
        }else if (x2 > 0){
            x = x2;
        }
    } else {
        return 0;
    }
    
    fee = x * 0.006;
    let bProfit;

    if(dirUtoS){
        console.log("U->S");
        bProfit = c.minus(c.times(d).div(d.plus(b).minus(b.times(a.div((a.plus(BigNumber(x)))))))).toNumber()-x;
    } else {
        console.log("S->U");
        bProfit = c.minus(c.times(d).div(d.plus(b).minus(b.times(a.div((a.plus(BigNumber(x)))))))).toNumber()-x;

    }
    
    console.log(blockNumber);
    console.log("UNISWAP: resUSDT " + uRweth + ", resWETH " + uRusdt + ", price WETH " + uRweth/uRusdt);
    console.log("SUSHISWAP: resUSDT " + sRweth + ", resWETH " + sRusdt + ", price WETH " + sRweth/sRusdt);
    console.log("We need " + x.toFixed(2) + " USDT for " + bProfit.toFixed(2) + "USDT black profit (" + (bProfit*100/x).toFixed(3) + "%), fee " + fee + " USDT, white profit " + (bProfit-fee) + " USDT, clear profit "+(bProfit*100/x-0.6).toFixed(3)+"%");
    return x;
}
