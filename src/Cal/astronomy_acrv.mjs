import {
    Bind,
} from './bind.mjs'
import {
    SunWest,
    MoonWest
} from './astronomy_west.mjs'
import {
    Interpolate1,
    Interpolate3
} from './equa_sn.mjs'

const AutoMoonAvgV = CalName => {
    const { AutoPara, Type } = Bind(CalName)
    const { Sidereal } = AutoPara[CalName]
    let { Solar, Lunar } = AutoPara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
        Lunar = 29.530592
    }
    let MoonAvgVDeg = 0
    let Plus = 0
    if (CalName === 'Daye') { // 陳美東《月離表初探》
        Plus = -0.00036322096
    } else if (CalName === 'Huangji') { // 皇極平行速695。皇極、宣明更好的方法是Math.floor，但是為了保持統一，這裏還是麻煩一下
        Plus = -0.00295858
    } else if (CalName === 'Xuanming') {
        Plus = 0.000301739405
    }
    if (CalName === 'Wuyin') {
        MoonAvgVDeg = parseFloat((Solar / Lunar + 1).toPrecision(14))
    } else if (CalName === 'Chongxuan') {
        MoonAvgVDeg = 13 + 7 / 19
    } else if (CalName === 'Mingtian') {
        MoonAvgVDeg = 13.36875
    } else if ((CalName === 'Guantian' || Type === 9 || Type === 10) && CalName !== 'Tongyuan') {
        MoonAvgVDeg = 13.37
    } else if (Type === 11) {
        MoonAvgVDeg = 13.3687
    } else {
        MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1 + Plus).toPrecision(14))
    }
    return MoonAvgVDeg
}

// 大衍用不等間距二次內插，宣明也是。崇玄暫且用平氣。計算盈縮積
export const SunDifAccumTable = (OriginDifRaw, CalName) => {
    const {
        Type,
        AutoPara
    } = Bind(CalName)
    const {
        SunAcrAvgDifList,
        AcrTermList,
        TermRangeA,
        TermRangeS,
        SolarRaw
    } = AutoPara[CalName]
    let {
        Denom,
        Solar
    } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarRaw
    }
    if (Type >= 8 && CalName !== 'Qianyuan') { // 崇玄也是萬分母
        Denom = 10000
    }
    const HalfTermLeng = Solar / 24
    // 求定氣要用下面的
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
    // const AcrTermList = [] // 定氣距冬至日數
    // for (let i = 0; i <= 23; i++) {
    //     AcrTermList[i] = +(HalfTermLeng * i - SunDifAccumList[i]).toFixed(6)
    // }
    // AcrTermList[0] = 0
    // AcrTermList[24] = +Solar.toFixed(6)
    const OriginDif = OriginDifRaw % Solar
    let SunDifAccum2 = 0
    if (Type === 7) {
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (OriginDif >= AcrTermList[j] && OriginDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        const Initial = AcrTermList[TermNum] + ',' + SunDifAccumList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + SunDifAccumList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + SunDifAccumList[TermNum + 2]
        SunDifAccum2 = Interpolate3(OriginDif, Initial) // 直接拉格朗日內插，懶得寫了
    } else {
        let TermRange1 = 0
        const TermNum1 = ~~(OriginDif / HalfTermLeng)  // 朔望所在氣名
        const TermNum2 = (TermNum1 + 1) % 24
        const TermNewmDif = OriginDif - TermNum1 * HalfTermLeng // 注意要減1。朔望入氣日數
        if (['Linde', 'Huangji', 'Shenlong'].includes(CalName)) {
            if ((OriginDif < 6 * HalfTermLeng) || (OriginDif >= 18 * HalfTermLeng)) {
                TermRange1 = TermRangeA // 秋分後
            } else {
                TermRange1 = TermRangeS // 春分後
            }
        } else {
            TermRange1 = HalfTermLeng - SunAcrAvgDifListList[TermNum1] / Denom
            // TermRange2 = HalfTermLeng - SunAcrAvgDifListList[TermNum2] / Denom
        }
        const SunAcrAvgDif1 = SunAcrAvgDifListList[TermNum1]
        const SunAcrAvgDif2 = SunAcrAvgDifListList[TermNum2]
        SunDifAccum2 = SunDifAccumList[TermNum1] + 0.5 * (TermNewmDif / TermRange1) * (SunAcrAvgDif1 + SunAcrAvgDif2) + (TermNewmDif / TermRange1) * (SunAcrAvgDif1 - SunAcrAvgDif2) - 0.5 * ((TermNewmDif / TermRange1) ** 2) * (SunAcrAvgDif1 - SunAcrAvgDif2)
    }
    return SunDifAccum2
}
// console.log(SunDifAccumTable(14, 'Tongtian').SunDifAccum2)

// 計算朓朒積
const SunTcorrTable = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        SolarRaw,
        SunTcorrList,
        AcrTermList,
        TermRangeA,
        TermRangeS,
    } = AutoPara[CalName]
    let {
        Denom,
        Solar,
    } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarRaw
    }
    let HalfTermLeng = Solar / 24
    const OriginDif = OriginDifRaw % Solar
    const TermNum = ~~(OriginDif / HalfTermLeng)
    let SunTcorr1 = 0
    let SunTcorr2 = 0
    if (Type === 7) {
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (OriginDif >= AcrTermList[j] && OriginDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        const Initial = AcrTermList[TermNum] + ',' + SunTcorrList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + SunTcorrList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + SunTcorrList[TermNum + 2]
        SunTcorr2 = Interpolate3(OriginDif, Initial)  // 直接拉格朗日內插，懶得寫了
        const TermRange1 = AcrTermList[TermNum + 1] - AcrTermList[TermNum] // 本氣長度
        SunTcorr1 = SunTcorrList[TermNum] + (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum]) * (OriginDif - AcrTermList[TermNum]) / TermRange1
    } else {
        let TermRange = HalfTermLeng
        if (['Huangji', 'Linde'].includes(CalName)) {
            if ((OriginDifRaw < 6 * HalfTermLeng) || (OriginDifRaw >= 18 * HalfTermLeng)) {
                TermRange = TermRangeA // 秋分後
            } else {
                TermRange = TermRangeS // 春分後
            }
        }
        if (CalName === 'Wuiyn') {
            Denom = 11830
        }
        const n = (OriginDif - TermNum * HalfTermLeng) / TermRange
        if (Type >= 5) {
            const Initial = SunTcorrList[TermNum] + ',' + SunTcorrList[TermNum + 1] + ',' + SunTcorrList[TermNum + 2]
            SunTcorr2 = Interpolate1(n + 1, Initial)
        }
        SunTcorr1 = SunTcorrList[TermNum] + n * (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum])
    }
    SunTcorr1 /= Denom
    SunTcorr2 /= Denom
    return { SunTcorr1, SunTcorr2 }
}
// console.log(SunTcorrTable(56.51, 'Jiyuan'))

export const SunFormula = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Denom,
        SolarRaw,
        ExpanDing,
        ExpanPing,
        ExpanLi,
        ContracDing,
        ContracPing,
        ContracLi,
    } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarRaw
    }
    let OriginDif = OriginDifRaw % Solar
    const HalfSolar = +((Solar / 2).toFixed(6))
    let SunDifAccum = 0
    let signA = 1
    let Xian = 0
    let ExconT = 0
    if (Type === 11) {
        if (OriginDif <= 88.909225) {
            const ExconT = OriginDif
            SunDifAccum = (ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000 // 盈縮差
        } else if (OriginDif <= HalfSolar) {
            const ExconT = HalfSolar - OriginDif
            SunDifAccum = (ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
        } else if (OriginDif <= HalfSolar + 93.712025) {
            const ExconT = OriginDif - HalfSolar
            SunDifAccum = -(ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
        } else {
            const ExconT = Solar - OriginDif
            SunDifAccum = -(ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000
        }
    } else {
        if (CalName === 'Yitian') {
            const XianA = 897699.5
            const XianB = 946785.5 // 陳美東《崇玄儀天崇天三曆晷長計算法》改正該値
            if (OriginDif <= XianA / Denom) {
                Xian = XianA
                ExconT = OriginDif
            } else if (OriginDif <= HalfSolar) {
                Xian = XianB
                ExconT = HalfSolar - OriginDif
            } else if (OriginDif <= HalfSolar + XianB / Denom) {
                signA = -1
                Xian = XianB
                ExconT = OriginDif - HalfSolar
            } else {
                signA = -1
                Xian = XianA
                ExconT = Solar - OriginDif
            }
            const ExconAccum = 24543 // 盈縮積
            const E = ExconAccum * Denom * 2 / Xian // 初末限平率
            const F = E * Denom / Xian // 日差
            SunDifAccum = signA * (ExconT * (E - F / 2) - ExconT * (ExconT - 1) * F / 2) / Denom // 盈縮定分、先後數。極値2.45
        } else if (['Fengyuan', 'Guantian', 'Zhantian'].includes(CalName)) {
            let SunDenom = 0
            const XianA = 88 + 10958 / 12030
            const XianB = 93 + 8552 / 12030
            const SunDenomA = 3294
            const SunDenomB = 3659
            if (OriginDif <= XianA) {
                Xian = XianA
                SunDenom = SunDenomA
                ExconT = OriginDif
            } else if (OriginDif <= HalfSolar) {
                Xian = XianB
                SunDenom = SunDenomB
                ExconT = HalfSolar - OriginDif
            } else if (OriginDif <= HalfSolar + XianB) {
                Xian = XianB
                SunDenom = SunDenomB
                signA = -1
                ExconT = OriginDif - HalfSolar
            } else {
                Xian = XianA
                SunDenom = SunDenomA
                signA = -1
                ExconT = Solar - OriginDif
            }
            SunDifAccum = signA * (ExconT / SunDenom) * (Xian * 2 - ExconT) // 盈縮差度分。極值2.37
        } else if (CalName === 'Mingtian') {
            if (OriginDif <= Solar / 4) {
                ExconT = OriginDif
            } else if (OriginDif <= HalfSolar) {
                ExconT = HalfSolar - OriginDif
            } else if (OriginDif <= Solar * 0.75) {
                signA = -1
                ExconT = OriginDif - HalfSolar
            } else {
                signA = -1
                ExconT = Solar - OriginDif
            }
            SunDifAccum = signA * ExconT * (200 - ExconT) / 4135 // 盈縮差度分。極值2.4
            // SunTcorr = signA * ExconT * (200 - ExconT) * 400 / 567/Denom 按照月速13.36875算出來，和上面的算式沒有區別，很好
        } else if (CalName === 'Futian') {
            if (OriginDif > HalfSolar) {
                OriginDif -= HalfSolar
                signA = -1
            }
            SunDifAccum = signA * OriginDif * (HalfSolar - OriginDif) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得為立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000為分母。
        }
    }
    return SunDifAccum
}
// console.log(SunFormula(91.31, 'Mingtian'))

// 這是魏晉南北朝的月離表
const MoonTable1 = (AnomaAccum, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        MoonAcrVRaw,
        Anoma,
        ZhangRange
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const MoonAcrVList = MoonAcrVRaw.slice()
    if (['Xuanshi', 'Zhengguang', 'Xinghe', 'Tianbao', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Daming', 'Liangwu'].includes(CalName)) {
        for (let i = 0; i <= 27; i++) {
            MoonAcrVList[i] = Math.round(MoonAcrVList[i] * ZhangRange)
        }
    }
    const AnomaAccumInt = ~~AnomaAccum
    const MoonAvgVDeg = AutoMoonAvgV(CalName, AnomaAccumInt)
    const MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(12)) // 乾象254=章歲+章月
    const MoonAcrAvgDifList = [] // 損益率
    for (let i = 0; i <= 27; i++) {
        MoonAcrAvgDifList[i] = MoonAcrVList[i] - MoonAvgV
    }
    let MoonDifAccumList = MoonAcrAvgDifList.slice() // 盈縮積
    for (let i = 1; i <= 27; i++) {
        MoonDifAccumList[i] += MoonDifAccumList[i - 1]
        MoonDifAccumList[i] = parseFloat((MoonDifAccumList[i]).toPrecision(12))
    }
    MoonDifAccumList = MoonDifAccumList.slice(-1).concat(MoonDifAccumList.slice(0, -1))
    MoonDifAccumList[0] = 0
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    let MoonDifAccum1 = MoonDifAccumList[AnomaAccumInt] + AnomaAccumFract * MoonAcrAvgDifList[AnomaAccumInt]
    const SunAvgV = ZhangRange
    let MoonTcorr1 = 0
    if (['Qianxiang', 'Huangchu', 'Jingchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Daming', 'Liangwu', 'Daxiang', 'Daye', 'Wuyin'].includes(CalName)) {
        MoonTcorr1 = -MoonDifAccum1 / (MoonAcrVList[~~AnomaAccum] - SunAvgV)
    } else if (['Yuanjia', 'Kaihuang'].includes(CalName)) { // 「賓等依何承天法」
        const MoonAcrDayDif = [] // 列差
        for (let i = 0; i <= 27; i++) {
            MoonAcrDayDif[i] = MoonAcrVList[i + 1] - MoonAcrVList[i]
        }
        const MoonAcrV1 = MoonAcrVList[AnomaAccumInt] + AnomaAccumFract * MoonAcrDayDif[AnomaAccumInt]
        MoonTcorr1 = -MoonDifAccum1 / (MoonAcrV1 - SunAvgV)
    } else if (['Xuanshi', 'Zhengguang', 'Xinghe', 'Tianbao', 'Jiayin', 'Tianhe'].includes(CalName)) {
        MoonTcorr1 = -MoonDifAccum1 / MoonAvgV
    }
    MoonDifAccum1 /= ZhangRange
    return {
        MoonDifAccum1,
        MoonTcorr1
    }
}
// console.log(MoonTable1(27, 'Daming').MoonAvgV)

const MoonTcorrTable = (AnomaAccum, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        MoonTcorrList,
        MoonTcorrListA,
        MoonTcorrListB,
        Anoma,
        Denom
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const HalfAnoma = Anoma / 2
    const AnomaAccumHalf = AnomaAccum % HalfAnoma
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumFrac = AnomaAccum - ~~AnomaAccum
    let Initial = ''
    let MoonTcorr1 = 0
    let MoonTcorr2 = 0
    if (MoonTcorrListA) {
        const AnomaAccumInt = ~~AnomaAccumHalf
        if (AnomaAccum < HalfAnoma) {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonTcorrListA[AnomaAccumInt] + ',' + MoonTcorrListA[AnomaAccumInt + 1] + ',' + MoonTcorrListA[AnomaAccumInt + 2]
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, Initial)
            } else {
                Initial = MoonTcorrListA[AnomaAccumInt - 2] + ',' + MoonTcorrListA[AnomaAccumInt - 1] + ',' + MoonTcorrListA[AnomaAccumInt]
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, Initial)
            }
            if (AnomaAccumInt <= 12) {
                MoonTcorr1 = (MoonTcorrListA[AnomaAccumInt] + AnomaAccumFrac * (MoonTcorrListA[AnomaAccumInt + 1] - MoonTcorrListA[AnomaAccumInt]))
            } else {
                MoonTcorr1 = (MoonTcorrListA[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonTcorrListA[AnomaAccumInt])
            }
        } else {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonTcorrListB[AnomaAccumInt] + ',' + MoonTcorrListB[AnomaAccumInt + 1] + ',' + MoonTcorrListB[AnomaAccumInt + 2]
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, Initial)
            } else {
                Initial = MoonTcorrListB[AnomaAccumInt - 2] + ',' + MoonTcorrListB[AnomaAccumInt - 1] + ',' + MoonTcorrListB[AnomaAccumInt]
                MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, Initial)
            }
            if (AnomaAccumInt <= 12) {
                MoonTcorr1 = (MoonTcorrListB[AnomaAccumInt] + AnomaAccumFrac * (MoonTcorrListB[AnomaAccumInt + 1] - MoonTcorrListB[AnomaAccumInt]))
            } else {
                MoonTcorr1 = (MoonTcorrListB[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonTcorrListB[AnomaAccumInt])
            }
        }
    } else {
        const AnomaAccumInt = ~~AnomaAccum
        if (AnomaAccumInt <= 25) {
            Initial = MoonTcorrList[AnomaAccumInt] + ',' + MoonTcorrList[AnomaAccumInt + 1] + ',' + MoonTcorrList[AnomaAccumInt + 2]
            MoonTcorr2 = Interpolate1(AnomaAccumFrac + 1, Initial)
        } else {
            Initial = MoonTcorrList[AnomaAccumInt - 2] + ',' + MoonTcorrList[AnomaAccumInt - 1] + ',' + MoonTcorrList[AnomaAccumInt]
            MoonTcorr2 = Interpolate1(AnomaAccumFrac + 3, Initial)
        }
        if (AnomaAccumInt <= 26) {
            MoonTcorr1 = (MoonTcorrList[AnomaAccumInt] + AnomaAccumFrac * (MoonTcorrList[AnomaAccumInt + 1] - MoonTcorrList[AnomaAccumInt]))
        } else {
            MoonTcorr1 = (MoonTcorrList[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonTcorrList[AnomaAccumInt])
        }
    }
    MoonTcorr1 /= Denom
    MoonTcorr2 /= Denom
    return { MoonTcorr2, MoonTcorr1 }
}
// console.log(MoonTcorrTable(7.266, 'Jiyuan'))
// console.log(MoonTcorrTable(7.266, 'Xuanming'))

export const MoonDifAccumTable = (AnomaAccum, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Anoma,
        MoonAcrV,
        MoonAcrVA,
        MoonAcrVB,
        Denom
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const HalfAnoma = Anoma / 2
    const AnomaAccumHalf = AnomaAccum % HalfAnoma
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumFrac = AnomaAccum - ~~AnomaAccum
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    // const MoonAvgV = parseFloat((MoonAvgVDeg * Denom).toPrecision(12))
    // 下月離表。麟德：盈加朒減，速減遲加
    const MoonAcrAvgDifList = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會為實平行差。麟德爲增減率
    const MoonAcrAvgDifListA = []
    const MoonAcrAvgDifListB = []
    let MoonDifAccumList = []
    let MoonDifAccumListA = []
    let MoonDifAccumListB = []
    let MoonDegDenom = Denom
    if (Type >= 8 && CalName !== 'Chongxuan') {
        MoonDegDenom = 100
        if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    if (MoonAcrVA) {
        const MoonAcrVDegA = []
        for (let i = 0; i <= 13; i++) {
            MoonAcrVDegA[i] = MoonAcrVA[i] / MoonDegDenom
        }
        const MoonAcrVDegB = []
        for (let i = 0; i <= 13; i++) {
            MoonAcrVDegB[i] = MoonAcrVB[i] / MoonDegDenom
        }
        for (let i = 0; i <= 13; i++) {
            MoonAcrAvgDifListA[i] = parseFloat((MoonAcrVDegA[i] - MoonAvgVDeg).toPrecision(7))
        }
        MoonDifAccumListA = MoonAcrAvgDifListA.slice() // 盈縮積
        for (let i = 1; i <= 13; i++) {
            MoonDifAccumListA[i] += MoonDifAccumListA[i - 1]
            MoonDifAccumListA[i] = parseFloat((MoonDifAccumListA[i]).toPrecision(7))
        }
        MoonDifAccumListA = MoonDifAccumListA.slice(-1).concat(MoonDifAccumListA.slice(0, -1))
        MoonDifAccumListA[0] = 0
        for (let i = 0; i <= 13; i++) {
            MoonAcrAvgDifListB[i] = parseFloat((MoonAcrVDegB[i] - MoonAvgVDeg).toPrecision(7))
        }
        MoonDifAccumListB = MoonAcrAvgDifListB.slice() // 盈縮積
        for (let i = 1; i <= 13; i++) {
            MoonDifAccumListB[i] += MoonDifAccumListB[i - 1]
            MoonDifAccumListB[i] = parseFloat((MoonDifAccumListB[i]).toPrecision(7))
        }
        MoonDifAccumListB = MoonDifAccumListB.slice(-1).concat(MoonDifAccumListB.slice(0, -1))
        MoonDifAccumListB[0] = 0
    } else {
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
    }
    let Initial = ''
    let MoonDifAccum2 = 0
    if (MoonAcrVA) {
        const AnomaAccumInt = ~~AnomaAccumHalf
        if (AnomaAccum < HalfAnoma) {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonDifAccumListA[AnomaAccumInt] + ',' + MoonDifAccumListA[AnomaAccumInt + 1] + ',' + MoonDifAccumListA[AnomaAccumInt + 2]
                MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 1, Initial)
            } else {
                Initial = MoonDifAccumListA[AnomaAccumInt - 2] + ',' + MoonDifAccumListA[AnomaAccumInt - 1] + ',' + MoonDifAccumListA[AnomaAccumInt]
                MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 3, Initial)
            }
            if (AnomaAccumInt <= 12) {
                MoonDifAccum2 = (MoonDifAccumListA[AnomaAccumInt] + AnomaAccumFrac * (MoonDifAccumListA[AnomaAccumInt + 1] - MoonDifAccumListA[AnomaAccumInt]))
            } else {
                MoonDifAccum2 = (MoonDifAccumListA[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonDifAccumListA[AnomaAccumInt])
            }
        } else {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonDifAccumListB[AnomaAccumInt] + ',' + MoonDifAccumListB[AnomaAccumInt + 1] + ',' + MoonDifAccumListB[AnomaAccumInt + 2]
                MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 1, Initial)
            } else {
                Initial = MoonDifAccumListB[AnomaAccumInt - 2] + ',' + MoonDifAccumListB[AnomaAccumInt - 1] + ',' + MoonDifAccumListB[AnomaAccumInt]
                MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 3, Initial)
            }
        }
    } else {
        const AnomaAccumInt = ~~AnomaAccum
        if (AnomaAccumInt <= 25) {
            Initial = MoonDifAccumList[AnomaAccumInt] + ',' + MoonDifAccumList[AnomaAccumInt + 1] + ',' + MoonDifAccumList[AnomaAccumInt + 2]
            MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 1, Initial)
        } else {
            Initial = MoonDifAccumList[AnomaAccumInt - 2] + ',' + MoonDifAccumList[AnomaAccumInt - 1] + ',' + MoonDifAccumList[AnomaAccumInt]
            MoonDifAccum2 = Interpolate1(AnomaAccumFrac + 3, Initial)
        }
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
// console.log(MoonTcorrTable(27, 'Linde'))

const MoonFormula = (AnomaAccum, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Anoma,
        FaslowDing,
        FaslowPing,
        FaslowLi,
        XianConst,
    } = AutoPara[CalName]
    const HalfAnoma = +((Anoma / 2).toFixed(6)) // 轉中
    let MoonDifAccum = 0
    let MoonAcrV = 0
    let signB = 1
    let MoonAcrVDeg = 0
    if (Type === 11) {
        let signA = 1
        let FaslowT = 0
        if (AnomaAccum <= Anoma / 4) {
            FaslowT = AnomaAccum / XianConst
            signA = -1
        } else if (AnomaAccum <= Anoma / 2) {
            FaslowT = (HalfAnoma - AnomaAccum) / XianConst
            signA = -1
        } else if (AnomaAccum <= Anoma * 3 / 4) {
            FaslowT = (AnomaAccum - HalfAnoma) / XianConst
            signA = 1
        } else {
            FaslowT = (Anoma - AnomaAccum) / XianConst
            signA = 1
        }
        MoonDifAccum = signA * (FaslowDing * FaslowT - FaslowPing * FaslowT ** 2 - FaslowLi * FaslowT ** 3) / 100 // 遲疾差
        let signB = 1
        let AnomaXian = 0
        if (AnomaAccum <= 6.642) {
            AnomaXian = AnomaAccum / XianConst
            signB = 1
        } else if (AnomaAccum <= 7.052) {
            AnomaXian = AnomaAccum / XianConst
            signB = 0
        } else if (AnomaAccum <= 20.4193) {
            AnomaXian = Math.abs(HalfAnoma - AnomaAccum) / XianConst
            signB = -1
        } else if (AnomaAccum <= 20.8293) {
            AnomaXian = Math.abs(HalfAnoma - AnomaAccum) / XianConst
            signB = 0
        } else {
            AnomaXian = (Anoma - AnomaAccum) / XianConst
            signB = 1
        }
        MoonAcrV = 1.0962 + signB * (0.11081575 - 0.0005815 * AnomaXian - 0.00000975 * AnomaXian * (AnomaXian - 1)) // 遲疾限下行度
    } else {
        if (CalName === 'Mingtian') {
            // AnomaAccum = big.div(OriginAccum, Lunar).add(i - 1 + ZhengOriginDif).mul(2142887000).mod(AnomaNumer).floor().div(81120000).toNumber()
            // AnomaAccum[i] = (Math.floor(OriginAccum / Lunar + i - 1 + ZhengOriginDif) * 2142887000 % AnomaNumer) / 81120000
            AnomaAccum *= 13.36875
            AnomaAccum %= 368.3708364275
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
            if (AnomaAccum > Anoma / 2) {
                AnomaAccum -= Anoma / 2
            } else {
                signB = -1
            }
            MoonDifAccum = signB * AnomaAccum * (Anoma / 2 - AnomaAccum) / 9.4
        }
    }
    return { MoonDifAccum, MoonAcrV }
}
// console.log(MoonFormula(14, 'Mingtian').MoonDifAccum)

export const AutoTcorr = (AnomaAccum, OriginDifRaw, CalName, year) => {
    const {
        AutoPara,
        Type,
    } = Bind(CalName)
    const {
        XianConst
    } = AutoPara[CalName]
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
    let SunDifAccum = 0
    let MoonDifAccum = 0
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Qintian', 'Fengyuan', 'Zhantian', 'Yangji', 'Chunyou', 'Huitian', 'Bentian', 'Yiwei', 'Gengwu'].includes(CalName)) {
        if (CalName === 'Huangchu') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Qianxiang').Tcorr1
        } else if (['Liuzhi', 'Wangshuozhi', 'Sanji'].includes(CalName)) {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Jingchu').Tcorr1
        } else if (CalName === 'Xuanshi') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Zhengguang').Tcorr1
        } else if (['Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang'].includes(CalName)) {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Tianbao').Tcorr1
        } else if (CalName === 'Liangwu') {
            Tcorr1 = AutoTcorr(AnomaAccum, 0, 'Liangwu').Tcorr1
        } else if (['Zhangmengbin', 'Liuxiaosun'].includes(CalName)) {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Huangji')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (CalName === 'Shenlong') {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Linde')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (CalName === 'Zhide') {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Dayan')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (CalName === 'Qintian') {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Xuanming')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (['Fengyuan', 'Zhantian'].includes(CalName)) {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Guantian')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (CalName === 'Yangji') {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Jiyuan')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (['Chunyou', 'Huitian', 'Bentian'].includes(CalName)) {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'Chengtian')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        } else if (['Yiwei', 'Gengwu'].includes(CalName)) {
            TcorrFunc = AutoTcorr(AnomaAccum, OriginDifRaw, 'NewDaming')
            Tcorr1 = TcorrFunc.Tcorr1
            Tcorr2 = TcorrFunc.Tcorr2
        }
    } else {
        const MoonAvgVDeg = AutoMoonAvgV(CalName, AnomaAccum)
        if (['Daye', 'Wuyin'].includes(CalName)) {
            SunTcorr1 = SunTcorrTable(OriginDifRaw, CalName).SunTcorr1
            MoonTcorr1 = MoonTable1(AnomaAccum, CalName).MoonTcorr1
            Tcorr1 = SunTcorr1 + MoonTcorr1
        } else if (Type <= 4) {
            MoonTcorr1 = MoonTable1(AnomaAccum, CalName).MoonTcorr1
            Tcorr1 = MoonTcorr1
        } else if (['Yitian', 'Guantian'].includes(CalName)) {
            SunDifAccum = SunFormula(OriginDifRaw, CalName)
            const moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            MoonTcorr2 = moonFunc.MoonTcorr2
            MoonTcorr1 = moonFunc.MoonTcorr1
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr2 + MoonTcorr1
        } else if (['Futian', 'Mingtian'].includes(CalName)) {
            SunDifAccum = SunFormula(OriginDifRaw, CalName)
            MoonDifAccum = MoonFormula(AnomaAccum, CalName).MoonDifAccum
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            MoonTcorr2 = MoonDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
        } else if (Type < 11) {
            sunFunc = SunTcorrTable(OriginDifRaw, CalName)
            moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            SunTcorr2 = sunFunc.SunTcorr2
            SunTcorr1 = sunFunc.SunTcorr1
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            if (['Xuanming', 'Yingtian'].includes(CalName)) {
                MoonTcorr2 = -MoonTcorr2
                MoonTcorr1 = -MoonTcorr1
            }
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr1 + MoonTcorr1
        } else if (Type === 11) {
            SunDifAccum = SunFormula(OriginDifRaw, CalName)
            moonFunc = MoonFormula(AnomaAccum, CalName)
            MoonDifAccum = moonFunc.MoonDifAccum
            SunTcorr2 = SunDifAccum * XianConst / moonFunc.MoonAcrV
            MoonTcorr2 = MoonDifAccum * XianConst / moonFunc.MoonAcrV
            Tcorr2 = SunTcorr2 + MoonTcorr2
            NodeAccumCorr = Tcorr2
        } else if (Type === 20) {
            sunFunc = SunWest(OriginDifRaw, year)
            moonFunc = MoonWest(AnomaAccum, year)
            SunDifAccum = sunFunc.SunDifAccum
            MoonDifAccum = moonFunc.MoonDifAccum
            SunTcorr2 = SunDifAccum / (moonFunc.MoonAcrV - sunFunc.SunAcrV)
            MoonTcorr2 = -MoonDifAccum / (moonFunc.MoonAcrV - sunFunc.SunAcrV)
            Tcorr2 = SunTcorr2 + MoonTcorr2
        }
        if (Type >= 6 && Type <= 10) { // 其他曆法都是這樣，不懂授時為何就是定朔加減差
            NodeAccumCorr = SunTcorr2 - 0.0785077 * MoonTcorr2 // 皇極 465/5923，麟徳61/777，大衍343/4369，崇天141/1796，都是0.0785
        }
    }
    return {
        SunTcorr2,
        SunTcorr1,
        MoonTcorr2,
        MoonTcorr1,
        Tcorr2,
        Tcorr1,
        NodeAccumCorr,
    }
}
// console.log(AutoTcorr(27.4, 365.142, 'Tongtian', 1997).Tcorr2)

export const AutoDifAccum = (AnomaAccum, OriginDifRaw, CalName, year) => {
    const {
        Type,
    } = Bind(CalName)
    let SunDifAccum = 0
    let MoonDifAccum = 0
    let DifAccum = 0
    if (Type <= 4) {
        MoonDifAccum = MoonTable1(AnomaAccum, CalName).MoonDifAccum1
        DifAccum = MoonDifAccum
    } else if (['Yitian', 'Guantian'].includes(CalName)) {
        SunDifAccum = SunFormula(OriginDifRaw, CalName)
        MoonDifAccum = MoonDifAccumTable(AnomaAccum, CalName)
        MoonDifAccum = -MoonDifAccum
        DifAccum = SunDifAccum + MoonDifAccum
    } else if (['Futian', 'Mingtian'].includes(CalName) || Type === 11) {
        SunDifAccum = SunFormula(OriginDifRaw, CalName)
        MoonDifAccum = MoonFormula(AnomaAccum, CalName).MoonDifAccum
        MoonDifAccum = -MoonDifAccum
        DifAccum = SunDifAccum + MoonDifAccum
    } else if (Type < 11) {
        SunDifAccum = SunDifAccumTable(OriginDifRaw, CalName)
        MoonDifAccum = MoonDifAccumTable(AnomaAccum, CalName)
        if (['Xuanming', 'Yingtian'].includes(CalName)) {
            MoonDifAccum = -MoonDifAccum
        }
        DifAccum = SunDifAccum + MoonDifAccum
    } else if (Type === 11) {
        SunDifAccum = SunFormula(OriginDifRaw, CalName)
        MoonDifAccum = MoonFormula(AnomaAccum, CalName).MoonDifAccum
        DifAccum = SunDifAccum + MoonDifAccum
    } else if (Type === 20) {
        SunDifAccum = SunWest(OriginDifRaw, year).SunDifAccum
        MoonDifAccum = MoonWest(AnomaAccum, year).MoonDifAccum
        DifAccum = SunDifAccum + MoonDifAccum
    }
    return {
        SunDifAccum,
        MoonDifAccum,
        DifAccum,
    }
}
// console.log(AutoDifAccum(7, 365.142, 'Futian', 1997).MoonDifAccum)