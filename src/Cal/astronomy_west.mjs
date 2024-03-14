import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac, DeciFrac2IntFrac } from './equa_math.mjs'
import { Gong2Lon, GongFlat2High, GongHigh2Flat, HighLon2FlatLat, Lon2Gong, LonFlat2High, LonHigh2Flat } from './newm_shixian.mjs'
const pi = Math.PI //big.acos(-1)
// const d2r = degree => big(degree).mul(pi).div(180)
// const r2d = degree => big(degree).mul(180).div(pi)
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = X => Math.sin(d2r(X))//.toFixed(8) // 數理精蘊附八線表用的是七位小數
const cos = X => Math.cos(d2r(X)) //.toFixed(8)
const tan = X => Math.tan(d2r(X))//.toFixed(8)
const cot = X => (1 / Math.tan(d2r(X)))//.toFixed(8)
const asin = X => r2d(Math.asin(X))//.toFixed(8)
const acos = X => r2d(Math.acos(X))//.toFixed(8)
const atan = X => r2d(Math.atan(X))//.toFixed(8)

// const tanliufenyi = (Deg, h) => {
//     Deg = d2r(Deg)
//     const x = big(h).div(Deg.tan())
//     return x.toFixed(6)
// }
// console.log(tanliufenyi(14.1,1.1))

// const SunAcrVWest = (Sd, Solar) => { // 極值出現在冬至後0.47345個節氣，說明現在冬至並非近地點 .47344981964   24.6116951198865  週期 24.1382453      f(x) =  .9864 + .03331  *cos(x*.2603) +  .004126*sin(x*.2603) 
//     Sd = big(Sd).mul(24.1382453).div(Solar).add(.47344981964)
//     const SunAcrV = big(.9864).add(big(.03331).mul(big.mul(Sd, .2603).cos())).add(big(.004126).mul(big.mul(Sd, .2603)).sin())
//     return SunAcrV.toString()
// }
// console.log(SunAcrVWest(91, 365.2425))

// const SunAcrVWest = (Sd, Solar) => { // 我用定氣數據擬合的函數。 週期23.674398328214，極值2.023，-1.774 ，但是實際上應該是2.32，奇怪 .1242-.1018 *cos(x*.2654) + 1.896*sin(x*.2654)
//     Sd = d2r(big(Sd).mul(24).div(Solar))
//     return SunDifAccum.toString()
// }

export const ConstWest = (year, m, d) => { // 儒略世紀：36525日。我下面索性將100年作爲儒略世紀，要不然太麻煩
    year = +year
    // 黃赤交角 ε = 84381.448 − 46.84024T − (59 × 10^−5)T^2 + (1813 × 10^−6)T^3 // https://zh.wikipedia.org/zh-hans/%E8%BD%89%E8%BB%B8%E5%82%BE%E8%A7%92
    const t = big.sub(year, 2000).div(100)
    const e = +(big(84381.448).sub(t.mul(46.84024)).sub(t.pow(2).mul(big(10).pow(-5).mul(59))).add(t.pow(3).mul(big(10).pow(-6).mul(1813))).div(3600).toFixed(10))
    //《古曆新探》頁322.近日點平黃經 ω=281+13/60+15/3600+1.719175*T+ (1.63/3600)*T^2+(.012/3600)*T^3 // T自1900起算的儒略世紀數。也就是說近日點越來越向春分移動 。375年在大雪，1247年近日點在冬至
    const T = big(year - 1900).div(100)
    const perihelion = +(big(281).add(13 / 60).add(15 / 3600).add(T.mul(1.719175)).add(big.div(1.63, 3600).mul(T).pow(2)).add(big.div(.012, 3600).mul(T).pow(3)).toFixed(8))
    // 黃道離心率 e=.01670862 -.00004204T-.000000124T**2
    const eccentricity = +(big(.01675104).sub(big(.0000418).mul(T)).sub(big(.00000000126).mul(T).pow(2)).toFixed(8))
    const y = big(year - 2000)
    const y1 = y.div(1000)
    const Solar = big(365.242189623).sub(big(.000061522).mul(y1)).sub(big.mul(big(6.09).mul(1e-8), y1.pow(2))).add(big.mul(big(2.6525).mul(1e-7), y1.pow(3))).toNumber()
    // τ = 365.242189623 - .000061522t - 6.09 × 1e-8 t^2 + 2.6525 * 1e-7 t^3 (t为J2000起算的儒略千年数)。VSOP87 曆表 Meeus J，Savoie D. The history of the tropical year[J]. Journal of the British Astronomical Association，1992，102( 1) : 42. 
    const Sidereal = big(365.25636042).add(big(.000000001).mul(y)).toNumber()
    const Lunar = big(29.530588853).add(big(.000000002162).mul(y)).toNumber()
    const Anoma = big(27.554549878).sub(big(.00000001039).mul(y)).toNumber() // 近點月
    const Node = big(27.21222082).add(big(.0000000038).mul(y)).toNumber()
    const Print = `朔望月 ${Lunar} 日
近點月 ${Anoma} 日
交點月 ${Node} 日
回歸年 ${Solar} 日
恆星年 ${Sidereal} 日
黃赤交角 ${e}°
黃道離心率 ${eccentricity}
近日點平黃經 ${perihelion}°`
    return { Print, e, perihelion, eccentricity, Anoma, Solar, Sidereal, Lunar }
}
// console.log(ConstWest(-401).Print)

export const BindSolarChange = year => {
    year = +year
    const year1 = year - 1194 // 現代値歸算爲統天曆元
    const year2 = year - 1281
    const sign1 = year1 > 0 ? -1 : 1
    const sign2 = year2 > 0 ? -1 : 1
    const SolarWest = big(365.2422393296).sub(big(6.16 * 1e-8).mul(year1)).toNumber()
    const SolarChangeWest = parseFloat((sign1 * big(3.08 * 1e-8).mul(year1 ** 2).toNumber()).toPrecision(12))
    const SolarTongtian = parseFloat((365.2425 - .021167 / 12000 * year1).toPrecision(10))
    const SolarChangeTongtian = parseFloat((sign1 * .0127 / 12000 * year1 ** 2).toPrecision(10))
    const SolarShoushi = parseFloat((365.2425 - 2 * 1e-6 * year2).toPrecision(10))
    const SolarChangeShoushiRaw = parseFloat((-~~(year2 / 100) / 10000).toPrecision(10))
    const SolarChangeShoushi = parseFloat((sign2 * -SolarChangeShoushiRaw * year2).toPrecision(10))
    const SolarWannian = parseFloat((365.2425 - 1.75 * 1e-6 * year2).toPrecision(10))
    const SolarChangeWannian = parseFloat((sign1 * 8.75 * 1e-7 * year2 ** 2).toPrecision(10))
    const LunarWest = big(29.530587110428).add(big(2.162 * 1e-9).mul(year1)).toNumber()
    const LunarCahngeWest = -sign1 * (big(1.081 * 1e-9).mul(year1 ** 2)).toNumber()
    const LunarTongtian = parseFloat((year1 ? (365.2425 + SolarChangeTongtian / year1 - 7 / 8000) / (365.2425 / (29 + 6368 / 12000)) : 29 + 6368 / 12000).toPrecision(10))
    const LunarChangeTongtian = parseFloat((-7 / 8000 * year1).toPrecision(10))
    let Print = []
    Print = Print.concat({
        title: '現代',
        data: [SolarWest, '', SolarChangeWest, LunarWest, LunarCahngeWest]
    })
    Print = Print.concat({
        title: '統天',
        data: [SolarTongtian, '', SolarChangeTongtian, LunarTongtian, LunarChangeTongtian]
    })
    Print = Print.concat({
        title: '授時',
        data: [SolarShoushi, SolarChangeShoushiRaw, SolarChangeShoushi]
    })
    Print = Print.concat({
        title: '聖壽萬年',
        data: [SolarWannian, '', SolarChangeWannian]
    })
    return Print
}
// console.log(BindSolarChange(2000))
export const EquaEclpWest = (GongRaw, year) => { // 自變量：距冬至度數，此處暫未考慮太陽修正！
    const { Sidereal, e } = ConstWest(year)
    const Gong = (GongRaw * 360 / Sidereal) % 360
    const Eclp2Equa = GongHigh2Flat(e, Gong)
    const Equa2Eclp = GongFlat2High(e, Gong)
    const Eclp2EquaDif = Eclp2Equa - Gong
    const Equa2EclpDif = Equa2Eclp - Gong
    return { Eclp2Equa, Equa2Eclp, Equa2EclpDif, Eclp2EquaDif }
}
export const HighLon2FlatLatWest = (GongRaw, year) => { // 根據當年的黃赤交角
    const { Sidereal, e } = ConstWest(year)
    const Lon = (GongRaw * 360 / Sidereal + 270) % 360
    return HighLon2FlatLat(e, Lon)
}
/**
 * 一天之内太阳高度角的变化速率如何计算？ - Pjer https://www.zhihu.com/question/25909220/answer/1026387602 一年中太阳直射点在地球上的移动速度是多少？ - 黄诚赟的回答 https://www.zhihu.com/question/335690936/answer/754032487「太阳直射点的纬度变化不是匀速的，春分秋分最大，夏至冬至最小。」
https://zh.wikipedia.org/zh-hk/%E5%A4%AA%E9%99%BD%E4%BD%8D%E7%BD%AE
 * @param {*} v 時角（正午爲0單位°）
 * @param {*} Lat 正午12點赤緯
 * @param {*} f 地理緯度
 * @returns 太陽高度角
 */
const hourA2ElevatA = (v, Lat, f) => +(asin(sin(f) * sin(Lat) + cos(f) * cos(Lat) * cos(v))).toFixed(12)
// console.log(hourA2ElevatA(0, 23.5, 23))
/**
 * // https://zh.wikipedia.org/zh-hk/%E6%97%A5%E5%87%BA%E6%96%B9%E7%A8%8B%E5%BC%8F
// cosw=-tanftand 。f緯度，d赤緯 w日出時角
// =sina-sinfsind/cosfcosd 是考慮了視直徑、蒙氣差之後的。維基：a=.83
 * @param {*} l 黃經
 * @param {*} f 地理緯度
 * @param {*} Sobliq 黃赤交角
 * @returns 日出時刻
 */
export const sunRise = (Sobliq, f, l) => {
    const d = HighLon2FlatLat(Sobliq, l) // 赤緯
    const w0 = acos(-tan(f) * tan(d))
    const t0 = (180 - w0) / 360 * 100 // 未修正
    const w = acos((sin(-.77) - sin(f) * sin(d)) / (cos(f) * cos(d)))
    const t = (180 - w) / 360 * 100 // 考慮蒙气差、視半徑
    return { t0, t }
}
// console.log(sunRise(23.44, 39, 1))
// console.log(sunRiseQing(23.44, 39, 1))
// console.log(HighLon2FlatLatWest(182.625, 365.25, 2000).Lat)
// h太陽高度角=90°-|緯度φ-赤緯δ|。张富、张丽娟、邱本志《一种计算太阳低仰角蒙气差的有理函数逼近方法》，《太陽能學報》2015(9) // 還可參考 李文、赵永超《地球椭球模型中太阳位置计算的改进》
const refraction = h => (1819.08371242143 + 194.887513592849 * h + 1.46555397475109 * h ** 2 - .0419553783815395 * h ** 3) /
    (1 + .409283439734292 * h + .0667313795916436 * h ** 2 + .0000846859707945254 * h ** 3) / 3600
/** 下線，計算太陽的精確位置不太容易
 * 丁豔、袁隆基、趙培濤、仝軍令《太陽視日軌跡跟蹤算法研究》
 * @param {*} f 地理緯度
 * @param {*} h1 冬至時間 時
 * @param {*} m1 分
 * @param {*} s1 秒
 * @param {*} SdInt 距冬至日數
 * @param {*} h 此時時間 時
 * @param {*} m 分
 * @param {*} s 秒
 * @param {*} year 年份
 * @param {*} height 表高
 * @returns 
 */
export const Deciaml2Angle = (f, h1, m1, s1, SdInt, h, m, s, year, height) => {
    SdInt = parseInt(SdInt) // 距年前冬至整數日數，冬至當日爲0
    year = +year // 那一年
    const Solar = ConstWest(year).Solar
    const Deci1 = big(h1).div(24).add(big(m1).div(1440)).add(big(s1).div(86400)).toNumber() // 冬至
    const Deci = big(h).div(24).add(big(m).div(1440)).add(big(s).div(86400)).toNumber() // 所求
    SdInt += Deci - Deci1
    const Lon = big(SdInt).add(SunAcrVWest(SdInt, year).SunDifAccum).mul(360).div(Solar) // 黃經
    const Lat = d2r(big(HighLon2FlatLatWest(Lon, Solar, year).Lat).mul(360).div(Solar))
    // 假設正午時角是0，向西爲正，向東爲負
    const v = (Deci - .5) * 360 // 時角
    const a = hourA2ElevatA(v, Lat, f) // 太陽高度角
    let b = r2d(Lat.cos().mul(v.sin()).div(a.cos()).asin()) // 太陽方位角
    let z0 = 90 - a // 眞天頂距
    // 以下複製Lon2DialWest
    const r = .52
    const Refrac = refraction(a)
    const Parallax = big.div(8.8, 3600).mul(z0.sin())
    z0 = r2d(z0)
    const z = big(z0).sub(Refrac).sub(r).add(Parallax)
    const Angle = d2r(big(z))
    const Dial = Angle.tan().mul(height)
    b = b.toNumber()
    return '太陽高度角 ' + a.toFixed(6) + `°\n太陽方位角 ` + b.toFixed(6) + `°\n晷長 ` + Dial.toFixed(6)
}

// dial length = h tan(zenith height)
export const Lon2DialWest = (Sobliq, f, l) => { // 黃經，地理緯度，黃赤交角
    const d = HighLon2FlatLat(Sobliq, l) // 赤緯
    const h = 90 - Math.abs(f - d) // 正午太陽高度
    const z0 = f - d // 眞天頂距=緯度-赤緯
    const r = .52 // 日視直徑0.53度。角半径=atan(1/2 d/D)
    const Refrac = refraction(h) // 蒙气差使太陽升高
    const Parallax = 8.8 / 3600 * sin(z0) // p0太陽地平視差8.8s。視差總是使視位置降低，地平線最大，天頂爲0
    const z = z0 - Refrac + r / 2 + Parallax
    const Dial = (8 * tan(z)).toFixed(8) // 修正
    const Dial1 = (8 * tan(z0)).toFixed(8) // 未修正
    return { Dial, Dial1 }
}
const Lat = () => { // 由《周髀算经》推算观测地 的纬度有三种数据可用，一是夏至日影一尺六寸，二是冬至日影一丈三尺五寸，三是北极 高度一丈三寸。
    let x = 30.1
    const scale = x => Math.tan(d2r(x - 23.958428)) / Math.tan(d2r(x + 23.958428)) // 前2300年黃赤交角
    const norm = 1.6 / 13.5
    const eps = 1e-8
    while (x < 45) {
        if (scale(x) > norm - eps && scale(x) < norm + eps) {
            return x
        }
        x += .00001
    }
}
// console.log(Lat()) // 35.17369

// ε黃赤交角 Φ 黃白交角
const MoonLonWest_BACKUP = (EclpRaw, year) => { // 統一360度
    const Eclp = EclpRaw //(EclpRaw + 90) % 360
    const v0 = d2r(Eclp) // 距冬至轉換成距離春分的黃經
    const I = d2r(5.1453) // 授時黃白大距6
    const E = d2r(ConstWest(year).e) // 授時黃赤大距23.9
    const cosE = big.cos(E) // .9
    const tank = big.tan(I).div(big.sin(E)) // tank .22
    // const k = tank.atan() // k正交極數 12.7
    const tana0 = tank.mul(v0.sin()).div(tank.mul(cosE.mul(v0.cos())).add(1))
    const a0Raw = tana0.atan() // a0距差
    const a0 = r2d(a0Raw).abs().toNumber() // a0距差=赤經    
    let EquaLon = 0
    if ((Eclp >= 90 && Eclp < 180) || (Eclp >= 270)) {
        EquaLon = 90 + a0
    } else {
        EquaLon = 90 - a0
    }
    // a0 =k*Eclp/(Sidereal/4) //k=14.66 授時
    // 月離赤道正交：白赤道降交點
    const sinu = I.sin().mul(v0.sin()).div(a0Raw.sin()) // 白赤大距
    const u = r2d(sinu.asin())
    const l = r2d(a0Raw.sin().div(a0Raw.sin().pow(2).sub(I.sin().pow(2).mul(v0.sin().pow(2))).sqrt()).atan()) // WhiteLon
    return {
        EquaLon, a0,
        u: u.toNumber(),
        l: l.toNumber(),
    }
}
// console.log(MoonLonWest(165, 365.2575, 1281).u)

// 《數》頁348白赤差
const MoonLonWest = (NodeEclpLon, MoonEclpLon, year) => {
    const E = d2r(ConstWest(year).e)
    const I = d2r(5.1453)
    const v = d2r(NodeEclpLon) // 升交點黃經
    const b = d2r(MoonEclpLon - NodeEclpLon) // 月亮到升交點的黃道度
    const tmp = b.cos().mul(I.cos()).sub(I.sin().mul(big.cos(v.add(b))).mul(E.tan()))
    const g = r2d(b.sin().div(tmp).atan()) // 月亮距離升交點的白道度
    const EclpWhiteDif = g.sub(r2d(b)).toNumber()
    const WhiteLon = MoonEclpLon + EclpWhiteDif
    return { EclpWhiteDif, WhiteLon }
}
// console.log (MoonLonWest(0, 170, 1222))

// 下陳美東公式
const MoonLatWest = (NodeAccum, NodeAvgV, Sidereal, year) => {
    const T = d2r(45)
    const cosT = T.cos()
    const sinT = T.sin()
    const Node = big(27.212220817).add(big(.000000003833).mul(year - 2000))
    NodeAvgV = NodeAvgV || big(Sidereal).div(Node)
    const E = d2r(ConstWest(year).e)
    const sinE = E.sin()
    const cosE = E.cos()
    const cotE = big.tan(E.neg().add(pi.div(2)))
    const n0 = NodeAvgV.mul(NodeAccum).mul(pi).div(Sidereal / 2)
    const F = d2r(5.1453)
    const sinF = F.sin()
    const cosF = F.cos()
    /////甲/////
    const CH = sinT.div(cosT.mul(cosF).add(sinF.mul(cotE))).atan()
    const cosa = sinE.mul(sinF).mul(cosT).sub(cosE.mul(cosF))
    const sina = cosa.acos().sin()
    const DG = big.sin(n0.add(CH)).mul(sina).asin()
    const CD = cosa.mul(n0.add(CH).tan()).neg().atan()
    const BC = sinT.div(cosT.mul(cosE).add(sinE.mul(F.tan()))).atan()
    const DK = big.sin(CD.add(BC)).mul(E.tan()).atan()
    const GK = DG.sub(DK)
    /////乙//////
    const cosb = cosF.mul(cosE).add(sinF.mul(sinE).mul(cosT))
    const sinb = cosb.acos().sin()
    const AH = cosb.mul(cosF).sub(cosE).div(sinb.mul(sinF)).acos()
    const EM = big.sin(n0.add(AH)).mul(sinb).asin()
    const AB = sinT.mul(sinF).div(sinb).asin()
    const AE = cosb.mul(big.tan(n0.add(AH))).atan()
    const EI = big.sin(AE.sub(AB)).mul(E.tan())
    const IM = EI.sub(EM)

    const MoonLat = GK.abs().add(IM.abs()).div(2).toNumber()
    return MoonLat
}
// console.log(MoonLatWest(6, 0, 360, 1000))

// 下面這個加上了日躔。藤豔輝《宋代朔閏與交食研究》頁90,106
export const EcliWest = (NodeAccum, AnomaAccum, Deci, Sd, f, year) => { // 一日中的時刻，距冬至日及分，入轉日，地理緯度，公元年
    const ConstWestFunc = ConstWest(year)
    const Solar = ConstWestFunc.Solar
    f = d2r(f)
    const SunWestFunc = SunAcrVWest(Sd, year)
    let Lon = (SunWestFunc.Lon) % Solar // 黃經
    let SunV = SunWestFunc.SunAcrV
    let MoonV = MoonAcrVWest(AnomaAccum, year).MoonAcrVd
    SunV *= 360 / Solar
    MoonV *= 360 / Solar
    const d = HighLon2FlatLatWest(Lon, Solar, year).d // 赤緯radius
    const h = (Deci - .5) * 360 // 時角
    const a = hourA2ElevatA(h, d, f) // 太陽高度
    const e = d2r(ConstWestFunc.e) // 黃赤交角degree
    const H0 = big(.9507) // 假設是月亮地平視差57' // 月亮地平視差曲安京《數》頁413
    Lon = d2r(big(Lon).mul(360).div(Solar)).add(pi.mul(1.5)).mod(pi.mul(2)) //.toNumber()
    // const tanC = Lon.cos().mul(e.tan()).pow(-1) //.toNumber() // C星位角與赤經圈夾角
    // const sinC1 = h.sin().mul(f.cos()).mul(z0.div(90).asin()) //.toNumber() // C1星位角與黃道夾角
    // const F = tanC.atan().sub(sinC1.asin())
    // const Tcorr = H0.mul(d2r(z0).sin().mul(F.cos())).div(MoonV - SunV).toNumber()
    const k0 = H0.mul(f.cos()).div(MoonV - SunV) //.toNumber()
    const tmp = e.sub(e.mul(Lon.mod(pi.div(2))).div(pi.div(2)))
    const Tcorr0 = k0.mul(h.sin()) // 冬夏至點的特殊情況
    const Tcorr = Tcorr0.mul(tmp.cos()).add(k0.mul(Lon.add(pi.mul(.5)).cos())) // +k0cosl很奇怪，我自己加270度才湊出來的，實在不行就用Tcorr0
    const I = d2r(5.1453) // 黃白大距
    const k1 = H0.div(I.sin()).mul(f.sin()).mul(e.cos()) // 一個常數
    const k2 = H0.mul(f.cos()).mul(e.sin()).div(I.sin()) //.toNumber()
    const tmp1 = h.sin().mul(Lon.cos()).neg().sub(h.cos().mul(Lon.sin())) // 我這符號取了個負，要不然對不上
    const Mcorr = k1.add(k2.mul(tmp1))
    return {
        Tcorr: Tcorr.toNumber(),
        Tcorr0: Tcorr0.toNumber(),
        Mcorr: Mcorr.toNumber()
    }
}
// console.log(EcliWest(.5, 360, 8, 35, 1000))

// 潮汐計算 http://blog.sciencenet.cn/blog-684007-733958.html
// 這方法怎麼能用啊，日月分開計算，兩個明明是綜合影響
// const Tide = u => {
//     // const M = big(5.9722).mul(big(10).pow(24)) // 地球質量kg
//     // const m1=big(7.3477).mul(big(10).pow(22)) // 月球質量
//     // const m2=big(1.9885).mul(big(10).pow(30)) // 太陽質量
//     const M = 597.22
//     const m1 = 7.3477
//     const m2 = 198855000
//     const R=6371 // 地球半徑km
//     const D1=384401 // 月地距離
//     const D2=149597870 // 日地距離
//     const h1 = big(m1).mul(big(R).pow(4)).div(big(M).mul(2).mul(big(D1).pow(3))).mul(big(d2r(2 * u).add(1))).mul(1000).toFixed(4)
//     const h2 = big(m2).mul(big(R).pow(4)).div(big(M).mul(2).mul(big(D2).pow(3))).mul(big(d2r(2 * u).add(1))).mul(1000).toFixed(4)
//     return {
//         h1,
//         h2
//     }
// }
// https://newgoodlooking.pixnet.net/blog/post/113829993
// console.log(Tide(120))

export const Node2Cycle = (Node, Lunar) => {
    const NodeDenom = Frac2FalseFrac(Node).Denom
    let Cycle = 0
    if (NodeDenom === 1) {
        Node = big('27.' + Node)
        Lunar = big('29.' + Lunar)
        Cycle = big(.5).mul(Node.div(Lunar)).mul(Lunar.div(Lunar.sub(Node))).toFixed(32)
    } else {
        Node = frc('27 ' + Node)
        Lunar = frc('29 ' + Lunar)
        Cycle = frc('1/2').mul(Node.div(Lunar)).mul(Lunar.div(Lunar.sub(Node))).toFraction(true)
    }
    return Cycle
}
// console.log(Node2Cycle('2122221759', '5305958132'))
// console.log(Node2Cycle('780592/3678183', '659/1242'))

export const Cycle2Node = (Cycle, Lunar) => {
    const CycleDenom = Frac2FalseFrac(Cycle).Denom
    let Node = 0
    if (CycleDenom === 1) {
        Cycle = big('5.' + Cycle)
        Lunar = big('29.' + Lunar)
        Node = Lunar.mul(Cycle.div(big.add(.5, Cycle))).toFixed(32)
    } else {
        Cycle = frc('5 ' + Cycle)
        Lunar = frc('29 ' + Lunar)
        Node = Lunar.mul(Cycle.div(frc('1/2').add(Cycle))).toFraction(true)
    }
    return Node
}
// console.log(Cycle2Node('404/465', '659/1242'))

export const Regression = (Sidereal, Node, Lunar) => {
    let Regression = 0
    let Portion = 0
    if (Sidereal.includes('/') && Node.includes('/') && Lunar.includes('/')) {
        Sidereal = frc('365 ' + DeciFrac2IntFrac(Sidereal))
        Node = frc('27 ' + DeciFrac2IntFrac(Node))
        Lunar = frc('29 ' + DeciFrac2IntFrac(Lunar))
        Regression = Sidereal.div(Node).sub(Sidereal.div(Lunar)).sub(1)
        Portion = Regression.add(1).div(Sidereal.div(Lunar).add(1).add(Regression))
        Regression = Regression.toFraction() + ' = ' + Regression.toString()
        Portion = Portion.toFraction() + ' = ' + Portion.toString()
    } else if (!Sidereal.includes('/') && !Node.includes('/') && !Lunar.includes('/')) {
        Sidereal = +('365.' + Sidereal)
        Node = +('27.' + Node)
        Lunar = +('29.' + Lunar)
        Regression = (Sidereal / Node - Sidereal / Lunar - 1).toFixed(8)
        Portion = ((1 + Regression) / (Sidereal / Lunar + 1 + Regression)).toFixed(8)
    } else {
        throw (new Error('請同時輸入小數或分數'))
    }
    return `交點退行速度 ${Regression} 度/日\n交率/交數 ${Portion}`
}
// console.log(Regression('1875.2125/7290', '1547.0880/7290', '3868/7290'))
// console.log(Regression('3084.57/12030', '2553.0026/12030', '6383/12030'))

const MingtianNode = () => {
    const v = frc('9901159/6240000').div('1151693/39000') // 9901159/184270880交點退行速度
    const Sidereal = frc('365 1600447/6240000')
    const Solar = frc('365 9500/39000')
    const Lunar = frc('29 20693/39000')
    // Node = Sidereal / (v + 1 + Sidereal / Lunar)
    const Node = Sidereal.div(v.add(1).add(Sidereal.div(Lunar))).toString() //.toFraction(true) 
    // const Node = Solar.div(v.add(1).add(Solar.div(Lunar))).toFraction(true)
    // return MoonAvgVddenom
}
// console.log(MingtianNode())

// const test1 = (year, Solar, Lunar) => {
//     const accum = frc(Solar).mul(year).mod(Lunar)
//     return accum.toFraction(true)
// }
// console.log(test1(91341235, '365 1776/7290', '29 3868/7290')) // 15 5686/177147=15.03209763643

// const test2 = (year, Solar, Lunar) => {
//     const accum = Solar * year % Lunar
//     return accum
// }
// console.log(test2(91341235, 365.24362139917695474, 29.5305898491083676))  // 紀元15.03210011886921
// console.log(1776 / 7290)
// 也就是說，積年九千萬年，能保持小數點後5位精度，只能說剛好勉強夠用