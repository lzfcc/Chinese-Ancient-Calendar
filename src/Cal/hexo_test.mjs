import { ListPAll } from "./para_hexo.mjs";
import { HexoSub2, HexoSub3 } from "./hexo_sub.mjs";
// import { re } from "mathjs";
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
const Test1 = (Type, all, bian, she, gua, isRandomGua, loop, count) => {
  // 算法理论值
  let p = "";
  for (let j = count[0]; j <= count[1]; j++) {
    const Num = Array(10).fill(0);
    for (let k = 0; k < loop; k++) {
      let a = 0;
      if (Type === 2) {
        a = HexoSub2(all, bian, she, gua, isRandomGua, 0, j);
      } else if (Type === 3) {
        a = HexoSub3(all, bian, she, 0, j);
      } else if (Type === 4) {
        // a=
      }
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
// console.log(Test1(2, 49, 3, 4, 1, true, 1000000000, [17, 25])); // 朱熹
// console.log(Test1(3, 49, 3, 4, 0, true, 1000000000, [8, 20])); // 贾连翔
// console.log(Test1(2, 55, 5, 4, 1, true, 1000000000, [8, 20])); // 程浩
// console.log(Test1(2, 56, 5, 4, 1, true, 1000000000, [8, 20])); // 杨胜男
// console.log(Test1(2, 57, 5, 4, 1, true, 1000000000, [8, 20])); // 刘彬58
// console.log(Test1(2, 50, 4, 4, 1, true, 1000000, [8, 15])) // 五至八

// bootstrap计算置信区间。例如計算50卦，一共300爻，理論上應該出現95爻八，第一次出現100爻八，第二次90次，一共100000次，求這些次數的標準差
const Test4 = (Type, all, bian, she, gua, ListPAll, portion, loop) => {
  const output = [];
  for (let aa = 0; aa < ListPAll.length; aa++) {
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
        for (let k = 0; k < ListPAll[aa][6]; k++) {
          let a = 0;
          if (Type === 2) {
            a = HexoSub2(all, bian, she, gua, true, 0, m + portion[0]);
          } else if (Type === 3) {
            a = HexoSub3(all, bian, she, 0, m + portion[0]);
          } else if (Type === 4) {
            // a=
          }
          nums[a]++; // result among 4 ~ 9
        }
        for (let i = 4; i <= 9; i++) {
          n[i][j] = nums[i];
        }
      }
      for (let i = 4; i <= 9; i++) {
        // 标准差法
        const Fix = (x) => +((x * 100) / ListPAll[aa][6]).toFixed(1); // 100万次精确到0.1%，1亿次0.01%
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
// console.log(Test4(3, 49, 3, 4, 1, ListPAll, [8, 20], 1000000)); // 贾连翔 // 34分20秒100万次
// 分位法：[0.00, 0.33] | [0.65, 3.59] | [15.36, 24.18] | [35.62, 46.73] | [24.84, 34.97] | [4.58, 10.46]
// 标准差法：[-0.20, 0.29] | [0.36, 3.40] | [15.19, 24.09] | [35.57, 46.62] | [24.64, 34.88] | [4.42, 10.27]
// console.log(Test4(2, 55, 5, 4, 1,  ListPAll, [8,20], 1000000)); // 程浩
// console.log(Test4(2, 56, 5, 4, 1, ListPAll, [8,20], 1000000)); // 杨胜男
// console.log(Test4(2, 57, 5, 4, 1, ListPAll, [8,20], 1000000)); // 刘彬58
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