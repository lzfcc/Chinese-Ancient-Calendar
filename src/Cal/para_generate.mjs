import { Bind } from './bind.mjs'
import { Interpolate1 } from './equa_sn.mjs'
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
    const { AutoPara, Type } = Bind(CalName)
    const { Solar, SolarRaw, SunTcorrList, TermRangeA, TermRangeS } = AutoPara[CalName]
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
    const { AutoPara } = Bind('Tongtian')
    const { Denom: Denom1, SunAcrAvgDifList: SunAcrAvgDifList1, SunTcorrList: SunTcorrList1, MoonAcrVList: MoonAcrVList1, MoonTcorrList: MoonTcorrList1, MoonTcorrDifList: MoonTcorrDifList1 } = AutoPara['Chongxuan']
    const { Denom: Denom2, SunAcrAvgDifList: SunAcrAvgDifList2, SunTcorrList: SunTcorrList2, MoonAcrVList: MoonAcrVList2, MoonTcorrList: MoonTcorrList2, MoonTcorrDifList: MoonTcorrDifList2 } = AutoPara['Guantian']
    const { Denom: Denom3, SunAcrAvgDifList: SunAcrAvgDifList3, SunTcorrList: SunTcorrList3, MoonAcrVList: MoonAcrVList3, MoonTcorrList: MoonTcorrList3, MoonTcorrDifList: MoonTcorrDifList3 } = AutoPara['Jiyuan']
    const { Denom: Denom4 } = AutoPara['Qintian']
    const { Denom: Denom5 } = AutoPara['Zhantian']
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
    const { AutoPara } = Bind('Chongxuan')
    const { MoonTcorrList: MoonTcorrList1, Denom: Denom1, MoonAcrVList: MoonAcrVList1 } = AutoPara['Wuji']
    const { MoonTcorrList: MoonTcorrList2, Denom: Denom2, MoonAcrVList: MoonAcrVList2 } = AutoPara['Jiyuan']
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
            Initial1 = MoonTcorrList1[l] + ',' + MoonTcorrList1[l + 1] + ',' + MoonTcorrList1[l + 2]
            Initial2 = MoonTcorrList2[l] + ',' + MoonTcorrList2[l + 1] + ',' + MoonTcorrList2[l + 2]
            Initial3 = MoonAcrVList1[l] + ',' + MoonAcrVList1[l + 1] + ',' + MoonAcrVList1[l + 2]
            Initial4 = MoonAcrVList2[l] + ',' + MoonAcrVList2[l + 1] + ',' + MoonAcrVList2[l + 2]
        } else {
            // Plus = 1
            // Initial1 = MoonTcorrList1[l - 1] + ',' + MoonTcorrList1[l] + ',' + MoonTcorrList1[l + 1]
            // Initial2 = MoonTcorrList2[l - 1] + ',' + MoonTcorrList2[l] + ',' + MoonTcorrList2[l + 1]
            Plus = 2
            Initial1 = MoonTcorrList1[l - 2] + ',' + MoonTcorrList1[l - 1] + ',' + MoonTcorrList1[l]
            Initial2 = MoonTcorrList2[l - 2] + ',' + MoonTcorrList2[l - 1] + ',' + MoonTcorrList2[l]
            Initial3 = MoonAcrVList1[l - 2] + ',' + MoonAcrVList1[l - 1] + ',' + MoonAcrVList1[l]
            Initial4 = MoonAcrVList2[l - 2] + ',' + MoonAcrVList2[l - 1] + ',' + MoonAcrVList2[l]
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
    // const JiEcli = ((EcliCorr + EcliJiDif * JiOrder) % EcliNumer + EcliNumer) % EcliNumer // 交會差率
    // const JiYinyang = Math.floor((EcliCorr + EcliJiDif * JiOrder) / EcliNumer) % 2 === 0 ? YinyangCorr : -YinyangCorr
    // const NodeJiDif = (JiMon * LunarNumer) % NodeNumer
    // const JiNode = ((EcliCorr + NodeJiDif * JiOrder) % NodeNumer + NodeNumer) % NodeNumer
    // const JiYinyang = JiNode / NodeDenom < Node / 2 ? YinyangCorr : -YinyangCorr
    // const AnomaJiDif = (JiMon * LunarNumer) % AnomaNumer
    // const JiAnoma = ((AnomaCorr + AnomaJiDif * JiOrder) % AnomaNumer + AnomaNumer) % AnomaNumer

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