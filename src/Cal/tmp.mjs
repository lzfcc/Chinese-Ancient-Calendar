const Portion2Interval = (a, mode) => { // mode 0 音名 1唱名 
    while (Number(a) < 1) {
        a = a.mul(2)
    }
    while (Number(a) > 2) {
        a = a.div(2)
    }
    a = a.toFraction(false)
    const got = FushionList2.find(obj => obj.freq === a)
    return got
    // if (got) {
    //     if (mode === 0) {
    //         return got.name
    //     } else {
    //         return got.pitch
    //     }
    // } else {
    //     return '沒有音'
    // }
}

const Portion2Pitch = (portion, one, OneDif) => { // 輸入一弦頻率、一弦是否調了，輸出音名
    const Base = frc(one).div(OneDif || 1)
    return Portion2Interval(frc(portion).div(Base).toFraction(false), 1)
}

export const FretPitch = (TuningMode, n) => { // 徽位音。弦法、宮弦
    let { Zhun, Hui, OneDifHui, OneDifZhun } = eval('Tuning' + TuningMode)(432, +n)
    let ZhunPrint = [], HuiPrint = [], ZhunNameList = [], ZhunNameBList = [], HuiNameList = [], HuiNameBList = []
    for (let i = 1; i <= 7; i++) { // 七弦
        let ZhunPitch = [], HuiPitch = [], HuiNameTmp = [], ZhunNameTmp = [], HuiNameBTmp = [], ZhunNameBTmp = []
        let sample = []
        if (Zhun) {
            for (let k = 16; k >= 0; k--) { // 15徽  這樣就行 16=散  我定義的
                // Zhun 準法律七弦散音頻率比    
                ZhunPitch[k] = frc(Zhun[i]).div(Fret2Leng(k)).toFraction(false)
                ZhunNameTmp[k] = Portion2Interval(ZhunPitch[k], 2) // ZhunPitch是頻率比分數 知道頻率比，在對象中找到對應的音名唱名  
                ZhunNameBTmp[k] = Portion2Pitch(ZhunPitch[k], Zhun[1], OneDifZhun || 1) // 上面唱名，這個音名 對
                ZhunPitch[k] += `</br>`
                ZhunPitch[k] += ZhunNameTmp[k] ? ZhunNameTmp[k] + ' ' : ''
                ZhunPitch[k] += ZhunNameBTmp[k] || ''
            }
            ZhunNameList = ZhunNameList.concat(ZhunNameTmp)
            ZhunNameBList = ZhunNameBList.concat(ZhunNameBTmp)
            ZhunPrint = ZhunPrint.concat({
                title: NumList[i],
                data: ZhunPitch
            })
        }
    }
    // 排序
    // ZhunNameList 算一個去一個要去105次，最後只用去1次
    ZhunNameList.sort((obj1, obj2) => obj1.cent - obj2.cent)
    ZhunNameBList.sort((obj1, obj2) => obj1.cent - obj2.cent)
    // 去重 
    ZhunNameList = ZhunNameList.map(obj => obj.nameString(1))
    ZhunNameBList = ZhunNameList.map(obj => obj.nameString(2))

    const ZhunNamePrint = [ZhunNameBList, ZhunNameList]
    return { ZhunPrint, HuiPrint, ZhunNamePrint, HuiNamePrint }
}