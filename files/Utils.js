const { BigNumber } = require('bignumber.js');

//a1>b1>b2>c2>c3>a3  a3-a1 = profit
module.exports.computeCircleProfitMaximization = function (_a1,_b1,_b2,_c2,_c3,_a3) {
    
    var a1 = BigNumber(_a1);
    var b1 = BigNumber(_b1);
    var b2 = BigNumber(_b2);
    var c2 = BigNumber(_c2);
    var c3 = BigNumber(_c3);
    var a3 = BigNumber(_a3);

    // var a1 = BigNumber(10000);
    // var b1 = BigNumber(1000000);
    // var b2 = BigNumber(125000);
    // var c2 = BigNumber(5000);
    // var c3 = BigNumber(4000);
    // var a3 = BigNumber(1250);

    //(0.00099108*(-1004.49*sqrt(a1*a3*b1*b2*c2*c3*(b1*c2+b1*c3+b2*c3)^2)-1009*a1*b1*b2*c2*c3-1009*a1*b1*b2*c3^2-1009*a1*b2^2*c3^2))/(b1*c2+b1*c3+b2*c3)^2;
    // (0.00099108*(-1004.49*sqrt(10000*1250*1000000*125000*5000*4000*(1000000*5000+1000000*4000+125000*4000)^2)-1009*10000*1000000*125000*5000*4000-1009*10000*1000000*125000*4000^2-1009*10000*125000^2*4000^2))/(1000000*5000+1000000*4000+125000*4000)^2
    
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

    let profit = (a3.minus(c3.times(a3).div(c3.plus(c2).minus(b2.times(c2).div(b2.plus(b1).minus(a1.times(b1).div(a1.plus(x)))))))).minus(x.minus(BigNumber(3).times(BigNumber(0.0003)).times(x)));
    console.log("Profit: " + profit.toString() + ", input: " + x.toString() + ", % profit: " + profit.times(BigNumber(100)).div(x).toString() + "%");
}


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
        // bProfit = b.minus((b.times(a)).div(a.plus(c).minus((c.times(d)).div(d.plus(BigNumber(x)))))).toNumber() -x
        bProfit = c.minus(c.times(d).div(d.plus(b).minus(b.times(a.div((a.plus(BigNumber(x)))))))).toNumber()-x;
    } else {
        console.log("S->U");
        // bProfit = d.minus(d.times(c).div(c.plus(a).minus(a.times(b).div(b.plus(BigNumber(x)))))).toNumber() -x
        // bProfit = b.minus((b.times(a)).div(a.plus(c).minus((c.times(d)).div(d.plus(BigNumber(x)))))).toNumber() -x
        // bProfit = c-c*d/(d+b-b*a/(a+x))-x;
        bProfit = c.minus(c.times(d).div(d.plus(b).minus(b.times(a.div((a.plus(BigNumber(x)))))))).toNumber()-x;

    }
    
    console.log(blockNumber);
    console.log("UNISWAP: resUSDT " + uRweth + ", resWETH " + uRusdt + ", price WETH " + uRweth/uRusdt);
    console.log("SUSHISWAP: resUSDT " + sRweth + ", resWETH " + sRusdt + ", price WETH " + sRweth/sRusdt);
    console.log("We need " + x.toFixed(2) + " USDT for " + bProfit.toFixed(2) + "USDT black profit (" + (bProfit*100/x).toFixed(3) + "%), fee " + fee + " USDT, white profit " + (bProfit-fee) + " USDT, clear profit "+(bProfit*100/x-0.6).toFixed(3)+"%");
    // console.log(res-fee);
    return x;
}
