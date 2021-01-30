var SClist = ['癸亥']
var Tiangan = '甲乙丙丁戊己庚辛壬癸'
var Dizhi = '子丑寅卯辰巳午未申酉戌亥'
for (i = 0; i < 60; i++) {
    SClist.push(Tiangan[i % Tiangan.length] + Dizhi[i % Dizhi.length])
}
SClist.push('癸亥', '□□')
var JiList = ['天', '地', '人'] // 四分曆三個「紀」的名字
var CalendarName = {
    Yin: '   \n● **殷** ',
    Zhou: '   \n● **周** ',
    Huangdi: '   \n● **黃帝** ',
    Lu: '   \n● **魯** ',
    XiaA: '   \n● **冬夏** ', 
    XiaB: '   \n● **雨夏** ', 
    Zhuanxu: '   \n● **顓頊** ',
    Santong: '   \n● **三統** ',
    Qian: '   \n● **乾鑿度** ',
    EastHan: '   \n● **後漢四分** ',
    Shoushi: '   \n● **授時** ',
    ShouAcr: '   \n● **精确授時** '
}
exports.SClist = SClist;
exports.JiList = JiList;
exports.CalendarName = CalendarName;