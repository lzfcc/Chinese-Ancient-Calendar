import {
    ColorList,
    ClassColorList,
    ScList,
    FiveList1,
    FiveList2,
    NayinList,
    BranchList,
    MoonGodList,
    MonSindhuNameList,
    MonHexagramNameList,
    MonScaleNameList,
    StemList,
    Hexagram8List,
    FourauspiciousList,
    NumList
} from './para_constant.mjs'

export const YearGodConvert = (a, b, YearScOrder, YuanYear) => { // 干，支，干支
    const MaleGong = Math.round(((7 - YuanYear) % 9 + 9) % 9.1) // 男女九宮算法用《象吉通書》，見《黑水城出土元代曆日研究》
    const FemaleGong = Math.round(((5 + YuanYear) % 9 + 9) % 9.1)
    const MaleFemale = '男' + NumList[MaleGong] + '宮女' + NumList[FemaleGong] + '宮'
    let SuixingOrder = 4
    if (b === 2) SuixingOrder = 11
    else if (b === 3) SuixingOrder = 6
    else if (b === 4) SuixingOrder = 1
    else if (b === 5) SuixingOrder = 5
    else if (b === 6) SuixingOrder = 9
    else if (b === 7) SuixingOrder = 7
    else if (b === 8) SuixingOrder = 2
    else if (b === 9) SuixingOrder = 3
    else if (b === 10) SuixingOrder = 10
    else if (b === 11) SuixingOrder = 8
    else if (b === 12) SuixingOrder = 12
    const Suixing = BranchList[SuixingOrder]
    const Sangmen = BranchList[Math.round((b + 2) % 12.1)]
    const Guanfu = BranchList[Math.round((b + 4) % 12.1)]
    const Suide = BranchList[Math.round((b + 5) % 12.1)]
    const Suipo = BranchList[Math.round((b + 6) % 12.1)]
    const Baihu = BranchList[Math.round((b + 8) % 12.1)]
    const Taiyin = BranchList[Math.round((b + 10) % 12.1)]
    ///////
    //  const    FeiluOrder = ( (13 - b) / 3 - 1) * 3 + Math.round(b % 3.1) - 1
    ///////    
    const YearStemFive = FiveList1[Math.ceil(a / 2)]
    const tmp = Math.round((b + 11) % 12.1) // 向左移動一位
    const tmp2 = 2 * Math.ceil(tmp / 3) // 以3爲一單元，在那個單元，並且對應FiveList2
    const YearBranchFive = Math.round((tmp % 3 + 3) % 3.1) / 3 > .5 ? FiveList2[tmp2 - 1] : FiveList2[tmp2]
    const Three = Math.round(Math.ceil((b + 1) / 3) % 4.1)
    const Jiangjun = BranchList[Math.round((Three * 3 + 7) % 12.1)]
    const Canming = BranchList[Math.round((Three * 3 + 6) % 12.1)]
    const Canguan = BranchList[Math.round((Three * 3 + 5) % 12.1)]
    let ZoushuOrder = 1
    let BoshiOrder = 5
    let LishiOrder = 7
    let CanshiOrder = 8
    if (Three === 2) {
        ZoushuOrder = 7
        BoshiOrder = 8
        LishiOrder = 5
        CanshiOrder = 1
    } else if (Three === 3) {
        ZoushuOrder = 5
        BoshiOrder = 1
        LishiOrder = 8
        CanshiOrder = 7
    } else if (Three === 4) {
        ZoushuOrder = 8
        BoshiOrder = 7
        LishiOrder = 1
        CanshiOrder = 5
    }
    const Zoushu = Hexagram8List[ZoushuOrder]
    const Boshi = Hexagram8List[BoshiOrder]
    const Lishi = Hexagram8List[LishiOrder]
    const Canshi = Hexagram8List[CanshiOrder]
    ///////
    const Four = Math.round((b % 4 + 4) % 4.1) // 4個爲一單元
    let tmp7 = Four * 3 - 1
    tmp7 = Four % 2 ? tmp7 + 3 : tmp7 - 3
    const Huangfan = BranchList[tmp7]
    const Baowei = BranchList[(5 - Four) * 3 - 1]
    let BoshiOrder1 = Math.ceil(Four / 2) * 6 - 3
    BoshiOrder1 = Four % 2 ? BoshiOrder1 : BoshiOrder1 - 2
    const Fubing = StemList[BoshiOrder1]
    let tmp8 = Math.ceil(Four / 2) * 6
    tmp8 = Four % 2 ? tmp8 : tmp8 - 3
    const Jiesha = BranchList[tmp8]
    const tmp9 = Math.round((Math.round((6 - Four) % 4.1) + 2) % 4.1) * 3 - 1
    const Zaisha = BranchList[tmp9 - 1]
    const Suisha = BranchList[tmp9]
    let DashaOrder = 1
    if (Four === 2) DashaOrder = 10
    else if (Four === 3) DashaOrder = 7
    else if (Four === 4) DashaOrder = 4
    const Dasha = BranchList[DashaOrder]
    const Bingfu = BranchList[tmp]
    const Sifu = Suide
    const KuiMon = (YuanYear % 6) + 2
    const GangMon = KuiMon + 6
    const YearGod = '干' + YearStemFive + '支' + YearBranchFive + '，納音' + NayinList[Math.ceil(YearScOrder / 2)] + '。' + MaleFemale + '。魁' + NumList[KuiMon] + '月罡' + NumList[GangMon] + `月。\n太陰在` + Taiyin + '，歲德在' + Suide + '，歲刑在' + Suixing + '，歲破在' + Suipo + '；劫煞在' + Jiesha + '，災煞在' + Zaisha + '，歲煞在' + Suisha + '；將軍在' + Jiangjun + '；白虎在' + Baihu + '，黃幡在' + Huangfan + '，豹尾在' + Baowei + '；奏書在' + Zoushu + '，博士在' + Boshi + '，力士在' + Lishi + '，蠶室在' + Canshi + '；蠶官在' + Canguan + '，蠶命在' + Canming + '；官符在' + Guanfu + '，大煞在' + Dasha + '，喪門在' + Sangmen + '，病符在' + Bingfu + '，死符在' + Sifu + '；伏兵在' + Fubing
    // 太歲、大將軍、太陰、歲刑、歲破、黃幡、豹尾
    return YearGod
}
// console.log(YearGodConvert(1, 6, 51))

// 第一個年九宮                第一個月九宮
// 9   5   7                 7   3   5
// 8   1   3                 6   8   1
// 4   6   2                 2   4   9
export const YearColorConvert = YuanYear => {
    let YearColor = []
    if (YuanYear > 0) {
        const row1an = Math.round(((9 - YuanYear) % 9 + 9) % 9.1)
        const row1bn = Math.round(((5 - YuanYear) % 9 + 9) % 9.1)
        const row1cn = Math.round(((7 - YuanYear) % 9 + 9) % 9.1)
        const row2an = Math.round(((8 - YuanYear) % 9 + 9) % 9.1)
        const row2bn = Math.round(((1 - YuanYear) % 9 + 9) % 9.1)
        const row2cn = Math.round(((3 - YuanYear) % 9 + 9) % 9.1)
        const row3an = Math.round(((4 - YuanYear) % 9 + 9) % 9.1)
        const row3bn = Math.round(((6 - YuanYear) % 9 + 9) % 9.1)
        const row3cn = Math.round(((2 - YuanYear) % 9 + 9) % 9.1)
        const row1a = `<span class='${ClassColorList[row1an]}'>` + ColorList[row1an] + NumList[row1an] + `</span>`
        const row1b = `<span class='${ClassColorList[row1bn]}'>` + ColorList[row1bn] + NumList[row1bn] + `</span>`
        const row1c = `<span class='${ClassColorList[row1cn]}'>` + ColorList[row1cn] + NumList[row1cn] + `</span>`
        const row2a = `<span class='${ClassColorList[row2an]}'>` + ColorList[row2an] + NumList[row2an] + `</span>`
        const row2b = `<span class='${ClassColorList[row2bn]}'>` + ColorList[row2bn] + NumList[row2bn] + `</span>`
        const row2c = `<span class='${ClassColorList[row2cn]}'>` + ColorList[row2cn] + NumList[row2cn] + `</span>`
        const row3a = `<span class='${ClassColorList[row3an]}'>` + ColorList[row3an] + NumList[row3an] + `</span>`
        const row3b = `<span class='${ClassColorList[row3bn]}'>` + ColorList[row3bn] + NumList[row3bn] + `</span>`
        const row3c = `<span class='${ClassColorList[row3cn]}'>` + ColorList[row3cn] + NumList[row3cn] + `</span>`
        YearColor.push([row1a, row1b, row1c])
        YearColor.push([row2a, row2b, row2c])
        YearColor.push([row3a, row3b, row3c])
    }
    return YearColor
}

export const MonColorConvert = (YuanYear, i, ZhengMonScOrder) => {
    const row1an = Math.round(((7 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row1bn = Math.round(((3 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row1cn = Math.round(((5 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row2an = Math.round(((6 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row2bn = Math.round(((8 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row2cn = Math.round(((1 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row3an = Math.round(((2 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row3bn = Math.round(((4 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row3cn = Math.round(((9 - YuanYear * 3 - i + 1) % 9 + 9) % 9.1)
    const row1a = `<span class='${ClassColorList[row1an]}'>` + ColorList[row1an] + NumList[row1an] + `</span>`
    const row1b = `<span class='${ClassColorList[row1bn]}'>` + ColorList[row1bn] + NumList[row1bn] + `</span>`
    const row1c = `<span class='${ClassColorList[row1cn]}'>` + ColorList[row1cn] + NumList[row1cn] + `</span>`
    const row2a = `<span class='${ClassColorList[row2an]}'>` + ColorList[row2an] + NumList[row2an] + `</span>`
    const row2b = `<span class='${ClassColorList[row2bn]}'>` + ColorList[row2bn] + NumList[row2bn] + `</span>`
    const row2c = `<span class='${ClassColorList[row2cn]}'>` + ColorList[row2cn] + NumList[row2cn] + `</span>`
    const row3a = `<span class='${ClassColorList[row3an]}'>` + ColorList[row3an] + NumList[row3an] + `</span>`
    const row3b = `<span class='${ClassColorList[row3bn]}'>` + ColorList[row3bn] + NumList[row3bn] + `</span>`
    const row3c = `<span class='${ClassColorList[row3cn]}'>` + ColorList[row3cn] + NumList[row3cn] + `</span>`
    let MonColor = []
    MonColor.push([row1a, row1b, row1c])
    MonColor.push([row2a, row2b, row2c])
    MonColor.push([row3a, row3b, row3c])
    const MonSc = ScList[Math.round((ZhengMonScOrder + i - 1) % 60.1)]
    const MonSindhuName = MonSindhuNameList[i]
    const MonScaleName = MonScaleNameList[i]
    const MonHexagramName = MonHexagramNameList[i]
    const MonGod = MoonGodList[i]
    const Fourauspicious = FourauspiciousList[(i - 1) % 3]
    const MonInfo = `<span class='eclipse'>月建</span>` + MonSc + `<span class='eclipse'>宿音卦</span>` + MonSindhuName + MonScaleName + MonHexagramName + `<span class='eclipse'>吉時</span>` + Fourauspicious + `\n` + `<span class='eclipse'>月神</span>` + MonGod
    return {
        MonInfo,
        MonColor
    }
}

export const WangwangConvert = (i, Stem, Branch, JieNum, JieDifInt) => {
    const Four = Math.round((i % 4 + 4) % 4.1)
    const First1 = 3 + Math.floor((i - .1) / 4)
    const End1 = Math.round(((Four - 1) * 3 + First1) % 12.1)
    const Three1 = Math.round((JieNum % 3 + 3) % 3.1)
    const First2 = 7 + Math.floor((JieNum - .1) / 3)
    const End2 = Three1 * First2
    const Three2 = Math.ceil(i / 3)
    let Dashi = 0
    let Xiaoshi = 0
    if (Math.round((i + 2) % 12.1) === Branch) Xiaoshi = 1
    if (Three2 === 1) {
        if (Branch === 4) Dashi = 1
    } else if (Three2 === 2) {
        if (Branch === 1) Dashi = 1
    } else if (Three2 === 3) {
        if (Branch === 10) Dashi = 1
    } else if (Three2 === 4) {
        if (Branch === 7) Dashi = 1
    }
    const Three3 = Math.round(((i + 1) % 3 + 3) % 3.1)
    let Guiji = 0
    if (Stem === Three3 || Branch === Three3) Guiji = 1
    return (Branch === End1 ? '往亡' : '') + (JieDifInt === End2 ? '氣亡' : '') + (Dashi ? '大時' : '') + (Xiaoshi ? '小時' : '') + (Guiji ? '歸忌' : '') + (Stem === 1 + (Four - 1) * 3 ? '天李' : '') + (Branch % 6 === 0 ? '重日' : '')
}

export const FubaoConvert = (iRaw, Stem) => { // 復日（報日、重日）
    const i = Math.round(iRaw % 6.1)
    let Fu1 = 0
    let Fu2 = 0
    if (iRaw % 3 === 0 && (Stem === 5 || Stem === 6)) {
        Fu1 = 1
    } else {
        if (i < 3 && (Stem === i || Stem === i + 6)) Fu1 = 1
        else if (Stem === i - 1 || Stem === i + 5) Fu1 = 1
    }
    if (i <= 2 && Stem === iRaw) Fu2 = 1
    else if (i === 6 && Stem === 6) Fu2 = 1
    else if (i === 3 && Stem === 5) Fu2 = 1
    else if (Stem === iRaw - 1) Fu2 = 1
    return (Fu1 ? '復一' : '') + (Fu2 ? '復二' : '')
}

export const LsStarConvert = (i, k) => {
    let LsStar1 = 0
    let LsStar2 = 0
    if (i === 1) {
        if (k === 7) LsStar1 = 1
        else if (k === 21) LsStar2 = 1
    } else if (i === 2) {
        if (k === 4) LsStar1 = 1
        else if (k === 19) LsStar2 = 1
    } else if (i === 3) {
        if (k === 1) LsStar1 = 1
        else if (k === 16) LsStar2 = 1
    } else if (i === 4) {
        if (k === 9) LsStar1 = 1
        else if (k === 25) LsStar2 = 1
    } else if (i === 5) {
        if (k === 15) LsStar1 = 1
        else if (k === 25) LsStar2 = 1
    } else if (i === 6) {
        if (k === 10) LsStar1 = 1
        else if (k === 20) LsStar2 = 1
    } else if (i === 7) {
        if (k === 8) LsStar1 = 1
        else if (k === 22) LsStar2 = 1
    } else if (i === 8) {
        if (k === 2 || k === 5) LsStar1 = 1
        else if (k === 18 || k === 19) LsStar2 = 1
    } else if (i === 9) {
        if (k === 3 || k === 4) LsStar1 = 1
        else if (k === 16 || k === 17) LsStar2 = 1
    } else if (i === 10) {
        if (k === 1) LsStar1 = 1
        else if (k === 14) LsStar2 = 1
    } else if (i === 11) {
        if (k === 11) LsStar1 = 1
        else if (k === 22) LsStar2 = 1
    } else if (i === 12) {
        if (k === 9) LsStar1 = 1
        else if (k === 25) LsStar2 = 1
    }
    const Fanzhi = Math.round((13 - Math.ceil((i + 2) / 2)) % 6.1)
    return (LsStar1 ? '長星' : '') + (LsStar2 ? '短星' : '') + (k === Fanzhi ? '反支' : '')
}

// 每月血支：正月丑．二月寅．三月卯．四月辰．五月巳．六月午．七月未．八月申．九月酉．十月戌．十一月亥．十二月子．
// 每月血忌：正月丑2．二月未8．三月寅3．四月申9．五月卯4．六月酉10．七月辰5．八月戌11．九月巳6．十月亥12．十一月午7．十二月子1．
export const BloodConvert = (i, Branch, k) => {
    let Blood = 0
    let Lin = 0
    if (i === 1) {
        if (Branch === 2) Blood = '血支血忌'
        else if (Branch === 7 && k <= 10) Lin = 1
    } else if (i === 2) {
        if (Branch === 3) Blood = '血支'
        else if (Branch === 8) Blood = '血忌'
        else if (Branch === 12 && k <= 10) Lin = 1
    } else if (i === 3) {
        if (Branch === 4) Blood = '血支'
        else if (Branch === 3) Blood = '血忌'
        else if (Branch === 9 && k <= 10) Lin = 1
    } else if (i === 4) {
        if (Branch === 5) Blood = '血支'
        else if (Branch === 9) Blood = '血忌'
        else if (Branch === 2 && k <= 10) Lin = 1
    } else if (i === 5) {
        if (Branch === 6) Blood = '血支'
        else if (Branch === 4) Blood = '血忌'
        else if (Branch === 11 && k <= 10) Lin = 1
    } else if (i === 6) {
        if (Branch === 7) Blood = '血支'
        else if (Branch === 10) Blood = '血忌'
        else if (Branch === 4 && k <= 10) Lin = 1
    } else if (i === 7) {
        if (Branch === 8) Blood = '血支'
        else if (Branch === 5) Blood = '血忌'
        else if (Branch === 1 && k <= 10) Lin = 1
    } else if (i === 8) {
        if (Branch === 9) Blood = '血支'
        else if (Branch === 11) Blood = '血忌'
        else if (Branch === 6 && k <= 10) Lin = 1
    } else if (i === 9) {
        if (Branch === 10) Blood = '血支'
        else if (Branch === 6) Blood = '血忌'
        else if (Branch === 3 && k <= 10) Lin = 1
    } else if (i === 10) {
        if (Branch === 11) Blood = '血支'
        else if (Branch === 12) Blood = '血忌'
        else if (Branch === 8 && k <= 10) Lin = 1
    } else if (i === 11) {
        if (Branch === 12) Blood = '血支'
        else if (Branch === 7) Blood = '血忌'
        else if (Branch === 5 && k <= 10) Lin = 1
    } else if (i === 12) {
        if (Branch === 1) Blood = '血支血忌'
        else if (Branch === 10 && k <= 10) Lin = 1
    }
    return {
        Blood,
        Lin: (Lin ? '臨日' : '')
    }
}

// 日遊神
export const TouringGodConvert = ScOrder => {
    let TouringGod = ''
    if (ScOrder % 10 === 5 || ScOrder % 10 === 6) TouringGod = '房內中'
    else if (ScOrder >= 30 && ScOrder <= 34) TouringGod = '房內北'
    else if (ScOrder >= 37 && ScOrder <= 39) TouringGod = '房內南'
    else if (ScOrder === 40) TouringGod = '房內西'
    else if (ScOrder >= 41 && ScOrder <= 44) TouringGod = '房內東'
    return TouringGod
}