import {
    ScList,
    StemList,
    BranchList,
    StemList1,
    BranchList1,
    NayinList,
    WeekList,
    MansionNameList,
    MansionAnimalNameList,
    ManGodList,
    HouList,
    HexagramList2,
    HexagramAccumListA,
    FiveAccumListA,
    HexagramAccumListB,
    FiveAccumListB,
    FiveList2,
    AutoMansion,
    JianchuList,
    HuangheiList,
    YuanList,
    HalfTermList,
    NumList,
    MonNumList,
    nzh,
} from './para_constant.mjs'
import {
    YearGodConvert,
    YearColorConvert,
    MonColorConvert,
    WangwangConvert,
    FubaoConvert,
    LsStarConvert,
    BloodConvert,
    TouringGodConvert,
} from './day_luck.mjs'
import {
    Bind,
} from './bind.mjs'
import CalNewm from './newm_index.mjs'
import {
    AutoEqua2Eclp,
    AutoLongi2Lati,
    AutoMoonLongiLati
} from './bind_astronomy.mjs'
import {
    AutoDifAccum,
    AutoMoonAvgV
} from './astronomy_acrv.mjs'
import Deg2Mansion from './astronomy_deg2mansion.mjs'
import {
    Jd2Date1
} from './time_jd2date.mjs'
import { AutoTcorr } from './astronomy_acrv.mjs'

export const CalDay = (CalName, YearStart, YearEnd) => {
    if (YearEnd === undefined) {
        YearEnd = YearStart
    }
    const Day = (CalName, year) => {
        const {
            Type,
            AutoPara,
        } = Bind(CalName)
        const {
            LunarRaw,
            Node,
            Anoma,
            SolarRaw,
            MansionConst,
            MansionRaw,
            MansionFractPosition,
            NightList,
            WeekCorr,
            MansionCorr
        } = AutoPara[CalName]
        let {
            Solar,
            Sidereal,
            Lunar,
        } = AutoPara[CalName]
        const {
            Month,
            LeapNumTermThis,
            OriginAccum,
            NewmAcrOrderRaw,
            NewmNodeAccumPrint,
            NewmAnomaAccumPrint
        } = CalNewm(CalName, year)[0]
        let {
            NewmOrderRaw,
        } = CalNewm(CalName, year)[0]
        const {
            EquaDegList,
            EclpDegList
        } = AutoMansion(CalName, year)
        if (Type >= 6) {
            NewmOrderRaw = NewmAcrOrderRaw
        }
        Solar = Solar || SolarRaw
        Sidereal = Sidereal || Solar
        Lunar = Lunar || LunarRaw
        const HouLeng = Solar / 72
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        const HalfNode = Node / 2
        const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
        const FirstOrderRaw = NewmOrderRaw[0]
        const FirstWinsolsDif = +(FirstOrderRaw - OriginAccum).toFixed(5) // 正月到冬至距離
        let HexagramAccumList = []
        let FiveAccumList = []
        if (Type < 6) {
            HexagramAccumList = HexagramAccumListA
            FiveAccumList = FiveAccumListA
        } else {
            HexagramAccumList = HexagramAccumListB
            FiveAccumList = FiveAccumListB
        }
        const WinsolsDecimal = OriginAccum - Math.floor(OriginAccum)
        /////////// 預處理72候列表//////////
        let HouAccum = []
        for (let j = 0; j < 90; j++) {
            HouAccum[j] = HouLeng * j
            HouAccum[j] = parseFloat((HouAccum[j]).toPrecision(14))
        }
        const YearScOrder = ((year - 3) % 60 + 60) % 60
        const YearSc = ScList[YearScOrder]
        const YearStem = StemList.indexOf(YearSc[0])
        const YearBranch = BranchList.indexOf(YearSc[1])
        ////// 沒滅
        const MoWinsolsDif = []
        const MieWinsolsDif = []
        const MoLeng = Solar / (Solar - 360)
        const FirstMo = Math.ceil(OriginAccum / MoLeng) * MoLeng // floor在冬至之前，ceil在之後
        for (let i = 0; i <= 6; i++) {
            MoWinsolsDif[i] = parseFloat((FirstMo + i * MoLeng).toPrecision(14)) // 距冬至日數
            if (Type <= 6 && MoWinsolsDif[i] === ~~MoWinsolsDif[i]) {
                MieWinsolsDif[i] = MoWinsolsDif[i]
            }
            MoWinsolsDif[i] = parseFloat((MoWinsolsDif[i] - OriginAccum).toPrecision(14))
            if (MieWinsolsDif[i]) {
                MieWinsolsDif[i] = parseFloat((MieWinsolsDif[i] - OriginAccum).toPrecision(14))
            }
        }
        if (Type >= 7) { // 大衍改革滅
            const MieLeng = Lunar / (30 - Lunar)
            const FirstMie = Math.ceil(OriginAccum / MieLeng) * MieLeng
            for (let i = 0; i <= 7; i++) {
                MieWinsolsDif[i] = parseFloat((FirstMie + i * MieLeng - OriginAccum).toPrecision(14))
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
        const HalfTermLeng = Solar / 24
        const OriginJdAccum = 2086292 + ~~(365.2423 * (year - 1000)) // 設公元1000年前冬至12月16日2086292乙酉(22)爲曆元，作爲儒略日標準
        const OriginJdDif = (OriginAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)
        const MonName = []
        const MonInfo = []
        const MonColor = []
        const Sc = []
        const Jd = []
        const Nayin = []
        const Week = []
        const SunEquaLongiAccum = []
        const SunEclpLongiAccum = []
        const MoonEclpLongiAccum = []
        const MoonEclpPrint = []
        const MoonEclpLati = []
        const Sunrise = [] // 日出時刻
        const Dial = [] // 晷長
        const Lati = [] // 日赤緯
        // const MoName = [] // 沒滅
        const HouName = [] // 候名 
        const HexagramName = [] // 推卦用事
        const ManGod = [] // 人神
        const Luck = [] // 宜忌
        let DayAccum = 0
        let JieAccum = 0 // 各節積日
        let SummsolsDayAccum = 0 // 夏至積日
        let AutumnDayAccum = 0 // 立秋積日
        let JianchuDayAccum = FirstOrderRaw - Math.floor(OriginAccum)
        let HuangheiDayAccum = JianchuDayAccum
        let JianchuOrigin = 0
        let HuangheiOrigin = 0
        let Fu1DayAccum = 0
        let Fu2DayAccum = 0
        let Fu3DayAccum = 0
        let HouOrder = 0
        let FiveOrder = 0
        let HexagramOrder = 0
        for (let i = 1; i <= 12 + (LeapNumTermThis > 0 ? 1 : 0); i++) { // 有閏就13             
            let NoleapMon = i
            if (LeapNumTermThis > 0) {
                if (i === LeapNumTermThis + 1) {
                    NoleapMon = i - 1
                } else if (i >= LeapNumTermThis + 2) {
                    NoleapMon = i - 1
                }
            }
            MonName[i] = MonNumList[NoleapMon] + '月'
            if (LeapNumTermThis > 0 && i === LeapNumTermThis + 1) { // 好像有LeapNumTermThis<0的情況
                MonName[i] = '閏' + MonNumList[LeapNumTermThis] + '月'
            }
            MonName[i] += NewmOrderRaw[i] - NewmOrderRaw[i - 1] === 29 ? '小' : '大'
            const MonColorFunc = MonColorConvert(YuanYear, NoleapMon, ZhengMonScOrder)
            MonInfo[i] = MonColorFunc.MonInfo
            MonColor[i] = MonColorFunc.MonColor
            Sc[i] = []
            Jd[i] = []
            Nayin[i] = []
            Week[i] = []
            Sunrise[i] = []
            Dial[i] = []
            Lati[i] = []
            SunEquaLongiAccum[i] = []
            SunEclpLongiAccum[i] = []
            MoonEclpLongiAccum[i] = []
            MoonEclpPrint[i] = []
            MoonEclpLati[i] = []
            // MoName[i] = []
            HouName[i] = []
            HexagramName[i] = []
            ManGod[i] = []
            Luck[i] = []
            for (let k = 1; k <= NewmOrderRaw[i] - NewmOrderRaw[i - 1]; k++) { // 每月日數                
                const WinsolsDifRaw = FirstWinsolsDif + DayAccum // 每日夜半距冬至日數
                const WinsolsDif = WinsolsDifRaw % Solar
                const WinsolsDifInt = FirstOrderRaw - Math.floor(OriginAccum) + DayAccum // 冬至當日爲0
                const WinsolsDifNoon = WinsolsDifRaw + 0.5 // 每日正午
                DayAccum++
                //////////天文曆///////////
                let SunEquaLongi = 0
                let SunEclpLongi = 0
                let SunEquaLongiNoon = 0
                let SunEclpLongiNoon = 0
                if (Type === 1) {
                    if (Type < 11) {
                        SunEquaLongi = WinsolsDifRaw % Sidereal // 從正月開始
                        SunEquaLongiAccum[i][k] = SunEquaLongi + OriginAccum
                        SunEclpLongi = AutoEqua2Eclp(SunEquaLongi, CalName).EclpLongi
                        SunEclpLongiAccum[i][k] = SunEclpLongi + OriginAccum
                    } else {
                        SunEclpLongi = WinsolsDifRaw % Sidereal
                        SunEclpLongiAccum[i][k] = SunEclpLongi + OriginAccum
                        SunEquaLongi = AutoEqua2Eclp(SunEclpLongi, CalName).EquaLongi
                        SunEquaLongiAccum[i][k] = SunEquaLongi + OriginAccum
                    }
                    MoonEclpLongiAccum[i][k] = (WinsolsDifRaw * MoonAvgVDeg) % Sidereal + OriginAccum
                } else {
                    let NodeAccum = (NewmNodeAccumPrint[i - 1] + k - 1) % Node
                    const AnomaAccum = (NewmAnomaAccumPrint[i - 1] + k - 1) % Anoma
                    const TcorrFunc = AutoTcorr(AnomaAccum, WinsolsDifRaw, CalName, NodeAccum)
                    const DifAccumFunc = AutoDifAccum(AnomaAccum, WinsolsDifRaw, CalName)
                    const NodeAccumCorr = TcorrFunc.NodeAccumCorr
                    NodeAccum += NodeAccumCorr
                    const SunDifAccum = DifAccumFunc.SunDifAccum
                    const SunDifAccumNoon = AutoDifAccum(AnomaAccum, WinsolsDifNoon, CalName).SunDifAccum
                    const MoonDifAccum = DifAccumFunc.MoonDifAccum
                    if (Type < 11) {
                        SunEquaLongi = (WinsolsDifRaw + SunDifAccum) % Sidereal
                        SunEquaLongiAccum[i][k] = SunEquaLongi + OriginAccum
                        SunEclpLongi = AutoEqua2Eclp(SunEquaLongi, CalName).EclpLongi
                        SunEclpLongiAccum[i][k] = SunEclpLongi + OriginAccum
                        SunEquaLongiNoon = (WinsolsDifRaw + SunDifAccumNoon) % Sidereal
                    } else {
                        SunEclpLongi = (WinsolsDifRaw + SunDifAccum) % Sidereal
                        SunEclpLongiAccum[i][k] = SunEclpLongi + OriginAccum
                        SunEquaLongi = AutoEqua2Eclp(SunEclpLongi, CalName).EquaLongi
                        SunEquaLongiAccum[i][k] = SunEquaLongi + OriginAccum
                        SunEclpLongiNoon = (WinsolsDifRaw + SunDifAccumNoon) % Sidereal
                    }
                    if (Type <= 6) {
                        if ((NodeAccum > HalfNode - HalfSynodicNodeDif && NodeAccum < HalfNode) || NodeAccum < HalfSynodicNodeDif || (NodeAccum > HalfNode && NodeAccum < HalfNode + HalfSynodicNodeDif) || (NodeAccum > Node - HalfSynodicNodeDif)) {
                            MoonEclpLati[i][k] = `<span class='lati-yellow'>黃</span>`
                        } else if (NodeAccum < HalfNode) {
                            MoonEclpLati[i][k] = `<span class='lati-yang'>陽</span>`
                        } else {
                            MoonEclpLati[i][k] = `<span class='lati-yin'>陰</span>`
                        }
                    } else if (Type >= 7 && Type <= 10) { // 月行九道
                        if (WinsolsDif < 3 * HalfTermLeng || WinsolsDif >= 21 * HalfTermLeng) { // 冬
                            if (NodeAccum < HalfNode) {
                                MoonEclpLati[i][k] = `<span class='lati-white'>白</span><span class='lati-yang'>陽</span>`
                            } else {
                                MoonEclpLati[i][k] = `<span class='lati-green'>靑</span><span class='lati-yin'>陰</span>`
                            }
                        } else if (WinsolsDif >= 3 * HalfTermLeng && WinsolsDif < 9 * HalfTermLeng) {
                            if (NodeAccum < HalfNode) {
                                MoonEclpLati[i][k] = `<span class='lati-red'>朱</span><span class='lati-yang'>陽</span>`
                            } else {
                                MoonEclpLati[i][k] = `<span class='lati-black'>黑</span><span class='lati-yin'>陰</span>`
                            }
                        } else if (WinsolsDif >= 9 * HalfTermLeng && WinsolsDif < 15 * HalfTermLeng) {
                            if (NodeAccum < HalfNode) {
                                MoonEclpLati[i][k] = `<span class='lati-green'>靑</span><span class='lati-yang'>陽</span>`
                            } else {
                                MoonEclpLati[i][k] = `<span class='lati-white'>白</span><span class='lati-yin'>陰</span>`
                            }
                        } else {
                            if (NodeAccum < HalfNode) {
                                MoonEclpLati[i][k] = `<span class='lati-black'>黑</span><span class='lati-yang'>陽</span>`
                            } else {
                                MoonEclpLati[i][k] = `<span class='lati-red'>朱</span><span class='lati-yin'>陰</span>`
                            }
                        }
                        if ((NodeAccum > HalfNode - HalfSynodicNodeDif && NodeAccum < HalfNode) || NodeAccum < HalfSynodicNodeDif) {
                            MoonEclpLati[i][k] = `<span class='lati-yellow'>黃</span><span class='lati-yang'>陽</span>`
                        } else if ((NodeAccum > HalfNode && NodeAccum < HalfNode + HalfSynodicNodeDif) || (NodeAccum > Node - HalfSynodicNodeDif)) {
                            MoonEclpLati[i][k] = `<span class='lati-yellow'>黃</span><span class='lati-yin'>陰</span>`
                        }
                    }
                    MoonEclpLongiAccum[i][k] = (WinsolsDifRaw * MoonAvgVDeg + MoonDifAccum) % Sidereal + OriginAccum
                    const MoonLongiLatiFunc = AutoMoonLongiLati(Type === 11 ? SunEclpLongi : SunEquaLongi, NodeAccum, CalName)
                    MoonEclpLati[i][k] += MoonLongiLatiFunc.MoonEclpLati.toFixed(3) + '度'
                }
                const Longi2LatiFunc = AutoLongi2Lati(Type === 11 ? SunEclpLongiNoon : SunEquaLongiNoon, WinsolsDecimal, CalName)
                Lati[i][k] = Longi2LatiFunc.Lati.toFixed(3) + '度'
                Sunrise[i][k] = Longi2LatiFunc.Sunrise.toFixed(3) + '刻'
                Dial[i][k] = Longi2LatiFunc.Dial ? Longi2LatiFunc.Dial.toFixed(3) + '尺' : 0
                ///////////具注曆////////////
                const ScOrder = (FirstOrderRaw % 60 + 60 + DayAccum) % 60
                Sc[i][k] = ScList[ScOrder]
                Jd[i][k] = parseInt(OriginJdAccum + OriginJdDif + WinsolsDifInt + 1)
                Jd[i][k] += ' ' + Jd2Date1(Jd[i][k]).Mmdd
                const Stem = StemList.indexOf(Sc[i][k][0])
                const Branch = BranchList.indexOf(Sc[i][k][1])
                const JieNum = Math.round((Math.ceil(~~(WinsolsDifRaw / HalfTermLeng) / 2) + 11) % 12.1)
                // 順序不一樣！立春1，驚蟄2，清明3，立夏4，芒種5，小暑6，立秋7，白露8，寒露9，立冬10，大雪11，小寒12
                const JieDifInt = ~~((WinsolsDifRaw - (JieNum * 2 + 1) * HalfTermLeng + WinsolsDecimal + Solar) % Solar)
                if (Type >= 6) {
                    const WeekOrder = Math.round(((NewmOrderRaw[i - 1] + k - 1) % 7 + 5 + (WeekCorr || 0)) % 7.1)
                    const MansionOrder = Math.round((((NewmOrderRaw[i - 1] + k - 1) % 28 + 23 + (MansionCorr || 0)) + 28) % 28.1)
                    Week[i][k] = WeekList[WeekOrder] + NumList[WeekOrder] + MansionNameList[MansionOrder] + MansionAnimalNameList[MansionOrder]
                }
                for (let j = HouOrder; j < 90; j++) { // 氣候 
                    if (HouAccum[j] >= WinsolsDifRaw && HouAccum[j] < WinsolsDifRaw + 1) {
                        HouOrder = j % 72
                        const TermOrder = HouOrder % 3 ? -1 : (Math.round(HouOrder / 3)) % 24
                        HouName[i][k] = TermOrder >= 0 ? `<span class='term'>${HalfTermList[TermOrder]}</span>` : ''
                        if (Type >= 3) {
                            HouName[i][k] += HouList[HouOrder] + ((HouAccum[j] + OriginAccum - Math.floor(HouAccum[j] + OriginAccum)).toFixed(4)).slice(2, 6)
                        } else if (TermOrder >= 0) {
                            HouName[i][k] += ((HouAccum[j] + OriginAccum - Math.floor(HouAccum[j] + OriginAccum)).toFixed(4)).slice(2, 6)
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
                    const XiaohanDifInt = FirstOrderRaw - Math.floor(OriginAccum) - HalfTermLeng + DayAccum
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
                    if (MieWinsolsDif[j] >= WinsolsDifRaw && MieWinsolsDif[j] < WinsolsDifRaw + 1) {
                        HouName[i][k] += `<span class='momie'>滅</span>` + (MieWinsolsDif[j] + OriginAccum - Math.floor(MieWinsolsDif[j] + OriginAccum)).toFixed(4).slice(2, 6)
                        break
                    } else if (MoWinsolsDif[j] >= WinsolsDifRaw && MoWinsolsDif[j] < WinsolsDifRaw + 1) {
                        HouName[i][k] += `<span class='momie'>沒</span>` + (MoWinsolsDif[j] + OriginAccum - Math.floor(MoWinsolsDif[j] + OriginAccum)).toFixed(4).slice(2, 6)
                        break
                    }
                }
                let FiveName = ''
                for (let l = 0; l < 10; l++) { // 8個五行
                    if (FiveAccumList[l] >= WinsolsDifRaw && FiveAccumList[l] < WinsolsDifRaw + 1) {
                        FiveOrder = l % 8
                        FiveName = FiveList2[FiveOrder] + '王用事'
                        const FiveDecimal = (FiveAccumList[l] - WinsolsDifRaw).toFixed(4).slice(2, 6)
                        if (l % 2 === 0) {
                            FiveName += FiveDecimal
                        }
                        break
                    }
                }
                for (let m = HexagramOrder; m < 80; m++) { // 64卦
                    if (HexagramAccumList[m] >= WinsolsDifRaw && HexagramAccumList[m] < WinsolsDifRaw + 1) {
                        HexagramOrder = m % 64
                        HexagramName[i][k] = HexagramList2[HexagramOrder]
                        const HexagramDecimal = (HexagramAccumList[m] - WinsolsDifRaw).toFixed(4).slice(2, 6)
                        if ((HexagramOrder + 1) % 16) {
                            HexagramName[i][k] += HexagramDecimal
                        }
                        break
                    } else {
                        HexagramName[i][k] = ''
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
                HexagramName[i][k] += FiveName
                Sc[i][k] = NumList[k] + '日' + Sc[i][k]
            }
        }
        ////////////下調用宿度模塊////////////////
        let EquartorFunc = []
        let EclpFunc = []
        let MoonEclpFunc = []
        const EquartorPrint = []
        const MidstarPrint = []
        let EclpPrint = []
        if (MansionRaw) {
            for (let i = 1; i < Month.length; i++) {
                EquartorFunc = Deg2Mansion(SunEquaLongiAccum[i], Solar, Sidereal, EquaDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
                EquartorPrint[i] = EquartorFunc.map(item => item.MansionResult)
                // MidstarPrint[i] = EquartorFunc.map(item => item.MidstarResult)                
                MoonEclpFunc = Deg2Mansion(MoonEclpLongiAccum[i], Solar, Sidereal, EclpDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
                MoonEclpPrint[i] = MoonEclpFunc.map(item => item.MansionResult)
            }
            for (let i = 1; i < SunEclpLongiAccum.length; i++) {
                EclpFunc = Deg2Mansion(SunEclpLongiAccum[i], Solar || SolarRaw, Sidereal || Solar, EclpDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
                EclpPrint[i] = EclpFunc.map(item => item.MansionResult)
            }
        }
        DayAccum = '凡' + nzh.encodeS(DayAccum) + '日　' + Yuan
        return {
            Era,
            DayAccum,
            YearGod,
            YearColor,
            MonName,
            MonInfo,
            MonColor,
            Sc,
            Jd,
            Nayin,
            Week,
            EquartorPrint,
            EclpPrint,
            Lati,
            Sunrise,
            // MidstarPrint,
            Dial,
            MoonEclpPrint,
            MoonEclpLati,
            HouName,
            HexagramName,
            ManGod,
            Luck
        }
    }
    const result = []
    for (let year = YearStart; year <= YearEnd; year++) {
        result.push(Day(CalName, year))
    }
    return result
}
// console.log(CalDay('Dayan', 1256, 1256))