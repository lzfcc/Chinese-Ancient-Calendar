import {
    Bind,
} from './bind.mjs'
import {
    SunWest,
    MoonWest
} from './astronomy_west.mjs'
import {
    Interpolate3
} from './equa_sn.mjs'

const SunTable1 = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        SunAcrAvgDifList,
        Solar,
        Denom
    } = AutoPara[CalName]
    const HalfTermLeng = Solar / 24
    // 以下爲大業曆入氣盈縮表（日躔表雛形）.戊寅《新唐曆一》寫的前盈後縮，盈加縮減。
    let SunDifAccumList = SunAcrAvgDifList.slice()
    for (let i = 1; i <= 24; i++) {
        SunDifAccumList[i] += SunDifAccumList[i - 1]
    }
    SunDifAccumList = SunDifAccumList.slice(-1).concat(SunDifAccumList.slice(0, -1))
    SunDifAccumList[0] = 0
    const TermNum1 = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1) // 朔望所在氣名
    const TermNewmDif = OriginDifRaw - (TermNum1 - 1) * HalfTermLeng // 注意要減1。朔望入氣日數
    const SunDifAccum1 = (SunDifAccumList[TermNum1] + SunAcrAvgDifList[TermNum1] * TermNewmDif / HalfTermLeng) / Denom
    return SunDifAccum1
}
// console.log(SunTable1(91, 'Daye'))
// 《中國古代曆法》頁497 與大多數曆法不同，大衍的日躔是定氣，每氣間隔不同
const SunTable2 = (OriginDifRaw, CalName) => {
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
// console.log(SunTable2(91.31, 'Huangji').SunDifAccum2)

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
    const TermAcrRawList = [] // 定氣距冬至日數
    for (let i = 1; i < 24; i++) {
        TermAcrRawList[i] = HalfTermLeng * (i - 1) - SunDifAccumList[i]
    }
    TermAcrRawList[0] = 0
    TermAcrRawList[25] = Solar
    TermAcrRawList[26] = Solar + TermAcrRawList[2]
    let TermNum = 1
    for (let j = 1; j <= 24; j++) { // 氣候 
        if (OriginDifRaw >= TermAcrRawList[j] && OriginDifRaw < TermAcrRawList[j + 1]) {
            TermNum = j
            break
        }
    }
    const Initial = TermAcrRawList[TermNum] + ',' + SunDifAccumList[TermNum] + ';' + TermAcrRawList[TermNum + 1] + ',' + SunDifAccumList[TermNum + 1] + ';' + TermAcrRawList[TermNum + 2] + ',' + SunDifAccumList[TermNum + 2]
    const SunDifAccum2 = Interpolate3(OriginDifRaw, Initial).f // 直接拉格朗日內插，懶得寫了
    const TermRange1 = TermAcrRawList[TermNum + 1] - TermAcrRawList[TermNum] // 本氣長度
    const SunDifAccum1 = SunDifAccumList[TermNum] + SunAcrAvgDifListList[TermNum] * (OriginDifRaw - TermAcrRawList[TermNum]) / TermRange1
    return {
        TermAcrRawList,
        SunDifAccumList,
        SunDifAccum1,
        SunDifAccum2
    }
}
// console.log(SunTable3(14, 'Xuanming').SunDifAccum2)

const SunFormula1 = (OriginDifRaw, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        Solar,
        Denom
    } = AutoPara[CalName]
    let SunTcorr = 0
    let signA = 1
    let Xian = 0
    let ExconT = 0
    if (CalName === 'Yitian') {
        const XianA = 897699.5
        const XianB = 946785.5 // 陳美東《崇玄儀天崇天三曆晷長計算法》改正該値
        if (OriginDifRaw <= XianA / Denom) {
            Xian = XianA
            ExconT = OriginDifRaw
        } else if (OriginDifRaw <= Solar / 2) {
            Xian = XianB
            ExconT = Solar / 2 - OriginDifRaw
        } else if (OriginDifRaw <= Solar / 2 + XianB / Denom) {
            signA = -1
            Xian = XianB
            ExconT = OriginDifRaw - Solar / 2
        } else {
            signA = -1
            Xian = XianA
            ExconT = Solar - OriginDifRaw
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
        if (OriginDifRaw <= XianA) {
            Xian = XianA
            SunDenom = SunDenomA
            ExconT = OriginDifRaw
        } else if (OriginDifRaw <= Solar / 2) {
            Xian = XianB
            SunDenom = SunDenomB
            ExconT = Solar / 2 - OriginDifRaw
        } else if (OriginDifRaw <= Solar / 2 + XianB) {
            Xian = XianB
            SunDenom = SunDenomB
            signA = -1
            ExconT = OriginDifRaw - Solar / 2
        } else {
            Xian = XianA
            SunDenom = SunDenomA
            signA = -1
            ExconT = Solar - OriginDifRaw
        }
        SunTcorr = signA * (ExconT / SunDenom) * (Xian * 2 - ExconT) // 盈縮差度分。極值2.37
    } else if (CalName === 'Mingtian') {
        if (OriginDifRaw <= Solar / 4) {
            ExconT = OriginDifRaw
        } else if (OriginDifRaw <= Solar / 2) {
            ExconT = Solar / 2 - OriginDifRaw
        } else if (OriginDifRaw <= Solar * 0.75) {
            signA = -1
            ExconT = OriginDifRaw - Solar / 2
        } else {
            signA = -1
            ExconT = Solar - OriginDifRaw
        }
        SunTcorr = signA * ExconT * (200 - ExconT) / 4135 // 盈縮差度分。極值2.37
        // SunTcorr = signA * ExconT * (200 - ExconT) * 400 / 567
    } else if (CalName === 'Futian') {
        if (OriginDifRaw > Solar / 2) {
            OriginDifRaw -= Solar / 2
            signA = -1
        }
        SunTcorr = signA * OriginDifRaw * (Solar / 2 - OriginDifRaw) / 3300 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得為立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000為分母。
    }
    return SunTcorr
}

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
    let ExconS = 0
    if (OriginDifRaw <= 88.909225) {
        const ExconT = OriginDifRaw
        ExconS = (ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000 // 盈縮差
    } else if (OriginDifRaw <= HalfSolar) {
        const ExconT = HalfSolar - OriginDifRaw
        ExconS = (ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
    } else if (OriginDifRaw <= HalfSolar + 93.712025) {
        const ExconT = OriginDifRaw - HalfSolar
        ExconS = -(ContracDing * ExconT - ContracPing * (ExconT ** 2) - ContracLi * (ExconT ** 3)) / 10000
    } else {
        const ExconT = Solar - OriginDifRaw
        ExconS = -(ExpanDing * ExconT - ExpanPing * (ExconT ** 2) - ExpanLi * (ExconT ** 3)) / 10000
    }
    return ExconS
}

const MoonTable1 = (AnomaAccum, CalName) => {
    const {
        AutoPara,
    } = Bind(CalName)
    const {
        Sidereal,
        Solar,
        MoonAcrVRaw,
        Lunar,
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
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    const MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(14))
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
    const AnomaAccumFract = AnomaAccum - Math.floor(AnomaAccum)
    const MoonDifAccum1 = MoonDifAccum[Math.floor(AnomaAccum)] + AnomaAccumFract * MoonAcrAvgDif[Math.floor(AnomaAccum)]
    const MoonAcrV1 = MoonAcrV[Math.floor(AnomaAccum)] + AnomaAccumFract * MoonAcrDayDif[Math.floor(AnomaAccum)]
    return {
        MoonDifAccum1,
        MoonAcrV1,
        MoonAcrV
    }
}
// console.log(MoonTable1(27, 'Jingchu'))

const MoonTable2 = (AnomaAccum, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Sidereal,
        Solar,
        Anoma,
        MoonAcrV,
        Denom
    } = AutoPara[CalName]
    let {
        Lunar
    } = AutoPara[CalName]
    if (CalName === 'Tongtian') {
        Lunar = 29.530592
    }
    AnomaAccum %= Anoma
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
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
    for (let i = 0; i <= 28; i++) {
        MoonAcrVDeg[i] = MoonAcrV[i] / MoonDegDenom
    }
    for (let i = 0; i <= 27; i++) {
        MoonAcrAvgDif[i] = MoonAcrVDeg[i] - MoonAvgVDeg
    }
    let MoonDifAccum = MoonAcrAvgDif.slice() // 盈縮積
    for (let i = 1; i <= 28; i++) {
        MoonDifAccum[i] += MoonDifAccum[i - 1]
    }
    MoonDifAccum = MoonDifAccum.slice(-1).concat(MoonDifAccum.slice(0, -1))
    MoonDifAccum[0] = 0

    const AnomaAccumDay1 = Math.floor(AnomaAccum)
    const AnomaAccumFract = AnomaAccum - Math.floor(AnomaAccum)
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
        MoonAcrAvgDif
    }
}
// console.log(MoonTable2(27, 'Jiyuan'))

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
        Sidereal,
        ZhangRange,
        Denom,
        XianConst
    } = AutoPara[CalName]
    let {
        Solar,
        Lunar,
    } = AutoPara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
        Lunar = 29.530592
    }
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    // let MoonAvgVDeg = parseFloat((Solar / Lunar + 1).toPrecision(13)) // 麟德、五紀、正元。宣明、皇極、欽天不確定。陳美東《月離表初探》
    // 宣明：1123/84，畧大於算出來的，四捨五入的結果
    let MoonAvgV = 0
    if (Type < 6) {
        MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(14))
    } else {
        MoonAvgV = MoonAvgVDeg * Denom // 後面這個是月程法，類似皇極的日干元
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
            Tcorr1 = SunDifAccum1 - MoonDifAccum / (MoonAcrV[Math.ceil(AnomaAccum)] - SunAvgV)
        } else if (['Qianxiang', 'Huangchu', 'Jingchu', 'Liuzhi', 'Wangshuozhi', 'Sanji', 'Daming', 'Liangwu', 'Daxiang'].includes(CalName)) {
            Tcorr1 = -MoonDifAccum / (MoonAcrV[Math.ceil(AnomaAccum)] - SunAvgV)
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
            sun = SunTable2(OriginDifRaw, CalName)
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
        NodeAccumCorr = (SunDifAccum - (343 / 4369) * MoonDifAccum) / MoonAvgVDeg // 皇極 465/5923，麟徳61/777，大衍343/4369，崇天141/1796，都是0.0785
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

export const AutoSunTcorr = (OriginDifRaw, CalName, SolarIn) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Denom
    } = AutoPara[CalName]
    let {
        Solar
    } = AutoPara[CalName]
    if (!Solar) {
        Solar = SolarIn
    }
    const HalfTermLeng = Solar / 24
    let TermAcrRawList = [] // 定氣距冬至日數
    const AutoAcrTermTcorr = (OriginDifRaw, CalName) => {
        const TermNum = Math.round(OriginDifRaw / HalfTermLeng) + 1
        let AcrTermTcorr = 0
        if (['Futian', 'Yitian', 'Fengyuan', 'Guantian', 'Zhantian', 'Mingtian'].includes(CalName)) { // 《中國古代曆法》頁108。儀天僅用公式算太陽
            AcrTermTcorr = SunFormula1(OriginDifRaw, CalName)
            if (CalName === 'Mingtian') {
                AcrTermTcorr /= Denom
            }
        } else if (Type === 7) {
            const SunDifAccumList = SunTable3(OriginDifRaw, CalName).SunDifAccumList
            AcrTermTcorr = SunDifAccumList[TermNum]
        } else if (Type < 11) {
            const SunDifAccumList = SunTable2(OriginDifRaw, CalName).SunDifAccumList
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
// console.log(AutoSunTcorr(91.31, 'Linde'))