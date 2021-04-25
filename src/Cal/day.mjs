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
    nzh
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
    AutoEquator2Ecliptic,
    AutoLongi2Lati,
    AutoMoonLongiLati
} from './bind_astronomy.mjs'
import Deg2Mansion from './astronomy_deg2mansion.mjs'
import {
    Jd2Date1
} from './time_jd2date.mjs'

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
            Sidereal,
            LunarRaw,
            SolarRaw,
            Ecli,
            MansionConst,
            MansionRaw,
            MansionFractPosition,
            NightList,
            WeekCorr,
            MansionCorr
        } = AutoPara[CalName]
        let {
            Solar,
            Lunar,
            Node,
            YinyangOrigin,
        } = AutoPara[CalName]
        const {
            Month,
            LeapNumTermThis,
            OriginAccum,
            NewmAcrOrderRaw
        } = CalNewm(CalName, year)[0]
        let {
            NewmOrderRaw,
            FirstNodeAccum,
        } = CalNewm(CalName, year)[0]
        const {
            EquatorDegList,
            EclipticDegList
        } = AutoMansion(CalName, year)
        if (Type >= 6) {
            NewmOrderRaw = NewmAcrOrderRaw
        }
        const HouLeng = (Solar ? Solar : SolarRaw) / 72
        const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
        if (!YinyangOrigin) {
            YinyangOrigin = 1
        }
        if (!Node) {
            Node = Lunar * Ecli / (0.5 + Ecli) // 獨創發明！
        }
        if (!Solar) {
            Solar = SolarRaw
        }
        if (!Lunar) {
            Lunar = LunarRaw
        }
        const SynodicNodeDif = Lunar - Node
        let HexagramAccumList = []
        let FiveAccumList = []
        if (Type < 6) {
            HexagramAccumList = HexagramAccumListA
            FiveAccumList = FiveAccumListA
        } else {
            HexagramAccumList = HexagramAccumListB
            FiveAccumList = FiveAccumListB
        }
        const OriginDecimal = OriginAccum - Math.floor(OriginAccum)
        /////////// 預處理72候列表//////////
        let HouAccum = []
        for (let j = 1; j <= 100; j++) {
            HouAccum[j] = HouLeng * (j - 1)
            HouAccum[j] = parseFloat((HouAccum[j]).toPrecision(14))
        }
        const YearScOrder = ((year - 3) % 60 + 60) % 60
        const YearSc = ScList[YearScOrder]
        const YearStem = StemList.indexOf(YearSc[0])
        const YearBranch = BranchList.indexOf(YearSc[1])
        // const Era = EraConvert(year) // is not a function 無法理解
        let Era = ''
        if (year > 0) {
            Era = year + ' 年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
        } else {
            Era = '前 ' + (1 - year) + ' 年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
        }
        let Yuan = 0
        let YuanYear = 0
        if (year >= 604) {
            YuanYear = (year - 604) % 180 // 術數的元，以604甲子爲上元，60年一元，凡三元
            const YuanOrder = Math.floor(YuanYear / 60)
            const ThreeYuanYear = YuanYear - YuanOrder * 60
            Yuan = YuanList[YuanOrder] + '元' + nzh.encodeS(ThreeYuanYear + 1) + '年'
        }
        const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear)
        const YearColor = YearColorConvert(YuanYear)
        const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建
        const HalfTermLeng = Solar / 24
        const OriginJdAccum = 2086292 + Math.floor(365.2423 * (year - 1000)) // 設公元1000年前冬至12月16日2086292乙酉(22)爲曆元，作為儒略日標準
        const OriginJdDif = (OriginAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)
        const MonName = []
        const MonInfo = []
        const MonColor = []
        const Sc = []
        const Jd = []
        const Nayin = []
        const Week = []
        const SunEquatorLongiAccum = []
        const SunEclipticLongiAccum = []
        const MoonEquatorLongiAccum = []
        const MoonEclipticLati = []
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
        let SummerDayAccum = 0 // 夏至積日
        let AutumnDayAccum = 0 // 立秋積日
        let JianchuDayAccum = NewmOrderRaw[1] - Math.floor(OriginAccum)
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
                    MonName[i] = '閏' + nzh.encodeS(LeapNumTermThis) + '月'
                } else if (i >= LeapNumTermThis + 2) {
                    NoleapMon = i - 1
                }
            }
            const MonColorFunc = MonColorConvert(YuanYear, NoleapMon, ZhengMonScOrder)
            MonName[i] = MonColorFunc.MonName
            MonInfo[i] = MonColorFunc.MonInfo
            MonColor[i] = MonColorFunc.MonColor

            Sc[i] = []
            Jd[i] = []
            Nayin[i] = []
            Week[i] = []
            Sunrise[i] = []
            Dial[i] = []
            Lati[i] = []
            SunEquatorLongiAccum[i] = []
            SunEclipticLongiAccum[i] = []
            MoonEquatorLongiAccum[i] = []
            MoonEclipticLati[i] = []
            // MoName[i] = []
            HouName[i] = []
            HexagramName[i] = []
            ManGod[i] = []
            Luck[i] = []
            for (let k = 1; k <= NewmOrderRaw[i + 1] - NewmOrderRaw[i]; k++) { // 每月日數
                DayAccum++
                const OriginDifRaw = parseFloat((NewmOrderRaw[1] - OriginAccum + DayAccum).toPrecision(13)) // - 1 // 每日夜半距冬至日數
                const OriginDifInt = NewmOrderRaw[1] - Math.floor(OriginAccum) + DayAccum // - 1 
                const ScOrder = (NewmOrderRaw[1] % 60 + 60 + DayAccum) % 60
                Sc[i][k] = ScList[ScOrder]
                Jd[i][k] = parseInt(OriginJdAccum + OriginJdDif + OriginDifInt)
                Jd[i][k] += ' ' + Jd2Date1(Jd[i][k]).Mmdd
                const Stem = StemList.indexOf(Sc[i][k][0])
                const Branch = BranchList.indexOf(Sc[i][k][1])
                const JieNum = Math.round((Math.ceil(Math.floor(OriginDifRaw / HalfTermLeng) / 2) + 11) % 12.1)
                // 順序不一樣！立春1，驚蟄2，清明3，立夏4，芒種5，小暑6，立秋7，白露8，寒露9，立冬10，大雪11，小寒12
                const JieDifInt = Math.floor((OriginDifRaw - (JieNum * 2 + 1) * HalfTermLeng + OriginDecimal + Solar) % Solar)

                if (Type >= 6) {
                    const WeekOrder = Math.round(((NewmOrderRaw[i] + k - 1) % 7 + 5 + (WeekCorr ? WeekCorr : 0)) % 7.1)
                    const MansionOrder = Math.round((((NewmOrderRaw[i] + k - 1) % 28 + 23 + (MansionCorr ? MansionCorr : 0)) + 28) % 28.1)
                    Week[i][k] = WeekList[WeekOrder] + nzh.encodeS(WeekOrder) + MansionNameList[MansionOrder] + MansionAnimalNameList[MansionOrder]
                }
                let SunEquatorLongi = 0
                let SunEclipticLongi = 0
                if (Type < 11) {
                    SunEquatorLongi = OriginDifRaw % (Sidereal ? Sidereal : Solar) // 從正月開始。不知道需不需要加上日躔
                    SunEquatorLongiAccum[i][k] = SunEquatorLongi + OriginAccum
                    SunEclipticLongi = AutoEquator2Ecliptic(SunEquatorLongi, CalName)
                    SunEclipticLongiAccum[i][k] = SunEclipticLongi + OriginAccum
                } else {
                    SunEclipticLongi = OriginDifRaw % Sidereal
                    SunEclipticLongiAccum[i][k] = SunEclipticLongi + OriginAccum
                    SunEquatorLongi = AutoEquator2Ecliptic(SunEclipticLongi, CalName)
                    SunEquatorLongiAccum[i][k] = SunEquatorLongi + OriginAccum
                }
                const Longi2Lati = AutoLongi2Lati(Type === 11 ? SunEclipticLongi : SunEquatorLongi, OriginDecimal, CalName)
                Lati[i][k] = Longi2Lati.Lati.toFixed(4) + '度'
                Sunrise[i][k] = Longi2Lati.Sunrise.toFixed(4) + '刻'
                Dial[i][k] = Longi2Lati.Dial ? Longi2Lati.Dial.toFixed(4) + '尺' : 0
                if (YinyangOrigin === -1) {
                    FirstNodeAccum += Node / 2
                }
                const NodeAccum = ((FirstNodeAccum + 2 * SynodicNodeDif + DayAccum - 1) % Node + Node) % Node // 夜半。不知道要不要-1 // + (NodeCorr ? NodeCorr : Tcorr)
                const MoonLongiLati = AutoMoonLongiLati(NodeAccum, Type === 11 ? SunEclipticLongi : SunEquatorLongi, CalName)
                if (Type <= 4) {
                    MoonEquatorLongiAccum[i][k] = NodeAccum * MoonAvgVDeg + OriginAccum
                } else {
                    MoonEquatorLongiAccum[i][k] = MoonLongiLati.MoonEquatorLongi ? MoonLongiLati.MoonEquatorLongi + OriginAccum : 0
                }
                MoonEclipticLati[i][k] = MoonLongiLati.MoonEclipticLati ? MoonLongiLati.MoonEclipticLati.toFixed(4) + '度' : 0
                for (let j = HouOrder; j <= 100; j++) { // 氣候 
                    if (HouAccum[j] >= OriginDifRaw - 1 && HouAccum[j] < OriginDifRaw) {
                        HouOrder = Math.round(j % 72.1)
                        let TermOrder = 0
                        if (HouOrder % 3 === 1) {
                            TermOrder = Math.round((HouOrder + 2) / 3)
                        }
                        HouName[i][k] = (TermOrder ? HalfTermList[TermOrder] : '') + HouList[HouOrder] + (HouAccum[j] + OriginAccum - Math.floor(HouAccum[j] + OriginAccum)).toFixed(4).slice(2, 6)
                        if (j % 6 === 4) {
                            JieAccum = DayAccum
                        }
                        if (j === 37) {
                            SummerDayAccum = DayAccum
                        } else if (j === 46) {
                            AutumnDayAccum = DayAccum
                        }
                        break // 兩個要點：break；由於建寅，要循環不止72個
                    } else {
                        HouName[i][k] = ''
                    }
                }
                if (DayAccum === 1) {
                    const XiaohanDifInt = NewmOrderRaw[1] - Math.floor(OriginAccum) - HalfTermLeng + DayAccum
                    const tmp = Math.floor((OriginDifInt - XiaohanDifInt) / 12)
                    const tmp1 = OriginDifInt - tmp * 12 - Branch
                    JianchuOrigin = tmp1 + 2 // 小寒後第一個丑開始建除
                    HuangheiOrigin = tmp1 + 12 // 小寒後第一個戌開始黃黑道
                }
                JianchuDayAccum++
                HuangheiDayAccum++
                if (DayAccum === JieAccum) {
                    JianchuDayAccum--
                    HuangheiDayAccum--
                }
                if (DayAccum === JieAccum + 1 && HouOrder !== 10) {
                    HuangheiDayAccum--
                }
                const Jianchu = JianchuList[((JianchuDayAccum - JianchuOrigin) % 12 + 12) % 12]
                const Huanghei = HuangheiList[((HuangheiDayAccum - HuangheiOrigin) % 12 + 12) % 12]
                if (SummerDayAccum && !Fu2DayAccum) {
                    Fu1DayAccum = SummerDayAccum + (17 - Stem) % 10 + 20
                    Fu2DayAccum = Fu1DayAccum + 10
                }
                if (AutumnDayAccum && !Fu3DayAccum) {
                    Fu3DayAccum = AutumnDayAccum + (17 - Stem) % 10
                }
                let Fu = ''
                if (DayAccum === Fu1DayAccum) {
                    Fu = '初伏'
                } else if (DayAccum === Fu2DayAccum) {
                    Fu = '中伏'
                } else if (DayAccum === Fu3DayAccum) {
                    Fu = '末伏'
                }
                Nayin[i][k] = NayinList[Math.ceil(ScOrder / 2)] + Jianchu + Huanghei
                HouName[i][k] += Fu

                let FiveName = ''
                for (let l = 1; l <= 10; l++) { // 8個五行
                    if (FiveAccumList[l] >= OriginDifRaw && FiveAccumList[l] < OriginDifRaw + 1) {
                        FiveOrder = Math.round((l + 1) % 8.1)
                        FiveName = FiveList2[FiveOrder] + '王用事'
                        const FiveDecimal = (FiveAccumList[l] - OriginDifRaw).toFixed(4).slice(2, 6)
                        if (l % 2 === 1) {
                            FiveName += FiveDecimal
                        }
                        break
                    }
                }
                for (let m = HexagramOrder; m <= 80; m++) { // 64卦
                    if (HexagramAccumList[m] >= OriginDifRaw && HexagramAccumList[m] < OriginDifRaw + 1) {
                        HexagramOrder = Math.round((m + 1) % 64.1)
                        HexagramName[i][k] = HexagramList2[HexagramOrder]
                        const HexagramDecimal = (HexagramAccumList[m] - OriginDifRaw).toFixed(4).slice(2, 6)
                        if (HexagramOrder % 16 !== 1) {
                            HexagramName[i][k] += +HexagramDecimal
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
                Luck[i][k] = (Wangwang ? Wangwang : '') + (Fubao ? Fubao : '') + (Lin ? Lin : '') + (LongShortStar ? LongShortStar : '')
                ManGod[i][k] = ManGodList[k] + (Blood ? Blood : '') + (TouringGod ? TouringGod : '')
                HexagramName[i][k] += FiveName
                Sc[i][k] = nzh.encodeS(k) + '日' + Sc[i][k]
            }
        }
        ////////////下調用宿度模塊////////////////
        let Equartor = []
        let Ecliptic = []
        let MoonEquartor = []
        let EquartorPrint = []
        let MidstarPrint = []
        let MoonEquartorPrint = []
        let EclipticPrint = []
        if (MansionRaw) {
            for (let i = 1; i < Month.length; i++) {
                Equartor = Deg2Mansion(SunEquatorLongiAccum[i], (Solar ? Solar : SolarRaw), (Sidereal ? Sidereal : Solar), EquatorDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
                EquartorPrint[i] = Equartor.map(item => item.MansionResult)
                // MidstarPrint[i] = Equartor.map(item => item.MidstarResult)
                if (MoonEquatorLongiAccum) {
                    MoonEquartor = Deg2Mansion(MoonEquatorLongiAccum[i], (Solar ? Solar : SolarRaw), (Sidereal ? Sidereal : Solar), EquatorDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
                    MoonEquartorPrint[i] = MoonEquartor.map(item => item.MansionResult)
                }
            }
            for (let i = 1; i < SunEclipticLongiAccum.length; i++) {
                Ecliptic = Deg2Mansion(SunEclipticLongiAccum[i], (Solar ? Solar : SolarRaw), (Sidereal ? Sidereal : Solar), EclipticDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
                EclipticPrint[i] = Ecliptic.map(item => item.MansionResult)
            }
        }
        DayAccum = '凡' + nzh.encodeS(DayAccum) + '日　' + (Yuan ? Yuan : '')
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
            EclipticPrint,
            Lati,
            Sunrise,
            // MidstarPrint,
            Dial,
            MoonEquartorPrint,
            MoonEclipticLati,
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