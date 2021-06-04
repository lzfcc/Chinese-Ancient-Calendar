import { ScList, AutoDegAccumList } from './para_constant.mjs'
import { Bind } from './bind.mjs'
import { AutoTcorr } from './astronomy_acrv.mjs'
import { ConstWest } from './astronomy_west.mjs'
import { Accum2Mansion, AutoNewmPlus, AutoSyzygySub, LeapAdjust } from './astronomy_other.mjs'
import { AutoEqua2Eclp } from './bind_astronomy.mjs'

export default (CalName, year) => {
    const { Type, AutoPara, isAcr, isNewmPlus } = Bind(CalName)
    const { Sidereal, SolarNumer, LunarNumer, Denom, Anoma, Node, AcrTermList,
        OriginAd, CloseOriginAd, OriginMonNum, ZhengNum,
        YuanRange, JiRange, ZhangRange, ZhangLeap,
        YinyangCorr, EcliCorr
    } = AutoPara[CalName]
    let { Solar, SolarRaw, Lunar, LunarRaw, ScCorr, NodeCorr, FirstCorr, AnomaCorr, MansionCorr, WinsolsCorr
    } = AutoPara[CalName]
    ScCorr = ScCorr || 0
    SolarRaw = SolarRaw || Solar
    LunarRaw = LunarRaw || Lunar
    FirstCorr = FirstCorr || 0
    NodeCorr = NodeCorr || 0
    AnomaCorr = Type === 11 ? AnomaCorr : (AnomaCorr / Denom || 0)
    MansionCorr = MansionCorr || 0
    WinsolsCorr = WinsolsCorr || 0
    const ZhangMon = Math.round(ZhangRange * (12 + ZhangLeap / ZhangRange))
    // const JiMon = JiRange * ZhangMon / ZhangRange
    const ZhengWinsolsDif = ZhengNum - OriginMonNum
    const OriginYear = year - OriginAd // 上元積年（算上）
    // const CloseWinsolsDif = CloseOriginAd - OriginAd // 距算
    const CloseOriginYear = year - CloseOriginAd // 距差    
    let SolarChangeAccum = 0
    let LunarChangeAccum = 0
    let signX = 1
    if (CalName === 'Tongtian') { // 《中國古代曆法》第610頁。如果不算消長的話就完全不對，因爲上元積年就考慮了消長
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
            Solar = SolarRaw - OriginYear / 15000000 // 這個是實際値
            SolarChangeAccum = signX * (OriginYear ** 2) / 30000000
            // Solar = SolarRaw - OriginYear / 1000000 // 授時歲實消長高了16倍
            // SolarChangeAccum = signX * (OriginYear ** 2) / 2000000
        }
    }
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const MonLeap = parseFloat((TermLeng - Lunar).toPrecision(14)) // 月閏，借鑑授時曆
    if (EcliCorr) {
        if (CalName === 'Yuanjia') {
            NodeCorr = Node * EcliCorr
        } else {
            NodeCorr = (Node / 2) * EcliCorr
        }
    }
    const SynodicAnomaDif = Lunar - Anoma
    const HalfSynodicNodeDif = (Lunar - Node) / 2
    let JiSkip = 0
    let JiOrder = 0
    let JiYear = 0
    let JiScOrder = 0
    if (JiRange) {
        JiSkip = Math.round(Solar * JiRange % 60)
        JiOrder = ~~(OriginYear % YuanRange / JiRange) // 入第幾紀
        JiYear = OriginYear % YuanRange % JiRange + 1 // 入紀年
        JiScOrder = (1 + JiOrder * JiSkip) % 60
    }
    let OriginAccum = 0
    if (Type < 11) {
        OriginAccum = OriginYear * SolarRaw + WinsolsCorr - SolarChangeAccum
    }
    let LeapSurAvgThis = 0
    let LeapSurAvgPrev = 0
    let LeapSurAvgNext = 0
    let AccumZhongThis = 0
    if (ZhangRange) {
        LeapSurAvgThis = OriginYear * ZhangMon % ZhangRange // 今年閏餘
        LeapSurAvgPrev = (OriginYear - 1) * ZhangMon % ZhangRange
        LeapSurAvgNext = (OriginYear + 1) * ZhangMon % ZhangRange
    } else if (Type < 8) {
        LeapSurAvgThis = OriginYear * SolarNumer % LunarNumer // OriginYear * SolarNumer爲期總
        LeapSurAvgPrev = (OriginYear - 1) * SolarNumer % LunarNumer
        LeapSurAvgNext = (OriginYear + 1) * SolarNumer % LunarNumer
    } else if (Type < 11) {
        const OriginAccumPrev = (OriginYear - 1) * SolarRaw + WinsolsCorr - SolarChangeAccum
        const OriginAccumNext = (OriginYear + 1) * SolarRaw + WinsolsCorr - SolarChangeAccum
        LeapSurAvgThis = ((OriginAccum + FirstCorr) % LunarRaw + LunarRaw) % LunarRaw
        LeapSurAvgPrev = ((OriginAccumPrev + FirstCorr) % LunarRaw + LunarRaw) % LunarRaw
        LeapSurAvgNext = ((OriginAccumNext + FirstCorr) % LunarRaw + LunarRaw) % LunarRaw
    } else if (Type === 11) {
        AccumZhongThis = OriginYear * SolarRaw // 中積
        const AccumZhongPrev = (OriginYear - 1) * SolarRaw
        const AccumZhongNext = (OriginYear + 1) * SolarRaw
        OriginAccum = AccumZhongThis + WinsolsCorr - SolarChangeAccum // 通積：該年冬至積日
        const AccumLeapThis = AccumZhongThis + FirstCorr // 閏積
        const AccumLeapPrev = AccumZhongPrev + FirstCorr
        const AccumLeapNext = AccumZhongNext + FirstCorr
        LeapSurAvgThis = parseFloat(((AccumLeapThis % Lunar + Lunar) % Lunar).toPrecision(14)) // 閏餘、冬至月齡
        LeapSurAvgPrev = parseFloat(((AccumLeapPrev % Lunar + Lunar) % Lunar).toPrecision(14))
        LeapSurAvgNext = parseFloat(((AccumLeapNext % Lunar + Lunar) % Lunar).toPrecision(14))
    }
    const WinsolsDeci = OriginAccum - Math.floor(OriginAccum)
    let FirstAccum = 0
    if (ZhangRange) {
        FirstAccum = Math.floor(OriginYear * ZhangMon / ZhangRange) * Lunar
    } else if (Type < 8) {
        FirstAccum = OriginAccum - LeapSurAvgThis / Denom - LunarChangeAccum
    } else {
        FirstAccum = OriginAccum - LeapSurAvgThis - LunarChangeAccum
    }
    let FirstAnomaAccum = 0
    if (CalName === 'Qianxiang') {
        FirstAnomaAccum = (Math.floor((OriginYear + 1) * ZhangMon / ZhangRange) * Lunar) % Anoma // 算外。我也不知道怎麼積年就要+1。劉洪濤頁133，突然想到的！！存疑！！
    } else if (Type < 11) {
        FirstAnomaAccum = ((FirstAccum + AnomaCorr + (CalName === 'Shenlong' ? Anoma / 2 : 0)) % Anoma + Anoma) % Anoma
    } else if (Type === 11) {
        FirstAnomaAccum = ((AccumZhongThis - LeapSurAvgThis + AnomaCorr) % Anoma + Anoma) % Anoma
    }
    let FirstNodeAccum = 0
    if (Node && Type < 11) {
        FirstNodeAccum = (FirstAccum + NodeCorr + (YinyangCorr === -1 ? Node / 2 : 0)) % Node
    } else if (Type >= 11) {
        FirstNodeAccum = ((AccumZhongThis - LeapSurAvgThis + NodeCorr + (YinyangCorr === -1 ? Node / 2 : 0)) % Node + Node) % Node
    }
    const AccumPrint = (Anoma ? '轉' + ((OriginAccum % Anoma + AnomaCorr + Anoma) % Anoma).toFixed(4) : '') +
        (Node ? '交' + ((OriginAccum % Node + NodeCorr + Node) % Node).toFixed(4) : '') +
        (Sidereal ? '週' + (((OriginAccum % Sidereal + MansionCorr) % Sidereal + Sidereal) % Sidereal).toFixed(4) : '')
    let fixed = 5 // 試出來的OriginAccum能保留幾位小數
    if (OriginYear > 85000000) {
    } else if (OriginYear > 8500000) {
        fixed = 6
    } else {
        fixed = 7
    }
    OriginAccum = +OriginAccum.toFixed(fixed)
    FirstAccum = +FirstAccum.toFixed(fixed - 1)
    FirstAnomaAccum = +FirstAnomaAccum.toFixed(fixed - 1)
    FirstNodeAccum = +FirstNodeAccum.toFixed(fixed - 1)
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
        LeapNumAvgNext -= ZhengWinsolsDif
        if (LeapNumAvgNext <= 0) {
            LeapNumAvgThis = LeapNumAvgNext + 12
            isLeapThis = 1
            isLeapNext = 0
            isAdvance = 1
        }
    } else if (LeapNumAvgThis) {
        LeapNumAvgThis -= ZhengWinsolsDif
        if (LeapNumAvgThis <= 0) {
            LeapNumAvgThis = 0
            isLeapThis = 0
            isLeapPrev = 1
            isAdvance = 1
        }
    }
    const EquaDegAccumList = AutoDegAccumList(CalName, year)
    const AutoNewmSyzygy = isNewm => {
        const AvgRaw = []
        const AvgInt = []
        const AvgSc = []
        const AvgDeci = []
        const TermAvgRaw = []
        const TermAcrRaw = []
        const TermAcrWinsolsDif = []
        const TermAvgWinsolsDif = []
        const AnomaAccum = []
        const AnomaAccumNight = []
        const NodeAccum = []
        const NodeAccumNight = []
        const AcrInt = []
        const Int = []
        const Raw = []
        const Tcorr = []
        const AcrRaw = []
        const AcrMod = []
        const Sc = []
        const Deci1 = [] // 線性內插
        const Deci2 = [] // 二次內插
        const Deci3 = [] // 三次內插
        const Deci = []
        const WinsolsDifRaw = []
        const AcrWinsolsDifRaw = []
        const Equa = []
        for (let i = 0; i <= 14; i++) {
            AvgRaw[i] = FirstAccum + (ZhengWinsolsDif + i - (isNewm ? 1 : 0.5)) * Lunar
            AvgInt[i] = Math.floor(AvgRaw[i])
            AvgSc[i] = ScList[(((AvgInt[i] + 1 + ScCorr) % 60) + 60) % 60]
            AvgDeci[i] = AvgRaw[i] - Math.floor(AvgRaw[i])
            WinsolsDifRaw[i] = ((ZhengWinsolsDif + i - (isNewm ? 1 : 0.5)) * Lunar + FirstAccum - OriginAccum + Solar) % Solar
            let Tcorr1 = 0
            if (Anoma) {
                AnomaAccum[i] = (FirstAnomaAccum + (ZhengWinsolsDif + i - 1) * SynodicAnomaDif + (isNewm ? 0 : Lunar / 2)) % Anoma // 上元積年幾千萬年，精度只有那麼多了，再多的話誤差更大
                AnomaAccumNight[i] = ~~AnomaAccum[i]
                const TcorrBindFunc = AutoTcorr(AnomaAccum[i], WinsolsDifRaw[i], CalName)
                if (Type <= 4) {
                    Tcorr[i] = TcorrBindFunc.Tcorr1
                    Tcorr1 = Tcorr[i]
                } else if (Type < 11) {
                    Tcorr[i] = TcorrBindFunc.Tcorr2
                    Tcorr1 = TcorrBindFunc.Tcorr1
                } else if (Type === 11) {
                    Tcorr[i] = TcorrBindFunc.Tcorr2
                }
                AcrRaw[i] = AvgRaw[i] + Tcorr[i]
                if (Math.floor(AcrRaw[i]) > Math.floor(AvgRaw[i])) { // 定朔入轉同經朔，若定朔大餘有變化，則加減一整日。變的應該是夜半，而非加時
                    AnomaAccumNight[i]++
                } else if (Math.floor(AcrRaw[i]) < Math.floor(AvgRaw[i])) {
                    AnomaAccumNight[i]--
                }
                AcrMod[i] = (AcrRaw[i] % 60 + 60) % 60
                AcrInt[i] = Math.floor(AcrRaw[i])
                if (Type <= 4) {
                    Deci[i] = AcrRaw[i] - AcrInt[i]
                    Deci1[i] = Deci[i]
                } else if (Type < 11) {
                    Deci[i] = AcrRaw[i] - AcrInt[i]
                    Deci2[i] = Deci[i].toFixed(4).slice(2, 6)
                    if (Tcorr1) {
                        Deci1[i] = AvgRaw[i] + Tcorr1 - Math.floor(AvgRaw[i] + Tcorr1)
                    }
                } else if (Type === 11) {
                    Deci[i] = AcrRaw[i] - AcrInt[i]
                    Deci3[i] = Deci[i].toFixed(4).slice(2, 6)
                }
            } else {
                Deci[i] = AvgDeci[i]
            }
            let NewmPlus = 0
            let NewmPlusPrint = ''
            let SyzygySub = 0
            let SyzygySubPrint = ''
            if (isNewm) {
                if (isAcr && isNewmPlus) {
                    const Func = AutoNewmPlus((Deci1[i] || Deci[i]), WinsolsDifRaw[i], WinsolsDeci, CalName) /////進朔/////
                    NewmPlus = Func.NewmPlus
                    NewmPlusPrint = Func.Print
                }
                if ((EquaDegAccumList || []).length) {
                    let Eclp2EquaDif = 0
                    if (Type === 11) { // 授時要黃轉赤
                        Eclp2EquaDif = AutoEqua2Eclp(WinsolsDifRaw[i], CalName).Eclp2EquaDif
                    }
                    Equa[i] = Accum2Mansion(AcrRaw[i] + Eclp2EquaDif, EquaDegAccumList, CalName).MansionResult
                }
                TermAvgWinsolsDif[i] = (i + ZhengWinsolsDif - 1) * TermLeng
                TermAvgRaw[i] = OriginAccum + TermAvgWinsolsDif[i]
                const TermNum3 = 2 * (i + ZhengWinsolsDif - 1)
                if (Type >= 5 && AcrTermList) {
                    TermAcrWinsolsDif[i] = AcrTermList[TermNum3 % 24] + (TermNum3 >= 24 ? Solar : 0)
                    TermAcrRaw[i] = OriginAccum + TermAcrWinsolsDif[i]
                }
            } else {
                const Func = AutoSyzygySub(Deci[i], WinsolsDifRaw[i], WinsolsDeci, CalName) /////退望/////       
                SyzygySub = Func.SyzygySub
                SyzygySubPrint = Func.Print
            }
            if (isAcr) { // 麟德以後用定朔注曆
                Int[i] = AcrInt[i]
                Raw[i] = AcrRaw[i]
            } else {
                Int[i] = AvgInt[i]
                Raw[i] = AvgRaw[i]
            }
            Int[i] += NewmPlus + SyzygySub // 這裏int是二次內差的結果，但線性與二次分屬兩日的極端情況太少了，暫且不論
            Raw[i] += NewmPlus + SyzygySub
            AcrInt[i] += NewmPlus + SyzygySub
            AnomaAccumNight[i] += NewmPlus
            if (isNewm) {
                if (Tcorr[i]) {
                    Sc[i] = ScList[((AcrInt[i] + ScCorr + 1) % 60 + 60) % 60] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
                }
            } else {
                if (Tcorr[i]) {
                    Sc[i] = ScList[((AcrInt[i] + ScCorr + 1) % 60 + 60) % 60] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
                } else {
                    Sc[i] = AvgSc[i]
                }
            }
            if (Node) {
                NodeAccum[i] = +((FirstNodeAccum + (ZhengWinsolsDif + i - 1) * Lunar + (isNewm ? 0 : HalfSynodicNodeDif)) % Node).toFixed(5)
                NodeAccumNight[i] = ~~NodeAccum[i]
            }
            NodeAccumNight[i] += NewmPlus // 給曆書用，不知道這樣可不可以
            if (Tcorr1) {
                Deci1[i] = Deci1[i].toFixed(4).slice(2, 6)
            }
            AcrWinsolsDifRaw[i] = WinsolsDifRaw[i] + Tcorr[i]
        }
        return {
            AvgSc, Tcorr, AvgDeci, Int, Raw, Sc, AcrInt, AcrRaw,
            Deci, Deci1, Deci2, Deci3,
            Equa, TermAvgRaw, TermAcrRaw, TermAcrWinsolsDif, TermAvgWinsolsDif,
            /// 交食用到
            NodeAccum, NodeAccumNight, AnomaAccum, AnomaAccumNight, WinsolsDifRaw, AcrWinsolsDifRaw
        }
    }
    const Newm = AutoNewmSyzygy(1)
    const Syzygy = AutoNewmSyzygy(0)
    const {
        Tcorr: NewmTcorr,
        AvgSc: NewmAvgSc,
        AvgDeci: NewmAvgDeci,
        Int: NewmInt,
        Raw: NewmRaw,
        AcrInt: NewmAcrInt,
        AcrRaw: NewmAcrRaw,
        Sc: NewmSc,
        Deci: NewmDeci,
        Deci1: NewmDeci1,
        Deci2: NewmDeci2,
        Deci3: NewmDeci3,
        Equa: NewmEqua,
        TermAvgRaw, TermAcrRaw, TermAcrWinsolsDif, TermAvgWinsolsDif
    } = Newm
    const {
        Sc: SyzygySc,
        Deci: SyzygyDeci,
        AvgDeci: SyzygyAvgDeci,
    } = Syzygy
    let LeapSurAcrThis = 0
    if (ZhangRange) {
        LeapSurAcrThis = (LeapSurAvgThis - NewmTcorr[1] * ZhangRange / Lunar + ZhangRange) % ZhangRange
    } else {
        LeapSurAcrThis = LeapSurAvgThis - NewmTcorr[1] // * Denom
    }
    // 中氣
    let LeapNumTerm = LeapNumAvgThis > 0 ? LeapNumAvgThis : 0
    let isLeapAdvan = 0
    let isLeapPost = 0
    if (isLeapThis) {
        LeapNumTerm = LeapAdjust(LeapNumTerm, TermAvgRaw, NewmInt, CalName)
        if (LeapNumTerm < 1) {
            isLeapAdvan = 1
            isLeapPrev = 1
        } else if (LeapNumTerm > 12) {
            isLeapPost = 1
            isLeapNext = 1
        }
    }
    // 最後是積月、月數
    let NewmStart = 0
    let NewmEnd = 0
    if (isAdvance && isLeapPrev) {
        NewmStart = 1
    }
    if (isLeapThis) {
        NewmEnd = 1
    } else {
        NewmEnd = NewmStart
    }
    let TermStart = NewmStart
    let TermEnd = NewmEnd
    if ((isAdvance && isLeapPrev)) {
        TermStart = 0
    }
    if (NewmStart && !TermStart) {
        TermEnd = 0
    }
    return {
        LeapLimit, OriginYear, JiYear, JiScOrder, OriginAccum, AccumPrint,
        NewmAvgSc, NewmAvgDeci,
        NewmSc, NewmInt, NewmRaw, NewmAcrRaw, NewmAcrInt, NewmDeci1, NewmDeci2, NewmDeci3,
        SyzygySc,
        TermAvgRaw, TermAcrRaw,
        LeapSurAvgThis, LeapSurAcrThis, LeapNumTerm, isAdvance, isLeapAdvan, isLeapPost, isLeapThis, isLeapPrev, isLeapNext,
        NewmStart, NewmEnd, TermStart, TermEnd,
        EquaDegAccumList, NewmEqua, TermAvgWinsolsDif, TermAcrWinsolsDif,
        //////// 交食用
        NewmNodeAccum: Newm.NodeAccum,
        NewmNodeAccumNight: Newm.NodeAccumNight,
        NewmAnomaAccum: Newm.AnomaAccum,
        NewmAnomaAccumNight: Newm.AnomaAccumNight,
        NewmDeci,
        NewmWinsolsDifRaw: Newm.WinsolsDifRaw,
        NewmAcrWinsolsDifRaw: Newm.AcrWinsolsDifRaw,
        SyzygyNodeAccum: Syzygy.NodeAccum,
        SyzygyAnomaAccum: Syzygy.AnomaAccum,
        SyzygyDeci, SyzygyAvgDeci,
        SyzygyWinsolsDifRaw: Syzygy.WinsolsDifRaw,
        SyzygyAcrWinsolsDifRaw: Syzygy.AcrWinsolsDifRaw,
    }
}
