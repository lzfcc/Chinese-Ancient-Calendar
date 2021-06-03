export const isSame = (arr1, arr2) => { // 判斷元數定母是否相等。https://blog.csdn.net/qq_25887937/article/details/97660928
    let flag = true
    if (arr1.length !== arr2.length) {
        flag = false
    } else {
        arr1.forEach(item => {
            if (arr2.indexOf(item) === -1) {
                flag = false
            }
        })
    }
    return flag
}

export const Frac2FalseFrac = FracRaw => {
    FracRaw = FracRaw.toString()
    const Frac = FracRaw.split(/\D/) // 以下把輸入的分數字符串轉成假分數
    let Numer = 0
    let Denom = 0
    if (Frac.length === 3) {
        Numer = +(Frac[0] - 1) * +Frac[2] + +Frac[1] // 干支數-1
        Denom = +Frac[2]
    } else if (Frac.length === 2) {
        Numer = +Frac[0]
        Denom = +Frac[1]
    } else {
        Numer = +Frac[0]
        Denom = 1
    }
    return { Numer, Denom }
}
// console.log(Frac2FalseFrac('888+3/2'))

export const Deci2Int = function () { // 輸入字符串
    const Raw = arguments[0].split(/;|,|，|。|；|｜| /)
    let Portion = 1
    let Int = []
    for (let j = 0; j < Raw.length; j++) {
        Int[j] = +Raw[j]
        let i = 0
        while (i < 11) {
            if (parseFloat((Int[j] * 10 ** i).toPrecision(12)) === Math.floor(Int[j] * 10 ** i)) {
                Portion = Math.max(10 ** i, Portion)
                break
            }
            i++
        }
    }
    if (Portion !== 1) {
        for (let j = 0; j < Int.length; j++) {
            Int[j] = parseFloat((Int[j] * Portion).toPrecision(12))
        }
    }
    return { Int, Portion }
}
// console.log(Deci2Int('1.1,2.23,3.4,5.555').Int)

export const DeciFrac2Frac = Deci => { // 把有小數點的分數轉換為整數分數
    const Raw = Deci.split('/')
    let n = Raw[0]
    let d = Raw[1]
    const L = Math.max((n.split('.')[1] || '').length, (d.split('.')[1] || '').length)
    n = Math.round(+n * 10 ** L)
    d = Math.round(+d * 10 ** L)
    return n + '/' + d
}
// console.log(DeciFrac2Frac('2553.0026/12030'))

// 把一個數字按照幾位分割
export const SliceNum = (Input, num) => { // a：小數點前，b：小數點後，c：并之
    Input = Input.toString()
    Input = Input.split('.')
    num = parseInt(num)
    let Front = Input[0]
    let Suffix = []
    if (Input.length > 1) {
        Suffix = Input[1]
    }
    const a = []
    let aString = []
    const len1 = Front.length
    const len2 = Suffix.length
    for (let i = 0; i < len1 / num; i++) {
        aString[i] = Front.slice(-num)
        Front = Front.slice(0, -num)
    }
    aString = aString.reverse()
    for (let i = 0; i < aString.length; i++) {
        a[i] = parseInt(aString[i])
    }
    const b = []
    let bString = []
    for (let i = 0; i < len2 / num; i++) {
        bString[i] = Suffix.slice(0, num)
        Suffix = Suffix.slice(num)
    }
    for (let i = 0; i < bString.length; i++) {
        b[i] = parseInt(bString[i])
    }
    const cString = aString.concat(bString)
    return { a, cString }
}