import Para from './para_calendars.mjs'
import { ScList } from './para_constant.mjs'
const pi = Math.PI
// 用一個式子表示條件判斷：
// x不及半周者，与半周相减；过半周者，减半周。 abs(180-x)
// x不及半周者，仍之；過半周者，與全周相減。  min(x, 360 - x)
// x过一象限者，与半周相减；过半周者，减半周；过三象限者，与全周相减。90-abs(90-x%180)
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = x => +Math.sin(d2r(x)).toFixed(7) // 數理精蘊附八線表用的是七位小數
const cos = x => +Math.cos(d2r(x)).toFixed(7)
const tan = x => +Math.tan(d2r(x)).toFixed(7)
const asin = x => +r2d(Math.asin(x)).toFixed(7)
const acos = x => +r2d(Math.acos(x)).toFixed(7)
const atan = x => +r2d(Math.atan(x)).toFixed(7)
const versin = x => +(1 - Math.cos(d2r(x))).toFixed(7) // 正矢
const sqr = x => +Math.sqrt(x).toFixed(7)
const m = x => (x % 360 + 360) % 360
const f1 = x => { // 不及半周为减，过半周为加。
    let flag = -1
    if (x > 180) flag = 1
    return flag
}
const f2 = x => {
    let flag = 1
    if (x > 180) flag = -1
    return flag
}
// 蒙氣差
const atmos = h => {
    const a = tan(90 - h) ** 2 + 1
    const delta = 4 + 4 * a * 2.0006095 * 0.0006095
    const x = (-2 + sqr(delta)) / (2 * a) // 根據公式1 ，一元二次方程求根公式
    const ang1 = asin((1 + x) / 1.0006095) - h
    const ang2 = asin(sin(ang1) * 1.0002841)
    return ang2 - ang1
}
// console.log(atmos(20)) // 0.04453873130688635
// 切線分外角法，見梅文鼎三角法舉要卷二。兩邊的輸入順序無所謂。已知邊角邊，求另外兩角。
const OppositeAngle = (a, b, x) => {
    x = Math.min(x, 360 - x)
    let long = a, short = b
    if (b > a) long = b, short = a
    const haAsupple = (180 - x) / 2 // 半外角
    const haAdif = atan((long - short) / (long + short) * tan(haAsupple)) // 半較角
    const Ashort = haAsupple - haAdif // 短邊對角
    const Along = haAsupple + haAdif // 長邊對角
    return { Ashort, Along }
    // 以下是我的作垂線法
    // const vertical = a * sin(x % 180)
    // const c = sqr(a ** 2 + b ** 2 - 2 * a * b * cos(180 - Math.abs(180 - x)))
    // return asin(vertical / c)
}
// 121.5759805556
// console.log(OppositeAngle(57.5, 1.5, Math.abs(180 -  121.5759805556 * 2)).Ashort)
// console.log(OppositeAngle(0.0117315, 0.0550505,  53.812).Ashort)
// A角angle，L线段line segment，E椭圆的一部分ellipse，C圆的一部分circle，S面积
const SunCorrGuimao = xRaw => {
    xRaw = +xRaw % 360
    const x = xRaw % 180
    const xMirror = 90 - Math.abs(90 - x)
    const a = 1, a2 = 2, b = 0.999857185, mid = 0.999928589, c = 0.0169000, c2 = 0.0338000, aSUBc = 0.9831000, aDIVb = 0.999857185 // 大小徑、avg中率、兩心差（焦距）。中距盈縮差1°56′12″。
    // 求對甲丙倍差之午角：作輔助線延長丙午到寅。丙寅=甲午+丙午=2a，求得∠寅，橢圓界角∠午=2*∠寅。    
    const Awu = 2 * OppositeAngle(c2, a2, xRaw).Ashort
    // 求橢圓差角未丙午，見上文葉37條    
    const Aweibingwu = xMirror - atan(aDIVb * tan(xMirror))
    let flag1 = 1, flag2 = 1
    if (x > 90) flag1 = -1
    if (xRaw > 180) flag2 = -1
    return flag2 * (Awu + flag1 * Aweibingwu)
}
// export default (CalName, year) => {
const cal = (CalName, year) => {
    const { CloseOriginAd, Solar, Precession, Lunar, ChouConst, MansionDayConst, SolsConst, SunperiConst, SunperiYV, SunperiDV, SunAvgDV, MoonAvgDV, MoonapoDV, NodeDV, MoonConst, MoonapoConst, NodeConst, MoonNodeMS, ChouMoonNodeDifConst, SunCorrMax, AvgMoonCorr1Max, AvgMoonapoCorrMax, AvgNodeCorrMax, AvgMoonCorr2ApogeeMax, AvgMoonCorr2PerigeeMax, AvgMoonCorr3Max, MoonCorr2ApogeeMax, MoonCorr2PerigeeMax, MoonCorr3Max, MoonCorr4MaxList, SunLimitYin, SunLimitYang, MoonLimit, ObliqmoonMax, ObliqmoonMin } = Para[CalName]
    const TermLeng = Solar / 24
    const CloseOriginYear = year - CloseOriginAd // 積年
    const OriginAccum = CloseOriginYear * Solar // 中積
    const OriginAccumPrev = (CloseOriginYear - 1) * Solar
    const OriginAccumNext = (CloseOriginYear + 1) * Solar
    const SolsAccum = OriginAccum + SolsConst // 通積分。
    const SolsFrac = SolsAccum - Math.floor(SolsAccum) // 冬至小數
    const SolsmorrowScOrder = (Math.floor(SolsAccum) + 2) % 60 // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）    
    const SunRoot = (1 - SolsFrac) * SunAvgDV // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。    
    const DayAccum = OriginAccum + (SolsConst - Math.floor(SolsConst)) - SolsFrac // 積日（曆元冬至次日到所求天正冬至次日的日數，等於算式的曆元冬至當日到所求冬至當日日數）
    const ChouAccum = DayAccum - ChouConst // 通朔
    const LunarNum = Math.floor(ChouAccum / Lunar) + 1 // 積朔。似乎+1是為了到十二月首朔
    const ChouSolsmorrowDif = (Lunar - ChouAccum % Lunar) % Lunar // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔
    const LunarNumMoonNodeDif = m(LunarNum * MoonNodeMS) // 積朔太陰交周
    const ChouMoonNodeDif = m(LunarNumMoonNodeDif + ChouMoonNodeDifConst) // 首朔太陰交周。上考往古則ChouMoonNodeDifConst-LunarNumMoonNodeDif
    const MoonRoot = m(DayAccum * MoonAvgDV + MoonConst) // 太陰年根
    const MoonapoRoot = m(DayAccum * MoonapoDV + MoonapoConst) // 最高年根
    const NodeRoot = m(NodeConst - DayAccum * NodeDV) // 正交年根，所得爲白經
    // 求值宿
    const OriginAccumMansion = OriginAccum + MansionDayConst // 通積宿
    const Mansion = (OriginAccumMansion % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
    const SunperiThisyear = SunperiYV * CloseOriginYear // 本年最卑行    
    /////////// 推日躔 //////////
    const SunGuimao = AvgSolsmorrowDif => { // 時間不限於子正初刻，一天中任意時候都可以
        const AvgSun = m(AvgSolsmorrowDif * SunAvgDV + SunRoot) // 平行：以年根與日數相加，得平行。// 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
        const Sunperi = SunperiThisyear + SunperiDV * AvgSolsmorrowDif + SunperiConst // 最卑平行
        const SunOrbitdeg = m(AvgSun - Sunperi) // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
        const SunCorr = SunCorrGuimao(SunOrbitdeg)
        const AcrSun = m(AvgSun + SunCorr) // 實行
        const SunLongi = m(AcrSun - 90) // 黃道度
        // AcrSun-Precession*(year-1684)⋯⋯ 求宿度：以積年與歲差五十一秒相乘，得數，與癸卯年黃道宿鈐相加，得本年宿鈐。察實行足減某宿度分則減之，餘爲某宿度分。——與古曆算法不同，這是捷法，但是⚠️這是夜半
        return { SunOrbitdeg, SunCorr, SunLongi, AcrSun, Sunperi }
    }
    /////////// 推月離 //////////
    const MoonGuimao = (AvgSolsmorrowDif, Sunperi, SunOrbitdeg, SunCorr, AcrSun) => {
        ///////////////////  求平行
        const AvgMoon1 = m(MoonRoot + AvgSolsmorrowDif * MoonAvgDV) // 太陰平行        
        const AvgMoonapo1 = m(MoonapoRoot + AvgSolsmorrowDif * MoonapoDV) // 最高平行
        const AvgNode1 = m(NodeRoot - AvgSolsmorrowDif * NodeDV) // 正交平行
        const AvgMoon2 = AvgMoon1 - SunCorr / SunCorrMax * AvgMoonCorr1Max // 二平行=太陰平行+-一平均：子正初刻用時之太陰平行。一平均（考慮地球自轉的時間）已有均數時差，而止就黃道算，故不用升度時差。一平均：太阳均数加者为减，减者为加。
        const AvgMoonapo = AvgMoonapo1 + SunCorr / SunCorrMax * AvgMoonapoCorrMax  // 用最高=最高平行+-最高平均
        const AvgNode = AvgNode1 - SunCorr / SunCorrMax * AvgNodeCorrMax// 用正交=正交平行+-正交平均
        const SunMoonapoDif = m(AcrSun - AvgMoonapo) // 日距月最高
        const SunNodeDif = m(AcrSun - AvgNode) // 日距正交                
        // 日距地心。(SunOrbitdeg+SunCorr)=太陽實引。像日躔曆理以角求積那樣，日在辛，地在甲，另一焦點丙，延長辛甲到壬，丙壬⊥辛壬。甲辛=x，(2-x)^2=丙壬^2+(甲壬+x)^2。
        const jiaren = cos(SunOrbitdeg + SunCorr) * 0.0338000 // 分股
        const bingren = sin(SunOrbitdeg + SunCorr) * 0.0338000 // 勾
        // const SunCoreDis = (4 - bingren ** 2 - jiaren ** 2) / (2 * jiaren + 4) // 我自己的算法
        const gouxianSum = 2 + jiaren // 勾弦和
        const gouxianDif = bingren ** 2 / gouxianSum // 勾弦較
        const xian = (gouxianSum + gouxianDif) / 2 // 弦
        const SunCoreDis = 2 - xian
        const TubedDif = 1.0169000 ** 3 - SunCoreDis ** 3 // 求立方較,太阳最高距地心数之立方
        const AvgMoonCorr2Apogee = Math.abs(sin(SunMoonapoDif * 2) * AvgMoonCorr2ApogeeMax) // 太陽在最高時日距月最高之二平均
        const AvgMoonCorr2Perigee = Math.abs(sin(SunMoonapoDif * 2) * AvgMoonCorr2PerigeeMax)
        const AvgMoonCorr2 = f1(SunMoonapoDif * 2) * (Math.abs(AvgMoonCorr2Apogee - AvgMoonCorr2Perigee) * TubedDif / 0.101410 + AvgMoonCorr2Apogee) // 本時之二平均。太陽高卑距地之立方大較 (10000000+169000)**3-(10000000-169000)**3。日距月最高倍度不及半周为减，过半周为加。
        const AvgMoonCorr3 = -sin(2 * SunNodeDif) * AvgMoonCorr3Max // 日距正交倍度不及半周为减，过半周为加。
        const AvgMoon = AvgMoon2 + AvgMoonCorr2 + AvgMoonCorr3 // 用平行                
        const AcrMoonapoCorr = f2(SunMoonapoDif * 2) * OppositeAngle(0.0117315, 0.0550505, Math.abs(180 - SunMoonapoDif * 2)).Ashort // 求最高實均。最高本輪半徑550505，最高均輪半徑117315。日距月最高之倍度与半周相减，馀为所夹之角。日距月最高倍度不及半周者，与半周相减。过半周者，减半周。日距月最高倍度不及半周为加，过半周为减。
        const MoonLco = Math.abs(0.0117315 * sin(Math.min(SunMoonapoDif * 2, 360 - SunMoonapoDif * 2)) / sin(AcrMoonapoCorr)) // 本天心距地：本時兩心差
        const AcrMoonapo = AvgMoonapo + AcrMoonapoCorr // 最高實行
        const MoonOrbitdeg = m(AvgMoon - AcrMoonapo) // 太陰引數=用平行-最高實行
        ///////////////////////// 求實行
        // 求初均（見月離曆理葉28）
        const Ajiagengyi = OppositeAngle(MoonLco, 1, Math.abs(180 - MoonOrbitdeg)).Ashort // 对两心差之小角.引数不及半周者，与半周相减。过半周者，则减半周。
        const Ayijiasi = OppositeAngle(MoonLco, 1, Ajiagengyi + Math.abs(180 - MoonOrbitdeg)).Along // 对半径之大角，为平圆引数
        const MoonCorr1 = f1(MoonOrbitdeg) * (atan(sqr(1 - MoonLco ** 2) * tan(90 - Math.abs(90 - Ayijiasi % 180))) - (90 - Math.abs(90 - MoonOrbitdeg % 180))) // 比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加。
        const AcrMoon1 = AvgMoon + MoonCorr1 // 初實行
        const MoonSunDif = m(AcrMoon1 - AcrSun) // 月距日
        const MoonCorr2Apogee = sin(MoonSunDif * 2) * MoonCorr2ApogeeMax // 太陽最高時月距日之二均
        const MoonCorr2Perigee = sin(MoonSunDif * 2) * MoonCorr2PerigeeMax // 太陽最卑時月距日之二均        
        const MoonCorr2 = f2(MoonSunDif * 2) * (Math.abs(MoonCorr2Apogee - MoonCorr2Perigee) * TubedDif / 0.101410 + MoonCorr2Apogee) // 本時之二均。月距日倍度不及半周为加，过半周为减。
        const AcrMoon2 = AcrMoon1 + MoonCorr2 // 二實行
        const AcrMoonSunDif = MoonSunDif + MoonCorr2 // 實月距日
        const SunMoonApoDif = m(AcrMoonapo - (Sunperi + 180)) // 日月最高相距
        const SunMoonDifSum = m(AcrMoonSunDif + SunMoonApoDif) // 相距總數
        const MoonCorr3 = sin(SunMoonDifSum) * MoonCorr3Max // 三均。总数初宫至五宫为加，六宫至十一宫为减。
        const AcrMoon3 = AcrMoon2 + MoonCorr3 // 三實行        
        const Dif90 = (90 - Math.abs(90 - SunMoonApoDif % 180)) / 10
        const Dif90Int = Math.floor(Dif90)
        const MoonCorr4Max = (Dif90 - Dif90Int) * (MoonCorr4MaxList[Dif90Int + 1] - MoonCorr4MaxList[Dif90Int]) + MoonCorr4MaxList[Dif90Int] // 兩弦最大末均
        const MoonCorr4 = -sin(AcrMoonSunDif) * MoonCorr4Max // 末均。实月距日初宫至五宫为减，六宫至十一宫为加。
        const AcrMoonWhite = AcrMoon3 + MoonCorr4 // 白道實行moon's path
        ///////////////////// 求黃白差
        const AcrNodeCorr = f2(SunNodeDif * 2) * OppositeAngle(57.5, 1.5, Math.abs(180 - SunNodeDif * 2)).Ashort // 正交實均。日距正交倍度过半周者，与半周相减，用其馀。日距正交倍度不及半周为加，过半周为减。
        const AcrNode = AvgNode + AcrNodeCorr // 正交實行
        const MoonNodeDif = m(AcrMoonWhite - AcrNode) // 月距正交
        const versinSunNodeDif = versin(Math.min(SunNodeDif * 2, 360 - SunNodeDif * 2))  // 日距正交倍度之正矢
        const ObliqmoonLimitCorr = versinSunNodeDif * (ObliqmoonMax - ObliqmoonMin) / 2 // 交角減分。黄白大距半較8分52秒半。凡日距正交倍度过半周者，则与全周相减，馀为距交倍度。
        const ObliqmoonLimit = ObliqmoonMax - ObliqmoonLimitCorr // 距限
        const ObliqmoonCorrSunNodeDif = (2 / 60 + 43 / 3600) / 2 * versinSunNodeDif // 距交加差。2分43秒最大兩弦加差        
        const ObliqmoonCorrAcrMoonSunDif = ObliqmoonCorrSunNodeDif / 2 * versin(Math.min(AcrMoonSunDif * 2, 360 - AcrMoonSunDif * 2)) // 距日加分
        const Obliqmoon = ObliqmoonLimit + ObliqmoonCorrAcrMoonSunDif // 黃白大距
        const MoonLati = asin(sin(Obliqmoon) * sin(MoonNodeDif)) // 黃道緯度。月距正交过一象限者与半周相减，过半周者减半周，过三象限者与全周相减
        const WhiteEclpDif = atan(cos(Obliqmoon) * tan(MoonNodeDif)) - MoonNodeDif % 180 // 升度差=月距正交之黃道度-月距正交。月距正交初、一、二、六、七、八宫为交后，为减。三、四、五、九、十、十一宫为交前，为加。之所以%180，因為tan(20)=tan(200)
        const AcrMoon = m(AcrMoonWhite + WhiteEclpDif)
        const MoonLongi = m(AcrMoon - 90)
        // 最後：求黃道宿度。用到黃道宿鈐。待定。
        return { AcrMoon, MoonLongi, MoonLati, MoonNodeDif }
    }
    const AutoNewmSyzygy = isNewm => {
        const AvgSc = [], AvgDeci = [], AvgAcrSc = [], AvgAcrDeci = [], AcrAcrDeci = [], TermAvgRaw = [], TermAcrRaw = [], TermAcrSolsDif = [], TermAvgSolsDif = [], AcrInt = [], Int = [], Raw = [], Corr = [], AcrRaw = [], AcrMod = [], Sc = [], AvgSolsmorrowDif = [], AcrSolsDif = [], Equa = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。 
        for (let i = 1; i <= 14; i++) {
            /////////////////// 推朔望
            //// 平朔望
            const AvgSolsmorrowDif = ChouSolsmorrowDif + (1 + i - (isNewm ? 1 : 0.5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgSolsmorrowDifMidn = Math.floor(AvgSolsmorrowDif)
            AvgSc[i] = ScList[SolsmorrowScOrder + AvgSolsmorrowDifMidn]
            AvgDeci[i] = AvgSolsmorrowDif - Math.floor(AvgSolsmorrowDif)
            //// 實朔望泛時
            let { Sunperi: SunperiMidnToday, SunOrbitdeg: SunOrbitdegMidnToday, SunCorr: SunCorrMidnToday, SunLongi: SunLongiMidnToday, AcrSun: AcrSunMidnToday } = SunGuimao(AvgSolsmorrowDifMidn)
            const { MoonLongi: MoonLongiMidnToday } = MoonGuimao(AvgSolsmorrowDifMidn, SunperiMidnToday, SunOrbitdegMidnToday, SunCorrMidnToday, AcrSunMidnToday)
            let AvgAcrSolsmorrowDifMidn = AvgSolsmorrowDifMidn
            SunLongiMidnToday += isNewm ? 0 : 180
            SunLongiMidnToday %= 360
            if (m(MoonLongiMidnToday - SunLongiMidnToday) > 180) {  // 如太陰實行未及太陽，則平朔日為實朔本日。
                let { Sunperi: SunperiMidnMorrow, SunOrbitdeg: SunOrbitdegMidnMorrow, SunCorr: SunCorrMidnMorrow, SunLongi: SunLongiMidnMorrow, AcrSun: AcrSunMidnMorrow } = SunGuimao(AvgSolsmorrowDifMidn + 1)
                const { MoonLongi: MoonLongiMidnMorrow } = MoonGuimao(AvgSolsmorrowDifMidn + 1, SunperiMidnMorrow, SunOrbitdegMidnMorrow, SunCorrMidnMorrow, AcrSunMidnMorrow)
                SunLongiMidnMorrow += isNewm ? 0 : 180
                SunLongiMidnMorrow %= 360
                if (m(MoonLongiMidnMorrow - SunLongiMidnMorrow) > 180) { // 如次日太陰實行仍未及太陽，則次日爲實朔日。
                    AvgAcrSolsmorrowDifMidn = AvgSolsmorrowDifMidn + 1
                    AvgAcrDeci[i] = (SunLongiMidnMorrow - MoonLongiMidnMorrow) / (m(MoonLongiMidnMorrow - MoonLongiMidnToday) - m(SunLongiMidnMorrow - SunLongiMidnToday))
                } else {
                    AvgAcrDeci[i] = (SunLongiMidnToday - MoonLongiMidnToday) / (m(MoonLongiMidnMorrow - MoonLongiMidnToday) - m(SunLongiMidnMorrow - SunLongiMidnToday)) // 分子：一日之月距日實行，分母：一日之月實行與一日之日實行相減。實際上是t=s/v
                }
            } else { // 如太陰實行已過太陽，則平朔前一日為實朔本日。
                AvgAcrSolsmorrowDifMidn = AvgSolsmorrowDifMidn - 1
                AvgAcrDeci[i] = 1 - (MoonLongiMidnToday - SunLongiMidnToday) / (m(MoonLongiMidnMorrow - MoonLongiMidnToday) - m(SunLongiMidnMorrow - SunLongiMidnToday))
            }
            AvgAcrSc[i] = ScList[SolsmorrowScOrder + AvgAcrSolsmorrowDifMidn]
            //// 實朔望實時
            let { Sunperi: SunperiHahBefore, SunOrbitdeg: SunOrbitdegHahBefore, SunCorr: SunCorrHahBefore, SunLongi: SunLongiHahBefore, AcrSun: AcrSunHahBefore } = SunGuimao(AvgAcrSolsmorrowDifMidn + AvgAcrDeci[i] - 0.5 / 24) // （如實望泛時爲丑正二刻，則以丑正初刻爲前時，寅初初刻爲後時）——為什麼不說前後一時呢
            const { MoonLongi: MoonLongiHahBefore } = MoonGuimao(AvgAcrSolsmorrowDifMidn + AvgAcrDeci[i] - 0.5 / 24, SunperiHahBefore, SunOrbitdegHahBefore, SunCorrHahBefore, AcrSunHahBefore)
            SunLongiHahBefore += isNewm ? 0 : 180
            SunLongiHahBefore %= 360
            let { Sunperi: SunperiHahAfter, SunOrbitdeg: SunOrbitdegHahAfter, SunCorr: SunCorrHahAfter, SunLongi: SunLongiHahAfter, AcrSun: AcrSunHahAfter } = SunGuimao(AvgAcrSolsmorrowDifMidn + AvgAcrDeci[i] + 0.5 / 24)
            const { MoonLongi: MoonLongiHahAfter } = MoonGuimao(AvgAcrSolsmorrowDifMidn + AvgAcrDeci[i] + 0.5 / 24, SunperiHahAfter, SunOrbitdegHahAfter, SunCorrHahAfter, AcrSunHahAfter)
            SunLongiHahAfter += isNewm ? 0 : 180
            SunLongiHahAfter %= 360
            AcrAcrDeci[i] = AvgAcrDeci[i] - 0.5 / 24 + (SunLongiHahBefore - MoonLongiHahBefore) / (m(MoonLongiHahAfter - MoonLongiHahBefore) - m(SunLongiHahAfter - SunLongiHahBefore)) * 0.5 / 24 // 一小時月距日實行
            const AcrAcrSolsmorrowDif = AvgAcrSolsmorrowDifMidn + AcrAcrDeci[i] // 實朔實時距冬至次日的時間
            const { Sunperi: SunperiAcrAcr, SunOrbitdeg: SunOrbitdegAcrAcr, SunCorr: SunCorrAcrAcr, AcrSun: AcrSunAcrAcr } = SunGuimao(AcrAcrSolsmorrowDif)
            const { MoonNodeDif: AcrAcrMoonNodeDif, MoonLongi: AcrAcrMoonLongi } = MoonGuimao(AcrAcrSolsmorrowDif, SunperiAcrAcr, SunOrbitdegAcrAcr, SunCorrAcrAcr, AcrSunAcrAcr)
            ////////////////// 推節氣只見於下編。
            // 一率：本日實行與次日實行相減，二率：1440分，三率：本日實行與節氣宮度相減。一日之行度:一日之分數=距節氣之度:距子正之分數。——不知道什麼意思，沒用。
            // 定氣推平氣法，似乎是用於測算，略。
            // 平氣推定氣法，葉21：【1】以天正冬至日分，各加平氣日率，減一日，各得平氣距天正冬至次日子正初刻日分。【2】又置平氣宮度，減本日最卑行，餘爲本日引數。【3】按法求得本日均數，【4】乃以太陽每日平行三千五百四十八秒三三〇五一六九為一率，周日一萬分爲二率，本日均數爲三率，求得四率，與平氣距天正冬至次日子正初刻之日分相加減（均數爲加者則減，均數爲減者則加）。又加本年紀日之數，滿紀法六十去之。
            const TermAvgSolsDif = (i + 2 - 1) * TermLeng
            TermAvgRaw[i] = TermAvgSolsDif + SolsAccum // 【1】                
            const TermAvgDaynum = (TermAvgSolsDif - (TermAvgRaw[i] - Math.floor(TermAvgRaw[i]))) * SunAvgDV - SunRoot
            const TermAvgPeri = SunperiThisyear + SunperiDV * TermAvgDaynum + SunperiConst // 之所以要用夜半，可能是為了計算方便
            const TermAvgPeriDif = (i + 2 - 1) * 30 - TermAvgPeri // 【2】
            const TermSunCorr = SunCorrGuimao(TermAvgPeriDif) // 【3】
            TermAcrRaw[i] = TermAvgRaw[i] - TermSunCorr / SunAvgDV // 【4】
            // 推節氣用時法（詳日躔曆理時差篇）——⚠️待補
            // 推各省節氣時刻法——略。
            // 推日出入晝夜時刻法 ⚠️待補
            /////////////////// 推交食
            let NewmCondition = false // 入食限可以入算
            const tmp = 180 - Math.abs(180 - AcrAcrMoonNodeDif % 180) // 距離0、180的度數            
            if (isNewm) {
                if (AcrAcrMoonNodeDif % 180 < 180) {
                    if (tmp < SunLimitYin) NewmCondition = true
                } else {
                    if (tmp < SunLimitYang) NewmCondition = true
                }
            } else {
                if (tmp < MoonLimit) NewmCondition = true
            }
        }
    }
    const {
        AvgSc: NewmAvgSc,
        AvgDeci: NewmAvgDeci
    } = AutoNewmSyzygy(0)
}
console.log(cal("Guimao", 1889))
// console.log(SunGuimao(313)) // 日躔與這個驗算無誤 https://zhuanlan.zhihu.com/p/526578717 算例：SolsmorrowDif=313，SunRoot=0+38/60+26.223/3600，SunperiThisyear=166*(1/60+2.9975/3600)
// 月離與這個驗算無誤 https://zhuanlan.zhihu.com/p/527394104
// SunOrbitdeg = 298 + 6 / 60 + 9.329 / 3600
// AvgMoon1 = 295.5279086111
// AvgMoonapo1 = 100.82456
// AvgNode1 = 95 + 42 / 60 + 47.522 / 3600
// SunCorr = -(1 + 43 / 60 + 6.462 / 3600)
// SunLongi = 217 + 25 / 60 + 46.766 / 3600
// Sunperi = 281 + 2 / 60 + 43.899 / 3600 - 270

// 以下是三條月亮初均驗算
// console.log(MoonCorr1(0.04904625, 206 + 22 / 60 + 21.88 / 3600))
// 小均 4331900  +572,725
// 2+13/60+57/3600=2.2325// 6宮26度20分
// 2+14/60+46/3600=2.2461111111 +0.0136111111 //30分
// 2.2325+0.0136111111*0.2=2.2352222222
// 中 5505050 +1173150
// 2+52/60+36/3600=2.8766666667// 6宮26度20分
// 2+53/60+39/3600=2.8941666667 +0.0175
// 2.8766666667+0.0175*0.2=2.8801666667
// 572,725/1173150=0.4881941781. 2.8801666667-2.2352222222=0.6449444445
// 結果2.5500803452
// console.log(MoonCorr1(0.0446505, 107 + 41 / 60 + 27 / 3600 + 22 / 216000)) // 《十月之交細草》卷上葉25, Corr = -(4 + 57 / 60 + 13 / 3600 + 19 / 216000)=-4.9536990741
// // 3宮17度
// 4+48/60+14/3600=4.8038888889
// 4+48/60+1/3600 =4.8002777778  -0.0036111111。4.8035277778
// 6+7/60+43/3600=6.1286111111
// 6+7/60+27/3600=6.1241666667 -0.0044444444。6.1281666667
// 13,315/117315=0.1134978477。6.1281666667-4.8035277778=1.3246388889，4.8035277778+1.3246388889*0.1134978477=4.9538714407
// console.log(MoonCorr1(0.0455941, 108 + 43 / 60)) // 考成後編表
