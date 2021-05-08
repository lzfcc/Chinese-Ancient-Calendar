import {
    IndetermEqua
} from './modulo_origin.mjs'

// 暴力求日法
export const ExhauDenom = (lower, upper, End) => {
    End = parseInt(End)
    if (End !== 1 && End !== 10 && End !== 100 && End !== 1000) {
        throw (new Error('請輸入 1, 10, 100, 1000'))
    }
    lower = +lower
    upper = +upper
    if (lower > upper) {
        throw (new Error('lower > upper !'))
    }
    let i = 500
    let Denom = ''
    while (i < 40000) {
        const LunarFrac = IndetermEqua(49, 17, i).LunarFrac1
        const Lunar = LunarFrac / i
        if (Lunar > lower && Lunar < upper && (i / End === ~~(i / End))) {
            Denom += LunarFrac + '/' + i + ', '
        }
        i++
    }
    return Denom
}

// 暴力求上元演紀
export const ExhauOrigin = (SolarRaw, LunarNumer, Denom, OriginLower, OriginUpper, FirstLower, FirstUpper) => {
    // 會天1256年中冬至癸丑卯正初刻
    const SolarNumer = Math.round(+('0.' + SolarRaw) * Denom)
    const Solar = SolarNumer / Denom + 365
    LunarNumer = +LunarNumer
    Denom = +Denom
    OriginLower = +OriginLower
    OriginUpper = +OriginUpper
    FirstLower = +FirstLower
    FirstUpper = +FirstUpper

    const Lunar = 29 + LunarNumer / Denom
    let i = 100000
    let year = ''
    let OriginAccum = 0
    let FirstAccum = 0
    while (i < 100000000) {
        OriginAccum = i * Solar
        FirstAccum = (OriginAccum - OriginAccum % Lunar) % 60
        OriginAccum %= 60
        if (OriginAccum > OriginLower && OriginAccum < OriginUpper) {
            if (FirstAccum > FirstLower && FirstAccum < FirstUpper) {
                year += i + ', '
            }
        }
        i++
    }
    if (year === '') {
        return '沒有符合條件的上元'
    }
    return '該年積年 ' + year + '歲實 365+' + SolarNumer + '/' + Denom
}

export const ExhauConst = (SolarNumer, Denom, year, x, Range, lower, upper) => {
    SolarNumer = +SolarNumer
    Denom = parseInt(Denom)
    year = parseInt(year)
    const Solar = 365 + SolarNumer / Denom
    const OriginAccum = year * Solar
    x = String(x)
    const x1 = +('0.' + x.split('.')[1])
    const FracInt = ~~(Denom * x1)
    const Int = +(x.split('.')[0])
    x = +x
    Range = +Range
    lower = +lower
    upper = +upper
    let result = ''
    for (let i = 1; i <= 20000; i++) {
        const Anoma = Int + (FracInt + i * 0.0001) / Denom
        const c = OriginAccum % Anoma
        if (c > lower && c < upper) {
            if (Anoma > x - Range && Anoma < x + Range) {
                result += Int + '+' + (FracInt + i * 0.0001).toFixed(4) + '/' + Denom + ' ≒ ' + (Int + (FracInt + i * 0.0001).toFixed(4) / Denom).toFixed(7) + ' 入日' + (OriginAccum % (Int + (FracInt + i * 0.0001) / Denom)).toFixed(4) + `\n`
            }
        }
    }
    if (result === '') {
        return '沒有符合條件的參數'
    }
    result = '冬至積日' + OriginAccum.toFixed(4) + `\n` + result
    return result
}
// console.log(ExhauConst(2364, 9740, 75638987, 27.21222, 0.00005, 24.798, 24.8))