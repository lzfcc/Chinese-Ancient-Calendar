import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac, DeciFrac2IntFrac } from './equa_math.mjs'
import { Gong2Lon, GongFlat2High, GongHigh2Flat, HighLon2FlatLat, Lon2Gong, LonFlat2High, LonHigh2Flat, aCb_Sph } from './newm_shixian.mjs'
import { Date2Jd, Jd2Date } from './time_jd2date.mjs'
const pi = Math.PI //big.acos(-1)
// const d2r = degree => big(degree).mul(pi).div(180)
// const r2d = degree => big(degree).mul(180).div(pi)
const abs = X => Math.abs(X)
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = X => Math.sin(d2r(X))//.toFixed(8) // 數理精蘊附八線表用的是七位小數
const cos = X => Math.cos(d2r(X)) //.toFixed(8)
const tan = X => Math.tan(d2r(X))//.toFixed(8)
const cot = X => (1 / Math.tan(d2r(X)))//.toFixed(8)
const asin = X => r2d(Math.asin(X))//.toFixed(8)
const acos = X => r2d(Math.acos(X))//.toFixed(8)
const atan = X => r2d(Math.atan(X))//.toFixed(8)
const t1 = X => abs(180 - X % 360)
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

export const ConstWest = Jd => { // 儒略世紀：36525日。我下面索性將100年作爲儒略世紀，要不然太麻煩
    Jd = +Jd
    const T = (Jd - 2451545) / 36525 // J2000儒略世紀
    const e = (84381.406 - 46.836769 * T - .0001831 * T ** 2 + .00200340 * T ** 3 - .000000576 * T ** 4 - .0000000434 * T ** 5) / 3600
    //《古曆新探》頁322.近日點平黃經 ω // 也就是說近日點越來越向春分移動 。375年在大雪，1247年近日點在冬至
    const T1 = (Jd - 2415021) / 36525
    const perihelion = 281.22084 + 1.719175 * T1 + (1.63 / 3600) * T1 ** 2 + (.012 / 3600) * T1 ** 3
    const eccentricity = .01670862 - .00004204 * T1 - .000000124 * T1 ** 2 // 黃道離心率
    const Solar = 365.242189623 - .000061522 * T - 6.09e-8 * T ** 2 + 2.6525e-7 * T ** 3 // VSOP87 曆表 Meeus J，Savoie D. The history of the tropical year[J]. Journal of the British Astronomical Association，1992，102( 1) : 42. 
    const Sidereal = 365.25636042 + 1e-7 * T
    const Lunar = 29.530588853 + 2.162e-7 * T
    const Anoma = 27.554549878 - 1.039e-6 * T
    const Node = 27.21222082 + 3.8e-7 * T
    const Print = `朔望月 ${Lunar} 日
近點月 ${Anoma} 日
交點月 ${Node} 日
回歸年 ${Solar} 日
恆星年 ${Sidereal} 日
平黃赤交角 ${e}°
黃道離心率 ${eccentricity}
近日點平黃經 ${perihelion}°`
    return { Print, e, perihelion, eccentricity, Anoma, Solar, Sidereal, Lunar }
}
// console.log(ConstWest(-401).Print)

/**
 * deltaT=TT-UT1 ,  -1999 to +3000 // https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
 * All values of ΔT based on Morrison and Stephenson [2004] assume a value for the Moon's secular acceleration of -26 arcsec/cy^2. However, the ELP-2000/82 lunar ephemeris employed in the Canon uses a slightly different value of -25.858 arcsec/cy^2. Thus, a small correction "c" must be added to the values derived from the polynomial expressions for ΔT before they can be used in the Canon:
    c = -0.000012932 * (y - 1955)^2
 * @param {*} year 
 * @param {*} month 
 * @returns delta(day)
 */
const TT2UT1_Old = (year, month) => {
    month = month || 1
    const y = year + (month - .5) / 12 // This gives "y" for the middle of the month
    let u = 0, t = 0, D = 0
    if (year < -1999) return undefined
    else if (year < -500) {
        u = (y - 1820) / 100
        D = -20 + 32 * u ** 2
    } else if (year < 500) {
        u = y / 100
        D = 10583.6 - 1014.41 * u + 33.78311 * u ** 2 - 5.952053 * u ** 3 - 0.1798452 * u ** 4 + 0.022174192 * u ** 5 + 0.0090316521 * u ** 6
    } else if (year < 1600) {
        u = (y - 1000) / 100
        D = 1574.2 - 556.01 * u + 71.23472 * u ** 2 + 0.319781 * u ** 3 - 0.8503463 * u ** 4 - 0.005050998 * u ** 5 + 0.0083572073 * u ** 6
    } else if (year < 1700) {
        t = y - 1600
        D = 120 - 0.9808 * t - 0.01532 * t ** 2 + t ** 3 / 7129
    } else if (year < 1800) {
        t = y - 1700
        D = 8.83 + 0.1603 * t - 0.0059285 * t ** 2 + 0.00013336 * t ** 3 - t ** 4 / 1174000
    } else if (year < 1860) {
        t = y - 1800
        D = 13.72 - 0.332447 * t + 0.0068612 * t ** 2 + 0.0041116 * t ** 3 - 0.00037436 * t ** 4
            + 0.0000121272 * t ** 5 - 0.0000001699 * t ** 6 + 0.000000000875 * t ** 7
    } else if (year < 1900) {
        t = y - 1860
        D = 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3
            - 0.0004473624 * t ** 4 + t ** 5 / 233174
    } else if (year < 1920) {
        t = y - 1900
        D = -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4
    } else if (year < 1941) {
        t = y - 1920
        D = 21.20 + 0.84493 * t - 0.076100 * t ** 2 + 0.0020936 * t ** 3
    } else if (year < 1961) {
        t = y - 1950
        D = 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547
    } else if (year < 1986) {
        t = y - 1975
        D = 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718
    } else if (year < 2005) {
        t = y - 2000
        D = 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5
    } else if (year < 2050) {
        t = y - 2000
        D = 62.92 + 0.32217 * t + 0.005589 * t ** 2
    } else if (year < 2150) {
        D = -20 + 32 * ((y - 1820) / 100) ** 2 - 0.5628 * (2150 - y)
    } else if (year < 3000) {
        u = (y - 1820) / 100
        D = -20 + 32 * u ** 2
    } else return undefined
    return D / 86400
}

// 廖育棟 [DeltaT](https://github.com/ytliu0/DeltaT) 的 Python 代碼
export const deltaT = Jd => {
    const Year = Jd2Date(Jd).year
    const y = (Jd - Date2Jd(Year)) / 365.2425 + Year
    const c1 = 1.007739546148514 // chosen to make DeltaT continuous at y = -720
    const c2 = -150.3150351029286 // chosen to make DeltaT continuous at y = 2022
    const integrated_lod = (y, C) => {
        const t = 0.01 * (y - 1825)
        return C + 31.4115 * t ** 2 + 284.8435805251424 * Math.cos(0.4487989505128276 * (t + 0.75))
    }
    const spline = y => {
        const YList = [-720, -100, 400, 1000, 1150, 1300, 1500, 1600, 1650, 1720, 1800, 1810, 1820, 1830, 1840, 1850, 1855, 1860, 1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910, 1915, 1920, 1925, 1930, 1935, 1940, 1945, 1950, 1953, 1956, 1959, 1962, 1965, 1968, 1971, 1974, 1977, 1980, 1983, 1986, 1989, 1992, 1995, 1998, 2001, 2004, 2007, 2010, 2013, 2016, 2019, 2022]
        const a0 = [20371.848, 11557.668, 6535.116, 1650.393, 1056.647, 681.149, 292.343, 109.127, 43.952, 12.068, 18.367, 15.678, 16.516, 10.804, 7.634, 9.338, 10.357, 9.04, 8.255, 2.371, -1.126, -3.21, -4.388, -3.884, -5.017, -1.977, 4.923, 11.142, 17.479, 21.617, 23.789, 24.418, 24.164, 24.426, 27.05, 28.932, 30.002, 30.76, 32.652, 33.621, 35.093, 37.956, 40.951, 44.244, 47.291, 50.361, 52.936, 54.984, 56.373, 58.453, 60.678, 62.898, 64.083, 64.553, 65.197, 66.061, 66.919, 68.128, 69.248]
        const a1 = [-9999.586, -5822.27, -5671.519, -753.21, -459.628, -421.345, -192.841, -78.697, -68.089, 2.507, -3.481, 0.021, -2.157, -6.018, -0.416, 1.642, -0.486, -0.591, -3.456, -5.593, -2.314, -1.893, 0.101, -0.531, 0.134, 5.715, 6.828, 6.33, 5.518, 3.02, 1.333, 0.052, -0.419, 1.645, 2.499, 1.127, 0.737, 1.409, 1.577, 0.868, 2.275, 3.035, 3.157, 3.199, 3.069, 2.878, 2.354, 1.577, 1.648, 2.235, 2.324, 1.804, 0.674, 0.466, 0.804, 0.839, 1.005, 1.341, 0.620]
        const a2 = [776.247, 1303.151, -298.291, 184.811, 108.771, 61.953, -6.572, 10.505, 38.333, 41.731, -1.126, 4.629, -6.806, 2.944, 2.658, 0.261, -2.389, 2.284, -5.148, 3.011, 0.269, 0.152, 1.842, -2.474, 3.138, 2.443, -1.329, 0.831, -1.643, -0.856, -0.831, -0.449, -0.022, 2.086, -1.232, 0.22, -0.61, 1.282, -1.115, 0.406, 1.002, -0.242, 0.364, -0.323, 0.193, -0.384, -0.14, -0.637, 0.708, -0.121, 0.21, -0.729, -0.402, 0.194, 0.144, -0.109, 0.275, 0.061, -0.782]
        const a3 = [409.16, -503.433, 1085.087, -25.346, -24.641, -29.414, 16.197, 3.018, -2.127, -37.939, 1.918, -3.812, 3.25, -0.096, -0.539, -0.883, 1.558, -2.477, 2.72, -0.914, -0.039, 0.563, -1.438, 1.871, -0.232, -1.257, 0.72, -0.825, 0.262, 0.008, 0.127, 0.142, 0.702, -1.106, 0.614, -0.277, 0.631, -0.799, 0.507, 0.199, -0.414, 0.202, -0.229, 0.172, -0.192, 0.081, -0.165, 0.448, -0.276, 0.11, -0.313, 0.109, 0.199, -0.017, -0.084, 0.128, -0.071, -0.281, 0.193]
        // 以下由GPT將這句話翻譯成JS  i = np.searchsorted(YList, y, 'right') - 1
        let i = YList.indexOf(YList.reduce((prev, curr) => curr < y ? curr : prev, YList[0]))
        const t = (y - YList[i]) / (YList[i + 1] - YList[i])
        return a0[i] + t * (a1[i] + t * (a2[i] + t * a3[i]))
    }
    let D = 0
    if (y < -720) D = integrated_lod(y, c1);
    else if (y > 2022) D = integrated_lod(y, c2);
    else D = spline(y);
    return D / 86400
}
// console.log(TT2UT1_Old(-499, 1))
// console.log(deltaT(1942)) // 2024: 69s，1924:23.489256，-1160:28240s，1942: 25.346976
// const gmst_IAU1984 = T => {
//     return 6 + 41 / 60 + 50.54841 / 3600 + 8640184.812866 / 3600 * T + 0.093104 / 3600 * T ** 2 - 6.2e-6 / 3600 * T ** 3
// }
// // console.log(gmst(1))

export function deltaTErrorEstimate(y) {
    // Table for estimating the errors in Delta T for years in [-2000, 2500] based on http://astro.ukho.gov.uk/nao/lvm/
    const ytab = [-2000, -1600, -900, -720, -700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500, 700, 800, 900, 1000, 1620, 1660, 1670, 1680, 1730, 1770, 1800, 1802, 1805, 1809, 1831, 1870, 2022.5, 2024.5, 2025, 2030, 2040, 2050, 2100, 2200, 2300, 2400, 2500]
    const eps_tab = [1080, 720, 360, 180, 170, 160, 150, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 25, 20, 15, 20, 15, 10, 5, 2, 1, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.1, 0.2, 1, 2, 4, 6, 10, 20, 30, 50, 100]
    const k1 = 0.74e-4;
    const k2 = 2.2e-4;
    const nytab = ytab.length;
    function searchSorted(arr, value) {
        let low = 0;
        let high = arr.length;

        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            if (arr[mid] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
    // Handle both scalar and array input
    if (!Array.isArray(y)) y = [y];
    return y.map((val) => {
        if (val < ytab[0]) {
            return ~~(k1 * Math.pow(val - 1875, 2)) // Fix: changed from 1825 to 1875
        } else if (val >= ytab[nytab - 1]) {
            return ~~(k2 * Math.pow(val - 1875, 2)) // Fix: changed from 1825 to 1875
        } else {
            const index = searchSorted(ytab, val) - 1;
            return eps_tab[index >= 0 ? index : 0]; // Fix: to avoid undefined if index is -1
        }
    });
}
// console.log(deltaTErrorEstimate(-2020))

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
export const EquaEclpWest = (GongRaw, Jd) => { // 自變量：距冬至度數，此處暫未考慮太陽修正！
    const { Sidereal, e } = ConstWest(Jd)
    const Gong = (GongRaw * 360 / Sidereal) % 360
    const Eclp2Equa = GongHigh2Flat(e, Gong)
    const Equa2Eclp = GongFlat2High(e, Gong)
    const Eclp2EquaDif = Eclp2Equa - Gong
    const Equa2EclpDif = Equa2Eclp - Gong
    return { Eclp2Equa, Equa2Eclp, Equa2EclpDif, Eclp2EquaDif }
}
export const HighLon2FlatLatWest = (GongRaw, Jd) => { // 根據當年的黃赤交角
    const { Sidereal, e } = ConstWest(Jd)
    const Lon = (GongRaw * 360 / Sidereal + 270) % 360
    return HighLon2FlatLat(e, Lon)
}

/**
 * 如果不用big，精度只有5位數
 * @param {*} Sobliq 黃赤大距
 * @param {*} Lon 黃經
 * @param {*} Lat 黃緯
 * @returns 
 */
export const starEclp2Equa = (Sobliq, Lon, Lat) => { // 黃赤大距、黃經、黃緯
    const Gong = Lon2Gong(Lon)
    const EquaLat = 90 - aCb_Sph(Sobliq, 90 - Lat, t1(Gong)) // 赤緯
    let A = +(acos(
        (cos(90 - Lat) - cos(Sobliq) * cos(90 - EquaLat)) /
        (sin(Sobliq) * sin(90 - EquaLat)))).toFixed(5)  // cosA=(cosa-cosb·cosc)/(sinb·sinc)
    A = A || 180
    return {
        EquaLon: +(Gong2Lon(Gong < 180 ? A : 360 - A)).toFixed(5),
        EquaLat: +EquaLat.toFixed(10)
    }
}
export const starEclp2Ceclp = (Sobliq, Lon, Lat) => +(LonFlat2High(Sobliq, starEclp2Equa(Sobliq, Lon, Lat).EquaLon)).toFixed(5)  // 黃道經緯轉古代極黃經
export const testEclpEclpDif = (Sobliq, Lat) => { // 看極黃經和黃經差多少
    const Dif = []
    for (let i = 0; i < 180; i++) {
        Dif[i] = (starEclp2Ceclp(Sobliq, i, Lat) - i) % 360
        if (Dif[i] > 180) Dif[i] -= 360
        Dif[i] = +Dif[i].toFixed(5)
    }
    const Max = Math.max(...Dif)
    const A = Dif.indexOf(Max)
    const B = Dif.indexOf(-Max)
    const Print = `極黃經與黃經之差，約在${A}和${B}°出現極值${Max}°`
    return Print
}
// console.log(testEclpEclpDif(23.5, 20))
// console.log(starEclp2Ceclp(23.5, 5, 10))
// console.log(starEclp2Equa(23.5, 1, 10))
// console.log(starEclp2Equa(23 + 29.5 / 60, 27 + 10 / 60, 29 + 22 / 60)) // 考成卷十六恆星曆理算例:赤經緯23度41分58秒=23.6994444444，8度5分4秒=8.08444444444

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
const refraction_ARCHIVE = h => (1819.08371242143 + 194.887513592849 * h + 1.46555397475109 * h ** 2 - .0419553783815395 * h ** 3) /
    (1 + .409283439734292 * h + .0667313795916436 * h ** 2 + .0000846859707945254 * h ** 3) / 3600
/**
 * Sæmundsson’s formula: https://en.wikipedia.org/wiki/Atmospheric_refraction#cite_note-Saemundsson1986-24
 * @param {*} a 高度
 * @param {*} P 大氣壓kPa
 * @param {*} T 溫度K
 * @returns 
 */
const refraction = (a, P, T) => 1.02 / 60 * (P / 101) * (283 / T) * cot(a + 10.3 / (a + 5.11))

/**
 * 
 * @param {*} Sobliq 黃赤交角
 * @param {*} f 地理緯度
 * @param {*} l 黃經
 * @returns dial length= h tan(zenith height)
 */
export const Lon2DialWest = (Sobliq, f, l) => {
    const d = HighLon2FlatLat(Sobliq, l) // 赤緯
    const h = 90 - Math.abs(f - d) // 正午太陽高度
    const z0 = f - d // 眞天頂距=緯度-赤緯
    const r = .52 // 日視直徑0.53度。角半径=atan(1/2 d/D)
    const Refrac = refraction(h, 102, 290) // 蒙气差使太陽升高
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
const MoonLonWest_BACKUP = (EclpRaw, Jd) => { // 統一360度
    const Eclp = EclpRaw //(EclpRaw + 90) % 360
    const v0 = d2r(Eclp) // 距冬至轉換成距離春分的黃經
    const I = d2r(5.1453) // 授時黃白大距6
    const E = d2r(ConstWest(Jd).e) // 授時黃赤大距23.9
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
const MoonLonWest = (NodeEclpLon, MoonEclpLon, Jd) => {
    const E = d2r(ConstWest(Jd).e)
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
export const EcliWest = (NodeAccum, AnomaAccum, Deci, Sd, f, Jd) => { // 一日中的時刻，距冬至日及分，入轉日，地理緯度，公元年
    const ConstWestFunc = ConstWest(Jd)
    const Solar = ConstWestFunc.Solar
    f = d2r(f)
    const SunWestFunc = SunAcrVWest(Sd, Jd)
    let Lon = (SunWestFunc.Lon) % Solar // 黃經
    let SunV = SunWestFunc.SunAcrV
    let MoonV = MoonAcrVWest(AnomaAccum, Jd).MoonAcrVd
    SunV *= 360 / Solar
    MoonV *= 360 / Solar
    const d = HighLon2FlatLatWest(Lon, Solar, Jd).d // 赤緯radius
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
// console.log(~~-1.8) // -1
// console.log(Math.floor(-1.8)) // -2