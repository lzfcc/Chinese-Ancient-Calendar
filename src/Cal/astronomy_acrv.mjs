import { Bind } from './bind.mjs'
import { SunAcrVWest, MoonAcrVWest } from './astronomy_west.mjs'
import { Interpolate1, Interpolate3 } from './equa_sn.mjs'
import { AutoMoonAvgV, AutoNodePortion, AutoQuar, AutoMoonTcorrDif } from './para_auto-constant.mjs'

// 大衍用不等間距二次內插，宣明也是。崇玄暫且用平氣。計算盈縮積
export const SunDifAccumTable = (WinsolsDif, CalName) => {
    const { Type, AutoPara } = Bind(CalName)
    const { SunAcrAvgDifList, TermRangeA, TermRangeS, SolarRaw, AcrTermList } = AutoPara[CalName]
    let { Denom, Solar } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    if (Type >= 8 && CalName !== 'Qianyuan') { // 崇玄也是萬分母
        Denom = 10000
    }
    const HalfTermLeng = Solar / 24
    const SunAcrAvgDifListList = [] // 這個多此一舉的SunAcrAvgDifListList一定不能刪掉，否則多次運算就會越來越小
    for (let i = 0; i <= 23; i++) {
        SunAcrAvgDifListList[i] = SunAcrAvgDifList[i] / Denom
    }
    let SunDifAccumList = SunAcrAvgDifListList.slice()
    for (let i = 1; i <= 23; i++) {
        SunDifAccumList[i] += SunDifAccumList[i - 1]
        SunDifAccumList[i] = +(SunDifAccumList[i].toFixed(6))
    }
    SunDifAccumList = SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    SunDifAccumList[0] = 0
    SunDifAccumList[24] = 0
    SunDifAccumList[25] = SunDifAccumList[1]
    let SunDifAccum2 = 0
    if (Type === 7 && CalName !== 'Qintian') {
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (WinsolsDif >= AcrTermList[j] && WinsolsDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        const Initial = AcrTermList[TermNum] + ',' + SunDifAccumList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + SunDifAccumList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + SunDifAccumList[TermNum + 2]
        SunDifAccum2 = Interpolate3(WinsolsDif, Initial) // 直接拉格朗日內插，懶得寫了
    } else {
        let TermRange = 0
        const TermNum1 = ~~(WinsolsDif / HalfTermLeng)  // 朔望所在氣名
        // const TermNum2 = (TermNum1 + 1) % 24
        // const TermNewmDif = WinsolsDif - TermNum1 * HalfTermLeng // 注意要減1。朔望入氣日數
        if (['LindeA', 'LindeB', 'Huangji', 'Shenlong'].includes(CalName)) {
            if ((WinsolsDif < 6 * HalfTermLeng) || (WinsolsDif >= 18 * HalfTermLeng)) {
                TermRange = TermRangeA // 秋分後
            } else {
                TermRange = TermRangeS // 春分後
            }
        } else {
            TermRange = HalfTermLeng - SunAcrAvgDifListList[TermNum1] / Denom
        }
        // 招差術和精確公式算出來結果一樣
        const n = (WinsolsDif - TermNum1 * HalfTermLeng) / TermRange
        const Initial = SunDifAccumList[TermNum1] + ',' + SunDifAccumList[TermNum1 + 1] + ',' + SunDifAccumList[TermNum1 + 2]
        SunDifAccum2 = Interpolate1(n + 1, Initial)
        // const SunAcrAvgDif1 = SunAcrAvgDifListList[TermNum1]
        // const SunAcrAvgDif2 = SunAcrAvgDifListList[TermNum2]
        // SunDifAccum2 = SunDifAccumList[TermNum1] + 0.5 * (TermNewmDif / TermRange) * (SunAcrAvgDif1 + SunAcrAvgDif2) + (TermNewmDif / TermRange) * (SunAcrAvgDif1 - SunAcrAvgDif2) - 0.5 * ((TermNewmDif / TermRange) ** 2) * (SunAcrAvgDif1 - SunAcrAvgDif2)
    }
    // Solar =365 + 2366 / 9740
    // const AcrTermList = [] // 定氣距冬至日數
    // for (let i = 0; i <= 23; i++) {
    //     AcrTermList[i] = +(HalfTermLeng * i - SunDifAccumList[i]).toFixed(6)
    // }
    // AcrTermList[0] = 0
    // AcrTermList[24] = +Solar.toFixed(6)
    // AcrTermList[25] = +(AcrTermList[1] + Solar).toFixed(6)
    return SunDifAccum2
}
// console.log(SunDifAccumTable(9.25, 'Chongtian'))

// 計算朓朒積
const SunTcorrTable = (WinsolsDif, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Solar, SolarRaw, SunTcorrList, AcrTermList, TermRangeA, TermRangeS } = AutoPara[CalName]
    let { Denom } = AutoPara[CalName]
    let HalfTermLeng = (Solar || SolarRaw) / 24
    const TermNum = ~~(WinsolsDif / HalfTermLeng)
    let TermRange = HalfTermLeng
    if (['Huangji', 'LindeA', 'LindeB',].includes(CalName)) {
        if ((WinsolsDif < 6 * HalfTermLeng) || (WinsolsDif >= 18 * HalfTermLeng)) {
            TermRange = TermRangeA // 秋分後
        } else {
            TermRange = TermRangeS // 春分後
        }
    }
    const t = WinsolsDif - TermNum * HalfTermLeng
    const n = t / TermRange
    let SunTcorr1 = 0
    let SunTcorr2 = 0
    if (Type === 7) { // 拉格朗日內插
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (WinsolsDif >= AcrTermList[j] && WinsolsDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        const Initial = AcrTermList[TermNum] + ',' + SunTcorrList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + SunTcorrList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + SunTcorrList[TermNum + 2]
        SunTcorr2 = Interpolate3(WinsolsDif, Initial)
        TermRange = AcrTermList[TermNum + 1] - AcrTermList[TermNum] // 本氣長度
        SunTcorr1 = SunTcorrList[TermNum] + (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum]) * (WinsolsDif - AcrTermList[TermNum]) / TermRange
    } else {
        const D1 = SunTcorrList[TermNum + 1] - SunTcorrList[TermNum]
        const D2 = SunTcorrList[TermNum + 2] - SunTcorrList[TermNum + 1]
        const D = (D1 - D2) / TermRange ** 2 // 日差
        let Plus = D / 2
        if (['LindeA', 'LindeB', 'Yingtian', 'Qianyuan'].includes(CalName)) { // 這三曆初日沒有減半日差，不精確
            Plus = 0
        }
        const G1 = D1 / TermRange + (D1 - D2) / (2 * TermRange) - Plus
        const Gt = G1 - (t - 1) * D // 前多者日減，前少者日加初數
        SunTcorr2 = (G1 + Gt) * t / 2 + SunTcorrList[TermNum]
    }
    // 結果和下面用招差術完全相同
    // else {
    //     if (Type >= 5) {
    //         const Initial = SunTcorrList[TermNum] + ',' + SunTcorrList[TermNum + 1] + ',' + SunTcorrList[TermNum + 2]
    //         SunTcorr2 = Interpolate1(n + 1, Initial)
    //     }
    //     SunTcorr1 = SunTcorrList[TermNum] + n * (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum])
    // }
    if (CalName === 'Wuiyn') {
        Denom = 11830
    }
    if (['Daye', 'Wuyin'].includes(CalName)) {
        SunTcorr1 = SunTcorrList[TermNum] + n * (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum])
        SunTcorr1 /= Denom
    }
    SunTcorr2 /= Denom
    return { SunTcorr1, SunTcorr2 }
}
// console.log(SunTcorrTable(55, 'Yingtian'))

const SunDifAccumFormula = (WinsolsDif, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Denom, SolarRaw, DeltaSunA1, DeltaSunA2, DeltaSunA3, DeltaSunB1, DeltaSunB2, DeltaSunB3
    } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    let SunDifAccum = 0
    let sign = 1
    let Quadrant = 0
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const WinsolsDifHalf = WinsolsDif % Solar50
    const T = Solar25 - Math.abs(WinsolsDifHalf - Solar25)
    const { QuarA, QuarB } = AutoQuar(CalName)
    if (Type === 11) {
        if (WinsolsDif <= QuarA) {
            SunDifAccum = (DeltaSunA1 * T - DeltaSunA2 * (T ** 2) - DeltaSunA3 * (T ** 3)) / 10000 // 盈縮差
        } else if (WinsolsDif <= Solar50) {
            SunDifAccum = (DeltaSunB1 * T - DeltaSunB2 * (T ** 2) - DeltaSunB3 * (T ** 3)) / 10000
        } else if (WinsolsDif <= Solar50 + QuarB) {
            SunDifAccum = -(DeltaSunB1 * T - DeltaSunB2 * (T ** 2) - DeltaSunB3 * (T ** 3)) / 10000
        } else {
            SunDifAccum = -(DeltaSunA1 * T - DeltaSunA2 * (T ** 2) - DeltaSunA3 * (T ** 3)) / 10000
        }
    } else { // 王榮彬《中國古代曆法的中心差算式之造術原理》
        if (CalName === 'Guantian') {
            let SunDenom = 0
            const SunDenomA = 3294
            const SunDenomB = 3659
            if (WinsolsDif <= QuarA) {
                Quadrant = QuarA
                SunDenom = SunDenomA
            } else if (WinsolsDif <= Solar50) {
                Quadrant = QuarB
                SunDenom = SunDenomB
            } else if (WinsolsDif <= Solar50 + QuarB) {
                Quadrant = QuarB
                SunDenom = SunDenomB
                sign = -1
            } else {
                Quadrant = QuarA
                SunDenom = SunDenomA
                sign = -1
            }
            SunDifAccum = sign * (T / SunDenom) * (2 * Quadrant - T) // 盈縮差度分。極值2.37
        } else if (CalName === 'Mingtian') {
            if (WinsolsDif > Solar50) {
                sign = -1
            }
            SunDifAccum = sign * T * (200 - T) / 4135 // 盈縮差度分。極值2.4
            // SunTcorr = sign * T * (200 - T) * 400 / 567/Denom 按照月速13.36875算出來，和上面的算式沒有區別，很好
        } else if (CalName === 'Futian') {
            if (WinsolsDif > Solar50) {
                sign = -1
            }
            SunDifAccum = sign * WinsolsDifHalf * (Solar50 - WinsolsDifHalf) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得爲立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000爲分母。
        } else if (CalName === 'Yitian') {
            const Delta = 24543 / Denom // 盈縮積 // 946785.5=897699.5+24543*2
            Quadrant = QuarA
            if (WinsolsDif <= QuarA) {
            } else if (WinsolsDif <= Solar50) {
                Quadrant = QuarB
            } else if (WinsolsDif <= Solar50 + QuarB) {
                sign = -1
                Quadrant = QuarB
            } else {
                sign = -1
            }
            // const E = 2 * Delta / Quadrant // 初末限平率=2限率分=2盈縮積/限日
            // const F = E / Quadrant // 日差=限差/限日=2限率分/限日，限率分=盈縮積/限日
            //初末定率= 2*2.43/Quadrant-日差/2
            // SunDifAccum = sign * (T * (E - F / 2) - T * (T - 1) * F / 2) // 盈縮定分、先後數。儀天極値2.43
            SunDifAccum = sign * ((T * Delta / Quadrant ** 2) * (2 * Quadrant - T))
        }
    }
    return SunDifAccum
}
// console.log(SunDifAccumFormula(88.88, 'Jiyuan'))

const SunTcorrFormula = (WinsolsDif, CalName) => { // 一定程度上適用於崇玄以後
    const { AutoPara } = Bind(CalName)
    const { SolarRaw, Denom, SunTcorrList } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    let SunTcorr = 0
    if (SunTcorrList) {
        const Solar50 = Solar / 2
        const Solar25 = Solar / 4
        const QuarA = Solar25
        const QuarB = Solar25
        const Delta = SunTcorrList[6] / Denom
        let Quadrant = QuarA
        const WinsolsDifHalf = WinsolsDif % Solar50
        const T = Solar25 - Math.abs(WinsolsDifHalf - Solar25)
        let sign = 1
        if (WinsolsDif <= QuarA) {
        } else if (WinsolsDif <= Solar50) {
            Quadrant = QuarB
        } else if (WinsolsDif <= Solar50 + QuarB) {
            sign = -1
            Quadrant = QuarB
        } else {
            sign = -1
        }
        let Plus = 0
        if (['LindeA', 'LindeB', 'Yingtian', 'Qianyuan'].includes(CalName)) { // 這幾部初定率沒有考慮半日差Delta/Quadrant**2，最後合併同類項多了一個1
            Plus = 1
        }
        SunTcorr = sign * ((Delta * T / Quadrant ** 2) * (2 * Quadrant - T + Plus))
    }
    return SunTcorr * Denom
}
// console.log(SunTcorrFormula(31.9780521262, 'Jiyuan'))

// 這是魏晉南北朝的月離表
const MoonTcorrTable1 = (AnomaAccum, CalName) => {
    const { AutoPara } = Bind(CalName)
    const { MoonAcrVList, MoonDifAccumList, Anoma, ZhangRange } = AutoPara[CalName]
    AnomaAccum %= Anoma
    // const MoonAcrVList = MoonAcrVRaw.slice()
    // if (['Tsrengguang', 'Xinghe', 'Tianbao', 'Daming',].includes(CalName)) {
    //     for (let i = 0; i <= 28; i++) {
    //         MoonAcrVList[i] = (MoonAcrVList[i] * ZhangRange)
    //     }
    // }    
    // const MoonAcrAvgDifList = [] // 損益率
    // for (let i = 0; i <= 27; i++) {
    //     MoonAcrAvgDifList[i] = MoonAcrVList[i] - MoonAvgV
    // }
    // let MoonDifAccumList = MoonAcrAvgDifList.slice() // 先錄入實行速，用這個轉換成盈縮積
    // for (let i = 1; i <= 28; i++) {
    //     MoonDifAccumList[i] += MoonDifAccumList[i - 1]
    //     MoonDifAccumList[i] = parseFloat((MoonDifAccumList[i]).toPrecision(12))
    // }
    // MoonDifAccumList = MoonDifAccumList.slice(-1).concat(MoonDifAccumList.slice(0, -1))
    // MoonDifAccumList[0] = 0
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(12)) // 乾象254=章歲+章月
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    let MoonDifAccum1 = MoonDifAccumList[AnomaAccumInt] + AnomaAccumFract * (MoonDifAccumList[AnomaAccumInt + 1] - MoonDifAccumList[AnomaAccumInt]) //* MoonAcrAvgDifList[AnomaAccumInt]
    const SunAvgV = ZhangRange
    let MoonTcorr1 = 0
    if (['Qianxiang', 'Jingchu', 'Daming', 'Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        MoonTcorr1 = -MoonDifAccum1 / (MoonAcrVList[~~AnomaAccum] - SunAvgV)
    } else if (['Yuanjia'].includes(CalName)) { // 「賓等依何承天法」
        const MoonAcrDayDif = [] // 列差
        for (let i = 0; i <= 27; i++) {
            MoonAcrDayDif[i] = MoonAcrVList[i + 1] - MoonAcrVList[i]
        }
        const MoonAcrV1 = MoonAcrVList[AnomaAccumInt] + AnomaAccumFract * MoonAcrDayDif[AnomaAccumInt]
        MoonTcorr1 = -MoonDifAccum1 / (MoonAcrV1 - SunAvgV)
    } else if (['Tsrengguang', 'Xinghe', 'Tianbao'].includes(CalName)) {
        MoonTcorr1 = -MoonDifAccum1 / MoonAvgV
    }
    MoonDifAccum1 /= ZhangRange
    return { MoonDifAccum1, MoonTcorr1 }
}
// console.log(MoonTcorrTable1(14, 'Daming').MoonDifAccum1)

const MoonAcrSTable1 = (AnomaAccum, CalName) => {
    const { AutoPara } = Bind(CalName)
    const { MoonDifAccumList, ZhangRange } = AutoPara[CalName]
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(12))
    const MoonAcrSList = []
    for (let i = 0; i <= 28; i++) {
        MoonAcrSList[i] = parseFloat((MoonDifAccumList[i] + i * MoonAvgV).toPrecision(12))
    }
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    const MoonAcrS = (MoonAcrSList[AnomaAccumInt] + AnomaAccumFract * (MoonAcrSList[AnomaAccumInt + 1] - MoonAcrSList[AnomaAccumInt])) / ZhangRange
    return MoonAcrS
}
// console.log(MoonAcrSTable1(0.1, 'Daming'))

const MoonTcorrTable = (AnomaAccum, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { MoonTcorrList, Anoma, Denom } = AutoPara[CalName]
    const Anoma25 = Anoma / 4
    const Anoma50 = Anoma / 2
    const Anoma75 = Anoma * 0.75
    AnomaAccum %= Anoma
    let AnomaAccumInt = ~~AnomaAccum
    let AnomaAccumFrac = AnomaAccum - AnomaAccumInt
    const AnomaAccumHalf = AnomaAccum % Anoma50
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumHalfFrac = AnomaAccumHalf - AnomaAccumHalfInt
    const AnomaAccumQuar = AnomaAccum % Anoma25
    const AnomaAccumQuarInt = ~~AnomaAccumQuar
    const AnomaAccumQuarFrac = AnomaAccumQuar - AnomaAccumQuarInt
    let Plus = 0
    let MoonTcorr1 = 0
    let MoonTcorr2 = 0
    if (CalName === 'Qintian') {
        const XianRange = Anoma / 248
        const XianNum = ~~(AnomaAccum / XianRange)
        const XianFrac = AnomaAccum / XianRange - XianNum // 占一限的百分比，而非一日。
        MoonTcorr1 = MoonTcorrList[XianNum] + XianFrac * (MoonTcorrList[XianNum + 1] - MoonTcorrList[XianNum])
    } else {
        const { MoonTcorrDifPos: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AnomaAccum, CalName)
        if (CalName === 'Yitian') {
            AnomaAccumInt = AnomaAccumQuarInt
            AnomaAccumFrac = AnomaAccumQuarFrac
            if (AnomaAccum < Anoma25) {
            } else if (AnomaAccum < Anoma50) {
                Plus = 7
            } else if (AnomaAccum < Anoma75) {
                Plus = 14
            } else {
                Plus = 21
            }
            if (AnomaAccumQuar >= 6) {
                MoonTcorr1 = MoonTcorrList[6 + Plus] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else {
                MoonTcorr1 = MoonTcorrList[Plus + AnomaAccumInt] + MoonTcorrDif * AnomaAccumFrac
            }
        } else if (['Xuanming', 'Yingtian'].includes(CalName)) {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) {
                Plus = 14
            }
            if (AnomaAccumHalf >= 6 && AnomaAccumHalf < Anoma25) {
                MoonTcorr1 = MoonTcorrList[6 + Plus] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else if (AnomaAccumHalf >= Anoma25 && AnomaAccumHalf < 7) {
                MoonTcorr1 = MoonTcorrList[7 + Plus] - MoonTcorrDif * (1 - AnomaAccumFrac) / TheDenom
            } else if (AnomaAccumHalf >= 13) {
                MoonTcorr1 = MoonTcorrList[13 + Plus] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else {
                MoonTcorr1 = MoonTcorrList[Plus + AnomaAccumInt] + MoonTcorrDif * AnomaAccumFrac
            }
        } else {
            if (AnomaAccum >= 6 && AnomaAccum < Anoma25) {
                MoonTcorr1 = MoonTcorrList[6] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else if (AnomaAccum >= Anoma25 && AnomaAccum < 7) {
                MoonTcorr1 = MoonTcorrList[7] - MoonTcorrDif * (1 - AnomaAccumFrac) / TheDenom
            } else if (AnomaAccum >= 20 && AnomaAccum < Anoma75) {
                MoonTcorr1 = MoonTcorrList[20] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else if (AnomaAccum >= Anoma75 && AnomaAccum < 21) {
                MoonTcorr1 = MoonTcorrList[21] - MoonTcorrDif * (1 - AnomaAccumFrac) / TheDenom
            } else if (AnomaAccum >= 27) {
                MoonTcorr1 = MoonTcorrList[27] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else {
                MoonTcorr1 = MoonTcorrList[AnomaAccumInt] + MoonTcorrDif * AnomaAccumFrac
            }
        }
    }
    if (Type === 7 && CalName !== 'Qintian') {
        // let TcorrA = 0
        // let TcorrB = 0
        let Initial = ''
        if (~~AnomaAccum <= 25) {
            Initial = MoonTcorrList[Plus + AnomaAccumInt] + ',' + MoonTcorrList[Plus + AnomaAccumInt + 1] + ',' + MoonTcorrList[Plus + AnomaAccumInt + 2]
            MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, Initial)
        } else {
            Initial = MoonTcorrList[Plus + AnomaAccumInt - 2] + ',' + MoonTcorrList[Plus + AnomaAccumInt - 1] + ',' + MoonTcorrList[Plus + AnomaAccumInt]
            MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, Initial)
        }
        // if (![6, 13, 20, 27].includes(AnomaAccumInt)) { // 四七日不知道怎麼處理，暫時忽略
        //     const tmp = AnomaAccumFrac - TcorrA / 2
        // }
    }
    MoonTcorr1 /= Denom
    MoonTcorr2 /= Denom
    return { MoonTcorr2, MoonTcorr1 }
}
// console.log(MoonTcorrTable(27.5, 'Wuji').MoonTcorr1)
// console.log(MoonTcorrTable(27.5, 'Qintian').MoonTcorr1)
// console.log(MoonTcorrTable(27.5, 'Jiyuan').MoonTcorr1)

const MoonDifAccumTable = (AnomaAccum, CalName) => { // 暫時沒有用，就不處理欽天了
    const { AutoPara, Type } = Bind(CalName)
    const { Anoma, MoonAcrVList, Denom } = AutoPara[CalName]
    const Anoma25 = Anoma / 4
    const Anoma50 = Anoma / 2
    const Anoma75 = Anoma * 0.75
    AnomaAccum %= Anoma
    let AnomaAccumInt = ~~AnomaAccum
    let AnomaAccumFrac = AnomaAccum - AnomaAccumInt
    const AnomaAccumHalf = AnomaAccum % Anoma50
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumHalfFrac = AnomaAccumHalf - AnomaAccumHalfInt
    const AnomaAccumQuar = AnomaAccum % Anoma25
    const AnomaAccumQuarInt = ~~AnomaAccumQuar
    const AnomaAccumQuarFrac = AnomaAccumQuar - AnomaAccumQuarInt
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    // const MoonAvgV = parseFloat((MoonAvgVDeg * Denom).toPrecision(12))
    // 下月離表。麟德：盈加朒減，速減遲加
    const MoonAcrAvgDifList = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會爲實平行差。麟德爲增減率
    let MoonDifAccumList = []
    let MoonDegDenom = Denom
    if (Type >= 8 && CalName !== 'Chongxuan') {
        MoonDegDenom = 100
        if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    const MoonAcrVDeg = []
    for (let i = 0; i <= 27; i++) {
        MoonAcrVDeg[i] = MoonAcrVList[i] / MoonDegDenom
    }
    for (let i = 0; i <= 27; i++) {
        MoonAcrAvgDifList[i] = parseFloat((MoonAcrVDeg[i] - MoonAvgVDeg).toPrecision(7))
    }
    MoonDifAccumList = MoonAcrAvgDifList.slice() // 盈縮積
    for (let i = 1; i <= 27; i++) {
        MoonDifAccumList[i] += MoonDifAccumList[i - 1]
        MoonDifAccumList[i] = parseFloat((MoonDifAccumList[i]).toPrecision(7))
    }
    MoonDifAccumList = MoonDifAccumList.slice(-1).concat(MoonDifAccumList.slice(0, -1))
    MoonDifAccumList[0] = 0
    let Plus = 0
    if (CalName === 'Yitian') {
        AnomaAccumInt = AnomaAccumQuarInt
        AnomaAccumFrac = AnomaAccumQuarFrac
        if (AnomaAccum < Anoma25) {
        } else if (AnomaAccum < Anoma50) {
            Plus = 7
        } else if (AnomaAccum < Anoma75) {
            Plus = 14
        } else {
            Plus = 21
        }
    } else if (['Xuanming', 'Yingtian'].includes(CalName)) {
        AnomaAccumInt = AnomaAccumHalfInt
        AnomaAccumFrac = AnomaAccumHalfFrac
        if (AnomaAccum >= Anoma50) {
            Plus = 14
        }
    }
    let Initial = ''
    let MoonDifAccum2 = 0
    if (~~AnomaAccum <= 25) {
        Initial = MoonDifAccumList[Plus + AnomaAccumInt] + ',' + MoonDifAccumList[Plus + AnomaAccumInt + 1] + ',' + MoonDifAccumList[Plus + AnomaAccumInt + 2]
        MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 1, Initial)
    } else {
        Initial = MoonDifAccumList[Plus + AnomaAccumInt - 2] + ',' + MoonDifAccumList[Plus + AnomaAccumInt - 1] + ',' + MoonDifAccumList[Plus + AnomaAccumInt]
        MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 3, Initial)
    }
    // 以下是原本的算法
    // const AnomaAccumDay1 = AnomaAccumInt
    // const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    // const AnomaAccumDay2 = (AnomaAccumDay1 + 1) % 28 // 這沒加上最後一天的情況，以後得補上
    // const MoonAcrAvgDif1 = MoonAcrAvgDifList[AnomaAccumDay1]
    // const MoonAcrAvgDif2 = MoonAcrAvgDifList[AnomaAccumDay2]
    // const MoonDifAccumA = 0.5 * AnomaAccumFract * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + AnomaAccumFract * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - 0.5 * (AnomaAccumFract ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    // let MoonDifAccumB = 0
    // if (Type === 6) {
    //     MoonDifAccumB = 0.5 * (MoonDifAccumA / MoonAvgV) * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + (MoonDifAccumA / MoonAvgV) * (1 - AnomaAccumFract) * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - 0.5 * ((MoonDifAccumA / MoonAvgV) ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    // }
    // const MoonDifAccum2 = MoonDifAccum[AnomaAccumDay1] + MoonDifAccumA + MoonDifAccumB
    // const MoonDifAccum1 = MoonDifAccum[AnomaAccumDay1] + MoonAcrAvgDif1 * AnomaAccumFract
    return MoonDifAccum2
}
// console.log(MoonDifAccumTable(6.92, 'Tongtian'))

const MoonAcrSTable2 = (AnomaAccum, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Anoma, MoonAcrVList, Denom } = AutoPara[CalName]
    const Anoma25 = Anoma / 4
    const Anoma50 = Anoma / 2
    const Anoma75 = Anoma * 0.75
    AnomaAccum %= Anoma
    let AnomaAccumInt = ~~AnomaAccum
    let AnomaAccumFrac = AnomaAccum - AnomaAccumInt
    const AnomaAccumHalf = AnomaAccum % Anoma50
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumHalfFrac = AnomaAccumHalf - AnomaAccumHalfInt
    const AnomaAccumQuar = AnomaAccum % Anoma25
    const AnomaAccumQuarInt = ~~AnomaAccumQuar
    const AnomaAccumQuarFrac = AnomaAccumQuar - AnomaAccumQuarInt
    let MoonDegDenom = Denom
    if (CalName === 'Qintian' || Type >= 8) {
        MoonDegDenom = 100
        if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    const MoonAcrVDeg = []
    const num = CalName === 'Qintian' ? 248 : 27
    for (let i = 0; i <= num; i++) {
        MoonAcrVDeg[i] = MoonAcrVList[i] / MoonDegDenom
        MoonAcrVDeg[i] *= (CalName === 'Qintian' ? 1 / 9 : 1)
    }
    let MoonAcrSList = MoonAcrVDeg.slice()
    for (let i = 1; i <= num; i++) {
        MoonAcrSList[i] += MoonAcrSList[i - 1]
        MoonAcrSList[i] = +MoonAcrSList[i].toFixed(4)
    }
    MoonAcrSList = MoonAcrSList.slice(-1).concat(MoonAcrSList.slice(0, -1))
    MoonAcrSList[0] = 0
    let Plus = 0
    let MoonAcrS = 0
    if (CalName === 'Qintian') {
        const XianRange = Anoma / 248
        const XianNum = ~~(AnomaAccum / XianRange)
        const XianFrac = AnomaAccum / XianRange - XianNum // 占一限的百分比，而非一日。
        MoonAcrS = MoonAcrSList[XianNum] + XianFrac * (MoonAcrSList[XianNum + 1] - MoonAcrSList[XianNum])
    } else {
        if (CalName === 'Yitian') {
            AnomaAccumInt = AnomaAccumQuarInt
            AnomaAccumFrac = AnomaAccumQuarFrac
            if (AnomaAccum < Anoma25) {
            } else if (AnomaAccum < Anoma50) {
                Plus = 7
            } else if (AnomaAccum < Anoma75) {
                Plus = 14
            } else {
                Plus = 21
            }
        } else if (['Xuanming', 'Yingtian'].includes(CalName)) {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) {
                Plus = 14
            }
        }
        if (~~AnomaAccum <= num - 2) {
            const Initial = MoonAcrSList[Plus + AnomaAccumInt] + ',' + MoonAcrSList[Plus + AnomaAccumInt + 1] + ',' + MoonAcrSList[Plus + AnomaAccumInt + 2]
            MoonAcrS = Interpolate1(AnomaAccumFrac + 1, Initial)
        } else {
            const Initial = MoonAcrSList[Plus + AnomaAccumInt - 2] + ',' + MoonAcrSList[Plus + AnomaAccumInt - 1] + ',' + MoonAcrSList[Plus + AnomaAccumInt]
            MoonAcrS = Interpolate1(AnomaAccumFrac + 3, Initial)
        }
    }
    return MoonAcrS
}
// console.log(MoonAcrSTable2(27.5, 'Jiyuan'))
// console.log(MoonAcrSTable2(27.5, 'Qintian'))

const MoonFormula = (AnomaAccumRaw, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Anoma, DeltaMoon1, DeltaMoon2, DeltaMoon3, XianConst } = AutoPara[CalName]
    const Anoma50 = Anoma / 2 // 轉中
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    let MoonDifAccum = 0
    let MoonAcrV = 0
    let signB = 1
    if (Type === 11) {
        let signA = 1
        let T = 0
        if (AnomaAccumRaw <= Anoma / 4) {
            T = AnomaAccumRaw / XianConst
        } else if (AnomaAccumRaw <= Anoma / 2) {
            T = (Anoma50 - AnomaAccumRaw) / XianConst
        } else if (AnomaAccumRaw <= Anoma * 3 / 4) {
            T = (AnomaAccumRaw - Anoma50) / XianConst
            signA = -1
        } else {
            T = (Anoma - AnomaAccumRaw) / XianConst
            signA = -1
        }
        MoonDifAccum = signA * (DeltaMoon1 * T - DeltaMoon2 * T ** 2 - DeltaMoon3 * T ** 3) / 100 // 遲疾差
        let signB = 1
        let AnomaXian = 0
        if (AnomaAccumRaw <= 6.642) {
            AnomaXian = AnomaAccumRaw / XianConst
            signB = 1
        } else if (AnomaAccumRaw <= 7.052) {
            AnomaXian = AnomaAccumRaw / XianConst
            signB = 0
        } else if (AnomaAccumRaw <= 20.4193) {
            AnomaXian = Math.abs(Anoma50 - AnomaAccumRaw) / XianConst
            signB = -1
        } else if (AnomaAccumRaw <= 20.8293) {
            AnomaXian = Math.abs(Anoma50 - AnomaAccumRaw) / XianConst
            signB = 0
        } else {
            AnomaXian = (Anoma - AnomaAccumRaw) / XianConst
            signB = 1
        }
        MoonAcrV = 1.0962 + signB * (0.11081575 - 0.0005815 * AnomaXian - 0.00000975 * AnomaXian * (AnomaXian - 1)) // 遲疾限下行度
    } else {
        if (CalName === 'Mingtian') {
            // AnomaAccum = big.div(OriginAccum, Lunar).add(i - 1 + ZhengWinsolsDif).mul(2142887000).mod(AnomaNumer).floor().div(81120000).toNumber()
            // AnomaAccum[i] = (Math.floor(OriginAccum / Lunar + i - 1 + ZhengWinsolsDif) * 2142887000 % AnomaNumer) / 81120000
            const AnomaAccum = AnomaAccumRaw * MoonAvgVDeg
            let T = 0
            let sign3 = 1
            if (AnomaAccum <= 92.0927) {
                T = AnomaAccum
            } else if (AnomaAccum <= 184.1854) {
                T = 184.1854 - AnomaAccum
                sign3 = -1
            } else if (AnomaAccum <= 92.0927 * 3) {
                signB = -1
                sign3 = -1
                T = AnomaAccum - 184.1854
            } else {
                signB = -1
                T = 184.1854 * 2 - AnomaAccum
            }
            const tmp = signB * (T * (210.09 - T)) // 積數
            MoonDifAccum = tmp / 1976 // 遲疾差度 //+ T * (MoonAvgVDeg - Sidereal / Anoma) / MoonAvgVDeg // 《中國古代曆法》頁110莫名其妙說要加上後面這個，但不加纔跟其他曆相合
            // MoonTcorr2 = tmp / 0.67735 / Denom // 遲疾定差 13.36875*1976/0.67735=39000
            MoonAcrV = 13.36875 + sign3 * (1.27 - T / 72.5) // 原文739
        } else if (CalName === 'Futian') {
            let AnomaAccum = AnomaAccumRaw
            if (AnomaAccumRaw > Anoma / 2) {
                AnomaAccum -= Anoma / 2
                signB = -1
            }
            MoonDifAccum = signB * AnomaAccum * (Anoma / 2 - AnomaAccum) / 9.4
        }
    }
    const MoonAcrS = AnomaAccumRaw * MoonAvgVDeg + MoonDifAccum
    return { MoonDifAccum, MoonAcrV, MoonAcrS }
}
// console.log(MoonFormula(1, 'Mingtian').MoonTcorr2)

export const AutoTcorr = (AnomaAccum, WinsolsDifRaw, CalName, NodeAccum, year) => {
    const { AutoPara, Type } = Bind(CalName)
    const { SolarRaw, XianConst, Anoma, NodeDenom } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    const WinsolsDif = WinsolsDifRaw % Solar
    AnomaAccum %= Anoma
    let sunFunc = {}
    let moonFunc = {}
    let TcorrFunc = {}
    let SunTcorr2 = 0
    let SunTcorr1 = 0
    let MoonTcorr2 = 0
    let MoonTcorr1 = 0
    let Tcorr2 = 0 // 二次或三次內插
    let Tcorr1 = 0 // 線性內插
    let NodeTcorr = 0
    let NodeAccumCorrB = 0
    let SunDifAccum = 0
    let MoonDifAccum = 0
    let SunTcorr = 0 // 默認選項
    let MoonTcorr = 0
    let MoonAcrV = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(CalName)) {
        if (CalName === 'Huangchu') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Qianxiang').Tcorr1
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(CalName)) {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Jingchu').Tcorr1
        } else if (CalName === 'Xuanshi') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Tsrengguang').Tcorr1
        } else if (['Jiayin', 'Tianhe', 'Daxiang'].includes(CalName)) {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Tianbao').Tcorr1
        } else if (CalName === 'Kaihuang') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Yuanjia').Tcorr1
        } else if (CalName === 'Liangwu') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Daming').Tcorr1
        } else if (['Zhangmengbin', 'Liuxiaosun'].includes(CalName)) {
            Tcorr1 = AutoTcorr(AnomaAccum, WinsolsDif, 'Daye').Tcorr1
        } else {
            if (CalName === 'Shenlong') {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'LindeA')
            } else if (['Zhide', 'TaiyiKaiyuan'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Dayan')
            } else if (['TaiyiJingyou'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Chongtian')
            } else if (['Daming1', 'Daming2'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Jiyuan')
            } else if (['Yiwei', 'Gengwu'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Daming3')
            }
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
            SunTcorr2 = TcorrFunc.SunTcorr2
            SunTcorr1 = TcorrFunc.SunTcorr1
            MoonTcorr2 = TcorrFunc.MoonTcorr2
            MoonTcorr1 = TcorrFunc.MoonTcorr1
        }
    } else {
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
            SunTcorr1 = SunTcorrTable(WinsolsDif, CalName).SunTcorr1
            MoonTcorr1 = MoonTcorrTable1(AnomaAccum, CalName).MoonTcorr1
            Tcorr1 = SunTcorr1 + MoonTcorr1
            const HalfTermLeng = Solar / 24
            const TermNum = ~~(WinsolsDif / HalfTermLeng)
            if (CalName === 'Daye') {
                if (TermNum <= 4) {
                    NodeTcorr = Math.abs(WinsolsDif - HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 8) {
                    NodeTcorr = 63600 / NodeDenom
                } else if (TermNum <= 11) {
                    NodeTcorr = Math.abs(WinsolsDif - 11 * HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 16) {
                    NodeTcorr = -Math.abs(WinsolsDif - 13 * HalfTermLeng) * 900 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeTcorr = -55000 / NodeDenom
                } else {
                    NodeTcorr = -Math.abs(WinsolsDif - 23 * HalfTermLeng) * 1770 / NodeDenom
                }
            } else {
                if (TermNum >= 2 && TermNum <= 3) {
                    NodeTcorr = Math.abs(WinsolsDif - HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 7) {
                    NodeTcorr = 76100 / NodeDenom
                } else if (TermNum <= 10) {
                    NodeTcorr = 76100 / NodeDenom - Math.abs(WinsolsDif - 8 * HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 12) { } else if (TermNum <= 16) {
                    NodeTcorr = -Math.abs(WinsolsDif - 13 * HalfTermLeng) * 1200 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeTcorr = -95825 / NodeDenom
                } else {
                    NodeTcorr = -63300 / NodeDenom + Math.abs(WinsolsDif - 21 * HalfTermLeng) * 2110 / NodeDenom
                }
                if ((TermNum >= 2 && TermNum <= 3) || (TermNum === 9)) { // 後兩種修正與五星有關，暫時沒法加
                    if (NodeAccum <= 1 / 6) {
                        NodeTcorr /= 2
                    } else {
                        NodeTcorr = 0
                    }
                }
            }
        } else if (Type <= 4) {
            MoonTcorr1 = MoonTcorrTable1(AnomaAccum, CalName).MoonTcorr1
            Tcorr1 = MoonTcorr1
        } else if (['Yitian', 'Guantian'].includes(CalName)) {
            const MoonAvgVDeg = AutoMoonAvgV(CalName)
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            MoonTcorr1 = -(MoonTcorrTable(AnomaAccum, CalName).MoonTcorr1)
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr1
        } else if (['Futian', 'Mingtian'].includes(CalName)) {
            const MoonAvgVDeg = AutoMoonAvgV(CalName)
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            const MoonFunc = MoonFormula(AnomaAccum, CalName)
            MoonDifAccum = MoonFunc.MoonDifAccum
            MoonAcrV = MoonFunc.MoonAcrV
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            MoonTcorr2 = -MoonDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
        } else if (Type === 7 && CalName !== 'Qintian') {
            sunFunc = SunTcorrTable(WinsolsDif, CalName)
            moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            SunTcorr2 = sunFunc.SunTcorr2
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr2 + MoonTcorr1
        } else if (Type < 11) {
            sunFunc = SunTcorrTable(WinsolsDif, CalName)
            SunTcorr2 = sunFunc.SunTcorr2
            moonFunc = MoonTcorrTable(AnomaAccum + (CalName === 'Qintian' ? SunTcorr2 : 0), CalName)
            MoonTcorr1 = -moonFunc.MoonTcorr1
            Tcorr2 = SunTcorr2 + MoonTcorr1
        } else if (Type === 11) {
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            moonFunc = MoonFormula(AnomaAccum, CalName)
            MoonDifAccum = moonFunc.MoonDifAccum
            SunTcorr2 = SunDifAccum * XianConst / moonFunc.MoonAcrV
            MoonTcorr2 = -MoonDifAccum * XianConst / moonFunc.MoonAcrV
            Tcorr2 = SunTcorr2 + MoonTcorr2
        } else if (Type === 20) {
            sunFunc = SunAcrVWest(WinsolsDif, year)
            moonFunc = MoonAcrVWest(AnomaAccum, year)
            SunDifAccum = sunFunc.SunDifAccum
            MoonDifAccum = moonFunc.MoonDifAccum
            SunTcorr2 = SunDifAccum / (moonFunc.MoonAcrV - sunFunc.SunAcrV)
            MoonTcorr2 = -MoonDifAccum / (moonFunc.MoonAcrV - sunFunc.SunAcrV)
            Tcorr2 = SunTcorr2 + MoonTcorr2
        }
        if (SunTcorr2) {
            SunTcorr = SunTcorr2
        } else if (SunTcorr1) {
            SunTcorr = SunTcorr1
        }
        MoonTcorr = MoonTcorr2 || MoonTcorr1
        if (Type >= 5 && Type <= 10) {
            const portion = AutoNodePortion(CalName)
            NodeTcorr = SunTcorr + portion * MoonTcorr //  // 劉金沂《麟德曆交食計算法》。 const signNodeAccum = 1 // NodeAccumHalf > Node25 ? -1 : 1// 交前、先交。交後交在後，符號同定朔改正，交前，與定朔相反。 // 至少大衍的符號和定朔完全相同「⋯⋯以朓減朒加入交常」
            NodeAccumCorrB = portion * SunTcorr + MoonTcorr // 太陽入交定日，上面是月亮入交定日
        }
    }
    return {
        SunTcorr, SunTcorr2, SunTcorr1, MoonTcorr, MoonTcorr2, MoonTcorr1, MoonAcrV,
        Tcorr2, Tcorr1,
        NodeTcorr, NodeAccumCorrB,
    }
}
// console.log(AutoTcorr(6, 9, 'Qintian').MoonTcorr)

export const AutoDifAccum = (AnomaAccum, WinsolsDif, CalName, year) => {
    const { AutoPara, Type } = Bind(CalName)
    const { SolarRaw, Anoma } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    WinsolsDif %= Solar
    AnomaAccum %= Anoma
    let DifAccumFunc = {}
    let SunDifAccum = 0
    let MoonDifAccum = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(CalName)) {
        if (CalName === 'Huangchu') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Qianxiang').MoonDifAccum
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(CalName)) {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Jingchu').MoonDifAccum
        } else if (CalName === 'Xuanshi') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Tsrengguang').MoonDifAccum
        } else if (['Jiayin', 'Tianhe', 'Daxiang'].includes(CalName)) {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Tianbao').MoonDifAccum
        } else if (CalName === 'Kaihuang') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Yuanjia').MoonDifAccum
        } else if (CalName === 'Liangwu') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Liangwu').MoonDifAccum
        } else {
            if (['Zhangmengbin', 'Liuxiaosun'].includes(CalName)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Daye')
            } else if (CalName === 'Shenlong') {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'LindeA')
            } else if (CalName === 'Zhide') {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Dayan')
            } else if (['Daming1', 'Daming2'].includes(CalName)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Jiyuan')
            } else if (['Yiwei', 'Gengwu'].includes(CalName)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Daming3')
            }
            SunDifAccum = DifAccumFunc.SunDifAccum
            MoonDifAccum = DifAccumFunc.MoonDifAccum
        }
    } else {
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
            SunDifAccum = AutoTcorr(AnomaAccum, WinsolsDif, CalName).SunTcorr1 * AutoMoonAvgV(CalName)
            MoonDifAccum = MoonTcorrTable1(AnomaAccum, CalName).MoonDifAccum1
        } else if (Type <= 4) {
            MoonDifAccum = MoonTcorrTable1(AnomaAccum, CalName).MoonDifAccum1
        } else if (['Yitian', 'Guantian'].includes(CalName)) {
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            MoonDifAccum = MoonDifAccumTable(AnomaAccum, CalName)
        } else if (['Futian', 'Mingtian'].includes(CalName) || Type === 11) {
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            MoonDifAccum = MoonFormula(AnomaAccum, CalName).MoonDifAccum
        } else if (Type < 11) {
            SunDifAccum = SunDifAccumTable(WinsolsDif, CalName)
            MoonDifAccum = MoonDifAccumTable(AnomaAccum, CalName)
        } else if (Type === 20) {
            SunDifAccum = SunAcrVWest(WinsolsDif, year).SunDifAccum
            MoonDifAccum = MoonAcrVWest(AnomaAccum, year).MoonDifAccum
        }
    }
    return { SunDifAccum, MoonDifAccum }
}
// console.log(AutoDifAccum(9, 9, 'Shoushi', 1997).MoonDifAccum)

export const AutoMoonAcrS = (AnomaAccum, CalName) => {
    const { Type, AutoPara } = Bind(CalName)
    const { Anoma } = AutoPara[CalName]
    let MoonAcrS = 0
    let AnomaCycle = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(CalName)) {
        if (CalName === 'Huangchu') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Qianxiang')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Qianxiang')
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(CalName)) {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Jingchu')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Jingchu')
        } else if (CalName === 'Xuanshi') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Tsrengguang')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Tsrengguang')
        } else if (['Jiayin', 'Tianhe', 'Daxiang'].includes(CalName)) {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Tianbao')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Tianbao')
        } else if (CalName === 'Kaihuang') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Yuanjia')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Yuanjia')
        } else if (CalName === 'Liangwu') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Daming')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Daming')
        } else {
            if (['Zhangmengbin', 'Liuxiaosun'].includes(CalName)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Huangji')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Huangji')
            } else if (CalName === 'Shenlong') {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'LindeA')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'LindeA')
            } else if (CalName === 'Zhide') {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Dayan')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Dayan')
            } else if (['Daming1', 'Daming2'].includes(CalName)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Jiyuan')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Jiyuan')
            } else if (['Yiwei', 'Gengwu'].includes(CalName)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Daming3')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Daming3')
            }
        }
    } else {
        if (Type > 1 && Type < 5) {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, CalName)
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, CalName)
        } else {
            if (CalName === 'Mingtian') {
                MoonAcrS = MoonFormula(AnomaAccum, CalName).MoonAcrS
                AnomaCycle = 368.3708
            } else if (['Futian', 'Shoushi', 'Datong'].includes(CalName)) {
                MoonAcrS = MoonFormula(AnomaAccum, CalName).MoonAcrS
                AnomaCycle = MoonFormula(Anoma - 1e-13, CalName).MoonAcrS
            } else {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, CalName)
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, CalName)
            }
        }
    }
    // if (['Xuanming', 'Yingtian', 'Yitian'].includes(CalName)) {
    //     if (AnomaAccum > Anoma / 2) {
    //         MoonAcrS += AnomaCycle
    //     }
    //     AnomaCycle *= 2
    // }
    return { MoonAcrS, AnomaCycle }
}
// console.log(AutoMoonAcrS(23, 'Qianxiang').AnomaCycle)

