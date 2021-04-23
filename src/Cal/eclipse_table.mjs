import {
    Bind,
} from './bind.mjs'
import {
    BindTcorr,
    BindSunTcorr
} from './astronomy_acrv.mjs'
import {
    Interpolate3
} from './equa_sn.mjs'

// 春夏秋冬各三月，那麼閏月怎麼辦呢，所以輸入的時候應該用day的noleapmon，閏月還是上一個月
export const EclipseTable = (NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, i, Leap, isNewm, CalName) => { // 入交日，入轉日，經朔分，距冬至日數，月份，閏月序數，朔望，名字。用月份判斷很奇怪，但是沒有證據說是用節氣判斷，皇極有兩條「閏四月內」，那肯定就是月份
    const {
        ChoosePara,
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
    } = ChoosePara[CalName]
    let {
        SunLimit1,
        SunLimit2,
        MoonLimit1,
        MoonEcliDenom
    } = ChoosePara[CalName]
    if (SunLimit1) {
        SunLimit1 /= Denom
        SunLimit2 /= Denom
        MoonLimit1 /= Denom
        MoonEcliDenom /= Denom
    }
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const HalfNode = Node / 2
    const QuarNode = Node / 4
    let NodeAccumHalf = NodeAccum % HalfNode
    const MoonAvgVDeg = parseFloat(((Sidereal ? Sidereal : Solar) / Lunar + 1).toPrecision(14))
    const HalfSolar = Solar / 2
    const QuarSolar = Solar / 4
    const HalfTermLeng = Solar / 24
    const OriginDif = OriginDifRaw % Solar
    const NoonDif = Math.abs(NewmDecimal - 0.5)
    const SummerDif = Math.abs(OriginDif - HalfSolar)
    const TermNum = Math.round(Math.ceil(OriginDifRaw / HalfTermLeng) % 24.1)
    const TermNewmDif = OriginDifRaw - (TermNum1 - 1) * HalfTermLeng
    let SunLimit1 = HalfSynodicNodeDif // 單位是時間而非度數！

    let NodeAccumCorr = 0 // 入交日修正
    let LimitCorr = 0 // 大衍食限修正
    let Tcorr = 0 // 食甚時刻修正
    let Dcorr = 0 // 食分修正
    let Magni = 0 // 食分
    let status = 0 // 1全，2偏，3光影相接
    if (Type <= 3 || ['Yuanjia', 'Daming', 'Liangwu'].includes(CalName)) {
        if ((NodeAccum < HalfSynodicNodeDif) || (NodeAccum > Node - HalfSynodicNodeDif) || (NodeAccum > HalfNode - HalfSynodicNodeDif && NodeAccum < HalfNode + HalfSynodicNodeDif)) {
            if (isNewm && (NodeAccum < HalfNode && NodeAccum > 1 / 12)) {
                if (NodeAccum < 1 / 12 || NodeAccum > Node - 1 / 12 || (NodeAccum > HalfNode - 1 / 12 && NodeAccum < HalfNode + 1 / 12)) {
                    status = 1
                } else if (NodeAccum < (2 / 3) * (HalfSynodicNodeDif) || NodeAccum > Node - (2 / 3) * (HalfSynodicNodeDif) || (NodeAccum > HalfNode - (2 / 3) * (HalfSynodicNodeDif) && NodeAccum < HalfNode + (2 / 3) * (HalfSynodicNodeDif))) { // 乾象、大明沒有食多少的計算，這是景初的。大業以前沒有全食計算
                    status = 2
                } else {
                    status = 3
                }
                if ((NodeAccum < HalfSynodicNodeDif) || (NodeAccum < HalfNode + HalfSynodicNodeDif && NodeAccum >= HalfNode)) {
                    Magni = ((NodeAccum % HalfNode) * MoonAvgVDeg)
                } else if (NodeAccum > Node - HalfSynodicNodeDif || (NodeAccum > HalfNode - HalfSynodicNodeDif && NodeAccum < HalfNode)) {
                    Magni = (((Node - NodeAccum) % HalfNode) * MoonAvgVDeg)
                }
            }
        }
    } else {
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
        } else if (Type >= 6) { // 劉金沂《麟徳曆交食計算法》。
            // 定交分=泛交分+太陽改正+(61/777)*月亮改正。61/777是27.2122/346.62的漸進分數！恆星月日數/恆星年日數= s/m ，交率（卽交點月）/交數（卽交點年日數）= (s-n)/(m-n)=27.2122/346.608=1/12.737=0.0785
            // 交後交在後，符號同定朔改正，交前，與定朔相反。
            let sign = 1
            if (NodeAccumHalf > QuarNode) { // 交前、先交
                sign = -1
            }
            NodeAccumCorr = sign * BindTcorr(AnomaAccum, OriginDif, CalName).NodeAccumCorr
        }
        NodeAccum += NodeAccumCorr
        NodeAccumHalf = NodeAccum % HalfNode
        let NodeDif = NodeAccumHalf // 去交分 NodeDif
        if (NodeAccumHalf > QuarNode) {
            NodeDif = HalfNode - NodeAccumHalf
        }
        let LimitCorrDif = 0
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
                    if (NoonDif > 0.18 - 0.137 * SummerDif / (Solar / 4)) {
                        SunLimit1 = 1373 / Denom + (137 / Denom) * SummerDif / (Solar / 4)
                    }
                } else if (NodeAccum < HalfNode) { // 不應食而食有三組情況，滿足一組即可
                    if (OriginDif >= Solar / 4 && OriginDif <= Solar * 0.75) {
                        if (NoonDif <= 0.07) {
                            SunLimit1 = 248 / Denom - (182.6 / Denom) * SummerDif / (Solar / 4)
                        } else if (NoonDif < 0.1744 - 0.1014 * SummerDif / (Solar / 4)) {
                            SunLimit1 = 60 / Denom
                        } else if (NoonDif < 0.1044 - 0.1014 * SummerDif / (Solar / 4)) {
                            SunLimit1 = 60 / Denom + (1644 / Denom) * SummerDif / (Solar / 4)
                        }
                    } else if (NoonDif <= 0.12) {
                        SunLimit1 = 60 / Denom
                    }
                }
            } else if (CalName === 'Dayan') {
                const SunDcorrList = [0, 0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 385, 325, 270, 220, 175, 135, 100, 70, 45, 25, 10, 0, 10]
                const TermAcrRawList = BindSunTcorr(OriginDif, 'Dayan').TermAcrRaw
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
        } else if (['Dayan', 'Zhide'].includes(CalName)) { // 大衍以陽城為準，大衍有月食食甚時刻修正，和日食修正一樣                
            Tcorr = NodeDif * 0.0785 / (20 / Denom) // 同名相加異名相減
            if (OriginDif > HalfSolar && OriginDif < Solar * 0.75) { // 日在赤道北
                if (NodeAccum < HalfNode) {
                    Tcorr = -Tcorr
                }
            } else if (NodeAccum > HalfNode) {
                Tcorr = -Tcorr
            }
        }
        if (['Daye', 'Wuyin'].includes(CalName)) {
            if (isNewm) {
                let tmp = 184000
                if (CalName === 'Daye') {
                    if (OriginDif < 4 * HalfTermLeng) {} else if (OriginDif < HalfSolar) {
                        tmp = 184000 * (HalfSolar - OriginDif) / (Solar / 3)
                    } else if (OriginDif < Solar * 0.75) {
                        tmp = 184000 * (OriginDif - HalfSolar) / (Solar / 4)
                    }
                } else if (CalName === 'Wuyin') {
                    tmp = 220800
                    if (OriginDif < 4 * HalfTermLeng) {} else if (OriginDif < HalfSolar) {
                        tmp = 220800 * (HalfSolar - OriginDif) / (Solar / 3)
                    } else if (OriginDif < Solar * 0.75) {
                        tmp = 220800 * (OriginDif - HalfSolar) / (Solar / 4)
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
                let NodeDifDif = 0
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
        } else if (['Dayan', 'Zhide'].includes(CalName)) { // 大衍之後，月食食分的節氣改正取消
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
    }
    return {
        status,
        Tcorr,
        Magni
    }
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