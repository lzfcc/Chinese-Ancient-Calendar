import CalNewm from './newm_index.mjs'
import {
    CalDay
} from './day.mjs'
import {
    OverlapCalendars
} from './bind.mjs'

const PrintNewm = result => {
    const {
        YearInfo,
        MonthPrint,
        NewmAvgScPrint,
        NewmScPrint,
        NewmAvgDecimalPrint,
        NewmDecimal3Print,
        NewmDecimal2Print,
        NewmDecimal1Print,
        // NewmMmddPrint,
        NewmMansionPrint,
        SyzygyScPrint,
        SyzygyDecimalPrint,
        TermNamePrint,
        TermAcrScPrint,
        TermAcrDecimalPrint,
        TermScPrint,
        TermDecimalPrint,
        TermMidstarPrint,
    } = result
    let Print = YearInfo
    Print += '\n**月** ' + MonthPrint.join(' ') + '\n'
    if (NewmScPrint.length > 0) {
        Print += '**定朔** ' + NewmScPrint.join(' ') + '\n'
        if (NewmDecimal3Print.length > 0) {
            Print += '**三次** ' + NewmDecimal3Print.join(' ') + '\n'
        }
        if (NewmDecimal2Print.length > 0) {
            Print += '**二次** ' + NewmDecimal2Print.join(' ') + '\n'
        }
        if (NewmDecimal1Print.length > 0) {
            Print += '**線性** ' + NewmDecimal1Print.join(' ') + '\n'
        }
        Print += '**平朔** ' + NewmAvgScPrint.join(' ') + '\n**分** ' + NewmAvgDecimalPrint.join(' ') + '\n'
    } else {
        Print += '**平朔** ' + NewmAvgScPrint.join(' ') + '\n**分** ' + NewmAvgDecimalPrint.join(' ') + '\n'
    }
    if (NewmMansionPrint.length > 0) {
        Print += '**赤度** ' + NewmMansionPrint.join(' ') + '\n'
    }
    Print += '**望** ' + SyzygyScPrint.join(' ') + '\n**分** ' + SyzygyDecimalPrint.join(' ') + '\n**中氣** ' + TermNamePrint.join(' ') + '\n'
    Print += '**平氣** ' + TermScPrint.join(' ') + '\n**分** ' + TermDecimalPrint.join(' ') + '\n'
    if (TermAcrScPrint.length > 0) {
        Print += '**定氣** ' + TermAcrScPrint.join(' ') + '\n**分** ' + TermAcrDecimalPrint.join(' ') + '\n'
    }
    if (TermMidstarPrint[1] !== 0) {
        Print += '**昏中** ' + TermMidstarPrint.join(' ') + '\n'
    }
    return Print + '\n'
}

const PrintDay = result => {
    const {
        Era,
        YearGod,
        YearColor,
        MonInfo,
        MonColor,
        DayAccum,
        MonName,
        Sc,
        Jd,
        Nayin,
        Week,
        EquartorPrint,
        EclipticPrint,
        Lati,
        Sunrise,
        MidstarPrint,
        Dial,
        MoonEquartorPrint,
        MoonEclipticLati,
        HouName,
        HexagramName,
        ManGod,
        Luck,
    } = result
    let Print = Era + `\n` + DayAccum + '\n' + YearGod + `\n` + YearColor + `\n` + MonInfo + `\n` + MonColor + `\n`
    Print += '\n**干支**\n'
    for (let i = 1; i < Sc.length; i++) {
        Print += MonName[i] + '\n'
        Print += Sc[i].slice(1).join(' ')
        Print += '\n'
    }
    Print += '\n**儒略日**\n'
    for (let i = 1; i < Jd.length; i++) {
        Print += MonName[i] + '\n'
        Print += Jd[i].slice(1).join(' ')
        Print += '\n'
    }
    Print += '\n**納音建除**\n'
    for (let i = 1; i < Nayin.length; i++) {
        Print += MonName[i] + '\n'
        Print += Nayin[i].slice(1).join(' ')
        Print += '\n'
    }
    if ((Week || []).length > 0) {
        Print += '\n**値日**\n'
        for (let i = 1; i < Week.length; i++) {
            Print += MonName[i] + '\n'
            Print += Week[i].slice(1).join(' ')
            Print += '\n'
        }
    }
    Print += '**日赤經**\n'
    for (let i = 1; i < EquartorPrint.length; i++) {
        Print += MonName[i] + '\n'
        Print += EquartorPrint[i].slice(1).join(' ')
        Print += '\n'
    }
    // if ((EquartorPrint || []).length > 0) {
    Print += '**日黃經**\n'
    for (let i = 1; i < EquartorPrint.length; i++) {
        Print += MonName[i] + '\n'
        Print += EclipticPrint[i].slice(1).join(' ')
        Print += '\n'
    }
    // }
    // if ((Lati || []).length > 0) {
    Print += '\n**日赤緯**\n'
    for (let i = 1; i < Lati.length; i++) {
        Print += MonName[i] + '\n'
        Print += Lati[i].slice(1).join(' ')
        Print += '\n'
    }
    // }
    Print += '\n**日出**\n'
    for (let i = 1; i < Sunrise.length; i++) {
        Print += MonName[i] + '\n'
        Print += Sunrise[i].slice(1).join(' ')
        Print += '\n'
    }
    if (MidstarPrint) {
        Print += '\n**昏中星**\n'
        for (let i = 1; i < MidstarPrint.length; i++) {
            Print += MonName[i] + '\n'
            Print += MidstarPrint[i].slice(1).join(' ') // 一定注意，這是兩個坑
            Print += '\n'
        }
    }
    if ((Dial || []).length > 0) {
        Print += '\n**晷長**\n'
        for (let i = 1; i < Dial.length; i++) {
            Print += MonName[i] + '\n'
            Print += Dial[i].slice(1).join(' ')
            Print += '\n'
        }
    }

    if ((MoonEquartorPrint || []).length > 0) {
        Print += '**月赤經**\n'
        for (let i = 1; i < MoonEquartorPrint.length; i++) {
            Print += MonName[i] + '\n'
            Print += MoonEquartorPrint[i].slice(1).join(' ')
            Print += '\n'
        }
    }
    if ((MoonEclipticLati || []).length > 0) {
        Print += '**月黃緯**\n'
        for (let i = 1; i < MoonEclipticLati.length; i++) {
            Print += MonName[i] + '\n'
            Print += MoonEclipticLati[i].slice(1).join(' ')
            Print += '\n'
        }
    }
    // if ((HouName || []).length > 0) {
    Print += '**候**\n'
    for (let i = 1; i < HouName.length; i++) {
        Print += MonName[i] + '\n'
        Print += HouName[i].slice(1).join(' ')
        Print += '\n'
    }
    // }
    // if ((HexagramName || []).length > 0) {
    Print += '**卦、土王用事**\n'
    for (let i = 1; i < HexagramName.length; i++) {
        Print += MonName[i] + '\n'
        Print += HexagramName[i].slice(1).join(' ')
        Print += '\n'
    }
    // }
    Print += '**人神**\n'
    for (let i = 1; i < ManGod.length; i++) {
        Print += MonName[i] + '\n'
        Print += ManGod[i].slice(1).join(' ')
        Print += '\n'
    }
    if ((Luck || []).length > 0) {
        Print += '**日神**\n'
        for (let i = 1; i < Luck.length; i++) {
            Print += MonName[i] + '\n'
            Print += Luck[i].slice(1).join(' ')
            Print += '\n'
        }
    }
    return Print + '\n'
}

/**
 * 格式化字符串，用于输入文件
 * @param {*} start
 * @param {*} end
 * @param {*} auto
 * @param {*} list
 */
export const outputFile = (mode, start, end, auto, list) => {
    const printData = []
    start = parseInt(start)
    end = parseInt(end)
    if (mode === 1) { // 朔望氣
        list.forEach((CalName) => {
            let Year = start
            CalNewm(CalName, start, end).forEach((result, index) => {
                Year = start + index
                const Era = result.Era
                if (!printData[index]) {
                    printData[index] = [Era]
                }
                printData[index].push(PrintNewm(result))
            })
        })
        if (auto) {
            const overlaps = OverlapCalendars(start, end)
            Object.entries(overlaps).forEach(([CalName, ranges]) => {
                for (const range of ranges) {
                    for (let year = range[0]; year <= range[1]; year++) {
                        const index = year - start
                        if (printData[index][CalName]) {
                            continue
                        }
                        const result = CalNewm(CalName, year)
                        const Era = result.Era
                        if (!printData[index]) {
                            printData[index] = [Era]
                        }
                        printData[index].push(PrintNewm(result))
                    }
                }
            })
        }
    } else if (mode === 2) {
        list.forEach((CalName) => {
            let Year = start
            CalDay(CalName, start, end).forEach((result, index) => {
                Year = start + index
                // const Era = result.Era
                if (!printData[index]) {
                    printData[index] = []
                }
                printData[index].push(PrintDay(result))
            })
        })
    }
    return printData
}

/**
 * 格式化对象，用于前端解析
 * @param {*} start
 * @param {*} end
 * @param {*} auto
 * @param {*} list
 */
export const outputData = (start, end, auto, list) => {
    const outputData = []
    start = parseInt(start)
    end = parseInt(end)
    list.forEach((CalName) => {
        let Year = start
        CalNewm(CalName, start, end).forEach((result, index) => {
            Year = start + index
            if (!outputData[index]) {
                outputData[index] = []
            }
            // 给每个item一个唯一id在前端正确缓存高度
            result.id = CalName + Year
            outputData[index].push(result)
        })
    })
    if (auto) {
        const overlaps = OverlapCalendars(start, end)
        Object.entries(overlaps).forEach(([CalName, ranges]) => {
            for (const range of ranges) {
                for (let Year = range[0]; Year <= range[1]; Year++) {
                    const index = Year - start
                    if (outputData[index][CalName]) {
                        continue
                    }
                    if (!outputData[index]) {
                        outputData[index] = []
                    }
                    result.id = CalName + Year
                    outputData[index].push(CalNewm(CalName, Year))
                }
            }
        })
    }
    return outputData
}


/**
 * 将 CalDay 输出转换成以月日维度的输出。寫了整整一個下午
 * CalDay：{
        EquartorPrint: [Array(31), Array(30),...] (length = 13)
        MidstarPrint: [Array(31), Array(30),...] (length = 13)
    }
    =>
    Day: [
        [
            { EquartorPrint: ..., MidstarPrint: ..., ... }, (1 月 1 日)
            { EquartorPrint: ..., MidstarPrint: ..., ... }, (1 月 2 日)
            ...
        ],
        [
            { EquartorPrint: ..., MidstarPrint: ..., ... }, (2 月 1 日)
            { EquartorPrint: ..., MidstarPrint: ..., ... }, (2 月 2 日)
            ...
        ],
        ...,
        [...]
    ]
 * @param {*} CalInfo 
 * @returns 
 */
const DayView = CalInfo => {
    const Day = []
    Object.entries(CalInfo).forEach(([key, monthValue]) => {
        for (let i = 1; i < CalInfo.Sc.length; i++) {
            if (!Day[i]) {
                Day[i] = []
            }
            if (Array.isArray(monthValue) && Array.isArray(monthValue[i]) && monthValue[i].length > 0) {
                const MonthList = monthValue[i]
                MonthList.forEach((dayValue, j) => {
                    if (!dayValue) {
                        return
                    }
                    if (!Day[i][j]) {
                        Day[i][j] = {}
                    }
                    Day[i][j][key] = dayValue
                })
            }
        }
    })
    return Day
}
export const outputDayData = (year, CalName) => {
    const [result] = CalDay(CalName, year)
    const {
        Era,
        YearColor,
        DayAccum,
        YearGod,
        MonName,
        MonInfo,
        MonColor,
        ...OtherResult
    } = result
    return {
        Era,
        YearColor,
        DayAccum,
        YearGod,
        MonName,
        MonInfo,
        MonColor,
        DayData: DayView(OtherResult)
    }
}