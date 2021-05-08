import { AutoLongi2Lati } from './bind_astronomy.mjs'
import {
    AutoMansion,
    MansionNameList,
} from './para_constant.mjs' // 賦值解構
import {
    Bind
} from './bind.mjs'

export const Deg2Mansion = (Accum, CalName, year, NewmWinsolsDifRaw, WinsolsDecimal) => { // Deg2Mansion
    const {
        AutoPara
    } = Bind(CalName)
    const {
        SolarRaw,
        AcrTermList,
        WinsolsConst,
        MansionConst,
        MansionRaw,
        MansionFractPosition
    } = AutoPara[CalName]
    let { Sidereal, Solar } = AutoPara[CalName]
    const {
        EquaDegList: DegListRaw
    } = AutoMansion(CalName, year)
    Solar = Solar || SolarRaw
    Sidereal = Sidereal || Solar
    const TermLeng = Solar / 12
    // 下預處理二十八宿列表
    let MansionDegList = []
    let MansionDegAccumList = []
    let Mansion = 0
    if (MansionRaw) {
        MansionDegList = DegListRaw.slice()
        MansionDegList[MansionFractPosition] += Sidereal - ~~Sidereal
        MansionDegAccumList = MansionDegList.slice()
        for (let i = 1; i <= 28; i++) { // 從1開始索引
            MansionDegAccumList[i] += MansionDegAccumList[i - 1]
            MansionDegAccumList[i] = parseFloat((MansionDegAccumList[i]).toPrecision(10))
        }
        MansionDegAccumList = MansionDegAccumList.slice(-1).concat(MansionDegAccumList.slice(0, -1))
        MansionDegAccumList[0] = 0
        MansionDegAccumList[29] = Sidereal
        Mansion = MansionDegAccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    }
    let LongiRaw = []
    if (NewmWinsolsDifRaw) { // 朔
        LongiRaw = NewmWinsolsDifRaw
    } else { // 中氣
        if (AcrTermList) {
            LongiRaw = AcrTermList
        } else {
            for (let i = 0; i <= 11; i++) {
                LongiRaw[i] = TermLeng * (i + 2)
            }
        }
    }
    const MansionResult = []
    const MidstarResult = []
    for (let i = 0; i < (NewmWinsolsDifRaw.length || 12); i++) { // 這個括號不能刪
        Accum[i] -= WinsolsConst || 0 // 授時要減去氣應？
        let MansionOrder = 0
        let MidstarOrder = 0
        const MansionAccum = parseFloat((((Mansion + (MansionConst || 0) + Accum[i]) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(12))
        for (let j = 1; j <= 28; j++) {
            if (MansionDegAccumList[j] <= MansionAccum && MansionAccum < MansionDegAccumList[j + 1]) {
                MansionOrder = j
                break
            }
        }
        const MansionName = MansionNameList[MansionOrder]
        const MansionDeg = (MansionAccum - MansionDegAccumList[MansionOrder]).toFixed(3)
        MansionResult[i] = MansionName + MansionDeg
        /////////昏中星/////////       
        // 昏中=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(0.5-夜半漏)*週天-夜半漏（單位1日）
        if (WinsolsDecimal) {
            const Sunrise = AutoLongi2Lati(LongiRaw[i] % Solar, WinsolsDecimal, CalName).Sunrise / 100
            // const MidstarRaw = (MansionAccum + (0.5 - Sunrise) * Sidereal - Sunrise + 1 + Sidereal) % Sidereal
            const MidstarRaw = (MansionAccum + (0.5 - Sunrise + 0.025) * Sidereal + Sidereal) % Sidereal
            for (let k = 1; k <= 28; k++) {
                if (MansionDegAccumList[k] < MidstarRaw && MidstarRaw < MansionDegAccumList[k + 1]) {
                    MidstarOrder = k
                    break
                }
            }
            const MidstarName = MansionNameList[MidstarOrder]
            const MidstarDeg = (MidstarRaw - MansionDegAccumList[MidstarOrder]).toFixed(3)
            MidstarResult[i] = MidstarName + MidstarDeg
        }
    }
    return {
        MansionResult,
        MidstarResult
    }
}
// console.log(Deg2Mansion([134141, 1414131], 'Yuanjia', 500, [34.15, 144]).MansionResult)