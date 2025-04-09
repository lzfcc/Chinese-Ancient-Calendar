import Para from "../parameter/calendars.mjs";
import {
  NameList,
  ScList,
  StemList,
  BranchList,
  StemList1,
  BranchList1,
  NayinList,
  WeekList,
  MansNameList,
  MansAnimalNameList,
  ManGodList,
  JianchuList,
  HuangheiList,
  YuanList,
  HalfTermNameList,
  HouListA,
  HouListB,
  Hexagram64ListA,
  Hexagram64ListB,
  HexagramSymbolListA,
  HexagramSymbolListB,
  FiveList2,
  NumList,
  MonNumList1
} from "../parameter/constants.mjs";
import {
  YearGodConvert,
  YearColorConvert,
  MonColorConvert,
  WangwangConvert,
  FubaoConvert,
  LsStarConvert,
  BloodConvert,
  TouringGodConvert
} from "../ephemeris/luck.mjs";
import CalNewm from "../newmoon/index.mjs";
import { AutoTcorr, AutoDifAccum, anojour } from "../astronomy/acrv.mjs";
import {
  deg2Mans,
  degAccumList,
  mans,
  midstar,
  solsMans
} from "../astronomy/mans.mjs";
import { nineOrbits } from "../astronomy/nineorbits.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import { AutoLightRange, AutoMoonAvgV } from "../parameter/auto_consts.mjs";
import { deci, fm60, fmod, lat2NS, nzh } from "../parameter/functions.mjs";
import { equaEclp } from "../astronomy/equa_eclp.mjs";
import {
  chooseNode,
  eclp2WhiteDif,
  equa2WhiteDif,
  moonEclpLat,
  moonJiudao,
  moonShoushi
} from "../astronomy/moon_lon_lat.mjs";
import { autoLat, autoRise, autoDial } from "../astronomy/lat_rise_dial.mjs";

export const D1 = (Name, YearStart, YearEnd) => {
  YearEnd = YearEnd || YearStart;
  const Main = (Name, Y) => {
    const {
      Type,
      LunarRaw,
      Node,
      Anoma,
      SolarRaw,
      WeekConst,
      MansDayConst,
      ScConst,
      CloseOriginAd
    } = Para[Name];
    let { Solar, Sidereal, Lunar } = Para[Name];
    const {
      LeapNumTerm,
      SolsAccum,
      NewmInt,
      NewmRaw,
      NewmAcrRaw,
      NewmAvgRaw,
      NewmNodeAccumPrint,
      NewmAnoAccumPrint,
      NewmAnoAccumMidnPrint
    } = CalNewm(Name, Y)[0];
    if (["Shoushi", "Shoushi2"].includes(Name)) {
      Solar = +(
        SolarRaw -
        Math.trunc((Y - CloseOriginAd + 1) / 100) * 0.0001
      ).toFixed(4);
    }
    Sidereal = Sidereal || Solar;
    Lunar = Lunar || LunarRaw;
    const HouLeng = Solar / 72;
    const HalfTermLeng = Solar / 24;
    const HexagramLeng = Solar / 60;
    const MoonAvgVd = AutoMoonAvgV(Name);
    const ZhengScOrder = fm60(Math.floor(NewmInt[0]) + (ScConst || 0));
    const ZhengSdInt = Math.floor(NewmInt[0]) - Math.floor(SolsAccum); // 正月朔日夜半距離冬至夜半整數日
    const SolsDeci = deci(SolsAccum);
    const { EclpAccumList, EquaAccumList } = degAccumList(Name, Y);
    /////////// 預處理72候、五行、八卦列表//////////
    let HouList = [],
      Hexagram64List = [],
      HexagramSymbolList = [],
      FiveAccumList = [],
      HexagramAccumList = [],
      HouAccum = [];
    if (Type < 7) {
      HouList = HouListA;
    } else {
      HouList = HouListB;
    }
    if (Type < 6) {
      Hexagram64List = Hexagram64ListA;
      HexagramSymbolList = HexagramSymbolListA;
    } else {
      Hexagram64List = Hexagram64ListB;
      HexagramSymbolList = HexagramSymbolListB;
    }
    for (let j = 0; j < 90; j++) {
      HouAccum[j] = HouLeng * j;
      HouAccum[j] = parseFloat(HouAccum[j].toPrecision(13));
    }
    const FiveLeng1 = Solar / 5;
    const FiveLeng2 = Solar / 4 - FiveLeng1;
    for (let i = 0; i <= 10; i++) {
      let FiveLeng = FiveLeng1;
      if (i % 2 === 1) {
        FiveLeng = FiveLeng2;
      }
      FiveAccumList[i] = FiveLeng;
    }
    for (let i = 1; i <= 10; i++) {
      FiveAccumList[i] += FiveAccumList[i - 1];
      FiveAccumList[i] = parseFloat(FiveAccumList[i].toPrecision(13));
    }
    FiveAccumList = [0, ...FiveAccumList];
    if (["Qianxiang", "Jingchu"].includes(Name)) {
      // 乾象景初用京房，後來都用孟喜
      const HexagramRangeA = 7 - HexagramLeng;
      const HexagramRangeB = HexagramLeng - HexagramRangeA;
      const HexagramRangeC = (Solar - (28 - 4 * HexagramRangeA)) / 56;
      for (let i = 0; i <= 63; i++) {
        if (i === 0 || i === 16 || i === 33 || i === 48) {
          HexagramAccumList[i] = HexagramRangeA;
        } else if (i === 15 || i === 31 || i === 47 || i === 63) {
          HexagramAccumList[i] = HexagramRangeB;
        } else {
          HexagramAccumList[i] = HexagramRangeC;
        }
      }
      for (let i = 1; i <= 63; i++) {
        HexagramAccumList[i] += HexagramAccumList[i - 1];
        HexagramAccumList[i] = parseFloat(HexagramAccumList[i].toPrecision(13));
      }
      HexagramAccumList = [0, ...HexagramAccumList];
      for (let i = 64; i <= 80; i++) {
        HexagramAccumList[i] = HexagramAccumList[i - 64] + Solar;
        HexagramAccumList[i] = parseFloat(HexagramAccumList[i].toPrecision(13));
      }
    } else {
      for (let j = 0; j < 75; j++) {
        HexagramAccumList[j] = HexagramLeng * j;
        HexagramAccumList[j] = parseFloat(HexagramAccumList[j].toPrecision(13));
      }
    }
    ///////
    const YearScOrder = (((Y - 3) % 60) + 60) % 60;
    const YearSc = ScList[YearScOrder];
    const YearStem = StemList.indexOf(YearSc[0]);
    const YearBranch = BranchList.indexOf(YearSc[1]);
    ////// 沒滅
    const MoSd = [],
      MieSd = [];
    const MoLeng = Solar / (Solar - 360);
    const FirstMo = Math.ceil(SolsAccum / MoLeng) * MoLeng; // floor在冬至之前，ceil在之後
    for (let i = 0; i <= 6; i++) {
      MoSd[i] = parseFloat((FirstMo + i * MoLeng).toPrecision(14)); // 距冬至日數
      if (Type <= 6 && MoSd[i] === Math.trunc(MoSd[i])) {
        MieSd[i] = MoSd[i];
      }
      MoSd[i] = parseFloat((MoSd[i] - SolsAccum).toPrecision(14));
      if (MieSd[i]) {
        MieSd[i] = parseFloat((MieSd[i] - SolsAccum).toPrecision(14));
      }
    }
    if (Type >= 7) {
      // 大衍改革滅
      const MieLeng = Lunar / (30 - Lunar);
      const FirstMie = Math.ceil(SolsAccum / MieLeng) * MieLeng;
      for (let i = 0; i <= 7; i++) {
        MieSd[i] = parseFloat(
          (FirstMie + i * MieLeng - SolsAccum).toPrecision(14)
        );
      }
    }
    ////////
    let Era = "";
    if (Y > 0) {
      Era =
        Y + "年歲次" + YearSc + StemList1[YearStem] + BranchList1[YearBranch];
    } else {
      Era =
        "前" +
        (1 - Y) +
        "年歲次" +
        YearSc +
        StemList1[YearStem] +
        BranchList1[YearBranch];
    }
    const Title = NameList[Name] + "萬年天文具注曆日";
    const YuanYear = (((Y - 604) % 180) + 180) % 180; // 術數的元，以604甲子爲上元，60年一元，凡三元
    const YuanOrder = Math.trunc(YuanYear / 60);
    const ThreeYuanYear = YuanYear - YuanOrder * 60;
    const Yuan =
      YuanList[YuanOrder] + "元" + nzh.encodeS(ThreeYuanYear + 1) + "年";
    const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear);
    const YearColor = YearColorConvert(YuanYear);
    // const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建
    const ZhengMonScOrder = (YearStem * 12 - 9) % 60;
    const SolsJd = 1903671 + Solar * (Y - 500); //  499 年 12 月 20 日  星期一 甲辰(41)
    const MonName = [],
      MonInfo = [],
      MonColor = [],
      Sc = [],
      Jd = [],
      Nayin = [],
      Week = [],
      Pos = [],
      Morningstar = [],
      Duskstar = [],
      HexagramName = [],
      FiveName = [],
      ManGod = [],
      Luck = [];
    let HouName = [];
    let DayAccum = 0,
      JieAccum = 0,
      SummsolsDayAccum = 0,
      AutumnDayAccum = 0; // 各節積日。夏至積日，立秋積日
    let JianchuDayAccum = ZhengSdInt; // 建除
    let HuangheiDayAccum = JianchuDayAccum;
    let JianchuOrigin = 0,
      HuangheiOrigin = 0,
      Fu1DayAccum = 0,
      Fu2DayAccum = 0,
      Fu3DayAccum = 0,
      HouOrder = 0,
      FiveOrder = 0,
      HexagramOrder = 0;
    for (let i = 1; i <= 12 + (LeapNumTerm > 0 ? 1 : 0); i++) {
      // 有閏就13
      let NoleapMon = i;
      if (LeapNumTerm > 0) {
        if (i === LeapNumTerm + 1) {
          NoleapMon = i - 1;
        } else if (i >= LeapNumTerm + 2) {
          NoleapMon = i - 1;
        }
      }
      MonName[i] = MonNumList1[NoleapMon] + "月";
      if (LeapNumTerm > 0 && i === LeapNumTerm + 1) {
        // 好像有LeapNumTerm<0的情況
        MonName[i] = "閏" + MonNumList1[LeapNumTerm] + "月";
      }
      MonName[i] += NewmInt[i] - NewmInt[i - 1] === 29 ? "小" : "大";
      const MonColorFunc = MonColorConvert(
        YuanYear,
        NoleapMon,
        ZhengMonScOrder
      );
      MonInfo[i] = MonColorFunc.MonInfo;
      MonColor[i] = MonColorFunc.MonColor;
      // 合朔的情況
      let MoonEclpLonNewmMidn = 0,
        NewmAnojour = 0,
        NewmSd = 0;
      if (Type < 4)
        NewmSd = NewmRaw[i - 1] - SolsAccum; // 合朔加時
      else NewmSd = NewmAcrRaw[i - 1] - SolsAccum;
      const AvgNewmSd = NewmAvgRaw[i - 1] - SolsAccum;
      if (Type === 1) {
        MoonEclpLonNewmMidn =
          (NewmSd - deci(NewmRaw[i - 1]) * MoonAvgVd + Solar) % Solar;
      } else {
        const AcrNewmAnoAccum =
          (NewmAnoAccumPrint[i - 1] +
            AutoTcorr(NewmAnoAccumPrint[i - 1], NewmRaw[i - 1], Name).Tcorr +
            Anoma) %
          Anoma;
        NewmAnojour = anojour(AcrNewmAnoAccum, Name).Anojour; // 定朔加時入轉度
      }
      let NewmWhiteDeg = 0,
        NewmWhiteGong = 0,
        Dingxian = 0,
        NodeWhiteGong = 0,
        WhEq_WhiteGong = 0,
        WhEqGong = 0;
      let NewmWhiteAccumList = []; // 九道宿鈐
      const NewmEclpGong =
        NewmSd + AutoDifAccum(undefined, NewmSd, Name).SunDifAccum; // 定朔距冬至實行度
      const { SolsEclpDeg, SolsEquaDeg } = solsMans(Name, Y);
      const NewmEclpDeg = NewmEclpGong + SolsEclpDeg;
      if (Type === 11) {
        const FuncNewm = moonShoushi(
          NewmNodeAccumPrint[i - 1],
          AvgNewmSd,
          NewmEclpGong,
          Y
        );
        NewmWhiteDeg = FuncNewm.NewmWhiteDeg;
        NewmWhiteGong = FuncNewm.NewmWhiteGong;
        NewmWhiteAccumList = FuncNewm.WhiteAccumList;
        Dingxian = FuncNewm.Dingxian;
        WhEq_WhiteGong = FuncNewm.WhEq_WhiteGong;
        WhEqGong = FuncNewm.WhEqGong;
      } else if (Type >= 6) {
        const FuncNewm = moonJiudao(
          NewmNodeAccumPrint[i - 1],
          NewmAnoAccumPrint[i - 1],
          AvgNewmSd,
          NewmEclpGong,
          Name,
          Y
        );
        NewmWhiteDeg = FuncNewm.NewmWhiteDeg;
        NewmWhiteGong = FuncNewm.NewmWhiteGong;
        NewmWhiteAccumList = FuncNewm.WhiteAccumList;
        NodeWhiteGong = FuncNewm.NodeWhiteGong;
      }
      const AcrNewmNodeAccum =
        NewmNodeAccumPrint[i - 1] +
        AutoTcorr(
          NewmAnoAccumPrint[i - 1],
          NewmSd,
          Name,
          NewmNodeAccumPrint[i - 1]
        ).NodeAccumCorrA;
      Sc[i] = [];
      Jd[i] = [];
      Nayin[i] = [];
      Week[i] = [];
      Pos[i] = [];
      Morningstar[i] = [];
      Duskstar[i] = [];
      HouName[i] = [];
      HexagramName[i] = [];
      FiveName[i] = [];
      ManGod[i] = [];
      Luck[i] = [];
      for (let k = 1; k <= NewmInt[i] - NewmInt[i - 1]; k++) {
        // 每月日數
        const SdMidn = NewmInt[i - 1] - SolsAccum + k - 1; // 每日夜半距冬至時長
        const SdInt = ZhengSdInt + DayAccum; // 每日夜半距冬至夜半整日數。冬至當日爲0
        DayAccum++; // 這個位置不能變
        //////////天文曆///////////
        let SunEquaLon,
          SunLon,
          MoonWhiteLon,
          MoonEclpLon,
          AnoAccumMidn,
          NodeAccumMidn,
          MoonEquaLon,
          MoonEclpDeg,
          MoonEquaDeg,
          NowNewm_WhiteDif,
          MoonEclp,
          MoonEqua,
          MoonWhite;
        if (Type === 1) {
          SunLon = SdMidn % Solar;
          SunEquaLon = equaEclp(SunLon, Name).Eclp2Equa % Solar;
          MoonEclpLon = (MoonEclpLonNewmMidn + (k - 1) * MoonAvgVd) % Sidereal;
          MoonEclpDeg = (MoonEclpLon + SolsEclpDeg) % Solar;
          MoonEquaLon = equaEclp(MoonEclpLon, Name).Eclp2Equa;
          MoonEquaDeg = (MoonEquaLon + SolsEquaDeg) % Sidereal;
        } else {
          AnoAccumMidn = (NewmAnoAccumMidnPrint[i - 1] + k - 1) % Anoma;
          NodeAccumMidn =
            (AcrNewmNodeAccum - deci(NewmAcrRaw[i - 1]) + k - 1 + Node) % Node;
          const SunDifAccumMidn = AutoDifAccum(0, SdMidn, Name).SunDifAccum;
          SunLon = (SdMidn + SunDifAccumMidn) % Sidereal;
          SunEquaLon = equaEclp(SunLon, Name).Eclp2Equa % Sidereal;
          // 《中》頁514 月度：欽天以後，先求正交至平朔月行度、平朔太陽黃度，由於平朔日月平黃經相同，所以相加減卽得正交月黃度
          const MidnAnojour = anojour(AnoAccumMidn, Name).Anojour;
          if (Type <= 4) {
            MoonEclpDeg =
              (NewmEclpDeg + MidnAnojour - NewmAnojour + Sidereal) % Sidereal;
            MoonEclpLon = (MoonEclpDeg - SolsEclpDeg + Sidereal) % Sidereal;
            MoonEquaLon = equaEclp(MoonEclpLon, Name).Eclp2Equa;
            MoonEquaDeg = (MoonEquaLon + SolsEquaDeg) % Sidereal;
          } else {
            // 有九道術的
            const MoonWhiteDeg =
              (NewmWhiteDeg + MidnAnojour - NewmAnojour + Sidereal) % Sidereal;
            MoonWhite = deg2Mans(MoonWhiteDeg, NewmWhiteAccumList).Print;
            MoonWhiteLon =
              (NewmWhiteGong + MidnAnojour - NewmAnojour + Sidereal) % Sidereal;
          }
          if (Type >= 6) {
            // 分授時與九道術
            const NodeEclpGong = chooseNode(
              NewmEclpGong,
              NewmNodeAccumPrint[i - 1],
              NewmAnoAccumPrint[i - 1],
              AvgNewmSd,
              Name
            );
            if (Type === 11) {
              const Moon_WhEq_WhiteDif =
                (MoonWhiteLon - WhEq_WhiteGong + Solar) % Solar;
              const Moon_WhEq_EquaDif =
                Moon_WhEq_WhiteDif -
                equa2WhiteDif(Dingxian, Moon_WhEq_WhiteDif);
              MoonEquaLon = (WhEqGong + Moon_WhEq_EquaDif) % Solar;
              MoonEclpLon = equaEclp(MoonEquaLon, Name).Equa2Eclp;
              MoonEquaDeg = (MoonEquaLon + SolsEquaDeg) % Sidereal;
              MoonEclpDeg = (MoonEclpLon + SolsEclpDeg) % Sidereal;
              NowNewm_WhiteDif =
                (MidnAnojour - NewmAnojour + Sidereal) % Sidereal;
            } else {
              const MoonNode_WhiteDif =
                (MoonWhiteLon - NodeWhiteGong + Solar) % Solar; // 此處Gong和Lon是一樣的，沒有區別
              const MoonNode_EclpDif =
                MoonNode_WhiteDif -
                eclp2WhiteDif(NodeEclpGong, MoonNode_WhiteDif, Name);
              MoonEclpLon = (NodeEclpGong + MoonNode_EclpDif) % Solar;
              MoonEclpDeg = (MoonEclpLon + SolsEclpDeg) % Sidereal;
              MoonEquaLon = equaEclp(MoonEclpLon, Name).Eclp2Equa;
              MoonEquaDeg = (MoonEquaLon + SolsEquaDeg) % Sidereal;
            }
          }
        }
        MoonEclp = MoonEclpDeg
          ? deg2Mans(MoonEclpDeg, EclpAccumList).Print
          : undefined;
        MoonEqua = MoonEquaDeg
          ? deg2Mans(MoonEquaDeg, EquaAccumList).Print
          : undefined;
        const Moon2SunEquaLat = autoLat(MoonEclpLon, Name, true); // 月亮所在黃道度對應的太陽的赤緯
        const SunEquaLat = autoLat(SdMidn, Name);
        let Dial = autoDial(SdMidn, SolsDeci, Name);
        Dial = Dial ? Dial.toFixed(3) + "尺" : undefined;
        const { Equa: SunEqua, Eclp: SunEclp } = mans(Name, Y, SunLon);
        let MoonEquaLat = 0,
          MoonEclpLat = 0;
        if (Type === 11) {
          MoonEquaLat = moonShoushi(
            NewmNodeAccumPrint[i - 1],
            AvgNewmSd,
            NewmEclpGong,
            undefined,
            NowNewm_WhiteDif
          ).EquaLat;
          MoonEclpLat = MoonEquaLat - Moon2SunEquaLat;
        } else {
          MoonEclpLat = moonEclpLat(NodeAccumMidn, AnoAccumMidn, SdMidn, Name);
          MoonEquaLat = MoonEclpLat + Moon2SunEquaLat;
        }
        let OrbColor;
        if (Type >= 6 && Type <= 10) {
          OrbColor = nineOrbits(NodeAccumMidn, NewmSd, Name);
        }
        Pos[i][k] = [
          { SunEquaLon: SunEquaLon.toFixed(4), SunEquaLat: lat2NS(SunEquaLat) },
          { SunCecLon: SunLon.toFixed(4), Dial: Dial },
          { SunEqua: SunEqua, SunCec: SunEclp },
          {
            MoonEquaLon: MoonEquaLon ? MoonEquaLon.toFixed(4) : undefined,
            MoonEquaLat: lat2NS(MoonEquaLat)
          },
          {
            MoonCecLon: MoonEclpLon ? MoonEclpLon.toFixed(4) : undefined,
            MoonCecLat: lat2NS(MoonEclpLat)
          },
          { MoonEqua: MoonEqua, MoonCec: MoonEclp },
          {
            MoonWhiteLon: MoonWhiteLon ? MoonWhiteLon.toFixed(4) : undefined,
            MoonWhite: MoonWhite,
            OrbColor: OrbColor
          }
        ];
        const FuncDusk = midstar(Name, Y, SunLon, SdMidn, SolsDeci);
        const Rise = autoRise(SdMidn, SolsDeci, Name);
        const LightRange = AutoLightRange(Name) * 100;
        Morningstar[i][k] = [
          {
            Morningstar: FuncDusk.Morningstar,
            Morning: (Rise - LightRange).toFixed(2),
            SunRise: Rise.toFixed(2) + "刻"
          },
          {
            SunSet: (100 - Rise).toFixed(2),
            Dusk: (100 - Rise + LightRange).toFixed(2) + "刻 ",
            Duskstar: FuncDusk.Duskstar
          }
        ];
        ///////////具注曆////////////
        const ScOrder = (ZhengScOrder + DayAccum) % 60;
        Sc[i][k] = ScList[ScOrder];
        const JdTmp = Math.trunc(SolsJd + SdMidn);
        const JdScDif = jd2Date(JdTmp).ScOrder - ScOrder;
        Jd[i][k] =
          JdTmp -
          (JdScDif > 50
            ? JdScDif - 60
            : JdScDif < -50
              ? JdScDif + 60
              : JdScDif);
        const date = jd2Date(Jd[i][k]);
        Jd[i][k] += " " + date.mm + "." + date.dd;
        const Stem = StemList.indexOf(Sc[i][k][0]);
        const Branch = BranchList.indexOf(Sc[i][k][1]);
        const JieNum = Math.round(
          (Math.ceil(Math.trunc(SdMidn / HalfTermLeng) / 2) + 11) % 12.1
        );
        // 順序不一樣！立春1，驚蟄2，清明3，立夏4，芒種5，小暑6，立秋7，白露8，寒露9，立冬10，大雪11，小寒12
        const JieDifInt = Math.trunc(
          (SdMidn - (JieNum * 2 + 1) * HalfTermLeng + SolsDeci + Solar) % Solar
        );
        if (Type >= 6) {
          const WeekOrder = fmod(NewmInt[i - 1] + k + 3 + (WeekConst || 0), 7);
          const MansOrder = fmod(
            NewmInt[i - 1] + k + 21 + (MansDayConst || 0),
            28
          );
          Week[i][k] =
            WeekList[WeekOrder] +
            MansNameList[MansOrder] +
            MansAnimalNameList[MansOrder];
        }
        for (let j = HouOrder; j < 90; j++) {
          // 氣候
          if (HouAccum[j] >= SdMidn && HouAccum[j] < SdMidn + 1) {
            HouOrder = j % 72;
            const TermOrder = HouOrder % 3 ? -1 : Math.round(HouOrder / 3) % 24;
            HouName[i][k] = [];
            if (Type >= 3) {
              HouName[i][k].push({
                Term: TermOrder >= 0 ? HalfTermNameList[TermOrder] : undefined,
                Hou:
                  HouList[HouOrder] +
                  deci(HouAccum[j] + SolsAccum)
                    .toFixed(4)
                    .slice(2, 6)
              });
            } else if (TermOrder >= 0) {
              HouName[i][k].push({
                Term: TermOrder >= 0 ? HalfTermNameList[TermOrder] : undefined,
                Hou: deci(HouAccum[j] + SolsAccum)
                  .toFixed(4)
                  .slice(2, 6)
              });
            }
            if (j % 6 === 3) {
              // 立春等節
              JieAccum = DayAccum;
            }
            if (j === 36) {
              SummsolsDayAccum = DayAccum;
            } else if (j === 45) {
              AutumnDayAccum = DayAccum;
            }
            break; // 兩個要點：break；由於建寅，要循環不止72個
          } else {
            HouName[i][k] = [undefined];
          }
        }
        if (DayAccum === 1) {
          const XiaohanDifInt = ZhengSdInt - HalfTermLeng + DayAccum;
          const tmp = Math.trunc((SdInt + 1 - XiaohanDifInt) / 12);
          const tmp1 = SdInt + 1 - tmp * 12 - Branch;
          JianchuOrigin = tmp1 + 2; // 小寒後第一個丑開始建除
          HuangheiOrigin = tmp1 + 12; // 小寒後第一個戌開始黃黑道
        }
        JianchuDayAccum += 1;
        HuangheiDayAccum += 1;
        if (DayAccum === JieAccum) {
          JianchuDayAccum--;
          HuangheiDayAccum--;
        }
        if (DayAccum === JieAccum + 1 && HouOrder !== 9) {
          HuangheiDayAccum--;
        }
        const Jianchu =
          JianchuList[(((JianchuDayAccum - JianchuOrigin) % 12) + 12) % 12];
        const Huanghei =
          HuangheiList[(((HuangheiDayAccum - HuangheiOrigin) % 12) + 12) % 12];
        if (SummsolsDayAccum && !Fu2DayAccum) {
          Fu1DayAccum = SummsolsDayAccum + ((17 - Stem) % 10) + 20;
          Fu2DayAccum = Fu1DayAccum + 10;
        }
        if (AutumnDayAccum && !Fu3DayAccum) {
          Fu3DayAccum = AutumnDayAccum + ((17 - Stem) % 10);
        }
        Nayin[i][k] =
          NayinList[Math.ceil(ScOrder / 2)] +
          Jianchu +
          Huanghei +
          " " +
          (Week[i][k] || "");
        let Fu;
        if (DayAccum === Fu1DayAccum) {
          Fu = { Sanfu: "初伏" };
        } else if (DayAccum === Fu2DayAccum) {
          Fu = { Sanfu: "中伏" };
        } else if (DayAccum === Fu3DayAccum) {
          Fu = { Sanfu: "末伏" };
        }
        HouName[i][k].push(Fu);
        for (let j = 0; j < 7; j++) {
          if (MieSd[j] >= SdMidn && MieSd[j] < SdMidn + 1) {
            HouName[i][k].push({
              Momie: "滅",
              MomieDeci: deci(MieSd[j] + SolsAccum)
                .toFixed(4)
                .slice(2, 6)
            });
            break;
          } else if (MoSd[j] >= SdMidn && MoSd[j] < SdMidn + 1) {
            HouName[i][k].push({
              Momie: "沒",
              MomieDeci: deci(MoSd[j] + SolsAccum)
                .toFixed(4)
                .slice(2, 6)
            });
            break;
          }
        }
        for (let l = 0; l < 10; l++) {
          // 8個五行
          if (SdMidn >= FiveAccumList[l] && SdMidn < FiveAccumList[l] + 1) {
            FiveOrder = l % 8;
            const FiveDeci = (SdMidn - FiveAccumList[l]).toFixed(4).slice(2, 6);
            FiveName[i][k] = [
              {
                FiveNameSymbol: FiveList2[FiveOrder],
                FiveNameDeci: FiveDeci
              }
            ];
            break;
          }
        }
        if (Type < 11) {
          // 授時不算64卦
          for (let m = HexagramOrder; m < 80; m++) {
            if (
              SdMidn >= HexagramAccumList[m] &&
              SdMidn < HexagramAccumList[m] + 1
            ) {
              HexagramOrder =
                m % (Hexagram64List === Hexagram64ListA ? 64 : 60);
              const HexagramDeci = (SdMidn - HexagramAccumList[m])
                .toFixed(4)
                .slice(2, 6);
              HexagramName[i][k] = [
                {
                  HexagramName: Hexagram64List[HexagramOrder],
                  HexagramSymbol: HexagramSymbolList[HexagramOrder],
                  HexagramDeci: HexagramDeci
                }
              ];
              break;
            } else {
              HexagramName[i][k] = undefined;
            }
          }
        }
        const Wangwang = WangwangConvert(
          NoleapMon,
          Stem,
          Branch,
          JieNum,
          JieDifInt
        );
        const Fubao = FubaoConvert(NoleapMon, Stem);
        const LongShortStar = LsStarConvert(NoleapMon, k);
        const BloodFunc = BloodConvert(NoleapMon, Branch, k);
        const Blood = BloodFunc.Blood;
        const Lin = BloodFunc.Lin;
        const TouringGod = TouringGodConvert(ScOrder);
        Luck[i][k] =
          (Wangwang || "") +
          (Fubao || "") +
          (Lin || "") +
          (LongShortStar || "");
        ManGod[i][k] = ManGodList[k] + (Blood || "") + (TouringGod || "");
        Sc[i][k] = NumList[k] + "日" + Sc[i][k];
      }
    }
    DayAccum = "凡" + nzh.encodeS(DayAccum) + "日　" + Yuan;
    return {
      Era,
      Title,
      DayAccum,
      YearGod,
      YearColor,
      MonName,
      MonInfo,
      MonColor,
      Sc,
      Jd,
      Nayin,
      Pos,
      Morningstar,
      HouName,
      HexagramName,
      FiveName,
      ManGod,
      Luck
    };
  };
  const result = [];
  for (let Y = YearStart; Y <= YearEnd; Y++) {
    result.push(Main(Name, Y));
  }
  return result;
};
// console.log(D1('Jiyuan', 1111))
