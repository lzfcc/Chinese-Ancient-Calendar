// 《李銳、顧觀光調日法工作述評》，《自然科學史研究》1987(2)
import {
    GcdLcm
} from './modulo_gcdlcm.mjs'
import {
    CongruenceModulo,
} from './modulo_qiuyi.mjs'

export const DecomposePrimeFactor = (a, b, BigNumer, BigDenom) => { // 「累強弱之數」：日法朔餘都要有。有些宋曆算不出來，不知道是不是我寫的有問題。
    const Small = CongruenceModulo(BigNumer, BigDenom) // 此三行已知強率，以大衍求一術求弱率
    const SmallNumer = +(Small.SmallNumer)
    const SmallDenom = +(Small.Result)
    const SmallPrint = '弱率 ' + SmallNumer + '/' + SmallDenom + ' ≒ ' + parseFloat((SmallNumer / SmallDenom).toPrecision(12))
    a = +a
    b = +b
    BigNumer = +BigNumer
    BigDenom = +BigDenom
    if (a / b > BigNumer / BigDenom) {
        throw new Error('大於彊率，無法求解！')
    } else if (a / b < SmallNumer / SmallDenom && a / b > 0) {
        throw new Error('小於弱率，無法求解！')
    }
    if (~~a !== a) { //這行是處理小數。輸入的一般都是整數，萬一有小數，一位*10，兩位*100
        a *= 10
        b *= 10
        if (~~a !== a) {
            a *= 10
            b *= 10
        }
    }
    const gcd = GcdLcm(a, b).gcd // 求最大公因數
    ////////李銳「有日法求強弱」：只需要日法卽可。但是弱數要<強母，否則解不出來，這也是因爲如果大於強母，則日法積分太多。李繼閔《再評清代學者的調日法研究》
    const K = CongruenceModulo(SmallDenom, BigDenom)
    const J1 = +(K.Result) * SmallDenom
    const N1 = SmallDenom * BigDenom
    const tmp1 = ((b % BigDenom) * J1) % N1
    const M2_2 = tmp1 / SmallDenom
    const M1_2 = (b - tmp1) / BigDenom
    const a1_2 = BigNumer * M1_2 + SmallNumer * M2_2
    const b1_2 = BigDenom * M1_2 + SmallDenom * M2_2
    const Result2Title = '李銳有日法求彊弱'
    const Result2a = a1_2 + ' = ' + BigNumer + '×' + M1_2 + ' + ' + SmallNumer + '×' + M2_2
    const Result2b = b1_2 + ' = ' + BigDenom + '×' + M1_2 + ' + ' + SmallDenom + '×' + M2_2
    const Result2c = parseFloat((a1_2 / b1_2).toPrecision(12))
    const Result = []
    ////////陳久金調日法公式（《調日法研究》）顧觀光用輾轉相減，化簡後就是陳久金公式 
    const M1_3 = a * SmallDenom - b * SmallNumer
    const M2_3 = b * BigNumer - a * BigDenom
    const a1_3 = BigNumer * M1_3 + SmallNumer * M2_3
    const b1_3 = BigDenom * M1_3 + SmallDenom * M2_3
    const Result3Title = '顧觀光-陳久金'
    const Result3a = a1_3 + ' = ' + BigNumer + '×' + M1_3 + ' + ' + SmallNumer + '×' + M2_3
    const Result3b = b1_3 + ' = ' + BigDenom + '×' + M1_3 + ' + ' + SmallDenom + '×' + M2_3
    const Result3c = parseFloat((a1_3 / b1_3).toPrecision(12))
    ///////////李銳：累強弱之數
    // | 弱母      強母 |  a朔餘，b日法，BigNumer彊子，BigDenom彊母，SmallNumer弱子，SmallDenom弱母
    // | 弱子      強子 |
    // |  0       強率 |
    // | 弱率       0  |
    let R1 = 1, R2 = 0, L1 = 0, L2 = 1
    let M1_1 = R1 + L1
    let M2_1 = R2 + L2
    let a1_1 = 0
    let b1_1 = 0
    let Node = []
    let i = 0
    if (gcd !== 1) {
        a /= gcd
        b /= gcd
    }
    const Deci = (M1_1, M2_1) => (BigNumer * M1_1 + SmallNumer * M2_1) / (BigDenom * M1_1 + SmallDenom * M2_1)
    while (b1_1 < b) {
        if (Deci(M1_1, M2_1) < parseFloat((a / b).toPrecision(14))) { // 棄左行
            L1 = M1_1
            L2 = M2_1
        } else { // 棄右行
            R1 = M1_1
            R2 = M2_1
        }
        M1_1 = L1 + R1
        M2_1 = L2 + R2 // L M 順序一定不能反！！！
        a1_1 = BigNumer * M1_1 + SmallNumer * M2_1
        b1_1 = BigDenom * M1_1 + SmallDenom * M2_1
        i++
        Node += '(' + i + ') ' + a1_1 + '/' + b1_1 + `\n`
    }
    const Result1Title = '李銳累彊弱數'
    const Result1a = a1_1 + ' = ' + BigNumer + '×' + M1_1 + ' + ' + SmallNumer + '×' + M2_1
    const Result1b = b1_1 + ' = ' + BigDenom + '×' + M1_1 + ' + ' + SmallDenom + '×' + M2_1
    const Result1c = parseFloat((a1_1 / b1_1).toPrecision(12))
    const Foot = '最大公因數：' + gcd + `。累彊弱法各漸進分數：\n` + Node
    Result.push({
        title: Result2Title,
        data: [Result2a, Result2b, Result2c]
    })
    Result.push({
        title: Result3Title,
        data: [Result3a, Result3b, Result3c]
    })
    Result.push({
        title: Result1Title,
        data: [Result1a, Result1b, Result1c]
    })
    return { SmallPrint, Result, Foot }
}