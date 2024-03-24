import { big, ScList, WeekList1 } from './para_constant.mjs'
/**
 * 把儒略日轉換成儒略曆或格里高利曆 ported from https://ytliu0.github.io/ChineseCalendar/Julian.js by 廖育棟
 * @param {array} Jd 儒略日
 */
export const generateTimeString = (h, m, s, ms) => {
    let hString = h.toString()
    let mString = m.toString()
    let sString = s.toString()
    if (hString.length < 2) {
        hString = '0' + hString
    }
    if (mString.length < 2) {
        mString = '0' + mString
    }
    if (sString.length < 2) {
        sString = '0' + sString
    }
    let msString = ''
    if (ms) {
        msString = ms.toString()
        if (msString.length < 2) {
            msString = '00' + msString
        } else if (msString.length < 3) {
            msString = '0' + msString
        }
        msString = '.' + msString
    }
    return hString + ':' + mString + ':' + sString + msString
}
export const Jd2Date = Jd => {
    let b = 0, c = 0, d = 0, e = 0, f = 0
    if (Jd < 2299161) { // Julian calendar
        b = 0
        c = Jd + 1524
    } else { // Gregorian calendar
        b = Math.floor((Jd - 1867216.25) / 36524.25)
        c = Jd + b - Math.floor(b / 4) + 1525
    }
    d = Math.floor((c - 122.1) / 365.25);
    if (d < 0) d++
    e = d * 365 + Math.floor(d / 4);
    f = Math.floor((c - e) / 30.6);
    if (f < 0) f++
    let mm = f - 1 - Math.floor(f / 14) * 12;
    let year = d - 4715 - Math.floor((mm + 7) / 10);
    let dd = c - e - Math.floor(f * 30.6);
    dd = Math.round(dd)
    if (dd === 0) {
        mm--
        dd = 31
    }
    const FracOfDay = Jd - Math.round(Jd) + 0.5;
    const Hour = FracOfDay * 24;
    const h = Math.floor(Hour);
    const m = Math.floor((Hour - h) * 60);
    const s = Math.floor((Hour - h - m / 60) * 3600);
    const ms = Math.floor((((Hour - h - m / 60) * 3600) - Math.floor((Hour - h - m / 60) * 3600)) * 1000);
    const ScOrder = Math.round((Math.round(Jd) % 60 + 110) % 60.1);
    return { year, mm, dd, h, m, s, ms, ScOrder } // 組成一個數組或者對象居然很耗費時間，用了0.6ms
}
// const Start = performance.now()
// console.log(Jd2Date(3460393))
// const End = performance.now()
// console.log(End - Start)
export const Jd2DatePrint = Jd => {
    const { year, mm, dd, h, m, s, ms, ScOrder } = Jd2Date(Jd)
    let yy = year
    if (year <= 0) {
        yy = Math.abs(year) + 1
        yy = '前 ' + yy;
    }
    const Week = Math.round((Math.round(Jd) % 7 + 8) % 7.1);
    const WeekName = WeekList1[Week]
    const Sc = ScList[ScOrder] + '(' + ScOrder + ')'
    return '公元 ' + year + ' 年 ' + mm + ' 月 ' + dd + ' 日 ' + generateTimeString(h, m, s, ms) + ' ｜ 星期' + WeekName + ' ｜ ' + Sc
}
export const Date2Jd = (yy, mm, dd, h, m, s, ms) => {
    yy = parseInt(yy), mm = parseInt(mm), dd = parseInt(dd), h = parseInt(h), m = parseInt(m), s = parseInt(s), ms = parseInt(ms)
    h = h || 0, m = m || 0, s = s || 0, ms = ms || 0
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
    // const Date = Frac.add(365 * yy - 679004 + b + Math.floor(30.6 * (mm + 1)) + dd + 2400001 + -.5) // Frac默認0，所以要減去半日
    const Frac = h / 24 + m / 1440 + s / 86400 + ms / 86400000
    const Date = 365 * yy - 679004 + b + Math.floor(30.600001 * (mm + 1)) + dd + 2400001 + -.5 + Frac
    return Date
}

// https://ww2.mathworks.cn/matlabcentral/fileexchange/111820-nasa-jpl-development-ephemerides-de441
// Mjday: Modified Julian Date from calendar date and time
// 
// Inputs:
// Year      Calendar date components
//  Month
//  Day
//  Hour      Time components
//  Min
// Sec
//Output:
// Modified Julian Date
//     %
//  Last modified: 2022 /09 / 24   Meysam Mahooti
//     %
//  Reference:
//  Montenbruck O., Gill E.; Satellite Orbits: Models, Methods and
// Applications; Springer Verlag, Heidelberg; Corrected 3rd Printing(2005).
// function Mjday(Year, Month, Day, Hour = 0, Minute = 0, Sec = 0) {
//     if (Month <= 2) {
//         Month += 12;
//         Year -= 1;
//     }
//     let b;
//     if (10000 * Year + 100 * Month + Day <= 15821004) {
//         // Julian calendar
//         b = -2 + Math.floor((Year + 4716) / 4) - 1179;
//     } else {
//         // Gregorian calendar
//         b = Math.floor(Year / 400) - Math.floor(Year / 100) + Math.floor(Year / 4);
//     }

//     const MjdMidnight = 365 * Year - 679004 + b + Math.floor(30.6001 * (Month + 1)) + Day;
//     const FracOfDay = (Hour + Minute / 60 + Sec / 3600) / 24;

//     const Mjd = MjdMidnight + FracOfDay;
//     return Mjd;
// }

// // 示例使用
// const mjd = Mjday(2023, 4, 12, 14, 30, 0);
// console.log(mjd);