import { big } from './para_constant.mjs'

export const HighEqua1 = (nine, eight, seven, six, five, four, three, two, one, zero, upperRaw) => {
    let mid = 0
    let lower = 0
    let upper = Number(upperRaw)
    const equation = x => big(nine).mul(big(x).pow(9)).add(big(eight).mul(big(x).pow(8))).add(big(seven).mul(big(x).pow(7))).add(big(six).mul(big(x).pow(6))).add(big(five).mul(big(x).pow(5))).add(big(four).mul(big(x).pow(4))).add(big(three).mul(big(x).pow(3))).add(big(two).mul(big(x).pow(2))).add(big(one).mul(x)).add(zero)
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
    return {
        upper: upper.toFixed(15)
    }
}
// 0.748507253641946590505540370941162109375 // 1e-10
// 0.7485072536414568988849538300200947560369968414306640625 // 1e-16
// 0.748507253641456891163318450549741762154054209798291790550559457 // 1e-62跟1e-10，13位開始不同；跟1e-16，18位開始不同
// console.log(HighEqua1(1, -2, 4, 1, 1, -10, 1, 1, 1, 1, 1).upper)
