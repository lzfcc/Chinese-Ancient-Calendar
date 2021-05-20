import {
    big
} from './para_constant.mjs'
import {
    CongruenceModulo,
} from './modulo_qiuyi.mjs'
import {
    GcdLcm, GcdLcmGroup, FracLcm1
} from './modulo_gcdlcm.mjs'
import {
    isSame, Frac2FalseFrac, Decimal2Int
} from './equa_math.mjs'
// const pi = big.acos(-1).toString()
// console.log(pi)
/////// 大衍總數術（秦九韶元數變定母推廣）。1、张述信、张志尚《一次同余式组的程序求解》，《吉林工程技術師範學院學報》2006() 2、沈康身《數書九章大衍類算題中的數論命題》，《杭州大學學報》1986
// x ≡ b1 (mod m1)
// x ≡ b2 (mod m2)
// x ≡ b3 (mod m3)
export const Sunzi = function () {
    let InputRaw = (arguments[0]).split(/;|,|，|。|；|｜| /)
    if (InputRaw[InputRaw.length - 1] === '') {
        InputRaw = InputRaw.slice(0, -1)
    }
    for (let m = 1; m < InputRaw.length; m++) { // 處理成一個字符串傳給轉整數函數
        InputRaw[m] = InputRaw[m - 1] + ',' + InputRaw[m]
    }
    const Input = Decimal2Int(InputRaw[InputRaw.length - 1]).Int
    const portion = Decimal2Int(InputRaw[InputRaw.length - 1]).portion
    const i = Input.length
    if (i % 2 === 1) {
        throw (new Error('[大衍總數] 參數數量應爲偶數！' + Input[0] + ', ' + Input[1]))
    }
    let Yuan = [] // 從輸入中拆分出元數、餘數
    const rRaw = []
    for (let j = 0; j <= i / 2 - 1; j++) {
        Yuan.push(Input[2 * j + 1])
        rRaw.push(Input[2 * j])
    }
    let YuanCheck = Yuan.slice()
    const check = YuanCheck.sort() // 這會莫名其妙顛倒順序，所以來一個臨時變量
    for (let ci = 0; ci < check.length; ci++) {
        if (check[ci] === check[ci + 1]) {
            throw (new Error('[大衍總數] 元數 ' + check[ci] + ' 有重複，無解！'))
        }
    }
    // 暫且來檢查兩邊，以後再刪
    // let Num1 = 0
    // while (Num1 < Yuan.length) {
    //     for (let ci = Yuan.length - 1 - Num1; ci >= 1; ci--) {
    //         let Num2 = 0
    //         while (ci - 1 - Num2 >= 0) {
    //             const gcd = GcdLcm(Yuan[ci], Yuan[ci - 1 - Num2]).gcd
    //             const rRawDif = Math.abs(rRaw[ci] - rRaw[ci - 1 - Num2])
    //             if (rRawDif / gcd !== Math.floor(rRawDif / gcd)) {
    //                 throw (new Error('【大衍總數｜元數】' + Yuan[ci] + ',' + Yuan[ci - 1 - Num2] + '不滿足 (a,b)|c，無解！'))
    //             }
    //             Num2++
    //         }
    //     }
    //     Num1++
    // }
    let DingRaw = Yuan.slice() // 定母
    let BianNum = 0
    // 《秦九韶“历家虽用, 用而不知”解》提出正確的解釋，但是下面的程序依然是把「奇」當作第一個數的老解釋。此外，該文「“通其率”既非约分, 亦非渐近分数算法, 而是《晋书·律历志》和《宋书·律历志》中的“通分相约, 终而率之”。简单地说, “通其率”等于《后汉书·律历志》中的“通率”」通分和通其率的區別是是否互質。
    // while (BianNum < Yuan.length) {
    //     for (let k = Yuan.length - 1 - BianNum; k >= 1; k--) {
    //         let LoopNum = 0
    //         while (k - 1 - LoopNum >= 0) {
    //             let gcd = GcdLcm(DingRaw[k], DingRaw[k - 1 - LoopNum]).gcd
    //             DingRaw[k - 1 - LoopNum] /= gcd
    //             gcd = GcdLcm(DingRaw[k], DingRaw[k - 1 - LoopNum]).gcd
    //             while (gcd > 1) {
    //                 DingRaw[k - 1 - LoopNum] *= gcd
    //                 DingRaw[k] /= gcd
    //                 gcd = GcdLcm(DingRaw[k], DingRaw[k - 1 - LoopNum]).gcd
    //             }
    //             LoopNum++
    //         }
    //     }
    //     BianNum++
    // }
    while (BianNum < Yuan.length) {
        for (let k = Yuan.length - 1 - BianNum; k >= 1; k--) {
            let LoopNum = 0
            while (k - 1 - LoopNum >= 0) {
                let gcd = GcdLcm(DingRaw[k], DingRaw[k - 1 - LoopNum]).gcd
                DingRaw[k - 1 - LoopNum] = big.div(DingRaw[k - 1 - LoopNum], gcd).toNumber()
                gcd = GcdLcm(DingRaw[k], DingRaw[k - 1 - LoopNum]).gcd
                while (big(gcd).gt(1)) { // if gcd > 1
                    DingRaw[k - 1 - LoopNum] = big.mul(DingRaw[k - 1 - LoopNum], gcd).toNumber()
                    DingRaw[k] = big.div(DingRaw[k], gcd).toNumber()
                    gcd = GcdLcm(DingRaw[k], DingRaw[k - 1 - LoopNum]).gcd
                }
                LoopNum++
            }
        }
        BianNum++
    }
    let Ding = [] // 把定母爲1的全部捨去，不影響結果
    let r = []
    for (let j = 0; j <= i / 2 - 1; j++) {
        if (DingRaw[j] > 1) {
            Ding.push(DingRaw[j])
            r.push(rRaw[j])
        }
    }
    let Num1 = 0
    while (Num1 < Ding.length) {
        for (let ci = Ding.length - 1 - Num1; ci >= 1; ci--) {
            let Num2 = 0
            while (ci - 1 - Num2 >= 0) {
                const gcd = GcdLcm(Ding[ci], Ding[ci - 1 - Num2]).gcd
                const rRawDif = Math.abs(rRaw[ci] - rRaw[ci - 1 - Num2])
                if (rRawDif / gcd !== ~~(rRawDif / gcd)) {
                    throw (new Error('【大衍總數｜定母】' + Ding[ci] + ',' + Ding[ci - 1 - Num2] + '不滿足 (a,b)|c，無解！'))
                }
                Num2++
            }
        }
        Num1++
    }
    ///////////////// 孫子定理
    let S = 1 // 定母相乘爲衍母，是元數的最小公倍數
    for (let k = 0; k < Ding.length; k++) {
        S = big.mul(S, Ding[k])
    }
    S = S.toString()
    let M = [] // 衍數
    let Yong = [] // 泛用、用數
    for (let k = 0; k < Ding.length; k++) { // bk=Input[2*(k-1)]，mk=Input[2*k-1]
        M[k] = big.div(S, Ding[k])
        Yong[k] = CongruenceModulo(M[k], Ding[k]).Yong // 大衍求一可以檢查是否互質
    }
    let sum = 0 // 并總
    for (let k = 0; k < Ding.length; k++) {
        sum = big.add(sum, big.mul(Yong[k], r[k]))
    }
    // const x = parseFloat(((sum % S) / portion).toPrecision(12))
    // S = parseFloat((S / portion).toPrecision(12))
    const x = big.mod(sum, S).div(portion).toString()
    S = big.div(S, portion).toString()
    const Print = `x = ${x} + ${S}n (n = 0, 1, 2 ...)`
    let DingPrint = '定母 ' + DingRaw
    const flag = isSame(Yuan, DingRaw)
    if (flag === true) {
        DingPrint = '定母 = 元數'
    }
    return { S, Print, DingPrint, x }
}
// console.log(Sunzi('60,130;30,120;20,110;30,100;30,60;30,50;5,25;10,20').Print) // 積尺尋源
// console.log(Sunzi('10,12;0,11;0,10;4,9;6,8;0,7;4,6').Print) // 推庫額錢
// console.log(Sunzi('2,14,5,6').Print) // 如果保留上面的檢查，章法就算不出來，如果不保留，這個就一樣算。

///////// 解二元一次不定方程
export const IndetermEqua1 = (a, b, z) => { // 二元一次不定方程
    a = ~~a
    b = ~~b
    z = ~~z
    if (a < 0 && b < 0) {
        a = -a
        b = -b
        z = -z
    }
    const gcd = GcdLcm(a, b).gcd
    if (gcd > 1 && (z / gcd === ~~(z / gcd))) {
        a /= gcd
        b /= gcd
        z /= gcd
    } else if (gcd > 1 && (z / gcd !== ~~(z / gcd))) {
        throw (new Error('不滿足有解的充要條件！'))
    }
    const tmp = b
    let isExchange = 0
    if (b === 1) {
        b = a
        a = tmp
        isExchange = 1
    }
    const u = ~~(CongruenceModulo(a, b).Result)
    let x = []
    let y = []
    x[0] = (u * z % b) // x≡ u * z(mod b)
    y[0] = -((x * a - z) / b) // * gcd
    // x[0] *= gcd
    for (let n = -1; n <= y[0] / a + 2; n++) {
        x[n] = x[0] + n * b
        y[n] = y[0] - n * a
    }
    const xPrint = (isExchange ? 'y = ' : 'x = ') + x[0] + (b > 0 ? ' + ' : ' - ') + Math.abs(b) + 'n'
    const yPrint = (isExchange ? 'x = ' : 'y = ') + y[0] + (a > 0 ? ' - ' : ' + ') + Math.abs(a) + 'n'
    return { x, y, xPrint, yPrint }
}
// console.log(IndetermEqua1(14,5,9))

// 秦九韶調日法
export const IndetermEqua = (a, b, z) => { // a彊母b弱母
    a = ~~a
    b = ~~b
    z = ~~z
    if (a < 0 && b < 0) {
        a = -a
        b = -b
        z = -z
    }
    const SmallNumer = b - ~~(CongruenceModulo(a, b).Result)
    const BigNumer = (1 + a * SmallNumer) / b
    const gcd = GcdLcm(a, b).gcd
    if (gcd > 1 && (z / gcd === ~~(z / gcd))) {
        a /= gcd
        b /= gcd
        z /= gcd
    } else if (gcd > 1 && (z / gcd !== ~~(z / gcd))) {
        throw (new Error('【秦調日法】不滿足有解的充要條件！'))
    }
    const u = ~~(CongruenceModulo(a, b).Result)
    let x = []
    let y = []
    x[0] = (u * z % b) // x≡ u * z(mod b)
    y[0] = -((x * a - z) / b) * gcd
    x[0] *= gcd
    let xSpecial1 = 0
    let ySpecial1 = 0
    let xSpecial2 = 0
    let ySpecial2 = 0
    let num1 = 0
    let num2 = 0
    for (let n = -1; n <= y[0] / a + 2; n++) {
        x[n] = x[0] + n * b
        y[n] = y[0] - n * a
        if (y[n] < a && y[n] > 0) {
            ySpecial1 = y[n]
            ySpecial2 = y[n - 1]
            num1 = n
            num2 = n - 1
        }
        xSpecial1 = x[num1]
        xSpecial2 = x[num2]
    }
    const LunarFrac1 = BigNumer * xSpecial1 + SmallNumer * ySpecial1
    const LunarFrac2 = BigNumer * xSpecial2 + SmallNumer * ySpecial2
    const xPrint = '【彊率】' + BigNumer + '/' + a + ' 【彊數】' + xSpecial1 + ' = ' + x[0] + (b > 0 ? ' + ' : ' - ') + Math.abs(b) + ' × ' + num1
    const yPrint = '【弱率】' + SmallNumer + '/' + b + ' 【弱數】' + ySpecial1 + ' = ' + y[0] + (a > 0 ? ' - ' : ' + ') + Math.abs(a) + ' × ' + num1
    let Decompose = null
    if (xSpecial1) {
        Decompose = '【朔餘A】' + LunarFrac1 + ' = ' + BigNumer + '×' + xSpecial1 + ' + ' + SmallNumer + '×' + ySpecial1 + (xSpecial2 ? '【朔餘B】' + LunarFrac2 + ' = ' + BigNumer + '×' + xSpecial2 + ' + ' + SmallNumer + '×' + ySpecial2 : '') + ' 【日法】' + z + ' = ' + a + '×' + xSpecial1 + ' + ' + b + '×' + ySpecial1
    }
    return { x, y, xPrint, yPrint, Decompose, LunarFrac1 }
}

// console.log(IndetermEqua1(1, 60, 40))

//////// 分數週期
// const FracLcm = function () {
//     const S1 = Sunzi(arguments[0]).S
//     let Input = ((arguments[0]).split(/;|,|，|。|；|｜| /))
//     if (Input[Input.length - 1] === '') {
//         Input = Input.slice(0, -1)
//     }
//     for (let j = 0; j < Input.length; j++) {
//         Input[j] = parseInt(Input[j])
//     }
//     const i = Input.length
//     let Denom = [] // 從輸入中拆分出元數、餘數
//     const Numer = []
//     for (let j = 0; j <= i / 2 - 1; j++) {
//         Denom.push(Input[2 * j + 1])
//         Numer.push(Input[2 * j])
//     }
//     let Yuan = []
//     for (let k = 0; k < Denom.length; k++) {
//         Yuan[k] = S1 * Numer[k] / Denom[k]
//     }
//     let tmp = []
//     for (let k = 0; k <= i / 2 - 1; k++) {
//         tmp[k] = 0 + ',' + Yuan[k] + ';'
//     }
//     let tmpSum = ''
//     for (let k = 0; k <= i / 2 - 1; k++) {
//         tmpSum += tmp[k]
//     } // 上面是爲了湊出一個能給Sunzi函數用的字符串
//     const S2 = Sunzi(tmpSum).S
//     const S2Print = '分母最小公倍數 ' + S1 + '，共同週期 ' + S2 + '/' + S1 + ' = ' + (S2 / S1) + 'n'
//     const ZhangYuanRange = parseFloat(((S2 / Input[0]) * Input[1] / Input[3]).toPrecision(14))
//     return {
//         ZhangYuanRange,
//         S2Print
//     }
// }

// console.log(FracLcm('1461,4;27759,940;60,1').ZhangYuanRange) // 四分
// console.log(FracLcm('215130,589;43026,1457;60,1').ZhangYuanRange) // 乾象多了19倍
// console.log(FracLcm('673150，1843;134630，4559；60,1；').ZhangYuanRange) // 景初多了19倍
// console.log(FracLcm('2629759,7200;2629759,89052;60,1').ZhangYuanRange) // 玄始
// console.log(FracLcm('895220，2451；179044，6063;60,1；').ZhangYuanRange) // 三紀甲子
// console.log(FracLcm('14423804，39491；116321，3939；60，1').ZhangYuanRange) // 大明
// console.log(FracLcm('4745247，12992；1581748，53563；60，1').ZhangYuanRange) // 大象

//////////////////// 求章法元法
export const ZhangModulo = (SolarFrac, SolarDenom, LunarFrac, Denom) => {
    SolarFrac = +SolarFrac
    SolarDenom = +SolarDenom
    LunarFrac = +LunarFrac
    Denom = +Denom
    // let Type = 0
    // if (SolarDenom === Denom) { // 唐宋
    //     Type = 2
    // } else if (Denom / SolarDenom === Math.floor(Denom / SolarDenom)) { // 四分
    //     Type = 1
    // }
    const lcm = GcdLcm(SolarDenom, Denom).lcm
    const SolarNumerRaw = 365 * SolarDenom + SolarFrac
    const SolarNumer = SolarNumerRaw * lcm / SolarDenom
    const LunarNumerRaw = 29 * Denom + LunarFrac
    const LunarNumer = LunarNumerRaw * lcm / Denom
    const ZhangRange = IndetermEqua1(SolarNumer, LunarNumer, 0).x[1]
    const ZhangMon = ZhangRange * SolarNumerRaw * Denom / SolarDenom / LunarNumerRaw
    const ZhangLeap = ZhangMon - 12 * ZhangRange
    const tmp = SolarNumerRaw + ',' + SolarDenom + ';' + LunarNumerRaw + ',' + Denom + ';60,1'
    const tmp2 = SolarNumerRaw + ',' + SolarDenom + ';' + LunarNumerRaw + ',' + Denom + ';1,1'
    // let ZhangBuRange = 0
    // let ZhangYuanRange = 0
    // if (Type < 2) {
    //     ZhangBuRange = FracLcm(tmp2).ZhangYuanRange
    //     ZhangYuanRange = FracLcm(tmp).ZhangYuanRange
    // }
    // if (Type === 1) {
    //     BuRange = ZhangBuRange
    //     YuanRange = ZhangYuanRange
    // } 
    // else     if (Type === 2) {
    //     BuRange = parseFloat((((FracLcm1(tmp2).lcmResult) / SolarNumerRaw) * SolarDenom).toPrecision(14))
    //     YuanRange = parseFloat((((FracLcm1(tmp).lcmResult) / SolarNumerRaw) * SolarDenom).toPrecision(14))
    // } 
    // else {
    //     BuRange = parseFloat((ZhangBuRange / ZhangRange).toPrecision(12))
    //     YuanRange = parseFloat((ZhangYuanRange / ZhangRange).toPrecision(12))
    // }
    // const BuMon = parseFloat((ZhangMon * BuRange / ZhangRange).toPrecision(12))
    // const YuanDay = parseFloat((YuanRange * SolarNumerRaw / SolarDenom).toPrecision(12))
    // const YuanBuNum = parseFloat((YuanRange / BuRange).toPrecision(12))
    // const BuZhangNum = parseFloat((BuRange / ZhangRange).toPrecision(12))
    const BuRangeRaw = FracLcm1(tmp2).lcmResult
    const YuanRangeRaw = FracLcm1(tmp).lcmResult
    const BuRange = (big.mul(big(BuRangeRaw).div(SolarNumerRaw), SolarDenom)).toString()
    const YuanRange = (big.mul(big(YuanRangeRaw).div(SolarNumerRaw), SolarDenom)).toString()
    const BuMon = big(ZhangMon).mul(BuRange).div(ZhangRange)
    const YuanDay = big(YuanRange).mul(SolarNumerRaw).div(SolarDenom)
    const YuanBuNum = big(YuanRange).div(BuRange)
    const BuZhangNum = big(BuRange).div(ZhangRange)
    const Print = '章法 ' + ZhangRange + '，章閏 ' + ZhangLeap + '，章月 ' + ZhangMon + `。\n蔀（紀）法 ` + BuRange + '，蔀（紀）月 ' + BuMon.toString() + `。\n元法 ` + YuanRange + '，元日 ' + YuanDay.toString() + `。\n1 元 = ` + YuanBuNum.toString() + ' 蔀，1 蔀 = ' + BuZhangNum.toString() + ' 章'
    return { ZhangRange, YuanRange, Print }
}
// console.log(ZhangModulo(1, 4, 499, 940).Print) // 四分
// console.log(ZhangModulo(145, 589, 773, 1457).Print) // 乾象
// console.log(ZhangModulo(455, 1843, 2419, 4559).Print) // 景初11058
// console.log(ZhangModulo(9589, 39491, 2090, 3939).Print) // 大明
// console.log(ZhangModulo(5461, 22338, 146595, 276284).Print) // 甲寅原來的失敗，改成求分數最小公倍數就好了
// console.log(ZhangModulo(5787, 23660, 155272, 292635).Print) // 天保原來的失敗
// console.log(ZhangModulo(3167, 12992, 28422, 53563).Print) // 大象原來的失敗
// console.log(ZhangModulo(4108, 16900, 8967, 16900).Print) // 開禧
// console.log(ZhangModulo(1801, 7420, 3937, 7420).Print) // 成天
// console.log(ZhangModulo(24, 100, 53, 100, 1, 1).Print) // 實驗

// 四分魏晉南北曆推算入元年
export const OriginModulo2 = (SolarFrac, SolarDenom, LunarFrac, Denom, OriginConstRaw, FirstConstRaw) => { //  LunarFrac,
    SolarFrac = +SolarFrac
    SolarDenom = +SolarDenom
    LunarFrac = +LunarFrac
    Denom = +Denom
    const OriginConstNumer = Frac2FalseFrac(OriginConstRaw).Numer
    const FirstConstNumer = Frac2FalseFrac(FirstConstRaw).Numer
    const SolarNumer = SolarDenom * 365 + SolarFrac
    const LunarNumer = Denom * 29 + LunarFrac
    const portion = SolarDenom * Denom
    const OriginComm = OriginConstNumer * Denom
    const FirstComm = FirstConstNumer * SolarDenom
    const LeapComm = OriginComm - FirstComm
    const SolarComm = SolarNumer * Denom
    const LunarComm = LunarNumer * SolarDenom
    const ScComm = 60 * portion
    const tmp = OriginComm + ',' + ScComm + ',' + LeapComm + ',' + LunarComm // 0 + ',' + SolarComm + ',' +
    const Result = (Sunzi(tmp).x) / SolarComm
    const Print = '入元 ' + Result + ' 年（算外）'
    return { Print }
}
// console.log(OriginModulo2(1, 4, 499, 940, '34+3/4', '11+410/940').Print)
// console.log(OriginModulo2(1, 4, 499, 940, '18+3/4', '11+410/940').Print)
// console.log(OriginModulo2(145, 589, 773, 1457, '7+527/589', '1+180/1457').Print)


// 汪曉勤《數書九章大衍類算題的若干註記》，《浙江師大學報》1997(2)。王翼勛《秦九韶演紀積年法初探》，《自然科學史研究》1997(1)。這裏的算法是我的超級無敵簡便算法
// const OriginConst = // 實測冬至距離甲子的日數和小餘，分母日法（開禧氣定骨）
// const FirstConst = // 實測天正經朔（開禧閏泛骨）
export const OriginModulo = (Denom, SolarFrac, OriginConstRaw, FirstConstRaw) => { //  LunarFrac,
    Denom = +Denom
    SolarFrac = +SolarFrac
    let OriginConst = Frac2FalseFrac(OriginConstRaw).Numer
    const FirstConst = Frac2FalseFrac(FirstConstRaw).Numer
    const LunarFrac = IndetermEqua(49, 17, Denom).LunarFrac1
    const SolarNumer = Denom * 365 + SolarFrac
    const LunarNumer = Denom * 29 + LunarFrac
    const YearLeap = SolarNumer - 12 * LunarNumer // 歲閏
    const tmp = SolarFrac + ',' + Denom + ',' + OriginConst
    const gcd = GcdLcmGroup(tmp).gcd // 斗分和日法的公因數：等數
    SolarFrac /= gcd
    OriginConst /= gcd
    const BuRange = Denom / gcd
    const YuanRange = 60 * BuRange // 氣元率=元率=60*Denom/gcd=60*BuRange
    const YuanYear = 60 * IndetermEqua(SolarFrac, BuRange, OriginConst / 60).x[0] // 入元歲
    const LeapContrac = LunarNumer + FirstConst - (YearLeap * YuanYear % LunarNumer) // 188578閏縮。(YearLeap * YuanYear % LunarNumer) 爲入閏
    const YuanLeap = (YearLeap * YuanRange) % LunarNumer // 377873元閏
    const YuanAccum = IndetermEqua(YuanLeap, -LunarNumer, LeapContrac).x[0] // 元數
    const Origin = YuanRange * YuanAccum + YuanYear // YuanRange * n爲朔積年
    const OriginPrint = '演紀上元距今 ' + Origin + ' 年 = 元率 ' + YuanRange + ' × 元數 ' + YuanAccum + ' + 入元歲 ' + YuanYear + `。\n等數 ` + gcd + '，蔀率 ' + BuRange
    return { Origin, OriginPrint }
}
// console.log(OriginModulo(16900, 4108, '12+7540/16900', '10+11671/16900').Origin) // 開禧 7848180
// 那麼在未知實測的情況下，怎樣從上元解得實測？
// console.log(OriginModulo(10002, 2445, 5307, 135000, 454170).Origin) // 應天964年冬至
// 3653175*4825560=17628615153000，17628615153000%(60*10002)=135000,135000/10002=13...4974，甲子算外丁丑。閏餘17628615153000%295365=280950。天正經朔=17628615153000-280950=17628614872050，17628614872050%(60*10002)=454170，454170/10002=45...4080，甲子算外己酉，與程序算的一樣
// 730635*4825560=3525723030600，3525723030600%(60*10002)=27000
// console.log(OriginModulo(7290, 1776, 3868, 372960, 367338).Origin) // 紀元

////////// 曲安京《唐宋曆法演紀上元實例及算法分析》，《自然科學史研究》1991(4)
// 明天歲差算法： 歲差dif*實測積度≡多少度之外就是上元積度 (mod Solar+歲差dif) 
// Origin≡甲辰年(41-1) (mod 60)
// SolarNumer*Origin≡OriginConst (mod 60*Denom)
// SolarNumer*Origin≡LeapConst (mod  LunarFrac )
// N1≡ R0(mod 60) // N0<10**8
// TN0≡ R1(mod 60 À) // R1，R2誤差<=0.01 // 1刻
// TN0≡ R2(mod B)