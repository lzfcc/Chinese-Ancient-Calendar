import {
    TermList,
    ScList,
    ThreeList,
    CalNameList,
    AutoMansion,
    NumList
} from './para_constant.mjs'
import Deg2Mansion from './astronomy_deg2mansion.mjs'
import {
    AutoEclipse
} from './astronomy_eclipse.mjs'
import {
    Bind
} from './bind.mjs'

/**
 * 计算历法数据
 * @param {string} CalName 历法名称
 * @param {number} YearStart 起始年份
 * @param {number?} YearEnd 结束年份，可不加，即仅查 YearStart 一年
 */

export default (CalName, YearStart, YearEnd) => { // CalNewm
    const {
        Type,
        AutoNewm,
        AutoPara
    } = Bind(CalName)
    let isExcl = 0
    if (Type >= 4) {
        isExcl = 1
    }
    const { // 這幾個是要用到的常量
        Solar,
        SolarRaw,
        Sidereal,
        OriginAd,
        ZhangRange,
        ZhengNum,
        Denom,
        OriginMonNum,
        isTermLeap,
        WsolsticeOriginDif,
        WsolsticeConst,
        MansionConst,
        MansionRaw,
        MansionFractPosition,
        NightList,
        Node,
    } = AutoPara[CalName]
    let {
        OriginDaySc
    } = AutoPara[CalName]
    if (!OriginDaySc) {
        OriginDaySc = 0
    }
    const YearMemo = []
    const calculate = year => {
        const [mainPrev, mainThis, mainNext] = YearMemo
        const {
            EquatorDegList,
        } = AutoMansion(CalName, year)
        const ZhengOriginDif = ZhengNum - OriginMonNum
        const WsolsticeMonNum = (1 - ZhengNum + 12) % 12 // 冬至月
        let LeapNumTermThis = mainThis.LeapNumTerm
        let isLeapTPv = mainThis.isLeapPrev
        const isLeapTA = mainThis.isLeapAdvan
        let isLeapNP = mainNext.isLeapPrev
        const isLeapNA = mainNext.isLeapAdvan
        let isLeapTT = mainThis.isLeapThis
        const isLeapTPt = mainThis.isLeapPost
        const isLeapPvPt = mainPrev.isLeapPost
        const JiScOrder = mainThis.JiScOrder
        const OriginAccum = mainThis.OriginAccum
        const NewmOrderRaw = mainThis.NewmOrderRaw
        const NewmAcrOrderRaw = mainThis.NewmAcrOrderRaw
        const NewmOrderMod = mainThis.NewmOrderMod
        const NewmAvgBare = mainThis.NewmAvgBare
        const NewmAcrRaw = mainThis.NewmAcrRaw
        // const OriginYear = mainThis.OriginYear
        // const NewmTcorrThis = mainThis.NewmTcorr
        // const NewmTcorrPrev = mainPrev.NewmTcorr
        const TermAvgRaw = mainThis.TermAvgRaw
        let TermAcrRaw = mainThis.TermAcrRaw
        let NewmSyzygyStart = mainThis.NewmSyzygyStart
        let NewmSyzygyEnd = mainThis.NewmSyzygyEnd
        let TermStart = mainThis.TermStart
        let TermEnd = mainThis.TermEnd
        const AccumPrint = mainThis.AccumPrint
        let specialStart = 0
        let specialNewmSyzygyEnd = 0
        if (Type === 1) {
            if ((isTermLeap && mainNext.TermSc[1] === '') || (!isTermLeap && mainNext.TermSc[WsolsticeMonNum] === '')) {
                specialNewmSyzygyEnd = 1
                TermEnd = 1
                LeapNumTermThis = 12
                if (WsolsticeMonNum === 1) {
                    TermEnd = 0
                }
            } else if ((isTermLeap && mainThis.TermSc[1] === '') || (!isTermLeap && mainThis.TermSc[WsolsticeMonNum] === '')) {
                specialStart = 1
                LeapNumTermThis -= 1
            } // 以上解決顓頊曆15、16年，建子雨夏30、31年的極特殊情況
            NewmSyzygyStart += specialStart
            NewmSyzygyEnd += specialNewmSyzygyEnd
            TermStart += specialStart
            LeapNumTermThis -= NewmSyzygyStart
        } else {
            if (isLeapTPt) {
                NewmSyzygyEnd = 0
                TermEnd = 0
            } else if (isLeapPvPt) {
                isLeapTPv = 0
                if (ZhengOriginDif <= 0) {
                    NewmSyzygyStart = -1
                    NewmSyzygyEnd = 0
                } else {
                    NewmSyzygyStart = 0
                    NewmSyzygyEnd = 1
                }
                TermEnd = 1
                isLeapTT = 1
                LeapNumTermThis = 1
            } else if (isLeapNP && isLeapNA) {
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
        if (Type >= 2) {
            for (let i = 0; i <= 13; i++) {
                TermAvgMod[i] = ((TermAvgRaw[i]) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermName[i] = TermList[(i + ZhengOriginDif + OriginMonNum + 12) % 12]
                TermSc[i] = ScList[(TermOrderMod[i] + isExcl + OriginDaySc) % 60]
                TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                if (TermAcrRaw) {
                    TermAcrMod = ((TermAcrRaw[i]) % 60 + 60) % 60
                    TermAcrOrderMod = Math.floor(TermAcrMod)
                    TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + OriginDaySc) % 60]
                    TermAcrDecimal[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
                }
            }
            if (isLeapTT) {
                while (LeapNumTermThis >= 2 && (TermAvgRaw[LeapNumTermThis] >= NewmOrderRaw[LeapNumTermThis + 1]) && (TermAvgRaw[LeapNumTermThis] < NewmOrderRaw[LeapNumTermThis + 1] + 2.5)) { // 若不用進朔，需要把2改成3.5
                    LeapNumTermThis -= 1
                }
                while (LeapNumTermThis <= 11 && (TermAvgRaw[LeapNumTermThis + 1] < NewmOrderRaw[LeapNumTermThis + 2]) && (TermAvgRaw[LeapNumTermThis + 1] >= NewmOrderRaw[LeapNumTermThis + 2] - 2.5)) {
                    LeapNumTermThis += 1
                }
                TermName[LeapNumTermThis + 1] = '无'
                if (TermAcrRaw) {
                    TermAcrSc[LeapNumTermThis + 1] = ''
                    TermAcrDecimal[LeapNumTermThis + 1] = ''
                }
                TermSc[LeapNumTermThis + 1] = ''
                TermDecimal[LeapNumTermThis + 1] = ''
                for (let i = LeapNumTermThis + 2; i <= 13; i++) {
                    TermAvgMod[i] = ((TermAvgRaw[i - 1]) % 60 + 60) % 60
                    TermOrderMod[i] = Math.floor(TermAvgMod[i])
                    TermName[i] = TermList[(i + ZhengOriginDif + OriginMonNum + 11) % 12]
                    TermSc[i] = ScList[(TermOrderMod[i] + isExcl + OriginDaySc) % 60]
                    TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                    if (TermAcrRaw) {
                        TermAcrMod = (TermAcrRaw[i - 1] % 60 + 60) % 60
                        TermAcrOrderMod = Math.floor(TermAcrMod)
                        TermAcrSc[i] = ScList[(TermAcrOrderMod + isExcl + OriginDaySc) % 60]
                        TermAcrDecimal[i] = ((TermAcrMod - TermAcrOrderMod).toFixed(4)).slice(2, 6)
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
                if (LeapNumTermThis && (mainThis.isLeapAvgThis || specialNewmSyzygyEnd)) { // || (mainThis.isLeapAvgNext && mainThis.isAdvance)))
                    for (let i = 1; i <= 13; i++) {
                        if (i <= LeapNumTermThis) {
                            Month[i] = (i + ZhengOriginDif + 12) % 12
                            MonthName[i] = NumList[Month[i]]
                        } else if (i === LeapNumTermThis + 1) {
                            Month[i] = '氣閏'
                            MonthName[i] = Month[i]
                        } else {
                            Month[i] = (i + ZhengOriginDif + 11) % 12
                            MonthName[i] = NumList[Month[i]]
                        }
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = NumList[Month[i]]
                        }
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        Month[i] = (i + ZhengOriginDif + 12) % 12
                        MonthName[i] = NumList[Month[i]]
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = NumList[Month[i]]
                        }
                    }
                }
            } else {
                if ((mainThis.isLeapAvgFix || specialNewmSyzygyEnd) && !specialStart) {
                    for (let i = 1; i <= 13; i++) {
                        if (i <= 12) {
                            Month[i] = (i + ZhengOriginDif + 12) % 12
                            MonthName[i] = NumList[Month[i]]
                        } else {
                            Month[i] = '固閏'
                            MonthName[i] = Month[i]
                        }
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = NumList[Month[i]]
                        }
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        Month[i] = (i + ZhengOriginDif + 12) % 12
                        MonthName[i] = NumList[Month[i]]
                        if (Month[i] === 0) {
                            Month[i] = 12
                            MonthName[i] = NumList[Month[i]]
                        }
                    }
                }
            }
        } else {
            if (isLeapTT) {
                for (let i = 1; i <= 13; i++) {
                    if (i <= LeapNumTermThis) {
                        Month[i] = (i + 12) % 12
                        MonthName[i] = NumList[Month[i]]
                    } else if (i === LeapNumTermThis + 1) {
                        Month[i] = '閏' + LeapNumTermThis
                        MonthName[i] = '閏' + NumList[LeapNumTermThis]
                    } else {
                        Month[i] = (i + 11) % 12
                        MonthName[i] = NumList[Month[i]]
                    }
                    if (Month[i] === 0) {
                        Month[i] = 12
                        MonthName[i] = NumList[Month[i]]
                    }
                }
            } else {
                for (let i = 1; i <= 12; i++) {
                    Month[i] = (i + 12) % 12
                    MonthName[i] = NumList[Month[i]]
                    if (Month[i] === 0) {
                        Month[i] = 12
                        MonthName[i] = NumList[Month[i]]
                    }
                }
            }
        }
        let ZhengGreatSur = 0
        let ZhengSmallSur = 0
        if (Type === 1) {
            ZhengGreatSur = (NewmOrderMod[1 + NewmSyzygyStart] - mainThis.BuScorder + 60) % 60
            ZhengSmallSur = parseFloat(((mainThis.NewmAvgRaw[1 + NewmSyzygyStart] - NewmOrderRaw[1 + NewmSyzygyStart]) * Denom).toPrecision(5))
        } else if (Type === 2 || Type === 3) {
            ZhengGreatSur = Math.round((NewmOrderMod[1 + NewmSyzygyStart] - JiScOrder + 60) % 60)
            ZhengSmallSur = parseFloat(((mainThis.NewmAcrMod[1 + NewmSyzygyStart] - NewmOrderMod[1 + NewmSyzygyStart]) * Denom).toPrecision(5)).toFixed(2)
        } else if (Type === 4) {
            ZhengGreatSur = (NewmOrderMod[1 + NewmSyzygyStart] + 60) % 60
            ZhengSmallSur = parseFloat(((mainThis.NewmAcrMod[1 + NewmSyzygyStart] - NewmOrderMod[1 + NewmSyzygyStart]) * Denom).toPrecision(5)).toFixed(2)
        }
        ////////////下調用宿度模塊////////////////
        let NewmRaw = [] // 各月朔積日
        if (NewmAvgBare) {
            NewmRaw = NewmAvgBare
        } else {
            NewmRaw = NewmAcrRaw
        }
        if (Type === 11) {
            for (let i = 1; i <= 14; i++) {
                NewmRaw[i] -= WsolsticeConst // 下面萬一還要用這個就要注意了
                TermAcrRaw[i] -= WsolsticeConst
            }
        }
        let NewmMansion = []
        let TermMansionA = []
        let TermMansionB = []
        let TermMansion = []
        if (MansionRaw) {
            NewmMansion = Deg2Mansion(NewmRaw, (Solar ? Solar : SolarRaw), (Sidereal ? Sidereal : Solar), EquatorDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
            if (Type <= 4) {
                TermMansion = Deg2Mansion(TermAvgRaw, (Solar ? Solar : SolarRaw), (Sidereal ? Sidereal : Solar), EquatorDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
            } else {
                TermMansion = Deg2Mansion(TermAcrRaw, (Solar ? Solar : SolarRaw), (Sidereal ? Sidereal : Solar), EquatorDegList, MansionConst, MansionRaw, MansionFractPosition, NightList)
            }
        }
        if (Type === 1 && (LeapNumTermThis && (mainThis.isLeapAvgThis || specialNewmSyzygyEnd))) { // 這裏只適用於無中置閏的漢曆
            TermMansionA = TermMansion.slice(0, LeapNumTermThis + 1)
            TermMansionB = TermMansion.slice(LeapNumTermThis + 2)
            TermMansion = TermMansionA.concat('').concat(TermMansionB)
        } else if (Type >= 2 && isLeapTT) {
            TermMansionA = TermMansion.slice(0, LeapNumTermThis + 1)
            TermMansionB = TermMansion.slice(LeapNumTermThis + 1)
            TermMansion = TermMansionA.concat('').concat(TermMansionB)
        }
        ////////////下爲調整輸出////////////
        const MonthPrint = MonthName.slice(1)
        const NewmSyzygySlice = array => array.slice(1 + NewmSyzygyStart, 13 + NewmSyzygyEnd)
        const TermSlice = array => array.slice(1 + TermStart, 13 + TermEnd)
        // const MmddSlice = array => array.slice( NewmSyzygyStart, 12 + NewmSyzygyEnd)
        const NewmAvgScPrint = NewmSyzygySlice(mainThis.NewmAvgSc)
        const NewmAvgDecimalPrint = NewmSyzygySlice(mainThis.NewmAvgDecimal)
        let NewmScPrint = []
        let NewmDecimal3Print = []
        let NewmDecimal2Print = []
        let NewmDecimal1Print = []
        if (Type >= 2) {
            NewmScPrint = NewmSyzygySlice(mainThis.NewmSc)
            if (Type <= 10 && mainThis.NewmDecimal1[1] !== 'N') {
                NewmDecimal1Print = NewmSyzygySlice(mainThis.NewmDecimal1)
            } else if (Type === 11) {
                NewmDecimal3Print = NewmSyzygySlice(mainThis.NewmDecimal3)
            }
        }
        if (Type >= 5 && Type <= 10) {
            NewmDecimal2Print = NewmSyzygySlice(mainThis.NewmDecimal2)
        }
        // const NewmMmddPrint = MmddSlice(mainThis.NewmMmdd)
        let NewmMansionPrint = []
        let TermMidstarPrint = []
        if (NewmMansion) {
            const MansionResultList = NewmMansion.map(item => item.MansionResult) // [{a:1,b:2},{a:3,b:4}] 求[1,3]
            NewmMansionPrint = NewmSyzygySlice(MansionResultList) // zip
        }
        if (TermMansion) {
            const MidstarResultList = TermMansion.map(item => item.MidstarResult)
            TermMidstarPrint = TermSlice(MidstarResultList)
        }
        const SyzygyScPrint = NewmSyzygySlice(mainThis.SyzygySc)
        const SyzygyDecimalPrint = NewmSyzygySlice(mainThis.SyzygyDecimal)
        let TermNamePrint = []
        let TermScPrint = []
        let TermDecimalPrint = []
        let TermAcrScPrint = []
        let TermAcrDecimalPrint = []
        if (Type === 1) {
            TermNamePrint = TermSlice(mainThis.TermName)
            TermScPrint = TermSlice(mainThis.TermSc)
            TermDecimalPrint = TermSlice(mainThis.TermDecimal)
            if (LeapNumTermThis === 12 && specialNewmSyzygyEnd && !TermEnd) {
                TermNamePrint.push('无')
                TermScPrint.push('')
                TermDecimalPrint.push('')
            }
        } else if (Type >= 2 && Type <= 4) {
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
        ////////// 下調用交食模塊。由於隋系交食需要用月份，所以必須要切了之後才能用，傳一堆參數，很惡心
        const NewmNodeAccumPrint = NewmSyzygySlice(mainThis.NewmNodeAccum)
        const NewmAnomaAccumPrint = NewmSyzygySlice(mainThis.NewmAnomaAccum)
        const NewmDecimalPrint = NewmSyzygySlice(mainThis.NewmDecimal)
        const NewmOriginDifRawPrint = NewmSyzygySlice(mainThis.NewmOriginDifRaw)
        const SyzygyNodeAccumPrint = NewmSyzygySlice(mainThis.SyzygyNodeAccum)
        const SyzygyAnomaAccumPrint = NewmSyzygySlice(mainThis.SyzygyAnomaAccum)
        const SyzygyOriginDifRawPrint = NewmSyzygySlice(mainThis.SyzygyOriginDifRaw)
        let NewmEcli = []
        let SyzygyEcli = []
        for (let i = 0; i < MonthPrint.length; i++) { // 切了之後從0開始索引
            // 入交定日似乎宋厤另有算法，授時直接就是用定朔加減差，奇怪。
            // if (Type === 11) {
            //     const MansionRaw = parseFloat((((78.8 + AvgRaw) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(14)) // 78.8根據命起和週應而來
            // }
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
            if (NewmNodeAccumPrint[i] < 1.35 || (NewmNodeAccumPrint[i] > 12.25 && NewmNodeAccumPrint[i] < 14.96) || NewmNodeAccumPrint[i] > 28.86) {
                NewmEcliFunc = AutoEclipse(NewmNodeAccumPrint[i], NewmAnomaAccumPrint[i], NewmDecimalPrint[i], NewmOriginDifRawPrint[i], NoleapMon, LeapNumTermThis, 1, CalName)
                const Newmstatus = NewmEcliFunc.status
                let NewmMagni = 0
                let NewmStartDecimal = 0
                let NewmTotalDecimal = 0
                if (NewmEcliFunc.StartDecimal) {
                    NewmStartDecimal = NewmEcliFunc.StartDecimal.toFixed(4).slice(2, 6)
                }
                if (NewmEcliFunc.Decimal) {
                    NewmTotalDecimal = NewmEcliFunc.Decimal.toFixed(4).slice(2, 6)
                }
                if (Newmstatus) {
                    NewmMagni = NewmEcliFunc.Magni.toFixed(2)
                    NewmEcli[i] = `<span class='eclipse'>日${NoleapMon}</span>`
                    NewmEcli[i] += '分' + NewmMagni + (NewmStartDecimal ? '虧' + NewmStartDecimal : '') + (NewmTotalDecimal ? '甚' + NewmTotalDecimal : '')
                    if (Newmstatus === 1) {
                        NewmScPrint[i] += `●` // `<span class='eclipse-symbol'>●</span>`
                    } else if (Newmstatus === 2) {
                        NewmScPrint[i] += `◐` // `<span class='eclipse-symbol'>◐</span>`
                    } else if (Newmstatus === 3) {
                        NewmScPrint[i] += `◔` // `<span class='eclipse-symbol'>◔</span>` // ◍
                    }
                }
            }
            if (SyzygyNodeAccumPrint[i] < 1.35 || (SyzygyNodeAccumPrint[i] > 12.25 && SyzygyNodeAccumPrint[i] < 14.96) || SyzygyNodeAccumPrint[i] > 28.86) { // 陳美東《中國古代的月食食限及食分算法》：五紀17.8/13.36大概是1.33
                SyzygyEcliFunc = AutoEclipse(SyzygyNodeAccumPrint[i], SyzygyAnomaAccumPrint[i], SyzygyDecimalPrint[i], SyzygyOriginDifRawPrint[i], NoleapMon, LeapNumTermThis, 0, CalName)
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
                    SyzygyEcli[i] = `<span class='eclipse'>月${NoleapMon}</span>`
                    SyzygyEcli[i] += '分' + SyzygyMagni + (SyzygyStartDecimal ? '虧' + SyzygyStartDecimal + '甚' + SyzygyTotalDecimal : '')
                    if (Syzygystatus === 1) {
                        SyzygyScPrint[i] += `●` // `<span class='eclipse-symbol'>●</span>`
                    } else if (Syzygystatus === 2) {
                        SyzygyScPrint[i] += `◐` // `<span class='eclipse-symbol'>◐</span>`
                    } else if (Syzygystatus === 3) {
                        SyzygyScPrint[i] += `◔` // `<span class='eclipse-symbol'>◔</span>`
                    }
                }
            }
            SyzygyDecimalPrint[i] = SyzygyDecimalPrint[i].toFixed(4).slice(2, 6)
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
                LeapSur = mainThis.LeapSurAvgFix
            } else {
                LeapSur = mainThis.LeapSurAvgThis
            }
            if (CalName === 'Taichu') {
                YearInfo += `${ScList[mainThis.BuScorder]}統${mainThis.BuYear}${mainThis.JupiterSc}`
            } else {
                YearInfo += `${ThreeList[mainThis.JiOrder]}紀${ScList[mainThis.BuScorder]}蔀${mainThis.BuYear}`
            }
            YearInfo += `  大${ZhengGreatSur}小${ZhengSmallSur}冬至${parseFloat((mainThis.WsolsticeAccumMod).toPrecision(6)).toFixed(4)}`
            if (WsolsticeOriginDif === -45.65625) {
                YearInfo += `立春${parseFloat(((OriginAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
            } else if (WsolsticeOriginDif === -60.875) {
                YearInfo += `雨水${parseFloat(((OriginAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
            }
            YearInfo += `  閏餘${(LeapSur.toFixed(4))}`
            if (mainThis.LeapNumOriginLeapSur) {
                YearInfo += `閏${mainThis.LeapNumOriginLeapSur - NewmSyzygyStart}`
            }
        } else {
            if (JiScOrder) {
                YearInfo += `${ScList[JiScOrder]}紀${mainThis.JiYear}`
            }
            if (ZhengGreatSur || ZhengSmallSur) {
                YearInfo += ` 大餘${ZhengGreatSur}小餘${ZhengSmallSur}`
            }
            if (Type <= 10) {
                if (OriginMonNum === 2) {
                    YearInfo += `雨`
                } else {
                    YearInfo += `冬`
                }
                YearInfo += `${parseFloat(((OriginAccum % 60 + 60) % 60).toPrecision(6)).toFixed(4)}`
            }
            if (Type === 2) {
                YearInfo += `  平${mainThis.LeapSurAvgThis}定${(mainThis.LeapSurAcrThis).toFixed(2)}準${mainThis.LeapLimit}`
            } else if (Type === 3) {
                YearInfo += `  平${Math.round((mainThis.LeapSurAvgThis) * ZhangRange)}定${((mainThis.LeapSurAcrThis) * ZhangRange).toFixed(2)}準${Math.round((mainThis.LeapLimit) * ZhangRange)}`
            } else if (Type <= 7) {
                YearInfo += `  平${parseFloat((mainThis.LeapSurAvgThis).toPrecision(8))}定${(mainThis.LeapSurAcrThis).toFixed(2)}準${(mainThis.LeapLimit)}`
            } else {
                YearInfo += `  平${(mainThis.LeapSurAvgThis).toFixed(2)}定${(mainThis.LeapSurAcrThis).toFixed(2)}準${(mainThis.LeapLimit).toFixed(2)}`
            }
        }
        if (AccumPrint) {
            YearInfo += ' ' + AccumPrint
        }
        let NewmEcliPrint = []
        let SyzygyEcliPrint = []
        if ((NewmEcli || []).length > 0) {
            NewmEcliPrint = NewmEcli.join('')
            YearInfo += `\n` + NewmEcliPrint
        }
        if ((SyzygyEcli || []).length > 0) {
            SyzygyEcliPrint = `<span class='eclipse-wrap'>` + SyzygyEcli.join('') + `</span>`
            if ((NewmEcli || []).length > 0) {
                YearInfo += SyzygyEcliPrint
            } else {
                YearInfo += `\n` + SyzygyEcliPrint
            }
        }
        return {
            YearInfo,
            MonthPrint,
            NewmAvgScPrint,
            NewmAvgDecimalPrint,
            NewmScPrint,
            NewmDecimal3Print,
            NewmDecimal2Print,
            NewmDecimal1Print,
            NewmMansionPrint,
            SyzygyScPrint,
            SyzygyDecimalPrint,
            TermNamePrint,
            TermScPrint,
            TermDecimalPrint,
            TermAcrScPrint,
            TermAcrDecimalPrint,
            TermMidstarPrint,
            Era,
            ////////////// 以下用於日書/////////////
            Month,
            LeapNumTermThis,
            OriginAccum,
            NewmOrderRaw: NewmOrderRaw.slice(NewmSyzygyStart, 14 + NewmSyzygyEnd),
            NewmAcrOrderRaw: (Type === 1 ? [] : NewmAcrOrderRaw.slice(NewmSyzygyStart, 14 + NewmSyzygyEnd)),
            FirstAccum: mainThis.FirstAccum,
            ZhengOriginDif: mainThis.ZhengOriginDif,
            FirstNodeAccum: mainThis.FirstNodeAccum,
            SunDifAccum1: mainThis.SunDifAccum1
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