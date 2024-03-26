import { r1, r3 } from '../newm_vsop.mjs'
import NutaList from './nutation_list.mjs'
import NutaList1 from './nutation_list1.mjs'
const { nals_t, cls_t, napl_t, cpl_t } = NutaList1
import { chain } from 'mathjs'
const pi2 = 6.283185307179586476925287
const S2R = 4.848136811095359935899141e-6
const MMS2R = 4.848136811095359935899141e-13

const fmod = (X, m) => X - Math.floor(X / m) * m // (X % m + m) % m
const obliqAvg = T => 84381.406 - 46.836769 * T - .0001831 * T ** 2 + .00200340 * T ** 3 - .000000576 * T ** 4 - .0000000434 * T ** 5


/**
 * 計算章動需要用到的基本輻角
 * @param {*} T 
 * @returns F
 */
const ff = T => {
    const F = [S2R * (134.96340251 * 3600 + 1717915923.2178 * T + 31.8792 * T ** 2 + .051635 * T ** 3 - .00024470 * T ** 4), // F1≡l月球平近點角
    S2R * (357.52910918 * 3600 + 129596581.0481 * T - .5532 * T ** 2 + .000136 * T ** 3 - .00001149 * T ** 4), // F2≡l'太陽平近點角
    S2R * (93.27209062 * 3600 + 1739527262.8478 * T - 12.7512 * T ** 2 - .001037 * T ** 3 + .00000417 * T ** 4), // F3≡F- omega 月球平黃經-月軌升交平黃經
    S2R * (297.85019547 * 3600 + 1602961601.2090 * T - 6.3706 * T ** 2 + .006593 * T ** 3 - .00003169 * T ** 4), // F4≡D 月日平距角
    S2R * (125.04455501 * 3600 - 6962890.5431 * T + 7.4722 * T ** 2 + .007702 * T ** 3 - .00005939 * T ** 4), // F5≡omega月軌升交平黃經
    // 以下八大行星平黃經和平黃經總歲差。單位弧度
    4.402608842 + 2608.7903141574 * T, // F6≡LMercury
    3.176146697 + 1021.3285546211 * T, // F7≡LVenus
    1.753470314 + 628.3075849991 * T, // F8≡LEarth
    6.203480913 + 334.0612426700 * T, // F9≡LMars
    0.599546497 + 52.9690962641 * T, // F10≡LJupiter
    0.874016757 + 21.3299104960 * T, // F11≡LSaturn
    5.481293872 + 7.4781598567 * T, // F12≡LUranus
    5.311886287 + 3.8133035638 * T, // F13≡LNeptune
    0.02438175 * T + 0.00000538691 * T ** 2] // F14≡pA
    for (let i = 0; i < F.length - 1; i++) {
        F[i] = (F[i] % pi2 + pi2) % pi2
    }
    return F
}
// 黃經章動
const nutaEclp_Kujihhoe = T => {
    const F = ff(T)
    let EclpPart1 = 0, EclpPart2 = 0
    for (let i = 0; i < EclpNutaList1.length; i++) {
        let thA = 0
        for (let j = 0; j < F.length; j++) {
            thA += EclpNutaList3[i][j] * F[j]
        }
        EclpPart1 += EclpNutaList1[i][0] * Math.sin(thA) // sin中是弧度
            + EclpNutaList1[i][1] * Math.cos(thA)
    }
    for (let i = 0; i < EclpNutaList2.length; i++) {
        let thA1 = 0
        for (let j = 0; j < F.length; j++) {
            thA1 += EclpNutaList4[i][j] * F[j]
        }
        EclpPart2 += (EclpNutaList2[i][0] * Math.sin(thA1)
            + EclpNutaList2[i][1] * Math.cos(thA1)) * T
    }
    return S2R * ((EclpPart1 + EclpPart2)) // 黃經章動，轉換為弧度
}
// 黃赤交角章動
const nutaObliq_Kujihhoe = T => {
    const F = ff(T)
    let ObliqPart1 = 0, ObliqPart2 = 0
    for (let i = 0; i < ObliqNutaList1.length; i++) {
        let thA = 0
        for (let j = 0; j < F.length; j++) {
            thA += ObliqNutaList3[i][j] * F[j]
        }
        ObliqPart1 += ObliqNutaList1[i][0] * Math.sin(thA)
            + ObliqNutaList1[i][1] * Math.cos(thA)
    }
    for (let i = 0; i < ObliqNutaList2.length; i++) {
        let thA1 = 0
        for (let j = 0; j < F.length; j++) {
            thA1 += ObliqNutaList4[i][j] * F[j]
        }
        ObliqPart2 += (ObliqNutaList2[i][0] * Math.sin(thA1)
            + ObliqNutaList2[i][1] * Math.cos(thA1)) * T
    }
    return S2R * (ObliqPart1 + ObliqPart2) // 黃赤交角章動，轉換為弧度輸出
}

/**
 * 移植自 https://github.com/brandon-rhodes/python-novas/Cdist/nutation.c
 * @param {*} T 
 * @returns 黃經章動、黃赤交角章動
 */
const aa = T => { // 單位秒
    let F = [
        134.96340251 * 3600 + 1717915923.2178 * T + 31.8792 * T ** 2 + .051635 * T ** 3 - .00024470 * T ** 4, // F1≡l月球平近點角
        357.52910918 * 3600 + 129596581.0481 * T - .5532 * T ** 2 + .000136 * T ** 3 - .00001149 * T ** 4, // F2≡l'太陽平近點角
        93.27209062 * 3600 + 1739527262.8478 * T - 12.7512 * T ** 2 - .001037 * T ** 3 + .00000417 * T ** 4, // F3≡F- omega 月球平黃經-月軌升交平黃經
        297.85019547 * 3600 + 1602961601.2090 * T - 6.3706 * T ** 2 + .006593 * T ** 3 - .00003169 * T ** 4, // F4≡D 月日平距角
        125.04455501 * 3600 - 6962890.5431 * T + 7.4722 * T ** 2 + .007702 * T ** 3 - .00005939 * T ** 4 // F5≡omega月軌升交平黃經
    ]
    F = F.map(value => fmod(value * S2R, pi2))
    return F
}
const aa1 = T => { // 單位弧度
    const F = [
        2.35555598 + 8328.6914269554 * T, //  Mean anomaly of the Moon. al
        6.24006013 + 628.301955 * T,//Mean anomaly of the Sun. alsu
        1.627905234 + 8433.466158131 * T, //   Mean argument of the latitude of the Moon. af
        5.198466741 + 7771.3771468121 * T, // Mean elongation of the Moon from the Sun. ad
        2.18243920 - 33.757045 * T, // Mean longitude of the ascending node of the Moon. aom
        4.402608842 + 2608.7903141574 * T, // F6≡LMercury
        3.176146697 + 1021.3285546211 * T, // F7≡LVenus
        1.753470314 + 628.3075849991 * T, // F8≡LEarth
        6.203480913 + 334.0612426700 * T, // F9≡LMars
        0.599546497 + 52.9690962641 * T, // F10≡LJupiter
        0.874016757 + 21.3299104960 * T, // F11≡LSaturn
        5.481293872 + 7.4781598567 * T, // F12≡LUranus
        5.311886287 + 3.8133035638 * T, // F13≡LNeptune
        0.02438175 * T + 0.00000538691 * T ** 2    // F14≡pAGeneral accumulated precession in longitude. apa
    ]
    for (let i = 0; i < F.length - 1; i++) {
        F[i] = fmod(F[i], pi2)
    }
    return F
}

function nutation(T) {
    const a = aa(T)
    // Initialize the nutation values
    let dp = 0.0, de = 0.0, dp1 = 0.0, de1 = 0.0
    // Luni-solar nutation series
    for (let i = 677; i >= 0; i--) {
        const arg = ((nals_t[i][0] * a[0] +
            nals_t[i][1] * a[1] +
            nals_t[i][2] * a[2] +
            nals_t[i][3] * a[3] +
            nals_t[i][4] * a[4]) % pi2);
        const sarg = Math.sin(arg);
        const carg = Math.cos(arg);
        dp += (cls_t[i][0] + cls_t[i][1] * T) * sarg
            + cls_t[i][2] * carg;
        de += (cls_t[i][3] + cls_t[i][4] * T) * carg
            + cls_t[i][5] * sarg;
    }
    // Convert from 0.1 microarcsec units to radians
    const dpsils = dp;
    const depsls = de;
    const a1 = aa1(T)
    // Planetary nutation series
    for (let i = 686; i >= 0; i--) {
        const arg = ((napl_t[i][0] * a1[0] +
            napl_t[i][1] * a1[1] +
            napl_t[i][2] * a1[2] +
            napl_t[i][3] * a1[3] +
            napl_t[i][4] * a1[4] +
            napl_t[i][5] * a1[5] +
            napl_t[i][6] * a1[6] +
            napl_t[i][7] * a1[7] +
            napl_t[i][8] * a1[8] +
            napl_t[i][9] * a1[9] +
            napl_t[i][10] * a1[10] +
            napl_t[i][11] * a1[11] +
            napl_t[i][12] * a1[12] +
            napl_t[i][13] * a1[13]) % pi2);
        const sarg = Math.sin(arg);
        const carg = Math.cos(arg);
        dp1 += cpl_t[i][0] * sarg + cpl_t[i][1] * carg;
        de1 += cpl_t[i][2] * sarg + cpl_t[i][3] * carg;
    }
    const dpsipl = dp1;
    const depspl = de1;
    // Total nutation
    const dpsi = dpsipl + dpsils
    const deps = depspl + depsls
    // Return the results as an object instead of modifying by reference
    return { NutaEclp: dpsi * MMS2R, NutaObliq: deps * MMS2R };
}
// const T1 = performance.now()
// console.log(nutaEclp_Kujihhoe(10))
// console.log(nutaObliq_Kujihhoe(10))
// const T2 = performance.now()
// console.log(nutation(1)) // 結果很接近
// const T3 = performance.now()
// console.log(T2 - T1, T3 - T2) // 5ms, 1.2ms

/**
 * 
 * @param {*} T 儒略世纪
 * @param {*} NutaEclp 黃經章動
 * @returns 章動矩陣N
 */
export const nutaMx = T => {
    const { NutaEclp, NutaObliq } = nutation(T)
    const ObliqAvg = obliqAvg(T) * S2R
    const Obliq = ObliqAvg + NutaObliq // 黃赤交角，單位弧度
    // 章動矩陣 N = R1(−ε)R3(−∆ψ)R1(εA)
    const N = chain(r1(-Obliq)).multiply(r3(-NutaEclp)).multiply(r1(ObliqAvg)).done()
    return { N, Obliq }
}
// console.log(nutaMx((2475656.1 - 2451545) / 36525).Obliq)
// console.log(nutaMx(1))
