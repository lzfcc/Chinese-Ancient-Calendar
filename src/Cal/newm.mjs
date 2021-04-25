import {
    big,
    ScList,
} from './para_constant.mjs'
import {
    Bind,
} from './bind.mjs'
import {
    AutoSunTcorr,
    AutoTcorr
} from './astronomy_acrv.mjs'
// import {
//     EclipseTable
// }from './eclipse_table.mjs'
// import {
//     EclipseFormula
// }from './eclipse_formula.mjs'
import {
    ConstWest
} from './astronomy_west.mjs'
export default (CalName, year) => { // Newm
    const {
        Type,
        AutoPara,
    } = Bind(CalName)
    const {
        Sidereal,
        SolarNumer,
        LunarNumer,
        Denom,
        Anoma,
        AnomaNumer,
        Ecli,
        EcliOrigin,
        OriginAd,
        CloseOriginAd,
        OriginMonNum,
        ZhengNum,
        YuanRange,
        JiRange,
        ZhangRange,
        ZhangLeap,
        AnomaOrigin,
        NightList,
        FirstCorr,
        AnomaCorr,
        OriginCorr,
        WsolsticeConst,
        LeapConst,
        AnomaConst,
        NodeConst,
    } = AutoPara[CalName]
    let {
        YinyangOrigin,
        Node,
        Solar,
        SolarRaw,
        Lunar,
        LunarRaw,
        OriginDaySc,
    } = AutoPara[CalName]
    if (!OriginDaySc) {
        OriginDaySc = 0
    }
    if (!SolarRaw) {
        SolarRaw = Solar
    }
    if (!LunarRaw) {
        LunarRaw = Lunar
    }
    const ZhangMon = Math.round(ZhangRange * (12 + ZhangLeap / ZhangRange))
    // const JiMon = JiRange * ZhangMon / ZhangRange
    const ZhengOriginDif = ZhengNum - OriginMonNum
    const OriginYear = year - OriginAd // 上元積年（算上）
    // const CloseOriginDif = CloseOriginAd - OriginAd // 距算
    const CloseOriginYear = year - CloseOriginAd // 距差    
    let SolarChangeAccum = 0
    let LunarChangeAccum = 0
    let signX = 1
    if (CalName === 'Tongtian') { // 《中國古代曆法》第610頁。如果不算消長的話就完全不對，因為上元積年就考慮了消長
        if (year < 1194) {
            signX = -1
        }
        SolarChangeAccum = signX * (CloseOriginYear ** 2) * 0.0127 * 0.5 / Denom // 加在冬至上的歲實消長
        Solar = 365.2424989147 - 0.0000021167 * CloseOriginYear
        if (CloseOriginYear) {
            Lunar = (SolarRaw - SolarChangeAccum / CloseOriginYear - 10.5 / Denom) / (SolarRaw / LunarRaw)
        } else {
            Lunar = LunarRaw
        }
        LunarChangeAccum = 10.5 * CloseOriginYear / Denom
    } else if (['West', 'Shoushi'].includes(CalName)) {
        if (OriginYear < 0) {
            signX = -1
        }
        if (CalName === 'West') {
            const Func = ConstWest(year)
            Solar = Func.Solar
            Lunar = Func.Lunar
            SolarChangeAccum = signX * ((year - 2000) ** 2) * 0.000000003 // (首項+末項)/2            
            LunarChangeAccum = -signX * ((year - 2000) ** 2) * 0.000000001
        } else {
            Solar = SolarRaw - OriginYear / 1000000 // 授時歲實消長高了16倍
            SolarChangeAccum = signX * (OriginYear ** 2) / 2000000
        }
    }
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const HalfTermLeng = Solar / 24
    const MonLeap = parseFloat((TermLeng - Lunar).toPrecision(14)) // 月閏，借鑑授時曆

    if (!YinyangOrigin) {
        YinyangOrigin = 1
    }
    if (!Node) {
        Node = Lunar * Ecli / (0.5 + Ecli) // 獨創發明！
    }
    let NodeOrigin = 0
    if (EcliOrigin) {
        NodeOrigin = (Node / 2) * EcliOrigin // + (YinyangOrigin === -1 ? Node / 2 : 0) // 把陽曆作為起始
    }
    const SynodicNodeDif = Lunar - Node // 這是望差的兩倍
    const SynodicAnomaDif = Lunar - Anoma
    let JiSkip = 0
    let JiOrder = 0
    let JiYear = 0
    let JiScOrder = 0
    if (JiRange) {
        JiSkip = Math.round(Solar * JiRange % 60)
        JiOrder = Math.floor(OriginYear % YuanRange / JiRange) // 入第幾紀
        JiYear = OriginYear % YuanRange % JiRange + 1 // 入紀年
        JiScOrder = (1 + JiOrder * JiSkip) % 60
    }
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
    // const JiEcli = ((EcliOrigin + EcliJiDif * JiOrder) % EcliNumer + EcliNumer) % EcliNumer // 交會差率
    // const JiYinyang = Math.floor((EcliOrigin + EcliJiDif * JiOrder) / EcliNumer) % 2 === 0 ? YinyangOrigin : -YinyangOrigin
    // const NodeJiDif = (JiMon * LunarNumer) % NodeNumer
    // const JiNode = ((EcliOrigin + NodeJiDif * JiOrder) % NodeNumer + NodeNumer) % NodeNumer
    // const JiYinyang = JiNode / NodeDenom < Node / 2 ? YinyangOrigin : -YinyangOrigin
    // const AnomaJiDif = (JiMon * LunarNumer) % AnomaNumer
    // const JiAnoma = ((AnomaOrigin + AnomaJiDif * JiOrder) % AnomaNumer + AnomaNumer) % AnomaNumer
    let OriginAccum = 0
    if (Type < 11) {
        OriginAccum = OriginYear * SolarRaw + (OriginCorr ? OriginCorr : 0) - SolarChangeAccum
    }
    let LeapSurAvgThis = 0
    let LeapSurAvgPrev = 0
    let LeapSurAvgNext = 0
    let AccumZhongThis = 0
    if (ZhangRange) {
        LeapSurAvgThis = OriginYear * ZhangMon % ZhangRange // 今年閏餘
        LeapSurAvgPrev = (OriginYear - 1) * ZhangMon % ZhangRange
        LeapSurAvgNext = (OriginYear + 1) * ZhangMon % ZhangRange
    } else if (Type === 6 || Type === 7) {
        LeapSurAvgThis = OriginYear * SolarNumer % LunarNumer // OriginYear * SolarNumer爲期總
        LeapSurAvgPrev = (OriginYear - 1) * SolarNumer % LunarNumer
        LeapSurAvgNext = (OriginYear + 1) * SolarNumer % LunarNumer
    } else if (Type < 11) {
        const OriginAccumPrev = (OriginYear - 1) * SolarRaw + (OriginCorr ? OriginCorr : 0) - SolarChangeAccum
        const OriginAccumNext = (OriginYear + 1) * SolarRaw + (OriginCorr ? OriginCorr : 0) - SolarChangeAccum
        LeapSurAvgThis = parseFloat((((OriginAccum + (FirstCorr ? FirstCorr : 0)) % LunarRaw + LunarRaw) % LunarRaw).toPrecision(14))
        LeapSurAvgPrev = parseFloat((((OriginAccumPrev + (FirstCorr ? FirstCorr : 0)) % LunarRaw + LunarRaw) % LunarRaw).toPrecision(14))
        LeapSurAvgNext = parseFloat((((OriginAccumNext + (FirstCorr ? FirstCorr : 0)) % LunarRaw + LunarRaw) % LunarRaw).toPrecision(14))
    } else if (Type === 11) {
        AccumZhongThis = OriginYear * SolarRaw // 中積
        const AccumZhongPrev = (OriginYear - 1) * SolarRaw
        const AccumZhongNext = (OriginYear + 1) * SolarRaw
        OriginAccum = AccumZhongThis + WsolsticeConst - SolarChangeAccum // 通積：該年冬至積日
        const AccumLeapThis = AccumZhongThis + LeapConst // 閏積
        const AccumLeapPrev = AccumZhongPrev + LeapConst
        const AccumLeapNext = AccumZhongNext + LeapConst
        LeapSurAvgThis = parseFloat(((AccumLeapThis % Lunar + Lunar) % Lunar).toPrecision(12)) // 閏餘、冬至月齡
        LeapSurAvgPrev = parseFloat(((AccumLeapPrev % Lunar + Lunar) % Lunar).toPrecision(12))
        LeapSurAvgNext = parseFloat(((AccumLeapNext % Lunar + Lunar) % Lunar).toPrecision(12))
    }
    // let OriginAccum = big(OriginYear).mul(SolarNumer).div(SolarDenom)
    // let FirstAccum = big.floor(big(OriginYear).mul(ZhangMon).div(ZhangRange)).mul(Lunar)
    let FirstAccum = 0
    if (ZhangRange) {
        FirstAccum = Math.floor(OriginYear * ZhangMon / ZhangRange) * Lunar
    } else if (Type === 6 || Type === 7) {
        FirstAccum = OriginAccum - LeapSurAvgThis / Denom - LunarChangeAccum
    } else if (Type >= 8) {
        FirstAccum = OriginAccum - LeapSurAvgThis - LunarChangeAccum
    }
    // let FirstAnomaAccum = (FirstAccum.add((AnomaOrigin ? AnomaOrigin : 0) / Denom)).mod(Anoma).toNumber()
    let FirstAnomaAccum = 0
    if (CalName === 'Qianxiang') {
        FirstAnomaAccum = (Math.floor((OriginYear + 1) * ZhangMon / ZhangRange) * Lunar) % Anoma // 算外。我也不知道怎麼積年就要+1。劉洪濤頁133，突然想到的。
        // FirstAnomaAccum = big.floor(big(OriginYear + 1).mul(ZhangMon).div(ZhangRange)).mul(Lunar).add(1).mod(Anoma).toNumber()
    } else if (Type < 11) {
        FirstAnomaAccum = (FirstAccum + (AnomaOrigin ? AnomaOrigin : 0) / Denom + (CalName === 'Shenlong' ? Anoma / 2 : 0) + (AnomaCorr ? AnomaCorr : 0) + Anoma) % Anoma
    } else if (Type === 11) {
        FirstAnomaAccum = ((AccumZhongThis - LeapSurAvgThis + AnomaConst) % Anoma + Anoma) % Anoma
    }
    let FirstNodeAccum = 0
    if (Type < 11) {
        FirstNodeAccum = (FirstAccum + NodeOrigin) % Node
    } else if (Type === 11) {
        FirstNodeAccum = AccumZhongThis + NodeConst - LeapSurAvgThis
    }
    const AccumPrint = '轉' + (OriginAccum % Anoma).toFixed(4) + (Node ? '交' + (OriginAccum % Node).toFixed(4) : '') + (Sidereal ? '週' + (OriginAccum % Sidereal).toFixed(4) : '')
    // const FirstNodeAccum = (FirstAccum.add(NodeOrigin)).mod(Node).toNumber()
    // // 下面在大數字運算完畢後，化爲一年內的日數
    // OriginAccum = OriginAccum.mod(60).toNumber()
    // FirstAccum = FirstAccum.mod(60).toNumber()
    // if (OriginAccum < FirstAccum) {
    //     OriginAccum += 60
    // }

    let LeapLimit = 0
    if (ZhangRange) {
        LeapLimit = ZhangRange - ZhangLeap
    } else if (Type <= 7) {
        LeapLimit = parseFloat((13 * LunarNumer - SolarNumer).toPrecision(14))
    } else {
        LeapLimit = parseFloat((13 * Lunar - Solar).toPrecision(14))
    }
    let isLeapThis = LeapSurAvgThis >= LeapLimit ? 1 : 0 // 是否有閏月
    let isLeapPrev = LeapSurAvgPrev >= LeapLimit ? 1 : 0
    let isLeapNext = LeapSurAvgNext >= LeapLimit ? 1 : 0
    let LeapNumAvgThis = 0
    let LeapNumAvgNext = 0
    if (ZhangRange) {
        LeapNumAvgThis = isLeapThis ? Math.ceil(parseFloat(((ZhangRange - LeapSurAvgThis) * 12 / ZhangLeap).toPrecision(14))) : 0
        LeapNumAvgNext = isLeapNext ? Math.ceil(parseFloat(((ZhangRange - LeapSurAvgNext) * 12 / ZhangLeap).toPrecision(14))) : 0
    } else if (Type <= 7) {
        LeapNumAvgThis = isLeapThis ? Math.ceil((Lunar - LeapSurAvgThis / Denom) / MonLeap) : 0
        LeapNumAvgNext = isLeapThis ? Math.ceil((Lunar - LeapSurAvgNext / Denom) / MonLeap) : 0
    } else {
        LeapNumAvgThis = isLeapThis ? Math.ceil((Lunar - LeapSurAvgThis) / MonLeap) : 0
        LeapNumAvgNext = isLeapThis ? Math.ceil((Lunar - LeapSurAvgNext) / MonLeap) : 0
    }
    let isAdvance = 0
    if (LeapNumAvgNext) {
        LeapNumAvgNext -= ZhengOriginDif
        if (LeapNumAvgNext <= 0) {
            LeapNumAvgThis = LeapNumAvgNext + 12
            isLeapThis = 1
            isLeapNext = 0
            isAdvance = 1
        }
    } else if (LeapNumAvgThis) {
        LeapNumAvgThis -= ZhengOriginDif
        if (LeapNumAvgThis <= 0) {
            LeapNumAvgThis = 0
            isLeapThis = 0
            isLeapPrev = 1
            isAdvance = 1
        }
    }
    const AutoNewmSyzygy = (isNewm) => {
        const AvgRaw = []
        const AvgOrderRaw = []
        const AvgMod = []
        const AvgSc = []
        const AvgDecimal = []
        // const TermAvgBare = []
        const TermAvgRaw = []
        const TermAcrRaw = []
        const AnomaAccum = []
        const Magni = []
        const Yinyang = []
        const status = []
        const OrderMod = []
        const AcrOrderRaw = []
        const Tcorr = []
        // const AcrBare = []
        const AcrRaw = []
        const AcrMod = []
        const Sc = []
        const Decimal1 = [] // 線性內插
        const Decimal2 = [] // 二次內插
        const Decimal3 = [] // 三次內插
        // const Jd = []
        for (let i = 0; i <= 14; i++) {
            AvgRaw[i] = FirstAccum + (ZhengOriginDif + i - (isNewm ? 1 : 0.5)) * Lunar
            AvgMod[i] = (AvgRaw[i] % 60 + 60) % 60
            AvgOrderRaw[i] = Math.floor(AvgRaw[i])
            AvgSc[i] = ScList[(Math.floor(AvgMod[i]) + 1 + OriginDaySc) % 60]
            AvgDecimal[i] = (AvgRaw[i] - Math.floor(AvgRaw[i])).toFixed(4).slice(2, 6)
            const OriginDifRaw = ((ZhengOriginDif + i - (isNewm ? 1 : 0.5)) * Lunar + FirstAccum - OriginAccum + Solar) % Solar
            AnomaAccum[i] = parseFloat(((FirstAnomaAccum + (ZhengOriginDif + i - 1) * SynodicAnomaDif + (isNewm ? 0 : Lunar / 2)) % Anoma).toPrecision(14))
            if (CalName === 'Mingtian') {
                AnomaAccum[i] = big.div(OriginAccum, Lunar).add(i - 1 + ZhengOriginDif).mul(2142887000).mod(AnomaNumer).floor().div(81120000).toNumber()
                // AnomaAccum[i] = (Math.floor(OriginAccum / Lunar + i - 1 + ZhengOriginDif) * 2142887000 % AnomaNumer) / 81120000
            }
            const TcorrBindFunc = AutoTcorr(AnomaAccum[i], OriginDifRaw, CalName)
            let Tcorr1 = 0
            if (Type <= 4) {
                Tcorr[i] = TcorrBindFunc.Tcorr1
            } else if (Type < 11) {
                Tcorr[i] = TcorrBindFunc.Tcorr2
                Tcorr1 = TcorrBindFunc.Tcorr1
            } else if (Type === 11) {
                Tcorr[i] = TcorrBindFunc.Tcorr3
            }
            AcrRaw[i] = AvgRaw[i] + Tcorr[i]
            AcrMod[i] = (AcrRaw[i] % 60 + 60) % 60
            AcrOrderRaw[i] = Math.floor(AvgRaw[i] + Tcorr1) // 線性內插所得
            if (Type <= 4) {
                Decimal1[i] = (AcrRaw[i] - AcrOrderRaw[i]).toFixed(4).slice(2, 6)
            } else if (Type < 11) {
                Decimal2[i] = (AcrRaw[i] - AcrOrderRaw[i]).toFixed(4).slice(2, 6) // 二次內插
                if (!['Futian', 'Mingtian'].includes(CalName)) {
                    const AcrRaw1 = AvgRaw[i] + Tcorr1 // 線性內插
                    Decimal1[i] = (AcrRaw1 - Math.floor(AcrRaw1)).toFixed(4).slice(2, 6)
                }
            } else if (Type === 11) {
                Decimal3[i] = (AcrRaw[i] - AcrOrderRaw[i]).toFixed(4).slice(2, 6)
            }
            /////進朔/////
            let NewmPlus = 0
            if (Type >= 6 && Type <= 10 && (!['Zhangmengbin', 'Liuxiaosun', 'Huangji'].includes(CalName)) && (AcrRaw[i] - AcrOrderRaw[i] >= 0.75)) {
                NewmPlus = 1
            }
            OrderMod[i] = Math.floor(AcrMod[i]) + NewmPlus
            AcrOrderRaw[i] += NewmPlus
            Sc[i] = ScList[(OrderMod[i] + 1 + OriginDaySc) % 60] // 算外
            if (isNewm && NewmPlus) {
                Sc[i] += '+'
            }
            // Jd[i] = Math.round(JdOrigin + AcrRaw[i]) + NewmPlus
            // 定氣
            TermAvgRaw[i] = OriginAccum + (i + ZhengOriginDif - 1) * TermLeng
            const TermNum3 = Math.round((2 * (i + ZhengNum) - 1) % 24.1)
            const TermNumDay = (TermNum3 - 1) * HalfTermLeng
            if (Type >= 5) {
                const TermAcrRawList = AutoSunTcorr(TermNumDay, CalName).TermAcrRawList
                TermAcrRaw[i] = TermAcrRawList[i]
            }
            /////合朔漏刻//////
            let NodeCorr = 0
            if (Type === 4) {
                const TermNum1 = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1) // 朔望所在氣名
                const TermNewmDif = OriginDifRaw - (TermNum1 - 1) * HalfTermLeng // 注意要減1。朔望入氣日數
                const Dawn = (NightList[TermNum1] + TermNewmDif * (NightList[TermNum1 + 1] - NightList[TermNum1])) / 100 // 日出时刻=夜半漏+2.5刻                
                if (isNewm && AcrRaw[i] - AcrOrderRaw[i] < Dawn) { // 按元嘉，合朔月食在黎明前是前一天
                    Sc[i] = ScList[OrderMod[i]] + '-'
                }
                // NodeCorr = NodeAccumCorr(OriginDifRaw, TermNum1, CalName)
            }
            //////交食//////
            const NodeAccum = parseFloat(((FirstNodeAccum + (ZhengOriginDif + i - (isNewm ? 1 : 0.5)) * Lunar + (NodeCorr ? NodeCorr : Tcorr[i]) + Node) % Node).toPrecision(14))
            // 入交定日似乎宋厤另有算法，授時直接就是用定朔加減差，奇怪。
            let Ecli = {}
            // if (Type <= 4) {
            //     Ecli = Ecli1b(NodeAccum, isNewm, CalName)
            // } else if (Type <= 7) {
            //     const TermNumAcr = OriginDifRaw - SunTcorrTerm
            // } else if (Type === 11) {
            //     // const NodeAccumDeg = NodeAccumAvg * MoonAvgVDeg + Bind.sun * XianConst / FaslowV // 感覺應該是這樣。交定度：以盈縮差盈加縮減之
            //     const MansionRaw = parseFloat((((78.8 + AvgRaw) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(14)) // 78.8根據命起和週應而來

            // let EcliTcorr = 0
            // if (Ecli) {
            //     Magni[i] = Ecli.Magni
            //     status[i] = Ecli.status
            //     Yinyang[i] = Ecli.Yinyang
            // }
            // if (status[i] === 1) {
            //     Sc[i] += '●'
            // } else if (status[i] === 2) {
            //     Sc[i] += '◐'
            // } else if (status[i] === 3) {
            //     Sc[i] += '○'
            // }
            // if (Type <= 4) {
            //     Decimal1[i] = (Decimal1[i] + EcliTcorr).toFixed(4).slice(2, 6)
            // } else if (Type < 11) {
            //     Decimal2[i] = (Decimal2[i] + EcliTcorr).toFixed(4).slice(2, 6)
            // } else if (Type === 11) {
            //     Decimal3[i] = (Decimal3[i] + EcliTcorr).toFixed(4).slice(2, 6)
            // }
        }
        // const Mmdd = Jd2Date(Jd)
        return {
            TermAvgRaw,
            TermAcrRaw,
            Tcorr,
            AvgOrderRaw,
            AcrOrderRaw,
            OrderMod,
            AcrRaw,
            AcrMod,
            AvgSc,
            AvgDecimal,
            Sc,
            Decimal1,
            Decimal2,
            Decimal3,
            // Jd,
            // Mmdd,
            Yinyang,
            // Magni,
            // status,
        }
    }
    const Newm = AutoNewmSyzygy(1)
    const Syzygy = AutoNewmSyzygy(0)
    const TermAvgRaw = Newm.TermAvgRaw
    const TermAcrRaw = Newm.TermAcrRaw
    const NewmTcorr = Newm.Tcorr
    const NewmAvgSc = Newm.AvgSc
    const NewmAvgDecimal = Newm.AvgDecimal
    const NewmAcrRaw = Newm.AcrRaw
    const NewmAcrMod = Newm.AcrMod
    const NewmOrderRaw = Newm.AvgOrderRaw
    const NewmAcrOrderRaw = Newm.AcrOrderRaw
    const NewmOrderMod = Newm.OrderMod
    const NewmMagni = Newm.Magni
    const SyzygyMagni = Syzygy.Magni
    let NewmSc = Newm.Sc
    const NewmDecimal1 = Newm.Decimal1
    const NewmDecimal2 = Newm.Decimal2
    const NewmDecimal3 = Newm.Decimal3
    // const NewmJd = Newm.Jd
    // const NewmMmdd = Newm.Mmdd
    let SyzygySc = Syzygy.Sc
    let SyzygyDecimal = 0
    if (Type <= 4) {
        SyzygyDecimal = Syzygy.Decimal1
    } else if (Type < 11) {
        SyzygyDecimal = Syzygy.Decimal2
    } else if (Type === 11) {
        SyzygyDecimal = Syzygy.Decimal3
    }
    let LeapSurAcrThis = 0
    if (ZhangRange) {
        LeapSurAcrThis = (LeapSurAvgThis - NewmTcorr[1] * ZhangRange / Lunar + ZhangRange) % ZhangRange
    } else {
        LeapSurAcrThis = LeapSurAvgThis - NewmTcorr[1] // * Denom
    }
    // 前交後會：前望食，次朔會（都要達到標準）的一些特殊情況。前後都是指朔而言
    // const NewmYinyang = Newm.Yinyang
    // const isEcliNewm = Newm.status
    // const isEcliSyzygy = Syzygy.status
    // const EcliDirc = '' // Ecli1c(isEcliNewm, isEcliSyzygy, NewmYinyang)
    // const NewmEcliDirc = EcliDirc.NewmEcliDirc
    // const SyzygyEcliDirc = EcliDirc.SyzygyEcliDirc
    // 中氣
    let LeapNumTerm = 0
    if (LeapNumAvgThis) {
        LeapNumTerm = LeapNumAvgThis
    }
    let isLeapAdvan = 0
    let isLeapPost = 0
    if (isLeapThis) {
        while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmOrderRaw[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmOrderRaw[LeapNumTerm + 1] + 2.5)) {
            LeapNumTerm -= 1
        }
        while (LeapNumTerm <= 12 && (TermAvgRaw[LeapNumTerm + 1] < NewmOrderRaw[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmOrderRaw[LeapNumTerm + 2] - 2.5)) {
            LeapNumTerm += 1
        }
        if (LeapNumTerm < 1) {
            isLeapAdvan = 1
            isLeapPrev = 1
        } else if (LeapNumTerm > 12) {
            isLeapPost = 1
            isLeapNext = 1
        }
    }
    // 最後是積月、月數
    let NewmSyzygyStart = 0
    let NewmSyzygyEnd = 0
    if (isAdvance && isLeapPrev) {
        NewmSyzygyStart = 1
    }
    if (isLeapThis) {
        NewmSyzygyEnd = 1
    } else {
        NewmSyzygyEnd = NewmSyzygyStart
    }
    let TermStart = NewmSyzygyStart
    let TermEnd = NewmSyzygyEnd
    if ((isAdvance && isLeapPrev)) {
        TermStart = 0
    }
    if (NewmSyzygyStart && !TermStart) {
        TermEnd = 0
    }
    return {
        Solar,
        LeapLimit,
        OriginYear,
        // 上爲常量。下日書用
        FirstAccum,
        ZhengOriginDif,
        FirstNodeAccum,
        //////////////////
        JiYear,
        JiScOrder,
        OriginAccum,
        NewmAvgSc,
        NewmAvgDecimal,
        NewmAcrMod,
        NewmSc,
        NewmOrderRaw,
        NewmAcrOrderRaw,
        NewmOrderMod,
        NewmDecimal1,
        NewmDecimal2,
        NewmDecimal3,
        // NewmJd,
        // NewmMmdd,
        NewmAcrRaw,
        SyzygySc,
        SyzygyDecimal,
        TermAvgRaw,
        TermAcrRaw,
        LeapSurAvgThis,
        LeapSurAcrThis,
        LeapNumTerm,
        isAdvance,
        isLeapAdvan,
        isLeapPost,
        isLeapThis,
        isLeapPrev,
        isLeapNext,
        NewmSyzygyStart,
        NewmSyzygyEnd,
        TermStart,
        TermEnd,
        AccumPrint,
        // NewmEcliDirc,
        // SyzygyEcliDirc,
        // NewmMagni,
        // SyzygyMagni
    }
}