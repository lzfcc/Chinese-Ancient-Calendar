import {
    BranchList,
    HalfList,
    QuarList,
    TwelveList,
    TwelveList1,
    big,
    nzh
} from './para_constant.mjs'

const ClockWest = Daydecimal => {
    let h = Math.floor(Daydecimal * 24)
    let m = Math.floor((Daydecimal - h / 24) * 24 * 60)
    let s = Math.floor((Daydecimal - h / 24 - m / 24 / 60) * 86400)
    h = h.toString()
    m = m.toString()
    s = s.toString()
    if (h.length < 2) {
        h = '0' + h
    }
    if (m.length < 2) {
        m = '0' + m
    }
    if (s.length < 2) {
        s = '0' + s
    }
    const Print = h + 'h ' + m + 'm ' + s + 's'
    return Print
}

const ClockJingchu = Daydecimal => { // 劉洪濤頁219
    Daydecimal = big(Daydecimal)
    const portion = big.div(100, 12)
    let ClockOrder = (Daydecimal.div(portion)).ceil().toNumber()
    const ClockName = BranchList[ClockOrder]
    const ClockFrac = Daydecimal.sub(big(ClockOrder - 1).mul(portion))
    const Twelve = ((big.div(ClockFrac, portion)).mul(12)).floor().toNumber()
    if (Twelve === 11) {
        ClockOrder += 1
    }
    const TwelveName = TwelveList[Twelve]
    return ClockName + '時 ' + TwelveName
}

// 跟上面唯一的不同是用子半
const ClockTang = Daydecimal => {
    const portion = big.div(100, 12)
    Daydecimal = big(Daydecimal).add(portion).mod(100)
    let ClockOrder = (Daydecimal.div(portion)).ceil().toNumber()
    const ClockName = BranchList[ClockOrder]
    const ClockFrac = Daydecimal.sub(big(ClockOrder - 1).mul(portion))
    const Twelve = ((big.div(ClockFrac, portion)).mul(12)).floor().toNumber()
    if (Twelve === 11) {
        ClockOrder += 1
    }
    const TwelveName = TwelveList[Twelve]
    return ClockName + '時 ' + TwelveName
}

// 戊寅交食加時。滕艳辉等:《戊寅元历》的日月食推算方法
const ClockWuyin = Daydecimal => {
    const portion = big.div(100, 12)
    Daydecimal = big(Daydecimal).add(portion).mod(100)
    let ClockOrder = (Daydecimal.div(portion)).ceil().toNumber()
    const ClockName = BranchList[ClockOrder]
    const ClockFrac = Daydecimal.sub(big(ClockOrder - 1).mul(portion))
    const Twelve = ((big.div(ClockFrac, portion)).mul(12)).floor().toNumber()
    const TwelveName = TwelveList1[Twelve]
    return ClockName + '時 ' + TwelveName
}

const Clock96 = Daydecimal => { // 我假設：每日96刻，子初夜半，每刻100分
    const KeRaw = Daydecimal * 0.96
    const ClockOrder = Math.ceil(KeRaw / 8)
    const ClockName = BranchList[ClockOrder]
    const QuarOrder = Math.floor(KeRaw - (ClockOrder - 1) * 8)
    const MinOrder = Math.floor((KeRaw - Math.floor(KeRaw)) * 100)
    return ClockName + '時 ' + QuarList[QuarOrder % 8] + '刻 ' + nzh.encodeS(MinOrder) + '分'
}

const Clock108 = Daydecimal => { // 我假設：每日108刻，子初夜半，每刻100分
    const KeRaw = Daydecimal * 1.08
    const ClockOrder = Math.ceil(KeRaw / 9)
    const ClockName = BranchList[ClockOrder]
    const QuarOrder = Math.floor(KeRaw - (ClockOrder - 1) * 9)
    const MinOrder = Math.floor((KeRaw - Math.floor(KeRaw)) * 100)
    return ClockName + '時 ' + QuarList[QuarOrder % 9] + '刻 ' + nzh.encodeS(MinOrder) + '分'
}

const Clock120 = Daydecimal => { // 我假設：每日96刻，子初夜半，每刻100分
    const KeRaw = Daydecimal * 1.2
    const ClockOrder = Math.ceil(KeRaw / 10)
    const ClockName = BranchList[ClockOrder]
    const QuarOrder = Math.floor(KeRaw - (ClockOrder - 1) * 10)
    const MinOrder = Math.floor((KeRaw - Math.floor(KeRaw)) * 100)
    return ClockName + '時 ' + QuarList[QuarOrder % 10] + '刻 ' + nzh.encodeS(MinOrder) + '分'
}

const ClockSong = Daydecimal => { // 宋元明。（之前假設初刻是1/6，也就是2.4分鐘。）四刻是1/6。 1刻60分，1分=14.4s
    const KeRaw = (Daydecimal + 100 / 24) % 100 // 夜半子半 
    let ClockOrder = Math.ceil(KeRaw / (100 / 12))
    if (Daydecimal === 0) {
        ClockOrder = 1
    }
    const ClockName = BranchList[ClockOrder]
    const HalfOrder = Math.floor((KeRaw - (ClockOrder - 1) * (100 / 12)) / (4 + 1 / 6))
    const HalfName = HalfList[HalfOrder] // 初0正1
    let HalfRaw = KeRaw - ((ClockOrder - 1) * (100 / 12) + HalfOrder * (4 + 1 / 6))
    let QuarOrder = 0
    if (HalfRaw < 1) {} else if (HalfRaw < 2) {
        QuarOrder = 1
    } else if (HalfRaw < 3) {
        QuarOrder = 2
    } else if (HalfRaw < 4) {
        QuarOrder = 3
    } else {
        QuarOrder = 4
    }
    const QuarName = QuarList[QuarOrder]
    const MinOrder = Math.floor((KeRaw - ((ClockOrder - 1) * (100 / 12) + HalfOrder * (4 + 1 / 6) + QuarOrder)) * 60)
    return ClockName + HalfName + ' ' + QuarName + '刻 ' + nzh.encodeS(MinOrder) + '分'
}

const ClockQing = Daydecimal => { // 清
    Daydecimal += 100 / 24 // 夜半子半
    const KeRaw = Daydecimal * 0.96
    const KeOrder = Math.floor(KeRaw) // 清代96刻
    const ClockOrder = Math.round(Math.ceil(KeRaw / 8) % 12.1)
    const ClockName = BranchList[ClockOrder]
    const HalfOrder = Math.floor((KeOrder - (ClockOrder - 1) * 8) / 4)
    const HalfName = HalfList[HalfOrder % 2]
    const QuarOrder = KeOrder - ((ClockOrder - 1) * 8 + HalfOrder * 4)
    const QuarName = QuarList[QuarOrder]
    const MinOrder = Math.floor((KeRaw - Math.floor(KeRaw)) * 15) % 15
    return ClockName + HalfName + ' ' + QuarName + '刻 ' + nzh.encodeS(MinOrder) + '分'
}

export const Clock = Daydecimal => {
    Daydecimal = '0.' + Daydecimal
    Daydecimal = Number(Daydecimal)
    const West = ClockWest(Daydecimal)
    Daydecimal *= 100
    Daydecimal += 0.000000000001
    const Jingchu = ClockJingchu(Daydecimal)
    const Wuyin = ClockWuyin(Daydecimal)
    const Tang = ClockTang(Daydecimal)
    const C96 = Clock96(Daydecimal)
    const C108 = Clock108(Daydecimal)
    const C120 = Clock120(Daydecimal)
    const Song = ClockSong(Daydecimal)
    const Qing = ClockQing(Daydecimal)
    return '【現代】' + West + `\n` + '【120刻】' + C120 + `\n` + '【108刻】' + C108 + `\n` + '【96刻】' + C96 + `\n` + '【漢魏晉】' + Jingchu + `\n` + '【戊寅】' + Wuyin + `\n` + '【隋唐】' + Tang + `\n` + '【宋至明】' + Song + `\n` + '【清】' + Qing
}
// console.log(Clock('5')) // 128  9584  9999
export const Clock1 = (h, m, s) => {
    let Daydecimal = big(h).div(24).add(big(m).div(1440)).add(big(s).div(86400)).toNumber()
    Daydecimal *= 100
    Daydecimal += 0.000000000001
    const Jingchu = ClockJingchu(Daydecimal)
    const Wuyin = ClockWuyin(Daydecimal)
    const Tang = ClockTang(Daydecimal)
    const C96 = Clock96(Daydecimal)
    const C108 = Clock108(Daydecimal)
    const C120 = Clock120(Daydecimal)
    const Song = ClockSong(Daydecimal)
    const Qing = ClockQing(Daydecimal)
    return '【刻】' + Daydecimal.toFixed(4) + `\n` + '【120刻】' + C120 + `\n` + '【108刻】' + C108 + `\n` + '【96刻】' + C96 + `\n` + '【漢魏晉】' + Jingchu + `\n` + '【戊寅】' + Wuyin + `\n` + '【隋唐】' + Tang + `\n` + '【宋至明】' + Song + `\n` + '【清】' + Qing
}

// 随着二十四时制在唐代退出天象纪录后，每辰的“十二小分”制也被百刻制取代了。“刻”是计量单位，必须与某一时刻点并用，才能表示钟点。十二辰的起点、正中点都是固定的，用圭表和日晷可以校核“午正”，与百刻制结合，可从每辰的起点或正中点开始顺序纪录流逝的刻数。
// 由于百刻不能被十二整除，难以结合在一起，所以曾有过三种解决方式：
// 一是改一昼夜的总刻数，有过120刻、96刻、108刻三种方式；二是十二时辰不等份，例如寅申巳亥四时各9刻，其余八时各8刻，总数100刻；三是每刻的分数采用3或6的倍数，通行最广的是每刻60分制。十二辰分百刻，每刻60分，每辰占8刻20分，时初、时正各占4刻10分。于是又出现了大刻60分，小刻10分，两种名称。
// 明末西方的“时分秒”制传入中国，到清初定位官方制度，每天二十四小时，共96刻，每时60分，或4刻，每刻15分，每分60秒。清代历书预报的食日，见于《续清朝文献通考》，都是用西方制度。十二辰的古名，也按半辰法同时分秒制结合在一起。
// 中国古代纪时制度 - 寒萧的文章 - 知乎
// https://zhuanlan.zhihu.com/p/125466047

// 《宋史‧律曆志》：「每時初行一刻至四刻六分之一為時正，終八刻六分之二則交次時。」0——4 1/6——8 2/6