// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import Para from './para_calendars.mjs'
import { ScList, deci } from './para_constant.mjs'
const pi = Math.PI
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = x => +Math.sin(d2r(x)).toFixed(8) // 數理精蘊附八線表用的是七位小數
const cos = x => +Math.cos(d2r(x)).toFixed(8)
const tan = x => +Math.tan(d2r(x)).toFixed(8)
const cot = x => +(1 / Math.tan(d2r(x))).toFixed(8)
const asin = x => +r2d(Math.asin(x)).toFixed(8)
const acos = x => +r2d(Math.acos(x)).toFixed(8)
const atan = x => +r2d(Math.atan(x)).toFixed(8)
const acot = x => +(90 - r2d(Math.atan(x))).toFixed(8)
// console.log(acos(0.8660254))
const versin = x => +(1 - Math.cos(d2r(x))).toFixed(8) // 正矢
const sqr = x => +Math.sqrt(x)
const t = x => (x % 360 + 360) % 360
const t1 = x => Math.abs(180 - x) // x不及半周者，与半周相减；过半周者，减半周。——與180的距離
const t2 = x => Math.min(x, 360 - x) // x不及半周者，仍之；過半周者，與全周相減。——與0的距離
const t3 = x => 90 - Math.abs(90 - x % 180) // x过一象限者，与半周相减；过半周者，减半周；过三象限者，与全周相减。——與0、180的距離
const f1 = x => x > 180 ? 1 : -1// 不及半周为减，过半周为加。
const f2 = x => x > 180 ? -1 : 1
const f3 = x => x % 180 < 90 ? 1 : -1 // 一、三象限加，二、四象限減
// 蒙氣差
// const TwoOrbitDif = (Obliq, Longi) => (Longi % 180 < 90 ? -1 : 1) * Math.abs(atan(cos(Obliq) * tan(Longi)) - Longi % 180) // 升度差。白道轉黃道，交後爲減，交前爲加。
const LongiHigh2Low = (e, x) => ~~(Math.ceil(x / 90) / 2) * 180 + atan(cos(e) * tan(x)) // 傾角、經度，用於黃轉赤，白轉黃
const LongiLow2High = (e, x) => Math.ceil(Math.ceil(x / 90) / 2) * 180 - 90 - atan(cos(e) * cot(x)) // 赤轉黃，黃轉白
const HighLongi2LowLati = (e, x) => asin(sin(e) * sin(x)) // 月距正交轉黃緯
const LowLongi2LowLati = (e, x) => atan(tan(e) * sin(x)) // 求赤經高弧交角用到這個的變形
// const LowLati2HighLongi = (e, x) => // 已知太陽赤緯轉黃經
// console.log(HighLongi2LowLati(23 + 29 / 60,112.28487818)) 
// console.log(LowLati2HighLongi(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=0.3973413465. HAB=23.41207808
// 切線分外角法，見梅文鼎三角法舉要卷二。兩邊的輸入順序無所謂。已知邊角邊，求另外兩角。
const OppositeAngle = (a, b, x) => {
    x = t2(x)
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
const OppositeAngleA = (a, b, x) => { // 固定返回a邊對角
    x = t2(x)
    let long = a, short = b
    if (b > a) long = b, short = a
    const haAsupple = (180 - x) / 2 // 半外角
    const haAdif = atan((long - short) / (long + short) * tan(haAsupple)) // 半較角
    const Ashort = haAsupple - haAdif // 短邊對角
    const Along = haAsupple + haAdif // 長邊對角
    let result = Along
    if (a < b) result = Ashort
    return result
}

// 121.5759805556
// console.log(OppositeAngle(57.5, 1.5, Math.abs(180 -  121.5759805556 * 2)).Ashort)
// console.log(OppositeAngle(0.0117315, 0.0550505,  53.812).Ashort)

// A角angle，L线段line segment，E椭圆的一部分ellipse，C圆的一部分circle，S面积
const atmos = h => {
    const a = tan(90 - h) ** 2 + 1
    const delta = 4 + 4 * a * 2.0006095 * 0.0006095
    const x = (-2 + sqr(delta)) / (2 * a) // 根據公式1 ，一元二次方程求根公式
    const ang1 = asin((1 + x) / 1.0006095) - h
    const ang2 = asin(sin(ang1) * 1.0002841)
    return ang2 - ang1
}
// console.log(atmos(20)) // 0.04453873130688635

const dist = (deg, c2) => { // 已知橢圓某點角度、橢圓倍兩心差，求短邊長，即距地心長度。像日躔曆理以角求積那樣，日在辛，地在甲，另一焦點丙，延長辛甲到壬，丙壬⊥辛壬。甲辛=x，(2-x)^2=丙壬^2+(甲壬+x)^2。
    const jiaren = cos(deg) * c2 // 分股
    const bingren = sin(deg) * c2 // 勾    
    const gouxianSum = 2 + jiaren // 勾弦和
    const gouxianDif = bingren ** 2 / gouxianSum // 勾弦較
    const xian = (gouxianSum + gouxianDif) / 2 // 弦
    return 2 - xian
    // return (4 - bingren ** 2 - jiaren ** 2) / (2 * jiaren + 4) // 我自己的算法 
}
const SunCorrGuimao = xRaw => {
    xRaw = +xRaw % 360
    const x = xRaw % 180
    const xMirror = t3(x)
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
    const { CloseOriginAd, Solar, Precession, Lunar, ChouConst, MansionDayConst, SolsConst, SunperiConst, SunperiYV, SunperiDV, SunAvgDV, MoonAvgDV, MoonapoDV, NodeDV, MoonConst, MoonapoConst, NodeConst, MoonNodeMS, ChouWhitelongiConst, SunCorrMax, AvgMoonCorr1Max, AvgMoonapoCorrMax, AvgNodeCorrMax, AvgMoonCorr2ApogeeMax, AvgMoonCorr2PerigeeMax, AvgMoonCorr3Max, MoonCorr2ApogeeMax, MoonCorr2PerigeeMax, MoonCorr3Max, MoonCorr4MaxList, SunLimitYinAcr, SunLimitYangAcr, MoonLimit, Obliquity, ObliqmoonMax, ObliqmoonMin, BeijingLati } = Para[CalName]
    const TermLeng = Solar / 12
    const CloseOriginYear = year - CloseOriginAd // 積年
    const OriginAccum = CloseOriginYear * Solar // 中積
    const OriginAccumPrev = (CloseOriginYear - 1) * Solar
    const OriginAccumNext = (CloseOriginYear + 1) * Solar
    const SolsAccum = OriginAccum + SolsConst // 通積分。
    const SolsDeci = deci(SolsAccum) // 冬至小數
    const SolsmorScOrder = (~~SolsAccum + 2) % 60 // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）Solsmor: winter solstice tomorrow 冬至次日子正初刻
    const SunRoot = (1 - SolsDeci) * SunAvgDV // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。    
    const DayAccum = OriginAccum + deci(SolsConst) - SolsDeci // 積日（曆元冬至次日到所求天正冬至次日的日數，等於算式的曆元冬至當日到所求冬至當日日數）
    const ChouAccum = DayAccum - ChouConst // 通朔
    const LunarNum = ~~(ChouAccum / Lunar) + 1 // 積朔。似乎+1是為了到十二月首朔
    const ChouSolsmorDif = (Lunar - ChouAccum % Lunar) % Lunar // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔
    const LunarNumWhitelongi = t(LunarNum * MoonNodeMS) // 積朔太陰交周
    const ChouWhitelongi = t(LunarNumWhitelongi + ChouWhitelongiConst) // 首朔太陰交周。上考往古則ChouWhitelongiConst-LunarNumWhitelongi
    const MoonRoot = t(DayAccum * MoonAvgDV + MoonConst) // 太陰年根
    const MoonapoRoot = t(DayAccum * MoonapoDV + MoonapoConst) // 最高年根
    const NodeRoot = t(NodeConst - DayAccum * NodeDV) // 正交年根，所得爲白經
    // 求值宿
    const OriginAccumMansion = OriginAccum + MansionDayConst // 通積宿
    const Mansion = (OriginAccumMansion % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
    const SunperiThisyear = SunperiYV * CloseOriginYear // 本年最卑行    
    /////////// 推日躔 //////////
    const SunGuimao = SolsmorDif => { // 時間不限於子正初刻，一天中任意時候都可以
        const AvgSun = t(SolsmorDif * SunAvgDV + SunRoot) // 平行：以年根與日數相加，得平行。// 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
        const Sunperi = SunperiThisyear + SunperiDV * SolsmorDif + SunperiConst // 最卑平行
        const SunOrbit = t(AvgSun - Sunperi) // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
        const SunCorr = SunCorrGuimao(SunOrbit)
        const SunGong = t(AvgSun + SunCorr) // 實行
        const SunLongi = (SunGong + 270) % 360 // 黃道度
        // SunGong-Precession*(year-1684)⋯⋯ 求宿度：以積年與歲差五十一秒相乘，得數，與癸卯年黃道宿鈐相加，得本年宿鈐。察實行足減某宿度分則減之，餘爲某宿度分。——與古曆算法不同，這是捷法，但是⚠️這是夜半
        return { SunOrbit, SunCorr, SunLongi, SunGong, Sunperi }
    }
    /////////// 推月離 //////////
    const MoonGuimao = (SolsmorDif, Sunperi, SunOrbit, SunCorr, SunGong) => {
        ///////////////////  求平行
        const AvgMoon1 = t(MoonRoot + SolsmorDif * MoonAvgDV) // 太陰平行        
        const AvgMoonapo1 = t(MoonapoRoot + SolsmorDif * MoonapoDV) // 最高平行
        const AvgNode1 = t(NodeRoot - SolsmorDif * NodeDV) // 正交平行
        const AvgMoon2 = AvgMoon1 - SunCorr / SunCorrMax * AvgMoonCorr1Max // 二平行=太陰平行+-一平均：子正初刻用時之太陰平行。一平均（考慮地球自轉的時間）已有均數時差，而止就黃道算，故不用升度時差。一平均：太阳均数加者为减，减者为加。
        const AvgMoonapo = AvgMoonapo1 + SunCorr / SunCorrMax * AvgMoonapoCorrMax  // 用最高=最高平行+-最高平均
        const AvgNode = AvgNode1 - SunCorr / SunCorrMax * AvgNodeCorrMax// 用正交=正交平行+-正交平均
        const SunMoonapoDif = t(SunGong - AvgMoonapo) // 日距月最高
        const SunNodeDif = t(SunGong - AvgNode) // 日距正交        
        const SunDist = dist(SunOrbit + SunCorr, 0.0338000) // 日距地心。
        const TubedDif = 1.0169000 ** 3 - SunDist ** 3 // 求立方較,太阳最高距地心数之立方
        const AvgMoonCorr2Apogee = Math.abs(sin(SunMoonapoDif * 2) * AvgMoonCorr2ApogeeMax) // 太陽在最高時日距月最高之二平均
        const AvgMoonCorr2Perigee = Math.abs(sin(SunMoonapoDif * 2) * AvgMoonCorr2PerigeeMax)
        const AvgMoonCorr2 = f1(SunMoonapoDif * 2) * (Math.abs(AvgMoonCorr2Apogee - AvgMoonCorr2Perigee) * TubedDif / 0.101410 + AvgMoonCorr2Apogee) // 本時之二平均。太陽高卑距地之立方大較 (10000000+169000)**3-(10000000-169000)**3。日距月最高倍度不及半周为减，过半周为加。
        const AvgMoonCorr3 = -sin(2 * SunNodeDif) * AvgMoonCorr3Max // 日距正交倍度不及半周为减，过半周为加。
        const AvgMoon = AvgMoon2 + AvgMoonCorr2 + AvgMoonCorr3 // 用平行                
        const AcrMoonapoCorr = f2(SunMoonapoDif * 2) * OppositeAngle(0.0117315, 0.0550505, t1(SunMoonapoDif * 2)).Ashort // 求最高實均。最高本輪半徑550505，最高均輪半徑117315。日距月最高之倍度与半周相减，馀为所夹之角。日距月最高倍度不及半周者，与半周相减。过半周者，减半周。日距月最高倍度不及半周为加，过半周为减。
        const MoonLco = Math.abs(0.0117315 * sin(t2(SunMoonapoDif * 2)) / sin(AcrMoonapoCorr)) // 本天心距地：本時兩心差        
        const AcrMoonapo = AvgMoonapo + AcrMoonapoCorr // 最高實行
        const MoonOrbit = t(AvgMoon - AcrMoonapo) // 太陰引數=用平行-最高實行
        ///////////////////////// 求實行
        // 求初均（見月離曆理葉28）
        const Ajiagengyi = OppositeAngle(MoonLco, 1, t1(MoonOrbit)).Ashort // 对两心差之小角.引数不及半周者，与半周相减。过半周者，则减半周。
        const Ayijiasi = OppositeAngle(MoonLco, 1, Ajiagengyi + t1(MoonOrbit)).Along // 对半径之大角，为平圆引数
        const MoonCorr1 = f1(MoonOrbit) * (atan(sqr(1 - MoonLco ** 2) * tan(t3(Ayijiasi))) - t3(MoonOrbit)) // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加。        
        const AcrMoon1 = AvgMoon + MoonCorr1 // 初實行
        const MoonSunDif = t(AcrMoon1 - SunGong) // 月距日
        const MoonCorr2Apogee = sin(MoonSunDif * 2) * MoonCorr2ApogeeMax // 太陽最高時月距日之二均
        const MoonCorr2Perigee = sin(MoonSunDif * 2) * MoonCorr2PerigeeMax // 太陽最卑時月距日之二均        
        const MoonCorr2 = f2(MoonSunDif * 2) * (Math.abs(MoonCorr2Apogee - MoonCorr2Perigee) * TubedDif / 0.101410 + MoonCorr2Apogee) // 本時之二均。月距日倍度不及半周为加，过半周为减。
        const AcrMoon2 = AcrMoon1 + MoonCorr2 // 二實行
        const AcrMoonSunDif = MoonSunDif + MoonCorr2 // 實月距日
        const SunMoonApoDif = t(AcrMoonapo - (Sunperi + 180)) // 日月最高相距
        const SunMoonDifSum = t(AcrMoonSunDif + SunMoonApoDif) // 相距總數
        const MoonCorr3 = sin(SunMoonDifSum) * MoonCorr3Max // 三均。总数初宫至五宫为加，六宫至十一宫为减。
        const AcrMoon3 = AcrMoon2 + MoonCorr3 // 三實行        
        const Dif90 = t3(SunMoonApoDif) / 10
        const Dif90Int = ~~Dif90
        const MoonCorr4Max = (Dif90 - Dif90Int) * (MoonCorr4MaxList[Dif90Int + 1] - MoonCorr4MaxList[Dif90Int]) + MoonCorr4MaxList[Dif90Int] // 兩弦最大末均
        const MoonCorr4 = -sin(AcrMoonSunDif) * MoonCorr4Max // 末均。实月距日初宫至五宫为减，六宫至十一宫为加。
        const Whitegong = AcrMoon3 + MoonCorr4 // 白道實行moon's path
        ///////////////////// 求黃白差
        const AcrNodeCorr = f2(SunNodeDif * 2) * OppositeAngle(57.5, 1.5, t1(SunNodeDif * 2)).Ashort // 正交實均。日距正交倍度过半周者，与半周相减，用其馀。日距正交倍度不及半周为加，过半周为减。
        const AcrNode = t(AvgNode + AcrNodeCorr) // 正交實行
        const Whitelongi = t(Whitegong - AcrNode) // 月距正交。——我把正交定為白經0度
        const versinSunNodeDif = versin(t2(SunNodeDif * 2))  // 日距正交倍度之正矢
        const ObliqmoonLimitCorr = versinSunNodeDif * (ObliqmoonMax - ObliqmoonMin) / 2 // 交角減分。黄白大距半較8分52秒半。凡日距正交倍度过半周者，则与全周相减，馀为距交倍度。
        const ObliqmoonLimit = ObliqmoonMax - ObliqmoonLimitCorr // 距限
        const ObliqmoonCorrSunNodeDif = (2 / 60 + 43 / 3600) / 2 * versinSunNodeDif // 距交加差。2分43秒最大兩弦加差        
        const ObliqmoonCorrAcrMoonSunDif = ObliqmoonCorrSunNodeDif / 2 * versin(t2(AcrMoonSunDif * 2)) // 距日加分
        const Obliqmoon = ObliqmoonLimit + ObliqmoonCorrAcrMoonSunDif // 黃白大距
        const MoonLati = asin(sin(Obliqmoon) * sin(Whitelongi)) // 黃道緯度。月距正交过一象限者与半周相减，过半周者减半周，过三象限者与全周相减
        // const EclpWhiteDif = TwoOrbitDif(Obliqmoon, Whitelongi) // 升度差=月距正交之黃道度-月距正交。月距正交初、一、二、六、七、八宫为交后，为减。三、四、五、九、十、十一宫为交前，为加。之所以%180，因為tan(20)=tan(200)
        // const MoonGong = t(Whitegong + EclpWhiteDif)
        const MoonGong = (LongiHigh2Low(Obliqmoon, Whitelongi) + AcrNode) % 360
        const MoonLongi = (MoonGong + 270) % 360
        // 最後：求黃道宿度。用到黃道宿鈐。待定。
        return { AcrNode, Whitegong, Whitelongi, MoonGong, MoonLongi, MoonLati, Obliqmoon, MoonOrbit, MoonCorr1, MoonLco }
    }
    const TcorrSum = (AcracrSunCorr, AcracrSunLongi) => { // 時差總
        const SunCorrTcorr = -AcracrSunCorr / 15 // 均數時差。以實望太陽均數變時。均數加者則爲減。
        const EclpEquaDifTcorr = (AcracrSunLongi - LongiHigh2Low(Obliquity, AcracrSunLongi)) / 15 // 升度時差。二分後爲加，二至後爲減。
        return SunCorrTcorr + EclpEquaDifTcorr
    }
    const SunEcliGuimao = (AcracrSunCorr, AcracrSolsmorDif, AcracrSunLongi) => {
        //////// 【一】實朔用時。用時的英語暫且用Now
        const SolsmorDifNow = AcracrSolsmorDif + TcorrSum(AcracrSunCorr, AcracrSunLongi) // 實朔用時=實朔實時+-時差總 
        const Rise = 0.25 // ⚠️⚠️⚠️⚠️⚠️⚠️
        if (deci(SolsmorDifNow) < Rise - 5 / 96 && deci(SolsmorDifNow) > 1 - Rise + 5 / 96) return // 日出前日入後五刻以內可以見食
        else {
            //////// 【二】食甚實緯、食甚用時。這一段日月食都一樣
            const SunNow = SunGuimao(SolsmorDifNow)
            const SunOnehAft = SunGuimao(SolsmorDifNow + 1 / 24)
            const MoonNow = MoonGuimao(SolsmorDifNow, SunNow.Sunperi, SunNow.SunOrbit, SunNow.SunCorr, SunNow.SunGong)
            const MoonOnehAft = MoonGuimao(SolsmorDifNow + 1 / 24, SunOnehAft.Sunperi, SunOnehAft.SunOrbit, SunOnehAft.SunCorr, SunOnehAft.SunGong)
            // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
            const AngEquilibriumWhite = OppositeAngle(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Obliqmoon).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
            const AngEquilibriumEclp = MoonNow.Obliqmoon + AngEquilibriumWhite // 斜距黃道交角
            const AvgDistReal = Math.abs(cos(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚實緯，即食甚兩心實相距，南北與兩心實望黃道實緯同。
            const EquilibriumOnehLeng = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Obliqmoon) / sin(AngEquilibriumWhite)  // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA                    
            const ArcTotalNow = Math.abs(sin(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚距弧
            const TotalNowDif = (MoonNow.Whitelongi % 180 < 90 ? -1 : 1) * ArcTotalNow / EquilibriumOnehLeng / 24 // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
            const SolsmorDifAvg = SolsmorDifNow + TotalNowDif // 食甚用時
            const SunAvg = SunGuimao(SolsmorDifAvg)
            const MoonAvg = MoonGuimao(SolsmorDifAvg, SunAvg.Sunperi, SunAvg.SunOrbit, SunAvg.SunCorr, SunAvg.SunGong)
            //////// 【三】地平高下差、日月視徑
            const AcrSunOrbit = SunNow.SunOrbit + SunAvg.SunCorr // 太陽實引：實朔引數+-本時太陽均數
            const AcrMoonOrbit = MoonNow.MoonOrbit + MoonAvg.MoonCorr1 // 太陰實引
            const MoonDist = dist(AcrMoonOrbit, MoonNow.MoonLco * 2)
            const HorizonParallax = MoonDist * (57 / 60 + 30 / 3600) - 10 / 3600 // 地平高下差=太陰在地平上最大地半徑差-太陽地半徑差
            const SunAcrRadius = dist(AcrSunOrbit, 0.0338000) * (16 / 60 + 6 / 3600) - 15 / 3600 // 太陽實半徑=太陽視半徑-光分15秒
            const MoonRadius = MoonDist * (15 / 60 + 40 / 3600 + 30 / 216000) // 太陰視半徑
            const RadiusSum = SunAcrRadius + MoonRadius // 併徑
            //////// 【四】食甚太陽黃赤經緯宿度、黃赤二經交角            
            const TotalSunLongi = t(SunAvg.SunLongi + TotalNowDif * (SunOnehAft.SunGong - SunAvg.SunGong) * 24) // 食甚太陽黃道經度=實朔太陽黃道實行+距時日實行
            const TotalSunEquaLongi = LongiHigh2Low(Obliquity, TotalSunLongi)
            const TotalSunEquaGong = (TotalSunEquaLongi + 90) % 360 // 自冬至初宮起算，得食甚太陽赤道經度。
            const TotalSunEquaLati = HighLongi2LowLati(Obliquity, TotalSunLongi) // 食甚太陽赤道緯度。食甚太陽距春秋分黃經之正弦：三率。
            const AngSunPolar = 90 - TotalSunEquaLati // 太陽距北極
            const AngEclpEquaLongi = (TotalSunEquaGong > 180 ? 180 : 0) - acot(cot(Obliquity) / cos(TotalSunLongi)) // 黃赤二經交角。自變量：太陽距春秋分黃經。冬至後黃經在赤經西，夏至後黃經在赤經東。⚠️我定義東正西負。此步已核驗
            const AngWhiteEclpLongi = (MoonAvg.Whitelongi < 90 || MoonAvg.Whitelongi > 270 ? -1 : 1) * AngEquilibriumEclp // 實朔月距正交初宮十一宮，白經在黃經西，五宮六宮白經在黃經東
            const AngWhiteEquaLongi = AngEclpEquaLongi + AngWhiteEclpLongi // 赤白二經交角。所得爲白經在赤經之東西。
            //////// 【五】食甚用時兩心視相距
            const AngAvgSunSouth = Math.abs(0.5 - deci(SolsmorDifAvg)) * 15   // 用時太陽距午赤道度
            const AngPolarVerti = LongiHigh2Low(AngAvgSunSouth, (90 - BeijingLati)) // 距極分邊
            const AngSunVerti = AngSunPolar - AngPolarVerti  // 自天頂作垂線，得距極分邊，再與太陽距極相加減，得距日分邊。距午度<90度，垂線在三角形內，相減，>90相加。            
            const tanArcVerti = tan(AngAvgSunSouth) * sin(AngPolarVerti) // 垂弧之正切
            const AngEqualongiHigharc = (deci(SolsmorDifAvg) < 0.5 ? 1 : -1) * (atan(sin(AngSunVerti) * tanArcVerti) + 180) % 180 // 用時赤經高弧交角。若距極分邊轉大於太陽距北極，則所得爲外角，與半周相減。午前赤經在高弧東，午後赤經在高弧西。
            const AngSunZenith = asin(sin(AngAvgSunSouth) * sin(90 - BeijingLati) / sin(AngEqualongiHigharc))
            // const AngSunZenith = LongiLow2High(AngEqualongiHigharc, AngSunVerti) // 用時太陽距天頂。我的算法，不知對不對
            const AvgParallax = HorizonParallax * sin(AngSunZenith) // 用時高下差
            const AngWhitelongiHigharc = AngEqualongiHigharc + AngWhiteEquaLongi // 用時白經高弧交角。若⋯⋯無餘，則白經與高弧合，無交角，食甚用時即真時，用時高下差與食甚實緯相加減，即食甚兩心視相距——所得爲白經在高弧的東或西
            const AngDistApparent = ((MoonAvg.Whitelongi < 180 ? 1 : -1) * Math.abs(AngWhitelongiHigharc) + 180) % 180 // p486 用時對兩心視相距角。月在黃道北，則白經高弧交角就是對xx角。實距在高弧之東西與白經同。月在黃道南，則以白經高弧交角與半周相減。白經在高弧東者(AngWhitelongiHigharc>0)，實距在高弧西；白經在高弧西者，實距在高弧東。⚠️符號判斷待定
            const AngAvgDistReal = OppositeAngleA(AvgDistReal, AvgParallax, AngDistApparent) // 用時對兩心實相距角。得半較角，與半外角相加減（兩心實相距>高下差則+ .along，<高下差則- .ashort）。
            const AvgDistApparent = sin(AngDistApparent) * AvgDistReal / sin(AngAvgDistReal) // 用時兩心視相距
            //////// 【六】食甚設時兩心視相距、食甚真時
            const AvgAssumDif = - (AngWhitelongiHigharc / 180 * 8.8 / 96 + 0.2 / 96) // 設時距分
            const Assum = SolsmorDifAvg + AvgAssumDif // 食甚設時。東向前取，西向後取，角大遠取，角小近取（遠不過九刻，近或數分）
            const ArcAvgAssumDif = EquilibriumOnehLeng * AvgAssumDif * 24
            // 設時距弧
            const AngArcAvgAssumDif = atan(ArcAvgAssumDif / AvgDistReal) // 設時對距弧角
            const AssumDistReal = ArcAvgAssumDif / sin(AngArcAvgAssumDif) // 設時兩心實相距
            const AngAssumSunSouth = Math.abs(0.5 - deci(Assum)) * 15 // 設時太陽距午赤道度
            // 設時赤經高弧交角
        }
    }
    const MoonEcliGuimao = (AcracrSolsmorDif, AcracrSunCorr, AcracrSunLongi) => {
        //////// 【一】實望用時
        const SolsmorDifNow = AcracrSolsmorDif + TcorrSum(AcracrSunCorr, AcracrSunLongi) // 實望用時=實望實時+-時差總
        if (deci(SolsmorDifNow) > Rise + 9 / 96 && deci(SolsmorDifNow) < 1 - Rise - 9 / 96) return // 日出入前後9刻以內入算
        else {
            //////// 【二】食甚實緯、食甚時刻
            const SunNow = SunGuimao(SolsmorDifNow)
            const SunOnehAft = SunGuimao(SolsmorDifNow + 1 / 24)
            const MoonNow = MoonGuimao(SolsmorDifNow, SunNow.Sunperi, SunNow.SunOrbit, SunNow.SunCorr, SunNow.SunGong)
            const MoonOnehAft = MoonGuimao(SolsmorDifNow + 1 / 24, SunOnehAft.Sunperi, SunOnehAft.SunOrbit, SunOnehAft.SunCorr, SunOnehAft.SunGong)
            // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
            const AngEquilibriumWhite = OppositeAngle(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Obliqmoon).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
            const AngEquilibriumEclp = MoonNow.Obliqmoon + AngEquilibriumWhite // 斜距黃道交角
            const DistReal = Math.abs(cos(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚實緯，即食甚兩心實相距，南北與兩心實望黃道實緯同。
            const EquilibriumOnehLeng = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Obliqmoon) / sin(AngEquilibriumWhite)  // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA                    
            const ArcTotalNow = Math.abs(sin(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚距弧
            const TotalNowDif = (MoonNow.Whitelongi % 180 < 90 ? -1 : 1) * ArcTotalNow / EquilibriumOnehLeng / 24 // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
            const SolsmorDifTotal = SolsmorDifNow + TotalNowDif
            const Total = deci(SolsmorDifTotal) // 食甚時刻
            const SunTotal = SunGuimao(SolsmorDifTotal)
            const MoonTotal = MoonGuimao(SolsmorDifTotal, SunTotal.Sunperi, SunTotal.SunOrbit, SunTotal.SunCorr, SunTotal.SunGong)
            //////// 【三】食分
            AcrMoonOrbit = MoonNow.MoonOrbit + MoonTotal.MoonCorr1
            AcrSunOrbit = SunNow.SunOrbit + SunTotal.SunCorr
            const MoonDist = dist(AcrMoonOrbit, MoonNow.MoonLco * 2)
            const MoonParallax = MoonDist * (57 / 60 + 30 / 3600) // 太陰地半徑差。中距最大地半徑差 57分30秒。此一弧度代正弦算。
            const SunRadius = dist(AcrSunOrbit, 0.0338000) * (16 / 60 + 6 / 3600) // 太陽視半徑。中距太陽視半徑16分6秒
            const ShadowRadius = MoonParallax + 10 / 3600 - SunRadius + MoonParallax / 69 // 實影半徑=月半徑差+日半徑差-日半徑+影差。太陽地半徑差10秒。
            const MoonRadius = MoonDist * (15 / 60 + 40 / 3600 + 30 / 216000) // 太陰視半徑
            const RadiusSum = MoonRadius + ShadowRadius // 併徑——也就是出現月食的最大極限
            // const RadiusDif = MoonRadius - ShadowRadius // 兩徑較                    
            const Magni = (RadiusSum - DistReal) / (MoonRadius * 2) // 若食甚實緯大於併徑，則月與地影不相切，則不食，即不必算。上編卷七：併徑大於距緯之較，即爲月食之分
            if (Magni < 0) return
            //////// 【四】初虧復圓時刻
            const StarttoendArc = sqr((RadiusSum + DistReal) * (RadiusSum - DistReal)) // 初虧復圓距弧。就是直角三角形已知兩邊。
            const StarttoendTime = StarttoendArc / EquilibriumOnehLeng / 24 // 初虧復圓距時
            const Start = (Total - StarttoendTime + 1) % 1
            const End = Total + StarttoendTime //復圓時刻
            //////// 【五】食既生光時刻
            //////// 【六】食甚太陰黃道經緯宿度
            const TotalNowWhitegongDif = Equilibrium.TotalNowDif / (MoonOnehAft.Whitegong - MoonNow.Whitegong) // 距時月實行
            const TotalWhitelongi = MoonNow.Whitelongi + TotalNowWhitegongDif // 食甚月距正交
            // const TotalEclpWhiteDif = TwoOrbitDif(MoonNow.Obliqmoon, TotalWhitelongi) // 黃白升度差。食甚距時加者亦爲加，減者亦爲減。⚠️我這裡符號用的食甚的月距正交，而非食甚距時所用的實望的月距正交。
            const TotalMoonGong = (LongiHigh2Low(MoonNow.Obliqmoon, TotalWhitelongi) + MoonNow.AcrNode) % 360 // 食甚太陰黃道經度
            const TotalMoonLongi = (TotalMoonGong + 270) % 360
            const TotalMoonLati = HighLongi2LowLati(MoonNow.Obliqmoon, TotalWhitelongi) // 食甚太陰黃道緯度，南北與食甚實緯同
            // const TotalMoonLati = sin(90 - AngEquilibriumEclp) * DistReal // 這是食甚實緯之南北。
            //////// 【七】食甚太陰赤道經緯宿度
            const ObliqMoonEclp = (TotalMoonLati > 0 ? 1 : -1) * t3(acot(sin(t3(TotalMoonLongi)) * cot(TotalMoonLati))) // 太陰距二分弧與黃道交角。單獨算沒問題。近似成平面三角就可以了 sinAcotB=cotC，也就是a/r·r/h=a/h
            const ObliqMoonEqua = Obliquity + ObliqMoonEclp // 太陰距二分弧與赤道交角
            // 思路：黃轉白，白轉赤。
            const tanArcMoonEquinox = cos(ObliqMoonEclp) * tan(TotalMoonLongi) // 太陰距二分弧之正切線
            const TotalMoonEquaLongi = ~~(Math.ceil(x / 90) / 2) * 180 + atan(cos(ObliqMoonEqua) * tanArcMoonEquinox) // 太陰距二分赤道經度
            const TotalMoonEquaGong = (TotalMoonEquaLongi + 90) % 360
            const TotalMoonEquaLati = atan(tan(ObliqMoonEqua) * sin(t3(TotalMoonEquaLongi)))
            //////// 【八】推月食方位
            return { Start, Total, End, Magni, TotalMoonLongi, TotalMoonLati, TotalMoonEquaLongi, TotalMoonEquaLati }
        }
    }
    const AutoNewmSyzygy = isNewm => {
        const AvgSc = [], AvgDeci = [], AvgacrSc = [], AvgacrDeci = [], AcracrDeci = [], TermSc = [], TermDeci = [], TermAcrSc = [], TermAcrDeci = [], Equa = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。 
        for (let i = 6; i <= 14; i++) {
            /////////////////// 推朔望
            //// 平朔望
            const AvgSolsmorDif = ChouSolsmorDif + (1 + i - (isNewm ? 1 : 0.5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgSolsmorDifMidn = ~~AvgSolsmorDif
            AvgSc[i] = ScList[(SolsmorScOrder + AvgSolsmorDifMidn) % 60]
            AvgDeci[i] = AvgSolsmorDif - AvgSolsmorDifMidn
            //// 實朔望泛時
            let { Sunperi: SunperiMidnToday, SunOrbit: SunOrbitMidnToday, SunCorr: SunCorrMidnToday, SunLongi: SunLongiMidnToday, SunGong: SunGongMidnToday } = SunGuimao(AvgSolsmorDifMidn)
            const { MoonLongi: MoonLongiMidnToday } = MoonGuimao(AvgSolsmorDifMidn, SunperiMidnToday, SunOrbitMidnToday, SunCorrMidnToday, SunGongMidnToday)
            let AvgacrSolsmorDifMidn = AvgSolsmorDifMidn
            SunLongiMidnToday += isNewm ? 0 : 180
            SunLongiMidnToday %= 360
            let { Sunperi: SunperiMidnMorrow, SunOrbit: SunOrbitMidnMorrow, SunCorr: SunCorrMidnMorrow, SunLongi: SunLongiMidnMorrow, SunGong: SunGongMidnMorrow } = SunGuimao(AvgSolsmorDifMidn + 1)
            const { MoonLongi: MoonLongiMidnMorrow } = MoonGuimao(AvgSolsmorDifMidn + 1, SunperiMidnMorrow, SunOrbitMidnMorrow, SunCorrMidnMorrow, SunGongMidnMorrow)
            SunLongiMidnMorrow += isNewm ? 0 : 180
            SunLongiMidnMorrow %= 360
            if (t(MoonLongiMidnToday - SunLongiMidnToday) > 180) {  // 如太陰實行未及太陽，則平朔日為實朔本日。                
                if (t(MoonLongiMidnMorrow - SunLongiMidnMorrow) > 180) { // 如次日太陰實行仍未及太陽，則次日爲實朔日。
                    AvgacrSolsmorDifMidn = AvgSolsmorDifMidn + 1
                    AvgacrDeci[i] = (SunLongiMidnMorrow - MoonLongiMidnMorrow) / (t(MoonLongiMidnMorrow - MoonLongiMidnToday) - t(SunLongiMidnMorrow - SunLongiMidnToday))
                } else {
                    AvgacrDeci[i] = (SunLongiMidnToday - MoonLongiMidnToday) / (t(MoonLongiMidnMorrow - MoonLongiMidnToday) - t(SunLongiMidnMorrow - SunLongiMidnToday)) // 分子：一日之月距日實行，分母：一日之月實行與一日之日實行相減。實際上是t=s/v
                }
            } else { // 如太陰實行已過太陽，則平朔前一日為實朔本日。
                AvgacrSolsmorDifMidn = AvgSolsmorDifMidn - 1
                AvgacrDeci[i] = 1 - (MoonLongiMidnToday - SunLongiMidnToday) / (t(MoonLongiMidnMorrow - MoonLongiMidnToday) - t(SunLongiMidnMorrow - SunLongiMidnToday))
            }
            AvgacrSc[i] = ScList[(SolsmorScOrder + AvgacrSolsmorDifMidn) % 60]
            //// 實朔望實時
            let { Sunperi: SunperiHahBef, SunOrbit: SunOrbitHahBef, SunCorr: SunCorrHahBef, SunLongi: SunLongiHahBef, SunGong: SunGongHahBef } = SunGuimao(AvgacrSolsmorDifMidn + AvgacrDeci[i] - 0.5 / 24) // （如實望泛時爲丑正二刻，則以丑正初刻爲前時，寅初初刻爲後時）——為什麼不說前後一時呢
            const { MoonLongi: MoonLongiHahBef } = MoonGuimao(AvgacrSolsmorDifMidn + AvgacrDeci[i] - 0.5 / 24, SunperiHahBef, SunOrbitHahBef, SunCorrHahBef, SunGongHahBef)
            SunLongiHahBef += isNewm ? 0 : 180
            SunLongiHahBef %= 360
            let { Sunperi: SunperiHahAft, SunOrbit: SunOrbitHahAft, SunCorr: SunCorrHahAft, SunLongi: SunLongiHahAft, SunGong: SunGongHahAft } = SunGuimao(AvgacrSolsmorDifMidn + AvgacrDeci[i] + 0.5 / 24)
            const { MoonLongi: MoonLongiHahAft } = MoonGuimao(AvgacrSolsmorDifMidn + AvgacrDeci[i] + 0.5 / 24, SunperiHahAft, SunOrbitHahAft, SunCorrHahAft, SunGongHahAft)
            SunLongiHahAft += isNewm ? 0 : 180
            SunLongiHahAft %= 360
            AcracrDeci[i] = AvgacrDeci[i] - 0.5 / 24 + (SunLongiHahBef - MoonLongiHahBef) / (t(MoonLongiHahAft - MoonLongiHahBef) - t(SunLongiHahAft - SunLongiHahBef)) * 0.5 / 24 // 一小時月距日實行
            const AcracrSolsmorDif = AvgacrSolsmorDifMidn + AcracrDeci[i] // 實朔實時距冬至次日的時間
            const { Sunperi: AcracrSunperi, SunOrbit: AcracrSunOrbit, SunCorr: AcracrSunCorr, SunGong: AcracrSunGong, SunLongi: AcracrSunLongi } = SunGuimao(AcracrSolsmorDif)
            const { Whitelongi: AcracrWhitelongi, MoonLongi: AcracrMoonLongi } = MoonGuimao(AcracrSolsmorDif, AcracrSunperi, AcracrSunOrbit, AcracrSunCorr, AcracrSunGong)
            /////////////////// 推交食
            let isEclipse = false // 入食限可以入算
            const tmp = t3(AcracrWhitelongi) // 距離0、180的度數            
            if (isNewm) isEclipse = AcracrWhitelongi % 180 < 180 ? tmp < SunLimitYinAcr : tmp < SunLimitYangAcr
            else isEclipse = tmp < MoonLimit
            if (isEclipse) {
                if (isNewm) SunEcliGuimao(AcracrSunCorr, AcracrSolsmorDif, AcracrSunLongi)
                else MoonEcliGuimao(AcracrSunCorr, AcracrSunLongi)
            }
            ///////////////////// 推節氣。用下編之平氣推定氣法
            if (isNewm) {
                const AvgTermSolsmorDif = SolsDeci + i * TermLeng - 1
                TermSc[i] = ScList[(SolsmorScOrder + ~~AvgTermSolsmorDif) % 60]
                TermDeci[i] = deci(AvgTermSolsmorDif)
                const TermSunperiMidn = SunperiThisyear + SunperiDV * ~~AvgTermSolsmorDif + SunperiConst
                const TermSunCorr = SunCorrGuimao(i * 30 - TermSunperiMidn)
                const AvgacrTermSolsmorDif = AvgTermSolsmorDif - TermSunCorr / SunAvgDV
                TermAcrDeci[i] = deci(AvgacrTermSolsmorDif)
                TermAcrSc[i] = ScList[(SolsmorScOrder + ~~AvgacrTermSolsmorDif) % 60]
                // const AvgacrTermSun = SunGuimao(AvgacrTermSolsmorDif).SunGong
                // const AcracrTermSolsmorDif = AvgacrTermSolsmorDif + ((i * 30 - AvgacrTermSun) / SunAvgDV)  // 1889年1月20日大寒定氣，現代精確丙申1507，癸卯元曆算得丙申1354（誤差1.5刻），如果再加上我的迭代一步，得1566（誤差0.5刻）                
                // 推節氣用時法（詳日躔曆理時差篇）——略
                // 推各省節氣時刻法——略。
                // 推日出入晝夜時刻法 ⚠️待補                
            }
        }
        return { AvgSc, AvgDeci, AvgacrSc, AvgacrDeci, AcracrDeci, TermSc, TermDeci, TermAcrSc, TermAcrDeci }
    }
    const {
        AvgSc, AvgDeci, AvgacrSc, AvgacrDeci, AcracrDeci, TermSc, TermDeci, TermAcrSc, TermAcrDeci
    } = AutoNewmSyzygy(true)
    return
}
console.log(cal("Guimao", 1730)) // 《後編》卷三《日食食甚真時及兩心視相距》，葉64：雍正八年庚戌（1729）六月戊戌朔，太陰實引初宮8°47′31.40″，地平地半徑差53′59.90秒，本日地平高下差53′49.90″。本時日距緯21°38′12.02″。本時黃赤二經交角9°21′20.57″。食甚用時午正2刻9′58.95″=0.527765625。用時赤經高弧交角22°43′8.39″。

// console.log(SunGuimao(313)) // 日躔與這個驗算無誤 https://zhuanlan.zhihu.com/p/526578717 算例：SolsmorDif=313，SunRoot=0+38/60+26.223/3600，SunperiThisyear=166*(1/60+2.9975/3600)
// 月離與這個驗算無誤 https://zhuanlan.zhihu.com/p/527394104
// SunOrbit = 298 + 6 / 60 + 9.329 / 3600
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

// console.log(atan(cos(23.9) * tan((340))))


