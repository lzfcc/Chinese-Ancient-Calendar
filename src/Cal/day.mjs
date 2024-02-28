import Para from './para_calendars.mjs'
import {
    NameList, ScList, StemList, BranchList, StemList1, BranchList1, NayinList,
    WeekList, MansionNameList, MansionAnimalNameList,
    ManGodList, JianchuList, HuangheiList, YuanList,
    HalfTermList, HouListA, HouListB, Hexagram64ListA, Hexagram64ListB, HexagramSymbolListA, HexagramSymbolListB, FiveList2,
    nzh, AutoDegAccumList, NumList, MonNumList1, deci
} from './para_constant.mjs'
import {
    YearGodConvert, YearColorConvert, MonColorConvert, WangwangConvert, FubaoConvert, LsStarConvert, BloodConvert, TouringGodConvert
} from './day_luck.mjs'
import CalNewm from './newm_index.mjs'
import {
    AutoEqua2Eclp, AutoLon2Lat, AutoMoonLon, AutoMoonLat
} from './astronomy_bind.mjs'
import { AutoTcorr, AutoDifAccum, AutoMoonAcrS } from './astronomy_acrv.mjs'
import { Accum2Mansion, AutoNineOrbit } from './astronomy_other.mjs'
import { Jd2Date1 } from './time_jd2date.mjs'
import { AutoMoonAvgV } from './para_auto-constant.mjs'

export const D1 = (Name, YearStart, YearEnd) => {
    YearEnd = YearEnd || YearStart
    const Main = (Name, year) => {
        const { Type, LunarRaw, Node, Anoma, SolarRaw, WeekConst, MansionDayConst, ScConst } = Para[Name]
        let { Solar, Sidereal, Lunar } = Para[Name]
        const { LeapNumTerm, SolsAccum, NewmInt, NewmRaw, NewmAcrRaw, NewmNodeAccumNightPrint, NewmAnomaAccumPrint, NewmAnomaAccumNightPrint } = CalNewm(Name, year)[0]
        Solar = Solar || SolarRaw
        Sidereal = Sidereal || Solar
        Lunar = Lunar || LunarRaw
        const HouLeng = Solar / 72
        const HalfTermLeng = Solar / 24
        const HexagramLeng = Solar / 60
        const MoonAvgVd = Type < 4 ? AutoMoonAvgV(Name) : undefined
        const ZhengInt = NewmInt[0] + (ScConst || 0)
        const ZhengSolsDif = +(ZhengInt - SolsAccum).toFixed(5) // 正月夜半到冬至距離
        const SolsDeci = deci(SolsAccum)
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
        if (['Qianxiang', 'Jingchu'].includes(Name)) { // 乾象景初用京房，後來都用孟喜
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
        const { EquaAccumList, EclpAccumList } = AutoDegAccumList(Name, year)
        ////// 沒滅
        const MoSolsDif = [], MieSolsDif = []
        const MoLeng = Solar / (Solar - 360)
        const FirstMo = Math.ceil(SolsAccum / MoLeng) * MoLeng // floor在冬至之前，ceil在之後
        for (let i = 0; i <= 6; i++) {
            MoSolsDif[i] = parseFloat((FirstMo + i * MoLeng).toPrecision(14)) // 距冬至日數
            if (Type <= 6 && MoSolsDif[i] === ~~MoSolsDif[i]) {
                MieSolsDif[i] = MoSolsDif[i]
            }
            MoSolsDif[i] = parseFloat((MoSolsDif[i] - SolsAccum).toPrecision(14))
            if (MieSolsDif[i]) {
                MieSolsDif[i] = parseFloat((MieSolsDif[i] - SolsAccum).toPrecision(14))
            }
        }
        if (Type >= 7) { // 大衍改革滅
            const MieLeng = Lunar / (30 - Lunar)
            const FirstMie = Math.ceil(SolsAccum / MieLeng) * MieLeng
            for (let i = 0; i <= 7; i++) {
                MieSolsDif[i] = parseFloat((FirstMie + i * MieLeng - SolsAccum).toPrecision(14))
            }
        }
        ////////
        let Era = ''
        if (year > 0) {
            Era = year + '年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
        } else {
            Era = '前' + (1 - year) + '年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
        }
        const Title = NameList[Name] + '萬年天文具注曆日'
        const YuanYear = ((year - 604) % 180 + 180) % 180 // 術數的元，以604甲子爲上元，60年一元，凡三元
        const YuanOrder = ~~(YuanYear / 60)
        const ThreeYuanYear = YuanYear - YuanOrder * 60
        const Yuan = YuanList[YuanOrder] + '元' + nzh.encodeS(ThreeYuanYear + 1) + '年'
        const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear)
        const YearColor = YearColorConvert(YuanYear)
        const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建        
        const OriginJdAccum = 2086292 + ~~(365.2423 * (year - 1000)) // 設公元1000年前冬至12月16日2086292乙酉(22)爲曆元，作爲儒略日標準
        const OriginJdDif = (SolsAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)
        const MonName = [], MonInfo = [], MonColor = [], Sc = [], Jd = [], Nayin = [], Week = [], Equa = [], Eclp = [], Duskstar = [], MoonEclp = [], MoonEclpLat = [], Rise = [], Dial = [], Lat = [], HouName = [], HexagramName = [], FiveName = [], ManGod = [], Luck = []
        let DayAccum = 0, JieAccum = 0, SummsolsDayAccum = 0, AutumnDayAccum = 0 // 各節積日 // 夏至積日// 立秋積日
        let JianchuDayAccum = ZhengInt - Math.floor(SolsAccum) // 建除
        let HuangheiDayAccum = JianchuDayAccum
        let JianchuOrigin = 0, HuangheiOrigin = 0, Fu1DayAccum = 0, Fu2DayAccum = 0, Fu3DayAccum = 0, HouOrder = 0, FiveOrder = 0, HexagramOrder = 0
        for (let i = 1; i <= 12 + (LeapNumTerm > 0 ? 1 : 0); i++) { // 有閏就13             
            let NoleapMon = i
            if (LeapNumTerm > 0) {
                if (i === LeapNumTerm + 1) {
                    NoleapMon = i - 1
                } else if (i >= LeapNumTerm + 2) {
                    NoleapMon = i - 1
                }
            }
            MonName[i] = MonNumList1[NoleapMon] + '月'
            if (LeapNumTerm > 0 && i === LeapNumTerm + 1) { // 好像有LeapNumTerm<0的情況
                MonName[i] = '閏' + MonNumList1[LeapNumTerm] + '月'
            }
            MonName[i] += NewmInt[i] - NewmInt[i - 1] === 29 ? '小' : '大'
            const MonColorFunc = MonColorConvert(YuanYear, NoleapMon, ZhengMonScOrder)
            MonInfo[i] = MonColorFunc.MonInfo
            MonColor[i] = MonColorFunc.MonColor
            let MoonEclpLonNewmNight = 0, SunEclpLonNewm = 0, AnomaCycle = 0, MoonAcrSNewm = 0, SolsDifNewm = 0
            if (Type < 4) {
                SolsDifNewm = NewmRaw[i - 1] - SolsAccum // 合朔加時 
            } else {
                SolsDifNewm = NewmAcrRaw[i - 1] - SolsAccum
            }
            if (Type > 1) {
                const AnomaAccumNewm = NewmAnomaAccumPrint[i - 1] // 加時入轉。這個求月行遲疾修正的步驟是我假設的
                const SunDifAccumNewm = AutoDifAccum(AnomaAccumNewm, SolsDifNewm, Name).SunDifAccum
                if (Type < 11) {
                    const SunEquaLonNewm = SolsDifNewm + SunDifAccumNewm
                    SunEclpLonNewm = AutoEqua2Eclp(SunEquaLonNewm, Name).Equa2Eclp
                } else { // 授時直接以黃道為準                
                    SunEclpLonNewm = SolsDifNewm + SunDifAccumNewm
                }
                if (Type < 4) {
                    MoonEclpLonNewmNight = SunEclpLonNewm - deci(NewmRaw[i - 1]) * MoonAvgVd
                } else {
                    const MoonAcrSFunc = AutoMoonAcrS(AnomaAccumNewm, Name)
                    AnomaCycle = MoonAcrSFunc.AnomaCycle
                    MoonAcrSNewm = MoonAcrSFunc.MoonAcrS
                    // const MoonAcrSNewmNight = AutoMoonAcrS(NewmAnomaAccumNightPrint[i - 1], Name).MoonAcrS // newm文件中已經加上了進朔，不知道對不對
                    // const MoonEclpLonNewmNight = SunEclpLonNewm - (MoonAcrSNewm - MoonAcrSNewmNight)
                }
            }
            Sc[i] = []
            Jd[i] = []
            Nayin[i] = []
            Week[i] = []
            Rise[i] = []
            Dial[i] = []
            Lat[i] = []
            Equa[i] = []
            Eclp[i] = []
            Duskstar[i] = []
            MoonEclp[i] = []
            MoonEclpLat[i] = []
            HouName[i] = []
            HexagramName[i] = []
            FiveName[i] = []
            ManGod[i] = []
            Luck[i] = []
            for (let k = 1; k <= NewmInt[i] - NewmInt[i - 1]; k++) { // 每月日數                
                const SolsDifNight = ZhengSolsDif + DayAccum // 每日夜半距冬至日數
                const SolsDifInt = ZhengInt - Math.floor(SolsAccum) + DayAccum // 冬至當日爲0
                const SolsDifNoon = SolsDifNight + .5 // 每日正午                
                DayAccum++ // 這個位置不能變
                //////////天文曆///////////
                let SunEquaLon = 0, SunEquaLonAccum = 0, SunEclpLon = 0, SunEclpLonAccum = 0, SunEquaLonNoon = 0, SunEclpLonNoon = 0, MoonEclpLon = 0, MoonEclpLonAccum = 0, AnomaAccumNight = 0, NodeAccumNight = 0, MoonLonLatFunc = {}
                if (Type === 1) {
                    SunEquaLonAccum = SolsDifNight + SolsAccum
                    SunEclpLon = AutoEqua2Eclp(SolsDifNight, Name).Equa2Eclp
                    SunEclpLonAccum = SunEclpLon + SolsAccum
                    MoonEclpLonAccum = SunEquaLonAccum * MoonAvgVd
                } else {
                    NodeAccumNight = (NewmNodeAccumNightPrint[i - 1] + k - 1) % Node
                    AnomaAccumNight = (NewmAnomaAccumNightPrint[i - 1] + k - 1) % Anoma
                    const AnomaAccumNoon = (AnomaAccumNight + .5) % Anoma // 正午入轉                    
                    NodeAccumNight = (NodeAccumNight + AutoTcorr(AnomaAccumNight, SolsDifNight, Name, NodeAccumNight).NodeAccumCorrA) % Node
                    const SunDifAccumNight = AutoDifAccum(AnomaAccumNight, SolsDifNight, Name).SunDifAccum
                    const SunDifAccumNoon = AutoDifAccum(AnomaAccumNoon, SolsDifNoon, Name).SunDifAccum
                    if (Type < 11) {
                        SunEquaLon = SolsDifNight + SunDifAccumNight
                        SunEquaLonAccum = SunEquaLon + SolsAccum
                        SunEquaLonNoon = SolsDifNoon + SunDifAccumNoon
                        SunEclpLon = AutoEqua2Eclp(SunEquaLon, Name).Equa2Eclp
                        SunEclpLonAccum = SunEclpLon + SolsAccum
                    } else { // 授時直接以黃道為準
                        SunEclpLon = SolsDifNight + SunDifAccumNight
                        SunEclpLonAccum = SunEclpLon + SolsAccum
                        SunEquaLon = AutoEqua2Eclp(SunEclpLon, Name).Eclp2Equa
                        SunEquaLonAccum = SunEquaLon + SolsAccum
                        SunEclpLonNoon = SolsDifNoon + SunDifAccumNoon
                    }
                    // 元嘉開始計算月度就有計入遲疾的方法，大業就完全是定朔，但又是平朔注曆，這樣會衝突，我只能把麟德以前全部求平行度。
                    // 《中》頁514 月度：欽天以後，先求正交至平朔月行度、平朔太陽黃度，由於平朔日月平黃經相同，所以相加減卽得正交月黃度
                    if (Type < 4) {
                        MoonEclpLon = MoonEclpLonNewmNight + (k - 1) * MoonAvgVd
                        MoonEclpLonAccum = MoonEclpLon + SolsAccum
                    } else {
                        const MoonAcrSNight = AutoMoonAcrS(AnomaAccumNight, Name).MoonAcrS
                        MoonEclpLon = SunEclpLonNewm + (MoonAcrSNight - MoonAcrSNewm + AnomaCycle) % AnomaCycle
                        MoonEclpLonAccum = MoonEclpLon + SolsAccum
                    }
                    if (Type < 11) {
                        MoonLonLatFunc = AutoMoonLat(NodeAccumNight, Name)
                        const tmp = MoonLonLatFunc.MoonEclpLat
                        MoonEclpLat[i][k] = AutoNineOrbit(NodeAccumNight, SolsDifNight, Name) +
                            (tmp > 0 ? 'N' : 'S') + Math.abs(tmp).toFixed(4)
                    }
                }
                const EquaFunc = Accum2Mansion(SunEquaLonAccum, EquaAccumList, Name, SunEquaLon, SolsDeci)
                Equa[i][k] = SunEquaLon.toFixed(4) + EquaFunc.Mansion
                Duskstar[i][k] = EquaFunc.MorningDuskstar
                Eclp[i][k] = SunEclpLon.toFixed(4) + Accum2Mansion(SunEclpLonAccum, EclpAccumList, Name).Mansion
                const Lon2LatFunc = AutoLon2Lat(Type === 11 ? SunEclpLonNoon : SunEquaLonNoon, SolsDeci, Name)
                Lat[i][k] = (Lon2LatFunc.Lat > 0 ? 'N' : 'S') + Math.abs(Lon2LatFunc.Lat).toFixed(4) + '度'
                Rise[i][k] = Lon2LatFunc.Rise.toFixed(3) + '刻'
                Dial[i][k] = Lon2LatFunc.Dial ? ' ' + Lon2LatFunc.Dial.toFixed(3) + '尺' : ''
                Rise[i][k] += Dial[i][k]
                // 每日夜半月黃經
                const MoonMansion = Accum2Mansion(MoonEclpLonAccum, EclpAccumList, Name).Mansion
                let MoonMansionNote = ''
                if ((Type >= 2 && Type <= 4) && (MoonMansion[0] === '心' || MoonMansion[0] === '張')) { // 乾象：月在張心署之
                    MoonMansionNote = `<span class='MoonMansionNote'>忌刑</span>`
                }
                let MoonEclpWhiteDif = ''
                if (Type > 5 && Type < 11) {
                    MoonEclpWhiteDif = `\n黃白差` + AutoMoonLon(NodeAccumNight, MoonEclpLon, Name).EclpWhiteDif.toFixed(4)
                }
                MoonEclp[i][k] = MoonMansion + MoonMansionNote + (MoonEclpWhiteDif || '')
                ///////////具注曆////////////
                const ScOrder = (ZhengInt % 60 + 60 + DayAccum) % 60
                Sc[i][k] = ScList[ScOrder]
                Jd[i][k] = parseInt(OriginJdAccum + OriginJdDif + SolsDifInt + 1)
                Jd[i][k] += ' ' + Jd2Date1(Jd[i][k]).Mmdd
                const Stem = StemList.indexOf(Sc[i][k][0])
                const Branch = BranchList.indexOf(Sc[i][k][1])
                const JieNum = Math.round((Math.ceil(~~(SolsDifNight / HalfTermLeng) / 2) + 11) % 12.1)
                // 順序不一樣！立春1，驚蟄2，清明3，立夏4，芒種5，小暑6，立秋7，白露8，寒露9，立冬10，大雪11，小寒12
                const JieDifInt = ~~((SolsDifNight - (JieNum * 2 + 1) * HalfTermLeng + SolsDeci + Solar) % Solar)
                if (Type >= 6) {
                    const WeekOrder = Math.round(((NewmInt[i - 1] + k - 1) % 7 + 5 + (WeekConst || 0)) % 7.1)
                    const MansionOrder = Math.round((((NewmInt[i - 1] + k - 1) % 28 + 23 + (MansionDayConst || 0)) + 28) % 28.1)
                    Week[i][k] = WeekList[WeekOrder] + MansionNameList[MansionOrder] + MansionAnimalNameList[MansionOrder]
                }
                for (let j = HouOrder; j < 90; j++) { // 氣候 
                    if (HouAccum[j] >= SolsDifNight && HouAccum[j] < SolsDifNight + 1) {
                        HouOrder = j % 72
                        const TermOrder = HouOrder % 3 ? -1 : (Math.round(HouOrder / 3)) % 24
                        HouName[i][k] = TermOrder >= 0 ? `<span class='term'>${HalfTermList[TermOrder]}</span>` : ''
                        if (Type >= 3) {
                            HouName[i][k] += HouList[HouOrder] + deci(HouAccum[j] + SolsAccum).toFixed(4).slice(2, 6)
                        } else if (TermOrder >= 0) {
                            HouName[i][k] += deci(HouAccum[j] + SolsAccum).toFixed(4).slice(2, 6)
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
                    const XiaohanDifInt = ZhengInt - Math.floor(SolsAccum) - HalfTermLeng + DayAccum
                    const tmp = ~~((SolsDifInt + 1 - XiaohanDifInt) / 12)
                    const tmp1 = SolsDifInt + 1 - tmp * 12 - Branch
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
                Nayin[i][k] = NayinList[Math.ceil(ScOrder / 2)] + Jianchu + Huanghei + ' ' + Week[i][k]
                HouName[i][k] += Fu
                for (let j = 0; j < 7; j++) {
                    if (MieSolsDif[j] >= SolsDifNight && MieSolsDif[j] < SolsDifNight + 1) {
                        HouName[i][k] += `<span class='momie'>滅</span>` + deci(MieSolsDif[j] + SolsAccum).toFixed(4).slice(2, 6)
                        break
                    } else if (MoSolsDif[j] >= SolsDifNight && MoSolsDif[j] < SolsDifNight + 1) {
                        HouName[i][k] += `<span class='momie'>沒</span>` + deci(MoSolsDif[j] + SolsAccum).toFixed(4).slice(2, 6)
                        break
                    }
                }
                for (let l = 0; l < 10; l++) { // 8個五行
                    if (SolsDifNight >= FiveAccumList[l] && SolsDifNight < FiveAccumList[l] + 1) {
                        FiveOrder = l % 8
                        const FiveDeci = (SolsDifNight - FiveAccumList[l]).toFixed(4).slice(2, 6)
                        FiveName[i][k] = `<span class='FiveNameSymbol'>` + FiveList2[FiveOrder] + `</span>` + FiveDeci
                        break
                    }
                }
                if (Type < 11) { // 授時不算64卦
                    for (let m = HexagramOrder; m < 80; m++) {
                        if (SolsDifNight >= HexagramAccumList[m] && SolsDifNight < HexagramAccumList[m] + 1) {
                            HexagramOrder = m % (Hexagram64List === Hexagram64ListA ? 64 : 60)
                            const HexagramDeci = (SolsDifNight - HexagramAccumList[m]).toFixed(4).slice(2, 6)
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
            Era, Title, DayAccum, YearGod, YearColor, MonName, MonInfo, MonColor,
            Sc, Jd, Nayin, Eclp, Equa, Lat, Rise, Duskstar, MoonEclp, MoonEclpLat,
            HouName, HexagramName, FiveName, ManGod, Luck
        }
    }
    const result = []
    for (let year = YearStart; year <= YearEnd; year++) {
        result.push(Main(Name, year))
    }
    return result
}
// console.log(D1('Datong', 1762, 1762))