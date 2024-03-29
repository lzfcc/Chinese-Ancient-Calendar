import N1 from './newm_quar.mjs'
import N2 from './newm.mjs'
// import N3 from './newm_huihui.mjs'
import P1 from './para_1.mjs'
import P2 from './para_2.mjs'

/**
 * 根據CalName選用模塊
 * @param {*} CalName 
 * @param {*} mode 1朔望氣，2日書，3五星
 * @returns 
 */
export const Bind = CalName => {
    let Type = 0
    let AutoNewm = N2
    let AutoPara = P1
    if (['Yin', 'Zhou', 'Huangdi', 'Lu', 'LuA', 'LuB', 'LuC', 'LuD', 'LuE', 'LuF', 'LuG', 'XiaDong', 'XiaYu', 'ZhuanxuA', 'ZhuanxuB', 'ZhuanxuC', 'ZhuanxuD', 'ZhuanxuE', 'ZhuanxuF', 'Shiji', 'Taichu', 'Qianzaodu', 'EastHan'].includes(CalName)) {
        AutoNewm = N1
        Type = 1 // 四分
    } else if (['Qianxiang', 'Huangchu', 'Jingchu', 'Liuzhi', 'Wangshuozhi', 'Sanji'].includes(CalName)) {
        Type = 2 // 魏晉
    } else if (['Xuanshi', 'Zhengguang', 'Xinghe', 'Tianbao', 'Jiayin', 'Tianhe', 'Daxiang', 'Kaihuang'].includes(CalName)) {
        Type = 3 // 北朝
    } else if (['Yuanjia', 'Daming', 'Liangwu', 'Daye', 'Wuyin'].includes(CalName)) {
        Type = 4 // 南朝
    } else {
        AutoPara = P2
        if (['Jiuzhi', 'Shenlong', 'Futian'].includes(CalName)) {
            Type = 5 // 天竺
        } else if (['Zhangmengbin', 'Liuxiaosun', 'Huangji', 'Linde'].includes(CalName)) {
            Type = 6 // 隋初唐
        } else if (['Dayan', 'Zhide', 'Wuji', 'Zhengyuan', 'Xuanming', 'Qintian'].includes(CalName)) {
            Type = 7 // 唐五代
        } else if (['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian', 'Mingtian', 'Fengyuan', 'Guantian', 'Zhantian'].includes(CalName)) {
            Type = 8 // 北宋
        } else if (['Jiyuan', 'Tongyuan', 'Qiandao', 'Chunxi', 'Huiyuan', 'Tongtian', 'Kaixi', 'Chunyou', 'Huitian', 'Chengtian', 'Bentian'].includes(CalName)) {
            Type = 9 // 南宋。宋志統元、乾道、淳熙、會元合在一起
        } else if (['Yangji', 'NewDaming', 'Yiwei', 'Gengwu'].includes(CalName)) {
            Type = 10 // 遼金元
        } else if (['Shoushi', 'Datong'].includes(CalName)) {
            Type = 11 // 授時
        }
        // else if (['Huihui'].includes(CalName)) {
        //     AutoNewm = N3
        //     AutoPara = P2
        //     Type = 12 // 回回
        // }
        else if (['West'].includes(CalName)) {
            Type = 20
        }
    }
    return {
        AutoNewm,
        AutoPara,
        Type
    }
}

/////////

const CalRange = {
    LuA: [
        [-721, -607]
    ],
    LuB: [
        [-606, -586]
    ],
    LuC: [
        [-585, -566]
    ],
    LuD: [
        [-565, -547]
    ],
    LuE: [
        [-546, -529]
    ],
    LuF: [
        [-528, -508]
    ],
    LuG: [
        [-507, -466]
    ],
    ZhuanxuA: [
        [-365, -306]
    ],
    ZhuanxuB: [
        [-305, -246]
    ],
    ZhuanxuC: [
        [-245, -206]
    ],
    ZhuanxuD: [
        [-205, -183]
    ],
    ZhuanxuE: [
        [-182, -162]
    ],
    ZhuanxuF: [
        [-161, -104] // 文帝後元二年
    ],
    Shiji: [
        [-104, 85]
    ],
    Taichu: [
        [-104, 85]
    ],
    EastHan: [
        [85, 263]
    ],
    Qianxiang: [
        [223, 280]
    ],
    Jingchu: [
        [237, 444]
    ],
    Yuanjia: [
        [445, 509]
    ],
    Daming: [
        [510, 589]
    ],
    Sanji: [
        [384, 417]
    ],
    Xuanshi: [
        [412, 439],
        [452, 522]
    ],
    Zhengguang: [
        [523, 558]
    ],
    Xinghe: [
        [540, 550]
    ],
    Tianbao: [
        [551, 577]
    ],
    Liangwu: [
        [559, 565]
    ], // 用梁武大同來補明克讓
    Tianhe: [
        [566, 578]
    ],
    Daxiang: [
        [579, 583]
    ],
    Kaihuang: [
        [584, 596]
    ],
    Daye: [
        [597, 618]
    ],
    Wuyin: [
        [619, 664]
    ],
    Linde: [
        [665, 728]
    ],
    Dayan: [
        [729, 757]
    ],
    Zhide: [
        [758, 762]
    ],
    Wuji: [
        [762, 783]
    ],
    Zhengyuan: [
        [784, 806]
    ],
    Xuanming: [
        [807, 892],
        [994, 1136]
    ],
    Chongxuan: [
        [893, 955]
    ],
    Qintian: [
        [956, 963]
    ],
    Futian: [
        [961, 993]
    ],
    Yangji: [
        [1127, 1279]
    ],
    NewDaming: [
        [1180, 1280]
    ],
    Yingtian: [
        [964, 982]
    ],
    Qianyuan: [
        [983, 1000]
    ],
    Yitian: [
        [1001, 1023]
    ],
    Chongtian: [
        [1024, 1064],
        [1068, 1074]
    ],
    Mingtian: [
        [1065, 1067]
    ],
    Fengyuan: [
        [1075, 1093]
    ],
    Guantian: [
        [1094, 1102]
    ],
    Zhangtian: [
        [1103, 1105]
    ],
    Jiyuan: [
        [1106, 1135],
        [1136, 1166] // 1151復用紀元。統元期間參用紀元
    ],
    Tongyuan: [
        [1136, 1167]
    ],
    Qiandao: [
        [1168, 1176]
    ],
    Chunxi: [
        [1177, 1190]
    ],
    Huiyuan: [
        [1191, 1198]
    ],
    Tongtian: [
        [1199, 1207],
        [1208, 1250] // 開禧期間與統天並推
    ],
    Kaixi: [
        [1208, 1250]
    ],
    Chunyou: [
        [1251, 1252]
    ],
    Huitian: [
        [1253, 1270]
    ],
    Chengtian: [
        [1271, 1276],
    ],
    Bentian: [
        [1277, 1279]
    ],
    Shoushi: [
        [1281, 1367]
    ],
    Datong: [
        [1368, 1662]
    ],
}

export const AutoCal = year => {
    const Cals = []
    for (const [Cal, ranges] of Object.entries(CalRange)) {
        for (const [start, end] of ranges) {
            if (year >= start && year <= end) {
                Cals.push(Cal)
                break
            }
        }
    }
    if (Cals.length === 0) {
        console.log('年份範圍 -721 至 1662')
    }
    return Cals
}

export const OverlapCalendars = (start, end) => {
    const result = {}
    for (const [Cal, ranges] of Object.entries(CalRange)) {
        for (const range of ranges) {
            const [left, right] = [Math.max(start, range[0]), Math.min(end, range[1])]
            if (!result[Cal]) {
                result[Cal] = []
            }
            if (left < right) {
                result[Cal].push([left, right])
            }
        }
    }
    return result
}