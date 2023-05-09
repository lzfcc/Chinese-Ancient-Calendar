import {
  HexoList64,
  HexoList8,
  HexoQinghuaList,
  HexoZhouList,
  HexoChuList,
  HexoChuList2,
  stdA,
  stdB,
  stdC,
  stdD,
  stdZhuxi,
  ListPI,
  ListPII,
  ListPIII,
  ListPIV,
  ListPV,
  ListPVI,
  ListPVandVI,
  ListPVII,
  ListPVIII,
  ListPVIIandVIII,
  ListPAll,
  ListNI,
  ListNII,
  ListNIII,
  ListNV,
  ListNVI,
  ListNVII,
  ListNVandVI,
  ListNVIII,
  ListNVIIandVIII,
  ListNThree,
  ListNThree1,
  ListNThree7,
} from "./para_hexo.mjs";
// import { re } from "mathjs";

const NumList = "初二三四五六";

// const Random = (n, m) => Math.round(Math.random() * (m - n)) + n; // [n, m] 整数
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
  const sigma = Math.sqrt(tmp / length);
  return { mean, sigma };
};
const Sigma1 = (n) => {
  // 样本標準差
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
  const sigma = Math.sqrt(tmp / (length - 1));
  return { mean, sigma };
};
const xxx = (n) => {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(Random(1, 100));
  }
  return result.toString();
};
// console.log(xxx(100));
const HexoSub2 = (all, bian, she, gua, isRandomGua, pn, pp) => {
  // 二分法 //
  //总数，变数，揲數，是否隨機掛左右，pn: 下限整数，pp：下限比例 .isRandomGua对结果似乎没影响。返回最後生成的數字
  for (let k = 0; k < bian; k++) {
    let small = pn;
    if (pp) {
      small = Math.floor((all * pp) / 100);
      if (small < she) small = she; // 强制规定下限为4
    }
    const a = Random(small, all - small);
    let l = a;
    let r = all - a - gua;
    if (isRandomGua) {
      const isL = Random(0, 1); // 挂左还是挂右
      if (isL === 1) {
        l = a - gua;
        r = all - a;
      }
    }
    if (l < 0) {
      l = a;
      r = all - a - gua;
    }
    if (r < 0) {
      l = a - gua;
      r = all - a;
    }
    const modL = l > 0 ? l % she || she : 0;
    const modR = r > 0 ? r % she || she : 0;
    all -= modL + modR + gua;
  }
  return all / she;
};
// console.log(HexoSub2(49, 3, 4, 1, false, 1, 0));

const HexoSub3 = (all, bian, she, pn, pp) => {
  // pn: 下限整数，pp：下限比例
  // 贾连翔《出土数字卦文献辑释》三分法
  for (let k = 0; k < bian; k++) {
    let small = pn,
      small2 = pn;
    if (pp) {
      small = Math.floor((all * pp) / 100);
      if (small < she) small = she;
    }
    const a = Random(small, all - small);
    const l = a;
    const r = all - a;
    if (pp) {
      small2 = Math.floor((r * pp) / 100);
      if (small2 < she) small2 = she;
    }
    const r1 = Random(small2, r - small2);
    const r2 = r - r1;
    let modL = 0,
      modR1 = 0,
      modR2 = 0;
    if (l > 0) modL = l % she || she; // 0=4
    if (r1 > 0) modR1 = r1 % she || she;
    if (r2 > 0) modR2 = r2 % she || she;
    all -= modL + modR1 + modR2;
  }
  return all / she;
};

const Test1 = (isTriple, all, bian, she, gua, isRandomGua, loop, count) => {
  // 算法理论值
  let p = "";
  for (let j = count[0]; j <= count[1]; j++) {
    const Num = Array(10).fill(0);
    for (let k = 0; k < loop; k++) {
      const a = isTriple
        ? HexoSub3(all, bian, she, 0, j)
        : HexoSub2(all, bian, she, gua, isRandomGua, 0, j);
      Num[a]++;
    }
    p += "| " + j + "% | ";
    for (let i = 0; i < Num.length; i++) {
      p += ((Num[i] * 100) / loop).toFixed(2) + " | ";
    }
    p += `\n`;
  }
  return p;
};
// console.log(Test1(false, 49, 3, 4, 1, true, 1000000000, [17, 25])); // 朱熹
// console.log(Test1(true, 49, 3, 4, 0, true, 1000000000, [8, 20])); // 贾连翔
// console.log(Test1(false, 55, 5, 4, 1, true, 1000000000, [8, 20])); // 程浩
// console.log(Test1(false, 56, 5, 4, 1, true, 1000000000, [8, 20])); // 杨胜男
// console.log(Test1(false, 57, 5, 4, 1, true, 1000000000, [8, 20])); // 刘彬58

// bootstrap计算置信区间。例如計算50卦，一共300爻，理論上應該出現95爻八，第一次出現100爻八，第二次90次，一共100000次，求這些次數的標準差
const Test4 = (
  isTriple,
  all,
  bian,
  she,
  gua,
  SampleNumList,
  ListPAll,
  portion,
  loop
) => {
  const output = [];
  for (let aa = 0; aa < SampleNumList.length; aa++) {
    let se4 = [],
      se5 = [],
      se6 = [],
      se7 = [],
      se8 = [],
      se9 = [];
    for (let m = 0; m < portion[1] - portion[0]; m++) {
      const n = [[], [], [], [], [], [], [], [], [], []];
      for (let j = 0; j < loop; j++) {
        const nums = Array(10).fill(0);
        for (let k = 0; k < SampleNumList[aa]; k++) {
          const result = isTriple
            ? HexoSub3(all, bian, she, 0, m + portion[0])
            : HexoSub2(all, bian, she, gua, true, 0, m + portion[0]);
          nums[result]++; // result among 4 ~ 9
        }
        for (let i = 4; i <= 9; i++) {
          n[i][j] = nums[i];
        }
      }
      for (let i = 4; i <= 9; i++) {
        // 标准差法
        const Fix = (x) => +((x * 100) / SampleNumList[aa]).toFixed(1); // 100万次精确到0.1%，1亿次0.01%
        let { sigma, mean } = Sigma1(n[i]);
        sigma = Fix(sigma);
        mean = Fix(mean);
        const se = (mean - ListPAll[aa][i - 4]) / sigma;
        if (i === 4) {
          se4.push(se);
        } else if (i === 5) {
          se5.push(se);
        } else if (i === 6) {
          se6.push(se);
        } else if (i === 7) {
          se7.push(se);
        } else if (i === 8) {
          se8.push(se);
        } else if (i === 9) {
          se9.push(se);
        }
        // 分位法
        // const sort = n[i].sort((a, b) => a - b);
        // const low = (sort[Math.round(0.025 * loop)] * 100) / SampleNumList;
        // const up = (sort[Math.round(0.975 * loop)] * 100) / SampleNumList;
      }
    }
    output[aa] = "| ";
    for (let i = 4; i <= 9; i++) {
      let seArr = [];
      if (i === 4) {
        seArr = se4;
      } else if (i === 5) {
        seArr = se5;
      } else if (i === 6) {
        seArr = se6;
      } else if (i === 7) {
        seArr = se7;
      } else if (i === 8) {
        seArr = se8;
      } else if (i === 9) {
        seArr = se9;
      }
      const { sigma: s, mean: m } = Sigma(seArr);
      output[aa] +=
        "[" +
        (m - 1.645 * s).toFixed(1) +
        ", " +
        (m + 1.645 * s).toFixed(1) +
        "] | "; // 1.645: 90%, 1.96: 95%
    }
  }
  return output.join(`\n`);
};
const SampleNumList = [306, 255, 168, 108, 60, 35, 95, 58, 48, 106];
// console.log(Test4(true, 49, 3, 4, 1, SampleNumList, ListPAll, [8, 20], 1000000)); // 贾连翔 // 34分20秒100万次
// 分位法：[0.00, 0.33] | [0.65, 3.59] | [15.36, 24.18] | [35.62, 46.73] | [24.84, 34.97] | [4.58, 10.46]
// 标准差法：[-0.20, 0.29] | [0.36, 3.40] | [15.19, 24.09] | [35.57, 46.62] | [24.64, 34.88] | [4.42, 10.27]
// console.log(Test4(false, 55, 5, 4, 1, SampleNumList, ListPAll, [8,20], 1000000)); // 程浩
// console.log(Test4(false, 56, 5, 4, 1,SampleNumList, ListPAll, [8,20], 1000000)); // 杨胜男
// console.log(Test4(false, 57, 5, 4, 1,SampleNumList, ListPAll, [8,20], 1000000)); // 刘彬58
// 精度是數量的平方根！

// 阶乘
const F = (n) => {
  let result = 1;
  if (n === 0) {
    // 定义0!=1
  } else {
    while (n > 1) {
      result *= n;
      n--;
    }
  }
  return result;
};
// 如果 X~ B (n, p），当 np>5 且 nq>5 时，则使用正态分布近似代替二项分布。mu=np，sigma^2=np(1-p)
// 如果 n>50 且 p <0.1,教材：n>=20, p<=0.05，则可以使用泊松分布近似代替二项分布
const Poisson = (lambda, k) => (lambda ** k * Math.E ** -k) / F(k);
const Test6 = (std, x) => {
  const seSpan = [];
  for (let m = 0; m < x.length; m++) {
    // for (let m = 6; m < 7; m++) {
    const n = x[m][6];
    const se = [];
    for (let i = 0; i < 6; i++) {
      const k = Math.round((n * x[m][i]) / 100); // 实际爻数
      se[i] = [];
      for (let j = 0; j < std[i].length; j++) {
        const p = std[i][j] / 100;
        if (i === 0 || i === 5) {
          // 数字四、九用泊松分布。以均值为中心，向两边拓展，如果均值可能性大于0.95，置信区间就是均值自己，如果不是向右加1，可能性相加，如果低于0.95，再向左加1，依次向右左增加。
          const lambda = n * p; // 样本数量*理论概率
          let l = Math.round(lambda);
          const itself = (1 - Poisson(lambda, l)) / 2;
          let pinP = 0,
            pinN = 0;
          if (itself >= 0.95) {
          } else {
            let tmpp = itself;
            for (let i = 1; i < k; i++) {
              const tmp1 = Poisson(lambda, l + i);
              let tmp2 = 0;
              if (l >= i) {
                tmp2 = Poisson(lambda, l - i);
              }
              if (tmp1 >= tmp2) {
                tmpp += tmp1;
                pinP++;
                if (tmpp >= 0.95) {
                  tmpp -= tmp1;
                  pinP--;
                  break;
                }
              } else {
                tmpp += tmp2;
                pinN++;
                if (tmpp >= 0.95) {
                  tmpp -= tmp2;
                  pinN--;
                  break;
                }
              }
            }
          }
          se[i][j] = [l - pinN, l + pinP];
        } else {
          // 五至八用正态分布
          const mu = n * p;
          se[i][j] = (k - mu) / Math.sqrt(mu * (1 - p)); // standard error
        }
      }
    }
    seSpan[m] = [];
    for (let i = 0; i < 6; i++) {
      if (i === 0 || i === 5) {
        let tmp1 = [],
          tmp2 = [];
        for (let k = 0; k < se[i].length; k++) {
          tmp1.push(se[i][k][0]);
          tmp2.push(se[i][k][1]);
        }
        const { sigma: sigma1, mean: mean1 } = Sigma(tmp1);
        const { sigma: sigma2, mean: mean2 } = Sigma(tmp2);
        seSpan[m][i] =
          "[" +
          +(mean1 - 1.96 * sigma1).toFixed(2) +
          "–" +
          +(mean1 + 1.96 * sigma1).toFixed(2) +
          ", " +
          +(mean2 - 1.96 * sigma2).toFixed(2) +
          "–" +
          +(mean2 + 1.96 * sigma2).toFixed(2) +
          "]";
      } else {
        const { sigma, mean } = Sigma(se[i]);
        seSpan[m][i] =
          "[" +
          (mean - 1.96 * sigma).toFixed(2) +
          ", " +
          (mean + 1.96 * sigma).toFixed(2) +
          "]";
      }
    }
    seSpan[m] += `\n`;
  }
  return seSpan;
};
// console.log(Test6(stdD, ListPAll));
const HexoConceive = (isTriple, all, bian, she, gua) => {
  // 是否是贾连翔的三分法，实用蓍草总数，变数，
  const result = [];
  // isYang = [];
  let BinaryString = "";
  for (let i = 0; i < 12; i++) {
    result[i] = isTriple
      ? HexoSub3(all, bian, she, 0)
      : HexoSub2(all, bian, she, gua, true, 0);
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
    result[i] = HexoSub2(49, 3, 4, 1, true, 0);
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
