import { AutoMoonAvgV } from './astronomy_acrv.mjs'
import {
    Bind,
} from './bind.mjs'
import {
    Interpolate1,
    Interpolate2,
    Interpolate3
} from './equa_sn.mjs'

// /////乾象魏晉黃赤轉換//////
// const Equator2EclipticTable1 = (LongiRaw, Sidereal) => {
//     let Longi = LongiRaw % (Sidereal / 4)
//     if ((LongiRaw > Sidereal / 4 && LongiRaw <= Sidereal / 2) || (LongiRaw >= Sidereal * 0.75 && LongiRaw < Sidereal)) {
//         Longi = Sidereal / 4 - Longi
//     }
//     let EclipticLongi = 0
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
//     const Equator2EclipticDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 線性內插
//     if ((LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)) {
//         EclipticLongi = LongiRaw - Equator2EclipticDif
//     } else {
//         EclipticLongi = LongiRaw + Equator2EclipticDif
//     }
//     return {
//         EclipticLongi,
//         Equator2EclipticDif
//     }
// }

export const Equator2EclipticTable = (LongiRaw, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    let {
        Sidereal,
        Solar
    } = AutoPara[CalName]
    if (!Sidereal) {
        Sidereal = Solar
    }
    let Longi = LongiRaw % (Sidereal / 4)
    if ((LongiRaw > Sidereal / 4 && LongiRaw <= Sidereal / 2) || (LongiRaw >= Sidereal * 0.75 && LongiRaw < Sidereal)) {
        Longi = Sidereal / 4 - Longi
    }
    let Equator2Ecliptic = 0
    let Range = []
    if (Type <= 4) {
        Range = [0, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 5 + Sidereal / 4 - ~~(Sidereal / 4), 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4] // 劉洪濤
    } else if (['Huangji', 'Linde'].includes(CalName)) {
        Range = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3.31, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] // 《中國古代曆法》57頁
    } else if (['Dayan', 'Zhide', 'Zhengyuan', 'Wuji', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1 + Sidereal / 4 - ~~(Sidereal / 4), 5, 5, 5, 5, 5, 5, 5, 5, 5]
    }
    let LongiDifDifInitial = 0
    let LongiDifDifChange = 0
    if (['Huangji', 'Linde'].includes(CalName)) { // 爲何皇極增速先慢後快，大衍先快後慢？
        LongiDifDifInitial = 97 / 450 // ⋯⋯四度爲限。初數九十七，每限增一，以終百七
        LongiDifDifChange = 1 / 450
    } else if (['Dayan', 'Zhide', 'Zhengyuan', 'Wuji'].includes(CalName)) {
        LongiDifDifInitial = 12 / 24
        LongiDifDifChange = -1 / 24
    } else if (CalName === 'Qintian') {
        LongiDifDifInitial = 40 / 72
        LongiDifDifChange = -5 / 72
    } else if (CalName === 'Yingtian') {
        LongiDifDifInitial = 12 / 20.2
        LongiDifDifChange = -1.5 / 20.2
    } else if (CalName === 'Qianyuan') {
        LongiDifDifInitial = 9 / 16.8
        LongiDifDifChange = -1 / 16.8
    } else if (CalName === 'Yitian') {
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
    let Equator2EclipticDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 一次內插
    let sign1 = 1
    if ((LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)) {
        sign1 = -1
    }
    Equator2EclipticDif *= sign1
    Equator2Ecliptic = LongiRaw + Equator2EclipticDif
    return {
        Equator2Ecliptic,
        Equator2EclipticDif
    }
}
// console.log(Equator2EclipticTable(23,''))

export const Longi2LatiTable1 = (WinsolsDifRaw, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        Solar,
        NightList,
        DialList,
        SunLatiList,
    } = AutoPara[CalName]
    let DawnRange = 0
    if (CalName !== 'Daye') {
        DawnRange = 2.5
    }
    const HalfTermLeng = Solar / 24
    const WinsolsDif = WinsolsDifRaw % Solar
    const TermNum = ~~(WinsolsDif / HalfTermLeng) // 每日所在氣名
    const TermDif = WinsolsDif - TermNum * HalfTermLeng
    const Sunrise = DawnRange + NightList[TermNum] + (TermDif / HalfTermLeng) * (NightList[TermNum + 1] - NightList[TermNum]) // 日出时刻=夜半漏+2.5刻
    const Dial = (DialList[TermNum] + (TermDif / HalfTermLeng) * (DialList[TermNum + 1] - DialList[TermNum]))
    const Lati1 = (SunLatiList[TermNum] + (TermDif / HalfTermLeng) * (SunLatiList[TermNum + 1] - SunLatiList[TermNum]))
    const Lati = Solar / 4 - Lati1
    return {
        Sunrise,
        Dial,
        Lati1,
        Lati
    }
}

export const Longi2LatiTable2 = (WinsolsDifRaw, CalName) => {
    const {
        Type,
        AutoPara,
    } = Bind(CalName)
    const {
        Solar,
        Sidereal,
        NightList,
        DialList,
        SunLatiList,
        AcrTermList,
        TermRangeA,
        TermRangeS
    } = AutoPara[CalName]
    const WinsolsDif = WinsolsDifRaw % Solar
    let DawnRange = 2.5
    if (['Linde', 'NewDaming'].includes(CalName)) {
        DawnRange = 0
    }
    const f = 34.475 // 大衍地理緯度
    const HalfTermLeng = Solar / 24
    let Dial = 0
    let Lati = 0
    let Lati1 = 0
    let Sunrise = 0
    if (Type === 7 || ['Yingtian', 'Qianyuan'].includes(CalName)) { // 應天與宣明去極度之差不超過0.03度——《中國古代曆法》頁46
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (WinsolsDif >= AcrTermList[j] && WinsolsDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        //////定氣/////
        const TermAcrNoonDecimalDif = [] // 中前後分。「冬至後，中前以差減，中後以差加⋯⋯冬至一日有減無加，夏至一日有加無減。」
        for (let i = 0; i <= 23; i++) {
            const TermAcrRaw = AcrTermList[i]
            const TermAcrDecimal = TermAcrRaw - ~~TermAcrRaw
            TermAcrNoonDecimalDif[i] = TermAcrDecimal - 0.5 // 定氣與正午的距離
        }
        const t1 = AcrTermList[TermNum] - TermAcrNoonDecimalDif[TermNum]
        const t2 = AcrTermList[TermNum + 1] - TermAcrNoonDecimalDif[TermNum]
        const t3 = AcrTermList[TermNum + 2] - TermAcrNoonDecimalDif[TermNum]
        const Initial1 = t1 + ',' + NightList[TermNum] + ';' + t2 + ',' + NightList[TermNum + 1] + ';' + t3 + ',' + NightList[TermNum + 2]
        const Initial2 = t1 + ',' + SunLatiList[TermNum] + ';' + t2 + ',' + SunLatiList[TermNum + 1] + ';' + t3 + ',' + SunLatiList[TermNum + 2]
        Sunrise = DawnRange + Interpolate3(WinsolsDif, Initial1)
        Lati1 = Interpolate3(WinsolsDif, Initial2)
        Lati = 91.31 - Lati1
    } else {
        ////////////平氣////////////
        const TermNum = ~~(WinsolsDif / HalfTermLeng)
        const TermDif = WinsolsDif - TermNum * HalfTermLeng
        let TermRange = 0
        if (Type === 6) {// 麟德   
            if ((WinsolsDifRaw < 6 * HalfTermLeng) || (WinsolsDifRaw >= 18 * HalfTermLeng)) {
                TermRange = TermRangeA // 秋分後
            } else {
                TermRange = TermRangeS // 春分後
            }
        } else {
            TermRange = HalfTermLeng
        }
        const TermAvgNoonDecimalDif = []
        for (let i = 0; i <= 23; i++) {
            const TermAvgRaw = i * HalfTermLeng
            const TermAvgDecimal = TermAvgRaw - ~~TermAvgRaw // 各平氣小數點
            TermAvgNoonDecimalDif[i] = TermAvgDecimal - 0.5 // 平氣與正午的距離
        }
        const nAvg = 1 + (TermDif + TermAvgNoonDecimalDif[TermNum]) / TermRange
        const Initial3 = NightList[TermNum] + ',' + NightList[TermNum + 1] + ',' + NightList[TermNum + 2]
        Sunrise = DawnRange + Interpolate1(nAvg, Initial3)
        if (Type === 6) {
            const Initial1 = DialList[TermNum] + ',' + DialList[TermNum + 1] + ',' + DialList[TermNum + 2]
            Dial = Interpolate1(nAvg, Initial1)
        }
        if (Type === 10) {
            Lati = -(Sunrise - 25) / (10896 / 52300)
            Lati1 = Sidereal / 4 - Lati
        } else {
            const Initial2 = SunLatiList[TermNum] + ',' + SunLatiList[TermNum + 1] + ',' + SunLatiList[TermNum + 2]
            Lati1 = Interpolate1(nAvg, Initial2)
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
        // const TermAcrDial = DialList[TermNum] - (TermAvgDecimal[TermNumRaw] - 0.5) * Corr // 恆氣日中定影
        // Dial = (TermAcrDial + (TermDifInt * delta1 + TermDifInt * delta2 - (TermDifInt ** 2) * delta4)).toFixed(4) // 劉焯二次內插公式              
    }
    // 唐系、應天、乾元。本來寫了個去極度差分表，太麻煩，還不如直接用招差
    if (Type > 6) {
        const SunLati2 = Lati1 - (91.3 - f) // 天頂距
        // 下爲大衍晷影差分表
        if (SunLati2 <= 27) {
            Dial = Interpolate2(SunLati2 - 1, 1379, '1380,2,1')
        } else if (SunLati2 <= 42) {
            Dial = Interpolate2(SunLati2 - 28, 42267, '1788,32,2')
        } else if (SunLati2 <= 46) {
            Dial = Interpolate2(SunLati2 - 43, 73361, '2490,74,6')
        } else if (SunLati2 <= 50) {
            Dial = Interpolate2(SunLati2 - 47, 83581, '3212,-118,272')
        } else if (SunLati2 <= 57) {
            Dial = Interpolate2(SunLati2 - 51, 96539, '3562,165,7')
        } else if (SunLati2 <= 61) {
            Dial = Interpolate2(SunLati2 - 58, 125195, '4900,250,19')
        } else if (SunLati2 <= 67) {
            Dial = Interpolate2(SunLati2 - 60, 146371, '6155,481,33')
        } else if (SunLati2 <= 72) {
            Dial = Interpolate2(SunLati2 - 68, 191179, '9545,688,36')
        } else {
            Dial = Interpolate2(SunLati2 - 73, 246147, '13354,1098,440,620,180')
        }
        Dial /= 10000
    }
    // 夜半漏計算直接用招差術了，不勝其煩。
    return {
        Lati,
        Lati1,
        Dial,
        Sunrise
    }
}
// console.log(Longi2LatiTable2(180, 0.5, 'NewDaming').Lati) // 《麟徳曆晷影計算方法硏究》頁323：第15日應比12.28稍長。我現在算出來沒問題。

export const MoonLongiTable = (WinsolsDifRaw, NodeAccum, CalName) => { ///////唐宋赤白轉換//////
    const {
        AutoPara
    } = Bind(CalName)
    const {
        Node,
        Solar
    } = AutoPara[CalName]
    const Quadrant = 90.94335
    const LongiRaw = AutoMoonAvgV(CalName) * NodeAccum // 以月平行度乘之
    let Longi = LongiRaw % (Quadrant)
    if ((LongiRaw > Quadrant && LongiRaw <= Quadrant * 2) || (LongiRaw >= Quadrant * 3 && LongiRaw < Solar)) {
        Longi = Quadrant - Longi
    }
    const WinsolsDif = WinsolsDifRaw - NodeAccum % (Node / 2)
    const WinsolsDifHalf = WinsolsDif % (Solar / 2)
    let WhiteLongi = 0
    let Range = []
    if (CalName === 'Huangji') { // 麟徳沒有
        Range = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2.94, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] // 《中國古代曆法》頁60
    } else if (['Dayan', 'Qintian', 'Yingtian'].includes(CalName)) {
        Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0.94, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    }
    let LongiDifDifInitial = 0
    let LongiDifDifChange = 0
    let EclipticWhiteDif = 0
    const Smallquadrant = 5.07 // Solar / 72// 欽天8節72限
    if (CalName === 'Huangji') {
        LongiDifDifInitial = 11 / 45 // ⋯⋯四度爲限，初十一，每限損一，以終於一
        LongiDifDifChange = -1 / 45
    } else if (CalName === 'Dayan') {
        LongiDifDifInitial = 12 / 24
        LongiDifDifChange = -1 / 24
    } else if (CalName === 'Qintian') {
        LongiDifDifInitial = 40 / 72
        LongiDifDifChange = -5 / 72
    } else if (CalName === 'Yingtian') {
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
    EclipticWhiteDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 一次內插
    if (CalName !== 'Huangji') {
        EclipticWhiteDif /= 2
    }
    let EquatorWhiteDif = 0
    if (CalName === 'Dayan') {
        EquatorWhiteDif = WinsolsDifHalf / (Solar / 72) / 18
    } else if (CalName === 'Qintian') {
        const OriginXian = Math.abs(WinsolsDifHalf - Solar / 4) / Smallquadrant // 限數
        // EclipticWhiteDif = (Longi - RangeAccum[LongiOrder]) * (Smallquadrant / 2) * OriginXian / 1296 // 這個用公式來算黃白差，沒寫對
        EquatorWhiteDif = (Longi - RangeAccum[LongiOrder]) * (Smallquadrant / 8) * (1 - OriginXian / 324)
    } else if (CalName === 'Yingtian') {
        const Hou = ~~(WinsolsDifHalf / (Solar / 72)) / 18
        EquatorWhiteDif = (Longi - RangeAccum[LongiOrder]) * (0.5 - 5 * Hou / 3636)
    }
    let EquatorLongi = 0
    // 大衍：（黃白差）距半交前後各九限，以差數爲減；距正交前後各九限，以差數爲加
    let sign = 1
    // if (LongiRaw >= Quadrant && LongiRaw < Quadrant * 3) {
    if ((LongiRaw >= Quadrant && LongiRaw < 2 * Quadrant) || (LongiRaw >= 3 * Quadrant)) {
        sign = -1
    }
    EclipticWhiteDif *= sign
    EquatorWhiteDif *= sign
    WhiteLongi = LongiRaw + EclipticWhiteDif
    EquatorLongi = EquatorWhiteDif ? WhiteLongi + EquatorWhiteDif : 0
    return {
        LongiRaw,
        WhiteLongi,
        EquatorLongi,
        EclipticWhiteDif,
        EquatorWhiteDif
    }
}
// console.log(MoonLongiTable(55.25, 11.22, 'Dayan'))
// console.log(MoonLongiTable(45, 3, 'Qintian').EquatorWhiteDif)

export const MoonLatiTable = (NodeAccum, CalName) => {
    const {
        Type,
        AutoPara,
    } = Bind(CalName)
    const {
        MoonLatiDifList,
    } = AutoPara[CalName]
    let {
        Node,
        MoonLatiAccumList
    } = AutoPara[CalName]
    ///////預處理陰陽曆////////
    let portion = 10
    if (Type <= 4) {
        portion = 12
    } else if (Type === 7) {
        portion = 120
    }
    const MoonLatiDif = []
    for (let i = 0; i <= 13; i++) {
        MoonLatiDif[i] = MoonLatiDifList[i] / portion
    }
    // if (!MoonLatiAccumList) {
    //     MoonLatiAccumList = MoonLatiDif.slice()
    //     for (let i = 1; i <= 14; i++) {
    //         MoonLatiAccumList[i] += MoonLatiAccumList[i - 1]
    //         MoonLatiAccumList[i] = +MoonLatiAccumList[i].toFixed(13)
    //     }
    // }
    // MoonLatiAccumList = MoonLatiAccumList.slice(-1).concat(MoonLatiAccumList.slice(0, -1))
    // MoonLatiAccumList[0] = 0
    const NodeAccumHalf = NodeAccum % (Node / 2)
    const NodeAccumHalfInt = ~~NodeAccumHalf
    let Yinyang = -1
    if (NodeAccum > Node / 2) {
        Yinyang = 1
    }
    let Lati = 0
    if (Type < 6) {
        Lati = Yinyang * (MoonLatiAccumList[NodeAccumHalfInt] + (NodeAccumHalf - NodeAccumHalfInt) * MoonLatiDif[NodeAccumHalfInt])
    } else if (Type === 6) { // 二次
        let Initial = MoonLatiAccumList[NodeAccumHalfInt] + ',' + MoonLatiAccumList[NodeAccumHalfInt + 1] + ',' + MoonLatiAccumList[NodeAccumHalfInt + 2]
        let n = 1 + NodeAccumHalf - NodeAccumHalfInt
        if (NodeAccumHalf >= 12) {
            Initial = MoonLatiAccumList[NodeAccumHalfInt - 2] + ',' + MoonLatiAccumList[NodeAccumHalfInt - 1] + ',' + MoonLatiAccumList[NodeAccumHalfInt]
            n = 3 + NodeAccumHalf - NodeAccumHalfInt
        }
        Lati = Yinyang * Interpolate1(n, Initial) / portion
    } else if (Type === 7) { // 大衍的入交度數另有算式，我直接用月平行速來算
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        const LongiRaw = NodeAccumHalf * MoonAvgVDeg
        const Cycle = Node * MoonAvgVDeg
        const Smallquadrant = Cycle / 24
        const SmallquadrantAccum = LongiRaw / Smallquadrant
        const SmallquadrantAccumInt = ~~SmallquadrantAccum
        // 三次：前半段 Δ = 171,-24,-8 後半段 Δ = -75,-40,8
        const Initial = MoonLatiAccumList[SmallquadrantAccumInt] + ',' + MoonLatiAccumList[SmallquadrantAccumInt + 1] + ',' + MoonLatiAccumList[SmallquadrantAccumInt + 2] + ',' + MoonLatiAccumList[SmallquadrantAccumInt + 3]
        const n = 1 + SmallquadrantAccum - SmallquadrantAccumInt
        Lati = Yinyang * Interpolate1(n, Initial) / portion
    }
    const Lati1 = 91.31 - Lati
    return {
        Lati,
        Lati1
    }
}
// 大衍：《中國古代曆法》頁530
// console.log(MoonLatiTable(13.61, 'Daming'))