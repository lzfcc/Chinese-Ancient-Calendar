import {
    BindTcorr
} from './astronomy_acrv.mjs'
import {
    Bind
} from './bind.mjs'
// 紀元步驟：1、入交泛日 2、時差，食甚時刻 3、入交定日 4、食分。入交定日到底要不要加上時差？
// 大衍第一次提出陰陽食限。宣明之後直接採用去交、食限，捨棄大衍的變動食限
// 紀元定朔入轉=經朔入轉+日月改正
export const EclipseFormula = (NodeAccum, AnomaAccum, NewmDecimal, OriginDifRaw, isNewm, CalName, NewmTcorr2) => { // 入交定日，紀元定朔入轉，定朔分，定朔距冬至，平朔日月改正
    // const NodeAccumCorr = sign * TcorrFunc.NodeAccumCorr把這個移到newm
    const {
        Type,
        ChoosePara
    } = Bind(CalName)
    const {
        Solar,
        Lunar,
        Node,
        Anoma,
        Sidereal,
        Denom,
        XianConst,
    } = ChoosePara[CalName]
    let {
        SunLimit1,
        SunLimit2,
        MoonLimit1,
        MoonEcliDenom
    } = ChoosePara[CalName]
    SunLimit1 /= Denom
    SunLimit2 /= Denom
    MoonLimit1 /= Denom
    MoonEcliDenom /= Denom
    const HalfSynodicNodeDif = (Lunar - Node) / 2 // 望差
    const HalfNode = Node / 2
    const QuarNode = Node / 4
    const MoonAvgVDeg = Sidereal / Lunar + 1
    const HalfSolar = Solar / 2
    const QuarSolar = Solar / 4
    const HalfTermLeng = Solar / 24
    const OriginDif = OriginDifRaw % Solar
    const K = (50 - Sunrise) / 100 // 日出沒辰刻距午正刻數/100
    const NewmNoonDif = Math.abs(NewmDecimal - 0.5)
    let NodeAccumHalf = NodeAccum % HalfNode // 用來判斷交前交後
    let sign = 1
    if (NodeAccumHalf > QuarNode) { // 交前、先交
        sign = -1
    }
    let NodeDif = NodeAccum % HalfNode // 去交定分（與下面去交眞定分相區別）
    if (NodeDif > QuarNode) {
        NodeDif = HalfNode - NodeDif
    }
    let Tcorr0 = 0
    if (Type === 9) { //紀元食甚泛餘。藤豔輝《紀元曆日食算法及精度分析》。最後書上說加上經朔，藤豔輝說加上定朔
        const MoonAcrAvgDifList = BindTcorr(AnomaAccum, OriginDif, CalName).MoonAcrAvgDifList
        const MoonAcrAvgDif = -MoonAcrAvgDifList[Math.ceil(AnomaAccum)] // 朏（疾）減朒（遲）加。這裏符號不確定，感覺是這樣
        Tcorr0 = NewmTcorr2 * MoonAcrAvgDif / MoonAvgVDeg
    }
    ////////// 以下時差改正
    NewmDecimal += Tcorr0
    let Tcorr = 0
    if (isNewm) {
        if (CalName === 'Xuanming') { // 夏至最大，冬至最小，夜半最大，午正最小。但實際上是夏至最小，冬至最大
            if (NewmDecimal < 0.5) {
                Tcorr = -NewmNoonDif * K / 1.47
            } else { // 午前- 午後+。實際上，時差取決於黃道南北，與午正無關，比例也不會不一樣
                Tcorr = 2 * NewmNoonDif * K / 1.47
            }
        } else if (['Chongxuan', 'Chongtian', 'Guantian'].includes(CalName)) {
            if (NewmDecimal < 0.5) {
                Tcorr = -(0.5 - NewmDecimal) * NewmDecimal / 3
            } else {
                Tcorr = 2 * (1 - NewmDecimal) * (NewmDecimal - 0.5) / 3
            }
        } else if (Type === 9) {
            if (NewmDecimal < 0.5) {
                Tcorr = -(0.5 - NewmDecimal) * NewmDecimal / 1.5
            } else {
                Tcorr = (0.5 - NewmDecimal) * NewmDecimal
            }
        } else if (Type === 10) {
            Tcorr = (1 - NewmDecimal) * (NewmDecimal - 0.5) / 2
            if (NewmDecimal < 0.5) {
                Tcorr = -Tcorr
            }
        } else if (Type === 11) { // 大統時差。中前以減，中後以加。「退二位」。最大值一個半小時左右《中國古代的日食時差算法》
            Tcorr = (1 - NewmDecimal) * (NewmDecimal - 0.5) / 1.92
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
    const OriginDifTrue = OriginDif + Tcorr0 + Tcorr //食甚時刻
    if (Type === 9) { // 紀元食甚日行積度
        OriginDifTrue += BindAcrTermTcorr(OriginDifTrue, CalName).AcrTermTcorr // 感覺應該是先後數先加後減         
    }
    let NoonDif = NewmDecimal + Tcorr - 0.5 // 食甚距午正刻數。注意，宣明NoonDif是食甚時刻，之前皇極等等大概應該是定朔
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
        DcorrClock *= (2 / 3645) * Math.abs(NoonDif)
    } else if (Type === 10) { // 以上三個等價
        DcorrTerm = (1744 - (100 / 478) * OriginDifHalfRev ** 2) * (1 - Math.abs(NoonDif) / K)
        DcorrClock = (100 / 478) * (HalfSolar - OriginDifHalfRev) * OriginDifHalfRev
        DcorrClock *= Math.abs(NoonDif) / 1307.5
    } else if (Type === 11) {
        DcorrTerm = (4.46 - OriginDifHalfRev ** 2 / 1870) * (1 - Math.abs(NoonDif) / K)
        DcorrClock = (HalfSolar - OriginDifHalfRev) * OriginDifHalfRev / 1870
        DcorrClock *= Math.abs(NoonDif) / 2500
    }
    Dcorr = (sign1 * DcorrTerm + sign2 * DcorrClock + sign3 * DcorrOther) / Denom
    NodeAccum += Dcorr // 入食限
    if (isNewm) {
        if (NodeAccum < HalfNode) {
            status = 0
        } else {
            let portion = 10
            if (CalName === 'Xuanming') {
                portion = 20 / 3 // 宣明日食定法爲限的1/15，崇天爲1/10
            }
            NodeAccum -= HalfNode
            let AcrNodeDif = NodeAccum // 去交定分 NodeDif。// 宣明、崇天去交真定分，那其他曆法估計也差不多
            if (AcrNodeDif > QuarNode) {
                AcrNodeDif = HalfNode - AcrNodeDif
            }
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
    return {
        Dcorr,
        Tcorr,
        status
    }
}