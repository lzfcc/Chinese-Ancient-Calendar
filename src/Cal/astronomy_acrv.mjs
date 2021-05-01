import {
    Bind,
} from './bind.mjs'
import {
    SunWest,
    MoonWest
} from './astronomy_west.mjs'
import {
    Interpolate1_quick,
    Interpolate3_quick
} from './equa_sn.mjs'

const AutoMoonAvgV = (CalName) => {
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

// console.log(SunTable1(91, 'Wuyin'))
// 《中國古代曆法》頁497 與大多數曆法不同，大衍的日躔是定氣，每氣間隔不同
const SunTcorrTable_BACKUP = (OriginDifRaw, CalName) => { // 這是用速度來計算的，根據曆法的二次內插公式
    const {
        Type,
        AutoPara
    } = Bind(CalName)
    const {
        SunAcrAvgDifList,
        Denom,
        TermRangeA,
        TermRangeS,
    } = AutoPara[CalName]
    let {
        Solar,
    } = AutoPara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
    }
    const TermLeng = Solar / 12
    const HalfTermLeng = Solar / 24
    let SunDenom = Denom
    if (Type >= 8 && CalName !== 'Qianyuan') { // 崇玄也是萬分母
        SunDenom = 10000
    }
    const SunAcrAvgDifListList = [] // 這個多此一舉的SunAcrAvgDifListList一定不能刪掉，否則多次運算就會越來越小
    for (let i = 1; i <= 25; i++) {
        SunAcrAvgDifListList[i] = SunAcrAvgDifList[i] / SunDenom
    }
    SunAcrAvgDifListList[0] = 0
    let SunDifAccumList = SunAcrAvgDifListList.slice()
    for (let i = 1; i <= 24; i++) {
        SunDifAccumList[i] += SunDifAccumList[i - 1]
        SunDifAccumList[i] = parseFloat((SunDifAccumList[i]).toPrecision(14))
    }
    SunDifAccumList = SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    SunDifAccumList[0] = 0
    SunDifAccumList[13] = 0
    SunDifAccumList[25] = 0

    const TermNum1 = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1) // 朔望所在氣名
    const TermNum2 = Math.round((TermNum1 + 1) % 24.1)
    const TermNewmDif = OriginDifRaw - (TermNum1 - 1) * HalfTermLeng // 注意要減1。朔望入氣日數
    let TermRange1 = 0
    // let TermRange2 = 0
    if (['Linde', 'Huangji', 'Shenlong'].includes(CalName)) {
        if ((OriginDifRaw < 3 * TermLeng) || (OriginDifRaw >= 9 * TermLeng)) {
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
    const SunDifAccum2 = SunDifAccumList[TermNum1] + 0.5 * (TermNewmDif / TermRange1) * (SunAcrAvgDif1 + SunAcrAvgDif2) + (TermNewmDif / TermRange1) * (SunAcrAvgDif1 - SunAcrAvgDif2) - 0.5 * ((TermNewmDif / TermRange1) ** 2) * (SunAcrAvgDif1 - SunAcrAvgDif2)
    const SunDifAccum1 = SunDifAccumList[TermNum1] + SunAcrAvgDif1 * (TermNewmDif / TermRange1)
    return {
        SunDifAccumList,
        SunDifAccum1,
        SunDifAccum2
    }
}
// console.log(SunTcorrTable(91.3154, 'Jiyuan').SunDifAccum2)

const SunTcorrTable = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        SunTcorrList,
        TermRangeA,
        TermRangeS,
    } = AutoPara[CalName]
    let {
        Denom,
        Solar,
    } = AutoPara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
    }
    let HalfTermLeng = Solar / 24
    const OriginDif = OriginDifRaw % Solar
    const TermNum = Math.ceil(OriginDif / HalfTermLeng)
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
    let SunTcorr2 = 0
    const n = (OriginDif - (TermNum - 1) * HalfTermLeng) / TermRange
    if (Type >= 5) {
        const Initial = SunTcorrList[TermNum] / Denom + ',' + SunTcorrList[TermNum + 1] / Denom + ',' + SunTcorrList[TermNum + 2] / Denom
        SunTcorr2 = Interpolate1_quick(n + 1, Initial)
    }
    const SunTcorr1 = (SunTcorrList[TermNum] + n * (SunTcorrList[TermNum + 1] - SunTcorrList[TermNum])) / Denom
    return { SunTcorr1, SunTcorr2 }
}
// console.log(SunTcorrTable(56.51, 'Jiyuan'))
// 大衍用不等間距二次內插，宣明也是。崇玄暫且用平氣
const SunTable3 = (OriginDifRaw, CalName) => {
    const {
        AutoPara
    } = Bind(CalName)
    const {
        Solar,
        SunAcrAvgDifList,
        Denom,
    } = AutoPara[CalName]
    const HalfTermLeng = Solar / 24
    const SunAcrAvgDifListList = [] // 這個多此一舉的SunAcrAvgDifListList一定不能刪掉，否則多次運算就會越來越小
    for (let i = 1; i <= 25; i++) {
        SunAcrAvgDifListList[i] = SunAcrAvgDifList[i] / Denom
    }
    SunAcrAvgDifListList[0] = 0
    let SunDifAccumList = SunAcrAvgDifListList.slice()
    for (let i = 1; i <= 24; i++) {
        SunDifAccumList[i] += SunDifAccumList[i - 1]
        SunDifAccumList[i] = parseFloat((SunDifAccumList[i]).toPrecision(14))
    }
    SunDifAccumList = SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    SunDifAccumList[0] = 0
    SunDifAccumList[13] = 0
    SunDifAccumList[25] = 0
    SunDifAccumList[26] = SunDifAccumList[2]
    SunDifAccumList[27] = SunDifAccumList[3]
    const TermAcrRawList = [] // 定氣距冬至日數
    for (let i = 1; i <= 24; i++) {
        TermAcrRawList[i] = HalfTermLeng * (i - 1) - SunDifAccumList[i]
    }
    TermAcrRawList[0] = 0
    TermAcrRawList[25] = Solar
    TermAcrRawList[26] = Solar + TermAcrRawList[2]
    TermAcrRawList[27] = Solar + TermAcrRawList[3]
    TermAcrRawList[28] = Solar + TermAcrRawList[4]
    const OriginDif = OriginDifRaw % Solar
    let TermNum = 1
    for (let j = 1; j <= 24; j++) { // 氣候 
        if (OriginDif >= TermAcrRawList[j] && OriginDif < TermAcrRawList[j + 1]) {
            TermNum = j
            break
        }
    }
    const Initial = TermAcrRawList[TermNum] + ',' + SunDifAccumList[TermNum] + ';' + TermAcrRawList[TermNum + 1] + ',' + SunDifAccumList[TermNum + 1] + ';' + TermAcrRawList[TermNum + 2] + ',' + SunDifAccumList[TermNum + 2]
    const SunDifAccum2 = Interpolate3_quick(OriginDif, Initial) // 直接拉格朗日內插，懶得寫了
    const TermRange1 = TermAcrRawList[TermNum + 1] - TermAcrRawList[TermNum] // 本氣長度
    const SunDifAccum1 = SunDifAccumList[TermNum] + SunAcrAvgDifListList[TermNum] * (OriginDif - TermAcrRawList[TermNum]) / TermRange1
    return {
        TermAcrRawList,
        SunDifAccumList,
        SunDifAccum1,
        SunDifAccum2
    }
}
console.log(SunTable3(14, 'Xuanming').SunDifAccum2)

const SunFormula1 = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        Solar,
        Denom
    } = AutoPara[CalName]
    let OriginDif = OriginDifRaw % Solar
    let SunTcorr = 0
    let signA = 1
    let Xian = 0
    let ExconT = 0
    if (CalName === 'Yitian') {
        const XianA = 897699.5
        const XianB = 946785.5 // 陳美東《崇玄儀天崇天三曆晷長計算法》改正該値
        if (OriginDif <= XianA / Denom) {
            Xian = XianA
            ExconT = OriginDif
        } else if (OriginDif <= Solar / 2) {
            Xian = XianB
            ExconT = Solar / 2 - OriginDif
        } else if (OriginDif <= Solar / 2 + XianB / Denom) {
            signA = -1
            Xian = XianB
            ExconT = OriginDif - Solar / 2
        } else {
            signA = -1
            Xian = XianA
            ExconT = Solar - OriginDif
        }
        const ExconAccum = 24543 // 盈縮積
        const E = ExconAccum * Denom * 2 / Xian // 初末限平率
        const F = E * Denom / Xian // 日差
        SunTcorr = signA * (ExconT * (E - F / 2) - ExconT * (ExconT - 1) * F / 2) / Denom // 盈縮定分、先後數。極値2.45
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
        } else if (OriginDif <= Solar / 2) {
            Xian = XianB
            SunDenom = SunDenomB
            ExconT = Solar / 2 - OriginDif
        } else if (OriginDif <= Solar / 2 + XianB) {
            Xian = XianB
            SunDenom = SunDenomB
            signA = -1
            ExconT = OriginDif - Solar / 2
        } else {
            Xian = XianA
            SunDenom = SunDenomA
            signA = -1
            ExconT = Solar - OriginDif
        }
        SunTcorr = signA * (ExconT / SunDenom) * (Xian * 2 - ExconT) // 盈縮差度分。極值2.37
    } else if (CalName === 'Mingtian') {
        if (OriginDif <= Solar / 4) {
            ExconT = OriginDif
        } else if (OriginDif <= Solar / 2) {
            ExconT = Solar / 2 - OriginDif
        } else if (OriginDif <= Solar * 0.75) {
            signA = -1
            ExconT = OriginDif - Solar / 2
        } else {
            signA = -1
            ExconT = Solar - OriginDif
        }
        SunTcorr = signA * ExconT * (200 - ExconT) / 4135 // 盈縮差度分。極值2.4
        // SunTcorr = signA * ExconT * (200 - ExconT) * 400 / 567
    } else if (CalName === 'Futian') {
        if (OriginDif > Solar / 2) {
            OriginDif -= Solar / 2
            signA = -1
        }
        SunTcorr = signA * OriginDif * (Solar / 2 - OriginDif) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得為立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000為分母。
    }
    return SunTcorr
}
// console.log(SunFormula1(91.31, 'Mingtian'))

const SunFormula2 = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        ExpanDing,
        ExpanPing,
        ExpanLi,
        ContracDing,
        ContracPing,
        ContracLi,
    } = AutoPara[CalName]
    const Solar = 365.2425
    const HalfSolar = Solar / 2
    const OriginDif = OriginDifRaw % Solar
    let ExconS = 0
    if (OriginDif <= 88.909225) {
        const ExconT = OriginDif
        ExconS = (ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000 // 盈縮差
    } else if (OriginDif <= HalfSolar) {
        const ExconT = HalfSolar - OriginDif
        ExconS = (ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
    } else if (OriginDif <= HalfSolar + 93.712025) {
        const ExconT = OriginDif - HalfSolar
        ExconS = -(ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
    } else {
        const ExconT = Solar - OriginDif
        ExconS = -(ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000
    }
    return ExconS
}

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
    const MoonAcrV = MoonAcrVRaw.slice()
    if (['Xuanshi', 'Zhengguang', 'Xinghe', 'Tianbao', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Daming', 'Liangwu'].includes(CalName)) {
        for (let i = 0; i <= 27; i++) {
            MoonAcrV[i] = Math.round(MoonAcrV[i] * ZhangRange)
        }
    }
    const AnomaAccumInt = ~~AnomaAccum
    const MoonAvgVDeg = AutoMoonAvgV(CalName, AnomaAccumInt)
    const MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(12)) // 乾象254=章歲+章月
    let MoonAcrAvgDif = [] // 損益率
    let MoonAcrDayDif = [] // 列差
    for (let i = 0; i <= 27; i++) {
        MoonAcrAvgDif[i] = MoonAcrV[i] - MoonAvgV
    }
    let MoonDifAccum = MoonAcrAvgDif.slice() // 盈縮積
    for (let i = 1; i <= 28; i++) {
        MoonDifAccum[i] += MoonDifAccum[i - 1]
        MoonDifAccum[i] = parseFloat((MoonDifAccum[i]).toPrecision(12))
    }
    MoonDifAccum = MoonDifAccum.slice(-1).concat(MoonDifAccum.slice(0, -1))
    MoonDifAccum[0] = 0
    for (let i = 0; i <= 27; i++) {
        MoonAcrDayDif[i] = MoonAcrV[i + 1] - MoonAcrV[i]
    }
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    const MoonDifAccum1 = MoonDifAccum[AnomaAccumInt] + AnomaAccumFract * MoonAcrAvgDif[AnomaAccumInt]
    const MoonAcrV1 = MoonAcrV[AnomaAccumInt] + AnomaAccumFract * MoonAcrDayDif[AnomaAccumInt]
    return {
        MoonDifAccum1,
        MoonAcrV1,
        MoonAcrV
    }
}
// console.log(MoonTable1(27, 'Daming').MoonAvgV)
const MoonTable2 = (AnomaAccum, CalName) => {
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
    if (['Xuanming', 'Yingtian', 'Yitian'].includes(CalName)) {
        const AnomaAccumInt = ~~AnomaAccumHalf
        if (AnomaAccum < HalfAnoma) {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonTcorrListA[AnomaAccumInt] / Denom + ',' + MoonTcorrListA[AnomaAccumInt + 1] / Denom + ',' + MoonTcorrListA[AnomaAccumInt + 2] / Denom
                MoonTcorr2 = Interpolate1_quick(AnomaAccumFrac + 1, Initial)
            } else {
                Initial = MoonTcorrListA[AnomaAccumInt - 2] / Denom + ',' + MoonTcorrListA[AnomaAccumInt - 1] / Denom + ',' + MoonTcorrListA[AnomaAccumInt] / Denom
                MoonTcorr2 = Interpolate1_quick(AnomaAccumFrac + 3, Initial)
            }
            if (AnomaAccumInt <= 12) {
                MoonTcorr1 = (MoonTcorrListA[AnomaAccumInt] + AnomaAccumFrac * (MoonTcorrListA[AnomaAccumInt + 1] - MoonTcorrListA[AnomaAccumInt])) / Denom
            } else {
                MoonTcorr1 = (MoonTcorrListA[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonTcorrListA[AnomaAccumInt]) / Denom
            }
        } else {
            if (AnomaAccumHalfInt <= 11) {
                Initial = MoonTcorrListB[AnomaAccumInt] / Denom + ',' + MoonTcorrListB[AnomaAccumInt + 1] / Denom + ',' + MoonTcorrListB[AnomaAccumInt + 2] / Denom
                MoonTcorr2 = Interpolate1_quick(AnomaAccumFrac + 1, Initial)
            } else {
                Initial = MoonTcorrListB[AnomaAccumInt - 2] / Denom + ',' + MoonTcorrListB[AnomaAccumInt - 1] / Denom + ',' + MoonTcorrListB[AnomaAccumInt] / Denom
                MoonTcorr2 = Interpolate1_quick(AnomaAccumFrac + 3, Initial)
            }
            if (AnomaAccumInt <= 12) {
                MoonTcorr1 = (MoonTcorrListB[AnomaAccumInt] + AnomaAccumFrac * (MoonTcorrListB[AnomaAccumInt + 1] - MoonTcorrListB[AnomaAccumInt])) / Denom
            } else {
                MoonTcorr1 = (MoonTcorrListB[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonTcorrListB[AnomaAccumInt]) / Denom
            }
        }
    } else {
        const AnomaAccumInt = ~~AnomaAccum
        if (AnomaAccumInt <= 25) {
            Initial = MoonTcorrList[AnomaAccumInt] / Denom + ',' + MoonTcorrList[AnomaAccumInt + 1] / Denom + ',' + MoonTcorrList[AnomaAccumInt + 2] / Denom
            MoonTcorr2 = Interpolate1_quick(AnomaAccumFrac + 1, Initial)
        } else {
            Initial = MoonTcorrList[AnomaAccumInt - 2] / Denom + ',' + MoonTcorrList[AnomaAccumInt - 1] / Denom + ',' + MoonTcorrList[AnomaAccumInt] / Denom
            MoonTcorr2 = Interpolate1_quick(AnomaAccumFrac + 3, Initial)
        }
        if (AnomaAccumInt <= 26) {
            MoonTcorr1 = (MoonTcorrList[AnomaAccumInt] + AnomaAccumFrac * (MoonTcorrList[AnomaAccumInt + 1] - MoonTcorrList[AnomaAccumInt])) / Denom
        } else {
            MoonTcorr1 = (MoonTcorrList[AnomaAccumInt] - (AnomaAccumFrac / (Anoma - 27)) * MoonTcorrList[AnomaAccumInt]) / Denom
        }
    }
    return { MoonTcorr2, MoonTcorr1 }
}
// console.log(MoonTable2(7.266, 'Jiyuan'))
// console.log(MoonTable2(7.266, 'Xuanming'))
const MoonTable2_BACKUP = (AnomaAccum, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Anoma,
        MoonAcrV,
        Denom
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const AnomaAccumInt = ~~AnomaAccum
    const MoonAvgVDeg = AutoMoonAvgV(CalName, AnomaAccumInt)
    const MoonAvgV = parseFloat((MoonAvgVDeg * Denom).toPrecision(14))
    // 下月離表。麟德：盈加朒減，速減遲加
    const MoonAcrAvgDif = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會為實平行差。麟德爲增減率
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
        MoonAcrAvgDif[i] = parseFloat((MoonAcrVDeg[i] - MoonAvgVDeg).toPrecision(7))
    }
    let MoonDifAccum = MoonAcrAvgDif.slice() // 盈縮積
    for (let i = 1; i <= 28; i++) {
        MoonDifAccum[i] += MoonDifAccum[i - 1]
        MoonDifAccum[i] = parseFloat((MoonDifAccum[i]).toPrecision(7))
    }
    MoonDifAccum = MoonDifAccum.slice(-1).concat(MoonDifAccum.slice(0, -1))
    MoonDifAccum[0] = 0
    // const tmp1 = MoonDifAccum[7] / MoonDifAccum[21]
    // const tmp2 = MoonDifAccum[8] / MoonDifAccum[20]
    // const tmp3 = MoonDifAccum[1] / MoonDifAccum[27]

    const AnomaAccumDay1 = AnomaAccumInt
    const AnomaAccumFract = AnomaAccum - AnomaAccumInt
    let AnomaAccumDay2 = Math.round((AnomaAccumDay1 + 1) % 27.9)
    const MoonAcrAvgDif1 = MoonAcrAvgDif[AnomaAccumDay1]
    const MoonAcrAvgDif2 = MoonAcrAvgDif[AnomaAccumDay2]
    const MoonDifAccumA = 0.5 * AnomaAccumFract * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + AnomaAccumFract * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - 0.5 * (AnomaAccumFract ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    let MoonDifAccumB = 0
    if (Type === 6) {
        MoonDifAccumB = 0.5 * (MoonDifAccumA / (MoonAvgV)) * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + (MoonDifAccumA / (MoonAvgV)) * (1 - AnomaAccumFract) * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - 0.5 * ((MoonDifAccumA / (MoonAvgV)) ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    }
    const MoonDifAccum2 = MoonDifAccum[AnomaAccumDay1] + MoonDifAccumA + MoonDifAccumB
    const MoonDifAccum1 = MoonDifAccum[AnomaAccumDay1] + MoonAcrAvgDif1 * AnomaAccumFract
    return {
        MoonDifAccum2,
        MoonDifAccum1,
        MoonAcrAvgDif,
        // tmp1,
        // tmp2,
    }
}
// console.log(MoonTable2(27, 'Linde'))

const MoonFormula1 = (AnomaAccum, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        Anoma,
        // MoonAvgVDeg,
        // Sidereal
    } = AutoPara[CalName]
    let MoonTcorr = 0
    let signB = 1
    if (CalName === 'Mingtian') {
        AnomaAccum %= 368.3708364275 // Anoma*MoonAvgVDeg
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
        MoonTcorr = signB * (FaslowT * (210.09 - FaslowT)) / 1976 // 遲疾差度//+ FaslowT * (MoonAvgVDeg - Sidereal / Anoma) / MoonAvgVDeg // 《中國古代曆法》頁110莫名其妙說要加上後面這個，但不加纔跟其他曆相合
        // MoonTcorr = signB * (FaslowT * (210.09 - FaslowT)) * 10000 / 6773.5
    } else if (CalName === 'Futian') {
        if (AnomaAccum > Anoma / 2) {
            AnomaAccum -= Anoma / 2
            signB = -1
        }
        MoonTcorr = signB * AnomaAccum * (Anoma / 2 - AnomaAccum) / 9.4
    }
    return MoonTcorr
}
// console.log(MoonFormula1(10,'Mingtian'))

const MoonFormula2 = (AnomaAccum, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        FaslowDing,
        FaslowPing,
        FaslowLi,
        XianConst,
        Anoma
    } = AutoPara[CalName]
    AnomaAccum %= Anoma
    const HalfAnoma = Anoma / 2 // 轉中
    let signA = 1
    let FaslowS = 0
    let FaslowV = 0
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
    FaslowS = signA * (FaslowDing * FaslowT - FaslowPing * FaslowT ** 2 - FaslowLi * FaslowT ** 3) / 100 // 遲疾差
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
    FaslowV = 1.0962 + signB * (0.11081575 - 0.0005815 * AnomaXian - 0.00000975 * AnomaXian * (AnomaXian - 1)) // 遲疾限下行度
    return {
        FaslowS,
        FaslowV
    }
}

export const AutoTcorr = (AnomaAccum, OriginDifRaw, CalName, year) => {
    const {
        AutoPara,
        Type,
    } = Bind(CalName)
    const {
        ZhangRange,
        XianConst
    } = AutoPara[CalName]
    const MoonAvgVDeg = AutoMoonAvgV(CalName, AnomaAccum)
    let MoonAvgV = 0
    if (Type <= 4) {
        MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(14))
    }
    let sun = {}
    let moon = {}
    let SunDifAccum = 0
    let SunTcorr = 0
    let MoonDifAccum = 0
    let Tcorr2 = 0 // 二次或三次內插
    let Tcorr1 = 0 // 線性內插
    let NodeAccumCorr = 0
    let MoonAcrAvgDifList = []
    if (Type <= 4) {
        const SunAvgV = ZhangRange
        moon = MoonTable1(AnomaAccum, CalName)
        MoonDifAccum = moon.MoonDifAccum1
        const MoonAcrV1 = moon.MoonAcrV1
        const MoonAcrV = moon.MoonAcrV
        if (['Daye', 'Wuyin'].includes(CalName)) { // 大業月離表有差法
            const SunDifAccum1 = SunTable1(OriginDifRaw, CalName)
            SunDifAccum = SunDifAccum1
            Tcorr1 = SunDifAccum1 - MoonDifAccum / (MoonAcrV[~~AnomaAccum] - SunAvgV)
        } else if (['Qianxiang', 'Huangchu', 'Jingchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Daming', 'Liangwu', 'Daxiang'].includes(CalName)) {
            Tcorr1 = -MoonDifAccum / (MoonAcrV[~~AnomaAccum] - SunAvgV)
        } else if (['Yuanjia', 'Kaihuang'].includes(CalName)) { // 「賓等依何承天法」
            Tcorr1 = -MoonDifAccum / (MoonAcrV1 - SunAvgV)
        } else if (['Xuanshi', 'Zhengguang', 'Xinghe', 'Tianbao', 'Jiayin', 'Tianhe'].includes(CalName)) {
            Tcorr1 = -MoonDifAccum / MoonAvgV
        }
        MoonDifAccum /= ZhangRange
    } else if (['Yitian', 'Fengyuan', 'Guantian', 'Zhantian'].includes(CalName)) {
        SunDifAccum = SunFormula1(OriginDifRaw, CalName)
        moon = MoonTable2(AnomaAccum, CalName)
        MoonDifAccum = moon.MoonDifAccum2
        Tcorr2 = (SunDifAccum - MoonDifAccum) / MoonAvgVDeg
        Tcorr1 = (SunDifAccum - moon.MoonDifAccum1) / MoonAvgVDeg
    } else if (['Futian', 'Mingtian'].includes(CalName)) {
        SunDifAccum = SunFormula1(OriginDifRaw, CalName)
        MoonDifAccum = MoonFormula1(AnomaAccum, CalName)
        Tcorr2 = (SunDifAccum - MoonDifAccum) / MoonAvgVDeg
    } else if (Type < 11) {
        if (Type === 7) {
            sun = SunTable3(OriginDifRaw, CalName)
        } else {
            sun = SunTcorrTable(OriginDifRaw, CalName)
        }
        moon = MoonTable2(AnomaAccum, CalName)
        MoonDifAccum = moon.MoonDifAccum2
        SunDifAccum = sun.SunDifAccum2
        SunTcorr = SunDifAccum / MoonAvgVDeg
        Tcorr2 = (SunDifAccum - MoonDifAccum) / MoonAvgVDeg
        Tcorr1 = (sun.SunDifAccum1 - moon.MoonDifAccum1) / MoonAvgVDeg
        MoonAcrAvgDifList = moon.MoonAcrAvgDif
    } else if (Type === 11) {
        SunDifAccum = SunFormula2(OriginDifRaw, CalName)
        moon = MoonFormula2(AnomaAccum, CalName)
        MoonDifAccum = moon.FaslowS
        Tcorr2 = (SunDifAccum + MoonDifAccum) * XianConst / moon.FaslowV
        NodeAccumCorr = Tcorr2
    } else if (Type === 20) {
        sun = SunWest(OriginDifRaw, year)
        moon = MoonWest(AnomaAccum, year)
        SunDifAccum = sun.SunDifAccum
        MoonDifAccum = moon.MoonDifAccum
        Tcorr2 = (SunDifAccum - MoonDifAccum) / (moon.MoonAcrV - sun.SunAcrV)
    }
    if (Type >= 6 && Type <= 10) { // 其他曆法都是這樣，不懂授時為何就是定朔加減差
        NodeAccumCorr = (SunDifAccum - 0.0785077 * MoonDifAccum) / MoonAvgVDeg // 皇極 465/5923，麟徳61/777，大衍343/4369，崇天141/1796，都是0.0785
    }
    return {
        SunDifAccum,
        SunTcorr,
        MoonDifAccum,
        Tcorr2,
        Tcorr1,
        NodeAccumCorr,
        MoonAcrAvgDifList
    }
}
// console.log(AutoTcorr(1, 16, 'Dayan').SunDifAccum)

export const AutoSunTcorr = (OriginDifRaw, CalName, Solar) => {
    const {
        Type
    } = Bind(CalName)
    const HalfTermLeng = Solar / 24
    let TermAcrRawList = [] // 定氣距冬至日數
    const AutoAcrTermTcorr = (OriginDifRaw, CalName) => {
        const TermNum = Math.round(OriginDifRaw / HalfTermLeng) + 1
        let AcrTermTcorr = 0
        if (['Futian', 'Yitian', 'Fengyuan', 'Guantian', 'Zhantian', 'Mingtian'].includes(CalName)) { // 《中國古代曆法》頁108。儀天僅用公式算太陽
            AcrTermTcorr = SunFormula1(OriginDifRaw, CalName)
            // if (CalName === 'Mingtian') {
            //     AcrTermTcorr /= Denom
            // }
        } else if (Type === 7) {
            const SunDifAccumList = SunTable3(OriginDifRaw, CalName).SunDifAccumList
            AcrTermTcorr = SunDifAccumList[TermNum]
        } else if (Type < 11) {
            const SunDifAccumList = SunTcorrTable(OriginDifRaw, CalName).SunDifAccumList
            AcrTermTcorr = SunDifAccumList[TermNum]
        } else if (Type === 11) {
            AcrTermTcorr = SunFormula2(OriginDifRaw, CalName)
        } else if (Type === 20) {
            AcrTermTcorr = SunWest(OriginDifRaw, CalName).SunDifAccum
        }
        return AcrTermTcorr
    }
    if (Type === 7) {
        TermAcrRawList = SunTable3(OriginDifRaw, CalName).TermAcrRawList
    } else {
        for (let i = 1; i <= 27; i++) {
            TermAcrRawList[i] = HalfTermLeng * (i - 1) - AutoAcrTermTcorr(HalfTermLeng * Math.round((i - 1) % 24.1), CalName)
        }
        TermAcrRawList[0] = 0
    }
    return TermAcrRawList
}
// console.log(AutoSunTcorr(91.31, 'Yingtian', 365.2444511))