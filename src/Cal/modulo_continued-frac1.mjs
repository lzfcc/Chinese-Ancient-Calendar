//////////// 以下爲小數連分數
const Fraction = function (x, y) {
    this.x = x
    this.y = y
    if (y === 0) {
        throw (Error('分母不能爲0'))
    }
}
Fraction.prototype.toString = function () {
    this.reduce()
    return `${this.x}/${this.y}`
}
Fraction.prototype.valueOf = function () {
    return this.x / this.y
}
Fraction.prototype.getInt = function () {
    return parseInt(this.valueOf())
}
Fraction.prototype.reduce = function () { // 约分
    const gcd = this._gcd(this.x, this.y)
    this.x /= gcd
    this.y /= gcd
    return this
}
Fraction.prototype.inverse = function () { // 倒数
    const t = this.x
    this.x = this.y
    this.y = t
    return this
}
Fraction.prototype._gcd = function (m, n) { // 最大公约数
    m = Math.abs(m)
    n = Math.abs(n)
    let t = 1
    while (t) {
        t = m % n
        m = n
        n = t
    }
    return m
}
Fraction.prototype._validateArgument = function (frac) {
    if (frac instanceof Fraction) {
        return frac
    } else if (Number.isInteger(frac)) {
        return new Fraction(frac, 1)
    } else {
        throw (Error('只支持分數和整數運算'))
    }
}
Fraction.prototype.add = function (frac) {
    frac = this._validateArgument(frac)
    this.reduce()
    let gcd = this._gcd(this.y, frac.y)
    let numx = this.x * (frac.y / gcd)
    let numy = frac.x * (this.y / gcd)
    let deno = (frac.y / gcd) * this.y

    this.x = numx + numy
    this.y = deno
    return this
}
Fraction.prototype.sub = function (frac) {
    frac = this._validateArgument(frac)
    return this.add(new Fraction(-frac.x, frac.y))
}
Fraction.prototype.mul = function (frac) {
    frac = this._validateArgument(frac)
    frac.reduce()
    this.x = this.x * frac.x
    this.y = this.y * frac.y
    this.reduce()
    return this
}
Fraction.prototype.div = function (frac) {
    frac = this._validateArgument(frac)
    if (!frac.x) {
        throw (Error('除0錯誤'))
    }
    return this.mul(frac.inverse())
}

const BigFloat = function (s) {
    if (!/^\-?((\d+[.]\d+)|\d+)$/.test(s)) {
        throw Error(`"${s}" is invalid!`)
    }
    s = String(s)
    if (s.indexOf('.') > 0) {
        this._z = s.slice(0, s.indexOf('.'))
        this._f = s.slice(s.indexOf('.') + 1)
    } else {
        this._z = s
        this._f = ''
    }
}
BigFloat.prototype.valueOf = function () {
    return parseFloat(this.toString())
}
BigFloat.prototype.toString = function () {
    return this._z + '.' + this._f
}
BigFloat.prototype.getInt = function () {
    return this._z
}
BigFloat.prototype.getFloat = function () {
    return this._f
}
BigFloat.prototype._getStepResult = function (nums) { // 输出渐近结果
    let i = nums.length - 1
    let frac = new Fraction(1, nums[i])
    while (i--) {
        frac = frac.add(nums[i]).inverse()
    }
    return frac.inverse()
}
BigFloat.prototype.Deciaml2ContinuedFrac = function () {
    if (parseInt(this.getFloat()) > Number.MAX_SAFE_INTEGER) {
        console.warn('超过 js 最大精度，漸進結果僅供參考！')
    }
    const ans = []
    const step = []
    ans.push(parseInt(this.getInt()))
    step.push(this.getInt())
    let float = this.getFloat()
    let frac = new Fraction(parseInt(float), 10 ** float.length)
    let accurate = 0
    let i = 0
    while (frac.x) {
        let k = frac.reduce().inverse().getInt()
        frac = frac.sub(k)
        ans.push(k)
        const stepRes = this._getStepResult(ans)
        step.push('　(' + (i + 1) + ') ' + stepRes.toString() + `\n`)
        if (!accurate && stepRes.valueOf() - parseFloat(this.valueOf()) === 0) {
            accurate = step.length
        }
        i++
    }
    return {
        ans,
        step,
        accurate //  当前连分数结果到 accrate 步时已经和输入值相同
    }
}

export const ContinuedFrac1 = x => {
    x = new BigFloat(x.toString())
    const ans = x.Deciaml2ContinuedFrac().ans
    const ansPrint = x + ' = [' + x.Deciaml2ContinuedFrac().ans + ']'
    const step = '漸進分數： ' + x.Deciaml2ContinuedFrac().step // .toString()
    return {
        ansPrint,
        ans,
        step
    }
}
// console.log(ContinuedFrac1(1.1254155))


// 開發者一寫的連分數
// exports.ContinuedFrac1 = function (a, k) {
//     let n = Number(a)
//     let z = []
//     z[0] = Math.floor(n)
//     let p = []
//     let q = []
//     p[0] = 1
//     q[0] = 1
//     let Result = []
//     let i = 0
//     while (k--) {
//         if (i > 0) {
//             z[i] = Math.floor(n)
//             n = parseFloat((1 / (n - z[i])).toPrecision(14))
//             z[i] = Math.floor(n)
//         }
//         if (i === 0) {
//             p[i + 1] = z[i]
//             q[i + 1] = 1
//         } else if (i === 1) {
//             p[i + 1] = z[0] * z[i] + 1
//             q[i + 1] = z[i]
//         } else {
//             p[i + 1] = z[i] * p[i] + p[i - 1]
//             q[i + 1] = z[i] * q[i] + q[i - 1]
//         }
//         if (p[i] / q[i] === a) {
//             z = z.slice(0, -1)
//             break
//         }
//         Result += '(' + Number(i + 1) + ') ' + p[i + 1] + '/' + q[i + 1] + '\n'
//         i++
//     }
//     const zPrint = a + ' = [' + z + ']'
//     Result = '漸進分數：\n' + Result
//     return {
//         z,
//         zPrint,
//         Result
//     }
// }