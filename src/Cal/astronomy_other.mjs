import { AutoLongi2Lati } from './bind_astronomy.mjs'
import { MansionNameList } from './para_constant.mjs' // 賦值解構
import { AutoMoonAvgV, AutoLightRange } from './para_auto-constant.mjs'
import { Bind } from './bind.mjs'

export const Deg2Mansion = (MansionAccum, DegAccumList) => {
    let MansionOrder = 0
    MansionAccum = +MansionAccum + 1e-12
    for (let j = 1; j <= 28; j++) {
        if (DegAccumList[j] <= MansionAccum && MansionAccum < DegAccumList[j + 1]) {
            MansionOrder = j
            break
        }
    }
    const MansionName = MansionNameList[MansionOrder]
    const MansionDeg = (MansionAccum - DegAccumList[MansionOrder]).toFixed(4)
    return MansionName + MansionDeg
}

export const Mansion2Deg = (Mansion, DegAccumList) => (DegAccumList[MansionNameList.indexOf(Mansion.slice(0, 1))] + +(Mansion.slice(1))).toFixed(4)
// console.log(Mansion2Deg('亢1.15', [0, 0, 12, 9.25, 16], 'Dayan'))

export const Accum2Mansion = (Accum, DegAccumList, CalName, WinsolsDifRaw, WinsolsDeci) => { //上元以來積日，距冬至日數，宿度表，曆法名，冬至小分
    const { AutoPara, Type } = Bind(CalName)
    const { SolarRaw, WinsolsCorr, MansionCorr, MansionRaw } = AutoPara[CalName]
    let { Sidereal, Solar } = AutoPara[CalName]
    Sidereal = Sidereal || (Solar || SolarRaw)
    const Mansion = DegAccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    Accum -= Type === 11 ? WinsolsCorr : 0
    let MansionOrder = 0
    const MansionAccum = ((Mansion + (MansionCorr || 0) + Accum) % Sidereal + Sidereal + 1e-12) % Sidereal
    for (let j = 1; j <= 28; j++) {
        if (DegAccumList[j] <= MansionAccum && MansionAccum < DegAccumList[j + 1]) {
            MansionOrder = j
            break
        }
    }
    const MansionName = MansionNameList[MansionOrder]
    const MansionDeg = (MansionAccum - DegAccumList[MansionOrder]).toFixed(3)
    const MansionResult = MansionName + MansionDeg
    /////////昏中《中》頁326
    // 昬時距午度（卽太陽時角）=Sidereal*半晝漏（單位1日），夜半至昬東行度數=2-夜漏=1-(Rise-LightRange)，夜半至明東行度數=Rise-LightRange
    // 昏中=昬時距午度+夜半至昬東行度數=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(0.5-夜半漏)*週天-夜半漏（單位1日）
    let DuskstarResult = ''
    const LightRange = AutoLightRange(CalName)
    if (WinsolsDeci >= 0) { // 一個小坑，四分曆存在WinsolsDeci===0的情況，所以要加上>=0，只保留undefined
        let DuskstarOrder = 0
        let MorningstarOrder = 0
        const Rise = AutoLongi2Lati(WinsolsDifRaw, WinsolsDeci, CalName).Rise / 100
        const HalfLight = 0.5 - Rise + LightRange // 半晝漏
        const HalfNight = Rise - LightRange
        // 大衍只考慮了昬時距午度
        const MorningstarRaw = (MansionAccum + Sidereal * (1 - HalfLight) + (Type === 7 ? 0 : HalfNight)) % Sidereal
        const DuskstarRaw = (MansionAccum + Sidereal * HalfLight + (Type === 7 ? 0 : 1 - HalfNight)) % Sidereal
        for (let k = 1; k <= 28; k++) {
            if (DegAccumList[k] < DuskstarRaw && DuskstarRaw < DegAccumList[k + 1]) {
                DuskstarOrder = k
                break
            }
        }
        for (let k = 1; k <= 28; k++) {
            if (DegAccumList[k] < MorningstarRaw && MorningstarRaw < DegAccumList[k + 1]) {
                MorningstarOrder = k
                break
            }
        }
        const DuskstarName = MansionNameList[DuskstarOrder]
        const DuskstarDeg = (DuskstarRaw - DegAccumList[DuskstarOrder]).toFixed(3)
        const MorningstarName = MansionNameList[MorningstarOrder]
        const MorningstarDeg = (MorningstarRaw - DegAccumList[MorningstarOrder]).toFixed(3)
        DuskstarResult = `${MorningstarName}${MorningstarDeg}
${DuskstarName}${DuskstarDeg}`
    }
    return { MansionOrder, MansionResult, DuskstarResult }
}
// console.log(Accum2Mansion(131536,34 ,'Yuanjia',34.15).MansionResult)

// if (Type === 11) {
//     const MansionRaw = parseFloat((((78.8 + AvgRaw) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(14)) // 78.8根據命起和週應而來
// }

export const LeapAdjust = (LeapNumTerm, TermAvgRaw, NewmInt, CalName) => {
    const isNewmPlus = Bind(CalName)
    let Plus = 3.5 // 若不用進朔，需要改成3.5
    if (isNewmPlus) {
        Plus = 2.75
        if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            Plus = 3
        }
    }
    while (LeapNumTerm >= 2 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + Plus)) {
        LeapNumTerm--
    }
    while (LeapNumTerm <= 11 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - Plus)) {
        LeapNumTerm++
    }
    return LeapNumTerm
}

export const AutoNewmPlus = (Deci, WinsolsDifRaw, WinsolsDeci, CalName) => { // 朔小分
    const { AutoPara } = Bind(CalName)
    const { Solar } = AutoPara[CalName]
    const Solar25 = Solar / 4
    const SpringequinoxSunrise = AutoLongi2Lati(Solar25, WinsolsDeci, CalName).Rise / 100
    let { Rise, Sunrise1 } = AutoLongi2Lati(WinsolsDifRaw, WinsolsDeci, CalName)
    Rise = (Sunrise1 || Rise) / 100
    const LightRange = AutoLightRange(CalName)
    let standard = 0.75
    let Portion = 3 // 明天、紀元這樣，其他宋曆應該也差不多。夏至0.734 為什麼跟前面是相反的？
    if (CalName === 'Xuanming') {
        Portion = 5 // 夏至0.7405
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        Portion = 2 // 夏至0.726
    }
    if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
        standard = 1.1 - Rise + LightRange
    } else if (CalName === 'Chongxuan') {
        standard = Math.max(0.725, 1 - Rise + LightRange)
    } else if (['LindeB', 'Dayan', 'Qintian', 'Chongtian'].includes(CalName)) { // 欽天日入後則進一日
        standard = 1 - Rise // 冬至0.7，夏至0.8
    } else if (WinsolsDifRaw > Solar25 && WinsolsDifRaw < Solar * 0.75) {
        standard = 0.75 + (Rise - SpringequinoxSunrise) / Portion
    }
    let NewmPlus = 0
    let Print = ''
    if (Deci >= standard) {
        NewmPlus = 1
        Print = `<span class='NewmPlus'>+</span>`
    }
    return { NewmPlus, Print }
}
// console.log( AutoNewmPlus (0.75, 191, 0.9, 'LindeA') )

export const AutoSyzygySub = (Deci, WinsolsDifRaw, WinsolsDeci, CalName) => {
    const { Type } = Bind(CalName)
    const LightRange = AutoLightRange(CalName)
    const Rise = AutoLongi2Lati(WinsolsDifRaw, WinsolsDeci, CalName).Rise / 100
    let standard = Rise - LightRange
    if (Type >= 8 || CalName === 'Qintian') {
        standard = Rise
    }
    let SyzygySub = 0
    let Print = ''
    if (Deci < standard) { // 晨前刻、晨初餘數
        SyzygySub = -1
        Print = `<span class='NewmPlus'>-</span>`
    }
    return { SyzygySub, Print }
}

export const AutoNineOrbit = (NodeAccum, WinsolsDifRaw, CalName) => { // 月行九道法
    const { Type, AutoPara } = Bind(CalName)
    const { SolarRaw, Node, LunarRaw } = AutoPara[CalName]
    let { Solar, Lunar
    } = AutoPara[CalName]
    Lunar = Lunar || LunarRaw
    Solar = Solar || SolarRaw
    const Node50 = Node / 2
    const SynodicNodeDif50 = (Lunar - Node) / 2 // 望差
    const HalfTermLeng = Solar / 24
    const WinsolsDif = WinsolsDifRaw + (Node - NodeAccum) * AutoMoonAvgV(CalName) // 正交黃道度
    let Print = ''
    if (Type <= 6) {
        if ((NodeAccum > Node50 - SynodicNodeDif50 && NodeAccum < Node50) || NodeAccum < SynodicNodeDif50 || (NodeAccum > Node50 && NodeAccum < Node50 + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span>`
        } else if (NodeAccum < Node50) {
            Print = `<span class='lati-yang'>陽</span>`
        } else {
            Print = `<span class='lati-yin'>陰</span>`
        }
    } else if (Type >= 7 && Type <= 10) { // 月行九道
        if (WinsolsDif < 3 * HalfTermLeng || WinsolsDif >= 21 * HalfTermLeng) { // 冬
            if (NodeAccum < Node50) {
                Print = `<span class='lati-white'>白</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-green'>靑</span><span class='lati-yin'>陰</span>`
            }
        } else if (WinsolsDif >= 3 * HalfTermLeng && WinsolsDif < 9 * HalfTermLeng) {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-red'>朱</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-black'>黑</span><span class='lati-yin'>陰</span>`
            }
        } else if (WinsolsDif >= 9 * HalfTermLeng && WinsolsDif < 15 * HalfTermLeng) {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-green'>靑</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-white'>白</span><span class='lati-yin'>陰</span>`
            }
        } else {
            if (NodeAccum < Node50) {
                Print = `<span class='lati-black'>黑</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-red'>朱</span><span class='lati-yin'>陰</span>`
            }
        }
        if ((NodeAccum > Node50 - SynodicNodeDif50 && NodeAccum < Node50) || NodeAccum < SynodicNodeDif50) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yang'>陽</span>`
        } else if ((NodeAccum > Node50 && NodeAccum < Node50 + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yin'>陰</span>`
        }
    }
    return Print
}

const Exhaustion = () => { // 大同歲實365.2469 設在0.015-0.018之間。365.262566
    let Sidereal = 365.2579
    let Print = ''
    while (Sidereal < 365.2689) {
        Sidereal = +(Sidereal + 0.000001).toFixed(6)
        const Solar = 365 + 9681 / 39616
        const Accum = Solar * 1025699
        const MansionAccum = (121.2599 + Accum) % Sidereal
        // const DuskstarRaw = (MansionAccum + 0.225 * Sidereal + 0.7) % Sidereal
        if (MansionAccum >= 87 && MansionAccum < 87.9) {
            // if (DuskstarRaw >= 183.2599 && DuskstarRaw < 184.2499) {
            Print += ',' + Sidereal // + ':' + MansionAccum}
            // }
        }
        return Print
    }
}
// console.log(Exhaustion())