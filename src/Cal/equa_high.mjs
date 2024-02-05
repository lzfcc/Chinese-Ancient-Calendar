import { big } from './para_constant.mjs'

// function myMax(z, ...args) {
//     let ans = -Infinity
//     for (const x of args) {
//         if (x > ans) ans = x
//     }
//     return ans
// }
// console.log(myMax(12, 4, 2, 1, 6, 2, 9))


// @lzfcc 试比较：
// a_9 * x ^ 9 + a_8 * x ^ 8 + ... + a_0 共 (10+9+...+1) = 55 次乘法，9 次加法。
// 但是如果变形成：
// (...((a_9 * x + a_8 ) * x + a_7) * x.... ) * x + a_0 共 9 次乘法，9 次加法。当然这只是理论上，其实对于我们这规模的输入差别不大（甚至可能反优化）。
export const HighEqua1 = (upperRaw, Input) => {
    let mid = 0
    let lower = 0
    let upper = Number(upperRaw)
    const equation = x => {
        let ans = big(0)
        for (let i = 0; i < Input.length; i++) {
            ans = ans.mul(x).add(big(Input[i]))
        }
        return ans
    }
    if (upper > 0) {
        while (big.sub(upper, lower).gt(1e-62)) {
            mid = big.add(lower, upper).div(2)
            if (big.mul(equation(mid), equation(lower)).lt(0)) {
                upper = mid
            } else {
                lower = mid
            }
        }
    } else {
        while (big.sub(upper, lower).lt(-1e-62)) {
            mid = big.add(lower, upper).div(2)
            if (big.mul(equation(mid), equation(lower)).lt(0)) {
                upper = mid
            } else {
                lower = mid
            }
        }
    }
    if (big(upper).eq(upperRaw)) {
        throw (new Error('[高次方程] 無解，可能估根錯誤'))
    }
    return upper.toFixed(15)
}
// .748507253641946590505540370941162109375 // 1e-10
// .7485072536414568988849538300200947560369968414306640625 // 1e-16
// .748507253641456891163318450549741762154054209798291790550559457 // 1e-62跟1e-10，13位開始不同；跟1e-16，18位開始不同
// console.log(HighEqua1(2, -2, 0, 3, 1))
