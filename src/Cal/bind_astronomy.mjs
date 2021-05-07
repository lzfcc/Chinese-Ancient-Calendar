import {
    Bind,
} from './bind.mjs'
import {
    Equa2EclpTable,
    Longi2LatiTable1,
    Longi2LatiTable2,
    MoonLongiTable,
    MoonLatiTable
} from './astronomy_table.mjs'
import {
    Equa2EclpFormula,
    Longi2LatiFormula,
    Longi2DialFormula,
    MoonLatiFormula,
    MoonLongiFormula
} from './astronomy_formula.mjs'
import {
    Hushigeyuan,
    HushigeyuanMoon,
} from './equa_geometry.mjs'
import {
    Equa2EclpWest,
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
// import { AutoMoonAvgV } from './astronomy_acrv.mjs'

export const BindTcorr = (AnomaAccum, WinsolsDifRaw, year, CalName) => {
    WinsolsDifRaw = +WinsolsDifRaw
    AnomaAccum = +AnomaAccum
    if (WinsolsDifRaw > 365.2425 || WinsolsDifRaw < 0) {
        throw (new Error('請輸入一回歸年內的日數！'))
    }
    const {
        SunTcorr2: WestSunTcorr,
        MoonTcorr2: WestMoonTcorr,
        NodeAccumCorr: WestNodeCorr
    } = AutoTcorr(AnomaAccum, WinsolsDifRaw, 'West', 0, year)
    const {
        SunDifAccum: WestSun,
        MoonDifAccum: WestMoon,
    } = AutoDifAccum(AnomaAccum, WinsolsDifRaw, 'West', year)
    const {
        MoonTcorr2: WestMoonTcorrB,
        NodeAccumCorr: WestNodeCorrB
    } = AutoTcorr(AnomaAccum + 13.7772755949, WinsolsDifRaw, 'West', 0, year) // 13.7772755949是應天半轉
    const {
        MoonDifAccum: WestMoonB,
    } = AutoDifAccum(AnomaAccum + 13.7772755949, WinsolsDifRaw, 'West', year)

    let Print1 = [{
        title: '現代近似',
        data: [WestSun.toFixed(5), 0, WestMoon.toFixed(5), 0, WestSunTcorr.toFixed(5), 0, WestMoonTcorr.toFixed(5), 0, (WestSunTcorr + WestMoonTcorr).toFixed(4), WestNodeCorr.toFixed(4)]
    }]
    let List1 = ['Qianxiang', 'Jingchu', 'Yuanjia', 'Daming', 'Zhengguang', 'Xinghe', 'Tianbao', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Wuji', 'Zhengyuan', 'Futian', 'Mingtian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'NewDaming', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Shoushi']
    let List2 = ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian']
    List1 = CalName ? [CalName] : List1
    List2 = CalName ? [CalName] : List2
    let SunTcorrInac = 0
    let MoonTcorrInac = 0
    Print1 = Print1.concat(
        List1.map(title => {
            const {
                SunDifAccum,
                MoonDifAccum,
            } = AutoDifAccum(AnomaAccum, WinsolsDifRaw, title)
            const {
                SunTcorr,
                MoonTcorr,
                NodeAccumCorr
            } = AutoTcorr(AnomaAccum, WinsolsDifRaw, title)
            let SunTcorrPrint = '-'
            let SunTcorrInacPrint = '-'
            let MoonTcorrPrint = '-'
            let MoonTcorrInacPrint = '-'
            let NodeAccumCorrPrint = '-'
            const SunDifAccumPrint = SunDifAccum ? SunDifAccum.toFixed(5) : '-'
            const SunDifAccumInac = SunDifAccum ? SunDifAccum - WestSun : 0
            const SunDifAccumInacPrint = SunDifAccumInac ? SunDifAccumInac.toFixed(4) : '-'
            const MoonDifAccumPrint = MoonDifAccum.toFixed(5)
            const MoonDifAccumInac = MoonDifAccum - WestMoon
            const MoonDifAccumInacPrint = MoonDifAccumInac.toFixed(4)
            if (SunTcorr) {
                SunTcorrPrint = SunTcorr.toFixed(5)
                SunTcorrInac = SunTcorr - WestSunTcorr
                SunTcorrInacPrint = SunTcorrInac.toFixed(4)
            }
            if (MoonTcorr) {
                MoonTcorrPrint = MoonTcorr.toFixed(5)
                MoonTcorrInac = MoonTcorr - WestMoonTcorr
                MoonTcorrInacPrint = MoonTcorrInac.toFixed(4)
            }
            if (NodeAccumCorr) {
                NodeAccumCorrPrint = NodeAccumCorr.toFixed(4)
            }
            const Tcorr = +MoonTcorrPrint + (+SunTcorrPrint || 0)
            return {
                title: CalNameList[title],
                data: [SunDifAccumPrint, SunDifAccumInacPrint, MoonDifAccumPrint, MoonDifAccumInacPrint, SunTcorrPrint, SunTcorrInacPrint, MoonTcorrPrint, MoonTcorrInacPrint, Tcorr.toFixed(4), NodeAccumCorrPrint]
            }
        }))
    let Print2 = [{
        title: '現代近似',
        data: [WestSun.toFixed(5), 0, WestMoonB.toFixed(5), 0, WestSunTcorr.toFixed(5), 0, WestMoonTcorrB.toFixed(5), 0, (WestSunTcorr + WestMoonTcorrB).toFixed(4), WestNodeCorrB.toFixed(4)]
    }]
    Print2 = Print2.concat(
        List2.map(title => {
            const {
                SunDifAccum,
                MoonDifAccum,
            } = AutoDifAccum(AnomaAccum, WinsolsDifRaw, title)
            const {
                SunTcorr,
                MoonTcorr,
                NodeAccumCorr
            } = AutoTcorr(AnomaAccum, WinsolsDifRaw, title)
            const SunDifAccumPrint = SunDifAccum.toFixed(5)
            const SunDifAccumInacPrint = (SunDifAccum - WestSun).toFixed(4)
            const MoonDifAccumPrint = MoonDifAccum.toFixed(5)
            const MoonDifAccumInacPrint = (MoonDifAccum - WestMoonB).toFixed(4)
            const SunTcorrPrint = SunTcorr.toFixed(5)
            SunTcorrInac = SunTcorr - WestSunTcorr
            const SunTcorrInacPrint = SunTcorrInac.toFixed(4)
            const MoonTcorrPrint = MoonTcorr.toFixed(5)
            MoonTcorrInac = MoonTcorr - WestMoonTcorr
            const MoonTcorrInacPrint = MoonTcorrInac.toFixed(4)
            const Tcorr = +MoonTcorrPrint + +SunTcorrPrint
            return {
                title: CalNameList[title],
                data: [SunDifAccumPrint, SunDifAccumInacPrint, MoonDifAccumPrint, MoonDifAccumInacPrint, SunTcorrPrint, SunTcorrInacPrint, MoonTcorrPrint, MoonTcorrInacPrint, Tcorr.toFixed(4), NodeAccumCorr.toFixed(4)]
            }
        }))
    return { Print1, Print2, SunTcorrInac, MoonTcorrInac }
}
// console.log(BindTcorr(21.200901, 220.0911, 1000))

export const AutoEqua2Eclp = (LongiRaw, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    let Equa2Eclp = 0
    let Eclp2Equa = 0
    let Equa2EclpDif = 0
    let Eclp2EquaDif = 0
    let Eclp2EquaLati = 0
    if (Type <= 7 || ['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        const Func = Equa2EclpTable(LongiRaw, CalName)
        Equa2Eclp = Func.Equa2Eclp
        Equa2EclpDif = Func.Equa2EclpDif
    } else if (Type === 8) {
        const Func = Equa2EclpFormula(LongiRaw, CalName)
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
    } else if (Type === 9 || Type === 10) {
        const Func = Equa2EclpFormula(LongiRaw, 'Jiyuan')
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
    } else if (Type === 11) {
        const Func = Hushigeyuan(LongiRaw)
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
        Eclp2EquaLati = Func.Lati
    }
    Eclp2EquaDif = Eclp2Equa ? (Eclp2EquaDif || Eclp2Equa - LongiRaw) : 0
    return {
        Equa2Eclp,
        Equa2EclpDif,
        Eclp2Equa,
        Eclp2EquaDif,
        Eclp2EquaLati
    }
}

export const BindEqua2Eclp = (LongiRaw, Sidereal, year) => {
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
        Equa2Eclp: WestB,
        Equa2EclpDif: WestB1,
        Eclp2Equa: WestA,
        Eclp2EquaDif: WestA1
    } = Equa2EclpWest(LongiRaw, Sidereal, year)
    const {
        Lati: WestLati
    } = Longi2LatiWest(LongiRaw, Sidereal, year)
    let Print = [{
        title: '球面三角',
        data: [WestB.toFixed(5), WestB1.toFixed(4), 0, WestA.toFixed(5), WestA1.toFixed(4), 0, WestLati.toFixed(4), 0]
    }]
    const List1 = ['Qianxiang', 'Huangji', 'Dayan', 'Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi']
    const List2 = ['Chongxuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi']
    Print = Print.concat(
        List1.map(title => {
            let EclpLongiPrint = '-'
            let EclpLongiInacPrint = '-'
            let EquaLongiPrint = '-'
            let EquaLongiInacPrint = '-'
            let Equa2EclpDifPrint = '-'
            let Eclp2EquaDifPrint = '-'
            let Eclp2EquaLatiPrint = '-'
            let Eclp2EquaLatiInacPrint = '-'
            const Func = AutoEqua2Eclp(LongiRaw, title, Sidereal, year)
            const Equa2Eclp = Func.Equa2Eclp
            const Eclp2Equa = Func.Eclp2Equa
            const Equa2EclpDif = Func.Equa2EclpDif
            const Eclp2EquaDif = Func.Eclp2EquaDif
            let Eclp2EquaLati = 0
            if (title === 'Shoushi') {
                Eclp2EquaLati = Func.Eclp2EquaLati
            } else if (List2.indexOf(title) > 0) {
                Eclp2EquaLati = AutoLongi2Lati(LongiRaw, 0.5, title, 1).Lati
            }
            const Eclp2EquaLatiInac = Eclp2EquaLati - WestLati
            if (Equa2Eclp) {
                EclpLongiPrint = Equa2Eclp.toFixed(5)
                Equa2EclpDifPrint = Equa2EclpDif.toFixed(4)
                EclpLongiInacPrint = (Equa2Eclp - WestB).toFixed(4)
            }
            if (Eclp2Equa) {
                EquaLongiPrint = Eclp2Equa.toFixed(5)
                Eclp2EquaDifPrint = Eclp2EquaDif.toFixed(4)
                EquaLongiInacPrint = (Eclp2Equa - WestA).toFixed(4)
            }
            if (Eclp2EquaLati) {
                Eclp2EquaLatiPrint = Eclp2EquaLati.toFixed(4)
                Eclp2EquaLatiInacPrint = Eclp2EquaLatiInac.toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [EclpLongiPrint, Equa2EclpDifPrint, EclpLongiInacPrint, EquaLongiPrint, Eclp2EquaDifPrint, EquaLongiInacPrint, Eclp2EquaLatiPrint, Eclp2EquaLatiInacPrint]
            }
        }))
    return {
        Range,
        Print
    }
}
// console.log(BindEqua2Eclp(360, 365.2575, 0).Range)

export const AutoLongi2Lati = (LongiRaw, WinsolsDecimal, CalName, isBare) => {
    const {
        Type,
    } = Bind(CalName)
    LongiRaw += 0.5 - WinsolsDecimal // 以正午爲準
    let Longi2Lati = {}
    let Longi2LatiA = {}
    let Longi2LatiB = {}
    let special = 0
    // 公式曆法加上日躔
    if (isBare) { } else if (['Chongxuan', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi'].includes(CalName)) { // 經測試， 'Yingtian', 'Qianyuan', 'Yitian' 不能加日躔
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
        Longi2Lati = Hushigeyuan(LongiRaw)
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
        data: [WestA.toFixed(4), WestB.toFixed(4), 0, `${WestC.toFixed(4)}\n${WestC1.toFixed(4)}`, 0, (WestC1 - WestC).toFixed(4), `${WestD.toFixed(4)}\n${WestD1.toFixed(4)}`, 0, (WestD1 - WestD).toFixed(4)]
    }]
    Print = Print.concat(
        ['Easthan', 'Yuanjia', 'Daming', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'NewDaming', 'Shoushi'].map(title => {
            let Lati1Print = '-'
            let LatiPrint = '-'
            let LatiInacPrint = '-'
            let SunrisePrint = '-'
            let SunriseInacPrint1 = '-'
            let SunriseInacPrint2 = '-'
            let DialPrint = '-'
            let DialInacPrint1 = '-'
            let DialInacPrint2 = '-'
            const {
                Lati1,
                Lati,
                Sunrise,
                Dial
            } = AutoLongi2Lati(LongiRaw, WinsolsDecimal, title)
            if (Lati1) {
                Lati1Print = Lati1.toFixed(4)
                LatiPrint = Lati.toFixed(4)
                LatiInacPrint = (Lati - WestB).toFixed(4)
            }
            if (Sunrise) {
                SunrisePrint = Sunrise.toFixed(4)
                SunriseInacPrint1 = (Sunrise - WestC).toFixed(4)
                SunriseInacPrint2 = (Sunrise - WestC1).toFixed(4)
            }
            if (Dial) {
                DialPrint = Dial.toFixed(4)
                DialInacPrint1 = (Dial - WestD).toFixed(4)
                DialInacPrint2 = (Dial - WestD1).toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [Lati1Print, LatiPrint, LatiInacPrint, SunrisePrint, SunriseInacPrint1, SunriseInacPrint2, DialPrint, DialInacPrint1, DialInacPrint2]
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
    let {
        Solar,
        SolarRaw,
        Sidereal
    } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    WinsolsDif %= Solar
    const SunEquaLongi = WinsolsDif + AutoDifAccum(0, WinsolsDif, CalName).SunDifAccum
    let SunEclpLongi = 0
    if (Type === 11) { // 授時直接就是黃度
        SunEclpLongi = SunEquaLongi
    } else {
        SunEclpLongi = AutoEqua2Eclp(SunEquaLongi, CalName).Equa2Eclp
    }
    let MoonLongi = {}
    let MoonLati = {}
    if (Type <= 3) {
        MoonLati = MoonLatiTable(NodeAccum, 'Qianxiang')
    } else if (CalName === 'Yuanjia') {
        MoonLati = MoonLatiTable(NodeAccum, CalName)
    } else if (Type === 4) {
        MoonLati = MoonLatiTable(NodeAccum, 'Daming')
    } else if (Type === 6) {
        MoonLongi = MoonLongiTable(SunEclpLongi, NodeAccum, 'Huangji')
        MoonLati = MoonLatiTable(NodeAccum, 'Huangji')
    } else if (CalName === 'Qintian') {
        MoonLongi = MoonLongiTable(SunEclpLongi, NodeAccum, 'Qintian')
        MoonLati = MoonLatiTable(NodeAccum, 'Dayan')
    } else if (Type === 7) {
        MoonLongi = MoonLongiTable(SunEclpLongi, NodeAccum, 'Dayan')
        MoonLati = MoonLatiTable(NodeAccum, 'Dayan')
    } else if (CalName === 'Chongxuan') {
        MoonLongi = MoonLongiTable(SunEclpLongi, NodeAccum, 'Dayan')
        MoonLati = MoonLatiFormula(NodeAccum, 'Chongxuan')
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        MoonLongi = MoonLongiTable(SunEclpLongi, NodeAccum, 'Yingtian')
        MoonLati = MoonLatiFormula(NodeAccum, 'Chongxuan')
    } else if (['Chongtian', 'Guantian'].includes(CalName)) {
        MoonLongi = MoonLongiFormula(SunEclpLongi, NodeAccum, CalName)
        MoonLati = MoonLatiFormula(NodeAccum, CalName)
    } else if (CalName === 'Mingtian') {
        MoonLongi = MoonLongiFormula(SunEclpLongi, NodeAccum, CalName)
        MoonLati = MoonLatiFormula(NodeAccum, 'Guantian')
    } else if (Type === 9 || Type === 10) {
        MoonLongi = MoonLongiFormula(SunEclpLongi, NodeAccum, 'Jiyuan')
        MoonLati = MoonLatiFormula(NodeAccum, 'Jiyuan')
    } else if (Type === 11) {
        MoonLongi = HushigeyuanMoon(SunEclpLongi, NodeAccum)
        MoonLati = MoonLongi
    }
    let EclpLongi = MoonLongi.EclpLongi || 0
    if (!EclpLongi) {
        const WinsolsDif1 = WinsolsDif - NodeAccum
        EclpLongi = WinsolsDif1 + AutoMoonAvgV(CalName) * NodeAccum
    }
    const EquaLongi = MoonLongi.EquaLongi || 0
    const WhiteLongi = MoonLongi.WhiteLongi || 0
    const EclpWhiteDif = MoonLongi.EclpWhiteDif || 0
    const EclpEquaDif = MoonLongi.EclpEquaDif || EquaLongi - EclpLongi
    const EquaWhiteDif = MoonLongi.EquaWhiteDif || EquaLongi - WhiteLongi
    const EquaLongiB = MoonLongi.EquaLongiB || 0
    const EclpEquaDifB = EquaLongiB - EclpLongi || 0
    const MoonEquaLati = MoonLati.EquaLati || 0
    const MoonEclpLati = MoonLati.Lati || MoonEquaLati - AutoLongi2Lati(SunEclpLongi, 0.5, CalName).Lati
    const MoonEclpLati1 = MoonLati.Lati1 || Sidereal / 4 - MoonEclpLati
    return {
        EclpLongi,
        EquaLongi,
        EquaLongiB,
        WhiteLongi,
        EclpWhiteDif,
        EclpEquaDif,
        EclpEquaDifB,
        EquaWhiteDif,
        MoonEclpLati,
        MoonEclpLati1,
        MoonEquaLati
    }
}
// console.log(AutoMoonLongiLati(66, 2.41, 'Shoushi').EquaLongi)

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
            let EquaLongiPrint = '-'
            let EclpWhiteDifPrint = '-'
            let EclpEquaDifPrint = '-'
            let EquaWhiteDifPrint = '-'
            let Lati1Print = '-'
            let LatiPrint = '-'
            let EquaLatiPrint = '-'
            const {
                EclpLongi,
                EquaLongi,
                EclpEquaDif,
                EclpWhiteDif,
                EquaWhiteDif,
                WhiteLongi,
                EquaLongiB,
                EclpEquaDifB,
                MoonEclpLati1,
                MoonEclpLati,
                MoonEquaLati
            } = AutoMoonLongiLati(WinsolsDif, NodeAccum, title)
            if (EquaLongi) {
                if (EquaLongiB) {
                    EquaLongiPrint = EquaLongi.toFixed(4) + `\n` + EquaLongiB.toFixed(4)
                    EclpEquaDifPrint = EclpEquaDif.toFixed(4) + `\n` + EclpEquaDifB.toFixed(4)
                } else {
                    EquaLongiPrint = EquaLongi.toFixed(4)
                    EclpEquaDifPrint = EclpEquaDif.toFixed(4)
                }

                EquaWhiteDifPrint = EquaWhiteDif.toFixed(4)
            }
            if (WhiteLongi) {
                WhiteLongiPrint = WhiteLongi.toFixed(4)
                EclpWhiteDifPrint = EclpWhiteDif.toFixed(4)
            }
            if (MoonEclpLati) {
                Lati1Print = MoonEclpLati1.toFixed(4)
                LatiPrint = MoonEclpLati.toFixed(4)
            }
            if (MoonEquaLati) {
                EquaLatiPrint = MoonEquaLati.toFixed(4)
            }
            return {
                title: CalNameList[title],
                data: [EclpLongi.toFixed(4), EquaLongiPrint, EclpEquaDifPrint, WhiteLongiPrint, EclpWhiteDifPrint, EquaWhiteDifPrint, Lati1Print, LatiPrint, EquaLatiPrint]
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

const InacPrintAnaly_SunTcorr = (CalName, AnomaAccum, year) => {
    let SunTcorrInac = []
    for (let i = 0; i <= 365; i++) {// i:WinsolsDifRaw
        SunTcorrInac[i] = BindTcorr(AnomaAccum, i, year, CalName).SunTcorrInac
    }
    return SunTcorrInac
}
// console.log (InacPrintAnaly_SunTcorr('Shoushi', 7, 1247))