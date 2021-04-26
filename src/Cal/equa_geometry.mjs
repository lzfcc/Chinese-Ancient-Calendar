import {
    big
} from './para_constant.mjs'

export const Round = (r, b) => { // 弓弦長 2* sqrt (r^2-(r-b)^2)
    const Temp1 = big(r).pow(2).sub(big.sub(r, b).pow(2))
    const C = big(2).mul(big(Temp1).sqrt()).toFixed(6)
    const I = big(b).pow(2).div(r).add(C).toFixed(6) // b^2 / r + c
    const Print = '弓形弦長 ' + C + '，弧長 ' + I
    return {
        Print
    }
}
// console.log(Round(10, 0.1))

// 南宋秦九韶的《数书九章》（Mathematical Treatise in Nine Sections）中的三斜求积术：以小斜幂，并大斜幂，减中斜幂，余半之，自乘于上；以小斜幂乘大斜幂，减上，余四约之，为实；一为从隅，开平方得积。秦九韶他把三角形的三条边分别称为小斜、中斜和大斜。“术”即方法。三斜求积术就是用小斜平方加上大斜平方，减中斜平方，取余数的一半的平方，而得一个数。小斜平方乘以大斜平方，减上面所得到的那个数。相减后余数被4除,开平方后即得面积。化下简就会发现这就是传说中的已知三边求三角形面积的海伦公式。
// 海伦公式 sqrt(p (p-a) (p-b) (p-c)), p=(a+b+c)/2
// 三斜求积术 sqrt( ((c^2 a^2)-((c^2+a^2-b^2 )/2)^2)/4 )
// const date = new Date()
export const Heron = (a, b, c) => {
    const Temp1 = big(c).pow(2).mul(big(a).pow(2)) // 225
    const Temp2 = big(c).pow(2).add(big(a).pow(2)).sub(big(b).pow(2)) // 18
    const Temp3 = big(Temp1).sub(big(big(Temp2).div(2).pow(2)))
    const S = (big(big(Temp3).div(4)).sqrt()).toFixed(15)
    const Print = 'S△ABC = ' + S
    return {
        Print
    }
}
// console.log(Heron(30000000000, 40000000000, 50000000000))