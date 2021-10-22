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
    if (x > 16 || x < 0) {
        throw (new Error('請輸入13徽以內的數字'))
    }
    const Fret = ~~x
    const Frac = frc(x - ~~x)
    const FretList = ['1/10', '1/8', '1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '7/8', '57/64', '9/10', 1] // 0, 14是徽外，15是外外。照理說徽外是1/5處，但洞庭結果不太對，多了
    const Leng = frc(FretList[Fret]).add(Frac.mul(frc(FretList[Fret + 1]).sub(FretList[Fret])))
    return Leng.toFraction()
}

const EqualTuningSub = (OriginFrq, KnownLeng, KnownFret, UnknownFret, isGt) => { // 初始弦頻率，已知弦長，已知弦徽位，所求弦徽位，所求頻率是否高於初始弦
    let Leng = frc(KnownLeng).mul(frc(Fret2Leng(KnownFret)).div(Fret2Leng(UnknownFret)))
    if (isGt && Leng > 1) {
        Leng = Leng.div(2)
    } else if (!isGt && Leng < 1) {
        Leng = Leng.mul(2)
    }
    const Frq = frc(OriginFrq).div(Leng).toFraction(true)
    return { Leng, Frq }
}
// const { Leng: Leng, Frq:  } = EqualTuningSub(x, , , )

const EqualTuning1 = (x, TempMode) => { // 正調
    // 準法律
    const { Leng: Two1Leng, Frq: Two1 } = EqualTuningSub(x, 1, 7, 5, false)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Two1Leng, 4, 5, false)
    const { Leng: One1Leng, Frq: One1 } = EqualTuningSub(x, Four1Leng, 7, 5, false)
    const { Frq: Six1 } = EqualTuningSub(x, Four1Leng, 4, 5, true)
    const { Frq: Seven1 } = EqualTuningSub(x, Four1Leng, 5, 7, true)
    const { Frq: Three1 } = EqualTuningSub(x, One1Leng, 4, 5, false)
    // 徽法律
    const Seven2 = Seven1
    const Two2 = Two1
    const { Leng: Three2Leng, Frq: Three2 } = EqualTuningSub(x, 1, 4, 6, false)
    const { Frq: One2 } = EqualTuningSub(x, Three2Leng, 5, 4, false)
    const { Leng: Six2Leng, Frq: Six2 } = EqualTuningSub(x, Three2Leng, 5, 7, true)
    const { Frq: Four2 } = EqualTuningSub(x, Six2Leng, 5, 4, false)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[3] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[8] / 2
    const Four3 = +List1[10] / 2
    const Six3 = +List1[3]
    const Seven3 = +List1[5]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}
// console.log(EqualTuning1(1))

const EqualTuning2 = (x, TempMode) => {  // 蕤賓調
    // 準法律
    const { Leng: Three1Leng, Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Leng: Six1Leng, Frq: Six1 } = EqualTuningSub(x, Three1Leng, 2, 4, true)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Six1Leng, 5, 4, false)
    const { Frq: Two1 } = EqualTuningSub(x, Four1Leng, 5, 4, false)
    const { Frq: One1 } = EqualTuningSub(x, Six1Leng, 7, 4, false)
    const { Frq: Seven1 } = EqualTuningSub(x, Four1Leng, 5, 7, true)
    // 徽法律
    const { Leng: Three2Leng, Frq: Three2 } = EqualTuningSub(x, 1, 5, 7, false)
    const { Frq: One2 } = EqualTuningSub(x, Three2Leng, 5, 4, false)
    const { Frq: Six2 } = EqualTuningSub(x, Three2Leng, 5, 7, true)
    const { Leng: Four2Leng, Frq: Four2 } = EqualTuningSub(x, 1, 6, 5, false)
    const { Frq: Two2 } = EqualTuningSub(x, Four2Leng, 5, 4, false)
    const { Frq: Seven2 } = EqualTuningSub(x, 1, 6, 7, true)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[2] / 2
    const Two3 = +List1[4] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[9] / 2
    const Six3 = +List1[2]
    const Seven3 = +List1[4]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning3 = (x, TempMode) => {  // 慢角調
    // 準法律
    const { Leng: Two1Leng, Frq: Two1 } = EqualTuningSub(x, 1, 4, 2, false)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Two1Leng, 4, 5, false)
    const { Leng: One1Leng, Frq: One1 } = EqualTuningSub(x, Four1Leng, 4, 2, false)
    const { Frq: Six1 } = EqualTuningSub(x, One1Leng, 4, 7, true)
    const { Frq: Seven1 } = EqualTuningSub(x, Two1Leng, 4, 7, true)
    const { Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    // 徽法律
    const { Frq: Three2 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Leng: One2Leng, Frq: One2 } = EqualTuningSub(x, 1, 5, 3, false)
    const { Frq: Six2 } = EqualTuningSub(x, One2Leng, 4, 7, true)
    const { Leng: Four2Leng, Frq: Four2 } = EqualTuningSub(x, One2Leng, 5, 7, false)
    const { Frq: Two2 } = EqualTuningSub(x, Four2Leng, 5, 4, false)
    const { Frq: Seven2 } = EqualTuningSub(x, Four2Leng, 5, 7, true)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[3] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[10] / 2
    const Six3 = +List1[3]
    const Seven3 = +List1[5]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning4 = (x, TempMode) => {  // 慢宮調
    // 準法律
    const { Leng: Seven1Leng, Frq: Seven1 } = EqualTuningSub(x, 1, 4, 5, true)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Seven1Leng, 7, 5, false)
    const { Frq: Two1 } = EqualTuningSub(x, Four1Leng, 5, 4, false)
    const { Leng: Three1Leng, Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Leng: Six1Leng, Frq: Six1 } = EqualTuningSub(x, Three1Leng, 5, 4, true)
    const { Frq: One1 } = EqualTuningSub(x, Six1Leng, 7, 4, false)
    // 徽法律    
    const { Leng: Seven2Leng, Frq: Seven2 } = EqualTuningSub(x, 1, 4, 5, true)
    const { Frq: Two2 } = EqualTuningSub(x, Seven2Leng, 7, 4, false)
    const { Leng: Four2Leng, Frq: Four2 } = EqualTuningSub(x, Seven2Leng, 7, 5, false)
    const { Frq: Three2 } = EqualTuningSub(x, Four2Leng, 3, 2, false)
    const { Leng: Six2Leng, Frq: Six2 } = EqualTuningSub(x, Four2Leng, 3, 4, true)
    const { Frq: One2 } = EqualTuningSub(x, Six2Leng, 7, 4, false)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[2] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[10] / 2
    const Six3 = +List1[2]
    const Seven3 = +List1[5]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning5 = (x, TempMode) => {  // 清商調
    // 準法律
    const { Leng: Two1Leng, Frq: Two1 } = EqualTuningSub(x, 1, 7, 5, false)
    const { Leng: Three1Leng, Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Leng: Six1Leng, Frq: Six1 } = EqualTuningSub(x, Three1Leng, 5, 7, true)
    const { Frq: Four1 } = EqualTuningSub(x, Six1Leng, 5, 4, false)
    const { Frq: One1 } = EqualTuningSub(x, Six1Leng, 7, 4, false)
    const { Frq: Seven1 } = EqualTuningSub(x, 1, 3, 4, true)
    // 徽法律
    const { Frq: Three2 } = EqualTuningSub(x, 1, 5, 7, false)
    const { Leng: Four2Leng, Frq: Four2 } = EqualTuningSub(x, 1, 6, 5, false)
    const { Leng: Six2Leng, Frq: Six2 } = EqualTuningSub(x, Four2Leng, 4, 5, true)
    const { Frq: Two2 } = EqualTuningSub(x, Four2Leng, 4, 3, false)
    const { Frq: Seven2 } = EqualTuningSub(x, Four2Leng, 5, 4, true)
    const { Frq: One2 } = EqualTuningSub(x, Six2Leng, 7, 4, false)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[2] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[9] / 2
    const Six3 = +List1[2]
    const Seven3 = +List1[4]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning7 = (x, TempMode) => {  // 側商調
    // 準法律
    const { Leng: Two1Leng, Frq: Two1 } = EqualTuningSub(x, 1, 7, 5, false)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Two1Leng, 4, 5, false)
    const { Leng: One1Leng, Frq: One1 } = EqualTuningSub(x, Four1Leng, 7, 5, false)
    const { Frq: Six1 } = EqualTuningSub(x, Four1Leng, 4, 5, true)
    const { Frq: Seven1 } = EqualTuningSub(x, Four1Leng, 5, 7, true)
    const { Frq: Three1 } = EqualTuningSub(x, One1Leng, 4, 5, false)
    // 徽法律
    const { Frq: Three2 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Frq: One2 } = EqualTuningSub(x, 1, 5, 6, false)
    const { Leng: Two2Leng, Frq: Two2 } = EqualTuningSub(x, 1, 7, 5, false)
    const { Leng: Four2Leng, Frq: Four2 } = EqualTuningSub(x, Two2Leng, 3, 4, false)
    const { Frq: Six2 } = EqualTuningSub(x, Four2Leng, 4, 5, true)
    const { Frq: Seven2 } = EqualTuningSub(x, Two2Leng, 4, 7, true)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[3] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[9] / 2
    const Six3 = +List1[2]
    const Seven3 = +List1[5]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning8 = (x, TempMode) => {  // 淒涼調
    // 準法律
    const { Leng: Three1Leng, Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Frq: One1 } = EqualTuningSub(x, 1, 7, 4, false)
    const { Leng: Six1Leng, Frq: Six1 } = EqualTuningSub(x, Three1Leng, 5, 7, true)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Six1Leng, 5, 4, false)
    const { Frq: Two1 } = EqualTuningSub(x, Four1Leng, 5, 4, false)
    const { Frq: Seven1 } = EqualTuningSub(x, Four1Leng, 5, 7, true)
    // 徽法律
    const { Leng: Three2Leng, Frq: Three2 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Frq: One2 } = EqualTuningSub(x, Three2Leng, 5, 4, false)
    const { Leng: Six2Leng, Frq: Six2 } = EqualTuningSub(x, Three2Leng, 5, 7, true)
    const { Frq: Four2 } = EqualTuningSub(x, Six2Leng, 5, 4, false)
    const { Frq: Two2 } = EqualTuningSub(x, Six2Leng, 5, 6, false)
    const { Frq: Seven2 } = EqualTuningSub(x, Three2Leng, 6, 5, true)
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[2] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[9] / 2
    const Six3 = +List1[2]
    const Seven3 = +List1[4]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning9 = (x, TempMode) => {  // 無媒調
    // 準法律
    const { Leng: Two1Leng, Frq: Two1 } = EqualTuningSub(x, 1, 7, 5, false)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Two1Leng, 4, 5, false)
    const { Frq: One1 } = EqualTuningSub(x, Four1Leng, 7, 5, false)
    const { Frq: Seven1 } = EqualTuningSub(x, Four1Leng, 5, 7, true)
    const { Leng: Three1Leng, Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Frq: Six1 } = EqualTuningSub(x, Three1Leng, 5, 7, true)
    // 徽法律
    let { Leng: Three2Leng, Frq: Three2 } = EqualTuningSub(x, 1, 4, 6, false)
    const { Leng: One2Leng, Frq: One2 } = EqualTuningSub(x, Three2Leng, 5, 4, false)
    const { Leng: Four2Leng, Frq: Four2 } = EqualTuningSub(x, One2Leng, 5, 7, false)
    const { Frq: Six2 } = EqualTuningSub(x, Four2Leng, 6, 7, true)
    const { Leng: Seven2Leng, Frq: Seven2 } = EqualTuningSub(x, 1, 4, 5, true)
    const { Frq: Two2 } = EqualTuningSub(x, Seven2Leng, 7, 4, false)
    Three2 = EqualTuningSub(x, 1, 5, 4, false).Frq
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[3] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[7] / 2
    const Four3 = +List1[10] / 2
    const Six3 = +List1[2]
    const Seven3 = +List1[5]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

const EqualTuning10 = (x, TempMode) => {  // 閒弦調
    // 準法律
    const { Leng: Two1Leng, Frq: Two1 } = EqualTuningSub(x, 1, 7, 5, false)
    const { Leng: Four1Leng, Frq: Four1 } = EqualTuningSub(x, Two1Leng, 4, 5, false)
    const { Frq: Six1 } = EqualTuningSub(x, Four1Leng, 4, 5, true)
    const { Frq: Seven1 } = EqualTuningSub(x, Four1Leng, 5, 7, true)
    const { Leng: Three1Leng, Frq: Three1 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Frq: One1 } = EqualTuningSub(x, Three1Leng, 5, 4, false)
    // 徽法律
    let { Leng: Three2Leng, Frq: Three2 } = EqualTuningSub(x, 1, 5, 4, false)
    const { Leng: Seven2Leng, Frq: Seven2 } = EqualTuningSub(x, 1, 3, 4, true)
    const { Leng: One2Leng, Frq: One2 } = EqualTuningSub(x, Three2Leng, 5, 4, false)
    const { Frq: Six2 } = EqualTuningSub(x, Three2Leng, 5, 7, true)
    const { Frq: Four2 } = EqualTuningSub(x, One2Leng, 5, 7, false)
    const { Frq: Two2 } = EqualTuningSub(x, Seven2Leng, 7, 4, false)
    Three2 = EqualTuningSub(x, One2Leng, 3, 4, false).Frq
    // 新法密率
    const List1 = Equal12(x).List1
    const One3 = +List1[3] / 2
    const Two3 = +List1[5] / 2
    const Three3 = +List1[8] / 2
    const Four3 = +List1[10] / 2
    const Six3 = +List1[3]
    const Seven3 = +List1[5]
    const Print = { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 }
    let String = ''
    if (TempMode === '1') {
        String = [One1, Two1, Three1, Four1, '1', Six1, Seven1]
    } else if (TempMode === '2') {
        String = [One2, Two2, Three2, Four2, '1', Six2, Seven2]
    } else if (TempMode === '3') {
        String = [One3, Two3, Three3, Four3, '1', Six3, Seven3]
    }
    return { Print, String }
}

export const Tuning = (x, TuningMode, TempMode) => { // 輸入五弦頻率
    x = frc(Frac2FalseFrac(x).FracResult)
    // fraction的小數精度就是普通的16位，沒法保留高精度
    const Pre = eval('EqualTuning' + TuningMode)(x, TempMode)
    const { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 } = Pre.Print
    const String = Pre.String
    x = x.toFraction(true)
    const DifA1 = OctaveCent(Two1, One1).Cent.toFixed(4)
    const DifA2 = OctaveCent(Three1, Two1).Cent.toFixed(4)
    const DifA3 = OctaveCent(Four1, Three1).Cent.toFixed(4)
    const DifA4 = OctaveCent(x, Four1).Cent.toFixed(4)
    const DifA5 = OctaveCent(Six1, x).Cent.toFixed(4)
    const DifA6 = OctaveCent(Seven1, Six1).Cent.toFixed(4)
    const DifB1 = OctaveCent(Two2, One2).Cent.toFixed(4)
    const DifB2 = OctaveCent(Three2, Two2).Cent.toFixed(4)
    const DifB3 = OctaveCent(Four2, Three2).Cent.toFixed(4)
    const DifB4 = OctaveCent(x, Four2).Cent.toFixed(4)
    const DifB5 = OctaveCent(Six2, x).Cent.toFixed(4)
    const DifB6 = OctaveCent(Seven2, Six2).Cent.toFixed(4)
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
    return { Print, String }
}
// console.log(Tuning(1, 1))

const PythagoreanListA = {
    0: 'C',
    90: 'bD',
    114: '#C',
    180: 'bbE',
    204: 'D',
    294: 'bE',
    318: '#D',
    384: 'bF',
    408: 'E',
    498: 'F',
    522: '#E',
    588: 'bG',
    612: '#F',
    678: 'bbA',
    702: 'G',
    792: 'bA',
    816: '#G',
    882: 'bbB',
    906: 'A',
    996: 'bB',
    1020: '#A',
    1086: 'bC',
    1110: 'B',
    1177: 'bbD'
}

const PythagoreanListB = {
    0: '1',
    90: 'b2',
    114: '#1',
    180: 'bb3',
    204: '2',
    294: 'b3',
    318: '#2',
    384: 'b4',
    408: '3',
    498: '4',
    522: '#3',
    588: 'b5',
    612: '#4',
    678: 'bb6',
    702: '5',
    792: 'b6',
    816: '#5',
    882: 'bb7',
    906: '6',
    996: 'b7',
    1020: '#6',
    1086: 'b1',
    1110: '7',
    1177: 'bb2'
}
// console.log(PythagoreanList[1110])

const PythagoreanListC = [
    '3/2',
    '9/8',
    '27/16',
    '81/64',
    '243/128',
    '729/512',
    '2187/2048',
    '6561/4096',
    '19683/16384',
    '59049/32768',
    '177147/131072',
    '4/3',
    '16/9',
    '32/27',
    '128/81',
    '256/243',
    '1024/729',
    '4096/2187',
    '8192/6561',
    '32768/19683',
    '65536/59049',
    '262144/177147',
    '1048576/531441'
]

const JustoniListA = {
    0: 'C',
    71: '#C╤',
    112: 'bD',
    182: 'D┬',
    204: 'D',
    224: 'bbE╧',
    275: '#D',
    316: 'bE',
    386: 'E',
    427: 'bF╧',
    498: 'F',
    520: 'F┴',
    590: '#F',
    610: 'bG',
    680: 'G┬',
    702: 'G',
    773: '#G╤',
    794: '#G',
    814: 'bA',
    884: 'A',
    925: 'bbB╧',
    977: '#A╤',
    1018: 'bB',
    1088: 'B',
    1129: 'bC╧'
}

const JustoniListB = {
    0: '1',
    71: '#1╤',
    112: 'b2',
    182: '2┬',
    204: '2',
    224: 'bb3╧',
    275: '#2',
    316: 'b3',
    386: '3',
    427: 'b4╧',
    498: '4',
    520: '4┴',
    590: '#4',
    610: 'b5',
    680: '5┬',
    702: '5',
    773: '#5╤',
    794: '#5',
    814: 'b6',
    884: '6',
    925: 'bb7╧',
    977: '#6╤',
    1018: 'b7',
    1088: '7',
    1129: 'b1╧'
}

const JustoniListC = [
    '1/1',
    '25/24',
    '16/15',
    '10/9',
    '9/8',
    '256/225',
    '75/64',
    '6/5',
    '5/4',
    '32/25',
    '4/3',
    '27/20',
    '45/32',
    '64/45',
    '40/27',
    '3/2',
    '25/16',
    '405/256',
    '8/5',
    '5/3',
    '128/75',
    '225/128',
    '9/5',
    '15/8',
    '48/25'
]

// s散音，f泛音，a按音
export const Position2Pitch = (InputRaw, TuningMode, TempMode, GongMode, GongFrq, OutputMode) => { // ；調弦法；律制；宮弦；宮弦頻率；輸出模式 1 唱名 2 與宮弦頻率比 3 頻率；
    const StringList = Tuning(1, TuningMode, TempMode).String
    TuningMode = +TuningMode
    GongMode = +GongMode
    TempMode = +TempMode
    OutputMode = +OutputMode
    GongFrq = +GongFrq
    const Input = InputRaw.split(';')
    const String = [], Fret = [], AbsScale = [], RelScaleRaw = [], CentRaw = [], Cent = [], Pitch = []
    for (let i = 0; i < Input.length; i++) {
        const Pre = Input[i].split(',')
        const Type = Pre[0]
        if (Type === 'zhuang') {
            CentRaw[i] = CentRaw[i - 1] + (TempMode === 1 ? 204 : 182)
        } else {
            if (Type === 's') {
                AbsScale[i] = StringList[+Pre[1] - 1]
            } else {
                if (Type === 'f') {
                    Fret[i] = 7 - Math.abs(7 - +Pre[1]) // 泛音以7徽對稱
                    String[i] = Pre[2]
                } else if (Type === 'l') {
                    String[i] = String[i - 1]
                    Fret[i] = Pre[1]
                } else {
                    Fret[i] = Pre[0]
                    String[i] = Pre[1]
                }
                const Leng = Fret2Leng(Fret[i])
                AbsScale[i] = frc(1).div(Leng).mul(StringList[+String[i] - 1]).toFraction()
            }
            const tmp = frc(AbsScale[i]).div(StringList[GongMode - 1])
            RelScaleRaw[i] = tmp.toFraction(false)
            if (OutputMode > 1) { // 把頻率比歸到標準音高
                let TempListC = []
                if (TempMode === 1) {
                    TempListC = PythagoreanListC
                } else if (TempMode === 2) {
                    TempListC = JustoniListC
                }
                const tmp1 = RelScaleRaw[i].split('/')[0] / RelScaleRaw[i].split('/')[1]
                for (let k = 0; k < TempListC.length; k++) {
                    const tmp2 = TempListC[k].split('/')[0] / TempListC[k].split('/')[1]
                    if (tmp1 > tmp2 - 0.007 && tmp1 < tmp2 + 0.007) { // 0.007大概是11音分
                        RelScaleRaw[i] = TempListC[k]
                        break
                    }
                }

            }
            CentRaw[i] = Math.log2(Number(tmp)) * 1200
        }
        Cent[i] = (CentRaw[i] % 1200 + 1200) % 1200
        let TempList = {}
        if (TempMode === 1) {
            TempList = PythagoreanListB
        } else if (TempMode === 2) {
            TempList = JustoniListB
        }
        for (const [key] of Object.entries(TempList)) {
            if (Cent[i] > +key - 12 && Cent[i] < +key + 12) {
                Pitch[i] = TempList[key]
                break
            }
        }
        if (Type === 'zhuang') {
            Pitch[i] = '^' + Pitch[i] + Pitch[i - 1].slice(-1)
        } else if (Type === 'f') {
            Pitch[i] = '৹' + Pitch[i]
        } else if (Type === 'l') {
            Pitch[i] = '◠' + Pitch[i]
        }
        const floor = Math.floor(CentRaw[i] / 1200) // 超出一個八度
        if (floor === 2) {
            Pitch[i] = '··' + Pitch[i]
        } else if (floor === 1) {
            Pitch[i] = '·' + Pitch[i]
        } else if (floor === -1) {
            Pitch[i] += '·'
        } else if (floor === -2) {
            Pitch[i] += '··'
        }
    }
    let Print = ''
    const Frq = []
    if (OutputMode === 1) {
        for (let i = 0; i < Pitch.length; i++) {
            Print += Pitch[i] + '　'
        }
    } else if (OutputMode === 2) {
        for (let i = 0; i < RelScaleRaw.length; i++) {
            Print += RelScaleRaw[i] + '　'
        }
    } else if (OutputMode === 3) {
        for (let i = 0; i < RelScaleRaw.length; i++) {
            Frq[i] = Number(frc(RelScaleRaw[i]).mul(GongFrq)).toFixed(3)
            Print += Frq[i] + '　'
        }
    }
    return Print
}
// console.log(Position2Pitch('9.5,3;9,4;s,2;9.46,3;l,10.8;zhuang;s,4;14,1;s,2;10.8,3;l,9;l,10.8;l,9;l,7.9;s,7;10,2;l,14;s,4', '1', '2', '4', '347.654321', '3')) // 洞庭第一句
// console.log(Position2Pitch('9.46,3', '1', '1', '4', '347.654321', '2'))

