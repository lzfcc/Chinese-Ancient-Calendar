import Para from './para_calendars.mjs'
import { Interpolate1 } from './equa_sn.mjs'
import { CalNameList } from './para_constant.mjs'

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

const AutoSunInterpolate = (n, CalName, S1, S2, S3) => {
    const { Type, Solar, SolarRaw, SunTcorrList, TermRangeA, TermRangeS } = Para[CalName]
    let D1, D2 = 0
    if (S1) {
        D1 = S2 - S1
    }
    else {
        D1 = 1
        D2 = 1
    }

    let Result = 0
    if (CalName === 'Huangji') {
        Result = SunInterpolateA(n)
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        Result = SunInterpolateB(n)
    } else if (CalName === 'Chongxuan') {
        Result = SunInterpolateC(n)
    } else if (['Yingtian', 'Qianyuan'].includes(CalName)) {
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
    const MoonAcrV = []
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
        MoonAcrV[i] = Math.round((MoonAcrVList1[i] + MoonAcrVList2[i]) / 2)
        // MoonAcrV[i] = Math.round(10000 * MoonAcrVList1[i] / Denom1)
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
    const CalList = Object.keys(CalNameList)
    const SolarList = []
    const Change = []
    CalList.forEach(name => {
        let { Solar, SolarRaw, CloseOriginAd } = Para[name]
        Solar = Solar || SolarRaw
        if (CloseOriginAd) {
            const Deci = Solar - ~~Solar
            if (Deci < 0.2425 - 1e-12 || Deci > 0.2425 + 1e-12) {
                Change.push((0.2425 - Deci) / ((1281 - CloseOriginAd) / 100))
                SolarList.push([CloseOriginAd, Deci, CalNameList[name]])
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
// const test2 = a => a *= 2 - 0.1
// const test3 = a => a *= a > 3 ? 4 : 3
// console.log(test2(2)) // 3.8
// console.log(test3(4)) // 16

// console.log(big.log(2,1.5).toNumber())
console.log(Math.log2(1.5))

////// 下面的放在newm文件

// const EcliRange = EcliNumer / (Solar / Lunar) // 乾象會歲
// const ZhangEcliRange = EcliRange / ZhangRange // 乾象會數
// const ShuoHeFen = (Solar * JiRange * EcliDenom / 2) / EcliNumer // 乾象朔合分
// let Shuowang = 0 // 朔望合數
// if (CalName === 'Jingchu') {
//     Shuowang = LunarNumer / 2
// } else if (CalName === 'Yuanjia') {
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
//     const NewmEcliDirc = []
//     const SyzygyEcliDirc = []
//     for (let i = 1; i <= 14; i++) {
//         if (NewmYinyang === 1) {
//             if (isEcliSyzygy[i - 1] && isEcliNewm[i]) {
//                 NewmEcliDirc = '起西南'
//             } else if (isEcliSyzygy[i] && isEcliNewm[i + 1]) {
//                 SyzygyEcliDirc = '起東北'
//             } else if (isEcliNewm[i] && isEcliSyzygy[i]) {
//                 NewmEcliDirc = '起東南'
//                 SyzygyEcliDirc = '起西北'
//             }
//         } else {
//             if (isEcliSyzygy[i - 1] && isEcliNewm[i]) {
//                 NewmEcliDirc = '起西北'
//             } else if (isEcliSyzygy[i] && isEcliNewm[i + 1]) {
//                 SyzygyEcliDirc = '起東南'
//             } else if (isEcliNewm[i] && isEcliSyzygy[i]) {
//                 NewmEcliDirc = '起東北'
//                 SyzygyEcliDirc = '起西南'
//             }
//         }
//     }
//     return {
//         NewmEcliDirc,
//         SyzygyEcliDirc
//     }
// }
//////// 乾象入陰陽曆
// const a = (~~(OriginYear / Lunar) + i - (isNewm ? 1 : 0.5)) / EcliNumer - ~~((~~(OriginYear / Lunar) + i - (isNewm ? 1 : 0.5)) / EcliNumer)
// const b = a * EcliNumer * ShuoHeFen

// 應天日食食分算法廢：
// let tmp = (0.75 - TotalDeci) * MoonAvgVDeg * 20
// if (TotalDeci > 0.5) {
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
// else if (CalName === 'Chongtian') { // 崇天觀天食分完全一樣
//     // 84、140是陽陰曆食限的0.02
//     if (isNewm) {
//         Last = TheNodeDif < SunLimitYang ? (84 - TheNodeDif / 100) * (TheNodeDif / 100) / 1.85 : (140 - TheNodeDif / 100) * (TheNodeDif / 100) / 5.14 // f(4200)達到極值953.5                
//     } else {
//         Last = TheNodeDif ** 2 / 100
//         Last = isDescend ? 1112 - Last / 935 : 900 - Last / 1156
//     }
//     Last *= 1337 / MoonAcrVList[~~AcrAnomaAccum]
// } else if (CalName === 'Guantian') {
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
const MoonAcrVListB = [0.06793140, 0.06796518, 0.06799900, 0.06803285, 0.06806673, 0.06810631, 0.06814590, 0.06818559, 0.06822530, 0.06826506, 0.06831056, 0.06835611, 0.06840173, 0.06844749, 0.06849315, 0.06854467, 0.06859054, 0.06864222, 0.06869397, 0.06875257, 0.06880349, 0.06886125, 0.06891914, 0.06897713, 0.06903519, 0.06909916, 0.06616329, 0.06922167, 0.06928601, 0.06935633, 0.06942092, 0.06949152, 0.06956226, 0.06963315, 0.06970418, 0.06977535, 0.06985262, 0.06993006, 0.07000768, 0.07008547, 0.07016943, 0.07024757, 0.07033193, 0.07041648, 0.07050124, 0.07059228, 0.07067746, 0.07076896, 0.07086069, 0.07095266, 0.07105104, 0.07114350, 0.07124239, 0.07134156, 0.07144101, 0.07154074, 0.07164700, 0.07175358, 0.07186048, 0.07196770, 0.07207523, 0.07218945, 0.07229765, 0.07241257, 0.07252786, 0.07264995, 0.07276599, 0.07288888, 0.07301219, 0.07313592, 0.07326007, 0.07338464, 0.07351622, 0.07364828, 0.07378081, 0.07391382, 0.07405400, 0.07418800, 0.07432922, 0.07447098, 0.07461328, 0.07476294, 0.07477658, 0.07478340, 0.07481069, 0.07481751, 0.07483117, 0.07498171, 0.07512597, 0.07527079, 0.07541616, 0.07556210, 0.07570162, 0.07584165, 0.07598220, 0.07612328, 0.07626488, 0.07639988, 0.07654251, 0.07667851, 0.07681498, 0.07694473, 0.07708215, 0.07721280, 0.07734389, 0.07747543, 0.07760742, 0.07773284, 0.07786534, 0.07799125, 0.07811755, 0.07823680, 0.07836391, 0.07848399, 0.07860429, 0.07872503, 0.07884615, 0.07896764, 0.07908186, 0.07919644, 0.07931132, 0.07942657, 0.07954224, 0.07965031, 0.07975877, 0.07986753, 0.07997659, 0.08008594, 0.08018775, 0.08028982, 0.08039215, 0.08049474, 0.08059760, 0.08069277, 0.08078817, 0.08088384, 0.08097965, 0.08107573, 0.08116401, 0.08126052, 0.08134920, 0.08143807, 0.08151903, 0.08160828, 0.08168957, 0.08177104, 0.08185266, 0.08193445, 0.08200820, 0.08209029, 0.08216432, 0.08223849, 0.08231278, 0.08237894, 0.08244520, 0.08251987, 0.08258636, 0.08264462, 0.08271131, 0.08276975, 0.08282828, 0.08288687, 0.08294557, 0.08300439, 0.08305678, 0.08310527, 0.08315586, 0.08320649]
// MoonAcrV = (MoonAcrVListA[AnomaAccumPart] + PartRange / MoonAcrVListB[AnomaAccumPart]) / 2

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
// MoonAcrV = 1.0963 + signB * (0.11081575 - 0.0005815 * AnomaXian - 0.00000975 * AnomaXian * (AnomaXian - 1)) // 限下行度