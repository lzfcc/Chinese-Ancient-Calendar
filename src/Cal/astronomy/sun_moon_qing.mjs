import Para from "../parameter/calendars.mjs";
import {
  White2Eclp,
  qiexian,
  qiexianA,
  Gong2Lon,
  Lon2Gong,
  aCb_Sph
} from "../astronomy/pos_convert.mjs";
import {
  D2R,
  R2D,
  pi,
  deci,
  abs,
  sqr,
  sind,
  sin2d,
  cosd,
  tand,
  asind,
  acosd,
  atand,
  fm360,
  t1,
  t2,
  t3,
  f1,
  f2,
  f4,
  vsind
} from "../parameter/functions.mjs";
import { timeAvg2Real } from "../time/eot_qing.mjs";

// 褚龙飞《崇祯历书系列历法中的太阳运动理论》：「可以断定日躔加减差表应该是根据对分圆模型计算而来的。」「从图上来看，平行心应为丙，即太阳应相对于丙作匀角速运动。这样，辛就应该是本轮圆心，辛乙才是本轮半径。」從上到下依此為平行心、本輪心、地心
// const corrRingB = OrbRaw => {
//     OrbRaw = (OrbRaw + 360) % 360
//     const X1 = (OrbRaw + 180) % 360 // 暫時最高起算
//     const Xt = t3(X1)
//     const R0 = .0358416 // 兩心差
//     const H1 = sind(Xt) * R0 / 2
//     const A1 = asind(H1 / 1)
//     const B1 = cosd(Xt) * R0 / 2
//     const B2 = cotd(A1) * H1 + (t2(X1) < 90 ? 2 : -2) * B1
//     const A2 = atand(H1 / B2)
//     return {
//         SunCorr: f2(OrbRaw) * (A1 + A2),
//         SDist: sqr(B2 ** 2 + H1 ** 2)
//     }
// }
export const corrRingA = (Orb, c) => {
  // 對分圓模型。可參看廖育棟文檔改編。從上到下D、本輪心O、地心C，CO=OD=E，太陽在S，作OH⊥CS，DJ⊥CS。《後編》《用橢圓面積爲平行》「新法算書第谷所定之最大差爲2度3分11秒=2.05305」《求兩心差》「新法算書日躔中距之盈縮差爲2度3分9秒40微=2.052685」
  if (c > 0.025) Orb = (Orb + 180) % 360; // 月亮
  const OH = sind(Orb) * c;
  const CH = cosd(Orb) * c;
  const DJ = 2 * OH;
  const HS = sqr(1 - OH ** 2);
  const HJ = CH;
  const JS = HS - HJ;
  return {
    Corr: +atand(DJ / JS).toFixed(12), // 初均
    d: HS - CH // 日地距離
  };
};
// 測本輪大小遠近及加減差後法第七，近世歌白尼法，今時通用。崇禎曆書對幾個均數的定義也很迷惑，第十二說本輪次輪產生一二均，也就是考成的初均。對比表格，崇禎曆書自行加減表=考成初均表
export const corrRingC = (Orb, c) => {
  // 第谷本輪均輪模型。省略了符號判斷
  let p = 3;
  let q = 1 / 2;
  if (c > 0.025) {
    p = 2;
    q = 2 / 3; // 太陽r1 = .0268812, r2 = .0089604, c=.0179208 // 太陰初均r1 = .058, r2 = .029, c=.0435
    Orb = (Orb + 180) % 360;
  }
  const r2 = c * q;
  const r1 = r2 * p;
  const a = (p + 1) * r2 * sind(Orb);
  const b = 1 - (r1 - r2) * cosd(Orb);
  const Corr = +atand(a / b).toFixed(12);
  const d = b / cosd(Corr);
  return { Corr, d };
};
// console.log(corrRingC(198 + 40 / 60 + 57.4 / 3600, .)) // -0°38′48.49″=0.6468027778 // https://zhuanlan.zhihu.com/p/511793561

// 後編《月離算法》求日地距離
export const distEllipseA = (Orb, c) => {
  // 作垂線成兩勾股法，見以角求積。已知橢圓某點角度、橢圓倍兩心差，求距地心長度。日在辛，地在甲，另一焦點丙，延長辛甲到壬，丙壬⊥辛壬。甲辛=x，(2-x)^2=h^2+(a+x)^2。
  const c2 = c * 2;
  if (c2 > 0.04) Orb = t1(Orb); // 月亮
  const g = cosd(Orb) * c2; // 分股，甲壬
  const h = sind(Orb) * c2; // 勾，丙壬
  const Sum = 2 + g; // 勾弦和
  const Dif = h ** 2 / Sum; // 勾弦較
  const l = (Sum + Dif) / 2; // 弦
  return 2 - l;
  // return (4 - h ** 2 - a ** 2) / (2 * a + 4) // 我自己的算法
};
const distEllipseB = (Orb, c) => {
  // 以角求積又法，延長線
  const a = 1;
  const a2 = 2;
  const c2 = c * 2;
  const A1 = qiexianA(c2, 2, t1(Orb)); // 壬角
  const g2 = sqr(c2 ** 2 + a2 ** 2 - 2 * c2 * a2 * cosd(t1(Orb))); // 丙壬邊
  const l = g2 / 2 / cosd(A1);
  return a2 - l;
};
// 《日食算法》求日地距離
const distEllipseC = (Sorb, c) => {
  // 小股y=(4*d-4-c2**2)/(2*c2)，c2+y=cosd(Sorb)*d
  const c2 = c * 2;
  let d = 0;
  if (c2 < 0.04) {
    // 太陽從近地點起算
    if (Sorb > 90 && Sorb < 270)
      d = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cosd(t3(Sorb)));
    else d = (4 - c2 ** 2) / (4 + 2 * c2 * cosd(t3(Sorb)));
  } else {
    // 月亮從遠地點起算
    if (Sorb > 90 && Sorb < 270)
      d = (4 - c2 ** 2) / (4 + 2 * c2 * cosd(t3(Sorb)));
    else d = (4 - c2 ** 2) / (2 * c2) / (2 / c2 - cosd(t3(Sorb)));
  }
  return d;
};
const distEllipse = (Orb, c) => {
  // 現代公式。輸入：真近點角
  const a = 1;
  const E = acosd((c + cosd(Orb)) / (1 + c * cosd(Orb))); // 真近點角轉偏近點角
  return a * (1 - c * cosd(E));
};
// console.log(distEllipse(260, .0169))
// console.log(distEllipseB(260, .0169))
// console.log(distEllipseA(60, .0338))
// console.log(distEllipseB(120, .0338))
const corrEllipse0A = (TRaw, c) => {
  // 見日躔數理以角求積，實行-->平行。其他corrEllipse都是平行-->實行
  if (c > 0.025) TRaw = (TRaw + 180) % 360; // 太陰
  TRaw = fm360(TRaw);
  const T = t3(TRaw);
  const a = 1;
  const b = sqr(a ** 2 - c ** 2);
  const S0 = pi * a * b;
  const d = distEllipseA(c > 0.025 ? (TRaw + 180) % 360 : TRaw, c); // 恢復，因為distEllipseA也要加180
  const h = sind(T) * d; // 辛癸
  const h1 = (h * a) / b; // 大小徑比例得子癸
  const Ar1 = asind(h1 / a); // 子乙丁角
  const Sr1 = (pi * Ar1) / 360; // 子丁分平圓面積
  const Se1 = (Sr1 * b) / a; // 辛丁分橢圓面積
  const Sdif = (c * h) / 2; // 三角形辛甲乙面積
  const SAvg = Se1 + (TRaw > 90 && TRaw < 270 ? 1 : -1) * Sdif;
  const S =
    (TRaw % 180 < 90 ? SAvg : S0 / 2 - SAvg) + (TRaw > 180 ? S0 / 2 : 0);
  return (S / S0) * 360;
};
const corrEllipse0 = (T, c) => {
  // 輸入
  T = D2R * T;
  const E = 2 * Math.atan(sqr((1 - c) / (1 + c)) * Math.tan(T / 2)); // 真近點角轉偏近點角
  return R2D * (E - c * Math.sin(E)) + (T > pi ? 360 : 0);
};
// console.log(corrEllipse0A(31, .2))
// console.log(corrEllipse0(211, .2))
// console.log(sunAcr2AvgEllipse(60)) // 60: 58.33348625, 240:241.687772
const corrEllipseA = (Orb, c2) => {
  // 日躔數理以積求角法。實際使用時需要把之前的累加起來
  const a = 1;
  const c = c2 / 2;
  const b = sqr(a ** 2 - c ** 2);
  // const S1 = pi * a * b / 360
  const d = distEllipseA(Orb, c);
  return (a * b) / d ** 2; // a*b=中率自乘
};
// console.log(corrEllipseA(1, .0338)) // 0:1.034528786002214，1:1.0345235488620437，相加得2.06905233486
export const corrEllipseB1 = (OrbRaw, c) => {
  // 日躔數理借積求積法。Ae橢圓上一點的角，Ar平圓上一點的角。誤差1e-8度
  if (c > 0.025) OrbRaw = (OrbRaw + 180) % 360; // 太陰
  const OrbT = t3(OrbRaw);
  const Orb = OrbRaw % 180;
  const a = 1;
  const c2 = c * 2;
  const b = sqr(a ** 2 - c ** 2);
  const Se0 = pi * a * b;
  const Sr0 = pi; // 橢圓、平圓面積
  const Se1 = (OrbT / 360) * Se0; // 分橢圓面積
  const Sr1 = (a / b) * Se1;
  const Ar1 = (Sr1 / Sr0) * 360;
  const Ae1 = atand((b / a) * tand(Ar1)); // 由圓心平行面積得到了圓心實行度
  const h1 = sind(Ae1) * c2; // 自地心作垂線
  const g1 = cosd(Ae1) * c2;
  const Sum = 2 + (OrbRaw > 90 && OrbRaw < 270 ? 1 : -1) * g1; // 勾弦和
  const Dif = h1 ** 2 / Sum; // 勾弦較
  const l2 = (Sum + Dif) / 2; // 甲癸邊
  const Ae2 = asind(h1 / l2); // 癸角
  const Ae3 = (OrbRaw > 90 && OrbRaw < 270 ? 180 - Ae1 : Ae1) + Ae2; // 癸甲丁角
  // 下為以角求積法的主體
  const he3 = sind(Ae3) * l2; // 癸辰垂線
  const hr3 = (he3 * a) / b; // 大小徑比例得
  const Aor3 = asind(hr3 / a); // 乙角
  const Sor1 = (pi * Aor3) / 360; // 分平圓面積
  const Soe1 = (Sor1 * b) / a; // 癸乙丁分橢圓面積
  const Seo2 = Soe1 - Se1;
  const Sdif = (c * he3) / 2 + (OrbRaw >= 90 && OrbRaw <= 270 ? 1 : -1) * Seo2; // 如果寫成OrbRaw > 90 && OrbRaw < 270，在90、270會出問題
  // 以積求角
  const Delta = ((Sdif * (a * b)) / l2 ** 2 / Se0) * 360;
  return +((f2(OrbRaw) * (Ae3 + Delta) - Orb + 180) % 180).toFixed(12);
};
// console.log(corrEllipseB1(45, .0338)) // 46.38170938457123
// const corrEllipseB2 = (OrbRaw, c) => { // 日躔數理借積求積又法
//     const a = 1, c2 = c * 2, b = sqr(a ** 2 - c ** 2)
//     const Ae1 = t3(OrbRaw) // 直接設丙角爲平行度=上法之Aor3乙角

//     const h1 = sind(Ae1) * c2 // 自地心作垂線
//     const g1 = cosd(Ae1 * c2
//     const Sum = 2 + (OrbRaw > 90 && OrbRaw < 270 ? 1 : -1) * g1 // 勾弦和
//     const Dif = h1 ** 2 / Sum // 勾弦較
//     const l2 = (Sum + Dif) / 2 // 甲癸邊
//     const Ae2 = asind(h1 / l2) // 癸角
//     const Ae3 = (OrbRaw > 90 && OrbRaw < 270 ? 180 - Ae1 : Ae1) + Ae2 // 癸甲丁角
//     // ⋯⋯⋯⋯⋯⋯
//     return
// }
export const corrEllipseC = (OrbRaw, c) => {
  // 借角求角法。大徑1、小徑0.999857185、avg中率0.999928589、兩心差（焦距）倍之.0338000。中距盈縮差1°56′12″。石雲里：17世紀的Ismael Boulliau的簡化模型
  if (c > 0.025) OrbRaw = (OrbRaw + 180) % 360; // 太陰
  const a = 1;
  const c2 = c * 2;
  const b = sqr(a ** 2 - c ** 2);
  const OrbT = t3(OrbRaw);
  // 求對甲丙倍差之午角：作輔助線延長丙午到寅。丙寅=甲午+丙午=2a，求得∠寅，橢圓界角∠午=2*∠寅。注意，和求地日距離那個延長線不一樣！
  const Ae = 2 * qiexianA(c2, 2, OrbRaw);
  // 求橢圓差角未丙午，見上文葉37條
  const Adif = OrbT - atand((tand(OrbT) * b) / a);
  return +(
    f2(OrbRaw) *
    (Ae + (OrbRaw > 90 && OrbRaw < 270 ? -1 : 1) * Adif)
  ).toFixed(12);
};

export const corrEllipseD1 = (OrbRaw, c) => {
  // 見石雲里《历象考成后编中的中心差求法及其日月理论的总体精度》，卡西尼模型完整版，誤差比借積求積更小
  const a = 1;
  const b = sqr(a ** 2 - c ** 2);
  if (c < 0.025) OrbRaw = (OrbRaw + 180) % 360; // 太陽
  const Orb = t2(OrbRaw);
  const Aor1 = qiexianA(c, a, t1(OrbRaw)); // ∠CJS
  const Arc1 = D2R * Aor1; // JQ弧=∠JCQ≒∠CJS
  const l1 = sqr(a ** 2 + c ** 2 + 2 * a * c * cosd(t2(OrbRaw))); // SJ
  const Arc3 = (Arc1 - Math.sin(Arc1)) / l1; // ∠SJN ≈ sin∠SJN =SN/SJ=(NT-ST)/SJ，棋瀚案：其中NT-ST=JQ-JW，把整個值放大了一點，JQ-JW=∠JCQ-sin∠JCQ，而∠JCQ≒CJS之後把∠JCQ縮小了一點，所以一放一縮，大致NT-ST=∠CJS-sin∠CJS。又再進行一次近似∠SJN ≈ sin∠SJN
  const Ar3 = R2D * Arc3;
  // 為何不增加一步sin變角？
  // const Ar3 = R2D*Math.asin(Arc3) // 沒啥區別，多餘
  const Aor2 = Orb - Aor1 + Ar3; // ∠QCR
  const Ar4 = qiexianA(a, c, t1(Aor2)); // ∠QSC
  const Aacr = atand((tand(Ar4) * b) / a);
  return +(
    ((Aacr - Orb) * f2(OrbRaw) + (OrbRaw > 90 && OrbRaw < 270 ? 180 : 0)) %
    180
  ).toFixed(12); // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加
};
export const corrEllipseD2 = (OrbRaw, c) => {
  // 月離曆理葉28初均。可參看石雲里《历象考成后编中的中心差求法及其日月理论的总体精度》，是卡西尼模型的簡化版
  const a = 1;
  const b = sqr(a ** 2 - c ** 2);
  if (c < 0.025) OrbRaw = (OrbRaw + 180) % 360; // 太陽
  const Orb = t2(OrbRaw);
  const Ar1 = qiexianA(c, 1, t1(OrbRaw)); // 对两心差之小角甲庚乙。引数不及半周者，与半周相减。过半周者，则减半周。
  const Ar2 = qiexianA(1, c, Ar1 + t1(OrbRaw)); // 对半径之大角乙甲巳，为平圆引数
  const Ae2 = (atand((tand(Ar2) * b) / a) + 180) % 180;
  return +((Ae2 - Orb) * f2(OrbRaw)).toFixed(12); // 初均。比例得實引，實引-太陰引數=初均。引数初宫至五宫为减，六宫至十一宫为加
};
// 現代迭代方法。石雲里《历象考成后编中的中心差求法及其日月理论的总体精度》給出的現代算法：「对每一个给定的M值，先将E0=M作为偏近点角代入刻卜勒方程E=M+esinE的右边，依次求出 E1=M+esinE0，E2=M+esinE1，E3=M+esinE2⋯⋯直到| Ei — Ei+1 |小于10^-15，取Ei为偏近点角，进而求出相应的真近点角，再由真近点角减平近点角求出中心差。」（E偏近點角，M平近點角）
// 本函數參考李广宇《天体测量和天体力学基础》12.3、p114用牛頓迭代
// 又見《數》頁135；武家璧《大衍曆日躔表的數學結構及其內插法》日躔差=真近點角V-平近點交角M。V=M+2*e*sinM+1.25*e**2*sin2M   均數極值2e（弧度）。
export const corrEllipse = (OrbD, c) => {
  if (c > 0.025) OrbD = (OrbD + 180) % 360; // 太陰遠地點起算
  const Orb = D2R * OrbD; // 注意：一定要全部換成弧度！
  let D = Orb < pi ? c : -c;
  let E = Orb;
  const delta = (E) => (Orb - E + c * Math.sin(E)) / (1 - c * Math.cos(E));
  while (abs(D) > 1e-10) {
    // 偏心率.1以內只需要3次迭代就收斂
    E += D;
    D = delta(E);
  }
  // tanF=sqrt(1-e^2)sind(E)/(cosE-e)
  const F =
    R2D * Math.atan((sqr(1 - c ** 2) * Math.sin(E)) / (Math.cos(E) - c));
  return (F - OrbD + 180) % 90;
};
// console.log(corrEllipse(58.33348626930866, .1))
// console.log(corrEllipseB1(65, .2))
// console.log(corrEllipseC(65, .2))
// console.log(corrEllipseD1(65, .2))
// console.log(corrEllipseD2(65, .2))
const vEllipse = (c, Name, Orb) => {
  // 輸入真近點角，得瞬時速度// https://www.zhihu.com/question/374251348
  const { Solar } = Para[Name];
  const a = 1;
  const v0 = (2 * pi) / Solar; // 平均角速度
  const mu = v0 ** 2 * a ** 3; // μ=GM
  const r = distEllipse(Orb, c); // 日地距離
  const v2 = mu * (2 / r - 1 / a);
  return R2D * sqr(v2);
};
// console.log(vEllipse(.0169, 'Guimao', 0))
export const sunCorrQing = (Name, Sorb) => {
  let Corr = 0;
  let d = 0;
  Sorb = fm360(Sorb);
  if (Name === "Xinfa" || Name === "Yongnian") {
    const { Corr: CorrTmp, d: dTmp } = corrRingA(Sorb, 0.0179208);
    Corr = CorrTmp;
    d = dTmp;
  } else if (Name === "Jiazi") {
    const { Corr: CorrTmp, d: dTmp } = corrRingC(Sorb, 0.0179208);
    Corr = CorrTmp;
    d = dTmp;
  } else if (Name === "Guimao") Corr = corrEllipseC(Sorb, 0.0169);
  return { Corr, d };
};
// console.log(sunCorrQing("Guimao", 326.5298081019))
export const sunQing = (Name, SunRoot, SperiRoot, Smd) => {
  const { SunAvgVd, SperiVd } = Para[Name];
  const AvgSun = SunRoot + Smd * SunAvgVd; // 平行：以年根與日數相加，得平行。// 求日數（考成：所求本日子正初刻距天正冬至次日子正初刻之平行經度。）：自天正冬至次日距所求本日共若干日，與太陽每日平行相乘，以宮度分收之，得日數。
  const Speri = SperiVd * Smd + SperiRoot; // 最卑平行。Speri=SunPerigee太陽近地點。Smd=winter solstice tomorrow difference距離冬至次日子正的時間
  const Sorb = fm360(AvgSun - Speri); // 求引數（考成：本日子正初刻均輪心過本輪最卑之行度。平行乃本輪心之行度，自冬至起初宮；引數乃均輪心之行度，自最卑起初宮）
  const SunCorr = sunCorrQing(Name, Sorb).Corr;
  const SunGong = fm360(AvgSun + SunCorr); // 實行
  const SunLon = Gong2Lon(SunGong); // 黃道度
  return { Sorb, SunCorr, SunLon, SunGong, Speri };
};

// 崇禎曆書曆指只說了一均（初均，=本輪+均輪）二均，但是曆表用了三均（二均差）。以下算法參考宁晓玉《新法算书中的月亮模型》。褚龍飛等《第谷月亮理论在中国的传播》：經驗算，崇禎曆書二三均數表等於第谷的第二差（次輪）、二均差（次均輪、又次輪）之和。月離曆指卷三的二三均數算法圖實際上是哥白尼模型。對比二三均數表，實引3宮0度、月距日2宮11度：崇禎1度50分，考成1度52分52秒；實引9宮0度、月距日1宮21度：崇禎2度8分，考成1度59分35秒
const moonXinfa = (
  Name,
  MoonRoot,
  NodeRoot,
  MapoRoot,
  Smd,
  SunCorr,
  SunGong
) => {
  const { MoonAvgVd, MapoVd, NodeVd, Sobliq } = Para[Name];
  const R1 = 0.058;
  const R2 = 0.029;
  const R4 = 0.02174;
  const R5 = 0.01175; // 1本輪R1 = .058、2均輪R2 = .029、3負均輪圈R3 = .0797、4次輪、5次均輪
  const MobliqMid = 5.13333333333333;
  const MobliqDif = 0.15833333333333;
  const AvgMoon0 = fm360(MoonRoot + Smd * MoonAvgVd);
  const AvgMapo = fm360(MapoRoot + Smd * MapoVd); // 最高平行.Mapo=MoonApogee太陰遠地點
  const AvgNode = NodeRoot - Smd * NodeVd; // 正交平行
  const AvgMoon =
    AvgMoon0 - timeAvg2Real(Name, Sobliq, Gong2Lon(SunGong)) * MoonAvgVd; // 時差總爲加者時差行爲減。1921算例330°23′39.19″=330.3942194444
  // const AvgMoon = AvgMoon0
  const Morb = fm360(AvgMoon - AvgMapo);
  const { Corr: Corr1, d } = corrRingC(Morb, 0.0435);
  const AcrMoon0 = AvgMoon + Corr1; // 實平行
  const AcrMorb = Morb + Corr1;
  const MSDif = fm360(AcrMoon0 - SunGong);
  const MSDif2 = (MSDif * 2) % 360;
  // 以下根據褚龍飛論文
  const E1 = 2 * R4 * sind(MSDif);
  const G = 90 + AcrMorb - MSDif;
  const Corr2 = -atand((E1 * sind(G)) / (d + E1 * cosd(G)));
  const Corr3 = 0.675 * sind(MSDif2);
  const Corr23 = Corr2 + Corr3;
  const Whitegong = fm360(AcrMoon0 + Corr23); // 白道實行
  // 以下照抄甲子曆
  const Mobliq = aCb_Sph(MobliqMid, MobliqDif, t2(MSDif2)); // 黃白大距。90：5度8分9秒=5.1358333333
  const NodeCorr = asind(
    (sind(t2(MSDif2)) * sind(MobliqDif)) / sind(MobliqMid)
  ); // 交均：白道極與交均輪心之差。90：1度46分8秒=1.7688888889
  const flag4 = MSDif2 < 180 ? -1 : 1; // 月距日倍度不及半周，交均爲減
  const AcrNode = fm360(AvgNode + flag4 * NodeCorr);
  const Whitelongi = fm360(Whitegong - AcrNode);
  const { MoonLon, MoonLat } = White2Eclp(Mobliq, AcrNode, Whitelongi); // 1921算例328°25′20.67″=328.4224083333
  return {
    Node: AcrNode,
    Whitegong,
    Whitelongi,
    MoonGong: Lon2Gong(MoonLon),
    MoonLon,
    MoonLat,
    Mobliq,
    Mapo: AvgMapo
  };
};
// console.log(moonXinfa('Xinfa'))
const moonJiazi = (
  Name,
  MoonRoot,
  NodeRoot,
  MapoRoot,
  Smd,
  SunCorr,
  SunGong
) => {
  const { MoonAvgVd, MapoVd, NodeVd, Sobliq } = Para[Name];
  const R2 = 0.029;
  const R4 = 0.0217;
  const R5 = 0.01175; // 1本輪R1 = .058、2均輪R2 = .029、3負均輪圈R3 = .0797、4次輪、5次均輪
  const MobliqMid = 5.13333333333333;
  const MobliqDif = 0.15833333333333; // 朔望黃白大距，Mobliq0822 = 5.29166666666667,兩弦黃白大距5 + 17 / 60 + 30 / 3600，黃白大距中數5+8/60，黃白大距半較9/60+30/3600
  // 時差——引數——初均——月距日次引——二均——三均——白道實行——黃白大距、交均——正交
  const AvgMoon0 = fm360(MoonRoot + Smd * MoonAvgVd); // 太陰平行。1921算例330°20′19.9″=330.3388611111
  const AvgMapo = fm360(MapoRoot + Smd * MapoVd); // 最高平行.Mapo=MoonApogee太陰遠地點
  const AvgNode = NodeRoot - Smd * NodeVd; // 正交平行
  // const AvgMoon = AvgMoon0
  const AvgMoon =
    AvgMoon0 -
    timeAvg2Real(Name, Sobliq, Gong2Lon(SunGong), SunCorr) * MoonAvgVd; // 時差總爲加者時差行爲減。1921算例330°23′39.19″=330.3942194444
  const Morb = fm360(AvgMoon - AvgMapo); // 均輪心自行引數Morb=MoonOrbitDegree。1949算例：200°22′05.77″=200.3682694444
  const { Corr: Corr1, d } = corrRingC(Morb, 0.0435); // 1921算例-1°29′33.22″=-1.4925611111
  const flag1 = Math.sign(Corr1);
  const AcrMoon0 = AvgMoon + Corr1; // 初實行
  const MSDif = (AcrMoon0 - SunGong + 720) % 360; // 月距日次引（次輪周之行度）
  // 次輪心行Orbdeg*2%360，次均輪心行MSDif*2
  const MSDif2 = (MSDif * 2) % 360; // 倍離
  const AcrMorbTmp = abs(Corr1) + t1(Morb); // 以初均數與均輪心距最卑之度相加。次輪最近點距地心線與次輪徑夾角 // 如果Morb<180就是t1(Morb-Corr1)，暫且這麼命名
  // 次輪最近點距地。90：1.0037774。120：0.9883760。230：0.9836195。300：1.0172941
  const Jichou = R4 * sin2d(t2(MSDif2)); // 次輪月距日倍度之通弦。120：0.0407827。135：0.0306884。320：0.0278970
  const AngJichoujia = abs(
    AcrMorbTmp + // 均輪心距最卑之度=引數與半周相減
      (flag1 * f4(MSDif) * t1(MSDif2)) / 2
  ); // 加減月距日距象限度爲夾角。距象限90度和我的算式等效。
  // 初均減者：月距日過一三象限，加；不過象限或過二象限，減。
  // 初均加者：相反。若初均與均輪心距最卑相加不足減月距日距象限度，則轉減。若相加過半周，則與全周相減。110、120用加：84度22分19秒=84.3719444444。135、230用減：8度53分6秒=8.885。320、300：74度14分51秒=74.2475
  let flag2 = flag1; // 二均符號
  if (AcrMorbTmp < 90) {
    // 以初均數與均輪心距最卑之度相加，爲次輪最近點距地心線與次輪徑夾角。此角如不及九十度，則倍之，與半周相減，餘爲加減限。初均減者：月距日倍度在此限內，則二均反爲加；初均加者：月距日倍度與全周相減，餘數在此限內，則二均數反爲減。
    const limit = 180 - AcrMorbTmp * 2;
    if (flag1 === -1) {
      if (MSDif2 < limit) flag2 = 1;
    } else if (abs(MSDif2 - 360) < limit) flag2 = -1;
  } else {
    // 此角如過九十度，則與半周相減，餘數倍之，又與半周相減，餘爲加減限。初均減者：月距日倍度與全周相減，餘數在此限內，則二均數反爲加。初均加者：月距日倍度在此限内，則二均數反爲減。若不在限內，或其角適足九十度，則初均數爲加者二均數亦爲加，初均數爲減者二均數亦為減。
    const limit = 180 - abs(180 - AcrMorbTmp) * 2;
    if (flag1 === -1) {
      if (abs(MSDif2 - 360) < limit) flag2 = 1;
    } else if (MSDif2 < limit) flag2 = -1;
  }
  const Corr2 = qiexianA(Jichou, d, AngJichoujia); // 丑甲己角。90：1度22分5秒=1.3680555556。2度21分40秒=2.3611111111。135、230：17分6秒=.285。1度31分23秒=1.5230555556。1921算例：-1°9′34.01″=-1.1594472222
  const Jijia = abs((Jichou * sind(AngJichoujia)) / sind(Corr2)); // 次均輪心距地。90：0.9842622。120：0.9851595。135、230：0.9528920
  const Corr3 = qiexianA(R5, Jijia, t2(MSDif2)); // 90：41分2秒=.6838888889。110、120：26分7秒=.4352777778。135、230：42分23秒=.7063888889。320、300：39分27秒=.6575。1921算例：0°33′49.17″=0.5636583333
  const flag3 = MSDif2 < 180 ? 1 : -1; // 月距日倍度不及半周爲加，過半周爲減
  const Corr23 = flag2 * Corr2 + flag3 * Corr3; // 二三均數
  const Whitegong = fm360(AcrMoon0 + Corr23); // 白道實行
  // 白極自交均輪順時針行倍離
  const Mobliq = aCb_Sph(MobliqMid, MobliqDif, t2(MSDif2)); // 黃白大距。90：5度8分9秒=5.1358333333
  const NodeCorr = asind(
    (sind(t2(MSDif2)) * sind(MobliqDif)) / sind(MobliqMid)
  ); // 交均：白道極與交均輪心之差。90：1度46分8秒=1.7688888889
  const flag4 = MSDif2 < 180 ? -1 : 1; // 月距日倍度不及半周，交均爲減
  const AcrNode = fm360(AvgNode + flag4 * NodeCorr);
  const Whitelongi = fm360(Whitegong - AcrNode);
  const { MoonLon, MoonLat } = White2Eclp(Mobliq, AcrNode, Whitelongi); // 1921算例328°25′20.67″=328.4224083333
  return {
    Node: AcrNode,
    Whitegong,
    Whitelongi,
    MoonGong: Lon2Gong(MoonLon),
    MoonLon,
    MoonLat,
    Mobliq,
    Mapo: AvgMapo
  };
};

export const moonGuimao = (
  Name,
  MoonRoot,
  NodeRoot,
  MapoRoot,
  Smd,
  SunCorr,
  SunGong,
  Speri,
  Sorb
) => {
  const { MoonAvgVd, MapoVd, NodeVd } = Para[Name];
  const SunCorrMax = 1.93694444444444; // 太陽最大均數1 + 56 / 60 + 13 / 3600
  const AvgCorr1Max = 0.19722222222222; // 太陰最大一平均11 / 60 + 50 / 3600
  const AvgMapoCorrMax = 0.33222222222222; // 最高最大平均19 / 60 + 56 / 3600
  const AvgNodeCorrMax = 0.15833333333333; // 正交最大平均9 / 60 + 30 / 3600
  const AvgCorr2ApoMax = 0.05944444444444;
  const AvgCorr2PeriMax = 0.06555555555556; // 太陽在最高時之太陰最大二平均3 / 60 + 34 / 3600。太陽在最卑時之太陰最大二平均3 / 60 + 56 / 3600
  const AvgCorr3Max = 0.01305555555556; // 最大三平均47 / 3600
  const Corr2ApoMax = 0.55388888888889;
  const Corr2PeriMax = 0.61972222222222; // 太陽在最高時之最大二均33 / 60 + 14 / 3600。太陽在最卑時之最大二均37 / 60 + 11 / 3600
  const Corr3Max = 0.04027777777778; // 最大三均2 / 60 + 25 / 3600
  const Corr4MaxList = [
    0, 0.01694444444444, 0.01861111111111, 0.02111111111111, 0.02444444444444,
    0.02861111111111, 0.03333333333333, 0.03861111111111, 0.04416666666667, 0.05
  ]; // [0, 61 / 3600, 67 / 3600, 76 / 3600, 88 / 3600, 103 / 3600, 120 / 3600, 139 / 3600, 159 / 3600, 180 / 3600]兩弦最大末均以10度爲率，依次為日月最高相距0、10、20⋯⋯90度。為何0-10有一個突然的陡坡？見廖育棟文檔附錄2
  const MobliqMax = 5.28888888888889;
  const MobliqMin = 4.99305555555556; // 黃白交角大距限5 + 17 / 60 + 20 / 3600。4 + 59 / 60 + 35 / 3600
  /// ///// 平行
  const AcrMoon0 = fm360(MoonRoot + Smd * MoonAvgVd); // 太陰平行
  const AvgMapo1 = fm360(MapoRoot + Smd * MapoVd); // 最高平行
  const AvgNode1 = fm360(NodeRoot - Smd * NodeVd); // 正交平行
  const AvgMoon2 = AcrMoon0 - (SunCorr / SunCorrMax) * AvgCorr1Max; // 二平行=太陰平行+-一平均：用時之太陰平行。一平均（考慮地球自轉的時間）已有均數時差，而止就黃道算，故不用升度時差。一平均：太阳均数加者为减，减者为加。
  const AvgMapo = AvgMapo1 + (SunCorr / SunCorrMax) * AvgMapoCorrMax; // 用最高=最高平行+-最高平均
  const AvgNode = AvgNode1 - (SunCorr / SunCorrMax) * AvgNodeCorrMax; // 用正交=正交平行+-正交平均
  const SunMapoDif = fm360(SunGong - AvgMapo); // 日距月最高
  const SunNodeDif = fm360(SunGong - AvgNode); // 日距正交
  const SDist = distEllipseA(Sorb + SunCorr, 0.0169); // 日距地心
  const TubedDif = (1.0169 ** 3 - SDist ** 3) / 0.10141; // 求立方較,太阳最高距地心数之立方。這裡再除以太陽高卑距地之立方大較 (10000000+169000)**3-(10000000-169000)**3
  const AvgCorr2Apo = abs(sind(SunMapoDif * 2) * AvgCorr2ApoMax); // 太陽在最高時日距月最高之二平均
  const AvgCorr2Peri = abs(sind(SunMapoDif * 2) * AvgCorr2PeriMax);
  const AvgCorr2 =
    f1(SunMapoDif * 2) *
    (abs(AvgCorr2Apo - AvgCorr2Peri) * TubedDif + AvgCorr2Apo); // 本時之二平均。日距月最高倍度不及半周为减，过半周为加。
  const AvgCorr3 = -sind(2 * SunNodeDif) * AvgCorr3Max; // 日距正交倍度不及半周为减，过半周为加。
  const AvgMoon = AvgMoon2 + AvgCorr2 + AvgCorr3; // 用平行
  const AcrMapoCorr =
    f2(SunMapoDif * 2) *
    qiexian(0.0117315, 0.0550505, t1(SunMapoDif * 2)).Ashort; // 求最高實均。最高本輪半徑550505，最高均輪半徑117315。日距月最高之倍度与半周相减，馀为所夹之角。日距月最高倍度不及半周者，与半周相减；过半周者，减半周。日距月最高倍度不及半周为加，过半周为减。
  const MoonC = abs((0.0117315 * sind(t2(SunMapoDif * 2))) / sind(AcrMapoCorr)); // 本天心距地：本時兩心差
  const AcrMapo = AvgMapo + AcrMapoCorr; // 最高實行
  const Morb = fm360(AvgMoon - AcrMapo); // 太陰引數=用平行-最高實行
  /// ///// 實行
  const Corr1 = corrEllipseD2(Morb, MoonC); // 初均
  const Acr1 = AvgMoon + Corr1; // 初實行
  const MSDif = fm360(Acr1 - SunGong); // 月距日
  const Corr2Apo = abs(sind(MSDif * 2) * Corr2ApoMax); // 太陽最高時月距日之二均
  const Corr2Peri = abs(sind(MSDif * 2) * Corr2PeriMax); // 太陽最卑時月距日之二均
  const Corr2 =
    f2(MSDif * 2) * abs((Corr2Apo - Corr2Peri) * TubedDif + Corr2Apo); // 本時之二均。月距日倍度不及半周为加，过半周为减。
  const AcrMSDif = MSDif + Corr2; // 實月距日
  const SunMoonApoDif = fm360(AcrMapo - (Speri + 180)); // 日月最高相距
  const MSDifSum = fm360(AcrMSDif + SunMoonApoDif); // 相距總數
  const Corr3 = sind(MSDifSum) * Corr3Max; // 三均。总数初宫至五宫为加，六宫至十一宫为减
  const Dif90 = t3(SunMoonApoDif) / 10;
  const Corr4Max =
    deci(Dif90) *
      (Corr4MaxList[Math.trunc(Dif90) + 1] - Corr4MaxList[Math.trunc(Dif90)]) +
    Corr4MaxList[Math.trunc(Dif90)]; // 兩弦最大末均
  const Corr4 = -sind(AcrMSDif) * Corr4Max; // 末均。实月距日初宫至五宫为减，六宫至十一宫为加。
  const Whitegong = Acr1 + Corr2 + Corr3 + Corr4; // 白道實行moon's path
  /// ///// 黃白差
  const AcrNodeCorr =
    f2(SunNodeDif * 2) * qiexian(57.5, 1.5, t1(SunNodeDif * 2)).Ashort; // 正交實均。日距正交倍度过半周者，与半周相减，用其馀。日距正交倍度不及半周为加，过半周为减。
  const AcrNode = fm360(AvgNode + AcrNodeCorr); // 正交實行
  const Whitelongi = fm360(Whitegong - AcrNode); // 月距正交。——我把正交定為白經0度
  const vsinSunNodeDif2 = vsind(t2(SunNodeDif * 2)); // 日距正交倍度之正矢
  const MobliqLimitCorr = (vsinSunNodeDif2 * (MobliqMax - MobliqMin)) / 2; // 交角減分。黄白大距半較8分52秒半。凡日距正交倍度过半周者，则与全周相减，馀为距交倍度。
  const MobliqCorrSunNodeDif = ((2 / 60 + 43 / 3600) / 2) * vsinSunNodeDif2; // 距交加差。2分43秒最大兩弦加差
  const Mobliq =
    MobliqMax -
    MobliqLimitCorr +
    (MobliqCorrSunNodeDif / 2) * vsind(t2(AcrMSDif * 2)); // 黃白大距=距限+距日加分
  const { MoonLon, MoonLat } = White2Eclp(Mobliq, AcrNode, Whitelongi);
  return {
    Node: AcrNode,
    Whitegong,
    Whitelongi,
    MoonGong: Lon2Gong(MoonLon),
    MoonLon,
    MoonLat,
    Mobliq,
    Morb,
    Mapo: AcrMapo,
    Corr1,
    MoonC
  };
};
export const moonQing = (
  Name,
  MoonRoot,
  NodeRoot,
  MapoRoot,
  Smd,
  SunCorr,
  SunGong,
  Speri,
  Sorb
) => {
  if (Name === "Xinfa" || Name === "Yongnian")
    return moonXinfa(Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong);
  if (Name === "Jiazi")
    return moonJiazi(Name, MoonRoot, NodeRoot, MapoRoot, Smd, SunCorr, SunGong);
  if (Name === "Guimao")
    return moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      Smd,
      SunCorr,
      SunGong,
      Speri,
      Sorb
    );
};
