// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import { transpose, multiply, matrix, chain, add, subtract, tan } from 'mathjs'
import { ScList } from './para_constant.mjs'
import { TT2UT1 } from './astronomy_west.mjs'
// import NutaList from './nutation_list.mjs'
import NutaList1 from './nutation_list1.mjs'
import VsopList from './vsop87a_list.mjs'
import Elp2000List from './elp2000-82b_list.mjs'
import { Date2Jd, Jd2Date, generateTimeString } from './time_jd2date.mjs'
import { deg2Hms } from './newm_shixian.mjs'
// const { EclpNutaList1, EclpNutaList2, EclpNutaList3, EclpNutaList4, ObliqNutaList1, ObliqNutaList2, ObliqNutaList3, ObliqNutaList4 } = NutaList
const { nals_t, cls_t, napl_t, cpl_t } = NutaList1
const abs = X => Math.abs(X)
const fmod = (X, m) => X - Math.floor(X / m) * m // (X % m + m) % m
const pi = Math.PI
const pi2 = 6.283185307179586476925287
const d2r = d => d * .0174532925199432957692369 // pi / 180
const r2d = r => r * 57.2957795130823208767981548 // 180 / pi
const s2r = s => s * 4.848136811095359935899141e-6 // s / 3600 * pi / 180
const S2R = 4.848136811095359935899141e-6
const MMS2R = 4.848136811095359935899141e-13
const sqr = X => Math.sqrt(X)
const r2dfix = X => deg2Hms(r2d(X))
// console.log(LonHigh2Flat(23.4385828209, 330))
// console.log(LonFlat2High(23.4916666666667,73.80638)) // 考成卷八葉37算例
// const LowLon2LowLat = (e, X) => atan(tan(e) * sin(X)) // 求赤經高弧交角用到這個的變形
// const LowLat2HighLon = (e, X) => // 已知太陽赤緯轉黃經
// console.log(LonHigh2Flat(23.5,15))
// console.log(HighLon2FlatLat(23 + 29 / 60,112.28487818))
// console.log(LowLat2HighLon(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=.3973413465. HAB=23.41207808

// 以下求VSOP87曆表、ELP2000曆表，移植自orbit.js
const AU = 149597870.7 // km
const PlanetList = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'];
const vsop87XV = (target, Jd) => {
    const List = VsopList[target];
    let pos = [0, 0, 0], vel = [0, 0, 0]
    const T = (Jd - 2451545) / 365250;
    for (let indDim = 0; indDim < 3; indDim++) {
        for (let indPower = 0; indPower < 6; indPower++) {
            const coeffs = List[indDim][indPower];
            const tPower = Math.pow(T, indPower);
            for (let indCoeff = 0; indCoeff < coeffs.length; indCoeff++) {
                const coeff0 = coeffs[indCoeff][0];
                const coeff1 = coeffs[indCoeff][1];
                const coeff2 = coeffs[indCoeff][2];
                pos[indDim] += tPower * coeff0 * Math.cos(coeff1 + coeff2 * T);
                vel[indDim] -= tPower * coeff0 * coeff2 * Math.sin(coeff1 + coeff2 * T);
            }
        }
    }
    // Convert units from au and au/s to m and m/s.
    // v = au / (1000 * year) = 149597870700 m / (365250 * 86400 s) = 4.740470463533349 m/s=409.5766480493km/day
    const vFactor = 409.5766480492813141683778234
    return {
        X: multiply(pos, AU),
        V: multiply(vel, vFactor)
    };
}
// const startTime = performance.now();
// console.log(vsop87XV('Earth', 2452545).X)
// const endTime = performance.now();
// console.log(endTime - startTime) // 計算一個2.8ms，一秒計算360個
// 只計算位置不計算速度
const vsop87X = (target, Jd) => {
    const List = VsopList[target];
    let pos = [0, 0, 0]
    const T = (Jd - 2451545) / 365250;
    for (let indDim = 0; indDim < 3; indDim++) {
        for (let indPower = 0; indPower < 6; indPower++) {
            const coeffs = List[indDim][indPower];
            const tPower = Math.pow(T, indPower);
            for (let indCoeff = 0; indCoeff < coeffs.length; indCoeff++) {
                const coeff0 = coeffs[indCoeff][0];
                const coeff1 = coeffs[indCoeff][1];
                const coeff2 = coeffs[indCoeff][2];
                pos[indDim] += tPower * coeff0 * Math.cos(coeff1 + coeff2 * T);
            }
        }
    }
    return multiply(pos, AU)
}
// console.log(vsop87X('Earth', 2421564))
// ELP2000代碼移植自orbit.js https://vsr83.github.io/orbits.js/
// This implementation is based on the document 
// Cahpront-Touze, Chapront, Francou - LUNAR SOLUTION ELP version ELP 2000-82B, 1985,
// 2001 Reprint
// as well as the reference Fortran implementation available from:
// http://cdsarc.u-strasbg.fr/viz-bin/ftp-index?/ftp/pub/ftp/ftp/ftp/catv/6/79/example.f

// The following table contains the complete expressions for the arguments W_1, W_2, W_3,
// T, ϖ', which are computed as 4th order polynomials of Julian centuries after Epoch.
// J. Chapront, M. Chapront-Touze, G.Francou - A new determination of lunar
// orbital parameters, precession constant and tidal acceleration from LLR measurements,
// Astronomy Astrophysics, March 2002.
const elp2000 = (Jd) => {
    const argumentPolynomialCoefficients = [
        // W_1 : Polynomial coefficients for mean mean longitude of the Moon.
        [785939.8782, 1732559343.3328, -6.870, 0.006604, -0.00003169],
        // W_2 : Polynomial coefficients for mean longitude of the lunar perigee
        [300071.6518, 14643420.3304, -38.2639, -0.045047, 0.00021301],
        // W_3 : Polynomial coefficients for the mean longitude of the lunar ascending node.
        [450160.3265, -6967919.8851, 6.3593, 0.007625, -0.00003586],
        // T : Polynomial coefficients for the mean longitude of the Earth-Moon barycenter.
        [361679.1880, 129597742.3016, -0.0202, 0.000009, 0.00000015],
        // ϖ' : Polynomial coefficients for the mean longitude of the perihelion of the 
        // Earth-Moon barycenter.
        [370574.4136, 1161.2283, 0.5327, -0.000138, 0.0]
    ];

    // Table F - Planetary longitudes in J2000 and mean motions ("/cy) from VSOP82.
    const planetaryPolynomialCoefficients = [
        [908103.25986, 538101628.68898],    // Mercury
        [655127.28305, 210664136.43355],    // Venus
        [361679.22059, 129597742.2758],     // Earth
        [1279559.78866, 68905077.59284],    // Mars
        [123665.34212, 10925660.42861],     // Jupiter
        [180278.89694, 4399609.65932],      // Saturn
        [1130598.01841, 1542481.19393],     // Uranus
        [1095655.19575, 786550.32074]       // Neptune
    ];
    // Section 7 - Constants fitted to DE200/LE200:
    const corrections = {
        deltanu: s2r(.55604) / argumentPolynomialCoefficients[0][1],
        deltaE: s2r(.01789),
        deltaGamma: s2r(-.08066),
        deltanp: s2r(-.06424) / argumentPolynomialCoefficients[0][1],
        deltaep: s2r(-.12879)
    };
    const dtasm = 2.0 * 0.002571881335 / (3.0 * 0.074801329518);
    const am = 0.074801329518;
    const precessionConstant = 5029.0966 - 0.0316;
    /**
     * Evaluate polynomials for W_1, W_2, W_3, T and OBP.
     * 
     * @param {*} t 
     *      Julian centuries after epoch.
     * @param {*} n 
     *      Polynomial degree.
     * @returns Object with values W1, W2, W3, T and OBP.
     */
    function evaluateArgumentPolynomials(t, n) {
        const elpArguments = [0.0, 0.0, 0.0, 0.0, 0.0];
        for (let i = 0; i < 5; i++) {
            let tn = 1.0;
            for (let j = 0; j < n; j++) {
                elpArguments[i] += argumentPolynomialCoefficients[i][j] * tn;
                tn *= t;
            }
        }
        return {
            W1: elpArguments[0],
            W2: elpArguments[1],
            W3: elpArguments[2],
            T: elpArguments[3],
            OBP: elpArguments[4]
        };
    }
    /**
     * Evaluate Delaunay arguments.
     * 
     * @param {*} elpArguments 
     *      The arguments computed by above routine.
     * @returns Object with values D, LP, L and F.
     */
    function evaluateDelaunayArguments(elpArguments) {
        const delArguments = {};
        delArguments.D = elpArguments.W1 - elpArguments.T + 648000.0;
        delArguments.LP = elpArguments.T - elpArguments.OBP;
        delArguments.L = elpArguments.W1 - elpArguments.W2;
        delArguments.F = elpArguments.W1 - elpArguments.W3;
        return delArguments;
    }
    function evaluatePlanetaryArguments(t) {
        let planetaryArguments = [];
        for (let i = 0; i < planetaryPolynomialCoefficients.length; i++) {
            planetaryArguments.push(planetaryPolynomialCoefficients[i][0]
                + planetaryPolynomialCoefficients[i][1] * t);
        }
        return planetaryArguments;
    }
    /**
     * Compute the sum involved in the longitude (ELP01) and latitude terms (ELP02)
     * of the main problem.
     * 
     * @param {*} delArgs 
     *      An object with the Delaunay arguments computed for the given point in time.
     * @param {*} data 
     *      The ELP01/ELP02 data as an array of objects.
     * @returns The sum.
     */
    function computeMainFigureSin(delArgs, data) {
        let sum = 0.0;
        for (let i = 0; i < data.length; i++) {
            // Constants fitted to DE200/LE200.
            let A = data[i].A
                + (data[i].B1 + dtasm * data[i].B5)
                * (corrections.deltanp - am * corrections.deltanu)
                + data[i].B2 * corrections.deltaGamma
                + data[i].B3 * corrections.deltaE
                + data[i].B4 * corrections.deltaep;
            // A sin(i_1 D + i_2l' + i_3l + i_4F)
            sum += A * Math.sin((data[i].i1 * delArgs.D
                + data[i].i2 * delArgs.LP
                + data[i].i3 * delArgs.L
                + data[i].i4 * delArgs.F) * Math.PI / 648000.0);
        }
        return sum;
    }

    /**
     * Compute the sum involved in the distance terms (ELP03) of the main problem.
     * @param {*} delArgs An object with the Delaunay arguments computed for the given point in time.
     * @param {*} data The ELP03 data as an array of objects.
     * @returns The sum.
     */
    function computeMainFigureCos(delArgs, data) {
        let sum = 0.0;
        for (let i = 0; i < data.length; i++) {
            // Constants fitted to DE200/LE200.
            let A = data[i].A - (2.0 / 3.0) * data[i].A * corrections.deltanu
                + (data[i].B1 + dtasm * data[i].B5)
                * (corrections.deltanp - am * corrections.deltanu)
                + data[i].B2 * corrections.deltaGamma
                + data[i].B3 * corrections.deltaE
                + data[i].B4 * corrections.deltaep;
            // A cos(i_1 D + i_2l' + i_3l + i_4F)
            sum += A * Math.cos((data[i].i1 * delArgs.D
                + data[i].i2 * delArgs.LP
                + data[i].i3 * delArgs.L
                + data[i].i4 * delArgs.F) * Math.PI / 648000.0);
        }
        return sum;
    }
    /**
     * Compute the sum involved in the non-planetary perturbations (ELP04-ELP09, ELP22-ELP36).
     * 
     * @param {*} precession
     *      The precession term.
     * @param {*} delArgs 
     *      An object with the Delaunay arguments computed for the given point in time.
     * @param {*} data 
     *      The ELPXX data as an array of objects.
     * @returns The sum.
     */
    function computeNonPlanetary(precession, delArgs, data) {
        let sum = 0.0;
        for (let i = 0; i < data.length; i++) {
            // A sin(i_1\zeta + i_2 D + i_3 l' + i_4 l + i_5 F + \phi)
            sum += data[i].A * Math.sin((data[i].i1 * precession
                + data[i].i2 * delArgs.D
                + data[i].i3 * delArgs.LP
                + data[i].i4 * delArgs.L
                + data[i].i5 * delArgs.F) * Math.PI / 648000.0
                + data[i].phi * Math.PI / 180.0);
        }
        return sum;
    }
    /**
     * Compute the sum involved in the planetary perturbations Table 1 (ELP10-ELP15).
     * 
     * @param {*} precession
     *      The precession term.
     * @param {*} delArgs 
     *      An object with the Delaunay arguments computed for the given point in time.
     * @param {*} data 
     *      The ELPXX data as an array of objects.
     * @returns The sum.
     */
    function computePlanetary1(planetaryArgs, delArgs, data) {
        let sum = 0.0;
        for (let i = 0; i < data.length; i++) {
            // A sin(i_1 Me + i_2 V + i_3 T + i_4 Ma + i_5 J + i_6 S + i_7 U + i_8 N 
            //     + i_9 D + i_10 L + i_11 F + \phi)
            // Important : \phi is in degrees
            sum += data[i].A * Math.sin((data[i].i1 * planetaryArgs[0]
                + data[i].i2 * planetaryArgs[1]
                + data[i].i3 * planetaryArgs[2]
                + data[i].i4 * planetaryArgs[3]
                + data[i].i5 * planetaryArgs[4]
                + data[i].i6 * planetaryArgs[5]
                + data[i].i7 * planetaryArgs[6]
                + data[i].i8 * planetaryArgs[7]
                + data[i].i9 * delArgs.D
                + data[i].i10 * delArgs.L
                + data[i].i11 * delArgs.F) * Math.PI / 648000.0
                + data[i].phi * Math.PI / 180.0);
        }
        return sum;
    }
    /**
     * Compute the sum involved in the planetary perturbations Table 2 (ELP16-ELP21).
     * 
     * @param {*} precession
     *      The precession term.
     * @param {*} delArgs 
     *      An object with the Delaunay arguments computed for the given point in time.
     * @param {*} data 
     *      The ELPXX data as an array of objects.
     * @returns The sum.
     */
    function computePlanetary2(planetaryArgs, delArgs, data) {
        let sum = 0.0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i].A * Math.sin((data[i].i1 * planetaryArgs[0]
                + data[i].i2 * planetaryArgs[1]
                + data[i].i3 * planetaryArgs[2]
                + data[i].i4 * planetaryArgs[3]
                + data[i].i5 * planetaryArgs[4]
                + data[i].i6 * planetaryArgs[5]
                + data[i].i7 * planetaryArgs[6]
                + data[i].i8 * delArgs.D
                + data[i].i9 * delArgs.LP
                + data[i].i10 * delArgs.L
                + data[i].i11 * delArgs.F) * Math.PI / 648000.0
                + data[i].phi * Math.PI / 180.0);
        }
        return sum;
    }
    /**
     * Compute position of the Moon with ELP2000-82b in the ecliptic geocentric J2000 frame.
     * 
     * @param {*} Jd 
     *      Julian time (TDB).
     * @returns Position in meters.
     */
    const elp2000Main = Jd => {
        // Julian centuries after epoch.
        const T = (Jd - 2451545.0) / 36525.0;
        // Evaluate the Delaunay arguments D, l', l, F with 4th order polynomials.
        const elpArgumentsFull = evaluateArgumentPolynomials(T, 5);
        const delArgsFull = evaluateDelaunayArguments(elpArgumentsFull);

        // For ELP04 - ELP36, the Delaunay arguments D, l', l, F are reduced to their
        // linear parts:
        const elpArgumentsLin = evaluateArgumentPolynomials(T, 2);
        const delArgsLin = evaluateDelaunayArguments(elpArgumentsLin);
        const zeta = argumentPolynomialCoefficients[0][0]
            + T * (argumentPolynomialCoefficients[0][1] + precessionConstant);
        const planetaryArgs = evaluatePlanetaryArguments(T);
        // Main problem.
        let longitude = computeMainFigureSin(delArgsFull, Elp2000List.ELP01);
        let latitude = computeMainFigureSin(delArgsFull, Elp2000List.ELP02);
        let distance = computeMainFigureCos(delArgsFull, Elp2000List.ELP03);
        // Earth figure perturbations.
        longitude += computeNonPlanetary(zeta, delArgsLin, Elp2000List.ELP04);
        latitude += computeNonPlanetary(zeta, delArgsLin, Elp2000List.ELP05);
        distance += computeNonPlanetary(zeta, delArgsLin, Elp2000List.ELP06);
        longitude += computeNonPlanetary(zeta, delArgsLin, Elp2000List.ELP07) * T;
        latitude += computeNonPlanetary(zeta, delArgsLin, Elp2000List.ELP08) * T;
        distance += computeNonPlanetary(zeta, delArgsLin, Elp2000List.ELP09) * T;
        // Planetary perturbations. Table 1.
        longitude += computePlanetary1(planetaryArgs, delArgsLin, Elp2000List.ELP10);
        latitude += computePlanetary1(planetaryArgs, delArgsLin, Elp2000List.ELP11);
        distance += computePlanetary1(planetaryArgs, delArgsLin, Elp2000List.ELP12);
        longitude += computePlanetary1(planetaryArgs, delArgsLin, Elp2000List.ELP13) * T;
        latitude += computePlanetary1(planetaryArgs, delArgsLin, Elp2000List.ELP14) * T;
        distance += computePlanetary1(planetaryArgs, delArgsLin, Elp2000List.ELP15) * T;
        // Planetary perturbations. Table 2.
        longitude += computePlanetary2(planetaryArgs, delArgsLin, Elp2000List.ELP16);
        latitude += computePlanetary2(planetaryArgs, delArgsLin, Elp2000List.ELP17);
        distance += computePlanetary2(planetaryArgs, delArgsLin, Elp2000List.ELP18);
        longitude += computePlanetary2(planetaryArgs, delArgsLin, Elp2000List.ELP19) * T;
        latitude += computePlanetary2(planetaryArgs, delArgsLin, Elp2000List.ELP20) * T;
        distance += computePlanetary2(planetaryArgs, delArgsLin, Elp2000List.ELP21) * T;
        // Tidal effects.
        longitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP22);
        latitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP23);
        distance += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP24);
        longitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP25) * T;
        latitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP26) * T;
        distance += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP27) * T;
        // Moon figure perturbations.
        longitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP28);
        latitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP29);
        distance += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP30);
        // Relativistic perturbation.
        longitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP31);
        latitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP32);
        distance += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP33);
        // Planetary perturbations (solar eccentricity).
        longitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP34) * T * T;
        latitude += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP35) * T * T;
        distance += computeNonPlanetary(0.0, delArgsLin, Elp2000List.ELP36) * T * T;
        longitude += elpArgumentsFull.W1;
        // Convert longitude and latitude from arcseconds to radians:
        longitude *= Math.PI / 648000.0;
        latitude *= Math.PI / 648000.0;
        const xMod = distance * Math.cos(longitude) * Math.cos(latitude);
        const yMod = distance * Math.sin(longitude) * Math.cos(latitude);
        const zMod = distance * Math.sin(latitude);
        // Laskar's series.
        const P = 0.10180391e-4 * T + 0.47020439e-6 * T * T - 0.5417367e-9 * T * T * T
            - 0.2507948e-11 * T * T * T * T + 0.463486e-14 * T * T * T * T * T;
        const Q = -0.113469002e-3 * T + 0.12372674e-6 * T * T + 0.12654170e-8 * T * T * T
            - 0.1371808e-11 * T * T * T * T - 0.320334e-14 * T * T * T * T * T;
        // Rectangular coordinates in inertial mean ecliptic and equinox of J2000:
        const sqrtTerm = Math.sqrt(1 - P * P - Q * Q);
        const xJ2000 = (1 - 2 * P * P) * xMod
            + (2 * P * Q) * yMod
            + 2 * P * sqrtTerm * zMod;
        const yJ2000 = (2 * P * Q) * xMod
            + (1 - 2 * Q * Q) * yMod
            - 2 * Q * sqrtTerm * zMod;
        const zJ2000 = (-2 * P * sqrtTerm) * xMod
            + 2 * Q * sqrtTerm * yMod
            + (1 - 2 * P * P - 2 * Q * Q) * zMod;
        return [xJ2000, yJ2000, zJ2000]
    }
    return elp2000Main(Jd)
}
// const startTime = performance.now();
// console.log(elp2000(2452545))
// const endTime = performance.now();
// console.log(endTime - startTime) // 計算一個3.5ms，一秒計算280個
// 只計算位置。
const calX = (Name, Jd) => {
    let X = []
    if (Name === 'Moon') X = elp2000(Jd)
    else if (Name === 'Sun') { // 以地心作為標準
        X = multiply(vsop87X('Earth', Jd), -1)
    } else if (Name === 'Earth') { // 以日心為標準
        X = vsop87X(Name, Jd)
    } else {
        const XEarth = vsop87X('Earth', Jd)
        const XTarget = vsop87X(Name, Jd)
        X = subtract(XTarget, XEarth)
    }
    return [[X[0]], [X[1]], [X[2]]]
}
// 計算位置、速度
const calXV = (Name, Jd) => {
    let X = [], V = []
    if (Name === 'Moon') {
        X = elp2000(Jd)
        V = multiply(subtract(X, elp2000(Jd - .000001157407407)), 864000) // 用0.1秒的路程來近似
    } else if (Name === 'Sun') {
        const Func = vsop87XV('Earth', Jd)
        X = multiply(Func.X, -1)
        V = multiply(Func.V, -1)
    } else if (Name === 'Earth') {
        const Func = vsop87XV(Name, Jd)
        X = Func.X
        V = Func.V
    } else {
        const { X: XEarth, V: VEarth } = vsop87XV('Earth', Jd)
        const { X: XTarget, V: VTarget } = vsop87XV(Name, Jd)
        X = subtract(XTarget, XEarth)
        V = subtract(VTarget, VEarth)
    }
    return { X: [[X[0]], [X[1]], [X[2]]], V: [[V[0]], [V[1]], [V[2]]] } // 返回GCRS位置、速度
}
// console.log(calXV('Moon', 2451537.45).X)
// 以下分別為R1 R2 R3 ，分別爲x, y, z軸旋轉矩陣。輸入弧度
const r1 = a => matrix([
    [1, 0, 0],
    [0, Math.cos(a), Math.sin(a)],
    [0, -Math.sin(a), Math.cos(a)]
])
const r2 = b => matrix([
    [Math.cos(b), 0, -Math.sin(b)],
    [0, 1, 0],
    [Math.sin(b), 0, Math.cos(b)]
])
const r3 = g => matrix([
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
const x2LonLat = X => {
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
const obliqAvg = T => 84381.406 - 46.836769 * T - .0001831 * T ** 2 + .00200340 * T ** 3 - .000000576 * T ** 4 - .0000000434 * T ** 5
// 參考架偏差矩陣 frame bias matrix
const B = matrix([
    [.99999999999999425, -7.078279744e-8, 8.05614894e-8],
    [7.078279478e-8, .99999999999999695, 3.306041454e-8],
    [-8.056149173e-8, -3.306040884e-8, .999999999999996208]])
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

function precessionMx(T) {
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
/**
 * 計算章動需要用到的基本輻角
 * @param {*} T 
 * @returns F
 */
const ff = T => {
    const F = [s2r(134.96340251 * 3600 + 1717915923.2178 * T + 31.8792 * T ** 2 + .051635 * T ** 3 - .00024470 * T ** 4), // F1≡l月球平近點角
    s2r(357.52910918 * 3600 + 129596581.0481 * T - .5532 * T ** 2 + .000136 * T ** 3 - .00001149 * T ** 4), // F2≡l'太陽平近點角
    s2r(93.27209062 * 3600 + 1739527262.8478 * T - 12.7512 * T ** 2 - .001037 * T ** 3 + .00000417 * T ** 4), // F3≡F- omega 月球平黃經-月軌升交平黃經
    s2r(297.85019547 * 3600 + 1602961601.2090 * T - 6.3706 * T ** 2 + .006593 * T ** 3 - .00003169 * T ** 4), // F4≡D 月日平距角
    s2r(125.04455501 * 3600 - 6962890.5431 * T + 7.4722 * T ** 2 + .007702 * T ** 3 - .00005939 * T ** 4), // F5≡omega月軌升交平黃經
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
// // 黃經章動
// const nutaEclp_Kujihhoe = T => {
//     const F = ff(T)
//     let EclpPart1 = 0, EclpPart2 = 0
//     for (let i = 0; i < EclpNutaList1.length; i++) {
//         let thA = 0
//         for (let j = 0; j < F.length; j++) {
//             thA += EclpNutaList3[i][j] * F[j]
//         }
//         EclpPart1 += EclpNutaList1[i][0] * Math.sin(thA) // sin中是弧度
//             + EclpNutaList1[i][1] * Math.cos(thA)
//     }
//     for (let i = 0; i < EclpNutaList2.length; i++) {
//         let thA1 = 0
//         for (let j = 0; j < F.length; j++) {
//             thA1 += EclpNutaList4[i][j] * F[j]
//         }
//         EclpPart2 += (EclpNutaList2[i][0] * Math.sin(thA1)
//             + EclpNutaList2[i][1] * Math.cos(thA1)) * T
//     }
//     return s2r((EclpPart1 + EclpPart2)) // 黃經章動，轉換為弧度
// }
// // 黃赤交角章動
// const nutaObliq_Kujihhoe = T => {
//     const F = ff(T)
//     let ObliqPart1 = 0, ObliqPart2 = 0
//     for (let i = 0; i < ObliqNutaList1.length; i++) {
//         let thA = 0
//         for (let j = 0; j < F.length; j++) {
//             thA += ObliqNutaList3[i][j] * F[j]
//         }
//         ObliqPart1 += ObliqNutaList1[i][0] * Math.sin(thA)
//             + ObliqNutaList1[i][1] * Math.cos(thA)
//     }
//     for (let i = 0; i < ObliqNutaList2.length; i++) {
//         let thA1 = 0
//         for (let j = 0; j < F.length; j++) {
//             thA1 += ObliqNutaList4[i][j] * F[j]
//         }
//         ObliqPart2 += (ObliqNutaList2[i][0] * Math.sin(thA1)
//             + ObliqNutaList2[i][1] * Math.cos(thA1)) * T
//     }
//     return s2r(ObliqPart1 + ObliqPart2) // 黃赤交角章動，轉換為弧度輸出
// }

/**
 * 移植自 https://github.com/brandon-rhodes/python-novas/Cdist/nutation.c
 * @param {*} T 
 * @returns 黃經章動、黃赤交角章動
 */
function nutation(T) {
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
// console.log(nutation(10)) // 結果很接近
// const T3 = performance.now()
// console.log(T2 - T1, T3 - T2) // 5ms, 1.2ms

/**
 * 
 * @param {*} T 儒略世纪
 * @param {*} NutaEclp 黃經章動
 * @returns 章動矩陣N
 */
const nutaMx = T => {
    const { NutaEclp, NutaObliq } = nutation(T)
    const ObliqAvg = obliqAvg(T) * S2R
    const Obliq = ObliqAvg + NutaObliq // 黃赤交角，單位弧度
    // 章動矩陣 N = R1(−ε)R3(−∆ψ)R1(εA)
    const N = chain(r1(-Obliq)).multiply(r3(-NutaEclp)).multiply(r1(ObliqAvg)).done()
    return { N, Obliq }
}
// console.log(nutaMx((2475656.1 - 2451545) / 36525).Obliq)

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
 * // const ObliqAvg = obliqAvg(T) * S2R
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
 * @param {*} Name 
 * @param {*} Jd 
 * @returns 
 */
const calPos = (Name, Jd) => {
    const T = (Jd - 2451545) / 36525 // 儒略世紀
    const Xreal = calX(Name, Jd) // 實際位置
    const Jdr = calLightAber(Jd, Xreal) // 推遲時
    const { X, V } = calXV(Name, Jdr) // 視位置
    const { Lon: LonRaw } = x2LonLat(X) //  1024-3-15 2:37,VSOP的LonRaw是13°34′49″，DE441是12.48，一個黃道一個赤道
    const { N, Obliq } = nutaMx(T)
    const P = precessionMx(T) // 歲差矩陣 P(t)
    const R1Eps = r1(Obliq)
    const EquaRaw = multiply(transpose(R1Eps), X) // ⚠️此處注意，分析曆表的座標是黃道，所以必須要先轉成赤道，與廖育棟文檔上的順序不太相同。排查了一個下午終於找到問題了
    const NPB = chain(N).multiply(P).multiply(B).done()
    const Equa = multiply(NPB, EquaRaw).toArray()
    const Eclp = multiply(R1Eps, Equa).toArray()
    const Eclp1 = multiply(NPB, V).toArray()
    // X=[x, y, z]. Lon=atan2(y, x). derivativeLon =(xy'-yx')/(x^2+y^2). 欲求x', y', 求 X' ≈ R1(Ep t)N(t)P(t)B[v(tr)-vE(tr)]
    const Lon1 = (Eclp[0] * Eclp1[1] - Eclp[1] * Eclp1[0]) / (Eclp[0] ** 2 + Eclp[1] ** 2) // 經度的時間導數
    let { Lon: EquaLon, Lat: EquaLat } = x2LonLat(Equa)
    EquaLon = (EquaLon + pi2) % pi2
    let { Lon, Lat } = x2LonLat(Eclp)
    Lon = (Lon + pi2) % pi2
    return { EquaLon, EquaLat, Lon, Lat, Lon1, LonRaw }
    // return { Lon: r2dfix(Lon), LonRaw: r2dfix(LonRaw) }
}
// console.log(calPos('Sun', 2095147.609028 - 0.333333)) // 1024-3-15 2:37 Lon: '1°8′34″', LonRaw: '13°34′49″
// console.log(calPos('Sun', 2460389.9625 - 0.333333)) // 2024-3-20 11:06 Lon: '359°59′55″', LonRaw: '0°18′37″
// const startTime = performance.now();
// console.log(calPos1('Sun', 2460357.500552209).Lon)
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

export const N5 = (Name, Y) => {
    const EpoSolsJd = 2451534.749 // 取癸卯曆1999年12月22日平冬至時間儒略日
    // const EpoSolsJd = 2086292.4148
    const ChouConst = 15.68 // 採用癸卯曆首朔應，即十二月平朔距冬至的時間。與時憲曆用冬至次日夜半，我直接用冬至
    const CloseOriginAd = 2000
    // const CloseOriginAd = 1000
    const Solar = 365.2422, Lunar = 29.530588853
    const TermLeng = Solar / 12
    const OriginAccum = +((Y - CloseOriginAd) * Solar).toFixed(9) // 中積
    const SolsJd = EpoSolsJd + OriginAccum
    const ChouSd = (Lunar - OriginAccum % Lunar + ChouConst) % Lunar // 首朔
    const main = (isNewm, LeapNumTerm) => {
        const AcrJd = [], UT18Sc = [], UT18Deci = [], NowDeci = [], Eclp = [], Equa = [], AcrTermJd = [], TermAcrSc = [], TermAcrDeci = [], TermEqua = [], TermEclp = [], Term1AcrSc = [], Term1AcrDeci = [], Term1Equa = [], Term1Eclp = []
        // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望
            const AvgSd = ChouSd + (i + (isNewm ? 0 : .5)) * Lunar // 各月平朔望到冬至次日子正日分
            const AvgJd = AvgSd + SolsJd
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
            const UT18Jd = AcrJd[i] - TT2UT1(Y) + 8 / 24
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
                const AvgTermJd = AvgTermSd + SolsJd
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
                const UT18TermJd = AcrTermJd[i] + 8 / 24 - TT2UT1(Y)
                const UT18TermJdDate = Jd2Date(UT18TermJd)
                TermAcrSc[i] = ScList[UT18TermJdDate.ScOrder]
                TermAcrDeci[i] = generateTimeString(UT18TermJdDate.h, UT18TermJdDate.m, UT18TermJdDate.s)
                const FuncTermEclp = calPos('Sun', AcrTermJd[i])
                TermEqua[i] = r2dfix(FuncTermEclp.EquaLon)
                // 節氣
                const Term1Lon = d2r(((2 * i + 1) * 15 + 270) % 360)
                const AvgTerm1Sd = (i + .5) * TermLeng
                const AvgTerm1Jd = AvgTerm1Sd + SolsJd
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
                const UT18Term1Jd = AcrTerm1Jd + 8 / 24 - TT2UT1(Y)
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
        NewmJd, SolsJd
    }
}
// console.log(N5('Eph1', -1124))