import {
    ScList,
    StemList,
    BranchList,
    StemList1,
    BranchList1
} from './para_constant.mjs'

export const EraConvert = year => {
    year = Number(year)
    const YearScOrder = ((year - 3) % 60 + 60) % 60
    const YearSc = ScList[YearScOrder]
    const YearStem = StemList.indexOf(YearSc[0])
    const YearBranch = BranchList.indexOf(YearSc[1])
    let Era = ''
    if (year > 0) {
        Era = year + ' 年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
    } else {
        Era = '前 ' + (1 - year) + ' 年歲次' + YearSc + StemList1[YearStem] + BranchList1[YearBranch]
    }
    return Era
}

export const YearScConvert = Sc => {
    const a = ScList.indexOf(Sc)
    const year = []
    year[0] = a + 2643
    let i = 0
    while (i < 85) {
        year[i + 1] = year[i] - 60
        i++
        if (year[i - 1] > 0 && year[i] <= 0) {
            year[i] = `\n` + year[i]
        } else {
            year[i] = '　' + year[i]
        }

    }
    return year
}
// console.log(EraConvert(2021))
// console.log(YearScConvert('庚子'))