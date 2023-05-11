// const Random = (n, m) => Math.round(Math.random() * (m - n)) + n; // [n, m] 整数
const Random = (n, m) => Math.floor(Math.random() * (m - n + 1)) + n;

const xxx = (n) => {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(Random(1, 100));
  }
  return result.toString();
};
// console.log(xxx(100));
export const HexoSub2 = (all, bian, she, gua, isRandomGua, pn, pp) => {
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

export const HexoSub3 = (all, bian, she, pn, pp) => {
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