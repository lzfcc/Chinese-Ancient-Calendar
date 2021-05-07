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
    if (HalfRaw < 1) { } else if (HalfRaw < 2) {
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
    const Result = []
    Result.push({
        title: '現代',
        data: West
    })
    Result.push({
        title: '120刻',
        data: C120
    })
    Result.push({
        title: '108刻',
        data: C108
    })
    Result.push({
        title: '96刻',
        data: C96
    })
    Result.push({
        title: '漢魏晉',
        data: Jingchu
    })
    Result.push({
        title: '戊寅曆',
        data: Wuyin
    })
    Result.push({
        title: '隋唐',
        data: Tang
    })
    Result.push({
        title: '宋至明',
        data: Song
    })
    Result.push({
        title: '清',
        data: Qing
    })
    return Result
}
// console.log(Clock('5')) // 128  9584  9999

export const Clock1 = (h, m, s) => {
    h = parseInt(h)
    m = parseInt(m)
    s = Number(s)
    if (h > 23 || m > 59 || s >= 60) {
        throw (new Error('invalid value!'))
    }
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
    const Result = []
    Result.push({
        title: '刻',
        data: Daydecimal.toFixed(4)
    })
    Result.push({
        title: '120刻',
        data: C120
    })
    Result.push({
        title: '108刻',
        data: C108
    })
    Result.push({
        title: '96刻',
        data: C96
    })
    Result.push({
        title: '漢魏晉',
        data: Jingchu
    })
    Result.push({
        title: '戊寅曆',
        data: Wuyin
    })
    Result.push({
        title: '隋唐',
        data: Tang
    })
    Result.push({
        title: '宋至明',
        data: Song
    })
    Result.push({
        title: '清',
        data: Qing
    })
    return Result
}
