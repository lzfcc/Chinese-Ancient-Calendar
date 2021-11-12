import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac, BigFrc } from './equa_math.mjs'

const FushionList = { // 這是五度律、純律混合在一起。除了 C D F G 是共用，其他加了上下線的都是純律。第一個數字 0 共用，1 五度律，2 純律
    0: [0, 'C', '1', '1'],
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
    1200: [0, 'C', '1', '2']
}

const Freq2Name = a => { // 輸入頻率比，輸出對應的唱名
    a = frc(a)
    if (Number(a) < 1) {
        a = a.mul(2)
    } else if (Number(a) > 2) {
        a = a.div(2)
    }
    a = a.toFraction(false)
    for (const [key, value] of Object.entries(FushionList)) {
        if (value[3] === a) {
            return value[2]
        }
    }
}

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
    x = frc(x).simplify()
    const xNum = Number(x)
    const Fret = x.floor()
    if (Fret === xNum) {
        if (xNum === -1) {
            return '1/10' // 15徽泛音以7徽對稱就變成了-1
        }
        return FretList[xNum]
    }
    const Frac = x.sub(Fret)
    const Leng = frc(FretList[Fret]).add(Frac.mul(frc(FretList[Fret + 1]).sub(FretList[Fret])))
    return Leng.toFraction()
}
// console.log(Fret2Leng('16'))

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
    const upA = [], upB = [], downA = [], downB = [], Cent1 = [], Cent2 = []
    upA[0] = x
    upB[0] = x
    downA[0] = x
    downB[0] = x
    Cent1[0] = 0
    Cent2[0] = 0
    for (let i = 1; i <= 12; i++) {
        upA[i] = frc(upA[i - 1]).mul('3/2')
        while (upA[i] >= frc(x).mul(2)) {
            upA[i] = upA[i].div(2)
        }
        const tmp = Number(upA[i])
        upA[i] = upA[i].toFraction(true)
        Cent1[i] = OctaveCent(tmp, x).Cent.toFixed(8)
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
        downB[i] = downB[i].toFraction(true)
        Cent2[i] = OctaveCent(tmp, x).Cent.toFixed(8)
    }
    const Print1 = [{
        title: '向上A',
        data: upA
    }, {
        title: '向上B',
        data: upB
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
        title: '音分',
        data: Cent2
    }]
    return { Print1, Print2 }
}

export const Pythagorean60 = x => {
    const upA = [], Cent1 = []
    upA[0] = x
    Cent1[0] = 0
    for (let i = 1; i < 60; i++) {
        const Func1 = BigFrc(upA[i - 1], '3/2')
        upA[i] = Func1.Frac
        let Deci = Func1.Deci
        while (Deci >= Number(frc(x).mul(2))) {
            const Func2 = BigFrc(upA[i], '1/2')
            upA[i] = Func2.Frac
            Deci = Func2.Deci
        }
        Cent1[i] = OctaveCent(Deci, x).Cent.toFixed(8)
    }
    const Print1 = [{
        title: '向上',
        data: upA
    }, {
        title: '音分',
        data: Cent1
    }]
    return Print1
}
// console.log(Pythagorean60(81))
export const Justoni = x => {
    x = x.toString()
    const List1 = [], List2 = [], List3 = [], Cent1 = [], Cent2 = [], Cent3 = []
    List1[0] = x
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
        Cent1[i] = OctaveCent(Number(frc(List1[i])), x).Cent.toFixed(8)
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
        Cent2[i] = OctaveCent(Number(frc(List2[i])), x).Cent.toFixed(8)
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
        Cent3[i] = OctaveCent(Number(frc(List3[i])), x).Cent.toFixed(8)
    }
    const Print = [{
        title: '頻率',
        data: [...List1, ...List2, ...List3]
    }, {
        title: '音分',
        data: [...Cent1, ...Cent2, ...Cent3]
    }]
    return Print
}
// console.log(Justoni(1))

/**
 * 十二平均律。新法密率
 * @param CFreq c的頻率
 * @returns 
 */
export const EqualTemp = CFreq => {
    CFreq = CFreq.toString()
    let a = CFreq
    if (CFreq.includes('/')) {
        a = CFreq.split('/')
        a = big.div(a[0], a[1])
    }
    const List = [], List1 = [], Cent = []
    List[0] = CFreq
    List1[0] = CFreq
    Cent[0] = 0
    for (let i = 1; i <= 12; i++) {
        List[i] = big(a).mul(big(2).pow(big.div(i, 12)))
        if (i === 12) {
            List1[i] = List[i].toNumber()
        } else {
            List1[i] = List[i].toFixed(24)
        }
        Cent[i] = +OctaveCent(List1[i], a).Cent.toFixed(12)
    }
    const Print = [{
        title: '頻率',
        data: List1
    }, {
        title: '音分',
        data: Cent
    }]
    return { Print, List1 }
}
// console.log(EqualTemp('1').Print)
// console.log(big(2).pow(big.div(1, 12)).toString())
// 1.059463094359295264561825294946341700779204317494185628559208431
// 1.059463094359295264561825 // 朱載堉25位大算盤

const TuningSub1 = (KnownFreq, KnownFret, UnknownFret) => frc(KnownFreq).div(Fret2Leng(KnownFret)).mul(Fret2Leng(UnknownFret)).toFraction(false) // 已知弦頻率比（不是實際頻率），已知弦徽位，所求弦徽位。這個沒分是泛音還是按音，所以如果是泛音調弦，一定要七徽以上。散音是14

const AllTuningMethod = () => { // 所有泛音調弦可能。沒寫對，還是手算的。
    let leng = []
    for (let i = 3; i <= 7; i++) {
        let tmp = frc(Fret2Leng(i))
        for (let k = i + 1; k <= 7; k++) {
            tmp = frc(1).div(tmp.div(Fret2Leng(k)))
            if (Number(tmp) > 1 && Number(tmp) < 2) {
                leng.push(tmp.toFraction(false) + ',' + i + ',' + k)
            }
        }
    }
    leng = Array.from(new Set(leng))
    return leng
}
// console.log(AllTuningMethod())

const TuningSub2 = (PortionList, Unmoved, Unmoved2Five, Freq) => { // 各弦頻率比，那根弦沒動作為基準，這根弦到五弦正調的比例，五弦基準頻率
    Freq = frc(Unmoved2Five).mul(Freq)
    const FreqList = []
    for (let i = 1; i <= 7; i++) {
        FreqList[i] = Number(frc(Freq).mul(frc(PortionList[i]).div(PortionList[Unmoved]))).toFixed(4)
    }
    return FreqList
}

const Tuning1 = (Freq, a = 3, n = 3) => { // 正調
    const Zhun = [], Hui = [], Xin = []
    Zhun[3] = '1'
    Hui[3] = '1'
    // 準法律
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[5] = TuningSub1(Zhun[7], 5, 4)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    const ZhunFreq = TuningSub2(Zhun, 5, '1', Freq)
    // 徽法律
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[4] = TuningSub1(Hui[6], 5, 4)
    Hui[5] = TuningSub1(Hui[3], 6, 7)
    Hui[7] = TuningSub1(Hui[5], 4, 5)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    const HuiFreq = TuningSub2(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = Freq
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning2 = Freq => {  // 蕤賓調緊五 2 3 5 6 1 2 3
    const Zhun = [], Hui = [], Xin = []
    Zhun[5] = '1'
    Hui[5] = '1'
    // 準法律
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[1] = TuningSub1(Zhun[6], 7, 4)
    const ZhunFreq = TuningSub2(Zhun, 3, '64/81', Freq)
    // 徽法律
    Hui[3] = TuningSub1(Hui[5], 5, 4)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[4] = TuningSub1(Hui[5], 6, 5)
    Hui[7] = TuningSub1(Hui[5], 6, 7)
    Hui[2] = TuningSub1(Hui[5], 6, 4)
    const HuiFreq = TuningSub2(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning3 = Freq => {  // 清商調緊二五七 6 1 2 3 5 6 7
    const Zhun = [], Hui = [], Xin = []
    Zhun[2] = '1'
    Hui[2] = '1'
    // 準法律
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    const ZhunFreq = TuningSub2(Zhun, 3, '64/81', Freq)
    // 徽法律
    Hui[4] = TuningSub1(Hui[2], 6, 7)
    Hui[5] = TuningSub1(Hui[2], 5, 7)
    Hui[3] = TuningSub1(Hui[5], 5, 4)
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Hui[1] = TuningSub1(Hui[6], 7, 4)
    Hui[7] = TuningSub1(Hui[4], 5, 7)
    const HuiFreq = TuningSub2(Hui, 3, '4/5', Freq)

    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[6] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning4 = Freq => {  // 慢角調慢三 1 2 3 5 6 1 2
    const Zhun = [], Hui = [], Xin = []
    Zhun[1] = '1'
    Hui[1] = '1'
    // 準法律
    Zhun[4] = TuningSub1(Zhun[1], 5, 7)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[1], 4, 7)
    // const ZhunFreq = TuningSub2(Zhun, 2, '2/3', Freq)
    const ZhunFreq = TuningSub2(Zhun, 5, '1', Freq)
    // 徽法律
    Hui[4] = TuningSub1(Hui[1], 5, 7)
    Hui[7] = TuningSub1(Hui[4], 5, 7)
    Hui[2] = TuningSub1(Hui[4], 5, 4)
    Hui[3] = TuningSub1(Hui[1], 6, 7)
    Hui[5] = TuningSub1(Hui[3], 4, 5)
    Hui[6] = TuningSub1(Hui[1], 4, 7)
    const HuiFreq = TuningSub2(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning5 = Freq => {  // 慢宮調慢一三六 3 5 6 1 2 3 5
    const Zhun = [], Hui = [], Xin = []
    Zhun[4] = '1'
    Hui[4] = '1'
    // 準法律
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[5] = TuningSub1(Zhun[7], 5, 4)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[6], 7, 4)
    const ZhunFreq = TuningSub2(Zhun, 5, '1', Freq)
    // 徽法律    
    Hui[3] = TuningSub1(Hui[4], 6, 5)
    Hui[6] = TuningSub1(Hui[4], 6, 7)
    Hui[1] = TuningSub1(Hui[6], 7, 4)
    Hui[2] = TuningSub1(Hui[4], 5, 4)
    Hui[7] = TuningSub1(Hui[4], 5, 7)
    Hui[5] = TuningSub1(Hui[7], 5, 4)
    const HuiFreq = TuningSub2(Hui, 5, '1', Freq)

    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[2] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning6 = Freq => {  // 徽法律淒涼調緊二五 5 #6 1 2 4 5 6
    const Hui = [], Xin = []
    Hui[3] = '1'
    // 徽法律
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[4] = TuningSub1(Hui[6], 5, 4)
    Hui[7] = TuningSub1(Hui[3], 3, 5)
    Hui[5] = TuningSub1(Hui[3], 4, 5)
    Hui[2] = TuningSub1(Hui[6], 5, 3)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    const HuiFreq = TuningSub2(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[6] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq }
}

const Tuning7 = Freq => {  // 黃鐘調緊五慢一 1 3 5 6 1 2 3 或 4 6 1 2 4 5 6
    const Zhun = [], Hui = [], Xin = []
    Zhun[1] = '1'
    Hui[1] = '1'
    // 準法律
    Zhun[5] = TuningSub1(Zhun[1], 4, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    const ZhunFreq = TuningSub2(Zhun, 3, '64/81', Freq)
    // 徽法律
    Hui[2] = TuningSub1(Hui[1], 3, 4)
    Hui[3] = TuningSub1(Hui[1], 5, 7)
    Hui[4] = TuningSub1(Hui[1], 3, 5)
    Hui[5] = TuningSub1(Hui[1], 4, 7)
    Hui[7] = TuningSub1(Hui[2], 4, 7)
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    const HuiFreq = TuningSub2(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[1] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning8 = Freq => {  // 無媒調慢三六 1 2 3 5 6 7 2 或 4 5 6 1 2 3 5
    const Zhun = [], Hui = [], Xin = []
    Zhun[1] = '1'
    Hui[1] = '1'
    // 準法律
    Zhun[4] = TuningSub1(Zhun[1], 5, 7)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    // const ZhunFreq = TuningSub2(Zhun, 2, '2/3', Freq)
    const ZhunFreq = TuningSub2(Zhun, 5, '1', Freq)
    // 徽法律
    // 陳應時
    // Hui[3] = TuningSub1(Hui[1], 4, 5)
    // Hui[5] = TuningSub1(Hui[3], 6, 7)
    // Hui[7] = TuningSub1(Hui[5], 4, 5)
    // Hui[4] = TuningSub1(Hui[1], 5, 7)
    // Hui[6] = TuningSub1(Hui[4], 6, 7)
    // Hui[2] = TuningSub1(Hui[7], 7, 4)
    // Hui[3] = TuningSub1(Hui[5], 5, 4)
    // 我的不用最後一步
    Hui[3] = TuningSub1(Hui[1], 3, 4)
    Hui[4] = TuningSub1(Hui[3], 5, 6)
    Hui[6] = TuningSub1(Hui[4], 6, 7)
    Hui[5] = TuningSub1(Hui[1], 3, 5)
    Hui[2] = TuningSub1(Hui[5], 7, 5)
    Hui[7] = TuningSub1(Hui[2], 4, 7)
    const HuiFreq = TuningSub2(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning9 = Freq => {  // 間弦一慢一三 7 2 3 5 6 1 2 或 3 5 6 1 2 4 5
    const Zhun = [], Hui = [], Xin = []
    Zhun[4] = '1'
    Hui[4] = '1'
    // 準法律
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[4], 5, 4)
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[6] = TuningSub1(Zhun[4], 4, 5)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    const ZhunFreq = TuningSub2(Zhun, 4, '8/9', Freq)
    // 徽法律
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Hui[5] = TuningSub1(Hui[6], 6, 5)
    Hui[7] = TuningSub1(Hui[5], 4, 5)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    Hui[3] = TuningSub1(Hui[4], 6, 5)
    Hui[1] = TuningSub1(Hui[3], 5, 4) // 這樣是低了兩個音差
    const HuiFreq = TuningSub2(Hui, 4, '9/10', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[2] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const Tuning10 = Freq => {  // 徽法律間弦二緊五慢三 1 2 3 5 #6 1 2 或 2 3 b5 6 1 2 3
    const Hui = [], Xin = []
    Hui[1] = '1'
    // 徽法律
    // 陳應時法
    Hui[3] = TuningSub1(Hui[1], 4, 5)
    Hui[5] = TuningSub1(Hui[3], 4, 5)
    Hui[7] = TuningSub1(Hui[5], 3, 4)
    Hui[4] = TuningSub1(Hui[1], 5, 7)
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    Hui[3] = TuningSub1(Hui[1], 3, 4)
    const HuiFreq = TuningSub2(Hui, 2, '2/3', Freq)
    // 我
    // Hui[3] = TuningSub1(Hui[1], 6, 7)
    // Hui[4] = TuningSub1(Hui[1], 5, 7)
    // Hui[5] = TuningSub1(Hui[4], 5, 6)
    // Hui[7] = TuningSub1(Hui[5], 6, 7)
    // Hui[2] = TuningSub1(Hui[7], 7, 4)
    // Hui[6] = TuningSub1(Hui[1], 4, 7)
    // const HuiFreq = TuningSub2(Hui, 2, '2/3', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq }
}

const Tuning11 = Freq => { // 徽法律平調慢五七 5 b6 1 2 b3 5 b6 或 3 4 5 7 1 3 4
    const Hui = [], Xin = []
    Hui[3] = '1'
    // 徽法律
    Hui[5] = TuningSub1(Hui[3], 5, 6)
    Hui[7] = TuningSub1(Hui[3], 4, 6)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[4] = TuningSub1(Hui[1], 5, 7)
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    const HuiFreq = TuningSub2(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[4] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[11] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[4]
    return { Hui, Xin, HuiFreq }
}

const Tuning12 = Freq => {  // 徽法律側商調慢三四六 #6 1 2 3 5 6 1 或 1 2 3 b5 6 b1 2
    const Hui = [], Xin = []
    Hui[2] = '1'
    // 徽法律
    Hui[4] = TuningSub1(Hui[2], 6, 7)
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Hui[5] = TuningSub1(Hui[2], 5, 7)
    Hui[7] = TuningSub1(Hui[2], 4, 7)
    Hui[3] = TuningSub1(Hui[5], 5, 4)
    Hui[1] = TuningSub1(Hui[5], 5, 3)
    const HuiFreq = TuningSub2(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[9] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq }
}

// const sdfs=()=>{
//     return frc('729/1024').mul('32/27').toFraction()
// }
// console.log(sdfs())
const Tuning14 = Freq => {  // 徽法側蜀調緊二慢五 5 #6 1 2 b3 5 6
    const Zhun = [], Hui = [], Xin = []
    Zhun[3] = '1'
    Hui[3] = '1'
    // 按音調弦
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    Zhun[4] = TuningSub1(Zhun[6], 16, 10)
    Zhun[2] = TuningSub1(Zhun[4], 16, '10 65/81')
    Zhun[5] = TuningSub1(Zhun[2], '9 8/9', 16) // '9 8/9'五是純律，七是五度律。如果是10，五是五度律，七是純律。
    Zhun[7] = TuningSub1(Zhun[5], '9 8/15', 16)
    const ZhunFreq = TuningSub2(Zhun, 3, '4/5', Freq)
    // 徽
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[2] = TuningSub1(Hui[1], 5, 6)
    Hui[7] = TuningSub1(Hui[3], 3, 5)
    Hui[4] = TuningSub1(Hui[7], 7, 5)
    Hui[5] = TuningSub1(Hui[6], 4, 3)
    const HuiFreq = TuningSub2(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[6] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[11] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq }
}

const NumList = '〇一二三四五六七八九'

export const Tuning = (TuningMode, Freq = 432) => {
    const { Zhun, Hui, Xin, ZhunFreq, HuiFreq } = eval('Tuning' + TuningMode)(Freq)
    const DifZhun = [], NameZhun = [], DifHui = [], NameHui = []
    if (Zhun) {
        for (let i = 1; i <= 6; i++) {
            DifZhun[i] = OctaveCent(Zhun[i + 1], Zhun[i]).Cent.toFixed(3)
        }
        for (let i = 1; i <= 7; i++) {
            NameZhun[i] = Freq2Name(Zhun[i])
        }
    }
    if (Hui) {
        for (let i = 1; i <= 6; i++) {
            DifHui[i] = OctaveCent(Hui[i + 1], Hui[i]).Cent.toFixed(3)
        }
        for (let i = 1; i <= 7; i++) {
            NameHui[i] = Freq2Name(Hui[i])
        }
    }
    let Print = []
    for (let i = 1; i <= 7; i++) {
        const tmp = Zhun ? [Zhun[i], NameZhun[i], +ZhunFreq[i], DifZhun[i - 1]] : ['', '', '', '']
        Print = Print.concat({
            title: NumList[i],
            data: [...tmp, Hui[i], NameHui[i], +HuiFreq[i], DifHui[i - 1], Xin[i]]
        })
    }
    return Print
}
// console.log(Tuning(12))

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
export const Position2Pitch = (Input, TuningMode, TempMode, GongString, ZhiString, GongFrq, OutputMode, isStrict) => { // ；調弦法；律制；宮弦；徵弦（宮弦徵弦只能二選一，另一個爲0）；宮弦頻率；輸出模式 1 唱名 2音名 3 與宮弦頻率比 4 頻率；
    TempMode = +TempMode
    TuningMode = +TuningMode
    OutputMode = +OutputMode
    GongFrq = +GongFrq
    isStrict = +isStrict
    GongString = +GongString
    ZhiString = +ZhiString
    const { Zhun, Hui } = eval('Tuning' + TuningMode)()
    let StringList = []
    if (TempMode === 1) {
        StringList = Zhun
    } else if (TempMode === 2) {
        StringList = Hui
    }
    const TheString = ZhiString || GongString
    const isZhi = ZhiString ? true : false
    Input = Input.replace(/\[(.+?)\]/g, function () { // @lzfcc [泛音]
        return arguments[1].split(';').map(x => 'f,' + x).join(';')
    })
    Input = Input.split(';').filter(Boolean)
    // for (let i = 0; i < Input.length; i++) {
    //     if (Input[i] === 'dayuan') {
    //         Input.splice(i, i, Input[i - 2], Input[i - 1], Input[i - 2], Input[i - 1])
    //     } else if (Input[i] === 'suo3') {
    //         Input.splice(i, i, Input[i - 1], Input[i - 1])
    //     } else if (Input[i] === 'suo7') {
    //         Input.splice(i, i, Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1])
    //     } else if (Input[i] === 'suo9') {
    //         Input.splice(i, i, Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1])
    //     } else if (Input[i] === 'fenkai') {
    //         Input.splice(i, i, 'shang', 'xia')
    //     }
    // }
    const Type = [], String = [], Fret = [], AbsScale = [], RelScale = [], Cent = [], Pitch = [], PitchPrint = []
    for (let i = 0; i < Input.length; i++) {
        let Pre = Input[i].split(',').filter(Boolean)
        // 下面是補全承前省略
        if (Pre.length === 1) {
            if (isNaN(Pre[0]) === false) {
                // 「就」，與上一音徽位同，或同爲散音            
                if (Type[i - 1] === 'f') { // f,7,6;3                    
                    Pre = [Type[i - 1], Fret[i - 1], Pre[0]]
                } else if (Type[i - 1] === 'l') {  // l,13;2 
                    Pre = [Fret[i - 1], Pre[0]]
                } else { // 散、按音                    
                    Pre = [Type[i - 1], Pre[0]]
                }
            }
        } else if (Pre.length === 2 && Pre[0] === 'f') { // f,7,3;f,3
            Pre = [Type[i - 1], Fret[i - 1], Pre[1]]
        }
        // 下面是正式處理
        Type[i] = Pre[0]
        let floor = 0
        if (Type[i] === 's') {
            String[i] = +Pre[1]
            AbsScale[i] = StringList[String[i] - 1]
        } else if (Type[i] === 'zh') {
            String[i] = String[i - 1]
            AbsScale[i] = AbsScale[i - 1].mul(TempMode === 1 ? '9/8' : '10/9')
        } else if (Type[i] === 'shang') {
            String[i] = String[i - 1]
            AbsScale[i] = AbsScale[i - 1].mul(TempMode === 1 ? '9/8' : '10/9')
        } else if (Type[i] === 'xia') {
            String[i] = String[i - 1]
            AbsScale[i] = AbsScale[i - 1].div(TempMode === 1 ? '9/8' : '10/9')
        } else if (Type[i] === 'qi' && Pre.length === 1) {
            String[i] = String[i - 1]
            AbsScale[i] = StringList[String[i] - 1]
        } else {
            if (Type[i] === 'f') {
                Fret[i] = 7 - Math.abs(7 - +Pre[1]) // 泛音以7徽對稱
                String[i] = +Pre[2]
            } else if (Type[i] === 'l' || (Type[i] === 'qi' && Pre.length === 2)) {
                Fret[i] = Pre[1]
                String[i] = +String[i - 1]
            } else if (Type[i] === 'yin' || Type[i] === 'nao') {
                Fret[i] = Fret[i - 1]
                String[i] = String[i - 1]
            } else {
                Fret[i] = Type[i]
                String[i] = +Pre[1]
            }
            const Leng = Fret2Leng(Fret[i])
            AbsScale[i] = frc(1).div(Leng).mul(StringList[String[i] - 1])
        }
        RelScale[i] = Number(frc(AbsScale[i]).div(StringList[TheString - 1]))
        Cent[i] = Math.log2(RelScale[i]) * 1200 - (isZhi ? 498.045 : 0) // 若用徵弦作為基準，減純五度
        floor = Math.floor((Cent[i] + 21.5) / 1200) // 超出一個八度
        Cent[i] = (Cent[i] % 1200 + 1200) % 1200
        // 下面是處理模糊徽位
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
        if (Type[i] === 'zh') {
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
// console.log(Position2Pitch('8.4,7;s,5;s,1', '1', '1', '4', '0', '347.654321', '3'))
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


// console.log(test('2,1;[3;5,4;2];2;4;[9,5];3,4;6'))