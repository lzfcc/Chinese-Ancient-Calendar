import Para from './para_calendars.mjs'
const pi = Math.PI
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const atmos = h => {
    const a = Math.tan(d2r(90 - h)) ** 2 + 1
    const delta = 4 + 4 * a * 2.0006095 * 0.0006095
    const x = 1e7 * (-2 + Math.sqrt(delta)) / (2 * a) // 根據公式1 ，一元二次方程求根公式
    const ang1 = r2d(Math.asin((1e7 + x) / 10006095)) - h
    const ang2 = r2d(Math.asin(Math.sin(d2r(ang1)) * 1.0002841))
    return ang2 - ang1
}
// console.log(atmos(20)) // 0.04453873130688635


// A角angle，L线段line segment，E椭圆的一部分ellipse，C圆的一部分circle，S面积
const SunCorrGuimao = xRaw => {
    xRaw = +xRaw % 360
    const x = xRaw % 180
    const xMirror = 90 - Math.abs(90 - x)
    const a = 10_000_000, a2 = 20_000_000, b = 9_998_571.85, mid = 9_999_285.89, c = 169_000, c2 = 338_000, aSUBc = 9_831_000, aDIVb = 0.999857185 // 大小徑、avg中率、兩心差（焦距）。中距盈縮差1°56′12″。
    const SCavg = 314114398282337 // 中率圓面積
    // 求對甲丙倍差之午角：作輔助線延長丙午到寅。丙寅=甲午+丙午=2a，甲丙^2+丙寅^2-2甲丙*丙寅*cos甲丙寅=甲寅^2，求得甲寅。同理求得∠寅，∠午=2*∠寅。
    const Ljiayin = Math.sqrt((c2 ** 2 + a2 ** 2 - 2 * a2 * c2 * Math.cos(d2r(x))))
    const Awu = 2 * r2d(Math.acos((Ljiayin ** 2 + a2 ** 2 - c2 ** 2) / (2 * Ljiayin * a2)))
    // 求橢圓差角未丙午，見上文葉37條    
    const Aweibingwu = xMirror - r2d(Math.atan(aDIVb * Math.tan(d2r(xMirror))))
    let flag1 = 1, flag2 = 1
    if (x > 90) flag1 = -1
    if (xRaw > 180) flag2 = -1
    return flag2 * (Awu + flag1 * Aweibingwu)
}



// export default (CalName, year) => {
const cal = (CalName, year) => {
    const { CloseOriginAd, Solar, Precession, Lunar, ChouConst, MansionDayConst, WinsolsConst, SunPeriConst, SunPeriYV, SunPeriDV, SunAvgDV, MoonAvgDV, MoonPeriDV, NodeDV, MoonPLUSNodeDV, MoonConst, MoonPeriConst, NodeConst, MoonNodeMS, ChouMoonNodeDifConst, SunCorrMax, MoonAvgCorr1Max, SunLimitYin, SunLimitYang } = Para[CalName]
    const TermLeng = Solar / 24
    const CloseOriginYear = year - CloseOriginAd // 積年
    const OriginAccumThis = CloseOriginYear * Solar // 中積
    const OriginAccumPrev = (CloseOriginYear - 1) * Solar
    const OriginAccumNext = (CloseOriginYear + 1) * Solar
    const WinsolsAccum = OriginAccumThis + WinsolsConst // 通積分。
    const WinsolsMod = (WinsolsAccum + 1) % 60 // 天正冬至。甲子爲1    
    const WinsolsFrac = WinsolsAccum - Math.floor(WinsolsAccum) // 冬至小數
    // const WinsolsNextSc = ScList[(WinsolsAccum + 2) % 60] // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）
    const SunRoot = (1 - WinsolsFrac) * SunAvgDV // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。    
    const DayAccum = OriginAccumThis + (WinsolsConst - Math.floor(WinsolsConst)) - WinsolsFrac // 積日（推月離用）
    const ChouAccum = DayAccum - ChouConst // 通朔
    const LunarNum = Math.floor(ChouAccum / Lunar) + 1 // 積朔。似乎+1是為了到十二月首朔
    const ChouWinsolsnextDif = (Lunar - ChouAccum % Lunar) % Lunar // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔
    const LunarNumMoonNodeDif = LunarNum * MoonNodeMS % 360 // 積朔太陰交周
    const ChouMoonNodeDif = (LunarNumMoonNodeDif + ChouMoonNodeDifConst) % 360 // 首朔太陰交周。上考往古則ChouMoonNodeDifConst-LunarNumMoonNodeDif
    const MoonRoot = DayAccum * MoonAvgDV + MoonConst // 太陰年根
    const MoonPeriRoot = DayAccum * MoonPeriDV + MoonPeriConst // 最高年根
    const NodeRoot = DayAccum * NodeDV + NodeConst // 正交年根    
    // 求值宿
    const OriginAccumMansion = OriginAccumThis + MansionDayConst // 通積宿
    const Mansion = (OriginAccumMansion % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
    const PeriThisYear = SunPeriYV * CloseOriginYear // 本年最卑行    
    const AutoNewmSyzygy = isNewm => {
        const MoonNodeDif = [], AvgRaw = [], AvgInt = [], AvgSc = [], AvgDeci = [], TermAvgRaw = [], TermAcrRaw = [], TermAcrWinsolsDif = [], TermAvgWinsolsDif = [], AnomaAccum = [], AnomaAccumNight = [], NodeAccum = [], NodeAccumNight = [], AcrInt = [], Int = [], Raw = [], Corr = [], AcrRaw = [], AcrMod = [], Sc = [], WinsolsDif = [], AcrWinsolsDif = [], Equa = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。 
        for (let i = 0; i <= 14; i++) {
            MoonNodeDif[i] = ChouMoonNodeDif + (1 + i - (isNewm ? 1 : 0.5)) * MoonNodeMS // 逐月朔太陰交周
            const tmp = 180 - Math.abs(180 - MoonNodeDif[i] % 180) // 距離0、180的度數
            let NewmCondition = false // 入食限可以入算
            if (MoonNodeDif[i] % 180 < 180) {
                if (tmp < SunLimitYin) NewmCondition = true
            } else {
                if (tmp < SunLimitYang) NewmCondition = true
            }
            WinsolsDif[i] = ChouWinsolsnextDif + (1 + i - (isNewm ? 1 : 0.5)) * Lunar // 各月到冬至次日子正日分
            AvgRaw[i] = WinsolsDif[i] + WinsolsAccum ////？？？？？？？
            AvgInt[i] = Math.floor(AvgRaw[i])
            const WinsolsDifToday = WinsolsDif[i] - (AvgRaw[i] - AvgInt[i]) // 夜半日分
            const AvgSunWinsolsDifToday = WinsolsDifToday * SunAvgDV + SunRoot // 夜半平行：以年根與日數相加，得平行。
            const SunDaynumToday = (WinsolsDifToday - (1 - WinsolsFrac)) * SunAvgDV // 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
            const SunPeriToday = PeriThisYear + SunPeriDV * SunDaynumToday + SunPeriConst // 朔日最卑平行——待確認？？？？
            const AvgSunPeriLongiDif = AvgSunWinsolsDifToday - SunPeriToday // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
            const AcrSunWinsolsDifToday = AvgSunWinsolsDifToday + SunCorrGuimao(AvgSunPeriLongiDif) // // 求均數，今天夜半實行
            // AcrSunWinsolsDifToday-Precession*(year-1684)⋯⋯ 求宿度：以積年與歲差五十一秒相乘，得數，與癸卯年黃道宿鈐相加，得本年宿鈐。察實行足減某宿度分則減之，餘爲某宿度分。——與古曆算法不同，這是捷法，但是⚠️這是夜半
            // 推月離
            const MoonDaynumToday = (WinsolsDifToday - (1 - WinsolsFrac)) * MoonAvgDV // 太陰日數
            const MoonPeriDaynumToday = WinsolsDif[i] * MoonPeriDV // 最高日數
            const NodeDaynum = WinsolsDif[i] * NodeDV // 正交日數
            const MoonLongiAvg = (MoonRoot + MoonDaynumToday) % 360 // 太陰平行
            const MoonPeriLongiAvg = (MoonPeriRoot + MoonPeriDaynumToday) % 360 // 最高平行
            const NodeLongiAvg = ((NodeRoot - NodeDaynum) % 360 + 360) % 360 // 正交平行
            // 求一平均
            // * MoonAvgCorr1Max





            // 推節氣只見於下編。一率：本日實行與次日實行相減，二率：1440分，三率：本日實行與節氣宮度相減。一日之行度:一日之分數=距節氣之度:距子正之分數。——不知道什麼意思，沒用。
            // 定氣推平氣法，似乎是用於測算，略。
            // 平氣推定氣法，葉21：【1】以天正冬至日分，各加平氣日率，減一日，各得平氣距天正冬至次日子正初刻日分。【2】又置平氣宮度，減本日最卑行，餘爲本日引數。【3】按法求得本日均數，【4】乃以太陽每日平行三千五百四十八秒三三〇五一六九為一率，周日一萬分爲二率，本日均數爲三率，求得四率，與平氣距天正冬至次日子正初刻之日分相加減（均數爲加者則減，均數爲減者則加）。又加本年紀日之數，滿紀法六十去之。
            const TermAvgWinsolsDif = (i + 2 - 1) * TermLeng
            TermAvgRaw[i] = TermAvgWinsolsDif + WinsolsAccum // 【1】                
            const TermAvgDaynum = (TermAvgWinsolsDif - (TermAvgRaw[i] - Math.floor(TermAvgRaw[i]))) * SunAvgDV - SunRoot
            const TermAvgPeri = PeriThisYear + SunPeriDV * TermAvgDaynum + SunPeriConst // 之所以要用夜半，可能是為了計算方便
            const TermAvgPeriLongiDif = (i + 2 - 1) * 30 - TermAvgPeri // 【2】
            const TermSunCorr = SunCorrGuimao(TermAvgPeriLongiDif) // 【3】
            TermAcrRaw[i] = TermAvgRaw[i] - TermSunCorr / SunAvgDV // 【4】
            // 推節氣用時法（詳日躔曆理時差篇）——好像是已知黃道求赤道？⚠️待補
            // 推各省節氣時刻法——略。
            // 推日出入晝夜時刻法 ⚠️待補            
        }
    }
}

// console.log(pi * 10000000 ** 2 * 86.16228155302097 / 360 * 9955401.64 / 9977576.232413441+667820*9955401.64/2)
// console.log(Math.sin(d2r(86.16228155302097))*10000000)

console.log(cal("Guimao", 1725))