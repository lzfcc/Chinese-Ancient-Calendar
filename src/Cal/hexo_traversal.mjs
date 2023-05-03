// 二分法的其中一变
const HexoSub2B = (all, she, gua, small) => {
  let l = small;
  let r = all - small - gua;
  if (r < 0) {
    l = small - gua;
    r = all - small;
  }
  all -= (l % she || she) + (r % she || she) + gua;
  return all;
};

const TestTraversalSub2 = (all, bian, she, gua, nums) => {
  if (bian === 0) {
    nums[all / she]++;
    return;
  }
  // const tmp = (all - gua) / 2;
  // for (let small = Math.floor(tmp - (she - 1)); small <= tmp; small++) {
  for (let small = 0; small <= all; small++) {
    const allNext = HexoSub2B(all, she, gua, small);
    TestTraversalSub2(allNext, bian - 1, she, gua, nums);
  }
};
const HexoSub3B = (all, she, l) => {
  const r = all - l;
  const result = [];
  for (let r1 = Math.floor(r / 2 - (she - 1)); r1 <= r / 2; r1++) {
    const r2 = r - r1;
    const modL = l % she || she;
    const modR1 = r1 % she || she;
    const modR2 = r2 % she || she;
    result.push(all - (modL + modR1 + modR2));
  }
  return result;
};

const TestTraversalSub3 = (all, bian, she, nums) => {
  if (bian === 0) {
    nums[all / she]++;
    return;
  }
  const tmp = all / 2;
  for (let l = Math.floor(tmp - (she - 1)); l <= tmp; l++) {
    // 朴素理论值
    const allNext = HexoSub3B(all, she, l);
    for (let i = 0; i < allNext.length; i++) {
      TestTraversalSub3(allNext[i], bian - 1, she, nums);
    }
  }
};
// 遍历每种可能性，得出理论概率。但是并不如预期
const TestTraversal = (isTriple, all, bian, she, gua) => {
  const nums = Array(12).fill(0);
  if (isTriple) {
    TestTraversalSub3(all, bian, she, nums);
  } else {
    TestTraversalSub2(all, bian, she, gua, nums);
  }
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  const p = [];
  for (let i = 0; i < nums.length; i++) {
    p[i] = i + ": " + (nums[i] * 100) / sum + " | ";
  }
  return p.join("") + sum;
};
console.log(TestTraversal(false, 49, 3, 4, 1)); // 朱熹大衍筮法
// 挂一边与卦两边分别加起来概率无差, 即使是随机挂某边，概率依然一样。
// 6: 3.271568511743184 | 7: 23.946654077658444 | 8: 46.31535465596601 | 9: 26.46642275463236 | 84730 or 169460
// console.log(TestTraversal(true, 49, 3, 4)); // 算法A
//  4: 0.244140625 | 5: 6.005859375 | 6: 40.13671875 | 7: 39.55078125 | 8: 12.744140625 | 9: 1.318359375 | 10: 0 | 11: 0 | 4096
//   5:123:822:810:261:27
// console.log(TestTraversal(false, 55, 5, 4, 1)); // 算法B程浩
// console.log(TestTraversal(false, 56, 5, 4, 1)); // 算法C
// console.log(TestTraversal(false, 57, 5, 4, 1)); // 算法D

// function Fun() {
//     const res = all % she
//     If (res != 0) {
//        throw new Error('Not Devided Error')
//     }
// }

// Try {
//     Fun()
// } catch(error ) {
//     console.error(error)
// }
