import { big, frc } from './para_constant.mjs'

export const OctaveCent = (a, b) => {
    let Octave = big.log2(big.div(a, b))
    const Cent = Octave.mul(1200).toNumber()
    Octave = Octave.toNumber()
    const Print = `八度値 ${Octave}
音分 ${Cent}`
    return { Print, Octave, Cent }
}

export const Frequency = a => '頻率比 ' + frc(2).pow(frc(a).div(1200)).toFraction()
// console.log(Frequency(700))

export const Pythagorean = x => {
    x = +x
    const upA = [], upB = [], downA = [], downB = [], Octave1 = [], Cent1 = [], Octave2 = [], Cent2 = []
    upA[0] = x
    upB[0] = x
    downA[0] = x
    downB[0] = x
    Octave1[0] = 0
    Cent1[0] = 0
    Octave2[0] = 0
    Cent2[0] = 0
    for (let i = 1; i <= 12; i++) {
        upA[i] = frc(upA[i - 1]).mul('3/2')
        while (upA[i] > x * 2) {
            upA[i] = upA[i].div(2)
        }
        const tmp = +upA[i].toString()
        if (x === 1) {
            upA[i] = upA[i].toFraction()
        } else {
            upA[i] = upA[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave1[i] = Func.Octave
        Cent1[i] = Func.Cent
    }
    for (let i = 1; i <= 12; i++) {
        upB[i] = frc(upB[i - 1]).mul('3/4')
        while (upB[i] < x / 2) {
            upB[i] = upB[i].mul(2)
        }
        upB[i] = upB[i].toFraction(true)
    }
    for (let i = 1; i <= 12; i++) {
        downA[i] = frc(downA[i - 1]).mul('2/3')
        while (downA[i] < x / 2) {
            downA[i] = downA[i].mul(2)
        }
        downA[i] = downA[i].toFraction(true)
    }
    for (let i = 1; i <= 12; i++) {
        downB[i] = frc(downB[i - 1]).mul('4/3')
        while (downB[i] > x * 2) {
            downB[i] = downB[i].div(2)
        }
        const tmp = +downB[i].toString()
        if (x === 1) {
            downB[i] = downB[i].toFraction()
        } else {
            downB[i] = downB[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave2[i] = Func.Octave
        Cent2[i] = Func.Cent
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
    Print1 = Print1.concat({
        title: '八度値',
        data: Octave1
    })
    Print1 = Print1.concat({
        title: '音分',
        data: Cent1
    })
    Print2 = Print2.concat({
        title: '向下A',
        data: downA
    })
    Print2 = Print2.concat({
        title: '向下B',
        data: downB
    })
    Print2 = Print2.concat({
        title: '八度値',
        data: Octave2
    })
    Print2 = Print2.concat({
        title: '音分',
        data: Cent2
    })
    return { Print1, Print2 }
}
console.log(Pythagorean(100))

export const Equal12 = a => {
    a = +a
    const List = [], List1 = [], Octave = [], Cent = []
    List[0] = a
    List1[0] = a
    Octave[0] = 0
    Cent[0] = 0
    for (let i = 1; i <= 12; i++) {
        List[i] = big(a).mul(big(2).pow(big.div(i, 12)))
        if (i === 12) {
            List1[i] = List[i].toNumber()
        } else {
            List1[i] = List[i].toFixed(24)
        }
        const Func = OctaveCent(List1[i], a)
        Octave[i] = Func.Octave
        Cent[i] = Func.Cent
    }
    let Print = []
    Print = Print.concat({
        title: '頻率',
        data: List1
    })
    Print = Print.concat({
        title: '八度値',
        data: Octave
    })
    Print = Print.concat({
        title: '音分',
        data: Cent
    })
    return Print
}
// console.log(Equal12(1))
// console.log(big(2).pow(big.div(1, 12)).toString())
// 1.059463094359295264561825294946341700779204317494185628559208431
// 1.059463094359295264561825 // 朱載堉25位大算盤
