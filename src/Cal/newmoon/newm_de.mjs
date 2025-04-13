import { ScList } from "../parameter/constants.mjs";
import { deltaT } from "../time/delta-t.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import NewmList from "../modern/newm_de44_list.mjs";
import SyzygyList from "../modern/syzygy_de44_list.mjs";
import TermList from "../modern/term_de44_list.mjs";
import Term1List from "../modern/term1_de44_list.mjs";
import { mansModern } from "../modern/mans.mjs";
// import { } from '../modern/mans.mjs'
function findClosest(a, list) {
  let closest = list[0],
    closestIndex = 0;
  let smallestDifference = Math.abs(a - closest);
  for (let i = 1; i < list.length; i++) {
    let currentDifference = Math.abs(a - list[i]);
    if (currentDifference < smallestDifference) {
      smallestDifference = currentDifference;
      closest = list[i];
      closestIndex = i;
    }
  }
  return { closest, closestIndex };
}
// 安排DE曆表的朔望節氣
export const N6 = (Y, Longitude) => {
  Longitude = Longitude || 116.428;
  if (Y > 2499 || Y < -2499)
    throw new Error("Year range of DE440/1: -2499 to 2499");
  const EpoSolsJd = 2451534.749; // 取癸卯曆1999年12月22日平冬至時間儒略日
  const ChouConst = 15.68; // 採用癸卯曆首朔應，即十二月平朔距冬至的時間。與時憲曆用冬至次日夜半，我直接用冬至
  const CloseOriginAd = 2000;
  const Solar = 365.2422,
    Lunar = 29.530588853;
  const TermLeng = Solar / 12;
  const OriginAccum = (Y - CloseOriginAd) * Solar; // 中積
  const AvgSolsJd = EpoSolsJd + OriginAccum;
  const AvgChouSd = (Lunar - (OriginAccum % Lunar) + ChouConst) % Lunar; // 首朔
  const AvgChouJd = AvgChouSd + AvgSolsJd; // 十二月朔
  const AvgChouSyzygySd = AvgChouSd + Lunar / 2; // 十二月望
  const AvgChouSyzygyJd = AvgChouSyzygySd + AvgSolsJd;
  const AvgChouTermJd = AvgSolsJd + TermLeng * 2; // 大寒
  const AvgChouTerm1Jd = AvgSolsJd + TermLeng; // 小寒
  const AcrChouJdIndex = findClosest(AvgChouJd, NewmList).closestIndex;
  const AcrChouSyzygyJdIndex = findClosest(
    AvgChouSyzygyJd,
    SyzygyList
  ).closestIndex;
  const AcrChouTermJdIndex = findClosest(AvgChouTermJd, TermList).closestIndex;
  const AcrChouTerm1JdIndex = findClosest(
    AvgChouTerm1Jd,
    Term1List
  ).closestIndex;
  const main = (isNewm, LeapNumTerm) => {
    const UT1Sc = [],
      UT1Mmdd = [],
      UT1Deci = [],
      NowDeci = [],
      Eclp = [],
      Equa = [],
      UT1Jd = [],
      TermUT1Jd = [],
      TermAcrSc = [],
      TermAcrMmdd = [],
      TermAcrDeci = [],
      TermEclp = [],
      TermEqua = [],
      Term1UT1Jd = [],
      Term1AcrSc = [],
      Term1AcrMmdd = [],
      Term1AcrDeci = [],
      Term1Eclp = [],
      Term1Equa = [];
    for (let i = 0; i <= 14; i++) {
      //////// 朔望
      const AcrJd = isNewm
        ? NewmList[AcrChouJdIndex + i]
        : SyzygyList[AcrChouSyzygyJdIndex + i];
      UT1Jd[i] = AcrJd - deltaT(AcrJd) + Longitude / 360;
      const UT1JdDate = jd2Date(UT1Jd[i]);
      UT1Sc[i] = ScList[UT1JdDate.ScOrder];
      UT1Mmdd[i] = UT1JdDate.mm + "-" + UT1JdDate.dd;
      UT1Deci[i] = Y < 1600 ? UT1JdDate.hms : UT1JdDate.hmsms;
      //////// 節氣
      if (isNewm) {
        const NewmFunc = mansModern(AcrJd);
        Eclp[i] = NewmFunc.Eclp;
        Equa[i] = NewmFunc.Equa;
        // 中氣
        const AcrTermJd = TermList[AcrChouTermJdIndex + i - 1];
        TermUT1Jd[i] = AcrTermJd - deltaT(AcrTermJd) + Longitude / 360;
        const TermUT1JdDate = jd2Date(TermUT1Jd[i]);
        TermAcrSc[i] = ScList[TermUT1JdDate.ScOrder];
        TermAcrMmdd[i] = TermUT1JdDate.mm + "-" + TermUT1JdDate.dd;
        TermAcrDeci[i] = Y < 1600 ? TermUT1JdDate.hms : TermUT1JdDate.hmsms;
        const TermFunc = mansModern(AcrTermJd);
        TermEclp[i] = TermFunc.Eclp;
        TermEqua[i] = TermFunc.Equa;
        // 節氣
        const AcrTerm1Jd = Term1List[AcrChouTerm1JdIndex + i - 1];
        Term1UT1Jd[i] = AcrTerm1Jd - deltaT(AcrTerm1Jd) + Longitude / 360;
        const Term1UT1JdDate = jd2Date(Term1UT1Jd[i]);
        Term1AcrSc[i] = ScList[Term1UT1JdDate.ScOrder];
        Term1AcrMmdd[i] = Term1UT1JdDate.mm + "-" + Term1UT1JdDate.dd;
        Term1AcrDeci[i] = Y < 1600 ? Term1UT1JdDate.hms : Term1UT1JdDate.hmsms;
        const Term1Func = mansModern(AcrTerm1Jd);
        Term1Eclp[i] = Term1Func.Eclp;
        Term1Equa[i] = Term1Func.Equa;
      }
    }
    //////// 置閏
    LeapNumTerm = LeapNumTerm || 0;
    if (isNewm) {
      for (let i = 1; i <= 12; i++) {
        if (
          Math.trunc(TermUT1Jd[i]) < Math.trunc(UT1Jd[i + 1]) &&
          Math.trunc(TermUT1Jd[i + 1]) >= Math.trunc(UT1Jd[i + 2])
        ) {
          LeapNumTerm = i; // 閏Leap月，第Leap+1月爲閏月
          break;
        }
      }
    }
    return {
      UT1Sc,
      UT1Mmdd,
      UT1Deci,
      NowDeci,
      Eclp,
      Equa,
      UT1Jd,
      TermUT1Jd,
      TermAcrSc,
      TermAcrMmdd,
      TermAcrDeci,
      TermEclp,
      TermEqua,
      Term1UT1Jd,
      Term1AcrSc,
      Term1AcrMmdd,
      Term1AcrDeci,
      Term1Eclp,
      Term1Equa,
      LeapNumTerm
    };
  };
  const {
    UT1Sc: NewmSc,
    UT1Mmdd: NewmMmdd,
    UT1Deci: NewmDeci,
    Equa: NewmEqua,
    Eclp: NewmEclp,
    UT1Jd: NewmUT1Jd,
    TermUT1Jd,
    TermAcrSc,
    TermAcrMmdd,
    TermAcrDeci,
    TermEclp,
    TermEqua,
    Term1UT1Jd,
    Term1AcrSc,
    Term1AcrMmdd,
    Term1AcrDeci,
    Term1Eclp,
    Term1Equa,
    LeapNumTerm
  } = main(true);
  const {
    UT1Sc: SyzygySc,
    UT1Mmdd: SyzygyMmdd,
    UT1Deci: SyzygyDeci
  } = main(false, LeapNumTerm);
  return {
    NewmSc,
    NewmMmdd,
    NewmDeci,
    NewmEqua,
    NewmEclp,
    SyzygySc,
    SyzygyMmdd,
    SyzygyDeci,
    TermUT1Jd,
    TermAcrSc,
    TermAcrMmdd,
    TermAcrDeci,
    TermEclp,
    TermEqua,
    Term1UT1Jd,
    Term1AcrSc,
    Term1AcrMmdd,
    Term1AcrDeci,
    Term1Eclp,
    Term1Equa,
    LeapNumTerm,
    //// 曆書用
    NewmUT1Jd,
    AvgSolsJd
  };
};
// console.log(N6(1024))
