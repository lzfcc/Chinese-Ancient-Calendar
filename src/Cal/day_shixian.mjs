import Para from './para_calendars.mjs'
import {
    NameList, ScList, StemList, BranchList, StemList1, BranchList1, NayinList,
    WeekList, WeekList1, MansionNameList, MansionAnimalNameList,
    JianchuList, HuangheiList, YuanList,
    nzh, NumList, MonNumList1
} from './para_constant.mjs'
import {
    YearGodConvert, YearColorConvert, MonColorConvert,
} from './day_luck.mjs'
import { sunQing, moonQing, LonHigh2Flat, HighLon2FlatLat, sunRiseQing, twilight, deg2Hms, Lat2NS, GongHigh2Flat, starEclp2Equa, Lon2Gong, moonRiseQing } from './newm_shixian.mjs'
import CalNewm from './newm_index.mjs'
import { eclpGong2Mansion, equaGong2Mansion, Lon2Midstar } from './astronomy_other.mjs'
import { Jd2Date1 } from './time_jd2date.mjs'
import { ClockWest } from './time_decimal2clock.mjs'

export const D2 = (Name, YearStart, YearEnd) => {
    YearEnd = YearEnd || YearStart
    const Main = (Name, Y) => {
        const { Sobliq, BjLat } = Para[Name]
        const { LeapNumTerm, SolsAccum, SunRoot, SperiRoot, MoonRoot, MapoRoot, NodeRoot, NewmSd, SolsmorScOrder, MansionDaySolsmor } = CalNewm(Name, Y)[0]
        ///////
        const YearScOrder = ((Y - 3) % 60 + 60) % 60
        const YearSc = ScList[YearScOrder]
        const YearStem = StemList.indexOf(YearSc[0])
        const YearBranch = BranchList.indexOf(YearSc[1])
        let Title = ''
        if (Y > 0) Title = Y + '年歲次' + YearSc
        else Title = '前' + (1 - Y) + '年歲次' + YearSc
        Title += '日月經緯宿度時憲曆'
        const Era = '欽天監欽遵御製' + NameList[Name] + '印造時憲曆頒行天下'
        const YuanYear = ((Y - 604) % 180 + 180) % 180 // 術數的元，以604甲子爲上元，60年一元，凡三元
        const YuanOrder = ~~(YuanYear / 60)
        const ThreeYuanYear = YuanYear - YuanOrder * 60
        const Yuan = YuanList[YuanOrder] + '元' + nzh.encodeS(ThreeYuanYear + 1) + '年'
        const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear)
        const YearColor = YearColorConvert(YuanYear)
        const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建        
        const OriginJdAccum = 2086292 + ~~(365.2423 * (Y - 1000)) // 設公元1000年前冬至12月16日2086292乙酉(22)爲曆元，作爲儒略日標準
        const OriginJdDif = (SolsAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)
        const MonName = [], MonInfo = [], MonColor = [], Sc = [], Jd = [], Nayin = [], Week = [], Equa = [], Eclp = [], Rise = [], Morningstar = [], Lat = [], Duskstar = [], MoonEclp = [], MoonEclpLat = [], MoonEqua = [], MoonEquaLat = [], MoonRise = [], NodeMapo = []
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
            Sc[i] = [], Jd[i] = [], Nayin[i] = [], Week[i] = [], Eclp[i] = [], Equa[i] = [], Rise[i] = [], Morningstar[i] = [], Lat[i] = [], Duskstar[i] = [], MoonEclp[i] = [], MoonEclpLat[i] = [], MoonEqua[i] = [], MoonEquaLat[i] = [], MoonRise[i] = [], NodeMapo[i] = []
            for (let k = 1; k <= ~~NewmSd[i] - ~~NewmSd[i - 1]; k++) { // 每月日數                
                const SdMidn = ~~(NewmSd[i - 1] + k - 1) // 每日夜半距冬至日數
                // const SdMidn = 263 // 1722-9-11八月朔 :263 廖育棟01:05
                DayAccum++ // 這個位置不能變
                //////////天文曆///////////
                const { Sorb, SunCorr, SunLon, SunGong, Speri } = sunQing(Name, SunRoot, SperiRoot, SdMidn)
                const { SunLon: SunLonMor } = sunQing(Name, SunRoot, SperiRoot, SdMidn + 1)
                const { MoonGong, MoonLon, MoonLat, Node, Mapo } = moonQing(Name, MoonRoot, NodeRoot, MapoRoot, SdMidn, SunCorr, SunGong, Speri, Sorb)
                Eclp[i][k] = deg2Hms(SunLon) + eclpGong2Mansion(Name, Y, SunGong, 2)
                // EclpMansion[i][k] =  // 注意：入宿度是轉換成了古度的
                const SEquaLon = LonHigh2Flat(Sobliq, SunLon)
                Equa[i][k] = deg2Hms(SEquaLon) + equaGong2Mansion(Name, Y, GongHigh2Flat(Sobliq, SunGong), 2)
                // EquaMansion[i][k] 
                Lat[i][k] = Lat2NS(HighLon2FlatLat(Sobliq, SunLon))
                Rise[i][k] = sunRiseQing(Sobliq, BjLat, SunLon)
                const TwilightLeng = twilight(Sobliq, BjLat, SunLon)
                const Func2 = Lon2Midstar(Name, Y, SunLon, SunLonMor, Rise[i][k])
                Morningstar[i][k] = ClockWest(Rise[i][k] - TwilightLeng, false) + ' ' + Func2.Morningstar
                Duskstar[i][k] = ClockWest(1 - Rise[i][k] + TwilightLeng, false) + ' ' + Func2.Duskstar
                Rise[i][k] = ClockWest(Rise[i][k]) + ' ' + ClockWest(1 - Rise[i][k], false)
                MoonEclp[i][k] = deg2Hms(MoonLon) + eclpGong2Mansion(Name, Y, MoonGong, 2)
                MoonEclpLat[i][k] = Lat2NS(MoonLat)
                const Func3 = starEclp2Equa(Sobliq, MoonLon, MoonLat)
                MoonEqua[i][k] = deg2Hms(Func3.EquaLon) + equaGong2Mansion(Name, Y, Lon2Gong(Func3.EquaLon), 2)
                MoonEquaLat[i][k] = Lat2NS(Func3.EquaLat)
                const { MoonRise: MoonRiseTmp, MoonSet: MoonSetTmp } = moonRiseQing(BjLat, Func3.EquaLon, Func3.EquaLat, SEquaLon)
                MoonRise[i][k] = ClockWest(MoonRiseTmp) + ' ' + ClockWest(MoonSetTmp, false)
                NodeMapo[i][k] = deg2Hms(Node) + deg2Hms(Mapo)
                ///////////具注曆////////////
                const ScOrder = ~~(SolsmorScOrder + SdMidn) % 60
                Sc[i][k] = ScList[ScOrder]
                Jd[i][k] = parseInt(OriginJdAccum + OriginJdDif + SdMidn + 2)
                Jd[i][k] += ' ' + Jd2Date1(Jd[i][k]).Mmdd
                const MansionOrder = (MansionDaySolsmor + DayAccum) % 28
                const WeekOrder = (MansionDaySolsmor + DayAccum + 3) % 7
                Week[i][k] = WeekList[WeekOrder] + WeekList1[WeekOrder] + MansionNameList[MansionOrder] + MansionAnimalNameList[MansionOrder]
                Sc[i][k] = NumList[k] + '日' + Sc[i][k]
            }
        }
        DayAccum = '僞造者依律處斬有能吿捕者官給賞銀五十兩如無本監曆日印信即同私造' + `\n凡` + nzh.encodeS(DayAccum) + '日　' + Yuan
        return {
            Era, Title, DayAccum, YearGod, YearColor, MonName, MonInfo, MonColor,
            Sc, Jd, Nayin, Week,
            Eclp, Equa, Lat, Morningstar, Rise, Duskstar,
            MoonEclp, MoonEclpLat,
            MoonEqua, MoonEquaLat, MoonRise, NodeMapo
        }
    }
    const result = []
    for (let Y = YearStart; Y <= YearEnd; Y++) {
        result.push(Main(Name, Y))
    }
    return result
}
// console.log(D2('Yongnian', 1722, 1722))