import { ScList, TermNameList, AutoDegAccumList, deci } from './para_constant.mjs'
import Para from './para_calendars.mjs'
import { mansion, midstar } from './astronomy_other.mjs'

export default (Name, Y) => {
    const { Lunar, Solar, SolsOriginDif, SolsOriginMon,
        OriginAd, OriginYearSc, BuScConst, ZhengNum, OriginMonNum,
        YuanRange, TongRange, isTermLeap, EcliRange, EcliNumer, MansionRaw
    } = Para[Name]
    let { JiRange, BuRange, SolsConst, DayConst } = Para[Name]
    if (Name === 'Taichu') {
        JiRange = YuanRange
        BuRange = TongRange
    }
    SolsConst = SolsConst || 0
    DayConst = DayConst || 0
    const BuSkip = ['Qianzaodu', 'Yuanmingbao'].includes(Name) ? 365.25 * BuRange % 60 : Solar * BuRange % 60
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const ZhengSd = ZhengNum - OriginMonNum // 年首和正月的差
    let OriginYear = Y - OriginAd // 上元積年（算上）
    const JupiterSc = Name === 'Taichu' ? ScList[(~~(OriginYear % 1728 * 145 / 144) + OriginYearSc) % 60] : '' // 三統曆太歲
    const JiOrder = ~~(OriginYear % YuanRange / JiRange) // 入第幾紀
    const BuYear = OriginYear % YuanRange % JiRange % BuRange + 1 // 入蔀（統）第幾年
    const BuOrder = ~~(OriginYear % YuanRange % JiRange / BuRange) // 入第幾蔀（統）
    const BuScOrder = (1 + BuOrder * BuSkip + (BuScConst || 0)) % 60 // 蔀（統）的干支序號
    const SolsAccumRaw = (BuYear - 1) * Solar + (SolsOriginDif || 0) + SolsConst + DayConst // 冬至積日
    const SolsAccumMod = (SolsAccumRaw % 60 + 60) % 60
    const SolsAccum = SolsAccumRaw - (SolsOriginDif || 0) // 曆元積日
    const SolsDeci = deci(SolsAccumRaw)
    const LeapSurAvgThis = parseFloat((((deci((BuYear - 1) * 7 / 19) + (SolsOriginMon || 0)) % 1 + 1) % 1).toPrecision(11)) // 今年閏餘
    const LeapSurAvgPrev = parseFloat((((deci((BuYear - 2) * 7 / 19) + (SolsOriginMon || 0)) % 1 + 1) % 1).toPrecision(11)) // 上年閏餘
    const LeapSurAvgNext = parseFloat((((deci(BuYear * 7 / 19) + (SolsOriginMon || 0)) % 1 + 1) % 1).toPrecision(11))
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
    const LeapNumOriginLeapSur = LeapNumAvgThis ? Math.round(((LeapNumAvgThis + ZhengSd + 12) % 12 + 12) % 12.1) : 0
    const EquaAccumList = MansionRaw ? AutoDegAccumList(Name, Y).EquaAccumList : []
    // 朔望
    const NewmAvgBare = [], NewmAvgRaw = [], NewmInt = [], NewmAvgSc = [], NewmSd = [], NewmAvgDeci = [], NewmEqua = [], SyzygyAvgRaw = [], SyzygyAvgMod = [], SyzygyOrderMod = [], SyzygyDeci = []
    let SyzygySc = []
    for (let i = 0; i <= 14; i++) { // 本來是1
        NewmAvgBare[i] = parseFloat(((~~((BuYear - 1) * 235 / 19 + (SolsOriginMon || 0)) + ZhengNum + i - 1) * Lunar + SolsConst + DayConst).toPrecision(14))
        NewmAvgRaw[i] = NewmAvgBare[i] + BuScOrder
        NewmInt[i] = ~~NewmAvgRaw[i]
        NewmAvgSc[i] = ScList[(NewmInt[i] % 60 + 60) % 60]
        NewmAvgDeci[i] = (NewmAvgRaw[i] - NewmInt[i]).toFixed(4).slice(2, 6)
        NewmSd[i] = NewmAvgBare[i] - SolsAccumRaw
        if (MansionRaw) NewmEqua[i] = mansion(Name, Y, undefined, NewmSd[i]).Equa
        // NewmJd[i] = Math.round(parseFloat((JdOrigin + (~~((Math.round(parseFloat((JdSols + Y * Solar).toPrecision(14))) - JdOrigin) / Lunar) + ZhengNum + i - 1) * Lunar).toPrecision(14)))
        SyzygyAvgRaw[i] = parseFloat(((~~((BuYear - 1) * 235 / 19 + (SolsOriginMon || 0)) + ZhengNum + i - .5) * Lunar + SolsConst).toPrecision(14)) + BuScOrder
        SyzygyAvgMod[i] = (SyzygyAvgRaw[i] % 60 + 60) % 60
        SyzygyOrderMod[i] = ~~SyzygyAvgMod[i]
        SyzygySc[i] = ScList[SyzygyOrderMod[i]]
        SyzygyDeci[i] = (SyzygyAvgMod[i] - SyzygyOrderMod[i]).toFixed(4).slice(2, 6)
    }
    // 月食
    let EcliAccum = 0
    if (EcliNumer) {
        EcliAccum = EcliRange * deci((OriginYear % EcliNumer) * (Solar / Lunar) / EcliRange)
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
            TermAvgBare[i] = SolsAccumRaw + (i + ZhengNum - 1) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScOrder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = ~~TermAvgMod[i]
            TermName[i] = TermNameList[(i + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
            if (MansionRaw) {
                const TermSd = TermAvgBare[i] - SolsAccumRaw
                TermEqua[i] = mansion(Name, Y, undefined, TermSd).Equa
                TermDuskstar[i] = midstar(Name, Y, undefined, TermSd, SolsDeci)
            }
        }
    } else {
        for (let i = 1; i <= 12; i++) {
            TermAvgBare[i] = SolsAccumRaw + (i + ZhengNum - 1) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScOrder
            TermAvgMod[i] = parseFloat((((TermAvgRaw[i]) % 60 + 60) % 60).toPrecision(12))
            TermOrderMod[i] = ~~TermAvgMod[i]
            TermName[i] = TermNameList[(i + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
            if (MansionRaw) {
                const TermSd = TermAvgBare[i] - SolsAccumRaw
                TermEqua[i] = mansion(Name, Y, undefined, TermSd).Equa
                TermDuskstar[i] = midstar(Name, Y, undefined, TermSd, SolsDeci)
            }
        }
        while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + 2)) {
            LeapNumTerm--
        }
        while (LeapNumTerm <= 11 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - 2)) {
            LeapNumTerm++
        }
        TermName[LeapNumTerm + 1] = '无中'
        TermSc[LeapNumTerm + 1] = ''
        TermDeci[LeapNumTerm + 1] = ''
        if (MansionRaw) {
            TermEqua[LeapNumTerm + 1] = ''
            TermDuskstar[LeapNumTerm + 1] = ''
        }
        // TermJd[LeapNumTerm + 1] = ''
        for (let i = LeapNumTerm + 2; i <= 13; i++) {
            TermAvgBare[i] = SolsAccumRaw + (i + ZhengNum - 2) * TermLeng
            TermAvgRaw[i] = TermAvgBare[i] + BuScOrder
            TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
            TermOrderMod[i] = ~~TermAvgMod[i]
            TermName[i] = TermNameList[(i - 1 + ZhengNum + 12) % 12]
            TermSc[i] = ScList[TermOrderMod[i]]
            TermDeci[i] = (TermAvgMod[i] - TermOrderMod[i]).toFixed(4).slice(2, 6)
            if (MansionRaw) {
                const TermSd = TermAvgBare[i] - SolsAccumRaw
                TermEqua[i] = mansion(Name, Y, undefined, TermSd).Equa
                TermDuskstar[i] = midstar(Name, Y, undefined, TermSd, SolsDeci)
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
        SolsAccumMod, SolsAccum,
        NewmAvgBare, NewmAvgRaw, NewmInt, NewmAvgSc, NewmAvgDeci,
        SyzygySc, SyzygyDeci,
        TermName, TermSc, TermDeci,
        LeapSurAvgFix, LeapSurAvgThis, LeapNumOriginLeapSur, LeapNumTerm,
        isAdvance, isPost, isLeapAvgFix, isLeapAvgThis, isLeapAvgNext, NewmStart, NewmEnd, TermStart, TermEnd,
        NewmEqua, TermEqua, TermDuskstar
    }
}