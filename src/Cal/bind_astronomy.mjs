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
    BindTcorr
} from './astronomy_acrv.mjs'
import {
    CalNameDayList
} from './para_constant.mjs'
// import {
//     EclipseFormula
// } from './eclipse_formula'
// import {
//     EclipseTable
// } from './eclipse_table'

export const AutoEquator2Ecliptic = (LongiRaw, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    let Result = 0
    if (Type <= 7) {
        Result = Equator2EclipticTable(LongiRaw, CalName)
    } else if (Type <= 10) {
        Result = Equator2EclipticFormula(LongiRaw, CalName).EclipticLongi
    } else if (Type === 11) {
        Result = Hushigeyuan(LongiRaw, 365.2575).EquatorLongi
    }
    return Result
}

export const BindEquator2Ecliptic = (LongiRaw, Sidereal, year) => {
    Sidereal = Number(Sidereal)
    LongiRaw = Number(LongiRaw)
    if (LongiRaw >= Sidereal || LongiRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    let Range = ''
    if (LongiRaw === 0) {
        Range += '冬至，赤度 = 黃度'
    } else if (LongiRaw < Sidereal / 4) {
        Range += '冬至 → 春分，赤度 > 黃度'
    } else if (LongiRaw === Sidereal / 4) {
        Range += '春分，赤度 = 黃度'
    } else if (LongiRaw < Sidereal / 2) {
        Range += '春分 → 夏至，赤度 < 黃度'
    } else if (LongiRaw === Sidereal / 2) {
        Range += '夏至，赤度 = 黃度'
    } else if (LongiRaw < 3 * Sidereal / 4) {
        Range += '夏至 → 秋分，赤度 > 黃度'
    } else if (LongiRaw === 3 * Sidereal / 4) {
        Range += '秋分，赤度 = 黃度'
    } else {
        Range += '秋分 → 冬至，赤度 < 黃度'
    }
    const {
        EquatorLongi: WestA,
        EclipticLongi: WestB
    } = Equator2EclipticWest(LongiRaw, Sidereal, year)
    let Print = [{
        title: '球面三角',
        data: [WestB.toFixed(6), 0, WestA.toFixed(6), 0]
    }]
    Print = Print.concat(
        ['Qianxiang', 'Huangji', 'Dayan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].map((title) => {
            const EclipticLongi = Equator2EclipticTable(LongiRaw, title)
            return {
                title: CalNameDayList[title],
                data: [EclipticLongi.toFixed(6), (EclipticLongi - WestB).toFixed(4), '-', '-']
            }
        }))
    Print = Print.concat(
        ['Chongxuan', 'Chongtian', 'Mingtian', 'Guantian'].map((title) => {
            const {
                EclipticLongi
            } = Equator2EclipticFormula(LongiRaw, title)
            return {
                title: CalNameDayList[title],
                data: [EclipticLongi.toFixed(6), (EclipticLongi - WestB).toFixed(4), '-', '-']
            }
        }))
    Print = Print.concat(
        ['Jiyuan'].map((title) => {
            const {
                EquatorLongi,
                EclipticLongi
            } = Equator2EclipticFormula(LongiRaw, title)
            return {
                title: CalNameDayList[title],
                data: [EclipticLongi.toFixed(6), (EclipticLongi - WestB).toFixed(4), EquatorLongi.toFixed(6), (EquatorLongi - WestA).toFixed(4)]
            }
        }))
    Print = Print.concat(
        ['Shoushi'].map((title) => {
            const {
                EquatorLongi
            } = Hushigeyuan(LongiRaw, Sidereal)
            return {
                title: CalNameDayList[title],
                data: ['-', '-', EquatorLongi.toFixed(6), (EquatorLongi - WestA).toFixed(4)]
            }
        }))
    return {
        Range,
        Print
    }
}
// console.log(BindEquator2Ecliptic(360, 365.2575, 0).Range)

export const BindAcrV = (AnomaAccum, OriginDifRaw, year) => {
    OriginDifRaw = Number(OriginDifRaw)
    AnomaAccum = Number(AnomaAccum)
    if (OriginDifRaw > 365.2425 || OriginDifRaw < 0) {
        throw (new Error('請輸入一回歸年內的日數！'))
    }
    if (AnomaAccum > 27.5545 || AnomaAccum < 0) {
        throw (new Error('請輸入一近點月內的日數！'))
    }
    const {
        SunDifAccum: WestSun,
        MoonDifAccum: WestMoon,
        Tcorr3: WestTcorr
    } = BindTcorr(AnomaAccum, OriginDifRaw, 'West', year)
    let Print = [{
        title: '傅立葉',
        data: [WestSun.toFixed(6), 0, WestMoon.toFixed(6), 0, '-', WestTcorr.toFixed(6), 0]
    }]
    Print = Print.concat(
        ['Qianxiang', 'Jingchu', 'Yuanjia', 'Daming', 'Zhengguang', 'Xinghe', 'Tianbao', 'Daye', 'Wuyin'].map((title) => {
            const {
                MoonDifAccum,
                Tcorr1
            } = BindTcorr(AnomaAccum, OriginDifRaw, title)
            return {
                title: CalNameDayList[title],
                data: ['-', '-', MoonDifAccum.toFixed(6), (MoonDifAccum - WestMoon).toFixed(4), Tcorr1.toFixed(6), '-', (Tcorr1 - WestTcorr).toFixed(4)]
            }
        }))
    Print = Print.concat(
        ['Huangji', 'Linde', 'Wuji', 'Zhengyuan', 'NewDaming', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Gengwu'].map((title) => {
            const {
                SunDifAccum,
                MoonDifAccum,
                Tcorr2,
                Tcorr1
            } = BindTcorr(AnomaAccum, OriginDifRaw, title)
            return {
                title: CalNameDayList[title],
                data: [SunDifAccum.toFixed(6), (SunDifAccum - WestSun).toFixed(4), MoonDifAccum.toFixed(6), (MoonDifAccum - WestMoon).toFixed(4), Tcorr1.toFixed(6), Tcorr2.toFixed(6), (Tcorr2 - WestTcorr).toFixed(4)]
            }
        }))
    Print = Print.concat(
        ['Dayan', 'Xuanming', 'Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].map((title) => {
            const {
                SunDifAccum,
                MoonDifAccum,
                Tcorr2,
                Tcorr1
            } = BindTcorr((AnomaAccum + 13.77727) % 27.55454, OriginDifRaw, title)
            return {
                title: CalNameDayList[title],
                data: [SunDifAccum.toFixed(6), (SunDifAccum - WestSun).toFixed(4), MoonDifAccum.toFixed(6), (MoonDifAccum - WestMoon).toFixed(4), Tcorr1.toFixed(6), Tcorr2.toFixed(6), (Tcorr2 - WestTcorr).toFixed(4)]
            }
        }))
    Print = Print.concat(
        ['Shoushi'].map((title) => {
            const {
                SunDifAccum,
                MoonDifAccum,
                Tcorr3
            } = BindTcorr(AnomaAccum, OriginDifRaw, title)
            return {
                title: CalNameDayList[title],
                data: [SunDifAccum.toFixed(6), (SunDifAccum - WestSun).toFixed(4), (-MoonDifAccum).toFixed(6), (-MoonDifAccum - WestMoon).toFixed(4), '-', Tcorr3.toFixed(6), (Tcorr3 - WestTcorr).toFixed(4)]
            }
        }))
    return Print
}
// console.log(BindAcrV(1, 61, 1000))

export const AutoLongi2Lati = (LongiRaw, OriginDecimal, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    let Longi2Lati = {}
    let Longi2LatiA = {}
    let Longi2LatiB = {}
    let special = 0
    if (Type <= 3) {
        Longi2Lati = Longi2LatiTable1(LongiRaw, 'Qianxiang')
    } else if (Type === 4) {
        Longi2Lati = Longi2LatiTable1(LongiRaw, CalName)
    } else if (Type === 6) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, OriginDecimal, CalName)
    } else if (['Dayan', 'Zhide', 'Wuji', 'Zhengyuan'].includes(CalName)) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, OriginDecimal, 'Dayan')
    } else if (['Xuanming', 'Yingtian', 'Qianyuan', 'Gengwu'].includes(CalName)) {
        Longi2Lati = Longi2LatiTable2(LongiRaw, OriginDecimal, CalName)
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
    let Sunrise = 0
    let Dial = 0
    if (special) {
        Lati = Longi2LatiA.Lati
        Sunrise = Longi2LatiA.Sunrise
        Dial = Longi2LatiB.Dial
    } else {
        Lati = Longi2Lati.Lati
        Sunrise = Longi2Lati.Sunrise
        Dial = Longi2Lati.Dial ? Longi2Lati.Dial : 0
    }
    return {
        Lati,
        Sunrise,
        Dial
    }
}

export const BindLongi2Lati = (LongiRaw, f, Sidereal, year) => {
    Sidereal = Number(Sidereal)
    LongiRaw = Number(LongiRaw)
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
        data: [WestA.toFixed(6), WestB.toFixed(6), 0, `${WestC.toFixed(6)}\n${WestC1.toFixed(6)}`, 0, `${WestD.toFixed(6)}\n${WestD1.toFixed(6)}`, 0]
    }]
    Print = Print.concat(
        ['Qianxiang', 'Yuanjia', 'Daming', 'Daye', 'Wuyin'].map((title) => {
            const {
                Lati1,
                Lati,
                Sunrise,
                Dial
            } = Longi2LatiTable1(LongiRaw, title)
            return {
                title: CalNameDayList[title],
                data: [Lati1.toFixed(6), Lati.toFixed(6), (Lati - WestB).toFixed(4), Sunrise.toFixed(6), (Sunrise - WestC).toFixed(4), Dial.toFixed(6), (Dial - WestD).toFixed(4)]
            }
        }))
    Print = Print.concat(
        ['Huangji', 'Linde', 'Dayan', 'Xuanming', 'Yingtian', 'Qianyuan', 'Gengwu'].map((title) => {
            const {
                Lati1,
                Lati,
                Sunrise,
                Dial
            } = Longi2LatiTable2(LongiRaw, 0.5, title)
            return {
                title: CalNameDayList[title],
                data: [Lati1.toFixed(6), Lati.toFixed(6), (Lati - WestB).toFixed(4), Sunrise.toFixed(6), (Sunrise - WestC).toFixed(4), Dial.toFixed(6), (Dial - WestD).toFixed(4)]
            }
        })
    )
    // const {
    //     Lati1: GengwuA,
    //     Lati: GengwuB,
    //     Sunrise: GengwuC
    // } = Longi2LatiTable2(LongiRaw, 0.5, 'Gengwu')
    // Print.push({
    //     title: CalNameDayList.Gengwu,
    //     data: [GengwuA.toFixed(6), GengwuB.toFixed(6), (GengwuB - WestB).toFixed(4), GengwuC.toFixed(6), (GengwuC - WestC).toFixed(4), '0', '0']
    // })
    Print = Print.concat(
        ['Yitian', 'Chongxuan', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan'].map((title) => {
            const {
                Lati,
                Lati1,
                Sunrise
            } = Longi2LatiFormula(LongiRaw, title)
            const {
                Dial
            } = Longi2DialFormula(LongiRaw, title)
            return {
                title: CalNameDayList[title],
                data: [Lati1.toFixed(6), Lati.toFixed(6), (Lati - WestB).toFixed(4), Sunrise.toFixed(6), (Sunrise - WestC).toFixed(4), Dial.toFixed(6), (Dial - WestD).toFixed(4)]
            }
        })
    )
    const {
        Lati1: ShoushiA,
        Lati: ShoushiB,
        Sunrise: ShoushiC
    } = Hushigeyuan(LongiRaw, Sidereal)
    Print.push({
        title: CalNameDayList.Shoushi,
        data: [ShoushiA.toFixed(6), ShoushiB.toFixed(6), (ShoushiB - WestB).toFixed(4), ShoushiC.toFixed(6), (ShoushiC - WestC).toFixed(4), '0', '0']
    })
    return Print
}
// console.log(BindLongi2Lati(88, 34.4, 365.2445, 1000))

export const AutoMoonLongiLati = (Day, OriginRawRaw, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    let MoonLongi = {}
    let MoonLati = {}
    if (Type <= 3) {
        MoonLati = MoonLatiTable(Day, 'Qianxiang')
    } else if (Type === 4) {
        MoonLati = MoonLatiTable(Day, 'Daming')
    } else if (Type === 6) {
        MoonLongi = MoonLongiTable(OriginRawRaw, Day, 'Huangji')
        MoonLati = MoonLatiTable(Day, 'Huangji')
    } else if (CalName === 'Qintian') {
        MoonLongi = MoonLongiTable(OriginRawRaw, Day, 'Qintian')
        MoonLati = MoonLatiTable(Day, 'Dayan')
    } else if (Type === 7) {
        MoonLongi = MoonLongiTable(OriginRawRaw, Day, 'Dayan')
        MoonLati = MoonLatiTable(Day, 'Dayan')
    } else if (CalName === 'Chongxuan') {
        MoonLongi = MoonLongiTable(OriginRawRaw, Day, 'Dayan')
        MoonLati = MoonLatiFormula(Day, 'Chongxuan')
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        MoonLongi = MoonLongiFormula(OriginRawRaw, Day, 'Yingtian')
        MoonLati = MoonLatiFormula(Day, 'Chongxuan')
    } else if (['Chongtian', 'Guantian'].includes(CalName)) {
        MoonLongi = MoonLongiFormula(OriginRawRaw, Day, CalName)
        MoonLati = MoonLatiFormula(Day, CalName)
    } else if (Type === 9 || Type === 10) {
        MoonLongi = MoonLongiFormula(OriginRawRaw, Day, 'Jiyuan')
        MoonLati = MoonLatiFormula(Day, 'Jiyuan')
    } else if (['Mingtian'].includes(CalName)) {
        MoonLongi = MoonLongiFormula(OriginRawRaw, Day, CalName)
        MoonLati = MoonLatiFormula(Day, 'Guantian')
    } else if (['Shoushi'].includes(CalName)) {
        MoonLongi = MoonLongiFormula(OriginRawRaw, Day, CalName)
    }
    const MoonEquatorLongi = MoonLongi.EquatorLongi ? MoonLongi.EquatorLongi : 0
    const MoonEclipticLati = MoonLati.Lati ? MoonLati.Lati : 0
    return {
        MoonEquatorLongi,
        MoonEclipticLati
    }
}
// console.log(AutoMoonLongiLati(2.41,366,'Dayan'))

export const BindMoonLongiLati = (Day, OriginRawRaw) => { // 該時刻入交日、距冬至日數
    Day = Number(Day)
    OriginRawRaw = Number(OriginRawRaw)
    if (Day >= 27.2122 || Day < 0) {
        throw (new Error('請輸入一交點月內的日數'))
    }
    if (OriginRawRaw >= 365.246 || OriginRawRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    const HuangjiLongi = MoonLongiTable(OriginRawRaw, Day, 'Huangji')
    const DayanLongi = MoonLongiTable(OriginRawRaw, Day, 'Dayan')
    const QintianLongi = MoonLongiTable(OriginRawRaw, Day, 'Qintian')
    const YingtianLongi = MoonLongiTable(OriginRawRaw, Day, 'Yingtian')
    const ChongtianLongi = MoonLongiFormula(OriginRawRaw, Day, 'Chongtian')
    const MingtianLongi = MoonLongiFormula(OriginRawRaw, Day, 'Mingtian')
    const GuantianLongi = MoonLongiFormula(OriginRawRaw, Day, 'Guantian')
    const JiyuanLongi = MoonLongiFormula(OriginRawRaw, Day, 'Jiyuan')
    const ShoushiLongi = MoonLongiFormula(OriginRawRaw, Day, 'Shoushi')
    const QianxiangLati = MoonLatiTable(Day, 'Qianxiang')
    const DamingLati = MoonLatiTable(Day, 'Daming')
    const HuangjiLati = MoonLatiTable(Day, 'Huangji')
    const DayanLati = MoonLatiTable(Day, 'Dayan')
    const ChongxuanLati = MoonLatiFormula(Day, 'Chongxuan')
    const QintianLati = MoonLatiFormula(Day, 'Qintian')
    const ChongtianLati = MoonLatiFormula(Day, 'Chongtian')
    const GuantianLati = MoonLatiFormula(Day, 'Guantian')
    const JiyuanLati = MoonLatiFormula(Day, 'Jiyuan')
    const Print = []
    Print.push({
        title: CalNameDayList.Qianxiang,
        data: ['', '', QianxiangLati.Lati1.toFixed(6), QianxiangLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Daming,
        data: ['', '', DamingLati.Lati1.toFixed(6), DamingLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Huangji,
        data: [HuangjiLongi.WhiteLongi.toFixed(6), HuangjiLongi.EquatorLongi.toFixed(6), HuangjiLati.Lati1.toFixed(6), HuangjiLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Dayan,
        data: [DayanLongi.WhiteLongi.toFixed(6), DayanLongi.EquatorLongi.toFixed(6), DayanLati.Lati1.toFixed(6), DayanLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Chongxuan,
        data: ['', '', ChongxuanLati.Lati1.toFixed(6), ChongxuanLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Qintian,
        data: [QintianLongi.WhiteLongi.toFixed(6), QintianLongi.EquatorLongi.toFixed(6), QintianLati.Lati1.toFixed(6), QintianLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Yingtian,
        data: [YingtianLongi.WhiteLongi.toFixed(6), YingtianLongi.EquatorLongi.toFixed(6), '', '']
    })
    Print.push({
        title: CalNameDayList.Chongtian,
        data: [ChongtianLongi.WhiteLongi.toFixed(6), ChongtianLongi.EquatorLongi.toFixed(6), ChongtianLati.Lati1.toFixed(6), ChongtianLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Mingtian,
        data: [MingtianLongi.WhiteLongi.toFixed(6), MingtianLongi.EquatorLongi.toFixed(6), '', '']
    })
    Print.push({
        title: CalNameDayList.Guantian,
        data: [GuantianLongi.WhiteLongi.toFixed(6), GuantianLongi.EquatorLongi.toFixed(6), GuantianLati.Lati1.toFixed(6), GuantianLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Jiyuan,
        data: [JiyuanLongi.WhiteLongi.toFixed(6), JiyuanLongi.EquatorLongi.toFixed(6), JiyuanLati.Lati1.toFixed(6), JiyuanLati.Lati.toFixed(6)]
    })
    Print.push({
        title: CalNameDayList.Shoushi,
        data: [ShoushiLongi.WhiteLongi.toFixed(6), ShoushiLongi.EquatorLongi.toFixed(6), '', '']
    })
    return Print
}
// console.log(BindMoonLongiLati(2.252, 55.71))

// export const BindSunEclipse = (NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, CalName) => {
//     Print = Print.concat(
//         ['Xuanming', 'Chongtian', 'Guantian', 'Jiyuan', 'NewDaming', 'Shoushi'].map((title) => {
//             const {
//                 Tcorr,
//                 Dcorr,
//                 EcliDeg
//             } = EclipseFormula(NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, 1, CalName)
//             return {
//                 title: CalNameDayList[title],
//                 data: [Tcorr.toFixed(5), Dcorr.toFixed(5), EcliDeg.toFixed(5)]
//             }
//         }))
//     Print = Print.concat(
//         ['Chongxuan'].map((title) => {
//             const {
//                 Tcorr
//             } = EclipseFormula(NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, 1, CalName)
//             return {
//                 title: CalNameDayList[title],
//                 data: [Tcorr.toFixed(5), '-', '-']
//             }
//         }))
//     Print = Print.concat(
//         ['Wuji', 'Zhengyuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Mingtian'].map((title) => {
//             const {
//                 Dcorr,
//                 EcliDeg
//             } = EclipseFormula(NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, 1, CalName)
//             return {
//                 title: CalNameDayList[title],
//                 data: ['-', Dcorr.toFixed(5), EcliDeg.toFixed(5)]
//             }
//         }))
// }