import Para from "../parameter/calendars.mjs";
import { ScList } from "../parameter/constants.mjs";
import { AutoDifAccum, AutoTcorr } from "../astronomy/acrv.mjs";
import { mans } from "../astronomy/mans.mjs";
import { newmPlus, syzygySub } from "../astronomy/dayadjust.mjs";
import { abs, deci, fix, fmod, fm60 } from "../parameter/functions.mjs";

// const cal = (Name, Y) => {
export default (Name, Y) => {
  const {
    Type,
    isAcr,
    isNewmPlus,
    SolarNumer,
    LunarNumer,
    Denom,
    Anoma,
    Node,
    AcrTermList,
    OriginAd,
    CloseOriginAd,
    EpochSolsDif,
    FirstNum,
    YuanRange,
    JiRange,
    ZhangRange,
    ZhangLeap,
    YinyangConst,
    EcliConst,
    MansRaw
  } = Para[Name];
  let {
    Solar,
    SolarRaw,
    Lunar,
    LunarRaw,
    ScConst,
    NodeConst,
    FirstConst,
    AnomaConst,
    SolsConst
  } = Para[Name];
  ScConst = ScConst || 0;
  SolarRaw = SolarRaw || Solar;
  LunarRaw = LunarRaw || Lunar;
  FirstConst = FirstConst || 0;
  NodeConst = NodeConst || 0;
  AnomaConst = Type === 11 ? AnomaConst : AnomaConst / Denom || 0;
  SolsConst = SolsConst || 0;
  const isExcl = Type >= 4 ? 1 : 0;
  const ZhangMon = Math.round(ZhangRange * (12 + ZhangLeap / ZhangRange));
  // const JiMon = JiRange * ZhangMon / ZhangRange
  const EpochNum = EpochSolsDif ? Math.ceil(EpochSolsDif) : 0; // 立春历元历法固定以建寅月立春为历元
  const FirstEpochDif = FirstNum - EpochNum;
  const OriginYear = Y - (OriginAd || CloseOriginAd); // 上元積年（算上）
  // const CloseSd = CloseOriginAd - OriginAd // 統天距算
  const CloseOriginYear = Y - CloseOriginAd; // 距差。授時以1280開始
  const CloseOriginYearAbs = abs(CloseOriginYear);
  let SolarChangeAccum = 0,
    LunarChangeAccum = 0,
    LeapSurAvg = 0,
    OriginAccum = 0;
  // 統天躔差=斗分差/10000*距差
  const signX = CloseOriginYear > 0 ? 1 : -1;
  if (Name === "Tongtian") {
    // 藤豔輝頁70、《中國古代曆法》第610頁。如果不算消長的話就完全不對，因爲上元積年就考慮了消長
    SolarChangeAccum = (signX * 0.0127 * CloseOriginYear ** 2) / Denom; // 加在冬至上的歲實消長
    // Solar = SolarRaw // - .021167 * CloseOriginYear / Denom
    // Lunar = CloseOriginYear ? (SolarRaw + SolarChangeAccum / CloseOriginYear - 10.5 / Denom) / (SolarRaw / LunarRaw) : LunarRaw
    LunarChangeAccum = (-10.5 * CloseOriginYear) / Denom;
  } else if (["Shoushi", "Shoushi2"].includes(Name)) {
    // Solar = parseFloat((SolarRaw - (Math.trunc((CloseOriginYear + 1) / 100) / 10000)).toPrecision(10))
    Solar = +(
      SolarRaw -
      Math.trunc((CloseOriginYear + 1) / 100) * 0.0001
    ).toFixed(4);
  } else if (Name === "Wannian") {
    // 置曆元所距年積算為汎距，來加往減元紀為定距，以朞實乘之，四約，為積日，不滿，退除為刻，是名汎積。定距自相乘，七之八而一，所得滿百萬為日，不滿為刻及分秒，〔帶半秒已上者收作一秒〕是名節氣歲差，用減汎積，餘為定積。
    // Solar = parseFloat((SolarRaw - (Y - 1281) * 1.75 * 1e-6).toPrecision(10))
    SolarChangeAccum = signX * 8.75 * 1e-7 * (Y - 1281) ** 2;
  }
  const TermLeng = Solar / 12; // 每個中氣相隔的日數
  if (EcliConst) {
    NodeConst = Name === "Yuanjia" ? Node * EcliConst : (Node / 2) * EcliConst;
  }
  const SynodicAnomaDif = Lunar - Anoma;
  const SynodicNodeDif50 = (Lunar - Node) / 2;
  let JiSkip = 0,
    JiOrder = 0,
    JiYear = 0,
    JiScOrder = 0;
  if (JiRange) {
    JiSkip = Math.round((Solar * JiRange) % 60);
    JiOrder = Math.trunc((OriginYear % YuanRange) / JiRange); // 入第幾紀
    JiYear = ((OriginYear % YuanRange) % JiRange) + 1; // 入紀年
    JiScOrder = (1 + JiOrder * JiSkip) % 60;
  }
  let fixed = 4; // 試出來的OriginAccum能保留幾位小數
  if (Type === 11)
    fixed = 10; // 大統通軌最多有10位
  else if (OriginYear > 8.5 * 1e7) {
  } else if (OriginYear > 8.5 * 1e6) fixed = 5;
  else fixed = 6;
  // const WannianDingju = CloseOriginYear => {
  //     const Dingju = CloseOriginYear + 4560 // 定距
  //     const OriginAccum = Dingju * 365.25 - Dingju ** 2 * 8.75 * 1e-7
  //     return OriginAccum
  // }
  const ZoneDif = Name === "Gengwu" ? (20000 * 0.04359) / Denom : 0; // 里差
  let SolsAccum =
    Type < 11 ? OriginYear * Solar + SolsConst + ZoneDif + SolarChangeAccum : 0;
  SolsAccum = +SolsAccum.toFixed(fixed);
  if (ZhangRange) {
    LeapSurAvg = (OriginYear * ZhangMon) % ZhangRange; // 今年閏餘
  } else if (Type < 8) {
    LeapSurAvg = (OriginYear * SolarNumer) % LunarNumer; // OriginYear * SolarNumer爲期總
  } else if (Type < 11) {
    LeapSurAvg = fmod(SolsAccum + FirstConst, LunarRaw);
  } else if (Type === 11) {
    OriginAccum = CloseOriginYearAbs * Solar + SolarChangeAccum; // 「置所求距算，以岁实乘之，为中积。」SolarChangeAccum针对《圣寿万年》
    SolsAccum =
      Y >= CloseOriginAd ? OriginAccum + SolsConst : OriginAccum - SolsConst; // 通積：該年冬至積日。「加气应，为通积。满旬周去之，不尽，以日周约之为日，不满为分。其日命甲子算外，即所求天正冬至日辰及分。（如上考者，以气应减中积，满旬周去之，不尽，以减旬周。余同上。）」
    SolsAccum = Y >= CloseOriginAd ? fm60(SolsAccum) : 60 - fm60(SolsAccum); // 這個是冬至，直接用SolsAccum替換了，查了下曆經全文，此後的計算不再用到通積
    const LeapAccum =
      Y >= CloseOriginAd ? OriginAccum + FirstConst : OriginAccum - FirstConst; // 「置中积，加闰应，为闰积。」
    LeapSurAvg =
      Y >= CloseOriginAd
        ? fmod(LeapAccum, Lunar)
        : Lunar - fmod(LeapAccum, Lunar); // 閏餘：冬至月齡「满朔实去之，不尽，为闰余。（上考者，以闰应减中积，满朔实去之，不尽，以减朔实，为闰余。）」
  }
  const SolsDeci = deci(SolsAccum); //.toFixed(fixed)
  let FirstAccum = 0,
    FirstAnoAccum = 0,
    FirstNodeAccum = 0;
  if (ZhangRange) {
    FirstAccum = Math.floor((OriginYear * ZhangMon) / ZhangRange) * Lunar;
  } else if (Type < 8) {
    FirstAccum = SolsAccum - LeapSurAvg / Denom;
  } else {
    FirstAccum = SolsAccum - LeapSurAvg + LunarChangeAccum; // 授時「以日周约之为日，不满为分，以减冬至日及分，不及减者，加纪法减之，命如上。」卽使FirstAccum是負數也不影響，因為正月已經加了兩個月了。
  }
  FirstAccum += ZoneDif;
  // 天正入交
  if (Node && Type < 11) {
    FirstNodeAccum =
      (FirstAccum +
        NodeConst +
        (YinyangConst === -1 ? Node / 2 : 0) +
        ZoneDif / 18) %
      Node;
  } else if (Type >= 11) {
    FirstNodeAccum =
      Y >= CloseOriginAd
        ? fmod(OriginAccum + NodeConst - LeapSurAvg, Node)
        : Node - fmod(OriginAccum - NodeConst + LeapSurAvg, Node);
  }
  // 天正入转
  if (Type <= 10) {
    FirstAnoAccum = fmod(
      FirstAccum + AnomaConst + (Name === "Shenlong" ? Anoma / 2 : 0),
      Anoma
    );
  } else if (Type === 11) {
    FirstAnoAccum =
      Y >= CloseOriginAd
        ? fmod(OriginAccum + AnomaConst - LeapSurAvg, Anoma)
        : Anoma - fmod(OriginAccum - AnomaConst + LeapSurAvg, Anoma);
  }
  FirstAccum = +FirstAccum.toFixed(fixed);
  FirstAnoAccum = +FirstAnoAccum.toFixed(fixed);
  FirstNodeAccum = +FirstNodeAccum.toFixed(fixed);
  let LeapLimit = 0;
  if (ZhangRange) {
    LeapLimit = ZhangRange - ZhangLeap;
  } else if (Type <= 7) {
    LeapLimit = 13 * LunarNumer - SolarNumer;
  } else {
    LeapLimit = 13 * Lunar - Solar;
  }
  const main = (isNewm) => {
    const AvgRaw = [],
      AvgInt = [],
      AvgSc = [],
      AvgDeci = [],
      TermAcrRaw = [],
      TermAcrSd = [],
      TermAvgRaw = [],
      TermAvgSd = [],
      Term1AvgRaw = [],
      Term1AvgSd = [],
      Term1Sc = [],
      Term1Deci = [],
      Term1AcrRaw = [],
      Term1AcrSd = [],
      Term1AcrSc = [],
      Term1AcrDeci = [],
      Term1Equa = [],
      Term1Eclp = [],
      TermSc = [],
      TermDeci = [],
      TermAcrSc = [],
      TermAcrDeci = [],
      TermEqua = [],
      TermEclp = [],
      AnoAccum = [],
      AnoAccumMidn = [],
      NodeAccum = [],
      NodeAccumMidn = [],
      AcrInt = [],
      Int = [],
      Raw = [],
      Tcorr = [],
      AcrRaw = [],
      Sc = [],
      Deci1 = [],
      Deci2 = [],
      Deci3 = [],
      Deci = [],
      Sd = [],
      AcrSd = [],
      Eclp = [],
      Equa = [];
    for (let i = 0; i <= 14; i++) {
      AvgRaw[i] = +(
        FirstAccum +
        (FirstEpochDif + i - (isNewm ? 1 : 0.5)) * Lunar
      ).toFixed(fixed);
      AvgInt[i] = Math.floor(AvgRaw[i]);
      AvgSc[i] = ScList[fm60(AvgInt[i] + 1 + ScConst)];
      AvgDeci[i] = deci(AvgRaw[i]);
      Sd[i] =
        (FirstEpochDif + i - (isNewm ? 1 : 0.5)) * Lunar +
        FirstAccum -
        SolsAccum;
      let Tcorr1 = 0;
      if (Anoma) {
        AnoAccum[i] = +(
          (FirstAnoAccum +
            (FirstEpochDif + i - 1) * SynodicAnomaDif +
            (isNewm ? 0 : Lunar / 2)) %
          Anoma
        ).toFixed(fixed); // 上元積年幾千萬年，精度只有那麼多了，再多的話誤差更大
        AnoAccumMidn[i] = AnoAccum[i] - AvgDeci[i];
        const TcorrBindFunc = AutoTcorr(AnoAccum[i], Sd[i], Name);
        if (Type <= 4) {
          Tcorr[i] = TcorrBindFunc.Tcorr1;
          Tcorr1 = Tcorr[i];
        } else if (Type < 11) {
          Tcorr[i] = TcorrBindFunc.Tcorr2;
          Tcorr1 = TcorrBindFunc.Tcorr1;
        } else Tcorr[i] = TcorrBindFunc.Tcorr2; // Type === 11
        AcrRaw[i] = AvgRaw[i] + Tcorr[i];
        if (Math.floor(AcrRaw[i]) > Math.floor(AvgRaw[i])) {
          // 定朔入轉同經朔，若定朔大餘有變化，則加減一整日。變的應該是夜半，而非加時
          AnoAccumMidn[i]++;
        } else if (Math.floor(AcrRaw[i]) < Math.floor(AvgRaw[i])) {
          AnoAccumMidn[i]--;
        }
        AcrInt[i] = Math.floor(AcrRaw[i]);
        if (Type <= 4) {
          Deci[i] = deci(AcrRaw[i]);
          Deci1[i] = Deci[i];
        } else if (Type < 11) {
          Deci[i] = deci(AcrRaw[i]);
          Deci2[i] = Deci[i];
          if (Tcorr1) Deci1[i] = deci(AvgRaw[i] + Tcorr1);
        } else if (Type === 11) {
          Deci[i] = deci(AcrRaw[i]);
          Deci3[i] = Deci[i];
        }
      } else Deci[i] = AvgDeci[i];
      AcrSd[i] = Sd[i] + Tcorr[i]; // 授時：定朔入曆=經朔入盈缩历+加減差
      let NewmPlus = 0,
        SyzygySub = 0;
      if (isNewm) {
        if (isAcr && isNewmPlus) {
          NewmPlus = newmPlus(Deci1[i] || Deci[i], Sd[i], SolsDeci, Name); // 進朔
        }
        if (MansRaw) {
          const Func = mans(
            Name,
            Y,
            AcrSd[i] + AutoDifAccum(0, AcrSd[i], Name).SunDifAccum
          );
          Equa[i] = Func.Equa; // 授時：定朔加時定積度=定朔加時中積（即定朔入曆）+盈縮差
          Eclp[i] = Func.Eclp;
        }
        TermAvgSd[i] = (i + FirstEpochDif - 1) * TermLeng;
        TermAvgRaw[i] = SolsAccum + TermAvgSd[i];
        const tmp = fm60(TermAvgRaw[i] + isExcl + ScConst);
        TermSc[i] = ScList[Math.trunc(tmp)];
        TermDeci[i] = fix(deci(tmp));
        Term1AvgSd[i] = (i + FirstEpochDif - 1.5) * TermLeng;
        Term1AvgRaw[i] = SolsAccum + Term1AvgSd[i];
        const tmp1 = fm60(Term1AvgRaw[i] + isExcl + ScConst);
        Term1Sc[i] = ScList[Math.trunc(tmp1)];
        Term1Deci[i] = fix(deci(tmp1));
        if (Type >= 5 && AcrTermList) {
          // 定中氣
          const TermNum3 = 2 * (i + FirstEpochDif - 1);
          let Plus = 0;
          if (TermNum3 >= 24) Plus = Solar;
          else if (TermNum3 < 0) Plus = -Solar;
          TermAcrSd[i] = AcrTermList[(TermNum3 + 24) % 24] + Plus;
          TermAcrRaw[i] = SolsAccum + TermAcrSd[i]; // 定氣距冬至+中積
          const tmp2 = fm60(TermAcrRaw[i] + isExcl + ScConst);
          TermAcrSc[i] = ScList[Math.trunc(tmp2)];
          TermAcrDeci[i] = fix(deci(tmp2), 3);
          // 定節氣
          const TermNum2 = 2 * (i + FirstEpochDif - 1) - 1;
          let Plus1 = 0;
          if (TermNum2 >= 24) Plus1 = Solar;
          else if (TermNum2 < 0) Plus1 = -Solar;
          Term1AcrSd[i] = AcrTermList[(TermNum2 + 24) % 24] + Plus1;
          Term1AcrRaw[i] = SolsAccum + Term1AcrSd[i]; // 定氣距冬至+中積
          const tmp3 = fm60(Term1AcrRaw[i] + isExcl + ScConst);
          Term1AcrSc[i] = ScList[Math.trunc(tmp3)];
          Term1AcrDeci[i] = fix(deci(tmp3), 3);
        }
        if (MansRaw) {
          const Func = mans(Name, Y, TermAvgSd[i]);
          const Func1 = mans(Name, Y, Term1AvgSd[i]); // 這裏省略了紀元等提到的今年次年黃赤道差之差
          TermEqua[i] = Func.Equa;
          TermEclp[i] = Func.Eclp;
          Term1Equa[i] = Func1.Equa;
          Term1Eclp[i] = Func1.Eclp;
        }
      } else {
        SyzygySub = syzygySub(Deci[i], Sd[i], SolsDeci, Name); // 退望
      }
      Int[i] = isAcr ? AcrInt[i] : AvgInt[i];
      Raw[i] = isAcr ? AcrRaw[i] : AvgRaw[i];
      Int[i] += NewmPlus + SyzygySub; // 這裏int是二次內插的結果，但線性與二次分屬兩日的極端情況太少了，暫且不論
      Raw[i] += NewmPlus + SyzygySub;
      AcrInt[i] += NewmPlus + SyzygySub;
      AnoAccumMidn[i] += NewmPlus;
      if (isNewm) {
        if (Tcorr[i]) {
          Sc[i] =
            ScList[fm60(AcrInt[i] + ScConst + 1)] + (NewmPlus === 1 ? "+" : "");
        }
      } else {
        if (Tcorr[i]) {
          Sc[i] =
            ScList[fm60(AcrInt[i] + ScConst + 1)] +
            (SyzygySub === -1 ? "-" : "");
        } else {
          Sc[i] = AvgSc[i];
        }
      }
      if (Node) {
        NodeAccum[i] = +(
          (FirstNodeAccum +
            (FirstEpochDif + i - 1) * Lunar +
            (isNewm ? 0 : SynodicNodeDif50)) %
          Node
        ).toFixed(fixed);
        NodeAccumMidn[i] = NodeAccum[i] - AvgDeci[i];
      }
      NodeAccumMidn[i] += NewmPlus;
    }
    let LeapNumTerm = 0;
    //////// 置閏
    if (isNewm) {
      const NewmSd = isAcr ? AcrSd : Sd;
      for (let i = 1; i <= 12; i++) {
        if (
          Math.trunc(TermAvgSd[i] + SolsDeci) <
            Math.trunc(NewmSd[i + 1] + SolsDeci) &&
          Math.trunc(TermAvgSd[i + 1] + SolsDeci) >=
            Math.trunc(NewmSd[i + 2] + SolsDeci)
        ) {
          LeapNumTerm = i; // 閏Leap月，第Leap+1月爲閏月
          break;
        }
      }
    }
    return {
      AvgSc,
      Tcorr,
      AvgDeci,
      Int,
      Raw,
      Sc,
      AcrInt,
      AcrRaw,
      AvgRaw,
      Deci,
      Deci1,
      Deci2,
      Deci3,
      Equa,
      Eclp,
      Term1Sc,
      Term1AvgSd,
      Term1Deci,
      Term1AcrSc,
      Term1AcrDeci,
      Term1Equa,
      Term1Eclp,
      TermSc,
      TermDeci,
      TermAcrSc,
      TermAcrDeci,
      TermEqua,
      TermEclp,
      LeapNumTerm,
      /// 交食用到
      NodeAccum,
      NodeAccumMidn,
      AnoAccum,
      AnoAccumMidn,
      Sd,
      AcrSd
    };
  };
  const {
    Tcorr: NewmTcorr,
    AvgSc: NewmAvgSc,
    AvgDeci: NewmAvgDeci,
    Int: NewmInt,
    Raw: NewmRaw,
    AcrInt: NewmAcrInt,
    AcrRaw: NewmAcrRaw,
    AvgRaw: NewmAvgRaw,
    Sc: NewmSc,
    Deci: NewmDeci, // 最精確的那個數字
    Deci1: NewmDeci1,
    Deci2: NewmDeci2,
    Deci3: NewmDeci3,
    Equa: NewmEqua,
    Eclp: NewmEclp,
    Term1Sc,
    Term1AvgSd,
    Term1Deci,
    Term1AcrSc,
    Term1AcrDeci,
    Term1Equa,
    Term1Eclp,
    TermSc,
    TermDeci,
    TermAcrSc,
    TermAcrDeci,
    TermEqua,
    TermEclp,
    LeapNumTerm,
    ///// 交食
    NodeAccum: NewmNodeAccum,
    AnoAccum: NewmAnoAccum,
    Sd: NewmSd,
    NodeAccumMidn: NewmNodeAccumMidn,
    AnoAccumMidn: NewmAnoAccumMidn,
    AcrSd: NewmAcrSd
  } = main(true);
  const {
    Sc: SyzygySc,
    Deci: SyzygyDeci,
    AvgDeci: SyzygyAvgDeci,
    NodeAccum: SyzygyNodeAccum,
    AnoAccum: SyzygyAnoAccum,
    Sd: SyzygySd,
    AcrSd: SyzygyAcrSd
  } = main(false);
  const LeapSurAcr = ZhangRange
    ? (LeapSurAvg - (NewmTcorr[1] * ZhangRange) / Lunar + ZhangRange) %
      ZhangRange
    : LeapSurAvg - NewmTcorr[1];
  return {
    LeapLimit,
    OriginYear,
    JiYear,
    JiScOrder,
    SolsAccum,
    NewmAvgSc,
    NewmAvgDeci,
    NewmSc,
    NewmInt,
    NewmRaw,
    NewmAcrRaw,
    NewmAvgRaw,
    NewmAcrInt,
    NewmDeci1,
    NewmDeci2,
    NewmDeci3,
    SyzygySc,
    Term1Sc,
    Term1AvgSd,
    Term1Deci,
    Term1AcrSc,
    Term1AcrDeci,
    Term1Equa,
    Term1Eclp,
    TermSc,
    TermDeci,
    TermAcrSc,
    TermAcrDeci,
    TermEqua,
    TermEclp,
    LeapSurAvg,
    LeapSurAcr,
    LeapNumTerm,
    NewmEqua,
    NewmEclp,
    //////// 交食用
    SolsDeci,
    NewmNodeAccum,
    NewmNodeAccumMidn,
    NewmAnoAccum,
    NewmAnoAccumMidn,
    NewmDeci,
    NewmSd,
    NewmAcrSd,
    SyzygyNodeAccum,
    SyzygyAnoAccum,
    SyzygyDeci,
    SyzygyAvgDeci,
    SyzygySd,
    SyzygyAcrSd
  };
};
// console.log(cal("Shoushi", 1281));
