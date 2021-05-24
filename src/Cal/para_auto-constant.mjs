import { Bind } from './bind.mjs'

export const AutoSolar = CalName => {
    let Solar = 0
    if (CalName === 'Chongxuan') {
        Solar = 365.2445
    } else if (CalName === 'Yitian') {
        Solar = 365.24455
    } else if (CalName === 'Chongtian') { // 崇天用了24 28兩個値
        Solar = 365.24
    } else if (CalName === 'Mingtian') {
        Solar = 365.24
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    } else {
        const { AutoPara } = Bind(CalName)
        Solar = +(AutoPara[CalName].Solar).toFixed(4)
    }
    return Solar
}

export const AutoSidereal = CalName => {
    let Sidereal = 0
    if (CalName === 'Chongxuan') {
        Sidereal = 365.2548
    } else if (CalName === 'Yitian') {
        Sidereal = 365.24455
    } else if (['Dayan', 'Chongtian'].includes(CalName)) { // 崇天用了365.25 .27兩個値
        Sidereal = 365.25
    } else if (CalName === 'Mingtian') {
        Sidereal = 365.24
    } else if (['Guantian', 'Fengyuan', 'Zhantian', 'Jiyuan'].includes(CalName)) {
        Sidereal = 365.2436
    } else {
        const { AutoPara } = Bind(CalName)
        Sidereal = +(AutoPara[CalName].Sidereal).toFixed(4)
    }
    return Sidereal
}
// console.log(AutoSidereal('Xuanming'))

export const AutoMoonAvgV = CalName => { // 陳美東《月離表初探》
    const { AutoPara, Type
    } = Bind(CalName)
    let MoonAvgVDeg = 0
    if (CalName === 'Daye') {
        MoonAvgVDeg = 548.101486 / 41
    } else if (['WuyinA', 'WuyinB'].includes(CalName)) {
        MoonAvgVDeg = 13.36834319526627 // parseFloat((Solar / Lunar + 1).toPrecision(14))
    } else if (CalName === 'Huangji') {
        MoonAvgVDeg = 695 / 52
    } else if (CalName === 'Xuanming') {
        MoonAvgVDeg = 1123 / 84
    } else if (CalName === 'Chongxuan') {
        MoonAvgVDeg = 13 + 7 / 19
    } else if (CalName === 'Mingtian' || Type === 11) {
        MoonAvgVDeg = 13.36875 // 約分。13+29913000/81120000
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(CalName) || Type === 10) {
        MoonAvgVDeg = 13.37
    } else if (CalName === 'Chongtian') {
        MoonAvgVDeg = 909 / 68
    } else if (CalName === 'Jiyuan') {
        MoonAvgVDeg = 7290 / 545.3
    } else { // 崇天909/68=13.3676470588 紀元：7290/545.3=13.3687878232，按照公式=13.3687753161
        const { Sidereal, Solar, Lunar, LunarRaw
        } = AutoPara[CalName]
        MoonAvgVDeg = parseFloat(((Sidereal || Solar) / (Lunar || LunarRaw) + 1).toPrecision(14))
    }
    return MoonAvgVDeg
}

export const AutoNodeCycle = CalName => {
    let NodeCycle = 363.7934 // 授時
    if (CalName === 'Yingtian') { // 乾元儀天沒說
        NodeCycle = 363.828307
    } else if (['Chongtian', 'Guantian', 'Tongyuan', 'Chunxi'].includes(CalName)) {
        NodeCycle = 363.76
    } else if (CalName === 'Mingtian') {
        NodeCycle = 365.2564 // sidereal約餘
    } else if (['Jiyuan', 'Kaixi'].includes(CalName)) {
        NodeCycle = 363.7944
    } else if (CalName === 'Qiandao') {
        NodeCycle = 363.7940
    } else if (CalName === 'Huiyuan') {
        NodeCycle = 363.7644
    } else if (CalName === 'Tongtian') {
        NodeCycle = 363.7924
    } else if (CalName === 'Chengtian') {
        NodeCycle = 363.7946
    } else { // 其他的不知道了
        const { AutoPara } = Bind(CalName)
        const Node = AutoPara[CalName]
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        NodeCycle = +(MoonAvgVDeg * Node).toFixed(4)
    }
    return NodeCycle
}
// console.log(AutoNodeCycle('Qiandao'))

export const AutoLightRange = CalName => {
    let LightRange = 0.025 // 宣明不能確定，各個節氣都不一樣
    if (CalName === 'Huangji') {
        LightRange = 0.02365
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        LightRange = 0.0228
    }
    return LightRange
}
