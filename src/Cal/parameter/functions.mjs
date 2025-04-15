import big from "decimal.js";
import frc from "fraction.js";
import nzh from "nzh/hk";

big.config({
  precision: 64,
  toExpNeg: -60,
  toExpPos: 60,
  rounding: 4
});

export { big, frc, nzh };
// nzh = new nzh({
//     ch: '〇一二三四五六七八九',      // 数字字符
//     ch_u: '个十百千萬億兆京',       // 数位单位字符，万以下十进制，万以上万进制，个位不能省略
// });

// console.log(big(big.acos(-1)).div(12).toString())
export const pi = 3.14159265358979323846264338327950288419716939937510582097494459;
export const pi2 = 6.28318530717958647692528676655900576839433879875021164194988918;
export const S2R = 4.84813681109535993589914102357947975956353302372701515582553e-6; // pi/180/3600
export const MMS2R = 4.84813681109535993589914102357947975956353302372701515583e-13;
export const D2R = 0.01745329251994329576923690768488612713442871888541725456097191; // pi/180
export const R2D = 57.2957795130823208767981548141051703324054724665643215491602439; // 180/pi
export const R2H = 3.81971863420548805845321032094034468882703149777095476994401626; // 180/pi/15
export const H2R = 0.26179938779914943653855361527329190701643078328125881841457872;
export const c = 299792.458;
export const cDay = 25902068371.2;
export const AU = 149597870.7; // km
export const Parsec = 30856775814899.2582629; // 206264.806247 * AU

export const abs = (X) => Math.abs(X);
export const sqr = (X) => Math.sqrt(X);
export const sign = (X) => Math.sign(X);
export const fmod = (X, m) => X - Math.floor(X / m) * m; // (X % m + m) % m
export const fmod1 = (X, m) => Math.round((((X + m) % m) + m) % (m + 0.01)); // 0-->12
// console.log(fmod(-370, 360)) // 350
export const fm60 = (X) => X - Math.floor(X / 60) * 60; //fmod(X, 60);
export const sind = (X) => Math.sin(D2R * X); //.toFixed(8) // 數理精蘊附八線表用的是七位小數
export const sin2d = (X) => 2 * sind(X / 2); // 通弦
export const atan2d = (a, b) => R2D * Math.atan2(a, b);
export const cosd = (X) => Math.cos(D2R * X); //.toFixed(8)
export const tand = (X) => Math.tan(D2R * X); //.toFixed(8)
export const cotd = (X) => 1 / Math.tan(D2R * X); //.toFixed(8)
export const vsind = (X) => 1 - Math.cos(D2R * X); //.toFixed(8) // 正矢
export const asind = (X) => R2D * Math.asin(X); //.toFixed(8)
export const acosd = (X) => R2D * Math.acos(X); //.toFixed(8)
export const atand = (X) => R2D * Math.atan(X); //.toFixed(8)
export const acotd = (X) => 90 - R2D * Math.atan(X); //.toFixed(8)
export const avsind = (X) => acosd(1 - X);

export const fm360 = (X) => fmod(X, 360); //(X % 360 + 360) % 360
export const t1 = (X) => abs(180 - (X % 360)); // x不及半周者，与半周相减；过半周者，减半周。——與180的距離
export const t2 = (X) => Math.min(X % 360, 360 - (X % 360)); // x過半周者，與全周相減。——與0的距離
export const t3 = (X) => 90 - abs(90 - (X % 180)); // x过一象限者，与半周相减；过半周者，减半周；过三象限者，与全周相减。——與0、180的距離
export const f1 = (X) => (X % 360 > 180 ? 1 : -1); // 不及半周为减，过半周为加。
export const f2 = (X) => (X % 360 < 180 ? 1 : -1);
export const f3 = (X) => ((X % 360) % 180 > 90 ? 1 : -1); // 一、三象限加，二、四象限減
export const f4 = (X) => ((X % 360) % 180 < 90 ? 1 : -1);

export const deci = (x) => +("." + x.toString().split(".")[1]) || 0; // 截取小數
// console.log(4999999999999.14%1) // = .1396484375
// console.log(4999999999999.14-Math.floor(4999999999999.14)) // = .1396484375
export const fix = (x, n) => {
  const a = (x * 100).toFixed(n || 2);
  return (+a < 10 ? "0" : "") + a;
};
export const r2dfix = (x) => x * R2D.toFixed(2);

export const lat2NS = (x) => {
  if (x) return (x > 0 ? "N" : "S") + abs(x).toFixed(4);
  else return undefined;
};

const deg2Hms = (deg) => {
  const Deci = deci(deg);
  const m = Math.trunc(60 * Deci);
  const s = Math.trunc(3600 * Deci - 60 * m);
  // const ss = Math.round(216000 * Deci - 3600 * m - 60 * s)
  let mStr = m.toString();
  let sStr = s.toString();
  if (mStr.length < 2) mStr = `0${mStr}`;
  if (sStr.length < 2) sStr = `0${sStr}`;
  return `${Math.trunc(deg)}°${mStr}′${sStr}″`; // + ss
};

export const lat2NS1 = (x) => {
  if (x) return (x > 0 ? "N" : "S") + deg2Hms(Math.abs(x));
  else return undefined;
};

// const debounce = (fn, delay) => {
//   let timer = 100; // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
//   return (...args) => {
//     // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
//     clearTimeout(timer); // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），再过 delay 毫秒就执行 fn
//     timer = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
// };
