import Para from './para_calendars.mjs'
import {
    Equa2EclpTable, Lon2LatTable1, Lon2LatTable2, MoonLatTable
} from './astronomy_table.mjs'
import {
    Equa2EclpFormula, Lon2LatFormula, Lon2DialFormula, MoonLatFormula, MoonLonFormula
} from './astronomy_formula.mjs'
import { Hushigeyuan, HushigeyuanMoon } from './equa_geometry.mjs'
import {
    Equa2EclpWest, Lon2LatWest, Lon2SunriseWest, Lon2DialWest, SunAcrVWest,    // MoonAcrVWest
} from './astronomy_west.mjs'
import { AutoTcorr, AutoDifAccum, AutoMoonAcrS } from './astronomy_acrv.mjs'
import { NameList, AutoDegAccumList } from './para_constant.mjs'
import { AutoEclipse } from './astronomy_eclipse.mjs'
import { Deg2Mansion, Mansion2Deg } from './astronomy_other.mjs'
import { AutoMoonAvgV, AutoNodeCycle } from './para_auto-constant.mjs'

export const BindTcorr = (AnomaAccum, SolsDif, year, Name) => {
    SolsDif = +SolsDif
    AnomaAccum = +AnomaAccum
    if (SolsDif > 365.2425 || SolsDif < 0) {
        throw (new Error('請輸入一回歸年內的日數！'))
    }
    const {
        SunTcorr2: WestSunTcorr,
        MoonTcorr2: WestMoonTcorr,
        NodeAccumCorrA: WestNodeConst
    } = AutoTcorr(AnomaAccum, SolsDif, 'West', 0, year)
    const {
        SunDifAccum: WestSun,
        MoonDifAccum: WestMoon,
    } = AutoDifAccum(AnomaAccum, SolsDif, 'West', year)
    const {
        MoonTcorr2: WestMoonTcorrB,
        NodeAccumCorrA: WestNodeConstB
    } = AutoTcorr(AnomaAccum + 13.7772755949, SolsDif, 'West', 0, year) // 13.7772755949是應天半轉
    const { MoonDifAccum: WestMoonB,
    } = AutoDifAccum(AnomaAccum + 13.7772755949, SolsDif, 'West', year)

    let Print1 = [{
        title: '現代近似',
        data: [WestSun.toFixed(5), 0, '-', WestMoon.toFixed(4), 0, WestSunTcorr.toFixed(5), 0, WestMoonTcorr.toFixed(5), 0, (WestSunTcorr + WestMoonTcorr).toFixed(4), WestNodeConst.toFixed(4)]
    }]
    let List1 = ['Qianxiang', 'Jingchu', 'Yuanjia', 'Daming', 'Tsrengguang', 'Xinghe', 'Tianbao', 'Daye', 'WuyinA', 'Huangji', 'LindeA', 'Wuji', 'Tsrengyuan', 'Futian', 'Qintian', 'Mingtian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Daming3', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chunyou', 'Huitian', 'Chengtian', 'Shoushi']
    let List2 = ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Fengyuan', 'Guantian', 'Zhantian']
    List1 = Name ? [Name] : List1 // 這行用來給誤差分析程序
    List2 = Name ? [Name] : List2
    let SunTcorrInac = 0
    let MoonTcorrInac = 0
    Print1 = Print1.concat(
        List1.map(title => {
            let AutoDifAccumFunc = {}
            if (title !== 'Qintian') {
                AutoDifAccumFunc = AutoDifAccum(AnomaAccum, SolsDif, title)
            }
            const { SunDifAccum, MoonDifAccum } = AutoDifAccumFunc
            const { SunTcorr, MoonTcorr, MoonAcrVd, NodeAccumCorrA } = AutoTcorr(AnomaAccum, SolsDif, title)
            const MoonAcrS = AutoMoonAcrS(AnomaAccum, title).MoonAcrS
            let SunTcorrPrint = '-'
            let SunTcorrInacPrint = '-'
            let MoonAcrSPrint = '-'
            let MoonTcorrPrint = '-'
            let MoonTcorrInacPrint = '-'
            let NodeAccumCorrPrint = '-'
            const SunDifAccumPrint = SunDifAccum ? SunDifAccum.toFixed(5) : '-'
            const SunDifAccumInac = SunDifAccum ? SunDifAccum - WestSun : 0
            const SunDifAccumInacPrint = SunDifAccumInac ? SunDifAccumInac.toFixed(4) : '-'
            let MoonDifAccumPrint = MoonDifAccum ? MoonDifAccum.toFixed(4) : '-'
            const MoonDifAccumInac = MoonDifAccum ? MoonDifAccum - WestMoon : '-'
            const MoonDifAccumInacPrint = MoonDifAccum ? MoonDifAccumInac.toFixed(4) : '-'
            if (SunTcorr) {
                SunTcorrPrint = SunTcorr.toFixed(5)
                SunTcorrInac = SunTcorr - WestSunTcorr
                SunTcorrInacPrint = SunTcorrInac.toFixed(4)
            }
            if (MoonAcrS) {
                MoonAcrSPrint = MoonAcrS.toFixed(3)
            }
            if (MoonTcorr) {
                MoonTcorrPrint = MoonTcorr.toFixed(5)
                MoonTcorrInac = MoonTcorr - WestMoonTcorr
                MoonTcorrInacPrint = MoonTcorrInac.toFixed(4)
            }
            if (MoonAcrVd) {
                MoonDifAccumPrint += `\n${MoonAcrVd.toFixed(4)}`
            }
            if (NodeAccumCorrA) {
                NodeAccumCorrPrint = NodeAccumCorrA.toFixed(4)
            }
            const Tcorr = +MoonTcorrPrint + (+SunTcorrPrint || 0)
            return {
                title: NameList[title],
                data: [SunDifAccumPrint, SunDifAccumInacPrint, MoonAcrSPrint, MoonDifAccumPrint, MoonDifAccumInacPrint, SunTcorrPrint, SunTcorrInacPrint, MoonTcorrPrint, MoonTcorrInacPrint, Tcorr.toFixed(4), NodeAccumCorrPrint]
            }
        }))
    let Print2 = [{
        title: '現代近似',
        data: [WestSun.toFixed(5), 0, '-', WestMoonB.toFixed(4), 0, WestSunTcorr.toFixed(5), 0, WestMoonTcorrB.toFixed(5), 0, (WestSunTcorr + WestMoonTcorrB).toFixed(4), WestNodeConstB.toFixed(4)]
    }]
    Print2 = Print2.concat(
        List2.map(title => {
            const { SunDifAccum, MoonDifAccum,
            } = AutoDifAccum(AnomaAccum, SolsDif, title)
            const { SunTcorr, MoonTcorr, NodeAccumCorrA
            } = AutoTcorr(AnomaAccum, SolsDif, title)
            const MoonAcrS = AutoMoonAcrS(AnomaAccum, title).MoonAcrS
            const SunDifAccumPrint = SunDifAccum.toFixed(5)
            const SunDifAccumInacPrint = (SunDifAccum - WestSun).toFixed(4)
            let MoonAcrSPrint = '-'
            if (MoonAcrS) {
                MoonAcrSPrint = MoonAcrS.toFixed(3)
            }
            const MoonDifAccumPrint = MoonDifAccum.toFixed(4)
            const MoonDifAccumInacPrint = (MoonDifAccum - WestMoonB).toFixed(4)
            const SunTcorrPrint = SunTcorr.toFixed(5)
            SunTcorrInac = SunTcorr - WestSunTcorr
            const SunTcorrInacPrint = SunTcorrInac.toFixed(4)
            const MoonTcorrPrint = MoonTcorr.toFixed(5)
            MoonTcorrInac = MoonTcorr - WestMoonTcorrB
            const MoonTcorrInacPrint = MoonTcorrInac.toFixed(4)
            const Tcorr = +MoonTcorrPrint + +SunTcorrPrint
            return {
                title: NameList[title],
                data: [SunDifAccumPrint, SunDifAccumInacPrint, MoonAcrSPrint, MoonDifAccumPrint, MoonDifAccumInacPrint, SunTcorrPrint, SunTcorrInacPrint, MoonTcorrPrint, MoonTcorrInacPrint, Tcorr.toFixed(4), NodeAccumCorrA.toFixed(4)]
            }
        }))
    return { Print1, Print2, SunTcorrInac, MoonTcorrInac }
}
// console.log(BindTcorr(21.200901, 220.0911, 1000))

export const AutoEqua2Eclp = (LonRaw, Name) => {
    const { Type, Sidereal, Solar, SolarRaw } = Para[Name]
    LonRaw %= Sidereal || (Solar || SolarRaw)
    let Equa2Eclp = 0
    let Eclp2Equa = 0
    let Equa2EclpDif = 0
    let Eclp2EquaDif = 0
    let Eclp2EquaLat = 0
    if (Name === 'Dayan') {
        const Func = Equa2EclpFormula(LonRaw, Name)
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
    } else if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        const Func = Equa2EclpTable(LonRaw, 'LindeA')
        Equa2Eclp = Func.Equa2Eclp
        Equa2EclpDif = Func.Equa2EclpDif
    } else if (Type <= 7 || ['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        const Func = Equa2EclpTable(LonRaw, Name)
        Equa2Eclp = Func.Equa2Eclp
        Equa2EclpDif = Func.Equa2EclpDif
    } else if (Type === 8) {
        const Func = Equa2EclpFormula(LonRaw, Name)
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
    } else if (Type === 9 || Type === 10) {
        const Func = Equa2EclpFormula(LonRaw, 'Jiyuan')
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
    } else if (Type === 11) {
        const Func = Hushigeyuan(LonRaw)
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
        Eclp2EquaLat = Func.Lat
    }
    Eclp2EquaDif = Eclp2Equa ? (Eclp2EquaDif || Eclp2Equa - LonRaw) : 0
    return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif, Eclp2EquaLat }
}

export const BindEqua2Eclp = (LonRaw, Sidereal, year) => {
    Sidereal = +Sidereal
    LonRaw = +LonRaw
    if (LonRaw >= Sidereal || LonRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    let Range = ''
    if (LonRaw < Sidereal / 4) {
        Range += '冬至 → 春分，赤度 > 黃度'
    } else if (LonRaw < Sidereal / 2) {
        Range += '春分 → 夏至，赤度 < 黃度'
    } else if (LonRaw < 3 * Sidereal / 4) {
        Range += '夏至 → 秋分，赤度 > 黃度'
    } else {
        Range += '秋分 → 冬至，赤度 < 黃度'
    }
    const {
        Equa2Eclp: WestB,
        Equa2EclpDif: WestB1,
        Eclp2Equa: WestA,
        Eclp2EquaDif: WestA1
    } = Equa2EclpWest(LonRaw, Sidereal, year)
    const {
        Lat: WestLat
    } = Lon2LatWest(LonRaw, Sidereal, year)
    let Print = [{
        title: '球面三角',
        data: [WestB.toFixed(5), WestB1.toFixed(4), 0, WestA.toFixed(5), WestA1.toFixed(4), 0, WestLat.toFixed(4), 0]
    }]
    const List1 = ['Qianxiang', 'Huangji', 'Dayan', 'Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi']
    const List2 = ['Chongxuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi']
    Print = Print.concat(
        List1.map(title => {
            let EclpLonPrint = '-'
            let EclpLonInacPrint = '-'
            let EquaLonPrint = '-'
            let EquaLonInacPrint = '-'
            let Equa2EclpDifPrint = '-'
            let Eclp2EquaDifPrint = '-'
            let Eclp2EquaLatPrint = '-'
            let Eclp2EquaLatInacPrint = '-'
            const Func = AutoEqua2Eclp(LonRaw, title, Sidereal, year)
            const Equa2Eclp = Func.Equa2Eclp
            const Eclp2Equa = Func.Eclp2Equa
            const Equa2EclpDif = Func.Equa2EclpDif
            const Eclp2EquaDif = Func.Eclp2EquaDif
            let Eclp2EquaLat = 0
            if (title === 'Shoushi') {
                Eclp2EquaLat = Func.Eclp2EquaLat
            } else if (List2.indexOf(title) > 0) {
                Eclp2EquaLat = AutoLon2Lat(LonRaw, 0.5, title, 1).Lat
            }
            const Eclp2EquaLatInac = Eclp2EquaLat - WestLat
            if (Equa2Eclp) {
                EclpLonPrint = Equa2Eclp.toFixed(5)
                Equa2EclpDifPrint = Equa2EclpDif.toFixed(4)
                EclpLonInacPrint = (Equa2Eclp - WestB).toFixed(4)
            }
            if (Eclp2Equa) {
                EquaLonPrint = Eclp2Equa.toFixed(5)
                Eclp2EquaDifPrint = Eclp2EquaDif.toFixed(4)
                EquaLonInacPrint = (Eclp2Equa - WestA).toFixed(4)
            }
            if (Eclp2EquaLat) {
                Eclp2EquaLatPrint = Eclp2EquaLat.toFixed(4)
                Eclp2EquaLatInacPrint = Eclp2EquaLatInac.toFixed(4)
            }
            return {
                title: NameList[title],
                data: [EclpLonPrint, Equa2EclpDifPrint, EclpLonInacPrint, EquaLonPrint, Eclp2EquaDifPrint, EquaLonInacPrint, Eclp2EquaLatPrint, Eclp2EquaLatInacPrint]
            }
        }))
    return { Range, Print }
}
// console.log(BindEqua2Eclp(360, 365.2575, 0).Range)

export const BindDeg2Mansion = (Deg, Name) => {
    const EquaAccumListTaichu = AutoDegAccumList(Name, 300)
    const EquaAccumListHuangji = []
    const EquaAccumListLindeA = []
    const EquaAccumListDayan = AutoDegAccumList(Name, 729)
    const EquaAccumListYingtian = []
    const EquaAccumListMingtian = AutoDegAccumList('Mingtian', 1065) // 明天
    const EquaAccumListJiyuan = AutoDegAccumList(Name, 1106)
    const EquaAccumListDaming3 = []
    const EquaAccumListShoushi = AutoDegAccumList(Name, 1281)
    const EquaAccumListJiazi = []
    const EclpAccumListTaichu = AutoDegAccumList(Name, 300, 1) // 四分
    const EclpAccumListHuangji = AutoDegAccumList('Huangji', 500, 1)
    const EclpAccumListLindeA = AutoDegAccumList(Name, 665, 1) // 麟德
    const EclpAccumListDayan = AutoDegAccumList(Name, 729, 1) // 大衍
    const EclpAccumListYingtian = AutoDegAccumList(Name, 964) // 應天
    const EclpAccumListMingtian = AutoDegAccumList(Name, 1065, 1) // 明天
    const EclpAccumListJiyuan = AutoDegAccumList(Name, 1106, 1) // 紀元
    const EclpAccumListDaming3 = AutoDegAccumList('Daming3', 1180, 1)
    const EclpAccumListShoushi = AutoDegAccumList(Name, 1281, 1) // 授時
    const EclpAccumListJiazi = AutoDegAccumList(Name, 1684, 1) // 甲子元曆
    const Print = ['Taichu', 'Huangji', 'LindeA', 'Dayan', 'Yingtian', 'Mingtian', 'Jiyuan', 'Daming3', 'Shoushi', 'Jiazi'].map(title => {
        const EclpList = eval('EclpAccumList' + title)
        const Eclp = Deg2Mansion(Deg, EclpList, Name)
        const EquaList = eval('EquaAccumList' + title)
        let Equa = ''
        if ((EquaList || []).length) {
            Equa = Deg2Mansion(Deg, EquaList, Name)
        }
        return {
            title: NameList[title],
            data: [Equa, Eclp]
        }
    })
    return Print
}
// console.log(BindDeg2Mansion(23.1511, 'Jiazi'))

export const BindMansion2Deg = (Mansion, Name) => {
    const EquaAccumListTaichu = AutoDegAccumList(Name, 300)
    const EquaAccumListHuangji = []
    const EquaAccumListLindeA = []
    const EquaAccumListDayan = AutoDegAccumList(Name, 729)
    const EquaAccumListYingtian = []
    const EquaAccumListMingtian = AutoDegAccumList('Mingtian', 1065) // 明天
    const EquaAccumListJiyuan = AutoDegAccumList(Name, 1106)
    const EquaAccumListDaming3 = []
    const EquaAccumListShoushi = AutoDegAccumList(Name, 1281)
    const EquaAccumListJiazi = []
    const EclpAccumListTaichu = AutoDegAccumList(Name, 300, 1) // 四分
    const EclpAccumListHuangji = AutoDegAccumList('Huangji', 500, 1)
    const EclpAccumListLindeA = AutoDegAccumList(Name, 665, 1) // 麟德
    const EclpAccumListDayan = AutoDegAccumList(Name, 729, 1) // 大衍
    const EclpAccumListYingtian = AutoDegAccumList(Name, 964) // 應天
    const EclpAccumListMingtian = AutoDegAccumList(Name, 1065, 1) // 明天
    const EclpAccumListJiyuan = AutoDegAccumList(Name, 1106, 1) // 紀元
    const EclpAccumListDaming3 = AutoDegAccumList('Daming3', 1180, 1)
    const EclpAccumListShoushi = AutoDegAccumList(Name, 1281, 1) // 授時
    const EclpAccumListJiazi = AutoDegAccumList(Name, 1684, 1) // 甲子、癸卯
    const Print = ['Taichu', 'Huangji', 'LindeA', 'Dayan', 'Yingtian', 'Mingtian', 'Jiyuan', 'Daming3', 'Shoushi', 'Jiazi'].map(title => {
        const EclpList = eval('EclpAccumList' + title)
        const Eclp = Mansion2Deg(Mansion, EclpList, Name)
        const EquaList = eval('EquaAccumList' + title)
        let Equa = ''
        if ((EquaList || []).length) {
            Equa = Mansion2Deg(Mansion, EquaList, Name)
        }
        return {
            title: NameList[title],
            data: [Equa, Eclp]
        }
    })
    return Print
}
// console.log(BindMansion2Deg('氐1', 'Guimao'))
export const AutoLon2Lat = (LonRaw, SolsDeci, Name, isBare) => { // 如果最後加上了isBare，就不加日躔
    const { Type, Solar, SolarRaw } = Para[Name]
    let special = 0, Plus1 = 0, Plus2 = 0
    LonRaw = ~~(LonRaw + SolsDeci) - SolsDeci
    if (Type === 11) { // 授時「置所求日晨前夜半黃道積度」假設 SolsDeci 0.3, LonRaw 2, 那麼實際上是2.3，去掉小數點，晨前夜半就是2.LonRaw 2.8，該日3.1，去掉小數點是3
    } else if (Name === 'Chongxuan') { // 崇玄「昏後夜半」
        Plus1 = 1
        Plus2 = 0.5
    } else { // 其他假設是午中
        Plus1 = 0.5
        Plus2 = 0.5
    }
    LonRaw %= Solar || SolarRaw
    let Lon2Lat = {}, Lon2LatA = {}, Lon2LatB = {}
    // 公式曆法加上日躔
    if ((['Chongtian', 'Mingtian', 'Guantian', 'Jiyuan'].includes(Name) || Type === 11) && !isBare) { // 經測試， 'Yingtian', 'Qianyuan', 'Yitian' 不能加日躔。
        Plus1 = AutoDifAccum(0, LonRaw, Name).SunDifAccum
    }
    const Lon1 = LonRaw + Plus1
    const Lon2 = LonRaw + Plus2
    if (Type <= 3) {
        Lon2Lat = Lon2LatTable1(Lon1, 'Easthan')
    } else if (Name === 'Liangwu') {
        Lon2Lat = Lon2LatTable1(Lon1, 'Daming')
    } else if (['Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
        Lon2Lat = Lon2LatTable2(Lon1, 'Daye')
    } else if (Type === 4) {
        Lon2Lat = Lon2LatTable1(Lon1, Name)
    } else if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        Lon2Lat = Lon2LatTable2(Lon1, 'LindeA')
    } else if (Type === 6) {
        Lon2Lat = Lon2LatTable2(Lon1, Name)
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan'].includes(Name)) {
        Lon2Lat = Lon2LatTable2(Lon1, 'Dayan')
    } else if (Name === 'Xuanming') {
        Lon2Lat = Lon2LatTable2(Lon1, Name)
    } else if (Name === 'Qintian') {
        Lon2LatA = Lon2LatFormula(Lon1, 'Chongxuan')
        Lon2LatB = Lon2DialFormula(Lon2, 'Chongxuan')
        special = 1
    } else if (['Yingtian', 'Qianyuan'].includes(Name)) {
        Lon2Lat = Lon2LatTable2(Lon1, Name)
    } else if (['Fengyuan', 'Zhantian'].includes(Name)) {
        Lon2LatA = Lon2LatFormula(Lon1, 'Guantian')
        Lon2LatB = Lon2DialFormula(Lon2, 'Guantian')
        special = 1
    } else if (Type === 8) {
        Lon2LatA = Lon2LatFormula(Lon1, Name)
        Lon2LatB = Lon2DialFormula(Lon2, Name)
        special = 1
    } else if (Type === 9) {
        Lon2LatA = Lon2LatFormula(Lon1, 'Jiyuan')
        Lon2LatB = Lon2DialFormula(Lon2, 'Jiyuan')
        special = 1
    } else if (Type === 10) {
        Lon2LatA = Lon2LatTable2(Lon1, 'Daming3')
        Lon2LatB = Lon2DialFormula(Lon2, 'Jiyuan')
        special = 1
    } else if (Type === 11) {
        Lon2Lat = Hushigeyuan(Lon1, Name)
    }
    let Lat = 0
    let Lat1 = 0
    let Rise = 0
    let Dial = 0
    if (special) {
        Lat = Lon2LatA.Lat
        Lat1 = Lon2LatA.Lat1
        Rise = Lon2LatA.Rise
        Dial = Lon2LatB.Dial
    } else {
        Lat = Lon2Lat.Lat
        Lat1 = Lon2Lat.Lat1
        Rise = Lon2Lat.Rise
        Dial = Lon2Lat.Dial || 0
    }
    return { Lat, Lat1, Rise, Dial }
}
// console.log (AutoLon2Lat (53.6, 0, 'Chongxuan'))

export const BindLon2Lat = (LonRaw, SolsDeci, f, Sidereal, year) => {
    Sidereal = +Sidereal
    LonRaw = +LonRaw
    SolsDeci = +('0.' + SolsDeci)
    f = +f
    year = +year
    if (LonRaw >= Sidereal || LonRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    const Lon = LonRaw + SunAcrVWest(LonRaw, year).SunDifAccum // 積日轉換爲黃經
    const {
        Lat1: WestA,
        Lat: WestB
    } = Lon2LatWest(Lon, Sidereal, year)
    const {
        v: WestC,
        v1: WestC1
    } = Lon2SunriseWest(Lon, f, Sidereal, year)
    const {
        Dial: WestD,
        Dial1: WestD1
    } = Lon2DialWest(Lon, f, Sidereal, year)
    let Print = [{
        title: '球面三角',
        data: [WestA.toFixed(4), WestB.toFixed(4), 0, `${WestC.toFixed(4)}\n${WestC1.toFixed(4)}`, 0, (WestC1 - WestC).toFixed(4), `${WestD.toFixed(4)}\n${WestD1.toFixed(4)}`, 0, (WestD1 - WestD).toFixed(4)]
    }]
    Print = Print.concat(
        ['Easthan', 'Yuanjia', 'Daming', 'Daye', 'WuyinA', 'Huangji', 'LindeA', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Daming3', 'Shoushi', 'Datong'].map(title => {
            let Lat1Print = '-'
            let LatPrint = '-'
            let LatInacPrint = '-'
            let SunrisePrint = '-'
            let SunriseInacPrint1 = '-'
            let SunriseInacPrint2 = '-'
            let DialPrint = '-'
            let DialInacPrint1 = '-'
            let DialInacPrint2 = '-'
            const { Lat1, Lat, Rise, Dial
            } = AutoLon2Lat(LonRaw, SolsDeci, title)
            if (Lat1) {
                Lat1Print = Lat1.toFixed(4)
                LatPrint = Lat.toFixed(4)
                LatInacPrint = (Lat - WestB).toFixed(4)
            }
            if (Rise) {
                SunrisePrint = Rise.toFixed(4)
                SunriseInacPrint1 = (Rise - WestC).toFixed(4)
                SunriseInacPrint2 = (Rise - WestC1).toFixed(4)
            }
            if (Dial) {
                DialPrint = Dial.toFixed(4)
                DialInacPrint1 = (Dial - WestD).toFixed(4)
                DialInacPrint2 = (Dial - WestD1).toFixed(4)
            }
            return {
                title: NameList[title],
                data: [Lat1Print, LatPrint, LatInacPrint, SunrisePrint, SunriseInacPrint1, SunriseInacPrint2, DialPrint, DialInacPrint1, DialInacPrint2]
            }
        }))
    return Print
}
// console.log(BindLon2Lat(330, 0.45, 34.4, 365.2445, 1000))

export const AutoMoonLat = (NodeAccum, Name) => {
    let { Type, Sidereal } = Para[Name]
    // Solar = Solar || SolarRaw
    let MoonLat = {}
    if (Type <= 3) {
        MoonLat = MoonLatTable(NodeAccum, 'Qianxiang')
    } else if (Name === 'Yuanjia') {
        MoonLat = MoonLatTable(NodeAccum, Name)
    } else if (Type === 4) {
        MoonLat = MoonLatTable(NodeAccum, 'Daming')
    } else if (Type === 6) {
        MoonLat = MoonLatTable(NodeAccum, 'Huangji')
    } else if (['Qintian', 'Xuanming', 'Zhide', 'Dayan'].includes(Name)) {
        MoonLat = MoonLatTable(NodeAccum, 'Dayan')
    } else if (Type === 7) {
        MoonLat = MoonLatTable(NodeAccum, Name)
    } else if (['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        MoonLat = MoonLatFormula(NodeAccum, 'Chongxuan')
    } else if (['Chongtian'].includes(Name)) {
        MoonLat = MoonLatFormula(NodeAccum, Name)
    } else if (['Guantian', 'Mingtian', 'Fengyuan', 'Zhantian'].includes(Name)) {
        MoonLat = MoonLatFormula(NodeAccum, 'Guantian')
    } else if (Type === 9 || Type === 10) {
        MoonLat = MoonLatFormula(NodeAccum, 'Jiyuan')
    }
    const MoonEquaLat = MoonLat.EquaLat || 0
    const MoonEclpLat = MoonLat.Lat || 0 // MoonEquaLat - AutoLon2Lat(SunEclpLon, 0.5, Name).Lat
    const MoonEclpLat1 = MoonLat.Lat1 || Sidereal / 4 - MoonEclpLat
    return { MoonEclpLat, MoonEclpLat1, MoonEquaLat }
}
// console.log(AutoMoonLat(2, 'Tsrengyuan').MoonEclpLat)

export const AutoMoonLon = (NodeAccum, MoonEclp, Name) => {
    let { Type, Solar, SolarRaw, Sidereal, Node } = Para[Name]
    Solar = Solar || SolarRaw
    Sidereal = Sidereal || Solar
    const MoonAvgVd = AutoMoonAvgV(Name)
    const Quadrant = Type === 11 ? Sidereal / 4 : AutoNodeCycle(Name) / 4
    // 正交月黃經。《數》頁351
    // const tmp2 = Node - NewmNodeAccumPrint[i - 1] // 平交入朔
    // const NodeAnomaAccum = (AnomaAccumNight + tmp2) % Anoma // 每日夜半平交入轉
    const tmp3 = Node - NodeAccum // 距後日
    const tmp4 = tmp3 * MoonAvgVd // 距後度
    // let NodeSolsDifDay = SolsDif + tmp3 // 每日夜半平交日辰，我定義的：夜半的下個正交距離冬至日數。這算出來又是做什麼的？？
    const NodeEclp = (MoonEclp + tmp4) % Sidereal // 正交距冬至度數 // 算出來好迷啊，莫名其妙
    // const NodeSolsDifMoonTcorr = AutoTcorr(NodeAnomaAccum, SolsDif, Name, NodeAccum).MoonTcorr // 遲加疾減
    // NodeSolsDifDay = (NodeSolsDifDay + NodeSolsDifMoonTcorr) % Solar // 正交日辰=平交日辰+月亮改正  
    const MoonNodeDif = MoonEclp - NodeEclp
    const MoonNodeDifHalf = MoonNodeDif % (Quadrant * 2)
    const MoonNodeDifQuar = MoonNodeDif % Quadrant // 所入初末限：置黃道宿積度，滿交象度（90多那個）去之，在半交象已下爲初限
    const MoonNodeDifRev = Quadrant / 2 - Math.abs(Quadrant / 2 - MoonNodeDifQuar)
    let EclpWhiteDif = 0, EquaWhiteDif = 0, EquaLat = 0, EquaLon = 0, WhiteLon = 0
    if (Type === 6) {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, 'Huangji')
    } else if (Name === 'Qintian') {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, 'Qintian')
    } else if (Type === 7 || Name === 'Chongxuan') {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, 'Dayan')
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, 'Yingtian')
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(Name)) {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, 'Guantian')
    } else if (['Chongtian', 'Mingtian'].includes(Name)) {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, Name)
    } else if (Type === 9 || Type === 10) {
        EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, 'Jiyuan')
    } else if (Type === 11) {
        const Func = HushigeyuanMoon(NodeEclp, MoonNodeDif)
        EquaWhiteDif = Func.EquaWhiteDif
        EquaLat = Func.EquaLat
        EquaLon = Func.EquaLon
        WhiteLon = Func.WhiteLon
    }
    const sign1 = MoonNodeDifHalf > Quadrant ? -1 : 1 // 距半交後正交前，以差數爲減；距正交後、半交前，以差數爲加    
    EclpWhiteDif *= sign1
    if (Type < 11) {
        WhiteLon = MoonEclp + EclpWhiteDif
    }
    return { NodeEclp, WhiteLon, EclpWhiteDif, EquaWhiteDif, EquaLon, EquaLat }
}
// console.log(AutoMoonLon(234, 45, 4.11, 'Dayan'))

export const BindMoonLonLat = (NodeAccum, MoonEclp) => { // 該時刻入交日、距冬至日數
    NodeAccum = +NodeAccum
    MoonEclp = +MoonEclp
    if (NodeAccum >= 27.21221 || NodeAccum < 0) {
        throw (new Error('請輸入一交點月內的日數'))
    }
    if (MoonEclp >= 365.246 || MoonEclp < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    let Print = []
    Print = Print.concat(
        ['Qianxiang', 'Yuanjia', 'Daming', 'Huangji', 'Dayan', 'Wuji', 'Tsrengyuan', 'Chongxuan', 'Qintian', 'Yingtian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi'].map(title => {
            let NodeSolsDifDegPrint = '-'
            let WhiteLonPrint = '-'
            let EquaLonPrint = '-'
            let EclpWhiteDifPrint = '-'
            // let EclpEquaDifPrint = '-'
            let EquaWhiteDifPrint = '-'
            let Lat1Print = '-'
            let LatPrint = '-'
            let EquaLatPrint = '-'
            const { NodeEclp, EquaLon, EclpWhiteDif, EquaWhiteDif, WhiteLon, EquaLat
            } = AutoMoonLon(NodeAccum, MoonEclp, title)
            const { MoonEclpLat1, MoonEclpLat,
            } = AutoMoonLat(NodeAccum, title)
            if (NodeEclp) {
                NodeSolsDifDegPrint = NodeEclp.toFixed(4)
            }
            if (EquaWhiteDif) {
                EquaLonPrint = EquaLon.toFixed(4)
                EquaWhiteDifPrint = EquaWhiteDif.toFixed(4)
            }
            if (WhiteLon) {
                WhiteLonPrint = WhiteLon.toFixed(4)
                EclpWhiteDifPrint = EclpWhiteDif.toFixed(4)
            }
            if (MoonEclpLat) {
                Lat1Print = MoonEclpLat1.toFixed(4)
                LatPrint = MoonEclpLat.toFixed(4)
            }
            if (EquaLat) {
                EquaLatPrint = EquaLat.toFixed(4)
            }
            return {
                title: NameList[title],
                data: [NodeSolsDifDegPrint, EquaLonPrint, WhiteLonPrint, EclpWhiteDifPrint, EquaWhiteDifPrint, Lat1Print, LatPrint, EquaLatPrint]
            }
        }))
    return Print
}
// console.log(BindMoonLonLat(2.252, 55.71))

export const BindSunEclipse = (NodeAccum, AnomaAccum, AvgDeci, AvgSolsDif, SolsDeci) => {
    NodeAccum = +NodeAccum
    AnomaAccum = +AnomaAccum
    AvgDeci = +('0.' + AvgDeci)
    AvgSolsDif = +AvgSolsDif
    SolsDeci = +('0.' + SolsDeci)
    const Solar = 365.24478
    const HalfTermLeng = Solar / 24
    if (NodeAccum > 27.212215) {
        throw (new Error('請輸入一交點月27.212215內的日數'))
    }
    if (AnomaAccum > 27.5545) {
        throw (new Error('請輸入一近點月27.5545內的日數'))
    }
    // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
    let i = 0
    for (let j = 0; j <= 11; j++) {
        if (AvgSolsDif >= j * HalfTermLeng && AvgSolsDif < (j + 1) * HalfTermLeng) {
            i = (j - 2 + 12) % 12
        }
        break
    }
    let Print1 = []
    Print1 = Print1.concat(
        ['Daye', 'WuyinA', 'Huangji', 'LindeA', 'Wuji', 'Tsrengyuan', 'Qintian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Daming3', 'Gengwu', 'Shoushi', 'Datong'].map(title => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSolsDif, title)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSolsDif = AvgSolsDif + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, 1, title, i + 1, 0, 0, SolsDeci)
            let StartDeciPrint = '-'
            let TotalDeciPrint = '-'
            let EndDeciPrint = '-'
            const AcrDeciPrint = (AcrDeci * 100).toFixed(3)
            if (StartDeci && TotalDeci) {
                StartDeciPrint = (StartDeci * 100).toFixed(3)
                TotalDeciPrint = (TotalDeci * 100).toFixed(3)
                EndDeciPrint = (EndDeci * 100).toFixed(3)
            }
            let StatusPrint = '不食'
            if (Status === 3) {
                StatusPrint = '微少'
            } else if (Status === 2) {
                StatusPrint = '偏食'
            } else if (Status === 1) {
                StatusPrint = '全食'
            }
            return {
                title: NameList[title],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    let Print2 = []
    Print2 = Print2.concat(
        ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].map(title => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSolsDif, title)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSolsDif = AvgSolsDif + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, 1, title, i + 1, 0, 0, SolsDeci)
            let StartDeciPrint = '-'
            let TotalDeciPrint = '-'
            let EndDeciPrint = '-'
            const AcrDeciPrint = (AcrDeci * 100).toFixed(3)
            if (StartDeci && TotalDeci) {
                StartDeciPrint = (StartDeci * 100).toFixed(3)
                TotalDeciPrint = (TotalDeci * 100).toFixed(3)
                EndDeciPrint = (EndDeci * 100).toFixed(3)
            }
            let StatusPrint = '不食'
            if (Status === 3) {
                StatusPrint = '微少'
            } else if (Status === 2) {
                StatusPrint = '偏食'
            } else if (Status === 1) {
                StatusPrint = '全食'
            }
            return {
                title: NameList[title],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    return { Print1, Print2 }
}
// console.log(BindSunEclipse(0.1, 14, 3355, 14, 5))

export const BindMoonEclipse = (NodeAccum, AnomaAccum, AvgDeci, AvgSolsDif, SolsDeci) => {
    NodeAccum = +NodeAccum
    AnomaAccum = +AnomaAccum
    AvgDeci = +('0.' + AvgDeci)
    AvgSolsDif = +AvgSolsDif
    SolsDeci = +('0.' + SolsDeci)
    const Solar = 365.24478
    const HalfTermLeng = Solar / 24
    if (NodeAccum > 27.212215) {
        throw (new Error('請輸入一交點月27.212215內的日數'))
    }
    if (AnomaAccum > 27.5545) {
        throw (new Error('請輸入一近點月27.5545內的日數'))
    }
    // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
    let i = 0
    for (let j = 0; j <= 11; j++) {
        if (AvgSolsDif >= j * HalfTermLeng && AvgSolsDif < (j + 1) * HalfTermLeng) {
            i = (j - 2 + 12) % 12
        }
        break
    }
    let Print1 = []
    Print1 = Print1.concat(
        ['Tsrengguang', 'Daye', 'WuyinA', 'Huangji', 'LindeA', 'Wuji', 'Tsrengyuan', 'Qintian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Daming3', 'Gengwu', 'Shoushi', 'Datong', 'Datong2'].map(title => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSolsDif, title)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSolsDif = AvgSolsDif + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, 0, title, i + 1, 0, 0, SolsDeci)
            let StartDeciPrint = '-'
            let TotalDeciPrint = '-'
            let EndDeciPrint = '-'
            const AcrDeciPrint = (AcrDeci * 100).toFixed(3)
            if (StartDeci && TotalDeci) {
                StartDeciPrint = (StartDeci * 100).toFixed(3)
                TotalDeciPrint = (TotalDeci * 100).toFixed(3)
                EndDeciPrint = (EndDeci * 100).toFixed(3)
            }
            let StatusPrint = '不食'
            if (Status === 3) {
                StatusPrint = '微少'
            } else if (Status === 2) {
                StatusPrint = '偏食'
            } else if (Status === 1) {
                StatusPrint = '全食'
            }
            return {
                title: NameList[title],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    let Print2 = []
    Print2 = Print2.concat(
        ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].map(title => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSolsDif, title)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSolsDif = AvgSolsDif + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, 0, title, i + 1, 0, 0, SolsDeci)
            let StartDeciPrint = '-'
            let TotalDeciPrint = '-'
            let EndDeciPrint = '-'
            const AcrDeciPrint = (AcrDeci * 100).toFixed(3)
            if (StartDeci && TotalDeci) {
                StartDeciPrint = (StartDeci * 100).toFixed(3)
                TotalDeciPrint = (TotalDeci * 100).toFixed(3)
                EndDeciPrint = (EndDeci * 100).toFixed(3)
            }
            let StatusPrint = '不食'
            if (Status === 3) {
                StatusPrint = '微少'
            } else if (Status === 2) {
                StatusPrint = '偏食'
            } else if (Status === 1) {
                StatusPrint = '全食'
            }
            return {
                title: NameList[title],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    return { Print1, Print2 }
}
// console.log(BindMoonEclipse(1.1, 22, 22, 22))

const InacPrintAnaly_SunTcorr = (Name, AnomaAccum, year) => {
    let SunTcorrInac = []
    for (let i = 0; i <= 365; i++) {// i:AvgSolsDif
        SunTcorrInac[i] = BindTcorr(AnomaAccum, i, year, Name).SunTcorrInac
    }
    return SunTcorrInac
}
// console.log (InacPrintAnaly_SunTcorr('Shoushi', 7, 1247))