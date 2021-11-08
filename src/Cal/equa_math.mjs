import { GcdLcm } from './modulo_gcdlcm.mjs'
import { big } from './para_constant.mjs'

export const isSame = (arr1, arr2) => { // 判斷元數定母是否想等 @lzfcc 时间复杂度2*O(nlog(n)) + O(n) = O(nlog(n))
    if (arr1.length !== arr2.length) {
        return false
    }
    arr1.sort((a, b) => a - b)
    arr2.sort((a, b) => a - b)
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false
    }
    return true
}
// console.log(isSame([9, 4, 4, 2, 7, 5], [3, 6, 5, 7, 1]))
// console.log(isSame([111, 400, 23], [3, 6, 5, 7, 1]))

/**
 * 1、fraction庫不能處理帶小數點的分數，所以要自己寫一個 2、獲得分數的分母、分子 3、把輸入的分數字符串轉成假分數
 * @param FracRaw 
 * @returns 
 */
export const Frac2FalseFrac = FracRaw => {
    FracRaw = FracRaw.toString()
    const Frac = FracRaw.split(/ |\+|\//)
    let Numer = 0, NumerSub = 0, Denom = 0
    if (Frac.length === 3) {
        // Numer = +Frac[0] * +Frac[2] + +Frac[1]
        // NumerSub = +(Frac[0] - 1) * +Frac[2] + +Frac[1] // 干支數-1
        // Denom = +Frac[2]
        Denom = Frac[2]
        Numer = big(Frac[0]).mul(Denom).add(Frac[1])
        NumerSub = big.sub(Frac[0], 1).mul(Denom).add(Frac[1]) // 干支數-1        
    } else if (Frac.length === 2) {
        Numer = Frac[0]
        Denom = Frac[1]
    } else {
        Numer = Frac[0]
        Denom = 1
    }
    const Deci = big.div(Numer, Denom).toNumber()
    const FalseFrac = Numer.toString() + '/' + Denom.toString()
    return { Numer, NumerSub, Denom, Deci, FalseFrac }
}
// console.log(Frac2FalseFrac('2 3.2/2'))
// console.log(Frac2FalseFrac('34+3/4'))

// const sg = a => frc(a).toFraction(false)
// console.log(sg('1 2.1/3')) 

export const BigFrc = (a, b) => { // 大分數計算。現在只能算乘法
    a = Frac2FalseFrac(a).FalseFrac
    const an = big(a.split('/')[0])
    const ad = big(a.split('/')[1])
    const bn = big(b.split('/')[0])
    const bd = big(b.split('/')[1])
    let n = an.mul(bn)
    let d = ad.mul(bd)
    // 約分
    const gcd = GcdLcm(n, d).gcd
    n = n.div(gcd)
    d = d.div(gcd)
    const Deci = n.div(d).toNumber()
    // 眞分數
    const int = n.div(d).floor()
    n = n.sub(d.mul(int)).toString()
    const Frac = int.toString() + ' ' + n + '/' + d.toString()
    return { Frac, Deci }
}
// console.log(BigFrc('5/4', '3/2'))
// console.log(BigFrc('1 14002745558097800342739/360287997426667018963968', '3/2'))

const Deci2Int_1 = function () { // 輸入字符串
    const Raw = arguments[0].split(/;|,|，|。|；|｜| /)
    let Portion = 1
    let Int = []
    for (let j = 0; j < Raw.length; j++) {
        Int[j] = +Raw[j]
        let i = 0
        while (i < 11) {
            if (parseFloat((Int[j] * 10 ** i).toPrecision(12)) === Math.floor(Int[j] * 10 ** i)) {
                Portion = Math.max(10 ** i, Portion)
                break
            }
            i++
        }
    }
    if (Portion !== 1) {
        for (let j = 0; j < Int.length; j++) {
            Int[j] = parseFloat((Int[j] * Portion).toPrecision(12))
        }
    }
    return { Int, Portion }
}
// console.log(Deci2Int_1('1.1,2.23,3.4,5.555').Int)

const Deci2Int_2 = str => { // @lzfcc
    const Raw = str.split(/[^0-9.+-]/).filter(Boolean)
    // 先按照所有非数字和小数点正负号的字符分开（结果会出现空字符串），再把空字符串过滤出去
    let prec = 0
    let Portion = 1
    const Int = []
    for (let i = 0; i < Raw.length; i++) {
        Int[i] = +Raw[i] // 这步是可能产生 NaN 的，后面考虑处理（比如 fallback 成 0）
        const dotIndex = Raw[i].indexOf('.') // -1 means not found
        if (dotIndex >= 0) {
            prec = Math.max(Raw[i].length - 1 - dotIndex, prec)
        }
    }
    if (prec) {
        Portion = 10 ** prec
        for (let i = 0; i < Int.length; i++) {
            Int[i] *= Portion
        }
    }
    return { Int, Portion }
}
// console.log(Deci2Int_2('1.1, 2 1/2,2.23,3.4,5.555').Int)

export const Deci2Int = str => {
    const Raw = str.split(/[^0-9.+-]/).filter(Boolean)
    const prec = [], Int = []
    for (let i = 0; i < Raw.length; i++) {
        prec[i] = (Raw[i].split('.')[1] || '').length
    }
    const Portion = 10 ** Math.max(...prec)
    for (let i = 0; i < Raw.length; i++) {
        Int[i] = +Raw[i] * Portion
    }
    return { Int, Portion }
}
// console.log(Deci2Int('1.1, 2.23,3.4,5.5515').Int)

const DeciFrac2IntFrac_1 = Deci => { // 把有小數點的分數轉換為整數分數
    const Raw = Deci.split('/')
    let n = Raw[0]
    let d = Raw[1]
    const L = Math.max((n.split('.')[1] || '').length, (d.split('.')[1] || '').length)
    n = Math.round(+n * 10 ** L)
    d = Math.round(+d * 10 ** L)
    return n + '/' + d
}
// console.log(DeciFrac2IntFrac('2553.026/12030'))

export const DeciFrac2IntFrac = Deci => { // @lzfcc 把有小數點的分數轉換為整數分數
    const { Int } = Deci2Int(Deci)
    return Int[0] + '/' + Int[1]
}
// console.log(DeciFrac2IntFrac('2553026/1203'))

// 把一個數字按照幾位分割 @lzfcc 写的好像没问题，但是返回值有点迷。返回一个 a，一个 cString 是什么鬼呢？不应该是 a 和 b 吗？至于合并在一起的 c，调用者自己去合就好了啊。代码好像有点繁琐，不过正确就好。
export const SliceNum = (Input, num = 3) => { // a：小數點前，b：小數點後，c：并之
    Input = Input.toString()
    Input = Input.split('.')
    num = parseInt(num)
    let Front = Input[0]
    let Suffix = []
    if (Input.length > 1) {
        Suffix = Input[1]
    }
    const a = []
    let aString = []
    const len1 = Front.length
    const len2 = Suffix.length
    for (let i = 0; i < len1 / num; i++) {
        aString[i] = Front.slice(-num)
        Front = Front.slice(0, -num)
    }
    aString = aString.reverse()
    for (let i = 0; i < aString.length; i++) {
        a[i] = parseInt(aString[i])
    }
    const b = []
    let bString = []
    for (let i = 0; i < len2 / num; i++) {
        bString[i] = Suffix.slice(0, num)
        Suffix = Suffix.slice(num)
    }
    for (let i = 0; i < bString.length; i++) {
        b[i] = parseInt(bString[i])
    }
    const cString = aString.concat(bString)
    return { a, cString }
}
// console.log(SliceNum('123456789.876543', 4).cString)
