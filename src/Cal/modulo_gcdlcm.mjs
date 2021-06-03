import {
    big
} from './para_constant.mjs'

// 兩個數的gcd, lcm
export const GcdLcm = (a, b) => {
    a = big(a)
    b = big(b)
    let gcd = big.abs(a)
    let n = big.abs(b)
    let t = big(1)
    while (t.toNumber()) {
        t = big.mod(gcd, n)
        gcd = big(n)
        n = big(t)
    }
    let lcm = big.div(big.mul(a, b), gcd)
    gcd = gcd.toString()
    lcm = lcm.toString()
    return {
        gcd,
        lcm
    }
}
// console.log(GcdLcm(62244,7521150))
export const GcdLcmGroup = function () {
    let InputRaw = ((arguments[0]).split(/;|,|，|。|；|｜| /))
    if (InputRaw[InputRaw.length - 1] === '') { // 避免最後一個是符號
        InputRaw = InputRaw.slice(0, -1)
    }
    // for (let m = 1; m < InputRaw.length; m++) { // 處理成一個字符串傳給轉整數函數
    //     InputRaw[m] = InputRaw[m - 1] + ',' + InputRaw[m]
    // }
    // const Input = Deci2Int(InputRaw[InputRaw.length - 1]).Int
    // const Portion = Deci2Int(InputRaw[InputRaw.length - 1]).Portion
    let lcm = big(InputRaw[0])
    let gcd = big(InputRaw[0])
    for (let k = 0; k < InputRaw.length - 1; k++) {
        lcm = GcdLcm(lcm, big(InputRaw[k + 1])).lcm
        gcd = GcdLcm(gcd, big(InputRaw[k + 1])).gcd
    }
    // gcd = parseFloat((gcd / Portion).toPrecision(12))
    // lcm = parseFloat((lcm / Portion).toPrecision(12))
    // let Print = 'gcd(' + InputRaw[InputRaw.length - 1] + ') = ' + gcd + ', lcm(' + InputRaw[InputRaw.length - 1] + ') = ' + lcm
    let Print = `gcd(${InputRaw}) = ${gcd}\n lcm(${InputRaw}) = ${lcm}`
    if (big(gcd).eq(1)) {
        Print = `互質\nlcm(${InputRaw}) = ${lcm}`
    }
    return {
        lcm,
        gcd,
        Print
    }
}
// console.log(GcdLcmGroup('2.156,5.196,9.16,4.89162556').Print) // 這個超過精度範圍

// 分數最小公倍數。先通分，然后求分子的最小公倍数，再跟分母约分。
export const FracLcm1 = function () { // 不能改成箭頭函數
    let Input = ((arguments[0]).split(/;|,|，|。|；|｜| /))
    if (Input[Input.length - 1] === '') {
        Input = Input.slice(0, -1)
    }
    for (let j = 0; j < Input.length; j++) {
        Input[j] = parseInt(Input[j])
    }
    const i = Input.length
    const Numer = []
    const Denom = []
    for (let j = 0; j <= i / 2 - 1; j++) {
        Numer.push(Input[2 * j])
        Denom.push(Input[2 * j + 1])
    }
    let InputPrint = []
    for (let j = 0; j <= i / 2 - 1; j++) {
        InputPrint.push(Numer[j] + '/' + Denom[j])
    }
    let S = big(1)
    for (let k = 0; k < Denom.length; k++) {
        S = big.mul(S, Denom[k]).toString()
    }
    let NumerComm = []
    for (let k = 0; k < Denom.length; k++) {
        const Portion = big.div(S, Denom[k])
        NumerComm[k] = big.mul(Numer[k], Portion).toString()
    }
    let lcmNumer = NumerComm[0]
    for (let k = 0; k < Denom.length - 1; k++) {
        lcmNumer = GcdLcm(lcmNumer, NumerComm[k + 1]).lcm
    }
    // 結果化簡
    const gcdResult = GcdLcm(lcmNumer, S).gcd
    lcmNumer = big.div(lcmNumer, gcdResult).toString()
    S = big.div(S, gcdResult).toString()
    const lcmResult = big.div(lcmNumer, S).toString()
    const lcmFracPrint = 'lcm(' + InputPrint + ') = ' + big.floor(big.div(lcmNumer, S)) + (big.mod(lcmNumer, S).eq(0) ? '' : ' + ' + big.mod(lcmNumer, S) + ' / ' + S)
    return { lcmFracPrint, lcmResult }
}
// console.log(FracLcm1('6172608,16900,499067,16900,60,1').lcmFracPrint) // 開禧
// console.log(FracLcm1('13,145;114,7;14,57;9,13;8,10').lcmFracPrint) // 這個超過精度範圍
// console.log(FracLcm1('145166,2662;48255773,117653995;167015,90728715;17587515,2076107').lcmFracPrint)
// https://chaoli.club/index.php/2756/0

// 開發者一寫的無比繁瑣的最小公因數算法// highest common factor 輾轉相除法
// Hcf = function (aRaw, bRaw) { 
//     a = Math.max(aRaw, bRaw)
//     b = Math.min(aRaw, bRaw)
//     let Result = 0
//     let z = a / b
//     let Numer = a
//     let Denom = b
//     let tmp = b
//     let i = 0
//     if (z === Math.floor(z)) {
//         Result = b
//     } else {
//         const Divi = (Numer, Denom) => Math.max(Numer, Denom) % Math.min(Numer, Denom)
//         while (Divi(tmp, Numer) > 0) {
//             Denom = tmp
//             if (i === 0) {
//                 Denom = b
//             }
//             tmp = Numer
//             if (i === 0) {
//                 tmp = b
//             }
//             Numer = Divi(Numer, Denom)
//             i++
//         }
//         Result = Numer
//     }
//     return {
//         Result
//     }
// }