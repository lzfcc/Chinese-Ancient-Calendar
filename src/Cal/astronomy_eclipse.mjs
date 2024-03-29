import {
    Bind
} from './bind.mjs'
import {
    AutoTcorr,
    AutoSunTcorr
} from './astronomy_acrv.mjs'
import {
    Interpolate3
} from './equa_sn.mjs'
import {
    Longi2LatiFormula
} from './astronomy_formula.mjs'

const EclipseTable1 = (NodeAccum, CalName) => {
    const {
        AutoPara
    } = Bind(CalName)
    const {
        Node,
        Lunar,
        Sidereal,
        Solar,
    } = AutoPara[CalName]
    // if (!Node) {
    //     Node = Lunar * Ecli / (0.5 + Ecli) // 獨創發明！
    // }
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    // const HalfSynodicNodeDif = (Lunar - Node) / 2
    const HalfNode = Node / 2
    const QuarNode = Node / 4
    const NodeAccumHalf = NodeAccum % HalfNode
    let NodeDif = NodeAccumHalf
    if (NodeAccumHalf > QuarNode) {
        NodeDif = HalfNode - NodeDif
    }
    let status = 0
    let Magni = 15 - NodeDif * MoonAvgVDeg
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
    return {
        Magni,
        status,
        Node
    }
}
// console.log(EclipseTable1(0.001, 'Yuanjia').Node)

// 春夏秋冬各三月，那麼閏月怎麼辦呢，所以輸入的時候應該用day的noleapmon，閏月還是上一個月
const EclipseTable2 = (NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, i, Leap, isNewm, CalName) => {
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Node,
        Lunar,
        Anoma,
        Sidereal,
        Solar,
        Denom,
        NodeDenom,
    } = AutoPara[CalName]
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const HalfNode = Node / 2
    const QuarNode = Node / 4
    let NodeAccumHalf = NodeAccum % HalfNode
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    const HalfSolar = Solar / 2
    const QuarSolar = Solar / 4
    const OriginDif = OriginDifRaw % Solar
    const HalfTermLeng = Solar / 24
    const TermNum = Math.round(Math.ceil(OriginDif / HalfTermLeng) % 24.1) // 這樣重新索引應該沒問題
    const TermNewmDif = OriginDif - (TermNum - 1) * HalfTermLeng
    let NodeDif = NodeAccumHalf // 去交分 NodeDif
    if (NodeAccumHalf > QuarNode) {
        NodeDif = HalfNode - NodeAccumHalf
    }
    let SunLimit1 = HalfSynodicNodeDif // 單位是時間而非度數！
    let NodeAccumCorr = 0
    if (['Daye', 'Wuyin'].includes(CalName)) {
        if (CalName === 'Daye') {
            if (TermNum < 6) {
                NodeAccumCorr = Math.abs(OriginDif - HalfTermLeng) * 1380 / NodeDenom
            } else if (TermNum < 9) {
                NodeAccumCorr = 63600 / NodeDenom
            } else if (TermNum < 13) {
                NodeAccumCorr = Math.abs(OriginDif - 11 * HalfTermLeng) * 1380 / NodeDenom
            } else if (TermNum < 18) {
                NodeAccumCorr = -Math.abs(OriginDif - 13 * HalfTermLeng) * 900 / NodeDenom
            } else if (TermNum < 22) {
                NodeAccumCorr = -55000 / NodeDenom
            } else {
                NodeAccumCorr = -Math.abs(OriginDif - 23 * HalfTermLeng) * 1770 / NodeDenom
            }
        } else if (CalName === 'Wuyin') {
            if (TermNum >= 2 && TermNum < 5) {
                NodeAccumCorr = Math.abs(OriginDif - HalfTermLeng) * 1650 / NodeDenom
            } else if (TermNum < 9) {
                NodeAccumCorr = 76100 / NodeDenom
            } else if (TermNum < 12) {
                NodeAccumCorr = 76100 / NodeDenom - Math.abs(OriginDif - 8 * HalfTermLeng) * 1650 / NodeDenom
            } else if (TermNum < 14) {} else if (TermNum < 18) {
                NodeAccumCorr = -Math.abs(OriginDif - 13 * HalfTermLeng) * 1200 / NodeDenom
            } else if (TermNum < 22) {
                NodeAccumCorr = -95825 / NodeDenom
            } else {
                NodeAccumCorr = -63300 / NodeDenom + Math.abs(OriginDif - 21 * HalfTermLeng) * 2110 / NodeDenom
            }
            if ((TermNum >= 2 && TermNum < 5) || (TermNum === 10)) { // 後兩種修正與五星有關，暫時沒法加
                if (NodeAccum <= 1 / 6) {
                    NodeAccumCorr /= 2
                } else {
                    NodeAccumCorr = 0
                }
            }
        }
    }
    const NoonDif = Math.abs(NewmDecimal - 0.5)
    const SummerDif = Math.abs(OriginDif - HalfSolar)
    if (isNewm) {
        if (['Daye', 'Wuyin'].includes(CalName)) { // 《劉洪濤》頁458。最後有個條件是五行伏見，目前沒辦法加上去，還有個條件不懂什麼意思。戊寅見舊唐志一
            if (NodeAccum >= HalfNode) {
                if (NoonDif <= 0.125 && (i === 5 || i === 6)) {
                    SunLimit1 = 13 / 12
                } else if (OriginDif >= HalfTermLeng * 4 && OriginDif <= HalfTermLeng * 8 && NewmDecimal > 7 / 12) { // 春分前後。大業驚蟄和雨水順序跟現在對調。加時在未以西，只能假設是以午對稱。
                    SunLimit1 = 13 / 12
                } else if (OriginDif >= HalfTermLeng * 16 && OriginDif <= HalfTermLeng * 20 && NewmDecimal < 5 / 12) {
                    SunLimit1 = 13 / 12
                }
            } else {
                SunLimit1 = 1 / 12 // 去交一時。大約1.114度
                if (Math.abs(HalfTermLeng * 12 - OriginDif) <= 1 || Math.abs(HalfTermLeng * 6 - OriginDif) <= 1 || Math.abs(HalfTermLeng * 18 - OriginDif) <= 1) {
                    SunLimit1 = 0.5
                } else if (i >= 4 && i <= 6 && NoonDif <= 1.5 / 12) {
                    SunLimit1 = 1 / 6 // 去交二時
                } else if (Math.abs(HalfTermLeng * 6 - OriginDif) <= 3 || Math.abs(HalfTermLeng * 18 - OriginDif) <= 3) {
                    SunLimit1 = 1 / 6
                } else if (NodeAccumHalf > QuarNode) { // 先交
                    SunLimit1 = 1 / 6
                } else if (NodeAccumHalf < QuarNode && AnomaAccum > Anoma * 0.25 && AnomaAccum <= Anoma * 0.75) { // 這兩條我處理成「後交値縮，二時內亦食」
                    SunLimit1 = 1 / 6
                } else if (NodeAccumHalf > QuarNode && AnomaAccum < Anoma * 0.25 && AnomaAccum >= Anoma * 0.75) {
                    SunLimit1 = 1 / 6
                }
            }
        } else if (CalName === 'Huangji') {
            if (NodeAccum >= HalfNode) { // 在陰曆應食不食《中國古代曆法》頁531:黃道南食限小於黃道北，因為月在黃道北，視去交小於計算去交
                if (Math.abs(HalfTermLeng * 12 - OriginDif) <= 10 && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimit1 = 12.25 / 12
                } else if (Math.abs(HalfTermLeng * 12 - OriginDif) <= 20 && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimit1 = 12.5 / 12
                } else if (Math.abs(HalfTermLeng * 12 - OriginDif) <= 20 && NoonDif < 1 / 6 && NoonDif >= 0.125) {
                    SunLimit1 = 13 / 12
                } else if (Math.abs(HalfTermLeng * 12 - OriginDif) <= Lunar && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimit1 = 12.75 / 12
                } else if ((i === 6 || (Leap === 4 && i === Leap)) && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimit1 = 13 / 12
                } else if ((i === 6 || (Leap === 4 && i === Leap)) && NoonDif >= 0.125 && NoonDif < 1 / 6) {
                    SunLimit1 = 13.5 / 12
                } else if (OriginDif >= HalfTermLeng * 8 && OriginDif <= HalfTermLeng * 16 && NoonDif < 0.125 && NoonDif >= 1 / 12) {
                    SunLimit1 = 13.5 / 12
                } else if (OriginDif >= HalfTermLeng * 7 && OriginDif <= HalfTermLeng * 17 && NoonDif < 1 / 12 && NoonDif >= 1 / 24) {
                    SunLimit1 = 13.5 / 12
                } else if (OriginDif >= HalfTermLeng * 6 && OriginDif <= HalfTermLeng * 18 && NoonDif < 1 / 24) {
                    SunLimit1 = 13.5 / 12
                }
            } else {
                if (Math.abs(HalfTermLeng * 12 - OriginDif) <= Lunar && NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    SunLimit1 = 1 / 6
                } else if (Math.abs(HalfTermLeng * 12 - OriginDif) <= Lunar && NoonDif >= 1 / 12 && NoonDif < 0.125) {
                    SunLimit1 = 1.5 / 12
                } else if (Math.abs(HalfTermLeng * 12 - OriginDif) <= 46 && NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    SunLimit1 = 1.5 / 12
                } else if (Math.abs(HalfTermLeng * 12 - OriginDif) <= 46 && NoonDif >= 1 / 12 && NoonDif < 0.125) {
                    SunLimit1 = 1 / 12
                } else if (OriginDif >= HalfTermLeng * 8 && OriginDif <= HalfTermLeng * 16 && NoonDif < 1.25 / 12 && NoonDif >= 1 / 12) {
                    SunLimit1 = 0.5 / 12
                } else if (OriginDif >= HalfTermLeng * 7 && OriginDif <= HalfTermLeng * 17 && NoonDif < 1 / 12 && NoonDif >= 1 / 24) {
                    SunLimit1 = 0.5 / 12
                } else if (OriginDif >= HalfTermLeng * 6 && OriginDif <= HalfTermLeng * 18 && NoonDif < 1 / 24) {
                    SunLimit1 = 0.5 / 12
                }
            }
        } else if (CalName === 'Linde') {
            if (NodeAccum >= HalfNode && OriginDif >= Solar / 4 && OriginDif <= Solar * 0.75) { // 秋分至春分殘缺
                if (NoonDif > 0.18 - 0.137 * SummerDif / QuarSolar) {
                    SunLimit1 = 1373 / Denom + (137 / Denom) * SummerDif / QuarSolar
                }
            } else if (NodeAccum < HalfNode) { // 不應食而食有三組情況，滿足一組即可
                if (OriginDif >= Solar / 4 && OriginDif <= Solar * 0.75) {
                    if (NoonDif <= 0.07) {
                        SunLimit1 = 248 / Denom - (182.6 / Denom) * SummerDif / QuarSolar
                    } else if (NoonDif < 0.1744 - 0.1014 * SummerDif / QuarSolar) {
                        SunLimit1 = 60 / Denom
                    } else if (NoonDif < 0.1044 - 0.1014 * SummerDif / QuarSolar) {
                        SunLimit1 = 60 / Denom + (1644 / Denom) * SummerDif / QuarSolar
                    }
                } else if (NoonDif <= 0.12) {
                    SunLimit1 = 60 / Denom
                }
            }
        }
    }
    let Tcorr = 0
    if (['Daye', 'Wuyin'].includes(CalName)) {
        //  下戊寅食甚時刻修正（大業月食食甚無修正）。當然要先算出是否食，再來修正。戊寅時法6503：半日法，時餘：不足半辰的日分數的12倍。離交點越遠，修正值越大
        let TcorrTmp1 = 0 // 食甚時刻修正
        if (CalName === 'Daye') {
            if (i <= 3 && NodeDif >= 7 / 12) {
                TcorrTmp1 = 24 / Denom
            } else if (i >= 7 && i <= 9) {
                if (NodeDif >= 8 / 12 && NodeDif < 1) {
                    TcorrTmp1 = 24 / Denom
                } else if (NodeDif >= 1) {
                    TcorrTmp1 = 48 / Denom
                }
            }
        } else if (CalName === 'Wuyin') { // 「初命子半以一算，自後皆以二算爲一辰」也就是說初唐開始已經用子半了。
            if (NodeAccum < 7 || (NodeAccum >= 21 && NodeAccum < 27)) {
                TcorrTmp1 = -(isNewm ? 300 : 280) / Denom // 分母應該是日法。日食爲300月食爲280
            } else if ((NodeAccum >= 7 && NodeAccum < 13) || (NodeAccum >= 14 && NodeAccum < 21)) {
                TcorrTmp1 = (isNewm ? 300 : 280) / Denom
            } else if (NodeAccum >= 13 && NodeAccum < 14) {
                TcorrTmp1 = 550 / Denom
            } else if (NodeAccum >= 27) {
                TcorrTmp1 = -550 / Denom
            }
            // 還要加上：日出後日入前一時半，不注月食，卽12.5刻
            if (isNewm && NodeAccum >= HalfNode) {
                let sign = 1
                if (AnomaAccum > Anoma * 0.25 && AnomaAccum <= Anoma * 0.75) {
                    sign = -1
                }
                if (i <= 3 && NodeDif >= 1 / 3) {
                    TcorrTmp1 = sign * 280 / Denom
                } else if (i <= 6) {
                    TcorrTmp1 = sign * 280 / Denom
                } else if (i <= 9 && NodeDif >= 11 / 12 && sign > 1) {
                    TcorrTmp1 = 550 / Denom
                } else if (i <= 9 && NodeDif < 11 / 12 && sign > 1) {
                    TcorrTmp1 = 280 / Denom
                } else if (i <= 12 && NodeDif <= 5 / 12 && sign > 1) {
                    TcorrTmp1 = 280 / Denom
                }
            }
        }
        // 差率QuarDif
        NewmDecimal += TcorrTmp1 // 這一步很奇怪，我猜的
        const tmp = NewmDecimal % 0.25
        let QuarDif = tmp
        if (tmp >= 1 / 8) {
            QuarDif = 1 / 4 - tmp
        }
        let EcliTcorrTmp2 = NodeDif
        if (NodeDif <= 1 / 4) {
            EcliTcorrTmp2 = 3 / 12 + NodeDif
        } else if (NodeDif <= 1 / 2) {
            EcliTcorrTmp2 = 2 / 12 + NodeDif
        } else if (NodeDif <= 3 / 4) {
            EcliTcorrTmp2 = 1 / 12 + NodeDif
        } else if (NodeDif <= 1) {} else {
            EcliTcorrTmp2 = 1 - NodeDif
        }
        Tcorr = -EcliTcorrTmp2 * QuarDif / 14
        if (NewmDecimal <= 1 / 4 || (NewmDecimal > 1 / 2 && NewmDecimal <= 3 / 4)) {
            Tcorr = -Tcorr
        }
        // 戊寅時差極值2.57小時=0.107。有待檢驗寫的對不對
    } else if (Type === 6 && isNewm) { // 麟徳月食食甚時刻卽定望。
        // 還要加上：月食：晨昏之間不可見食甚，日出後日入前12.5刻，就不注月食
        const tmp = NewmDecimal % 0.25
        let QuarDif = tmp
        if (tmp >= 1 / 8) {
            QuarDif = 1 / 4 - tmp
        }
        if (NodeAccum > HalfNode) {
            let Dif = QuarDif * (10 + NodeDif * 12) / 42
            Tcorr = Dif
            if (OriginDif >= HalfTermLeng * 5 && OriginDif < HalfTermLeng * 7) {} else if (OriginDif < HalfTermLeng * 17) { //若用定氣，有2986 / 1340的盈縮積，但應該是平氣。
                let sign1 = -1
                if (NewmDecimal >= 1 / 2) {
                    sign1 = 1
                }
                const k = SummerDif / HalfTermLeng // 距離夏至節氣數，我暫時處理成連續的
                Tcorr = 2 * k + NodeDif * 4 + sign1 * Dif
            } else if (OriginDif < HalfTermLeng * 19) {} else {
                let sign1 = 1
                if (NewmDecimal >= 1 / 2) {
                    sign1 = -1
                }
                const k = (OriginDif % Solar) / HalfTermLeng // 距離夏至節氣數，我暫時處理成連續的
                Tcorr = 2 * k + NodeDif * 4 + sign1 * Dif
            }
        } else {
            Tcorr = QuarDif * NodeDif * 2 / 7 // 去交時是以時辰為單位，卽1日12辰
        }
    }
    let Dcorr = 0
    let Magni = 0
    let status = 0
    let NodeDifDif = 0
    if (['Daye', 'Wuyin'].includes(CalName)) {
        if (isNewm) {
            let tmp = 184000
            if (CalName === 'Daye') {
                if (OriginDif < 4 * HalfTermLeng) {} else if (OriginDif < HalfSolar) {
                    tmp = 184000 * (HalfSolar - OriginDif) / (Solar / 3)
                } else if (OriginDif < Solar * 0.75) {
                    tmp = 184000 * (OriginDif - HalfSolar) / QuarSolar
                }
            } else if (CalName === 'Wuyin') {
                tmp = 220800
                if (OriginDif < 4 * HalfTermLeng) {} else if (OriginDif < HalfSolar) {
                    tmp = 220800 * (HalfSolar - OriginDif) / (Solar / 3)
                } else if (OriginDif < Solar * 0.75) {
                    tmp = 220800 * (OriginDif - HalfSolar) / QuarSolar
                }
            }
            tmp /= NodeDenom
            const Bushi = Math.abs(NodeDif - tmp) // 不食餘
            let sign4 = 0
            if (OriginDif >= 2 * HalfTermLeng && OriginDif < 10 * HalfTermLeng) {
                sign4 = -1
                if (NodeAccumHalf > QuarNode) { // 交前 按照劉洪濤頁462的意思，他說的交前交後跟我這相反，到底那種是對的呢？不過這裏符號還是跟他一樣
                    if ((NewmDecimal >= 1 / 4 && NewmDecimal < 1 / 2) || (NewmDecimal >= 3 / 4)) {
                        sign4 = 1
                    }
                } else if (NewmDecimal <= 1 / 4 || (NewmDecimal > 1 / 2 && NewmDecimal <= 3 / 4)) {
                    sign4 = 1
                }
            }
            Magni = 15 - (Bushi + sign4 / 12) * MoonAvgVDeg
        } else {
            if (CalName === 'Daye') {
                if ((i >= 1 && i <= 3 && NodeAccumHalf < QuarNode) || (i >= 7 && i <= 9 && NodeAccumHalf > QuarNode) || (i >= 10 && NodeAccumHalf < QuarNode)) {
                    Magni = 15 - (NodeDif - 1 / 12) * MoonAvgVDeg
                } else {
                    Magni = 15 - NodeDif * MoonAvgVDeg // 這種情況與正光全同。
                }
            } else {
                if ((i >= 1 && i <= 3 && NodeAccumHalf > QuarNode) || (i >= 7 && i <= 9 && NodeAccumHalf < QuarNode)) {
                    Magni = 15 - (NodeDif - 1 / 24) * MoonAvgVDeg
                } else if ((i >= 1 && i <= 3 && NodeAccumHalf < QuarNode) || (i >= 7 && i <= 9 && NodeAccumHalf > QuarNode) || i >= 10) {
                    Magni = 15 - (NodeDif - 1 / 6) * MoonAvgVDeg
                } else {
                    Magni = 15 - NodeDif * MoonAvgVDeg // 這種情況與正光全同。
                }
            }
            if (Magni > 15) {
                Magni = 15
                status = 1 // 食旣
            }
        }
        Dcorr = Magni - (NodeDif * MoonAvgVDeg)
    } else if (CalName === 'Huangji') {
        if (isNewm) {
            let M = 0
            if (SummerDif < 2 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 1.75 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = Denom * 1.25 / 12
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = Denom * 0.75 / 12
                }
            } else if (SummerDif < 3 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 1.25 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = Denom * 0.75 / 12
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = Denom * 0.25 / 12
                }
            } else if (SummerDif < 4 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 0.75 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = Denom * 0.25 / 12
                }
            } else if (SummerDif < 5 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = Denom * 0.25 / 12
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {} else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -10.1
                }
            } else if (SummerDif < 6 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {} else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -10.1
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -15.2
                }
            } else if (SummerDif < 7 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -10.1
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -15.2
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -53.3
                }
            } else if (SummerDif < 8 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -15.2
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -53.3
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -60.9
                }
            } else if (SummerDif < 9 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -53.3
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -60.9
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -65.9
                }
            } else if (SummerDif < 10 * HalfTermLeng) {
                if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                    M = -60.9
                } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                    M = -65.9
                } else if (NoonDif >= 1.5 / 12 && NoonDif < 1 / 6) {
                    M = -71
                }
            } else if (SummerDif < 11 * HalfTermLeng) {
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
            Dcorr = -M / 96
            Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif + Dcorr
        } else {
            const MoonDcorrList = [0, 48, 43, 38, 33, 28, 23, 18, 15, 12, 19, 6, 3, 0, 13, 14, 15, 16, 17, 18, 21, 24, 27, 30, 33, 48]
            Dcorr = -(MoonDcorrList[TermNum] + (MoonDcorrList[TermNum + 1] - MoonDcorrList[TermNum]) * TermNewmDif / HalfTermLeng) / 96
            Magni = 15 * (HalfSynodicNodeDif - NodeDif) / HalfSynodicNodeDif + Dcorr // 這一步有待確定，我直接複製日食的
        }
    } else if (CalName === 'Linde') { // 下麟徳求食分。NodeDif去交前後定分。558、552的不同，《中國古代曆法》頁82說要統一爲552，不過如果用定氣思路來看，興許不用改。
        if (isNewm) {
            if (NodeAccum > HalfNode) {
                if (OriginDif < QuarSolar) {
                    NodeDifDif = 552 / Denom // 食差
                } else if (OriginDif <= HalfSolar) {
                    NodeDifDif = (552 * (HalfSolar - OriginDif) / QuarSolar) / Denom
                } else if (OriginDif <= HalfSolar + QuarSolar) {
                    NodeDifDif = (552 * (OriginDif - HalfSolar) / QuarSolar) / Denom
                } else {
                    NodeDifDif = 552 / Denom
                }
            } else {
                if (OriginDif < QuarSolar) {
                    NodeDifDif = (552 * OriginDif / QuarSolar) / Denom
                } else if (OriginDif <= HalfSolar + QuarSolar) {
                    NodeDifDif = 552 / Denom
                } else {
                    NodeDifDif = (552 * (Solar - OriginDif) / QuarSolar) / Denom
                }
            }
            let sign2 = -1
            if (NodeAccumHalf > QuarNode) { // 交前
                sign2 = 1
            }
            Magni = 15 - 15 * NodeDif / (HalfSynodicNodeDif + sign2 * NodeDifDif)
            Dcorr = Magni - (15 - 15 * NodeDif / HalfSynodicNodeDif)
        } else {
            if (i >= 1 && i <= 3) {
                if (NodeAccumHalf > QuarNode) { // 交前
                    NodeDifDif = -200 / Denom
                } else {
                    NodeDifDif = -100 / Denom
                }
            } else if (i >= 4 && i <= 6) {
                NodeDifDif = -54 / Denom
            } else if (i >= 7 && i <= 9) {
                if (NodeAccumHalf > QuarNode) { // 交前
                    NodeDifDif = -100 / Denom
                } else {
                    NodeDifDif = -200 / Denom
                }
            } else if (i >= 10 && i <= 12) {
                NodeDifDif = -224 / Denom
            }
            if (NodeDif < 0) {
                status = 1 // 不足減者，食旣
                Magni = 15
            } else {
                Magni = (HalfSynodicNodeDif - NodeDif + NodeDifDif) / (104 / Denom) // 準確的是103.554111
            }
            Dcorr = Magni - (HalfSynodicNodeDif - NodeDif) / (104 / Denom)
        }
    }
}

const EclipseTable3 = (NodeAccum, AnomaAccum, OriginDifRaw, isNewm, CalName) => { // 入交日，入轉日，經朔分，距冬至日數，月份，閏月序數，朔望，名字。用月份判斷很奇怪，但是沒有證據說是用節氣判斷，皇極有兩條「閏四月內」，那肯定就是月份
    const {
        AutoPara,
        Type
    } = Bind(CalName)
    const {
        Node,
        Lunar,
        Sidereal,
        Solar,
        Denom,
    } = AutoPara[CalName]
    let {
        SunLimit1,
        SunLimit2,
        MoonLimit1,
        MoonEcliDenom
    } = AutoPara[CalName]
    if (SunLimit1) {
        SunLimit1 /= Denom
        SunLimit2 /= Denom
    }
    if (MoonLimit1) {
        MoonLimit1 /= Denom
        MoonEcliDenom /= Denom
    }
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const HalfNode = Node / 2
    const QuarNode = Node / 4
    let NodeAccumHalf = NodeAccum % HalfNode
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    const HalfSolar = Solar / 2
    const OriginDif = OriginDifRaw % Solar

    let NodeAccumCorr = 0 // 入交日修正
    let LimitCorr = 0 // 大衍食限修正
    let Tcorr = 0 // 食甚時刻修正
    let Dcorr = 0 // 食分修正
    let Magni = 0 // 食分
    let status = 0 // 1全，2偏，3光影相接

    if (Type >= 6) { // 劉金沂《麟徳曆交食計算法》。
        // 定交分=泛交分+太陽改正+(61/777)*月亮改正。61/777是27.2122/346.62的漸進分數！恆星月日數/恆星年日數= s/m ，交率（卽交點月）/交數（卽交點年日數）= (s-n)/(m-n)=27.2122/346.608=1/12.737=0.0785
        // 交後交在後，符號同定朔改正，交前，與定朔相反。
        let sign = 1
        if (NodeAccumHalf > QuarNode) { // 交前、先交
            sign = -1
        }
        NodeAccumCorr = sign * AutoTcorr(AnomaAccum, OriginDif, CalName).NodeAccumCorr
    }
    NodeAccum += NodeAccumCorr
    NodeAccumHalf = NodeAccum % HalfNode
    let NodeDif = NodeAccumHalf // 去交分 NodeDif
    if (NodeAccumHalf > QuarNode) {
        NodeDif = HalfNode - NodeAccumHalf
    }
    let LimitCorrDif = 0
    if (isNewm) {
        if (CalName === 'Dayan') {
            let AcrTermOrder = 0
            const SunDcorrList = [0, 0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 385, 325, 270, 220, 175, 135, 100, 70, 45, 25, 10, 0, 10]
            const TermAcrRawList = AutoSunTcorr(OriginDif, 'Dayan')
            for (let j = 1; j <= 24; j++) {
                if (TermAcrRawList[j] >= OriginDif - 1 && TermAcrRawList[j] < OriginDif) {
                    AcrTermOrder = Math.round(j % 24.1)
                    break
                }
            }
            // 接下來調用拉格朗日內插
            const Initial = TermAcrRawList[AcrTermOrder] + ',' + SunDcorrList[AcrTermOrder] + ';' + TermAcrRawList[AcrTermOrder + 1] + ',' + SunDcorrList[AcrTermOrder + 1] + ';' + TermAcrRawList[AcrTermOrder + 2] + ',' + SunDcorrList[AcrTermOrder + 2]
            LimitCorr = Interpolate3(OriginDif, Initial).f // 當日差積
            if (OriginDif > HalfSolar) {
                LimitCorr = -LimitCorr
            }
            LimitCorrDif = (1275 + LimitCorr) / Denom //  食定差=冬至食差+LimitCorr
            if (NodeAccum > HalfNode) {
                SunLimit1 = SunLimit2
                if (NodeDif < LimitCorrDif) {
                    SunLimit1 = SunLimit1
                }
            } else {
                SunLimit1 = SunLimit1
            }
            SunLimit1 += LimitCorr // 食定限=食限+LimitCorr
        }
    }
    if (['Dayan', 'Zhide'].includes(CalName)) { // 大衍以陽城為準，大衍有月食食甚時刻修正，和日食修正一樣                
        Tcorr = NodeDif * 0.0785 / (20 / Denom) // 同名相加異名相減
        if (OriginDif > HalfSolar && OriginDif < Solar * 0.75) { // 日在赤道北
            if (NodeAccum < HalfNode) {
                Tcorr = -Tcorr
            }
        } else if (NodeAccum > HalfNode) {
            Tcorr = -Tcorr
        }
    }
    if (['Dayan', 'Zhide'].includes(CalName)) { // 大衍之後，月食食分的節氣改正取消
        if (isNewm) {
            let RelNodeDif = NodeDif + LimitCorrDif // 視去交=去交定分+食定差
            if (NodeAccum > HalfNode) {
                RelNodeDif = NodeDif - LimitCorrDif
            }
            if (NodeAccum > HalfNode) {
                Magni = 15 - (RelNodeDif - 104 / Denom) / (143 / Denom)
                if (RelNodeDif < 104 / Denom) {
                    Magni = 15 // 全食
                    status = 1
                }
                if (NodeDif < LimitCorrDif) {
                    Magni = (SunLimit1 + NodeDif) / (90 / Denom)
                    if (LimitCorrDif - NodeDif <= 60 / Denom) {
                        Magni = 15 // 全食
                        status = 1
                    }
                }
            } else {
                Magni = (SunLimit1 - NodeDif) / (90 / Denom)
            }
        } else {
            if (NodeDif <= 779 / Denom) {
                Magni = 15 //   月全食
                status = 1
            } else {
                Magni = (HalfSynodicNodeDif - NodeDif) / (183 / Denom)
            }
        }
    } else if (['Wuji', 'Zhengyuan'].includes(CalName)) {
        if (CalName === 'Wuji') {
            if (NodeAccum > Node / 2) {
                if (OriginDif > Solar * 0.75 || OriginDif < Solar / 4) { // 本來應該是5，夏至不盡，我直接改成連續了
                    Dcorr = 457
                } else if (OriginDif >= Solar / 4 && OriginDif < Solar / 2) {
                    Dcorr = 457 - 5.00486 * (OriginDif - Solar / 4)
                } else {
                    Dcorr = 5.00486 * (OriginDif - Solar / 2)
                }
            } else {
                if (OriginDif > Solar / 4 && OriginDif < Solar * 0.75) {
                    Dcorr = 457
                } else if (OriginDif >= Solar * 0.75) {
                    Dcorr = 457 - 5.00486 * (OriginDif - Solar * 0.75)
                } else {
                    Dcorr = 5.00486 * OriginDif
                }
            }
            Dcorr /= Denom
        } else {
            if (NodeAccum > Node / 2) {
                if (OriginDif > Solar * 0.75 || OriginDif < Solar / 4) {
                    Dcorr = 373
                } else if (OriginDif >= Solar / 4 && OriginDif < Solar / 2) { // 本來應該是4，夏至不盡，我直接改成連續了
                    Dcorr = 373 - 4.084934 * (OriginDif - Solar / 4)
                } else {
                    Dcorr = 4.084934 * (OriginDif - Solar / 2)
                }
            } else {
                if (OriginDif > Solar / 4 && OriginDif < Solar * 0.75) {
                    Dcorr = 373
                } else if (OriginDif >= Solar * 0.75) {
                    Dcorr = 373 - 4.084934 * (OriginDif - Solar * 0.75)
                } else {
                    Dcorr = 4.084934 * OriginDif
                }
            }
            Dcorr /= Denom
        }
    }
    return {
        status,
        Tcorr,
        Magni
    }
}
// console.log(EclipseTable(0.1, 4, 0.4515, 40, 2, 0, 1, 'Daye').Magni)

// 紀元步驟：1、入交泛日 2、時差，食甚時刻 3、入交定日 4、食分。入交定日到底要不要加上時差？
// 大衍第一次提出陰陽食限。宣明之後直接採用去交、食限，捨棄大衍的變動食限
// 紀元定朔入轉=經朔入轉+日月改正
const EclipseFormula = (NodeAccum, AnomaAccumRaw, NewmDecimal, OriginDifRaw, isNewm, CalName) => { // 入交泛日，經朔入轉，定朔分，定朔距冬至——改成經朔距冬至
    const {
        Type,
        AutoPara
    } = Bind(CalName)
    const {
        Solar,
        Lunar,
        Node,
        Sidereal,
        Denom,
        XianConst,
    } = AutoPara[CalName]
    let {
        SunLimit1,
        SunLimit2,
        MoonLimit1,
        MoonEcliDenom
    } = AutoPara[CalName]
    SunLimit1 /= Denom
    SunLimit2 /= Denom
    if (MoonLimit1) {
        MoonLimit1 /= Denom
        MoonEcliDenom /= Denom
    }
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const HalfNode = Node / 2
    const QuarNode = Node / 4
    const MoonAvgVDeg = Sidereal / Lunar + 1
    const HalfSolar = Solar / 2
    const QuarSolar = Solar / 4
    const HalfTermLeng = Solar / 24
    let OriginDif = OriginDifRaw % Solar
    const TcorrFunc = AutoTcorr(AnomaAccumRaw, OriginDif, CalName)
    let NodeAccumCorr = 0
    if (Type === 9) { // 紀元沒有考慮交點退行
        NodeAccumCorr = TcorrFunc.SunTcorr
    } else {
        NodeAccumCorr = TcorrFunc.NodeAccumCorr
        NodeAccum += NodeAccumCorr
    }
    // let NodeAccumHalf = NodeAccum % HalfNode // 用來判斷交前交後
    // let sign = 1
    // if (NodeAccumHalf > QuarNode) { // 交前、先交。按照《紀元曆日食算法及精度分析》頁147提到交前
    //     sign = -1
    // }
    let NodeDif = NodeAccum % HalfNode // 去交定分（與下面去交眞定分相區別）
    if (NodeDif > QuarNode) {
        NodeDif = HalfNode - NodeDif
    }
    let Tcorr0 = 0
    let MoonAcrAvgDif = 0
    let AnomaAccum = AnomaAccumRaw + TcorrFunc.Tcorr2
    if (Type === 9) { //紀元食甚泛餘，卽定朔到眞食甚的改正。藤豔輝《紀元曆日食算法及精度分析》。最後書上說加上經朔，藤豔輝說加上定朔
        const MoonAcrAvgDifList = TcorrFunc.MoonAcrAvgDifList
        MoonAcrAvgDif = -MoonAcrAvgDifList[Math.floor(AnomaAccum)] / MoonAvgVDeg // 朏（疾）減朒（遲）加。這裏符號不確定，感覺是這樣
        Tcorr0 = (TcorrFunc.Tcorr2) * MoonAcrAvgDif // TcorrFunc.Tcorr2是經朔日月改正
    }
    OriginDif += TcorrFunc.Tcorr2 + Tcorr0 // 不知道紀元月食加不加Tcorr0
    let Sunrise = Longi2LatiFormula(OriginDif, CalName).Sunrise
    let K = (50 - Sunrise) / 100 // 日出沒辰刻距午正刻數/100
    ////////// 以下時差改正
    NewmDecimal += Tcorr0
    let NewmDecimalRev = NewmDecimal
    if (NewmDecimal > 0.5) {
        NewmDecimalRev = 1 - NewmDecimal
    }
    let Tcorr = 0
    if (isNewm) {
        if (CalName === 'Xuanming') { // 夏至最大，冬至最小，夜半最大，午正最小。但實際上是夏至最小，冬至最大。午前- 午後+。實際上，時差取決於黃道南北，與午正無關，比例也不會不一樣
            Tcorr = -(0.5 - NewmDecimalRev) * K / 1.47
            if (NewmDecimal > 0.5) {
                Tcorr = -2 * Tcorr
            }
        } else if (['Chongxuan', 'Chongtian', 'Guantian'].includes(CalName)) {
            Tcorr = -(0.5 - NewmDecimalRev) * NewmDecimalRev / 3
            if (NewmDecimal > 0.5) {
                Tcorr = -2 * Tcorr
            }
        } else if (Type === 9) {
            Tcorr = -(0.5 - NewmDecimalRev) * NewmDecimalRev / 1.5
            if (NewmDecimal > 0.5) {
                Tcorr = -1.5 * Tcorr
            }
        } else if (Type === 10) {
            Tcorr = (1 - NewmDecimalRev) * (NewmDecimalRev - 0.5) / 2
            if (NewmDecimal < 0.5) {
                Tcorr = -Tcorr
            }
        } else if (Type === 11) { // 大統時差。中前以減，中後以加。「退二位」。最大值一個半小時左右《中國古代的日食時差算法》
            Tcorr = (1 - NewmDecimalRev) * (NewmDecimalRev - 0.5) / 1.92
            if (NewmDecimal < 0.5) {
                Tcorr = -Tcorr
            }
        }
    } else {
        let NewmDecimal1 = NewmDecimal % 0.5
        if (NewmDecimal1 > 0.25) {
            NewmDecimal1 = 0.5 - NewmDecimal1
        }
        if (Type === 9) {
            if (NewmDecimal > 0.5) {
                Tcorr = -(NewmDecimal1 ** 2) / 3
            } else if (NewmDecimal < (2 / 3) * Sunrise) {
                Tcorr = ((4 / 3) * Sunrise - NewmDecimal) * NewmDecimal / 1.5
            } else {
                Tcorr = ((4 / 3) * Sunrise - 2 * (Sunrise - NewmDecimal)) * 2 * (Sunrise - NewmDecimal) / 1.5 // 只說反減，不知道是否取絕對值。
            }
        } else if (Type === 10) {
            Tcorr = NewmDecimal1 ** 2 / 5
        } else if (CalName === 'Shoushi') { // 大統取消授時的月食時差改正
            Tcorr = NewmDecimal1 ** 2 / 4.78
            if (NewmDecimal > 0.5) { // 子前以減
                Tcorr = -Tcorr
            }
        }
    }
    let OriginDifTrue = OriginDif + Tcorr // 食甚時刻
    if (Type === 9) { // 紀元食甚日行積度        
        OriginDifTrue += AutoTcorr(AnomaAccum, OriginDifTrue, CalName).SunDifAccum // 感覺應該是先後數先加後減         
    }
    NewmDecimal += Tcorr
    let NoonDif = NewmDecimal - 0.5 // 食甚距午正刻數。注意，宣明NoonDif是食甚時刻，之前皇極等等大概應該是定朔
    const OriginDifNoon = OriginDifTrue - NoonDif // + AutoTcorr(0, OriginDifTrue - NoonDif, CalName).SunDifAccum - AutoTcorr(0, OriginDifTrue, CalName).SunDifAccum // 算到正午這一小段時間的日躔，不算了，太浪費算力，誤差可以忽略
    Sunrise = Longi2LatiFormula(OriginDifNoon, CalName).Sunrise
    K = (50 - Sunrise) / 100 // 日出沒辰刻距午正刻數/100
    // 宣明曆創日食四差：【時差Tcorr】食甚時刻改正【氣差DcorrTerm刻差DcorrClock加差DcorrOther】食分改正 
    let DcorrTerm = 0
    let DcorrClock = 0
    let DcorrOther = 0 // 儀天加差全同宣明
    let Dcorr = 0
    const OriginDifHalf = OriginDif % HalfSolar // 定朔
    const OriginDifTrueHalf = OriginDifTrue % HalfSolar // 食甚
    // 下爲食分改正
    // 三差與月亮天頂距有關，與午正前後無關，古曆卻將此作為正負判斷依據，完全不對
    let sign1 = 1
    if (OriginDif >= QuarSolar && OriginDif < Solar * 0.75) {
        if (NodeAccum < HalfNode) {
            sign1 = -1
        }
    } else {
        if (NodeAccum > HalfNode) {
            sign1 = -1
        }
    }
    let sign2 = 1
    if (OriginDif < QuarSolar || OriginDif > Solar * 0.75) {
        if (NoonDif < 0) {
            if (NodeAccum > HalfNode) {
                sign2 = -1
            }
        } else {
            if (NodeAccum < HalfNode) {
                sign2 = -1
            }
        }
    } else {
        if (NoonDif < 0) {
            if (NodeAccum < HalfNode) {
                sign2 = -1
            }
        } else {
            if (NodeAccum > HalfNode) {
                sign2 = -1
            }
        }
    }
    let sign3 = 1
    if (NoonDif > 0) {
        if (NodeAccum > HalfNode) {
            sign3 = -1
        }
    } else {
        if (NodeAccum < HalfNode) {
            sign3 = -1
        }
    }
    let OriginDifHalfRev = OriginDifHalf
    if (OriginDifHalfRev > QuarSolar) {
        OriginDifHalfRev = HalfSolar - OriginDifHalfRev
    }
    let OriginDifTrueHalfRev = OriginDifTrueHalf
    if (OriginDifTrueHalfRev > QuarSolar) {
        OriginDifTrueHalfRev = HalfSolar - OriginDifTrueHalfRev
    }
    if (CalName === 'Xuanming') {
        DcorrTerm = (2350 - 25.73618 * OriginDifHalfRev) * (1 - Math.abs(NoonDif) / K)
        if (OriginDifHalf < HalfTermLeng * 3) {
            DcorrClock = 2.1 * Math.floor(OriginDifHalfRev) // 連續的話我改成2.06985
        } else if (OriginDifHalf < HalfTermLeng * 9) {
            DcorrClock = 94.5
        } else {
            DcorrClock = 94.5 - 2.1 * (Math.floor(OriginDifHalfRev) - HalfTermLeng * 9)
        }
        DcorrClock *= Math.abs(NoonDif)
        if (OriginDif < HalfTermLeng * 3) {
            DcorrOther = 51 - OriginDif * 17 / HalfTermLeng
        } else if (OriginDif > HalfTermLeng * 21) {
            DcorrOther = (OriginDif - HalfTermLeng * 21) * 17 / HalfTermLeng
        }
    } else if (CalName === 'Yingtian') {
        DcorrTerm = (364 - 4 * Math.floor(OriginDifHalfRev)) * (1 - Math.abs(NoonDif) / K) // 盈初縮末（應該是冬至前後）內減外加，縮初盈末內加外減
        if (OriginDifHalf > 45 && OriginDifHalf < 137) {
            DcorrClock = 15.08 * Math.abs(NoonDif) // NoonDif單位不同，宣明是刻數，這是日分。
        } else {
            if (OriginDifHalf < 45) {
                OriginDifHalf = 45 - OriginDifHalf
            } else {
                OriginDifHalf -= 137
            }
            DcorrClock = (15.08 - 0.335 * Math.floor(OriginDifHalf)) * Math.abs(NoonDif)
        }
    } else if (CalName === 'Qianyuan') {
        DcorrTerm = (819 - 9 * Math.floor(OriginDifHalfRev)) * (1 - Math.abs(NoonDif) / K) // 乾元是「二分後日加入氣日」，我先暫時統一處理成二至後。《中國古代曆法》頁96說二至前是二至後的10倍，想不通。
        if (OriginDifHalf > 45 && OriginDifHalf < 137) {
            DcorrClock = 33.3 * Math.abs(NoonDif) // NoonDif單位日分
        } else {
            if (OriginDifHalf < 45) {
                OriginDifHalf = 45 - OriginDifHalf
            } else {
                OriginDifHalf -= 137
            }
            DcorrClock = (33.3 - 0.74 * Math.floor(OriginDifHalf)) * Math.abs(NoonDif)
        }
    } else if (CalName === 'Yitian') { // 儀天的範圍是定氣，所以要以二至對稱。但是兩個算式又有什麼區別呢，我還是統一爲以前的。
        // let tmp1 = Math.abs(OriginDif - Solar)
        // if (OriginDif > QuarSolar && OriginDif < Solar * 0.75) {
        //     tmp1 = Math.abs(OriginDif - HalfSolar)
        // }
        // DcorrTerm = (2826 - 30.15 * tmp1) * (1 - Math.abs(NoonDif) / K)
        DcorrTerm = (2826 - 30.9491267 * OriginDifHalfRev) * (1 - Math.abs(NoonDif) / K) // NoonDif單位刻數
        if (OriginDif < HalfTermLeng * 3) {
            DcorrClock = 2.525 * Math.floor(OriginDifHalf) * Denom / 442384
        } else if (OriginDif < HalfTermLeng * 9) {
            DcorrClock = 113.625
        } else if (OriginDif < HalfTermLeng * 13) {
            DcorrClock = (113.625 - 2.525 * (Math.floor(OriginDifHalf) - HalfTermLeng * 9)) * Denom / 279858
        } else if (OriginDif < HalfTermLeng * 16) {
            DcorrClock = 2.525 * Math.floor(OriginDifHalf) * Denom / 279858
        } else if (OriginDif < HalfTermLeng * 21) {
            DcorrClock = 113.625
        } else {
            DcorrClock = (113.625 - 2.525 * (Math.floor(OriginDifHalf) - HalfTermLeng * 21)) * Denom / 442384
        }
        DcorrClock *= Math.abs(NoonDif)
        if (OriginDif < HalfTermLeng * 3) {
            DcorrOther = 61.32 - OriginDifHalf * 20.44 / HalfTermLeng
        } else if (OriginDif > HalfTermLeng * 21) {
            DcorrOther = (OriginDif - HalfTermLeng * 21) * 20.44 / HalfTermLeng
        }
    } else if (CalName === 'Mingtian') {
        let OriginDifHalf2 = OriginDif
        if (OriginDif < HalfSolar) {
            if (OriginDif > Solar / 6) {
                OriginDifHalf2 = HalfSolar - OriginDifHalf2
            }
        } else if (OriginDif > HalfSolar) {
            if (OriginDif > Solar / 3) {
                OriginDifHalf2 = HalfSolar - OriginDifHalf2
            }
        }
        DcorrTerm = 508 - (106 / 3093) * (243.5 - OriginDifHalf2) * OriginDifHalf2
        DcorrTerm *= Math.abs(NoonDif) / 9750
        DcorrClock = (106 / 3093) * (243.5 - OriginDifHalf2) * OriginDifHalf2
        DcorrClock *= Math.abs(NoonDif) / 9750
    } else if (CalName === 'Guantian') {
        let OriginDifHalf3 = OriginDif
        if (OriginDif < HalfSolar) {
            if (OriginDif > 88.91) {
                OriginDifHalf3 = HalfSolar - OriginDifHalf3
            }
        } else if (OriginDif > HalfSolar) {
            if (OriginDif > HalfSolar + 93.71) {
                OriginDifHalf3 = HalfSolar - OriginDifHalf3
            }
        }
        if (OriginDif < 88.91 || OriginDif > HalfSolar + 93.71) {
            DcorrTerm = (4010 - (100 / 197) * OriginDifHalf3 ** 2) * (1 - Math.abs(NoonDif) / K)
        } else {
            DcorrTerm = (4010 - (100 / 219) * OriginDifHalf3 ** 2) * (1 - Math.abs(NoonDif) / K)
        }
        DcorrClock = (100 / 209) * (HalfSolar - OriginDifHalf3) * OriginDifHalf3
        DcorrClock *= Math.abs(NoonDif) / 3700.5 // 單位 午前後分
    } else if (CalName === 'Chongtian') {
        DcorrTerm = (3533 - (100 / 236) * OriginDifHalfRev ** 2) * (1 - Math.abs(NoonDif) / K) // NoonDif「距午定分」
        DcorrClock = (100 / 236) * (HalfSolar - OriginDifHalfRev) * OriginDifHalfRev
        DcorrClock *= Math.abs(NoonDif) * 4 / Denom
    } else if (Type === 9) { // 紀元南宋
        DcorrTerm = (2430 - (100 / 343) * OriginDifTrueHalfRev ** 2) * (1 - Math.abs(NoonDif) / K)
        DcorrClock = (100 / 343) * (HalfSolar - OriginDifTrueHalfRev) * OriginDifTrueHalfRev
        DcorrClock *= 4 * Math.abs(NoonDif)
    } else if (Type === 10) { // 以上三個等價
        DcorrTerm = (1744 - (100 / 478) * OriginDifHalfRev ** 2) * (1 - Math.abs(NoonDif) / K)
        DcorrClock = (100 / 478) * (HalfSolar - OriginDifHalfRev) * OriginDifHalfRev
        DcorrClock *= Math.abs(NoonDif) / 1307.5
    } else if (Type === 11) {
        DcorrTerm = (4.46 - OriginDifHalfRev ** 2 / 1870) * (1 - Math.abs(NoonDif) / K)
        DcorrClock = (HalfSolar - OriginDifHalfRev) * OriginDifHalfRev / 1870
        DcorrClock *= Math.abs(NoonDif) / 2500
    }
    let k0 = 0
    if (Type === 9) {
        if (NodeAccum > QuarNode && NodeAccum < Node * 0.75) { // 交初加三千一百，交中減三千
            k0 = -3000
        } else {
            k0 = 3100
        }
    }
    Dcorr = (sign1 * DcorrTerm + sign2 * DcorrClock + sign3 * DcorrOther + k0) / Denom
    NodeAccum += NodeAccumCorr + Dcorr // 入食限
    NodeAccum %= HalfNode
    let AcrNodeDif = NodeAccum // 去交定分 NodeDif。// 宣明、崇天去交真定分，那其他曆法估計也差不多
    if (AcrNodeDif > QuarNode) {
        AcrNodeDif = HalfNode - AcrNodeDif
    }
    let status = 0
    let Magni = 0
    let Last = 0
    if (isNewm) {
        let portion = 10
        if (CalName === 'Xuanming') {
            portion = 20 / 3 // 宣明日食定法爲限的1/15，崇天爲1/10
        }
        if (Type === 9) {
            if (NodeAccum < HalfNode && AcrNodeDif < SunLimit1) {
                status = 2
                Magni = portion * (1 - AcrNodeDif / SunLimit1)
            } else if (NodeAccum > HalfNode && AcrNodeDif < SunLimit2) {
                status = 2
                Magni = portion * (1 - AcrNodeDif / SunLimit2)
            }
            if (Magni > 15) {
                Magni = 15
                status = 1
                Last = 8
            }
            Last = 5.83 * (20 * Magni - Magni ** 2) * (1 - MoonAcrAvgDif) / Denom
        } else {
            if (NodeAccum < HalfNode) {
                status = 0
            } else {
                if (AcrNodeDif < SunLimit1) { // 去交真定分小於陽曆食限，爲陽曆食
                    Magni = portion * AcrNodeDif / SunLimit1
                } else if (AcrNodeDif < SunLimit1 + SunLimit2) {
                    if (CalName === 'Xuanming') {
                        Magni = 15 - portion * (AcrNodeDif - SunLimit1) / SunLimit2
                    } else {
                        Magni = portion * (SunLimit1 + SunLimit2 - AcrNodeDif) / SunLimit2
                    }
                } else if (AcrNodeDif < HalfSynodicNodeDif) { // 僅入食限，不一定有食。光影相接，或不見食
                    status = 3
                } else {
                    status = 0
                }
            }
        }
    } else {
        if (CalName === 'Xuanming') {
            if (NodeDif < MoonLimit1) {
                status = 1 // 月全食
                Magni = 15
            } else if (NodeDif < HalfSynodicNodeDif) {
                status = 2
                Magni = (HalfSynodicNodeDif - NodeDif) / MoonEcliDenom
            } else {
                status = 0
            }
        }
    }

    if (Type === 11) {
        let status = 0
        if (isNewm) {
            if ((NewmDecimal > Sunrise - XianConst && NewmDecimal < (1 - Sunrise + XianConst)) && (NodeAccum <= 0.6 || NodeAccum >= 25.6 || (NodeAccum >= 13.1 && NodeAccum <= 15.2))) { // 《中國古代曆法》頁664，上下不同什麼意思啊
                status = 1
            }
        } else {
            if ((NewmDecimal < Sunrise + XianConst && NewmDecimal > (1 - Sunrise - XianConst)) && (NodeAccum <= 1.2 || NodeAccum >= 26.05 || (NodeAccum >= 12.4 && NodeAccum <= 14.8))) {
                status = 1
            }
        }
    }
    let StartDecimal = 0
    if (CalName === 'Linde') {} else if (Type === 9) {
        StartDecimal = NewmDecimal - Last
    }
    return {
        Magni,
        status,
        StartDecimal, // 初虧
        NewmDecimal // 食甚
    }
}
// console.log(EclipseFormula(14.1834249657, 11.1268587106, 0.45531, 31.9780521262, 1, 'Jiyuan').StartDecimal)

// 藤豔輝論文從1開始索引，我從0開始索引，結果相差不大，都在辰正。

export const AutoEclipse = (NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, i, Leap, isNewm, CalName) => {
    const {
        Type
    } = Bind(CalName)
    let Eclipse = {}
    if (Type <= 3 || ['Yuanjia', 'Daming', 'Liangwu'].includes(CalName)) {
        Eclipse = EclipseTable1(NodeAccum, CalName)
    } else if (Type <= 6) {
        Eclipse = EclipseTable2(NodeAccum, AnomaAccum, NewmDecimal, i, Leap, isNewm, CalName)
    } else if (['Dayan', 'Zhide', 'Wuji', 'Zhengyuan'].includes(CalName)) {
        Eclipse = EclipseTable3(NodeAccum, AnomaAccum, OriginDifRaw, isNewm, CalName)
    } else if (Type <= 11) {
        Eclipse = EclipseFormula(NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, isNewm, CalName)
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

// if (CalName === 'Jingchu') {
//     EcliAccum = (FirstEcliAccum + (ZhengOriginDif + i - 1) * LunarNumer) % EcliNumer + (isNewm ? 0 : LunarNumer / 2) // 注意這是乘了日法的。景初原本是平朔，不考慮月行遲疾，但照理說應該要加上
//     if ((EcliAccum >= SunLimit1) || (EcliAccum <= LunarNumer / 2)) { // 是否需要自己設一個閾值修正LunarNumer / 8
//         status = 1
//         Sc += '◐'
//     }
//     YinyangAccum = FirstYinyangAccum + (ZhengOriginDif + i - (isNewm ? 1 : 0.5)) * LunarNumer // 求月在日道表裏
//     if (YinyangAccum < EcliNumer) {
//         Yinyang = JiYinyang
//     } else {
//         YinyangAccum -= EcliNumer
//         Yinyang = -JiYinyang
//     }
//     Magni = EcliAccum / Denom
//     if (status && (Magni < 10 || Magni > EcliNumer / Denom - 10)) {
//         EcliStatus = '必偏食'
//     } else if (status && (Magni < 15 || Magni > EcliNumer / Denom - 15)) {
//         EcliStatus = '虧食微少'
//     } else if (status) {
//         EcliStatus = '交而不食'
//     }
// }
//////// 乾象入陰陽曆
// const a = (Math.floor(OriginYear / Lunar) + i - (isNewm ? 1 : 0.5)) / EcliNumer - Math.floor((Math.floor(OriginYear / Lunar) + i - (isNewm ? 1 : 0.5)) / EcliNumer)
// const b = a * EcliNumer * ShuoHeFen