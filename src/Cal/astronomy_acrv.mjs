import {
    Bind,
} from './bind.mjs'
import {
    SunAcrVWest, MoonAcrVWest
} from './astronomy_west.mjs'
import {
    Interpolate1, Interpolate3
} from './equa_sn.mjs'

export const AutoMoonAvgV = CalName => {
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
    } else if (CalName === 'Huangji') { // 皇極平行速695。皇極、宣明更好的方法是Math.floor，但是爲了保持統一，這裏還是麻煩一下
        Plus = -0.00295858
    } else if (CalName === 'Xuanming') {
        Plus = 0.000301739405
    }
    if (['WuyinA', 'WuyinB'].includes(CalName)) {
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
        MoonAvgVDeg = parseFloat(((Sidereal || Solar) / Lunar + 1 + Plus).toPrecision(14))
    }
    return MoonAvgVDeg
}

// 大衍用不等間距二次內插，宣明也是。崇玄暫且用平氣。計算盈縮積
export const SunDifAccumTable = (WinsolsDif, CalName) => {
    const { Type, AutoPara
    } = Bind(CalName)
    const { SunAcrAvgDifList, TermRangeA, TermRangeS, SolarRaw, AcrTermList,
    } = AutoPara[CalName]
    let { Denom, Solar
    } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarRaw
    }
    if (Type >= 8 && CalName !== 'Qianyuan') { // 崇玄也是萬分母
        Denom = 10000
    }
    // Solar = 365 + 416 / 1700
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
    SunDifAccumList[24] = 0
    SunDifAccumList[25] = SunDifAccumList[1]
    // const AcrTermList = [] // 定氣距冬至日數
    // for (let i = 0; i <= 23; i++) {
    //     AcrTermList[i] = +(HalfTermLeng * i - SunDifAccumList[i]).toFixed(6)
    // }
    // AcrTermList[0] = 0
    // AcrTermList[24] = +Solar.toFixed(6)
    // AcrTermList[25] = +(AcrTermList[1] + Solar).toFixed(6)
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
        let TermRange1 = 0
        const TermNum1 = ~~(WinsolsDif / HalfTermLeng)  // 朔望所在氣名
        const TermNum2 = (TermNum1 + 1) % 24
        const TermNewmDif = WinsolsDif - TermNum1 * HalfTermLeng // 注意要減1。朔望入氣日數
        if (['LindeA', 'LindeB', 'Huangji', 'Shenlong'].includes(CalName)) {
            if ((WinsolsDif < 6 * HalfTermLeng) || (WinsolsDif >= 18 * HalfTermLeng)) {
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
// console.log(SunDifAccumTable(341, 'Qianyuan'))

// 計算朓朒積
const SunTcorrTable = (WinsolsDif, CalName) => {
    const { AutoPara, Type
    } = Bind(CalName)
    const { SolarRaw, SunTcorrList, AcrTermList, TermRangeA, TermRangeS,
    } = AutoPara[CalName]
    let { Denom, Solar,
    } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarRaw
    }
    let HalfTermLeng = Solar / 24
    const TermNum = ~~(WinsolsDif / HalfTermLeng)
    let SunTcorr1 = 0
    let SunTcorr2 = 0
    if (Type === 7) {
        let TermNum = 0
        for (let j = 0; j <= 23; j++) {
            if (WinsolsDif >= AcrTermList[j] && WinsolsDif < AcrTermList[j + 1]) {
                TermNum = j
                break
            }
        }
        const Initial = AcrTermList[TermNum] + ',' + SunTcorrList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + SunTcorrList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + SunTcorrList[TermNum + 2]
        SunTcorr2 = Interpolate3(WinsolsDif, Initial)  // 直接拉格朗日內插，懶得寫了
        const TermRange = AcrTermList[TermNum + 1] - AcrTermList[TermNum] // 本氣長度
        SunTcorr1 = SunTcorrList[TermNum] + (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum]) * (WinsolsDif - AcrTermList[TermNum]) / TermRange
    } else {
        let TermRange = HalfTermLeng
        if (['Huangji', 'LindeA', 'LindeB',].includes(CalName)) {
            if ((WinsolsDif < 6 * HalfTermLeng) || (WinsolsDif >= 18 * HalfTermLeng)) {
                TermRange = TermRangeA // 秋分後
            } else {
                TermRange = TermRangeS // 春分後
            }
        }
        if (CalName === 'Wuiyn') {
            Denom = 11830
        }
        const n = (WinsolsDif - TermNum * HalfTermLeng) / TermRange
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
// console.log(SunTcorrTable(341, 'Dayan'))

export const SunFormula = (WinsolsDif, CalName) => {
    const { AutoPara, Type
    } = Bind(CalName)
    const { Denom, SolarRaw, ExpanDing, ExpanPing, ExpanLi, ContracDing, ContracPing, ContracLi,
    } = AutoPara[CalName]
    let { Solar } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarRaw
    }
    const HalfSolar = +((Solar / 2).toFixed(6))
    let SunDifAccum = 0
    let signA = 1
    let Smallquadrant = 0
    let ExconT = 0
    if (Type === 11) {
        if (WinsolsDif <= 88.909225) {
            const ExconT = WinsolsDif
            SunDifAccum = (ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000 // 盈縮差
        } else if (WinsolsDif <= HalfSolar) {
            const ExconT = HalfSolar - WinsolsDif
            SunDifAccum = (ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
        } else if (WinsolsDif <= HalfSolar + 93.712025) {
            const ExconT = WinsolsDif - HalfSolar
            SunDifAccum = -(ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
        } else {
            const ExconT = Solar - WinsolsDif
            SunDifAccum = -(ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000
        }
    } else {
        if (CalName === 'Yitian') {
            const SmallquadrantA = 897699.5
            const SmallquadrantB = 946785.5 // 陳美東《崇玄儀天崇天三曆晷長計算法》改正該値
            if (WinsolsDif <= SmallquadrantA / Denom) {
                Smallquadrant = SmallquadrantA
                ExconT = WinsolsDif
            } else if (WinsolsDif <= HalfSolar) {
                Smallquadrant = SmallquadrantB
                ExconT = HalfSolar - WinsolsDif
            } else if (WinsolsDif <= HalfSolar + SmallquadrantB / Denom) {
                signA = -1
                Smallquadrant = SmallquadrantB
                ExconT = WinsolsDif - HalfSolar
            } else {
                signA = -1
                Smallquadrant = SmallquadrantA
                ExconT = Solar - WinsolsDif
            }
            const ExconAccum = 24543 // 盈縮積
            const E = ExconAccum * Denom * 2 / Smallquadrant // 初末限平率
            const F = E * Denom / Smallquadrant // 日差
            SunDifAccum = signA * (ExconT * (E - F / 2) - ExconT * (ExconT - 1) * F / 2) / Denom // 盈縮定分、先後數。極値2.45
        } else if (['Fengyuan', 'Guantian', 'Zhantian'].includes(CalName)) {
            let SunDenom = 0
            const SmallquadrantA = 88 + 10958 / 12030
            const SmallquadrantB = 93 + 8552 / 12030
            const SunDenomA = 3294
            const SunDenomB = 3659
            if (WinsolsDif <= SmallquadrantA) {
                Smallquadrant = SmallquadrantA
                SunDenom = SunDenomA
                ExconT = WinsolsDif
            } else if (WinsolsDif <= HalfSolar) {
                Smallquadrant = SmallquadrantB
                SunDenom = SunDenomB
                ExconT = HalfSolar - WinsolsDif
            } else if (WinsolsDif <= HalfSolar + SmallquadrantB) {
                Smallquadrant = SmallquadrantB
                SunDenom = SunDenomB
                signA = -1
                ExconT = WinsolsDif - HalfSolar
            } else {
                Smallquadrant = SmallquadrantA
                SunDenom = SunDenomA
                signA = -1
                ExconT = Solar - WinsolsDif
            }
            SunDifAccum = signA * (ExconT / SunDenom) * (Smallquadrant * 2 - ExconT) // 盈縮差度分。極值2.37
        } else if (CalName === 'Mingtian') {
            if (WinsolsDif <= Solar / 4) {
                ExconT = WinsolsDif
            } else if (WinsolsDif <= HalfSolar) {
                ExconT = HalfSolar - WinsolsDif
            } else if (WinsolsDif <= Solar * 0.75) {
                signA = -1
                ExconT = WinsolsDif - HalfSolar
            } else {
                signA = -1
                ExconT = Solar - WinsolsDif
            }
            SunDifAccum = signA * ExconT * (200 - ExconT) / 4135 // 盈縮差度分。極值2.4
            // SunTcorr = signA * ExconT * (200 - ExconT) * 400 / 567/Denom 按照月速13.36875算出來，和上面的算式沒有區別，很好
        } else if (CalName === 'Futian') {
            if (WinsolsDif > HalfSolar) {
                WinsolsDif -= HalfSolar
                signA = -1
            }
            SunDifAccum = signA * WinsolsDif * (HalfSolar - WinsolsDif) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得爲立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000爲分母。
        }
    }
    return SunDifAccum
}
// console.log(SunFormula(14, 'Shoushi'))

// 這是魏晉南北朝的月離表
const MoonTcorrTable1 = (AnomaAccum, CalName) => {
    const { AutoPara,
    } = Bind(CalName)
    const { MoonAcrVList, MoonDifAccumList, Anoma, ZhangRange
    } = AutoPara[CalName]
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
    return {
        MoonDifAccum1,
        MoonTcorr1
    }
}
// console.log(MoonTcorrTable1(14, 'Daming').MoonDifAccum1)

const MoonAcrSTable1 = (AnomaAccum, CalName) => {
    const { AutoPara,
    } = Bind(CalName)
    const { MoonDifAccumList, ZhangRange
    } = AutoPara[CalName]
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
    const { AutoPara,
    } = Bind(CalName)
    const { MoonTcorrList, MoonTcorrListA, MoonTcorrListB, Anoma, Denom
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const HalfAnoma = Anoma / 2
    const AnomaAccumHalf = AnomaAccum % HalfAnoma
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFrac = AnomaAccum - AnomaAccumInt
    const AnomaAccumHalfFrac = AnomaAccumHalf - AnomaAccumHalfInt
    let Initial = ''
    let MoonTcorr1 = 0
    let MoonTcorr2 = 0
    if (MoonTcorrListA) {
        if (AnomaAccum < HalfAnoma) {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonTcorrListA[AnomaAccumHalfInt] + ',' + MoonTcorrListA[AnomaAccumHalfInt + 1] + ',' + MoonTcorrListA[AnomaAccumHalfInt + 2]
                MoonTcorr2 = Interpolate1(AnomaAccumHalfFrac + 1, Initial)
            } else {
                Initial = MoonTcorrListA[AnomaAccumHalfInt - 2] + ',' + MoonTcorrListA[AnomaAccumHalfInt - 1] + ',' + MoonTcorrListA[AnomaAccumHalfInt]
                MoonTcorr2 = Interpolate1(AnomaAccumHalfFrac + 3, Initial)
            }
            if (AnomaAccumHalfInt <= 12) {
                MoonTcorr1 = (MoonTcorrListA[AnomaAccumHalfInt] + AnomaAccumHalfFrac * (MoonTcorrListA[AnomaAccumHalfInt + 1] - MoonTcorrListA[AnomaAccumHalfInt]))
            } else {
                MoonTcorr1 = (MoonTcorrListA[AnomaAccumHalfInt] - (AnomaAccumHalfFrac / (Anoma - 27)) * MoonTcorrListA[AnomaAccumHalfInt])
            }
        } else {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonTcorrListB[AnomaAccumHalfInt] + ',' + MoonTcorrListB[AnomaAccumHalfInt + 1] + ',' + MoonTcorrListB[AnomaAccumHalfInt + 2]
                MoonTcorr2 = Interpolate1(AnomaAccumHalfFrac + 1, Initial)
            } else {
                Initial = MoonTcorrListB[AnomaAccumHalfInt - 2] + ',' + MoonTcorrListB[AnomaAccumHalfInt - 1] + ',' + MoonTcorrListB[AnomaAccumHalfInt]
                MoonTcorr2 = Interpolate1(AnomaAccumHalfFrac + 3, Initial)
            }
            if (AnomaAccumHalfInt <= 12) {
                MoonTcorr1 = (MoonTcorrListB[AnomaAccumHalfInt] + AnomaAccumHalfFrac * (MoonTcorrListB[AnomaAccumHalfInt + 1] - MoonTcorrListB[AnomaAccumHalfInt]))
            } else {
                MoonTcorr1 = (MoonTcorrListB[AnomaAccumHalfInt] - (AnomaAccumHalfFrac / (Anoma - 27)) * MoonTcorrListB[AnomaAccumHalfInt])
            }
        }
    } else {
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

const MoonDifAccumTable = (AnomaAccum, CalName) => {
    const { AutoPara, Type
    } = Bind(CalName)
    const { Anoma, MoonAcrV, MoonAcrVA, MoonAcrVB, Denom
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const HalfAnoma = Anoma / 2
    const AnomaAccumHalf = AnomaAccum % HalfAnoma
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFrac = AnomaAccum - AnomaAccumInt
    const AnomaAccumHalfFrac = AnomaAccumHalf - AnomaAccumHalfInt
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    // const MoonAvgV = parseFloat((MoonAvgVDeg * Denom).toPrecision(12))
    // 下月離表。麟德：盈加朒減，速減遲加
    const MoonAcrAvgDifList = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會爲實平行差。麟德爲增減率
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
        if (AnomaAccum < HalfAnoma) {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonDifAccumListA[AnomaAccumHalfInt] + ',' + MoonDifAccumListA[AnomaAccumHalfInt + 1] + ',' + MoonDifAccumListA[AnomaAccumHalfInt + 2]
                MoonDifAccum2 = Interpolate1(AnomaAccumHalfFrac + 1, Initial)
            } else {
                Initial = MoonDifAccumListA[AnomaAccumHalfInt - 2] + ',' + MoonDifAccumListA[AnomaAccumHalfInt - 1] + ',' + MoonDifAccumListA[AnomaAccumHalfInt]
                MoonDifAccum2 = Interpolate1(AnomaAccumHalfFrac + 3, Initial)
            }
        } else {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonDifAccumListB[AnomaAccumHalfInt] + ',' + MoonDifAccumListB[AnomaAccumHalfInt + 1] + ',' + MoonDifAccumListB[AnomaAccumHalfInt + 2]
                MoonDifAccum2 = Interpolate1(AnomaAccumHalfFrac + 1, Initial)
            } else {
                Initial = MoonDifAccumListB[AnomaAccumHalfInt - 2] + ',' + MoonDifAccumListB[AnomaAccumHalfInt - 1] + ',' + MoonDifAccumListB[AnomaAccumHalfInt]
                MoonDifAccum2 = Interpolate1(AnomaAccumHalfFrac + 3, Initial)
            }
        }
    } else {
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
// console.log(MoonDifAccumTable(9, 'Dayan'))

const MoonAcrSTable2 = (AnomaAccum, CalName) => {
    const { AutoPara, Type
    } = Bind(CalName)
    const { Anoma, MoonAcrV, MoonAcrVA, MoonAcrVB, Denom
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const HalfAnoma = Anoma / 2
    const AnomaAccumHalf = AnomaAccum % HalfAnoma
    const AnomaAccumHalfInt = ~~AnomaAccumHalf
    const AnomaAccumInt = ~~AnomaAccum
    const AnomaAccumFrac = AnomaAccum - AnomaAccumInt
    const AnomaAccumHalfFrac = AnomaAccumHalf - AnomaAccumHalfInt
    let MoonDegDenom = Denom
    if (Type >= 8 && CalName !== 'Chongxuan') {
        MoonDegDenom = 100
        if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    let MoonAcrSList = []
    let MoonAcrSListA = []
    let MoonAcrSListB = []
    if (MoonAcrVA) {
        const MoonAcrVDegA = []
        for (let i = 0; i <= 13; i++) {
            MoonAcrVDegA[i] = MoonAcrVA[i] / MoonDegDenom
        }
        const MoonAcrVDegB = []
        for (let i = 0; i <= 13; i++) {
            MoonAcrVDegB[i] = MoonAcrVB[i] / MoonDegDenom
        }
        MoonAcrSListA = MoonAcrVDegA.slice()
        for (let i = 1; i <= 13; i++) {
            MoonAcrSListA[i] += MoonAcrSListA[i - 1]
        }
        MoonAcrSListB = MoonAcrVDegB.slice()
        for (let i = 1; i <= 13; i++) {
            MoonAcrSListB[i] += MoonAcrSListB[i - 1]
        }
    } else {
        const MoonAcrVDeg = []
        for (let i = 0; i <= 27; i++) {
            MoonAcrVDeg[i] = MoonAcrV[i] / MoonDegDenom
        }
        MoonAcrSList = MoonAcrVDeg.slice()
        for (let i = 1; i <= 27; i++) {
            MoonAcrSList[i] += MoonAcrSList[i - 1]
        }
    }
    let MoonAcrS = 0
    if (MoonAcrVA) {
        if (AnomaAccum < HalfAnoma) {
            if (AnomaAccumHalfInt <= 11) {
                const Initial = MoonAcrSListA[AnomaAccumHalfInt] + ',' + MoonAcrSListA[AnomaAccumHalfInt + 1] + ',' + MoonAcrSListA[AnomaAccumHalfInt + 2]
                MoonAcrS = Interpolate1(AnomaAccumHalfFrac, Initial)
            } else {
                const Initial = MoonAcrSListA[AnomaAccumHalfInt - 2] + ',' + MoonAcrSListA[AnomaAccumHalfInt - 1] + ',' + MoonAcrSListA[AnomaAccumHalfInt]
                MoonAcrS = Interpolate1(AnomaAccumHalfFrac + 1, Initial)
            }
        } else {
            if (AnomaAccumHalfInt <= 11) {
                const Initial = MoonAcrSListB[AnomaAccumHalfInt] + ',' + MoonAcrSListB[AnomaAccumHalfInt + 1] + ',' + MoonAcrSListB[AnomaAccumHalfInt + 2]
                MoonAcrS = Interpolate1(AnomaAccumHalfFrac, Initial)
            } else {
                const Initial = MoonAcrSListB[AnomaAccumHalfInt - 2] + ',' + MoonAcrSListB[AnomaAccumHalfInt - 1] + ',' + MoonAcrSListB[AnomaAccumHalfInt]
                MoonAcrS = Interpolate1(AnomaAccumHalfFrac + 2, Initial)
            }
        }
        // let HalfAnomaCycle = 0
        // if (CalName === 'Xuanming') {
        //     HalfAnomaCycle = 187.37
        // } else if (CalName === 'Yingtian') {
        //     HalfAnomaCycle = 187.27
        // } else if (CalName === 'Yitian') {
        //     HalfAnomaCycle = 187.13
        // }
        // if (AnomaAccum > HalfAnoma) {
        //     MoonAcrS += HalfAnomaCycle
        // }
    } else {
        if (AnomaAccumInt <= 25) {
            const Initial = MoonAcrSList[AnomaAccumInt] + ',' + MoonAcrSList[AnomaAccumInt + 1] + ',' + MoonAcrSList[AnomaAccumInt + 2]
            MoonAcrS = Interpolate1(AnomaAccumFrac, Initial)
        } else {
            const Initial = MoonAcrSList[AnomaAccumInt - 2] + ',' + MoonAcrSList[AnomaAccumInt - 1] + ',' + MoonAcrSList[AnomaAccumInt]
            MoonAcrS = Interpolate1(AnomaAccumFrac + 2, Initial)
        }
    }
    return MoonAcrS
}
// console.log(MoonAcrSTable2(0.1, 'Xuanming'))

const MoonFormula = (AnomaAccumRaw, CalName) => {
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
            FaslowT = (HalfAnoma - AnomaAccumRaw) / XianConst
        } else if (AnomaAccumRaw <= Anoma * 3 / 4) {
            FaslowT = (AnomaAccumRaw - HalfAnoma) / XianConst
            signA = -1
        } else {
            FaslowT = (Anoma - AnomaAccumRaw) / XianConst
            signA = -1
        }
        MoonDifAccum = signA * (FaslowDing * FaslowT - FaslowPing * FaslowT ** 2 - FaslowLi * FaslowT ** 3) / 100 // 遲疾差
        let signB = 1
        let AnomaXian = 0
        if (AnomaAccumRaw <= 6.642) {
            AnomaXian = AnomaAccumRaw / XianConst
            signB = 1
        } else if (AnomaAccumRaw <= 7.052) {
            AnomaXian = AnomaAccumRaw / XianConst
            signB = 0
        } else if (AnomaAccumRaw <= 20.4193) {
            AnomaXian = Math.abs(HalfAnoma - AnomaAccumRaw) / XianConst
            signB = -1
        } else if (AnomaAccumRaw <= 20.8293) {
            AnomaXian = Math.abs(HalfAnoma - AnomaAccumRaw) / XianConst
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
    const { AutoPara, Type,
    } = Bind(CalName)
    const { SolarRaw, XianConst, Anoma, NodeDenom
    } = AutoPara[CalName]
    let { Solar
    } = AutoPara[CalName]
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
    if (['Huangchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Xuanshi', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Liangwu', 'Zhangmengbin', 'Liuxiaosun', 'Shenlong', 'Zhide', 'Qintian', 'Zhidao1', 'Zhidao2', 'Fengyuan', 'Zhantian', 'Daming2', 'Chunyou', 'Huitian', 'Bentian', 'Yiwei', 'Gengwu'].includes(CalName)) {
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
            } else if (CalName === 'Zhide') {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Dayan')
            } else if (CalName === 'Qintian') {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Tsrengyuan') // 欽天近地點入轉
            } else if (['Zhidao1', 'Zhidao2'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Qianyuan')
            } else if (['Fengyuan', 'Zhantian'].includes(CalName)) {
                TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDif, 'Guantian')
            } else if (CalName === 'Daming2') {
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
        } else if (['Yitian', 'Guantian'].includes(CalName)) {
            SunDifAccum = SunFormula(WinsolsDif, CalName)
            const moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr2 + MoonTcorr1
        } else if (['Futian', 'Mingtian'].includes(CalName)) {
            SunDifAccum = SunFormula(WinsolsDif, CalName)
            MoonDifAccum = MoonFormula(AnomaAccum, CalName).MoonDifAccum
            SunTcorr2 = SunDifAccum / MoonAvgVDeg
            MoonTcorr2 = -MoonDifAccum / MoonAvgVDeg
            Tcorr2 = SunTcorr2 + MoonTcorr2
        } else if (Type < 11) {
            sunFunc = SunTcorrTable(WinsolsDif, CalName)
            moonFunc = MoonTcorrTable(AnomaAccum, CalName)
            SunTcorr2 = sunFunc.SunTcorr2
            SunTcorr1 = sunFunc.SunTcorr1
            MoonTcorr2 = -moonFunc.MoonTcorr2
            MoonTcorr1 = -moonFunc.MoonTcorr1
            Tcorr2 = SunTcorr2 + MoonTcorr2
            Tcorr1 = SunTcorr1 + MoonTcorr1
        } else if (Type === 11) {
            SunDifAccum = SunFormula(WinsolsDif, CalName)
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
            NodeAccumCorr = SunTcorr2 + 0.0785077 * MoonTcorr2 //  // 劉金沂《麟德曆交食計算法》。  // 定交分=泛交分+太陽改正+(61/777)*月亮改正。61/777是27.2122/346.62的漸進分數！恆星月日數/恆星年日數= s/m ，交率（卽交點月）/交數（卽交點年日數）= (s-n)/(m-n)=27.2122/346.608=1/12.737=0.0785 皇極 465/5923，麟德61/777，大衍343/4369，崇天141/1796，都是0.0785。const signNodeAccum = 1 // NodeAccumHalf > QuarNode ? -1 : 1// 交前、先交。交後交在後，符號同定朔改正，交前，與定朔相反。
            // 至少大衍的符號和定朔完全相同「⋯⋯以朓減朒加入交常」
            NodeAccumCorr2 = 0.0785077 * SunTcorr2 + MoonTcorr2 // 太陽入交定日，上面是月亮入交定日
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
        SunTcorr,
        MoonTcorr,
        SunTcorr2,
        SunTcorr1,
        MoonTcorr2,
        MoonTcorr1,
        Tcorr2,
        Tcorr1,
        NodeAccumCorr,
        NodeAccumCorr2,
    }
}
// console.log(AutoTcorr(6, 9, 'Shoushi', 1997).MoonTcorr2)

export const AutoDifAccum = (AnomaAccum, WinsolsDif, CalName, year) => {
    const { AutoPara, Type,
    } = Bind(CalName)
    const { SolarRaw, Anoma
    } = AutoPara[CalName]
    let { Solar
    } = AutoPara[CalName]
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
            } else if (CalName === 'Daming2') {
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
            SunDifAccum = SunFormula(WinsolsDif, CalName)
            MoonDifAccum = MoonDifAccumTable(AnomaAccum, CalName)
        } else if (['Futian', 'Mingtian'].includes(CalName) || Type === 11) {
            SunDifAccum = SunFormula(WinsolsDif, CalName)
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
    const { Type, AutoPara
    } = Bind(CalName)
    const { Anoma
    } = AutoPara[CalName]
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
            } else if (CalName === 'Daming2') {
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
