import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac, DeciFrac2Frac } from './equa_math.mjs'
const pi = big.acos(-1)
const d2r = degree => big(degree).mul(pi).div(180)
const r2d = degree => big(degree).mul(180).div(pi)

// const tanliufenyi = (Deg, h) => {
//     Deg = d2r(Deg)
//     const x = big(h).div(Deg.tan())
//     return x.toFixed(6)
// }
// console.log(tanliufenyi(14.1,1.1))

// const SunAcrVWest = (WinsolsDifRaw, Solar) => { // 極值出現在冬至後0.47345個節氣，說明現在冬至並非近地點 0.47344981964   24.6116951198865  週期 24.1382453      f(x) =  0.9864 + 0.03331  *cos(x*0.2603) +  0.004126*sin(x*0.2603) 
//     WinsolsDifRaw = big(WinsolsDifRaw).mul(24.1382453).div(Solar).add(0.47344981964)
//     const SunAcrV = big(0.9864).add(big(0.03331).mul(big.mul(WinsolsDifRaw, 0.2603).cos())).add(big(0.004126).mul(big.mul(WinsolsDifRaw, 0.2603)).sin())
//     return SunAcrV.toString()
// }
// console.log(SunAcrVWest(91, 365.2425))

// const SunAcrVWest = (WinsolsDifRaw, Solar) => { // 我用定氣數據擬合的函數。 週期23.674398328214，極值2.023，-1.774 ，但是實際上應該是2.32，奇怪 0.1242-0.1018 *cos(x*0.2654) + 1.896*sin(x*0.2654)
//     WinsolsDifRaw = d2r(big(WinsolsDifRaw).mul(24).div(Solar))
//     return SunDifAccum.toString()
// }

export const ConstWest = year => { // 儒略世紀：36525日。我下面索性將100年作爲儒略世紀，要不然太麻煩
    year = +year
    // 黃赤交角 ε = 84381.448 − 46.84024T − (59 × 10^−5)T^2 + (1813 × 10^−6)T^3 // https://zh.wikipedia.org/zh-hans/%E8%BD%89%E8%BB%B8%E5%82%BE%E8%A7%92
    const t = big.sub(year, 2000).div(100)
    const obliquity = +(big(84381.448).sub(t.mul(46.84024)).sub(t.pow(2).mul(big(10).pow(-5).mul(59))).add(t.pow(3).mul(big(10).pow(-6).mul(1813))).div(3600).toFixed(10))
    //《古曆新探》頁322.近日點平黃經 ω=281+13/60+15/3600+1.719175*T+ (1.63/3600)*T^2+(0.012/3600)*T^3 // T自1900起算的儒略世紀數。也就是說近日點越來越向春分移動 。375年在大雪，1247年近日點在冬至
    const T = big(year - 1900).div(100)
    const perihelion = +(big(281).add(13 / 60).add(15 / 3600).add(T.mul(1.719175)).add(big.div(1.63, 3600).mul(T).pow(2)).add(big.div(0.012, 3600).mul(T).pow(3)).toFixed(8))
    // 黃道離心率 e=0.01670862 -0.00004204T-0.000000124T**2
    const eccentricity = +(big(0.01675104).sub(big(0.0000418).mul(T)).sub(big(0.00000000126).mul(T).pow(2)).toFixed(8))
    const y = year - 2000
    const Solar = big(365.24218968).sub(big(0.0000000616).mul(y)).toNumber()
    const Sidereal = big(365.25636042).add(big(0.000000001).mul(y)).toNumber()
    const Lunar = big(29.530588853).add(big(0.000000002162).mul(y)).toNumber()
    const Anoma = big(27.554549878).sub(big(0.00000001039).mul(y)).toNumber() // 近點月
    const Node = big(27.21222082).add(big(0.0000000038).mul(y)).toNumber()
    const Print = '朔望月 ' + Lunar + ` 日\n近點月 ` + Anoma + ` 日\n交點月 ` + Node + ` 日\n回歸年 ` + Solar + ` 日\n恆星年 ` + Sidereal + ` 日\n黃赤交角 ` + obliquity + `°\n黃道離心率 ` + eccentricity + `\n近日點平黃經 ` + perihelion + '°'
    return { Print, obliquity, perihelion, eccentricity, Anoma, Solar, Sidereal, Lunar }
}
// console.log(ConstWest(501).perihelion)

export const BindSolarChange = year => {
    year = +year
    const year1 = year - 1194 // 現代値歸算爲統天曆元
    const year2 = year - 1281
    const sign1 = year1 > 0 ? -1 : 1
    const sign2 = year2 > 0 ? -1 : 1
    const SolarWest = big(365.2422393296).sub(big(6.16 * 1e-8).mul(year1)).toNumber()
    const SolarChangeWest = parseFloat((sign1 * big(3.08 * 1e-8).mul(year1 ** 2).toNumber()).toPrecision(12))
    const SolarTongtian = parseFloat((365.2425 - 0.021167 / 12000 * year1).toPrecision(10))
    const SolarChangeTongtian = parseFloat((sign1 * 0.0127 / 12000 * year1 ** 2).toPrecision(10))
    const SolarShoushi = parseFloat((365.2425 - 2 * 1e-6 * year2).toPrecision(10))
    const SolarChangeShoushiRaw = parseFloat((-~~(year2 / 100) / 10000).toPrecision(10))
    const SolarChangeShoushi = parseFloat((sign2 * -SolarChangeShoushiRaw * year2).toPrecision(10))
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
    return Print
}

export const MoonAcrVWest = (AnomaAccum, year) => { // 我2020年4個月的數據擬合 -0.9942  + 0.723*cos(x* 0.2243) +  6.964 *sin(x* 0.2243)，但是幅度跟古曆比起來太大了，就調小了一點 極大4.4156，極小-5.6616
    const ConstFunc = ConstWest(year)
    const Anoma = ConstFunc.Anoma
    const Sidereal = ConstFunc.Sidereal
    const Lunar = ConstFunc.Lunar
    const MoonAvgVDeg = big(Sidereal).div(Lunar).add(1)
    let AnomaAccum1 = d2r(AnomaAccum * 360 / Anoma) // 順序不能換
    AnomaAccum = d2r(AnomaAccum * 360 / Anoma)
    AnomaAccum = AnomaAccum.mul(28.01241785825).div(Anoma) // 這個擬合函數的週期是28多，要化到一個近點月
    AnomaAccum1 = AnomaAccum1.mul(28.01241785825).div(Anoma)
    const MoonDifAccum = big(-0.623).add(big(0.623).mul(big.cos(AnomaAccum))).add(big(5).mul(big.sin(AnomaAccum)))
    const MoonDifAccum1 = big(-0.623).add(big(0.623).mul(big.cos(AnomaAccum1))).add(big(5).mul(big.sin(AnomaAccum1)))
    const MoonAcrV = MoonDifAccum.sub(MoonDifAccum1).add(MoonAvgVDeg)
    return {
        MoonDifAccum: MoonDifAccum.toNumber(),
        MoonAcrV: MoonAcrV.toNumber()
    }
}
// console.log(MoonAcrVWest(7, 900))

// 《數》頁135
// E偏近點角，e偏心率 盈縮積=
// 2arctan(sqrt((1 + e) / (1 - e))tan(E / 2)) - E + esinE
const SunWest_BACKUP = (WinsolsDifRaw, year) => {
    const ConstFunc = ConstWest(year)
    const e = ConstFunc.eccentricity
    const perihelion = ConstFunc.perihelion
    const Solar = ConstFunc.Solar
    const Portion = 360 / Solar
    WinsolsDifRaw *= Portion
    const E = 3.1415926 * (((WinsolsDifRaw + 270 - perihelion) + 360) % 360) / 360 // 以冬至起算
    return big(2).mul(big.atan(big.sqrt((1 + e) / (1 - e)).mul(big.tan(E / 2)))).sub(E).add(big(e).mul(big.sin(E))).toNumber()
}
// console.log(SunAcrVWest(35, 1247))
export const SunAcrVWest = (WinsolsDifRaw, year) => { // 武家璧《大衍曆日躔表的數學結構及其內插法》日躔差=真近點角V-平近點交角M。V=M+2*e*sinM+1.25*e**2*sin2M   M=90°極值2e。  
    const ConstFunc = ConstWest(year)
    const e = ConstFunc.eccentricity // 黃道離心率
    const perihelion = ConstFunc.perihelion // 近日點
    const Solar = ConstFunc.Solar
    const Portion = 360 / Solar
    WinsolsDifRaw = ((WinsolsDifRaw - (perihelion - 270) / Portion) + 360) % 360
    const M = d2r(WinsolsDifRaw * Portion) // 距離冬至日數轉換成平黃經
    const M1 = d2r((WinsolsDifRaw - 1) * Portion)
    let SunDifAccum = big(e).mul(2).mul(M.sin()).add(big(1.25).mul(big(e).pow(2)).mul(big.sin(M.mul(2)))) // 中心差=真-平近點角
    SunDifAccum = SunDifAccum.mul(3437.747 / 60).div(Portion) // 化爲角分乘3437.747，不知道怎么来的
    let SunDifAccum1 = big(e).mul(2).mul(M1.sin()).add(big(1.25).mul(big(e).pow(2)).mul(big.sin(M1.mul(2))))
    SunDifAccum1 = SunDifAccum1.mul(3437.747 / 60).div(Portion)
    const SunAcrV = SunDifAccum.sub(SunDifAccum1).add(1)
    const Longi = SunDifAccum.add(WinsolsDifRaw).toNumber() // 黃經。這是日數度，不是360度
    SunDifAccum = SunDifAccum.toNumber()
    return {
        SunDifAccum, Longi,
        SunAcrV: SunAcrV.toNumber()
    }
}
// console.log(SunAcrVWest(91, 4500))

export const Equa2EclpWest = (LongiRaw, Sidereal, year, E) => { // 《中國古代曆法》頁630。這個公式跟https://zh.wikipedia.org/zh-hk/%E5%A4%AA%E9%99%BD%E4%BD%8D%E7%BD%AE 的完全一樣，所以機黃經和黃經到底是什麼關係
    let Longi = LongiRaw % (Sidereal / 4)
    if ((LongiRaw > Sidereal / 4 && LongiRaw <= Sidereal / 2) || (LongiRaw >= Sidereal * 0.75 && LongiRaw < Sidereal)) {
        Longi = Sidereal / 4 - Longi
    }
    const Angle = big(Longi).mul(pi).div(big.div(Sidereal, 2)) // 古度轉radius
    E = E || ConstWest(year).obliquity
    E = d2r(E)
    const Eclp = Angle.tan().mul(E.cos()).atan().mul(Sidereal / 2).div(pi)
    const Equa = Angle.tan().div(E.cos()).atan().mul(Sidereal / 2).div(pi)
    let Equa2EclpDif = big.sub(Longi, Eclp).abs().toNumber()
    let Eclp2EquaDif = big.sub(Longi, Equa).abs().toNumber()
    const condition = (LongiRaw >= 0 && LongiRaw < Sidereal / 4) || (LongiRaw >= Sidereal / 2 && LongiRaw < Sidereal * 0.75)
    Equa2EclpDif *= condition ? -1 : 1
    Eclp2EquaDif *= condition ? 1 : -1
    const Equa2Eclp = LongiRaw + Equa2EclpDif
    const Eclp2Equa = LongiRaw + Eclp2EquaDif
    return { Eclp2Equa, Equa2Eclp, Equa2EclpDif, Eclp2EquaDif }
}

// sinδ=sinλsinε :λ黃，ε：黃赤交角。黃度轉赤緯 
// 一天之内太阳高度角的变化速率如何计算？ - Pjer https://www.zhihu.com/question/25909220/answer/1026387602 一年中太阳直射点在地球上的移动速度是多少？ - 黄诚赟的回答 https://www.zhihu.com/question/335690936/answer/754032487「太阳直射点的纬度变化不是匀速的，春分秋分最大，夏至冬至最小。」
// https://zh.wikipedia.org/zh-hk/%E5%A4%AA%E9%99%BD%E4%BD%8D%E7%BD%AE
export const Longi2LatiWest = (lRaw, Sidereal, year, E) => { // 《中國古代曆法》頁630    
    const Portion = Sidereal / 360
    lRaw /= Portion
    lRaw += 270
    const Angle = d2r(lRaw) // 角度轉換爲定義域
    E = E || ConstWest(year).obliquity // 化爲定義域
    E = d2r(E)
    const d = r2d(Angle.sin().mul(E.sin()).asin()).toNumber() //.toPrecision(60) //.toSD(60)
    const Lati = d * Portion
    const Lati1 = Sidereal / 4 - Lati // 去極度
    return { d, Lati, Lati1 }
}

// https://zh.wikipedia.org/zh-hk/%E6%97%A5%E5%87%BA%E6%96%B9%E7%A8%8B%E5%BC%8F
// cosw=-tanftand 。f緯度，d赤緯 w時角
// sina-sinfsind/cosfcosd 是考慮了視直徑、蒙氣差之後的
// 算出來的是地方時，要自己換算成當地時區
// 跟壽星天文曆比，0.85修正之後的，夏至日出早了2分鐘，冬至晚了2分鐘。如果用0.51:日出定義是上邊緣出現的那一刻，而非中心點在地平線上。夏至合，而冬至晚了2分鐘
export const Longi2SunriseWest = (lRaw, f, Sidereal, year) => {
    f = big(f).mul(pi).div(big.div(Sidereal, 2))
    const d = d2r(Longi2LatiWest(lRaw, Sidereal, year).d)
    // let v1 = big.tan(f).mul(big.tan(d))
    let v1 = big(0).sub(f.sin().mul(big.sin(d))).div(f.cos().mul(big.cos(d)))
    let v = big.sin(d2r(-0.51)).sub(big.sin(f).mul(big.sin(d))).div(big.cos(f).mul(big.cos(d)))
    v1 = big(50).sub(v1.acos().mul(big.div(50, pi))).toNumber() // 換算成百刻
    v = big(50).sub(v.acos().mul(big.div(50, pi))).toNumber()
    return { v1, v }
}
// console.log(Longi2SunriseWest(180, 39, 360, 2021))
// console.log(Longi2LatiWest(182.625, 365.25, 2000).Lati)

// 根據最新研究：蒙氣差ξ =(1819.08371242143 + 194.887513592849h +1.46555397475109h^2 -0.0419553783815395h^3) / (1+0.409283439734292h+0.0667313795916436h^2 +0.0000846859707945254h^3), h太陽高度角。张富、张丽娟、邱本志《一种计算太阳低仰角蒙气差的有理函数逼近方法》，《太陽能學報》2015(9)
// 還可參考 李文、赵永超《地球椭球模型中太阳位置计算的改进》
// h=90°-|緯度φ-赤緯δ|
const Refraction = h => {
    const Numer = big(1819.08371242143).add(big(194.887513592849).mul(h)).add(big(1.46555397475109).mul(h).mul(h)).sub(big(0.0419553783815395).mul(h).mul(h).mul(h))
    const Denom = big(1).add(big(0.409283439734292).mul(h)).add(big(0.0667313795916436).mul(h).mul(h)).add(big(0.00008468597).mul(h).mul(h).mul(h))
    const DifS = Numer.div(Denom) // 單位：秒
    const DifD = DifS.div(3600).toNumber()
    return DifD
}

// 求眞太陽高度角、天頂距
const zAcrConvert = (Deci, Lati, f) => { // 日分，赤緯radius，緯度radius
    const v = d2r(big(big(Deci).sub(0.5)).mul(360)) // 時角radius
    let a = f.sin().mul(Lati.sin()).add(f.cos().mul(Lati.cos()).mul(v.cos())).asin() // 太陽高度角radius
    const zAcr = big(pi.div(2)).sub(a) // 眞天頂距radius
    return { v, a, zAcr }
}
export const Deciaml2Angle = (f, h1, m1, s1, WinsolsDifInt, h, m, s, year, height) => { // 丁豔、袁隆基、趙培濤、仝軍令《太陽視日軌跡跟蹤算法研究》
    f = d2r(f) // 地理緯度
    WinsolsDifInt = parseInt(WinsolsDifInt) // 距年前冬至整數日數，冬至當日爲0
    year = Number(year) // 那一年
    const Solar = ConstWest(year).Solar
    const Deci1 = big(h1).div(24).add(big(m1).div(1440)).add(big(s1).div(86400)).toNumber() // 冬至
    const Deci = big(h).div(24).add(big(m).div(1440)).add(big(s).div(86400)).toNumber() // 所求
    WinsolsDifInt += Deci - Deci1
    const Longi = big(WinsolsDifInt).add(SunAcrVWest(WinsolsDifInt, year).SunDifAccum).mul(360).div(Solar) // 黃經
    const Lati = d2r(big(Longi2LatiWest(Longi, Solar, year).Lati).mul(360).div(Solar))
    // 假設正午時角是0，向西爲正，向東爲負
    const zAcrFunc = zAcrConvert(Deci, Lati, f)
    const v = zAcrFunc.v // 時角
    let a = zAcrFunc.a // 太陽高度角
    let b = r2d(Lati.cos().mul(v.sin()).div(a.cos()).asin()) // 太陽方位角
    let zAcr = zAcrFunc.zAcr // 眞天頂距
    a = r2d(a)
    // 以下複製Longi2DialWest
    const r = 0.52
    const Refrac = Refraction(a)
    const Parallax = big.div(8.8, 3600).mul(zAcr.sin())
    zAcr = r2d(zAcr)
    const zRel = big(zAcr).sub(Refrac).sub(r).add(Parallax)
    const Angle = d2r(big(zRel))
    const Dial = Angle.tan().mul(height)
    b = b.toNumber()
    return '太陽高度角 ' + a.toFixed(6) + `°\n太陽方位角 ` + b.toFixed(6) + `°\n晷長 ` + Dial.toFixed(6)
}

// dial length = h tan(zenith height)
export const Longi2DialWest = (l, f, Sidereal, year) => { // 黃經，周天，緯度，表高，公元年
    const d = Longi2LatiWest(l, Sidereal, year).Lati // 赤緯
    const h = Sidereal / 4 - Math.abs(f - d) // 正午太陽高度
    const zAcr = f - d // 眞天頂距=緯度-赤緯
    const r = 0.52 // 日視直徑0.53度。角半径=atan(1/2 d/D)
    const Refrac = Refraction(h)
    const Parallax = big.div(8.8, 3600).mul(d2r(zAcr).sin())
    const zRel = big(zAcr).sub(Refrac).sub(r).add(Parallax) // p0太陽地平視差8.8s。視差總是使視位置降低，地平線最大，天頂爲0
    const Angle = big(zRel).mul(pi).div(big.div(Sidereal, 2))
    const Angle1 = big(zAcr).mul(pi).div(big.div(Sidereal, 2))
    let Dial = big.mul(8, Angle.tan()).mul(Sidereal / 360)
    const Dial1 = big.mul(8, Angle1.tan()).mul(Sidereal / 360)
    const Print = 'dial length = h tan(' + zRel.toFixed(8) + '°) = ' + 8 + 'tan(' + Angle.toFixed(8) + ') = ' + Dial.toFixed(8) + ' 尺'
    return {
        Print,
        Dial: Dial.toNumber(), // 修正
        Dial1: Dial1.toNumber(), // 未修正
    }
}
// console.log(Longi2DialWest(182.62225, 34.4047, 365.2445, 1000))

// ε黃赤交角 Φ 黃白交角
const MoonLongiWest_BACKUP = (EclpRaw, year) => { // 統一360度
    const Eclp = EclpRaw //(EclpRaw + 90) % 360
    const v0 = d2r(Eclp) // 距冬至轉換成距離春分的黃經
    const I = d2r(5.1453) // 授時黃白大距6
    const E = d2r(ConstWest(year).obliquity) // 授時黃赤大距23.9
    const cosE = big.cos(E) // 0.9
    const tank = big.tan(I).div(big.sin(E)) // tank 0.22
    // const k = tank.atan() // k正交極數 12.7
    const tana0 = tank.mul(v0.sin()).div(tank.mul(cosE.mul(v0.cos())).add(1))
    const a0Raw = tana0.atan() // a0距差
    const a0 = r2d(a0Raw).abs().toNumber() // a0距差=赤經    
    let EquaLongi = 0
    if ((Eclp >= 90 && Eclp < 180) || (Eclp >= 270)) {
        EquaLongi = 90 + a0
    } else {
        EquaLongi = 90 - a0
    }
    // a0 =k*Eclp/(Sidereal/4) //k=14.66 授時
    // 月離赤道正交：白赤道降交點
    const sinu = I.sin().mul(v0.sin()).div(a0Raw.sin()) // 白赤大距
    const u = r2d(sinu.asin())
    const l = r2d(a0Raw.sin().div(a0Raw.sin().pow(2).sub(I.sin().pow(2).mul(v0.sin().pow(2))).sqrt()).atan()) // WhiteLongi
    return {
        EquaLongi, a0,
        u: u.toNumber(),
        l: l.toNumber(),
    }
}
// console.log(MoonLongiWest(165, 365.2575, 1281).u)

// 《數》頁348白赤差
const MoonLongiWest = (NodeEclpLongi, MoonEclpLongi, year) => {
    const E = d2r(ConstWest(year).obliquity)
    const I = d2r(5.1453)
    const v = d2r(NodeEclpLongi) // 升交點黃經
    const b = d2r(MoonEclpLongi - NodeEclpLongi) // 月亮到升交點的黃道度
    const tmp = b.cos().mul(I.cos()).sub(I.sin().mul(big.cos(v.add(b))).mul(E.tan()))
    const g = r2d(b.sin().div(tmp).atan()) // 月亮距離升交點的白道度
    const EclpWhiteDif = g.sub(r2d(b)).toNumber()
    const WhiteLongi = MoonEclpLongi + EclpWhiteDif
    return { EclpWhiteDif, WhiteLongi }
}
// console.log (MoonLongiWest(0, 170, 1222))

// 下陳美東公式
const MoonLatiWest = (NodeAccum, NodeAvgV, Sidereal, year) => {
    const T = d2r(45)
    const cosT = T.cos()
    const sinT = T.sin()
    const Node = big(27.212220817).add(big(0.000000003833).mul(year - 2000))
    NodeAvgV = NodeAvgV || big(Sidereal).div(Node)
    const E = d2r(ConstWest(year).obliquity)
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

    const MoonLati = GK.abs().add(IM.abs()).div(2).toNumber()
    return MoonLati
}
// console.log(MoonLatiWest(6, 0, 360, 1000))

// 下面這個加上了日躔。藤豔輝《宋代朔閏與交食研究》頁90,106
export const EcliWest = (NodeAccum, AnomaAccum, Deci, WinsolsDif, f, year) => { // 一日中的時刻，距冬至日及分，入轉日，地理緯度，公元年
    const ConstWestFunc = ConstWest(year)
    const Solar = ConstWestFunc.Solar
    f = d2r(f)
    const SunWestFunc = SunAcrVWest(WinsolsDif, year)
    let Longi = (SunWestFunc.Longi) % Solar // 黃經
    let SunV = SunWestFunc.SunAcrV
    let MoonV = MoonAcrVWest(AnomaAccum, year).MoonAcrV
    SunV *= 360 / Solar
    MoonV *= 360 / Solar
    const d = Longi2LatiWest(Longi, Solar, year).d // 赤緯radius
    const zAcrFunc = zAcrConvert(Deci, big(d), f)
    // const zAcr = r2d(zAcrFunc.zAcr)
    // if (zAcr.gt(90)) { // 太陽落山
    //     return 0
    // }
    const h = zAcrFunc.v // 時角radius
    const e = d2r(ConstWestFunc.obliquity) // 黃赤交角degree
    const H0 = big(0.9507) // 假設是月亮地平視差57' // 月亮地平視差曲安京《數》頁413
    Longi = d2r(big(Longi).mul(360).div(Solar)).add(pi.mul(1.5)).mod(pi.mul(2)) //.toNumber()
    // const tanC = Longi.cos().mul(e.tan()).pow(-1) //.toNumber() // C星位角與赤經圈夾角
    // const sinC1 = h.sin().mul(f.cos()).mul(zAcr.div(90).asin()) //.toNumber() // C1星位角與黃道夾角
    // const F = tanC.atan().sub(sinC1.asin())
    // const Tcorr = H0.mul(d2r(zAcr).sin().mul(F.cos())).div(MoonV - SunV).toNumber()
    const k0 = H0.mul(f.cos()).div(MoonV - SunV) //.toNumber()
    const tmp = e.sub(e.mul(Longi.mod(pi.div(2))).div(pi.div(2)))
    const Tcorr0 = k0.mul(h.sin()) // 冬夏至點的特殊情況
    const Tcorr = Tcorr0.mul(tmp.cos()).add(k0.mul(Longi.add(pi.mul(0.5)).cos())) // +k0cosl很奇怪，我自己加270度才湊出來的，實在不行就用Tcorr0
    const I = d2r(5.1453) // 黃白大距
    const k1 = H0.div(I.sin()).mul(f.sin()).mul(e.cos()) // 一個常數
    const k2 = H0.mul(f.cos()).mul(e.sin()).div(I.sin()) //.toNumber()
    const tmp1 = h.sin().mul(Longi.cos()).neg().sub(h.cos().mul(Longi.sin())) // 我這符號取了個負，要不然對不上
    const Mcorr = k1.add(k2.mul(tmp1))
    return {
        Tcorr: Tcorr.toNumber(),
        Tcorr0: Tcorr0.toNumber(),
        Mcorr: Mcorr.toNumber()
    }
}
// console.log(EcliWest(0.5, 360, 8, 35, 1000))

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
        Cycle = big(0.5).mul(Node.div(Lunar)).mul(Lunar.div(Lunar.sub(Node))).toFixed(32)
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
        Node = Lunar.mul(Cycle.div(big.add(0.5, Cycle))).toFixed(32)
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
        Sidereal = frc('365 ' + DeciFrac2Frac(Sidereal))
        Node = frc('27 ' + DeciFrac2Frac(Node))
        Lunar = frc('29 ' + DeciFrac2Frac(Lunar))
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
    // return MoonAvgV
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