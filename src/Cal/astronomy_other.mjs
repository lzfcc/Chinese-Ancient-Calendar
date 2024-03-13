import Para from './para_calendars.mjs'
import { autoEquaEclp, autoRise } from './astronomy_bind.mjs'
import { MansionNameList, AutoDegAccumList } from './para_constant.mjs'
import { AutoMoonAvgV, AutoLightRange } from './para_auto-constant.mjs'
import { GongHigh2Flat, LonHigh2Flat, twilight } from './newm_shixian.mjs'

export const Mansion2Deg = (Mansion, AccumList) => +(AccumList[MansionNameList.indexOf(Mansion.slice(0, 1))] + +Mansion.slice(1)).toFixed(10)
export const Deg2Mansion = (Deg, AccumList, fixed) => {
    Deg = +Deg + 1e-12
    let MansionDeg = 0
    let MansionName = ''
    for (let i = 1; i <= 28; i++) {
        if (Deg >= AccumList[i] && Deg < AccumList[i + 1]) {
            MansionDeg = Deg - AccumList[i]
            MansionName = MansionNameList[i]
            break
        }
    }
    return MansionName + MansionDeg.toFixed(fixed || 3)
}
/**
 * 20240312改寫，增加黃道宿度
 * @param {*} Name 曆法名
 * @param {*} Y 冬至小分
 * @param {*} EclpGong 距冬至黃道實行度。有它就是有太陽盈縮積算法的
 * @param {*} Sd 距冬至時間。有它就是沒有太陽盈縮積算法的，與上面二選一。
 * @param {*} SolsDeci 公元年
 * @returns 
 */
export const gong2Mansion = (Name, Y, EclpGong, Sd, SolsDeci) => {
    const { Type, SolarRaw, MansionConst, MansionRaw, OriginAd, CloseOriginAd } = Para[Name]
    let { Sidereal, Solar } = Para[Name]
    const isPrecession = Sidereal ? true : false // 有歲差的曆法
    const { EclpAccumList, EquaAccumList } = AutoDegAccumList(Name, Y)
    Sidereal = Sidereal || (Solar || SolarRaw)
    const OriginYear = Y - (OriginAd || CloseOriginAd)
    const OriginYear1 = OriginYear + 1
    if (Name === 'Shoushi' || Name === 'Shoushi2') {
        Sidereal += +(~~(OriginYear1 / 100) * .0001).toFixed(4) // 方向和歲實消長反的
        Solar = parseFloat((SolarRaw - (~~(OriginYear1 / 100) / 10000)).toPrecision(10))
    } // 置中積，以加周應爲通積，滿周天分，（上推往古，每百年消一；下算將來，每百年長一。）去之，不盡，以日周約之爲度，不滿，退約爲分秒。命起赤道虛宿六度外，去之，至不滿宿，卽所求天正冬至加時日𨇠赤道宿度及分秒。（上考者，以周應減中積，滿周天，去之；不盡，以減周天，餘以日周約之爲度；餘同上。如當時有宿度者，止依當時宿度命之。） // 試了一下，按上面這樣區分1281前後，沒有任何變化
    const OriginDeg = EquaAccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    //////// 黃道度
    const OriginAccum = OriginYear * Solar + (MansionConst || 0)
    const SolsDeg = isPrecession ? ((OriginAccum + OriginDeg) % Sidereal + Sidereal) % Sidereal : OriginDeg // 赤道冬至。算例參《古曆新探》p85
    const SolsMansion = Deg2Mansion(SolsDeg, EquaAccumList, 10)
    const SolsMansionName = SolsMansion.slice(0, 1)
    const SolsMansionDeg = +SolsMansion.slice(1)
    const SolsEclpMansionDeg = autoEquaEclp(SolsMansionDeg, Name).Equa2Eclp // 根據《太陽通軌》（《明大統曆法彙編》p128），直接用冬至赤道宿度（例如在箕5，即用5）赤轉黃即冬至黃道宿度。又如紀元曆「求天正冬至加時黃道日度」：「以冬至加時赤道日度及分秒，減一百一度⋯⋯」就是指這個5
    const SolsEclpDeg = Mansion2Deg(SolsMansionName + SolsEclpMansionDeg, EclpAccumList)
    let EclpDeg = 0, EquaDeg = 0
    if (Type >= 5) {
        EclpDeg = (SolsEclpDeg + EclpGong) % Sidereal // 太陽改正所得就是黃道度，此處不要赤轉黃
        EquaDeg = (SolsDeg + autoEquaEclp(EclpGong, Name).Eclp2Equa) % Sidereal
    } else { // 沒有盈縮積的曆法
        EquaDeg = (SolsDeg + Sd) % Sidereal
        EclpDeg = (SolsEclpDeg + autoEquaEclp(Sd, Name).Equa2Eclp) % Sidereal
    }
    const Mansion = Deg2Mansion(EquaDeg, EquaAccumList)
    const EclpMansion = Deg2Mansion(EclpDeg, EclpAccumList)
    /////////昏中《中》頁326
    // 昬時距午度（卽太陽時角）=Sidereal*半晝漏（單位1日），夜半至昬東行度數=2-夜漏=1-(Rise-LightRange)，夜半至明東行度數=Rise-LightRange
    // 昏中=昬時距午度+夜半至昬東行度數=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(.5-夜半漏)*週天-夜半漏（單位1日）
    let MorningDuskstar = ''
    const LightRange = AutoLightRange(Name)
    if (SolsDeci >= 0) { // 一個小坑，四分曆存在SolsDeci===0的情況，所以要加上>=0，只保留undefined
        const Rise = autoRise(Sd, SolsDeci, Name) / 100
        const HalfLight = .5 - Rise + LightRange // 半晝漏
        const HalfNight = Rise - LightRange
        // 大衍只考慮了昬時距午度
        const MorningstarDeg = (EquaDeg + Sidereal * (1 - HalfLight) + (Type === 7 ? 0 : HalfNight)) % Sidereal
        const DuskstarDeg = (EquaDeg + Sidereal * HalfLight + (Type === 7 ? 0 : 1 - HalfNight)) % Sidereal
        const Duskstar = Deg2Mansion(DuskstarDeg, EquaAccumList, 2)
        const Morningstar = Deg2Mansion(MorningstarDeg, EquaAccumList, 2)
        MorningDuskstar = Morningstar + ' ' + Duskstar
    }
    return { Mansion, EclpMansion, MorningDuskstar }
}
// console.log(gong2Mansion(318 * 365.2422, AutoDegAccumList('Shoushi', 1599).EquaAccumList, 'Shoushi', 0, 0, 1599).Mansion)
// if (Type === 11) {
//     const MansionRaw = parseFloat((((78.8 + AvgRaw) % Sidereal + Sidereal) % Sidereal + .0000001).toPrecision(14)) // 78.8根據命起和週應而來
// }
/**
 * 西曆日躔
 * @param {*} Name 
 * @param {*} Y 
 * @param {*} Gong 
 * @param {*} fixed 保留小數點幾位
 * @param {*} isEqua true:EclpGong是赤道度
 * @returns 
 */
export const gong2MansionQing = (Name, Y, Gong, fixed, isEqua) => {
    const { StarVy, Sobliq, Solar, MansionConst, CloseOriginAd, MansionOriginAd } = Para[Name]
    const { EclpAccumList, EquaAccumList } = AutoDegAccumList(Name, Y)
    const p = Solar / 360
    const Precession = StarVy * (Y - (MansionOriginAd || CloseOriginAd))
    const SolsDeg = MansionConst - Precession // 冬至黃道
    // 此處照抄古曆，只是黃赤互換
    const SolsMansion = Deg2Mansion(SolsDeg, EclpAccumList, 10)
    const SolsMansionName = SolsMansion.slice(0, 1)
    const SolsMansionDeg = +SolsMansion.slice(1)
    const SolsEquaMansionDeg = GongHigh2Flat(Sobliq, SolsMansionDeg)
    const SolsEquaDeg = Mansion2Deg(SolsMansionName + SolsEquaMansionDeg, EquaAccumList)
    let EclpMansionGong = 0, EquaMansionGong = 0
    if (isEqua) {
        EquaMansionGong = SolsEquaDeg + Gong
        // EquaMansionGong = GongHigh2Flat(Sobliq, SolsDeg) + Gong
    } else {
        EclpMansionGong = SolsDeg + Gong
        EquaMansionGong = SolsEquaDeg + GongHigh2Flat(Sobliq, Gong)
        // 這是以前的步驟
        // EquaMansionGong = GongHigh2Flat(Sobliq, SolsDeg) + GongHigh2Flat(Sobliq, Gong)
    }
    return {
        Eclp: Deg2Mansion((EclpMansionGong / p + Solar) % Solar, EclpAccumList, fixed),
        Equa: Deg2Mansion((EquaMansionGong / p + Solar) % Solar, EquaAccumList, fixed)
    }
}
// console.log(gong2MansionQing('Guimao', 5000, 30, 2))
export const Lon2Midstar = (Name, Y, LonTod, LonMor, Rise) => {
    const { StarVy, Solar, MansionConst, Sobliq, RiseLat, CloseOriginAd, MansionOriginAd } = Para[Name]
    const { EquaAccumList } = AutoDegAccumList(Name, Y)
    const Precession = StarVy * (Y - (MansionOriginAd || CloseOriginAd))
    const EquaMansionGongTod = GongHigh2Flat(Sobliq, LonTod + 90 - Precession + MansionConst)
    const SunVd = LonMor - LonTod
    const SunEquaVd = LonHigh2Flat(Sobliq, LonMor) - LonHigh2Flat(Sobliq, LonTod)
    const Twilight = twilight(Sobliq, RiseLat, (LonTod + SunVd / 2) % 360)
    const MorningstarTmp = (Rise - Twilight) * SunEquaVd - (.5 - Rise + Twilight) * 360 // 考成上編中星時刻法沒有考慮地球公轉
    const DuskstarTmp = (1 - Rise + Twilight) * SunEquaVd + (.5 - Rise + Twilight) * 360
    const Morningstar = Deg2Mansion(((EquaMansionGongTod + MorningstarTmp) * (Solar / 360) + Solar) % Solar, EquaAccumList, 2)
    const Duskstar = Deg2Mansion(((EquaMansionGongTod + DuskstarTmp) * (Solar / 360) + Solar) % Solar, EquaAccumList, 2)
    return { Morningstar, Duskstar }
}
// console.log(gong2MansionQing('Guimao', 1684, 0))

export const LeapAdjust = (LeapNumTerm, TermAvgRaw, NewmInt, Name) => {
    const { isNewmPlus } = Para[Name]
    let Plus = 3.75 // 若不用進朔，需要改成3.75
    if (isNewmPlus) {
        Plus = 2.75
        if (['Wuji', 'Tsrengyuan'].includes(Name)) Plus = 3
    }
    while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + Plus)) { // 原來是LeapNumTerm >= 2,<=11
        LeapNumTerm--
    }
    while (LeapNumTerm <= 12 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - Plus)) {
        LeapNumTerm++
    }
    return LeapNumTerm
}

export const AutoNewmPlus = (Deci, Sd, SolsDeci, Name) => { // 朔小分
    const { Solar } = Para[Name]
    const Solar25 = Solar / 4
    const SpringequinoxSunrise = autoRise(Solar25, 0, Name) / 100
    const Rise = autoRise(Sd, SolsDeci, Name) / 100
    const LightRange = AutoLightRange(Name)
    let standard = .75
    let Portion = 3 // 明天、紀元這樣，其他宋曆應該也差不多。夏至0.734 為什麼跟前面是相反的？
    if (Name === 'Xuanming') {
        Portion = 5 // 夏至0.7405
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        Portion = 2 // 夏至0.726
    }
    if (['Wuji', 'Tsrengyuan'].includes(Name)) {
        standard = 1.1 - Rise + LightRange
    } else if (Name === 'Chongxuan') {
        standard = Math.max(.725, 1 - Rise + LightRange)
    } else if (['LindeB', 'Dayan', 'Qintian', 'Chongtian'].includes(Name)) { // 欽天日入後則進一日
        standard = 1 - Rise // 冬至0.7，夏至0.8
    } else if (Sd > Solar25 && Sd < Solar * .75) {
        standard = .75 + (Rise - SpringequinoxSunrise) / Portion
    }
    let NewmPlus = 0
    let Print = ''
    if (Deci >= standard) {
        NewmPlus = 1
        Print = `<span class='NewmPlus'>+</span>`
    }
    return { NewmPlus, Print }
}
// console.log( AutoNewmPlus (.75, 191, .9, 'Linde') )

export const AutoSyzygySub = (Deci, Sd, SolsDeci, Name) => {
    const { Type } = Para[Name]
    const LightRange = AutoLightRange(Name)
    const Rise = autoRise(Sd, SolsDeci, Name) / 100
    let standard = Rise - LightRange
    if (Type >= 8 || Name === 'Qintian') standard = Rise
    let SyzygySub = 0
    let Print = ''
    if (Deci < standard) { // 晨前刻、晨初餘數
        SyzygySub = -1
        Print = `<span class='NewmPlus'>-</span>`
    }
    return { SyzygySub, Print }
}

export const AutoNineOrbit = (NodeAccum, Sd, Name) => { // 月行九道法
    const { Type, SolarRaw, Node, LunarRaw } = Para[Name]
    let { Solar, Lunar
    } = Para[Name]
    Lunar = Lunar || LunarRaw
    Solar = Solar || SolarRaw
    const Node50 = Node / 2
    const SynodicNodeDif50 = (Lunar - Node) / 2 // 望差
    const HalfTermLeng = Solar / 24
    Sd += (Node - NodeAccum) * AutoMoonAvgV(Name) // 正交黃道度
    let Print = ''
    if (Type <= 6) {
        if ((NodeAccum > Node50 - SynodicNodeDif50 && NodeAccum < Node50) || NodeAccum < SynodicNodeDif50 || (NodeAccum > Node50 && NodeAccum < Node50 + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span>`
        } else if (NodeAccum < Node50) {
            Print = `<span class='lati-yang'>陽</span>`
        } else Print = `<span class='lati-yin'>陰</span>`
    } else if (Type >= 7 && Type <= 10) { // 月行九道
        if (Sd < 3 * HalfTermLeng || Sd >= 21 * HalfTermLeng) { // 冬
            if (NodeAccum < Node50) {
                Print = `<span class='lati-white'>白</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-green'>靑</span><span class='lati-yin'>陰</span>`
        } else if (Sd >= 3 * HalfTermLeng && Sd < 9 * HalfTermLeng) {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-red'>朱</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-black'>黑</span><span class='lati-yin'>陰</span>`
        } else if (Sd >= 9 * HalfTermLeng && Sd < 15 * HalfTermLeng) {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-green'>靑</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-white'>白</span><span class='lati-yin'>陰</span>`
        } else {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-black'>黑</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-red'>朱</span><span class='lati-yin'>陰</span>`
        }
        if ((NodeAccum > Node50 - SynodicNodeDif50 && NodeAccum < Node50) || NodeAccum < SynodicNodeDif50) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yang'>陽</span>`
        } else if ((NodeAccum > Node50 && NodeAccum < Node50 + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yin'>陰</span>`
        }
    }
    return Print
}

const Exhaustion = () => { // 大同歲實365.2469 設在0.015-.018之間。365.262566
    let Sidereal = 365.2579
    let Print = ''
    while (Sidereal < 365.2689) {
        Sidereal = +(Sidereal + .000001).toFixed(6)
        const Solar = 365 + 9681 / 39616
        const Accum = Solar * 1025699
        const Deg = (121.2599 + Accum) % Sidereal
        // const DuskstarDeg = (Deg + .225 * Sidereal + .7) % Sidereal
        if (Deg >= 87 && Deg < 87.9) {
            // if (DuskstarDeg >= 183.2599 && DuskstarDeg < 184.2499) {
            Print += ',' + Sidereal // + ':' + Deg}
            // }
        }
        return Print
    }
}
// console.log(Exhaustion())