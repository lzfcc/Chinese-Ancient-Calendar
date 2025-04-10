import Para from "../parameter/calendars.mjs";
import { AutoSolar, AutoSidereal } from "../parameter/auto_consts.mjs";
import { Interpolate1, Interpolate2, Interpolate3 } from "../equation/sn.mjs";
import { AutoDifAccum } from "./acrv.mjs";
import { Hushigeyuan } from "../equation/geometry.mjs";
import { fmod } from "../parameter/functions.mjs";

const termNum = (Sd, Name) => {
  const { Solar } = Para[Name];
  Sd %= Solar;
  const HalfTermLeng = Solar / 24;
  const TermNum = Math.trunc(Sd / HalfTermLeng); // 每日所在氣名
  const TermDif = Sd - TermNum * HalfTermLeng;
  return { TermNum, TermDif };
};
const termNumAcr = (Sd, Name) => {
  const { Solar, AcrTermList } = Para[Name];
  Sd %= Solar;
  let TermNum = 0;
  for (let j = 0; j <= 23; j++) {
    if (Sd >= AcrTermList[j] && Sd < AcrTermList[j + 1]) {
      TermNum = j;
      break;
    }
  }
  return TermNum;
};
export const latTable1 = (Sd, Name) => {
  const { Solar, SunLatList } = Para[Name];
  const { TermNum, TermDif } = termNum(Sd, Name);
  const HalfTermLeng = Solar / 24;
  return (
    Solar / 4 -
    (SunLatList[TermNum] +
      (TermDif / HalfTermLeng) *
        (SunLatList[TermNum + 1] - SunLatList[TermNum]))
  );
};
export const riseTable1 = (Sd, Name) => {
  const { NightList, Solar } = Para[Name];
  const HalfTermLeng = Solar / 24;
  let DawnRange = 0;
  if (Name !== "Daye") DawnRange = 2.5;
  const { TermNum, TermDif } = termNum(Sd, Name);
  return (
    DawnRange +
    NightList[TermNum] +
    (TermDif / HalfTermLeng) * (NightList[TermNum + 1] - NightList[TermNum])
  ); // 日出时刻=夜半漏+2.5刻
};
export const dialTable1 = (Sd, Name) => {
  const { DialList, Solar } = Para[Name];
  const { TermNum, TermDif } = termNum(Sd, Name);
  const HalfTermLeng = Solar / 24;
  return (
    DialList[TermNum] +
    (TermDif / HalfTermLeng) * (DialList[TermNum + 1] - DialList[TermNum])
  );
};
export const latRiseTable2 = (X, Name) => {
  // X：求Rise必須是SdNoon，求Lat隨意。麟德：實行度，大明：距冬至時長
  const { Type, Denom, NightList, Solar, TermRangeA, TermRangeS, SunLatList } =
    Para[Name];
  let DawnRange = 2.5;
  if (Name === "Huangji") DawnRange = 2.365;
  else if (["Linde", "LindeB", "Daming3"].includes(Name)) DawnRange = 0;
  let Lat = 0;
  let Lat1 = 0;
  let Rise = 0;
  const { TermNum, TermDif } = termNum(X, Name);
  const HalfTermLeng = Solar / 24;
  let TermRange = 0;
  if (Type === 6) {
    // 麟德
    if (X < 6 * HalfTermLeng || X >= 18 * HalfTermLeng)
      TermRange = TermRangeA; // 秋分後
    else TermRange = TermRangeS; // 春分後
  } else TermRange = HalfTermLeng;
  const TermDifP = 1 + TermDif / TermRange;
  if (Type === 10) {
    // 重修大明的日出分是三次內插
    Rise =
      100 *
      (Interpolate1(TermDifP, [
        NightList[TermNum],
        NightList[TermNum + 1],
        NightList[TermNum + 2],
        NightList[TermNum + 3]
      ]) /
        Denom);
    Lat = -(Rise - 25) / (10896 / 52300);
  } else {
    // 麟德
    Rise =
      DawnRange +
      Interpolate1(TermDifP, [
        NightList[TermNum],
        NightList[TermNum + 1],
        NightList[TermNum + 2]
      ]);
    Lat1 = Interpolate1(TermDifP, [
      SunLatList[TermNum],
      SunLatList[TermNum + 1],
      SunLatList[TermNum + 2]
    ]);
    Lat = 91.31 - Lat1; // 赤緯
  }
  return { Lat, Rise };
};
export const latRiseTable3 = (Sd, Name) => {
  // Sd：求Rise必須是SdNoon，求Lat隨意。大衍：距冬至時長
  const { NightList, AcrTermList, SunLatList } = Para[Name];
  const DawnRange = 2.5;
  let Lat = 0;
  let Lat1 = 0;
  let Rise = 0;
  const TermNumAcr = termNumAcr(Sd, Name);
  Rise =
    DawnRange +
    Interpolate3(Sd, [
      [AcrTermList[TermNumAcr], NightList[TermNumAcr]],
      [AcrTermList[TermNumAcr + 1], NightList[TermNumAcr + 1]],
      [AcrTermList[TermNumAcr + 2], NightList[TermNumAcr + 2]]
    ]);
  Lat1 = Interpolate3(Sd, [
    [AcrTermList[TermNumAcr], SunLatList[TermNumAcr]],
    [AcrTermList[TermNumAcr + 1], SunLatList[TermNumAcr + 1]],
    [AcrTermList[TermNumAcr + 2], SunLatList[TermNumAcr + 2]]
  ]);
  Lat = 91.31 - Lat1;
  return { Lat, Lat1, Rise };
};
/**
 * Type===6// 紀志剛《麟德曆晷影計算方法研究》，《自然科學史研究》1994(4) 頁323：第15日應比12.28稍長。我現在算出來沒問題。
 * @param {*} GongNoon 正午實行度
 * @param {*} Name
 * @returns
 */
export const dialTable2 = (GongNoon, Name) => {
  /// //////預處理晷長///////////
  // let DialChangeList = [] // 陟降率
  // DialChangeList[0] = 0
  // for (let i = 1; i <= 24; i++) {
  //     DialChangeList[i] = parseFloat((DialList[i + 1] - DialList[i]).toPrecision(12))
  // }
  // DialChangeList[25] = DialChangeList[1]
  // delta1 = ((DialChangeList[TermNum] + DialChangeList[TermNum + 1]) / 2) / TermRange // 泛末率
  // delta2 = (DialChangeList[TermNum] - DialChangeList[TermNum + 1]) / TermRange // 總差
  // if (TermNum % 12 === 0) { // 芒種、大雪
  //     delta2 = ((DialChangeList[TermNum - 1] - DialChangeList[TermNum]) / TermRange)
  //     delta1 = ((DialChangeList[TermNum - 1] + DialChangeList[TermNum]) / 2) / TermRange - delta2
  // }
  // const delta3 = delta1 + delta2 // 泛初率
  // const delta4 = (delta2 / TermRange) / 2 // 限差。不/2是別差
  // const Corr = delta3 + delta4 // 定差
  // const TermAcrDial = DialList[TermNum] - (TermAvgDeci[TermNumRaw] - .5) * Corr // 恆氣日中定影
  // Dial = (TermAcrDial + (TermDifInt * delta1 + TermDifInt * delta2 - (TermDifInt ** 2) * delta4)).toFixed(4) // 劉焯二次內插公式
  const { Type, DialList, Solar, TermRangeS, TermRangeA } = Para[Name];
  const { TermNum, TermDif } = termNum(GongNoon, Name);
  const HalfTermLeng = Solar / 24;
  let TermRange = 0;
  if (Type === 6) {
    // 麟德
    if (GongNoon < 6 * HalfTermLeng || GongNoon >= 18 * HalfTermLeng)
      TermRange = TermRangeA; // 秋分後
    else TermRange = TermRangeS; // 春分後
  } else TermRange = HalfTermLeng;
  const TermDifP = 1 + TermDif / TermRange;
  return Interpolate1(TermDifP, [
    DialList[TermNum],
    DialList[TermNum + 1],
    DialList[TermNum + 2]
  ]);
};
export const dialTable3 = (Lat1) => {
  // 7、應天、乾元。本來寫了個去極度差分表，太麻煩，還不如直接用招差
  const f = 34.475; // 大衍地理緯度
  let Dial = 0;
  const Z = Lat1 - (91.3 - f); // 天頂距
  // 下爲大衍晷影差分表
  if (Z <= 27) {
    Dial = Interpolate2(Z - 1, 1379, [1380, 2, 1]);
  } else if (Z <= 42) {
    Dial = Interpolate2(Z - 28, 42267, [1788, 32, 2]);
  } else if (Z <= 46) {
    Dial = Interpolate2(Z - 43, 73361, [2490, 74, 6]);
  } else if (Z <= 50) {
    Dial = Interpolate2(Z - 47, 83581, [3212, -118, 272]);
  } else if (Z <= 57) {
    Dial = Interpolate2(Z - 51, 96539, [3562, 165, 7]);
  } else if (Z <= 61) {
    Dial = Interpolate2(Z - 58, 125195, [4900, 250, 19]);
  } else if (Z <= 67) {
    Dial = Interpolate2(Z - 60, 146371, [6155, 481, 33]);
  } else if (Z <= 72) {
    Dial = Interpolate2(Z - 68, 191179, [9545, 688, 36]);
  } else {
    Dial = Interpolate2(Z - 73, 246147, [13354, 1098, 440, 620, 180]);
  }
  return Dial / 10000;
};
// 《中》頁513:平交加上不均勻改正後是正交，求得正交黃道度，再求月道度。

// console.log(Equa2EclpFormula(91, 'Chongxuan'))
/**
 *
 * @param {*} LonRaw 儀天：距冬至時長，其他：實行度
 * @param {*} Name
 * @returns 赤緯
 */
export const latFormula = (XRaw, Name) => {
  // 《中國古代曆法》頁128、古曆新探p172。漏刻頁135。
  const Solar = AutoSidereal(Name);
  const SolarQuar = Solar / 4;
  const SolarHalf = Solar / 2;
  const LonHalf = XRaw % SolarHalf;
  let Lat = 0;
  let g = 0;
  if (Name === "Yitian") {
    if (XRaw >= 88.8811 && XRaw < SolarHalf + 93.7411) {
      // 冬至後次象// 946785.5 / 10100=93.7411
      SolarHalf;
      const Lon = Math.abs(SolarHalf - XRaw);
      g =
        (1261875 / 20126347) * Lon ** 2 -
        (6250000 / (20126347 * 522009)) * Lon ** 4;
      Lat = 23.9296 - (50 / 1052) * g;
    } else {
      // 冬至後初象
      const Lon = Math.min(XRaw, Solar - XRaw); // 到0的距離
      g =
        (167750 / 2229099) * Lon ** 2 - (125000 / (2229099 * 39107)) * Lon ** 4;
      Lat = -23.9081 + (50 / 1062) * g;
    }
  } else if (Name === "Jiyuan") {
    const Lon = SolarQuar - Math.abs(LonHalf - SolarQuar);
    if (XRaw >= SolarQuar && XRaw < 3 * SolarQuar) {
      // 夏至前後
      Lat =
        23.9 -
        (491.3109 ** 2 * Lon ** 2 - 982.6218 * Lon ** 3 + Lon ** 4) /
          160000 /
          348.856;
    } else {
      // 冬至前後
      Lat =
        -23.9 +
        (608.3109 ** 2 * Lon ** 2 - 1216.6218 * Lon ** 3 + Lon ** 4) /
          267289 /
          348.856;
    }
  } else {
    const Lon = SolarQuar - Math.abs(LonHalf - SolarQuar);
    if (
      [
        "Chongxuan",
        "Qintian",
        "Chongtian",
        "Mingtian",
        "Guantian",
        "Fengyuan",
        "Zhantian"
      ].includes(Name)
    ) {
      let a = 1221360 / 346290367;
      let b = 784000 / (346290367 * 29109);
      let e1 = 24.0041;
      let e2 = 23.9959; //  'Guantian', 'Fengyuan', 'Zhantian'
      if (["Chongxuan", "Qintian"].includes(Name))
        (a = 184 / 50025),
          (b = 16 / (50025 * 3335)),
          (e1 = 23.9141),
          (e2 = 23.8859);
      if (Name === "Chongtian")
        (a = 460720 / 130620943), (b = 80000 / (130620943 * 7873));
      else if (Name === "Mingtian")
        (a = 84800 / 24039561), (b = 20000 / (24039561 * 10689));
      g = a * Lon ** 2 - b * Lon ** 4;
      if (XRaw >= SolarQuar && XRaw < 3 * SolarQuar) Lat = e1 - g;
      else Lat = -e2 + g;
    }
  }
  return +Lat.toFixed(6);
};
// console.log(latFormula(200, 'Yitian').Lat)
// console.log(1e-6)
export const riseFormula = (LatNoon, SdNoon, Name) => {
  const Solar = AutoSidereal(Name);
  const SolarHalf = Solar / 2;
  let Night = 0;
  if (Name === "Yitian") {
    if (SdNoon < 88.8811) Night = 22.53 - LatNoon / 4.76;
    else if (SdNoon < SolarHalf) Night = 22.49 - LatNoon / 4.8;
    else if (SdNoon < SolarHalf + 93.7411) Night = 22.51 - LatNoon / 4.8;
    else Night = 22.47 - LatNoon / 4.76;
  } else Night = 22.5 - LatNoon / 4.8;
  return Night + 2.5;
};
export const dialFormula = (DegRaw, Name, SolsDeci) => {
  // 陈美东《崇玄仪天崇天三历晷长计算法及三次差内插法的应用》有儀天曆術文補
  const Solar = AutoSolar(Name);
  const SolarQuar = Solar / 4;
  const SolarHalf = Solar / 2;
  DegRaw %= Solar;
  let xian = 0;
  let Dial = 0;
  const DialMor = 0;
  if (["Chongxuan", "Qintian", "Yitian"].includes(Name)) xian = 59;
  else if (Name === "Chongtian") xian = 62;
  else if (["Mingtian", "Guantian", "Fengyuan", "Zhantian"].includes(Name))
    xian = 45.62;
  else if (Name === "Jiyuan") xian = 62.2;
  const Deg1 = Math.min(DegRaw, Solar - DegRaw); // 與0的距離
  const Deg2 = Math.abs(SolarHalf - DegRaw); // 與180的距離
  if (["Chongxuan", "Qintian", "Yitian", "Chongtian"].includes(Name)) {
    let a1 = 2197.14;
    let b1 = 15.05;
    let a2 = 4881.67;
    let b2 = 4.01; // 崇天
    if (Name === "Chongxuan" || Name === "Qintian")
      (a1 = 2195), (b1 = 15), (a2 = 4880), (b2 = 4);
    else if (Name === "Yitian") (a1 = 2130), (b1 = 14), (a2 = 4812), (b2 = 3.5);
    if (DegRaw < xian || DegRaw >= Solar - xian) {
      Dial = 12.715 - 1e-6 * (a1 - b1 * Deg1) * Deg1 ** 2;
    } else Dial = 1.478 + 1e-7 * (a2 - b2 * Deg2) * Deg2 ** 2;
    // if (['Chongxuan', 'Qintian'].includes(Name)) { // 大衍、崇玄求次日晷長。爲避免麻煩，統一用崇天的方法。儀天：算二至具體時刻到當日夜半，再加減半日晷長。《古曆新探》p138:當日時刻到二至(.N)的時長，崇玄.5-.N，儀天0，崇天.5。
    //     const DegRawMor = DegRaw + 1
    //     let DegMor = parseFloat(((DegRaw + 1) % SolarHalf).toPrecision(14))
    //     if ((DegRawMor > xian && DegRawMor < SolarHalf) || (DegRawMor >= Solar - xian)) DegMor = parseFloat((SolarHalf - DegMor).toPrecision(14))
    //     if (DegRawMor < xian || (DegRawMor >= Solar - xian)) {
    //         DialMor = 12.715 - 1e-6 * (a1 - b1 * DegMor) * DegMor ** 2
    //     } else DialMor = 1.478 + 1e-7 * (a2 - b2 * DegMor) * DegMor ** 2
    //     Dial += (.5 - SolsDeci) * (DialMor - Dial)
    // }
  } else if (["Mingtian", "Guantian", "Fengyuan", "Zhantian"].includes(Name)) {
    if (DegRaw <= xian || DegRaw >= Solar - xian) {
      Dial =
        12.85 -
        1e-6 *
          (1937.5 * Deg1 ** 2 -
            Deg1 ** 3 -
            (200 / 827) * Deg1 ** 4 +
            (1 / 827) * Deg1 ** 5);
    } else if (DegRaw > SolarQuar && DegRaw < 3 * SolarQuar) {
      Dial =
        1.57 +
        1e-6 *
          (545.25 * Deg2 ** 2 -
            (3827 / 2481) * Deg2 ** 3 +
            (5 / 827) * Deg2 ** 4);
    } else {
      Dial =
        1.57 +
        1e-6 *
          (510.09274 * Deg2 ** 2 -
            1.213548 * Deg2 ** 3 +
            0.01034059 * Deg2 ** 4 -
            0.0000403063 * Deg2 ** 5);
    }
  } else if (Name === "Jiyuan") {
    if (DegRaw <= xian || DegRaw >= Solar - xian) {
      Dial =
        12.83 -
        (200 * Deg1 ** 2) / (100617 + 100 * Deg1 + (400 / 29) * Deg1 ** 2);
    } else if (DegRaw > SolarQuar && DegRaw < 3 * SolarQuar) {
      Dial = 1.56 + (4 * Deg2 ** 2) / (7923 + 9 * Deg2);
    } else {
      Dial =
        1.56 +
        (7700 * Deg2 ** 2) / (13584271.78 + 44718 * Deg2 - 100 * Deg2 ** 2);
    }
  }
  return Dial;
};
// console.log(dialFormula(307, 'Chongxuan', .3))

/**
 * 藤豔輝<v>紀元曆日食算法及精度分析</v>距離冬至 31.816049 日，紀元日出 2126.2566/7290 = 29.1667572，我之前是直接用黃經，是 29.227518，差了 1 天多，改用距冬至日數，加上日躔，29.1664，密合。
 * 陈美东《中国古代昼夜漏刻长度的计算法》「该文中所示二十四节气(平气)太阳黄经的算式，在本文中适用东汉四分历、景初历、元嘉历、大明历、皇极历、大业历、戊寅历、应天历、乾元历和仪天历等十种历法。而该文中所示二十四节气(定气)太阳黄经的算式，则适用于本文中的麟德历、大衍历、宣明历、崇玄历、崇天历、明天历、观天历和纪元历等八种历法
 * 陈美東《崇玄儀天崇天三曆晷長計算法及三次差內插法的應用》。1、距二至的整數日，2、算上二至中前後分的修正值。我現在直接用正午到二至的距離。之所以那麼麻煩，應該是因爲整數好算一些，實在迷惑。冬至到夏至，盈縮改正爲負，入盈曆，實行日小於平行日。因此自變量不應該是黃經，而是達到實行度所需日數！
魏晉的黃道去極，是根據節氣來的，日書就不調用了。崇玄赤轉赤緯，「昏後夜半日數」，晷長：「日中入二至加時以來日數」。紀元「午中日行積度」
崇天的漏刻、赤緯跟《中國古代晝夜漏刻長度的計算法》一致
 * Lon2LatTable1 自然都是平行
 * Lon2LatTable2。Type === 7 || ['Yingtian', 'Qianyuan']會在子函數用定氣算，所以不加改正
 * Lon2LatFormula。紀元的曲線和現代公式擬合得很好，幾乎重合。因此自變量是黃道實行度。唯獨儀天是距二至的時間，不能加改正
 * Hushigeyuan 實行
 * dialFormula 都是實行度，儀天也是
 * 陳美東誤差：四分.7，麟德.13，大衍.06，宣明.45，崇玄.09，儀天.45，崇天明天觀天.23 .20 .21，紀元.11，大明.12，授時.11。我testLon2Lat：後漢四分：0.7918, 麟德：0.0874, 大衍：0.0448, 宣明：0.3109, 崇玄：0.1009, 應天：0.3115, 乾元：0.3120, 儀天：0.3088, 崇天：0.0536, 明天：0.0539, 觀天：0.0541, 紀元：0.0089, 重修大明：0.0058, 授時：0.0148,
 * @param {*} Sd 距冬至時間
 * @param {*} Name 曆法名
 * @param {*} isBare true：不加太陽改正
 * @returns 
 */
export const autoLat = (Sd, Name, isBare) => {
  const { Type, SolarRaw, Solar } = Para[Name];
  let Corr = 0;
  let Lat = 0;
  if (isBare !== true) {
    if (
      [
        "Linde",
        "LindeB",
        "Yisi",
        "Shenlong",
        "Chongxuan",
        "Qintian",
        "Chongtian",
        "Mingtian",
        "Guantian",
        "Fengyuan",
        "Zhantian"
      ].includes(Name) ||
      Type >= 9
    ) {
      Corr = AutoDifAccum(0, Sd, Name).SunDifAccum;
    }
  }
  const X = fmod(Sd + Corr, Solar || SolarRaw);
  if (Type <= 4 || Name === "Huangji") Lat = latTable1(X, "Easthan");
  else if (["Linde", "Yisi", "LindeB", "Shenlong"].includes(Name)) {
    Lat = latRiseTable2(X, "Linde").Lat;
  } else if (Type === 6) {
    Lat = latRiseTable2(X, Name).Lat;
  } else if (Type === 10) {
    Lat = latRiseTable2(X, "Daming3").Lat;
  } else if (["Dayan", "Zhide", "Wuji", "Tsrengyuan"].includes(Name)) {
    Lat = latRiseTable3(X, "Dayan").Lat;
  } else if (["Xuanming", "Yingtian", "Qianyuan"].includes(Name)) {
    Lat = latRiseTable3(X, Name).Lat;
  } else if (Type === 8 || Name === "Qintian") {
    // 北宋latFormula用實行
    Lat = latFormula(X, Name);
  } else if (Type === 9) {
    Lat = latFormula(X, "Jiyuan");
  } else if (Type === 11) {
    Lat = Hushigeyuan(X, Name).Lat;
  }
  return Lat;
};

export const autoRise = (Sd, SolsDeci, Name) => {
  const { Type } = Para[Name];
  let { Solar, SolarRaw } = Para[Name];
  const S = Solar || SolarRaw;
  let Corr = 0;
  let Plus = 0;
  let Rise = 0;
  if (Type <= 4)
    Plus = -1.5; // 非常詭異
  else if (Type === 11) Plus = -0.5; // 授時「置所求日晨前夜半黃道積度」
  let SdNoon = (Math.trunc(Sd + SolsDeci) - SolsDeci + S + 0.5 + Plus) % S; // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
  if (
    [
      "Linde",
      "Yisi",
      "LindeB",
      "Shenlong",
      "Chongxuan",
      "Qintian",
      "Chongtian",
      "Mingtian",
      "Guantian",
      "Fengyuan",
      "Zhantian"
    ].includes(Name) ||
    Type >= 9
  ) {
    Corr = AutoDifAccum(0, SdNoon, Name).SunDifAccum;
  }
  const X = fmod(SdNoon + Corr, S);
  if (["Daming", "Yukuo"].includes(Name)) {
    Rise = riseTable1(X, "Daming");
  } else if (["Daye", "Zhangmengbin", "Liuxiaosun"].includes(Name)) {
    Rise = riseTable1(X, "Daye");
  } else if (Type <= 3) {
    Rise = riseTable1(X, "Easthan");
  } else if (Type === 4) {
    Rise = riseTable1(X, Name);
  } else if (["Linde", "Yisi", "LindeB", "Shenlong"].includes(Name)) {
    Rise = latRiseTable2(X, "Linde").Rise;
  } else if (Type === 6) {
    Rise = latRiseTable2(X, Name).Rise;
  } else if (Type === 10) {
    Rise = latRiseTable2(X, "Daming3").Rise;
  } else if (["Dayan", "Zhide", "Wuji", "Tsrengyuan"].includes(Name)) {
    Rise = latRiseTable3(X, "Dayan").Rise;
  } else if (["Xuanming", "Yingtian", "Qianyuan"].includes(Name)) {
    Rise = latRiseTable3(X, Name).Rise;
  } else if (Type === 8 || Name === "Qintian") {
    // 北宋latFormula用實行
    Rise = riseFormula(latFormula(X, Name), SdNoon, Name);
  } else if (Type === 9) {
    Rise = riseFormula(latFormula(X, "Jiyuan"), SdNoon, "Jiyuan");
  } else if (Type === 11) {
    Rise = Hushigeyuan(X, Name).Rise;
  }
  return Rise;
};
export const autoDial = (Sd, SolsDeci, Name) => {
  const { Type } = Para[Name];
  let { Solar, SolarRaw } = Para[Name];
  const S = Solar || SolarRaw;
  let Corr = 0;
  let Plus = 0;
  let Dial = 0;
  if (Type <= 4)
    Plus = -1.5; // 非常詭異
  else if (Type === 11) Plus = -0.5; // 授時「置所求日晨前夜半黃道積度」
  let SdNoon = (Math.trunc(Sd + SolsDeci) - SolsDeci + S + 0.5 + Plus) % S; // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
  if (
    [
      "Linde",
      "LindeB",
      "Yisi",
      "Shenlong",
      "Chongxuan",
      "Qintian",
      "Yitian",
      "Chongtian",
      "Mingtian",
      "Guantian",
      "Fengyuan",
      "Zhantian"
    ].includes(Name) ||
    Type >= 9
  ) {
    Corr = AutoDifAccum(0, SdNoon, Name).SunDifAccum;
  }
  const X = fmod(SdNoon - Corr, S); // 這要反著來
  if (["Daming", "Yukuo"].includes(Name)) {
    Dial = dialTable1(X, "Daming");
  } else if (["Daye", "Zhangmengbin", "Liuxiaosun"].includes(Name)) {
    Dial = dialTable1(X, "Daye");
  } else if (Type <= 3) {
    Dial = dialTable1(X, "Easthan");
  } else if (Type === 4) {
    Dial = dialTable1(X, Name);
  } else if (["Linde", "LindeB", "Yisi", "Shenlong"].includes(Name)) {
    Dial = dialTable2(X, "Linde");
  } else if (Type === 6) {
    Dial = dialTable2(X, Name);
  } else if (["Dayan", "Zhide", "Wuji", "Tsrengyuan"].includes(Name)) {
    Dial = dialTable3(latRiseTable3(X, "Dayan").Lat1);
  } else if (
    ["Xuanming", "Yingtian", "Qianyuan"].includes(Name) &&
    Name !== "Qintian"
  ) {
    Dial = dialTable3(latRiseTable3(X, Name).Lat1);
  } else if ((Type >= 8 && Type <= 10) || Name === "Qintian") {
    if (Type === 8 || Name === "Qintian") {
      // 北宋Lon2LatFormula用實行
      Dial = dialFormula(X, Name, SolsDeci);
    } else if (Type >= 9) {
      Dial = dialFormula(X, "Jiyuan");
    }
  }
  return Dial;
};
// console.log(autoDial(33.2614, 0.7386, "Huiyuan"))
