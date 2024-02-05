// import { ConstWest } from './astronomy_west.mjs'
import { big } from './para_constant.mjs'
import { Equa2EclpWest, Lon2LatWest } from './astronomy_west.mjs'

const pi = big.acos(-1)
const r2d = degree => big(degree).mul(180).div(pi)
const d2r = degree => big(degree).mul(pi).div(180)
const RoundL2HWest = (r, l) => big(r).mul(big(1).sub(d2r(l).cos())).toNumber() // 輸入半弧，輸出矢
const RoundL2CWest = (r, l) => big(r).mul(d2r(l).sin()).toNumber() // 輸入半弧，輸出半弦
// const RoundH2LWest = (r, h) => r2d(big.acos((r - h) / r)).toNumber() // 輸入矢，輸出半弧
const RoundC2LWest = (r, c) => r2d(big(c).div(r).asin()).toNumber() // 輸入半弦，輸出半弧  // 圓心角l=arcsin(sqrt(2rh-h^2)/r) 
// const RoundH2CWest、RoundC2HWest // 直接用勾股定理

// const RoundL2HWest = (r, l) => big(r).sub(big.sqrt(big(r).pow(2).mul(big(1).sub((d2r(l).sin()).pow(2))))).toNumber()  // 半弦c,半弧l，c=rsinl, h=sqrt(r^2-c^2)+r ==> h=r-sqrt(r^2*(1-(sinl)^2))
// console.log (RoundL2HWest(58,180))
// const RoundH2LWest = (r, h) => r2d(big.sqrt(h * (2 * r - h)).div(r).asin()).toNumber()// c=sqrt(h(2r-h)), sinl=c/r ==>半弧l=arcsin(sqrt(h(2r-h))/r)

// 會圓術已知矢長求弧長 
const RoundH2LC = h => { // 弓弦長 2* sqrt (r^2-(r-h)^2) //半徑，矢長
    const r = 60.875
    let Halfc = Math.sqrt(h * (2 * r - h))
    const c = Halfc * 2
    let l = h ** 2 / r + c
    return { Halfc, c, l }
}
const RoundL2H = l => { // 會圓術已知半弧長反求矢長
    const r = 60.875
    const d = 121.75
    const equation = x => (x ** 4) / d ** 2 + (1 - 2 * l / d) * x ** 2 - d * x + l ** 2
    let mid = 0
    let lower = 0
    let upper = r
    while (upper - lower > 1e-10) {
        mid = (lower + upper) / 2
        if (equation(mid) * equation(lower) < 0) {
            upper = mid
        } else {
            lower = mid
        }
    }
    return upper // 矢長
}
const RoundC2HL = c => { // c 半弦長
    const r = 60.875
    const h = r - Math.sqrt(r ** 2 - c ** 2)
    const l = 2 * c + h ** 2 / r
    const Halfl = l / 2
    return { h, l, Halfl }
}
export const RoundH2LPrint = h => {
    h = +h
    const Sidereal = 365.25
    const pi = 3.141592653589793
    const r = 60.875 // 會圓術系數3，不是pi
    const Portion2 = pi / 3
    const Portion4 = Sidereal / 360
    const l = RoundH2LC(h).l
    const c = Math.sqrt(h * (2 * r - h)) * 2
    const rReal = Sidereal / pi / 2 // 365.25、60.875對應的直徑：116.26268592862955
    const hReal = h / Portion2
    let cWest = Math.sqrt(hReal * (2 * rReal - hReal))
    const lWest = RoundC2LWest(rReal / Portion4, cWest / Portion4) * Portion4 * 2
    cWest *= 2
    let Print = [{
        title: '會圓術',
        data: [l.toFixed(6), (l - lWest).toFixed(4), c.toFixed(6), (c - cWest).toFixed(4)]
    }]
    Print = Print.concat({
        title: '三角函數',
        data: [lWest.toFixed(6), 0, cWest.toFixed(6), 0]
    })
    return Print
}
// console.log(RoundH2LPrint(60.875, 60.875, 365.25))
export const RoundC2LHPrint = cRaw => {
    cRaw = +cRaw
    const c = cRaw / 2
    if (cRaw > 121.75) {
        throw (new Error('c <= 121.75'))
    }
    // const Sidereal = 365.25
    // const r = 60.875
    // const Portion2 = pi / 3
    // const Portion4 = Sidereal / 360
    const Func = RoundC2HL(c)
    let l = Func.l
    let h = Func.h
    // const rReal = Sidereal / pi / 2
    // const cReal = c / Portion2
    // let lWest = RoundC2LWest(rReal / Portion4, c / Portion4) * Portion4
    // const hWest = (rReal / Portion4 - Math.sqrt((rReal / Portion4) ** 2 - cReal ** 2))// / Portion2
    // lWest *= 2
    let Print = [{
        title: '會圓術',
        // data: [l.toFixed(6), (l - lWest).toFixed(4), h.toFixed(6), (h - hWest).toFixed(4)]
        data: [l.toFixed(6), '-', h.toFixed(6), '-']
    }]
    // Print = Print.concat({
    //     title: '三角函數',
    //     data: [lWest.toFixed(6), 0, hWest.toFixed(6), 0]
    // })
    return Print
}
export const RoundL2HPrint = lRaw => {
    lRaw = +lRaw
    const l = lRaw / 2
    const Sidereal = 365.25
    const pi = 3.141592653589793
    const r = 60.875 // 會圓術系數3，不是pi
    let h = RoundL2H(l)
    if (lRaw === 0) {
        h = 0
    }
    let c = lRaw - h ** 2 / r
    const Portion2 = pi / 3
    const Portion4 = Sidereal / 360
    const rReal = Sidereal / pi / 2
    // const lReal=
    let hWest = RoundL2HWest(rReal / Portion4, l / Portion4)
    hWest *= Portion2
    const cWest = RoundH2LC(hWest).c / Portion2 * Portion4
    hWest *= Portion4
    let Print = [{
        title: '會圓術',
        data: [h.toFixed(6), (h - hWest).toFixed(4), c.toFixed(6), (c - cWest).toFixed(4)]
    }]
    Print = Print.concat({
        title: '三角函數',
        data: [hWest.toFixed(6), 0, cWest.toFixed(6), 0]
    })
    return Print
}
// console.log(RoundL2HPrint(182.625, 60.875, 365.25))
const Hushigeyuan_Sub = (LonRaw, p, q, pAnother) => {
    const Sidereal = 365.25
    const r = 60.875
    const d = 121.75
    pAnother = pAnother || p
    const Sidereal25 = Sidereal / 4
    const Sidereal50 = Sidereal / 2
    const Sidereal75 = Sidereal * .75
    let Lon = LonRaw % Sidereal25
    if ((LonRaw > Sidereal25 && LonRaw <= Sidereal50) || (LonRaw >= Sidereal75 && LonRaw < Sidereal)) {
        Lon = Sidereal25 - Lon
    }
    const v1 = RoundL2H(Lon) // LD黃道矢度 
    const OL = r - v1 // 黃赤小弦
    const p1 = Math.sqrt(r ** 2 - OL ** 2) // LB黃半弧弦
    const p2 = p * OL / r // BN,LM
    const p2Another = pAnother * OL / r // BN黃赤小弧弦、黃赤內外半弧弦
    const p3 = p1 * r / Math.sqrt(r ** 2 - p2 ** 2) // PC赤半弧弦
    const v3 = r - Math.sqrt(r ** 2 - p3 ** 2) // PE赤橫弧矢
    let Eclp2EquaDif = (p3 + (v3 ** 2) / d - Lon) % 91.3125 // 赤經。輸入0的話會冒出一個91.3125 
    ///// 黃轉赤的赤緯
    const OM = OL * q / r // 黃赤小股
    const ON = Math.sqrt(p1 ** 2 + OM ** 2) // 赤小弦// const ON = Math.sqrt(r ** 2 - p2 ** 2) //v2
    let Lat = p2Another + (r - ON) ** 2 / d // r - ON ： 赤二弦差、黃赤內外矢 //NC ** 2 / d： 半背弦差
    let sign = 1
    if (LonRaw < Sidereal25 || LonRaw > Sidereal75) {
        Lat = -Lat
        sign = -1
    }
    /////赤轉黃/////
    const PE = RoundL2H(Lon)
    const OP = r - PE
    const PC = Math.sqrt(r ** 2 - OP ** 2)
    const CT = p * OP / q // PQ=CT，T是C向上垂直，超出了球體。Q是P垂直向上，交OD
    const OT = Math.sqrt(r ** 2 + CT ** 2) // OT=r+BT
    const BN = CT * r / OT
    const PQ = p * OP / q
    const BL = PC * BN / PQ
    const BD = RoundC2HL(BL).Halfl
    let Equa2EclpDif = Lon - BD
    const condition = (LonRaw >= 0 && LonRaw < Sidereal25) || (LonRaw >= Sidereal50 && LonRaw < Sidereal75)
    Eclp2EquaDif *= condition ? 1 : -1
    Equa2EclpDif *= condition ? -1 : 1
    const Eclp2Equa = LonRaw + Eclp2EquaDif
    const Equa2Eclp = LonRaw + Equa2EclpDif
    return { Eclp2EquaDif, Equa2EclpDif, Eclp2Equa, Equa2Eclp, Lat, ON, p2Another, sign }

}
// 弧矢割圓術黃赤轉換。跟元志六《黃赤道率》立成表分毫不差，耶！！！
export const Hushigeyuan = (LonRaw, Name) => { // 變量名見《中國古代曆法》頁629
    // 北京赤道出地度50.365，緯度40.9475，40.949375。《大統法原勾股測望》：半弧背s26.465。矢v 5.915    
    LonRaw += 1e-12
    const p = 23.807 // DK 實測23.9半弧背、黃赤大勾
    const pAnother = 23.71 // 二至黃赤內外半弧弦
    const q = 56.0268 // OK
    // const v = 4.8482 // KE    
    const { Eclp2EquaDif, Equa2EclpDif, Eclp2Equa, Equa2Eclp, Lat, ON, p2Another, sign
    } = Hushigeyuan_Sub(LonRaw, p, q, pAnother)
    const Lat1 = 91.3125 - Lat // 91.314375
    //////////晷漏//////// 
    // const v2 = LatFunc.h
    const SunHundred = 6 * ON + 1 // 日行百刻度
    const Banhubei = p2Another * (['Datong', 'Datong2'].includes(Name) ? 14.5554 : 19.9614) / pAnother // 19.9614：二至出入差半弧背 // 根據大統晨昏立成，14.5554與冬至初日相合
    const Rise = 25 - sign * Banhubei * 100 / SunHundred // 半夜漏。似乎授時的夜漏包含了晨昏
    //  const Duskstar = (50 - (NightTime - 2.5)) * Sidereal / 100 + 正午赤度
    return { Eclp2Equa, Eclp2EquaDif, Equa2Eclp, Equa2EclpDif, Lat, Lat1, Rise }
}

const Hushigeyuan_Ex = (LonRaw, e) => { // 度數，黃赤交角
    const r = 60.875
    const h = RoundL2H(e)
    const p = Math.sqrt(r ** 2 - (r - h) ** 2)
    const q = r - h
    const { Eclp2EquaDif, Equa2EclpDif, Eclp2Equa, Equa2Eclp, Lat
    } = Hushigeyuan_Sub(LonRaw, p, q)
    return { Eclp2Equa, Eclp2EquaDif, Equa2Eclp, Equa2EclpDif, Lat, }
}
// console.log(Hushigeyuan(40).Eclp2Equa)
// console.log(Hushigeyuan_Ex(40, 24).Eclp2Equa) // 弧矢割圓的黃赤交角以24度算

const HushigeyuanWest = (LonRaw, Sidereal, DE) => { // DE黃赤交角。變量名見《中國古代曆法》頁629
    const pi = 3.141592653589793
    const Sidereal25 = Sidereal / 4
    const Sidereal50 = Sidereal / 2
    const Sidereal75 = Sidereal * .75
    let Lon = LonRaw % Sidereal25
    if ((LonRaw > Sidereal25 && LonRaw <= Sidereal50) || (LonRaw >= Sidereal75 && LonRaw < Sidereal)) {
        Lon = Sidereal25 - Lon
    }
    ////轉換爲360度////
    const Portion4 = Sidereal / 360
    Lon /= Portion4
    const r = 360 / pi / 2
    const p = RoundL2CWest(r, DE) // DK
    const v = RoundL2HWest(r, DE) // KE
    const q = r - v // OK
    const v1 = RoundL2HWest(r, Lon) // LD
    const OL = r - v1
    const p1 = Math.sqrt(r ** 2 - OL ** 2) // LB黃半弧弦
    const p2 = p * OL / r // BN,LM
    const p3 = p1 * r / Math.sqrt(r ** 2 - p2 ** 2) // PC赤半弧弦
    // const v3 = r - Math.sqrt(r ** 2 - p3 ** 2) // PE赤橫弧矢
    // const EquaLon = RoundH2LWest(r, v3) // 這兩個結果完全一樣
    const EquaLon = RoundC2LWest(r, p3)
    ///// 黃轉赤的赤緯
    // const OM = OL * q / r // 黃赤小股
    // const NC = r - Math.sqrt(p1 ** 2 + OM ** 2)
    // let Lat = RoundH2LWest(r, NC)
    let Lat = RoundC2LWest(r, p2)
    if (LonRaw < Sidereal25 || LonRaw > Sidereal75) {
        Lat = -Lat
    }
    /////赤轉黃/////
    const PE = RoundL2HWest(r, Lon)
    const OP = r - PE
    const PC = Math.sqrt(r ** 2 - OP ** 2)
    const CT = p * OP / q // PQ=CT，T是C向上垂直，超出了球體。Q是P垂直向上，交OD
    const OT = Math.sqrt(r ** 2 + CT ** 2) // OT=r+BT
    const BN = CT * r / OT
    const PQ = p * OP / q
    const BL = PC * BN / PQ
    const BD = RoundC2LWest(r, BL)
    //////轉換爲365.25度//////
    let Eclp2EquaDif = (EquaLon - Lon) * Portion4
    let Equa2EclpDif = (Lon - BD) * Portion4
    Lat *= Portion4
    const condition = (LonRaw >= 0 && LonRaw < Sidereal25) || (LonRaw >= Sidereal50 && LonRaw < Sidereal75)
    Eclp2EquaDif *= condition ? 1 : -1
    Equa2EclpDif *= condition ? -1 : 1
    const Eclp2Equa = LonRaw + Eclp2EquaDif
    const Equa2Eclp = LonRaw + Equa2EclpDif
    return { Eclp2Equa, Eclp2EquaDif, Equa2Eclp, Equa2EclpDif, Lat }
}
// console.log(HushigeyuanWest(32, 365.25, 1000).Eclp2Equa)

export const Hushigeyuan_Ex_Print = (LonRaw, eRaw) => {
    const Sidereal = 365.25
    eRaw = +eRaw
    LonRaw = +LonRaw
    const e = eRaw * 360 / Sidereal
    const {
        Equa2Eclp: WestB,
        Equa2EclpDif: WestB1,
        Eclp2Equa: WestA,
        Eclp2EquaDif: WestA1
    } = Equa2EclpWest(LonRaw, Sidereal, 0, e)
    const { Lat: WestLat } = Lon2LatWest(LonRaw, Sidereal, 0, e)
    let Print = [{
        title: '球面三角',
        data: [WestB.toFixed(5), WestB1.toFixed(4), 0, WestA.toFixed(5), WestA1.toFixed(4), 0, WestLat.toFixed(4), 0]
    }]
    const {
        Equa2Eclp: West2B,
        Equa2EclpDif: West2B1,
        Eclp2Equa: West2A,
        Eclp2EquaDif: West2A1,
        Lat: West2Lat
    } = HushigeyuanWest(LonRaw, Sidereal, e)
    Print = Print.concat({
        title: '三角割圓',
        data: [West2B.toFixed(5), West2B1.toFixed(4), 0, West2A.toFixed(5), West2A1.toFixed(4), 0, West2Lat.toFixed(4), 0]
    })
    const {
        Equa2Eclp: GeyuanB,
        Equa2EclpDif: GeyuanB1,
        Eclp2Equa: GeyuanA,
        Eclp2EquaDif: GeyuanA1,
        Lat: GeyuanLat
    } = Hushigeyuan_Ex(LonRaw, eRaw)
    Print = Print.concat({
        title: '弧矢割圓',
        data: [GeyuanB.toFixed(5), GeyuanB1.toFixed(4), (GeyuanB - WestB).toFixed(4), GeyuanA.toFixed(5), GeyuanA1.toFixed(4), (GeyuanA - WestA).toFixed(4), GeyuanLat.toFixed(4), (GeyuanLat - WestLat).toFixed(4)]
    })
    return Print
}

// 曲安京《授時曆的白赤道座標變換法》，《數》頁370，《中國古代曆法》頁127
// 授時放棄了九道術的黃白轉換，改從白赤轉換入手。
// 距離白赤交點、半交點的赤道度（入初末限） +-白赤差 = 月離白道積度：月亮到白赤交點的白道度
export const HushigeyuanMoon = (NodeEclp, MoonNodeEclpDif) => { // v黃白正交黃度，月在正交後黃度
    const Sidereal = 365.2575
    const Solar = 365.2425
    const Sidereal50 = Sidereal / 2
    const Sidereal25 = Sidereal / 4
    const e = 23.9  // 黃赤大距
    const I = 6 // 黃白大距
    const k = 14.66 // 正交極數：二至白赤正交與黃白正交的距離。白赤大距6，黃赤大距23.9，三角函數得14.73: tan(k)=tan6/sin23.9
    const NodeEclpHalf = NodeEclp % Sidereal50
    const v0 = Sidereal25 - Math.abs(NodeEclp - Sidereal25) // NodeEclpRev。黃白正交到二至的距離，黃白正交在回歸年中的位置：正交在二至後初末限，冬至距正交積度
    const d = v0 * k / Sidereal25 // 定差EH
    const a0 = k - d // 距差BH：白赤交點赤經
    const sign2 = NodeEclpHalf < Sidereal25 ? -1 : 1 // 初限- 末限+
    let base = Solar / 4
    if (NodeEclp >= Sidereal50) {
        base = Solar * .75
    }
    const NodeEqua = base + sign2 * a0 // 白赤正交赤度、月離赤道正交宿度
    const EquaLon = Hushigeyuan(NodeEclp + MoonNodeEclpDif).Eclp2Equa // 月亮赤度a=HN or NF。論文沒說怎麼求，根據頁661，其實就是正交度加上入交之後的積度轉換成赤道
    //////////// 白赤大距：赤道正交後半交白道出入赤道內外度
    const u = e + I * (Sidereal25 - NodeEclpHalf) / Sidereal25 // KF白赤大距。黃白正交黃度v0=45誤差最大，165誤差最小
    const HN = NodeEqua % Sidereal25
    const NF = Sidereal25 - HN // 「白道積」
    const a = Math.min(HN, NF) // 赤道初末限度。在給定a=45的情況下，與頁387計算相合
    const VF = RoundL2H(NF)
    const EquaLat = u * (60.875 - VF) / 60.875
    /////////// 白度 //////////
    let sign1 = -1
    if (NodeEclp >= Sidereal50) { // 冬至後- 夏至後+
        sign1 = 1
    }
    const tmpDing = 98 + sign1 * 24 * (Sidereal25 - NodeEclpHalf) / Sidereal25 // 定限度 // 《數》頁384
    let sign3 = 1
    if (MoonNodeEclpDif % Sidereal50 > Sidereal25) { // 正交中交後+ 半交後-
        sign3 = -1
    }
    // 《數》頁381：HN赤道初末限，卽N到白赤交點或半交點的距離，HM月離白道定積度，HN正交後赤道積度
    const EquaWhiteDif = sign3 * (tmpDing - a) * a / 1000
    const WhiteLon = EquaLon + EquaWhiteDif
    return { a0, u, EquaWhiteDif, EquaLon, WhiteLon, EquaLat }
}
// console.log(HushigeyuanMoon(61, 70).EquaWhiteDif)

// 南宋秦九韶的《数书九章》（Mathematical Treatise in Nine Sections）中的三斜求积术：以小斜幂，并大斜幂，减中斜幂，余半之，自乘于上；以小斜幂乘大斜幂，减上，余四约之，为实；一为从隅，开平方得积。秦九韶他把三角形的三条边分别称为小斜、中斜和大斜。“术”即方法。三斜求积术就是用小斜平方加上大斜平方，减中斜平方，取余数的一半的平方，而得一个数。小斜平方乘以大斜平方，减上面所得到的那个数。相减后余数被4除,开平方后即得面积。化下简就会发现这就是传说中的已知三边求三角形面积的海伦公式。
// 海伦公式 sqrt(p (p-a) (p-b) (p-c)), p=(a+b+c)/2
// 三斜求积术 sqrt( ((c^2 a^2)-((c^2+a^2-b^2 )/2)^2)/4 )
// const date = new Date()
export const Heron = (a, b, c) => {
    const tmp1 = big(c).pow(2).mul(big(a).pow(2)) // 225
    const tmp2 = big(c).pow(2).add(big(a).pow(2)).sub(big(b).pow(2)) // 18
    const tmp3 = tmp1.sub(tmp2.div(2).pow(2))
    const S = tmp3.div(4).sqrt().toFixed(15)
    const Print = 'S△ABC = ' + S
    return { Print }
}
// console.log(Heron(31, 41, 51))