import { AutoLongi2Lati } from './bind_astronomy.mjs'
import {
    MansionNameList,
} from './para_constant.mjs' // 賦值解構
import {
    Bind
} from './bind.mjs'

export const Deg2Mansion = (Accum, DegAccumList, CalName, WinsolsDifRaw, WinsolsDecimal) => { //上元以來積日，距冬至日數，宿度表，曆法名，冬至小分
    const {
        AutoPara
    } = Bind(CalName)
    const {
        SolarRaw,
        WinsolsConst,
        MansionConst,
        MansionRaw
    } = AutoPara[CalName]
    let { Sidereal, Solar } = AutoPara[CalName]
    Sidereal = Sidereal || (Solar || SolarRaw)
    const Mansion = DegAccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    Accum -= WinsolsConst || 0 // 授時要減去氣應？
    let MansionOrder = 0
    let MidstarOrder = 0
    const MansionAccum = parseFloat((((Mansion + (MansionConst || 0) + Accum) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(12))
    for (let j = 1; j <= 28; j++) {
        if (DegAccumList[j] <= MansionAccum && MansionAccum < DegAccumList[j + 1]) {
            MansionOrder = j
            break
        }
    }
    const MansionName = MansionNameList[MansionOrder]
    const MansionDeg = (MansionAccum - DegAccumList[MansionOrder]).toFixed(3)
    const MansionResult = MansionName + MansionDeg
    let MidstarResult = 0
    /////////昏中星/////////               
    // 昬時距午度（卽太陽時角）=Sidereal*半晝漏（單位1日），夜半至昬東行度數=2-夜漏
    // 昏中=昬時距午度+夜半至昬東行度數=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(0.5-夜半漏)*週天-夜半漏（單位1日）
    if (WinsolsDecimal) {
        const Sunrise = AutoLongi2Lati(WinsolsDifRaw, WinsolsDecimal, CalName).Sunrise / 100
        const MidstarRaw = (MansionAccum + (0.525 - Sunrise) * Sidereal - Sunrise + 1 + Sidereal) % Sidereal
        for (let k = 1; k <= 28; k++) {
            if (DegAccumList[k] < MidstarRaw && MidstarRaw < DegAccumList[k + 1]) {
                MidstarOrder = k
                break
            }
        }
        const MidstarName = MansionNameList[MidstarOrder]
        const MidstarDeg = (MidstarRaw - DegAccumList[MidstarOrder]).toFixed(3)
        MidstarResult = MidstarName + MidstarDeg
    }
    return {
        MansionResult,
        MidstarResult
    }
}
// console.log(Deg2Mansion(131536,34 ,[34.15, 144], 'Yuanjia').MansionResult)

// if (Type === 11) {
//     const MansionRaw = parseFloat((((78.8 + AvgRaw) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(14)) // 78.8根據命起和週應而來
// }

export const AutoNewmPlus = (Decimal, CalName) => { // 朔小分
    const {
        Type
    } = Bind(CalName)
    let standard = 0.75
    let NewmPlus = 0
    let Print = ''
    if ((Type >= 7 || CalName === 'Linde') && Type <= 10 && (Decimal >= standard)) {
        NewmPlus = 1
        Print = `<span class='NewmPlus'>+</span>`
    }
    return { NewmPlus, Print }
}

export const AutoNineOrbit = (NodeAccum, WinsolsDif, CalName) => { // 月行九道法
    const {
        Type,
        AutoPara,
    } = Bind(CalName)
    const {
        SolarRaw,
        Node,
        LunarRaw
    } = AutoPara[CalName]
    let {
        Solar,
        Lunar
    } = AutoPara[CalName]
    Lunar = Lunar || LunarRaw
    Solar = Solar || SolarRaw
    const HalfNode = Node / 2
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const HalfTermLeng = Solar / 24
    let Print = ''
    if (Type <= 6) {
        if ((NodeAccum > HalfNode - HalfSynodicNodeDif && NodeAccum < HalfNode) || NodeAccum < HalfSynodicNodeDif || (NodeAccum > HalfNode && NodeAccum < HalfNode + HalfSynodicNodeDif) || (NodeAccum > Node - HalfSynodicNodeDif)) {
            Print = `<span class='lati-yellow'>黃</span>`
        } else if (NodeAccum < HalfNode) {
            Print = `<span class='lati-yang'>陽</span>`
        } else {
            Print = `<span class='lati-yin'>陰</span>`
        }
    } else if (Type >= 7 && Type <= 10) { // 月行九道
        if (WinsolsDif < 3 * HalfTermLeng || WinsolsDif >= 21 * HalfTermLeng) { // 冬
            if (NodeAccum < HalfNode) {
                Print = `<span class='lati-white'>白</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-green'>靑</span><span class='lati-yin'>陰</span>`
            }
        } else if (WinsolsDif >= 3 * HalfTermLeng && WinsolsDif < 9 * HalfTermLeng) {
            if (NodeAccum < HalfNode) {
                Print = `<span class='lati-red'>朱</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-black'>黑</span><span class='lati-yin'>陰</span>`
            }
        } else if (WinsolsDif >= 9 * HalfTermLeng && WinsolsDif < 15 * HalfTermLeng) {
            if (NodeAccum < HalfNode) {
                Print = `<span class='lati-green'>靑</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-white'>白</span><span class='lati-yin'>陰</span>`
            }
        } else {
            if (NodeAccum < HalfNode) {
                Print = `<span class='lati-black'>黑</span><span class='lati-yang'>陽</span>`
            } else {
                Print = `<span class='lati-red'>朱</span><span class='lati-yin'>陰</span>`
            }
        }
        if ((NodeAccum > HalfNode - HalfSynodicNodeDif && NodeAccum < HalfNode) || NodeAccum < HalfSynodicNodeDif) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yang'>陽</span>`
        } else if ((NodeAccum > HalfNode && NodeAccum < HalfNode + HalfSynodicNodeDif) || (NodeAccum > Node - HalfSynodicNodeDif)) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yin'>陰</span>`
        }
    }
    return Print
}