var {
    SClist,
    CalendarName
} = require('./constant') // 賦值解構
var Parameters = require('./shoushi_para')

function CalShoushi(ShouPre, year) {
    var {
        SolarRaw,
        lunar,
        AnomaLunar,
        WsolsticeConst,
        LeapConst,
        AnomaMonConst,
        XianConst,
        // MoonAvgV ,
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
    var OriginYear = year - 1281 // 距元
    if (ShouPre == 'Shoushi') {
        if (OriginYear >= 0) {
            var solar = SolarRaw - (Math.floor(OriginYear / 100)) / 10000 // 歲實消長
        } else {
            var solar = SolarRaw - (Math.ceil(OriginYear / 100)) / 10000
        }
    } else if (ShouPre == 'ShouAcr') {
        var solar = SolarRaw - OriginYear * 0.00000006162
    }
    var HalfSolar = solar / 2 // 半歲實
    var TermLeng = solar / 12 // 每個中氣相隔的日數
    var HalfAnoma = AnomaLunar / 2 // 轉中
    var MonLeap = TermLeng - lunar // 月閏 
    var LeapStd = parseFloat((13 * lunar - solar).toPrecision(12)) // 閏準 18.6528

    var AccumZhongThis = OriginYear * solar // 中積
    var AccumZhongPrev = (OriginYear - 1) * solar
    var AccumZhongNext = (OriginYear + 1) * solar
    var AccumTongThis = AccumZhongThis + WsolsticeConst // 通積：該年冬至積日
    var AccumLeapThis = AccumZhongThis + LeapConst // 閏積 
    var AccumLeapPrev = AccumZhongPrev + LeapConst
    var AccumLeapNext = AccumZhongNext + LeapConst
    var LeapSurAvgThis = parseFloat(((AccumLeapThis % lunar + lunar) % lunar).toPrecision(12)) // 閏餘、冬至月齡  
    var ifLeapAvgThis = LeapSurAvgThis >= LeapStd ? 1 : 0 // 經朔是否有閏月
    var LeapSurAvgPrev = parseFloat(((AccumLeapPrev % lunar + lunar) % lunar).toPrecision(12))
    var ifLeapAvgPrev = LeapSurAvgPrev >= LeapStd ? 1 : 0
    var LeapSurAvgNext = parseFloat(((AccumLeapNext % lunar + lunar) % lunar).toPrecision(12))
    var ifLeapAvgNext = LeapSurAvgNext >= LeapStd ? 1 : 0
    var FirstAvgRaw = []
    var FirstDecimal = []
    var FirstAnomaAccum = []
    var FirstAnomaXian = []
    var FirstExConS = []
    var FirstFaSlowS = []
    var FirstFaSlowV = []
    var FirstPlusMinusT = []
    var FirstAcrRaw = []
    var FirstAcrMod = []
    var FirstOrderRaw = []
    var FirstOrderMod = []
    var FirstSC = []
    var SyzygyAvgRaw = []
    var SyzygyDecimal = []
    var SyzygyAnomaAccum = []
    var SyzygyAnomaXian = []
    var SyzygyExConS = []
    var SyzygyFaSlowS = []
    var SyzygyFaSlowV = []
    var SyzygyPlusMinusT = []
    var SyzygyAcrRaw = []
    var SyzygyAcrMod = []
    var SyzygyOrderMod = []
    var SyzygySC = []
    for (i = 1; i <= 13; i++) {
        FirstAvgRaw[i] = AccumTongThis - LeapSurAvgThis + (i - 1 + FirstMonNum) * lunar // 各月經朔
        var FirstWsolsticeAccum = ((i - 1 + FirstMonNum) * lunar - LeapSurAvgThis + solar) % solar // 各月朔入冬至的積日
        if (FirstWsolsticeAccum <= 88.909225) {
            var FirstExConT = FirstWsolsticeAccum
            FirstExConS[i] = (ExDingDif * FirstExConT - ExPingDif * (FirstExConT ** 2) - ExLiDif * (FirstExConT ** 3)) / 10000 // 盈縮差
        } else if (FirstWsolsticeAccum <= HalfSolar) {
            var FirstExConT = HalfSolar - FirstWsolsticeAccum
            FirstExConS[i] = (ConDingDif * FirstExConT - ConPingDif * (FirstExConT ** 2) - ConLiDif * (FirstExConT ** 3)) / 10000
        } else if (FirstWsolsticeAccum <= HalfSolar + 93.712025) {
            var FirstExConT = FirstWsolsticeAccum - HalfSolar
            FirstExConS[i] = -(ConDingDif * FirstExConT - ConPingDif * (FirstExConT ** 2) - ConLiDif * (FirstExConT ** 3)) / 10000
        } else {
            var FirstExConT = solar - FirstWsolsticeAccum
            FirstExConS[i] = -(ExDingDif * FirstExConT - ExPingDif * (FirstExConT ** 2) - ExLiDif * (FirstExConT ** 3)) / 10000
        }

        FirstAnomaAccum[i] = ((AnomaMonConst + AccumZhongThis - LeapSurAvgThis + (i - 1 + FirstMonNum) * lunar) % AnomaLunar + AnomaLunar) % AnomaLunar // 入轉日分
        var sign = 1
        if (FirstAnomaAccum[i] <= 6.888) {
            var FirstFaSlowT = FirstAnomaAccum[i] / XianConst
            sign = -1
        } else if (FirstAnomaAccum[i] <= 13.7773) {
            var FirstFaSlowT = (HalfAnoma - FirstAnomaAccum[i]) / XianConst
            sign = -1
        } else if (FirstAnomaAccum[i] <= 20.6653) {
            var FirstFaSlowT = (FirstAnomaAccum[i] - HalfAnoma) / XianConst
            sign = 1
        } else {
            var FirstFaSlowT = (AnomaLunar - FirstAnomaAccum[i]) / XianConst
            sign = 1
        }
        FirstFaSlowS[i] = sign * (FaSlowDingDif * FirstFaSlowT - FaSlowPingDif * FirstFaSlowT ** 2 - FaSlowLiDif * FirstFaSlowT ** 3) / 100

        if (FirstAnomaAccum[i] <= 6.642) {
            FirstAnomaXian[i] = FirstAnomaAccum[i] / XianConst
            sign = 1
        } else if (FirstAnomaAccum[i] <= 7.052) {
            FirstAnomaXian[i] = FirstAnomaAccum[i] / XianConst
            sign = 0
        } else if (FirstAnomaAccum[i] <= 20.4193) {
            FirstAnomaXian[i] = Math.abs(HalfAnoma - FirstAnomaAccum[i]) / XianConst
            sign = -1
        } else if (FirstAnomaAccum[i] <= 20.8293) {
            FirstAnomaXian[i] = Math.abs(HalfAnoma - FirstAnomaAccum[i]) / XianConst
            sign = 0
        } else {
            FirstAnomaXian[i] = (AnomaLunar - FirstAnomaAccum[i]) / XianConst
            sign = 1
        }
        FirstFaSlowV[i] = 1.0962 + sign * (0.11081575 - 0.0005815 * FirstAnomaXian[i] - 0.00000975 * FirstAnomaXian[i] * (FirstAnomaXian[i] - 1))
        FirstPlusMinusT[i] = (FirstExConS[i] + FirstFaSlowS[i]) * XianConst / FirstFaSlowV[i]
        FirstAcrRaw[i] = parseFloat(((FirstAvgRaw[i] + FirstPlusMinusT[i])).toPrecision(12))
        FirstAcrMod[i] = (FirstAcrRaw[i] % 60 + 60) % 60
        FirstOrderRaw[i] = Math.floor(FirstAcrRaw[i])
        FirstOrderMod[i] = Math.floor(FirstAcrMod[i])
        FirstDecimal[i] = ((FirstAcrMod[i] - FirstOrderMod[i]).toFixed(4)).slice(2, 6)
        FirstSC[i] = SClist[FirstOrderMod[i] + 1]
        SyzygyAvgRaw[i] = AccumTongThis - LeapSurAvgThis + (i - 0.5 + FirstMonNum) * lunar // 各月經望
        var SyzygyWsolsticeAccum = ((i - 0.5 + FirstMonNum) * lunar - LeapSurAvgThis + solar) % solar // 各月望入冬至的積日
        if (SyzygyWsolsticeAccum <= 88.909225) {
            var SyzygyExConT = SyzygyWsolsticeAccum
            SyzygyExConS[i] = (ExDingDif * SyzygyExConT - ExPingDif * (SyzygyExConT ** 2) - ExLiDif * (SyzygyExConT ** 3)) / 10000 // 盈縮差
        } else if (SyzygyWsolsticeAccum <= HalfSolar) {
            var SyzygyExConT = HalfSolar - SyzygyWsolsticeAccum
            SyzygyExConS[i] = (ConDingDif * SyzygyExConT - ConPingDif * (SyzygyExConT ** 2) - ConLiDif * (SyzygyExConT ** 3)) / 10000
        } else if (SyzygyWsolsticeAccum <= HalfSolar + 93.712025) {
            var SyzygyExConT = SyzygyWsolsticeAccum - HalfSolar
            SyzygyExConS[i] = -(ConDingDif * SyzygyExConT - ConPingDif * (SyzygyExConT ** 2) - ConLiDif * (SyzygyExConT ** 3)) / 10000
        } else {
            var SyzygyExConT = solar - SyzygyWsolsticeAccum
            SyzygyExConS[i] = -(ExDingDif * SyzygyExConT - ExPingDif * (SyzygyExConT ** 2) - ExLiDif * (SyzygyExConT ** 3)) / 10000
        }

        SyzygyAnomaAccum[i] = ((AnomaMonConst + AccumZhongThis - LeapSurAvgThis + (i - 0.5 + FirstMonNum) * lunar) % AnomaLunar + AnomaLunar) % AnomaLunar // 入轉日分
        var sign = 1
        if (SyzygyAnomaAccum[i] <= 6.888) {
            var SyzygyFaSlowT = SyzygyAnomaAccum[i] / XianConst
            sign = -1
        } else if (SyzygyAnomaAccum[i] <= 13.7773) {
            var SyzygyFaSlowT = (HalfAnoma - SyzygyAnomaAccum[i]) / XianConst
            sign = -1
        } else if (SyzygyAnomaAccum[i] <= 20.6653) {
            var SyzygyFaSlowT = (SyzygyAnomaAccum[i] - HalfAnoma) / XianConst
            sign = 1
        } else {
            var SyzygyFaSlowT = (AnomaLunar - SyzygyAnomaAccum[i]) / XianConst
            sign = 1
        }
        SyzygyFaSlowS[i] = sign * (FaSlowDingDif * SyzygyFaSlowT - FaSlowPingDif * SyzygyFaSlowT ** 2 - FaSlowLiDif * SyzygyFaSlowT ** 3) / 100

        if (SyzygyAnomaAccum[i] <= 6.642) {
            SyzygyAnomaXian[i] = SyzygyAnomaAccum[i] / XianConst
            sign = 1
        } else if (SyzygyAnomaAccum[i] <= 7.052) {
            SyzygyAnomaXian[i] = SyzygyAnomaAccum[i] / XianConst
            sign = 0
        } else if (SyzygyAnomaAccum[i] <= 20.4193) {
            SyzygyAnomaXian[i] = Math.abs(HalfAnoma - SyzygyAnomaAccum[i]) / XianConst
            sign = -1
        } else if (SyzygyAnomaAccum[i] <= 20.8293) {
            SyzygyAnomaXian[i] = Math.abs(HalfAnoma - SyzygyAnomaAccum[i]) / XianConst
            sign = 0
        } else {
            SyzygyAnomaXian[i] = (AnomaLunar - SyzygyAnomaAccum[i]) / XianConst
            sign = 1
        }
        SyzygyFaSlowV[i] = 1.0962 + sign * (0.11081575 - 0.0005815 * SyzygyAnomaXian[i] - 0.00000975 * SyzygyAnomaXian[i] * (SyzygyAnomaXian[i] - 1))
        SyzygyPlusMinusT[i] = (SyzygyExConS[i] + SyzygyFaSlowS[i]) * XianConst / SyzygyFaSlowV[i]
        SyzygyAcrRaw[i] = parseFloat(((SyzygyAvgRaw[i] + SyzygyPlusMinusT[i])).toPrecision(12))
        SyzygyAcrMod[i] = (SyzygyAcrRaw[i] % 60 + 60) % 60
        SyzygyOrderMod[i] = Math.floor(SyzygyAcrMod[i])
        SyzygyDecimal[i] = ((SyzygyAcrMod[i] - SyzygyOrderMod[i]).toFixed(4)).slice(2, 6)

        SyzygySC[i] = SClist[SyzygyOrderMod[i] + 1]
    }
    var LeapSurAcrThis = parseFloat(((LeapSurAvgThis - FirstPlusMinusT[1] + lunar) % lunar).toPrecision(12))
    var ifLeapAcrThis = LeapSurAcrThis >= LeapStd ? 1 : 0 // 是否有閏月
    var LeapNumAcrThis = ifLeapAcrThis > 0 ? Math.ceil((lunar - LeapSurAcrThis) / MonLeap) : 0 // 閏月數
    var LeapNumTerm = LeapNumAcrThis
    
    //接下來是上年定閏餘
    var FirstAnomaAccumPrev = []
    var FirstAnomaXianPrev = []
    var FirstExConSPrev = []
    var FirstFaSlowSPrev = []
    var FirstFaSlowVPrev = []
    var FirstPlusMinusTPrev = []
    for (i = 1; i <= 13; i++) {
        var FirstWsolsticeAccum = ((i - 1 + FirstMonNum) * lunar - LeapSurAvgPrev + solar) % solar // 各月朔入冬至的積日
        if (FirstWsolsticeAccum <= 88.909225) {
            var FirstExConT = FirstWsolsticeAccum
            FirstExConSPrev[i] = (ExDingDif * FirstExConT - ExPingDif * (FirstExConT ** 2) - ExLiDif * (FirstExConT ** 3)) / 10000 // 盈縮差
        } else if (FirstWsolsticeAccum <= HalfSolar) {
            var FirstExConT = HalfSolar - FirstWsolsticeAccum
            FirstExConSPrev[i] = (ConDingDif * FirstExConT - ConPingDif * (FirstExConT ** 2) - ConLiDif * (FirstExConT ** 3)) / 10000
        } else if (FirstWsolsticeAccum <= HalfSolar + 93.712025) {
            var FirstExConT = FirstWsolsticeAccum - HalfSolar
            FirstExConSPrev[i] = -(ConDingDif * FirstExConT - ConPingDif * (FirstExConT ** 2) - ConLiDif * (FirstExConT ** 3)) / 10000
        } else {
            var FirstExConT = solar - FirstWsolsticeAccum
            FirstExConSPrev[i] = -(ExDingDif * FirstExConT - ExPingDif * (FirstExConT ** 2) - ExLiDif * (FirstExConT ** 3)) / 10000
        }
        FirstAnomaAccumPrev[i] = ((AnomaMonConst + AccumZhongPrev - LeapSurAvgPrev + (i - 1 + FirstMonNum) * lunar) % AnomaLunar + AnomaLunar) % AnomaLunar // 入轉日分
        var sign = 1
        if (FirstAnomaAccumPrev[i] <= 6.888) {
            var FirstFaSlowT = FirstAnomaAccumPrev[i] / XianConst
            sign = -1
        } else if (FirstAnomaAccumPrev[i] <= 13.7773) {
            var FirstFaSlowT = (HalfAnoma - FirstAnomaAccumPrev[i]) / XianConst
            sign = -1
        } else if (FirstAnomaAccumPrev[i] <= 20.6653) {
            var FirstFaSlowT = (FirstAnomaAccumPrev[i] - HalfAnoma) / XianConst
            sign = 1
        } else {
            var FirstFaSlowT = (AnomaLunar - FirstAnomaAccumPrev[i]) / XianConst
            sign = 1
        }
        FirstFaSlowSPrev[i] = sign * (FaSlowDingDif * FirstFaSlowT - FaSlowPingDif * FirstFaSlowT ** 2 - FaSlowLiDif * FirstFaSlowT ** 3) / 100
        if (FirstAnomaAccumPrev[i] <= 6.642) {
            FirstAnomaXianPrev[i] = FirstAnomaAccumPrev[i] / XianConst
            sign = 1
        } else if (FirstAnomaAccumPrev[i] <= 7.052) {
            FirstAnomaXianPrev[i] = FirstAnomaAccumPrev[i] / XianConst
            sign = 0
        } else if (FirstAnomaAccumPrev[i] <= 20.4193) {
            FirstAnomaXianPrev[i] = Math.abs(HalfAnoma - FirstAnomaAccumPrev[i]) / XianConst
            sign = -1
        } else if (FirstAnomaAccumPrev[i] <= 20.8293) {
            FirstAnomaXianPrev[i] = Math.abs(HalfAnoma - FirstAnomaAccumPrev[i]) / XianConst
            sign = 0
        } else {
            FirstAnomaXianPrev[i] = (AnomaLunar - FirstAnomaAccumPrev[i]) / XianConst
            sign = 1
        }
        FirstFaSlowVPrev[i] = 1.0962 + sign * (0.11081575 - 0.0005815 * FirstAnomaXianPrev[i] - 0.00000975 * FirstAnomaXianPrev[i] * (FirstAnomaXianPrev[i] - 1))
        FirstPlusMinusTPrev[i] = (FirstExConSPrev[i] + FirstFaSlowSPrev[i]) * XianConst / FirstFaSlowVPrev[i]
    }
    var LeapSurAcrPrev = parseFloat(((LeapSurAvgPrev - FirstPlusMinusTPrev[1] + lunar) % lunar).toPrecision(12))
    var ifLeapAcrPrev = LeapSurAcrPrev >= LeapStd ? 1 : 0
    //接下來是明年定閏餘
    var FirstAnomaAccumNext = []
    var FirstAnomaXianNext = []
    var FirstExConSNext = []
    var FirstFaSlowSNext = []
    var FirstFaSlowVNext = []
    var FirstPlusMinusTNext = []
    for (i = 1; i <= 13; i++) {
        var FirstWsolsticeAccum = ((i - 1 + FirstMonNum) * lunar - LeapSurAvgNext + solar) % solar // 各月朔入冬至的積日
        if (FirstWsolsticeAccum <= 88.909225) {
            var FirstExConT = FirstWsolsticeAccum
            FirstExConSNext[i] = (ExDingDif * FirstExConT - ExPingDif * (FirstExConT ** 2) - ExLiDif * (FirstExConT ** 3)) / 10000 // 盈縮差
        } else if (FirstWsolsticeAccum <= HalfSolar) {
            var FirstExConT = HalfSolar - FirstWsolsticeAccum
            FirstExConSNext[i] = (ConDingDif * FirstExConT - ConPingDif * (FirstExConT ** 2) - ConLiDif * (FirstExConT ** 3)) / 10000
        } else if (FirstWsolsticeAccum <= HalfSolar + 93.712025) {
            var FirstExConT = FirstWsolsticeAccum - HalfSolar
            FirstExConSNext[i] = -(ConDingDif * FirstExConT - ConPingDif * (FirstExConT ** 2) - ConLiDif * (FirstExConT ** 3)) / 10000
        } else {
            var FirstExConT = solar - FirstWsolsticeAccum
            FirstExConSNext[i] = -(ExDingDif * FirstExConT - ExPingDif * (FirstExConT ** 2) - ExLiDif * (FirstExConT ** 3)) / 10000
        }
        FirstAnomaAccumNext[i] = ((AnomaMonConst + AccumZhongNext - LeapSurAvgNext + (i - 1 + FirstMonNum) * lunar) % AnomaLunar + AnomaLunar) % AnomaLunar // 入轉日分
        var sign = 1
        if (FirstAnomaAccumNext[i] <= 6.888) {
            var FirstFaSlowT = FirstAnomaAccumNext[i] / XianConst
            sign = -1
        } else if (FirstAnomaAccumNext[i] <= 13.7773) {
            var FirstFaSlowT = (HalfAnoma - FirstAnomaAccumNext[i]) / XianConst
            sign = -1
        } else if (FirstAnomaAccumNext[i] <= 20.6653) {
            var FirstFaSlowT = (FirstAnomaAccumNext[i] - HalfAnoma) / XianConst
            sign = 1
        } else {
            var FirstFaSlowT = (AnomaLunar - FirstAnomaAccumNext[i]) / XianConst
            sign = 1
        }
        FirstFaSlowSNext[i] = sign * (FaSlowDingDif * FirstFaSlowT - FaSlowPingDif * FirstFaSlowT ** 2 - FaSlowLiDif * FirstFaSlowT ** 3) / 100
        if (FirstAnomaAccumNext[i] <= 6.642) {
            FirstAnomaXianNext[i] = FirstAnomaAccumNext[i] / XianConst
            sign = 1
        } else if (FirstAnomaAccumNext[i] <= 7.052) {
            FirstAnomaXianNext[i] = FirstAnomaAccumNext[i] / XianConst
            sign = 0
        } else if (FirstAnomaAccumNext[i] <= 20.4193) {
            FirstAnomaXianNext[i] = Math.abs(HalfAnoma - FirstAnomaAccumNext[i]) / XianConst
            sign = -1
        } else if (FirstAnomaAccumNext[i] <= 20.8293) {
            FirstAnomaXianNext[i] = Math.abs(HalfAnoma - FirstAnomaAccumNext[i]) / XianConst
            sign = 0
        } else {
            FirstAnomaXianNext[i] = (AnomaLunar - FirstAnomaAccumNext[i]) / XianConst
            sign = 1
        }
        FirstFaSlowVNext[i] = 1.0962 + sign * (0.11081575 - 0.0005815 * FirstAnomaXianNext[i] - 0.00000975 * FirstAnomaXianNext[i] * (FirstAnomaXianNext[i] - 1))
        FirstPlusMinusTNext[i] = (FirstExConSNext[i] + FirstFaSlowSNext[i]) * XianConst / FirstFaSlowVNext[i]
    }
    var LeapSurAcrNext = parseFloat(((LeapSurAvgNext - FirstPlusMinusTNext[1] + lunar) % lunar).toPrecision(12))
    var ifLeapAcrNext = LeapSurAcrNext >= LeapStd ? 1 : 0
    if ((!ifLeapAcrThis && LeapSurAcrThis > LeapStd - MonLeap) && (!ifLeapAvgThis && LeapSurAvgThis > LeapStd - MonLeap) && (!ifLeapAcrNext && LeapSurAcrNext < MonLeap) && (ifLeapAvgNext && LeapSurAvgNext > lunar - MonLeap)) {
        ifLeapAcrThis = 1
        LeapNumTerm = 12
    } else if ((ifLeapAcrPrev && LeapSurAcrPrev < LeapStd + MonLeap) && (!ifLeapAvgPrev && LeapSurAvgPrev > LeapStd - MonLeap) && (ifLeapAcrThis && LeapSurAcrThis > lunar - MonLeap) && (ifLeapAvgThis && LeapSurAvgThis > lunar - MonLeap)) {
        ifLeapAcrThis = 0
        LeapNumTerm = 0
    } // // 分別解決1327—1328、1327—1328的極端情況
    var ifLeapAdvanceStartThis = !ifLeapAcrThis && ifLeapAvgThis // 這兩行解決經閏餘和定閏餘在閏準臨界值上下時，置閏前後相差一年的特殊與極特殊情況
    var ifLeapAdvanceEndThis = ifLeapAcrThis || ifLeapAvgThis
    var TermAvgRaw = []
    var TermAvgMod = []
    var TermOrderMod = []
    var TermSC = []
    var TermDecimal = []
    // 中氣
    for (i = 1; i <= 12; i++) {
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
        for (i = 1; i <= 13; i++) {
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
    var Month = []
    if (ifLeapAcrThis) {
        for (i = 1; i <= 12 + ifLeapAcrThis; i++) {
            if (i <= LeapNumTerm) {
                Month[i] = i
            } else if (i == LeapNumTerm + 1) {
                Month[i] = '閏'
            } else {
                Month[i] = i - 1
            }
        }
    } else {
        for (i = 1; i <= 12; i++) {
            Month[i] = i
        }
    }

    var MonthPrint = Month.slice(1)
    var FirstSCPrint = FirstSC.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    var FirstDecimalPrint = FirstDecimal.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    var SyzygySCPrint = SyzygySC.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    var SyzygyDecimalPrint = SyzygyDecimal.slice(1 + ifLeapAdvanceStartThis, 13 + ifLeapAdvanceEndThis)
    var TermSCPrint = TermSC.slice(1)
    var TermDecimalPrint = TermDecimal.slice(1)
    var YearInfo = `${CalendarName[ShouPre]} 定閏餘${LeapSurAcrThis.toFixed(4)}平閏餘${LeapSurAvgThis.toFixed(4)}  閏準${LeapStd.toFixed(4)} `
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