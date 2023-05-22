import { ListPAll, ListPSheleAll } from "./para_hexo.mjs";
import { HexoSub2, HexoSub3 } from "./hexo_sub.mjs";
// import { re } from "mathjs";
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
  const interval90 = [
    (mean - 1.645 * sigma).toFixed(1),
    (mean + 1.645 * sigma).toFixed(1),
  ];
  return { mean, sigma, interval90 };
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

// 遍历所有可能的筮法
const Test7 = (Type, b, gua, loop) => {
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
            a = HexoSub3(j, bian, she, 0);
          } else if (Type === 4) {
            a = j - HexoSub2(j, bian, she, gua, true, she);
          } else if (Type === 5) {
            a = j - HexoSub3(j, bian, she, she);
          }
          if (Num[a] >= 0) Num[a]++;
          else {
            Num[a] = 0;
            Num[a]++;
          }
        }
        const NumKey = Object.keys(Num);
        if (
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
          if (tmpYang >= 45 && tmpYang <= 55) {
            output4.push([
              "四" + j + "变" + bian + "揲" + she,
              c,
              d,
              tmpYang.toFixed(1),
            ]);
          }
        } else if (
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
          if (tmpYang >= 45 && tmpYang <= 55) {
            output5.push([
              "五" + j + "变" + bian + "揲" + she,
              c,
              d,
              tmpYang.toFixed(1),
            ]);
          }
        } else if (
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
          if (tmpYang >= 45 && tmpYang <= 55) {
            output6.push([
              "六" + j + "变" + bian + "揲" + she,
              c,
              d,
              tmpYang.toFixed(1),
            ]);
          }
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
// console.log(Test7(2, [3, 5], 0, 10000000));
// console.log(Test7(2, [3, 5], 1, 10000000));
// console.log(Test7(3, [3, 3], 0, 10000000));

const Test1 = (Type, all, bian, she, gua, isRandomGua, count, loop) => {
  // 算法理论值
  let p = "";
  for (let j = count[0]; j <= count[1]; j++) {
    // for (let j = 0; j < 1; j++) {
    const Num = new Object();
    for (let k = 0; k < loop; k++) {
      let a = 0;
      if (Type === 2) {
        a = HexoSub2(all, bian, she, gua, isRandomGua, 0, j);
      } else if (Type === 3) {
        a = HexoSub3(all, bian, she, 0, j);
      } else if (Type === 4) {
        a = all - HexoSub2(all, bian, she, gua, isRandomGua, 0, j);
      }
      if (Num[a] >= 0) Num[a]++;
      else {
        Num[a] = 0;
        Num[a]++;
      }
    }
    p += "| " + j + "% | ";
    // p += "[";
    for (const [key, value] of Object.entries(Num)) {
      p += ((value * 100) / loop).toFixed(2) + " , ";
    }
    // p += "]" + `\n`;
    p += `\n`;
  }
  return p;
};
// console.log(Test1(2, 49, 3, 4, 1, true, [25, 35], 100000000)); // 朱熹
// console.log(Test1(2, 39, 4, 3, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 40, 4, 3, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 51, 4, 4, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 52, 4, 4, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 53, 4, 4, 1, true, [8, 20], 100000000)); // 李忠林
// console.log(Test1(2, 44, 5, 3, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 58, 5, 4, 1, true, [8, 20], 100000000));

// console.log(Test1(2, 42, 5, 3, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 43, 5, 3, 1, true, [8, 20], 100000000));
// console.log(Test1(2, 55, 5, 4, 1, true, [8, 20], 100000000)); // 程浩
// console.log(Test1(2, 56, 5, 4, 1, true, [8, 20], 100000000)); // 杨胜男
// console.log(Test1(2, 57, 5, 4, 1, true, [8, 20], 100000000)); // 刘彬58

// console.log(Test1(3, 38, 3, 3, 1, true, [8, 20], 100000000));
// console.log(Test1(3, 49, 3, 4, 1, true, [0, 35], 100000000)); // 贾连翔
// console.log(Test1(3, 50, 3, 4, 1, true, [8, 20], 108));

// 蒙特卡羅计算置信区间。例如計算50卦，一共300爻，理論上應該出現95爻八，第一次出現100爻八，第二次90次，一共100000次，求這些次數的標準差
const Test4 = (Type, all, bian, she, gua, ListPAll, portion, loop) => {
  const output = [];
  for (let l = 0; l < ListPAll.length; l++) {
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
        for (let k = 0; k < ListPAll[l][6]; k++) {
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
        const Fix = (x) => +((x * 100) / ListPAll[l][6]).toFixed(1);
        let { sigma, mean } = Sigma1(n[i]);
        sigma = Fix(sigma);
        mean = Fix(mean);
        const se = (mean - ListPAll[l][i - 4]) / sigma;
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
    output[l] = "| ";
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
      output[l] += Sigma(seArr).interval90 + " | ";
    }
  }
  return output.join(`\n`);
};

// 分位法：[0.00, 0.33] | [0.65, 3.59] | [15.36, 24.18] | [35.62, 46.73] | [24.84, 34.97] | [4.58, 10.46]
// 标准差法：[-0.20, 0.29] | [0.36, 3.40] | [15.19, 24.09] | [35.57, 46.62] | [24.64, 34.88] | [4.42, 10.27]


// bootstrap求均值、标准差，再算差了几个标准差
const Boot = (ListP, ListPSheleAll, loop) => {
  const output = [];
  for (let m = 0; m < ListPSheleAll.length; m++) {
    let se5 = [],
      se6 = [],
      se7 = [],
      se8 = [],
      se9 = [];
    for (let l = 0; l < ListPSheleAll[m].length; l++) {
      const ListShele = ListPSheleAll[m][l].slice(-5);
      for (let i = 0; i < 5; i++) {
        ///////
        // 五至九
        const length = ListP[5];
        const N1 = Math.round((ListP[i] * length) / 100);
        const sample = [...Array(N1).fill(1), ...Array(length - N1).fill(0)];
        let tmp1 = [];
        for (let j = 0; j < loop; j++) {
          let tmp = 0;
          for (let k = 0; k < length; k++) {
            tmp += sample[Random(0, length - 1)];
          }
          tmp1.push(tmp);
        }
        let { sigma, mean } = Sigma1(tmp1);
        const Fix = (x, n) => +((x * 100) / length).toFixed(n || 1);
        sigma = Fix(sigma);
        mean = Fix(mean);
        const se = (ListShele[i] - mean) / sigma;
        if (i === 0) {
          se5.push(se);
        } else if (i === 1) {
          se6.push(se);
        } else if (i === 2) {
          se7.push(se);
        } else if (i === 3) {
          se8.push(se);
        } else if (i === 4) {
          se9.push(se);
        }
      }
    }
    output[m] = "| ";
    for (let i = 0; i < 5; i++) {
      let seArr = [];
      if (i === 0) {
        seArr = se5;
      } else if (i === 1) {
        seArr = se6;
      } else if (i === 2) {
        seArr = se7;
      } else if (i === 3) {
        seArr = se8;
      } else if (i === 4) {
        seArr = se9;
      }
      output[m] += Sigma(seArr).interval90 + " | ";
    }
  }
  return output.join(`\n`);
};

// bootstrap假设检验
const BootH = (ListP, ListPSheleAll, loop) => {
  const output = [];
  for (let m = 0; m < ListPSheleAll.length; m++) {
    let se5 = [],
      se6 = [],
      se7 = [],
      se8 = [],
      se9 = [];
    for (let l = 0; l < ListPSheleAll[m].length; l++) {
      const ListShele = ListPSheleAll[m][l].slice(-5);
      for (let i = 0; i < 5; i++) {
        const length = ListP[5];
        const N1 = Math.round((ListP[i] * length) / 100);
        const sample = [...Array(N1).fill(1), ...Array(length - N1).fill(0)];
        let z = [];
        let cc = 0;
        for (let k = 0; k < length; k++) {
          z[k] = sample[k] * 100 - ListP[i] + ListShele[i]; // 平移变换形成新的样本
        }
        for (let j = 0; j < loop; j++) {
          let tmp = [];
          for (let k = 0; k < length; k++) {
            tmp[k] = z[Random(0, length - 1)];
          }
          const tmpMean = Sigma(tmp).mean; // loop个tmpMean的mean就是ListShele[i]
          if (ListShele[i] > ListP[i]) {
            if (tmpMean > ListP[i] || tmpMean < -ListP[i]) cc++;
          } else if (ListShele[i] < ListP[i]) {
            if (tmpMean < ListP[i] && tmpMean > -ListP[i]) cc++;
          }
        }
        // const se = (cc * 100) / loop;
        const se = (Math.abs(cc - loop / 2) * 2 * 100) / loop;
        if (i === 0) {
          se5.push(se);
        } else if (i === 1) {
          se6.push(se);
        } else if (i === 2) {
          se7.push(se);
        } else if (i === 3) {
          se8.push(se);
        } else if (i === 4) {
          se9.push(se);
        }
      }
    }
    output[m] = "| ";
    for (let i = 0; i < 5; i++) {
      let seArr = [];
      if (i === 0) {
        seArr = se5;
      } else if (i === 1) {
        seArr = se6;
      } else if (i === 2) {
        seArr = se7;
      } else if (i === 3) {
        seArr = se8;
      } else if (i === 4) {
        seArr = se9;
      }
      output[m] += Sigma(seArr).interval90 + " | ";
    }
  }
  return output.join(`\n`);
};
// 1楚S1、1殷周、1殷周S1、7殷周S2、1晚S1、1晚S2、双
// console.log(
//   BootH([4.6296, 38.8889, 37.963, 15.7407, 2.7778, 108], ListPSheleAll, 3000000) // 8種揲扐法100000次82s
// );
// console.log(
//   BootH([7.7778, 36.6667, 47.7778, 7.7778, 0, 90], ListPSheleAll, 3000000) // 1YZ
// );
// console.log(
//   BootH([11.67, 30.0, 46.67, 11.67, 0, 60], ListPSheleAll, 3000000) // 1YZS1
// );
// console.log(
//   BootH([10.84, 38.55, 34.94, 13.25, 2.41, 83], ListPSheleAll, 3000000)
// ); // 7YZS2
// console.log(
//   BootH([7.02, 21.05, 42.11, 24.56, 5.26, 114], ListPSheleAll, 3000000)
// ); // 1MS1
// console.log(
//   BootH([12.12, 21.21, 36.36, 21.21, 9.09, 66], ListPSheleAll, 3000000)
// ); // 1MS2
// console.log(
//   BootH([8.3333, 35.6061, 38.6364, 15.9091, 1.5152, 132], ListPSheleAll, 3000000)
// ); // Duo
// console.log ([...Array(20).fill(1), ...Array(88).fill(0)].toString())

const Jugelizi = (List, u0, loop) => {
  const mean = Sigma(List).mean;
  let k = 0;
  let z = [];
  for (let i = 0; i < List.length; i++) {
    z[i] = List[i] - mean + u0;
  }
  for (let j = 0; j < loop; j++) {
    const tmp = [];
    for (let i = 0; i < List.length; i++) {
      tmp[i] = z[Random(0, List.length - 1)];
    }
    if (Sigma(tmp).mean > mean) k++;
  }
  return k / loop;
};
// console.log(
//   Jugelizi(
//     [
//       159, 280, 101, 212, 224, 379, 179, 264, 222, 362, 168, 250, 149, 260, 485,
//       170,
//     ],
//     225,
//     10000
//   )
// );
// console.log(
//   Jugelizi(
//     [
//       4.07, 4.88, 5.1, 5.26, 5.27, 5.29, 5.29, 5.3, 5.34, 5.34, 5.36, 5.39,
//       5.42, 5.44, 5.46, 5.47, 5.5, 5.53, 5.55, 5.57, 5.58, 5.61, 5.62, 5.63,
//       5.65, 5.75, 5.79, 5.85, 5.86,
//     ],
//     5.51,
//     100000
//   )
// );
