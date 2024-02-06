import N1 from './newm_quar.mjs'
import N2 from './newm.mjs'
// import N3 from './newm_huihui.mjs'
import { N4 } from './newm_shixian.mjs'
import Para from './para_calendars.mjs'
import { TermList, Term1List, ScList, ThreeList, NameList, MonNumList1, MonNumListChuA, MonNumListChuB } from './para_constant.mjs'
import { AutoEclipse } from './astronomy_eclipse.mjs'
import { AutoLon2Lat } from './astronomy_bind.mjs'
import { AutoRangeEcli } from './para_auto-constant.mjs'
// const Index = (Name, YearStart, YearEnd) => {
export default (Name, YearStart, YearEnd) => {
    const Bind = Name => {
        const type = Para[Name].Type
        if (type === 1) return N1
        else if (type === 13) return N4
        else return N2
    }
    const AutoNewm = Bind(Name)
    const { Type, OriginAd, CloseOriginAd, ZhangRange, ZhengNum, Denom, Node, OriginMonNum, isTermLeap, SolsOriginDif } = Para[Name]
    const Memo = []
    const calculate = year => {
        const [PrevYear, ThisYear, NextYear] = Memo
        const ZhengSolsDif = ZhengNum - OriginMonNum
        const SolsMon = (1 - ZhengNum + 12) % 12 // 冬至月
        const { JiScOrder: JiScOrder, SolsAccum, NewmEqua, NewmEclp, AccumPrint, LeapLimit, SolsDeci } = ThisYear
        let { LeapNumTerm, NewmInt, NewmStart, NewmEnd, TermStart, TermEnd } = ThisYear
        NewmInt = NewmInt || []
        const TermName = [], TermSc = [], TermDeci = [], TermAcrSc = [], TermAcrDeci = [], TermEqua = [], TermEclp = [], TermDuskstar = [], Term1Name = [], Term1Sc = [], Term1Deci = [], Term1Equa = [], Term1AcrSc = [], Term1AcrDeci = [], Term1Eclp = []
        let specialStart = 0, specialNewmSyzygyEnd = 0
        if (Type === 1) {
            if ((isTermLeap && NextYear.TermSc[1] === '') || (!isTermLeap && NextYear.TermSc[SolsMon] === '')) {
                specialNewmSyzygyEnd = 1
                TermEnd = 1
                LeapNumTerm = 12
                if (SolsMon === 1) TermEnd = 0
            } else if ((isTermLeap && ThisYear.TermSc[1] === '') || (!isTermLeap && ThisYear.TermSc[SolsMon] === '')) {
                specialStart = 1
                LeapNumTerm--
            } // 以上解決顓頊曆15、16年，建子雨夏30、31年的極特殊情況
            NewmStart += specialStart
            NewmEnd += specialNewmSyzygyEnd
            TermStart += specialStart
            LeapNumTerm -= NewmStart
        } else {
            NewmStart = 0
            NewmEnd = LeapNumTerm ? 1 : 0
            TermEnd = NewmEnd
            if (PrevYear.LeapNumTerm) {
                LeapNumTerm = 0
                // 可能出現去年不閏而閏，於是今年正月和去年十二月重疊
                if ((PrevYear.NewmAvgSc[13]) === ThisYear.NewmAvgSc[1]) { // 會出現最末位差一點的情況
                    NewmStart = 1
                    NewmEnd = 1
                    TermEnd = 0
                }
            }
            TermStart = 0
        }
        // 調整節氣
        if (Type === 1) {
            TermName = ThisYear.TermName
            TermSc = ThisYear.TermSc
            TermDeci = ThisYear.TermDeci
            TermEqua = ThisYear.TermEqua || []
            TermDuskstar = ThisYear.TermDuskstar || []
        } else {
            for (let i = 1; i <= 13; i++) {
                TermName[i] = TermList[(i + 2) % 12]
                TermSc[i] = ThisYear.TermSc[i]
                TermDeci[i] = ThisYear.TermDeci[i]
                if (ThisYear.TermAcrSc) {
                    TermAcrSc[i] = ThisYear.TermAcrSc[i]
                    TermAcrDeci[i] = ThisYear.TermAcrDeci[i]
                }
                if (ThisYear.TermEqua) {
                    TermEqua[i] = ThisYear.TermEqua[i]
                }
                if (ThisYear.TermEclp) {
                    TermEclp[i] = ThisYear.TermEclp[i]
                }
                Term1Name[i] = Term1List[(i + 2) % 12]
                Term1Sc[i] = ThisYear.Term1Sc[i]
                Term1Deci[i] = ThisYear.Term1Deci[i]
                if (ThisYear.Term1Equa) {
                    Term1Equa[i] = ThisYear.Term1Equa[i]
                }
                if (ThisYear.Term1Eclp) {
                    Term1Eclp[i] = ThisYear.Term1Eclp[i]
                }
                if (ThisYear.Term1AcrSc) {
                    Term1AcrSc[i] = ThisYear.Term1AcrSc[i]
                    Term1AcrDeci[i] = ThisYear.Term1AcrDeci[i]
                }
            }
            if (LeapNumTerm) {
                TermName[LeapNumTerm + 1] = '无中'
                TermSc[LeapNumTerm + 1] = ''
                TermDeci[LeapNumTerm + 1] = ''
                TermAcrSc[LeapNumTerm + 1] = ''
                TermAcrDeci[LeapNumTerm + 1] = ''
                TermEqua[LeapNumTerm + 1] = ''
                TermEclp[LeapNumTerm + 1] = ''
                for (let i = LeapNumTerm + 2; i <= 13; i++) {
                    TermName[i] = Term1List[(i + 2) % 12]
                    TermSc[i] = ThisYear.Term1Sc[i]
                    TermDeci[i] = ThisYear.Term1Deci[i]
                    if (ThisYear.Term1AcrSc) {
                        TermAcrSc[i] = ThisYear.Term1AcrSc[i]
                        TermAcrDeci[i] = ThisYear.Term1AcrDeci[i]
                    }
                    if (ThisYear.TermEqua) {
                        TermEqua[i] = ThisYear.Term1Equa[i]
                    }
                    if (ThisYear.TermEclp) {
                        TermEclp[i] = ThisYear.Term1Eclp[i]
                    }
                    // 上下互換位置
                    Term1Name[i] = TermList[(i + 1) % 12]
                    Term1Sc[i] = ThisYear.TermSc[i - 1]
                    Term1Deci[i] = ThisYear.TermDeci[i - 1]
                    if (ThisYear.TermAcrSc) {
                        Term1AcrSc[i] = ThisYear.TermAcrSc[i - 1]
                        Term1AcrDeci[i] = ThisYear.TermAcrDeci[i - 1]
                    }
                    if (ThisYear.TermEqua) {
                        Term1Equa[i] = ThisYear.TermEqua[i - 1]
                    }
                    if (ThisYear.TermEclp) {
                        Term1Eclp[i] = ThisYear.TermEclp[i - 1]
                    }
                }
            }
            if (PrevYear.LeapNumTerm) {
                Term1Name[1] = '无節'
                Term1Sc[1] = ''
                Term1Deci[1] = ''
                if (ThisYear.Term1Equa) {
                    Term1Equa[1] = ''
                }
                if (ThisYear.Term1AcrSc) {
                    Term1AcrSc[1] = ''
                    Term1AcrDeci[1] = ''
                    Term1Eclp[1] = ''
                }
            }
        }
        // 月序
        const MonthName = []
        let MonNumList = MonNumList1
        if (Name === 'Zhuanxu1') MonNumList = MonNumListChuA
        else if (Name === 'Zhuanxu2') MonNumList = MonNumListChuB
        if (Type === 1) {
            if (isTermLeap) {
                if (LeapNumTerm && (ThisYear.isLeapAvgThis || specialNewmSyzygyEnd)) {
                    for (let i = 1; i <= 13; i++) {
                        if (i <= LeapNumTerm) {
                            MonthName[i] = MonNumList[(i + ZhengSolsDif + 12) % 12]
                        } else if (i === LeapNumTerm + 1) {
                            MonthName[i] = '氣閏'
                        } else {
                            MonthName[i] = MonNumList[(i + ZhengSolsDif + 11) % 12]
                        }
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        MonthName[i] = MonNumList[(i + ZhengSolsDif + 12) % 12]
                    }
                }
            } else {
                if ((ThisYear.isLeapAvgFix || specialNewmSyzygyEnd) && !specialStart) {
                    for (let i = 1; i <= 13; i++) {
                        if (i <= 12) {
                            MonthName[i] = MonNumList[(i + ZhengSolsDif + 12) % 12]
                        } else {
                            MonthName[i] = '固閏'
                        }
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        MonthName[i] = MonNumList[(i + ZhengSolsDif + 12) % 12]
                    }
                }
            }
        } else {
            if (LeapNumTerm) {
                for (let i = 1; i <= 13; i++) {
                    if (i <= LeapNumTerm) {
                        MonthName[i] = MonNumList[i]
                    } else if (i === LeapNumTerm + 1) {
                        MonthName[i] = '閏' + MonNumList[LeapNumTerm]
                    } else {
                        MonthName[i] = MonNumList[i - 1]
                    }
                }
            } else {
                for (let i = 1; i <= 12; i++) {
                    MonthName[i] = MonNumList[i]
                }
            }
        }
        const NewmSlice = array => array.slice(1 + NewmStart, 13 + NewmEnd)
        const TermSlice = array => array.slice(1 + TermStart, 13 + TermEnd)
        ////////////下爲調整輸出////////////
        const NewmSolsDifPrint = ThisYear.NewmSolsDif ? NewmSlice(ThisYear.NewmSolsDif) : []
        const NewmAcrSolsDifPrint = ThisYear.NewmAcrSolsDif ? NewmSlice(ThisYear.NewmAcrSolsDif) : []
        const NewmAvgScPrint = NewmSlice(ThisYear.NewmAvgSc)
        const NewmAvgDeciPrint = NewmSlice(ThisYear.NewmAvgDeci)
        NewmInt = NewmInt.slice(1 + NewmStart)
        let ZhengGreatSur = 0, ZhengSmallSur = 0
        if (Type === 1) {
            ZhengGreatSur = (NewmInt[0] - ThisYear.BuScOrder + 60) % 60
            ZhengSmallSur = parseFloat(((ThisYear.NewmAvgRaw[1 + NewmStart] - NewmInt[0]) * Denom).toPrecision(5))
        }
        const MonthPrint = MonthName.slice(1)
        let NewmScPrint = [], NewmDeci3Print = [], NewmDeci2Print = [], NewmDeci1Print = [], NewmAcrDeciPrint = []
        if (Type >= 2) {
            NewmScPrint = NewmSlice(ThisYear.NewmSc)
            if (Type <= 10 && ThisYear.NewmDeci1) { // 線性內插
                NewmDeci1Print = NewmSlice(ThisYear.NewmDeci1)
            } else if (Type === 11) { // 三次內插
                NewmDeci3Print = NewmSlice(ThisYear.NewmDeci3)
            } else if (Type === 13) { // 實朔實時
                NewmAcrDeciPrint = NewmSlice(ThisYear.NewmDeci)
            }
        }
        if (Type >= 5 && Type <= 10 && ThisYear.NewmDeci2) {
            NewmDeci2Print = NewmSlice(ThisYear.NewmDeci2)
        }
        const NewmEquaPrint = NewmEqua ? NewmSlice(NewmEqua) : undefined
        const NewmEclpPrint = NewmEclp ? NewmSlice(NewmEclp) : undefined
        const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc)
        const SyzygyDeciPrint = NewmSlice(ThisYear.SyzygyDeci)
        const NewmAcr0DeciPrint = ThisYear.NewmAcr0Deci ? NewmSlice(ThisYear.NewmAcr0Deci) : undefined
        const SyzygyAcr0DeciPrint = ThisYear.SyzygyAcr0Deci ? NewmSlice(ThisYear.SyzygyAcr0Deci) : undefined
        let NewmDeciPrint = [], TermNamePrint = [], TermScPrint = [], TermDeciPrint = [], TermAcrScPrint = [], TermAcrDeciPrint = [], TermEquaPrint = [], TermEclpPrint = [], TermDuskstarPrint = [], Term1NamePrint = [], Term1ScPrint = [], Term1DeciPrint = [], Term1EquaPrint = [], Term1AcrDeciPrint = [], Term1AcrScPrint = [], Term1EclpPrint = []
        TermNamePrint = TermSlice(TermName)
        TermScPrint = TermSlice(TermSc)
        TermDeciPrint = TermSlice(TermDeci)
        if (TermAcrSc[2]) {
            TermAcrScPrint = TermSlice(TermAcrSc)
            TermAcrDeciPrint = TermSlice(TermAcrDeci)
        }
        if (Term1Sc[2]) {
            Term1NamePrint = TermSlice(Term1Name)
            Term1ScPrint = TermSlice(Term1Sc)
            Term1DeciPrint = TermSlice(Term1Deci)
        }
        if (Term1AcrSc[2]) {
            Term1AcrScPrint = TermSlice(Term1AcrSc)
            Term1AcrDeciPrint = TermSlice(Term1AcrDeci)
        }
        Term1EquaPrint = Term1Equa[2] ? TermSlice(Term1Equa) : undefined
        TermEquaPrint = TermEqua[2] ? TermSlice(TermEqua) : undefined
        Term1EclpPrint = Term1Eclp[2] ? TermSlice(Term1Eclp) : undefined
        TermEclpPrint = TermEclp[2] ? TermSlice(TermEclp) : undefined
        TermDuskstarPrint = TermDuskstar[2] ? TermSlice(TermDuskstar) : undefined
        ////////// 調用交食模塊。由於隋系交食需要用月份，所以必須要切了之後才能用，傳一堆參數，很惡心
        let SunEcli = [], MoonEcli = [], NewmNodeAccumPrint = [], NewmNodeAccumNightPrint = [], NewmAnomaAccumPrint = [], NewmAnomaAccumNightPrint = []
        if (Type > 1 && Type <= 11) {
            NewmDeciPrint = NewmSlice(ThisYear.NewmDeci)
            const SyzygyAvgDeciPrint = NewmSlice(ThisYear.SyzygyAvgDeci)
            if (Node) {
                NewmNodeAccumPrint = NewmSlice(ThisYear.NewmNodeAccum)
                NewmNodeAccumNightPrint = NewmSlice(ThisYear.NewmNodeAccumNight)
                NewmAnomaAccumPrint = NewmSlice(ThisYear.NewmAnomaAccum)
                NewmAnomaAccumNightPrint = NewmSlice(ThisYear.NewmAnomaAccumNight)
                const SyzygyNodeAccumPrint = NewmSlice(ThisYear.SyzygyNodeAccum)
                const SyzygyAnomaAccumPrint = NewmSlice(ThisYear.SyzygyAnomaAccum)
                const SyzygySolsDifPrint = NewmSlice(ThisYear.SyzygySolsDif)
                const SyzygyAcrSolsDifPrint = NewmSlice(ThisYear.SyzygyAcrSolsDif)
                for (let i = 0; i < MonthPrint.length; i++) { // 切了之後從0開始索引
                    let NoleapMon = i + 1
                    if (LeapNumTerm > 0 && i >= LeapNumTerm) NoleapMon = i
                    let Rise = AutoLon2Lat(NewmAcrSolsDifPrint[i], SolsDeci, Name).Rise / 100
                    let SunEcliFunc = {}, MoonEcliFunc = {}
                    const { RangeSunEcli, RangeMoonEcli } = AutoRangeEcli(Name, Type)
                    let isSunEcli = (NewmNodeAccumPrint[i] < .9 || (NewmNodeAccumPrint[i] > 12.8 && NewmNodeAccumPrint[i] < 15.5) || NewmNodeAccumPrint[i] > 25.3) &&
                        ((NewmDeciPrint[i] > Rise - RangeSunEcli) && (NewmDeciPrint[i] < 1 - Rise + RangeSunEcli))
                    let isMoonEcli = (SyzygyNodeAccumPrint[i] < 1.5 || (SyzygyNodeAccumPrint[i] > 12.1 && SyzygyNodeAccumPrint[i] < 15.1) || SyzygyNodeAccumPrint[i] > 25.7) &&
                        ((SyzygyDeciPrint[i] < Rise + RangeMoonEcli) || (SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli))
                    const Sunset = (1 - Rise).toFixed(4).slice(2, 6)
                    if (Name === 'Mingtian') {
                        isSunEcli = (NewmDeciPrint[i] > Rise - RangeSunEcli) && (NewmDeciPrint[i] < 1 - Rise + RangeSunEcli)
                        isMoonEcli = (SyzygyDeciPrint[i] < Rise + RangeMoonEcli) || (SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli)
                    }
                    Rise = Rise.toFixed(4).slice(2, 6)
                    if (isSunEcli) { // 這些數字根據大統，再放寬0.3
                        SunEcliFunc = AutoEclipse(NewmNodeAccumPrint[i], NewmAnomaAccumPrint[i], NewmDeciPrint[i], NewmAvgDeciPrint[i], NewmAcrSolsDifPrint[i], NewmSolsDifPrint[i], 1, Name, NoleapMon, LeapNumTerm, SolsAccum)
                        const SunEcliStatus = SunEcliFunc.Status
                        let NewmMagni = 0
                        const NewmStartDeci = SunEcliFunc.StartDeci ? SunEcliFunc.StartDeci.toFixed(4).slice(2, 6) : 0
                        const NewmTotalDeci = SunEcliFunc.TotalDeci ? SunEcliFunc.TotalDeci.toFixed(4).slice(2, 6) : 0
                        const NewmEndDeci = SunEcliFunc.EndDeci ? SunEcliFunc.EndDeci.toFixed(4).slice(2, 6) : 0
                        if (SunEcliStatus) {
                            NewmMagni = SunEcliFunc.Magni.toFixed(2)
                            SunEcli[i] = `<span class='eclipse'>S${NoleapMon}</span>`
                            SunEcli[i] += '出' + Rise + ' 分' + NewmMagni + (NewmStartDeci ? '虧' + NewmStartDeci : '') + (NewmTotalDeci ? '甚' + NewmTotalDeci : '') + (NewmEndDeci ? '復' + NewmEndDeci : '') + ' 入' + Sunset
                            if (SunEcliStatus === 1) {
                                NewmScPrint[i] += `<span class='eclipse-symbol'>●</span>`
                            } else if (SunEcliStatus === 2) {
                                NewmScPrint[i] += `<span class='eclipse-symbol'>◐</span>`
                            } else if (SunEcliStatus === 3) {
                                NewmScPrint[i] += `<span class='eclipse-symbol'>◔</span>`
                            }
                        }
                    }
                    if (isMoonEcli) { // 陳美東《中國古代的月食食限及食分算法》：五紀17.8/13.36大概是1.33
                        MoonEcliFunc = AutoEclipse(SyzygyNodeAccumPrint[i], SyzygyAnomaAccumPrint[i], SyzygyDeciPrint[i], SyzygyAvgDeciPrint[i], SyzygyAcrSolsDifPrint[i], SyzygySolsDifPrint[i], 0, Name, NoleapMon, LeapNumTerm, SolsAccum)
                        const MoonEcliStatus = MoonEcliFunc.Status
                        let SyzygyMagni = 0
                        const SyzygyStartDeci = MoonEcliFunc.StartDeci ? MoonEcliFunc.StartDeci.toFixed(4).slice(2, 6) : 0
                        const SyzygyTotalDeci = MoonEcliFunc.TotalDeci ? MoonEcliFunc.TotalDeci.toFixed(4).slice(2, 6) : 0
                        const SyzygyEndDeci = MoonEcliFunc.EndDeci ? MoonEcliFunc.EndDeci.toFixed(4).slice(2, 6) : 0
                        if (MoonEcliStatus) {
                            SyzygyMagni = MoonEcliFunc.Magni.toFixed(2)
                            MoonEcli[i] = `<span class='eclipse'>M${NoleapMon}</span>`
                            MoonEcli[i] += '入' + Sunset + ' 分' + SyzygyMagni + (SyzygyStartDeci ? '虧' + SyzygyStartDeci + '甚' + SyzygyTotalDeci : '') + (SyzygyEndDeci ? '復' + SyzygyEndDeci : '') + ' 出' + Rise
                            if (MoonEcliStatus === 1) {
                                SyzygyScPrint[i] += `<span class='eclipse-symbol'>●</span>`
                            } else if (MoonEcliStatus === 2) {
                                SyzygyScPrint[i] += `<span class='eclipse-symbol'>◐</span>`
                            } else if (MoonEcliStatus === 3) {
                                SyzygyScPrint[i] += `<span class='eclipse-symbol'>◔</span>`
                            }
                        }

                    }
                }
                for (let i = 0; i < NewmDeciPrint.length; i++) {
                    NewmDeciPrint[i] = NewmDeciPrint[i].toFixed(4).slice(2, 6)
                    NewmAvgDeciPrint[i] = NewmAvgDeciPrint[i].toFixed(4).slice(2, 6)
                    SyzygyDeciPrint[i] = SyzygyDeciPrint[i].toFixed(4).slice(2, 6)
                }
            }
        } else if (Type === 13) {
            SunEcli = ThisYear.SunEcli
            MoonEcli = ThisYear.MoonEcli
        }
        const YearSc = ScList[((year - 3) % 60 + 60) % 60]
        let Era = year
        if (year > 0) Era = `公元 ${year} 年 ${YearSc}`
        else Era = `公元前 ${1 - year} 年 ${YearSc}`
        let YearInfo = `<span class='cal-name'>${NameList[Name]}</span> 距曆元${year - (OriginAd || CloseOriginAd)}年 `
        if (Type === 1) {
            const LeapSur = isTermLeap ? ThisYear.LeapSurAvgThis : ThisYear.LeapSurAvgFix
            if (Name === 'Taichu') {
                YearInfo += `${ScList[ThisYear.BuScOrder]}統${ThisYear.BuYear}${ThisYear.JupiterSc}`
            } else {
                YearInfo += `${ThreeList[ThisYear.JiOrder]}紀${ScList[ThisYear.BuScOrder]}蔀${ThisYear.BuYear}`
            }
            YearInfo += `  大${ZhengGreatSur}小${ZhengSmallSur}冬至${parseFloat((ThisYear.SolsAccumMod).toPrecision(6)).toFixed(4)}`
            if (SolsOriginDif === -45.65625) {
                YearInfo += `立春${parseFloat(((SolsAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
            } else if (SolsOriginDif === -60.875) {
                YearInfo += `雨水${parseFloat(((SolsAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
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
                YearInfo += (OriginMonNum === 2 ? '雨' : '冬') + ((SolsAccum % 60 + 60) % 60).toFixed(4)
            }
            if (Type === 2) {
                YearInfo += `  平${ThisYear.LeapSurAvg}定${(ThisYear.LeapSurAcr).toFixed(2)}準${LeapLimit}`
            } else if (Type === 3) {
                YearInfo += `  平${Math.round((ThisYear.LeapSurAvg) * ZhangRange)}定${((ThisYear.LeapSurAcr) * ZhangRange).toFixed(2)}準${Math.round((LeapLimit) * ZhangRange)}`
            } else if (Type <= 7) {
                YearInfo += `  平${parseFloat((ThisYear.LeapSurAvg).toPrecision(8))}定${(ThisYear.LeapSurAcr).toFixed(2)}準${(LeapLimit)}`
            } else if (Type <= 11) {
                YearInfo += `  平${(ThisYear.LeapSurAvg).toFixed(2)}定${(ThisYear.LeapSurAcr).toFixed(2)}準${(LeapLimit).toFixed(2)}`
            }
        }
        if (AccumPrint) YearInfo += ` ${AccumPrint}`
        let EcliPrint = []
        if ((SunEcli || []).length) EcliPrint = SunEcli.join('')
        if ((MoonEcli || []).length) EcliPrint += MoonEcli.join('')
        if (EcliPrint) YearInfo += `\n${EcliPrint}`
        if (Type < 13) {
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
        }
        return {
            Era, YearInfo, MonthPrint,
            NewmAvgScPrint, NewmAvgDeciPrint, NewmScPrint, NewmDeci3Print, NewmDeci2Print, NewmDeci1Print, NewmAcr0DeciPrint, NewmAcrDeciPrint, NewmEquaPrint, NewmEclpPrint,
            SyzygyScPrint, SyzygyAcr0DeciPrint, SyzygyDeciPrint,
            Term1NamePrint, Term1ScPrint, Term1DeciPrint, Term1AcrScPrint, Term1AcrDeciPrint, Term1EquaPrint, Term1EclpPrint,
            TermNamePrint, TermScPrint, TermDeciPrint, TermAcrScPrint, TermAcrDeciPrint, TermEquaPrint, TermEclpPrint, TermDuskstarPrint,
            ////////////// 曆書
            LeapNumTerm, SolsAccum,
            NewmInt, // 結尾就不切了，因爲最後一個月還要看下個月的情況
            NewmRaw: ((Type === 1 || Type === 13) ? [] : NewmSlice(ThisYear.NewmRaw)),
            NewmAcrRaw: ((Type === 1 || Type === 13) ? [] : NewmSlice(ThisYear.NewmAcrRaw)), // 這個是給南系月亮位置用的，平朔注曆，但是月亮位置是定朔
            // NewmAcrInt: (Type === 1 ? [] : NewmSlice(ThisYear.NewmAcrInt)),
            // NewmNodeAccumPrint, // : (Type === 1 ? [] : NewmNodeAccumPrint.slice(NewmStart)), // 為什麼還要切一遍？？
            NewmNodeAccumNightPrint,
            NewmAnomaAccumPrint, //: (Type === 1 ? [] : NewmAnomaAccumPrint.slice(NewmStart))
            NewmAnomaAccumNightPrint,
            // 時憲曆曆書
            SolsmorScOrder: Type === 13 ? ThisYear.SolsmorScOrder : undefined,
            MansionDaySolsmor: Type === 13 ? ThisYear.MansionDaySolsmor : undefined,
            SunRoot: Type === 13 ? ThisYear.SunRoot : undefined,
            SperiRoot: Type === 13 ? ThisYear.SperiRoot : undefined,
            MoonRoot: Type === 13 ? ThisYear.MoonRoot : undefined,
            MapoRoot: Type === 13 ? ThisYear.MapoRoot : undefined,
            NodeRoot: Type === 13 ? ThisYear.NodeRoot : undefined,
            NewmSd: Type === 13 ? ThisYear.NewmSd.slice(1 + NewmStart) : undefined,
            NowTerm1Sd: Type === 13 ? ThisYear.NowTerm1Sd.slice(1 + TermStart) : undefined
        }
    }
    Memo[0] = AutoNewm(Name, YearStart - 1) // 去年
    Memo[1] = AutoNewm(Name, YearStart) // 今年
    const result = []
    YearEnd = YearEnd === undefined ? YearStart : YearEnd
    for (let year = YearStart; year <= YearEnd; year++) {
        Memo[2] = AutoNewm(Name, year + 1) // 明年
        result.push(calculate(year))
        Memo[0] = Memo[1] // 数组滚动，避免重复运算
        Memo[1] = Memo[2]
    }
    return result
}
// console.log(Index('Jiazi', 1760, 1760))
