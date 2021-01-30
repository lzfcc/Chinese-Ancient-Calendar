var fs = require('fs')
var CalAncient = require('./ancient_algorithm')
var CalShoushi = require('./shoushi_algorithm')
var {
    SClist
} = require('./constant')

function PrintTxt(CalPre, year) {
    if (CalPre == 'Shoushi' || CalPre == 'ShouAcrt') {
        var binder = CalShoushi(CalPre, year)
    } else {
        var binder = CalAncient(CalPre, year)
    }
    var {
        YearInfo,
        MonthPrint,
        FirstSCPrint,
        FirstDecimalPrint,
        SyzygySCPrint,
        SyzygyDecimalPrint,
        TermSCPrint,
        TermDecimalPrint,
    } = binder
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

function main(start, end) {
    if (fs.existsSync('output.md')) {
        fs.unlinkSync('output.md');
    }
    for (var year = start; year <= end; year++) {
        var YearSC = SClist[((year - 3) % 60 + 60) % 60]
        if (year > 0) {
            var AnnoDomini = ('   \n**公元 ' + year + ' 年** ' + YearSC + ' —————————————————————————   \n')
        } else {
            var AnnoDomini = ('   \n**公元前 ' + Math.abs(year - 1) + ' 年** ' + YearSC + ' ————————————————————————— \n')
        }
        fs.appendFileSync('output.md', AnnoDomini);
        [
            // 'Yin',
            // 'Zhou',
            // 'Huangdi',
            // 'Lu',
            // 'XiaA',
            // 'XiaB',
            'Zhuanxu',
            // 'Santong',
            // 'Qian',
            // 'EastHan',
            // 'Shoushi',
            // 'ShouAcr'
        ].forEach(function (CalPre) {
            fs.appendFileSync('output.md', PrintTxt(CalPre, year))
        })
    }
}
main(-364, -300) // 注意，-1000年爲公元前1001年，因爲沒有公元0年