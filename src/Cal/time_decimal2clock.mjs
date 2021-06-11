import { Bind } from './bind.mjs'
import {
    BranchList, HalfList, StemList, QuarList, TwelveList, TwelveListHuangji, TwelveListWuyin, TwentyfourList, FourList, big, nzh,
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
    const { Type } = Bind(CalName)
    Deci = big(Deci)
    const Portion = big.div(100, 12)
    if (CalName === 'Easthan' || Type >= 5) {
        Deci = Deci.add(100 / 24).mod(100)
    }
    let ClockOrder = (Deci.div(Portion)).floor().toNumber()
    const ClockFrac = Deci.sub(big(ClockOrder).mul(Portion))
    const Twelve = ((big.div(ClockFrac, Portion)).mul(12)).floor().toNumber()
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
    let Portion1 = 0
    let Portion2 = 0
    if (Mode === 96) {
        Portion1 = 0.96
        Portion2 = 8
    } else if (Mode === 108) {
        Portion1 = 1.08
        Portion2 = 9
    } else if (Mode === 120) {
        Portion1 = 1.2
        Portion2 = 10
    }
    const KeRaw = Deci * Portion1
    const ClockOrder = ~~(KeRaw / Portion2)
    const QuarOrder = ~~(KeRaw - ClockOrder * Portion2)
    // const MinOrder = ~~((KeRaw - ~~KeRaw) * 100)
    return BranchList[ClockOrder + 1] + '時' + QuarList[QuarOrder % 8] + '刻' // + nzh.encodeS(MinOrder) +'分'
}

const Clock24 = Deci => {
    const Portion = 100 / 24
    let ClockOrder = ~~(Deci / Portion)
    const ClockFrac = Deci - ClockOrder * Portion
    const Twelve = ~~(ClockFrac / Portion * 12)
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

const ClockSong = Deci => { // 皇祐之後、元、明。四刻是1/6。1刻60分，1分=14.4s
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
    const MinOrder = ~~((KeRaw - (ClockOrder * (100 / 12) + HalfOrder * (4 + 1 / 6) + QuarOrder)) * 60)
    return BranchList[ClockOrder + 1] + HalfList[HalfOrder] + '' + QuarList[QuarOrder] + '刻' + nzh.encodeS(MinOrder) + '分'
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
    const { Type } = Bind(CalName)
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

const ClockNameList = {
    Easthan: '後漢四分曆',
    Yuanjia: '魏晉南北',
    WuyinA: '戊寅曆',
    Huangji: '皇極曆',
    Dayan: '唐北宋前期',
    Mingtian: '南宋元明'
}

export const BindClock1 = Deci => {
    Deci = +('0.' + Deci)
    let Print = [{
        title: '現代',
        data: ClockWest(Deci)
    }]
    Deci *= 100 + 1e-12
    Print = Print.concat(
        ['Yuanjia', 'WuyinA', 'Easthan', 'Huangji', 'Dayan', 'Mingtian'].map(title => {
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
        title: '南北朝方位制',
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

export const Clock2Deci = Clock => {
    const ARaw = Clock[0]
    const BRaw = Clock[1]
    const CRaw = Clock[2]
    const A = BranchList.indexOf(ARaw)
    const B = HalfList.indexOf(BRaw)
    const C = QuarList.indexOf(CRaw)
    let Start = (A - 1) / 12 + B / 24 + C / 100 - 1 / 24
    const End = ((Start + (C === 4 ? 0.01 / 6 : 0.01) + 1) % 1).toFixed(6)
    Start = ((Start + 1) % 1).toFixed(6)
    let Print = [{
        title: ClockNameList['Mingtian'],
        data: `${Start} — ${End}`
    }]
    return Print
}

// console.log(Clock2DeciSong('子初四刻'))

const GengList = '初二三四五'

export const BindNightClock = (DeciRaw, Rise, LightRange) => {
    DeciRaw = +('0.' + DeciRaw)
    Rise = +('0.' + Rise)
    LightRange = +LightRange / 100
    const Dawn = Rise - LightRange
    const Dusk = 1 - Rise + LightRange
    if (DeciRaw > Dawn && DeciRaw < Dusk) {
        throw (new Error('請輸入夜中時刻'))
    }
    const Night = 2 * (Rise - LightRange)
    if (DeciRaw < Dawn) {
        DeciRaw += 1
    }
    DeciRaw -= Dusk
    const GengRange = Night / 5
    const ChouRange = Night / 25
    let Geng = 0
    for (let i = 0; i <= 4; i++) {
        if (DeciRaw >= i * GengRange && DeciRaw < (i + 1) * GengRange) {
            Geng = i
            break
        }
    }
    const GengName1 = StemList[Geng + 1] + '夜'
    const GengName2 = GengList[Geng] + '更'
    const Deci1 = DeciRaw % GengRange
    let Chou = 0
    for (let i = 1; i <= 5; i++) {
        if (Deci1 >= (i - 1) * ChouRange && Deci1 < i * ChouRange) {
            Chou = i
            break
        }
    }
    let ChouName1 = ''
    let Print1 = ''
    if (Chou === 1) {
        ChouName1 = StemList[Geng + 1] + '辰刻'
        Print1 = ChouName1
    } else {
        ChouName1 = QuarList[Chou - 1] + '籌'
        Print1 = GengName1 + ChouName1
    }
    const ChouName2 = QuarList[Chou] + '點'
    let Print = [{
        title: '麟德曆',
        data: Print1
    }]
    Print = Print.concat({
        title: '大統曆',
        data: GengName2 + ChouName2
    })
    const GengRange3 = Night / 5 - 0.02
    const ChouRange3 = Night / 25
    let Geng3 = 0
    for (let i = 0; i <= 4; i++) {
        if (DeciRaw >= i * GengRange3 && DeciRaw < (i + 1) * GengRange3) {
            Geng3 = i
            break
        }
    }
    const Deci3 = DeciRaw % GengRange3
    let Chou3 = 0
    for (let i = 1; i <= 5; i++) {
        if (Deci3 >= (i - 1) * ChouRange3 && Deci3 < i * ChouRange3) {
            Chou3 = i
            break
        }
    }
    let Print3 = ''
    if (DeciRaw + Dusk < 0.9 + Dawn) {
        const GengName3 = GengList[Geng3] + '更'
        const ChouName3 = QuarList[Chou3] + '點'
        Print3 = GengName3 + ChouName3
    }
    Print = Print.concat({
        title: '宋內中更點',
        data: Print3
    })
    return Print
}

export const Deci2Stage = Deci => {
    let Order12 = ~~Deci
    const Order4 = Order12
    let Order4B = Order12
    const Frac = Deci - Order4
    const Twelve = ~~(Frac * 12)
    const Four = ~~(Frac * 4)
    const FourB = ~~((Frac + 0.125) * 4)
    if (Twelve === 11) {
        Order12++
    }
    if (FourB === 4) {
        Order4B++
    }
    let Print = [{
        title: '十二段',
        data: `${Order12} 度${TwelveList[Twelve]}`
    }]
    Print = Print.concat({
        title: '三段A',
        data: `${Order4} 度${FourList[Four]}`
    })
    Print = Print.concat({
        title: '三段B',
        data: `${Order4B} 度${FourList[FourB]}`
    })
    return Print
}
// console.log(Deci2Stage(1.65))
