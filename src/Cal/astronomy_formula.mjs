import { AutoMoonAvgV } from './astronomy_acrv.mjs'
import {
    big
} from './para_constant.mjs'
import {
    Bind,
} from './bind.mjs'
import {
    Hushigeyuan
} from './equa_geometry.mjs'

export const Equator2EclipticFormula = (LongiRaw, CalName) => { // 公式化的，週天度就用自己的
    let Solar = 0
    if (CalName === 'Chongxuan') {
        Solar = 365.2548
    } else if (CalName === 'Chongtian') { // 崇天用了365.25 .27兩個値，我折衷統一
        Solar = 365.26
    } else if (CalName === 'Mingtian') {
        Solar = 365.24
    } else if (['Guantian', 'Fengyuan', 'Zhantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    }
    const QuarSolar = Solar / 4
    const HalfSolar = Solar / 2
    const EighthSolar = Solar / 8
    let Equator2Ecliptic = 0
    let Ecliptic2Equator = 0
    let Longi = LongiRaw % EighthSolar
    if ((LongiRaw > EighthSolar && LongiRaw <= QuarSolar) || (LongiRaw > 3 * EighthSolar && LongiRaw <= HalfSolar) || (LongiRaw > 5 * EighthSolar && LongiRaw <= 3 * QuarSolar) || (LongiRaw > 7 * EighthSolar)) {
        Longi = EighthSolar - Longi
    }
    let h = 0
    let Ecliptic2EquatorDif = 0
    let Equator2EclipticDif = 0
    // 這些函數並不是以91度或者45度對稱，而是將近60度左右
    if (CalName === 'Chongxuan') {
        Equator2EclipticDif = ((1315 - 14.4 * Longi) * Longi - Longi * (4566 - Longi) / 1696) / 10000
        // const tmp1 =(frc('8685 4566/1696').div(frc(14.4).sub('1/1696'))).div(2).toFraction(true) // '301 81608 / 122107'
        // const tmp2=frc(10000).div(frc(14.4).sub('1/1696')).toFraction(true) // "694 57742/122107"
        h = Math.sqrt((694 + 57742 / 122107) * Longi + (301 + 81608 / 122107) ** 2) - (301 + 81608 / 122107)
    } else if (CalName === 'Chongtian') {
        Equator2EclipticDif = Longi * (125 - Longi) / 1200
        h = Math.sqrt(288906.25 + 1200 * Longi) - 537.5
    } else if (CalName === 'Mingtian') {
        Equator2EclipticDif = Longi * (111.37 - Longi) / 1000
        h = Math.sqrt(197415.819225 + 1000 * Longi) - 444.315
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(CalName)) {
        Equator2EclipticDif = Longi * (400 - 3 * Longi) / 4000
        h = Math.sqrt(360000 + (4000 / 3) * Longi) - 600
    } else if (CalName === 'Jiyuan') { // 紀元一直到南宋、大明、庚午
        Equator2EclipticDif = Longi * (101 - Longi) / 1000
        // if (LongiRaw < QuarSolar || (LongiRaw >= HalfSolar && LongiRaw < Solar * 0.75)) {
        h = Math.sqrt(202050.25 + 1000 * Longi) - 449.5
        // }
        //  else {
        //     h = -Math.sqrt(303050.25 - 1000 * Longi1) + 550.5 // 這兩個公式是一樣的，只是對稱而已
        // }
    }
    // 《古代曆法》頁123    沒明白。曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元。赤道度爲Solar/8，黃道度就是43.1287。兩篇公式不一樣，最後畫圖才想明白。我把其他幾個曆法補出來了
    Ecliptic2EquatorDif = Math.abs(Longi - h)
    let sign1 = 1
    let sign2 = 1
    if (LongiRaw < QuarSolar || (LongiRaw >= HalfSolar && LongiRaw < Solar * 0.75)) {
        sign1 = -1
    } else {
        sign2 = -1
    }
    Equator2EclipticDif *= sign1
    Ecliptic2EquatorDif *= sign2
    Equator2Ecliptic = LongiRaw + Equator2EclipticDif
    Ecliptic2Equator = LongiRaw + Ecliptic2EquatorDif
    return {
        Equator2Ecliptic,
        Equator2EclipticDif,
        Ecliptic2Equator,
        Ecliptic2EquatorDif
    }
}
// console.log(Equator2EclipticFormula(91, 'Chongxuan'))

// 魏晉的黃道去極，是根據節氣來的，日書就不調用了
// 崇天的漏刻、赤緯跟《中國古代晝夜漏刻長度的計算法》一致。又說：魏晉南北、皇極、戊寅、應天、乾元、儀天自變量用的平氣，麟徳之後用的定氣。
export const Longi2LatiFormula = (LongiRaw, CalName) => { // 《中國古代曆法》頁128。漏刻頁135
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
export const Longi2DialFormula = (DegRaw, CalName) => { // 崇玄的NodeAccum沿用大衍：正午與二至時刻的距離加上日躔。陈美東《崇玄儀天崇天三曆晷長計算法及三次差內插法的應用》。1、距二至的整數日，2、算上二至中前後分的修正值。我現在直接用正午到二至的距離。之所以那麼麻煩，應該是因爲整數好算一些，實在迷惑。   // ：冬至到夏至，盈縮改正爲負，入盈曆，實行日小於平行日。因此自變量不應該是黃經，而是！！！！達到實行度所需日數！！！！！崇玄、崇天爲日躔表的盈縮分，儀天爲公式先後數，也就是定朔計算中的SunTcorr，只是符號相反。崇玄、崇天的節接銜接不理想。
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

export const MoonLongiFormula = (WinsolsDifRaw, NodeAccum, CalName) => { // 該日距冬至黃道度，入交日。不知是否應該加上日躔
    const {
        Type,
        AutoPara
    } = Bind(CalName)
    const {
        Node
    } = AutoPara[CalName]
    let Quadrant = 90.94
    if (CalName === 'Mingtian') {
        Quadrant = 90.92
    } else if (CalName === 'Jiyuan') {
        Quadrant = 90.9486
    } else if (Type === 11) {
        Quadrant = 91.314375
    }
    const LongiRaw = AutoMoonAvgV(CalName) * NodeAccum // 月所入正交積度
    let Longi = LongiRaw % Quadrant
    if (Longi > Quadrant / 2) {
        Longi = Quadrant - Longi
    }
    let Solar = 0
    if (['Chongtian', 'Mingtian'].includes(CalName)) {
        Solar = 365.24
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Solar = 365.2436
    } else if (Type === 11) {
        Solar = 365.2425
    }
    const QuarSolar = Solar / 4
    const HalfSolar = Solar / 2
    const HalfNode = Node / 2
    const WinsolsDif = WinsolsDifRaw - NodeAccum // 正交太陽黃度。我猜的
    let WinsolsDifHalf = WinsolsDif % HalfSolar
    if (WinsolsDifHalf > QuarSolar) { // 這一步沒有說明
        WinsolsDifHalf = HalfSolar - WinsolsDifHalf
    }
    let EclipticEquatorDif = 0
    let EclipticWhiteDif = 0
    let EquatorWhiteDif = 0
    let WhiteLongi = 0
    let EquatorLongi = 0
    let EquatorLongiB = 0
    if (Type === 11) { //《中國古代曆法》頁127
        let sign = -1
        if (WinsolsDif > Quadrant * 2) {
            sign = 1
        }
        const WinsolsDifQuar = WinsolsDif % Quadrant // 書上說是減去不是反減
        const V1 = 98 + sign * 24 * WinsolsDifQuar / Quadrant // 定限度
        EquatorLongi = Hushigeyuan(LongiRaw).Ecliptic2Equator // p128書上說直接由黃赤道率査得
        let sign2 = -1
        if ((LongiRaw >= Quadrant && LongiRaw < 2 * Quadrant) || (LongiRaw >= 3 * Quadrant)) {
            sign2 = 1
        }
        EquatorWhiteDif = sign2 * (V1 - WinsolsDifQuar) * WinsolsDifQuar / 1000
        WhiteLongi = EquatorLongi + EquatorWhiteDif
        EclipticWhiteDif = WhiteLongi - LongiRaw
    } else {
        if (CalName === 'Chongtian') { // 半交後正交前-，正交後半交前+
            EclipticWhiteDif = Longi * (125 - Longi) / 2400
            EquatorWhiteDif = Longi * WinsolsDifHalf * (125 - Longi) / 216000
        } else if (CalName === 'Mingtian') {
            EclipticWhiteDif = Longi * (111.37 - Longi) / 2000
            EquatorWhiteDif = Longi * WinsolsDifHalf * (111.37 - Longi) / 180000
        } else if (CalName === 'Guantian') {
            EclipticWhiteDif = Longi * (400 - 3 * Longi) / 8000
            EquatorWhiteDif = Longi * WinsolsDifHalf * (400 - 3 * Longi) / 720000
        } else if (CalName === 'Jiyuan') {
            EclipticWhiteDif = Longi * (101 - Longi) / 2000 // 我猜意思大概是這裏求出來是給求赤白差做鋪墊，不是真正要用這個            
            // EclipticEquatorDif = EquatorLongi - LongiRaw
            if ((NodeAccum <= HalfNode && (WinsolsDif < QuarSolar || WinsolsDif >= Solar * 0.75)) || (NodeAccum > HalfNode && WinsolsDif >= QuarSolar && WinsolsDif < Solar * 0.75)) {
                const N1 = 1.125 * EclipticWhiteDif
                const F5 = Math.abs(WinsolsDif - Solar * 0.75) // 正交度距秋分度數
                EquatorWhiteDif = N1 * F5 / Quadrant
                // 同名：赤白=黃赤+黃白，異名：赤白=黃赤-黃白 // WinsolsDif <= HalfSolar            
                EclipticEquatorDif = EquatorWhiteDif - EclipticWhiteDif
            } else {
                const N2 = 0.875 * EclipticWhiteDif
                const F6 = Math.abs(WinsolsDif - QuarSolar)
                EquatorWhiteDif = N2 * F6 / Quadrant
                EclipticEquatorDif = EquatorWhiteDif + EclipticWhiteDif
            }
        }
        let sign = 1
        if ((LongiRaw >= Quadrant && LongiRaw < 2 * Quadrant) || (LongiRaw >= 3 * Quadrant)) {
            sign = -1
        }
        EclipticWhiteDif *= sign
        EquatorWhiteDif *= sign
        WhiteLongi = LongiRaw + EclipticWhiteDif
        if (CalName === 'Jiyuan') {
            EclipticEquatorDif *= sign
            EquatorLongi = LongiRaw + EclipticEquatorDif
        } else {
            EquatorLongi = WhiteLongi + EquatorWhiteDif
        }
        EquatorLongiB = Equator2EclipticFormula(LongiRaw, CalName).Ecliptic2Equator // 直接用紀元的黃赤轉換求出來的，不是九道術的
    }
    return {
        EclipticEquatorDif,
        EclipticWhiteDif,
        EquatorWhiteDif,
        LongiRaw,
        EquatorLongi,
        EquatorLongiB,
        WhiteLongi
    }
}
// console.log(MoonLongiFormula(183, 3, 'Jiyuan').EquatorLongi)

export const MoonLatiFormula = (NodeAccumRaw, CalName) => { // 《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》
    let Cycle = 363.8
    let MoonAvgVDeg = AutoMoonAvgV(CalName) // 大衍：15*NodeAccum，0,1,...11 。其他都是13    
    if (CalName === 'Qintian') {
        MoonAvgVDeg = 1
    } else if (['Guantian', 'Jiyuan'].includes(CalName)) {
        Cycle = 363.7944
    }
    const HalfCycle = Cycle / 2
    const QuarCycle = Cycle / 4
    const Longi1 = NodeAccumRaw * MoonAvgVDeg
    let Longi2 = Longi1 % HalfCycle
    let Longi = 0
    let Lati = 0
    if (CalName === 'Chongxuan') { // 我沒反減，就沒事。奇怪。
        Longi = Longi1 % (QuarCycle)
        if (Longi2 > QuarCycle) {
            Longi = QuarCycle - Longi
        }
        if (Longi2 <= 30 || Longi2 > QuarCycle + 61) {
            // if (Longi2 > QuarCycle + 61) {
            //     Longi = QuarCycle - Longi
            // }
            Lati = (81305 * Longi - 386 * Longi ** 2) / 700000 // n=30,極值=3
        } else {
            // if (Longi2 >= 30 && Longi2 < QuarCycle) {
            //     Longi = QuarCycle - Longi
            // }
            Lati = (1656200 - 314440 * Longi + 1733 * Longi ** 2) / 2100000
        }
    } else if (CalName === 'Qintian') {
        const NodeAccum = NodeAccumRaw % HalfCycle
        Lati = (245 * NodeAccum - 18 * NodeAccum * NodeAccum) / 139
    } else if (CalName === 'Chongtian') {
        Longi = Longi2
        if (Longi2 > QuarCycle) {
            Longi = HalfCycle - Longi
        }
        // if (Longi > Cycle / 8) {
        // Longi = QuarCycle - Longi
        // }
        // if (Longi <= Cycle / 8) {
        Lati = (91451 * Longi - 290 * Longi ** 2) / 840000
        // } 
        // else {
        //     Lati = -(868359 - 129646 * Longi - 710 * Longi ** 2) / 840000 // 這個增長很快，x要在38內，y在6內
        // }
    } else if (CalName === 'Guantian') {
        Longi = Longi2
        if (Longi2 > QuarCycle) {
            Longi = HalfCycle - Longi
        }
        // if (Longi <= Cycle / 8) {
        Lati = (2239 / 17250) * Longi - Longi ** 2 / 1380
        // }
        //  else {
        //     Lati = -0.18188 + (1154 / 8625) * Longi - Longi ** 2 / 1380 // 這兩個幾乎沒什麼區別
        // }
    } else if (CalName === 'Jiyuan') {
        Longi = Longi2
        if (Longi2 > QuarCycle) {
            Longi = HalfCycle - Longi
        }
        Lati = big(372026500).mul(Longi).sub(big(763324).mul(big(Longi).pow(2))).sub(big(8181).mul(big(Longi).pow(3))).sub(big(10).mul(big(Longi).pow(4))).div(3437500000).toNumber()
    }
    Lati = -Math.abs(Lati)
    if (Longi1 > HalfCycle) { // 調用需要注意：此處統一先陽曆後陰曆
        Lati = -Lati
    }
    const Lati1 = 91.311 - Lati
    return {
        Lati,
        Lati1
    }
}
// console.log(MoonLatiFormula(15, 'Jiyuan'))