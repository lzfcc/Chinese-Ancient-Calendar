import { Bind } from './bind.mjs'
import { frc } from './para_constant.mjs'
import { AutoTcorr, AutoDifAccum, MoonFormula } from './astronomy_acrv.mjs'
import { Interpolate3 } from './equa_sn.mjs'
import { AutoLongi2Lati } from './bind_astronomy.mjs'
import { AutoQuar, AutoMoonAvgV, AutoMoonTcorrDif, AutoNodePortion, AutoNodeCycle } from './para_auto-constant.mjs'

const ExMagni = (Magni, Type, CalName, isNewm) => {
    let status = 0
    if (Type < 5) {
        if (Magni <= 1e-12) {
            Magni = 0
            status = 0
            status = 3
        } else if (Magni < 5) {
        } else if (Magni < 12.417) {
            status = 2
        } else { // NodeDif < 1 / 12
            status = 1
        }
    } else if (Type <= 7 && CalName !== 'Qintian') {
        if (Magni <= 1e-12) {
            Magni = 0
        } else if (Magni < 3) { // 大衍月食去交13度以上或不見食，算下來是3.1度
            status = 3
        } else if (Magni < 14.9999) {
            status = 2
        } else {
            Magni = 15
            status = 1
        }
    } else if (['Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) { // 崇玄開始定爲10
        if (Magni <= 1e-12) {
            Magni = 0
        } else if (Magni <= 5) {
            status = 3
        } else if (Magni < 9.9999) {
            status = 2
        } else {
            Magni = 10
            status = 1
        }
    } else { // 崇天開始有月食五限，遼金的月食加上旣內分能達到15，我就假設崇天開始月食都是15
        if (Magni <= 1e-12) {
            Magni = 0
        } else if (Magni <= 1) { // 崇玄「其蝕五分已下者，為或食；已上為的蝕。」庚午「其一分以下者，涉交太淺，太陽光盛，或不見食」紀元「其食不及大分者，⋯⋯」
            status = 3
        } else if (Magni < 9.9999) {
            status = 2
        } else {
            status = 1
            if (isNewm) {
                Magni = 10
            } else if (Magni > 14.9999) {
                Magni = 15
            }
        }
    }
    return { Magni, status }
}

const Eclipse1 = (NodeAccum, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Node, Lunar } = AutoPara[CalName]
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const Node50 = Node / 2
    const Node25 = Node / 4
    const NodeAccumHalf = NodeAccum % Node50
    const NodeDif = Node25 - Math.abs(NodeAccumHalf - Node25)
    const Limit = ['Daming', 'Kaihuang'].includes(CalName) ? MoonAvgVDeg * (Lunar - Node) / 2 : Lunar / 2
    let status = 0, Magni = 0
    if (NodeDif * MoonAvgVDeg < Limit) {
        Magni = 15 - NodeDif * MoonAvgVDeg
        const Func = ExMagni(Magni, Type)
        Magni = Func.Magni
        status = Func.status
    }
    return { Magni, status, Node }
}

const EcliLast1 = (CalName, Magni, TotalDeci, AnomaAccum, Denom) => {
    let Last = 0
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        const LastList = [0, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 22, 22] // 月食刻數。最後加一個22，方便程序
        Last = LastList[~~Magni] + (Magni - ~~Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
    } else if (CalName === 'Huangji') {
        // const LastList = [0, 19, 6, 8, 4, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1, 0] // 實在無法理解，暫時案麟德
        const LastList = [0, 1, 2, 3, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 20]
        Last = LastList[~~Magni] + (Magni - ~~Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        const LastList = [0, 1, 2, 3, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 20]
        Last = LastList[~~Magni] + (Magni - ~~Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
        const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AnomaAccum, CalName) // 紀元：食甚加時入轉算外損益率。應朒者依其損益，應朏者益減損加其副
        Last *= 1 + MoonTcorrDif / TheDenom / Denom // 舊唐「以乘所入變增減率，總法而一，應速：增損減加，應遲：依其增減副」
    }
    let Portion = 0.5
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        Portion = 0.6
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        Portion = 0.4
    }
    const StartDeci = TotalDeci - Portion * Last / 100
    const EndDeci = TotalDeci + (1 - Portion) * Last / 100
    return { StartDeci, EndDeci }
}

// 春夏秋冬各三月，那麼閏月怎麼辦呢，所以輸入的時候應該用day的noleapmon，閏月還是上一個月
const Eclipse2 = (NodeAccum, AnomaAccum, TotalDeci, WinsolsDifRaw, isNewm, CalName, i, Leap) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Node, Lunar, Anoma, Solar, Denom, NodeDenom } = AutoPara[CalName]
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const Node50 = Node / 2
    const Node25 = Node / 4
    const Node75 = Node * 0.75
    const Anoma75 = Anoma * 0.75
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const Solar75 = Solar * 0.75
    const WinsolsDif = WinsolsDifRaw % Solar
    const HalfTermLeng = Solar / 24
    let SunLimitYang = HalfSynodicNodeDif // 單位是時間而非度數！
    const NodeAccumHalf = NodeAccum % Node50
    let NodeDif = Node25 - Math.abs(NodeAccumHalf - Node25)
    const NoonDif = Math.abs(TotalDeci - 0.5)
    const SummsolsDif = Math.abs(WinsolsDif - Solar50)
    const isYin = NodeAccum > Node50
    const isBefore = NodeAccumHalf > Node25 // 交後，在交點之後    
    const isFast = AnomaAccum < Anoma / 2 // AnomaAccum > Anoma * 0.25 && AnomaAccum <= Anoma75    
    let status = 0, Tcorr = 0, Tcorr1 = 0, Tcorr2 = 0 // 食甚時刻修正一 // 日食食甚時刻修正二
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName) && isNewm) {
        //  下戊寅食甚時刻修正（大業月食食甚無修正）。當然要先算出是否食，再來修正。戊寅時法6503：半日法，時餘：不足半辰的日分數的12倍。離交點越遠，修正值越大
        if (CalName === 'Daye') {
            if (i <= 3 && NodeDif >= 7 / 12) {
                Tcorr1 = 24 / Denom
            } else if (i >= 7 && i <= 9) {
                if (NodeDif >= 8 / 12 && NodeDif < 1) {
                    Tcorr1 = 24 / Denom
                } else if (NodeDif >= 1) {
                    Tcorr1 = 48 / Denom
                }
            }
        } else { // 「初命子半以一算，自後皆以二算爲一辰」也就是說初唐開始已經用子半了。
            if (AnomaAccum < 7 || (AnomaAccum >= 21 && AnomaAccum < 27)) {
                Tcorr1 = -(isNewm ? 300 : 280) / Denom // 分母應該是日法。日食爲300月食爲280
            } else if ((AnomaAccum >= 7 && AnomaAccum < 13) || (AnomaAccum >= 14 && AnomaAccum < 21)) {
                Tcorr1 = (isNewm ? 300 : 280) / Denom
            } else if (AnomaAccum >= 13 && AnomaAccum < 14) {
                Tcorr1 = 550 / Denom
            } else if (AnomaAccum >= 27) {
                Tcorr1 = -550 / Denom
            }
            if (isNewm && isYin) { // 日食内道                
                const sign = !isFast ? -1 : 1
                if (i <= 3 && NodeDif >= 1 / 3) {
                    Tcorr2 = sign * 280 / Denom
                } else if (i <= 6) {
                    Tcorr2 = sign * 280 / Denom
                } else if (i <= 9 && NodeDif >= 11 / 12 && sign > 1) {
                    Tcorr2 = 550 / Denom
                } else if (i <= 9 && NodeDif < 11 / 12 && sign > 1) {
                    Tcorr2 = 280 / Denom
                } else if (i <= 12 && NodeDif <= 5 / 12 && sign > 1) {
                    Tcorr2 = 280 / Denom
                }
            }
        }
        // 差率QuarDif
        TotalDeci += Tcorr1 + Tcorr2 // 這一步很奇怪，我猜的
        const QuarDif = 0.125 - Math.abs(TotalDeci % 0.25 - 0.125)
        let Tcorr3 = NodeDif // 修正三
        if (NodeDif <= 1 / 4) {
            Tcorr3 = 1 / 4 + NodeDif
        } else if (NodeDif <= 1 / 2) {
            Tcorr3 = 1 / 6 + NodeDif
        } else if (NodeDif <= 3 / 4) {
            Tcorr3 = 1 / 12 + NodeDif
        } else if (NodeDif <= 1) { } else {
            Tcorr3 = 1 - NodeDif
        }
        Tcorr = -Tcorr3 * QuarDif / (14 / 12) // 時差
        if (TotalDeci <= 1 / 4 || (TotalDeci > 1 / 2 && TotalDeci <= 3 / 4)) {
            Tcorr = -Tcorr
        }
        TotalDeci += Tcorr // 戊寅時差極值2.57小時=0.107
    } else if (Type === 6 && isNewm) { // 麟德月食食甚時刻卽定望。
        const QuarDif = 0.125 - Math.abs(TotalDeci % 0.25 - 0.125)
        const sign2 = (TotalDeci > 0.25 && TotalDeci < 0.5) || TotalDeci > 0.75 ? 1 : -1
        if (isYin) { // 月在內道
            let Dif = QuarDif * (10 + NodeDif * 12) / 42 // 差
            Tcorr = Dif
            let sign1 = -1
            if (TotalDeci >= 0.5) {
                sign1 = 1
            }
            if (WinsolsDif < HalfTermLeng * 5) { } else if (WinsolsDif < HalfTermLeng * 7) { } else if (WinsolsDif < HalfTermLeng * 17) { //若用定氣，有2986 / 1340的盈縮積，但肯定應該是平氣。                
                const k = ~~(SummsolsDif / HalfTermLeng) // 距離夏至節氣數。皇極是距寒露驚蟄氣數。這樣完全相反，到底是那個
                Tcorr = sign1 * (2 * k + NodeDif * 4) / 100 + Dif // 劉洪濤的理解和《中國古代曆法》不一樣，我暫且用劉洪濤的
            } else if (WinsolsDif < HalfTermLeng * 19) { } else {
                const k = ~~((WinsolsDif % Solar) / HalfTermLeng) // 距離冬至節氣數
                Tcorr = -sign1 * (2 * k + NodeDif * 4) / 100 + Dif
            }
            TotalDeci += sign2 * Tcorr
        } else {
            Tcorr = QuarDif * NodeDif * 2 / 7 // 去交時是以時辰爲單位，卽1日12辰
            TotalDeci -= -sign2 * Tcorr
        }
    }
    if (isNewm) {
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) { // 《劉洪濤》頁458。最後有個條件是五星伏見，目前沒辦法加上去，還有個條件不懂什麼意思。戊寅見舊唐志一
            if (isYin) {
                if (NoonDif <= 0.125 && (i === 5 || i === 6)) {
                    SunLimitYang = 13 / 12
                } else if (WinsolsDif >= HalfTermLeng * 4 && WinsolsDif <= HalfTermLeng * 8 && TotalDeci > 7 / 12) { // 春分前後。大業驚蟄和雨水順序跟現在對調。加時在未以西，只能假設是以午對稱。
                    SunLimitYang = 13 / 12
                } else if (WinsolsDif >= HalfTermLeng * 16 && WinsolsDif <= HalfTermLeng * 20 && TotalDeci < 5 / 12) {
                    SunLimitYang = 13 / 12
                }
            } else {
                SunLimitYang = 1 / 12 // 去交一時。大約1.114度
                if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= 1 || Math.abs(HalfTermLeng * 6 - WinsolsDif) <= 1 || Math.abs(HalfTermLeng * 18 - WinsolsDif) <= 1) {
                    SunLimitYang = 0.5
                } else if (i >= 4 && i <= 6 && NoonDif <= 1.5 / 12) {
                    SunLimitYang = 1 / 6 // 去交二時
                } else if (Math.abs(HalfTermLeng * 6 - WinsolsDif) <= 3 || Math.abs(HalfTermLeng * 18 - WinsolsDif) <= 3) {
                    SunLimitYang = 1 / 6
                } else if (isBefore) { // 先交
                    SunLimitYang = 1 / 6
                } else if (!isBefore && !isFast) { // 這兩條我處理成「後交値縮，二時內亦食」
                    SunLimitYang = 1 / 6
                } else if (isBefore && isFast) {
                    SunLimitYang = 1 / 6
                }
            }
        } else if (CalName === 'Huangji') {
            if (isYin) { // 在陰曆應食不食《中國古代曆法》頁531:黃道南食限小於黃道北，因爲月在黃道北，視去交小於計算去交
                if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= 10 && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimitYang = 12.25 / 12
                } else if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= 20 && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimitYang = 12.5 / 12
                } else if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= 20 && NoonDif < 1 / 6 && NoonDif >= 0.125) {
                    SunLimitYang = 13 / 12
                } else if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= Lunar && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimitYang = 12.75 / 12
                } else if ((i === 6 || (Leap === 4 && i === Leap)) && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimitYang = 13 / 12
                } else if ((i === 6 || (Leap === 4 && i === Leap)) && NoonDif >= 0.125 && NoonDif < 1 / 6) {
                    SunLimitYang = 13.5 / 12
                } else if (WinsolsDif >= HalfTermLeng * 8 && WinsolsDif <= HalfTermLeng * 16 && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimitYang = 13.5 / 12
                } else if (WinsolsDif >= HalfTermLeng * 7 && WinsolsDif <= HalfTermLeng * 17 && NoonDif < 1 / 12 && NoonDif >= 1 / 24) {
                    SunLimitYang = 13.5 / 12
                } else if (WinsolsDif >= HalfTermLeng * 6 && WinsolsDif <= HalfTermLeng * 18 && NoonDif < 1 / 24) {
                    SunLimitYang = 13.5 / 12
                }
            } else {
                if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= Lunar && NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    SunLimitYang = 1 / 6
                } else if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= Lunar && NoonDif >= 1 / 12 && NoonDif < 0.125) {
                    SunLimitYang = 1.5 / 12
                } else if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= 46 && NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    SunLimitYang = 1.5 / 12
                } else if (Math.abs(HalfTermLeng * 12 - WinsolsDif) <= 46 && NoonDif >= 1 / 12 && NoonDif < 0.125) {
                    SunLimitYang = 1 / 12
                } else if (WinsolsDif >= HalfTermLeng * 8 && WinsolsDif <= HalfTermLeng * 16 && NoonDif < 1.25 / 12 && NoonDif >= 1 / 12) {
                    SunLimitYang = 0.5 / 12
                } else if (WinsolsDif >= HalfTermLeng * 7 && WinsolsDif <= HalfTermLeng * 17 && NoonDif < 1 / 12 && NoonDif >= 1 / 24) {
                    SunLimitYang = 0.5 / 12
                } else if (WinsolsDif >= HalfTermLeng * 6 && WinsolsDif <= HalfTermLeng * 18 && NoonDif < 1 / 24) {
                    SunLimitYang = 0.5 / 12
                }
            }
        } else if (['LindeA', 'LindeB'].includes(CalName)) {
            if (isYin && WinsolsDif >= Solar / 4 && WinsolsDif <= Solar75) { // 秋分至春分殘缺
                if (NoonDif > 0.18 - 0.137 * SummsolsDif / Solar25) {
                    SunLimitYang = 1373 / Denom + (137 / Denom) * SummsolsDif / Solar25
                }
            } else if (NodeAccum < Node50) { // 不應食而食有三組情況，滿足一組即可
                if (WinsolsDif >= Solar / 4 && WinsolsDif <= Solar75) {
                    if (NoonDif <= 0.07) {
                        SunLimitYang = 248 / Denom - (182.6 / Denom) * SummsolsDif / Solar25
                    } else if (NoonDif < 0.1744 - 0.1014 * SummsolsDif / Solar25) {
                        SunLimitYang = 60 / Denom
                    } else if (NoonDif < 0.1044 - 0.1014 * SummsolsDif / Solar25) {
                        SunLimitYang = 60 / Denom + (1644 / Denom) * SummsolsDif / Solar25
                    }
                } else if (NoonDif <= 0.12) {
                    SunLimitYang = 60 / Denom
                }
            }
        }
    }
    if (isNewm) {
        status = NodeDif <= SunLimitYang ? 2 : 0
    } else {
        status = NodeDif <= HalfSynodicNodeDif ? 2 : 0
    }
    let Magni = 0, Mcorr = 0
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        if (isNewm) {
            let Tcorr4 = 184000
            if (CalName === 'Daye') {
                if (WinsolsDif < 4 * HalfTermLeng) { } else if (WinsolsDif < Solar50) {
                    Tcorr4 = 184000 * (Solar50 - WinsolsDif) * 1500 // 1511.314
                } else if (WinsolsDif < Solar75) {
                    Tcorr4 = 184000 * (WinsolsDif - Solar50) * 2000 // 2015.08
                }
            } else {
                Tcorr4 = 220800
                if (WinsolsDif < 4 * HalfTermLeng) { } else if (WinsolsDif < Solar50) {
                    Tcorr4 = 220800 * (Solar50 - WinsolsDif) * 1810 // 1813.577
                } else if (WinsolsDif < Solar75) {
                    Tcorr4 = (WinsolsDif - Solar50) * 2400 // 2418.1
                }
            }
            Tcorr4 /= NodeDenom
            let sign4 = 0
            if (WinsolsDif >= 2 * HalfTermLeng && WinsolsDif < 10 * HalfTermLeng && NodeDif > 5 / 12 && (isYin && !isBefore)) { // 去後交五時外
                sign4 = -1
                // if (isBefore) { // 交前 按照劉洪濤頁462的意思，他說的交前交後跟我這相反，到底那種是對的呢？不過這裏符號還是跟他一樣。劉洪濤和藤豔輝對術文理解不一，劉洪濤認爲後面的「時差減者，先交減之，後交加之」一句用來描述前面的「皆去不食餘一時」，藤認爲後面和前面是分開的，前面的一時符號都是-。感覺藤的說法可靠一些。
                //     if ((TotalDeci >= 1 / 4 && TotalDeci < 1 / 2) || (TotalDeci >= 3 / 4)) {
                //         sign4 = 1
                //     }
                // } else if (TotalDeci <= 1 / 4 || (TotalDeci > 1 / 2 && TotalDeci <= 3 / 4)) {
                //     sign4 = 1
                // }
            }
            const TheNotEcli = Math.abs(NodeDif + sign4 / 12 - Tcorr4) // 不食餘，取絕對值
            Magni = 15 - (TheNotEcli + Tcorr) * MoonAvgVDeg
        } else {
            if (CalName === 'Daye') {
                if ((i >= 1 && i <= 3 && !isBefore) || (i >= 7 && i <= 9 && isBefore) || (i >= 10 && !isBefore)) {
                    Magni = 15 - (NodeDif - 1 / 12) * MoonAvgVDeg
                } else {
                    Magni = 15 - NodeDif * MoonAvgVDeg // 這種情況與正光全同。
                }
            } else {
                if ((i >= 1 && i <= 3 && isBefore) || (i >= 7 && i <= 9 && !isBefore)) { // 春先交，秋後交
                    Magni = 15 - (NodeDif - 1 / 24) * MoonAvgVDeg
                } else if ((i >= 1 && i <= 3 && !isBefore) || (i >= 7 && i <= 9 && isBefore) || i >= 10) { // 春後交，秋先交
                    Magni = 15 - (NodeDif - 1 / 6) * MoonAvgVDeg
                } else {
                    Magni = 15 - NodeDif * MoonAvgVDeg // 這種情況與正光全同。
                }
            }
        }
    } else if (CalName === 'Huangji') {
        if (isNewm) {
            let M = 0
            if (SummsolsDif < 2 * HalfTermLeng) { // 朔在夏至前後二氣
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 1.75 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = Denom * 1.25 / 12
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = Denom * 0.75 / 12
                }
            } else if (SummsolsDif < 3 * HalfTermLeng) { // 朔在夏至前後三氣
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 1.25 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = Denom * 0.75 / 12
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = Denom * 0.25 / 12
                }
            } else if (SummsolsDif < 4 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 0.75 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = Denom * 0.25 / 12
                }
            } else if (SummsolsDif < 5 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 0.25 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) { } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -10.1
                }
            } else if (SummsolsDif < 6 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) { } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -10.1
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -15.2
                }
            } else if (SummsolsDif < 7 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -10.1
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -15.2
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -53.3
                }
            } else if (SummsolsDif < 8 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -15.2
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -53.3
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -60.9
                }
            } else if (SummsolsDif < 9 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -53.3
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -60.9
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -65.9
                }
            } else if (SummsolsDif < 10 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -60.9
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -65.9
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -71
                }
            } else if (SummsolsDif < 11 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -65.9
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -71
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -76.1
                }
            } else {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -71
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -76.1
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -81.2
                }
            }
            Mcorr = M / 96
            Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif - Mcorr
        } else {
            // const MoonMcorrList = [48, 43, 38, 33, 28, 23, 18, 15, 12, 9, 6, 3, 0, 13, 14, 15, 16, 17, 18, 21, 24, 27, 30, 33, 48]
            // Mcorr = -(MoonMcorrList[TermNum] + (MoonMcorrList[TermNum + 1] - MoonMcorrList[TermNum]) * TermNewmDif / HalfTermLeng) / 96
            // Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif + Mcorr 
            // 「以減望差，乃如月食法」
            if ((WinsolsDif > Solar25 && WinsolsDif < Solar50) || WinsolsDif > Solar75) {
                Mcorr = 15 * (3 * ~~(SummsolsDif / HalfTermLeng) + 2 * (10 + NodeDif * 12)) / HalfSynodicNodeDif
            } else {
                Mcorr = 15 * (3 * ~~(SummsolsDif / HalfTermLeng) + 2 * (10 + NodeDif * 12) + 2 * ~~(Solar25 - WinsolsDif % Solar50)) / HalfSynodicNodeDif
            }
            Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif + Mcorr / Denom
        }
    } else if (['LindeA', 'LindeB'].includes(CalName)) { // 下麟德求食分。NodeDif去交前後定分。558、552的不同，《中國古代曆法》頁82說要統一爲552，不過如果用定氣思路來看，興許不用改。
        if (isNewm) {
            if (isYin) { // 月在內道
                if (WinsolsDif < Solar25) {
                    Mcorr = 552 // 食差
                } else if (WinsolsDif <= Solar50) {
                    Mcorr = 552 * (Solar50 - WinsolsDif) / Solar25
                } else if (WinsolsDif <= Solar50 + Solar25) {
                    Mcorr = 552 * (WinsolsDif - Solar50) / Solar25
                } else {
                    Mcorr = 552
                }
            } else { // 月在外道
                if (WinsolsDif < Solar25) {
                    Mcorr = 552 * WinsolsDif / Solar25
                } else if (WinsolsDif <= Solar50 + Solar25) {
                    Mcorr = 552
                } else {
                    Mcorr = 552 * (Solar - WinsolsDif) / Solar25
                }
            }
            Mcorr /= Denom
            const signTheNotEcli = isYin ? -1 : 1
            const TheNotEcli = Math.abs(NodeDif + signTheNotEcli * Mcorr)
            Magni = 15 - TheNotEcli / (104 / Denom - Mcorr / 15)
        } else {
            if (i >= 1 && i <= 3) {
                if (isBefore) { // 交前
                    Mcorr = 200
                } else {
                    Mcorr = 100
                }
            } else if (i >= 4 && i <= 6) {
                Mcorr = 54
            } else if (i >= 7 && i <= 9) {
                if (isBefore) { // 交前
                    Mcorr = 100
                } else {
                    Mcorr = 200
                }
            } else if (i >= 10 && i <= 12) {
                Mcorr = 224
            }
            Mcorr /= Denom
            NodeDif -= Mcorr
            Magni = (HalfSynodicNodeDif - NodeDif) / (104 / Denom) // 準確的是103.554111
        }
    }
    if (NodeDif < 0) {
        Magni = 15
        status = 1 // 不足減者，食旣    
    }
    const MagniFunc = ExMagni(Magni, Type, CalName, isNewm)
    Magni = MagniFunc.Magni
    status = MagniFunc.status
    const { StartDeci, EndDeci } = EcliLast1(CalName, Magni, TotalDeci, AnomaAccum, Denom)
    return { Magni, status, StartDeci, TotalDeci, EndDeci, }
}
// console.log(Eclipse2(14.7, 24, 0.3, 15, 2, 0, 1, 'Huangji').TotalDeci)

const EcliTcorr = (isNewm, isYin, CalName, Type, Denom, Solar25, Solar75, NewmNoonDif, NewmNoonDifAbs, Rise, RiseNoonDif, AvgTotalDeci, AvgTotalNoonDif, AcrDeci, AvgDeci, AvgMoonTcorr, MoonAcrV, SunTcorr, NodeDif, AcrWinsolsDif) => {
    let Tcorr = 0
    const isSunYin = AcrWinsolsDif > Solar25 && AcrWinsolsDif < Solar75
    if (['Dayan', 'Wuji', 'Tsrengyuan'].includes(CalName)) { // 大衍日月食的時差一樣的
        Tcorr = NodeDif * AutoNodePortion(CalName) / 20 / Denom // 同名（同在表）相加，異名（同在裏）相減。頁540算例方向跟這不一樣            
        if ((!isYin && isSunYin) || (isYin && !isSunYin)) { // 日在赤道北
            Tcorr = -Tcorr
        }
    }
    if (isNewm) {
        if (CalName === 'Xuanming') { // 「以定朔日出入辰刻距午正刻數，約百四十七，為時差。視定朔小餘如半法已下，以減半法，為初率；已上，減去半法，餘為末率。以乘時差，如刻法而一，初率以減，末率倍之，以加定朔小餘，為蝕定餘。月蝕，以定望小餘為蝕定餘。」夏至最大，冬至最小，夜半最大，午正最小。但實際上是夏至最小，冬至最大。午前- 午後+。《數理》頁421: 定朔0.25，1個小時，0.75：2小時。
            Tcorr = NewmNoonDif * RiseNoonDif / 1.47
            Tcorr *= AcrDeci >= 0.5 ? 2 : 1
        } else if (CalName === 'Qintian') {
            Tcorr = NewmNoonDif * 1100 / Denom
        } else if (CalName === 'Yingtian') { // 以午前後分「乘三百，如半晝分而一，為差；〔午後加之，午前半而減之〕。加減定朔分，為食定餘；以差皆加午前、後分，為距中分。其望定分，便為食定餘」
            Tcorr = (150 / Denom) * NewmNoonDif / RiseNoonDif
            Tcorr *= AcrDeci >= 0.5 ? 2 : 1
        } else if (CalName === 'Qianyuan') { // 「以半晝刻約刻法為時差，乃視定朔小餘，在半法以下為用減半法為午前分；以上者去之，為午後分；以時差乘，五因之，如刻法而一，午前減，午後加」
            Tcorr = NewmNoonDif * RiseNoonDif
        } else if (CalName === 'Yitian') { // 「以其日晝刻，其（瀚案：根據宣明，應該指的是約）三百五十四為時差，乃視食甚餘，如半法以下，返減半法，餘為初率；半法以上者，半法去之，餘為末率；滿一百一收之，為初率；以減末率，倍之，以加食甚餘，為食定餘；亦加減初、末率，為距午退分」儀天有點殘破，應該根據宣明來補，這兩個比例差不多
            Tcorr = NewmNoonDif * RiseNoonDif / (1.77 * 84 / 101)
            Tcorr *= AcrDeci >= 0.5 ? 2 : 1
        } else if (['Chongxuan', 'Chongtian', 'Guantian'].includes(CalName)) { // 「定朔約餘距午前後分，與五千先相減後相乘，三萬除之；午前以減，午後倍之，以加約餘」崇天「午後以一萬三千八百八十五除之」，應該改成一萬五千八百八十五
            Tcorr = -NewmNoonDifAbs * (0.5 - NewmNoonDifAbs) / 3 // 午前，0-0.5<0, f(0.25)=-0.0208
            Tcorr *= AcrDeci >= 0.5 ? -2 : 1
        } else if (Type === 9) {
            Tcorr = -AvgTotalNoonDif * (0.5 - AvgTotalNoonDif) / 1.5
            Tcorr *= AvgTotalDeci >= 0.5 ? -1.5 : 1
        } else if (Type === 10) {
            Tcorr = -2 * AvgTotalNoonDif * (0.5 - AvgTotalNoonDif)
            Tcorr *= AvgTotalDeci >= 0.5 ? -1 : 1
        } else if (Type === 11) {
            Tcorr = -NewmNoonDifAbs * (0.5 - NewmNoonDifAbs) / 0.96 //「在中前爲減，中後爲加」。「退二位」。最大值一個半小時左右《中國古代的日食時差算法》
            Tcorr *= AcrDeci >= 0.5 ? -1 : 1
        }
    } else {
        if (CalName === 'Qintian') {
            Tcorr = (1 - Math.abs(Rise - 0.25) * Denom / 313) * 245 / Denom
        } else if (Type === 9 || Type === 10) {
            const AvgTotalDeciHalfRev = 0.25 - Math.abs(AvgTotalDeci % 0.5 - 0.25)// 庚午卯酉前後分，距離0、0.5、1的値
            if (Type === 9) {
                if (AvgTotalDeci > 0.5) {
                    Tcorr = -(AvgTotalDeciHalfRev ** 2) / 30000
                } else if (AvgTotalDeci < (2 / 3) * Rise) { // 「如泛餘不滿半法，在日出分三分之二已下，列於上位，已上者，用減日出分，餘倍之，亦列於上位，乃四因三約日出分，列之於下，以上減下，餘以乘上，如一萬五千而一，所得，以加泛餘，為食甚定餘。」涉及正負，不好辦，只能暫時加個絕對值
                    Tcorr = ((4 / 3) * Rise - AvgTotalDeci) * AvgTotalDeci / 15000
                } else {
                    const tmp = Math.abs(2 * (Rise - AvgTotalDeci))
                    Tcorr = Math.abs(((4 / 3) * Rise - tmp) * tmp / 15000)
                }
                Tcorr *= Denom
            } else {
                Tcorr = AvgTotalDeciHalfRev ** 2 * 0.4 // 四因退位            
                Tcorr *= AvgTotalDeci > 0.5 ? -1 : 1
            }
        } else if (['ShoushiOld', 'Shoushi', 'ShoushiOld1', 'Shoushi1'].includes(CalName)) { // 大統取消授時的月食時差改正
            const AcrDeciHalfRev = 0.25 - Math.abs(AcrDeci % 0.5 - 0.25)
            Tcorr = AcrDeciHalfRev ** 2 / 4.78
            Tcorr *= AcrDeci > 0.5 ? -1 : 1 // 子前以減            
        }
    }
    let TotalDeci = 0 // 食甚定餘
    if (CalName === 'Qintian' && isNewm) {
        TotalDeci = AcrDeci < 0.5 ? 0.5 + Tcorr : AcrDeci + Tcorr
    } else if (CalName === 'Mingtian') { // 明天沒有時差，《數理》頁424
        TotalDeci = (AvgDeci + AvgMoonTcorr) * 13.37 / MoonAcrV + SunTcorr
    } else if (Type === 9 || Type === 10) {
        TotalDeci = AvgTotalDeci + Tcorr
    } else {
        TotalDeci = AcrDeci + Tcorr
    }
    const TotalDeciEx1 = TotalDeci // 這個是沒化到一日之內的食甚時刻
    TotalDeci = (TotalDeci + 1) % 1
    let TheTotalNoonDif = 0
    if (CalName === 'Qintian') {
        TheTotalNoonDif = NewmNoonDifAbs
    } else if (['Xuanming', 'Mingtian', 'Guantian'].includes(CalName) || Type === 9 || Type === 10) {
        TheTotalNoonDif = Math.abs(TotalDeci - 0.5) // 觀天紀元午前後分
    } else { // 包括授時。大統「但加不減」
        TheTotalNoonDif = NewmNoonDifAbs + Math.abs(Tcorr) // 距午分，崇天午前後定分
    }
    const dd = 1 - TheTotalNoonDif / RiseNoonDif // 如果k<0，卽TheTotalNoonDif在日出前日落後，符號相反，所以把原來的Math.abs(dd)直接改成dd
    return { Tcorr, TotalDeci, TotalDeciEx1, TheTotalNoonDif, dd }
}

const EcliMcorr = (CalName, Type, HalfTermLeng, Node25, Node50, Sidereal25, Sidereal50, Sidereal, Solar125, Solar25, Solar375, Solar50, Solar75, Solar875, Solar, NodeCycle25, NodeCycle50, MoonLimit1, Denom, AcrTermList,
    isNewm, isYin, isDescend, AcrWinsolsDif, AvgWinsolsDif, dd, TotalDeci, TotalDeciEx1, TheTotalNoonDif, RiseNoonDif, AcrNodeAccum, AvgNodeAccum, AvgNodeAccumCorr, AcrNewmNodeAccum, AvgDeci, Tcorr, OriginAccum) => {
    let TheWinsolsDif = 0
    if (CalName === 'Chongxuan') { // 「距天正中氣積度」
        TheWinsolsDif = AvgWinsolsDif + AutoDifAccum(0, AvgWinsolsDif, CalName).SunDifAccum
    } else if (Type === 7 || ['Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].includes(CalName)) {
        TheWinsolsDif = AcrWinsolsDif
    } else if (CalName === 'Mingtian' || (Type >= 9 && Type <= 11)) {
        TheWinsolsDif = AvgWinsolsDif + TotalDeciEx1 - AvgDeci
        TheWinsolsDif += AutoDifAccum(0, TheWinsolsDif, CalName).SunDifAccum // 紀元食甚日行積度
    }
    let TheWinsolsDifHalf = TheWinsolsDif % Solar50 // 應天「置朔定積，如一百八十二日⋯⋯以下爲入盈日分；以上者去之，餘爲入縮日分」
    const TheWinsolsDifHalfRev = Solar25 - Math.abs(TheWinsolsDifHalf - Solar25) // 反減
    const isSunYin = TheWinsolsDif > Solar25 && TheWinsolsDif < Solar75
    // 宣明曆創日食三差：【時差Tcorr】食甚時刻改正【氣差McorrTerm刻差McorrClock加差McorrOther】食分改正 
    let Mcorr = 0, YinYangBorder = 0
    let isInside = true, Std1 = 0, Std2 = 0, statusRaw = 0 // 這五個是崇玄的
    let TheNodeAccum = 0, TheNodeDif = 0 // 入交定日
    if (['Dayan', 'Wuji', 'Tsrengyuan'].includes(CalName)) { // 這裡的去交分是給幾部唐曆用的。宋曆在最後算加上了食差的去交分
        TheNodeAccum = AcrNodeAccum
        TheNodeDif = Denom * (Node25 - Math.abs(AcrNodeAccum % Node50 - Node25))
    } else if (CalName === 'Chongxuan') {
        TheNodeAccum = AcrNodeAccum * 401 / 30
        TheNodeDif = 100 * (NodeCycle25 - Math.abs(TheNodeAccum % NodeCycle50 - NodeCycle25))
    }
    const TheNodeAccumHalf = TheNodeAccum % Node50
    let McorrA = 0, McorrB = 0 // 這兩個大衍、五紀、欽天的
    if (isNewm) {
        let sign1 = 1, sign2 = 1, sign3 = 1
        let sign1b = 1, sign2b = 1 // 明天南北差 // 明天東西差
        if (CalName === 'Mingtian') {
            sign1b = isYin ? -1 : 1
            sign2b = isYin ? -1 : 1
            sign1b = TheTotalNoonDif >= 0.25 ? -sign1b : sign1b
            sign2b = TotalDeci >= 0.5 ? -sign2b : sign2b
            sign1b = isSunYin ? -sign1b : sign1b
            sign2b = isSunYin ? -sign2b : sign2b
        } else {
            if (['Xuanming', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName) || Type === 10) {
                sign1 = isYin ? -1 : 1
            } else {
                sign1 = isDescend ? 1 : -1
            }
            sign1 *= isSunYin ? -1 : 1
            if (['Xuanming', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName) || Type === 10) {
                sign2 = isYin ? -1 : 1
            } else {
                sign2 = isDescend ? 1 : -1
            }
            sign2 *= TotalDeci >= 0.5 ? -1 : 1 // 定朔還是食甚都沒影響，因為時差加減方向是相合的
            sign2 *= TheWinsolsDif >= Solar50 ? -1 : 1
            if (TotalDeci > 0.5) {
                sign3 = isYin ? -1 : 1
            } else {
                sign3 = 0
            }
        }
        let McorrTerm = 0, McorrClock = 0, McorrOther = 0
        let Mcorr0 = 0 // 這個是紀元、授時的。視白道比眞白道低，所以陽曆：視月亮距交大於眞月亮，陰曆：小於        
        if (CalName === 'Dayan') {
            let TermNum = 0
            const McorrBList = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 385, 325, 270, 220, 175, 135, 100, 70, 45, 25, 10, 0, 10]
            for (let j = 0; j <= 23; j++) {
                if (TheWinsolsDif >= AcrTermList[j] && TheWinsolsDif < AcrTermList[j + 1]) {
                    TermNum = j % 24
                    break
                }
            }
            const Initial = AcrTermList[TermNum] + ',' + McorrBList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + McorrBList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + McorrBList[TermNum + 2]
            McorrB = Interpolate3(TheWinsolsDif, Initial) // 當日差積                
            McorrB *= isYin ? -1 : 1
            YinYangBorder = 1275 + McorrB // 食定差=冬至食差「陰曆蝕差」+LimitCorr  
        } else if (CalName === 'Qintian') {
            const WinsolsDeci = OriginAccum - Math.floor(OriginAccum)
            const Lati = Math.abs(AutoLongi2Lati(TheWinsolsDif, WinsolsDeci, 'Chongxuan').Lati)
            McorrA = MoonLimit1 * Lati * Denom / 251300 // 黃道出入食差
            YinYangBorder = McorrA * dd
            YinYangBorder = MoonLimit1 + (isYin ? -1 : 1) * YinYangBorder // 假設lati的單位是經法72，那麼常準在430-2322
            const tmp = Math.abs(AvgWinsolsDif % Solar25 - Solar125) * 24 // 「置日躔入曆⋯⋯」那就是經朔距冬至日，定朔距冬至日叫「定朔加時入曆」
            const signtmp = AvgWinsolsDif % Solar50 < Solar125 || AvgWinsolsDif % Solar50 >= Solar * 0.375 ? -1 : 1
            McorrB = 2772 + signtmp * tmp // 黃道斜正食差。範圍1692-3852
            YinYangBorder += McorrB * TheTotalNoonDif / RiseNoonDif
        } else if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            const isBefore = TheNodeAccumHalf > Node25
            const Max = CalName === 'Wuji' ? 457 : 373
            const step = CalName === 'Wuji' ? 5 : 4 // 本來應該是5，夏至不盡，連續5.00486
            if (TheWinsolsDif > Solar25 && TheWinsolsDif < Solar75) {
                McorrB = Max
            } else if (TheWinsolsDif >= Solar75) {
                McorrB = Max - step * (TheWinsolsDif - Solar75)
            } else {
                McorrB = step * TheWinsolsDif
            }
            McorrB = isYin ? Max - McorrB : McorrB // 本來還要再對稱的寫一遍，但是發現這就是陰陽反減，直接把原來的刪掉            
            if (TheWinsolsDif >= Solar * 10 / 24 && TheWinsolsDif < Solar * 14 / 24) {
                if (TotalDeci < 0.5 - 0.08 || TotalDeci > 0.5 + 0.08) {
                    McorrA = -Denom / 12 // 這是加在陰曆、類陽曆上的
                } else if (TotalDeci > 0.5 - 0.03 && TotalDeci < 0.5 + 0.03) {
                    McorrA = Denom / 12
                }
            }
            if (TheWinsolsDif >= Solar * 2 / 24 && TheWinsolsDif < Solar * 10 / 24) {
                if (isBefore && TheNodeDif > Denom * 5 / 12) {
                    McorrA -= Denom / 12
                }
            } else if (TheWinsolsDif >= Solar * 14 / 24 && TheWinsolsDif < Solar * 22 / 24) {
                if (!isBefore && TheNodeDif > Denom * 5 / 12) {
                    McorrA -= Denom / 12
                }
            }
        } else if (CalName === 'Xuanming') {
            McorrTerm = (2350 - 26 * TheWinsolsDifHalfRev) * dd
            McorrTerm = McorrTerm < 0 ? 0 : McorrTerm // 因為26不連續，最後剩了一天<0。連續：25.73618
            if (TheWinsolsDifHalf < Solar125) {
                McorrClock = 2.1 * TheWinsolsDifHalf // 連續的話我改成2.06985
            } else if (TheWinsolsDifHalf < Solar375) {
                McorrClock = 94.5
            } else {
                TheWinsolsDifHalf -= Solar375
                McorrClock = 94.5 - 2.1 * TheWinsolsDifHalf
            }
            McorrClock *= McorrClock < 0 ? 0 : TheTotalNoonDif // 應該不用*100
            if (TotalDeci > 0.5) {
                if (TheWinsolsDif < Solar125) {
                    McorrOther = 51 - TheWinsolsDif * 17 / HalfTermLeng
                } else if (TheWinsolsDif > Solar875) {
                    McorrOther = (TheWinsolsDif - Solar875) * 17 / HalfTermLeng
                }
            }
        } else if (CalName === 'Chongxuan') {
            const C = (365.5 - TheWinsolsDif) / 0.3655 // 限心
            const L = (C - 250 + 1000) % 1000 // 限尾。「滿若不足，加減一千」
            const R = (C + 250 + 1000) % 1000 // 限首            
            TotalDeci *= 1000
            const ExPart = Math.min(Math.abs(TotalDeci - R), Math.abs(TotalDeci - L)) // 限內外分，應該是在0-250之間            
            isInside = TotalDeci > Math.min(L, R) && TotalDeci < Math.max(L, R)
            isInside = L > R ? !isInside : isInside
            let McorrYin = 0, McorrYang = 0
            if (isInside) { // 內
                McorrYin = 630 - ExPart ** 2 / 179 // 陰曆蝕差 +-335.812以內爲正，極值630
                McorrYang = (500 - ExPart) * ExPart / 313.5 // 陽曆蝕差，極值f(250)=199.362
                Std1 = McorrYin + McorrYang // 既前法，f(0)=613, f(90.863)=685.458, f(250)=463.2
                //「以陽曆蝕差加陰曆蝕差，為既前法。以減千四百八十，餘為既後法」不知道是用既前法減1480還是用陽曆差減。以限外的880來看，應該是前者
                Std2 = 1480 - Std1 // f(0)=867, f(90.863)=794.542, f(250)=1016.8
                // Std2 = 1480 - McorrClock // f(0)=1480, 極小值 f(250)=1280.638          
            } else { // 外
                McorrYin = (500 - ExPart) * ExPart / 446 // 0-500爲正，極值140.135
                Std1 = 610
                Std2 = 880
            }
            TotalDeci /= 1000
            statusRaw = 3
            if (isInside) {
                if (isYin) {
                    TheNodeDif += McorrYang
                } else {
                    TheNodeDif = McorrYang - TheNodeDif
                    statusRaw *= TheNodeDif < 0 ? 0 : 1
                }
            } else {
                if (isYin) {
                    TheNodeDif -= McorrYin // 這樣加減之後就是「去交定分」
                    statusRaw *= TheNodeDif < 0 ? 0 : 1
                } else {
                    statusRaw = 0
                }
            }
        } else if (CalName === 'Yingtian') {
            McorrTerm = (374 - 4 * TheWinsolsDifHalfRev) * dd // 藤豔輝頁101：最大值52.41分鐘
            if (TheWinsolsDifHalf > 45 && TheWinsolsDifHalf < 137) { // 最大值0.075日
                McorrClock = 1500 * TheTotalNoonDif
            } else {
                if (TheWinsolsDifHalf < 45) {
                    TheWinsolsDifHalf = 45 - TheWinsolsDifHalf
                    McorrClock = 33.5 * TheWinsolsDifHalf * TheTotalNoonDif
                } else {
                    TheWinsolsDifHalf -= 137
                    McorrClock = (1500 - 33.5 * TheWinsolsDifHalf) * TheTotalNoonDif
                }
            }
        } else if (CalName === 'Qianyuan') {
            if (TheWinsolsDifHalf < 90) {
                McorrTerm = 9.1 * TheWinsolsDifHalf
            } else {
                TheWinsolsDifHalf -= 90
                McorrTerm = (819 - 9.1 * TheWinsolsDifHalf)  // 《中國古代曆法》頁96說二至前是二至後的10倍，寫錯了吧？ // 藤豔輝頁101說乾元刻差極值15.2小時，沒對吧
            }
            McorrTerm *= dd > 0 ? dd : 1
            if (TheWinsolsDifHalf >= 45 && TheWinsolsDifHalf < 137) {
                McorrClock = 333 // 單位是刻分。極值0.11日
            } else {
                if (TheWinsolsDifHalf < 45) {
                    McorrClock = 7.4 * TheWinsolsDifHalf
                } else {
                    TheWinsolsDifHalf -= 137
                    McorrClock = 333 - 7.4 * TheWinsolsDifHalf
                }
            }
            McorrClock *= TheTotalNoonDif
        } else if (CalName === 'Yitian') {
            const { QuarA, QuarB } = AutoQuar(CalName)
            McorrTerm = TheWinsolsDifHalfRev * 2826 / (TheWinsolsDif >= QuarA && TheWinsolsDif < Solar50 + 946785.5 / Denom ? QuarB : QuarA)
            McorrTerm = 2826 - 30.15 * TheWinsolsDifHalfRev
            McorrTerm *= dd > 0 ? dd : 1
            if (TheWinsolsDif < Solar125) {
                McorrClock = 100 * TheWinsolsDif * Denom / 442384 // 藤豔輝頁100說二至前後205日分，其餘13.5小時，這也太扯淡，我這樣處理一下，能夠大致連續，但跟原文差得有點多
            } else if (TheWinsolsDif < Solar375) {
                McorrClock = 113.625
            } else if (TheWinsolsDif < Solar50) {
                TheWinsolsDif -= Solar375
                McorrClock = 164.57 - TheWinsolsDif * Denom / 279858
            } else if (TheWinsolsDif < Solar50 + Solar125) {
                McorrClock = TheWinsolsDifHalf * Denom / 279858
            } else if (TheWinsolsDif < Solar50 + Solar375) {
                McorrClock = 113.625
            } else {
                TheWinsolsDif -= Solar875
                McorrClock = 104.1 - TheWinsolsDif * Denom / 442384
            }
            McorrClock *= TheTotalNoonDif * 10
            if (TotalDeci > 0.5) {
                if (TheWinsolsDif < Solar125) {
                    McorrOther = 61.32 - TheWinsolsDifHalf * 20.44 / HalfTermLeng
                } else if (TheWinsolsDif > Solar875) {
                    TheWinsolsDif -= Solar875
                    McorrOther = TheWinsolsDif * 20.44 / HalfTermLeng
                }
            }
        } else if (CalName === 'Mingtian') { // 藤豔輝頁103 兩個食差最大值均為508分=5.08度=9.12小時 // 明天的日躔盈縮度是平分的，不像儀天是定氣，同樣需要反減
            const QuarA = 60.875 // 交食的盈初縮末
            const QuarB = 121.75 // 縮初盈末
            let TheRev = TheWinsolsDifHalf
            TheRev = TheRev > QuarA ? Solar50 - TheRev : TheRev
            const Portion12 = TheWinsolsDifHalf < QuarA || TheWinsolsDifHalf >= Solar50 + QuarB ? 2 : 1 // 不太明白這樣前後一拉一申有什麼區別
            const tmp = 4 * Math.abs(0.25 - TheTotalNoonDif)
            McorrClock = (106 / 3093) * (243.5 - Portion12 * TheRev) * Portion12 * TheRev // 東西差
            McorrTerm = (508 - McorrClock) * tmp // 南北差
            McorrClock *= 1 - tmp
        } else if (CalName === 'Guantian') {
            if (TheWinsolsDif < Solar50) {
                if (TheWinsolsDifHalf > 88 + 10958 / 12030) {
                    TheWinsolsDifHalf = Solar50 - TheWinsolsDifHalf
                }
            } else if (TheWinsolsDif > Solar50) {
                if (TheWinsolsDifHalf > 93 + 8552 / 12030) {
                    TheWinsolsDifHalf = Solar50 - TheWinsolsDifHalf
                }
            }
            if (TheWinsolsDif < 88 + 10958 / 12030 || TheWinsolsDif > Solar50 + 93 + 8552 / 12030) {
                McorrTerm = (4010 - TheWinsolsDifHalf ** 2 / 1.97) * dd
            } else {
                McorrTerm = (4010 - TheWinsolsDifHalf ** 2 / 2.19) * dd
            }
            McorrClock = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / 2.09
            McorrClock *= TheTotalNoonDif * Denom / 3700.5 // 單位 午前後分
        } else if (Type === 11) {
            McorrTerm = (4.46 - TheWinsolsDifHalfRev ** 2 / 1870) * dd // 南北差。在91.325達到0            
            const McorrClockAvg = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / 1870
            McorrClock = McorrClockAvg * TheTotalNoonDif * 4
            // 「若在泛差以上者，倍泛差減之，餘爲定差」，卽如果定朔在日出前日落後
            McorrClock = McorrClock > McorrClockAvg ? 2 * McorrClockAvg - McorrClock : McorrClock
        } else {
            const Portion = +(3.43 * 7290 / Denom).toFixed(2) // 3*Solar25**2 ，以紀元爲準。紀元3.43，崇天2.36，大明庚午4.78
            const McorrTermMax = Math.round(91.31 ** 2 / (Portion + 0.0005)) // 崇天3533，紀元2430，大明庚午1744
            if (CalName === 'Chongtian' || Type === 10) {
                McorrTerm = (McorrTermMax - TheWinsolsDifHalfRev ** 2 / Portion) * dd // NoonDif「以乘距午定分」「如不及減者，覆減爲定數，應加者減之⋯⋯」那就什麼都不用處理
                McorrClock = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / Portion // 「置其朔中積，滿二至限去之，餘，列二至限於下，以上減下，餘以乘上」
                McorrClock *= TheTotalNoonDif * 4 // 大明NoonDifDenom / 1307.5，授時 NoonDifDenom / 2500
            } else if (Type === 9) { // 紀元
                McorrTerm = (McorrTermMax - TheWinsolsDifHalfRev ** 2 / Portion) * dd // 置日食甚日行積度。紀元是午前後分，崇天是距午定分。紀元最後有「如半晝分而一，所得，在氣差已上者，即以氣差覆減之，余應加者為減，減者為加。」卽食甚在日出前日落後符號相反，但是其他曆沒有這個規定，照理說也應該是這樣
                const McorrClockRaw = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / Portion
                McorrClock = McorrClockRaw * TheTotalNoonDif * 4
                McorrClock = McorrClock > McorrClockRaw ? McorrClockRaw * 2 - McorrClock : McorrClock // 紀元「以午前後分乘而倍之，如半法而一」後面又來一句「⋯⋯如半法而一，所得，在刻差已上者，卽倍刻差，以所得之數減之，餘爲刻差定數，依其加減」                
            }
        }
        if (Type === 9) { // 紀元「置朔入交常日⋯⋯以氣刻差定數各加減之，交初加三千一百，交中減三千，爲朔入交定日」
            const Mcorr0Descend = Math.round(Denom * (3100 / 7290))
            const Mcorr0Ascend = Math.round(Denom * (3000 / 7290))
            Mcorr0 = isDescend ? Mcorr0Descend : -Mcorr0Ascend // 5.685度        
        } else if (Type === 11) {
            Mcorr0 = isDescend ? 6.15335 : -6.15335
        }
        if (CalName === 'Mingtian') {
            Mcorr = (sign1b * McorrTerm + sign2b * McorrClock) / 100
        } else {
            Mcorr = (sign1 * McorrTerm + sign2 * McorrClock + sign3 * McorrOther + Mcorr0 + (['Chongtian', 'Guantian'].includes(CalName) ? Tcorr * Denom : 0)) / (Type === 11 ? 1 : Denom)
        }
    } else {
        if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            const isBefore = TheNodeAccumHalf > Node25
            let McorrBList = []
            if (CalName === 'Wuji') {
                McorrBList = [76, 95, 111, 125, 137, 147, 154, 147, 137, 125, 111, 95, 76, 95, 111, 125, 137, 147, 154, 147, 137, 125, 111, 95, 76, 95] // 太陰損益差。最後加兩個.「依定氣求朓朒術入之，各得其望日所入定數」
            } else {
                McorrBList = [62, 78, 91, 102, 112, 120, 126, 120, 112, 102, 91, 78, 62, 78, 91, 102, 112, 120, 126, 120, 112, 102, 91, 78, 62, 78]
            }
            let TermNum = 0
            for (let j = 0; j <= 23; j++) {
                if (TheWinsolsDif >= AcrTermList[j] && TheWinsolsDif < AcrTermList[j + 1]) {
                    TermNum = j % 24
                    break
                }
            }
            const Initial = AcrTermList[TermNum] + ',' + McorrBList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + McorrBList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + McorrBList[TermNum + 2]
            McorrB = Interpolate3(TheWinsolsDif, Initial)
            if ((!isYin && isSunYin) || (isYin && !isSunYin)) { // 異名                
                McorrB *= isBefore ? -1 : 1 // 交前                 
            } else { // 同名交後
                McorrB *= !isBefore ? -1 : 1
            }
            TheNodeDif += McorrB + (isBefore ? -1 : 1) * Denom / 12 // 「交前減一辰，交後加一辰」
        }
    }
    if (CalName === 'Mingtian') {
        let position = AcrWinsolsDif + TotalDeciEx1 - AvgDeci + Mcorr
        const TheDif = frc('9901159/184270880') // 每日交點退行
        const SiderealFrc = frc('365 1600447/6240000')
        let NodeDeg = SiderealFrc.sub(TheDif.mul(frc(AvgWinsolsDif + OriginAccum)).mod(SiderealFrc)).toString() // 這應該是正交度
        NodeDeg = +NodeDeg
        position += position < NodeDeg ? Sidereal : 0
        TheNodeAccum = position - NodeDeg
        isDescend = TheNodeAccum < 20 || TheNodeAccum > 340
        TheNodeDif = (Sidereal25 - Math.abs(TheNodeAccum % Sidereal50 - Sidereal25)) * 100 // 交前後分「其度以百通之爲分」。我直接加上食差來判斷，就不用先判斷陰陽曆，加上食差再判斷陰陽曆
    } else if (Type === 11) {
        TheNodeAccum = AvgNodeAccum * 13.36875 + AutoDifAccum(0, TheWinsolsDif, CalName).SunDifAccum + Mcorr
        TheNodeDif = NodeCycle25 - Math.abs(TheNodeAccum % NodeCycle50 - NodeCycle25)
    } else if (!['Dayan', 'Wuji', 'Tsrengyuan', 'Chongxuan'].includes(CalName)) {
        if (isNewm) {
            if (Type === 9) {
                TheNodeAccum = AvgNodeAccumCorr + Mcorr
            } else if (CalName === 'Yingtian') {
                TheNodeAccum = AcrNewmNodeAccum + Mcorr
            } else {
                TheNodeAccum = AcrNodeAccum + Mcorr
            }
        } else {
            TheNodeAccum = AcrNodeAccum // 月食朔入交定日
        }
        Mcorr *= Denom
        TheNodeDif = Node25 - Math.abs(TheNodeAccum % Node50 - Node25) // 交前後分        
        TheNodeDif *= CalName === 'Yingtian' ? 1337 : Denom // 應天「分即百除，度即百通」藤豔輝頁117:900合9度，那我這麼算應該沒錯        
    }
    return { TheNodeAccum, TheNodeDif, Std1, Std2, statusRaw, YinYangBorder, McorrA, McorrB }
}

const EcliMagni = (CalName, Type, isNewm, isYin, Denom, Sidereal50, Node50, NodeCycle50, MoonAcrVList, SunLimitYang, SunLimitYin, SunLimitNone, SunLimitNoneYang, SunLimitNoneYin, MoonLimitDenom, MoonLimitNone, MoonLimit1,
    TheNodeAccum, TheNodeDif, TotalDeci, AcrAnomaAccum, statusRaw, Std1, Std2, YinYangBorder, McorrA, McorrB) => {
    let MagniPortion = 10, MagniMax = 10
    if (Type <= 7) {
        MagniPortion = 15 // 宣明日食定法爲限的1/15，崇天爲1/10
        MagniMax = 15
    } else if (Type === 10) {
        MagniPortion = 9.682
    }
    let Magni = 0, MagniTotal = 0, Last = 0, TheNotEcli = 0
    if (isNewm) {
        if (CalName === 'Dayan') {
            if (isYin) {
                if (TheNodeDif < YinYangBorder) { // 類同陽曆「其去交定度分少於蝕定差六十已下者」
                    if (TheNodeDif >= YinYangBorder - 60) {  // 原文百三十五，會不會太小了。按照五紀183的比例，是435，按照陰曆974/3659的比例，是635 // 陰陽界最大1725 最小825，最大1665/90=18.5加上陽曆限435是23.333，635是25.555。最小8.5，加上陽曆限435是13.333，635是15.555
                        Magni = MagniMax
                    } else {
                        Magni = (TheNodeDif + SunLimitYang) / 90
                    }
                } else { // 陰曆
                    TheNodeDif -= YinYangBorder
                    if (TheNodeDif < 104) {
                        Magni = MagniMax
                    } else {
                        if (TheNodeDif < SunLimitYin) {
                            TheNodeDif -= 104
                            TheNodeDif /= 143
                        } else if (TheNodeDif < SunLimitNoneYin) {
                            TheNodeDif -= 104
                            TheNodeDif /= 152
                        }
                        Magni = MagniMax - TheNodeDif
                    }
                }
            } else { // 陽曆
                // if (['Wuji', 'Tsrengyuan'].includes(CalName)) { // 這個應該是初步判斷陰陽曆的時候用的
                //     if (!isBefore) { // 交後
                //         TheNodeDif -= Denom / 12
                //     } else {
                //         TheNodeDif += Denom / 12
                //     }
                // }
                if (TheNodeDif < SunLimitYang) {
                    Magni = TheNodeDif / 90
                } else if (TheNodeDif < SunLimitNoneYang) {
                    Magni = TheNodeDif / 143
                }
                Magni = MagniMax - TheNodeDif
            }
        } else if (CalName === 'Qintian') { // 這裏我改了很多，原文不是這樣
            const SunLimitYin1 = 4780 + YinYangBorder // 「以定準加中限，爲陰道定準」。4780實際上就是沒有加食差的陰陽曆範圍
            const SunLimitYang1 = 4780 - YinYangBorder // 「減中限，爲陽道定限。不足減者，反減之，爲限外分⋯⋯其有限外分者，卽減去限外分，爲距食分」
            if ((isYin && TheNodeDif < SunLimitNoneYin)) {
                if (TheNodeDif < SunLimitYang1 || SunLimitYang1 < 0) { // 雖曰陰道，亦爲陽道食
                    TheNotEcli = SunLimitYang1 + TheNodeDif
                } else { // 陰道食。上面已經有條件了，這裏不用再寫
                    TheNotEcli = SunLimitYin1 - TheNodeDif // 距食分
                }
            } else if (!isYin && TheNodeDif < SunLimitNoneYang) {
                TheNotEcli = SunLimitYang1 - TheNodeDif // 「定限以下爲入定食限」                
            }
            Magni = TheNotEcli / 478
        } else if (CalName === 'Chongxuan') {
            if (statusRaw) {
                if (TheNodeDif < Std1) {
                    Magni = MagniPortion * TheNodeDif / Std1
                    isYin = false
                } else { // 「在既後者，其虧復陰歷也」
                    Magni = MagniPortion * (1480 - TheNodeDif) / Std2
                    isYin = true
                }
            }
        } else if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            const isBefore = TheNodeAccum % Node50 > Node50 / 2
            const Dingfa = (CalName === 'Wuji' ? 104 : 85) - McorrB / 15
            if (isYin) {
                TheNodeDif -= McorrB
                TheNodeDif -= isBefore ? Denom / 6 : 0 // 餘爲陰曆蝕           
                if (TheNodeDif < 0) {
                    TheNodeDif = -TheNodeDif
                    TheNodeDif += isBefore ? Denom / 4 : -Denom / 6 // 餘爲類同陽曆蝕
                }
                TheNodeDif += McorrA
                if (TheNodeDif < 0) {
                    Magni = MagniMax
                } else {
                    Magni = 15 - TheNodeDif / Dingfa
                }
            } else {
                TheNodeDif += McorrB + (isBefore ? Denom / 12 : -Denom / 12)
                Magni = (MoonLimitNone - TheNodeDif) / (CalName === 'Wuji' ? 104 : 85)
            }
        } else if ((['Xuanming', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].includes(CalName) || Type === 10) && isYin) {
            TheNodeDif -= CalName === 'Yitian' ? 728 : 0
            if (TheNodeDif < SunLimitYang) { // 崇天：如陽曆食限以下者爲陽曆食定分
                Magni = (TheNodeDif - (CalName === 'Yitian' ? 317 : 0)) / (SunLimitYang / MagniPortion)
            } else { // 「置入交前後分，如陽曆食限以下者為陽曆食定分；已上者，覆減一萬一千二百，餘為陰曆食定分；不足減者，不食」奇怪的是陰曆限並沒有參與計算。乾元加了一個if (TheNodeDif < SunLimitYin) 
                TheNodeDif = SunLimitNone - TheNodeDif // 崇天陰曆食定分
                Magni = TheNodeDif / (SunLimitYin / MagniPortion)
            }
        } else if (CalName === 'Yingtian' && isYin) { // 藤豔輝《宋代》頁116。以下是我自己寫的            
            let TheNodeDifYin = 0
            let isYin = false
            if (TheNodeDif < SunLimitYang) { // 類同陽曆                
                Magni /= SunLimitYang / MagniPortion
            } else if (TheNodeDif < SunLimitYin) {
                isYin = true
                TheNodeDif -= SunLimitYang // 以上者去之                
                TheNodeDifYin = TheNodeDif
            }
            // let tmp = (0.75 - TotalDeci) * Denom / 100 // 極值應該有5001。本來是退一等，感覺太大了吧
            // tmp *= TotalDeci > 0.5 ? 0.5 : 2
            // let Dingfen = Math.abs(TheNodeDif - tmp) // 食定分
            // if (TheNodeDif - tmp < 0) {
            //     Dingfen = 10 * Dingfen + TheNodeDifYin
            // }
            Magni = TheNodeDif / ((isYin ? SunLimitYin : SunLimitYang) / MagniPortion)//  Dingfen / ((isYin ? SunLimitYin : SunLimitYang) / MagniPortion)
        } else if (CalName === 'Mingtian' && TheNodeAccum > Sidereal50) { // 到底是Sidereal50還是Cycle50，按術文是sidereal
            if (TheNodeDif < SunLimitYang) {
                TheNodeDif *= 2 // 類同陽曆分
            } else {
                TheNodeDif = SunLimitNone - TheNodeDif // 「以上者，覆減食限，餘爲陰曆食分」
            }
            Magni = TheNodeDif / 97.6
        } else if (Type === 9 || Type === 11) {
            Node50 = Type === 9 ? Node50 : NodeCycle50
            if (!isYin && TheNodeDif < SunLimitYang) {
                Magni = (SunLimitYang - TheNodeDif) / (SunLimitYang / MagniPortion)
            } else if (isYin && TheNodeDif < SunLimitYin) {
                Magni = (SunLimitYin - TheNodeDif) / (SunLimitYin / MagniPortion)
            }
        }
    } else {
        if (CalName === 'Chongxuan') {
            Last = 2000 - MoonAcrVList[~~AcrAnomaAccum] * 10 / 13.37
            MoonLimit1 = Last * (isYin ? 0.41 : 0.34)
            MoonLimitDenom = 1480 - MoonLimit1
            Magni = TheNodeDif < MoonLimit1 ? MagniMax : MagniPortion * (1480 - TheNodeDif) / MoonLimitDenom
        } else {
            MoonLimitDenom = MoonLimitDenom || (MoonLimitNone * 0.0662) // 這個比例根據7部曆平均而來            
            TheNotEcli = CalName === 'Qintian' ? MoonLimitNone - TheNodeDif : TheNotEcli
            if (TheNodeDif < MoonLimit1) { // 授時似乎沒有全食限                
                if (Type === 7 || ['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
                    Magni = MagniMax
                } else {
                    MagniTotal = (MoonLimit1 - TheNodeDif) / MoonLimitDenom // 旣內之大分，庚午最大5。授時另有算法
                    Magni = MagniMax + MagniTotal
                }
            } else {
                Magni = (MoonLimitNone - TheNodeDif) / MoonLimitDenom // 崇天沒提到月食分需要，紀元日月食都沒說要TheNodeDif=MoonLimitNone - TheNodeDif
            }
            if (CalName === 'Yingtian' && Magni < 5 && (TotalDeci > 1 - 0.08 || TotalDeci < 0.08)) { // 「其食五分以下，在子正前後八刻內，以二百四十二除為食之大分，命十為限」
                Magni /= 2
            }
        }
    }
    const MagniFunc = ExMagni(Magni, Type, CalName, isNewm)
    Magni = MagniFunc.Magni
    const status = MagniFunc.status
    return { Magni, status, Last, TheNotEcli, TheNodeDif }
}

const EcliLast2 = (CalName, Type, isNewm, Last, Magni, TheNodeDif, AvgDeci, TotalDeci, TotalDeciEx1, isDescend, isYin, TheNotEcli, Denom, Anoma, MoonAcrVList, AcrAnomaAccum, AvgAnomaAccum, Anoma50, MoonLimit1, MoonLimitNone, SunLimitYang, SunLimitYin, YinYangBorder) => {
    let StartDeci = 0, EndDeci = 0
    if (Magni) {
        if (['Dayan', 'Wuji', 'Tsrengyuan', 'Xuanming'].includes(CalName)) {
            if (CalName === 'Dayan') {
                if (isNewm) {
                    Last = Magni + 2
                    if (isYin) {
                        if (TheNodeDif > YinYangBorder) {
                            Last += TheNodeDif <= YinYangBorder + 70 ? 0.5 : 0 // 校勘記說改成七十已上，不能改。「又增」，我補上一個半                                
                            Last += TheNodeDif <= YinYangBorder + 35 ? 0.5 : 0
                        } else {
                            Last += TheNodeDif >= YinYangBorder - 20 ? 0.5 : 0
                            Last += TheNodeDif >= YinYangBorder - 4 ? 0.5 : 0
                        }
                    }
                } else {
                    Last = Magni + 3
                    Last += Magni >= 6 ? 1 : 0
                    Last += Magni >= 11 ? 1 : 0
                    Last += TheNodeDif <= 520 ? 0.5 : 0
                    Last += TheNodeDif <= 260 ? 0.5 : 0
                }
            } else { // 宣明沒有食延，暫用五紀            
                Last = Magni * (isNewm ? 6 / 5 : 4 / 3)
            }
            const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AcrAnomaAccum, CalName)
            Last *= 1 + MoonTcorrDif / TheDenom / Denom // 「應朒者，依其損益；應朓者，損加益減其副」
        } else if (CalName === 'Chongxuan') {
            if (isNewm) {
                Last = 1800 - MoonAcrVList[~~AcrAnomaAccum] * 9 / 13.37 // 日食泛用刻是月食的0.9 f(2674)=0
                Last *= Magni / 100000
            } else { // 月全食
                Last /= Magni === 10 ? 10000 : 1
                Last *= Magni === 10 ? 1 : Magni / 100000
            }
        } if (CalName === 'Qintian') {
            if (isNewm) {
                if (TheNotEcli > 1912) {
                    Last = 647 - (4780 - TheNotEcli) ** 2 / 63272
                } else if (TheNotEcli < 956) {
                    Last = 517 - (1912 - TheNotEcli) / 7.35
                } else {
                    Last = 387 - TheNotEcli ** 2 / 2362
                }
            } else {
                if (TheNotEcli > 2104) {
                    Last = 711 - (5260 - TheNotEcli) ** 2 / 69169
                } else if (TheNotEcli > 1052) {
                    Last = 567 - (2140 - TheNotEcli) / 7
                } else {
                    Last = 417 - (1052 - TheNotEcli) ** 2 / 2654
                }
            }
            Last *= 1337.5 / MoonAcrVList[~~(AcrAnomaAccum / Anoma * 248)] // 平離963,963/72=13.375
        } else if (CalName === 'Yingtian') {
            let AcrAnomaAccumHalfInt = ~~(AcrAnomaAccum % Anoma50)
            const Plus = AcrAnomaAccum > Anoma50 ? 14 : 0
            AcrAnomaAccumHalfInt += Plus
            Last = Magni * 133700 / MoonAcrVList[AcrAnomaAccumHalfInt]
            if (!isNewm) {
                Last -= MoonLimit1
                if (TotalDeci - Last / Denom < 0) { // 應天「如不足減者，卽以食限分如望定餘爲食定分」
                    Magni = TotalDeci * Denom / MoonLimit1
                    Last = Magni * 133700 / MoonAcrVList[AcrAnomaAccumHalfInt]
                }
            }
        } else if (CalName === 'Qianyuan') {
            Last = (isNewm ? 26.46 : 29.4) * Magni
        } else if (CalName === 'Yitian') {
            Last = (isNewm ? 54.54 : 60.6) * Magni
            if (TheNodeDif < 1726) {
                Last += 0.005 * Denom + TheNodeDif < 856 ? 0.005 * Denom : 0
                Last *= 1350 * 12 / Denom
            }
        } else if (CalName === 'Mingtian') {
            if (isNewm) {
                Last = (1952 - TheNodeDif) * TheNodeDif / 271 // f(976)達到極值3515
            } else {
                Last = isDescend ? 3900 - TheNodeDif ** 2 / 459 : 3315 - TheNodeDif ** 2 / 540 // 1338降到0
            }
        }
        else if (['Chongtian', 'Guantian'].includes(CalName)) { // 藤豔輝《崇天曆的日食推步術》
            const tmp = TheNodeDif / (TheNodeDif < SunLimitYang ? SunLimitYang : SunLimitYin)
            Last = 0.09 * Denom * tmp * (2 - tmp) * 1337 / MoonAcrVList[~~AcrAnomaAccum]
        } else if (Type === 9) {
            const LastMaxSun = Math.round(Denom * 583 / 7290)
            const LastDenomSunYin = ~~((SunLimitYin ** 2 / LastMaxSun) / 100) * 100 // 紀元算出來是31715.268，要00結尾
            const LastDenomSunYang = ~~((SunLimitYang ** 2 / LastMaxSun) / 100) * 100
            const LastMaxMoon = Math.round(Denom * 656 / 7290)
            const LastDenomMoon = ~~((MoonLimitNone ** 2 / (Denom * 656 / 7290)) / 100) * 100
            if (isNewm) {
                Last = isYin ? LastMaxSun - TheNodeDif ** 2 / LastDenomSunYin : LastMaxSun - TheNodeDif ** 2 / LastDenomSunYang
            } else {
                Last = LastMaxMoon - TheNodeDif ** 2 / LastDenomMoon
            }
            const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif((AvgAnomaAccum + TotalDeciEx1 - AvgDeci) % Anoma, CalName) // 食甚加時入轉算外損益率。應朒者依其損益，應朏者益減損加其副
            Last *= 1 + MoonTcorrDif / TheDenom / Denom
        } else if (Type === 10) {
            if (isNewm) {
                Last = Magni * (30 - Magni) * 2450 / MoonAcrVList[~~AcrAnomaAccum]
            } else {
                Last = Magni * (35 - Magni) * 2100 / MoonAcrVList[~~AcrAnomaAccum]
            }
        } else if (Type === 11) {
            Last = Math.sqrt(((isNewm ? 20 : 30) - Magni) * Magni) * 0.00574 / MoonFormula(AcrAnomaAccum, CalName).MoonAcrV // 「如入定限行度而一」我猜是這樣            
            Last *= CalName === 'Datong' && !isNewm ? 6 / 7 : 1
        }
        if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            let Portion = 0.5
            if (isNewm) {
                if (TotalDeci < 1 / 3) {
                    Portion = 0.4
                } else if (TotalDeci > 5 / 12) {
                    Portion = 0.6
                }
            }
            StartDeci = (TotalDeci - Last * Portion / 100 + 1) % 1
            EndDeci = (TotalDeci + Last * (1 - Portion) / 100 + 1) % 1
            Last *= Portion / 100
        } else if (Type === 7 && CalName !== 'Qintian') {
            Last /= 200
            StartDeci = (TotalDeci - Last + 1) % 1
            EndDeci = (TotalDeci + Last + 1) % 1
        } else {
            Last /= CalName === 'Chongxuan' ? 1 : Denom
            StartDeci = (TotalDeci - Last + 1) % 1 // 授時已經把Denom設置爲1
            EndDeci = (TotalDeci + Last + 1) % 1
        }
    }
    return { StartDeci, EndDeci, Last } // 這個last是半食延，0.xxxx
}

// 大衍第一次提出陰陽食限。宣明之後直接採用去交、食限，捨棄大衍的變動食限
const Eclipse3 = (AvgNodeAccum, AvgAnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, OriginAccum, isNewm, CalName) => {
    const { Type, AutoPara } = Bind(CalName)
    const { SolarRaw, Sidereal, Node, Anoma, MoonAcrVList, Denom, AcrTermList,
        SunLimitNone, MoonLimitNone, SunLimitNoneYang, SunLimitNoneYin, SunLimitYang, SunLimitYin
    } = AutoPara[CalName]
    let { Solar, MoonLimit1, MoonLimitDenom } = AutoPara[CalName]
    Solar = Solar || SolarRaw
    AcrWinsolsDif %= Solar // 注意，AcrWinsolsDif是定朔距冬至日，而非積度
    AvgWinsolsDif %= Solar
    let Node50 = Node / 2
    const Node25 = Node / 4
    const Anoma50 = Anoma / 2
    const Sidereal25 = Sidereal / 4
    const Sidereal50 = Sidereal / 2
    const Solar125 = Solar / 8
    const Solar25 = Solar / 4
    const Solar375 = Solar * 3 / 8
    const Solar50 = Solar / 2
    const Solar75 = Solar * 0.75
    const Solar875 = Solar * 7 / 8
    const HalfTermLeng = Solar / 24
    const NodeCycle = (CalName === 'Chongxuan' || Type === 11) ? AutoNodeCycle(CalName) : 0
    const NodeCycle50 = NodeCycle / 2
    const NodeCycle25 = NodeCycle / 4
    const { Tcorr2: AvgTcorr, SunTcorr, MoonAcrV, MoonTcorr: AvgMoonTcorr, NodeTcorr: AvgNodeTcorr
    } = AutoTcorr(AvgAnomaAccum, AvgWinsolsDif, CalName) // 經朔修正    
    const AcrAnomaAccum = (AvgAnomaAccum + AvgTcorr) % Anoma // 定朔入轉
    const AvgNodeAccumCorr = AvgNodeAccum + SunTcorr // 入交常日    
    const AcrNodeAccum = AvgNodeAccum + AvgNodeTcorr // 入交定日
    const AcrNewmNodeAccum = AvgNodeAccum + AvgTcorr // 紀元定朔入交泛日
    const NewmNoonDif = AcrDeci - 0.5 // 應天乾元儀天崇天午前後分
    const NewmNoonDifAbs = Math.abs(NewmNoonDif)
    const WinsolsDeci = OriginAccum - Math.floor(OriginAccum)
    const Rise = AutoLongi2Lati(AcrWinsolsDif, WinsolsDeci, CalName).Rise / 100
    const isDescend = AvgNodeAccum < 3 || AvgNodeAccum > 25 // 交中前後皆為交中
    let isYin = AcrNodeAccum > Node50
    let Tcorr0 = 0
    let AvgTotalDeci = 0
    let AvgTotalNoonDif = 0 // 紀元中前後分
    if (Type === 9 || Type === 10) {
        if (Type === 9) { // 紀元食甚泛餘，藤豔輝《紀元曆日食算法及精度分析》說卽定朔到眞食甚的改正，我覺得不是。最後《中》說加上經朔，藤豔輝說加上定朔
            const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AcrAnomaAccum, CalName) // 這個損益率應該是與定朔改正相反
            Tcorr0 = AvgTcorr * MoonTcorrDif / TheDenom / Denom
            AvgTotalDeci = (AvgDeci + AvgTcorr + Tcorr0 + 1) % 1 // 紀元食甚泛餘 // 注意小數點加上修正變成負的情況，比如0.1退成了0.9
        } else {
            Tcorr0 = AvgTcorr * 1337 / MoonAcrVList[~~AcrAnomaAccum]
            AvgTotalDeci = (AvgDeci + Tcorr0 + 1) % 1 // 大明是加經朔
        }
        AvgTotalNoonDif = Math.abs(0.5 - AvgTotalDeci)
    }
    const RiseNoonDif = 0.5 - Rise // 日出沒辰刻距午正刻數/100，卽半晝分    
    ////////////////////// 時差
    const NodeDif = Type === 7 ? Denom * (Node25 - Math.abs(AcrNodeAccum % Node50 - Node25)) : 0
    const { Tcorr, TotalDeci, TotalDeciEx1, TheTotalNoonDif, dd } = EcliTcorr(isNewm, isYin, CalName, Type, Denom, Solar25, Solar75, NewmNoonDif, NewmNoonDifAbs, Rise, RiseNoonDif, AvgTotalDeci, AvgTotalNoonDif, AcrDeci, AvgDeci, AvgMoonTcorr, MoonAcrV, SunTcorr, NodeDif, AcrWinsolsDif)
    ////////////////////// 食差
    const { TheNodeAccum, TheNodeDif: TheNodeDifRaw, Std1, Std2, statusRaw, YinYangBorder, McorrA, McorrB } = EcliMcorr(CalName, Type, HalfTermLeng, Node25, Node50, Sidereal25, Sidereal50, Sidereal, Solar125, Solar25, Solar375, Solar50, Solar75, Solar875, Solar, NodeCycle25, NodeCycle50, MoonLimit1, Denom, AcrTermList,
        isNewm, isYin, isDescend, AcrWinsolsDif, AvgWinsolsDif, dd, TotalDeci, TotalDeciEx1, TheTotalNoonDif, RiseNoonDif, AcrNodeAccum, AvgNodeAccum, AvgNodeAccumCorr, AcrNewmNodeAccum, AvgDeci, Tcorr, OriginAccum)
    isYin = TheNodeAccum > Node50
    ////////////////////// 食分
    let { Magni, status, Last, TheNotEcli, TheNodeDif } = EcliMagni(CalName, Type, isNewm, isYin, Denom, Sidereal50, Node50, NodeCycle50, MoonAcrVList, SunLimitYang, SunLimitYin, SunLimitNone, SunLimitNoneYang, SunLimitNoneYin, MoonLimitDenom, MoonLimitNone, MoonLimit1,
        TheNodeAccum, TheNodeDifRaw, TotalDeci, AcrAnomaAccum, statusRaw, Std1, Std2, YinYangBorder, McorrA, McorrB)
    //////////////////////  食延
    const { StartDeci, EndDeci } = EcliLast2(CalName, Type, isNewm, Last, Magni, TheNodeDif, AvgDeci, TotalDeci, TotalDeciEx1, isDescend, isYin, TheNotEcli, Denom, Anoma, MoonAcrVList, AcrAnomaAccum, AvgAnomaAccum, Anoma50, MoonLimit1, MoonLimitNone, SunLimitYang, SunLimitYin, YinYangBorder)
    return { Magni, status, StartDeci, TotalDeci, EndDeci } // start初虧，total食甚
}
// console.log(Eclipse3(14.034249657, 11.1268587106, 0.45531, 0.44531, 31.9880521262, 31.9780521262, 8194819414.14, 0, 'Mingtian'))
// console.log(Eclipse3(12.85874, 0.3524, 0.83546, 0.79093, 156.3253, 156.2809, 0, 0, 'Datong').Magni) // 2021年四月望
// console.log(Eclipse3(13.81, 22, 0.674916, 0.22, 22.4549, 22, 8194819414.14, 1, 'Chongxuan')) // 這種情況其他曆都不食，只有授時食，這是月盈縮差帶來的，應該正常
// console.log(Eclipse3(26 + 5644.4277 / 10590, 22.052297, 0.4495401228, 0.8172804533, 175.6583788196 + 0.02675303116, 175.6583788196, 0, 1, 'Chongtian')) // 1024年崇天曆日食，藤豔輝論文
// (AvgNodeAccum, AvgAnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, OriginAccum, isNewm, CalName)
export const AutoEclipse = (NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, isNewm, CalName, i, Leap, OriginAccum) => { // 這就不用%solar了，後面都模了的
    const { Type } = Bind(CalName)
    let Eclipse = {}
    if (Type <= 3 || ['Yuanjia', 'Daming', 'Liangwu'].includes(CalName)) {
        Eclipse = Eclipse1(NodeAccum, CalName)
    } else {
        if (['Zhangmengbin', 'Liuxiaosun'].includes(CalName)) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgWinsolsDif, 'Daye', NodeAccum).NodeTcorr
            Eclipse = Eclipse2(NodeAccum, AnomaAccum, AcrDeci, AvgWinsolsDif, isNewm, 'Daye', i, Leap)
        } else if (CalName === 'Shenlong') {
            NodeAccum += AutoTcorr(AnomaAccum, AvgWinsolsDif, 'LindeA', NodeAccum).NodeTcorr
            Eclipse = Eclipse2(NodeAccum, AnomaAccum, AcrDeci, AvgWinsolsDif, isNewm, 'LindeA', i, Leap)
        } else if (Type <= 6) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgWinsolsDif, CalName, NodeAccum).NodeTcorr
            Eclipse = Eclipse2(NodeAccum, AnomaAccum, AcrDeci, AvgWinsolsDif, isNewm, CalName, i, Leap)
        } else if (['Fengyuan', 'Zhantian'].includes(CalName)) {
            Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, 0, isNewm, 'Guantian')
        } else if (['Chunyou', 'Huitian'].includes(CalName)) {
            Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, 0, isNewm, 'Chengtian')
        } else if (['Daming1', 'Daming2', 'Yiwei'].includes(CalName)) {
            Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, 0, isNewm, 'Daming3')
        } else if (Type <= 11) {
            Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, OriginAccum, isNewm, CalName)
        }
    }
    return Eclipse
}
// console.log(AutoEclipse(14.2, 11.1268587106, 0.45531, 0.44531, 31.9880521262, 31.9780521262, 1, 'Huangji', 4, 2, 8194819414.14))