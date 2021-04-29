import {
    MansionNameList,
} from './para_constant.mjs' // 賦值解構

export default (Accum, Solar, Sidereal, DegListRaw, MansionConst, MansionRaw, MansionFractPosition, NightList) => { // Deg2Mansion
    // 下預處理二十八宿列表
    let MansionDegList = []
    let MansionDegAccumList = []
    let Mansion = 0
    if (MansionRaw) {
        MansionDegList = DegListRaw.slice()
        MansionDegList[MansionFractPosition] += Sidereal - Math.floor(Sidereal)
        MansionDegAccumList = MansionDegList.slice()
        for (let i = 1; i <= 28; i++) {
            MansionDegAccumList[i] += MansionDegAccumList[i - 1]
            MansionDegAccumList[i] = parseFloat((MansionDegAccumList[i]).toPrecision(10))
        }
        MansionDegAccumList = MansionDegAccumList.slice(-1).concat(MansionDegAccumList.slice(0, -1))
        MansionDegAccumList[0] = 0
        MansionDegAccumList[29] = Sidereal
        Mansion = MansionDegAccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    }
    // 上面的三個Sidereal之前是Solar
    return Accum.map(a => {
        let MansionOrder = 0
        let MansionResult = 0
        let MansionAccum = 0
        let MansionName = 0
        let MansionDeg = 0
        let MidstarRaw = 0
        let MidstarOrder = 0
        let MidstarName = 0
        let MidstarDeg = 0
        let MidstarResult = 0
        if (Mansion) {
            MansionAccum = parseFloat((((Mansion + (MansionConst ? MansionConst : 0) + a) % Sidereal + Sidereal) % Sidereal + 0.0000001).toPrecision(12))
            for (let j = 1; j <= 28; j++) {
                if (MansionDegAccumList[j] <= MansionAccum && MansionAccum < MansionDegAccumList[j + 1]) {
                    MansionOrder = j
                    break
                }
            }
            MansionName = MansionNameList[MansionOrder]
            MansionDeg = (MansionAccum - MansionDegAccumList[MansionOrder]).toFixed(3)
            MansionResult = MansionName + MansionDeg
            /////////昏中星/////////
            if (NightList) {
                MidstarRaw = MansionAccum + ((100 - 2 * NightList[Math.round(MansionAccum / 24) + 1]) * Sidereal - 2 * NightList[Math.round(MansionAccum / 24) + 1]) / 200 + 1
                MidstarRaw = ((MidstarRaw + Sidereal) % Sidereal)
                for (let k = 1; k <= 28; k++) {
                    if (MansionDegAccumList[k] < MidstarRaw && MidstarRaw < MansionDegAccumList[k + 1]) {
                        MidstarOrder = k
                    }
                }
                MidstarName = MansionNameList[MidstarOrder]
                MidstarDeg = (MidstarRaw - MansionDegAccumList[MidstarOrder]).toFixed(3)
                MidstarResult = MidstarName + MidstarDeg
            }
        }
        return {
            MansionResult,
            MidstarResult
        }
    })
}