// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import Para from './para_calendars.mjs'
import { ScList, deci } from './para_constant.mjs'
import { Gong2Mansion } from './astronomy_other.mjs'
const abs = X => Math.abs(X)
const sign = X => Math.sign(X)
const pi = Math.PI
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = X => Math.sin(d2r(X))//.toFixed(8) // 數理精蘊附八線表用的是七位小數
const sin2 = X => 2 * sin(X / 2) // 通弦
const cos = X => Math.cos(d2r(X))//.toFixed(8)
const tan = X => Math.tan(d2r(X))//.toFixed(8)
const cot = X => (1 / Math.tan(d2r(X)))//.toFixed(8)
const vsin = X => (1 - Math.cos(d2r(X)))//.toFixed(8) // 正矢
const asin = X => r2d(Math.asin(X))//.toFixed(8)
const acos = X => r2d(Math.acos(X))//.toFixed(8)
const atan = X => r2d(Math.atan(X))//.toFixed(8)
const acot = X => (90 - r2d(Math.atan(X)))//.toFixed(8)
const avsin = X => acos(1 - X)
const sqr = X => Math.sqrt(X)
const t = X => (X % 360 + 360) % 360
const t1 = X => abs(180 - X % 360) // x不及半周者，与半周相减；过半周者，减半周。——與180的距離
const t2 = X => Math.min(X % 360, 360 - X % 360) // x過半周者，與全周相減。——與0的距離
const t3 = X => 90 - abs(90 - X % 180) // x过一象限者，与半周相减；过半周者，减半周；过三象限者，与全周相减。——與0、180的距離
const f1 = X => X % 360 > 180 ? 1 : -1// 不及半周为减，过半周为加。
const f2 = X => X % 360 < 180 ? 1 : -1
const f3 = X => X % 360 % 180 > 90 ? 1 : -1 // 一、三象限加，二、四象限減
const f4 = X => X % 360 % 180 < 90 ? 1 : -1
export const LonHigh2Low = (e, X) => ~~(Math.ceil(X / 90) / 2) * 180 + atan(cos(e) * tan(X)) // 傾角、經度，用於黃轉赤，白轉黃
const LonLow2High = (e, X) => Math.ceil(Math.ceil(X / 90) / 2) * 180 - 90 - atan(cos(e) * cot(X)) // 赤轉黃，黃轉白
export const HighLon2LowLat = (e, X) => asin(sin(e) * sin(X)) // 月距正交轉黃緯
// const LowLon2LowLat = (e, X) => atan(tan(e) * sin(X)) // 求赤經高弧交角用到這個的變形
// const LowLat2HighLon = (e, X) => // 已知太陽赤緯轉黃經
// console.log(HighLon2LowLat(23 + 29 / 60,112.28487818))
// console.log(LowLat2HighLon(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=.3973413465. HAB=23.41207808
export const riseQing = (Lon, Sobliq, BjLat) => {
    Lon = t(Lon)
    return .25 + (Lon < 180 ? -1 : 1) * (asin(tan(abs(HighLon2LowLat(Sobliq, Lon)) * tan(BjLat))) / 360)
} // 日出時刻。這個經度應該是正午的經度
// 切線分外角法，見梅文鼎三角法舉要卷二。兩邊的輸入順序無所謂。已知邊角邊，求另外兩角。
const qiexian = (a, b, X) => {
    X = t2(X)
    let long = a, short = b
    if (b > a) long = b, short = a
    const haAsupple = (180 - X) / 2 // 半外角
    const haAdif = atan((long - short) / (long + short) * tan(haAsupple)) // 半較角
    const Ashort = haAsupple - haAdif // 短邊對角
    const Along = haAsupple + haAdif // 長邊對角
    return { Ashort, Along }
    // 以下是我的作垂線法
    // const vertical = a * sin(X % 180)
    // const c = sqr(a ** 2 + b ** 2 - 2 * a * b * cos(180 - abs(180 - X)))
    // return asin(vertical / c)
}
const qiexianA = (a, b, X) => { // 固定返回a邊對角
    X = t2(X)
    let long = a, short = b
    if (b > a) long = b, short = a
    const haAsupple = (180 - X) / 2 // 半外角
    const haAdif = atan((long - short) / (long + short) * tan(haAsupple)) // 半較角
    const Ashort = haAsupple - haAdif // 短邊對角
    const Along = haAsupple + haAdif // 長邊對角
    let result = Along
    if (a < b) result = Ashort
    return result
}
const abCtime_Sph = (a, b, AngCTime) => {
    const AngC = abs(.5 - deci(AngCTime)) * 360 // 用時太陽距午赤道度
    const b1 = LonHigh2Low(AngC, a) // 距極分邊
    const b2 = b - b1  // 自天頂作垂線，得距極分邊，再與太陽距極相加減，得距日分邊。距午度<90度，垂線在三角形內，相減，>90相加。            
    const tanH = tan(AngC) * sin(b1) // 垂弧之正切
    const AngA = (deci(AngCTime) < .5 ? 1 : -1) * (atan(tanH / sin(b2)) + 180) % 180 // 用時赤經高弧交角。若距極分邊轉大於太陽距北極，則所得爲外角，與半周相減。午前赤經在高弧東，午後赤經在高弧西。
    // const c = asin(sin(AngC) * sina / sin(abs(AngA))) // 用時太陽距天頂
    const c = LonLow2High(AngA, b2) // 我的等效算法。經實驗，如果三角函數取小數點後8位，20.12486241，本來是20.1248526178365
    return { AngA, c }
}
// 斜弧三角形已知兩邊和夾角求另一邊
const aCb_Sph = (a, b, C) => { // 納白爾公式 https://wenku.baidu.com/view/145cd0f4b84cf7ec4afe04a1b0717fd5360cb2f1.html
    const tanAPlBDiv2 = cos((a - b) / 2) / cos((a + b) / 2) * cot(C / 2)
    const tanAMiBDiv2 = sin((a - b) / 2) / sin((a + b) / 2) * cot(C / 2)
    const tancdiv2 = cos(atan(tanAPlBDiv2)) / cos(atan(tanAMiBDiv2)) * tan((a + b) / 2)
    return atan(tancdiv2) * 2
}
const abc_Sph = (a, b, c) => { // 斜弧三角形已知三邊求a所對角。上編卷三總較法
    const sum = b + c
    const dif = abs(b - c)
    let mid = 0
    if ((t2(sum) < 90 && t2(dif) < 90) ||
        (t2(sum) > 90 && t2(dif) > 90)) {
        mid = abs(abs(cos(sum)) - abs(cos(dif)))
    } else mid = abs(cos(sum)) + abs(cos(dif))
    mid /= 2
    const vsinDif = abs(vsin(a) - vsin(dif))
    return avsin(vsinDif / mid)
}
// console.log(abc_Sph(108, 50.08333333333, 90)) // 113度45分36秒
export const twilight = (Sobliq, BjLat, SunLon) => { // 民用曚影時長。應該也是用的正午太陽緯度
    const limit = 6 // 民用6度，天文18度
    const a = 90 + limit
    const b = 90 - BjLat // 所在地北極距天頂
    const c = 90 - HighLon2LowLat(Sobliq, SunLon)
    const Rise = riseQing(SunLon, Sobliq, BjLat)
    return abc_Sph(a, b, c) / 360 - (.5 - Rise)
}
// console.log(twilight(23.4916666667, 39.9166666667, 270)) // 日出0.3090277778，曚影0.07083333333
// 蒙氣差
const atmosGuimao = h => {
    const a = tan(90 - h) ** 2 + 1
    const delta = 4 + 4 * a * 2.0006095 * .0006095
    const X = (-2 + sqr(delta)) / (2 * a) // 根據公式1 ，一元二次方程求根公式
    const ang1 = asin((1 + X) / 1.0006095) - h
    const ang2 = asin(sin(ang1) * 1.0002841)
    return ang2 - ang1
}
// console.log(atmos(20)) // .04453873130688635
// 以下分別是月離算法和日食算法求日地距離，不知為何用不同方法。
const dist2 = (deg, c2) => { // 目前未加條件判斷，只適合近地點起算的太陽。已知橢圓某點角度、橢圓倍兩心差，求距地心長度。像日躔曆理以角求積那樣，日在辛，地在甲，另一焦點丙，延長辛甲到壬，丙壬⊥辛壬。甲辛=x，(2-X)^2=丙壬^2+(甲壬+X)^2。
    const jiaren = cos(deg) * c2 // 分股
    const bingren = sin(deg) * c2 // 勾    
    const gouxianSum = 2 + jiaren // 勾弦和
    const gouxianDif = bingren ** 2 / gouxianSum // 勾弦較
    const xian = (gouxianSum + gouxianDif) / 2 // 弦
    return +(2 - xian).toFixed(7)
    // return (4 - bingren ** 2 - jiaren ** 2) / (2 * jiaren + 4) // 我自己的算法 
}
const dist = (deg, c2) => { // 作垂線成兩勾股法，小股y=(4*X-4-c2**2)/(2*c2)，c2+y=cos(deg)*X
    let X = 0
    if (c2 < .034) { // 太陽從近地點起算
        if (deg > 90 && deg < 270) X = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cos(t3(deg)))
        else X = (4 - c2 ** 2) / (4 + 2 * c2 * cos(t3(deg)))
    } else { // 月亮從遠地點起算
        if (deg > 90 && deg < 270) X = (4 - c2 ** 2) / (4 + 2 * c2 * cos(t3(deg)))
        else X = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cos(t3(deg)))
    }
    return +X.toFixed(7)
}
// console.log(dist(180, .066782*2))
// console.log(dist2(324, .0538))
// 時差總
const timeAvg2Real = (Sobliq, SunCorr, SunLon) => {
    const SunCorrTcorr = -SunCorr / 360 // 均數時差。以實望太陽均數變時。均數加者則爲減。
    const EclpEquaDifTcorr = (SunLon - LonHigh2Low(Sobliq, SunLon)) / 360 // 升度時差。二分後爲加，二至後爲減。
    return SunCorrTcorr + EclpEquaDifTcorr
}
const sunCorrGuimao = Xraw => { // 大徑1、小徑0.999857185、avg中率0.999928589、兩心差（焦距）。中距盈縮差1°56′12″。
    Xraw = (Xraw + 360) % 360
    const X = Xraw % 180
    const Xt = t3(X)
    // 求對甲丙倍差之午角：作輔助線延長丙午到寅。丙寅=甲午+丙午=2a，求得∠寅，橢圓界角∠午=2*∠寅。    
    const Awu = 2 * qiexian(.0338000, 2, Xraw).Ashort
    // 求橢圓差角未丙午，見上文葉37條    
    const Aweibingwu = Xt - atan(.999857185 * tan(Xt))
    let flag1 = 1, flag2 = 1
    if (X > 90) flag1 = -1
    if (Xraw > 180) flag2 = -1
    return flag2 * (Awu + flag1 * Aweibingwu)
}
const sunCorrJiazi = Xraw => {
    Xraw = (Xraw + 360) % 360
    const X = Xraw % 180
    const Xt = t3(X)
    const R0 = .0358416, R1 = .0268812, R2 = .0089604, Rdif = .0179208 // 本輪均輪半徑
    const Jiawu = 1 + (t2(Xraw) < 90 ? -1 : 1) * cos(Xt) * Rdif
    const Wuchen = 2 * sin(Xt) * Rdif
    return f2(Xraw) * atan(Wuchen / Jiawu)
}
// console.log(sunCorrJiazi(140))
export const sunShixian = (Name, SunRoot, SperiRoot, Sd) => {
    const { SunAvgVd, SperiConst, SperiVd } = Para[Name]
    const AvgSun = SunRoot + Sd * SunAvgVd // 平行：以年根與日數相加，得平行。// 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
    const Speri = SperiConst + SperiVd * Sd + SperiRoot // 最卑平行。Speri=SunPerigee太陽近地點
    const Sorb = t(AvgSun - Speri) // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
    const SunCorr = eval('sunCorr' + Name)(Sorb)
    const SunGong = t(AvgSun + SunCorr) // 實行
    const SunLon = (SunGong + 270) % 360 // 黃道度
    return { Sorb, SunCorr, SunLon, SunGong, Speri }
}
export const moonJiazi = (MoonRoot, NodeRoot, MapoRoot, Sd, SunCorr, SunGong) => {
    const { MoonAvgVd, MapoVd, NodeVd, Sobliq } = Para['Jiazi']
    const R2 = .029, R4 = .0217, R5 = .01175 // 1本輪R1 = .058、2均輪、3負均輪圈R3 = .0797、4次輪、5次均輪
    const MobliqMid = 5.13333333333333, MobliqDif = .15833333333333 // MobliqMax0129 = 4.975朔望黃白大距4 + 58 / 60 + 30 / 3600，MobliqMax0822 = 5.29166666666667,兩弦黃白大距5 + 17 / 60 + 30 / 3600，黃白大距中數5+8/60，黃白大距半較9/60+30/3600
    // 時差——引數——初均——月距日次引——二均——三均——白道實行——黃白大距、交均——正交
    const AvgMoon1 = t(MoonRoot + Sd * MoonAvgVd) // 太陰平行        
    const AvgMapo = t(MapoRoot + Sd * MapoVd) // 最高平行.Mapo=MoonApogee太陰遠地點
    const AvgNode = NodeRoot - Sd * NodeVd // 正交平行    
    const AvgMoon = AvgMoon1 - timeAvg2Real(Sobliq, SunCorr, (SunGong + 270) % 360) * MoonAvgVd // 時差總爲加者時差行爲減
    const Morb = AvgMoon - AvgMapo // 均輪心自行引數Morb=MoonOrbitDegree
    // const MSDif = MoonGong - SunGong    
    const Guimao = sin(t3(Morb)) * R2
    const Maobing = cos(t3(Morb)) * R2
    const Choumao = 3 * Guimao
    const Jiamao = 1 + (t2(Morb) < 90 ? 1 : -1) * Maobing
    const Corr1 = atan(Choumao / Jiamao) // 初均。卷五葉40算例：30：2度25分47秒=2.4297222222。90：4度58分20秒=4.9722222222。92：4度58分27秒=4.9741666667。120：4度22分19秒=4.3719444444。230：3度53分6秒=3.885。300：4度14分51秒=4.2475
    const flag1 = f1(Morb) // 初均符號    
    const AcrMoon1 = AvgMoon + flag1 * Corr1 // 初實行
    const MSDif = (AcrMoon1 - SunGong + 720) % 360 // 月距日次引（次輪周之行度）
    // 次輪心行Orbdeg*2%360，次均輪心行MSDif*2
    const MSDif2 = (MSDif * 2) % 360 // 倍離
    const Choujia = Choumao / sin(Corr1)
    // 次輪最近點距地。90：1.0037774。120：0.9883760。230：0.9836195。300：1.0172941
    const Jichou = R4 * sin2(t2(MSDif2)) // 120：0.0407827。135：0.0306884。320：0.0278970
    const Ajichoujia = Corr1
        + t1(Morb) // 均輪心距最卑之度=引數與半周相減
        + flag1 * f4(MSDif) * t1(MSDif2) / 2  // 加減月距日距象限度爲夾角。距象限90度和我的算式等效。
    // 初均減者：月距日過一三象限，加；不過象限或過二象限，減。
    // 初均加者：相反。若初均與均輪心距最卑相加不足減月距日距象限度，則轉減。若相加過半周，則與全周相減。110、120用加：84度22分19秒=84.3719444444。135、230用減：8度53分6秒=8.885。320、300：74度14分51秒=74.2475
    let flag2 = flag1 // 二均符號    
    const A1 = Corr1 + t1(Morb) // 次輪最近點距地心線與次輪徑夾角    
    if (A1 < 90) { // 以初均數與均輪心距最卑之度相加，爲次輪最近點距地心線與次輪徑夾角。此角如不及九十度，則倍之，與半周相減，餘爲加減限。初均減者：月距日倍度在此限內，則二均反爲加；初均加者：月距日倍度與全周相減，餘數在此限內，則二均數反爲減。
        const limit = 180 - A1 * 2
        if (flag1 === -1) {
            if (MSDif2 < limit) flag2 = 1
        } else {
            if (abs(MSDif2 - 360) < limit) flag2 = -1
        }
    } else { // 此角如過九十度，則與半周相減，餘數倍之，又與半周相減，餘爲加減限。初均減者：月距日倍度與全周相減，餘數在此限內，則二均數反爲加。初均加者：月距日倍度在此限内，則二均數反爲減。若不在限內，或其角適足九十度，則初均數爲加者二均數亦爲加，初均數爲減者二均數亦為減。
        const limit = 180 - abs(180 - A1) * 2
        if (flag1 === -1) {
            if (abs(MSDif2 - 360) < limit) flag2 = 1
        } else {
            if (MSDif2 < limit) flag2 = -1
        }
    }
    const Corr2 = qiexianA(Jichou, Choujia, Ajichoujia) // 丑甲己角。90：1度22分5秒=1.3680555556。2度21分40秒=2.3611111111。135、230：17分6秒=.285。1度31分23秒=1.5230555556
    const Jijia = Jichou * sin(Ajichoujia) / sin(Corr2) // 次均輪心距地。90：0.9842622。120：0.9851595。135、230：0.9528920
    const Corr3 = qiexianA(R5, Jijia, t2(MSDif2)) // 90：41分2秒=.6838888889。110、120：26分7秒=.4352777778。135、230：42分23秒=.7063888889。320、300：39分27秒=.6575
    const flag3 = MSDif2 < 180 ? 1 : -1 // 月距日倍度不及半周爲加，過半周爲減
    const Whitegong = t(AcrMoon1 + flag2 * Corr2 + flag3 * Corr3) // 白道實行
    // 白極自交均輪順時針行倍離
    const Mobliq = aCb_Sph(MobliqMid, MobliqDif, t2(MSDif2)) // 黃白大距。90：5度8分9秒=5.1358333333
    const NodeCorr = asin(sin(t2(MSDif2)) * sin(MobliqDif) / sin(MobliqMid)) // 交均：白道極與交均輪心之差。90：1度46分8秒=1.7688888889
    const flag4 = MSDif2 < 180 ? -1 : 1 // 月距日倍度不及半周，交均爲減
    const AcrNode = t(AvgNode + flag4 * NodeCorr)
    const Whitelongi = t(Whitegong - AcrNode)
    const MoonLat = asin(sin(Mobliq) * sin(Whitelongi))
    const MoonGong = (LonHigh2Low(Mobliq, Whitelongi) + AcrNode) % 360
    const MoonLon = (MoonGong + 270) % 360
    return { AcrNode, Whitegong, Whitelongi, MoonGong, MoonLon, MoonLat, Mobliq, Morb, Corr1 }
}
console.log(moonJiazi())
export const moonGuimao = (MoonRoot, NodeRoot, MapoRoot, Sd, SunCorr, SunGong, Speri, Sorb) => {
    const { MoonAvgVd, MapoVd, NodeVd } = Para['Guimao']
    const SunCorrMax = 1.93694444444444 // 太陽最大均數1 + 56 / 60 + 13 / 3600
    const AvgCorr1Max = .19722222222222 // 太陰最大一平均11 / 60 + 50 / 3600
    const AvgMapoCorrMax = .33222222222222  // 最高最大平均19 / 60 + 56 / 3600
    const AvgNodeCorrMax = .15833333333333  // 正交最大平均9 / 60 + 30 / 3600
    const AvgCorr2ApoMax = .05944444444444, AvgCorr2PeriMax = .06555555555556 // 太陽在最高時之太陰最大二平均3 / 60 + 34 / 3600。太陽在最卑時之太陰最大二平均3 / 60 + 56 / 3600
    const AvgCorr3Max = .01305555555556  // 最大三平均47 / 3600
    const Corr2ApoMax = .55388888888889, Corr2PeriMax = .61972222222222  // 太陽在最高時之最大二均33 / 60 + 14 / 3600。太陽在最卑時之最大二均37 / 60 + 11 / 3600
    const Corr3Max = .04027777777778 // 最大三均2 / 60 + 25 / 3600
    const Corr4MaxList = [0, .01694444444444, .01861111111111, .02111111111111, .02444444444444, .02861111111111, .03333333333333, .03861111111111, .04416666666667, .05] // [0, 61 / 3600, 67 / 3600, 76 / 3600, 88 / 3600, 103 / 3600, 120 / 3600, 139 / 3600, 159 / 3600, 180 / 3600]兩弦最大末均以10度爲率，依次為日月最高相距0、10、20⋯⋯90度。為何0-10有一個突然的陡坡？見廖育棟文檔附錄2
    const MobliqMax = 5.28888888888889, MobliqMin = 4.99305555555556 // 黃白交角大距限5 + 17 / 60 + 20 / 3600。4 + 59 / 60 + 35 / 3600
    //////// 平行
    const AvgMoon1 = t(MoonRoot + Sd * MoonAvgVd) // 太陰平行        
    const AvgMapo1 = t(MapoRoot + Sd * MapoVd) // 最高平行
    const AvgNode1 = t(NodeRoot - Sd * NodeVd) // 正交平行
    const AvgMoon2 = AvgMoon1 - SunCorr / SunCorrMax * AvgCorr1Max // 二平行=太陰平行+-一平均：用時之太陰平行。一平均（考慮地球自轉的時間）已有均數時差，而止就黃道算，故不用升度時差。一平均：太阳均数加者为减，减者为加。
    const AvgMapo = AvgMapo1 + SunCorr / SunCorrMax * AvgMapoCorrMax  // 用最高=最高平行+-最高平均
    const AvgNode = AvgNode1 - SunCorr / SunCorrMax * AvgNodeCorrMax// 用正交=正交平行+-正交平均
    const SunMapoDif = t(SunGong - AvgMapo) // 日距月最高
    const SunNodeDif = t(SunGong - AvgNode) // 日距正交        
    const SunDist = dist2(Sorb + SunCorr, .0338000) // 日距地心。
    const TubedDif = (1.0169000 ** 3 - SunDist ** 3) / .101410  // 求立方較,太阳最高距地心数之立方。這裡再除以太陽高卑距地之立方大較 (10000000+169000)**3-(10000000-169000)**3
    const AvgCorr2Apo = abs(sin(SunMapoDif * 2) * AvgCorr2ApoMax) // 太陽在最高時日距月最高之二平均
    const AvgCorr2Peri = abs(sin(SunMapoDif * 2) * AvgCorr2PeriMax)
    const AvgCorr2 = f1(SunMapoDif * 2) * (abs(AvgCorr2Apo - AvgCorr2Peri) * TubedDif + AvgCorr2Apo) // 本時之二平均。日距月最高倍度不及半周为减，过半周为加。
    const AvgCorr3 = -sin(2 * SunNodeDif) * AvgCorr3Max // 日距正交倍度不及半周为减，过半周为加。
    const AvgMoon = AvgMoon2 + AvgCorr2 + AvgCorr3 // 用平行                
    const AcrMapoCorr = f2(SunMapoDif * 2) * qiexian(.0117315, .0550505, t1(SunMapoDif * 2)).Ashort // 求最高實均。最高本輪半徑550505，最高均輪半徑117315。日距月最高之倍度与半周相减，馀为所夹之角。日距月最高倍度不及半周者，与半周相减；过半周者，减半周。日距月最高倍度不及半周为加，过半周为减。
    const MoonC = abs(.0117315 * sin(t2(SunMapoDif * 2)) / sin(AcrMapoCorr)) // 本天心距地：本時兩心差        
    const AcrMapo = AvgMapo + AcrMapoCorr // 最高實行
    const Morb = t(AvgMoon - AcrMapo) // 太陰引數=用平行-最高實行
    //////// 實行
    // 求初均（見月離曆理葉28）
    const Ajiagengyi = qiexianA(MoonC, 1, t1(Morb)) // 对两心差之小角.引数不及半周者，与半周相减。过半周者，则减半周。
    const Ayijiasi = qiexianA(1, MoonC, Ajiagengyi + t1(Morb)) // 对半径之大角，为平圆引数        
    const Corr1 = abs((atan(sqr(1 - MoonC ** 2) * tan(Ayijiasi)) + 180) % 180 - t2(Morb)) * f1(Morb) // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加。        
    const Acr1 = AvgMoon + Corr1 // 初實行
    const MSDif = t(Acr1 - SunGong) // 月距日
    const Corr2Apo = abs(sin(MSDif * 2) * Corr2ApoMax) // 太陽最高時月距日之二均
    const Corr2Peri = abs(sin(MSDif * 2) * Corr2PeriMax) // 太陽最卑時月距日之二均        
    const Corr2 = f2(MSDif * 2) * abs((Corr2Apo - Corr2Peri) * TubedDif + Corr2Apo) // 本時之二均。月距日倍度不及半周为加，过半周为减。
    const AcrMSDif = MSDif + Corr2 // 實月距日
    const SunMoonApoDif = t(AcrMapo - (Speri + 180)) // 日月最高相距
    const MSDifSum = t(AcrMSDif + SunMoonApoDif) // 相距總數
    const Corr3 = sin(MSDifSum) * Corr3Max // 三均。总数初宫至五宫为加，六宫至十一宫为减
    const Dif90 = t3(SunMoonApoDif) / 10
    const Corr4Max = deci(Dif90) * (Corr4MaxList[~~Dif90 + 1] - Corr4MaxList[~~Dif90]) + Corr4MaxList[~~Dif90] // 兩弦最大末均
    const Corr4 = -sin(AcrMSDif) * Corr4Max // 末均。实月距日初宫至五宫为减，六宫至十一宫为加。
    const Whitegong = Acr1 + Corr2 + Corr3 + Corr4 // 白道實行moon's path
    //////// 黃白差
    const AcrNodeCorr = f2(SunNodeDif * 2) * qiexian(57.5, 1.5, t1(SunNodeDif * 2)).Ashort // 正交實均。日距正交倍度过半周者，与半周相减，用其馀。日距正交倍度不及半周为加，过半周为减。
    const AcrNode = t(AvgNode + AcrNodeCorr) // 正交實行
    const Whitelongi = t(Whitegong - AcrNode) // 月距正交。——我把正交定為白經0度
    const vsinSunNodeDif2 = vsin(t2(SunNodeDif * 2))  // 日距正交倍度之正矢
    const MobliqLimitCorr = vsinSunNodeDif2 * (MobliqMax - MobliqMin) / 2 // 交角減分。黄白大距半較8分52秒半。凡日距正交倍度过半周者，则与全周相减，馀为距交倍度。
    const MobliqCorrSunNodeDif = (2 / 60 + 43 / 3600) / 2 * vsinSunNodeDif2 // 距交加差。2分43秒最大兩弦加差    
    const Mobliq = MobliqMax - MobliqLimitCorr + MobliqCorrSunNodeDif / 2 * vsin(t2(AcrMSDif * 2)) // 黃白大距=距限+距日加分
    const MoonLat = asin(sin(Mobliq) * sin(Whitelongi)) // 黃道緯度。月距正交过一象限者与半周相减，过半周者减半周，过三象限者与全周相减
    // const EclpWhiteDif = TwoOrbdegDif(Mobliq, Whitelongi) // 升度差=月距正交之黃道度-月距正交。月距正交初、一、二、六、七、八宫为交后，为减。三、四、五、九、十、十一宫为交前，为加。之所以%180，因為tan(20)=tan(200)
    // const MoonGong = t(Whitegong + EclpWhiteDif)
    const MoonGong = (LonHigh2Low(Mobliq, Whitelongi) + AcrNode) % 360
    const MoonLon = (MoonGong + 270) % 360
    return { AcrNode, Whitegong, Whitelongi, MoonGong, MoonLon, MoonLat, Mobliq, Morb, Corr1, MoonC }
}
export const N4 = (Name, Y) => {
    const { CloseOriginAd, Solar, Lunar, ChouConst, SolsConst, SperiConst, SperiVy, SperiVd, SunAvgVd, MoonAvgVd, MapoVd, NodeVd, MoonConst, MapoConst, NodeConst, SunLimitYinAcr, SunLimitYangAcr, MoonLimit, MansionDayConst, Sobliq, BjLat } = Para[Name]
    const TermLeng = Solar / 12
    const CloseOriginYear = abs(Y - CloseOriginAd) // 積年
    const OriginAccum = +(CloseOriginYear * Solar).toFixed(9) // 中積
    const SolsAccum = Y >= CloseOriginAd ? OriginAccum + SolsConst : OriginAccum - SolsConst // 通積分
    const MansionDaySolsmor = Y >= CloseOriginAd ? ~~(((OriginAccum + MansionDayConst) % 28 + 2) % 28) : ~~((28 - (OriginAccum - MansionDayConst) % 28 + 2) % 28) // 值宿日分
    const Sols = +(Y >= CloseOriginAd ? SolsAccum % 60 : 60 - SolsAccum % 60).toFixed(9)
    const SolsDeci = deci(Sols) // 冬至小數
    const SolsmorScOrder = (~~Sols + 2) % 60 // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）Solsmor: winter solstice tomorrow 冬至次日子正初刻
    const SunRoot = (1 - SolsDeci) * SunAvgVd // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。    
    const DayAccum = Y >= CloseOriginAd ? OriginAccum + deci(SolsConst) - SolsDeci : OriginAccum - deci(SolsConst) + SolsDeci // 積日（曆元冬至次日到所求天正冬至次日的日數，等於算式的曆元冬至當日到所求冬至當日日數）    
    const ChouAccum = Y >= CloseOriginAd ? DayAccum - ChouConst : DayAccum + ChouConst // 通朔
    // const LunarNum = Y >= CloseOriginAd ? ~~(ChouAccum / Lunar) + 1 : ~~(ChouAccum / Lunar) // 積朔。似乎+1是為了到十二月首朔
    const ChouSd = Y >= CloseOriginAd ? (Lunar - ChouAccum % Lunar) % Lunar : ChouAccum % Lunar // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔。Sd：某時刻距離冬至次日子正的時間
    // const LunarNumWhitelongi = LunarNum * MoonNodeMS // 積朔太陰交周
    // const ChouWhitelongi = Y >= CloseOriginAd ? LunarNumWhitelongi + ChouWhitelongiConst : ChouWhitelongiConst - LunarNumWhitelongi // 首朔太陰交周
    const MoonRoot = Y >= CloseOriginAd ? MoonConst + DayAccum * MoonAvgVd : MoonConst - DayAccum * MoonAvgVd // 太陰年根    
    const MapoRoot = Y >= CloseOriginAd ? DayAccum * MapoVd + MapoConst : MapoConst - DayAccum * MapoVd  // 最高年根
    const NodeRoot = Y >= CloseOriginAd ? NodeConst - DayAccum * NodeVd : NodeConst + DayAccum * NodeVd // 正交年根，所得爲白經
    // const Mansion = (OriginAccumMansion % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
    const SperiRoot = Y >= CloseOriginAd ? SperiVy * CloseOriginYear : -SperiVy * CloseOriginYear // 本年最卑行
    const sunEcliGuimao = (NowSd, AcrSunLon) => {
        // NowSd = 205.528185 // ⚠️1730算例臨時
        //////// 【一】實朔用時。用時的英語暫且用Now
        const Rise = riseQing(AcrSunLon, Sobliq, BjLat)
        if (deci(NowSd) < Rise - 5 / 96 || deci(NowSd) > 1 - Rise + 5 / 96) return  // 日出前日入後五刻以內可以見食
        else {
            //////// 【二】食甚實緯、食甚用時。這一段日月食都一樣
            const SunNow = sunShixian(Name, SunRoot, SperiRoot, NowSd)
            const SunOnehAft = sunShixian(Name, SunRoot, SperiRoot, NowSd + 1 / 24)
            const MoonNow = moonGuimao(MoonRoot, NodeRoot, MapoRoot, NowSd, SunNow.SunCorr, SunNow.SunGong, SunNow.Speri, SunNow.Sorb)
            const MoonOnehAft = moonGuimao(MoonRoot, NodeRoot, MapoRoot, NowSd + 1 / 24, SunOnehAft.SunCorr, SunOnehAft.SunGong, SunOnehAft.Speri, SunOnehAft.Sorb)
            // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
            const AngEquilibriumWhite = qiexian(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Mobliq).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
            const AngEquilibriumEclp = MoonNow.Mobliq + AngEquilibriumWhite // 斜距黃道交角
            const DistrealAvg = abs(cos(AngEquilibriumEclp) * MoonNow.MoonLat) // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
            const EquilibriumVd = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Mobliq) / sin(AngEquilibriumWhite) * 24 // 一小時兩經斜距*24. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA。此處我*24，從一小時速度變成一天                 
            const ArcTotalNow = abs(sin(AngEquilibriumEclp) * MoonNow.MoonLat) // 食甚距弧
            const TotalNowDif = f3(MoonNow.Whitelongi) * ArcTotalNow / EquilibriumVd // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
            const SdAvg = NowSd + TotalNowDif // 食甚用時
            // const SdAvg = 205.527765625 // ⚠️臨時
            const SunAvg = sunShixian(Name, SunRoot, SperiRoot, SdAvg)
            const MoonAvg = moonGuimao(MoonRoot, NodeRoot, MapoRoot, SdAvg, SunAvg.SunCorr, SunAvg.SunGong, SunAvg.Speri, SunAvg.Sorb)
            //////// 【三】地平高下差、日月視徑
            const AcrSorb = SunNow.Sorb + SunAvg.SunCorr // 太陽實引：實朔引數+-本時太陽均數
            const AcrMorb = MoonNow.Morb + MoonAvg.Corr1 // 太陰實引
            const MoonDist = dist(AcrMorb, MoonNow.MoonC * 2)
            const HorizonParallax = 3450 / 3600 / MoonDist - 10 / 3600 // 地平高下差=太陰在地平上最大地半徑差（中距57分30秒）-太陽地半徑差
            const SunAcrRadius = (966 / 3600) / dist(AcrSorb, .0338000) - 15 / 3600 // 太陽實半徑=太陽視半徑（中率16分6秒）-光分15秒
            const MoonRadius = (940.5 / 3600) / MoonDist // 太陰視半徑（中率15分40秒30微）
            const RadiusSum = SunAcrRadius + MoonRadius // 併徑
            //////// 【四】食甚太陽黃赤經緯宿度、黃赤二經交角            
            const TotalSunLon = t(SunAvg.SunLon + TotalNowDif * (SunOnehAft.SunGong - SunAvg.SunGong) * 24) // 食甚太陽黃道經度=實朔太陽黃道實行+距時日實行
            const TotalSunEquaLon = LonHigh2Low(Sobliq, TotalSunLon)
            const TotalSunEquaGong = (TotalSunEquaLon + 90) % 360 // 自冬至初宮起算，得食甚太陽赤道經度。
            const TotalSunEquaLat = HighLon2LowLat(Sobliq, TotalSunLon) // 食甚太陽赤道緯度。食甚太陽距春秋分黃經之正弦：三率。
            const AngSunPolar = 90 - TotalSunEquaLat // 太陽距北極
            const AngZenithPolar = 90 - BjLat // 北極距天頂
            const AngEclpEqua = (TotalSunEquaGong > 180 ? 180 : 0) - acot(cot(Sobliq) / cos(TotalSunLon)) // 黃赤二經交角。自變量：太陽距春秋分黃經。冬至後黃經在赤經西，夏至後黃經在赤經東。⚠️我定義東正西負。此步已核驗
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
                const { AngA: AngEquaHigharc, c: AngSunZenith } = abCtime_Sph(AngZenithPolar, AngSunPolar, Sd)   // 赤經高弧交角
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
                const { AngA: AngEquaHigharc, c: AngSunZenith } = abCtime_Sph(AngZenithPolar, AngSunPolar, Sd)   // 赤經高弧交角
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
            const AsmAvgDif = -(AngWhiteHigharcAvg / 180 * 8.8 / 96 + .2 / 96) // 設時距分
            // const AsmAvgDif = (20 / 60 + 1.05 / 3600) / 24 // ⚠️
            const SdAsm = SdAvg + AsmAvgDif // 食甚設時。東向前取，西向後取，角大遠取，角小近取（遠不過九刻，近或數分）
            // const SdAsm = 205 + 13 / 24 // ⚠️
            const ArcAvgAsm = EquilibriumVd * AsmAvgDif // 設時距弧
            const AngArcAvgAsm = atan(ArcAvgAsm / DistrealAvg) // 設時對距弧角
            const DistrealAsm = abs(ArcAvgAsm / sin(AngArcAvgAsm)) // 設時兩心實距            
            const { AngWhiteHigharc: AngWhiteHigharcAsm, FlagDistreal: FlagDistrealAsm, AngDistreal: AngDistrealAsm, Distappa: DistappaAsm } = distAppa(SdAsm, DistrealAsm, AngArcAvgAsm) // 見符號4
            const AngHigharcAsm_DistappaAvg = abs(abs(AngWhiteHigharcAsm - AngWhiteHigharcAvg) + (SunAvg.SunLon < 180 ? -1 : 1) * AngDistrealAvg) // 設時高弧交用時視距角
            let flag2 = 1, flag4 = 1, flag5 = 1, flag6 = 1
            if (FlagDistrealAsm === FlagDistrealAvg) flag2 = -1 // 見符號5
            const AngDistMovingAsm = t2(abs(AngHigharcAsm_DistappaAvg + flag2 * AngDistrealAsm)) // 對設時視行角
            const AngDistappaAsm = qiexianA(DistappaAsm, DistappaAvg, AngDistMovingAsm) // 對設時視距角
            const DistMovingAsm = sin(AngDistMovingAsm) / sin(AngDistappaAsm) * DistappaAsm // 設時視行
            const DistMovingAcr0 = DistappaAvg * cos(AngDistappaAsm)   // 真時視行
            const Acr0AvgDif = -sign(AngWhiteHigharcAvg) * abs(DistMovingAcr0 * AsmAvgDif / DistMovingAsm) // 真時距分
            const SdAcr0 = SdAvg + Acr0AvgDif // 食甚真時
            //////// 【七】食甚考定真時、食分
            const ArcAcr0AvgDif = Acr0AvgDif * EquilibriumVd // 真時距弧            
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
                SdBefStartAsm = SdAvg + flag5 * (abs(DistappaAvg - RadiusSum) / EquilibriumVd + .01) // 初虧前設時
                SdBefEndAsm = SdAcr + abs(SdBefStartAsm - SdAcr) // 復圓前設時
            } else {
                if (DistappaAvg > RadiusSum) flag5 = -1
                SdBefEndAsm = SdAvg + flag5 * (abs(DistappaAvg - RadiusSum) / EquilibriumVd + .01) // 復圓前設時
                SdBefStartAsm = SdAcr - abs(SdBefEndAsm - SdAcr) // 初虧前設時
            }
            // SdBefStartAsm = 205.46111111111 // ⚠️
            const startEnd = (SdBefStartAsm, isEnd) => {
                const AvgBefStartAsmDif = abs(SdAvg - SdBefStartAsm) // 初虧前設時距分
                const ArcBefStartAsm = AvgBefStartAsmDif * EquilibriumVd // 初虧前設時距弧
                const AngArcBefStartAsm = atan(ArcBefStartAsm / DistrealAvg) // 初虧前設時對距弧角
                let flagAngArcBefStartAsm = 1
                if (SdBefStartAsm < SdAvg) flagAngArcBefStartAsm = -1 // 初虧前設時在食甚用時前為西
                const DistrealBefStartAsm = ArcBefStartAsm / sin(AngArcBefStartAsm) // 初虧前設時兩心實距
                const DistappaBefStartAsm = distAppa2(SdBefStartAsm, DistrealBefStartAsm, AngArcBefStartAsm, flagAngArcBefStartAsm) // 見符號8
                //////// 【九】初虧後設時兩心視距
                if (DistappaBefStartAsm < RadiusSum) flag6 = -1
                const SdAftStartAsm = SdBefStartAsm + flag6 * (abs(DistappaBefStartAsm - RadiusSum) / EquilibriumVd + .003) // 初虧後設時
                // const SdAftStartAsm = 205.4638888889 // ⚠️
                const AvgAftStartAsmDif = abs(SdAvg - SdAftStartAsm)
                const ArcAftStartAsm = AvgAftStartAsmDif * EquilibriumVd // 初虧前設時距弧
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
    const moonEcliGuimao = (NowSd, AcrSunLon) => {
        //////// 【一】實望用時
        const Rise = riseQing(AcrSunLon, Sobliq, BjLat)
        if (deci(NowSd) > Rise + 9 / 96 && deci(NowSd) < 1 - Rise - 9 / 96) return  // 日出入前後9刻以內入算
        else {
            //////// 【二】食甚實緯、食甚時刻
            const SunNow = sunShixian(Name, SunRoot, SperiRoot, NowSd)
            const SunOnehAft = sunShixian(Name, SunRoot, SperiRoot, NowSd + 1 / 24)
            const MoonNow = moonGuimao(MoonRoot, NodeRoot, MapoRoot, NowSd, SunNow.SunCorr, SunNow.SunGong, SunNow.Speri, SunNow.Sorb)
            const MoonOnehAft = moonGuimao(MoonRoot, NodeRoot, MapoRoot, NowSd + 1 / 24, SunOnehAft.SunCorr, SunOnehAft.SunGong, SunOnehAft.Speri, SunOnehAft.Sorb)
            // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
            const AngEquilibriumWhite = qiexian(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Mobliq).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
            const AngEquilibriumEclp = MoonNow.Mobliq + AngEquilibriumWhite // 斜距黃道交角
            const Dist = abs(cos(AngEquilibriumEclp) * MoonNow.MoonLat) // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
            const EquilibriumVd = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Mobliq) / sin(AngEquilibriumWhite) * 24 // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA                    
            const ArcTotalNow = abs(sin(AngEquilibriumEclp) * MoonNow.MoonLat) // 食甚距弧
            const TotalNowDif = (MoonNow.Whitelongi % 180 < 90 ? -1 : 1) * ArcTotalNow / EquilibriumVd // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
            const SdTotal = NowSd + TotalNowDif
            let Total = deci(SdTotal) // 食甚時刻
            const SunTotal = sunShixian(Name, SunRoot, SperiRoot, SdTotal)
            const MoonTotal = moonGuimao(MoonRoot, NodeRoot, MapoRoot, SdTotal, SunTotal.SunCorr, SunTotal.SunGong, SunTotal.Speri, SunTotal.Sorb)
            //////// 【三】食分
            const AcrMorb = MoonNow.Morb + MoonTotal.Corr1
            const AcrSorb = SunNow.Sorb + SunTotal.SunCorr
            const MoonDist = dist(AcrMorb, MoonNow.MoonC * 2)
            const MoonParallax = (57 / 60 + 30 / 3600) / MoonDist // 太陰地半徑差。中距最大地半徑差 57分30秒。此一弧度代正弦算。
            const SunRadius = (966 / 3600) / dist(AcrSorb, .0338000) // 太陽視半徑。中距太陽視半徑16分6秒
            const ShadowRadius = MoonParallax + 10 / 3600 - SunRadius + MoonParallax / 69 // 實影半徑=月半徑差+日半徑差-日半徑+影差。太陽地半徑差10秒。
            const MoonRadius = (940.5 / 3600) / MoonDist // 太陰視半徑
            const RadiusSum = MoonRadius + ShadowRadius // 併徑——也就是出現月食的最大極限
            // const RadiusDif = MoonRadius - ShadowRadius // 兩徑較
            const Magni = Math.round(100 * (RadiusSum - Dist) / (MoonRadius * 2)) // 若食甚實緯大於併徑，則月與地影不相切，則不食，即不必算。上編卷七：併徑大於距緯之較，即爲月食之分
            if (Magni < 2) return
            //////// 【四】初虧復圓時刻
            const ArcStartend = sqr((RadiusSum + Dist) * (RadiusSum - Dist)) // 初虧復圓距弧。就是直角三角形已知兩邊。
            const StarttoendTime = ArcStartend / EquilibriumVd // 初虧復圓距時            
            //////// 【五】食既生光時刻
            //////// 【六】食甚太陰黃道經緯宿度
            const LengTotalNow = TotalNowDif * (MoonOnehAft.Whitegong - MoonNow.Whitegong) * 24 // 距時月實行
            const TotalWhitelongi = MoonNow.Whitelongi + LengTotalNow // 食甚月距正交
            // const TotalEclpWhiteDif = TwoOrbdegDif(MoonNow.Mobliq, TotalWhitelongi) // 黃白升度差。食甚距時加者亦爲加，減者亦爲減。⚠️我這裡符號用的食甚的月距正交，而非食甚距時所用的實望的月距正交。
            const TotalMoonGong = (LonHigh2Low(MoonNow.Mobliq, TotalWhitelongi) + MoonNow.AcrNode) % 360 // 食甚太陰黃道經度
            const TotalMoonLon = (TotalMoonGong + 270) % 360
            const TotalMoonLat = HighLon2LowLat(MoonNow.Mobliq, TotalWhitelongi) // 食甚太陰黃道緯度，南北與食甚實緯同
            // const TotalMoonLat = sin(90 - AngEquilibriumEclp) * Dist // 這是食甚實緯之南北。
            //////// 【七】食甚太陰赤道經緯宿度
            const ObliqMoonEclp = (TotalMoonLat > 0 ? 1 : -1) * t3(acot(sin(t3(TotalMoonLon)) * cot(TotalMoonLat))) // 太陰距二分弧與黃道交角。單獨算沒問題。近似成平面三角就可以了 sinAcotB=cotC，也就是a/r·r/h=a/h
            const ObliqMoonEqua = Sobliq + ObliqMoonEclp // 太陰距二分弧與赤道交角
            // 思路：黃轉白，白轉赤。
            const tanArcMoonEquinox = cos(ObliqMoonEclp) * tan(TotalMoonLon) // 太陰距二分弧之正切線
            const TotalMoonEquaLon = ~~(Math.ceil(TotalMoonLon / 90) / 2) * 180 + atan(cos(ObliqMoonEqua) * tanArcMoonEquinox) // 太陰距二分赤道經度
            const TotalMoonEquaGong = (TotalMoonEquaLon + 90) % 360
            const TotalMoonEquaLat = atan(tan(ObliqMoonEqua) * sin(t3(TotalMoonEquaLon)))
            return { Start: deci((Total - StarttoendTime + 1) % 1).toFixed(4).slice(2, 6), End: deci(Total + StarttoendTime).toFixed(4).slice(2, 6), Total: Total.toFixed(4).slice(2, 6), Magni, TotalMoonLon, TotalMoonLat, TotalMoonEquaLon, TotalMoonEquaLat, Rise: Rise.toFixed(4).slice(2, 6), Sunset: (1 - Rise).toFixed(4).slice(2, 6) }
        }
    }
    const iteration = (X, step, isNewm) => { // 後編迭代求實朔實時
        let { Speri: SperiBef, Sorb: SorbBef, SunCorr: SunCorrBef, SunLon: SunLonBef, SunGong: SunGongBef } = sunShixian(Name, SunRoot, SperiRoot, X - step) // 如實望泛時爲丑正二刻，則以丑正初刻爲前時，寅初初刻爲後時——為什麼不說前後一時呢
        const { MoonLon: MoonLonBef } = moonGuimao(MoonRoot, NodeRoot, MapoRoot, X - step, SunCorrBef, SunGongBef, SperiBef, SorbBef)
        SunLonBef += isNewm ? 0 : 180
        SunLonBef %= 360
        let { Speri: SperiAft, Sorb: SorbAft, SunCorr: SunCorrAft, SunLon: SunLonAft, SunGong: SunGongAft } = sunShixian(Name, SunRoot, SperiRoot, X + step)
        const { MoonLon: MoonLonAft } = moonGuimao(MoonRoot, NodeRoot, MapoRoot, X + step, SunCorrAft, SunGongAft, SperiAft, SorbAft)
        SunLonAft += isNewm ? 0 : 180
        SunLonAft %= 360
        const Deci = deci(X) - step + t(SunLonBef - MoonLonBef) / (t(MoonLonAft - MoonLonBef) - t(SunLonAft - SunLonBef)) * step * 2 // 一小時月距日實行
        return ~~X + Deci // 實朔實時距冬至次日的時間
    }
    const term = (i, isMid) => {
        const TermGong = ((i + (isMid ? 1 : .5)) * 30) % 360
        const TermSd = (i + (isMid ? 1 : .5)) * TermLeng - (1 - SolsDeci)
        const TermSc = ScList[(SolsmorScOrder + ~~TermSd) % 60]
        const TermDeci = deci(TermSd).toFixed(4).slice(2, 6)
        const TermSperiMidn = SperiConst + SperiRoot + SperiVd * ~~TermSd
        const TermSunCorr = sunCorrGuimao(TermGong - TermSperiMidn)
        const Acr0TermSd = TermSd - TermSunCorr / SunAvgVd
        // 用下編之平氣推定氣法，再加上一次迭代，和曆法理論值只有半分鐘以內的誤差。曆書用的本日次日比例法，少部分密合，大部分相差5-15分鐘。輸出的是視時。
        // const Acr0Sun = sunShixian(Name,SunRoot, SperiRoot,Acr0TermSd)
        // const AcrTermSd = Acr0TermSd + ((TermGong  - Acr0Sun.SunGong) / SunAvgVd)
        // 下再用推節氣時刻法。沒有推逐日太陽宮度，為了少點麻煩，只用本日次日，不考慮再昨天或明天的情況。與曆書相較密合。
        let AcrTermSd = 0
        const SunTod = sunShixian(Name, SunRoot, SperiRoot, ~~Acr0TermSd)
        const SunMor = sunShixian(Name, SunRoot, SperiRoot, ~~Acr0TermSd + 1)
        const MidnTod = SunTod.SunGong
        const MidnMor = SunMor.SunGong
        AcrTermSd = ~~Acr0TermSd + (TermGong - MidnTod + (TermGong === 0 ? 360 : 0)) / (MidnMor - MidnTod)
        const NowTermSd = AcrTermSd + timeAvg2Real(Sobliq, SunTod.SunCorr, SunTod.SunLon)
        const TermAcrSc = ScList[(SolsmorScOrder + ~~NowTermSd) % 60]
        const TermAcrDeci = deci(NowTermSd).toFixed(4).slice(2, 6)
        const TermEclp = Gong2Mansion(Name, Y, TermGong).Mansion
        return { TermSc, TermDeci, NowTermSd, TermAcrSc, TermAcrDeci, TermEclp }
    }
    const main = (isNewm, LeapNumTerm) => {
        const AvgSc = [], AvgDeci = [], NowSc = [], NowDeci = [], NowSd = [], Eclp = [], TermSc = [], TermDeci = [], NowTermSd = [], TermAcrSc = [], TermAcrDeci = [], Term1Sc = [], Term1Deci = [], NowTerm1Sd = [], TermEclp = [], Term1AcrSc = [], Term1AcrDeci = [], Term1Eclp = [], Ecli = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望
            const AvgSd = ChouSd + (1 + i - (isNewm ? 1 : .5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgSdMidn = ~~AvgSd
            AvgSc[i] = ScList[(SolsmorScOrder + AvgSdMidn) % 60]
            AvgDeci[i] = deci(AvgSd - AvgSdMidn).toFixed(4).slice(2, 6)
            if (Name === 'Guimao') {
                //////// 實朔望泛時
                let { Speri: SperiMidnTod, Sorb: SorbMidnTod, SunCorr: SunCorrMidnTod, SunLon: SunLonMidnTod, SunGong: SunGongMidnTod } = sunShixian(Name, SunRoot, SperiRoot, AvgSdMidn)
                const { MoonLon: MoonLonMidnTod } = moonGuimao(MoonRoot, NodeRoot, MapoRoot, AvgSdMidn, SunCorrMidnTod, SunGongMidnTod, SperiMidnTod, SorbMidnTod)
                SunLonMidnTod += isNewm ? 0 : 180
                SunLonMidnTod %= 360
                let { Speri: SperiMidnMor, Sorb: SorbMidnMor, SunCorr: SunCorrMidnMor, SunLon: SunLonMidnMor, SunGong: SunGongMidnMor } = sunShixian(Name, SunRoot, SperiRoot, AvgSdMidn + 1)
                const { MoonLon: MoonLonMidnMor } = moonGuimao(MoonRoot, NodeRoot, MapoRoot, AvgSdMidn + 1, SunCorrMidnMor, SunGongMidnMor, SperiMidnMor, SorbMidnMor)
                SunLonMidnMor += isNewm ? 0 : 180
                SunLonMidnMor %= 360
                let Acr0SdMidn = AvgSdMidn, Acr0Deci = 0
                if (t(MoonLonMidnTod - SunLonMidnTod) > 180) { // 如太陰實行未及太陽，則平朔日為實朔本日
                    if (t(MoonLonMidnMor - SunLonMidnMor) > 180) { // 如次日太陰實行仍未及太陽，則次日爲實朔日
                        Acr0SdMidn = AvgSdMidn + 1
                        Acr0Deci = t(SunLonMidnMor - MoonLonMidnMor) / (t(MoonLonMidnMor - MoonLonMidnTod) - t(SunLonMidnMor - SunLonMidnTod))
                    } else {
                        Acr0Deci = t(SunLonMidnTod - MoonLonMidnTod) / (t(MoonLonMidnMor - MoonLonMidnTod) - t(SunLonMidnMor - SunLonMidnTod)) // 分子：一日之月距日實行：三率，分母：一日之月實行與一日之日實行相減，爲一日之月距日實行：一率。實際上是t=s/v
                    }
                } else { // 如太陰實行已過太陽，則平朔前一日為實朔本日。
                    Acr0SdMidn = AvgSdMidn - 1
                    Acr0Deci = 1 - t(MoonLonMidnTod - SunLonMidnTod) / (t(MoonLonMidnMor - MoonLonMidnTod) - t(SunLonMidnMor - SunLonMidnTod))
                }
                //////// 實朔望實時
                const AcrSd = iteration(Acr0SdMidn + Acr0Deci, .5 / 24, isNewm)
                // const Acr2Sd = iteration(AcrSd, .1 / 24, isNewm)
            }
            const { Speri: AcrSperi, Sorb: AcrSorb, SunCorr: AcrSunCorr, SunGong: AcrSunGong, SunLon: AcrSunLon } = sunShixian(Name, SunRoot, SperiRoot, AcrSd)
            const { Whitelongi: AcrWhitelongi } = moonGuimao(MoonRoot, NodeRoot, MapoRoot, AcrSd, AcrSunCorr, AcrSunGong, AcrSperi, AcrSorb)
            NowSd[i] = AcrSd + timeAvg2Real(Sobliq, AcrSunCorr, AcrSunLon)
            NowDeci[i] = deci(NowSd[i]).toFixed(4).slice(2, 6)
            NowSc[i] = ScList[(SolsmorScOrder + ~~NowSd[i]) % 60]
            Eclp[i] = Gong2Mansion(Name, Y, AcrSunGong).Mansion
            //////// 交食
            let isEcli = false // 入食限可以入算
            const tmp = t3(AcrWhitelongi) // 距離0、180的度數            
            if (isNewm) isEcli = AcrWhitelongi % 180 < 180 ? tmp < SunLimitYinAcr : tmp < SunLimitYangAcr
            else isEcli = tmp < MoonLimit
            if (isEcli) {
                if (isNewm) {
                    Ecli[i] = sunEcliGuimao(NowSd[i], AcrSunLon)
                }
                else Ecli[i] = moonEcliGuimao(NowSd[i], AcrSunLon)
            }
            //////// 節氣
            if (isNewm) {
                const Func = term(i, true)
                TermSc[i] = Func.TermSc
                TermDeci[i] = Func.TermDeci
                NowTermSd[i] = Func.NowTermSd
                TermAcrSc[i] = Func.TermAcrSc
                TermAcrDeci[i] = Func.TermAcrDeci
                TermEclp[i] = Func.TermEclp
                const Func1 = term(i, false)
                Term1Sc[i] = Func1.TermSc
                Term1Deci[i] = Func1.TermDeci
                NowTerm1Sd[i] = Func1.NowTermSd
                Term1AcrSc[i] = Func1.TermAcrSc
                Term1AcrDeci[i] = Func1.TermAcrDeci
                Term1Eclp[i] = Func1.TermEclp
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
            // 1738年NoleapMon會因為去年不閏而閏多一個月，暫時不想解決
            if (Ecli[i]) {
                if (isNewm) {
                    EcliPrint[i] = `<span class='eclipse'>S${NoleapMon}</span>`
                    EcliPrint[i] += '出' + Ecli[i].Rise + ' ' + Ecli[i].Magni + '% 虧' + Ecli[i].Start + '甚' + Ecli[i].Total + '復' + Ecli[i].End + ' 入' + Ecli[i].Sunset
                } else {
                    EcliPrint[i] = `<span class='eclipse'>M${NoleapMon}</span>`
                    EcliPrint[i] += '入' + Ecli[i].Sunset + ' ' + Ecli[i].Magni + '% 虧' + Ecli[i].Start + '甚' + Ecli[i].Total + '復' + Ecli[i].End + ' 出' + Ecli[i].Rise
                }
                if (Ecli[i].Magni >= 99) {
                    NowSc[i] += `<span class='eclipse-symbol'>●</span>`
                } else if (Ecli[i].Magni > 10) {
                    NowSc[i] += `<span class='eclipse-symbol'>◐</span>`
                } else if (Ecli[i].Magni > 0) {
                    NowSc[i] += `<span class='eclipse-symbol'>◔</span>`
                }
            }
        }
        return {
            AvgSc, AvgDeci,
            NowSc, NowDeci, NowSd, Eclp,
            TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEclp,
            Term1Sc, Term1Deci, NowTerm1Sd, Term1AcrSc, Term1AcrDeci, Term1Eclp, EcliPrint, LeapNumTerm
        }
    }
    const {
        AvgSc: NewmAvgSc, AvgDeci: NewmAvgDeci, NowSc: NewmSc, NowDeci: NewmDeci, NowSd: NewmSd, Eclp: NewmEclp, EcliPrint: SunEcli,
        TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEclp,
        Term1Sc, Term1Deci, NowTerm1Sd, Term1AcrSc, Term1AcrDeci, Term1Eclp, LeapNumTerm
    } = main(true)
    const {
        NowSc: SyzygySc, NowDeci: SyzygyDeci, EcliPrint: MoonEcli
    } = main(false, LeapNumTerm)
    return {
        LeapNumTerm, NewmAvgSc, NewmAvgDeci, NewmSc, NewmDeci, NewmEclp, SyzygySc, SyzygyDeci, SunEcli, MoonEcli, TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermEclp,
        Term1Sc, Term1Deci, Term1AcrSc, Term1AcrDeci, Term1Eclp,
        //// 曆書用
        SunRoot, SperiRoot, MoonRoot, MapoRoot, NodeRoot, SolsAccum, MansionDaySolsmor, NewmSd, SolsmorScOrder, NowTerm1Sd
    }
}
// console.log(N4("Guimao", 1762)) // 《後編》卷三《日食食甚真時及兩心視距》葉64算例，見說明文檔
// console.log(sunShixian(Name,SunRoot, SperiRoot,313)) // 日躔與這個驗算無誤 https://zhuanlan.zhihu.com/p/526578717 算例：Sd=313，SunRoot=0+38/60+26.223/3600，SperiRoot=166*(1/60+2.9975/3600)
// 月離與這個驗算無誤 https://zhuanlan.zhihu.com/p/527394104
// Sorb = 298 + 6 / 60 + 9.329 / 3600
// AvgMoon1 = 295.5279086111
// AvgMapo1 = 100.82456
// AvgNode1 = 95 + 42 / 60 + 47.522 / 3600
// SunCorr = -(1 + 43 / 60 + 6.462 / 3600)
// SunLon = 217 + 25 / 60 + 46.766 / 3600
// Speri = 281 + 2 / 60 + 43.899 / 3600 - 270

// 以下是三條月亮初均驗算
// console.log(Corr1(.04904625, 206 + 22 / 60 + 21.88 / 3600))
// 小均 4331900  +572,725
// 2+13/60+57/3600=2.2325// 6宮26度20分
// 2+14/60+46/3600=2.2461111111 +.0136111111 //30分
// 2.2325+.0136111111*.2=2.2352222222
// 中 5505050 +1173150
// 2+52/60+36/3600=2.8766666667// 6宮26度20分
// 2+53/60+39/3600=2.8941666667 +.0175
// 2.8766666667+.0175*.2=2.8801666667
// 572,725/1173150=.4881941781. 2.8801666667-2.2352222222=.6449444445
// 結果2.5500803452
// console.log(Corr1(.0446505, 107 + 41 / 60 + 27 / 3600 + 22 / 216000)) // 《十月之交細草》卷上葉25, Corr = -(4 + 57 / 60 + 13 / 3600 + 19 / 216000)=-4.9536990741
// // 3宮17度
// 4+48/60+14/3600=4.8038888889
// 4+48/60+1/3600 =4.8002777778  -.0036111111。4.8035277778
// 6+7/60+43/3600=6.1286111111
// 6+7/60+27/3600=6.1241666667 -.0044444444。6.1281666667
// 13,315/117315=.1134978477。6.1281666667-4.8035277778=1.3246388889，4.8035277778+1.3246388889*.1134978477=4.9538714407
// console.log(Corr1(.0455941, 108 + 43 / 60)) // 考成後編表

// console.log(atan(cos(23.9) * tan((340))))
// console.log(atan(.1328888016451028/sin(18.7)))
