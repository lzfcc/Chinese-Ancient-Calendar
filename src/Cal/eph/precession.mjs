import { r1, r3 } from '../newm_vsop.mjs'
import { matrix, chain } from 'mathjs'
const pi2 = 6.283185307179586476925287
const S2R = 4.848136811095359935899141e-6

/**
 * 
 * @param {*} T
 * @returns IAU2006歲差矩陣 P
 */
const precessionMx_IAU2006 = T => {
    const Ep0 = s2r(84381.406)
    const PsA = s2r(5038.481507 * T - 1.0790069 * T ** 2 - .00114045 * T ** 3 + .000132851 * T ** 4 - 9.51e-8 * T ** 5) // 單位秒''
    const OmA = s2r(84381.406 - .025754 * T + .0512623 * T ** 2 - .00772503 * T ** 3 - 4.67e-7 * T ** 4 + 3.337e-7 * T ** 5)
    const ChA = s2r(10.556403 * T - 2.3814292 * T ** 2 - .00121197 * T ** 3 + .000170663 * T ** 4 - 5.6e-8 * T ** 5)
    // 直接用矩陣算
    const aa = chain(r3(ChA)).multiply(r1(-OmA)).multiply(r3(-PsA)).multiply(r1(Ep0)).done()
    return aa
    // 展開計算法
    // const S1 = Math.sin(Ep0) // sinε0
    // const C1 = Math.cos(Ep0) // cosε0
    // const S2 = Math.sin(-PsA)
    // const C2 = Math.cos(-PsA)
    // const S3 = Math.sin(-OmA)
    // const C3 = Math.cos(-OmA)
    // const S4 = Math.sin(ChA)
    // const C4 = Math.cos(ChA)
    // const P11 = C4 * C2 - S2 * S4 * C3
    // const P12 = C4 * S2 * C1 + S4 * C3 * C2 * C1 - S1 * S4 * S3
    // const P13 = C4 * S2 * S1 + S4 * C3 * C2 * S1 + C1 * S4 * S3
    // const P21 = -S4 * C2 - S2 * C4 * C3
    // const P22 = -S4 * S2 * C1 + C4 * C3 * C2 * C1 - S1 * C4 * S3
    // const P23 = -S4 * S2 * S1 + C4 * C3 * C2 * S1 + C1 * C4 * S3
    // const P31 = S2 * S3
    // const P32 = -S3 * C2 * C1 - S1 * C3
    // const P33 = -S3 * C2 * S1 + C3 * C1
    // const P = P11 + P12 + P13 + P21 + P22 + P23 + P31 + P32 + P33
}

// 以下為移植自 https://dreamalligator.github.io/vondrak/。源碼 https://github.com/dreamalligator/vondrak，/vondrak/__init__.py 文件
function pxp(a, b) {
    const xa = a[0];
    const ya = a[1];
    const za = a[2];
    const xb = b[0];
    const yb = b[1];
    const zb = b[2];
    const axb = [
        ya * zb - za * yb,
        za * xb - xa * zb,
        xa * yb - ya * xb
    ];
    return axb;
}
function ltp_pecl(T) {
    const EPS0 = 84381.406 * S2R
    // Number of polynomial and periodic coefficients
    const npol = 4;
    const nper = 8;
    // Polynomial coefficients
    const pqpol = [
        [+5851.607687, -1600.886300],
        [-0.1189000, +1.1689818],
        [-0.00028913, -0.00000020],
        [+0.000000101, -0.000000437]
    ];
    // Periodic coefficients
    const pqper = [
        [708.15, -5486.751211, -684.661560, 667.666730, -5523.863691],
        [2309.00, -17.127623, 2446.283880, -2354.886252, -549.747450],
        [1620.00, -617.517403, 399.671049, -428.152441, -310.998056],
        [492.20, 413.442940, -356.652376, 376.202861, 421.535876],
        [1183.00, 78.614193, -186.387003, 184.778874, -36.776172],
        [622.00, -180.732815, -316.800070, 335.321713, -145.278396],
        // corrected coefficient per erratum
        [882.00, -87.676083, 198.296701, -185.138669, -34.744450],
        [547.00, 46.140315, 101.135679, -120.972830, 22.885731]
    ];
    // Initialize Pₐ and Qₐ accumulators
    let P = 0.0;
    let Q = 0.0;
    // Periodic Terms
    for (let i = 0; i < nper; i++) {
        const W = pi2 * T;
        const A = W / pqper[i][0];
        const S = Math.sin(A);
        const C = Math.cos(A);
        P += C * pqper[i][1] + S * pqper[i][3];
        Q += C * pqper[i][2] + S * pqper[i][4];
    }
    // Polynomial Terms
    let W = 1.0;
    for (let i = 0; i < npol; i++) {
        P += pqpol[i][0] * W;
        Q += pqpol[i][1] * W;
        W *= T;
    }
    // Pₐ and Qₐ (radians)
    P *= S2R;
    Q *= S2R;
    // Form the ecliptic pole vector
    const Z = Math.sqrt(Math.max(1.0 - P * P - Q * Q, 0.0));
    const S = Math.sin(EPS0);
    const C = Math.cos(EPS0);
    const vec0 = P;
    const vec1 = -Q * C - Z * S;
    const vec2 = -Q * S + Z * C;
    const vec = [vec0, vec1, vec2];
    return vec;
}

function ltp_pequ(T) {
    // Number of polynomial and periodic coefficients
    const npol = 4;
    const nper = 14;
    // Polynomial coefficients
    const xypol = [
        [+5453.282155, -73750.930350],
        [+0.4252841, -0.7675452],
        [-0.00037173, -0.00018725],
        [-0.000000152, +0.000000231]
    ];
    // Periodic coefficients
    const xyper = [
        [256.75, -819.940624, 75004.344875, 81491.287984, 1558.515853],
        [708.15, -8444.676815, 624.033993, 787.163481, 7774.939698],
        [274.20, 2600.009459, 1251.136893, 1251.296102, -2219.534038],
        [241.45, 2755.175630, -1102.212834, -1257.950837, -2523.969396],
        [2309.00, -167.659835, -2660.664980, -2966.799730, 247.850422],
        [492.20, 871.855056, 699.291817, 639.744522, -846.485643],
        [396.10, 44.769698, 153.167220, 131.600209, -1393.124055],
        [288.90, -512.313065, -950.865637, -445.040117, 368.526116],
        [231.10, -819.415595, 499.754645, 584.522874, 749.045012],
        [1610.00, -538.071099, -145.188210, -89.756563, 444.704518],
        [620.00, -189.793622, 558.116553, 524.429630, 235.934465],
        [157.87, -402.922932, -23.923029, -13.549067, 374.049623],
        [220.30, 179.516345, -165.405086, -210.157124, -171.330180],
        [1200.00, -9.814756, 9.344131, -44.919798, -22.899655]
    ];
    // Initialize Pₐ and Qₐ accumulators
    let X = 0.0;
    let Y = 0.0;
    // Periodic Terms
    for (let i = 0; i < nper; i++) {
        const W = pi2 * T;
        const A = W / xyper[i][0];
        const S = Math.sin(A);
        const C = Math.cos(A);
        X += C * xyper[i][1] + S * xyper[i][3];
        Y += C * xyper[i][2] + S * xyper[i][4];
    }
    // Polynomial Terms
    let W = 1.0;
    for (let i = 0; i < npol; i++) {
        X += xypol[i][0] * W;
        Y += xypol[i][1] * W;
        W *= T;
    }
    // X and Y (direction cosines)
    X *= S2R;
    Y *= S2R;
    // Form the equator pole vector
    let veq0 = X;
    let veq1 = Y;
    const W2 = X * X + Y * Y;
    let veq2 = 0.0;
    if (W2 < 1.0) {
        veq2 = Math.sqrt(1.0 - W2);
    }
    let veq = [veq0, veq1, veq2];
    return veq;
}
// console.log(ltp_pequ(2005))
function pn(p) {
    // Modulus of p-vector
    const w = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    let u = [];
    if (w === 0.0) {
        // Zero p-vector
        u = [0.0, 0.0, 0.0];
    } else {
        // Unit vector
        const s = 1.0 / w;
        u = [s * p[0], s * p[1], s * p[2]];
    }
    const r = w;
    return { r, u };
}

export const precessionMx = T => {
    // Equator pole (bottom row of matrix)
    const peqr = ltp_pequ(T);
    // Ecliptic pole
    const pecl = ltp_pecl(T);
    // Equinox (top row of matrix)
    const V = pxp(peqr, pecl);  // P-vector outer product.
    const { r: w, u: EQX } = pn(V);  // Convert a p-vector into modulus and unit vector
    // Middle row of matrix
    const middleRow = pxp(peqr, EQX);
    // The matrix elements
    const rp = [
        EQX,        // Top row of matrix
        middleRow,  // Middle row of matrix
        peqr        // Bottom row of matrix
    ];
    return matrix(rp)
}
// const Start = performance.now()
// console.log(precessionMx_IAU2006(1))
// console.log(precessionMx(-10))
// const End = performance.now()
// console.log(End - Start) // 3ms一次