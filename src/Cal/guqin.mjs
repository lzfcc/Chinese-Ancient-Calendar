import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac } from './equa_math.mjs'

export const OctaveCent = (a, b) => {
    a = Frac2FalseFrac(a).Deci
    b = Frac2FalseFrac(b).Deci
    let Octave = big.log2(big.div(a, b))
    const Cent = Octave.mul(1200).toNumber()
    Octave = Octave.toNumber()
    const Print = `八度値 ${Octave}
音分 ${Cent}`
    return { Print, Octave, Cent }
}
// console.log(OctaveCent('4/3', 1))

export const Frequency = a => '頻率比 ' + big(2).pow(big.div(a, 1200)).toNumber()

export const Pythagorean = x => {
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
        while (upA[i] >= frc(x).mul(2)) {
            upA[i] = upA[i].div(2)
        }
        const tmp = Number(upA[i])
        if (x === '1') {
            upA[i] = upA[i].toFraction()
        } else {
            upA[i] = upA[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave1[i] = Func.Octave.toFixed(10)
        Cent1[i] = Func.Cent.toFixed(8)
    }
    for (let i = 1; i <= 12; i++) {
        upB[i] = frc(upB[i - 1]).mul('3/4')
        while (upB[i] < frc(x).div(2)) {
            upB[i] = upB[i].mul(2)
        }
        upB[i] = upB[i].toFraction(true)
    }
    for (let i = 1; i <= 12; i++) {
        downA[i] = frc(downA[i - 1]).mul('2/3')
        while (downA[i] < frc(x).div(2)) {
            downA[i] = downA[i].mul(2)
        }
        downA[i] = downA[i].toFraction(true)
    }
    for (let i = 1; i <= 12; i++) {
        downB[i] = frc(downB[i - 1]).mul('4/3')
        while (downB[i] >= frc(x).mul(2)) {
            downB[i] = downB[i].div(2)
        }
        const tmp = Number(downB[i])
        if (x === '1') {
            downB[i] = downB[i].toFraction()
        } else {
            downB[i] = downB[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave2[i] = Func.Octave.toFixed(10)
        Cent2[i] = Func.Cent.toFixed(8)
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
// console.log(Pythagorean(100))

export const Pure = x => {
    x = x.toString()
    const List1 = [], List2 = [], List3 = [], Octave1 = [], Cent1 = [], Octave2 = [], Cent2 = [], Octave3 = [], Cent3 = []
    List1[0] = x
    Octave1[0] = ''
    Cent1[0] = ''
    for (let i = 1; i <= 3; i++) {
        List1[i] = frc(List1[i - 1]).mul('3/2')
        while (List1[i] >= frc(x).mul(2)) {
            List1[i] = List1[i].div(2)
        }
        const tmp = Number(List1[i])
        if (x === '1') {
            List1[i] = List1[i].toFraction()
        } else {
            List1[i] = List1[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave1[i] = Func.Octave.toFixed(10)
        Cent1[i] = Func.Cent.toFixed(8)
    }
    for (let i = 0; i <= 3; i++) {
        List2[i] = frc(List1[i]).mul('5/4')
        while (List2[i] >= frc(x).mul(2)) {
            List2[i] = List2[i].div(2)
        }
        const tmp = Number(List2[i])
        if (x === '1') {
            List2[i] = List2[i].toFraction()
        } else {
            List2[i] = List2[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave2[i] = Func.Octave.toFixed(10)
        Cent2[i] = Func.Cent.toFixed(8)
    }
    for (let i = 0; i <= 3; i++) {
        List3[i] = frc(List1[i]).mul('6/5')
        while (List3[i] >= frc(x).mul(2)) {
            List3[i] = List3[i].div(2)
        }
        const tmp = Number(List3[i])
        if (x === '1') {
            List3[i] = List3[i].toFraction()
        } else {
            List3[i] = List3[i].toFraction(true)
        }
        const Func = OctaveCent(tmp, x)
        Octave3[i] = Func.Octave.toFixed(10)
        Cent3[i] = Func.Cent.toFixed(8)
    }
    const List = [...List1, ...List2, ...List3]
    const Octave = [...Octave1, ...Octave2, ...Octave3]
    const Cent = [...Cent1, ...Cent2, ...Cent3]
    let Print = []
    Print = Print.concat({
        title: '頻率',
        data: List
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
// console.log(Pure(1))

export const Equal12 = aRaw => {
    aRaw = aRaw.toString()
    let a = aRaw
    if (aRaw.includes('/')) {
        a = aRaw.split('/')
        a = big.div(a[0], a[1])
    }
    const List = [], List1 = [], Octave = [], Cent = []
    List[0] = aRaw
    List1[0] = aRaw
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
        Octave[i] = +Func.Octave.toFixed(12)
        Cent[i] = +Func.Cent.toFixed(12)
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
    return { Print, List1 }
}
// console.log(Equal12('1'))
// console.log(big(2).pow(big.div(1, 12)).toString())
// 1.059463094359295264561825294946341700779204317494185628559208431
// 1.059463094359295264561825 // 朱載堉25位大算盤

export const Fret2Leng = x => { // 徽位轉弦長
    x = +x
    if (x >= 15 || x <= 0) {
        throw (new Error('請輸入13徽以內的數字'))
    }
    const Fret = ~~x
    const Frac = frc(x - ~~x)
    const FretList = ['1/10', '1/8', '1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '7/8', '9/10', 1] // 吉他品的英文 0是徽外！
    const Leng = frc(FretList[Fret]).add(Frac.mul(frc(FretList[Fret + 1]).sub(FretList[Fret])))
    return Leng.toFraction()
}

export const Tuning = x => { // 輸入五弦頻率
    x = frc(Frac2FalseFrac(x).FracResult)
    // 也就是說fraction的小數精度就是普通的16位，沒法保留高精度
    // 準法律
    let Two1 = x.mul(frc(Fret2Leng(7)).div(Fret2Leng(5)))
    let Four1 = Two1.mul(frc(Fret2Leng(4)).div(Fret2Leng(5)))
    let One1 = Four1.mul(frc(Fret2Leng(7)).div(Fret2Leng(5)))
    let Six1 = Four1.mul(frc(Fret2Leng(4)).div(Fret2Leng(5)))
    let Seven1 = Four1.mul(frc(Fret2Leng(5)).div(Fret2Leng(7)))
    let Three1 = One1.mul(frc(Fret2Leng(4)).div(Fret2Leng(5)))
    Two1 = x.mul(x).div(Two1).toFraction(true)
    Four1 = x.mul(x).div(Four1).toFraction(true)
    One1 = x.mul(x).div(One1).toFraction(true)
    Six1 = x.mul(x).div(Six1).toFraction(true)
    Seven1 = x.mul(x).div(Seven1).toFraction(true)
    Three1 = x.mul(x).div(Three1).toFraction(true)
    // 徽法律
    const Seven2 = Seven1
    const Two2 = Two1
    let Three2 = x.mul(frc(Fret2Leng(4)).div(Fret2Leng(6)))
    let One2 = Three2.mul(frc(Fret2Leng(5)).div(Fret2Leng(4)))
    let Six2 = Three2.mul(frc(Fret2Leng(5)).div(Fret2Leng(7)))
    let Four2 = Six2.mul(frc(Fret2Leng(5)).div(Fret2Leng(4)))
    Three2 = x.mul(x).div(Three2).div(2).toFraction(true)
    One2 = x.mul(x).div(One2).div(2).toFraction(true)
    Six2 = x.mul(x).div(Six2).div(2).toFraction(true)
    Four2 = x.mul(x).div(Four2).div(2).toFraction(true)
    x = x.toFraction(true)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[3] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[8] / 2
    const Four3 = +List1[10] / 2
    const Six3 = +List1[3]
    const Seven3 = +List1[5]
    const DifA1 = OctaveCent(Two1, One1).Cent.toFixed(3)
    const DifA2 = OctaveCent(Three1, Two1).Cent.toFixed(3)
    const DifA3 = OctaveCent(Four1, Three1).Cent.toFixed(3)
    const DifA4 = OctaveCent(x, Four1).Cent.toFixed(3)
    const DifA5 = OctaveCent(Six1, x).Cent.toFixed(3)
    const DifA6 = OctaveCent(Seven1, Six1).Cent.toFixed(3)
    const DifB1 = OctaveCent(Two2, One2).Cent.toFixed(3)
    const DifB2 = OctaveCent(Three2, Two2).Cent.toFixed(3)
    const DifB3 = OctaveCent(Four2, Three2).Cent.toFixed(3)
    const DifB4 = OctaveCent(x, Four2).Cent.toFixed(3)
    const DifB5 = OctaveCent(Six2, x).Cent.toFixed(3)
    const DifB6 = OctaveCent(Seven2, Six2).Cent.toFixed(3)
    const DifC1 = +OctaveCent(Two3, One3).Cent.toFixed(10)
    const DifC2 = +OctaveCent(Three3, Two3).Cent.toFixed(10)
    const DifC3 = +OctaveCent(Four3, Three3).Cent.toFixed(10)
    const DifC4 = +OctaveCent(x, Four3).Cent.toFixed(10)
    const DifC5 = +OctaveCent(Six3, x).Cent.toFixed(10)
    const DifC6 = +OctaveCent(Seven3, Six3).Cent.toFixed(10)
    let Print = []
    Print = Print.concat({
        title: '一',
        data: [One1, '', One2, '', One3, '']
    })
    Print = Print.concat({
        title: '二',
        data: [Two1, DifA1, Two2, DifB1, Two3, DifC1]
    })
    Print = Print.concat({
        title: '三',
        data: [Three1, DifA2, Three2, DifB2, Three3, DifC2]
    })
    Print = Print.concat({
        title: '四',
        data: [Four1, DifA3, Four2, DifB3, Four3, DifC3]
    })
    Print = Print.concat({
        title: '五',
        data: [x, DifA4, x, DifB4, x, DifC4]
    })
    Print = Print.concat({
        title: '六',
        data: [Six1, DifA5, Six2, DifB5, Six3, DifC5]
    })
    Print = Print.concat({
        title: '七',
        data: [Seven1, DifA6, Seven2, DifB6, Seven3, DifC6]
    })
    return Print
}
// console.log(Tuning(1))