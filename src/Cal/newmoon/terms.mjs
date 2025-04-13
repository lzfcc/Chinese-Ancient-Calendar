import Para from "../parameter/calendars.mjs";
import { TermNameList, Term1NameList } from "../parameter/constants.mjs";
// 此函數grok3改寫
export default (ThisYear, PrevYear, LeapNumTerm, Name) => {
  const { FirstNum, isAcr } = Para[Name];
  const { SolsDeci, NewmInt } = ThisYear;
  // Define optional properties and their sources for down and up terms
  const properties = [
    { key: "Sc", downSource: "TermSc", upSource: "Term1Sc" },
    { key: "AcrSc", downSource: "TermAcrSc", upSource: "Term1AcrSc" },
    { key: "Deci", downSource: "TermDeci", upSource: "Term1Deci" },
    { key: "AcrDeci", downSource: "TermAcrDeci", upSource: "Term1AcrDeci" },
    { key: "NowDeci", downSource: "TermNowDeci", upSource: "Term1NowDeci" },
    { key: "Equa", downSource: "TermEqua", upSource: "Term1Equa" },
    { key: "Eclp", downSource: "TermEclp", upSource: "Term1Eclp" },
    { key: "AcrMmdd", downSource: "TermAcrMmdd", upSource: "Term1AcrMmdd" }
  ];
  // Initialize terms array (index 0 unused, 1-13 for terms)
  const terms = Array.from({ length: 14 }, () => ({ down: {}, up: {} }));
  // Step 1: Populate initial term data for indices 1 to 13
  for (let i = 1; i <= 13; i++) {
    terms[i].down = {
      Name: TermNameList[(i + FirstNum) % 12]
    };
    terms[i].up = {
      Name: Term1NameList[(i + FirstNum) % 12]
    };
    // Assign optional properties if they exist
    properties.forEach((prop) => {
      if (ThisYear[prop.downSource]?.length) {
        terms[i].down[prop.key] = ThisYear[prop.downSource][i];
        terms[i].up[prop.key] = ThisYear[prop.upSource][i];
      }
    });
  }
  // Step 2: Handle leap term adjustment
  if (LeapNumTerm) {
    const leapIndex = LeapNumTerm + 1;
    // Set down term at leapIndex to "无中" with empty attributes
    terms[leapIndex].down = {
      Name: "无中"
    };
    properties.forEach((prop) => {
      if (ThisYear[prop.downSource]?.length) {
        terms[leapIndex].down[prop.key] = "";
      }
    });
    // Adjust subsequent terms by swapping sources and shifting up terms
    for (let i = leapIndex + 1; i <= 13; i++) {
      terms[i].down = {
        Name: Term1NameList[(i + FirstNum) % 12]
      };
      terms[i].up = {
        Name: TermNameList[(i + FirstNum - 1) % 12]
      };
      properties.forEach((prop) => {
        if (ThisYear[prop.downSource]?.length) {
          terms[i].down[prop.key] = ThisYear[prop.upSource][i];
          terms[i].up[prop.key] = ThisYear[prop.downSource][i - 1];
        }
      });
    }
  }
  // Step 3: Calculate NoJieMon (month without a term)
  let NoJieMon = 0;
  const Term1Sd =
    ThisYear.Term1AcrSmd ||
    ThisYear.Term1AvgSd ||
    ThisYear.Term1Int ||
    ThisYear.Term1UT1Jd;
  const NewmSd =
    ThisYear.NewmNowlineSmd ||
    (isAcr ? ThisYear.NewmAcrSd : ThisYear.NewmSd) ||
    NewmInt ||
    ThisYear.NewmUT1Jd;
  for (let i = 1; i <= 12; i++) {
    if (
      Math.trunc(Term1Sd[i] + (SolsDeci || 0)) <
        Math.trunc(NewmSd[i] + (SolsDeci || 0)) &&
      Math.trunc(Term1Sd[i + 1] + (SolsDeci || 0)) >=
        Math.trunc(NewmSd[i + 1] + (SolsDeci || 0))
    ) {
      NoJieMon = i;
      break;
    }
  }

  // Step 4: Adjust terms if previous year had a leap or current year has NoJieMon
  if (PrevYear.LeapNumTerm || (!PrevYear.LeapNumTerm && NoJieMon)) {
    // Shift up terms forward
    for (let i = 1; i <= 13; i++) {
      terms[i].up = {
        Name: Term1NameList[(i + FirstNum + 1) % 12]
      };
      properties.forEach((prop) => {
        if (ThisYear[prop.upSource]?.length) {
          terms[i].up[prop.key] = ThisYear[prop.upSource][i + 1];
        }
      });
    }
    // Swap down and up terms
    for (let i = 1; i <= 13; i++) {
      const temp = terms[i].down;
      terms[i].down = terms[i].up;
      terms[i].up = temp;
    }
  }
  // Step 5: Adjust for NoJieMon specifically
  if (
    (PrevYear.LeapNumTerm && NoJieMon) ||
    (!PrevYear.LeapNumTerm && NoJieMon)
  ) {
    // Set up term at NoJieMon to "无節" with empty attributes
    terms[NoJieMon].down = {
      Name: "无節"
    };
    properties.forEach((prop) => {
      if (ThisYear[prop.upSource]?.length) {
        terms[NoJieMon].down[prop.key] = "";
      }
    });
    // Reset terms after NoJieMon to initial-like state
    for (let i = NoJieMon + 1; i <= 13; i++) {
      terms[i].up = {
        Name: Term1NameList[(i + FirstNum) % 12]
      };
      terms[i].down = {
        Name: TermNameList[(i + FirstNum) % 12]
      };
      properties.forEach((prop) => {
        if (ThisYear[prop.downSource]?.length) {
          terms[i].down[prop.key] = ThisYear[prop.downSource][i];
          terms[i].up[prop.key] = ThisYear[prop.upSource][i];
        }
      });
    }
  }
  // 此DeepSeek生成
  const result = {};
  for (const item of terms) {
    // 处理up对象
    const upKeys = Object.keys(item.up);
    for (const key of upKeys) {
      const resultKey = `TermUp${key}`;
      if (!result[resultKey]) {
        result[resultKey] = [];
      }
      result[resultKey].push(item.up[key]);
    }
    // 处理down对象
    const downKeys = Object.keys(item.down);
    for (const key of downKeys) {
      const resultKey = `TermDown${key}`;
      if (!result[resultKey]) {
        result[resultKey] = [];
      }
      result[resultKey].push(item.down[key]);
    }
  }
  return result;
};

// 原來的：
// // 調整節氣
// for (let i = 1; i <= 13; i++) {
//   TermDownName[i] = TermNameList[(i + FirstNum) % 12];
//   TermDownSc[i] = ThisYear.TermSc[i];
//   TermDownDeci[i] = ThisYear.TermDeci[i];
//   TermUpName[i] = Term1NameList[(i + FirstNum) % 12];
//   TermUpSc[i] = ThisYear.Term1Sc[i];
//   TermUpDeci[i] = ThisYear.Term1Deci[i];
//   if ((ThisYear.TermAcrDeci || []).length) {
//     TermDownAcrSc[i] = ThisYear.TermAcrSc[i];
//     TermDownAcrDeci[i] = ThisYear.TermAcrDeci[i];
//     TermUpAcrSc[i] = ThisYear.Term1AcrSc[i];
//     TermUpAcrDeci[i] = ThisYear.Term1AcrDeci[i];
//   }
//   if ((ThisYear.TermNowDeci || []).length) {
//     TermDownNowDeci[i] = ThisYear.TermNowDeci[i];
//     TermUpNowDeci[i] = ThisYear.Term1NowDeci[i];
//   }
//   if ((ThisYear.TermEqua || []).length) {
//     TermDownEqua[i] = ThisYear.TermEqua[i];
//     TermUpEqua[i] = ThisYear.Term1Equa[i];
//     TermDownEclp[i] = ThisYear.TermEclp[i];
//     TermUpEclp[i] = ThisYear.Term1Eclp[i];
//   }
// }
// if (LeapNumTerm) {
//   TermDownName[LeapNumTerm + 1] = "无中";
//   TermDownSc[LeapNumTerm + 1] = "";
//   TermDownDeci[LeapNumTerm + 1] = "";
//   if ((ThisYear.TermAcrSc || []).length)
//     TermDownAcrSc[LeapNumTerm + 1] = "";
//   if ((ThisYear.TermAcrDeci || []).length)
//     TermDownAcrDeci[LeapNumTerm + 1] = "";
//   if ((ThisYear.TermNowDeci || []).length)
//     TermDownNowDeci[LeapNumTerm + 1] = "";
//   if ((ThisYear.TermEqua || []).length) TermDownEqua[LeapNumTerm + 1] = "";
//   if ((ThisYear.TermEclp || []).length) TermDownEclp[LeapNumTerm + 1] = "";
//   for (let i = LeapNumTerm + 2; i <= 13; i++) {
//     // 上下互換位置
//     TermDownName[i] = Term1NameList[(i + FirstNum) % 12];
//     TermDownSc[i] = ThisYear.Term1Sc[i];
//     TermDownDeci[i] = ThisYear.Term1Deci[i];
//     TermUpName[i] = TermNameList[(i + FirstNum - 1) % 12];
//     TermUpSc[i] = ThisYear.TermSc[i - 1];
//     TermUpDeci[i] = ThisYear.TermDeci[i - 1];
//     if ((ThisYear.Term1AcrSc || []).length) {
//       TermDownAcrSc[i] = ThisYear.Term1AcrSc[i];
//       TermDownAcrDeci[i] = ThisYear.Term1AcrDeci[i];
//       TermUpAcrSc[i] = ThisYear.TermAcrSc[i - 1];
//       TermUpAcrDeci[i] = ThisYear.TermAcrDeci[i - 1];
//     }
//     if ((ThisYear.TermNowDeci || []).length) {
//       TermDownNowDeci[i] = ThisYear.Term1NowDeci[i];
//       TermUpNowDeci[i] = ThisYear.TermNowDeci[i - 1];
//     }
//     if ((ThisYear.TermEqua || []).length) {
//       TermDownEqua[i] = ThisYear.Term1Equa[i];
//       TermUpEqua[i] = ThisYear.TermEqua[i - 1];
//       TermDownEclp[i] = ThisYear.Term1Eclp[i];
//       TermUpEclp[i] = ThisYear.TermEclp[i - 1];
//     }
//   }
// }
// let NoJieMon = 0;
// const Term1Sd =
//   ThisYear.Term1AcrSmd || ThisYear.Term1AvgSd || ThisYear.Term1Int;
// const NewmSd =
//   ThisYear.NewmNowlineSmd ||
//   (isAcr ? ThisYear.NewmAcrSd : ThisYear.NewmSd) ||
//   NewmInt;
// for (let i = 1; i <= 12; i++) {
//   if (
//     Math.trunc(Term1Sd[i] + (SolsDeci || 0)) <
//       Math.trunc(NewmSd[i] + (SolsDeci || 0)) &&
//     Math.trunc(Term1Sd[i + 1] + (SolsDeci || 0)) >=
//       Math.trunc(NewmSd[i + 1] + (SolsDeci || 0))
//   ) {
//     NoJieMon = i; // 閏Leap月，第Leap+1月爲閏月
//     break;
//   }
// }
// if (PrevYear.LeapNumTerm || (!PrevYear.LeapNumTerm && NoJieMon)) {
//   // 若去年有閏，把所有節往前移一個
//   for (let i = 1; i <= 13; i++) {
//     TermUpName[i] = Term1NameList[(i + FirstNum + 1) % 12];
//     TermUpSc[i] = ThisYear.Term1Sc[i + 1];
//     TermUpDeci[i] = ThisYear.Term1Deci[i + 1];
//     if ((ThisYear.TermAcrSc || []).length) {
//       TermUpAcrSc[i] = ThisYear.Term1AcrSc[i + 1];
//       TermUpAcrDeci[i] = ThisYear.Term1AcrDeci[i + 1];
//     }
//     if ((ThisYear.TermNowDeci || []).length) {
//       TermUpNowDeci[i] = ThisYear.Term1NowDeci[i + 1];
//     }
//     if ((ThisYear.TermEqua || []).length) {
//       TermUpEqua[i] = ThisYear.Term1Equa[i + 1];
//       TermUpEclp[i] = ThisYear.Term1Eclp[i + 1];
//     }
//   }
//   // 節氣中氣上下交換
//   const temp1 = [...TermUpName];
//   TermUpName.splice(0, TermDownName.length, ...TermDownName);
//   TermDownName.splice(0, TermUpName.length, ...temp1);
//   const temp2 = [...TermUpSc];
//   TermUpSc.splice(0, TermDownSc.length, ...TermDownSc);
//   TermDownSc.splice(0, TermUpSc.length, ...temp2);
//   const temp3 = [...TermUpDeci];
//   TermUpDeci.splice(0, TermDownDeci.length, ...TermDownDeci);
//   TermDownDeci.splice(0, TermUpDeci.length, ...temp3);
//   if ((ThisYear.TermAcrSc || []).length) {
//     const temp4 = [...TermUpAcrSc];
//     TermUpAcrSc.splice(0, TermDownAcrSc.length, ...TermDownAcrSc);
//     TermDownAcrSc.splice(0, TermUpAcrSc.length, ...temp4);
//     const temp5 = [...TermUpAcrDeci];
//     TermUpAcrDeci.splice(0, TermDownAcrDeci.length, ...TermDownAcrDeci);
//     TermDownAcrDeci.splice(0, TermUpAcrDeci.length, ...temp5);
//   }
//   if ((ThisYear.TermNowDeci || []).length) {
//     const temp6 = [...TermUpNowDeci];
//     TermUpNowDeci.splice(0, TermDownNowDeci.length, ...TermDownNowDeci);
//     TermDownNowDeci.splice(0, TermUpNowDeci.length, ...temp6);
//   }
//   if ((ThisYear.TermEqua || []).length) {
//     const temp7 = [...TermUpEqua];
//     TermUpEqua.splice(0, TermDownEqua.length, ...TermDownEqua);
//     TermDownEqua.splice(0, TermUpEqua.length, ...temp7);
//     const temp8 = [...TermUpEclp];
//     TermUpEclp.splice(0, TermDownEclp.length, ...TermDownEclp);
//     TermDownEclp.splice(0, TermUpEclp.length, ...temp8);
//   }
// }
// // 調整節。無節月有可能落在閏年的後年，比如13—15AD，
// if (
//   (PrevYear.LeapNumTerm && NoJieMon) ||
//   (!PrevYear.LeapNumTerm && NoJieMon)
// ) {
//   TermUpName[NoJieMon] = "无節";
//   TermUpSc[NoJieMon] = "";
//   TermUpDeci[NoJieMon] = "";
//   if ((ThisYear.Term1AcrSc || []).length) TermUpAcrSc[NoJieMon] = "";
//   if ((ThisYear.Term1AcrDeci || []).length) TermUpAcrDeci[NoJieMon] = "";
//   if ((ThisYear.Term1NowDeci || []).length) TermUpNowDeci[NoJieMon] = "";
//   if ((ThisYear.Term1Equa || []).length) TermUpEqua[NoJieMon] = "";
//   if ((ThisYear.Term1Eclp || []).length) TermUpEclp[NoJieMon] = "";
//   TermDownName[NoJieMon] = TermNameList[(NoJieMon + FirstNum) % 12];
//   TermDownSc[NoJieMon] = ThisYear.TermSc[NoJieMon];
//   TermDownDeci[NoJieMon] = ThisYear.TermDeci[NoJieMon];
//   if ((ThisYear.Term1AcrSc || []).length)
//     TermDownAcrSc[NoJieMon] = ThisYear.TermAcrSc[NoJieMon];
//   if ((ThisYear.Term1AcrDeci || []).length)
//     TermDownAcrDeci[NoJieMon] = ThisYear.TermAcrDeci[NoJieMon];
//   if ((ThisYear.Term1NowDeci || []).length)
//     TermDownNowDeci[NoJieMon] = ThisYear.TermNowDeci[NoJieMon];
//   if ((ThisYear.Term1Equa || []).length)
//     TermDownEqua[NoJieMon] = ThisYear.TermEqua[NoJieMon];
//   if ((ThisYear.Term1Eclp || []).length)
//     TermDownEclp[NoJieMon] = ThisYear.TermEclp[NoJieMon];
//   for (let i = NoJieMon + 1; i <= 13; i++) {
//     // 上下互換位置
//     TermUpName[i] = Term1NameList[(i + FirstNum) % 12];
//     TermUpSc[i] = ThisYear.Term1Sc[i];
//     TermUpDeci[i] = ThisYear.Term1Deci[i];
//     TermDownName[i] = TermNameList[(i + FirstNum) % 12];
//     TermDownSc[i] = ThisYear.TermSc[i];
//     TermDownDeci[i] = ThisYear.TermDeci[i];
//     if ((ThisYear.TermAcrSc || []).length) {
//       TermUpAcrSc[i] = ThisYear.Term1AcrSc[i];
//       TermUpAcrDeci[i] = ThisYear.Term1AcrDeci[i];
//       TermDownAcrSc[i] = ThisYear.TermAcrSc[i];
//       TermDownAcrDeci[i] = ThisYear.TermAcrDeci[i];
//     }
//     if ((ThisYear.TermNowDeci || []).length) {
//       TermUpNowDeci[i] = ThisYear.Term1NowDeci[i];
//       TermDownNowDeci[i] = ThisYear.TermNowDeci[i];
//     }
//     if ((ThisYear.TermEqua || []).length) {
//       TermUpEqua[i] = ThisYear.Term1Equa[i];
//       TermUpEclp[i] = ThisYear.Term1Eclp[i];
//       TermDownEqua[i] = ThisYear.TermEqua[i];
//       TermDownEclp[i] = ThisYear.TermEclp[i];
//     }
//   }
// }
