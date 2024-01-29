import Para from './para_calendars.mjs'

export const AutoQuar = (CalName, Type) => { // 盈縮限
    let QuarA = 0
    let QuarB = 0
    if (CalName === 'Yitian') {
        QuarA = 897699.5 / 10100
        QuarB = 946785.5 / 10100
    } else if (['Fengyuan', 'Guantian', 'Zhantian'].includes(CalName)) {
        QuarA = 88 + 10958 / 12030
        QuarB = 93 + 8552 / 12030
    } else if (Type === 11) {
        QuarA = 88.909225
        QuarB = 93.712025
    } else {
        const { Solar, SolarRaw, AcrTermList } = Para[CalName]
        QuarA = AcrTermList[6]
        QuarB = (Solar || SolarRaw) / 2 - QuarA
    }
    return { QuarA, QuarB }
}

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
        Solar = +(Para[CalName].Solar).toFixed(4)
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
        Sidereal = +(Para[CalName].Sidereal).toFixed(4)
    }
    return Sidereal
}
// console.log(AutoSidereal('Xuanming'))

export const AutoMoonAvgV = CalName => { // 陳美東《月離表初探》
    const { Type } = Para[CalName]
    let V = 0
    if (CalName === 'Daye') {
        V = 548.101486 / 41
    } else if (['WuyinA', 'WuyinB'].includes(CalName)) {
        V = 13.36834319526627 // parseFloat((Solar / Lunar + 1).toPrecision(14))
    } else if (CalName === 'Huangji') {
        V = 695 / 52
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        V = 13 + 480 / 1340
    } else if (CalName === 'Yisi') {
        V = 13 + 494 / 1340
    } else if (CalName === 'Xuanming') {
        V = 1123 / 84
    } else if (CalName === 'Chongxuan') {
        V = 401 / 30
    } else if (CalName === 'Qintian') {
        V = 13 + 7 / 19
    } else if (CalName === 'Mingtian' || Type === 11) {
        V = 13.36875 // 約分後的精確值。13+29913000/81120000。但是明天又提到用1337
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(CalName)) {
        V = 13.37
    } else if (CalName === 'Chongtian') {
        V = 909 / 68 // 13.3676470588
    } else if (Type === 9) { // 7290/545.3=13.3687878232，按照公式=13.3687753161
        V = 7290 / 545.3 // 紀元
    } else if (Type === 10) {
        V = 5230 / 391.21 // 13.3687789
    } else {
        const { Sidereal, Solar, Lunar, LunarRaw } = Para[CalName]
        V = parseFloat(((Sidereal || Solar) / (Lunar || LunarRaw) + 1).toPrecision(14))
    }
    return V
}

export const AutoNodeCycle = CalName => {
    let NodeCycle = 363.7934 // 授時
    if (CalName === 'Yingtian') { // 乾元儀天沒說
        NodeCycle = 363.828307
    } else if (['Chongtian', 'Guantian', 'Tongyuan', 'Chunxi'].includes(CalName)) {
        NodeCycle = 363.76
    } else if (CalName === 'Mingtian') {
        NodeCycle = 2270076578 / 6240000 // 363.7943 // 藤豔輝《宋代》頁96
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
    } else if (['Daming3', 'Gengwu'].includes(CalName)) {
        NodeCycle = 363.7936
    } else if (['Datong', 'Datong2'].includes(CalName)) {
        NodeCycle = 363.793419
    } else { // 其他的不知道了
        const { Node } = Para[CalName]
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        NodeCycle = +(MoonAvgVDeg * Node).toFixed(4)
    }
    return NodeCycle
}
// console.log(AutoNodeCycle('Qiandao'))

export const AutoNodePortion = CalName => {
    let p = 0.0785077
    if (CalName === 'Huangji') {
        p = 465 / 5923
    } else if (['Linde', 'Wuji', 'Tsrengyuan'].includes(CalName)) {
        p = 61 / 777
    } else if (CalName === 'Dayan') {
        p = 343 / 4369
    } else if (CalName === 'Xuanming') {
        p = 202 / 2573
    } else if (CalName === 'Chongxuan') {
        p = 263 / 3350 // 原文是262，還沒有校勘記
    } else if (CalName === 'Qintian') {
        p = 72 / 963 // 這個數字差得有點多
    } else if (CalName === 'Qianyuan') {
        p = 142 / 1802
    } else if (CalName === 'Yitian') {
        p = 45 / 572
    } else if (CalName === 'Chongtian') {
        p = 141 / 1796
    } else if (CalName === 'Guantian') {
        p = 183 / 2331
    } else if (CalName === 'Jiyuan') {
        p = 324 / 4127
    } else if (CalName === 'Tongyuan') {
        p = 42 / 535
    } else if (CalName === 'Qiandao') {
        p = 80 / 1019
    } else if (CalName === 'Chunxi') {
        p = 61 / 777
    } else if (CalName === 'Huiyuan') {
        p = 507 / 6458 // 會元只有交率507，6458是唯一可選
    } else if (['Tongtian', 'Kaixi', 'Chengtian'].includes(CalName)) {
        p = 19 / 242
    } else if (['Daming3', 'Gengwu'].includes(CalName)) {
        p = 10 / 127
    }
    return p
}

export const AutoLightRange = CalName => { // 昏明
    let LightRange = 0.025 // 宣明不能確定，各個節氣都不一樣
    if (CalName === 'Huangji') {
        LightRange = 0.02365
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        LightRange = 0.0228
    }
    return LightRange
}

export const AutoRangeEcli = (CalName, Type) => { // 日出入前後多少不算日月食
    let RangeSunEcli = 0, RangeMoonEcli = 0
    if (Type === 11) {
        RangeSunEcli = 0.002 // 大統是20分
    } else if (CalName === 'Daye') {
        RangeSunEcli = 2 / 12
    } else if (['WuyinA', 'WuyinB'].includes(CalName)) {
        RangeSunEcli = 0.125
    } else {
        RangeSunEcli = 0.125 // 其他的瞎填一個
    }
    if (Type <= 3 || ['Yuanjia', 'Daming', 'Liangwu'].includes(CalName)) {
        RangeMoonEcli = 0.2 // 胡亂填，考慮到那時候沒有太陽修正，最多有0.2日差距
    } else if (Type <= 6) {
        RangeMoonEcli = 0.125 // 戊寅麟德
    } else {
        RangeMoonEcli = 0.082 // 大統月食八刻二十分，其他不知道
    }
    return { RangeSunEcli, RangeMoonEcli }
}

export const AutoMoonTcorrDif = (AnomaAccum, CalName) => { // 唐宋月離損益率
    const { MoonTcorrDifList, Anoma } = Para[CalName]
    const AnomaAccumInt = ~~AnomaAccum
    const Anoma25 = Anoma / 4 // 6.8887
    const Anoma50 = Anoma / 2 // 13.7772
    const Anoma75 = Anoma * 0.75 // 20.6659
    let MoonTcorrDif = 0
    let TheDenom = 1
    if (CalName === 'Yitian') {
        const AnomaAccumQuar = AnomaAccum % Anoma25
        const AnomaAccumQuarInt = ~~AnomaAccumQuar
        if (AnomaAccum < Anoma25) {
            MoonTcorrDif = MoonTcorrDifList[AnomaAccumQuarInt]
        } else if (AnomaAccum < Anoma50) {
            MoonTcorrDif = MoonTcorrDifList[7 + AnomaAccumQuarInt]
        } else if (AnomaAccum < Anoma75) {
            MoonTcorrDif = MoonTcorrDifList[14 + AnomaAccumQuarInt]
        } else {
            MoonTcorrDif = MoonTcorrDifList[21 + AnomaAccumQuarInt]
        }
        if (AnomaAccumQuar >= 6) {
            TheDenom = Anoma25 - 6
        }
    } else if (['Xuanming', 'Yingtian'].includes(CalName)) {
        const AnomaAccumHalf = AnomaAccum % Anoma50
        const AnomaAccumHalfInt = ~~AnomaAccumHalf
        if (AnomaAccum < Anoma25) {
            MoonTcorrDif = MoonTcorrDifList[AnomaAccumHalfInt]
        } else if (AnomaAccum < Anoma50) {
            MoonTcorrDif = MoonTcorrDifList[AnomaAccumHalfInt + 1]
        } else if (AnomaAccum < Anoma75) {
            MoonTcorrDif = MoonTcorrDifList[14 + AnomaAccumHalfInt + 1]
        } else {
            MoonTcorrDif = MoonTcorrDifList[14 + AnomaAccumHalfInt + 2]
        }
        if (AnomaAccumHalf >= 6 && AnomaAccum < Anoma25) {
            TheDenom = Anoma25 - 6
        } else if (AnomaAccumHalf >= Anoma25 && AnomaAccumHalf < 7) {
            TheDenom = 7 - Anoma25
        } else if (AnomaAccumHalf >= 13) {
            TheDenom = Anoma50 - 13
        }
    } else {
        if (AnomaAccum < Anoma25) {
            MoonTcorrDif = MoonTcorrDifList[AnomaAccumInt]
            if (AnomaAccum >= 6) {
                TheDenom = Anoma25 - 6
            }
        } else if (AnomaAccum < Anoma75) {
            MoonTcorrDif = MoonTcorrDifList[AnomaAccumInt + 1]
            if (AnomaAccum < 7) {
                TheDenom = 7 - Anoma25
            } else if (AnomaAccum >= 20) {
                TheDenom = Anoma75 - 20
            }
        } else {
            MoonTcorrDif = MoonTcorrDifList[AnomaAccumInt + 2]
            if (AnomaAccum < 21) {
                TheDenom = 21 - Anoma75
            } else if (AnomaAccum >= 27) {
                TheDenom = Anoma - 27
            }
        }
    }
    return {
        MoonTcorrDifPos: -MoonTcorrDif, // 在錄入數據的時候符號相反
        MoonTcorrDifNeg: MoonTcorrDif,
        TheDenom
    }
}