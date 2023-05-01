import {
    big
} from './para_constant.mjs'

export const ContinuedFrac = (a, b) => { // https://chaoli.club/index.php/2756/0
    let gcd = big.abs(a)
    let n = big.abs(b)
    let t = 1, i = 0
    const z = [], p = [], q = []
    let Result = []
    while (big(t).gt(0)) {
        t = big.mod(gcd, n)
        z[i] = big.floor(big.div(gcd, n))
        gcd = big(n)
        n = big(t)
        if (i === 0) {
            p[i] = big(z[i])
            q[i] = 1
        } else if (i === 1) {
            p[i] = big.mul(z[0], z[i]).add(1)
            q[i] = big(z[i])
        } else {
            p[i] = big.mul(z[i], p[i - 1]).add(p[i - 2])
            q[i] = big.mul(z[i], q[i - 1]).add(q[i - 2])
        }
        if (i === 0) {
            Result = big(p[i]) + `\n`
        } else {
            Result = Result + '　(' + i + ') ' + p[i] + '/' + q[i] + `\n`
        }
        i++
    }
    const zPrint = a + '/' + b + ' = [' + z + ']'
    Result = `漸進分數：` + Result
    return {
        z,
        zPrint,
        Result
    }
}
// console.log(ContinuedFrac('46646277725566192769813', '154971189046719865916581').Result)
