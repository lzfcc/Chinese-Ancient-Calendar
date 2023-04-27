import { HexoList64, HexoList8 } from './para_constant.mjs'
const NumList = "初二三四五六";
const stdZhuxi = [0, 0, 6.25, 31.25, 43.75, 18.75]
const stdJia = [0.21, 5.01, 34.74, 41.24, 16.68, 2.12]
const stdChenghao = [4.6875, 20.3125, 34.375, 28.125, 10.9375, 1.5625]
const stdLiubinC = [1.5625, 10.9375, 28.125, 34.375, 20.3125, 4.6875]
const stdYangshengnan = [3.125, 15.625, 31.25, 31.25, 15.625, 3.125]
const Random = (n, m) => Math.floor(Math.random() * (m - n + 1)) + n;
// [n,m] 范围内的随机整数
// console.log(Random(23,26))
const Sigma = n => { // 標準差
  const length = n.length
  let tmp1 = 0, tmp2 = 0
  for (let i = 0; i < length; i++) {
    tmp1 += n[i]
  }
  const mean = tmp1 / length
  for (let i = 0; i < length; i++) {
    tmp2 += (n[i] - mean) ** 2
  }
  const sigma = Math.sqrt(tmp2 / length)
  return { mean, sigma }
}
// console.log(Sigma([9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4]))
// =2.9832867780352594
// console.log(Sigma([9, 2, 5, 4, 12, 7]))
const HexoSub = (all, bian, p) => {
  for (let k = 0; k < bian; k++) {
    const small = Math.floor((all * p) / 100);
    let a = Random(small, all - small);
    const l = a - 1;
    const r = all - a;
    let modL = 0, modR = 0
    if (l > 0) modL = l % 4 || 4; // 0=4
    if (r > 0) modR = r % 4 || 4;
    all -= modL + modR + 1;
  }
  return all / 4;
};

const HexoSubJia = (all, bian, p) => { // 贾连翔《出土数字卦文献辑释》
  for (let k = 0; k < bian; k++) {
    const small = Math.floor((all * p) / 100);
    let a = Random(small, all - small);
    const l = a;
    const r = all - a;
    const small2 = Math.floor((r * p) / 100);
    const r1 = Random(small2, r - small2);
    const r2 = r - r1
    let modL = 0, modR1 = 0, modR2 = 0
    if (l > 0) modL = l % 4 || 4; // 0=4
    if (r1 > 0) modR1 = r1 % 4 || 4;
    if (r2 > 0) modR2 = r2 % 4 || 4;
    all -= modL + modR1 + modR2;
  }
  return all / 4;
};
const HexoConceive = (isJia, all, bian, p) => { // 杨胜男, 王承略：大衍揲扐法与清华简《筮法》揲扐法再探讨
  const result = [],
    isYang = [];
  let BinaryString = '';
  for (let i = 0; i < 12; i++) {
    result[i] = isJia ? HexoSubJia(all, bian, p) : HexoSub(all, bian, p);
    if (result[i] % 2 === 1) isYang[i] = 1;
    else isYang[i] = 0;
    BinaryString += isYang[i];
  }
  const BinaryStringA = BinaryString.slice(0, 3)
  const BinaryStringB = BinaryString.slice(3, 6)
  const BinaryStringC = BinaryString.slice(6, 9)
  const BinaryStringD = BinaryString.slice(9, 12)
  const BinaryA = parseInt(BinaryStringA, 2);
  const BinaryB = parseInt(BinaryStringB, 2);
  const BinaryC = parseInt(BinaryStringC, 2);
  const BinaryD = parseInt(BinaryStringD, 2);
  return { result, BinaryA, BinaryB, BinaryC, BinaryD };
};
const HexoConceiveCompact = (isJia, all, bian, p) => {
  const result = []
  for (let i = 0; i < 12; i++) {
    result[i] = isJia ? HexoSubJia(all, bian, p) : HexoSub(all, bian, p);
  }
  return { result };
};
// console.log(HexoConceive(false,56,5,17))
const HexoZhuxi = p => {
  const result = [],
    resultBian = [],
    isYangBen = [],
    isYangBian = [];
  let BinaryStringBen = '',
    BinaryStringBian = '';
  for (let i = 0; i < 6; i++) {
    result[i] = HexoSub(49, 3, p);
    resultBian[i] = result[i]
    if (result[i] % 2 === 1) isYangBen[i] = 1;
    else isYangBen[i] = 0;
    if (result[i] === 6) {
      isYangBian[i] = 1;
      resultBian[i] = 9;
    } else if (result[i] === 9) {
      isYangBian[i] = 0;
      resultBian[i] = 6;
    }
    else isYangBian[i] = isYangBen[i]
    BinaryStringBen += isYangBen[i];
    BinaryStringBian += isYangBian[i];
  }
  const BinaryBen = parseInt(BinaryStringBen, 2);
  const BinaryBian = parseInt(BinaryStringBian, 2);
  return { result, resultBian, BinaryBen, BinaryBian, isYangBen, isYangBian };
};
// console.log(HexoZhuxi(17))

const Test1 = (isJia, all, bian, std, loop) => { // 如何设置分堆范围
  const tmp = loop / 100
  const output = [];
  for (let j = 9; j < 24; j++) {
    let Num4 = 0, Num5 = 0, Num6 = 0, Num7 = 0, Num8 = 0, Num9 = 0;
    for (let k = 0; k < loop; k++) {
      const a = isJia ? HexoSubJia(all, bian, j) : HexoSub(all, bian, j);
      if (a === 4) Num4++;
      else if (a === 5) Num5++;
      else if (a === 6) Num6++;
      else if (a === 7) Num7++;
      else if (a === 8) Num8++;
      else if (a === 9) Num9++;
    }
    const p4 = Num4 / tmp
    const p5 = Num5 / tmp
    const p6 = Num6 / tmp
    const p7 = Num7 / tmp
    const p8 = Num8 / tmp
    const p9 = Num9 / tmp
    const d4 = p4 - std[0];
    const d5 = p5 - std[1];
    const d6 = p6 - std[2];
    const d7 = p7 - std[3];
    const d8 = p8 - std[4];
    const d9 = p9 - std[5];
    const sumDelta =
      Math.abs(d4) + Math.abs(d5) + Math.abs(d6) + Math.abs(d7) + Math.abs(d8) + Math.abs(d9); //为什么绝对值相加？？
    output[j] = j + "% | " + p4.toFixed(2) + " | " + p5.toFixed(2) + " | " + p6.toFixed(2) + " | " + p7.toFixed(2) + " | " + p8.toFixed(2) + " | " + p9.toFixed(2) + " | " + sumDelta.toFixed(2) + " | " + `\n`;
  }
  return output;
};
// console.log(Test1(false, 49, 3, stdZhuxi, 1000000)) // 朱熹
// console.log(Test1(true, 49, 3, stdJia, 1000000)) // 贾连翔
// console.log(Test1(false, 55, 5, stdChenghao, 10000000)) // 程浩
// console.log(Test1(false, 56, 5, stdYangshengnan, 100000000)) // 杨胜男
// console.log(Test1(false, 57, 5, stdLiubinC, 100000000)) // 刘彬58

// 例如計算50卦，一共300爻，理論上應該出現95爻八，第一次出現100爻八，第二次90次，一共100000次，求這些次數的標準差
const Test4 = (isZhuxi, isJia, all, bian, p, sample, loop) => {
  const tmp = sample * 6 / 100
  const p4 = [], p5 = [], p6 = [], p7 = [], p8 = [], p9 = []
  for (let j = 0; j < loop; j++) {
    let Num4 = 0, Num5 = 0, Num6 = 0, Num7 = 0, Num8 = 0, Num9 = 0
    for (let k = 0; k < sample; k++) {
      const { result } = isZhuxi ? HexoZhuxi(p) : HexoConceiveCompact(isJia, all, bian, p);
      for (let i = 0; i < 6; i++) {
        if (result[i] === 4) Num4++
        else if (result[i] === 5) Num5++
        else if (result[i] === 6) Num6++
        else if (result[i] === 7) Num7++
        else if (result[i] === 8) Num8++
        else if (result[i] === 9) Num9++
      }
    }
    p4[j] = Num4 / tmp
    p5[j] = Num5 / tmp
    p6[j] = Num6 / tmp
    p7[j] = Num7 / tmp
    p8[j] = Num8 / tmp
    p9[j] = Num9 / tmp
  }
  const { sigma: s4, mean: m4 } = Sigma(p4)
  const { sigma: s5, mean: m5 } = Sigma(p5)
  const { sigma: s6, mean: m6 } = Sigma(p6)
  const { sigma: s7, mean: m7 } = Sigma(p7)
  const { sigma: s8, mean: m8 } = Sigma(p8)
  const { sigma: s9, mean: m9 } = Sigma(p9)
  return m4.toFixed(4) + ' | ' + s4.toFixed(4) + ' | ' + `\n`
    + m5.toFixed(4) + ' | ' + s5.toFixed(4) + ' | ' + `\n`
    + m6.toFixed(4) + ' | ' + s6.toFixed(4) + ' | ' + `\n`
    + m7.toFixed(4) + ' | ' + s7.toFixed(4) + ' | ' + `\n`
    + m8.toFixed(4) + ' | ' + s8.toFixed(4) + ' | ' + `\n`
    + m9.toFixed(4) + ' | ' + s9.toFixed(4)
}
// console.log(Test4(true, false, 49, 3, 17, 50, 1000000)) // 朱熹
// console.log(Test4(false, true, 49, 3, 14, 47, 10000000)) // 贾连翔
// console.log(Test4(false, false, 55, 5, 13, 47, 10000000)) // 程浩
// console.log(Test4(false, false, 56, 5, 12, 47, 10000000)) // 杨胜男
// console.log(Test4(false, false, 57, 5, 12, 47, 10000000)) // 刘彬58
// sample=50,j=10000000: s6= 1.383  s7= 2.681 s8= 2.867 s9= 2.237
// sample=500,j=1000000: s6= 0.437  s7= 0.848 s8= 0.907 s9= 0.708
// 精度是數量的平方根！
const Test5 = (num, loop, std, sigma) => { // 檢驗test4
  let Total = 0
  for (let j = 0; j < loop; j++) {
    let Num8 = 0
    for (let i = 0; i < num; i++) {
      const { result } = HexoZhuxi(17);
      for (let i = 0; i < 6; i++) {
        if (result[i] === 8) Num8++
      }
    }
    const p8 = Num8 / (num * 6) * 100
    if (p8 > std - 2 * sigma && p8 < std + 2 * sigma) Total++
  }
  return Total / loop;
};
// console.log(Test5(500, 1000000, 43.75, 0.91))
// Test5(500, 1000000, 43.75, 0.91)=0.946396

const probability = [
  5.960464478, 3.576278687, 2.145767212, 1.287460327, 0.7724761963,
  0.4634857178, 0.2780914307
]; // 朱熹筮法變卦概率%
const Compare = (n, loop) => {
  n = (n * 100) / loop;
  let min = Infinity;
  for (let i = 0; i < probability.length; i++) {
    const result = Math.abs(n - probability[i]);
    if (result < min) min = result
  }
  return min;
};
// console.log(Compare(596, 10000))

const Test2 = loop => { // 完整推卦，分别得出本卦变卦误差，看如何设置分堆
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
    let errorBen = 0, errorBian = 0, totalErrorBen = 0, totalErrorBian = 0;
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

const HexoTrue = (all, loop) => { // 遍历每种可能性，得出理论概率
  const intAll = all
  let count = 0
  let Num4 = 0, Num5 = 0, Num6 = 0, Num7 = 0, Num8 = 0, Num9 = 0;
  for (let i = 1; i < intAll; i++) { // 不知道咋写了，这里只有一次，照理说三变每变都应该从1开始循环。
    let a = i;
    for (let k = 0; k < loop; k++) {
      const l = a - 1;
      const r = all - a;
      let modL = 0, modR = 0
      if (l > 0) modL = l % 4 || 4; // 0=4
      if (r > 0) modR = r % 4 || 4;
      all -= modL + modR + 1;
    }
    all /= 4
    if (all === 6) Num6++
    else if (all === 7) Num7++
    else if (all === 8) Num8++
    else if (all === 9) Num9++
    count++
    all = intAll
  }
  const p6 = Num6 / count * 100
  const p7 = Num7 / count * 100
  const p8 = Num8 / count * 100
  const p9 = Num9 / count * 100
  return '六' + p6 + '七' + p7 + '八' + p8 + '九' + p9;
};
// console.log(HexoTrue(49, 3))

export const HexoZhuxiPrint = () => {
  const { result, resultBian, BinaryBen, BinaryBian, isYangBen, isYangBian } = HexoZhuxi(17);
  const HexoAllBen = HexoList64[BinaryBen];
  const NameBen = HexoAllBen.slice(0, HexoAllBen.length - 1);
  const GraphBen = HexoAllBen.slice(-1);
  const HexoAllBian = HexoList64[BinaryBian];
  const NameBian = HexoAllBian.slice(0, HexoAllBian.length - 1);
  const GraphBian = HexoAllBian.slice(-1);
  const Print1 = [];
  let NumBian = ''
  for (let i = 0; i < 6; i++) {
    if (isYangBen[i] !== isYangBian[i]) {
      NumBian += NumList[i]
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
  const { result: resultA, BinaryBen: BinaryA, isYangBen: isYangA } = HexoZhuxi(17);
  const { result: resultB, BinaryBen: BinaryB, isYangBen: isYangB } = HexoZhuxi(17);
  const HexoAllA = HexoList64[BinaryA];
  const NameA = HexoAllA.slice(0, HexoAllA.length - 1);
  const GraphA = HexoAllA.slice(-1);
  const HexoAllB = HexoList64[BinaryB];
  const NameB = HexoAllB.slice(0, HexoAllB.length - 1);
  const GraphB = HexoAllB.slice(-1);
  const Print1 = [];
  let NumBian = ''
  for (let i = 0; i < 6; i++) {
    if (isYangA[i] !== isYangB[i]) {
      NumBian += NumList[i]
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
  const { result, BinaryA, BinaryB, BinaryC, BinaryD } = HexoConceive(false, 56, 5, 14); // 清華簡算法7%誤差最低
  const HexoAllA = HexoList8[BinaryA];
  const HexoAllB = HexoList8[BinaryB];
  const HexoAllC = HexoList8[BinaryC];
  const HexoAllD = HexoList8[BinaryD];
  const Print1 = [];
  for (let i = 0; i < 3; i++) {
    Print1[i] = {
      data: [`<div style="margin:0 0 -.5em 0">${result[11 - i]}</div>`, `<div style="margin:0 2em -.5em 0">${result[5 - i]}</div>`] // 倒序
    };
  }
  Print1[3] = {
    data: [HexoAllD, HexoAllB]
  }
  for (let i = 4; i < 7; i++) {
    Print1[i] = {
      data: [`<div style="margin:0 0 -.5em 0">${result[12 - i]}</div>`, `<div style="margin:0 2em -.5em 0">${result[6 - i]}</div>`], // 倒序
    };
  }
  Print1[7] = {
    data: [HexoAllC, HexoAllA]
  }
  return Print1;
};

const QinghuaList = [
  ['1', '1', '1', '1', '1', '1'], ['1', '1', '6', '1', '6', '1'],
  ['1', '6', '6', '1', '1', '1'], ['1', '6', '1', '6', '6', '1'],
  ['6', '6', '1', '6', '1', '6'], ['6', '1', '6', '6', '1', '1'],
  ['6', '1', '1', '6', '1', '1'], ['1', '6', '1', '6', '6', '1'],
  ['6', '6', '1', '6', '1', '6'], ['6', '1', '6', '6', '5', '9'],
  ['6', '1', '1', '6', '1', '1'], ['1', '6', '1', '9', '5', '6'],
  ['6', '6', '1', '6', '6', '6'], ['1', '1', '6', '1', '6', '1'],
  ['1', '6', '6', '6', '6', '6'], ['1', '1', '1', '1', '6', '6'],
  ['6', '1', '6', '6', '6', '1'], ['1', '6', '1', '6', '1', '1'],
  ['1', '1', '1', '6', '6', '6'], ['6', '6', '6', '1', '1', '6'],
  ['1', '6', '1', '1', '6', '6'], ['1', '1', '6', '6', '6', '6'],
  ['6', '6', '6', '6', '1', '1'], ['6', '1', '1', '1', '6', '1'],
  ['6', '1', '6', '6', '6', '1'], ['6', '6', '1', '9', '1', '6'],
  ['6', '6', '6', '1', '6', '1'], ['6', '1', '1', '1', '1', '1'],
  ['6', '6', '1', '6', '1', '6'], ['4', '5', '9', '1', '1', '6'],
  ['6', '1', '1', '1', '1', '1'], ['6', '6', '6', '6', '1', '1'],
  ['1', '1', '1', '6', '6', '6'], ['1', '1', '6', '8', '1', '1'],
  ['6', '6', '1', '1', '1', '6'], ['6', '1', '1', '1', '6', '5'],
  ['6', '1', '6', '1', '6', '1'], ['6', '1', '1', '9', '1', '6'],
  ['1', '6', '6', '6', '1', '1'], ['1', '6', '1', '1', '1', '4'],
  ['6', '6', '6', '6', '6', '6'], ['6', '6', '6', '1', '1', '6'],
  ['1', '1', '1', '1', '1', '1'], ['1', '1', '1', '1', '6', '6'],
  ['6', '1', '1', '1', '1', '1'], ['6', '6', '6', '6', '6', '6'],
  ['1', '6', '6', '6', '6', '6'], ['1', '1', '1', '6', '1', '1'],
  ['6', '6', '1', '1', '6', '1'], ['6', '1', '6', '6', '1', '1'],
  ['1', '6', '6', '1', '1', '6'], ['1', '1', '1', '6', '6', '6'],
  ['6', '6', '6', '1', '6', '6'], ['1', '6', '1', '6', '1', '1'],
  ['1', '6', '6', '1', '1', '1'], ['6', '1', '6', '1', '1', '6'],
  ['1', '6', '6', '1', '1', '1'], ['6', '1', '1', '6', '6', '1'],
  ['1', '6', '6', '1', '1', '1'], ['9', '8', '1', '1', '6', '6'],
  ['6', '6', '6', '1', '1', '6'], ['1', '1', '6', '6', '1', '6'],
  ['6', '6', '1', '1', '1', '1'], ['1', '6', '6', '1', '6', '1'],
  ['1', '6', '6', '1', '1', '1'], ['1', '6', '1', '6', '6', '6'],
  ['1', '1', '6', '1', '1', '1'], ['1', '6', '1', '6', '6', '6'],
  ['6', '1', '1', '1', '6', '6'], ['1', '1', '6', '1', '1', '1'],
  ['6', '1', '1', '1', '6', '6'], ['6', '6', '6', '6', '1', '6'],
  ['6', '1', '1', '1', '6', '6'], ['1', '1', '6', '6', '1', '6'],
  ['6', '6', '6', '1', '6', '6'], ['1', '1', '6', '1', '6', '1'],
  ['6', '1', '1', '1', '1', '1'], ['6', '6', '6', '1', '6', '6'],
  ['9', '1', '1', '9', '1', '1'], ['9', '1', '1', '9', '6', '6'],
  ['9', '1', '1', '9', '1', '1'], ['9', '1', '1', '8', '6', '6'],
  ['9', '1', '1', '9', '1', '1'], ['8', '6', '1', '8', '6', '6'],
  ['9', '1', '1', '9', '1', '1'], ['9', '6', '6', '8', '6', '6'],
  ['6', '6', '6', '6', '6', '6'], ['6', '6', '6', '1', '1', '6'],
  ['6', '6', '6', '6', '6', '6'], ['6', '6', '6', '1', '6', '1'],
  ['6', '6', '6', '6', '6', '6'], ['6', '6', '6', '6', '1', '1'],
  ['6', '6', '6', '6', '6', '6'], ['6', '6', '6', '9', '6', '6'],
  ['6', '1', '6', '1', '6', '1'], ['1', '6', '1', '6', '1', '1'],
  ['6', '1', '6', '1', '6', '1'], ['1', '6', '1', '1', '1', '6'],
  ['6', '6', '1', '6', '6', '1'], ['6', '6', '1', '6', '5', '4'],
  ['6', '6', '6', '1', '1', '1'], ['1', '1', '6', '6', '6', '1'],
  ['4', '5', '6', '1', '8', '9'], ['4', '5', '6', '1', '8', '9'],
  ['9', '8', '1', '6', '5', '4'], ['9', '8', '1', '6', '5', '4'],
  ['6', '1', '5', '5', '6', '6'], ['1', '1', '5', '5', '6', '1'],
  ['6', '1', '6', '1', '6', '1'], ['6', '6', '1', '6', '1', '1'],
  ['6', '6', '6', '1', '6', '6'], ['1', '6', '1', '6', '6', '1'],
  ['1', '1', '1', '6', '1', '1'], ['6', '1', '6', '1', '1', '6']
]
const CountYao = () => { // 統計各爻出現次數
  let four = 0, five = 0, six = 0, one = 0, eight = 0, nine = 0
  const QinghuaListFlat = QinghuaList.flat()
  for (let i = 0; i < QinghuaListFlat.length; i++) {
    if (parseInt(QinghuaListFlat[i]) === 4) {
      four++
    } else if (parseInt(QinghuaListFlat[i]) === 5) {
      five++
    } else if (parseInt(QinghuaListFlat[i]) === 6) {
      six++
    } else if (parseInt(QinghuaListFlat[i]) === 1) {
      one++
    } else if (parseInt(QinghuaListFlat[i]) === 8) {
      eight++
    } else if (parseInt(QinghuaListFlat[i]) === 9) {
      nine++
    }
  }
  return [four, five, six, one, eight, nine]
}
// console.log(CountYao())

const TestQinghua2 = () => {
  const loop = 114
  const bigloop = 10000000
  const error = []
  for (let j = 0; j < bigloop; j++) {
    let Num4 = 0, Num5 = 0, Num6 = 0, Num7 = 0, Num8 = 0, Num9 = 0, yin = 0, yang = 0
    for (let k = 0; k < loop; k++) {
      const a = HexoSub(56, 5, 7);
      if (a === 4) {
        Num4++;
        yin++
      } else if (a === 5) {
        Num5++;
        yang++
      } else if (a === 6) {
        Num6++;
        yin++
      } else if (a === 7) {
        Num7++;
        yang++
      } else if (a === 8) {
        Num8++;
        yin++
      } else if (a === 9) {
        Num9++;
        yang++
      }
    }
    error[j] = Math.abs(yin / loop - 0.5)
  }
  let sum = 0
  error.forEach(a => {
    sum += a;
  });
  sum /= bigloop
  return sum
}
  // console.log(TestQinghua2())
