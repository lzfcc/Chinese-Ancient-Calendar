import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac } from './equa_math.mjs'

export const OctaveCent = (a, b) => { // 兩個要比較的頻率
    a = Frac2FalseFrac(a).Deci
    b = Frac2FalseFrac(b).Deci
    const Octave = Math.log2(a / b)
    const Cent = Octave * 1200
    const Print = `八度値 ${Octave}
音分 ${Cent}`
    return { Print, Octave, Cent }
}
// console.log(OctaveCent('4/3', 1))

export const Frequency = a => '頻率比 ' + 2 ** (a / 1200)

const FretListA = [0, '1/8', '1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '7/8', 1]
const FretList = ['1/9', '1/8', '1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '7/8', '8/9', '9/10', 1] // 0, 14是徽外13.111(大全音)，15是外外13.2（小全音）。五度律的三個徽外：8/9（大全音204）, 243/256（90音分13.492）, 2048/2187（82音分13.594）

export const Fret2LengPrint = x => { // 徽位轉弦長. 支持 13.111，13 1/9，118/9
    if (Math.floor(+x) === +x) {
        return FretList[+x]
    }
    x = frc(x).simplify()
    if (x.compare(14) >= 0 || x.compare(0) < 0) {
        throw (new Error('請輸入13徽以內的數字'))
    }
    const Fret = x.floor()
    const Frac = x.sub(Fret)
    const Leng = frc(FretListA[Fret]).add(Frac.mul(frc(FretListA[Fret + 1]).sub(FretListA[Fret])))
    return Leng.toFraction()
}
// console.log(Fret2Leng('13.111'))

const Fret2Leng = x => { // 徽位轉弦長 支持 13.111，13 1/9，118/9
    x = +x
    if (Math.floor(x) === x) {
        if (x === -1) {
            return '1/10' // 15徽泛音以7徽對稱就變成了-1
        }
        return FretList[x]
    }
    const Fret = ~~x
    const Frac = frc(x - ~~x)
    const Leng = frc(FretList[Fret]).add(Frac.mul(frc(FretList[Fret + 1]).sub(FretList[Fret])))
    return Leng.toFraction()
}
// console.log(Fret2Leng('0'))

export const Leng2Fret = x => { // 弦長轉徽位
    x = frc(x)
    let Fret = 0
    for (let i = 0; i <= 13; i++) {
        if (x.compare(FretListA[i]) >= 0 && x.compare(FretListA[i + 1]) < 0) {
            Fret = i
            break
        }
    }
    const Result = frc(Fret).add(x.sub(FretListA[Fret]).div(frc(FretListA[Fret + 1]).sub(FretListA[Fret])))
    return Number(Number(Result).toFixed(3))
}
// console.log(Leng2Fret('11/20'))

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
    const Print1 = [{
        title: '向上A',
        data: upA
    }, {
        title: '向上B',
        data: upB
    }, {
        title: '八度値',
        data: Octave1
    }, {
        title: '音分',
        data: Cent1
    }]
    const Print2 = [{
        title: '向下A',
        data: downA
    }, {
        title: '向下B',
        data: downB
    }, {
        title: '八度値',
        data: Octave2
    }, {
        title: '音分',
        data: Cent2
    }]
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
        if (x === '1') {
            List1[i] = List1[i].toFraction()
        } else {
            List1[i] = List1[i].toFraction(true)
        }
        const Func = OctaveCent(Number(List1[i]), x)
        Octave1[i] = Func.Octave.toFixed(10)
        Cent1[i] = Func.Cent.toFixed(8)
    }
    for (let i = 0; i <= 3; i++) {
        List2[i] = frc(List1[i]).mul('5/4')
        while (List2[i] >= frc(x).mul(2)) {
            List2[i] = List2[i].div(2)
        }
        if (x === '1') {
            List2[i] = List2[i].toFraction()
        } else {
            List2[i] = List2[i].toFraction(true)
        }
        const Func = OctaveCent(Number(List2[i]), x)
        Octave2[i] = Func.Octave.toFixed(10)
        Cent2[i] = Func.Cent.toFixed(8)
    }
    for (let i = 0; i <= 3; i++) {
        List3[i] = frc(List1[i]).mul('6/5')
        while (List3[i] >= frc(x).mul(2)) {
            List3[i] = List3[i].div(2)
        }
        if (x === '1') {
            List3[i] = List3[i].toFraction()
        } else {
            List3[i] = List3[i].toFraction(true)
        }
        const Func = OctaveCent(Number(List3[i]), x)
        Octave3[i] = Func.Octave.toFixed(10)
        Cent3[i] = Func.Cent.toFixed(8)
    }
    const Print = [{
        title: '頻率',
        data: [...List1, ...List2, ...List3]
    }, {
        title: '八度値',
        data: [...Octave1, ...Octave2, ...Octave3]
    }, {
        title: '音分',
        data: [...Cent1, ...Cent2, ...Cent3]
    }]
    return Print
}
// console.log(Pure(1))

/**
 * 十二平均律。新法密率
 * @param CFreq c的頻率
 * @returns 
 */
export const Equal12 = CFreq => {
    CFreq = CFreq.toString()
    let a = CFreq
    if (CFreq.includes('/')) {
        a = CFreq.split('/')
        a = big.div(a[0], a[1])
    }
    const List = [], List1 = [], Octave = [], Cent = []
    List[0] = CFreq
    List1[0] = CFreq
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
    const Print = [
        {
            title: '頻率',
            data: List1
        },
        {
            title: '八度値',
            data: Octave
        },
        {
            title: '音分',
            data: Cent
        }]
    return { Print, List1 }
}
// console.log(Equal12('1').Print)
// console.log(big(2).pow(big.div(1, 12)).toString())
// 1.059463094359295264561825294946341700779204317494185628559208431
// 1.059463094359295264561825 // 朱載堉25位大算盤

const EqualTuningSub = (OriginFrq, KnownLeng, KnownFret, UnknownFret, isGt) => { // 初始弦頻率，已知弦長，已知弦徽位，所求弦徽位，所求頻率是否高於初始弦
    // 寫的啥？？？ 幾弦幾徽=幾陷幾徽 比如一弦一徽=二弦？徽   1 *1/8=5/6 * x ，求x
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

const EqualTuning8 = (x, TempMode) => {  // 黃鐘調緊五慢一
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

export const Tuning = (x, TuningMode) => { // 輸入五弦頻率 // fraction的小數精度就是普通的16位，沒法保留高精度
    const { Two1, Four1, One1, Six1, Seven1, Three1, Seven2, Two2, Three2, One2, Six2, Four2, One3, Two3, Three3, Four3, Six3, Seven3 } = eval('EqualTuning' + TuningMode)(x).Print
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
    return Print
}
// console.log(Tuning(1, 1))

const FushionList = { // 這是五度律、純律混合在一起。除了 C D F G 是共用，其他加了上下線的都是純律。第一個數字 0 共用，1 五度律，2 純律
    0: [0, 'C', '1', '1/1'],
    70.67: [2, '#<span class="dnline2">C</span>', '#<span class="dnline2">1</span>', '25/24'], // 小半音
    90.22: [1, 'bD', 'b2', '256/243'],
    92.18: [2, '#<span class="dnline1">C</span>', '#<span class="dnline1">1</span>', '135/128'],
    111.73: [2, 'b<span class="upline1">D</span>', 'b<span class="upline1">2</span>', '16/15'],
    113.69: [1, '#C', '#1', '2187/2048'],
    133.24: [2, 'b<span class="upline2">D</span>', 'b<span class="upline2">2</span>', '27/25'],
    182.40: [2, '<span class="dnline1">D</span>', '<span class="dnline1">2</span>', '10/9'],
    203.91: [0, 'D', '2', '9/8'],
    274.58: [2, '#<span class="dnline2">D</span>', '#<span class="dnline2">2</span>', '75/64'],
    294.13: [1, 'bE', 'b3', '32/27'],
    315.64: [2, 'b<span class="upline1">E</span>', 'b<span class="upline1">3</span>', '6/5'],
    317.60: [1, '#D', '#2', '19683/16384'],
    364.81: [2, '<span class="dnline2">E</span>', '<span class="dnline2">3</span>', '100/81'],
    384.36: [1, 'bF', 'b4', '8192/6561'],
    386.31: [2, '<span class="dnline1">E</span>', '<span class="dnline1">3</span>', '5/4'],
    407.82: [0, 'E', '3', '81/64'],
    427.37: [2, 'b<span class="upline2">F</span>', 'b<span class="upline2">4</span>', '32/25'],
    478.49: [2, '#<span class="dnline2">E</span>', '#<span class="dnline2">3</span>', '675/512'],
    498.04: [1, 'F', '4', '4/3'],
    519.55: [2, '<span class="upline1">F</span>', '<span class="upline1">4</span>', '27/20'],
    521.51: [1, '#E', '#3', '177147/131072'],
    568.72: [2, '#<span class="dnline2">F</span>', '#<span class="dnline2">4</span>', '25/18'],
    588.27: [1, 'bG', 'b5', '1024/729'],
    590.22: [2, '#<span class="dnline1">F</span>', '#<span class="dnline1">4</span>', '45/32'],
    609.77: [2, 'b<span class="upline1">G</span>', 'b<span class="upline1">5</span>', '64/45'],
    611.73: [1, '#F', '#4', '729/512'],
    631.28: [2, 'b<span class="upline2">G</span>', 'b<span class="upline2">5</span>', '36/25'],
    680.45: [2, '<span class="dnline1">G</span>', '<span class="dnline1">5</span>', '40/27'],
    701.96: [0, 'G', '5', '3/2'],
    772.63: [2, '#<span class="dnline2">G</span>', '#<span class="dnline2">5</span>', '25/16'],
    792.18: [1, 'bA', 'b6', '128/81'],
    794.13: [2, '#<span class="dnline1">G</span>', '#<span class="dnline1">5</span>', '405/256'],
    813.69: [2, 'b<span class="upline1">A</span>', 'b<span class="upline1">6</span>', '8/5'],
    815.64: [1, '#G', '#5', '6561/4096'],
    884.36: [2, '<span class="dnline1">A</span>', '<span class="dnline1">6</span>', '5/3'],
    905.87: [1, 'A', '6', '27/16'],
    976.54: [2, '#<span class="dnline2">A</span>', '#<span class="dnline2">6</span>', '225/128'],
    996.09: [1, 'bB', 'b7', '16/9'],
    1017.59: [2, 'b<span class="upline1">B</span>', 'b<span class="upline1">7</span>', '9/5'],
    1019.55: [1, '#A', '#6', '59049/32768'],
    1066.76: [2, '<span class="dnline2">B</span>', '<span class="dnline2">7</span>', '50/27'],
    1086.31: [1, '·bC', '·b1', '4096/2187'],
    1088.27: [2, '<span class="dnline1">B</span>', '<span class="dnline1">7</span>', '15/8'],
    1107.82: [2, '·b<span class="upline1">C</span>', '·b<span class="upline1">1</span>', '256/135'],
    1109.78: [1, 'B', '7', '243/128'],
    1129.33: [2, '·b<span class="upline2">C</span>', '·b<span class="upline2">1</span>', '48/25'],
    1200: [0, 'C', '1', '2/1']
}
// const faas = z => { // 把分數處理成音分
//     const b = []
//     for (let i = 0; i < PythagoreanListC.length; i++) {
//         const a = PythagoreanListC[i].split('/')[0] / PythagoreanListC[i].split('/')[1]
//         b[i] = (Math.log2(a) * 1200).toFixed(2)
//     }
//     return b
// }
// console.log(faas(1))

// const fa3 = z => {
//     const a = 1.276584120678397
//     return frc(a).toFraction(false)
// }
// console.log(fa3(3))
// s散音，f泛音，a按音
export const Position2Pitch = (InputRaw, TuningMode, TempMode, GongString, ZhiString, GongFrq, OutputMode, isStrict) => { // ；調弦法；律制；宮弦；徵弦（宮弦徵弦只能二選一，另一個爲0）；宮弦頻率；輸出模式 1 唱名 2音名 3 與宮弦頻率比 4 頻率；
    const StringList = eval('EqualTuning' + TuningMode)(1, TempMode).String
    TuningMode = +TuningMode
    TempMode = +TempMode
    OutputMode = +OutputMode
    GongFrq = +GongFrq
    isStrict = +isStrict
    GongString = +GongString
    ZhiString = +ZhiString
    const TheString = ZhiString || GongString
    const isZhi = ZhiString ? true : false
    const Input = InputRaw.split(';').filter(Boolean)
    const Type = [], String = [], Fret = [], AbsScale = [], RelScale = [], Cent = [], Pitch = [], PitchPrint = []
    for (let i = 0; i < Input.length; i++) {
        let Pre = Input[i].split(',').filter(Boolean)
        if (Pre.length === 1 && isNaN(Pre[0]) === false) { // 「就」，與上一音徽位同，或同爲散音            
            if (Type[i - 1] === 'f') {
                Type[i] = Type[i - 1]
                Pre = Type[i].concat(Fret[i - 1]).concat(Pre)
            } else if (Type[i - 1] === 'l') {
                Pre = [Fret[i - 1], Pre]
                Type[i] = Pre[0]
            } else {
                Type[i] = Type[i - 1]
                Pre = [Type[i], Pre[0]]
            }
        } else {
            Type[i] = Pre[0]
        }
        let floor = 0
        if (Type[i] === 's') {
            AbsScale[i] = StringList[+Pre[1] - 1]
        } else if (Type[i] === 'zhuang') {
            AbsScale[i] = AbsScale[i - 1].mul(TempMode === 1 ? '9/8' : '10/9')
        } else {
            if (Type[i] === 'f') {
                Fret[i] = 7 - Math.abs(7 - +Pre[1]) // 泛音以7徽對稱
                String[i] = Pre[2]
            } else if (Type[i] === 'l') {
                String[i] = String[i - 1]
                Fret[i] = Pre[1]
            } else {
                Fret[i] = Type[i]
                String[i] = Pre[1]
            }
            const Leng = Fret2Leng(Fret[i])
            AbsScale[i] = frc(1).div(Leng).mul(StringList[+String[i] - 1])
        }
        RelScale[i] = Number(frc(AbsScale[i]).div(StringList[TheString - 1]))
        Cent[i] = Math.log2(RelScale[i]) * 1200 - (isZhi ? 498.045 : 0) // 若用徵弦作為基準，減純五度
        floor = Math.floor((Cent[i] + 21.5) / 1200) // 超出一個八度
        Cent[i] = (Cent[i] % 1200 + 1200) % 1200
        for (const [key, value] of Object.entries(FushionList)) {
            const threshold = isStrict ? 0.1 : 10
            if (Cent[i] > +key - threshold && Cent[i] < +key + threshold && (TempMode === value[0] || value[0] === 0)) {
                Pitch[i] = value[OutputMode <= 3 ? OutputMode : 3]
                break
            }
        }
        if (isStrict === 0 && Pitch[i] === undefined) { // 這個用來對付徽位更不準的
            for (const [key, value] of Object.entries(FushionList)) { // 21.5普通音差
                if (Cent[i] > +key - 21.5 && Cent[i] < +key + 21.5 && (TempMode === value[0] || value[0] === 0)) {
                    Pitch[i] = value[OutputMode <= 3 ? OutputMode : 3]
                    break
                }
            }
        }
        if (OutputMode >= 3) {
            if (Pitch[i] === undefined) {
                Pitch[i] = frc(2 ** (Cent[i] / 1200)).toFraction(false)
            }
            Pitch[i] = frc(Pitch[i]).mul(2 ** floor).toFraction(false)
        }
        if (OutputMode === 4) {
            Pitch[i] = Number(frc(Pitch[i]).mul(GongFrq)).toFixed(3)
        }
        PitchPrint[i] = Pitch[i]
        if (OutputMode <= 2) {
            if (floor === 3) {
                PitchPrint[i] = '··' + PitchPrint[i]
            } else if (floor === 2) {
                PitchPrint[i] = '·' + PitchPrint[i]
            } else if (floor === 0) {
                PitchPrint[i] += '·'
            } else if (floor === -1) {
                PitchPrint[i] += '··'
            }
        }
        if (Type[i] === 'zhuang') {
            if (i > 0) {
                PitchPrint[i] = '^' + PitchPrint[i] + Pitch[i - 1]
            }
        } else if (Type[i] === 'f') {
            PitchPrint[i] = '৹' + PitchPrint[i]
        } else if (Type[i] === 'l') {
            PitchPrint[i] = '◠' + PitchPrint[i]
        }
    }
    return PitchPrint.join('　')
}
// console.log(Position2Pitch(`9.6,3;l,10.8`, '1', '1', '4', '0', '347.654321', '3'))
// console.log(Position2Pitch('s,1;9.9,2;s,1;9.9,2;l,14;s,2;1;2;2;1;2;14,2;3;3;2;3;s,5;4;10,2;s,4;8,2;s,5;11,1;9,1;2;1;2;8,2;l,7.6;s,2;1;10,4', '1', '2', '1', '347.654321', '2'))
// console.log(Position2Pitch('s,5', '1', '1', '3', '0', '347.654321', '2', '0'))

// const xxx = () => {
//     const a = Number(frc('3/4').pow(18))
//     const c = a
//     return c
// }
// console.log(xxx())

// const PythagoreanListA = {
//     0: 'C',
//     90.22: 'bD',
//     113.69: '#C',
//     180.45: 'bbE',
//     203.91: 'D',
//     294.13: 'bE',
//     317.60: '#D',
//     384.36: 'bF',
//     407.82: 'E',
//     498.04: 'F',
//     521.51: '#E',
//     588.27: 'bG',
//     611.73: '#F',
//     678.49: 'bbA',
//     701.96: 'G',
//     792.18: 'bA',
//     815.64: '#G',
//     882.40: 'bbB',
//     905.87: 'A',
//     996.09: 'bB',
//     1019.55: '#A',
//     1086.31: '<span class="updot1">bC</span>',
//     1109.78: 'B',
//     1176.54: '<span class="updot1">bbD</span>',
//     1200: 'C'
// }

// const JustoniListA = {
//     0: 'C',
//     70.67: '#<span class="dnline2">C</span>', // 小半音
//     92.18: '#<span class="dnline1">C</span>',
//     111.73: 'b<span class="upline1">D</span>',
//     133.24: 'b<span class="upline2">D</span>',
//     182.40: '<span class="dnline1">D</span>',
//     203.91: 'D',
//     223.46: 'bb<span class="upline2">E</span>',
//     274.58: '#<span class="dnline2">D',
//     315.64: 'b<span class="upline1">E</span>',
//     364.81: '<span class="dnline2">E</span>',
//     386.31: '<span class="dnline1">E</span>',
//     427.37: 'b<span class="upline2">F</span>',
//     478.49: '#<span class="dnline2">E</span>',
//     498.05: 'F',
//     519.55: '<span class="upline1">F</span>',
//     568.72: '#<span class="dnline2">F</span>',
//     590.22: '#<span class="dnline1">F</span>',
//     609.77: 'b<span class="upline1">G</span>',
//     631.28: 'b<span class="upline2">G</span>',
//     680.45: '<span class="dnline1">G</span>',
//     701.96: 'G',
//     772.63: '#<span class="dnline2">G</span>',
//     794.13: '#<span class="dnline1">G</span>',
//     813.69: 'b<span class="upline1">A</span>',
//     884.36: '<span class="dnline1">A</span>',
//     925.42: 'bb<span class="upline2">B</span>',
//     976.54: '#<span class="dnline2">A</span>',
//     1017.59: 'b<span class="upline1">B</span>',
//     1066.76: '<span class="dnline2">B</span>',
//     1088.27: '<span class="dnline1">B</span>',
//     1107.82: 'b<span class="updot1"><span class="upline1">C</span></span>',
//     1129.33: 'b<span class="updot1"><span class="upline2">C</span></span>',
//     1200: 'C'
// }

// const FushionList = { // 這是完整的包含了重降bb的。如果真的出現了重降的音，以後再說吧，現在先去掉
//     0: [0, 'C', '1', '1/1'],
//     70.67: [2, '#<span class="dnline2">C</span>', '#<span class="dnline2">1</span>', '25/24'], // 小半音
//     90.22: [1, 'bD', 'b2', '256/243'],
//     92.18: [2, '#<span class="dnline1">C</span>', '#<span class="dnline1">1</span>', '135/128'],
//     111.73: [2, 'b<span class="upline1">D</span>', 'b<span class="upline1">2</span>', '16/15'],
//     113.69: [1, '#C', '#1', '2187/2048'],
//     133.24: [2, 'b<span class="upline2">D</span>', 'b<span class="upline2">2</span>', '27/25'],
//     180.45: [1, 'bbE', 'bb3', '65536/59049'],
//     182.40: [2, '<span class="dnline1">D</span>', '<span class="dnline1">2</span>', '10/9'],
//     203.91: [0, 'D', '2', '9/8'],
//     223.46: [2, 'bb<span class="upline2">E</span>', 'bb<span class="upline2">3</span>', '256/225'],
//     274.58: [2, '#<span class="dnline2">D</span>', '#<span class="dnline2">2</span>', '75/64'],
//     294.13: [1, 'bE', 'b3', '32/27'],
//     315.64: [2, 'b<span class="upline1">E</span>', 'b<span class="upline1">3</span>', '6/5'],
//     317.60: [1, '#D', '#2', '19683/16384'],
//     364.81: [2, '<span class="dnline2">E</span>', '<span class="dnline2">3</span>', '100/81'],
//     384.36: [1, 'bF', 'b4', '8192/6561'],
//     386.31: [2, '<span class="dnline1">E</span>', '<span class="dnline1">3</span>', '5/4'],
//     407.82: [0, 'E', '3', '81/64'],
//     427.37: [2, 'b<span class="upline2">F</span>', 'b<span class="upline2">4</span>', '32/25'],
//     478.49: [2, '#<span class="dnline2">E</span>', '#<span class="dnline2">3</span>', '675/512'],
//     498.04: [1, 'F', '4', '4/3'],
//     519.55: [2, '<span class="upline1">F</span>', '<span class="upline1">4</span>', '27/20'],
//     521.51: [1, '#E', '#3', '177147/131072'],
//     568.72: [2, '#<span class="dnline2">F</span>', '#<span class="dnline2">4</span>', '25/18'],
//     588.27: [1, 'bG', 'b5', '1024/729'],
//     590.22: [2, '#<span class="dnline1">F</span>', '#<span class="dnline1">4</span>', '45/32'],
//     609.77: [2, 'b<span class="upline1">G</span>', 'b<span class="upline1">5</span>', '64/45'],
//     611.73: [1, '#F', '#4', '729/512'],
//     631.28: [2, 'b<span class="upline2">G</span>', 'b<span class="upline2">5</span>', '36/25'],
//     678.49: [1, 'bbA', 'bb6', '262144/177147'],
//     680.45: [2, '<span class="dnline1">G</span>', '<span class="dnline1">5</span>', '40/27'],
//     701.96: [0, 'G', '5', '3/2'],
//     772.63: [2, '#<span class="dnline2">G</span>', '#<span class="dnline2">5</span>', '25/16'],
//     792.18: [1, 'bA', 'b6', '128/81'],
//     794.13: [2, '#<span class="dnline1">G</span>', '#<span class="dnline1">5</span>', '405/256'],
//     813.69: [2, 'b<span class="upline1">A</span>', 'b<span class="upline1">6</span>', '8/5'],
//     815.64: [1, '#G', '#5', '6561/4096'],
//     882.40: [1, 'bbB', 'bb7', '32768/19683'],
//     884.36: [2, '<span class="dnline1">A</span>', '<span class="dnline1">6</span>', '5/3'],
//     905.87: [1, 'A', '6', '27/16'],
//     925.42: [2, 'bb<span class="upline2">B</span>', 'bb<span class="upline2">7</span>', '128/75'],
//     976.54: [2, '#<span class="dnline2">A</span>', '#<span class="dnline2">6</span>', '225/128'],
//     996.09: [1, 'bB', 'b7', '16/9'],
//     1017.59: [2, 'b<span class="upline1">B</span>', 'b<span class="upline1">7</span>', '9/5'],
//     1019.55: [1, '#A', '#6', '59049/32768'],
//     1066.76: [2, '<span class="dnline2">B</span>', '<span class="dnline2">7</span>', '50/27'],
//     1086.31: [1, '·bC', '·b1', '4096/2187'],
//     1088.27: [2, '<span class="dnline1">B</span>', '<span class="dnline1">7</span>', '15/8'],
//     1107.82: [2, '·b<span class="upline1">C</span>', '·b<span class="upline1">1</span>', '256/135'],
//     1109.78: [1, 'B', '7', '243/128'],
//     1129.33: [2, '·b<span class="upline2">C</span>', '·b<span class="upline2">1</span>', '48/25'],
//     1176.54: [1, '·bbD', '·bb2', '1048576/531441'],
//     1200: [0, 'C', '1', '2/1']
// }