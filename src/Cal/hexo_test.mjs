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
  const interval95 = [
    (mean - 1.96 * sigma).toFixed(1),
    (mean + 1.96 * sigma).toFixed(1),
  ];
  const interval90 = [
    (mean - 1.645 * sigma).toFixed(1),
    (mean + 1.645 * sigma).toFixed(1),
  ];
  return { mean, sigma, interval90, interval95 };
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
const MaxSecond = (input) => {
  // 排除0。c:一二比, d一二和
  let n = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== 0) n.push(input[i]);
  }
  n.sort((a, b) => b - a);
  const max = n[0];
  const second = n[1];
  const c = +(((max - second) * 100) / second).toFixed(1);
  const d = +(max + second).toFixed(1);
  return { c, d };
};
const MaxSecondIV = [2.4, 76.9, 5]; // 一二比，一二和，数字数量
const MaxSecondXIII = [8.0, 65, 5];
const MaxSecondNull = [999, 999, 0]; // 不想测试某分系就用这个
// 遍历所有可能的筮法
const Test7 = (Type, b, gua, List, loop) => {
  let output4 = [],
    output5 = [],
    output6 = [],
    dif4 = [],
    dif5 = [],
    dif6 = [],
    sum4 = [],
    sum5 = [],
    sum6 = [];
  for (let j = 36; j <= 60; j++) {
    for (let bian = b[0]; bian <= b[1]; bian++) {
      for (let she = 3; she <= 5; she++) {
        const Num = new Object();
        for (let k = 0; k < loop; k++) {
          let a = 0;
          if (Type === 2) {
            a = HexoSub2(j, bian, she, gua, true, she);
          } else if (Type === 3) {
            a = HexoSub3(j, bian, she, she);
          } else if (Type === 4) {
            a = j - HexoSub2(j, bian, she, gua, true, she);
          } else if (Type === 5) {
            a = j - HexoSub3(j, bian, she, she);
          }
          if (Num[a] >= 0) Num[a]++;
          else Num[a] = 0;
        }
        const NumKey = Object.keys(Num);
        if (
          List[2] <= 4 &&
          NumKey.length === 4 &&
          NumKey.every((v, i) => v === ["6", "7", "8", "9"][i]) // 判断两个数组相等
        ) {
          let tmp = [];
          let tmpYang = 0;
          for (const [key, value] of Object.entries(Num)) {
            tmp.push(+((value * 100) / loop).toFixed(1));
            if (key % 2 === 1) tmpYang += (value * 100) / loop;
          }
          const { c, d } = MaxSecond(tmp.slice(1, 5));
          dif4.push(c);
          sum5.push(d);
          if (
            //   Math.abs(c - List[0]) < 20 &&
            //   Math.abs(d - List[1]) < 15 &&
            //   Math.abs(c - List[0]) + Math.abs(d - List[1]) < 25
            tmpYang >= 45 &&
            tmpYang <= 55
          ) {
            output4.push([
              "四" + j + "变" + bian + "揲" + she,
              c,
              d,
              tmpYang.toFixed(1),
            ]);
          }
          // output4.push(NumKey);
        } else if (
          List[2] <= 5 &&
          NumKey.length === 5 &&
          NumKey.every((v, i) => v === ["5", "6", "7", "8", "9"][i])
        ) {
          let tmp = [];
          let tmpYang = 0;
          tmp[0] = j + "变" + bian + "揲" + she;
          for (const [key, value] of Object.entries(Num)) {
            tmp.push(+((value * 100) / loop).toFixed(1));
            if (key % 2 === 1) tmpYang += (value * 100) / loop;
          }
          const { c, d } = MaxSecond(tmp.slice(1, 6));
          dif5.push(c);
          sum5.push(d);
          if (
            //   Math.abs(c - List[0]) < 20 &&
            //   Math.abs(d - List[1]) < 15 &&
            //   Math.abs(c - List[0]) + Math.abs(d - List[1]) < 25
            tmpYang >= 45 &&
            tmpYang <= 55
          ) {
            output5.push([
              "五" + j + "变" + bian + "揲" + she,
              c,
              d,
              tmpYang.toFixed(1),
            ]);
          }
          // output5.push(NumKey);
        } else if (
          List[2] <= 6 &&
          NumKey.length === 6 &&
          NumKey.every((v, i) => v === ["4", "5", "6", "7", "8", "9"][i])
        ) {
          let tmp = [];
          let tmpYang = 0;
          tmp[0] = j + "变" + bian + "揲" + she;
          for (const [key, value] of Object.entries(Num)) {
            tmp.push(+((value * 100) / loop).toFixed(1));
            if (key % 2 === 1) tmpYang += (value * 100) / loop;
          }
          const { c, d } = MaxSecond(tmp.slice(1, 7));
          dif6.push(c);
          sum6.push(d);
          if (
            //   Math.abs(c - List[0]) < 20 &&
            //   Math.abs(d - List[1]) < 15 &&
            //   Math.abs(c - List[0]) + Math.abs(d - List[1]) < 25
            tmpYang >= 45 &&
            tmpYang <= 55
          ) {
            output6.push([
              "六" + j + "变" + bian + "揲" + she,
              c,
              d,
              tmpYang.toFixed(1),
            ]);
          }
          // output6.push(NumKey);
        }
      }
    }
  }
  const sDif4 = Sigma(dif4).interval95;
  const sDif5 = Sigma(dif5).interval95;
  const sDif6 = Sigma(dif6).interval95;
  const sSum4 = Sigma(sum4).interval95;
  const sSum5 = Sigma(sum5).interval95;
  const sSum6 = Sigma(sum6).interval95;
  const outputA =
    "[" +
    sDif4 +
    "] [" +
    sSum4 +
    "] | [" +
    sDif5 +
    "] [" +
    sSum5 +
    "] | [" +
    sDif6 +
    "] [" +
    sSum6 +
    "]";
  const outputB = [...output4, ...output5, ...output6];
  return outputB.join(`\n`);
};
// console.log(Test7(2, [3, 5], 1, MaxSecondNull, 10000000));
// console.log(Test7(2, [3, 5], 0, MaxSecondNull, 10000000));
// console.log(Test7(3, [2, 3], 0, MaxSecondNull, 10000000));
// console.log(Test7(2, [3, 5], 0, MaxSecondIV, 10000000));
// console.log(Test7(3, [2, 3], 0, MaxSecondIV, 10000000));
// console.log(Test7(2, [3, 5], 1, MaxSecondXIII, 10000000));
// console.log(Test7(2, [3, 5], 0, MaxSecondXIII, 10000000));
// console.log(Test7(3, [2, 3], 0, MaxSecondXIII, 10000000));

const Test1 = (Type, all, bian, she, gua, isRandomGua, loop, count) => {
  // 算法理论值
  let p = "";
  for (let j = count[0]; j <= count[1]; j++) {
    const Num = new Object();
    for (let k = 0; k < loop; k++) {
      let a = 0;
      if (Type === 2) {
        a = HexoSub2(all, bian, she, gua, isRandomGua, she, j);
      } else if (Type === 3) {
        a = HexoSub3(all, bian, she, she, j);
      } else if (Type === 4) {
        a = all - HexoSub2(all, bian, she, gua, isRandomGua, she, j);
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
// console.log(Test1(2, 49, 3, 4, 1, true, 10000000, [0, 0])); // 朱熹
// console.log(Test1(3, 49, 3, 4, 0, true, 100000000, [0, 0])); // 贾连翔
// console.log(Test1(2, 55, 5, 4, 1, true, 100000000, [0, 0])); // 程浩
// console.log(Test1(2, 56, 5, 4, 1, true, 100000000, [0, 0])); // 杨胜男
// console.log(Test1(2, 57, 5, 4, 1, true, 100000000, [0, 0])); // 刘彬58
// console.log(Test1(2, 53, 4, 4, 1, true, 100000000, [0, 0])); // 李忠林
// console.log(Test1(2, 53, 5, 5, 1, true, 10000, [0, 0])); // 李忠林
// console.log(Test1(2, 52, 4, 4, 1, true, 10000000, [0, 0])); 
// console.log(Test1(2, 58, 5, 4, 1, true, 10000000, [0, 0])); 


// bootstrap计算置信区间。例如計算50卦，一共300爻，理論上應該出現95爻八，第一次出現100爻八，第二次90次，一共100000次，求這些次數的標準差
const ListPIV = [0, 4.6296, 38.8889, 37.963, 15.7407, 2.7778, 108];
const ListPIXS = [0, 13.3333, 16.6667, 40.0, 20.0, 10.0, 60];
const ListPXII = [0, 22.2222, 22.2222, 44.4444, 11.1111, 0, 45];
const ListPXIII = [0, 16.25, 31.25, 33.75, 15.0, 3.75, 80];
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
            a = HexoSub2(all, bian, she, gua, true, 0, m + portion[0]);
          } else if (Type === 3) {
            a = HexoSub3(all, bian, she, 0, m + portion[0]);
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
      output[aa] += Sigma(seArr).interval90 + " | ";
    }
  }
  return output.join(`\n`);
};
// console.log(Test4(3, 49, 3, 4, 1, ListPAll, [8, 20], 1000)); // 贾连翔 // 34分20秒100万次
// 分位法：[0.00, 0.33] | [0.65, 3.59] | [15.36, 24.18] | [35.62, 46.73] | [24.84, 34.97] | [4.58, 10.46]
// 标准差法：[-0.20, 0.29] | [0.36, 3.40] | [15.19, 24.09] | [35.57, 46.62] | [24.64, 34.88] | [4.42, 10.27]
// console.log(Test4(2, 55, 5, 4, 1,  ListPAll, [8,20], 1000000)); // 程浩
// console.log(Test4(2, 56, 5, 4, 1, ListPAll, [8,20], 1000000)); // 杨胜男
// console.log(Test4(2, 57, 5, 4, 1, ListPAll, [8,20], 1000000)); // 刘彬58
// console.log(Test4(2, 53, 4, 4, 1, ListPAll, [8, 20], 1000000)); // 李忠林
// 精度是數量的平方根！
// console.log(Test4(2, 39, 4, 3, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(2, 40, 4, 3, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(2, 51, 4, 4, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(2, 52, 4, 4, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(2, 58, 5, 4, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(2, 44, 5, 3, 1, ListPAll, [8, 20], 1000000));

// console.log(Test4(2, 42, 5, 3, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(2, 43, 5, 3, 1, ListPAll, [8, 20], 1000000));

// console.log(Test4(3, 38, 3, 3, 1, ListPAll, [8, 20], 1000000));
// console.log(Test4(3, 50, 3, 4, 1, ListPAll, [8, 20], 1000000));

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
