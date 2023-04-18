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

// [n,m] 范围内的随机整数
const Random = (n, m) => Math.floor(Math.random() * (m - n + 1)) + n;
// console.log(Random(23,26))
const Num = "初二三四五六";
const TestSub = (n) => {
  let all = 49;
  n = +n;
  for (let k = 0; k < 3; k++) {
    const small = Math.floor((all * n) / 100);
    let a = Random(small, all - small);
    const l = a - 1;
    const r = all - a;
    const modL = l % 4 || 4; // 0=4
    const modR = r % 4 || 4;
    all -= modL + modR + 1;
  }
  return all / 4;
};
const DayanHexoSub = n => {
  const test = [],
    result = [],
    isYangBen = [];
  const isYangBian = isYangBen.slice(); // 變卦
  let BinaryStringBen = "";
  let BinaryStringBian = "";
  for (let i = 0; i < 6; i++) {
    let all = 49;
    test[i] = [];
    for (let k = 0; k < 3; k++) {
      const small = Math.floor((all * n) / 100);
      const a = Random(small, all - small);
      const l = a - 1;
      const r = all - a;
      const modL = l % 4 || 4; // 0=4
      const modR = r % 4 || 4;
      test[i][k] = modL + modR + 1;
      all -= test[i][k];
    }
    result[i] = all / 4;
    if (result[i] % 2 === 1) {
      // 本卦
      isYangBen[i] = 1;
    } else {
      isYangBen[i] = 0;
    }
    if (result[i] === 6) {
      isYangBian[i] = 1;
    } else if (result[i] === 9) {
      isYangBian[i] = 0;
    } else {
      isYangBian[i] = isYangBen[i]
    }
    BinaryStringBen += isYangBen[i];
    BinaryStringBian += isYangBian[i];
  }
  const BinaryBen = parseInt(BinaryStringBen, 2);
  const BinaryBian = parseInt(BinaryStringBian, 2);
  return { BinaryBen, BinaryBian };
};

const probability = [
  5.960464478, 3.576278687, 2.145767212, 1.287460327, 0.7724761963,
  0.4634857178, 0.2780914307
]; // 變卦概率%
const Compare = (n, loop) => {
  n = (n * 100) / loop;
  let min = Infinity;
  for (let i = 0; i < probability.length; i++) {
    const result = Math.abs(n - probability[i]);
    if (result < min) {
      min = result;
    }
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
      const { BinaryBen, BinaryBian } = DayanHexoSub(j);
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

export const DayanHexo = () => {
  const { BinaryBen, BinaryBian } = DayanHexoSub(j); // 一些进阶小语法
  const HexoAllRaw = HexoList[BinaryBen];
  const NameRaw = HexoAllRaw.slice(0, HexoAllRaw.length - 1);
  const GraphRaw = HexoAllRaw.slice(-1);
  const HexoAll = HexoList[BinaryBian];
  const Name = HexoAll.slice(0, HexoAll.length - 1);
  const Graph = HexoAll.slice(-1);
  // 生成輸出
  const Print1 = [];
  for (let i = 0; i < 6; i++) {
    Print1[i] = {
      title: Num[i],
      data: [...test[i], result[i], isYangBen[i], isYangBian[i]],
    };
  }
  const Print2 = `<div style="margin:1.5em 0 1em">${Name}</div>`;
  const Print3 = `<div style="font-size:4em;margin-left:-.12em">${Graph}</div>`;
  const Print2Raw = `<div style="margin:1.5em 0 1em">${NameRaw}</div>`;
  const Print3Raw = `<div style="font-size:4em;margin-left:-.12em">${GraphRaw}</div>`;
  Print1[6] = {
    title: "",
    data: ["", "", "", "", Print2Raw, Print2],
  };
  Print1[7] = {
    title: "",
    data: ["", "", "", "", Print3Raw, Print3],
  };
  return Print1;
};

const Test1 = () => {
  const output = [];
  const loop = 100000000;
  for (let j = 12; j < 40; j++) {
    let Num6 = 0,
      Num7 = 0,
      Num8 = 0,
      Num9 = 0;
    for (let k = 0; k < loop; k++) {
      const a = TestSub(j);
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
    output[j] =
      j +
      "% | " +
      p6 +
      "% | " +
      d6 +
      "% | " +
      p7 +
      "% | " +
      d7 +
      "% | " +
      p8 +
      "% | " +
      d8 +
      "% | " +
      p9 +
      "% | " +
      d9 +
      "% | " +
      sumdelta +
      "% | " +
      `\n`;
  }
  return output;
};

// console.log(Test1())
