import Para from "../parameter/calendars.mjs";
import { Hushigeyuan } from "../equation/geometry.mjs";
import { AutoTcorr, AutoDifAccum, anojour, ShoushiXianV } from "./acrv.mjs";
import {
  NameList,
  MansNameList,
  MansNameListQing,
  NameJiudaoList
} from "../parameter/constants.mjs";
import { AutoEclipse } from "./eclipse.mjs";
import { deg2Mans, mans2Deg, mans, mansQing, degAccumList } from "./mans.mjs";
import { AutoSolar } from "../parameter/auto_consts.mjs";
import {
  corrEllipse,
  corrEllipseB1,
  corrEllipseC,
  corrEllipseD1,
  corrEllipseD2,
  corrRingA,
  corrRingC
} from "../astronomy/sun_moon_qing.mjs";
import {
  GongFlat2High,
  GongHigh2Flat,
  HighLon2FlatLat,
  Lon2Gong,
  LonFlat2High,
  LonHigh2Flat,
  sunRise
} from "./pos_convert.mjs";
import { mansModern } from "../modern/mans.mjs";
import {
  Lon2DialWest,
  eclp2Cec,
  equa2Cec,
  ceclp2Equa,
  equa2Eclp,
  testEclpEclpDif,
  whEqObliq
} from "./pos_convert_modern.mjs";
import { equaEclp } from "./equa_eclp.mjs";
import {
  chooseNode,
  eclp2WhiteDif,
  equa2WhiteDif,
  moonEclpLat,
  moonJiudao,
  moonShoushi
} from "./moon_lon_lat.mjs";
import { autoLat, autoRise, autoDial } from "./lat_rise_dial.mjs";
import { lat2NS } from "../parameter/functions.mjs";
const Gong2Lon = (Gong) => (Gong + 270) % 360;
// 月亮我2020年4個月的數據擬合 -.9942  + .723*cosd(x* .2243) +  6.964 *sind(x* .2243)，但是幅度跟古曆比起來太大了，就調小了一點 極大4.4156，極小-5.6616
export const bindTcorr = (AnoAccum, Sd, Name) => {
  // Name預留給誤差分析程序，否則不用
  Sd = +Sd;
  AnoAccum = +AnoAccum;
  if (Sd > 365.2425 || Sd < 0) throw new Error("請輸入一回歸年內的日數！");
  let List1 = [
    "Qianxiang",
    "Jingchu",
    "Yuanjia",
    "Daming",
    "Tsrengguang",
    "Xinghe",
    "Tianbao",
    "Daye",
    "Wuyin",
    "Huangji",
    "Linde",
    "Wuji",
    "Tsrengyuan",
    "Futian",
    "Qintian",
    "Mingtian",
    "Jiyuan",
    "Tongyuan",
    "Qiandao",
    "Chunxi",
    "Daming3",
    "Huiyuan",
    "Tongtian",
    "Kaixi",
    "Chunyou",
    "Huitian",
    "Chengtian",
    "Shoushi"
  ];
  let List2 = [
    "Dayan",
    "Xuanming",
    "Chongxuan",
    "Yingtian",
    "Qianyuan",
    "Yitian",
    "Chongtian",
    "Fengyuan",
    "Guantian",
    "Zhantian"
  ];
  List1 = Name ? [Name] : List1;
  List2 = Name ? [Name] : List2;
  let Print1 = [];
  let Print2 = [];
  Print1 = Print1.concat(
    List1.map((Name) => {
      const { Anoma, cS, cM } = Para[Name];
      const Solar = AutoSolar(Name);
      const p = 360 / Solar;
      const EllipseSun = cS ? corrEllipse(Sd * p, cS) / p : undefined;
      const EllipseMoon = cM
        ? corrEllipse(((AnoAccum / Anoma) * 360 + 180) % 360, cM) / p
        : undefined;
      let AutoDifAccumFunc = {};
      if (Name !== "Qintian")
        AutoDifAccumFunc = AutoDifAccum(AnoAccum, Sd, Name);
      const { SunDifAccum, MoonDifAccum } = AutoDifAccumFunc;
      const { SunTcorr, MoonTcorr, MoonAcrVd, NodeAccumCorrA } = AutoTcorr(
        AnoAccum,
        Sd,
        Name
      );
      const { Anojour } = anojour(AnoAccum, Name);
      let SunTcorrPrint = "-";
      let NodeAccumCorrPrint = "-";
      const SunDifAccumPrint = SunDifAccum ? SunDifAccum.toFixed(5) : "-";
      const SunDifAccumErrPrint =
        EllipseSun !== undefined
          ? Math.trunc(((SunDifAccum - EllipseSun) / EllipseSun) * 10000)
          : "-";
      const MoonDifAccumPrint = (MoonDifAccum || 0).toFixed(5);
      let MoonAcrVdPrint = "-";
      if (Name === "Shoushi") {
        const tmp = ShoushiXianV(AnoAccum);
        MoonAcrVdPrint = `${tmp.toFixed(4)}\n${(tmp / 0.082).toFixed(4)}`;
      } else if (MoonAcrVd) MoonAcrVdPrint = MoonAcrVd.toFixed(4);
      const MoonDifAccumErrPrint =
        EllipseMoon !== undefined
          ? Math.trunc(((MoonDifAccum - EllipseMoon) / EllipseMoon) * 10000)
          : "-";
      if (SunTcorr) SunTcorrPrint = SunTcorr.toFixed(5);
      const AnojourPrint = Anojour.toFixed(4);
      const MoonTcorrPrint = MoonTcorr.toFixed(5);
      if (NodeAccumCorrA) NodeAccumCorrPrint = NodeAccumCorrA.toFixed(4);
      const Tcorr = +MoonTcorrPrint + (+SunTcorrPrint || 0);
      return {
        title: NameList[Name],
        data: [
          cS ? cS.toFixed(4) : "",
          SunDifAccumPrint,
          SunDifAccumErrPrint,
          SunTcorrPrint,
          cM ? cM.toFixed(4) : "",
          MoonDifAccumPrint,
          MoonDifAccumErrPrint,
          MoonTcorrPrint,
          AnojourPrint,
          MoonAcrVdPrint,
          Tcorr.toFixed(4),
          NodeAccumCorrPrint
        ]
      };
    })
  );
  Print2 = Print2.concat(
    List2.map((Name) => {
      const { Anoma, cS, cM } = Para[Name];
      const Solar = AutoSolar(Name);
      const p = 360 / Solar;
      const EllipseSun = cS ? corrEllipse(Sd * p, cS) / p : undefined;
      const EllipseMoon = cM
        ? corrEllipse((AnoAccum / Anoma) * 360, cM) / p
        : undefined;
      const { SunDifAccum, MoonDifAccum } = AutoDifAccum(AnoAccum, Sd, Name);
      const { SunTcorr, MoonTcorr, NodeAccumCorrA } = AutoTcorr(
        AnoAccum,
        Sd,
        Name
      );
      const { Anojour } = anojour(AnoAccum, Name);
      const SunDifAccumPrint = SunDifAccum.toFixed(5);
      const SunDifAccumErrPrint =
        EllipseSun !== undefined
          ? Math.trunc(((SunDifAccum - EllipseSun) / EllipseSun) * 10000)
          : "-";
      const AnojourPrint = Anojour.toFixed(4);
      const MoonDifAccumPrint = MoonDifAccum.toFixed(5);
      const MoonDifAccumErrPrint =
        EllipseMoon !== undefined
          ? Math.trunc(((MoonDifAccum - EllipseMoon) / EllipseMoon) * 10000)
          : "-";
      const SunTcorrPrint = SunTcorr.toFixed(5);
      const MoonTcorrPrint = MoonTcorr.toFixed(5);
      const Tcorr = +MoonTcorrPrint + +SunTcorrPrint;
      return {
        title: NameList[Name],
        data: [
          cS ? cS.toFixed(4) : "",
          SunDifAccumPrint,
          SunDifAccumErrPrint,
          SunTcorrPrint,
          cM ? cM.toFixed(4) : "",
          MoonDifAccumPrint,
          MoonDifAccumErrPrint,
          MoonTcorrPrint,
          AnojourPrint,
          Tcorr.toFixed(4),
          NodeAccumCorrA.toFixed(4)
        ]
      };
    })
  );
  return { Print1, Print2 };
};
// console.log(bindTcorr(1, 1))

export const bindCorrEllipse = (Orb, cRaw) => {
  const f = (x) => x.toFixed(10);
  Orb = +Orb;
  cRaw = +cRaw;
  const cA = cRaw || 0.0169;
  const cB = cRaw || 0.0179208;
  if (cA > 0.02) Orb = (Orb + 180) % 360; // 各個小函數>.02都會+180，此處再加，反轉回來。
  const AA = corrEllipse(Orb, cA);
  const B = corrEllipseD1(Orb, cA); // 卡西尼
  const C = corrEllipseB1(Orb, cA); // 借積求積
  const D = corrEllipseD2(Orb, cA); // 兩三角形
  const E = corrEllipseC(Orb, cA); // 借角求角
  const AB = corrEllipse(Orb, cB);
  const F = corrRingA(Orb, cB).Corr; // 對分圓
  const G = corrRingC(Orb, cB).Corr; // 本輪均輪
  const B1 = ((B - AA) / AA) * 10000; // 誤差‱
  const C1 = ((C - AA) / AA) * 10000;
  const D1 = ((D - AA) / AA) * 10000;
  const E1 = ((E - AA) / AA) * 10000;
  const F1 = ((F - AB) / AB) * 10000;
  const G1 = ((G - AB) / AB) * 10000;
  const Print = [
    {
      title: "卡西尼",
      data: [B, f(AA), f(B1)]
    },
    {
      title: "借積求積",
      data: [C, "", f(C1)]
    },
    {
      title: "兩三角形",
      data: [D, "", f(D1)]
    },
    {
      title: "借角求角",
      data: [E, "", f(E1)]
    },
    {
      title: "對分圓",
      data: [F, cRaw ? "" : f(AB), f(F1)]
    },
    {
      title: "本輪均輪",
      data: [G, "", f(G1)]
    }
  ];
  return Print;
};
export const bindEquaEclp = (GongRaw) => {
  GongRaw = +GongRaw;
  if (GongRaw >= 365.25 || GongRaw < 0)
    throw new Error("請輸入一週天度內的度數");
  let Range = "";
  let Print = [];
  if (GongRaw < 91.3125) Range += "冬至 → 春分，赤度 > 黃度";
  else if (GongRaw < 182.625) Range += "春分 → 夏至，赤度 < 黃度";
  else if (GongRaw < 273.9375) Range += "夏至 → 秋分，赤度 > 黃度";
  else Range += "秋分 → 冬至，赤度 < 黃度";
  const List1 = [
    "Qianxiang",
    "Huangji",
    "Dayan",
    "Chongxuan",
    "Qintian",
    "Yingtian",
    "Qianyuan",
    "Yitian",
    "Chongtian",
    "Mingtian",
    "Guantian",
    "Jiyuan",
    "Shoushi"
  ];
  const List2 = [
    "Qianxiang",
    "Huangji",
    "Dayan",
    "Chongxuan",
    "Yitian",
    "Chongtian",
    "Mingtian",
    "Guantian",
    "Jiyuan",
    "Shoushi"
  ];
  Print = Print.concat(
    List1.map((Name) => {
      const { Sobliq } = Para[Name];
      const Solar = AutoSolar(Name);
      const p = 360 / Solar;
      const Gong = GongRaw * p;
      const West0A = GongHigh2Flat(Sobliq * p, Gong) / p;
      const West0B = GongFlat2High(Sobliq * p, Gong) / p;
      const West0Lat = HighLon2FlatLat(Sobliq * p, Gong2Lon(Gong)) / p;
      let EclpLonPrint = "-";
      let EclpLonWestPrint = "-";
      let EclpLonErrPrint = "-";
      let EquaLonPrint = "-";
      let EquaLonWestPrint = "-";
      let EquaLonErrPrint = "-";
      let Equa2EclpDifPrint = "-";
      let Eclp2EquaDifPrint = "-";
      let Eclp2EquaLatPrint = "-";
      let Eclp2EquaLatWestPrint = "-";
      let Eclp2EquaLatErrPrint = "-";
      const { Equa2Eclp, Eclp2Equa, Equa2EclpDif, Eclp2EquaDif } = equaEclp(
        GongRaw,
        Name
      );
      let Eclp2EquaLat = 0;
      if (Name === "Shoushi") Eclp2EquaLat = Hushigeyuan(GongRaw).Lat;
      else if (List2.indexOf(Name) >= 0)
        Eclp2EquaLat = autoLat(GongRaw, Name, true);
      if (Equa2Eclp) {
        EclpLonPrint = Equa2Eclp.toFixed(6);
        Equa2EclpDifPrint = Equa2EclpDif.toFixed(6);
        EclpLonWestPrint = West0B.toFixed(6);
        EclpLonErrPrint = Math.trunc(((Equa2Eclp - West0B) / West0B) * 10000);
      }
      if (Eclp2Equa) {
        EquaLonPrint = Eclp2Equa.toFixed(6);
        Eclp2EquaDifPrint = Eclp2EquaDif.toFixed(6);
        EquaLonWestPrint = West0A.toFixed(6);
        EquaLonErrPrint = Math.trunc(((Eclp2Equa - West0A) / West0A) * 10000);
      }
      if (Eclp2EquaLat) {
        Eclp2EquaLatPrint = Eclp2EquaLat.toFixed(6);
        Eclp2EquaLatWestPrint = West0Lat.toFixed(6);
        Eclp2EquaLatErrPrint = +(Eclp2EquaLat - West0Lat).toFixed(4);
      }
      return {
        title: NameList[Name],
        data: [
          EclpLonPrint,
          Equa2EclpDifPrint,
          EclpLonWestPrint,
          EclpLonErrPrint,
          EquaLonPrint,
          Eclp2EquaDifPrint,
          EquaLonWestPrint,
          EquaLonErrPrint,
          Eclp2EquaLatPrint,
          Eclp2EquaLatWestPrint,
          Eclp2EquaLatErrPrint
        ]
      };
    })
  );
  return { Range, Print };
};
// console.log(bindEquaEclp(3))
export const bindStarEclp2Equa = (Sobliq, Lon, Lat) => {
  (Sobliq = +Sobliq), (Lon = +Lon), (Lat = +Lat);
  const { CecLon, CecLat, EquaLon, EquaLat } = eclp2Cec(Sobliq, Lon, Lat);
  const DifMax = testEclpEclpDif(Sobliq, Lat);
  let CecLonDif = CecLon - Lon;
  let EquaLonDif = EquaLon - Lon;
  if (CecLonDif > 180) CecLonDif -= 360;
  if (EquaLonDif > 180) EquaLonDif -= 360;
  const CecLatDif = CecLat - Lat;
  const EquaLatDif = EquaLat - Lat;
  let Print = [];
  let Print2 = [];
  let Print3 = [];
  Print = Print.concat({
    title: "赤道",
    data: [
      EquaLon.toFixed(8),
      EquaLonDif.toFixed(4),
      EquaLat.toFixed(8),
      EquaLatDif.toFixed(4)
    ]
  });
  Print = Print.concat({
    title: "極黃",
    data: [
      CecLon.toFixed(8),
      CecLonDif.toFixed(4),
      CecLat.toFixed(8),
      CecLatDif.toFixed(4)
    ]
  });
  Print = Print.concat({ title: "黃道", data: [Lon, "-", Lat, "-"] });

  const { Lon: EclpLon2, Lat: EclpLat2 } = equa2Eclp(Sobliq, Lon, Lat);
  const { CecLon: CecLon2, CecLat: CecLat2 } = equa2Cec(Sobliq, Lon, Lat);
  let CecLonDif2 = CecLon2 - Lon;
  let EclpLonDif2 = EclpLon2 - Lon;
  if (CecLonDif2 > 180) CecLonDif2 -= 360;
  if (EclpLonDif2 > 180) EclpLonDif2 -= 360;
  const CecLatDif2 = CecLat2 - Lat;
  const EclpLatDif2 = EclpLat2 - Lat;
  Print2 = Print2.concat({ title: "赤道", data: [Lon, "-", Lat, "-"] });
  Print2 = Print2.concat({
    title: "極黃",
    data: [
      CecLon2.toFixed(8),
      CecLonDif2.toFixed(4),
      CecLat2.toFixed(8),
      CecLatDif2.toFixed(4)
    ]
  });
  Print2 = Print2.concat({
    title: "黃道",
    data: [
      EclpLon2.toFixed(8),
      EclpLonDif2.toFixed(4),
      EclpLat2.toFixed(8),
      EclpLatDif2.toFixed(4)
    ]
  });

  const { EquaLon: EquaLon3, EquaLat: EquaLat3 } = ceclp2Equa(Sobliq, Lon, Lat);
  const { Lon: EclpLon3, Lat: EclpLat3 } = equa2Eclp(
    Sobliq,
    EquaLon3,
    EquaLat3
  );
  let EquaLonDif3 = EquaLon3 - Lon;
  let EclpLonDif3 = EclpLon3 - Lon;
  if (EquaLonDif3 > 180) EquaLonDif3 -= 360;
  if (EclpLonDif3 > 180) EclpLonDif3 -= 360;
  const EquaLatDif3 = EquaLat3 - Lat;
  const EclpLatDif3 = EclpLat3 - Lat;
  Print3 = Print3.concat({
    title: "赤道",
    data: [
      EquaLon3.toFixed(8),
      EquaLonDif3.toFixed(4),
      EquaLat3.toFixed(8),
      EquaLatDif3.toFixed(4)
    ]
  });
  Print3 = Print3.concat({
    title: "極黃",
    data: [Lon, "-", Lat, "-"]
  });
  Print3 = Print3.concat({
    title: "黃道",
    data: [
      EclpLon3.toFixed(8),
      EclpLonDif3.toFixed(4),
      EclpLat3.toFixed(8),
      EclpLatDif3.toFixed(4)
    ]
  });
  return { Print, Print2, DifMax, Print3 };
};
// console.log(bindStarEclp2Equa(23.5, 10, 10))

export const bindLon2Lat = (Sd, SolsDeci) => {
  Sd = +Sd;
  SolsDeci = +`.${SolsDeci}`;
  if (Sd >= 365.25 || Sd < 0) throw new Error("請輸入一週天度內的度數");
  let Print = [];
  Print = Print.concat(
    [
      "Easthan",
      "Yuanjia",
      "Daming",
      "Daye",
      "Wuyin",
      "Huangji",
      "Linde",
      "Dayan",
      "Xuanming",
      "Chongxuan",
      "Yingtian",
      "Qianyuan",
      "Yitian",
      "Chongtian",
      "Mingtian",
      "Guantian",
      "Jiyuan",
      "Daming3",
      "Shoushi",
      "Datong"
    ].map((Name) => {
      const { Sobliq, RiseLat, DialLat } = Para[Name];
      const Solar = AutoSolar(Name);
      const p = 360 / Solar;
      const SdMidn = (Math.trunc(Sd + SolsDeci) - SolsDeci + Solar) % Solar; // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
      let GongRaw = Sd;
      let GongMidnRaw = SdMidn;
      if (
        ["Easthan", "Yuanjia", "Daming", "Daye", "Wuyin", "Huangji"].includes(
          Name
        )
      ) {
        GongRaw += corrEllipse(GongRaw * p, 0.0174) / p;
        GongMidnRaw += corrEllipse(GongRaw * p, 0.0174) / p;
      } // 沒有太陽改正的古曆直接用現代公式
      else {
        GongRaw += AutoDifAccum(0, SdMidn, Name).SunDifAccum || 0;
        GongMidnRaw += AutoDifAccum(0, SdMidn, Name).SunDifAccum || 0;
      } // 加上太陽改正
      const Gong = GongRaw * p;
      const Lon = Gong2Lon(Gong);
      let WestA = HighLon2FlatLat(Sobliq * p, Lon); // 球面三角緯度
      const WestB = sunRise(RiseLat || 34.284, WestA);
      const WestC = Lon2DialWest(DialLat || 34.404, WestA);
      WestA /= p;
      let LatPrint = "-";
      let LatErrPrint = "-";
      let SunrisePrint = "-";
      let SunriseErrPrint1 = "-";
      let SunriseErrPrint2 = "-";
      let DialPrint = "-";
      let DialErrPrint1 = "-";
      let DialErrPrint2 = "-";
      const Lat = autoLat(Sd, Name);
      const Rise = autoRise(Sd, SolsDeci, Name);
      const Dial = autoDial(Sd, SolsDeci, Name);
      LatPrint = Lat.toFixed(4);
      LatErrPrint = (Lat - WestA).toFixed(4);
      if (RiseLat) {
        SunrisePrint = Rise.toFixed(4);
        SunriseErrPrint1 = (Rise - WestB.t * 100).toFixed(4);
        SunriseErrPrint2 = (Rise - WestB.t0 * 100).toFixed(4);
      }
      if (DialLat) {
        DialPrint = Dial.toFixed(4);
        DialErrPrint1 = Math.trunc(((Dial - WestC.Dial) / WestC.Dial) * 10000);
        DialErrPrint2 = Math.trunc(
          ((Dial - WestC.Dial1) / WestC.Dial1) * 10000
        );
      }
      return {
        title: NameList[Name],
        data: [
          LatPrint,
          LatErrPrint,
          Sobliq,
          SunrisePrint,
          SunriseErrPrint1,
          SunriseErrPrint2,
          DialPrint,
          DialErrPrint1,
          DialErrPrint2,
          DialLat || RiseLat
        ]
      };
    })
  );
  return Print;
};
// console.log(bindLon2Lat(0, 2)[14].data[3])

// bindDeg2Mans和bindMans2Deg经过DeepSeek修改，避免了使用eval
const bindDeg2Mans = (Deg) => {
  // 所有累加器列表集中到对象中
  const accumulators = {
    Taichu: degAccumList("Taichu", 300),
    Huangji: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Huangji", 500).EclpAccumList
    },
    Linde: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Linde", 665).EclpAccumList
    },
    Dayan: degAccumList("Dayan", 729),
    Yingtian: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Yingtian", 964).EclpAccumList
    },
    Mingtian: degAccumList("Mingtian", 1065),
    Jiyuan: degAccumList("Jiyuan", 1106),
    Daming3: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Daming3", 1180).EclpAccumList
    },
    Shoushi: degAccumList("Shoushi", 1281),
    Jiazi: degAccumList("Jiazi", 1684)
  };

  const Print = [
    "Taichu",
    "Huangji",
    "Linde",
    "Dayan",
    "Yingtian",
    "Mingtian",
    "Jiyuan",
    "Daming3",
    "Shoushi",
    "Jiazi"
  ].map((Name) => {
    // 直接从对象中获取对应的累加器列表
    const { EclpAccumList, EquaAccumList } = accumulators[Name];

    // 处理可能存在的空 EquaAccumList
    const EquaResult = EquaAccumList?.length
      ? deg2Mans(Deg, EquaAccumList).Print
      : ""; // 原逻辑中空数组返回空字符串

    const EclpResult = deg2Mans(Deg, EclpAccumList).Print;

    return {
      title: NameList[Name],
      data: [EquaResult, EclpResult]
    };
  });

  return Print;
};
// console.log(bindDeg2Mans(23.1511, 'Jiazi'))

const bindMans2Deg = (Mans) => {
  // 将变量整合为一个对象
  const accumulators = {
    Taichu: degAccumList("Taichu", 300),
    Huangji: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Huangji", 500).EclpAccumList
    },
    Linde: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Linde", 665).EclpAccumList
    },
    Dayan: degAccumList("Dayan", 729),
    Yingtian: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Yingtian", 964).EclpAccumList
    },
    Mingtian: degAccumList("Mingtian", 1065),
    Jiyuan: degAccumList("Jiyuan", 1106),
    Daming3: {
      EquaAccumList: [],
      EclpAccumList: degAccumList("Daming3", 1180).EclpAccumList
    },
    Shoushi: degAccumList("Shoushi", 1281),
    Jiazi: degAccumList("Jiazi", 1684)
  };

  const Print = [
    "Taichu",
    "Huangji",
    "Linde",
    "Dayan",
    "Yingtian",
    "Mingtian",
    "Jiyuan",
    "Daming3",
    "Shoushi",
    "Jiazi"
  ].map((Name) => {
    const { EclpAccumList, EquaAccumList } = accumulators[Name];
    const Eclp = +mans2Deg(Mans, EclpAccumList).toFixed(3);
    const Equa = +mans2Deg(Mans, EquaAccumList || []).toFixed(3); // 处理空数组
    return {
      title: NameList[Name],
      data: [Equa || "", Eclp]
    };
  });

  return Print;
};
// console.log(bindMans2Deg('氐1'))
const DirList = ["東青龍", "北玄武", "西白虎", "南朱雀"];
const NumList = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘";

export const bindMansAccumList = (Name, Y) => {
  Name = Name.toString();
  Y = parseInt(Y);
  const { Type, Solar } = Para[Name];
  const { EclpAccumList, EquaAccumList } = degAccumList(Name, Y);
  const p = Type === 13 ? 360 / Solar : undefined;
  const EclpList = [];
  const EquaList = [];
  const NameList = Type === 13 ? MansNameListQing : MansNameList;
  let Func = {};
  if (Type === 13) Func = mansQing(Name, Y, 0);
  else Func = mans(Name, Y, 0);
  const { SolsEclpMans, SolsEquaMans } = Func;
  let SolsEclpPrint = "";
  let SolsEquaPrint = "";
  if (Type === 13) {
    SolsEclpPrint = `${SolsEclpMans}°${(+SolsEclpMans.slice(1) / p).toFixed(2)}度`;
    SolsEquaPrint = `${SolsEquaMans}°${(+SolsEquaMans.slice(1) / p).toFixed(2)}度`;
  } else {
    SolsEclpPrint = SolsEclpMans;
    SolsEquaPrint = SolsEquaMans;
  }
  let EclpSortedList = [];
  let EquaSortedList = [];
  if (EclpAccumList.length === undefined) {
    // 清代用字典
    EclpSortedList = Object.entries(EclpAccumList).sort((a, b) => a[1] - b[1]);
    EquaSortedList = Object.entries(EquaAccumList).sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < 27; i++) {
      EclpList[i] = +(EclpSortedList[i + 1][1] - EclpSortedList[i][1]).toFixed(
        3
      );
      EquaList[i] = +(EquaSortedList[i + 1][1] - EquaSortedList[i][1]).toFixed(
        3
      );
    }
    EclpList[27] = +(360 - EclpSortedList[27][1]).toFixed(3);
    EquaList[27] = +(360 - EquaSortedList[27][1]).toFixed(3);
  } else {
    for (let i = 0; i < 28; i++) {
      EclpList[i] = +(EclpAccumList[i + 1] - EclpAccumList[i]).toFixed(3);
      EquaList[i] = +(EquaAccumList[i + 1] - EquaAccumList[i]).toFixed(3);
    }
  }
  const EclpAccumPrint = [];
  const EquaAccumPrint = [];
  if (Type === 13) {
    for (let i = 0; i < 4; i++) {
      EclpAccumPrint.push([]);
      EquaAccumPrint.push([]);
      let EclpSum = 0;
      let EquaSum = 0;
      for (let j = 0; j < 7; j++) {
        const index = i * 7 + j;
        EclpSum += EclpList[index];
        EquaSum += EquaList[index];
      }
      for (let j = 0; j < 7; j++) {
        const index = i * 7 + j;
        EclpAccumPrint[i].push(
          `${EclpSortedList[index][0]} ${EclpSortedList[index][1]}　\n${NumList[index]} ${EclpList[index]}`
        );
        EquaAccumPrint[i].push(
          `${EquaSortedList[index][0]} ${EquaSortedList[index][1]}　\n${NumList[index]} ${EquaList[index]}`
        );
      }
      EclpAccumPrint[i][8] = DirList[i] + EclpSum.toFixed(3);
      EquaAccumPrint[i][8] = DirList[i] + EquaSum.toFixed(3);
    }
    (EclpAccumPrint[4] = ["下爲古度"]), (EquaAccumPrint[4] = ["下爲古度"]);
    for (let i = 5; i < 9; i++) {
      EclpAccumPrint.push([]);
      EquaAccumPrint.push([]);
      let EclpSum = 0;
      let EquaSum = 0;
      for (let j = 0; j < 7; j++) {
        const index = (i - 5) * 7 + j;
        EclpSum += EclpList[index] / p;
        EquaSum += EquaList[index] / p;
      }
      for (let j = 0; j < 7; j++) {
        const index = (i - 5) * 7 + j;
        EclpAccumPrint[i].push(
          `${EclpSortedList[index][0]} ${(EclpSortedList[index][1] / p).toFixed(
            2
          )}　\n${NumList[index]} ${(EclpList[index] / p).toFixed(2)}`
        );
        EquaAccumPrint[i].push(
          `${EquaSortedList[index][0]} ${(EquaSortedList[index][1] / p).toFixed(
            2
          )}　\n${NumList[index]} ${(EquaList[index] / p).toFixed(2)}`
        );
      }
      EclpAccumPrint[i][8] = DirList[i - 5] + +EclpSum.toFixed(2);
      EquaAccumPrint[i][8] = DirList[i - 5] + +EquaSum.toFixed(2);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      EclpAccumPrint.push([]);
      EquaAccumPrint.push([]);
      let EclpSum = 0;
      let EquaSum = 0;
      for (let j = 0; j < 7; j++) {
        const index = i * 7 + j;
        EclpSum += EclpList[index];
        EquaSum += EquaList[index];
      }
      for (let j = 0; j < 7; j++) {
        const index = i * 7 + j;
        EclpAccumPrint[i].push(
          `${NameList[index]} ${EclpAccumList[index]}　\n${NumList[index]} ${EclpList[index]}`
        );
        EquaAccumPrint[i].push(
          `${NameList[index]} ${EquaAccumList[index]}　\n${NumList[index]} ${EquaList[index]}`
        );
      }
      EclpAccumPrint[i][8] = DirList[i] + EclpSum.toFixed(3);
      EquaAccumPrint[i][8] = DirList[i] + EquaSum.toFixed(3);
    }
  }
  return {
    EclpAccumPrint,
    EquaAccumPrint,
    SolsEclpPrint,
    SolsEquaPrint
  };
};
// console.log(bindMansAccumList('Guimao', 281))

/**
 * 九道宿度
 * @param {*} Name
 * @param {*} Y
 * @param {*} NodeAccum 平朔入交
 * @param {*} AnoAccum 平朔入轉
 * @param {*} AvgNewmSd 平朔距冬至時間
 * @returns
 */
export const bindWhiteAccumList = (Name, Y, NodeAccum, AnoAccum, AvgNewmSd) => {
  Y = parseInt(Y);
  NodeAccum = +NodeAccum;
  AvgNewmSd = +AvgNewmSd;
  AnoAccum = +AnoAccum;
  const { Type } = Para[Name];
  const AcrNewmSd = AvgNewmSd + AutoTcorr(AnoAccum, AvgNewmSd, Name).Tcorr;
  const NewmEclpGong =
    AcrNewmSd + AutoDifAccum(undefined, AcrNewmSd, Name).SunDifAccum;
  const { WhiteAccumList, NewmWhiteDeg } =
    Type === 11
      ? moonShoushi(NodeAccum, AvgNewmSd, NewmEclpGong, Y)
      : moonJiudao(NodeAccum, AnoAccum, AvgNewmSd, NewmEclpGong, Name, Y);
  const WhiteList = [];
  for (let i = 0; i < 28; i++) {
    WhiteList[i] = +(WhiteAccumList[i + 1] - WhiteAccumList[i]).toFixed(3);
  }
  const WhiteAccumPrint = [];
  for (let i = 0; i < 4; i++) {
    WhiteAccumPrint.push([]);
    let WhiteSum = 0;
    for (let j = 0; j < 7; j++) {
      const index = i * 7 + j;
      WhiteSum += WhiteList[index];
    }
    for (let j = 0; j < 7; j++) {
      const index = i * 7 + j;
      WhiteAccumPrint[i].push(
        `${MansNameList[index]} ${WhiteAccumList[index].toFixed(3)}　\n${NumList[index]} ${WhiteList[index]}`
      );
    }
    WhiteAccumPrint[i][8] = DirList[i] + WhiteSum.toFixed(3);
  }
  const WhiteDegMans = deg2Mans(NewmWhiteDeg, WhiteAccumList).Print;
  return { WhiteAccumPrint, WhiteDegMans };
};
// console.log(bindWhiteAccumList('Yingtian', 1281, 3, 3, 3))

export const bindMansAccumModernList = (Name, Jd) => {
  Jd = parseFloat(Jd);
  const {
    EclpAccumList: EclpAccumListRaw,
    EquaAccumList: EquaAccumListRaw,
    CecAccumList: CecAccumListRaw,
    CwhAccumList: CwhAccumListRaw,
    SolsEclpMans,
    SolsEquaMans,
    SolsCecMans,
    SolsCwhMans
  } = mansModern(Jd, Name);
  const EclpAccumList = {};
  const EquaAccumList = {};
  const CecAccumList = {};
  const CwhAccumList = {};
  for (const Mans in EclpAccumListRaw) {
    EclpAccumList[Mans] =
      (EclpAccumListRaw[Mans] - EclpAccumListRaw["角"] + 360) % 360;
  }
  for (const Mans in EquaAccumListRaw) {
    EquaAccumList[Mans] =
      (EquaAccumListRaw[Mans] - EquaAccumListRaw["角"] + 360) % 360;
  }
  for (const Mans in CecAccumListRaw) {
    CecAccumList[Mans] =
      (CecAccumListRaw[Mans] - CecAccumListRaw["角"] + 360) % 360;
  }
  for (const Mans in CwhAccumListRaw) {
    CwhAccumList[Mans] =
      (CwhAccumListRaw[Mans] - CwhAccumListRaw["角"] + 360) % 360;
  }
  const EclpSortedList = Object.entries(EclpAccumList).sort(
    (a, b) => a[1] - b[1]
  );
  const EquaSortedList = Object.entries(EquaAccumList).sort(
    (a, b) => a[1] - b[1]
  );
  const CecSortedList = Object.entries(CecAccumList).sort(
    (a, b) => a[1] - b[1]
  );
  const CwhSortedList = Object.entries(CwhAccumList).sort(
    (a, b) => a[1] - b[1]
  );
  const EclpList = [];
  const EquaList = [];
  const CecList = [];
  const CwhList = [];
  const EclpAccumPrint = [];
  const EquaAccumPrint = [];
  const CecAccumPrint = [];
  const CwhAccumPrint = [];
  for (let i = 0; i < 27; i++) {
    EclpList[i] = +(EclpSortedList[i + 1][1] - EclpSortedList[i][1]).toFixed(6);
    EquaList[i] = +(EquaSortedList[i + 1][1] - EquaSortedList[i][1]).toFixed(6);
    CecList[i] = +(CecSortedList[i + 1][1] - CecSortedList[i][1]).toFixed(6);
    CwhList[i] = +(CwhSortedList[i + 1][1] - CwhSortedList[i][1]).toFixed(6);
  }
  EclpList[27] = +(360 - EclpSortedList[27][1]).toFixed(6);
  EquaList[27] = +(360 - EquaSortedList[27][1]).toFixed(6);
  CecList[27] = +(360 - CecSortedList[27][1]).toFixed(6);
  CwhList[27] = +(360 - CwhSortedList[27][1]).toFixed(6);
  for (let i = 0; i < 4; i++) {
    EclpAccumPrint.push([]);
    EquaAccumPrint.push([]);
    CecAccumPrint.push([]);
    CwhAccumPrint.push([]);
    let EclpSum = 0;
    let EquaSum = 0;
    let CecSum = 0;
    let CwhSum = 0;
    for (let j = 0; j < 7; j++) {
      const index = i * 7 + j;
      EclpSum += EclpList[index];
      EquaSum += EquaList[index];
      CecSum += CecList[index];
      CwhSum += CwhList[index];
    }
    for (let j = 0; j < 7; j++) {
      const index = i * 7 + j;
      EclpAccumPrint[i].push(
        `${EclpSortedList[index][0]} ${EclpSortedList[index][1].toFixed(
          5
        )}　\n${NumList[index]} ${EclpList[index]}`
      );
      EquaAccumPrint[i].push(
        `${EquaSortedList[index][0]} ${EquaSortedList[index][1].toFixed(
          5
        )}　\n${NumList[index]} ${EquaList[index]}`
      );
      CecAccumPrint[i].push(
        `${CecSortedList[index][0]} ${CecSortedList[index][1].toFixed(
          5
        )}　\n${NumList[index]} ${CecList[index]}`
      );
      CwhAccumPrint[i].push(
        `${CwhSortedList[index][0]} ${CwhSortedList[index][1].toFixed(
          5
        )}　\n${NumList[index]} ${CwhList[index]}`
      );
    }
    EclpAccumPrint[i][8] = DirList[i] + EclpSum.toFixed(3);
    EquaAccumPrint[i][8] = DirList[i] + EquaSum.toFixed(3);
    CecAccumPrint[i][8] = DirList[i] + CecSum.toFixed(3);
    CwhAccumPrint[i][8] = DirList[i] + CwhSum.toFixed(3);
  }
  (EclpAccumPrint[4] = ["下爲古度"]),
    (EquaAccumPrint[4] = ["下爲古度"]),
    (CecAccumPrint[4] = ["下爲古度"]),
    (CwhAccumPrint[4] = ["下爲古度"]);
  const p = 360 / 365.25;
  for (let i = 5; i < 9; i++) {
    EclpAccumPrint.push([]);
    EquaAccumPrint.push([]);
    CecAccumPrint.push([]);
    CwhAccumPrint.push([]);
    let EclpSum = 0;
    let EquaSum = 0;
    let CecSum = 0;
    let CwhSum = 0;
    for (let j = 0; j < 7; j++) {
      const index = (i - 5) * 7 + j;
      EclpSum += EclpList[index] / p;
      EquaSum += EquaList[index] / p;
      CecSum += CecList[index] / p;
      CwhSum += CwhList[index] / p;
    }
    for (let j = 0; j < 7; j++) {
      const index = (i - 5) * 7 + j;
      EclpAccumPrint[i].push(
        `${EclpSortedList[index][0]} ${(EclpSortedList[index][1] / p).toFixed(
          4
        )}　\n${NumList[index]} ${(EclpList[index] / p).toFixed(5)}`
      );
      EquaAccumPrint[i].push(
        `${EquaSortedList[index][0]} ${(EquaSortedList[index][1] / p).toFixed(
          4
        )}　\n${NumList[index]} ${(EquaList[index] / p).toFixed(5)}`
      );
      CecAccumPrint[i].push(
        `${CecSortedList[index][0]} ${(CecSortedList[index][1] / p).toFixed(
          4
        )}　\n${NumList[index]} ${(CecList[index] / p).toFixed(5)}`
      );
      CwhAccumPrint[i].push(
        `${CwhSortedList[index][0]} ${(CwhSortedList[index][1] / p).toFixed(
          4
        )}　\n${NumList[index]} ${(CwhList[index] / p).toFixed(5)}`
      );
    }
    EclpAccumPrint[i][8] = DirList[i - 5] + EclpSum.toFixed(3);
    EquaAccumPrint[i][8] = DirList[i - 5] + EquaSum.toFixed(3);
    CecAccumPrint[i][8] = DirList[i - 5] + CecSum.toFixed(3);
    CwhAccumPrint[i][8] = DirList[i - 5] + CwhSum.toFixed(3);
  }
  return {
    EclpAccumPrint,
    EquaAccumPrint,
    CecAccumPrint,
    CwhAccumPrint,
    SolsEclpPrint: SolsEclpMans,
    SolsEquaPrint: SolsEquaMans,
    SolsCecPrint: SolsCecMans,
    SolsCwhPrint: SolsCwhMans
  };
};
// console.log(bindMansAccumModernList('Chongzhen', 2424222))

/**
 * @param {*} AvgNewmNodeAccum 此前經朔入交
 * @param {*} AvgNewmAnoAccum 此前經朔入轉
 * @param {*} AvgNewmSd 此前經朔距冬至
 * @param {*} D 此時距離經朔時間
 * @returns
 */
export const bindMoonLonLat = (
  AvgNewmNodeAccum,
  AvgNewmAnoAccum,
  AvgNewmSd,
  D
) => {
  D = +D;
  AvgNewmNodeAccum = +AvgNewmNodeAccum;
  AvgNewmAnoAccum = +AvgNewmAnoAccum;
  AvgNewmSd = +AvgNewmSd;
  if (AvgNewmNodeAccum >= 27.21221 || AvgNewmNodeAccum < 0)
    throw new Error("請輸入一交點月內的日數");
  if (AvgNewmSd >= 365.246 || AvgNewmSd < 0)
    throw new Error("請輸入一週天度內的度數");
  if (AvgNewmAnoAccum >= 27.21221 || AvgNewmAnoAccum < 0)
    throw new Error("請輸入一交點月內的日數");
  let Print = [];
  Print = Print.concat(
    [
      "Qianxiang",
      "Yuanjia",
      "Daming",
      "Huangji",
      "Qintian",
      "Mingtian",
      "Jiyuan",
      "Shoushi",
      "Dayan",
      "Yingtian",
      "Qianyuan",
      "Yitian",
      "Chongtian",
      "Guantian"
    ].map((Name) => {
      let { Solar, SolarRaw, Sidereal, Anoma, Node, Type, Sobliq } = Para[Name];
      Solar = Solar || SolarRaw;
      const p = 360 / Sidereal;
      const AnoAccum = (AvgNewmAnoAccum + D) % Anoma;
      const Sd = (AvgNewmSd + D) % Solar;
      const { Tcorr, NodeAccumCorrA } = AutoTcorr(
        AvgNewmAnoAccum,
        AvgNewmSd,
        Name
      ); // 經朔到定朔的時間
      const NodeAccum =
        (AvgNewmNodeAccum + NodeAccumCorrA - Tcorr + D + Node) % Node; // 此時入交
      const AcrNewmAnoAccum = (AvgNewmAnoAccum + Tcorr + Anoma) % Anoma;
      const AcrNewmSd = AvgNewmSd + AutoTcorr(AnoAccum, AvgNewmSd, Name).Tcorr;
      const NewmEclpGong =
        AcrNewmSd + AutoDifAccum(undefined, AcrNewmSd, Name).SunDifAccum;
      // 九道術
      let NewmWhiteGong = 0,
        Dingxian = 0,
        NodeWhiteGong = 0,
        WhEq_WhiteGong = 0,
        WhEqGong = 0;
      const NodeEclpGong = chooseNode(
        NewmEclpGong,
        AvgNewmNodeAccum,
        AvgNewmAnoAccum,
        AvgNewmSd,
        Name
      );
      const NowNewm_WhiteDif =
        (anojour(AnoAccum, Name).Anojour -
          anojour(AcrNewmAnoAccum, Name).Anojour +
          Sidereal) %
        Sidereal;
      let NowEclpGong, NowEquaGong, EclpLat, EquaLat;
      if (Type === 11) {
        const FuncNewm = moonShoushi(
          AvgNewmNodeAccum,
          AvgNewmSd,
          NewmEclpGong,
          1281,
          NowNewm_WhiteDif
        );
        NewmWhiteGong = FuncNewm.NewmWhiteGong;
        Dingxian = FuncNewm.Dingxian;
        WhEq_WhiteGong = FuncNewm.WhEq_WhiteGong;
        WhEqGong = FuncNewm.WhEqGong;
        EquaLat = FuncNewm.EquaLat;
      } else if (Type >= 6) {
        const FuncNewm = moonJiudao(
          AvgNewmNodeAccum,
          AvgNewmAnoAccum,
          AvgNewmSd,
          NewmEclpGong,
          Name,
          1281
        );
        NewmWhiteGong = FuncNewm.NewmWhiteGong;
        NodeWhiteGong = FuncNewm.NodeWhiteGong;
        EclpLat = moonEclpLat(NodeAccum, AnoAccum, Sd, Name);
      } else {
        EclpLat = moonEclpLat(NodeAccum, AnoAccum, Sd, Name);
      }
      const NowWhiteGong = NewmWhiteGong
        ? (NewmWhiteGong + NowNewm_WhiteDif) % Sidereal
        : undefined;
      const Now_WhEq_WhiteDif = (NowWhiteGong - WhEq_WhiteGong + Solar) % Solar;
      if (Type === 11) {
        const Now_WhEq_EquaDif =
          Now_WhEq_WhiteDif - equa2WhiteDif(Dingxian, Now_WhEq_WhiteDif);
        NowEquaGong = (WhEqGong + Now_WhEq_EquaDif) % Solar;
        NowEclpGong = equaEclp(NowEquaGong, Name).Equa2Eclp;
      } else {
        const MoonNode_WhiteDif =
          (NowWhiteGong - NodeWhiteGong + Solar) % Solar; // 此處Gong和Lon是一樣的，沒有區別
        const MoonNode_EclpDif =
          MoonNode_WhiteDif -
          eclp2WhiteDif(NodeEclpGong, MoonNode_WhiteDif, Name);
        NowEclpGong = (NodeEclpGong + MoonNode_EclpDif) % Solar;
        NowEquaGong = equaEclp(NowEclpGong, Name).Eclp2Equa;
      }
      const Moon2SunEquaLat = autoLat(NowEclpGong, Name, true); // 月亮所在黃道度對應的太陽的赤緯
      if (Type === 11) {
        EclpLat = EquaLat - Moon2SunEquaLat;
      } else {
        EquaLat = EclpLat + Moon2SunEquaLat;
      }
      /// 球面三角
      const Sobliq360 = Sobliq * p;
      const { WhEqLon, WhEqObliq } = whEqObliq(
        Gong2Lon(NodeEclpGong * p),
        Sobliq360
      );
      const NowWhEq_EquaDif = LonHigh2Flat(WhEqObliq, Now_WhEq_WhiteDif * p);
      const NowEquaLon = (WhEqLon + NowWhEq_EquaDif) % 360;
      const NowCecLonWest = LonFlat2High(Sobliq360, NowEquaLon);
      const NowEquaLatWest = HighLon2FlatLat(WhEqObliq, Now_WhEq_WhiteDif * p);
      const Moon2SunEquaLatWest = HighLon2FlatLat(Sobliq360, NowCecLonWest);
      const NowCecLatWest = NowEquaLatWest - Moon2SunEquaLatWest;
      const NowCecGongWest = Lon2Gong(NowCecLonWest) / p;
      const NowEquaGongWest = Lon2Gong(NowEquaLon) / p;
      const NowEclpGongErr = NowEclpGong
        ? Math.trunc(((NowEclpGong - NowCecGongWest) / NowCecGongWest) * 10000)
        : "";
      const NowEquaGongErr = NowEquaGong
        ? Math.trunc(
            ((NowEquaGong - NowEquaGongWest) / NowEquaGongWest) * 10000
          )
        : "";
      const EclpLatErr = EclpLat
        ? Math.trunc(
            ((EclpLat - NowCecLatWest / p) / (NowCecLatWest / p)) * 10000
          )
        : "";
      const EquaLatErr = EquaLat
        ? Math.trunc(
            ((EquaLat - NowEquaLatWest / p) / (NowEquaLatWest / p)) * 10000
          )
        : "";
      return {
        title: NameList[Name],
        // data: [
        //   NowWhiteGong ? NowWhiteGong.toFixed(4) : "",
        //   NowEclpGong ? NowEclpGong.toFixed(4) : "",
        //   NowEclpGong ? NowCecGongWest.toFixed(4) : "",
        //   NowEclpGongErr,
        //   lat2NS(EclpLat),
        //   NowWhiteGong ? lat2NS(NowCecLatWest / p) : "",
        //   NowWhiteGong ? EclpLatErr : "",
        //   NowEquaGong ? NowEquaGong.toFixed(4) : "",
        //   NowEquaGong ? NowEquaGongWest.toFixed(4) : "",
        //   NowEquaGong ? NowEquaGongErr : "",
        //   lat2NS(EquaLat),
        //   EquaLat ? lat2NS(NowEquaLatWest / p) : "",
        //   NowWhiteGong ? EquaLatErr : "",
        //   NodeEclpGong.toFixed(4),
        //   WhEqGong ? WhEqGong.toFixed(4) : "",
        //   NowWhiteGong ? (Lon2Gong(WhEqLon) / p).toFixed(4) : ""
        // ]
        data: [
          NowWhiteGong ? NowWhiteGong.toFixed(4) : "",
          NowEclpGong ? NowEclpGong.toFixed(4) : "",
          lat2NS(EclpLat),
          NowEquaGong ? NowEquaGong.toFixed(4) : "",
          lat2NS(EquaLat),
          NodeEclpGong.toFixed(4),
          WhEqGong ? WhEqGong.toFixed(4) : ""
        ]
      };
    })
  );
  return Print;
};
// console.log(bindMoonLonLat(11, 4, 54, 1))

export const bindSunEclipse = (
  NodeAccum,
  AnoAccum,
  AvgDeci,
  AvgSd,
  SolsDeci
) => {
  NodeAccum = +NodeAccum;
  AnoAccum = +AnoAccum;
  AvgDeci = +`.${AvgDeci}`;
  AvgSd = +AvgSd;
  SolsDeci = +`.${SolsDeci}`;
  const Solar = 365.24478;
  const HalfTermLeng = Solar / 24;
  if (NodeAccum > 27.212215) throw new Error("請輸入一交點月27.212215內的日數");
  if (AnoAccum > 27.5545) throw new Error("請輸入一近點月27.5545內的日數");
  // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
  let i = 0;
  for (let j = 0; j <= 11; j++) {
    if (AvgSd >= j * HalfTermLeng && AvgSd < (j + 1) * HalfTermLeng) {
      i = (j - 2 + 12) % 12;
    }
    break;
  }
  let Print1 = [];
  Print1 = Print1.concat(
    [
      "Daye",
      "Wuyin",
      "Huangji",
      "Linde",
      "Wuji",
      "Tsrengyuan",
      "Qintian",
      "Jiyuan",
      "Tongyuan",
      "Qiandao",
      "Chunxi",
      "Huiyuan",
      "Tongtian",
      "Kaixi",
      "Chengtian",
      "Daming3",
      "Gengwu",
      "Shoushi",
      "Datong"
    ].map((Name) => {
      const { Tcorr1, Tcorr2 } = AutoTcorr(AnoAccum, AvgSd, Name);
      const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1;
      const AcrSd = AvgSd + (Tcorr2 || Tcorr1);
      const { Magni, StartDeci, GreatDeci, EndDeci, Status } = AutoEclipse(
        NodeAccum,
        AnoAccum,
        AcrDeci,
        AvgDeci,
        AcrSd,
        AvgSd,
        1,
        Name,
        i + 1,
        0,
        0,
        SolsDeci
      );
      let StartDeciPrint = "-";
      let GreatDeciPrint = "-";
      let EndDeciPrint = "-";
      const AcrDeciPrint = (AcrDeci * 100).toFixed(3);
      if (StartDeci && GreatDeci) {
        StartDeciPrint = (StartDeci * 100).toFixed(3);
        GreatDeciPrint = (GreatDeci * 100).toFixed(3);
        EndDeciPrint = (EndDeci * 100).toFixed(3);
      }
      let StatusPrint = "不食";
      if (Status === 3) {
        StatusPrint = "微少";
      } else if (Status === 2) {
        StatusPrint = "偏食";
      } else if (Status === 1) {
        StatusPrint = "全食";
      }
      return {
        title: NameList[Name],
        data: [
          StatusPrint,
          Magni.toFixed(3),
          StartDeciPrint,
          AcrDeciPrint,
          GreatDeciPrint,
          EndDeciPrint
        ]
      };
    })
  );
  let Print2 = [];
  Print2 = Print2.concat(
    [
      "Dayan",
      "Xuanming",
      "Chongxuan",
      "Yingtian",
      "Qianyuan",
      "Yitian",
      "Chongtian",
      "Guantian"
    ].map((Name) => {
      const { Tcorr1, Tcorr2 } = AutoTcorr(AnoAccum, AvgSd, Name);
      const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1;
      const AcrSd = AvgSd + (Tcorr2 || Tcorr1);
      const { Magni, StartDeci, GreatDeci, EndDeci, Status } = AutoEclipse(
        NodeAccum,
        AnoAccum,
        AcrDeci,
        AvgDeci,
        AcrSd,
        AvgSd,
        1,
        Name,
        i + 1,
        0,
        0,
        SolsDeci
      );
      let StartDeciPrint = "-";
      let GreatDeciPrint = "-";
      let EndDeciPrint = "-";
      const AcrDeciPrint = (AcrDeci * 100).toFixed(3);
      if (StartDeci && GreatDeci) {
        StartDeciPrint = (StartDeci * 100).toFixed(3);
        GreatDeciPrint = (GreatDeci * 100).toFixed(3);
        EndDeciPrint = (EndDeci * 100).toFixed(3);
      }
      let StatusPrint = "不食";
      if (Status === 3) {
        StatusPrint = "微少";
      } else if (Status === 2) {
        StatusPrint = "偏食";
      } else if (Status === 1) {
        StatusPrint = "全食";
      }
      return {
        title: NameList[Name],
        data: [
          StatusPrint,
          Magni.toFixed(3),
          StartDeciPrint,
          AcrDeciPrint,
          GreatDeciPrint,
          EndDeciPrint
        ]
      };
    })
  );
  return { Print1, Print2 };
};
// console.log(bindSunEclipse(.1, 14, 3355, 14, 5))

export const bindMoonEclipse = (
  NodeAccum,
  AnoAccum,
  AvgDeci,
  AvgSd,
  SolsDeci
) => {
  NodeAccum = +NodeAccum;
  AnoAccum = +AnoAccum;
  AvgDeci = +`.${AvgDeci}`;
  AvgSd = +AvgSd;
  SolsDeci = +`.${SolsDeci}`;
  const Solar = 365.24478;
  const HalfTermLeng = Solar / 24;
  const StatusList = ["不食", "全食", "偏食", "微少"];
  if (NodeAccum > 27.212215) throw new Error("請輸入一交點月27.212215內的日數");
  if (AnoAccum > 27.5545) throw new Error("請輸入一近點月27.5545內的日數");
  // 隋系是要根據月份來判斷的，這裏爲了簡化輸入，我改爲用節氣判斷季節，這不準確
  let i = 0;
  for (let j = 0; j <= 11; j++) {
    if (AvgSd >= j * HalfTermLeng && AvgSd < (j + 1) * HalfTermLeng) {
      i = (j - 2 + 12) % 12;
    }
    break;
  }
  let Print1 = [];
  Print1 = Print1.concat(
    [
      "Tsrengguang",
      "Daye",
      "Wuyin",
      "Huangji",
      "Linde",
      "Wuji",
      "Tsrengyuan",
      "Qintian",
      "Jiyuan",
      "Tongyuan",
      "Qiandao",
      "Chunxi",
      "Huiyuan",
      "Tongtian",
      "Kaixi",
      "Chengtian",
      "Daming3",
      "Gengwu",
      "Shoushi",
      "Datong",
      "Datong2"
    ].map((Name) => {
      const { Tcorr1, Tcorr2 } = AutoTcorr(AnoAccum, AvgSd, Name);
      const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1;
      const AcrSd = AvgSd + (Tcorr2 || Tcorr1);
      const { Magni, StartDeci, GreatDeci, EndDeci, Status } = AutoEclipse(
        NodeAccum,
        AnoAccum,
        AcrDeci,
        AvgDeci,
        AcrSd,
        AvgSd,
        0,
        Name,
        i + 1,
        0,
        0,
        SolsDeci
      );
      let StartDeciPrint = "-";
      let GreatDeciPrint = "-";
      let EndDeciPrint = "-";
      const AcrDeciPrint = (AcrDeci * 100).toFixed(3);
      if (StartDeci && GreatDeci) {
        StartDeciPrint = (StartDeci * 100).toFixed(3);
        GreatDeciPrint = (GreatDeci * 100).toFixed(3);
        EndDeciPrint = (EndDeci * 100).toFixed(3);
      }
      const StatusPrint = StatusList[Status];
      return {
        title: NameList[Name],
        data: [
          StatusPrint,
          Magni.toFixed(3),
          StartDeciPrint,
          AcrDeciPrint,
          GreatDeciPrint,
          EndDeciPrint
        ]
      };
    })
  );
  let Print2 = [];
  Print2 = Print2.concat(
    [
      "Dayan",
      "Xuanming",
      "Chongxuan",
      "Yingtian",
      "Qianyuan",
      "Yitian",
      "Chongtian",
      "Guantian"
    ].map((Name) => {
      const { Tcorr1, Tcorr2 } = AutoTcorr(AnoAccum, AvgSd, Name);
      const AcrDeci = (AvgDeci + (Tcorr2 || Tcorr1) + 1) % 1;
      const AcrSd = AvgSd + (Tcorr2 || Tcorr1);
      const { Magni, StartDeci, GreatDeci, EndDeci, Status } = AutoEclipse(
        NodeAccum,
        AnoAccum,
        AcrDeci,
        AvgDeci,
        AcrSd,
        AvgSd,
        0,
        Name,
        i + 1,
        0,
        0,
        SolsDeci
      );
      let StartDeciPrint = "-";
      let GreatDeciPrint = "-";
      let EndDeciPrint = "-";
      const AcrDeciPrint = (AcrDeci * 100).toFixed(3);
      if (StartDeci && GreatDeci) {
        StartDeciPrint = (StartDeci * 100).toFixed(3);
        GreatDeciPrint = (GreatDeci * 100).toFixed(3);
        EndDeciPrint = (EndDeci * 100).toFixed(3);
      }
      const StatusPrint = StatusList[Status];
      return {
        title: NameList[Name],
        data: [
          StatusPrint,
          Magni.toFixed(3),
          StartDeciPrint,
          AcrDeciPrint,
          GreatDeciPrint,
          EndDeciPrint
        ]
      };
    })
  );
  return { Print1, Print2 };
};
// console.log(bindMoonEclipse(1.1, 22, 22, 22))

const ErrPrint_SunTcorr = (Name, AnoAccum) => {
  const SunTcorrErr = [];
  for (let i = 1; i <= 182; i++) {
    SunTcorrErr[i] = bindTcorr(AnoAccum, i, Name).SunTcorrErr;
  }
  return SunTcorrErr;
};
// console.log (ErrPrint_SunTcorr('Shoushi', 7, 1247))

const rmse = (List) => {
  // 均方根
  let Sum = 0;
  for (let i = 0; i < List.length; i++) {
    Sum += List[i] ** 2;
  }
  return Math.sqrt(Sum / List.length);
};
const testLon2Lat = (List) => {
  // 計算所有古曆在每一度的誤差，求均方差
  const Err = [];
  for (let i = 0; i < List.length; i++) {
    Err[i] = [];
    for (let k = 0; k <= 182; k++) {
      // k如果改成1有bug
      // Err[i][k] = +bindLon2Lat(k, 5)[i].data[1] // 赤緯
      Err[i][k] = +bindLon2Lat(k, 5)[i].data[4]; // 日出未修正
      // Err[i][k] = +bindLon2Lat(k, 5)[i].data[8] // 晷長未修正
    }
  }
  const RMSE = [];
  for (let i = 0; i < List.length; i++) {
    RMSE[i] = rmse(Err[i]);
  }
  let Name = [];
  Name = Name.concat(List.map((a) => NameList[a]));
  const Print = [];
  for (let i = 0; i < List.length; i++) {
    Print[i] = `${Name[i]}：${RMSE[i].toFixed(4)}`;
  }
  return Print;
};
// console.log(testLon2Lat(['Easthan', 'Yuanjia', 'Daming', 'Daye', 'Wuyin', 'Huangji', 'Linde', 'Dayan', 'Xuanming', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Guantian', 'Jiyuan', 'Daming3', 'Shoushi', 'Datong']))
