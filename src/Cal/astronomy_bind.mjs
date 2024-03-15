import Para from './para_calendars.mjs'
import {
    Equa2EclpTable, MoonLatTable, latTable1, riseTable1, latRiseTable2, latRiseTable3, dialTable1, dialTable2, dialTable3
} from './astronomy_table.mjs'
import {
    Equa2EclpFormula, latFormula, dialFormula, MoonLatFormula, MoonLonFormula, riseFormula
} from './astronomy_formula.mjs'
import { Hushigeyuan, HushigeyuanMoon } from './equa_geometry.mjs'
import {
    EquaEclpWest, sunRise, Lon2DialWest, ConstWest, starEclp2Ceclp, starEclp2Equa, testEclpEclpDif,
} from './astronomy_west.mjs'
import { AutoTcorr, AutoDifAccum, AutoMoonAcrS, ShoushiXianV } from './astronomy_acrv.mjs'
import { NameList, AutoDegAccumList, MansionNameList, MansionNameListQing } from './para_constant.mjs'
import { AutoEclipse } from './astronomy_eclipse.mjs'
import { Deg2Mansion, Mansion2Deg, mansion, mansionQing } from './astronomy_other.mjs'
import { AutoMoonAvgV, AutoNodeCycle, AutoSolar } from './para_auto-constant.mjs'
import { GongFlat2High, GongHigh2Flat, HighLon2FlatLat, LonFlat2High, LonHigh2Flat, corrEllipse, corrEllipseB1, corrEllipseC, corrEllipseD1, corrEllipseD2, corrRingA, corrRingC } from './newm_shixian.mjs'
const Gong2Lon = Gong => (Gong + 270) % 360
// 月亮我2020年4個月的數據擬合 -.9942  + .723*cos(x* .2243) +  6.964 *sin(x* .2243)，但是幅度跟古曆比起來太大了，就調小了一點 極大4.4156，極小-5.6616
export const bindTcorr = (AnomaAccum, Sd, Name) => {  // Name預留給誤差分析程序，否則不用
    Sd = +Sd
    AnomaAccum = +AnomaAccum
    if (Sd > 365.2425 || Sd < 0) throw (new Error('請輸入一回歸年內的日數！'))
    let List1 = ['Qianxiang', 'Jingchu', 'Yuanjia', 'Daming', 'Tsrengguang', 'Xinghe', 'Tianbao', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Wuji', 'Tsrengyuan', 'Futian', 'Qintian', 'Mingtian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Daming3', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chunyou', 'Huitian', 'Chengtian', 'Shoushi']
    let List2 = ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Fengyuan', 'Guantian', 'Zhantian']
    List1 = Name ? [Name] : List1
    List2 = Name ? [Name] : List2
    let Print1 = [], Print2 = []
    Print1 = Print1.concat(List1.map(Name => {
        const { Anoma, cS, cM } = Para[Name]
        const Solar = AutoSolar(Name)
        const p = 360 / Solar
        const EllipseSun = cS ? corrEllipse(Sd * p, cS) / p : undefined
        const EllipseMoon = cM ? corrEllipse((AnomaAccum / Anoma * 360 + 180) % 360, cM) / p : undefined
        let AutoDifAccumFunc = {}
        if (Name !== 'Qintian') AutoDifAccumFunc = AutoDifAccum(AnomaAccum, Sd, Name)
        const { SunDifAccum, MoonDifAccum } = AutoDifAccumFunc
        const { SunTcorr, MoonTcorr, MoonAcrVd, NodeAccumCorrA } = AutoTcorr(AnomaAccum, Sd, Name)
        const MoonAcrS = AutoMoonAcrS(AnomaAccum, Name).MoonAcrS
        let SunTcorrPrint = '-', NodeAccumCorrPrint = '-'
        const SunDifAccumPrint = SunDifAccum ? SunDifAccum.toFixed(5) : '-'
        const SunDifAccumErrPrint = EllipseSun !== undefined ?
            ~~((SunDifAccum - EllipseSun) / EllipseSun * 10000) : '-'
        const MoonDifAccumPrint = (MoonDifAccum || 0).toFixed(5)
        let MoonAcrVdPrint = '-'
        if (Name === 'Shoushi') {
            const tmp = ShoushiXianV(AnomaAccum)
            MoonAcrVdPrint = tmp.toFixed(4) + `\n` + (tmp / .082).toFixed(4)
        }
        else if (MoonAcrVd) MoonAcrVdPrint = MoonAcrVd.toFixed(4)
        const MoonDifAccumErrPrint = EllipseMoon !== undefined ?
            ~~((MoonDifAccum - EllipseMoon) / EllipseMoon * 10000) : '-'
        if (SunTcorr) SunTcorrPrint = SunTcorr.toFixed(5)
        const MoonAcrSPrint = MoonAcrS.toFixed(4)
        const MoonTcorrPrint = MoonTcorr.toFixed(5)
        if (NodeAccumCorrA) NodeAccumCorrPrint = NodeAccumCorrA.toFixed(4)
        const Tcorr = +MoonTcorrPrint + (+SunTcorrPrint || 0)
        return {
            title: NameList[Name],
            data: [
                SunDifAccumPrint, SunDifAccumErrPrint, SunTcorrPrint,
                MoonDifAccumPrint, MoonDifAccumErrPrint, MoonTcorrPrint, MoonAcrSPrint, MoonAcrVdPrint,
                Tcorr.toFixed(4), NodeAccumCorrPrint]
        }
    }))
    Print2 = Print2.concat(List2.map(Name => {
        const { Anoma, cS, cM } = Para[Name]
        const Solar = AutoSolar(Name)
        const p = 360 / Solar
        const EllipseSun = cS ? corrEllipse(Sd * p, cS) / p : undefined
        const EllipseMoon = cM ? corrEllipse(AnomaAccum / Anoma * 360, cM) / p : undefined
        const { SunDifAccum, MoonDifAccum
        } = AutoDifAccum(AnomaAccum, Sd, Name)
        const { SunTcorr, MoonTcorr, NodeAccumCorrA
        } = AutoTcorr(AnomaAccum, Sd, Name)
        const MoonAcrS = AutoMoonAcrS(AnomaAccum, Name).MoonAcrS
        const SunDifAccumPrint = SunDifAccum.toFixed(5)
        const SunDifAccumErrPrint = EllipseSun !== undefined ?
            ~~((SunDifAccum - EllipseSun) / EllipseSun * 10000) : '-'
        const MoonAcrSPrint = MoonAcrS.toFixed(4)
        const MoonDifAccumPrint = MoonDifAccum.toFixed(5)
        const MoonDifAccumErrPrint = EllipseMoon !== undefined ?
            ~~((MoonDifAccum - EllipseMoon) / EllipseMoon * 10000) : '-'
        const SunTcorrPrint = SunTcorr.toFixed(5)
        const MoonTcorrPrint = MoonTcorr.toFixed(5)
        const Tcorr = +MoonTcorrPrint + +SunTcorrPrint
        return {
            title: NameList[Name],
            data: [
                SunDifAccumPrint, SunDifAccumErrPrint, SunTcorrPrint,
                MoonDifAccumPrint, MoonDifAccumErrPrint, MoonTcorrPrint, MoonAcrSPrint,
                Tcorr.toFixed(4), NodeAccumCorrA.toFixed(4)]
        }
    }))
    return { Print1, Print2 }
}
// console.log(bindTcorr(1, 1))

export const bindCorrEllipse = (Orb, cRaw) => {
    const f = x => x.toFixed(10)
    Orb = +Orb
    cRaw = +cRaw
    const cA = cRaw || .0169
    const cB = cRaw || .0179208
    if (cA > .02) Orb = (Orb + 180) % 360 // 各個小函數>.02都會+180，此處再加，反轉回來。
    const AA = corrEllipse(Orb, cA)
    const B = corrEllipseD1(Orb, cA) // 卡西尼
    const C = corrEllipseB1(Orb, cA) // 借積求積
    const D = corrEllipseD2(Orb, cA) // 兩三角形
    const E = corrEllipseC(Orb, cA) // 借角求角
    const AB = corrEllipse(Orb, cB)
    const F = corrRingA(Orb, cB).Corr // 對分圓
    const G = corrRingC(Orb, cB).Corr // 本輪均輪
    const B1 = (B - AA) / AA * 10000 // 誤差‱
    const C1 = (C - AA) / AA * 10000
    const D1 = (D - AA) / AA * 10000
    const E1 = (E - AA) / AA * 10000
    const F1 = (F - AB) / AB * 10000
    const G1 = (G - AB) / AB * 10000
    const Print = [{
        title: '卡西尼',
        data: [B, f(AA), f(B1)]
    }, {
        title: '借積求積',
        data: [C, '', f(C1)]
    }, {
        title: '兩三角形',
        data: [D, '', f(D1)]
    }, {
        title: '借角求角',
        data: [E, '', f(E1)]
    }, {
        title: '對分圓',
        data: [F, cRaw ? '' : f(AB), f(F1)]
    }, {
        title: '本輪均輪',
        data: [G, '', f(G1)]
    }]
    return Print
}
export const autoEquaEclp = (Gong, Name) => { // 輸入度數而非距冬至時間 // 只有公式法的才有黃轉赤。表格的是直接取符號相反
    const { Type, Sidereal, Solar, SolarRaw } = Para[Name]
    Gong %= Sidereal || (Solar || SolarRaw)
    let Func = {}
    if (Type <= 7 || ['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        if (['Yisi', 'LindeB', 'Shenlong'].includes(Name)) Func = Equa2EclpTable(Gong, 'Linde')
        else Func = Equa2EclpTable(Gong, Name)
    } else {
        if (Type === 9 || Type === 10) Func = Equa2EclpFormula(Gong, 'Jiyuan')
        else if (Type === 11) Func = Hushigeyuan(Gong)
        else Func = Equa2EclpFormula(Gong, Name) // (Name === 'Dayan' || Type === 8)
    }
    const { Equa2Eclp, Eclp2Equa, Equa2EclpDif, Eclp2EquaDif } = Func
    return {
        Equa2Eclp: +Equa2Eclp.toFixed(10),
        Equa2EclpDif: +Equa2EclpDif.toFixed(10),
        Eclp2Equa: +Eclp2Equa.toFixed(10),
        Eclp2EquaDif: +Eclp2EquaDif.toFixed(10)
    }
}
/**
 * 藤豔輝<v>紀元曆日食算法及精度分析</v>距離冬至 31.816049 日，紀元日出 2126.2566/7290 = 29.1667572，我之前是直接用黃經，是 29.227518，差了 1 天多，改用距冬至日數，加上日躔，29.1664，密合。
 * 陈美东《中国古代昼夜漏刻长度的计算法》「该文中所示二十四节气(平气)太阳黄经的算式，在本文中适用东汉四分历、景初历、元嘉历、大明历、皇极历、大业历、戊寅历、应天历、乾元历和仪天历等十种历法。而该文中所示二十四节气(定气)太阳黄经的算式，则适用于本文中的麟德历、大衍历、宣明历、崇玄历、崇天历、明天历、观天历和纪元历等八种历法
 * 陈美東《崇玄儀天崇天三曆晷長計算法及三次差內插法的應用》。1、距二至的整數日，2、算上二至中前後分的修正值。我現在直接用正午到二至的距離。之所以那麼麻煩，應該是因爲整數好算一些，實在迷惑。冬至到夏至，盈縮改正爲負，入盈曆，實行日小於平行日。因此自變量不應該是黃經，而是達到實行度所需日數！
魏晉的黃道去極，是根據節氣來的，日書就不調用了。崇玄赤轉赤緯，「昏後夜半日數」，晷長：「日中入二至加時以來日數」。紀元「午中日行積度」
崇天的漏刻、赤緯跟《中國古代晝夜漏刻長度的計算法》一致
 * Lon2LatTable1 自然都是平行
 * Lon2LatTable2。Type === 7 || ['Yingtian', 'Qianyuan']會在子函數用定氣算，所以不加改正
 * Lon2LatFormula。紀元的曲線和現代公式擬合得很好，幾乎重合。因此自變量是黃道實行度。唯獨儀天是距二至的時間，不能加改正
 * Hushigeyuan 實行
 * dialFormula 都是實行度，儀天也是
 * 陳美東誤差：四分.7，麟德.13，大衍.06，宣明.45，崇玄.09，儀天.45，崇天明天觀天.23 .20 .21，紀元.11，大明.12，授時.11。我testLon2Lat：後漢四分：0.7918, 麟德：0.0874, 大衍：0.0448, 宣明：0.3109, 崇玄：0.1009, 應天：0.3115, 乾元：0.3120, 儀天：0.3088, 崇天：0.0536, 明天：0.0539, 觀天：0.0541, 紀元：0.0089, 重修大明：0.0058, 授時：0.0148,
 * @param {*} Sd 距冬至時間
 * @param {*} SolsDeci 冬至小分
 * @param {*} isBare true：不加太陽改正
 * @param {*} Name 曆法名
 * @returns 
 */
export const autoLat = (Sd, Name, isBare) => {
    const { Type } = Para[Name]
    let Corr = 0, Lat = 0
    if (isBare !== true) {
        if (['Linde', 'Yisi', 'LindeB', 'Shenlong', 'Chongxuan', 'Qintian', 'Chongtian', 'Mingtian', 'Guantian', 'Fengyuan', 'Zhantian', 'Jiyuan'].includes(Name) || Type === 11) {
            Corr = AutoDifAccum(0, Sd, Name).SunDifAccum
        }
    }
    const X = Sd + Corr
    if (Type <= 4 || Name === 'Huangji') Lat = latTable1(X, 'Easthan')
    else if (['Linde', 'Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        Lat = latRiseTable2(X, 'Linde').Lat
    } else if (Type === 6) {
        Lat = latRiseTable2(X, Name).Lat
    } else if (Type === 10) {
        Lat = latRiseTable2(X, 'Daming3').Lat
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan'].includes(Name)) {
        Lat = latRiseTable3(X, 'Dayan').Lat
    } else if (['Xuanming', 'Yingtian', 'Qianyuan'].includes(Name)) {
        Lat = latRiseTable3(X, Name).Lat
    } else if (Type === 8 || Name === 'Qintian') { // 北宋latFormula用實行
        Lat = latFormula(X, Name)
    } else if (Type === 9) {
        Lat = latFormula(X, 'Jiyuan')
    } else if (Type === 11) {
        Lat = Hushigeyuan(X, Name).Lat
    }
    return Lat
}
export const autoRise = (Sd, SolsDeci, Name) => {
    const { Type } = Para[Name]
    let { Solar, SolarRaw } = Para[Name]
    Solar = Solar || SolarRaw
    let Corr = 0, Plus = 0, Rise = 0
    let SdNoon = (~~(Sd + SolsDeci) - SolsDeci + Solar + .5) % Solar // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
    if (Type <= 4) Plus = -1.5 // 非常詭異
    else if (Type === 11) Plus = -.5 // 授時「置所求日晨前夜半黃道積度」
    SdNoon += Plus
    if (['Linde', 'Yisi', 'LindeB', 'Shenlong', 'Chongxuan', 'Qintian', 'Chongtian', 'Mingtian', 'Guantian', 'Fengyuan', 'Zhantian', 'Jiyuan'].includes(Name) || Type === 11) {
        Corr = AutoDifAccum(0, SdNoon, Name).SunDifAccum
    }
    const X = SdNoon + Corr
    if (['Daming', 'Liangwu'].includes(Name)) {
        Rise = riseTable1(X, 'Daming')
    } else if (['Daye', 'Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
        Rise = riseTable1(X, 'Daye')
    } else if (Type <= 3) {
        Rise = riseTable1(X, 'Easthan')
    } else if (Type === 4) {
        Rise = riseTable1(X, Name)
    } else if (['Linde', 'Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        Rise = latRiseTable2(X, 'Linde').Rise
    } else if (Type === 6) {
        Rise = latRiseTable2(X, Name).Rise
    } else if (Type === 10) {
        Rise = latRiseTable2(X, 'Daming3').Rise
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan'].includes(Name)) {
        Rise = latRiseTable3(X, 'Dayan').Rise
    } else if (['Xuanming', 'Yingtian', 'Qianyuan'].includes(Name)) {
        Rise = latRiseTable3(X, Name).Rise
    } else if (Type === 8 || Name === 'Qintian') { // 北宋latFormula用實行
        Rise = riseFormula(latFormula(X, Name), SdNoon, Name)
    } else if (Type === 9) {
        Rise = riseFormula(latFormula(X, 'Jiyuan'), SdNoon, 'Jiyuan')
    } else if (Type === 11) {
        Rise = Hushigeyuan(X, Name).Rise
    }
    return Rise
}
export const autoDial = (Sd, SolsDeci, Name) => {
    const { Type } = Para[Name]
    let { Solar, SolarRaw } = Para[Name]
    Solar = Solar || SolarRaw
    let Corr = 0, Plus = 0, Dial = 0
    let SdNoon = (~~(Sd + SolsDeci) - SolsDeci + Solar + .5) % Solar // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
    if (Type <= 4) Plus = -1.5 // 非常詭異
    else if (Type === 11) Plus = -.5 // 授時「置所求日晨前夜半黃道積度」
    SdNoon += Plus
    if (['Linde', 'Yisi', 'LindeB', 'Shenlong', 'Chongxuan', 'Qintian', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Fengyuan', 'Zhantian', 'Jiyuan'].includes(Name) || Type === 11) {
        Corr = AutoDifAccum(0, SdNoon, Name).SunDifAccum
    }
    const X = SdNoon - Corr // 這要反著來
    if (['Daming', 'Liangwu'].includes(Name)) {
        Dial = dialTable1(X, 'Daming')
    } else if (['Daye', 'Zhangmengbin', 'Liuxiaosun'].includes(Name)) {
        Dial = dialTable1(X, 'Daye')
    } else if (Type <= 3) {
        Dial = dialTable1(X, 'Easthan')
    } else if (Type === 4) {
        Dial = dialTable1(X, Name)
    } else if (['Linde', 'Yisi', 'LindeB', 'Shenlong'].includes(Name)) {
        Dial = dialTable2(X, 'Linde')
    } else if (Type === 6) {
        Dial = dialTable2(X, Name)
    } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan'].includes(Name)) {
        Dial = dialTable3(latRiseTable3(X, 'Dayan').Lat1)
    } else if ((['Xuanming', 'Yingtian', 'Qianyuan'].includes(Name)) && Name !== 'Qintian') {
        Dial = dialTable3(latRiseTable3(X, Name).Lat1)
    } else if ((Type >= 8 && Type <= 10) || Name === 'Qintian') {
        if (Type === 8 || Name === 'Qintian') { // 北宋Lon2LatFormula用實行            
            Dial = dialFormula(X, Name, SolsDeci)
        } else if (Type >= 9) {
            Dial = dialFormula(X, 'Jiyuan')
        }
    }
    return Dial
}
export const bindEquaEclp = (GongRaw, year) => {
    year = +year, GongRaw = +GongRaw
    if (GongRaw >= 365.25 || GongRaw < 0) throw (new Error('請輸入一週天度內的度數'))
    let Range = ''
    if (GongRaw < 91.3125) Range += '冬至 → 春分，赤度 > 黃度'
    else if (GongRaw < 182.625) Range += '春分 → 夏至，赤度 < 黃度'
    else if (GongRaw < 273.9375) Range += '夏至 → 秋分，赤度 > 黃度'
    else Range += '秋分 → 冬至，赤度 < 黃度'
    const {
        Equa2Eclp: WestB,
        Equa2EclpDif: WestB1,
        Eclp2Equa: WestA,
        Eclp2EquaDif: WestA1
    } = EquaEclpWest(GongRaw, year)
    const { Solar, e } = ConstWest(year)
    const p = 360 / Solar
    const WestLat = HighLon2FlatLat(e, Gong2Lon(GongRaw * p))
    let Print = [{
        title: '現代',
        data: [(WestB / p).toFixed(6), (WestB1 / p).toFixed(6), '-', 0, (WestA / p).toFixed(6), (WestA1 / p).toFixed(6), '-', 0, (WestLat / p).toFixed(6), '-', 0]
    }]
    const List1 = ['Qianxiang', 'Huangji', 'Dayan', 'Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi']
    const List2 = ['Qianxiang', 'Huangji', 'Dayan', 'Chongxuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi']
    Print = Print.concat(
        List1.map(Name => {
            const { Sobliq } = Para[Name]
            const Solar = AutoSolar(Name)
            const p = 360 / Solar
            const Gong = GongRaw * p
            const West0A = GongHigh2Flat(Sobliq * p, Gong) / p
            const West0B = GongFlat2High(Sobliq * p, Gong) / p
            const West0Lat = HighLon2FlatLat(Sobliq * p, Gong2Lon(Gong)) / p
            let EclpLonPrint = '-', EclpLonWestPrint = '-', EclpLonErrPrint = '-', EquaLonPrint = '-', EquaLonWestPrint = '-', EquaLonErrPrint = '-', Equa2EclpDifPrint = '-', Eclp2EquaDifPrint = '-', Eclp2EquaLatPrint = '-', Eclp2EquaLatWestPrint = '-', Eclp2EquaLatErrPrint = '-'
            const { Equa2Eclp, Eclp2Equa, Equa2EclpDif, Eclp2EquaDif } = autoEquaEclp(GongRaw, Name)
            let Eclp2EquaLat = 0
            if (Name === 'Shoushi') Eclp2EquaLat = Hushigeyuan(GongRaw).Lat
            else if (List2.indexOf(Name) > 0) Eclp2EquaLat = autoLat(GongRaw, Name, true)
            if (Equa2Eclp) {
                EclpLonPrint = Equa2Eclp.toFixed(6)
                Equa2EclpDifPrint = Equa2EclpDif.toFixed(6)
                EclpLonWestPrint = West0B.toFixed(6)
                EclpLonErrPrint = ~~((Equa2Eclp - West0B) / West0B * 10000)
            }
            if (Eclp2Equa) {
                EquaLonPrint = Eclp2Equa.toFixed(6)
                Eclp2EquaDifPrint = Eclp2EquaDif.toFixed(6)
                EquaLonWestPrint = West0A.toFixed(6)
                EquaLonErrPrint = ~~((Eclp2Equa - West0A) / West0A * 10000)
            }
            if (Eclp2EquaLat) {
                Eclp2EquaLatPrint = Eclp2EquaLat.toFixed(6)
                Eclp2EquaLatWestPrint = West0Lat.toFixed(6)
                Eclp2EquaLatErrPrint = +(Eclp2EquaLat - West0Lat).toFixed(4)
            }
            return {
                title: NameList[Name],
                data: [EclpLonPrint, Equa2EclpDifPrint, EclpLonWestPrint, EclpLonErrPrint, EquaLonPrint, Eclp2EquaDifPrint, EquaLonWestPrint, EquaLonErrPrint, Eclp2EquaLatPrint, Eclp2EquaLatWestPrint, Eclp2EquaLatErrPrint]
            }
        }))
    return { Range, Print }
}
export const bindStarEclp2Equa = (Sobliq, Lon, Lat) => {
    Sobliq = +Sobliq, Lon = +Lon, Lat = +Lat
    const { EquaLon, EquaLat } = starEclp2Equa(Sobliq, Lon, Lat)
    const Ceclp = starEclp2Ceclp(Sobliq, Lon, Lat)
    const DifMax = testEclpEclpDif(Sobliq, Lat)
    let Dif = Ceclp - Lon
    if (Dif > 180) Dif -= 360
    Dif = +Dif.toFixed(5)
    return { EquaLon, EquaLat: +EquaLat.toFixed(5), Ceclp, Dif, DifMax }
}
export const bindLon2Lat = (Sd, SolsDeci) => {
    Sd = +Sd
    SolsDeci = +('.' + SolsDeci)
    if (Sd >= 365.25 || Sd < 0) throw (new Error('請輸入一週天度內的度數'))
    let Print = []
    Print = Print.concat(
        ['Easthan', 'Yuanjia', 'Daming', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Daming3', 'Shoushi', 'Datong'].map(Name => {
            const { Sobliq, RiseLat, DialLat } = Para[Name]
            const Solar = AutoSolar(Name)
            const p = 360 / Solar
            const SdMidn = (~~(Sd + SolsDeci) - SolsDeci + Solar) % Solar // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
            let GongRaw = Sd
            let GongMidnRaw = SdMidn
            if (['Easthan', 'Yuanjia', 'Daming', 'Daye', 'Wuyin', 'Huangji'].includes(Name)) {
                GongRaw += corrEllipse(GongRaw * p, .0174) / p
                GongMidnRaw += corrEllipse(GongRaw * p, .0174) / p
            } // 沒有太陽改正的古曆直接用現代公式
            else {
                GongRaw += (AutoDifAccum(0, SdMidn, Name).SunDifAccum || 0)
                GongMidnRaw += (AutoDifAccum(0, SdMidn, Name).SunDifAccum || 0)
            } // 加上太陽改正
            const Gong = GongRaw * p, Lon = Gong2Lon(Gong), GongMidn = GongMidnRaw * p, LonMidn = Gong2Lon(GongMidn)
            const WestA = HighLon2FlatLat(Sobliq * p, Lon) / p // 球面三角緯度
            const WestB = sunRise(Sobliq * p, RiseLat || 34.284, LonMidn)
            const WestC = Lon2DialWest(Sobliq * p, DialLat || 34.404, LonMidn)
            let LatPrint = '-', LatErrPrint = '-', SunrisePrint = '-', SunriseErrPrint1 = '-', SunriseErrPrint2 = '-', DialPrint = '-', DialErrPrint1 = '-', DialErrPrint2 = '-'
            const Lat = autoLat(Sd, Name)
            const Rise = autoRise(Sd, SolsDeci, Name)
            const Dial = autoDial(Sd, SolsDeci, Name)
            LatPrint = Lat.toFixed(4)
            LatErrPrint = (Lat - WestA).toFixed(4)
            if (RiseLat) {
                SunrisePrint = Rise.toFixed(4)
                SunriseErrPrint1 = (Rise - WestB.t).toFixed(4)
                SunriseErrPrint2 = (Rise - WestB.t0).toFixed(4)
            }
            if (DialLat) {
                DialPrint = Dial.toFixed(4)
                DialErrPrint1 = ~~((Dial - WestC.Dial) / WestC.Dial * 10000)
                DialErrPrint2 = ~~((Dial - WestC.Dial1) / WestC.Dial1 * 10000)
            }
            return {
                title: NameList[Name],
                data: [LatPrint, LatErrPrint, Sobliq, SunrisePrint, SunriseErrPrint1, SunriseErrPrint2, DialPrint, DialErrPrint1, DialErrPrint2, DialLat || RiseLat]
            }
        }))
    return Print
}
// console.log(bindLon2Lat(0, 2)[14].data[3])
export const bindDeg2Mansion = Deg => {
    const { EquaAccumList: EquaAccumListTaichu, EclpAccumList: EclpAccumListTaichu } = AutoDegAccumList('Taichu', 300)
    const EquaAccumListHuangji = []
    const EclpAccumListHuangji = AutoDegAccumList('Huangji', 500).EclpAccumList
    const EquaAccumListLinde = []
    const EclpAccumListLinde = AutoDegAccumList('Linde', 665).EclpAccumList // 麟德
    const { EquaAccumList: EquaAccumListDayan, EclpAccumList: EclpAccumListDayan } = AutoDegAccumList('Dayan', 729)
    const EquaAccumListYingtian = []
    const EclpAccumListYingtian = AutoDegAccumList('Yingtian', 964).EclpAccumList // 應天
    const EquaAccumListMingtian = AutoDegAccumList('Mingtian', 1065).EquaAccumList // 明天
    const EclpAccumListMingtian = AutoDegAccumList('Mingtian', 1065).EclpAccumList // 明天
    const { EquaAccumList: EquaAccumListJiyuan, EclpAccumList: EclpAccumListJiyuan } = AutoDegAccumList('Jiyuan', 1106)
    const EquaAccumListDaming3 = []
    const EclpAccumListDaming3 = AutoDegAccumList('Daming3', 1180).EclpAccumList
    const { EquaAccumList: EquaAccumListShoushi, EclpAccumList: EclpAccumListShoushi } = AutoDegAccumList('Shoushi', 1281)
    const { EquaAccumList: EquaAccumListJiazi, EclpAccumList: EclpAccumListJiazi } = AutoDegAccumList('Jiazi', 1684) // 甲子元曆
    const Print = ['Taichu', 'Huangji', 'Linde', 'Dayan', 'Yingtian', 'Mingtian', 'Jiyuan', 'Daming3', 'Shoushi', 'Jiazi'].map(Name => {
        const EclpList = eval('EclpAccumList' + Name)
        const Eclp = Deg2Mansion(Deg, EclpList)
        const EquaList = eval('EquaAccumList' + Name)
        let Equa = ''
        if ((EquaList || []).length) Equa = Deg2Mansion(Deg, EquaList)
        return {
            title: NameList[Name],
            data: [Equa, Eclp]
        }
    })
    return Print
}
// console.log(bindDeg2Mansion(23.1511, 'Jiazi'))

export const bindMansion2Deg = Mansion => {
    const { EquaAccumList: EquaAccumListTaichu, EclpAccumList: EclpAccumListTaichu } = AutoDegAccumList('Taichu', 300)
    const EquaAccumListHuangji = []
    const EclpAccumListHuangji = AutoDegAccumList('Huangji', 500).EclpAccumList
    const EquaAccumListLinde = []
    const EclpAccumListLinde = AutoDegAccumList('Linde', 665).EclpAccumList // 麟德
    const { EquaAccumList: EquaAccumListDayan, EclpAccumList: EclpAccumListDayan } = AutoDegAccumList('Dayan', 729)
    const EquaAccumListYingtian = []
    const EclpAccumListYingtian = AutoDegAccumList('Yingtian', 964).EclpAccumList // 應天
    const EquaAccumListMingtian = AutoDegAccumList('Mingtian', 1065).EquaAccumList // 明天
    const EclpAccumListMingtian = AutoDegAccumList('Mingtian', 1065).EclpAccumList // 明天
    const { EquaAccumList: EquaAccumListJiyuan, EclpAccumList: EclpAccumListJiyuan } = AutoDegAccumList('Jiyuan', 1106)
    const EquaAccumListDaming3 = []
    const EclpAccumListDaming3 = AutoDegAccumList('Daming3', 1180).EclpAccumList
    const { EquaAccumList: EquaAccumListShoushi, EclpAccumList: EclpAccumListShoushi } = AutoDegAccumList('Shoushi', 1281)
    const { EquaAccumList: EquaAccumListJiazi, EclpAccumList: EclpAccumListJiazi } = AutoDegAccumList('Jiazi', 1684)
    const Print = ['Taichu', 'Huangji', 'Linde', 'Dayan', 'Yingtian', 'Mingtian', 'Jiyuan', 'Daming3', 'Shoushi', 'Jiazi'].map(Name => {
        const EclpList = eval('EclpAccumList' + Name)
        const Eclp = +Mansion2Deg(Mansion, EclpList, Name).toFixed(3)
        const EquaList = eval('EquaAccumList' + Name)
        let Equa = ''
        if ((EquaList || []).length) {
            Equa = +Mansion2Deg(Mansion, EquaList, Name).toFixed(3)
        }
        return {
            title: NameList[Name],
            data: [Equa, Eclp]
        }
    })
    return Print
}
// console.log(bindMansion2Deg('氐1'))
export const bindMansionAccumList = (Name, Y) => { // 本函數經ChatGPT優化
    Name = Name.toString()
    Y = +Y
    const { Type, Solar } = Para[Name]
    const { EclpAccumList, EquaAccumList } = AutoDegAccumList(Name, Y)
    const p = Type === 13 ? 360 / Solar : undefined
    const EclpList = [], EquaList = []
    const NameList = Type === 13 ? MansionNameListQing : MansionNameList
    let Func = {}
    if (Type === 13) Func = mansionQing(Name, Y, 0)
    else Func = mansion(Name, Y, 0, 0)
    const { SolsEclpMansion, SolsEquaMansion, Exchange } = Func
    let SolsEclpPrint = '', SolsEquaPrint = ''
    if (Type === 13) {
        SolsEclpPrint = SolsEclpMansion + '°' + (+SolsEclpMansion.slice(1) / p).toFixed(2) + '度'
        SolsEquaPrint = SolsEquaMansion + '°' + (+SolsEquaMansion.slice(1) / p).toFixed(2) + '度'
    } else {
        SolsEclpPrint = SolsEclpMansion
        SolsEquaPrint = SolsEquaMansion
    }
    for (let i = 1; i < 30; i++) {
        EclpList[i] = +(EclpAccumList[i] - EclpAccumList[i - 1]).toFixed(3)
        EquaList[i] = +(EquaAccumList[i] - EquaAccumList[i - 1]).toFixed(3)
    }
    const EclpAccumPrint = [], EquaAccumPrint = []
    const DirList = ['東青龍', '北玄武', '西白虎', '南朱雀']
    const NumList = ' ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘'
    for (let i = 0; i < 4; i++) {
        EclpAccumPrint.push([])
        EquaAccumPrint.push([])
        let EclpSum = 0, EquaSum = 0
        for (let j = 1; j <= 7; j++) {
            const index = i * 7 + j
            EclpSum += EclpList[index + 1]
            EquaSum += EquaList[index + 1]
        }
        for (let j = 1; j <= 7; j++) {
            const index = i * 7 + j
            EclpAccumPrint[i].push(NameList[index] + ' ' + EclpAccumList[index] + `　\n${NumList[index]} ` + EclpList[index + 1])
            if ((Exchange || [])[0]) {
                Exchange.map(j => {
                    if (index === j) {
                        EquaAccumPrint[i].push(NameList[index + 1] + ' ' + EquaAccumList[index] + `　\n${NumList[index]} ` + EquaList[index + 1])
                    } else if (index === j + 1) {
                        EquaAccumPrint[i].push(NameList[index - 1] + ' ' + EquaAccumList[index] + `　\n${NumList[index]} ` + EquaList[index + 1])
                    } else EquaAccumPrint[i].push(NameList[index] + ' ' + EquaAccumList[index] + `　\n${NumList[index]} ` + EquaList[index + 1])
                })
            } else EquaAccumPrint[i].push(NameList[index] + ' ' + EquaAccumList[index] + `　\n${NumList[index]} ` + EquaList[index + 1])
        }
        EclpAccumPrint[i][8] = DirList[i] + EclpSum.toFixed(3)
        EquaAccumPrint[i][8] = DirList[i] + EquaSum.toFixed(3)
    }
    if (Type === 13) {
        EclpAccumPrint[4] = ['下爲古度'], EquaAccumPrint[4] = ['下爲古度']
        for (let i = 5; i < 9; i++) {
            EclpAccumPrint.push([])
            EquaAccumPrint.push([])
            let EclpSum = 0, EquaSum = 0
            for (let j = 1; j <= 7; j++) {
                const index = (i - 5) * 7 + j;
                EclpSum += EclpList[index + 1] / p
                EquaSum += EquaList[index + 1] / p
            }
            for (let j = 1; j <= 7; j++) {
                const index = (i - 5) * 7 + j
                EclpAccumPrint[i].push(NameList[index] + ' ' + (EclpAccumList[index] / p).toFixed(2) + `　\n${NumList[index]} ` + (EclpList[index + 1] / p).toFixed(2))
                if ((Exchange || [])[0]) {
                    Exchange.map(j => {
                        if (index === j) {
                            EquaAccumPrint[i].push(NameList[index + 1] + ' ' + (EquaAccumList[index] / p).toFixed(2) + `　\n${NumList[index]} ` + (EquaList[index + 1] / p).toFixed(2))
                        } else if (index === j + 1) {
                            EquaAccumPrint[i].push(NameList[index - 1] + ' ' + (EquaAccumList[index] / p).toFixed(2) + `　\n${NumList[index]} ` + (EquaList[index + 1] / p).toFixed(2))
                        } else EquaAccumPrint[i].push(NameList[index] + ' ' + (EquaAccumList[index] / p).toFixed(2) + `　\n${NumList[index]} ` + (EquaList[index + 1] / p).toFixed(2))
                    })
                } else EquaAccumPrint[i].push(NameList[index] + ' ' + (EquaAccumList[index] / p).toFixed(2) + `　\n${NumList[index]} ` + (EquaList[index + 1] / p).toFixed(2))
            }
            EclpAccumPrint[i][8] = DirList[i - 5] + +EclpSum.toFixed(2)
            EquaAccumPrint[i][8] = DirList[i - 5] + +EquaSum.toFixed(2)
        }
    }
    return {
        EclpAccumPrint, EquaAccumPrint, SolsEclpPrint, SolsEquaPrint
    }
}
// console.log(bindMansionAccumList('Guimao', 281))
export const autoMoonLat = (NodeAccum, Name) => {
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
    const MoonEclpLat = MoonLat.Lat || 0 // MoonEquaLat - autoLat(SunEclpLon, .5, Name)
    return { MoonEclpLat, MoonEquaLat }
}
// console.log(autoMoonLat(2, 'Tsrengyuan').MoonEclpLat)

export const autoMoonLon = (NodeAccum, MoonEclp, Name) => {
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
    // let NodeSdDay = Sd + tmp3 // 每日夜半平交日辰，我定義的：夜半的下個正交距離冬至日數。這算出來又是做什麼的？？
    const NodeEclp = (MoonEclp + tmp4) % Sidereal // 正交距冬至度數 // 算出來好迷啊，莫名其妙
    // const NodeSdMoonTcorr = AutoTcorr(NodeAnomaAccum, Sd, Name, NodeAccum).MoonTcorr // 遲加疾減
    // NodeSdDay = (NodeSdDay + NodeSdMoonTcorr) % Solar // 正交日辰=平交日辰+月亮改正  
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
// console.log(autoMoonLon(234, 45, 4.11, 'Dayan'))

export const bindMoonLonLat = (NodeAccum, MoonEclp) => { // 該時刻入交日、距冬至日數
    NodeAccum = +NodeAccum
    MoonEclp = +MoonEclp
    if (NodeAccum >= 27.21221 || NodeAccum < 0) throw (new Error('請輸入一交點月內的日數'))
    if (MoonEclp >= 365.246 || MoonEclp < 0) throw (new Error('請輸入一週天度內的度數'))
    let Print = []
    Print = Print.concat(
        ['Qianxiang', 'Yuanjia', 'Daming', 'Huangji', 'Dayan', 'Wuji', 'Tsrengyuan', 'Chongxuan', 'Qintian', 'Yingtian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Shoushi'].map(Name => {
            let NodeSdDegPrint = '-'
            let WhiteLonPrint = '-'
            let EquaLonPrint = '-'
            let EclpWhiteDifPrint = '-'
            // let EclpEquaDifPrint = '-'
            let EquaWhiteDifPrint = '-'
            let LatPrint = '-'
            let EquaLatPrint = '-'
            const { NodeEclp, EquaLon, EclpWhiteDif, EquaWhiteDif, WhiteLon, EquaLat
            } = autoMoonLon(NodeAccum, MoonEclp, Name)
            const { MoonEclpLat,
            } = autoMoonLat(NodeAccum, Name)
            if (NodeEclp) {
                NodeSdDegPrint = NodeEclp.toFixed(4)
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
                LatPrint = MoonEclpLat.toFixed(4)
            }
            if (EquaLat) {
                EquaLatPrint = EquaLat.toFixed(4)
            }
            return {
                title: NameList[Name],
                data: [NodeSdDegPrint, EquaLonPrint, WhiteLonPrint, EclpWhiteDifPrint, EquaWhiteDifPrint, LatPrint, EquaLatPrint]
            }
        }))
    return Print
}
// console.log(bindMoonLonLat(2.252, 55.71))

export const bindSunEclipse = (NodeAccum, AnomaAccum, AvgDeci, AvgSd, SolsDeci) => {
    NodeAccum = +NodeAccum
    AnomaAccum = +AnomaAccum
    AvgDeci = +('.' + AvgDeci)
    AvgSd = +AvgSd
    SolsDeci = +('.' + SolsDeci)
    const Solar = 365.24478
    const HalfTermLeng = Solar / 24
    if (NodeAccum > 27.212215) throw (new Error('請輸入一交點月27.212215內的日數'))
    if (AnomaAccum > 27.5545) throw (new Error('請輸入一近點月27.5545內的日數'))
    // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
    let i = 0
    for (let j = 0; j <= 11; j++) {
        if (AvgSd >= j * HalfTermLeng && AvgSd < (j + 1) * HalfTermLeng) {
            i = (j - 2 + 12) % 12
        }
        break
    }
    let Print1 = []
    Print1 = Print1.concat(
        ['Daye', 'Wuyin', 'Huangji', 'Linde', 'Wuji', 'Tsrengyuan', 'Qintian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Daming3', 'Gengwu', 'Shoushi', 'Datong'].map(Name => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSd, Name)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSd = AvgSd + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSd, AvgSd, 1, Name, i + 1, 0, 0, SolsDeci)
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
                title: NameList[Name],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    let Print2 = []
    Print2 = Print2.concat(
        ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].map(Name => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSd, Name)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSd = AvgSd + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSd, AvgSd, 1, Name, i + 1, 0, 0, SolsDeci)
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
                title: NameList[Name],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    return { Print1, Print2 }
}
// console.log(bindSunEclipse(.1, 14, 3355, 14, 5))

export const bindMoonEclipse = (NodeAccum, AnomaAccum, AvgDeci, AvgSd, SolsDeci) => {
    NodeAccum = +NodeAccum
    AnomaAccum = +AnomaAccum
    AvgDeci = +('.' + AvgDeci)
    AvgSd = +AvgSd
    SolsDeci = +('.' + SolsDeci)
    const Solar = 365.24478
    const HalfTermLeng = Solar / 24
    const StatusList = ['不食', '全食', '偏食', '微少']
    if (NodeAccum > 27.212215) throw (new Error('請輸入一交點月27.212215內的日數'))
    if (AnomaAccum > 27.5545) throw (new Error('請輸入一近點月27.5545內的日數'))
    // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
    let i = 0
    for (let j = 0; j <= 11; j++) {
        if (AvgSd >= j * HalfTermLeng && AvgSd < (j + 1) * HalfTermLeng) {
            i = (j - 2 + 12) % 12
        }
        break
    }
    let Print1 = []
    Print1 = Print1.concat(
        ['Tsrengguang', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Wuji', 'Tsrengyuan', 'Qintian', 'Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chengtian', 'Daming3', 'Gengwu', 'Shoushi', 'Datong', 'Datong2'].map(Name => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSd, Name)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSd = AvgSd + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSd, AvgSd, 0, Name, i + 1, 0, 0, SolsDeci)
            let StartDeciPrint = '-', TotalDeciPrint = '-', EndDeciPrint = '-'
            const AcrDeciPrint = (AcrDeci * 100).toFixed(3)
            if (StartDeci && TotalDeci) {
                StartDeciPrint = (StartDeci * 100).toFixed(3)
                TotalDeciPrint = (TotalDeci * 100).toFixed(3)
                EndDeciPrint = (EndDeci * 100).toFixed(3)
            }
            const StatusPrint = StatusList[Status]
            return {
                title: NameList[Name],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    let Print2 = []
    Print2 = Print2.concat(
        ['Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].map(Name => {
            const { Tcorr1, Tcorr2 } = AutoTcorr(AnomaAccum, AvgSd, Name)
            const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1
            const AcrSd = AvgSd + (Tcorr2 || Tcorr1)
            const { Magni, StartDeci, TotalDeci, EndDeci, Status
            } = AutoEclipse(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSd, AvgSd, 0, Name, i + 1, 0, 0, SolsDeci)
            let StartDeciPrint = '-', TotalDeciPrint = '-', EndDeciPrint = '-'
            const AcrDeciPrint = (AcrDeci * 100).toFixed(3)
            if (StartDeci && TotalDeci) {
                StartDeciPrint = (StartDeci * 100).toFixed(3)
                TotalDeciPrint = (TotalDeci * 100).toFixed(3)
                EndDeciPrint = (EndDeci * 100).toFixed(3)
            }
            const StatusPrint = StatusList[Status]
            return {
                title: NameList[Name],
                data: [StatusPrint, Magni.toFixed(3), StartDeciPrint, AcrDeciPrint, TotalDeciPrint, EndDeciPrint]
            }
        }))
    return { Print1, Print2 }
}
// console.log(bindMoonEclipse(1.1, 22, 22, 22))

const ErrPrint_SunTcorr = (Name, AnomaAccum) => {
    let SunTcorrErr = []
    for (let i = 1; i <= 182; i++) {
        SunTcorrErr[i] = bindTcorr(AnomaAccum, i, Name).SunTcorrErr
    }
    return SunTcorrErr
}
// console.log (ErrPrint_SunTcorr('Shoushi', 7, 1247))

const rmse = List => { // 均方根
    let Sum = 0
    for (let i = 0; i < List.length; i++) {
        Sum += List[i] ** 2
    }
    return Math.sqrt(Sum / List.length)
}
const testLon2Lat = List => { // 計算所有古曆在每一度的誤差，求均方差
    const Err = []
    for (let i = 0; i < List.length; i++) {
        Err[i] = []
        for (let k = 0; k <= 182; k++) { // k如果改成1有bug
            // Err[i][k] = +bindLon2Lat(k, 5)[i].data[1] // 赤緯
            Err[i][k] = +bindLon2Lat(k, 5)[i].data[4] // 日出未修正
            // Err[i][k] = +bindLon2Lat(k, 5)[i].data[8] // 晷長未修正
        }
    }
    const RMSE = []
    for (let i = 0; i < List.length; i++) {
        RMSE[i] = rmse(Err[i])
    }
    let Name = []
    Name = Name.concat(List.map(a => NameList[a]))
    const Print = []
    for (let i = 0; i < List.length; i++) {
        Print[i] = Name[i] + '：' + RMSE[i].toFixed(4)
    }
    return Print
}
// console.log(testLon2Lat(['Easthan', 'Yuanjia', 'Daming', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Daming3', 'Shoushi', 'Datong']))