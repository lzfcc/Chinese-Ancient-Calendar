import Para from './para_calendars.mjs'
import {
    Equa2EclpTable, Longi2LatiTable1, Longi2LatiTable2, MoonLatiTable
} from './astronomy_table.mjs'
import {
    Equa2EclpFormula, Longi2LatiFormula, Longi2DialFormula, MoonLatiFormula, MoonLongiFormula
} from './astronomy_formula.mjs'
import { Hushigeyuan, HushigeyuanMoon } from './equa_geometry.mjs'
import {
    Equa2EclpWest, Longi2LatiWest, Longi2SunriseWest, Longi2DialWest, SunAcrVWest,    // MoonAcrVWest
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
            const { SunTcorr, MoonTcorr, MoonAcrDV, NodeAccumCorrA } = AutoTcorr(AnomaAccum, SolsDif, title)
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
            if (MoonAcrDV) {
                MoonDifAccumPrint += `\n${MoonAcrDV.toFixed(4)}`
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

export const AutoEqua2Eclp = (LongiRaw, Name) => {
    const { Type, Sidereal, Solar, SolarRaw } = Para[Name]
    LongiRaw %= Sidereal || (Solar || SolarRaw)
    let Equa2Eclp = 0
    let Eclp2Equa = 0
    let Equa2EclpDif = 0
    let Eclp2EquaDif = 0
    let Eclp2EquaLati = 0
    if (Name === 'Dayan') {
        const Func = Equa2EclpFormula(LongiRaw, Name)
        Equa2Eclp = Func.Equa2Eclp
        Eclp2Equa = Func.Eclp2Equa
        Equa2EclpDif = Func.Equa2EclpDif
        Eclp2EquaDif = Func.Eclp2EquaDif
    } else if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        const Func = Equa2EclpTable(LongiRaw, 'LindeA')
        Equa2Eclp = Func.Equa2Eclp
        Equa2EclpDif = Func.Equa2EclpDif
    } else if (Type <= 7 || ['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        const Func = Equa2EclpTable(LongiRaw, Name)
        Equa2Eclp = Func.Equa2Eclp
        Equa2EclpDif = Func.Equa2EclpDif
    } else if (Type === 8) {
        const Func = Equa2EclpFormula(LongiRaw, Name)
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
    return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif, Eclp2EquaLati }
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
                title: NameList[title],
                data: [EclpLongiPrint, Equa2EclpDifPrint, EclpLongiInacPrint, EquaLongiPrint, Eclp2EquaDifPrint, EquaLongiInacPrint, Eclp2EquaLatiPrint, Eclp2EquaLatiInacPrint]
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
export const AutoLongi2Lati = (LongiRaw, SolsDeci, Name, isBare) => { // 如果最後加上了isBare，就不加日躔
    const { Type, Solar, SolarRaw } = Para[Name]
    let special = 0, Plus1 = 0, Plus2 = 0
    LongiRaw = ~~(LongiRaw + SolsDeci) - SolsDeci
    if (Type === 11) { // 授時「置所求日晨前夜半黃道積度」假設 SolsDeci 0.3, LongiRaw 2, 那麼實際上是2.3，去掉小數點，晨前夜半就是2.LongiRaw 2.8，該日3.1，去掉小數點是3
    } else if (Name === 'Chongxuan') { // 崇玄「昏後夜半」
        Plus1 = 1
        Plus2 = 0.5
    } else { // 其他假設是午中
        Plus1 = 0.5
        Plus2 = 0.5
    }
    LongiRaw %= Solar || SolarRaw
    let Longi2Lati = {}, Longi2LatiA = {}, Longi2LatiB = {}
    // 公式曆法加上日躔
    if ((['Chongtian', 'Mingtian', 'Guantian', 'Jiyuan'].includes(Name) || Type === 11) && !isBare) { // 經測試， 'Yingtian', 'Qianyuan', 'Yitian' 不能加日躔。
        Plus1 = AutoDifAccum(0, LongiRaw, Name).SunDifAccum
    }
    const Longi1 = LongiRaw + Plus1
    const Longi2 = LongiRaw + Plus2
    if (Type <= 3) {
        Longi2Lati = Longi2LatiTable1(Longi1, 'Easthan')
    } else if (Name === 'Liangwu') {
        Longi2Lati = Longi2LatiTable1(Longi1, 'Daming')
    } else if (['Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
        Longi2Lati = Longi2LatiTable2(Longi1, 'Daye')
    } else if (Type === 4) {
        Longi2Lati = Longi2LatiTable1(Longi1, Name)
    } else if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        Longi2Lati = Longi2LatiTable2(Longi1, 'LindeA')
    } else if (Type === 6) {
        Longi2Lati = Longi2LatiTable2(Longi1, Name)
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan'].includes(Name)) {
        Longi2Lati = Longi2LatiTable2(Longi1, 'Dayan')
    } else if (Name === 'Xuanming') {
        Longi2Lati = Longi2LatiTable2(Longi1, Name)
    } else if (Name === 'Qintian') {
        Longi2LatiA = Longi2LatiFormula(Longi1, 'Chongxuan')
        Longi2LatiB = Longi2DialFormula(Longi2, 'Chongxuan')
        special = 1
    } else if (['Yingtian', 'Qianyuan'].includes(Name)) {
        Longi2Lati = Longi2LatiTable2(Longi1, Name)
    } else if (['Fengyuan', 'Zhantian'].includes(Name)) {
        Longi2LatiA = Longi2LatiFormula(Longi1, 'Guantian')
        Longi2LatiB = Longi2DialFormula(Longi2, 'Guantian')
        special = 1
    } else if (Type === 8) {
        Longi2LatiA = Longi2LatiFormula(Longi1, Name)
        Longi2LatiB = Longi2DialFormula(Longi2, Name)
        special = 1
    } else if (Type === 9) {
        Longi2LatiA = Longi2LatiFormula(Longi1, 'Jiyuan')
        Longi2LatiB = Longi2DialFormula(Longi2, 'Jiyuan')
        special = 1
    } else if (Type === 10) {
        Longi2LatiA = Longi2LatiTable2(Longi1, 'Daming3')
        Longi2LatiB = Longi2DialFormula(Longi2, 'Jiyuan')
        special = 1
    } else if (Type === 11) {
        Longi2Lati = Hushigeyuan(Longi1, Name)
    }
    let Lati = 0
    let Lati1 = 0
    let Rise = 0
    let Dial = 0
    if (special) {
        Lati = Longi2LatiA.Lati
        Lati1 = Longi2LatiA.Lati1
        Rise = Longi2LatiA.Rise
        Dial = Longi2LatiB.Dial
    } else {
        Lati = Longi2Lati.Lati
        Lati1 = Longi2Lati.Lati1
        Rise = Longi2Lati.Rise
        Dial = Longi2Lati.Dial || 0
    }
    return { Lati, Lati1, Rise, Dial }
}
// console.log (AutoLongi2Lati (53.6, 0, 'Chongxuan'))

export const BindLongi2Lati = (LongiRaw, SolsDeci, f, Sidereal, year) => {
    Sidereal = +Sidereal
    LongiRaw = +LongiRaw
    SolsDeci = +('0.' + SolsDeci)
    f = +f
    year = +year
    if (LongiRaw >= Sidereal || LongiRaw < 0) {
        throw (new Error('請輸入一週天度內的度數'))
    }
    const Longi = LongiRaw + SunAcrVWest(LongiRaw, year).SunDifAccum // 積日轉換爲黃經
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
        ['Easthan', 'Yuanjia', 'Daming', 'Daye', 'WuyinA', 'Huangji', 'LindeA', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Daming3', 'Shoushi', 'Datong'].map(title => {
            let Lati1Print = '-'
            let LatiPrint = '-'
            let LatiInacPrint = '-'
            let SunrisePrint = '-'
            let SunriseInacPrint1 = '-'
            let SunriseInacPrint2 = '-'
            let DialPrint = '-'
            let DialInacPrint1 = '-'
            let DialInacPrint2 = '-'
            const { Lati1, Lati, Rise, Dial
            } = AutoLongi2Lati(LongiRaw, SolsDeci, title)
            if (Lati1) {
                Lati1Print = Lati1.toFixed(4)
                LatiPrint = Lati.toFixed(4)
                LatiInacPrint = (Lati - WestB).toFixed(4)
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
                data: [Lati1Print, LatiPrint, LatiInacPrint, SunrisePrint, SunriseInacPrint1, SunriseInacPrint2, DialPrint, DialInacPrint1, DialInacPrint2]
            }
        }))
    return Print
}
// console.log(BindLongi2Lati(330, 0.45, 34.4, 365.2445, 1000))

export const AutoMoonLati = (NodeAccum, Name) => {
    let { Type, Sidereal } = Para[Name]
    // Solar = Solar || SolarRaw
    let MoonLati = {}
    if (Type <= 3) {
        MoonLati = MoonLatiTable(NodeAccum, 'Qianxiang')
    } else if (Name === 'Yuanjia') {
        MoonLati = MoonLatiTable(NodeAccum, Name)
    } else if (Type === 4) {
        MoonLati = MoonLatiTable(NodeAccum, 'Daming')
    } else if (Type === 6) {
        MoonLati = MoonLatiTable(NodeAccum, 'Huangji')
    } else if (['Qintian', 'Xuanming', 'Zhide', 'Dayan'].includes(Name)) {
        MoonLati = MoonLatiTable(NodeAccum, 'Dayan')
    } else if (Type === 7) {
        MoonLati = MoonLatiTable(NodeAccum, Name)
    } else if (['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        MoonLati = MoonLatiFormula(NodeAccum, 'Chongxuan')
    } else if (['Chongtian'].includes(Name)) {
        MoonLati = MoonLatiFormula(NodeAccum, Name)
    } else if (['Guantian', 'Mingtian', 'Fengyuan', 'Zhantian'].includes(Name)) {
        MoonLati = MoonLatiFormula(NodeAccum, 'Guantian')
    } else if (Type === 9 || Type === 10) {
        MoonLati = MoonLatiFormula(NodeAccum, 'Jiyuan')
    }
    const MoonEquaLati = MoonLati.EquaLati || 0
    const MoonEclpLati = MoonLati.Lati || 0 // MoonEquaLati - AutoLongi2Lati(SunEclpLongi, 0.5, Name).Lati
    const MoonEclpLati1 = MoonLati.Lati1 || Sidereal / 4 - MoonEclpLati
    return { MoonEclpLati, MoonEclpLati1, MoonEquaLati }
}
// console.log(AutoMoonLati(2, 'Tsrengyuan').MoonEclpLati)

export const AutoMoonLongi = (NodeAccum, MoonEclp, Name) => {
    let { Type, Solar, SolarRaw, Sidereal, Node } = Para[Name]
    Solar = Solar || SolarRaw
    Sidereal = Sidereal || Solar
    const MoonAvgDV = AutoMoonAvgV(Name)
    const Quadrant = Type === 11 ? Sidereal / 4 : AutoNodeCycle(Name) / 4
    // 正交月黃經。《數》頁351
    // const tmp2 = Node - NewmNodeAccumPrint[i - 1] // 平交入朔
    // const NodeAnomaAccum = (AnomaAccumNight + tmp2) % Anoma // 每日夜半平交入轉
    const tmp3 = Node - NodeAccum // 距後日
    const tmp4 = tmp3 * MoonAvgDV // 距後度
    // let NodeSolsDifDay = SolsDif + tmp3 // 每日夜半平交日辰，我定義的：夜半的下個正交距離冬至日數。這算出來又是做什麼的？？
    const NodeEclp = (MoonEclp + tmp4) % Sidereal // 正交距冬至度數 // 算出來好迷啊，莫名其妙
    // const NodeSolsDifMoonTcorr = AutoTcorr(NodeAnomaAccum, SolsDif, Name, NodeAccum).MoonTcorr // 遲加疾減
    // NodeSolsDifDay = (NodeSolsDifDay + NodeSolsDifMoonTcorr) % Solar // 正交日辰=平交日辰+月亮改正  
    const MoonNodeDif = MoonEclp - NodeEclp
    const MoonNodeDifHalf = MoonNodeDif % (Quadrant * 2)
    const MoonNodeDifQuar = MoonNodeDif % Quadrant // 所入初末限：置黃道宿積度，滿交象度（90多那個）去之，在半交象已下爲初限
    const MoonNodeDifRev = Quadrant / 2 - Math.abs(Quadrant / 2 - MoonNodeDifQuar)
    let EclpWhiteDif = 0, EquaWhiteDif = 0, EquaLati = 0, EquaLongi = 0, WhiteLongi = 0
    if (Type === 6) {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, 'Huangji')
    } else if (Name === 'Qintian') {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, 'Qintian')
    } else if (Type === 7 || Name === 'Chongxuan') {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, 'Dayan')
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, 'Yingtian')
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(Name)) {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, 'Guantian')
    } else if (['Chongtian', 'Mingtian'].includes(Name)) {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, Name)
    } else if (Type === 9 || Type === 10) {
        EclpWhiteDif = MoonLongiFormula(NodeEclp, MoonNodeDifRev, 'Jiyuan')
    } else if (Type === 11) {
        const Func = HushigeyuanMoon(NodeEclp, MoonNodeDif)
        EquaWhiteDif = Func.EquaWhiteDif
        EquaLati = Func.EquaLati
        EquaLongi = Func.EquaLongi
        WhiteLongi = Func.WhiteLongi
    }
    const sign1 = MoonNodeDifHalf > Quadrant ? -1 : 1 // 距半交後正交前，以差數爲減；距正交後、半交前，以差數爲加    
    EclpWhiteDif *= sign1
    if (Type < 11) {
        WhiteLongi = MoonEclp + EclpWhiteDif
    }
    return { NodeEclp, WhiteLongi, EclpWhiteDif, EquaWhiteDif, EquaLongi, EquaLati }
}
// console.log(AutoMoonLongi(234, 45, 4.11, 'Dayan'))

export const BindMoonLongiLati = (NodeAccum, MoonEclp) => { // 該時刻入交日、距冬至日數
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
            let WhiteLongiPrint = '-'
            let EquaLongiPrint = '-'
            let EclpWhiteDifPrint = '-'
            // let EclpEquaDifPrint = '-'
            let EquaWhiteDifPrint = '-'
            let Lati1Print = '-'
            let LatiPrint = '-'
            let EquaLatiPrint = '-'
            const { NodeEclp, EquaLongi, EclpWhiteDif, EquaWhiteDif, WhiteLongi, EquaLati
            } = AutoMoonLongi(NodeAccum, MoonEclp, title)
            const { MoonEclpLati1, MoonEclpLati,
            } = AutoMoonLati(NodeAccum, title)
            if (NodeEclp) {
                NodeSolsDifDegPrint = NodeEclp.toFixed(4)
            }
            if (EquaWhiteDif) {
                EquaLongiPrint = EquaLongi.toFixed(4)
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
            if (EquaLati) {
                EquaLatiPrint = EquaLati.toFixed(4)
            }
            return {
                title: NameList[title],
                data: [NodeSolsDifDegPrint, EquaLongiPrint, WhiteLongiPrint, EclpWhiteDifPrint, EquaWhiteDifPrint, Lati1Print, LatiPrint, EquaLatiPrint]
            }
        }))
    return Print
}
// console.log(BindMoonLongiLati(2.252, 55.71))

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