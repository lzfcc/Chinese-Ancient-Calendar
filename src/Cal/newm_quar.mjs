import { ScList, TermList, AutoDegAccumList } from './para_constant.mjs'
import Para from './para_calendars.mjs'
import { Accum2Mansion } from './astronomy_other.mjs'

export default (CalName, year) => {
    const { Lunar, Solar, WinsolsOriginDif, WinsolsOriginMon,
        OriginAd, OriginYearSc, BuScCorr, ZhengNum, OriginMonNum,
        YuanRange, TongRange, isTermLeap, EcliRange, EcliNumer, MansionRaw
    } = Para[CalName]
    let { JiRange, BuRange, WinsolsCorr, DayCorr } = Para[CalName]
    if (CalName === 'Taichu') {
        JiRange = YuanRange
        BuRange = TongRange
    }
    WinsolsCorr = WinsolsCorr || 0
    DayCorr = DayCorr || 0
    const BuSkip = ['Qianzaodu', 'Yuanmingbao'].includes(CalName) ? 365.25 * BuRange % 60 : Solar * BuRange % 60
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const ZhengWinsolsDif = ZhengNum - OriginMonNum // 年首和正月的差
    let OriginYear = year - OriginAd // 上元積年（算上）
    const JupiterSc = CalName === 'Taichu' ? ScList[(~~(OriginYear % 1728 * 145 / 144) + OriginYearSc) % 60] : '' // 三統曆太歲
    const JiOrder = ~~(OriginYear % YuanRange / JiRange) // 入第幾紀
    const BuYear = OriginYear % YuanRange % JiRange % BuRange + 1 // 入蔀（統）第幾年
    const BuOrder = ~~(OriginYear % YuanRange % JiRange / BuRange) // 入第幾蔀（統）
    const BuScOrder = (1 + BuOrder * BuSkip + (BuScCorr || 0)) % 60 // 蔀（統）的干支序號
    const WinsolsAccumRaw = (BuYear - 1) * Solar + (WinsolsOriginDif || 0) + WinsolsCorr + DayCorr // 冬至積日
    const WinsolsAccumMod = (WinsolsAccumRaw % 60 + 60) % 60
    const OriginAccum = WinsolsAccumRaw - (WinsolsOriginDif || 0) // 曆元積日
    const WinsolsDeci = WinsolsAccumRaw - ~~WinsolsAccumRaw
    const LeapSurAvgThis = parseFloat(((((BuYear - 1) * 7 / 19 - ~~((BuYear - 1) * 7 / 19) + (WinsolsOriginMon || 0)) % 1 + 1) % 1).toPrecision(11)) // 今年閏餘
    const LeapSurAvgPrev = parseFloat(((((BuYear - 2) * 7 / 19 - ~~((BuYear - 2) * 7 / 19) + (WinsolsOriginMon || 0)) % 1 + 1) % 1).toPrecision(11)) // 上年閏餘
    const LeapSurAvgNext = parseFloat((((BuYear * 7 / 19 - ~~(BuYear * 7 / 19) + (WinsolsOriginMon || 0)) % 1 + 1) % 1).toPrecision(11))
    let isLeapAvgThis = LeapSurAvgThis >= parseFloat((12 / 19).toPrecision(11)) // 是否有閏月
    let isLeapAvgPrev = LeapSurAvgPrev >= parseFloat((12 / 19).toPrecision(11))
    let isLeapAvgNext = LeapSurAvgNext >= parseFloat((12 / 19).toPrecision(11))
    let LeapNumAvgThis = isLeapAvgThis ? ~~(parseFloat(((1 - LeapSurAvgThis) * 228 / 7).toPrecision(12))) : 0 // 閏餘法今年閏月
    let LeapNumAvgPrev = isLeapAvgPrev ? ~~(parseFloat(((1 - LeapSurAvgPrev) * 228 / 7).toPrecision(12))) : 0
    let LeapNumAvgNext = isLeapAvgNext ? ~~(parseFloat(((1 - LeapSurAvgNext) * 228 / 7).toPrecision(12))) : 0
    // 固定冬至法
    let LeapSurAvgFix = 0, isLeapAvgFix = 0, isAdvance = 0, isPost = 0
    if (!isTermLeap) {
        LeapSurAvgFix = ZhengNum > 0 ? LeapSurAvgNext : LeapSurAvgThis
        isLeapAvgFix = ZhengNum > 0 ? isLeapAvgNext : isLeapAvgThis
    }
    // 上面的Fix將參數固定下來，接下來要修改這些參數了。考慮了建正之後的閏月數：
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
    const LeapNumOriginLeapSur = LeapNumAvgThis ? Math.round(((LeapNumAvgThis + ZhengWinsolsDif + 12) % 12 + 12) % 12.1) : 0
    const EquaDegAccumList = MansionRaw ? AutoDegAccumList(CalName, year) : []
    // 朔望
    const NewmAvgBare = [], NewmAvgRaw = [], NewmInt = [], NewmAvgSc = [], NewmWinsolsDifRaw = [], NewmAvgDeci = [], NewmEqua = [], SyzygyAvgRaw = [], SyzygyAvgMod = [], SyzygyOrderMod = [], SyzygyDeci = []
    let SyzygySc = []
    for (let i = 0; i <= 14; i++) { // 本來是1
        NewmAvgBare[i] = parseFloat(((~~((BuYear - 1) * 235 / 19 + (WinsolsOriginMon || 0)) + ZhengNum + i - 1) * Lunar + WinsolsCorr).toPrecision(14))
        NewmAvgRaw[i] = NewmAvgBare[i] + BuScOrder
        NewmInt[i] = ~~NewmAvgRaw[i]
        NewmAvgSc[i] = ScList[(NewmInt[i] % 60 + 60) % 60]
        NewmAvgDeci[i] = (NewmAvgRaw[i] - NewmInt[i]).toFixed(4).slice(2, 6)
        NewmWinsolsDifRaw[i] = NewmAvgBare[i] - WinsolsAccumRaw
        if (MansionRaw) {
            NewmEqua[i] = Accum2Mansion(NewmAvgBare[i], EquaDegAccumList, CalName).MansionResult
        }
        // NewmJd[i] = Math.round(parseFloat((JdOrigin + (~~((Math.round(parseFloat((JdWinsols + year * Solar).toPrecision(14))) - JdOrigin) / Lunar) + ZhengNum + i - 1) * Lunar).toPrecision(14)))
        SyzygyAvgRaw[i] = parseFloat(((~~((BuYear - 1) * 235 / 19 + (WinsolsOriginMon || 0)) + ZhengNum + i - 0.5) * Lunar + WinsolsCorr).toPrecision(14)) + BuScOrder
        SyzygyAvgMod[i] = (SyzygyAvgRaw[i] % 60 + 60) % 60
        SyzygyOrderMod[i] = ~~SyzygyAvgMod[i]
        SyzygySc[i] = ScList[SyzygyOrderMod[i]]
        SyzygyDeci[i] = (SyzygyAvgMod[i] - SyzygyOrderMod[i]).toFixed(4).slice(2, 6)
    }
    // 月食
    let EcliAccum = 0
    if (EcliNumer) {
        EcliAccum = EcliRange * ((OriginYear % EcliNumer) * (Solar / Lunar) / EcliRange - ~~((OriginYear % EcliNumer) * (Solar / Lunar) / EcliRange))
        for (let k = 1; k <= 3; k++) {
            // NewmAvgSc[~~(EcliRange * k - EcliAccum)] += `<span class='eclipse-symbol'>◐</span>`
            SyzygySc[~~(EcliRange * k - EcliAccum)] += `<span class='eclipse-symbol'>◐</span>`
        } // 四分要看具體時刻，如果在晝則望，在夜則望前一日
    }
    // 中氣
    let LeapNumTerm = LeapNumAvgThis
    const TermAvgBare = [], TermAvgRaw = [], TermAvgMod = [], TermOrderMod = [], TermSc = [], TermName = [], TermDeci = [], TermEqua = [], TermDuskstar = []
    // const TermJd = []
    if ((isTermLeap && !LeapNumTerm) || (!isTermLeap && ((!isLeapAvgThis && !isLeapAvgNext) || (!isLeapAvgThis && !isAdvance) || (!isLeapAvgThis && isAdvance)))) {
        for (let i = 1; i <= 13; i++) {
            TermAvgBare[i] = WinsolsAccumRaw + (i + ZhengNum - 1) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScOrder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = ~~TermAvgMod[i]
            TermName[i] = TermList[(i + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
            if (MansionRaw) {
                const TermWinsolsDifRaw = TermAvgBare[i] - WinsolsAccumRaw
                const Func = Accum2Mansion(TermAvgBare[i], EquaDegAccumList, CalName, TermWinsolsDifRaw, WinsolsDeci)
                TermEqua[i] = Func.MansionResult
                TermDuskstar[i] = Func.DuskstarResult
            }
        }
    } else {
        for (let i = 1; i <= 12; i++) {
            TermAvgBare[i] = WinsolsAccumRaw + (i + ZhengNum - 1) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScOrder
            TermAvgMod[i] = parseFloat((((TermAvgRaw[i]) % 60 + 60) % 60).toPrecision(12))
            TermOrderMod[i] = ~~TermAvgMod[i]
            TermName[i] = TermList[(i + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
            if (MansionRaw) {
                const TermWinsolsDifRaw = TermAvgBare[i] - WinsolsAccumRaw
                const Func = Accum2Mansion(TermAvgBare[i], EquaDegAccumList, CalName, TermWinsolsDifRaw, WinsolsDeci)
                TermEqua[i] = Func.MansionResult
                TermDuskstar[i] = Func.DuskstarResult
            }
        }
        while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + 2)) {
            LeapNumTerm--
        }
        while (LeapNumTerm <= 11 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - 2)) {
            LeapNumTerm++
        }
        TermName[LeapNumTerm + 1] = '无'
        TermSc[LeapNumTerm + 1] = ''
        TermDeci[LeapNumTerm + 1] = ''
        if (MansionRaw) {
            TermEqua[LeapNumTerm + 1] = ''
            TermDuskstar[LeapNumTerm + 1] = ''
        }
        // TermJd[LeapNumTerm + 1] = ''
        for (let i = LeapNumTerm + 2; i <= 13; i++) {
            TermAvgBare[i] = WinsolsAccumRaw + (i + ZhengNum - 2) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScOrder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = ~~TermAvgMod[i]
            TermName[i] = TermList[(i - 1 + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDeci[i] = (TermAvgMod[i] - TermOrderMod[i]).toFixed(4).slice(2, 6)
            if (MansionRaw) {
                const TermWinsolsDifRaw = TermAvgBare[i] - WinsolsAccumRaw
                const Func = Accum2Mansion(TermAvgBare[i], EquaDegAccumList, CalName, TermWinsolsDifRaw, WinsolsDeci)
                TermEqua[i] = Func.MansionResult
                TermDuskstar[i] = Func.DuskstarResult
            }
        }
    }
    // 最後是積月、月數
    let NewmStart = 0, NewmEnd = 0
    if ((isAdvance && isLeapAvgPrev) || (!isTermLeap && ZhengNum > 0 && !isAdvance && isLeapAvgThis)) {
        NewmStart = 1
    }
    if ((isTermLeap && isLeapAvgThis) || isLeapAvgFix) {
        NewmEnd = 1
    } else {
        NewmEnd = NewmStart
    }
    let TermStart = NewmStart
    let TermEnd = NewmEnd
    if (isAdvance && isLeapAvgPrev) {
        TermStart = 0
    }
    if (NewmStart && NewmStart && !TermStart) {
        TermEnd = 0
    }
    return {
        OriginYear, JiOrder, BuYear, BuScOrder, JupiterSc,
        WinsolsAccumMod, OriginAccum,
        NewmAvgBare, NewmAvgRaw, NewmInt, NewmAvgSc, NewmAvgDeci,
        SyzygySc, SyzygyDeci,
        TermAvgBare, TermName, TermSc, TermDeci,
        LeapSurAvgFix, LeapSurAvgThis, LeapNumOriginLeapSur, LeapNumTerm,
        isAdvance, isPost, isLeapAvgFix, isLeapAvgThis, isLeapAvgNext, NewmStart, NewmEnd, TermStart, TermEnd,
        NewmEqua, TermEqua, TermDuskstar
    }
}