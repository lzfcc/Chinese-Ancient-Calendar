import Para from './para_calendars.mjs'
import { AutoLon2Lat } from './astronomy_bind.mjs'
import { MansionNameList, AutoDegAccumList, EclpLatJiazi } from './para_constant.mjs'
import { AutoMoonAvgV, AutoLightRange } from './para_auto-constant.mjs'
import { LonHigh2Flat, twilight } from './newm_shixian.mjs'

export const Mansion2Deg = (Mansion, AccumList) => (AccumList[MansionNameList.indexOf(Mansion.slice(0, 1))] + +(Mansion.slice(1))).toFixed(4)
// console.log(Mansion2Deg('亢1.15', [0, 0, 12, 9.25, 16], 'Dayan'))
export const Deg2Mansion = (Deg, AccumList, fixed) => {
    Deg = +Deg + 1e-12
    let MansionDeg = 0
    let MansionName = ''
    for (let i = 1; i <= 28; i++) {
        if (Deg >= AccumList[i - 1] && Deg < AccumList[i]) {
            MansionDeg = Deg - AccumList[i - 1]
            MansionName = MansionNameList[i]
            break
        }
    }
    return MansionName + MansionDeg.toFixed(fixed || 3)
}

export const Accum2Mansion = (Accum, AccumList, Name, SolsDif, SolsDeci, year) => { //上元以來積日，宿度表，曆法名，距冬至日數，冬至小分
    const { Type, SolarRaw, SolsConst, MansionConst, MansionRaw } = Para[Name]
    let { Sidereal, Solar } = Para[Name]
    Sidereal = Sidereal || (Solar || SolarRaw)
    if (Name === 'Shoushi' || Name === 'Shoushi2') {
        Sidereal += +(~~((year - 1280) / 100) * .0001).toFixed(4) // 方向和歲實消長反的
    } // 置中積，以加周應爲通積，滿周天分，（上推往古，每百年消一；下算將來，每百年長一。）去之，不盡，以日周約之爲度，不滿，退約爲分秒。命起赤道虛宿六度外，去之，至不滿宿，卽所求天正冬至加時日𨇠赤道宿度及分秒。（上考者，以周應減中積，滿周天，去之；不盡，以減周天，餘以日周約之爲度；餘同上。如當時有宿度者，止依當時宿度命之。） // 試了一下，按上面這樣區分1281前後，沒有任何變化
    const OriginDeg = AccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    Accum -= Type === 11 ? SolsConst : 0
    Accum += MansionConst || 0
    const Deg = ((OriginDeg + Accum) % Sidereal + Sidereal + 1e-12) % Sidereal
    const Mansion = Deg2Mansion(Deg, AccumList)
    /////////昏中《中》頁326
    // 昬時距午度（卽太陽時角）=Sidereal*半晝漏（單位1日），夜半至昬東行度數=2-夜漏=1-(Rise-LightRange)，夜半至明東行度數=Rise-LightRange
    // 昏中=昬時距午度+夜半至昬東行度數=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(.5-夜半漏)*週天-夜半漏（單位1日）
    let MorningDuskstar = ``
    const LightRange = AutoLightRange(Name)
    if (SolsDeci >= 0) { // 一個小坑，四分曆存在SolsDeci===0的情況，所以要加上>=0，只保留undefined
        const Rise = AutoLon2Lat(SolsDif, SolsDeci, Name).Rise / 100
        const HalfLight = .5 - Rise + LightRange // 半晝漏
        const HalfNight = Rise - LightRange
        // 大衍只考慮了昬時距午度
        const MorningstarDeg = (Deg + Sidereal * (1 - HalfLight) + (Type === 7 ? 0 : HalfNight)) % Sidereal
        const DuskstarDeg = (Deg + Sidereal * HalfLight + (Type === 7 ? 0 : 1 - HalfNight)) % Sidereal
        const Duskstar = Deg2Mansion(DuskstarDeg, AccumList, 1)
        const Morningstar = Deg2Mansion(MorningstarDeg, AccumList, 1)
        MorningDuskstar = Morningstar + ' ' + Duskstar
    }
    return { Mansion, MorningDuskstar }
}
// console.log(Accum2Mansion(131536, 34, 'Yuanjia', 34.15).Mansion)

// if (Type === 11) {
//     const MansionRaw = parseFloat((((78.8 + AvgRaw) % Sidereal + Sidereal) % Sidereal + .0000001).toPrecision(14)) // 78.8根據命起和週應而來
// }
// 以下是西曆日躔：
export const Gong2Mansion = (Name, Y, EclpGong, Tod, Morrow, Rise) => {
    const { Solar, MansionConst, Sobliq, BjLat } = Para[Name]
    const { EclpAccumList, EquaAccumList } = AutoDegAccumList(Name, Y)
    let EclpMansion = '', EquaMansion = '', DuskstarPrint = ''
    if (EclpGong !== false) { // 如果false就只算昏旦中星
        const Precession = 51 / 3600 * (Y - 1684) // 第谷歲差
        const EclpMansionGong = (EclpGong - Precession + MansionConst + 360) % 360
        const EquaMansionGong = (LonHigh2Flat(Sobliq, EclpMansionGong) + 360) % 360
        EclpMansion = Deg2Mansion((EclpMansionGong * Solar / 360 + Solar) % Solar, EclpAccumList)
        EquaMansion = Deg2Mansion((EquaMansionGong * Solar / 360 + Solar) % Solar, EquaAccumList)
    }
    if (Tod) {
        const SunVd = Morrow - Tod
        const Twilight = twilight(Sobliq, BjLat, (Tod + SunVd / 2 + 270) % 360)
        const MorningstarGong = Tod + (Rise - Twilight) * SunVd - (.5 - Rise + Twilight) * 360
        const DuskstarGong = Tod + (1 - Rise + Twilight) * SunVd + (.5 - Rise + Twilight) * 360
        const Morningstar = Deg2Mansion(((MorningstarGong + MansionConst) * (Solar / 360) + Solar) % Solar, EquaAccumList, 1)
        const Duskstar = Deg2Mansion(((DuskstarGong + MansionConst) * (Solar / 360) + Solar) % Solar, EquaAccumList, 1)
        DuskstarPrint = Morningstar + ' ' + Duskstar
    }
    return { EclpMansion, EquaMansion, DuskstarPrint }
}
// console.log(Gong2Mansion('Guimao', 1684, 0))

export const LeapAdjust = (LeapNumTerm, TermAvgRaw, NewmInt, Name) => {
    const { isNewmPlus } = Para[Name]
    let Plus = 3.75 // 若不用進朔，需要改成3.75
    if (isNewmPlus) {
        Plus = 2.75
        if (['Wuji', 'Tsrengyuan'].includes(Name)) {
            Plus = 3
        }
    }
    while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + Plus)) { // 原來是LeapNumTerm >= 2,<=11
        LeapNumTerm--
    }
    while (LeapNumTerm <= 12 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - Plus)) {
        LeapNumTerm++
    }
    return LeapNumTerm
}

export const AutoNewmPlus = (Deci, SolsDif, SolsDeci, Name) => { // 朔小分
    const { Solar } = Para[Name]
    const Solar25 = Solar / 4
    const SpringequinoxSunrise = AutoLon2Lat(Solar25, SolsDeci, Name).Rise / 100
    let { Rise, Sunrise1 } = AutoLon2Lat(SolsDif, SolsDeci, Name)
    Rise = (Sunrise1 || Rise) / 100
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
    } else if (SolsDif > Solar25 && SolsDif < Solar * .75) {
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
// console.log( AutoNewmPlus (.75, 191, .9, 'LindeA') )

export const AutoSyzygySub = (Deci, SolsDif, SolsDeci, Name) => {
    const { Type } = Para[Name]
    const LightRange = AutoLightRange(Name)
    const Rise = AutoLon2Lat(SolsDif, SolsDeci, Name).Rise / 100
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

export const AutoNineOrbit = (NodeAccum, SolsDif, Name) => { // 月行九道法
    const { Type, SolarRaw, Node, LunarRaw } = Para[Name]
    let { Solar, Lunar
    } = Para[Name]
    Lunar = Lunar || LunarRaw
    Solar = Solar || SolarRaw
    const Node50 = Node / 2
    const SynodicNodeDif50 = (Lunar - Node) / 2 // 望差
    const HalfTermLeng = Solar / 24
    SolsDif += (Node - NodeAccum) * AutoMoonAvgV(Name) // 正交黃道度
    let Print = ''
    if (Type <= 6) {
        if ((NodeAccum > Node50 - SynodicNodeDif50 && NodeAccum < Node50) || NodeAccum < SynodicNodeDif50 || (NodeAccum > Node50 && NodeAccum < Node50 + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span>`
        } else if (NodeAccum < Node50) {
            Print = `<span class='lati-yang'>陽</span>`
        } else Print = `<span class='lati-yin'>陰</span>`
    } else if (Type >= 7 && Type <= 10) { // 月行九道
        if (SolsDif < 3 * HalfTermLeng || SolsDif >= 21 * HalfTermLeng) { // 冬
            if (NodeAccum < Node50) {
                Print = `<span class='lati-white'>白</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-green'>靑</span><span class='lati-yin'>陰</span>`
        } else if (SolsDif >= 3 * HalfTermLeng && SolsDif < 9 * HalfTermLeng) {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-red'>朱</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-black'>黑</span><span class='lati-yin'>陰</span>`
        } else if (SolsDif >= 9 * HalfTermLeng && SolsDif < 15 * HalfTermLeng) {
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