import { big, frc } from './para_constant.mjs'
import { Frac2FalseFrac, BigFrc } from './equa_math.mjs'
class Interval {
    constructor(cate = 0, pitch = 'C', half = 0, comma = 0, freq = '1') {
        this.cate = cate
        this.pitch = pitch
        this.half = half
        this.freq = freq
        this.comma = comma
    }
    static NameMap = {
        C: 1, D: 2, E: 3, F: 4, G: 5, A: 6, B: 7
    }
    static HalfMap = {
        1: '♯', 2: '𝄪', 0: '', '-1': '♭', '-2': '𝄫'
    }
    get name() {
        return Interval.NameMap[this.pitch]
    }
    nameString(mode) {
        let str = ''
        if (mode === 1) {
            str = this.pitch
        } else if (mode === 2) {
            str = this.name
        }
        let commaString = '', halfString = ''
        if (this.half > 0) {
            halfString = Interval.HalfMap[this.half]
        } else
            if (this.comma > 0) {
                commaString = 'upline' + this.comma
                return `${halfString}<span class="${commaString}">${str}</span>`
            } else if (this.comma < 0) {
                commaString = 'dnline' + -this.comma
                return `${halfString}<span class="${commaString}">${str}</span>`
            } else return str
    }
    get cent() {
        return Number(frc(this.freq))
    }
}
// 0  1  2
// 音名
// 唱名
// 頻率比

const FushionList2 = [
    new Interval(0, 'C', 0, 0, '1'),
    new Interval(2, 'C', 1, -2, '25/24'),
    new Interval(1, 'D', -1, 0, '256/243'),
    new Interval(2, 'C', 1, -1, '135/128'),
    new Interval(2, 'D', -1, 1, '16/15'),
    new Interval(1, 'C', 1, 0, '2187/2048'),
    new Interval(2, 'D', -1, 2, '27/25'),
    new Interval(1, 'E', -2, 0, '65536/59049'),
    new Interval(2, 'D', 0, -1, '10/9'),
    new Interval(0, 'D', 0, 0, '9/8'),
    new Interval(2, 'E', -2, 2, '256/225'),
    new Interval(2, 'D', 1, -2, '75/64'),
    new Interval(1, 'E', -1, 0, '32/27'),
    new Interval(2, 'E', -1, 1, '6/5'),
    new Interval(1, 'D', 1, 0, '19683/16384'),
    new Interval(2, 'E', 0, -2, '100/81'),
    new Interval(1, 'F', -1, 0, '8192/6561'),
    new Interval(2, 'E', 0, -1, '5/4'),
    new Interval(0, 'E', 0, 0, '81/64'),
    new Interval(2, 'F', -1, 2, '32/25'),
    new Interval(2, 'E', 1, -2, '675/512'),
    new Interval(0, 'F', 0, 0, '4/3'),
    new Interval(2, 'F', 0, 1, '27/20'),
    new Interval(1, 'E', 1, 0, '177147/131072'),
    new Interval(2, 'F', 1, -2, '25/18'),
    new Interval(1, 'G', -1, 0, '1024/729'),
    new Interval(2, 'F', 1, -1, '45/32'),
    new Interval(2, 'G', -1, 1, '64/45'),
    new Interval(1, 'F', 1, 0, '729/512'),
    new Interval(2, 'G', -1, 2, '36/25'),
    new Interval(1, 'A', -2, 0, '262144/177147'),
    new Interval(2, 'G', 0, -1, '40/27'),
    new Interval(0, 'G', 0, 0, '3/2'),
    new Interval(2, 'G', 1, -2, '25/16'),
    new Interval(1, 'A', -1, 0, '128/81'),
    new Interval(2, 'G', 1, -1, '405/256'),
    new Interval(2, 'A', -1, 1, '8/5'),
    new Interval(1, 'G', 1, 0, '6561/4096'),
    new Interval(1, 'B', -2, 0, '32768/19683'),
    new Interval(2, 'A', 0, -1, '5/3'),
    new Interval(1, 'A', 0, 0, '27/16'),
    new Interval(2, 'A', 1, -2, '225/128'),
    new Interval(1, 'B', -1, 0, '16/9'),
    new Interval(2, 'B', -1, 1, '9/5'),
    new Interval(1, 'A', 1, 0, '59049/32768'),
    new Interval(2, 'B', 0, -2, '50/27'),
    new Interval(1, 'C', -1, 0, '4096/2187'),
    new Interval(2, 'B', 0, -1, '15/8'),
    new Interval(2, 'C', -1, 1, '256/135'),
    new Interval(1, 'B', 0, 0, '243/128'),
    new Interval(2, 'C', -1, 2, '48/25'),
    new Interval(1, 'D', -2, 0, '1048576/531441'),
    new Interval(0, 'C', 0, 0, '2'),
]
const FushionList = { // 這是五度律、純律混合在一起。除了 C D F G 是共用，其他加了上下線的都是純律。第一個數字 0 共用，1 五度律，2 純律
    0: [0, 'C', '1', '1'],
    70.67: [2, '♯<span class="dnline2">C</span>', '♯<span class="dnline2">1</span>', '25/24'], // 小半音
    90.22: [1, '♭D', '♭2', '256/243'],
    92.18: [2, '♯<span class="dnline1">C</span>', '♯<span class="dnline1">1</span>', '135/128'],
    111.73: [2, '♭<span class="upline1">D</span>', '♭<span class="upline1">2</span>', '16/15'],
    113.69: [1, '♯C', '♯1', '2187/2048'],
    133.24: [2, '♭<span class="upline2">D</span>', '♭<span class="upline2">2</span>', '27/25'],
    182.40: [2, '<span class="dnline1">D</span>', '<span class="dnline1">2</span>', '10/9'],

    203.91: [0, 'D', '2', '9/8'],

    274.58: [2, '♯<span class="dnline2">D</span>', '♯<span class="dnline2">2</span>', '75/64'],
    294.13: [1, '♭E', '♭3', '32/27'],
    315.64: [2, '♭<span class="upline1">E</span>', '♭<span class="upline1">3</span>', '6/5'],
    317.60: [1, '♯D', '♯2', '19683/16384'],
    364.81: [2, '<span class="dnline2">E</span>', '<span class="dnline2">3</span>', '100/81'],
    384.36: [1, '♭F', '♭4', '8192/6561'],
    386.31: [2, '<span class="dnline1">E</span>', '<span class="dnline1">3</span>', '5/4'],

    407.82: [0, 'E', '3', '81/64'],

    427.37: [2, '♭<span class="upline2">F</span>', '♭<span class="upline2">4</span>', '32/25'],
    478.49: [2, '♯<span class="dnline2">E</span>', '♯<span class="dnline2">3</span>', '675/512'],
    498.04: [1, 'F', '4', '4/3'],
    519.55: [2, '<span class="upline1">F</span>', '<span class="upline1">4</span>', '27/20'],
    521.51: [1, '♯E', '♯3', '177147/131072'],
    568.72: [2, '♯<span class="dnline2">F</span>', '♯<span class="dnline2">4</span>', '25/18'],
    588.27: [1, '♭G', '♭5', '1024/729'],
    590.22: [2, '♯<span class="dnline1">F</span>', '♯<span class="dnline1">4</span>', '45/32'],
    609.77: [2, '♭<span class="upline1">G</span>', '♭<span class="upline1">5</span>', '64/45'],
    611.73: [1, '♯F', '♯4', '729/512'],
    631.28: [2, '♭<span class="upline2">G</span>', '♭<span class="upline2">5</span>', '36/25'],
    680.45: [2, '<span class="dnline1">G</span>', '<span class="dnline1">5</span>', '40/27'],

    701.96: [0, 'G', '5', '3/2'],

    772.63: [2, '♯<span class="dnline2">G</span>', '♯<span class="dnline2">5</span>', '25/16'],
    792.18: [1, '♭A', '♭6', '128/81'],
    794.13: [2, '♯<span class="dnline1">G</span>', '♯<span class="dnline1">5</span>', '405/256'],
    813.69: [2, '♭<span class="upline1">A</span>', '♭<span class="upline1">6</span>', '8/5'],
    815.64: [1, '♯G', '♯5', '6561/4096'],
    884.36: [2, '<span class="dnline1">A</span>', '<span class="dnline1">6</span>', '5/3'],
    905.87: [1, 'A', '6', '27/16'],
    976.54: [2, '♯<span class="dnline2">A</span>', '♯<span class="dnline2">6</span>', '225/128'],
    996.09: [1, '♭B', '♭7', '16/9'],
    1017.59: [2, '♭<span class="upline1">B</span>', '♭<span class="upline1">7</span>', '9/5'],
    1019.55: [1, '♯A', '♯6', '59049/32768'],
    1066.76: [2, '<span class="dnline2">B</span>', '<span class="dnline2">7</span>', '50/27'],
    1086.31: [1, '·♭C', '·♭1', '4096/2187'],
    1088.27: [2, '<span class="dnline1">B</span>', '<span class="dnline1">7</span>', '15/8'],
    1107.82: [2, '·♭<span class="upline1">C</span>', '·♭<span class="upline1">1</span>', '256/135'],
    1109.78: [1, 'B', '7', '243/128'],
    1129.33: [2, '·♭<span class="upline2">C</span>', '·♭<span class="upline2">1</span>', '48/25'],
    1200: [0, 'C', '1', '2']
}

const Unique = arr => Array.from(new Set(arr)).filter(x => x !== undefined)

const Portion2Name = (a, mode) => { // 輸入頻率比，輸出對應的唱名mode 1 音名 2唱名 
    a = frc(a)
    while (Number(a) < 1) {
        a = a.mul(2)
    }
    while (Number(a) > 2) {
        a = a.div(2)
    }
    a = a.toFraction(false)
    for (const [key, value] of Object.entries(FushionList)) {
        if (value[3] === a) {
            return value[mode]
        }
    }
    // return '　'
}

const Portion2Pitch = (portion, one, OneDif) => { // 輸入一弦頻率、一弦是否調了，輸出音名
    const Base = frc(one).div(OneDif || 1)
    return Portion2Name(frc(portion).div(Base).toFraction(false), 1)
}

const Name2Freq = a => { // 輸入音名輸出對應頻率
    for (const [key, value] of Object.entries(FushionList)) {
        if (value[1] === a || value[2] === a || value[3] === a) {
            return key
        }
    }
}
// console.log(Name2Freq('♭G'))

const Freq2Pitch = a => { // 輸入頻率比，輸出對應的唱名
    a = frc(a)
    while (Number(a) < 1) {
        a = a.mul(2)
    }
    while (Number(a) > 2) {
        a = a.div(2)
    }
    a = a.toFraction(false)
    for (const [key, value] of Object.entries(FushionList)) {
        if (value[3] === a) {
            return value[1]
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

export const Frequency = a => 2 ** (a / 1200)

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
    return +Number(Result).toFixed(4)
}
// console.log(Leng2Fret('11/20'))


const ExhastFret = () => { // 琴上所有徽位
    let List1 = [], List2 = [], List3 = [], List = []
    for (const [key, value] of Object.entries(FushionList)) {
        List1 = List1.concat(Leng2Fret(frc(1).div(value[3]).toFraction(false)))
    }
    for (const [key, value] of Object.entries(FushionList)) {
        List2 = List2.concat(Leng2Fret(frc(1).div(value[3]).div(2).toFraction(false)))
    }
    for (const [key, value] of Object.entries(FushionList)) {
        List3 = List3.concat(Leng2Fret(frc(1).div(value[3]).div(4).toFraction(false)))
    }
    List1 = Unique(List1)
    List1 = List1.sort((a, b) => a - b)
    List2 = Unique(List2)
    List2 = List2.sort((a, b) => a - b)
    List3 = Unique(List3)
    List3 = List3.sort((a, b) => a - b)
    for (let i = 0; i < List2.length; i++) {
        List[i] = List1[i] + '，' + List2[i] + '，' + List3[i] + '。'
    }
    return List
}
// console.log(ExhastFret())

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
        const Tmp = Number(upA[i])
        upA[i] = upA[i].toFraction(true)
        Cent1[i] = OctaveCent(Tmp, x).Cent.toFixed(8)
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
        const Tmp = Number(downB[i])
        downB[i] = downB[i].toFraction(true)
        Cent2[i] = OctaveCent(Tmp, x).Cent.toFixed(8)
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

const TuningSub2 = (List, a, n) => { // 把默認的宮弦換成自定義的宮弦
    if (a !== n && n !== 0) {
        const p = frc(1).div(List[n])
        for (let i = 1; i <= 7; i++) {
            List[i] = frc(List[i]).mul(p).toFraction(false)
        }
    }
    return List
}

const TuningSub3 = (PortionList, Unmoved, Unmoved2Five, Freq) => { // 各弦頻率比，那根弦沒動作為基準，這根弦到五弦正調的比例，五弦基準頻率
    Freq = frc(Unmoved2Five).mul(Freq)
    const FreqList = []
    for (let i = 1; i <= 7; i++) {
        FreqList[i] = Number(frc(Freq).mul(frc(PortionList[i]).div(PortionList[Unmoved])))
    }
    return FreqList
}

const Tuning1 = (Freq = 432, n = 3) => { // 正調. 五弦基準頻率，默認宮弦，自定宮弦
    let Zhun = [], Hui = [], Mix = [], Xin = []
    const a = 3
    Zhun[a] = '1'
    Hui[a] = '1'
    Mix[a] = '1'
    // 準法律
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[5] = TuningSub1(Zhun[7], 5, 4)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    // 徽法律
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[4] = TuningSub1(Hui[6], 5, 4)
    Hui[5] = TuningSub1(Hui[3], 6, 7)
    Hui[7] = TuningSub1(Hui[5], 4, 5)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    // 混合
    Mix[6] = TuningSub1(Mix[3], 5, 7)
    Mix[1] = TuningSub1(Mix[3], 5, 4)
    Mix[4] = TuningSub1(Mix[6], 5, 4)
    Mix[5] = TuningSub1(Mix[3], 6, 7)
    Mix[7] = TuningSub1(Mix[4], 5, 7)
    Mix[2] = TuningSub1(Mix[7], 7, 4)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    Mix = TuningSub2(Mix, a, n)
    const ZhunFreq = TuningSub3(Zhun, 5, '1', Freq)
    const HuiFreq = TuningSub3(Hui, 5, '1', Freq)
    const MixFreq = TuningSub3(Mix, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = Freq
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, Mix, ZhunFreq, HuiFreq, MixFreq, Name: '正調' }
}
// console.log(Tuning1(432, 1).Zhun)

const Tuning2 = (Freq = 432, n = 5) => {  // 蕤賓調緊五 2 3 5 6 1 2 3
    let Zhun = [], Hui = [], Mix = [], Xin = []
    const a = 5
    Zhun[a] = '1'
    Hui[a] = '1'
    Mix[a] = '1'
    // 準法律
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[1] = TuningSub1(Zhun[6], 7, 4)
    // 徽法律
    Hui[3] = TuningSub1(Hui[5], 5, 4)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[4] = TuningSub1(Hui[5], 6, 5)
    Hui[7] = TuningSub1(Hui[5], 6, 7)
    Hui[2] = TuningSub1(Hui[5], 6, 4)
    // 混合
    Mix[3] = TuningSub1(Mix[5], 5, 4)
    Mix[1] = TuningSub1(Mix[3], 5, 4)
    Mix[6] = TuningSub1(Mix[3], 5, 7)
    Mix[4] = TuningSub1(Mix[6], 5, 4)
    Mix[7] = TuningSub1(Mix[5], 6, 7)
    Mix[2] = TuningSub1(Mix[5], 6, 4)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    Mix = TuningSub2(Mix, a, n)
    const ZhunFreq = TuningSub3(Zhun, 3, '64/81', Freq)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    const MixFreq = TuningSub3(Mix, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, Mix, ZhunFreq, HuiFreq, MixFreq, Name: '蕤賓調緊五' }
}

const Tuning3 = (Freq = 432, n = 2) => {  // 清商調緊二五七 6 1 2 3 5 6 7
    let Zhun = [], Hui = [], Mix = [], Xin = []
    const a = 2
    Zhun[a] = '1'
    Hui[a] = '1'
    Mix[a] = '1'
    // 準法律
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[2], 4, 7)
    // 徽法律
    Hui[4] = TuningSub1(Hui[2], 6, 7)
    Hui[5] = TuningSub1(Hui[2], 5, 7)
    Hui[3] = TuningSub1(Hui[5], 5, 4)
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Hui[1] = TuningSub1(Hui[6], 7, 4)
    Hui[7] = TuningSub1(Hui[2], 4, 7)
    // 混合
    Mix[4] = TuningSub1(Mix[2], 6, 7)
    Mix[5] = TuningSub1(Mix[2], 5, 7)
    Mix[3] = TuningSub1(Mix[5], 5, 4)
    Mix[6] = TuningSub1(Mix[3], 5, 7)
    Mix[1] = TuningSub1(Mix[6], 7, 4)
    Mix[7] = TuningSub1(Mix[2], 4, 7)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    Mix = TuningSub2(Mix, a, n)
    const ZhunFreq = TuningSub3(Zhun, 3, '64/81', Freq)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    const MixFreq = TuningSub3(Mix, 3, '4/5', Freq)
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[6] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, Mix, ZhunFreq, HuiFreq, MixFreq, Name: '淸商調緊二五七' }
}

const Tuning4 = (Freq = 432, n = 1) => {  // 慢角調慢三 1 2 3 5 6 1 2
    let Zhun = [], Hui = [], Mix = [], Xin = []
    const a = 1
    Zhun[a] = '1'
    Hui[a] = '1'
    Mix[a] = '1'
    // 準法律
    Zhun[4] = TuningSub1(Zhun[1], 5, 7)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[1], 4, 7)
    // 徽法律
    Hui[4] = TuningSub1(Hui[1], 5, 7)
    Hui[7] = TuningSub1(Hui[4], 5, 7)
    Hui[2] = TuningSub1(Hui[4], 5, 4)
    Hui[3] = TuningSub1(Hui[1], 6, 7)
    Hui[5] = TuningSub1(Hui[3], 4, 5)
    Hui[6] = TuningSub1(Hui[1], 4, 7)
    // 混合
    Mix[4] = TuningSub1(Mix[1], 5, 7)
    Mix[7] = TuningSub1(Mix[4], 5, 7)
    Mix[2] = TuningSub1(Mix[4], 5, 4)
    Mix[3] = TuningSub1(Mix[1], 6, 7)
    Mix[5] = TuningSub1(Mix[2], 5, 7)
    Mix[6] = TuningSub1(Mix[1], 4, 7)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    Mix = TuningSub2(Mix, a, n)
    // const ZhunFreq = TuningSub3(Zhun, 2, '2/3', Freq)
    const ZhunFreq = TuningSub3(Zhun, 5, '1', Freq)
    const HuiFreq = TuningSub3(Hui, 5, '1', Freq)
    const MixFreq = TuningSub3(Mix, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Mix, Xin, ZhunFreq, HuiFreq, MixFreq, Name: '慢角調慢三' }
}

const Tuning5 = (Freq = 432, n = 4) => {  // 慢宮調慢一三六 3 5 6 1 2 3 5
    let Zhun = [], Hui = [], Mix = [], Xin = []
    const a = 4
    Zhun[a] = '1'
    Hui[a] = '1'
    Mix[a] = '1'
    // 準法律
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[5] = TuningSub1(Zhun[7], 5, 4)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[6], 7, 4)
    // 徽法律    
    Hui[3] = TuningSub1(Hui[4], 6, 5)
    Hui[6] = TuningSub1(Hui[4], 6, 7)
    Hui[1] = TuningSub1(Hui[6], 7, 4)
    Hui[2] = TuningSub1(Hui[4], 5, 4)
    Hui[7] = TuningSub1(Hui[4], 5, 7)
    Hui[5] = TuningSub1(Hui[7], 5, 4)
    // 混合
    Mix[6] = TuningSub1(Mix[4], 6, 7)
    Mix[1] = TuningSub1(Mix[6], 7, 4)
    Mix[2] = TuningSub1(Mix[4], 5, 4)
    Mix[7] = TuningSub1(Mix[4], 5, 7)
    Mix[5] = TuningSub1(Mix[7], 5, 4)
    Mix[3] = TuningSub1(Mix[5], 5, 4)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    Mix = TuningSub2(Mix, a, n)
    const ZhunFreq = TuningSub3(Zhun, 5, '1', Freq)
    const HuiFreq = TuningSub3(Hui, 5, '1', Freq)
    const MixFreq = TuningSub3(Mix, 5, '1', Freq)

    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[2] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return {
        Zhun, Hui, Mix, Xin, ZhunFreq, HuiFreq, MixFreq,
        OneDifZhun: '243/256',
        OneDifHui: '15/16',
        Name: '慢宮調慢一三六'
    }
}

const Tuning6 = (Freq = 432, n = 3) => {  // 徽法律淒涼調緊二五 5 #6 1 2 4 5 6
    let Hui = [], Xin = []
    const a = 3
    Hui[a] = '1'
    // 徽法律
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[4] = TuningSub1(Hui[6], 5, 4)
    Hui[7] = TuningSub1(Hui[3], 3, 5)
    Hui[5] = TuningSub1(Hui[3], 4, 5)
    Hui[2] = TuningSub1(Hui[6], 5, 3)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui = TuningSub2(Hui, a, n)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[6] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq, Name: '淒涼調緊二五' }
}

const Tuning7 = (Freq = 432, n = 1) => {  // 黃鐘調緊五慢一 1 3 5 6 1 2 3 或 4 6 1 2 4 5 6
    let Zhun = [], Hui = [], Xin = []
    const a = 1
    Zhun[a] = '1'
    Hui[a] = '1'
    // 準法律
    Zhun[5] = TuningSub1(Zhun[1], 4, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[4] = TuningSub1(Zhun[6], 5, 4)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    // 徽法律
    Hui[2] = TuningSub1(Hui[1], 3, 4)
    Hui[3] = TuningSub1(Hui[1], 5, 7)
    Hui[4] = TuningSub1(Hui[1], 3, 5)
    Hui[5] = TuningSub1(Hui[1], 4, 7)
    Hui[7] = TuningSub1(Hui[2], 4, 7)
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    const ZhunFreq = TuningSub3(Zhun, 3, '64/81', Freq)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[1] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return {
        Zhun, Hui, Xin, ZhunFreq, HuiFreq,
        OneDifZhun: '8/9',
        OneDifHui: '9/10', Name: '黃鐘調緊五慢一'
    }
}

const Tuning8 = (Freq = 432, n = 1) => {  // 無媒調慢三六 1 2 3 5 6 7 2 或 4 5 6 1 2 3 5
    let Zhun = [], Hui = [], Xin = []
    const a = 1
    Zhun[a] = '1'
    Hui[a] = '1'
    // 準法律
    Zhun[4] = TuningSub1(Zhun[1], 5, 7)
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[7], 7, 4)
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
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
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    // const ZhunFreq = TuningSub3(Zhun, 2, '2/3', Freq)
    const ZhunFreq = TuningSub3(Zhun, 5, '1', Freq)
    const HuiFreq = TuningSub3(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq, Name: '无媒調慢三六' }
}

const Tuning9 = (Freq = 432, n = 4) => {  // 間弦一慢一三 7 2 3 5 6 1 2 或 3 5 6 1 2 4 5
    let Zhun = [], Hui = [], Xin = []
    const a = 4
    Zhun[a] = '1'
    Hui[a] = '1'
    // 準法律
    Zhun[7] = TuningSub1(Zhun[4], 5, 7)
    Zhun[2] = TuningSub1(Zhun[4], 5, 4)
    Zhun[5] = TuningSub1(Zhun[2], 5, 7)
    Zhun[6] = TuningSub1(Zhun[4], 4, 5)
    Zhun[3] = TuningSub1(Zhun[5], 5, 4)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    // 徽法律
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Hui[5] = TuningSub1(Hui[6], 6, 5)
    Hui[7] = TuningSub1(Hui[5], 4, 5)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    Hui[3] = TuningSub1(Hui[4], 6, 5)
    Hui[1] = TuningSub1(Hui[3], 5, 4) // 這樣是低了兩個音差
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    const ZhunFreq = TuningSub3(Zhun, 4, '8/9', Freq)
    const HuiFreq = TuningSub3(Hui, 4, '9/10', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[2] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return {
        Zhun, Hui, Xin, ZhunFreq, HuiFreq,
        OneDifZhun: '243/256',
        OneDifHui: '243/256', Name: '間弦一慢一三'
    }
}

const Tuning10 = (Freq = 432, n = 1) => {  // 徽法律間弦二緊五慢三 1 2 3 5 #6 1 2 或 2 3 b5 6 1 2 3
    let Hui = [], Xin = []
    const a = 1
    Hui[a] = '1'
    // 徽法律
    // 陳應時法
    Hui[3] = TuningSub1(Hui[1], 4, 5)
    Hui[5] = TuningSub1(Hui[3], 4, 5)
    Hui[7] = TuningSub1(Hui[5], 3, 4)
    Hui[4] = TuningSub1(Hui[1], 5, 7)
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    Hui[3] = TuningSub1(Hui[1], 3, 4)
    Hui = TuningSub2(Hui, a, n)
    const HuiFreq = TuningSub3(Hui, 2, '2/3', Freq)
    // 我
    // Hui[3] = TuningSub1(Hui[1], 6, 7)
    // Hui[4] = TuningSub1(Hui[1], 5, 7)
    // Hui[5] = TuningSub1(Hui[4], 5, 6)
    // Hui[7] = TuningSub1(Hui[5], 6, 7)
    // Hui[2] = TuningSub1(Hui[7], 7, 4)
    // Hui[6] = TuningSub1(Hui[1], 4, 7)
    // const HuiFreq = TuningSub3(Hui, 2, '2/3', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[1]
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq, Name: '間弦二緊五慢三' }
}

const Tuning11 = (Freq = 432, n = 3) => { // 徽法律平調慢五七 5 b6 1 2 b3 5 b6 或 3 4 5 7 1 3 4
    let Hui = [], Xin = []
    const a = 3
    Hui[a] = '1'
    // 徽法律
    Hui[5] = TuningSub1(Hui[3], 5, 6)
    Hui[7] = TuningSub1(Hui[3], 4, 6)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[4] = TuningSub1(Hui[1], 5, 7)
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[2] = TuningSub1(Hui[7], 7, 4)
    Hui = TuningSub2(Hui, a, n)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[4] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[11] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[4]
    return { Hui, Xin, HuiFreq, Name: '日傳平調慢五七' }
}

const Tuning12 = (Freq = 432, n = 2) => {  // 徽法律側商調慢三四六 #6 1 2 3 5 6 1 或 1 2 3 b5 6 b1 2
    let Hui = [], Xin = []
    const a = 2
    Hui[a] = '1'
    // 徽法律
    Hui[4] = TuningSub1(Hui[2], 6, 7)
    Hui[6] = TuningSub1(Hui[4], 4, 5)
    Hui[5] = TuningSub1(Hui[2], 5, 7)
    Hui[7] = TuningSub1(Hui[2], 4, 7)
    Hui[3] = TuningSub1(Hui[5], 5, 4)
    Hui[1] = TuningSub1(Hui[5], 5, 3)
    Hui = TuningSub2(Hui, a, n)
    const HuiFreq = TuningSub3(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[9] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq, Name: '側商調慢三四六' }
}

const Tuning13 = (Freq = 432, n = 7) => {  // 徽法律側羽調緊七
    let Hui = [], Xin = []
    const a = 7
    Hui[a] = '1'
    // 徽法律
    Hui[6] = TuningSub1(Hui[7], 6, 5)
    Hui[5] = TuningSub1(Hui[6], 6, 5)
    Hui[4] = TuningSub1(Hui[6], 5, 4)
    Hui[3] = TuningSub1(Hui[6], 7, 5)
    Hui[2] = TuningSub1(Hui[3], 6, 5)
    Hui[1] = TuningSub1(Hui[6], 7, 4)
    Hui = TuningSub2(Hui, a, n)
    const HuiFreq = TuningSub3(Hui, 5, '1', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[9] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return { Hui, Xin, HuiFreq, Name: '側羽調緊七' }
}

const Tuning14 = (Freq = 432, n = 5) => {  // 徽法側蜀調緊二慢五 5 #6 1 2 b3 5 6
    let Zhun = [], Hui = [], Xin = []
    const a = 3
    Zhun[a] = '1'
    Hui[a] = '1'
    // 按音調弦
    Zhun[6] = TuningSub1(Zhun[3], 5, 7)
    Zhun[1] = TuningSub1(Zhun[3], 5, 4)
    Zhun[4] = TuningSub1(Zhun[6], 16, 10)
    Zhun[2] = TuningSub1(Zhun[4], 16, '10 65/81')
    Zhun[5] = TuningSub1(Zhun[2], '9 8/9', 16) // '9 8/9'五是純律，七是五度律。如果是10，五是五度律，七是純律。
    Zhun[7] = TuningSub1(Zhun[5], '9 8/15', 16)
    // 徽
    Hui[6] = TuningSub1(Hui[3], 5, 7)
    Hui[1] = TuningSub1(Hui[3], 5, 4)
    Hui[2] = TuningSub1(Hui[1], 5, 6)
    Hui[7] = TuningSub1(Hui[3], 3, 5)
    Hui[4] = TuningSub1(Hui[7], 7, 5)
    Hui[5] = TuningSub1(Hui[6], 4, 3)
    Zhun = TuningSub2(Zhun, a, n)
    Hui = TuningSub2(Hui, a, n)
    const ZhunFreq = TuningSub3(Zhun, 3, '4/5', Freq)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[6] / 2
    Xin[3] = +List12[8] / 2
    Xin[4] = +List12[10] / 2
    Xin[5] = +List12[11] / 2
    Xin[6] = +List12[3]
    Xin[7] = +List12[5]
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq, Name: '側蜀調緊二慢五' }
}

const Tuning15 = (Freq = 432, n = 2) => {  // 徽法律側楚調慢一二緊五七
    let Hui = [], Xin = []
    const a = 2
    Hui[a] = '1'
    // 徽法律
    Hui[1] = TuningSub1(Hui[2], 6, 5)
    Hui[3] = TuningSub1(Hui[2], 6, 7)
    Hui[5] = TuningSub1(Hui[1], 4, 7)
    Hui[7] = TuningSub1(Hui[5], 4, 5)
    Hui[6] = TuningSub1(Hui[7], 6, 5)
    Hui[4] = TuningSub1(Hui[5], 6, 5)
    Hui = TuningSub2(Hui, a, n)
    const HuiFreq = TuningSub3(Hui, 3, '4/5', Freq)
    // 新法密率
    const List12 = EqualTemp(Freq).List1
    Xin[1] = +List12[3] / 2
    Xin[2] = +List12[5] / 2
    Xin[3] = +List12[7] / 2
    Xin[4] = +List12[9] / 2
    Xin[5] = +List12[12] / 2
    Xin[6] = +List12[2]
    Xin[7] = +List12[5]
    return {
        Hui, Xin, HuiFreq,
        OneDifHui: '9/10', Name: '側楚調慢一二緊五七'
    }
}

const NumList = '〇一二三四五六七八九'

export const Tuning = (TuningMode, Freq = 432, n) => {
    const { Zhun, Hui, Xin, Mix, ZhunFreq, HuiFreq, OneDifZhun, OneDifHui, Name } = eval('Tuning' + TuningMode)(Freq, +n)
    const DifZhun = [], NameZhun = [], DifHui = [], NameHui = [], NameMix = [], PitchZhun = [], PitchHui = []
    if (Zhun) {
        for (let i = 1; i <= 6; i++) {
            DifZhun[i] = OctaveCent(Zhun[i + 1], Zhun[i]).Cent.toFixed(1)
        }
        for (let i = 1; i <= 7; i++) {
            NameZhun[i] = Portion2Name(Zhun[i], 2)
            PitchZhun[i] = Portion2Pitch(Zhun[i], Zhun[1], OneDifZhun || 1)
        }
    }
    if (Hui) {
        for (let i = 1; i <= 6; i++) {
            DifHui[i] = OctaveCent(Hui[i + 1], Hui[i]).Cent.toFixed(1)
        }
        for (let i = 1; i <= 7; i++) {
            NameHui[i] = Portion2Name(Hui[i], 2)
            PitchHui[i] = Portion2Pitch(Hui[i], Hui[1], OneDifHui || 1)
        }
    }
    if (Mix) {
        for (let i = 1; i <= 7; i++) {
            NameMix[i] = Portion2Name(Mix[i], 2)
        }
    }
    let Print = []
    for (let i = 1; i <= 7; i++) {
        const Tmp = Zhun ? [Zhun[i], PitchZhun[i], NameZhun[i], +(ZhunFreq[i].toFixed(4)), DifZhun[i - 1]] : ['', '', '', '']
        const Tmp1 = Mix ? [Mix[i], NameMix[i]] : ['', '']
        Print = Print.concat({
            title: NumList[i],
            data: [...Tmp, Hui[i], PitchHui[i], NameHui[i], +(HuiFreq[i].toFixed(4)), DifHui[i - 1], ...Tmp1, Xin[i]]
        })

    }
    return { Name, Print }
}
// console.log(Tuning(12))

export const FretPitch = (TuningMode, n) => { // 徽位音。弦法、宮弦
    let { Zhun, Hui, OneDifHui, OneDifZhun } = eval('Tuning' + TuningMode)(432, +n)
    let ZhunPrint = [], HuiPrint = [], ZhunNameList = [], ZhunNameBList = [], HuiNameList = [], HuiNameBList = []
    for (let i = 1; i <= 7; i++) { // 七弦
        let ZhunPitch = [], HuiPitch = [], HuiNameTmp = [], ZhunNameTmp = [], HuiNameBTmp = [], ZhunNameBTmp = []
        let sample = []

        for (let k = 0; k <= 15; k++) { // 15徽 
            if (Zhun) { // Zhun 準法律七弦散音頻率比                 
                ZhunPitch[k] = frc(Zhun[i]).div(Fret2Leng(k)).toFraction(false) // 這個是核心，其他都是附帶
                ZhunNameTmp[k] = Portion2Name(ZhunPitch[k], 2) // ZhunPitch是頻率比分數 知道頻率比，在對象中找到對應的音名唱名  
                ZhunNameBTmp[k] = Portion2Pitch(ZhunPitch[k], Zhun[1], OneDifZhun || 1)
                ZhunPitch[k] += `</br>`
                ZhunPitch[k] += ZhunNameTmp[k] ? ZhunNameTmp[k] + ' ' : ''
                ZhunPitch[k] += ZhunNameBTmp[k] || ''
            }
            // 徽法律 有些沒有準法律
            HuiPitch[k] = frc(Hui[i]).div(Fret2Leng(k)).toFraction(false)
            HuiNameTmp[k] = Portion2Name(HuiPitch[k], 2)
            HuiNameBTmp[k] = Portion2Pitch(HuiPitch[k], Hui[1], OneDifHui || 1)
            HuiPitch[k] += `</br>`
            HuiPitch[k] += HuiNameTmp[k] ? HuiNameTmp[k] + ' ' : ''
            HuiPitch[k] += HuiNameBTmp[k] || ''
        }
        if (Zhun) {
            ZhunNameList = ZhunNameList.concat(ZhunNameTmp)
            ZhunNameBList = ZhunNameBList.concat(ZhunNameBTmp) // 右邊這個每個循環清空
            ZhunPitch = ZhunPitch.reverse()
            ZhunPitch = [Zhun[i], ...ZhunPitch]
            ZhunPrint = ZhunPrint.concat({
                title: NumList[i],
                data: ZhunPitch
            })
        }
        HuiNameList = HuiNameList.concat(HuiNameTmp)
        HuiNameBList = HuiNameBList.concat(HuiNameBTmp)
        HuiPitch = HuiPitch.reverse()
        HuiPitch = [Hui[i], ...HuiPitch]
        HuiPrint = HuiPrint.concat({
            title: NumList[i],
            data: HuiPitch
        })
    }
    HuiNameList = Unique(HuiNameList) // 去重
    HuiNameBList = Unique(HuiNameBList)
    const HuiNamePrint = [{
        data: HuiNameBList
    }, {
        data: HuiNameList
    }]

    ZhunNameList = Unique(ZhunNameList)
    ZhunNameBList = Unique(ZhunNameBList)
    const ZhunNamePrint = [{
        data: ZhunNameBList
    }, {
        data: ZhunNameList
    }]
    return { ZhunPrint, HuiPrint, ZhunNamePrint, HuiNamePrint }
}

// console.log(FretPitch(1, 0))
// while (Number(ZhunPitch[k]) >= 2) {
//     ZhunPitch[k] = ZhunPitch[k].div(2)
// }
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
export const Position2Pitch = (Input, TuningMode, TempMode, isMixed, GongString, ZhiString, BaseFreq, OutputMode, isStrict) => { // ；品弦法；律制；是否是混合律制；宮弦；徵弦（宮弦徵弦只能二選一，另一個爲0）；宮弦頻率；輸出模式 1 唱名 2音名 3 與宮弦頻率比 4 頻率；
    TempMode = +TempMode
    isMixed = +isMixed
    if (TempMode === 3) {
        isMixed = 1
    }
    TuningMode = +TuningMode
    OutputMode = +OutputMode
    BaseFreq = +BaseFreq
    isStrict = +isStrict
    GongString = +GongString
    ZhiString = +ZhiString
    const { Zhun, Hui, Mix, ZhunFreq, HuiFreq, MixFreq } = eval('Tuning' + TuningMode)(BaseFreq, GongString)
    let StringList = [], FreqList = []
    if (TempMode === 1) {
        StringList = Zhun
        FreqList = ZhunFreq
    } else if (TempMode === 2) {
        StringList = Hui
        FreqList = HuiFreq
    } else if (TempMode === 3) {
        StringList = Mix
        FreqList = MixFreq
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
    const Type = [], String = [], Fret = [], Scale = [], Cent = [], Pitch = [], PitchPrint = []
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
            Scale[i] = StringList[String[i]]
        } else if (Type[i] === 'zh') {
            String[i] = String[i - 1]
            Scale[i] = Scale[i - 1].mul(TempMode === 1 ? '9/8' : '10/9')
        } else if (Type[i] === 'shang') {
            String[i] = String[i - 1]
            Scale[i] = Scale[i - 1].mul(TempMode === 1 ? '9/8' : '10/9')
        } else if (Type[i] === 'xia') {
            String[i] = String[i - 1]
            Scale[i] = Scale[i - 1].div(TempMode === 1 ? '9/8' : '10/9')
        } else if (Type[i] === 'qi' && Pre.length === 1) {
            String[i] = String[i - 1]
            Scale[i] = StringList[String[i]]
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
            Scale[i] = frc(1).div(Leng).mul(StringList[String[i]])
        }
        Cent[i] = Math.log2(Number(frc(Scale[i]))) * 1200 - (isZhi ? 498.045 : 0) // 若用徵弦作為基準，減純五度
        floor = Math.floor((Cent[i] + 21.5) / 1200) // 超出一個八度
        Cent[i] = (Cent[i] % 1200 + 1200) % 1200
        // 下面是處理模糊徽位
        if (isMixed === 0) {
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
        } else {
            for (const [key, value] of Object.entries(FushionList)) {
                const threshold = isStrict ? 0.1 : 10
                if (Cent[i] > +key - threshold && Cent[i] < +key + threshold) {
                    Pitch[i] = value[OutputMode <= 3 ? OutputMode : 3]
                    break
                }
            }
            if (isStrict === 0 && Pitch[i] === undefined) { // 這個用來對付徽位更不準的
                for (const [key, value] of Object.entries(FushionList)) { // 21.5普通音差
                    if (Cent[i] > +key - 21.5 && Cent[i] < +key + 21.5) {
                        Pitch[i] = value[OutputMode <= 3 ? OutputMode : 3]
                        break
                    }
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
            Pitch[i] = +Number(frc(FreqList[1]).div(StringList[1]).mul(Pitch[i])).toFixed(3)
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
// console.log(test('2,1;[3;5,4;2];2;4;[9,5];3,4;6'))


const Portion2Interval = (portion, one = 1, oneDif = 1) => {
    const base = frc(one).div(oneDif)
    let a = frc(portion).div(base)
    while (Number(a) < 1) {
        a = a.mul(2)
    }
    while (Number(a) > 2) {
        a = a.div(2)
    }
    const got = FushionList2.find(obj => obj.freq === a.toFraction(false))
    return got
}

export const FretPitch1 = (TuningMode, n) => { // 徽位音。弦法、宮弦
    let { Zhun, Hui, OneDifHui, OneDifZhun } = eval('Tuning' + TuningMode)(432, +n)
    let ZhunPrint = [], HuiPrint = [], ZhunNameList = [], ZhunNameBList = [], HuiNameList = [], HuiNameBList = []
    const set1 = new Set() // 用于去重
    const set2 = new Set()
    for (let i = 1; i <= 7; i++) { // 七弦
        let ZhunPitch = [], HuiPitch = [], HuiNameTmp = [], ZhunNameTmp = [], HuiNameBTmp = [], ZhunNameBTmp = []
        if (Zhun) {
            for (let k = 16; k >= 0; k--) { // 15徽 16=散
                // Zhun 準法律七弦散音頻率比    
                ZhunPitch[k] = frc(Zhun[i]).div(Fret2Leng(k)).toFraction(false)
                const tmp = Portion2Interval(ZhunPitch[k])
                const tmp1 = Portion2Interval(ZhunPitch[k], Zhun[1], OneDifZhun || 1)
                if (tmp && !set1.has(tmp.freq)) {
                    ZhunNameTmp[k] = tmp
                    set1.add(tmp.freq)
                }
                if (tmp && !set2.has(tmp.freq)) {
                    ZhunNameBTmp[k] = tmp1
                    set2.add(tmp.freq)
                }
                ZhunPitch[k] += `</br>`
                ZhunPitch[k] += ZhunNameTmp[k] ? ZhunNameTmp[k].nameString(2) + ' ' : ''
                ZhunPitch[k] += ZhunNameBTmp[k] ? ZhunNameBTmp[k].nameString(1) : ''
            }
            ZhunNameList = ZhunNameList.concat(ZhunNameTmp.filter(Boolean))
            ZhunNameBList = ZhunNameBList.concat(ZhunNameBTmp.filter(Boolean))
            ZhunPrint = ZhunPrint.concat({
                title: NumList[i],
                data: ZhunPitch
            })
        }
    }
    // 排序
    ZhunNameList.sort((obj1, obj2) => obj1.cent - obj2.cent)
    ZhunNameBList.sort((obj1, obj2) => obj1.cent - obj2.cent)
    const data = {
        ZhunPrint,
        ZhunNameBList: ZhunNameList.map(obj => obj.nameString(2)),
        ZhunNameList: ZhunNameList.map(obj => obj.nameString(1))
    }
    return data
}
// console.log(FretPitch1(1, 0))