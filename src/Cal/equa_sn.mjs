import {
    big,
} from './para_constant.mjs'

// const a = input => {
//     input.toNumber()
// }
// console.log(a('1/2'))
// 傅宗、李伦祖《隙积术和会圆术——沈括梦溪笔谈评注一则》，《西北師範大學學報》1974(4)
export const Sn1 = (a, b, n) => { // 上有寬a個、長b個，下有寬c個、長d個，n層，每層長寬各多1個。芻童就是長方稜臺
    const c = big(a).add(n).sub(1)
    const d = big(b).add(n).sub(1)
    const tmp1 = big(a).mul(big(big(2).mul(b)).add(d))
    const tmp2 = c.mul(big(big(2).mul(d)).add(b))
    const tmp3 = c.sub(a).mul(n).div(6)
    const S = big(tmp1.add(tmp2)).mul(n).div(6).add(tmp3)
    const Print = 'sum = ' + S
    return {
        Print
    }
}
// console.log(Sn1(30, 40, 3000000).Print)
// https://www.zhihu.com/question/265476515/answer/355445437
// 杨辉在《详解九章算法》《商功》篇阐述了方垛，刍甍垛，刍童垛，和三角垛
// 方垛 1+4+9+...+n^2=1/3 n (n+1) (n+1/2)=1/6 n (n+1) (2n+1) 自然數平方級數求和
const Sn2Sub = (n, p) => {
    n = parseInt(n)
    p = parseInt(p)
    let b = 1
    for (let i = 1; i <= n; i++) {
        b = n ** p
    }
    return b
}

export const Sn2 = (n, p) => {
    n = parseInt(n)
    // let S = (big(big(n).mul(big(n).add(1)).mul(big(n).add(0.5))).mul(1 / 3)).toFixed(10).toString()
    p = parseInt(p)
    let S = 1
    for (let i = 0; i <= p - 1; i++) {
        S = big(S).mul(big.add(n, i)).mul(big.div(1, big.add(i, 1)))
    }
    S = big(S).mul(big(big(n).mul(2)).add(p).sub(1)).div(big.add(p, 1))
    S = S.toFixed(10).toString().split('.')
    S = S[0]
    const tmp1 = Sn2Sub(1, p)
    const tmp2 = Sn2Sub(2, p)
    const tmp3 = Sn2Sub(3, p)
    const Print = tmp1 + ' + ' + tmp2 + ' + ' + tmp3 + '+...+ n^' + p + ' = ' + S
    return {
        Print
    }
}
// console.log(Sn2(15, 3).Print)

// 這個小函數求三角垛第n項是什麼
export const Sn5Sub = (n, p) => {
    n = parseInt(n)
    p = parseInt(p)
    let b = 1
    for (let i = n; i <= n + p - 1; i++) {
        b *= i
    }
    let c = 1
    for (let i = 1; i <= p; i++) {
        c *= i
    }
    return b / c
}
// 三角垛 1+3+6+10+...+n (n+1) /2 = 1/6 n (n+1) (n+2)
// 李兆華、程貞一《朱世傑招差術探原》，《自然科學史研究》2000(1)
const Sn5_quick = (n, p) => {
    let S = 1
    for (let i = 0; i <= p; i++) {
        S *= (n + i) * (1 / (i + 1))
    }
    return S
}
export const Sn5 = (n, p) => {
    let S = 1
    for (let i = 0; i <= p; i++) {
        S = big(S).mul(big.add(n, i)).mul(big.div(1, big.add(i, 1)))
    }
    const tmp1 = Sn5Sub(1, p)
    const tmp2 = Sn5Sub(2, p)
    const tmp3 = Sn5Sub(3, p)
    const tmp4 = Sn5Sub(4, p)
    const tmp5 = 'n(n+1)...(n+p-1)/p!'
    const Print = tmp1 + ' + ' + tmp2 + ' + ' + tmp3 + ' +' + tmp4 + ' +' + '...+ ' + tmp5 + ' = ' + S
    return {
        Print,
        S: S.toString()
    }
}
// console.log(Sn5(22.11112111111111, 3).Print)

// 招差術，垛積（三角垛）求和公式。3^3+4^3+5^3...+(n+2)^3, 卽 f(n)=sum(n) (n+2)^3=27n+37 * 1/2! (n-1)n+ 24 1/3! (n-2)(n-1)n + 6 1/4! (n-3)(n-2)(n-1)n
export const Interpolate1 = (n, Initial) => {
    Initial = Initial.split(/;|,|，|。|；|｜| /)
    const p = Initial.length - 1
    let S = 0
    let S4 = 0
    let delta = []
    for (let i = 0; i <= p; i++) {
        delta[i] = Initial[i]
        for (let l = 0; l < i; l++) {
            delta[i] -= delta[l] * Sn5Sub(i - l + 1, l)
        }
        S4 += Sn5_quick(n - 1 - i, i) * delta[i]
        S += Sn5_quick(n - i, i) * delta[i]
    }
    return S - S4
}
export const Interpolate1_big = (n, Initial) => {
    n = big(n)
    const n1 = Math.floor(n)
    Initial = Initial.split(/;|,|，|。|；|｜| /)
    const p = Initial.length - 1
    let S = 0
    let S1 = 0
    let S2 = 0
    let S4 = 0
    let delta = []
    for (let i = 0; i <= p; i++) {
        delta[i] = big(Initial[i])
        for (let l = 0; l < i; l++) {
            delta[i] = big(delta[i]).sub(big(delta[l]).mul(Sn5Sub(i - l + 1, l)))
        }
        S2 = big(S2).add(big(Sn5(big.sub((n1 - 1), i), i).S).mul(delta[i]))
        S1 = big(S1).add(big(Sn5(big.sub(n1, i), i).S).mul(delta[i]))
        S4 = big(S4).add(big(Sn5(big.sub((big.sub(n, 1)), i), i).S).mul(delta[i]))
        S = big(S).add(big(Sn5(big.sub(n, i), i).S).mul(delta[i]))
    }
    const y1 = big(S1).sub(S2)
    let y = big(S).sub(S4)
    y = Number(y)
    delta = delta.toString().split(',')
    for (let i = 0; i < delta.length; i++) {
        delta[i] = Number(delta[i])
    }
    delta = delta.reverse().slice(0, p)
    delta = delta.reverse()
    const delta1 = delta[0] // 一階
    const Print = `Δ = ` + delta + `\nsum (` + n + `) = ` + S.toFixed(10) + (n1 === Number(n) ? `` : `\nsum (` + n1 + `) = ` + S1) + `\nf (` + n + `) = ` + y.toFixed(10) + (n1 === Number(n) ? `` : `\nf (` + n1 + `) = ` + y1)
    return {
        Print,
        S,
        delta,
        delta1,
        y
    }
}
// console.log(Interpolate1_big(2.115, '27,64,125,216,343').y)
// console.log(Interpolate1(2.115, '27,64,125,216,343'))
// console.log(Interpolate1_big(4.000001, 4, '27,64,125,216,343').Print)
// console.log(Interpolate1_big(4.000001, 3, '25791，27341，28910，30499，32109').Print)
// 算出來差分之後，求y。爲了節省算力。delta由低次到高次。
export const Interpolate2 = (n, f0, delta) => { // 跟下面的區別是沒用decimal.js
    delta = delta.split(/;|,|，|。|；|｜| /)
    const p = delta.length
    const tmp = []
    tmp[0] = n
    let y = 0
    for (let i = 1; i < p; i++) {
        tmp[i] = (tmp[i - 1]) * (n - i) / (i + 1)
    }
    for (let i = 0; i < p; i++) {
        y += delta[i] * tmp[i]
    }
    return y + f0
}
export const Interpolate2_big = (n, f0, delta) => { // delta是string。第一個數n是0，上面的函數第一個是1
    delta = delta.split(/;|,|，|。|；|｜| /)
    const p = delta.length // 次數
    const tmp = []
    tmp[0] = n
    let y = 0
    for (let i = 1; i < p; i++) {
        tmp[i] = big(tmp[i - 1]).mul(n - i).div(i + 1)
    }
    for (let i = 0; i < p; i++) {
        y = big(y).add(big.mul(delta[i], tmp[i]))
    }
    const y0 = big(y).add(f0)
    const yPrint = 'f (' + n + ') = ' + f0 + ' + ' + y.toFixed(10) + ' = ' + (y0.toFixed(10)).toString()
    return {
        y0: y0.toNumber(),
        yPrint
    }
}

// 拉格朗日不等間距
// 關鍵：tmp
// y=Σ(n,1) yiLi
// Li=Π(n,j=1,j≠i) (x-xj)/(xi-xj)
export const Interpolate3 = (n, Initial) => { // 跟下面的區別是沒用decimal.js
    Initial = Initial.split(/;|,|，|。|；|｜| /)
    const x = []
    const y = []
    for (let i = 0; i < Initial.length / 2; i++) {
        x[i] = Initial[2 * i]
        y[i] = Initial[2 * i + 1]
    }
    const p = x.length - 1
    const l = []
    let tmp = 1
    let f = 0
    for (let i = 0; i <= p; i++) {
        tmp = 1
        for (let j = 0; j < i; j++) {
            tmp *= (n - x[j]) / (x[i] - x[j])
        }
        for (let j = i + 1; j <= p; j++) {
            tmp *= (n - x[j]) / (x[i] - x[j])
        }
        l[i] = tmp
        f += y[i] * l[i]
    }
    return f
}

export const Interpolate3_big = (n, Initial) => {
    Initial = Initial.split(/;|,|，|。|；|｜| /)
    const x = []
    const y = []
    for (let i = 0; i < Initial.length / 2; i++) {
        x[i] = Initial[2 * i]
        y[i] = Initial[2 * i + 1]
    }
    const p = x.length - 1
    const l = []
    let tmp = 1
    let f = 0
    for (let i = 0; i <= p; i++) {
        tmp = big(1)
        for (let j = 0; j < i; j++) {
            tmp = tmp.mul((big.sub(n, x[j])).div(big.sub(x[i], x[j])))
        }
        for (let j = i + 1; j <= p; j++) {
            tmp = tmp.mul((big.sub(n, x[j])).div(big.sub(x[i], x[j])))
        }
        l[i] = tmp
        f = big(f).add(big(y[i]).mul(l[i]))
    }
    const Print = 'y (' + n + ') = ' + f.toFixed(15)
    return Print
}
// console.log(Interpolate3_big('12.1', '1.124,1.27；2.5873,4.38882；3.93,9.63882;7.98,64.899;12.68,565'))
// console.log(Interpolate3(12.1, '1.124,1.27；2.5873,4.38882；3.93,9.63882;7.98,64.899;12.68,565'))