const HexoList = [
  "坤䷁",
  "剝䷖",
  "比䷇",
  "觀䷓",
  "豫䷏",
  "晉䷢",
  "萃䷬",
  "否䷋",
  "謙䷎",
  "艮䷳",
  "蹇䷦",
  "漸䷴",
  "小過䷽",
  "旅䷷",
  "咸䷞",
  "遯䷠",
  "師䷆",
  "蒙䷃",
  "坎䷜",
  "渙䷺",
  "解䷧",
  "未濟䷿",
  "困䷮",
  "訟䷅",
  "升䷭",
  "蠱䷑",
  "井䷯",
  "巽䷸",
  "恆䷟",
  "鼎䷱",
  "大過䷛",
  "姤䷫",
  "復䷗",
  "頤䷚",
  "屯䷂",
  "益䷩",
  "震䷲",
  "噬嗑䷔",
  "隨䷐",
  "无妄䷘",
  "明夷䷣",
  "賁䷕",
  "旣濟䷾",
  "家人䷤",
  "豐䷶",
  "離䷝",
  "革䷰",
  "同人䷌",
  "臨䷒",
  "損䷨",
  "節䷻",
  "中孚䷼",
  "歸妹䷵",
  "睽䷥",
  "兌䷹",
  "履䷉",
  "泰䷊",
  "大畜䷙",
  "需䷄",
  "小畜䷈",
  "大壯䷡",
  "大有䷍",
  "夬䷪",
  "乾䷀",
];
const HexoListB = ["坤☷", "艮☶", "坎☵", "巽☴", "震☳", "離☲", "兌☱", "乾☰"]
const Num = "初二三四五六";
const Random = (n, m) => Math.floor(Math.random() * (m - n + 1)) + n;
// [n,m] 范围内的随机整数
// console.log(Random(23,26))
const HexoSub = (all, loop, p) => {
  for (let k = 0; k < loop; k++) {
    const small = Math.floor((all * p) / 100);
    let a = Random(small, all - small);
    const l = a - 1;
    const r = all - a;
    const modL = l % 4 || 4; // 0=4
    const modR = r % 4 || 4;
    all -= modL + modR + 1;
  }
  return all / 4;
};
const HexoQinghua = p => { // 杨胜男、王承略：大衍揲扐法与清华简《筮法》揲扐法再探讨
  const result = [],
    isYang = [];
  let BinaryString = '';
  for (let i = 0; i < 12; i++) {
    result[i] = HexoSub(56, 5, p);
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
// console.log(HexoQinghua(17))
const HexoDayan = p => {
  const result = [],
    isYangBen = [],
    isYangBian = [];
  let BinaryStringBen = '',
    BinaryStringBian = '';
  for (let i = 0; i < 6; i++) {
    result[i] = HexoSub(49, 3, p);
    if (result[i] % 2 === 1) isYangBen[i] = 1;
    else isYangBen[i] = 0;
    if (result[i] === 6) isYangBian[i] = 1;
    else if (result[i] === 9) isYangBian[i] = 0;
    else isYangBian[i] = isYangBen[i]
    BinaryStringBen += isYangBen[i];
    BinaryStringBian += isYangBian[i];
  }
  const BinaryBen = parseInt(BinaryStringBen, 2);
  const BinaryBian = parseInt(BinaryStringBian, 2);
  return { result, BinaryBen, BinaryBian };
};
// console.log(HexoDayan(17))
export const HexoDayanPrint = () => {
  const { result, BinaryBen, BinaryBian } = HexoDayan(17);
  const HexoAllBen = HexoList[BinaryBen];
  const NameBen = HexoAllBen.slice(0, HexoAllBen.length - 1);
  const GraphBen = HexoAllBen.slice(-1);
  const HexoAllBian = HexoList[BinaryBian];
  const NameBian = HexoAllBian.slice(0, HexoAllBian.length - 1);
  const GraphBian = HexoAllBian.slice(-1);
  const Print1 = [];
  for (let i = 0; i < 6; i++) {
    Print1[i] = {
      title: Num[i],
      data: [result[i]],
    };
  }
  const Print2Ben = `<div style="margin:1.5em 0 1em">${NameBen}</div>`;
  const Print3Ben = `<div style="font-size:4em;margin-left:-.12em">${GraphBen}</div>`;
  const Print2Bian = `<div style="margin:1.5em 0 1em">${NameBian}</div>`;
  const Print3Bian = `<div style="font-size:4em;margin-left:-.12em">${GraphBian}</div>`;
  Print1[6] = {
    title: "",
    data: ["", Print2Ben, Print2Bian],
  };
  Print1[7] = {
    title: "",
    data: ["", Print3Ben, Print3Bian],
  };
  return Print1;
};
// console.log(HexoDayanPrint())

export const HexoQinghuaPrint = () => {
  const { result, BinaryA, BinaryB, BinaryC, BinaryD } = HexoQinghua(17);
  const HexoAllA = HexoListB[BinaryA];
  const NameA = HexoAllA.slice(0, HexoAllA.length - 1);
  const HexoAllB = HexoListB[BinaryB];
  const NameB = HexoAllB.slice(0, HexoAllB.length - 1);
  const HexoAllC = HexoListB[BinaryC];
  const NameC = HexoAllC.slice(0, HexoAllC.length - 1);
  const HexoAllD = HexoListB[BinaryD];
  const NameD = HexoAllD.slice(0, HexoAllD.length - 1);
  const Print1 = [];
  for (let i = 0; i < 3; i++) {
    Print1[i] = {
      data: [`<div style="margin:0 2em -.75em 0">${result[11 - i]}</div>`, `<div style="margin:0 2em -.75em 0">${result[5 - i]}</div>`] // 倒序
    };
  }
  Print1[3] = {
    data: ['', '']
  }
  Print1[4] = {
    data: ['', '']
  }
  for (let i = 5; i < 8; i++) {
    Print1[i] = {
      data: [`<div style="margin:0 2em -.75em 0">${result[13 - i]}</div>`, `<div style="margin:0 2em -.75em 0">${result[7 - i]}</div>`], // 倒序
    };
  }
  return Print1;
};
// console.log(HexoQinghuaPrint())
const Test1 = () => {
  const output = [];
  const loop = 100000000;
  for (let j = 12; j < 40; j++) {
    let Num6 = 0,
      Num7 = 0,
      Num8 = 0,
      Num9 = 0;
    for (let k = 0; k < loop; k++) {
      const a = HexoSub(49, 3, j);
      if (a === 6) {
        Num6 += 1;
      } else if (a === 7) {
        Num7 += 1;
      } else if (a === 8) {
        Num8 += 1;
      } else if (a === 9) {
        Num9 += 1;
      }
    }
    const p6 = parseFloat(((Num6 / loop) * 100).toPrecision(4));
    const p7 = parseFloat(((Num7 / loop) * 100).toPrecision(4));
    const p8 = parseFloat(((Num8 / loop) * 100).toPrecision(4));
    const p9 = parseFloat(((Num9 / loop) * 100).toPrecision(4));
    const d6 = parseFloat((p6 - 6.25).toPrecision(4)); // 1/16
    const d7 = parseFloat((p7 - 31.25).toPrecision(4)); // 5/16
    const d8 = parseFloat((p8 - 43.75).toPrecision(4)); // 7/16
    const d9 = parseFloat((p9 - 18.75).toPrecision(4)); // 3/16
    const sumdelta = parseFloat(
      (Math.abs(d6) + Math.abs(d7) + Math.abs(d8) + Math.abs(d9)).toPrecision(4)
    ); //为什么绝对值相加？？
    output[j] = j + "% | " + p6 + "% | " + d6 + "% | " + p7 + "% | " + d7 + "% | " + p8 + "% | " + d8 + "% | " + p9 + "% | " + d9 + "% | " + sumdelta + "% | " + `\n`;
  }
  return output;
};

// console.log(Test1())

const probability = [
  5.960464478, 3.576278687, 2.145767212, 1.287460327, 0.7724761963,
  0.4634857178, 0.2780914307
]; // 變卦概率%
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

const Test2 = () => {
  const loop = 1000000;
  const print2 = [];
  for (let j = 17; j < 18; j++) {
    const Bengua = new Array(64).fill(0);
    const Biangua = new Array(64).fill(0);
    for (let i = 0; i < loop; i++) {
      const { BinaryBen, BinaryBian } = HexoDayan(j);
      Bengua[BinaryBen] += 1;
      Biangua[BinaryBian] += 1;
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
        HexoList[i] +
        " | " +
        Bengua[i] +
        " | " +
        parseFloat(errorBen.toPrecision(4)) +
        "% | " +
        Biangua[i] +
        " | " +
        parseFloat(errorBian.toPrecision(4)) +
        "% |" +
        `\n`;

      totalErrorBen += Math.abs(errorBen);
      totalErrorBian += Math.abs(errorBian);
    }
    print2[j] =
      j +
      "% |" +
      parseFloat(totalErrorBen.toPrecision(4)) +
      "% | " +
      parseFloat(totalErrorBian.toPrecision(4)) +
      "% ｜" +
      `\n`;
  }
  return print2;
};
// console.log(Test2());

const TestQinghua = () => {
  const output = [];
  const loop = 200000000;
  for (let j = 2; j < 37; j++) {
    let Num4 = 0, Num5 = 0, Num6 = 0,
      Num7 = 0,
      Num8 = 0,
      Num9 = 0;
    for (let k = 0; k < loop; k++) {
      const a = HexoSub(56, 5, j);
      if (a === 4) {
        Num4 += 1;
      } else if (a === 5) {
        Num5 += 1;
      } else if (a === 6) {
        Num6 += 1;
      } else if (a === 7) {
        Num7 += 1;
      } else if (a === 8) {
        Num8 += 1;
      } else if (a === 9) {
        Num9 += 1;
      }
    }
    const p4 = parseFloat(((Num4 / loop) * 100).toPrecision(4));
    const p5 = parseFloat(((Num5 / loop) * 100).toPrecision(4));
    const p6 = parseFloat(((Num6 / loop) * 100).toPrecision(4));
    const p7 = parseFloat(((Num7 / loop) * 100).toPrecision(4));
    const p8 = parseFloat(((Num8 / loop) * 100).toPrecision(4));
    const p9 = parseFloat(((Num9 / loop) * 100).toPrecision(4));
    const d4 = parseFloat((p4 - 3.125).toPrecision(4)); // 1/32
    const d5 = parseFloat((p5 - 15.625).toPrecision(4)); // 5/32
    const d6 = parseFloat((p6 - 31.25).toPrecision(4)); // 10/32
    const d7 = parseFloat((p7 - 31.25).toPrecision(4)); // 10/32
    const d8 = parseFloat((p8 - 15.625).toPrecision(4)); // 5/32
    const d9 = parseFloat((p9 - 3.125).toPrecision(4)); // 1/32
    const sumdelta = parseFloat(
      (Math.abs(d4) + Math.abs(d5) + Math.abs(d6) + Math.abs(d7) + Math.abs(d8) + Math.abs(d9)).toPrecision(4)
    ); //为什么绝对值相加？？
    output[j] = j + "% | " + p4 + " | " + p5 + " | " + p6 + " | " + p7 + " | " + p8 + " | " + p9 + " | " + sumdelta + " | " + `\n`;
  }
  return output;
};
// console.log(TestQinghua())