import Para from './para_calendars.mjs'
import { ScList, AutoDegAccumList } from './para_constant.mjs'
import { AutoTcorr } from './astronomy_acrv.mjs'
import { ConstWest } from './astronomy_west.mjs'
import { Accum2Mansion, AutoNewmPlus, AutoSyzygySub, LeapAdjust } from './astronomy_other.mjs'
import { AutoEqua2Eclp } from './astronomy_bind.mjs'

export default (CalName, year) => {
    const { Type, isAcr, isNewmPlus, Sidereal, SolarNumer, LunarNumer, Denom, Anoma, Node, AcrTermList,
        OriginAd, CloseOriginAd, OriginMonNum, ZhengNum,
        YuanRange, JiRange, ZhangRange, ZhangLeap,
        YinyangConst, EcliConst } = Para[CalName]
    let { Solar, SolarRaw, Lunar, LunarRaw, ScConst, NodeConst, FirstConst, AnomaConst, MansionConst, SolsConst
    } = Para[CalName]
    ScConst = ScConst || 0
    SolarRaw = SolarRaw || Solar
    LunarRaw = LunarRaw || Lunar
    FirstConst = FirstConst || 0
    NodeConst = NodeConst || 0
    AnomaConst = Type === 11 ? AnomaConst : (AnomaConst / Denom || 0)
    MansionConst = MansionConst || 0
    SolsConst = SolsConst || 0
    const ZhangMon = Math.round(ZhangRange * (12 + ZhangLeap / ZhangRange))
    // const JiMon = JiRange * ZhangMon / ZhangRange
    const ZhengSolsDif = ZhengNum - OriginMonNum
    const OriginYear = year - (OriginAd || CloseOriginAd) // 上元積年（算上）
    // const CloseSolsDif = CloseOriginAd - OriginAd // 統天距算
    const CloseOriginYear = year - CloseOriginAd // 距差。授時以1280開始
    let SolarChangeAccum = 0, LunarChangeAccum = 0, LeapSurAvgThis = 0, LeapSurAvgPrev = 0, LeapSurAvgNext = 0, OriginAccumThis = 0
    // 統天躔差=斗分差/10000*距差
    const signX = CloseOriginYear > 0 ? 1 : -1
    if (CalName === 'West') {
        const Func = ConstWest(year)
        Solar = Func.Solar
        Lunar = Func.Lunar
        SolarChangeAccum = signX * ((year - 2000) ** 2) * 3.08 * 1e-8 // (首項+末項)/2
        LunarChangeAccum = -signX * ((year - 2000) ** 2) * 1e-9
    } else if (CalName === 'Tongtian') { // 藤豔輝頁70、《中國古代曆法》第610頁。如果不算消長的話就完全不對，因爲上元積年就考慮了消長        
        SolarChangeAccum = signX * 0.0127 * CloseOriginYear ** 2 / Denom // 加在冬至上的歲實消長
        // Solar = SolarRaw // - 0.021167 * CloseOriginYear / Denom
        // Lunar = CloseOriginYear ? (SolarRaw + SolarChangeAccum / CloseOriginYear - 10.5 / Denom) / (SolarRaw / LunarRaw) : LunarRaw
        LunarChangeAccum = -10.5 * CloseOriginYear / Denom
    } else if (['Shoushi', 'Shoushi2'].includes(CalName)) {
        Solar = parseFloat((SolarRaw - (~~((CloseOriginYear + 1) / 100) / 10000)).toPrecision(10))
    } else if (CalName === 'Wannian') {
        // 置曆元所距年積算為汎距，來加往減元紀為定距，以朞實乘之，四約，為積日，不滿，退除為刻，是名汎積。定距自相乘，七之八而一，所得滿百萬為日，不滿為刻及分秒，〔帶半秒已上者收作一秒〕是名節氣歲差，用減汎積，餘為定積。
        // Solar = parseFloat((SolarRaw - (year - 1281) * 1.75 * 1e-6).toPrecision(10))       
        SolarChangeAccum = signX * 8.75 * 1e-7 * (year - 1281) ** 2
    }
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    const MonLeap = parseFloat((TermLeng - Lunar).toPrecision(14)) // 月閏，借鑑授時曆
    if (EcliConst) {
        NodeConst = CalName === 'Yuanjia' ? Node * EcliConst : (Node / 2) * EcliConst
    }
    const SynodicAnomaDif = Lunar - Anoma
    const SynodicNodeDif50 = (Lunar - Node) / 2
    let JiSkip = 0, JiOrder = 0, JiYear = 0, JiScOrder = 0
    if (JiRange) {
        JiSkip = Math.round(Solar * JiRange % 60)
        JiOrder = ~~(OriginYear % YuanRange / JiRange) // 入第幾紀
        JiYear = OriginYear % YuanRange % JiRange + 1 // 入紀年
        JiScOrder = (1 + JiOrder * JiSkip) % 60
    }
    let fixed = 4 // 試出來的OriginAccum能保留幾位小數
    if (Type === 11) { // 大統通軌最多有10位
        fixed = 10
    } else if (OriginYear > 8.5 * 1e7) {
    } else if (OriginYear > 8.5 * 1e6) {
        fixed = 5
    } else {
        fixed = 6
    }
    // const WannianDingju = CloseOriginYear => {
    //     const Dingju = CloseOriginYear + 4560 // 定距        
    //     const OriginAccum = Dingju * 365.25 - Dingju ** 2 * 8.75 * 1e-7
    //     return OriginAccum
    // }
    const ZoneDif = CalName === 'Gengwu' ? 20000 * 0.04359 / Denom : 0 // 里差
    let SolsAccum = Type < 11 ? OriginYear * Solar + SolsConst + ZoneDif + SolarChangeAccum : 0
    SolsAccum = +SolsAccum.toFixed(fixed)
    if (ZhangRange) {
        LeapSurAvgThis = OriginYear * ZhangMon % ZhangRange // 今年閏餘
        LeapSurAvgPrev = (OriginYear - 1) * ZhangMon % ZhangRange
        LeapSurAvgNext = (OriginYear + 1) * ZhangMon % ZhangRange
    } else if (Type < 8) {
        LeapSurAvgThis = OriginYear * SolarNumer % LunarNumer // OriginYear * SolarNumer爲期總
        LeapSurAvgPrev = (OriginYear - 1) * SolarNumer % LunarNumer
        LeapSurAvgNext = (OriginYear + 1) * SolarNumer % LunarNumer
    } else if (Type < 11) {
        const OriginAccumPrev = (OriginYear - 1) * Solar + SolsConst + signX * 0.0127 * (CloseOriginYear - 1) ** 2 / Denom
        const OriginAccumNext = (OriginYear + 1) * Solar + SolsConst + signX * 0.0127 * (CloseOriginYear + 1) ** 2 / Denom
        LeapSurAvgThis = ((SolsAccum + FirstConst) % LunarRaw + LunarRaw) % LunarRaw
        LeapSurAvgPrev = ((OriginAccumPrev + FirstConst) % LunarRaw + LunarRaw) % LunarRaw
        LeapSurAvgNext = ((OriginAccumNext + FirstConst) % LunarRaw + LunarRaw) % LunarRaw
    } else if (CalName === 'Wannian') {
        // 置歲定積減去律應滿律總去之不盡得歲首黃鍾正律大小餘大餘命甲子筭外累加律策得次律大小餘滿律總去之 
        // 置歲定積減去閏應滿朔策去之不盡即所求閏餘日及分秒
        // OriginAccumThis = WannianDingju(CloseOriginYear)
        // const OriginAccumPrev = WannianDingju(CloseOriginYear - 1)
        // const OriginAccumNext = WannianDingju(CloseOriginYear + 1)
        // SolsAccum = OriginAccumThis + SolsConst
        // const LeapAccumThis = OriginAccumThis + FirstConst // 閏積
        // const LeapAccumPrev = OriginAccumPrev + FirstConst
        // const LeapAccumNext = OriginAccumNext + FirstConst
        // LeapSurAvgThis = parseFloat((LeapAccumThis % Lunar).toPrecision(14))
        // LeapSurAvgPrev = parseFloat((LeapAccumPrev % Lunar).toPrecision(14))
        // LeapSurAvgNext = parseFloat((LeapAccumNext % Lunar).toPrecision(14))
        OriginAccumThis = CloseOriginYear * SolarRaw + SolarChangeAccum
        const OriginAccumPrev = (CloseOriginYear - 1) * SolarRaw + signX * 8.75 * 1e-7 * (year - 1281 - 1) ** 2
        const OriginAccumNext = (CloseOriginYear + 1) * SolarRaw + signX * 8.75 * 1e-7 * (year - 1281 + 1) ** 2
        SolsAccum = OriginAccumThis + SolsConst
        const LeapAccumThis = OriginAccumThis - FirstConst // 閏積
        const LeapAccumPrev = OriginAccumPrev - FirstConst
        const LeapAccumNext = OriginAccumNext - FirstConst
        LeapSurAvgThis = parseFloat(((LeapAccumThis % Lunar + Lunar) % Lunar).toPrecision(14)) // 閏餘、冬至月齡
        LeapSurAvgPrev = parseFloat(((LeapAccumPrev % Lunar + Lunar) % Lunar).toPrecision(14))
        LeapSurAvgNext = parseFloat(((LeapAccumNext % Lunar + Lunar) % Lunar).toPrecision(14))
    } else if (Type === 11) {
        OriginAccumThis = CloseOriginYear * Solar // 中積
        const OriginAccumPrev = (CloseOriginYear - 1) * Solar
        const OriginAccumNext = (CloseOriginYear + 1) * Solar
        SolsAccum = OriginAccumThis + SolsConst // 通積：該年冬至積日
        const LeapAccumThis = OriginAccumThis + FirstConst // 閏積
        const LeapAccumPrev = OriginAccumPrev + FirstConst
        const LeapAccumNext = OriginAccumNext + FirstConst
        LeapSurAvgThis = parseFloat(((LeapAccumThis % Lunar + Lunar) % Lunar).toPrecision(14)) // 閏餘、冬至月齡
        LeapSurAvgPrev = parseFloat(((LeapAccumPrev % Lunar + Lunar) % Lunar).toPrecision(14))
        LeapSurAvgNext = parseFloat(((LeapAccumNext % Lunar + Lunar) % Lunar).toPrecision(14))
    }
    const SolsDeci = +(SolsAccum - Math.floor(SolsAccum)).toFixed(fixed)
    let FirstAccum = 0, FirstAnomaAccum = 0, FirstNodeAccum = 0
    if (ZhangRange) {
        FirstAccum = Math.floor(OriginYear * ZhangMon / ZhangRange) * Lunar
    } else if (Type < 8) {
        FirstAccum = SolsAccum - LeapSurAvgThis / Denom + LunarChangeAccum
    } else {
        FirstAccum = SolsAccum - LeapSurAvgThis + LunarChangeAccum
    }
    if (Node && Type < 11) {
        FirstNodeAccum = (FirstAccum + NodeConst + (YinyangConst === -1 ? Node / 2 : 0) + ZoneDif / 18) % Node
    } else if (Type >= 11) {
        FirstNodeAccum = ((OriginAccumThis - LeapSurAvgThis + NodeConst + (YinyangConst === -1 ? Node / 2 : 0)) % Node + Node) % Node
    }
    FirstAccum += ZoneDif
    if (CalName === 'Qianxiang') {
        FirstAnomaAccum = (Math.floor((OriginYear + 1) * ZhangMon / ZhangRange) * Lunar) % Anoma // 算外。我也不知道怎麼積年就要+1。劉洪濤頁133，突然想到的！！存疑！！
    } else if (Type < 11) {
        FirstAnomaAccum = ((FirstAccum + AnomaConst + (CalName === 'Shenlong' ? Anoma / 2 : 0)) % Anoma + Anoma) % Anoma
    } else if (Type === 11) {
        FirstAnomaAccum = ((OriginAccumThis - LeapSurAvgThis + AnomaConst) % Anoma + Anoma) % Anoma
    }
    FirstAccum = +FirstAccum.toFixed(fixed)
    FirstAnomaAccum = +FirstAnomaAccum.toFixed(fixed)
    FirstNodeAccum = +FirstNodeAccum.toFixed(fixed)
    const AccumPrint = (Anoma ? '轉' + ((SolsAccum % Anoma + AnomaConst + Anoma) % Anoma).toFixed(4) : '') +
        (Node ? '交' + ((SolsAccum % Node + NodeConst + (YinyangConst === -1 ? Node / 2 : 0) + Node) % Node).toFixed(4) : '') +
        (Sidereal ? '週' + (((SolsAccum % Sidereal + MansionConst) % Sidereal + Sidereal) % Sidereal).toFixed(4) : '')
    let LeapLimit = 0
    if (ZhangRange) {
        LeapLimit = ZhangRange - ZhangLeap
    } else if (Type <= 7) {
        LeapLimit = parseFloat((13 * LunarNumer - SolarNumer).toPrecision(14))
    } else {
        LeapLimit = parseFloat((13 * Lunar - Solar).toPrecision(14))
    }
    let isLeapThis = LeapSurAvgThis >= LeapLimit // 是否有閏月
    let isLeapPrev = LeapSurAvgPrev >= LeapLimit
    let isLeapNext = LeapSurAvgNext >= LeapLimit
    let LeapNumAvgThis = 0, LeapNumAvgNext = 0, isAdvance = 0
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
    if (LeapNumAvgNext) {
        LeapNumAvgNext -= ZhengSolsDif
        if (LeapNumAvgNext <= 0) {
            LeapNumAvgThis = LeapNumAvgNext + 12
            isLeapThis = 1
            isLeapNext = 0
            isAdvance = 1
        }
    } else if (LeapNumAvgThis) {
        LeapNumAvgThis -= ZhengSolsDif
        if (LeapNumAvgThis <= 0) {
            LeapNumAvgThis = 0
            isLeapThis = 0
            isLeapPrev = 1
            isAdvance = 1
        }
    }

    const EquaDegAccumList = AutoDegAccumList(CalName, year)
    const AutoNewmSyzygy = isNewm => {
        const AvgRaw = [], AvgInt = [], AvgSc = [], AvgDeci = [], TermAvgRaw = [], TermAcrRaw = [], TermAcrSolsDif = [], TermAvgSolsDif = [], AnomaAccum = [], AnomaAccumNight = [], NodeAccum = [], NodeAccumNight = [], AcrInt = [], Int = [], Raw = [], Tcorr = [], AcrRaw = [], AcrMod = [], Sc = [], Deci1 = [], Deci2 = [], Deci3 = [], Deci = [], SolsDif = [], AcrSolsDif = [], Equa = []
        for (let i = 0; i <= 14; i++) {
            AvgRaw[i] = +(FirstAccum + (ZhengSolsDif + i - (isNewm ? 1 : 0.5)) * Lunar).toFixed(fixed)
            AvgInt[i] = Math.floor(AvgRaw[i])
            AvgSc[i] = ScList[(((AvgInt[i] + 1 + ScConst) % 60) + 60) % 60]
            AvgDeci[i] = AvgRaw[i] - Math.floor(AvgRaw[i])
            SolsDif[i] = ((ZhengSolsDif + i - (isNewm ? 1 : 0.5)) * Lunar + FirstAccum - SolsAccum + Solar) % Solar
            let Tcorr1 = 0
            if (Anoma) {
                AnomaAccum[i] = +((FirstAnomaAccum + (ZhengSolsDif + i - 1) * SynodicAnomaDif + (isNewm ? 0 : Lunar / 2)) % Anoma).toFixed(fixed) // 上元積年幾千萬年，精度只有那麼多了，再多的話誤差更大
                AnomaAccumNight[i] = ~~AnomaAccum[i]
                const TcorrBindFunc = AutoTcorr(AnomaAccum[i], SolsDif[i], CalName)
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
            let NewmPlus = 0, SyzygySub = 0, NewmPlusPrint = '', SyzygySubPrint = ''
            if (isNewm) {
                if (isAcr && isNewmPlus) {
                    const Func = AutoNewmPlus((Deci1[i] || Deci[i]), SolsDif[i], SolsDeci, CalName) // 進朔
                    NewmPlus = Func.NewmPlus
                    NewmPlusPrint = Func.Print
                }
                if ((EquaDegAccumList || []).length) {
                    let Eclp2EquaDif = 0
                    if (Type === 11) { // 授時要黃轉赤 ⚠️ 2024-01 這樣轉可以嗎？？？
                        Eclp2EquaDif = AutoEqua2Eclp(SolsDif[i], CalName).Eclp2EquaDif
                    }
                    Equa[i] = Accum2Mansion(AcrRaw[i] + Eclp2EquaDif, EquaDegAccumList, CalName).MansionResult
                }
                TermAvgSolsDif[i] = (i + ZhengSolsDif - 1) * TermLeng
                TermAvgRaw[i] = SolsAccum + TermAvgSolsDif[i]
                const TermNum3 = 2 * (i + ZhengSolsDif - 1)
                if (Type >= 5 && AcrTermList) {
                    let Plus = 0
                    if (TermNum3 >= 24) {
                        Plus = Solar
                    } else if (TermNum3 < 0) {
                        Plus = -Solar
                    }
                    TermAcrSolsDif[i] = AcrTermList[(TermNum3 + 24) % 24] + Plus
                    TermAcrRaw[i] = SolsAccum + TermAcrSolsDif[i] // 定氣距冬至+中積
                }
            } else {
                const Func = AutoSyzygySub(Deci[i], SolsDif[i], SolsDeci, CalName) // 退望
                SyzygySub = Func.SyzygySub
                SyzygySubPrint = Func.Print
            }
            if (isAcr) {
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
                    Sc[i] = ScList[((AcrInt[i] + ScConst + 1) % 60 + 60) % 60] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
                }
            } else {
                if (Tcorr[i]) {
                    Sc[i] = ScList[((AcrInt[i] + ScConst + 1) % 60 + 60) % 60] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
                } else {
                    Sc[i] = AvgSc[i]
                }
            }
            if (Node) {
                NodeAccum[i] = +((FirstNodeAccum + (ZhengSolsDif + i - 1) * Lunar + (isNewm ? 0 : SynodicNodeDif50)) % Node).toFixed(fixed)
                NodeAccumNight[i] = ~~NodeAccum[i]
            }
            NodeAccumNight[i] += NewmPlus // 給曆書用，不知道這樣可不可以
            if (Tcorr1) {
                Deci1[i] = Deci1[i].toFixed(4).slice(2, 6)
            }
            AcrSolsDif[i] = SolsDif[i] + Tcorr[i]
        }
        return {
            AvgSc, Tcorr, AvgDeci, Int, Raw, Sc, AcrInt, AcrRaw,
            Deci, Deci1, Deci2, Deci3,
            Equa, TermAvgRaw, TermAcrRaw, TermAcrSolsDif, TermAvgSolsDif,
            /// 交食用到
            NodeAccum, NodeAccumNight, AnomaAccum, AnomaAccumNight, SolsDif, AcrSolsDif
        }
    }
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
        TermAvgRaw, TermAcrRaw, TermAcrSolsDif, TermAvgSolsDif,
        ///// 交食
        NodeAccum: NewmNodeAccum,
        AnomaAccum: NewmAnomaAccum,
        SolsDif: NewmSolsDif,
        NodeAccumNight: NewmNodeAccumNight,
        AnomaAccumNight: NewmAnomaAccumNight,
        AcrSolsDif: NewmAcrSolsDif,
    } = AutoNewmSyzygy(1)
    const {
        Sc: SyzygySc,
        Deci: SyzygyDeci,
        AvgDeci: SyzygyAvgDeci,
        NodeAccum: SyzygyNodeAccum,
        AnomaAccum: SyzygyAnomaAccum,
        SolsDif: SyzygySolsDif,
        AcrSolsDif: SyzygyAcrSolsDif,
    } = AutoNewmSyzygy(0)
    const LeapSurAcrThis = ZhangRange ? (LeapSurAvgThis - NewmTcorr[1] * ZhangRange / Lunar + ZhangRange) % ZhangRange : LeapSurAvgThis - NewmTcorr[1]
    // 中氣
    let LeapNumTerm = LeapNumAvgThis > 0 ? LeapNumAvgThis : 0
    let isLeapAdvan = 0, isLeapPost = 0
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
    const NewmStart = isAdvance && isLeapPrev ? 1 : 0
    const NewmEnd = isLeapThis ? 1 : NewmStart
    const TermStart = isAdvance && isLeapPrev ? 0 : NewmStart
    const TermEnd = NewmStart && !TermStart ? 0 : NewmEnd
    return {
        LeapLimit, OriginYear, JiYear, JiScOrder, SolsAccum, AccumPrint,
        NewmAvgSc, NewmAvgDeci,
        NewmSc, NewmInt, NewmRaw, NewmAcrRaw, NewmAcrInt, NewmDeci1, NewmDeci2, NewmDeci3,
        SyzygySc,
        TermAvgRaw, TermAcrRaw,
        LeapSurAvgThis, LeapSurAcrThis, LeapNumTerm, isAdvance, isLeapAdvan, isLeapPost, isLeapThis, isLeapPrev, isLeapNext,
        NewmStart, NewmEnd, TermStart, TermEnd,
        EquaDegAccumList, NewmEqua, TermAvgSolsDif, TermAcrSolsDif,
        //////// 交食用
        NewmNodeAccum, NewmNodeAccumNight, NewmAnomaAccum, NewmAnomaAccumNight, NewmDeci, NewmSolsDif, NewmAcrSolsDif,
        SyzygyNodeAccum, SyzygyAnomaAccum, SyzygyDeci, SyzygyAvgDeci, SyzygySolsDif, SyzygyAcrSolsDif,
    }
}
