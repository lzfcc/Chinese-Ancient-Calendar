import Para from './para_calendars.mjs'
import { Interpolate1 } from './equa_sn.mjs'
import { NameList } from './para_constant.mjs'

// import { Interpolate2 } from './equa_sn.mjs'
// import { Interpolate1_big } from './equa_sn.mjs'
// console.log(5^4)// console.log(new Date(...[2021, 5, 23, 13, 00, 1]))// console.log([...'34,fs'])
// console.log('yic/dO3gOAKcnBt25bR44VseBbCP+ssia/rzi4z+dCoLPdUcA0NhiyJ6shnfUwJj'.length)
// console.log('r1y8TJcloKTvouxnYsi4PJAx+nHNr90ibsEn3zznzDzWBN9X3o3kbHLSgcIPtzAp'.length)
// const a = x => {
//     const d1 = 63
//     const d2 = 50
//     const d = 2 * 14 * 16 / (14 + 16) * (d1 / 14 - d2 / 16)
//     const f = (d1 / 14 + d / (2 * 16)) * x - (d / (2 * 14 * 16) * x ** 2)
//     return f
// }
// console.log(a(10))

// 損益率
// const a = [] 
// for (let i = 0; i <= 26; i++) {
//     a[i] = -(MoonTcorrList[i + 1] - MoonTcorrList[i])
// }

const AutoSunInterpolate = (n, Name, S1, S2, S3) => {
    const { Type, Solar, SolarRaw, SunTcorrList, TermRangeA, TermRangeS } = Para[Name]
    let D1, D2 = 0
    if (S1) {
        D1 = S2 - S1
    }
    else {
        D1 = 1
        D2 = 1
    }

    let Result = 0
    if (Name === 'Huangji') {
        Result = SunInterpolateA(n)
    } else if (['Linde', 'LindeB'].includes(Name)) {
        Result = SunInterpolateB(n)
    } else if (Name === 'Chongxuan') {
        Result = SunInterpolateC(n)
    } else if (['Yingtian', 'Qianyuan'].includes(Name)) {
        Result = SunInterpolateD(n)
    } else {
        Result = SunInterpolateE(n)
    }
    return Result
}

const b = a => {
    return {
        e: a * (3400 / 7290 + 2745 / 6930 + 14400 / 30000 + 2630 / 5640 + 18000 / 38700 + 5680 / 12000 + 7890 / 16900 + 3470 / 7420) / 8, // 日食陽
        f: a * (4300 / 7290 + 4585 / 6930 + 18000 / 30000 + 3240 / 5640 + 22500 / 38700 + 7100 / 12000 + 9740 / 16900 + 4280 / 7420) / 8, // 日食陰
        c: a * (2400 / 7290 + 11100 / 30000 + 1900 / 5640 + 3900 / 12000) / 4, // 月食旣
        d: a * (6800 / 7290 + 29100 / 30000 + 5460 / 5640 + 36000 / 38700 + 11200 / 12000 + 15780 / 16900 + 6940 / 7420) / 7, // 月食限        
    }
}
const b1 = a1 => a1 * (700 / 10200 + 800 / 11700 + 440 / 6800 + 356 / 5460 + 730 / 11200 + 1052 / 15780 + 463 / 6940) / 7 // 月食定法，這裏是定法與月食限之比
// console.log(b1(10200))

const GenAcrV = () => { // 生成殘曆的躔離
    const { Denom: Denom1, SunAcrAvgDifList: SunAcrAvgDifList1, SunTcorrList: SunTcorrList1, MoonAcrVList: MoonAcrVList1, MoonTcorrList: MoonTcorrList1, MoonTcorrDifList: MoonTcorrDifList1 } = Para['Chongxuan']
    const { Denom: Denom2, SunAcrAvgDifList: SunAcrAvgDifList2, SunTcorrList: SunTcorrList2, MoonAcrVList: MoonAcrVList2, MoonTcorrList: MoonTcorrList2, MoonTcorrDifList: MoonTcorrDifList2 } = Para['Guantian']
    const { Denom: Denom3, SunAcrAvgDifList: SunAcrAvgDifList3, SunTcorrList: SunTcorrList3, MoonAcrVList: MoonAcrVList3, MoonTcorrList: MoonTcorrList3, MoonTcorrDifList: MoonTcorrDifList3 } = Para['Jiyuan']
    const { Denom: Denom4 } = Para['Qintian']
    const { Denom: Denom5 } = Para['Zhantian']
    const SunAcrAvgDif = []
    const SunTcorr = []
    const MoonAcrVd = []
    const MoonTcorr = []
    const MoonTcorrDif = []
    for (let i = 0; i <= 24; i++) {
        SunAcrAvgDif[i] = Math.round((SunAcrAvgDifList1[i] + SunAcrAvgDifList3[i]) / 2)
        // SunAcrAvgDif[i] = Math.round(10000 * (SunAcrAvgDifList1[i]) / Denom1)
    }
    for (let i = 0; i <= 25; i++) {
        // SunTcorr[i] = Math.round(((SunTcorrList1[i] / Denom1 + SunTcorrList3[i] / Denom3) / 2) * Denom4)
        SunTcorr[i] = Math.round(((SunTcorrList1[i] / Denom1)) * Denom4)
    }
    for (let i = 0; i <= 28; i++) {
        MoonAcrVd[i] = Math.round((MoonAcrVList1[i] + MoonAcrVList2[i]) / 2)
        // MoonAcrVd[i] = Math.round(10000 * MoonAcrVList1[i] / Denom1)
    }
    for (let i = 0; i <= 27; i++) {
        MoonTcorr[i] = Math.round(((MoonTcorrList1[i] / Denom1 + MoonTcorrList2[i] / Denom2) / 2) * Denom5)
        // MoonTcorr[i] = Math.round((MoonTcorrList1[i] / Denom1) * Denom4)
    }
    for (let i = 0; i <= 29; i++) {
        MoonTcorrDif[i] = Math.round(((MoonTcorrDifList1[i] / Denom1 + MoonTcorrDifList2[i] / Denom2) / 2) * Denom5)
        // MoonTcorrDif[i] = Math.round((MoonTcorrDifList1[i] / Denom1) * Denom4)
    }
    return
}
// console.log(GenAcrV())
const GenMoon248 = () => { // 欽天月離表
    const { MoonTcorrList: MoonTcorrList1, Denom: Denom1, MoonAcrVList: MoonAcrVList1 } = Para['Wuji']
    const { MoonTcorrList: MoonTcorrList2, Denom: Denom2, MoonAcrVList: MoonAcrVList2 } = Para['Jiyuan']
    let list = []
    let list2 = []
    for (let l = 0; l <= 27; l++) {
        list[l] = []
        list2[l] = []
        let Initial1 = ''
        let Initial2 = ''
        let Initial3 = ''
        let Initial4 = ''
        let Plus = 0
        if (l < 26) {
            Initial1 = [MoonTcorrList1[l], MoonTcorrList1[l + 1], MoonTcorrList1[l + 2]]
            Initial2 = [MoonTcorrList2[l], MoonTcorrList2[l + 1], MoonTcorrList2[l + 2]]
            Initial3 = [MoonAcrVList1[l], MoonAcrVList1[l + 1], MoonAcrVList1[l + 2]]
            Initial4 = [MoonAcrVList2[l], MoonAcrVList2[l + 1], MoonAcrVList2[l + 2]]
        } else {
            // Plus = 1
            // Initial1 = MoonTcorrList1[l - 1] , MoonTcorrList1[l] , MoonTcorrList1[l + 1]
            // Initial2 = MoonTcorrList2[l - 1] , MoonTcorrList2[l] , MoonTcorrList2[l + 1]
            Plus = 2
            Initial1 = [MoonTcorrList1[l - 2], MoonTcorrList1[l - 1], MoonTcorrList1[l]]
            Initial2 = [MoonTcorrList2[l - 2], MoonTcorrList2[l - 1], MoonTcorrList2[l]]
            Initial3 = [MoonAcrVList1[l - 2], MoonAcrVList1[l - 1], MoonAcrVList1[l]]
            Initial4 = [MoonAcrVList2[l - 2], MoonAcrVList2[l - 1], MoonAcrVList2[l]]
        }
        for (let i = 0; i <= 8; i++) {
            list[l][i] = (Interpolate1(1 + Plus + i / 9, Initial1) / Denom1 + Interpolate1(1 + Plus + i / 9, Initial2) / Denom2) / 2
            list[l][i] = +(list[l][i] * 7200).toFixed(2)
            // list[l][i] = +list[l][i].toFixed(2)
            list2[l][i] = (Interpolate1(1 + Plus + i / 9, Initial3) / Denom1 + Interpolate1(1 + Plus + i / 9, Initial4) / 100) / 2
            // list2[l][i] = ( Interpolate1(1 + Plus + i / 9, Initial4) / 100) 
            list2[l][i] = +(list2[l][i] * 100).toFixed(2)
        }
    }
    list = list.flat()
    list2 = list2.flat()
    return
}
// console.log(GenMoon248())

const GenSolar = () => {
    const CalList = Object.keys(NameList)
    const SolarList = []
    const Change = []
    CalList.forEach(name => {
        let { Solar, SolarRaw, CloseOriginAd } = Para[name]
        Solar = Solar || SolarRaw
        if (CloseOriginAd) {
            const Deci = Solar - ~~Solar
            if (Deci < .2425 - 1e-12 || Deci > .2425 + 1e-12) {
                Change.push((.2425 - Deci) / ((1281 - CloseOriginAd) / 100))
                SolarList.push([CloseOriginAd, Deci, NameList[name]])
            }
        }
    })
    let sum = 0
    for (let i = 0; i < Change.length; i++) {
        sum += Change[i]

    }
    sum /= Change.length
    // SolarList.forEach()
    return SolarList
}
// console.log(GenSolar())

// const test4 = () => {
//     let a=[] ,b=[], c=[]
//     b[0] = 1
//     return b
// }
// console.log(test4())
const test5 = function () {
    let a = 3
    // a *= 4 * a - 2
    a /= 6 / 2
    const b = 100 * 1e-1
    let f = true
    !f
    f
    return a
}
// console.log(test5())
// const test = a => a > 2
// const test2 = a => a *= 2 - .1
// const test3 = a => a *= a > 3 ? 4 : 3
// console.log(test2(2)) // 3.8
// console.log(test3(4)) // 16

// console.log(big.log(2,1.5).toNumber())
// console.log(Math.log2(1.5))

////// 下面的放在newm文件

// const EcliRange = EcliNumer / (Solar / Lunar) // 乾象會歲
// const ZhangEcliRange = EcliRange / ZhangRange // 乾象會數
// const ShuoHeFen = (Solar * JiRange * EcliDenom / 2) / EcliNumer // 乾象朔合分
// let Shuowang = 0 // 朔望合數
// if (Name === 'Jingchu') {
//     Shuowang = LunarNumer / 2
// } else if (Name === 'Yuanjia') {
//     Shuowang = EcliDenom / 2 // 元嘉朔望合數：會數/2
// }
// EcliLimit = EcliNumer - Shuowang // 入交限數 乾象先不管

// const EcliJiDif = (JiMon * LunarNumer) % EcliNumer // 景初交會紀差
// const JiEcli = ((EcliConst + EcliJiDif * JiOrder) % EcliNumer + EcliNumer) % EcliNumer // 交會差率
// const JiYinyang = Math.floor((EcliConst + EcliJiDif * JiOrder) / EcliNumer) % 2 === 0 ? YinyangConst : -YinyangConst
// const NodeJiDif = (JiMon * LunarNumer) % NodeNumer
// const JiNode = ((EcliConst + NodeJiDif * JiOrder) % NodeNumer + NodeNumer) % NodeNumer
// const JiYinyang = JiNode / NodeDenom < Node / 2 ? YinyangConst : -YinyangConst
// const AnomaJiDif = (JiMon * LunarNumer) % AnomaNumer
// const JiAnoma = ((AnomaConst + AnomaJiDif * JiOrder) % AnomaNumer + AnomaNumer) % AnomaNumer

// 下面的放在交食文件
// 下景初方位
// const Ecli1c = (isEcliNewm, isEcliSyzygy, NewmYinyang) => {
//     const SunEcliDirc = []
//     const MoonEcliDirc = []
//     for (let i = 1; i <= 14; i++) {
//         if (NewmYinyang === 1) {
//             if (isEcliSyzygy[i - 1] && isEcliNewm[i]) {
//                 SunEcliDirc = '起西南'
//             } else if (isEcliSyzygy[i] && isEcliNewm[i + 1]) {
//                 MoonEcliDirc = '起東北'
//             } else if (isEcliNewm[i] && isEcliSyzygy[i]) {
//                 SunEcliDirc = '起東南'
//                 MoonEcliDirc = '起西北'
//             }
//         } else {
//             if (isEcliSyzygy[i - 1] && isEcliNewm[i]) {
//                 SunEcliDirc = '起西北'
//             } else if (isEcliSyzygy[i] && isEcliNewm[i + 1]) {
//                 MoonEcliDirc = '起東南'
//             } else if (isEcliNewm[i] && isEcliSyzygy[i]) {
//                 SunEcliDirc = '起東北'
//                 MoonEcliDirc = '起西南'
//             }
//         }
//     }
//     return {
//         SunEcliDirc,
//         MoonEcliDirc
//     }
// }
//////// 乾象入陰陽曆
// const a = (~~(OriginYear / Lunar) + i - (isNewm ? 1 : .5)) / EcliNumer - ~~((~~(OriginYear / Lunar) + i - (isNewm ? 1 : .5)) / EcliNumer)
// const b = a * EcliNumer * ShuoHeFen

// 應天日食食分算法廢：
// let tmp = (.75 - TotalDeci) * MoonAvgVd * 20
// if (TotalDeci > .5) {
//     tmp /= 4
// const TheDif = Math.abs(Portion * (TheNodeDif - tmp))
// if (TheNodeDif < SunLimitYang) { // 類同陽曆分
//     if (TheNodeDif >= tmp) {
//         Magni = TheDif / SunLimitYang
//     } else {
//         Magni = Portion * (TheNodeDif + TheDif) / SunLimitYang
//     }
// } else if (TheNodeDif < SunLimitYin) {
//     TheNodeDif -= SunLimitYang // 陰曆分
//     if (TheNodeDif >= tmp) {
//         Magni = TheDif / SunLimitYin
//     } else {
//         Magni = Portion * (TheNodeDif + TheDif) / SunLimitYin
//     }
// }


// 這是崇天觀天原來的食延算法
// else if (Name === 'Chongtian') { // 崇天觀天食分完全一樣
//     // 84、140是陽陰曆食限的0.02
//     if (isNewm) {
//         Last = TheNodeDif < SunLimitYang ? (84 - TheNodeDif / 100) * (TheNodeDif / 100) / 1.85 : (140 - TheNodeDif / 100) * (TheNodeDif / 100) / 5.14 // f(4200)達到極值953.5                
//     } else {
//         Last = TheNodeDif ** 2 / 100
//         Last = isDescend ? 1112 - Last / 935 : 900 - Last / 1156
//     }
//     Last *= 1337 / MoonAcrVList[~~AcrAnomaAccum]
// } else if (Name === 'Guantian') {
//     if (isNewm) {
//         Last = TheNodeDif < SunLimitYang ? (98 - TheNodeDif / 100) * (TheNodeDif / 100) / 2.5 : (140 - TheNodeDif / 100) * (TheNodeDif / 100) / 6.5 // 觀天只說250而一，沒說進二位                
//     } else {
//         Last = TheNodeDif ** 2 / 100
//         Last = isDescend ? 1203 - Last / 1138 : 1083 - Last / 1264
//     }
//     Last *= 1337 / MoonAcrVList[~~AcrAnomaAccum] // 這個計算還是很粗疏，都沒有算一日之中的具體速度，平行速也很粗疏
// }

// 以下是授時遲疾限下行度
// 分別是授時曆立成和大統通軌，我把兩個平均，結果與MoonAcrVListA完全一樣，所以就只用第一個了
const MoonAcrVListB = [.06793140, .06796518, .06799900, .06803285, .06806673, .06810631, .06814590, .06818559, .06822530, .06826506, .06831056, .06835611, .06840173, .06844749, .06849315, .06854467, .06859054, .06864222, .06869397, .06875257, .06880349, .06886125, .06891914, .06897713, .06903519, .06909916, .06616329, .06922167, .06928601, .06935633, .06942092, .06949152, .06956226, .06963315, .06970418, .06977535, .06985262, .06993006, .07000768, .07008547, .07016943, .07024757, .07033193, .07041648, .07050124, .07059228, .07067746, .07076896, .07086069, .07095266, .07105104, .07114350, .07124239, .07134156, .07144101, .07154074, .07164700, .07175358, .07186048, .07196770, .07207523, .07218945, .07229765, .07241257, .07252786, .07264995, .07276599, .07288888, .07301219, .07313592, .07326007, .07338464, .07351622, .07364828, .07378081, .07391382, .07405400, .07418800, .07432922, .07447098, .07461328, .07476294, .07477658, .07478340, .07481069, .07481751, .07483117, .07498171, .07512597, .07527079, .07541616, .07556210, .07570162, .07584165, .07598220, .07612328, .07626488, .07639988, .07654251, .07667851, .07681498, .07694473, .07708215, .07721280, .07734389, .07747543, .07760742, .07773284, .07786534, .07799125, .07811755, .07823680, .07836391, .07848399, .07860429, .07872503, .07884615, .07896764, .07908186, .07919644, .07931132, .07942657, .07954224, .07965031, .07975877, .07986753, .07997659, .08008594, .08018775, .08028982, .08039215, .08049474, .08059760, .08069277, .08078817, .08088384, .08097965, .08107573, .08116401, .08126052, .08134920, .08143807, .08151903, .08160828, .08168957, .08177104, .08185266, .08193445, .08200820, .08209029, .08216432, .08223849, .08231278, .08237894, .08244520, .08251987, .08258636, .08264462, .08271131, .08276975, .08282828, .08288687, .08294557, .08300439, .08305678, .08310527, .08315586, .08320649]
// MoonAcrVd = (MoonAcrVListA[AnomaAccumPart] + PartRange / MoonAcrVListB[AnomaAccumPart]) / 2

// const a = MoonAcrVList[1]
// let signB = 1
// let AnomaXian = 0
// if (AnomaAccumRaw <= 6.642) {
//     AnomaXian = AnomaAccumRaw / PartRange
// } else if (AnomaAccumRaw <= 7.052) {
//     AnomaXian = AnomaAccumRaw / PartRange
//     signB = 0
// } else if (AnomaAccumRaw <= 20.4193) {
//     AnomaXian = Math.abs(Anoma50 - AnomaAccumRaw) / PartRange
//     signB = -1
// } else if (AnomaAccumRaw <= 20.8293) {
//     AnomaXian = Math.abs(Anoma50 - AnomaAccumRaw) / PartRange
//     signB = 0
// } else {
//     AnomaXian = (Anoma - AnomaAccumRaw) / PartRange
// }
// MoonAcrVd = 1.0963 + signB * (.11081575 - .0005815 * AnomaXian - .00000975 * AnomaXian * (AnomaXian - 1)) // 限下行度