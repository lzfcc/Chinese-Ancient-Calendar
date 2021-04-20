import {
    big,
    ScList
} from './para_constant.mjs'

/**
 * 把儒略日轉換成儒略曆或格里高利曆 ported from https://ytliu0.github.io/ChineseCalendar/Julian.js by 廖育棟
 * @param {array} Jd 儒略日
 */

// const Jd2Date = Jd => {
//     if (!Array.isArray(Jd)) {
//         Jd = [Jd]
//     }
//     return Jd.map((a) => {
//         let b = 0
//         let c = 0
//         let d = 0
//         let e = 0
//         let f = 0
//         if (a < 2299161) { // Julian calendar
//             b = 0
//             c = a + 1524
//         } else { // Gregorian calendar
//             b = Math.floor((a - 1867216.25) / 36524.25)
//             c = a + b - Math.floor(0.25 * b) + 1525
//         }
//         d = Math.floor((c - 122.1) / 365.25)
//         if (d < 0) {
//             d++
//         }
//         e = 365 * d + Math.floor(0.25 * d)
//         f = Math.floor((c - e) / 30.6000001)
//         if (f < 0) {
//             f++
//         }
//         const dd = c - e - Math.floor(30.6000001 * f)
//         const mm = f - 1 - 12 * Math.floor(f / 14 + 0.0000001)
//         return `${mm}-${dd}`
//     })
// }

export const Jd2Date1 = Jd => {
    Jd = big(Jd)
    let b = 0
    let c = 0
    let d = 0
    let e = 0
    let f = 0
    if (Jd.lt(2299161)) { // Julian calendar
        b = 0
        c = Jd.add(1524)
    } else { // Gregorian calendar
        b = (Jd.sub(1867216.25)).div(36524.25).floor()
        c = Jd.add(b).sub(big.floor(b.div(4))).add(1525)
    }
    d = big.floor((c.sub(122.1)).div(365.25))
    if (d.lt(0)) {
        d = d.add(1)
    }
    e = d.mul(365).add(big.floor(d.div(4)))
    f = big.floor((c.sub(e)).div(30.6))
    if (f.lt(0)) {
        f = f.add(1)
    }
    let mm = f.sub(1).sub(big.floor(f.div(14)).mul(12))
    let year = d.sub(4715).sub(big.floor((mm.add(7).div(10)))).toNumber()
    if (year <= 0) {
        year = Math.abs(year)
        year = '前 ' + year
    }
    let dd = c.sub(e).sub(big.floor(f.mul(30.6)))
    const FracOfDay = Jd.sub(big.round(Jd)).add(0.5)
    const Hour = FracOfDay.mul(24)
    const h = big.floor(Hour)
    const m = big.floor((Hour.sub(h).mul(60)))
    const s = big.floor((Hour.sub(h).sub(m.div(60))).mul(3600))
    const ms = big.floor(((Hour.sub(h).sub(m.div(60))).mul(3600).sub(Math.floor((Hour.sub(h).sub(m.div(60))).mul(3600)))).mul(1000))
    const ScOrder = Math.round((Math.round(Jd) % 60 + 110) % 60.1)
    Jd = Jd.toNumber()
    const Week = Math.round((Math.round(Jd) % 7 + 8) % 7.1)
    const Sc = ScList[ScOrder] + '(' + ScOrder + ')'

    function generateTimeString(h, m, s, ms) {
        let hString = h.toString()
        let mString = m.toString()
        let sString = s.toString()
        let msString = ms.toString()
        if (hString.length < 2) {
            hString = '0' + hString
        }
        if (mString.length < 2) {
            mString = '0' + mString
        }
        if (sString.length < 2) {
            sString = '0' + sString
        }
        if (msString.length < 2) {
            msString = '00' + msString
        } else if (msString.length < 3) {
            msString = '0' + msString
        }
        return hString + ':' + mString + ':' + sString + ':' + msString
    }
    mm = mm.toNumber()
    dd = dd.round().toNumber()
    if (dd === 0) {
        mm--
        dd = 31        
    }
    const Result = '公元 ' + year + ' 年 ' + mm + ' 月 ' + dd + ' 日 ' + generateTimeString(h, m, s, ms) + ' ｜ 星期 ' + Week + ' ｜ ' + Sc
    const Mmdd = mm + '.' + dd
    return {
        Result,
        Mmdd
    }
}

export const Date2Jd = (yy, mm, dd, h, m, s, ms) => {
    yy = Number(yy)
    mm = Number(mm)
    dd = Number(dd)
    // h = new Decimal(h)
    // m = new Decimal(m)
    // s = new Decimal(s)
    h = Number(h)
    m = Number(m)
    s = Number(s)
    ms = Number(ms)
    if (mm > 12 || dd > 31 || h > 23 || s > 59 || ms > 999) {
        throw (new Error('invalid value!'))
    } else if (mm <= 0 || dd <= 0 || h < 0 || s < 0 || ms < 0) {
        throw (new Error('invalid value!'))
    }
    if (mm <= 2) {
        mm += 12
        yy--
    }
    let b = 0
    if (10000 * yy + 100 * mm + dd <= 15821004) { // Julian calendar
        b = -2 + Math.floor((yy + 4716) / 4) - 1179
    } else { // Gregorian calendar
        b = Math.floor(yy / 400) - Math.floor(yy / 100) + Math.floor(yy / 4)
    }
    // const Frac = h.div(24) + m.div(1440) + s.div(86400) + ms.div(86400000)
    // const Date = Frac.add(365 * yy - 679004 + b + Math.floor(30.6 * (mm + 1)) + dd + 2400001 + -0.5) // Frac默認0，所以要減去半日
    const Frac = h / 24 + m / 1440 + s / 86400 + ms / 86400000
    const Date = 365 * yy - 679004 + b + Math.floor(30.6 * (mm + 1)) + dd + 2400001 + -0.5 + Frac
    const Result = 'Julian date ' + Date
    return {
        Result
    }
}