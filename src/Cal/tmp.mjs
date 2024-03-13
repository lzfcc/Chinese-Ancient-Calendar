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
    get pitch() {
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
        return Number(frc(freq))
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

const Portion2Interval = (a, mode) => { // mode 0 音名 1唱名 
    while (Number(a) < 1) {
        a = a.mul(2)
    }
    while (Number(a) > 2) {
        a = a.div(2)
    }
    a = a.toFraction(false)
    const got = FushionList2.find(obj => obj.freq === a)
    return got
    // if (got) {
    //     if (mode === 0) {
    //         return got.name
    //     } else {
    //         return got.pitch
    //     }
    // } else {
    //     return '沒有音'
    // }
}

const Portion2Pitch = (portion, one, OneDif) => { // 輸入一弦頻率、一弦是否調了，輸出音名
    const Base = frc(one).div(OneDif || 1)
    return Portion2Interval(frc(portion).div(Base).toFraction(false), 1)
}

export const FretPitch = (TuningMode, n) => { // 徽位音。弦法、宮弦
    let { Zhun, Hui, OneDifHui, OneDifZhun } = eval('Tuning' + TuningMode)(432, +n)
    let ZhunPrint = [], HuiPrint = [], ZhunNameList = [], ZhunNameBList = [], HuiNameList = [], HuiNameBList = []
    for (let i = 1; i <= 7; i++) { // 七弦
        let ZhunPitch = [], HuiPitch = [], HuiNameTmp = [], ZhunNameTmp = [], HuiNameBTmp = [], ZhunNameBTmp = []
        let sample = []
        if (Zhun) {
            for (let k = 16; k >= 0; k--) { // 15徽  這樣就行 16=散  我定義的
                // Zhun 準法律七弦散音頻率比    
                ZhunPitch[k] = frc(Zhun[i]).div(Fret2Leng(k)).toFraction(false)
                ZhunNameTmp[k] = Portion2Interval(ZhunPitch[k], 2) // ZhunPitch是頻率比分數 知道頻率比，在對象中找到對應的音名唱名  
                ZhunNameBTmp[k] = Portion2Pitch(ZhunPitch[k], Zhun[1], OneDifZhun || 1) // 上面唱名，這個音名 對
                ZhunPitch[k] += `</br>`
                ZhunPitch[k] += ZhunNameTmp[k] ? ZhunNameTmp[k] + ' ' : ''
                ZhunPitch[k] += ZhunNameBTmp[k] || ''
            }
            ZhunNameList = ZhunNameList.concat(ZhunNameTmp)
            ZhunNameBList = ZhunNameBList.concat(ZhunNameBTmp)
            ZhunPrint = ZhunPrint.concat({
                title: NumList[i],
                data: ZhunPitch
            })
        }
    }
    // 排序
    // ZhunNameList 算一個去一個要去105次，最後只用去1次
    ZhunNameList.sort((obj1, obj2) => obj1.cent - obj2.cent)
    ZhunNameBList.sort((obj1, obj2) => obj1.cent - obj2.cent)
    // 去重 
    ZhunNameList = ZhunNameList.map(obj => obj.nameString(1))
    ZhunNameBList = ZhunNameList.map(obj => obj.nameString(2))

    const ZhunNamePrint = [ZhunNameBList, ZhunNameList]
    return { ZhunPrint, ZhunNamePrint }
}
// console.log(FretPitch(1))


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