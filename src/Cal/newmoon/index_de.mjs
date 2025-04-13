import { N6 } from "./newm_de.mjs";
import { ScList, MonNumList1 } from "../parameter/constants.mjs";
import { deltaT, deltaTError } from "../time/delta-t.mjs";
import terms from "./terms.mjs";
// const Index = (YearStart, YearEnd, Longitude) => {
export default (YearStart, YearEnd, Longitude) => {
  const Memo = [];
  const calculate = (Y) => {
    const [PrevYear, ThisYear] = Memo;
    let { LeapNumTerm } = ThisYear;
    const { NewmEqua, NewmEclp } = ThisYear;
    let NewmStart = 0;
    let NewmEnd = LeapNumTerm ? 1 : 0;
    let TermEnd = NewmEnd;
    if (PrevYear.LeapNumTerm) {
      LeapNumTerm = 0; // 可能出現去年不閏而閏，於是今年正月和去年十二月重疊
      if (PrevYear.NewmSc[13] === ThisYear.NewmSc[1]) {
        NewmStart = 1;
        NewmEnd = 1;
        TermEnd = 0;
      }
    }
    // 調整節氣
    const {
      TermDownName,
      TermDownAcrSc,
      TermDownAcrDeci,
      TermDownEqua,
      TermDownEclp,
      TermDownAcrMmdd,
      TermUpName,
      TermUpEqua,
      TermUpEclp,
      TermUpAcrDeci,
      TermUpAcrSc,
      TermUpAcrMmdd
    } = terms(ThisYear, PrevYear, LeapNumTerm, "DE441"); // 必須要傳上面修改過後的LeapNumTerm
    // 月序
    const MonthName = [];
    let MonNumList = MonNumList1;
    if (LeapNumTerm) {
      for (let i = 1; i <= 13; i++) {
        if (i <= LeapNumTerm) {
          MonthName[i] = MonNumList[i];
        } else if (i === LeapNumTerm + 1) {
          MonthName[i] = "閏" + MonNumList[LeapNumTerm];
        } else {
          MonthName[i] = MonNumList[i - 1];
        }
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        MonthName[i] = MonNumList[i];
      }
    }
    const NewmSlice = (array) => array.slice(1 + NewmStart, 13 + NewmEnd);
    const NewmSlice1 = (array) => array.slice(1 + NewmStart, 14 + NewmEnd);
    const TermSlice = (array) => array.slice(0, 12 + TermEnd);
    ////////////下爲調整輸出////////////
    const MonthPrint = MonthName.slice(1);
    const NewmScPrint = NewmSlice(ThisYear.NewmSc);
    const NewmUT1JdPrint = NewmSlice1(ThisYear.NewmUT1Jd);
    const NewmMmddPrint = NewmSlice(ThisYear.NewmMmdd);
    const NewmUT1DeciPrint = NewmSlice(ThisYear.NewmDeci);
    const NewmEquaPrint = NewmSlice(NewmEqua);
    const NewmEclpPrint = NewmSlice(NewmEclp);
    const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc);
    const SyzygyMmddPrint = NewmSlice(ThisYear.SyzygyMmdd);
    const SyzygyUT1DeciPrint = NewmSlice(ThisYear.SyzygyDeci);
    let TermNowDeciPrint = [],
      TermUpNowDeciPrint = [];
    const TermDownNamePrint = TermSlice(TermDownName);
    const TermUpNamePrint = TermUpName[2] ? TermSlice(TermUpName) : [];
    const TermDownAcrScPrint = TermSlice(TermDownAcrSc);
    const TermDownAcrMmddPrint = TermSlice(TermDownAcrMmdd);
    const TermDownAcrDeciPrint = TermSlice(TermDownAcrDeci);
    const TermUpAcrScPrint = TermSlice(TermUpAcrSc);
    const TermUpAcrMmddPrint = TermSlice(TermUpAcrMmdd);
    const TermUpAcrDeciPrint = TermSlice(TermUpAcrDeci);
    const TermDownEquaPrint = TermSlice(TermDownEqua);
    const TermUpEquaPrint = TermSlice(TermUpEqua);
    const TermDownEclpPrint = TermSlice(TermDownEclp);
    const TermUpEclpPrint = TermSlice(TermUpEclp);
    const YearSc = ScList[(((Y - 3) % 60) + 60) % 60];
    let Era = Y;
    if (Y > 0) Era = `公元 ${Y} 年 ${YearSc}`;
    else Era = `公元前 ${1 - Y} 年 ${YearSc}`;
    const YearInfo = [
      {
        CalName: Y >= 1600 ? "DE440" : "DE441",
        OriginYear: `距曆元${Y - 2000}年`,
        DeltaT:
          "ΔT = " +
          Math.trunc(deltaT(ThisYear.NewmUT1Jd[5]) * 86400) +
          " ± " +
          deltaTError(Y)[0] +
          " 秒"
      }
    ];
    return {
      Era,
      YearInfo,
      MonthPrint,
      LeapNumTerm,
      NewmScPrint,
      NewmMmddPrint,
      NewmUT1DeciPrint,
      NewmEclpPrint,
      NewmEquaPrint,
      NewmUT1JdPrint,
      SyzygyScPrint,
      SyzygyMmddPrint,
      SyzygyUT1DeciPrint,
      TermUpNamePrint,
      TermUpAcrScPrint,
      TermUpAcrMmddPrint,
      TermUpAcrDeciPrint,
      TermUpNowDeciPrint,
      TermUpEclpPrint,
      TermUpEquaPrint,
      TermDownNamePrint,
      TermDownAcrScPrint,
      TermDownAcrMmddPrint,
      TermDownAcrDeciPrint,
      TermNowDeciPrint,
      TermDownEclpPrint,
      TermDownEquaPrint
    };
  };
  Memo[0] = N6(YearStart - 1, Longitude); // 去年
  Memo[1] = N6(YearStart, Longitude); // 今年
  const result = [];
  YearEnd = YearEnd === undefined ? YearStart : YearEnd;
  for (let Y = YearStart; Y <= YearEnd; Y++) {
    Memo[2] = N6(Y + 1, Longitude); // 明年
    result.push(calculate(Y));
    Memo[0] = Memo[1]; // 数组滚动，避免重复运算
    Memo[1] = Memo[2];
  }
  return result;
};
// console.log(Index(2024, 2024, 116))
