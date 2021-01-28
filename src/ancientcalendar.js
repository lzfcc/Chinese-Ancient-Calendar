// SC卽SexagenaryCycle干支
var SCList = [
  "",
  "甲子",
  "乙丑",
  "丙寅",
  "丁卯",
  "戊辰",
  "己巳",
  "庚午",
  "辛未",
  "壬申",
  "癸酉",
  "甲戌",
  "乙亥",
  "丙子",
  "丁丑",
  "戊寅",
  "己卯",
  "庚辰",
  "辛巳",
  "壬午",
  "癸未",
  "甲申",
  "乙酉",
  "丙戌",
  "丁亥",
  "戊子",
  "己丑",
  "庚寅",
  "辛卯",
  "壬辰",
  "癸巳",
  "甲午",
  "乙未",
  "丙申",
  "丁酉",
  "戊戌",
  "己亥",
  "庚子",
  "辛丑",
  "壬寅",
  "癸卯",
  "甲辰",
  "乙巳",
  "丙午",
  "丁未",
  "戊申",
  "己酉",
  "庚戌",
  "辛亥",
  "壬子",
  "癸丑",
  "甲寅",
  "乙卯",
  "丙辰",
  "丁巳",
  "戊午",
  "己未",
  "庚申",
  "辛酉",
  "壬戌",
  "癸亥"
];

var CalendarName = { Yin: "殷曆", Zhou: "周曆", Lu: "魯曆" };
function AncientCalendarParameters(CalendarList) {
  var origin,
    jdM0,
    JDw,
    FirstMonth = 0;
  switch (CalendarList) {
    case "Yin":
      jdM0 = 1704250.5001;
      JDw = 1721051.5001 + 0.5;
      origin = 2760366;
      break;
    case "Zhou":
      jdM0 = 1683430.5001;
      JDw = 1721050.5001 + 0.75;
      origin = 2760423;
      break;
    case "Lu":
      FirstMonth = 1;
      jdM0 = 1604170.5001;
      JDw = 1721050.5001;
      origin = 2763680;
      break;
    default:
      console.log("沒有" + CalendarList + "的曆法數據");
  }
  return { origin, FirstMonth, jdM0, JDw };
}

function AncientCalendar(CalendarList, year) {
  // 朔策和歲實
  var lunar = 29 + 499.0 / 940,
    syzygy = 14 + 1439.0 / 1880,
    solar = 365.25;
  // 讀取曆法參數
  var p = AncientCalendarParameters(CalendarList);
  // 天正冬至的儒略日數
  var Z11 = p.JDw + year * solar;
  // 建子月朔(天正經朔)
  var i = Math.floor((Math.floor(Z11 + 0.5) + 0.5 - p.jdM0) / lunar);
  var Mzi = p.jdM0 + i * lunar;
  // 此歲有閏月?
  var leap = Mzi + 13 * lunar > Math.floor(Z11 + solar + 0.5) + 0.5 ? 0 : 1;
  // 年首月建的朔 (顓頊曆:十月, 其他曆法:正月)
  var M1 = Mzi + p.FirstMonth * lunar;
  // 年首月建為建丑或建寅的曆法
  if (p.FirstMonth > 0) {
    // 閏月使正月推遲一個月
    M1 += leap * lunar;
    // 下一歲建子月及冬至
    Mzi += (12 + leap) * lunar;
    Z11 += solar;
    // 下一歲歲有閏月?
    leap = Mzi + 13 * lunar > Math.floor(Z11 + solar + 0.5) + 0.5 ? 0 : 1;
  }
  var Mi = M1 + 0.5 - lunar;
  var FirstDay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var FirstDaySC = [];
  for (i = 1; i < 13 + leap; i++) {
    FirstDay[i] = Math.floor(Mi + lunar);
    FirstDaySC[i] = ((FirstDay[i] - 11) % 60) + 1;
    Mi += lunar;
  }
  var SyzygyDay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var SyzygyDaySC = [];
  for (i = 1; i < 13 + leap; i++) {
    SyzygyDay[i] = Math.floor(Mi + lunar + syzygy);
    SyzygyDaySC[i] = ((SyzygyDay[i] - 11) % 60) + 1;
    Mi += lunar;
  }
  var Mi = M1 + 0.5;
  var GreatCommonString = [Math.floor(Mi), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 1; i < 13 + leap; i++) {
    GreatCommonString[i] = Math.floor(Mi + lunar) - Math.floor(Mi);
    Mi += lunar;
  }
  var SC = [];
  for (i = 1; i < 13 + leap; i++) {
    SC.push(SCList[FirstDaySC[i]]);
  }
  return { origin: p.origin, FirstDaySC, SyzygyDaySC, GreatCommonString, leap };
}

export default function Calculate(YearRange) {
  var table = {};
  table.title = "前" + Math.abs(YearRange - 1) + "年\n";
  table.data = [];
  ["Yin", "Zhou", "Lu"].forEach(function (cal) {
    var {
      origin,
      FirstDaySC,
      SyzygyDaySC,
      GreatCommonString,
      leap
    } = AncientCalendar(cal, YearRange);
    var GreatCommon = [];
    var SC = [];
    var SyzygySC = [];
    for (var i = 1; i < 13 + leap; i++) {
      SC.push(SCList[FirstDaySC[i]]);
      SyzygySC.push(SCList[SyzygyDaySC[i]]);
      GreatCommon.push(GreatCommonString[i] > 29 ? "大" : "小");
    }
    const result = {};
    result.name = cal;
    result.info = CalendarName[cal] + "上元積年" + Math.abs(YearRange + origin);
    result.sc = SC;
    result.sy = SyzygySC;
    result.gc = GreatCommon;
    table.data.push(result);
  });
  // console.log(table);
  return table;
}
