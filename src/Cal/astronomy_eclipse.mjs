import { Bind } from './bind.mjs'
import { AutoTcorr, AutoDifAccum } from './astronomy_acrv.mjs'
import { Interpolate3 } from './equa_sn.mjs'
import { Longi2LatiFormula } from './astronomy_formula.mjs'
import { AutoMoonAvgV, AutoMoonTcorrDif, AutoNodePortion } from './para_auto-constant.mjs'
import { AutoQuar } from './para_auto-constant.mjs'

const NodeAccumHalf2NodeDif = (NodeAccumHalf, Node25, Node50) => { // 去交分 NodeDif
    let NodeDif = NodeAccumHalf
    if (NodeAccumHalf > Node25) {
        NodeDif = Node50 - NodeAccumHalf
    }
    return NodeDif
}
const Deci2QuarDif = Deci => {
    const tmp = Deci % 0.25
    let QuarDif = tmp
    if (tmp >= 1 / 8) {
        QuarDif = 1 / 4 - tmp
    }
    return QuarDif
}
const ExMagni = (Magni, Type) => {
    let status = 0
    if (Type < 5) {
        if (Magni < 0) {
            Magni = 0
            status = 0
        } else if (Magni < 5) {
            status = 3
        } else if (Magni < 12.417) {
            status = 2
        } else { // NodeDif < 1 / 12
            status = 1
        }
    } else if (Type < 8) {
        if (Magni < 0) {
            Magni = 0
        } else if (Magni < 10) {
            status = 3
        } else if (Magni < 15) {
            status = 2
        } else {
            Magni = 15
            status = 1
        }
    } else { // 崇玄開始定爲10
        if (Magni < 0) {
            Magni = 0
        } else if (Magni < 10) {
            status = 2
        } else {
            Magni = 10
            status = 1
        }
    }
    return { Magni, status }
}

const EclipseTable1 = (NodeAccum, CalName) => {
    const { AutoPara, Type } = Bind(CalName)
    const { Node, Lunar } = AutoPara[CalName]
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const Node50 = Node / 2
    const Node25 = Node / 4
    const NodeAccumHalf = NodeAccum % Node50
    const NodeDif = NodeAccumHalf2NodeDif(NodeAccumHalf, Node25, Node50)
    let status = 0
    let Limit = Lunar / 2
    if (['Daming', 'Kaihuang'].includes(CalName)) {
        Limit = MoonAvgVDeg * (Lunar - Node) / 2
    }
    let Magni = 0
    if (NodeDif * MoonAvgVDeg < Limit) {
        Magni = 15 - NodeDif * MoonAvgVDeg
        const Func = ExMagni(Magni, Type)
        Magni = Func.Magni
        status = Func.status
    }
    return { Magni, status, Node }
}

// 春夏秋冬各三月，那麼閏月怎麼辦呢，所以輸入的時候應該用day的noleapmon，閏月還是上一個月
const EclipseTable2 = (NodeAccum, AnomaAccum, Deci, WinsolsDifRaw, isNewm, CalName, i, Leap) => {
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
    let NodeDif = NodeAccumHalf2NodeDif(NodeAccumHalf, Node25, Node50)
    const NoonDif = Math.abs(Deci - 0.5)
    const SummsolsDif = Math.abs(WinsolsDif - Solar50)
    let status = 0
    let Tcorr = 0
    let Tcorr1 = 0 // 食甚時刻修正一
    let Tcorr2 = 0 // 日食食甚時刻修正二
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
            // 還要加上：日出後日入前一時半，不注月食，卽12.5刻
            if (isNewm && NodeAccum >= Node50) { // 日食内道
                let sign = 1
                if (AnomaAccum > Anoma * 0.25 && AnomaAccum <= Anoma75) {
                    sign = -1
                }
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
        Deci += Tcorr1 + Tcorr2 // 這一步很奇怪，我猜的
        const QuarDif = Deci2QuarDif(Deci)
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
        if (Deci <= 1 / 4 || (Deci > 1 / 2 && Deci <= 3 / 4)) {
            Tcorr = -Tcorr
        }
        Deci += Tcorr // 戊寅時差極值2.57小時=0.107
    } else if (Type === 6 && isNewm) { // 麟德月食食甚時刻卽定望。
        // 還要加上：月食：晨昏之間不可見食甚，日出後日入前12.5刻，就不注月食
        const QuarDif = Deci2QuarDif(Deci)
        let sign2 = -1
        if ((Deci > 0.25 && Deci < 0.5) || Deci > 0.75) {
            sign2 = 1
        }
        if (NodeAccum > Node50) { // 月在內道
            let Dif = QuarDif * (10 + NodeDif * 12) / 42 // 差
            Tcorr = Dif
            let sign1 = -1
            if (Deci >= 0.5) {
                sign1 = 1
            }
            if (WinsolsDif < HalfTermLeng * 5) { } else if (WinsolsDif < HalfTermLeng * 7) { } else if (WinsolsDif < HalfTermLeng * 17) { //若用定氣，有2986 / 1340的盈縮積，但肯定應該是平氣。                
                const k = ~~(SummsolsDif / HalfTermLeng) // 距離夏至節氣數。皇極是距寒露驚蟄氣數。這樣完全相反，到底是那個
                Tcorr = sign1 * (2 * k + NodeDif * 4) / 100 + Dif // 劉洪濤的理解和《中國古代曆法》不一樣，我暫且用劉洪濤的
            } else if (WinsolsDif < HalfTermLeng * 19) { } else {
                const k = ~~((WinsolsDif % Solar) / HalfTermLeng) // 距離冬至節氣數
                Tcorr = -sign1 * (2 * k + NodeDif * 4) / 100 + Dif
            }
            Deci += sign2 * Tcorr
        } else {
            Tcorr = QuarDif * NodeDif * 2 / 7 // 去交時是以時辰爲單位，卽1日12辰
            Deci -= -sign2 * Tcorr
        }
    }
    if (isNewm) {
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) { // 《劉洪濤》頁458。最後有個條件是五星伏見，目前沒辦法加上去，還有個條件不懂什麼意思。戊寅見舊唐志一
            if (NodeAccum >= Node50) {
                if (NoonDif <= 0.125 && (i === 5 || i === 6)) {
                    SunLimitYang = 13 / 12
                } else if (WinsolsDif >= HalfTermLeng * 4 && WinsolsDif <= HalfTermLeng * 8 && Deci > 7 / 12) { // 春分前後。大業驚蟄和雨水順序跟現在對調。加時在未以西，只能假設是以午對稱。
                    SunLimitYang = 13 / 12
                } else if (WinsolsDif >= HalfTermLeng * 16 && WinsolsDif <= HalfTermLeng * 20 && Deci < 5 / 12) {
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
                } else if (NodeAccumHalf > Node25) { // 先交
                    SunLimitYang = 1 / 6
                } else if (NodeAccumHalf < Node25 && AnomaAccum > Anoma * 0.25 && AnomaAccum <= Anoma75) { // 這兩條我處理成「後交値縮，二時內亦食」
                    SunLimitYang = 1 / 6
                } else if (NodeAccumHalf > Node25 && AnomaAccum < Anoma * 0.25 && AnomaAccum >= Anoma75) {
                    SunLimitYang = 1 / 6
                }
            }
        } else if (CalName === 'Huangji') {
            if (NodeAccum >= Node50) { // 在陰曆應食不食《中國古代曆法》頁531:黃道南食限小於黃道北，因爲月在黃道北，視去交小於計算去交
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
            if (NodeAccum >= Node50 && WinsolsDif >= Solar / 4 && WinsolsDif <= Solar75) { // 秋分至春分殘缺
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
        if (NodeDif <= SunLimitYang) {
            status = 2
        }
    } else if (NodeDif <= HalfSynodicNodeDif) {
        status = 2
    }
    let Magni = 0
    let Last = 0
    let Dcorr = 0
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
            if (WinsolsDif >= 2 * HalfTermLeng && WinsolsDif < 10 * HalfTermLeng && NodeDif > 5 / 12 && ((NodeAccum > Node50 && NodeAccum < Node75) || NodeAccum < Node25)) { // 去後交五時外
                sign4 = -1
                // if (NodeAccumHalf > Node25) { // 交前 按照劉洪濤頁462的意思，他說的交前交後跟我這相反，到底那種是對的呢？不過這裏符號還是跟他一樣。劉洪濤和藤豔輝對術文理解不一，劉洪濤認爲後面的「時差減者，先交減之，後交加之」一句用來描述前面的「皆去不食餘一時」，藤認爲後面和前面是分開的，前面的一時符號都是-。感覺藤的說法可靠一些。
                //     if ((Deci >= 1 / 4 && Deci < 1 / 2) || (Deci >= 3 / 4)) {
                //         sign4 = 1
                //     }
                // } else if (Deci <= 1 / 4 || (Deci > 1 / 2 && Deci <= 3 / 4)) {
                //     sign4 = 1
                // }
            }
            const Bushi = Math.abs(NodeDif + sign4 / 12 - Tcorr4) // 不食餘，取絕對值
            Magni = 15 - (Bushi + Tcorr) * MoonAvgVDeg
        } else {
            if (CalName === 'Daye') {
                if ((i >= 1 && i <= 3 && NodeAccumHalf < Node25) || (i >= 7 && i <= 9 && NodeAccumHalf > Node25) || (i >= 10 && NodeAccumHalf < Node25)) {
                    Magni = 15 - (NodeDif - 1 / 12) * MoonAvgVDeg
                } else {
                    Magni = 15 - NodeDif * MoonAvgVDeg // 這種情況與正光全同。
                }
            } else {
                if ((i >= 1 && i <= 3 && NodeAccumHalf > Node25) || (i >= 7 && i <= 9 && NodeAccumHalf < Node25)) { // 春先交，秋後交
                    Magni = 15 - (NodeDif - 1 / 24) * MoonAvgVDeg
                } else if ((i >= 1 && i <= 3 && NodeAccumHalf < Node25) || (i >= 7 && i <= 9 && NodeAccumHalf > Node25) || i >= 10) { // 春後交，秋先交
                    Magni = 15 - (NodeDif - 1 / 6) * MoonAvgVDeg
                } else {
                    Magni = 15 - NodeDif * MoonAvgVDeg // 這種情況與正光全同。
                }
            }
        }
        if (NodeDif < 0) {
            Magni = 15
            status = 1 // 不足減者，食旣    
        }
        if (Magni > 15) {
            Magni = 15
            status = 1 // 食旣
        }
        const LastList = [0, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 22] // 月食刻數        
        if (Magni > 0 && Magni < 15) {
            Last = LastList[~~Magni] + (Magni - ~~Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
        } else if (Magni === 15) {
            Last = LastList[Magni]
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
            Dcorr = M / 96
            Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif - Dcorr
        } else {
            // const MoonDcorrList = [48, 43, 38, 33, 28, 23, 18, 15, 12, 9, 6, 3, 0, 13, 14, 15, 16, 17, 18, 21, 24, 27, 30, 33, 48]
            // Dcorr = -(MoonDcorrList[TermNum] + (MoonDcorrList[TermNum + 1] - MoonDcorrList[TermNum]) * TermNewmDif / HalfTermLeng) / 96
            // Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif + Dcorr 
            // 「以減望差，乃如月食法」
            if ((WinsolsDif > Solar25 && WinsolsDif < Solar50) || WinsolsDif > Solar75) {
                Dcorr = 15 * (3 * ~~(SummsolsDif / HalfTermLeng) + 2 * (10 + NodeDif * 12)) / HalfSynodicNodeDif
            } else {
                Dcorr = 15 * (3 * ~~(SummsolsDif / HalfTermLeng) + 2 * (10 + NodeDif * 12) + 2 * ~~(Solar25 - WinsolsDif % Solar50)) / HalfSynodicNodeDif
            }
            Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif + Dcorr / Denom
        }
        // const LastList = [0, 19, 6, 8, 4, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1, 0] // 實在無法理解，暫時案麟德
        if (NodeDif < 0) {
            Magni = 15
            status = 1 // 不足減者，食旣    
        }
        if (Magni > 15) {
            Magni = 15
            status = 1 // 食旣
        }
        const LastList = [0, 1, 2, 3, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20]
        if (Magni > 0 && Magni < 15) {
            Last = LastList[~~Magni] + (Magni - ~~Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
        } else if (Magni === 15) {
            Last = LastList[Magni]
        }
    } else if (['LindeA', 'LindeB'].includes(CalName)) { // 下麟德求食分。NodeDif去交前後定分。558、552的不同，《中國古代曆法》頁82說要統一爲552，不過如果用定氣思路來看，興許不用改。
        if (isNewm) {
            if (NodeAccum > Node50) { // 月在內道
                if (WinsolsDif < Solar25) {
                    Dcorr = 552 // 食差
                } else if (WinsolsDif <= Solar50) {
                    Dcorr = 552 * (Solar50 - WinsolsDif) / Solar25
                } else if (WinsolsDif <= Solar50 + Solar25) {
                    Dcorr = 552 * (WinsolsDif - Solar50) / Solar25
                } else {
                    Dcorr = 552
                }
            } else { // 月在外道
                if (WinsolsDif < Solar25) {
                    Dcorr = 552 * WinsolsDif / Solar25
                } else if (WinsolsDif <= Solar50 + Solar25) {
                    Dcorr = 552
                } else {
                    Dcorr = 552 * (Solar - WinsolsDif) / Solar25
                }
            }
            Dcorr /= Denom
            const signBushi = NodeAccum > Node50 ? -1 : 1
            const Bushi = Math.abs(NodeDif + signBushi * Dcorr)
            Magni = 15 - Bushi / (104 / Denom - Dcorr / 15)
        } else {
            if (i >= 1 && i <= 3) {
                if (NodeAccumHalf > Node25) { // 交前
                    Dcorr = 200
                } else {
                    Dcorr = 100
                }
            } else if (i >= 4 && i <= 6) {
                Dcorr = 54
            } else if (i >= 7 && i <= 9) {
                if (NodeAccumHalf > Node25) { // 交前
                    Dcorr = 100
                } else {
                    Dcorr = 200
                }
            } else if (i >= 10 && i <= 12) {
                Dcorr = 224
            }
            Dcorr /= Denom
            NodeDif -= Dcorr
            Magni = (HalfSynodicNodeDif - NodeDif) / (104 / Denom) // 準確的是103.554111
        }
        if (NodeDif < 0) {
            Magni = 15
            status = 1 // 不足減者，食旣    
        }
        const LastList = [0, 1, 2, 3, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20]
        if (Magni > 0 && Magni < 15) {
            Last = LastList[~~Magni] + (Magni - ~~Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
        } else if (Magni === 15) {
            Last = LastList[Magni]
        }
        Last -= Last * (AutoTcorr(AnomaAccum, 0, CalName).MoonTcorr2 - AutoTcorr((AnomaAccum - 1 + Anoma) % Anoma, 0, CalName).MoonTcorr2) // 再考慮入變增減率，卽實平行之差。速減遲加
    }

    if (Magni < 0) {
        Magni = 0
        status = 0
        Last = 0
    }
    let portion = 0.6
    const StartDeci = Last ? Deci - Last * portion / 200 : 0
    return { Magni, status, Deci, StartDeci, Last }
}
// console.log(EclipseTable2(14.7, 24, 0.3, 15, 2, 0, 1, 'Huangji').Deci)

const EclipseTable3 = (NodeAccum, AnomaAccum, Deci, WinsolsDifRaw, isNewm, CalName) => { // 入交定日，入轉日，定朔分，距冬至日數，月份，閏月序數，朔望，名字。用月份判斷很奇怪，但是沒有證據說是用節氣判斷，皇極有兩條「閏四月內」，那肯定就是月份
    const { AutoPara, Type } = Bind(CalName)
    const { Node, Anoma, Lunar, Solar, Denom, AcrTermList, MoonTcorrList } = AutoPara[CalName]
    let { SunLimitYang, SunLimitYin, MoonLimit2 } = AutoPara[CalName]
    if (SunLimitYang) {
        SunLimitYang /= Denom
        SunLimitYin /= Denom
    }
    if (MoonLimit2) {
        MoonLimit2 /= Denom
        // MoonLimitDenom /= Denom
    }
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const Node50 = Node / 2
    const Node25 = Node / 4
    const NodeAccumHalf = NodeAccum % Node50
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const Solar75 = Solar * 0.75
    const WinsolsDif = WinsolsDifRaw % Solar
    let LimitCorr = 0 // 大衍食限修正
    let Tcorr = 0 // 食甚時刻
    let Dcorr = 0
    let Magni = 0 // 食分
    let status = 0 // 1全，2偏
    let Last = 0
    let SunLimit = 0
    const NodeDif = NodeAccumHalf2NodeDif(NodeAccumHalf, Node25, Node50)
    let LimitCorrDif = 0
    if (isNewm) {
        if (CalName === 'Dayan') {
            let TermNum = 0
            const SunDcorrList = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 385, 325, 270, 220, 175, 135, 100, 70, 45, 25, 10, 0, 10]
            for (let j = 0; j <= 23; j++) {
                if (WinsolsDif >= AcrTermList[j] && WinsolsDif < AcrTermList[j + 1]) {
                    TermNum = j % 24
                    break
                }
            }
            // 接下來調用拉格朗日內插
            const Initial = AcrTermList[TermNum] + ',' + SunDcorrList[TermNum] + ';' + AcrTermList[TermNum + 1] + ',' + SunDcorrList[TermNum + 1] + ';' + AcrTermList[TermNum + 2] + ',' + SunDcorrList[TermNum + 2]
            LimitCorr = Interpolate3(WinsolsDif, Initial) // 當日差積
            if (WinsolsDif > Solar50) {
                LimitCorr = -LimitCorr
            }
            LimitCorrDif = (1275 + LimitCorr) / Denom //  食定差=冬至食差+LimitCorr
            if (NodeAccum > Node50) {
                SunLimit = SunLimitYin
                if (NodeDif < LimitCorrDif) {
                    SunLimit = SunLimitYang
                }
            } else {
                SunLimit = SunLimitYang
            }
            SunLimit += LimitCorr / Denom // 食定限=食限+LimitCorr
        }
        if (NodeDif > SunLimit) {
            return {
                status: 0,
                Magni: 0,
                Last: 0,
                Deci
            }
        }
    }
    if (['Dayan', 'Zhide'].includes(CalName)) { // 大衍以陽城爲準，有月食食甚時刻修正，和日食修正一樣。正元五紀沒有月食時差記載，同大衍                
        Tcorr = NodeDif * 0.0785 / 20  // 同名（同在表）相加異名（同在裏）相減。但是頁540算例方向跟這裡不一樣
        if (WinsolsDif > Solar25 && WinsolsDif < Solar75) { // 日在赤道北
            if (NodeAccum < Node50) {
                Tcorr = -Tcorr
            }
        } else if (NodeAccum > Node50) {
            Tcorr = -Tcorr
        }
    }
    let style = 1 // 陰曆食
    if (['Dayan', 'Zhide'].includes(CalName)) { // 大衍之後，月食食分的節氣改正取消
        if (isNewm) {
            let RelNodeDif = NodeDif + LimitCorrDif // 視去交=去交定分+食定差
            if (NodeAccum > Node50) {
                RelNodeDif = NodeDif - LimitCorrDif
            }
            if (NodeAccum > Node50) {
                Magni = 15 - (RelNodeDif - 104 / Denom) / (143 / Denom)
                if (NodeDif < LimitCorrDif) {
                    style = 2 // 類同陽曆食
                    Magni = (SunLimit + NodeDif) / (90 / Denom)
                }
            } else {
                style = 3 // 陽曆食
                Magni = NodeDif / (90 / Denom) // (SunLimitYang - NodeDif) / (90 / Denom) // 《中國古代曆法》頁534改爲注釋中的
            }
            const ExMagniFunc = ExMagni(Magni, Type)
            Magni = ExMagniFunc.Magni
            status = ExMagniFunc.status
            if (Magni) {
                Last = Magni + 2
            }
            if (style === 1) {
                if (RelNodeDif < 35 / Denom) { // 頁534寫成了15
                    Last = 20.5
                } else if (RelNodeDif < 70 / Denom) { // 頁534、校勘記都說是>，但這樣就太扯淡了
                    Last = 20
                }
            } else if (style === 2) {
                if (RelNodeDif < 4 / Denom) {
                    Last = 21.25
                } else if (RelNodeDif < 20 / Denom) {
                    Last = 20
                }
            }
            Last -= Last * (MoonTcorrList[(~~AnomaAccum + 1) % Anoma] - MoonTcorrList[~~AnomaAccum]) / Denom
        } else {
            if (NodeDif <= 779 / Denom) {
                Magni = 15 //   月全食
                status = 1
            } else {
                Magni = (HalfSynodicNodeDif - NodeDif) / (183 / Denom)
            }
            if (Magni) {
                if (Magni < 11) {
                    Last = Magni + 4
                } else {
                    Last = Magni + 5
                }
            }
            if (NodeDif < 260 / Denom) {
                Last = 21
            } else if (NodeDif < 520 / Denom) {
                Last = 20.5
            }
            Last -= Last * (MoonTcorrList[(~~AnomaAccum + 1) % Anoma] - MoonTcorrList[~~AnomaAccum]) / Denom
        }
    } else if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
        if (CalName === 'Wuji') {
            if (NodeAccum > Node / 2) {
                if (WinsolsDif > Solar75 || WinsolsDif < Solar / 4) { // 本來應該是5，夏至不盡，我直接改成連續了
                    Dcorr = 457
                } else if (WinsolsDif >= Solar / 4 && WinsolsDif < Solar / 2) {
                    Dcorr = 457 - 5.00486 * (WinsolsDif - Solar / 4)
                } else {
                    Dcorr = 5.00486 * (WinsolsDif - Solar / 2)
                }
            } else {
                if (WinsolsDif > Solar / 4 && WinsolsDif < Solar75) {
                    Dcorr = 457
                } else if (WinsolsDif >= Solar75) {
                    Dcorr = 457 - 5.00486 * (WinsolsDif - Solar75)
                } else {
                    Dcorr = 5.00486 * WinsolsDif
                }
            }
            Dcorr /= Denom
        } else {
            if (NodeAccum > Node / 2) {
                if (WinsolsDif > Solar75 || WinsolsDif < Solar / 4) {
                    Dcorr = 373
                } else if (WinsolsDif >= Solar / 4 && WinsolsDif < Solar / 2) { // 本來應該是4，夏至不盡，我直接改成連續了
                    Dcorr = 373 - 4.084934 * (WinsolsDif - Solar / 4)
                } else {
                    Dcorr = 4.084934 * (WinsolsDif - Solar / 2)
                }
            } else {
                if (WinsolsDif > Solar / 4 && WinsolsDif < Solar75) {
                    Dcorr = 373
                } else if (WinsolsDif >= Solar75) {
                    Dcorr = 373 - 4.084934 * (WinsolsDif - Solar75)
                } else {
                    Dcorr = 4.084934 * WinsolsDif
                }
            }
            Dcorr /= Denom
        }
    }
    if (NodeDif * MoonAvgVDeg > 13) { // 大衍月食去交十三度以上，光影相接，或不見食
        status = 3
    }
    Deci += Tcorr
    const StartDeci = Deci - Last / 200
    const ExMagniFunc = ExMagni(Magni, Type)
    return { status: ExMagniFunc.status, Last, Magni: ExMagniFunc.Magni, StartDeci, Deci }
}
// console.log(EclipseTable3(26.747352, 21.200901, 0.320611, 220.091118, 1, 'Dayan').Magni) // 頁538示例
// console.log(EclipseTable3(26.74735, 21.20092, 0.3194809, 220.09112, 1, 'Dayan')) // 程序實際的參數
// console.log(EclipseTable3(14.300434, 8.411596, 0.825769, 235.059, 0, 'Dayan').Deci) 

// 大衍第一次提出陰陽食限。宣明之後直接採用去交、食限，捨棄大衍的變動食限
const EclipseFormula = (AvgNodeAccum, AvgAnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDif, AvgWinsolsDif, isNewm, CalName) => {
    const { Type, AutoPara } = Bind(CalName)
    const { Solar, Lunar, Node, Anoma, MoonAcrVList, Denom, XianConst, SunLimitYang, SunLimitYin, MoonLimit1, MoonLimit2
    } = AutoPara[CalName]
    let { MoonLimitDenom } = AutoPara[CalName]
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const Node50 = Node / 2
    const Node25 = Node / 4
    const Anoma50 = Anoma / 2
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const Solar75 = Solar * 0.75
    const HalfTermLeng = Solar / 24
    const { Tcorr2: AvgTcorr, SunTcorr, MoonTcorr: AvgMoonTcorr, MoonAcrV, NodeTcorr: AvgNodeTcorr
    } = AutoTcorr(AvgAnomaAccum, AvgWinsolsDif, CalName) // 經朔修正    
    const AcrAnomaAccum = (AvgAnomaAccum + AvgTcorr) % Anoma // 定朔入轉
    const AvgNodeAccumCorr = AvgNodeAccum + SunTcorr // 朔入交常日    
    const AcrNodeAccum = AvgNodeAccum + AvgNodeTcorr // 紀元之外的朔入交定日
    const AcrNewmNodeAccum = AvgNodeAccum + AvgTcorr // 定朔入交泛日
    const NewmNoonDif = Math.abs(0.5 - AcrDeci) // 應天乾元儀天崇天午前後分
    const Rise = Longi2LatiFormula(AcrWinsolsDif, CalName).Rise / 100 // 照理說，只要冬至時刻確定，那不管WinsolsDif在一天中如何變化，日出都是固定的，不知道程序算出來是不是這樣    
    // let NodeAccumHalf = AvgNodeAccum % Node50 // 用來判斷交前交後
    // let sign = 1
    // if (NodeAccumHalf > Node25) { // 交前、先交。按照《紀元曆日食算法及精度分析》頁147提到交前。看了下，紀元並沒有提到交前交後的區分
    //     sign = -1
    // }
    let isDescend = true // 交初前後皆爲交初
    if (AvgNodeAccum > 12 && AvgNodeAccum < 15) { // 交中前後皆為交中
        isDescend = false
    }
    let Tcorr0 = 0
    let AvgTotalDeci = 0
    let AvgTotalNoonDif = 0 // 紀元中前後分
    if (Type === 9) { // 紀元食甚泛餘，藤豔輝《紀元曆日食算法及精度分析》說卽定朔到眞食甚的改正，我覺得不是。最後《中》說加上經朔，藤豔輝說加上定朔，藤豔輝錯了
        const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AcrAnomaAccum, CalName) // 這個損益率應該是與定朔改正相反
        Tcorr0 = AvgTcorr * MoonTcorrDif / TheDenom / Denom
        AvgTotalDeci = (AcrDeci + Tcorr0 + 1) % 1 // 紀元食甚泛餘 // 注意小數點加上修正變成負的情況，比如0.1退成了0.9
        AvgTotalNoonDif = Math.abs(0.5 - AvgTotalDeci)
    }
    const RiseNoonDif = 0.5 - Rise // 日出沒辰刻距午正刻數/100    
    ////////// 以下時差
    let TotalDeci = 0 // 食甚定餘
    let Tcorr = 0 // 明天沒有時差！《數理》頁424
    if (isNewm) {
        if (CalName === 'Xuanming') { // 「以定朔日出入辰刻距午正刻數，約百四十七，為時差。視定朔小餘如半法已下，以減半法，為初率；已上，減去半法，餘為末率。以乘時差，如刻法而一，初率以減，末率倍之，以加定朔小餘，為蝕定餘。月蝕，以定望小餘為蝕定餘。」夏至最大，冬至最小，夜半最大，午正最小。但實際上是夏至最小，冬至最大。午前- 午後+。實際上，時差取決於黃道南北，與午正無關，比例也不會不一樣。《數理》頁421: 定朔0.25，1個小時，0.75：2小時。欽天、應天、乾元、儀天都是線性函數，不分陰陽
            Tcorr = -NewmNoonDif * RiseNoonDif / 1.47
            if (AcrDeci >= 0.5) {
                Tcorr *= -2
            }
        } else if (CalName === 'Yitian') { // 「以其日晝刻，其（瀚案：根據宣明，應該是約）三百五十四為時差，乃視食甚餘，如半法以下，返減半法，餘為初率；半法以上者，半法去之，餘為末率；滿一百一收之，為初率；以減末率，倍之，以加食甚餘，為食定餘；亦加減初、末率，為距午退分」儀天有點殘破，應該根據宣明來補，這兩個比例差不多
            Tcorr = -NewmNoonDif * RiseNoonDif / (1.77 * 84 / 101)
            if (AcrDeci >= 0.5) {
                Tcorr *= -2
            }
        } else if (CalName === 'Qianyuan') { // 「以半晝刻約刻法為時差，乃視定朔小餘，在半法以下為用減半法為午前分；以上者去之，為午後分；以時差乘，五因之，如刻法而一，午前減，午後加」
            Tcorr = -NewmNoonDif * RiseNoonDif
            if (AcrDeci >= 0.5) {
                Tcorr = -Tcorr
            }
        } else if (CalName === 'Yingtian') { // 以午前後分「乘三百，如半晝分而一，為差；〔午後加之，午前半而減之〕。加減定朔分，為食定餘；以差皆加午前、後分，為距中分。其望定分，便為食定餘」
            Tcorr = -(150 / Denom) * NewmNoonDif / RiseNoonDif
            if (AcrDeci >= 0.5) {
                Tcorr *= -2
            }
        } else if (['Chongxuan', 'Chongtian', 'Guantian'].includes(CalName)) { // 「定朔約餘距午前後分，與五千先相減後相乘，三萬除之；午前以減，午後倍之，以加約餘」崇天「午後以一萬三千八百八十五除之」，應該改成一萬五千八百八十五
            Tcorr = -NewmNoonDif * (0.5 - NewmNoonDif) / 3 // 午前，0-0.5<0, f(0.25)=-0.0208
            if (AcrDeci >= 0.5) {
                Tcorr = -2 * Tcorr
            }
        } else if (CalName === 'Mingtian') {
            TotalDeci = (AvgDeci + AvgMoonTcorr) * 13.37 / MoonAcrV + SunTcorr
        } else if (Type === 9) {
            Tcorr = -AvgTotalNoonDif * (0.5 - AvgTotalNoonDif) / 1.5
            if (AvgTotalDeci >= 0.5) {
                Tcorr = -1.5 * Tcorr
            }
        } else if (Type === 10 || Type === 11) {
            Tcorr = -NewmNoonDif * (0.5 - NewmNoonDif)
            if (AcrDeci >= 0.5) { // 「在中前爲減，中後爲加」。「退二位」。最大值一個半小時左右《中國古代的日食時差算法》
                Tcorr = -Tcorr
            }
            if (Type === 10) {
                Tcorr *= 1.046
            } else {
                Tcorr *= 100 / 96
            }
        }
    } else {
        let AvgTotalDeciHalfRev = AvgTotalDeci % 0.5
        if (AvgTotalDeciHalfRev > 0.25) {
            AvgTotalDeciHalfRev = 0.5 - AvgTotalDeciHalfRev
        }
        if (Type === 9) {
            if (AvgTotalDeci > 0.5) {
                Tcorr = -(AvgTotalDeciHalfRev ** 2) / 3
            } else if (AvgTotalDeci < (2 / 3) * Rise) {
                Tcorr = ((4 / 3) * Rise - AcrDeci) * AcrDeci / 1.5
            } else {
                const tmp = 2 * (Rise - AvgTotalDeci)
                Tcorr = ((4 / 3) * Rise - tmp) * tmp / 1.5
            }
        } else if (Type === 10) {
            Tcorr = AvgTotalDeciHalfRev ** 2 / 5
        } else if (CalName === 'Shoushi') { // 大統取消授時的月食時差改正
            Tcorr = AvgTotalDeciHalfRev ** 2 / 4.78
            if (AcrDeci > 0.5) { // 子前以減
                Tcorr = -Tcorr
            }
        }
    }
    if (Type === 9) {
        TotalDeci = AvgTotalDeci + Tcorr
    } else if (CalName === 'Mingtian') {
        TotalDeci = 0 ///////////////////
    } else {
        TotalDeci = AcrDeci + Tcorr
    }
    TotalDeci = (TotalDeci + 1) % 1
    let TheTotalNoonDif = 0
    if (Type === 9 || ['Mingtian', 'Guantian'].includes(CalName)) {
        TheTotalNoonDif = Math.abs(0.5 - TotalDeci) // 觀天紀元午前後分
    } else {
        TheTotalNoonDif = NewmNoonDif + Math.abs(Tcorr) // 距午分，崇天午前後定分
    }
    const k = 1 - TheTotalNoonDif / RiseNoonDif // 如果k<0，卽TheTotalNoonDif在日出前日落後，符號相反，所以把原來的Math.abs(k)直接改成k
    let TheWinsolsDif = 0
    let TheWinsolsDifHalf = 0
    let TheWinsolsDifHalfRev = 0
    if (['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].includes(CalName)) { // 崇玄「距天正中氣積度」
        TheWinsolsDif = AcrWinsolsDif
        TheWinsolsDifHalf = TheWinsolsDif % Solar50 // 應天「置朔定積，如一百八十二日⋯⋯以下爲入盈日分；以上者去之，餘爲入縮日分」
        TheWinsolsDifHalfRev = TheWinsolsDifHalf
        if (TheWinsolsDifHalfRev > Solar25) { // 以二分爲中心鏡面對稱
            TheWinsolsDifHalfRev = Solar50 - TheWinsolsDifHalfRev
        }
    } else if (CalName === 'Mingtian' || Type === 9) {
        if (CalName === 'Mingtian') {
            TheWinsolsDif = AcrWinsolsDif + Tcorr
        } else if (Type === 9) {
            TheWinsolsDif = AvgWinsolsDif + Tcorr0 + Tcorr
        }
        TheWinsolsDif += AutoDifAccum(0, TheWinsolsDif, CalName).SunDifAccum // 紀元食甚日行積度
        TheWinsolsDifHalf = TheWinsolsDif % Solar50
        TheWinsolsDifHalfRev = TheWinsolsDifHalf
        if (TheWinsolsDifHalfRev > Solar25) {
            TheWinsolsDifHalfRev = Solar50 - TheWinsolsDifHalfRev
        }
    }
    // 宣明曆創日食四差：【時差Tcorr】食甚時刻改正【氣差DcorrTerm刻差DcorrClock加差DcorrOther】食分改正 
    let DcorrTerm = 0
    let DcorrClock = 0
    let DcorrOther = 0 // 儀天加差全同宣明
    let Dcorr = 0
    let status = 0
    let Magni = 0
    let Last = 0
    // 下爲食分改正 // 三差與月亮天頂距有關，與午正前後無關，古曆卻將此作爲正負判斷依據，完全不對
    let sign1 = 1 // 應天赤道差「盈初縮末（冬至前後）內減外加，縮初盈末內加外減」乾元離差「春分後陰加陽減，秋分後陰減陽加」紀元氣差「在冬至後末限、夏至後初限，〔交初以減，交中以加。〕夏至後末限、冬至後初限，〔交初以加，交中以減。〕」崇天「春分後，交初以減，交中以加」
    if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        if (AcrNewmNodeAccum >= Node50) {
            sign1 = -1
        }
    } else if (isDescend) {
        sign1 = -1
    }
    if (TheWinsolsDif >= Solar25 && TheWinsolsDif < Solar75) {
    } else {
        sign1 = -sign1
    }
    let sign2 = 1 // 黃道差符號「入盈，以定分午前內減外加」儀天黃道差「冬至後，甚在午正東，陰減陽加；甚在午正西，陰加陽減；夏至後即返此」紀元刻差符號「冬至後食甚在午前，夏至後食甚在午後，交初以加，交中以減」崇天「冬至後食甚在午前，夏至後食甚在午後。交初以加，交中以減」
    if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) {
        if (AcrNewmNodeAccum >= Node50) {
            sign1 = -1
        }
    } else if (!isDescend) {
        sign2 = -1
    }
    if (TotalDeci < 0.5) {
    } else {
        sign2 = -sign2
    }
    if (TheWinsolsDif < Solar50) { } else {
        sign2 = -sign2
    }
    let sign3 = 1
    if (TotalDeci > 0.5) {
        if (!isDescend) {
            sign3 = -1
        }
    } else {
        if (isDescend) {
            sign3 = -1
        }
    }
    if (CalName === 'Xuanming') {
        DcorrTerm = (2350 - 26 * TheWinsolsDifHalfRev) * k // 25.73618
        DcorrTerm = DcorrTerm < 0 ? 0 : DcorrTerm // 因為26不連續，最後剩了一天<0
        if (TheWinsolsDifHalf < HalfTermLeng * 3) {
            DcorrClock = 2.1 * ~~TheWinsolsDifHalfRev // 連續的話我改成2.06985
        } else if (TheWinsolsDifHalf < HalfTermLeng * 9) {
            DcorrClock = 94.5
        } else {
            DcorrClock = 94.5 - 2.1 * (~~TheWinsolsDifHalfRev - HalfTermLeng * 9)
        }
        DcorrClock = DcorrClock < 0 ? 0 : DcorrClock * TheTotalNoonDif // 應該不用*100
        if (TheWinsolsDif < HalfTermLeng * 3) {
            DcorrOther = 51 - TheWinsolsDif * 17 / HalfTermLeng
        } else if (TheWinsolsDif > HalfTermLeng * 21) {
            DcorrOther = (TheWinsolsDif - HalfTermLeng * 21) * 17 / HalfTermLeng
        }
    } else if (CalName === 'Chongxuan') { // 崇玄氣差叫「陰曆蝕差」「以減三百六十五度半，餘以千乘，滿三百六十五度半除爲分」。崇玄在兩本書中都沒有，只能自己根據古文翻譯
        const C = (365.5 - TheWinsolsDif) * 1000 / 365.5 // 限心
        const R = (C + 250 + 1000) % 1000 // 限首
        const L = (C - 250 + 1000) % 1000 // 限尾。「滿若不足，加減一千」
        TotalDeci *= 1350
        AvgNodeAccum *= 1350 // 去交度分到底是什麼？我不知道
        const tmp4 = Math.min(Math.abs(TotalDeci - R), Math.abs(TotalDeci - L)) // 限內外分
        let Std1 = 0
        let Std2 = 0
        if (L < R) { // 內
            DcorrTerm = 630 - tmp4 * tmp4 / 179 // +-335.812以內爲正，極值630
            DcorrClock = (500 - tmp4) * tmp4 / 313.5 // 陽曆蝕差
            Std1 = DcorrTerm + DcorrClock // 既前法
            Std2 = 1480 - Std1 // 既後法
            if (AvgNodeAccum > Node50 * 1350) {
                AvgNodeAccum += DcorrClock
            } else {
                AvgNodeAccum = DcorrClock - AvgNodeAccum
                if (AvgNodeAccum < 0) {
                    status = 0
                }
            }
        } else { // 外
            DcorrTerm = (500 - tmp4) * tmp4 / 446 // 0-500爲正，極值140.135
            Std1 = 610
            Std2 = 880
            if (AvgNodeAccum > Node50 * 1350) {
                AvgNodeAccum -= DcorrTerm // 這樣加減之後就是「去交定分」
                if (AvgNodeAccum < 0) {
                    status = 0
                } else {
                    status = 0
                }
            }
        }
        if (AvgNodeAccum < Std1) { // 「既前者，陽歷也」
            Magni = 10 * AvgNodeAccum / Std1
        } else { // 「在既後者，其虧復陰歷也」
            Magni = 10 * (1480 - AvgNodeAccum) / Std2
        }
    } else if (CalName === 'Yingtian') {
        DcorrTerm = (374 - 4 * TheWinsolsDifHalfRev) * k // 藤豔輝頁101：最大值52.41分鐘
        if (TheWinsolsDifHalf > 45 && TheWinsolsDifHalf < 137) { // 最大值0.075日
            DcorrClock = 1500 * TheTotalNoonDif
        } else {
            if (TheWinsolsDifHalf < 45) {
                TheWinsolsDifHalf = 45 - TheWinsolsDifHalf
                DcorrClock = 33.5 * TheWinsolsDifHalf * TheTotalNoonDif
            } else {
                TheWinsolsDifHalf -= 137
                DcorrClock = (1500 - 33.5 * TheWinsolsDifHalf) * TheTotalNoonDif
            }
        }
    } else if (CalName === 'Qianyuan') {
        if (TheWinsolsDifHalf < 90) {
            DcorrTerm = 9.1 * TheWinsolsDifHalf
        } else {
            TheWinsolsDifHalf -= 90
            DcorrTerm = (819 - 9.1 * TheWinsolsDifHalf)  // 《中國古代曆法》頁96說二至前是二至後的10倍，寫錯了吧？ // 藤豔輝頁101說乾元刻差極值15.2小時，沒對吧/
        }
        if (k > 0) {
            DcorrTerm *= k
        }
        if (TheWinsolsDifHalf >= 45 && TheWinsolsDifHalf < 137) {
            DcorrClock = 33.3 // 單位是刻分。極值0.11日
        } else {
            if (TheWinsolsDifHalf < 45) {
                DcorrClock = 0.74 * TheWinsolsDifHalf
            } else {
                TheWinsolsDifHalf -= 137
                DcorrClock = 33.3 - 0.74 * TheWinsolsDifHalf
            }
        }
        DcorrClock *= TheTotalNoonDif * 20
    } else if (CalName === 'Yitian') { // 儀天的範圍是定氣，所以要以二至對稱。但是兩個算式又有什麼區別呢，我還是統一爲以前的。
        const { QuarA, QuarB } = AutoQuar(CalName)
        if (TheWinsolsDif >= QuarA && TheWinsolsDif < Solar50 + 946785.5 / Denom) {
            DcorrTerm = 2826 / QuarB * TheWinsolsDifHalfRev
        } else {
            DcorrTerm = 2826 / QuarA * TheWinsolsDifHalfRev
        }
        DcorrTerm = (2826 - 30.15 * TheWinsolsDifHalfRev)
        if (k > 0) {
            DcorrTerm *= k
        }
        if (TheWinsolsDif < HalfTermLeng * 3) {
            DcorrClock = 100 * TheWinsolsDif * Denom / 442384 // 藤豔輝頁100說二至前後205日分，其餘13.5小時，這也太扯淡，我這樣處理一下，能夠大致連續，但跟原文差得有點多
        } else if (TheWinsolsDif < HalfTermLeng * 9) {
            DcorrClock = 113.625
        } else if (TheWinsolsDif < HalfTermLeng * 12) {
            TheWinsolsDif -= HalfTermLeng * 9
            DcorrClock = 164.57 - TheWinsolsDif * Denom / 279858
        } else if (TheWinsolsDif < HalfTermLeng * 15) {
            DcorrClock = TheWinsolsDif * Denom / 279858
        } else if (TheWinsolsDif < HalfTermLeng * 21) {
            DcorrClock = 113.625
        } else {
            TheWinsolsDif -= HalfTermLeng * 21
            DcorrClock = 104.1 - TheWinsolsDif * Denom / 442384
        }
        DcorrClock *= TheTotalNoonDif * 10
        if (TotalDeci > 0.5) {
            if (TheWinsolsDif < HalfTermLeng * 3) {
                DcorrOther = 61.32 - TheWinsolsDifHalf * 20.44 / HalfTermLeng
            } else if (TheWinsolsDif > HalfTermLeng * 21) {
                TheWinsolsDif -= HalfTermLeng * 21
                DcorrOther = TheWinsolsDif * 20.44 / HalfTermLeng
            }
        }
    } else if (CalName === 'Mingtian') {
        if (TheWinsolsDifHalf > Solar / 6) {
            TheWinsolsDifHalf = Solar50 - TheWinsolsDifHalf
        }
        DcorrTerm = 508 - (106 / 3093) * (243.5 - TheWinsolsDifHalf) * TheWinsolsDifHalf // 以121.75對稱，f(0)=508，也就是solar=365.25 // 但問題是solar/6前後跨度也太大了？？
        DcorrClock = (106 / 3093) * (243.5 - TheWinsolsDifHalf) * TheWinsolsDifHalf
        DcorrTerm *= TheTotalNoonDif * 4 // 這個數字跟日法39000比起來也太小了啊
        DcorrClock *= TheTotalNoonDif * 4 // NoonDifDenom / 9750
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
            DcorrTerm = (4010 - TheWinsolsDifHalf ** 2 / 1.97) * k
        } else {
            DcorrTerm = (4010 - TheWinsolsDifHalf ** 2 / 2.19) * k
        }
        DcorrClock = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / 2.09
        DcorrClock *= TheTotalNoonDif * Denom / 3700.5 // 單位 午前後分
    } else if (Type === 11) {
        DcorrTerm = (4.46 - TheWinsolsDifHalfRev ** 2 / 1870) * k
        DcorrClock = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / 1870
        DcorrClock *= NewmNoonDif * 4
    } else {
        const portion = +(3.43 * 7290 / Denom).toFixed(2) // 3*Solar25**2 ，以紀元爲準。紀元3.43，崇天2.36，大明4.78
        const DcorrTermMax = Math.round(91.31 ** 2 / (portion + 0.0005)) // 崇天3533，紀元2430，大明1744
        if (CalName === 'Chongtian' || Type === 10) {
            DcorrTerm = (DcorrTermMax - TheWinsolsDifHalfRev ** 2 / portion) * k // NoonDif「以乘距午定分」
            DcorrClock = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / portion // 「置其朔中積，滿二至限去之，餘，列二至限於下，以上減下，餘以乘上」
            DcorrClock *= TheTotalNoonDif * 4 // 大明NoonDifDenom / 1307.5，授時 NoonDifDenom / 2500
        } else if (Type === 9) { // 紀元
            DcorrTerm = (DcorrTermMax - TheWinsolsDifHalfRev ** 2 / portion) * k // 置日食甚日行積度。紀元是午前後分，崇天是距午定分。紀元最後有「如半晝分而一，所得，在氣差已上者，即以氣差覆減之，余應加者為減，減者為加。」卽食甚在日出前日落後符號相反，但是其他曆沒有這個規定，照理說也應該是這樣
            const DcorrClockRaw = (Solar50 - TheWinsolsDifHalf) * TheWinsolsDifHalf / portion
            DcorrClock = DcorrClockRaw * TheTotalNoonDif * 4
            if (DcorrClock > DcorrClockRaw) { // 紀元「以午前後分乘而倍之，如半法而一」後面又來一句「⋯⋯如半法而一，所得，在刻差已上者，卽倍刻差，以所得之數減之，餘爲刻差定數，依其加減」  
                DcorrClock = DcorrClockRaw * 2 - DcorrClock
            }
        }
    }
    let k0 = 0 // 視白道比眞白道低，所以陽曆：視月亮距交大於眞月亮，陰曆：小於。
    if (Type === 9) { // 紀元「置朔入交常日⋯⋯以氣刻差定數各加減之，交初加三千一百，交中減三千，爲朔入交定日」
        if (isDescend) {
            k0 = 3100
        } else {
            k0 = -3000 // 5.685度
        }
    }
    Dcorr = (sign1 * DcorrTerm + sign2 * DcorrClock + sign3 * DcorrOther + k0 + (['Chongtian', 'Guantian'].includes(CalName) ? Tcorr : 0)) / (Type === 11 ? 1 : Denom)
    let TheNodeAccum = 0 // 入交定日
    if (isNewm) {
        if (Type === 9) {
            TheNodeAccum = AvgNodeAccumCorr + Dcorr
        } else if (CalName === 'Yingtian') {
            TheNodeAccum = AcrNewmNodeAccum + Dcorr
        } else {
            TheNodeAccum = AcrNodeAccum + Dcorr
        }
    } else {
        TheNodeAccum = AcrNodeAccum // 月食朔入交定日
    }
    let TheNodeDif = NodeAccumHalf2NodeDif(TheNodeAccum % Node50, Node25, Node50) // 交前後分
    let MoonAvgVDeg = 13.37
    if (CalName === 'Yingtian') { // 應天「分即百除，度即百通」藤豔輝頁117:900合9度，那我這麼算應該沒錯
        MoonAvgVDeg = AutoMoonAvgV(CalName)
        TheNodeDif = TheNodeDif * MoonAvgVDeg * 100
    } else {
        TheNodeDif *= Denom
    }
    if (isNewm) {
        let portion = 10
        if (CalName === 'Xuanming') {
            portion = 20 / 3 // 宣明日食定法爲限的1/15，崇天爲1/10
        }
        if (CalName === 'Yingtian') { // 藤豔輝《宋代》頁116
            if (TheNodeAccum < Node50) {
            } else {
                let tmp = (0.75 - TotalDeci) * MoonAvgVDeg * 20
                if (TotalDeci > 0.5) {
                    tmp /= 4
                }
                if (TheNodeDif < SunLimitYang) { // 類同陽曆分
                    if (TheNodeDif >= tmp) {
                        Magni = portion * (TheNodeDif - tmp) / SunLimitYang
                    } else {
                        Magni = portion * (TheNodeDif - portion * (TheNodeDif - tmp)) / SunLimitYang
                    }
                } else if (TheNodeDif < SunLimitYin) {
                    TheNodeDif -= SunLimitYang // 陰曆分
                    if (TheNodeDif >= tmp) {
                        Magni = portion * (TheNodeDif - tmp) / SunLimitYin
                    } else {
                        Magni = portion * (TheNodeDif - portion * (TheNodeDif - tmp)) / SunLimitYin
                    }
                }
            }
        } else if (CalName === 'Qianyuan') {
            if (TheNodeDif < SunLimitYang) {
                Magni = portion * TheNodeDif / SunLimitYang
            } else {
                TheNodeDif -= SunLimitYang
                Magni = portion * TheNodeDif / SunLimitYin
            }
        } else if (CalName === 'Yitian') {
            if (TheNodeDif < SunLimitYang) {
                Magni = portion * (TheNodeDif - 728 - 317) / SunLimitYang
            } else {
                Magni = portion * (SunLimitYang + SunLimitYin - TheNodeDif - 728) / SunLimitYin
            }
        } else if (['Chongtian', 'Guantian'].includes(CalName)) {
            let MagniMax = 0
            if (CalName === 'Chongtian') {
                MagniMax = 11200
            } else if (CalName === 'Guantian') {
                MagniMax = 12800
            }
            if (TheNodeAccum < Node50) {
            } else {
                if (TheNodeDif < SunLimitYang) {
                    Magni = TheNodeDif / (SunLimitYang / portion)
                } else { // 「置入交前後分，如陽曆食限以下者為陽曆食定分；已上者，覆減一萬一千二百，餘為陰曆食定分；不足減者，不食」奇怪的是陰曆限並沒有參與計算
                    TheNodeDif = MagniMax - TheNodeDif
                    Magni = TheNodeDif / (SunLimitYin / portion)
                }
            }
        } else if (Type === 9) {
            if (TheNodeAccum < Node50 && TheNodeDif < SunLimitYang) {
                Magni = (SunLimitYang - TheNodeDif) / (SunLimitYang / portion)
            } else if (TheNodeAccum >= Node50 && TheNodeDif < SunLimitYin) {
                Magni = (SunLimitYin - TheNodeDif) / (SunLimitYin / portion)
            }
        } else {
            if (AcrNodeAccum < Node50) {
            } else {
                if (TheNodeDif < SunLimitYang) { // 去交真定分小於陽曆食限，爲陽曆食
                    Magni = portion * TheNodeDif / SunLimitYang
                } else if (TheNodeDif < SunLimitYang + SunLimitYin) {
                    if (CalName === 'Xuanming') {
                        Magni = 15 - portion * (TheNodeDif - SunLimitYang) / SunLimitYin
                    } else {
                        Magni = portion * (SunLimitYang + SunLimitYin - TheNodeDif) / SunLimitYin
                    }
                } else if (TheNodeDif < HalfSynodicNodeDif) { // 僅入食限，不一定有食。光影相接，或不見食
                    status = 3
                } else {
                    Magni = 0
                }
            }
        }
    } else {
        if (CalName === 'Xuanming') {
            if (TheNodeDif < MoonLimit1) {
                Magni = 10 // 月全食
            } else if (TheNodeDif < HalfSynodicNodeDif) {
                Magni = (HalfSynodicNodeDif - TheNodeDif) / MoonLimitDenom
            } else {
            }
        } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) { // 儀天月食分計算方法不同，但表述不清，只能暫時用應天
            if (TheNodeDif < MoonLimit1) {
                Magni = 10
            } else if (TheNodeDif < MoonLimit2) {
                Magni = 10 * (MoonLimit2 - TheNodeDif) / (MoonLimit2 - MoonLimit1)
            }
            if (CalName === 'Yingtian' && Magni < 5 && (TotalDeci > 1 - 0.08 || TotalDeci < 0.08)) { // 「其食五分以下，在子正前後八刻內，以二百四十二除為食之大分，命十為限」
                Magni /= 2
            }
        } else if (['Chongtian', 'Guantian'].includes(CalName) || Type === 9) {
            MoonLimitDenom = MoonLimitDenom || MoonLimit2 * 0.0662 // 這個比例根據7部曆平均而來
            if (TheNodeDif < MoonLimit1) {
                Magni = 10
            } else {
                Magni = (MoonLimit2 - TheNodeDif) / MoonLimitDenom
            }
        }
    }
    if (Type === 11) {
        let status = 0
        if (isNewm) {
            if ((TotalDeci > Rise - XianConst && TotalDeci < (1 - Rise + XianConst)) && (AvgNodeAccum <= 0.6 || AvgNodeAccum >= 25.6 || (AvgNodeAccum >= 13.1 && AvgNodeAccum <= 15.2))) { // 《中國古代曆法》頁664，上下不同什麼意思啊
                status = 1
            }
        } else {
            if ((TotalDeci < Rise + XianConst && TotalDeci > (1 - Rise - XianConst)) && (AvgNodeAccum <= 1.2 || AvgNodeAccum >= 26.05 || (AvgNodeAccum >= 12.4 && AvgNodeAccum <= 14.8))) {
                status = 1
            }
        }
    }
    const MagniFunc = ExMagni(Magni, Type)
    Magni = MagniFunc.Magni
    status = MagniFunc.status
    if (CalName === 'Yingtian' && !isNewm) {
        if (TheNodeDif > 900) { // 「其前後分，以九百以上入或食或不食之限」
            status = 3
        }
    }
    // 食延
    let StartDeci = 0
    let EndDeci = 0
    if (Magni) {
        if (CalName === 'Yingtian') {
            let AcrAnomaAccumHalfInt = ~~(AcrAnomaAccum % Anoma50)
            let Plus = 0
            if (AcrAnomaAccum > Anoma50) {
                Plus = 14
            }
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
            if (isNewm) {
                Last = 26.46 * Magni
            } else {
                Last = 29.4 * Magni
            }
        } else if (CalName === 'Yitian') {
            if (isNewm) {
                Last = 54.54 * Magni
            } else {
                Last = 60.6 * Magni
            }
            if (TheNodeDif < 1726) {
                Last += 0.005 * Denom
                if (TheNodeDif < 856) {
                    Last += 0.005 * Denom
                }
                Last *= 1350 * 12 / Denom
            }
        } else if (CalName === 'Chongtian') { // 崇天觀天食分完全一樣
            if (isNewm) {
                if (TheNodeDif < SunLimitYang) {
                    Last = (84 - TheNodeDif / 100) * (TheNodeDif / 100) / 1.85
                } else {
                    Last = (140 - TheNodeDif / 100) * (TheNodeDif / 100) / 5.14
                }
            } else {
                Last = TheNodeDif ** 2 / 100
                if (isDescend) {
                    Last = 1112 - Last / 935
                } else {
                    Last = 900 - Last / 1156
                }
            }
            Last *= 1337 / MoonAcrVList[~~AcrAnomaAccum] // 這個計算還是很粗疏，都沒有算一日之中的具體速度，平行速也很粗疏
        } else if (CalName === 'Guantian') {
            if (isNewm) {
                if (TheNodeDif < SunLimitYang) {
                    Last = (98 - TheNodeDif / 100) * (TheNodeDif / 100) / 2.5 // 觀天只說250而一，沒說進二位
                } else {
                    Last = (140 - TheNodeDif / 100) * (TheNodeDif / 100) / 6.5
                }
            } else {
                Last = TheNodeDif ** 2 / 100
                if (isDescend) {
                    Last = 1203 - Last / 1138
                } else {
                    Last = 1083 - Last / 1264
                }
            }
            Last = Last * 1337 / MoonAcrVList[~~AcrAnomaAccum] // 這個計算還是很粗疏，都沒有算一日之中的具體速度，平行速也很粗疏
        } else if (Type === 9) {
            if (isNewm) {
                if (TheNodeAccum < Node50) {
                    Last = 583 - TheNodeDif ** 2 / 19800
                } else {
                    Last = 583 - TheNodeDif ** 2 / 31700
                }
            } else {
                Last = 656 - TheNodeDif ** 2 / 70400
            }
            const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif((AvgAnomaAccum + (TotalDeci - AvgDeci + 1) % 1) % Anoma, CalName) // 食甚加時入轉算外損益率。應朒者依其損益，應朏者益減損加其副
            Last += Last * MoonTcorrDif / TheDenom / Denom
        }
        StartDeci = (TotalDeci - Last / Denom + 1) % 1
        EndDeci = (TotalDeci + Last / Denom) % 1
        Last *= 200 / Denom // 刻數，用於天文模塊打印。宋曆Last是整個食延的一半
    }
    return { Magni, status, Last, StartDeci, TotalDeci, EndDeci } // start初虧，total食甚
}
// console.log(EclipseFormula(14.034249657, 11.1268587106, 0.45531, 0.44531, 31.9880521262, 31.9780521262, 1, 'Chongtian'))

export const AutoEclipse = (NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDifRaw, AvgWinsolsDifRaw, isNewm, CalName, i, Leap) => {
    const { Type } = Bind(CalName)
    let Eclipse = {}
    // 入交定日=去交定日=定朔望時刻日月距離黃白交點的時間（黃經差）。紀元、授時：求定朔望加時入交，先假設平朔望黃白交點不動，算出定朔望時刻月亮運動到交點的時間，與定朔算法一致，在算了氣差刻差之後，纔考慮交點退行。
    // 由於日月速度不同，月亮從正交運動到平朔望時刻的時間與太陽不同。月亮去交泛日=(Vs-Vn)/(Vm-Vn) * rs。Vn：交點退行速度，rs：入交日，(Vs-Vn)/(Vm-Vn)=交率/交數=交點月/交點年
    // NodeAccum 是太陽入交泛日，那麼月亮入交泛日是0.0785077 * NodeAccum。太陽入交定日=NodeAccum+NodeAccumCorr，月亮入交定日=0.0785077 * NodeAccum+NodeAccumCorr2
    if (Type <= 3 || ['Yuanjia', 'Daming', 'Liangwu'].includes(CalName)) {
        Eclipse = EclipseTable1(NodeAccum, CalName)
    } else {
        if (Type <= 6) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgWinsolsDifRaw, CalName, NodeAccum).NodeTcorr  // 定交分 
            Eclipse = EclipseTable2(NodeAccum, AnomaAccum, AcrDeci, AvgWinsolsDifRaw, isNewm, CalName, i, Leap)
        } else if (['Dayan', 'Zhide', 'Wuji', 'Tsrengyuan'].includes(CalName)) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgWinsolsDifRaw, CalName, NodeAccum).NodeTcorr  // 定交分 
            Eclipse = EclipseTable3(NodeAccum, AnomaAccum, AcrDeci, AvgWinsolsDifRaw, isNewm, CalName)
        } else if (Type <= 11) {
            Eclipse = EclipseFormula(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrWinsolsDifRaw, AvgWinsolsDifRaw, isNewm, CalName)
        }
    }
    return Eclipse
}

// 下景初方位
// const Ecli1c = (isEcliNewm, isEcliSyzygy, NewmYinyang) => {
//     const NewmEcliDirc = []
//     const SyzygyEcliDirc = []
//     for (let i = 1; i <= 14; i++) {
//         if (NewmYinyang === 1) {
//             if (isEcliSyzygy[i - 1] && isEcliNewm[i]) {
//                 NewmEcliDirc = '起西南'
//             } else if (isEcliSyzygy[i] && isEcliNewm[i + 1]) {
//                 SyzygyEcliDirc = '起東北'
//             } else if (isEcliNewm[i] && isEcliSyzygy[i]) {
//                 NewmEcliDirc = '起東南'
//                 SyzygyEcliDirc = '起西北'
//             }
//         } else {
//             if (isEcliSyzygy[i - 1] && isEcliNewm[i]) {
//                 NewmEcliDirc = '起西北'
//             } else if (isEcliSyzygy[i] && isEcliNewm[i + 1]) {
//                 SyzygyEcliDirc = '起東南'
//             } else if (isEcliNewm[i] && isEcliSyzygy[i]) {
//                 NewmEcliDirc = '起東北'
//                 SyzygyEcliDirc = '起西南'
//             }
//         }
//     }
//     return {
//         NewmEcliDirc,
//         SyzygyEcliDirc
//     }
// }
//////// 乾象入陰陽曆
// const a = (~~(OriginYear / Lunar) + i - (isNewm ? 1 : 0.5)) / EcliNumer - ~~((~~(OriginYear / Lunar) + i - (isNewm ? 1 : 0.5)) / EcliNumer)
// const b = a * EcliNumer * ShuoHeFen
