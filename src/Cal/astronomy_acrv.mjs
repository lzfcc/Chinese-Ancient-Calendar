import {
    Bind,
} from './bind.mjs'
import {
    SunWest,
    MoonWest
} from './astronomy_west.mjs'

export const SunTable1 = (OriginDifRaw, CalName) => {
    const {
        ChoosePara,
    } = Bind(CalName)
    const {
        SunAcrAvgDifList,
        Solar,
        Denom
    } = ChoosePara[CalName]
    const HalfTermLeng = Solar / 24
    // 以下爲大業曆入氣盈縮表（日躔表雛形）.戊寅《新唐曆一》寫的前盈後縮，盈加縮減。
    let SunDifAccum = SunAcrAvgDifList.slice()
    for (let i = 1; i <= 24; i++) {
        SunDifAccum[i] += SunDifAccum[i - 1]
    }
    SunDifAccum = SunDifAccum.slice(-1).concat(SunDifAccum.slice(0, -1))
    SunDifAccum[0] = 0
    const TermNum1 = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1) // 朔望所在氣名
    const TermNewmDif = OriginDifRaw - (TermNum1 - 1) * HalfTermLeng // 注意要減1。朔望入氣日數
    const SunDifAccum1 = (SunDifAccum[TermNum1] + SunAcrAvgDifList[TermNum1] * TermNewmDif / HalfTermLeng) / Denom
    return SunDifAccum1
}
// 《中國古代曆法》頁497 與大多數曆法不同，大衍的日躔是定氣，每氣間隔不同
export const SunTable2 = (OriginDifRaw, CalName) => {
    const {
        Type,
        ChoosePara
    } = Bind(CalName)
    const {
        SunAcrAvgDifList,
        Denom,
        TermRangeA,
        TermRangeS,
    } = ChoosePara[CalName]
    let {
        Solar,
    } = ChoosePara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
    }
    const TermLeng = Solar / 12
    const HalfTermLeng = Solar / 24
    const SunAcrAvgDif = []
    SunAcrAvgDif[0] = 0
    let SunDifAccum = []
    let SunDenom = Denom
    if (Type >= 8 && CalName !== 'Qianyuan') {
        SunDenom = 10000
    }
    for (let i = 1; i <= 24; i++) {
        SunAcrAvgDif[i] = SunAcrAvgDifList[i] / SunDenom
    }
    SunDifAccum = SunAcrAvgDif.slice()
    for (let i = 1; i <= 24; i++) {
        SunDifAccum[i] += SunDifAccum[i - 1]
        SunDifAccum[i] = parseFloat((SunDifAccum[i]).toPrecision(14))
    }
    SunDifAccum = SunDifAccum.slice(-1).concat(SunDifAccum.slice(0, -1))
    SunDifAccum[0] = 0

    const TermNum1 = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1) // 朔望所在氣名
    const TermNum2 = Math.round((TermNum1 + 1) % 24.1)
    const TermNewmDif = OriginDifRaw - (TermNum1 - 1) * HalfTermLeng // 注意要減1。朔望入氣日數
    let TermRange1 = 0
    let TermRange2 = 0
    if (['Linde', 'Huangji', 'Shenlong'].includes(CalName)) {
        if ((OriginDifRaw < 3 * TermLeng) || (OriginDifRaw >= 9 * TermLeng)) {
            TermRange1 = TermRangeA // 秋分後
        } else {
            TermRange1 = TermRangeS // 春分後
        }
    } else {
        TermRange1 = HalfTermLeng - SunAcrAvgDif[TermNum1] / Denom
        TermRange2 = HalfTermLeng - SunAcrAvgDif[TermNum2] / Denom
    }
    const SunAcrAvgDif1 = SunAcrAvgDif[TermNum1]
    const SunAcrAvgDif2 = SunAcrAvgDif[TermNum2]
    const SunDifAccum2 = SunDifAccum[TermNum1] + 0.5 * (TermNewmDif / TermRange1) * (SunAcrAvgDif1 + SunAcrAvgDif2) + (TermNewmDif / TermRange1) * (SunAcrAvgDif1 - SunAcrAvgDif2) - 0.5 * ((TermNewmDif / TermRange1) ** 2) * (SunAcrAvgDif1 - SunAcrAvgDif2)
    const SunDifAccum1 = SunDifAccum[TermNum1] + SunAcrAvgDif1 * (TermNewmDif / TermRange1)
    // 宣明精簡二次算法
    // const SunDifAccum2 = SunDifAccum[TermNum1] + (TermNewmDif / TermRange1) * SunAcrAvgDif1 / TermRange1 + (TermNewmDif / TermRange1) * (TermRange1 / (TermRange1 + TermRange2)) * (SunAcrAvgDif1 / TermRange1 - SunAcrAvgDif2 / TermRange2) - (((TermNewmDif / TermRange1) ** 2) / (TermRange1 + TermRange2)) * (SunAcrAvgDif1 / TermRange1 - SunAcrAvgDif2 / TermRange2)
    return {
        SunDifAccum,
        SunDifAccum1,
        SunDifAccum2
    }
}
// console.log(SunTable1(91.31, 'Wuyin'))

export const SunFormula1 = (OriginDifRaw, CalName) => {
    const {
        ChoosePara,
    } = Bind(CalName)
    const {
        Solar,
        Denom
    } = ChoosePara[CalName]
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
        // const SunDegcorr = signA * ExconT * (200 - ExconT) / 4135 // 盈縮差度分。極值2.37
        SunTcorr = signA * ExconT * (200 - ExconT) * 400 / 567
    } else if (CalName === 'Futian') {
        if (OriginDifRaw > Solar / 2) {
            OriginDifRaw -= Solar / 2
            signA = -1
        }
        SunTcorr = signA * OriginDifRaw * (Solar / 2 - OriginDifRaw) / 3400 // 陳久金《符天曆研究》原本是182、3300，我調整一下。所得為立成的差積度，（3300）極値爲2.5094度，麟德2.77，大衍2.42，九執2.14.採用10000為分母。
    }
    return SunTcorr
}

export const SunFormula2 = (OriginDifRaw, CalName) => {
    const {
        ChoosePara,
    } = Bind(CalName)
    const {
        ExpanDing,
        ExpanPing,
        ExpanLi,
        ContracDing,
        ContracPing,
        ContracLi,
    } = ChoosePara[CalName]
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

export const MoonTable1 = (AnomaAccum, CalName) => {
    const {
        ChoosePara,
    } = Bind(CalName)
    const {
        Sidereal,
        Solar,
        MoonAcrVRaw,
        Lunar,
        ZhangRange
    } = ChoosePara[CalName]
    const MoonAcrV = MoonAcrVRaw.slice()
    if (['Xuanshi', 'Zhengguang', 'Xinghe', 'Tianbao', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang', 'Daming', 'Liangwu'].includes(CalName)) {
        for (let i = 1; i <= 28; i++) {
            MoonAcrV[i] = Math.round(MoonAcrV[i] * ZhangRange)
        }
    }
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    const MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(14))
    let MoonAcrAvgDif = [] // 損益率
    MoonAcrAvgDif[0] = 0
    let MoonAcrDayDif = [] // 列差
    MoonAcrDayDif[0] = 0
    for (let i = 1; i <= 28; i++) {
        MoonAcrAvgDif[i] = MoonAcrV[i] - MoonAvgV
    }
    let MoonDifAccum = MoonAcrAvgDif.slice() // 盈縮積
    for (let i = 1; i <= 28; i++) {
        MoonDifAccum[i] += MoonDifAccum[i - 1]
    }
    MoonDifAccum = MoonDifAccum.slice(-1).concat(MoonDifAccum.slice(0, -1))
    MoonDifAccum[0] = 0
    for (let i = 1; i <= 28; i++) {
        MoonAcrDayDif[i] = MoonAcrV[i + 1] - MoonAcrV[i]
    }
    if (['Qianxiang', 'Huangchu'].includes(CalName)) {
        AnomaAccum += 1
    }
    const AnomaAccumFract = AnomaAccum - Math.floor(AnomaAccum)
    const MoonDifAccum1 = MoonDifAccum[Math.ceil(AnomaAccum)] + AnomaAccumFract * MoonAcrAvgDif[Math.ceil(AnomaAccum)]
    const MoonAcrV1 = MoonAcrV[Math.ceil(AnomaAccum)] + AnomaAccumFract * MoonAcrDayDif[Math.ceil(AnomaAccum)]
    return {
        MoonDifAccum1,
        MoonAcrV1,
        MoonAcrV
    }
}

export const MoonTable2 = (AnomaAccum, CalName) => {
    const {
        ChoosePara,
        Type
    } = Bind(CalName)
    const {
        Sidereal,
        Solar,
        MoonAcrV,
        Denom
    } = ChoosePara[CalName]
    let {
        Lunar
    } = ChoosePara[CalName]
    if (CalName === 'Tongtian') {
        Lunar = 29.530592
    }
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    const MoonAvgV = parseFloat((MoonAvgVDeg * Denom).toPrecision(14))
    // 下月離表。麟德：盈加朒減，速減遲加
    const MoonAcrAvgDif = [] // 損益率。速差。消減息加，前消後息。加減數（限）。《古代曆法計算法》第515-518頁。《中國古代曆法》第453頁說劉洪濤誤會為實平行差。麟德爲增減率
    MoonAcrAvgDif[0] = 0
    // const MoonAcrDayDif = [] // 列差
    // MoonAcrDayDif[0] = 0
    let MoonDegDenom = Denom
    if (Type >= 8 && CalName !== 'Chongxuan') {
        MoonDegDenom = 100
        if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
            MoonDegDenom = Denom / 100
        }
    }
    const MoonAcrVDeg = []
    for (let i = 1; i <= 29; i++) {
        MoonAcrVDeg[i] = MoonAcrV[i] / MoonDegDenom
    }
    for (let i = 1; i <= 28; i++) {
        MoonAcrAvgDif[i] = MoonAcrVDeg[i] - MoonAvgVDeg
    }
    let MoonDifAccum = MoonAcrAvgDif.slice() // 盈縮積
    for (let i = 1; i <= 28; i++) {
        MoonDifAccum[i] = MoonDifAccum[i] + MoonDifAccum[i - 1]
    }
    MoonDifAccum = MoonDifAccum.slice(-1).concat(MoonDifAccum.slice(0, -1))
    MoonDifAccum[0] = 0

    const AnomaAccumDay1 = Math.ceil(AnomaAccum)
    const AnomaAccumFract = AnomaAccum - Math.floor(AnomaAccum)
    let AnomaAccumDay2 = Math.round((AnomaAccumDay1 + 1) % 28.1)
    // if (AnomaAccumDay1 === 0) {
    //     AnomaAccumDay2 = 28
    // }
    const MoonAcrAvgDif1 = MoonAcrAvgDif[AnomaAccumDay1]
    const MoonAcrAvgDif2 = MoonAcrAvgDif[AnomaAccumDay2]
    const MoonDifAccumA = 0.5 * AnomaAccumFract * (MoonAcrAvgDif1 + MoonAcrAvgDif2) + AnomaAccumFract * (MoonAcrAvgDif1 - MoonAcrAvgDif2) - 0.5 * (AnomaAccumFract ** 2) * (MoonAcrAvgDif1 - MoonAcrAvgDif2)
    let MoonDifAccumB = 0
    if (Type <= 7) {
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
// console.log(MoonTable2(2.41, 'Chunxi'))

export const MoonFormula1 = (AnomaAccum, CalName) => {
    const {
        ChoosePara,
    } = Bind(CalName)
    const {
        Anoma
    } = ChoosePara[CalName]
    let MoonTcorr = 0
    let signB = 1
    if (CalName === 'Mingtian') {
        // 13.36875 是我算的轉法轉度母之比
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
        // const MoonDegcorr = signB * (FaslowT * (210.09 - FaslowT)) / 1976 // 遲疾差度
        MoonTcorr = signB * (FaslowT * (210.09 - FaslowT)) * 10000 / 6773.5
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

export const MoonFormula2 = (AnomaAccum, CalName) => {
    const {
        ChoosePara,
    } = Bind(CalName)
    const {
        FaslowDing,
        FaslowPing,
        FaslowLi,
        XianConst,
        Anoma
    } = ChoosePara[CalName]
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

export const BindTcorr = (AnomaAccum, OriginDifRaw, CalName, year) => {
    const {
        ChoosePara,
        Type,
    } = Bind(CalName)
    const {
        Sidereal,
        ZhangRange,
        Denom,
        XianConst
    } = ChoosePara[CalName]
    let {
        Solar,
        Lunar,
    } = ChoosePara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
        Lunar = 29.530592
    }
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    // let MoonAvgVDeg = parseFloat((Solar / Lunar + 1).toPrecision(13)) // 麟德、五紀、正元。宣明、皇極、欽天不確定。陳美東《月離表初探》
    // if (['Dayan', 'Xuanming', 'Chongxuan', 'Qintian'].includes(CalName)) { // 宣明：1123/84，畧大於算出來的，四捨五入的結果
    //     MoonAvgVDeg = parseFloat((Sidereal / Lunar + 1).toPrecision(13))
    // }
    let MoonAvgV = 0
    if (Type < 6) {
        MoonAvgV = parseFloat((MoonAvgVDeg * ZhangRange).toPrecision(14))
    } else {
        MoonAvgV = MoonAvgVDeg * Denom // 後面這個是月程法，類似皇極的日干元
    }
    let sun = {}
    let moon = {}
    let SunDifAccum = 0
    let MoonDifAccum = 0
    let Tcorr2 = 0 // 二次或三次內插
    let Tcorr1 = 0 // 線性內插
    let Tcorr3 = 0
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
        Tcorr2 = (SunDifAccum - MoonDifAccum) / Denom
    } else if (Type < 11) {
        sun = SunTable2(OriginDifRaw, CalName)
        moon = MoonTable2(AnomaAccum, CalName)
        MoonDifAccum = moon.MoonDifAccum2
        SunDifAccum = sun.SunDifAccum2
        Tcorr2 = (SunDifAccum - MoonDifAccum) / MoonAvgVDeg
        Tcorr1 = (sun.SunDifAccum1 - moon.MoonDifAccum1) / MoonAvgVDeg
        MoonAcrAvgDifList = moon.MoonAcrAvgDif
    } else if (Type === 11) {
        SunDifAccum = SunFormula2(OriginDifRaw, CalName)
        moon = MoonFormula2(AnomaAccum, CalName)
        MoonDifAccum = moon.FaslowS
        Tcorr3 = (SunDifAccum + MoonDifAccum) * XianConst / moon.FaslowV
        NodeAccumCorr = Tcorr3
    } else if (Type === 20) {
        sun = SunWest(OriginDifRaw, year)
        moon = MoonWest(AnomaAccum, year)
        SunDifAccum = sun.SunDifAccum
        MoonDifAccum = moon.MoonDifAccum
        Tcorr3 = (SunDifAccum - MoonDifAccum) / (moon.MoonAcrV - sun.SunAcrV)
    }
    if (Type >= 6 && Type <= 10) { // 其他曆法都是這樣，不懂授時為何就是定朔加減差
        NodeAccumCorr = (SunDifAccum - (343 / 4369) * MoonDifAccum) / MoonAvgVDeg // 皇極 465/5923，麟徳61/777，大衍343/4369，崇天141/1796，都是0.0785
    }
    return {
        SunDifAccum,
        MoonDifAccum,
        Tcorr2,
        Tcorr1,
        Tcorr3,
        NodeAccumCorr,
        MoonAcrAvgDifList
    }
}
// console.log(BindTcorr(1, 61, 'Linde'))

export const BindSunTcorr = (OriginDifRaw, CalName) => {
    const {
        ChoosePara,
        Type
    } = Bind(CalName)
    const {
        Denom
    } = ChoosePara[CalName]
    let {
        Solar
    } = ChoosePara[CalName]
    if (CalName === 'Tongtian') {
        Solar = 365.243
    }
    const HalfTermLeng = Solar / 24
    const BindAcrTermTcorr = (OriginDifRaw, CalName) => {
        const TermNum = Math.round(OriginDifRaw / HalfTermLeng) + 1
        let AcrTermTcorr = 0
        if (['Futian', 'Yitian', 'Fengyuan', 'Guantian', 'Zhantian', 'Mingtian'].includes(CalName)) { // 《中國古代曆法》頁108。儀天僅用公式算太陽
            AcrTermTcorr = SunFormula1(OriginDifRaw, CalName)
            if (CalName === 'Mingtian') {
                AcrTermTcorr /= Denom
            }
        } else if (Type < 11) {
            const SunDifAccum = SunTable2(OriginDifRaw, CalName).SunDifAccum
            AcrTermTcorr = SunDifAccum[TermNum]
        } else if (Type === 11) {
            AcrTermTcorr = SunFormula2(OriginDifRaw, CalName)
        } else if (Type === 20) {
            AcrTermTcorr = SunWest(OriginDifRaw, CalName).SunDifAccum
        }
        return AcrTermTcorr
    }
    const TermAcrRawList = [] // 定氣距冬至日數
    for (let i = 1; i < 24; i++) {
        TermAcrRawList[i] = HalfTermLeng * (i - 1) - BindAcrTermTcorr(HalfTermLeng * (i - 1), CalName)
    }
    TermAcrRawList[0] = 0
    TermAcrRawList[25] = TermAcrRawList[1]
    TermAcrRawList[26] = TermAcrRawList[2]
    return {
        AcrTermTcorr: BindAcrTermTcorr(OriginDifRaw, CalName),
        TermAcrRawList
    }
}
// console.log(BindSunTcorr(91.31,'Dayan'))