import { big, frc } from './para_constant.mjs'

const log2 = x => {
    const y = big.log2(x) // f(1.5) = 0.5849625007211562，big和自帶Math完全一致
    return y.toNumber()
}
// console.log(log2(6))

export const Pythagorean = x => {
    x = +x
    const upA = [], upA1 = [], upB = [], upB1 = [], downA = [], downA1 = [], downB = [], downB1 = []
    upA[0] = x
    upA1[0] = x
    upB[0] = x
    upB1[0] = x
    downA[0] = x
    downA1[0] = x
    downB[0] = x
    downB1[0] = x
    for (let i = 1; i <= 12; i++) {
        upA[i] = frc(upA[i - 1]).mul('3/2')
        while (upA[i] > x * 2) {
            upA[i] = upA[i].div(2)
        }
        if (x === 1) {
            upA[i] = upA[i].toFraction()
        } else {
            upA[i] = upA[i].toFraction(true)
        }
        upA1[i] = upA[i]
    }
    for (let i = 1; i <= 12; i++) {
        upB[i] = frc(upB[i - 1]).mul('3/4')
        while (upB[i] < x / 2) {
            upB[i] = upB[i].mul(2)
        }
        upB[i] = upB[i].toFraction(true)
        upB1[i] = ' ' + upB[i]
    }
    for (let i = 1; i <= 12; i++) {
        downA[i] = frc(downA[i - 1]).mul('2/3')
        while (downA[i] < x / 2) {
            downA[i] = downA[i].mul(2)
        }
        downA[i] = downA[i].toFraction(true)
        downA1[i] = ' ' + downA[i]
    }
    for (let i = 1; i <= 12; i++) {
        downB[i] = frc(downB[i - 1]).mul('4/3')
        while (downB[i] > x * 2) {
            downB[i] = downB[i].div(2)
        }
        if (x === 1) {
            downB[i] = downB[i].toFraction()
        } else {
            downB[i] = downB[i].toFraction(true)
        }
        downB1[i] = ' ' + downB[i]
    }
    let Print1 = [], Print2 = []
    Print1 = Print1.concat({
        title: '向上A',
        data: upA
    })
    Print1 = Print1.concat({
        title: '向上B',
        data: upB
    })
    Print2 = Print2.concat({
        title: '向下A',
        data: downA
    })
    Print2 = Print2.concat({
        title: '向下B',
        data: downB
    })
    return { Print1, Print2 }
}
// console.log(Pythagorean(100))

export const Cent = (a, b) => {
    const Octave = big.log2(big.div(a, b))
    const Cent = Octave.mul(1200)
    return `八度値 ${Octave.toNumber()}
音分 ${Cent.toNumber()}`
}

export const Frequency = a => '頻率比 ' + frc(2).pow(frc(a).div(1200)).toFraction()
// console.log(Frequency(700))