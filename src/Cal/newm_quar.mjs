import {
    ScList,
    TermList,
} from './para_constant.mjs'
import ChoosePara from './para_1.mjs'

export default function CalQuar(CalName, year) {
    const {
        Lunar,
        Solar,
        WsolsticeOriginDif,
        WsolsticeOriginMon,
        OriginAd,
        OriginYearSc,
        OriginDayCorr,
        OriginCorr,
        ZhengNum,
        OriginMonNum,
        YuanRange,
        TongRange,
        isTermLeap,
        Ecli,
        EcliRange,
    } = ChoosePara[CalName]
    let {
        JiRange,
        BuRange,
    } = ChoosePara[CalName]
    if (CalName === 'Taichu') {
        JiRange = YuanRange
        BuRange = TongRange
    }
    const BuSkip = Solar * BuRange % 60
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const ZhengOriginDif = ZhengNum - OriginMonNum // 年首和正月的差
    let OriginYear = year - OriginAd // 上元積年（算上）
    let JupiterSc = ''
    if (CalName === 'Taichu') {
        JupiterSc = ScList[(Math.floor(OriginYear % 1728 * 145 / 144) + OriginYearSc) % 60] // 三統曆太歲
    }
    const JiOrder = Math.floor(OriginYear % YuanRange / JiRange) // 入第幾紀
    const BuYear = OriginYear % YuanRange % JiRange % BuRange + 1 // 入蔀（統）第幾年
    const BuOrder = Math.floor(OriginYear % YuanRange % JiRange / BuRange) // 入第幾蔀（統）
    const BuScorder = (1 + BuOrder * BuSkip + (OriginDayCorr ? OriginDayCorr : 0)) % 60 // 蔀（統）的干支序號
    const WsolsticeAccumRaw = (BuYear - 1) * Solar + (WsolsticeOriginDif ? WsolsticeOriginDif : 0) + (OriginCorr ? OriginCorr : 0) // 冬至積日
    const WsolsticeAccumMod = (WsolsticeAccumRaw % 60 + 60) % 60
    const OriginAccum = WsolsticeAccumRaw - (WsolsticeOriginDif ? WsolsticeOriginDif : 0) // 曆元積日
    const LeapSurAvgThis = parseFloat(((((BuYear - 1) * 7 / 19 - Math.floor((BuYear - 1) * 7 / 19) + (WsolsticeOriginMon ? WsolsticeOriginMon : 0)) % 1 + 1) % 1).toPrecision(11)) // 今年閏餘
    const LeapSurAvgPrev = parseFloat(((((BuYear - 2) * 7 / 19 - Math.floor((BuYear - 2) * 7 / 19) + (WsolsticeOriginMon ? WsolsticeOriginMon : 0)) % 1 + 1) % 1).toPrecision(11)) // 上年閏餘
    const LeapSurAvgNext = parseFloat((((BuYear * 7 / 19 - Math.floor(BuYear * 7 / 19) + (WsolsticeOriginMon ? WsolsticeOriginMon : 0)) % 1 + 1) % 1).toPrecision(11))
    let isLeapAvgThis = LeapSurAvgThis >= parseFloat((12 / 19).toPrecision(11)) ? 1 : 0 // 是否有閏月
    let isLeapAvgPrev = LeapSurAvgPrev >= parseFloat((12 / 19).toPrecision(11)) ? 1 : 0
    let isLeapAvgNext = LeapSurAvgNext >= parseFloat((12 / 19).toPrecision(11)) ? 1 : 0
    let LeapNumAvgThis = isLeapAvgThis ? Math.floor(parseFloat(((1 - LeapSurAvgThis) * 228 / 7).toPrecision(12))) : 0 // 閏餘法今年閏月
    let LeapNumAvgPrev = isLeapAvgPrev ? Math.floor(parseFloat(((1 - LeapSurAvgPrev) * 228 / 7).toPrecision(12))) : 0
    let LeapNumAvgNext = isLeapAvgNext ? Math.floor(parseFloat(((1 - LeapSurAvgNext) * 228 / 7).toPrecision(12))) : 0
    // 固定冬至法
    let LeapSurAvgFix = 0
    let isLeapAvgFix = 0
    if (!isTermLeap) {
        LeapSurAvgFix = ZhengNum > 0 ? LeapSurAvgNext : LeapSurAvgThis
        isLeapAvgFix = ZhengNum > 0 ? isLeapAvgNext : isLeapAvgThis
    }
    // 上面的Fix將參數固定下來，接下來要修改這些參數了。考慮了建正之後的閏月數：
    let isAdvance = 0
    let isPost = 0
    if (LeapNumAvgNext) {
        LeapNumAvgNext -= ZhengNum
        if (LeapNumAvgNext <= 0) {
            LeapNumAvgThis = LeapNumAvgNext + 12
            isLeapAvgThis = 1
            isLeapAvgNext = 0
            isAdvance = 1
        }
    } else if (LeapNumAvgThis) {
        LeapNumAvgThis -= ZhengNum
        if (LeapNumAvgThis <= 0) {
            LeapNumAvgThis = 0
            isLeapAvgThis = 0
            isLeapAvgPrev = 1
            isAdvance = 1
        } else if (LeapNumAvgThis >= 13) {
            LeapNumAvgThis = 0
            isLeapAvgThis = 0
            isLeapAvgNext = 1
            isPost = 1
        }
    } else if (LeapNumAvgPrev) {
        LeapNumAvgPrev -= ZhengNum
        if (LeapNumAvgPrev >= 13) {
            LeapNumAvgThis = LeapNumAvgPrev + 12
            isLeapAvgThis = 1
            isLeapAvgPrev = 0
            isPost = 1
        }
    }
    // 閏餘法閏月
    let LeapNumOriginLeapSur = 0
    if (LeapNumAvgThis) {
        LeapNumOriginLeapSur = Math.round((LeapNumAvgThis + ZhengOriginDif + 12) % 12.1)
        // if (LeapNumOriginLeapSur === 0) {
        //     LeapNumOriginLeapSur = 12
        // }
    }
    // 朔望
    const NewmAvgBare = []
    const NewmAvgRaw = []
    const NewmAvgMod = []
    const NewmOrderRaw = []
    const NewmOrderMod = []
    const NewmAvgSc = []
    const NewmAvgDecimal = []
    const SyzygyAvgRaw = []
    const SyzygyAvgMod = []
    const SyzygyOrderMod = []
    let SyzygySc = []
    const SyzygyDecimal = []
    for (let i = 0; i <= 13; i++) { // 本來是1，不知道改成1可不可以
        NewmAvgBare[i] = parseFloat(((Math.floor((BuYear - 1) * 235 / 19 + (WsolsticeOriginMon ? WsolsticeOriginMon : 0)) + ZhengNum + i - 1) * Lunar + (OriginCorr ? OriginCorr : 0)).toPrecision(12))
        NewmAvgRaw[i] = NewmAvgBare[i] + BuScorder
        NewmAvgMod[i] = (NewmAvgRaw[i] % 60 + 60) % 60
        NewmOrderRaw[i] = Math.floor(NewmAvgRaw[i])
        NewmOrderMod[i] = Math.floor(NewmAvgMod[i])
        NewmAvgSc[i] = ScList[NewmOrderMod[i]]
        NewmAvgDecimal[i] = ((NewmAvgRaw[i] - NewmOrderRaw[i]).toFixed(5)).slice(2, 7)
        // NewmJd[i] = Math.round(parseFloat((JdOrigin + (Math.floor((Math.round(parseFloat((JdWsolstice + year * Solar).toPrecision(14))) - JdOrigin) / Lunar) + ZhengNum + i - 1) * Lunar).toPrecision(14)))

        SyzygyAvgRaw[i] = parseFloat(((Math.floor((BuYear - 1) * 235 / 19 + (WsolsticeOriginMon ? WsolsticeOriginMon : 0)) + ZhengNum + i - 0.5) * Lunar + (OriginCorr ? OriginCorr : 0)).toPrecision(12)) + BuScorder
        SyzygyAvgMod[i] = (SyzygyAvgRaw[i] % 60 + 60) % 60
        SyzygyOrderMod[i] = Math.floor(SyzygyAvgMod[i])
        SyzygySc[i] = ScList[SyzygyOrderMod[i]]
        SyzygyDecimal[i] = ((SyzygyAvgMod[i] - SyzygyOrderMod[i]).toFixed(5)).slice(2, 7)
    }
    // 月食
    let EcliAccum = 0
    if (Ecli) {
        EcliAccum = Ecli * ((OriginYear % EcliRange) * (Solar / Lunar) / Ecli - Math.floor((OriginYear % EcliRange) * (Solar / Lunar) / Ecli))
        for (let k = 1; k <= 3; k++) {
            const a = Math.floor(Ecli * k - EcliAccum)
            SyzygySc[a] += '◐'
        } // 四分要看具體時刻，如果在晝則望，在夜則望前一日
    }
    // const NewmMmdd = Jd2Date(NewmJd)
    // 中氣
    let LeapNumTerm = LeapNumAvgThis
    const TermAvgBare = []
    const TermAvgRaw = []
    const TermAvgMod = []
    const TermOrderMod = []
    const TermSc = []
    const TermName = []
    const TermDecimal = []
    // const TermJd = []
    if ((isTermLeap && !LeapNumTerm) || (!isTermLeap && ((!isLeapAvgThis && !isLeapAvgNext) || (!isLeapAvgThis && !isAdvance) || (!isLeapAvgThis && isAdvance)))) {
        for (let i = 1; i <= 13; i++) {
            TermAvgBare[i] = WsolsticeAccumRaw + (i + ZhengNum - 1) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScorder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = Math.floor(TermAvgMod[i])
            TermName[i] = TermList[(i + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(5)).slice(2, 7)
        }
    } else {
        for (let i = 1; i <= 12; i++) {
            TermAvgBare[i] = WsolsticeAccumRaw + (i + ZhengNum - 1) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScorder
            TermAvgMod[i] = parseFloat((((TermAvgRaw[i]) % 60 + 60) % 60).toPrecision(12))
            TermOrderMod[i] = Math.floor(TermAvgMod[i])
            TermName[i] = TermList[(i + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(5)).slice(2, 7)
        }
        while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmOrderRaw[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmOrderRaw[LeapNumTerm + 1] + 2)) {
            LeapNumTerm -= 1
        }
        while (LeapNumTerm <= 11 && (TermAvgRaw[LeapNumTerm + 1] < NewmOrderRaw[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmOrderRaw[LeapNumTerm + 2] - 2)) {
            LeapNumTerm += 1
        }
        TermName[LeapNumTerm + 1] = '□'
        TermSc[LeapNumTerm + 1] = '□'
        TermDecimal[LeapNumTerm + 1] = '□'
        // TermJd[LeapNumTerm + 1] = '□'
        for (let i = LeapNumTerm + 2; i <= 13; i++) {
            TermAvgBare[i] = WsolsticeAccumRaw + (i + ZhengNum - 2) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScorder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = Math.floor(TermAvgMod[i])
            TermName[i] = TermList[(i - 1 + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(5)).slice(2, 7)
        }
    }
    // 最後是積月、月數
    let NewmSyzygyStart = 0
    let NewmSyzygyEnd = 0
    if ((isAdvance && isLeapAvgPrev) || (!isTermLeap && ZhengNum > 0 && !isAdvance && isLeapAvgThis)) {
        NewmSyzygyStart = 1
    }
    if ((isTermLeap && isLeapAvgThis) || isLeapAvgFix) {
        NewmSyzygyEnd = 1
    } else {
        NewmSyzygyEnd = NewmSyzygyStart
    }
    let TermStart = NewmSyzygyStart
    let TermEnd = NewmSyzygyEnd
    if ((isAdvance && isLeapAvgPrev)) {
        TermStart = 0
    }
    if (NewmSyzygyStart && NewmSyzygyStart && !TermStart) {
        TermEnd = 0
    }
    return {
        Solar,
        OriginYear,
        JiOrder,
        BuYear,
        BuScorder,
        JupiterSc,
        WsolsticeAccumMod,
        OriginAccum,
        NewmAvgBare,
        NewmAvgRaw,
        NewmOrderRaw,
        NewmOrderMod,
        NewmAvgSc,
        // NewmJd,
        // NewmMmdd,
        NewmAvgDecimal,
        SyzygySc,
        SyzygyDecimal,
        TermAvgBare,
        TermAvgRaw,
        TermName,
        TermSc,
        TermDecimal,
        LeapSurAvgFix,
        LeapSurAvgThis,
        LeapNumOriginLeapSur,
        LeapNumTerm,
        isAdvance,
        isPost,
        isLeapAvgFix,
        isLeapAvgThis,
        isLeapAvgNext,
        NewmSyzygyStart,
        NewmSyzygyEnd,
        TermStart,
        TermEnd,
    }
}