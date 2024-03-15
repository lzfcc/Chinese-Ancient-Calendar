import Para from './para_calendars.mjs'
import { Interpolate1, Interpolate3, Make2DPoints, MeasureSols } from './equa_sn.mjs'
import { AutoMoonAvgV, AutoNodePortion, AutoQuar, AutoMoonTcorrDif } from './para_auto-constant.mjs'
import { deci } from './para_constant.mjs'

// 大衍用不等間距二次內插，宣明也是。崇玄暫且用平氣。計算盈縮積
export const SunDifAccumTable = (Sd, Name) => {
    const { Type, SunAcrAvgDifList, TermRangeA, TermRangeS, SolarRaw, AcrTermList } = Para[Name]
    const { Denom, Solar } = Para[Name]
    const S = Solar || SolarRaw
    let SunDenom = Denom
    if (Name === 'Qintian' || Type >= 8 && Name !== 'Qianyuan') SunDenom = 10000 // 崇玄欽天也是萬分母
    const HalfTermLeng = S / 24
    const SunAcrAvgDifListList = [] // 這個多此一舉的SunAcrAvgDifListList一定不能刪掉，否則多次運算就會越來越小
    for (let i = 0; i <= 23; i++) {
        SunAcrAvgDifListList[i] = SunAcrAvgDifList[i] / SunDenom
    }
    let SunDifAccumList = SunAcrAvgDifListList.slice()
    for (let i = 1; i <= 23; i++) {
        SunDifAccumList[i] += SunDifAccumList[i - 1]
        SunDifAccumList[i] = +(SunDifAccumList[i].toFixed(8))
    }
    //  SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    // SunDifAccumList[0] = 0
    // SunDifAccumList[24] = 0
    SunDifAccumList = [0, ...SunDifAccumList]
    SunDifAccumList[25] = SunDifAccumList[1]
    let SunDifAccum2 = 0
    if (Type === 7 && Name !== 'Qintian') {
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (Sd >= AcrTermList[j] && Sd < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        SunDifAccum2 = Interpolate3(Sd, Make2DPoints(AcrTermList, SunDifAccumList, TermNum)) // 直接用拉格朗日內插，懶得寫了
    } else {
        let TermRange = 0
        const TermNum1 = ~~(Sd / HalfTermLeng)  // 朔望所在氣名
        // const TermNum2 = (TermNum1 + 1) % 24
        // const TermNewmDif = Sd - TermNum1 * HalfTermLeng // 注意要減1。朔望入氣日數
        if (['Linde', 'LindeB', 'Huangji', 'Shenlong'].includes(Name)) {
            if ((Sd < 6 * HalfTermLeng) || (Sd >= 18 * HalfTermLeng)) TermRange = TermRangeA // 秋分後
            else TermRange = TermRangeS // 春分後
        } else TermRange = HalfTermLeng - SunAcrAvgDifListList[TermNum1] / SunDenom
        // 招差術和精確公式算出來結果一樣
        const n = (Sd - TermNum1 * HalfTermLeng) / TermRange
        SunDifAccum2 = Interpolate1(n + 1, [SunDifAccumList[TermNum1], SunDifAccumList[TermNum1 + 1], SunDifAccumList[TermNum1 + 2]])
        // const SunAcrAvgDif1 = SunAcrAvgDifListList[TermNum1]
        // const SunAcrAvgDif2 = SunAcrAvgDifListList[TermNum2]
        // SunDifAccum2 = SunDifAccumList[TermNum1] + .5 * (TermNewmDif / TermRange) * (SunAcrAvgDif1 + SunAcrAvgDif2) + (TermNewmDif / TermRange) * (SunAcrAvgDif1 - SunAcrAvgDif2) - .5 * ((TermNewmDif / TermRange) ** 2) * (SunAcrAvgDif1 - SunAcrAvgDif2)
    }
    // S =365 + 2366 / 9740
    // const AcrTermList = [] // 定氣距冬至日數
    // for (let i = 0; i <= 23; i++) {
    //     AcrTermList[i] = +(HalfTermLeng * i - SunDifAccumList[i]).toFixed(6)
    // }
    // AcrTermList[0] = 0
    // AcrTermList[24] = +S.toFixed(6)
    // AcrTermList[25] = +(AcrTermList[1] + S).toFixed(6)
    return SunDifAccum2
}
// console.log(SunDifAccumTable(9.25, 'Chongtian'))

// 計算朓朒積
const SunTcorrTable = (Sd, Name) => {
    const { Type, Solar, SolarRaw, SunTcorrList, AcrTermList, TermRangeA, TermRangeS } = Para[Name]
    let { Denom } = Para[Name]
    let HalfTermLeng = (Solar || SolarRaw) / 24
    const TermNum = ~~(Sd / HalfTermLeng)
    let TermRange = HalfTermLeng
    if (['Huangji', 'Linde', 'LindeB',].includes(Name)) {
        if ((Sd < 6 * HalfTermLeng) || (Sd >= 18 * HalfTermLeng)) TermRange = TermRangeA // 秋分後
        else TermRange = TermRangeS // 春分後
    }
    const t = Sd - TermNum * HalfTermLeng
    const n = t / TermRange
    let SunTcorr1 = 0, SunTcorr2 = 0 // , SunTcorr2a = 0
    if (['Daye', 'Wuyin', 'WuyinB'].includes(Name)) {
        if (['Wuyin', 'WuyinB'].includes(Name)) Denom = 11830
        SunTcorr1 = SunTcorrList[TermNum] + n * (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum])
        SunTcorr1 /= Denom
    } else {
        if (Type === 7 && Name !== 'Qintian') { // 拉格朗日內插
            let TermNum = 0
            for (let j = 0; j <= 23; j++) {
                if (Sd >= AcrTermList[j] && Sd < AcrTermList[j + 1]) {
                    TermNum = j
                    break
                }
            }
            SunTcorr2 = Interpolate3(Sd, Make2DPoints(AcrTermList, SunTcorrList, TermNum))
            TermRange = AcrTermList[TermNum + 1] - AcrTermList[TermNum] // 本氣長度
            SunTcorr1 = SunTcorrList[TermNum] + (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum]) * (Sd - AcrTermList[TermNum]) / TermRange
        } else {
            const D1 = SunTcorrList[TermNum + 1] - SunTcorrList[TermNum]
            const D2 = SunTcorrList[TermNum + 2] - SunTcorrList[TermNum + 1]
            const D = (D1 - D2) / TermRange ** 2 // 日差
            let Plus = D / 2
            if (['Linde', 'LindeB', 'Yingtian', 'Qianyuan'].includes(Name)) Plus = 0 // 這三曆初日沒有減半日差，不精確
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

const SunDifAccumFormula = (Sd, Name) => {
    const { Type, Denom, SolarRaw } = Para[Name]
    let { Solar } = Para[Name]
    Solar = Solar || SolarRaw
    let SunDifAccum = 0
    let sign = 1
    let Quadrant = 0
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const SdHalf = Sd % Solar50
    const T = Solar25 - Math.abs(SdHalf - Solar25)
    const { QuarA, QuarB } = AutoQuar(Name, Type)
    if (Type === 11) {
        // 定平立三差精確值、曆取値。f(88.5)精確值2.40247，曆取値2.40127 f(45)精確值1.78437，曆取值1.78354
        // DeltaSunA1: 513.3822097763196114, // 513.32
        // DeltaSunA2: 2.4553858564920306, // 2.46
        // DeltaSunA3: .003142755330375, // .0031
        // DeltaSunB1: 487.1014493604209278, //  487.06 
        // DeltaSunB2: 2.2074819445045348, // 2.21 
        // DeltaSunB3: .0027262800048672, // .0027 
        // DeltaMoon1: 11.11,
        // DeltaMoon2: .0281,
        // DeltaMoon3: .000325,
        let sign = 1
        if (Sd >= Solar50) sign = -1
        if (Sd >= QuarA && Sd < Solar50 + QuarB) {
            SunDifAccum = 487.06 * T - 2.21 * T ** 2 - .0027 * T ** 3 // 極值2.401
        } else {
            SunDifAccum = 513.32 * T - 2.46 * T ** 2 - .0031 * T ** 3 // 盈縮差
        }
        SunDifAccum *= sign / 10000
    } else { // 王榮彬《中國古代曆法的中心差算式之造術原理》
        if (Name === 'Guantian') {
            let SunDenom = 0
            const SunDenomA = 3294
            const SunDenomB = 3659
            if (Sd <= QuarA) {
                Quadrant = QuarA
                SunDenom = SunDenomA
            } else if (Sd <= Solar50) {
                Quadrant = QuarB
                SunDenom = SunDenomB
            } else if (Sd <= Solar50 + QuarB) {
                Quadrant = QuarB
                SunDenom = SunDenomB
                sign = -1
            } else {
                Quadrant = QuarA
                SunDenom = SunDenomA
                sign = -1
            }
            SunDifAccum = sign * (T / SunDenom) * (2 * Quadrant - T) // 盈縮差度分。極值2.37
        } else if (Name === 'Mingtian') {
            if (Sd > Solar50) sign = -1
            SunDifAccum = sign * T * (200 - T) / 4135 // 盈縮差度分。極值2.4
            // SunTcorr = sign * T * (200 - T) * 400 / 567/Denom 按照月速13.36875算出來，和上面的算式沒有區別，很好
        } else if (Name === 'Futian') {
            if (Sd > Solar50) sign = -1
            SunDifAccum = sign * SdHalf * (Solar50 - SdHalf) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得爲立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000爲分母。
        } else if (Name === 'Yitian') {
            const Delta = 24543 / Denom // 盈縮積 // 946785.5=897699.5+24543*2 .儀天極値2.43
            Quadrant = QuarA
            if (Sd <= QuarA) {
            } else if (Sd <= Solar50) Quadrant = QuarB
            else if (Sd <= Solar50 + QuarB) {
                sign = -1
                Quadrant = QuarB
            } else sign = -1
            // const E = 2 * Delta / Quadrant // 初末限平率=2限率分=2盈縮積/限日
            // const F = E / Quadrant // 日差=限差/限日=2限率分/限日，限率分=盈縮積/限日
            //初末定率= 2*2.43/Quadrant-日差/2
            // SunDifAccum = sign * (T * (E - F / 2) - T * (T - 1) * F / 2) // 盈縮定分、先後數
            SunDifAccum = sign * ((T * Delta / Quadrant ** 2) * (2 * Quadrant - T))
        }
    }
    return SunDifAccum
}
// console.log(SunDifAccumFormula(88.88, 'Jiyuan'))

const SunTcorrFormula = (Sd, Name) => { // 一定程度上適用於崇玄以後
    const { SolarRaw, Denom, SunTcorrList } = Para[Name]
    let { Solar } = Para[Name]
    Solar = Solar || SolarRaw
    let SunTcorr = 0
    if (SunTcorrList) {
        const Solar50 = Solar / 2
        const Solar25 = Solar / 4
        const QuarA = Solar25
        const QuarB = Solar25
        const Delta = SunTcorrList[6] / Denom
        let Quadrant = QuarA
        const SdHalf = Sd % Solar50
        const T = Solar25 - Math.abs(SdHalf - Solar25)
        let sign = 1
        if (Sd <= QuarA) {
        } else if (Sd <= Solar50) Quadrant = QuarB
        else if (Sd <= Solar50 + QuarB) {
            sign = -1
            Quadrant = QuarB
        } else sign = -1
        let Plus = 0
        if (['Linde', 'LindeB', 'Yingtian', 'Qianyuan'].includes(Name)) Plus = 1 // 這幾部初定率沒有考慮半日差Delta/Quadrant**2，最後合併同類項多了一個1
        SunTcorr = sign * ((Delta * T / Quadrant ** 2) * (2 * Quadrant - T + Plus))
    }
    return SunTcorr * Denom
}
// console.log(SunTcorrFormula(31.9780521262, 'Jiyuan'))

// 這是魏晉南北朝的月離表
const MoonTcorrTable1 = (AnomaAccum, Name) => {
    const { MoonAcrVList, MoonDifAccumList, Anoma, ZhangRange } = Para[Name]
    AnomaAccum %= Anoma
    // const MoonAcrVList = MoonAcrVRaw.slice()
    // if (['Tsrengguang', 'Xinghe', 'Tianbao', 'Daming',].includes(Name)) {
    //     for (let i = 0; i <= 28; i++) {
    //         MoonAcrVList[i] = (MoonAcrVList[i] * ZhangRange)
    //     }
    // }    
    // const MoonAcrAvgDifList = [] // 損益率
    // for (let i = 0; i <= 27; i++) {
    //     MoonAcrAvgDifList[i] = MoonAcrVList[i] - MoonAvgVddenom
    // }
    // let MoonDifAccumList = MoonAcrAvgDifList.slice() // 先錄入實行速，用這個轉換成盈縮積
    // for (let i = 1; i <= 28; i++) {
    //     MoonDifAccumList[i] += MoonDifAccumList[i - 1]
    //     MoonDifAccumList[i] = parseFloat((MoonDifAccumList[i]).toPrecision(12))
    // }
    // MoonDifAccumList = MoonDifAccumList.slice(-1).concat(MoonDifAccumList.slice(0, -1))
    // MoonDifAccumList[0] = 0
    const MoonAvgVd = AutoMoonAvgV(Name)
    const MoonAvgVddenom = parseFloat((MoonAvgVd * ZhangRange).toPrecision(12)) // 乾象254=章歲+章月
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    let MoonDifAccum1 = MoonDifAccumList[AnomaAccumInt] + AnomaAccumFract * (MoonDifAccumList[AnomaAccumInt + 1] - MoonDifAccumList[AnomaAccumInt]) //* MoonAcrAvgDifList[AnomaAccumInt]
    const SunAvgV = ZhangRange
    let MoonTcorr1 = 0
    if (['Qianxiang', 'Jingchu', 'Daming', 'Daye', 'Wuyin', 'WuyinB'].includes(Name)) {
        MoonTcorr1 = -MoonDifAccum1 / (MoonAcrVList[~~AnomaAccum] - SunAvgV)
    } else if (['Yuanjia'].includes(Name)) { // 「賓等依何承天法」
        const MoonAcrDayDif = [] // 列差
        for (let i = 0; i <= 27; i++) {
            MoonAcrDayDif[i] = MoonAcrVList[i + 1] - MoonAcrVList[i]
        }
        const MoonAcrV1 = MoonAcrVList[AnomaAccumInt] + AnomaAccumFract * MoonAcrDayDif[AnomaAccumInt]
        MoonTcorr1 = -MoonDifAccum1 / (MoonAcrV1 - SunAvgV)
    } else if (['Tsrengguang', 'Xinghe', 'Tianbao'].includes(Name)) {
        MoonTcorr1 = -MoonDifAccum1 / MoonAvgVddenom
    }
    MoonDifAccum1 /= ZhangRange
    return { MoonDifAccum1, MoonTcorr1 }
}
// console.log(MoonTcorrTable1(14, 'Jingchu').MoonDifAccum1)

const MoonAcrSTable1 = (AnomaAccum, Name) => {
    const { MoonDifAccumList, ZhangRange } = Para[Name]
    const MoonAvgVd = AutoMoonAvgV(Name)
    const MoonAvgVddenom = parseFloat((MoonAvgVd * ZhangRange).toPrecision(12))
    const MoonAcrSList = []
    for (let i = 0; i <= 28; i++) {
        MoonAcrSList[i] = parseFloat((MoonDifAccumList[i] + i * MoonAvgVddenom).toPrecision(12))
    }
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    const MoonAcrS = (MoonAcrSList[AnomaAccumInt] + AnomaAccumFract * (MoonAcrSList[AnomaAccumInt + 1] - MoonAcrSList[AnomaAccumInt])) / ZhangRange
    return MoonAcrS
}
// console.log(MoonAcrSTable1(.1, 'Daming'))

const MoonTcorrTable = (AnomaAccum, Name) => {
    const { Type, MoonTcorrList, Anoma, Denom } = Para[Name]
    const Anoma25 = Anoma / 4
    const Anoma50 = Anoma / 2
    const Anoma75 = Anoma * .75
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
    if (Name === 'Qintian') {
        const PartRange = Anoma / 248
        const XianNum = ~~(AnomaAccum / PartRange)
        const XianFrac = AnomaAccum / PartRange - XianNum // 占一限的百分比，而非一日。
        MoonTcorr1 = MoonTcorrList[XianNum] + XianFrac * (MoonTcorrList[XianNum + 1] - MoonTcorrList[XianNum])
    } else {
        const { MoonTcorrDifPos: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AnomaAccum, Name)
        if (Name === 'Yitian') {
            AnomaAccumInt = AnomaAccumQuarInt
            AnomaAccumFrac = AnomaAccumQuarFrac
            if (AnomaAccum < Anoma25) {
            } else if (AnomaAccum < Anoma50) Plus = 7
            else if (AnomaAccum < Anoma75) Plus = 14
            else Plus = 21
            if (AnomaAccumQuar >= 6) {
                MoonTcorr1 = MoonTcorrList[6 + Plus] + MoonTcorrDif * AnomaAccumFrac / TheDenom
            } else {
                MoonTcorr1 = MoonTcorrList[Plus + AnomaAccumInt] + MoonTcorrDif * AnomaAccumFrac
            }
        } else if (['Xuanming', 'Yingtian'].includes(Name)) {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) Plus = 14
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
    if (Type === 7 && Name !== 'Qintian') {
        if (Name === 'Xuanming') {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) Plus = 14
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

const MoonDifAccumTable = (AnomaAccum, Name) => { // 暫時沒有用，就不處理欽天了
    const { Type, Anoma, MoonAcrVList, Denom, MoonAvgVxian } = Para[Name]
    const Anoma25 = Anoma / 4
    const Anoma50 = Anoma / 2
    const Anoma75 = Anoma * .75
    AnomaAccum %= Anoma
    let AnomaAccumInt = ~~AnomaAccum
    let AnomaAccumFrac = deci(AnomaAccum)
    const AnomaAccumHalf = AnomaAccum % Anoma50
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumHalfFrac = deci(AnomaAccumHalf)
    const AnomaAccumQuar = AnomaAccum % Anoma25
    const AnomaAccumQuarInt = ~~AnomaAccumQuar
    const AnomaAccumQuarFrac = deci(AnomaAccumQuar)
    const MoonAvgVd = AutoMoonAvgV(Name)
    // const MoonAvgVddenom = parseFloat((MoonAvgVd * Denom).toPrecision(12))
    // 下月離表。麟德：盈加朒減，速減遲加
    const MoonAcrAvgDifList = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會爲實平行差。麟德爲增減率
    let MoonDifAccumList = []
    let MoonDegDenom = Denom
    if (Name === 'Qintian' || Type >= 8) {
        MoonDegDenom = 100
        if (['Yingtian', 'Yitian'].includes(Name)) MoonDegDenom = Denom / 100
    }
    const MoonAcrVd = []
    const num = Name === 'Qintian' ? 248 : 27
    for (let i = 0; i <= num; i++) {
        MoonAcrVd[i] = MoonAcrVList[i] / MoonDegDenom
        if (Name === 'Qintian') MoonAcrVd[i] /= 9
    }
    for (let i = 0; i <= num; i++) {
        MoonAcrAvgDifList[i] = parseFloat((MoonAcrVd[i] - (MoonAvgVxian || MoonAvgVd)).toPrecision(8))
    }
    MoonDifAccumList = MoonAcrAvgDifList.slice() // 盈縮積
    for (let i = 1; i <= num; i++) {
        MoonDifAccumList[i] += MoonDifAccumList[i - 1]
        MoonDifAccumList[i] = parseFloat((MoonDifAccumList[i]).toPrecision(8))
    }
    MoonDifAccumList = [0, ...MoonDifAccumList]
    let MoonDifAccum2 = 0, Plus = 0
    if (Name === 'Qintian') {
        const XianNum = ~~(AnomaAccum * 9)
        const XianFrac = AnomaAccum * 9 - XianNum // 占一限的百分比，而非一日。
        MoonDifAccum2 = MoonDifAccumList[XianNum] + XianFrac * (MoonDifAccumList[XianNum + 1] - MoonDifAccumList[XianNum])
    } else {
        if (Name === 'Yitian') {
            AnomaAccumInt = AnomaAccumQuarInt
            AnomaAccumFrac = AnomaAccumQuarFrac
            if (AnomaAccum < Anoma25) {
            } else if (AnomaAccum < Anoma50) Plus = 7
            else if (AnomaAccum < Anoma75) Plus = 14
            else Plus = 21
        } else if (['Xuanming', 'Yingtian'].includes(Name)) {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) Plus = 14
        }
        if (~~AnomaAccum <= 25) {
            MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 1, [MoonDifAccumList[Plus + AnomaAccumInt], MoonDifAccumList[Plus + AnomaAccumInt + 1], MoonDifAccumList[Plus + AnomaAccumInt + 2]])
        } else {
            MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 3, [MoonDifAccumList[Plus + AnomaAccumInt - 2], MoonDifAccumList[Plus + AnomaAccumInt - 1], MoonDifAccumList[Plus + AnomaAccumInt]])
        }
    }
    // 以下是原本的算法
    // const AnomaAccumDay1 = AnomaAccumInt
    // const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    // const AnomaAccumDay2 = (AnomaAccumDay1 + 1) % 28 // 這沒加上最後一天的情況，以後得補上
    // const MoonAcrAvgDif1 = MoonAcrAvgDifList[AnomaAccumDay1]
    // const MoonAcrAvgDif2 = MoonAcrAvgDifList[AnomaAccumDay2]
    // const MoonDifAccumA = .5 * AnomaAccumFract * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + AnomaAccumFract * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - .5 * (AnomaAccumFract ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    // let MoonDifAccumB = 0
    // if (Type === 6) {
    //     MoonDifAccumB = .5 * (MoonDifAccumA / MoonAvgVddenom) * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + (MoonDifAccumA / MoonAvgVddenom) * (1 - AnomaAccumFract) * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - .5 * ((MoonDifAccumA / MoonAvgVddenom) ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    // }
    // const MoonDifAccum2 = MoonDifAccum[AnomaAccumDay1] + MoonDifAccumA + MoonDifAccumB
    // const MoonDifAccum1 = MoonDifAccum[AnomaAccumDay1] + MoonAcrAvgDif1 * AnomaAccumFract
    return MoonDifAccum2
}
// console.log(MoonDifAccumTable(2.92, 'Jiyuan'))

const MoonAcrSTable2 = (AnomaAccum, Name) => {
    const { Type, Anoma, MoonAcrVList, Denom } = Para[Name]
    const Anoma25 = Anoma / 4
    const Anoma50 = Anoma / 2
    const Anoma75 = Anoma * .75
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
    if (Name === 'Qintian' || Type >= 8) {
        MoonDegDenom = 100
        if (['Yingtian', 'Yitian'].includes(Name)) MoonDegDenom = Denom / 100
    }
    const MoonAcrVd = []
    const num = Name === 'Qintian' ? 248 : 27
    for (let i = 0; i <= num; i++) {
        MoonAcrVd[i] = MoonAcrVList[i] / MoonDegDenom
        if (Name === 'Qintian') MoonAcrVd[i] /= 9
    }
    let MoonAcrSList = MoonAcrVd.slice()
    for (let i = 1; i <= num; i++) {
        MoonAcrSList[i] += MoonAcrSList[i - 1]
        MoonAcrSList[i] = +MoonAcrSList[i].toFixed(4)
    }
    MoonAcrSList = [0, ...MoonAcrSList]
    let Plus = 0, MoonAcrS = 0
    if (Name === 'Qintian') {
        const XianNum = ~~(AnomaAccum * 9)
        const XianFrac = AnomaAccum * 9 - XianNum // 占一限的百分比，而非一日。
        MoonAcrS = MoonAcrSList[XianNum] + XianFrac * (MoonAcrSList[XianNum + 1] - MoonAcrSList[XianNum])
    } else {
        if (Name === 'Yitian') {
            AnomaAccumInt = AnomaAccumQuarInt
            AnomaAccumFrac = AnomaAccumQuarFrac
            if (AnomaAccum < Anoma25) {
            } else if (AnomaAccum < Anoma50) Plus = 7
            else if (AnomaAccum < Anoma75) Plus = 14
            else Plus = 21
        } else if (['Xuanming', 'Yingtian'].includes(Name)) {
            AnomaAccumInt = AnomaAccumHalfInt
            AnomaAccumFrac = AnomaAccumHalfFrac
            if (AnomaAccum >= Anoma50) Plus = 14
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


export const MoonFormula = (AnomaAccumRaw, Name) => {
    const { Type, Anoma, PartRange } = Para[Name]
    const Anoma50 = Anoma / 2 // 轉中
    const Anoma25 = Anoma / 4
    const MoonAvgVd = AutoMoonAvgV(Name)
    const AnomaAccumRev = Anoma50 - Math.abs(AnomaAccumRaw - Anoma50)
    let MoonDifAccum = 0, MoonAcrVd = 0
    let signB = 1
    if (Type === 11) {
        let signA = 1
        const T = (Anoma25 - Math.abs(AnomaAccumRaw % Anoma50 - Anoma25)) / PartRange
        if (AnomaAccumRaw >= Anoma50) signA = -1
        MoonDifAccum = signA * (11.11 * T - .0281 * T ** 2 - .000325 * T ** 3) / 100 // 遲疾差。三個常數是遲疾定平立三差
        const AnomaAccumPart = ~~(AnomaAccumRev * 336 / Anoma)
        const MoonAcrVListA = [1.2071, 1.2065, 1.2059, 1.2053, 1.2047, 1.2040, 1.2033, 1.2026, 1.2019, 1.2012, 1.2004, 1.1996, 1.1988, 1.1980, 1.1972, 1.1963, 1.1955, 1.1946, 1.1937, 1.1927, 1.1918, 1.1908, 1.1898, 1.1888, 1.1878, 1.1867, 1.1856, 1.1846, 1.1835, 1.1823, 1.1812, 1.1800, 1.1788, 1.1776, 1.1764, 1.1751, 1.1739, 1.1726, 1.1713, 1.1700, 1.1686, 1.1673, 1.1659, 1.1645, 1.1631, 1.1616, 1.1602, 1.1587, 1.1572, 1.1557, 1.1541, 1.1526, 1.1510, 1.1494, 1.1478, 1.1462, 1.1445, 1.1428, 1.1411, 1.1394, 1.1377, 1.1359, 1.1342, 1.1324, 1.1306, 1.1287, 1.1269, 1.1250, 1.1231, 1.1212, 1.1193, 1.1174, 1.1154, 1.1134, 1.1114, 1.1094, 1.1073, 1.1053, 1.1032, 1.1011, 1.0990, 1.0968, 1.0966, 1.0965, 1.0961, 1.0959, 1.0958, 1.0936, 1.0915, 1.0894, 1.0873, 1.0852, 1.0832, 1.0812, 1.0792, 1.0772, 1.0752, 1.0733, 1.0713, 1.0694, 1.0676, 1.0657, 1.0638, 1.0620, 1.0602, 1.0584, 1.0566, 1.0549, 1.0531, 1.0514, 1.0497, 1.0481, 1.0464, 1.0448, 1.0432, 1.0416, 1.0400, 1.0384, 1.0369, 1.0354, 1.0339, 1.0324, 1.0309, 1.0295, 1.0281, 1.0267, 1.0253, 1.0239, 1.0226, 1.0213, 1.0200, 1.0187, 1.0174, 1.0162, 1.0150, 1.0138, 1.0126, 1.0114, 1.0103, 1.0091, 1.0080, 1.0069, 1.0059, 1.0048, 1.0038, 1.0028, 1.0018, 1.0008, .9999, .9985, .9980, .9971, .9962, .9954, .9946, .9937, .9929, .9922, .9914, .9907, .9900, .9893, .9886, .9879, .9873, .9867, .9861, .9855]
        MoonAcrVd = MoonAcrVListA[AnomaAccumPart]
    } else {
        if (Name === 'Mingtian') {
            // AnomaAccum = big.div(SolsAccum, Lunar).add(i - 1 + ZhengSd).mul(2142887000).mod(AnomaNumer).floor().div(81120000).toNumber()
            // AnomaAccum[i] = (Math.floor(SolsAccum / Lunar + i - 1 + ZhengSd) * 2142887000 % AnomaNumer) / 81120000
            const AnomaAccum = AnomaAccumRaw * MoonAvgVd
            const T = 92.0927 - Math.abs((AnomaAccumRaw % Anoma50) * MoonAvgVd - 92.0927)
            let sign3 = 1
            if (AnomaAccum <= 92.0927) {
            } else if (AnomaAccum <= 184.1854) sign3 = -1
            else if (AnomaAccum <= 92.0927 * 3) {
                signB = -1
                sign3 = -1
            } else signB = -1
            const tmp = signB * T * (210.09 - T) // 積數
            MoonDifAccum = tmp / 1976 // 遲疾差度 //+ T * (MoonAvgVd - Sidereal / Anoma) / MoonAvgVd // 《中國古代曆法》頁110莫名其妙說要加上後面這個，但不加纔跟其他曆相合
            // MoonTcorr2 = tmp / .67735 / Denom // 遲疾定差 13.36875*1976/.67735=39000
            MoonAcrVd = 13.36875 + sign3 * (1.27 - T / 72.5) // 原文739
        } else if (Name === 'Futian') {
            let AnomaAccum = AnomaAccumRaw
            if (AnomaAccumRaw > Anoma / 2) {
                AnomaAccum -= Anoma / 2
                signB = -1
            }
            MoonDifAccum = signB * AnomaAccum * (Anoma / 2 - AnomaAccum) / 9.4
        }
    }
    const MoonAcrS = AnomaAccumRaw * MoonAvgVd + MoonDifAccum
    return { MoonDifAccum, MoonAcrVd, MoonAcrS }
}
// console.log(MoonFormula(12.903, 'Shoushi').MoonAcrVd)

/**
 * 用注釋中的算法算限下行度，和授時曆本表密合，只有一些相差.0001
 * @returns 限下行度
 */
export const ShoushiXianV = AnomaAccum => {
    // const V = []
    const P = .082
    // for (let i = 1; i <= 336; i++) {
    //     V[i] = (13.3689 / (1 / P) + (MoonFormula(i * P, 'Shoushi').MoonDifAccum) - (MoonFormula((i - 1) * P, 'Shoushi').MoonDifAccum)).toFixed(4)
    // }
    return 13.3689 / (1 / P) + (MoonFormula(AnomaAccum, 'Shoushi').MoonDifAccum) - (MoonFormula(AnomaAccum - P, 'Shoushi').MoonDifAccum)
}
// console.log(ShoushiXianV())
export const AutoTcorr = (AnomaAccum, Sd, Name, NodeAccum) => {
    const { Type, SolarRaw, PartRange, Anoma, NodeDenom } = Para[Name]
    let { Solar } = Para[Name]
    Solar = Solar || SolarRaw
    Sd %= Solar
    AnomaAccum = (AnomaAccum % Anoma) || 0
    let sunFunc = {}, moonFunc = {}, TcorrFunc = {}
    let SunTcorr2 = 0, SunTcorr1 = 0, MoonTcorr2 = 0, MoonTcorr1 = 0, Tcorr2 = 0, Tcorr1 = 0, NodeAccumCorrA = 0, NodeAccumCorrB = 0, SunDifAccum = 0, MoonDifAccum = 0, SunTcorr = 0, MoonTcorr = 0, MoonAcrVd = 0 // Tcorr2二次或三次內插
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Yisi', 'LindeB', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(Name)) {
        if (Name === 'Huangchu') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Qianxiang').Tcorr1
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(Name)) {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Jingchu').Tcorr1
        } else if (Name === 'Xuanshi') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Tsrengguang').Tcorr1
        } else if (['Jiayin', 'Tianhe', 'Daxiang'].includes(Name)) {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Tianbao').Tcorr1
        } else if (Name === 'Kaihuang') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Yuanjia').Tcorr1
        } else if (Name === 'Liangwu') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Daming').Tcorr1
        } else if (['Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
            Tcorr1 = AutoTcorr(AnomaAccum, Sd, 'Daye').Tcorr1
        } else {
            if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
                TcorrFunc = AutoTcorr(AnomaAccum, Sd, 'Linde')
            } else if (['Zhide', 'TaiyiKaiyuan'].includes(Name)) {
                TcorrFunc = AutoTcorr(AnomaAccum, Sd, 'Dayan')
            } else if (['TaiyiJingyou'].includes(Name)) {
                TcorrFunc = AutoTcorr(AnomaAccum, Sd, 'Chongtian')
            } else if (['Daming1', 'Daming2'].includes(Name)) {
                TcorrFunc = AutoTcorr(AnomaAccum, Sd, 'Jiyuan')
            } else if (['Yiwei', 'Gengwu'].includes(Name)) {
                TcorrFunc = AutoTcorr(AnomaAccum, Sd, 'Daming3')
            }
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
            SunTcorr2 = TcorrFunc.SunTcorr2
            SunTcorr1 = TcorrFunc.SunTcorr1
            MoonTcorr2 = TcorrFunc.MoonTcorr2
            MoonTcorr1 = TcorrFunc.MoonTcorr1
        }
    } else {
        if (['Daye', 'Wuyin', 'WuyinB'].includes(Name)) {
            SunTcorr1 = SunTcorrTable(Sd, Name).SunTcorr1
            MoonTcorr1 = MoonTcorrTable1(AnomaAccum, Name).MoonTcorr1
            Tcorr1 = SunTcorr1 + MoonTcorr1
            const HalfTermLeng = Solar / 24
            const TermNum = ~~(Sd / HalfTermLeng)
            if (Name === 'Daye') {
                if (TermNum <= 4) {
                    NodeAccumCorrA = Math.abs(Sd - HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 8) {
                    NodeAccumCorrA = 63600 / NodeDenom
                } else if (TermNum <= 11) {
                    NodeAccumCorrA = Math.abs(Sd - 11 * HalfTermLeng) * 1380 / NodeDenom
                } else if (TermNum <= 16) {
                    NodeAccumCorrA = -Math.abs(Sd - 13 * HalfTermLeng) * 900 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeAccumCorrA = -55000 / NodeDenom
                } else {
                    NodeAccumCorrA = -Math.abs(Sd - 23 * HalfTermLeng) * 1770 / NodeDenom
                }
            } else {
                if (TermNum >= 2 && TermNum <= 3) {
                    NodeAccumCorrA = Math.abs(Sd - HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 7) {
                    NodeAccumCorrA = 76100 / NodeDenom
                } else if (TermNum <= 10) {
                    NodeAccumCorrA = 76100 / NodeDenom - Math.abs(Sd - 8 * HalfTermLeng) * 1650 / NodeDenom
                } else if (TermNum <= 12) { } else if (TermNum <= 16) {
                    NodeAccumCorrA = -Math.abs(Sd - 13 * HalfTermLeng) * 1200 / NodeDenom
                } else if (TermNum <= 20) {
                    NodeAccumCorrA = -95825 / NodeDenom
                } else {
                    NodeAccumCorrA = -63300 / NodeDenom + Math.abs(Sd - 21 * HalfTermLeng) * 2110 / NodeDenom
                }
                if ((TermNum >= 2 && TermNum <= 3) || (TermNum === 9)) { // 後兩種修正與五星有關，暫時沒法加
                    if (NodeAccum <= 1 / 6) {
                        NodeAccumCorrA /= 2
                    } else NodeAccumCorrA = 0
                }
            }
        } else if (Type <= 4) {
            MoonTcorr1 = MoonTcorrTable1(AnomaAccum, Name).MoonTcorr1
            Tcorr1 = MoonTcorr1
        } else if (['Yitian', 'Guantian'].includes(Name)) {
            const MoonAvgVd = AutoMoonAvgV(Name)
            SunDifAccum = SunDifAccumFormula(Sd, Name)
            MoonTcorr1 = -(MoonTcorrTable(AnomaAccum, Name).MoonTcorr1)
            SunTcorr2 = SunDifAccum / MoonAvgVd
            Tcorr2 = SunTcorr2 + MoonTcorr1
        } else if (['Futian', 'Mingtian'].includes(Name)) {
            const MoonAvgVd = AutoMoonAvgV(Name)
            SunDifAccum = SunDifAccumFormula(Sd, Name)
            const MoonFunc = MoonFormula(AnomaAccum, Name)
            MoonDifAccum = MoonFunc.MoonDifAccum
            MoonAcrVd = MoonFunc.MoonAcrVd
            SunTcorr2 = SunDifAccum / MoonAvgVd
            MoonTcorr2 = -MoonDifAccum / MoonAvgVd
            Tcorr2 = SunTcorr2 + MoonTcorr2
        } else if (Type === 7 && Name !== 'Qintian') {
            sunFunc = SunTcorrTable(Sd, Name)
            moonFunc = MoonTcorrTable(AnomaAccum, Name)
            SunTcorr2 = sunFunc.SunTcorr2
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr2 + MoonTcorr1
        } else if (Type < 11) {
            sunFunc = SunTcorrTable(Sd, Name)
            SunTcorr2 = sunFunc.SunTcorr2
            moonFunc = MoonTcorrTable(AnomaAccum + (Name === 'Qintian' ? SunTcorr2 : 0), Name)
            MoonTcorr1 = -moonFunc.MoonTcorr1
            Tcorr2 = SunTcorr2 + MoonTcorr1
        } else if (Type === 11) {
            SunDifAccum = SunDifAccumFormula(Sd, Name)
            moonFunc = MoonFormula(AnomaAccum, Name)
            MoonDifAccum = moonFunc.MoonDifAccum
            MoonAcrVd = moonFunc.MoonAcrVd
            SunTcorr2 = SunDifAccum * PartRange / MoonAcrVd
            MoonTcorr2 = -MoonDifAccum * PartRange / MoonAcrVd
            Tcorr2 = SunTcorr2 + MoonTcorr2
        }
        SunTcorr = SunTcorr2 || (SunTcorr1 || 0)
        MoonTcorr = MoonTcorr2 || MoonTcorr1
        if (Type >= 5 && Type <= 10) {
            const Portion = AutoNodePortion(Name)
            NodeAccumCorrA = SunTcorr + Portion * MoonTcorr //  // 劉金沂《麟德曆交食計算法》。 const signNodeAccum = 1 // NodeAccumHalf > Node25 ? -1 : 1// 交前、先交。交後交在後，符號同定朔改正，交前，與定朔相反。 // 至少大衍的符號和定朔完全相同「⋯⋯以朓減朒加入交常」
            NodeAccumCorrB = Portion * SunTcorr + MoonTcorr // 太陽入交定日，上面是月亮入交定日
        }
    }
    return {
        SunTcorr, SunTcorr2, SunTcorr1, MoonTcorr, MoonTcorr2, MoonTcorr1, MoonAcrVd,
        Tcorr2, Tcorr1,
        NodeAccumCorrA, NodeAccumCorrB,
    }
}
// console.log(AutoTcorr(6, 9, 'Qintian').MoonTcorr)

export const AutoDifAccum = (AnomaAccum, Sd, Name) => {
    const { Type, SolarRaw, Anoma } = Para[Name]
    let { Solar } = Para[Name]
    Solar = Solar || SolarRaw
    Sd %= Solar
    AnomaAccum = (AnomaAccum % Anoma) || 0
    let DifAccumFunc = {}
    let SunDifAccum = 0, MoonDifAccum = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Yisi', 'LindeB', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(Name)) {
        if (Name === 'Huangchu') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Qianxiang').MoonDifAccum
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(Name)) {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Jingchu').MoonDifAccum
        } else if (Name === 'Xuanshi') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Tsrengguang').MoonDifAccum
        } else if (['Jiayin', 'Tianhe', 'Daxiang'].includes(Name)) {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Tianbao').MoonDifAccum
        } else if (Name === 'Kaihuang') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Yuanjia').MoonDifAccum
        } else if (Name === 'Liangwu') {
            MoonDifAccum = AutoDifAccum(AnomaAccum, 0, 'Liangwu').MoonDifAccum
        } else {
            if (['Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, Sd, 'Daye')
            } else if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, Sd, 'Linde')
            } else if (Name === 'Zhide') {
                DifAccumFunc = AutoDifAccum(AnomaAccum, Sd, 'Dayan')
            } else if (['Daming1', 'Daming2'].includes(Name)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, Sd, 'Jiyuan')
            } else if (['Yiwei', 'Gengwu'].includes(Name)) {
                DifAccumFunc = AutoDifAccum(AnomaAccum, Sd, 'Daming3')
            }
            SunDifAccum = DifAccumFunc.SunDifAccum
            MoonDifAccum = DifAccumFunc.MoonDifAccum
        }
    } else {
        if (Sd) {
            if (['Daye', 'Wuyin', 'WuyinB'].includes(Name)) {
                SunDifAccum = AutoTcorr(0, Sd, Name).SunTcorr1 * AutoMoonAvgV(Name)
            } else if (Type <= 4) {
            } else if (['Yitian', 'Guantian'].includes(Name)) {
                SunDifAccum = SunDifAccumFormula(Sd, Name)
            } else if (['Futian', 'Mingtian'].includes(Name) || Type === 11) {
                SunDifAccum = SunDifAccumFormula(Sd, Name)
            } else if (Type < 11) {
                SunDifAccum = SunDifAccumTable(Sd, Name)
            }
        }
        if (AnomaAccum) {
            if (['Daye', 'Wuyin', 'WuyinB'].includes(Name)) {
                MoonDifAccum = MoonTcorrTable1(AnomaAccum, Name).MoonDifAccum1
            } else if (Type <= 4) {
                MoonDifAccum = MoonTcorrTable1(AnomaAccum, Name).MoonDifAccum1
            } else if (['Yitian', 'Guantian'].includes(Name)) {
                MoonDifAccum = MoonDifAccumTable(AnomaAccum, Name)
            } else if (['Futian', 'Mingtian'].includes(Name) || Type === 11) {
                MoonDifAccum = MoonFormula(AnomaAccum, Name).MoonDifAccum
            } else if (Type < 11) {
                MoonDifAccum = MoonDifAccumTable(AnomaAccum, Name)
            }
        }
    }
    return { SunDifAccum, MoonDifAccum }
}
// console.log(AutoDifAccum(9, 9, 'Chongxuan').MoonDifAccum)

export const AutoMoonAcrS = (AnomaAccum, Name) => {
    const { Type, Anoma } = Para[Name]
    let MoonAcrS = 0, AnomaCycle = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Yisi', 'LindeB', 'Shenlong', 'Zhide', 'Daming1', 'Daming2', 'Yiwei', 'Gengwu'].includes(Name)) {
        if (Name === 'Huangchu') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Qianxiang')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Qianxiang')
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(Name)) {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Jingchu')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Jingchu')
        } else if (Name === 'Xuanshi') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Tsrengguang')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Tsrengguang')
        } else if (['Jiayin', 'Tianhe', 'Daxiang'].includes(Name)) {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Tianbao')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Tianbao')
        } else if (Name === 'Kaihuang') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Yuanjia')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Yuanjia')
        } else if (Name === 'Liangwu') {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, 'Daming')
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, 'Daming')
        } else {
            if (['Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Daye')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Daye')
            } else if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Linde')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Linde')
            } else if (Name === 'Zhide') {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Dayan')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Dayan')
            } else if (['Daming1', 'Daming2'].includes(Name)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Jiyuan')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Jiyuan')
            } else if (['Yiwei', 'Gengwu'].includes(Name)) {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, 'Daming3')
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, 'Daming3')
            }
        }
    } else {
        if (Type > 1 && Type < 5) {
            MoonAcrS = MoonAcrSTable1(AnomaAccum, Name)
            AnomaCycle = MoonAcrSTable1(Anoma - 1e-13, Name)
        } else {
            if (Name === 'Mingtian') {
                MoonAcrS = MoonFormula(AnomaAccum, Name).MoonAcrS
                AnomaCycle = 368.3708
            } else if (Name === 'Futian' || Type === 11) {
                MoonAcrS = MoonFormula(AnomaAccum, Name).MoonAcrS
                AnomaCycle = MoonFormula(Anoma - 1e-13, Name).MoonAcrS
            } else {
                MoonAcrS = MoonAcrSTable2(AnomaAccum, Name)
                AnomaCycle = MoonAcrSTable2(Anoma - 1e-13, Name)
            }
        }
    }
    // if (['Xuanming', 'Yingtian', 'Yitian'].includes(Name)) {
    //     if (AnomaAccum > Anoma / 2) {
    //         MoonAcrS += AnomaCycle
    //     }
    //     AnomaCycle *= 2
    // }
    return { MoonAcrS, AnomaCycle }
}
// console.log(AutoMoonAcrS(23, 'Qianxiang').AnomaCycle)

const MoonDifAccumMax1 = L => { // 線性內插月遲疾積求極值
    const x = (2 * L[7] - L[8] - L[6]) / (L[6] - L[5] + L[7] - L[8]) // 極值在入轉第6.幾日
    if (x > 0) return { x, y: (L[6] - L[5]) * x + L[6] } // y：極值
    else return 'Error'
}
// console.log(MoonDifAccumMax1(Para['Wuyin'].MoonDifAccumList))


const MoonDifAccumMax2 = Name => { // 二次內插表取月亮極值
    const { Type, MoonAcrVList, SunAcrAvgDifList, Denom, Sidereal, Solar, SolarRaw } = Para[Name]
    const S = Sidereal || (Solar || SolarRaw)
    let cS = 0, cM = 0
    if (SunAcrAvgDifList) {
        let SunDenom = Denom
        if (Name === 'Qintian' || Type >= 8 && Name !== 'Qianyuan') SunDenom = 10000 // 崇玄也是萬分母
        const SunAcrAvgDifListList = [] // 這個多此一舉的SunAcrAvgDifListList一定不能刪掉，否則多次運算就會越來越小
        for (let i = 0; i <= 23; i++) {
            SunAcrAvgDifListList[i] = SunAcrAvgDifList[i] / SunDenom
        }
        let SunDifAccumList = SunAcrAvgDifListList.slice()
        for (let i = 1; i <= 23; i++) {
            SunDifAccumList[i] += SunDifAccumList[i - 1]
            SunDifAccumList[i] = +(SunDifAccumList[i].toFixed(12))
        }
        SunDifAccumList = [0, ...SunDifAccumList]
        SunDifAccumList[25] = SunDifAccumList[1]
        // const Max = MeasureSols([1, SunDifAccumList[5], 2, SunDifAccumList[6], 3, SunDifAccumList[7]]).f
        const Max = SunDifAccumList[6]
        cS = Max * 360 / S * Math.PI / 180 / 2
    }
    if (MoonAcrVList) {
        const MoonAvgVd = AutoMoonAvgV(Name)
        // 下月離表。麟德：盈加朒減，速減遲加
        const MoonAcrAvgDifList = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會爲實平行差。麟德爲增減率
        let MoonDifAccumList = []
        let MoonDegDenom = Denom
        if (Name === 'Qintian' || Type >= 8) {
            MoonDegDenom = 100
            if (['Yingtian', 'Yitian'].includes(Name)) MoonDegDenom = Denom / 100
        }
        const MoonAcrVd = []
        for (let i = 0; i <= 27; i++) {
            MoonAcrVd[i] = MoonAcrVList[i] / MoonDegDenom
        }
        for (let i = 0; i <= 27; i++) {
            MoonAcrAvgDifList[i] = parseFloat((MoonAcrVd[i] - MoonAvgVd).toPrecision(8))
        }
        MoonDifAccumList = MoonAcrAvgDifList.slice() // 盈縮積
        for (let i = 1; i <= 27; i++) {
            MoonDifAccumList[i] += MoonDifAccumList[i - 1]
            MoonDifAccumList[i] = parseFloat((MoonDifAccumList[i]).toPrecision(8))
        }
        MoonDifAccumList = [0, ...MoonDifAccumList]
        const Max = MeasureSols([1, MoonDifAccumList[6], 2, MoonDifAccumList[7], 3, MoonDifAccumList[8]]).f
        cM = Max * 360 / S * Math.PI / 180 / 2
    }

    return {
        cS: +cS.toFixed(8), cM: +cM.toFixed(8)
    }
}
// console.log(MoonDifAccumMax2('Qintian'))
