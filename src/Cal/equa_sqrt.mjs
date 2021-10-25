import { SliceNum } from './equa_math.mjs'

// 九章算術開方術。暫時有問題，比如輸入63.9
export const SqrtA = (Input, Mode) => {
    Mode = parseInt(Mode)
    if (Mode < 2 || Mode > 3) {
        throw (new Error('[開方] 請輸入2或3！'))
    }
    let c = SliceNum(Input, Mode).cString
    const z = SliceNum(Input, Mode).a
    const LenAns = z.length
    let a = 0
    let Minus = 0
    const equation2 = (x, y) => (20 * x + y) * y
    const equation3 = (x, y) => (300 * x ** 2 + 30 * x * y + y ** 2) * y
    let equation = equation2
    if (Mode === 3) {
        equation = equation3
    }
    for (let k = 0; k <= c.length; k++) {
        const f = parseInt(Minus + c[k])
        if (k === 0) {
            for (let i = 1; i <= 10; i++) {
                if (i ** Mode <= f && (i + 1) ** Mode > f) {
                    a = i
                    Minus = f - i ** Mode
                    if (Minus === 0) {
                        break
                    }
                    break
                }
            }
        } else {
            for (let b = 0; b <= 99; b++) {
                if (equation(a, b) <= f && equation(a, b + 1) > f) {
                    Minus = f - equation(a, b)
                    a = 10 * a + b
                    if (Minus === 0) {
                        break
                    }
                    break
                }
            }
        }
    }
    a = a.toString()
    const tmp1 = a.slice(0, LenAns)
    const tmp2 = a.slice(LenAns)
    let ans = parseFloat((+(tmp1.concat('.').concat(tmp2))).toPrecision(14))
    let Print = ans + ' ^ 2 = ' + parseFloat(((ans ** Mode)).toPrecision(14))
    if (Mode === 3) {
        Print = ans + ' ^ 3 = ' + parseFloat(((ans ** Mode)).toPrecision(14))
    }
    Input = +Input
    a = parseInt(a)
    if (Mode === 2) {
        if (parseFloat(((ans ** Mode)).toPrecision(14)) !== Input) {
            const r = parseFloat((Input - ans ** Mode).toPrecision(14))
            ans = parseFloat((ans + r / (2 * a)).toPrecision(14))
            Print = ans + ' ^ 2 = ' + parseFloat(((ans ** Mode)).toPrecision(14)) + ' ≒ ' + Input
            if (Mode === 3) {
                Print = ans + ' ^ 3 = ' + parseFloat(((ans ** Mode)).toPrecision(14)) + ' ≒ ' + Input
            }
        }
    }
    return {
        Print
    }
}
// console.log(SqrtA('63.8401', 2).Print)

// 累減開方術=招差開方術、級數開方數、蟬聯法
export const SqrtC = (Input, Mode) => {
    Mode = parseInt(Mode)
    if (![2, 3, 5, 7, 9].includes(Mode)) {
        throw (new Error('[開方] 請輸入2、3、5、7、9！'))
    }
    let c = SliceNum(Input, Mode).cString
    const z = SliceNum(Input, Mode).a
    const LenAns = z.length
    let a = 0
    let Minus = 0
    const equation2 = (x, y) => 20 * x + 2 * y - 1
    const equation3 = (x, y) => 3 * (10 * x + y) ** 2 - 3 * (10 * x + y) + 1
    const equation5 = (x, y) => (10 * x + y) ** 5 - (10 * x + y - 1) ** 5
    const equation7 = (x, y) => (10 * x + y) ** 7 - (10 * x + y - 1) ** 7
    const equation9 = (x, y) => (10 * x + y) ** 9 - (10 * x + y - 1) ** 9
    let equation = equation2
    if (Mode === 3) {
        equation = equation3
    } else if (Mode === 5) {
        equation = equation5
    } else if (Mode === 7) {
        equation = equation7
    } else if (Mode === 9) {
        equation = equation9
    }
    let f = parseInt(Minus + c[0])
    let b = 0
    for (let k = 0; k <= c.length; k++) {
        if (k === 0) {
            for (let i = 1; i <= 10; i++) {
                if (i ** Mode <= f && (i + 1) ** Mode > f) {
                    a = i
                    Minus = f - i ** Mode
                    if (Minus === 0) {
                        break
                    }
                    break
                }
            }
            f = parseInt(Minus + c[1])
        } else {
            let Minus = f
            b = 1
            while (Minus - equation(a, b) >= 0) {
                Minus -= equation(a, b)
                b++
            }
            a = 10 * a + b - 1
            if (Minus === 0) {
                break
            }
            f = parseInt(Minus + c[k + 1])
        }

    }
    a = a.toString()
    const tmp1 = a.slice(0, LenAns)
    const tmp2 = a.slice(LenAns)
    let ans = parseFloat((Number(tmp1.concat('.').concat(tmp2))).toPrecision(14))
    const Print = ans + ' ^ ' + Mode.toString() + ' = ' + parseFloat(((ans ** Mode)).toPrecision(14))
    return {
        Print
    }
}
// console.log(SqrtC('2.3863536599', 5).Print)