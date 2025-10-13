import { ScList } from "../parameter/constants.mjs";
import Para from "../parameter/calendars.mjs";
import { mans } from "../astronomy/mans.mjs";
import { deci, fm60, fmod, fmod1 } from "../parameter/functions.mjs";

export default (Name, Y) => {
  // function a(Name, Y) {
  const {
    Lunar,
    Solar,
    EpochSolsDif,
    OriginAd,
    OriginYearSc,
    BuScConst,
    FirstNum,
    ZhengNum,
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
  const EpochNum = EpochSolsDif ? Math.ceil(EpochSolsDif) : 0; // 立春历元历法固定以建寅月立春为历元
  const FirstEpochDif = FirstNum - EpochNum; // 年首和历元的月份差，用于每月计算
  const FirstZhengDif = FirstNum - ZhengNum; // 年首和正月的月份差，用于月名改正
  // const isJieEpoch = EpochSolsDif
  //   ? Math.floor(EpochSolsDif) !== EpochSolsDif
  //   : false; // 是否以节（立春）为历元
  const BuDays = ["Qianzaodu", "Yuanmingbao"].includes(Name)
    ? 365.25 * BuRange
    : Solar * BuRange;
  const TermLeng = Solar / 12; // 每個中氣相隔的日數
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
  const BuScOrder = (1 + BuOrder * BuDays + (BuScConst || 0)) % 60; // 蔀（統）的干支序號
  const SolsAccumRaw =
    (BuYear - 1) * Solar -
    (EpochSolsDif || 0) * TermLeng +
    SolsConst +
    DayConst; // 冬至積日
  const SolsAccumMod = fm60(SolsAccumRaw);
  const SolsAccum = fmod(SolsAccumRaw + (EpochSolsDif || 0) * TermLeng, BuDays); // 曆元積日
  const LeapSurAvg = ((BuYear - 1) * 235) % 19; // 今年閏餘
  let isLeapAvg = LeapSurAvg >= 12; // 是否有閏月
  let LeapNumAvg = isLeapAvg ? Math.trunc(((19 - LeapSurAvg) * 12) / 7) : 0; // 閏餘法今年閏月
  // 閏餘法閏月
  const LeapNumOriginLeapSur = LeapNumAvg
    ? fmod1(LeapNumAvg + FirstZhengDif - FirstEpochDif, 12) // 0->12
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
    SyzygyDeci = [],
    TermRaw = [];
  let SyzygySc = [];
  let TermInt = [],
    TermSc = [],
    TermDeci = [],
    TermEqua = [],
    TermEclp = [],
    Term1Int = [],
    Term1Sc = [],
    Term1Deci = [],
    Term1Equa = [],
    Term1Eclp = [];
  const chooseTrunc = (x) =>
    Name === "Chenhouyao" ? Math.ceil(x) : Math.trunc(x);
  for (let i = 0; i <= 14; i++) {
    NewmAvgBare[i] = parseFloat(
      (
        (Math.trunc(((BuYear - 1) * 235) / 19) + FirstEpochDif + i - 1) *
          Lunar +
        SolsConst +
        DayConst
      ).toPrecision(14)
    );
    NewmAvgRaw[i] = NewmAvgBare[i] + BuScOrder;
    if (NewmAvgRaw[i] < 0) NewmAvgRaw[i] += BuDays; // 和fmod(SolsAccumRaw)一樣，都是應對十月顓頊蔀首
    NewmInt[i] = chooseTrunc(NewmAvgRaw[i]);
    NewmAvgSc[i] = ScList[fm60(NewmInt[i])];
    NewmAvgDeci[i] = (
      NewmAvgRaw[i] -
      NewmInt[i] +
      (Name === "Chenhouyao" ? 1 : 0)
    )
      .toFixed(4)
      .slice(2, 6);
    NewmSd[i] = NewmAvgBare[i] - SolsAccum; // 和历元的距离，而非和冬至（应对立春元的历法，虽然古六历也没有星度）
    if (MansRaw) NewmEqua[i] = mans(Name, Y, NewmSd[i]).Equa;
    SyzygyAvgRaw[i] =
      parseFloat(
        (
          (Math.trunc(((BuYear - 1) * 235) / 19) + FirstEpochDif + i - 0.5) *
            Lunar +
          SolsConst +
          DayConst
        ).toPrecision(14)
      ) + BuScOrder;
    SyzygyAvgMod[i] = fm60(SyzygyAvgRaw[i]);
    SyzygyOrderMod[i] = chooseTrunc(SyzygyAvgMod[i]);
    SyzygySc[i] = ScList[SyzygyOrderMod[i]];
    SyzygyDeci[i] = (
      SyzygyAvgMod[i] -
      SyzygyOrderMod[i] +
      (Name === "Chenhouyao" ? 1 : 0)
    )
      .toFixed(4)
      .slice(2, 6);

    const TermBare = SolsAccum + (i + FirstEpochDif - 1) * TermLeng;
    TermRaw[i] = TermBare + BuScOrder;
    TermInt[i] = chooseTrunc(TermRaw[i]);
    const TermMod = fm60(TermRaw[i]);
    const TermOrderMod = chooseTrunc(TermMod);
    TermSc[i] = ScList[TermOrderMod];
    TermDeci[i] = (TermMod - TermOrderMod + (Name === "Chenhouyao" ? 1 : 0))
      .toFixed(4)
      .slice(2, 6);
    const Term1Bare = SolsAccum + (i + FirstEpochDif - 1.5) * TermLeng;
    const Term1Raw = Term1Bare + BuScOrder;
    Term1Int[i] = chooseTrunc(Term1Raw);
    const Term1Mod = fm60(Term1Raw);
    const Term1OrderMod = chooseTrunc(Term1Mod);
    Term1Sc[i] = ScList[Term1OrderMod];
    Term1Deci[i] = (Term1Mod - Term1OrderMod + (Name === "Chenhouyao" ? 1 : 0))
      .toFixed(4)
      .slice(2, 6);
    if (MansRaw) {
      const Func = mans(Name, Y, TermBare - SolsAccum);
      const Func1 = mans(Name, Y, Term1Bare - SolsAccum); // 這裏省略了紀元等提到的今年次年黃赤道差之差
      TermEqua[i] = Func.Equa;
      TermEclp[i] = Func.Eclp;
      Term1Equa[i] = Func1.Equa;
      Term1Eclp[i] = Func1.Eclp;
    }
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
  let LeapNumTerm = undefined;
  for (let i = 0; i <= 12; i++) {
    if (Name === "Chenhouyao") {
      if (
        TermRaw[i] < NewmAvgRaw[i + 1] &&
        TermRaw[i + 1] >= NewmAvgRaw[i + 2]
      ) {
        LeapNumTerm = i;
        break;
      }
    } else {
      if (TermInt[i] < NewmInt[i + 1] && TermInt[i + 1] >= NewmInt[i + 2]) {
        LeapNumTerm = i; // 閏Leap月，第Leap+1月爲閏月
        break;
      }
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
    TermInt,
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
// console.log(a("LuB", -722));
