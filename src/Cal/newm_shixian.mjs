// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import Para from './para_calendars.mjs'
import { ScList, deci } from './para_constant.mjs'
import { Gong2Mansion } from './astronomy_other.mjs'
const abs = x => Math.abs(x)
const sign = x => Math.sign(x)
const pi = Math.PI
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = x => Math.sin(d2r(x))//.toFixed(8) // 數理精蘊附八線表用的是七位小數
const cos = x => Math.cos(d2r(x))//.toFixed(8)
const tan = x => Math.tan(d2r(x))//.toFixed(8)
const cot = x => (1 / Math.tan(d2r(x)))//.toFixed(8)
const asin = x => r2d(Math.asin(x))//.toFixed(8)
// const acos = x => r2d(Math.acos(x))//.toFixed(8)
const atan = x => r2d(Math.atan(x))//.toFixed(8)
const acot = x => (90 - r2d(Math.atan(x)))//.toFixed(8)
// console.log(acos(0.8660254))
const versin = x => (1 - Math.cos(d2r(x)))//.toFixed(8) // 正矢
const sqr = x => Math.sqrt(x)
const t = x => (x % 360 + 360) % 360
const t1 = x => abs(180 - x % 360) // x不及半周者，与半周相减；过半周者，减半周。——與180的距離
const t2 = x => Math.min(x % 360, 360 - x % 360) // x不及半周者，仍之；過半周者，與全周相減。——與0的距離
const t3 = x => 90 - abs(90 - x % 180) // x过一象限者，与半周相减；过半周者，减半周；过三象限者，与全周相减。——與0、180的距離
const f1 = x => x % 360 > 180 ? 1 : -1// 不及半周为减，过半周为加。
const f2 = x => x % 360 > 180 ? -1 : 1
const f3 = x => x % 360 % 180 > 90 ? 1 : -1 // 一、三象限加，二、四象限減
const LongiHigh2Low = (e, x) => ~~(Math.ceil(x / 90) / 2) * 180 + atan(cos(e) * tan(x)) // 傾角、經度，用於黃轉赤，白轉黃
const LongiLow2High = (e, x) => Math.ceil(Math.ceil(x / 90) / 2) * 180 - 90 - atan(cos(e) * cot(x)) // 赤轉黃，黃轉白
const HighLongi2LowLati = (e, x) => asin(sin(e) * sin(x)) // 月距正交轉黃緯
// const LowLongi2LowLati = (e, x) => atan(tan(e) * sin(x)) // 求赤經高弧交角用到這個的變形
// const LowLati2HighLongi = (e, x) => // 已知太陽赤緯轉黃經
// console.log(HighLongi2LowLati(23 + 29 / 60,112.28487818))
// console.log(LowLati2HighLongi(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=0.3973413465. HAB=23.41207808
// 切線分外角法，見梅文鼎三角法舉要卷二。兩邊的輸入順序無所謂。已知邊角邊，求另外兩角。
const qiexian = (a, b, x) => {
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
    // const c = sqr(a ** 2 + b ** 2 - 2 * a * b * cos(180 - abs(180 - x)))
    // return asin(vertical / c)
}
const qiexianA = (a, b, x) => { // 固定返回a邊對角
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
const qiexianSphere = (a, b, AngCTime) => {
    const AngC = abs(0.5 - deci(AngCTime)) * 15 * 24   // 用時太陽距午赤道度
    const b1 = LongiHigh2Low(AngC, a) // 距極分邊
    const b2 = b - b1  // 自天頂作垂線，得距極分邊，再與太陽距極相加減，得距日分邊。距午度<90度，垂線在三角形內，相減，>90相加。            
    const tanH = tan(AngC) * sin(b1) // 垂弧之正切
    const AngA = (deci(AngCTime) < 0.5 ? 1 : -1) * (atan(tanH / sin(b2)) + 180) % 180 // 用時赤經高弧交角。若距極分邊轉大於太陽距北極，則所得爲外角，與半周相減。午前赤經在高弧東，午後赤經在高弧西。
    // const c = asin(sin(AngC) * sina / sin(abs(AngA))) // 用時太陽距天頂
    const c = LongiLow2High(AngA, b2) // 我的等效算法。經實驗，如果三角函數取小數點後8位，20.12486241，本來是20.1248526178365
    return { AngA, c }
}

// 121.5759805556
// console.log(qiexian(57.5, 1.5, abs(180 -  121.5759805556 * 2)).Ashort)
// console.log(qiexian(0.0117315, 0.0550505,  53.812).Ashort)
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
// 以下分別是月離算法和日食算法求日地距離，不知為何用不同方法。
const dist2 = (deg, c2) => { // 目前未加條件判斷，只適合近地點起算的太陽。已知橢圓某點角度、橢圓倍兩心差，求距地心長度。像日躔曆理以角求積那樣，日在辛，地在甲，另一焦點丙，延長辛甲到壬，丙壬⊥辛壬。甲辛=x，(2-x)^2=丙壬^2+(甲壬+x)^2。
    const jiaren = cos(deg) * c2 // 分股
    const bingren = sin(deg) * c2 // 勾    
    const gouxianSum = 2 + jiaren // 勾弦和
    const gouxianDif = bingren ** 2 / gouxianSum // 勾弦較
    const xian = (gouxianSum + gouxianDif) / 2 // 弦
    return +(2 - xian).toFixed(7)
    // return (4 - bingren ** 2 - jiaren ** 2) / (2 * jiaren + 4) // 我自己的算法 
}
const dist = (deg, c2) => { // 作垂線成兩勾股法，小股y=(4*x-4-c2**2)/(2*c2)，c2+y=cos(deg)*x
    let x = 0
    if (c2 < 0.034) { // 太陽從近地點起算
        if (deg > 90 && deg < 270) x = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cos(t3(deg)))
        else x = (4 - c2 ** 2) / (4 + 2 * c2 * cos(t3(deg)))
    } else { // 月亮從遠地點起算
        if (deg > 90 && deg < 270) x = (4 - c2 ** 2) / (4 + 2 * c2 * cos(t3(deg)))
        else x = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cos(t3(deg)))
    }
    return +x.toFixed(7)
}
// console.log(dist(180, 0.066782*2))
// console.log(dist2(324, 0.0538))
const sunCorrGuimao = xRaw => { // 大徑1、小徑0.999857185、avg中率0.999928589、兩心差（焦距）。中距盈縮差1°56′12″。
    xRaw = (+xRaw + 360) % 360
    const x = xRaw % 180
    const xMirror = t3(x)
    // 求對甲丙倍差之午角：作輔助線延長丙午到寅。丙寅=甲午+丙午=2a，求得∠寅，橢圓界角∠午=2*∠寅。    
    const Awu = 2 * qiexian(0.0338000, 2, xRaw).Ashort
    // 求橢圓差角未丙午，見上文葉37條    
    const Aweibingwu = xMirror - atan(0.999857185 * tan(xMirror))
    let flag1 = 1, flag2 = 1
    if (x > 90) flag1 = -1
    if (xRaw > 180) flag2 = -1
    return flag2 * (Awu + flag1 * Aweibingwu)
}
const riseQing = (Longi, Obliquity, BeijingLati) => 0.25 + (Longi < 180 ? -1 : 1) * (asin(tan(abs(HighLongi2LowLati(Obliquity, Longi)) * tan(BeijingLati))) / 360) // 日出時刻。這個經度應該是正午的經度
export default (CalName, Y) => {
    // const cal = (CalName, Y) => {
    const { CloseOriginAd, Solar, Lunar, ChouConst, SolsConst, SunperiConst, SunperiYV, SunperiDV, SunAvgDV, MoonAvgDV, MoonapoDV, NodeDV, MoonConst, MoonapoConst, NodeConst, SunLimitYinAcr, SunLimitYangAcr, MoonLimit, Obliquity, ObliqmoonMax, ObliqmoonMin, BeijingLati } = Para[CalName]
    const TermLeng = Solar / 12
    const CloseOriginYear = abs(Y - CloseOriginAd) // 積年
    const OriginAccum = +(CloseOriginYear * Solar).toFixed(9) // 中積
    const SolsAccum = Y > CloseOriginAd ? OriginAccum + SolsConst : OriginAccum - SolsConst // 通積分。
    const Sols = +(Y > CloseOriginAd ? SolsAccum % 60 : 60 - SolsAccum % 60).toFixed(9)
    const SolsDeci = deci(Sols) // 冬至小數
    const SolsmorScOrder = (~~Sols + 2) % 60 // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）Solsmor: winter solstice tomorrow 冬至次日子正初刻
    const SunRoot = (1 - SolsDeci) * SunAvgDV // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。    
    const DayAccum = Y > CloseOriginAd ? OriginAccum + deci(SolsConst) - SolsDeci : OriginAccum - deci(SolsConst) + SolsDeci // 積日（曆元冬至次日到所求天正冬至次日的日數，等於算式的曆元冬至當日到所求冬至當日日數）    
    const ChouAccum = Y > CloseOriginAd ? DayAccum - ChouConst : DayAccum + ChouConst // 通朔
    // const LunarNum = Y > CloseOriginAd ? ~~(ChouAccum / Lunar) + 1 : ~~(ChouAccum / Lunar) // 積朔。似乎+1是為了到十二月首朔
    const ChouSd = Y > CloseOriginAd ? (Lunar - ChouAccum % Lunar) % Lunar : ChouAccum % Lunar // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔。Sd：某時刻距離冬至次日子正的時間
    // const LunarNumWhitelongi = LunarNum * MoonNodeMS // 積朔太陰交周
    // const ChouWhitelongi = Y > CloseOriginAd ? LunarNumWhitelongi + ChouWhitelongiConst : ChouWhitelongiConst - LunarNumWhitelongi // 首朔太陰交周
    const MoonRoot = Y > CloseOriginAd ? MoonConst + DayAccum * MoonAvgDV : MoonConst - DayAccum * MoonAvgDV // 太陰年根    
    const MoonapoRoot = Y > CloseOriginAd ? DayAccum * MoonapoDV + MoonapoConst : MoonapoConst - DayAccum * MoonapoDV  // 最高年根
    const NodeRoot = Y > CloseOriginAd ? NodeConst - DayAccum * NodeDV : NodeConst + DayAccum * NodeDV // 正交年根，所得爲白經
    // const OriginAccumMansion = OriginAccum + MansionDayConst // 通積宿
    // const Mansion = (OriginAccumMansion % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
    const SunperiThisyear = Y > CloseOriginAd ? SunperiYV * CloseOriginYear : -SunperiYV * CloseOriginYear // 本年最卑行    
    /////////// 推日躔 //////////
    const sunGuimao = Sd => {
        const AvgSun = Sd * SunAvgDV + SunRoot // 平行：以年根與日數相加，得平行。// 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
        const Sunperi = SunperiConst + SunperiDV * Sd + SunperiThisyear // 最卑平行
        const SunOrbit = t(AvgSun - Sunperi) // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
        const SunCorr = sunCorrGuimao(SunOrbit)
        const SunGong = t(AvgSun + SunCorr) // 實行
        const SunLongi = (SunGong + 270) % 360 // 黃道度
        return { SunOrbit, SunCorr, SunLongi, SunGong, Sunperi }
    }
    /////////// 推月離 //////////
    const moonGuimao = (Sd, Sunperi, SunOrbit, SunCorr, SunGong) => {
        const SunCorrMax = 1 + 56 / 60 + 13 / 3600 // 太陽最大均數
        const AvgMoonCorr1Max = 11 / 60 + 50 / 3600 // 太陰最大一平均
        const AvgMoonapoCorrMax = 19 / 60 + 56 / 3600 // 最高最大平均
        const AvgNodeCorrMax = 9 / 60 + 30 / 3600 // 正交最大平均
        const AvgMoonCorr2ApogeeMax = 3 / 60 + 34 / 3600 // 太陽在最高時之太陰最大二平均
        const AvgMoonCorr2PerigeeMax = 3 / 60 + 56 / 3600 // 太陽在最卑時之太陰最大二平均
        const AvgMoonCorr3Max = 47 / 3600 // 最大三平均
        const MoonCorr2ApogeeMax = 33 / 60 + 14 / 3600 // 太陽在最高時之最大二均
        const MoonCorr2PerigeeMax = 37 / 60 + 11 / 3600// 太陽在最卑時之最大二均
        const MoonCorr3Max = 2 / 60 + 25 / 3600 // 最大三均
        const MoonCorr4MaxList = [0, 61 / 3600, 67 / 3600, 76 / 3600, 88 / 3600, 103 / 3600, 120 / 3600, 139 / 3600, 159 / 3600, 180 / 3600] // 兩弦最大末均以10度爲率，依次為日月最高相距0、10、20⋯⋯90度。為何0-10有一個突然的陡坡？見廖育棟文檔附錄2        
        //////// 平行
        const AvgMoon1 = t(MoonRoot + Sd * MoonAvgDV) // 太陰平行        
        const AvgMoonapo1 = t(MoonapoRoot + Sd * MoonapoDV) // 最高平行
        const AvgNode1 = t(NodeRoot - Sd * NodeDV) // 正交平行
        const AvgMoon2 = AvgMoon1 - SunCorr / SunCorrMax * AvgMoonCorr1Max // 二平行=太陰平行+-一平均：子正初刻用時之太陰平行。一平均（考慮地球自轉的時間）已有均數時差，而止就黃道算，故不用升度時差。一平均：太阳均数加者为减，减者为加。
        const AvgMoonapo = AvgMoonapo1 + SunCorr / SunCorrMax * AvgMoonapoCorrMax  // 用最高=最高平行+-最高平均
        const AvgNode = AvgNode1 - SunCorr / SunCorrMax * AvgNodeCorrMax// 用正交=正交平行+-正交平均
        const SunMoonapoDif = t(SunGong - AvgMoonapo) // 日距月最高
        const SunNodeDif = t(SunGong - AvgNode) // 日距正交        
        const SunDist = dist2(SunOrbit + SunCorr, 0.0338000) // 日距地心。
        const TubedDif = (1.0169000 ** 3 - SunDist ** 3) / 0.101410  // 求立方較,太阳最高距地心数之立方。這裡再除以太陽高卑距地之立方大較 (10000000+169000)**3-(10000000-169000)**3
        const AvgMoonCorr2Apogee = abs(sin(SunMoonapoDif * 2) * AvgMoonCorr2ApogeeMax) // 太陽在最高時日距月最高之二平均
        const AvgMoonCorr2Perigee = abs(sin(SunMoonapoDif * 2) * AvgMoonCorr2PerigeeMax)
        const AvgMoonCorr2 = f1(SunMoonapoDif * 2) * (abs(AvgMoonCorr2Apogee - AvgMoonCorr2Perigee) * TubedDif + AvgMoonCorr2Apogee) // 本時之二平均。日距月最高倍度不及半周为减，过半周为加。
        const AvgMoonCorr3 = -sin(2 * SunNodeDif) * AvgMoonCorr3Max // 日距正交倍度不及半周为减，过半周为加。
        const AvgMoon = AvgMoon2 + AvgMoonCorr2 + AvgMoonCorr3 // 用平行                
        const AcrMoonapoCorr = f2(SunMoonapoDif * 2) * qiexian(0.0117315, 0.0550505, t1(SunMoonapoDif * 2)).Ashort // 求最高實均。最高本輪半徑550505，最高均輪半徑117315。日距月最高之倍度与半周相减，馀为所夹之角。日距月最高倍度不及半周者，与半周相减；过半周者，减半周。日距月最高倍度不及半周为加，过半周为减。
        const MoonLco = abs(0.0117315 * sin(t2(SunMoonapoDif * 2)) / sin(AcrMoonapoCorr)) // 本天心距地：本時兩心差        
        const AcrMoonapo = AvgMoonapo + AcrMoonapoCorr // 最高實行
        const MoonOrbit = t(AvgMoon - AcrMoonapo) // 太陰引數=用平行-最高實行
        //////// 實行
        // 求初均（見月離曆理葉28）
        const Ajiagengyi = qiexianA(MoonLco, 1, t1(MoonOrbit)) // 对两心差之小角.引数不及半周者，与半周相减。过半周者，则减半周。
        const Ayijiasi = qiexianA(1, MoonLco, Ajiagengyi + t1(MoonOrbit)) // 对半径之大角，为平圆引数        
        const MoonCorr1 = abs((atan(sqr(1 - MoonLco ** 2) * tan(Ayijiasi)) + 180) % 180 - t2(MoonOrbit)) * f1(MoonOrbit) // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加。        
        const AcrMoon1 = AvgMoon + MoonCorr1 // 初實行
        const MoonSunDif = t(AcrMoon1 - SunGong) // 月距日
        const MoonCorr2Apogee = abs(sin(MoonSunDif * 2) * MoonCorr2ApogeeMax) // 太陽最高時月距日之二均
        const MoonCorr2Perigee = abs(sin(MoonSunDif * 2) * MoonCorr2PerigeeMax) // 太陽最卑時月距日之二均        
        const MoonCorr2 = f2(MoonSunDif * 2) * abs((MoonCorr2Apogee - MoonCorr2Perigee) * TubedDif + MoonCorr2Apogee) // 本時之二均。月距日倍度不及半周为加，过半周为减。
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
        //////// 黃白差
        const AcrNodeCorr = f2(SunNodeDif * 2) * qiexian(57.5, 1.5, t1(SunNodeDif * 2)).Ashort // 正交實均。日距正交倍度过半周者，与半周相减，用其馀。日距正交倍度不及半周为加，过半周为减。
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
        //////// 黃道宿度。用到黃道宿鈐。待定。
        return { AcrNode, Whitegong, Whitelongi, MoonGong, MoonLongi, MoonLati, Obliqmoon, MoonOrbit, MoonCorr1, MoonLco }
    }
    const timeDif = (AcrSunCorr, AcrSunLongi) => { // 時差總
        const SunCorrTcorr = -AcrSunCorr / 360 // 均數時差。以實望太陽均數變時。均數加者則爲減。
        const EclpEquaDifTcorr = (AcrSunLongi - LongiHigh2Low(Obliquity, AcrSunLongi)) / 360 // 升度時差。二分後爲加，二至後爲減。
        return SunCorrTcorr + EclpEquaDifTcorr
    }
    const sunEcliGuimao = (NowSd, AcrSunLongi) => {
        // NowSd = 205.528185 // ⚠️1730算例臨時
        //////// 【一】實朔用時。用時的英語暫且用Now
        const Rise = riseQing(AcrSunLongi, Obliquity, BeijingLati)
        if (deci(NowSd) < Rise - 5 / 96 || deci(NowSd) > 1 - Rise + 5 / 96) return  // 日出前日入後五刻以內可以見食
        else {
            //////// 【二】食甚實緯、食甚用時。這一段日月食都一樣
            const SunNow = sunGuimao(NowSd)
            const SunOnehAft = sunGuimao(NowSd + 1 / 24)
            const MoonNow = moonGuimao(NowSd, SunNow.Sunperi, SunNow.SunOrbit, SunNow.SunCorr, SunNow.SunGong)
            const MoonOnehAft = moonGuimao(NowSd + 1 / 24, SunOnehAft.Sunperi, SunOnehAft.SunOrbit, SunOnehAft.SunCorr, SunOnehAft.SunGong)
            // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
            const AngEquilibriumWhite = qiexian(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Obliqmoon).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
            const AngEquilibriumEclp = MoonNow.Obliqmoon + AngEquilibriumWhite // 斜距黃道交角
            const DistrealAvg = abs(cos(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
            const EquilibriumDV = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Obliqmoon) / sin(AngEquilibriumWhite) * 24 // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA。此處我*24，從一小時速度變成一天                 
            const ArcTotalNow = abs(sin(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚距弧
            const TotalNowDif = f3(MoonNow.Whitelongi) * ArcTotalNow / EquilibriumDV // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
            const SdAvg = NowSd + TotalNowDif // 食甚用時
            // const SdAvg = 205.527765625 // ⚠️臨時
            const SunAvg = sunGuimao(SdAvg)
            const MoonAvg = moonGuimao(SdAvg, SunAvg.Sunperi, SunAvg.SunOrbit, SunAvg.SunCorr, SunAvg.SunGong)
            //////// 【三】地平高下差、日月視徑
            const AcrSunOrbit = SunNow.SunOrbit + SunAvg.SunCorr // 太陽實引：實朔引數+-本時太陽均數
            const AcrMoonOrbit = MoonNow.MoonOrbit + MoonAvg.MoonCorr1 // 太陰實引
            const MoonDist = dist(AcrMoonOrbit, MoonNow.MoonLco * 2)
            const HorizonParallax = 3450 / 3600 / MoonDist - 10 / 3600 // 地平高下差=太陰在地平上最大地半徑差（中距57分30秒）-太陽地半徑差
            const SunAcrRadius = (966 / 3600) / dist(AcrSunOrbit, 0.0338000) - 15 / 3600 // 太陽實半徑=太陽視半徑（中率16分6秒）-光分15秒
            const MoonRadius = (940.5 / 3600) / MoonDist // 太陰視半徑（中率15分40秒30微）
            const RadiusSum = SunAcrRadius + MoonRadius // 併徑
            //////// 【四】食甚太陽黃赤經緯宿度、黃赤二經交角            
            const TotalSunLongi = t(SunAvg.SunLongi + TotalNowDif * (SunOnehAft.SunGong - SunAvg.SunGong) * 24) // 食甚太陽黃道經度=實朔太陽黃道實行+距時日實行
            const TotalSunEquaLongi = LongiHigh2Low(Obliquity, TotalSunLongi)
            const TotalSunEquaGong = (TotalSunEquaLongi + 90) % 360 // 自冬至初宮起算，得食甚太陽赤道經度。
            const TotalSunEquaLati = HighLongi2LowLati(Obliquity, TotalSunLongi) // 食甚太陽赤道緯度。食甚太陽距春秋分黃經之正弦：三率。
            const AngSunPolar = 90 - TotalSunEquaLati // 太陽距北極
            const AngZenithPolar = 90 - BeijingLati // 北極距天頂
            const AngEclpEqua = (TotalSunEquaGong > 180 ? 180 : 0) - acot(cot(Obliquity) / cos(TotalSunLongi)) // 黃赤二經交角。自變量：太陽距春秋分黃經。冬至後黃經在赤經西，夏至後黃經在赤經東。⚠️我定義東正西負。此步已核驗
            const AngWhiteEclp = (MoonAvg.Whitelongi < 90 || MoonAvg.Whitelongi > 270 ? -1 : 1) * AngEquilibriumEclp // 實朔月距正交初宮十一宮，白經在黃經西，五宮六宮白經在黃經東
            const AngWhiteEqua = AngEclpEqua + AngWhiteEclp // 赤白二經交角。所得爲白經在赤經之東西。
            //////// 【五】食甚用時兩心視距
            const flag3 = (AngWhiteHigharcAcr0, FlagDistrealAsm, FlagDistrealAcr0, AngWhiteHigharcAsm, AngDistrealAsm) => {
                let flag = 1
                if (abs(AngWhiteHigharcAcr0) > 180) throw new Error("真時白經高弧交角大於180")
                else if (abs(AngWhiteHigharcAcr0) < 90) {
                    if (MoonAvg.Whitelongi < 180) {
                        if (FlagDistrealAsm !== FlagDistrealAcr0) flag = -1
                        else {
                            if (sign(AngWhiteHigharcAcr0) !== FlagDistrealAcr0) {
                                if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1 // 設時白經高弧交角小則加，大則減。⚠️暫定「小」是小於設時對實距角
                            } else {
                                if (abs(AngWhiteHigharcAsm) < AngDistrealAsm) flag = -1
                            }
                        }
                    } else {
                        if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1
                    }
                } else {
                    if (MoonAvg.Whitelongi > 180) {
                        if (FlagDistrealAsm !== FlagDistrealAcr0) flag = -1
                        else {
                            if (sign(AngWhiteHigharcAcr0) !== FlagDistrealAcr0) {
                                if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1
                            } else {
                                if (abs(AngWhiteHigharcAsm) < AngDistrealAsm) flag = -1
                            }
                        }
                    } else {
                        if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1
                    }
                }
                return flag
            } // 見符號7
            const distAppa = (Sd, Distreal, AngArc) => {
                AngArc = abs(AngArc) || 0
                const { AngA: AngEquaHigharc, c: AngSunZenith } = qiexianSphere(AngZenithPolar, AngSunPolar, Sd)   // 赤經高弧交角
                const Parallax = HorizonParallax * sin(AngSunZenith) // 高下差
                const AngWhiteHigharc = AngEquaHigharc + AngWhiteEqua // 白經高弧交角
                let AngDistappa = abs(AngWhiteHigharc) - AngArc // 對兩心視距角
                let FlagDistreal = 1
                if (abs(AngWhiteHigharc) > 180) throw new Error("白經高弧交角大於180")
                else if (abs(AngWhiteHigharc) < 90) {
                    if (MoonAvg.Whitelongi < 180) {
                        if (AngDistappa > 0) FlagDistreal = sign(AngWhiteHigharc)
                        else FlagDistreal = -sign(AngWhiteHigharc)
                    } else {
                        AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc)
                        FlagDistreal = -sign(AngWhiteHigharc)
                    }
                } else {
                    if (MoonAvg.Whitelongi > 180) {
                        if (AngDistappa > 0) FlagDistreal = sign(AngWhiteHigharc)
                        else FlagDistreal = -sign(AngWhiteHigharc)
                    } else {
                        AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc)
                        FlagDistreal = -sign(AngWhiteHigharc)
                    }
                }
                AngDistappa = abs(AngDistappa)
                const AngDistreal = qiexianA(Distreal, Parallax, AngDistappa) // 對兩心實距角
                const Distappa = abs(sin(AngDistappa) * Distreal / sin(AngDistreal)) // 兩心視距
                return { AngWhiteHigharc, FlagDistreal, AngDistreal, Distappa }
            }
            const distAppa2 = (Sd, Distreal, AngArc, flag) => {
                AngArc = abs(AngArc) || 0
                const { AngA: AngEquaHigharc, c: AngSunZenith } = qiexianSphere(AngZenithPolar, AngSunPolar, Sd)   // 赤經高弧交角
                const Parallax = HorizonParallax * sin(AngSunZenith) // 高下差
                const AngWhiteHigharc = AngEquaHigharc + AngWhiteEqua // 白經高弧交角
                let AngDistappa = abs(AngWhiteHigharc) + AngArc // 對兩心視距角
                if (abs(AngWhiteHigharc) > 180) throw new Error("白經高弧交角大於180")
                else if (abs(AngWhiteHigharc) < 90) {
                    if (MoonAvg.Whitelongi < 180) {
                        if (sign(AngWhiteHigharc) !== flag) AngDistappa = abs(AngWhiteHigharc) - AngArc
                    } else {
                        if (sign(AngWhiteHigharc) === flag) AngDistappa = 180 - (abs(AngWhiteHigharc) - AngArc)
                        else if (sign(AngWhiteHigharc) !== flag) AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc)
                    }
                } else {
                    if (MoonAvg.Whitelongi > 180) {
                        if (sign(AngWhiteHigharc) !== flag) AngDistappa = abs(AngWhiteHigharc) - AngArc
                    } else {
                        if (sign(AngWhiteHigharc) === flag) AngDistappa = 180 - (abs(AngWhiteHigharc) - AngArc)
                        else if (sign(AngWhiteHigharc) !== flag) AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc)
                    }
                }
                AngDistappa = abs(AngDistappa)
                const AngDistreal = qiexianA(Distreal, Parallax, AngDistappa) // 對兩心實距角
                return abs(sin(AngDistappa) * Distreal / sin(AngDistreal)) // 兩心視距
            }
            const { AngWhiteHigharc: AngWhiteHigharcAvg, FlagDistreal: FlagDistrealAvg, AngDistreal: AngDistrealAvg, Distappa: DistappaAvg } = distAppa(SdAvg, DistrealAvg) // 見符號3
            //////// 【六】食甚設時兩心視距、食甚真時
            const AsmAvgDif = -(AngWhiteHigharcAvg / 180 * 8.8 / 96 + 0.2 / 96) // 設時距分
            // const AsmAvgDif = (20 / 60 + 1.05 / 3600) / 24 // ⚠️
            const SdAsm = SdAvg + AsmAvgDif // 食甚設時。東向前取，西向後取，角大遠取，角小近取（遠不過九刻，近或數分）
            // const SdAsm = 205 + 13 / 24 // ⚠️
            const ArcAvgAsm = EquilibriumDV * AsmAvgDif // 設時距弧
            const AngArcAvgAsm = atan(ArcAvgAsm / DistrealAvg) // 設時對距弧角
            const DistrealAsm = abs(ArcAvgAsm / sin(AngArcAvgAsm)) // 設時兩心實距            
            const { AngWhiteHigharc: AngWhiteHigharcAsm, FlagDistreal: FlagDistrealAsm, AngDistreal: AngDistrealAsm, Distappa: DistappaAsm } = distAppa(SdAsm, DistrealAsm, AngArcAvgAsm) // 見符號4
            const AngHigharcAsm_DistappaAvg = abs(abs(AngWhiteHigharcAsm - AngWhiteHigharcAvg) + (SunAvg.SunLongi < 180 ? -1 : 1) * AngDistrealAvg) // 設時高弧交用時視距角
            let flag2 = 1, flag4 = 1, flag5 = 1, flag6 = 1
            if (FlagDistrealAsm === FlagDistrealAvg) flag2 = -1 // 見符號5
            const AngDistMovingAsm = t2(abs(AngHigharcAsm_DistappaAvg + flag2 * AngDistrealAsm)) // 對設時視行角
            const AngDistappaAsm = qiexianA(DistappaAsm, DistappaAvg, AngDistMovingAsm) // 對設時視距角
            const DistMovingAsm = sin(AngDistMovingAsm) / sin(AngDistappaAsm) * DistappaAsm // 設時視行
            const DistMovingAcr0 = DistappaAvg * cos(AngDistappaAsm)   // 真時視行
            const Acr0AvgDif = -sign(AngWhiteHigharcAvg) * abs(DistMovingAcr0 * AsmAvgDif / DistMovingAsm) // 真時距分
            const SdAcr0 = SdAvg + Acr0AvgDif // 食甚真時
            //////// 【七】食甚考定真時、食分
            const ArcAcr0AvgDif = Acr0AvgDif * EquilibriumDV // 真時距弧            
            const AngArcAvgAcr0 = atan(ArcAcr0AvgDif / DistrealAvg) // 真時對距弧角
            const DistrealAcr0 = abs(ArcAcr0AvgDif / sin(AngArcAvgAcr0)) // 真時兩心實距
            const { AngWhiteHigharc: AngWhiteHigharcAcr0, FlagDistreal: FlagDistrealAcr0, AngDistreal: AngDistrealAcr0, Distappa: DistappaAcr1 } = distAppa(SdAcr0, DistrealAcr0, AngArcAvgAcr0) // 真時對視距角法與設時同
            const AngHigharcAcr0_DistappaAsm = abs(abs(AngWhiteHigharcAcr0 - AngWhiteHigharcAsm) + flag3(AngWhiteHigharcAcr0, FlagDistrealAsm, FlagDistrealAcr0, AngWhiteHigharcAsm, AngDistrealAsm) * AngDistrealAsm) // 真時高弧交設時視距角
            if (FlagDistrealAcr0 === FlagDistrealAsm) flag4 = -1
            const AngDistMovingAcr1 = t2(abs(AngHigharcAcr0_DistappaAsm + flag4 * AngDistrealAcr0)) // 對考真時視行角
            const AngDistappaAcr1 = qiexianA(DistappaAcr1, DistappaAsm, AngDistMovingAcr1) // 對考真時視距角
            const DistMovingAcr1 = sin(AngDistMovingAcr1) / sin(AngDistappaAcr1) * DistappaAcr1 // 考真時視行
            const DistMovingAcr = DistappaAsm * cos(AngDistappaAcr1) // 定真時視行
            const DistappaAcr = DistappaAsm * sin(AngDistappaAcr1) // 定真時兩心視距            
            let AcrAsmDif = DistMovingAcr * (abs(AsmAvgDif) - abs(Acr0AvgDif)) / DistMovingAcr1 // 定真時距分。白經在高弧東，設時距分小爲減；白經在高弧西，設時距分小爲加。
            if (AngWhiteHigharcAcr0 < 0) AcrAsmDif = -AcrAsmDif
            const SdAcr = SdAsm + AcrAsmDif
            const Magni = Math.round(100 * (RadiusSum - DistappaAcr) / (SunAcrRadius * 2))
            if (Magni < 2) return
            //////// 【八】初虧前設時兩心視距
            let SdBefStartAsm = 0, SdBefEndAsm = 0
            if (AngWhiteHigharcAcr0 < 0) {
                if (DistappaAvg < RadiusSum) flag5 = -1
                SdBefStartAsm = SdAvg + flag5 * (abs(DistappaAvg - RadiusSum) / EquilibriumDV + 0.01) // 初虧前設時
                SdBefEndAsm = SdAcr + abs(SdBefStartAsm - SdAcr) // 復圓前設時
            } else {
                if (DistappaAvg > RadiusSum) flag5 = -1
                SdBefEndAsm = SdAvg + flag5 * (abs(DistappaAvg - RadiusSum) / EquilibriumDV + 0.01) // 復圓前設時
                SdBefStartAsm = SdAcr - abs(SdBefEndAsm - SdAcr) // 初虧前設時
            }
            // SdBefStartAsm = 205.46111111111 // ⚠️
            const startEnd = (SdBefStartAsm, isEnd) => {
                const AvgBefStartAsmDif = abs(SdAvg - SdBefStartAsm) // 初虧前設時距分
                const ArcBefStartAsm = AvgBefStartAsmDif * EquilibriumDV // 初虧前設時距弧
                const AngArcBefStartAsm = atan(ArcBefStartAsm / DistrealAvg) // 初虧前設時對距弧角
                let flagAngArcBefStartAsm = 1
                if (SdBefStartAsm < SdAvg) flagAngArcBefStartAsm = -1 // 初虧前設時在食甚用時前為西
                const DistrealBefStartAsm = ArcBefStartAsm / sin(AngArcBefStartAsm) // 初虧前設時兩心實距
                const DistappaBefStartAsm = distAppa2(SdBefStartAsm, DistrealBefStartAsm, AngArcBefStartAsm, flagAngArcBefStartAsm) // 見符號8
                //////// 【九】初虧後設時兩心視距
                if (DistappaBefStartAsm < RadiusSum) flag6 = -1
                const SdAftStartAsm = SdBefStartAsm + flag6 * (abs(DistappaBefStartAsm - RadiusSum) / EquilibriumDV + 0.003) // 初虧後設時
                // const SdAftStartAsm = 205.4638888889 // ⚠️
                const AvgAftStartAsmDif = abs(SdAvg - SdAftStartAsm)
                const ArcAftStartAsm = AvgAftStartAsmDif * EquilibriumDV // 初虧前設時距弧
                const AngArcAftStartAsm = atan(ArcAftStartAsm / DistrealAvg) // 初虧前設時對距弧角
                let flagAngArcAftStartAsm = 1
                if (SdAftStartAsm < SdAvg) flagAngArcAftStartAsm = -1 // 初虧前設時在食甚用時前為西
                const DistrealAftStartAsm = ArcAftStartAsm / sin(AngArcAftStartAsm) // 初虧前設時兩心實距
                const DistappaAftStartAsm = distAppa2(SdAftStartAsm, DistrealAftStartAsm, AngArcAftStartAsm, flagAngArcAftStartAsm)
                //////// 【十】初虧考定真時
                const StartDistappaDif = abs(DistappaBefStartAsm - DistappaAftStartAsm) // 初虧視距較
                const StartBefAftDif = abs(AvgBefStartAsmDif - AvgAftStartAsmDif) // 初虧設時較
                const StartDistappaRadiusSumDif = abs(RadiusSum - DistappaAftStartAsm) // 初虧視距併徑較
                let flag = DistappaAftStartAsm > RadiusSum ? 1 : -1
                if (isEnd) flag = -flag
                const AftStartAcrDif = flag * StartDistappaRadiusSumDif * StartBefAftDif / StartDistappaDif
                return SdAftStartAsm + AftStartAcrDif // 初虧真時。此處就不再迭代求定真時了，不用那麼麻煩
            }
            const SdStart = startEnd(SdBefStartAsm, false)
            //////// 【十一】復圓前設時兩心視距
            const SdEnd = startEnd(SdBefEndAsm, true)
            return { Start: deci(SdStart).toFixed(4).slice(2, 6), Total: deci(SdAcr).toFixed(4).slice(2, 6), End: deci(SdEnd).toFixed(4).slice(2, 6), Magni, Rise: Rise.toFixed(4).slice(2, 6), Sunset: (1 - Rise).toFixed(4).slice(2, 6) }
        }
    }
    const moonEcliGuimao = (NowSd, AcrSunLongi) => {
        //////// 【一】實望用時
        const Rise = riseQing(AcrSunLongi, Obliquity, BeijingLati)
        if (deci(NowSd) > Rise + 9 / 96 && deci(NowSd) < 1 - Rise - 9 / 96) return  // 日出入前後9刻以內入算
        else {
            //////// 【二】食甚實緯、食甚時刻
            const SunNow = sunGuimao(NowSd)
            const SunOnehAft = sunGuimao(NowSd + 1 / 24)
            const MoonNow = moonGuimao(NowSd, SunNow.Sunperi, SunNow.SunOrbit, SunNow.SunCorr, SunNow.SunGong)
            const MoonOnehAft = moonGuimao(NowSd + 1 / 24, SunOnehAft.Sunperi, SunOnehAft.SunOrbit, SunOnehAft.SunCorr, SunOnehAft.SunGong)
            // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
            const AngEquilibriumWhite = qiexian(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Obliqmoon).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
            const AngEquilibriumEclp = MoonNow.Obliqmoon + AngEquilibriumWhite // 斜距黃道交角
            const Dist = abs(cos(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
            const EquilibriumDV = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Obliqmoon) / sin(AngEquilibriumWhite) * 24 // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA                    
            const ArcTotalNow = abs(sin(AngEquilibriumEclp) * MoonNow.MoonLati) // 食甚距弧
            const TotalNowDif = (MoonNow.Whitelongi % 180 < 90 ? -1 : 1) * ArcTotalNow / EquilibriumDV // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
            const SdTotal = NowSd + TotalNowDif
            let Total = deci(SdTotal) // 食甚時刻
            const SunTotal = sunGuimao(SdTotal)
            const MoonTotal = moonGuimao(SdTotal, SunTotal.Sunperi, SunTotal.SunOrbit, SunTotal.SunCorr, SunTotal.SunGong)
            //////// 【三】食分
            const AcrMoonOrbit = MoonNow.MoonOrbit + MoonTotal.MoonCorr1
            const AcrSunOrbit = SunNow.SunOrbit + SunTotal.SunCorr
            const MoonDist = dist(AcrMoonOrbit, MoonNow.MoonLco * 2)
            const MoonParallax = (57 / 60 + 30 / 3600) / MoonDist // 太陰地半徑差。中距最大地半徑差 57分30秒。此一弧度代正弦算。
            const SunRadius = (966 / 3600) / dist(AcrSunOrbit, 0.0338000) // 太陽視半徑。中距太陽視半徑16分6秒
            const ShadowRadius = MoonParallax + 10 / 3600 - SunRadius + MoonParallax / 69 // 實影半徑=月半徑差+日半徑差-日半徑+影差。太陽地半徑差10秒。
            const MoonRadius = (940.5 / 3600) / MoonDist // 太陰視半徑
            const RadiusSum = MoonRadius + ShadowRadius // 併徑——也就是出現月食的最大極限
            // const RadiusDif = MoonRadius - ShadowRadius // 兩徑較
            const Magni = Math.round(100 * (RadiusSum - Dist) / (MoonRadius * 2)) // 若食甚實緯大於併徑，則月與地影不相切，則不食，即不必算。上編卷七：併徑大於距緯之較，即爲月食之分
            if (Magni < 2) return
            //////// 【四】初虧復圓時刻
            const ArcStartend = sqr((RadiusSum + Dist) * (RadiusSum - Dist)) // 初虧復圓距弧。就是直角三角形已知兩邊。
            const StarttoendTime = ArcStartend / EquilibriumDV // 初虧復圓距時            
            //////// 【五】食既生光時刻
            //////// 【六】食甚太陰黃道經緯宿度
            const LengTotalNow = TotalNowDif * (MoonOnehAft.Whitegong - MoonNow.Whitegong) * 24 // 距時月實行
            const TotalWhitelongi = MoonNow.Whitelongi + LengTotalNow // 食甚月距正交
            // const TotalEclpWhiteDif = TwoOrbitDif(MoonNow.Obliqmoon, TotalWhitelongi) // 黃白升度差。食甚距時加者亦爲加，減者亦爲減。⚠️我這裡符號用的食甚的月距正交，而非食甚距時所用的實望的月距正交。
            const TotalMoonGong = (LongiHigh2Low(MoonNow.Obliqmoon, TotalWhitelongi) + MoonNow.AcrNode) % 360 // 食甚太陰黃道經度
            const TotalMoonLongi = (TotalMoonGong + 270) % 360
            const TotalMoonLati = HighLongi2LowLati(MoonNow.Obliqmoon, TotalWhitelongi) // 食甚太陰黃道緯度，南北與食甚實緯同
            // const TotalMoonLati = sin(90 - AngEquilibriumEclp) * Dist // 這是食甚實緯之南北。
            //////// 【七】食甚太陰赤道經緯宿度
            const ObliqMoonEclp = (TotalMoonLati > 0 ? 1 : -1) * t3(acot(sin(t3(TotalMoonLongi)) * cot(TotalMoonLati))) // 太陰距二分弧與黃道交角。單獨算沒問題。近似成平面三角就可以了 sinAcotB=cotC，也就是a/r·r/h=a/h
            const ObliqMoonEqua = Obliquity + ObliqMoonEclp // 太陰距二分弧與赤道交角
            // 思路：黃轉白，白轉赤。
            const tanArcMoonEquinox = cos(ObliqMoonEclp) * tan(TotalMoonLongi) // 太陰距二分弧之正切線
            const TotalMoonEquaLongi = ~~(Math.ceil(TotalMoonLongi / 90) / 2) * 180 + atan(cos(ObliqMoonEqua) * tanArcMoonEquinox) // 太陰距二分赤道經度
            const TotalMoonEquaGong = (TotalMoonEquaLongi + 90) % 360
            const TotalMoonEquaLati = atan(tan(ObliqMoonEqua) * sin(t3(TotalMoonEquaLongi)))
            return { Start: deci((Total - StarttoendTime + 1) % 1).toFixed(4).slice(2, 6), End: deci(Total + StarttoendTime).toFixed(4).slice(2, 6), Total: Total.toFixed(4).slice(2, 6), Magni, TotalMoonLongi, TotalMoonLati, TotalMoonEquaLongi, TotalMoonEquaLati, Rise: Rise.toFixed(4).slice(2, 6), Sunset: (1 - Rise).toFixed(4).slice(2, 6) }
        }
    }
    const iteration = (x, step, isNewm) => { // 迭代求實朔實時
        let { Sunperi: SunperiBef, SunOrbit: SunOrbitBef, SunCorr: SunCorrBef, SunLongi: SunLongiBef, SunGong: SunGongBef } = sunGuimao(x - step) // 如實望泛時爲丑正二刻，則以丑正初刻爲前時，寅初初刻爲後時——為什麼不說前後一時呢
        const { MoonLongi: MoonLongiBef } = moonGuimao(x - step, SunperiBef, SunOrbitBef, SunCorrBef, SunGongBef)
        SunLongiBef += isNewm ? 0 : 180
        SunLongiBef %= 360
        let { Sunperi: SunperiAft, SunOrbit: SunOrbitAft, SunCorr: SunCorrAft, SunLongi: SunLongiAft, SunGong: SunGongAft } = sunGuimao(x + step)
        const { MoonLongi: MoonLongiAft } = moonGuimao(x + step, SunperiAft, SunOrbitAft, SunCorrAft, SunGongAft)
        SunLongiAft += isNewm ? 0 : 180
        SunLongiAft %= 360
        const Deci = deci(x) - step + t(SunLongiBef - MoonLongiBef) / (t(MoonLongiAft - MoonLongiBef) - t(SunLongiAft - SunLongiBef)) * step * 2 // 一小時月距日實行
        return ~~x + Deci // 實朔實時距冬至次日的時間
    }
    const AutoNewmSyzygy = (isNewm, LeapNumTerm) => {
        const AvgSc = [], AvgDeci = [], AcrSc = [], AcrDeci = [], NowSd = [], Eclp = [], TermSc = [], TermDeci = [], TermAcrSc = [], TermAcrDeci = [], NowTermSd = [], TermEclp = [], TermDuskstar = [], Ecli = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望
            const AvgSd = ChouSd + (1 + i - (isNewm ? 1 : 0.5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgSdMidn = ~~AvgSd
            AvgSc[i] = ScList[(SolsmorScOrder + AvgSdMidn) % 60]
            AvgDeci[i] = deci(AvgSd - AvgSdMidn).toFixed(4).slice(2, 6)
            //////// 實朔望泛時
            let { Sunperi: SunperiMidnToday, SunOrbit: SunOrbitMidnToday, SunCorr: SunCorrMidnToday, SunLongi: SunLongiMidnToday, SunGong: SunGongMidnToday } = sunGuimao(AvgSdMidn)
            const { MoonLongi: MoonLongiMidnToday } = moonGuimao(AvgSdMidn, SunperiMidnToday, SunOrbitMidnToday, SunCorrMidnToday, SunGongMidnToday)
            SunLongiMidnToday += isNewm ? 0 : 180
            SunLongiMidnToday %= 360
            let { Sunperi: SunperiMidnMorrow, SunOrbit: SunOrbitMidnMorrow, SunCorr: SunCorrMidnMorrow, SunLongi: SunLongiMidnMorrow, SunGong: SunGongMidnMorrow } = sunGuimao(AvgSdMidn + 1)
            const { MoonLongi: MoonLongiMidnMorrow } = moonGuimao(AvgSdMidn + 1, SunperiMidnMorrow, SunOrbitMidnMorrow, SunCorrMidnMorrow, SunGongMidnMorrow)
            SunLongiMidnMorrow += isNewm ? 0 : 180
            SunLongiMidnMorrow %= 360
            let Acr0SdMidn = AvgSdMidn, Acr0Deci = 0
            if (t(MoonLongiMidnToday - SunLongiMidnToday) > 180) {  // 如太陰實行未及太陽，則平朔日為實朔本日
                if (t(MoonLongiMidnMorrow - SunLongiMidnMorrow) > 180) { // 如次日太陰實行仍未及太陽，則次日爲實朔日
                    Acr0SdMidn = AvgSdMidn + 1
                    Acr0Deci = t(SunLongiMidnMorrow - MoonLongiMidnMorrow) / (t(MoonLongiMidnMorrow - MoonLongiMidnToday) - t(SunLongiMidnMorrow - SunLongiMidnToday))
                } else {
                    Acr0Deci = t(SunLongiMidnToday - MoonLongiMidnToday) / (t(MoonLongiMidnMorrow - MoonLongiMidnToday) - t(SunLongiMidnMorrow - SunLongiMidnToday)) // 分子：一日之月距日實行：三率，分母：一日之月實行與一日之日實行相減，爲一日之月距日實行：一率。實際上是t=s/v
                }
            } else { // 如太陰實行已過太陽，則平朔前一日為實朔本日。
                Acr0SdMidn = AvgSdMidn - 1
                Acr0Deci = 1 - t(MoonLongiMidnToday - SunLongiMidnToday) / (t(MoonLongiMidnMorrow - MoonLongiMidnToday) - t(SunLongiMidnMorrow - SunLongiMidnToday))
            }
            //////// 實朔望實時
            const AcrSd = iteration(Acr0SdMidn + Acr0Deci, 0.5 / 24, isNewm)
            // const Acr2Sd = iteration(AcrSd, 0.1 / 24, isNewm)
            const { Sunperi: AcrSunperi, SunOrbit: AcrSunOrbit, SunCorr: AcrSunCorr, SunGong: AcrSunGong, SunLongi: AcrSunLongi } = sunGuimao(AcrSd)
            const { Whitelongi: AcrWhitelongi } = moonGuimao(AcrSd, AcrSunperi, AcrSunOrbit, AcrSunCorr, AcrSunGong)
            NowSd[i] = AcrSd + timeDif(AcrSunCorr, AcrSunLongi)
            AcrDeci[i] = deci(NowSd[i]).toFixed(4).slice(2, 6)
            AcrSc[i] = ScList[(SolsmorScOrder + ~~NowSd[i]) % 60]
            Eclp[i] = Gong2Mansion(CalName, Y, AcrSunGong).Mansion
            //////// 交食
            let isEcli = false // 入食限可以入算
            const tmp = t3(AcrWhitelongi) // 距離0、180的度數            
            if (isNewm) isEcli = AcrWhitelongi % 180 < 180 ? tmp < SunLimitYinAcr : tmp < SunLimitYangAcr
            else isEcli = tmp < MoonLimit
            if (isEcli) {
                if (isNewm) {
                    Ecli[i] = sunEcliGuimao(NowSd[i], AcrSunLongi)
                }
                else Ecli[i] = moonEcliGuimao(NowSd[i], AcrSunLongi)
            }
            //////// 節氣
            if (isNewm) {
                const TermGong = ((i + 1) * 30) % 360
                const TermSd = (i + 1) * TermLeng - (1 - SolsDeci)
                TermSc[i] = ScList[(SolsmorScOrder + ~~TermSd) % 60]
                TermDeci[i] = deci(TermSd).toFixed(4).slice(2, 6)
                const TermSunperiMidn = SunperiConst + SunperiThisyear + SunperiDV * ~~TermSd
                const TermSunCorr = sunCorrGuimao(TermGong - TermSunperiMidn)
                const Acr0TermSd = TermSd - TermSunCorr / SunAvgDV
                // 用下編之平氣推定氣法，再加上一次迭代，和曆法理論值只有半分鐘以內的誤差。曆書用的本日次日比例法，少部分密合，大部分相差5-15分鐘。輸出的是視時。
                // const Acr0Sun = sunGuimao(Acr0TermSd)
                // const AcrTermSd = Acr0TermSd + ((TermGong  - Acr0Sun.SunGong) / SunAvgDV)
                // 下再用推節氣時刻法。沒有推逐日太陽宮度，為了少點麻煩，只用本日次日，不考慮再昨天或明天的情況。與曆書相較密合。
                let AcrTermSd = 0
                const SunToday = sunGuimao(~~Acr0TermSd)
                const SunMorrow = sunGuimao(~~Acr0TermSd + 1)
                const MidnToday = SunToday.SunGong
                const MidnMorrow = SunMorrow.SunGong
                AcrTermSd = ~~Acr0TermSd + (TermGong - MidnToday + (TermGong === 0 ? 360 : 0)) / (MidnMorrow - MidnToday)
                NowTermSd[i] = AcrTermSd + timeDif(SunToday.SunCorr, SunToday.SunLongi)
                TermAcrSc[i] = ScList[(SolsmorScOrder + ~~NowTermSd[i]) % 60]
                TermAcrDeci[i] = deci(NowTermSd[i]).toFixed(4).slice(2, 6)
                const TermRise = riseQing(((MidnMorrow - MidnToday) / 2 + MidnToday + 270) % 360, Obliquity, BeijingLati)
                const Mansion = Gong2Mansion(CalName, Y, TermGong, MidnToday, MidnMorrow, TermRise)
                TermEclp[i] = Mansion.Mansion
                TermDuskstar[i] = Mansion.DuskstarPrint
            }
        }
        LeapNumTerm = LeapNumTerm || 0
        if (isNewm) {
            //////// 置閏
            for (let i = 1; i <= 12; i++) {
                if ((~~NowTermSd[i] < ~~NowSd[i + 1]) && (~~NowTermSd[i + 1] >= ~~NowSd[i + 2])) {
                    LeapNumTerm = i // 閏Leap月，第Leap+1月爲閏月
                    break
                }
            }
        }
        //////// 朔閏表信息
        const EcliPrint = []
        for (let i = 1; i <= 13; i++) {
            let NoleapMon = i
            if (LeapNumTerm) {
                if (i === LeapNumTerm + 1) NoleapMon = '閏'
                else if (i > LeapNumTerm + 1) NoleapMon = i - 1
            }
            if (Ecli[i]) {
                if (isNewm) {
                    EcliPrint[i] = `<span class='eclipse'>S${NoleapMon}</span>`
                    EcliPrint[i] += '出' + Ecli[i].Rise + ' ' + Ecli[i].Magni + '% 虧' + Ecli[i].Start + '甚' + Ecli[i].Total + '復' + Ecli[i].End + ' 入' + Ecli[i].Sunset
                } else {
                    EcliPrint[i] = `<span class='eclipse'>M${NoleapMon}</span>`
                    EcliPrint[i] += '入' + Ecli[i].Sunset + ' ' + Ecli[i].Magni + '% 虧' + Ecli[i].Start + '甚' + Ecli[i].Total + '復' + Ecli[i].End + ' 出' + Ecli[i].Rise
                }
                if (Ecli[i].Magni >= 99) {
                    AcrSc[i] += `<span class='eclipse-symbol'>●</span>`
                } else if (Ecli[i].Magni > 10) {
                    AcrSc[i] += `<span class='eclipse-symbol'>◐</span>`
                } else if (Ecli[i].Magni > 0) {
                    AcrSc[i] += `<span class='eclipse-symbol'>◔</span>`
                }
            }
        }
        return { AvgSc, AvgDeci, AcrSc, AcrDeci, Eclp, TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEclp, TermDuskstar, EcliPrint, LeapNumTerm }
    }
    const {
        AvgSc: NewmAvgSc, AvgDeci: NewmAvgDeci, AcrSc: NewmSc, AcrDeci: NewmDeci, Eclp: NewmEclp, EcliPrint: SunEcli, TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEclp, TermDuskstar, LeapNumTerm
    } = AutoNewmSyzygy(true)
    const {
        AcrSc: SyzygySc, AcrDeci: SyzygyDeci, EcliPrint: MoonEcli
    } = AutoNewmSyzygy(false, LeapNumTerm)
    return { LeapNumTerm, NewmAvgSc, NewmAvgDeci, NewmSc, NewmDeci, NewmEclp, SyzygySc, SyzygyDeci, SunEcli, MoonEcli, TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEclp, TermDuskstar }
}
// console.log(cal("Guimao", 1430)) // 《後編》卷三《日食食甚真時及兩心視距》葉64算例，見說明文檔
// console.log(sunGuimao(313)) // 日躔與這個驗算無誤 https://zhuanlan.zhihu.com/p/526578717 算例：Sd=313，SunRoot=0+38/60+26.223/3600，SunperiThisyear=166*(1/60+2.9975/3600)
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
// console.log(atan(0.1328888016451028/sin(18.7)))
