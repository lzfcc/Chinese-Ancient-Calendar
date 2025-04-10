import { big, frc } from "../parameter/functions.mjs";
import { Frac2FalseFrac, BigFrc } from "../equation/math.mjs";

class Interval {
  constructor(cate = 0, pitch = "C", half = 0, comma = 0, freq = "1") {
    this.cate = cate;
    this.pitch = pitch;
    this.half = half;
    this.freq = freq;
    this.comma = comma;
  }
  static NameMap = {
    C: 1,
    D: 2,
    E: 3,
    F: 4,
    G: 5,
    A: 6,
    B: 7
  };
  static HalfMap = {
    1: "♯",
    2: "𝄪",
    0: "",
    "-1": "♭",
    "-2": "𝄫"
  };
  get name() {
    return Interval.NameMap[this.pitch];
  }
  nameString(mode) {
    let str = "";
    if (mode === 1) {
      str = this.pitch;
    } else if (mode === 2) {
      str = this.name;
    }
    let commaString = "",
      halfString = "";
    if (this.half > 0) {
      halfString = Interval.HalfMap[this.half];
    } else if (this.comma > 0) {
      commaString = "upline" + this.comma;
      return `${halfString}<span class="${commaString}">${str}</span>`;
    } else if (this.comma < 0) {
      commaString = "dnline" + -this.comma;
      return `${halfString}<span class="${commaString}">${str}</span>`;
    } else return str;
  }
  get cent() {
    return Number(frc(this.freq));
  }
}

export const TuningList = {
  1: "宮調",
  2: "商調",
  4: "徵調",
  5: "羽調",
  6: "蕤賓",
  7: "清商",
  8: "慢角",
  9: "慢宮",
  10: "楚商",
  11: "黃鐘",
  12: "无媒",
  13: "間弦一",
  14: "間弦二",
  15: "徽法日傳平調",
  16: "徽法側商",
  17: "徽法側羽",
  18: "徽法側蜀",
  19: "徽法側楚"
};
// console.log(TuningList["商調"])
// 0  1  2
// 音名
// 唱名
// 頻率比
const FushionListB = [
  new Interval(0, "C", 0, 0, "1"),
  new Interval(2, "C", 0, 1, "243/240"),
  new Interval(2, "C", 1, -2, "25/24"),
  new Interval(1, "D", -1, 0, "256/243"),
  new Interval(2, "C", 1, -1, "135/128"),
  new Interval(2, "D", -1, 1, "16/15"),
  new Interval(1, "C", 1, 0, "2187/2048"),
  new Interval(2, "D", -1, 2, "27/25"),
  new Interval(1, "E", -2, 0, "65536/59049"),
  new Interval(2, "D", 0, -1, "10/9"),
  new Interval(0, "D", 0, 0, "9/8"),
  new Interval(2, "E", -2, 2, "256/225"),
  new Interval(2, "D", 1, -2, "75/64"),
  new Interval(1, "E", -1, 0, "32/27"),
  new Interval(2, "E", -1, 1, "6/5"),
  new Interval(1, "D", 1, 0, "19683/16384"),
  new Interval(2, "E", 0, -2, "100/81"),
  new Interval(1, "F", -1, 0, "8192/6561"),
  new Interval(2, "E", 0, -1, "5/4"),
  new Interval(0, "E", 0, 0, "81/64"),
  new Interval(2, "F", -1, 2, "32/25"),
  new Interval(2, "E", 1, -2, "675/512"),
  new Interval(0, "F", 0, 0, "4/3"),
  new Interval(2, "F", 0, 1, "27/20"),
  new Interval(1, "E", 1, 0, "177147/131072"),
  new Interval(2, "F", 1, -2, "25/18"),
  new Interval(1, "G", -1, 0, "1024/729"),
  new Interval(2, "F", 1, -1, "45/32"),
  new Interval(2, "G", -1, 1, "64/45"),
  new Interval(1, "F", 1, 0, "729/512"),
  new Interval(2, "G", -1, 2, "36/25"),
  new Interval(1, "A", -2, 0, "262144/177147"),
  new Interval(2, "G", 0, -1, "40/27"),
  new Interval(0, "G", 0, 0, "3/2"),
  new Interval(2, "G", 0, 1, "243/160"),
  new Interval(2, "G", 1, -2, "25/16"),
  new Interval(1, "A", -1, 0, "128/81"),
  new Interval(2, "G", 1, -1, "405/256"),
  new Interval(2, "A", -1, 1, "8/5"),
  new Interval(1, "G", 1, 0, "6561/4096"),
  new Interval(1, "B", -2, 0, "32768/19683"),
  new Interval(2, "A", 0, -2, "400/243"),
  new Interval(2, "A", 0, -1, "5/3"),
  new Interval(1, "A", 0, 0, "27/16"),
  new Interval(2, "A", 1, -2, "225/128"),
  new Interval(1, "B", -1, 0, "16/9"),
  new Interval(2, "B", -1, 1, "9/5"),
  new Interval(1, "A", 1, 0, "59049/32768"),
  new Interval(2, "B", 0, -2, "50/27"),
  new Interval(1, "C", -1, 0, "4096/2187"),
  new Interval(2, "B", 0, -1, "15/8"),
  new Interval(2, "C", -1, 1, "256/135"),
  new Interval(1, "B", 0, 0, "243/128"),
  new Interval(2, "C", -1, 2, "48/25"),
  new Interval(1, "D", -2, 0, "1048576/531441"),
  new Interval(2, "C", 0, -1, "480/243"),
  new Interval(0, "C", 0, 0, "2")
];
const FushionList5 = [
  "1",
  "2187/2048",
  "9/8",
  "32/27",
  "81/64",
  "4/3",
  "729/512",
  "3/2",
  "128/81",
  "27/16",
  "16/9",
  "243/128",
  "2"
];
const FushionList1 = [
  "1",
  "16/15",
  "9/8",
  "6/5",
  "5/4",
  "4/3",
  "45/32",
  "3/2",
  "8/5",
  "5/3",
  "9/5",
  "15/8",
  "2"
];
const FushionList2 = [
  "1",
  "16/15",
  "10/9",
  "6/5",
  "5/4",
  "4/3",
  "45/32",
  "3/2",
  "8/5",
  "5/3",
  "9/5",
  "15/8",
  "2"
];
const FushionList3 = [
  "1",
  "16/15",
  "9/8",
  "6/5",
  "5/4",
  "4/3",
  "45/32",
  "3/2",
  "8/5",
  "27/16",
  "9/5",
  "15/8",
  "2"
];
const FushionList4 = [
  "1",
  "16/15",
  "10/9",
  "6/5",
  "5/4",
  "4/3",
  "45/32",
  "40/27",
  "8/5",
  "5/3",
  "9/5",
  "15/8",
  "2"
];
const FushionList6 = [
  "1",
  "196/185",
  "1769/1576",
  "1785/1501",
  "635/504",
  "3544/2655",
  "3363/2378",
  "2655/1772",
  "4813/3032",
  "3002/1785",
  "4679/2626",
  "2943/1559",
  "2"
];
const FushionList5S = [
  "1",
  "9/8",
  "81/64",
  "4/3",
  "729/512",
  "3/2",
  "27/16",
  "243/128",
  "2"
];
const FushionList1S = [
  "1",
  "9/8",
  "5/4",
  "4/3",
  "45/32",
  "3/2",
  "5/3",
  "15/8",
  "2"
];
const FushionList2S = [
  "1",
  "10/9",
  "5/4",
  "4/3",
  "45/32",
  "3/2",
  "5/3",
  "15/8",
  "2"
];
const FushionList3S = [
  "1",
  "9/8",
  "5/4",
  "4/3",
  "45/32",
  "3/2",
  "27/16",
  "15/8",
  "2"
];
const FushionList4S = [
  "1",
  "10/9",
  "5/4",
  "4/3",
  "45/32",
  "40/27",
  "5/3",
  "15/8",
  "2"
];
const FushionList6S = [
  "1",
  "1769/1576",
  "635/504",
  "3544/2655",
  "3363/2378",
  "2655/1772",
  "3002/1785",
  "4679/2626",
  "2943/1559",
  "2"
];

const FushionList = {
  // 這是五度律、純律混合在一起。除了 C D F G 是共用，其他加了上下線的都是純律。第一個數字 0 共用，1 五度律，2 純律
  0: [0, "C", "1", "1"],
  21.51: [
    2,
    '<span class="upline1">C</span>',
    '<span class="upline1">1</span>',
    "81/80"
  ],
  70.67: [
    2,
    '♯<span class="dnline2">C</span>',
    '♯<span class="dnline2">1</span>',
    "25/24"
  ], // 小半音
  90.22: [1, "♭D", "♭2", "256/243"],
  92.18: [
    2,
    '♯<span class="dnline1">C</span>',
    '♯<span class="dnline1">1</span>',
    "135/128"
  ],
  100: [3, "♯C", "♯1", "196/185"],
  111.73: [
    2,
    '♭<span class="upline1">D</span>',
    '♭<span class="upline1">2</span>',
    "16/15"
  ],
  113.69: [1, "♯C", "♯1", "2187/2048"],
  133.24: [
    2,
    '♭<span class="upline2">D</span>',
    '♭<span class="upline2">2</span>',
    "27/25"
  ],
  182.4: [
    2,
    '<span class="dnline1">D</span>',
    '<span class="dnline1">2</span>',
    "10/9"
  ],
  200: [3, "D", "2", "1769/1576"],
  203.91: [0, "D", "2", "9/8"],
  274.58: [
    2,
    '♯<span class="dnline2">D</span>',
    '♯<span class="dnline2">2</span>',
    "75/64"
  ],
  294.13: [1, "♭E", "♭3", "32/27"],
  300: [3, "♭E", "♭3", "1785/1501"],
  315.64: [
    2,
    '♭<span class="upline1">E</span>',
    '♭<span class="upline1">3</span>',
    "6/5"
  ],
  317.6: [1, "♯D", "♯2", "19683/16384"],
  337.15: [
    2,
    '♭<span class="upline2">E</span>',
    '♭<span class="upline2">3</span>',
    "243/200"
  ],
  364.81: [
    2,
    '<span class="dnline2">E</span>',
    '<span class="dnline2">3</span>',
    "100/81"
  ],
  384.36: [1, "♭F", "♭4", "8192/6561"],
  386.31: [
    2,
    '<span class="dnline1">E</span>',
    '<span class="dnline1">3</span>',
    "5/4"
  ],
  400: [3, "E", "3", "635/504"],
  407.82: [0, "E", "3", "81/64"],
  427.37: [
    2,
    '♭<span class="upline2">F</span>',
    '♭<span class="upline2">4</span>',
    "32/25"
  ],
  478.49: [
    2,
    '♯<span class="dnline2">E</span>',
    '♯<span class="dnline2">3</span>',
    "675/512"
  ],
  498.04: [1, "F", "4", "4/3"],
  500: [3, "F", "4", "3544/2655"],
  519.55: [
    2,
    '<span class="upline1">F</span>',
    '<span class="upline1">4</span>',
    "27/20"
  ],
  521.51: [1, "♯E", "♯3", "177147/131072"],
  541.06: [
    2,
    '<span class="upline2">F</span>',
    '<span class="upline2">4</span>',
    "2187/1600"
  ],
  568.72: [
    2,
    '♯<span class="dnline2">F</span>',
    '♯<span class="dnline2">4</span>',
    "25/18"
  ],
  588.27: [1, "♭G", "♭5", "1024/729"],
  590.22: [
    2,
    '♯<span class="dnline1">F</span>',
    '♯<span class="dnline1">4</span>',
    "45/32"
  ],
  600: [3, "♯F", "♯4", "3363/2378"],
  609.77: [
    2,
    '♭<span class="upline1">G</span>',
    '♭<span class="upline1">5</span>',
    "64/45"
  ],
  611.73: [1, "♯F", "♯4", "729/512"],
  631.28: [
    2,
    '♭<span class="upline2">G</span>',
    '♭<span class="upline2">5</span>',
    "36/25"
  ],
  680.45: [
    2,
    '<span class="dnline1">G</span>',
    '<span class="dnline1">5</span>',
    "40/27"
  ],
  700: [3, "G", "5", "2655/1772"],
  701.96: [0, "G", "5", "3/2"],
  723.46: [
    2,
    '<span class="upline1">G</span>',
    '<span class="upline1">5</span>',
    "243/160"
  ],
  772.63: [
    2,
    '♯<span class="dnline2">G</span>',
    '♯<span class="dnline2">5</span>',
    "25/16"
  ],
  792.18: [1, "♭A", "♭6", "128/81"],
  794.13: [
    2,
    '♯<span class="dnline1">G</span>',
    '♯<span class="dnline1">5</span>',
    "405/256"
  ],
  800: [3, "♯G", "♯5", "4813/3032"],
  813.69: [
    2,
    '♭<span class="upline1">A</span>',
    '♭<span class="upline1">6</span>',
    "8/5"
  ],
  815.64: [1, "♯G", "♯5", "6561/4096"],
  835.2: [
    2,
    '♭<span class="upline2">A</span>',
    '♭<span class="upline2">6</span>',
    "81/50"
  ],
  862.85: [
    2,
    '<span class="dnline2">A</span>',
    '<span class="dnline2">6</span>',
    "400/243"
  ],
  884.36: [
    2,
    '<span class="dnline1">A</span>',
    '<span class="dnline1">6</span>',
    "5/3"
  ],
  900: [3, "A", "6", "3002/1785"],
  905.87: [1, "A", "6", "27/16"],
  976.54: [
    2,
    '♯<span class="dnline2">A</span>',
    '♯<span class="dnline2">6</span>',
    "225/128"
  ],
  996.09: [1, "♭B", "♭7", "16/9"],
  1000: [3, "♭B", "♭7", "4679/2626"],
  1017.59: [
    2,
    '♭<span class="upline1">B</span>',
    '♭<span class="upline1">7</span>',
    "9/5"
  ],
  1019.55: [1, "♯A", "♯6", "59049/32768"],
  1039.1: [
    2,
    '♭<span class="upline2">B</span>',
    '♭<span class="upline2">7</span>',
    "729/400"
  ],
  1066.76: [
    2,
    '<span class="dnline2">B</span>',
    '<span class="dnline2">7</span>',
    "50/27"
  ],
  1086.31: [1, "·♭C", "·♭1", "4096/2187"],
  1088.27: [
    2,
    '<span class="dnline1">B</span>',
    '<span class="dnline1">7</span>',
    "15/8"
  ],
  1100: [3, "B", "7", "2943/1559"],
  1107.82: [
    2,
    '·♭<span class="upline1">C</span>',
    '·♭<span class="upline1">1</span>',
    "256/135"
  ],
  1109.78: [1, "B", "7", "243/128"],
  1129.33: [
    2,
    '·♭<span class="upline2">C</span>',
    '·♭<span class="upline2">1</span>',
    "48/25"
  ],
  1178.49: [
    2,
    '·<span class="dnline1">C</span>',
    '·<span class="dnline1">1</span>',
    "160/81"
  ],
  1200: [0, "C", "1", "2"]
};

const Prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]; // 质数

const Unique = (arr) => Array.from(new Set(arr)).filter((x) => x !== undefined);

const IntoOctave = (a, standard) => {
  // 化到一個八度之內
  a = frc(a);
  standard = standard === undefined ? 1 : standard;
  while (Number(a) < standard) {
    a = a.mul(2);
  }
  while (Number(a) > standard * 2) {
    a = a.div(2);
  }
  return a.toFraction(false);
};

const Portion2Name = (a, mode) => {
  // 輸入頻率比，輸出對應的唱名mode 1 音名 2唱名
  a = IntoOctave(a);
  for (const [key, value] of Object.entries(FushionList)) {
    if (value[3] === a) return value[mode];
  }
  // return '　'
};
// console.log(Portion2Name('243/240', 1))

const Portion2Pitch = (portion, one, OneDif) => {
  // 輸入一弦頻率、一弦是否調了，輸出音名
  const Base = frc(one).div(OneDif || 1);
  return Portion2Name(frc(portion).div(Base).toFraction(false), 1);
};

const Name2Freq = (a) => {
  // 輸入音名輸出對應頻率
  for (const [key, value] of Object.entries(FushionList)) {
    if (value[1] === a || value[2] === a || value[3] === a) {
      return key;
    }
  }
};
// console.log(Name2Freq('♭G'))

const Freq2Pitch = (a) => {
  // 輸入頻率比，輸出對應的唱名
  a = IntoOctave(a);
  for (const [key, value] of Object.entries(FushionList)) {
    if (value[3] === a) return value[1];
  }
};

export const OctaveCent = (a, b) => {
  // 兩個要比較的頻率
  a = Frac2FalseFrac(a).Deci;
  b = Frac2FalseFrac(b).Deci;
  const Octave = Math.log2(a / b);
  const Cent = Octave * 1200;
  const Print = `八度値 ${Octave}
音分 ${Cent}`;
  return { Print, Octave, Cent };
};
// console.log(OctaveCent('4/3', 1))

export const Frequency = (a) => 2 ** (a / 1200);

const FretListA = [
  0,
  "1/8",
  "1/6",
  "1/5",
  "1/4",
  "1/3",
  "2/5",
  "1/2",
  "3/5",
  "2/3",
  "3/4",
  "4/5",
  "5/6",
  "7/8",
  1
];
const FretList = [
  "1/9",
  "1/8",
  "1/6",
  "1/5",
  "1/4",
  "1/3",
  "2/5",
  "1/2",
  "3/5",
  "2/3",
  "3/4",
  "4/5",
  "5/6",
  "7/8",
  "8/9",
  "9/10",
  1
]; // 0, 14是徽外13.111(大全音)，15是外外13.2（小全音）。五度律的三個徽外：8/9（大全音204）, 243/256（90音分13.492）, 2048/2187（82音分13.594）

export const Fret2LengPrint = (x) => {
  // 徽位轉弦長. 支持 13.111，13 1/9，118/9
  if (Math.floor(+x) === +x) {
    return FretList[+x];
  }
  x = frc(x).simplify();
  if (x.compare(14) >= 0 || x.compare(0) < 0) {
    throw new Error("請輸入13徽以內的數字");
  }
  const Fret = x.floor();
  const Frac = x.sub(Fret);
  const Leng = frc(FretListA[Fret]).add(
    Frac.mul(frc(FretListA[Fret + 1]).sub(FretListA[Fret]))
  );
  return Leng.toFraction();
};
// console.log(Fret2Leng('13.111'))

const Fret2Leng = (x) => {
  // 徽位轉弦長 支持 13.111，13 1/9，118/9
  x = frc(x).simplify();
  const xNum = Number(x);
  const Fret = x.floor();
  if (Number(Fret) === xNum) {
    if (xNum === -1) {
      return "1/10"; // 15徽泛音以7徽對稱就變成了-1
    }
    return FretList[xNum];
  }
  const Frac = x.sub(Fret);
  const Leng = frc(FretList[Fret]).add(
    Frac.mul(frc(FretList[Fret + 1]).sub(FretList[Fret]))
  );
  return Leng.toFraction();
};
// console.log(Fret2Leng('-1'))

export const Leng2Fret = (x) => {
  // 弦長轉徽位
  x = frc(x);
  let Fret = 0;
  for (let i = 0; i <= 13; i++) {
    if (x.compare(FretListA[i]) >= 0 && x.compare(FretListA[i + 1]) < 0) {
      Fret = i;
      break;
    }
  }
  const Result = frc(Fret).add(
    x.sub(FretListA[Fret]).div(frc(FretListA[Fret + 1]).sub(FretListA[Fret]))
  );
  return +Number(Result).toFixed(3);
};
// console.log(Leng2Fret('11/20'))

const ExhastFret = () => {
  // 琴上所有徽位
  let List1 = [],
    List2 = [],
    List3 = [],
    List = [];
  for (const [key, value] of Object.entries(FushionList)) {
    List1 = List1.concat(Leng2Fret(frc(1).div(value[3]).toFraction(false)));
  }
  for (const [key, value] of Object.entries(FushionList)) {
    List2 = List2.concat(
      Leng2Fret(frc(1).div(value[3]).div(2).toFraction(false))
    );
  }
  for (const [key, value] of Object.entries(FushionList)) {
    List3 = List3.concat(
      Leng2Fret(frc(1).div(value[3]).div(4).toFraction(false))
    );
  }
  List1 = Unique(List1);
  List1 = List1.sort((a, b) => a - b);
  List2 = Unique(List2);
  List2 = List2.sort((a, b) => a - b);
  List3 = Unique(List3);
  List3 = List3.sort((a, b) => a - b);
  for (let i = 0; i < List2.length; i++) {
    List[i] = List1[i] + "，" + List2[i] + "，" + List3[i] + "。";
  }
  return List;
};
// console.log(ExhastFret())

export const Pythagorean = (x) => {
  const upA = [],
    upB = [],
    downA = [],
    downB = [],
    Cent1 = [],
    Cent2 = [];
  upA[0] = x;
  upB[0] = x;
  downA[0] = x;
  downB[0] = x;
  Cent1[0] = 0;
  Cent2[0] = 0;
  for (let i = 1; i <= 12; i++) {
    upA[i] = frc(upA[i - 1]).mul("3/2");
    while (Number(upA[i]) > Number(frc(x).mul(2))) {
      upA[i] = upA[i].div(2);
    }
    Cent1[i] = +OctaveCent(Number(upA[i]), x).Cent.toFixed(3);
    upA[i] = upA[i].toFraction(true);
  }
  for (let i = 1; i <= 12; i++) {
    upB[i] = frc(upB[i - 1]).mul("2/3");
    while (Number(upB[i]) < Number(frc(x).div(2))) {
      upB[i] = upB[i].mul(2);
    }
    upB[i] = upB[i].toFraction(true);
  }
  for (let i = 1; i <= 12; i++) {
    downA[i] = frc(downA[i - 1]).mul("4/3");
    while (Number(downA[i]) > Number(frc(x).mul(2))) {
      downA[i] = downA[i].div(2);
    }
    Cent2[i] = +OctaveCent(Number(downA[i]), x).Cent.toFixed(3);
    downA[i] = downA[i].toFraction(true);
  }
  for (let i = 1; i <= 12; i++) {
    downB[i] = frc(downB[i - 1]).mul("3/4");
    while (Number(downB[i]) < Number(frc(x).div(2))) {
      downB[i] = downB[i].mul(2);
    }
    downB[i] = downB[i].toFraction(true);
  }
  const Print = [
    {
      title: "上生頻率",
      data: upA
    },
    {
      title: "上生弦長",
      data: upB
    },
    {
      title: "音分",
      data: Cent1
    },
    {
      title: "",
      data: [
        `<strong>C</strong>`,
        `<strong>F</strong>`,
        `<strong>♭B</strong>`,
        `<strong>♭E</strong>`,
        `<strong>♭A</strong>`,
        `<strong>♭D</strong>`,
        `<strong>♭G</strong>`,
        `<strong>♭C</strong>`,
        `<strong>♭F</strong>`,
        `<strong>𝄫B</strong>`,
        `<strong>𝄫E</strong>`,
        `<strong>𝄫A</strong>`,
        `<strong>𝄫D</strong>`
      ]
    },
    {
      title: "下生頻率",
      data: downA
    },
    {
      title: "下生弦長",
      data: downB
    },
    {
      title: "音分",
      data: Cent2
    }
  ];
  return Print;
};
// console.log (Pythagorean(81))

export const Pythagorean60 = (x) => {
  const upA = [],
    upB = [],
    Cent1 = [];
  upA[0] = x;
  upB[0] = x;
  Cent1[0] = 0;
  for (let i = 1; i < 60; i++) {
    const Func1 = BigFrc(upA[i - 1], "3/2");
    upA[i] = Func1.Frac;
    let Deci = Func1.Deci;
    while (Deci >= Number(frc(x).mul(2))) {
      const Func2 = BigFrc(upA[i], "1/2");
      upA[i] = Func2.Frac;
      Deci = Func2.Deci;
    }
    Cent1[i] = +OctaveCent(Deci, x).Cent.toFixed(8);
  }
  for (let i = 1; i < 60; i++) {
    const Func1 = BigFrc(upB[i - 1], "2/3");
    upB[i] = Func1.Frac;
    let Deci = Func1.Deci;
    while (Deci < Number(frc(x).div(2))) {
      const Func2 = BigFrc(upB[i], 2);
      upB[i] = Func2.Frac;
      Deci = Func2.Deci;
    }
  }
  const Print = [
    {
      title: "頻率",
      data: upA
    },
    {
      title: "弦長",
      data: upB
    },
    {
      title: "音分",
      data: Cent1
    }
  ];
  return Print;
};

export const Hechengtian = (x) => {
  const upA = [],
    upB = [],
    Cent1 = [];
  upA[0] = x;
  upB[0] = x;
  Cent1[0] = 0;
  for (let i = 1; i <= 12; i++) {
    upA[i] = frc(upA[i - 1]).mul("3/2");
    while (Number(upA[i]) > Number(frc(x).mul(2))) {
      upA[i] = upA[i].div(2);
    }
  }
  const DifA = upA[12].sub(frc(x)).div(12);
  for (let i = 1; i <= 12; i++) {
    upA[i] = upA[i].sub(DifA.mul(i));
    Cent1[i] = +OctaveCent(Number(upA[i]), x).Cent.toFixed(3);
    upA[i] = upA[i].toFraction(true);
  }
  for (let i = 1; i <= 12; i++) {
    upB[i] = frc(upB[i - 1]).mul("2/3");
    while (Number(upB[i]) < Number(frc(x).div(2))) {
      upB[i] = upB[i].mul(2);
    }
  }
  const DifB = frc(x).sub(upB[12]).div(12);
  for (let i = 1; i <= 12; i++) {
    upB[i] = upB[i].add(DifB.mul(i));
    upB[i] = upB[i].toFraction(true);
  }
  const Print = [
    {
      title: "上生頻率",
      data: upA
    },
    {
      title: "上生弦長",
      data: upB
    },
    {
      title: "音分",
      data: Cent1
    }
  ];
  return Print;
};

export const Meantone = (x, mode) => {
  // 折中律、中庸全音律
  mode = mode === undefined ? 4 : +mode;
  const Cent1 = [],
    Freq1 = [],
    Cent2 = [],
    Freq2 = [];
  Freq1[0] = big(x);
  Freq2[0] = big(x);
  let a1 = big(5); // 原理見律曆初階第一章
  let b1 = 0.25;
  let c = 12;
  if (mode === 3) {
    a1 = big(2.4);
    b1 = big.div(1, 3);
    c = 19;
  }
  for (let i = 1; i <= c; i++) {
    Freq1[i] = big(Freq1[i - 1]).mul(a1.pow(b1));
    while (Freq1[i].gt(Freq1[0].mul(2))) {
      Freq1[i] = Freq1[i].div(2);
    }
  }
  for (let i = 1; i <= c; i++) {
    Freq1[i] = Freq1[i].toNumber();
    if (Freq1[i].toString().length < 10)
      Freq1[i] = frc(Freq1[i]).toFraction(false);
    Cent1[i] = +OctaveCent(Freq1[i], x).Cent.toFixed(8);
  }
  let a2 = big(3.2); // 原理見律曆初階第一章
  let b2 = 0.25;
  if (mode === 3) {
    a2 = big(2.4);
    b2 = big.div(1, 3);
  }
  for (let i = 1; i <= c; i++) {
    Freq2[i] = big(Freq2[i - 1]).mul(a2.pow(b2));
    while (Freq2[i].gt(Freq2[0].mul(2))) {
      Freq2[i] = Freq2[i].div(2);
    }
  }
  for (let i = 1; i <= c; i++) {
    Freq2[i] = Freq2[i].toNumber();
    if (Freq2[i].toString().length < 10)
      Freq2[i] = frc(Freq2[i]).toFraction(false);
    Cent2[i] = +OctaveCent(Freq2[i], x).Cent.toFixed(8);
  }
  Freq1[0] = x;
  Cent1[0] = 0;
  const Print1 = [
    {
      title: "上生",
      data: Freq1
    },
    {
      title: "音分",
      data: Cent1
    }
  ];
  Freq2[0] = x;
  Cent2[0] = 0;
  const Print2 = [
    {
      title: "下生",
      data: Freq2
    },
    {
      title: "音分",
      data: Cent2
    }
  ];
  return { Print1, Print2 };
};
// console.log(Meantone(1))
// console.log(big.pow(2, big.div(1, 12)).toNumber())
// console.log(Pythagorean60(81))
const RTT = (x) => {
  // regular temperament theory 規則調律理論。見《律曆初階·律學》最後
  let y = frc(1);
  for (let i = 0; i < x.length; i++) {
    y = y.mul(frc(Prime[i]).pow(frc(x[i])));
  }
  return y.toFraction(false);
};
const RTTadjust = (x) => {
  while (Number(frc(RTT(x))) >= 2) {
    x[0] -= 1;
  }
  while (Number(frc(RTT(x))) < 1) {
    x[0] += 1;
  }
  return x;
};
// console.log(RTTadjust([-6, 2, 0]))

export const Justoni = (x) => {
  x = x.toString();
  const List1 = [],
    List2 = [],
    List3 = [],
    Cent1 = [],
    Cent2 = [],
    Cent3 = [];
  List1[0] = x;
  Cent1[0] = "";
  for (let i = 1; i <= 3; i++) {
    List1[i] = frc(List1[i - 1]).mul("3/2");
    while (List1[i] >= frc(x).mul(2)) {
      List1[i] = List1[i].div(2);
    }
    if (x === "1") {
      List1[i] = List1[i].toFraction();
    } else {
      List1[i] = List1[i].toFraction(true);
    }
    Cent1[i] = OctaveCent(Number(frc(List1[i])), x).Cent.toFixed(8);
  }
  for (let i = 0; i <= 3; i++) {
    List2[i] = frc(List1[i]).mul("5/4");
    while (List2[i] >= frc(x).mul(2)) {
      List2[i] = List2[i].div(2);
    }
    if (x === "1") {
      List2[i] = List2[i].toFraction();
    } else {
      List2[i] = List2[i].toFraction(true);
    }
    Cent2[i] = OctaveCent(Number(frc(List2[i])), x).Cent.toFixed(8);
  }
  for (let i = 0; i <= 3; i++) {
    List3[i] = frc(List1[i]).mul("6/5");
    while (List3[i] >= frc(x).mul(2)) {
      List3[i] = List3[i].div(2);
    }
    if (x === "1") {
      List3[i] = List3[i].toFraction();
    } else {
      List3[i] = List3[i].toFraction(true);
    }
    Cent3[i] = OctaveCent(Number(frc(List3[i])), x).Cent.toFixed(8);
  }
  const Print = [
    {
      title: "頻率",
      data: [...List1, ...List2, ...List3]
    },
    {
      title: "音分",
      data: [...Cent1, ...Cent2, ...Cent3]
    }
  ];
  return Print;
};
// console.log(Justoni(1))

/**
 * 十二等程律。新法密率
 * @param CFreq c的頻率
 * @returns
 */
export const EqualTemp = (CFreq, mode) => {
  mode = mode === undefined ? 12 : +mode;
  CFreq = CFreq.toString();
  let a = CFreq;
  if (CFreq.includes("/")) {
    a = CFreq.split("/");
    a = big.div(a[0], a[1]);
  }
  const List = [],
    List1 = [],
    Cent = [];
  List[0] = CFreq;
  List1[0] = CFreq;
  Cent[0] = 0;
  for (let i = 1; i <= mode; i++) {
    List[i] = big(a).mul(big(2).pow(big.div(i, mode)));
    if (i === mode) {
      List1[i] = List[i].toNumber();
    } else {
      List1[i] = List[i].toFixed(24);
    }
    Cent[i] = +OctaveCent(List1[i], a).Cent.toFixed(12);
  }
  const Print = [
    {
      title: "頻率",
      data: List1
    },
    {
      title: "音分",
      data: Cent
    }
  ];
  return { Print, List1 };
};
// console.log(EqualTemp('1',19).Print)
// console.log(big(2).pow(big.div(1, 12)).toString())
// 1.059463094359295264561825294946341700779204317494185628559208431
// 1.059463094359295264561825 // 朱載堉25位大算盤

const TuningSub1 = (KnownFreq, KnownFret, UnknownFret) =>
  frc(KnownFreq)
    .div(Fret2Leng(KnownFret))
    .mul(Fret2Leng(UnknownFret))
    .toFraction(false); // 已知弦頻率比（不是實際頻率），已知弦徽位，所求弦徽位。這個沒分是泛音還是按音，所以如果是泛音調弦，一定要七徽以上。散音是14

const TuningSub2 = (List, a, n) => {
  // 把默認的宮弦換成自定義的宮弦
  if (a !== n && n !== 0) {
    const p = frc(1).div(List[n]);
    for (let i = 1; i <= 7; i++) {
      List[i] = frc(List[i]).mul(p).toFraction(false);
    }
  }
  return List;
};

const TuningSub3 = (PortionList, Unmoved, Unmoved2Five, Freq) => {
  // 各弦頻率比，那根弦沒動作為基準，這根弦到五弦正調的比例，五弦基準頻率
  Freq = frc(Unmoved2Five).mul(Freq);
  const FreqList = [];
  for (let i = 1; i <= 7; i++) {
    FreqList[i] = Number(
      frc(Freq).mul(frc(PortionList[i]).div(PortionList[Unmoved]))
    );
  }
  return FreqList;
};
const TuningFunctions = {
  Tuning1: (Freq = 432, n = 3) => {
    // 宮調. 五弦基準頻率，默認宮弦，自定宮弦
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 3;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);
    Zhun[4] = TuningSub1(Zhun[6], 5, 4);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[5] = TuningSub1(Zhun[7], 5, 4);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    // 徽法一
    Hui[6] = TuningSub1(Hui[3], 5, 7);
    Hui[1] = TuningSub1(Hui[3], 5, 4);
    Hui[4] = TuningSub1(Hui[6], 5, 4);
    Hui[5] = TuningSub1(Hui[3], 6, 7);
    Hui[7] = TuningSub1(Hui[5], 4, 5);
    Hui[2] = TuningSub1(Hui[7], 7, 4);
    // 徽二
    Hui2[6] = TuningSub1(Hui2[3], 5, 7);
    Hui2[1] = TuningSub1(Hui2[3], 5, 4);
    Hui2[5] = TuningSub1(Hui2[3], 6, 7);
    Hui2[7] = TuningSub1(Hui2[5], 4, 5);
    Hui2[2] = TuningSub1(Hui2[7], 7, 4);
    Hui2[4] = TuningSub1(Hui2[7], 7, 5);
    // 徽三
    Hui3[6] = TuningSub1(Hui3[3], 5, 7);
    Hui3[1] = TuningSub1(Hui3[3], 5, 4);
    Hui3[4] = TuningSub1(Hui3[6], 5, 4);
    Hui3[5] = TuningSub1(Hui3[3], 6, 7);
    Hui3[7] = TuningSub1(Hui3[4], 5, 7);
    Hui3[2] = TuningSub1(Hui3[7], 7, 4);
    // 徽四
    Hui4[5] = TuningSub1(Hui4[3], 6, 7);
    Hui4[7] = TuningSub1(Hui4[5], 4, 5);
    Hui4[4] = TuningSub1(Hui4[7], 7, 5);
    Hui4[2] = TuningSub1(Hui4[7], 7, 4);
    Hui4[1] = TuningSub1(Hui4[4], 7, 5);
    Hui4[6] = TuningSub1(Hui4[1], 4, 7);
    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = Freq;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Xin,
      Hui2,
      Hui3,
      Hui4,
      ZhunFreq,
      HuiFreq,
      TuneName: "宮調 5 6 1 2 3"
    };
  },
  Tuning2: (Freq = 432, n = 1) => {
    // 商調
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 3;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);
    Zhun[4] = TuningSub1(Zhun[6], 5, 4);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[5] = TuningSub1(Zhun[7], 5, 4);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);

    Hui2[6] = TuningSub1(Hui2[3], 5, 7);
    Hui2[1] = TuningSub1(Hui2[3], 5, 4);
    Hui2[4] = TuningSub1(Hui2[6], 5, 4);
    Hui2[5] = TuningSub1(Hui2[3], 6, 7);
    Hui2[7] = TuningSub1(Hui2[5], 4, 5);
    Hui2[2] = TuningSub1(Hui2[7], 7, 4);

    Hui4[6] = TuningSub1(Hui4[3], 5, 7);
    Hui4[1] = TuningSub1(Hui4[3], 5, 4);
    Hui4[5] = TuningSub1(Hui4[3], 6, 7);
    Hui4[7] = TuningSub1(Hui4[5], 4, 5);
    Hui4[4] = TuningSub1(Hui4[7], 7, 5);
    Hui4[2] = TuningSub1(Hui4[7], 7, 4);

    Hui[6] = TuningSub1(Hui[3], 5, 7);
    Hui[1] = TuningSub1(Hui[3], 5, 4);
    Hui[4] = TuningSub1(Hui[6], 5, 4);
    Hui[5] = TuningSub1(Hui[3], 6, 7);
    Hui[7] = TuningSub1(Hui[4], 5, 7);
    Hui[2] = TuningSub1(Hui[7], 7, 4);
    // 徽三同準
    Hui3[6] = TuningSub1(Hui3[3], 5, 7);
    Hui3[1] = TuningSub1(Hui3[3], 5, 4);
    Hui3[4] = TuningSub1(Hui3[6], 5, 4);
    Hui3[7] = TuningSub1(Hui3[4], 5, 7);
    Hui3[5] = TuningSub1(Hui3[7], 5, 4);
    Hui3[2] = TuningSub1(Hui3[7], 7, 4);
    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = Freq;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Xin,
      Hui2,
      Hui3,
      Hui4,
      ZhunFreq,
      HuiFreq,
      TuneName: "商調 1 2 4 5 6"
    };
  },
  Tuning4: (Freq = 432, n = 4) => {
    // 徵調
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui4 = [],
      Xin = [];
    const a = 4;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui4[a] = "1";

    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[5] = TuningSub1(Zhun[7], 5, 4);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    Zhun[6] = TuningSub1(Zhun[4], 4, 5);
    Zhun[3] = TuningSub1(Zhun[6], 7, 5);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);

    Hui[7] = TuningSub1(Hui[4], 5, 7);
    Hui[5] = TuningSub1(Hui[7], 5, 4);
    Hui[2] = TuningSub1(Hui[7], 7, 4);
    Hui[1] = TuningSub1(Hui[4], 7, 5);
    Hui[6] = TuningSub1(Hui[1], 4, 7);
    Hui[3] = TuningSub1(Hui[2], 5, 6);

    Hui2[1] = TuningSub1(Hui2[4], 7, 5);
    Hui2[6] = TuningSub1(Hui2[1], 4, 7);
    Hui2[7] = TuningSub1(Hui2[4], 5, 7);
    Hui2[2] = TuningSub1(Hui2[7], 7, 4);
    Hui2[3] = TuningSub1(Hui2[2], 5, 6);
    Hui2[5] = TuningSub1(Hui2[6], 6, 5);

    Hui4[1] = TuningSub1(Hui4[4], 7, 5);
    Hui4[6] = TuningSub1(Hui4[1], 4, 7);
    Hui4[5] = TuningSub1(Hui4[6], 6, 5);
    Hui4[3] = TuningSub1(Hui4[4], 9, 8);
    Hui4[7] = TuningSub1(Hui4[5], 4, 5);
    Hui4[2] = TuningSub1(Hui4[7], 7, 4);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = Freq;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Xin,
      Hui2,
      Hui4,
      ZhunFreq,
      HuiFreq,
      TuneName: "徵調 4 5 ♭7 1 2"
    };
  },
  Tuning5: (Freq = 432, n = 2) => {
    // 羽調
    let Zhun = [],
      Hui = [],
      Hui4 = [],
      Xin = [];
    const a = 2;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[7] = TuningSub1(Zhun[2], 4, 7);
    Zhun[4] = TuningSub1(Zhun[7], 7, 5);
    Zhun[6] = TuningSub1(Zhun[4], 4, 5);
    Zhun[3] = TuningSub1(Zhun[6], 7, 5);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);
    Zhun[5] = TuningSub1(Zhun[7], 5, 4);

    // 一二三同
    Hui[7] = TuningSub1(Hui[2], 4, 7);
    Hui[5] = TuningSub1(Hui[7], 5, 4);
    Hui[3] = TuningSub1(Hui[5], 7, 6);
    Hui[6] = TuningSub1(Hui[3], 5, 7);
    Hui[1] = TuningSub1(Hui[3], 5, 4);
    Hui[4] = TuningSub1(Hui[2], 4, 5);

    Hui4[4] = TuningSub1(Hui4[2], 4, 5);
    Hui4[5] = TuningSub1(Hui4[4], 8, 9);
    Hui4[7] = TuningSub1(Hui4[2], 4, 7);
    Hui4[3] = TuningSub1(Hui4[7], 5, 3);
    Hui4[6] = TuningSub1(Hui4[3], 5, 7);
    Hui4[1] = TuningSub1(Hui4[3], 5, 4);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = Freq;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Xin,
      Hui4,
      ZhunFreq,
      HuiFreq,
      TuneName: "羽調 ♭7 1 ♭3 4 5"
    };
  },
  Tuning6: (Freq = 432, n = 5) => {
    // 蕤賓調緊五 2 3 5 6 1 2 3
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 5;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[4] = TuningSub1(Zhun[6], 5, 4);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    Zhun[1] = TuningSub1(Zhun[6], 7, 4);
    // 徽法律
    Hui[3] = TuningSub1(Hui[5], 5, 4);
    Hui[1] = TuningSub1(Hui[3], 5, 4);
    Hui[6] = TuningSub1(Hui[3], 5, 7);
    Hui[4] = TuningSub1(Hui[5], 6, 5);
    Hui[7] = TuningSub1(Hui[5], 6, 7);
    Hui[2] = TuningSub1(Hui[5], 6, 4);

    Hui2[3] = TuningSub1(Hui2[5], 5, 4);
    Hui2[4] = TuningSub1(Hui2[5], 6, 5);
    Hui2[7] = TuningSub1(Hui2[5], 6, 7);
    Hui2[2] = TuningSub1(Hui2[5], 6, 4);
    Hui2[1] = TuningSub1(Hui2[4], 7, 5);
    Hui2[6] = TuningSub1(Hui2[1], 4, 7);

    Hui3[3] = TuningSub1(Hui3[5], 5, 4);
    Hui3[1] = TuningSub1(Hui3[3], 5, 4);
    Hui3[6] = TuningSub1(Hui3[3], 5, 7);
    Hui3[4] = TuningSub1(Hui3[6], 5, 4);
    Hui3[7] = TuningSub1(Hui3[5], 6, 7);
    Hui3[2] = TuningSub1(Hui3[5], 6, 4);

    Hui4[4] = TuningSub1(Hui4[5], 6, 5);
    Hui4[7] = TuningSub1(Hui4[5], 6, 7);
    Hui4[2] = TuningSub1(Hui4[5], 6, 4);
    Hui4[1] = TuningSub1(Hui4[4], 7, 5);
    Hui4[6] = TuningSub1(Hui4[1], 4, 7);
    Hui4[3] = TuningSub1(Hui4[1], 4, 5);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 3, "64/81", Freq);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[1];
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Xin,
      Hui2,
      Hui3,
      Hui4,
      ZhunFreq,
      HuiFreq,
      TuneName: "蕤賓調　緊五"
    };
  },
  Tuning7: (Freq = 432, n = 2) => {
    // 清商調緊二五七 6 1 2 3 5 6 7
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 2;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[5] = TuningSub1(Zhun[2], 5, 7);
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);
    Zhun[4] = TuningSub1(Zhun[6], 5, 4);
    Zhun[7] = TuningSub1(Zhun[2], 4, 7);
    // 徽法律
    Hui[4] = TuningSub1(Hui[2], 6, 7);
    Hui[5] = TuningSub1(Hui[2], 5, 7);
    Hui[3] = TuningSub1(Hui[5], 5, 4);
    Hui[6] = TuningSub1(Hui[4], 4, 5);
    Hui[1] = TuningSub1(Hui[6], 7, 4);
    Hui[7] = TuningSub1(Hui[2], 4, 7);

    Hui2[4] = TuningSub1(Hui2[2], 6, 7);
    Hui2[5] = TuningSub1(Hui2[2], 5, 7);
    Hui2[6] = TuningSub1(Hui2[4], 4, 5);
    Hui2[1] = TuningSub1(Hui2[6], 7, 4);
    Hui2[3] = TuningSub1(Hui2[6], 7, 5);
    Hui2[7] = TuningSub1(Hui2[2], 4, 7);

    Hui3[4] = TuningSub1(Hui3[2], 6, 7);
    Hui3[5] = TuningSub1(Hui3[2], 5, 7);
    Hui3[3] = TuningSub1(Hui3[5], 5, 4);
    Hui3[6] = TuningSub1(Hui3[3], 5, 7);
    Hui3[1] = TuningSub1(Hui3[6], 7, 4);
    Hui3[7] = TuningSub1(Hui3[2], 4, 7);

    Hui4[4] = TuningSub1(Hui4[2], 6, 7);
    Hui4[6] = TuningSub1(Hui4[4], 4, 5);
    Hui4[3] = TuningSub1(Hui4[6], 7, 5);
    Hui4[5] = TuningSub1(Hui4[3], 4, 5);
    Hui4[1] = TuningSub1(Hui4[6], 7, 4);
    Hui4[7] = TuningSub1(Hui4[2], 4, 7);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 3, "64/81", Freq);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[6] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[1];
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Xin,
      Hui2,
      Hui3,
      Hui4,
      ZhunFreq,
      HuiFreq,
      TuneName: "淸商調　緊二五七"
    };
  },
  Tuning8: (Freq = 432, n = 1) => {
    // 慢角調慢三 1 2 3 5 6 1 2
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 1;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[4] = TuningSub1(Zhun[1], 5, 7);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    Zhun[5] = TuningSub1(Zhun[2], 5, 7);
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[6] = TuningSub1(Zhun[1], 4, 7);
    // 徽法律
    Hui[4] = TuningSub1(Hui[1], 5, 7);
    Hui[7] = TuningSub1(Hui[4], 5, 7);
    Hui[2] = TuningSub1(Hui[4], 5, 4);
    Hui[3] = TuningSub1(Hui[1], 6, 7);
    Hui[5] = TuningSub1(Hui[3], 4, 5);
    Hui[6] = TuningSub1(Hui[1], 4, 7);

    Hui2[4] = TuningSub1(Hui2[1], 5, 7);
    Hui2[3] = TuningSub1(Hui2[1], 6, 7);
    Hui2[5] = TuningSub1(Hui2[3], 4, 5);
    Hui2[2] = TuningSub1(Hui2[5], 7, 5);
    Hui2[7] = TuningSub1(Hui2[2], 4, 7);
    Hui2[6] = TuningSub1(Hui2[1], 4, 7);

    Hui3[4] = TuningSub1(Hui3[1], 5, 7);
    Hui3[7] = TuningSub1(Hui3[4], 5, 7);
    Hui3[2] = TuningSub1(Hui3[4], 5, 4);
    Hui3[3] = TuningSub1(Hui3[1], 6, 7);
    Hui3[5] = TuningSub1(Hui3[2], 5, 7);
    Hui3[6] = TuningSub1(Hui3[1], 4, 7);

    Hui4[3] = TuningSub1(Hui4[1], 6, 7);
    Hui4[5] = TuningSub1(Hui4[3], 4, 5);
    Hui4[2] = TuningSub1(Hui4[5], 7, 5);
    Hui4[7] = TuningSub1(Hui4[2], 4, 7);
    Hui4[4] = TuningSub1(Hui4[7], 7, 5);
    Hui4[6] = TuningSub1(Hui4[1], 4, 7);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    // const ZhunFreq = TuningSub3(Zhun, 2, '2/3', Freq)
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[12] / 2;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Hui2,
      Hui3,
      Hui4,
      Xin,
      ZhunFreq,
      HuiFreq,
      TuneName: "慢角調　慢三"
    };
  },
  Tuning9: (Freq = 432, n = 4) => {
    // 慢宮調慢一三六 3 5 6 1 2 3 5
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 4;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    Zhun[5] = TuningSub1(Zhun[7], 5, 4);
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[1] = TuningSub1(Zhun[6], 7, 4);
    // 徽法律
    Hui[3] = TuningSub1(Hui[4], 6, 5);
    Hui[6] = TuningSub1(Hui[4], 6, 7);
    Hui[1] = TuningSub1(Hui[6], 7, 4);
    Hui[2] = TuningSub1(Hui[4], 5, 4);
    Hui[7] = TuningSub1(Hui[4], 5, 7);
    Hui[5] = TuningSub1(Hui[7], 5, 4);

    Hui2[3] = TuningSub1(Hui2[4], 6, 5);
    Hui2[6] = TuningSub1(Hui2[4], 6, 7);
    Hui2[1] = TuningSub1(Hui2[6], 7, 4);
    Hui2[2] = TuningSub1(Hui2[4], 5, 4);
    Hui2[7] = TuningSub1(Hui2[4], 5, 7);
    Hui2[5] = TuningSub1(Hui2[3], 4, 5);

    Hui3[6] = TuningSub1(Hui3[4], 6, 7);
    Hui3[1] = TuningSub1(Hui3[6], 7, 4);
    Hui3[2] = TuningSub1(Hui3[4], 5, 4);
    Hui3[7] = TuningSub1(Hui3[4], 5, 7);
    Hui3[5] = TuningSub1(Hui3[7], 5, 4);
    Hui3[3] = TuningSub1(Hui3[5], 5, 4);

    Hui4[3] = TuningSub1(Hui4[4], 6, 5);
    Hui4[6] = TuningSub1(Hui4[4], 6, 7);
    Hui4[1] = TuningSub1(Hui4[6], 7, 4);
    Hui4[5] = TuningSub1(Hui4[3], 4, 5);
    Hui4[7] = TuningSub1(Hui4[5], 4, 5);
    Hui4[2] = TuningSub1(Hui4[7], 7, 4);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[2] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[12] / 2;
    Xin[6] = +List12[2];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Hui2,
      Hui3,
      Hui4,
      Xin,
      ZhunFreq,
      HuiFreq,
      OneDifZhun: "243/256",
      OneDifHui: "15/16",
      OneDifXin: 0.94387431268169,
      TuneName: "慢宮調　慢一三六"
    };
  },
  Tuning10: (Freq = 432, n = 1) => {
    // 徽法律淒涼調緊二五 5 #6 1 2 4 5 6
    let Hui = [],
      Zhun = [],
      Hui2 = [],
      Hui4 = [],
      Xin = [];
    const a = 1;
    Hui[a] = "1";
    Zhun[a] = "1";
    Hui2[a] = "1";
    Hui4[a] = "1";
    // 準法
    Zhun[3] = TuningSub1(Zhun[1], 4, 5);
    Zhun[2] = TuningSub1(Zhun[3], 10, 9);
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[4] = TuningSub1(Zhun[6], 5, 4);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[5] = TuningSub1(Zhun[3], 4, 5);
    // 徽法律
    Hui2[6] = TuningSub1(Hui2[1], 4, 7);
    Hui2[2] = TuningSub1(Hui2[6], 5, 3);
    Hui2[3] = TuningSub1(Hui2[6], 7, 5);
    Hui2[5] = TuningSub1(Hui2[2], 5, 7);
    Hui2[4] = TuningSub1(Hui2[6], 5, 4);
    Hui2[7] = TuningSub1(Hui2[3], 3, 5);

    Hui[6] = TuningSub1(Hui[1], 4, 7);
    Hui[3] = TuningSub1(Hui[6], 7, 5);
    Hui[2] = TuningSub1(Hui[6], 5, 3);
    Hui[5] = TuningSub1(Hui[2], 5, 7);
    // Hui[5] = TuningSub1(Hui[6], 10, 9)
    Hui[4] = TuningSub1(Hui[6], 5, 4);
    Hui[7] = TuningSub1(Hui[4], 5, 7);

    Hui4[6] = TuningSub1(Hui4[1], 4, 7);
    Hui4[2] = TuningSub1(Hui4[6], 5, 3);
    Hui4[3] = TuningSub1(Hui4[6], 7, 5);
    Hui4[5] = TuningSub1(Hui4[2], 5, 7);
    Hui4[7] = TuningSub1(Hui4[3], 3, 5);
    Hui4[4] = TuningSub1(Hui4[7], 7, 5);

    Hui2 = TuningSub2(Hui2, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    Zhun = TuningSub2(Zhun, a, n);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    const ZhunFreq = TuningSub3(Zhun, 3, "4/5", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[6] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[1];
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Hui2,
      Hui4,
      Xin,
      HuiFreq,
      ZhunFreq,
      TuneName: "䠂商調　緊二五"
    };
  },
  Tuning11: (Freq = 432, n = 1) => {
    // 黃鐘調緊五慢一 1 3 5 6 1 2 3 或 4 6 1 2 4 5 6
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 1;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[5] = TuningSub1(Zhun[1], 4, 7);
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[4] = TuningSub1(Zhun[6], 5, 4);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    // 徽法律
    Hui[2] = TuningSub1(Hui[1], 3, 4);
    Hui[3] = TuningSub1(Hui[1], 5, 7);
    Hui[4] = TuningSub1(Hui[1], 3, 5);
    Hui[5] = TuningSub1(Hui[1], 4, 7);
    Hui[7] = TuningSub1(Hui[2], 4, 7);
    Hui[6] = TuningSub1(Hui[3], 5, 7);

    Hui2[2] = TuningSub1(Hui2[1], 3, 4);
    Hui2[3] = TuningSub1(Hui2[1], 5, 7);
    Hui2[4] = TuningSub1(Hui2[1], 3, 5);
    Hui2[5] = TuningSub1(Hui2[1], 4, 7);
    Hui2[7] = TuningSub1(Hui2[2], 4, 7);
    Hui2[6] = TuningSub1(Hui2[4], 4, 5);

    Hui3[2] = TuningSub1(Hui3[1], 3, 4);
    Hui3[3] = TuningSub1(Hui3[1], 5, 7);
    Hui3[5] = TuningSub1(Hui3[1], 4, 7);
    Hui3[7] = TuningSub1(Hui3[2], 4, 7);
    Hui3[6] = TuningSub1(Hui3[3], 5, 7);
    Hui3[4] = TuningSub1(Hui3[6], 5, 4);

    Hui4[2] = TuningSub1(Hui4[1], 3, 4);
    Hui4[4] = TuningSub1(Hui4[1], 3, 5);
    Hui4[5] = TuningSub1(Hui4[1], 4, 7);
    Hui4[7] = TuningSub1(Hui4[2], 4, 7);
    Hui4[6] = TuningSub1(Hui4[4], 4, 5);
    Hui4[3] = TuningSub1(Hui4[6], 7, 5);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 3, "64/81", Freq);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[1] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[1];
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Hui2,
      Hui3,
      Hui4,
      Xin,
      ZhunFreq,
      HuiFreq,
      OneDifZhun: "8/9",
      OneDifHui: "9/10",
      OneDifXin: 0.8908987181403393,
      TuneName: "黃鐘調　緊五慢一"
    };
  },
  Tuning12: (Freq = 432, n = 1) => {
    // 無媒調慢三六 1 2 3 5 6 7 2 或 4 5 6 1 2 3 5
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 1;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[4] = TuningSub1(Zhun[1], 5, 7);
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[2] = TuningSub1(Zhun[7], 7, 4);
    Zhun[5] = TuningSub1(Zhun[2], 5, 7);
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    // 徽法律
    Hui[3] = TuningSub1(Hui[1], 3, 4);
    Hui[4] = TuningSub1(Hui[3], 5, 6);
    Hui[6] = TuningSub1(Hui[4], 6, 7);
    Hui[5] = TuningSub1(Hui[1], 3, 5);
    Hui[2] = TuningSub1(Hui[4], 5, 4);
    Hui[7] = TuningSub1(Hui[2], 4, 7);

    // 陳應時
    // Hui[3] = TuningSub1(Hui[1], 4, 5)
    // Hui[5] = TuningSub1(Hui[3], 6, 7)
    // Hui[7] = TuningSub1(Hui[5], 4, 5)
    // Hui[4] = TuningSub1(Hui[1], 5, 7)
    // Hui[6] = TuningSub1(Hui[4], 6, 7)
    // Hui[2] = TuningSub1(Hui[7], 7, 4)
    // Hui[3] = TuningSub1(Hui[5], 5, 4)
    // 我的不用最後一步
    Hui2[3] = TuningSub1(Hui2[1], 3, 4);
    Hui2[4] = TuningSub1(Hui2[3], 5, 6);
    Hui2[6] = TuningSub1(Hui2[4], 6, 7);
    Hui2[5] = TuningSub1(Hui2[1], 3, 5);
    Hui2[2] = TuningSub1(Hui2[5], 7, 5);
    Hui2[7] = TuningSub1(Hui2[2], 4, 7);

    Hui3[3] = TuningSub1(Hui3[1], 3, 4);
    Hui3[4] = TuningSub1(Hui3[3], 5, 6);
    Hui3[6] = TuningSub1(Hui3[4], 6, 7);
    Hui3[7] = TuningSub1(Hui3[4], 5, 7);
    Hui3[2] = TuningSub1(Hui3[7], 7, 4);
    Hui3[5] = TuningSub1(Hui3[2], 5, 7);

    Hui4[3] = TuningSub1(Hui4[1], 3, 4);
    Hui4[5] = TuningSub1(Hui4[1], 3, 5);
    Hui4[6] = TuningSub1(Hui4[3], 5, 7);
    Hui4[2] = TuningSub1(Hui4[5], 7, 5);
    Hui4[4] = TuningSub1(Hui4[2], 4, 5);
    Hui4[7] = TuningSub1(Hui4[2], 4, 7);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    // const ZhunFreq = TuningSub3(Zhun, 2, '2/3', Freq)
    const ZhunFreq = TuningSub3(Zhun, 5, "1", Freq);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[12] / 2;
    Xin[6] = +List12[2];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Hui2,
      Hui3,
      Hui4,
      Xin,
      ZhunFreq,
      HuiFreq,
      TuneName: "无媒調　慢三六"
    };
  },
  Tuning13: (Freq = 432, n = 4) => {
    // 間弦一慢一三 7 2 3 5 6 1 2 或 3 5 6 1 2 4 5
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui3 = [],
      Hui4 = [],
      Xin = [];
    const a = 4;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui3[a] = "1";
    Hui4[a] = "1";
    // 準法律
    Zhun[7] = TuningSub1(Zhun[4], 5, 7);
    Zhun[2] = TuningSub1(Zhun[4], 5, 4);
    Zhun[5] = TuningSub1(Zhun[2], 5, 7);
    Zhun[6] = TuningSub1(Zhun[4], 4, 5);
    Zhun[3] = TuningSub1(Zhun[5], 5, 4);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);
    // 徽法律
    Hui[6] = TuningSub1(Hui[4], 4, 5);
    Hui[2] = TuningSub1(Hui[4], 5, 4);
    Hui[7] = TuningSub1(Hui[2], 4, 7);
    Hui[5] = TuningSub1(Hui[7], 5, 4);
    Hui[3] = TuningSub1(Hui[4], 6, 5);
    Hui[1] = TuningSub1(Hui[3], 5, 4);

    Hui2[6] = TuningSub1(Hui2[4], 4, 5);
    Hui2[5] = TuningSub1(Hui2[6], 6, 5);
    Hui2[2] = TuningSub1(Hui2[4], 5, 4);
    Hui2[7] = TuningSub1(Hui2[2], 4, 7);
    Hui2[3] = TuningSub1(Hui2[4], 6, 5);
    Hui2[1] = TuningSub1(Hui2[3], 5, 4);

    Hui3[6] = TuningSub1(Hui3[4], 4, 5);
    Hui3[2] = TuningSub1(Hui3[4], 5, 4);
    Hui3[7] = TuningSub1(Hui3[2], 4, 7);
    Hui3[5] = TuningSub1(Hui3[7], 5, 4);
    Hui3[3] = TuningSub1(Hui3[5], 5, 4);
    Hui3[1] = TuningSub1(Hui3[2], 6, 5);

    Hui4[6] = TuningSub1(Hui4[4], 4, 5);
    Hui4[5] = TuningSub1(Hui4[6], 6, 5);
    Hui4[7] = TuningSub1(Hui4[5], 4, 5);
    Hui4[2] = TuningSub1(Hui4[7], 7, 4);
    Hui4[3] = TuningSub1(Hui4[4], 6, 5);
    Hui4[1] = TuningSub1(Hui4[3], 5, 4);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui3 = TuningSub2(Hui3, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 4, "8/9", Freq);
    const HuiFreq = TuningSub3(Hui, 4, "9/10", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[2] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[12] / 2;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui,
      Hui2,
      Hui3,
      Hui4,
      Xin,
      ZhunFreq,
      HuiFreq,
      OneDifZhun: "243/256",
      OneDifHui: "243/256",
      OneDifXin: 0.943874312681694,
      TuneName: "間弦一　慢一三"
    };
  },
  Tuning14: (Freq = 432, n = 1) => {
    // 間弦二緊五慢三 1 2 3 5 #6 1 2 或 2 3 b5 6 1 2 3
    let Zhun = [],
      Hui = [],
      Hui2 = [],
      Hui4 = [],
      Xin = [];
    const a = 1;
    Zhun[a] = "1";
    Hui[a] = "1";
    Hui2[a] = "1";
    Hui4[a] = "1";
    Zhun[4] = TuningSub1(Zhun[1], 5, 7);
    Zhun[2] = TuningSub1(Zhun[4], 5, 4);
    Zhun[3] = TuningSub1(Zhun[2], 9, 10);
    Zhun[6] = TuningSub1(Zhun[1], 4, 7);
    Zhun[5] = TuningSub1(Zhun[6], 10, 9);
    Zhun[7] = TuningSub1(Zhun[2], 4, 7);
    // 徽法律
    Hui2[3] = TuningSub1(Hui2[1], 6, 7);
    Hui2[4] = TuningSub1(Hui2[1], 5, 7);
    Hui2[5] = TuningSub1(Hui2[4], 5, 6);
    Hui2[2] = TuningSub1(Hui2[3], 10, 9);
    Hui2[7] = TuningSub1(Hui2[2], 4, 7);
    Hui2[6] = TuningSub1(Hui2[1], 4, 7);

    Hui[3] = TuningSub1(Hui[1], 6, 7);
    Hui[4] = TuningSub1(Hui[1], 5, 7);
    Hui[5] = TuningSub1(Hui[4], 5, 6);
    Hui[7] = TuningSub1(Hui[5], 6, 7);
    Hui[2] = TuningSub1(Hui[7], 7, 4);
    Hui[6] = TuningSub1(Hui[1], 4, 7);

    Hui4[3] = TuningSub1(Hui4[1], 6, 7);
    Hui4[2] = TuningSub1(Hui4[3], 10, 9);
    Hui4[7] = TuningSub1(Hui4[2], 4, 7);
    Hui4[6] = TuningSub1(Hui4[1], 4, 7);
    Hui4[4] = TuningSub1(Hui4[2], 4, 5);
    Hui4[5] = TuningSub1(Hui4[6], 9, 8);

    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    Hui2 = TuningSub2(Hui2, a, n);
    Hui4 = TuningSub2(Hui4, a, n);
    const ZhunFreq = TuningSub3(Zhun, 2, "2/3", Freq);
    const HuiFreq = TuningSub3(Hui, 2, "2/3", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[1];
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return {
      Zhun,
      Hui2,
      Hui,
      Hui4,
      Xin,
      ZhunFreq,
      HuiFreq,
      TuneName: "間弦二　緊五慢三"
    };
  },
  Tuning15: (Freq = 432, n = 3) => {
    // 徽法律平調慢五七 5 b6 1 2 b3 5 b6 或 3 4 5 7 1 3 4
    let Hui = [],
      Xin = [];
    const a = 3;
    Hui[a] = "1";
    // 徽法律
    Hui[5] = TuningSub1(Hui[3], 5, 6);
    Hui[7] = TuningSub1(Hui[3], 4, 6);
    Hui[1] = TuningSub1(Hui[3], 5, 4);
    Hui[4] = TuningSub1(Hui[1], 5, 7);
    Hui[6] = TuningSub1(Hui[3], 5, 7);
    Hui[2] = TuningSub1(Hui[7], 7, 4);
    Hui = TuningSub2(Hui, a, n);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[4] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[11] / 2;
    Xin[6] = +List12[3];
    Xin[7] = +List12[4];
    return { Hui, Xin, HuiFreq, TuneName: "日傳平調　慢五七" };
  },
  Tuning16: (Freq = 432, n = 2) => {
    // 徽法律側商調慢三四六 #6 1 2 3 5 6 1 或 1 2 3 b5 6 b1 2
    let Hui = [],
      Xin = [];
    const a = 2;
    Hui[a] = "1";
    // 徽法律
    Hui[4] = TuningSub1(Hui[2], 6, 7);
    Hui[6] = TuningSub1(Hui[4], 4, 5);
    Hui[5] = TuningSub1(Hui[2], 5, 7);
    Hui[7] = TuningSub1(Hui[2], 4, 7);
    Hui[3] = TuningSub1(Hui[5], 5, 4);
    Hui[1] = TuningSub1(Hui[5], 5, 3);
    Hui = TuningSub2(Hui, a, n);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[9] / 2;
    Xin[5] = +List12[12] / 2;
    Xin[6] = +List12[2];
    Xin[7] = +List12[5];
    return { Hui, Xin, HuiFreq, TuneName: "側商調　慢三四六" };
  },
  Tuning17: (Freq = 432, n = 1) => {
    // 徽法律側羽調緊七
    let Hui = [],
      Xin = [];
    const a = 1;
    Hui[a] = "1";
    // 徽法律
    Hui[6] = TuningSub1(Hui[1], 4, 7);
    Hui[5] = TuningSub1(Hui[6], 6, 5);
    Hui[4] = TuningSub1(Hui[6], 5, 4);
    Hui[3] = TuningSub1(Hui[6], 7, 5);
    Hui[2] = TuningSub1(Hui[3], 6, 5);
    Hui[7] = TuningSub1(Hui[6], 5, 6);
    Hui = TuningSub2(Hui, a, n);
    const HuiFreq = TuningSub3(Hui, 5, "1", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[5] / 2;
    Xin[3] = +List12[7] / 2;
    Xin[4] = +List12[9] / 2;
    Xin[5] = +List12[12] / 2;
    Xin[6] = +List12[2];
    Xin[7] = +List12[5];
    return { Hui, Xin, HuiFreq, TuneName: "側羽調　緊七" };
  },
  Tuning18: (Freq = 432, n = 5) => {
    // 徽法側蜀調緊二慢五 5 #6 1 2 b3 5 6
    let Zhun = [],
      Hui = [],
      Xin = [];
    const a = 3;
    Zhun[a] = "1";
    Hui[a] = "1";
    // 按音調弦
    Zhun[6] = TuningSub1(Zhun[3], 5, 7);
    Zhun[1] = TuningSub1(Zhun[3], 5, 4);
    Zhun[4] = TuningSub1(Zhun[6], 16, 10);
    Zhun[2] = TuningSub1(Zhun[4], 16, "10 65/81");
    Zhun[5] = TuningSub1(Zhun[2], "9 8/9", 16); // '9 8/9'五是純律，七是五度律。如果是10，五是五度律，七是純律。
    Zhun[7] = TuningSub1(Zhun[5], "9 8/15", 16);
    // 徽
    Hui[6] = TuningSub1(Hui[3], 5, 7);
    Hui[1] = TuningSub1(Hui[3], 5, 4);
    Hui[2] = TuningSub1(Hui[1], 5, 6);
    Hui[7] = TuningSub1(Hui[3], 3, 5);
    Hui[4] = TuningSub1(Hui[7], 7, 5);
    Hui[5] = TuningSub1(Hui[6], 4, 3);
    Zhun = TuningSub2(Zhun, a, n);
    Hui = TuningSub2(Hui, a, n);
    const ZhunFreq = TuningSub3(Zhun, 3, "4/5", Freq);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[3] / 2;
    Xin[2] = +List12[6] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[11] / 2;
    Xin[6] = +List12[3];
    Xin[7] = +List12[5];
    return { Zhun, Hui, Xin, ZhunFreq, HuiFreq, TuneName: "側蜀調　緊二慢五" };
  },
  Tuning19: (Freq = 432, n = 1) => {
    // 徽法律側楚調慢一二緊五七
    let Hui = [],
      Xin = [];
    const a = 1;
    Hui[a] = "1";
    // 徽法律
    Hui[2] = TuningSub1(Hui[1], 5, 6);
    Hui[3] = TuningSub1(Hui[2], 6, 7);
    Hui[5] = TuningSub1(Hui[1], 4, 7);
    Hui[7] = TuningSub1(Hui[5], 4, 5);
    Hui[6] = TuningSub1(Hui[7], 6, 5);
    Hui[4] = TuningSub1(Hui[5], 6, 5);
    Hui = TuningSub2(Hui, a, n);
    const HuiFreq = TuningSub3(Hui, 3, "4/5", Freq);
    // 新法密率
    const List12 = EqualTemp(Freq).List1;
    Xin[1] = +List12[1] / 2;
    Xin[2] = +List12[4] / 2;
    Xin[3] = +List12[8] / 2;
    Xin[4] = +List12[10] / 2;
    Xin[5] = +List12[1];
    Xin[6] = +List12[3];
    Xin[7] = +List12[6];
    return {
      Hui,
      Xin,
      HuiFreq,
      OneDifHui: "9/10",
      OneDifXin: 0.890898718140339,
      TuneName: "側楚調　慢一二緊五七"
    };
  }
};

const NumList = "〇一二三四五六七八九";

// 品弦法
export const Tuning = (TuningMode, Freq = 432, n) => {
  // 动态调用
  const funcName = `Tuning${TuningMode}`;
  const tuningFunc = TuningFunctions[funcName];
  const {
    Zhun,
    Hui,
    Xin,
    Hui2,
    Hui3,
    Hui4,
    ZhunFreq,
    HuiFreq,
    OneDifZhun,
    OneDifHui,
    TuneName
  } = tuningFunc(Freq, n);
  const DifZhun = [],
    NameZhun = [],
    DifHui = [],
    NameHui = [],
    NameHui2 = [],
    NameHui3 = [],
    NameHui4 = [],
    PitchZhun = [],
    PitchHui = [];
  if (Zhun) {
    for (let i = 1; i <= 6; i++) {
      DifZhun[i] = OctaveCent(Zhun[i + 1], Zhun[i]).Cent.toFixed(1);
    }
    for (let i = 1; i <= 7; i++) {
      NameZhun[i] = Portion2Name(Zhun[i], 2);
      PitchZhun[i] = Portion2Pitch(Zhun[i], Zhun[1], OneDifZhun || 1);
    }
  }
  if (Hui) {
    for (let i = 1; i <= 6; i++) {
      DifHui[i] = OctaveCent(Hui[i + 1], Hui[i]).Cent.toFixed(1);
    }
    for (let i = 1; i <= 7; i++) {
      NameHui[i] = Portion2Name(Hui[i], 2);
      PitchHui[i] = Portion2Pitch(Hui[i], Hui[1], OneDifHui || 1);
    }
  }
  if (Hui2) {
    for (let i = 1; i <= 7; i++) {
      NameHui2[i] = Portion2Name(Hui2[i], 2);
    }
  }
  if (Hui3) {
    for (let i = 1; i <= 7; i++) {
      NameHui3[i] = Portion2Name(Hui3[i], 2);
    }
  }
  if (Hui4) {
    for (let i = 1; i <= 7; i++) {
      NameHui4[i] = Portion2Name(Hui4[i], 2);
    }
  }
  let Print = [];
  for (let i = 1; i <= 7; i++) {
    const Tmp = Zhun
      ? [
          Zhun[i],
          PitchZhun[i],
          NameZhun[i],
          +ZhunFreq[i].toFixed(4),
          DifZhun[i - 1]
        ]
      : ["", "", "", "", ""];
    const Tmp1 = Hui
      ? [Hui[i], PitchHui[i], NameHui[i], +HuiFreq[i].toFixed(4), DifHui[i - 1]]
      : ["", "", "", "", ""];
    const Tmp2 = Hui2 ? [Hui2[i], NameHui2[i]] : ["", ""];
    const Tmp3 = Hui3 ? [Hui3[i], NameHui3[i]] : ["", ""];
    const Tmp4 = Hui4 ? [Hui4[i], NameHui4[i]] : ["", ""];
    Print = Print.concat({
      title: NumList[i],
      data: [...Tmp, ...Tmp1, ...Tmp2, ...Tmp3, ...Tmp4, Xin[i]]
    });
  }
  return { TuneName, Print };
};
// console.log(Tuning('9'))

// 徽位音。弦法、律制、宮弦
export const FretPitch = (TuningMode, TempMode, n) => {
  const funcName = `Tuning${TuningMode}`;
  const tuningFunc = TuningFunctions[funcName];
  const { Zhun, Hui, Hui2, Hui3, Hui4, OneDifHui, OneDifZhun } = tuningFunc(
    432,
    n
  );
  let Print1 = [],
    Print2 = [],
    Name1AList = [],
    Name1BList = [],
    Name2AList = [],
    Name2BList = [],
    StringList = [],
    Print3 = [];
  let OneDif = "";
  TempMode = +TempMode;
  if (TempMode === 1) {
    StringList = Hui;
    OneDif = OneDifHui;
  } else if (TempMode === 2) {
    StringList = Hui2;
    OneDif = OneDifHui;
  } else if (TempMode === 3) {
    StringList = Hui3;
    OneDif = OneDifHui;
  } else if (TempMode === 4) {
    StringList = Hui4;
    OneDif = OneDifHui;
  } else if (TempMode === 5) {
    StringList = Zhun;
    OneDif = OneDifZhun;
  }
  if (StringList === undefined) {
    return "無此律制";
  }
  for (let i = 1; i <= 7; i++) {
    // 七弦
    let Pitch = [],
      NameTmp = [],
      NameBTmp = [];
    for (let k = 0; k <= 16; k++) {
      // 17徽
      Pitch[k] = frc(StringList[i]).div(Fret2Leng(k)).toFraction(false); // 這個是核心，其他都是附帶
      NameTmp[k] = Portion2Name(Pitch[k], 2); // Pitch是頻率比分數 知道頻率比，在對象中找到對應的音名唱名
      NameBTmp[k] = Portion2Pitch(Pitch[k], StringList[1], OneDif || 1);
      Pitch[k] += `</br>`;
      Pitch[k] += NameTmp[k] ? NameTmp[k] + " " : "";
      Pitch[k] += NameBTmp[k] || "";
    }
    Name1AList = Name1AList.concat(NameTmp);
    Name1BList = Name1BList.concat(NameBTmp); // 右邊這個每個循環清空
    Pitch = Pitch.reverse();
    Print1 = Print1.concat({
      title: NumList[i],
      data: Pitch
    });
  }
  Name1AList = Unique(Name1AList);
  Name1BList = Unique(Name1BList);
  const Name1Print = [
    {
      data: Name1BList
    },
    {
      data: Name1AList
    }
  ];

  for (let i = 1; i <= 7; i++) {
    // 泛音
    let Pitch = [],
      NameTmp = [],
      NameBTmp = [];
    for (let k = 0; k <= 15; k++) {
      const fret = 7 - Math.abs(k - 7);
      Pitch[k] = frc(StringList[i]).div(Fret2Leng(fret)).toFraction(false); // 這個是核心，其他都是附帶
      NameTmp[k] = Portion2Name(Pitch[k], 2); // Pitch是頻率比分數 知道頻率比，在對象中找到對應的音名唱名
      NameBTmp[k] = Portion2Pitch(Pitch[k], StringList[1], OneDif || 1);
      Pitch[k] += `</br>`;
      Pitch[k] += NameTmp[k] ? NameTmp[k] + " " : "";
      Pitch[k] += NameBTmp[k] || "";
    }
    Name2AList = Name2AList.concat(NameTmp);
    Name2BList = Name2BList.concat(NameBTmp); // 右邊這個每個循環清空
    Pitch = Pitch.reverse();
    Print2 = Print2.concat({
      title: NumList[i],
      data: Pitch
    });
  }
  Name2AList = Unique(Name2AList);
  Name2BList = Unique(Name2BList);
  const Name2Print = [
    {
      data: Name2BList
    },
    {
      data: Name2AList
    }
  ];

  for (let i = 1; i <= 7; i++) {
    // 七限
    let Pitch = [];
    for (let k = 1; k <= 6; k++) {
      Pitch[k] = frc(StringList[i])
        .div(k + "/7")
        .toFraction(false);
      Pitch[k] = IntoOctave(Pitch[k]);
    }
    Pitch = Pitch.reverse();
    Print3 = Print3.concat({
      title: NumList[i],
      data: Pitch
    });
  }
  return { Print1, Print2, Print3, Name1Print, Name2Print };
};
// console.log(FretPitch(1, 1, 0))

// 律内音
export const BetweenFret = (TuningMode, TempMode, n, isSimple) => {
  isSimple = +isSimple;
  const funcName = `Tuning${TuningMode}`;
  const tuningFunc = TuningFunctions[funcName];
  const { Zhun, Hui, Hui2, Hui3, Hui4, OneDifHui, OneDifZhun } = tuningFunc(
    432,
    n
  );
  let Print = [],
    StringList = [],
    FushionList = [],
    Fret = [];
  let OneDif = "";
  TempMode = +TempMode;
  if (TempMode === 1) {
    StringList = Hui;
    FushionList = isSimple ? FushionList1S : FushionList1;
    OneDif = OneDifHui;
  } else if (TempMode === 2) {
    StringList = Hui2;
    FushionList = isSimple ? FushionList2S : FushionList2;
    OneDif = OneDifHui;
  } else if (TempMode === 3) {
    StringList = Hui3;
    FushionList = isSimple ? FushionList3S : FushionList3;
    OneDif = OneDifHui;
  } else if (TempMode === 4) {
    StringList = Hui4;
    FushionList = isSimple ? FushionList4S : FushionList4;
    OneDif = OneDifHui;
  } else if (TempMode === 5) {
    StringList = Zhun;
    FushionList = isSimple ? FushionList5S : FushionList5;
    OneDif = OneDifZhun;
  }
  //  else if (TempMode === 6) {
  //     StringList = Xin
  //     FushionList = isSimple ? FushionList6S : FushionList6
  //     OneDif = OneDifXin
  // }
  let Length = [];
  for (let i = 1; i <= 7; i++) {
    for (let m = 0; m <= 2; m++) {
      for (
        let k = FushionList.length * m;
        k < FushionList.length * (m + 1);
        k++
      ) {
        let tmp = frc(StringList[i]).div(
          FushionList[k - FushionList.length * m]
        );
        while (Number(tmp) >= (1 / 2) ** m) {
          tmp = tmp.div(2);
        }
        while (Number(tmp) < (1 / 2) ** (m + 1)) {
          tmp = tmp.mul(2);
        }
        Length = Length.concat(tmp.toFraction(false));
      }
    }
  }
  Length = Unique(Length);
  Length.sort((a, b) => Leng2Fret(b) - Leng2Fret(a));
  for (let l = 0; l < Length.length; l++) {
    // 去掉2.5徽以上的
    if (Leng2Fret(Length[l]) < 2.5) {
      Length = Length.splice(0, l);
    }
  }
  for (let l = 0; l < Length.length; l++) {
    Fret[l] = Leng2Fret(Length[l]);
  }
  Print = Print.concat({
    title: "徽",
    data: Fret
  });
  for (let i = 1; i <= 7; i++) {
    let String = [];
    for (let j = 0; j < Length.length; j++) {
      let tmp1 = frc(StringList[i]).div(Length[j]);
      tmp1 = IntoOctave(tmp1);
      if (FushionList.indexOf(tmp1) > -1) {
        String[j] = Portion2Name(tmp1, 2);
        String[j] =
          String[j] + " " + Portion2Pitch(tmp1, StringList[1], OneDif || 1);
      } else {
        String[j] = " ";
      }
    }
    Print = Print.concat({
      title: NumList[i],
      data: String
    });
  }
  return Print;
};
// console.log(BetweenFret(1, 6, 0))
// console.log(FretPitch(1, 5, 0))
// while (Number(ZhunPitch[k]) >= 2) {
//     ZhunPitch[k] = ZhunPitch[k].div(2)
// }
// const faas = z => { // 把分數處理成音分
//     const b = []
//     for (let i = 0; i < PythagoreanListC.length; i++) {
//         const a = PythagoreanListC[i].split('/')[0] / PythagoreanListC[i].split('/')[1]
//         b[i] = (Math.log2(a) * 1200).toFixed(2)
//     }
//     return b
// }
// console.log(faas(1))

// const fa3 = z => {
//     const a = 1.276584120678397
//     return frc(a).toFraction(false)
// }
// console.log(fa3(3))

// 減字譜 ⇒ 唱名、頻率比、頻率
// s散音，f泛音，a按音
export const Position2Pitch = (
  Input,
  TuningMode,
  TempMode,
  GongString,
  ZhiString,
  BaseFreq,
  OutputMode,
  isStrict
) => {
  // ；品弦法；律制；是否是混合律制；宮弦；徵弦（宮弦徵弦只能二選一，另一個爲0）；宮弦頻率；輸出模式 1 唱名 2音名 3 與宮弦頻率比 4 頻率；
  TempMode = +TempMode;
  TuningMode = +TuningMode;
  OutputMode = +OutputMode;
  BaseFreq = +BaseFreq;
  isStrict = +isStrict;
  GongString = +GongString;
  ZhiString = +ZhiString;
  const TheString = ZhiString || GongString;
  const isZhi = ZhiString ? true : false;
  const funcName = `Tuning${TuningMode}`;
  const tuningFunc = TuningFunctions[funcName];
  const { Zhun, Hui, Hui2, Hui3, Hui4, OneDifZhun, OneDifHui } = tuningFunc(
    432,
    TheString || 0
  );
  let StringList = [],
    OneDif = "";
  if (TempMode === 1) {
    StringList = Hui;
    OneDif = OneDifHui;
  } else if (TempMode === 2) {
    StringList = Hui2;
    OneDif = OneDifHui;
  } else if (TempMode === 3) {
    StringList = Hui3;
    OneDif = OneDifHui;
  } else if (TempMode === 4) {
    StringList = Hui4;
    OneDif = OneDifHui;
  } else if (TempMode === 5) {
    StringList = Zhun;
    OneDif = OneDifZhun;
  }
  Input = Input.replace(/\[(.+?)\]/g, function () {
    // @lzfcc [泛音]
    return arguments[1]
      .split(";")
      .map((x) => "f," + x)
      .join(";");
  });
  Input = Input.split(";").filter(Boolean);
  // for (let i = 0; i < Input.length; i++) {
  //     if (Input[i] === 'dayuan') {
  //         Input.splice(i, i, Input[i - 2], Input[i - 1], Input[i - 2], Input[i - 1])
  //     } else if (Input[i] === 'suo3') {
  //         Input.splice(i, i, Input[i - 1], Input[i - 1])
  //     } else if (Input[i] === 'suo7') {
  //         Input.splice(i, i, Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1])
  //     } else if (Input[i] === 'suo9') {
  //         Input.splice(i, i, Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1], Input[i - 1])
  //     } else if (Input[i] === 'fenkai') {
  //         Input.splice(i, i, 'shang', 'xia')
  //     }
  // }
  const Type = [],
    String = [],
    Fret = [],
    Scale = [],
    Cent = [],
    Pitch = [],
    PitchPrint = [];
  for (let i = 0; i < Input.length; i++) {
    let Pre = Input[i].split(",").filter(Boolean);
    // 下面是補全承前省略
    if (Pre.length === 1) {
      if (isNaN(Pre[0]) === false) {
        // 「就」，與上一音徽位同，或同爲散音
        if (Type[i - 1] === "f") {
          // f,7,6;3
          Pre = [Type[i - 1], Fret[i - 1], Pre[0]];
        } else if (Type[i - 1] === "l") {
          // l,13;2
          Pre = [Fret[i - 1], Pre[0]];
        } else {
          // 散、按音
          Pre = [Type[i - 1], Pre[0]];
        }
      }
    } else if (Pre.length === 2 && Pre[0] === "f") {
      // f,7,3;f,3
      Pre = [Type[i - 1], Fret[i - 1], Pre[1]];
    }
    // 下面是正式處理
    Type[i] = Pre[0];
    let floor = 0;
    if (Type[i] === "s") {
      String[i] = +Pre[1];
      Scale[i] = StringList[String[i]];
    } else if (Type[i] === "zh") {
      String[i] = String[i - 1];
      Scale[i] = Scale[i - 1].mul(TempMode === 1 ? "9/8" : "10/9");
    } else if (Type[i] === "shang") {
      String[i] = String[i - 1];
      Scale[i] = Scale[i - 1].mul(TempMode === 1 ? "9/8" : "10/9");
    } else if (Type[i] === "xia") {
      String[i] = String[i - 1];
      Scale[i] = Scale[i - 1].div(TempMode === 1 ? "9/8" : "10/9");
    } else if (Type[i] === "qi" && Pre.length === 1) {
      String[i] = String[i - 1];
      Scale[i] = StringList[String[i]];
    } else {
      if (Type[i] === "f") {
        Fret[i] = 7 - Math.abs(7 - +Pre[1]); // 泛音以7徽對稱
        String[i] = +Pre[2];
      } else if (Type[i] === "l" || (Type[i] === "qi" && Pre.length === 2)) {
        Fret[i] = Pre[1];
        String[i] = +String[i - 1];
      } else if (Type[i] === "yin" || Type[i] === "nao") {
        Fret[i] = Fret[i - 1];
        String[i] = String[i - 1];
      } else {
        Fret[i] = Type[i];
        String[i] = +Pre[1];
      }
      const Leng = Fret2Leng(Fret[i]);
      Scale[i] = frc(1).div(Leng).mul(StringList[String[i]]);
    }
    Cent[i] = Math.log2(Number(frc(Scale[i]))) * 1200 - (isZhi ? 498.045 : 0); // 若用徵弦作為基準，減純五度
    floor = Math.floor(Cent[i] / 1200); // 超出一個八度
    Cent[i] = ((Cent[i] % 1200) + 1200) % 1200;
    // 下面是處理模糊徽位
    for (const [key, value] of Object.entries(FushionList)) {
      const threshold = isStrict ? 0.95 : 10;
      if (
        Cent[i] > +key - threshold &&
        Cent[i] < +key + threshold &&
        value[0] !== 3
      ) {
        Pitch[i] = value[OutputMode === 2 ? OutputMode : 3];
        break;
      }
    }
    if (!isStrict && !Pitch[i]) {
      // 這個用來對付徽位更不準的
      for (const [key, value] of Object.entries(FushionList)) {
        // 21.5普通音差
        if (Cent[i] > +key - 21.5 && Cent[i] < +key + 21.5 && value[0] !== 3) {
          Pitch[i] = value[OutputMode === 2 ? OutputMode : 3];
          break;
        }
      }
    }
    if (OutputMode === 1) {
      Pitch[i] = Portion2Pitch(Pitch[i], StringList[1], OneDif || 1);
    } else if (OutputMode === 3) {
      if (Pitch[i] === undefined) {
        Pitch[i] = frc(2 ** (Cent[i] / 1200)).toFraction(false);
      }
      Pitch[i] = frc(Pitch[i])
        .mul(2 ** floor)
        .toFraction(false);
    }
    PitchPrint[i] = Pitch[i];
    if (OutputMode <= 2) {
      if (floor === 3) {
        PitchPrint[i] = "··" + PitchPrint[i];
      } else if (floor === 2) {
        PitchPrint[i] = "·" + PitchPrint[i];
      } else if (floor === 0) {
        PitchPrint[i] += "·";
      } else if (floor === -1) {
        PitchPrint[i] += "··";
      }
    }
    if (Type[i] === "zh") {
      if (i > 0) {
        PitchPrint[i] = "^" + PitchPrint[i] + Pitch[i - 1];
      }
    } else if (Type[i] === "f") {
      PitchPrint[i] = "৹" + PitchPrint[i];
    } else if (Type[i] === "l") {
      PitchPrint[i] = "◠" + PitchPrint[i];
    }
  }
  return PitchPrint.join("　");
};
// console.log(Position2Pitch('8.4,7;s,5;s,1', '1', '1', '4', '0', '347.654321', '3'))
// console.log(Position2Pitch('s,1;9.9,2;s,1;9.9,2;l,14;s,2;1;2;2;1;2;14,2;3;3;2;3;s,5;4;10,2;s,4;8,2;s,5;11,1;9,1;2;1;2;8,2;l,7.6;s,2;1;10,4', '1', '2', '1', '347.654321', '2'))
// console.log(Position2Pitch('s,5', '1', '1', '3', '0', '347.654321', '2', '0'))
// console.log(test('2,1;[3;5,4;2];2;4;[9,5];3,4;6'))

const Portion2Interval = (portion, one = 1, oneDif = 1) => {
  const base = frc(one).div(oneDif);
  let a = frc(portion).div(base);
  a = IntoOctave(a);
  const got = FushionListB.find((obj) => obj.freq === a);
  return got;
};

const FretPitch1 = (TuningMode, n) => {
  // 徽位音。弦法、宮弦
  let { Zhun, Hui, OneDifHui, OneDifZhun } = eval("Tuning" + TuningMode)(
    432,
    +n
  );
  let ZhunPrint = [],
    HuiPrint = [],
    ZhunNameList = [],
    ZhunNameBList = [],
    HuiNameList = [],
    HuiNameBList = [];
  const set1 = new Set(); // 用于去重
  const set2 = new Set();
  for (let i = 1; i <= 7; i++) {
    // 七弦
    let ZhunPitch = [],
      HuiPitch = [],
      HuiNameTmp = [],
      ZhunNameTmp = [],
      HuiNameBTmp = [],
      ZhunNameBTmp = [];
    if (Zhun) {
      for (let k = 16; k >= 0; k--) {
        // 15徽 16=散
        // Zhun 準法律七弦散音頻率比
        ZhunPitch[k] = frc(Zhun[i]).div(Fret2Leng(k)).toFraction(false);
        const tmp = Portion2Interval(ZhunPitch[k]);
        const tmp1 = Portion2Interval(ZhunPitch[k], Zhun[1], OneDifZhun || 1);
        if (tmp && !set1.has(tmp.freq)) {
          ZhunNameTmp[k] = tmp;
          set1.add(tmp.freq);
        }
        if (tmp && !set2.has(tmp.freq)) {
          ZhunNameBTmp[k] = tmp1;
          set2.add(tmp.freq);
        }
        ZhunPitch[k] += `</br>`;
        ZhunPitch[k] += ZhunNameTmp[k]
          ? ZhunNameTmp[k].nameString(2) + " "
          : "";
        ZhunPitch[k] += ZhunNameBTmp[k] ? ZhunNameBTmp[k].nameString(1) : "";
      }
      ZhunNameList = ZhunNameList.concat(ZhunNameTmp.filter(Boolean));
      ZhunNameBList = ZhunNameBList.concat(ZhunNameBTmp.filter(Boolean));
      ZhunPrint = ZhunPrint.concat({
        title: NumList[i],
        data: ZhunPitch
      });
    }
  }
  // 排序
  ZhunNameList.sort((obj1, obj2) => obj1.cent - obj2.cent);
  ZhunNameBList.sort((obj1, obj2) => obj1.cent - obj2.cent);
  const data = {
    ZhunPrint,
    ZhunNameBList: ZhunNameList.map((obj) => obj.nameString(2)),
    ZhunNameList: ZhunNameList.map((obj) => obj.nameString(1))
  };
  return data;
};
// console.log(FretPitch1(1, 0))
