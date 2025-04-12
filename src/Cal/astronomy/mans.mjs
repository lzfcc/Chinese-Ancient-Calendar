import Para from "../parameter/calendars.mjs";
import { MansNameList, MansNameListQing } from "../parameter/constants.mjs";
import { AutoLightRange } from "../parameter/auto_consts.mjs";
import {
  GongHigh2Flat,
  LonHigh2Flat,
  twilight,
  eclp2Equa,
  HighLon2FlatLat
} from "./pos_convert.mjs";
import { deci, fmod } from "../parameter/functions.mjs";
import { equaEclp } from "./equa_eclp.mjs";
import { autoRise } from "./lat_rise_dial.mjs";

// 從角開始：
const EquaDegTaichu = [
  12,
  9,
  15,
  5,
  5,
  18,
  11, //
  26,
  8,
  12,
  10,
  17,
  16,
  9, //
  16,
  12,
  14,
  11,
  16,
  2,
  9, //
  33,
  4,
  15,
  7,
  18,
  18,
  17
]; // 太初至麟德
const EquaDegDayan = [
  12,
  9,
  15,
  5,
  5,
  18,
  11, //
  26,
  8,
  12,
  10,
  17,
  16,
  9, //
  16,
  12,
  14,
  11,
  17,
  1,
  10, //
  33,
  3,
  15,
  7,
  18,
  18,
  17
]; // 大衍以後。太=.75
const EquaDegMingtian = [
  12,
  9,
  16,
  5,
  6,
  19,
  10, //
  25,
  7,
  11,
  10,
  16,
  17,
  9, //
  16,
  12,
  15,
  11,
  18,
  1,
  10, //
  34,
  2,
  14,
  7,
  18,
  18,
  17
]; // 明天的新値。「自漢太初後至唐開元治曆之初，凡八百年間，悉無更易。今雖測驗與舊不同，亦歲月未久。新曆兩備其數，如淳風從舊之意。」所以還是沿用以前的
const EquaDegJiyuan = [
  12,
  9.25,
  16,
  5.75,
  6.25,
  19.25,
  10.5, //
  25,
  7.25,
  11.25,
  9,
  15.5,
  17,
  8.75, //
  16.5,
  12,
  15,
  11.25,
  17.25,
  0.5,
  10.5, //
  33.25,
  2.5,
  13.75,
  6.75,
  17.25,
  18.75,
  17
]; // 少=1/4，太3/4。紀元的新値「如考唐，用唐所測；考古，用古所測：卽各得當時宿度。」根據年份用當時的觀測值。注意虛分要減去週天餘。金大明沿用紀元
const EquaDegShoushi = [
  12.1,
  9.2,
  16.3,
  5.6,
  6.5,
  19.1,
  10.4, //
  25.2,
  7.2,
  11.35,
  8.7,
  15.4,
  17.1,
  8.6, //
  16.6,
  11.8,
  15.6,
  11.3,
  17.4,
  0.05,
  11.1, //
  33.3,
  2.2,
  13.3,
  6.3,
  17.25,
  18.75,
  17.3
]; // 弦策少是0.25，太就是0.75。觜初五，說明初=0。大統同授時
// 甲子曆曆元赤道度
const EquaDegJiazi = [
  11.833333333333,
  9.4,
  16.55,
  5.533333333333,
  6.216666666667,
  19.65,
  10.2, // 角
  24.216666666667,
  6.916666666667,
  11.05,
  8.7,
  14.85,
  17.016666666667,
  10.866666666667, // 斗
  14.133333333333,
  11.983333333333,
  15.05,
  11.233333333333,
  16.466666666667,
  0.483333333333,
  11.483333333333, // 奎
  32.4,
  1.85,
  12.8,
  6,
  17.1,
  18.816666666667,
  17.2 // 井
];
const EquaAccumJiazi = [
  11.833333333333,
  21.233333333333,
  37.783333333333,
  43.316666666666,
  49.533333333333,
  69.183333333333,
  79.383333333333, //
  103.6,
  110.516666666667,
  121.566666666667,
  130.266666666667,
  145.116666666667,
  162.133333333333,
  173, //
  187.133333333333,
  199.116666666667,
  214.166666666667,
  225.4,
  241.866666666667,
  242.35,
  253.833333333333, //
  286.233333333333,
  288.083333333333,
  300.883333333333,
  306.883333333333,
  323.983333333333,
  342.8,
  360
];
const EclpDegEasthan = [
  13, 10, 16, 5, 5, 18, 10, 24, 7, 11, 10, 16, 18, 10, 17, 12, 15, 12, 16, 3, 8,
  30, 4, 14, 7, 17, 19, 18
];
const EclpDegHuangji = [
  13, 10, 16, 5, 5, 17, 10.5, 24, 7, 11.5, 10, 17, 17, 10, 17, 13, 15, 11, 15.5,
  2, 9, 30, 4, 14.5, 7, 17, 19, 18
]; // 《中國古代曆法》頁25的胃本來是15，寫成14了
const EclpDegLinde = [
  13, 10, 16, 5, 5, 18, 10, 24, 7, 11, 10, 16, 18, 10, 17, 13, 15, 11, 16, 2, 9,
  30, 4, 14, 7, 17, 19, 18
];
const EclpDegDayan = [
  13,
  9.5,
  15.75,
  5,
  4.75,
  17,
  10.25, //
  23.5,
  7.5,
  11.25,
  10,
  17.75,
  17.25,
  9.75, //
  17.5,
  12.5,
  14.75,
  11,
  16.25,
  1,
  9.25, //
  30,
  2.75,
  14.25,
  6.75,
  18.75,
  19.25,
  18.75
];
const EclpDegYingtian = [
  13,
  9.5,
  15.25,
  5,
  5,
  17.25,
  10.25, //
  23.5,
  7.5,
  11.75,
  10,
  17.25,
  16.75,
  10.25, //
  17.5,
  12.75,
  14.25,
  11,
  16.5,
  1,
  9.25, //
  30,
  2.75,
  14.5,
  7,
  18.25,
  19.25,
  18.75
];
const EclpDegMingtian = [
  13,
  9.5,
  15.5,
  5,
  4.75,
  17,
  10, //
  23.5,
  7.5,
  11.5,
  10,
  17.75,
  17.25,
  9.75, //
  17.75,
  12.75,
  14.5,
  10.75,
  16,
  1,
  9.25, //
  30,
  2.75,
  14.25,
  7,
  18.75,
  19.5,
  18.75
]; // 明天、觀天
const EclpDegJiyuan = [
  12.75,
  9.75,
  16.25,
  5.75,
  6,
  18.25,
  9.5, //
  23,
  7,
  11,
  9,
  16,
  18,
  9.5, //
  18,
  12.75,
  15.5,
  11,
  16.5,
  0.5,
  9.75, //
  30.5,
  2.5,
  13.25,
  6.75,
  17.75,
  20,
  18.5
];
const EclpDegDaming3 = [
  12.75,
  9.75,
  16.25,
  5.75,
  6,
  18.25,
  9.5, //
  23,
  7,
  11,
  9,
  16,
  18.25,
  9.5, //
  17.75,
  12.75,
  15.5,
  11,
  16.5,
  0.5,
  9.75, //
  30.5,
  2.5,
  13.25,
  6.75,
  17.75,
  20,
  18.5
]; // 重修大明、庚午
const EclpDegShoushi = [
  12.87,
  9.56,
  16.4,
  5.48,
  6.27,
  17.95,
  9.59, //
  23.47,
  6.9,
  11.12,
  8.75,
  15.95,
  18.32,
  9.34, //
  17.87,
  12.36,
  15.81,
  11.08,
  16.5,
  0.05,
  10.28, //
  31.03,
  2.11,
  13,
  6.31,
  17.79,
  20.09,
  18.75
]; // 授時黃道
// 西曆
const EclpDegXinfa = [
  10.583333333333,
  10.666666666667,
  17.9,
  4.766666666667,
  7.716666666667,
  15.433333333333,
  9.83333333333, //
  23.35,
  9.1,
  10.233333333333,
  9.983333333333,
  20.116666666667,
  15.683333333333,
  13.266666666667, //
  11.483333333333,
  13,
  13.016666666667,
  9.266666666667,
  13.183333333333,
  1.35,
  11.55, //
  30.416666666667,
  5.5,
  16.1,
  8.4,
  18.05,
  17,
  13.05
]; // 崇禎元年1628戊辰
// const EclpAccumXinfa = [23.35, 32.45, 42.68333333333334, 52.66666666666667, 72.78333333333333, 88.46666666666667, 101.73333333333333, 113.21666666666667, 126.21666666666668, 139.23333333333332, 148.5, 161.6833333333333, 163.03333333333333, 174.58333333333331, 205, 210.5, 226.6, 235, 253.05, 270.05, 283.1, 293.68333333333334, 304.35, 322.25, 327.01666666666665, 334.73333333333335, 350.16666666666663]
const EclpDegJiazi = [
  10.616666666666667,
  10.633333333333333,
  17.833333333333333,
  4.8333333333333333,
  7.55,
  15.933333333333333,
  9, // 角七宿76.4
  23.7833333333333,
  7.76666666666667,
  11.633333333333333,
  9.983333333333333,
  20.116666666666667,
  15.68333333333333,
  13.1, // 斗七宿102.06666666667
  11.65,
  13,
  12.25,
  9.25,
  13.966666666666667,
  1.35,
  11.55, // 奎七宿73.01666666667
  30.41666666666666,
  4.6,
  17,
  8.383333333333333,
  18.066666666666666,
  17,
  13.05 // 井七宿108.5166666667。合360度
]; // 甲子元曆黃道度，根據黃道宿鈐歸算。考成·恆星曆理·總論：黃道經緯度根據儀象志歸算而得，而儀象志與新法曆書有微異。
// const EclpAccumJiazi = [10.61666666667, 21.25, 39.08333333333, 43.91666666667, 51.46666666667, 67.4, 76.4, 100.1833333333, 107.95, 119.5833333333, 129.5666666667, 149.6833333333, 165.3666666667, 178.4666666667, 190.1166666667, 203.1166666667, 215.3666666667, 224.6166666667, 238.5833333333, 239.9333333333, 251.4833333333, 281.9, 286.5, 303.5, 311.8833333333, 329.95, 346.95, 360]
// 崇禎曆書暫未找到黃道緯度，暫用甲子元曆緯度
const EclpLatJiazi = [
  -1.98333333333333,
  2.96666666666667,
  0.43333333333333,
  -5.38333333333333,
  -3.91666666666667,
  -15,
  -6.93333333333333, // 角
  -3.83333333333333,
  4.68333333333333,
  8.16666666666667,
  8.7,
  10.7,
  19.43333333333333,
  12.58333333333333, // 斗
  15.96666666666667,
  8.48333333333333,
  11.26666666666667,
  4.16666666666667,
  -2.61666666666667,
  -23.63333333333333,
  -13.43333333333333, // 奎
  -0.88333333333333,
  -0.8,
  -12.45,
  -22.4,
  -26.2,
  -22.68333333333333,
  -14.41666666666667 // 井
];

// 西曆：所有時代都用自己的度數，古曆：各個時代用各個時代的黃道赤道，清代赤道继续用授时

export const degAccumList = (Name, Y) => {
  const {
    Type,
    OriginAd,
    CloseOriginAd,
    SolarRaw,
    MansRaw,
    MansFracPosi,
    MansConst,
    Sobliq,
    StarVy,
    MansOriginAd
  } = Para[Name];
  let { Sidereal, Solar } = Para[Name];
  let EclpListRaw = [];
  let EquaListRaw = []; // 不同時期用不同的宿度
  Sidereal = Sidereal || Solar || SolarRaw;
  const OriginYear = Y - (OriginAd || CloseOriginAd);
  const OriginYear1 = OriginYear + 1;
  if (Name === "Shoushi" || Name === "Shoushi2") {
    Sidereal += +(Math.trunc(OriginYear1 / 100) * 0.0001).toFixed(4); // 方向和歲實消長反的
    Solar = +(SolarRaw - Math.trunc(OriginYear / 100) / 10000).toFixed(4);
  }
  const raw2Accum = (ListRaw) => {
    let DegList = [];
    const DegAccumList = [];
    DegList = ListRaw.slice();
    if (MansFracPosi) DegList[MansFracPosi] += deci(Sidereal);
    DegAccumList[0] = 0;
    for (let i = 1; i < 28; i++) {
      DegAccumList[i] = DegAccumList[i - 1] + DegList[i - 1];
      DegAccumList[i] = +DegAccumList[i].toFixed(3);
    }
    return DegAccumList;
  };
  let EquaAccumList = [];
  let EclpAccumList = [];
  // 古曆是由赤道宿度算黃道，西曆是由黃道宿度算赤道
  if (Type === 13) {
    (EquaAccumList = {}), (EclpAccumList = {});
    const EquaAccumListArr = [];
    let EclpAccumListArr = [];
    const Precession = StarVy * (Y - (MansOriginAd || CloseOriginAd));
    if (Name === "Jiazi" || Name === "Guimao")
      EclpAccumListArr = raw2Accum(EclpDegJiazi);
    else EclpAccumListArr = raw2Accum(EclpDegXinfa);
    const StartEclp = (-MansConst + Precession + 270 + 360) % 360; // 宿度起算點。本質上MansConst是另一套計算度數的體系，那麼赤道上的MansConst也需要黃轉赤
    const StartEqua = LonHigh2Flat(Sobliq, StartEclp);
    for (let i = 0; i < 28; i++) {
      const EclpLon = (EclpAccumListArr[i] + StartEclp) % 360; // 某星黃經
      // EquaAccumListArr[i] = ((eclp2Equa(Sobliq, EclpLon, EclpLatJiazi[i]).EquaLon + MansConst + 90 + 360) % 360) // 這是以前錯的
      const MansEquaLon = eclp2Equa(Sobliq, EclpLon, EclpLatJiazi[i]).EquaLon;
      EquaAccumListArr[i] = (MansEquaLon - StartEqua + 360) % 360;
    }
    const adj = EquaAccumListArr[0] - 360;
    for (let i = 0; i < 28; i++) {
      EquaAccumListArr[i] = (EquaAccumListArr[i] - adj) % 360;
      EquaAccumListArr[i] = +EquaAccumListArr[i].toFixed(3);
    }
    for (let i = 0; i < 28; i++) {
      EquaAccumList[MansNameListQing[i]] = EquaAccumListArr[i];
      EclpAccumList[MansNameListQing[i]] = EclpAccumListArr[i];
    }
  } else {
    if (Y >= 1281) EquaListRaw = EquaDegShoushi;
    else if (Y >= 1106) EquaListRaw = EquaDegJiyuan;
    else if (Y >= 1065 && Name === "Mingtian") EquaListRaw = EquaDegMingtian;
    else if (Y >= 729) EquaListRaw = EquaDegDayan;
    else EquaListRaw = EquaDegTaichu;
    EquaAccumList = raw2Accum(EquaListRaw);
    if (Type >= 7) {
      const OriginDeg = EquaAccumList[MansRaw[0]] + MansRaw[1]; // 曆元宿度積度
      const Accum = OriginYear1 * Solar + (MansConst || 0);
      const SolsDeg = fmod(Accum + OriginDeg, Sidereal);
      // 參考紀元曆「求二十八宿黃道度」以及《中國古代曆法》p506
      for (let i = 0; i < 28; i++) {
        const EquaSd = (EquaAccumList[i] - SolsDeg + Sidereal) % Sidereal; // 距冬至赤道度
        EclpAccumList[i] =
          EquaAccumList[i] + equaEclp(EquaSd, Name).Equa2EclpDif; // 極黃
      }
      const adj = EclpAccumList[0] - Sidereal;
      for (let i = 0; i < 28; i++) {
        EclpAccumList[i] = +(
          (EclpAccumList[i] - adj + Sidereal) %
          Sidereal
        ).toFixed(3);
      }
    } else {
      // 麟德以前還沒發明算黃道宿鈐的方法
      if (Y >= 1281) EclpListRaw = EclpDegShoushi;
      // else if (Type === 10 && Y >= 1180 && Y <= 1280) EclpListRaw = EclpDegDaming3
      else if (Y >= 1106) EclpListRaw = EclpDegJiyuan;
      else if (Y >= 1065) EclpListRaw = EclpDegMingtian;
      else if (Y >= 964) EclpListRaw = EclpDegYingtian;
      else if (Y >= 729) EclpListRaw = EclpDegDayan;
      else if (Y >= 665) EclpListRaw = EclpDegLinde;
      else if (Name === "Huangji") EclpListRaw = EclpDegHuangji;
      else EclpListRaw = EclpDegEasthan;
      EclpAccumList = raw2Accum(EclpListRaw);
    }
    (EclpAccumList[28] = Sidereal), (EquaAccumList[28] = Sidereal);
  }
  return { EclpAccumList, EquaAccumList };
};
// console.log(degAccumList("Taichu", -2155));

export const mans2Deg = (Mans, AccumList) => {
  let Print = 0;
  if (AccumList.length === undefined) {
    Print = +(AccumList[Mans.slice(0, 1)] + +Mans.slice(1)).toFixed(11);
  } else {
    Print = +(
      AccumList[MansNameList.indexOf(Mans.slice(0, 1))] + +Mans.slice(1)
    ).toFixed(11);
  }
  return Print;
};
// console.log(mans2Deg('心2', degAccumList('Guimao', 900).EquaAccumList))
export const deg2Mans = (Deg, AccumList, fixed) => {
  Deg = +Deg + 1e-12;
  if (Deg > 365.2575) {
    alert("Deg > 365.2575");
  }
  let Print = "",
    Name = "";
  let MansDeg = 0;
  if (AccumList.length === undefined) {
    // 清代用字典
    const SortedList = Object.entries(AccumList).sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < 27; i++) {
      if (Deg >= SortedList[i][1] && Deg < SortedList[i + 1][1]) {
        Name = SortedList[i][0];
        MansDeg = Deg - SortedList[i][1];
        Print = Name + MansDeg.toFixed(fixed || 3);
        break;
      }
      Print = SortedList[27][0] + (Deg - SortedList[27][1]).toFixed(fixed || 3); // 軫
    }
  } else {
    for (let i = 0; i < 28; i++) {
      if (Deg >= AccumList[i] && Deg < AccumList[i + 1]) {
        Name = MansNameList[i];
        MansDeg = Deg - AccumList[i];
        Print = Name + MansDeg.toFixed(fixed || 3);
        break;
      }
    }
  }
  return { Print, Name, MansDeg };
};
// console.log(deg2Mans(1, degAccumList('Guimao', 900).EquaAccumList))

// 冬至日躔
export const solsMans = (Name, Y) => {
  const { SolarRaw, MansConst, MansRaw, OriginAd, CloseOriginAd } = Para[Name];
  if (!MansRaw) return;
  let { Sidereal, Solar } = Para[Name];
  const isPrecession = !!Sidereal; // 有歲差的曆法
  const { EclpAccumList, EquaAccumList } = degAccumList(Name, Y);
  Sidereal = Sidereal || Solar || SolarRaw;
  const OriginYear = Y - (OriginAd || CloseOriginAd);
  const OriginYear1 = OriginYear + 1;
  if (Name === "Shoushi" || Name === "Shoushi2") {
    Sidereal += +(Math.trunc(OriginYear1 / 100) * 0.0001).toFixed(4); // 方向和歲實消長反的
    Solar = +(SolarRaw - Math.trunc(OriginYear1 / 100) * 0.0001).toFixed(4);
  } // 置中積，以加周應爲通積，滿周天分，（上推往古，每百年消一；下算將來，每百年長一。）去之，不盡，以日周約之爲度，不滿，退約爲分秒。命起赤道虛宿六度外，去之，至不滿宿，卽所求天正冬至加時日𨇠赤道宿度及分秒。（上考者，以周應減中積，滿周天，去之；不盡，以減周天，餘以日周約之爲度；餘同上。如當時有宿度者，止依當時宿度命之。） // 試了一下，按上面這樣區分1281前後，沒有任何變化
  const OriginDeg = EquaAccumList[MansRaw[0]] + MansRaw[1]; // 曆元宿度積度
  let SolsEclpDeg = 0,
    SolsEquaDeg = 0;
  let SolsMansName = "";
  let SolsEquaMansDeg = 0,
    SolsEclpMansDeg = 0;
  /// ///// 黃道度
  if (Name === "Linde" || Name === "LindeB") {
    // 麟德：今亦依黃道推步⋯⋯置冬至初日躔差率，加總法，乘冬至小餘，如總法而一，以減天宿度分。其餘命起黃道斗十二度⋯⋯即冬至夜半所在宿度算及分——意思就是要退冬至小餘太陽走過的度數得到冬至夜半度數
    SolsEclpDeg = OriginDeg;
    const Func = deg2Mans(SolsEclpDeg, EclpAccumList);
    SolsMansName = Func.Name;
    SolsEclpMansDeg = Func.MansDeg;
    SolsEquaMansDeg = equaEclp(SolsEclpMansDeg, Name).Eclp2Equa;
    SolsEquaDeg = mans2Deg(SolsMansName + SolsEquaMansDeg, EquaAccumList);
  } else {
    const OriginAccum = OriginYear * Solar;
    SolsEquaDeg = isPrecession
      ? fmod(OriginAccum + (MansConst || 0) + OriginDeg, Sidereal) // 赤道冬至。算例參《古曆新探》p85
      : OriginDeg; // 沒有歲差的是夜半宿度，所以要減去冬至當日實行度分
    const Func = deg2Mans(SolsEquaDeg, EquaAccumList);
    SolsMansName = Func.Name;
    SolsEquaMansDeg = Func.MansDeg;
    SolsEclpMansDeg = equaEclp(SolsEquaMansDeg, Name).Equa2Eclp; // 根據《太陽通軌》（《明大統曆法彙編》p128），直接用冬至赤道宿度（例如在箕5，即用5）赤轉黃即冬至黃道宿度。又如紀元曆「求天正冬至加時黃道日度」：「以冬至加時赤道日度及分秒，減一百一度⋯⋯」就是指這個5
    SolsEclpDeg = mans2Deg(SolsMansName + SolsEclpMansDeg, EclpAccumList);
  }
  return {
    EquaAccumList,
    EclpAccumList,
    SolsEquaDeg,
    SolsEclpDeg,
    SolsMansName,
    SolsEquaMansDeg,
    SolsEclpMansDeg,
    SolsEquaMans: SolsMansName + SolsEquaMansDeg.toFixed(3),
    SolsEclpMans: SolsMansName + SolsEclpMansDeg.toFixed(3)
  };
};
// console.log(solsMans("Shoushi", -2155).SolsEclpMans);
/**
 * 20240312改寫，增加黃道宿度
 * @param {*} Name 曆法名
 * @param {*} Y
 * @param {*} EclpGong 距冬至黃道實行度
 * @returns
 */
export const mans = (Name, Y, EclpGong) => {
  const { SolarRaw, MansRaw, OriginAd, CloseOriginAd } = Para[Name];
  if (!MansRaw) return;
  let { Sidereal, Solar } = Para[Name];
  // const isPrecession = !!Sidereal; // 有歲差的曆法
  const { EclpAccumList, EquaAccumList } = degAccumList(Name, Y);
  Sidereal = Sidereal || Solar || SolarRaw;
  const OriginYear = Y - (OriginAd || CloseOriginAd);
  const OriginYear1 = OriginYear + 1;
  if (Name === "Shoushi" || Name === "Shoushi2") {
    Sidereal += +(Math.trunc(OriginYear1 / 100) * 0.0001).toFixed(4); // 方向和歲實消長反的
    Solar = +(SolarRaw - Math.trunc(OriginYear1 / 100) * 0.0001).toFixed(4);
  }
  let { SolsEquaDeg, SolsEclpDeg, SolsEclpMans, SolsEquaMans } = solsMans(
    Name,
    Y
  );
  let EclpDeg = 0;
  let EquaDeg = 0;
  const EquaGong = equaEclp(EclpGong, Name).Eclp2Equa;
  // 不知道紀元是什麼原理，為什麼要算黃赤道差之差？這裏沒管。纪元p1859：【求天正冬至加時黄道日度】以冬至加時赤道日度及分秒，減一百一度，餘以冬至加時赤道日度及分秒乘之，進位，滿百爲分，分滿百爲度，命曰黃赤道差；用减冬至赤道日度及分秒，卽所求年天正冬至加時黄道日度及分秒。【求二十四氣加時黄道日度】置所求年冬至日躔黃赤道差，以次年黄赤道差減之，餘以所求氣數乘之，二十四而一，所得，以加其氣中積及約分，又以其氣初日先後數先加後減之，用加冬至加時黄道日度，依宿次命之，卽各得其氣加時黃道日躔宿度及分秒。（如其年冬至加時赤道宿度空，分秒在歲差已下者，卽加前宿全度。然求黄赤道差，餘依術算。）
  EclpDeg = (SolsEclpDeg + EclpGong) % Sidereal; // 太陽改正所得就是黃道度，此處不要赤轉黃
  EquaDeg = (SolsEquaDeg + EquaGong) % Sidereal;
  let Equa = deg2Mans(EquaDeg, EquaAccumList).Print;
  let Eclp = deg2Mans(EclpDeg, EclpAccumList).Print;
  // 以下針對的情況：大於一年的長度，其實就是下一年了。241122變了十一十二月節氣日躔。241218變了十一十二月合朔日躔，輸入的AcrSd大於solar了，所以觸發這個條件
  if (EclpGong >= (SolarRaw || Solar)) {
    const Result = mans(Name, Y + 1, EclpGong - (SolarRaw || Solar));
    Equa = Result.Equa;
    Eclp = Result.Eclp;
    EquaDeg = Result.EquaDeg;
    SolsEclpMans = Result.SolsEclpMans;
    SolsEquaMans = Result.SolsEquaMans;
  }
  return {
    Equa,
    Eclp,
    EquaDeg,
    SolsEclpMans,
    SolsEquaMans
  };
};
// console.log(mans('Shoushi', 1280, 365.2425))
/**
 * 西曆日躔
 * @param {*} Name
 * @param {*} Y 年份
 * @param {*} Gong 距冬至黃道度
 * @param {*} fixed 保留小數點幾位
 * @param {*} isEqua true: Gong是赤道度
 * @returns
 */
export const mansQing = (Name, Y, Gong, isEqua) => {
  const { StarVy, Sobliq, MansConst, CloseOriginAd, MansOriginAd } = Para[Name];
  const { EclpAccumList, EquaAccumList, Exchange } = degAccumList(Name, Y);
  const Precession = StarVy * (Y - (MansOriginAd || CloseOriginAd));
  const SolsEclpDeg = fmod(MansConst - Precession, 360); // 冬至黃道宿積度（宿的度量體系）從角0度開始，冬至在多少度
  // 此處照抄古曆，只是黃赤互換
  const { Name: SolsMansName, MansDeg: SolsEclpMansDeg } = deg2Mans(
    SolsEclpDeg,
    EclpAccumList
  );
  const SolsEquaDeg = GongHigh2Flat(Sobliq, SolsEclpDeg); // 直接這樣算即可，因為平常是逆時針加，這裏是順時針加，只是方向反了，但度數不變
  const SolsEquaMans = deg2Mans(SolsEquaDeg, EquaAccumList).Print;
  let EclpMansGong = 0;
  let EquaMansGong = 0;
  if (isEqua) {
    const PrecessionFrac = GongHigh2Flat(Sobliq, (Gong / 360) * StarVy);
    EquaMansGong = SolsEquaDeg + Gong - PrecessionFrac;
  } else {
    const PrecessionFrac = (Gong / 360) * StarVy;
    EclpMansGong = SolsEclpDeg + Gong - PrecessionFrac;
    EquaMansGong = SolsEquaDeg + GongHigh2Flat(Sobliq, Gong - PrecessionFrac);
  }
  return {
    Eclp: deg2Mans(EclpMansGong % 360, EclpAccumList).Print,
    Equa: deg2Mans(EquaMansGong % 360, EquaAccumList).Print,
    SolsEclpMans: SolsMansName + SolsEclpMansDeg.toFixed(3),
    SolsEquaMans,
    Exchange
  };
};
// console.log(mansQing('Guimao', 333, 150))
/**
 * 昏中《中》頁326昬時距午度（卽太陽時角）=Sidereal*半晝漏（單位1日），夜半至昬東行度數=2-夜漏=1-(Rise-LightRange)，夜半至明東行度數=Rise-LightRange
昏中=昬時距午度+夜半至昬東行度數=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(.5-夜半漏)*週天-夜半漏（單位1日）
 */
export const midstar = (Name, Y, EclpGong, Sd, SolsDeci) => {
  const { Type, Sidereal } = Para[Name];
  const { EquaAccumList } = degAccumList(Name, Y);
  const { EquaDeg } = mans(Name, Y, EclpGong);
  const LightRange = AutoLightRange(Name);
  const Rise = autoRise(Sd, SolsDeci, Name) / 100;
  const HalfLight = 0.5 - Rise + LightRange; // 半晝漏
  const HalfNight = Rise - LightRange;
  const MorningstarDeg =
    (EquaDeg + Sidereal * (1 - HalfLight) + (Type === 7 ? 0 : HalfNight)) %
    Sidereal; // 大衍只考慮了昬時距午度
  const DuskstarDeg =
    (EquaDeg + Sidereal * HalfLight + (Type === 7 ? 0 : 1 - HalfNight)) %
    Sidereal;
  const Duskstar = deg2Mans(DuskstarDeg, EquaAccumList, 2).Print;
  const Morningstar = deg2Mans(MorningstarDeg, EquaAccumList, 2).Print;
  return { Morningstar, Duskstar };
};

export const midstarQing = (Name, Y, LonTod, LonMor, Rise) => {
  const {
    StarVy,
    Solar,
    MansConst,
    Sobliq,
    RiseLat,
    CloseOriginAd,
    MansOriginAd
  } = Para[Name];
  const { EquaAccumList } = degAccumList(Name, Y);
  const Precession = StarVy * (Y - (MansOriginAd || CloseOriginAd));
  const EquaMansGongTod = GongHigh2Flat(
    Sobliq,
    LonTod + 90 - Precession + MansConst
  );
  const SunVd = LonMor - LonTod;
  const SunEquaVd = LonHigh2Flat(Sobliq, LonMor) - LonHigh2Flat(Sobliq, LonTod);
  const Twilight = twilight(
    RiseLat,
    HighLon2FlatLat(Sobliq, (LonTod + SunVd / 2) % 360)
  );
  const MorningstarTmp =
    (Rise - Twilight) * SunEquaVd - (0.5 - Rise + Twilight) * 360; // 考成上編中星時刻法沒有考慮地球公轉
  const DuskstarTmp =
    (1 - Rise + Twilight) * SunEquaVd + (0.5 - Rise + Twilight) * 360;
  const Morningstar = deg2Mans(
    ((EquaMansGongTod + MorningstarTmp) * (Solar / 360) + Solar) % Solar,
    EquaAccumList,
    2
  ).Print;
  const Duskstar = deg2Mans(
    ((EquaMansGongTod + DuskstarTmp) * (Solar / 360) + Solar) % Solar,
    EquaAccumList,
    2
  ).Print;
  return { Morningstar, Duskstar };
};

// const MansList = [ // 赤道度
//     [0, ''],
//     [12, '角'], // 1 東蒼龍 總75
//     [9, '亢'], // 2
//     [15, '氐'], // 3
//     [5, '房'], // 4
//     [5, '心'], // 5
//     [18, '尾'], // 6
//     [11, '箕'], // 7
//     [26, '斗'], // 8 北玄武 總98
//     [8, '牛'], // 9
//     [12, '女'], // 10
//     [10, '虛'], // 11
//     [17, '危'], // 12
//     [16, '室'], // 13
//     [9, '壁'], // 14
//     [16, '奎'], // 15 西白虎 總80
//     [12, '婁'], // 16
//     [14, '胃'], // 17
//     [11, '昴'], // 18
//     [16, '畢'], // 19
//     [2, '觜'], // 20
//     [9, '參'], // 21
//     [33, '井'], // 22 南朱雀 總112
//     [4, '鬼'], // 23
//     [15, '柳'], // 24
//     [7, '星'], // 25
//     [18, '張'], // 26
//     [18, '翼'], // 27
//     [17, '軫'], // 28
// ]
// 黃赤度經過以下檢驗都沒問題了
// let EquaDegList = []
// let EquaAccumList = []
// EquaDegList = EquaDegShoushi.slice()
// EquaAccumList = EquaDegList.slice()
// for (let i = 1; i <= 29; i++) {
//     EquaAccumList[i] += EquaAccumList[i - 1]
// }
// EquaAccumList = EquaAccumList.slice(-1).concat(EquaAccumList.slice(0, -1))
// EquaAccumList[0] = 0
// const EclpDegXinfaAccum = [ // 月離曆指弟十四。「此表崇禎元年定測。以後每年加五十二秒，七十年一度。」即1628戊辰年前冬至在箕4.2833333333
//   0 * 30 + 5 + 33 / 60, // 斗，星紀
//   0 * 30 + 28 + 54 / 60,
//   1 * 30 + 8, // 女，玄枵
//   1 * 30 + 18 + 14 / 60,
//   1 * 30 + 28 + 13 / 60,
//   2 * 30 + 18 + 20 / 60, // 室，娵訾
//   3 * 30 + 4 + 1 / 60, // 壁，降婁
//   3 * 30 + 17 + 17 / 60, // 奎
//   3 * 30 + 28 + 46 / 60,
//   4 * 30 + 11 + 46 / 60, // 胃，大梁
//   4 * 30 + 24 + 47 / 60,
//   5 * 30 + 4 + 3 / 60, // 畢，實沈
//   5 * 30 + 17 + 14 / 60, // 參
//   5 * 30 + 18 + 35 / 60, // 觜
//   6 * 30 + 0 + 8 / 60, // 井，鶉首
//   7 * 30 + 0 + 33 / 60, // 鬼，鶉火
//   7 * 30 + 6 + 3 / 60,
//   7 * 30 + 22 + 9 / 60,
//   8 * 30 + 0 + 33 / 60, // 張，鶉尾
//   8 * 30 + 18 + 36 / 60,
//   9 * 30 + 5 + 36 / 60, // 軫，壽星
//   9 * 30 + 18 + 39 / 60, // 角
//   9 * 30 + 29 + 14 / 60,
//   10 * 30 + 9 + 54 / 60, // 氐，大火
//   10 * 30 + 27 + 48 / 60,
//   11 * 30 + 2 + 34 / 60, // 心，析木
//   11 * 30 + 10 + 17 / 60,
//   11 * 30 + 25 + 43 / 60 // 箕
// ]
// 甲子元曆黃道宿鈐。五禮通考卷195，p9167。江永：此二十八宿度數，與崇禎戊辰所測者間有損益。
// const EclpDegJiaziAccum = [ // 即1684年前冬至在箕3.1666666667
//   0 * 30 + 5 + 50 / 60, // 斗
//   0 * 30 + 29 + 37 / 60, // _________五礼通考：27分
//   1 * 30 + 7 + 23 / 60,
//   1 * 30 + 19 + 1 / 60,
//   1 * 30 + 29 + 0 / 60,
//   2 * 30 + 19 + 7 / 60,
//   3 * 30 + 4 + 48 / 60,
//   3 * 30 + 17 + 54 / 60, // 奎
//   3 * 30 + 29 + 33 / 60,
//   4 * 30 + 12 + 33 / 60,
//   4 * 30 + 24 + 48 / 60,
//   5 * 30 + 4 + 3 / 60,
//   5 * 30 + 18 + 1 / 60, // 參
//   5 * 30 + 19 + 22 / 60, // 觜。參觜顛倒
//   6 * 30 + 0 + 55 / 60, // 井
//   7 * 30 + 1 + 20 / 60,
//   7 * 30 + 5 + 56 / 60, //————————————五礼通考：52分
//   7 * 30 + 22 + 56 / 60,
//   8 * 30 + 1 + 19 / 60, // 張
//   8 * 30 + 19 + 23 / 60,
//   9 * 30 + 6 + 23 / 60,
//   9 * 30 + 19 + 26 / 60, // 角
//   10 * 30 + 0 + 3 / 60,
//   10 * 30 + 10 + 41 / 60,
//   10 * 30 + 28 + 31 / 60,
//   11 * 30 + 3 + 21 / 60,
//   11 * 30 + 10 + 54 / 60,
//   11 * 30 + 26 + 50 / 60 // 箕
// ]
// 甲子元曆甲子年赤道鈐：
// const EquaDegJiaziAccum1684 = [0 * 30 + 6 + 33 / 60, // 斗
// 1 * 30 + 0 + 46 / 60,
// 1 * 30 + 7 + 41 / 60,
// 1 * 30 + 18 + 44 / 60,
// 1 * 30 + 27 + 26 / 60,
// 2 * 30 + 12 + 17 / 60,
// 2 * 30 + 29 + 18 / 60,
// 3 * 30 + 10 + 10 / 60, // 奎
// 3 * 30 + 24 + 18 / 60,
// 4 * 30 + 6 + 17 / 60,
// 4 * 30 + 21 + 20 / 60,
// 5 * 30 + 2 + 34 / 60,
// 5 * 30 + 19 + 2 / 60,
// 5 * 30 + 19 + 31 / 60,
// 6 * 30 + 1, // 井
// 7 * 30 + 3 + 24 / 60,
// 7 * 30 + 5 + 15 / 60,
// 7 * 30 + 18 + 3 / 60,
// 7 * 30 + 24 + 3 / 60,
// 8 * 30 + 11 + 9 / 60,
// 8 * 30 + 29 + 58 / 60,
// 9 * 30 + 17 + 10 / 60, // 角
// 9 * 30 + 29,
// 10 * 30 + 8 + 24 / 60,
// 10 * 30 + 24 + 57 / 60,
// 11 * 30 + 0 + 29 / 60,
// 11 * 30 + 6 + 42 / 60,
// 11 * 30 + 26 + 21 / 60]
