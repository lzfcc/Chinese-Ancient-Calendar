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
        Numer = Number(Frac[0] - 1) * Number(Frac[2]) + Number(Frac[1]) // 干支數-1
        Denom = Number(Frac[2])
    } else if (Frac.length === 2) {
        Numer = Number(Frac[0])
        Denom = Number(Frac[1])
    } else {
        Numer = Number(Frac[0])
        Denom = 1
    }
    return {
        Numer,
        Denom
    }
}
// console.log(Frac2FalseFrac('888'))

export const Deci2Int = function () { // 輸入字符串
    const Raw = arguments[0].split(/;|,|，|。|；|｜| /)
    let portion = 1
    let Int = []
    for (let j = 0; j < Raw.length; j++) {
        Int[j] = Number(Raw[j])
        let i = 0
        while (i < 11) {
            if (parseFloat((Int[j] * 10 ** i).toPrecision(12)) === Math.floor(Int[j] * 10 ** i)) {
                portion = Math.max(10 ** i, portion)
                break
            }
            i++
        }
    }
    if (portion !== 1) {
        for (let j = 0; j < Int.length; j++) {
            Int[j] = parseFloat((Int[j] * portion).toPrecision(12))
        }
    }
    return {
        Int,
        portion
    }
}
// console.log(Deci2Int('1.1,2.23,3.4,5.555').Int)

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
    return {
        a,
        cString
    }
}