export default {
    Yin: {
        Type: 1,
        Denom: 940, // 日法
        Lunar: 27759 / 940, // 朔策
        Solar: 365.25, // 歲實
        OriginAd: -2760366, // 上元積年的公曆。近距-1566
        // JdOrigin: 1704250.5,
        JdWinsols: 1704250.5 + 46 * 365.25,
        OriginYearSc: 51, // 上元年干支甲寅
        ZhengNum: 0, // 年首子月。這兩個一定要記得一起調
        OriginMonNum: 0, // 正月建子
        YuanRange: 4560, // 元
        JiRange: 1520, // 紀
        BuRange: 76, // 蔀
        isTermLeap: 0, // 是否用無中氣置閏法
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Zhou: {
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2760423, // -1623
        // JdOrigin: 1683430.5,
        JdWinsols: 1721051.25,
        OriginYearSc: 54,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Huangdi: {
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        // JdOrigin: 1783510.5,
        JdWinsols: 1721052.75,
        OriginAd: -2760149, // -1349
        OriginYearSc: 28,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Lu: { // 無加小餘
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680, // -4880
        // OriginAd: -2763680 + 2880, // 經學與曆學的貫通p155錯誤積年
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Lu1: { // 無加小餘建丑
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 1,
        OriginMonNum: 1,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuA: { // 隱元-721,宣元-607
        Type: 1,
        ApplyYear: [[-721, -666]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 1,
        OriginMonNum: 1, // 隱元建丑
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 539 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuA1: { // 隱元-721,宣元-607
        Type: 1,
        ApplyYear: [[-665, -607]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0, // 隱元建丑
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 539 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuB: { // 宣二-606，成四-586
        Type: 1,
        ApplyYear: [[-606, -586]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 469 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuC: { // 成五-585，襄六-566
        Type: 1,
        ApplyYear: [[-585, -566]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 403 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuD: { // 襄七-565，襄廿五-547
        Type: 1,
        ApplyYear: [[-565, -547]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 348 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuE: { // 襄廿六-546，昭十二-529
        Type: 1,
        ApplyYear: [[-546, -529]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 280 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuF: { // 昭十三-528，定元-508
        Type: 1,
        ApplyYear: [[-528, -508]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 213 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuG: { // -507，-466
        Type: 1,
        ApplyYear: [[-507, -466]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 147 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    XiaDong: { // 冬至曆元夏曆
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2759875, // -1075
        // JdOrigin: 1883590.5,
        JdWinsols: 1721054.25,
        OriginYearSc: 2,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0, // 0:固定冬至，1:無中氣
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    XiaYu: { // 雨水曆元夏曆
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -60.875, // 冬至距雨水日數
        WinsolsOriginMon: -(2 + 7 / 114), // 冬至距雨水閏餘
        OriginAd: -2759875,
        // JdOrigin: 1883650.5,
        JdWinsols: 1721053.375,
        OriginYearSc: 2,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Zhuanxu1: { // 楚曆顓頊大正
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2760366, // -1566
        OriginYearSc: 51, // 甲寅元
        ZhengNum: -1,
        OriginMonNum: -1,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0, // 0:固定冬至，1:無中氣
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Zhuanxu2: {
        Type: 1,
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305, // -1505
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52, // 曆元距甲子日數
        BuScCorr: 5,
        ZhengNum: 2, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        DayCorr: 4 / 24, // 寅正爲日始
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuA: {
        Type: 1,
        ApplyYear: [[-365, -306]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305, // -1505
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52, // 曆元距甲子日數
        BuScCorr: 5,
        ZhengNum: 2, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuB: { // 朱桂昌《顓頊日曆表》：暫定秦昭王元年前306行十月爲歲首
        Type: 1,
        ApplyYear: [[-305, -246]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        BuScCorr: 5,
        ZhengNum: -1,
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuC: { // 秦始皇元年前246朔餘增加3/4日。《顓頊日曆表》第545頁
        Type: 1,
        ApplyYear: [[-245, -206]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        BuScCorr: 5,
        ZhengNum: -1,
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 3 / 4,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuD: { // 高帝元年前206朔餘減少210分
        Type: 1,
        ApplyYear: [[-205, -183]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        BuScCorr: 5,
        ZhengNum: -1,
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 3 / 4 - 210 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuE: { // 前162年改變閏章（但我看他提供的資料，應該是前186-182之間變化），減朔餘25分。《顓頊日曆表》第544頁：出土資料的閏年：前251、208、205、202、199、197、191、186、180、164、153、151、134、129、110
        Type: 1,
        ApplyYear: [[-182, -162]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        BuScCorr: 5,
        ZhengNum: -1,
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 1,
        WinsolsCorr: 3 / 4 - 210 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuF: {
        Type: 1,
        ApplyYear: [[-161, -104]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsOriginDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        BuScCorr: 5,
        ZhengNum: -1,
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 1,
        WinsolsCorr: 3 / 4 - 235 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    TaiyiJiayin: {
        Type: 1,
        Denom: 940, // 日法
        Lunar: 27759 / 940, // 朔策
        Solar: 365.25, // 歲實
        OriginAd: -103 - 284183,
        OriginYearSc: 51, // 上元甲寅
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560, // 元
        JiRange: 1520, // 紀
        BuRange: 76, // 蔀
        isTermLeap: 1, // 是否用無中氣置閏法        
    },
    Shiji: {
        Type: 1,
        ApplyYear: [[-104, 85]],
        Denom: 940, // 日法
        Lunar: 27759 / 940, // 朔策
        Solar: 365.25, // 歲實
        OriginAd: -1566, // 上元積年的公曆
        // JdOrigin: 1704249.75,
        JdWinsols: 1704249.75 + 46 * 365.25,
        EcliRange: 135 / 23,
        EcliNumer: 513,
        Node: 27.212729649262943,
        OriginYearSc: 0, // 上元年干支
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560, // 元
        JiRange: 1520, // 紀
        BuRange: 76, // 蔀
        isTermLeap: 1, // 是否用無中氣置閏法
        WinsolsCorr: -0.75, // 去掉零頭。太初曆藉半日法其實就已經是去掉零頭了的
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Taichu: {
        Type: 1,
        ApplyYear: [[-104, 85]],
        Denom: 81,
        Lunar: 2392 / 81,
        Solar: 365 + 385 / 1539,
        OriginAd: -143230,
        OriginCloseAd: -103,
        // JdOrigin: 1683430.5,
        JdWinsols: 1683430.5 + 103 * 365.25,
        OriginYearSc: 13,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4617, // 元法
        TongRange: 1539, // 統法
        isTermLeap: 1,
        // MansionRaw: [8, 26], // 牽牛初度。
        MansionRaw: [9, 0], // 這兩個結果都等於牛0
        MansionFractPosition: 8,
        EcliRange: 135 / 23,
        EcliNumer: 513,
        Node: 27 + 187 / 879,
    },
    Qianzaodu: {
        Type: 1,
        Denom: 81,
        Lunar: 2392 / 81,
        Solar: 365 + 385 / 1539,
        OriginAd: -2760366,
        // JdOrigin: 1704250.5,
        JdWinsols: 1721052,
        OriginYearSc: 51,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Yuanmingbao: {
        Type: 1,
        Denom: 81,
        Lunar: 2392 / 81,
        Solar: 365 + 385 / 1539,
        OriginAd: -103 - 2760377,
        OriginYearSc: 57,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Easthan: {
        Type: 1,
        ApplyYear: [[85, 263]],
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2760480,
        OriginCloseAd: -160,
        // JdOrigin: 1662610.5,
        JdWinsols: 1662610.5 + 160 * 365.25,
        OriginYearSc: 17,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 1,
        EcliRange: 135 / 23,
        EcliNumer: 513,
        Node: 27 + 5859 / 27542,
        MansionRaw: [8, 21.25], // 斗21度235分
        MansionFractPosition: 8,
        // DayLight: [45, 45 + 8 / 32, 46 + 8 / 32, 48 + 6 / 32, 50 + 8 / 32, 53 + 3 / 32, 55 + 8 / 32, 58 + 3 / 32, 60 + 5 / 32, 62 + 4 / 32, 63 + 9 / 32, 64 + 9 / 32, 65, 64 + 7 / 32, 63 + 8 / 32, 62 + 3 / 32, 60 + 2 / 32, 57 + 8 / 32, 55 + 2 / 32, 52 + 6 / 32, 50 + 3 / 32, 48 + 2 / 32, 46 + 7 / 32, 45 + 5 / 32], // 四分、乾象、景初。正光興和沒有漏刻
        NightList: [27.5, 27.375, 26.875, 25.90625, 24.875, 23.453125, 22.375, 20.953125, 19.921875, 18.9375, 18.359375, 17.859375, 17.5, 17.890625, 18.375, 18.953125, 19.96875, 21.375, 22.46875, 23.90625, 24.953125, 25.96875, 26.890625, 27.421875, 27.5], // 夜半漏
        DialList: [13, 12.3, 11, 9.6, 7.95, 6.5, 5.25, 4.15, 3.2, 2.52, 1.98, 1.68, 1.5, 1.7, 2, 2.55, 3.33, 4.35, 5.5, 6.85, 8.4, 10, 11.4, 12.56, 13], // 節氣晷長
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 太陽去極度。111弱我暫時處理成110+11/12。106少強改成少弱
    },

    /////////////////魏晉/////////////////////
    // if (!Node) {
    //     Node = Lunar * EcliRange / (0.5 + EcliRange) // 獨創發明！以皇極驗之，完全符合
    // }
    Qianxiang: {
        Type: 2,
        ApplyYear: [[223, 280]],
        Solar: 365 + 145 / 589, // 歲實 
        SolarNumer: 215130,
        SolarDenom: 589,
        LunarNumer: 43026, // 通法。會通=LunarNumer/(12/2)
        Denom: 1457, // 日法
        Lunar: 29 + 773 / 1457, // 朔策。月19年行天254週，小週：254
        // SurConst: 29, //  餘率 Math.floor(Lunar) 
        // TianDiConst: 25 + 30, // 天地凡數
        EcliRange: 11045 / 1882, // 月食週期
        EcliNumer: 11045, // 會月
        EcliDenom: 1882, // 會率。一半是朔望合數：初交到再交
        Node: 27.212150734997284,
        // exCycleFractConst: 1825 + 7 / 47, // 過週分 ((huiConst + TianDiConst) * SurConst ** 2) / huiConst 
        Anoma: 27 + 3303 / 5969, // 近點月=歷日數=(過週分+週天)/月週。週天=Solar*JiRange。月週（每紀恆星月數）=小週*JiRange/19。恆星月=週天/月週
        AnomaNumer: 164466, // 歷週。歷日數：164466 / 5969
        // AnomaFract: 3303, // 週日分。少大法=cycleDayFract/3
        AnomaDenom: 5969, // 週日法。週虛=5969-cycleDayFract。通週=5969*31
        // SynodicAnomaDif: 11801 + 25 / 31, // 朔行分=(小週/2)*LunarNumer/通數 - pasScycle。朔行分卽朔望月交點月之差的5969倍。程序中我沒用5969倍
        // 乾象還沒有交點月。JiDay/每紀月行週數=27 + 2532 / 7874 。紀行週=254*589/19=7874。歷日=(27 + 2532 / 7874)/2。紀日215130/2=歷週107565.每紀月行週數就是每日月行分數
        MoonAcrVList: [276, 275, 273, 270, 266, 262, 258, 254, 250, 246, 243, 239, 236, 234, 233, 234, 236, 239, 243, 246, 250, 254, 258, 262, 266, 270, 273, 275 + (4093 + 202 / 1101) / 5969, 276],
        MoonDifAccumList: [0, 22, 43, 62, 78, 90, 98, 102, 102, 98, 90, 79, 64, 46, 26, 5, -15, -33, -48, -59, -67, -71, -71, -67, -59, -47, -31, -12, 9.68574023615],
        MoonLatiDifList: [17, 16, 15, 12, 8, 4, 1, -2, -6, -10, -13, -15, -16, -(16 + 306 / 473)], // 乾象陰陽曆。/12爲度
        MoonLatiAccumList: [0, 1.4166666666666667, 2.75, 4, 5, 5.666666666666667, 6, 6.083333333333333, 5.916666666666667, 5.416666666666667, 4.583333333333333, 3.5, 2.25, 0.916666666666667, -0.4705778717406],
        // y = parseFloat((-0.0011792 * x ** 4 + 0.070674 * x ** 3 - 1.1513 * x ** 2 + 2.7606 * x + 273.65).toPrecision(12))
        OriginAd: 206 - 7377, // 上元積年的公元 內紀。-103
        CloseOriginAd: 206,
        // JdOrigin: 1796291.56961 - 7377 * (365 + 145 / 589), // -103年癸亥朔，並非甲子夜半朔旦冬至。定朔1683430.240082638
        OriginYearSc: 26, // 上元年干支
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 1178, // 元：乾法，內紀外紀
        JiRange: 589, // 紀法，每紀31章，31:通數
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 22], // 斗22度
        MansionFractPosition: 8, // 斗分所加在斗
    },
    Huangchu: { // 開元占經。「太史丞韓詡以爲乾象減斗分太過，後當先天，造黃初曆」看開元占經的斗分，確實比乾象大。
        Type: 2,
        Solar: 365 + 1205 / 4883, // 歲實。。年月跟王朔之一樣
        SolarNumer: 1783500, // 週天
        SolarDenom: 4883,
        Lunar: 29 + 6409 / 12079, // 朔策。經6409.
        LunarNumer: 356700, // 月法
        Denom: 12079, // 
        Anoma: 27 + 6698 / 12079, // 闕，按景初比例補之
        AnomaNumer: 332831,
        OriginAd: 220 - 31578, // 開元占經有問題，以景初爲準移之+ 722。《疇人傳》「上元壬午至黃初元年庚子，積三萬一千五百七十八算外」
        // JdOrigin: 1801769.6790 - 31578 * (365 + 1204 / 4883), // 220-12-23癸未
        CloseOriginAd: 220,
        OriginYearSc: 19, // 上元壬午。
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 9766, // 元法。闕，假設是2倍
        JiRange: 4883, // 紀法
        ZhangRange: 19,
        ZhangLeap: 7,
        AnomaCorr: 220000, // 闕，據紀差77194、以景初爲準補之
        // FirstCorr: -8.2,
        MansionRaw: [8, 22], // 闕，以乾象補之
        MansionFractPosition: 8,
    },
    Jingchu: {
        Type: 2,
        ApplyYear: [[237, 451]],
        Solar: 365 + 455 / 1843, // 歲實。斗分：455。
        SolarNumer: 673150, // 紀日673150
        SolarDenom: 1843,
        LunarNumer: 134630, // 通數。 // const TongRange = JiRange / ZhangRange // 通數
        Denom: 4559, // 日法=97*47。47:通法
        Lunar: 29 + 2419 / 4559, // 朔策。月19年行天254週，小週：254
        Anoma: 27 + 2528 / 4559, // 近點月、交點月=歷日數=(過週分+週天)/月週。// AnomaFract: 2528 週日日餘。週虛=Denom-AnomaFract
        AnomaNumer: 125621, // 通週。歷日數：164466 / 5969
        AnomaCorr: 103947, // 甲子紀的遲疾差率，實測得出
        EcliRange: 5 + 116960 / 134630, // 分母是朔實
        EcliNumer: 790110, // 會通
        EcliCorr: 412919 / 790110, // 甲子交會差率
        Node: 27.2122009856701,
        YinyangCorr: -1,
        MoonAcrVList: [280, 277, 274, 271, 267, 261, 254, 248, 244, 241, 239, 236, 233, 231, 233, 235, 237, 240, 243, 246, 250, 254, 259, 265, 271, 277, 278, 279 + 626 / 86621, 280],
        MoonDifAccumList: [0, 26, 49, 69, 86, 99, 106, 106, 100, 90, 77, 62, 44, 23, 0, -21, -40, -57, -71, -82, -90, -94, -94, -89, -78, -61, -38, -14, 11.0072268849],
        OriginAd: 237 - 4045, // 上元積年的公元
        CloseOriginAd: 237,
        // JdOrigin: 1807614.129951 - 4045 * (365 + 455 / 1843),
        OriginYearSc: 29, // 上元壬辰
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 11058, // 元法
        JiRange: 1843, // 紀法。紀月：22795。日數：673150。每年月行254/19週，每紀24638（月週）
        ZhangRange: 19,
        ZhangLeap: 7,
        // MansionRaw: [8, 22], // 斗22度
        MansionRaw: [8, 21.25], // 《中國古代曆法》27頁
        MansionFractPosition: 8,
    },
    Liuzhi: { // 晉志下、開元占經。武帝侍中平原劉智，以斗曆改憲，推四分法，三百年而減一日，以百五十爲度法，三十七爲斗分。推甲子爲上元，至泰始十年，歲在甲午，九萬七千四百一十一歲，上元天正甲子朔夜半冬至，日月五星始于星紀，得元首之端。飾以浮說，名爲正曆。
        Type: 2,
        Solar: 365 + 37 / 150, // 歲實
        SolarNumer: 54787,
        SolarDenom: 150,
        Lunar: 29 + 18703 / 35250, // 朔策。闕，據「紀日1040953，紀月35250，餘18703」補之。交會通6109174不知何指
        LunarNumer: 1040953, // 
        Denom: 35250, //         
        Anoma: 27 + 19547 / 35250, // 闕，據景初補之
        AnomaNumer: 971297,
        AnomaCorr: 620000, // 闕。據紀差906481補之
        OriginAd: 274 - (97411 + 1823), // 晉泰始十年。不太對，據景初調整。但這是正史的數據，再看看。
        CloseOriginAd: 274,
        // JdOrigin: 1821128.2200 - (97411 + 1823) * (365 + 37 / 150),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 17100, // 元法闕，我算得171000
        JiRange: 2850, // 紀法。
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 21], // 占經：冬至斗21度.晉志：[25, 0]
        MansionFractPosition: 8, // 闕
    },
    Wangshuozhi: { // 晉志
        Type: 2,
        Solar: 365 + 1205 / 4883,
        SolarNumer: 1783500,
        SolarDenom: 4883,
        Lunar: 29 + 6409 / 12079, // 闕，劉洪濤補，第237頁。紀月60395
        LunarNumer: 356700, // 通數，闕
        Denom: 12079, //         
        Anoma: 27 + 36197 / 65278, // 闕，據景初補之。分母月週，劉洪濤補
        AnomaNumer: 1798703,
        AnomaCorr: 811000, // 闕，據紀差1629372補之
        OriginAd: 352 - (97000 - 864), // 永和八年。原來的數字不對， 改後嚴絲合縫。
        CloseOriginAd: 352,
        //+1205,+2533,-464這三個方案都不好
        // JdOrigin: 1849614.4156 - (97000 - 864) * (365 + 1205 / 4883),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 4883, // 元法闕，我算得等於紀法
        JiRange: 4883, // 紀法。
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 19], // 闕，酌情調整
        MansionFractPosition: 8,
    },
    Sanji: { //晉書律曆下，開元占經卷105。始悟以月食衝檢日宿度所在。劉洪濤238頁
        // 周天/紀法 / (通數/日法) = 895220/2451 / (179044/6062) = 12 898/2451
        Type: 2,
        ApplyYear: [[384, 417]],
        Solar: 365 + 605 / 2451, // 605:斗分
        SolarNumer: 895220, // 週天、紀日
        SolarDenom: 2451,
        Lunar: 29 + 3217 / 6063, // 朔策。月19年行天254週，小週：254
        LunarNumer: 179044, // 通數
        Denom: 6063, // 日法。原文日法誤6062        
        Anoma: 27 + 3362 / 6063, // 近點月。月週=254*2451/19=32766。週日日餘3362
        AnomaNumer: 167063, // 通週
        AnomaCorr: 86178, // 本來是49178
        EcliRange: 11045 / 1882, // 會月/會率。會率/2=朔望合數。893:會歲會月-朔望合數=11045-941=入交限
        EcliCorr: 12700 / 11045, // 原來是 9157 / 11045
        Node: 27.212199762772333,
        OriginAd: 384 - 83840, // 晉孝武太元九年甲申
        CloseOriginAd: 384,
        // JdOrigin: 1861305.400041 - 83840 * (365 + 605 / 2451),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 7353, // 元法。元月90945
        JiRange: 2451, // 紀月30315，紀日895220
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 17], // 占經：斗17度，《中國數理天文學》頁193
        MansionFractPosition: 8, // 闕
    },
    Xuanshi: { // 開元占經卷105、疇人傳卷第六
        // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js 《梁趙厯》上元甲寅，至今六萬一千七百四十算上。 元法四十三萬二千，紀法七萬二千，蔀法七千二百，章歲六百，章月七千四百二十一（亦曰時法），章閏二百二十二，周天二百六十二萬九千七百五十九，亦曰通數餘數三萬七千七百五十九，斗分一千七百五十九，日法八萬九千五十二，亦曰蔀日月周九萬六千二百五十二，小周八千二十二，會數一百七十三，度餘二萬七千七百一十九，會虛六萬一千三百三十三，交會差一百四十七，度餘三千三百一十一，遲疾差六百餘四千五百三十，周日二十七日，餘四萬九千三百八十，周虛三萬九千六百七十二。
        // 上元甲寅，至今(開元2年)61740算上。元法432000，紀法72000，蔀法7200，章歲600，章月7421，(亦曰時法)章閏222，周天2629759，(亦曰通數)餘數37759，斗分1759，日法89052，(亦曰蔀)日月周96252，小周8022，會數173，度餘27719，會虛61333，交會差147，度餘3311，遲疾差600餘4530，周日27日，餘49380，周虛39672。
        // 疇人傳卷第六: 趙𢾺，河西人也。善曆算。沮渠蒙遜元始時，修元始術。上元甲寅至元始元年壬子，積六萬一千四百三十八算上，元法四十三萬二千，紀法七萬二千，蔀法七千二百。章歲六百，章月七千四百二十一，亦曰時法。章閏二百二十一，周天二百六十二萬九千七百五十九，亦曰通數。餘數三萬七千七百五十九，斗分一千七百五十九，日法八萬九千五十二，亦曰蔀月。月周九萬六千二百五十二，小周八千二十一，會數一百七十三，度餘二萬七千七百一十九，會虛六萬一千三百三十三，交會差一百四十七，度餘三千三百一十一，遲疾差六百，餘四萬一千五百三十。周日二十七，日餘四萬九千三百八十。周虛三萬九千六百七十二。《宋書 大且渠蒙遜傳》、《魏書 律曆志》、《開元占經》
        // 上元甲寅至元始元年壬子，積61438算上，元法432000，紀法72000，蔀法7200。章歲600，章月7421，亦曰時法。章閏221，周天2629759，亦曰通數。餘數37759，斗分1759，日法89052，亦曰蔀月。月周96252，小周8021，會數173，度餘27719，會虛61333，交會差147，度餘3311，遲疾差600，餘41530。周日27，日餘49380。周虛39672。
        Type: 3,
        ApplyYear: [[412, 439], [452, 522]],
        Solar: 365 + 1759 / 7200,
        SolarNumer: 2629759, // 週天、通數
        SolarDenom: 7200,
        Lunar: 29 + 47251 / 89052, // 朔策。
        LunarNumer: 2629759, // 
        Denom: 89052, // 日法、蔀日        
        Anoma: 27 + 49380 / 89052, // 近點月。月週96252
        AnomaNumer: 2453784,
        AnomaCorr: 600000, // 「遲疾差600」紀差795624
        EcliRange: 15433715 / 2629759, // 闕。交會週期=會通/週天。會數173+(89052-61333,度餘27719)/89052日一交=會通/日法。分子爲會餘。所以會通=15433715
        EcliCorr: -2300000 / 15433715, // 不知道怎麼補，瞎填一個 -2300000 / 15433715
        Node: 27.212245523296843,
        OriginAd: 412 - 61438, // 玄始元年壬子
        CloseOriginAd: 412,
        // JdOrigin: 1871530.1447 - 61438 * (365 + 1759 / 7200),
        OriginYearSc: 51, // 上元甲寅
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 432000, // 元法
        JiRange: 72000, // 紀日26297590，
        BuRange: 7200, // 蔀法
        ZhangRange: 600, // 章月、時法7421
        ZhangLeap: 221,
        MansionRaw: [8, 16], // 闕，酌情處理
        MansionFractPosition: 8,
    },
    Tsrengguang: {
        Type: 3,
        ApplyYear: [[523, 558]],
        Solar: 365 + 1477 / 6060, // 歲實.斗分：1477，
        SolarNumer: 2213377, // 週天分
        SolarDenom: 6060,
        Lunar: 29 + 39769 / 74952, // 朔策。
        LunarNumer: 2213377, // 月法
        Denom: 74952, // 日法=蔀月        
        Anoma: 27 + 41562 / 74952, // 近點月。277:週日。41562：週日餘
        AnomaNumer: 2065266, // 通週
        AnomaCorr: 24 * 74952 + 63568, // 而交會差就是空
        EcliRange: 5 + 1923019 / 2213377,
        Node: 27.212219336007635,
        // MoonAcrVList: [(14 + 361 / 505), (14 + 300 / 505), (14 + 236 / 505), (14 + 171 / 505), (14 + 99 / 505), (13 + 471 / 505), (13 + 266 / 505), (13 + 61 / 505), (12 + 439 / 505), (12 + 338 / 505), (12 + 237 / 505), (12 + 136 / 505), (12 + 35 / 505), (11 + 464 / 505), (12 + 36 / 505), (12 + 109 / 505), (12 + 189 / 505), (12 + 290 / 505), (12 + 392 / 505), (12 + 496 / 505), (13 + 118 / 505), (13 + 243 / 505), (13 + 388 / 505), (14 + 29 / 505), (14 + 174 / 505), (14 + 287 / 505), (14 + 312 / 505), (14 + (339 + 9684 / 41562) / 505), (14 + 361 / 505)], // 《古代曆法計算法》第328頁有誤，4日是171而非176
        MoonAcrVList: [7431, 7370, 7306, 7241, 7169, 7036, 6831, 6626, 6499, 6398, 6297, 6196, 6095, 6019, 6096, 6169, 6249, 6350, 6452, 6556, 6683, 6808, 6953, 7099, 7244, 7357, 7382, 7409.233001299263],
        MoonDifAccumList: [0, 680, 1299, 1854, 2344, 2762, 3047, 3127, 3002, 2750, 2397, 1943, 1388, 732, 0, -655, -1237, -1739, -2140, -2439, -2634, -2702, -2645, -2443, -2095, -1602, -996, -365, 293],
        OriginAd: 522 - 167750, // 壬寅
        CloseOriginAd: 522,
        // JdOrigin: 1911706.1023 - 167750 * (365 + 1477 / 6060),
        OriginYearSc: 49, // 上元壬子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 363600, // 元法，6紀
        JiRange: 60600, // 1紀10蔀
        TongRange: 121200, // 統法，1統2紀
        BuRange: 6060, // 蔀法、度法。蔀日=月通
        ZhangRange: 505, // 章法，1蔀12章 
        ZhangLeap: 186, // 閏餘。每年月數：12+186/505
        MansionRaw: [8, 15], // 斗15度
        MansionFractPosition: 8, // 經斗除分
    },
    Xinghe: {
        Type: 3,
        ApplyYear: [[540, 550]],
        Solar: 365 + 4117 / 16860, // 歲實.斗分：4177，
        SolarNumer: 6158017, // 週天
        SolarDenom: 16860,
        Lunar: 29 + 110647 / 208530, // 朔策。經月餘：110647.度分=日法-經月餘=97883
        LunarNumer: 6158017, // 通數、週天
        Denom: 208530, // 日法=蔀月        
        Anoma: 27 + 115631 / 208530, // 近點月。27:週日，115631:週餘。週虛=日法-週餘=92899
        AnomaNumer: 5745941, // 通週
        EcliRange: 36142807 / 6158017,
        Node: 27.21237997247385,
        // MoonAcrVList: [(14 + 402 / 562), (14 + 334 / 562), (14 + 261 / 562), (14 + 190 / 562), (14 + 111 / 562), (13 + 522 / 562), (13 + 296 / 562), (13 + 68 / 562), (12 + 486 / 562), (12 + 379 / 562), (12 + 267 / 562), (12 + 151 / 562), (12 + 40 / 562), (11 + 515 / 562), (12 + 38 / 562), (12 + 123 / 562), (12 + 211 / 562), (12 + 324 / 562), (12 + 435 / 562), (12 + 555 / 562), (13 + 128 / 562), (13 + 270 / 562), (13 + 432 / 562), (14 + 33 / 562), (14 + 194 / 562), (14 + 319 / 562), (14 + 346 / 562), (14 + 379 / 562), (14 + 402 / 562)],
        MoonAcrVList: [8270, 8202, 8129, 8058, 7979, 7828, 7602, 7374, 7230, 7123, 7011, 6895, 6784, 6697, 6782, 6867, 6955, 7068, 7179, 7299, 7434, 7576, 7738, 7901, 8062, 8187, 8214, 8247],
        MoonDifAccumList: [0, 757, 1446, 2062, 2607, 3073, 3388, 3477, 3338, 3055, 2665, 2163, 1545, 816, 0, -731, -1377, -1935, -2380, -2714, -2928, -3007, -2944, -2719, -2331, -1782, -1108, -407, 327],
        OriginAd: 540 - 293996, // 庚申
        CloseOriginAd: 540,
        // JdOrigin: 1918280.6265 - 293996 * (365 + 4117 / 16860),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1011600, // 元法，6紀
        JiRange: 168600, // 1紀10蔀
        TongRange: 337200, // 統法，1統2紀
        BuRange: 16860, // 蔀法、度法。蔀日=月通
        ZhangRange: 562, // 章法，1蔀30章.章中：6744
        ZhangLeap: 207, // 閏餘。每年月數：12+186/505
        MansionRaw: [8, 15], // 斗15度
        MansionFractPosition: 8,
    },
    Tianbao: { // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js // 嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        Type: 3,
        ApplyYear: [[551, 577]],
        Solar: 365 + 5787 / 23660, // 
        SolarNumer: 8641687, // 週天、蔀日，通數，沒分
        SolarDenom: 23660,
        Lunar: 29 + 155272 / 292635, // 朔策
        LunarNumer: 8641687, // 月法
        Denom: 292635, // 日法=蔀月
        // 餘數124087(亦名没分)
        Anoma: 27 + 162261 / 292635, // 近點月。歷餘162261
        AnomaNumer: 8063406, // 通週。週虛130374。小週9037.月週316295.虛分137363
        EcliRange: 50716913 / 8641687, // 「甲子紀差分空」
        Node: 27.212243804560554,
        // MoonAcrVList: [14 + 483 / 676, 14 + 401 / 676, 14 + 314 / 676, 14 + 228 / 676, 14 + 133 / 676, 13 + 630 / 676, 13 + 356 / 676, 13 + 82 / 676, 12 + 587 / 676, 12 + 454 / 676, 12 + 320 / 676, 12 + 182 / 676, 12 + 47 / 676, 11 + 621 / 676, 12 + 46 / 676, 12 + 146 / 676, 12 + 253 / 676, 12 + 389 / 676, 12 + 524 / 676, 12 + 665 / 676, 13 + 155 / 676, 13 + 324 / 676, 13 + 519 / 676, 14 + 39 / 676, 14 + 233 / 676, 14 + 384 / 676, 14 + 417 / 676, 14 + (465 + 117513 / 162261) / 676, 14 + 483 / 676], // 原闕，嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        MoonAcrVList: [9947, 9865, 9778, 9692, 9597, 9418, 9144, 8870, 8699, 8566, 8432, 8294, 8159, 8057, 8158, 8258, 8365, 8501, 8636, 8777, 8943, 9112, 9307, 9503, 9697, 9848, 9881, 9929.724222086637],
        MoonDifAccumList: [0, 910, 1738, 2479, 3134, 3694, 4075, 4182, 4015, 3677, 3206, 2601, 1858, 980, 0, -879, -1658, -2330, -2866, -3267, -3527, -3621, -3546, -3276, -2810, -2150, -1339, -495, 398],
        OriginAd: 550 - 110526, // 天保元年庚午
        CloseOriginAd: 550,
        // JdOrigin: 1921934.0571 - 110526 * (365 + 5787 / 23660),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1419600, // 元法，6紀
        JiRange: 236600, // 原文的數字是20036600
        BuRange: 23660, // 蔀法、度法
        ZhangRange: 676, // 章歲
        ZhangLeap: 249,
        MansionRaw: [8, 15], // 「命起牛前十二度」斗15
        MansionFractPosition: 8, // 闕，應該就是斗分
    },
    Jiayin: { // 嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        Type: 3,
        Solar: 365 + 5461 / 22338,
        SolarNumer: 8158831, // 週天、蔀日，通數，沒分
        SolarDenom: 22338,
        Lunar: 29 + 146595 / 276284, //《古代曆法計算法》第615頁 (146595 + 2 / 657) / 276284，不知道他是怎麼算出小數的，不要小數正好
        Denom: 22338, // 日法
        Anoma: 27 + 153225 / 276284, // 近點月。闕
        // AnomaCorr: 85000, // 闕，據紀差214931酌情增補。照理說應該是空，以後再說。這是嚴敦傑積年的情況
        OriginAd: 576 - 1010382, // 武平四年癸巳 // 嚴敦傑573 - 123399
        CloseOriginAd: 576,
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1340280, // 元法。闕，我假設是紀法的6倍
        JiRange: 223380, // 闕，我假設是蔀法的10倍
        BuRange: 22338, // 蔀法、度法。蔀日8158831
        ZhangRange: 657, // 章歲。章月8126.蔀月276284
        ZhangLeap: 242,
        MansionRaw: [8, 15], // 闕，酌情處理
        MansionFractPosition: 8,
    },
    Tianhe: { // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js 及武帝時，甄鸞造《天和曆》。上元甲寅至天和元年丙戌，積八十七萬五千七百九十二算外，章歲三百九十一，蔀法二萬三千四百六十，日法二十九萬一百六十，朔餘十五萬三千九百九十一，斗分五千七百三十一，會餘九萬三千五百一十六，曆餘一十六萬八百三十，冬至斗十五度，參用推步。終於宣政元年。
        // 及武帝時，甄鸞造《天和曆》。上元甲寅(50)至天和元年(566)丙戌(22)，積875792算外，章歲391，蔀法23460，日法290160，朔餘十五萬三千九百九十一，斗分5731，會餘93516，曆餘160830，冬至斗十五度，3用推步。終於宣政元年。
        Type: 3,
        ApplyYear: [[566, 578]],
        Solar: 365 + 5731 / 23460,
        SolarNumer: 8568631, // 週天
        SolarDenom: 23460,
        Lunar: 29 + 153991 / 290160, // 朔策
        LunarNumer: 8568631, //
        Denom: 290160, // 日法。
        Anoma: 27 + 160830 / 290160, // 歷餘160830
        AnomaNumer: 7995150,
        EcliRange: 50291196 / 8568631, // 173+ 93516/290160=會通/8568631。實驗得天保、天和甲子紀差交會遲疾並空
        Node: 27.21247526807761,
        OriginAd: 566 - 875792, // 天和元年丙戌
        CloseOriginAd: 566,
        // JdOrigin: 1927776.1075 - 875792 * (365 + 5731 / 23460),
        OriginYearSc: 51, // 上元甲寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1407600, // 元法闕，我算得
        JiRange: 234600, // 闕
        BuRange: 23460, // 蔀法
        ZhangRange: 391, // 章歲
        ZhangLeap: 144, // 
        MansionRaw: [8, 15], // 斗15度
        MansionFractPosition: 8
    },
    Daxiang: { // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js 大象元年，太史上士馬顯等，又上《丙寅元曆》...上元丙寅至大象元年己亥，積四萬一千五百五十四算上。日法五萬三千五百六十三，亦名蔀會法。章歲四百四十八，斗分三千一百六十七，蔀法一萬二千九百九十二。章中爲章會法。日法五萬三千五百六十三，曆餘二萬九千六百九十三，會日百七十三，會餘一萬六千六百一十九，冬至日在斗十二度。小周餘、盈縮積，其曆術別推入蔀會，分用陽率四百九十九，陰率九。每十二月下各有日月蝕轉分，推步加減之，乃爲定蝕大小餘，而求加時之正。
        // 上元丙寅至大象元年己亥，積41554算上。日法53563，亦名蔀會法。章歲448，斗分3167，蔀法12992。章中爲章會法。日法53563，曆餘29693，會日百七十三，會餘16619，冬至日在斗12度。小周餘、盈縮積，其曆術別推入蔀會，分用陽率499，陰率9。每12月下各有日月蝕轉分，推步加減之，乃爲定蝕大小餘，而求加時之正。
        Type: 3,
        ApplyYear: [[579, 583]],
        Solar: 365 + 3167 / 12992,
        SolarNumer: 4745247, // 週天
        SolarDenom: 12992,
        Lunar: 29 + 28422 / 53563, // 朔策沒問題。陽率499，陰率9
        LunarNumer: 1581748, // 闕了這項參數，我復原的
        Denom: 53563, // 日法、蔀會法。「別推入蔀會」：用另一種方法推出日法   
        Anoma: 27 + 29693 / 53563, // 近點月
        AnomaNumer: 1475894, // 通週
        EcliRange: 9283018 / (4745247 / 3), // 173+16619/53563
        Node: 27.21225648359655,
        OriginAd: 579 - 41553, // 大象元年己亥。隋志41555，授時議42555。幾個方案：-274。-57:先天半日；- 41553後天0.4日
        CloseOriginAd: 579,
        // 會日173，會餘16619，冬至日在斗12度。
        // JdOrigin: 1932524.2832 - 41553 * (365 + 3167 / 12992),
        OriginYearSc: 3, // 上元丙寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 259840, // 闕，我算得。1 元 = 20 蔀，1 蔀 = 29 章
        JiRange: 129920, // 闕，我假設是蔀法的10倍。
        BuRange: 12992, // 蔀法29章。蔀日4734247
        ZhangRange: 448, // 章法
        ZhangLeap: 165,
        MansionRaw: [8, 12], // 斗12度
        MansionFractPosition: 8, // 闕，擬
    },
    Kaihuang: { // 《隋志中》除了月離表都有了。《劉洪濤》618頁。以開皇曆交點月、月食週期比之，與我的換算公式完全相合！
        Type: 3,
        ApplyYear: [[584, 596]],
        Solar: 365 + 25063 / 102960,
        SolarNumer: 37605463, // 週天分、蔀日、沒分。斗分=25063
        SolarDenom: 102960,
        Lunar: 29 + 96529 / 181920, // 朔策。
        LunarNumer: 5372209, // 通月
        Denom: 181920, // 日法、週法。（朔）虛分=30*Denom-LunarNumer。朔時法=Denom/12
        Node: 27 + (38607 + 1841 / 2815) / 181920, // 交點月
        NodeNumer: 512104800, // 交法
        NodeSmallFract: 2815, // 交分法
        Anoma: 27 + 100859 / 181920, // 近點月
        AnomaFract: 100859, // 週日餘、小大法
        AnomaNumer: 5012699, // 週通。週虛81061CycleDif = Denom - AnomaNumer 
        EcliRange: 1297 / 221,
        YinyangCorr: -1,
        OriginAd: 584 - 4129000, // 開皇四年行用至開皇十六年
        CloseOriginAd: 584,
        // JdOrigin: 1934350.8011 - 4129000 * (365 + 25063 / 102960),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 6177600, // 元法
        JiRange: 1029600, // 紀法
        BuRange: 102960, // 蔀法、度法
        ZhangRange: 429, // 章歲
        ZhangLeap: 158, // 章閏
        MansionRaw: [8, 12], // 闕，以大象補之
        MansionFractPosition: 8, // 闕，擬
    },
    TaiyiKaiyuan: { // 曲安京《曆法》頁380
        Type: 3,
        ZhangRange: 657, // 同董峻甲寅元曆
        ZhangLeap: 242,
        Solar: 365 + 7877 / 32193,
        Lunar: 29 + 26 / 49,
        Denom: 49,
        OriginAd: 724 - 1937280,
        OriginMonNum: 0,
        ZhengNum: 2,
    },
    Yuanjia: {
        Type: 4,
        ApplyYear: [[445, 509]],
        Solar: 365 + 75 / 304, // 歲實。304:度法。111035:週天。75:度分。
        SolarNumer: 111035,
        SolarDenom: 304,
        Lunar: 29 + 399 / 752, // 朔策。
        LunarNumer: 22207, // 通數
        Denom: 752, // 日法=16*47。47:通法
        Anoma: 27 + 417 / 752, // 近點月、交點月
        AnomaNumer: 20721, // 通週。417:週日日餘。 Denom-週日日餘=335:週虛
        AnomaCorr: 625, // 原來是17663。2343比較合
        EcliRange: 939 / 160, // 會月/會數。朔望合數=EcliDenom/2。
        EcliCorr: 877 / 939, //661 / 939
        Node: 27.21218784582298,
        MoonAcrVList: [279, 277, 274, 270, 265, 260, 254, 249, 245, 242, 239, 236, 234, 232, 230, 232, 234, 237, 242, 248, 254, 259, 263, 267, 271, 274, 277, 278 + 103 / 417, 279],
        MoonDifAccumList: [0, 25, 48, 68, 84, 95, 101, 101, 96, 87, 75, 60, 42, 22, 0, -24, -46, -66, -83, -95, -101, -101, -96, -87, -74, -57, -37, -14, 10.2470023981],
        MoonLatiDifList: [17, 16, 15, 12, 8, 4, 1, -2, -6, -10, -13, -15, -16, -(16 + 3472 / 5371)], // 元嘉陰陽曆
        MoonLatiAccumList: [0, 1.416666666666666667, 2.75, 4, 5, 5.666666666666667, 6, 6.083333333333333, 5.916666666666667, 5.416666666666667, 4.583333333333333, 3.5, 2.25, 0.916666666666667, -0.4705362129957],
        OriginAd: 443 - 5703, // 上元積年的公元
        CloseOriginAd: 443,
        // JdOrigin: 1882851.6157 - 5703 * (365 + 75 / 304) + 1.5, // 有點不對，修正一下
        OriginYearSc: 17, // 上元庚辰
        OriginMonNum: 2, // 雨水爲歲首
        ZhengNum: 2, // 建寅
        YuanRange: 3648, // 元法
        JiRange: 608, // 紀法。紀月：7520.紀日：222070
        ZhangRange: 19,
        ZhangLeap: 7,
        // MansionRaw: [13, 2], // 劉洪濤頁251：冬至在斗17，雨水日在室2度。由於日行盈縮，雨水本來是4度265+20/24分
        MansionRaw: [13, 1 + 5 / 6], // 《中國古代曆法》27頁
        MansionFractPosition: 13, // 經室去度分
        // DayLight: [45, 45.6, 46.7, 48.4, 50.5, 52.9, 55.5, 58, 60.3, 62.3, 63.9, 64.8, 65, 64.8, 63.9, 62.3, 60.3, 58, 55.5, 52.9, 50.5, 48.4, 46.7, 45.6], // 晝漏
        NightList: [27.5, 27.2, 26.65, 25.8, 24.75, 23.55, 22.25, 21, 19.85, 18.85, 18.05, 17.6, 17.5, 17.6, 18.05, 18.85, 19.85, 21, 22.25, 23.55, 24.75, 25.8, 26.65, 27.2, 27.5],
        DialList: [13, 12.48, 11.34, 9.91, 8.22, 6.72, 5.39, 4.25, 3.25, 2.5, 1.97, 1.69, 1.5, 1.69, 1.97, 2.5, 3.25, 4.25, 5.39, 6.72, 8.22, 9.91, 11.34, 12.48, 13], // 晷長
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    Daming: {
        Type: 4,
        ApplyYear: [[510, 589]],
        YuanRange: 592365, // 元法，15紀
        JiRange: 39491, // 紀法。每紀101章。紀日：14423804，紀月488436
        ZhangRange: 391, // 章歲
        ZhangLeap: 144, // 章閏。每年12+144/391月
        Solar: 365 + 9589 / 39491, // 歲實。歲餘：9589.歲分：14423804
        SolarNumer: 14423804,
        SolarDenom: 39491,
        Sidereal: 365 + 10449 / 39491, // 365.264592
        SiderealNumer: 14424664, // 週天。冬至點45.92年西移1度（39391分）。現代値：回歸年比恆星年短20分鐘
        Lunar: 29 + 2090 / 3939, // 朔策
        LunarNumer: 116321, // 月法
        Denom: 3939, // 日法        
        Anoma: 27 + 14631 / 26377, // 近點月
        AnomaNumer: 726810, // 通週
        // MoonAcrVList: [(14 + 13 / 23), (14 + 11 / 23), (14 + 8 / 23), (14 + 4 / 23), (13 + 22 / 23), (13 + 17 / 23), (13 + 11 / 23), (13 + 5 / 23), (12 + 22 / 23), (12 + 16 / 23), (12 + 11 / 23), (12 + 8 / 23), (12 + 6 / 23), (12 + 4 / 23), (12 + 5 / 23), (12 + 7 / 23), (12 + 10 / 23), (12 + 14 / 23), (12 + 19 / 23), (13 + 1 / 23), (13 + 7 / 23), (13 + 13 / 23), (13 + 19 / 23), (14 + 1 / 23), (14 + 6 / 23), (14 + 10 / 23), (14 + 12 / 23), (14 + (14 + 1010 / 1717) / 23), (14 + 13 / 23)], // 《古代曆法計算法》第303頁
        MoonAcrVList: [5695, 5661, 5610, 5542, 5457, 5372, 5270, 5168, 5066, 4964, 4879, 4828, 4794, 4760, 4777, 4811, 4862, 4930, 5015, 5100, 5202, 5304, 5406, 5491, 5576, 5644, 5678, 5722],
        MoonDifAccumList: [0, 467.71165998000015, 901.42331996, 1284.13497994, 1598.84663992, 1828.5582999, 1973.26995988, 2015.98161986, 1956.69327984, 1795.40493982, 1532.1165998, 1183.82825978, 784.53991976, 351.25157974, -116.03676028, -566.3251003, -982.61344032, -1347.90178034, -1645.19012036, -1857.47846038, -1984.7668004, -2010.05514042, -1933.34348044, -1754.63182046, -1490.92016048, -1142.2085005, -725.49684052, -274.78518054, 219.92647944],
        Node: 27 + 5598 / 26377, // 分母通法類似以往的月週 // NodeNumer: 358888.5, // 交點月一半的分子：交數。15987.5日餘。朔望合數=Lunar/2，差爲前限。
        MoonLatiDifList: [16, 15, 14, 12, 9, 5, 1, -2, -6, -10, -13, -15, -16, -(16 + 3188 / 6395)], // 陰陽曆表遠離黃道益，接近黃道損
        MoonLatiAccumList: [0, 1.3333333333333333, 2.583333333333333, 3.75, 4.75, 5.5, 5.916666666666667, 6, 5.833333333333333, 5.333333333333333, 4.5, 3.416666666666667, 2.166666666666667, 0.833333333333333, -0.5415428720354],
        OriginAd: 463 - 51939, // 宋大明七年癸卯
        CloseOriginAd: 463,
        // JdOrigin: 1890157.0589 - 51939 * (365 + 9589 / 39491),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 0], // 虛初度 // 大概想明白了，這是上元的！！！從上元到463年，大概退了35度，從虛初退，正好是斗12左右
        MansionFractPosition: 10, // 虛前，入虛去度分 
        // DayLight: [45, 45.6, 46.7, 48.4, 50.5, 52.9, 55.5, 58.1, 60.4, 62.4, 63.9, 64.8, 65, 64.8, 63.9, 62.4, 60.4, 58.1, 55.5, 52.9, 50.5, 48.4, 46.7, 45.6], // 大明在元嘉基礎上微調
        // const tmpA = NightList.slice()
        //  const tmpB = tmpA.reverse().slice(1, -1)
        //   NightList = NightList.concat(tmpB)
        NightList: [27.5, 27.2, 26.65, 25.8, 24.75, 23.55, 22.25, 20.95, 19.8, 18.8, 18.05, 17.6, 17.5, 17.6, 18.05, 18.8, 19.8, 20.95, 22.25, 23.55, 24.75, 25.8, 26.65, 27.2, 27.5],
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43],
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    Liangwu: { // 開元占經「梁武大同」，虞𠠎。用來補明克讓。只有以下信息：《隋志中》「初，西魏入關，尚行李業興《正光術》。至武成元年，始詔克讓與麟趾學士庾季才及諸日者定新術，采祖暅舊議，通簡南北之術。自斯已後，頗親其謬。故周齊並時，而曆差一日。」跟元嘉大概三年有兩年差一天。陳久金《符天曆研究》：祖暅的符天經與後來的符天曆毫無關係。「采祖暅舊議」說明與大明很接近
        // 我根據大衍曆議的歲差，補出恆星年
        Type: 4,
        ApplyYear: [[559, 565]],
        YuanRange: 2376960, // 元法闕，我算得。這麼來看，1元=60紀，是北系。
        JiRange: 39616, // 紀64章。章月7656，紀月489984/日法=319
        ZhangRange: 619, // 章歲同劉孝孫
        ZhangLeap: 228, // 章閏闕，以劉孝孫補之
        Solar: 365 + 9681 / 39616, // 闕。設斗分y,朔餘x，由朔策=紀日/紀月,設x=815，可得此數
        SolarNumer: 14469521,
        SolarDenom: 39616,
        Sidereal: 365 + 9894 / 39616,
        Lunar: 29 + 815 / 1536, // 闕，這是唯一可選。3月11日看到《李氏遺書》p229，推算結果跟李銳一樣，真厲害！
        LunarNumer: 45359,
        Denom: 1536, // 日法        
        Anoma: 27 + 852 / 1536, // 闕，以大明補之
        AnomaNumer: 42324,
        AnomaCorr: 72500,
        OriginAd: 535 - 1025691, // 假設梁武帝大同元年。積年沒錯
        CloseOriginAd: 535,
        // JdOrigin: 1916454.5956 - 1025691 * (365 + 9681 / 39616),
        OriginYearSc: 1,
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 0], // 假設是虛初 
        MansionFractPosition: 8,
    },
    Zhangmengbin: { // 嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        Type: 4,
        JiRange: 48901, // 紀法。紀日1786810
        ZhangRange: 619, // 章歲。章月7656
        ZhangLeap: 228, // 章閏。闕，以章月補之。置閏週期與劉孝孫同
        YuanRange: 293406, // 闕，我算得
        Solar: 365 + 11945 / 48901, // 《中國古代曆法》第616頁。這些數據竟然都是他推出來的。原來歲實分母就是紀法
        SolarNumer: 17860810, //
        Lunar: 29 + 503 / 948, // 朔策
        LunarNumer: 27995, // 月法
        Denom: 948, // 日法 
        Anoma: 27 + 3866 / 6971, // 闕
        AnomaNumer: 945673,
        AnomaDenom: 34320,
        AcrTermList: [0, 14.68005, 29.437022, 44.270918, 59.104814, 73.861787, 88.541836, 104.298809, 119.978859, 135.581986, 151.185112, 166.865162, 182.622135, 198.379107, 214.059157, 229.662284, 245.26541, 260.94546, 276.702433, 291.382482, 306.139455, 320.973351, 335.807247, 350.564219, 365.244269], // 皇極日躔
        OriginAd: 576 - 25952, // 武平四年癸巳// 嚴敦傑573 - 876569
        CloseOriginAd: 576,
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        MansionRaw: [8, 11], // 「日月五星并從斗十一起」
        MansionFractPosition: 8
    },
    Liuxiaosun: { // 開元占經保存的數據。《中國古代曆法》第427頁
        Type: 4,
        YuanRange: 160940, // 元法
        JiRange: 8047, // 紀法
        ZhangRange: 619, // 章歲
        ZhangLeap: 228, // 章閏
        Solar: 365 + 1966 / 8047, // 歲餘1966
        SolarNumer: 2939121, //
        Sidereal: 365 + 6407 / 24141, // 虛分6407.差分509.
        SiderealNumer: 8817872,
        Lunar: 29 + 17603 / 33176, // 朔策=紀日/紀月 // 《古代曆法計算法》第615頁
        LunarNumer: 979707, // 月法
        Denom: 33176,
        Node: 27 + 51021 / 227084, // 自己算的交點月
        EcliRange: 2013 / 341, // 會月 2013，會率341
        Anoma: 27 + 19033 / 34320, // 近點月。歷朔差分67817.通法3442 
        AnomaNumer: 945673, // 闕，根據皇極比例：19033，大明：19037，元嘉、正光：19031，以上三個數字可選
        AnomaDenom: 34320, // 週法：開元占經已知。說明分子不能是偶數、3的倍數
        AcrTermList: [0, 14.680052, 29.437026, 44.270924, 59.104822, 73.861796, 88.541848, 104.298823, 119.978874, 135.582003, 151.185131, 166.865183, 182.622157, 198.379132, 214.059184, 229.662312, 245.265441, 260.945492, 276.702467, 291.382518, 306.139493, 320.973391, 335.807288, 350.564263, 365.244315],
        OriginAd: 573 - 435089,
        CloseOriginAd: 573,
        // JdOrigin: 1930334.1174 - 435089 * (365 + 1966 / 8047),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 7], // 先是9，後來改成7
        MansionFractPosition: 11,
    },
    Daye: { // 隋志的大業曆就是修改之後的，冬至起虛七。占經寫成了張曹玄
        // YuanRange: 852800, // 無，我算得
        Type: 4,
        ApplyYear: [[597, 618]],
        ZhangRange: 410, // 章歲
        ZhangLeap: 151, // 章閏。每年12+144/391月
        Solar: 365 + 10363 / 42640,
        SolarNumer: 15573963, // 歲分。度法、度分：42640
        SolarDenom: 42640,
        Sidereal: 365 + 10866 / 42640, // 恆星年。斗分：10866。歲差84.77年1度
        SiderealNumer: 15574466, // 週天
        Lunar: 29 + 607 / 1144, // 朔策。
        LunarNumer: 33783, // 月法
        Denom: 1144, // 日法        
        Anoma: 27 + 1413 / 2548, // 近點月
        AnomaNumer: 70209, // 週通
        AnomaDenom: 2548, // 週法
        Node: 10646729 / 391248, // 會通10646729，朔差907057
        NodeDenom: 391248,
        MoonAcrVList: [6010, 5950, 5880, 5800, 5710, 5620, 5530, 5430, 5330, 5240, 5160, 5090, 5020, 4960, 4980, 5040, 5110, 5190, 5270, 5360, 5450, 5550, 5640, 5730, 5810, 5890, 5950, 6000, 6010], // 《古代曆法計算法》第404頁，劉洪濤最後一個600改成333，但沒必要，因爲28日入曆肯定不會在1413 / 2548以上。最後一個601不當有，我爲了求轉差。我都乘了10，因爲原算法涉及10倍轉換
        MoonDifAccumList: [0, 528.98514, 997.97028, 1396.95542, 1715.94056, 1944.9257, 2083.91084, 2132.89598, 2081.88112, 1930.86626, 1689.8514, 1368.83654, 977.82167988, 516.80681987, -4.20804, -505.2229, -946.23776, -1317.25262, -1608.26748, -1819.28234, -1940.2972, -1971.31206, -1902.32692, -1743.34178, -1494.35664, -1165.3715, -756.38636, -287.40122, 231.58392],
        SunTcorrDifList: [70, 35, 35, 20, 30, 35, -55, -45, -40, -30, -55, -65, -55, -40, -25, -5, -30, -40, 60, 55, 50, 45, 40, 10], // 入氣盈縮。我改變了後半部分正負。以日法爲單位，月離表是以章爲單位
        SunTcorrList: [0, 70, 105, 140, 160, 190, 225, 170, 125, 85, 55, 0, -65, -120, -160, -185, -190, -220, -260, -200, -145, -95, -50, -10, 0],
        // OriginAd: 604 - 1427645,
        OriginAd: 604 - 1427640, // 跟皇極一樣，原來的積年不對，要退後5年。嚴絲合縫！大業四年戊辰。603年12月19日冬至
        CloseOriginAd: 604,
        // JdOrigin: 1941656.5722 - 1427640 * (365 + 10363 / 42640),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 7], // 虛7度
        MansionFractPosition: 8, // 經斗去其分
        NightList: [29.980147, 29.715441, 29.132353, 28.323530, 27.279412, 26.044118, 24.720588, 23.455882, 22.323530, 21.323529, 20.56397, 20.108088, 20.019853, 20.108088, 20.563971, 21.323529, 22.323529, 23.455882, 24.720588, 26.044118, 27.279412, 28.323529, 29.132353, 29.715442, 29.980147], // 《中國古代曆法》43
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    WuyinA: { // 戊寅定朔 // 崔善爲修改的戊寅曆未改動傅仁均原始數據，《中國古代曆法》第460頁
        // YuanRange: 37856, // 無，我算得
        // JiRange: 9464, // 無，我算得
        Type: 4,
        isAcr: true,
        ApplyYear: [[619, 644]],
        ZhangRange: 676, // 章歲
        ZhangLeap: 249, // 章閏
        Solar: 365 + 2315 / 9464, // 餘數49635
        SolarNumer: 3456675, // 歲分
        SolarDenom: 9464,
        Sidereal: 365 + 2485.5 / 9464, // 週天。分子爲斗分
        SiderealNumer: 3456845.5, // 週分 
        Lunar: 29 + 6901 / 13006, // 朔策
        // 沒分76815，沒法1103，沒日距=沒分/沒法=歲分/餘數
        LunarNumer: 384075, // 月法
        Denom: 13006, // 日法。時法=日法/2。度法、氣法9464。
        TermDenom: 1183, // 氣時法=氣法/8=1183        
        Anoma: 27 + 16064 / 28968, // 分子爲歷餘 
        AnomaNumer: 798200, // 歷週
        AnomaDenom: 28968, // 歷法
        Node: 27 + 99373.8 / 468216, // 朔差=36月法-交會法。交會法/2=交分法=望差+交限。交點月+朔差=朔望月
        NodeDenom: 468216, // 36 * 13006,
        MoonAcrVList: [9909, 9810, 9695, 9563, 9414, 9266, 9118, 8953, 8788, 8640, 8508, 8392, 8277, 8178, 8211, 8310, 8425, 8557, 8689, 8837, 8986, 9151, 9299, 9447, 9578, 9710, 9809, 9891, 9909],
        MoonDifAccumList: [0, 872, 1645, 2303, 2829, 3206, 3435, 3516, 3432, 3183, 2786, 2257, 1612, 852, -7, -833, -1560, -2172, -2652, -3000, -3200, -3251, -3137, -2875, -2465, -1924, -1251, -479, 375],
        SunTcorrDifList: [896, 398, 400, 228, 341, 450, -500, -455, -355, -555, -848, -739, -626, -456, -288, -40, -342, -455, 682, 625, 570, 513, 456, 100],
        SunTcorrList: [0, 896, 1294, 1694, 1922, 2263, 2713, 2213, 1758, 1403, 848, 0, -739, -1365, -1821, -2109, -2149, -2491, -2946, -2264, -1639, -1069, -556, -100, 0],
        OriginAd: 626 - 164348, // 618武德元年加交差7755164
        CloseOriginAd: 626,
        // JdOrigin: 1949691.8546 - 164348 * (365 + 2315 / 9464),
        OriginYearSc: 15, // 上元戊寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 6], // 命以虛六
        MansionFractPosition: 8, // 經斗去分
        // NightList: [27 + 12 / 24, 27 + 5 / 24, 26 + 15 / 24, 25 + 19 / 24, 24 + 18 / 24, 23 + 13 / 24, 22 + 6 / 24, 20 + 3 / 24, 19 + 19 / 24, 18 + 19 / 24, 18 + 1 / 24, 17 + 14 / 24, 17 + 12 / 24], // 夜漏半
        NightList: [27.5, 27.208333333333333, 26.625, 25.791666666666667, 24.75, 23.541666666666667, 22.25, 20.125, 19.791666666666667, 18.791666666666667, 18.041666666666667, 17.583333333333333, 17.5, 17.583333333333333, 18.041666666666667, 18.791666666666667, 19.791666666666667, 20.125, 22.25, 23.541666666666667, 24.75, 25.791666666666667, 26.625, 27.208333333333333, 27.5],
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    WuyinB: { // 戊寅平朔 // 崔善爲修改的戊寅曆未改動傅仁均原始數據，《中國古代曆法》第460頁
        // YuanRange: 37856, // 無，我算得
        // JiRange: 9464, // 無，我算得
        Type: 4,
        ApplyYear: [[645, 665]],
        ZhangRange: 676, // 章歲
        ZhangLeap: 249, // 章閏
        Solar: 365 + 2315 / 9464, // 餘數49635
        SolarNumer: 3456675, // 歲分
        SolarDenom: 9464,
        Sidereal: 365 + 2485.5 / 9464, // 週天。分子爲斗分
        SiderealNumer: 3456845.5, // 週分 
        Lunar: 29 + 6901 / 13006, // 朔策
        // 沒分76815，沒法1103，沒日距=沒分/沒法=歲分/餘數
        LunarNumer: 384075, // 月法
        Denom: 13006, // 日法。時法=日法/2。度法、氣法9464。
        TermDenom: 1183, // 氣時法=氣法/8=1183        
        Anoma: 27 + 16064 / 28968, // 分子爲歷餘 
        AnomaNumer: 798200, // 歷週
        AnomaDenom: 28968, // 歷法
        Node: 27 + 99373.8 / 468216, // 朔差=36月法-交會法。交會法/2=交分法=望差+交限。交點月+朔差=朔望月
        NodeDenom: 468216, // 36 * 13006,
        MoonAcrVList: [9909, 9810, 9695, 9563, 9414, 9266, 9118, 8953, 8788, 8640, 8508, 8392, 8277, 8178, 8211, 8310, 8425, 8557, 8689, 8837, 8986, 9151, 9299, 9447, 9578, 9710, 9809, 9891, 9909],
        MoonDifAccumList: [0, 872, 1645, 2303, 2829, 3206, 3435, 3516, 3432, 3183, 2786, 2257, 1612, 852, -7, -833, -1560, -2172, -2652, -3000, -3200, -3251, -3137, -2875, -2465, -1924, -1251, -479, 375],
        SunTcorrDifList: [896, 398, 400, 228, 341, 450, -500, -455, -355, -555, -848, -739, -626, -456, -288, -40, -342, -455, 682, 625, 570, 513, 456, 100],
        SunTcorrList: [0, 896, 1294, 1694, 1922, 2263, 2713, 2213, 1758, 1403, 848, 0, -739, -1365, -1821, -2109, -2149, -2491, -2946, -2264, -1639, -1069, -556, -100, 0],
        OriginAd: 626 - 164348, // 618武德元年加交差7755164
        CloseOriginAd: 626,
        // JdOrigin: 1949691.8546 - 164348 * (365 + 2315 / 9464),
        OriginYearSc: 15, // 上元戊寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 6], // 命以虛六
        MansionFractPosition: 8, // 經斗去分
        // NightList: [27 + 12 / 24, 27 + 5 / 24, 26 + 15 / 24, 25 + 19 / 24, 24 + 18 / 24, 23 + 13 / 24, 22 + 6 / 24, 20 + 3 / 24, 19 + 19 / 24, 18 + 19 / 24, 18 + 1 / 24, 17 + 14 / 24, 17 + 12 / 24], // 夜漏半
        NightList: [27.5, 27.208333333333333, 26.625, 25.791666666666667, 24.75, 23.541666666666667, 22.25, 20.125, 19.791666666666667, 18.791666666666667, 18.041666666666667, 17.583333333333333, 17.5, 17.583333333333333, 18.041666666666667, 18.791666666666667, 19.791666666666667, 20.125, 22.25, 23.541666666666667, 24.75, 25.791666666666667, 26.625, 27.208333333333333, 27.5],
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },

    //////////////

    Huangji: {
        Type: 6,
        isAcr: true,
        ClockCorr: 7 / 24, // 皇極以辰時爲夜半，但是計算仍然以子時。皇極曆夜半爲子半。皇極對時辰的規定過於曲折，見第478—480頁，我沒有考慮這些因素，直接用通行辦法。這不符合皇極原意。
        ZhangRange: 676, // 歲率、閏限，卽章法，設置閏月的週限。章月：81453
        ZhangLeap: 249, // 。每年12+144/391月
        DayDivi: 52, // 日干元、轉法，676=52*13，就像干支一樣
        Solar: 365 + 11406.5 / 46644, // 
        SolarNumer: 17036466.5, // 歲數
        SolarDenom: 46644, // 氣日法
        SolarDenomDivi: 897, // 餘通、篾法。897*52=46644
        // SecConst: 48, // 秒法，MSconst: 5, // 麽法。兩套單位：日-餘-秒-麽，度-分-篾-幺。1+1/4秒：秒小，1+3/4秒：秒大，1/3秒：秒少，2/3秒：太
        Sidereal: 365 + 12016 / 46644,
        Lunar: 29 + 659 / 1242, // 朔策
        LunarNumer: 36677, // 朔實，卽月法
        Denom: 1242, // 朔日法。每個時辰：朔辰103.5。LunarDenomDivi: 9, // 約率。9*138=1242
        Anoma: 27 + 1255 / 2263, // 轉終.27:轉終日
        AnomaFract: 1255, // 轉終日餘
        AnomaNumer: 62356, // 終實
        AnomaDenom: 2263, // 終法
        Node: 27 + (263 + 3435 / 5923) / 1242,
        SunLimitYang: 20,
        SunLimitYin: 1460,
        // 日限11。秋分到春分爲盈泛16，春分到秋分爲虧總17.春分後一氣日數=泛總/日限=11*17/12。秋分後11*16/12
        TermRangeA: 170 / 11, // 秋分後盈曆每節氣日數
        TermRangeS: 160 / 11, // 春分後縮曆每節氣日數
        // OriginAd: 608 - 1008839,  
        OriginAd: 608 - 1008844, // 原來的積年不對，往前移5年後嚴絲合縫！耶！// 隋煬帝仁壽四年
        CloseOriginAd: 608,
        // JdOrigin: 1943117.0236 - 1008844 * (365 + 11406.5 / 46644), // 
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        WeekCorr: 2,
        MansionDayCorr: -12,
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 1], // 虛1度
        MansionFractPosition: 10, // 女末接虛謂之週分
        // SunAcrAvgDifList: [28, 24, 20, 20, 24, 28, -28, -24, -20, -20, -24, -28, -28, -24, -20, -20, -24, -28, 28, 24, 20, 20, 24, 28], // 躔衰，開頭大雪、末尾冬至爲0。實行平行之差*日干元
        SunAcrAvgDifList: [668.7692307692307, 573.2307692307693, 477.6923076923077, 477.6923076923077, 573.2307692307693, 668.7692307692307, -668.7692307692307, -573.2307692307693, -477.6923076923077, -477.6923076923077, -573.2307692307693, -668.7692307692307, -668.7692307692307, -573.2307692307693, -477.6923076923077, -477.6923076923077, -573.2307692307693, -668.7692307692307, 668.7692307692307, 573.2307692307693, 477.6923076923077, 477.6923076923077, 573.2307692307693, 668.7692307692307],
        SunTcorrList: [0, 50, 93, 129, 165, 208, 258, 208, 165, 129, 93, 50, 0, -50, -93, -129, -165, -208, -258, -208, -165, -129, -93, -50, 0, 50],
        AcrTermList: [0, 14.680061, 29.437045, 44.270953, 59.10486, 73.861844, 88.541905, 104.298889, 119.97895, 135.582089, 151.185227, 166.865288, 182.622272, 198.379256, 214.059317, 229.662455, 245.265593, 260.945654, 276.702639, 291.3827, 306.139684, 320.973591, 335.807498, 350.564483, 365.244544, 365 + 11406.5 / 46644 + 14.680061],
        // MoonAcrVList: [764, 757, 749, 738, 726, 713, 700, 688, 674, 660, 648, 639, 632, 626, 628, 635, 644, 655, 666, 679, 693, 705, 719, 732, 744, 754, 761, (766 + 4 / 897)],
        MoonAcrVList: [18247.846153846152, 18080.653846153848, 17889.576923076922, 17626.846153846152, 17340.23076923077, 17029.73076923077, 16719.23076923077, 16432.615384615383, 16098.23076923077, 15763.846153846154, 15477.23076923077, 15262.26923076923, 15095.076923076924, 14951.76923076923, 14999.538461538461, 15166.73076923077, 15381.692307692309, 15644.423076923076, 15907.153846153846, 16217.653846153846, 16552.03846153846, 16838.653846153848, 17173.03846153846, 17483.53846153846, 17770.153846153848, 18009, 18176.19230769231, 18295.721893491125, 18247.846153846152], // 轉換成日法
        MoonTcorrList: [0, 123, 234, 331, 408, 464, 496, 505, 492, 454, 391, 307, 207, 94, -28, -148, -256, -347, -419, -471, -500, -505, -487, -446, -380, -293, -188, -70],
        // MoonTcorrDifList: [-123, -111, -97, -77, -56, -32, -9, 13, 38, 63, 84, 100, 113, 122, 120, 108, 91, 72, 52, 29, 5, -18, -41, -66, -87, -105, -118, -70],
        MoonTcorrDifList: [-123, -111, -97, -77, -56, -32, -9.05, 0.05, 13, 38, 63, 84, 100, 113, 122, 120, 108, 91, 72, 52, 29, 5.45454545454545, -0.45454545454545, -18, -41, -66, -87, -105, -118, -70],
        NightList: [27.43, 27.26, 26.76, 25.985, 24.965, 23.775, 22.5, 21.225, 20.035, 19.015, 18.23, 17.69, 17.57, 17.69, 18.23, 19.015, 20.035, 21.225, 22.5, 23.775, 24.965, 25.985, 26.76, 27.26, 27.43, 27.26], // 皇極夜半漏
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
        MoonLatiDifList: [14, 13, 11.5, 9.5, 7, 4, 1.5, -2, -5, -8, -10.5, -12.5, -13.5, -14.2], // 最後一個不知對不對。月距黃道。/10爲度
        MoonLatiAccumList: [0, 14, 27, 38.5, 48, 55, 59, 60, 58, 53, 45, 34.5, 22, 8.5],
        // const HalfZhangRange = ZhangRange / 2 // 皇極度準，歲率的一半
        // const TermClock = SolarDenom / 12 // 皇極氣辰
        // const AnomadenomFractDif = AnomaDenom - AnomaFract // 皇極終全餘
        // const MoonAvgVDeg = parseFloat((Sidereal / Lunar + 1).toPrecision(13))
    },
    Yisi: {
        Type: 6,
        Solar: 365 + 328 / 1340,
        SolarNumer: 489428,
        Sidereal: 365 + 341 / 1340, // 乙巳有歲差
        Lunar: 29 + 711 / 1340,
        LunarNumer: 39571,
        Denom: 1340,
        OriginAd: 629 - 79244,
        CloseOriginAd: 629,
        OriginYearSc: 42, // 上元乙巳
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        // WeekCorr: 1,
        // MansionDayCorr: -20,
        MansionRaw: [11, 4],
        MansionFractPosition: 11, // 命起虛四度
    },
    LindeA: {
        Type: 6,
        isAcr: true,
        ApplyYear: [[666, 707], [717, 720]],
        Solar: 365 + 328 / 1340, // 麟德不用歲差
        SolarNumer: 489428, // 期實
        Lunar: 29 + 711 / 1340, // 朔策
        LunarNumer: 39571, // 常朔實。+362:盈朔實，-351:朒朔實。這是朔望月的浮動範圍
        Denom: 1340, // 總法，目的是取消章、蔀、紀。1/4到335爲辰法
        Anoma: 27 + (743 + 1 / 12) / 1340, // 變奇1，變奇法12，月程法67=總法/20.月離表度化爲分*67
        AnomaNumer: 443077, // 變週。AnomaDenom: 12 * 1340, 
        Node: 27 + (284 + 113 / 300) / 1340, // 後準(1553+93.5/300)1340
        TermRangeA: 11 * 16 / 12, // 秋分後進綱16
        TermRangeS: 11 * 17 / 12, // 春分後退紀17
        OriginAd: 664 - 269880,
        CloseOriginAd: 664,
        // JdOrigin: 1963570.6791 - 269880 * (365 + 328 / 1340),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        WeekCorr: 1,
        MansionDayCorr: -20,
        MansionRaw: [8, 12], // 斗12。這估計是黃道度，但是沒說赤道度，奇怪
        MansionFractPosition: 8, // 沒說
        // MoonAcrVList: [985, 974, 962, 948, 933, 918, 902, 886, 870, 854, 839, 826, 815, 808, 810, 819, 832, 846, 861, 877, 893, 909, 925, 941, 955, 968, 979, 985], // 離程
        MoonAcrVList: [19700, 19480, 19240, 18960, 18660, 18360, 18040, 17720, 17400, 17080, 16780, 16520, 16300, 16160, 16200, 16380, 16640, 16920, 17220, 17540, 17860, 18180, 18500, 18820, 19100, 19360, 19580, 19700], // 乘20
        MoonTcorrList: [0, 134, 251, 350, 428, 484, 517, 526, 512, 474, 412, 327, 223, 102, -29, -157, -272, -367, -441, -493, -521, -525, -505, -461, -393, -304, -196, -71], // 遲速積
        // 日限11。秋分到春分爲盈泛16，春分到秋分爲虧總17.春分後一氣日數=泛總/日限=11*17/12。秋分後11*16/12
        MoonTcorrDifList: [-134, -117, -99, -78, -56, -33, -9, 0, 14, 38, 62, 85, 104, 121, 131, 128, 115, 95, 74, 52, 28, 4, 0, -20, -44, -68, -89, -108, -125, 71],
        SunAcrAvgDifList: [722, 618, 514, 514, 618, 722, -722, -618, -514, -514, -618, -722, -722, -618, -514, -514, -618, -722, 722, 618, 514, 514, 618, 722], // 躔差率=(實行度-平行度)*總法=實行分-平行分
        SunTcorrList: [0, 54, 100, 138, 176, 222, 276, 222, 176, 138, 100, 54, 0, -54, -100, -138, -176, -222, -276, -222, -176, -138, -100, -54, 0, 54], // 盈朒積        
        AcrTermList: [0, 14.679726, 29.437065, 44.272015, 59.106965, 73.864303, 88.54403, 104.301368, 119.981095, 135.583209, 151.185323, 166.86505, 182.622388, 198.379726, 214.059453, 229.661567, 245.263682, 260.943408, 276.700746, 291.380473, 306.137811, 320.972761, 335.807711, 350.56505, 365.244776, 365 + 328 / 1340 + 14.679726],
        MoonLatiDifList: [14, 13, 11.5, 9.5, 7, 4, 0.05, -2, -5, -8, -10.5, -12.5, -13.5, -14.25], // 去交差。中間是進二退二。/10爲度。第二個9.5原爲11.5，似乎錯了
        MoonLatiAccumList: [0, 14, 27, 38.5, 48, 55, 59, 60, 58, 53, 45, 34.5, 22, 8.5], // 差積。跟皇極幾乎沒區別
        // NightList: [30, 29 + 54 / 72, 29 + 18 / 72, 28 + 33 / 72, 27 + 30 / 72, 26 + 18 / 72, 25, 23 + 54 / 72, 22 + 42 / 72, 21 + 39 / 72, 20 + 54 / 72, 20 + 18 / 72, 20], // 麟德晨前刻
        NightList: [30, 29.75, 29.25, 28.458333333333333, 27.416666666666667, 26.25, 25, 23.75, 22.583333333333333, 21.541666666666667, 20.75, 20.25, 20, 20.25, 20.75, 21.541666666666667, 22.583333333333333, 23.75, 25, 26.25, 27.416666666666667, 28.458333333333333, 29.25, 29.75, 30, 29.75],
        DialList: [12.75, 12.28, 11.15, 9.62, 8.07, 6.54, 5.33, 4.24, 3.3, 2.49, 1.98, 1.64, 1.49, 1.64, 1.98, 2.49, 3.3, 4.24, 5.33, 6.54, 8.07, 9.62, 11.15, 12.28, 12.75, 12.28],
        SunLatiList: [115.3, 114.1, 111.7, 107.9, 102.9, 97.3, 91.3, 85.3, 79.7, 74.7, 70.9, 68.5, 67.3, 68.5, 70.9, 74.7, 79.7, 85.3, 91.3, 97.3, 102.9, 107.9, 111.7, 114.1, 115.3, 114.1], // 黃道去極《古代曆法》46頁
    },
    LindeB: {
        Type: 6,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[708, 716], [721, 728]],
        Solar: 365 + 328 / 1340, // 麟德不用歲差
        SolarNumer: 489428, // 期實
        Lunar: 29 + 711 / 1340, // 朔策
        LunarNumer: 39571, // 常朔實。+362:盈朔實，-351:朒朔實。這是朔望月的浮動範圍
        Denom: 1340, // 總法，目的是取消章、蔀、紀。1/4到335爲辰法
        Anoma: 27 + (743 + 1 / 12) / 1340, // 變奇1，變奇法12，月程法67=總法/20.月離表度化爲分*67
        AnomaNumer: 443077, // 變週。AnomaDenom: 12 * 1340, 
        Node: 27 + (284 + 113 / 300) / 1340, // 後準(1553+93.5/300)1340
        TermRangeA: 11 * 16 / 12, // 秋分後進綱16
        TermRangeS: 11 * 17 / 12, // 春分後退紀17
        OriginAd: 664 - 269880,
        CloseOriginAd: 664,
        // JdOrigin: 1963570.6791 - 269880 * (365 + 328 / 1340),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        WeekCorr: 1,
        MansionDayCorr: -20,
        MansionRaw: [8, 12], // 斗12。這估計是黃道度，但是沒說赤道度，奇怪
        MansionFractPosition: 8, // 沒說
        AcrTermList: [0, 14.679726, 29.437065, 44.272015, 59.106965, 73.864303, 88.54403, 104.301368, 119.981095, 135.583209, 151.185323, 166.86505, 182.622388, 198.379726, 214.059453, 229.661567, 245.263682, 260.943408, 276.700746, 291.380473, 306.137811, 320.972761, 335.807711, 350.56505, 365.244776, 365 + 328 / 1340 + 14.679726],
    },
    Shenlong: { // 開元占經、新唐志二末尾。鈕衛星《大衍寫九執公案再解讀》，《中國科技史雜誌》2009年第1期。小數是民間小曆的作法，源於印度曆法。「有黃道而無赤道」
        Type: 6,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 2448 / 10000, // 母法100，辰法8刻33分20.5.期週365。氣法15餘21奇85少半
        SolarNumer: 3652448,
        Sidereal: 365 + 2571.71 / 10000, // 天週
        Lunar: 29 + 5306 / 10000, // 朔策。閏差10.8776，沒數91.3112，沒法1.3112
        LunarNumer: 295306,
        Denom: 10000, // 假設有一個日法
        Anoma: 27 + 5545.59 / 10000, // 日週法。日差法100.976041
        Node: 27 + 2122.167 / 10000, // 交週法。交差法2.218381033「小分八十三三分」不知道是不是這個意思
        TermRangeA: 11 * 16 / 12, // 秋分後進綱16
        TermRangeS: 11 * 17 / 12, // 春分後退紀17
        AcrTermList: [0, 14.679727, 29.437067, 44.272018, 59.106969, 73.864308, 88.544036, 104.301375, 119.981102, 135.583218, 151.185333, 166.865061, 182.6224, 198.379739, 214.059467, 229.661582, 245.263698, 260.943425, 276.700764, 291.380492, 306.137831, 320.972782, 335.807733, 350.565073, 365.2448],
        OriginAd: 705 - 414360,
        CloseOriginAd: 705, // 神龍元年乙巳
        // JdOrigin: 1978545.8280 - 414360 * 365.2448,
        OriginYearSc: 42, // 上元乙巳。從上元可以推斷是戊寅曆系統的
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
    },
    Dayan: {
        Type: 7,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[729, 757]],
        Solar: 365 + 743 / 3040,
        SolarNumer: 1110343, // 策實
        Sidereal: 365 + 779.75 / 3040,
        SiderealNumer: 1110379.75, // 乾實、週天度分
        Lunar: 29 + 1613 / 3040, // 四象之策
        LunarNumer: 89773, // 揲法。用差17124:12*朔虛分1427
        Denom: 3040, // 通法。每分80秒
        Anoma: 27 + (1685 + 79 / 80) / 3040, // 近點月 
        AnomaNumer: 6701279 / 80, //  6701279轉終
        Node: 27 + 645.1322 / 3040,
        SunLimitYang: 435,
        SunLimitYin: 2524, // 原文3524，校勘記說可能有誤，舊唐書是2524
        SunLimitNoneYang: 974, // 陽曆或限        
        SunLimitNoneYin: 3659, // 陰曆或限
        MoonLimit1: 779,
        MoonLimitNone: 3523.9339, // 望差
        MoonLimitDenom: 183,
        OriginAd: 724 - 96961740,
        CloseOriginAd: 724,
        // JdOrigin: 1985485.2434 - 96961740 * (365 + 743 / 3040),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        WeekCorr: -1,
        MansionDayCorr: -8, // 這是二十八宿值日，跟宿度沒關係！
        MansionRaw: [11, 9],
        MansionFractPosition: 11, // 命起赤道虛九，宿次去之，經虛去分，至不滿宿算外，得冬至加時日度。
        SunAcrT: [0, 173.3, 175.3, 177.1, 178.8, 180.3, 181.8, 183.5, 184.9, 186.5, 188.1, 189.9, 191.9, 191.9, 189.9, 188.1, 186.5, 184.9, 183.5, 181.8, 180.3, 178.8, 177.1, 175.3, 173.3], // 辰數與盈縮分只是單位不同
        SunAcrAvgDifList: [2353, 1845, 1390, 976, 588, 214, -214, -588, -976, -1390, -1845, -2353, -2353, -1845, -1390, -976, -588, -214, 214, 588, 976, 1390, 1845, 2353, 2353], // 大衍盈縮分
        SunTcorrList: [0, 176, 314, 418, 491, 535, 551, 535, 491, 418, 314, 176, 0, -176, -314, -418, -491, -535, -551, -535, -491, -418, -314, -176, 0, 176], // 朓朒積
        AcrTermList: [0, 14.444504, 29.056113, 43.817393, 58.714857, 73.739953, 88.888076, 104.176987, 119.588925, 135.128495, 150.804249, 166.629674, 182.622204, 198.614734, 214.440159, 230.115913, 245.655482, 261.067421, 276.356332, 291.504454, 306.52955, 321.427015, 336.188295, 350.799904, 365.244408, 379.688912, 365 + 743 / 3040 + 29.056113],
        // MoonAcrVList: [917, 930, 943, 956, 970, 984, 1000, 1018, 1037, 1051, 1065, 1079, 1092, 1105, 1112, 1099, 1086, 1073, 1059, 1045, 1028, 1010, 992, 978, 964, 950, 937, 924, 923], // 最後一個923沒有,我爲了算列衰
        MoonAcrVList: [36680, 37200, 37720, 38240, 38800, 39360, 40000, 40720, 41480, 42040, 42600, 43160, 43680, 44200, 44480, 43960, 43440, 42920, 42360, 41800, 41120, 40400, 39680, 39120, 38560, 38000, 37480, 36960],
        MoonTcorrList: [0, -297, -556, -776, -956, -1095, -1192, -1234, -1170, -1064, -916, -727, -498, -231, 66, 355, 605, 816, 987, 1117, 1204, 1222, 1149, 1033, 876, 678, 441, 165], // 朓朒積
        MoonTcorrDifList: [297, 259, 220, 180, 139, 97, 48, -6, -64, -106, -148, -189, -229, -267, -297, -289, -250, -211, -171, -130, -87, -36, 18, 73, 116, 157, 198, 237, 276, 165],
        // NightList: [27 + 230 / 480, 27 + 145 / 480, 26 + 380 / 480, 25 + 475 / 480, 24 + 470 / 480, 23 + 360 / 480, 22 + 240 / 480, 21 + 120 / 480, 20 + 10 / 480, 19 + 5 / 480, 18 + 100 / 480, 17 + 335 / 480, 17 + 250 / 480], // 大衍漏刻
        NightList: [27.479166666666667, 27.302083333333333, 26.791666666666667, 25.989583333333333, 24.979166666666667, 23.75, 22.5, 21.25, 20.020833333333333, 19.010416666666667, 18.208333333333333, 17.697916666666667, 17.520833333333333, 17.697916666666667, 18.208333333333333, 19.010416666666667, 20.020833333333333, 21.25, 22.5, 23.75, 24.979166666666667, 25.989583333333333, 26.791666666666667, 27.302083333333333, 27.479166666666667, 27.302083333333333],
        // DialList: [12.715, 12.2277, 11.2182, 9.7351, 8.2106, 6.7384, 5.4319, 4.321, 3.3047, 2.5331, 1.9576, 1.6003, 1.4779, 1.6003, 1.9576, 2.5331, 3.3047, 4.321, 5.4319, 6.7384, 8.2106, 9.7351, 11.2182, 12.2277, 12.715,12.2277],
        SunLatiList: [115.2, 114.35, 111.9, 108.05, 103.2, 97.3, 91.3, 85.3, 79.4, 74.55, 70.7, 68.25, 67.4, 68.25, 70.7, 74.55, 79.4, 85.3, 91.3, 97.3, 103.2, 108.05, 111.9, 114.35, 115.2, 114.35], // 定氣黃道去極度
        MoonLatiDifList: [187, 171, 147, 115, 75, 27, -27, -75, -115, -147, -171, -187, 178], // 大衍加減率 /120爲度
        MoonLatiAccumList: [0, 187, 358, 505, 620, 695, 722, 695, 620, 505, 358, 187], // 大衍陰陽積
    },
    Zhide: { // 在大衍的基礎上每節增二日
        Type: 7,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[758, 762]],
        Solar: 365 + 743 / 3040,
        SolarNumer: 1110343, // 策實
        Sidereal: 365 + 779.75 / 3040,
        SiderealNumer: 1110379.75, // 乾實、週天度分
        Lunar: 29 + 1613 / 3040, // 四象之策
        LunarNumer: 89773, // 揲法。用差17124:12*朔虛分1427
        Denom: 3040, // 通法。每分80秒
        Anoma: 27 + (1685 + 79 / 80) / 3040, // 近點月 
        AnomaNumer: 6701279 / 80, //  6701279轉終
        Node: 27 + 645.1322 / 3040,
        AcrTermList: [0, 14.444504, 29.056113, 43.817393, 58.714857, 73.739953, 88.888076, 104.176987, 119.588925, 135.128495, 150.804249, 166.629674, 182.622204, 198.614734, 214.440159, 230.115913, 245.655482, 261.067421, 276.356332, 291.504454, 306.52955, 321.427015, 336.188295, 350.799904, 365.244408],
        OriginAd: 724 - 96961740,
        // JdOrigin: 1985485.2434 - 96961740 * (365 + 743 / 3040),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        TermCorr: 2,
        WeekCorr: -1,
        MansionDayCorr: -8,
        MansionRaw: [11, 9],
        MansionFractPosition: 11,
    },
    Wuji: { // 新唐志五
        Type: 7,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[762, 783]],
        Solar: 365 + 328 / 1340,
        SolarNumer: 489428, //策實。策餘7028
        Sidereal: 365 + 342.7 / 1340, // 週天度
        SiderealNumer: 489442.7, // 乾實。歲差14.7
        Lunar: 29 + 711 / 1340, // 四象之策
        LunarNumer: 39571, // 揲法。用差7548.掛限38357
        Denom: 1340, // 通法
        Anoma: 27 + (743 + 5 / 37) / 1340, // 轉終
        AnomaNumer: 1366156 / 37, // 轉終分1366156
        Node: 27 + 284.3767 / 1340, // 交終
        SunLimitYang: 183, // 沒說，「⋯⋯餘百八十三已下者，日亦蝕」
        MoonLimit1: 338,
        MoonLimitNone: 1553.31165, // 望差
        MoonLimitDenom: 80,
        OriginAd: 762 - 269978, // 寶應元年壬寅
        CloseOriginAd: 762,
        // JdOrigin: 1999364.6672 - 269978 * (365 + 328 / 1340), // 
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: 1,
        MansionDayCorr: -20,
        MansionRaw: [11, 4], // 上元七曜，起赤道虛四度。
        MansionFractPosition: 11, // 闕
        // MoonAcrVList: [986, 974, 962, 948, 933, 918, 902, 886, 870, 855, 841, 828, 817, 810, 808, 819, 832, 846, 861, 877, 893, 909, 924, 939, 954, 968, 979, 985, 986], // 轉法67
        MoonAcrVList: [19720, 19480, 19240, 18960, 18660, 18360, 18040, 17720, 17400, 17100, 16820, 16560, 16340, 16200, 16160, 16380, 16640, 16920, 17220, 17540, 17860, 18180, 18480, 18780, 19080, 19360, 19580, 19700, 19720],
        MoonTcorrList: [0, 135, 252, 351, 429, 485, 518, 525, 511, 473, 411, 326, 223, 105, -30, -158, -273, -368, -442, -494, -522, -525, -505, -463, -398, -309, -200, -75], // 朓朒積
        MoonTcorrDifList: [-135, -117, -99, -78, -56, -33, -8, 1, 14, 38, 62, 85, 103, 118, 135, 128, 115, 95, 74, 52, 28, 6, -3, -20, -42, -65, -89, -109, -125, -75],
        SunAcrAvgDifList: [1037, 813, 613, 430, 259, 94, -94, -259, -430, -613, -813, -1037, -1037, -813, -613, -430, -259, -94, 94, 259, 430, 613, 813, 1037, 1037],
        SunTcorrList: [0, 78, 139, 185, 217, 236, 243, 236, 217, 185, 139, 78, 0, -78, -139, -185, -217, -236, -243, -236, -217, -185, -139, -78, 0, 78], // 朓朒積
        AcrTermList: [0, 14.444652, 29.056468, 43.817537, 58.715174, 73.740423, 88.888806, 104.177488, 119.589303, 135.128731, 150.804726, 166.629975, 182.622388, 198.614801, 214.44005, 230.116045, 245.655473, 261.067289, 276.35597, 291.504353, 306.529602, 321.427239, 336.188308, 350.800124, 365.244776, 365.244776 + 14.444652, 365 + 328 / 1340 + 29.056468],
        MoonLatiDifList: [24, 17, 11, 8, 11, 17, 12, -17, -11, -8, -11, -17, -24, -12, 24],
        MoonLatiAccumList: [0, 24, 41, 52, 60, 71, 88, 100, 83, 72, 64, 53, 36, 12], // 屈伸積
    },
    Tsrengyuan: { // 新唐志五
        Type: 7,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[784, 821]],
        Solar: 365 + 268 / 1095,
        SolarNumer: 399943, //策實。策餘5743
        Sidereal: 365 + 280.02 / 1095, // 週天度
        SiderealNumer: 399955.02, // 乾實。歲差12.02
        Lunar: 29 + 581 / 1095, // 四象之策
        LunarNumer: 32336, // 揲法。用差6168.掛限。章閏11911
        Denom: 1095, // 通法
        Anoma: 27 + 607.0132 / 1095, // 轉終分301720132
        Node: 27 + 232.3815 / 1095, // 交終
        MoonLimit1: 279,
        MoonLimitNone: 1269.30925, // 望差
        MoonLimitDenom: 66,
        OriginAd: 784 - 402900, // 建中五年甲子，德宗第一個年號
        CloseOriginAd: 784,
        // JdOrigin: 2007399.8151 - 402900 * (365 + 268 / 1095),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: -2,
        MansionDayCorr: -16,
        MansionRaw: [11, 4], // 上元七曜，起赤道虛四度。
        MansionFractPosition: 11, // 闕        
        SunAcrAvgDifList: [848, 664, 501, 351, 212, 77, -77, -212, -351, -501, -664, -848, -848, -664, -501, -351, -212, -77, 77, 212, 351, 501, 664, 848, 848],
        SunTcorrList: [0, 63, 113, 150, 176, 192, 198, 192, 176, 150, 113, 63, 0, -63, -113, -150, -176, -192, -198, -192, -176, -150, -113, -63, 0, 63], // 定氣朓朒積
        AcrTermList: [0, 14.444102, 29.05624, 43.817237, 58.715221, 73.740145, 88.888356, 104.177207, 119.589346, 135.128425, 150.80449, 166.629414, 182.622374, 198.615335, 214.440259, 230.116324, 245.655403, 261.067542, 276.356393, 291.504604, 306.529528, 321.427511, 336.188508, 350.800647, 365.244749, 365.244749 + 14.444102, 365 + 268 / 1095 + 29.05624],
        // MoonAcrVList: [3222, 3184, 3144, 3099, 3050, 3001, 2948, 2896, 2844, 2795, 2746, 2700, 2670, 2648, 2641, 2677, 2720, 2765, 2814, 2867, 2919, 2971, 3020, 3069, 3118, 3164, 3200, 3220, 3222], // 轉法219
        MoonAcrVList: [16110, 15920, 15720, 15495, 15250, 15005, 14740, 14480, 14220, 13975, 13730, 13500, 13350, 13240, 13205, 13385, 13600, 13825, 14070, 14335, 14595, 14855, 15100, 15345, 15590, 15820, 16000, 16100, 16110],
        MoonTcorrList: [0, 110, 206, 287, 351, 397, 424, 430, 418, 387, 336, 268, 183, 87, -25, -132, -226, -304, -365, -407, -430, -433, -417, -382, -329, -258, -170, -68], // 朓朒積
        MoonTcorrDifList: [-110, -96, -81, -64, -46, -27, -7, 1, 12, 31, 51, 68, 85, 96, 112, 107, 94, 78, 61, 42, 23, 5, -2, -16, -35, -53, -71, -88, -102, 68],
        MoonLatiDifList: [78, 56, 36, 26, 36, 56, 39, -56, -36, -26, -36, -56, -78, -39, 78],
        MoonLatiAccumList: [0, 78, 134, 170, 196, 232, 288, 327, 271, 235, 209, 173, 117, 39],
    },
    Xuanming: {
        Type: 7,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[822, 892]],
        Solar: 365 + 2055 / 8400,
        SolarNumer: 3068055, // 章歲
        Sidereal: 365 + (2153 + 299 / 300) / 8400, // 歲差29699
        Lunar: 29 + 4457 / 8400, // 合策
        LunarNumer: 248057, // 章月
        Denom: 8400, // 統法。分統：2520000=8400*300
        Anoma: 27 + 4658.19 / 8400, // 近點月 
        AnomaNumer: 231458.19, //  
        Node: 27 + 1782.6512 / 8400, // 終日
        SunLimitYang: 2640, // 陽曆食限定法176
        SunLimitYin: 6060, // 定法404
        SunLimitNone: 8700,
        MoonLimit1: 2147, // 月全食限
        MoonLimitNone: 9737.1744, // 後準=望差
        MoonLimitDenom: 506,
        OriginAd: 822 - 7070138, // 長慶二年壬寅
        CloseOriginAd: 822,
        // JdOrigin: 2021279.2607 - 7070138 * (365 + 2055 / 8400),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: -1,
        MansionDayCorr: -8,
        MansionRaw: [11, 9], // 上元七曜，起赤道虛九度。
        MansionFractPosition: 11, // 闕
        // SunAcrAvgDifList: [60, 50, 40, 30, 18, 6, -6, -18, -30, -40, -50, -60, -60, -50, -40, -30, -18, -6, 6, 18, 30, 40, 50, 60, 60], // 盈縮分
        SunAcrAvgDifList: [6000, 5000, 4000, 3000, 1800, 600, -600, -1800, -3000, -4000, -5000, -6000, -6000, -5000, -4000, -3000, -1800, -600, 600, 1800, 3000, 4000, 5000, 6000, 6000],
        SunTcorrList: [0, 449, 823, 1122, 1346, 1481, 1526, 1481, 1346, 1122, 823, 449, 0, -449, -823, -1122, -1346, -1481, -1526, -1481, -1346, -1122, -823, -449, 0, 449],
        AcrTermList: [0, 14.504241, 29.12753, 43.869866, 58.73125, 73.735491, 88.882589, 104.172545, 119.605357, 135.181027, 150.875744, 166.689509, 182.622321, 198.555134, 214.368899, 230.063616, 245.639286, 261.072098, 276.362054, 291.509152, 306.513393, 321.374777, 336.117113, 350.740402, 365.244643, 365.244643 + 14.504241, 365 + 2055 / 8400 + 29.12753],
        // MoonAcrVList: [1012, 1026, 1042, 1060, 1078, 1096, 1115, 1134, 1153, 1172, 1191, 1209, 1223, 1234, 1234, 1220, 1203, 1185, 1167, 1149, 1131, 1112, 1093, 1074, 1056, 1039, 1024, 1012, 1012], // 以刻法84約曆分爲度
        MoonAcrVList: [101200, 102600, 104200, 106000, 107800, 109600, 111500, 113400, 115300, 117200, 119100, 120900, 122300, 123400, 123400, 122000, 120300, 118500, 116700, 114900, 113100, 111200, 109300, 107400, 105600, 103900, 102400, 101200],
        MoonTcorrList: [0, -830, -1556, -2162, -2633, -2970, -3172, -3218, -3136, -2912, -2546, -2037, -1394, -646, 0, 830, 1556, 2154, 2618, 2947, 3142, 3188, 3106, 2881, 2515, 2014, 1386, 646], // 朓朒積。宣明很特殊，分成兩截。宣明也是遠地點入轉        
        MoonTcorrDifList: [830, 726, 606, 471, 337, 202, 53, -7, -82, -224, -366, -509, -643, -748, -646, -830, -726, -598, -464, -329, -195, -53, 7, 82, 225, 366, 501, 628, 740, 646],
        NightList: [27.4, 27.29, 26.74, 26.1, 25.09, 23.74, 22.42, 21.1, 19.75, 18.74, 18.1, 17.55, 17.44, 17.55, 18.1, 18.74, 19.75, 21.1, 22.42, 23.74, 25.09, 26.1, 26.74, 27.29, 27.4, 27.29], // 宣明夜半定漏。欽天失傳
        DialList: [12.7312, 12.3911, 11.383, 9.9478, 8.3781, 6.8874, 5.447, 4.1959, 3.2069, 2.4451, 1.8989, 1.5714, 1.478, 1.5714, 1.8989, 2.4451, 3.2069, 4.1959, 5.447, 6.8874, 8.3781, 9.9478, 11.383, 12.3911, 12.7312],
        // SunLatiList: [0, 115 + 17 / 84, 114 + 46 / 84, 112 + 25 / 84, 108 + 55 / 84, 103 + 67 / 84, 97 + 80 / 84, 91 + 25 / 84, 84 + 55 / 84, 78 + 67 / 84, 73 + 80 / 84, 70 + 25 / 84, 68 + 4 / 84, 67 + 34 / 84],
        SunLatiList: [115.20238095238095, 114.54761904761905, 112.29761904761905, 108.6547619047619, 103.79761904761905, 97.95238095238095, 91.29761904761905, 84.6547619047619, 78.79761904761905, 73.95238095238095, 70.29761904761905, 68.04761904761905, 67.4047619047619, 68.04761904761905, 70.29761904761905, 73.95238095238095, 78.79761904761905, 84.6547619047619, 91.29761904761905, 97.95238095238095, 103.79761904761905, 108.6547619047619, 112.29761904761905, 114.54761904761905, 115.20238095238095, 114.54761904761905]
    },
    Chongxuan: { // 新唐志六下。崇玄發揚了符天的公式化，符天：平行實行差=(182-平行度)*平行度/3300「相減相乘」。陳美東《中國古代有關曆表及其算法的公式化》，《自然科學史研究》1988年第3期
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[893, 955]],
        Solar: 365 + 3301 / 13500,
        SolarNumer: 4930801, // 歲實。歲餘70801
        Sidereal: 365 + 3461.24 / 13500, // 歲差160.24
        Lunar: 29 + 7163 / 13500, // 朔實。平會29，餘7163
        LunarNumer: 398663,
        Denom: 13500, // 通法
        Anoma: 27 + 7486.97 / 13500, // 轉終
        AnomaNumer: 371986.97, //  轉週分
        AnomaCycle: 374.28, // 轉終度。不知道是什麼，照理說應該是368.37
        Node: 27 + 2864.9673 / 13500,
        OriginAd: 892 - 53947308, // 景福元年壬子
        CloseOriginAd: 892,
        // JdOrigin: 2046846.3302 - 53947308 * (365 + 3301 / 13500),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: -2,
        MansionDayCorr: -16,
        MansionRaw: [11, 4],
        MansionFractPosition: 11, // 其上元七曜，起赤道虛四度。
        SunAcrAvgDifList: [7740, 6069, 4572, 3250, 1977, 660, -660, -1977, -3250, -4572, -6069, -7740, -7740, -6069, -4572, -3250, -1977, -660, 660, 1977, 3250, 4572, 6069, 7740, 7740],
        SunTcorrList: [0, 782, 1395, 1857, 2185, 2385, 2452, 2385, 2185, 1857, 1395, 782, 0, -782, -1395, -1857, -2185, -2385, -2452, -2385, -2185, -1857, -1395, -782, 0, 782], // 朓朒積
        AcrTermList: [0, 14.645188, 29.414154, 44.294009, 59.27179, 74.343867, 89.5135, 104.78091, 120.145877, 135.605139, 151.162327, 166.830404, 182.622259, 198.414114, 214.082191, 229.63938, 245.098642, 260.463608, 275.731019, 290.900651, 305.972728, 320.950509, 335.830364, 350.59933, 365.244519, 365 + 3301 / 13500 + 14.645188],
        MoonAcrVList: [1207, 1223, 1240, 1258, 1276, 1295, 1316, 1339, 1365, 1383, 1401, 1420, 1437, 1453, 1464, 1447, 1429, 1411, 1393, 1375, 1353, 1328, 1306, 1287, 1268, 1250, 1233, 1216, 1207], // 度母100，累轉分爲轉積度
        // MoonAcrVList: [162945, 165105, 167400, 169830, 172260, 174825, 177660, 180765, 184275, 186705, 189135, 191700, 193995, 196155, 197640, 195345, 192915, 190485, 188055, 185625, 182655, 179280, 176310, 173745, 171180, 168750, 166455, 164160, 162945],
        MoonTcorrList: [0, -1319, -2469, -3447, -4246, -4863, -5294, -5480, -5195, -4724, -4074, -3234, -2217, -1032, 293, 1577, 2687, 3628, 4385, 4963, 5349, 5429, 5105, 4589, 3892, 3013, 1960, 737], // 朓朒積
        MoonTcorrDifList: [1319, 1150, 978, 799, 617, 431, 213, -27, -285, -471, -650, -840, -1017, -1185, -1325, -1284, -1110, -941, -757, -578, -386, -160, 80, 324, 516, 697, 879, 1053, 1223, 737],
    },
    Qintian: { // 新五代志一。統法7200經法72通法100
        Type: 7,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[956, 963]],
        Solar: 365.2445, // 歲策 + 1760.40 / 7200
        SolarNumer: 2629760.40, // 歲實。歲餘
        Sidereal: 365 + 1844.80 / 7200, // 軌策。歲差84.40.辰則600，八刻二十四分
        SiderealNumer: 2629844.80, // 軌率
        Lunar: 29 + 3720.28 / 7200, // 朔實
        LunarNumer: 212620.28, // 朔率
        Denom: 7200, // 統法
        Anoma: 27 + 3993.09 / 7200, // 離策
        AnomaNumer: 198393.09, //  離率
        Node: 27 + 1527.9756 / 7200, // 交策
        SunLimitNoneYang: 4219,
        SunLimitNoneYin: 10383,
        MoonLimit1: 1736,
        MoonLimitNone: 6995,
        MoonLimitDenom: 526,
        OriginAd: 956 - 72698452, // 顯德三年丙辰
        CloseOriginAd: 956,
        // JdOrigin: 2070222.0140 - 72698452 * (365 + 1760.40 / 7200),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: 2,
        MansionDayCorr: -12,
        MansionRaw: [11, 8],
        MansionFractPosition: 11, // 命赤道虛八算外
        AcrTermList: [0, 14.504235, 29.127518, 43.869848, 58.731226, 73.735461, 88.882554, 104.172503, 119.60531, 135.180973, 150.875685, 166.689443, 182.62225, 198.555057, 214.368815, 230.063527, 245.63919, 261.071997, 276.361946, 291.509039, 306.513274, 321.374652, 336.116982, 350.740265, 365.2445],
        SunAcrAvgDifList: [7740, 6069, 4572, 3250, 1977, 660, -660, -1977, -3250, -4572, -6069, -7740, -7740, -6069, -4572, -3250, -1977, -660, 660, 1977, 3250, 4572, 6069, 7740, 7740],
        SunTcorrList: [0, 417, 744, 990, 1165, 1272, 1308, 1272, 1165, 990, 744, 417, 0, -417, -744, -990, -1165, -1272, -1308, -1272, -1165, -990, -744, -417, 0, 417],
        MoonAcrVList: [1468, 1457, 1442, 1422, 1399, 1373, 1347, 1321, 1295, 1271, 1247, 1228, 1214, 1204, 1208, 1219, 1236, 1258, 1281, 1307, 1333, 1359, 1384, 1408, 1431, 1449, 1463, 1472, 1468], // 其日離程，用紀元補上
        MoonTcorrList: [0, 83.33, 165.69, 247.09, 327.53, 407.01, 485.52, 563.07, 639.65, 715.28, 790.45, 864.54, 937.53, 1009.43, 1080.24, 1149.96, 1218.59, 1286.12, 1352.57, 1419.01, 1484.08, 1547.8, 1610.15, 1671.14, 1730.78, 1789.05, 1845.96, 1901.5, 1956.24, 2009.47, 2061.21, 2111.45, 2160.2, 2207.44, 2253.19, 2297.44, 2340.19, 2381.97, 2422.12, 2460.64, 2497.53, 2532.79, 2566.42, 2598.43, 2628.8, 2657.55, 2685.05, 2710.82, 2734.87, 2757.19, 2777.8, 2796.68, 2813.84, 2829.28, 2843, 2854.38, 2864.19, 2872.44, 2879.11, 2884.22, 2887.76, 2889.73, 2890.13, 2888.97, 2886.58, 2882.54, 2876.84, 2869.49, 2860.48, 2849.82, 2837.5, 2823.53, 2807.9, 2790.37, 2771.24, 2750.52, 2728.21, 2704.3, 2678.8, 2651.7, 2623.01, 2592.72, 2560.68, 2527.09, 2491.94, 2455.23, 2416.97, 2377.16, 2335.79, 2292.86, 2248.38, 2201.07, 2152.52, 2102.73, 2051.71, 1999.45, 1945.96, 1891.22, 1835.25, 1778.04, 1718.47, 1657.94, 1596.45, 1534.02, 1470.62, 1406.27, 1340.97, 1274.71, 1207.5, 1139.13, 1069.86, 999.69, 928.61, 856.62, 783.73, 709.93, 635.23, 559.62, 478, 396.75, 315.87, 235.36, 155.23, 75.47, -3.92, -82.94, -161.58, -241.55, -320.73, -399.1, -476.68, -553.47, -629.45, -704.64, -779.03, -852.63, -927.13, -1000.41, -1072.47, -1143.31, -1212.92, -1281.3, -1348.46, -1414.4, -1479.11, -1543.46, -1606.38, -1667.85, -1727.88, -1786.47, -1843.62, -1899.33, -1953.6, -2006.43, -2057.96, -2108.01, -2156.58, -2203.68, -2249.31, -2293.47, -2336.15, -2377.36, -2417.09, -2456.13, -2493.5, -2529.21, -2563.24, -2595.61, -2626.31, -2655.34, -2682.7, -2708.4, -2732.54, -2754.98, -2775.72, -2794.78, -2812.13, -2827.79, -2841.76, -2854.03, -2864.61, -2873.23, -2880.22, -2885.58, -2889.31, -2891.41, -2891.88, -2890.73, -2887.95, -2883.53, -2877.21, -2869.34, -2859.9, -2848.9, -2836.35, -2822.24, -2806.56, -2789.33, -2770.54, -2750.23, -2728.35, -2704.9, -2679.88, -2653.3, -2625.15, -2595.43, -2564.14, -2531.29, -2496.8, -2460.77, -2423.18, -2384.04, -2343.35, -2301.1, -2257.31, -2211.96, -2165.06, -2115.46, -2064.6, -2012.48, -1959.08, -1904.42, -1848.5, -1791.3, -1732.84, -1673.11, -1611.03, -1547.95, -1483.87, -1418.8, -1352.74, -1285.68, -1217.63, -1148.59, -1078.55, -1006.15, -932.49, -857.56, -781.36, -703.89, -625.16, -545.16, -463.9, -403.47, -323.49, -242.52, -160.55, -77.59, 6.37],
        MoonAcrVList: [1469.82, 1468.31, 1466.78, 1465.22, 1463.64, 1462.04, 1460.41, 1458.75, 1457.07, 1455.37, 1453.73, 1452.05, 1450.32, 1448.55, 1446.72, 1444.84, 1442.91, 1440.94, 1438.91, 1436.75, 1434.56, 1432.34, 1430.1, 1427.83, 1425.53, 1423.2, 1420.85, 1418.46, 1416.02, 1413.55, 1411.06, 1408.56, 1406.04, 1403.5, 1400.94, 1398.36, 1395.77, 1393.12, 1390.46, 1387.79, 1385.11, 1382.42, 1379.72, 1377.02, 1374.3, 1371.57, 1368.8, 1366.03, 1363.26, 1360.49, 1357.72, 1354.95, 1352.18, 1349.41, 1346.63, 1343.86, 1341.09, 1338.32, 1335.55, 1332.78, 1330.01, 1327.24, 1324.47, 1321.69, 1318.84, 1316, 1313.19, 1310.39, 1307.62, 1304.87, 1302.15, 1299.44, 1296.75, 1294.14, 1291.54, 1288.94, 1286.35, 1283.78, 1281.21, 1278.65, 1276.1, 1273.56, 1270.91, 1268.29, 1265.72, 1263.18, 1260.69, 1258.23, 1255.82, 1253.45, 1251.11, 1248.78, 1246.5, 1244.27, 1242.09, 1239.95, 1237.87, 1235.83, 1233.85, 1231.91, 1229.97, 1228.1, 1226.29, 1224.54, 1222.85, 1221.22, 1219.65, 1218.15, 1216.7, 1215.04, 1213.5, 1212.1, 1210.83, 1209.7, 1208.69, 1207.82, 1207.08, 1206.48, 1205.88, 1205.45, 1205.18, 1205.07, 1205.13, 1205.35, 1205.73, 1206.28, 1206.99, 1208.29, 1209.64, 1211.06, 1212.52, 1214.05, 1215.63, 1217.26, 1218.95, 1220.69, 1222.56, 1224.46, 1226.4, 1228.38, 1230.41, 1232.47, 1234.57, 1236.71, 1238.9, 1241.22, 1243.55, 1245.91, 1248.27, 1250.66, 1253.06, 1255.47, 1257.9, 1260.34, 1262.75, 1265.19, 1267.66, 1270.15, 1272.67, 1275.22, 1277.8, 1280.4, 1283.04, 1285.81, 1288.58, 1291.35, 1294.12, 1296.89, 1299.66, 1302.44, 1305.21, 1307.98, 1310.75, 1313.52, 1316.29, 1319.06, 1321.83, 1324.6, 1327.38, 1330.15, 1332.92, 1335.75, 1338.57, 1341.37, 1344.16, 1346.93, 1349.68, 1352.42, 1355.15, 1357.86, 1360.52, 1363.17, 1365.81, 1368.45, 1371.08, 1373.71, 1376.33, 1378.94, 1381.55, 1384.15, 1386.75, 1389.34, 1391.92, 1394.5, 1397.07, 1399.64, 1402.19, 1404.75, 1407.43, 1410.07, 1412.67, 1415.23, 1417.75, 1420.24, 1422.68, 1425.08, 1427.44, 1429.81, 1432.13, 1434.39, 1436.61, 1438.77, 1440.88, 1442.93, 1444.94, 1446.89, 1448.89, 1450.81, 1452.65, 1454.42, 1456.11, 1457.72, 1459.26, 1460.71, 1462.1, 1463.53, 1464.9, 1466.22, 1467.5, 1468.71, 1469.88, 1471, 1472.06, 1471.07, 1471.69, 1472.22, 1472.68, 1473.06, 1473.37, 1473.6],
    },

    //////////////////////

    Jiuzhi: { //我沒怎麼遵照原始的算法，只是用sin算定日月。顧觀光《九執曆解》，《武陵山人遺書》，《中國科學技術典籍通匯》天文部分第843頁。開元占經卷104。度分體系：360度，1度=60分，跟現在完全一樣。電子版可參https://www.eee-learning.com/book/kaiyenjan104
        // https://zh.wikipedia.org/zh-hant/%E4%B9%9D%E5%9F%B7%E6%9B%86 九執是指太陽、月亮、金星、木星、水星、火星、土星五星，再加計都、羅睺二暗曜。《九執曆》歲實365.2469日，朔策29.53058日，以二月春分朔爲曆元，周天爲三百六十度；三十爲一相，六十爲一交，十二相而周天；以兩月爲時，六時爲歲；從朔到望叫做白博叉，從望到朔叫黑博叉。推算交食的食限是用合朔時月亮離交點及月亮黃緯來表示。規定當日月合朔發生在距交點的黃道度數不超過12度時，即發生交食；交點以6794日退行一周天。
        // 《推積日及小餘章》上古积年数太繁广，每因章首，遂便删除，务从简易，用舍随时。今起显庆二年丁巳岁二月一日，以为历首，至开元二年甲寅岁，置积年57算。术曰: 置积年，以12乘之，加自入年已来所积月。（假令推其年三月五日事，即历起二月一日为首，于12乘讫，数上更加1算，即是加入年所经一个月了。）加讫，重张位下，以7乘之，恒加132，以228除之，得闰月。以闰月加上位，为积月，以30乘之，加自入月已来所经日。（假令推三月五日事，即于三十乘讫，数上更加五算，即是加入月所经五日了。）重张位下位，11乘之，恒加差429，以703除之， 得自入历已来所经小月（其小月梵云欠夜），不尽为小余（其小梵云小月餘）。以小月减上位，为积日。（鈕衛星《符天曆曆元問題再研究》，《自然科學史研究》2017年第1期）
        // 中日、中月就是平行度
        Type: 5,
        isAcr: true,
        Solar: 365.25875, // 陳久金《符天曆研究》。顧：365.2762必譯書者之失
        SunAvgVDeg: 887 / 900,
        MoonAvgVDeg: 12 + 887 / 900,
        Sidereal: 365.25875, // 闕
        Lunar: 29 + 373 / 703, // 29.530583 
        Anoma: 27.5545415, // 沒找到，暫時胡謅一個
        MoonAcrVDeg: [0, -77, -71, -61, -47, -30, -10, 10, 30, 47, 61, 71, 77, 77, 71, 61, 47, 30, 10, -10, -30, -47, -61, -71, -77, -77], // 月段六。原文：77, 71, 61, 47, 30, 10
        SunAcrAvgDifList: [35, 32, 27, 22, 13, 5, -5, -13, -22, -27, -32, -35, -35, -32, -27, -22, -13, -5, 5, 13, 22, 27, 32, 35, 35], // 日段六。原文： 35, 32, 27, 22, 13, 5。一段管15度，兩段管一相。所以1段=15度，1相=30度，12相=360度。這個是要從冬至開始
        OriginAd: 657,
        CloseOriginAd: 657, // 顯慶二年二月一日曆首
        // JdOrigin: 1961014.1853 - 23.5,
        OriginYearSc: 54, // 657年丁巳
        OriginMonNum: 3, // 春分朔
        ZhengNum: 3, // 建卯
        WinsolsCorr: 55,
        FirstCorr: 32.5, //
        AnomaCorr: 15,
    },
    Futian: { // 陳久金《符天曆研究》。調元沿襲符天。參數以崇玄補之
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[961, 993]],
        Solar: 365.2445,
        Sidereal: 365.2564,
        Lunar: 29.5306,
        Anoma: 27.55459,
        AcrTermList: [0, 14.44651, 29.033385, 43.760626, 58.628232, 73.636205, 88.784543, 104.073246, 119.502316, 135.071751, 150.781552, 166.631718, 182.62225, 198.612782, 214.462948, 230.172749, 245.742184, 261.171254, 276.459957, 291.608295, 306.616268, 321.483874, 336.211115, 350.79799, 365.2445],
        OriginAd: 660,
        CloseOriginAd: 660, // 660-2-16 Jd1962169 顯慶五年庚申正月壬寅雨水朔
        // JdOrigin: 1962169 - 39, // 雨水
        // JdOrigin:1962108.6259, // 冬至
        OriginMonNum: 2, // 雨水元
        ZhengNum: 2,
        WinsolsCorr: 39, // 經朔癸卯朔旦雨水
        FirstCorr: -9.4694,
        AnomaCorr: 18,
    },
    // 下宋曆
    Yingtian: { // 宋志一
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[964, 982]],
        Solar: 365 + 2445 / 10002, // 破解成功。
        SolarNumer: 730635, // 歲盈。=3653175/5
        Sidereal: 365 + 2563.19 / 10002, // 2563.1888 / 10002這個根據天總*5再減一點。「小餘2563微88」不懂。下三曆的虛分跟週天有細微差別，爲何
        SiderealNumer: 730658.64, // 天總
        Lunar: 29 + 5307 / 10002, // 會日
        LunarNumer: 59073, // 月率=295365/5
        Denom: 10002, // 元法
        Anoma: 27 + 5546.6210 / 10002, // 
        AnomaNumer: 55120.1242, // 離總，5倍！
        Node: 27 + 2122.6995 / 10002, // 我自己湊出來的，正好。校勘記「以應天元法乘正交三百六十三度，加小餘八千二百八十三，得三百六十三萬九千九，以五除之，得七十二萬七千八百一，餘四分；再以四分化爲四百秒，加秒七，得四百七秒，以五除之，得秒八十一又十分之四秒。此處“七十一萬七千八百一”應作“七十二萬七千八百一”。」
        SunLimitYang: 420, // 應天是分，/100是度
        SunLimitYin: 960,
        SunLimitNone: 1380,
        MoonLimit1: 340,
        MoonLimit2: 900, // 「其前後分，以九百以上入或食或不食之限」
        MoonLimitNone: 1550,
        MoonLimitDenom: 121, // 應天乾元儀天的月食定法根據(MoonLimitNone - MoonLimit1) / MagniPortion自己算出來
        // NodeNumer:727801.82, // 交總
        // 初準16641中準18191末準1550
        OriginAd: 962 - 4825558,
        CloseOriginAd: 962, // 建隆三年壬戌
        // JdOrigin: 2072413.5084 - 4825558 * (365 + 2445 / 10002),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4], // 命起赤道虛宿四度分
        MansionFractPosition: 11, // 虛分
        SunAcrAvgDifList: [7142, 5951, 4762, 3571, 2143, 714, -714, -2143, -3571, -4762, -5951, -7142, -7142, -5951, -4762, -3571, -2143, -714, 714, 2143, 3571, 4762, 5951, 7142, 7142],
        SunTcorrList: [-20, 529, 975, 1335, 1606, 1771, 1819, 1780, 1605, 1350, 995, 541, 5, -549, -985, -1346, -1611, -1780, -1831, -1786, -1621, -1357, -988, -550, -20, 529], // 先後積=盈縮準-常數
        AcrTermList: [0, 14.504515, 29.128006, 43.870521, 58.73205, 73.736303, 88.883475, 104.1732, 119.6061, 135.181515, 150.8763, 166.689721, 182.62235, 198.554903, 214.368318, 230.062909, 245.6386, 261.071025, 276.361206, 291.508321, 306.512612, 321.374103, 336.116418, 350.740109, 365.2445, 365 + 2445 / 10002 + 14.504515], // 原來是336.166418我改了
        MoonAcrVList: [1210, 1227, 1245, 1262, 1281, 1301, 1321, 1345, 1369, 1390, 1415, 1435, 1456, 1470, 1470, 1453, 1432, 1406, 1380, 1358, 1337, 1325, 1294, 1274, 1256, 1240, 1225, 1210], // 28個。離分.度母10000
        MoonTcorrList: [0, -988, -1852, -2574, -3135, -3526, -3776, -3831, -3732, -3465, -3300, -2424, -1659, -769, 0, 988, 1852, 2564, 3116, 3508, 3740, 3795, 3697, 3429, 2993, 2397, 1649, 769], // 先後積
        // MoonTcorrDifListA: [988, 864, 722, 561, 391, 250, 55, -99, -267, -165, -876, -765, -890],
        // MoonTcorrDifListB: [-988, -864, -712, -552, -392, -232, -55, 98, 268, 436, 596, 748, 880],
        MoonTcorrDifList: [
            988, 864, 722, 561, 391, 250, 63, -8, // 0-7
            -99, -267, -165, -876, -765, -890, -769, // 8-14
            -988, -864, -712, -552, -392, -232, -63, 8, // 15-22
            98, 268, 436, 596, 748, 880, 769], // 23-29
        // NightList: [2748 / 100.02, 2735 / 100.02, 2688 / 100.02, 2612 / 100.02, 2508 / 100.02, 2388 / 100.02, 2250 / 100.02, 2112 / 100.02, 1992 / 100.02, 1888 / 100.02, 1812 / 100.02, 1765 / 100.02, 1752 / 100.02], // 應天晨分，處理了一下
        NightList: [27.474505098980206, 27.344531093781246, 26.874625074985005, 26.114777044591083, 25.0749850029994, 23.875224955009, 22.495500899820037, 21.115776844631075, 19.916016796640672, 18.87622475504899, 18.11637672465507, 17.646470705858828, 17.516496700659868, 17.646470705858828, 18.11637672465507, 18.87622475504899, 19.916016796640672, 21.115776844631075, 22.495500899820037, 23.875224955009, 25.0749850029994, 26.114777044591083, 26.874625074985005, 27.344531093781246, 27.474505098980206, 27.344531093781246],
        DialList: [12.71, 12.31, 11.21, 9.71, 8.21, 6.74, 5.43, 4.31, 3.31, 2.53, 1.96, 1.6, 1.48, 1.6, 1.92, 2.53, 3.31, 4.31, 5.43, 6.74, 8.21, 9.71, 11.21, 12.31, 12.71, 12.31],
        SunLatiList: [115.2, 114.58, 112.32, 108.67, 103.81, 97.93, 91.31, 84.67, 78.79, 73.92, 70.27, 68.02, 67.39, 68.02, 70.27, 73.92, 78.79, 84.67, 91.31, 97.93, 103.81, 108.67, 112.32, 114.58, 115.2, 114.58], // 《中國古代曆法》頁46
    },
    Qianyuan: { // 宋志一
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[983, 1000]],
        Solar: 365 + 72 / 294, // 終於破解了，原來是要去掉0
        SolarNumer: 214764, // 歲週
        Sidereal: 365 + 753.75535 / 2940, // 。週天2563。 。會週17364， 會餘214764
        SiderealNumer: 214077.751070, // 軌率.週天策1073853.75535，5.0161857倍
        Lunar: 29 + 1560 / 2940, // 朔策
        Denom: 2940, // 元率
        Anoma: 27 + 1630.6020 / 2940, // 轉歷
        AnomaNumer: 16200.1204, // 轉分
        Node: 27 + 623.9455 / 2940,
        // 初限36594中限40002末限3408
        YinyangCorr: -1,
        SunLimitYang: 920, // 920更接近4.2度，940的話太多了
        SunLimitYin: 2130,
        SunLimitNone: 3050,
        MoonLimit1: 768, // 原文752,但是3408-752=2656，不等於264*10
        MoonLimitNone: 3408,
        MoonLimitDenom: 264,
        OriginAd: 981 - 30543977,
        CloseOriginAd: 981, // 太平興國六年辛巳
        // JdOrigin: 2079353.1327 - 30543977 * (365 + 72 / 294),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        WeekCorr: -2, // 5
        MansionDayCorr: -16,
        ZhengNum: 2,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        // SunAcrAvgDifList: [170, 133, 101, 71, 43, 14, -14, -43, -71, -101, -133, -170, -170, -133, -101, -71, -43, -14, 14, 43, 71, 101, 133, 170, 170], // 損益率
        SunAcrAvgDifList: [2276, 1784, 1344, 956, 581, 194, -194, -581, -956, -1344, -1784, -2276, -2276, -1784, -1344, -956, -581, -194, 194, 581, 956, 1344, 1784, 2276, 2276], // 陰陽分
        SunTcorrList: [0, 170, 303, 404, 475, 518, 532, 518, 475, 404, 303, 170, 0, -170, -303, -404, -475, -518, -532, -518, -475, -404, -303, -170, 0, 170], // 陰陽差
        AcrTermList: [0, 14.444388, 29.056122, 43.817517, 58.710884, 73.731803, 88.884354, 104.168878, 119.585034, 135.128741, 150.804422, 166.629762, 182.622449, 198.615136, 214.440476, 230.116156, 245.659864, 261.07602, 276.360544, 291.513095, 306.534014, 321.427381, 336.188776, 350.80051, 365.244898, 365 + 72 / 294 + 14.444388],
        MoonAcrVList: [1206, 1222, 1239, 1256, 1277, 1296, 1217, 1340, 1366, 1381, 1403, 1420, 1435, 1459, 1464, 1445, 1430, 1410, 1391, 1374, 1351, 1328, 1307, 1289, 1217, 1252, 1235, 1217, 1206], // 離度乘100
        // MoonAcrVList: [355, 361, 364, 369, 375, 381, 387, 394, 401, 407, 413, 417, 423, 427, 430, 425, 420, 415, 410, 404, 397, 390, 384, 378, 372, 367, 363, 358, 355], // 離差
        MoonTcorrList: [0, -287, -537, -750, -923, -1057, -1150, -1190, -1128, -1026, -885, -702, -481, -225, 63, 343, 585, 790, 955, 1081, 1165, 1183, 1112, 1000, 850, 657, 428, 161], // 陰陽差。陳美東843改成850，奇怪，「四十三」和「五十」怎麼會錯呢？
        MoonTcorrDifList: [287, 250, 213, 173, 134, 93, 46, -6, -62, -102, -141, -183, -221, -256, -288, -280, -242, -205, -165, -126, -84, -35, 17, 71, 112, 150, 193, 229, 267, 161],
        NightList: [808 / 29.4, 801 / 29.4, 787 / 29.4, 762 / 29.4, 732 / 29.4, 696 / 29.4, 660 / 29.4, 624 / 29.4, 588 / 29.4, 558 / 29.4, 534 / 29.4, 519 / 29.4, 515 / 29.4, 519 / 29.4, 534 / 29.4, 558 / 29.4, 588 / 29.4, 624 / 29.4, 660 / 29.4, 696 / 29.4, 732 / 29.4, 762 / 29.4, 787 / 29.4, 801 / 29.4, 808 / 29.4, 801 / 29.4], // 乾元晨分        
        DialList: [12.71, 12.31, 11.21, 9.73, 8.21, 6.73, 5.43, 4.31, 3.3, 2.5, 1.93, 1.6, 1.47, 1.6, 1.95, 2.53, 3.3, 4.31, 5.43, 6.73, 8.21, 9.73, 11.21, 12.31, 12.71, 12.31],
        SunLatiList: [115.2, 114.58, 112.32, 108.67, 103.81, 97.93, 91.31, 84.67, 78.79, 73.92, 70.27, 68.02, 67.39, 68.02, 70.27, 73.92, 78.79, 84.67, 91.31, 97.93, 103.81, 108.67, 112.32, 114.58, 115.2, 114.58], // 應天
    },
    Zhidao1: { // 曲安京《曆法》頁115
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 2591 / 10590,
        Sidereal: 365 + 2713.99 / 10590,
        Lunar: 29 + 5619 / 10590,
        Denom: 10590,
        Anoma: 27 + 5873.4551 / 10590,
        Node: 27 + 2247.0008 / 10590,
        MansionRaw: [11, 5],
        MansionFractPosition: 11,
        OriginMonNum: 0,
        ZhengNum: 2,
        OriginAd: 995 - 16515091,
        CloseOriginAd: 995,
        AcrTermList: [0, 14.444378, 29.056103, 43.817488, 58.710846, 73.731754, 88.884296, 104.16881, 119.584957, 135.128654, 150.804325, 166.629656, 182.622333, 198.615011, 214.440342, 230.116012, 245.65971, 261.075857, 276.360371, 291.512912, 306.533821, 321.427179, 336.188563, 350.800288, 365.244665, 379.689043],
        SunAcrAvgDifList: [7741, 6068, 4571, 3252, 1976, 660, -660, -1976, -3252, -4571, -6068, -7741, -7741, -6068, -4571, -3252, -1976, -660, 660, 1976, 3252, 4571, 6068, 7741, 7741],
        SunTcorrList: [0, 612, 1091, 1455, 1711, 1866, 1916, 1866, 1711, 1455, 1091, 612, 0, -612, -1091, -1455, -1711, -1866, -1916, -1866, -1711, -1455, -1091, -612, 0, 612],
        MoonAcrVList: [1207, 1228, 1238, 1255, 1276, 1296, 1316, 1340, 1364, 1384, 1405, 1418, 1439, 1452, 1463, 1446, 1429, 1412, 1395, 1374, 1350, 1327, 1306, 1286, 1265, 1248, 1235, 1218, 1207],
        MoonTcorrList: [0, -1034, -1934, -2702, -3325, -3807, -4142, -4286, -4063, -3696, -3188, -2529, -1733, -810, 227, 1236, 2107, 2846, 3440, 3894, 4196, 4261, 4005, 3602, 3062, 2367, 1542, 580],
        MoonTcorrDifList: [1034, 901, 767, 623, 483, 335, 166, -22, -223, -367, -508, -659, -796, -922, -1037, -1009, -872, -738, -594, -454, -303, -126, 61, 256, 403, 540, 695, 825, 962, 580],
    },
    Zhidao2: {
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 416 / 1700,
        Sidereal: 365 + 435.67 / 1700,
        Lunar: 29 + 902 / 1700,
        Denom: 1700,
        Anoma: 27 + 942.9302 / 1700,
        Node: 27 + 360.7942 / 1700,
        ScCorr: 30, // 甲午
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        OriginMonNum: 0,
        ZhengNum: 2,
        OriginAd: 995 - 3981151,
        CloseOriginAd: 995,
        AcrTermList: [0, 14.44438, 29.056107, 43.817493, 58.710853, 73.731763, 88.884306, 104.168822, 119.58497, 135.12867, 150.804342, 166.629675, 182.622354, 198.615033, 214.440366, 230.116038, 245.659738, 261.075886, 276.360401, 291.512945, 306.533855, 321.427215, 336.188601, 350.800327, 365.244706, 379.689086],
        SunAcrAvgDifList: [7741, 6068, 4571, 3252, 1976, 660, -660, -1976, -3252, -4571, -6068, -7741, -7741, -6068, -4571, -3252, -1976, -660, 660, 1976, 3252, 4571, 6068, 7741, 7741],
        SunTcorrList: [0, 98, 175, 234, 275, 300, 308, 300, 275, 234, 175, 98, 0, -98, -175, -234, -275, -300, -308, -300, -275, -234, -175, -98, 0, 98],
        MoonAcrVList: [1207, 1228, 1238, 1255, 1276, 1296, 1316, 1340, 1364, 1384, 1405, 1418, 1439, 1452, 1463, 1446, 1429, 1412, 1395, 1374, 1350, 1327, 1306, 1286, 1265, 1248, 1235, 1218, 1207],
        MoonTcorrList: [0, -166, -311, -434, -534, -611, -665, -688, -652, -593, -512, -406, -278, -130, 36, 198, 338, 457, 552, 625, 674, 684, 643, 578, 491, 380, 247, 93],
        MoonTcorrDifList: [166, 145, 123, 100, 77, 54, 27, -3, -36, -59, -82, -106, -128, -148, -167, -162, -140, -119, -95, -73, -49, -20, 10, 41, 65, 87, 112, 132, 154, 93],
    },
    Yitian: { // 宋志
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1001, 1023]],
        Solar: 365 + 2470 / 10100, // 365.2445。歲餘52970，餘2470
        SolarNumer: 368897, // 歲週
        Sidereal: 365 + 2588.99 / 10100, // 乾則
        SiderealNumer: 3689088.99, // 乾元數
        Lunar: 29 + 5359 / 10100, // 會日.宋志寫成了5357！！！太坑了！
        LunarNumer: 298259, // 合率
        Denom: 10100, // 宗法
        Anoma: 27 + 5601.0165 / 10100, // 歷週
        AnomaNumer: 278301.0165, // 歷終分
        Node: 27 + 2143.2279 / 10100,
        SunLimitYang: 3174, // 陽限
        SunLimitYin: 7286, // 陰限
        SunLimitNone: 10460,
        MoonLimit1: 2582, // 月食旣限。月食分法912.5
        MoonLimitNone: 11707,
        MoonLimitDenom: 912.5,
        OriginAd: 1001 - 716497,
        CloseOriginAd: 1001, // 咸平四年辛丑
        // JdOrigin: 2086658.0337 - 716497 * (365 + 2470 / 10100), // 
        OriginYearSc: 1, // 上元土星甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 2], // 命起虛宿二度
        MansionFractPosition: 11,
        AcrTermList: [0, 14.457619, 29.057721, 43.800305, 58.685373, 73.712922, 88.882772, 104.185793, 119.616907, 135.176112, 150.863409, 166.678797, 182.622277, 198.565757, 214.381146, 230.068443, 245.627648, 261.058761, 276.361783, 291.531632, 306.559182, 321.444249, 336.186834, 350.786935, 365.244554],
        MoonAcrVList: [1215, 1230, 1249, 1271, 1293, 1315, 1338, 1362, 1385, 1407, 1429, 1451, 1470, 1485, 1485, 1470, 1451, 1429, 1407, 1385, 1362, 1338, 1315, 1293, 1271, 1249, 1230, 1215], // 28個。歷定分。度母10100
        MoonTcorrList: [0, -1086, -2002, -2748, -3324, -3730, -3966, -4031, -3946, -3710, -3304, -2728, -1982, -1066, 0, 1086, 2002, 2748, 3324, 3730, 3966, 4031, 3946, 3710, 3304, 2728, 1982, 1066], // 28個。昇平積 // 宣明、應天分成兩截，儀天分成四節
        MoonTcorrDifList: [1086, 916, 746, 576, 406, 236, 65, -85, -236, -406, -576, -746, -916, -1066, -1086, -916, -746, -576, -406, -236, -65, 85, 236, 406, 576, 746, 916, 1066], // 28 個
        // 「以盈縮定分、四限直求二十四氣陰陽差，乃更不制二十四氣差法。」用公式
    },
    Qianxing: { // 乾興初，議改曆，命司天役人張奎運算，其術8000為日法，1958為半分，4299為朔，距乾興元年壬戌，歲39006658為積年。
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 1958 / 8008,
        Sidereal: 365 + 2052.65 / 8008,
        Lunar: 29 + 4249 / 8008,
        Denom: 8008,
        Anoma: 27 + 4441.2411 / 8008,
        Node: 27 + 1699.4999 / 8008,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        OriginMonNum: 0,
        ZhengNum: 2,
        OriginAd: 1021 - 30906657,
        CloseOriginAd: 1021,
        AcrTermList: [0, 14.483821, 29.100242, 43.849163, 58.728084, 73.739605, 88.882426, 104.176647, 119.602168, 135.16029, 150.848411, 166.669032, 182.622253, 198.575474, 214.396095, 230.084216, 245.642337, 261.067858, 276.362079, 291.5049, 306.516421, 321.395342, 336.144263, 350.760684, 365.244505, 379.728326],
        SunAcrAvgDifList: [7347, 6021, 4696, 3396, 2070, 757, -757, -2070, -3396, -4696, -6021, -7347, -7347, -6021, -4696, -3396, -2070, -757, 757, 2070, 3396, 4696, 6021, 7347, 7347],
        SunTcorrList: [0, 440, 801, 1082, 1286, 1410, 1455, 1410, 1286, 1082, 801, 440, 0, -440, -801, -1082, -1286, -1410, -1455, -1410, -1286, -1082, -801, -440, 0, 440],
        MoonAcrVList: [1205, 1217, 1236, 1258, 1280, 1303, 1327, 1352, 1376, 1399, 1422, 1442, 1460, 1468, 1466, 1452, 1433, 1412, 1389, 1365, 1341, 1317, 1293, 1269, 1246, 1228, 1211, 1207, 1205],
        MoonTcorrList: [0, -789, -1504, -2111, -2587, -2927, -3126, -3181, -3093, -2861, -2488, -1980, -1348, -613, 176, 950, 1641, 2219, 2666, 2975, 3141, 3165, 3045, 2781, 2380, 1843, 1187, 437],
        MoonTcorrDifList: [789, 715, 606, 476, 340, 199, 63, -8, -88, -232, -373, -508, -632, -734, -789, -774, -691, -578, -447, -309, -166, -48, 23, 120, 264, 402, 537, 656, 750, 437,]
    },
    Chongtian: { // 宋志四五六
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1024, 1064], [1068, 1074]],
        Solar: 365 + 2590 / 10590, // 歲餘55540
        SolarNumer: 3867940, // 歲週
        Sidereal: 365 + 2715.02 / 10590, // 約分25.64
        SiderealNumer: 3868065.02, // 週天分。歲差125.02
        Lunar: 29 + 5619 / 10590, // 
        LunarNumer: 312729, // 朔實
        Denom: 10590, // 樞法
        Anoma: 27 + 5873.0594 / 10590,
        AnomaNumer: 291803.0594, // 轉週分
        Node: 27 + 2247.4277 / 10590,
        SunLimitYang: 4200, // 陽曆食限
        SunLimitYin: 7000, // 陰曆食限
        SunLimitNone: 11200,
        MoonLimit1: 3200,
        MoonLimitNone: 10200,
        MoonLimitDenom: 700,
        OriginAd: 1024 - 97556340,
        CloseOriginAd: 1024, // 天聖二年甲子
        // JdOrigin: 2095058.6586 - 97556340 * (365 + 2590 / 10590),
        OriginYearSc: 1, // 上元甲子
        WeekCorr: -3, // 4
        MansionDayCorr: 4,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 7], // 命以赤道虛宿七度外起算
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7347, 6021, 4696, 3396, 2070, 757, -757, -2070, -3396, -4696, -6021, -7347, -7347, -6021, -4696, -3396, -2070, -757, 757, 2070, 3396, 4696, 6021, 7347, 7347], // 升降分。乘法32，除法487。原文第一個757寫的是775
        SunTcorrList: [0, 582, 1059, 1431, 1700, 1864, 1924, 1864, 1700, 1431, 1059, 582, 0, -582, -1059, -1431, -1700, -1864, -1924, -1864, -1700, -1431, -1059, -582, 0, 582], // 朏朒積
        AcrTermList: [0, 14.483824, 29.100248, 43.849171, 58.728095, 73.739619, 88.882443, 104.176666, 119.60219, 135.160314, 150.848438, 166.669061, 182.622285, 198.575509, 214.396133, 230.084256, 245.64238, 261.067904, 276.362128, 291.504952, 306.516475, 321.395399, 336.144323, 350.760747, 365.24457],
        MoonAcrVList: [1205, 1217, 1236, 1258, 1280, 1303, 1327, 1352, 1376, 1399, 1422, 1442, 1460, 1468, 1466, 1452, 1433, 1412, 1389, 1365, 1341, 1317, 1293, 1269, 1246, 1228, 1211, 1207, 1205], // 轉定分.1341寫成了1541        
        MoonTcorrList: [0, -1043, -1989, -2791, -3421, -3871, -4134, -4207, -4090, -3783, -3290, -2618, -1782, -811, 233, 1256, 2170, 2934, 3525, 3934, 4154, 4186, 4027, 3678, 3147, 2437, 1570, 578], // 朏朒積
        MoonTcorrDifList: [1043, 946, 802, 630, 450, 263, 83, -10, -117, -307, -493, -672, -836, -971, -1044, -1023, -914, -764, -591, -409, -220, -63, 31, 159, 349, 531, 710, 867, 992, 578],
    },
    TaiyiJingyou: { // 曲安京《曆法》頁394 以崇天爲參照
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        Solar: 360 + 55068 / 10500,
        Lunar: 29 + 5571.24 / 10500,
        Denom: 10500,
        OriginAd: 1034 - 10154950,
        OriginMonNum: 0,
        ZhengNum: 2,
    },
    Mingtian: { // 宋志七。王錦瑞曲安京《明天曆歲差與上元積年》，我4月24日看竟然看懂了，之前都沒看懂
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1065, 1067]],
        Solar: 365 + 9500 / 39000, // 歲餘，古曆斗分。二至限：182+24250/39000，一象度91+12125/39000
        SolarNumer: 14244500, // 歲週
        Sidereal: 365 + 1600447 / 6240000, // 365.2564
        // 明天月速13.36875是精確值
        SiderealNumer: 2279200447, // 週天分。日度母6240000=39000*160
        Lunar: 29 + 20693 / 39000, // 3310880/6240000
        LunarNumer: 1151693, // 朔實
        Denom: 39000,
        // Anoma: 27 + 21628.4881 / 39000, // 入轉差了兩天多，不可容忍，重新擬一個
        Anoma: 27 + 601471251 / 1084473000, // 轉度母81120000（日法2080倍）
        AnomaCorr: 3 * 39000,
        AnomaNumer: 29882242251, // 轉終分。朔差2142887000=26度餘33767000.轉法1084473000：一天的運行距離。會週32025129251=轉終分+朔差=朔望月*轉法.轉終368度餘382251.月平行13度餘29913000（王錦瑞《明天曆天文常數系統中的缺陷解析》，《咸陽師院學報》2020年4期）
        Node: 27.212291607808951, // 27 + 6399366452741 / 30144227173125, // 用sidereal算。交度母6240000（日法的160倍）。週天分2279200447
        // 月行之餘2301000日行之餘1600447 // 朔差：9901159，1度餘3661159=兩次合朔交點退行距離
        SunLimitYang: 488, // 藤豔輝補的陽曆食限
        SunLimitYin: 976, // 藤豔輝補的陰曆食限
        SunLimitNone: 1464, // 日食不偏食限
        MoonLimit1: 446, // 全食限
        MoonLimit2: 892, // 必偏食限
        MoonLimitNone: 1338, // 「月食限」卽不偏食限
        MoonLimitDenom: 89.2,
        AcrTermList: [0, 14.538412, 29.188844, 43.951296, 58.825769, 73.812263, 88.910777, 104.249229, 119.699701, 135.262194, 150.936707, 166.723241, 182.621795, 198.520349, 214.306883, 229.981396, 245.543889, 260.994361, 276.332813, 291.431327, 306.41782, 321.292293, 336.054746, 350.705178, 365.24359],
        OriginAd: 1063 - 711759, // 天正冬至辛酉大餘57，小餘17000，假分数2240000。天正經朔大餘34小餘30010，假分數1357000。
        CloseOriginAd: 1063, // 治平元年甲辰年前冬至
        // JdOrigin: 2109302.6923 - 711759 * (365 + 95 / 390),
        OriginYearSc: 1, // 上元甲子
        WeekCorr: 3,
        MansionDayCorr: -4,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 6], // 命起赤道虛宿六度去之
        MansionFractPosition: 11,
    },
    Fengyuan: { // 《李氏遺書·補修宋奉元術》「以明天術推熙寧七年甲寅歲前天正經朔⋯⋯得庚子日五十六刻二百二分」，0.56202，我算的是0.5652，恐怕是小數點精度造成的。李銳實際上只有朔策根據調日法補出來了，其他還是我自己來補吧。沒看到奉元算法的提示，用觀天的定朔算法。
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1075, 1093]],
        Solar: 365 + 5773 / 23700, // 李銳直接根據明天的比例來算
        SolarNumer: 8656273,
        Sidereal: 365 + 6077.40 / 23700,
        Lunar: 29 + 12575 / 23700,
        Denom: 23700, // 元法
        Anoma: 27 + 13144.4331 / 23700,
        Node: 27 + 5029.5386 / 23700,
        OriginAd: 1074 - 83185070,
        CloseOriginAd: 1074, // 熙寧七年甲寅
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        AcrTermList: [0, 14.467246, 29.075112, 43.823599, 58.712706, 73.742434, 88.912435, 104.214178, 119.642515, 135.197445, 150.878968, 166.687084, 182.621793, 198.556503, 214.364619, 230.046142, 245.601071, 261.029408, 276.331151, 291.501152, 306.53088, 321.419988, 336.168475, 350.776341, 365.243586],
        SunAcrAvgDifList: [7204, 5971, 4707, 3424, 2096, 744, -743, -2096, -3423, -4706, -5970, -7203, -7203, -5970, -4706, -3423, -2096, -743, 744, 2096, 3424, 4707, 5971, 7204, 7204],
        SunTcorrList: [0, 1277, 2336, 3170, 3776, 4149, 4281, 4149, 3776, 3170, 2336, 1277, 0, -1277, -2336, -3170, -3776, -4149, -4281, -4149, -3776, -3170, -2336, -1277, 0, 1277],
        MoonAcrVList: [1206, 1216, 1235, 1255, 1278, 1302, 1327, 1353, 1377, 1401, 1425, 1444, 1460, 1471, 1466, 1453, 1435, 1414, 1392, 1367, 1341, 1316, 1292, 1267, 1245, 1227, 1212, 1207, 1206],
        MoonTcorrList: [0, -2328, -4469, -6288, -7755, -8809, -9422, -9592, -9310, -8603, -7466, -5916, -4016, -1847, 527, 2815, 4874, 6615, 7977, 8939, 9460, 9532, 9159, 8352, 7111, 5483, 3526, 1311],
        MoonTcorrDifList: [2328, 2140, 1819, 1467, 1053, 613, 190, -20, -283, -707, -1137, -1550, -1900, -2169, -2374, -2288, -2059, -1741, -1362, -962, -521, -151, 79, 373, 807, 1241, 1628, 1957, 2215, 1311],
    },
    Guantian: { // 宋志十
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1094, 1102]],
        Solar: 365 + 293 / 1203, // 歲餘63080
        SolarNumer: 4393880, // 歲週
        Sidereal: 365 + 3084.57 / 12030, // 歲差154.57
        SiderealNumer: 4394334.57, // 週天分
        Lunar: 29 + 6383 / 12030, // 
        LunarNumer: 355253, // 朔實
        Denom: 12030, // 統法
        Anoma: 27 + 6672.0389 / 12030, // 朔差日1+11740.9611/12030
        AnomaNumer: 331482.0389, // 轉週分
        Node: 27 + 2553.0026 / 12030,
        // Node: 27 + 2551.9944 / 12030, // 交終分327361.9944 朔差日2+3831.0056/12030。從各方面來看，這個數字都沒錯，爲何入交日差了那麼多？？     
        SunLimitYang: 4900,  // 定法490
        SunLimitYin: 7900, // 定法790
        SunLimitNone: 12800, // 不偏食限
        MoonLimit1: 3700,
        MoonLimitNone: 11700,
        MoonLimitDenom: 800,
        OriginAd: 1092 - 5944808,
        CloseOriginAd: 1092, // 元祐七年壬申
        WeekCorr: -1, // 6
        MansionDayCorr: -8,
        // JdOrigin: 2119894.6929 - 5944808 * (365 + 293 / 1203),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4], //命起赤道虛宿四度外去之
        MansionFractPosition: 11,
        AcrTermList: [0, 14.467244, 29.075109, 43.823595, 58.712701, 73.742428, 88.912428, 104.21417, 119.642506, 135.197434, 150.878956, 166.687071, 182.621779, 198.556487, 214.364602, 230.046124, 245.601052, 261.029388, 276.33113, 291.501129, 306.530856, 321.419963, 336.168448, 350.776313, 365.243558],
        MoonAcrVList: [1206, 1215, 1233, 1251, 1275, 1301, 1327, 1354, 1378, 1403, 1427, 1446, 1459, 1473, 1466, 1454, 1437, 1416, 1394, 1368, 1341, 1315, 1290, 1264, 1243, 1225, 1213, 1206, 1206], // 轉定分
        // 冬至後盈初夏至後縮末限：88+10958/12030，夏至後縮初冬至後盈末限：93+8552/12030
        MoonTcorrList: [0, -1179, -2277, -3213, -3987, -4545, -4869, -4959, -4805, -4436, -3842, -3032, -2053, -954, 270, 1431, 2483, 3383, 4094, 4606, 4885, 4922, 4724, 4301, 3644, 2798, 1796, 674], // 朏朒積
        MoonTcorrDifList: [1179, 1098, 936, 774, 558, 324, 99, -9, -154, -369, -594, -810, -979, -1099, -1224, -1161, -1052, -900, -711, -512, -279, -82, 45, 198, 423, 657, 846, 1002, 1122, 674],
    },
    Zhantian: { // 《李氏遺書》
        Type: 8,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1103, 1105]],
        Solar: 365 + 684 / 2808,
        SolarNumer: 10256040, // 李銳根據觀天
        Sidereal: 365 + 7225.68 / 28080, //365 + 7201.21 / 28080,
        Lunar: 29 + 14899 / 28080,
        Denom: 28080,
        Anoma: 27 + 15573.1413 / 28080,
        Node: 27 + 5959.1249 / 28080,
        OriginAd: 1103 - 269190, // 1103 - 25501759,
        CloseOriginAd: 1103, // 崇寧二年癸未
        WeekCorr: 2,
        MansionDayCorr: 16,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        AcrTermList: [0, 14.467246, 29.075112, 43.823599, 58.712707, 73.742435, 88.912436, 104.214179, 119.642516, 135.197446, 150.878969, 166.687085, 182.621795, 198.556504, 214.364621, 230.046144, 245.601074, 261.02941, 276.331154, 291.501155, 306.530883, 321.419991, 336.168478, 350.776344, 365.24359],
        SunAcrAvgDifList: [7204, 5971, 4707, 3424, 2096, 744, -743, -2096, -3423, -4706, -5970, -7203, -7203, -5970, -4706, -3423, -2096, -743, 744, 2096, 3424, 4707, 5971, 7204, 7204],
        SunTcorrList: [0, 1513, 2768, 3756, 4474, 4915, 5072, 4915, 4474, 3756, 2768, 1513, 0, -1513, -2768, -3756, -4474, -4915, -5072, -4915, -4474, -3756, -2768, -1513, 0, 1513],
        MoonAcrVList: [1206, 1216, 1235, 1255, 1278, 1302, 1327, 1353, 1377, 1401, 1425, 1444, 1460, 1471, 1466, 1453, 1435, 1414, 1392, 1367, 1341, 1316, 1292, 1267, 1245, 1227, 1212, 1207, 1206],
        MoonTcorrList: [0, -2759, -5294, -7450, -9189, -10436, -11163, -11365, -11030, -10193, -8846, -7009, -4759, -2189, 624, 3335, 5775, 7838, 9451, 10591, 11208, 11294, 10852, 9896, 8425, 6496, 4178, 1553],
        MoonTcorrDifList: [2759, 2536, 2156, 1739, 1248, 727, 226, -24, -335, -838, -1347, -1836, -2251, -2570, -2813, -2711, -2440, -2063, -1613, -1140, -617, -179, 94, 442, 956, 1471, 1929, 2319, 2625, 1553],
    },
    Jiyuan: { // 宋志十二
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1106, 1166]],
        Solar: 365 + 1776 / 7290, // 2662626/7290=365.2436213992 歲週。紀法60，刻法729，辰法1215，月閏6607.5
        SolarNumer: 2662626, // 期實
        Sidereal: 365 + 1875.2125 / 7290, // 書上寫的週天度365.2572，這是去掉了小數點之後的，理論上是左邊的。歲差7937.週天分213018017.(213018017-7937)/80=(365*7290+1776)
        Lunar: 29 + 3868 / 7290, // 朔策
        LunarNumer: 215278, // 朔實
        Denom: 7290, // 日法
        Anoma: 27 + 4043.0990 / 7290, // 轉週日。月平行13.3687太
        AnomaNumer: 200873.0990, // 轉週分
        Node: 27 + 1547.0880 / 7290, // 27.21222
        SunLimitYang: 3400,
        SunLimitYin: 4300, // 定法430
        SunLimitNone: 7700,
        MoonLimit1: 2400, // 月全食限
        MoonLimitNone: 6800, // 月食限，不偏食限12.47度，這是古代最佳
        MoonLimitDenom: 440,
        OriginAd: 1100 - 28613460,
        CloseOriginAd: 1100, // 元符三年庚辰。自大觀元年頒用
        // JdOrigin: 2122816.6605 - 28613460 * (365 + 1776 / 7290),
        ScCorr: 15, // 己卯算外
        OriginYearSc: 17, // 上元上章執徐庚辰
        MansionDayCorr: -21,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 7], //  命起赤道虛宿七度外去之
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7060, 5920, 4717, 3451, 2122, 730, -730, -2122, -3451, -4717, -5920, -7060, -7060, -5920, -4717, -3451, -2122, -730, 730, 2122, 3451, 4717, 5920, 7060, 7060], // 盈縮分。乘法119，除法1811，日躔秒法100
        SunTcorrList: [0, 385, 708, 965, 1153, 1269, 1309, 1269, 1153, 965, 708, 385, 0, -385, -708, -965, -1153, -1269, -1309, -1269, -1153, -965, -708, -385, 0, 385],
        AcrTermList: [0, 14.512484, 29.138968, 43.885753, 58.759137, 73.765421, 88.910905, 104.20239, 119.633074, 135.196658, 150.886842, 166.697326, 182.621811, 198.546295, 214.356779, 230.046963, 245.610548, 261.041232, 276.332716, 291.4782, 306.484484, 321.357869, 336.104653, 350.731137, 365.243621],
        MoonAcrVList: [1468, 1457, 1442, 1422, 1399, 1373, 1347, 1321, 1295, 1271, 1247, 1228, 1214, 1204, 1208, 1219, 1236, 1258, 1281, 1307, 1333, 1359, 1384, 1408, 1431, 1449, 1463, 1472, 1468], // 轉定分        
        MoonTcorrList: [0, 714, 1368, 1941, 2405, 2743, 2939, 2994, 2906, 2677, 2317, 1827, 1232, 562, -164, -867, -1510, -2061, -2490, -2797, -2961, -2983, -2863, -2607, -2219, -1707, -1096, -409], // 朏朒積
        // MoonTcorrDifList: [
        //     -714, -654, -573, -464, -338, -196, -55, // 0-6
        //     88, 229, 360, 490, 595, 670, 726, // 7-13
        //     703, 643, 551, 429, 307, 164, 22, // 14-20
        //     -120, -256, -388, -512, -611, -687], // 21-26 // 損益率，本來是益損益損
        MoonTcorrDifList: [
            -714, -654, -573, -464, -338, -196, -60, 5, // 0-7
            88, 229, 360, 490, 595, 670, 726, // 8-14
            703, 643, 551, 429, 307, 164, 38, -16, // 15-22
            -120, -256, -388, -512, -611, -687, -409] // 23-29 損益率，特殊處理各節點
    },
    Tongyuan: { // 宋志十六
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1136, 1167]],
        Solar: 365 + 1688 / 6930, // 
        SolarNumer: 2531138, // 歲週
        Sidereal: 365 + 1776.87 / 6930, // 約分365.2564，三曆同
        SiderealNumer: 2531226.87, // 週天分。歲差88.87
        Lunar: 29 + 3677 / 6930,
        LunarNumer: 204647, // 朔實
        Denom: 6930, // 元法
        Anoma: 27 + 3843.2563 / 6930, // 轉週日
        AnomaNumer: 190953.2563, // 轉週分
        Node: 27 + 1470.6457 / 6930,
        SunLimitYang: 2745, // 這三曆定法都是1/10
        SunLimitYin: 4585,
        MoonLimit1: 2300, // 統元月食限我自己補的
        MoonLimitNone: 6500,
        OriginAd: 1135 - 94251591,
        CloseOriginAd: 1135, // 紹興五年乙卯
        // JdOrigin: 2135600.1909 - 94251591 * (365 + 1688 / 6930),
        OriginYearSc: 1, // 上元甲子
        WeekCorr: 3,
        MansionDayCorr: -4,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4], // 法同前曆，此不載
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7156, 5980, 4771, 3493, 2158, 730, -730, -2158, -3493, -4771, -5980, -7156, -7156, -5980, -4771, -3493, -2158, -730, 730, 2158, 3493, 4771, 5980, 7156, 7156], // 乘法55除法837
        SunTcorrList: [0, 371, 681, 928, 1109, 1221, 1259, 1221, 1109, 928, 681, 371, 0, -371, -681, -928, -1109, -1221, -1259, -1221, -1109, -928, -681, -371, 0, 371], // 朏朒積
        AcrTermList: [0, 14.502882, 29.123365, 43.864747, 58.73393, 73.736612, 88.882095, 104.173577, 119.60786, 135.175642, 150.871224, 166.687707, 182.621789, 198.555872, 214.372354, 230.067937, 245.635719, 261.070002, 276.361484, 291.506966, 306.509649, 321.378831, 336.120214, 350.740696, 365.243579],
        MoonAcrVList: [1468, 1456, 1438, 1417, 1394, 1370, 1346, 1322, 1298, 1275, 1252, 1232, 1215, 1206, 1208, 1222, 1241, 1262, 1285, 1309, 1333, 1357, 1381, 1404, 1426, 1447, 1461, 1472, 1468],
        MoonTcorrList: [0, 680, 1298, 1821, 2232, 2525, 2697, 2744, 2668, 2468, 2147, 1709, 1164, 531, -151, -820, -1418, -1917, -2303, -2570, -2711, -2731, -2627, -2399, -2051, -1588, -1021, -377],
        // MoonTcorrDifList: [-680, -618, -523, -411, -293, -172, -47, 76, 200, 321, 438, 545, 633, 682, 669, 598, 499, 386, 267, 141, 20, -104, -228, -348, -463, -567, -644]
        MoonTcorrDifList: [-680, -618, -523, -411, -293, -172, -54, 7, 76, 200, 321, 438, 545, 633, 682, 669, 598, 499, 386, 267, 141, 40, -20, -104, -228, -348, -463, -567, -644, -377]
    },
    Qiandao: { // 宋志
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1168, 1176]],
        Solar: 365.2436, // 歲週7308 / 30000
        SolarNumer: 10957308, // 期實
        Sidereal: 365 + 7717.05 / 30000,
        SiderealNumer: 10957717.05, // 歲差409.05
        Lunar: 29 + 15917.76 / 30000,
        LunarNumer: 885917.76, // 朔實
        Denom: 30000, // 元法
        Anoma: 27 + 16637.7395 / 30000,
        AnomaNumer: 826637.7395, // 轉週分
        Node: 27 + 6366.6034 / 30000,
        SunLimitYang: 14400,
        SunLimitYin: 18000,
        MoonLimit1: 11100, // 月食旣限
        MoonLimitNone: 29100, // 「乾道又有月食限」
        MoonLimitDenom: 1800,
        OriginAd: 1167 - 91645823,
        CloseOriginAd: 1167, // 乾道三年丁亥
        // JdOrigin: 2147287.9828 - 91645823 * (365 + 7308 / 30000),
        OriginYearSc: 1, // 上元甲子
        WeekCorr: -1, // 6
        MansionDayCorr: -8,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7267, 5981, 4680, 3363, 2029, 680, -680, -2029, -3363, -4680, -5981, -7267, -7267, -5981, -4680, -3363, -2029, -680, 680, 2029, 3363, 4680, 5981, 7267, 7267], // 乘法87除法1324
        SunTcorrList: [0, 1630, 2973, 4023, 4778, 5233, 5385, 5233, 4778, 4023, 2973, 1630, 0, -1630, -2973, -4023, -4778, -5233, -5385, -5233, -4778, -4023, -2973, -1630, 0, 1630],
        AcrTermList: [0, 14.491783, 29.112167, 43.86265, 58.744833, 73.760417, 88.9109, 104.197383, 119.618767, 135.17355, 150.860033, 166.676617, 182.6218, 198.566983, 214.383567, 230.07005, 245.624833, 261.046217, 276.3327, 291.483183, 306.498767, 321.38095, 336.131433, 350.751817, 365.2436],
        MoonAcrVList: [1464, 1453, 1438, 1416, 1394, 1373, 1347, 1323, 1299, 1275, 1254, 1240, 1215, 1198, 1213, 1222, 1236, 1257, 1278, 1303, 1331, 1361, 1387, 1412, 1427, 1446, 1462, 1470, 1464],
        MoonTcorrList: [0, 2850, 5453, 7719, 9492, 10771, 11579, 11803, 11489, 10636, 9245, 7382, 5206, 2468, -650, -3433, -6014, -8280, -10076, -11399, -12162, -12297, -11758, -10636, -8953, -6934, -4488, -1683],
        // MoonTcorrDifList: [-2850, -2603, -2266, -1773, -1279, -808, -224, 314, 853, 1391, 1863, 2176, 2738, 3118, 2783, 2581, 2266, 1796, 1323, 763, 135, -539, -1122, -1683, -2019, -2446, -2805],
        MoonTcorrDifList: [-2850, -2603, -2266, -1773, -1279, -808, -247, 23, 314, 853, 1391, 1863, 2176, 2738, 3118, 2783, 2581, 2266, 1796, 1323, 763, 157, -22, -539, -1122, -1683, -2019, -2446, -2805, -1683],
    },
    Chunxi: { // 宋志
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1177, 1190]],
        Solar: 365 + 1374 / 5640, // 歲餘
        SolarNumer: 2059974, // 歲週
        Sidereal: 365 + (1374 + 11513 / 150) / 5640, // 約分365.2564
        SiderealNumer: 309007613, // 乾實。歲差11513：150倍。
        Lunar: 29 + 2992.56 / 5640, // 
        LunarNumer: 166552.56, // 朔實
        Denom: 5640, // 元法
        Anoma: 27 + 3127.9740 / 5640, // 
        AnomaNumer: 155407.9740, // 轉週分
        Node: 27 + 1196.9543 / 5640,
        SunLimitYang: 2630,
        SunLimitYin: 3240,
        MoonLimit1: 1900,
        MoonLimitNone: 5460,
        MoonLimitDenom: 356,
        OriginAd: 1176 - 52421972,
        CloseOriginAd: 1176, // 淳熙三年丙申
        // JdOrigin: 2150575.1681 - 52421972 * (365 + 1374 / 5640),
        OriginYearSc: 1, // 上元甲子
        WeekCorr: 2,
        MansionDayCorr: -12,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 8],
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7060, 5920, 4717, 3451, 2122, 730, -730, -2123, -3451, -4717, -5920, -7060, -7060, -5920, -4717, -3451, -2122, -730, 730, 2122, 3451, 4717, 5920, 7060, 7060], // 乘法119除法1812。第一個 4717原文是4719
        SunTcorrList: [0, 298, 548, 747, 892, 982, 1013, 982, 892, 747, 548, 298, 0, -298, -548, -747, -892, -982, -1013, -982, -892, -747, -548, -298, 0, 298],
        AcrTermList: [0, 14.512484, 29.138968, 43.885752, 58.759136, 73.76542, 88.910904, 104.202388, 119.633172, 135.196756, 150.88694, 166.697424, 182.621909, 198.546393, 214.356877, 230.047061, 245.610645, 261.041329, 276.332813, 291.478297, 306.484581, 321.357965, 336.104749, 350.731233, 365.243617],
        MoonAcrVList: [1468, 1457, 1442, 1422, 1399, 1373, 1347, 1321, 1295, 1271, 1247, 1228, 1214, 1204, 1208, 1219, 1236, 1258, 1281, 1307, 1333, 1359, 1384, 1408, 1431, 1449, 1463, 1472],
        MoonTcorrList: [0, 553, 1059, 1502, 1860, 2122, 2274, 2316, 2249, 2071, 1793, 1413, 953, 435, -127, -671, -1169, -1595, -1928, -2164, -2291, -2308, -2215, -2017, -1717, -1320, -848, -316],
        // MoonTcorrDifList: [-553, -506, -443, -358, -262, -152, -42, 67, 178, 278, 380, 460, 518, 562, 544, 498, 426, 333, 236, 127, 17, -93, -198, -300, -397, -472, -532],
        MoonTcorrDifList: [-553, -506, -443, -358, -262, -152, -46, 4, 67, 178, 278, 380, 460, 518, 562, 544, 498, 426, 333, 236, 127, 29, -12, -93, -198, -300, -397, -472, -532, -316],
    },
    Huiyuan: { // 宋志
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1191, 1198]],
        Solar: 365 + 9432 / 38700,
        SolarNumer: 14134932, // 氣率
        Sidereal: 365 + 9957.13 / 38700, // 
        Lunar: 29 + 20534 / 38700, // 約分53.05
        LunarNumer: 1142834, // 朔率
        Denom: 38700, // 統率
        Anoma: 27 + 21461.7310 / 38700,
        AnomaNumer: 1066361.7310, // 轉率
        Node: 27 + 8213.2140 / 38700,
        SunLimitYang: 18000,
        SunLimitYin: 22500,
        MoonLimit1: 12700, // 月食旣限闕
        MoonLimitNone: 36000,
        OriginAd: 1191 - 25494767,
        CloseOriginAd: 1191, // 紹熙二年辛亥
        // JdOrigin: 2156053.8293 - 25494767 * (365 + 9432 / 38700),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        WeekCorr: 2,
        MansionDayCorr: -12,
        ZhengNum: 2,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7108, 5773, 4456, 3159, 1881, 623, -623, -1881, -3159, -4456, -5773, -7108, -7108, -5773, -4556, -3159, -1881, -623, 623, 1881, 3159, 4456, 5773, 7108, 7108], // 乘法119除法1811.爲何會元淳熙除法不同？
        SunTcorrList: [0, 2057, 3729, 5019, 5933, 6477, 6658, 6477, 5933, 5019, 3729, 2057, 0, -2057, -3729, -5019, -5933, -6477, -6658, -6477, -5933, -5019, -3729, -2057, 0, 2057],
        AcrTermList: [0, 14.507688, 29.148877, 43.921765, 58.824353, 73.854742, 89.01093, 104.291719, 119.698307, 135.232695, 150.896784, 166.692572, 182.62186, 198.551149, 214.346937, 230.021026, 245.555414, 260.962002, 276.242791, 291.398979, 306.429367, 321.331956, 336.104844, 350.746033, 365.243721],
        MoonAcrVList: [1467, 1454, 1440, 1422, 1401, 1376, 1349, 1319, 1292, 1268, 1248, 1230, 1217, 1206, 1209, 1222, 1238, 1257, 1278, 1303, 1332, 1362, 1388, 1410, 1430, 1447, 1461, 1469, 1467],
        MoonTcorrList: [0, 3763, 7150, 10131, 12592, 14445, 15574, 15921, 15400, 14097, 12100, 9523, 6426, 2953, -839, -4544, -7873, -10739, -13055, -14763, -15747, -15892, -15168, -13692, -11579, -8887, -5702, -2113],
        // MoonTcorrDifList: [-3763, -3387, -2981, -2461, -1853, -1129, -347, 521, 1303, 1997, 2577, 3097, 3473, 3792, 3705, 3329, 2866, 2316, 1708, 984, 145, -724, -1476, -2113, -2692, -3185, -3589],
        MoonTcorrDifList: [-3763, -3387, -2981, -2461, -1853, -1129, -376, 29, 521, 1303, 1997, 2577, 3097, 3473, 3792, 3705, 3329, 2866, 2316, 1708, 984, 203, -58, -724, -1476, -2113, -2692, -3185, -3589, -2113],
    },
    Tongtian: { // 以下三個宋志十七。統天特色是消長、積年。積年僅僅是甲子日，其他什麼都不是——這就是授時的理論來源
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1199, 1251]],
        Solar: 365.2425, // - 0.0254 / 12000, // 《統天曆的歲實消長與氣朔算法分析》歲餘 2910 / 12000。斗分差127
        SolarNumer: 4382910, // 歲分
        Sidereal: 365.2575, // 365 + 3090 / 12000
        SiderealNumer: 4383090, // 週天分
        Lunar: 29 + 6368 / 12000, // 朔策
        LunarNumer: 354368, // 朔實
        Denom: 12000, // 策法
        Anoma: 27 + 6655 / 12000, // 轉策
        AnomaNumer: 330655, // 轉實
        Node: 27.21225,
        NodeNumer: 326547, // 交實      
        WinsolsCorr: -237811 / 12000, // 氣差
        FirstCorr: -21704 / 12000, // 閏差
        AnomaCorr: -188800, // 轉差
        NodeCorr: 80298 / 12000, // 交差
        YinyangCorr: -1,
        OriginAd: 1194 - 3830,
        CloseOriginAd: 1194, // 紹熙五年甲寅
        SunLimitYang: 5680,
        SunLimitYin: 7100,
        MoonLimit1: 3900,
        MoonLimitNone: 11200,
        MoonLimitDenom: 730,
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        WeekCorr: -2, // 5
        MansionDayCorr: -16,
        ZhengNum: 2,
        MansionRaw: [11, 7], // 上元命日所起虛宿七度
        MansionFractPosition: 11,
        MansionCorr: 338920 / 12000, // 週天差
        SunAcrAvgDifList: [7000, 5840, 4630, 3370, 2060, 700, -700, -2060, -3370, -4630, -5840, -5840, -7000, -5840, -4630, -3370, -2060, -700, 700, 2060, 3370, 4630, 5840, 7000, 7000], // 盈縮分。乘法380，除法5783
        SunTcorrList: [0, 628, 1152, 1568, 1870, 2055, 2118, 2055, 1870, 1568, 1152, 628, 0, -628, -1152, -1568, -1870, -2055, -2118, -2055, -1870, -1568, -1152, -628, 0, 628],
        AcrTermList: [0, 14.518458, 29.152917, 43.908375, 58.789833, 73.802292, 88.95075, 104.239208, 119.663667, 135.219125, 150.900583, 166.703042, 182.5055, 198.423958, 214.226417, 229.907875, 245.463333, 260.887792, 276.17625, 291.324708, 306.337167, 321.218625, 335.974083, 350.608542, 365.243],
        MoonAcrVList: [1470, 1458, 1442, 1423, 1401, 1376, 1348, 1319, 1292, 1268, 1247, 1229, 1214, 1202, 1207, 1219, 1235, 1255, 1278, 1304, 1332, 1361, 1388, 1412, 1433, 1450, 1463, 1471, 1470], // 轉定分        
        MoonTcorrList: [0, 1194, 2280, 3222, 3994, 4568, 4918, 5017, 4855, 4451, 3832, 3024, 2055, 951, -260, -1427, -2486, -3401, -4137, -4667, -4963, -5008, -4793, -4335, -3662, -2800, -1786, -655],
        // MoonTcorrDifList: [-1194, -1086, -942, -772, -574, -350, -99, 162, 404, 619, 808, 969, 1104, 1211, 1167, 1059, 915, 736, 530, 296, 45, -215, -458, -673, -862, -1014, -1131],
        MoonTcorrDifList: [-1194, -1086, -942, -772, -574, -350, -108, 9, 162, 404, 619, 808, 969, 1104, 1211, 1167, 1059, 915, 736, 530, 296, 63, -18, -215, -458, -673, -862, -1014, -1131, -655],
    },
    Kaixi: {
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1208, 1251]],
        Solar: 365 + 4108 / 16900, // 歲餘
        SolarNumer: 6172608, // 歲率
        Sidereal: 365 + 4359.01 / 16900,
        SiderealNumer: 6172859.01, // 歲差251.01
        Lunar: 29 + 8967 / 16900,
        LunarNumer: 499067, // 朔實
        Denom: 16900, // 日法
        Anoma: 27 + 9372.5396 / 16900,
        AnomaNumer: 465672.5396, // 轉率
        Node: 27 + 3586.4825 / 16900,
        NodeNumer: 459886.4825,
        SunLimitYang: 7890,
        SunLimitYin: 9740,
        MoonLimit1: 5530, // 闕旣限
        MoonLimitNone: 15780,
        MoonLimitDenom: 1052,
        OriginAd: 1207 - 7848183,
        CloseOriginAd: 1207, // 開禧三年丁卯
        // JdOrigin: 2161897.6754 - 7848183 * (365 + 4108 / 16900),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        WeekCorr: -2, //5
        MansionDayCorr: -16,
        ZhengNum: 2,
        MansionRaw: [11, 7],
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7445, 5951, 4524, 3164, 1871, 645, -645, -1871, -3164, -4524, -5951, -5951, -7445, -5951, -4524, -3164, -1871, -645, 645, 1871, 3164, 4524, 5951, 7445, 7445], // 升降分。乘法206除法3135
        SunTcorrList: [0, 941, 1693, 2265, 2665, 2901, 2983, 2901, 2665, 2265, 1693, 941, 0, -941, -1693, -2265, -2665, -2901, -2983, -2901, -2665, -2265, -1693, -941, 0, 941],
        AcrTermList: [0, 14.473962, 29.097323, 43.863385, 58.765446, 73.796808, 88.950769, 104.233731, 119.639292, 135.174154, 150.845015, 166.658577, 182.472138, 198.4351, 214.248662, 229.919523, 245.454385, 260.859946, 276.142908, 291.296869, 306.328231, 321.230292, 335.996354, 350.619715, 365.243077],
        MoonAcrVList: [1466, 1456, 1440, 1421, 1399, 1375, 1349, 1321, 1295, 1271, 1249, 1230, 1214, 1202, 1209, 1221, 1237, 1257, 1280, 1306, 1333, 1361, 1387, 1411, 1431, 1447, 1459, 1467, 1466],
        MoonTcorrList: [0, 1631, 3135, 4437, 5499, 6283, 6763, 6914, 6712, 6181, 5347, 4235, 2882, 1327, -379, -1997, -3463, -4727, -5738, -6459, -6851, -6902, -6599, -5967, -5031, -3843, -2452, -910],
        // MoonTcorrDifList: [-1631, -1504, -1302, -1062, -784, -480, -151, 202, 531, 834, 1112, 1353, 1555, 1706, 1618, 1466, 1264, 1011, 721, 392, 51, -303, -632, -936, -1188, -1391, -1542],
        MoonTcorrDifList: [-1631, -1504, -1302, -1062, -784, -480, -164, 13, 202, 531, 834, 1112, 1353, 1555, 1706, 1618, 1466, 1264, 1011, 721, 392, 76, -25, -303, -632, -936, -1188, -1391, -1542, -910],
    },
    Chunyou: { // 《李氏遺書》、曲安京《曆法》
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1252, 1252]],
        Solar: 365 + 857 / 3530,
        Sidereal: 365 + 909.04 / 3530,
        Lunar: 29 + 1873 / 3530,
        Denom: 3530,
        Anoma: 27 + 1957.7538 / 3530,
        Node: 27 + 749.1341 / 3530,
        SunLimitYang: 1670, // 這四個食限都是補的
        SunLimitYin: 2090,
        MoonLimit1: 1150,
        MoonLimitNone: 3300,
        OriginAd: 1250 - 120267646,
        CloseOriginAd: 1250, // 淳祐十年庚戌造，行二年，那就是1251開始
        WeekCorr: 0,
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 8],
        MansionFractPosition: 11,
        AcrTermList: [0, 14.496949, 29.126898, 43.888547, 58.780596, 73.801745, 88.950694, 104.238643, 119.654392, 135.199241, 150.87449, 166.681439, 182.621388, 198.561337, 214.368286, 230.043535, 245.588384, 261.004133, 276.292082, 291.441031, 306.46218, 321.354229, 336.115878, 350.745827, 365.242776, 379.739725],
        SunAcrAvgDifList: [7220, 5892, 4574, 3266, 1968, 680, -680, -1968, -3266, -4574, -5892, -6335, -7220, -5892, -4574, -3266, -1968, -680, 680, 1968, 3266, 4574, 5892, 7220, 7220],
        SunTcorrList: [0, 191, 346, 467, 553, 605, 623, 605, 553, 467, 346, 191, 0, -191, -346, -467, -553, -605, -623, -605, -553, -467, -346, -191, 0, 191],
        MoonAcrVList: [1467, 1456, 1440, 1421, 1400, 1375, 1349, 1320, 1294, 1270, 1249, 1231, 1215, 1202, 1209, 1221, 1237, 1257, 1280, 1305, 1332, 1361, 1388, 1411, 1431, 1447, 1460, 1468, 1467],
        MoonTcorrList: [0, 343, 657, 929, 1151, 1317, 1418, 1449, 1404, 1289, 1113, 880, 599, 277, -78, -416, -722, -986, -1198, -1349, -1434, -1446, -1383, -1249, -1054, -805, -515, -191],
        MoonTcorrDifList: [-343, -313, -272, -223, -165, -101, -33, 3, 45, 114, 177, 232, 281, 322, 356, 338, 306, 264, 211, 151, 85, 18, -5, -63, -134, -195, -248, -290, -324, -191],
    },
    Huitian: { // 《李氏遺書》。根據寶祐四年會天曆來看，冬至時刻癸丑卯正初刻，成天是卯初四刻。
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1253, 1270]],
        Solar: 365 + 2366 / 9740,
        SolarNumer: 3557464,
        Sidereal: 365 + 2510.15 / 9740,
        Lunar: 29 + 5168 / 9740,
        LunarNumer: 287628,
        Denom: 9740,
        Anoma: 27 + 5401.8662 / 9740,
        Node: 27 + 2067.1124 / 9740,
        SunLimitYang: 4500, // 這四個食限都是補的
        SunLimitYin: 5800,
        MoonLimit1: 3300,
        MoonLimitNone: 9200,
        OriginAd: 1250 - 11356126,
        CloseOriginAd: 1253, // 寶祐元年造
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: -2,
        MansionDayCorr: -16,
        MansionRaw: [11, 7],
        MansionFractPosition: 11,
        AcrTermList: [0, 14.496955, 29.12691, 43.888564, 58.780619, 73.801774, 88.950729, 104.238684, 119.654439, 135.199293, 150.874548, 166.681503, 182.621458, 198.561413, 214.368368, 230.043622, 245.588477, 261.004232, 276.292187, 291.441142, 306.462297, 321.354351, 336.116006, 350.745961, 365.242916, 379.739871],
        SunAcrAvgDifList: [7220, 5892, 4574, 3266, 1968, 680, -680, -1968, -3266, -4574, -5892, -6335, -7220, -5892, -4574, -3266, -1968, -680, 680, 1968, 3266, 4574, 5892, 7220, 7220],
        SunTcorrList: [0, 526, 955, 1289, 1526, 1669, 1719, 1669, 1526, 1289, 955, 526, 0, -526, -955, -1289, -1526, -1669, -1719, -1669, -1526, -1289, -955, -526, 0, 526],
        MoonAcrVList: [1467, 1456, 1440, 1421, 1400, 1375, 1349, 1320, 1294, 1270, 1249, 1231, 1215, 1202, 1209, 1221, 1237, 1257, 1280, 1305, 1332, 1361, 1388, 1411, 1431, 1447, 1460, 1468, 1467],
        MoonTcorrList: [0, 947, 1812, 2562, 3177, 3633, 3912, 3997, 3874, 3558, 3070, 2429, 1654, 765, -216, -1148, -1993, -2722, -3305, -3723, -3956, -3990, -3815, -3446, -2907, -2222, -1421, -527],
        MoonTcorrDifList: [-947, -865, -750, -615, -456, -279, -92, 7, 124, 316, 488, 641, 775, 889, 981, 932, 845, 728, 583, 418, 233, 49, -14, -175, -369, -539, -685, -801, -894, -527],
    },
    Chengtian: {
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1271, 1276], [1277, 1279]],
        Solar: 365 + 1801 / 7420,
        SolarNumer: 2710101, // 歲率
        Sidereal: 365 + 1910.61 / 7420, // 365.2574946
        SiderealNumer: 2710210.61, // 歲差109.01
        Lunar: 29 + 3937 / 7420, // 
        LunarNumer: 219117, // 朔實
        Denom: 7420, // 
        Anoma: 27 + 4115.1641 / 7420, // 27.5546
        AnomaNumer: 204455.1641, // 轉週分
        Node: 27 + 1574.7051 / 7420, // 27.2122244
        NodeNumer: 201914.7051, // 交終分
        SunLimitYang: 3470,
        SunLimitYin: 4280,
        MoonLimit1: 2440, // 原文4630
        MoonLimitNone: 6940,
        MoonLimitDenom: 463,
        OriginAd: 1271 - 71758147,
        CloseOriginAd: 1271, // 咸淳七年辛未
        // JdOrigin: 2185273.1478 - 71758147 * (365 + 1801 / 7420),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        WeekCorr: -2, // 5
        MansionDayCorr: -16,
        ZhengNum: 2,
        MansionRaw: [11, 8],
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7215, 5885, 4568, 3264, 1973, 695, -695, -1973, -3264, -4568, -5885, -7215, -7215, -5885, -4568, -3264, -1973, -695, 695, 1973, 3264, 4568, 5885, 7215, 7215], // 乘法325除法4946
        SunTcorrList: [0, 400, 727, 981, 1162, 1271, 1310, 1271, 1162, 981, 727, 400, 0, -400, -727, -981, -1162, -1271, -1310, -1271, -1162, -981, -727, -400, 0, 400],
        AcrTermList: [0, 14.496947, 29.126894, 43.88854, 58.780587, 73.801734, 88.950681, 104.238627, 119.654374, 135.199221, 150.874468, 166.681414, 182.621361, 198.561308, 214.368255, 230.043501, 245.588348, 261.004095, 276.292042, 291.440989, 306.462135, 321.354182, 336.115829, 350.745776, 365.242722],
        MoonAcrVList: [1465, 1453, 1438, 1420, 1399, 1375, 1349, 1320, 1294, 1271, 1251, 1233, 1217, 1203, 1211, 1223, 1239, 1259, 1281, 1305, 1332, 1361, 1388, 1410, 1429, 1444, 1457, 1467, 1465],
        MoonTcorrList: [0, 710, 1354, 1915, 2376, 2720, 2931, 2998, 2904, 2665, 2299, 1822, 1244, 578, -166, -865, -1498, -2042, -2475, -2786, -2964, -2992, -2859, -2576, -2171, -1660, -1066, -400],
        // MoonTcorrDifList: [-710, -644, -561, -461, -344, -211, -67, 94, 239, 366, 477, 578, 666, 744, 699, 633, 544, 433, 311, 178, 28, -133, -283, -405, -511, -594, -666],
        MoonTcorrDifList: [-710, -644, -561, -461, -344, -211, -72, 5, 94, 239, 366, 477, 578, 666, 744, 699, 633, 544, 433, 311, 178, 39, -11, -133, -283, -405, -511, -594, -666, -400],
    },
    Bentian: {
        Type: 9,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 1714 / 7060,
        Sidereal: 365 + 1817.5807 / 7060,
        Lunar: 29 + 3746 / 7060,
        Denom: 7060,
        Anoma: 27 + 3915.4202 / 7060,
        Node: 27 + 1498.0961 / 7060,
        SunLimitYang: 3250, // 這四個食限都是補的
        SunLimitYin: 4200,
        MoonLimit1: 2400,
        MoonLimitNone: 6660,
        AcrTermList: [0, 14.496949, 29.126898, 43.888547, 58.780596, 73.801745, 88.950694, 104.238643, 119.654392, 135.199241, 150.87449, 166.681439, 182.621388, 198.561337, 214.368286, 230.043535, 245.588384, 261.004133, 276.292082, 291.441031, 306.46218, 321.354229, 336.115878, 350.745827, 365.242776],
        OriginAd: -73145880,
        CloseOriginAd: 1277,
        OriginYearSc: 1,
        OriginMonNum: 0,
        WeekCorr: -2,
        MansionDayCorr: -16,
        ZhengNum: 2,
        MansionRaw: [11, 7],
        MansionFractPosition: 11,
    },

    //////////////////////////////// 下金
    // Daming1: {
    //     ApplyYear: [[995, 1136]],
    // },
    Daming2: { // 楊級。授時曆議有積年1127 - 383768503、日法。《金志上》「然其所本，不能詳究，或曰因宋紀元曆而增損之也。」《元志一》「衡等以爲金雖改曆，止以宋紀元曆微加增益，實未嘗測驗於天」
        Type: 10,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1127, 1180]],
        Solar: 365 + 1274 / 5230,
        Sidereal: 365 + 1342.957 / 5230,
        Lunar: 29 + 2775 / 5230,
        Denom: 5230,
        Anoma: 27 + 2900.5971 / 5230,
        Node: 27 + 1109.9711 / 5230,
        OriginAd: 1180 - 383768556,
        CloseOriginAd: 1127, // 天會五年丁未        
        OriginMonNum: 0,
        ZhengNum: 2,
        WeekCorr: -3,
        MansionDayCorr: 4,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        AcrTermList: [0, 14.512483, 29.138966, 43.885749, 58.759132, 73.765416, 88.910899, 104.202382, 119.633065, 135.196648, 150.886831, 166.697314, 182.621797, 198.54628, 214.356764, 230.046947, 245.61053, 261.041213, 276.332696, 291.478179, 306.484462, 321.357845, 336.104628, 350.731112, 365.243595, 365 + 1274 / 5230 + 14.512483],
    },
    Daming3: { // 金志上。「時翰林應奉耶律履亦造乙未曆。二十一年十一月望，太陰虧食，遂命尙書省委禮部員外郞任忠傑與司天曆官驗所食時刻分秒，比校知微、履及見行曆之親疏，以知微曆爲親，遂用之。」
        Type: 10,
        isAcr: true,
        isNewmPlus: true,
        ApplyYear: [[1181, 1280]],
        Solar: 365 + 1274 / 5230, // 通餘27424
        SolarNumer: 1910224, // 
        Sidereal: 365 + 1343.053 / 5230, // 週天度
        SiderealNumer: 1910293.053, // 週天分.歲差69.053
        Lunar: 29 + 2775 / 5230, // 朔虛分2455
        LunarNumer: 154445, // 朔實
        Denom: 5230, // 日法
        Anoma: 27 + 2900.6066 / 5230, // 
        AnomaNumer: 144110.6066, // 轉終分
        Node: 27 + 1109.9368 / 5230,
        NodeNumer: 142319.9368, // 交終分
        SunLimitYang: 2400, // 定法248。分秒母皆100
        SunLimitYin: 3100, // 定法320
        SunLimitNone: 5500,
        MoonLimit1: 1700, // 定法340
        MoonLimitNone: 5100,
        OriginAd: 1180 - 88639656,
        CloseOriginAd: 1180, // 大定二十年庚子
        // JdOrigin: 2152036.1489 - 88639656 * (365 + 1274 / 5230),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 7], // 命起赤道虛宿七度外去之
        MansionFractPosition: 11,
        SunAcrAvgDifList: [7059, 5920, 4718, 3453, 2126, 739, -739, -2126, -3453, -4718, -5920, -7059, -7059, -5920, -4718, -3453, -2126, -739, 739, 2126, 3453, 4718, 5920, 7059, 7059], // 《日積度及盈縮》損益率。重修大明有三個太陽表
        SunTcorrList: [0, 276, 508, 693, 828, 911, 940, 911, 828, 693, 508, 276, 0, -276, -508, -693, -828, -911, -940, -911, -828, -693, -508, -276, 0, 276],
        AcrTermList: [0, 14.512583, 29.139066, 43.885749, 58.758932, 73.764816, 88.909399, 104.201782, 119.632865, 135.196648, 150.886931, 166.697414, 182.621797, 198.54618, 214.356664, 230.046947, 245.61073, 261.041813, 276.334196, 291.478779, 306.484662, 321.357845, 336.104528, 350.731012, 365.243595, 365 + 1274 / 5230 + 14.512583],
        MoonAcrVList: [1468, 1457, 1442, 1422, 1399, 1373, 1347, 1321, 1295, 1271, 1247, 1228, 1214, 1204, 1208, 1219, 1236, 1258, 1281, 1307, 1333, 1359, 1384, 1408, 1431, 1449, 1463, 1472, 1468], // 轉定分        
        MoonTcorrList: [0, 513, 982, 1393, 1725, 1968, 2109, 2148, 2085, 1921, 1663, 1311, 884, 403, -117, -622, -1084, -1479, -1788, -2007, -2124, -2140, -2054, -1870, -1592, -1224, -786, -293],
        MoonTcorrDifList: [-513, -469, -411, -332, -243, -141, -43, 4, 63, 164, 258, 352, 427, 481, 520, 505, 462, 395, 309, 219, 117, 27, -11, -86, -184, -278, -368, -438, -493, -293],
        NightList: [1567.92, 1557.52, 1528.79, 1485.23, 1430.04, 1366.14, 1296.96, 1232.27, 1173.18, 1122.34, 1082.48, 1056.42, 1047.07, 1056.42, 1082.48, 1122.34, 1173.18, 1232.27, 1296.96, 1366.14, 1430.04, 1485.23, 1528.79, 1557.52, 1567.92, 1557.52, 1528.79], // 大明日出分
        // NightList: [29.979349904397708, 29.780497131931167, 29.231166347992353, 28.39827915869981, 27.34302103250478, 26.12122370936903, 24.798470363288722, 23.561567877629063, 22.431739961759085, 21.459655831739962, 20.69751434034417, 20.19923518164436, 20.020458891013384, 20.19923518164436, 20.69751434034417, 21.459655831739962, 22.431739961759085, 23.561567877629063, 24.798470363288722, 26.12122370936903, 27.34302103250478, 28.39827915869981, 29.231166347992353, 29.780497131931167, 29.979349904397708, 29.780497131931167, 29.231166347992353]
    },
    Gengwu: { // 元志八。沿用重修大明。耶律楚材是耶律履之子，那應該跟乙未很近。「惟萬年曆不復傳，而庚午元曆雖未嘗頒用，其爲書猶在，因附著于後，使來者有考焉。」「乃損節氣之分，減周天之秒，去交終之率，治月轉之餘，課兩曜之後先，調五行之出沒，以正（重修）大明曆之失。」
        Type: 10,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 1274 / 5230, // 通餘27424
        SolarNumer: 1910224, // 
        Sidereal: 365 + 1342.98 / 5230, // 週天度365.2567
        Lunar: 29 + 2775 / 5230, // 朔虛分2455。月平行度13.36875
        LunarNumer: 154445, // 朔實 
        Denom: 5230, // 日法
        Anoma: 27 + 2900.602060 / 5230,
        Node: 27 + 1109.930620 / 5230,
        SunLimitYang: 2400, // 定法248。分秒母皆100
        SunLimitYin: 3100, // 定法320
        SunLimitNone: 5500,
        MoonLimit1: 1700, // 定法340
        MoonLimitNone: 5100,
        OriginAd: 1220 - 20275270,
        CloseOriginAd: 1220, // 太祖庚辰
        // JdOrigin: 2166645.9237 - 20275270 * (365 + 1274 / 5230),
        OriginYearSc: 7, // 上元庚午
        ScCorr: 58, // 只是經朔少了1700。推上元庚午歲天正十一月壬戌朔
        OriginMonNum: 0,
        WeekCorr: 2,
        MansionDayCorr: 2,
        ZhengNum: 2,
        MansionRaw: [11, 6], // 同會虛宿六度
        MansionFractPosition: 11,
        AcrTermList: [0, 14.512583, 29.139066, 43.885749, 58.758932, 73.764816, 88.909399, 104.201782, 119.632865, 135.196648, 150.886931, 166.697414, 182.621797, 198.54618, 214.356664, 230.046947, 245.61073, 261.041813, 276.334196, 291.478779, 306.484662, 321.357845, 336.104528, 350.731012, 365.243595, 365 + 1274 / 5230 + 14.512583],
        MoonAcrVList: [1468, 1457, 1442, 1422, 1399, 1373, 1347, 1321, 1295, 1271, 1247, 1228, 1214, 1204, 1208, 1219, 1236, 1258, 1281, 1307, 1333, 1359, 1384, 1408, 1431, 1449, 1463, 1472, 1468], // 大明轉定分
    },
    Yiwei: { // 乙未元曆《李氏遺書》。《授時曆議》「大定二十年庚子耶律履（耶律楚材之父）造，不見行用，至辛巳後天一十九刻」那麼應該是用授時作爲標準。李銳說是20690，授時曆議2690。若用2690.朔實就不對 積年都不對，前後一萬年看了，閏餘差最小也是0.13。不行，還是求不出來。最後用曲安京復原結果
        Type: 10,
        isAcr: true,
        isNewmPlus: true,
        Solar: 365 + 5040 / 20690,
        Sidereal: 365 + 5311.65 / 20690,
        Lunar: 29 + 10978 / 20690,
        Denom: 20690,
        Anoma: 27 + 11474.9057 / 20690,
        Node: 27 + 4390.8982 / 20690,
        OriginAd: 1180 - 40453025,
        CloseOriginAd: 1180,
        WeekCorr: 0,
        ScCorr: 8, // 壬申日
        OriginMonNum: 0,
        ZhengNum: 2,
        MansionRaw: [11, 4],
        MansionFractPosition: 11,
        AcrTermList: [0, 14.512583, 29.139066, 43.885749, 58.758933, 73.764816, 88.909399, 104.201782, 119.632865, 135.196648, 150.886932, 166.697415, 182.621798, 198.546181, 214.356664, 230.046947, 245.610731, 261.041814, 276.334197, 291.47878, 306.484663, 321.357846, 336.10453, 350.731013, 365.243596, 379.756179],
    },

    ///////////////////////////////
    Shoushi: { // 授時曆經
        Type: 11,
        isAcr: true,
        ApplyYear: [[1281, 1367]],
        CloseOriginAd: 1281,
        Denom: 1,
        SolarRaw: 365.2425, // 曆元歲實
        Sidereal: 365.2575,
        Lunar: 29.530593, // 朔策。秒單位100，分10000
        Node: 27.212224,
        SunLimitYang: 6, // 陽曆限6度，定法60
        SunLimitYin: 8,
        MoonLimitNone: 13.05,
        MoonLimitDenom: 0.87,
        Anoma: 27.5546, // 轉終：近點月
        AnomaCorr: 13.1904, // 轉應：曆元前冬至距月過近地點
        NodeCorr: 26.018786,
        WinsolsCorr: 55.06, // 氣應：曆元前冬至日分
        FirstCorr: 20.1850, // 閏應：曆元前冬至月齡
        PartRange: 0.082, // 限法
        AcrTermList: [0, 14.495311, 29.111126, 43.853999, 58.730488, 73.747147, 88.911421, 104.221466, 119.662429, 135.228598, 150.914265, 166.713719, 182.62125, 198.528781, 214.328235, 230.013902, 245.580071, 261.021034, 276.331079, 291.495353, 306.512012, 321.388501, 336.131374, 350.747189, 365.2425],
        ZhengNum: 2,
        OriginMonNum: 0,
        WeekCorr: 2,
        MansionDayCorr: -12,
        MansionCorr: 315.1075,
        MansionRaw: [11, 6], // 命起赤道虛宿六度外，實際上曆元是箕10
        MansionFractPosition: 11,
    },
    Shoushi2: { // 大統通軌的參數用消長
        Type: 11,
        isAcr: true,
        ApplyYear: [[1368, 1683]],
        CloseOriginAd: 1281,
        Denom: 1,
        Solar: 365.2425, // 曆元歲實
        Sidereal: 365.2575,
        Lunar: 29.530593, // 朔策。秒單位100，分10000
        Node: 27.212224,
        SunLimitYang: 6, // 陽曆限6度，定法60
        SunLimitYin: 8,
        MoonLimitNone: 13.05,
        MoonLimitDenom: 0.87,
        Anoma: 27.5546, // 轉終：近點月
        WinsolsCorr: 55.06, // 氣應：曆元前冬至日分
        FirstCorr: 20.205, // 閏應：曆元前冬至月齡
        AnomaCorr: 13.0205, // 轉應：曆元前冬至距月過近地點
        NodeCorr: 26.0388,
        PartRange: 0.082, // 限法
        AcrTermList: [0, 14.495311, 29.111126, 43.853999, 58.730488, 73.747147, 88.911421, 104.221466, 119.662429, 135.228598, 150.914265, 166.713719, 182.62125, 198.528781, 214.328235, 230.013902, 245.580071, 261.021034, 276.331079, 291.495353, 306.512012, 321.388501, 336.131374, 350.747189, 365.2425],
        ZhengNum: 2,
        OriginMonNum: 0,
        WeekCorr: 2,
        MansionDayCorr: -12,
        MansionCorr: 315.1075,
        MansionRaw: [11, 6],
        MansionFractPosition: 11,
    },
    Datong: { // 後期授時不加消長。A A1，B B1參數分別一模一樣，只是把Solar改成solar
        Type: 11,
        isAcr: true,
        ApplyYear: [[1368, 1683]],
        CloseOriginAd: 1281,
        Denom: 1,
        Solar: 365.2425, // 曆元歲實
        Sidereal: 365.2575,
        Lunar: 29.530593, // 朔策。秒單位100，分10000
        Node: 27.212224,
        SunLimitYang: 6, // 陽曆限6度，定法60
        SunLimitYin: 8,
        MoonLimitNone: 13.05,
        MoonLimitDenom: 0.87,
        Anoma: 27.5546, // 轉終：近點月
        WinsolsCorr: 55.06, // 氣應：曆元前冬至日分
        FirstCorr: 20.205, // 閏應：曆元前冬至月齡
        AnomaCorr: 13.0205, // 轉應：曆元前冬至距月過近地點
        NodeCorr: 26.0388,
        PartRange: 0.082, // 限法
        AcrTermList: [0, 14.495311, 29.111126, 43.853999, 58.730488, 73.747147, 88.911421, 104.221466, 119.662429, 135.228598, 150.914265, 166.713719, 182.62125, 198.528781, 214.328235, 230.013902, 245.580071, 261.021034, 276.331079, 291.495353, 306.512012, 321.388501, 336.131374, 350.747189, 365.2425],
        ZhengNum: 2,
        OriginMonNum: 0,
        WeekCorr: 2,
        MansionDayCorr: -12,
        MansionCorr: 315.1075,
        MansionRaw: [11, 6],
        MansionFractPosition: 11,
    },
    Datong2: { // 大統曆志
        Type: 11,
        isAcr: true,
        CloseOriginAd: 1384,
        Denom: 1,
        // JdOrigin: 2226545.5375,
        Solar: 365.2425, // 曆元歲實
        Sidereal: 365.2575,
        Lunar: 29.530593, // 朔策
        Anoma: 27.5546, // 轉終：近點月
        Node: 27.212224,
        SunLimitYang: 6, // 陽曆限6度，定法60
        SunLimitYin: 8,
        MoonLimitNone: 13.05,
        MoonLimitDenom: 0.87,
        WinsolsCorr: 55.0375, // 氣應
        FirstCorr: 18.20708, // 閏應
        AnomaCorr: 20.969, // 轉應
        NodeCorr: 11.510508, // 曆五·大統曆法三上 
        PartRange: 0.082, // 限法
        AcrTermList: [0, 14.495311, 29.111126, 43.853999, 58.730488, 73.747147, 88.911421, 104.221466, 119.662429, 135.228598, 150.914265, 166.713719, 182.62125, 198.528781, 214.328235, 230.013902, 245.580071, 261.021034, 276.331079, 291.495353, 306.512012, 321.388501, 336.131374, 350.747189, 365.2425],
        ZhengNum: 2,
        WeekCorr: 4,
        MansionDayCorr: -12,
        OriginMonNum: 0,
        MansionCorr: 313.5625, // 已據改：洪武甲子相距一百四年，歲差已退天一度五十四分五十秒，而周應仍用舊數，殆傳習之誤耳。
        MansionRaw: [11, 6],
        MansionFractPosition: 11,
    },
    Wannian: {
        Type: 11,
        isAcr: true,
        CloseOriginAd: 1554, // 嘉靖甲寅歲
        Denom: 1,
        Solar: 365.2424995, // 365.25-(4560-(1553-1280))*0.00000175=365.2424995
        Sidereal: 365.2575,
        Lunar: 29.530593,
        Anoma: 27.5546,
        Node: 27.212224,
        SunLimitYang: 6,
        SunLimitYin: 8,
        MoonLimitNone: 13.05,
        MoonLimitDenom: 0.87,
        NodeCorr: 20.4734,
        WinsolsCorr: -55.6089,
        // WinsolsCorr: 59.061186, // 氣應：曆元前冬至日分
        FirstCorr: -19.3619,
        AnomaCorr: 7.5034,
        PartRange: 0.082, // 限法
        AcrTermList: [0, 14.495311, 29.111126, 43.853999, 58.730488, 73.747147, 88.911421, 104.221466, 119.662429, 135.228598, 150.914265, 166.713719, 182.62125, 198.528781, 214.328235, 230.013902, 245.580071, 261.021034, 276.331079, 291.495353, 306.512012, 321.388501, 336.131374, 350.747189, 365.2425],
        ZhengNum: 2,
        WeekCorr: 2,
        MansionDayCorr: -12,
        OriginMonNum: 0,
        MansionCorr: 313.5625, // 已據改：洪武甲子相距一百四年，歲差已退天一度五十四分五十秒，而周應仍用舊數，殆傳習之誤耳。
        MansionRaw: [11, 6],
        MansionFractPosition: 11,
    },
    Xufa: {
        Type: 11,
        isAcr: true,
        CloseOriginAd: 1675,
        Denom: 1,
        Solar: 365.242409,
        Sidereal: 365.258538,
        Lunar: 29.53058852,
        Anoma: 27.5545892,
        Node: 27.2122088,
        SunLimitYang: 6,
        SunLimitYin: 8,
        MoonLimitNone: 13.05,
        MoonLimitDenom: 0.87,
        WinsolsCorr: 20.599599, // 氣應
        FirstCorr: 23.1559026, // 閏應 20.599599 - 57.4436964 +60 
        AnomaCorr: 5.4550016 + 23.1559026, // 轉應
        NodeCorr: 10.2330428 + 23.1559026,
        PartRange: 0.082, // 限法
        AcrTermList: [0, 14.495311, 29.111126, 43.853999, 58.730488, 73.747147, 88.911421, 104.221466, 119.662429, 135.228598, 150.914265, 166.713719, 182.62125, 198.528781, 214.328235, 230.013902, 245.580071, 261.021034, 276.331079, 291.495353, 306.512012, 321.388501, 336.131374, 350.747189, 365.2425],
        ZhengNum: 2,
        WeekCorr: 1,
        MansionDayCorr: -12,
        OriginMonNum: 0,
        MansionCorr: 308.3, // 我定的，徐發說是箕三度
        MansionRaw: [11, 6],
        MansionFractPosition: 11,
    },
    West: {
        Type: 20,
        isAcr: true,
        OriginAd: 1281,
        // JdOrigin: 2188925.5,
        SolarRaw: 365.24218968, // 365.24218968-0.0000000616*(year-2000) 
        Solar: 365.2425,
        Sidereal: 365.25636042,
        LunarRaw: 29.53058885, // 29.53058885+0.0000000022*(year-2000)
        Anoma: 27.554551,
        WinsolsCorr: 55.08125,
        FirstCorr: 20.2,
        AnomaCorr: 13.17,
        ZhengNum: 2,
        WeekCorr: 2,
        OriginMonNum: 0,
        MansionCorr: 315.1075, // 週應
        MansionRaw: [11, 6], //命起赤道虛宿六度外
        MansionFractPosition: 11,
    },

    ////////////////

    Huihui: { // 明志十三。其法不用閏月，以三百六十五日爲一歲。歲十二宮，宮有閏日，凡百二十八年而宮閏三十一日。以三百五十四日爲一周，周十二月，月有閏日。凡三十年月閏十一日，歷千九百四十一年，宮月日辰再會。此其立法之大槪也。
        Type: 15,
        isAcr: true,
        Solar: 365.2421997, // 360度，60分，60秒 // 《回回曆法中若干天文數據之研究》 
        // Sidereal: , // 週天度
        SiderLunar: 27.32158575,
        Lunar: 29.53059299, // 「加信相離度」月分大小　單月大，雙月小。〔凡十二月，所謂動之月也。月大三十日，月小二十九日，凡三百五十四日，乃十二月之日也。遇月分有閏之年，於第十二月內增一日，凡三百五十五日。〕
        Denom: 5230, // 日法
        Anoma: 27.55458039, // 每日本輪行度
        Node: 27.21221996, // 「羅計中心行度」
        OriginAd: 599,
        // JdOrigin: 1948439.5, // 622年7月16日紀年元年一月一日。暫且取夜半  
        OriginYearSc: 56, // 己未
        Saturn: 378.0930028,
        Jupiter: 398.884523,
        Mars: 779.9356461,
        Venus: 583.9197207,
        Mercury: 115.8771744,
    },
}

    // Huihui: [
    //     [1368, 1662]
    // ],
    // Shixian1: [ // 西洋新法曆書
    //     [1645, 1679]
    // ],
    // Shixian2: [ // 康熙永年曆法
    //     [1680, 1726]
    // ],
    // Shixian3: [ // 曆象考成
    //     [1727, 1733]
    // ],
    // Shixian4: [ // 曆象考成後編
    //     [1734, 1913]
    // ]