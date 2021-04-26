import {
    big
} from './para_constant.mjs'
// const CongruenceModulo = function (aRaw, bRaw) { // 大衍求一術：奇數 * x ≡ 1 (mod 592)，求 x。 https://zhuanlan.zhihu.com/p/272302805 
//     //   L1=1 | a奇數
//     //   -----+-----
//     //   L2=0 | b定母
//     let a = parseInt(aRaw)
//     let b = parseInt(bRaw)
//     let sign = 1
//     if (a < 0) {
//         a = -a
//         sign = -1
//     }
//     if (b < 0) {
//         b = -b
//     }
//     if (a > b) {
//         a = a % b
//     }
//     let i = 0
//     let L1 = 1
//     let L2 = 0
//     while (i % 2 === 0 ? a > 1 : b > 1) {
//         if (i % 2 === 0) {
//             L2 = L1 * Math.floor(Math.max(a, b) / Math.min(a, b)) + L2
//             b = Math.max(a, b) % Math.min(a, b)
//         } else {
//             L1 = L2 * Math.floor(Math.max(a, b) / Math.min(a, b)) + L1
//             a = Math.max(a, b) % Math.min(a, b)
//         }
//         i++
//     }
//     let Result = sign * L1
//     if (i % 2 === 1) { // 最後是右下先出現1的話，還要再算一步
//         L1 = L2 * Math.floor(Math.max(a, b) / Math.min(a, b)) + L1
//         a = Math.max(a, b) % Math.min(a, b)
//         Result = sign * (L1 - L2)
//     }
//     if (aRaw * Result % bRaw !== 1) {
//         throw (new Error('【大衍求一】兩數不互質！'))
//     }
//     const Yong = aRaw * Result // 乘率對乘衍數得泛用
//     const Print = aRaw + ' × ' + Result + ' = ' + Yong + ' ≡ ' + Yong % bRaw + ' (mod ' + bRaw + ')'
//     const SmallNumer = (Yong - 1) / bRaw
//     return {
//         Print,
//         SmallNumer,
//         Result,
//         Yong,
//     }
// }
export const CongruenceModulo = (aRaw, bRaw) => { // 大衍求一術：奇數 * x ≡ 1 (mod 592)，求 x。 https://zhuanlan.zhihu.com/p/272302805 
    //   L1=1 | a奇數
    //   -----+-----
    //   L2=0 | b定母
    let a = new big(aRaw)
    let b = new big(bRaw)
    let sign = 1
    if (big(a).lt(0)) {
        a = a.neg()
        sign = -1
    }
    if (big(b).lt(0)) {
        b = b.neg()
    }
    if (big(a).gt(b)) {
        a = big.mod(a, b)
    }
    let i = 0
    let L1 = 1
    let L2 = 0
    while (i % 2 === 0 ? big(a).gt(1) : big(b).gt(1)) {
        if (i % 2 === 0) {
            L2 = big(L1).mul(big.floor(big.max(a, b).div(big.min(a, b)))).add(L2)
            b = big.mod(big.max(a, b), big.min(a, b))
        } else {
            L1 = big(L2).mul(big.floor(big.max(a, b).div(big.min(a, b)))).add(L1)
            a = big.mod(big.max(a, b), big.min(a, b))
        }
        i++
    }
    let Result = big.mul(sign, L1)
    if (i % 2 === 1) { // 最後是右下先出現1的話，還要再算一步
        L1 = big(L2).mul(big.floor(big.max(a, b).div(big.min(a, b)))).add(L1)
        a = big.mod(big.max(a, b), big.min(a, b))
        Result = big.sub(L1, L2).mul(sign)
    }
    if (big.mul(aRaw, Result).mod(bRaw).eq(1)) {} else {
        throw (new Error('【大衍求一】兩數不互質！'))
    }
    const Yong = big.mul(aRaw, Result) // 乘率對乘衍數得泛用
    const Print = aRaw + ' × ' + Result + ' = ' + Yong + ' ≡ ' + big.mod(Yong, bRaw) + ' (mod ' + bRaw + ')'
    const SmallNumer = (big.sub(Yong, 1).div(bRaw)).toNumber()
    return {
        Print,
        SmallNumer: SmallNumer.toString(),
        Result: Result.toString(),
        Yong: Yong.toString(),
    }
}
// console.log(CongruenceModulo('15590707936777559', '981657806570655017780651').Yong)