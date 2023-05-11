export const HexoList64 = [
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
export const HexoList8 = [
  "坤☷",
  "艮☶",
  "坎☵",
  "巽☴",
  "震☳",
  "離☲",
  "兌☱",
  "乾☰",
];

// !: 不知道後面還有沒有文字. ?: 殘損. 书中编号是xx-xxx
// 1数字：1一，2七，3未出现一七
// 2形式：1六爻单卦，2六爻对卦，3三爻，4四爻，5未知
// 3地域：1殷墟，2周原宗周，3楚，4其他
// 4时间：1晚商早周，2西周中晚期，3春秋，4战国，5其他
// 5材质：1骨，2铜，3陶石
// V: 11210
// VI: 21210
// VII: 21111
// VIII: 21113

export const HexoZhouList = {
  // 类型；卦；是否可能是阴阳卦
  1001: ["13453", "161"],
  2002: ["35111", "666!"], // 贾排除
  3003: ["24111", "6776"],
  4004: ["21111", "757666"],
  4005: ["21111", "866587"],
  4006: ["21111", "787676"],
  5007: ["23111", "765"],
  6008: ["21211", "776766"], //76
  6009: ["21211", "678968"],
  6010: ["21211", "677679"],
  7011: ["11111", "116615"],
  7012: ["23111", "977"],
  7013: ["31111", "688866"], // 贾排除
  8014: ["21111", "666687"],
  8015: ["21111", "777867"],
  8016: ["21111", "686767"],
  9017: ["23112", "758"],
  10018: ["13112", "851"],
  11019: ["13112", "816"],
  12020: ["33112", "666"], // 贾排除
  13021: ["25113", "587!"], //
  14022: ["21113", "867666"],
  15023: ["21113", "??6667"], //
  15024: ["21113", "??7676"], //
  16025: ["11113", "611655"],
  16026: ["11113", "116616"],
  17027: ["11113", "151166"],
  18028: ["21113", "576877"],
  18029: ["21113", "776786"],
  19030: ["21113", "!67786"], //
  19031: ["21113", "67677!"],
  20032: ["21113", "667668"],
  20033: ["21113", "667675"],
  21034: ["11413", "188611"],
  22035: ["11213", "518166"],
  23036: ["21213", "766667"],
  23037: ["21213", "768767"],
  23038: ["21213", "665768"],
  23039: ["11213", "811166"],
  23040: ["11213", "811116"],
  23041: ["21213", "667668"],
  24042: ["11211", "681151"],
  24043: ["11211", "511681"],
  24044: ["11211", "668116"],
  24045: ["11211", "616661"],
  26046: ["11211", "116111"],
  27047: ["21211", "587878"],
  28048: ["21211", "766766"],
  29049: ["21211", "766778"],
  30050: ["25211", "!667"], //
  31051: ["21211", "66775!"], //
  32052: ["21211", "766676"],
  33053: ["21212", "677676"],
  34054: ["21212", "677676"],
  35055: ["21212", "768675"],
  36056: ["11212", "661661"],
  37057: ["33212", "586"], // 贾排除
  // 38058: ['33212', '586'], // 重複一樣的算一個 // 贾排除
  39059: ["13212", "851"],
  40060: ["21212", "867677"],
  41061: ["21412", "5?76?!"], //
  42062: ["11212", "618611"],
  43063: ["21212", "756667"],
  44064: ["11212", "661161"],
  45065: ["21212", "767676", true],
  46066: ["13212", "161"],
  // 47067: ['13212', '161'],
  // 48068: ['13212', '161'],
  49069: ["21212", "786666", true],
  49070: ["21212", "876666"],
  50071: ["13211", "511"],
  51072: ["13211", "161"],
  52073: ["11221", "161668"],
  52074: ["11221", "698186"],
  52075: ["11221", "911165"],
  52076: ["11221", "681118"],
  52077: ["11221", "886666"], // 贾：根据同器卦例归入一系
  52078: ["11221", "186855"],
  52079: ["11221", "681111"],
  53080: ["21221", "875687"],
  53081: ["21221", "867688"],
  53082: ["21221", "876867"],
  54083: ["21421", "666677"],
  54084: ["21421", "768658"],
  55085: ["11421", "181881", true],
  55086: ["11421", "188188", true],
  56087: ["34222", "8868"], // 唯一銅器四爻卦 // 贾排除
  57088: ["11223", "111111"],
  57089: ["11223", "611511"],
  57090: ["11223", "161111"],
  57091: ["11223", "111688"],
  57092: ["11223", "116111"],
  57093: ["11223", "116195"],
  57094: ["11223", "181611"],
  57095: ["11223", "811816"],
  57096: ["11223", "685618"],
  57097: ["11223", "198111"],
  57098: ["11223", "116881"],
  58099: ["11223", "118918"],
  58100: ["11223", "818186"],
  58101: ["11223", "618189"],
  58102: ["11223", "181811", true],
  58103: ["11223", "111881", true],
  59104: ["11223", "616161", true],
  59105: ["11223", "161616", true],
  60106: ["11223", "886818", true],
  60107: ["11223", "816666", true],
  60108: ["11223", "116111", true],
  60109: ["11223", "111611", true],
  61110: ["11222", "561158"],
};
// 楚簡
export const HexoChuList = {
  62111: "111116 666666", // 16
  63112: "666?66 66????", //
  64113: "118156 181161",
  65114: "616666 119961",
  66115: "666661 116666", // 16
  67116: "666166 111166", // 16
  68117: "565666 666616",
  69118: "816666 111161",
  70119: "???166 ?61161", //
  71120: "666611 666616", // 16
  72121: "686166 166661",
  73122: "161166 611118",
  73123: "116666 666111", // 16
  74124: "166666 611166", // 16
  75125: "666111 611656",
  76126: "111116 661616", // 16
  77127: "111666 188666",
  78128: "166666 666666", // 16
  79129: "161661 611111", // 16
  80130: "166666 161666", // 16
  81131: "661166 666881",
  82132: "111696 811168",
  83133: "661666 611611", // 16
  84134: "166811 666811",
  85135: "166116 165866",
  86136: "611661 161161", // 16
  87137: "166861 111661",
  88138: "661118 816111",
};

// 排除一六的楚简IV
export const HexoChuList2 = {
  64113: "118156 181161",
  65114: "119961",
  68117: "565666",
  69118: "816666",
  72121: "686166",
  73122: "611118",
  75125: "611656",
  77127: "188666",
  81131: "666881",
  82132: "111696 811168",
  84134: "166811 666811",
  85135: "165866",
  87137: "166861",
  88138: "661118 816111",
};

export const HexoQinghuaList = [
  "111111 116161",
  "166111 161661",
  "661616 616611",
  "611611 161661",
  "661616 616659",
  "611611 161956",
  "661666 116161",
  "166666 111166",
  "616661 161611",
  "111666 666116",
  "161166 116666",
  "666611 611161",
  "616661 661916",
  "666161 611111",
  "661616 459116",
  "611111 666611",
  "111666 116811",
  "661116 611165",
  "616161 611916",
  "166611 161114",
  "666666 666116",
  "111111 111166",
  "611111 666666",
  "166666 111611",
  "661161 616611",
  "166116 111666",
  "666166 161611",
  "166111 616116",
  "166111 611661",
  "166111 981166",
  "666116 116616",
  "661111 166161",
  "166111 161666",
  "116111 161666",
  "611166 116111",
  "611166 666616",
  "611166 116616",
  "666166 116161",
  "611111 666166",
  "911911 911966",
  "911911 911866",
  "911911 861866",
  "911911 966866",
  "666666 666116",
  "666666 666161",
  "666666 666611",
  "666666 666966",
  "616161 161611",
  "616161 161116",
  "661661 661654",
  "666111 116661",
  "456189 456189",
  "981654 981654",
  "615566 115561",
  "616161 661611",
  "666166 161661",
  "111611 616116",
];

export const stdZhuxiFake = [0, 0, 6.25, 31.25, 43.75, 18.75]; // 朱熹朴素理论值
export const stdZhuxi = [0, 0, 4.0975609, 25.8888156, 45.7046802, 24.308943];
export const stdAFake = [0.21, 5.01, 34.74, 41.24, 16.68, 2.12]; // 四—九的贾连翔朴素理论值
export const stdBFake = [4.6875, 20.3125, 34.375, 28.125, 10.9375, 1.5625]; // 程浩朴素理论值
export const stdCFake = [3.125, 15.625, 31.25, 31.25, 15.625, 3.125]; // 杨胜男朴素理论值
export const stdDFake = [1.5625, 10.9375, 28.125, 34.375, 20.3125, 4.6875]; // 刘彬58朴素理论值
const ZhuxiBianList = [
  5.960464478, 3.576278687, 2.145767212, 1.287460327, 0.7724761963,
  0.4634857178, 0.2780914307,
]; // 朱熹筮法各类變卦概率%
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

export const ListNI = [
  7011, 10018, 11019, 16025, 16026, 17027, 21034, 22035, 23039, 23040, 24042,
  24043, 24044, 24045, 26046, 36056, 39059, 42062, 44064, 46066, 50071, 51072,
  52073, 52074, 52075, 52076, 52077, 52078, 52079, 55085, 55086, 57088, 57089,
  57090, 57091, 57092, 57093, 57094, 57095, 57096, 57097, 57098, 58099, 58100,
  58101, 58102, 58103, 59104, 59105, 60106, 60107, 60108, 60109, 61110,
];
export const ListNII = [
  3003, 4004, 4005, 4006, 5007, 6008, 6009, 6010, 7012, 8014, 8015, 8016, 9017,
  13021, 14022, 15023, 15024, 18028, 18029, 19030, 19031, 20032, 20033, 23036,
  23037, 23038, 23041, 27047, 28048, 29049, 30050, 31051, 32052, 33053, 34054,
  35055, 40060, 41061, 43063, 45065, 49069, 49070, 53080, 53081, 53082, 54083,
  54084,
];
export const ListNIII = [
  64113, 65114, 68117, 69118, 72121, 73122, 75125, 77127, 81131, 82132, 84134,
  85135, 87137, 88138,
]; // 楚简可用的
// 11113只有4例，太少
export const ListNV = [
  22035, 23039, 23040, 24042, 24043, 24044, 24045, 26046, 36056, 42062, 44064,
]; // 11210
export const ListNVI = [
  6008, 6009, 6010, 23036, 23037, 23038, 23041, 27047, 28048, 29049, 31051,
  32052, 33053, 34054, 35055, 40060, 43063, 49070,
]; //21210
export const ListNVIIA = [
  14022, 15023, 15024, 18028, 18029, 19030, 19031, 20032, 20033,
]; //21113
export const ListNVIIB = [4004, 4005, 4006, 8014, 8015, 8016]; //21111
export const ListNVII = [
  14022, 15023, 15024, 18028, 18029, 19030, 19031, 20032, 20033, 4004, 4005,
  4006, 8014, 8015, 8016,
]; // 21110
export const ListNVIandVII = [
  6008, 6009, 6010, 23036, 23037, 23038, 23041, 27047, 28048, 29049, 31051,
  32052, 33053, 34054, 35055, 40060, 43063, 49070, 14022, 15023, 15024, 18028,
  18029, 19030, 19031, 20032, 20033, 4004, 4005, 4006, 8014, 8015, 8016,
];
export const ListNVIII = [7011, 16025, 16026, 17027]; // 11110
export const ListNVandVIII = [
  22035, 23039, 23040, 24042, 24043, 24044, 24045, 26046, 36056, 42062, 44064,
  7011, 16025, 16026, 17027,
];
export const ListNIXA = [
  57088, 57089, 57090, 57091, 57092, 57093, 57094, 57095, 57096, 57097, 57098,
  58099, 58100, 58101,
]; // 11023
export const ListNIXB = [52073, 52074, 52075, 52076, 52077, 52078, 52079]; // 11021
export const ListNX = [53080, 53081, 53082, 54083, 54084]; // 21020
export const ListNXI = [
  18028, 18029, 4004, 4006, 23036, 23037, 23038, 23039, 23040, 23041, 16025,
  16026, 24042, 24043, 25044, 25045, 52074, 52075, 52076, 52077, 52078, 52079,
  54083, 54084,
];
export const ListNThree = [
  1001, 5007, 7012, 9017, 10018, 11019, 12020, 37057, 39059, 46066, 50071,
  51072,
]; // 三爻卦
export const ListNThree1 = [10018, 11019, 39059, 46066, 50071, 51072]; // 一系
export const ListNThree7 = [5007, 7012, 9017, 12020]; // 七系
// console.log(ListNII.length)
export const ListPI = [0, 5.8824, 24.8366, 49.0196, 18.3007, 1.9608, 306]; // 几个分系的实际概率+爻数
export const ListPII = [0, 5.8824, 43.5294, 35.6863, 13.7255, 1.1765, 255];
export const ListPIII = [0, 2.9762, 44.6429, 40.4762, 10.119, 1.7857, 168];
export const ListPIV = [0, 4.6296, 38.8889, 37.963, 15.7407, 2.7778, 108];
export const ListPV = [0, 4.5455, 36.3636, 48.4848, 10.6061, 0, 66];
export const ListPVIandVII = [0, 4.712, 45.5497, 36.6492, 12.0419, 1.0471, 191];
export const ListPVandVIII = [0, 7.7778, 36.6667, 47.7778, 7.7778, 7, 90];
export const ListPIXB = [0, 7.1429, 30.9524, 33.3333, 23.8095, 4.7619, 42];
export const ListPXI = [0, 8.3333, 35.6061, 38.6364, 15.9091, 1.5152, 132];
export const ListPAll = [
  [0, 5.8824, 24.8366, 49.0196, 18.3007, 1.9608, 306],
  [0, 5.8824, 43.5294, 35.6863, 13.7255, 1.1765, 255],
  [0, 2.9762, 44.6429, 40.4762, 10.119, 1.7857, 168],
  [0, 4.6296, 38.8889, 37.963, 15.7407, 2.7778, 108],
  [0, 4.712, 45.5497, 36.6492, 12.0419, 1.0471, 191],
  [0, 7.7778, 36.6667, 47.7778, 7.7778, 7, 90],
  [0, 8.3333, 35.6061, 38.6364, 15.9091, 1.5152, 132],
];

// 各算法在8-20%下的理论值，剔除了重复的百分比，不用在意到底是什么范围
export const stdA = [
  [0.71, 0.72, 0.71, 0.69, 0.69, 0.74, 0.72, 0.7, 0.72, 0.69, 0.76],
  [10.15, 10.26, 10.23, 10.04, 10.04, 10.28, 10.04, 9.82, 9.94, 10.14, 10.46],
  [42.94, 43.29, 43.12, 42.79, 42.73, 42.47, 42.13, 41.7, 41.48, 40.41, 40.24],
  [35.26, 34.98, 34.9, 35.28, 35.02, 34.94, 35.5, 35.89, 36.11, 35.99, 35.85],
  [10.0, 9.83, 10.07, 10.15, 10.49, 10.56, 10.58, 10.78, 10.66, 11.5, 11.41],
  [0.94, 0.91, 0.97, 1.04, 1.01, 1.01, 1.03, 1.1, 1.09, 1.27, 1.29],
];
export const stdB = [
  [5.45, 5.37, 5.18, 5.18, 4.94, 4.94, 5.12, 4.72, 4.64, 4.98, 4.74, 4.85],
  [
    21.73, 21.44, 21.19, 20.8, 20.76, 19.99, 20.3, 20.72, 20.46, 19.14, 18.84,
    19.98,
  ],
  [
    34.5, 34.24, 34.33, 34.0, 33.93, 34.14, 34.07, 33.23, 33.08, 34.67, 34.69,
    34.98,
  ],
  [
    26.85, 27.01, 27.26, 27.53, 27.7, 27.78, 27.5, 28.82, 28.97, 28.65, 29.04,
    28.64,
  ],
  [
    10.06, 10.4, 10.49, 10.84, 11.01, 11.57, 11.44, 11.03, 11.3, 11.03, 11.15,
    10.1,
  ],
  [1.41, 1.53, 1.55, 1.64, 1.66, 1.58, 1.58, 1.48, 1.55, 1.53, 1.54, 1.45],
];
export const stdC = [
  [3.71, 3.56, 3.55, 3.38, 3.38, 3.32, 3.31, 3.5, 3.22, 3.07, 3.29, 3.08, 3.26],
  [
    17.05, 16.65, 16.49, 16.18, 15.79, 16.05, 15.49, 15.85, 16.27, 15.79, 14.57,
    14.23, 15.47,
  ],
  [
    31.92, 31.7, 31.4, 31.26, 30.93, 30.79, 31.14, 31.29, 30.35, 30.06, 31.37,
    31.1, 31.58,
  ],
  [
    30.19, 30.48, 30.5, 30.65, 30.84, 30.77, 30.51, 30.33, 31.74, 32.03, 31.85,
    32.09, 31.95,
  ],
  [
    14.37, 14.75, 15.05, 15.37, 15.71, 15.66, 16.3, 15.95, 15.53, 16.04, 15.93,
    16.34, 14.76,
  ],
  [
    2.75, 2.87, 3.01, 3.17, 3.35, 3.41, 3.25, 3.07, 2.89, 3.03, 2.98, 3.17,
    2.99,
  ],
];
export const stdD = [
  [1.89, 1.82, 1.81, 1.65, 1.65, 1.62, 1.62, 1.79, 1.57, 1.6, 1.5, 1.59],
  [
    12.19, 11.98, 11.74, 11.38, 11.0, 11.13, 10.77, 11.17, 11.37, 10.02, 9.86,
    10.7,
  ],
  [
    29.22, 29.12, 28.7, 28.32, 28.0, 27.5, 28.01, 28.38, 27.18, 28.08, 27.72,
    27.97,
  ],
  [
    33.66, 33.8, 33.84, 33.91, 34.0, 33.99, 33.39, 33.33, 34.95, 35.04, 34.98,
    35.44,
  ],
  [
    18.88, 19.06, 19.49, 20.03, 20.37, 20.53, 21.22, 20.68, 20.5, 20.83, 21.22,
    19.69,
  ],
  [4.16, 4.22, 4.42, 4.71, 4.98, 5.24, 4.99, 4.65, 4.43, 4.43, 4.71, 4.62],
];

// 分系
const Devide = (list, screen) => {
  let result = "";
  for (const [key, value] of Object.entries(list)) {
    if (value[2] !== true) {
      let k = 0;
      for (let i = 0; i < 5; i++) {
        if (screen[i] === value[0][i] || screen[i] === "0") {
          k++;
        }
        if (k === 5) result += key + ", ";
      }
    }
  }
  return result;
};
// console.log(Devide(HexoZhouList, "21020"));

// 各分系的概率
const Count = (list, screen) => {
  if (screen) screen = screen.flat();
  const nums = Array(10).fill(0);
  for (const [key, value] of Object.entries(list)) {
    if (value instanceof Array) {
      for (let i = 0; i < value[1].length; i++) {
        if (screen) {
          if (screen.indexOf(+key) !== -1) nums[+value[1][i]]++;
        } else {
          nums[+value[1][i]]++;
        }
      }
    } else {
      for (let i = 0; i < value.length; i++) {
        const valueDeal = value.split(" ").join(""); // 去掉空格
        if (screen) {
          if (screen.indexOf(+key) !== -1) nums[+valueDeal[i]]++;
        } else {
          nums[+valueDeal[i]]++;
        }
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
// console.log(Count(HexoZhouList, [ListNX]));
// console.log(Count(HexoZhouList));
// console.log(Count(HexoChuList, [ListNIII]));
// console.log(Count(HexoChuList));

function AllDevide(input) {
  // 每個維度的數量
  let r = [];
  for (let i = 1; i <= input[0]; i++) {
    for (let j = 1; j <= input[1]; j++) {
      for (let k = 1; k <= input[2]; k++) {
        for (let l = 1; l <= input[3]; l++) {
          for (let m = 1; m <= input[4]; m++) {
            r.push(
              i.toString() +
                j.toString() +
                k.toString() +
                l.toString() +
                m.toString()
            );
          }
        }
      }
    }
  }
  return r;
}
// console.log(AllDevide('35453'))
