import { lusolve, transpose, multiply, matrix, pow } from 'mathjs'
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
    // let S = (big(big(n).mul(big(n).add(1)).mul(big(n).add(.5))).mul(1 / 3)).toFixed(10).toString()
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
// console.log(Interpolate1(1.5, [1, 9, 25])) // delta:1,8,8

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
// console.log(Interpolate1_big(1.5, [9, 16, 25]).Print)
// console.log(Interpolate1_big(3, [1,4,9]).delta1)
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
// console.log(Interpolate3(2.5, [[1, 2], [2, 4], [3, 8]]))
// console.log(Interpolate3(14, [[2, 64.415], [7, 60.559], [12, 58.313], [17, 73.164], [22, 85.722]]))

export const Interpolate3_big = (n, initial) => {
    const x = [], y = []
    for (let i = 0; i < initial.length / 2; i++) {
        x[i] = initial[2 * i]
        y[i] = initial[2 * i + 1]
    }
    let f = 0
    for (let i = 0; i < x.length; i++) {
        let tmp = big(1)
        for (let j = 0; j < x.length; j++) {
            if (i !== j) tmp = tmp.mul((big.sub(n, x[j])).div(big.sub(x[i], x[j])))
        }
        f = big(f).add(big(y[i]).mul(tmp))
    }
    const Print = `f (${n}) = ${parseFloat((+f.toFixed(15)).toPrecision(14))}`
    return { Print, f }
}
const Interpolate3_big_Pre = (n, initial) => {
    let arr = initial.split(/;|,|，|。|；|｜| /).filter(Boolean)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Number(arr[i])
    }
    return Interpolate3_big(n, arr).Print
}
// console.log(Interpolate3_big_Pre(2.5, '1,2;2,4;3,8'))
// console.log(Interpolate3(12.1, '1.124,1.27；2.5873,4.38882；3.93,9.63882;7.98,64.899;12.68,565'))

export const MeasureSols = List => {
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
    const eps = '.00000000000000000001'
    while (big.sub(r, l).abs().gt(eps)) {
        mid = big.add(l, r).div(2)
        let fl = Interpolate3_big(mid.sub(eps), List).f
        let fr = Interpolate3_big(mid.add(eps), List).f
        if (fl.lt(fr)) r = mid
        else l = mid
    }
    const f = Interpolate3_big(mid, List).f.toNumber()
    return {
        f,
        Print: `f (${mid.toNumber()}) = ${f}`
    }
}
// console.log(MeasureSols([-1, -5, 6, -12, 7, -21])) // (4-x)x

// const avg = () => {
//     const a = (7830.337642585551 + 7830.330890052356 + 7830.347896627651 + 7830.333308480895 + 7830.320788807215 + 7830.323408937259) / 6
//     const c = (8560.8089908599 + 8560.8218455321 + 8560.8193548387 + 8560.8131256952 + 8560.8188436178) / 5
//     return (c - a) / 2
// }
// console.log(avg())

// 示例数据点，这里是一些(x, y)坐标点
// const aa = x => -1.0553714556586289e-12 * x ** 5 + 4.46392500762437e-10 * x ** 4 - 6.62039217563994e-10 * x ** 3 - 0.000012591215491910339 * x ** 2 - 0.0004587794379131388 * x + 1.2071473017660361
// console.log(aa(21))

const points = [
    { x: 1, y: 1.2071 },
    { x: 2, y: 1.2065 },
    { x: 3, y: 1.2059 },
    { x: 4, y: 1.2053 },
    { x: 5, y: 1.2047 },
    { x: 6, y: 1.204 },
    { x: 7, y: 1.2033 },
    { x: 8, y: 1.2026 },
    { x: 9, y: 1.2019 },
    { x: 10, y: 1.2012 },
    { x: 11, y: 1.2004 },
    { x: 12, y: 1.1996 },
    { x: 13, y: 1.1988 },
    { x: 14, y: 1.198 },
    { x: 15, y: 1.1972 },
    { x: 16, y: 1.1963 },
    { x: 17, y: 1.1955 },
    { x: 18, y: 1.1946 },
    { x: 19, y: 1.1937 },
    { x: 20, y: 1.1927 },
    { x: 21, y: 1.1918 },
    { x: 22, y: 1.1908 },
    { x: 23, y: 1.1898 },
    { x: 24, y: 1.1888 },
    { x: 25, y: 1.1878 },
    { x: 26, y: 1.1867 },
    { x: 27, y: 1.1856 },
    { x: 28, y: 1.1846 },
    { x: 29, y: 1.1835 },
    { x: 30, y: 1.1823 },
    { x: 31, y: 1.1812 },
    { x: 32, y: 1.18 },
    { x: 33, y: 1.1788 },
    { x: 34, y: 1.1776 },
    { x: 35, y: 1.1764 },
    { x: 36, y: 1.1751 },
    { x: 37, y: 1.1739 },
    { x: 38, y: 1.1726 },
    { x: 39, y: 1.1713 },
    { x: 40, y: 1.17 },
    { x: 41, y: 1.1686 },
    { x: 42, y: 1.1673 },
    { x: 43, y: 1.1659 },
    { x: 44, y: 1.1645 },
    { x: 45, y: 1.1631 },
    { x: 46, y: 1.1616 },
    { x: 47, y: 1.1602 },
    { x: 48, y: 1.1587 },
    { x: 49, y: 1.1572 },
    { x: 50, y: 1.1557 },
    { x: 51, y: 1.1541 },
    { x: 52, y: 1.1526 },
    { x: 53, y: 1.151 },
    { x: 54, y: 1.1494 },
    { x: 55, y: 1.1478 },
    { x: 56, y: 1.1462 },
    { x: 57, y: 1.1445 },
    { x: 58, y: 1.1428 },
    { x: 59, y: 1.1411 },
    { x: 60, y: 1.1394 },
    { x: 61, y: 1.1377 },
    { x: 62, y: 1.1359 },
    { x: 63, y: 1.1342 },
    { x: 64, y: 1.1324 },
    { x: 65, y: 1.1306 },
    { x: 66, y: 1.1287 },
    { x: 67, y: 1.1269 },
    { x: 68, y: 1.125 },
    { x: 69, y: 1.1231 },
    { x: 70, y: 1.1212 },
    { x: 71, y: 1.1193 },
    { x: 72, y: 1.1174 },
    { x: 73, y: 1.1154 },
    { x: 74, y: 1.1134 },
    { x: 75, y: 1.1114 },
    { x: 76, y: 1.1094 },
    { x: 77, y: 1.1073 },
    { x: 78, y: 1.1053 },
    { x: 79, y: 1.1032 },
    { x: 80, y: 1.1011 },
    { x: 81, y: 1.099 },
    { x: 82, y: 1.0968 },
    { x: 83, y: 1.0966 },
    { x: 84, y: 1.0965 },
    { x: 85, y: 1.0961 },
    { x: 86, y: 1.0959 },
    { x: 87, y: 1.0958 },
    { x: 88, y: 1.0936 },
    { x: 89, y: 1.0915 },
    { x: 90, y: 1.0894 },
    { x: 91, y: 1.0873 },
    { x: 92, y: 1.0852 },
    { x: 93, y: 1.0832 },
    { x: 94, y: 1.0812 },
    { x: 95, y: 1.0792 },
    { x: 96, y: 1.0772 },
    { x: 97, y: 1.0752 },
    { x: 98, y: 1.0733 },
    { x: 99, y: 1.0713 },
    { x: 100, y: 1.0694 },
    { x: 101, y: 1.0676 },
    { x: 102, y: 1.0657 },
    { x: 103, y: 1.0638 },
    { x: 104, y: 1.062 },
    { x: 105, y: 1.0602 },
    { x: 106, y: 1.0584 },
    { x: 107, y: 1.0566 },
    { x: 108, y: 1.0549 },
    { x: 109, y: 1.0531 },
    { x: 110, y: 1.0514 },
    { x: 111, y: 1.0497 },
    { x: 112, y: 1.0481 },
    { x: 113, y: 1.0464 },
    { x: 114, y: 1.0448 },
    { x: 115, y: 1.0432 },
    { x: 116, y: 1.0416 },
    { x: 117, y: 1.04 },
    { x: 118, y: 1.0384 },
    { x: 119, y: 1.0369 },
    { x: 120, y: 1.0354 },
    { x: 121, y: 1.0339 },
    { x: 122, y: 1.0324 },
    { x: 123, y: 1.0309 },
    { x: 124, y: 1.0295 },
    { x: 125, y: 1.0281 },
    { x: 126, y: 1.0267 },
    { x: 127, y: 1.0253 },
    { x: 128, y: 1.0239 },
    { x: 129, y: 1.0226 },
    { x: 130, y: 1.0213 },
    { x: 131, y: 1.02 },
    { x: 132, y: 1.0187 },
    { x: 133, y: 1.0174 },
    { x: 134, y: 1.0162 },
    { x: 135, y: 1.015 },
    { x: 136, y: 1.0138 },
    { x: 137, y: 1.0126 },
    { x: 138, y: 1.0114 },
    { x: 139, y: 1.0103 },
    { x: 140, y: 1.0091 },
    { x: 141, y: 1.008 },
    { x: 142, y: 1.0069 },
    { x: 143, y: 1.0059 },
    { x: 144, y: 1.0048 },
    { x: 145, y: 1.0038 },
    { x: 146, y: 1.0028 },
    { x: 147, y: 1.0018 },
    { x: 148, y: 1.0008 },
    { x: 149, y: 0.9999 },
    { x: 150, y: 0.9985 },
    { x: 151, y: 0.998 },
    { x: 152, y: 0.9971 },
    { x: 153, y: 0.9962 },
    { x: 154, y: 0.9954 },
    { x: 155, y: 0.9946 },
    { x: 156, y: 0.9937 },
    { x: 157, y: 0.9929 },
    { x: 158, y: 0.9922 },
    { x: 159, y: 0.9914 },
    { x: 160, y: 0.9907 },
    { x: 161, y: 0.99 },
    { x: 162, y: 0.9893 },
    { x: 163, y: 0.9886 },
    { x: 164, y: 0.9879 },
    { x: 165, y: 0.9873 },
    { x: 166, y: 0.9867 },
    { x: 167, y: 0.9861 },
    { x: 168, y: 0.9855 }]


// 以下多项式拟合代码由ChatGPT生成
export const polyfit = (degree, points) => {// 拟合多项式的次数
    degree = parseInt(degree)
    points = JSON.parse(points)
    // 构建矩阵A和向量b
    const A = [];
    const b = [];
    points.forEach(point => {
        const row = [];
        for (let i = degree; i >= 0; i--) {
            row.push(pow(point.x, i));
        }
        A.push(row);
        b.push(point.y);
    });
    // 转换为mathjs的矩阵
    const Am = matrix(A);
    const bm = matrix(b);
    // 使用mathjs函数解最小二乘问题
    const ATAm = multiply(transpose(Am), Am);
    const ATb = multiply(transpose(Am), bm);
    const coefficients = lusolve(ATAm, ATb);
    return (coefficients.toArray().map(e => +e[0].toFixed(10))).toString()
    // 根据系数计算多项式的值
    // function polyfitMain(coefficients, x) {
    //     return coefficients.reduce((sum, value, index) => sum + value * pow(x, coefficients.length - index - 1), 0);
    // }
    // 测试多项式拟合结果
    // const x = 1
    // console.log(`当x=${x}时，多项式的值为:`, polyfitMain(coefficients.toArray().map(e => e[0]), x));
}
// console.log(polyfit(3, '[{ "x": 1, "y": 4 }, { "x": 2, "y": 9 }, { "x": 3, "y": 16 },{ "x": 4, "y": 25 }]'))
const numbers = [1.2071, 1.2065, 1.2059, 1.2053, 1.2047, 1.2040, 1.2033, 1.2026, 1.2019, 1.2012, 1.2004, 1.1996, 1.1988, 1.1980, 1.1972, 1.1963, 1.1955, 1.1946, 1.1937, 1.1927, 1.1918, 1.1908, 1.1898, 1.1888, 1.1878, 1.1867, 1.1856, 1.1846, 1.1835, 1.1823, 1.1812, 1.1800, 1.1788, 1.1776, 1.1764, 1.1751, 1.1739, 1.1726, 1.1713, 1.1700, 1.1686, 1.1673, 1.1659, 1.1645, 1.1631, 1.1616, 1.1602, 1.1587, 1.1572, 1.1557, 1.1541, 1.1526, 1.1510, 1.1494, 1.1478, 1.1462, 1.1445, 1.1428, 1.1411, 1.1394, 1.1377, 1.1359, 1.1342, 1.1324, 1.1306, 1.1287, 1.1269, 1.1250, 1.1231, 1.1212, 1.1193, 1.1174, 1.1154, 1.1134, 1.1114, 1.1094, 1.1073, 1.1053, 1.1032, 1.1011, 1.0990, 1.0968, 1.0966, 1.0965, 1.0961, 1.0959, 1.0958, 1.0936, 1.0915, 1.0894, 1.0873, 1.0852, 1.0832, 1.0812, 1.0792, 1.0772, 1.0752, 1.0733, 1.0713, 1.0694, 1.0676, 1.0657, 1.0638, 1.0620, 1.0602, 1.0584, 1.0566, 1.0549, 1.0531, 1.0514, 1.0497, 1.0481, 1.0464, 1.0448, 1.0432, 1.0416, 1.0400, 1.0384, 1.0369, 1.0354, 1.0339, 1.0324, 1.0309, 1.0295, 1.0281, 1.0267, 1.0253, 1.0239, 1.0226, 1.0213, 1.0200, 1.0187, 1.0174, 1.0162, 1.0150, 1.0138, 1.0126, 1.0114, 1.0103, 1.0091, 1.0080, 1.0069, 1.0059, 1.0048, 1.0038, 1.0028, 1.0018, 1.0008, .9999, .9985, .9980, .9971, .9962, .9954, .9946, .9937, .9929, .9922, .9914, .9907, .9900, .9893, .9886, .9879, .9873, .9867, .9861, .9855]
// 把数组转成对象
const arr2Obj = numbers => numbers.map((value, index) => ({ x: index + 1, y: value }))
// console.log(JSON.stringify(arr2Obj(numbers)))
// console.log(arr2Obj(numbers))
