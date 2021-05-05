import {
    Bind,
} from './bind.mjs'
import {
    Equator2EclipticTable,
    Longi2LatiTable1,
    Longi2LatiTable2,
    MoonLongiTable,
    MoonLatiTable
} from './astronomy_table.mjs'
import {
    Equator2EclipticFormula,
    Hushigeyuan,
    Longi2LatiFormula,
    Longi2DialFormula,
    MoonLatiFormula,
    MoonLongiFormula
} from './astronomy_formula.mjs'
import {
    Equator2EclipticWest,
    Longi2LatiWest,
    Longi2SunriseWest,
    Longi2DialWest,
    SunWest,
    // MoonWest
} from './astronomy_west.mjs'
import {
    AutoTcorr,
    AutoDifAccum
} from './astronomy_acrv.mjs'
import {
    CalNameList
} from './para_constant.mjs'
import {
    AutoEclipse
} from './astronomy_eclipse.mjs'
import { AutoMoonAvgV } from './astronomy_acrv.mjs'

export const BindTcorr = (AnomaAccum, WinsolsDifRaw, year) => {
    WinsolsDifRaw = +WinsolsDifRaw
    AnomaAccum = +AnomaAccum
    if (WinsolsDifRaw > 365.2425 || WinsolsDifRaw < 0) {
        throw (new Error('請輸入一回歸年內的日數！'))
    }
    const {
        SunTcorr2: WestSunTcorr,
        MoonTcorr2: WestMoonTcorr
    } = AutoTcorr(AnomaAccum, WinsolsDifRaw, 'West', 0, year)
    const {
        SunDifAccum: WestSun,
        MoonDifAccum: WestMoon,
    } = AutoDifAccum(AnomaAccum, WinsolsDifRaw, 'West', year)
    const {
        MoonTcorr2: WestMoonTcorrB
    } = AutoTcorr(AnomaAccum + 13.7772755949, WinsolsDifRaw, 'West', 0, year) // 13.7772755949是應天半轉
    const {
        MoonDifAccum: WestMoonB,
    } = AutoDifAccum(AnomaAccum + 13.7772755949, WinsolsDifRaw, 'West', year)

    let Print1 = [{
        title: 'Fourier',
        data: [WestSun.toFixed(5), 0, WestMoon.toFixed(5), 0, WestSunTcorr.toFixed(5), 0, WestMoonTcorr.toFixed(5), 0, (WestSunTcorr + WestMoonTcorr).toFixed(4)]
    }]
    Print1 = Print1.concat(
        ['Qianxiang', 'Jingchu', 'Yuanjia', 'Daming', 'Zhengguang', 'Xinghe', 'Tianbao', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Wuji', 'Zhengyuan', 'Futian', 'Mingtian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'NewDaming', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Shoushi'].map(title => {
            const {
                SunDifAccum,
                MoonDifAccum,
            } = AutoDifAccum(AnomaAccum, WinsolsDifRaw, title)
            const {
                SunTcorr2,
                MoonTcorr2,
                SunTcorr1,
                MoonTcorr1,
                NodeAccumCorr
            } = AutoTcorr(AnomaAccum, WinsolsDifRaw, title)
            let SunTcorrPrint = '-'
            let SunTcorrInac = '-'
            let MoonTcorrPrint = '-'
            let MoonTcorrInac = '-'
            let NodeAccumCorrPrint = '-'
            const SunDifAccumPrint = SunDifAccum ? SunDifAccum.toFixed(5) : '-'
            const SunDifAccumInac = SunDifAccum ? (SunDifAccum - WestSun).toFixed(4) : '-'
            const MoonDifAccumPrint = MoonDifAccum.toFixed(5)
            const MoonDifAccumInac = (MoonDifAccum - WestMoon).toFixed(4)
            if (SunTcorr2) {
                SunTcorrPrint = SunTcorr2.toFixed(5)
                SunTcorrInac = (SunTcorr2 - WestSunTcorr).toFixed(4)
            } else if (SunTcorr1) {
                SunTcorrPrint = SunTcorr1.toFixed(5)
                SunTcorrInac = (SunTcorr1 - WestSunTcorr).toFixed(4)
            }
            if (MoonTcorr2) {
                MoonTcorrPrint = MoonTcorr2.toFixed(5)
                MoonTcorrInac = (MoonTcorr2 - WestMoonTcorr).toFixed(4)
            } else {
                MoonTcorrPrint = MoonTcorr1.toFixed(5)
                MoonTcorrInac = (MoonTcorr1 - WestMoonTcorr).toFixed(4)
            }
            if (NodeAccumCorr) {
                NodeAccumCorrPrint = NodeAccumCorr.toFixed(4)
            }
            const Tcorr = +MoonTcorrPrint + (+SunTcorrPrint || 0)
            return {
                title: CalNameList[title],
                data: [SunDifAccumPrint, SunDifAccumInac, MoonDifAccumPrint, MoonDifAccumInac, SunTcorrPrint, SunTcorrInac, MoonTcorrPrint, MoonTcorrInac, Tcorr.toFixed(4), NodeAccumCorrPrint]
            }
        }))
    let Print2 = [{
        title: 'Fourier',
        data: [WestSun.toFixed(5), 0, WestMoonB.toFixed(5), 0, WestSunTcorr.toFixed(5), 0, WestMoonTcorrB.toFixed(5), 0, (WestSunTcorr + WestMoonTcorrB).toFixed(4)]
    }]
    Print2 = Print2.concat(
        ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].map(title => {
            const {
                SunDifAccum,
                MoonDifAccum,
            } = AutoDifAccum(AnomaAccum, WinsolsDifRaw, title)
            const {
                SunTcorr2,
                MoonTcorr2,
                NodeAccumCorr
            } = AutoTcorr(AnomaAccum, WinsolsDifRaw, title)
            const SunDifAccumPrint = SunDifAccum.toFixed(5)
            const SunDifAccumInac = (SunDifAccum - WestSun).toFixed(4)
            const MoonDifAccumPrint = MoonDifAccum.toFixed(5)
            const MoonDifAccumInac = (MoonDifAccum - WestMoonB).toFixed(4)
            const SunTcorrPrint = SunTcorr2.toFixed(5)
            const SunTcorrInac = (SunTcorr2 - WestSunTcorr).toFixed(4)
            const MoonTcorrPrint = MoonTcorr2.toFixed(5)
            const MoonTcorrInac = (MoonTcorr2 - WestMoonTcorrB).toFixed(4)
            const Tcorr = +MoonTcorrPrint + +SunTcorrPrint
            return {
                title: CalNameList[title],
                data: [SunDifAccumPrint, SunDifAccumInac, MoonDifAccumPrint, MoonDifAccumInac, SunTcorrPrint, SunTcorrInac, MoonTcorrPrint, MoonTcorrInac, Tcorr.toFixed(4), NodeAccumCorr.toFixed(4)]
            }
        }))
    return { Print1, Print2 }
}
// console.log(BindTcorr(21.200901, 220.0911, 1000))

export const AutoEquator2Ecliptic = (LongiRaw, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    let Equator2Ecliptic = 0
    let Ecliptic2Equator = 0
    let Equator2EclipticDif = 0
    let Ecliptic2EquatorDif = 0
    if (Type <= 7 || ['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        const Func = Equator2EclipticTable(LongiRaw, CalName)
        Equator2Ecliptic = Func.Equator2Ecliptic
        Equator2EclipticDif = Func.Equator2EclipticDif
    } else if (Type === 8) {
        const Func = Equator2EclipticFormula(LongiRaw, CalName)
        Equator2Ecliptic = Func.Equator2Ecliptic
        Ecliptic2Equator = Func.Ecliptic2Equator
        Equator2EclipticDif = Func.Equator2EclipticDif
        Ecliptic2EquatorDif = Func.Ecliptic2EquatorDif
    } else if (Type === 9 || Type === 10) {
        const Func = Equator2EclipticFormula(LongiRaw, 'Jiyuan')
        Equator2Ecliptic = Func.Equator2Ecliptic
        Ecliptic2Equator = Func.Ecliptic2Equator
        Equator2EclipticDif = Func.Equator2EclipticDif
        Ecliptic2EquatorDif = Func.Ecliptic2EquatorDif
    } else if (Type === 11) {
        Ecliptic2Equator = Hushigeyuan(LongiRaw, 365.2575).Ecliptic2Equator
    }
    Ecliptic2EquatorDif = Ecliptic2Equator ? (Ecliptic2EquatorDif || Ecliptic2Equator - LongiRaw) : 0
    return {
        Equator2EclipticDif,
        Ecliptic2Equator,
        Equator2Ecliptic,
        Ecliptic2EquatorDif
    }
}

export const BindEquator2Ecliptic = (LongiRaw, Sidereal, year) => {
    Sidereal = +Sidereal
    LongiRaw = +LongiRaw
    if (LongiRaw >= Sidereal || LongiRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    let Range = ''
    if (LongiRaw < Sidereal / 4) {
        Range += '冬至 → 春分，赤度 > 黃度'
    } else if (LongiRaw < Sidereal / 2) {
        Range += '春分 → 夏至，赤度 < 黃度'
    } else if (LongiRaw < 3 * Sidereal / 4) {
        Range += '夏至 → 秋分，赤度 > 黃度'
    } else {
        Range += '秋分 → 冬至，赤度 < 黃度'
    }
    const {
        Equator2Ecliptic: WestB,
        Equator2EclipticDif: WestB1,
        Ecliptic2Equator: WestA,
        Ecliptic2EquatorDif: WestA1
    } = Equator2EclipticWest(LongiRaw, Sidereal, year)
    let Print = [{
        title: '球面三角',
        data: [WestB.toFixed(6), WestB1.toFixed(4), 0, WestA.toFixed(6), WestA1.toFixed(4), 0]
    }]
    Print = Print.concat(
        ['Qianxiang', 'Huangji', 'Dayan', 'Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi'].map(title => {
            let EclipticLongiPrint = '-'
            let EclipticLongiInac = '-'
            let EquatorLongiPrint = '-'
            let EquatorLongiInac = '-'
            let Equator2EclipticDifPrint = '-'
            let Ecliptic2EquatorDifPrint = '-'
            const Func = AutoEquator2Ecliptic(LongiRaw, title)
            const Equator2Ecliptic = Func.Equator2Ecliptic
            const Ecliptic2Equator = Func.Ecliptic2Equator
            const Equator2EclipticDif = Func.Equator2EclipticDif
            const Ecliptic2EquatorDif = Func.Ecliptic2EquatorDif
            if (Equator2Ecliptic) {
                EclipticLongiPrint = Equator2Ecliptic.toFixed(6)
                EclipticLongiInac = (Equator2Ecliptic - WestB).toFixed(4)
                Equator2EclipticDifPrint = Equator2EclipticDif.toFixed(4)
            }
            if (Ecliptic2Equator) {
                EquatorLongiPrint = Ecliptic2Equator.toFixed(6)
                EquatorLongiInac = (Ecliptic2Equator - WestA).toFixed(4)
                Ecliptic2EquatorDifPrint = Ecliptic2EquatorDif.toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [EclipticLongiPrint, Equator2EclipticDifPrint, EclipticLongiInac, EquatorLongiPrint, Ecliptic2EquatorDifPrint, EquatorLongiInac]
            }
        }))
    return {
        Range,
        Print
    }
}
// console.log(BindEquator2Ecliptic(360, 365.2575, 0).Range)

export const AutoLongi2Lati = (LongiRaw, WinsolsDecimal, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    LongiRaw += 0.5 - WinsolsDecimal // 以正午爲準
    let Longi2Lati = {}
    let Longi2LatiA = {}
    let Longi2LatiB = {}
    let special = 0
    if (Type >= 8 && !['Yingtian', 'Qianyuan'].includes(CalName)) {
        LongiRaw += AutoDifAccum(0, LongiRaw, CalName).SunDifAccum
    }
    if (Type <= 3) {
        Longi2Lati = Longi2LatiTable1(LongiRaw, 'Easthan')
    } else if (Type === 4) {
        Longi2Lati = Longi2LatiTable1(LongiRaw, CalName)
    } else if (Type === 6) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, CalName)
    } else if (['Dayan', 'Zhide', 'Wuji', 'Zhengyuan'].includes(CalName)) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, 'Dayan')
    } else if (['Xuanming', 'Qintian'].includes(CalName)) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, 'Xuanming')
    } else if (['Yingtian', 'Qianyuan'].includes(CalName)) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, CalName)
    } else if (['NewDaming', 'Gengwu'].includes(CalName)) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, 'NewDaming')
    } else if (Type === 8) {
        Longi2LatiA = Longi2LatiFormula(LongiRaw, CalName)
        Longi2LatiB = Longi2DialFormula(LongiRaw, CalName)
        special = 1
    } else if (Type <= 10) {
        Longi2LatiA = Longi2LatiFormula(LongiRaw, 'Jiyuan')
        Longi2LatiB = Longi2DialFormula(LongiRaw, 'Jiyuan')
        special = 1
    } else if (Type === 11) {
        Longi2Lati = Hushigeyuan(LongiRaw, 365.2575)
    }
    let Lati = 0
    let Lati1 = 0
    let Sunrise = 0
    let Dial = 0
    if (special) {
        Lati = Longi2LatiA.Lati
        Lati1 = Longi2LatiA.Lati1
        Sunrise = Longi2LatiA.Sunrise
        Dial = Longi2LatiB.Dial
    } else {
        Lati = Longi2Lati.Lati
        Lati1 = Longi2Lati.Lati1
        Sunrise = Longi2Lati.Sunrise
        Dial = Longi2Lati.Dial || 0
    }
    return {
        Lati,
        Lati1,
        Sunrise,
        Dial
    }
}
// console.log (AutoLongi2Lati (53.6, 0, 'Chongxuan'))

export const BindLongi2Lati = (LongiRaw, WinsolsDecimal, f, Sidereal, year) => {
    Sidereal = +Sidereal
    LongiRaw = +LongiRaw
    WinsolsDecimal = +('0.' + WinsolsDecimal)
    f = +f
    year = +year
    if (LongiRaw >= Sidereal || LongiRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    const Longi = LongiRaw + SunWest(LongiRaw, year).SunDifAccum // 積日轉換爲黃經
    const {
        Lati1: WestA,
        Lati: WestB
    } = Longi2LatiWest(Longi, Sidereal, year)
    const {
        v: WestC,
        v1: WestC1
    } = Longi2SunriseWest(Longi, f, Sidereal, year)
    const {
        Dial: WestD,
        Dial1: WestD1
    } = Longi2DialWest(Longi, f, Sidereal, year)
    let Print = [{
        title: '球面三角',
        data: [WestA.toFixed(4), WestB.toFixed(4), 0, `${WestC.toFixed(4)}\n${WestC1.toFixed(4)}`, 0, `${WestD.toFixed(4)}\n${WestD1.toFixed(4)}`, 0] // 假設1尺=20cm，小數點後4位是20um
    }]
    Print = Print.concat(
        ['Easthan', 'Yuanjia', 'Daming', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'NewDaming', 'Shoushi'].map(title => {
            let Lati1Print = '-'
            let LatiPrint = '-'
            let LatiInac = '-'
            let SunrisePrint = '-'
            let SunriseInac = '-'
            let DialPrint = '-'
            let DialInac = '-'
            const {
                Lati1,
                Lati,
                Sunrise,
                Dial
            } = AutoLongi2Lati(LongiRaw, WinsolsDecimal, title)
            if (Lati1) {
                Lati1Print = Lati1.toFixed(4)
                LatiPrint = Lati.toFixed(4)
                LatiInac = (Lati - WestB).toFixed(4)
            }
            if (Sunrise) {
                SunrisePrint = Sunrise.toFixed(4)
                SunriseInac = (Sunrise - WestC).toFixed(4)
            }
            if (Dial) {
                DialPrint = Dial.toFixed(4)
                DialInac = (Dial - WestD).toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [Lati1Print, LatiPrint, LatiInac, SunrisePrint, SunriseInac, DialPrint, DialInac]
            }
        }))
    return Print
}
// console.log(BindLongi2Lati(88, 0.45, 34.4, 365.2445, 1000))

export const AutoMoonLongiLati = (WinsolsDif, NodeAccum, CalName) => {
    const {
        Type,
        AutoPara
    } = Bind(CalName)
    const {
        Solar
    } = AutoPara[CalName]
    WinsolsDif %= Solar
    const SunEquatorLongi = WinsolsDif + AutoDifAccum(0, WinsolsDif, CalName).SunDifAccum
    const SunEclipticLongi = AutoEquator2Ecliptic(SunEquatorLongi, CalName).EclipticLongi
    let MoonLongi = {}
    let MoonLati = {}
    if (Type <= 3) {
        MoonLati = MoonLatiTable(NodeAccum, 'Qianxiang')
    } else if (CalName === 'Yuanjia') {
        MoonLati = MoonLatiTable(NodeAccum, CalName)
    } else if (Type === 4) {
        MoonLati = MoonLatiTable(NodeAccum, 'Daming')
    } else if (Type === 6) {
        MoonLongi = MoonLongiTable(SunEclipticLongi, NodeAccum, 'Huangji')
        MoonLati = MoonLatiTable(NodeAccum, 'Huangji')
    } else if (CalName === 'Qintian') {
        MoonLongi = MoonLongiTable(SunEclipticLongi, NodeAccum, 'Qintian')
        MoonLati = MoonLatiTable(NodeAccum, 'Dayan')
    } else if (Type === 7) {
        MoonLongi = MoonLongiTable(SunEclipticLongi, NodeAccum, 'Dayan')
        MoonLati = MoonLatiTable(NodeAccum, 'Dayan')
    } else if (CalName === 'Chongxuan') {
        MoonLongi = MoonLongiTable(SunEclipticLongi, NodeAccum, 'Dayan')
        MoonLati = MoonLatiFormula(NodeAccum, 'Chongxuan')
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        MoonLongi = MoonLongiTable(SunEclipticLongi, NodeAccum, 'Yingtian')
        MoonLati = MoonLatiFormula(NodeAccum, 'Chongxuan')
    } else if (['Chongtian', 'Guantian'].includes(CalName)) {
        MoonLongi = MoonLongiFormula(SunEclipticLongi, NodeAccum, CalName)
        MoonLati = MoonLatiFormula(NodeAccum, CalName)
    } else if (CalName === 'Mingtian') {
        MoonLongi = MoonLongiFormula(SunEclipticLongi, NodeAccum, CalName)
        MoonLati = MoonLatiFormula(NodeAccum, 'Guantian')
    } else if (Type === 9 || Type === 10) {
        MoonLongi = MoonLongiFormula(SunEclipticLongi, NodeAccum, 'Jiyuan')
        MoonLati = MoonLatiFormula(NodeAccum, 'Jiyuan')
    } else if (Type === 11) {
        MoonLongi = MoonLongiFormula(SunEclipticLongi, NodeAccum, CalName)
    }
    const EclipticLongi = MoonLongi.LongiRaw || AutoMoonAvgV(CalName) * NodeAccum
    const EquatorLongi = MoonLongi.EquatorLongi || 0
    const WhiteLongi = MoonLongi.WhiteLongi || 0
    const EclipticWhiteDif = MoonLongi.EclipticWhiteDif || 0
    const EclipticEquatorDif = MoonLongi.EclipticEquatorDif || EquatorLongi - EclipticLongi
    const EquatorWhiteDif = MoonLongi.EquatorWhiteDif || EquatorLongi - WhiteLongi
    const EquatorLongiB = MoonLongi.EquatorLongiB || 0
    const EclipticEquatorDifB = EquatorLongiB - EclipticLongi || 0
    const MoonEclipticLati = MoonLati.Lati || 0
    const MoonEclipticLati1 = MoonLati.Lati1 || 0
    return {
        EclipticLongi,
        EquatorLongi,
        EquatorLongiB,
        WhiteLongi,
        EclipticWhiteDif,
        EclipticEquatorDif,
        EclipticEquatorDifB,
        EquatorWhiteDif,
        MoonEclipticLati,
        MoonEclipticLati1
    }
}
// console.log(AutoMoonLongiLati(66, 2.41, 'Huangji'))

export const BindMoonLongiLati = (NodeAccum, WinsolsDif) => { // 該時刻入交日、距冬至日數
    NodeAccum = +NodeAccum
    WinsolsDif = +WinsolsDif
    if (NodeAccum >= 27.21221 || NodeAccum < 0) {
        throw (new Error('請輸入一交點月內的日數'))
    }
    if (WinsolsDif >= 365.246 || WinsolsDif < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    let Print = []
    Print = Print.concat(
        ['Qianxiang', 'Yuanjia', 'Daming', 'Huangji', 'Dayan', 'Chongxuan', 'Qintian', 'Yingtian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi'].map(title => {
            let WhiteLongiPrint = '-'
            let EquatorLongiPrint = '-'
            let EclipticWhiteDifPrint = '-'
            let EclipticEquatorDifPrint = '-'
            let EquatorWhiteDifPrint = '-'
            let Lati1Print = '-'
            let LatiPrint = '-'
            const {
                EclipticLongi,
                EquatorLongi,
                EclipticEquatorDif,
                EclipticWhiteDif,
                EquatorWhiteDif,
                WhiteLongi,
                EquatorLongiB,
                EclipticEquatorDifB,
                MoonEclipticLati1,
                MoonEclipticLati,
            } = AutoMoonLongiLati(WinsolsDif, NodeAccum, title)
            if (EquatorLongi) {
                if (EquatorLongiB) {
                    EquatorLongiPrint = EquatorLongi.toFixed(4) + `\n` + EquatorLongiB.toFixed(4)
                    EclipticEquatorDifPrint = EclipticEquatorDif.toFixed(4) + `\n` + EclipticEquatorDifB.toFixed(4)
                } else {
                    EquatorLongiPrint = EquatorLongi.toFixed(4)
                    EclipticEquatorDifPrint = EclipticEquatorDif.toFixed(4)
                }

                EquatorWhiteDifPrint = EquatorWhiteDif.toFixed(4)
            }
            if (WhiteLongi) {
                WhiteLongiPrint = WhiteLongi.toFixed(4)
                EclipticWhiteDifPrint = EclipticWhiteDif.toFixed(4)
            }
            if (MoonEclipticLati) {
                Lati1Print = MoonEclipticLati1.toFixed(4)
                LatiPrint = MoonEclipticLati.toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [EclipticLongi.toFixed(4), EquatorLongiPrint, EclipticEquatorDifPrint, WhiteLongiPrint, EclipticWhiteDifPrint, EquatorWhiteDifPrint, Lati1Print, LatiPrint]
            }
        }))
    return Print
}
// console.log(BindMoonLongiLati(2.252, 55.71))

export const BindSunEclipse = (NodeAccum, AnomaAccum, NewmDecimal, WinsolsDifRaw) => {
    NodeAccum = +NodeAccum
    AnomaAccum = +AnomaAccum
    NewmDecimal = +('0.' + NewmDecimal)
    WinsolsDifRaw = +WinsolsDifRaw
    const Solar = 365.24478
    const HalfTermLeng = Solar / 24
    if (NodeAccum > 27.212215) {
        throw (new Error('請輸入一交點月27.212215內的日數'))
    }
    if (AnomaAccum > 27.5545) {
        throw (new Error('請輸入一近點月27.5545內的日數'))
    }
    if (WinsolsDifRaw > 365.2425) {
        throw (new Error('請輸入一年365.2425內的日數'))
    }
    // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
    let i = 0
    for (let j = 0; j <= 11; j++) {
        if (WinsolsDifRaw >= j * HalfTermLeng && WinsolsDifRaw < (j + 1) * HalfTermLeng) {
            i = (j - 2 + 12) % 12
        }
        break
    }
    let Print = []
    Print = Print.concat(
        ['Zhengguang', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Jiyuan'].map(title => {
            const {
                Magni,
                Last,
                Decimal
            } = AutoEclipse(NodeAccum, AnomaAccum, NewmDecimal, WinsolsDifRaw, 1, title, i + 1, 0)
            let LastPrint = '-'
            if (Last) {
                LastPrint = Last.toFixed(4)
            }
            let DecimalPrint = '-'
            if (Decimal) {
                DecimalPrint = parseFloat((Decimal).toPrecision(12)) === NewmDecimal ? '定朔' : (Decimal * 100).toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [Magni.toFixed(4), LastPrint, DecimalPrint]
            }
        }))
    return Print
}
// console.log(BindSunEclipse(0.1, 14, 1355, 14))

export const BindMoonEclipse = (NodeAccum, AnomaAccum, NewmDecimal, WinsolsDifRaw) => {
    NodeAccum = +NodeAccum
    AnomaAccum = +AnomaAccum
    NewmDecimal = +('0.' + NewmDecimal)
    WinsolsDifRaw = +WinsolsDifRaw
    const Solar = 365.24478
    const HalfTermLeng = Solar / 24
    if (NodeAccum > 27.212215) {
        throw (new Error('請輸入一交點月27.212215內的日數'))
    }
    if (AnomaAccum > 27.5545) {
        throw (new Error('請輸入一近點月27.5545內的日數'))
    }
    if (WinsolsDifRaw > 365.2425) {
        throw (new Error('請輸入一年365.2425內的日數'))
    }
    // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
    let i = 0
    for (let j = 0; j <= 11; j++) {
        if (WinsolsDifRaw >= j * HalfTermLeng && WinsolsDifRaw < (j + 1) * HalfTermLeng) {
            i = (j - 2 + 12) % 12
        }
        break
    }
    let Print = []
    Print = Print.concat(
        ['Zhengguang', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Jiyuan'].map(title => {
            const {
                Magni,
                Last,
                Decimal
            } = AutoEclipse(NodeAccum, AnomaAccum, NewmDecimal, WinsolsDifRaw, 0, title, i + 1, 0)
            let LastPrint = '-'
            if (Last) {
                LastPrint = Last.toFixed(4)
            }
            let DecimalPrint = '-'
            if (Decimal) {
                DecimalPrint = parseFloat((Decimal).toPrecision(12)) === NewmDecimal ? '定望' : (Decimal * 100).toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [Magni.toFixed(4), LastPrint, DecimalPrint]
            }
        }))
    return Print
}