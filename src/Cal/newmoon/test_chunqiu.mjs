import cal from "./index.mjs";
import { ScList } from "../parameter/constants.mjs";
const Duyu = [
  //   { y: -329, m: 11, d: "辛巳" },
  //   { y: -331, m: 3, d: "丙申" },
  //   { y: -330, m: 3, d: "庚申" },

  { y: -719, m: 2, d: "己巳" },
  { y: -708, m: 7, d: "壬辰" },
  { y: -668, m: 6, d: "辛未" },
  { y: -667, m: 12, d: "癸亥" },
  { y: -663, m: 9, d: "庚午" },
  { y: -654, m: 9, d: "戊申" },
  { y: -647, m: 3, d: "庚午" },
  { y: -625, m: 2, d: "癸亥" },
  { y: -611, m: 6, d: "辛丑" },
  { y: -600, m: 7, d: "甲子" },
  { y: -598, m: 4, d: "丙辰" },
  { y: -591, m: 6, d: "癸卯" },
  { y: -574, m: 6, d: "丙寅" },
  { y: -573, m: 12, d: "丁巳" },
  { y: -558, m: 2, d: "乙未" },
  { y: -557, m: 8, d: "丁巳" },
  { y: -552, m: 10, d: "丙辰" },
  { y: -551, m: 9, d: "庚戌" },
  { y: -551, m: 10, d: "庚辰" },
  { y: -549, m: 2, d: "癸酉" },
  { y: -548, m: 7, d: "甲子" },
  { y: -548, m: 8, d: "癸巳" },
  { y: -545, m: 12, d: "乙亥" },
  { y: -534, m: 4, d: "甲辰" },
  { y: -526, m: 6, d: "丁巳" },
  { y: -524, m: 6, d: "甲戌" },
  { y: -520, m: 7, d: "壬午" },
  { y: -519, m: 12, d: "癸酉" },
  { y: -517, m: 5, d: "乙未" },
  { y: -510, m: 12, d: "辛亥" },
  { y: -504, m: 3, d: "辛亥" },
  { y: -497, m: 11, d: "丙寅" },
  { y: -494, m: 8, d: "庚辰" },
  { y: -480, m: 5, d: "庚申" }
];
function a(Name, y, m, d) {
  const A = cal(Name, y - 1, y);
  const Prev = A[0];
  const This = A[1];
  const Next = A[2];
  const dOrder = ScList.indexOf(d);
  const MonPrev = Prev.NewmAvgScPrint;
  const SolsIndexPrev =
    Prev.TermDownNamePrint.indexOf("冬至中") !== -1
      ? Prev.TermDownNamePrint.indexOf("冬至中")
      : Prev.TermUpNamePrint.indexOf("冬至中");
  const SolsLeapIndexPrev =
    Prev.TermDownNamePrint.indexOf("无中") !== -1
      ? Prev.TermDownNamePrint.indexOf("无中")
      : Prev.TermUpNamePrint.indexOf("无中");
  const MonThis = This.NewmAvgScPrint;
  const SolsIndexThis =
    This.TermDownNamePrint.indexOf("冬至中") !== -1
      ? This.TermDownNamePrint.indexOf("冬至中")
      : This.TermUpNamePrint.indexOf("冬至中");
  const SolsLeapIndexThis =
    This.TermDownNamePrint.indexOf("无中") !== -1
      ? This.TermDownNamePrint.indexOf("无中")
      : This.TermUpNamePrint.indexOf("无中");
  SolsIndexPrev + m - 1;
  const NewMon = [];
  if (
    SolsLeapIndexPrev > SolsIndexPrev ||
    (SolsLeapIndexThis < SolsIndexThis && SolsLeapIndexThis !== -1)
  ) {
    if (SolsLeapIndexPrev > SolsIndexPrev) {
      for (let i = 1; i <= SolsLeapIndexPrev - SolsIndexPrev; i++) {
        NewMon[i] = {};
        NewMon[i].m = i;
        NewMon[i].Sc = MonPrev[i + SolsIndexPrev - 1];
      }
      NewMon[SolsLeapIndexPrev - SolsIndexPrev + 1] = {
        m: "l",
        Sc: MonPrev[SolsLeapIndexPrev]
      };
      for (let i = SolsLeapIndexPrev - SolsIndexPrev + 2; i <= 13; i++) {
        NewMon[i] = {};
        NewMon[i].m = i - 1;
        NewMon[i].Sc = MonThis[i - (MonPrev.length - SolsIndexPrev) - 1];
      }
    } else {
      for (let i = 1; i <= MonPrev.length - SolsIndexPrev; i++) {
        NewMon[i] = {};
        NewMon[i].m = i;
        NewMon[i].Sc = MonPrev[i + SolsIndexPrev - 1];
      }
      for (
        let i = MonPrev.length - SolsIndexPrev + 1;
        i <= MonPrev.length - SolsIndexPrev + 1 + SolsLeapIndexThis;
        i++
      ) {
        NewMon[i] = {};
        NewMon[i].m = i;
        NewMon[i].Sc = MonThis[i - (MonPrev.length - SolsIndexPrev) - 1];
      }
      NewMon[MonPrev.length - SolsIndexPrev + 1 + SolsLeapIndexThis] = {
        m: "l",
        Sc: MonThis[SolsLeapIndexThis]
      };
      for (
        let i = MonPrev.length - SolsIndexPrev + 2 + SolsLeapIndexThis;
        i <= 13;
        i++
      ) {
        NewMon[i] = {};
        NewMon[i].m = i - 1;
        NewMon[i].Sc = MonThis[i - (MonPrev.length - SolsIndexPrev) - 1];
      }
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      NewMon[i] = {};
      NewMon[i].m = i;
      if (i <= MonPrev.length - SolsIndexPrev) {
        NewMon[i].Sc = MonPrev[i + SolsIndexPrev - 1];
      } else {
        NewMon[i].Sc = MonThis[i - (MonPrev.length - SolsIndexPrev + 1)];
      }
    }
  }

  return;
}
function main(Name) {
  for (let i = 0; i < Duyu.length; i++) {
    a(Name, Duyu[i].y, Duyu[i].m, Duyu[i].d);
  }
}
main("Zhuanxu");
