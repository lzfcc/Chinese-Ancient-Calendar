import Para from './para_calendars.mjs'
import { AutoMoonAvgV, AutoNodeCycle } from './para_auto-constant.mjs'
import { deci } from './para_constant.mjs'
import { Interpolate1, Interpolate2, Interpolate3 } from './equa_sn.mjs'

// /////乾象魏晉黃赤轉換//////
// const Equa2EclpTable1 = (LongiRaw, Sidereal) => {
//     let Longi = LongiRaw % (Sidereal / 4)
//     if ((LongiRaw > Sidereal / 4 && LongiRaw <= Sidereal / 2) || (LongiRaw >= Sidereal * 0.75 && LongiRaw < Sidereal)) {
//         Longi = Sidereal / 4 - Longi
//     }
//     let EclpLongi = 0
//     //  const Range = [0, 4, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 5 + Sidereal / 4 - Math.floor(Sidereal / 4), 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3] // 《中國古代曆法》57頁
//     const Range = [0, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 5 + Sidereal / 4 - Math.floor(Sidereal / 4), 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4] // 劉洪濤
//     let RangeAccum = Range.slice()
//     for (let i = 1; i <= 24; i++) {
//         RangeAccum[i] += RangeAccum[i - 1]
//     }
//     let LongiDifAccum = []
//     LongiDifAccum[0] = 0
//     for (let i = 1; i <= 12; i++) {
//         LongiDifAccum[i] = LongiDifAccum[i - 1] + 1 / 4
//     }
//     for (let i = 13; i <= 24; i++) {
//         LongiDifAccum[i] = LongiDifAccum[i - 1] - 1 / 4
//     }
//     let LongiOrder = 0
//     for (let j = 1; j <= 24; j++) {
//         if (RangeAccum[j] <= Longi && Longi < RangeAccum[j + 1]) {
//             LongiOrder = j
//         }
//     }
//     const Equa2EclpDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 線性內插
//     if ((LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)) {
//         EclpLongi = LongiRaw - Equa2EclpDif
//     } else {
//         EclpLongi = LongiRaw + Equa2EclpDif
//     }
//     return {
//         EclpLongi,
//         Equa2EclpDif
//     }
// }

export const Equa2EclpTable = (LongiRaw, Name) => {
    let { Type, Sidereal, Solar } = Para[Name]
    Sidereal = Sidereal || Solar
    const Sidereal50 = Sidereal / 2
    const Sidereal25 = Sidereal / 4
    const LongiHalf = LongiRaw % Sidereal50
    const Longi = Sidereal25 - Math.abs(LongiHalf - Sidereal25)
    let Equa2Eclp = 0
    let Range = []
    if (Type <= 4) {
        Range = [0, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 5 + deci(Sidereal / 4), 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4] // 劉洪濤
    } else if (['Huangji', 'LindeA', 'LindeB'].includes(Name)) {
        Range = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3.31, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] // 《中國古代曆法》57頁
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan', 'Xuanming', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1 + deci(Sidereal / 4), 5, 5, 5, 5, 5, 5, 5, 5, 5]
    }
    let LongiDifDifInitial = 0
    let LongiDifDifChange = 0
    if (['Huangji', 'LindeA', 'LindeB'].includes(Name)) { // 爲何皇極增速先慢後快，大衍先快後慢？
        LongiDifDifInitial = 97 / 450 // ⋯⋯四度爲限。初數九十七，每限增一，以終百七
        LongiDifDifChange = 1 / 450
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan', 'Xuanming'].includes(Name)) {
        LongiDifDifInitial = 12 / 24
        LongiDifDifChange = -1 / 24
    } else if (Name === 'Qintian') {
        LongiDifDifInitial = 40 / 72
        LongiDifDifChange = -5 / 72
    } else if (Name === 'Yingtian') {
        LongiDifDifInitial = 12 / 20.2
        LongiDifDifChange = -1.5 / 20.2
    } else if (Name === 'Qianyuan') {
        LongiDifDifInitial = 9 / 16.8
        LongiDifDifChange = -1 / 16.8
    } else if (Name === 'Yitian') {
        LongiDifDifInitial = 107 / 202
        LongiDifDifChange = -10 / 202
    }
    const length = Range.length - 2
    let RangeAccum = Range.slice()
    for (let i = 1; i <= length + 1; i++) {
        RangeAccum[i] += RangeAccum[i - 1]
    }
    let LongiDifDif = []
    LongiDifDif[1] = LongiDifDifInitial
    for (let i = 2; i <= length / 2; i++) {
        LongiDifDif[i] = LongiDifDif[i - 1] + LongiDifDifChange
    }
    LongiDifDif[length / 2 + 1] = 0
    LongiDifDif[length / 2 + 2] = LongiDifDif[length / 2]
    for (let i = length / 2 + 3; i <= length + 1; i++) {
        LongiDifDif[i] = LongiDifDif[i - 1] - LongiDifDifChange
    }
    let LongiDifAccum = []
    LongiDifAccum[0] = 0
    if (Type <= 4) {
        for (let i = 1; i <= 12; i++) {
            LongiDifAccum[i] = LongiDifAccum[i - 1] + 1 / 4
        }
        for (let i = 13; i <= 24; i++) {
            LongiDifAccum[i] = LongiDifAccum[i - 1] - 1 / 4
        }
    } else {
        for (let i = 1; i <= length / 2 + 1; i++) {
            LongiDifAccum[i] = LongiDifAccum[i - 1] + LongiDifDif[i]
            LongiDifAccum[i] = parseFloat((LongiDifAccum[i]).toPrecision(14))
        }
        for (let i = length / 2 + 2; i <= length + 1; i++) {
            LongiDifAccum[i] = LongiDifAccum[i - 1] - LongiDifDif[i]
            LongiDifAccum[i] = parseFloat((LongiDifAccum[i]).toPrecision(14))
        }
        LongiDifAccum[length + 1] = 0
    }
    let LongiOrder = 0
    for (let j = 1; j <= Range.length - 2; j++) {
        if (RangeAccum[j] <= Longi && Longi < RangeAccum[j + 1]) {
            LongiOrder = j
        }
    }
    let Equa2EclpDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 一次內插
    let sign1 = 1
    if ((LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)) {
        sign1 = -1
    }
    Equa2EclpDif *= sign1
    Equa2Eclp = LongiRaw + Equa2EclpDif
    return { Equa2Eclp, Equa2EclpDif }
}
// console.log(Equa2EclpTable(23, 'Yitian'))

export const Longi2LatiTable1 = (SolsDif, Name) => {
    const { Solar, NightList, DialList, SunLatiList } = Para[Name]
    let DawnRange = 0
    if (Name !== 'Daye') DawnRange = 2.5
    const HalfTermLeng = Solar / 24
    SolsDif %= Solar
    const TermNum = ~~(SolsDif / HalfTermLeng) // 每日所在氣名
    const TermDif = SolsDif - TermNum * HalfTermLeng
    const Rise = DawnRange + NightList[TermNum] + (TermDif / HalfTermLeng) * (NightList[TermNum + 1] - NightList[TermNum]) // 日出时刻=夜半漏+2.5刻
    const Dial = (DialList[TermNum] + (TermDif / HalfTermLeng) * (DialList[TermNum + 1] - DialList[TermNum]))
    const Lati1 = (SunLatiList[TermNum] + (TermDif / HalfTermLeng) * (SunLatiList[TermNum + 1] - SunLatiList[TermNum]))
    const Lati = Solar / 4 - Lati1
    return { Rise, Dial, Lati1, Lati }
}

export const Longi2LatiTable2 = (SolsDif, Name) => {
    const { Type, Denom, Solar, Sidereal, NightList, DialList, SunLatiList, AcrTermList, TermRangeA, TermRangeS
    } = Para[Name]
    SolsDif %= Solar
    let DawnRange = 2.5
    if (Name === 'Huangji') DawnRange = 2.365
    else if (['LindeA', 'LindeB', 'Daming3'].includes(Name)) DawnRange = 0
    const f = 34.475 // 大衍地理緯度
    const HalfTermLeng = Solar / 24
    let Dial = 0
    let Lati = 0
    let Lati1 = 0
    let Rise = 0
    let Sunrise1 = 0
    if (Type === 7 || ['Yingtian', 'Qianyuan'].includes(Name)) { // 應天與宣明去極度之差不超過0.03度——《中國古代曆法》頁46
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (SolsDif >= AcrTermList[j] && SolsDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        //////定氣/////
        const TermAcrNoonDeciDif = [] // 中前後分。「冬至後，中前以差減，中後以差加⋯⋯冬至一日有減無加，夏至一日有加無減。」
        for (let i = 0; i <= 23; i++) {
            const TermAcrRaw = AcrTermList[i]
            const TermAcrDeci = deci(TermAcrRaw)
            TermAcrNoonDeciDif[i] = TermAcrDeci - 0.5 // 定氣與正午的距離
        }
        const t1 = AcrTermList[TermNum] - TermAcrNoonDeciDif[TermNum]
        const t2 = AcrTermList[TermNum + 1] - TermAcrNoonDeciDif[TermNum]
        const t3 = AcrTermList[TermNum + 2] - TermAcrNoonDeciDif[TermNum]
        Rise = DawnRange + Interpolate3(SolsDif, [[t1, NightList[TermNum]], [t2, NightList[TermNum + 1]], [t3, NightList[TermNum + 2]]])
        Sunrise1 = DawnRange + NightList[TermNum] + ((SolsDif - AcrTermList[TermNum]) / (AcrTermList[TermNum + 1] - AcrTermList[TermNum])) * (NightList[TermNum + 1] - NightList[TermNum])
        Lati1 = Interpolate3(SolsDif, [[t1, SunLatiList[TermNum]], [t2, SunLatiList[TermNum + 1]], [t3, SunLatiList[TermNum + 2]]])
        Lati = 91.31 - Lati1
    } else {
        ////////////平氣////////////
        const TermNum = ~~(SolsDif / HalfTermLeng)
        const TermDif = SolsDif - TermNum * HalfTermLeng
        let TermRange = 0
        if (Type === 6) {// 麟德   
            if ((SolsDif < 6 * HalfTermLeng) || (SolsDif >= 18 * HalfTermLeng)) {
                TermRange = TermRangeA // 秋分後
            } else {
                TermRange = TermRangeS // 春分後
            }
        } else TermRange = HalfTermLeng
        const TermAvgNoonDeciDif = []
        for (let i = 0; i <= 23; i++) {
            const TermAvgRaw = i * HalfTermLeng
            const TermAvgDeci = deci(TermAvgRaw) // 各平氣小數點
            TermAvgNoonDeciDif[i] = TermAvgDeci - 0.5 // 平氣與正午的距離
        }
        const nAvg = 1 + (TermDif + TermAvgNoonDeciDif[TermNum]) / TermRange
        if (Type === 10) { // 重修大明的日出分是三次內插
            Rise = 100 * (Interpolate1(nAvg, [NightList[TermNum], NightList[TermNum + 1], NightList[TermNum + 2], NightList[TermNum + 3]]) / Denom)
            Sunrise1 = 100 * (NightList[TermNum] + (TermDif / HalfTermLeng) * (NightList[TermNum + 1] - NightList[TermNum])) / Denom
        } else {
            Rise = DawnRange + Interpolate1(nAvg, [NightList[TermNum], NightList[TermNum + 1], NightList[TermNum + 2]])
            Sunrise1 = DawnRange + NightList[TermNum] + (TermDif / HalfTermLeng) * (NightList[TermNum + 1] - NightList[TermNum])
        }
        if (Type === 6) {
            Dial = Interpolate1(nAvg, [DialList[TermNum], DialList[TermNum + 1], DialList[TermNum + 2]])
        }
        if (Type === 10) {
            Lati = -(Rise - 25) / (10896 / 52300)
            Lati1 = Sidereal / 4 - Lati
        } else {
            Lati1 = Interpolate1(nAvg, [SunLatiList[TermNum], SunLatiList[TermNum + 1], SunLatiList[TermNum + 2]])
            Lati = 91.31 - Lati1 // 赤緯
        }
        // 紀志剛《麟德曆晷影計算方法研究》，《自然科學史研究》1994(4)                         
        /////////預處理晷長///////////
        // let DialChangeList = [] // 陟降率
        // DialChangeList[0] = 0
        // for (let i = 1; i <= 24; i++) {
        //     DialChangeList[i] = parseFloat((DialList[i + 1] - DialList[i]).toPrecision(12))
        // }
        // DialChangeList[25] = DialChangeList[1]
        // delta1 = ((DialChangeList[TermNum] + DialChangeList[TermNum + 1]) / 2) / TermRange // 泛末率
        // delta2 = (DialChangeList[TermNum] - DialChangeList[TermNum + 1]) / TermRange // 總差
        // if (TermNum % 12 === 0) { // 芒種、大雪
        //     delta2 = ((DialChangeList[TermNum - 1] - DialChangeList[TermNum]) / TermRange)
        //     delta1 = ((DialChangeList[TermNum - 1] + DialChangeList[TermNum]) / 2) / TermRange - delta2
        // }
        // const delta3 = delta1 + delta2 // 泛初率
        // const delta4 = (delta2 / TermRange) / 2 // 限差。不/2是別差
        // const Corr = delta3 + delta4 // 定差
        // const TermAcrDial = DialList[TermNum] - (TermAvgDeci[TermNumRaw] - 0.5) * Corr // 恆氣日中定影
        // Dial = (TermAcrDial + (TermDifInt * delta1 + TermDifInt * delta2 - (TermDifInt ** 2) * delta4)).toFixed(4) // 劉焯二次內插公式              
    }
    // 唐系、應天、乾元。本來寫了個去極度差分表，太麻煩，還不如直接用招差
    if (Type > 6) {
        const SunLati2 = Lati1 - (91.3 - f) // 天頂距
        // 下爲大衍晷影差分表
        if (SunLati2 <= 27) {
            Dial = Interpolate2(SunLati2 - 1, 1379, [1380, 2, 1])
        } else if (SunLati2 <= 42) {
            Dial = Interpolate2(SunLati2 - 28, 42267, [1788, 32, 2])
        } else if (SunLati2 <= 46) {
            Dial = Interpolate2(SunLati2 - 43, 73361, [2490, 74, 6])
        } else if (SunLati2 <= 50) {
            Dial = Interpolate2(SunLati2 - 47, 83581, [3212, -118, 272])
        } else if (SunLati2 <= 57) {
            Dial = Interpolate2(SunLati2 - 51, 96539, [3562, 165, 7])
        } else if (SunLati2 <= 61) {
            Dial = Interpolate2(SunLati2 - 58, 125195, [4900, 250, 19])
        } else if (SunLati2 <= 67) {
            Dial = Interpolate2(SunLati2 - 60, 146371, [6155, 481, 33])
        } else if (SunLati2 <= 72) {
            Dial = Interpolate2(SunLati2 - 68, 191179, [9545, 688, 36])
        } else {
            Dial = Interpolate2(SunLati2 - 73, 246147, [13354, 1098, 440, 620, 180])
        }
        Dial /= 10000
    }
    // 夜半漏計算直接用招差術了，不勝其煩。
    return { Lati, Lati1, Dial, Rise, Sunrise1 }
}
// console.log(Longi2LatiTable2(90, 'LindeB').Sunrise1) // 《麟德曆晷影計算方法硏究》頁323：第15日應比12.28稍長。我現在算出來沒問題。

// 《中》頁513:平交加上不均勻改正後是正交，求得正交黃道度，再求月道度。
const MoonLongiTable = (SolsDif, NodeAccumRaw, Name) => { ///////赤白轉換//////
    const { Solar } = Para[Name]
    let { Sidereal } = Para[Name]
    const Quadrant = AutoNodeCycle(Name) / 4
    const NodeAccum = NodeAccumRaw// % (Node / 2)
    // 求交點：1、確定平交入朔、平交入轉，2、根據月亮改正計算月亮運動到升交點的時間，卽正交日辰，3、求正交加時黃道宿度，卽交點黃經
    const LongiRaw = AutoMoonAvgV(Name) * NodeAccum // 以月平行度乘之
    let Longi = LongiRaw % Quadrant
    if ((LongiRaw >= Quadrant && LongiRaw < Quadrant * 2) || (LongiRaw >= Quadrant * 3)) { // (LongiRaw >= Quadrant)
        Longi = Quadrant - Longi
    }
    Sidereal = Sidereal || Solar
    SolsDif -= NodeAccum
    const SolsDifHalf = SolsDif % (Solar / 2)
    const EclpLongi = (SolsDif + LongiRaw) % Sidereal
    let WhiteLongi = 0
    let Range = []
    if (Name === 'Huangji') { // 麟德沒有
        Range = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2.94, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] // 《中國古代曆法》頁60
    } else if (['Dayan', 'Xuanming', 'Qintian', 'Yingtian'].includes(Name)) {
        Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0.94, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    }
    let LongiDifDifInitial = 0
    let LongiDifDifChange = 0
    let EclpWhiteDif = 0
    const Smallquadrant = 5.07 // Solar / 72// 欽天8節72限
    if (Name === 'Huangji') {
        LongiDifDifInitial = 11 / 45 // ⋯⋯四度爲限，初十一，每限損一，以終於一
        LongiDifDifChange = -1 / 45
    } else if (['Dayan', 'Xuanming'].includes(Name)) {
        LongiDifDifInitial = 12 / 24
        LongiDifDifChange = -1 / 24
    } else if (Name === 'Qintian') {
        LongiDifDifInitial = 40 / 72
        LongiDifDifChange = -5 / 72
    } else if (Name === 'Yingtian') {
        LongiDifDifInitial = 12 / 20.2
        LongiDifDifChange = -1.5 / 20.2
    }
    const length = Range.length - 2
    let RangeAccum = Range.slice()
    for (let i = 1; i <= length + 1; i++) {
        RangeAccum[i] += RangeAccum[i - 1]
    }
    let LongiDifDif = []
    LongiDifDif[1] = LongiDifDifInitial
    for (let i = 2; i <= length / 2; i++) {
        LongiDifDif[i] = LongiDifDif[i - 1] + LongiDifDifChange
    }
    LongiDifDif[length / 2 + 1] = 0
    LongiDifDif[length / 2 + 2] = LongiDifDif[length / 2]
    for (let i = length / 2 + 3; i <= length + 1; i++) {
        LongiDifDif[i] = LongiDifDif[i - 1] - LongiDifDifChange
    }
    let LongiDifAccum = []
    LongiDifAccum[0] = 0
    for (let i = 1; i <= length / 2 + 1; i++) {
        LongiDifAccum[i] = LongiDifAccum[i - 1] + LongiDifDif[i]
        LongiDifAccum[i] = parseFloat((LongiDifAccum[i]).toPrecision(14))
    }
    for (let i = length / 2 + 2; i <= length + 1; i++) {
        LongiDifAccum[i] = LongiDifAccum[i - 1] - LongiDifDif[i]
        LongiDifAccum[i] = parseFloat((LongiDifAccum[i]).toPrecision(14))
    }
    LongiDifAccum[length + 1] = 0
    let LongiOrder = 0
    for (let j = 1; j <= Range.length - 2; j++) {
        if (RangeAccum[j] <= Longi && Longi < RangeAccum[j + 1]) {
            LongiOrder = j
        }
    }
    EclpWhiteDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 一次內插
    if (Name !== 'Huangji') EclpWhiteDif /= 2
    let EquaWhiteDif = 0
    if (['Dayan', 'Xuanming'].includes(Name)) {
        EquaWhiteDif = SolsDifHalf / (Solar / 72) / 18
    } else if (Name === 'Qintian') {
        const OriginXian = Math.abs(SolsDifHalf - Solar / 4) / Smallquadrant // 限數
        // EclpWhiteDif = (Longi - RangeAccum[LongiOrder]) * (Smallquadrant / 2) * OriginXian / 1296 // 這個用公式來算黃白差，沒寫對
        EquaWhiteDif = (Longi - RangeAccum[LongiOrder]) * (Smallquadrant / 8) * (1 - OriginXian / 324)
    } else if (Name === 'Yingtian') {
        const Hou = ~~(SolsDifHalf / (Solar / 72)) / 18
        EquaWhiteDif = (Longi - RangeAccum[LongiOrder]) * (0.5 - 5 * Hou / 3636)
    }
    let EquaLongi = 0
    // 大衍：（黃白差）距半交前後各九限，以差數爲減；距正交前後各九限，以差數爲加
    // if (LongiRaw >= Quadrant && LongiRaw < Quadrant * 3) {}
    const sign = (LongiRaw >= Quadrant && LongiRaw < 2 * Quadrant) || (LongiRaw >= 3 * Quadrant) ? -1 : 1
    EclpWhiteDif *= sign
    EquaWhiteDif *= sign
    WhiteLongi = EclpLongi + EclpWhiteDif
    EquaLongi = EquaWhiteDif ? WhiteLongi + EquaWhiteDif : 0
    return { EclpLongi, WhiteLongi, EquaLongi, EclpWhiteDif, EquaWhiteDif }
}
// console.log(MoonLongiTable(55.25, 11.22, 'Qianxiang').EclpLongi)
// console.log(MoonLongiTable(45, 3, 'Qintian'))

export const MoonLatiTable = (NodeAccum, Name) => {
    const { Type, Node, MoonLatiAccumList } = Para[Name]
    let { MoonLatiDifList } = Para[Name]
    ///////預處理陰陽曆////////
    let Portion = 10
    if (Type <= 4) Portion = 12
    else if (Name === 'Dayan') Portion = 120
    else if (Name === 'Wuji') Portion = 50 / 3 // 五紀正元找不到比例，瞎填
    else if (Name === 'Tsrengyuan') Portion = 219 / 4
    const NodeAccumHalf = NodeAccum % (Node / 2)
    const NodeAccumHalfInt = ~~NodeAccumHalf
    const Yinyang = NodeAccum > Node / 2 ? 1 : -1
    let Lati = 0
    if (Type < 6) {
        Lati = Yinyang * (MoonLatiAccumList[NodeAccumHalfInt] + (NodeAccumHalf - NodeAccumHalfInt) * MoonLatiDifList[NodeAccumHalfInt] / Portion)
    } else if (Type === 6 || ['Wuji', 'Tsrengyuan'].includes(Name)) { // 二次
        let Initial = [MoonLatiAccumList[NodeAccumHalfInt], MoonLatiAccumList[NodeAccumHalfInt + 1], MoonLatiAccumList[NodeAccumHalfInt + 2]]
        let n = 1 + NodeAccumHalf - NodeAccumHalfInt
        if (NodeAccumHalf >= 12) {
            Initial = [MoonLatiAccumList[NodeAccumHalfInt - 2], MoonLatiAccumList[NodeAccumHalfInt - 1], MoonLatiAccumList[NodeAccumHalfInt]]
            n = 3 + NodeAccumHalf - NodeAccumHalfInt
        }
        Lati = Yinyang * Interpolate1(n, Initial) / Portion
    } else if (Name === 'Dayan') { // 大衍的入交度數另有算式，我直接用月平行速來算 // 三次差：前半段 Δ = 171,-24,-8 後半段 Δ = -75,-40,8// 曲安京《曆法》頁251
        const MoonAvgDV = AutoMoonAvgV(Name)
        const LongiRaw = NodeAccumHalf * MoonAvgDV
        const Cycle = AutoNodeCycle(Name)
        const l = 15 // Cycle / 24 // 一象限15度
        const Longi = LongiRaw * 360 / Cycle
        const k = ~~(Longi / l) // 本爻
        const Frac = Longi - k * l
        // const D1 = MoonLatiDifList[k + 1] - MoonLatiDifList[k] // 前差
        // const D2 = MoonLatiDifList[k + 2] - MoonLatiDifList[k + 1] // 後差
        // const Dif1 = D2 - D1 // 中差
        let End = (3 * MoonLatiDifList[k] + MoonLatiDifList[k + 2]) / (4 * l) // 本爻末率、後爻初率
        let Start = (3 * MoonLatiDifList[k - 1] + MoonLatiDifList[k + 1]) / (4 * l) // 本爻初率
        if (!Start) { // 其四象初爻無初率，上爻無末率，皆倍本爻加減率，十五而一。所得，各以初、末率減之，皆互得其率
            // 但問題是，即便如此，上爻依然不行，因為沒有MoonLatiDifList[11 + 1]，我暫且只好補一個上去
            Start = MoonLatiDifList[k] * 2 / l - End
        } else if (!End) {
            End = MoonLatiDifList[k] * 2 / l - Start
        }
        const D = (Longi < 90 ? -1 : 1) * Math.abs((End - Start) / l) // 度差
        const G1 = Start + D / 2 // 定初率。「以加減初率（少象減之，老象加之）」
        const Gn = G1 + (Frac - 1) * D // 「以度差累加減之（少象以差減，老象以差加）」
        const G = (G1 + Gn) * Frac / 2
        Lati = Yinyang * (MoonLatiAccumList[k] + G) / Portion
    }
    const Lati1 = 91.31 - Lati
    return { Lati, Lati1 }
}
// 大衍：《中國古代曆法》頁530
// console.log(MoonLatiTable(10, 'Dayan'))