import { ScList } from './para_constant.mjs'
import { deltaT } from './astronomy_west.mjs'
import { Jd2Date, generateTimeString } from './time_jd2date.mjs'
import NewmList from './eph/newm_de44_list.mjs'
import SyzygyList from './eph/syzygy_de44_list.mjs'
import TermList from './eph/term_de44_list.mjs'
import Term1List from './eph/term1_de44_list.mjs'

// console.log(LonHigh2Flat(23.4385828209, 330))
// console.log(LonFlat2High(23.4916666666667,73.80638)) // 考成卷八葉37算例
// const LowLon2LowLat = (e, X) => atan(tan(e) * sin(X)) // 求赤經高弧交角用到這個的變形
// const LowLat2HighLon = (e, X) => // 已知太陽赤緯轉黃經
// console.log(LonHigh2Flat(23.5,15))
// console.log(HighLon2FlatLat(23 + 29 / 60,112.28487818))
// console.log(LowLat2HighLon(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=.3973413465. HAB=23.41207808
function findClosest(a, list) {
    let closest = list[0], closestIndex = 0;
    let smallestDifference = Math.abs(a - closest);
    for (let i = 1; i < list.length; i++) {
        let currentDifference = Math.abs(a - list[i]);
        if (currentDifference < smallestDifference) {
            smallestDifference = currentDifference;
            closest = list[i];
            closestIndex = i;
        }
    }
    return { closest, closestIndex };
}
export const N6 = (Name, Y) => {
    if (Y > 2499 || Y < -2499) throw (new Error('Year range of DE440/1: -2499 to 2499'))
    const EpoSolsJd = 2451534.749 // 取癸卯曆1999年12月22日平冬至時間儒略日
    const ChouConst = 15.68 // 採用癸卯曆首朔應，即十二月平朔距冬至的時間。與時憲曆用冬至次日夜半，我直接用冬至
    const CloseOriginAd = 2000
    const Solar = 365.2422, Lunar = 29.530588853
    const TermLeng = Solar / 12
    const OriginAccum = (Y - CloseOriginAd) * Solar // 中積
    const AvgSolsJd = EpoSolsJd + OriginAccum
    const AvgChouSd = (Lunar - OriginAccum % Lunar + ChouConst) % Lunar // 首朔
    const AvgChouJd = AvgChouSd + AvgSolsJd // 十二月朔
    const AvgChouSyzygySd = AvgChouSd + Lunar / 2 // 十二月望
    const AvgChouSyzygyJd = AvgChouSyzygySd + AvgSolsJd
    const AvgChouTermJd = AvgSolsJd + TermLeng * 2 // 大寒
    const AvgChouTerm1Jd = AvgSolsJd + TermLeng // 小寒
    const AcrChouJdIndex = findClosest(AvgChouJd, NewmList).closestIndex
    const AcrChouSyzygyJdIndex = findClosest(AvgChouSyzygyJd, SyzygyList).closestIndex
    const AcrChouTermJdIndex = findClosest(AvgChouTermJd, TermList).closestIndex
    const AcrChouTerm1JdIndex = findClosest(AvgChouTerm1Jd, Term1List).closestIndex
    const main = (isNewm, LeapNumTerm) => {
        const AcrJd = [], UT18Sc = [], UT18Deci = [], NowDeci = [],
            AcrTermJd = [], TermAcrSc = [], TermAcrDeci = [],
            AcrTerm1Jd = [], Term1AcrSc = [], Term1AcrDeci = []
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望   
            AcrJd[i] = isNewm ? NewmList[AcrChouJdIndex + i] : SyzygyList[AcrChouSyzygyJdIndex + i]
            const UT18Jd = AcrJd[i] - deltaT(AcrJd[i]) + 8 / 24
            const UT18JdDate = Jd2Date(UT18Jd)
            UT18Sc[i] = ScList[UT18JdDate.ScOrder]
            UT18Deci[i] = generateTimeString(UT18JdDate.h, UT18JdDate.m, UT18JdDate.s, Y < 1600 ? '' : UT18JdDate.ms)
            //////// 節氣
            if (isNewm) {
                // 中氣
                AcrTermJd[i] = TermList[AcrChouTermJdIndex + i - 1]
                const UT18TermJd = AcrTermJd[i] + 8 / 24 - deltaT(AcrTermJd[i])
                const UT18TermJdDate = Jd2Date(UT18TermJd)
                TermAcrSc[i] = ScList[UT18TermJdDate.ScOrder]
                TermAcrDeci[i] = generateTimeString(UT18TermJdDate.h, UT18TermJdDate.m, UT18TermJdDate.s, Y < 1600 ? '' : UT18TermJdDate.ms)
                // 節氣
                AcrTerm1Jd[i] = Term1List[AcrChouTerm1JdIndex + i - 1]
                const UT18Term1Jd = AcrTerm1Jd[i] + 8 / 24 - deltaT(AcrTerm1Jd[i])
                const UT18Term1JdDate = Jd2Date(UT18Term1Jd)
                Term1AcrSc[i] = ScList[UT18Term1JdDate.ScOrder]
                Term1AcrDeci[i] = generateTimeString(UT18Term1JdDate.h, UT18Term1JdDate.m, UT18Term1JdDate.s, Y < 1600 ? '' : UT18Term1JdDate.ms)
            }
        }
        //////// 置閏
        LeapNumTerm = LeapNumTerm || 0
        if (isNewm) {
            for (let i = 1; i <= 12; i++) {
                if ((~~AcrTermJd[i] < ~~AcrJd[i + 1]) && (~~AcrTermJd[i + 1] >= ~~AcrJd[i + 2])) {
                    LeapNumTerm = i // 閏Leap月，第Leap+1月爲閏月
                    break
                }
            }
        }
        return {
            AcrJd, UT18Sc, UT18Deci, NowDeci,
            TermAcrSc, TermAcrDeci,
            Term1AcrSc, Term1AcrDeci,
            LeapNumTerm
        }
    }
    const {
        AcrJd: NewmJd, UT18Sc: NewmSc, UT18Deci: NewmDeci,
        TermAcrSc, TermAcrDeci,
        Term1AcrSc, Term1AcrDeci, LeapNumTerm
    } = main(true)
    const {
        UT18Sc: SyzygySc, UT18Deci: SyzygyDeci
    } = main(false, LeapNumTerm)
    return {
        NewmSc, NewmDeci,
        SyzygySc, SyzygyDeci,
        TermAcrSc, TermAcrDeci,
        Term1AcrSc, Term1AcrDeci, LeapNumTerm,
        //// 曆書用
        NewmJd, AvgSolsJd
    }
}
// console.log(N6('DE441', 2023))

