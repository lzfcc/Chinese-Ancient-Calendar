var CalAncient = require('./ancient_algorithm')
var CalShoushi = require('./shoushi_algorithm')

exports.calculate = function (CalPre, year) {
    if (CalPre == 'Shoushi' || CalPre == 'ShouAcrt') {
        var binder = CalShoushi(CalPre, year)
    } else {
        var binder = CalAncient(CalPre, year)
    }
    return binder
}