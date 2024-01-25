import Para from './para_calendars.mjs'
import { frc, deci } from './para_constant.mjs'
import { AutoTcorr, AutoDifAccum, MoonFormula } from './astronomy_acrv.mjs'
import { Interpolate3, Make2DPoints } from './equa_sn.mjs'
import { AutoLongi2Lati } from './astronomy_bind.mjs'
import { AutoQuar, AutoMoonAvgV, AutoMoonTcorrDif, AutoNodePortion, AutoNodeCycle } from './para_auto-constant.mjs'

const ExMagni = (Magni, Type, CalName, isNewm) => {
    let Status = 0
    if (Type < 5) {
        if (Magni <= 1e-12) {
            Magni = 0
            Status = 0
        } else if (Magni < 5) {
        } else if (Magni < 12.417) Status = 2
        else { // NodeDif < 1 / 12
            Status = 1
            if (Magni > 14.9999) Magni = 15
        }
    } else if (Type <= 7 && CalName !== 'Qintian') {
        if (Magni <= 1e-12) {
            Magni = 0
            Status = 0
        } else if (Magni < 3) Status = 3 // 大衍月食去交13度以上或不見食，算下來是3.1度
        else if (Magni < 14.9999) Status = 2
        else {
            Magni = 15
            Status = 1
        }
    } else if (['Chongxuan', 'Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName)) { // 崇玄開始定爲10
        if (Magni <= 1e-12) {
            Magni = 0
            Status = 0
        } else if (Magni <= 5) Status = 3
        else if (Magni < 9.9999) Status = 2
        else {
            Magni = 10
            Status = 1
        }
    } else { // 崇天開始有月食五限，遼金的月食加上旣內分能達到15，我就假設崇天開始月食都是15
        if (Magni <= 1e-12) {
            Magni = 0
            Status = 0
        } else if (Magni <= 1) Status = 3 // 崇玄「其蝕五分已下者，為或食；已上為的蝕。」庚午「其一分以下者，涉交太淺，太陽光盛，或不見食」紀元「其食不及大分者，⋯⋯」
        else if (Magni < 9.9999) Status = 2
        else {
            Status = 1
            if (isNewm) Magni = 10
            else if (Magni > 14.9999) Magni = 15
        }
    }
    return { Magni, Status }
}

const Eclipse1 = (NodeAccum, CalName) => {
    const { Type, Node, Lunar } = Para[CalName]
    const MoonAvgVDeg = AutoMoonAvgV(CalName)
    const Node50 = Node / 2
    const Node25 = Node / 4
    const NodeAccumHalf = NodeAccum % Node50
    const NodeDif = Node25 - Math.abs(NodeAccumHalf - Node25)
    const Limit = ['Daming', 'Kaihuang'].includes(CalName) ? MoonAvgVDeg * (Lunar - Node) / 2 : Lunar / 2
    let Status = 0, Magni = 0
    if (NodeDif * MoonAvgVDeg < Limit) {
        Magni = 15 - NodeDif * MoonAvgVDeg
        const Func = ExMagni(Magni, Type)
        Magni = Func.Magni
        Status = Func.Status
    }
    return { Magni, Status, Node }
}

const EcliTcorr2 = (isNewm, CalName, Type, Solar25, Solar75, HalfTermLeng, isYin, Season, NodeDif, NodeDif12, AnomaAccum, AcrDeci, Denom, SolsDif, SolsDifHalf, SolsDifHalfRev) => {
    let Tcorr1 = 0, Tcorr = 0, QuarDif = 0, TotalDeci = 0
    if (isNewm) {
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
            if (CalName === 'Daye' && isYin) {
                if (Season === 1 && NodeDif >= 7 / 12) Tcorr1 = 24
                else if (Season === 3) {
                    if (NodeDif >= 1) Tcorr1 = 48
                    else if (NodeDif >= 8 / 12) Tcorr1 = 24
                }
            } else if (['WuyinA', 'WuyinB'].includes(CalName)) {
                if (AnomaAccum < 1) {
                    Tcorr1 = -280 // (isNewm ? 300 : 280)但是新唐根本沒有300
                } else if (AnomaAccum < 13) {
                } else if (AnomaAccum < 14) Tcorr1 = 550
                else if (AnomaAccum < 15) Tcorr1 = 280
                else if (AnomaAccum < 27) {
                } else Tcorr1 = -550
                if (isYin) {
                    if (Season === 1) {
                        if (NodeDif > 1 / 3) {
                            if (AnomaAccum > 1 && AnomaAccum < 13) Tcorr1 = 280
                            else if (AnomaAccum > 15 && AnomaAccum < 27) Tcorr1 = -280
                        }
                    } else if (Season === 2) {
                        if (AnomaAccum > 1 && AnomaAccum < 13) Tcorr1 = 280
                        else if (AnomaAccum > 15 && AnomaAccum < 27) Tcorr1 = -280
                    } else if (Season === 3) {
                        if (NodeDif < 11 / 12) {
                            if (AnomaAccum > 1 && AnomaAccum < 13) Tcorr1 = 280
                        } else {
                            if (AnomaAccum > 1 && AnomaAccum < 13) Tcorr1 = 550
                            else if (AnomaAccum > 15 && AnomaAccum < 27) Tcorr1 = 280
                        }
                    } else if (Season === 4) {
                        if (NodeDif < 5 / 12) {
                            if (AnomaAccum > 1 && AnomaAccum < 13) Tcorr1 = 280
                        }
                    }
                }
            }
            TotalDeci = AcrDeci + Tcorr1 / Denom
            QuarDif = 0.125 - Math.abs(TotalDeci % 0.25 - 0.125) // 差率QuarDif
            let tmp3 = NodeDif // 修正三
            if (NodeDif <= 3 / 12) tmp3 += 3 / 12
            else if (NodeDif <= 6 / 12) tmp3 += 2 / 12
            else if (NodeDif <= 9 / 12) tmp3 += 1 / 12
            else if (NodeDif <= 1) {
            } else tmp3 = 1
            Tcorr = -tmp3 * QuarDif / (14 / 12) // 時差
            if (TotalDeci <= 0.25 || (TotalDeci > 0.5 && TotalDeci <= 0.75)) Tcorr = -Tcorr
            TotalDeci += Tcorr // 戊寅時差極值2.57小時=0.107       
        } else if (Type === 6) { // 麟德月食食甚時刻卽定望，皇極以後纔有日食時差
            QuarDif = 0.125 - Math.abs(AcrDeci % 0.25 - 0.125)
            let sign2 = AcrDeci < 0.5 ? 1 : -1
            if (isYin) { // 月在內道
                Tcorr = QuarDif * (10 + NodeDif12) / 42 // 差            
                let sign1 = 1
                if (AcrDeci > 0.5) sign1 = -1
                if (SolsDif > Solar25 && SolsDif < Solar75) sign1 *= -1
                if (SolsDifHalf < Solar25 - HalfTermLeng || SolsDifHalf > Solar25 + HalfTermLeng) {
                    const k = Math.ceil(SolsDifHalfRev / HalfTermLeng) * 2
                    Tcorr += sign1 * (k + NodeDif12 / 3) / Denom
                }
            } else {
                Tcorr = QuarDif * NodeDif12 / 42 // 去交時是以時辰爲單位，卽1日12辰
                sign2 *= -1
            }
            TotalDeci = AcrDeci + sign2 * Tcorr
        }
    } else {
        if (['WuyinA', 'WuyinB'].includes(CalName)) {
            if (AnomaAccum < 1) Tcorr1 = -280 // (isNewm ? 300 : 280)但是新唐根本沒有300
            else if (AnomaAccum < 13) Tcorr1 = 280
            else if (AnomaAccum < 14) Tcorr1 = 550
            else if (AnomaAccum < 15) Tcorr1 = 280
            else if (AnomaAccum < 27) Tcorr1 = -280
            else Tcorr1 = -550
        }
        TotalDeci = AcrDeci + Tcorr1 / Denom
    }
    const NoonDif = Math.abs(TotalDeci - 0.5)
    return { TotalDeci, NoonDif, Tcorr }
}

const EcliStatus2 = (isNewm, CalName, Denom, Solar25, Solar75, Solar, Lunar, HalfTermLeng, SynodicNodeDif50, isYin, isBefore, isFast, Season, NodeDif, Month, Leap, SolsDif, SolsDifHalfRev, SummsolsDif, NoonDif, TotalDeci) => {
    let Status = 0
    if (isNewm) {
        if (isYin) Status = NodeDif <= SynodicNodeDif50 ? 3 : 0
        else Status = 0
    } else Status = NodeDif <= SynodicNodeDif50 ? 3 : 0
    if (isNewm) {
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) { // 《劉洪濤》頁458。最後有個條件是五星伏見，目前沒辦法加上去
            if (isYin) {
                if (NodeDif >= 13 / 12) {
                    if ((NoonDif < 1.5 / 12 && ((Month === 5 && !isBefore) || (Month === 6 && isBefore))) ||
                        (SolsDif > Solar * 4 / 24 && SolsDif < Solar * 8 / 24 && !isFast && TotalDeci > 7 / 12) ||
                        (SolsDif > Solar * 16 / 24 && SolsDif < Solar * 20 / 24 && isFast && TotalDeci < 5 / 12)) { // 南方三辰
                        Status = 0
                    }
                }
            } else {
                if ((NodeDif <= 1 / 12) ||
                    (Season === 2 && NodeDif < 2 / 12 && NoonDif < 1.5 / 12) ||
                    (SolsDifHalfRev < 0.5 && NodeDif <= 0.5) ||
                    (Math.abs(Solar25 - SolsDif) <= 3 && isBefore && NodeDif <= 2 / 12) ||
                    (Math.abs(Solar75 - SolsDif) <= 3 && !isBefore && NodeDif <= 2 / 12) ||
                    (!isBefore && isFast && NodeDif > 2 / 12) ||
                    (isBefore && !isFast && NodeDif > 2 / 12)) {
                    Status = 3
                }
            }
        } else if (CalName === 'Huangji') {
            if (isYin) {
                if (NoonDif < 0.125) { // 加南三辰
                    if ((SummsolsDif < 11 && NodeDif > 12.25 / 12) ||
                        (SummsolsDif < 21 && NodeDif >= 12.5 / 12) ||
                        (SummsolsDif <= Lunar && NodeDif >= 12.75 / 12) ||
                        ((Month === 6 || (Leap === 4 && Month === 4)) && NodeDif >= 13 / 12) ||
                        (SummsolsDif < Solar * 4 / 24)) {
                        Status = 0
                    }
                } else if (NoonDif < 2 / 12 && NodeDif >= 13 / 12) {
                    if ((SummsolsDif <= 20) ||
                        ((Month === 6 || (Leap === 4 && Month === 4)))) {
                        Status = 0
                    }
                } else if (NoonDif < 1 / 12 && SummsolsDif < Solar * 5 / 24) Status = 0
                else if (NoonDif < 1 / 12 && SummsolsDif < Solar25) Status = 0
                else if (NodeDif > 13.5 / 12) Status = 0
            } else { // 這塊沿用原來的
                if ((SummsolsDif <= Lunar && NoonDif >= 1 / 24 && NoonDif < 1 / 12 && NodeDif <= 2 / 12) ||
                    (SummsolsDif <= Lunar && NoonDif >= 1 / 12 && NoonDif < 0.125 && NodeDif <= 1.5 / 12) ||
                    (SummsolsDif < 47 && NoonDif >= 1 / 24 && NoonDif < 1 / 12 && NodeDif <= 1.5 / 12) ||
                    (SummsolsDif < 47 && NoonDif >= 1 / 12 && NoonDif < 0.125 && NodeDif <= 1 / 12) ||
                    (SolsDif >= HalfTermLeng * 8 && SolsDif <= HalfTermLeng * 16 && NoonDif < 1.25 / 12 && NoonDif >= 1 / 12 && NodeDif <= 0.5 / 12) ||
                    (SolsDif >= HalfTermLeng * 7 && SolsDif <= HalfTermLeng * 17 && NoonDif < 1 / 12 && NoonDif >= 1 / 24 && NodeDif <= 0.5 / 12) ||
                    (SolsDif >= HalfTermLeng * 6 && SolsDif <= HalfTermLeng * 18 && NoonDif < 1 / 24 && NodeDif <= 0.5 / 12)) {
                    Status = 3
                }
            }
        } else if (['LindeA', 'LindeB'].includes(CalName)) {
            if (isYin) {
                if (SummsolsDif < 94) {
                    const StdBian = (1373 + SummsolsDif * 1.5) / Denom // 變準
                    const StdKe = SummsolsDif * 0.15 / Denom // 刻準
                    const StdShi = 0.18 - StdKe // 時準
                    if (NodeDif > StdBian && TotalDeci > 0.5 - StdShi && TotalDeci < 0.5 + StdShi) Status = 0
                }
            } else { // 不應食而食有三組情況，滿足一組即可
                if (SummsolsDif < 94) {
                    const StdBian = (248 - SummsolsDif * 2)
                    const StdKe = (StdBian - 60) / 18 / Denom
                    const StdShi = 0.07 + StdKe
                    if (NodeDif < StdBian / Denom && TotalDeci > 0.43 && TotalDeci < 0.57) Status = 3
                    else if (NodeDif < 60 / Denom && TotalDeci > 0.5 - StdShi && TotalDeci < 0.5 + StdShi) Status = 3
                } else if (NodeDif < 60 / Denom && TotalDeci > 0.375 && TotalDeci < 0.625) Status = 3
            }
        }
    }
    return Status
}

const EcliMagni2 = (Status, isNewm, CalName, Denom, NodeDenom, Solar25, Solar50, Solar75, Solar, HalfTermLeng, SynodicNodeDif50, isYin, isBefore, isFast, Season, NodeDif, NodeDif12, SolsDif, SolsDifHalfRev, SummsolsDif, NoonDif, TotalDeci, Tcorr) => {
    let Magni = 0, Mcorr = 0, TheNotEcli = 0
    if (Status) {
        const MoonAvgVDeg = AutoMoonAvgV(CalName)
        if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
            if (isNewm) {
                // 劉洪濤頁462說交前交後的意思。劉洪濤和藤豔輝對術文理解不一，劉洪濤認爲後面的「時差減者，先交減之，後交加之」一句用來描述前面的「皆去不食餘一時」，藤認爲後面和前面是分開的，後面直接加減時差，前面的一時符號都是-。感覺藤的說法可靠一些。
                const Portion1 = CalName === 'Daye' ? 1500 : 1810
                const Portion2 = CalName === 'Daye' ? 2000 : 2400
                const Portion3 = CalName === 'Daye' ? 184000 : 220800
                if (SolsDif > Solar75 || SolsDif < Solar * 0.125) {
                    Mcorr = Portion3
                } else if (SolsDif > Solar * 4 / 24 && SolsDif < Solar50) {
                    Mcorr = SummsolsDif * Portion1 // 1511.314
                } else {
                    Mcorr = SummsolsDif * Portion2 // 2015.08。極值18400
                }
                TheNotEcli = NodeDif - Mcorr / NodeDenom
                if (TheNotEcli < 0) {
                    if (CalName === 'Daye') TheNotEcli = (Portion3 - Mcorr) / NodeDenom
                    else TheNotEcli = -TheNotEcli
                }
                const MoonLimitDenom = isBefore && !isFast ? SynodicNodeDif50 : SynodicNodeDif50 - TheNotEcli
                const tmp = CalName === 'Daye' ? 10 : 4 // 大業「大寒畢小滿」，按照大業習慣，是小滿這一刻，不包含小滿一氣，戊寅則是說上一氣
                if (SolsDif > Solar * 2 / 24 && SolsDif < Solar * tmp / 24 && NodeDif > 5 / 12 && isBefore) {
                    TheNotEcli -= 1 / 12
                }
                Tcorr *= isBefore ? -1 : 1
                TheNotEcli += Tcorr
                if (TheNotEcli < 0) Magni = 15
                else Magni = 15 * (1 - TheNotEcli / MoonLimitDenom)
            } else {
                if (CalName === 'Daye') {
                    if ((Season === 1 && isBefore) || (Season === 3 && !isBefore) || (Season === 4 && isBefore)) Mcorr = 1 / 12
                } else {
                    if ((Season === 1 && !isBefore) || (Season === 3 && isBefore)) Mcorr = 1 / 24 // 春先交，秋後交
                    else if ((Season === 1 && isBefore) || (Season === 3 && !isBefore)) Mcorr = 2 / 12 // 春後交，秋先交
                    else if (Season === 4) Mcorr = 2 / 12
                }
                TheNotEcli = NodeDif - Mcorr
                if (TheNotEcli < 0) Magni = 15
                Magni = 15 - TheNotEcli * MoonAvgVDeg
            }
        } else if (CalName === 'Huangji') {
            if (isNewm) {
                if (SummsolsDif < 2 * HalfTermLeng) { // 朔在夏至前後二氣
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = Denom * 1.75 / 12
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = Denom * 1.25 / 12
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = Denom * 0.75 / 12
                    }
                } else if (SummsolsDif < 3 * HalfTermLeng) { // 朔在夏至前後三氣
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = Denom * 1.25 / 12
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = Denom * 0.75 / 12
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = Denom * 0.25 / 12
                    }
                } else if (SummsolsDif < 4 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = Denom * 0.75 / 12
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = Denom * 0.25 / 12
                    }
                } else if (SummsolsDif < 5 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = Denom * 0.25 / 12
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) { } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -10.1
                    }
                } else if (SummsolsDif < 6 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) { } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -10.1
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -15.2
                    }
                } else if (SummsolsDif < 7 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = -10.1
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -15.2
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -53.3
                    }
                } else if (SummsolsDif < 8 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = -15.2
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -53.3
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -60.9
                    }
                } else if (SummsolsDif < 9 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = -53.3
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -60.9
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -65.9
                    }
                } else if (SummsolsDif < 10 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = -60.9
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -65.9
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -71
                    }
                } else if (SummsolsDif < 11 * HalfTermLeng) {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = -65.9
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -71
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -76.1
                    }
                } else {
                    if (NoonDif >= 1 / 24 && NoonDif < 1 / 12) {
                        Mcorr = -71
                    } else if (NoonDif >= 1 / 12 && NoonDif < 1.5 / 12) {
                        Mcorr = -76.1
                    } else if (NoonDif >= 1.5 / 12 && NoonDif < 2 / 12) {
                        Mcorr = -81.2
                    }
                }
                Mcorr /= 96
                Magni = 15 * (SynodicNodeDif50 - NodeDif) / SynodicNodeDif50 - Mcorr
            } else {
                // const MoonMcorrList = [48, 43, 38, 33, 28, 23, 18, 15, 12, 9, 6, 3, 0, 13, 14, 15, 16, 17, 18, 21, 24, 27, 30, 33, 48]
                // Mcorr = -(MoonMcorrList[TermNum] + (MoonMcorrList[TermNum + 1] - MoonMcorrList[TermNum]) * TermNewmDif / HalfTermLeng) / 96
                // Magni = 15 * (SynodicNodeDif50 - NodeDif) / SynodicNodeDif50 + Mcorr 
                // 「以減望差，乃如月食法」
                if ((SolsDif > Solar25 && SolsDif < Solar50) || SolsDif > Solar75) {
                    Mcorr = 15 * (3 * ~~(SummsolsDif / HalfTermLeng) + 2 * (10 + NodeDif12)) / SynodicNodeDif50
                } else {
                    Mcorr = 15 * (3 * ~~(SummsolsDif / HalfTermLeng) + 2 * (10 + NodeDif12) + 2 * ~~(Solar25 - SolsDif % Solar50)) / SynodicNodeDif50
                }
                Magni = 15 * (SynodicNodeDif50 - NodeDif) / SynodicNodeDif50 + Mcorr / Denom
            }
        } else if (['LindeA', 'LindeB'].includes(CalName)) { // 下麟德求食分。NodeDif去交前後定分。558、552的不同，《中國古代曆法》頁82說要統一爲552，不過如果用定氣思路來看，興許不用改。
            if (isNewm) {
                Mcorr = 552 // 食差            
                if (isYin ? SolsDif > Solar25 && SolsDif < Solar75 : SolsDif < Solar25 || SolsDif > Solar75) {
                    Mcorr *= SolsDifHalfRev / Solar25
                }
                Mcorr /= Denom
                let sign = isYin ? -1 : 1
                sign *= isBefore ? -1 : 1
                if (isYin) {
                    TheNotEcli = Math.abs(NodeDif + sign * Mcorr)
                    if (SummsolsDif < HalfTermLeng * 2) {
                        if (TotalDeci > 0.57 || TotalDeci < 0.43) { // 「一時」應該是1/12，等於一辰，五紀有相同的話
                            TheNotEcli -= 1 / 12
                        } else if (TotalDeci > 0.47 && TotalDeci < 0.53) {
                            TheNotEcli += 1 / 12
                        }
                    } else if (SolsDif > HalfTermLeng * 2 && SolsDif < HalfTermLeng * 4) { // 大寒畢立春
                        if (isBefore && NodeDif > 5 / 12) {
                            TheNotEcli -= 1 / 12
                        } else {
                            TheNotEcli += 1 / 12
                        }
                    } else if (SolsDif > HalfTermLeng * 14 && SolsDif < HalfTermLeng * 22) { // 大暑畢立冬
                        if (!isBefore && NodeDif > 5 / 12) {
                            TheNotEcli -= 1 / 12
                        } else {
                            TheNotEcli += 1 / 12
                        }
                    }
                } else {
                    TheNotEcli = SynodicNodeDif50 - (NodeDif + sign * Mcorr) // 這種情況就像大衍的類同陽曆了，去交越大食分越大
                }
                Magni = 15 - TheNotEcli / (104 / Denom - Mcorr / 15)
                if (NodeDif + sign * Mcorr < 0) {
                    Magni = 15
                    Status = 1 // 不足減者，食旣    
                }
            } else {
                if (Season === 1) {
                    Mcorr = isBefore ? 200 : 100
                } else if (Season === 2) {
                    Mcorr = 54
                } else if (Season === 3) {
                    Mcorr = isBefore ? 100 : 200
                } else if (Season === 4) {
                    Mcorr = 224
                }
                NodeDif -= Mcorr / Denom
                Magni = (SynodicNodeDif50 - NodeDif) / (104 / Denom) // 準確的是103.554111
            }
        }
    }
    return Magni
}
const EcliLast2 = (CalName, Magni, TotalDeci, AnomaAccum, Denom) => {
    let Last = 0
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        const LastList = [0, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 22, 22] // 月食刻數。最後加一個22，方便程序
        Last = LastList[~~Magni] + deci(Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
    } else if (CalName === 'Huangji') {
        // const LastList = [0, 19, 6, 8, 4, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1, 0] // 實在無法理解，暫時案麟德
        const LastList = [0, 1, 2, 3, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 20]
        Last = LastList[~~Magni] + deci(Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        const LastList = [0, 1, 2, 3, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 20]
        Last = LastList[~~Magni] + deci(Magni) * (LastList[~~Magni + 1] - LastList[~~Magni])
        const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif(AnomaAccum, CalName) // 紀元：食甚加時入轉算外損益率。應朒者依其損益，應朏者益減損加其副
        Last *= 1 + MoonTcorrDif / TheDenom / Denom // 舊唐「以乘所入變增減率，總法而一，應速：增損減加，應遲：依其增減副」
    }
    let Portion = 0.5
    if (['Daye', 'WuyinA', 'WuyinB'].includes(CalName)) {
        Portion = 0.6
    } else if (['LindeA', 'LindeB'].includes(CalName)) {
        Portion = 0.4
    }
    const StartDeci = (TotalDeci - Portion * Last / 100 + 1) % 1
    const EndDeci = TotalDeci + (1 - Portion) * Last / 100
    return { StartDeci, EndDeci }
}

// 春夏秋冬各三月，那麼閏月怎麼辦呢，所以輸入的時候應該用day的noleapmon，閏月還是上一個月
const Eclipse2 = (NodeAccum, AnomaAccum, AcrDeci, SolsDif, isNewm, CalName, Month, Leap) => {
    const { Type, Node, Lunar, Anoma, Solar, Denom, NodeDenom } = Para[CalName]
    const SynodicNodeDif50 = (Lunar - Node) / 2 // 望差
    const Node50 = Node / 2
    const Node25 = Node / 4
    const Solar50 = Solar / 2
    const Solar25 = Solar / 4
    const Solar75 = Solar * 0.75
    const SolsDif = SolsDif % Solar
    const SolsDifHalf = SolsDif % Solar50
    const SolsDifHalfRev = Solar25 - Math.abs(SolsDifHalf - Solar25)
    const SummsolsDif = Math.abs(SolsDif - Solar50)
    const HalfTermLeng = Solar / 24
    const NodeAccumHalf = NodeAccum % Node50
    let NodeDif = Node25 - Math.abs(NodeAccumHalf - Node25) // 麟德去交前後分。百一十二約前後分，爲去交時    
    const NodeDif12 = NodeDif * Denom / 112 // 去交時。這裡的去交分是1日，為了方便，去交時轉爲日法爲單位
    const isYin = NodeAccum > Node50
    const isBefore = NodeAccumHalf > Node25 // 交後，在交點之後    
    const isFast = AnomaAccum < Anoma / 2 // AnomaAccum > Anoma * 0.25 && AnomaAccum <= Anoma75    
    let Season = 1
    if (Month >= 1 && Month <= 3) {
    } else if (Month >= 4 && Month <= 6) Season = 2
    else if (Month >= 7 && Month <= 9) Season = 3
    else Season = 4
    //  下戊寅食甚時刻修正（大業月食食甚無修正）。當然要先算出是否食，再來修正。戊寅時法6503：半日法，時餘：不足半辰的日分數的12倍。離交點越遠，修正值越大
    const { TotalDeci, NoonDif, Tcorr } = EcliTcorr2(isNewm, CalName, Type, Solar25, Solar75, HalfTermLeng, isYin, Season, NodeDif, NodeDif12, AnomaAccum, AcrDeci, Denom, SolsDif, SolsDifHalf, SolsDifHalfRev)
    let Status = EcliStatus2(isNewm, CalName, Denom, Solar25, Solar75, Solar, Lunar, HalfTermLeng, SynodicNodeDif50, isYin, isBefore, isFast, Season, NodeDif, Month, Leap, SolsDif, SolsDifHalfRev, SummsolsDif, NoonDif, TotalDeci)
    let Magni = EcliMagni2(Status, isNewm, CalName, Denom, NodeDenom, Solar25, Solar50, Solar75, Solar, HalfTermLeng, SynodicNodeDif50, isYin, isBefore, isFast, Season, NodeDif, NodeDif12, SolsDif, SolsDifHalfRev, SummsolsDif, NoonDif, TotalDeci, Tcorr)
    const MagniFunc = ExMagni(Magni, Type, CalName, isNewm)
    Magni = MagniFunc.Magni
    Status = MagniFunc.Status
    const { StartDeci, EndDeci } = EcliLast2(CalName, Magni, TotalDeci, AnomaAccum, Denom)
    return { Magni, Status, StartDeci, TotalDeci, EndDeci }
}
// console.log(Eclipse2(14.4, 7, 0.35, 52, 1, 'WuyinA', 1, 0))

//////////////////////// 上面的NodeDif是一日，下面的TheNodeDif是日分

const EcliTcorr3 = (isNewm, isYin, CalName, Type, Denom, Solar25, Solar75, NewmNoonDif, NewmNoonDifAbs, Rise, RiseNoonDif, AvgTotalDeci, AvgTotalNoonDif, AcrDeci, AvgDeci, AvgMoonTcorr, MoonAcrV, SunTcorr, NodeDif, AcrSolsDif) => {
    let Tcorr = 0
    const isSunYin = AcrSolsDif > Solar25 && AcrSolsDif < Solar75
    const isSame = (isYin && isSunYin) || (isYin && isSunYin)
    if (['Dayan', 'Wuji', 'Tsrengyuan'].includes(CalName)) { // 大衍日月食的時差一樣的
        Tcorr = NodeDif * AutoNodePortion(CalName) / 20 / Denom
        Tcorr *= isSame ? 1 : -1
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
            Tcorr = NewmNoonDifAbs * (0.5 - NewmNoonDifAbs) / 3 // 午前，0-0.5<0, f(0.25)=-0.0208
            Tcorr *= AcrDeci >= 0.5 ? 2 : -1
        } else if (Type === 9) {
            Tcorr = AvgTotalNoonDif * (0.5 - AvgTotalNoonDif) / 1.5
            Tcorr *= AvgTotalDeci >= 0.5 ? 1.5 : -1
        } else if (Type === 10) {
            Tcorr = 2 * AvgTotalNoonDif * (0.5 - AvgTotalNoonDif) // 的確要倍之，這樣感覺太大了
            Tcorr *= AvgTotalDeci >= 0.5 ? 1 : -1
        } else if (Type === 11) {
            Tcorr = NewmNoonDifAbs * (0.5 - NewmNoonDifAbs) / 0.96 //「在中前爲減，中後爲加」。「退二位」。最大值一個半小時左右《中國古代的日食時差算法》
            Tcorr *= AcrDeci >= 0.5 ? 1 : -1
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
        } else if (['Shoushi', 'Shoushi2'].includes(CalName)) {
            const AcrDeciHalfRev = 0.25 - Math.abs(AcrDeci % 0.5 - 0.25)
            Tcorr = AcrDeciHalfRev ** 2 / 4.78
            Tcorr *= AcrDeci > 0.5 ? -1 : 1 // 子前以減
        } else if (CalName === 'Datong') { // 通軌大統都是加
            const AcrDeciHalfRev = 0.25 - Math.abs(AcrDeci % 0.5 - 0.25)
            Tcorr = (1 - AcrDeciHalfRev) / 100
        }
    }
    let TotalDeci = 0 // 食甚定餘
    // if (CalName === 'Qintian' && isNewm) { // 原文是這麼說的，但也太扯了，這樣結果很奇怪
    //     TotalDeci = AcrDeci < 0.5 ? 0.5 + Tcorr : AcrDeci + Tcorr
    // } else
    if (CalName === 'Mingtian') { // 明天沒有時差，《數理》頁424
        TotalDeci = (AvgDeci + AvgMoonTcorr) * 13.37 / MoonAcrV + SunTcorr
    } else if (Type === 9 || Type === 10) {
        TotalDeci = AvgTotalDeci + Tcorr
    } else {
        TotalDeci = AcrDeci + Tcorr
    }
    TotalDeci = (TotalDeci + 1) % 1
    let TheTotalNoonDif = 0
    if (CalName === 'Qintian') {
        TheTotalNoonDif = NewmNoonDifAbs
    } else if (['Xuanming', 'Mingtian', 'Guantian'].includes(CalName) || Type === 9 || Type === 10) {
        TheTotalNoonDif = Math.abs(TotalDeci - 0.5) // 觀天紀元午前後分
    } else { // 包括授時。大統「但加不減」
        TheTotalNoonDif = NewmNoonDifAbs + Math.abs(Tcorr) // 距午分，崇天午前後定分
    }
    const dd = 1 - TheTotalNoonDif / RiseNoonDif // 如果dd<0，卽TheTotalNoonDif在日出前日落後，符號相反，所以把原來的Math.abs(dd)直接改成dd
    return { Tcorr, TotalDeci, TheTotalNoonDif, dd, isSame }
}

const EcliMcorr3 = (CalName, Type, HalfTermLeng, Node25, Node50, Sidereal25, Sidereal50, Sidereal, Solar125, Solar25, Solar375, Solar50, Solar75, Solar875, Solar, NodeCycle25, NodeCycle50, MoonLimit1, Denom, AcrTermList,
    isNewm, isYin, isDescend, isSame, AcrSolsDif, AvgSolsDif, dd, TotalDeci, TheTotalNoonDif, RiseNoonDif, AcrNodeAccum, AvgNodeAccum, AvgNodeAccumCorr, AcrNewmNodeAccum, Tcorr, AvgTcorr, SolsAccum) => {
    let TheSolsDif = 0
    if (CalName === 'Chongxuan') { // 「距天正中氣積度」
        TheSolsDif = AvgSolsDif + AutoDifAccum(0, AvgSolsDif, CalName).SunDifAccum
    } else if (Type === 7 || ['Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Guantian'].includes(CalName)) {
        TheSolsDif = AcrSolsDif
    } else if (CalName === 'Mingtian' || Type >= 9) {
        TheSolsDif = AvgSolsDif + Tcorr + AvgTcorr
        TheSolsDif += AutoDifAccum(0, TheSolsDif, CalName).SunDifAccum // 紀元食甚日行積度
    }
    let TheSolsDifHalf = TheSolsDif % Solar50 // 應天「置朔定積，如一百八十二日⋯⋯以下爲入盈日分；以上者去之，餘爲入縮日分」
    const TheSolsDifHalfRev = Solar25 - Math.abs(TheSolsDifHalf - Solar25) // 反減
    const isSunYin = TheSolsDif > Solar25 && TheSolsDif < Solar75
    // 宣明曆創日食三差：【時差Tcorr】食甚時刻改正【氣差McorrTerm刻差McorrClock加差McorrOther】食分改正 
    let Mcorr = 0, YinYangBorder = 0
    let isInside = true, Std1 = 0, Std2 = 0, StatusRaw = 3 // 這五個是崇玄的
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
            } else sign1 = isDescend ? 1 : -1
            sign1 *= isSunYin ? -1 : 1
            sign1 *= Math.abs(TotalDeci - 0.5) > Math.abs(RiseNoonDif) ? -1 : 1
            if (['Xuanming', 'Yingtian', 'Qianyuan', 'Yitian'].includes(CalName) || Type === 10) {
                sign2 = isYin ? -1 : 1
            } else sign2 = isDescend ? 1 : -1
            sign2 *= TotalDeci >= 0.5 ? -1 : 1 // 定朔還是食甚都沒影響，因為時差加減方向是相合的
            sign2 *= TheSolsDif >= Solar50 ? -1 : 1
            if (TotalDeci > 0.5) sign3 = isYin ? -1 : 1
            else sign3 = 0
        }
        let McorrTerm = 0, McorrClock = 0, McorrOther = 0
        let Mcorr0 = 0 // 這個是紀元、授時的。視白道比眞白道低，所以陽曆：視月亮距交大於眞月亮，陰曆：小於        
        if (CalName === 'Dayan') {
            let TermNum = 0
            const McorrBList = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 385, 325, 270, 220, 175, 135, 100, 70, 45, 25, 10, 0, 10]
            for (let j = 0; j <= 23; j++) {
                if (TheSolsDif >= AcrTermList[j] && TheSolsDif < AcrTermList[j + 1]) {
                    TermNum = j % 24
                    break
                }
            }
            McorrB = Interpolate3(TheSolsDif, Make2DPoints(AcrTermList, McorrBList, TermNum)) // 當日差積            
            McorrB *= isYin ? -1 : 1
            YinYangBorder = 1275 + McorrB // 食定差=冬至食差「陰曆蝕差」+LimitCorr  
        } else if (CalName === 'Qintian') {
            const SolsDeci = deci(SolsAccum)
            const Lati = Math.abs(AutoLongi2Lati(TheSolsDif, SolsDeci, 'Chongxuan').Lati)
            McorrA = MoonLimit1 * Lati * Denom / 251300 // 黃道出入食差
            YinYangBorder = McorrA * dd
            YinYangBorder = MoonLimit1 + (isYin ? -1 : 1) * YinYangBorder // 假設lati的單位是經法72，那麼常準在430-2322
            const tmp = Math.abs(AvgSolsDif % Solar25 - Solar125) * 24 // 「置日躔入曆⋯⋯」那就是經朔距冬至日，定朔距冬至日叫「定朔加時入曆」
            const signtmp = AvgSolsDif % Solar50 < Solar125 || AvgSolsDif % Solar50 >= Solar * 0.375 ? -1 : 1
            McorrB = 2772 + signtmp * tmp // 黃道斜正食差。範圍1692-3852
            YinYangBorder += McorrB * TheTotalNoonDif / RiseNoonDif
        } else if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            const isBefore = TheNodeAccumHalf > Node25
            const Max = CalName === 'Wuji' ? 457 : 373
            const step = CalName === 'Wuji' ? 5 : 4 // 本來應該是5，夏至不盡，連續5.00486
            if (TheSolsDif > Solar25 && TheSolsDif < Solar75) {
                McorrB = Max
            } else if (TheSolsDif >= Solar75) {
                McorrB = Max - step * (TheSolsDif - Solar75)
            } else {
                McorrB = step * TheSolsDif
            }
            McorrB = isYin ? Max - McorrB : McorrB // 本來還要再對稱的寫一遍，但是發現這就是陰陽反減，直接把原來的刪掉            
            if (TheSolsDif >= Solar * 10 / 24 && TheSolsDif < Solar * 14 / 24) {
                if (TotalDeci < 0.5 - 0.08 || TotalDeci > 0.5 + 0.08) {
                    McorrA = -Denom / 12 // 這是加在陰曆、類陽曆上的
                } else if (TotalDeci > 0.5 - 0.03 && TotalDeci < 0.5 + 0.03) {
                    McorrA = Denom / 12
                }
            }
            if (TheSolsDif >= Solar * 2 / 24 && TheSolsDif < Solar * 4 / 24) {
                if (isBefore && TheNodeDif > Denom * 5 / 12) {
                    McorrA -= Denom / 12
                }
            } else if (TheSolsDif >= Solar * 14 / 24 && TheSolsDif < Solar * 22 / 24) {
                if (!isBefore && TheNodeDif > Denom * 5 / 12) {
                    McorrA -= Denom / 12
                }
            }
        } else if (CalName === 'Xuanming') {
            McorrTerm = (2350 - 26 * TheSolsDifHalfRev) * dd
            McorrTerm = McorrTerm < 0 ? 0 : McorrTerm // 因為26不連續，最後剩了一天<0。連續：25.73618
            if (TheSolsDifHalf < Solar125) {
                McorrClock = 2.1 * TheSolsDifHalf // 連續的話我改成2.06985
            } else if (TheSolsDifHalf < Solar375) {
                McorrClock = 94.5
            } else {
                TheSolsDifHalf -= Solar375
                McorrClock = 94.5 - 2.1 * TheSolsDifHalf
            }
            McorrClock *= McorrClock < 0 ? 0 : TheTotalNoonDif // 應該不用*100
            if (TotalDeci > 0.5) {
                if (TheSolsDif < Solar125) {
                    McorrOther = 51 - TheSolsDif * 17 / HalfTermLeng
                } else if (TheSolsDif > Solar875) {
                    McorrOther = (TheSolsDif - Solar875) * 17 / HalfTermLeng
                }
            }
        } else if (CalName === 'Chongxuan') {
            const C = (365.5 - TheSolsDif) / 0.3655 // 限心
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
            if (isInside) {
                if (isYin) {
                    TheNodeDif += McorrYang
                } else {
                    TheNodeDif = McorrYang - TheNodeDif
                    StatusRaw *= TheNodeDif < 0 ? 0 : 1
                }
            } else {
                if (isYin) {
                    TheNodeDif -= McorrYin // 這樣加減之後就是「去交定分」
                    StatusRaw *= TheNodeDif < 0 ? 0 : 1
                } else StatusRaw = 0
            }
        } else if (CalName === 'Yingtian') {
            McorrTerm = (374 - 4 * TheSolsDifHalfRev) * dd // 藤豔輝頁101：最大值52.41分鐘
            if (TheSolsDifHalf > 45 && TheSolsDifHalf < 137) { // 最大值0.075日
                McorrClock = 1500 * TheTotalNoonDif
            } else {
                if (TheSolsDifHalf < 45) {
                    TheSolsDifHalf = 45 - TheSolsDifHalf
                    McorrClock = 33.5 * TheSolsDifHalf * TheTotalNoonDif
                } else {
                    TheSolsDifHalf -= 137
                    McorrClock = (1500 - 33.5 * TheSolsDifHalf) * TheTotalNoonDif
                }
            }
        } else if (CalName === 'Qianyuan') {
            if (TheSolsDifHalf < 90) {
                McorrTerm = 9.1 * TheSolsDifHalf
            } else {
                TheSolsDifHalf -= 90
                McorrTerm = (819 - 9.1 * TheSolsDifHalf)  // 《中國古代曆法》頁96說二至前是二至後的10倍，寫錯了吧？ // 藤豔輝頁101說乾元刻差極值15.2小時，沒對吧
            }
            McorrTerm *= dd > 0 ? dd : 1
            if (TheSolsDifHalf >= 45 && TheSolsDifHalf < 137) {
                McorrClock = 333 // 單位是刻分。極值0.11日
            } else {
                if (TheSolsDifHalf < 45) {
                    McorrClock = 7.4 * TheSolsDifHalf
                } else {
                    TheSolsDifHalf -= 137
                    McorrClock = 333 - 7.4 * TheSolsDifHalf
                }
            }
            McorrClock *= TheTotalNoonDif
        } else if (CalName === 'Yitian') {
            const { QuarA, QuarB } = AutoQuar(CalName)
            McorrTerm = TheSolsDifHalfRev * 2826 / (TheSolsDif >= QuarA && TheSolsDif < Solar50 + 946785.5 / Denom ? QuarB : QuarA)
            McorrTerm = 2826 - 30.15 * TheSolsDifHalfRev
            McorrTerm *= dd > 0 ? dd : 1
            if (TheSolsDif < Solar125) {
                McorrClock = 100 * TheSolsDif * Denom / 442384 // 藤豔輝頁100說二至前後205日分，其餘13.5小時，這也太扯淡，我這樣處理一下，能夠大致連續，但跟原文差得有點多
            } else if (TheSolsDif < Solar375) {
                McorrClock = 113.625
            } else if (TheSolsDif < Solar50) {
                TheSolsDif -= Solar375
                McorrClock = 164.57 - TheSolsDif * Denom / 279858
            } else if (TheSolsDif < Solar50 + Solar125) {
                McorrClock = TheSolsDifHalf * Denom / 279858
            } else if (TheSolsDif < Solar50 + Solar375) {
                McorrClock = 113.625
            } else {
                TheSolsDif -= Solar875
                McorrClock = 104.1 - TheSolsDif * Denom / 442384
            }
            McorrClock *= TheTotalNoonDif * 10
            if (TotalDeci > 0.5) {
                if (TheSolsDif < Solar125) {
                    McorrOther = 61.32 - TheSolsDifHalf * 20.44 / HalfTermLeng
                } else if (TheSolsDif > Solar875) {
                    TheSolsDif -= Solar875
                    McorrOther = TheSolsDif * 20.44 / HalfTermLeng
                }
            }
        } else if (CalName === 'Mingtian') { // 藤豔輝頁103 兩個食差最大值均為508分=5.08度=9.12小時 // 明天的日躔盈縮度是平分的，不像儀天是定氣，同樣需要反減
            const QuarA = 60.875 // 交食的盈初縮末
            const QuarB = 121.75 // 縮初盈末
            let TheRev = TheSolsDifHalf
            TheRev = TheRev > QuarA ? Solar50 - TheRev : TheRev
            const Portion12 = TheSolsDifHalf < QuarA || TheSolsDifHalf >= Solar50 + QuarB ? 2 : 1 // 不太明白這樣前後一拉一申有什麼區別
            const tmp = 4 * Math.abs(0.25 - TheTotalNoonDif)
            McorrClock = (106 / 3093) * (243.5 - Portion12 * TheRev) * Portion12 * TheRev // 東西差
            McorrTerm = (508 - McorrClock) * tmp // 南北差
            McorrClock *= 1 - tmp
        } else if (CalName === 'Guantian') {
            const { QuarA, QuarB } = AutoQuar(CalName, Type)
            if (TheSolsDif < Solar50) {
                if (TheSolsDifHalf > QuarA) {
                    TheSolsDifHalf = Solar50 - TheSolsDifHalf
                }
            } else if (TheSolsDif > Solar50) {
                if (TheSolsDifHalf > QuarB) {
                    TheSolsDifHalf = Solar50 - TheSolsDifHalf
                }
            }
            if (TheSolsDif < QuarA || TheSolsDif > Solar50 + QuarB) {
                McorrTerm = (4010 - TheSolsDifHalf ** 2 / 1.97) * dd
            } else {
                McorrTerm = (4010 - TheSolsDifHalf ** 2 / 2.19) * dd
            }
            McorrClock = (Solar50 - TheSolsDifHalf) * TheSolsDifHalf / 2.09
            McorrClock *= TheTotalNoonDif * Denom / 3700.5 // 單位 午前後分
        } else { // 崇天、紀元、遼金、授時
            const Portion = Type === 11 ? 1870 : +(3.43 * 7290 / Denom).toFixed(2) // 3*Solar25**2 ，以紀元爲準。紀元3.43，崇天2.36，大明庚午4.78
            const McorrTermMax = Type === 11 ? 4.46 : Math.round(91.31 ** 2 / (Portion + 0.0005)) // 崇天3533，紀元2430，大明庚午1744            
            McorrTerm = (McorrTermMax - TheSolsDifHalfRev ** 2 / Portion) // 氣差
            McorrTerm *= dd // 氣差定數 置日食甚日行積度。紀元是午前後分，崇天是距午定分。紀元最後有「如半晝分而一，所得，在氣差已上者，即以氣差覆減之，余應加者為減，減者為加。」崇天「如不及減者，覆減爲定數，應加者減之⋯⋯」那就什麼都不用處理
            const McorrClockRaw = (Solar50 - TheSolsDifHalf) * TheSolsDifHalf / Portion
            McorrClock = McorrClockRaw * TheTotalNoonDif * 4
            if (Type === 9 || Type === 11) { // 只有紀元授時有這種處理。如果崇天用這個，1042食分從5.02變成4.96
                McorrClock = McorrClock > McorrClockRaw ? McorrClockRaw * 2 - McorrClock : McorrClock // 紀元「以午前後分乘而倍之，如半法而一」後面又來一句「⋯⋯如半法而一，所得，在刻差已上者，卽倍刻差，以所得之數減之，餘爲刻差定數，依其加減」 授時「若在泛差以上者，倍泛差減之，餘爲定差」，卽如果定朔在日出前日落後
            }
        }
        if (Type === 9) { // 紀元「置朔入交常日⋯⋯以氣刻差定數各加減之，交初加三千一百，交中減三千，爲朔入交定日」
            const Mcorr0Descend = Math.round(Denom * (3100 / 7290))
            const Mcorr0Ascend = Math.round(Denom * (3000 / 7290))
            Mcorr0 = isDescend ? Mcorr0Descend : -Mcorr0Ascend // 5.685度        
        } else if (['Datong', 'Datong2'].includes(CalName)) {
            Mcorr0 = isDescend ? 6.153419 : -6.1532905
        } else if (Type === 11) {
            Mcorr0 = isDescend ? 6.1534 : -6.1533
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
                if (TheSolsDif >= AcrTermList[j] && TheSolsDif < AcrTermList[j + 1]) {
                    TermNum = j % 24
                    break
                }
            }
            McorrB = Interpolate3(TheSolsDif, Make2DPoints(AcrTermList, McorrBList, TermNum))
            if (isSame) {
                McorrB *= !isBefore ? -1 : 1
            } else {
                McorrB *= isBefore ? -1 : 1 // 交前                
            }
            TheNodeDif += McorrB + (isBefore ? -1 : 1) * Denom / 12 // 「交前減一辰，交後加一辰」
        }
    }
    if (CalName === 'Mingtian') {
        let position = AcrSolsDif + Tcorr + AvgTcorr + Mcorr
        const TheDif = frc('9901159/184270880') // 每日交點退行
        const SiderealFrc = frc('365 1600447/6240000')
        let NodeDeg = SiderealFrc.sub(TheDif.mul(frc(AvgSolsDif + SolsAccum)).mod(SiderealFrc)).toString() // 這應該是正交度
        NodeDeg = +NodeDeg
        position += position < NodeDeg ? Sidereal : 0
        TheNodeAccum = position - NodeDeg
        isDescend = TheNodeAccum < 20 || TheNodeAccum > 340
        TheNodeDif = (Sidereal25 - Math.abs(TheNodeAccum % Sidereal50 - Sidereal25)) * 100 // 交前後分「其度以百通之爲分」。我直接加上食差來判斷，就不用先判斷陰陽曆，加上食差再判斷陰陽曆
    } else if (Type === 11) {
        TheNodeAccum = AvgNodeAccum * 13.36875 + AutoDifAccum(0, AvgSolsDif, CalName).SunDifAccum + Mcorr
        TheNodeDif = NodeCycle25 - Math.abs(TheNodeAccum % NodeCycle50 - NodeCycle25) // 本來是AutoDifAccum(0, TheSolsDif, CalName).SunDifAccum
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
    return { TheNodeAccum, TheNodeDif, Std1, Std2, StatusRaw, YinYangBorder, McorrA, McorrB }
}

const EcliMagni3 = (CalName, Type, isNewm, isYin, Denom, Sidereal50, Node50, MoonAcrVList, SunLimitYang, SunLimitYin, SunLimitNone, SunLimitNoneYang, SunLimitNoneYin, MoonLimitDenom, MoonLimitNone, MoonLimit1,
    TheNodeAccum, TheNodeDif, TotalDeci, AcrAnomaAccum, StatusRaw, Std1, Std2, YinYangBorder, McorrA, McorrB) => {
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
            if (StatusRaw) {
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
                } else Magni = 15 - TheNodeDif / Dingfa
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
            } else {
                isYin = true
                TheNodeDif -= SunLimitYang // 以上者去之                
                TheNodeDifYin = TheNodeDif
            }
            if ((isYin && TheNodeDif < SunLimitYin) || !isYin) {
                let tmp = (0.75 - TotalDeci) * 133.7
                tmp *= TotalDeci > 0.5 ? 0.5 : 2
                let Dingfen = Math.abs(TheNodeDif - tmp) // 食定分
                if (TheNodeDif - tmp < 0) {
                    Dingfen = 10 * Dingfen + TheNodeDifYin
                }
                Magni = Dingfen / ((isYin ? SunLimitYin : SunLimitYang) / MagniPortion)
            }
        } else if (CalName === 'Mingtian' && TheNodeAccum > Sidereal50) { // 到底是Sidereal50還是Cycle50，按術文是sidereal
            if (TheNodeDif < SunLimitYang) {
                TheNodeDif *= 2 // 類同陽曆分
            } else {
                TheNodeDif = SunLimitNone - TheNodeDif // 「以上者，覆減食限，餘爲陰曆食分」
            }
            Magni = TheNodeDif / 97.6
        } else if (Type === 9 || Type === 11) {
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
    const Status = MagniFunc.Status
    return { Magni, Status, Last, TheNotEcli, TheNodeDif }
}

const EcliLast3 = (CalName, Type, isNewm, Last, Magni, TheNodeDif, TotalDeci, Tcorr, AvgTcorr, isDescend, isYin, TheNotEcli, Denom, Anoma, MoonAcrVList, AcrAnomaAccum, AvgAnomaAccum, Anoma50, MoonLimit1, MoonLimitNone, SunLimitYang, SunLimitYin, YinYangBorder) => {
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
            } else { // 宣明食延與五紀完全一樣
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
                } else Last = 387 - TheNotEcli ** 2 / 2362
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
            } else Last = isDescend ? 3900 - TheNodeDif ** 2 / 459 : 3315 - TheNodeDif ** 2 / 540 // 1338降到0
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
            if (isNewm) Last = isYin ? LastMaxSun - TheNodeDif ** 2 / LastDenomSunYin : LastMaxSun - TheNodeDif ** 2 / LastDenomSunYang
            else Last = LastMaxMoon - TheNodeDif ** 2 / LastDenomMoon
            const { MoonTcorrDifNeg: MoonTcorrDif, TheDenom } = AutoMoonTcorrDif((AvgAnomaAccum + Tcorr + AvgTcorr) % Anoma, CalName) // 食甚加時入轉算外損益率。應朒者依其損益，應朏者益減損加其副
            Last *= 1 + MoonTcorrDif / TheDenom / Denom
        } else if (Type === 10) {
            if (isNewm) Last = Magni * (30 - Magni) * 2450 / MoonAcrVList[~~AcrAnomaAccum]
            else Last = Magni * (35 - Magni) * 2100 / MoonAcrVList[~~AcrAnomaAccum]
        } else if (Type === 11) {
            Last = Math.sqrt(((isNewm ? 20 : 30) - Magni) * Magni)
                * (['Datong', 'Datong2'].includes(CalName) && !isNewm ? 0.00492 : 0.00574)
                / (MoonFormula(AcrAnomaAccum, CalName).MoonAcrV - 0.082)
        }
        if (['Wuji', 'Tsrengyuan'].includes(CalName)) {
            let Portion = 0.5
            if (isNewm) {
                if (TotalDeci < 1 / 3) Portion = 0.4
                else if (TotalDeci > 5 / 12) Portion = 0.6
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

const Eclipse3 = (AvgNodeAccum, AvgAnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, Rise, SolsAccum, isNewm, CalName) => {
    const { Type, SolarRaw, Sidereal, Node, Anoma, MoonAcrVList, Denom, AcrTermList,
        SunLimitNone, MoonLimitNone, SunLimitNoneYang, SunLimitNoneYin, SunLimitYang, SunLimitYin
    } = Para[CalName]
    let { Solar, MoonLimit1, MoonLimitDenom } = Para[CalName]
    Solar = Solar || SolarRaw
    AcrSolsDif %= Solar // 注意，AcrSolsDif是定朔距冬至日，而非積度
    AvgSolsDif %= Solar
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
    const { Tcorr2: AvgTcorr, SunTcorr, MoonAcrV, MoonTcorr: AvgMoonTcorr, NodeAccumCorrA: AvgNodeTcorr
    } = AutoTcorr(AvgAnomaAccum, AvgSolsDif, CalName) // 經朔修正    
    const AcrAnomaAccum = (AvgAnomaAccum + AvgTcorr) % Anoma // 定朔入轉
    const AvgNodeAccumCorr = AvgNodeAccum + SunTcorr // 入交常日    
    const AcrNodeAccum = AvgNodeAccum + AvgNodeTcorr // 入交定日
    const AcrNewmNodeAccum = AvgNodeAccum + AvgTcorr // 紀元定朔入交泛日
    const NewmNoonDif = AcrDeci - 0.5 // 應天乾元儀天崇天午前後分
    const NewmNoonDifAbs = Math.abs(NewmNoonDif)
    const isDescend = AvgNodeAccum < 3 || AvgNodeAccum > 25 // 交中前後皆為交中
    let isYin = AcrNodeAccum > Node50
    let Tcorr0 = 0, AvgTotalDeci = 0, AvgTotalNoonDif = 0 // 紀元中前後分
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
    const { Tcorr, TotalDeci, TheTotalNoonDif, dd, isSame } = EcliTcorr3(isNewm, isYin, CalName, Type, Denom, Solar25, Solar75, NewmNoonDif, NewmNoonDifAbs, Rise, RiseNoonDif, AvgTotalDeci, AvgTotalNoonDif, AcrDeci, AvgDeci, AvgMoonTcorr, MoonAcrV, SunTcorr, NodeDif, AcrSolsDif)
    ////////////////////// 食差
    const { TheNodeAccum, TheNodeDif: TheNodeDifRaw, Std1, Std2, StatusRaw, YinYangBorder, McorrA, McorrB } = EcliMcorr3(CalName, Type, HalfTermLeng, Node25, Node50, Sidereal25, Sidereal50, Sidereal, Solar125, Solar25, Solar375, Solar50, Solar75, Solar875, Solar, NodeCycle25, NodeCycle50, MoonLimit1, Denom, AcrTermList,
        isNewm, isYin, isDescend, isSame, AcrSolsDif, AvgSolsDif, dd, TotalDeci, TheTotalNoonDif, RiseNoonDif, AcrNodeAccum, AvgNodeAccum, AvgNodeAccumCorr, AcrNewmNodeAccum, Tcorr, AvgTcorr, SolsAccum)
    isYin = TheNodeAccum > Node50
    ////////////////////// 食分
    let { Magni, Status, Last, TheNotEcli, TheNodeDif } = EcliMagni3(CalName, Type, isNewm, isYin, Denom, Sidereal50, Node50, MoonAcrVList, SunLimitYang, SunLimitYin, SunLimitNone, SunLimitNoneYang, SunLimitNoneYin, MoonLimitDenom, MoonLimitNone, MoonLimit1,
        TheNodeAccum, TheNodeDifRaw, TotalDeci, AcrAnomaAccum, StatusRaw, Std1, Std2, YinYangBorder, McorrA, McorrB)
    //////////////////////  食延
    const { StartDeci, EndDeci } = EcliLast3(CalName, Type, isNewm, Last, Magni, TheNodeDif, TotalDeci, Tcorr, AvgTcorr, isDescend, isYin, TheNotEcli, Denom, Anoma, MoonAcrVList, AcrAnomaAccum, AvgAnomaAccum, Anoma50, MoonLimit1, MoonLimitNone, SunLimitYang, SunLimitYin, YinYangBorder)
    return { Magni, Status, StartDeci, TotalDeci, EndDeci } // start初虧，total食甚
}
// console.log(Eclipse3(14.034249657, 11.1268587106, 0.45531, 0.44531, 31.9880521262, 31.9780521262, 8194819414.14, 0, 'Mingtian'))
// console.log(Eclipse3(12.85874, 0.3524, 0.83546, 0.79093, 156.3253, 156.2809, 0, 0, 'Datong').Magni) // 2021年四月望
// console.log(Eclipse3(13.81, 22, 0.674916, 0.22, 22.4549, 22, 8194819414.14, 1, 'Chongxuan')) // 這種情況其他曆都不食，只有授時食，這是月盈縮差帶來的，應該正常
// console.log(Eclipse3(26 + 5644.4277 / 10590, 22.052297, 0.4495401228, 0.8172804533, 175.6583788196 + 0.02675303116, 175.6583788196, 0, 1, 'Chongtian')) // 1024年崇天曆日食，藤豔輝論文
// (AvgNodeAccum, AvgAnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, SolsAccum, isNewm, CalName)
export const AutoEclipse = (NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, isNewm, CalName, Month, Leap, SolsAccum, SolsDeci) => { // 這就不用%solar了，後面都模了的
    const { Type } = Para[CalName]
    let Eclipse = {}
    if (Type <= 3 || ['Yuanjia', 'Daming', 'Liangwu'].includes(CalName)) {
        Eclipse = Eclipse1(NodeAccum, CalName)
    } else {
        if (['Zhangmengbin', 'Liuxiaosun'].includes(CalName)) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgSolsDif, 'Daye', NodeAccum).NodeAccumCorrA
            Eclipse = Eclipse2(NodeAccum, AnomaAccum, AcrDeci, AvgSolsDif, isNewm, 'Daye', Month, Leap)
        } else if (['Yisi', 'LindeB', 'Shenlong'].includes(CalName)) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgSolsDif, 'LindeA', NodeAccum).NodeAccumCorrA
            Eclipse = Eclipse2(NodeAccum, AnomaAccum, AcrDeci, AvgSolsDif, isNewm, 'LindeA', Month, Leap)
        } else if (Type <= 6) {
            NodeAccum += AutoTcorr(AnomaAccum, AvgSolsDif, CalName, NodeAccum).NodeAccumCorrA
            Eclipse = Eclipse2(NodeAccum, AnomaAccum, AcrDeci, AvgSolsDif, isNewm, CalName, Month, Leap)
        } else {
            SolsDeci = SolsDeci || deci(SolsAccum)
            const Rise = AutoLongi2Lati(AcrSolsDif, SolsDeci, CalName).Rise / 100
            if (['Fengyuan', 'Zhantian'].includes(CalName)) {
                Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, Rise, 0, isNewm, 'Guantian')
            } else if (['Chunyou', 'Huitian'].includes(CalName)) {
                Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, Rise, 0, isNewm, 'Chengtian')
            } else if (['Daming1', 'Daming2', 'Yiwei'].includes(CalName)) {
                Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, Rise, 0, isNewm, 'Daming3')
            } else if (Type <= 11) {
                Eclipse = Eclipse3(NodeAccum, AnomaAccum, AcrDeci, AvgDeci, AcrSolsDif, AvgSolsDif, Rise, SolsAccum, isNewm, CalName)
            }
        }
    }
    return Eclipse
}
// console.log(AutoEclipse(14.2, 11.1268587106, 0.45531, 0.44531, 31.9880521262, 31.9780521262, 1, 'Huangji', 4, 2, 8194819414.14))