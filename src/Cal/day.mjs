import Para from './para_calendars.mjs'
import {
    ScList, StemList, BranchList, StemList1, BranchList1, NayinList,
    WeekList, MansionNameList, MansionAnimalNameList,
    ManGodList, JianchuList, HuangheiList, YuanList,
    HalfTermList, HouListA, HouListB, Hexagram64ListA, Hexagram64ListB, HexagramSymbolListA, HexagramSymbolListB, FiveList2,
    nzh, AutoDegAccumList, NumList, MonNumList1,
} from './para_constant.mjs'
import {
    YearGodConvert, YearColorConvert, MonColorConvert, WangwangConvert, FubaoConvert, LsStarConvert, BloodConvert, TouringGodConvert
} from './day_luck.mjs'
import CalNewm from './newm_index.mjs'
import {
    AutoEqua2Eclp, AutoLongi2Lati, AutoMoonLongi, AutoMoonLati
} from './astronomy_bind.mjs'
import { AutoTcorr, AutoDifAccum, AutoMoonAcrS } from './astronomy_acrv.mjs'
import { Accum2Mansion, AutoNineOrbit } from './astronomy_other.mjs'
import { Jd2Date1 } from './time_jd2date.mjs'
import { AutoMoonAvgV } from './para_auto-constant.mjs'

export const CalDay = (CalName, YearStart, YearEnd) => {
    YearEnd = YearEnd || YearStart
    const Day = (CalName, year) => {
        const { Type, LunarRaw, Node, Anoma, SolarRaw, WeekCorr, MansionDayCorr, ScCorr } = Para[CalName]
        let { Solar, Sidereal, Lunar } = Para[CalName]
        const { LeapNumTermThis, WinsolsAccum, NewmInt, NewmRaw, NewmAcrRaw, NewmNodeAccumNightPrint, NewmAnomaAccumPrint, NewmAnomaAccumNightPrint } = CalNewm(CalName, year)[0]
        Solar = Solar || SolarRaw
        Sidereal = Sidereal || Solar
        Lunar = Lunar || LunarRaw
        const HouLeng = Solar / 72
        const HalfTermLeng = Solar / 24
        const HexagramLeng = Solar / 60
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        const ZhengInt = NewmInt[0] + (ScCorr || 0)
        const ZhengWinsolsDif = +(ZhengInt - WinsolsAccum).toFixed(5) // 正月夜半到冬至距離
        const WinsolsDeci = WinsolsAccum - Math.floor(WinsolsAccum)
        /////////// 預處理72候、五行、八卦列表//////////
        let HouList = [], Hexagram64List = [], HexagramSymbolList = [], FiveAccumList = [], HexagramAccumList = [], HouAccum = []
        if (Type < 7) {
            HouList = HouListA
        } else {
            HouList = HouListB
        }
        if (Type < 6) {
            Hexagram64List = Hexagram64ListA
            HexagramSymbolList = HexagramSymbolListA
        } else {
            Hexagram64List = Hexagram64ListB
            HexagramSymbolList = HexagramSymbolListB
        }
        for (let j = 0; j < 90; j++) {
            HouAccum[j] = HouLeng * j
            HouAccum[j] = parseFloat((HouAccum[j]).toPrecision(13))
        }
        const FiveLeng1 = Solar / 5
        const FiveLeng2 = Solar / 4 - FiveLeng1
        for (let i = 0; i <= 10; i++) {
            let FiveLeng = FiveLeng1
            if (i % 2 === 1) {
                FiveLeng = FiveLeng2
            }
            FiveAccumList[i] = FiveLeng
        }
        for (let i = 1; i <= 10; i++) {
            FiveAccumList[i] += FiveAccumList[i - 1]
            FiveAccumList[i] = parseFloat((FiveAccumList[i]).toPrecision(13))
        }
        FiveAccumList = [0, ...FiveAccumList]
        if (['Qianxiang', 'Jingchu'].includes(CalName)) { // 乾象景初用京房，後來都用孟喜
            const HexagramRangeA = 7 - HexagramLeng
            const HexagramRangeB = HexagramLeng - HexagramRangeA
            const HexagramRangeC = (Solar - (28 - 4 * HexagramRangeA)) / 56
            for (let i = 0; i <= 63; i++) {
                if (i === 0 || i === 16 || i === 33 || i === 48) {
                    HexagramAccumList[i] = HexagramRangeA
                } else if (i === 15 || i === 31 || i === 47 || i === 63) {
                    HexagramAccumList[i] = HexagramRangeB
                } else {
                    HexagramAccumList[i] = HexagramRangeC
                }
            }
            for (let i = 1; i <= 63; i++) {
                HexagramAccumList[i] += HexagramAccumList[i - 1]
                HexagramAccumList[i] = parseFloat((HexagramAccumList[i]).toPrecision(13))
            }
            HexagramAccumList = [0, ...HexagramAccumList]
            for (let i = 64; i <= 80; i++) {
                HexagramAccumList[i] = HexagramAccumList[i - 64] + Solar
                HexagramAccumList[i] = parseFloat((HexagramAccumList[i]).toPrecision(13))
            }
        } else {
            for (let j = 0; j < 75; j++) {
                HexagramAccumList[j] = HexagramLeng * j
                HexagramAccumList[j] = parseFloat((HexagramAccumList[j]).toPrecision(13))
            }
        }
        ///////
        const YearScOrder = ((year - 3) % 60 + 60) % 60
        const YearSc = ScList[YearScOrder]
        const YearStem = StemList.indexOf(YearSc[0])
        const YearBranch = BranchList.indexOf(YearSc[1])
        //////
        const EquaDegAccumList = AutoDegAccumList(CalName, year)
        const EclpDegAccumList = AutoDegAccumList(CalName, year, 1)
        ////// 沒滅
        const MoWinsolsDif = [], MieWinsolsDif = []
        const MoLeng = Solar / (Solar - 360)
        const FirstMo = Math.ceil(WinsolsAccum / MoLeng) * MoLeng // floor在冬至之前，ceil在之後
        for (let i = 0; i <= 6; i++) {
            MoWinsolsDif[i] = parseFloat((FirstMo + i * MoLeng).toPrecision(14)) // 距冬至日數
            if (Type <= 6 && MoWinsolsDif[i] === ~~MoWinsolsDif[i]) {
                MieWinsolsDif[i] = MoWinsolsDif[i]
            }
            MoWinsolsDif[i] = parseFloat((MoWinsolsDif[i] - WinsolsAccum).toPrecision(14))
            if (MieWinsolsDif[i]) {
                MieWinsolsDif[i] = parseFloat((MieWinsolsDif[i] - WinsolsAccum).toPrecision(14))
            }
        }
        if (Type >= 7) { // 大衍改革滅
            const MieLeng = Lunar / (30 - Lunar)
            const FirstMie = Math.ceil(WinsolsAccum / MieLeng) * MieLeng
            for (let i = 0; i <= 7; i++) {
                MieWinsolsDif[i] = parseFloat((FirstMie + i * MieLeng - WinsolsAccum).toPrecision(14))
            }
        }
        ////////
        let Era = ''
        if (year > 0) {
            Era = year + ' 年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
        } else {
            Era = '前 ' + (1 - year) + ' 年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
        }
        const YuanYear = ((year - 604) % 180 + 180) % 180 // 術數的元，以604甲子爲上元，60年一元，凡三元
        const YuanOrder = ~~(YuanYear / 60)
        const ThreeYuanYear = YuanYear - YuanOrder * 60
        const Yuan = YuanList[YuanOrder] + '元' + nzh.encodeS(ThreeYuanYear + 1) + '年'
        const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear)
        const YearColor = YearColorConvert(YuanYear)
        const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建        
        const OriginJdAccum = 2086292 + ~~(365.2423 * (year - 1000)) // 設公元1000年前冬至12月16日2086292乙酉(22)爲曆元，作爲儒略日標準
        const OriginJdDif = (WinsolsAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)
        const MonName = [], MonInfo = [], MonColor = [], Sc = [], Jd = [], Nayin = [], Week = [], Equa = [], Eclp = [], Duskstar = [], MoonEclp = [], MoonEclpLati = [], Rise = [], Dial = [], Lati = [], HouName = [], HexagramName = [], FiveName = [], ManGod = [], Luck = []
        let DayAccum = 0, JieAccum = 0, SummsolsDayAccum = 0, AutumnDayAccum = 0 // 各節積日 // 夏至積日// 立秋積日
        let JianchuDayAccum = ZhengInt - Math.floor(WinsolsAccum) // 建除
        let HuangheiDayAccum = JianchuDayAccum
        let JianchuOrigin = 0, HuangheiOrigin = 0, Fu1DayAccum = 0, Fu2DayAccum = 0, Fu3DayAccum = 0, HouOrder = 0, FiveOrder = 0, HexagramOrder = 0
        for (let i = 1; i <= 12 + (LeapNumTermThis > 0 ? 1 : 0); i++) { // 有閏就13             
            let NoleapMon = i
            if (LeapNumTermThis > 0) {
                if (i === LeapNumTermThis + 1) {
                    NoleapMon = i - 1
                } else if (i >= LeapNumTermThis + 2) {
                    NoleapMon = i - 1
                }
            }
            MonName[i] = MonNumList1[NoleapMon] + '月'
            if (LeapNumTermThis > 0 && i === LeapNumTermThis + 1) { // 好像有LeapNumTermThis<0的情況
                MonName[i] = '閏' + MonNumList1[LeapNumTermThis] + '月'
            }
            MonName[i] += NewmInt[i] - NewmInt[i - 1] === 29 ? '小' : '大'
            const MonColorFunc = MonColorConvert(YuanYear, NoleapMon, ZhengMonScOrder)
            MonInfo[i] = MonColorFunc.MonInfo
            MonColor[i] = MonColorFunc.MonColor
            let MoonEclpLongiNewmNight = 0, SunEclpLongiNewm = 0, AnomaCycle = 0, MoonAcrSNewm = 0, WinsolsDifNewm = 0
            if (Type < 4) {
                WinsolsDifNewm = NewmRaw[i - 1] - WinsolsAccum // 合朔加時 
            } else {
                WinsolsDifNewm = NewmAcrRaw[i - 1] - WinsolsAccum
            }
            if (Type > 1) {
                const AnomaAccumNewm = NewmAnomaAccumPrint[i - 1] // 加時入轉。這個求月行遲疾修正的步驟是我假設的
                const SunDifAccumNewm = AutoDifAccum(AnomaAccumNewm, WinsolsDifNewm, CalName).SunDifAccum
                if (Type < 11) {
                    const SunEquaLongiNewm = WinsolsDifNewm + SunDifAccumNewm
                    SunEclpLongiNewm = AutoEqua2Eclp(SunEquaLongiNewm, CalName).Equa2Eclp
                } else { // 授時直接以黃道為準                
                    SunEclpLongiNewm = WinsolsDifNewm + SunDifAccumNewm
                }
                if (Type < 4) {
                    MoonEclpLongiNewmNight = SunEclpLongiNewm - (NewmRaw[i - 1] - (NewmInt[i - 1])) * MoonAvgVDeg
                } else {
                    const MoonAcrSFunc = AutoMoonAcrS(AnomaAccumNewm, CalName)
                    AnomaCycle = MoonAcrSFunc.AnomaCycle
                    MoonAcrSNewm = MoonAcrSFunc.MoonAcrS
                    // const MoonAcrSNewmNight = AutoMoonAcrS(NewmAnomaAccumNightPrint[i - 1], CalName).MoonAcrS // newm文件中已經加上了進朔，不知道對不對
                    // const MoonEclpLongiNewmNight = SunEclpLongiNewm - (MoonAcrSNewm - MoonAcrSNewmNight)
                }
            }
            Sc[i] = []
            Jd[i] = []
            Nayin[i] = []
            Week[i] = []
            Rise[i] = []
            Dial[i] = []
            Lati[i] = []
            Equa[i] = []
            Eclp[i] = []
            Duskstar[i] = []
            MoonEclp[i] = []
            MoonEclpLati[i] = []
            HouName[i] = []
            HexagramName[i] = []
            FiveName[i] = []
            ManGod[i] = []
            Luck[i] = []
            for (let k = 1; k <= NewmInt[i] - NewmInt[i - 1]; k++) { // 每月日數                
                const WinsolsDifNight = ZhengWinsolsDif + DayAccum // 每日夜半距冬至日數
                const WinsolsDifInt = ZhengInt - Math.floor(WinsolsAccum) + DayAccum // 冬至當日爲0
                const WinsolsDifNoon = WinsolsDifNight + 0.5 // 每日正午                
                DayAccum++ // 這個位置不能變
                //////////天文曆///////////
                let SunEquaLongi = 0, SunEquaLongiAccum = 0, SunEclpLongi = 0, SunEclpLongiAccum = 0, SunEquaLongiNoon = 0, SunEclpLongiNoon = 0, MoonEclpLongi = 0, MoonEclpLongiAccum = 0, AnomaAccumNight = 0, NodeAccumNight = 0, MoonLongiLatiFunc = {}
                if (Type === 1) {
                    SunEquaLongiAccum = WinsolsDifNight + WinsolsAccum
                    SunEclpLongi = AutoEqua2Eclp(WinsolsDifNight, CalName).Equa2Eclp
                    SunEclpLongiAccum = SunEclpLongi + WinsolsAccum
                    MoonEclpLongiAccum = SunEquaLongiAccum * MoonAvgVDeg
                } else {
                    NodeAccumNight = (NewmNodeAccumNightPrint[i - 1] + k - 1) % Node
                    AnomaAccumNight = (NewmAnomaAccumNightPrint[i - 1] + k - 1) % Anoma
                    const AnomaAccumNoon = (AnomaAccumNight + 0.5) % Anoma // 正午入轉                    
                    NodeAccumNight = (NodeAccumNight + AutoTcorr(AnomaAccumNight, WinsolsDifNight, CalName, NodeAccumNight).NodeAccumCorrA) % Node
                    const SunDifAccumNight = AutoDifAccum(AnomaAccumNight, WinsolsDifNight, CalName).SunDifAccum
                    const SunDifAccumNoon = AutoDifAccum(AnomaAccumNoon, WinsolsDifNoon, CalName).SunDifAccum
                    if (Type < 11) {
                        SunEquaLongi = WinsolsDifNight + SunDifAccumNight
                        SunEquaLongiAccum = SunEquaLongi + WinsolsAccum
                        SunEquaLongiNoon = WinsolsDifNoon + SunDifAccumNoon
                        SunEclpLongi = AutoEqua2Eclp(SunEquaLongi, CalName).Equa2Eclp
                        SunEclpLongiAccum = SunEclpLongi + WinsolsAccum
                    } else { // 授時直接以黃道為準
                        SunEclpLongi = WinsolsDifNight + SunDifAccumNight
                        SunEclpLongiAccum = SunEclpLongi + WinsolsAccum
                        SunEquaLongi = AutoEqua2Eclp(SunEclpLongi, CalName).Eclp2Equa
                        SunEquaLongiAccum = SunEquaLongi + WinsolsAccum
                        SunEclpLongiNoon = WinsolsDifNoon + SunDifAccumNoon
                    }
                    // 元嘉開始計算月度就有計入遲疾的方法，大業就完全是定朔，但又是平朔注曆，這樣會衝突，我只能把麟德以前全部求平行度。
                    // 《中》頁514 月度：欽天以後，先求正交至平朔月行度、平朔太陽黃度，由於平朔日月平黃經相同，所以相加減卽得正交月黃度
                    if (Type < 4) {
                        MoonEclpLongi = MoonEclpLongiNewmNight + (k - 1) * MoonAvgVDeg
                        MoonEclpLongiAccum = MoonEclpLongi + WinsolsAccum
                    } else {
                        const MoonAcrSNight = AutoMoonAcrS(AnomaAccumNight, CalName).MoonAcrS
                        MoonEclpLongi = SunEclpLongiNewm + (MoonAcrSNight - MoonAcrSNewm + AnomaCycle) % AnomaCycle
                        MoonEclpLongiAccum = MoonEclpLongi + WinsolsAccum
                    }
                    if (Type < 11) {
                        MoonLongiLatiFunc = AutoMoonLati(NodeAccumNight, CalName)
                        MoonEclpLati[i][k] = AutoNineOrbit(NodeAccumNight, WinsolsDifNight, CalName) + MoonLongiLatiFunc.MoonEclpLati.toFixed(3) + '度'
                    }
                }
                const EquaFunc = Accum2Mansion(SunEquaLongiAccum, EquaDegAccumList, CalName, SunEquaLongi, WinsolsDeci)
                Equa[i][k] = EquaFunc.MansionResult
                Duskstar[i][k] = EquaFunc.DuskstarResult
                Eclp[i][k] = Accum2Mansion(SunEclpLongiAccum, EclpDegAccumList, CalName).MansionResult
                const Longi2LatiFunc = AutoLongi2Lati(Type === 11 ? SunEclpLongiNoon : SunEquaLongiNoon, WinsolsDeci, CalName)
                Lati[i][k] = Longi2LatiFunc.Lati.toFixed(3) + '度'
                Rise[i][k] = Longi2LatiFunc.Rise.toFixed(3) + '刻'
                Dial[i][k] = Longi2LatiFunc.Dial ? Longi2LatiFunc.Dial.toFixed(3) + '尺' : 0
                // 每日夜半月黃經
                const MoonEclpFunc = Accum2Mansion(MoonEclpLongiAccum, EclpDegAccumList, CalName)
                const MoonMansionOrder = MoonEclpFunc.MansionOrder
                let MoonMansionNote = ''
                if ((Type >= 2 && Type <= 4) && (MoonMansionOrder === 5 || MoonMansionOrder === 26)) { // 乾象規定月在張心署之
                    MoonMansionNote = `<span class='MoonMansionNote'>忌刑</span>`
                }
                let MoonEclpWhiteDif = ''
                if (Type > 5 && Type < 11) {
                    MoonEclpWhiteDif = `\n黃白差` + AutoMoonLongi(NodeAccumNight, MoonEclpLongi, CalName).EclpWhiteDif.toFixed(4)
                }
                MoonEclp[i][k] = MoonEclpFunc.MansionResult + MoonMansionNote + (MoonEclpWhiteDif || '')
                ///////////具注曆////////////
                const ScOrder = (ZhengInt % 60 + 60 + DayAccum) % 60
                Sc[i][k] = ScList[ScOrder]
                Jd[i][k] = parseInt(OriginJdAccum + OriginJdDif + WinsolsDifInt + 1)
                Jd[i][k] += ' ' + Jd2Date1(Jd[i][k]).Mmdd
                const Stem = StemList.indexOf(Sc[i][k][0])
                const Branch = BranchList.indexOf(Sc[i][k][1])
                const JieNum = Math.round((Math.ceil(~~(WinsolsDifNight / HalfTermLeng) / 2) + 11) % 12.1)
                // 順序不一樣！立春1，驚蟄2，清明3，立夏4，芒種5，小暑6，立秋7，白露8，寒露9，立冬10，大雪11，小寒12
                const JieDifInt = ~~((WinsolsDifNight - (JieNum * 2 + 1) * HalfTermLeng + WinsolsDeci + Solar) % Solar)
                if (Type >= 6) {
                    const WeekOrder = Math.round(((NewmInt[i - 1] + k - 1) % 7 + 5 + (WeekCorr || 0)) % 7.1)
                    const MansionOrder = Math.round((((NewmInt[i - 1] + k - 1) % 28 + 23 + (MansionDayCorr || 0)) + 28) % 28.1)
                    Week[i][k] = WeekList[WeekOrder] + NumList[WeekOrder] + MansionNameList[MansionOrder] + MansionAnimalNameList[MansionOrder]
                }
                for (let j = HouOrder; j < 90; j++) { // 氣候 
                    if (HouAccum[j] >= WinsolsDifNight && HouAccum[j] < WinsolsDifNight + 1) {
                        HouOrder = j % 72
                        const TermOrder = HouOrder % 3 ? -1 : (Math.round(HouOrder / 3)) % 24
                        HouName[i][k] = TermOrder >= 0 ? `<span class='term'>${HalfTermList[TermOrder]}</span>` : ''
                        if (Type >= 3) {
                            HouName[i][k] += HouList[HouOrder] + ((HouAccum[j] + WinsolsAccum - Math.floor(HouAccum[j] + WinsolsAccum)).toFixed(4)).slice(2, 6)
                        } else if (TermOrder >= 0) {
                            HouName[i][k] += ((HouAccum[j] + WinsolsAccum - Math.floor(HouAccum[j] + WinsolsAccum)).toFixed(4)).slice(2, 6)
                        }
                        if (j % 6 === 3) { // 立春等節
                            JieAccum = DayAccum
                        }
                        if (j === 36) {
                            SummsolsDayAccum = DayAccum
                        } else if (j === 45) {
                            AutumnDayAccum = DayAccum
                        }
                        break // 兩個要點：break；由於建寅，要循環不止72個
                    } else {
                        HouName[i][k] = ''
                    }
                }
                if (DayAccum === 1) {
                    const XiaohanDifInt = ZhengInt - Math.floor(WinsolsAccum) - HalfTermLeng + DayAccum
                    const tmp = ~~((WinsolsDifInt + 1 - XiaohanDifInt) / 12)
                    const tmp1 = WinsolsDifInt + 1 - tmp * 12 - Branch
                    JianchuOrigin = tmp1 + 2 // 小寒後第一個丑開始建除
                    HuangheiOrigin = tmp1 + 12 // 小寒後第一個戌開始黃黑道
                }
                JianchuDayAccum++
                HuangheiDayAccum++
                if (DayAccum === JieAccum) {
                    JianchuDayAccum--
                    HuangheiDayAccum--
                }
                if (DayAccum === JieAccum + 1 && HouOrder !== 9) {
                    HuangheiDayAccum--
                }
                const Jianchu = JianchuList[((JianchuDayAccum - JianchuOrigin) % 12 + 12) % 12]
                const Huanghei = HuangheiList[((HuangheiDayAccum - HuangheiOrigin) % 12 + 12) % 12]
                if (SummsolsDayAccum && !Fu2DayAccum) {
                    Fu1DayAccum = SummsolsDayAccum + (17 - Stem) % 10 + 20
                    Fu2DayAccum = Fu1DayAccum + 10
                }
                if (AutumnDayAccum && !Fu3DayAccum) {
                    Fu3DayAccum = AutumnDayAccum + (17 - Stem) % 10
                }
                let Fu = ''
                if (DayAccum === Fu1DayAccum) {
                    Fu = `<span class='sanfu'>初伏</span>`
                } else if (DayAccum === Fu2DayAccum) {
                    Fu = `<span class='sanfu'>中伏</span>`
                } else if (DayAccum === Fu3DayAccum) {
                    Fu = `<span class='sanfu'>末伏</span>`
                }
                Nayin[i][k] = NayinList[Math.ceil(ScOrder / 2)] + Jianchu + Huanghei
                HouName[i][k] += Fu
                for (let j = 0; j < 7; j++) {
                    if (MieWinsolsDif[j] >= WinsolsDifNight && MieWinsolsDif[j] < WinsolsDifNight + 1) {
                        HouName[i][k] += `<span class='momie'>滅</span>` + (MieWinsolsDif[j] + WinsolsAccum - Math.floor(MieWinsolsDif[j] + WinsolsAccum)).toFixed(4).slice(2, 6)
                        break
                    } else if (MoWinsolsDif[j] >= WinsolsDifNight && MoWinsolsDif[j] < WinsolsDifNight + 1) {
                        HouName[i][k] += `<span class='momie'>沒</span>` + (MoWinsolsDif[j] + WinsolsAccum - Math.floor(MoWinsolsDif[j] + WinsolsAccum)).toFixed(4).slice(2, 6)
                        break
                    }
                }
                for (let l = 0; l < 10; l++) { // 8個五行
                    if (WinsolsDifNight >= FiveAccumList[l] && WinsolsDifNight < FiveAccumList[l] + 1) {
                        FiveOrder = l % 8
                        const FiveDeci = (WinsolsDifNight - FiveAccumList[l]).toFixed(4).slice(2, 6)
                        FiveName[i][k] = `<span class='FiveNameSymbol'>` + FiveList2[FiveOrder] + `</span>` + FiveDeci
                        break
                    }
                }
                if (Type < 11) { // 授時不算64卦
                    for (let m = HexagramOrder; m < 80; m++) {
                        if (WinsolsDifNight >= HexagramAccumList[m] && WinsolsDifNight < HexagramAccumList[m] + 1) {
                            HexagramOrder = m % (Hexagram64List === Hexagram64ListA ? 64 : 60)
                            const HexagramDeci = (WinsolsDifNight - HexagramAccumList[m]).toFixed(4).slice(2, 6)
                            HexagramName[i][k] = Hexagram64List[HexagramOrder] + `<span class='HexagramSymbol'>` + HexagramSymbolList[HexagramOrder] + `</span>` + HexagramDeci
                            break
                        } else {
                            HexagramName[i][k] = ''
                        }
                    }
                }
                const Wangwang = WangwangConvert(NoleapMon, Stem, Branch, JieNum, JieDifInt)
                const Fubao = FubaoConvert(NoleapMon, Stem)
                const LongShortStar = LsStarConvert(NoleapMon, k)
                const BloodFunc = BloodConvert(NoleapMon, Branch, k)
                const Blood = BloodFunc.Blood
                const Lin = BloodFunc.Lin
                const TouringGod = TouringGodConvert(ScOrder)
                Luck[i][k] = (Wangwang || '') + (Fubao || '') + (Lin || '') + (LongShortStar || '')
                ManGod[i][k] = ManGodList[k] + (Blood || '') + (TouringGod || '')
                Sc[i][k] = NumList[k] + '日' + Sc[i][k]
            }
        }
        DayAccum = '凡' + nzh.encodeS(DayAccum) + '日　' + Yuan
        return {
            Era, DayAccum, YearGod, YearColor, MonName, MonInfo, MonColor,
            Sc, Jd, Nayin, Week, Equa, Eclp, Lati, Rise, Dial, Duskstar, MoonEclp, MoonEclpLati,
            HouName, HexagramName, FiveName, ManGod, Luck
        }
    }
    const result = []
    for (let year = YearStart; year <= YearEnd; year++) {
        result.push(Day(CalName, year))
    }
    return result
}
// console.log(CalDay('Dayan', 1256, 1256))