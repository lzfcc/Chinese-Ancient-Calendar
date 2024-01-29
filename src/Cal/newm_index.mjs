import N1 from './newm_quar.mjs'
import N2 from './newm.mjs'
// import N3 from './newm_huihui.mjs'
import N4 from './newm_shixian.mjs'
import Para from './para_calendars.mjs'
import { TermList, ScList, ThreeList, CalNameList, MonNumList1, MonNumListChuA, MonNumListChuB, deci } from './para_constant.mjs'
import { AutoEclipse } from './astronomy_eclipse.mjs'
import { Accum2Mansion } from './astronomy_other.mjs'
import { AutoLongi2Lati } from './astronomy_bind.mjs'
import { AutoRangeEcli } from './para_auto-constant.mjs'
// const Index = (CalName, YearStart, YearEnd) => {
export default (CalName, YearStart, YearEnd) => {
    const Bind = CalName => {
        const type = Para[CalName].Type
        if (type === 1) return N1
        else if (type === 13) return N4
        else return N2
    }
    const AutoNewm = Bind(CalName)
    const { Type, OriginAd, CloseOriginAd, ZhangRange, ZhengNum, Denom, Node, OriginMonNum, isTermLeap, SolsOriginDif, MansionRaw } = Para[CalName]
    let { ScConst } = Para[CalName]
    const isExcl = Type >= 4
    ScConst = ScConst || 0
    const Memo = []
    const calculate = year => {
        const [PrevYear, ThisYear, NextYear] = Memo
        const ZhengSolsDif = ZhengNum - OriginMonNum
        const SolsMon = (1 - ZhengNum + 12) % 12 // 冬至月
        const { JiScOrder: JiScOrder, SolsAccum, NewmEqua, NewmEclp, TermAvgRaw, TermAcrRaw, EquaDegAccumList, TermAvgSolsDif, TermAcrSolsDif, AccumPrint, LeapLimit } = ThisYear
        let { LeapNumTerm, NewmInt, NewmStart, NewmEnd, TermStart, TermEnd } = ThisYear
        NewmInt = NewmInt || []
        NewmStart = 0
        NewmEnd = LeapNumTerm ? 1 : 0
        TermEnd = NewmEnd
        if (PrevYear.LeapNumTerm) {
            LeapNumTerm = 0
            if (PrevYear.NewmAvgDeci[13].toFixed(3) === ThisYear.NewmAvgDeci[1].toFixed(3)) { // 會出現最末位差一點的情況
                NewmStart = 1
                NewmEnd = 1
                TermEnd = 0
            }
        }
        TermStart = 0
        const SolsDeci = +deci(SolsAccum || 0).toFixed(5)
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
        }
        const TermAvgMod = [], TermOrderMod = [], TermSc = [], TermName = [], TermDeci = [], TermEqua = [], TermEclp = [], TermDuskstar = []
        let TermAcrSc = [], TermAcrDeci = [], TermAcrMod = [], TermAcrOrderMod = []
        if (Type === 13) {
            for (let i = 1; i <= 13; i++) {
                TermName[i] = TermList[(i + 2) % 12]
                TermSc[i] = ThisYear.TermSc[i]
                TermDeci[i] = ThisYear.TermDeci[i]
                TermAcrSc[i] = ThisYear.TermAcrSc[i]
                TermAcrDeci[i] = ThisYear.TermAcrDeci[i]
                TermEclp[i] = ThisYear.TermEclp[i]
                TermDuskstar[i] = ThisYear.TermDuskstar[i]
            }
            if (LeapNumTerm) {
                TermName[LeapNumTerm + 1] = '无'
                TermSc[LeapNumTerm + 1] = ''
                TermDeci[LeapNumTerm + 1] = ''
                TermAcrSc[LeapNumTerm + 1] = ''
                TermAcrDeci[LeapNumTerm + 1] = ''
                TermEclp[LeapNumTerm + 1] = ''
                TermDuskstar[LeapNumTerm + 1] = ''
                for (let i = LeapNumTerm + 2; i <= 13; i++) {
                    TermName[i] = TermList[(i + 1) % 12]
                    TermSc[i] = ThisYear.TermSc[i - 1]
                    TermDeci[i] = ThisYear.TermDeci[i - 1]
                    TermAcrSc[i] = ThisYear.TermAcrSc[i - 1]
                    TermAcrDeci[i] = ThisYear.TermAcrDeci[i - 1]
                    TermEclp[i] = ThisYear.TermEclp[i - 1]
                    TermDuskstar[i] = ThisYear.TermDuskstar[i - 1]
                }
            }
        } else if (Type > 1) {
            for (let i = 1; i <= 13; i++) {
                TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermName[i] = TermList[(i + ZhengSolsDif + OriginMonNum + 12) % 12]
                TermSc[i] = ScList[(TermOrderMod[i] + isExcl + ScConst) % 60]
                TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                if (TermAcrRaw[i]) {
                    TermAcrMod = ((TermAcrRaw[i]) % 60 + 60) % 60
                    TermAcrOrderMod = Math.floor(TermAcrMod)
                    TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + ScConst) % 60]
                    TermAcrDeci[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                }
                if (MansionRaw) {
                    const Func = Accum2Mansion((TermAcrRaw[i] || TermAvgRaw[i]), EquaDegAccumList, CalName, (TermAcrSolsDif[i] || TermAvgSolsDif[i]), SolsDeci, year)
                    TermEqua[i] = Func.Mansion
                    TermDuskstar[i] = Func.MorningDuskstar
                }
            }
            if (LeapNumTerm) {
                TermName[LeapNumTerm + 1] = '无'
                if (TermAcrRaw[1]) {
                    TermAcrSc[LeapNumTerm + 1] = ''
                    TermAcrDeci[LeapNumTerm + 1] = ''
                }
                TermSc[LeapNumTerm + 1] = ''
                TermDeci[LeapNumTerm + 1] = ''
                if (MansionRaw) {
                    TermEqua[LeapNumTerm + 1] = ''
                    TermDuskstar[LeapNumTerm + 1] = ''
                }
                for (let i = LeapNumTerm + 2; i <= 13; i++) {
                    TermAvgMod[i] = ((TermAvgRaw[i - 1]) % 60 + 60) % 60
                    TermOrderMod[i] = Math.floor(TermAvgMod[i])
                    TermName[i] = TermList[(i + ZhengSolsDif + OriginMonNum + 11) % 12]
                    TermSc[i] = ScList[(TermOrderMod[i] + isExcl + ScConst) % 60]
                    TermDeci[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                    if (TermAcrRaw[i]) {
                        TermAcrMod = (TermAcrRaw[i - 1] % 60 + 60) % 60
                        TermAcrOrderMod = Math.floor(TermAcrMod)
                        TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + ScConst) % 60]
                        TermAcrDeci[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                    }
                    if (MansionRaw) {
                        const Func = Accum2Mansion((TermAcrRaw[i - 1] || TermAvgRaw[i - 1]), EquaDegAccumList, CalName, (TermAcrSolsDif[i - 1] || TermAvgSolsDif[i - 1]), SolsDeci, year)
                        TermEqua[i] = Func.Mansion
                        TermDuskstar[i] = Func.MorningDuskstar
                    }
                }
            }
        }
        // 月序
        const MonthName = []
        let MonNumList = MonNumList1
        if (CalName === 'Zhuanxu1') MonNumList = MonNumListChuA
        else if (CalName === 'Zhuanxu2') MonNumList = MonNumListChuB
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
        let NewmScPrint = [], NewmDeci3Print = [], NewmDeci2Print = [], NewmDeci1Print = [], NewmDeciAcrPrint = []
        if (Type >= 2) {
            NewmScPrint = NewmSlice(ThisYear.NewmSc)
            if (Type <= 10 && ThisYear.NewmDeci1) { // 線性內插
                NewmDeci1Print = NewmSlice(ThisYear.NewmDeci1)
            } else if (Type === 11) { // 三次內插
                NewmDeci3Print = NewmSlice(ThisYear.NewmDeci3)
            } else if (Type === 13) { // 實朔實時
                NewmDeciAcrPrint = NewmSlice(ThisYear.NewmDeci)
            }
        }
        if (Type >= 5 && Type <= 10 && ThisYear.NewmDeci2) {
            NewmDeci2Print = NewmSlice(ThisYear.NewmDeci2)
        }
        const NewmEquaPrint = NewmSlice(NewmEqua || [])
        const NewmEclpPrint = NewmSlice(NewmEclp || [])
        const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc)
        const SyzygyDeciPrint = NewmSlice(ThisYear.SyzygyDeci)
        let NewmDeciPrint = [], TermNamePrint = [], TermScPrint = [], TermDeciPrint = [], TermAcrScPrint = [], TermAcrDeciPrint = [], TermEquaPrint = [], TermEclpPrint = [], TermDuskstarPrint = []
        if (Type === 1) {
            TermNamePrint = TermSlice(ThisYear.TermName)
            TermScPrint = TermSlice(ThisYear.TermSc)
            TermDeciPrint = TermSlice(ThisYear.TermDeci)
            TermEquaPrint = TermSlice(ThisYear.TermEqua)
            TermDuskstarPrint = TermSlice(ThisYear.TermDuskstar)
            if (LeapNumTerm === 12 && specialNewmSyzygyEnd && !TermEnd) {
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
            TermEclpPrint = TermSlice(TermEclp)
            TermDuskstarPrint = TermSlice(TermDuskstar)
        }
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
                    let Rise = AutoLongi2Lati(NewmAcrSolsDifPrint[i], SolsDeci, CalName).Rise / 100
                    let SunEcliFunc = {}, MoonEcliFunc = {}
                    const { RangeSunEcli, RangeMoonEcli } = AutoRangeEcli(CalName, Type)
                    let isSunEcli = (NewmNodeAccumPrint[i] < 0.9 || (NewmNodeAccumPrint[i] > 12.8 && NewmNodeAccumPrint[i] < 15.5) || NewmNodeAccumPrint[i] > 25.3) &&
                        ((NewmDeciPrint[i] > Rise - RangeSunEcli) && (NewmDeciPrint[i] < 1 - Rise + RangeSunEcli))
                    let isMoonEcli = (SyzygyNodeAccumPrint[i] < 1.5 || (SyzygyNodeAccumPrint[i] > 12.1 && SyzygyNodeAccumPrint[i] < 15.1) || SyzygyNodeAccumPrint[i] > 25.7) &&
                        ((SyzygyDeciPrint[i] < Rise + RangeMoonEcli) || (SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli))
                    const Sunset = (1 - Rise).toFixed(4).slice(2, 6)
                    if (CalName === 'Mingtian') {
                        isSunEcli = (NewmDeciPrint[i] > Rise - RangeSunEcli) && (NewmDeciPrint[i] < 1 - Rise + RangeSunEcli)
                        isMoonEcli = (SyzygyDeciPrint[i] < Rise + RangeMoonEcli) || (SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli)
                    }
                    Rise = Rise.toFixed(4).slice(2, 6)
                    if (isSunEcli) { // 這些數字根據大統，再放寬0.3
                        SunEcliFunc = AutoEclipse(NewmNodeAccumPrint[i], NewmAnomaAccumPrint[i], NewmDeciPrint[i], NewmAvgDeciPrint[i], NewmAcrSolsDifPrint[i], NewmSolsDifPrint[i], 1, CalName, NoleapMon, LeapNumTerm, SolsAccum)
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
                        MoonEcliFunc = AutoEclipse(SyzygyNodeAccumPrint[i], SyzygyAnomaAccumPrint[i], SyzygyDeciPrint[i], SyzygyAvgDeciPrint[i], SyzygyAcrSolsDifPrint[i], SyzygySolsDifPrint[i], 0, CalName, NoleapMon, LeapNumTerm, SolsAccum)
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
            }
            for (let i = 0; i < NewmDeciPrint.length; i++) {
                NewmDeciPrint[i] = NewmDeciPrint[i].toFixed(4).slice(2, 6)
                NewmAvgDeciPrint[i] = NewmAvgDeciPrint[i].toFixed(4).slice(2, 6)
                SyzygyDeciPrint[i] = SyzygyDeciPrint[i].toFixed(4).slice(2, 6)
            }
        } else if (Type === 13) {
            SunEcli = ThisYear.SunEcli
            MoonEcli = ThisYear.MoonEcli
        }
        const YearSc = ScList[((year - 3) % 60 + 60) % 60]
        let Era = year
        if (year > 0) Era = `公元 ${year} 年 ${YearSc}`
        else Era = `公元前 ${1 - year} 年 ${YearSc}`
        let YearInfo = `<span class='cal-name'>${CalNameList[CalName]}</span> 上元${year - (OriginAd || CloseOriginAd)} `
        if (Type === 1) {
            const LeapSur = isTermLeap ? ThisYear.LeapSurAvgThis : ThisYear.LeapSurAvgFix
            if (CalName === 'Taichu') {
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
                YearInfo += `  平${ThisYear.LeapSurAvgThis}定${(ThisYear.LeapSurAcrThis).toFixed(2)}準${LeapLimit}`
            } else if (Type === 3) {
                YearInfo += `  平${Math.round((ThisYear.LeapSurAvgThis) * ZhangRange)}定${((ThisYear.LeapSurAcrThis) * ZhangRange).toFixed(2)}準${Math.round((LeapLimit) * ZhangRange)}`
            } else if (Type <= 7) {
                YearInfo += `  平${parseFloat((ThisYear.LeapSurAvgThis).toPrecision(8))}定${(ThisYear.LeapSurAcrThis).toFixed(2)}準${(LeapLimit)}`
            } else if (Type <= 11) {
                YearInfo += `  平${(ThisYear.LeapSurAvgThis).toFixed(2)}定${(ThisYear.LeapSurAcrThis).toFixed(2)}準${(LeapLimit).toFixed(2)}`
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
            NewmAvgScPrint, NewmAvgDeciPrint, NewmScPrint, NewmDeci3Print, NewmDeci2Print, NewmDeci1Print, NewmDeciAcrPrint, NewmEquaPrint, NewmEclpPrint,
            SyzygyScPrint, SyzygyDeciPrint,
            TermNamePrint, TermScPrint, TermDeciPrint, TermAcrScPrint, TermAcrDeciPrint, TermEquaPrint, TermEclpPrint, TermDuskstarPrint,
            ////////////// 以下用於日書/////////////
            LeapNumTerm, SolsAccum,
            NewmInt, // 結尾就不切了，因爲最後一個月還要看下個月的情況
            NewmRaw: ((Type === 1 || Type === 13) ? [] : NewmSlice(ThisYear.NewmRaw)),
            NewmAcrRaw: ((Type === 1 || Type === 13) ? [] : NewmSlice(ThisYear.NewmAcrRaw)), // 這個是給南系月亮位置用的，平朔注曆，但是月亮位置是定朔
            // NewmAcrInt: (Type === 1 ? [] : NewmSlice(ThisYear.NewmAcrInt)),
            // NewmNodeAccumPrint, // : (Type === 1 ? [] : NewmNodeAccumPrint.slice(NewmStart)), // 為什麼還要切一遍？？
            NewmNodeAccumNightPrint,
            NewmAnomaAccumPrint, //: (Type === 1 ? [] : NewmAnomaAccumPrint.slice(NewmStart))
            NewmAnomaAccumNightPrint
        }
    }
    Memo[0] = AutoNewm(CalName, YearStart - 1) // 去年
    Memo[1] = AutoNewm(CalName, YearStart) // 今年
    const result = []
    YearEnd = YearEnd === undefined ? YearStart : YearEnd
    for (let year = YearStart; year <= YearEnd; year++) {
        Memo[2] = AutoNewm(CalName, year + 1) // 明年
        result.push(calculate(year))
        Memo[0] = Memo[1] // 数组滚动，避免重复运算
        Memo[1] = Memo[2]
    }
    return result
}
// console.log(Index('Qianxiang', 3, 3))
