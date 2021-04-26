export function convertLatex(nums) {
  let str = "";
  nums.reverse().forEach((x) => {
    if (!str) {
      str = `${x}`;
    } else {
      str = `${x} + {1 \\over {${str}}}`;
    }
  });
  return `\\[${str}\\]`;
}
