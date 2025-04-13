import { ScList } from "../parameter/constants.mjs";
import Para from "../parameter/calendars.mjs";
import { mans } from "../astronomy/mans.mjs";
import { deci, fm60, fmod } from "../parameter/functions.mjs";

export default (Name, Y) => {
  // function a(Name, Y) {
  const {
    Lunar,
    Solar,
    SolsOriginDif,
    OriginAd,
    OriginYearSc,
    BuScConst,
    ZhengNum,
    OriginMonNum,
    YuanRange,
    TongRange,
    EcliRange,
    EcliNumer,
    MansRaw
  } = Para[Name];
  let { JiRange, BuRange, SolsConst, DayConst } = Para[Name];
  if (Name === "Taichu") {
    JiRange = YuanRange;
    BuRange = TongRange;
  }
  SolsConst = SolsConst || 0;
  DayConst = DayConst || 0;
  const BuSkip = ["Qianzaodu", "Yuanmingbao"].includes(Name)
    ? (365.25 * BuRange) % 60
    : (Solar * BuRange) % 60;
  const TermLeng = Solar / 12; // 每個中氣相隔的日數
  const ZhengSd = ZhengNum - OriginMonNum; // 年首和正月的差
  let OriginYear = Y - OriginAd; // 上元積年（算上）
  const JupiterSc =
    Name === "Taichu"
      ? ScList[
          (Math.trunc(((OriginYear % 1728) * 145) / 144) + OriginYearSc) % 60
        ]
      : ""; // 三統曆太歲
  const JiOrder = Math.trunc((OriginYear % YuanRange) / JiRange); // 入第幾紀
  const BuYear = (((OriginYear % YuanRange) % JiRange) % BuRange) + 1; // 入蔀（統）第幾年
  const BuOrder = Math.trunc(((OriginYear % YuanRange) % JiRange) / BuRange); // 入第幾蔀（統）
  const BuScOrder = (1 + BuOrder * BuSkip + (BuScConst || 0)) % 60; // 蔀（統）的干支序號
  const SolsAccumRaw = fmod(
    (BuYear - 1) * Solar +
      (SolsOriginDif || 0) * TermLeng +
      SolsConst +
      DayConst,
    27759
  ); // 冬至積日
  const SolsAccumMod = fm60(SolsAccumRaw);
  const SolsAccum = SolsAccumRaw - (SolsOriginDif || 0) * TermLeng; // 曆元積日
  let SolsOriginMon = 0;
  if (SolsOriginDif) SolsOriginMon = (SolsOriginDif * TermLeng) / Lunar;
  const LeapSurAvg = parseFloat(
    (
      (((deci(((BuYear - 1) * 7) / 19) + SolsOriginMon) % 1) + 1) %
      1
    ).toPrecision(11)
  ); // 今年閏餘
  let isLeapAvg = LeapSurAvg >= parseFloat((12 / 19).toPrecision(11)); // 是否有閏月
  let LeapNumAvg = isLeapAvg
    ? Math.trunc(parseFloat((((1 - LeapSurAvg) * 228) / 7).toPrecision(12)))
    : 0; // 閏餘法今年閏月
  // 閏餘法閏月
  const LeapNumOriginLeapSur = LeapNumAvg
    ? Math.round((((LeapNumAvg + ZhengSd + 12) % 12) + 12) % 12.1)
    : 0;
  // 朔望
  const NewmAvgBare = [],
    NewmAvgRaw = [],
    NewmInt = [],
    NewmAvgSc = [],
    NewmSd = [],
    NewmAvgDeci = [],
    NewmEqua = [],
    SyzygyAvgRaw = [],
    SyzygyAvgMod = [],
    SyzygyOrderMod = [],
    SyzygyDeci = [];
  let SyzygySc = [];
  for (let i = 0; i <= 14; i++) {
    // 本來是1
    NewmAvgBare[i] = parseFloat(
      (
        (Math.trunc(((BuYear - 1) * 235) / 19) + ZhengNum + i - 1) * Lunar +
        SolsConst +
        DayConst
      ).toPrecision(14)
    );
    if (NewmAvgBare[i] < 0) NewmAvgBare[i] += 27759; // 和fmod(SolsAccumRaw)一樣，都是應對十月顓頊蔀首
    NewmAvgRaw[i] = NewmAvgBare[i] + BuScOrder;
    NewmInt[i] = Math.trunc(NewmAvgRaw[i]);
    NewmAvgSc[i] = ScList[fm60(NewmInt[i])];
    NewmAvgDeci[i] = (NewmAvgRaw[i] - NewmInt[i]).toFixed(4).slice(2, 6);
    NewmSd[i] = NewmAvgBare[i] - SolsAccumRaw;
    if (MansRaw) NewmEqua[i] = mans(Name, Y, NewmSd[i]).Equa;
    // NewmJd[i] = Math.round(parseFloat((JdOrigin + (Math.trunc((Math.round(parseFloat((JdSols + Y * Solar).toPrecision(14))) - JdOrigin) / Lunar) + ZhengNum + i - 1) * Lunar).toPrecision(14)))
    SyzygyAvgRaw[i] =
      parseFloat(
        (
          (Math.trunc(((BuYear - 1) * 235) / 19 + SolsOriginMon) +
            ZhengNum +
            i -
            0.5) *
            Lunar +
          SolsConst
        ).toPrecision(14)
      ) + BuScOrder;
    SyzygyAvgMod[i] = fm60(SyzygyAvgRaw[i]);
    SyzygyOrderMod[i] = Math.trunc(SyzygyAvgMod[i]);
    SyzygySc[i] = ScList[SyzygyOrderMod[i]];
    SyzygyDeci[i] = (SyzygyAvgMod[i] - SyzygyOrderMod[i])
      .toFixed(4)
      .slice(2, 6);
  }
  // 月食
  let EcliAccum = 0;
  if (EcliNumer) {
    EcliAccum =
      EcliRange *
      deci(((OriginYear % EcliNumer) * (Solar / Lunar)) / EcliRange);
    for (let k = 1; k <= 3; k++) {
      SyzygySc[Math.trunc(EcliRange * k - EcliAccum)] += "◐";
    } // 四分要看具體時刻，如果在晝則望，在夜則望前一日
  }
  // 中氣
  let LeapNumTerm = LeapNumAvg;
  const TermInt = [],
    TermSc = [],
    TermDeci = [],
    TermEqua = [],
    TermEclp = [],
    Term1Int = [],
    Term1Sc = [],
    Term1Deci = [],
    Term1Equa = [],
    Term1Eclp = [];
  for (let i = 1; i <= 13; i++) {
    const TermBare = SolsAccumRaw + (i + ZhengNum - 1) * TermLeng;
    const TermRaw = TermBare + BuScOrder;
    TermInt[i] = Math.trunc(TermRaw);
    const TermMod = fm60(TermRaw);
    const TermOrderMod = Math.trunc(TermMod);
    TermSc[i] = ScList[TermOrderMod];
    TermDeci[i] = (TermMod - TermOrderMod).toFixed(4).slice(2, 6);
    const Term1Bare = SolsAccumRaw + (i + ZhengNum - 1.5) * TermLeng;
    const Term1Raw = Term1Bare + BuScOrder;
    Term1Int[i] = Math.trunc(Term1Raw);
    const Term1Mod = fm60(Term1Raw);
    const Term1OrderMod = Math.trunc(Term1Mod);
    Term1Sc[i] = ScList[Term1OrderMod];
    Term1Deci[i] = (Term1Mod - Term1OrderMod).toFixed(4).slice(2, 6);
    if (MansRaw) {
      const Func = mans(Name, Y, TermBare - SolsAccumRaw);
      const Func1 = mans(Name, Y, Term1Bare - SolsAccumRaw); // 這裏省略了紀元等提到的今年次年黃赤道差之差
      TermEqua[i] = Func.Equa;
      TermEclp[i] = Func.Eclp;
      Term1Equa[i] = Func1.Equa;
      Term1Eclp[i] = Func1.Eclp;
    }
  }
  for (let i = 1; i <= 12; i++) {
    if (TermInt[i] < NewmInt[i + 1] && TermInt[i + 1] >= NewmInt[i + 2]) {
      LeapNumTerm = i; // 閏Leap月，第Leap+1月爲閏月
      break;
    }
  }
  return {
    OriginYear,
    JiOrder,
    BuYear,
    BuScOrder,
    JupiterSc,
    SolsAccumMod,
    SolsAccum,
    NewmAvgBare,
    NewmAvgRaw,
    NewmInt,
    NewmAvgSc,
    NewmAvgDeci,
    SyzygySc,
    SyzygyDeci,
    TermSc,
    TermDeci,
    TermEqua,
    TermEclp,
    Term1Int,
    Term1Sc,
    Term1Deci,
    Term1Equa,
    Term1Eclp,
    LeapSurAvg,
    LeapNumOriginLeapSur,
    LeapNumTerm,
    NewmEqua
  };
};
// console.log(a("Yin", -9));
