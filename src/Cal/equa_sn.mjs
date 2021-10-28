import { big } from './para_constant.mjs'

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
    const S = tmp1.add(tmp2).mul(n).div(6).add(tmp3)
    return 'sum = ' + S
}
// console.log(Sn1(30, 40, 3000).Print)
// https://www.zhihu.com/question/265476515/answer/355445437
// 杨辉在《详解九章算法》《商功》篇阐述了方垛，刍甍垛，刍童垛，和三角垛
// 方垛 1+4+9+...+n^2=1/3 n (n+1) (n+1/2)=1/6 n (n+1) (2n+1) 自然數平方級數求和
const Sn4Sub = (n, p) => {
    n = parseInt(n)
    p = parseInt(p)
    let b = 1
    for (let i = 1; i <= n; i++) {
        b = n ** p
    }
    return b
}

export const Sn4 = (n, p) => { // 四角垛
    n = parseInt(n)
    // let S = (big(big(n).mul(big(n).add(1)).mul(big(n).add(0.5))).mul(1 / 3)).toFixed(10).toString()
    p = parseInt(p)
    // 注釋中的似乎有問題
    // let S = big(1)
    // for (let i = 0; i <= p - 1; i++) {
    //     S = S.mul(big.add(n, i)).mul(big.div(1, big.add(i, 1)))
    // }
    // S = big(S).mul(big(big(n).mul(2)).add(p).sub(1)).div(big.add(p, 1))
    // S = S.toFixed(10).toString().split('.')
    // S = S[0]
    let S = 0
    for (let i = 1; i <= n; i++) {
        S += Sn4Sub(i, p)
    }
    const tmp1 = Sn4Sub(1, p)
    const tmp2 = Sn4Sub(2, p)
    const tmp3 = Sn4Sub(3, p)
    return tmp1 + ' + ' + tmp2 + ' + ' + tmp3 + '+...+ n^' + p + ' = ' + S
}
// console.log(Sn4(40, 1))

// 這個小函數求三角垛第n項是什麼
export const Sn3Sub = (n, p) => {
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
const Sn3_quick = (n, p) => {
    let S = 1
    for (let i = 0; i <= p; i++) {
        S *= (n + i) / (i + 1)
    }
    return S
}

export const Sn3 = (n, p) => {
    let S = big(1)
    for (let i = 0; i <= p; i++) {
        S = S.mul(big.add(n, i)).mul(big.div(1, big.add(i, 1)))
    }
    const tmp1 = Sn3Sub(1, p)
    const tmp2 = Sn3Sub(2, p)
    const tmp3 = Sn3Sub(3, p)
    const tmp4 = Sn3Sub(4, p)
    const tmp5 = 'n(n+1)...(n+p-1)/p!'
    const Print = tmp1 + ' + ' + tmp2 + ' + ' + tmp3 + ' +' + tmp4 + ' + ... ' + tmp5 + ' = ' + S
    return {
        Print,
        S: S.toString()
    }
}
// console.log(Sn3(22.11112111111111, 3).Print)

// 招差術，垛積（三角垛）求和公式。3^3+4^3+5^3...+(n+2)^3, 卽 f(n)=sum(n) (n+2)^3=27n+37 * 1/2! (n-1)n+ 24 1/3! (n-2)(n-1)n + 6 1/4! (n-3)(n-2)(n-1)n
export const Interpolate1 = (n, initial) => {
    let S = 0, S4 = 0
    let delta = []
    for (let i = 0; i < initial.length; i++) {
        delta[i] = initial[i]
        for (let l = 0; l < i; l++) {
            delta[i] -= delta[l] * Sn3Sub(i - l + 1, l)
        }
        S4 += Sn3_quick(n - 1 - i, i) * delta[i]
        S += Sn3_quick(n - i, i) * delta[i]
    }
    return S - S4
}

export const Interpolate1_big = (n, initial) => {
    n = big(n)
    const n1 = Math.floor(n)
    const p = initial.length - 1
    let S = 0
    let S1 = 0
    let S2 = 0
    let S4 = 0
    let delta = []
    for (let i = 0; i <= p; i++) {
        delta[i] = big(initial[i])
        for (let l = 0; l < i; l++) {
            delta[i] = big(delta[i]).sub(big(delta[l]).mul(Sn3Sub(i - l + 1, l)))
        }
        S2 = big(S2).add(big(Sn3(big.sub((n1 - 1), i), i).S).mul(delta[i]))
        S1 = big(S1).add(big(Sn3(big.sub(n1, i), i).S).mul(delta[i]))
        S4 = big(S4).add(big(Sn3(big.sub((big.sub(n, 1)), i), i).S).mul(delta[i]))
        S = big(S).add(big(Sn3(big.sub(n, i), i).S).mul(delta[i]))
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
    const Print = `Δ = ${delta}
sum (${n}) = ${S.toNumber()}` + (n1 === Number(n) ? `` : `
sum (${n1}) = ${S1}`) + `
f (${n}) = ${y}` + (n1 === Number(n) ? `` : `
f (${n1}) = ${y1}`)
    return { Print, S, delta, delta1, y }
}
// console.log(Interpolate1_big(2.115, '27,64,125,216,343').y)
// console.log(Interpolate1_big(3, '1,4,9').delta1)
// console.log(Interpolate1_big(4.000001, 4, '27,64,125,216,343').Print)
// console.log(Interpolate1_big(4.000001, 3, '25791，27341，28910，30499，32109').Print)
// 算出來差分之後，求y。爲了節省算力。delta由低次到高次。

export const Interpolate2 = (n, f0, delta) => { // 跟下面的區別是沒用Deci.js
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
    const y0 = big(y).add(f0).toNumber()
    const yPrint = `f (${n}) = ${f0} + ${y.toNumber()} = ${y0}`
    return { y0, yPrint }
}

// 拉格朗日不等間距
// 關鍵：tmp
// y=Σ(n,1) yiLi
// Li=Π(n,j=1,j≠i) (x-xj)/(xi-xj)

export const Make2DPoints = (xList, yList, baseIndex = 0, num = 3) => {
    const points = []
    for (let i = 0; i < num; i++) {
        points[i] = [xList[i + baseIndex], yList[i + baseIndex]]
    }
    return points
}
export const Interpolate3 = (n, points) => { // modified by @lzfcc
    const x = [], y = []
    for (let i = 0; i < points.length; i++) {
        x[i] = points[i][0]
        y[i] = points[i][1]
    }
    let f = 0
    for (let i = 0; i < points.length; i++) {
        let tmp = 1
        for (let j = 0; j < points.length; j++) {
            if (i !== j) tmp *= (n - x[j]) / (x[i] - x[j])
        }
        f += y[i] * tmp
    }
    return f
}
// console.log(Interpolate3(2.5,[[1,0.5],[2.4,1],[4,2]]))

export const Interpolate3_big = (n, initial) => {
    const x = [], y = []
    for (let i = 0; i < initial.length / 2; i++) {
        x[i] = initial[2 * i]
        y[i] = initial[2 * i + 1]
    }
    let f = 0
    for (let i = 0; i < x.length; i++) {
        let tmp = big(1)
        for (let j = 0; j < i; j++) {
            if (i !== j) tmp = tmp.mul((big.sub(n, x[j])).div(big.sub(x[i], x[j])))
        }
        f = big(f).add(big(y[i]).mul(tmp))
    }
    const Print = `f (${n}) = ${parseFloat((+f.toFixed(15)).toPrecision(14))}`
    return { Print, f }
}
// console.log(Interpolate3_big('12.1', '1.124,1.27；2.5873,4.38882；3.93,9.63882;7.98,64.899;12.68,565'))
// console.log(Interpolate3(12.1, '1.124,1.27；2.5873,4.38882；3.93,9.63882;7.98,64.899;12.68,565'))

export const MeasureWinsols = List => {
    if (List.length !== 6) {
        throw (new Error('請輸入d1,l1,d2,l2,d3,l3'))
    }
    for (let i = 0; i < List.length; i++) {
        List[i] = +List[i]
    }
    // const d1 = List[0]
    const l1 = List[1]
    // const d2 = List[2]
    // const l2 = List[3]
    // const d3 = List[4]
    const l3 = List[5]
    // 先判斷冬至在哪個區間
    // if ([l1, l2, l3].indexOf((Math.max(...[l1, l2, l3]))) !== 1) {
    //     throw (new Error('最大影長應爲l2'))
    // }
    // 以下不對，直接用不等間距內插吧
    // const isLeft = Math.max(l1, l3) === l1 ? true : false // 冬至在左邊d1d2還是右邊d2d3
    // const k = isLeft ? -(l2 - l3) / (d2 - d3) : (l2 - l1) / (d2 - d1) // 斜率
    // const result = (isLeft ? (k * (d1 + d2) - (l1 - l2)) : (k * (d2 + d3) - (l2 - l3))) / k / 2
    // 算法学习笔记(62): 三分法 - Pecco的文章https://zhuanlan.zhihu.com/p/337752413
    let Small = Math.min(l1, l3)
    let Big = Math.max(l1, l3)
    let l = List[List.indexOf(Small) - 1]
    let r = List[List.indexOf(Big) - 1]
    let mid = (l + r) / 2
    const eps = '0.00000000000000000001'
    while (big.sub(r, l).abs().gt(eps)) {
        mid = big.add(l, r).div(2)
        let fl = Interpolate3_big(mid.sub(eps), List).f
        let fr = Interpolate3_big(mid.add(eps), List).f
        if (fl.lt(fr)) r = mid
        else l = mid
    }
    return `f (${mid.toNumber()}) = ${Interpolate3_big(mid, List).f.toNumber()}`
}
// console.log(MeasureWinsols([-1, -5, 6, -12, 7, -21])) // (4-x)x

// const avg = () => {
//     const a = (7830.337642585551 + 7830.330890052356 + 7830.347896627651 + 7830.333308480895 + 7830.320788807215 + 7830.323408937259) / 6
//     const c = (8560.8089908599 + 8560.8218455321 + 8560.8193548387 + 8560.8131256952 + 8560.8188436178) / 5
//     return (c - a) / 2
// }
// console.log(avg())

