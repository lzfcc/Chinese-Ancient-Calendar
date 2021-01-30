const {
    SClist,
    JiList,
    CalendarName
} = require('./constant') // 賦值解構
const Parameters = require('./ancient_para')

function CalAncient(AncientPre, year) {
    const {
        LunarDenominator,
        lunar,
        solar,
        WsolsticeOriginDif,
        WsolsticeOriginMon,
        originAD,
        OriginYearSC,
        OriginDaySC,
        OriginCorr,
        FirstMonNum,
        FirstOriginMonDif,
        YuanRange,
        JiRange,
        BuRange,
        BuSkip,
        ifTong,
        ifTermLeap,
    } = Parameters[AncientPre]
    const TermLeng = solar / 12 // 每個中氣相隔的日數
    const OriginYear = year - originAD // 上元積年
    let JupiterSC = ''
    if (ifTong) {
        JupiterSC = SClist[(Math.floor(OriginYear % 1728 * 145 / 144) + OriginYearSC) % 60]
    }
    const JiOrder = Math.floor(OriginYear % YuanRange / JiRange) // 入第幾紀
    const BuYear = OriginYear % YuanRange % JiRange % BuRange + 1 // 入蔀（統）第幾年
    const BuOrder = Math.floor(OriginYear % YuanRange % JiRange / BuRange) // 入第幾蔀（統）
    const BuSCorder = (1 + BuOrder * BuSkip + OriginDaySC) % 60 // 蔀（統）的干支序號
    const WsolsticeAccumRaw = (BuYear - 1) * solar + WsolsticeOriginDif % 60
    const WsolsticeAccumMod = (WsolsticeAccumRaw % 60 + 60) % 60
    // const WsolsticeGreatSur = Math.floor((WsolsticeAccumRaw % 60 + 60) % 60) //冬至大餘
    const OriginAccumMod = ((WsolsticeAccumRaw - WsolsticeOriginDif) % 60 + 60) % 60
    const LeapSurAvgThis = parseFloat(((((BuYear - 1) * 7 / 19 - Math.floor((BuYear - 1) * 7 / 19) + WsolsticeOriginMon) % 1 + 1) % 1).toPrecision(11)) // 閏餘
    const LeapSurAvgPrev = parseFloat(((((BuYear - 2) * 7 / 19 - Math.floor((BuYear - 2) * 7 / 19) + WsolsticeOriginMon) % 1 + 1) % 1).toPrecision(11)) // 閏餘
    const LeapSurAvgNext = parseFloat((((BuYear * 7 / 19 - Math.floor(BuYear * 7 / 19) + WsolsticeOriginMon) % 1 + 1) % 1).toPrecision(11))
    const LeapSurAvgPos = FirstMonNum > 0 ? LeapSurAvgNext : LeapSurAvgThis
    const ifLeapAvgThis = LeapSurAvgThis >= parseFloat((12 / 19).toPrecision(11)) ? 1 : 0
    const ifLeapAvgNext = LeapSurAvgNext >= parseFloat((12 / 19).toPrecision(11)) ? 1 : 0 // 下一歲是否有閏月
    let ifLeapAvgPos = 0
    if (ifTermLeap) { // 三統曆、後漢四分用無中置閏法，其他用閏餘法
        ifLeapAvgPos = ifLeapAvgThis
    } else {
        ifLeapAvgPos = FirstMonNum > 0 ? ifLeapAvgNext : ifLeapAvgThis
    }
    let LeapNumAvgThis = ifLeapAvgThis ? Math.ceil(parseFloat(((1 - LeapSurAvgThis) * 228 / 7).toPrecision(12))) : 0 // 閏餘法今年閏月
    let LeapNumAvgNext = ifLeapAvgNext ? Math.ceil(parseFloat(((1 - LeapSurAvgNext) * 228 / 7).toPrecision(12))) : 0
    let ifAdvance = 0
    let ifPost = 0 // 顓頊曆用不到ifPost
    if (ifLeapAvgThis) {
        LeapNumAvgThis -= FirstMonNum
        if (LeapNumAvgThis <= 0) {
            LeapNumAvgThis += 12
            ifAdvance = 1
        } else if (LeapNumAvgThis >= 13) {
            LeapNumAvgThis -= 12
            ifPost = 1
        }
    } else if (ifLeapAvgNext) {
        LeapNumAvgNext -= FirstMonNum
        if (LeapNumAvgNext <= 0) {
            LeapNumAvgNext += 12
            ifAdvance = 1
        } else if (LeapNumAvgNext >= 13) {
            LeapNumAvgNext -= 12
            ifPost = 1
        }
    }
    let LeapNumPos = 0
    let LeapNumOriginPos = 0
    if (ifTermLeap) {
        LeapNumPos = LeapNumAvgThis
    } else {
        LeapNumPos = FirstMonNum > 0 ? LeapNumAvgNext : LeapNumAvgThis
    }
    if (LeapNumPos) {
        LeapNumOriginPos = (LeapNumPos + FirstOriginMonDif + 12) % 12
        if (LeapNumOriginPos == 0) {
            LeapNumOriginPos = 12
        }
    }
    let ifFirstMonPos = 0
    if (FirstMonNum > 0) { // 建丑建寅閏月使正月推遲一月
        ifFirstMonPos = ifLeapAvgThis
    }
    let ifFirstMonAccum = 0
    let ifTermQua = 0
    let ifMonQua = 0
    let ifTermAdvan = 0
    let ifFirstMonAdvan = 0
    let ifFirstMonAccumMonAdvan = 0
    if (ifTermLeap) {
        ifTermAdvan = 1
        if (FirstMonNum > 0) {
            ifFirstMonAccumMonAdvan = -1
            if (((ifLeapAvgNext && !ifLeapAvgThis) || (LeapSurAvgPrev && !ifLeapAvgThis))) {
                ifFirstMonAccum = 1
            }
            if (!ifLeapAvgThis && ifLeapAvgNext && ifAdvance) {
                ifTermQua = 0
                ifMonQua = 1
            } else if (ifLeapAvgThis && !ifLeapAvgNext && ifAdvance) {
                ifTermQua = -1
                ifFirstMonAdvan = 1
                ifMonQua = -1
            }
        }
        if (!ifFirstMonPos) {
            ifTermAdvan = 0
        }
    }
    const FirstMonAccumMon = Math.floor((BuYear - 1) * 235 / 19 + WsolsticeOriginMon) + FirstMonNum + ifFirstMonPos + ifFirstMonAccum + ifFirstMonAccumMonAdvan + ifFirstMonAdvan // 正月積月
    const FirstMonAccumRaw = FirstMonAccumMon * lunar + OriginCorr // 正月積日
    const FirstMonGreatSur = Math.floor(parseFloat(((FirstMonAccumRaw % 60 + 60) % 60).toPrecision(12)))
    const FirstMonSmallSur = parseFloat(((FirstMonAccumRaw - Math.floor(FirstMonAccumRaw)) * LunarDenominator).toPrecision(9))
    // 朔望
    const FirstAvgRaw = []
    const FirstAvgMod = []
    const FirstOrderRaw = []
    const FirstOrderMod = []
    const FirstSC = []
    const FirstDecimal = []
    const SyzygyAvgMod = []
    const SyzygyOrderMod = []
    const SyzygySC = []
    const SyzygyDecimal = []
    for (let i = 1; i <= 12 + ifLeapAvgPos + ifMonQua; i++) {
        FirstAvgRaw[i] = parseFloat((FirstMonAccumRaw + (i - 1) * lunar + BuSCorder).toPrecision(12))
        FirstAvgMod[i] = (FirstAvgRaw[i] % 60 + 60) % 60
        FirstOrderRaw[i] = Math.floor(FirstAvgRaw[i])
        FirstOrderMod[i] = Math.floor(FirstAvgMod[i])
        FirstSC[i] = SClist[FirstOrderMod[i]]
        FirstDecimal[i] = ((FirstAvgRaw[i] - FirstOrderRaw[i]).toFixed(4)).slice(2, 6)
        SyzygyAvgMod[i] = parseFloat((((FirstMonAccumRaw + (i - 0.5) * lunar + BuSCorder) % 60 + 60) % 60).toPrecision(12))
        SyzygyOrderMod[i] = Math.floor(SyzygyAvgMod[i])
        SyzygySC[i] = SClist[SyzygyOrderMod[i]]
        SyzygyDecimal[i] = ((SyzygyAvgMod[i] - SyzygyOrderMod[i]).toFixed(4)).slice(2, 6)
    }

    // 中氣
    let ifTermAdv = 0
    let LeapNumTerm = 0
    if (ifTermLeap) {
        if (!ifLeapAvgThis && ifAdvance) {
            LeapNumTerm = LeapNumAvgNext
        } else {
            LeapNumTerm = LeapNumAvgThis
        }
    } else {
        if (ifAdvance) {
            LeapNumTerm = LeapNumAvgNext
        } else {
            LeapNumTerm = LeapNumAvgThis
        }
        if (ifLeapAvgThis && !ifAdvance && FirstMonNum > 0) {
            ifTermAdv = 1
        }
    }
    const TermAvgRaw = []
    const TermAvgMod = []
    const TermOrderMod = []
    const TermSC = []
    const TermDecimal = []
    if ((ifTermLeap && !LeapNumTerm) || (!ifTermLeap && ((!ifLeapAvgThis && !ifLeapAvgNext) || (!ifLeapAvgThis && !ifAdvance) || (ifLeapAvgThis && ifAdvance)))) {
        for (let i = 1; i <= 12 + (ifTermLeap ? 0 : ifLeapAvgPos); i++) {
            TermAvgRaw[i] = WsolsticeAccumRaw + (i + FirstMonNum - 1 + ifTermAdvan) * TermLeng + BuSCorder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = Math.floor(TermAvgMod[i])
            TermSC[i] = SClist[TermOrderMod[i]]
            TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
        }

    } else if ((ifTermLeap && LeapNumTerm && (ifLeapAvgThis || (ifAdvance && ifMonQua))) || (!ifTermLeap && (!ifLeapAvgThis && ifAdvance) || (ifLeapAvgThis && !ifAdvance))) {
        for (let i = 1; i <= 12; i++) {
            TermAvgRaw[i] = WsolsticeAccumRaw + (i + FirstMonNum - 1 + ifTermAdv) * TermLeng + BuSCorder
            TermAvgMod[i] = parseFloat((((TermAvgRaw[i]) % 60 + 60) % 60).toPrecision(12))
            TermOrderMod[i] = Math.floor(TermAvgMod[i])
            TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
        }
        while ((LeapNumTerm >= 0 + (ifTermLeap ? 1 : 0)) && (TermAvgRaw[LeapNumTerm] >= FirstOrderRaw[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < FirstOrderRaw[LeapNumTerm + 1] + 2)) {
            LeapNumTerm -= 1
        }
        while (LeapNumTerm <= 11 && (TermAvgRaw[LeapNumTerm + 1] < FirstOrderRaw[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= FirstOrderRaw[LeapNumTerm + 2] - 2)) {
            LeapNumTerm += 1
        }
        for (let i = 1; i <= 13 - ifTermAdv + ifTermQua; i++) {
            if (i <= LeapNumTerm) {
                TermAvgRaw[i] = WsolsticeAccumRaw + (i + FirstMonNum - 1 + ifTermAdv) * TermLeng + BuSCorder
                TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermSC[i] = SClist[TermOrderMod[i]]
                TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
            } else if (i == LeapNumTerm + 1) {
                TermOrderMod[i] = 62
                TermSC[i] = SClist[TermOrderMod[i]]
                TermDecimal[i] = '□□'
            } else {
                TermAvgRaw[i] = WsolsticeAccumRaw + (i + FirstMonNum - 2 + ifTermAdv) * TermLeng + BuSCorder
                TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermSC[i] = SClist[TermOrderMod[i]]
                TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
            }
        }
    }

    const Month = []
    if (ifTermLeap) {
        if (LeapNumTerm && (ifLeapAvgThis || (ifLeapAvgNext && ifAdvance))) {
            for (let i = 1; i <= 13; i++) {
                if (i <= LeapNumTerm) {
                    Month[i] = (i + FirstOriginMonDif + 12) % 12
                } else if (i == LeapNumTerm + 1) {
                    Month[i] = '閏'
                } else {
                    Month[i] = (i + FirstOriginMonDif + 11) % 12
                }
                if (Month[i] == 0) {
                    Month[i] = 12
                }
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                Month[i] = (i + FirstOriginMonDif + 12) % 12
                if (Month[i] == 0) {
                    Month[i] = 12
                }
            }
        }
    } else {
        if (ifLeapAvgPos) {
            for (let i = 1; i <= 12 + ifLeapAvgPos; i++) {
                if (i <= LeapNumPos) {
                    Month[i] = (i + FirstOriginMonDif + 12) % 12
                } else if (i == LeapNumPos + 1) {
                    Month[i] = '閏'
                } else {
                    Month[i] = (i + FirstOriginMonDif + 11) % 12
                }
                if (Month[i] == 0) {
                    Month[i] = 12
                }
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                Month[i] = (i + FirstOriginMonDif + 12) % 12
                if (Month[i] == 0) {
                    Month[i] = 12
                }
            }
        }
    }

    const MonthPrint = Month.slice(1)
    const FirstSCPrint = FirstSC.slice(1)
    const FirstDecimalPrint = FirstDecimal.slice(1)
    const SyzygySCPrint = SyzygySC.slice(1)
    const SyzygyDecimalPrint = SyzygyDecimal.slice(1)
    const TermSCPrint = TermSC.slice(1)
    const TermDecimalPrint = TermDecimal.slice(1)
    let YearInfo = `${CalendarName[AncientPre]} ${OriginYear}`
    if (ifTong) {
        YearInfo += `${SClist[BuSCorder]}統${BuYear}${JupiterSC}`
    } else {
        YearInfo += `${JiList[JiOrder]}紀${SClist[BuSCorder]}蔀${BuYear}`
    }
    YearInfo += `  大餘${FirstMonGreatSur}大餘${FirstMonSmallSur}  冬至${parseFloat((WsolsticeAccumMod).toPrecision(6))}`
    if (WsolsticeOriginDif == -45.65625) {
        YearInfo += `立春${parseFloat((OriginAccumMod).toPrecision(6))}`
    } else if (WsolsticeOriginDif == -60.875) {
        YearInfo += `雨水${parseFloat((OriginAccumMod).toPrecision(6))}`
    }
    YearInfo += `  閏餘${((LeapSurAvgPos).toFixed(4)).slice(2, 6)}`
    if (ifTermLeap) {
        if (LeapNumTerm) {
            YearInfo += `閏${LeapNumTerm}`
        }
    } else {
        if (LeapNumOriginPos) {
            YearInfo += `閏${LeapNumOriginPos}`
        }
    }
    return {
        YearInfo,
        MonthPrint,
        FirstSCPrint,
        FirstDecimalPrint,
        SyzygySCPrint,
        SyzygyDecimalPrint,
        TermSCPrint,
        TermDecimalPrint,
    }
}
module.exports = CalAncient