import big from 'decimal.js'
import frc from 'fraction.js'
import nzh from 'nzh/hk.js'
big.config({
    precision: 64,
    toExpNeg: -17,
    toExpPos: 17,
    rounding: 4
})
export {
    big,
    frc,
    nzh
}
// nzh = new nzh({
//     ch: "〇一二三四五六七八九",      // 数字字符
//     ch_u: "个十百千萬億兆京",       // 数位单位字符，万以下十进制，万以上万进制，个位不能省略
// });
export const debounce = (fn, delay) => {
    let timer = 100 // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return (...args) => { // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
        clearTimeout(timer) // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），再过 delay 毫秒就执行 fn
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}
export const CalNameList = { // 按照時間順序排列
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
    Easthan: '後漢四分',
    Qianxiang: '乾象', // 劉洪
    // Huangchu: '黃初(擬)', // 魏 韓詡
    Jingchu: '景初', // 楊偉
    Liuzhi: '劉智(擬)', // 劉智正曆
    Wangshuozhi: '王朔之(擬)', // 王朔之通曆
    Sanji: '三紀', // 姜岌。擬
    Xuanshi: '玄始(擬)', // 趙𢾺，梁趙曆
    Yuanjia: '元嘉', // 何承天
    Daming: '大明', // 祖沖之
    Liangwu: '明克讓(擬大同代)', // 梁武帝大同曆
    Zhengguang: '正光', // 李業興等
    Xinghe: '興和', // 李業興
    Tianbao: '天保', // 宋景業。
    Jiayin: '甲寅(擬)', // 董峻、鄭元偉
    Tianhe: '天和(擬)', // 甄
    Daxiang: '大象(擬)', // 馬顯
    Kaihuang: '開皇(擬)', // 張賔
    Daye: '大業', // 張冑玄
    Zhangmengbin: '張孟賓(擬)',
    Liuxiaosun: '劉孝孫(擬)',
    Huangji: '皇極', // 劉焯
    Wuyin: '戊寅', // 傅仁均
    Shenlong: '神龍(擬)', // 這是武則天的年號
    Linde: '麟德', // 李淳風。麟德在708-716、開元九-十六年用進朔法(黃一農《中國史曆表朔閏訂正舉隅———以唐〈麟德曆〉行用時期爲例》，頁291—296)
    // Jiuzhi: '九執(擬)', // 顯慶年間印度曆法
    Dayan: '大衍', // 一行
    Zhide: '至德(擬)', //
    Wuji: '五紀', // 寶應五紀曆。肅宗最後一個年號。郭獻之，綜合大衍、麟德
    Zhengyuan: '正元', // 德宗時期徐承嗣、楊景風綜合麟德、大衍
    Xuanming: '宣明', // 憲宗即位，徐昂上《觀象曆》，沒有記載。穆宗時期，宣明。晷漏、交會稍增損，更立新術以步五星，其餘都沿襲大衍。《中國古代曆法》第570頁宣明定朔進朔：秋分—春分：0.75，夏至0.74005，清明0.74924，小暑0.74031，穀雨0.74479，大暑0.74124，立夏0.74276，立秋0.74276，小滿0.74124，處暑0.74479，芒種0.74031，白露0.74924，請用戶自行進朔
    Chongxuan: '崇玄', // 昭宗時期邊岡、胡秀林、王墀。沿襲大衍，能用巧算。
    Futian: '符天(擬)', // 至元年間780-820術士曹士蔿。定氣注曆，但我還是平氣注曆。後晉天福時期，沿襲符天曆。在遼行用於947-994。失傳
    Qintian: '欽天', // 王樸。後周顯德三年至周亡956-960.。宋初960-963延用。日躔月離五星損益不存。五代時期，中原其他地區延用崇玄曆
    Yingtian: '應天', // 王處訥
    Qianyuan: '乾元',
    Yitian: '儀天',
    Chongtian: '崇天', // 遠地點。宋行古。
    Mingtian: '明天', // 周琮。歷史背景見董煜宇《从《奉元历》改革看北宋天文管理的绩效》，《自然科學史研究》2008年2期
    Fengyuan: '奉元(擬)',
    Guantian: '觀天',
    Zhantian: '占天(擬)',
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
    // Jiajun: '賈俊大明(擬)',
    Yangji: '楊級大明(擬)',
    NewDaming: '重修大明',
    Yiwei: '乙未(廢)',
    Gengwu: '庚午',
    Shoushi: '授時',
    Datong: '大統',
    // Huihui: '回回',
    West: '現代近似',
}
export const CalNameDayList = { // 可計算日書的曆法
    // West: '球面三角',
    Easthan: '後漢四分',
    Qianxiang: '乾象',
    Jingchu: '景初',
    Sanji: '三紀',
    Xuanshi: '玄始(擬)',
    Yuanjia: '元嘉',
    Daming: '大明',
    Zhengguang: '正光',
    Xinghe: '興和',
    Tianbao: '天保',
    Tianhe: '天和(擬)',
    Daxiang: '大象(擬)',
    Kaihuang: '開皇(擬)',
    Daye: '大業',
    Huangji: '皇極',
    Wuyin: '戊寅',
    Linde: '麟德',
    Dayan: '大衍',
    Zhide: '至德(擬)',
    Wuji: '五紀',
    Zhengyuan: '正元',
    Xuanming: '宣明',
    Chongxuan: '崇玄',
    Qintian: '欽天',
    Yingtian: '應天',
    Qianyuan: '乾元',
    Yitian: '儀天',
    Chongtian: '崇天',
    Mingtian: '明天',
    Fengyuan: '奉元(擬)',
    Guantian: '觀天',
    Zhantian: '占天(擬)',
    Jiyuan: '紀元',
    Tongyuan: '統元',
    Qiandao: '乾道',
    Chunxi: '淳熙',
    Huiyuan: '會元',
    Tongtian: '統天',
    Kaixi: '開禧',
    Chunyou: '淳祐(擬)',
    Huitian: '會天(擬)',
    Chengtian: '成天',
    Yangji: '楊級大明(擬)',
    NewDaming: '重修大明',
    Gengwu: '庚午',
    Shoushi: '授時',
    Datong: '大統',
}

export const ScList = ['癸亥', '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑', '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥', '甲子']
export const StemList = ' 甲乙丙丁戊己庚辛壬癸'
export const BranchList = ' 子丑寅卯辰巳午未申酉戌亥子'
export const StemList1 = ['', '焉逢', '旃蒙', '遊兆', '彊圉', '徒維', '祝犁', '上章', '重光', '玄黓', '昭陽']
export const BranchList1 = ['', '困敦', '赤奮若', '攝提格', '單閼', '執徐', '大荒落', '敦牂', '叶洽', '涒灘', '作鄂', '淹茂', '大淵獻']
export const NayinList = ['大海水', '海中金', '爐中火', '大林木', '路旁土', '刀釰金', '山頭火', '澗下水', '城頭土', '白蠟金', '楊柳木', '井泉水', '屋上土', '霹靂火', '松柏木', '長流水', '沙石金', '山下火', '平地木', '壁上土', '金箔金', '點燈火', '天河水', '大驛土', '釵釧金', '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水', '爐中火'] // 納音：甲子乙丑對應海中金
export const HalfList = '初正初'
export const QuarList = '初一二三四五六七八九'
export const TwelveList = ['', '彊', '少弱', '少', '少彊', '半弱', '半', '半彊 ', '太弱 ', '太', '太彊', '弱', '']
export const TwelveList1 = ['初', '初彊', '少弱', '少', '少彊', '半弱', '半', '半彊 ', '太弱 ', '太', '太彊', '末', '初']
export const TermList = ['小雪', '冬至', '大寒', '雨水', '春分', '穀雨', '小滿', '夏至', '大暑', '處暑', '秋分', '霜降', '小雪']
export const HalfTermList = ['冬至', '小寒', '大寒', '立春', '雨水', '驚蟄', '春分', '清明', '穀雨', '立夏', '小滿', '芒種', '夏至', '小暑', '大暑', '立秋', '處暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪']
export const HouList = [
    '蚯蚓', '麋角解', '水泉動', // 0冬至
    '鴈北', '鵲始巢', '雉始雊', // 十二月1小寒4。小寒之後丑2開始建除
    '雞乳', '鷙鳥疾', '冰腹堅', // 2大寒。
    '東風', '蟄蟲振', '魚上冰', // 一月3立春。
    '獺祭', '鴻鴈來', '草萌動', // 4雨水。麟徳、戊寅雨水驚蟄顛倒，大業、皇極與現在一樣
    '桃華', '倉庚鳴', '鷹化鳩', // 二月5驚蟄第16候，卯4開始建除
    '玄鳥', '雷發聲', '電始見', // 6春分
    '桐華', '田鼠爲鴽', '虹始見', // 三月7清明22
    '萍生', '鳩拂羽', '戴勝降桑', // 8穀雨    
    '螻蟈', '蚯蚓出', '王瓜生', // 四月9立夏28
    '苦菜', '蘼草死', '麥秋至', // 10小滿
    '螳螂', '鵙始鳴', '反舌無聲', // 五月11芒種34
    '鹿角', '蜩始鳴', '半夏生', // 12夏至爲第37候，庚7，虛長在第三個庚爲初伏，第四個庚中伏，立秋後第一個庚末伏
    '溫風', '蟋蟀居壁', '鷹學習', // 六月13小暑40
    '腐草', '地潤溽暑', '大雨行', // 14大暑
    '涼風', '白露降', '寒蟬鳴', // 七月15立秋46
    '鷹祭', '天地肅', '禾乃登', // 16處暑
    '鴻鴈', '玄鳥歸', '鳥養羞', // 八月17白露52
    '雷收', '蟄蟲附戶', '始涸', // 18秋分
    '來賓', '雀入爲蛤', '菊有黃花', // 九月19寒露58
    '豺祭', '草黄落', '蟄虫俯', // 20霜降
    '始冰', '地始凍', '雉入爲蜃', // 十月21立冬64
    '虹藏', '冰益壯', '地始坼', // 22小雪
    '鶡鴠', '虎始交', '荔挺出', // 十一月23大雪70
] // 融合皇極、宣明、其他。爲了不將候與五行混淆，把「土潤溽暑」改「地」，「水澤腹堅」改冰，「草木萌動「草木黄落」」刪木，「水泉動」「水始涸」「雀入水爲蛤」「雉入水爲蜃」「水始冰」刪水。儘量減少字數
export const HexagramList2 = ['公中孚', '辟復', '侯屯', '大夫謙', '卿睽', '公升', '辟臨', '侯小過', '大夫蒙', '卿益', '公漸', '辟泰', '侯需', '大夫隨', '卿晉', '伯震', '公解', '辟大壯', '侯豫', '大夫訟', '卿蠱', '公革', '辟夬', '侯旅', '大夫師', '卿比', '公小畜', '辟乾', '侯大有', '大夫家人', '卿井', '伯離', '公咸', '辟姤', '侯鼎', '大夫豐', '卿渙', '公履', '辟遯', '侯恆', '大夫節', '卿同人', '公損', '辟否', '侯巽', '大夫萃', '卿大畜', '伯兌', '公賁', '辟觀', '侯歸妹', '大夫無妄', '卿明夷', '公困', '辟剝', '侯艮', '大夫旣濟', '卿噬嗑', '公大過', '辟坤', '侯未濟', '大夫蹇', '卿頤', '伯坎'] // 從冬至開始。// 分配方法從乾象以來，除了天保都是一樣的。冬坎29、春震51、夏離30、秋兌58主分至後的73/80日，晉35、井48、大畜26、頤27主5+14/80，其餘6+7/80。乾象:1075/1178,5+206/1178, 6+103/1178，景初：10091/11058, 5+1934/11058, 6+967/11058。正光：(5530+9.2/24)/6060,5+(1059+5.6/24)/6060, 6+(529+14.8/24)/6060。我都用景初爲標準吧，誤差可以忽略。
export const HexagramAccumListA = [0.9125519985530838, 7, 13.087448001446916, 19.17489600289383, 25.262344004340747, 31.349792005787663, 37.43724000723458, 43.524688008681494, 49.61213601012841, 55.699584011575325, 61.78703201302224, 67.87448001446916, 73.96192801591607, 80.04937601736299, 86.1368240188099, 91.31172002170374, 92.22427202025682, 98.31172002170374, 104.39916802315065, 110.48661602459757, 116.57406402604448, 122.6615120274914, 128.7489600289383, 134.83640803038523, 140.92385603183214, 147.01130403327906, 153.09875203472598, 159.1862000361729, 165.2736480376198, 171.36109603906672, 177.44854404051364, 182.62344004340747, 183.53599204196055, 189.62344004340747, 195.71088804485439, 201.7983360463013, 207.88578404774822, 213.97323204919513, 220.06068005064205, 226.14812805208896, 232.23557605353588, 238.3230240549828, 244.4104720564297, 250.49792005787663, 256.58536805932357, 262.6728160607705, 268.76026406221746, 273.9351600651113, 274.84771206366435, 280.9351600651113, 287.02260806655823, 293.1100560680052, 299.1975040694521, 305.28495207089907, 311.372400072346, 317.45984807379295, 323.5472960752399, 329.63474407668684, 335.7221920781338, 341.80964007958073, 347.8970880810277, 353.9845360824746, 360.07198408392156, 365.2468800868154, 366.15943208536845, 372.2468800868154, 378.3343280882623, 384.4217760897092, 390.50922409115617, 396.59667209260306, 402.68412009404994, 408.7715680954969, 414.85901609694383, 420.9464640983907, 427.0339120998376, 433.12136010128455, 439.2088081027315, 445.2962561041784]
export const HexagramAccumListB = [0.9125519985530838, 6.9999457406402605, 13.087339482727437, 19.174733224814613, 25.26212696690179, 31.349520708988965, 37.43691445107614, 43.52430819316332, 49.6117019352505, 55.69909567733768, 61.78648941942486, 67.87388316151204, 73.96127690359921, 80.04867064568639, 86.13606438777356, 91.31086995840116, 92.22342195695424, 98.31081569904141, 104.39820944112859, 110.48560318321576, 116.57299692530293, 122.6603906673901, 128.74778440947728, 134.83517815156446, 140.92257189365165, 147.00996563573884, 153.09735937782602, 159.1847531199132, 165.2721468620004, 171.35954060408758, 177.44693434617477, 182.62173991680237, 183.53429191535545, 189.62168565744264, 195.70907939952983, 201.796473141617, 207.8838668837042, 213.9712606257914, 220.05865436787857, 226.14604810996576, 232.23344185205295, 238.32083559414014, 244.40822933622732, 250.4956230783145, 256.58301682040167, 262.6704105624888, 268.757804304576, 273.9326098752036, 274.84516187375664, 280.9325556158438, 287.01994935793095, 293.1073431000181, 299.19473684210527, 305.28213058419243, 311.3695243262796, 317.45691806836675, 323.5443118104539, 329.63170555254106, 335.7190992946282, 341.8064930367154, 347.89388677880254, 353.9812805208897, 360.06867426297686, 365.24347983360445, 366.1560318321575, 372.2434255742447, 378.3308193163319, 384.41821305841904, 390.50560680050626, 396.5930005425934, 402.6803942846806, 408.7677880267678, 414.85518176885495, 420.9425755109421, 427.0299692530293, 433.1173629951165, 439.20475673720364, 445.29215047929085, 451.379544221378, 456.5543497920056, 457.4669017905587, 463.5542955326459]
export const FiveAccumListA = [73.049376017363, 91.31172002170375, 164.36109603906675, 182.6234400434075, 255.67281606077051, 273.9351600651113, 346.9845360824743, 365.24688008681505, 438.29625610417804, 456.5586001085188]
export const FiveAccumListB = [73.04872340425531, 91.31090425531914, 164.35962765957447, 182.6218085106383, 255.67053191489362, 273.93271276595743, 346.98143617021276, 365.2436170212766, 438.2923404255319, 456.5545212765957] // 不同時期的五行用事，大概分成兩種，省得計算了
export const FiveList1 = ' 木火土金水'
export const FiveList2 = '土火土金土水土木' // 土王用事
export const ThreeList = '天地人' // 四分曆三紀名
export const YuanList = '上中下'
export const MansionNameList = ' 角亢氐房心尾箕斗牛女虛危室壁奎婁胃昴畢觜參井鬼柳星張翼軫' // 值日，星期日對應房、虛、昴、星
export const MansionAnimalNameList = ' 蛟龍貉兔狐虎豹獬牛蝠鼠燕豬㺄狼狗雉雞烏猴猿犴羊獐馬鹿蛇蚓'
export const MonSindhuNameList = ' 翼角氐心箕女室婁昴觜鬼星' // 李輝《漢譯佛經中的宿曜術研究》頁43
export const MonHexagramNameList = ' 泰壯夬乾姤遯否觀剝坤復臨'
export const MonScaleNameList = ['', '太簇', '夾鐘', '姑洗', '中呂', '蕤賓', '林鐘', '夷則', '南呂', '無射', '應鐘', '黃鐘', '大呂']
export const WeekList = ' 月火水木金土日' // 回回不用甲子，用七曜。
export const WeekList1 = ' 一二三四五六日'
export const NumList = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '廿', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '卅']
export const MonNumList = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
export const ColorList = ' 白黑碧綠黃白赤白紫' // 九宮
export const ClassColorList = ['', 'color-white', 'color-black', 'color-cyan', 'color-green', 'color-yellow', 'color-white', 'color-red', 'color-white', 'color-purple']
export const HexagramList1 = ' 乾兌離震巽坎艮坤' // 震 正東;兌 正西;離 正南;坎 正北;坤 西南;艮 東北;巽 東南;乾 西北
export const GongList = ['娵訾', '降婁', '大梁', '實沈', '鶉首', '鶉火', '鶉尾', '壽星', '大火', '析木', '星紀', '玄枵'] // 十二次
export const FourauspiciousList = ['甲丙庚壬', '艮巽坤乾', '癸乙丁辛'] // 四大吉時，和十二次一一對應
// 日遊神癸巳30—己酉46在內。癸巳30——丁酉34在內太微宮，戊戌35——壬寅39在內紫微宮。癸卯40在內太廟宮，甲辰41——己酉46在內御女宮
// 會天曆：癸巳30-丁酉34房內北，戊戌35—己亥36房內中，庚子37—壬寅39房內南，癸卯40房內西，甲辰41—丁未44房內東，戊申45房內中，己酉46房內出。零散的在房內中：戊辰己巳5、6，戊寅己卯15、16，戊子己丑25、26，戊午己未55、56，
export const MoonGodList = ['',
    '天道在南，天德在丁，月德在丙，月合在辛，月厭在戌，月煞在丑，月破在申，月刑在巳，月空在壬', // 正月
    '天道在西南，天德在坤，月德在甲，月合在巳，月厭在酉，月煞在戌，月破在酉，月刑在子，月空在庚', // 二月
    '天道在北，天德在壬，月德在壬，月合在丁，月厭在申，月煞在未，月破在戌，月刑在辰，月空在丙',
    '天道在西，天德在辛，月德在庚，月合在乙，月厭在未，月煞在辰，月破在亥，月刑在申，月空在申',
    '天道在西北，天德在乾，月德在丙，月合在辛，月厭在午，月煞在丑，月破在子，月刑在午，月空在壬',
    '天道在東，天德在申，月德在甲，月合在巳，月厭在巳，月煞在戌，月破在丑，月刑在丑，月空在庚',
    '天道在北，天德在癸，月德在壬，月合在丁，月厭在辰，月煞在未，月破在寅，月刑在寅，月空在丙',
    '天道在東北，天德在艮，月德在庚，月合在乙，月厭在寅，月煞在辰，月破在卯，月刑在酉，月空在申',
    '天道在南，天德在丙，月德在丙，月合在辛，月厭在卯，月煞在丑，月破在辰，月刑在未，月空在壬',
    '天道在東，天德在乙，月德在甲，月合在巳，月厭在寅，月煞在戌，月破在巳，月刑在亥，月空在庚',
    '天道在東南，天德在巽，月德在壬，月合在丁，月厭在子，月煞在未，月破在午，月刑在卯，月空在丙',
    '天道在西，天德在庚，月德在庚，月合在乙，月厭在亥，月煞在辰，月破在未，月刑在戌，月空在申'
] // 月神。這些迷信的內容參考何偉鳳《黑水城出土元代曆日研究》，寧夏大學碩士論文
export const ManGodList = ['', '大趾', '外踝', '股內', '腰', '口舌', '手', '內踝', '腕', '尻', '腰背', '鼻柱', '髮際', '齒', '胃管', '遍身', '胸', '氣衝', '股內', '足', '內踝', '小指', '外踝胸', '肝足', '手陽明', '足陽明', '胸', '膝', '陰', '膝脛', '足趺'] // 根據陰曆日來排列。 [黃帝明堂灸經卷上](https://ctext.org/wiki.pl?if=gb&chapter=548650)
// 十二部人神不宜灸.建日在足，禁晡時；除日在眼，禁日入；滿日在腹，禁黃昏；平日在背，禁人定，定日在心，禁夜半；執日在手，禁雞鳴；破日在口，禁平旦；危日在鼻，禁日出；成日在唇，禁食時；收日在頭，禁禺中；開日在耳，禁午時；閉日在目，禁日。
export const JianchuList = '建除滿平定執破危成收開閉' // 建除十二客（値、辰）
export const HuangheiList = ['青龍', '明堂', '天刑', '朱雀', '金匱', '天德', '白虎', '玉堂', '天牢', '玄武', '司命', '句陳'] // https://www.zhihu.com/question/20167015/answer/15508998

const EquatorDegTaichu = [0, 12, 9, 15, 5, 5, 18, 11, 26, 8, 12, 10, 17, 16, 9, 16, 12, 14, 11, 16, 2, 9, 33, 4, 15, 7, 18, 18, 17] // 太初至麟德
// const EquatorDegTaichu = [0, 0, 12, 21, 36, 41, 46, 64, 75, 101, 109, 121, 131, 148, 164, 173, 189, 201, 215, 226, 242, 244, 253, 286, 290, 305, 312, 330, 348]
const EquatorDegDayan = [0, 12, 9, 15, 5, 5, 18, 11, 26, 8, 12, 10, 17, 16, 9, 16, 12, 14, 11, 17, 1, 10, 33, 3, 15, 7, 18, 18, 17] // 大衍以後。太=0.75
// const EquatorDegMingtian = [0, 12, 9, 16, 5, 6, 19, 10, 25, 7, 11, 10, 16, 17, 9, 16, 12, 15, 11, 18, 1, 10, 34, 2, 14, 7, 18, 18, 17] // 明天的新値。「自漢太初後至唐開元治曆之初，凡八百年間，悉無更易。今雖測驗與舊不同，亦歲月未久。新曆兩備其數，如淳風從舊之意。」所以還是沿用以前的
const EquatorDegJiyuan = [0, 12, 9.25, 16, 5.75, 6.25, 19.25, 10.5, 25, 7.25, 11.25, 9, 15.5, 17, 8.75, 16.5, 12, 15, 11.25, 17.25, 0.5, 10.5, 33.25, 2.5, 13.75, 6.75, 17.25, 18.75, 17] // 少=1/4，太3/4。紀元的新値「如考唐，用唐所測；考古，用古所測：卽各得當時宿度。」根據年份用當時的觀測值。注意虛分要減去週天餘。金大明沿用紀元
const EquatorDegShoushi = [0, 12.1, 9.2, 16.3, 5.6, 6.5, 19.1, 10.4, 25.2, 7.2, 11.35, 8.7, 15.4, 17.1, 8.6, 16.6, 11.8, 15.6, 11.3, 17.4, 0.05, 11.1, 33.3, 2.2, 13.3, 6.3, 17.25, 18.75, 17.3] // 弦策少是0.25，太就是0.75。觜初五，說明初=0。大統同授時
// let MansionDegAccumList = []
// MansionDegAccumList = EquatorDegTaichu.slice()
// for (let i = 1; i <= 28; i++) {
//     MansionDegAccumList[i] += MansionDegAccumList[i - 1]
//     MansionDegAccumList[i] = parseFloat((MansionDegAccumList[i]).toPrecision(10))
// }
// MansionDegAccumList = MansionDegAccumList.slice(-1).concat(MansionDegAccumList.slice(0, -1))
// MansionDegAccumList[0] = 0
// 要在這就直接把積度定下來不太現實，因爲每部曆法斗分都不一樣。放棄。
const EclipticDegEasthan = [0, 13, 10, 16, 5, 5, 18, 10, 24, 7, 11, 10, 16, 18, 10, 17, 12, 15, 12, 16, 3, 8, 30, 4, 14, 7, 17, 19, 18]
const EclipticDegHuangji = [0, 13, 10, 16, 5, 5, 17, 10.5, 24, 7, 11.5, 10, 17, 17, 10, 17, 13, 15, 11, 15.5, 2, 9, 30, 4, 14.5, 7, 17, 19, 18] // 《中國古代曆法》頁25的胃本來是15，寫成14了
const EclipticDegLinde = [0, 13, 10, 16, 5, 5, 18, 10, 24, 7, 11, 10, 16, 18, 10, 17, 13, 15, 11, 16, 2, 9, 30, 4, 14, 7, 17, 19, 18]
const EclipticDegDayan = [0, 13, 9.5, 15.75, 5, 4.75, 17, 10.25, 23.5, 7.5, 11.25, 10, 17.75, 17.25, 9.75, 17.5, 12.5, 14.75, 11, 16.25, 1, 9.25, 30, 2.75, 14.25, 6.75, 18.75, 19.25, 18.75]
const EclipticDegYingtian = [0, 13, 9.5, 15.25, 5, 5, 17.25, 10.25, 23.5, 7.5, 11.75, 10, 17.25, 16.75, 10.25, 17.5, 12.75, 14.25, 11, 16.5, 1, 9.25, 30, 2.75, 14.5, 7, 18.25, 19.25, 18.75]
const EclipticDegMingtian = [0, 13, 9.5, 15.5, 5, 4.75, 17, 10, 23.5, 7.5, 11.5, 10, 17.75, 17.25, 9.75, 17.75, 12.75, 14.5, 10.75, 16, 1, 9.25, 30, 2.75, 14.25, 7, 18.75, 19.5, 18.75] // 明天、觀天
const EclipticDegJiyuan = [0, 12.75, 9.75, 16.25, 5.75, 6, 18.25, 9.5, 23, 7, 11, 9, 16, 18, 9.5, 18, 12.75, 15.5, 11, 16.5, 0.5, 9.75, 30.5, 2.5, 13.25, 6.75, 17.75, 20, 18.5]
const EclipticDegNewDaming = [0, 12.75, 9.75, 16.25, 5.75, 6, 18.25, 9.5, 23, 7, 11, 9, 16, 18.25, 9.5, 17.75, 12.75, 15.5, 11, 16.5, 0.5, 9.75, 30.5, 2.5, 13.25, 6.75, 17.75, 20, 18.5] // 重修大明、庚午
const EclipticDegShoushi = [0, 12.87, 9.56, 16.4, 5.48, 6.27, 17.95, 9.59, 23.47, 6.9, 11.12, 8.75, 15.95, 18.32, 9.34, 17.87, 12.36, 15.81, 11.08, 16.5, 0.05, 10.28, 31.03, 2.11, 13, 6.31, 17.79, 20.09, 18.75] // 黃道度

export const AutoMansion = (CalName, year) => {
    let EquatorDegList = [] // 不同時期用不同的宿度
    if (year >= 1260) {
        EquatorDegList = EquatorDegShoushi
    } else if (year >= 1100) {
        EquatorDegList = EquatorDegJiyuan
    } else if (year >= 724) {
        EquatorDegList = EquatorDegDayan
    } else {
        EquatorDegList = EquatorDegTaichu
    }
    let EclipticDegList = []
    if (year >= 1281) {
        EclipticDegList = EclipticDegShoushi
    } else if (CalName === 'NewDaming') {
        EclipticDegList = EclipticDegNewDaming
    } else if (year >= 1106) {
        EclipticDegList = EclipticDegJiyuan
    } else if (year >= 1065) {
        EclipticDegList = EclipticDegMingtian
    } else if (year >= 964) {
        EclipticDegList = EclipticDegYingtian
    } else if (year >= 729) {
        EclipticDegList = EclipticDegDayan
    } else if (year >= 665) {
        EclipticDegList = EclipticDegLinde
    } else if (CalName === 'Huangji') {
        EclipticDegList = EclipticDegHuangji
    } else {
        EclipticDegList = EclipticDegEasthan
    }
    return {
        EquatorDegList,
        EclipticDegList
    }
}
export const WestGongNameList = ['白羊', '金牛', '陰陽', '巨蟹', '獅子', '雙女', '天秤', '天蝎', '人馬', '磨羯', '寶瓶', '雙魚'] // 回回曆法
export const WestGongDayList = [31, 31, 31, 32, 31, 31, 30, 30, 29, 29, 30, 30] // 已上十二宮，所謂不動之月，凡三百六十五日，乃歲周之日也。若遇宮分有閏之年，於雙魚宮加一日，凡三百六十六日

// const ScList = ['癸亥']
// const StemList = '甲乙丙丁戊己庚辛壬癸'
// const BranchList = '子丑寅卯辰巳午未申酉戌亥'
// for (let i = 0; i < 60; i++) {
//     ScList.push(StemList[i % StemList.length] + BranchList[i % BranchList.length])
// }
// ScList.push('癸亥')
// const HexagramList2 = ['未濟', '乾', '坤', '屯', '蒙', '需', '訟', '師', '比', '小畜', '履', '泰', '否', '同人', '大有', '謙', '豫', '隨', '蠱', '臨', '觀', '噬嗑', '賁', '剝', '復', '無妄', '大畜', '頤', '大過', '坎', '離', '咸', '恆', '遯', '大壯', '晉', '明夷', '家人', '睽', '蹇', '解', '損', '益', '夬', '姤', '萃', '升', '困', '井', '革', '鼎', '震', '艮', '漸', '歸妹', '豐', '旅', '巽', '兌', '渙', '節', '中孚', '小過', '旣濟', '未濟'] 
////////預處理64卦。用景初的///////
// const HexagramRangeA = 10091 / 11058
// const HexagramRangeB = 5 + 1933 / 11058
// const HexagramRangeC = 6 + 966.4 / 11058
// let Range = []
// Range[0] = 0
// for (let i = 1; i <= 64; i++) {
//     if (i === 1 || i === 17 || i === 33 || i === 49) {
//         Range[i] = HexagramRangeA
//     } else if (i === 16 || i === 32 || i === 48 || i === 64) {
//         Range[i] = HexagramRangeB
//     } else {
//         Range[i] = HexagramRangeC
//     }
// }
// for (let k = 1; k <= 64; k++) {
//     Range[k] += Range[k - 1]
// }
// const MansionList = [ // 赤道度
//     [0, ''],
//     [12, '角'], // 1 東蒼龍 總75
//     [9, '亢'], // 2
//     [15, '氐'], // 3
//     [5, '房'], // 4
//     [5, '心'], // 5
//     [18, '尾'], // 6
//     [11, '箕'], // 7
//     [26, '斗'], // 8 北玄武 總98
//     [8, '牛'], // 9  
//     [12, '女'], // 10
//     [10, '虛'], // 11
//     [17, '危'], // 12
//     [16, '室'], // 13
//     [9, '壁'], // 14
//     [16, '奎'], // 15 西白虎 總80
//     [12, '婁'], // 16
//     [14, '胃'], // 17
//     [11, '昴'], // 18
//     [16, '畢'], // 19
//     [2, '觜'], // 20
//     [9, '參'], // 21
//     [33, '井'], // 22 南朱雀 總112
//     [4, '鬼'], // 23
//     [15, '柳'], // 24
//     [7, '星'], // 25
//     [18, '張'], // 26
//     [18, '翼'], // 27
//     [17, '軫'], // 28
// ]
// 黃赤度經過以下檢驗都沒問題了
// let EquatorDegList = []
// let EquatorDegAccumList = []
// EquatorDegList = EquatorDegShoushi.slice()
// EquatorDegAccumList = EquatorDegList.slice()
// for (let i = 1; i <= 29; i++) {
//     EquatorDegAccumList[i] += EquatorDegAccumList[i - 1]
// }
// EquatorDegAccumList = EquatorDegAccumList.slice(-1).concat(EquatorDegAccumList.slice(0, -1))
// EquatorDegAccumList[0] = 0