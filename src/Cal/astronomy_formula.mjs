import Para from './para_calendars.mjs'
import { AutoTcorr } from './astronomy_acrv.mjs'
import { AutoEqua2Eclp } from './astronomy_bind.mjs'
import { big } from './para_constant.mjs'
import { AutoMoonAvgV, AutoNodeCycle, AutoSolar, AutoSidereal } from './para_auto-constant.mjs'

export const Equa2EclpFormula = (LongiRaw, CalName) => { // 公式化的，週天度就用自己的
    const Solar = AutoSidereal(CalName)
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    const Solar125 = Solar / 8
    const Solar75 = Solar * 0.75
    let Equa2Eclp = 0, Eclp2Equa = 0
    const LongiQuar = LongiRaw % Solar25
    const Longi = Solar125 - Math.abs(LongiQuar - Solar125)
    let h = 0, Eclp2EquaDif = 0, Equa2EclpDif = 0
    // 這些函數並不是以91度或者45度對稱，而是將近60度左右
    if (CalName === 'Chongxuan') {
        Equa2EclpDif = ((1315 - 14.4 * Longi) * Longi - Longi * (4566 - Longi) / 1696) / 10000
        // const tmp1 =(frc('8685 4566/1696').div(frc(14.4).sub('1/1696'))).div(2).toFraction(true) // '301 81608 / 122107'
        // const tmp2=frc(10000).div(frc(14.4).sub('1/1696')).toFraction(true) // "694 57742/122107"
        h = Math.sqrt((694 + 57742 / 122107) * Longi + (301 + 81608 / 122107) ** 2) - (301 + 81608 / 122107)
    } else if (['Dayan', 'Chongtian'].includes(CalName)) {
        if (Longi <= 45) {
            Equa2EclpDif = Longi * (125 - Longi) / 1200 // 在45度正好=3，所以45以上處理爲依平
            h = Math.sqrt(288906.25 + 1200 * Longi) - 537.5
        } else {
            Equa2EclpDif = 3
            h = 3
        }
    } else if (CalName === 'Mingtian') {
        Equa2EclpDif = Longi * (111.37 - Longi) / 1000
        h = Math.sqrt(197415.819225 + 1000 * Longi) - 444.315
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(CalName)) {
        Equa2EclpDif = Longi * (400 - 3 * Longi) / 4000
        h = Math.sqrt(360000 + (4000 / 3) * Longi) - 600
    } else if (CalName === 'Jiyuan') { // 紀元一直到南宋、大明、庚午
        Equa2EclpDif = Longi * (101 - Longi) / 1000
        // if (LongiRaw < Solar25 || (LongiRaw >= Solar50 && LongiRaw < Solar75)) {
        h = Math.sqrt(202050.25 + 1000 * Longi) - 449.5
        // }
        //  else {
        //     h = -Math.sqrt(303050.25 - 1000 * LongiHalf) + 550.5 // 這兩個公式是一樣的，只是對稱而已
        // }
    }
    // 《古代曆法》頁123    沒明白。曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元。赤道度爲Solar/8，黃道度就是43.1287。兩篇公式不一樣，最後畫圖才想明白。我把其他幾個曆法補出來了
    Eclp2EquaDif = Math.abs(Longi - h)
    const sign1 = LongiRaw < Solar25 || (LongiRaw >= Solar50 && LongiRaw < Solar75) ? -1 : 1
    const sign2 = LongiRaw < Solar25 || (LongiRaw >= Solar50 && LongiRaw < Solar75) ? 1 : -1
    Equa2EclpDif *= sign1
    Eclp2EquaDif *= sign2
    Equa2Eclp = LongiRaw + Equa2EclpDif
    Eclp2Equa = LongiRaw + Eclp2EquaDif
    return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif }
}
// console.log(Equa2EclpFormula(91, 'Chongxuan'))

// 魏晉的黃道去極，是根據節氣來的，日書就不調用了。崇玄內外度是「昏後夜半日數」，紀元「午中日行積度」
// 崇天的漏刻、赤緯跟《中國古代晝夜漏刻長度的計算法》一致。又說：魏晉南北、皇極、戊寅、應天、乾元、儀天自變量用的平氣，麟德大衍宣明崇玄之後用的定氣。
export const Longi2LatiFormula = (LongiRaw, CalName) => { // 《中國古代曆法》頁128。漏刻頁135
    const Solar = AutoSidereal(CalName)
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    let LongiHalf = LongiRaw % Solar50
    const Longi = Solar25 - Math.abs(LongiHalf - Solar25)
    let Lati = 0, g = 0
    if (CalName === 'Chongxuan') { // x=195.838,y=0. x=138.478,y=35.267極值。x=91.3, y=23.996
        // g = (184 / 50025) * Longi ** 2 - (16 / (50025 * 3335)) * Longi ** 4
        g = big(184).div(50025).mul(big(Longi).pow(2)).sub(big(16).div(big.mul(50025, 3335)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) Lati = 23.9141 - g
        else Lati = -23.8859 + g
    } else if (CalName === 'Yitian') { // 儀天的自變量是距二至的日數
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) { // 冬至後次象
            if (LongiHalf > 93.7412) LongiHalf = Solar50 - LongiHalf
            // g = (1261875 / 20126347) * LongiHalf ** 2 - (6250000 / (20126347 * 522009)) * LongiHalf ** 4
            g = big.div(1261875, 20126347).mul(big(LongiHalf).pow(2)).sub(big(6250000).div(big.mul(20126347, 522009)).mul(big(LongiHalf).pow(4)))
        } else { // 冬至後初象
            if (LongiHalf > 88.8811) LongiHalf = Solar50 - LongiHalf
            // g = (167750 / 2229099) * LongiHalf ** 2 - (125000 / (2229099 * 39107)) * LongiHalf ** 4
            g = big.div(167750, 2229099).mul(big(LongiHalf).pow(2)).sub(big(125000).div(big.mul(2229099, 39107)).mul(big(LongiHalf).pow(4)))
        }
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) {
            Lati = big(23.9296).sub(g.mul(big.div(50, 1052))).toNumber()
        } else {
            // Lati = -23.9081 + (50 / 1062) * g
            Lati = big(-23.9296).add(g.mul(big.div(50, 1062))).toNumber()
        }
    } else if (CalName === 'Chongtian') { // 崇天明天觀天等價，四次項系數之差小餘10^-10
        // g = (460720 / 130620943) * Longi ** 2 - (80000 / (130620943 * 7873)) * Longi ** 4
        g = big(460720).div(130620943).mul(big(Longi).pow(2)).sub(big(80000).div(big.mul(130620943, 7873)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) Lati = 24.0041 - g
        else Lati = g - 23.9959
    } else if (CalName === 'Mingtian') {
        // g = (84800 / 24039561) * Longi ** 2 - (20000 / (24039561 * 10689)) * Longi ** 4
        g = big(84800).div(24039561).mul(big(Longi).pow(2)).sub(big(20000).div(big.mul(24039561, 10689)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) Lati = 24.0041 - g
        else Lati = g - 23.9959
    } else if (CalName === 'Guantian') {
        // g = (1221360 / 346290367) * Longi ** 2 - (784000 / (346290367 * 29109)) * Longi ** 4
        g = big(1221360).div(346290367).mul(big(Longi).pow(2)).sub(big(784000).div(big.mul(346290367, 29109)).mul(big(Longi).pow(4))).toNumber()
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) Lati = 24.0041 - g
        else Lati = g - 23.9959
    } else if (CalName === 'Jiyuan') {
        if (LongiRaw >= Solar25 && LongiRaw < 3 * Solar25) { // 夏至前後
            // Lati = 23.9 - (491.3109 ** 2 * Longi ** 2 - 982.6218 * Longi ** 3 + Longi ** 4) / (160000 * 348.856)
            Lati = big(23.9).sub(big((big(491.3109).pow(2).mul(big(Longi).pow(2))).sub(big(982.6218).mul(big(Longi).pow(3))).add(big(Longi).pow(4))).div(big.mul(160000, 348.856))).toNumber()
        } else { // 冬至前後
            // Lati = (608.3109 ** 2 * Longi ** 2 - 1216.6218 * Longi ** 3 + Longi ** 4) / (517 ** 2 * 348.856) - 23.9
            Lati = big(-23.9).add(big((big(608.3109).pow(2).mul(big(Longi).pow(2))).sub(big(1216.6218).mul(big(Longi).pow(3))).add(big(Longi).pow(4))).div(big.mul(267289, 348.856))).toNumber()
            // const tmp = (Solar25 - (Longi * (Solar25 - Longi) / 517 + Longi))
            // Lati = (Solar50 - tmp) * tmp / 348.856
        }
    }
    const Lati1 = Solar25 - Lati
    let Night = 0
    if (CalName === 'Yitian') {
        if (LongiRaw < Solar25) Night = 22.53 - Lati / 4.76
        else if (LongiRaw < Solar50) Night = 22.49 - Lati / 4.8
        else if (LongiRaw < 3 * Solar25) Night = 22.51 - Lati / 4.8
        else Night = 22.47 - Lati / 4.76
    } else Night = 22.5 - Lati / 4.8
    const Rise = Night + 2.5
    return { Lati, Lati1, Rise }
}
// console.log(Longi2LatiFormula(31.816049, 'Jiyuan').Lati)

// 崇玄赤轉黃，用的「赤道日度」，赤轉赤緯，「昏後夜半日數」，晷長：「日中入二至加時以來日數」
export const Longi2DialFormula = (DegRaw, CalName) => { // 崇玄的NodeAccum沿用大衍：正午與二至時刻的距離加上日躔。陈美東《崇玄儀天崇天三曆晷長計算法及三次差內插法的應用》。1、距二至的整數日，2、算上二至中前後分的修正值。我現在直接用正午到二至的距離。之所以那麼麻煩，應該是因爲整數好算一些，實在迷惑。   // ：冬至到夏至，盈縮改正爲負，入盈曆，實行日小於平行日。因此自變量不應該是黃經，而是！！！！達到實行度所需日數！！！！！崇玄、崇天爲日躔表的盈縮分，儀天爲公式先後數，也就是定朔計算中的SunTcorr，只是符號相反。崇玄、崇天的節接銜接不理想。
    const Solar = AutoSolar(CalName)
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    let Deg = parseFloat((DegRaw % Solar50).toPrecision(14))
    let Dial = 0
    if (CalName === 'Chongxuan') {
        if ((DegRaw >= Solar50 && Deg > 123.62225) || (DegRaw < Solar50 && Deg > 59)) {
            Deg = parseFloat((Solar50 - Deg).toPrecision(14))
        }
        if (DegRaw <= 59 || (DegRaw >= 123.62225 + Solar50)) {
            Dial = 12.715 - 1e-6 * (2195 - 15 * Deg) * Deg ** 2
        } else {
            Dial = 1.478 + 1e-7 * (4880 - 4 * Deg) * Deg ** 2
        }
    } else if (CalName === 'Yitian') {
        if ((DegRaw >= Solar50 && Deg > 123.62225) || (DegRaw < Solar50 && Deg > 59)) {
            Deg = parseFloat((Solar50 - Deg).toPrecision(14))
        }
        if (DegRaw <= 59 || (DegRaw >= 123.622275 + Solar50)) {
            Dial = 12.715 - 1e-6 * (2130 - 14 * Deg) * Deg ** 2
        } else {
            Dial = 1.478 + 1e-7 * (4812 - 3.5 * Deg) * Deg ** 2
        }
    } else if (CalName === 'Chongtian') {
        if ((DegRaw >= Solar50 && Deg > 120.62) || (DegRaw < Solar50 && Deg > 62)) {
            Deg = parseFloat((Solar50 - Deg).toPrecision(14))
        }
        if (DegRaw <= 62 || (DegRaw >= 120.62 + Solar50)) {
            Dial = 12.715 - 1e-6 * (2197.14 - 15.05 * Deg) * Deg ** 2
        } else {
            Dial = 1.478 + 1e-7 * (4881.67 - 4.01 * Deg) * Deg ** 2
        }
    } else if (['Mingtian', 'Guantian'].includes(CalName)) {
        if ((DegRaw >= Solar50 && Deg > 137) || (DegRaw < Solar50 && Deg > 45.62)) {
            Deg = parseFloat((Solar50 - Deg).toPrecision(14))
        }
        Deg = big(Deg)
        if (DegRaw <= 45.62 || (DegRaw >= 137 + Solar50)) {
            // Dial = 12.85 - 1e-6 * (1937.5 * Deg ** 2 - Deg ** 3 - (200 / 827) * Deg ** 4 + (1 / 827) * Deg ** 5)
            Dial = big(12.85).sub(big(1e-6).mul(big(1937.5).mul(Deg.pow(2)).sub(Deg.pow(3)).sub(big(200 / 827).mul(Deg.pow(4))).add(big(1 / 827).mul(Deg.pow(5)))))
        } else if (DegRaw > Solar25 && DegRaw < 3 * Solar25) {
            // Dial = 1.57 + 1e-6 * (545.25 * Deg ** 2 - (3827 / 2481) * Deg ** 2 + (5 / 827) * Deg ** 4)
            Dial = big(1.57).add(big(1e-6).mul(big(545.25).mul(Deg.pow(2)).sub(big(3827 / 2481).mul(Deg.pow(2))).add(big(5 / 827).mul(Deg.pow(4)))))
        } else {
            // Dial = 1.57 + 1e-6 * (510.09274 * Deg ** 2 - 1.213548 * Deg ** 3 + 0.01034059 * Deg ** 4 - 0.0000403063 * Deg ** 5)
            Dial = big(1.57).add(big(1e-6).mul(big(510.09274).mul(Deg.pow(2)).sub(big(1.213548).mul(Deg.pow(3))).add(big(0.01034059).mul(Deg.pow(4))).sub(big(0.0000403063).mul(Deg.pow(5)))))
        }
        Dial = Dial.toNumber()
    } else if (CalName === 'Jiyuan') {
        if ((DegRaw >= Solar50 && Deg > 120.42) || (DegRaw < Solar50 && Deg > 62.2)) {
            Deg = parseFloat((Solar50 - Deg).toPrecision(14))
        }
        Deg = big(Deg)
        if (DegRaw <= 62.2 || (DegRaw >= 120.42 + Solar50)) {
            // Dial = 12.83 - 200 * Deg ** 2 / (100617 + 100 * Deg + (400 / 29) * Deg ** 2)
            Dial = big(12.83).sub(big(200).mul(Deg.mul(Deg)).div((big(100617).add(Deg.mul(100)).add(big(400 / 29).mul(Deg.mul(Deg))))))
        } else if (DegRaw > Solar25 && DegRaw < 3 * Solar25) {
            // Dial = 1.56 + 4 * Deg ** 2 / (7923 + 9 * Deg ** 2)
            Dial = big(1.56).add(Deg.mul(Deg).mul(4).div(big(7923).add(Deg.mul(9))))
        } else {
            // Dial = 1.56 + 7700 * Deg ** 2 / (13584271.78 + 44718 * Deg - 100 * Deg ** 2)
            Dial = big(1.56).add(Deg.mul(Deg).mul(7700).div(big(13584271.78).add(Deg.mul(44718).sub(Deg.mul(Deg).mul(100)))))
        }
        Dial = Dial.toNumber()
    }
    const Print = '距冬至 ' + DegRaw + ' 日，晷長 ' + Dial.toFixed(6) + ' 尺'
    return { Dial, Print }
}
// console.log(Longi2DialFormula(95, 'Jiyuan').Print)

// 《數》頁361 白道度是以黃道度、正交黃經的二元函數
export const MoonLongiFormula = (NodeEclpLongi, MoonNodeDifRev, CalName) => { // SunEclpLongi, NodeAccum,  // 該日距冬至黃道度，入交日。不知是否應該加上日躔
    const Solar = AutoSolar(CalName)
    const NodeCycle = AutoNodeCycle(CalName)
    const Quadrant = NodeCycle / 4
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    // const Node50 = Node / 2
    // const NodeEclpLongiRev = Math.abs(NodeEclpLongi % Solar50 - Solar / 4) // 去二分度。黃白差在二分爲0
    const NodeEclpLongiHalf = NodeEclpLongi % Solar50
    const NodeEclpLongiRev = Solar25 - Math.abs(NodeEclpLongiHalf - Solar25) // 去二至度
    // if (['Chongtian', 'Mingtian', 'Guantian'].includes(CalName)) {
    //     if (CalName === 'Chongtian') { // 半交後正交前-，正交後半交前+
    //         EclpWhiteDif = MoonEclpLongiRev * (125 - MoonEclpLongiRev) / 2400
    //     } else if (CalName === 'Mingtian') {
    //         EclpWhiteDif = MoonEclpLongiRev * (111.37 - MoonEclpLongiRev) / 2000
    //     } else {
    //         EclpWhiteDif = MoonEclpLongiRev * (400 - 3 * MoonEclpLongiRev) / 8000
    //     }
    //     EquaWhiteDif = EclpWhiteDif * NodeEclpLongiRev / 90
    // } else if (CalName === 'Jiyuan') { // 正交在二至，黃白差大
    //     EclpWhiteDif = MoonEclpLongiRev * (101 - MoonEclpLongiRev) / 2000
    //     if (NodeAccum <= Node50 && NodeEclpLongi < Solar50) {
    //         EclpWhiteDif *= 1.125
    //     } else {
    //         EclpWhiteDif *= 0.875
    //     }
    //     EquaWhiteDif = EclpWhiteDif * NodeEclpLongiRev / Quadrant // 同名：赤白=黃赤+黃白，異名：赤白=黃赤-黃白 ？？            
    // }
    // 《數》頁359
    let EclpWhiteDif = Math.abs(AutoEqua2Eclp(MoonNodeDifRev, CalName).Equa2EclpDif) / 2 // AutoEqua2Eclp(MoonEclpLongiRev, CalName)
    if (CalName === 'Jiyuan') {
        if (NodeEclpLongi < Solar50) EclpWhiteDif *= 1.125
        else EclpWhiteDif *= 0.875
    }
    EclpWhiteDif *= NodeEclpLongiRev / Quadrant
    return EclpWhiteDif
}
// console.log(MoonLongiFormula(91, 92, 'Jiyuan').EclpWhiteDif)

export const MoonLatiFormula = (NodeAccum, CalName, AnomaAccum, SolsDif) => { // 《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》；《數》頁410
    const { Node } = Para[CalName]
    const Cycle = AutoNodeCycle(CalName)
    let MoonAvgDV = AutoMoonAvgV(CalName) // 大衍：15*NodeAccum，0,1,...11 。其他都是13    
    if (CalName === 'Qintian') {
        MoonAvgDV = 1
    }
    const Cycle50 = Cycle / 2
    const Cycle25 = Cycle / 4
    const Cycle125 = Cycle / 8
    const Longi = NodeAccum * MoonAvgDV
    const LongiHalf = Longi % Cycle50
    const LongiHalfRev = Cycle25 - Math.abs(LongiHalf - Cycle25)
    let Lati = 0
    // 崇玄「以四百一乘朔望加時入交常日⋯⋯得定朔望入交定積度分」，也就是說應該不用加入NodeAccumCorr
    // 崇玄崇天是反減半交，觀天紀元是反減交中度。但經過試驗，全部都是反減交中度
    if (CalName === 'Chongxuan') {
        const f1 = (Cycle50 - LongiHalfRev) * LongiHalfRev / (10000 / 7.3)
        const f2 = (Cycle25 - LongiHalfRev) * LongiHalfRev / 5600
        const f3 = (Cycle25 - LongiHalfRev) ** 2 / 11500
        if (LongiHalfRev < 30) Lati = f1 - f2
        else Lati = f1 - f3
    } else if (CalName === 'Qintian') {
        NodeAccum += AutoTcorr(AnomaAccum, SolsDif, CalName, NodeAccum).NodeAccumCorrA // 欽天用入交定日                
        const NodeAccumHalf = NodeAccum % Cycle50
        Lati = (Node / 2 - NodeAccumHalf) * NodeAccumHalf / (556 / 72)
    } else if (CalName === 'Chongtian') {
        const f1 = (1010 - 5 * LongiHalfRev) * LongiHalfRev / 8400
        const f2 = (Cycle125 - LongiHalfRev) * LongiHalfRev / 4000 // 這兩個是一樣的
        const f3 = (Cycle25 - LongiHalfRev) * (LongiHalfRev - Cycle25 / 2) / 4000
        if (LongiHalfRev < Cycle125) Lati = f1 - f2
        else Lati = f1 + f3
    } else if (CalName === 'Guantian') {
        const f1 = (Cycle50 - LongiHalfRev) * LongiHalfRev / 1380
        const f2 = LongiHalfRev / 500
        const f3 = (LongiHalfRev - Cycle25) / 500
        if (LongiHalfRev < Cycle125) Lati = f1 - f2
        else Lati = f1 + f3
    } else if (CalName === 'Jiyuan') {
        const tmp = LongiHalfRev - (Cycle25 - LongiHalfRev) * LongiHalfRev / 500
        Lati = (Cycle50 - tmp) * tmp / 1375
    }
    if (Longi < Cycle50) Lati = -Lati // 調用需要注意：此處統一先陽曆後陰曆    
    const Lati1 = 91.311 - Lati
    return { Lati, Lati1 }
}
// console.log(MoonLatiFormula(15, 'Jiyuan'))