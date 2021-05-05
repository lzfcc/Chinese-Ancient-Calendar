import {
    big
} from './para_constant.mjs'
import {
    RoundH2LWest
} from './astronomy_west.mjs'

// 會圓術已知矢長求弧長 
const RoundH2L = h => { // 弓弦長 2* sqrt (r^2-(r-h)^2) //半徑，矢長
    const r = 60.875
    let c = 2 * Math.sqrt(h * (2 * r - h))
    let l = h ** 2 / r + c // h^2 / r + c    
    return {
        c,
        l
    }
}
export const RoundH2LPrint = (h, R, Sidereal) => {
    h = +h
    R = +R
    Sidereal = +Sidereal
    const pi = 3.141592653589793
    const r = 60.875 // 會圓術系數3，不是pi
    const portion1 = Sidereal === 365.25 ? 1 : Sidereal / 365.25
    const portion2 = Sidereal / 360
    const portion3 = pi / 3
    const portion4 = R === 60.875 ? 1 : R / r
    const rReal = portion4 * Sidereal / pi / 2 // 60.875對應的直徑：116.26268592862955
    const hReal = h / portion3 * portion1
    const Func = RoundH2L(h / portion4)
    let c = Func.c
    let l = Func.l
    const WestFunc = RoundH2LWest(rReal, hReal)
    const lWest = WestFunc.l / portion4
    const cWest = WestFunc.c / portion4
    const a = WestFunc.a * portion2
    c *= portion1 //* portion4
    l *= portion1 //* portion4
    let Print = [{
        title: '會圓術',
        data: [c.toFixed(6), (c - cWest).toFixed(4), l.toFixed(6), (l - lWest).toFixed(4)]
    }]
    Print = Print.concat({
        title: '三角函數',
        data: [cWest.toFixed(6), 0, lWest.toFixed(6), 0, a.toFixed(4)]
    })
    return Print
}
console.log(RoundH2LPrint(60.875, 60.875, 365.25))
const RoundL2H = l => { // 會圓術已知弧長反求矢長
    const r = 60.875
    const d = 121.75
    const equation = x => (x ** 4) / d ** 2 + (1 - 2 * l / d) * x ** 2 - d * x + l ** 2
    let mid = 0
    let lower = 0
    let upper = r
    while (upper - lower > 1e-10) {
        mid = (lower + upper) / 2
        if (equation(mid) * equation(lower) < 0) {
            upper = mid
        } else {
            lower = mid
        }
    }
    return upper // 矢長
}

// 弧矢割圓術黃赤轉換。跟《黃赤道率》立成表分毫不差，耶！！！
export const Hushigeyuan = LongiRaw => { // 變量名見《中國古代曆法》頁629
    const Sidereal = 365.25
    const r = 60.875
    const d = 121.75
    const p = 23.807 // DK 實測23.9半弧背、黃赤大勾
    const q = 53.288
    const v = 4.8482
    const QuarSidereal = Sidereal / 4
    const HalfSidereal = Sidereal / 2
    let Longi = LongiRaw % QuarSidereal
    if ((LongiRaw > QuarSidereal && LongiRaw <= HalfSidereal) || (LongiRaw >= Sidereal * 0.75 && LongiRaw < Sidereal)) {
        Longi = QuarSidereal - Longi
    }
    const v1 = RoundL2H(Longi) // LD
    const p1 = Math.sqrt(r ** 2 - (r - v1) ** 2) // LB黃半弧弦
    const p2 = p * (r - v1) / r // BN,LM
    const v2 = r - Math.sqrt(r ** 2 - p2 ** 2) // NC赤二弦差、黃赤內外矢。後面一堆是用來擬合立成表的。加上0.14，在50度左右正正好跟立成合上，前後略差
    let Lati = p2 + v2 ** 2 / d // 赤緯、黃赤內外度 BC
    const p3 = p1 * r / Math.sqrt(r ** 2 - p2 ** 2) // PC赤半弧弦
    const v3 = r - Math.sqrt(r ** 2 - p3 ** 2) // PE赤橫弧矢
    const Ecliptic2EquatorDif = (p3 + (v3 ** 2) / d - Longi) % 91.3125 // 赤經。輸入0的話會冒出一個91.3125 
    let Ecliptic2Equator = 0
    // let Equator2Ecliptic = 0
    if ((LongiRaw >= 0 && LongiRaw < QuarSidereal) || (LongiRaw >= HalfSidereal && LongiRaw < Sidereal * 0.75)) {
        Ecliptic2Equator = LongiRaw + Ecliptic2EquatorDif
    } else {
        Ecliptic2Equator = LongiRaw - Ecliptic2EquatorDif
    }
    let sign = 1
    if (LongiRaw < QuarSidereal || LongiRaw > Sidereal * 0.75) {
        Lati = -Lati
        sign = -1
    }
    const Lati1 = QuarSidereal - Lati
    //////////晷漏//////// 北京緯度40.95
    const v2adj = v2 // - (Math.cos(Longi * 2 * 3.1415926585 / Sidereal) * 0.05 + 0.08 - Longi * 0.0018)
    const SunHundred = 6 * (r - v2adj) + 1 // 日行百刻度
    const Banhubei = p2 * 19.9614 / 23.71
    const Sunrise = 25 - sign * Banhubei * 100 / SunHundred // 半夜漏。似乎授時的夜漏包含了晨昏
    //  const MidStar = (50 - (NightTime - 2.5)) * Sidereal / 100 + 正午赤度
    return {
        Ecliptic2Equator,
        Ecliptic2EquatorDif,
        // Equator2Ecliptic,
        Lati,
        Lati1,
        Sunrise
    }
}
// console.log(Hushigeyuan(1, 365.2575).Sunrise)
export const Hushigeyuan2 = LongiRaw => {
    const Sidereal = 365.2575
    const QuarSidereal = Sidereal / 4
    const HalfSidereal = Sidereal / 2
    const k = 14.66 // 正交極數
    const a = QuarSidereal
    LongiRaw = (LongiRaw + a) % Sidereal
    const v0 = a - Math.abs(LongiRaw - a)
    const a0 = k * v0 / a
    let Ecliptic2Equator = 0
    if (LongiRaw < HalfSidereal) {
        Ecliptic2Equator = QuarSidereal + a0
    } else {
        Ecliptic2Equator = QuarSidereal - a0
    }
    return Ecliptic2Equator
}
// console.log(Hushigeyuan2(0))

// 南宋秦九韶的《数书九章》（Mathematical Treatise in Nine Sections）中的三斜求积术：以小斜幂，并大斜幂，减中斜幂，余半之，自乘于上；以小斜幂乘大斜幂，减上，余四约之，为实；一为从隅，开平方得积。秦九韶他把三角形的三条边分别称为小斜、中斜和大斜。“术”即方法。三斜求积术就是用小斜平方加上大斜平方，减中斜平方，取余数的一半的平方，而得一个数。小斜平方乘以大斜平方，减上面所得到的那个数。相减后余数被4除,开平方后即得面积。化下简就会发现这就是传说中的已知三边求三角形面积的海伦公式。
// 海伦公式 sqrt(p (p-a) (p-b) (p-c)), p=(a+b+c)/2
// 三斜求积术 sqrt( ((c^2 a^2)-((c^2+a^2-b^2 )/2)^2)/4 )
// const date = new Date()
export const Heron = (a, b, c) => {
    const tmp1 = big(c).pow(2).mul(big(a).pow(2)) // 225
    const tmp2 = big(c).pow(2).add(big(a).pow(2)).sub(big(b).pow(2)) // 18
    const tmp3 = big(tmp1).sub(big(big(tmp2).div(2).pow(2)))
    const S = (big(big(tmp3).div(4)).sqrt()).toFixed(15)
    const Print = 'S△ABC = ' + S
    return {
        Print
    }
}
// console.log(Heron(30000000000, 40000000000, 50000000000))