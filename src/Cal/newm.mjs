import Para from './para_calendars.mjs'
import { ScList, deci, fix } from './para_constant.mjs'
import { AutoDifAccum, AutoTcorr } from './astronomy_acrv.mjs'
import { mansion, AutoNewmPlus, AutoSyzygySub } from './astronomy_other.mjs'
// console.log(13.17639477138888-385.81673571944444/29.530593)
const fmod = (X, m) => X - Math.floor(X / m) * m
const fm60 = X => fmod(X, 60)
// const cal = (Name, Y) => {
export default (Name, Y) => {
    const { Type, isAcr, isNewmPlus, Sidereal, SolarNumer, LunarNumer, Denom, Anoma, Node, AcrTermList,
        OriginAd, CloseOriginAd, OriginMonNum, ZhengNum,
        YuanRange, JiRange, ZhangRange, ZhangLeap,
        YinyangConst, EcliConst, MansionRaw } = Para[Name]
    let { Solar, SolarRaw, Lunar, LunarRaw, ScConst, NodeConst, FirstConst, AnomaConst, MansionConst, SolsConst
    } = Para[Name]
    ScConst = ScConst || 0
    SolarRaw = SolarRaw || Solar
    LunarRaw = LunarRaw || Lunar
    FirstConst = FirstConst || 0
    NodeConst = NodeConst || 0
    AnomaConst = Type === 11 ? AnomaConst : (AnomaConst / Denom || 0)
    MansionConst = MansionConst || 0
    SolsConst = SolsConst || 0
    const isExcl = Type >= 4 ? 1 : 0
    const ZhangMon = Math.round(ZhangRange * (12 + ZhangLeap / ZhangRange))
    // const JiMon = JiRange * ZhangMon / ZhangRange
    const ZhengSd = ZhengNum - OriginMonNum
    const OriginYear = Y - (OriginAd || CloseOriginAd) // 上元積年（算上）
    // const CloseSd = CloseOriginAd - OriginAd // 統天距算
    const CloseOriginYear = Y - CloseOriginAd // 距差。授時以1280開始
    let SolarChangeAccum = 0, LunarChangeAccum = 0, LeapSurAvg = 0, OriginAccumThis = 0
    // 統天躔差=斗分差/10000*距差
    const signX = CloseOriginYear > 0 ? 1 : -1
    if (Name === 'Tongtian') { // 藤豔輝頁70、《中國古代曆法》第610頁。如果不算消長的話就完全不對，因爲上元積年就考慮了消長        
        SolarChangeAccum = signX * .0127 * CloseOriginYear ** 2 / Denom // 加在冬至上的歲實消長
        // Solar = SolarRaw // - .021167 * CloseOriginYear / Denom
        // Lunar = CloseOriginYear ? (SolarRaw + SolarChangeAccum / CloseOriginYear - 10.5 / Denom) / (SolarRaw / LunarRaw) : LunarRaw
        LunarChangeAccum = -10.5 * CloseOriginYear / Denom
    } else if (['Shoushi', 'Shoushi2'].includes(Name)) {
        // Solar = parseFloat((SolarRaw - (~~((CloseOriginYear + 1) / 100) / 10000)).toPrecision(10))
        Solar = +(SolarRaw - ~~((CloseOriginYear + 1) / 100) * .0001).toFixed(4)
    } else if (Name === 'Wannian') {
        // 置曆元所距年積算為汎距，來加往減元紀為定距，以朞實乘之，四約，為積日，不滿，退除為刻，是名汎積。定距自相乘，七之八而一，所得滿百萬為日，不滿為刻及分秒，〔帶半秒已上者收作一秒〕是名節氣歲差，用減汎積，餘為定積。
        // Solar = parseFloat((SolarRaw - (Y - 1281) * 1.75 * 1e-6).toPrecision(10))       
        SolarChangeAccum = signX * 8.75 * 1e-7 * (Y - 1281) ** 2
    }
    const TermLeng = Solar / 12 // 每個中氣相隔的日數
    if (EcliConst) {
        NodeConst = Name === 'Yuanjia' ? Node * EcliConst : (Node / 2) * EcliConst
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
    if (Type === 11) fixed = 10 // 大統通軌最多有10位
    else if (OriginYear > 8.5 * 1e7) { }
    else if (OriginYear > 8.5 * 1e6) fixed = 5
    else fixed = 6
    // const WannianDingju = CloseOriginYear => {
    //     const Dingju = CloseOriginYear + 4560 // 定距        
    //     const OriginAccum = Dingju * 365.25 - Dingju ** 2 * 8.75 * 1e-7
    //     return OriginAccum
    // }
    const ZoneDif = Name === 'Gengwu' ? 20000 * .04359 / Denom : 0 // 里差
    let SolsAccum = Type < 11 ? OriginYear * Solar + SolsConst + ZoneDif + SolarChangeAccum : 0
    SolsAccum = +SolsAccum.toFixed(fixed)
    if (ZhangRange) {
        LeapSurAvg = OriginYear * ZhangMon % ZhangRange // 今年閏餘
    } else if (Type < 8) {
        LeapSurAvg = OriginYear * SolarNumer % LunarNumer // OriginYear * SolarNumer爲期總
    } else if (Type < 11) {
        LeapSurAvg = fmod(SolsAccum + FirstConst, LunarRaw)
    } else if (Name === 'Wannian') {
        // 置歲定積減去律應滿律總去之不盡得歲首黃鍾正律大小餘大餘命甲子筭外累加律策得次律大小餘滿律總去之 
        // 置歲定積減去閏應滿朔策去之不盡即所求閏餘日及分秒
        // OriginAccumThis = WannianDingju(CloseOriginYear)
        // const OriginAccumPrev = WannianDingju(CloseOriginYear - 1)
        // const OriginAccumNext = WannianDingju(CloseOriginYear + 1)
        // SolsAccum = OriginAccumThis + SolsConst
        // const LeapAccumThis = OriginAccumThis + FirstConst // 閏積   
        OriginAccumThis = CloseOriginYear * SolarRaw + SolarChangeAccum
        const LeapAccumThis = OriginAccumThis - FirstConst // 閏積
        LeapSurAvg = parseFloat(fmod(LeapAccumThis, Lunar).toPrecision(14)) // 閏餘、冬至月齡        
    } else if (Type === 11) {
        OriginAccumThis = CloseOriginYear * Solar // 中積
        SolsAccum = OriginAccumThis + SolsConst // 通積：該年冬至積日
        const LeapAccumThis = OriginAccumThis + FirstConst // 閏積
        LeapSurAvg = parseFloat(fmod(LeapAccumThis, Lunar).toPrecision(14)) // 閏餘、冬至月齡        
    }
    const SolsDeci = deci(SolsAccum) //.toFixed(fixed)
    let FirstAccum = 0, FirstAnomaAccum = 0, FirstNodeAccum = 0
    if (ZhangRange) {
        FirstAccum = Math.floor(OriginYear * ZhangMon / ZhangRange) * Lunar
    } else if (Type < 8) {
        FirstAccum = SolsAccum - LeapSurAvg / Denom + LunarChangeAccum
    } else FirstAccum = SolsAccum - LeapSurAvg + LunarChangeAccum
    if (Node && Type < 11) {
        FirstNodeAccum = (FirstAccum + NodeConst + (YinyangConst === -1 ? Node / 2 : 0) + ZoneDif / 18) % Node
    } else if (Type >= 11) {
        FirstNodeAccum = fmod(OriginAccumThis - LeapSurAvg + NodeConst + (YinyangConst === -1 ? Node / 2 : 0), Node)
    }
    FirstAccum += ZoneDif
    if (Name === 'Qianxiang') {
        FirstAnomaAccum = (Math.floor((OriginYear + 1) * ZhangMon / ZhangRange) * Lunar) % Anoma // 算外。我也不知道怎麼積年就要+1。劉洪濤頁133，突然想到的！！存疑！！
    } else if (Type < 11) {
        FirstAnomaAccum = fmod(FirstAccum + AnomaConst + (Name === 'Shenlong' ? Anoma / 2 : 0), Anoma)
    } else if (Type === 11) {
        FirstAnomaAccum = fmod(OriginAccumThis - LeapSurAvg + AnomaConst, Anoma)
    }
    FirstAccum = +FirstAccum.toFixed(fixed)
    FirstAnomaAccum = +FirstAnomaAccum.toFixed(fixed)
    FirstNodeAccum = +FirstNodeAccum.toFixed(fixed)
    const AccumPrint = (Anoma ? '轉' + fmod(SolsAccum + AnomaConst, Anoma).toFixed(4) : '') +
        (Node ? '交' + ((SolsAccum % Node + NodeConst + (YinyangConst === -1 ? Node / 2 : 0) + Node) % Node).toFixed(4) : '') +
        (Sidereal ? '週' + fmod(SolsAccum + MansionConst, Sidereal).toFixed(4) : '')
    let LeapLimit = 0
    if (ZhangRange) {
        LeapLimit = ZhangRange - ZhangLeap
    } else if (Type <= 7) {
        LeapLimit = parseFloat((13 * LunarNumer - SolarNumer).toPrecision(14))
    } else {
        LeapLimit = parseFloat((13 * Lunar - Solar).toPrecision(14))
    }
    const main = isNewm => {
        const AvgRaw = [], AvgInt = [], AvgSc = [], AvgDeci = [], TermAcrRaw = [], TermAcrSd = [], TermAvgRaw = [], TermAvgSd = [], Term1AvgRaw = [], Term1AvgSd = [], Term1Sc = [], Term1Deci = [], Term1AcrRaw = [], Term1AcrSd = [], Term1AcrSc = [], Term1AcrDeci = [], Term1Equa = [], Term1Eclp = [], TermSc = [], TermDeci = [], TermAcrSc = [], TermAcrDeci = [], TermEqua = [], TermEclp = [], AnomaAccum = [], AnomaAccumMidn = [], NodeAccum = [], NodeAccumMidn = [], AcrInt = [], Int = [], Raw = [], Tcorr = [], AcrRaw = [], AcrMod = [], Sc = [], Deci1 = [], Deci2 = [], Deci3 = [], Deci = [], Sd = [], AcrSd = [], Eclp = [], Equa = []
        for (let i = 0; i <= 14; i++) {
            AvgRaw[i] = +(FirstAccum + (ZhengSd + i - (isNewm ? 1 : .5)) * Lunar).toFixed(fixed)
            AvgInt[i] = Math.floor(AvgRaw[i])
            AvgSc[i] = ScList[fm60(AvgInt[i] + 1 + ScConst)]
            AvgDeci[i] = deci(AvgRaw[i])
            Sd[i] = ((ZhengSd + i - (isNewm ? 1 : .5)) * Lunar + FirstAccum - SolsAccum + Solar) % Solar
            let Tcorr1 = 0
            if (Anoma) {
                AnomaAccum[i] = +((FirstAnomaAccum + (ZhengSd + i - 1) * SynodicAnomaDif + (isNewm ? 0 : Lunar / 2)) % Anoma).toFixed(fixed) // 上元積年幾千萬年，精度只有那麼多了，再多的話誤差更大
                AnomaAccumMidn[i] = ~~AnomaAccum[i]
                const TcorrBindFunc = AutoTcorr(AnomaAccum[i], Sd[i], Name)
                if (Type <= 4) {
                    Tcorr[i] = TcorrBindFunc.Tcorr1
                    Tcorr1 = Tcorr[i]
                } else if (Type < 11) {
                    Tcorr[i] = TcorrBindFunc.Tcorr2
                    Tcorr1 = TcorrBindFunc.Tcorr1
                } else Tcorr[i] = TcorrBindFunc.Tcorr2 // Type === 11
                AcrRaw[i] = AvgRaw[i] + Tcorr[i]
                if (Math.floor(AcrRaw[i]) > Math.floor(AvgRaw[i])) { // 定朔入轉同經朔，若定朔大餘有變化，則加減一整日。變的應該是夜半，而非加時
                    AnomaAccumMidn[i]++
                } else if (Math.floor(AcrRaw[i]) < Math.floor(AvgRaw[i])) {
                    AnomaAccumMidn[i]--
                }
                AcrMod[i] = fm60(AcrRaw[i])
                AcrInt[i] = Math.floor(AcrRaw[i])
                if (Type <= 4) {
                    Deci[i] = deci(AcrRaw[i])
                    Deci1[i] = Deci[i]
                } else if (Type < 11) {
                    Deci[i] = deci(AcrRaw[i])
                    Deci2[i] = fix(Deci[i], 3)
                    if (Tcorr1) Deci1[i] = deci(AvgRaw[i] + Tcorr1)
                } else if (Type === 11) {
                    Deci[i] = deci(AcrRaw[i])
                    Deci3[i] = fix(Deci[i], 3)
                }
            } else Deci[i] = AvgDeci[i]
            AcrSd[i] = Sd[i] + Tcorr[i] // 授時：定朔入曆=經朔入盈缩历+加減差
            let NewmPlus = 0, SyzygySub = 0, NewmPlusPrint = '', SyzygySubPrint = ''
            if (isNewm) {
                if (isAcr && isNewmPlus) {
                    const Func = AutoNewmPlus((Deci1[i] || Deci[i]), Sd[i], SolsDeci, Name) // 進朔
                    NewmPlus = Func.NewmPlus
                    NewmPlusPrint = Func.Print
                }
                const Func = mansion(Name, Y,
                    Type >= 5 ? AcrSd[i] + AutoDifAccum(0, AcrSd[i], Name).SunDifAccum : undefined, AcrSd[i])
                Equa[i] = Func.Equa // 授時：定朔加時定積度=定朔加時中積（即定朔入曆）+盈縮差
                Eclp[i] = Func.Eclp
                TermAvgSd[i] = (i + ZhengSd - 1) * TermLeng
                TermAvgRaw[i] = SolsAccum + TermAvgSd[i]
                const tmp = fm60(TermAvgRaw[i] + isExcl + ScConst)
                TermSc[i] = ScList[~~tmp]
                TermDeci[i] = fix(deci(tmp))
                Term1AvgSd[i] = (i + ZhengSd - 1.5) * TermLeng
                Term1AvgRaw[i] = SolsAccum + Term1AvgSd[i]
                const tmp1 = fm60(Term1AvgRaw[i] + isExcl + ScConst)
                Term1Sc[i] = ScList[~~tmp1]
                Term1Deci[i] = fix(deci(tmp1))
                if (Type >= 5 && AcrTermList) {
                    // 定中氣
                    const TermNum3 = 2 * (i + ZhengSd - 1)
                    let Plus = 0
                    if (TermNum3 >= 24) Plus = Solar
                    else if (TermNum3 < 0) Plus = -Solar
                    TermAcrSd[i] = AcrTermList[(TermNum3 + 24) % 24] + Plus
                    TermAcrRaw[i] = SolsAccum + TermAcrSd[i] // 定氣距冬至+中積                
                    const tmp2 = fm60(TermAcrRaw[i] + isExcl + ScConst)
                    TermAcrSc[i] = ScList[~~tmp2]
                    TermAcrDeci[i] = fix(deci(tmp2), 3)
                    // 定節氣
                    const TermNum2 = 2 * (i + ZhengSd - 1) - 1
                    let Plus1 = 0
                    if (TermNum2 >= 24) Plus1 = Solar
                    else if (TermNum2 < 0) Plus1 = -Solar
                    Term1AcrSd[i] = AcrTermList[(TermNum2 + 24) % 24] + Plus1
                    Term1AcrRaw[i] = SolsAccum + Term1AcrSd[i] // 定氣距冬至+中積                
                    const tmp3 = fm60(Term1AcrRaw[i] + isExcl + ScConst)
                    Term1AcrSc[i] = ScList[~~tmp3]
                    Term1AcrDeci[i] = fix(deci(tmp3), 3)
                }
                if (MansionRaw) {
                    const Func = mansion(Name, Y, TermAvgSd[i], TermAvgSd[i])
                    const Func1 = mansion(Name, Y, Term1AvgSd[i], Term1AvgSd[i]) // 這裏省略了紀元等提到的今年次年黃赤道差之差
                    TermEqua[i] = Func.Equa
                    TermEclp[i] = Func.Eclp
                    Term1Equa[i] = Func1.Equa
                    Term1Eclp[i] = Func1.Eclp
                }
            } else {
                const Func = AutoSyzygySub(Deci[i], Sd[i], SolsDeci, Name) // 退望
                SyzygySub = Func.SyzygySub
                SyzygySubPrint = Func.Print
            }
            Int[i] = isAcr ? AcrInt[i] : AvgInt[i]
            Raw[i] = isAcr ? AcrRaw[i] : AvgRaw[i]
            Int[i] += NewmPlus + SyzygySub // 這裏int是二次內差的結果，但線性與二次分屬兩日的極端情況太少了，暫且不論
            Raw[i] += NewmPlus + SyzygySub
            AcrInt[i] += NewmPlus + SyzygySub
            AnomaAccumMidn[i] += NewmPlus
            if (isNewm) {
                if (Tcorr[i]) {
                    Sc[i] = ScList[fm60(AcrInt[i] + ScConst + 1)] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
                }
            } else {
                if (Tcorr[i]) {
                    Sc[i] = ScList[fm60(AcrInt[i] + ScConst + 1)] + (NewmPlusPrint || '') + (SyzygySubPrint || '')
                } else {
                    Sc[i] = AvgSc[i]
                }
            }
            if (Node) {
                NodeAccum[i] = +((FirstNodeAccum + (ZhengSd + i - 1) * Lunar + (isNewm ? 0 : SynodicNodeDif50)) % Node).toFixed(fixed)
                NodeAccumMidn[i] = ~~NodeAccum[i]
            }
            NodeAccumMidn[i] += NewmPlus // 給曆書用，不知道這樣可不可以
            if (Tcorr1) {
                Deci1[i] = fix(Deci1[i], 3)
            }
        }
        let LeapNumTerm = 0
        //////// 置閏
        if (isNewm) {
            const NewmRaw = isAcr ? AcrRaw : AvgRaw
            for (let i = 1; i <= 12; i++) {
                if ((~~TermAvgRaw[i] < ~~NewmRaw[i + 1]) && (~~TermAvgRaw[i + 1] >= ~~NewmRaw[i + 2])) {
                    LeapNumTerm = i // 閏Leap月，第Leap+1月爲閏月
                    break
                }
            }
        }
        return {
            AvgSc, Tcorr, AvgDeci, Int, Raw, Sc, AcrInt, AcrRaw,
            Deci, Deci1, Deci2, Deci3, Equa, Eclp, Term1Sc, Term1Deci, Term1AcrSc, Term1AcrDeci, Term1Equa, Term1Eclp, TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEqua, TermEclp, LeapNumTerm,
            /// 交食用到
            NodeAccum, NodeAccumMidn, AnomaAccum, AnomaAccumMidn, Sd, AcrSd
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
        Deci: NewmDeci, // 最精確的那個數字
        Deci1: NewmDeci1,
        Deci2: NewmDeci2,
        Deci3: NewmDeci3,
        Equa: NewmEqua,
        Eclp: NewmEclp,
        Term1Sc, Term1Deci, Term1AcrSc, Term1AcrDeci, Term1Equa, Term1Eclp,
        TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEqua, TermEclp, LeapNumTerm,
        ///// 交食
        NodeAccum: NewmNodeAccum,
        AnomaAccum: NewmAnomaAccum,
        Sd: NewmSd,
        NodeAccumMidn: NewmNodeAccumMidn,
        AnomaAccumMidn: NewmAnomaAccumMidn,
        AcrSd: NewmAcrSd,
    } = main(true)
    const {
        Sc: SyzygySc,
        Deci: SyzygyDeci,
        AvgDeci: SyzygyAvgDeci,
        NodeAccum: SyzygyNodeAccum,
        AnomaAccum: SyzygyAnomaAccum,
        Sd: SyzygySd,
        AcrSd: SyzygyAcrSd,
    } = main(false)
    const LeapSurAcr = ZhangRange ? (LeapSurAvg - NewmTcorr[1] * ZhangRange / Lunar + ZhangRange) % ZhangRange : LeapSurAvg - NewmTcorr[1]
    return {
        LeapLimit, OriginYear, JiYear, JiScOrder, SolsAccum, AccumPrint,
        NewmAvgSc, NewmAvgDeci,
        NewmSc, NewmInt, NewmRaw, NewmAcrRaw, NewmAcrInt, NewmDeci1, NewmDeci2, NewmDeci3,
        SyzygySc,
        Term1Sc, Term1Deci, Term1AcrSc, Term1AcrDeci, Term1Equa, Term1Eclp,
        TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEqua, TermEclp,
        LeapSurAvg, LeapSurAcr, LeapNumTerm,
        NewmEqua, NewmEclp,
        //////// 交食用
        SolsDeci, NewmNodeAccum, NewmNodeAccumMidn, NewmAnomaAccum, NewmAnomaAccumMidn, NewmDeci, NewmSd, NewmAcrSd,
        SyzygyNodeAccum, SyzygyAnomaAccum, SyzygyDeci, SyzygyAvgDeci, SyzygySd, SyzygyAcrSd,
    }
}
// console.log(cal('Wuji', 1598))