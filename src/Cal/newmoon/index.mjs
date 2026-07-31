import N1 from "./newm_quar.mjs";
import N2 from "./newm.mjs";
// import N3 from './newm_huihui.mjs'
import { N4 } from "./newm_shixian.mjs";
import Para from "../parameter/calendars.mjs";
import {
  ScList,
  ThreeList,
  NameList,
  MonNumList1,
  MonNumListChuA,
  MonNumListChuB
} from "../parameter/constants.mjs";
import { AutoEclipse } from "../astronomy/eclipse.mjs";
import { AutoRangeEcli } from "../parameter/auto_consts.mjs";
import { fix, fm360, fm60, fmod1 } from "../parameter/functions.mjs";
import { autoRise } from "../astronomy/lat_rise_dial.mjs";
import terms from "./terms.mjs";
// const Index = (Name, YearStart, YearEnd) => {
export default (Name, YearStart, YearEnd) => {
  const Bind = (Name) => {
    const type = Para[Name].Type;
    if (type === 1) return N1;
    else if (type === 13) return N4;
    else return N2;
  };
  const AutoNewm = Bind(Name);
  const {
    Type,
    OriginAd,
    CloseOriginAd,
    ZhangRange,
    Denom,
    Node,
    FirstNum,
    ZhengNum
  } = Para[Name];
  const FirstZhengDif = FirstNum - ZhengNum; // 年首和正月的差，用于月名改正
  const Memo = [];
  const calculate = (Y) => {
    const [PrevYear, ThisYear, NextYear] = Memo;
    const {
      JiScOrder,
      SolsAccum,
      Sols,
      NewmEqua,
      NewmEclp,
      LeapLimit,
      SolsDeci
    } = ThisYear;
    let { LeapNumTerm, NewmInt } = ThisYear;
    NewmInt = NewmInt || [];
    let NewmStart = 0;
    let NewmEnd = LeapNumTerm ? 1 : 0;
    let TermEnd = NewmEnd;
    if (PrevYear.LeapNumTerm) {
      LeapNumTerm = 0;
      // 可能出現去年不閏而閏，於是今年正月和去年十二月重疊
      if (PrevYear.NewmAvgSc[13] === ThisYear.NewmAvgSc[1]) {
        // 會出現最末位差一點的情況
        NewmStart = 1;
        NewmEnd = 1;
        TermEnd = 0;
      }
    }
    ///////////////// 調整節氣
    const {
      TermDownName,
      TermDownSc,
      TermDownDeci,
      TermDownAcrSc,
      TermDownAcrDeci,
      TermDownNowDeci,
      TermDownEqua,
      TermDownEclp,
      TermUpName,
      TermUpSc,
      TermUpDeci,
      TermUpEqua,
      TermUpEclp,
      TermUpAcrDeci,
      TermUpNowDeci,
      TermUpAcrSc
    } = terms(ThisYear, PrevYear, LeapNumTerm, Name); // 必須要傳上面修改過後的LeapNumTerm
    /////////////////// 月序
    const MonthName = [];
    const MonthOrder = []; // 这个是为了检验古六历春秋日食
    let MonNumList = MonNumList1;
    if (Name === "Zhuanxu1") MonNumList = MonNumListChuA;
    else if (Name === "Zhuanxu2") MonNumList = MonNumListChuB;
    if (LeapNumTerm) {
      for (let i = 1; i <= 13; i++) {
        if (i <= LeapNumTerm) {
          MonthOrder[i] = fmod1(i + FirstZhengDif, 12);
          MonthName[i] = MonNumList[MonthOrder[i]];
        } else if (i === LeapNumTerm + 1) {
          MonthOrder[i] = "l" + fmod1(LeapNumTerm + FirstZhengDif, 12);
          MonthName[i] =
            "閏" + MonNumList[fmod1(LeapNumTerm + FirstZhengDif, 12)];
        } else {
          MonthOrder[i] = fmod1(i + FirstZhengDif - 1, 12);
          MonthName[i] = MonNumList[MonthOrder[i]];
        }
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        MonthOrder[i] = fmod1(i + FirstZhengDif, 12);
        MonthName[i] = MonNumList[MonthOrder[i]];
      }
    }
    const MonthPrint = MonthName.slice(1);
    const MonthOrderPrint = MonthOrder.slice(1);
    const NewmSlice = (array) => array.slice(1 + NewmStart, 13 + NewmEnd);
    const TermSlice = (array) => array.slice(0, 12 + TermEnd);
    ////////////下爲調整輸出////////////
    const NewmSdPrint = ThisYear.NewmSd ? NewmSlice(ThisYear.NewmSd) : [];
    const NewmSmdPrint = ThisYear.NewmSmd ? NewmSlice(ThisYear.NewmSmd) : [];
    const NewmAcrSdPrint = ThisYear.NewmAcrSd
      ? NewmSlice(ThisYear.NewmAcrSd)
      : [];
    const NewmAvgScPrint = ThisYear.NewmAvgSc
      ? NewmSlice(ThisYear.NewmAvgSc)
      : [];
    const NewmAvgDeciPrint = ThisYear.NewmAvgDeci
      ? NewmSlice(ThisYear.NewmAvgDeci)
      : [];
    NewmInt = NewmInt.slice(1 + NewmStart);
    let ZhengGreatSur = 0,
      ZhengSmallSur = 0;
    if (Type === 1) {
      ZhengGreatSur = (NewmInt[0] - ThisYear.BuScOrder + 60) % 60;
      ZhengSmallSur = parseFloat(
        ((ThisYear.NewmAvgRaw[1 + NewmStart] - NewmInt[0]) * Denom).toPrecision(
          5
        )
      );
    }
    let NewmScPrint = [],
      NewmDeci3Print = [],
      NewmDeci2Print = [],
      NewmDeci1Print = [],
      NewmAcrDeciPrint = [];
    if (Type >= 2) {
      NewmScPrint = NewmSlice(ThisYear.NewmSc);
      if (Type <= 10 && ThisYear.NewmDeci1) {
        // 線性內插
        NewmDeci1Print = NewmSlice(ThisYear.NewmDeci1);
      } else if (Type === 11) {
        // 三次內插
        NewmDeci3Print = NewmSlice(ThisYear.NewmDeci3);
      } else if (Type === 13) {
        // 實朔實時
        NewmAcrDeciPrint = NewmSlice(ThisYear.NewmDeci);
      }
    }
    if (Type >= 5 && Type <= 10 && ThisYear.NewmDeci2) {
      NewmDeci2Print = NewmSlice(ThisYear.NewmDeci2);
    }
    const NewmEquaPrint = NewmEqua ? NewmSlice(NewmEqua) : undefined;
    const NewmEclpPrint = NewmEclp ? NewmSlice(NewmEclp) : undefined;
    const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc);
    const SyzygyDeciPrint = NewmSlice(ThisYear.SyzygyDeci);
    const NewmNowlineDeciPrint = ThisYear.NewmNowlineDeci
      ? NewmSlice(ThisYear.NewmNowlineDeci)
      : undefined;
    const SyzygyNowlineDeciPrint = ThisYear.SyzygyNowlineDeci
      ? NewmSlice(ThisYear.SyzygyNowlineDeci)
      : undefined;
    let NewmDeciPrint = [],
      TermDownNamePrint = [],
      TermDownScPrint = [],
      TermDownDeciPrint = [],
      TermDownAcrScPrint = [],
      TermDownAcrDeciPrint = [],
      TermDownNowDeciPrint = [],
      TermDownEquaPrint = [],
      TermDownEclpPrint = [],
      TermUpNamePrint = [],
      TermUpScPrint = [],
      TermUpDeciPrint = [],
      TermUpEquaPrint = [],
      TermUpEclpPrint = [],
      TermUpAcrDeciPrint = [],
      TermUpNowDeciPrint = [],
      TermUpAcrScPrint = [];
    TermDownNamePrint = TermSlice(TermDownName);
    TermUpNamePrint = TermUpName[2] ? TermSlice(TermUpName) : [];
    if ((TermDownSc || []).length) {
      TermDownScPrint = TermSlice(TermDownSc);
      TermDownDeciPrint = TermSlice(TermDownDeci);
    }
    if ((TermUpSc || []).length) {
      TermUpScPrint = TermSlice(TermUpSc);
      TermUpDeciPrint = TermSlice(TermUpDeci);
    }
    if ((TermDownAcrDeci || []).length) {
      TermDownAcrScPrint = TermSlice(TermDownAcrSc);
      TermDownAcrDeciPrint = TermSlice(TermDownAcrDeci);
      TermUpAcrScPrint = TermSlice(TermUpAcrSc);
      TermUpAcrDeciPrint = TermSlice(TermUpAcrDeci);
    }
    if ((TermDownNowDeci || []).length) {
      TermDownNowDeciPrint = TermSlice(TermDownNowDeci);
      TermUpNowDeciPrint = TermSlice(TermUpNowDeci);
    }
    if ((TermDownEqua || []).length) {
      TermDownEquaPrint = TermSlice(TermDownEqua);
      TermUpEquaPrint = TermSlice(TermUpEqua);
      TermDownEclpPrint = TermSlice(TermDownEclp);
      TermUpEclpPrint = TermSlice(TermUpEclp);
    }
    ////////// 調用交食模塊。由於隋系交食需要用月份，所以必須要切了之後才能用，傳一堆參數，很惡心
    let SunEcli = [],
      MoonEcli = [],
      MonthInfo = [],
      NewmNodeAccumPrint = [],
      NewmNodeAccumMidnPrint = [],
      NewmAnoAccumPrint = [],
      NewmAnoAccumMidnPrint = [],
      SyzygyNodeAccumPrint = [],
      SyzygyAnoAccumPrint = [],
      SyzygySdPrint = [],
      SyzygyAcrSdPrint = [];
    if (Type > 1 && Type <= 11) {
      NewmDeciPrint = NewmSlice(ThisYear.NewmDeci);
      const SyzygyAvgDeciPrint = NewmSlice(ThisYear.SyzygyAvgDeci);
      if (Node) {
        NewmNodeAccumPrint = NewmSlice(ThisYear.NewmNodeAccum);
        NewmNodeAccumMidnPrint = NewmSlice(ThisYear.NewmNodeAccumMidn);
        NewmAnoAccumPrint = NewmSlice(ThisYear.NewmAnoAccum);
        NewmAnoAccumMidnPrint = NewmSlice(ThisYear.NewmAnoAccumMidn);
        SyzygyNodeAccumPrint = NewmSlice(ThisYear.SyzygyNodeAccum);
        SyzygyAnoAccumPrint = NewmSlice(ThisYear.SyzygyAnoAccum);
        SyzygySdPrint = NewmSlice(ThisYear.SyzygySd);
        SyzygyAcrSdPrint = NewmSlice(ThisYear.SyzygyAcrSd);
        for (let i = 0; i < MonthPrint.length; i++) {
          // 切了之後從0開始索引
          let NoleapMon = i + 1;
          if (LeapNumTerm > 0 && i >= LeapNumTerm) NoleapMon = i;
          let Rise = autoRise(NewmAcrSdPrint[i], SolsDeci, Name) / 100;
          let SunEcliFunc = {},
            MoonEcliFunc = {};
          const { RangeSunEcli, RangeMoonEcli } = AutoRangeEcli(Name, Type);
          let isSunEcli =
            (NewmNodeAccumPrint[i] < 0.9 ||
              (NewmNodeAccumPrint[i] > 12.8 && NewmNodeAccumPrint[i] < 15.5) ||
              NewmNodeAccumPrint[i] > 25.3) &&
            NewmDeciPrint[i] > Rise - RangeSunEcli &&
            NewmDeciPrint[i] < 1 - Rise + RangeSunEcli;
          let isMoonEcli =
            (SyzygyNodeAccumPrint[i] < 1.5 ||
              (SyzygyNodeAccumPrint[i] > 12.1 &&
                SyzygyNodeAccumPrint[i] < 15.1) ||
              SyzygyNodeAccumPrint[i] > 25.7) &&
            (SyzygyDeciPrint[i] < Rise + RangeMoonEcli ||
              SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli);
          const Sunset = fix(1 - Rise);
          if (Name === "Mingtian") {
            isSunEcli =
              NewmDeciPrint[i] > Rise - RangeSunEcli &&
              NewmDeciPrint[i] < 1 - Rise + RangeSunEcli;
            isMoonEcli =
              SyzygyDeciPrint[i] < Rise + RangeMoonEcli ||
              SyzygyDeciPrint[i] > 1 - Rise - RangeMoonEcli;
          }
          Rise = fix(Rise);
          const StatusList = ["", "●", "◐", "◔"];
          if (isSunEcli) {
            // 這些數字根據大統，再放寬0.3
            SunEcliFunc = AutoEclipse(

              NewmNodeAccumPrint[i],
              NewmAnoAccumPrint[i],
              NewmDeciPrint[i],
              NewmAvgDeciPrint[i],
              NewmAcrSdPrint[i],
              NewmSdPrint[i],
              1,
              Name,
              NoleapMon,
              LeapNumTerm,
              SolsAccum
            );
            const SunEcliStatus = SunEcliFunc.Status;
            let NewmMagni = 0;
            const NewmStartDeci = SunEcliFunc.StartDeci
              ? fix(SunEcliFunc.StartDeci)
              : 0;
            const NewmGreatDeci = SunEcliFunc.GreatDeci
              ? fix(SunEcliFunc.GreatDeci)
              : 0;
            const NewmEndDeci = SunEcliFunc.EndDeci
              ? fix(SunEcliFunc.EndDeci)
              : 0;
            if (SunEcliStatus) {
              NewmMagni = SunEcliFunc.Magni.toFixed(2);
              SunEcli[i] = [
                MonthPrint[i] + " 日食",
                NewmMagni,
                Rise,
                NewmStartDeci ? NewmStartDeci : "",
                NewmGreatDeci ? NewmGreatDeci : "",
                NewmEndDeci ? NewmEndDeci : "",
                Sunset
              ];
              NewmScPrint[i] += StatusList[SunEcliStatus];
            }
          }
          if (isMoonEcli) {
            // 陳美東《中國古代的月食食限及食分算法》：五紀17.8/13.36大概是1.33
            MoonEcliFunc = AutoEclipse(
              SyzygyNodeAccumPrint[i],
              SyzygyAnoAccumPrint[i],
              SyzygyDeciPrint[i],
              SyzygyAvgDeciPrint[i],
              SyzygyAcrSdPrint[i],
              SyzygySdPrint[i],
              0,
              Name,
              NoleapMon,
              LeapNumTerm,
              SolsAccum
            );
            const MoonEcliStatus = MoonEcliFunc.Status;
            let SyzygyMagni = 0;
            const SyzygyStartDeci = MoonEcliFunc.StartDeci
              ? fix(MoonEcliFunc.StartDeci)
              : 0;
            const SyzygyGreatDeci = MoonEcliFunc.GreatDeci
              ? fix(MoonEcliFunc.GreatDeci)
              : 0;
            const SyzygyEndDeci = MoonEcliFunc.EndDeci
              ? fix(MoonEcliFunc.EndDeci)
              : 0;
            if (MoonEcliStatus) {
              SyzygyMagni = MoonEcliFunc.Magni.toFixed(2);
              MoonEcli[i] = [
                MonthPrint[i] + " 月食",
                SyzygyMagni,
                Sunset,
                SyzygyStartDeci ? SyzygyStartDeci : "",
                SyzygyGreatDeci ? SyzygyGreatDeci : "",
                SyzygyEndDeci ? SyzygyEndDeci : "",
                Rise
              ];
              SyzygyScPrint[i] += StatusList[MoonEcliStatus];
            }
          }
        }
      }
      for (let i = 0; i < NewmDeciPrint.length; i++) {
        NewmDeciPrint[i] = fix(NewmDeciPrint[i]);
        if ((NewmDeci1Print || []).length)
          NewmDeci1Print[i] = fix(NewmDeci1Print[i]);
        if ((NewmDeci2Print || []).length)
          NewmDeci2Print[i] = fix(NewmDeci2Print[i], 3);
        if ((NewmDeci3Print || []).length)
          NewmDeci3Print[i] = fix(NewmDeci3Print[i], 3);
        NewmAvgDeciPrint[i] = fix(NewmAvgDeciPrint[i]);
        SyzygyDeciPrint[i] = fix(SyzygyDeciPrint[i], 3);
      }
    } else if (Type === 13) {
      SunEcli = ThisYear.SunEcli;
      MoonEcli = ThisYear.MoonEcli;
    }
    const YearSc = ScList[fm60(Y - 3)];
    let Era = Y;
    if (Y > 0) Era = `公元 ${Y} 年 ${YearSc}`;
    else Era = `公元前 ${1 - Y} 年 ${YearSc}`;
    let YearInfo = [
      {
        CalName: NameList[Name],
        OriginYear: `距曆元${Y - (OriginAd || CloseOriginAd)}年`
      }
    ];
    if (Type === 1) {
      const LeapSur = ThisYear.LeapSurAvg;
      if (Name === "Taichu") {
        YearInfo.push({
          BuYear: `${ScList[ThisYear.BuScOrder]}統${ThisYear.BuYear}${ThisYear.JupiterSc}`
        });
      } else {
        YearInfo.push({
          BuYear: `${ThreeList[ThisYear.JiOrder]}紀${ScList[ThisYear.BuScOrder]}蔀${ThisYear.BuYear}`
        });
      }
      YearInfo.push({
        SolsSur: `大${ZhengGreatSur}小${ZhengSmallSur}冬至${parseFloat(ThisYear.SolsAccumMod.toPrecision(6)).toFixed(4)}`
      });
      YearInfo.push({ LeapSur: `閏餘${LeapSur}` });
      if (ThisYear.LeapNumOriginLeapSur) {
        YearInfo.push({
          LeapMon: `閏${ThisYear.LeapNumOriginLeapSur - NewmStart}`
        });
      }
    } else if (Type === 13) {
      YearInfo.push({
        LeapSur: `年根${fm360(ThisYear.SunRoot).toFixed(6)} 太陽最卑${fm360(ThisYear.SperiRoot).toFixed(6)} 太陰${fm360(ThisYear.MoonRoot).toFixed(6)} 太陰最高${fm360(ThisYear.MapoRoot).toFixed(6)} 正交${fm360(ThisYear.NodeRoot).toFixed(6)}`
      });
    } else {
      if (JiScOrder)
        YearInfo.push({ BuYear: `${ScList[JiScOrder]}紀${ThisYear.JiYear}` });
      if (Type === 2)
        YearInfo.push({
          LeapSur: `平閏餘${ThisYear.LeapSurAvg}定閏餘${ThisYear.LeapSurAcr.toFixed(2)}閏準${LeapLimit}`
        });
      else if (Type === 3)
        YearInfo.push({
          LeapSur: `平閏餘${Math.round(ThisYear.LeapSurAvg * ZhangRange)}定閏餘${(ThisYear.LeapSurAcr * ZhangRange).toFixed(2)}閏準${Math.round(LeapLimit * ZhangRange)}`
        });
      else if (Type <= 7)
        YearInfo.push({
          LeapSur: `平閏餘${parseFloat(ThisYear.LeapSurAvg.toPrecision(8))}定閏餘${ThisYear.LeapSurAcr.toFixed(2)}閏準${LeapLimit}`
        });
      else if (Type <= 11)
        YearInfo.push({
          LeapSur: `平閏餘${ThisYear.LeapSurAvg.toFixed(2)}定閏餘${ThisYear.LeapSurAcr.toFixed(2)}閏準${LeapLimit.toFixed(2)}`
        });
    }
    YearInfo = [
      YearInfo.reduce((accumulator, currentObject) => {
        return { ...accumulator, ...currentObject };
      }, {})
    ];
    const EcliInfo = [...SunEcli, ...MoonEcli].filter((x) => x != null);
    // 每個月交轉盈縮曆詳情
    if (Type === 13) {
      for (let i = 0; i < MonthPrint.length; i++) {
        MonthInfo[i] = [
          MonthPrint[i],
          NewmSmdPrint[i].toFixed(6),
          "",
          "",
          "",
          "",
          ""
        ];
      }
    } else if (Type > 1 && Node) {
      for (let i = 0; i < MonthPrint.length; i++) {
        MonthInfo[i] = [
          MonthPrint[i],
          NewmSdPrint[i].toFixed(6),
          NewmAnoAccumPrint[i].toFixed(6),
          NewmNodeAccumPrint[i].toFixed(6),
          SyzygySdPrint[i].toFixed(6),
          SyzygyAnoAccumPrint[i].toFixed(6),
          SyzygyNodeAccumPrint[i].toFixed(6)
        ];
      }
    }
    if (Type < 13) {
      const step = [];
      let NewmIntLong = NewmInt.concat(NextYear.NewmInt);
      NewmIntLong = Array.from(new Set(NewmIntLong));
      for (let i = 0; i < 18; i++) {
        step[i] = NewmIntLong[i + 1] - NewmIntLong[i];
      }
      // const checkStep = (num, time, array) => array.reduce(function (p, c) { c === num ? p + 1 : (p < time ? 0 : p) }, 0) >= time
      // const sdfsdg = checkStep(30, 2, [30, 29, 30, 30, 30])
      let tmp30 = 0,
        tmp29 = 0;
      for (let i = 0; i < step.length - 1; i++) {
        if (
          step[i] === 30 &&
          step[i + 1] === 30 &&
          step[i + 2] === 30 &&
          step[i + 3] === 30
        ) {
          tmp30 = 4;
          break;
        }
      }
      for (let i = 0; i < step.length - 1; i++) {
        if (step[i] === 29 && step[i + 1] === 29 && step[i + 2] === 29) {
          tmp29 = 3;
          break;
        }
      }
      if (tmp30 === 4) YearInfo.push({ step30: "四連大" });
      if (tmp29 === 3) YearInfo.push({ step30: "三連小" });
    }
    return {
      Era,
      YearInfo,
      EcliInfo,
      MonthInfo,
      MonthPrint,
      NewmAvgScPrint,
      NewmAvgDeciPrint,
      NewmScPrint,
      NewmDeci3Print,
      NewmDeci2Print,
      NewmDeci1Print,
      NewmNowlineDeciPrint,
      NewmAcrDeciPrint,
      NewmEclpPrint,
      NewmEquaPrint,
      SyzygyScPrint,
      SyzygyNowlineDeciPrint,
      SyzygyDeciPrint,
      TermUpNamePrint,
      TermUpScPrint,
      TermUpDeciPrint,
      TermUpAcrScPrint,
      TermUpAcrDeciPrint,
      TermUpNowDeciPrint,
      TermUpEclpPrint,
      TermUpEquaPrint,
      TermDownNamePrint,
      TermDownScPrint,
      TermDownDeciPrint,
      TermDownAcrScPrint,
      TermDownAcrDeciPrint,
      TermDownNowDeciPrint,
      TermDownEclpPrint,
      TermDownEquaPrint,
      ////////////// 曆書
      LeapNumTerm,
      SolsAccum,
      Sols,
      NewmInt, // 結尾就不切了，因爲最後一個月還要看下個月的情況
      NewmRaw:
        Type === 1
          ? NewmSlice(ThisYear.NewmAvgRaw)
          : Type >= 13
            ? []
            : NewmSlice(ThisYear.NewmRaw),
      NewmAcrRaw: ThisYear.NewmAcrRaw ? NewmSlice(ThisYear.NewmAcrRaw) : [], // 這個是給南系月亮位置用的，平朔注曆，但是月亮位置是定朔
      NewmAvgRaw: ThisYear.NewmAvgRaw ? NewmSlice(ThisYear.NewmAvgRaw) : [],
      // NewmAcrInt: (Type === 1 ? [] : NewmSlice(ThisYear.NewmAcrInt)),
      NewmNodeAccumPrint, // : (Type === 1 ? [] : NewmNodeAccumPrint.slice(NewmStart)), // 為什麼還要切一遍？？
      NewmNodeAccumMidnPrint,
      NewmAnoAccumPrint, //: (Type === 1 ? [] : NewmAnoAccumPrint.slice(NewmStart))
      NewmAnoAccumMidnPrint,
      // 時憲曆曆書
      SolsmorScOrder: Type === 13 ? ThisYear.SolsmorScOrder : undefined,
      MansDaySolsmor: Type === 13 ? ThisYear.MansDaySolsmor : undefined,
      SunRoot: Type === 13 ? ThisYear.SunRoot : undefined,
      SperiRoot: Type === 13 ? ThisYear.SperiRoot : undefined,
      MoonRoot: Type === 13 ? ThisYear.MoonRoot : undefined,
      MapoRoot: Type === 13 ? ThisYear.MapoRoot : undefined,
      NodeRoot: Type === 13 ? ThisYear.NodeRoot : undefined,
      NewmSmd: Type === 13 ? ThisYear.NewmSmd.slice(1 + NewmStart) : undefined
    };
  };
  Memo[0] = AutoNewm(Name, YearStart - 1); // 去年
  Memo[1] = AutoNewm(Name, YearStart); // 今年
  const result = [];
  YearEnd = YearEnd === undefined ? YearStart : YearEnd;
  for (let Y = YearStart; Y <= YearEnd; Y++) {
    Memo[2] = AutoNewm(Name, Y + 1); // 明年
    result.push(calculate(Y));
    Memo[0] = Memo[1]; // 数组滚动，避免重复运算
    Memo[1] = Memo[2];
  }

  return result;
};
// console.log(Index("Shoushi", -600));
