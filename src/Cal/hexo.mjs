import {
  HexoList64,
  HexoList8,
  HexoQinghuaList,
  HexoZhouList,
  HexoChuList,
  HexoChuList2,
} from "./para_hexo.mjs";
import { big, frc } from "./para_constant.mjs";
import { re } from "mathjs";

const NumList = "初二三四五六";
const stdZhuxi = [0, 0, 6.25, 31.25, 43.75, 18.75]; // 朱熹理论值
const stdA = [0.21, 5.01, 34.74, 41.24, 16.68, 2.12]; // 四—九的贾连翔理论值
const stdB = [4.6875, 20.3125, 34.375, 28.125, 10.9375, 1.5625]; // 程浩理论值
const stdC = [3.125, 15.625, 31.25, 31.25, 15.625, 3.125]; // 杨胜男理论值
const stdD = [1.5625, 10.9375, 28.125, 34.375, 20.3125, 4.6875]; // 刘彬58理论值
const ListPI = [0, 5.8824, 24.8366, 49.0196, 18.3007, 1.9608]; // 几个分系的实际概率
const ListPII = [0, 5.8824, 43.5294, 35.6863, 13.7255, 1.1765];
const ListPIII = [0, 2.9762, 44.6429, 40.4762, 10.119, 1.7857];
const ListPIV = [0, 4.6296, 38.8889, 37.963, 15.7407, 2.7778];
const ListPV = [0, 10.4167, 27.0833, 37.5, 20.8333, 4.1667];
const ListPVI = [0, 11.4286, 31.4286, 40.0, 17.1429, 0];
const ListPVandVI = [0, 10.8434, 28.9157, 38.5542, 19.2771, 2.4096];
const ListPVII = [0, 5.1724, 46.5517, 34.4828, 13.7931, 0];
const ListPVIII = [0, 4.1667, 39.5833, 35.4167, 16.6667, 4.1667];
const ListPVIIandVIII = [0, 4.717, 43.3962, 34.9057, 15.0943, 1.8868];
const ListNI = [
  7011, 10018, 11019, 16025, 16026, 17027, 21034, 22035, 23039, 23040, 24042,
  24043, 24044, 24045, 26046, 36056, 39059, 42062, 44064, 46066, 50071, 51072,
  52073, 52074, 52075, 52076, 52077, 52078, 52079, 55085, 55086, 57088, 57089,
  57090, 57091, 57092, 57093, 57094, 57095, 57096, 57097, 57098, 58099, 58100,
  58101, 58102, 58103, 59104, 59105, 60106, 60107, 60108, 60109, 61110,
];
const ListNII = [
  3003, 4004, 4005, 4006, 5007, 6008, 6009, 6010, 7012, 8014, 8015, 8016, 9017,
  13021, 14022, 15023, 15024, 18028, 18029, 19030, 19031, 20032, 20033, 23036,
  23037, 23038, 23041, 27047, 28048, 29049, 30050, 31051, 32052, 33053, 34054,
  35055, 40060, 41061, 43063, 45065, 49069, 49070, 53080, 53081, 53082, 54083,
  54084,
];
const ListNIII = [
  64113, 65114, 68117, 69118, 72121, 73122, 75125, 77127, 81131, 82132, 84134,
  85135, 87137, 88138,
]; // 楚简可用的
// 11113只有4例，太少
const ListNV = [
  22035, 24042, 24043, 24044, 42062, 52073, 52074, 52075, 52076, 52078,
]; // 11211
const ListNVI = [27047, 29049, 31051, 35055, 40060, 43063]; //21210
const ListNVandVI = [
  22035, 24042, 24043, 24044, 42062, 52073, 52074, 52075, 52076, 52078, 27047,
  29049, 31051, 35055, 40060, 43063,
];
const ListNVII = [
  14022, 18028, 18029, 19030, 19031, 20032, 20033, 23037, 23038, 23041,
]; //21113
const ListNVIII = [4004, 4005, 4006, 6009, 6010, 8014, 8015, 8016]; //21111
const ListNVIIandVIII = [
  14022, 18028, 18029, 19030, 19031, 20032, 20033, 23037, 23038, 23041, 4004,
  4005, 4006, 6009, 6010, 8014, 8015, 8016,
];
const ListNThree = [
  1001, 5007, 7012, 9017, 10018, 11019, 12020, 37057, 39059, 46066, 50071,
  51072,
]; // 三爻卦
const ListNThree1 = [10018, 11019, 39059, 46066, 50071, 51072]; // 一系
const ListNThree7 = [5007, 7012, 9017, 12020]; // 七系
// console.log(ListNII.length)

const Random = (n, m) => Math.floor(Math.random() * (m - n + 1)) + n;
const Sigma = (n) => {
  // 標準差
  const length = n.length;
  let tmp = 0;
  for (let i = 0; i < length; i++) {
    tmp += n[i];
  }
  const mean = tmp / length;
  tmp = 0;
  for (let i = 0; i < length; i++) {
    tmp += (n[i] - mean) ** 2;
  }
  return Math.sqrt(tmp / length);
};

const HexoSub2 = (all, bian, p) => {
  // 二分法
  for (let k = 0; k < bian; k++) {
    const small = Math.floor((all * p) / 100);
    let a = Random(small, all - small);
    const l = a - 1;
    const r = all - a;
    let modL = 0,
      modR = 0;
    if (l > 0) modL = l % 4 || 4; // 0=4
    if (r > 0) modR = r % 4 || 4;
    all -= modL + modR + 1;
  }
  return all / 4;
};

const HexoSub3 = (all, bian, p) => {
  // 贾连翔《出土数字卦文献辑释》三分法
  for (let k = 0; k < bian; k++) {
    const small = Math.floor((all * p) / 100);
    let a = Random(small, all - small);
    const l = a;
    const r = all - a;
    const small2 = Math.floor((r * p) / 100);
    const r1 = Random(small2, r - small2);
    const r2 = r - r1;
    let modL = 0,
      modR1 = 0,
      modR2 = 0;
    if (l > 0) modL = l % 4 || 4; // 0=4
    if (r1 > 0) modR1 = r1 % 4 || 4;
    if (r2 > 0) modR2 = r2 % 4 || 4;
    all -= modL + modR1 + modR2;
  }
  return all / 4;
};
// 例如計算50卦，一共300爻，理論上應該出現95爻八，第一次出現100爻八，第二次90次，一共100000次，求這些次數的標準差
const Test4 = (isTriple, all, bian, p, hexo, std, sample, loop) => {
  const tmp = sample / 100; // %
  const n = [[], [], [], [], [], [], [], [], [], []];
  for (let j = 0; j < loop; j++) {
    const nums = Array(10).fill(0);
    for (let k = 0; k < sample; k++) {
      const result = isTriple ? HexoSub3(all, bian, p) : HexoSub2(all, bian, p);
      nums[result]++; // result among 4 ~ 9
    }
    for (let i = 4; i <= 9; i++) {
      n[i][j] = nums[i];
    }
  }
  const sigmas = n.slice(4).map((arr) => Sigma(arr) / tmp); // 减少中间浮点数运算！！！保留整数
  const d = sigmas.map((s, index) => (std[index] - hexo[index]) / s);
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    sum += Math.abs(d[i]);
  }
  let output = sigmas.map(
    (s, index) => s.toFixed(2) + " | " + d[index].toFixed(2) + " | "
  );
  output = output.concat(sum.toFixed(2));
  return output.join("");
};
// console.log(Test4(false, 49, 3, 17, stdZhuxi, ListPI, 100, 10000000)) // 朱熹
// console.log(Test4(true, 49, 3, 14, stdA, ListPV, 60, 10000000)) // 贾连翔
// console.log(Test4(false, 55, 5, 13, stdB, ListPV, 60, 10000000)) // 程浩
// console.log(Test4(false, 56, 5, 12, stdC, ListPV, 60, 10000000)) // 杨胜男
// console.log(Test4(false, 57, 5, 12, stdD, ListPV, 60, 10000000)) // 刘彬58
// 精度是數量的平方根！

const Test5 = (num, loop, std, sigma) => {
  // 檢驗Test4
  let Total = 0;
  for (let j = 0; j < loop; j++) {
    let Num8 = 0;
    for (let i = 0; i < num; i++) {
      const { result } = HexoZhuxi(17);
      for (let i = 0; i < 6; i++) {
        if (result[i] === 8) Num8++;
      }
    }
    const p8 = (Num8 * 100) / (num * 6);
    if (p8 > std - 2 * sigma && p8 < std + 2 * sigma) Total++;
  }
  return Total / loop;
};
// console.log(Test5(500, 1000000, 43.75, 0.91))
// Test5(500, 1000000, 43.75, 0.91)=0.946396

const HexoConceive = (isTriple, all, bian, p) => {
  // 是否是贾连翔的三分法，实用蓍草总数，变数，随机数范围
  const result = [];
  // isYang = [];
  let BinaryString = "";
  for (let i = 0; i < 12; i++) {
    result[i] = isTriple ? HexoSub3(all, bian, p) : HexoSub2(all, bian, p);
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
const HexoConceiveCompact = (isTriple, all, bian, p) => {
  const result = [];
  for (let i = 0; i < 12; i++) {
    result[i] = isTriple ? HexoSub3(all, bian, p) : HexoSub2(all, bian, p);
  }
  return { result };
};
// console.log(HexoConceive(false,56,5,17))
const HexoZhuxi = (p) => {
  const result = [],
    resultBian = [],
    isYangBen = [],
    isYangBian = [];
  let BinaryStringBen = "",
    BinaryStringBian = "";
  for (let i = 0; i < 6; i++) {
    result[i] = HexoSub2(49, 3, p);
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
  // 注意你这里是在字符串末尾增加1/0， 也就是说假如循环产生的数是 [1, 0, 0, 1, 1, 0]，十进制是 38，反过来就是25。想清楚高位低位！
  const BinaryBian = parseInt(BinaryStringBian, 2);
  return { result, resultBian, BinaryBen, BinaryBian, isYangBen, isYangBian };
};
// console.log(HexoZhuxi(17))

const Test1 = (isTriple, all, bian, std, loop) => {
  // 如何设置分堆范围
  const tmp = loop / 100;
  const output = [];
  for (let j = 34; j < 35; j++) {
    let Num4 = 0,
      Num5 = 0,
      Num6 = 0,
      Num7 = 0,
      Num8 = 0,
      Num9 = 0;
    for (let k = 0; k < loop; k++) {
      const a = isTriple ? HexoSub3(all, bian, j) : HexoSub2(all, bian, j);
      if (a === 4) Num4++;
      else if (a === 5) Num5++;
      else if (a === 6) Num6++;
      else if (a === 7) Num7++;
      else if (a === 8) Num8++;
      else if (a === 9) Num9++;
    }
    const p4 = Num4 / tmp;
    const p5 = Num5 / tmp;
    const p6 = Num6 / tmp;
    const p7 = Num7 / tmp;
    const p8 = Num8 / tmp;
    const p9 = Num9 / tmp;
    const d4 = p4 - std[0];
    const rd4 = d4 / std[0];
    const d5 = p5 - std[1];
    const rd5 = d5 / std[1];
    const d6 = p6 - std[2];
    const rd6 = d6 / std[2];
    const d7 = p7 - std[3];
    const rd7 = d7 / std[3];
    const d8 = p8 - std[4];
    const rd8 = d8 / std[4];
    const d9 = p9 - std[5];
    const rd9 = d9 / std[5];
    const SumDelta =
      Math.abs(d4) +
      Math.abs(d5) +
      Math.abs(d6) +
      Math.abs(d7) +
      Math.abs(d8) +
      Math.abs(d9);
    const SumRelativeDelta =
      Math.abs(rd4) +
      Math.abs(rd5) +
      Math.abs(rd6) +
      Math.abs(rd7) +
      Math.abs(rd8) +
      Math.abs(rd9);
    output[j] =
      j +
      "% | " +
      p4.toFixed(2) +
      " | " +
      p5.toFixed(2) +
      " | " +
      p6.toFixed(2) +
      " | " +
      p7.toFixed(2) +
      " | " +
      p8.toFixed(2) +
      " | " +
      p9.toFixed(2) +
      " | " +
      SumDelta.toFixed(2) +
      " | " +
      SumRelativeDelta.toFixed(2) +
      `\n`;
  }
  return output;
};
// console.log(Test1(false, 49, 3, stdZhuxi, 1000000)) // 朱熹
// console.log(Test1(true, 49, 3, stdA, 100000000)) // 贾连翔
// console.log(Test1(false, 55, 5, stdB, 100000000)) // 程浩
// console.log(Test1(false, 56, 5, stdC, 100000000)) // 杨胜男
// console.log(Test1(false, 57, 5, stdD, 100000000)) // 刘彬58

const ZhuxiBianList = [
  5.960464478, 3.576278687, 2.145767212, 1.287460327, 0.7724761963,
  0.4634857178, 0.2780914307,
]; // 朱熹筮法變卦概率%
const Compare = (n, loop) => {
  n = (n * 100) / loop;
  let min = Infinity;
  for (let i = 0; i < ZhuxiBianList.length; i++) {
    const result = Math.abs(n - ZhuxiBianList[i]);
    if (result < min) min = result;
  }
  return min;
};
// console.log(Compare(596, 10000))

const Test2 = (loop) => {
  // 完整推卦，分别得出本卦变卦误差，看如何设置分堆
  const print2 = [];
  for (let j = 17; j < 18; j++) {
    const Bengua = new Array(64).fill(0);
    const Biangua = new Array(64).fill(0);
    for (let i = 0; i < loop; i++) {
      const { BinaryBen, BinaryBian } = HexoZhuxi(j);
      Bengua[BinaryBen]++;
      Biangua[BinaryBian]++;
    }
    const print1 = []; //想请问，print1 到最后没输出没参与运算你存什么？
    // const Compare = n => { //不要每个循环里创建一遍函数！
    // }
    // const errorBen = [], errorBian = [] // CPU 高不高不知道，挺占内存的
    let errorBen = 0,
      errorBian = 0,
      totalErrorBen = 0,
      totalErrorBian = 0;
    for (let i = 0; i < 64; i++) {
      errorBen = (Bengua[i] * 100) / loop - 1.5625; // 1/64
      errorBian = Compare(Biangua[i], loop);
      print1[i] =
        HexoList64[i] +
        " | " +
        Bengua[i] +
        " | " +
        errorBen.toFixed(4) +
        "% | " +
        Biangua[i] +
        " | " +
        errorBian.toFixed(4) +
        "% |" +
        `\n`;
      totalErrorBen += Math.abs(errorBen);
      totalErrorBian += Math.abs(errorBian);
    }
    print2[j] =
      j +
      "% |" +
      totalErrorBen.toFixed(3) +
      "% | " +
      totalErrorBian.toFixed(3) +
      "% |" +
      `\n`;
  }
  return print2;
};
// console.log(Test2(1000000));

export const HexoZhuxiPrint = () => {
  const { result, resultBian, BinaryBen, BinaryBian, isYangBen, isYangBian } =
    HexoZhuxi(17);
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
  } = HexoZhuxi(17);
  const {
    result: resultB,
    BinaryBen: BinaryB,
    isYangBen: isYangB,
  } = HexoZhuxi(17);
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
    14
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

// 分系
const Devide = (list, screen) => {
  let result = "";
  for (const [key, value] of Object.entries(list)) {
    let k = 0,
      l = 0;
    for (let i = 0; i < 5; i++) {
      if (screen[i] === value[0][i] || screen[i] === "0") {
        k++;
      }
      for (let j = 0; j < value[1].length; j++) {
        if (
          value[1][j] === "4" ||
          value[1][j] === "5" ||
          value[1][j] === "8" ||
          value[1][j] === "9"
        ) {
          l++;
        }
      }
      if (k === 5 && l > 0) result += key + ", ";
    }
  }
  return result;
};
// console.log(Devide(HexoZhouList, '11111'))

const Count = (list, screen) => {
  const nums = Array(10).fill(0);
  for (const [key, value] of Object.entries(list)) {
    for (let i = 0; i < value[1].length; i++) {
      if (screen) {
        if (screen.indexOf(+key) !== -1) nums[value[1][i]]++;
      } else {
        nums[value[1][i]]++;
      }
    }
  }
  let sum = 0;
  for (const n of nums) {
    sum += n;
  }
  const output = [
    sum,
    ((nums[1] * 100) / sum).toFixed(4) + ", " + nums[1],
    ...nums.slice(4).map((n) => ((n * 100) / sum).toFixed(4) + ", " + n),
  ];
  return output.join(" | ");
};
// console.log(Count(HexoZhouList, ListNVandVI))
// console.log(Count(HexoChuList2))

const F = (n) => {
  // 阶乘
  let result = big(1);
  while (n > 1) {
    result = big.mul(result, n);
    n--;
  }
  return result;
};
const FF = (n) => {
  let result = 1;
  while (n > 1) {
    result *= n;
    n--;
  }
  return result;
};

// 二项分布在np > 5 and n(1-p) > 5时近似为正态分布，mu=np，sigma^2=np(1-p)
const Bernoulli = (n, p, m) => {
  // 爻数，理论概率，实际数量
  const mean = Math.round(n * p);
  const q = 1 - p;
  const outcome = [];
  for (let k = 0; k <= n; k++) {
    outcome[k] = F(n)
      .div(F(k).mul(F(n - k)))
      .mul(big.pow(p, k).mul(big.pow(q, n - k)));
  }
  let tmp = big(0);

  if (m > mean) {
    let pin = 0;
    while (outcome[pin].lt(outcome[m])) {
      pin++;
    }
    for (let i = pin + 1; i <= m; i++) {
      tmp = tmp.add(outcome[i]);
    }
  } else {
    let pin = mean;
    while (outcome[pin].gt(outcome[m])) {
      pin++;
    }
    for (let i = m; i <= pin; i++) {
      tmp = tmp.add(outcome[i]);
    }
  }
  return tmp.toNumber();
};
// console.log(Bernoulli(108, 0.3474, 42)) // pin: 0.6878, pin+1: 0.6336  蒙63.18
// console.log(Bernoulli(60, 0.3474, 17)) // 0.7773 ——蒙特卡洛法78.14
// console.log(Bernoulli(58, 0.3474, 27))  // 0.9203——蒙93.86
// console.log(Bernoulli(108, 0.0212, 3)) // 0.47296——蒙0.383

function AllDevide(input) {
  // 每個維度的數量
  let r = "";
  for (let i = 1; i <= input[0]; i++) {
    for (let j = 1; j <= input[1]; j++) {
      for (let k = 1; k <= input[2]; k++) {
        for (let l = 1; l <= input[3]; l++) {
          for (let m = 1; m <= input[4]; m++) {
            r +=
              i.toString() +
              j.toString() +
              k.toString() +
              l.toString() +
              m.toString() +
              ", ";
          }
        }
      }
    }
  }
  return r;
}
// console.log("5814".slice(0,1))
// 三變6—9，四變4—8，五變4—9
const Shelefa = (isGua, t, n) => {
  // 是每變掛一還是僅第一變掛一，變數t，揲數n。楊勝男《大衍揲扐法与清华简《筮法》揲扐法再探讨》
  const p = [];
  for (let k = 1; k <= t + 1; k++) {
    if (isGua) {
      p[k] = frc(2)
        .pow(k - 1)
        .div(frc(FF(k - 1)))
        .mul(frc(FF(t)).div(FF(t - k + 1)))
        .mul((n - 2) ** (t - k + 1))
        .div(n ** t);
      // p[k] = (2 ** (k - 1) / FF(k - 1) * (FF(t) / FF(t - k + 1)) * (n - 2) ** (t - k + 1)) / n ** t
    } else {
      // p[k] = (1 / FF(k - 1) * (FF(t) / FF(t - k + 1)) * (n - 1) ** (t - k + 1)) / n ** t
      p[k] = frc(1)
        .div(FF(k - 1))
        .mul(frc(FF(t)).div(FF(t - k + 1)))
        .mul((n - 1) ** (t - k + 1))
        .div(n ** t);
    }
    p[k] = p[k].toFraction(true) + "=" + +Number(p[k].mul(100)).toFixed(6);
  }
  return p.reverse().join(" | ");
};
// console.log(Shelefa(false, 4, 4))

// const HexoTraversalSub = (all, she, gua, small) => { // 二分法
//   let l = small - gua;
//   let r = all - small;
//   if (l <= 0) {
//     l = small
//     r = all - small - gua
//   }
//   const modL = l % she || she;
//   const modR = r % she || she;
//   all -= modL + modR + gua;
//   return all;
// };
// // console.log(HexoTraversalSub(49, 4, 1, 5))

const HexoSub2B = (all, she, gua, small) => {
  const l = small;
  const r = all - small - gua;
  all -= (l % she || she) + (r % she || she) + gua;
  return all;
};

const HexoTraversalSub2 = (all, bian, she, gua, nums) => {
  if (bian === 0) {
    nums[all / she]++;
    return;
  }
  const tmp = (all - gua) / 2;
  for (let small = Math.floor(tmp - (she - 1)); small <= tmp; small++) {
    const allNext = HexoSub2B(all, she, gua, small);
    HexoTraversalSub2(allNext, bian - 1, she, gua, nums);
  }
};
const HexoSub3B = (all, she, l) => {
  const r = all - l;
  const result = [];
  for (let r1 = Math.floor(r / 2 - (she - 1)); r1 <= r / 2; r1++) {
    const r2 = r - r1;
    const modL = l % she || she;
    const modR1 = r1 % she || she;
    const modR2 = r2 % she || she;
    result.push(all - (modL + modR1 + modR2));
  }
  return result;
};

const HexoTraversalSub3 = (all, bian, she, nums) => {
  if (bian === 0) {
    nums[all / she]++;
    return;
  }
  const tmp = all / 2;
  for (let l = Math.floor(tmp - (she - 1)); l <= tmp; l++) {
    const allNext = HexoSub3B(all, she, l);
    for (let i = 0; i < allNext.length; i++) {
      HexoTraversalSub3(allNext[i], bian - 1, she, nums);
    }
  }
};
// 遍历每种可能性，得出理论概率
const HexoTraversal = (isTriple, all, bian, she, gua) => {
  const nums = Array(12).fill(0);
  if (isTriple) {
    HexoTraversalSub3(all, bian, she, nums);
  } else {
    HexoTraversalSub2(all, bian, she, gua, nums);
  }
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  const p = [];
  for (let i = 0; i < nums.length; i++) {
    p[i] = i + ": " + (nums[i] * 100) / sum + " | ";
  }
  return p.join("") + sum;
};
// console.log(HexoTraversal(false, 49, 3, 4, 1)); // 朱熹大衍筮法
// console.log(HexoTraversal(true, 49, 3, 4)); // 算法A
//  4: 0.244140625 | 5: 6.005859375 | 6: 40.13671875 | 7: 39.55078125 | 8: 12.744140625 | 9: 1.318359375 | 10: 0 | 11: 0 | 4096
//   5:123:822:810:261:27
// console.log(HexoTraversal(false, 55, 5, 4, 1)); // 算法B程浩
// console.log(HexoTraversal(false, 56, 5, 4, 1)); // 算法C
// console.log(HexoTraversal(false, 57, 5, 4, 1)); // 算法D

// function Fun() {
//     const res = all % she
//     If (res != 0) {
//        throw new Error('Not Devided Error')
//     }
// }

// Try {
//     Fun()
// } catch(error ) {
//     console.error(error)
// }

// // 遍历每种可能性，得出理论概率
// const HexoTraversal = (all, bian, she, gua) => {
//   const all0 = all
//   const nums = Array(10).fill(0);
//   let r = ''
//   for (let i = 1; i < all0; i++) {
//     const all1 = HexoTraversalSub(all0, she, gua, i)
//     for (let j = 1; j < all1; j++) {
//       const all2 = HexoTraversalSub(all1, she, gua, j)
//       for (let k = 1; k < all2; k++) {
//         nums[HexoTraversalSub(all2, she, gua, k) / she]++
//       }
//     }
//   }
//   let sum = 0
//   for (let i = 0; i < nums.length; i++) {
//     sum += nums[i]
//   }
//   return nums
// }
