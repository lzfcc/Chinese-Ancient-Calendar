import Para from './para_calendars.mjs'
import {
    CalNameList, ScList, StemList, BranchList, StemList1, BranchList1, NayinList,
    WeekList, WeekList1, MansionNameList, MansionAnimalNameList,
    JianchuList, HuangheiList, YuanList,
    nzh, AutoDegAccumList, NumList, MonNumList1, deci
} from './para_constant.mjs'
import {
    YearGodConvert, YearColorConvert, MonColorConvert,
} from './day_luck.mjs'
import { sunGuimao, moonGuimao, LongiHigh2Low, HighLongi2LowLati, riseQing } from './newm_shixian.mjs'
import CalNewm from './newm_index.mjs'
import { Gong2Mansion } from './astronomy_other.mjs'
import { Jd2Date1 } from './time_jd2date.mjs'
import { ClockQing } from './time_decimal2clock.mjs'

const deg2Hms = deg => {
    const Deci = deci(deg)
    const m = ~~(60 * Deci)
    const s = ~~(3600 * Deci - 60 * m)
    return ~~deg + '°' + m + '′' + s + '″'
}
// console.log(deg2Hms(1.52))
export const D2 = (CalName, YearStart, YearEnd) => {
    YearEnd = YearEnd || YearStart
    const Day = (CalName, Y) => {
        const { Type, Lunar, Solar, Obliquity, WeekConst, MansionDayConst, ScConst, BeijingLati } = Para[CalName]
        const { LeapNumTerm, SolsAccum, SunRoot, SunperiRoot, MoonRoot, MoonapoRoot, NodeRoot, NewmSd, SolsmorScOrder, MansionDaySolsmor } = CalNewm(CalName, Y)[0]
        ///////
        const YearScOrder = ((Y - 3) % 60 + 60) % 60
        const YearSc = ScList[YearScOrder]
        const YearStem = StemList.indexOf(YearSc[0])
        const YearBranch = BranchList.indexOf(YearSc[1])
        //////
        const EquaDegAccumList = AutoDegAccumList(CalName, Y)
        const EclpDegAccumList = AutoDegAccumList(CalName, Y, 1)
        ////////
        let Title = ''
        if (Y > 0) {
            Title = Y + ' 年歲次' + YearSc
        } else {
            Title = '前 ' + (1 - Y) + ' 年歲次' + YearSc
        }
        Title += '日月經緯宿度時憲曆'
        const Era = '欽天監欽遵御製' + CalNameList[CalName] + '印造時憲曆頒行天下'
        const YuanYear = ((Y - 604) % 180 + 180) % 180 // 術數的元，以604甲子爲上元，60年一元，凡三元
        const YuanOrder = ~~(YuanYear / 60)
        const ThreeYuanYear = YuanYear - YuanOrder * 60
        const Yuan = YuanList[YuanOrder] + '元' + nzh.encodeS(ThreeYuanYear + 1) + '年'
        const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear)
        const YearColor = YearColorConvert(YuanYear)
        const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建        
        const OriginJdAccum = 2086292 + ~~(365.2423 * (Y - 1000)) // 設公元1000年前冬至12月16日2086292乙酉(22)爲曆元，作爲儒略日標準
        const OriginJdDif = (SolsAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)
        const MonName = [], MonInfo = [], MonColor = [], Sc = [], Jd = [], Nayin = [], Week = [], Equa = [], EquaMansion = [], Eclp = [], EclpMansion = [], MoonEclp = [], MoonEclpLati = [], MoonMansion = [], Rise = [], Lati = [], Duskstar = []
        let DayAccum = 0, JieAccum = 0 // 各節積日 
        let JianchuDayAccum = NewmSd[0] // 建除
        let JianchuOrigin = 0
        for (let i = 1; i <= 12 + (LeapNumTerm > 0 ? 1 : 0); i++) { // 有閏就13             
            let NoleapMon = i
            if (LeapNumTerm > 0) {
                if (i >= LeapNumTerm + 1) NoleapMon = i - 1
            }
            MonName[i] = MonNumList1[NoleapMon] + '月'
            if (LeapNumTerm > 0 && i === LeapNumTerm + 1) MonName[i] = '閏' + MonNumList1[LeapNumTerm] + '月'
            MonName[i] += ~~NewmSd[i] - ~~NewmSd[i - 1] === 29 ? '小' : '大'
            const MonColorFunc = MonColorConvert(YuanYear, NoleapMon, ZhengMonScOrder)
            MonInfo[i] = MonColorFunc.MonInfo
            MonColor[i] = MonColorFunc.MonColor
            Sc[i] = []
            Jd[i] = []
            Nayin[i] = []
            Week[i] = []
            Rise[i] = []
            Lati[i] = []
            Duskstar[i] = []
            Equa[i] = []
            EquaMansion[i] = []
            Eclp[i] = []
            EclpMansion[i] = []
            MoonEclp[i] = []
            MoonEclpLati[i] = []
            MoonMansion[i] = []
            for (let k = 1; k <= ~~NewmSd[i] - ~~NewmSd[i - 1]; k++) { // 每月日數                
                const SdMidn = ~~(NewmSd[i - 1] + k - 1) // 每日夜半距冬至日數
                DayAccum++ // 這個位置不能變
                //////////天文曆///////////
                const { SunOrbdeg, SunCorr, SunLongi, SunGong, Sunperi } = sunGuimao(SunRoot, SunperiRoot, SdMidn)
                const { SunLongi: SunLongiMidnMorrow } = sunGuimao(SunRoot, SunperiRoot, SdMidn + 1)
                const { MoonGong, MoonLongi, MoonLati } = moonGuimao(MoonRoot, NodeRoot, MoonapoRoot, SdMidn, Sunperi, SunOrbdeg, SunCorr, SunGong)
                Equa[i][k] = deg2Hms(LongiHigh2Low(Obliquity, SunLongi))
                Eclp[i][k] = deg2Hms(SunLongi)
                EclpMansion[i][k] = Gong2Mansion(CalName, Y, SunGong).Mansion + '度' // 注意：入宿度是轉換成了古度的
                const tmp1 = HighLongi2LowLati(Obliquity, SunLongi)
                Lati[i][k] = (tmp1 > 0 ? 'N ' : 'S ') + deg2Hms(Math.abs(tmp1))
                Rise[i][k] = riseQing(SunLongi + (SunLongiMidnMorrow - SunLongi) / 2, Obliquity, BeijingLati)
                Duskstar[i][k] = Gong2Mansion(CalName, Y, 0, SunLongi, SunLongiMidnMorrow, Rise[i][k]).DuskstarPrint
                Rise[i][k] = ClockQing(Rise[i][k] * 100)
                MoonEclp[i][k] = deg2Hms(MoonLongi)
                MoonMansion[i][k] = Gong2Mansion(CalName, Y, MoonGong).Mansion + '度'
                MoonEclpLati[i][k] = (MoonLati > 0 ? 'N ' : 'S ') + deg2Hms(Math.abs(MoonLati))
                ///////////具注曆////////////
                const ScOrder = ~~(SolsmorScOrder + SdMidn) % 60
                Sc[i][k] = ScList[ScOrder]
                Jd[i][k] = parseInt(OriginJdAccum + OriginJdDif + SdMidn + 2)
                Jd[i][k] += ' ' + Jd2Date1(Jd[i][k]).Mmdd
                const Stem = StemList.indexOf(Sc[i][k][0])
                const Branch = BranchList.indexOf(Sc[i][k][1])
                const MansionOrder = (MansionDaySolsmor + DayAccum) % 28
                const WeekOrder = (MansionDaySolsmor + DayAccum + 3) % 7
                Week[i][k] = WeekList[WeekOrder] + WeekList1[WeekOrder] + MansionNameList[MansionOrder] + MansionAnimalNameList[MansionOrder]
                // const JieNum = Math.round((Math.ceil(~~(SdMidn / HalfTermLeng) / 2) + 11) % 12.1)
                // 立春1，驚蟄2，清明3，立夏4，芒種5，小暑6，立秋7，白露8，寒露9，立冬10，大雪11，小寒12
                // if (DayAccum === 1) {
                //     const XiaohanDifInt = ZhengInt - Math.floor(SolsAccum) - HalfTermLeng + DayAccum
                //     const tmp = ~~((SolsDifInt + 1 - XiaohanDifInt) / 12)
                //     const tmp1 = SolsDifInt + 1 - tmp * 12 - Branch
                //     JianchuOrigin = tmp1 + 2 // 小寒後第一個丑開始建除
                // }
                // JianchuDayAccum++
                // if (DayAccum === JieAccum) {
                //     JianchuDayAccum--
                // }
                // const Jianchu = JianchuList[((JianchuDayAccum - JianchuOrigin) % 12 + 12) % 12]
                // Nayin[i][k] = NayinList[Math.ceil(ScOrder / 2)] + ' ' + Jianchu
                Sc[i][k] = NumList[k] + '日' + Sc[i][k]
            }
        }
        DayAccum = '僞造者依律處斬有能吿捕者官給賞銀五十兩如無本監時憲曆印信即同私造' + `\n凡` + nzh.encodeS(DayAccum) + '日　' + Yuan
        return {
            Era, Title, DayAccum, YearGod, YearColor, MonName, MonInfo, MonColor,
            Sc, Jd, Nayin, Week,
            Equa, EquaMansion, Eclp, EclpMansion, Lati, Rise, Duskstar,
            MoonEclp, MoonMansion, MoonEclpLati
        }
    }
    const result = []
    for (let Y = YearStart; Y <= YearEnd; Y++) {
        result.push(Day(CalName, Y))
    }
    return result
}
// console.log(D2('Guimao', 1730, 1730))