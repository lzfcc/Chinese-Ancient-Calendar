// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import Para from './para_calendars.mjs'
import { ScList, deci, fix } from './para_constant.mjs'
import { mansionQing } from './astronomy_other.mjs'
import { clockQingB } from './time_decimal2clock.mjs'
const abs = X => Math.abs(X)
const sign = X => Math.sign(X)
const pi = Math.PI
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = X => Math.sin(d2r(X))//.toFixed(8) // 數理精蘊附八線表用的是七位小數
const sin2 = X => 2 * sin(X / 2) // 通弦
const cos = X => Math.cos(d2r(X)) //.toFixed(8)
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
export const Lon2Gong = Lon => (Lon + 90) % 360
export const Gong2Lon = Gong => (Gong + 270) % 360
export const LonHigh2Flat = (e, X) => ~~(Math.ceil(X / 90) / 2) * 180 + atan(cos(e) * tan(X)) // 傾角、經度，用於黃轉赤，白轉黃
export const GongHigh2Flat = (e, X) => Lon2Gong(LonHigh2Flat(e, Gong2Lon(X)))
const LonHigh2FlatB = (Lat, X) => acos(cos(X) / cos(Lat)) // 已知黃經赤緯求赤經
export const LonFlat2High = (e, X) => Math.ceil(Math.ceil(X / 90) / 2) * 180 - 90 - atan(cos(e) * cot(X)) // 赤轉黃，黃轉白
export const GongFlat2High = (e, X) => Lon2Gong(LonFlat2High(e, Gong2Lon(X)))
export const HighLon2FlatLat = (e, X) => asin(sin(e) * sin(X)) // 月距正交轉黃緯
// console.log(LonHigh2Flat(23.4916666666667, 15))
// console.log(LonFlat2High(23.4916666666667,73.80638)) // 考成卷八葉37算例
// const LowLon2LowLat = (e, X) => atan(tan(e) * sin(X)) // 求赤經高弧交角用到這個的變形
// const LowLat2HighLon = (e, X) => // 已知太陽赤緯轉黃經
// console.log(LonHigh2Flat(23.5,15))
// console.log(HighLon2FlatLat(23 + 29 / 60,112.28487818))
// console.log(LowLat2HighLon(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=.3973413465. HAB=23.41207808
// https://zhuanlan.zhihu.com/p/265334815 清代日出公式推導
export const sunRiseQing = (Sobliq, RiseLat, Lon) => .25 + (Lon < 180 ? -1 : 1) * (asin(tan(abs(HighLon2FlatLat(Sobliq, Lon)) * tan(RiseLat))) / 360) // 日出時刻。這個經度應該是正午的經度??
export const moonRiseQing = (RiseLat, MEquaLon, MEquaLat, SEquaLon) => {
    const MSDif = (MEquaLon - SEquaLon + 360) % 360
    const Dif = (MEquaLon < 180 ? -1 : 1) * asin(tan(abs(MEquaLat) * tan(RiseLat))) // 出地在卯正前後赤道度。太陰在赤道南，出在卯正後。前減後加
    const RiseTmp = .25 + (MSDif + Dif) / 360
    const SetTmp = .75 + (MSDif - Dif) / 360
    return {
        MoonRise: deci(RiseTmp + 12 * RiseTmp / 360),
        MoonSet: deci(SetTmp + 12 * SetTmp / 360)
    }
}
export const deg2Hms = deg => {
    const Deci = deci(deg)
    const m = ~~(60 * Deci)
    const s = ~~(3600 * Deci - 60 * m)
    // const ss = Math.round(216000 * Deci - 3600 * m - 60 * s)
    return ~~deg + '°' + m + '′' + s + '″' // + ss
}
export const Lat2NS = X => (X > 0 ? 'N' : 'S') + deg2Hms(Math.abs(X))
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
// console.log(qiexianA(.0338, 2, 60))
const aCtimeb_Sph = (a, b, AngCTime) => {
    const AngC = abs(.5 - deci(AngCTime)) * 360 // 用時太陽距午赤道度
    const b1 = LonHigh2Flat(AngC, a) // 距極分邊
    const b2 = b - b1  // 自天頂作垂線，得距極分邊，再與太陽距極相加減，得距日分邊。距午度<90度，垂線在三角形內，相減，>90相加。            
    const tanH = tan(AngC) * sin(b1) // 垂弧之正切
    const AngA = (deci(AngCTime) < .5 ? 1 : -1) * (atan(tanH / sin(b2)) + 180) % 180 // 用時赤經高弧交角。若距極分邊轉大於太陽距北極，則所得爲外角，與半周相減。午前赤經在高弧東，午後赤經在高弧西。
    // const c = asin(sin(AngC) * sina / sin(abs(AngA))) // 用時太陽距天頂
    const c = LonFlat2High(AngA, b2) // 我的等效算法。經實驗，如果三角函數取小數點後8位，20.12486241，本來是20.1248526178365
    return { AngA, c }
}
// 球面三角已知兩角夾邊求另一角cosA=－cosBcosC+sinBsinCcosa
const BaC_Sph = (B, C, a) => acos(sin(B) * sin(C) * cos(a) - cos(B) * cos(C))
// console.log(BaC_Sph(90, 83.61729023292902, 72.7386111111)) // 72.84893171874154
// console.log(BaC_Sph(72.8488888889,90,LonHigh2Flat(72.8488888889, 90 - abs(62.06444444444)))) //19.255410907734177
// 斜弧三角形已知兩邊和夾角求另一邊
const aCb_Sph = (a, b, C) => { // 納白爾公式 https://wenku.baidu.com/view/145cd0f4b84cf7ec4afe04a1b0717fd5360cb2f1.html
    const tanAPlBDiv2 = cos((a - b) / 2) / cos((a + b) / 2) * cot(C / 2)
    const tanAMiBDiv2 = sin((a - b) / 2) / sin((a + b) / 2) * cot(C / 2)
    const tancdiv2 = cos(atan(tanAPlBDiv2)) / cos(atan(tanAMiBDiv2)) * tan((a + b) / 2)
    return atan(tancdiv2) * 2
}
// 已知三個角一邊求b邊。sinAcosb=cosBsinC+sinBcosCcosa
const ABCa_Sph = (A, B, C, a) => acos((cos(B) * sin(C) + sin(B) * cos(C) * cos(a)) / sin(A))
// console.log(ABCa_Sph(72.8488888889,90,83.61729023292902,72.7386111111))// 88度1分18秒=88.02166666667
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
// console.log(aCb_Sph(73.806348227262589, 75.08623544960639, 23.4916666666667)) // 22度39分19秒=22.6552777778)
// console.log(abc_Sph(73.806348227262589, 75.08623544960639, 22.655413696754813)) // 83度37分4秒，83.61729023292902
const White2Eclp = (Mobliq, Node, Whitelongi) => {
    // 黃道緯度。月距正交过一象限者与半周相减，过半周者减半周，过三象限者与全周相减
    // const EclpWhiteDif = TwoOrbdegDif(Mobliq, Whitelongi) // 升度差=月距正交之黃道度-月距正交。食甚距時加者亦爲加，減者亦爲減。⚠️我這裡符號用的食甚的月距正交，而非食甚距時所用的實望的月距正交
    // const TotalMLat = sin(90 - AngEquiEclp) * Dist // 這是食甚實緯之南北。
    // 月距正交初、一、二、六、七、八宫为交后，为减。三、四、五、九、十、十一宫为交前，为加。之所以%180，因為tan(20)=tan(200)
    // const MoonGong = t(Whitegong + EclpWhiteDif)
    return {
        MoonLon: Gong2Lon(LonHigh2Flat(Mobliq, Whitelongi) + Node),
        MoonLat: HighLon2FlatLat(Mobliq, Whitelongi)
    }
}
export const starEclp2Equa = (Sobliq, Lon, Lat) => { // 黃赤大距、黃經、黃緯
    const Gong = Lon2Gong(Lon)
    const EquaLat = 90 - aCb_Sph(Sobliq, 90 - Lat, t1(Gong)) // 赤緯
    const A = acos(
        (cos(90 - Lat) - cos(Sobliq) * cos(90 - EquaLat)) /
        (sin(Sobliq) * sin(90 - EquaLat)))  // cosA=(cosa-cosb·cosc)/(sinb·sinc)
    return {
        EquaLon: Gong2Lon(Gong < 180 ? A : 360 - A),
        EquaLat
    }
}
// console.log(LonHigh2Flat(23 + 29.5 / 60, 45))
// console.log(starEclp2Equa(23 + 29.5 / 60, 135, 0).EquaLon)
// console.log(starEclp2Equa(23 + 29.5 / 60, 27 + 10 / 60, 29 + 22 / 60)) // 考成卷十六恆星曆理算例:赤經緯23度41分58秒=23.6994444444，8度5分4秒=8.08444444444
const moonEclp2EquaGuimao = (Sobliq, Lon, Lat) => { // 《後編》已知黃道經緯度求赤道經緯度，見月食曆法
    const A_ArcMNox_Eclp = (Lat > 0 ? 1 : -1) * t3(acot(sin(t3(Lon)) * cot(Lat))) // 太陰距二分弧與黃道交角。單獨算沒問題。近似成平面三角就可以了 sinAcotB=cotC，也就是a/r·r/h=a/h
    const A_ArcMNox_Equa = (Lon > 180 ? -1 : 1) * Sobliq + A_ArcMNox_Eclp // 太陰距二分弧與赤道交角
    // 思路：黃轉白，白轉赤。
    const tanA_ArcMNox_Equa = cos(A_ArcMNox_Eclp) * tan(Lon) // 太陰距二分弧之正切線
    const EquaLon = ~~(Math.ceil(Lon / 90) / 2) * 180 + atan(cos(A_ArcMNox_Equa) * tanA_ArcMNox_Equa) // 太陰距二分赤道經度
    return {
        EquaLon,
        EquaLat: atan(tan(A_ArcMNox_Equa) * sin(t3(EquaLon)))
    }
}
// console.log(starEclp2Equa(23.9, 220, 5))
// console.log(moonEclp2EquaGuimao(23.9, 220, 5)) // 離黃道不遠的時候兩者區別不大
export const twilight = (Sobliq, RiseLat, SunLon) => { // 民用曚影時長。應該也是用的正午太陽緯度
    const limit = 6 // 民用6度，天文18度
    const a = 90 + limit
    const b = 90 - RiseLat // 所在地北極距天頂
    const c = 90 - HighLon2FlatLat(Sobliq, SunLon)
    const Rise = sunRiseQing(Sobliq, RiseLat, SunLon)
    return abc_Sph(a, b, c) / 360 - (.5 - Rise)
}
// console.log(twilight(23.4916666667, 39.9166666667, 270)) // 日出0.3090277778，曚影0.07083333333
// 蒙氣差
const refractionGuimao = h => {
    const a = tan(90 - h) ** 2 + 1
    const delta = 4 + 4 * a * 2.0006095 * .0006095
    const X = (-2 + sqr(delta)) / (2 * a) // 根據公式1 ，一元二次方程求根公式
    const ang1 = asin((1 + X) / 1.0006095) - h
    const ang2 = asin(sin(ang1) * 1.0002841)
    return ang2 - ang1
}
// console.log(atmos(20)) // .04453873130688635
// 褚龙飞《崇祯历书系列历法中的太阳运动理论》：「可以断定日躔加减差表应该是根据对分圆模型计算而来的。」「从图上来看，平行心应为丙，即太阳应相对于丙作匀角速运动。这样，辛就应该是本轮圆心，辛乙才是本轮半径。」從上到下依此為平行心、本輪心、地心
// const corrRingB = OrbRaw => { 
//     OrbRaw = (OrbRaw + 360) % 360
//     const X1 = (OrbRaw + 180) % 360 // 暫時最高起算
//     const Xt = t3(X1)
//     const R0 = .0358416 // 兩心差
//     const H1 = sin(Xt) * R0 / 2
//     const A1 = asin(H1 / 1)
//     const B1 = cos(Xt) * R0 / 2
//     const B2 = cot(A1) * H1 + (t2(X1) < 90 ? 2 : -2) * B1
//     const A2 = atan(H1 / B2)
//     return {
//         SunCorr: f2(OrbRaw) * (A1 + A2),
//         SDist: sqr(B2 ** 2 + H1 ** 2)
//     }
// }
export const corrRingA = (Orb, c) => { // 對分圓模型。可參看廖育棟文檔改編。從上到下D、本輪心O、地心C，CO=OD=E，太陽在S，作OH⊥CS，DJ⊥CS。《後編》《用橢圓面積爲平行》「新法算書第谷所定之最大差爲2度3分11秒=2.05305」《求兩心差》「新法算書日躔中距之盈縮差爲2度3分9秒40微=2.052685」
    if (c > .025) Orb = (Orb + 180) % 360 // 月亮
    const OH = sin(Orb) * c
    const CH = cos(Orb) * c
    const DJ = 2 * OH
    const HS = sqr(1 - OH ** 2)
    const HJ = CH
    const JS = HS - HJ
    return {
        Corr: +atan(DJ / JS).toFixed(12), // 初均
        d: HS - CH // 日地距離
    }
}
// 測本輪大小遠近及加減差後法第七，近世歌白尼法，今時通用。崇禎曆書對幾個均數的定義也很迷惑，第十二說本輪次輪產生一二均，也就是考成的初均。對比表格，崇禎曆書自行加減表=考成初均表
export const corrRingC = (Orb, c) => { // 第谷本輪均輪模型。省略了符號判斷
    let p = 3, q = 1 / 2
    if (c > .025) {
        p = 2
        q = 2 / 3 // 太陽r1 = .0268812, r2 = .0089604, c=.0179208 // 太陰初均r1 = .058, r2 = .029, c=.0435
        Orb = (Orb + 180) % 360
    }
    const r2 = c * q, r1 = r2 * p
    const a = (p + 1) * r2 * sin(Orb)
    const b = 1 - (r1 - r2) * cos(Orb)
    const Corr = +(atan(a / b)).toFixed(12)
    const d = b / cos(Corr)
    return { Corr, d }
}
// console.log(corrRingC(198 + 40 / 60 + 57.4 / 3600, .)) // -0°38′48.49″=0.6468027778 // https://zhuanlan.zhihu.com/p/511793561
// const distEllipse = (T, c) => { 錯的
//     const a = 1, b2 = a ** 2 - c ** 2
//     return b2 / (a - c * d2r(cos(T)))
// }
// 後編《月離算法》求日地距離
const distEllipseA = (Orb, c) => { // 作垂線成兩勾股法，見以角求積。已知橢圓某點角度、橢圓倍兩心差，求距地心長度。日在辛，地在甲，另一焦點丙，延長辛甲到壬，丙壬⊥辛壬。甲辛=x，(2-x)^2=h^2+(a+x)^2。
    const c2 = c * 2
    if (c2 > .04) Orb = t1(Orb) // 月亮
    const g = cos(Orb) * c2 // 分股，甲壬
    const h = sin(Orb) * c2 // 勾，丙壬
    const Sum = 2 + g // 勾弦和
    const Dif = h ** 2 / Sum // 勾弦較
    const l = (Sum + Dif) / 2 // 弦
    return 2 - l
    // return (4 - h ** 2 - a ** 2) / (2 * a + 4) // 我自己的算法 
}
const distEllipseB = (Orb, c) => { // 以角求積又法，延長線
    const a = 1, a2 = 2, c2 = c * 2
    const A1 = qiexianA(c2, 2, t1(Orb)) // 壬角
    const g2 = sqr(c2 ** 2 + a2 ** 2 - 2 * c2 * a2 * cos(t1(Orb))) // 丙壬邊
    const l = g2 / 2 / cos(A1)
    return a2 - l
}
// 《日食算法》求日地距離
const distEllipseC = (Sorb, c) => { // 小股y=(4*d-4-c2**2)/(2*c2)，c2+y=cos(Sorb)*d
    const c2 = c * 2
    let d = 0
    if (c2 < .04) { // 太陽從近地點起算
        if (Sorb > 90 && Sorb < 270) d = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cos(t3(Sorb)))
        else d = (4 - c2 ** 2) / (4 + 2 * c2 * cos(t3(Sorb)))
    } else { // 月亮從遠地點起算
        if (Sorb > 90 && Sorb < 270) d = (4 - c2 ** 2) / (4 + 2 * c2 * cos(t3(Sorb)))
        else d = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cos(t3(Sorb)))
    }
    return d
}
const distEllipse = (Orb, c) => { // 現代公式。輸入：真近點角
    const a = 1
    const E = acos((c + cos(Orb)) / (1 + c * cos(Orb))) // 真近點角轉偏近點角
    return a * (1 - c * (cos(E)))
}
// console.log(distEllipse(260, .0169))
// console.log(distEllipseB(260, .0169))
// console.log(distEllipseA(60, .0338))
// console.log(distEllipseB(120, .0338))
const corrEllipse0A = (TRaw, c) => { // 見日躔數理以角求積，實行-->平行。其他corrEllipse都是平行-->實行
    if (c > .025) TRaw = (TRaw + 180) % 360 // 太陰
    TRaw = t(TRaw)
    const T = t3(TRaw)
    const a = 1, c2 = c * 2, b = sqr(a ** 2 - c ** 2)
    const S0 = pi * a * b
    const d = distEllipseA(c > .025 ? (TRaw + 180) % 360 : TRaw, c) // 恢復，因為distEllipseA也要加180
    const h = sin(T) * d // 辛癸
    const h1 = h * a / b // 大小徑比例得子癸
    const Ar1 = asin(h1 / a) // 子乙丁角
    const Sr1 = pi * Ar1 / 360 // 子丁分平圓面積
    const Se1 = Sr1 * b / a // 辛丁分橢圓面積
    const Sdif = c * h / 2 // 三角形辛甲乙面積
    const SAvg = Se1 + (TRaw > 90 && TRaw < 270 ? 1 : -1) * Sdif
    const S = (TRaw % 180 < 90 ? SAvg : S0 / 2 - SAvg) + (TRaw > 180 ? S0 / 2 : 0)
    return S / S0 * 360
}
const corrEllipse0 = (T, c) => { // 輸入
    T = d2r(T)
    const E = 2 * Math.atan(sqr((1 - c) / (1 + c)) * Math.tan(T / 2)) // 真近點角轉偏近點角
    return r2d(E - c * Math.sin(E)) + (T > pi ? 360 : 0)
}
// console.log(corrEllipse0A(31, .2))
// console.log(corrEllipse0(211, .2))
// console.log(sunAcr2AvgEllipse(60)) // 60: 58.33348625, 240:241.687772
const corrEllipseA = (Orb, c2) => { // 日躔數理以積求角法。實際使用時需要把之前的累加起來
    const a = 1, c = c2 / 2, b = sqr(a ** 2 - c ** 2)
    // const S1 = pi * a * b / 360
    const d = distEllipseA(Orb, c)
    return a * b / d ** 2 // a*b=中率自乘
}
// console.log(corrEllipseA(1, .0338)) // 0:1.034528786002214，1:1.0345235488620437，相加得2.06905233486
export const corrEllipseB1 = (OrbRaw, c) => {  // 日躔數理借積求積法。Ae橢圓上一點的角，Ar平圓上一點的角。誤差1e-8度
    if (c > .025) OrbRaw = (OrbRaw + 180) % 360 // 太陰
    const OrbT = t3(OrbRaw)
    const Orb = OrbRaw % 180
    const a = 1, c2 = c * 2, b = sqr(a ** 2 - c ** 2)
    const Se0 = pi * a * b, Sr0 = pi // 橢圓、平圓面積
    const Se1 = OrbT / 360 * Se0 // 分橢圓面積
    const Sr1 = a / b * Se1
    const Ar1 = Sr1 / Sr0 * 360
    const Ae1 = atan(b / a * tan(Ar1)) // 由圓心平行面積得到了圓心實行度
    const h1 = sin(Ae1) * c2 // 自地心作垂線
    const g1 = cos(Ae1) * c2
    const Sum = 2 + (OrbRaw > 90 && OrbRaw < 270 ? 1 : -1) * g1 // 勾弦和
    const Dif = h1 ** 2 / Sum // 勾弦較
    const l2 = (Sum + Dif) / 2 // 甲癸邊
    const Ae2 = asin(h1 / l2) // 癸角
    const Ae3 = (OrbRaw > 90 && OrbRaw < 270 ? 180 - Ae1 : Ae1) + Ae2 // 癸甲丁角
    // 下為以角求積法的主體
    const he3 = sin(Ae3) * l2 // 癸辰垂線
    const hr3 = he3 * a / b // 大小徑比例得
    const Aor3 = asin(hr3 / a) // 乙角
    const Sor1 = pi * Aor3 / 360 // 分平圓面積
    const Soe1 = Sor1 * b / a // 癸乙丁分橢圓面積
    const Seo2 = Soe1 - Se1
    const Sdif = c * he3 / 2 + (OrbRaw >= 90 && OrbRaw <= 270 ? 1 : -1) * Seo2 // 如果寫成OrbRaw > 90 && OrbRaw < 270，在90、270會出問題
    // 以積求角
    const Delta = Sdif * (a * b) / l2 ** 2 / Se0 * 360
    return +((f2(OrbRaw) * (Ae3 + Delta) - Orb + 180) % 180).toFixed(12)
}
// console.log(corrEllipseB1(45, .0338)) // 46.38170938457123
// const corrEllipseB2 = (OrbRaw, c) => { // 日躔數理借積求積又法
//     const a = 1, c2 = c * 2, b = sqr(a ** 2 - c ** 2)
//     const Ae1 = t3(OrbRaw) // 直接設丙角爲平行度=上法之Aor3乙角

//     const h1 = sin(Ae1) * c2 // 自地心作垂線
//     const g1 = cos(Ae1 * c2
//     const Sum = 2 + (OrbRaw > 90 && OrbRaw < 270 ? 1 : -1) * g1 // 勾弦和
//     const Dif = h1 ** 2 / Sum // 勾弦較
//     const l2 = (Sum + Dif) / 2 // 甲癸邊
//     const Ae2 = asin(h1 / l2) // 癸角
//     const Ae3 = (OrbRaw > 90 && OrbRaw < 270 ? 180 - Ae1 : Ae1) + Ae2 // 癸甲丁角
//     // ⋯⋯⋯⋯⋯⋯
//     return
// }
export const corrEllipseC = (OrbRaw, c) => { // 借角求角法。大徑1、小徑0.999857185、avg中率0.999928589、兩心差（焦距）倍之.0338000。中距盈縮差1°56′12″。石雲里：17世紀的Ismael Boulliau的簡化模型
    if (c > .025) OrbRaw = (OrbRaw + 180) % 360 // 太陰
    const a = 1, c2 = c * 2, b = sqr(a ** 2 - c ** 2)
    const OrbT = t3(OrbRaw)
    // 求對甲丙倍差之午角：作輔助線延長丙午到寅。丙寅=甲午+丙午=2a，求得∠寅，橢圓界角∠午=2*∠寅。注意，和求地日距離那個延長線不一樣！
    const Ae = 2 * qiexianA(c2, 2, OrbRaw)
    // 求橢圓差角未丙午，見上文葉37條    
    const Adif = OrbT - atan(tan(OrbT) * b / a)
    return +(f2(OrbRaw) * (Ae + (OrbRaw > 90 && OrbRaw < 270 ? -1 : 1) * Adif)).toFixed(12)
}
export const corrEllipseD1 = (OrbRaw, c) => { // 見石雲里《历象考成后编中的中心差求法及其日月理论的总体精度》，卡西尼模型完整版，誤差比借積求積更小
    const a = 1, b = sqr(a ** 2 - c ** 2)
    if (c < .025) OrbRaw = (OrbRaw + 180) % 360 // 太陽
    const Orb = t2(OrbRaw)
    const Aor1 = qiexianA(c, a, t1(OrbRaw)) // ∠CJS
    const Arc1 = d2r(Aor1) // JQ弧=∠JCQ≒∠CJS
    const l1 = sqr(a ** 2 + c ** 2 + 2 * a * c * cos(t2(OrbRaw))) // SJ
    const Arc3 = (Arc1 - Math.sin(Arc1)) / l1 // ∠SJN ≒ sin∠SJN =SN/SJ=(NT-ST)/SJ，棋瀚案：其中NT-ST=JQ-JW，把整個值放大了一點，JQ-JW=∠JCQ-sin∠JCQ，而∠JCQ≒CJS之後把∠JCQ縮小了一點，所以一放一縮，大致NT-ST=∠CJS-sin∠CJS。又再進行一次近似∠SJN ≒ sin∠SJN
    const Ar3 = r2d(Arc3)
    // 為何不增加一步sin變角？
    // const Ar3 = r2d(Math.asin(Arc3)) // 沒啥區別，多餘
    const Aor2 = Orb - Aor1 + Ar3 // ∠QCR
    const Ar4 = qiexianA(a, c, t1(Aor2)) // ∠QSC
    const Aacr = atan(tan(Ar4) * b / a)
    return +(((Aacr - Orb) * f2(OrbRaw) + (OrbRaw > 90 && OrbRaw < 270 ? 180 : 0)) % 180).toFixed(12) // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加
}
export const corrEllipseD2 = (OrbRaw, c) => { // 月離曆理葉28初均。可參看石雲里《历象考成后编中的中心差求法及其日月理论的总体精度》，是卡西尼模型的簡化版
    const a = 1, b = sqr(a ** 2 - c ** 2)
    if (c < .025) OrbRaw = (OrbRaw + 180) % 360 // 太陽
    const Orb = t2(OrbRaw)
    const Ar1 = qiexianA(c, 1, t1(OrbRaw)) // 对两心差之小角甲庚乙。引数不及半周者，与半周相减。过半周者，则减半周。
    const Ar2 = qiexianA(1, c, Ar1 + t1(OrbRaw)) // 对半径之大角乙甲巳，为平圆引数
    const Ae2 = (atan(tan(Ar2) * b / a) + 180) % 180
    return +((Ae2 - Orb) * f2(OrbRaw)).toFixed(12) // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加    
}
// 現代迭代方法。石雲里《历象考成后编中的中心差求法及其日月理论的总体精度》給出的現代算法：「对每一个给定的M值，先将E0=M作为偏近点角代入刻卜勒方程E=M+esinE的右边，依次求出 E1=M+esinE0，E2=M+esinE1，E3=M+esinE2⋯⋯直到| Ei — Ei+1 |小于10^-15，取Ei为偏近点角，进而求出相应的真近点角，再由真近点角减平近点角求出中心差。」（E偏近點角，M平近點角）
// 本函數參考李广宇《天体测量和天体力学基础》12.3、p114用牛頓迭代
// 又見《數》頁135；武家璧《大衍曆日躔表的數學結構及其內插法》日躔差=真近點角V-平近點交角M。V=M+2*e*sinM+1.25*e**2*sin2M   均數極值2e（弧度）。
export const corrEllipse = (OrbD, c) => {
    if (c > .025) OrbD = (OrbD + 180) % 360 // 太陰遠地點起算
    const Orb = d2r(OrbD) // 注意：一定要全部換成弧度！
    let D = Orb < pi ? c : -c
    let E = Orb
    const delta = E => (Orb - E + c * Math.sin(E)) / (1 - c * Math.cos(E))
    while (abs(D) > 1e-10) { // 偏心率.1以內只需要3次迭代就收斂
        E += D
        D = delta(E)
    }
    // tanF=sqrt(1-e^2)sin(E)/(cosE-e)
    const F = r2d(Math.atan((sqr(1 - c ** 2) * Math.sin(E)) / (Math.cos(E) - c)))
    return (F - OrbD + 180) % 90

}
// console.log(corrEllipse(58.33348626930866, .1))
// console.log(corrEllipseB1(65, .2))
// console.log(corrEllipseC(65, .2))
// console.log(corrEllipseD1(65, .2))
// console.log(corrEllipseD2(65, .2))
const vEllipse = (c, Name, Orb) => { // 輸入真近點角，得瞬時速度// https://www.zhihu.com/question/374251348
    const { Solar } = Para[Name]
    const a = 1
    const v0 = 2 * pi / Solar // 平均角速度
    const mu = v0 ** 2 * a ** 3 // μ=GM
    const r = distEllipse(Orb, c) // 日地距離
    const v2 = mu * (2 / r - 1 / a)
    return r2d(sqr(v2))
}
// console.log(vEllipse(.0169, 'Guimao', 0))
const sunCorrQing = (Name, Sorb) => {
    let Corr = 0, d = 0
    Sorb = t(Sorb)
    if (Name === 'Xinfa' || Name === 'Yongnian') {
        const { Corr: CorrTmp, d: dTmp } = corrRingA(Sorb, .0179208)
        Corr = CorrTmp
        d = dTmp
    } else if (Name === 'Jiazi') {
        const { Corr: CorrTmp, d: dTmp } = corrRingC(Sorb, .0179208)
        Corr = CorrTmp
        d = dTmp
    } else if (Name === 'Guimao') Corr = corrEllipseC(Sorb, .0169)
    return { Corr, d }
}
export const sunQing = (Name, SunRoot, SperiRoot, Smd) => {
    const { SunAvgVd, SperiVd } = Para[Name]
    const AvgSun = SunRoot + Smd * SunAvgVd // 平行：以年根與日數相加，得平行。// 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
    const Speri = SperiVd * Smd + SperiRoot // 最卑平行。Speri=SunPerigee太陽近地點。Smd=winter solstice tomorrow difference距離冬至次日子正的時間
    const Sorb = t(AvgSun - Speri) // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
    const SunCorr = sunCorrQing(Name, Sorb).Corr
    const SunGong = t(AvgSun + SunCorr) // 實行
    const SunLon = Gong2Lon(SunGong) // 黃道度
    return { Sorb, SunCorr, SunLon, SunGong, Speri }
}
const timeAvg2RealXinfaList = [ // 距冬至度數0-359
    8, 7.5, 7, 7, 7, 6, 5, 5, 4, 4, 3.5, 3, 2.5, 2, 2, 1.5, 1, .5, 0, -.5, -1, -1.5, -2, -2.5, -3, -3, -3, -3.5, -4, -4.5,
    -5, -5, -5, -5.5, -6, -6, -6, -6, -6.5, -7, -7, -7, -7, -7, -7.5, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,
    -7, -7, -7, -7, -7, -7, -7, -7, -6.5, -6, -6, -6, -6, -5.5, -5, -5, -5, -4.5, -4, -4, -4, -3.5, -3, -3, -2.5, -2, -2, -1.5, -1, -.5,
    0, 0, .5, .5, .5, .5, .5, 1.5, 2, 2.5, 3, 3, 3, 3.5, 4, 4.5, 5, 5, 5, 5.5, 6, 6, 6.5, 7, 7, 7.5, 7.5, 8, 8, 8,
    8.5, 8.5, 9, 9, 9.5, 9.5, 10, 10.5, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11.5, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    12, 12, 12, 11.5, 11, 11, 11, 11, 11, 11, 11, 10.5, 10, 10, 10, 10, 10, 9.5, 9, 9, 9, 9, 8.5, 8, 8, 8, 7.5, 7.5, 7, 7,
    6.5, 6, 6, 6, 6, 5.5, 5.5, 5, 5, 5, 5, 4.5, 4, 4, 4, 4, 3.5, 3, 3, 3, 3, 3, 3, 2.5, 2.5, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2.5, 2.5, 3, 3, 3, 3, 3, 3, 3.5, 4, 4, 4.5, 4.5, 5, 5, 5, 5.5,
    6, 6, 6, 6.5, 7, 7, 7, 7.5, 8, 8.5, 9, 9, 9, 9.5, 10, 10.5, 11, 11, 11.5, 11.5, 12, 12.5, 13, 13, 13.5, 13.5, 14, 14.5, 15, 15.5,
    16, 16, 16.5, 17, 17, 17.5, 18, 18, 18, 18.5, 19, 19, 20, 20, 20, 20.5, 21, 21, 21, 21.5, 22, 22, 22, 22.5, 23, 23, 23, 23, 23, 23.5,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23.5, 23, 23, 23, 23, 23.5, 22, 22, 22, 21.5,
    21, 21, 21, 20.5, 20.5, 20, 19.5, 19, 19, 18.5, 18, 17.5, 17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13.5, 13, 12.5, 12, 11.5, 11, 10.5, 10, 9.5, 9
]
const timeAvg2RealXinfaLiao = (Sobliq, SunLon) => { // 根據廖育棟附錄A
    const SunCorr = sunCorrQing(Name, Lon2Gong(SunLon)).Corr
    const a = tan(Sobliq / 2) ** 2 * sin(2 * SunLon)
    const b = 1 + tan(Sobliq / 2) ** 2 * cos(2 * SunLon)
    const EclpEquaDifTcorr = atan(a / b)
    const SunCorrTcorr = -SunCorr // 變成分鐘數
    const k = 7.5
    return SunCorrTcorr * 4 + EclpEquaDifTcorr * 4 + k
}
const timeAvg2RealXinfa = (Sobliq, SunLon) => { // 査表
    const SunGong = ~~Lon2Gong(SunLon)
    return timeAvg2RealXinfaList[SunGong] / 1440
}
const timeAvg2RealXinfaB = (Sobliq, SunLon) => (SunLon - LonHigh2Flat(Sobliq, SunLon)) / 360 // 只考慮升度差
// 時差總
const timeAvg2RealJiazi = (Sobliq, SunLon, SunCorr) => {
    const SunCorrTcorr = -SunCorr / 360 // 均數時差。以實望太陽均數變時。均數加者則爲減。
    const EclpEquaDifTcorr = (SunLon - LonHigh2Flat(Sobliq, SunLon)) / 360 // 升度時差。二分後爲加，二至後爲減。
    return SunCorrTcorr + EclpEquaDifTcorr
}
const timeAvg2Real = (Name, Sobliq, SunLon, SunCorr) => {
    let TimeDif = 0
    if (Name === 'Xinfa' || Name === 'Yongnian') {
        if (SunCorr) TimeDif = timeAvg2RealXinfa(Sobliq, SunLon)
        else TimeDif = timeAvg2RealXinfaB(Sobliq, SunLon) // 合朔只用升度差
    } else if (Name === 'Jiazi' || Name === 'Guimao') TimeDif = timeAvg2RealJiazi(Sobliq, SunLon, SunCorr)
    return TimeDif
}
// 崇禎曆書曆指只說了一均（初均，=本輪+均輪）二均，但是曆表用了三均（二均差）。以下算法參考宁晓玉《新法算书中的月亮模型》。褚龍飛等《第谷月亮理论在中国的传播》：經驗算，崇禎曆書二三均數表等於第谷的第二差（次輪）、二均差（次均輪、又次輪）之和。月離曆指卷三的二三均數算法圖實際上是哥白尼模型。對比二三均數表，實引3宮0度、月距日2宮11度：崇禎1度50分，考成1度52分52秒；實引9宮0度、月距日1宮21度：崇禎2度8分，考成1度59分35秒
const moonXinfa = (Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong) => {
    const { MoonAvgVd, MapoVd, NodeVd, Sobliq } = Para[Name]
    const R1 = .058, R2 = .029, R4 = .02174, R5 = .01175 // 1本輪R1 = .058、2均輪R2 = .029、3負均輪圈R3 = .0797、4次輪、5次均輪
    const MobliqMid = 5.13333333333333, MobliqDif = .15833333333333
    const AvgMoon0 = t(MoonRoot + Smd * MoonAvgVd)
    const AvgMapo = t(MapoRoot + Smd * MapoVd) // 最高平行.Mapo=MoonApogee太陰遠地點
    const AvgNode = NodeRoot - Smd * NodeVd // 正交平行
    const AvgMoon = AvgMoon0 - timeAvg2Real(Name, Sobliq, Gong2Lon(SunGong)) * MoonAvgVd // 時差總爲加者時差行爲減。1921算例330°23′39.19″=330.3942194444
    // const AvgMoon = AvgMoon0
    const Morb = t(AvgMoon - AvgMapo)
    const { Corr: Corr1, d } = corrRingC(Morb, .0435)
    const AcrMoon0 = AvgMoon + Corr1 // 實平行
    const AcrMorb = Morb + Corr1
    const MSDif = t(AcrMoon0 - SunGong)
    const MSDif2 = (MSDif * 2) % 360
    // 以下根據褚龍飛論文
    const E1 = 2 * R4 * sin(MSDif)
    const G = 90 + AcrMorb - MSDif
    const Corr2 = -atan(E1 * sin(G) / (d + E1 * cos(G)))
    const Corr3 = .675 * sin(MSDif2)
    const Corr23 = Corr2 + Corr3
    const Whitegong = t(AcrMoon0 + Corr23) // 白道實行
    // 以下照抄甲子曆
    const Mobliq = aCb_Sph(MobliqMid, MobliqDif, t2(MSDif2)) // 黃白大距。90：5度8分9秒=5.1358333333
    const NodeCorr = asin(sin(t2(MSDif2)) * sin(MobliqDif) / sin(MobliqMid)) // 交均：白道極與交均輪心之差。90：1度46分8秒=1.7688888889
    const flag4 = MSDif2 < 180 ? -1 : 1 // 月距日倍度不及半周，交均爲減
    const AcrNode = t(AvgNode + flag4 * NodeCorr)
    const Whitelongi = t(Whitegong - AcrNode)
    const { MoonLon, MoonLat } = White2Eclp(Mobliq, AcrNode, Whitelongi) // 1921算例328°25′20.67″=328.4224083333
    return { Node: AcrNode, Whitegong, Whitelongi, MoonGong: Lon2Gong(MoonLon), MoonLon, MoonLat, Mobliq, Mapo: AvgMapo }
}
// console.log(moonXinfa('Xinfa'))
const moonJiazi = (Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong) => {
    const { MoonAvgVd, MapoVd, NodeVd, Sobliq } = Para[Name]
    const R2 = .029, R4 = .0217, R5 = .01175 // 1本輪R1 = .058、2均輪R2 = .029、3負均輪圈R3 = .0797、4次輪、5次均輪
    const MobliqMid = 5.13333333333333, MobliqDif = .15833333333333 //朔望黃白大距，Mobliq0822 = 5.29166666666667,兩弦黃白大距5 + 17 / 60 + 30 / 3600，黃白大距中數5+8/60，黃白大距半較9/60+30/3600
    // 時差——引數——初均——月距日次引——二均——三均——白道實行——黃白大距、交均——正交
    const AvgMoon0 = t(MoonRoot + Smd * MoonAvgVd) // 太陰平行。1921算例330°20′19.9″=330.3388611111
    const AvgMapo = t(MapoRoot + Smd * MapoVd) // 最高平行.Mapo=MoonApogee太陰遠地點
    const AvgNode = NodeRoot - Smd * NodeVd // 正交平行    
    // const AvgMoon = AvgMoon0
    const AvgMoon = AvgMoon0 - timeAvg2Real(Name, Sobliq, Gong2Lon(SunGong), SunCorr) * MoonAvgVd // 時差總爲加者時差行爲減。1921算例330°23′39.19″=330.3942194444
    const Morb = t(AvgMoon - AvgMapo) // 均輪心自行引數Morb=MoonOrbitDegree。1949算例：200°22′05.77″=200.3682694444
    const { Corr: Corr1, d } = corrRingC(Morb, .0435) // 1921算例-1°29′33.22″=-1.4925611111
    const flag1 = Math.sign(Corr1)
    const AcrMoon0 = AvgMoon + Corr1 // 初實行
    const MSDif = (AcrMoon0 - SunGong + 720) % 360 // 月距日次引（次輪周之行度）
    // 次輪心行Orbdeg*2%360，次均輪心行MSDif*2
    const MSDif2 = (MSDif * 2) % 360 // 倍離
    const AcrMorbTmp = abs(Corr1) + t1(Morb)  // 以初均數與均輪心距最卑之度相加。次輪最近點距地心線與次輪徑夾角 // 如果Morb<180就是t1(Morb-Corr1)，暫且這麼命名
    // 次輪最近點距地。90：1.0037774。120：0.9883760。230：0.9836195。300：1.0172941
    const Jichou = R4 * sin2(t2(MSDif2)) // 次輪月距日倍度之通弦。120：0.0407827。135：0.0306884。320：0.0278970
    const AngJichoujia = abs(AcrMorbTmp // 均輪心距最卑之度=引數與半周相減
        + flag1 * f4(MSDif) * t1(MSDif2) / 2)  // 加減月距日距象限度爲夾角。距象限90度和我的算式等效。
    // 初均減者：月距日過一三象限，加；不過象限或過二象限，減。
    // 初均加者：相反。若初均與均輪心距最卑相加不足減月距日距象限度，則轉減。若相加過半周，則與全周相減。110、120用加：84度22分19秒=84.3719444444。135、230用減：8度53分6秒=8.885。320、300：74度14分51秒=74.2475
    let flag2 = flag1 // 二均符號
    if (AcrMorbTmp < 90) { // 以初均數與均輪心距最卑之度相加，爲次輪最近點距地心線與次輪徑夾角。此角如不及九十度，則倍之，與半周相減，餘爲加減限。初均減者：月距日倍度在此限內，則二均反爲加；初均加者：月距日倍度與全周相減，餘數在此限內，則二均數反爲減。
        const limit = 180 - AcrMorbTmp * 2
        if (flag1 === -1) {
            if (MSDif2 < limit) flag2 = 1
        } else {
            if (abs(MSDif2 - 360) < limit) flag2 = -1
        }
    } else { // 此角如過九十度，則與半周相減，餘數倍之，又與半周相減，餘爲加減限。初均減者：月距日倍度與全周相減，餘數在此限內，則二均數反爲加。初均加者：月距日倍度在此限内，則二均數反爲減。若不在限內，或其角適足九十度，則初均數爲加者二均數亦爲加，初均數爲減者二均數亦為減。
        const limit = 180 - abs(180 - AcrMorbTmp) * 2
        if (flag1 === -1) {
            if (abs(MSDif2 - 360) < limit) flag2 = 1
        } else {
            if (MSDif2 < limit) flag2 = -1
        }
    }
    const Corr2 = qiexianA(Jichou, d, AngJichoujia) // 丑甲己角。90：1度22分5秒=1.3680555556。2度21分40秒=2.3611111111。135、230：17分6秒=.285。1度31分23秒=1.5230555556。1921算例：-1°9′34.01″=-1.1594472222
    const Jijia = abs(Jichou * sin(AngJichoujia) / sin(Corr2)) // 次均輪心距地。90：0.9842622。120：0.9851595。135、230：0.9528920
    const Corr3 = qiexianA(R5, Jijia, t2(MSDif2)) // 90：41分2秒=.6838888889。110、120：26分7秒=.4352777778。135、230：42分23秒=.7063888889。320、300：39分27秒=.6575。1921算例：0°33′49.17″=0.5636583333
    const flag3 = MSDif2 < 180 ? 1 : -1 // 月距日倍度不及半周爲加，過半周爲減
    const Corr23 = flag2 * Corr2 + flag3 * Corr3 // 二三均數
    const Whitegong = t(AcrMoon0 + Corr23) // 白道實行
    // 白極自交均輪順時針行倍離
    const Mobliq = aCb_Sph(MobliqMid, MobliqDif, t2(MSDif2)) // 黃白大距。90：5度8分9秒=5.1358333333
    const NodeCorr = asin(sin(t2(MSDif2)) * sin(MobliqDif) / sin(MobliqMid)) // 交均：白道極與交均輪心之差。90：1度46分8秒=1.7688888889
    const flag4 = MSDif2 < 180 ? -1 : 1 // 月距日倍度不及半周，交均爲減
    const AcrNode = t(AvgNode + flag4 * NodeCorr)
    const Whitelongi = t(Whitegong - AcrNode)
    const { MoonLon, MoonLat } = White2Eclp(Mobliq, AcrNode, Whitelongi) // 1921算例328°25′20.67″=328.4224083333
    return { Node: AcrNode, Whitegong, Whitelongi, MoonGong: Lon2Gong(MoonLon), MoonLon, MoonLat, Mobliq, Mapo: AvgMapo }
}
const moonGuimao = (Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong, Speri, Sorb) => {
    const { MoonAvgVd, MapoVd, NodeVd } = Para[Name]
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
    const AcrMoon0 = t(MoonRoot + Smd * MoonAvgVd) // 太陰平行        
    const AvgMapo1 = t(MapoRoot + Smd * MapoVd) // 最高平行
    const AvgNode1 = t(NodeRoot - Smd * NodeVd) // 正交平行
    const AvgMoon2 = AcrMoon0 - SunCorr / SunCorrMax * AvgCorr1Max // 二平行=太陰平行+-一平均：用時之太陰平行。一平均（考慮地球自轉的時間）已有均數時差，而止就黃道算，故不用升度時差。一平均：太阳均数加者为减，减者为加。
    const AvgMapo = AvgMapo1 + SunCorr / SunCorrMax * AvgMapoCorrMax  // 用最高=最高平行+-最高平均
    const AvgNode = AvgNode1 - SunCorr / SunCorrMax * AvgNodeCorrMax// 用正交=正交平行+-正交平均
    const SunMapoDif = t(SunGong - AvgMapo) // 日距月最高
    const SunNodeDif = t(SunGong - AvgNode) // 日距正交        
    const SDist = distEllipseA(Sorb + SunCorr, .0169) // 日距地心
    const TubedDif = (1.0169000 ** 3 - SDist ** 3) / .101410  // 求立方較,太阳最高距地心数之立方。這裡再除以太陽高卑距地之立方大較 (10000000+169000)**3-(10000000-169000)**3
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
    const Corr1 = corrEllipseD2(Morb, MoonC) // 初均
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
    const { MoonLon, MoonLat } = White2Eclp(Mobliq, AcrNode, Whitelongi)
    return { Node: AcrNode, Whitegong, Whitelongi, MoonGong: Lon2Gong(MoonLon), MoonLon, MoonLat, Mobliq, Morb, Mapo: AcrMapo, Corr1, MoonC }
}
export const moonQing = (Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong, Speri, Sorb) => {
    if (Name === 'Xinfa' || Name === 'Yongnian') return moonXinfa(Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong)
    else if (Name === 'Jiazi') return moonJiazi(Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong)
    else if (Name === 'Guimao') return moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong, Speri, Sorb)
}
export const N4 = (Name, Y) => {
    const { CloseOriginAd, Solar, Lunar, ChouConst, SolsConst, SperiConst, SperiVy, SperiVd, SunAvgVd, MoonAvgVd, MapoVd, NodeVd, MoonConst, MapoConst, NodeConst, SunLimitYinAcr, SunLimitYangAcr, MoonLimit, MansionDayConst, Sobliq, RiseLat } = Para[Name] // SunAvgVm, SorbVm, MorbVm, MoonNodeVmSum, ChouSunConst, ChouSorbConst, ChouMorbConst, ChouWhitelongiConst
    const TermLeng = Solar / 12
    const MorbVd = MoonAvgVd - MapoVd
    const SorbVd = SunAvgVd - SperiVd
    const MSAvgVdDif = MoonAvgVd - SunAvgVd
    const MoonNodeVdSum = MoonAvgVd + NodeVd
    const CloseOriginYear = abs(Y - CloseOriginAd) // 積年
    const OriginAccum = +(CloseOriginYear * Solar).toFixed(9) // 中積
    const SolsAccum = Y >= CloseOriginAd ? OriginAccum + SolsConst : OriginAccum - SolsConst // 通積分
    const MansionDaySolsmor = Y >= CloseOriginAd ? ~~(((OriginAccum + MansionDayConst) % 28) % 28) : ~~((28 - (OriginAccum - MansionDayConst) % 28) % 28) // 值宿日分
    const Sols = +(Y >= CloseOriginAd ? SolsAccum % 60 : 60 - SolsAccum % 60).toFixed(9)
    const SolsDeci = deci(Sols) // 冬至小數
    const SolsmorScOrder = (~~Sols + 2) % 60 // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）Solsmor: winter solstice tomorrow 冬至次日子正初刻
    const SunRoot = (1 - SolsDeci) * SunAvgVd // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。    
    const DayAccum = Y >= CloseOriginAd ? OriginAccum + deci(SolsConst) - SolsDeci : OriginAccum - deci(SolsConst) + SolsDeci // 積日（曆元冬至次日到所求天正冬至次日的日數，等於算式的曆元冬至當日到所求冬至當日日數）    
    const ChouAccum = Y >= CloseOriginAd ? DayAccum - ChouConst : DayAccum + ChouConst // 通朔
    // const LunarAccum = Y >= CloseOriginAd ? ~~(ChouAccum / Lunar) + 1 : ~~(ChouAccum / Lunar) // 積朔。似乎+1是為了到十二月首朔
    const ChouSmd = Y >= CloseOriginAd ? (Lunar - ChouAccum % Lunar) % Lunar : ChouAccum % Lunar // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔。Smd：某時刻距離冬至次日子正的時間
    // const LunarAccumSun = LunarAccum * SunAvgVm // 積朔太陽平行
    // const ChouSun = t(Y >= CloseOriginAd ? ChouSunConst + LunarAccumSun : ChouSunConst - LunarAccumSun)
    // const LunarAccumWhitelongi = LunarAccum * MoonNodeVmSum // 積朔太陰交周
    // const ChouWhitelongi = t(Y >= CloseOriginAd ? LunarAccumWhitelongi + ChouWhitelongiConst : ChouWhitelongiConst - LunarAccumWhitelongi) // 首朔太陰交周。1949算例247°56′27.55″=247.9409861111
    // const LunarAccumSorb = LunarAccum * SorbVm
    // const ChouSorb = t(Y >= CloseOriginAd ? ChouSorbConst + LunarAccumSorb : ChouSorbConst - LunarAccumSorb)
    // const LunarAccumMorb = LunarAccum * MorbVm
    // const ChouMorb = t(Y >= CloseOriginAd ? ChouMorbConst + LunarAccumMorb : ChouMorbConst - LunarAccumMorb) // 1949算例290°0′34.90″=290.009694444444
    const MoonRoot = Y >= CloseOriginAd ? MoonConst + DayAccum * MoonAvgVd : MoonConst - DayAccum * MoonAvgVd // 太陰年根    
    const MapoRoot = Y >= CloseOriginAd ? DayAccum * MapoVd + MapoConst : MapoConst - DayAccum * MapoVd  // 最高年根
    const NodeRoot = Y >= CloseOriginAd ? t(NodeConst - DayAccum * NodeVd) : t(NodeConst + DayAccum * NodeVd) // 正交年根，所得爲白經
    // const Mansion = (OriginAccumMansion % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
    const SperiRoot = SperiConst + (Y >= CloseOriginAd ? SperiVy * CloseOriginYear : -SperiVy * CloseOriginYear) // 本年最卑行+最卑應=我命名的最卑年根
    const sunEcliJiazi = (NowSmd, AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon) => {
        // AcrWhitelongi = 179 + 49 / 60 + 47.28 / 3600 // 2009算例
        const Mobliq0116 = 4.975
        const SDistMax = 1.0179208, SDistRatMax = 1162 // 太陽最高距地，地半徑比例數
        const MDistMax = 1.01725, MDistRatMax = 58.16
        const MRadReal = 0.27
        const SRadReal = 5.07, SlRad = 6.37 // 太陽實半徑，光分半徑
        const AcrSunGong = Lon2Gong(AcrSunLon)
        //////// 【八】食甚距緯、食甚時刻——與月食同
        const Distreal = HighLon2FlatLat(Mobliq0116, AcrWhitelongi) // 食甚實緯（距緯）：用時月距日之白緯。考成圖上平的是白道，斜的是黃道
        // 實朔的定義，考成：日距交之黃經=月距交之白經；後編：黃經相同
        const TotalWhitelongi = LonHigh2Flat(Mobliq0116, AcrWhitelongi) // 食甚交周：用時太陰距正交之白經。以太陽距交之黃經求其相當之白經，即食甚交周。距交之經度為食甚交周，相距之緯度即食甚實緯
        const Dif = TotalWhitelongi - AcrWhitelongi  // 交周升度差=食甚交周與實朔交周之差
        const OnehAftMoonCorr1 = corrRingC(MorbVd / 24 + AcrMorb, .0435).Corr
        const MSAcrVhDif = MSAvgVdDif / 24 + OnehAftMoonCorr1 - AcrMoonCorr1 // 一小時月距日實行。後均與實均同號相減，異號相加。與一小時月距日平行相加減：實均與後均同爲加者，後均大則加；同為減者，後均大則減。異號者，後均加則加，後均減則減
        const SmdAvg = NowSmd + Dif / MSAcrVhDif / 24 // 食甚用時：日月白道同度之時刻
        const AcrSunEquaLon = LonHigh2Flat(Sobliq, AcrSunLon) // 算例：15度-->赤道同升度13度48分23秒
        const SDistRat = sunCorrQing(Name, AcrSorb).d / SDistMax * SDistRatMax // 太陽距地
        const MDistRat = (corrRingC(AcrMorb, .0435).d - .01175) / MDistMax * MDistRatMax // 太陰距地。日月距地都是近時真時同用，因為變化可以忽略
        //////// 【九】食甚近時
        const sunEcliJiaziMain = (SunGong, SunEquaLon, Smd) => {
            const SpringSouEquaDif = (SunEquaLon + deci(Smd) * 360 + 180) % 360 // 用時春分距午赤道度=太陽距春分+太陽距正午。太陽赤道度自西而東，時刻赤道度自東而西。算例：deci(Smd)=16/24=.6666，申正距午正60度
            const NoxSouEquaDif = t3(SpringSouEquaDif) // 用時春秋分距午赤道度。算例73.806348227262589
            const NoxSouEclpDif = LonFlat2High(Sobliq, NoxSouEquaDif) // 用時春秋分距午黃道度。《求黃平象限》葉37 用癸己戊正弧三角，有直角、黃赤大距、距午赤道度。算例75.08623544960639
            let NoonEclpLon = NoxSouEclpDif
            if (SpringSouEquaDif < 90) { }
            else if (SpringSouEquaDif < 180) NoonEclpLon = 180 - NoxSouEclpDif
            else if (SpringSouEquaDif < 270) NoonEclpLon = NoxSouEclpDif + 180
            else NoonEclpLon = 360 - NoxSouEclpDif
            const NoonEclpGong = Lon2Gong(NoonEclpLon) // 用時正午黃道宮度。算例165度5分10秒=165.08611111111
            const NoonLatDif = aCb_Sph(NoxSouEquaDif, NoxSouEclpDif, Sobliq) // 用時正午黃赤距緯。算例22.655413696754813         
            const AngEclpSou = abc_Sph(NoxSouEquaDif, NoxSouEclpDif, NoonLatDif)  // 用時黃道與子午圈交角。子午圈就是正午的圈。算例癸角=83.61729023292902
            const NoonEclpHigh = 90 - RiseLat + (NoonEclpLon < 180 ? 1 : -1) * NoonLatDif // 用時正午黃道高。算例癸乙72度44分19秒=72.7386111111
            const EclpmidHigh = BaC_Sph(90, AngEclpSou, NoonEclpHigh) // 黃平象限距地平。算例丑角=72度50分56秒=72.8488888889
            const EclpmidSouDif = abs(90 - ABCa_Sph(EclpmidHigh, 90, AngEclpSou, NoonEclpHigh)) // 用時黃平象限距午度。算例癸丑弧88度1分18秒=88.02166666667
            const EclpmidGong = NoonEclpGong + (NoonEclpGong < 180 ? 1 : -1) * (NoonEclpHigh > 90 ? -1 : 1) * EclpmidSouDif // 用時黃平象限宮度。算例167度3分52秒=167.06444444444
            const SunEclpmidDif = abs(SunGong - EclpmidGong) // 用時太陽距黃平象限=月距限。算例壬子弧62度3分52秒=62.06444444444
            const SignEw = (SunGong - EclpmidGong + 360) % 360 < 180 ? 1 : -1 // 太陽黃經大於黃平象限宮度爲限東。大於0爲限東，小於0爲限西——我想了下應該這樣處理
            // const SignEw = Math.sign(SunEclpmidDif) // 限東為1，西-1
            const Zichou = 90 - SunEclpmidDif // 太陽距黃平象限之餘
            // const Maochou = LonHigh2Flat(EclpmidHigh, Zichou)
            const AngEclpHigharc = abs(atan(cot(EclpmidHigh) / sin(SunEclpmidDif))) // asin(sin(Maochou) / sin(Zichou)) // 黃道高弧交角。sin90/sin子丑=sin子/sin卯丑=sin丑/sin子卯。或BaC_Sph(EclpmidHigh, 90, Maochou) 算例角子=19度15分19秒=19.2552777778
            const SunHigh = asin(sin(Zichou) * sin(EclpmidHigh)) // 太陽高弧。算例子卯=26度35分30秒
            let flag1 = 1
            if (TotalWhitelongi < 90 || TotalWhitelongi > 270) {
                if (SignEw < 0) flag1 = -1
            } else {
                if (SignEw > 0) flag1 = -1
            }
            const AngSunZenith = 90 - SunHigh
            const SParallax = qiexianA(1, SDistRat, AngSunZenith)
            const MParallax = qiexianA(1, MDistRat, AngSunZenith)
            const Parallax = MParallax - SParallax // 用時高下差
            let SignSn = 1, EwCorr = 0, SnCorr = 0
            if (Name === 'Jiazi') {
                const AngWhiteHigharc = abs(AngEclpHigharc + flag1 * Mobliq0116) // 白道高弧交角
                // if (AngWhiteHigharc > 90) SignEw = -SignEw // 加過90度者則限東變為限西。——最後求東西差，大於90的話cos就是負數，所以不用管這個
                const WhitemidHigh = 180 - BaC_Sph(EclpmidHigh, Mobliq0116, Zichou) // 白平象限距地平高，>90就是在天頂北。卷八白平象限葉55
                // const SignSn = EclpmidHigh > 90 ? -1 : 1 // 限距地高在天頂北者，白平象限在天頂南。白平象限在天頂南爲-1，北1。卷八白平象限葉75
                SignSn = WhitemidHigh > 90 ? 1 : -1
                EwCorr = atan(cos(AngWhiteHigharc) * tan(Parallax)) // 東西差。半徑與交角餘弦之比=高下差正切與東西差正切之比
                SnCorr = asin(sin(Parallax) * sin(AngWhiteHigharc)) // 南北差。東西南北差驗算通過
            } else { // 看到考成說新法以黃平象限為根據，所以暫時這樣寫
                SignSn = EclpmidHigh > 90 ? 1 : -1
                EwCorr = atan(cos(AngEclpHigharc) * tan(Parallax)) // 東西差
                SnCorr = asin(sin(Parallax) * sin(AngEclpHigharc)) // 南北差
            }
            return { EwCorr: EwCorr * SignEw, SnCorr: SnCorr * SignSn }
        }
        const { EwCorr: AvgEwCorr } = sunEcliJiaziMain(AcrSunGong, AcrSunEquaLon, SmdAvg)
        const Acr0AvgDif = AvgEwCorr / MSAcrVhDif / 24 // 近時距分
        const SmdAcr0 = SmdAvg - Acr0AvgDif // 食甚近時。用時月距限西爲加（以用時白道高弧交角變限不變限爲定）
        //////// 【十】食甚真時
        const { EwCorr: Acr0EwCorr } = sunEcliJiaziMain(AcrSunGong - AvgEwCorr, AcrSunEquaLon, SmdAcr0)  // 太陽距春分後赤道度，即前求用時春分距午赤道度條內所得之數                
        const AcrAvgDif = AvgEwCorr / (AvgEwCorr * 2 - Acr0EwCorr) * Acr0AvgDif // 食甚距分。加減號與近時距分同。AvgEwCorr * 2 - Acr0EwCorr是食甚視行
        const SmdAcr = SmdAvg - AcrAvgDif
        //////// 【十一】食分
        const { EwCorr: AcrEwCorr, SnCorr: AcrSnCorr } = sunEcliJiaziMain(AcrSunGong - Acr0EwCorr, AcrSunEquaLon, SmdAcr)
        const Distappa = Distreal + AcrSnCorr // 視緯=實緯加減南北差。白平象限在天頂南者，實緯在黃道南則加，視緯仍爲南。實緯在黃道北則減，視緯仍爲北；若實緯在黃道北而南北差大於實緯，則反減，視緯即變為南。白平象限在天顶北者，实纬在黄道北则加，而视纬仍为北；實緯在黃道南則減，視緯仍爲南；若實緯在黃道南，而南北差大於實緯，則反減，視緯即變為北        
        const SRadAppa = asin(SRadReal / SDistRat) // 太陽半徑。爲何是正弦不是正切？？
        const MRadAppa = asin(MRadReal / MDistRat)
        const RadSum = SRadAppa + MRadAppa // 併徑
        const Magni = (100 * (RadSum - abs(Distappa)) / (SRadAppa * 2)).toFixed(1)
        if (+Magni < 1) return
        //////// 【十二】初虧真時  
        const ArcStartTotal = acos(cos(RadSum) / cos(Distappa)) // 初虧復原距弧cosc = (cosa - sinbsinccosA) /cosb 
        const AvgStartTotalDif = ArcStartTotal / MSAcrVhDif / 24 // 距時
        const SmdStartAvg = SmdAcr - AvgStartTotalDif // 初虧用時
        const { EwCorr: StartEwCorr } = sunEcliJiaziMain(AcrSunGong - AcrEwCorr - ArcStartTotal, AcrSunEquaLon, SmdStartAvg)
        const StartTotalDif = ArcStartTotal / (ArcStartTotal - (StartEwCorr - AcrEwCorr)) * AvgStartTotalDif // 初虧距分.// 初虧視行：初虧食甚同在白平象限東，初虧東西差大則以差分減，小則以差分加 // 以初亏视行化秒为一率，初亏复圆距时化秒为二率，初亏复圆距弧化秒为三率，求得四率为秒，以时分收之得初亏距分
        const SmdStart = SmdAcr - StartTotalDif // 初虧真時
        //////// 【十三】復圓真時
        const SmdEndAvg = SmdAcr + AvgStartTotalDif
        const { EwCorr: EndEwCorr } = sunEcliJiaziMain(AcrSunGong - AcrEwCorr + ArcStartTotal, AcrSunEquaLon, SmdEndAvg)
        const EndTotalDif = ArcStartTotal / (ArcStartTotal + (EndEwCorr - AcrEwCorr)) * AvgStartTotalDif // 復圓食甚同在白平象限東，復圓東西差大則以差分加，小則以差分減       
        const SmdEnd = SmdAcr + EndTotalDif
        const TotalSLon = sunQing(Name, SunRoot, SperiRoot, SmdAcr).SunLon
        return {
            Start: fix(deci(SmdStart)),
            Total: fix(deci(SmdAcr)),
            End: fix(deci(SmdEnd)),
            Magni, TotalSLon,
            TotalSEquaLon: LonHigh2Flat(Sobliq, TotalSLon),
            TotalSLat: HighLon2FlatLat(Sobliq, TotalSLon)
        }
    }
    const sunEcliGuimao = NowSmd => {
        // NowSmd = 205.528185 // ⚠️1730算例臨時
        //////// 【一】實朔用時。用時的英語暫且用Now
        //////// 【二】食甚實緯、食甚用時。這一段日月食都一樣
        const SunNow = sunQing(Name, SunRoot, SperiRoot, NowSmd)
        const MoonNow = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, NowSmd, SunNow.SunCorr, SunNow.SunGong, SunNow.Speri, SunNow.Sorb)
        const SunOnehAft = sunQing(Name, SunRoot, SperiRoot, NowSmd + 1 / 24)
        const MoonOnehAft = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, NowSmd + 1 / 24, SunOnehAft.SunCorr, SunOnehAft.SunGong, SunOnehAft.Speri, SunOnehAft.Sorb)
        // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
        const AngEquiWhite = qiexian(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Mobliq).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
        const AngEquiEclp = MoonNow.Mobliq + AngEquiWhite // 斜距黃道交角
        const DistrealAvg = abs(cos(AngEquiEclp) * MoonNow.MoonLat) // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
        const EquiVd = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Mobliq) / sin(AngEquiWhite) * 24 // 一小時兩經斜距*24. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA。此處我*24，從一小時速度變成一天                 
        const ArcTotalNow = abs(sin(AngEquiEclp) * MoonNow.MoonLat) // 食甚距弧
        const TotalNowDif = f3(MoonNow.Whitelongi) * ArcTotalNow / EquiVd // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
        const SmdAvg = NowSmd + TotalNowDif // 食甚用時
        // const SmdAvg = 205.527765625 // ⚠️臨時
        const SunAvg = sunQing(Name, SunRoot, SperiRoot, SmdAvg)
        const MoonAvg = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, SmdAvg, SunAvg.SunCorr, SunAvg.SunGong, SunAvg.Speri, SunAvg.Sorb)
        //////// 【三】地平高下差、日月視徑
        const AcrSorb = SunNow.Sorb + SunAvg.SunCorr // 太陽實引：實朔引數+-本時太陽均數
        const AcrMorb = MoonNow.Morb + MoonAvg.Corr1 // 太陰實引
        const MDist = distEllipseA(AcrMorb, MoonNow.MoonC)
        const HorizonParallax = 3450 / 3600 / MDist - 10 / 3600 // 地平高下差=太陰在地平上最大地半徑差（中距57分30秒）-太陽地半徑差
        const SunAcrRad = (966 / 3600) / distEllipseA(AcrSorb, .0169) - 15 / 3600 // 太陽實半徑=太陽視半徑（中率16分6秒）-光分15秒
        const MoonRad = (940.5 / 3600) / MDist // 太陰視半徑（中率15分40秒30微）
        const RadSum = SunAcrRad + MoonRad // 併徑
        //////// 【四】食甚太陽黃赤經緯宿度、黃赤二經交角            
        const AvgTotalSLon = t(SunAvg.SunLon + TotalNowDif * (SunOnehAft.SunGong - SunAvg.SunGong) * 24) // 食甚太陽黃道經度=實朔太陽黃道實行+距時日實行
        const AvgTotalSEquaLon = LonHigh2Flat(Sobliq, AvgTotalSLon)
        const AvgTotalSEquaGong = Lon2Gong(AvgTotalSEquaLon) // 自冬至初宮起算，得食甚太陽赤道經度。
        const AvgTotalSLat = HighLon2FlatLat(Sobliq, AvgTotalSLon) // 食甚太陽赤道緯度。食甚太陽距春秋分黃經之正弦：三率。
        const AngSunPolar = 90 - AvgTotalSLat // 太陽距北極
        const AngZenithPolar = 90 - RiseLat // 北極距天頂
        const AngEclpEqua = (AvgTotalSEquaGong > 180 ? 180 : 0) - acot(cot(Sobliq) / cos(AvgTotalSLon)) // 黃赤二經交角。自變量：太陽距春秋分黃經。冬至後黃經在赤經西，夏至後黃經在赤經東。⚠️我定義東正西負。此步已核驗
        const AngWhiteEclp = (MoonAvg.Whitelongi < 90 || MoonAvg.Whitelongi > 270 ? -1 : 1) * AngEquiEclp // 實朔月距正交初宮十一宮，白經在黃經西，五宮六宮白經在黃經東
        const AngWhiteEqua = AngEclpEqua + AngWhiteEclp // 赤白二經交角。所得爲白經在赤經之東西。
        //////// 【五】食甚用時兩心視距
        const flag3 = (AngWhiteHigharcAcr0, FlagDistrealAsm, FlagDistrealAcr0, AngWhiteHigharcAsm, AngDistrealAsm) => {
            let flag = 1
            AngWhiteHigharcAcr0 = t2(AngWhiteHigharcAcr0) // ⚠️暫時這樣處理。1646-1649都有大於180的情況
            // if (abs(AngWhiteHigharcAcr0) > 180) throw new Error("真時白經高弧交角大於180")
            // else
            if (abs(AngWhiteHigharcAcr0) < 90) {
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
        const distAppa = (Smd, Distreal, AngArc) => {
            AngArc = abs(AngArc) || 0
            const { AngA: AngEquaHigharc, c: AngSunZenith } = aCtimeb_Sph(AngZenithPolar, AngSunPolar, Smd)   // 赤經高弧交角
            const Parallax = HorizonParallax * sin(AngSunZenith) // 高下差
            const AngWhiteHigharc = t2(AngEquaHigharc + AngWhiteEqua) // 白經高弧交角⚠️暫時這樣處理
            let AngDistappa = abs(AngWhiteHigharc) - AngArc // 對兩心視距角
            let FlagDistreal = 1
            // if (abs(AngWhiteHigharc) > 180) throw new Error("白經高弧交角大於180")
            // else
            if (abs(AngWhiteHigharc) < 90) {
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
        const distAppa2 = (Smd, Distreal, AngArc, flag) => {
            AngArc = abs(AngArc) || 0
            const { AngA: AngEquaHigharc, c: AngSunZenith } = aCtimeb_Sph(AngZenithPolar, AngSunPolar, Smd)   // 赤經高弧交角
            const Parallax = HorizonParallax * sin(AngSunZenith) // 高下差
            const AngWhiteHigharc = t2(AngEquaHigharc + AngWhiteEqua) // 白經高弧交角⚠️暫時這樣處理
            let AngDistappa = abs(AngWhiteHigharc) + AngArc // 對兩心視距角            
            if (abs(AngWhiteHigharc) < 90) {
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
        const { AngWhiteHigharc: AngWhiteHigharcAvg, FlagDistreal: FlagDistrealAvg, AngDistreal: AngDistrealAvg, Distappa: DistappaAvg } = distAppa(SmdAvg, DistrealAvg) // 見符號3
        //////// 【六】食甚設時兩心視距、食甚真時
        const AsmAvgDif = -(AngWhiteHigharcAvg / 180 * 8.8 / 96 + .2 / 96) // 設時距分
        // const AsmAvgDif = (20 / 60 + 1.05 / 3600) / 24 // ⚠️
        const SmdAsm = SmdAvg + AsmAvgDif // 食甚設時。東向前取，西向後取，角大遠取，角小近取（遠不過九刻，近或數分）
        // const SmdAsm = 205 + 13 / 24 // ⚠️
        const ArcAvgAsm = EquiVd * AsmAvgDif // 設時距弧
        const AngArcAvgAsm = atan(ArcAvgAsm / DistrealAvg) // 設時對距弧角
        const DistrealAsm = abs(ArcAvgAsm / sin(AngArcAvgAsm)) // 設時兩心實距            
        const { AngWhiteHigharc: AngWhiteHigharcAsm, FlagDistreal: FlagDistrealAsm, AngDistreal: AngDistrealAsm, Distappa: DistappaAsm } = distAppa(SmdAsm, DistrealAsm, AngArcAvgAsm) // 見符號4
        const AngHigharcAsm_DistappaAvg = abs(abs(AngWhiteHigharcAsm - AngWhiteHigharcAvg) + (SunAvg.SunLon < 180 ? -1 : 1) * AngDistrealAvg) // 設時高弧交用時視距角
        let flag2 = 1, flag4 = 1, flag5 = 1, flag6 = 1
        if (FlagDistrealAsm === FlagDistrealAvg) flag2 = -1 // 見符號5
        const AngDistMovingAsm = t2(abs(AngHigharcAsm_DistappaAvg + flag2 * AngDistrealAsm)) // 對設時視行角
        const AngDistappaAsm = qiexianA(DistappaAsm, DistappaAvg, AngDistMovingAsm) // 對設時視距角
        const DistMovingAsm = sin(AngDistMovingAsm) / sin(AngDistappaAsm) * DistappaAsm // 設時視行
        const DistMovingAcr0 = DistappaAvg * cos(AngDistappaAsm)   // 真時視行
        const Acr0AvgDif = -sign(AngWhiteHigharcAvg) * abs(DistMovingAcr0 * AsmAvgDif / DistMovingAsm) // 真時距分
        const SmdAcr0 = SmdAvg + Acr0AvgDif // 食甚真時
        //////// 【七】食甚考定真時、食分
        const ArcAcr0AvgDif = Acr0AvgDif * EquiVd // 真時距弧            
        const AngArcAvgAcr0 = atan(ArcAcr0AvgDif / DistrealAvg) // 真時對距弧角
        const DistrealAcr0 = abs(ArcAcr0AvgDif / sin(AngArcAvgAcr0)) // 真時兩心實距
        const { AngWhiteHigharc: AngWhiteHigharcAcr0, FlagDistreal: FlagDistrealAcr0, AngDistreal: AngDistrealAcr0, Distappa: DistappaAcr1 } = distAppa(SmdAcr0, DistrealAcr0, AngArcAvgAcr0) // 真時對視距角法與設時同
        const AngHigharcAcr0_DistappaAsm = abs(abs(AngWhiteHigharcAcr0 - AngWhiteHigharcAsm) + flag3(AngWhiteHigharcAcr0, FlagDistrealAsm, FlagDistrealAcr0, AngWhiteHigharcAsm, AngDistrealAsm) * AngDistrealAsm) // 真時高弧交設時視距角
        if (FlagDistrealAcr0 === FlagDistrealAsm) flag4 = -1
        const AngDistMovingAcr1 = t2(abs(AngHigharcAcr0_DistappaAsm + flag4 * AngDistrealAcr0)) // 對考真時視行角
        const AngDistappaAcr1 = qiexianA(DistappaAcr1, DistappaAsm, AngDistMovingAcr1) // 對考真時視距角
        const DistMovingAcr1 = sin(AngDistMovingAcr1) / sin(AngDistappaAcr1) * DistappaAcr1 // 考真時視行
        const DistMovingAcr = DistappaAsm * cos(AngDistappaAcr1) // 定真時視行
        const DistappaAcr = DistappaAsm * sin(AngDistappaAcr1) // 定真時兩心視距            
        let AcrAsmDif = DistMovingAcr * (abs(AsmAvgDif) - abs(Acr0AvgDif)) / DistMovingAcr1 // 定真時距分。白經在高弧東，設時距分小爲減；白經在高弧西，設時距分小爲加。
        if (AngWhiteHigharcAcr0 < 0) AcrAsmDif = -AcrAsmDif
        const SmdAcr = SmdAsm + AcrAsmDif
        const Magni = (100 * (RadSum - DistappaAcr) / (SunAcrRad * 2)).toFixed(1)
        if (+Magni < 1) return
        //////// 【八】初虧前設時兩心視距
        let SmdBefStartAsm = 0, SmdBefEndAsm = 0
        if (AngWhiteHigharcAcr0 < 0) {
            if (DistappaAvg < RadSum) flag5 = -1
            SmdBefStartAsm = SmdAvg + flag5 * (abs(DistappaAvg - RadSum) / EquiVd + .01) // 初虧前設時
            SmdBefEndAsm = SmdAcr + abs(SmdBefStartAsm - SmdAcr) // 復圓前設時
        } else {
            if (DistappaAvg > RadSum) flag5 = -1
            SmdBefEndAsm = SmdAvg + flag5 * (abs(DistappaAvg - RadSum) / EquiVd + .01) // 復圓前設時
            SmdBefStartAsm = SmdAcr - abs(SmdBefEndAsm - SmdAcr) // 初虧前設時
        }
        // SmdBefStartAsm = 205.46111111111 // ⚠️
        const startEnd = (SmdBefStartAsm, isEnd) => {
            const AvgBefStartAsmDif = abs(SmdAvg - SmdBefStartAsm) // 初虧前設時距分
            const ArcBefStartAsm = AvgBefStartAsmDif * EquiVd // 初虧前設時距弧
            const AngArcBefStartAsm = atan(ArcBefStartAsm / DistrealAvg) // 初虧前設時對距弧角
            let flagAngArcBefStartAsm = 1
            if (SmdBefStartAsm < SmdAvg) flagAngArcBefStartAsm = -1 // 初虧前設時在食甚用時前為西
            const DistrealBefStartAsm = ArcBefStartAsm / sin(AngArcBefStartAsm) // 初虧前設時兩心實距
            const DistappaBefStartAsm = distAppa2(SmdBefStartAsm, DistrealBefStartAsm, AngArcBefStartAsm, flagAngArcBefStartAsm) // 見符號8
            //////// 【九】初虧後設時兩心視距
            if (DistappaBefStartAsm < RadSum) flag6 = -1
            const SmdAftStartAsm = SmdBefStartAsm + flag6 * (abs(DistappaBefStartAsm - RadSum) / EquiVd + .003) // 初虧後設時
            // const SmdAftStartAsm = 205.4638888889 // ⚠️
            const AvgAftStartAsmDif = abs(SmdAvg - SmdAftStartAsm)
            const ArcAftStartAsm = AvgAftStartAsmDif * EquiVd // 初虧前設時距弧
            const AngArcAftStartAsm = atan(ArcAftStartAsm / DistrealAvg) // 初虧前設時對距弧角
            let flagAngArcAftStartAsm = 1
            if (SmdAftStartAsm < SmdAvg) flagAngArcAftStartAsm = -1 // 初虧前設時在食甚用時前為西
            const DistrealAftStartAsm = ArcAftStartAsm / sin(AngArcAftStartAsm) // 初虧前設時兩心實距
            const DistappaAftStartAsm = distAppa2(SmdAftStartAsm, DistrealAftStartAsm, AngArcAftStartAsm, flagAngArcAftStartAsm)
            //////// 【十】初虧考定真時
            const StartDistappaDif = abs(DistappaBefStartAsm - DistappaAftStartAsm) // 初虧視距較
            const StartBefAftDif = abs(AvgBefStartAsmDif - AvgAftStartAsmDif) // 初虧設時較
            const StartDistappaRadSumDif = abs(RadSum - DistappaAftStartAsm) // 初虧視距併徑較
            let flag = DistappaAftStartAsm > RadSum ? 1 : -1
            if (isEnd) flag = -flag
            const AftStartAcrDif = flag * StartDistappaRadSumDif * StartBefAftDif / StartDistappaDif
            return SmdAftStartAsm + AftStartAcrDif // 初虧真時。此處就不再迭代求定真時了，不用那麼麻煩
        }
        const SmdStart = startEnd(SmdBefStartAsm, false)
        //////// 【十一】復圓前設時兩心視距
        const SmdEnd = startEnd(SmdBefEndAsm, true)
        const TotalSLon = sunQing(Name, SunRoot, SperiRoot, SmdAcr).SunLon
        return {
            Start: fix(deci(SmdStart)),
            Total: fix(deci(SmdAcr)),
            End: fix(deci(SmdEnd)),
            Magni, TotalSLon,
            TotalSEquaLon: LonHigh2Flat(Sobliq, TotalSLon),
            TotalSLat: HighLon2FlatLat(Sobliq, TotalSLon)
        }
    }
    const moonEcliJiazi = (NowSmd, AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon) => {
        // 1949算例AcrWhitelongi：177.3276
        const SDistMax = 1.0179208, SDistRatMax = 1162 // 太陽最高距地，地半徑比例數
        const MDistMax = 1.01725, MDistRatMax = 58.16
        const MRadReal = 0.27
        const SlRad = 6.37 // 太陽光分半徑
        const Mobliq0116 = 4.975 // 朔望黃白大距
        //////// 【八】食甚距緯、食甚時刻
        const Distreal = HighLon2FlatLat(Mobliq0116, AcrWhitelongi) // 食甚距緯：太陰距地心之白緯 // 1949算例0.2316638889
        const TotalWhitelongi = LonHigh2Flat(Mobliq0116, AcrWhitelongi) // 食甚交周：太陰距正交之白經
        const Dif = TotalWhitelongi - AcrWhitelongi  // 交周升度差。1949算例36.49″=0.01013611111
        const OnehAftMoonCorr1 = corrRingC(MorbVd / 24 + AcrMorb, .0435).Corr
        const MSAcrVhDif = MSAvgVdDif / 24 + OnehAftMoonCorr1 - AcrMoonCorr1 // 一小時月距日實行
        const TotalSmd = NowSmd + Dif / MSAcrVhDif / 24 // 實望實交周五宮十一宮（交前）爲加，初宮六宮（交後）爲減。食甚時刻=實望用時+-食甚距時
        //////// 【九】食分        
        const SDistRat = sunCorrQing(Name, AcrSorb).d / SDistMax * SDistRatMax // 太陽距地：太陽距地心與地半徑之比例
        const MDistRat = (corrRingC(AcrMorb, .0435).d - .01175) / MDistMax * MDistRatMax // 還要減去次均輪半徑
        const MRadAppa = atan(MRadReal / MDistRat) // 算例16′52.97″=0.28138
        const ShadowLeng = SDistRat / (SlRad - 1) // 地影長
        const ShadowCone = asin(1 / ShadowLeng) // 地影角
        const ShadowWid = tan(ShadowCone) * (ShadowLeng - MDistRat) // 月所當地影之濶
        const ShadowRad = atan(ShadowWid / MDistRat) // （從地球看的）地影半徑 // 1949算例46′24.78″=0.77355
        const RadSum = MRadAppa + ShadowRad // 併徑
        const Magni = (100 * (RadSum - abs(Distreal)) / (MRadAppa * 2)).toFixed(1)
        if (+Magni < 1) return
        //////// 【十】初虧復原時刻
        const ArcStartTotal = LonHigh2FlatB(Distreal, RadSum) // 初虧復圓距弧，同於正弧三角形有黃道、距緯求赤道，第五則
        const T_StartTotal = ArcStartTotal / MSAcrVhDif / 24 // 初虧復圓距時
        //////// 【十二】太陰經緯宿度
        const Dif2 = sign(Dif) * abs(LonHigh2Flat(Mobliq0116, TotalWhitelongi) - TotalWhitelongi) // 黃白升度差。食甚距時加者亦爲加
        const TotalMLon = (AcrSunLon + Dif + Dif2 + 180) % 360 // 加減食甚距弧（是Dif嗎？？），再加黃白升度差
        const TotalMLat = HighLon2FlatLat(Mobliq0116, TotalWhitelongi)
        const { EquaLon: TotalMEquaLon, EquaLat: TotalMEquaLat } = starEclp2Equa(Sobliq, TotalMLon, TotalMLat)
        return { Start: fix(deci(TotalSmd - T_StartTotal)), End: fix(deci(TotalSmd + T_StartTotal)), Total: fix(deci(TotalSmd)), Magni, TotalMLon, TotalMLat, TotalMEquaLon, TotalMEquaLat }
    }
    const moonEcliGuimao = NowSmd => {
        const MoonParallaxMidMax = .95833333333333 // 太陰中距最大地半徑差 57分30秒
        const MoonRadMid = .26125 // 940.5 / 3600
        const SunRadMid = .26833333333333 // 中距太陽視半徑16分6秒
        const SunParallax = .00277777777778 // 10秒
        //////// 【一】實望用時
        //////// 【二】食甚實緯、食甚時刻
        const SunNow = sunQing(Name, SunRoot, SperiRoot, NowSmd)
        const SunOnehAft = sunQing(Name, SunRoot, SperiRoot, NowSmd + 1 / 24)
        const MoonNow = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, NowSmd, SunNow.SunCorr, SunNow.SunGong, SunNow.Speri, SunNow.Sorb)
        const MoonOnehAft = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, NowSmd + 1 / 24, SunOnehAft.SunCorr, SunOnehAft.SunGong, SunOnehAft.Speri, SunOnehAft.Sorb)
        // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
        const AngEquiWhite = qiexian(SunOnehAft.SunGong - SunNow.SunGong, MoonOnehAft.Whitegong - MoonNow.Whitegong, MoonNow.Mobliq).Ashort // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
        const AngEquiEclp = MoonNow.Mobliq + AngEquiWhite // 斜距黃道交角
        const Dist = abs(cos(AngEquiEclp) * MoonNow.MoonLat) // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
        const EquiVd = (SunOnehAft.SunGong - SunNow.SunGong) * sin(MoonNow.Mobliq) / sin(AngEquiWhite) * 24 // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA                    
        const ArcTotalNow = abs(sin(AngEquiEclp) * MoonNow.MoonLat) // 食甚距弧
        const TotalNowDif = (MoonNow.Whitelongi % 180 < 90 ? -1 : 1) * ArcTotalNow / EquiVd // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
        const TotalSmd = NowSmd + TotalNowDif
        const SunTotal = sunQing(Name, SunRoot, SperiRoot, TotalSmd)
        const MoonTotal = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, TotalSmd, SunTotal.SunCorr, SunTotal.SunGong, SunTotal.Speri, SunTotal.Sorb)
        //////// 【三】食分
        const AcrMorb = MoonNow.Morb + MoonTotal.Corr1
        const AcrSorb = SunNow.Sorb + SunTotal.SunCorr
        const MDist = distEllipseA(AcrMorb, MoonNow.MoonC)
        const MoonParallax = MoonParallaxMidMax / MDist // 太陰地半徑差。此一弧度代正弦算。
        const SunRad = SunRadMid / distEllipseA(AcrSorb, .0169) // 太陽視半徑。
        const ShadowRad = MoonParallax + SunParallax - SunRad + MoonParallax / 69 // 實影半徑=月半徑差+日半徑差-日半徑+影差。太陽地半徑差10秒。
        const MoonRad = MoonRadMid / MDist // 太陰視半徑
        const RadSum = MoonRad + ShadowRad // 併徑——也就是出現月食的最大極限
        // const RadDif = MoonRad - ShadowRad // 兩徑較
        const Magni = (100 * (RadSum - Dist) / (MoonRad * 2)).toFixed(1) // 若食甚實緯大於併徑，則月與地影不相切，則不食，即不必算。上編卷七：併徑大於距緯之較，即爲月食之分
        if (+Magni < 1) return
        //////// 【四】初虧復圓時刻
        const ArcStartTotal = sqr((RadSum + Dist) * (RadSum - Dist)) // 初虧復圓距弧。就是直角三角形已知兩邊
        const T_StartTotal = ArcStartTotal / EquiVd // 初虧復圓距時
        //////// 【五】食既生光時刻
        //////// 【六】食甚太陰黃道經緯宿度
        const LengTotalNow = TotalNowDif * (MoonOnehAft.Whitegong - MoonNow.Whitegong) * 24 // 距時月實行
        const TotalWhitelongi = MoonNow.Whitelongi + LengTotalNow // 食甚月距正交        
        const { MoonLon: TotalMLon, MoonLat: TotalMLat } = White2Eclp(MoonNow.Mobliq, MoonNow.Node, TotalWhitelongi)
        //////// 【七】食甚太陰赤道經緯宿度
        const { EquaLon: TotalMEquaLon, EquaLat: TotalMEquaLat } = moonEclp2EquaGuimao(Sobliq, TotalMLon, TotalMLat)
        return { Start: fix(deci(TotalSmd - T_StartTotal)), End: fix(deci(TotalSmd + T_StartTotal)), Total: fix(deci(TotalSmd)), Magni, TotalMLon, TotalMLat, TotalMEquaLon, TotalMEquaLat }
    }
    const iteration = (Smd, step, isNewm) => { // 後編迭代求實朔實時
        let { Speri: SperiBef, Sorb: SorbBef, SunCorr: SunCorrBef, SunLon: SunLonBef, SunGong: SunGongBef } = sunQing(Name, SunRoot, SperiRoot, Smd - step) // 如實望泛時爲丑正二刻，則以丑正初刻爲前時，寅初初刻爲後時——為什麼不說前後一時呢
        const { MoonLon: MoonLonBef } = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, Smd - step, SunCorrBef, SunGongBef, SperiBef, SorbBef)
        SunLonBef += isNewm ? 0 : 180
        SunLonBef %= 360
        let { Speri: SperiAft, Sorb: SorbAft, SunCorr: SunCorrAft, SunLon: SunLonAft, SunGong: SunGongAft } = sunQing(Name, SunRoot, SperiRoot, Smd + step)
        const { MoonLon: MoonLonAft } = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, Smd + step, SunCorrAft, SunGongAft, SperiAft, SorbAft)
        SunLonAft += isNewm ? 0 : 180
        SunLonAft %= 360
        const Deci = deci(Smd) - step + t(SunLonBef - MoonLonBef) / (t(MoonLonAft - MoonLonBef) - t(SunLonAft - SunLonBef)) * step * 2 // 一小時月距日實行
        return ~~Smd + Deci // 實朔實時距冬至次日的時間
    }
    const term = (i, isMid) => {
        const TermGong = ((2 * i + (isMid ? 2 : 1)) * 15) % 360
        const TermSmd = (i + (isMid ? 1 : .5)) * TermLeng - (1 - SolsDeci)
        const TermSc = ScList[(SolsmorScOrder + ~~TermSmd) % 60]
        const TermDeci = fix(deci(TermSmd))
        const TermSperiMidn = SperiRoot + SperiVd * ~~TermSmd
        const TermSunCorr = sunCorrQing(Name, TermGong - TermSperiMidn).Corr
        const AcrlineBSmd = TermSmd - TermSunCorr / SunAvgVd // 下編之平氣推定氣法。算這步是為了確定注曆定氣是在哪天
        // 推節氣時刻法。沒有推逐日太陽宮度，為了少點麻煩，只用泛時本日次日，不考慮再昨天或明天的情況。與曆書相較密合。        
        const SunTod = sunQing(Name, SunRoot, SperiRoot, ~~AcrlineBSmd)
        const SunMor = sunQing(Name, SunRoot, SperiRoot, ~~AcrlineBSmd + 1)
        const Tod = SunTod.SunGong
        const Mor = SunMor.SunGong
        const AcrlineSmd = ~~AcrlineBSmd + (TermGong - Tod + (TermGong === 0 ? 360 : 0)) / ((Mor - Tod + 360) % 360)
        const NowlineSmd = AcrlineSmd + timeAvg2Real(Name, Sobliq, Gong2Lon(TermGong), SunTod.SunCorr)
        const NowlineSc = ScList[(SolsmorScOrder + ~~NowlineSmd) % 60]
        // const NowlineDeci = fix(deci(NowlineSmd), 3)
        const NowlineDeci = clockQingB(deci(NowlineSmd) * 100)
        const { Eclp: TermEclp, Equa: TermEqua } = mansionQing(Name, Y, TermGong)
        // 再加上迭代。曆書用的本日次日比例法，少部分密合，大部分相差5-15分鐘。輸出的是視時
        const tmp = TermGong - sunQing(Name, SunRoot, SperiRoot, AcrlineSmd).SunGong // 預防冬至0宮的問題
        const AcrSmd = AcrlineSmd + (abs(tmp) > 180 ? tmp + 360 : tmp) / SunAvgVd // 迭代
        const NowSmd = AcrSmd + timeAvg2Real(Name, Sobliq, Gong2Lon(TermGong), sunQing(Name, SunRoot, SperiRoot, AcrSmd).SunCorr)
        const NowDeci = fix(deci(NowSmd), 3)
        return { TermSc, TermDeci, TermAcrSmd: NowlineSmd, TermAcrSc: NowlineSc, TermAcrDeci: NowlineDeci, TermNowDeci: NowDeci, TermEqua, TermEclp } // 為了和古曆統一，此處改名
    }
    const main = (isNewm, LeapNumTerm) => {
        const AvgSc = [], AvgDeci = [], NowSc = [], NowlineSmd = [], NowlineDeci = [], NowSmd = [], NowDeci = [], Eclp = [], Equa = [], TermSc = [], TermDeci = [], TermAcrSmd = [], TermAcrSc = [], TermAcrDeci = [], TermNowDeci = [], Term1Sc = [], Term1Deci = [], TermEqua = [], TermEclp = [], Term1AcrSc = [], Term1AcrDeci = [], Term1NowDeci = [], Term1Equa = [], Term1Eclp = [], Ecli = [], Rise = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望
            // const AvgSmd = 212 // 1921算例
            const AvgSmd = ChouSmd + (i + (isNewm ? 0 : .5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgSmdMidn = ~~AvgSmd
            AvgSc[i] = ScList[(SolsmorScOrder + AvgSmdMidn) % 60]
            AvgDeci[i] = fix(deci(AvgSmd))
            let AcrSmd = 0, AcrlineDeci = 0, AcrSunGong = 0, AcrWhitelongi = 0, AcrSunCorr = 0, AcrMorb = 0, AcrMoonCorr1 = 0, AcrSorb = 0
            // 月離曆法·推合朔弦望法：直接用本日次日太陽太陰實行求，但必須先確定本日次日是哪日
            let AcrlineSmdMidn = AvgSmdMidn
            const acrlineDeci = SmdMidn => {
                const { Speri: SperiTod, Sorb: SorbTod, SunCorr: SunCorrTod, SunLon: SunLonTodRaw, SunGong: SunGongTod } = sunQing(Name, SunRoot, SperiRoot, SmdMidn)
                const { MoonLon: MoonLonTod } = moonQing(Name, MoonRoot, NodeRoot, MapoRoot, SmdMidn, SunCorrTod, SunGongTod, SperiTod, SorbTod)
                const SunLonTod = (SunLonTodRaw + (isNewm ? 0 : 180)) % 360
                const { Speri: SperiMor, Sorb: SorbMor, SunCorr: SunCorrMor, SunLon: SunLonMorRaw, SunGong: SunGongMor } = sunQing(Name, SunRoot, SperiRoot, SmdMidn + 1)
                const { MoonLon: MoonLonMor } = moonQing(Name, MoonRoot, NodeRoot, MapoRoot, SmdMidn + 1, SunCorrMor, SunGongMor, SperiMor, SorbMor)
                const SunLonMor = (SunLonMorRaw + (isNewm ? 0 : 180)) % 360
                return {
                    MoonLonTod, SunLonTod, MoonLonMor, SunLonMor,
                    AcrlineDeci: t(SunLonTod - MoonLonTod) / (t(MoonLonMor - MoonLonTod) - t(SunLonMor - SunLonTod))
                }
            }
            const { MoonLonTod, SunLonTod, MoonLonMor, SunLonMor, AcrlineDeci: AcrlineDeciTmp } = acrlineDeci(AvgSmdMidn)
            AcrlineDeci = AcrlineDeciTmp
            if (t(MoonLonTod - SunLonTod) > 180) {
                if (t(MoonLonMor - SunLonMor) > 180) { // 如次日太陰實行仍未及太陽，則次日爲實朔日
                    AcrlineSmdMidn++
                    AcrlineDeci = acrlineDeci(AcrlineSmdMidn).AcrlineDeci
                }
            } else { // 如太陰實行未及太陽，則平朔日為實朔本日
                AcrlineSmdMidn--
                AcrlineDeci = acrlineDeci(AcrlineSmdMidn).AcrlineDeci
            }
            const AcrlineSmd = AcrlineSmdMidn + AcrlineDeci // 用今明兩日線性內插注曆
            // 以下是交食用的精確朔望
            if (Name === 'Guimao') {
                //////// 實朔望泛時。甲子元曆尚把注曆的朔望和交食的朔望分開，癸卯元曆就合一了。癸卯元求泛時是只固定用平朔望今明兩天，而甲子元則是選用定朔望今明兩天，此處我統一用甲子元的辦法
                //////// 實朔望實時
                const Acr0Smd = iteration(AcrlineSmd, .5 / 24, isNewm)
                AcrSmd = iteration(Acr0Smd, .1 / 24, isNewm) // 我再加一次迭代
                const { Speri: AcrSperi, Sorb: AcrSorbTmp, SunCorr: AcrSunCorrTmp, SunGong: AcrSunGongTmp } = sunQing(Name, SunRoot, SperiRoot, AcrSmd)
                AcrWhitelongi = moonGuimao(Name, MoonRoot, NodeRoot, MapoRoot, AcrSmd, AcrSunCorrTmp, AcrSunGongTmp, AcrSperi, AcrSorbTmp).Whitelongi
                AcrSunGong = AcrSunGongTmp
                AcrSunCorr = AcrSunCorrTmp
            } else {
                // 月食曆法·推實朔用時法
                // 原術是用首朔算（註釋算法）我直接改成積日
                // const AvgSunGong = (ChouSun + (i + (isNewm ? 0 : .5)) * SunAvgVm) % 360 // 平望太阳平行
                const AvgSunGong = t(SunRoot + AvgSmd * SunAvgVd)
                // const AvgSorb = (ChouSorb + (i + (isNewm ? 0 : .5)) * SorbVm) % 360 // 算例99°21′54.11″=99.3650305556
                const AvgSperi = SperiVd * AvgSmdMidn + SperiRoot
                const AvgSorb = t(AvgSunGong - AvgSperi)
                const AvgMapo = MapoVd * AvgSmdMidn + MapoRoot
                // const AvgMorb = (ChouMorb + i * MorbVm + (isNewm ? 0 : (MorbVm + 360) / 2)) % 360 // 1949算例200°22′05.77″=200.3682694444
                const AvgMoonGong = t(MoonRoot + AvgSmd * MoonAvgVd)
                const AvgMorb = t(AvgMoonGong - AvgMapo)
                const AvgSunCorr = sunCorrQing(Name, AvgSorb).Corr // 平望太陽均數
                const AvgMoonCorr1 = corrRingC(AvgMorb, .0435).Corr // 平望太陰均數.1949算例1°46′58.30″=1.7828611111
                const AvgT_MSDif = (AvgSunCorr - AvgMoonCorr1) / MSAvgVdDif // 距時=距弧（日月相距之弧）/速度差。算例27m56s=0.01939814815
                AcrSorb = AvgSorb + AvgT_MSDif * SorbVd // 太陽實引=平引+引弧。算例99°23′2.94″=99.38415
                AcrMorb = AvgMorb + AvgT_MSDif * MorbVd // 太陰實引.1949算例200°37′18.14″=200.6217055556
                AcrSunCorr = sunCorrQing(Name, AcrSorb).Corr // 太陽實均.1949算例2°01′15.89″=2.02108055556
                AcrMoonCorr1 = corrRingC(AcrMorb, .0435).Corr // 太陰實均。1949算例1°48′14.36″=1.8039888889
                const AcrT_MSDif = (AcrSunCorr - AcrMoonCorr1) / MSAvgVdDif // 實距時=實距弧/速度差。1949算例：25m39s=0.0178125
                AcrSmd = AvgSmd + AcrT_MSDif // 實望
                const S_MoonPlusNode = AcrT_MSDif * MoonNodeVdSum // 交周距弧
                // const AvgWhitelongi = (ChouWhitelongi + i * MoonNodeVmSum + (isNewm ? 0 : (MoonNodeVmSum + 360) / 2)) % 360
                const AvgWhitelongi = t(MoonRoot - NodeRoot + AvgSmd * MoonNodeVdSum)
                AcrWhitelongi = t(AvgWhitelongi + S_MoonPlusNode + AcrMoonCorr1) // 實望實交周=實望平交周（平望太陰交周+交周距弧）+太陰實均。1949算例：175°17′16.62″+14′8.34″+1°48′14.36″=177°19′39.36″，175.28795+0.23565+1.8039888889=177.327588889
                AcrSunGong = AvgSunGong + AcrT_MSDif * SunAvgVd + AcrSunCorr // 太陽黃經=實望太陽平行（平望+太陽距弧（平望至實望太陽本輪心行度））+太陽實均 // 1949算例23°5′9.38″=23.08593888889            
            }
            const AcrSunLon = Gong2Lon(AcrSunGong)
            const { SunCorr: SunCorrLineMidn, SunLon: SunLonLineMidn } = sunQing(Name, SunRoot, SperiRoot, AcrlineSmdMidn) // 為了寫得方便，索性重算一遍
            NowlineSmd[i] = AcrlineSmd + (Name === 'Guimao' ? timeAvg2Real(Name, Sobliq, SunLonLineMidn, SunCorrLineMidn) : 0) // 新法、永年、甲子的時差放在月離裡面
            // NowlineDeci[i] = fix(deci(NowlineSmd[i]), 3)
            NowlineDeci[i] = clockQingB(deci(NowlineSmd[i]) * 100)
            NowSmd[i] = AcrSmd + timeAvg2Real(Name, Sobliq, AcrSunLon, AcrSunCorr) // 朔望只有月離初均，沒有日差，所以都要加。不清楚新法的交食用那種日差
            NowSc[i] = ScList[(SolsmorScOrder + ~~NowSmd[i]) % 60]
            NowDeci[i] = fix(deci(NowSmd[i]), 3)
            const Func = mansionQing(Name, Y, AcrSunGong)
            Eclp[i] = Func.Eclp
            Equa[i] = Func.Equa
            //////// 交食
            let isEcli = false // 入食限可以入算
            const tmp = t3(AcrWhitelongi) // 距離0、180的度數            
            if (isNewm) isEcli = AcrWhitelongi % 180 < 180 ? tmp < SunLimitYinAcr : tmp < SunLimitYangAcr
            else isEcli = tmp < MoonLimit
            if (isEcli) {
                Rise[i] = sunRiseQing(Sobliq, RiseLat, AcrSunLon)
                if (isNewm) {
                    if (deci(NowSmd[i]) < Rise[i] - 5 / 96 || deci(NowSmd[i]) > 1 - Rise[i] + 5 / 96) { }
                    else {
                        if (Name === 'Xinfa' || Name === 'Yongnian') Ecli[i] = sunEcliJiazi(NowSmd[i], AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon)
                        else if (Name === 'Jiazi') Ecli[i] = sunEcliJiazi(NowSmd[i], AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon)
                        else Ecli[i] = sunEcliGuimao(NowSmd[i], AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon)
                    }
                } else {
                    if (deci(NowSmd[i]) > Rise[i] + 9 / 96 && deci(NowSmd[i]) < 1 - Rise[i] - 9 / 96) { } // 日出入前後9刻以內入算
                    else {
                        if (Name === 'Xinfa' || Name === 'Yongnian') Ecli[i] = moonEcliJiazi(NowSmd[i], AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon)
                        else if (Name === 'Jiazi') Ecli[i] = moonEcliJiazi(NowSmd[i], AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon)
                        else Ecli[i] = moonEcliGuimao(NowSmd[i], AcrWhitelongi, AcrMorb, AcrMoonCorr1, AcrSorb, AcrSunLon)
                    }
                }
            }
            //////// 節氣
            if (isNewm) {
                const Func = term(i, true)
                TermSc[i] = Func.TermSc
                TermDeci[i] = Func.TermDeci
                TermAcrSmd[i] = Func.TermAcrSmd
                TermAcrSc[i] = Func.TermAcrSc
                TermAcrDeci[i] = Func.TermAcrDeci
                TermNowDeci[i] = Func.TermNowDeci
                TermEclp[i] = Func.TermEclp
                TermEqua[i] = Func.TermEqua
                const Func1 = term(i, false)
                Term1Sc[i] = Func1.TermSc
                Term1Deci[i] = Func1.TermDeci
                Term1AcrSc[i] = Func1.TermAcrSc
                Term1AcrDeci[i] = Func1.TermAcrDeci
                Term1NowDeci[i] = Func1.TermNowDeci
                Term1Eclp[i] = Func1.TermEclp
                Term1Equa[i] = Func1.TermEqua
            }
        }
        //////// 置閏
        LeapNumTerm = LeapNumTerm || 0
        if (isNewm) {
            for (let i = 1; i <= 12; i++) {
                if ((~~TermAcrSmd[i] < ~~NowlineSmd[i + 1]) && (~~TermAcrSmd[i + 1] >= ~~NowlineSmd[i + 2])) {
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
                    EcliPrint[i] += '出' + fix(Rise[i]) + ' ' + Ecli[i].Magni + '% 虧' + Ecli[i].Start + '甚' + Ecli[i].Total + '復' + Ecli[i].End + ' 入' + fix(1 - Rise[i]) + ' 甚日黃道' + deg2Hms(Ecli[i].TotalSLon) + ' 赤道' + deg2Hms(Ecli[i].TotalSEquaLon) + ' ' + Lat2NS(Ecli[i].TotalSLat)
                } else {
                    EcliPrint[i] = `<span class='eclipse'>M${NoleapMon}</span>`
                    EcliPrint[i] += '入' + fix(1 - Rise[i]) + ' ' + Ecli[i].Magni + '% 虧' + Ecli[i].Start + '甚' + Ecli[i].Total + '復' + Ecli[i].End + ' 出' + fix(Rise[i]) + ' 甚月黃道' + deg2Hms(Ecli[i].TotalMLon) + ' ' + Lat2NS(Ecli[i].TotalMLat) + ' 赤道' + deg2Hms(Ecli[i].TotalMEquaLon) + ' ' + Lat2NS(Ecli[i].TotalMEquaLat)
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
            NowSc, NowlineDeci, NowDeci, NowSmd, Eclp, Equa,
            TermSc, TermDeci,
            TermAcrSc, TermAcrDeci, TermNowDeci, TermEqua, TermEclp,
            Term1Sc, Term1Deci,
            Term1AcrSc, Term1AcrDeci, Term1NowDeci, Term1Equa, Term1Eclp,
            EcliPrint, LeapNumTerm
        }
    }
    const {
        AvgSc: NewmAvgSc, AvgDeci: NewmAvgDeci, NowlineDeci: NewmNowlineDeci, NowSc: NewmSc, NowDeci: NewmDeci, NowSmd: NewmSmd, Equa: NewmEqua, Eclp: NewmEclp, EcliPrint: SunEcli,
        TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermNowDeci, TermEqua, TermEclp,
        Term1Sc, Term1Deci, Term1AcrSc, Term1AcrDeci, Term1NowDeci, Term1Equa, Term1Eclp, LeapNumTerm
    } = main(true)
    const {
        NowlineDeci: SyzygyNowlineDeci, NowSc: SyzygySc, NowDeci: SyzygyDeci, EcliPrint: MoonEcli
    } = main(false, LeapNumTerm)
    // } = main(false)
    return {
        LeapNumTerm, NewmAvgSc, NewmAvgDeci, NewmSc, NewmNowlineDeci, NewmDeci, NewmEqua, NewmEclp, SyzygySc, SyzygyNowlineDeci, SyzygyDeci, SunEcli, MoonEcli, TermSc, TermDeci, TermAcrSc, TermAcrDeci, TermNowDeci, TermEqua, TermEclp,
        Term1Sc, Term1Deci, Term1AcrSc, Term1AcrDeci, Term1NowDeci, Term1Equa, Term1Eclp,
        //// 曆書用
        SunRoot, SperiRoot, MoonRoot, MapoRoot, NodeRoot, SolsAccum, MansionDaySolsmor, NewmSmd, Sols, SolsmorScOrder
    }
}
// console.log(N4("Guimao", 1760)) // 《後編》卷三《日食食甚真時及兩心視距》葉64算例：1730六月日食，見說明文檔
// console.log(N4("Xinfa", -548)) // https://zhuanlan.zhihu.com/p/513322727 1949月食算例。1921月離算例https://zhuanlan.zhihu.com/p/512380296 。2009日食算例https://zhuanlan.zhihu.com/p/670820567
// console.log(sunQing(Name,SunRoot, SperiRoot,313)) // 日躔與這個驗算無誤 https://zhuanlan.zhihu.com/p/526578717 算例：Smd=313，SunRoot=0+38/60+26.223/3600，SperiRoot=166*(1/60+2.9975/3600)
// 月離與這個驗算無誤 https://zhuanlan.zhihu.com/p/527394104
// Sorb = 298 + 6 / 60 + 9.329 / 3600
// AcrMoon0 = 295.5279086111
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