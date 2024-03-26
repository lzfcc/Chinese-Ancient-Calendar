// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
// import { exec } from 'child_process'
// import { EventEmitter } from 'events'
// const eventEmitter = new EventEmitter()
import { transpose, multiply, matrix, subtract } from 'mathjs'
import { ScList } from './para_constant.mjs'
import { deltaT } from './astronomy_west.mjs'
import { Jd2Date, generateTimeString } from './time_jd2date.mjs'
import { deg2Hms } from './newm_shixian.mjs'
import { precessionMx } from './eph/precession.mjs'
import { nutaMx } from './eph/nutation.mjs'
import { vsop87X, vsop87XV } from './eph/vsop.mjs'
import { elp2000 } from './eph/elp2000.mjs'
const abs = X => Math.abs(X)
const pi = Math.PI
const pi2 = 6.283185307179586476925287
const d2r = d => d * .0174532925199432957692369 // pi / 180
const r2d = r => r * 57.2957795130823208767981548 // 180 / pi
const sqr = X => Math.sqrt(X)
const r2dfix = X => deg2Hms(r2d(X))


// 只計算位置。
const calX = (Planet, Jd) => {
    let X = []
    if (Planet === 'Moon') X = elp2000(Jd)
    else if (Planet === 'Sun') { // 以地心作為標準
        X = multiply(vsop87X('Earth', Jd), -1)
    } else if (Planet === 'Earth') { // 以日心為標準
        X = vsop87X(Planet, Jd)
    } else {
        const XEarth = vsop87X('Earth', Jd)
        const XTarget = vsop87X(Planet, Jd)
        X = subtract(XTarget, XEarth)
    }
    return [[X[0]], [X[1]], [X[2]]]
}
// 計算位置、速度
const calXV = (Planet, Jd) => {
    let X = [], V = []
    if (Planet === 'Moon') {
        X = elp2000(Jd)
        V = multiply(subtract(X, elp2000(Jd - .000001157407407)), 864000) // 用0.1秒的路程來近似
    } else if (Planet === 'Sun') {
        const Func = vsop87XV('Earth', Jd)
        X = multiply(Func.X, -1)
        V = multiply(Func.V, -1)
    } else if (Planet === 'Earth') return
    else {
        const { X: XEarth, V: VEarth } = vsop87XV('Earth', Jd)
        const { X: XTarget, V: VTarget } = vsop87XV(Planet, Jd)
        X = subtract(XTarget, XEarth)
        V = subtract(VTarget, VEarth)
    }
    return { X: [[X[0]], [X[1]], [X[2]]], V: [[V[0]], [V[1]], [V[2]]] } // 返回GCRS位置、速度
}
// console.log(calXV('Mercury', 2424111))
// 以下分別為R1 R2 R3 ，分別爲x, y, z軸旋轉矩陣。輸入弧度
export const r1 = a => matrix([
    [1, 0, 0],
    [0, Math.cos(a), Math.sin(a)],
    [0, -Math.sin(a), Math.cos(a)]
])
export const r2 = b => matrix([
    [Math.cos(b), 0, -Math.sin(b)],
    [0, 1, 0],
    [Math.sin(b), 0, Math.cos(b)]
])
export const r3 = g => matrix([
    [Math.cos(g), Math.sin(g), 0],
    [-Math.sin(g), Math.cos(g), 0],
    [0, 0, 1]
])
// 位置矢量
const I = (Lon, Lat) => transpose([
    Math.cos(Lat) * Math.cos(Lon),
    Math.cos(Lat) * Math.sin(Lon),
    Math.sin(Lat)
])
// const aa = multiply(transpose(I(40, 5)), I(40, 5)) //  I·IT=1
export const x2LonLat = X => {
    X = X.flat(Infinity)
    const Lon = Math.atan2(X[1], X[0])
    // const Lat = Math.asin(X[2])
    const Lat = Math.atan2(X[2], sqr(X[0] ** 2 + X[1] ** 2))
    return { Lon, Lat }
}
// const ad = multiply(r1(.4), r1(-.4)) // 正負相乘等於1
// const R3 = r3(-0.1)
// const test = multiply(R3, ad)
// console.log(ad)
// console.log(x2LonLat([0.766044443118978, 0.5894748531529738, -0.2563109608791921]))
/**
 * 根據圖形，適用範圍+-50儒略世紀
 * @param {*} T 儒略世紀
 * @returns 平黃赤交角（單位秒''）
 */
// 參考架偏差矩陣 frame bias matrix
const B = matrix([
    [.99999999999999425, -7.078279744e-8, 8.05614894e-8],
    [7.078279478e-8, .99999999999999695, 3.306041454e-8],
    [-8.056149173e-8, -3.306040884e-8, .999999999999996208]])


const c = 299792.458 // 光速
// console.log(vec2dist([50708955572.54189, 138483686282.94858, 26896482.33861856]))
const vec2dist = arr => {
    const sumOfSquares = arr.reduce((sum, current) => sum + current ** 2, 0);
    // 返回平方和的平方根
    return sqr(sumOfSquares);
}
// 近似光行差
const calLightAber = (Jd, X) => Jd - vec2dist(X) / c / 86400
// 從[x,y,z]座標值計算經緯度

/**
 * 計算瞬時地心視黃經黃緯。在需要黃經導數的時候用calPos1，不需要的時候用calPos。注意：分析曆表的位置都是黃道座標，DE曆表是赤道座標
 * Xeq = N(t)P(t)X2000 = N(t)P(t)B·XICRS
 * Xec = R1(ε(t))Xeq = R1(ε(t))N(t)P(t)B·XICRS
 * Xeq = R1(-Ep)Xec
    // 廖育棟：計算瞬時黃道可以簡化，不計算黃赤交角章動
    // | cos∆ψ    −sin∆ψcosεA  −sin∆ψsinεA |
    // | sin∆ψ    cos∆ψcosεA    cos∆ψsinεA |
    // | 0        −sinεA        cosεA |
    // const CPs = Math.cos(DeltaPsi)
    // const SPs = Math.sin(DeltaPsi)
    // const CEpA = Math.cos(ObliqAvg)
    // const SEpA = Math.sin(ObliqAvg)
    // const R1EpsN = matrix([
    //     [CPs, -SPs * CEpA, -SPs * SEpA],
    //     [SPs, CPs * CEpA, CPs * SEpA],
    //     [0, -SEpA, CEpA]
    // ])
    // const R1EpsN = multiply(r3(-DeltaPsi), r1(ObliqAvg))    
    // const tmp = chain(R1EpsN).multiply(P).multiply(B).done()
 * @param {*} Planet 
 * @param {*} Jd 
 * @returns 
 */
const calPos = (Planet, Jd) => {
    const T = (Jd - 2451545) / 36525 // 儒略世紀
    const Xreal = calX(Planet, Jd) // 實際位置
    const Jdr = calLightAber(Jd, Xreal) // 推遲時
    const { X, V } = calXV(Planet, Jdr) // 視位置
    const X2000 = multiply(B, X)
    const V2000 = multiply(B, V)
    // const { Lon: LonRaw } = x2LonLat(X) //  1024-3-15 2:37,VSOP的LonRaw是13°34′49″，DE441是12.48，一個黃道一個赤道
    const { N, Obliq } = nutaMx(T)
    const P = precessionMx(T) // 歲差矩陣 P(t)
    const NP = multiply(N, P)
    const R1Eps = r1(Obliq)
    // ⚠️此處注意，分析曆表的座標是黃道，所以必須要先轉成赤道，與廖育棟文檔上的順序不太相同。排查了一個下午終於找到問題了
    const Equa = multiply(NP, multiply(transpose(R1Eps), X2000)).toArray()
    const Equa1 = multiply(NP, multiply(transpose(R1Eps), V2000)).toArray()
    const Eclp = multiply(R1Eps, Equa).toArray()
    const Eclp1 = multiply(R1Eps, Equa1).toArray()
    // X=[x, y, z]. Lon=atan2(y, x). derivativeLon =(xy'-yx')/(x^2+y^2). 欲求x', y', 求 X' ≈ R1(Ep t)N(t)P(t)B[v(tr)-vE(tr)]
    const Lon1 = (Eclp[0] * Eclp1[1] - Eclp[1] * Eclp1[0]) / (Eclp[0] ** 2 + Eclp[1] ** 2) // 經度的時間導數
    let { Lon: EquaLon, Lat: EquaLat } = x2LonLat(Equa)
    EquaLon = (EquaLon + pi2) % pi2
    let { Lon, Lat } = x2LonLat(Eclp)
    Lon = (Lon + pi2) % pi2
    return { EquaLon, EquaLat, Lon, Lat, Lon1 }
}
const calPos_DE = (Planet, Jd) => {
    const T = (Jd - 2451545) / 36525 // 儒略世紀
    const Xreal = calX(Planet, Jd) // 實際位置
    const Jdr = calLightAber(Jd, Xreal) // 推遲時
    const { X, V } = calXV(Planet, Jdr) // 視位置
    const X2000 = multiply(B, X)
    const V2000 = multiply(B, V)
    // const { Lon: LonRaw } = x2LonLat(X) //  1024-3-15 2:37,VSOP的LonRaw是13°34′49″，DE441是12.48，一個黃道一個赤道
    const { N, Obliq } = nutaMx(T)
    const P = precessionMx(T) // 歲差矩陣 P(t)
    const NP = multiply(N, P)
    const R1Eps = r1(Obliq)
    const Equa = multiply(NP, X2000).toArray()
    const Equa1 = multiply(NP, V2000).toArray()
    const Eclp = multiply(R1Eps, Equa).toArray()
    const Eclp1 = multiply(R1Eps, Equa1).toArray()
    // X=[x, y, z]. Lon=atan2(y, x). derivativeLon =(xy'-yx')/(x^2+y^2). 欲求x', y', 求 X' ≈ R1(Ep t)N(t)P(t)B[v(tr)-vE(tr)]
    const Lon1 = (Eclp[0] * Eclp1[1] - Eclp[1] * Eclp1[0]) / (Eclp[0] ** 2 + Eclp[1] ** 2) // 經度的時間導數
    let { Lon: EquaLon, Lat: EquaLat } = x2LonLat(Equa)
    EquaLon = (EquaLon + pi2) % pi2
    let { Lon, Lat } = x2LonLat(Eclp)
    Lon = (Lon + pi2) % pi2
    return { EquaLon, EquaLat, Lon, Lat, Lon1 }
}
// console.log(calPos('Sun', 2095147.609028 - 0.333333)) // 1024-3-15 2:37 Lon: '1°8′34″', LonRaw: '13°34′49″
// console.log(calPos('Sun', 2460389.9625 - 0.333333)) // 2024-3-20 11:06 Lon: '359°59′55″', LonRaw: '0°18′37″
// const startTime = performance.now();
// console.log(calPos('Sun', 2433133))
// const endTime = performance.now();
// console.log(endTime - startTime) // 4.2ms一次

// 如果用以下完整的黃赤轉換，赤轉黃，需要I需要輸入赤經、赤緯。黃轉赤，I需要輸入黃經、0
// const equa2Eclp = (Obliq, EquaLon) => {
//     const i = multiply(r1(Obliq), I(EquaLon, d2r(15.6152533)))
//     const { Lon, Lat } = x2LonLat(i)
//     return { Lon, Lat }
// }
// console.log(equa2Eclp(d2r(23.5), d2r(40)))
// const ec2Eq = (Obliq, EcLon) => {
//     const i = multiply(r1(-Obliq), I(EcLon, 0))
//     const { Lon, Lat } = x2LonLat(i)
//     return { Lon, Lat }
// }
// console.log(ec2Eq(d2r(23.5), d2r(40)))
// console.log(LonFlat2High(23.5, 40))
// console.log(LonHigh2Flat(23.5, 40))
// console.log(HighLon2FlatLat(23.5, 40))

export const N5 = Y => {
    const EpoSolsJd = 2451534.749 // 取癸卯曆1999年12月22日平冬至時間儒略日
    // const EpoSolsJd = 2086292.4148
    const ChouConst = 15.68 // 採用癸卯曆首朔應，即十二月平朔距冬至的時間。與時憲曆用冬至次日夜半，我直接用冬至
    const CloseOriginAd = 2000
    // const CloseOriginAd = 1000
    const Solar = 365.2422, Lunar = 29.530588853
    const TermLeng = Solar / 12
    const OriginAccum = (Y - CloseOriginAd) * Solar // 中積
    const AvgSolsJd = EpoSolsJd + OriginAccum
    const ChouSd = (Lunar - OriginAccum % Lunar + ChouConst) % Lunar // 首朔
    const main = (isNewm, LeapNumTerm) => {
        const AcrJd = [], UT18Sc = [], UT18Deci = [], NowDeci = [], Eclp = [], Equa = [], AcrTermJd = [], TermAcrSc = [], TermAcrDeci = [], TermEqua = [], TermEclp = [], Term1AcrSc = [], Term1AcrDeci = [], Term1Equa = [], Term1Eclp = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望
            const AvgSd = ChouSd + (i + (isNewm ? 0 : .5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgJd = AvgSd + AvgSolsJd
            const delta = Jd => {
                const Sun = calPos('Sun', Jd), Moon = calPos('Moon', Jd)
                let a = Sun.Lon - Moon.Lon - (isNewm ? 0 : pi)
                const b = Moon.Lon1 - Sun.Lon1
                if (a < -7 / 4 * pi) a += pi2
                return a / b
            }
            let D = delta(AvgJd)
            AcrJd[i] = AvgJd
            while (abs(D) > 1e-5) { // 1e-8循環三次，1e-5兩次，1e-3一次。（上行的初始Delta除外）
                AcrJd[i] += D
                D = delta(AcrJd[i])
            }
            const UT18Jd = AcrJd[i] - deltaT(Y) + 8 / 24
            const UT18JdDate = Jd2Date(UT18Jd)
            UT18Sc[i] = ScList[UT18JdDate.ScOrder]
            UT18Deci[i] = generateTimeString(UT18JdDate.h, UT18JdDate.m, UT18JdDate.s)
            const FuncEclp = calPos('Sun', AcrJd[i])
            Eclp[i] = r2dfix(FuncEclp.Lon)
            Equa[i] = r2dfix(FuncEclp.EquaLon)
            //////// 節氣
            if (isNewm) {
                // 中氣
                const TermLon = d2r(((2 * i + 2) * 15 + 270) % 360)
                const AvgTermSd = (i + 1) * TermLeng
                const AvgTermJd = AvgTermSd + AvgSolsJd
                const delta = Jd => {
                    const Sun = calPos('Sun', Jd)
                    let a = TermLon - Sun.Lon
                    if (a < -7 / 4 * pi) a += pi2
                    const b = Sun.Lon1
                    return a / b
                }
                let D = delta(AvgTermJd)
                AcrTermJd[i] = AvgTermJd
                while (abs(D) > 1e-5) {
                    AcrTermJd[i] += D
                    D = delta(AcrTermJd[i])
                }
                const UT18TermJd = AcrTermJd[i] + 8 / 24 - deltaT(Y)
                const UT18TermJdDate = Jd2Date(UT18TermJd)
                TermAcrSc[i] = ScList[UT18TermJdDate.ScOrder]
                TermAcrDeci[i] = generateTimeString(UT18TermJdDate.h, UT18TermJdDate.m, UT18TermJdDate.s)
                const FuncTermEclp = calPos('Sun', AcrTermJd[i])
                TermEqua[i] = r2dfix(FuncTermEclp.EquaLon)
                // 節氣
                const Term1Lon = d2r(((2 * i + 1) * 15 + 270) % 360)
                const AvgTerm1Sd = (i + .5) * TermLeng
                const AvgTerm1Jd = AvgTerm1Sd + AvgSolsJd
                const delta1 = Jd => {
                    const Sun = calPos('Sun', Jd)
                    let a = Term1Lon - Sun.Lon
                    if (a < -7 / 4 * pi) a += pi2
                    const b = Sun.Lon1
                    return a / b
                }
                let D1 = delta1(AvgTerm1Jd), AcrTerm1Jd = AvgTerm1Jd
                while (abs(D1) > 1e-5) {
                    AcrTerm1Jd += D1
                    D1 = delta1(AcrTerm1Jd)
                }
                const UT18Term1Jd = AcrTerm1Jd + 8 / 24 - deltaT(Y)
                const UT18Term1JdDate = Jd2Date(UT18Term1Jd)
                Term1AcrSc[i] = ScList[UT18Term1JdDate.ScOrder]
                Term1AcrDeci[i] = generateTimeString(UT18Term1JdDate.h, UT18Term1JdDate.m, UT18Term1JdDate.s)
                const FuncTerm1Eclp = calPos('Sun', AcrTerm1Jd)
                Term1Equa[i] = r2dfix(FuncTerm1Eclp.EquaLon)
            }
        }
        //////// 置閏
        LeapNumTerm = LeapNumTerm || 0
        if (isNewm) {
            for (let i = 1; i <= 12; i++) {
                if ((~~AcrTermJd[i] < ~~AcrJd[i + 1]) && (~~AcrTermJd[i + 1] >= ~~AcrJd[i + 2])) {
                    LeapNumTerm = i // 閏Leap月，第Leap+1月爲閏月
                    break
                }
            }
        }
        return {
            AcrJd, UT18Sc, UT18Deci, NowDeci, Eclp, Equa,
            TermAcrSc, TermAcrDeci, TermEqua, //TermEclp,
            Term1AcrSc, Term1AcrDeci, Term1Equa, //Term1Eclp,
            LeapNumTerm
        }
    }
    const {
        AcrJd: NewmJd, UT18Sc: NewmSc, UT18Deci: NewmDeci, Equa: NewmEqua, Eclp: NewmEclp,
        TermAcrSc, TermAcrDeci, TermEqua, //TermEclp,Term1Eclp,
        Term1AcrSc, Term1AcrDeci, Term1Equa, LeapNumTerm
    } = main(true)
    const {
        UT18Sc: SyzygySc, UT18Deci: SyzygyDeci
    } = main(false, LeapNumTerm)
    return {
        NewmSc, NewmDeci, NewmEqua, NewmEclp,
        SyzygySc, SyzygyDeci,
        TermAcrSc, TermAcrDeci, TermEqua, // TermEclp,Term1Eclp
        Term1AcrSc, Term1AcrDeci, Term1Equa, LeapNumTerm,
        //// 曆書用
        NewmJd, AvgSolsJd
    }
}
// console.log(N5('VSOP', -1124))
