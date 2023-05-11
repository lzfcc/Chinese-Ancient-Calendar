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
// 遍历所有可能的筮法
const Test7 = (Type, loop) => {
  let p4 = "",
    p5 = "",
    p6 = "";
  for (let j = 36; j <= 60; j++) {
    for (let bian = 3; bian <= 5; bian++) {
      for (let she = 3; she <= 5; she++) {
        const Num = new Object();
        for (let k = 0; k < loop; k++) {
          let a = 0;
          if (Type === 2) {
            a = HexoSub2(j, bian, she, 1, true, she).r;
          } else if (Type === 3) {
            a = HexoSub3(j, bian, she, she);
          } else if (Type === 4) {
            a = HexoSub2(j, bian, she, 1, true, she).m;
          }
          if (Num[a] >= 0) Num[a]++;
          else Num[a] = 0;
        }
        if (Object.keys(Num).length === 4) {
          p4 += "|" + j + "变" + bian + "揲" + she + " | ";
          for (const [key, value] of Object.entries(Num)) {
            p4 += ((value * 100) / loop).toFixed(1) + " | ";
          }
          p4 += `\n`;
        } else if (Object.keys(Num).length === 5) {
          p5 += "|" + j + "变" + bian + "揲" + she + " | ";
          for (const [key, value] of Object.entries(Num)) {
            p5 += ((value * 100) / loop).toFixed(1) + " | ";
          }
          p5 += `\n`;
        } else if (Object.keys(Num).length === 6) {
          p6 += "|" + j + "变" + bian + "揲" + she + " | ";
          for (const [key, value] of Object.entries(Num)) {
            p6 += ((value * 100) / loop).toFixed(1) + " | ";
          }
          p6 += `\n`;
        }
      }
    }
  }
  return p4 + p5 + p6;
};
// console.log(Test7(3, 1000000));
const Test1 = (Type, all, bian, she, gua, isRandomGua, loop, count) => {
  // 算法理论值
  let p = "";
  for (let j = count[0]; j <= count[1]; j++) {
    const Num = new Object();
    for (let k = 0; k < loop; k++) {
      let a = 0;
      if (Type === 2) {
        a = HexoSub2(all, bian, she, gua, isRandomGua, 0, j).r;
      } else if (Type === 3) {
        a = HexoSub3(all, bian, she, 0, j);
      } else if (Type === 4) {
        a = HexoSub2(all, bian, she, gua, isRandomGua, 0, j).m;
      }
      if (Num[a] >= 0) Num[a]++;
      else Num[a] = 0;
    }
    p += "| " + j + "% | ";
    for (const [key, value] of Object.entries(Num)) {
      p += ((value * 100) / loop).toFixed(2) + " | ";
    }
    p += `\n`;
  }
  return p;
};
// console.log(Test1(2, 49, 3, 4, 1, true, 1000000000, [0, 0])); // 朱熹
// console.log(Test1(3, 49, 3, 4, 0, true, 1000000000, [8, 20])); // 贾连翔
// console.log(Test1(2, 55, 5, 4, 1, true, 1000000000, [8, 20])); // 程浩
// console.log(Test1(2, 56, 5, 4, 1, true, 1000000000, [8, 20])); // 杨胜男
// console.log(Test1(2, 57, 5, 4, 1, true, 1000000000, [8, 20])); // 刘彬58
// console.log(Test1(2, 45, 4, 4, 1, true, 1000000, [8, 15])) // 五至八
// console.log(Test1(4, 49, 5, 4, 1, true, 10000000, [0, 0])) // 挂扐法

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
        const Num = Array(10).fill(0);
        for (let k = 0; k < ListPAll[aa][6]; k++) {
          let a = 0;
          if (Type === 2) {
            a = HexoSub2(all, bian, she, gua, true, 0, m + portion[0]).r;
          } else if (Type === 3) {
            a = HexoSub3(all, bian, she, 0, m + portion[0]);
          } else if (Type === 4) {
            a = HexoSub2(all, bian, she, gua, true, 0, m + portion[0]).m;
          }
          Num[a]++; // result among 4 ~ 9
        }
        for (let i = 4; i <= 9; i++) {
          n[i][j] = Num[i];
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