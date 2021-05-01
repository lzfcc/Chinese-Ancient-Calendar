import {
    Bind,
} from './bind.mjs'
import {
    Interpolate1_quick,
    Interpolate2_quick
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
//     const LongiDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 線性內插
//     if ((LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)) {
//         EclipticLongi = LongiRaw - LongiDif
//     } else {
//         EclipticLongi = LongiRaw + LongiDif
//     }
//     return {
//         EclipticLongi,
//         LongiDif
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
    let EclipticLongi = 0
    let Range = []
    if (Type <= 4) {
        Range = [0, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 5 + Sidereal / 4 - Math.floor(Sidereal / 4), 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4] // 劉洪濤
    } else if (['Huangji', 'Linde'].includes(CalName)) {
        Range = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3.31, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] // 《中國古代曆法》57頁
    } else if (['Dayan', 'Zhide', 'Zhengyuan', 'Wuji', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1 + Sidereal / 4 - Math.floor(Sidereal / 4), 5, 5, 5, 5, 5, 5, 5, 5, 5]
    }
    let LongiDifDifInitial = 0
    let LongiDifDifChange = 0
    if (['Huangji', 'Linde'].includes(CalName)) { // 為何皇極增速先慢後快，大衍先快後慢？
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
    const LongiDif = LongiDifAccum[LongiOrder] + (LongiDifAccum[LongiOrder + 1] - LongiDifAccum[LongiOrder]) * (Longi - RangeAccum[LongiOrder]) / (RangeAccum[LongiOrder + 1] - RangeAccum[LongiOrder]) // 一次內插

    if ((LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)) {
        EclipticLongi = parseFloat((LongiRaw - LongiDif).toPrecision(14))
    } else {
        EclipticLongi = parseFloat((LongiRaw + LongiDif).toPrecision(14))
    }
    return EclipticLongi
}
// console.log(Equator2EclipticTable(23,''))

export const Longi2LatiTable1 = (OriginDifRaw, CalName) => {
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
    let TermNum = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1) // 每日所在氣名
    if (TermNum === 0) {
        TermNum = 1
    }
    const TermDif = OriginDifRaw % Solar - (TermNum - 1) * HalfTermLeng
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

export const Longi2LatiTable2 = (OriginDifRaw, OriginDecimal, CalName) => {
    OriginDifRaw = Number(OriginDifRaw)
    OriginDecimal = Number(OriginDecimal)
    const {
        Type,
        AutoPara,
    } = Bind(CalName)
    const {
        Solar,
        Denom,
        Sidereal,
        NightList,
        DialList,
        SunLatiList,
        // TermRangeA,
        // TermRangeS,
        SunAcrAvgDifList
    } = AutoPara[CalName]
    let DawnRange = 2.5
    if (['Linde', 'NewDaming', 'Gengwu'].includes(CalName)) {
        DawnRange = 0
    }
    const f = 34.475
    // 日躔表
    let SunDifAccumList = []
    let SunDenom = Denom
    if (Type >= 8 && CalName !== 'Qianyuan') {
        SunDenom = 10000
    }
    for (let i = 1; i <= 24; i++) {
        SunAcrAvgDifList[i] /= SunDenom
    }
    SunDifAccumList = SunAcrAvgDifList.slice()
    for (let i = 1; i <= 24; i++) {
        SunDifAccumList[i] += SunDifAccumList[i - 1]
        SunDifAccumList[i] = parseFloat((SunDifAccumList[i]).toPrecision(14))
    }
    SunDifAccumList = SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    SunDifAccumList[0] = 0

    // if (Type <= 7) {
    //     let SunDifAccum = SunAcrAvgDifList.slice() // SunAcrAvgDifAccum皇極衰總，麟德消息總
    //     for (let i = 1; i <= 24; i++) {
    //         SunDifAccum[i] += SunDifAccum[i - 1]
    //     }
    //     SunDifAccum = SunDifAccum.slice(-1).concat(SunDifAccum.slice(0, -1))
    //     SunDifAccum[0] = 0
    //     SunDifAccumList = SunDifAccum.slice()
    //     for (let i = 1; i <= 25; i++) {
    //         SunDifAccumList[i] /= Denom
    //     }
    // } else if (Type >= 8) {
    //     const SunAcrAvgDif1 = []
    //     if (SunAcrAvgDifList) {
    //         let SunDenom = 10000
    //         if (CalName === 'Qianyuan') {
    //             SunDenom = Denom
    //         }
    //         for (let i = 0; i <= 24; i++) {
    //             SunAcrAvgDif1[i] = SunAcrAvgDifList[i] / SunDenom
    //         }
    //         SunDifAccumList = SunAcrAvgDif1.slice()
    //         for (let i = 1; i <= 24; i++) {
    //             SunDifAccumList[i] += SunDifAccumList[i - 1]
    //             SunDifAccumList[i] = parseFloat((SunDifAccumList[i]).toPrecision(10))
    //         }
    //         SunDifAccumList = SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    //         SunDifAccumList[0] = 0
    //     }
    // }
    // const TermLeng = Solar / 12
    const HalfTermLeng = Solar / 24
    ////////////平氣////////////
    const TermAvgNoonDecimalDif = []
    for (let i = 1; i <= 30; i++) {
        const HalfTermAvgRaw = OriginDecimal + (i - 1) * HalfTermLeng
        const TermAvgDecimal = (HalfTermAvgRaw - Math.floor(HalfTermAvgRaw)) % 1 // 各平氣小數點
        TermAvgNoonDecimalDif[i] = TermAvgDecimal - 0.5 // 平氣與正午的距離
    }
    //////定氣/////
    const OriginAcrTermDif = []
    const TermAcrNoonDecimalDif = [] // 中前後分。「冬至後，中前以差減，中後以差加⋯⋯冬至一日有減無加，夏至一日有加無減。」
    for (let i = 1; i <= 30; i++) {
        OriginAcrTermDif[i] = HalfTermLeng * (i - 1) - SunDifAccumList[Math.round(i % 24.1)]
        const TermAcrDecimal = (OriginDecimal + OriginAcrTermDif[i] - Math.floor(OriginAcrTermDif[i])) % 1
        TermAcrNoonDecimalDif[i] = TermAcrDecimal - 0.5 // 定氣與正午的距離
        // if (i === 1 || i === 25) {
        //     TermAcrNoonDecimalDif[i] = (TermAcrDecimal - 0.5)
        //     if (TermAcrNoonDecimalDif[i] > 0) {
        //         TermAcrNoonDecimalDif[i] = 0
        //     }
        // } else if (i < 13) {
        //     TermAcrNoonDecimalDif[i] = (TermAcrDecimal - 0.5)
        // } else if (i === 13) {
        //     TermAcrNoonDecimalDif[i] = -(TermAcrDecimal - 0.5)
        //     if (TermAcrNoonDecimalDif[i] < 0) {
        //         TermAcrNoonDecimalDif[i] = 0
        //     }
        // } else if (i < 25) {
        //     TermAcrNoonDecimalDif[i] = -(TermAcrDecimal - 0.5)
        // } else {
        //     TermAcrNoonDecimalDif[i] = (TermAcrDecimal - 0.5)
        // }
    }
    let Lati1 = 0
    let Lati = 0
    // let delta1 = 0
    // let delta2 = 0
    let Dial = 0
    // let TermNumAcr = 0 // 正午入定氣
    // for (let j = 1; j <= 29; j++) {
    //     if (OriginDifRaw >= OriginAcrTermDif[j] && OriginDifRaw < OriginAcrTermDif[j + 1]) {
    //         TermNumAcr = j
    //         break
    //     }
    // }
    // const AcrTermLeng = OriginAcrTermDif[TermNumAcr + 1] - OriginAcrTermDif[TermNumAcr]
    // const AcrTermDif = OriginDifRaw - OriginAcrTermDif[TermNumAcr]
    // const TermNumAcrMod = Math.round(TermNumAcr % 24.1)

    // 改用招差術：
    let TermNumRaw = Math.ceil(OriginDifRaw / HalfTermLeng)
    if (TermNumRaw === 0) {
        TermNumRaw = 1
    }
    const TermNum = Math.round(TermNumRaw % 24.1)
    const TermDif = OriginDifRaw - (TermNumRaw - 1) * HalfTermLeng
    let Initial1 = ''
    if (DialList) {
        Initial1 = DialList[TermNum] + ',' + DialList[TermNum + 1] + ',' + DialList[(TermNum + 2) % 24]
    }
    let Initial2 = ''
    if (SunLatiList) {
        Initial2 = SunLatiList[TermNum] + ',' + SunLatiList[TermNum + 1] + ',' + SunLatiList[(TermNum + 2) % 24]
    }
    let Initial3 = NightList[TermNum] + ',' + NightList[TermNum + 1] + ',' + NightList[(TermNum + 2) % 24]
    let Excon = 0
    if (Type === 10) {
        const Initial4 = SunDifAccumList[TermNum] + ',' + SunDifAccumList[TermNum + 1] + ',' + SunDifAccumList[TermNum + 2]
        Excon = Interpolate1_quick((1 + TermDif / HalfTermLeng), Initial4)
    }
    let n = 1 + (TermDif + TermAvgNoonDecimalDif[TermNum] - Excon) / HalfTermLeng
    if ((TermNum === 1 && TermDif === 0) || (TermNum === 13 && TermDif === 0)) { // 二至當天在轉折點
        if (DialList) {
            Initial1 = DialList[((TermNum - 2) + 24) % 24] + ',' + DialList[TermNum - 1] + ',' + DialList[TermNum] + ',' + DialList[TermNum + 1]
        }
        if (SunLatiList) {
            Initial2 = SunLatiList[((TermNum - 2) + 24) % 24] + ',' + SunLatiList[TermNum - 1] + ',' + SunLatiList[TermNum] + ',' + SunLatiList[TermNum + 1]
        }
        Initial3 = NightList[((TermNum - 2) + 24) % 24] + ',' + NightList[TermNum - 1] + ',' + NightList[TermNum] + ',' + NightList[TermNum + 1]
        n = 3 + (TermAvgNoonDecimalDif[TermNum] - Excon) / HalfTermLeng
    }
    const Sunrise = DawnRange + Interpolate1_quick(n, Initial3)
    if (Type === 6) { // 紀志剛《麟德曆晷影計算方法研究》，《自然科學史研究》1994(4)             
        // 麟德   
        // let AvgHalfTermLeng = 0
        // if ((OriginDifRaw < 3 * TermLeng) || (OriginDifRaw >= 9 * TermLeng)) {
        //     AvgHalfTermLeng = TermRangeA // 秋分後
        // } else {
        //     AvgHalfTermLeng = TermRangeS // 春分後
        // }
        /////////預處理晷長///////////
        // let DialChangeList = [] // 陟降率
        // DialChangeList[0] = 0
        // for (let i = 1; i <= 24; i++) {
        //     DialChangeList[i] = parseFloat((DialList[i + 1] - DialList[i]).toPrecision(12))
        // }
        // DialChangeList[25] = DialChangeList[1]
        // delta1 = ((DialChangeList[TermNum] + DialChangeList[TermNum + 1]) / 2) / AvgHalfTermLeng // 泛末率
        // delta2 = (DialChangeList[TermNum] - DialChangeList[TermNum + 1]) / AvgHalfTermLeng // 總差
        // if (TermNum % 12 === 0) { // 芒種、大雪
        //     delta2 = ((DialChangeList[TermNum - 1] - DialChangeList[TermNum]) / AvgHalfTermLeng)
        //     delta1 = ((DialChangeList[TermNum - 1] + DialChangeList[TermNum]) / 2) / AvgHalfTermLeng - delta2
        // }
        // const delta3 = delta1 + delta2 // 泛初率
        // const delta4 = (delta2 / AvgHalfTermLeng) / 2 // 限差。不/2是別差
        // const Corr = delta3 + delta4 // 定差
        // const TermAcrDial = DialList[TermNum] - (TermAvgDecimal[TermNumRaw] - 0.5) * Corr // 恆氣日中定影
        // Dial = (TermAcrDial + (TermDifInt * delta1 + TermDifInt * delta2 - (TermDifInt ** 2) * delta4)).toFixed(4) // 劉焯二次內插公式
        Dial = Interpolate1_quick(n, Initial1)
        Lati1 = Interpolate1_quick(n, Initial2)
        Lati = Solar / 4 - Lati1 // 赤緯
    } else if (Type <= 8) { // 唐系、應天、乾元
        // let Initial1 = SunLatiList[TermNumAcrMod] + ',' + SunLatiList[TermNumAcrMod + 1] + ',' + SunLatiList[TermNumAcrMod + 2]
        // let Initial3 = NightList[TermNumAcrMod] + ',' + NightList[TermNumAcrMod + 1] + ',' + NightList[(TermNumAcrMod + 2) % 24]
        // let n = 1 + (AcrTermDif + TermAcrNoonDecimalDif[TermNum]) / AcrTermLeng
        // if ((TermNum === 1 && TermDif === 0) || (TermNum === 13 && TermDif === 0)) {
        //     Initial1 = SunLatiList[((TermNumAcrMod - 2) + 24) % 24] + ',' + SunLatiList[TermNumAcrMod - 1] + ',' + SunLatiList[TermNumAcrMod] + ',' + SunLatiList[TermNumAcrMod + 1]
        //     Initial3 = NightList[((TermNumAcrMod - 2) + 24) % 24] + ',' + NightList[TermNumAcrMod - 1] + ',' + NightList[TermNumAcrMod] + ',' + NightList[TermNumAcrMod + 1]
        //     n = 3 + TermAcrNoonDecimalDif[TermNum] / AcrTermLeng
        // }
        // 本來寫了個去極度差分表，太麻煩，還不如直接用招差
        Lati1 = Interpolate1_quick(n, Initial2)
        Lati = Sidereal / 4 - Lati1 // 赤緯
        const SunLati2 = Lati1 - (91.3 - f) // 天頂距
        // 下爲大衍晷影差分表
        if (SunLati2 <= 27) {
            Dial = Interpolate2_quick(SunLati2 - 1, 1379, '1380,2,1')
        } else if (SunLati2 <= 42) {
            Dial = Interpolate2_quick(SunLati2 - 28, 42267, '1788,32,2')
        } else if (SunLati2 <= 46) {
            Dial = Interpolate2_quick(SunLati2 - 43, 73361, '2490,74,6')
        } else if (SunLati2 <= 50) {
            Dial = Interpolate2_quick(SunLati2 - 47, 83581, '3212,-118,272')
        } else if (SunLati2 <= 57) {
            Dial = Interpolate2_quick(SunLati2 - 51, 96539, '3562,165,7')
        } else if (SunLati2 <= 61) {
            Dial = Interpolate2_quick(SunLati2 - 58, 125195, '4900,250,19')
        } else if (SunLati2 <= 67) {
            Dial = Interpolate2_quick(SunLati2 - 60, 146371, '6155,481,33')
        } else if (SunLati2 <= 72) {
            Dial = Interpolate2_quick(SunLati2 - 68, 191179, '9545,688,36')
        } else {
            Dial = Interpolate2_quick(SunLati2 - 73, 246147, '13354,1098,440,620,180')
        }
        Dial /= 10000
        // 夜半漏計算直接用招差術了，不勝其煩。
    } else if (Type === 10) {
        Lati = -(Sunrise - 25) / (10896 / 52300)
        Lati1 = Sidereal / 4 - Lati
    }
    return {
        Lati: Number(Lati),
        Lati1: Number(Lati1),
        Dial: Number(Dial),
        Sunrise: Number(Sunrise)
    }
}
// console.log(Longi2LatiTable2(180, 0.5, 'Gengwu').Lati) // 《麟徳曆晷影計算方法硏究》頁323：第15日應比12.28稍長。我現在算出來沒問題。

export const MoonLongiTable = (OriginRawRaw, Day, CalName) => { ///////唐宋赤白轉換//////
    const {
        AutoPara
    } = Bind(CalName)
    const {
        Node,
        Solar
    } = AutoPara[CalName]
    const Xiang = 90.94335
    const LongiRaw = 13.36876 * Day // 以月平行度乘之
    let Longi = LongiRaw % (Xiang)
    if ((LongiRaw > Xiang && LongiRaw <= Xiang * 2) || (LongiRaw >= Xiang * 3 && LongiRaw < Solar)) {
        Longi = Xiang - Longi
    }
    const OriginRaw = OriginRawRaw - Day % (Node / 2)
    const Origin = OriginRaw % (Solar / 2)
    let WhiteLongi = 0
    let Range = []
    if (['Huangji'].includes(CalName)) { // 麟徳沒有
        Range = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2.94, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] // 《中國古代曆法》頁60
    } else if (['Dayan', 'Qintian', 'Yingtian'].includes(CalName)) {
        Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0.94, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    }
    let LongiDifDifInitial = 0
    let LongiDifDifChange = 0
    let EclipticWhiteDif = 0
    const Xian = Solar / 72

    if (['Huangji'].includes(CalName)) {
        LongiDifDifInitial = 11 / 45 // ⋯⋯四度爲限，初十一，每限損一，以終於一
        LongiDifDifChange = -1 / 45
    } else if (['Dayan'].includes(CalName)) {
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
        EquatorWhiteDif = Math.floor(Origin / (Solar / 72)) / 18
    } else if (CalName === 'Qintian') {
        const OriginXian = Math.abs(Origin - Solar / 4) / Xian // 限數
        EclipticWhiteDif = (Longi - RangeAccum[LongiOrder]) * (Xian / 2) * OriginXian / 1296 // 這個用公式來算黃白差，跟用表不一樣
        EquatorWhiteDif = (Longi - RangeAccum[LongiOrder]) * (Xian / 8) * (1 - OriginXian / 324)
    } else if (CalName === 'Yingtian') {
        const Hou = Math.floor(Origin / (Solar / 72)) / 18
        EquatorWhiteDif = (Longi - RangeAccum[LongiOrder]) * (0.5 - 5 * Hou / 3636)
    }
    let EquatorLongi = 0
    if ((LongiRaw >= 0 && LongiRaw < Xiang) || (LongiRaw >= Xiang * 2 && LongiRaw < Xiang * 3)) {
        WhiteLongi = parseFloat((LongiRaw - EclipticWhiteDif).toPrecision(14))
        EquatorLongi = parseFloat((LongiRaw - EquatorWhiteDif).toPrecision(14))
    } else {
        WhiteLongi = parseFloat((LongiRaw + EclipticWhiteDif).toPrecision(14))
        EquatorLongi = parseFloat((LongiRaw + EquatorWhiteDif).toPrecision(14))
    }
    return {
        WhiteLongi,
        EquatorLongi,
        EclipticWhiteDif,
        EquatorWhiteDif
    }
}
// console.log(MoonLongiTable(55.25, 11.22, 'Dayan'))
// console.log(MoonLongiTable(55.25, 11.22, 'Qintian'))

export const MoonLatiTable = (DayRaw, CalName) => {
    const {
        Type,
        AutoPara,
    } = Bind(CalName)
    const {
        Lunar,
        Ecli,
        MoonLatiDifList,
    } = AutoPara[CalName]
    let {
        Node,
        MoonLatiAccumList
    } = AutoPara[CalName]
    if (!Node) {
        Node = Lunar * Ecli / (0.5 + Ecli)
    }
    ///////預處理陰陽曆////////
    let portion = 10
    if (Type <= 4) {
        portion = 12
    } else if (Type === 7) {
        portion = 120
    }
    const MoonLatiDif = []
    for (let i = 1; i <= 14; i++) {
        MoonLatiDif[i] = MoonLatiDifList[i] / portion
    }
    MoonLatiDif[0] = 0
    if (!MoonLatiAccumList) {
        MoonLatiAccumList = MoonLatiDif.slice()
        for (let i = 1; i < MoonLatiAccumList.length; i++) {
            MoonLatiAccumList[i] += MoonLatiAccumList[i - 1]
        }
    }
    const Day = DayRaw % (Node / 2)
    const Day1 = Math.floor(Day)
    let Yinyang = -1
    if (DayRaw > Node / 2) {
        Yinyang = 1
    }
    let Lati = 0
    if (Type < 6) {
        Lati = Yinyang * (MoonLatiAccumList[Day1] + (Day - Day1) * MoonLatiDif[Day1])
    } else if (Type === 6) {
        let Initial = MoonLatiAccumList[Day1] + ',' + MoonLatiAccumList[Day1 + 1] + ',' + MoonLatiAccumList[Day1 + 2]
        let n = 1 + Day - Day1
        if (Day >= 13) {
            Initial = MoonLatiAccumList[Day1 - 2] + ',' + MoonLatiAccumList[Day1 - 1] + ',' + MoonLatiAccumList[Day1]
            n = 3 + Day - Day1
        } else if (Day >= 12) {
            Initial = MoonLatiAccumList[Day1 - 1] + ',' + MoonLatiAccumList[Day1] + ',' + MoonLatiAccumList[Day1 + 1]
            n = 2 + Day - Day1
        }
        Lati = Yinyang * Interpolate1_quick(n, Initial) / portion
    } else if (Type === 7) { // 大衍的入交度數另有算式，我直接用月平行速來算
        const LongiRaw = Day * 13.36875
        const XianRaw = 1 + LongiRaw / (365.245 / 24)
        let XianNum = Math.ceil(LongiRaw / (365.245 / 24))
        if (XianNum === 0) {
            XianNum = 1
        }
        // 就直接用二次內插，不想用三次了
        let Initial = MoonLatiAccumList[XianNum] + ',' + MoonLatiAccumList[XianNum + 1] + ',' + MoonLatiAccumList[XianNum + 2]
        let n = 1 + XianRaw - XianNum
        if (Day >= 13) {
            Initial = MoonLatiAccumList[XianNum - 2] + ',' + MoonLatiAccumList[XianNum - 1] + ',' + MoonLatiAccumList[XianNum]
            n = 3 + XianRaw - XianNum
        } else if (Day >= 12) {
            Initial = MoonLatiAccumList[XianNum - 1] + ',' + MoonLatiAccumList[XianNum] + ',' + MoonLatiAccumList[XianNum + 1]
            n = 2 + XianRaw - XianNum
        }
        Lati = Yinyang * Interpolate1_quick(n, Initial) / portion
    }
    const Lati1 = 91.311 - Lati
    return {
        Lati,
        Lati1
    }
}
// 大衍：《中國古代曆法》頁530
// console.log(MoonLatiTable(14, 'Dayan'))