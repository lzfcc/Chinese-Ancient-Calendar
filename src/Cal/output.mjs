import CalNewm from './newm_index.mjs'
import { CalDay } from './day.mjs'
import Para from './para_calendars.mjs'

const AutoCal = year => {
    if (year < -721 || year > 1683) {
        throw (new Error('年份範圍 -721 至 1683'))
    }
    const Cals = []
    for (const [Cal, CalPara] of Object.entries(Para)) {
        const ApplyRange = CalPara.ApplyYear || [] // 兼容 ApplyRange 为空
        for (const [start, end] of ApplyRange) {
            if (year >= start && year <= end) {
                Cals.push(Cal)
                break
            }
        }
    }
    return Cals
}
// console.log (AutoCal(1150))

const PrintNewm = result => {
    const { YearInfo, MonthPrint,
        NewmAvgScPrint, NewmScPrint, NewmAvgDeciPrint, NewmDeciAcrPrint, NewmDeci3Print, NewmDeci2Print, NewmDeci1Print, NewmEquaPrint,
        SyzygyScPrint, SyzygyDeciPrint, TermNamePrint,
        TermAcrScPrint, TermAcrDeciPrint, TermScPrint, TermDeciPrint, TermEquaPrint, TermDuskstarPrint,
    } = result
    let Print = YearInfo
    Print += '\n**月** ' + MonthPrint.join(' ') + `\n`
    if (NewmScPrint.length > 0) {
        Print += '**定朔** ' + NewmScPrint.join(' ') + `\n`
        NewmDeciAcrPrint
        if (NewmDeciAcrPrint.length > 0) {
            Print += '實時 ' + NewmDeciAcrPrint.join(' ') + `\n`
        }
        if (NewmDeci3Print.length > 0) {
            Print += '三次 ' + NewmDeci3Print.join(' ') + `\n`
        }
        if (NewmDeci2Print.length > 0) {
            Print += '二次 ' + NewmDeci2Print.join(' ') + `\n`
        }
        if (NewmDeci1Print.length > 0) {
            Print += '線性 ' + NewmDeci1Print.join(' ') + `\n`
        }
        Print += '**平朔** ' + NewmAvgScPrint.join(' ') + '\n**分** ' + NewmAvgDeciPrint.join(' ') + `\n`
    } else {
        Print += '**平朔** ' + NewmAvgScPrint.join(' ') + '\n**分** ' + NewmAvgDeciPrint.join(' ') + `\n`
    }
    if ((NewmEquaPrint || []).length > 0) {
        Print += '**赤度** ' + NewmEquaPrint.join(' ') + `\n`
    }
    Print += '**望** ' + SyzygyScPrint.join(' ') + '\n**分** ' + SyzygyDeciPrint.join(' ') + '\n**中氣** ' + TermNamePrint.join(' ') + `\n`
    if (NewmDeciAcrPrint.length > 0) {
        Print += '平氣 ' + TermScPrint.join(' ') + '\n**分** ' + TermDeciPrint.join(' ') + `\n`
    } else {
        Print += '**平氣** ' + TermScPrint.join(' ') + '\n**分** ' + TermDeciPrint.join(' ') + `\n`
    }
    if (TermAcrScPrint.length > 0) {
        Print += '**定氣** ' + TermAcrScPrint.join(' ') + '\n**分** ' + TermAcrDeciPrint.join(' ') + `\n`
    }
    if ((TermDuskstarPrint || []).length > 0) {
        Print += '**氣赤**' + TermEquaPrint.join(' ') + `\n`
        Print += '**昏中** ' + TermDuskstarPrint.join(' ') + `\n`
    }
    return Print + `\n`
}

const PrintDay = result => {
    const { Era, YearGod, YearColor, MonInfo, MonColor, DayAccum, MonName, Sc, Jd, Nayin, Week, Equa, Eclp,
        Lati, Rise, Duskstar, Dial, MoonEclp, MoonEclpLati, HouName, FiveName, HexagramName, ManGod, Luck,
    } = result
    let Print = Era + `\n` + DayAccum + `\n` + YearGod + `\n` + YearColor + `\n` + MonInfo + `\n` + MonColor + `\n`
    Print += '\n**干支**\n'
    for (let i = 1; i < Sc.length; i++) {
        Print += MonName[i] + `\n`
        Print += Sc[i].slice(1).join(' ')
        Print += `\n`
    }
    Print += '\n**儒略日**\n'
    for (let i = 1; i < Jd.length; i++) {
        Print += MonName[i] + `\n`
        Print += Jd[i].slice(1).join(' ')
        Print += `\n`
    }
    Print += '\n**納音建除**\n'
    for (let i = 1; i < Nayin.length; i++) {
        Print += MonName[i] + `\n`
        Print += Nayin[i].slice(1).join(' ')
        Print += `\n`
    }
    if ((Week || []).length > 0) {
        Print += '\n**値日**\n'
        for (let i = 1; i < Week.length; i++) {
            Print += MonName[i] + `\n`
            Print += Week[i].slice(1).join(' ')
            Print += `\n`
        }
    }
    Print += '**日赤經**\n'
    for (let i = 1; i < Equa.length; i++) {
        Print += MonName[i] + `\n`
        Print += Equa[i].slice(1).join(' ')
        Print += `\n`
    }
    // if ((Equa || []).length > 0) {
    Print += '**日黃經**\n'
    for (let i = 1; i < Equa.length; i++) {
        Print += MonName[i] + `\n`
        Print += Eclp[i].slice(1).join(' ')
        Print += `\n`
    }
    // }
    // if ((Lati || []).length > 0) {
    Print += '\n**日赤緯**\n'
    for (let i = 1; i < Lati.length; i++) {
        Print += MonName[i] + `\n`
        Print += Lati[i].slice(1).join(' ')
        Print += `\n`
    }
    // }
    Print += '\n**日出**\n'
    for (let i = 1; i < Rise.length; i++) {
        Print += MonName[i] + `\n`
        Print += Rise[i].slice(1).join(' ')
        Print += `\n`
    }
    if (Duskstar) {
        Print += '\n**昏中星**\n'
        for (let i = 1; i < Duskstar.length; i++) {
            Print += MonName[i] + `\n`
            Print += Duskstar[i].slice(1).join(' ') // 一定注意，這是兩個坑
            Print += `\n`
        }
    }
    if ((Dial || []).length > 0) {
        Print += '\n**晷長**\n'
        for (let i = 1; i < Dial.length; i++) {
            Print += MonName[i] + `\n`
            Print += Dial[i].slice(1).join(' ')
            Print += `\n`
        }
    }

    if ((MoonEclp || []).length > 0) {
        Print += '**月黃經**\n'
        for (let i = 1; i < MoonEclp.length; i++) {
            Print += MonName[i] + `\n`
            Print += MoonEclp[i].slice(1).join(' ')
            Print += `\n`
        }
    }
    if ((MoonEclpLati || []).length > 0) {
        Print += '**月黃緯**\n'
        for (let i = 1; i < MoonEclpLati.length; i++) {
            Print += MonName[i] + `\n`
            Print += MoonEclpLati[i].slice(1).join(' ')
            Print += `\n`
        }
    }
    // if ((HouName || []).length > 0) {
    Print += '**候**\n'
    for (let i = 1; i < HouName.length; i++) {
        Print += MonName[i] + `\n`
        Print += HouName[i].slice(1).join(' ')
        Print += `\n`
    }
    // }
    // if ((HexagramName || []).length > 0) {
    Print += '**卦**\n'
    for (let i = 1; i < HexagramName.length; i++) {
        Print += MonName[i] + `\n`
        Print += HexagramName[i].slice(1).join(' ')
        Print += `\n`
    }
    Print += '**土王用事**\n'
    for (let i = 1; i < FiveName.length; i++) {
        Print += MonName[i] + `\n`
        Print += FiveName[i].slice(1).join(' ')
        Print += `\n`
    }
    // }
    Print += '**人神**\n'
    for (let i = 1; i < ManGod.length; i++) {
        Print += MonName[i] + `\n`
        Print += ManGod[i].slice(1).join(' ')
        Print += `\n`
    }
    if ((Luck || []).length > 0) {
        Print += '**日神**\n'
        for (let i = 1; i < Luck.length; i++) {
            Print += MonName[i] + `\n`
            Print += Luck[i].slice(1).join(' ')
            Print += `\n`
        }
    }
    return Print + `\n`
}

/**
 * 格式化字符串，用于输入文件
 * @param {*} start
 * @param {*} end
 * @param {*} isAuto
 * @param {*} list
 */
//  export const outputFile = (mode, start, end, isAuto, list) => {
//     let printData = []
//     start = ~~start
//     end = ~~end
//     if (mode === 1) { // 朔望氣
//         list.forEach(CalName => {
//             // let Year = start
//             CalNewm(CalName, start, end).forEach((result, k) => {
//                 // Year = start + k
//                 const Era = result.Era
//                 printData[k] = printData[k] || [Era]
//                 printData[k].push(PrintNewm(result))
//             })
//         })
//         if (isAuto) {
//             const overlaps = OverlapCalendars(start, end)
//             Object.entries(overlaps).forEach(([CalName, ranges]) => {
//                 for (const range of ranges) {
//                     for (let year = range[0]; year <= range[1]; year++) {
//                         const k = year - start
//                         if (printData[k][CalName]) {
//                             continue
//                         }
//                         const result = CalNewm(CalName, year)
//                         const Era = result.Era
//                         printData[k] = printData[k] || [Era]
//                         printData[k].push(PrintNewm(result))
//                     }
//                 }
//             })
//         }
//     } else {
//         list.forEach(CalName => {
//             // let Year = start
//             CalDay(CalName, start, end).forEach((result, k) => {
//                 // Year = start + k
//                 // const Era = result.Era
//                 printData[k] = printData[k] || []
//                 printData[k].push(PrintDay(result))
//             })
//         })
//     }
//     return printData
// }
export const outputFile = (mode, start, end, isAuto, listRaw) => {
    const printData = []
    start = ~~start
    end = ~~end
    if (mode === 1) { // 朔望氣
        let k = 0
        for (let Year = start; Year <= end; Year++) {
            const AutoCals = isAuto ? AutoCal(Year) : []
            let list = listRaw.concat(AutoCals)
            list = Array.from(new Set(list))
            for (let i = 0; i < list.length; i++) {
                const result = CalNewm(list[i], Year)
                const Era = result[0].Era
                printData[k] = printData[k] || [Era]
                printData[k].push(PrintNewm(result[0]))
                k++
            }
        }
    } else {
        listRaw.forEach(CalName => {
            CalDay(CalName, start, end).forEach((result, k) => {
                printData[k] = printData[k] || []
                printData[k].push(PrintDay(result))
            })
        })
    }
    return printData
}

/**
 * 格式化对象，用于前端解析
 * @param {*} start
 * @param {*} end
 * @param {*} isAuto
 * @param {*} list
 */
// export const outputNewmWeb = (start, end, isAuto, list) => {
//     const outputNewmWeb = []
//     start = ~~start
//     end = ~~end
//     list.forEach(CalName => {
//         let Year = start
//         CalNewm(CalName, start, end).forEach((result, k) => {
//             Year = start + k
//             outputNewmWeb[k] = outputNewmWeb[k] || []
//             result.id = CalName + Year // 给每个item一个唯一id在前端正确缓存高度
//             outputNewmWeb[k].push(result)
//         })
//     })
//     if (isAuto) {
//         for (let Year = start; Year <= end; Year++) {
//             const AutoCals = AutoCal(Year)
//             AutoCals.forEach(CalName => {
//                 outputNewmWeb[k].push(CalNewm(CalName, Year))
//             })
//         }
//     }
//     return outputNewmWeb
// }
export const outputNewmWeb = (start, end, isAuto, listRaw) => {
    const data = []
    start = ~~start
    end = ~~end
    listRaw = Array.isArray(listRaw) ? listRaw : [listRaw]
    listRaw = listRaw.filter(i => i && i.trim()) // 去除空字符串
    let k = 0
    for (let Year = start; Year <= end; Year++) {
        const AutoCals = isAuto ? AutoCal(Year) : []
        let list = listRaw.concat(AutoCals)
        list = Array.from(new Set(list)) // 合併重複內容        
        for (let i = 0; i < list.length; i++) {
            const result = CalNewm(list[i], Year)[0]
            result.id = list[i] + Year // 给每个item一个唯一id在前端正确缓存高度
            result.Count = list.length
            data[k] = data[k] || []
            data[k].push(result)
            k++
        }
    }
    return data
}
// console.log(outputNewmWeb(982, 984, true, []))
/**
 * 将 CalDay 输出转换成以月日维度的输出。寫了整整一個下午
 * CalDay：{
        Equa: [Array(31), Array(30),...] (length = 13)
        Duskstar: [Array(31), Array(30),...] (length = 13)
    }
    =>
    Day: [
        [
            { Equa: ..., Duskstar: ..., ... }, (1 月 1 日)
            { Equa: ..., Duskstar: ..., ... }, (1 月 2 日)
            ...
        ],
        [
            { Equa: ..., Duskstar: ..., ... }, (2 月 1 日)
            { Equa: ..., Duskstar: ..., ... }, (2 月 2 日)
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
            Day[i] = Day[i] || []
            if (Array.isArray(monthValue) && Array.isArray(monthValue[i]) && monthValue[i].length) {
                const MonthList = monthValue[i]
                MonthList.forEach((dayValue, j) => {
                    if (!dayValue) return
                    Day[i][j] = Day[i][j] || {}
                    Day[i][j][key] = dayValue
                })
            }
        }
    })
    return Day
}
export const outputDayWeb = (year, CalName) => {
    const [result] = CalDay(CalName, year)
    const { Era, YearColor, DayAccum, YearGod, MonName, MonInfo, MonColor,
        ...OtherResult
    } = result
    return {
        Era, YearColor, DayAccum, YearGod, MonName, MonInfo, MonColor,
        DayData: DayView(OtherResult)
    }
}