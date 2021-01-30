const fs = require('fs')
const {
    SClist
} = require('./constant')
const {
    calculate
} = require('./index')

function PrintTxt(CalPre, year) {
    const {
        YearInfo,
        MonthPrint,
        FirstSCPrint,
        FirstDecimalPrint,
        SyzygySCPrint,
        SyzygyDecimalPrint,
        TermSCPrint,
        TermDecimalPrint,
    } = calculate(CalPre, year)
    return YearInfo + `
**月** ${MonthPrint.join(' ')}
**朔** ${FirstSCPrint.join(' ')}
**分** ${FirstDecimalPrint.join(' ')}
**望** ${SyzygySCPrint.join(' ')}
**分** ${SyzygyDecimalPrint.join(' ')}
**中** ${TermSCPrint.join(' ')}
**分** ${TermDecimalPrint.join(' ')}
`
}

const FilePath = './output.md'

function main(start, end) {
    if (fs.existsSync(FilePath)) {
        fs.unlinkSync(FilePath);
    }
    for (let year = start; year <= end; year++) {
        const YearSC = SClist[((year - 3) % 60 + 60) % 60]
        let AnnoDomini
        if (year > 0) {
            AnnoDomini = ('   \n**公元 ' + year + ' 年** ' + YearSC + ' —————————————————————————   \n')
        } else {
            AnnoDomini = ('   \n**公元前 ' + Math.abs(year - 1) + ' 年** ' + YearSC + ' ————————————————————————— \n')
        }
        fs.appendFileSync(FilePath, AnnoDomini);
        [
            // 'Yin',
            // 'Zhou',
            // 'Huangdi',
            // 'Lu',
            // 'XiaA',
            // 'XiaB',
            // 'Zhuanxu',
            // 'Santong',
            // 'Qian',
            // 'EastHan',
            'Shoushi',
            // 'ShouAcr'
        ].forEach(function (CalPre) {
            fs.appendFileSync(FilePath, PrintTxt(CalPre, year))
        })
    }
}
main(1365, 1367) // 注意，-1000年爲公元前1001年，因爲沒有公元0年