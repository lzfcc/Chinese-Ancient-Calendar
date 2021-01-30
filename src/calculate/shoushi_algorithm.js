const {
    SClist,
    CalendarName
} = require('./constant') // 賦值解構
const Parameters = require('./shoushi_para')

function CalShoushi(ShouPre, year) {
    const {
        SolarRaw,
        lunar,
        AnomaLunar,
        WsolsticeConst,
        LeapConst,
        AnomaMonConst,
        XianConst,
        ExDingDif,
        ExPingDif,
        ExLiDif,
        ConDingDif,
        ConPingDif,
        ConLiDif,
        FaSlowDingDif,
        FaSlowPingDif,
        FaSlowLiDif,
        FirstMonNum,
    } = Parameters[ShouPre]

    const OriginYear = year - 1281 // 距元

    let solar = 0
    if (ShouPre == 'Shoushi') {
        if (OriginYear >= 0) {
            solar = SolarRaw - (Math.floor(OriginYear / 100)) / 10000 // 歲實消長
        } else {
            solar = SolarRaw - (Math.ceil(OriginYear / 100)) / 10000
        }
    } else if (ShouPre == 'ShouAcr') {
        solar = SolarRaw - OriginYear * 0.00000006162
    }

    const TermLeng = solar / 12 // 每個中氣相隔的日數
    const MonLeap = TermLeng - lunar // 月閏
    const LeapStd = parseFloat((13 * lunar - solar).toPrecision(12)) // 閏準 18.6528

    /**
     *
     * @param {number} PrevThisNext -1 last year 1 current year 0 next year
     */
    const PlusFunctionMinusT = (PrevThisNext) => {
        const AccumZhong = (OriginYear + PrevThisNext) * solar // 中積
        const result = {}
        result.First = FirstSyzygy(1, AccumZhong)
        if (PrevThisNext == 0) {
            result.Syzygy = FirstSyzygy(0, AccumZhong)
        }
        return result
    }

    /**
     * 计算朔望
     * @param {number} syzygy 0 shuo 1 wang
     * @param {number} AccumZhong
     */
    const FirstSyzygy = (syzygy, AccumZhong) => {
        const AccumTong = AccumZhong + WsolsticeConst // 通積：該年冬至積日
        const AccumLeap = AccumZhong + LeapConst // 閏積
        const LeapSurAvg = parseFloat(((AccumLeap % lunar + lunar) % lunar).toPrecision(12)) // 閏餘、冬至月齡
        const ifLeapAvg = LeapSurAvg >= LeapStd ? 1 : 0 // 經朔是否有閏月
        const AvgRaw = []
        const Decimal = []
        const AnomaAccum = []
        const AnomaXian = []
        const ExConS = []
        const FaSlowS = []
        const FaSlowV = []
        const PlusMinusT = []
        const AcrRaw = []
        const AcrMod = []
        const OrderRaw = []
        const OrderMod = []
        const SC = []
        const HalfSolar = solar / 2 // 半歲實
        const HalfAnoma = AnomaLunar / 2 // 轉中
        let LeapSurAcr = 0
        for (let i = 1; i <= 13; i++) {
            AvgRaw[i] = AccumTong - LeapSurAvg + (i - (syzygy ? 1 : 0.5) + FirstMonNum) * lunar // 經朔望
            const WsolsticeAccum = ((i - (syzygy ? 1 : 0.5) + FirstMonNum) * lunar - LeapSurAvg + solar) % solar // 各月朔入冬至的積日
            if (WsolsticeAccum <= 88.909225) {
                const ExConT = WsolsticeAccum
                ExConS[i] = (ExDingDif * ExConT - ExPingDif * (ExConT ** 2) - ExLiDif * (ExConT ** 3)) / 10000 // 盈縮差
            } else if (WsolsticeAccum <= HalfSolar) {
                const ExConT = HalfSolar - WsolsticeAccum
                ExConS[i] = (ConDingDif * ExConT - ConPingDif * (ExConT ** 2) - ConLiDif * (ExConT ** 3)) / 10000
            } else if (WsolsticeAccum <= HalfSolar + 93.712025) {
                const ExConT = WsolsticeAccum - HalfSolar
                ExConS[i] = -(ConDingDif * ExConT - ConPingDif * (ExConT ** 2) - ConLiDif * (ExConT ** 3)) / 10000
            } else {
                const ExConT = solar - WsolsticeAccum
                ExConS[i] = -(ExDingDif * ExConT - ExPingDif * (ExConT ** 2) - ExLiDif * (ExConT ** 3)) / 10000
            }

            AnomaAccum[i] = ((AnomaMonConst + AccumZhong - LeapSurAvg + (i - (syzygy ? 1 : 0.5) + FirstMonNum) * lunar) % AnomaLunar + AnomaLunar) % AnomaLunar // 入轉日分
            let sign = 1
            let FaSlowT = 0
            if (AnomaAccum[i] <= 6.888) {
                FaSlowT = AnomaAccum[i] / XianConst
                sign = -1
            } else if (AnomaAccum[i] <= 13.7773) {
                FaSlowT = (HalfAnoma - AnomaAccum[i]) / XianConst
                sign = -1
            } else if (AnomaAccum[i] <= 20.6653) {
                FaSlowT = (AnomaAccum[i] - HalfAnoma) / XianConst
                sign = 1
            } else {
                FaSlowT = (AnomaLunar - AnomaAccum[i]) / XianConst
                sign = 1
            }
            FaSlowS[i] = sign * (FaSlowDingDif * FaSlowT - FaSlowPingDif * FaSlowT ** 2 - FaSlowLiDif * FaSlowT ** 3) / 100

            if (AnomaAccum[i] <= 6.642) {
                AnomaXian[i] = AnomaAccum[i] / XianConst
                sign = 1
            } else if (AnomaAccum[i] <= 7.052) {
                AnomaXian[i] = AnomaAccum[i] / XianConst
                sign = 0
            } else if (AnomaAccum[i] <= 20.4193) {
                AnomaXian[i] = Math.abs(HalfAnoma - AnomaAccum[i]) / XianConst
                sign = -1
            } else if (AnomaAccum[i] <= 20.8293) {
                AnomaXian[i] = Math.abs(HalfAnoma - AnomaAccum[i]) / XianConst
                sign = 0
            } else {
                AnomaXian[i] = (AnomaLunar - AnomaAccum[i]) / XianConst
                sign = 1
            }
            FaSlowV[i] = 1.0962 + sign * (0.11081575 - 0.0005815 * AnomaXian[i] - 0.00000975 * AnomaXian[i] * (AnomaXian[i] - 1))
            PlusMinusT[i] = (ExConS[i] + FaSlowS[i]) * XianConst / FaSlowV[i]
            AcrRaw[i] = parseFloat(((AvgRaw[i] + PlusMinusT[i])).toPrecision(12))
            AcrMod[i] = (AcrRaw[i] % 60 + 60) % 60
            OrderRaw[i] = Math.floor(AcrRaw[i])
            OrderMod[i] = Math.floor(AcrMod[i])
            Decimal[i] = ((AcrMod[i] - OrderMod[i]).toFixed(4)).slice(2, 6)
            SC[i] = SClist[OrderMod[i] + 1]
            LeapSurAcr = parseFloat(((LeapSurAvg - PlusMinusT[1] + lunar) % lunar).toPrecision(12))
        }
        return {
            LeapSurAvg,
            LeapSurAcr,
            PlusMinusT,
            SC,
            Decimal,
            OrderRaw
        }
    }

    const AccumZhongThis = OriginYear * solar // 中積
    const AccumZhongPrev = (OriginYear - 1) * solar
    const AccumZhongNext = (OriginYear + 1) * solar
    const AccumTongThis = AccumZhongThis + WsolsticeConst // 通積：該年冬至積日
    const AccumLeapThis = AccumZhongThis + LeapConst // 閏積
    const AccumLeapPrev = AccumZhongPrev + LeapConst
    const AccumLeapNext = AccumZhongNext + LeapConst
    const LeapSurAvgThis = parseFloat(((AccumLeapThis % lunar + lunar) % lunar).toPrecision(12)) // 閏餘、冬至月齡
    const ifLeapAvgThis = LeapSurAvgThis >= LeapStd ? 1 : 0 // 經朔是否有閏月
    const LeapSurAvgPrev = parseFloat(((AccumLeapPrev % lunar + lunar) % lunar).toPrecision(12))
    const ifLeapAvgPrev = LeapSurAvgPrev >= LeapStd ? 1 : 0
    const LeapSurAvgNext = parseFloat(((AccumLeapNext % lunar + lunar) % lunar).toPrecision(12))
    const ifLeapAvgNext = LeapSurAvgNext >= LeapStd ? 1 : 0

    const PlusMinusThis = PlusFunctionMinusT(0)

    const LeapSurAcrThis = parseFloat(((LeapSurAvgThis - PlusMinusThis.First.PlusMinusT[1] + lunar) % lunar).toPrecision(12))
    let ifLeapAcrThis = LeapSurAcrThis >= LeapStd ? 1 : 0 // 是否有閏月
    const LeapNumAcrThis = ifLeapAcrThis > 0 ? Math.ceil((lunar - LeapSurAcrThis) / MonLeap) : 0 // 閏月數

    const PlusMinusPrev = PlusFunctionMinusT(-1)
    const LeapSurAcrPrev = parseFloat(((LeapSurAvgPrev - PlusMinusPrev.First.PlusMinusT[1] + lunar) % lunar).toPrecision(12))
    const ifLeapAcrPrev = LeapSurAcrPrev >= LeapStd ? 1 : 0

    const PlusMinusNext = PlusFunctionMinusT(1)
    const LeapSurAcrNext = parseFloat(((LeapSurAvgNext - PlusMinusNext.First.PlusMinusT[1] + lunar) % lunar).toPrecision(12))

    let LeapNumTerm = LeapNumAcrThis
    if ((!ifLeapAcrThis && LeapSurAcrThis > LeapStd - MonLeap) && (!ifLeapAvgThis && LeapSurAvgThis > LeapStd - MonLeap) && (!ifLeapAcrNext && LeapSurAcrNext < MonLeap) && (ifLeapAvgNext && LeapSurAvgNext > lunar - MonLeap)) {
        ifLeapAcrThis = 1
        LeapNumTerm = 12
    } else if ((ifLeapAcrPrev && LeapSurAcrPrev < LeapStd + MonLeap) && (!ifLeapAvgPrev && LeapSurAvgPrev > LeapStd - MonLeap) && (ifLeapAcrThis && LeapSurAcrThis > lunar - MonLeap) && (ifLeapAvgThis && LeapSurAvgThis > lunar - MonLeap)) {
        ifLeapAcrThis = 0
        LeapNumTerm = 0
    } // // 分別解決1327—1328、1327—1328的極端情況
    const ifLeapAdvanceStartThis = !ifLeapAcrThis && ifLeapAvgThis // 這兩行解決經閏餘和定閏餘在閏準臨界值上下時，置閏前後相差一年的特殊與極特殊情況
    const ifLeapAdvanceEndThis = ifLeapAcrThis || ifLeapAvgThis
    const TermAvgRaw = []
    const TermAvgMod = []
    const TermOrderMod = []
    const TermSC = []
    const TermDecimal = []
    const FirstOrderRaw = PlusMinusThis.First.OrderRaw
    // 中氣
    for (let i = 1; i <= 12; i++) {
        TermAvgRaw[i] = AccumTongThis + (i - 1 + FirstMonNum) * TermLeng
        TermAvgMod[i] = parseFloat(((TermAvgRaw[i] % 60 + 60) % 60).toPrecision(12))
        TermOrderMod[i] = Math.floor(TermAvgMod[i])
        TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)

        TermSC[i] = SClist[TermOrderMod[i] + 1]
    }

    if (ifLeapAcrThis) {
        while (LeapNumTerm >= 2 && (TermAvgRaw[LeapNumTerm] >= FirstOrderRaw[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < FirstOrderRaw[LeapNumTerm + 1] + 2)) {
            LeapNumTerm -= 1
        }
        while (LeapNumTerm <= 11 && (TermAvgRaw[LeapNumTerm + 1] < FirstOrderRaw[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= FirstOrderRaw[LeapNumTerm + 2] - 2)) {
            LeapNumTerm += 1
        }
        for (let i = 1; i <= 13; i++) {
            if (i <= LeapNumTerm) {
                TermAvgMod[i] = ((AccumTongThis + (i - 1 + FirstMonNum) * TermLeng) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                TermSC[i] = SClist[TermOrderMod[i] + 1]
            } else if (i == LeapNumTerm + 1) {
                TermOrderMod[i] = 62
                TermDecimal[i] = '□□'
                TermSC[i] = SClist[TermOrderMod[i]]
            } else if (i > LeapNumTerm + 1) {
                TermAvgMod[i] = ((AccumTongThis + (i - 2 + FirstMonNum) * TermLeng) % 60 + 60) % 60
                TermOrderMod[i] = Math.floor(TermAvgMod[i])
                TermDecimal[i] = ((TermAvgMod[i] - TermOrderMod[i]).toFixed(4)).slice(2, 6)
                TermSC[i] = SClist[TermOrderMod[i] + 1]
            }
        }
    }
    const Month = []
    if (ifLeapAcrThis) {
        for (let i = 1; i <= 12 + ifLeapAcrThis; i++) {
            if (i <= LeapNumTerm) {
                Month[i] = i
            } else if (i == LeapNumTerm + 1) {
                Month[i] = '閏'
            } else {
                Month[i] = i - 1
            }
        }
    } else {
        for (let i = 1; i <= 12; i++) {
            Month[i] = i
        }
    }

    const MonthPrint = Month.slice(1)
    const FirstSCPrint = PlusMinusThis.First.SC.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    const FirstDecimalPrint = PlusMinusThis.First.Decimal.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    const SyzygySCPrint = PlusMinusThis.Syzygy.SC.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    const SyzygyDecimalPrint = PlusMinusThis.Syzygy.Decimal.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    const TermSCPrint = TermSC.slice(1)
    const TermDecimalPrint = TermDecimal.slice(1)
    const YearInfo = `${CalendarName[ShouPre]} 定閏餘${LeapSurAcrThis.toFixed(4)}平閏餘${LeapSurAvgThis.toFixed(4)}  閏準${LeapStd.toFixed(4)} `
    return {
        YearInfo,
        MonthPrint,
        FirstSCPrint,
        FirstDecimalPrint,
        SyzygySCPrint,
        SyzygyDecimalPrint,
        TermSCPrint,
        TermDecimalPrint,
    }
    // if (LeapNumAcrThis > 0) {
    //     YearInfo += `閏${LeapNumAcrThis}月   `
    // }

}
module.exports = CalShoushi