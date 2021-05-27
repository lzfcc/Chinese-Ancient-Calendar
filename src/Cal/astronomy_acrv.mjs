import { Bind } from './bind.mjs'
import { SunAcrVWest, MoonAcrVWest } from './astronomy_west.mjs'
import { Interpolate1, Interpolate3 } from './equa_sn.mjs'
import { AutoMoonAvgV, AutoMoonTcorrDif, AutoNodePortion } from './para_auto-constant.mjs'

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
    if (Type === 7) {
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
    let T = 0
    const Solar50 = Solar / 2
    if (Type === 11) {
        if (WinsolsDif <= 88.909225) {
            const T = WinsolsDif
            SunDifAccum = (DeltaSunA1 * T - DeltaSunA2 * (T ** 2) - DeltaSunA3 * (T ** 3)) / 10000 // 盈縮差
        } else if (WinsolsDif <= Solar50) {
            const T = Solar50 - WinsolsDif
            SunDifAccum = (DeltaSunB1 * T - DeltaSunB2 * (T ** 2) - DeltaSunB3 * (T ** 3)) / 10000
        } else if (WinsolsDif <= Solar50 + 93.712025) {
            const T = WinsolsDif - Solar50
            SunDifAccum = -(DeltaSunB1 * T - DeltaSunB2 * (T ** 2) - DeltaSunB3 * (T ** 3)) / 10000
        } else {
            const T = Solar - WinsolsDif
            SunDifAccum = -(DeltaSunA1 * T - DeltaSunA2 * (T ** 2) - DeltaSunA3 * (T ** 3)) / 10000
        }
    } else { // 王榮彬《中國古代曆法的中心差算式之造術原理》
        // const Solar50 = +((Solar / 2).toFixed(4))
        if (['Fengyuan', 'Guantian', 'Zhantian'].includes(CalName)) {
            let SunDenom = 0
            const QuadrantA = 88 + 10958 / 12030
            const QuadrantB = 93 + 8552 / 12030
            const SunDenomA = 3294
            const SunDenomB = 3659
            if (WinsolsDif <= QuadrantA) {
                Quadrant = QuadrantA
                SunDenom = SunDenomA
                T = WinsolsDif
            } else if (WinsolsDif <= Solar50) {
                Quadrant = QuadrantB
                SunDenom = SunDenomB
                T = Solar50 - WinsolsDif
            } else if (WinsolsDif <= Solar50 + QuadrantB) {
                Quadrant = QuadrantB
                SunDenom = SunDenomB
                sign = -1
                T = WinsolsDif - Solar50
            } else {
                Quadrant = QuadrantA
                SunDenom = SunDenomA
                sign = -1
                T = Solar - WinsolsDif
            }
            SunDifAccum = sign * (T / SunDenom) * (2 * Quadrant - T) // 盈縮差度分。極值2.37
        } else if (CalName === 'Mingtian') {
            if (WinsolsDif <= Solar / 4) {
                T = WinsolsDif
            } else if (WinsolsDif <= Solar50) {
                T = Solar50 - WinsolsDif
            } else if (WinsolsDif <= Solar * 0.75) {
                sign = -1
                T = WinsolsDif - Solar50
            } else {
                sign = -1
                T = Solar - WinsolsDif
            }
            SunDifAccum = sign * T * (200 - T) / 4135 // 盈縮差度分。極值2.4
            // SunTcorr = sign * T * (200 - T) * 400 / 567/Denom 按照月速13.36875算出來，和上面的算式沒有區別，很好
        } else if (CalName === 'Futian') {
            if (WinsolsDif > Solar50) {
                WinsolsDif -= Solar50
                sign = -1
            }
            SunDifAccum = sign * WinsolsDif * (Solar50 - WinsolsDif) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得爲立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000爲分母。
        } else if (CalName === 'Yitian') {
            const Delta = 24543 / Denom // 盈縮積 // 946785.5=897699.5+24543*2
            const QuadrantA = 897699.5 / Denom // 限分
            const QuadrantB = 946785.5 / Denom // 陳美東《崇玄儀天崇天三曆晷長計算法》改正該値
            Quadrant = QuadrantA
            T = WinsolsDif
            if (WinsolsDif <= QuadrantA) {
            } else if (WinsolsDif <= Solar50) {
                Quadrant = QuadrantB
                T = Solar50 - WinsolsDif
            } else if (WinsolsDif <= Solar50 + QuadrantB) {
                sign = -1
                Quadrant = QuadrantB
                T = WinsolsDif - Solar50
            } else {
                sign = -1
                T = Solar - WinsolsDif
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
    const { SolarRaw, Denom, AcrTermList, SunTcorrList } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    let SunTcorr = 0
    if (SunTcorrList) {
        const Solar50 = Solar / 2
        const Solar25 = Solar / 4
        const QuadrantA = Solar25
        const QuadrantB = Solar25
        // const QuadrantA = AcrTermList[6]
        // const QuadrantB = Solar50 - QuadrantA
        const Delta = SunTcorrList[6] / Denom
        let Quadrant = QuadrantA
        let T = WinsolsDif
        let sign = 1
        if (WinsolsDif <= QuadrantA) {
        } else if (WinsolsDif <= Solar50) {
            Quadrant = QuadrantB
            T = Solar50 - WinsolsDif
        } else if (WinsolsDif <= Solar50 + QuadrantB) {
            sign = -1
            Quadrant = QuadrantB
            T = WinsolsDif - Solar50
        } else {
            sign = -1
            T = Solar - WinsolsDif
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
    const { AutoPara } = Bind(CalName)
    const { MoonTcorrList, Anoma, Denom } = AutoPara[CalName]
    // const a = [] // 損益率
    // for (let i = 0; i <= 26; i++) {
    //     a[i] = -(MoonTcorrList[i + 1] - MoonTcorrList[i])
    // }
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
    const { MoonTcorrDifPos: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AnomaAccum, CalName)
    let Plus = 0
    let MoonTcorr1 = 0
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
    let Initial = ''
    let MoonTcorr2 = 0
    if (~~AnomaAccum <= 25) {
        Initial = MoonTcorrList[Plus + AnomaAccumInt] + ',' + MoonTcorrList[Plus + AnomaAccumInt + 1] + ',' + MoonTcorrList[Plus + AnomaAccumInt + 2]
        MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, Initial)
    } else {
        Initial = MoonTcorrList[Plus + AnomaAccumInt - 2] + ',' + MoonTcorrList[Plus + AnomaAccumInt - 1] + ',' + MoonTcorrList[Plus + AnomaAccumInt]
        MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, Initial)
    }
    MoonTcorr1 /= Denom
    MoonTcorr2 /= Denom
    return { MoonTcorr2, MoonTcorr1 }
}
// console.log(MoonTcorrTable(6.9, 'Yingtian'))
// console.log(MoonTcorrTable(27.1, 'Dayan'))

const MoonDifAccumTable = (AnomaAccum, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Anoma, MoonAcrV, Denom } = AutoPara[CalName]
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
        MoonAcrVDeg[i] = MoonAcrV[i] / MoonDegDenom
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
    const { Anoma, MoonAcrV, Denom } = AutoPara[CalName]
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
    if (Type >= 8 && CalName !== 'Chongxuan') {
        MoonDegDenom = 100
        if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    const MoonAcrVDeg = []
    for (let i = 0; i <= 27; i++) {
        MoonAcrVDeg[i] = MoonAcrV[i] / MoonDegDenom
    }
    const MoonAcrSList = MoonAcrVDeg.slice()
    for (let i = 1; i <= 27; i++) {
        MoonAcrSList[i] += MoonAcrSList[i - 1]
    }
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
    let MoonAcrS = 0
    if (~~AnomaAccum <= 25) {
        const Initial = MoonAcrSList[Plus + AnomaAccumInt] + ',' + MoonAcrSList[Plus + AnomaAccumInt + 1] + ',' + MoonAcrSList[Plus + AnomaAccumInt + 2]
        MoonAcrS = Interpolate1(AnomaAccumFrac + 1, Initial)
    } else {
        const Initial = MoonAcrSList[Plus + AnomaAccumInt - 2] + ',' + MoonAcrSList[Plus + AnomaAccumInt - 1] + ',' + MoonAcrSList[Plus + AnomaAccumInt]
        MoonAcrS = Interpolate1(AnomaAccumFrac + 3, Initial)
    }
    return MoonAcrS
}
// console.log(MoonAcrSTable2(0.1, 'Xuanming'))

const MoonFormula = (AnomaAccumRaw, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Anoma, DeltaMoon1, DeltaMoon2, DeltaMoon3, XianConst } = AutoPara[CalName]
    const Anoma50 = +((Anoma / 2).toFixed(6)) // 轉中
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    let MoonDifAccum = 0
    let MoonAcrV = 0
    let signB = 1
    if (Type === 11) {
        let signA = 1
        let FaslowT = 0
        if (AnomaAccumRaw <= Anoma / 4) {
            FaslowT = AnomaAccumRaw / XianConst
        } else if (AnomaAccumRaw <= Anoma / 2) {
            FaslowT = (Anoma50 - AnomaAccumRaw) / XianConst
        } else if (AnomaAccumRaw <= Anoma * 3 / 4) {
            FaslowT = (AnomaAccumRaw - Anoma50) / XianConst
            signA = -1
        } else {
            FaslowT = (Anoma - AnomaAccumRaw) / XianConst
            signA = -1
        }
        MoonDifAccum = signA * (DeltaMoon1 * FaslowT - DeltaMoon2 * FaslowT ** 2 - DeltaMoon3 * FaslowT ** 3) / 100 // 遲疾差
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
            // AnomaAccum %= 368.3708364275
            // 13.36875 是我算的轉法轉度母之比——後來看到現成的了
            let FaslowT = 0
            if (AnomaAccum <= 92.0927) {
                FaslowT = AnomaAccum
            } else if (AnomaAccum <= 184.1854) {
                FaslowT = 184.1854 - AnomaAccum
            } else if (AnomaAccum <= 92.0927 * 3) {
                signB = -1
                FaslowT = AnomaAccum - 184.1854
            } else {
                signB = -1
                FaslowT = 184.1854 * 2 - AnomaAccum
            }
            MoonDifAccum = signB * (FaslowT * (210.09 - FaslowT)) / 1976 // 遲疾差度//+ FaslowT * (MoonAvgVDeg - Sidereal / Anoma) / MoonAvgVDeg // 《中國古代曆法》頁110莫名其妙說要加上後面這個，但不加纔跟其他曆相合
            // MoonDifAccum = signB * (FaslowT * (210.09 - FaslowT)) * 10000 / 6773.5
            // MoonAcrVDeg = 13.36875 + signB * (1.27 - 10 * FaslowT / 729) // 藤豔輝《宋代朔閏⋯⋯》頁68            
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
// console.log(MoonFormula(23, 'Shoushi').MoonAcrS)

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
    let NodeAccumCorr = 0
    let NodeAccumCorr2 = 0
    let SunDifAccum = 0
    let MoonDifAccum = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Qintian', 'Zhidao1', 'Zhidao2', 'Qianxing', 'Fengyuan', 'Zhantian', 'Daming2', 'Chunyou', 'Huitian', 'Bentian', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
            } else if (CalName === 'Qintian') {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Tsrengyuan') // 欽天近地點入轉
            } else if (['Zhidao1', 'Zhidao2'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Qianyuan')
            } else if (['Qianxing', 'TaiyiJingyou'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Chongtian')
            } else if (['Fengyuan', 'Zhantian'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Guantian')
            } else if (['Daming1', 'Daming2'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Jiyuan')
            } else if (['Chunyou', 'Huitian', 'Bentian'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Chengtian')
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
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
            SunTcorr1 = SunTcorrTable(WinsolsDif, CalName).SunTcorr1
            MoonTcorr1 = MoonTcorrTable1(AnomaAccum, CalName).MoonTcorr1
            Tcorr1 = SunTcorr1 + MoonTcorr1
            const HalfTermLeng = Solar / 24
            const TermNum = ~~(WinsolsDif / HalfTermLeng)
            if (CalName === 'Daye') {
                if (TermNum <= 4) {
                    NodeAccumCorr = Math.abs(WinsolsDif - HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 8) {
                    NodeAccumCorr = 63600 / NodeDenom
                } else if (TermNum <= 11) {
                    NodeAccumCorr = Math.abs(WinsolsDif - 11 * HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 16) {
                    NodeAccumCorr = -Math.abs(WinsolsDif - 13 * HalfTermLeng) * 900 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeAccumCorr = -55000 / NodeDenom
                } else {
                    NodeAccumCorr = -Math.abs(WinsolsDif - 23 * HalfTermLeng) * 1770 / NodeDenom
                }
            } else {
                if (TermNum >= 2 && TermNum <= 3) {
                    NodeAccumCorr = Math.abs(WinsolsDif - HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 7) {
                    NodeAccumCorr = 76100 / NodeDenom
                } else if (TermNum <= 10) {
                    NodeAccumCorr = 76100 / NodeDenom - Math.abs(WinsolsDif - 8 * HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 12) { } else if (TermNum <= 16) {
                    NodeAccumCorr = -Math.abs(WinsolsDif - 13 * HalfTermLeng) * 1200 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeAccumCorr = -95825 / NodeDenom
                } else {
                    NodeAccumCorr = -63300 / NodeDenom + Math.abs(WinsolsDif - 21 * HalfTermLeng) * 2110 / NodeDenom
                }
                if ((TermNum >= 2 && TermNum <= 3) || (TermNum === 9)) { // 後兩種修正與五星有關，暫時沒法加
                    if (NodeAccum <= 1 / 6) {
                        NodeAccumCorr /= 2
                    } else {
                        NodeAccumCorr = 0
                    }
                }
            }
        } else if (Type <= 4) {
            MoonTcorr1 = MoonTcorrTable1(AnomaAccum, CalName).MoonTcorr1
            Tcorr1 = MoonTcorr1
        } else if (['Yitian', 'Guantian', 'Zhantian'].includes(CalName)) {
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            const moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr2 + MoonTcorr1
        } else if (['Futian', 'Mingtian'].includes(CalName)) {
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            MoonDifAccum = MoonFormula(AnomaAccum, CalName).MoonDifAccum
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            MoonTcorr2 = -MoonDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
        } else if (Type < 11) {
            sunFunc = SunTcorrTable(WinsolsDif, CalName)
            moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            SunTcorr2 = sunFunc.SunTcorr2
            // SunTcorr1 = sunFunc.SunTcorr1
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            Tcorr2 = SunTcorr2 + MoonTcorr2
            // Tcorr1 = SunTcorr1 + MoonTcorr1
            Tcorr1 = SunTcorr2 + MoonTcorr1
        } else if (Type === 11) {
            SunDifAccum = SunDifAccumFormula(WinsolsDif, CalName)
            moonFunc = MoonFormula(AnomaAccum, CalName)
            MoonDifAccum = moonFunc.MoonDifAccum
            SunTcorr2 = SunDifAccum * XianConst / moonFunc.MoonAcrV
            MoonTcorr2 = -MoonDifAccum * XianConst / moonFunc.MoonAcrV
            Tcorr2 = SunTcorr2 + MoonTcorr2
            NodeAccumCorr = Tcorr2
        } else if (Type === 20) {
            sunFunc = SunAcrVWest(WinsolsDif, year)
            moonFunc = MoonAcrVWest(AnomaAccum, year)
            SunDifAccum = sunFunc.SunDifAccum
            MoonDifAccum = moonFunc.MoonDifAccum
            SunTcorr2 = SunDifAccum / (moonFunc.MoonAcrV - sunFunc.SunAcrV)
            MoonTcorr2 = -MoonDifAccum / (moonFunc.MoonAcrV - sunFunc.SunAcrV)
            Tcorr2 = SunTcorr2 + MoonTcorr2
        }
        if (Type >= 5 && Type <= 10) { // 其他曆法都是這樣，不懂授時爲何就是定朔加減差
            const portion = AutoNodePortion(CalName)
            NodeAccumCorr = SunTcorr2 + portion * MoonTcorr2 //  // 劉金沂《麟德曆交食計算法》。  // 定交分=泛交分+太陽改正+(61/777)*月亮改正。61/777是27.2122/346.62的漸進分數！恆星月日數/恆星年日數= s/m ，交率（卽交點月）/交數（卽交點年日數）= (s-n)/(m-n)=27.2122/346.608=1/12.737=0.0785 皇極 465/5923，麟德61/777，大衍343/4369，崇天141/1796，都是0.0785。const signNodeAccum = 1 // NodeAccumHalf > Node25 ? -1 : 1// 交前、先交。交後交在後，符號同定朔改正，交前，與定朔相反。
            // 至少大衍的符號和定朔完全相同「⋯⋯以朓減朒加入交常」
            NodeAccumCorr2 = portion * SunTcorr2 + MoonTcorr2 // 太陽入交定日，上面是月亮入交定日
        }
    }
    let SunTcorr = 0 // 默認選項
    let MoonTcorr = 0
    if (SunTcorr2) {
        SunTcorr = SunTcorr2
    } else if (SunTcorr1) {
        SunTcorr = SunTcorr1
    }
    if (MoonTcorr2) {
        MoonTcorr = MoonTcorr2
    } else if (MoonTcorr1) {
        MoonTcorr = MoonTcorr1
    }
    return {
        SunTcorr, MoonTcorr, SunTcorr2, SunTcorr1, MoonTcorr2, MoonTcorr1, Tcorr2, Tcorr1,
        NodeAccumCorr, NodeAccumCorr2,
    }
}
// console.log(AutoTcorr(6, 9, 'Qiandao', 1997).MoonTcorr2)

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
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Qintian', 'Fengyuan', 'Zhantian', 'Daming2', 'Chunyou', 'Huitian', 'Bentian', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
            } else if (CalName === 'Qintian') {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Tsrengyuan') // 欽天近地點入轉
            } else if (['Fengyuan', 'Zhantian'].includes(CalName)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Guantian')
            } else if (['Daming1', 'Daming2'].includes(CalName)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Jiyuan')
            } else if (['Chunyou', 'Huitian', 'Bentian'].includes(CalName)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDif, 'Chengtian')
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
    return {
        SunDifAccum,
        MoonDifAccum,
    }
}
// console.log(AutoDifAccum(9, 9, 'Shoushi', 1997).MoonDifAccum)

export const AutoMoonAcrS = (AnomaAccum, CalName) => {
    const { Type, AutoPara } = Bind(CalName)
    const { Anoma } = AutoPara[CalName]
    let MoonAcrS = 0
    let AnomaCycle = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Qintian', 'Fengyuan', 'Zhantian', 'Daming2', 'Chunyou', 'Huitian', 'Bentian', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
            } else if (CalName === 'Qintian') {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Tsrengyuan')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Tsrengyuan')
            } else if (['Fengyuan', 'Zhantian'].includes(CalName)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Guantian')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Guantian')
            } else if (['Daming1', 'Daming2'].includes(CalName)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Jiyuan')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Jiyuan')
            } else if (['Chunyou', 'Huitian', 'Bentian'].includes(CalName)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Chengtian')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Chengtian')
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
            if (['Futian', 'Mingtian', 'Shoushi', 'Datong'].includes(CalName)) {
                MoonAcrS = MoonFormula(AnomaAccum, CalName).MoonAcrS
                AnomaCycle = MoonFormula(Anoma - 1e-13, CalName).MoonAcrS
            } else {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, CalName)
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, CalName)
            }
        }
    }
    if (['Xuanming', 'Yingtian', 'Yitian'].includes(CalName)) {
        if (AnomaAccum > Anoma / 2) {
            MoonAcrS += AnomaCycle
        }
        AnomaCycle *= 2
    }
    return { MoonAcrS, AnomaCycle }
}
// console.log(AutoMoonAcrS(23, 'Qianxiang').AnomaCycle)

// export const AutoSunInterpolate = (n, CalName, S1, S2, S3) => {
//     const { AutoPara, Type } = Bind(CalName)
//     const { Solar, SolarRaw, SunTcorrList, TermRangeA, TermRangeS } = AutoPara[CalName]
//     let D1, D2 = 0
//     if (S1) {
//         D1 = S2 - S1
//     }
//     else {
//         D1 = 1
//         D2 = 1
//     }

//     let Result = 0
//     if (CalName === 'Huangji') {
//         Result = SunInterpolateA(n)
//     } else if (['LindeA', 'LindeB'].includes(CalName)) {
//         Result = SunInterpolateB(n)
//     } else if (CalName === 'Chongxuan') {
//         Result = SunInterpolateC(n)
//     } else if (['Yingtian', 'Qianyuan'].includes(CalName)) {
//         Result = SunInterpolateD(n)
//     } else {
//         Result = SunInterpolateE(n)
//     }
//     return Result
// }