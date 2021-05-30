import {
    Bind,
} from './bind.mjs'
import {
    BranchList, HalfList, QuarList, TwelveList, TwelveListHuangji, TwelveListWuyin, TwentyfourList, ClockNameList, big, nzh
} from './para_constant.mjs'

const ClockWest = Deci => {
    let h = ~~(Deci * 24)
    let m = ~~((Deci - h / 24) * 24 * 60)
    let s = ~~((Deci - h / 24 - m / 24 / 60) * 86400)
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
const ClockWeijin = (Deci, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    Deci = big(Deci)
    const portion = big.div(100, 12)
    if (CalName === 'Easthan' || Type >= 5) {
        Deci = Deci.add(100 / 24).mod(100)
    }
    let ClockOrder = (Deci.div(portion)).floor().toNumber()
    const ClockFrac = Deci.sub(big(ClockOrder).mul(portion))
    const Twelve = ((big.div(ClockFrac, portion)).mul(12)).floor().toNumber()
    if (Twelve === 11 && CalName !== 'WuyinA') {
        ClockOrder++
    }
    let TwelveName = ''
    if (Type <= 4) {
        TwelveName = TwelveList[Twelve]
    } else if (CalName === 'Huangji') {
        TwelveName = TwelveListHuangji[Twelve]
    } else if (CalName === 'WuyinA') { // 戊寅交食加時。滕艳辉等:《戊寅元历》的日月食推算方法
        TwelveName = TwelveListWuyin[Twelve]
    }
    return BranchList[ClockOrder + 1] + '時' + TwelveName
}

const ClockTmp = (Deci, Mode) => { // 我假設：每日96刻，子初夜半，每刻100分
    let portion1 = 0
    let portion2 = 0
    if (Mode === 96) {
        portion1 = 0.96
        portion2 = 8
    } else if (Mode === 108) {
        portion1 = 1.08
        portion2 = 9
    } else if (Mode === 120) {
        portion1 = 1.2
        portion2 = 10
    }
    const KeRaw = Deci * portion1
    const ClockOrder = ~~(KeRaw / portion2)
    const QuarOrder = ~~(KeRaw - ClockOrder * portion2)
    // const MinOrder = ~~((KeRaw - ~~KeRaw) * 100)
    return BranchList[ClockOrder + 1] + '時' + QuarList[QuarOrder % 8] + '刻' // + nzh.encodeS(MinOrder) +'分'
}

const Clock24 = Deci => {
    const portion = 100 / 24
    let ClockOrder = ~~(Deci / portion)
    const ClockFrac = Deci - ClockOrder * portion
    const Twelve = ~~(ClockFrac / portion * 12)
    if (Twelve === 11) {
        ClockOrder++
    }
    return TwentyfourList[ClockOrder] + '時' + TwelveList[Twelve]
}

const ClockTang = Deci => { // 唐、宋皇祐之前。1/3刻放在時辰最後，可能是初或正兩種情況
    const KeRaw = (Deci + 100 / 24) % 100 // 夜半子半 
    let ClockOrder = ~~(KeRaw / (100 / 12))
    const HalfRaw = KeRaw - (ClockOrder * (100 / 12))
    let QuarOrder = 0
    for (let i = 1; i <= 9; i++) {
        if (HalfRaw >= i - 1 && HalfRaw < i) {
            QuarOrder = i - 1
        }
    }
    return BranchList[ClockOrder + 1] + '時' + QuarList[QuarOrder] + '刻'
}

const ClockSong = Deci => { // 皇祐之後、元、明。（之前假設初刻是1/6，也就是2.4分鐘。）四刻是1/6。 1刻60分，1分=14.4s
    const KeRaw = (Deci + 100 / 24) % 100 // 夜半子半 
    let ClockOrder = ~~(KeRaw / (100 / 12))
    const HalfOrder = ~~((KeRaw - ClockOrder * (100 / 12)) / (4 + 1 / 6))
    let HalfRaw = KeRaw - (ClockOrder * (100 / 12) + HalfOrder * (4 + 1 / 6))
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
    // const MinOrder = ~~((KeRaw - (ClockOrder * (100 / 12) + HalfOrder * (4 + 1 / 6) + QuarOrder)) * 60)
    return BranchList[ClockOrder + 1] + HalfList[HalfOrder] + '' + QuarList[QuarOrder] + '刻' // + nzh.encodeS(MinOrder) +'分'
}

const ClockQing = Deci => { // 清代96刻
    Deci += 100 / 24 // 夜半子半
    const KeRaw = Deci * 0.96
    const KeOrder = ~~KeRaw
    const ClockOrder = ~~(KeRaw / 8)
    const HalfOrder = ~~((KeOrder - ClockOrder * 8) / 4)
    const QuarOrder = KeOrder - (ClockOrder * 8 + HalfOrder * 4)
    const MinOrder = ~~((KeRaw - ~~(KeRaw)) * 15) % 15
    return BranchList[ClockOrder + 1] + HalfList[HalfOrder % 2] + '' + QuarList[QuarOrder] + '刻' + nzh.encodeS(MinOrder) + '分'
}

export const AutoClock = (Deci, CalName) => {
    const {
        Type,
    } = Bind(CalName)
    let Print = ''
    if (Type <= 6 && !['LindeA', 'LindeB'].includes(CalName)) {
        Print = ClockWeijin(Deci, CalName)
    } else if (Type === 7 || ['Futian', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian'].includes(CalName)) { // 因為宋志皇祐渾儀排在明天之後觀天之前
        Print = ClockTang(Deci)
    } else if (Type >= 8) {
        Print = ClockSong(Deci)
    }
    return Print
}

export const BindClock1 = Deci => {
    Deci = +('0.' + Deci)
    let Print = [{
        title: '現代',
        data: ClockWest(Deci)
    }]
    Deci *= 100 + 1e-12
    Print = Print.concat(
        ['Easthan', 'Yuanjia', 'WuyinA', 'Huangji', 'Dayan', 'Mingtian'].map(title => {
            return {
                title: ClockNameList[title],
                data: AutoClock(Deci, title)
            }
        }))
    Print = Print.concat({
        title: '清',
        data: ClockQing(Deci)
    })
    Print = Print.concat({
        title: '24小時',
        data: Clock24(Deci)
    })
    Print = Print.concat({
        title: '96刻',
        data: ClockTmp(Deci, 96)
    })
    Print = Print.concat({
        title: '108刻',
        data: ClockTmp(Deci, 108)
    })
    Print = Print.concat({
        title: '120刻',
        data: ClockTmp(Deci, 120)
    })
    return Print
}
// console.log(BindClock1('5')) // 128  9584  9999
