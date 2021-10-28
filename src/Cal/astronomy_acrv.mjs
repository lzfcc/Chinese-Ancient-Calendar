import Para from './para_calendars.mjs'
import { SunAcrVWest, MoonAcrVWest } from './astronomy_west.mjs'
import { Interpolate1, Interpolate3, Make2DPoints } from './equa_sn.mjs'
import { AutoMoonAvgV, AutoNodePortion, AutoQuar, AutoMoonTcorrDif } from './para_auto-constant.mjs'

// 大衍用不等間距二次內插，宣明也是。崇玄暫且用平氣。計算盈縮積
export const SunDifAccumTable = (WinsolsDif, CalName) => {
    const { Type, SunAcrAvgDifList, TermRangeA, TermRangeS, SolarRaw, AcrTermList } = Para[CalName]
    let { Denom, Solar } = Para[CalName]
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
    //  SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    // SunDifAccumList[0] = 0
    // SunDifAccumList[24] = 0
    SunDifAccumList = [0, ...SunDifAccumList]
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
        SunDifAccum2 = Interpolate3(WinsolsDif, Make2DPoints(AcrTermList, SunDifAccumList, TermNum)) // 直接用拉格朗日內插，懶得寫了
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
        SunDifAccum2 = Interpolate1(n + 1, [SunDifAccumList[TermNum1], SunDifAccumList[TermNum1 + 1], SunDifAccumList[TermNum1 + 2]])
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
    const { Type, Solar, SolarRaw, SunTcorrList, AcrTermList, TermRangeA, TermRangeS } = Para[CalName]
    let { Denom } = Para[CalName]
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
    let SunTcorr1 = 0, SunTcorr2 = 0 // , SunTcorr2a = 0
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        if (['WuyinA', 'WuyinB'].includes(CalName)) {
            Denom = 11830
        }
        SunTcorr1 = SunTcorrList[TermNum] + n * (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum])
        SunTcorr1 /= Denom
    } else {
        if (Type === 7 && CalName !== 'Qintian') { // 拉格朗日內插
            let TermNum = 0
            for (let j = 0; j <= 23; j++) {
                if (WinsolsDif >= AcrTermList[j] && WinsolsDif < AcrTermList[j + 1]) {
                    TermNum = j
                    break
                }
            }
            SunTcorr2 = Interpolate3(WinsolsDif, Make2DPoints(AcrTermList, SunTcorrList, TermNum))
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
            // 結果和用招差術完全相同，二分而至前後也沒問題
            // const Initial = [[SunTcorrList[TermNum] ,SunTcorrList[TermNum + 1] , SunTcorrList[TermNum + 2]]]
            // SunTcorr2a = Interpolate1(n + 1, Initial) / Denom
        }
        SunTcorr2 /= Denom
    }
    return { SunTcorr1, SunTcorr2 }
}
// console.log(SunTcorrTable(106, 'Chongtian'))

const SunDifAccumFormula = (WinsolsDif, CalName) => {
    const { Type, Denom, SolarRaw } = Para[CalName]
    let { Solar } = Para[CalName]
    Solar = Solar || SolarRaw
    let SunDifAccum = 0
    let sign = 1
    let Quadrant = 0
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const WinsolsDifHalf = WinsolsDif % Solar50
    const T = Solar25 - Math.abs(WinsolsDifHalf - Solar25)
    const { QuarA, QuarB } = AutoQuar(CalName, Type)
    if (Type === 11) {
        // 定平立三差精確值、曆取値。f(88.5)精確值2.40247，曆取値2.40127 f(45)精確值1.78437，曆取值1.78354
        // DeltaSunA1: 513.3822097763196114, // 513.32
        // DeltaSunA2: 2.4553858564920306, // 2.46
        // DeltaSunA3: 0.003142755330375, // 0.0031
        // DeltaSunB1: 487.1014493604209278, //  487.06 
        // DeltaSunB2: 2.2074819445045348, // 2.21 
        // DeltaSunB3: 0.0027262800048672, // 0.0027 
        // DeltaMoon1: 11.11,
        // DeltaMoon2: 0.0281,
        // DeltaMoon3: 0.000325,
        let sign = 1
        if (WinsolsDif >= Solar50) {
            sign = -1
        }
        if (WinsolsDif >= QuarA && WinsolsDif < Solar50 + QuarB) {
            SunDifAccum = 487.06 * T - 2.21 * T ** 2 - 0.0027 * T ** 3
        } else {
            SunDifAccum = 513.32 * T - 2.46 * T ** 2 - 0.0031 * T ** 3 // 盈縮差
        }
        SunDifAccum *= sign / 10000
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
    const { SolarRaw, Denom, SunTcorrList } = Para[CalName]
    let { Solar } = Para[CalName]
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
    const { MoonAcrVList, MoonDifAccumList, Anoma, ZhangRange } = Para[CalName]
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
    const { MoonDifAccumList, ZhangRange } = Para[CalName]
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
    const { Type, MoonTcorrList, Anoma, Denom } = Para[CalName]
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
        const PartRange = Anoma / 248
        const XianNum = ~~(AnomaAccum / PartRange)
        const XianFrac = AnomaAccum / PartRange - XianNum // 占一限的百分比，而非一日。
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
        if (CalName === 'Xuanming') {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) {
                Plus = 14
            }
            if (AnomaAccumInt <= 11) {
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, [MoonTcorrList[Plus + AnomaAccumInt], MoonTcorrList[Plus + AnomaAccumInt + 1], MoonTcorrList[Plus + AnomaAccumInt + 2]])
            } else {
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, [MoonTcorrList[Plus + AnomaAccumInt - 2], MoonTcorrList[Plus + AnomaAccumInt - 1], MoonTcorrList[Plus + AnomaAccumInt]])
            }
        } else {
            if (~~AnomaAccum <= 25) {
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, [MoonTcorrList[Plus + AnomaAccumInt], MoonTcorrList[Plus + AnomaAccumInt + 1], MoonTcorrList[Plus + AnomaAccumInt + 2]])
            } else {
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, [MoonTcorrList[Plus + AnomaAccumInt - 2], MoonTcorrList[Plus + AnomaAccumInt - 1], MoonTcorrList[Plus + AnomaAccumInt]])
            }
        }
    }
    MoonTcorr1 /= Denom
    MoonTcorr2 /= Denom
    return { MoonTcorr2, MoonTcorr1 }
}
// console.log(MoonTcorrTable(27.5, 'Wuji').MoonTcorr1)
// console.log(MoonTcorrTable(27.5, 'Qintian').MoonTcorr1)
// console.log(MoonTcorrTable(27.5, 'Jiyuan').MoonTcorr1)

const MoonDifAccumTable = (AnomaAccum, CalName) => { // 暫時沒有用，就不處理欽天了
    const { Type, Anoma, MoonAcrVList, Denom } = Para[CalName]
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
    if (CalName === 'Qintian' || Type >= 8) {
        MoonDegDenom = 100
        if (['Yingtian', 'Yitian'].includes(CalName)) {
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
    MoonDifAccumList = [0, ...MoonDifAccumList]
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
    let MoonDifAccum2 = 0
    if (~~AnomaAccum <= 25) {
        MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 1, [MoonDifAccumList[Plus + AnomaAccumInt], MoonDifAccumList[Plus + AnomaAccumInt + 1], MoonDifAccumList[Plus + AnomaAccumInt + 2]])
    } else {
        MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 3, [MoonDifAccumList[Plus + AnomaAccumInt - 2], MoonDifAccumList[Plus + AnomaAccumInt - 1], MoonDifAccumList[Plus + AnomaAccumInt]])
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
    const { Type, Anoma, MoonAcrVList, Denom } = Para[CalName]
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
        if (['Yingtian', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    const MoonAcrVDeg = []
    const num = CalName === 'Qintian' ? 248 : 27
    for (let i = 0; i <= num; i++) {
        MoonAcrVDeg[i] = MoonAcrVList[i] / MoonDegDenom
        MoonAcrVDeg[i] *= CalName === 'Qintian' ? 1 / 9 : 1
    }
    let MoonAcrSList = MoonAcrVDeg.slice()
    for (let i = 1; i <= num; i++) {
        MoonAcrSList[i] += MoonAcrSList[i - 1]
        MoonAcrSList[i] = +MoonAcrSList[i].toFixed(4)
    }
    MoonAcrSList = [0, ...MoonAcrSList]
    let Plus = 0
    let MoonAcrS = 0
    if (CalName === 'Qintian') {
        const PartRange = Anoma / 248
        const XianNum = ~~(AnomaAccum / PartRange)
        const XianFrac = AnomaAccum / PartRange - XianNum // 占一限的百分比，而非一日。
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
            MoonAcrS = Interpolate1(AnomaAccumFrac + 1, [MoonAcrSList[Plus + AnomaAccumInt], MoonAcrSList[Plus + AnomaAccumInt + 1], MoonAcrSList[Plus + AnomaAccumInt + 2]])
        } else {
            MoonAcrS = Interpolate1(AnomaAccumFrac + 3, [MoonAcrSList[Plus + AnomaAccumInt - 2], MoonAcrSList[Plus + AnomaAccumInt - 1], MoonAcrSList[Plus + AnomaAccumInt]])
        }
    }
    return MoonAcrS
}
// console.log(MoonAcrSTable2(27.5, 'Jiyuan'))
// console.log(MoonAcrSTable2(27.5, 'Qintian'))

export const MoonFormula = (AnomaAccumRaw, CalName) => {
    const { Type, Anoma, PartRange } = Para[CalName]
    const Anoma50 = Anoma / 2 // 轉中
    const Anoma25 = Anoma / 4
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const AnomaAccumRev = Anoma50 - Math.abs(AnomaAccumRaw - Anoma50)
    let MoonDifAccum = 0, MoonAcrV = 0
    let signB = 1
    if (Type === 11) {
        let signA = 1
        const T = (Anoma25 - Math.abs(AnomaAccumRaw % Anoma50 - Anoma25)) / PartRange
        if (AnomaAccumRaw >= Anoma50) {
            signA = -1
        }
        MoonDifAccum = signA * (11.11 * T - 0.0281 * T ** 2 - 0.000325 * T ** 3) / 100 // 遲疾差。三個常數是遲疾定平立三差
        const AnomaAccumPart = ~~(AnomaAccumRev * 336 / Anoma)
        const MoonAcrVListA = [1.2071, 1.2065, 1.2059, 1.2053, 1.2047, 1.2040, 1.2033, 1.2026, 1.2019, 1.2012, 1.2004, 1.1996, 1.1988, 1.1980, 1.1972, 1.1963, 1.1955, 1.1946, 1.1937, 1.1927, 1.1918, 1.1908, 1.1898, 1.1888, 1.1878, 1.1867, 1.1856, 1.1846, 1.1835, 1.1823, 1.1812, 1.1800, 1.1788, 1.1776, 1.1764, 1.1751, 1.1739, 1.1726, 1.1713, 1.1700, 1.1686, 1.1673, 1.1659, 1.1645, 1.1631, 1.1616, 1.1602, 1.1587, 1.1572, 1.1557, 1.1541, 1.1526, 1.1510, 1.1494, 1.1478, 1.1462, 1.1445, 1.1428, 1.1411, 1.1394, 1.1377, 1.1359, 1.1342, 1.1324, 1.1306, 1.1287, 1.1269, 1.1250, 1.1231, 1.1212, 1.1193, 1.1174, 1.1154, 1.1134, 1.1114, 1.1094, 1.1073, 1.1053, 1.1032, 1.1011, 1.0990, 1.0968, 1.0966, 1.0965, 1.0961, 1.0959, 1.0958, 1.0936, 1.0915, 1.0894, 1.0873, 1.0852, 1.0832, 1.0812, 1.0792, 1.0772, 1.0752, 1.0733, 1.0713, 1.0694, 1.0676, 1.0657, 1.0638, 1.0620, 1.0602, 1.0584, 1.0566, 1.0549, 1.0531, 1.0514, 1.0497, 1.0481, 1.0464, 1.0448, 1.0432, 1.0416, 1.0400, 1.0384, 1.0369, 1.0354, 1.0339, 1.0324, 1.0309, 1.0295, 1.0281, 1.0267, 1.0253, 1.0239, 1.0226, 1.0213, 1.0200, 1.0187, 1.0174, 1.0162, 1.0150, 1.0138, 1.0126, 1.0114, 1.0103, 1.0091, 1.0080, 1.0069, 1.0059, 1.0048, 1.0038, 1.0028, 1.0018, 1.0008, 0.9999, 0.9985, 0.9980, 0.9971, 0.9962, 0.9954, 0.9946, 0.9937, 0.9929, 0.9922, 0.9914, 0.9907, 0.9900, 0.9893, 0.9886, 0.9879, 0.9873, 0.9867, 0.9861, 0.9855]
        // const ad = [] // 沒找到什麼規律
        // for (let i = 0; i <= 167; i++) {
        //     ad[i] = +(MoonAcrVListA[i + 1] - MoonAcrVListA[i]).toFixed(4)
        // }
        MoonAcrV = MoonAcrVListA[AnomaAccumPart]
    } else {
        if (CalName === 'Mingtian') {
            // AnomaAccum = big.div(OriginAccum, Lunar).add(i - 1 + ZhengWinsolsDif).mul(2142887000).mod(AnomaNumer).floor().div(81120000).toNumber()
            // AnomaAccum[i] = (Math.floor(OriginAccum / Lunar + i - 1 + ZhengWinsolsDif) * 2142887000 % AnomaNumer) / 81120000
            const AnomaAccum = AnomaAccumRaw * MoonAvgVDeg
            const T = 92.0927 - Math.abs((AnomaAccumRaw % Anoma50) * MoonAvgVDeg - 92.0927)
            let sign3 = 1
            if (AnomaAccum <= 92.0927) {
            } else if (AnomaAccum <= 184.1854) {
                sign3 = -1
            } else if (AnomaAccum <= 92.0927 * 3) {
                signB = -1
                sign3 = -1
            } else {
                signB = -1
            }
            const tmp = signB * T * (210.09 - T) // 積數
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
// console.log(MoonFormula(12.903, 'Shoushi').MoonAcrV)

export const AutoTcorr = (AnomaAccum, WinsolsDifRaw, CalName, NodeAccum, year) => {
    const { Type, SolarRaw, PartRange, Anoma, NodeDenom } = Para[CalName]
    let { Solar } = Para[CalName]
    Solar = Solar || SolarRaw
    const WinsolsDif = WinsolsDifRaw % Solar
    AnomaAccum %= Anoma
    let sunFunc = {}, moonFunc = {}, TcorrFunc = {}
    let SunTcorr2 = 0, SunTcorr1 = 0, MoonTcorr2 = 0, MoonTcorr1 = 0, Tcorr2 = 0, Tcorr1 = 0, NodeAccumCorrA = 0, NodeAccumCorrB = 0, SunDifAccum = 0, MoonDifAccum = 0, SunTcorr = 0, MoonTcorr = 0, MoonAcrV = 0 // Tcorr2二次或三次內插
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Yisi', 'LindeB', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
            if (['Yisi', 'LindeB', 'Shenlong'].includes(CalName)) {
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
                    NodeAccumCorrA = Math.abs(WinsolsDif - HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 8) {
                    NodeAccumCorrA = 63600 / NodeDenom
                } else if (TermNum <= 11) {
                    NodeAccumCorrA = Math.abs(WinsolsDif - 11 * HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 16) {
                    NodeAccumCorrA = -Math.abs(WinsolsDif - 13 * HalfTermLeng) * 900 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeAccumCorrA = -55000 / NodeDenom
                } else {
                    NodeAccumCorrA = -Math.abs(WinsolsDif - 23 * HalfTermLeng) * 1770 / NodeDenom
                }
            } else {
                if (TermNum >= 2 && TermNum <= 3) {
                    NodeAccumCorrA = Math.abs(WinsolsDif - HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 7) {
                    NodeAccumCorrA = 76100 / NodeDenom
                } else if (TermNum <= 10) {
                    NodeAccumCorrA = 76100 / NodeDenom - Math.abs(WinsolsDif - 8 * HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 12) { } else if (TermNum <= 16) {
                    NodeAccumCorrA = -Math.abs(WinsolsDif - 13 * HalfTermLeng) * 1200 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeAccumCorrA = -95825 / NodeDenom
                } else {
                    NodeAccumCorrA = -63300 / NodeDenom + Math.abs(WinsolsDif - 21 * HalfTermLeng) * 2110 / NodeDenom
                }
                if ((TermNum >= 2 && TermNum <= 3) || (TermNum === 9)) { // 後兩種修正與五星有關，暫時沒法加
                    if (NodeAccum <= 1 / 6) {
                        NodeAccumCorrA /= 2
                    } else {
                        NodeAccumCorrA = 0
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
            MoonAcrV = moonFunc.MoonAcrV
            SunTcorr2 = SunDifAccum * PartRange / MoonAcrV
            MoonTcorr2 = -MoonDifAccum * PartRange / MoonAcrV
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
        SunTcorr = SunTcorr2 || (SunTcorr1 || 0)
        MoonTcorr = MoonTcorr2 || MoonTcorr1
        if (Type >= 5 && Type <= 10) {
            const Portion = AutoNodePortion(CalName)
            NodeAccumCorrA = SunTcorr + Portion * MoonTcorr //  // 劉金沂《麟德曆交食計算法》。 const signNodeAccum = 1 // NodeAccumHalf > Node25 ? -1 : 1// 交前、先交。交後交在後，符號同定朔改正，交前，與定朔相反。 // 至少大衍的符號和定朔完全相同「⋯⋯以朓減朒加入交常」
            NodeAccumCorrB = Portion * SunTcorr + MoonTcorr // 太陽入交定日，上面是月亮入交定日
        }
    }
    return {
        SunTcorr, SunTcorr2, SunTcorr1, MoonTcorr, MoonTcorr2, MoonTcorr1, MoonAcrV,
        Tcorr2, Tcorr1,
        NodeAccumCorrA, NodeAccumCorrB,
    }
}
// console.log(AutoTcorr(6, 9, 'Qintian').MoonTcorr)

export const AutoDifAccum = (AnomaAccum, WinsolsDif, CalName, year) => {
    const { Type, SolarRaw, Anoma } = Para[CalName]
    let { Solar } = Para[CalName]
    Solar = Solar || SolarRaw
    WinsolsDif %= Solar
    AnomaAccum %= Anoma
    let DifAccumFunc = {}
    let SunDifAccum = 0, MoonDifAccum = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Yisi', 'LindeB', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
            } else if (['Yisi', 'LindeB', 'Shenlong'].includes(CalName)) {
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
// console.log(AutoDifAccum(9, 9, 'Chongxuan').MoonDifAccum)

export const AutoMoonAcrS = (AnomaAccum, CalName) => {
    const { Type, Anoma } = Para[CalName]
    let MoonAcrS = 0, AnomaCycle = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Yisi', 'LindeB', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Daye')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Daye')
            } else if (['Yisi', 'LindeB', 'Shenlong'].includes(CalName)) {
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
            } else if (CalName === 'Futian' || Type === 11) {
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

