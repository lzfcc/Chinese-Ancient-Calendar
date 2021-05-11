import {
    Bind
} from './bind.mjs'
import {
    TermList, ScList, ThreeList, CalNameList, MonNumList
} from './para_constant.mjs'
import {
    AutoEclipse
} from './astronomy_eclipse.mjs'
import {
    Deg2Mansion
} from './astronomy_other.mjs'

export default (CalName, YearStart, YearEnd) => { // CalNewm
    const { Type, AutoNewm, AutoPara
    } = Bind(CalName)
    const isExcl = Type >= 4 ? 1 : 0
    const { OriginAd, ZhangRange, ZhengNum, Denom, OriginMonNum, isTermLeap, WinsolsWinsolsDif, MansionRaw
    } = AutoPara[CalName]
    let { OriginDaySc
    } = AutoPara[CalName]
    OriginDaySc = OriginDaySc || 0
    const YearMemo = []
    const calculate = year => {
        const [PrevYear, ThisYear, NextYear] = YearMemo
        const ZhengWinsolsDif = ZhengNum - OriginMonNum
        const WinsolsMonNum = (1 - ZhengNum + 12) % 12 // 冬至月
        const isLeapPvPt = PrevYear.isLeapPost
        const {
            isLeapAdvan: isLeapTA,
            JiScOrder: JiScOrder,
            OriginAccum: OriginAccum,
            NewmEqua: NewmEqua,
            TermAvgRaw: TermAvgRaw,
            TermAcrRaw: TermAcrRaw,
            EquaDegAccumList: EquaDegAccumList,
            TermAvgWinsolsDif: TermAvgWinsolsDif,
            TermAcrWinsolsDif: TermAcrWinsolsDif,
            AccumPrint: AccumPrint,
            LeapLimit: LeapLimit
        } = ThisYear
        let {
            NewmInt: NewmInt,
            LeapNumTerm: LeapNumTermThis,
            isLeapPrev: isLeapTPv,
            isLeapThis: isLeapTT,
            NewmSyzygyStart: NewmSyzygyStart,
            NewmSyzygyEnd: NewmSyzygyEnd,
            TermStart: TermStart,
            TermEnd: TermEnd,
        } = ThisYear
        const WinsolsDecimal = +(OriginAccum - Math.floor(OriginAccum)).toFixed(5)
        let specialStart = 0
        let specialNewmSyzygyEnd = 0
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
            NewmSyzygyStart += specialStart
            NewmSyzygyEnd += specialNewmSyzygyEnd
            TermStart += specialStart
            LeapNumTermThis -= NewmSyzygyStart
        } else {
            if (ThisYear.isLeapPost) {
                NewmSyzygyEnd = 0
                TermEnd = 0
            } else if (isLeapPvPt) {
                isLeapTPv = 0
                if (ZhengWinsolsDif <= 0) {
                    NewmSyzygyStart = -1
                    NewmSyzygyEnd = 0
                } else {
                    NewmSyzygyStart = 0
                    NewmSyzygyEnd = 1
                }
                TermEnd = 1
                isLeapTT = 1
                LeapNumTermThis = 1
            } else if (NextYear.isLeapPrev && NextYear.isLeapAdvan) {
                TermEnd = 1
                isLeapTT = 1
                NewmSyzygyEnd = 1
                LeapNumTermThis = 12
            } else if (isLeapTPv && isLeapTA) {
                NewmSyzygyStart = 1
                NewmSyzygyEnd = 1
                TermEnd = 0
                isLeapTT = 0
                isLeapTPv = 1
            }
        }
        const TermAvgMod = []
        const TermOrderMod = []
        const TermSc = []
        const TermName = []
        const TermDecimal = []
        let TermAcrSc = []
        let TermAcrDecimal = []
        let TermAcrMod = []
        let TermAcrOrderMod = []
        const TermEqua = []
        const TermMidstar = []
        if (Type >= 2) {
            for (let i = 0; i <= 13; i++) {
                TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermName[i] = TermList[(i + ZhengWinsolsDif + OriginMonNum + 12) % 12]
                TermSc[i] = ScList[(TermOrderMod[i] + isExcl + OriginDaySc) % 60]
                TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                if (TermAcrRaw) {
                    TermAcrMod = ((TermAcrRaw[i]) % 60 + 60) % 60
                    TermAcrOrderMod = Math.floor(TermAcrMod)
                    TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + OriginDaySc) % 60]
                    TermAcrDecimal[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                }
                if (MansionRaw) {
                    const Func = Deg2Mansion((TermAcrRaw[i] || TermAvgRaw[i]), EquaDegAccumList, CalName, (TermAcrWinsolsDif[i] || TermAvgWinsolsDif[i]), WinsolsDecimal)
                    TermEqua[i] = Func.MansionResult
                    TermMidstar[i] = Func.MidstarResult
                }
            }
            if (isLeapTT) {
                let Plus = 2.5
                if (Type === 11) { // 若不用進朔，需要改成3.5
                    Plus = 3.5
                }
                while (LeapNumTermThis >= 2 && (TermAvgRaw[LeapNumTermThis] >= NewmInt[LeapNumTermThis + 1]) && (TermAvgRaw[LeapNumTermThis] < NewmInt[LeapNumTermThis + 1] + Plus)) {
                    LeapNumTermThis--
                }
                while (LeapNumTermThis <= 11 && (TermAvgRaw[LeapNumTermThis + 1] < NewmInt[LeapNumTermThis + 2]) && (TermAvgRaw[LeapNumTermThis + 1] >= NewmInt[LeapNumTermThis + 2] - Plus)) {
                    LeapNumTermThis++
                }
                TermName[LeapNumTermThis + 1] = '无'
                if (TermAcrRaw) {
                    TermAcrSc[LeapNumTermThis + 1] = ''
                    TermAcrDecimal[LeapNumTermThis + 1] = ''
                }
                TermSc[LeapNumTermThis + 1] = ''
                TermDecimal[LeapNumTermThis + 1] = ''
                if (MansionRaw) {
                    TermEqua[LeapNumTermThis + 1] = ''
                    TermMidstar[LeapNumTermThis + 1] = ''
                }
                for (let i = LeapNumTermThis + 2; i <= 13; i++) {
                    TermAvgMod[i] = ((TermAvgRaw[i - 1]) % 60 + 60) % 60
                    TermOrderMod[i] = Math.floor(TermAvgMod[i])
                    TermName[i] = TermList[(i + ZhengWinsolsDif + OriginMonNum + 11) % 12]
                    TermSc[i] = ScList[(TermOrderMod[i] + isExcl + OriginDaySc) % 60]
                    TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                    if (TermAcrRaw) {
                        TermAcrMod = (TermAcrRaw[i - 1] % 60 + 60) % 60
                        TermAcrOrderMod = Math.floor(TermAcrMod)
                        TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + OriginDaySc) % 60]
                        TermAcrDecimal[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                    }
                    if (MansionRaw) {
                        const Func = Deg2Mansion((TermAcrRaw[i - 1] || TermAvgRaw[i - 1]), EquaDegAccumList, CalName, (TermAcrWinsolsDif[i - 1] || TermAvgWinsolsDif[i - 1]), WinsolsDecimal)
                        TermEqua[i] = Func.MansionResult
                        TermMidstar[i] = Func.MidstarResult
                    }
                }
            }
        }
        LeapNumTermThis -= NewmSyzygyStart
        // 月序
        const Month = []
        const MonthName = []
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
        const NewmSlice = array => array.slice(1 + NewmSyzygyStart, 13 + NewmSyzygyEnd)
        const TermSlice = array => array.slice(1 + TermStart, 13 + TermEnd)
        ////////////下爲調整輸出////////////
        const NewmWinsolsDifRawPrint = NewmSlice(ThisYear.NewmWinsolsDifRaw)
        const NewmAvgScPrint = NewmSlice(ThisYear.NewmAvgSc)
        const NewmAvgDecimalPrint = NewmSlice(ThisYear.NewmAvgDecimal)
        NewmInt = NewmInt.slice(1 + NewmSyzygyStart)
        const step = []
        for (let i = 0; i < NewmAvgScPrint.length; i++) {
            step[i] = NewmInt[i + 1] - NewmInt[i]
        }
        // const checkStep = (num, time, array) => array.reduce(function (p, c) { c === num ? p + 1 : (p < time ? 0 : p) }, 0) >= time
        // const sdfsdg = checkStep(30, 2, [30, 29, 30, 30, 30])
        let tmp30 = 0
        let tmp29 = 0
        for (let i = 0; i < step.length - 2; i++) {
            if (step[i] === 30 && step[i + 1] === 30 && step[i + 2] === 30 && step[i + 3] === 30) {
                tmp30 = 4
                break
            }
            if (step[i] === 29 && step[i + 1] === 29 && step[i + 2] === 29) {
                tmp29 = 3
                break
            }
        }
        let ZhengGreatSur = 0
        let ZhengSmallSur = 0
        if (Type === 1) {
            ZhengGreatSur = (NewmInt[0] - ThisYear.BuScOrder + 60) % 60
            ZhengSmallSur = parseFloat(((ThisYear.NewmAvgRaw[1 + NewmSyzygyStart] - NewmInt[0]) * Denom).toPrecision(5))
        }
        const MonthPrint = MonthName.slice(1)
        let NewmScPrint = []
        let NewmDecimal3Print = []
        let NewmDecimal2Print = []
        let NewmDecimal1Print = []
        if (Type >= 2) {
            NewmScPrint = NewmSlice(ThisYear.NewmSc)
            if (Type <= 10 && (ThisYear.NewmDecimal1 || []).length) {
                NewmDecimal1Print = NewmSlice(ThisYear.NewmDecimal1)
            } else if (Type === 11) {
                NewmDecimal3Print = NewmSlice(ThisYear.NewmDecimal3)
            }
        }
        if (Type >= 5 && Type <= 10) {
            NewmDecimal2Print = NewmSlice(ThisYear.NewmDecimal2)
        }
        const NewmEquaPrint = NewmSlice(NewmEqua)
        const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc)
        const SyzygyDecimalPrint = NewmSlice(ThisYear.SyzygyDecimal)
        let TermNamePrint = []
        let TermScPrint = []
        let TermDecimalPrint = []
        let TermAcrScPrint = []
        let TermAcrDecimalPrint = []
        let TermEquaPrint = []
        let TermMidstarPrint = []
        if (Type === 1) {
            TermNamePrint = TermSlice(ThisYear.TermName)
            TermScPrint = TermSlice(ThisYear.TermSc)
            TermDecimalPrint = TermSlice(ThisYear.TermDecimal)
            TermEquaPrint = TermSlice(ThisYear.TermEqua)
            TermMidstarPrint = TermSlice(ThisYear.TermMidstar)
            if (LeapNumTermThis === 12 && specialNewmSyzygyEnd && !TermEnd) {
                TermNamePrint.push('无')
                TermScPrint.push('')
                TermDecimalPrint.push('')
                TermEquaPrint.push('')
                TermMidstarPrint.push('')
            }
        } else {
            if (Type >= 2 && Type <= 4) {
                TermNamePrint = TermSlice(TermName)
                TermScPrint = TermSlice(TermSc)
                TermDecimalPrint = TermSlice(TermDecimal)
            } else {
                TermNamePrint = TermSlice(TermName)
                TermAcrScPrint = TermSlice(TermAcrSc)
                TermAcrDecimalPrint = TermSlice(TermAcrDecimal)
                TermScPrint = TermSlice(TermSc)
                TermDecimalPrint = TermSlice(TermDecimal)
            }
            TermEquaPrint = TermSlice(TermEqua)
            TermMidstarPrint = TermSlice(TermMidstar)
        }
        ////////// 下調用交食模塊。由於隋系交食需要用月份，所以必須要切了之後才能用，傳一堆參數，很惡心
        let NewmEcli = []
        let SyzygyEcli = []
        let NewmNodeAccumPrint = []
        let NewmAnomaAccumPrint = []
        if (Type > 1) {
            NewmNodeAccumPrint = NewmSlice(ThisYear.NewmNodeAccum)
            NewmAnomaAccumPrint = NewmSlice(ThisYear.NewmAnomaAccum)
            const NewmDecimalPrint = NewmSlice(ThisYear.NewmDecimal)
            const SyzygyNodeAccumPrint = NewmSlice(ThisYear.SyzygyNodeAccum)
            const SyzygyAnomaAccumPrint = NewmSlice(ThisYear.SyzygyAnomaAccum)
            const SyzygyWinsolsDifRawPrint = NewmSlice(ThisYear.SyzygyWinsolsDifRaw)
            for (let i = 0; i < MonthPrint.length; i++) { // 切了之後從0開始索引
                // 入交定日似乎宋厤另有算法，授時直接就是用定朔加減差，奇怪。
                let NoleapMon = i + 1
                if (LeapNumTermThis > 0) {
                    if (i === LeapNumTermThis) {
                        NoleapMon = i
                    } else if (i >= LeapNumTermThis + 1) {
                        NoleapMon = i
                    }
                }
                let NewmEcliFunc = {}
                let SyzygyEcliFunc = {}
                if (NewmNodeAccumPrint[i] < 1.35 || (NewmNodeAccumPrint[i] > 12.25 && NewmNodeAccumPrint[i] < 14.96) || NewmNodeAccumPrint[i] > 25.86) {
                    NewmEcliFunc = AutoEclipse(NewmNodeAccumPrint[i], NewmAnomaAccumPrint[i], NewmDecimalPrint[i], NewmWinsolsDifRawPrint[i], 1, CalName, NoleapMon, LeapNumTermThis)
                    const Newmstatus = NewmEcliFunc.status
                    let NewmMagni = 0
                    let NewmStartDecimal = 0 // 初虧
                    let NewmTotalDecimal = 0 // 食甚
                    if (NewmEcliFunc.StartDecimal) {
                        NewmStartDecimal = NewmEcliFunc.StartDecimal.toFixed(4).slice(2, 6)
                    }
                    if (NewmEcliFunc.Decimal) {
                        NewmTotalDecimal = NewmEcliFunc.Decimal.toFixed(4).slice(2, 6)
                    }
                    if (Newmstatus) {
                        NewmMagni = NewmEcliFunc.Magni.toFixed(2)
                        NewmEcli[i] = `<span class='eclipse'>S${NoleapMon}</span>`
                        NewmEcli[i] += '分' + NewmMagni + (NewmStartDecimal ? '虧' + NewmStartDecimal : '') + (NewmTotalDecimal ? '甚' + NewmTotalDecimal : '')
                        if (Newmstatus === 1) {
                            NewmScPrint[i] += `<span class='eclipse-symbol'>●</span>`
                        } else if (Newmstatus === 2) {
                            NewmScPrint[i] += `<span class='eclipse-symbol'>◐</span>`
                        } else if (Newmstatus === 3) {
                            NewmScPrint[i] += `<span class='eclipse-symbol'>◔</span>` // ◍
                        }
                    }
                }
                if (SyzygyNodeAccumPrint[i] < 1.35 || (SyzygyNodeAccumPrint[i] > 12.25 && SyzygyNodeAccumPrint[i] < 14.96) || SyzygyNodeAccumPrint[i] > 25.86) { // 陳美東《中國古代的月食食限及食分算法》：五紀17.8/13.36大概是1.33
                    SyzygyEcliFunc = AutoEclipse(SyzygyNodeAccumPrint[i], SyzygyAnomaAccumPrint[i], SyzygyDecimalPrint[i], SyzygyWinsolsDifRawPrint[i], 0, CalName, NoleapMon, LeapNumTermThis)
                    const Syzygystatus = SyzygyEcliFunc.status
                    let SyzygyMagni = 0
                    let SyzygyStartDecimal = 0
                    let SyzygyTotalDecimal = 0
                    if (SyzygyEcliFunc.StartDecimal) {
                        SyzygyStartDecimal = SyzygyEcliFunc.StartDecimal.toFixed(4).slice(2, 6)
                        SyzygyTotalDecimal = SyzygyEcliFunc.Decimal.toFixed(4).slice(2, 6)
                    }
                    if (Syzygystatus) {
                        SyzygyMagni = SyzygyEcliFunc.Magni.toFixed(2)
                        SyzygyEcli[i] = `<span class='eclipse'>M${NoleapMon}</span>`
                        SyzygyEcli[i] += '分' + SyzygyMagni + (SyzygyStartDecimal ? '虧' + SyzygyStartDecimal + '甚' + SyzygyTotalDecimal : '')
                        if (Syzygystatus === 1) {
                            SyzygyScPrint[i] += `<span class='eclipse-symbol'>●</span>`
                        } else if (Syzygystatus === 2) {
                            SyzygyScPrint[i] += `<span class='eclipse-symbol'>◐</span>`
                        } else if (Syzygystatus === 3) {
                            SyzygyScPrint[i] += `<span class='eclipse-symbol'>◔</span>`
                        }
                    }
                }
                SyzygyDecimalPrint[i] = SyzygyDecimalPrint[i].toFixed(4).slice(2, 6)
            }
        }
        const YearSc = ScList[((year - 3) % 60 + 60) % 60]
        let Era = year
        if (year > 0) {
            Era = '公元 ' + year + ' 年 ' + YearSc
        } else {
            Era = '公元前 ' + (1 - year) + ' 年 ' + YearSc
        }
        let YearInfo = `<span class='cal-name'>${CalNameList[CalName]}</span> 上元${year - OriginAd} `
        if (Type === 1) {
            let LeapSur = 0
            if (!isTermLeap) {
                LeapSur = ThisYear.LeapSurAvgFix
            } else {
                LeapSur = ThisYear.LeapSurAvgThis
            }
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
            YearInfo += `  閏餘${(LeapSur.toFixed(4))}`
            if (ThisYear.LeapNumOriginLeapSur) {
                YearInfo += `閏${ThisYear.LeapNumOriginLeapSur - NewmSyzygyStart}`
            }
        } else {
            if (JiScOrder) {
                YearInfo += `${ScList[JiScOrder]}紀${ThisYear.JiYear}`
            }
            if (Type <= 10) {
                if (OriginMonNum === 2) {
                    YearInfo += `雨`
                } else {
                    YearInfo += `冬`
                }
                YearInfo += `${((OriginAccum % 60 + 60) % 60).toFixed(4)}`
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
            YearInfo += ' ' + AccumPrint
        }
        let NewmEcliPrint = []
        let SyzygyEcliPrint = []
        if ((NewmEcli || []).length) {
            NewmEcliPrint = NewmEcli.join('')
            YearInfo += `\n` + NewmEcliPrint
        }
        if ((SyzygyEcli || []).length) {
            SyzygyEcliPrint = `<span class='eclipse-wrap'>` + SyzygyEcli.join('') + `</span>`
            if ((NewmEcli || []).length > 0) {
                YearInfo += SyzygyEcliPrint
            } else {
                YearInfo += `\n` + SyzygyEcliPrint
            }
        }
        if (tmp29 === 3) {
            YearInfo += `<span class='step30'>三連小</span>`
        }
        if (tmp30 === 4) {
            YearInfo += `<span class='step30'>四連大</span>`
        }
        return {
            Era, YearInfo, MonthPrint,
            NewmAvgScPrint, NewmAvgDecimalPrint, NewmScPrint, NewmDecimal3Print, NewmDecimal2Print, NewmDecimal1Print, NewmEquaPrint,
            SyzygyScPrint, SyzygyDecimalPrint,
            TermNamePrint, TermScPrint, TermDecimalPrint, TermAcrScPrint, TermAcrDecimalPrint, TermEquaPrint, TermMidstarPrint,
            ////////////// 以下用於日書/////////////
            LeapNumTermThis, OriginAccum,
            NewmInt, // 結尾就不切了，因爲最後一個月還要看下個月的情況
            NewmNodeAccumPrint: (Type === 1 ? [] : NewmNodeAccumPrint.slice(NewmSyzygyStart)),
            NewmAnomaAccumPrint: (Type === 1 ? [] : NewmAnomaAccumPrint.slice(NewmSyzygyStart))
        }
    }
    YearMemo[0] = AutoNewm(CalName, YearStart - 1) // 去年
    YearMemo[1] = AutoNewm(CalName, YearStart) // 今年
    const result = []
    if (YearEnd === undefined) {
        YearEnd = YearStart
    }
    for (let year = YearStart; year <= YearEnd; year++) {
        YearMemo[2] = AutoNewm(CalName, year + 1) // 明年
        result.push(calculate(year))
        YearMemo[0] = YearMemo[1] // YearMemo 数组滚动，避免重复运算
        YearMemo[1] = YearMemo[2]
    }
    return result
}