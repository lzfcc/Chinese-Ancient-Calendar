import { HexoList64, HexoList8 } from "./para_hexo.mjs";
import { HexoSub2, HexoSub3 } from "./hexo_sub.mjs";

const HexoConceive = (isTriple, all, bian, she, gua) => {
  // 是否是贾连翔的三分法，实用蓍草总数，变数，
  const result = [];
  // isYang = [];
  let BinaryString = "";
  for (let i = 0; i < 12; i++) {
    result[i] = isTriple
      ? HexoSub3(all, bian, she, 0)
      : HexoSub2(all, bian, she, gua, true, 0).r;
    // if (result[i] % 2 === 1) isYang[i] = 1;
    // else isYang[i] = 0;
    BinaryString += result[i] % 2;
  }
  const BinaryStringA = BinaryString.slice(0, 3);
  const BinaryStringB = BinaryString.slice(3, 6);
  const BinaryStringC = BinaryString.slice(6, 9);
  const BinaryStringD = BinaryString.slice(9, 12);
  const BinaryA = parseInt(BinaryStringA, 2);
  const BinaryB = parseInt(BinaryStringB, 2);
  const BinaryC = parseInt(BinaryStringC, 2);
  const BinaryD = parseInt(BinaryStringD, 2);
  return { result, BinaryA, BinaryB, BinaryC, BinaryD };
};
// console.log(HexoConceive(false,56,5,4,1))
const HexoZhuxi = () => {
  const result = [],
    resultBian = [],
    isYangBen = [],
    isYangBian = [];
  let BinaryStringBen = "",
    BinaryStringBian = "";
  for (let i = 0; i < 6; i++) {
    result[i] = HexoSub2(49, 3, 4, 1, true, 0).r;
    resultBian[i] = result[i];
    if (result[i] % 2 === 1) isYangBen[i] = 1;
    else isYangBen[i] = 0;
    if (result[i] === 6) {
      isYangBian[i] = 1;
      resultBian[i] = 9;
    } else if (result[i] === 9) {
      isYangBian[i] = 0;
      resultBian[i] = 6;
    } else isYangBian[i] = isYangBen[i];
    BinaryStringBen += isYangBen[i];
    BinaryStringBian += isYangBian[i];
  }
  const BinaryBen = parseInt(BinaryStringBen, 2); // 生成十进制数的意义是？
  // 注意你这里是在字符串末尾增加1/0， 也就是说假如循环产生的数是 [1, 0, 0, 1, 1, 0]，十进制是 38，反过来就是25。想清楚高位低位！——考虑好了的，没问题～
  const BinaryBian = parseInt(BinaryStringBian, 2);
  return { result, resultBian, BinaryBen, BinaryBian, isYangBen, isYangBian };
};
// console.log(HexoZhuxi())

const NumList = "初二三四五六";

export const HexoZhuxiPrint = () => {
  const { result, resultBian, BinaryBen, BinaryBian, isYangBen, isYangBian } =
    HexoZhuxi();
  const HexoAllBen = HexoList64[BinaryBen];
  const NameBen = HexoAllBen.slice(0, HexoAllBen.length - 1);
  const GraphBen = HexoAllBen.slice(-1);
  const HexoAllBian = HexoList64[BinaryBian];
  const NameBian = HexoAllBian.slice(0, HexoAllBian.length - 1);
  const GraphBian = HexoAllBian.slice(-1);
  const Print1 = [];
  let NumBian = "";
  for (let i = 0; i < 6; i++) {
    if (isYangBen[i] !== isYangBian[i]) {
      NumBian += NumList[i];
    }
    Print1[i] = {
      title: NumList[5 - i], // 上下顛倒
      data: [result[5 - i], resultBian[5 - i]],
    };
  }
  const Print2Ben = NameBen;
  const Print3Ben = `<div style="font-size:2.5em">${GraphBen}</div>`;
  const Print2Bian = NameBian;
  const Print3Bian = `<div style="font-size:2.5em">${GraphBian}</div>`;
  Print1[6] = {
    title: "",
    data: [Print2Ben, Print2Bian],
  };
  Print1[7] = {
    title: "",
    data: [Print3Ben, Print3Bian],
  };
  Print1[8] = {
    title: "變爻",
    data: [NumBian],
  };
  return Print1;
};
// console.log(HexoZhuxiPrint())

export const HexoZhuxiBPrint = () => {
  const {
    result: resultA,
    BinaryBen: BinaryA,
    isYangBen: isYangA,
  } = HexoZhuxi();
  const {
    result: resultB,
    BinaryBen: BinaryB,
    isYangBen: isYangB,
  } = HexoZhuxi();
  const HexoAllA = HexoList64[BinaryA];
  const NameA = HexoAllA.slice(0, HexoAllA.length - 1);
  const GraphA = HexoAllA.slice(-1);
  const HexoAllB = HexoList64[BinaryB];
  const NameB = HexoAllB.slice(0, HexoAllB.length - 1);
  const GraphB = HexoAllB.slice(-1);
  const Print1 = [];
  let NumBian = "";
  for (let i = 0; i < 6; i++) {
    if (isYangA[i] !== isYangB[i]) {
      NumBian += NumList[i];
    }
    Print1[i] = {
      title: NumList[5 - i], // 上下顛倒
      data: [resultA[5 - i], resultB[5 - i]],
    };
  }
  const Print2A = NameA;
  const Print3A = `<div style="font-size:2.5em">${GraphA}</div>`;
  const Print2B = NameB;
  const Print3B = `<div style="font-size:2.5em">${GraphB}</div>`;
  Print1[6] = {
    title: "",
    data: [Print2A, Print2B],
  };
  Print1[7] = {
    title: "",
    data: [Print3A, Print3B],
  };
  Print1[8] = {
    title: "變爻",
    data: [NumBian],
  };
  return Print1;
};

export const HexoQinghuaPrint = () => {
  const { result, BinaryA, BinaryB, BinaryC, BinaryD } = HexoConceive(
    false,
    56,
    5,
    4,
    1
  ); // 清華簡算法7%誤差最低
  const HexoAllA = HexoList8[BinaryA];
  const HexoAllB = HexoList8[BinaryB];
  const HexoAllC = HexoList8[BinaryC];
  const HexoAllD = HexoList8[BinaryD];
  const Print1 = [];
  for (let i = 0; i < 3; i++) {
    Print1[i] = {
      data: [
        `<div style="margin:0 0 -.5em 0">${result[11 - i]}</div>`,
        `<div style="margin:0 2em -.5em 0">${result[5 - i]}</div>`,
      ], // 倒序
    };
  }
  Print1[3] = {
    data: [HexoAllD, HexoAllB],
  };
  for (let i = 4; i < 7; i++) {
    Print1[i] = {
      data: [
        `<div style="margin:0 0 -.5em 0">${result[12 - i]}</div>`,
        `<div style="margin:0 2em -.5em 0">${result[6 - i]}</div>`,
      ], // 倒序
    };
  }
  Print1[7] = {
    data: [HexoAllC, HexoAllA],
  };
  return Print1;
};
// console.log(HexoQinghuaPrint())