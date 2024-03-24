import { multiply } from 'mathjs';
import VsopList from './vsop87a_list.mjs'

// 以下求VSOP87曆表、ELP2000曆表，移植自orbit.js
const AU = 149597870.7 // km
const PlanetList = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'];
export const vsop87XV = (target, Jd) => {
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
export const vsop87X = (target, Jd) => {
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
