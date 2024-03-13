import Para from './para_calendars.mjs'
import { AutoTcorr } from './astronomy_acrv.mjs'
import { autoEquaEclp } from './astronomy_bind.mjs'
import { big } from './para_constant.mjs'
import { AutoMoonAvgV, AutoNodeCycle, AutoSolar, AutoSidereal } from './para_auto-constant.mjs'

export const Equa2EclpFormula = (LonRaw, Name) => { // 公式化的，週天度就用自己的
    const Solar = AutoSidereal(Name)
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    const Solar125 = Solar / 8
    const Solar75 = Solar * .75
    let Equa2Eclp = 0, Eclp2Equa = 0
    const LonQuar = LonRaw % Solar25
    const Lon = Solar125 - Math.abs(LonQuar - Solar125)
    let h = 0, Eclp2EquaDif = 0, Equa2EclpDif = 0
    // 這些函數並不是以91度或者45度對稱，而是將近60度左右
    if (Name === 'Chongxuan') {
        Equa2EclpDif = ((1315 - 14.4 * Lon) * Lon - Lon * (4566 - Lon) / 1696) / 10000
        // const tmp1 =(frc('8685 4566/1696').div(frc(14.4).sub('1/1696'))).div(2).toFraction(true) // '301 81608 / 122107'
        // const tmp2=frc(10000).div(frc(14.4).sub('1/1696')).toFraction(true) // "694 57742/122107"
        h = Math.sqrt((694 + 57742 / 122107) * Lon + (301 + 81608 / 122107) ** 2) - (301 + 81608 / 122107)
    } else if (['Dayan', 'Chongtian'].includes(Name)) {
        if (Lon <= 45) {
            Equa2EclpDif = Lon * (125 - Lon) / 1200 // 在45度正好=3，所以45以上處理爲依平
            h = Math.sqrt(288906.25 + 1200 * Lon) - 537.5
        } else {
            Equa2EclpDif = 3
            h = 3
        }
    } else if (Name === 'Mingtian') {
        Equa2EclpDif = Lon * (111.37 - Lon) / 1000
        h = Math.sqrt(197415.819225 + 1000 * Lon) - 444.315
    } else if (['Guantian', 'Fengyuan', 'Zhantian'].includes(Name)) {
        Equa2EclpDif = Lon * (400 - 3 * Lon) / 4000
        h = Math.sqrt(360000 + 4000 / 3 * Lon) - 600
    } else if (Name === 'Jiyuan') { // 紀元一直到南宋、大明、庚午
        Equa2EclpDif = Lon * (101 - Lon) / 1000
        // if (LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75)) {
        h = Math.sqrt(202050.25 + 1000 * Lon) - 449.5
        // }
        //  else {
        //     h = -Math.sqrt(303050.25 - 1000 * LonHalf) + 550.5 // 這兩個公式是一樣的，只是對稱而已
        // }
    }
    // 《古代曆法》頁123    沒明白。曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元。赤道度爲Solar/8，黃道度就是43.1287。兩篇公式不一樣，最後畫圖才想明白。我把其他幾個曆法補出來了
    Eclp2EquaDif = Math.abs(Lon - h)
    const sign1 = LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75) ? -1 : 1
    const sign2 = LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75) ? 1 : -1
    Equa2EclpDif *= sign1
    Eclp2EquaDif *= sign2
    Equa2Eclp = LonRaw + Equa2EclpDif
    Eclp2Equa = LonRaw + Eclp2EquaDif
    return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif }
}
// console.log(Equa2EclpFormula(91, 'Chongxuan'))
/**
 * 
 * @param {*} LonRaw 儀天：距冬至時長，其他：實行度
 * @param {*} Name 
 * @returns 赤緯
 */
export const latFormula = (XRaw, Name) => { // 《中國古代曆法》頁128、古曆新探p172。漏刻頁135。
    const Solar = AutoSidereal(Name)
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    XRaw %= Solar
    const LonHalf = XRaw % Solar50
    let Lat = 0, g = 0
    if (Name === 'Yitian') {
        if (XRaw >= 88.8811 && XRaw < Solar50 + 93.7411) { // 冬至後次象// 946785.5 / 10100=93.7411
            Solar50
            const Lon = Math.abs(Solar50 - XRaw)
            g = (1261875 / 20126347) * Lon ** 2 - (6250000 / (20126347 * 522009)) * Lon ** 4
            Lat = 23.9296 - 50 / 1052 * g
        } else { // 冬至後初象
            const Lon = Math.min(XRaw, Solar - XRaw) // 到0的距離
            g = (167750 / 2229099) * Lon ** 2 - (125000 / (2229099 * 39107)) * Lon ** 4
            Lat = - 23.9081 + 50 / 1062 * g
        }
    } else if (Name === 'Jiyuan') {
        const Lon = Solar25 - Math.abs(LonHalf - Solar25)
        if (XRaw >= Solar25 && XRaw < 3 * Solar25) { // 夏至前後
            Lat = 23.9 - (491.3109 ** 2 * Lon ** 2 - 982.6218 * Lon ** 3 + Lon ** 4) / 160000 / 348.856
        } else { // 冬至前後
            Lat = -23.9 + (608.3109 ** 2 * Lon ** 2 - 1216.6218 * Lon ** 3 + Lon ** 4) / 267289 / 348.856
        }
    } else {
        const Lon = Solar25 - Math.abs(LonHalf - Solar25)
        if (['Chongxuan', 'Qintian', 'Chongtian', 'Mingtian', 'Guantian', 'Fengyuan', 'Zhantian'].includes(Name)) {
            let a = 1221360 / 346290367, b = 784000 / (346290367 * 29109), e1 = 24.0041, e2 = 23.9959 //  'Guantian', 'Fengyuan', 'Zhantian'
            if (['Chongxuan', 'Qintian'].includes(Name)) a = 184 / 50025, b = 16 / (50025 * 3335), e1 = 23.9141, e2 = 23.8859
            if (Name === 'Chongtian') a = 460720 / 130620943, b = 80000 / (130620943 * 7873)
            else if (Name === 'Mingtian') a = 84800 / 24039561, b = 20000 / (24039561 * 10689)
            g = a * Lon ** 2 - b * Lon ** 4
            if (XRaw >= Solar25 && XRaw < 3 * Solar25) Lat = e1 - g
            else Lat = -e2 + g
        }
    }
    return +Lat.toFixed(6)
}
// console.log(latFormula(200, 'Yitian').Lat)
// console.log(1e-6)
export const riseFormula = (LatNoon, SdNoon, Name) => {
    const Solar = AutoSidereal(Name), Solar50 = Solar / 2
    let Night = 0
    if (Name === 'Yitian') {
        if (SdNoon < 88.8811) Night = 22.53 - LatNoon / 4.76
        else if (SdNoon < Solar50) Night = 22.49 - LatNoon / 4.8
        else if (SdNoon < Solar50 + 93.7411) Night = 22.51 - LatNoon / 4.8
        else Night = 22.47 - LatNoon / 4.76
    } else Night = 22.5 - LatNoon / 4.8
    return Night + 2.5
}
export const dialFormula = (DegRaw, Name, SolsDeci) => { // 陈美东《崇玄仪天崇天三历晷长计算法及三次差内插法的应用》有儀天曆術文補
    const Solar = AutoSolar(Name), Solar25 = Solar / 4, Solar50 = Solar / 2
    DegRaw %= Solar
    let xian = 0, Dial = 0, DialMor = 0
    if (['Chongxuan', 'Qintian', 'Yitian'].includes(Name)) xian = 59
    else if (Name === 'Chongtian') xian = 62
    else if (['Mingtian', 'Guantian', 'Fengyuan', 'Zhantian'].includes(Name)) xian = 45.62
    else if (Name === 'Jiyuan') xian = 62.2
    const Deg1 = Math.min(DegRaw, Solar - DegRaw) // 與0的距離
    const Deg2 = Math.abs(Solar50 - DegRaw) // 與180的距離
    if (['Chongxuan', 'Qintian', 'Yitian', 'Chongtian'].includes(Name)) {
        let a1 = 2197.14, b1 = 15.05, a2 = 4881.67, b2 = 4.01 // 崇天
        if (Name === 'Chongxuan' || Name === 'Qintian') a1 = 2195, b1 = 15, a2 = 4880, b2 = 4
        else if (Name === 'Yitian') a1 = 2130, b1 = 14, a2 = 4812, b2 = 3.5
        if (DegRaw < xian || (DegRaw >= Solar - xian)) {
            Dial = 12.715 - 1e-6 * (a1 - b1 * Deg1) * Deg1 ** 2
        } else Dial = 1.478 + 1e-7 * (a2 - b2 * Deg2) * Deg2 ** 2
        // if (['Chongxuan', 'Qintian'].includes(Name)) { // 大衍、崇玄求次日晷長。爲避免麻煩，統一用崇天的方法。儀天：算二至具體時刻到當日夜半，再加減半日晷長。《古曆新探》p138:當日時刻到二至(.N)的時長，崇玄.5-.N，儀天0，崇天.5。
        //     const DegRawMor = DegRaw + 1
        //     let DegMor = parseFloat(((DegRaw + 1) % Solar50).toPrecision(14))
        //     if ((DegRawMor > xian && DegRawMor < Solar50) || (DegRawMor >= Solar - xian)) DegMor = parseFloat((Solar50 - DegMor).toPrecision(14))
        //     if (DegRawMor < xian || (DegRawMor >= Solar - xian)) {
        //         DialMor = 12.715 - 1e-6 * (a1 - b1 * DegMor) * DegMor ** 2
        //     } else DialMor = 1.478 + 1e-7 * (a2 - b2 * DegMor) * DegMor ** 2
        //     Dial += (.5 - SolsDeci) * (DialMor - Dial)
        // }
    } else if (['Mingtian', 'Guantian', 'Fengyuan', 'Zhantian'].includes(Name)) {
        if (DegRaw <= xian || (DegRaw >= Solar - xian)) {
            Dial = 12.85 - 1e-6 * (1937.5 * Deg1 ** 2 - Deg1 ** 3 - (200 / 827) * Deg1 ** 4 + (1 / 827) * Deg1 ** 5)
        } else if (DegRaw > Solar25 && DegRaw < 3 * Solar25) {
            Dial = 1.57 + 1e-6 * (545.25 * Deg2 ** 2 - (3827 / 2481) * Deg2 ** 3 + (5 / 827) * Deg2 ** 4)
        } else {
            Dial = 1.57 + 1e-6 * (510.09274 * Deg2 ** 2 - 1.213548 * Deg2 ** 3 + .01034059 * Deg2 ** 4 - .0000403063 * Deg2 ** 5)
        }
    } else if (Name === 'Jiyuan') {
        if (DegRaw <= xian || (DegRaw >= Solar - xian)) {
            Dial = 12.83 - 200 * Deg1 ** 2 / (100617 + 100 * Deg1 + (400 / 29) * Deg1 ** 2)
        } else if (DegRaw > Solar25 && DegRaw < 3 * Solar25) {
            Dial = 1.56 + 4 * Deg2 ** 2 / (7923 + 9 * Deg2)
        } else {
            Dial = 1.56 + 7700 * Deg2 ** 2 / (13584271.78 + 44718 * Deg2 - 100 * Deg2 ** 2)
        }
    }
    return Dial
}
// console.log(dialFormula(307, 'Chongxuan', .3))

// 《數》頁361 白道度是以黃道度、正交黃經的二元函數
export const MoonLonFormula = (NodeEclpLon, MoonNodeDifRev, Name) => { // SunEclpLon, NodeAccum,  // 該日距冬至黃道度，入交日。不知是否應該加上日躔
    const Solar = AutoSolar(Name)
    const NodeCycle = AutoNodeCycle(Name)
    const Quadrant = NodeCycle / 4
    const Solar25 = Solar / 4
    const Solar50 = Solar / 2
    // const Node50 = Node / 2
    // const NodeEclpLonRev = Math.abs(NodeEclpLon % Solar50 - Solar / 4) // 去二分度。黃白差在二分爲0
    const NodeEclpLonHalf = NodeEclpLon % Solar50
    const NodeEclpLonRev = Solar25 - Math.abs(NodeEclpLonHalf - Solar25) // 去二至度
    // if (['Chongtian', 'Mingtian', 'Guantian'].includes(Name)) {
    //     if (Name === 'Chongtian') { // 半交後正交前-，正交後半交前+
    //         EclpWhiteDif = MoonEclpLonRev * (125 - MoonEclpLonRev) / 2400
    //     } else if (Name === 'Mingtian') {
    //         EclpWhiteDif = MoonEclpLonRev * (111.37 - MoonEclpLonRev) / 2000
    //     } else {
    //         EclpWhiteDif = MoonEclpLonRev * (400 - 3 * MoonEclpLonRev) / 8000
    //     }
    //     EquaWhiteDif = EclpWhiteDif * NodeEclpLonRev / 90
    // } else if (Name === 'Jiyuan') { // 正交在二至，黃白差大
    //     EclpWhiteDif = MoonEclpLonRev * (101 - MoonEclpLonRev) / 2000
    //     if (NodeAccum <= Node50 && NodeEclpLon < Solar50) {
    //         EclpWhiteDif *= 1.125
    //     } else {
    //         EclpWhiteDif *= .875
    //     }
    //     EquaWhiteDif = EclpWhiteDif * NodeEclpLonRev / Quadrant // 同名：赤白=黃赤+黃白，異名：赤白=黃赤-黃白 ？？            
    // }
    // 《數》頁359
    let EclpWhiteDif = Math.abs(autoEquaEclp(MoonNodeDifRev, Name).Equa2EclpDif) / 2 // autoEquaEclp(MoonEclpLonRev, Name)
    if (Name === 'Jiyuan') {
        if (NodeEclpLon < Solar50) EclpWhiteDif *= 1.125
        else EclpWhiteDif *= .875
    }
    EclpWhiteDif *= NodeEclpLonRev / Quadrant
    return EclpWhiteDif
}
// console.log(MoonLonFormula(91, 92, 'Jiyuan').EclpWhiteDif)

export const MoonLatFormula = (NodeAccum, Name, AnomaAccum, Sd) => { // 《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》；《數》頁410
    const { Node } = Para[Name]
    const Cycle = AutoNodeCycle(Name)
    let MoonAvgVd = AutoMoonAvgV(Name) // 大衍：15*NodeAccum，0,1,...11 。其他都是13    
    if (Name === 'Qintian') MoonAvgVd = 1
    const Cycle50 = Cycle / 2, Cycle25 = Cycle / 4, Cycle125 = Cycle / 8, Lon = NodeAccum * MoonAvgVd
    const LonHalf = Lon % Cycle50
    const LonHalfRev = Cycle25 - Math.abs(LonHalf - Cycle25)
    let Lat = 0
    // 崇玄「以四百一乘朔望加時入交常日⋯⋯得定朔望入交定積度分」，也就是說應該不用加入NodeAccumCorr
    // 崇玄崇天是反減半交，觀天紀元是反減交中度。但經過試驗，全部都是反減交中度
    if (Name === 'Chongxuan') {
        const f1 = (Cycle50 - LonHalfRev) * LonHalfRev / (10000 / 7.3)
        const f2 = (Cycle25 - LonHalfRev) * LonHalfRev / 5600
        const f3 = (Cycle25 - LonHalfRev) ** 2 / 11500
        if (LonHalfRev < 30) Lat = f1 - f2
        else Lat = f1 - f3
    } else if (Name === 'Qintian') {
        NodeAccum += AutoTcorr(AnomaAccum, Sd, Name, NodeAccum).NodeAccumCorrA // 欽天用入交定日                
        const NodeAccumHalf = NodeAccum % Cycle50
        Lat = (Node / 2 - NodeAccumHalf) * NodeAccumHalf / (556 / 72)
    } else if (Name === 'Chongtian') {
        const f1 = (1010 - 5 * LonHalfRev) * LonHalfRev / 8400
        const f2 = (Cycle125 - LonHalfRev) * LonHalfRev / 4000 // 這兩個是一樣的
        const f3 = (Cycle25 - LonHalfRev) * (LonHalfRev - Cycle25 / 2) / 4000
        if (LonHalfRev < Cycle125) Lat = f1 - f2
        else Lat = f1 + f3
    } else if (Name === 'Guantian') {
        const f1 = (Cycle50 - LonHalfRev) * LonHalfRev / 1380
        const f2 = LonHalfRev / 500
        const f3 = (LonHalfRev - Cycle25) / 500
        if (LonHalfRev < Cycle125) Lat = f1 - f2
        else Lat = f1 + f3
    } else if (Name === 'Jiyuan') {
        const tmp = LonHalfRev - (Cycle25 - LonHalfRev) * LonHalfRev / 500
        Lat = (Cycle50 - tmp) * tmp / 1375
    }
    if (Lon < Cycle50) Lat = -Lat // 調用需要注意：此處統一先陽曆後陰曆    
    const Lat1 = 91.311 - Lat
    return { Lat, Lat1 }
}
// console.log(MoonLatFormula(15, 'Jiyuan'))