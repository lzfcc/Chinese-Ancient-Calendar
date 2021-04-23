import {
    BindTcorr
} from './astronomy_acrv.mjs'
import {
    big
} from './para_constant.mjs'

export const Equator2EclipticFormula = (LongiRaw, CalName) => { // 公式化的，週天度就用自己的
    let Solar = 0
    if (CalName === 'Chongxuan') {
        Solar = 365.2548
    } else if (CalName === 'Chongtian') { // 崇天用了兩個値，我折衷統一
        Solar = 365.26
    } else if (CalName === 'Mingtian') {
        Solar = 365.24
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    }
    const QuarSolar = Solar / 4
    const HalfSolar = Solar / 2
    let EclipticLongi = 0
    let EquatorLongi = 0
    let Longi = LongiRaw % (Solar / 8)
    if ((LongiRaw > Solar / 8 && LongiRaw <= QuarSolar) || (LongiRaw > 3 * Solar / 8 && LongiRaw <= HalfSolar) || (LongiRaw > 5 * Solar / 8 && LongiRaw <= 3 * QuarSolar) || (LongiRaw > 7 * Solar / 8)) {
        Longi = Solar / 8 - Longi
    }
    let LongiDif = 0
    // 這些函數並不是以91度或者45度對稱，而是將近60度左右
    if (CalName === 'Chongxuan') {
        LongiDif = ((1315 - 14.4 * Longi) * Longi - Longi * (4566 - Longi) / 1696) / 10000
    } else if (CalName === 'Chongtian') {
        LongiDif = Longi * (125 - Longi) / 1200
    } else if (CalName === 'Mingtian') {
        LongiDif = Longi * (111.37 - Longi) / 1000
    } else if (CalName === 'Guantian') {
        LongiDif = Longi * (400 - 3 * Longi) / 4000
    } else if (CalName === 'Jiyuan') { // 紀元一直到南宋、大明、庚午
        LongiDif = Longi * (101 - Longi) / 1000
    }
    // 《古代曆法》頁123    沒明白。曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元。赤道度爲Solar/8，黃道度就是43.1287。兩篇公式不一樣，最後畫圖才想明白。
    let h = 0
    if (CalName === 'Jiyuan') {
        // if (LongiRaw < QuarSolar || (LongiRaw >= HalfSolar && LongiRaw < Solar * 0.75)) {
        h = Math.sqrt(202050.25 + 1000 * Longi) - 449.5
        // }
        //  else {
        //     h = -Math.sqrt(303050.25 - 1000 * Longi1) + 550.5 // 這兩個公式是一樣的，只是對稱而已
        // }
    }
    const EclipticLongiDif = Math.abs(Longi - h)
    if ((LongiRaw >= 0 && LongiRaw < QuarSolar) || (LongiRaw >= HalfSolar && LongiRaw < Solar * 0.75)) {
        EclipticLongi = LongiRaw - LongiDif
        EquatorLongi = LongiRaw + EclipticLongiDif
    } else {
        EclipticLongi = LongiRaw + LongiDif
        EquatorLongi = LongiRaw - EclipticLongiDif
    }
    return {
        EquatorLongi,
        EclipticLongi,
        LongiDif,
        EclipticLongiDif
    }
}
// console.log(Equator2EclipticFormula(91, 'Jiyuan'))

// 弧矢割圓術黃赤轉換。跟《黃赤道率》立成表分毫不差，耶！！！
export const Hushigeyuan = (LongiRaw, Sidereal) => {
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
    const equation = (x) => (x ** 4) / d ** 2 + (1 - 2 * Longi / d) * x ** 2 - d * x + Longi ** 2
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
    const v1 = upper // LD
    const p1 = Math.sqrt(r ** 2 - (r - v1) ** 2) // LB黃半弧弦
    const p2 = p * (r - v1) / r // BN,LM
    const v2 = r - Math.sqrt(r ** 2 - p2 ** 2) // NC赤二弦差、黃赤內外矢。後面一堆是用來擬合立成表的。加上0.14，在50度左右正正好跟立成合上，前後略差
    let Lati = p2 + v2 ** 2 / d // 赤緯、黃赤內外度 BC
    const p3 = p1 * r / Math.sqrt(r ** 2 - p2 ** 2) // PC赤半弧弦
    const v3 = r - Math.sqrt(r ** 2 - p3 ** 2) // PE赤橫弧矢
    const LongiDif = (p3 + (v3 ** 2) / d - Longi) % 91.3125 // 赤經。輸入0的話會冒出一個91.3125 
    let EquatorLongi = 0
    // let EclipticLongi = 0
    if ((LongiRaw >= 0 && LongiRaw < QuarSidereal) || (LongiRaw >= HalfSidereal && LongiRaw < Sidereal * 0.75)) {
        EquatorLongi = LongiRaw + LongiDif
    } else {
        EquatorLongi = LongiRaw - LongiDif
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
        EquatorLongi,
        // EclipticLongi,
        Lati,
        Lati1,
        Sunrise,
        LongiDif
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
    let EquatorLongi = 0
    if (LongiRaw < HalfSidereal) {
        EquatorLongi = QuarSidereal + a0
    } else {
        EquatorLongi = QuarSidereal - a0
    }
    return EquatorLongi
}
// console.log(Hushigeyuan2(0))
// 魏晉的黃道去極，是根據節氣來的，日書就不調用了
// 崇天的漏刻、赤緯跟《中國古代晝夜漏刻長度的計算法》一致。又說：魏晉南北、皇極、戊寅、應天、乾元、儀天自變量用的平氣，麟徳之後用的定氣。
export const Longi2LatiFormula = (DayRaw, CalName) => { // 《中國古代曆法》頁128。漏刻頁135
    let Solar = 0
    if (CalName === 'Chongxuan') {
        Solar = 365.2548
    } else if (CalName === 'Yitian') {
        Solar = 365.24455
    } else if (CalName === 'Chongtian') { // 崇天用了兩個値，我折衷統一
        Solar = 365.26
    } else if (CalName === 'Mingtian') {
        Solar = 365.24
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    }
    const SunTcorr = BindTcorr(0, DayRaw, CalName).SunDifAccum
    let LongiRaw = DayRaw
    if (CalName !== 'Yitian') {
        LongiRaw += SunTcorr
    }
    const QuarSolar = Solar / 4
    const HalfSolar = Solar / 2
    let Longi = LongiRaw % HalfSolar
    let Longi1 = LongiRaw % HalfSolar
    if (Longi > QuarSolar) {
        Longi = HalfSolar - Longi
    }
    let Lati = 0
    let g = 0
    if (CalName === 'Chongxuan') { // x=195.838,y=0. x=138.478,y=35.267極值。x=91.3, y=23.996
        // g = (184 / 50025) * Longi ** 2 - (16 / (50025 * 3335)) * Longi ** 4
        g = big(184).div(50025).mul(big(Longi).pow(2)).sub(big(16).div(big.mul(50025, 3335)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) {
            Lati = 23.9141 - g
        } else {
            Lati = -23.8859 + g
        }

    } else if (CalName === 'Yitian') { // 儀天的自變量是距二至的日數，其他都是實行度。
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) { // 冬至後次象
            if (Longi1 > 93.7412) {
                Longi1 = HalfSolar - Longi1
            }
            // g = (1261875 / 20126347) * Longi1 ** 2 - (6250000 / (20126347 * 522009)) * Longi1 ** 4
            g = big.div(1261875, 20126347).mul(big(Longi1).pow(2)).sub(big(6250000).div(big.mul(20126347, 522009)).mul(big(Longi1).pow(4)))
        } else { // 冬至後初象
            if (Longi1 > 88.8811) {
                Longi1 = HalfSolar - Longi1
            }
            // g = (167750 / 2229099) * Longi1 ** 2 - (125000 / (2229099 * 39107)) * Longi1 ** 4
            g = big.div(167750, 2229099).mul(big(Longi1).pow(2)).sub(big(125000).div(big.mul(2229099, 39107)).mul(big(Longi1).pow(4)))
        }
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) {
            Lati = big(23.9296).sub(g.mul(big.div(50, 1052))).toNumber()
        } else {
            // Lati = -23.9081 + (50 / 1062) * g
            Lati = big(-23.9296).add(g.mul(big.div(50, 1062))).toNumber()
        }
    } else if (CalName === 'Chongtian') { // 崇天明天觀天等價，四次項系數之差小餘10^-10
        // g = (460720 / 130620943) * Longi ** 2 - (80000 / (130620943 * 7873)) * Longi ** 4
        g = big(460720).div(130620943).mul(big(Longi).pow(2)).sub(big(80000).div(big.mul(130620943, 7873)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) {
            Lati = 24.0041 - g
        } else {
            Lati = g - 23.9959
        }
    } else if (CalName === 'Mingtian') {
        // g = (84800 / 24039561) * Longi ** 2 - (20000 / (24039561 * 10689)) * Longi ** 4
        g = big(84800).div(24039561).mul(big(Longi).pow(2)).sub(big(20000).div(big.mul(24039561, 10689)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) {
            Lati = 24.0041 - g
        } else {
            Lati = g - 23.9959
        }
    } else if (CalName === 'Guantian') {
        // g = (1221360 / 346290367) * Longi ** 2 - (784000 / (346290367 * 29109)) * Longi ** 4
        g = big(1221360).div(346290367).mul(big(Longi).pow(2)).sub(big(784000).div(big.mul(346290367, 29109)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) {
            Lati = 24.0041 - g
        } else {
            Lati = g - 23.9959
        }
    } else if (CalName === 'Jiyuan') {
        if (LongiRaw >= QuarSolar && LongiRaw < 3 * QuarSolar) { // 夏至前後
            // Lati = 23.9 - (491.3109 ** 2 * Longi ** 2 - 982.6218 * Longi ** 3 + Longi ** 4) / (160000 * 348.856)
            Lati = big(23.9).sub(big((big(491.3109).pow(2).mul(big(Longi).pow(2))).sub(big(982.6218).mul(big(Longi).pow(3))).add(big(Longi).pow(4))).div(big.mul(160000, 348.856))).toNumber()
        } else { // 冬至前後
            // Lati = (608.3109 ** 2 * Longi ** 2 - 1216.6218 * Longi ** 3 + Longi ** 4) / (517 ** 2 * 348.856) - 23.9
            Lati = big(-23.9).add(big((big(608.3109).pow(2).mul(big(Longi).pow(2))).sub(big(1216.6218).mul(big(Longi).pow(3))).add(big(Longi).pow(4))).div(big.mul(267289, 348.856))).toNumber()
            // const tmp = (QuarSolar - (Longi * (QuarSolar - Longi) / 517 + Longi))
            // Lati = (HalfSolar - tmp) * tmp / 348.856
        }
    }
    const Lati1 = QuarSolar - Lati
    let Night = 0
    if (CalName === 'Yitian') {
        if (LongiRaw < QuarSolar) {
            Night = 22.53 - Lati / 4.76
        } else if (LongiRaw < HalfSolar) {
            Night = 22.49 - Lati / 4.8
        } else if (LongiRaw < 3 * QuarSolar) {
            Night = 22.51 + Lati / 4.8
        } else {
            Night = 22.47 - Lati / 4.76
        }
    } else {
        Night = 22.5 - Lati / 4.8
    }
    const Sunrise = Night + 2.5
    return {
        Lati,
        Lati1,
        Sunrise
    }
}
// console.log(Longi2LatiFormula(31.816049, 'Jiyuan').Lati)

// 崇玄赤轉黃，用的「赤道日度」，赤轉赤緯，「昏後夜半日數」，晷長：「日中入二至加時以來日數」
export const Longi2DialFormula = (DegRaw, CalName) => { // 崇玄的Day沿用大衍：正午與二至時刻的距離加上日躔。陈美東《崇玄儀天崇天三曆晷長計算法及三次差內插法的應用》。1、距二至的整數日，2、算上二至中前後分的修正值。我現在直接用正午到二至的距離。之所以那麼麻煩，應該是因為整數好算一些，實在迷惑。   // ：冬至到夏至，盈縮改正爲負，入盈曆，實行日小於平行日。因此自變量不應該是黃經，而是！！！！達到實行度所需日數！！！！！崇玄、崇天爲日躔表的盈縮分，儀天爲公式先後數，也就是定朔計算中的SunTcorr，只是符號相反。崇玄、崇天的節接銜接不理想。
    DegRaw = Number(DegRaw)
    let Solar = 0
    if (CalName === 'Chongxuan') {
        Solar = 365.2445
    } else if (CalName === 'Yitian') {
        Solar = 365.24455
    } else if (CalName === 'Chongtian') { // 崇天用了24 28兩個値
        Solar = 365.24
    } else if (CalName === 'Mingtian') {
        Solar = 365.24
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    }
    const QuarSolar = Solar / 4
    const HalfSolar = Solar / 2
    let Deg = parseFloat((DegRaw % HalfSolar).toPrecision(14))

    let Dial = 0
    if (CalName === 'Chongxuan') {
        if ((DegRaw >= HalfSolar && Deg > 123.62225) || (DegRaw < HalfSolar && Deg > 59)) {
            Deg = parseFloat((HalfSolar - Deg).toPrecision(14))
        }
        if (DegRaw <= 59 || (DegRaw >= 123.62225 + HalfSolar)) {
            Dial = 12.715 - 1e-6 * (2195 - 15 * Deg) * Deg ** 2
        } else {
            Dial = 1.478 + 1e-7 * (4880 - 4 * Deg) * Deg ** 2
        }
    } else if (CalName === 'Yitian') {
        if ((DegRaw >= HalfSolar && Deg > 123.62225) || (DegRaw < HalfSolar && Deg > 59)) {
            Deg = parseFloat((HalfSolar - Deg).toPrecision(14))
        }
        if (DegRaw <= 59 || (DegRaw >= 123.622275 + HalfSolar)) {
            Dial = 12.715 - 1e-6 * (2130 - 14 * Deg) * Deg ** 2
        } else {
            Dial = 1.478 + 1e-7 * (4812 - 3.5 * Deg) * Deg ** 2
        }
    } else if (CalName === 'Chongtian') {
        if ((DegRaw >= HalfSolar && Deg > 120.62) || (DegRaw < HalfSolar && Deg > 62)) {
            Deg = parseFloat((HalfSolar - Deg).toPrecision(14))
        }
        if (DegRaw <= 62 || (DegRaw >= 120.62 + HalfSolar)) {
            Dial = 12.715 - 1e-6 * (2197.14 - 15.05 * Deg) * Deg ** 2
        } else {
            Dial = 1.478 + 1e-7 * (4881.67 - 4.01 * Deg) * Deg ** 2
        }
    } else if (CalName === 'Mingtian' || CalName === 'Guantian') {
        if ((DegRaw >= HalfSolar && Deg > 137) || (DegRaw < HalfSolar && Deg > 45.62)) {
            Deg = parseFloat((HalfSolar - Deg).toPrecision(14))
        }
        Deg = big(Deg)
        if (DegRaw <= 45.62 || (DegRaw >= 137 + HalfSolar)) {
            // Dial = 12.85 - 1e-6 * (1937.5 * Deg ** 2 - Deg ** 3 - (200 / 827) * Deg ** 4 + (1 / 827) * Deg ** 5)
            Dial = big(12.85).sub(big(1e-6).mul(big(1937.5).mul(Deg.pow(2)).sub(Deg.pow(3)).sub(big(200 / 827).mul(Deg.pow(4))).add(big(1 / 827).mul(Deg.pow(5)))))
        } else if (DegRaw > QuarSolar && DegRaw < 3 * QuarSolar) {
            // Dial = 1.57 + 1e-6 * (545.25 * Deg ** 2 - (3827 / 2481) * Deg ** 2 + (5 / 827) * Deg ** 4)
            Dial = big(1.57).add(big(1e-6).mul(big(545.25).mul(Deg.pow(2)).sub(big(3827 / 2481).mul(Deg.pow(2))).add(big(5 / 827).mul(Deg.pow(4)))))
        } else {
            // Dial = 1.57 + 1e-6 * (510.09274 * Deg ** 2 - 1.213548 * Deg ** 3 + 0.01034059 * Deg ** 4 - 0.0000403063 * Deg ** 5)
            Dial = big(1.57).add(big(1e-6).mul(big(510.09274).mul(Deg.pow(2)).sub(big(1.213548).mul(Deg.pow(3))).add(big(0.01034059).mul(Deg.pow(4))).sub(big(0.0000403063).mul(Deg.pow(5)))))
        }
        Dial = Dial.toNumber()
    } else if (CalName === 'Jiyuan') {
        if ((DegRaw >= HalfSolar && Deg > 120.42) || (DegRaw < HalfSolar && Deg > 62.2)) {
            Deg = parseFloat((HalfSolar - Deg).toPrecision(14))
        }
        Deg = big(Deg)
        if (DegRaw <= 62.2 || (DegRaw >= 120.42 + HalfSolar)) {
            // Dial = 12.83 - 200 * Deg ** 2 / (100617 + 100 * Deg + (400 / 29) * Deg ** 2)
            Dial = big(12.83).sub(big(200).mul(Deg.mul(Deg)).div((big(100617).add(Deg.mul(100)).add(big(400 / 29).mul(Deg.mul(Deg))))))
        } else if (DegRaw > QuarSolar && DegRaw < 3 * QuarSolar) {
            // Dial = 1.56 + 4 * Deg ** 2 / (7923 + 9 * Deg ** 2)
            Dial = big(1.56).add(Deg.mul(Deg).mul(4).div(big(7923).add(Deg.mul(9))))
        } else {
            // Dial = 1.56 + 7700 * Deg ** 2 / (13584271.78 + 44718 * Deg - 100 * Deg ** 2)
            Dial = big(1.56).add(Deg.mul(Deg).mul(7700).div(big(13584271.78).add(Deg.mul(44718).sub(Deg.mul(Deg).mul(100)))))
        }
        Dial = Dial.toNumber()
    }
    const Print = '距冬至 ' + DegRaw + ' 日，晷長 ' + Dial.toFixed(6) + ' 尺'
    return {
        Dial,
        Print
    }
}
// console.log(Longi2DialFormula(95, 'Jiyuan').Print)

export const MoonLongiFormula = (OriginRawRaw, Day, CalName) => { // 該日距冬至黃道度，入交日。不知是否應該加上日躔
    const LongiRaw = 13.36875 * Day
    const Node = 27.2122007822
    let Xiang = 90.94
    if (CalName === 'Mingtian') {
        Xiang = 90.92
    } else if (CalName === 'Jiyuan') {
        Xiang = 90.9486
    } else if (CalName === 'Shoushi') {
        Xiang = 91.314375
    }
    let Longi = LongiRaw % Xiang
    let Solar = 0
    if (['Chongtian', 'Mingtian'].includes(CalName)) {
        Solar = 365.24
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    } else if (CalName === 'Shoushi') {
        Solar = 365.2425
    }
    const QuarSolar = Solar / 4
    const HalfSolar = Solar / 2
    const OriginRaw = OriginRawRaw - Day // % (Node / 2) // 正交距二至的黃道度。我猜的
    let Origin = OriginRaw % HalfSolar
    if (Origin > QuarSolar) { // 這一步沒有說明
        Origin = HalfSolar - Origin
    }
    if (Longi > Xiang / 2) {
        Longi = Xiang - Longi
    }
    let EclipticWhiteDif = 0
    let EquatorWhiteDif = 0
    let WhiteLongi = 0
    let EquatorLongi = 0
    if (CalName === 'Shoushi') {
        let sign = -1
        if (OriginRaw > Xiang * 2) {
            sign = 1
        }
        const V1 = 98 + sign * 24 * Origin / Xiang // 定限度
        const EquatorLongiRaw = Hushigeyuan(LongiRaw, 365.2575).EquatorLongi
        EquatorLongi = EquatorLongiRaw % Xiang // p128書上說直接由黃赤道率査得，問題是月道又不是日道，怎麼能一樣呢
        WhiteLongi = EquatorLongi + (V1 - Origin) * Origin / 1000
    } else {
        if (CalName === 'Chongtian') {
            EclipticWhiteDif = Longi * (125 - Longi) / 2400
            EquatorWhiteDif = Longi * Origin * (125 - Longi) / 216000
        } else if (CalName === 'Mingtian') {
            EclipticWhiteDif = Longi * (111.37 - Longi) / 2000
            EquatorWhiteDif = Longi * Origin * (111.37 - Longi) / 180000
        } else if (CalName === 'Guantian') {
            EclipticWhiteDif = Longi * (400 - 3 * Longi) / 8000
            EquatorWhiteDif = Longi * Origin * (400 - 3 * Longi) / 720000
        } else if (CalName === 'Jiyuan') {
            EclipticWhiteDif = Longi * (101 - Longi) / 2000
            if (LongiRaw <= Node / 2 && OriginRaw <= HalfSolar) {
                const F5 = Math.abs(Origin - QuarSolar)
                EquatorWhiteDif = 9 * F5 * Longi * (101 - Longi) / 16000 * Xiang
            } else if (LongiRaw > Node / 2 && OriginRaw > HalfSolar) {
                const F6 = Math.abs(Origin - 3 * QuarSolar)
                EquatorWhiteDif = 7 * F6 * Longi * (101 - Longi) / 16000 * Xiang
            }
        }
        if ((LongiRaw >= 0 && LongiRaw < Xiang) || (LongiRaw >= Xiang * 2 && LongiRaw < Xiang * 3)) {
            WhiteLongi = parseFloat((LongiRaw - EclipticWhiteDif).toPrecision(14))
            EquatorLongi = parseFloat((LongiRaw - EquatorWhiteDif).toPrecision(14))
        } else {
            WhiteLongi = parseFloat((LongiRaw + EclipticWhiteDif).toPrecision(14))
            EquatorLongi = parseFloat((LongiRaw + EquatorWhiteDif).toPrecision(14))
        }
    }
    return {
        WhiteLongi,
        EquatorLongi
    }
}
// console.log(MoonLongiFormula(183, 15, 'Shoushi'))

export const MoonLatiFormula = (DayRaw, CalName) => { // 《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》
    let Cycle = 363.8
    let MoonAvgVDeg = 13.36875 // 大衍：15*day，0,1,...11 。其他都是13    
    if (CalName === 'Qintian') {
        MoonAvgVDeg = 1
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Cycle = 363.7944
    }
    const Longi1 = DayRaw * MoonAvgVDeg
    let Longi2 = Longi1 % (Cycle / 2)
    let Longi = 0
    let Lati = 0
    if (CalName === 'Chongxuan') { // 我沒反減，就沒事。奇怪。
        Longi = Longi1 % (Cycle / 4)
        if (Longi2 > Cycle / 4) {
            Longi = Cycle / 4 - Longi
        }
        if (Longi2 <= 30 || Longi2 > Cycle / 4 + 61) {
            // if (Longi2 > Cycle / 4 + 61) {
            //     Longi = Cycle / 4 - Longi
            // }
            Lati = (81305 * Longi - 386 * Longi ** 2) / 700000 // n=30,極值=3
        } else {
            // if (Longi2 >= 30 && Longi2 < Cycle / 4) {
            //     Longi = Cycle / 4 - Longi
            // }
            Lati = (1656200 - 314440 * Longi + 1733 * Longi ** 2) / 2100000
        }
    } else if (CalName === 'Qintian') {
        const Day = DayRaw % (Cycle / 2)
        Lati = (245 * Day - 18 * Day * Day) / 139
    } else if (CalName === 'Chongtian') {
        Longi = Longi2
        if (Longi2 > Cycle / 4) {
            Longi = Cycle / 2 - Longi
        }
        // if (Longi > Cycle / 8) {
        // Longi = Cycle / 4 - Longi
        // }
        // if (Longi <= Cycle / 8) {
        Lati = (91451 * Longi - 290 * Longi ** 2) / 840000
        // } 
        // else {
        //     Lati = -(868359 - 129646 * Longi - 710 * Longi ** 2) / 840000 // 這個增長很快，x要在38內，y在6內
        // }
    } else if (CalName === 'Guantian') {
        Longi = Longi2
        if (Longi2 > Cycle / 4) {
            Longi = Cycle / 2 - Longi
        }
        // if (Longi <= Cycle / 8) {
        Lati = (2239 / 17250) * Longi - Longi ** 2 / 1380
        // }
        //  else {
        //     Lati = -0.18188 + (1154 / 8625) * Longi - Longi ** 2 / 1380 // 這兩個幾乎沒什麼區別
        // }
    } else if (CalName === 'Jiyuan') {
        Longi = Longi2
        if (Longi2 > Cycle / 4) {
            Longi = Cycle / 2 - Longi
        }
        Lati = big(372026500).mul(Longi).sub(big(763324).mul(big(Longi).pow(2))).sub(big(8181).mul(big(Longi).pow(3))).sub(big(10).mul(big(Longi).pow(4))).div(3437500000).toNumber()
    }
    Lati = -Math.abs(Lati)
    if (Longi1 > Cycle / 2) { // 調用需要注意：此處統一先陽曆後陰曆
        Lati = -Lati
    }
    const Lati1 = 91.311 - Lati
    return {
        Lati,
        Lati1
    }
}
// console.log(MoonLatiFormula(15, 'Jiyuan'))