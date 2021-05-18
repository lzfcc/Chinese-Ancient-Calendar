import {
    ScList, AutoDegAccumList
} from './para_constant.mjs'
import {
    Bind
} from './bind.mjs'
import {
    AutoTcorr
} from './astronomy_acrv.mjs'
import {
    ConstWest
} from './astronomy_west.mjs'
import {
    Accum2Mansion, AutoNewmPlus, AutoSyzygySub
} from './astronomy_other.mjs'
import {
    AutoEqua2Eclp
} from './bind_astronomy.mjs'

export default (CalName, year) => {
    const { Type, AutoPara, isAcr, isNewmPlus
    } = Bind(CalName)
    const {
        Sidereal, SolarNumer, LunarNumer, Denom, Anoma, AnomaOrigin, Node, YinyangOrigin, EcliOrigin,
        OriginAd, CloseOriginAd, OriginMonNum, ZhengNum,
        YuanRange, JiRange, ZhangRange, ZhangLeap,
        FirstCorr, AnomaCorr, OriginCorr, WinsolsConst, LeapConst, AnomaConst, NodeConst,
        AcrTermList
    } = AutoPara[CalName]
    let {
        Solar, SolarRaw, Lunar, LunarRaw, OriginDaySc,
    } = AutoPara[CalName]
    OriginDaySc = OriginDaySc || 0
    SolarRaw = SolarRaw || Solar
    LunarRaw = LunarRaw || Lunar
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
            Solar = SolarRaw - OriginYear / 1000000 // 授時歲實消長高了16倍
            SolarChangeAccum = signX * (OriginYear ** 2) / 2000000
        }
    }
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const MonLeap = parseFloat((TermLeng - Lunar).toPrecision(14)) // 月閏，借鑑授時曆
    let NodeOrigin = 0
    if (EcliOrigin) {
        if (CalName === 'Yuanjia') {
            NodeOrigin = Node * EcliOrigin
        } else {
            NodeOrigin = (Node / 2) * EcliOrigin
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
        OriginAccum = OriginYear * SolarRaw + (OriginCorr || 0) - SolarChangeAccum
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
        const OriginAccumPrev = (OriginYear - 1) * SolarRaw + (OriginCorr || 0) - SolarChangeAccum
        const OriginAccumNext = (OriginYear + 1) * SolarRaw + (OriginCorr || 0) - SolarChangeAccum
        LeapSurAvgThis = ((OriginAccum + (FirstCorr || 0)) % LunarRaw + LunarRaw) % LunarRaw
        LeapSurAvgPrev = ((OriginAccumPrev + (FirstCorr || 0)) % LunarRaw + LunarRaw) % LunarRaw
        LeapSurAvgNext = ((OriginAccumNext + (FirstCorr || 0)) % LunarRaw + LunarRaw) % LunarRaw
    } else if (Type === 11) {
        AccumZhongThis = OriginYear * SolarRaw // 中積
        const AccumZhongPrev = (OriginYear - 1) * SolarRaw
        const AccumZhongNext = (OriginYear + 1) * SolarRaw
        OriginAccum = AccumZhongThis + WinsolsConst - SolarChangeAccum // 通積：該年冬至積日
        const AccumLeapThis = AccumZhongThis + LeapConst // 閏積
        const AccumLeapPrev = AccumZhongPrev + LeapConst
        const AccumLeapNext = AccumZhongNext + LeapConst
        LeapSurAvgThis = parseFloat(((AccumLeapThis % Lunar + Lunar) % Lunar).toPrecision(14)) // 閏餘、冬至月齡
        LeapSurAvgPrev = parseFloat(((AccumLeapPrev % Lunar + Lunar) % Lunar).toPrecision(14))
        LeapSurAvgNext = parseFloat(((AccumLeapNext % Lunar + Lunar) % Lunar).toPrecision(14))
    }
    const WinsolsDecimal = OriginAccum - Math.floor(OriginAccum)
    let FirstAccum = 0
    if (ZhangRange) {
        FirstAccum = Math.floor(OriginYear * ZhangMon / ZhangRange) * Lunar
    } else if (Type === 6 || Type === 7) {
        FirstAccum = OriginAccum - LeapSurAvgThis / Denom - LunarChangeAccum
    } else if (Type >= 8) {
        FirstAccum = OriginAccum - LeapSurAvgThis - LunarChangeAccum
    }
    let FirstAnomaAccum = 0
    if (CalName === 'Qianxiang') {
        FirstAnomaAccum = (Math.floor((OriginYear + 1) * ZhangMon / ZhangRange) * Lunar) % Anoma // 算外。我也不知道怎麼積年就要+1。劉洪濤頁133，突然想到的！！存疑！！
    } else if (Type < 11) {
        FirstAnomaAccum = ((FirstAccum + (AnomaOrigin / Denom || 0) + (CalName === 'Shenlong' ? Anoma / 2 : 0) + (AnomaCorr || 0)) % Anoma + Anoma) % Anoma
    } else if (Type === 11) {
        FirstAnomaAccum = ((AccumZhongThis - LeapSurAvgThis + AnomaConst) % Anoma + Anoma) % Anoma
    }
    let FirstNodeAccum = 0
    if (Node && Type < 11) {
        FirstNodeAccum = (FirstAccum + NodeOrigin + (YinyangOrigin === -1 ? Node / 2 : 0)) % Node
    } else if (Type >= 11) {
        FirstNodeAccum = ((AccumZhongThis - LeapSurAvgThis + NodeConst) % Node + Node) % Node
    }
    const AccumPrint = '轉' + (OriginAccum % Anoma).toFixed(4) + (Node ? '交' + (OriginAccum % Node).toFixed(4) : '') + (Sidereal ? '週' + (OriginAccum % Sidereal).toFixed(4) : '')
    OriginAccum = +OriginAccum.toFixed(5)
    FirstAccum = +FirstAccum.toFixed(5)
    FirstAnomaAccum = +FirstAnomaAccum.toFixed(5)
    FirstNodeAccum = +FirstNodeAccum.toFixed(5)
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
        const AvgDecimal = []
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
        const Decimal1 = [] // 線性內插
        const Decimal2 = [] // 二次內插
        const Decimal3 = [] // 三次內插
        const Decimal = []
        const WinsolsDifRaw = []
        const Equa = []
        for (let i = 0; i <= 14; i++) {
            AvgRaw[i] = FirstAccum + (ZhengWinsolsDif + i - (isNewm ? 1 : 0.5)) * Lunar
            AvgInt[i] = Math.floor(AvgRaw[i])
            AvgSc[i] = ScList[(((AvgInt[i] + 1 + OriginDaySc) % 60) + 60) % 60]
            AvgDecimal[i] = (AvgRaw[i] - Math.floor(AvgRaw[i])).toFixed(4).slice(2, 6)
            WinsolsDifRaw[i] = ((ZhengWinsolsDif + i - (isNewm ? 1 : 0.5)) * Lunar + FirstAccum - OriginAccum + Solar) % Solar
            AnomaAccum[i] = (FirstAnomaAccum + (ZhengWinsolsDif + i - 1) * SynodicAnomaDif + (isNewm ? 0 : Lunar / 2)) % Anoma // 上元積年幾千萬年，精度只有那麼多了，再多的話誤差更大
            AnomaAccumNight[i] = ~~AnomaAccum[i]
            const TcorrBindFunc = AutoTcorr(AnomaAccum[i], WinsolsDifRaw[i], CalName)
            let Tcorr1 = 0
            if (Type <= 4) {
                Tcorr[i] = TcorrBindFunc.Tcorr1
            } else if (Type < 11) {
                Tcorr[i] = TcorrBindFunc.Tcorr2
                Tcorr1 = TcorrBindFunc.Tcorr1
            } else if (Type === 11) {
                Tcorr[i] = TcorrBindFunc.Tcorr2
            }
            AcrRaw[i] = AvgRaw[i] + Tcorr[i]
            if (Math.floor(AcrRaw[i]) > Math.floor(AvgRaw[i])) { // 定朔入轉同經朔，若定朔大餘有變化，則加減一整日。變的應該是夜半，而非加時
                AnomaAccumNight[i]++
            } else if (Math.floor(AcrRaw[i]) > Math.floor(AvgRaw[i])) {
                AnomaAccumNight[i]--
            }
            AcrMod[i] = (AcrRaw[i] % 60 + 60) % 60
            AcrInt[i] = Math.floor(AcrRaw[i])
            if (Type <= 4) {
                Decimal[i] = AcrRaw[i] - AcrInt[i]
                Decimal1[i] = Decimal[i].toFixed(4).slice(2, 6)
            } else if (Type < 11) {
                Decimal[i] = AcrRaw[i] - AcrInt[i]
                Decimal2[i] = Decimal[i].toFixed(4).slice(2, 6)
                if (Tcorr1) {
                    Decimal1[i] = (AvgRaw[i] + Tcorr1 - Math.floor(AvgRaw[i] + Tcorr1)).toFixed(4).slice(2, 6)
                }
            } else if (Type === 11) {
                Decimal[i] = AcrRaw[i] - AcrInt[i]
                Decimal3[i] = Decimal[i].toFixed(4).slice(2, 6)
            }
            let NewmPlus = 0
            let NewmPlusPrint = ''
            let SyzygySub = 0
            let SyzygySubPrint = ''
            if (isNewm) {
                if (isAcr && isNewmPlus) {
                    const Func = AutoNewmPlus(Decimal[i], WinsolsDifRaw[i], WinsolsDecimal, CalName) /////進朔/////
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
                const Func = AutoSyzygySub(Decimal[i], WinsolsDifRaw[i], WinsolsDecimal, CalName) /////退望/////       
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
            Int[i] += NewmPlus + SyzygySub
            Raw[i] += NewmPlus + SyzygySub
            AcrInt[i] += NewmPlus + SyzygySub
            AnomaAccumNight[i] += NewmPlus
            Sc[i] = ScList[((AcrInt[i] + OriginDaySc + 1) % 60 + 60) % 60] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
            if (Node) {
                NodeAccum[i] = +((FirstNodeAccum + (ZhengWinsolsDif + i - 1) * Lunar + (isNewm ? 0 : HalfSynodicNodeDif)) % Node).toFixed(5)
                NodeAccumNight[i] = ~~NodeAccum[i]
            }
            NodeAccumNight[i] += NewmPlus // 給曆書用，不知道這樣可不可以
        }
        return {
            AvgSc, Tcorr, AvgDecimal, Int, Raw, Sc, AcrInt, AcrRaw,
            Decimal, Decimal1, Decimal2, Decimal3,
            Equa, TermAvgRaw, TermAcrRaw, TermAcrWinsolsDif, TermAvgWinsolsDif,
            /// 交食用到
            NodeAccum, NodeAccumNight, AnomaAccum, AnomaAccumNight, WinsolsDifRaw,
        }
    }
    const Newm = AutoNewmSyzygy(1)
    const Syzygy = AutoNewmSyzygy(0)
    const {
        Tcorr: NewmTcorr,
        AvgSc: NewmAvgSc,
        AvgDecimal: NewmAvgDecimal,
        Int: NewmInt,
        Raw: NewmRaw,
        AcrInt: NewmAcrInt,
        AcrRaw: NewmAcrRaw,
        Sc: NewmSc,
        Decimal: NewmDecimal,
        Decimal1: NewmDecimal1,
        Decimal2: NewmDecimal2,
        Decimal3: NewmDecimal3,
        Equa: NewmEqua,
        TermAvgRaw: TermAvgRaw,
        TermAcrRaw: TermAcrRaw,
        TermAcrWinsolsDif: TermAcrWinsolsDif,
        TermAvgWinsolsDif: TermAvgWinsolsDif
    } = Newm
    const {
        Sc: SyzygySc,
        Decimal: SyzygyDecimal
    } = Syzygy
    let LeapSurAcrThis = 0
    if (ZhangRange) {
        LeapSurAcrThis = (LeapSurAvgThis - NewmTcorr[1] * ZhangRange / Lunar + ZhangRange) % ZhangRange
    } else {
        LeapSurAcrThis = LeapSurAvgThis - NewmTcorr[1] // * Denom
    }
    // 中氣
    let LeapNumTerm = 0
    if (LeapNumAvgThis) {
        LeapNumTerm = LeapNumAvgThis
    }
    let isLeapAdvan = 0
    let isLeapPost = 0
    if (isLeapThis) {
        let Plus = 3.5
        if (isNewmPlus) { // 若不用進朔，需要改成3.5
            Plus = 2.75
            if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
                Plus = 3
            }
        }
        while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + Plus)) {
            LeapNumTerm--
        }
        while (LeapNumTerm <= 12 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - Plus)) {
            LeapNumTerm++
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
        NewmAvgSc, NewmAvgDecimal,
        NewmSc, NewmInt, NewmRaw, NewmAcrRaw, NewmAcrInt, NewmDecimal1, NewmDecimal2, NewmDecimal3,
        SyzygySc, SyzygyDecimal,
        TermAvgRaw, TermAcrRaw,
        LeapSurAvgThis, LeapSurAcrThis, LeapNumTerm, isAdvance, isLeapAdvan, isLeapPost, isLeapThis, isLeapPrev, isLeapNext,
        NewmStart, NewmEnd, TermStart, TermEnd,
        EquaDegAccumList, NewmEqua, TermAvgWinsolsDif, TermAcrWinsolsDif,
        //////// 交食用
        NewmNodeAccum: Newm.NodeAccum,
        NewmNodeAccumNight: Newm.NodeAccumNight,
        NewmAnomaAccum: Newm.AnomaAccum,
        NewmAnomaAccumNight: Newm.AnomaAccumNight,
        NewmDecimal,
        NewmWinsolsDifRaw: Newm.WinsolsDifRaw,
        SyzygyNodeAccum: Syzygy.NodeAccum,
        SyzygyAnomaAccum: Syzygy.AnomaAccum,
        SyzygyDecimal,
        SyzygyWinsolsDifRaw: Syzygy.WinsolsDifRaw,
    }
}