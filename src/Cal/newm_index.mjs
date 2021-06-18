import { Bind } from './bind.mjs'
import { TermList, ScList, ThreeList, CalNameList, MonNumList } from './para_constant.mjs'
import { AutoEclipse } from './astronomy_eclipse.mjs'
import { Accum2Mansion, LeapAdjust } from './astronomy_other.mjs'
import { AutoLongi2Lati } from './bind_astronomy.mjs'
import { AutoRangeEcli } from './para_auto-constant.mjs'

export default (CalName, YearStart, YearEnd) => {
    const { Type, AutoNewm, AutoPara } = Bind(CalName)
    const isExcl = Type >= 4 ? 1 : 0
    const { OriginAd, CloseOriginAd, ZhangRange, ZhengNum, Denom, Node, OriginMonNum, isTermLeap, WinsolsWinsolsDif, MansionRaw } = AutoPara[CalName]
    let { ScCorr } = AutoPara[CalName]
    ScCorr = ScCorr || 0
    const YearMemo = []
    const calculate = year => {
        const [PrevYear, ThisYear, NextYear] = YearMemo
        const ZhengWinsolsDif = ZhengNum - OriginMonNum
        const WinsolsMonNum = (1 - ZhengNum + 12) % 12 // 冬至月
        const isLeapPvPt = PrevYear.isLeapPost
        const { isLeapAdvan: isLeapTA, JiScOrder: JiScOrder,
            OriginAccum, NewmEqua, TermAvgRaw, TermAcrRaw, EquaDegAccumList, TermAvgWinsolsDif, TermAcrWinsolsDif, AccumPrint, LeapLimit
        } = ThisYear
        let { LeapNumTerm: LeapNumTermThis, isLeapPrev: isLeapTPv, isLeapThis: isLeapTT,
            NewmInt, NewmStart, NewmEnd, TermStart, TermEnd,
        } = ThisYear
        const WinsolsDeci = +(OriginAccum - Math.floor(OriginAccum)).toFixed(5)
        let specialStart = 0, specialNewmSyzygyEnd = 0
        if (Type === 1) {
            if ((isTermLeap && NextYear.TermSc[1] === '') || (!isTermLeap && NextYear.TermSc[WinsolsMonNum] === '')) {
                specialNewmSyzygyEnd = 1
                TermEnd = 1
                LeapNumTermThis = 12
                if (WinsolsMonNum === 1) {
                    TermEnd = 0
                }
            } else if ((isTermLeap && ThisYear.TermSc[1] === '') || (!isTermLeap && ThisYear.TermSc[WinsolsMonNum] === '')) {
                specialStart = 1
                LeapNumTermThis--
            } // 以上解決顓頊曆15、16年，建子雨夏30、31年的極特殊情況
            NewmStart += specialStart
            NewmEnd += specialNewmSyzygyEnd
            TermStart += specialStart
            LeapNumTermThis -= NewmStart
        } else {
            if (ThisYear.isLeapPost) {
                NewmEnd = 0
                TermEnd = 0
            } else if (isLeapPvPt) {
                isLeapTPv = 0
                if (ZhengWinsolsDif <= 0) {
                    NewmStart = -1
                    NewmEnd = 0
                } else {
                    NewmStart = 0
                    NewmEnd = 1
                }
                TermEnd = 1
                isLeapTT = 1
                LeapNumTermThis = 1
            } else if (NextYear.isLeapPrev && NextYear.isLeapAdvan) {
                TermEnd = 1
                isLeapTT = 1
                NewmEnd = 1
                LeapNumTermThis = 12
            } else if (isLeapTPv && isLeapTA) {
                NewmStart = 1
                NewmEnd = 1
                TermEnd = 0
                isLeapTT = 0
                isLeapTPv = 1
            }
        }
        const TermAvgMod = [], TermOrderMod = [], TermSc = [], TermName = [], TermDeci = [], TermEqua = [], TermDuskstar = []
        let TermAcrSc = [], TermAcrDeci = [], TermAcrMod = [], TermAcrOrderMod = []
        if (Type >= 2) {
            for (let i = 0; i <= 13; i++) {
                TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermName[i] = TermList[(i + ZhengWinsolsDif + OriginMonNum + 12) % 12]
                TermSc[i] = ScList[(TermOrderMod[i] + isExcl + ScCorr) % 60]
                TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                if (TermAcrRaw[i]) {
                    TermAcrMod = ((TermAcrRaw[i]) % 60 + 60) % 60
                    TermAcrOrderMod = Math.floor(TermAcrMod)
                    TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + ScCorr) % 60]
                    TermAcrDeci[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                }
                if (MansionRaw) {
                    const Func = Accum2Mansion((TermAcrRaw[i] || TermAvgRaw[i]), EquaDegAccumList, CalName, (TermAcrWinsolsDif[i] || TermAvgWinsolsDif[i]), WinsolsDeci, year)
                    TermEqua[i] = Func.MansionResult
                    TermDuskstar[i] = Func.DuskstarResult
                }
            }
            if (isLeapTT) {
                LeapNumTermThis = LeapAdjust(LeapNumTermThis, TermAvgRaw, NewmInt, CalName)
                TermName[LeapNumTermThis + 1] = '无'
                if (TermAcrRaw[0]) {
                    TermAcrSc[LeapNumTermThis + 1] = ''
                    TermAcrDeci[LeapNumTermThis + 1] = ''
                }
                TermSc[LeapNumTermThis + 1] = ''
                TermDeci[LeapNumTermThis + 1] = ''
                if (MansionRaw) {
                    TermEqua[LeapNumTermThis + 1] = ''
                    TermDuskstar[LeapNumTermThis + 1] = ''
                }
                for (let i = LeapNumTermThis + 2; i <= 13; i++) {
                    TermAvgMod[i] = ((TermAvgRaw[i - 1]) % 60 + 60) % 60
                    TermOrderMod[i] = Math.floor(TermAvgMod[i])
                    TermName[i] = TermList[(i + ZhengWinsolsDif + OriginMonNum + 11) % 12]
                    TermSc[i] = ScList[(TermOrderMod[i] + isExcl + ScCorr) % 60]
                    TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                    if (TermAcrRaw[i]) {
                        TermAcrMod = (TermAcrRaw[i - 1] % 60 + 60) % 60
                        TermAcrOrderMod = Math.floor(TermAcrMod)
                        TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + ScCorr) % 60]
                        TermAcrDeci[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                    }
                    if (MansionRaw) {
                        const Func = Accum2Mansion((TermAcrRaw[i - 1] || TermAvgRaw[i - 1]), EquaDegAccumList, CalName, (TermAcrWinsolsDif[i - 1] || TermAvgWinsolsDif[i - 1]), WinsolsDeci, year)
                        TermEqua[i] = Func.MansionResult
                        TermDuskstar[i] = Func.DuskstarResult
                    }
                }
            }
        }
        LeapNumTermThis -= NewmStart
        // 月序
        const Month = [], MonthName = []
        if (Type === 1) {
            if (isTermLeap) {
                if (LeapNumTermThis && (ThisYear.isLeapAvgThis || specialNewmSyzygyEnd)) { // || (ThisYear.isLeapAvgNext && ThisYear.isAdvance)))
                    for (let i = 1; i <= 13; i++) {
                        if (i <= LeapNumTermThis) {
                            Month[i] = (i + ZhengWinsolsDif + 12) % 12
                            MonthName[i] = MonNumList[Month[i]]
                        } else if (i === LeapNumTermThis + 1) {
                            Month[i] = '氣閏'
                            MonthName[i] = Month[i]
                        } else {
                            Month[i] = (i + ZhengWinsolsDif + 11) % 12
                            MonthName[i] = MonNumList[Month[i]]
                        }
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = MonNumList[Month[i]]
                        }
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        Month[i] = (i + ZhengWinsolsDif + 12) % 12
                        MonthName[i] = MonNumList[Month[i]]
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = MonNumList[Month[i]]
                        }
                    }
                }
            } else {
                if ((ThisYear.isLeapAvgFix || specialNewmSyzygyEnd) && !specialStart) {
                    for (let i = 1; i <= 13; i++) {
                        if (i <= 12) {
                            Month[i] = (i + ZhengWinsolsDif + 12) % 12
                            MonthName[i] = MonNumList[Month[i]]
                        } else {
                            Month[i] = '固閏'
                            MonthName[i] = Month[i]
                        }
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = MonNumList[Month[i]]
                        }
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        Month[i] = (i + ZhengWinsolsDif + 12) % 12
                        MonthName[i] = MonNumList[Month[i]]
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = MonNumList[Month[i]]
                        }
                    }
                }
            }
        } else {
            if (isLeapTT) {
                for (let i = 1; i <= 13; i++) {
                    if (i <= LeapNumTermThis) {
                        Month[i] = (i + 12) % 12
                        MonthName[i] = MonNumList[Month[i]]
                    } else if (i === LeapNumTermThis + 1) {
                        Month[i] = '閏' + LeapNumTermThis
                        MonthName[i] = '閏' + MonNumList[LeapNumTermThis]
                    } else {
                        Month[i] = (i + 11) % 12
                        MonthName[i] = MonNumList[Month[i]]
                    }
                    if (Month[i] === 0) {
                        Month[i] = 12
                        MonthName[i] = MonNumList[Month[i]]
                    }
                }
            } else {
                for (let i = 1; i <= 12; i++) {
                    Month[i] = (i + 12) % 12
                    MonthName[i] = MonNumList[Month[i]]
                    if (Month[i] === 0) {
                        Month[i] = 12
                        MonthName[i] = MonNumList[Month[i]]
                    }
                }
            }
        }
        const NewmSlice = array => array.slice(1 + NewmStart, 13 + NewmEnd)
        const TermSlice = array => array.slice(1 + TermStart, 13 + TermEnd)
        ////////////下爲調整輸出////////////
        const NewmWinsolsDifRawPrint = ThisYear.NewmWinsolsDifRaw ? NewmSlice(ThisYear.NewmWinsolsDifRaw) : []
        const NewmAcrWinsolsDifRawPrint = ThisYear.NewmAcrWinsolsDifRaw ? NewmSlice(ThisYear.NewmAcrWinsolsDifRaw) : []
        const NewmAvgScPrint = NewmSlice(ThisYear.NewmAvgSc)
        const NewmAvgDeciPrint = NewmSlice(ThisYear.NewmAvgDeci)
        NewmInt = NewmInt.slice(1 + NewmStart)
        let ZhengGreatSur = 0, ZhengSmallSur = 0
        if (Type === 1) {
            ZhengGreatSur = (NewmInt[0] - ThisYear.BuScOrder + 60) % 60
            ZhengSmallSur = parseFloat(((ThisYear.NewmAvgRaw[1 + NewmStart] - NewmInt[0]) * Denom).toPrecision(5))
        }
        const MonthPrint = MonthName.slice(1)
        let NewmScPrint = [], NewmDeci3Print = [], NewmDeci2Print = [], NewmDeci1Print = []
        if (Type >= 2) {
            NewmScPrint = NewmSlice(ThisYear.NewmSc)
            if (Type <= 10 && ThisYear.NewmDeci1) {
                NewmDeci1Print = NewmSlice(ThisYear.NewmDeci1)
            } else if (Type === 11) {
                NewmDeci3Print = NewmSlice(ThisYear.NewmDeci3)
            }
        }
        if (Type >= 5 && Type <= 10 && ThisYear.NewmDeci2) {
            NewmDeci2Print = NewmSlice(ThisYear.NewmDeci2)
        }
        const NewmEquaPrint = NewmSlice(NewmEqua)
        const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc)
        const SyzygyDeciPrint = NewmSlice(ThisYear.SyzygyDeci)
        let NewmDeciPrint = [], TermNamePrint = [], TermScPrint = [], TermDeciPrint = [], TermAcrScPrint = [], TermAcrDeciPrint = [], TermEquaPrint = [], TermDuskstarPrint = []
        if (Type === 1) {
            TermNamePrint = TermSlice(ThisYear.TermName)
            TermScPrint = TermSlice(ThisYear.TermSc)
            TermDeciPrint = TermSlice(ThisYear.TermDeci)
            TermEquaPrint = TermSlice(ThisYear.TermEqua)
            TermDuskstarPrint = TermSlice(ThisYear.TermDuskstar)
            if (LeapNumTermThis === 12 && specialNewmSyzygyEnd && !TermEnd) {
                TermNamePrint.push('无')
                TermScPrint.push('')
                TermDeciPrint.push('')
                TermEquaPrint.push('')
                TermDuskstarPrint.push('')
            }
        } else {
            if (Type >= 2 && Type <= 4) {
                TermNamePrint = TermSlice(TermName)
                TermScPrint = TermSlice(TermSc)
                TermDeciPrint = TermSlice(TermDeci)
            } else {
                TermNamePrint = TermSlice(TermName)
                TermAcrScPrint = TermSlice(TermAcrSc)
                TermAcrDeciPrint = TermSlice(TermAcrDeci)
                TermScPrint = TermSlice(TermSc)
                TermDeciPrint = TermSlice(TermDeci)
            }
            TermEquaPrint = TermSlice(TermEqua)
            TermDuskstarPrint = TermSlice(TermDuskstar)
        }

        ////////// 下調用交食模塊。由於隋系交食需要用月份，所以必須要切了之後才能用，傳一堆參數，很惡心
        let NewmEcli = [], SyzygyEcli = [], NewmNodeAccumPrint = [], NewmNodeAccumNightPrint = [], NewmAnomaAccumPrint = [], NewmAnomaAccumNightPrint = []
        if (Type > 1) {
            NewmDeciPrint = NewmSlice(ThisYear.NewmDeci)
            const SyzygyAvgDeciPrint = NewmSlice(ThisYear.SyzygyAvgDeci)
            if (Node) {
                NewmNodeAccumPrint = NewmSlice(ThisYear.NewmNodeAccum)
                NewmNodeAccumNightPrint = NewmSlice(ThisYear.NewmNodeAccumNight)
                NewmAnomaAccumPrint = NewmSlice(ThisYear.NewmAnomaAccum)
                NewmAnomaAccumNightPrint = NewmSlice(ThisYear.NewmAnomaAccumNight)
                const SyzygyNodeAccumPrint = NewmSlice(ThisYear.SyzygyNodeAccum)
                const SyzygyAnomaAccumPrint = NewmSlice(ThisYear.SyzygyAnomaAccum)
                const SyzygyWinsolsDifRawPrint = NewmSlice(ThisYear.SyzygyWinsolsDifRaw)
                const SyzygyAcrWinsolsDifRawPrint = NewmSlice(ThisYear.SyzygyAcrWinsolsDifRaw)
                for (let i = 0; i < MonthPrint.length; i++) { // 切了之後從0開始索引
                    let NoleapMon = i + 1
                    if (LeapNumTermThis > 0) {
                        if (i === LeapNumTermThis) {
                            NoleapMon = i
                        } else if (i >= LeapNumTermThis + 1) {
                            NoleapMon = i
                        }
                    }
                    let Rise = AutoLongi2Lati(NewmAcrWinsolsDifRawPrint[i], WinsolsDeci, CalName).Rise / 100
                    let NewmEcliFunc = {}, SyzygyEcliFunc = {}
                    const { RangeSunEcli, RangeMoonEcli } = AutoRangeEcli(CalName, Type)
                    let NewmCondition = (NewmNodeAccumPrint[i] < 0.9 || (NewmNodeAccumPrint[i] > 12.8 && NewmNodeAccumPrint[i] < 15.5) || NewmNodeAccumPrint[i] > 25.3) && (NewmDeciPrint[i] > Rise - RangeSunEcli && NewmDeciPrint[i] < 1 - Rise + RangeSunEcli)
                    let SyzygyCondition = (SyzygyNodeAccumPrint[i] < 1.5 || (SyzygyNodeAccumPrint[i] > 12.1 && SyzygyNodeAccumPrint[i] < 15.1) || SyzygyNodeAccumPrint[i] > 25.7) && (SyzygyDeciPrint[i] < Rise + RangeMoonEcli || SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli) // 大統月食八刻二十分
                    const Sunset = (1 - Rise).toFixed(4).slice(2, 6)
                    Rise = Rise.toFixed(4).slice(2, 6)
                    if (CalName === 'Mingtian') {
                        NewmCondition = NewmDeciPrint[i] > Rise - RangeSunEcli && NewmDeciPrint[i] < 1 - Rise + RangeSunEcli
                        SyzygyCondition = SyzygyDeciPrint[i] < Rise + RangeMoonEcli || SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli
                    }
                    if (NewmCondition) { // 這些數字根據大統，再放寬0.3
                        NewmEcliFunc = AutoEclipse(NewmNodeAccumPrint[i], NewmAnomaAccumPrint[i], NewmDeciPrint[i], NewmAvgDeciPrint[i], NewmAcrWinsolsDifRawPrint[i], NewmWinsolsDifRawPrint[i], 1, CalName, NoleapMon, LeapNumTermThis, OriginAccum)
                        const NewmStatus = NewmEcliFunc.Status
                        let NewmMagni = 0
                        const NewmStartDeci = NewmEcliFunc.StartDeci ? NewmEcliFunc.StartDeci.toFixed(4).slice(2, 6) : 0
                        const NewmTotalDeci = NewmEcliFunc.TotalDeci ? NewmEcliFunc.TotalDeci.toFixed(4).slice(2, 6) : 0
                        const NewmEndDeci = NewmEcliFunc.EndDeci ? NewmEcliFunc.EndDeci.toFixed(4).slice(2, 6) : 0
                        if (NewmStatus) {
                            NewmMagni = NewmEcliFunc.Magni.toFixed(2)
                            NewmEcli[i] = `<span class='eclipse'>S${NoleapMon}</span>`
                            NewmEcli[i] += '出' + Rise + ' 分' + NewmMagni + (NewmStartDeci ? '虧' + NewmStartDeci : '') + (NewmTotalDeci ? '甚' + NewmTotalDeci : '') + (NewmEndDeci ? '復' + NewmEndDeci : '') + ' 入' + Sunset
                            if (NewmStatus === 1) {
                                NewmScPrint[i] += `<span class='eclipse-symbol'>●</span>`
                            } else if (NewmStatus === 2) {
                                NewmScPrint[i] += `<span class='eclipse-symbol'>◐</span>`
                            } else if (NewmStatus === 3) {
                                NewmScPrint[i] += `<span class='eclipse-symbol'>◔</span>` // ◍
                            }
                        }
                    }
                    if (SyzygyCondition) { // 陳美東《中國古代的月食食限及食分算法》：五紀17.8/13.36大概是1.33
                        SyzygyEcliFunc = AutoEclipse(SyzygyNodeAccumPrint[i], SyzygyAnomaAccumPrint[i], SyzygyDeciPrint[i], SyzygyAvgDeciPrint[i], SyzygyAcrWinsolsDifRawPrint[i], SyzygyWinsolsDifRawPrint[i], 0, CalName, NoleapMon, LeapNumTermThis, OriginAccum)
                        const SyzygyStatus = SyzygyEcliFunc.Status
                        let SyzygyMagni = 0
                        const SyzygyStartDeci = SyzygyEcliFunc.StartDeci ? SyzygyEcliFunc.StartDeci.toFixed(4).slice(2, 6) : 0
                        const SyzygyTotalDeci = SyzygyEcliFunc.TotalDeci ? SyzygyEcliFunc.TotalDeci.toFixed(4).slice(2, 6) : 0
                        const SyzygyEndDeci = SyzygyEcliFunc.EndDeci ? SyzygyEcliFunc.EndDeci.toFixed(4).slice(2, 6) : 0
                        if (SyzygyStatus) {
                            SyzygyMagni = SyzygyEcliFunc.Magni.toFixed(2)
                            SyzygyEcli[i] = `<span class='eclipse'>M${NoleapMon}</span>`
                            SyzygyEcli[i] += '出' + Rise + ' 分' + SyzygyMagni + (SyzygyStartDeci ? '虧' + SyzygyStartDeci + '甚' + SyzygyTotalDeci : '') + (SyzygyEndDeci ? '復' + SyzygyEndDeci : '') + ' 入' + Sunset
                            if (SyzygyStatus === 1) {
                                SyzygyScPrint[i] += `<span class='eclipse-symbol'>●</span>`
                            } else if (SyzygyStatus === 2) {
                                SyzygyScPrint[i] += `<span class='eclipse-symbol'>◐</span>`
                            } else if (SyzygyStatus === 3) {
                                SyzygyScPrint[i] += `<span class='eclipse-symbol'>◔</span>`
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < NewmDeciPrint.length; i++) {
            NewmDeciPrint[i] = NewmDeciPrint[i].toFixed(4).slice(2, 6)
            NewmAvgDeciPrint[i] = NewmAvgDeciPrint[i] ? NewmAvgDeciPrint[i].toFixed(4).slice(2, 6) : 0
            SyzygyDeciPrint[i] = SyzygyDeciPrint[i].toFixed(4).slice(2, 6)
        }
        const YearSc = ScList[((year - 3) % 60 + 60) % 60]
        let Era = year
        if (year > 0) {
            Era = `公元 ${year} 年 ${YearSc}`
        } else {
            Era = `公元前 ${1 - year} 年 ${YearSc}`
        }
        let YearInfo = `<span class='cal-name'>${CalNameList[CalName]}</span> 上元${year - (OriginAd || CloseOriginAd)} `
        if (Type === 1) {
            const LeapSur = isTermLeap ? ThisYear.LeapSurAvgThis : ThisYear.LeapSurAvgFix
            if (CalName === 'Taichu') {
                YearInfo += `${ScList[ThisYear.BuScOrder]}統${ThisYear.BuYear}${ThisYear.JupiterSc}`
            } else {
                YearInfo += `${ThreeList[ThisYear.JiOrder]}紀${ScList[ThisYear.BuScOrder]}蔀${ThisYear.BuYear}`
            }
            YearInfo += `  大${ZhengGreatSur}小${ZhengSmallSur}冬至${parseFloat((ThisYear.WinsolsAccumMod).toPrecision(6)).toFixed(4)}`
            if (WinsolsWinsolsDif === -45.65625) {
                YearInfo += `立春${parseFloat(((OriginAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
            } else if (WinsolsWinsolsDif === -60.875) {
                YearInfo += `雨水${parseFloat(((OriginAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
            }
            YearInfo += `  閏餘${LeapSur.toFixed(4)}`
            if (ThisYear.LeapNumOriginLeapSur) {
                YearInfo += `閏${ThisYear.LeapNumOriginLeapSur - NewmStart}`
            }
        } else {
            if (JiScOrder) {
                YearInfo += `${ScList[JiScOrder]}紀${ThisYear.JiYear}`
            }
            if (Type <= 10) {
                YearInfo += (OriginMonNum === 2 ? '雨' : '冬') + ((OriginAccum % 60 + 60) % 60).toFixed(4)
            }
            if (Type === 2) {
                YearInfo += `  平${ThisYear.LeapSurAvgThis}定${(ThisYear.LeapSurAcrThis).toFixed(2)}準${LeapLimit}`
            } else if (Type === 3) {
                YearInfo += `  平${Math.round((ThisYear.LeapSurAvgThis) * ZhangRange)}定${((ThisYear.LeapSurAcrThis) * ZhangRange).toFixed(2)}準${Math.round((LeapLimit) * ZhangRange)}`
            } else if (Type <= 7) {
                YearInfo += `  平${parseFloat((ThisYear.LeapSurAvgThis).toPrecision(8))}定${(ThisYear.LeapSurAcrThis).toFixed(2)}準${(LeapLimit)}`
            } else {
                YearInfo += `  平${(ThisYear.LeapSurAvgThis).toFixed(2)}定${(ThisYear.LeapSurAcrThis).toFixed(2)}準${(LeapLimit).toFixed(2)}`
            }
        }
        if (AccumPrint) {
            YearInfo += ` ${AccumPrint}`
        }
        let NewmEcliPrint = [], SyzygyEcliPrint = []
        if ((NewmEcli || []).length) {
            NewmEcliPrint = NewmEcli.join('')
            YearInfo += `\n${NewmEcliPrint}`
        }
        if ((SyzygyEcli || []).length) {
            SyzygyEcliPrint = `<span class='eclipse-wrap'>${SyzygyEcli.join('')}</span>`
            if ((NewmEcli || []).length > 0) {
                YearInfo += SyzygyEcliPrint
            } else {
                YearInfo += `\n${SyzygyEcliPrint}`
            }
        }
        const step = []
        let NewmIntLong = NewmInt.concat(NextYear.NewmInt)
        NewmIntLong = Array.from(new Set(NewmIntLong))
        for (let i = 0; i < 18; i++) {
            step[i] = NewmIntLong[i + 1] - NewmIntLong[i]
        }
        // const checkStep = (num, time, array) => array.reduce(function (p, c) { c === num ? p + 1 : (p < time ? 0 : p) }, 0) >= time
        // const sdfsdg = checkStep(30, 2, [30, 29, 30, 30, 30])
        let tmp30 = 0, tmp29 = 0
        for (let i = 0; i < step.length - 1; i++) {
            if (step[i] === 30 && step[i + 1] === 30 && step[i + 2] === 30 && step[i + 3] === 30) {
                tmp30 = 4
                break
            }
        }
        for (let i = 0; i < step.length - 1; i++) {
            if (step[i] === 29 && step[i + 1] === 29 && step[i + 2] === 29) {
                tmp29 = 3
                break
            }
        }
        if (tmp30 === 4) {
            YearInfo += `<span class='step30'>四連大</span>`
        }
        if (tmp29 === 3) {
            YearInfo += `<span class='step30'>三連小</span>`
        }
        return {
            Era, YearInfo, MonthPrint,
            NewmAvgScPrint, NewmAvgDeciPrint, NewmScPrint, NewmDeci3Print, NewmDeci2Print, NewmDeci1Print, NewmEquaPrint,
            SyzygyScPrint, SyzygyDeciPrint,
            TermNamePrint, TermScPrint, TermDeciPrint, TermAcrScPrint, TermAcrDeciPrint, TermEquaPrint, TermDuskstarPrint,
            ////////////// 以下用於日書/////////////
            LeapNumTermThis, OriginAccum,
            NewmInt, // 結尾就不切了，因爲最後一個月還要看下個月的情況
            NewmRaw: (Type === 1 ? [] : NewmSlice(ThisYear.NewmRaw)),
            NewmAcrRaw: (Type === 1 ? [] : NewmSlice(ThisYear.NewmAcrRaw)), // 這個是給南系月亮位置用的，平朔注曆，但是月亮位置是定朔
            // NewmAcrInt: (Type === 1 ? [] : NewmSlice(ThisYear.NewmAcrInt)),
            // NewmNodeAccumPrint, // : (Type === 1 ? [] : NewmNodeAccumPrint.slice(NewmStart)), // 為什麼還要切一遍？？
            NewmNodeAccumNightPrint,
            NewmAnomaAccumPrint, //: (Type === 1 ? [] : NewmAnomaAccumPrint.slice(NewmStart))
            NewmAnomaAccumNightPrint
        }
    }
    YearMemo[0] = AutoNewm(CalName, YearStart - 1) // 去年
    YearMemo[1] = AutoNewm(CalName, YearStart) // 今年
    const result = []
    YearEnd = YearEnd === undefined ? YearStart : YearEnd
    for (let year = YearStart; year <= YearEnd; year++) {
        YearMemo[2] = AutoNewm(CalName, year + 1) // 明年
        result.push(calculate(year))
        YearMemo[0] = YearMemo[1] // 数组滚动，避免重复运算
        YearMemo[1] = YearMemo[2]
    }
    return result
}