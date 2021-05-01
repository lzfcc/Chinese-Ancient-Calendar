const CalNameList = {
    '四分': {
        Yin: '殷',
        XiaDong: '冬至元夏',
        XiaYu: '雨水元夏',
        Lu: '魯',
        LuA: '魯(進餘539)',
        LuB: '魯(進餘469)',
        LuC: '魯(進餘403)',
        LuD: '魯(進餘348)',
        LuE: '魯(進餘280)',
        LuF: '魯(進餘213)',
        LuG: '魯(進餘147)',
        ZhuanxuA: '顓頊(建寅)',
        ZhuanxuB: '顓頊(十月首)',
        ZhuanxuC: '顓頊(進餘3/4)',
        ZhuanxuD: '顓頊(退餘210)',
        ZhuanxuE: '顓頊(變閏章)',
        ZhuanxuF: '顓頊(退餘25)',
        Zhou: '周',
        Huangdi: '黃帝',
        Shiji: '曆術甲子篇(擬)',
        Taichu: '太初(三統)', // 太初中氣在朔若二日，則前月閏(斯琴畢力格等《太初曆特殊置閏問題》，《內師大學報》2007年第6期，頁748—753)但這條規則貫徹得並不徹底
        Qianzaodu: '乾鑿度',
        EastHan: '後漢四分',
    },
    '魏晉': {
        Qianxiang: '乾象', // 劉洪
        // Huangchu: '黃初(擬)', // 魏 韓詡
        Jingchu: '景初', // 楊偉
        Liuzhi: '劉智(擬)', // 劉智正曆
        Wangshuozhi: '王朔之(擬)', // 王朔之通曆
        Sanji: '三紀', // 姜岌。擬
        Xuanshi: '玄始(擬)', // 趙𢾺，梁趙曆
    },
    '南朝': {
        Yuanjia: '元嘉', // 何承天
        Daming: '大明', // 祖沖之
        Liangwu: '明克讓(擬大同代)', // 梁武帝大同曆
    },
    '北朝': {
        Zhengguang: '正光', // 李業興等
        Xinghe: '興和', // 李業興
        Tianbao: '天保', // 宋景業。
        Jiayin: '甲寅(擬)', // 董峻、鄭元偉
        Tianhe: '天和(擬)', // 甄
        Daxiang: '大象(擬)', // 馬顯
        Kaihuang: '開皇(擬)', // 張賔
        Daye: '大業', // 張冑玄
    },
    '隋': {
        Zhangmengbin: '張孟賓(擬)',
        Liuxiaosun: '劉孝孫(擬)',
        Huangji: '皇極', // 劉焯
        Wuyin: '戊寅', // 傅仁均
        Shenlong: '神龍(擬)', // 這是武則天的年號
        Linde: '麟德', // 李淳風。麟德在708-716、開元九-十六年用進朔法(黃一農《中國史曆表朔閏訂正舉隅———以唐〈麟德曆〉行用時期爲例》，頁291—296)
        // Jiuzhi: '九執(擬)', // 顯慶年間印度曆法
    },
    '唐': {
        Dayan: '大衍', // 一行
        Zhide: '至德(擬)', //
        Wuji: '五紀', // 寶應五紀曆。肅宗最後一個年號。郭獻之，綜合大衍、麟德
        Zhengyuan: '正元', // 德宗時期徐承嗣、楊景風綜合麟德、大衍
        Xuanming: '宣明(代賈俊大明)', // 憲宗即位，徐昂上《觀象曆》，沒有記載。穆宗時期，宣明。晷漏、交會稍增損，更立新術以步五星，其餘都沿襲大衍。《中國古代曆法》第570頁宣明定朔進朔：秋分—春分：0.75，夏至0.74005，清明0.74924，小暑0.74031，穀雨0.74479，大暑0.74124，立夏0.74276，立秋0.74276，小滿0.74124，處暑0.74479，芒種0.74031，白露0.74924，請用戶自行進朔
    },
    '北宋': {
        Chongxuan: '崇玄', // 昭宗時期邊岡、胡秀林、王墀。沿襲大衍，能用巧算。
        Futian: '調元(擬符天代)', // 至元年間780-820術士曹士蔿。定氣注曆，但我還是平氣注曆。後晉天福時期，沿襲符天曆。在遼行用於947-994。失傳
        Qintian: '欽天', // 王樸。後周顯德三年至周亡956-960.。宋初960-963延用。日躔月離五星損益不存。五代時期，中原其他地區延用崇玄曆
        Yingtian: '應天', // 王處訥
        Qianyuan: '乾元',
        Yitian: '儀天',
        Chongtian: '崇天', // 遠地點。宋行古。
        Mingtian: '明天', // 周琮。歷史背景見董煜宇《从《奉元历》改革看北宋天文管理的绩效》，《自然科學史研究》2008年2期
        Fengyuan: '奉元(擬)',
        Guantian: '觀天',
        Zhantian: '占天(擬)',
    },
    '南宋': {
        Jiyuan: '紀元', // 上北宋。南宋定朔算法全同紀元，除了統天用歲實消長
        Tongyuan: '統元',
        Qiandao: '乾道',
        Chunxi: '淳熙',
        Huiyuan: '會元',
        Tongtian: '統天',
        Kaixi: '開禧',
        Chunyou: '淳祐(擬)',
        Huitian: '會天(擬)',
        Chengtian: '成天', // 上南宋
        Bentian: '本天(擬)',
    },
    '遼金': {
        // Jiajun: '賈俊大明(擬)',
        Yangji: '楊級大明(擬)',
        NewDaming: '重修大明',
        Yiwei: '乙未(廢)',
        Gengwu: '庚午',
    },
    '授時': {
        Shoushi: '授時',
        Datong: '大統',
        // Huihui: '回回',
        West: '現代近似',
    },
}
const lala = []
for (let [group, value] of (Object.entries(CalNameList))) {
    for (let [Enname, Cnname] of (Object.entries(value))) {
        lala.push({
            value: Enname,
            name: Cnname,
            group
        })
    }    
}
console.log(JSON.stringify(lala))
