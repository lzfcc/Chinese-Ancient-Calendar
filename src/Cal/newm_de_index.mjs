import { N6 } from './newm_de.mjs'
import Para from './para_calendars.mjs'
import { TermNameList, Term1NameList, ScList, NameList, MonNumList1, } from './para_constant.mjs'
import { deltaT, deltaTErrorEstimate } from './astronomy_west.mjs'
// const Index = (YearStart, YearEnd) => {
export default (YearStart, YearEnd) => {
    const Memo = []
    const calculate = Y => {
        const [PrevYear, ThisYear] = Memo
        let { LeapNumTerm } = ThisYear
        const { NewmEqua, NewmEclp } = ThisYear
        const TermAcrSc = [], TermAcrDeci = [], TermNowDeci = [], Term1Name = [], Term1Equa = [], Term1Eclp = [], Term1AcrSc = [], Term1AcrDeci = [], Term1NowDeci = []
        let TermName = [], TermEqua = [], TermEclp = [],
            NewmStart = 0
        let NewmEnd = LeapNumTerm ? 1 : 0
        let TermEnd = NewmEnd
        if (PrevYear.LeapNumTerm) {
            LeapNumTerm = 0 // 可能出現去年不閏而閏，於是今年正月和去年十二月重疊
            if ((PrevYear.NewmSc[13]) === ThisYear.NewmSc[1]) {
                NewmStart = 1
                NewmEnd = 1
                TermEnd = 0
            }
        }
        let TermStart = 0
        // 調整節氣
        for (let i = 1; i <= 13; i++) {
            TermName[i] = TermNameList[(i + 2) % 12]
            Term1Name[i] = Term1NameList[(i + 2) % 12]
            if (ThisYear.TermAcrSc) {
                TermAcrSc[i] = ThisYear.TermAcrSc[i]
                TermAcrDeci[i] = ThisYear.TermAcrDeci[i]
                Term1AcrSc[i] = ThisYear.Term1AcrSc[i]
                Term1AcrDeci[i] = ThisYear.Term1AcrDeci[i]
            }
            if (ThisYear.TermNowDeci) {
                TermNowDeci[i] = ThisYear.TermNowDeci[i]
                Term1NowDeci[i] = ThisYear.Term1NowDeci[i]
            }
            if (ThisYear.TermEqua) {
                TermEqua[i] = ThisYear.TermEqua[i]
                Term1Equa[i] = ThisYear.Term1Equa[i]
            }
            if (ThisYear.TermEclp) {
                TermEclp[i] = ThisYear.TermEclp[i]
                Term1Eclp[i] = ThisYear.Term1Eclp[i]
            }
        }
        if (LeapNumTerm) {
            TermName[LeapNumTerm + 1] = '无中'
            TermAcrSc[LeapNumTerm + 1] = ''
            TermAcrDeci[LeapNumTerm + 1] = ''
            TermNowDeci[LeapNumTerm + 1] = ''
            TermEqua[LeapNumTerm + 1] = ''
            TermEclp[LeapNumTerm + 1] = ''
            for (let i = LeapNumTerm + 2; i <= 13; i++) {
                TermName[i] = Term1NameList[(i + 2) % 12]
                // 上下互換位置
                Term1Name[i] = TermNameList[(i + 1) % 12]
                if (ThisYear.Term1AcrSc) {
                    TermAcrSc[i] = ThisYear.Term1AcrSc[i]
                    TermAcrDeci[i] = ThisYear.Term1AcrDeci[i]
                    Term1AcrSc[i] = ThisYear.TermAcrSc[i - 1]
                    Term1AcrDeci[i] = ThisYear.TermAcrDeci[i - 1]
                }
                if (ThisYear.TermNowDeci) {
                    TermNowDeci[i] = ThisYear.Term1NowDeci[i]
                    Term1NowDeci[i] = ThisYear.TermNowDeci[i - 1]
                }
                if (ThisYear.TermEqua) {
                    TermEqua[i] = ThisYear.Term1Equa[i]
                    Term1Equa[i] = ThisYear.TermEqua[i - 1]
                }
                if (ThisYear.TermEclp) {
                    TermEclp[i] = ThisYear.Term1Eclp[i]
                    Term1Eclp[i] = ThisYear.TermEclp[i - 1]
                }
            }
        }
        if (PrevYear.LeapNumTerm) {
            Term1Name[1] = '无節'
            Term1AcrSc[1] = ''
            Term1AcrDeci[1] = ''
            if (ThisYear.Term1NowDeci) Term1NowDeci[1] = ''
            if (ThisYear.Term1Equa) Term1Equa[1] = ''
            if (ThisYear.Term1Eclp) Term1Eclp[1] = ''
        }
        // 月序
        const MonthName = []
        let MonNumList = MonNumList1
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
        const NewmSlice = array => array.slice(1 + NewmStart, 13 + NewmEnd)
        const TermSlice = array => array.slice(1 + TermStart, 13 + TermEnd)
        ////////////下爲調整輸出////////////
        const MonthPrint = MonthName.slice(1)
        let NewmScPrint = [], NewmDeciUT18Print = []
        NewmScPrint = NewmSlice(ThisYear.NewmSc)
        NewmDeciUT18Print = NewmSlice(ThisYear.NewmDeci)
        const NewmEquaPrint = NewmEqua ? NewmSlice(NewmEqua) : undefined
        const NewmEclpPrint = NewmEclp ? NewmSlice(NewmEclp) : undefined
        const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc)
        const SyzygyDeciPrint = NewmSlice(ThisYear.SyzygyDeci)
        let TermNamePrint = [], TermAcrScPrint = [], TermAcrDeciPrint = [], TermNowDeciPrint = [], TermEquaPrint = [], TermEclpPrint = [], Term1NamePrint = [], Term1EquaPrint = [], Term1EclpPrint = [], Term1AcrDeciPrint = [], Term1NowDeciPrint = [], Term1AcrScPrint = []
        TermNamePrint = TermSlice(TermName)
        Term1NamePrint = Term1Name[2] ? TermSlice(Term1Name) : []
        TermAcrScPrint = TermSlice(TermAcrSc)
        TermAcrDeciPrint = TermSlice(TermAcrDeci)
        Term1AcrScPrint = TermSlice(Term1AcrSc)
        Term1AcrDeciPrint = TermSlice(Term1AcrDeci)
        if (TermNowDeci[2]) {
            TermNowDeciPrint = TermSlice(TermNowDeci)
            Term1NowDeciPrint = TermSlice(Term1NowDeci)
        }
        TermEquaPrint = TermEqua[2] ? TermSlice(TermEqua) : undefined
        Term1EquaPrint = Term1Equa[2] ? TermSlice(Term1Equa) : undefined
        TermEclpPrint = TermEclp[2] ? TermSlice(TermEclp) : undefined
        Term1EclpPrint = Term1Eclp[2] ? TermSlice(Term1Eclp) : undefined

        const YearSc = ScList[((Y - 3) % 60 + 60) % 60]
        let Era = Y
        if (Y > 0) Era = `公元 ${Y} 年 ${YearSc}`
        else Era = `公元前 ${1 - Y} 年 ${YearSc}`
        let YearInfo = `<span class='cal-name'>DE440/1</span> 距曆元${Y - 2000}年 `
        YearInfo += ' ΔT = ' + ~~(deltaT(ThisYear.NewmJd[5]) * 86400) + ' ± ' + deltaTErrorEstimate(Y)[0] + ' 秒'
        return {
            Era, YearInfo, MonthPrint,
            NewmScPrint, NewmDeciUT18Print, NewmEclpPrint, NewmEquaPrint,
            SyzygyScPrint, SyzygyDeciPrint,
            Term1NamePrint, Term1AcrScPrint, Term1AcrDeciPrint, Term1NowDeciPrint, Term1EclpPrint, Term1EquaPrint,
            TermNamePrint, TermAcrScPrint, TermAcrDeciPrint, TermNowDeciPrint, TermEclpPrint, TermEquaPrint,
        }
    }
    Memo[0] = N6(YearStart - 1) // 去年
    Memo[1] = N6(YearStart) // 今年
    const result = []
    YearEnd = YearEnd === undefined ? YearStart : YearEnd
    for (let Y = YearStart; Y <= YearEnd; Y++) {
        Memo[2] = N6(Y + 1) // 明年
        result.push(calculate(Y))
        Memo[0] = Memo[1] // 数组滚动，避免重复运算
        Memo[1] = Memo[2]
    }
    return result
}
// console.log(Index('DE441', 2020, 2020))
