// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import Para from "../parameter/calendars.mjs";
import { ScList } from "../parameter/constants.mjs";
import { mansQing } from "../astronomy/mans.mjs";
import { clockQingB } from "../time/decimal2clock.mjs";
import {
  White2Eclp,
  eclp2Equa,
  moonEclp2EquaGuimao,
  ABCa_Sph,
  BaC_Sph,
  aCtimeb_Sph,
  abc_Sph,
  qiexian,
  qiexianA,
  Gong2Lon,
  Lon2Gong,
  HighLon2FlatLat,
  LonHigh2Flat,
  LonFlat2High,
  aCb_Sph,
  LonHigh2FlatB,
  deg2Hms,
  sunRise
} from "../astronomy/pos_convert.mjs";
import {
  fix,
  deci,
  abs,
  sqr,
  sign,
  sind,
  cosd,
  tand,
  cotd,
  asind,
  acosd,
  atand,
  acotd,
  fm360,
  t2,
  t3,
  f3,
  lat2NS1
} from "../parameter/functions.mjs";
import {
  corrRingC,
  distEllipseA,
  moonGuimao,
  moonQing,
  sunCorrQing,
  sunQing
} from "../astronomy/sun_moon_qing.mjs";
import { timeAvg2Real } from "../time/eot_qing.mjs";
export const N4 = (Name, Y) => {
  const {
    CloseOriginAd,
    Solar,
    Lunar,
    ChouConst,
    SolsConst,
    SperiConst,
    SperiVy,
    SperiVd,
    SunAvgVd,
    MoonAvgVd,
    MapoVd,
    NodeVd,
    MoonConst,
    MapoConst,
    NodeConst,
    SunLimitYinAcr,
    SunLimitYangAcr,
    MoonLimit,
    MansDayConst,
    Sobliq,
    RiseLat
  } = Para[Name]; // SunAvgVm, SorbVm, MorbVm, MoonNodeVmSum, ChouSunConst, ChouSorbConst, ChouMorbConst, ChouWhitelongiConst
  const TermLeng = Solar / 12;
  const MorbVd = MoonAvgVd - MapoVd;
  const SorbVd = SunAvgVd - SperiVd;
  const MSAvgVdDif = MoonAvgVd - SunAvgVd;
  const MoonNodeVdSum = MoonAvgVd + NodeVd;
  const CloseOriginYear = Y - CloseOriginAd;
  const CloseOriginYearAbs = abs(CloseOriginYear); // 積年
  const OriginAccum = +(CloseOriginYearAbs * Solar).toFixed(9); // 中積
  const SolsAccum =
    Y >= CloseOriginAd ? OriginAccum + SolsConst : OriginAccum - SolsConst; // 通積分
  const MansDaySolsmor =
    Y >= CloseOriginAd
      ? Math.trunc(((OriginAccum + MansDayConst) % 28) % 28)
      : Math.trunc((28 - ((OriginAccum - MansDayConst) % 28)) % 28); // 值宿日分
  const Sols = +(
    Y >= CloseOriginAd ? SolsAccum % 60 : 60 - (SolsAccum % 60)
  ).toFixed(9);
  const SolsDeci = deci(Sols); // 冬至小數
  const SolsmorScOrder = (Math.trunc(Sols) + 2) % 60; // 本年紀日：以天正冬至干支加一日得紀日。（考成：所求本年天正冬至次日之干支。既有天正冬至干支，可以不用紀日，因用表推算起於年根而不用天正冬至。若無紀日，則無以定干支，且日數自紀日干支起初日，故並用之）Solsmor: winter solstice tomorrow 冬至次日子正初刻
  const SunRoot = (1 - SolsDeci) * SunAvgVd; // 年根（考成：天正冬至次日子正初刻太陽距冬至之平行經度。天正冬至分：冬至距本日子正初刻後之分數與周日一萬分相減，餘爲冬至距次日子正初刻前之分數，故與每日平行為比例，得次日子正初刻太陽距冬至之平行經度）。一率：週日一萬分，二率：每日平行，三率：以天正冬至分與週日一萬分相減，求得四率爲秒，以分收之得年根。// 本來是分，我收作度。
  const DayAccum =
    Y >= CloseOriginAd
      ? OriginAccum + deci(SolsConst) - SolsDeci
      : OriginAccum - deci(SolsConst) + SolsDeci; // 積日（曆元冬至次日到所求天正冬至次日的日數，等於算式的曆元冬至當日到所求冬至當日日數）

  // const LunarAccumSun = LunarAccum * SunAvgVm // 積朔太陽平行
  // const ChouSun = fm360(Y >= CloseOriginAd ? ChouSunConst + LunarAccumSun : ChouSunConst - LunarAccumSun)
  // const LunarAccumWhitelongi = LunarAccum * MoonNodeVmSum // 積朔太陰交周
  // const ChouWhitelongi = fm360(Y >= CloseOriginAd ? LunarAccumWhitelongi + ChouWhitelongiConst : ChouWhitelongiConst - LunarAccumWhitelongi) // 首朔太陰交周。1949算例247°56′27.55″=247.9409861111
  // const LunarAccumSorb = LunarAccum * SorbVm
  // const ChouSorb = fm360(Y >= CloseOriginAd ? ChouSorbConst + LunarAccumSorb : ChouSorbConst - LunarAccumSorb)
  // const LunarAccumMorb = LunarAccum * MorbVm
  // const ChouMorb = fm360(Y >= CloseOriginAd ? ChouMorbConst + LunarAccumMorb : ChouMorbConst - LunarAccumMorb) // 1949算例290°0′34.90″=290.009694444444
  const MoonRoot =
    Y >= CloseOriginAd
      ? MoonConst + DayAccum * MoonAvgVd
      : MoonConst - DayAccum * MoonAvgVd; // 太陰年根
  const MapoRoot =
    Y >= CloseOriginAd
      ? DayAccum * MapoVd + MapoConst
      : MapoConst - DayAccum * MapoVd; // 最高年根
  const NodeRoot =
    Y >= CloseOriginAd
      ? fm360(NodeConst - DayAccum * NodeVd)
      : fm360(NodeConst + DayAccum * NodeVd); // 正交年根，所得爲白經
  // const Mans = (OriginAccumMans % 28 + 1 + 28) % 28 // 自初日角宿起算，得值宿。（考成：天正冬至乃冬至本日之干支，值宿乃冬至次日之宿，故外加一日。）
  const SperiRoot = SperiConst + SperiVy * CloseOriginYear; // 本年最卑行+最卑應=我命名的最卑年根
  const ChouAccum =
    Y >= CloseOriginAd ? DayAccum - ChouConst : DayAccum + ChouConst; // 通朔
  // const LunarAccum = Y >= CloseOriginAd ? Math.trunc(ChouAccum / Lunar) + 1 : Math.trunc(ChouAccum / Lunar) // 積朔。似乎+1是為了到十二月首朔
  let ChouSmd =
    Y >= CloseOriginAd
      ? (Lunar - (ChouAccum % Lunar)) % Lunar
      : ChouAccum % Lunar; // 首朔（十二月朔距冬至次日子正）：通朔以朔策除之，得數加一爲積朔，餘數與朔策相減爲首朔。上考則通朔以朔策除之爲積朔，餘數爲首朔。Smd：某時刻距離冬至次日子正的時間
  // 下面要考慮一種特殊情況，例如677BC年前平冬至庚申、定冬至戊午，丑月平朔庚申，這時ChouSmd是寅月的
  const SolsAcrAvgDif = -sunCorrQing(Name, -SperiRoot).Corr / SunAvgVd; // 大約算一下定冬至距平冬至多久
  // const AssumChouAvgSd = ChouSmd + (1 - SolsDeci); // 距平冬至
  // const AssumChouAcrSd = AssumChouAvgSd - SolsAcrAvgDif;
  if (SolsDeci + SolsAcrAvgDif < 0 && ChouSmd > 28) ChouSmd -= Lunar; // 感覺還不太完善，以後看到錯了再說

  const sunEcliJiazi = (
    NowSmd,
    AcrWhitelongi,
    AcrMorb,
    AcrMoonCorr1,
    AcrSorb,
    AcrSunLon
  ) => {
    // AcrWhitelongi = 179 + 49 / 60 + 47.28 / 3600 // 2009算例
    const Mobliq0116 = 4.975;
    const SDistMax = 1.0179208;
    const SDistRatMax = 1162; // 太陽最高距地，地半徑比例數
    const MDistMax = 1.01725;
    const MDistRatMax = 58.16;
    const MRadReal = 0.27;
    const SRadReal = 5.07;
    const SlRad = 6.37; // 太陽實半徑，光分半徑
    const AcrSunGong = Lon2Gong(AcrSunLon);
    /// ///// 【八】食甚距緯、食甚時刻——與月食同
    const Distreal = HighLon2FlatLat(Mobliq0116, AcrWhitelongi); // 食甚實緯（距緯）：用時月距日之白緯。考成圖上平的是白道，斜的是黃道
    // 實朔的定義，考成：日距交之黃經=月距交之白經；後編：黃經相同
    const GreatWhitelongi = LonHigh2Flat(Mobliq0116, AcrWhitelongi); // 食甚交周：用時太陰距正交之白經。以太陽距交之黃經求其相當之白經，即食甚交周。距交之經度為食甚交周，相距之緯度即食甚實緯
    const Dif = GreatWhitelongi - AcrWhitelongi; // 交周升度差=食甚交周與實朔交周之差
    const OnehAftMoonCorr1 = corrRingC(MorbVd / 24 + AcrMorb, 0.0435).Corr;
    const MSAcrVhDif = MSAvgVdDif / 24 + OnehAftMoonCorr1 - AcrMoonCorr1; // 一小時月距日實行。後均與實均同號相減，異號相加。與一小時月距日平行相加減：實均與後均同爲加者，後均大則加；同為減者，後均大則減。異號者，後均加則加，後均減則減
    const SmdAvg = NowSmd + Dif / MSAcrVhDif / 24; // 食甚用時：日月白道同度之時刻
    const AcrSunEquaLon = LonHigh2Flat(Sobliq, AcrSunLon); // 算例：15度-->赤道同升度13度48分23秒
    const SDistRat = (sunCorrQing(Name, AcrSorb).d / SDistMax) * SDistRatMax; // 太陽距地
    const MDistRat =
      ((corrRingC(AcrMorb, 0.0435).d - 0.01175) / MDistMax) * MDistRatMax; // 太陰距地。日月距地都是近時真時同用，因為變化可以忽略
    /// ///// 【九】食甚近時
    const sunEcliJiaziMain = (SunGong, SunEquaLon, Smd) => {
      const SpringSouEquaDif = (SunEquaLon + deci(Smd) * 360 + 180) % 360; // 用時春分距午赤道度=太陽距春分+太陽距正午。太陽赤道度自西而東，時刻赤道度自東而西。算例：deci(Smd)=16/24=.6666，申正距午正60度
      const NoxSouEquaDif = t3(SpringSouEquaDif); // 用時春秋分距午赤道度。算例73.806348227262589
      const NoxSouEclpDif = LonFlat2High(Sobliq, NoxSouEquaDif); // 用時春秋分距午黃道度。《求黃平象限》葉37 用癸己戊正弧三角，有直角、黃赤大距、距午赤道度。算例75.08623544960639
      let NoonEclpLon = NoxSouEclpDif;
      if (SpringSouEquaDif < 90) {
      } else if (SpringSouEquaDif < 180) NoonEclpLon = 180 - NoxSouEclpDif;
      else if (SpringSouEquaDif < 270) NoonEclpLon = NoxSouEclpDif + 180;
      else NoonEclpLon = 360 - NoxSouEclpDif;
      const NoonEclpGong = Lon2Gong(NoonEclpLon); // 用時正午黃道宮度。算例165度5分10秒=165.08611111111
      const NoonLatDif = aCb_Sph(NoxSouEquaDif, NoxSouEclpDif, Sobliq); // 用時正午黃赤距緯。算例22.655413696754813
      const AngEclpSou = abc_Sph(NoxSouEquaDif, NoxSouEclpDif, NoonLatDif); // 用時黃道與子午圈交角。子午圈就是正午的圈。算例癸角=83.61729023292902
      const NoonEclpHigh =
        90 - RiseLat + (NoonEclpLon < 180 ? 1 : -1) * NoonLatDif; // 用時正午黃道高。算例癸乙72度44分19秒=72.7386111111
      const EclpmidHigh = BaC_Sph(90, AngEclpSou, NoonEclpHigh); // 黃平象限距地平。算例丑角=72度50分56秒=72.8488888889
      const EclpmidSouDif = abs(
        90 - ABCa_Sph(EclpmidHigh, 90, AngEclpSou, NoonEclpHigh)
      ); // 用時黃平象限距午度。算例癸丑弧88度1分18秒=88.02166666667
      const EclpmidGong =
        NoonEclpGong +
        (NoonEclpGong < 180 ? 1 : -1) *
          (NoonEclpHigh > 90 ? -1 : 1) *
          EclpmidSouDif; // 用時黃平象限宮度。算例167度3分52秒=167.06444444444
      const SunEclpmidDif = abs(SunGong - EclpmidGong); // 用時太陽距黃平象限=月距限。算例壬子弧62度3分52秒=62.06444444444
      const SignEw = (SunGong - EclpmidGong + 360) % 360 < 180 ? 1 : -1; // 太陽黃經大於黃平象限宮度爲限東。大於0爲限東，小於0爲限西——我想了下應該這樣處理
      // const SignEw = Math.sign(SunEclpmidDif) // 限東為1，西-1
      const Zichou = 90 - SunEclpmidDif; // 太陽距黃平象限之餘
      // const Maochou = LonHigh2Flat(EclpmidHigh, Zichou)
      const AngEclpHigharc = abs(
        atand(cotd(EclpmidHigh) / sind(SunEclpmidDif))
      ); // asind(sind(Maochou) / sind(Zichou)) // 黃道高弧交角。sin90/sin子丑=sin子/sin卯丑=sin丑/sin子卯。或BaC_Sph(EclpmidHigh, 90, Maochou) 算例角子=19度15分19秒=19.2552777778
      const SunHigh = asind(sind(Zichou) * sind(EclpmidHigh)); // 太陽高弧。算例子卯=26度35分30秒
      let flag1 = 1;
      if (GreatWhitelongi < 90 || GreatWhitelongi > 270) {
        if (SignEw < 0) flag1 = -1;
      } else if (SignEw > 0) flag1 = -1;
      const AngSunZenith = 90 - SunHigh;
      const SParallax = qiexianA(1, SDistRat, AngSunZenith);
      const MParallax = qiexianA(1, MDistRat, AngSunZenith);
      const Parallax = MParallax - SParallax; // 用時高下差
      let SignSn = 1;
      let EwCorr = 0;
      let SnCorr = 0;
      if (Name === "Jiazi") {
        const AngWhiteHigharc = abs(AngEclpHigharc + flag1 * Mobliq0116); // 白道高弧交角
        // if (AngWhiteHigharc > 90) SignEw = -SignEw // 加過90度者則限東變為限西。——最後求東西差，大於90的話cos就是負數，所以不用管這個
        const WhitemidHigh = 180 - BaC_Sph(EclpmidHigh, Mobliq0116, Zichou); // 白平象限距地平高，>90就是在天頂北。卷八白平象限葉55
        // const SignSn = EclpmidHigh > 90 ? -1 : 1 // 限距地高在天頂北者，白平象限在天頂南。白平象限在天頂南爲-1，北1。卷八白平象限葉75
        SignSn = WhitemidHigh > 90 ? 1 : -1;
        EwCorr = atand(cosd(AngWhiteHigharc) * tand(Parallax)); // 東西差。半徑與交角餘弦之比=高下差正切與東西差正切之比
        SnCorr = asind(sind(Parallax) * sind(AngWhiteHigharc)); // 南北差。東西南北差驗算通過
      } else {
        // 看到考成說新法以黃平象限為根據，所以暫時這樣寫
        SignSn = EclpmidHigh > 90 ? 1 : -1;
        EwCorr = atand(cosd(AngEclpHigharc) * tand(Parallax)); // 東西差
        SnCorr = asind(sind(Parallax) * sind(AngEclpHigharc)); // 南北差
      }
      return { EwCorr: EwCorr * SignEw, SnCorr: SnCorr * SignSn };
    };
    const { EwCorr: AvgEwCorr } = sunEcliJiaziMain(
      AcrSunGong,
      AcrSunEquaLon,
      SmdAvg
    );
    const Acr0AvgDif = AvgEwCorr / MSAcrVhDif / 24; // 近時距分
    const SmdAcr0 = SmdAvg - Acr0AvgDif; // 食甚近時。用時月距限西爲加（以用時白道高弧交角變限不變限爲定）
    /// ///// 【十】食甚真時
    const { EwCorr: Acr0EwCorr } = sunEcliJiaziMain(
      AcrSunGong - AvgEwCorr,
      AcrSunEquaLon,
      SmdAcr0
    ); // 太陽距春分後赤道度，即前求用時春分距午赤道度條內所得之數
    const AcrAvgDif = (AvgEwCorr / (AvgEwCorr * 2 - Acr0EwCorr)) * Acr0AvgDif; // 食甚距分。加減號與近時距分同。AvgEwCorr * 2 - Acr0EwCorr是食甚視行
    const SmdAcr = SmdAvg - AcrAvgDif;
    /// ///// 【十一】食分
    const { EwCorr: AcrEwCorr, SnCorr: AcrSnCorr } = sunEcliJiaziMain(
      AcrSunGong - Acr0EwCorr,
      AcrSunEquaLon,
      SmdAcr
    );
    const Distappa = Distreal + AcrSnCorr; // 視緯=實緯加減南北差。白平象限在天頂南者，實緯在黃道南則加，視緯仍爲南。實緯在黃道北則減，視緯仍爲北；若實緯在黃道北而南北差大於實緯，則反減，視緯即變為南。白平象限在天顶北者，实纬在黄道北则加，而视纬仍为北；實緯在黃道南則減，視緯仍爲南；若實緯在黃道南，而南北差大於實緯，則反減，視緯即變為北
    const SRadAppa = asind(SRadReal / SDistRat); // 太陽半徑。爲何是正弦不是正切？？
    const MRadAppa = asind(MRadReal / MDistRat);
    const RadSum = SRadAppa + MRadAppa; // 併徑
    const Magni = ((100 * (RadSum - abs(Distappa))) / (SRadAppa * 2)).toFixed(
      1
    );
    if (+Magni < 1) return;
    /// ///// 【十二】初虧真時
    const ArcStartGreat = acosd(cosd(RadSum) / cosd(Distappa)); // 初虧復原距弧cosc = (cosa - sinbsinccosA) /cosb
    const AvgStartGreatDif = ArcStartGreat / MSAcrVhDif / 24; // 距時
    const SmdStartAvg = SmdAcr - AvgStartGreatDif; // 初虧用時
    const { EwCorr: StartEwCorr } = sunEcliJiaziMain(
      AcrSunGong - AcrEwCorr - ArcStartGreat,
      AcrSunEquaLon,
      SmdStartAvg
    );
    const StartGreatDif =
      (ArcStartGreat / (ArcStartGreat - (StartEwCorr - AcrEwCorr))) *
      AvgStartGreatDif; // 初虧距分.// 初虧視行：初虧食甚同在白平象限東，初虧東西差大則以差分減，小則以差分加 // 以初亏视行化秒为一率，初亏复圆距时化秒为二率，初亏复圆距弧化秒为三率，求得四率为秒，以时分收之得初亏距分
    const SmdStart = SmdAcr - StartGreatDif; // 初虧真時
    /// ///// 【十三】復圓真時
    const SmdEndAvg = SmdAcr + AvgStartGreatDif;
    const { EwCorr: EndEwCorr } = sunEcliJiaziMain(
      AcrSunGong - AcrEwCorr + ArcStartGreat,
      AcrSunEquaLon,
      SmdEndAvg
    );
    const EndGreatDif =
      (ArcStartGreat / (ArcStartGreat + (EndEwCorr - AcrEwCorr))) *
      AvgStartGreatDif; // 復圓食甚同在白平象限東，復圓東西差大則以差分加，小則以差分減
    const SmdEnd = SmdAcr + EndGreatDif;
    const GreatSLon = sunQing(Name, SunRoot, SperiRoot, SmdAcr).SunLon;
    return {
      Start: fix(deci(SmdStart)),
      Great: fix(deci(SmdAcr)),
      End: fix(deci(SmdEnd)),
      Magni,
      GreatSLon,
      GreatSEquaLon: LonHigh2Flat(Sobliq, GreatSLon),
      GreatSLat: HighLon2FlatLat(Sobliq, GreatSLon)
    };
  };
  const sunEcliGuimao = (NowSmd) => {
    // NowSmd = 205.528185 // ⚠️1730算例臨時
    /// ///// 【一】實朔用時。用時的英語暫且用Now
    /// ///// 【二】食甚實緯、食甚用時。這一段日月食都一樣
    const SunNow = sunQing(Name, SunRoot, SperiRoot, NowSmd);
    const MoonNow = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      NowSmd,
      SunNow.SunCorr,
      SunNow.SunGong,
      SunNow.Speri,
      SunNow.Sorb
    );
    const SunOnehAft = sunQing(Name, SunRoot, SperiRoot, NowSmd + 1 / 24);
    const MoonOnehAft = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      NowSmd + 1 / 24,
      SunOnehAft.SunCorr,
      SunOnehAft.SunGong,
      SunOnehAft.Speri,
      SunOnehAft.Sorb
    );
    // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
    const AngEquiWhite = qiexian(
      SunOnehAft.SunGong - SunNow.SunGong,
      MoonOnehAft.Whitegong - MoonNow.Whitegong,
      MoonNow.Mobliq
    ).Ashort; // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
    const AngEquiEclp = MoonNow.Mobliq + AngEquiWhite; // 斜距黃道交角
    const DistrealAvg = abs(cosd(AngEquiEclp) * MoonNow.MoonLat); // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
    const EquiVd =
      (((SunOnehAft.SunGong - SunNow.SunGong) * sind(MoonNow.Mobliq)) /
        sind(AngEquiWhite)) *
      24; // 一小時兩經斜距*24. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA。此處我*24，從一小時速度變成一天
    const ArcGreatNow = abs(sind(AngEquiEclp) * MoonNow.MoonLat); // 食甚距弧
    const GreatNowDif = (f3(MoonNow.Whitelongi) * ArcGreatNow) / EquiVd; // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
    const SmdAvg = NowSmd + GreatNowDif; // 食甚用時
    // const SmdAvg = 205.527765625 // ⚠️臨時
    const SunAvg = sunQing(Name, SunRoot, SperiRoot, SmdAvg);
    const MoonAvg = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      SmdAvg,
      SunAvg.SunCorr,
      SunAvg.SunGong,
      SunAvg.Speri,
      SunAvg.Sorb
    );
    /// ///// 【三】地平高下差、日月視徑
    const AcrSorb = SunNow.Sorb + SunAvg.SunCorr; // 太陽實引：實朔引數+-本時太陽均數
    const AcrMorb = MoonNow.Morb + MoonAvg.Corr1; // 太陰實引
    const MDist = distEllipseA(AcrMorb, MoonNow.MoonC);
    const HorizonParallax = 3450 / 3600 / MDist - 10 / 3600; // 地平高下差=太陰在地平上最大地半徑差（中距57分30秒）-太陽地半徑差
    const SunAcrRad = 966 / 3600 / distEllipseA(AcrSorb, 0.0169) - 15 / 3600; // 太陽實半徑=太陽視半徑（中率16分6秒）-光分15秒
    const MoonRad = 940.5 / 3600 / MDist; // 太陰視半徑（中率15分40秒30微）
    const RadSum = SunAcrRad + MoonRad; // 併徑
    /// ///// 【四】食甚太陽黃赤經緯宿度、黃赤二經交角
    const AvgGreatSLon = fm360(
      SunAvg.SunLon + GreatNowDif * (SunOnehAft.SunGong - SunAvg.SunGong) * 24
    ); // 食甚太陽黃道經度=實朔太陽黃道實行+距時日實行
    const AvgGreatSEquaLon = LonHigh2Flat(Sobliq, AvgGreatSLon);
    const AvgGreatSEquaGong = Lon2Gong(AvgGreatSEquaLon); // 自冬至初宮起算，得食甚太陽赤道經度。
    const AvgGreatSLat = HighLon2FlatLat(Sobliq, AvgGreatSLon); // 食甚太陽赤道緯度。食甚太陽距春秋分黃經之正弦：三率。
    const AngSunPolar = 90 - AvgGreatSLat; // 太陽距北極
    const AngZenithPolar = 90 - RiseLat; // 北極距天頂
    const AngEclpEqua =
      (AvgGreatSEquaGong > 180 ? 180 : 0) -
      acotd(cotd(Sobliq) / cosd(AvgGreatSLon)); // 黃赤二經交角。自變量：太陽距春秋分黃經。冬至後黃經在赤經西，夏至後黃經在赤經東。⚠️我定義東正西負。此步已核驗
    const AngWhiteEclp =
      (MoonAvg.Whitelongi < 90 || MoonAvg.Whitelongi > 270 ? -1 : 1) *
      AngEquiEclp; // 實朔月距正交初宮十一宮，白經在黃經西，五宮六宮白經在黃經東
    const AngWhiteEqua = AngEclpEqua + AngWhiteEclp; // 赤白二經交角。所得爲白經在赤經之東西。
    /// ///// 【五】食甚用時兩心視距
    const flag3 = (
      AngWhiteHigharcAcr0,
      FlagDistrealAsm,
      FlagDistrealAcr0,
      AngWhiteHigharcAsm,
      AngDistrealAsm
    ) => {
      let flag = 1;
      AngWhiteHigharcAcr0 = t2(AngWhiteHigharcAcr0); // ⚠️暫時這樣處理。1646-1649都有大於180的情況
      // if (abs(AngWhiteHigharcAcr0) > 180) throw new Error("真時白經高弧交角大於180")
      // else
      if (abs(AngWhiteHigharcAcr0) < 90) {
        if (MoonAvg.Whitelongi < 180) {
          if (FlagDistrealAsm !== FlagDistrealAcr0) flag = -1;
          else if (sign(AngWhiteHigharcAcr0) !== FlagDistrealAcr0) {
            if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1; // 設時白經高弧交角小則加，大則減。⚠️暫定「小」是小於設時對實距角
          } else if (abs(AngWhiteHigharcAsm) < AngDistrealAsm) flag = -1;
        } else if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1;
      } else if (MoonAvg.Whitelongi > 180) {
        if (FlagDistrealAsm !== FlagDistrealAcr0) flag = -1;
        else if (sign(AngWhiteHigharcAcr0) !== FlagDistrealAcr0) {
          if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1;
        } else if (abs(AngWhiteHigharcAsm) < AngDistrealAsm) flag = -1;
      } else if (abs(AngWhiteHigharcAsm) > AngDistrealAsm) flag = -1;
      return flag;
    }; // 見符號7
    const distAppa = (Smd, Distreal, AngArc) => {
      AngArc = abs(AngArc) || 0;
      const { AngA: AngEquaHigharc, c: AngSunZenith } = aCtimeb_Sph(
        AngZenithPolar,
        AngSunPolar,
        Smd
      ); // 赤經高弧交角
      const Parallax = HorizonParallax * sind(AngSunZenith); // 高下差
      const AngWhiteHigharc = t2(AngEquaHigharc + AngWhiteEqua); // 白經高弧交角⚠️暫時這樣處理
      let AngDistappa = abs(AngWhiteHigharc) - AngArc; // 對兩心視距角
      let FlagDistreal = 1;
      // if (abs(AngWhiteHigharc) > 180) throw new Error("白經高弧交角大於180")
      // else
      if (abs(AngWhiteHigharc) < 90) {
        if (MoonAvg.Whitelongi < 180) {
          if (AngDistappa > 0) FlagDistreal = sign(AngWhiteHigharc);
          else FlagDistreal = -sign(AngWhiteHigharc);
        } else {
          AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc);
          FlagDistreal = -sign(AngWhiteHigharc);
        }
      } else if (MoonAvg.Whitelongi > 180) {
        if (AngDistappa > 0) FlagDistreal = sign(AngWhiteHigharc);
        else FlagDistreal = -sign(AngWhiteHigharc);
      } else {
        AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc);
        FlagDistreal = -sign(AngWhiteHigharc);
      }
      AngDistappa = abs(AngDistappa);
      const AngDistreal = qiexianA(Distreal, Parallax, AngDistappa); // 對兩心實距角
      const Distappa = abs((sind(AngDistappa) * Distreal) / sind(AngDistreal)); // 兩心視距
      return { AngWhiteHigharc, FlagDistreal, AngDistreal, Distappa };
    };
    const distAppa2 = (Smd, Distreal, AngArc, flag) => {
      AngArc = abs(AngArc) || 0;
      const { AngA: AngEquaHigharc, c: AngSunZenith } = aCtimeb_Sph(
        AngZenithPolar,
        AngSunPolar,
        Smd
      ); // 赤經高弧交角
      const Parallax = HorizonParallax * sind(AngSunZenith); // 高下差
      const AngWhiteHigharc = t2(AngEquaHigharc + AngWhiteEqua); // 白經高弧交角⚠️暫時這樣處理
      let AngDistappa = abs(AngWhiteHigharc) + AngArc; // 對兩心視距角
      if (abs(AngWhiteHigharc) < 90) {
        if (MoonAvg.Whitelongi < 180) {
          if (sign(AngWhiteHigharc) !== flag)
            AngDistappa = abs(AngWhiteHigharc) - AngArc;
        } else if (sign(AngWhiteHigharc) === flag)
          AngDistappa = 180 - (abs(AngWhiteHigharc) - AngArc);
        else if (sign(AngWhiteHigharc) !== flag)
          AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc);
      } else if (MoonAvg.Whitelongi > 180) {
        if (sign(AngWhiteHigharc) !== flag)
          AngDistappa = abs(AngWhiteHigharc) - AngArc;
      } else if (sign(AngWhiteHigharc) === flag)
        AngDistappa = 180 - (abs(AngWhiteHigharc) - AngArc);
      else if (sign(AngWhiteHigharc) !== flag)
        AngDistappa = 180 - (abs(AngWhiteHigharc) + AngArc);
      AngDistappa = abs(AngDistappa);
      const AngDistreal = qiexianA(Distreal, Parallax, AngDistappa); // 對兩心實距角
      return abs((sind(AngDistappa) * Distreal) / sind(AngDistreal)); // 兩心視距
    };
    const {
      AngWhiteHigharc: AngWhiteHigharcAvg,
      FlagDistreal: FlagDistrealAvg,
      AngDistreal: AngDistrealAvg,
      Distappa: DistappaAvg
    } = distAppa(SmdAvg, DistrealAvg); // 見符號3
    /// ///// 【六】食甚設時兩心視距、食甚真時
    const AsmAvgDif = -(((AngWhiteHigharcAvg / 180) * 8.8) / 96 + 0.2 / 96); // 設時距分
    // const AsmAvgDif = (20 / 60 + 1.05 / 3600) / 24 // ⚠️
    const SmdAsm = SmdAvg + AsmAvgDif; // 食甚設時。東向前取，西向後取，角大遠取，角小近取（遠不過九刻，近或數分）
    // const SmdAsm = 205 + 13 / 24 // ⚠️
    const ArcAvgAsm = EquiVd * AsmAvgDif; // 設時距弧
    const AngArcAvgAsm = atand(ArcAvgAsm / DistrealAvg); // 設時對距弧角
    const DistrealAsm = abs(ArcAvgAsm / sind(AngArcAvgAsm)); // 設時兩心實距
    const {
      AngWhiteHigharc: AngWhiteHigharcAsm,
      FlagDistreal: FlagDistrealAsm,
      AngDistreal: AngDistrealAsm,
      Distappa: DistappaAsm
    } = distAppa(SmdAsm, DistrealAsm, AngArcAvgAsm); // 見符號4
    const AngHigharcAsm_DistappaAvg = abs(
      abs(AngWhiteHigharcAsm - AngWhiteHigharcAvg) +
        (SunAvg.SunLon < 180 ? -1 : 1) * AngDistrealAvg
    ); // 設時高弧交用時視距角
    let flag2 = 1;
    let flag4 = 1;
    let flag5 = 1;
    let flag6 = 1;
    if (FlagDistrealAsm === FlagDistrealAvg) flag2 = -1; // 見符號5
    const AngDistMovingAsm = t2(
      abs(AngHigharcAsm_DistappaAvg + flag2 * AngDistrealAsm)
    ); // 對設時視行角
    const AngDistappaAsm = qiexianA(DistappaAsm, DistappaAvg, AngDistMovingAsm); // 對設時視距角
    const DistMovingAsm =
      (sind(AngDistMovingAsm) / sind(AngDistappaAsm)) * DistappaAsm; // 設時視行
    const DistMovingAcr0 = DistappaAvg * cosd(AngDistappaAsm); // 真時視行
    const Acr0AvgDif =
      -sign(AngWhiteHigharcAvg) *
      abs((DistMovingAcr0 * AsmAvgDif) / DistMovingAsm); // 真時距分
    const SmdAcr0 = SmdAvg + Acr0AvgDif; // 食甚真時
    /// ///// 【七】食甚考定真時、食分
    const ArcAcr0AvgDif = Acr0AvgDif * EquiVd; // 真時距弧
    const AngArcAvgAcr0 = atand(ArcAcr0AvgDif / DistrealAvg); // 真時對距弧角
    const DistrealAcr0 = abs(ArcAcr0AvgDif / sind(AngArcAvgAcr0)); // 真時兩心實距
    const {
      AngWhiteHigharc: AngWhiteHigharcAcr0,
      FlagDistreal: FlagDistrealAcr0,
      AngDistreal: AngDistrealAcr0,
      Distappa: DistappaAcr1
    } = distAppa(SmdAcr0, DistrealAcr0, AngArcAvgAcr0); // 真時對視距角法與設時同
    const AngHigharcAcr0_DistappaAsm = abs(
      abs(AngWhiteHigharcAcr0 - AngWhiteHigharcAsm) +
        flag3(
          AngWhiteHigharcAcr0,
          FlagDistrealAsm,
          FlagDistrealAcr0,
          AngWhiteHigharcAsm,
          AngDistrealAsm
        ) *
          AngDistrealAsm
    ); // 真時高弧交設時視距角
    if (FlagDistrealAcr0 === FlagDistrealAsm) flag4 = -1;
    const AngDistMovingAcr1 = t2(
      abs(AngHigharcAcr0_DistappaAsm + flag4 * AngDistrealAcr0)
    ); // 對考真時視行角
    const AngDistappaAcr1 = qiexianA(
      DistappaAcr1,
      DistappaAsm,
      AngDistMovingAcr1
    ); // 對考真時視距角
    const DistMovingAcr1 =
      (sind(AngDistMovingAcr1) / sind(AngDistappaAcr1)) * DistappaAcr1; // 考真時視行
    const DistMovingAcr = DistappaAsm * cosd(AngDistappaAcr1); // 定真時視行
    const DistappaAcr = DistappaAsm * sind(AngDistappaAcr1); // 定真時兩心視距
    let AcrAsmDif =
      (DistMovingAcr * (abs(AsmAvgDif) - abs(Acr0AvgDif))) / DistMovingAcr1; // 定真時距分。白經在高弧東，設時距分小爲減；白經在高弧西，設時距分小爲加。
    if (AngWhiteHigharcAcr0 < 0) AcrAsmDif = -AcrAsmDif;
    const SmdAcr = SmdAsm + AcrAsmDif;
    const Magni = ((100 * (RadSum - DistappaAcr)) / (SunAcrRad * 2)).toFixed(1);
    if (+Magni < 1) return;
    /// ///// 【八】初虧前設時兩心視距
    let SmdBefStartAsm = 0;
    let SmdBefEndAsm = 0;
    if (AngWhiteHigharcAcr0 < 0) {
      if (DistappaAvg < RadSum) flag5 = -1;
      SmdBefStartAsm =
        SmdAvg + flag5 * (abs(DistappaAvg - RadSum) / EquiVd + 0.01); // 初虧前設時
      SmdBefEndAsm = SmdAcr + abs(SmdBefStartAsm - SmdAcr); // 復圓前設時
    } else {
      if (DistappaAvg > RadSum) flag5 = -1;
      SmdBefEndAsm =
        SmdAvg + flag5 * (abs(DistappaAvg - RadSum) / EquiVd + 0.01); // 復圓前設時
      SmdBefStartAsm = SmdAcr - abs(SmdBefEndAsm - SmdAcr); // 初虧前設時
    }
    // SmdBefStartAsm = 205.46111111111 // ⚠️
    const startEnd = (SmdBefStartAsm, isEnd) => {
      const AvgBefStartAsmDif = abs(SmdAvg - SmdBefStartAsm); // 初虧前設時距分
      const ArcBefStartAsm = AvgBefStartAsmDif * EquiVd; // 初虧前設時距弧
      const AngArcBefStartAsm = atand(ArcBefStartAsm / DistrealAvg); // 初虧前設時對距弧角
      let flagAngArcBefStartAsm = 1;
      if (SmdBefStartAsm < SmdAvg) flagAngArcBefStartAsm = -1; // 初虧前設時在食甚用時前為西
      const DistrealBefStartAsm = ArcBefStartAsm / sind(AngArcBefStartAsm); // 初虧前設時兩心實距
      const DistappaBefStartAsm = distAppa2(
        SmdBefStartAsm,
        DistrealBefStartAsm,
        AngArcBefStartAsm,
        flagAngArcBefStartAsm
      ); // 見符號8
      /// ///// 【九】初虧後設時兩心視距
      if (DistappaBefStartAsm < RadSum) flag6 = -1;
      const SmdAftStartAsm =
        SmdBefStartAsm +
        flag6 * (abs(DistappaBefStartAsm - RadSum) / EquiVd + 0.003); // 初虧後設時
      // const SmdAftStartAsm = 205.4638888889 // ⚠️
      const AvgAftStartAsmDif = abs(SmdAvg - SmdAftStartAsm);
      const ArcAftStartAsm = AvgAftStartAsmDif * EquiVd; // 初虧前設時距弧
      const AngArcAftStartAsm = atand(ArcAftStartAsm / DistrealAvg); // 初虧前設時對距弧角
      let flagAngArcAftStartAsm = 1;
      if (SmdAftStartAsm < SmdAvg) flagAngArcAftStartAsm = -1; // 初虧前設時在食甚用時前為西
      const DistrealAftStartAsm = ArcAftStartAsm / sind(AngArcAftStartAsm); // 初虧前設時兩心實距
      const DistappaAftStartAsm = distAppa2(
        SmdAftStartAsm,
        DistrealAftStartAsm,
        AngArcAftStartAsm,
        flagAngArcAftStartAsm
      );
      /// ///// 【十】初虧考定真時
      const StartDistappaDif = abs(DistappaBefStartAsm - DistappaAftStartAsm); // 初虧視距較
      const StartBefAftDif = abs(AvgBefStartAsmDif - AvgAftStartAsmDif); // 初虧設時較
      const StartDistappaRadSumDif = abs(RadSum - DistappaAftStartAsm); // 初虧視距併徑較
      let flag = DistappaAftStartAsm > RadSum ? 1 : -1;
      if (isEnd) flag = -flag;
      const AftStartAcrDif =
        (flag * StartDistappaRadSumDif * StartBefAftDif) / StartDistappaDif;
      return SmdAftStartAsm + AftStartAcrDif; // 初虧真時。此處就不再迭代求定真時了，不用那麼麻煩
    };
    const SmdStart = startEnd(SmdBefStartAsm, false);
    /// ///// 【十一】復圓前設時兩心視距
    const SmdEnd = startEnd(SmdBefEndAsm, true);
    const GreatSLon = sunQing(Name, SunRoot, SperiRoot, SmdAcr).SunLon;
    return {
      Start: fix(deci(SmdStart)),
      Great: fix(deci(SmdAcr)),
      End: fix(deci(SmdEnd)),
      Magni,
      GreatSLon,
      GreatSEquaLon: LonHigh2Flat(Sobliq, GreatSLon),
      GreatSLat: HighLon2FlatLat(Sobliq, GreatSLon)
    };
  };
  const moonEcliJiazi = (
    NowSmd,
    AcrWhitelongi,
    AcrMorb,
    AcrMoonCorr1,
    AcrSorb,
    AcrSunLon
  ) => {
    // 1949算例AcrWhitelongi：177.3276
    const SDistMax = 1.0179208;
    const SDistRatMax = 1162; // 太陽最高距地，地半徑比例數
    const MDistMax = 1.01725;
    const MDistRatMax = 58.16;
    const MRadReal = 0.27;
    const SlRad = 6.37; // 太陽光分半徑
    const Mobliq0116 = 4.975; // 朔望黃白大距
    /// ///// 【八】食甚距緯、食甚時刻
    const Distreal = HighLon2FlatLat(Mobliq0116, AcrWhitelongi); // 食甚距緯：太陰距地心之白緯 // 1949算例0.2316638889
    const GreatWhitelongi = LonHigh2Flat(Mobliq0116, AcrWhitelongi); // 食甚交周：太陰距正交之白經
    const Dif = GreatWhitelongi - AcrWhitelongi; // 交周升度差。1949算例36.49″=0.01013611111
    const OnehAftMoonCorr1 = corrRingC(MorbVd / 24 + AcrMorb, 0.0435).Corr;
    const MSAcrVhDif = MSAvgVdDif / 24 + OnehAftMoonCorr1 - AcrMoonCorr1; // 一小時月距日實行
    const GreatSmd = NowSmd + Dif / MSAcrVhDif / 24; // 實望實交周五宮十一宮（交前）爲加，初宮六宮（交後）爲減。食甚時刻=實望用時+-食甚距時
    /// ///// 【九】食分
    const SDistRat = (sunCorrQing(Name, AcrSorb).d / SDistMax) * SDistRatMax; // 太陽距地：太陽距地心與地半徑之比例
    const MDistRat =
      ((corrRingC(AcrMorb, 0.0435).d - 0.01175) / MDistMax) * MDistRatMax; // 還要減去次均輪半徑
    const MRadAppa = atand(MRadReal / MDistRat); // 算例16′52.97″=0.28138
    const ShadowLeng = SDistRat / (SlRad - 1); // 地影長
    const ShadowCone = asind(1 / ShadowLeng); // 地影角
    const ShadowWid = tand(ShadowCone) * (ShadowLeng - MDistRat); // 月所當地影之濶
    const ShadowRad = atand(ShadowWid / MDistRat); // （從地球看的）地影半徑 // 1949算例46′24.78″=0.77355
    const RadSum = MRadAppa + ShadowRad; // 併徑
    const Magni = ((100 * (RadSum - abs(Distreal))) / (MRadAppa * 2)).toFixed(
      1
    );
    if (+Magni < 1) return;
    /// ///// 【十】初虧復原時刻
    const ArcStartGreat = LonHigh2FlatB(Distreal, RadSum); // 初虧復圓距弧，同於正弧三角形有黃道、距緯求赤道，第五則
    const T_StartGreat = ArcStartGreat / MSAcrVhDif / 24; // 初虧復圓距時
    /// ///// 【十二】太陰經緯宿度
    const Dif2 =
      sign(Dif) *
      abs(LonHigh2Flat(Mobliq0116, GreatWhitelongi) - GreatWhitelongi); // 黃白升度差。食甚距時加者亦爲加
    const GreatMLon = (AcrSunLon + Dif + Dif2 + 180) % 360; // 加減食甚距弧（是Dif嗎？？），再加黃白升度差
    const GreatMLat = HighLon2FlatLat(Mobliq0116, GreatWhitelongi);
    const { EquaLon: GreatMEquaLon, EquaLat: GreatMEquaLat } = eclp2Equa(
      Sobliq,
      GreatMLon,
      GreatMLat
    );
    return {
      Start: fix(deci(GreatSmd - T_StartGreat)),
      End: fix(deci(GreatSmd + T_StartGreat)),
      Great: fix(deci(GreatSmd)),
      Magni,
      GreatMLon,
      GreatMLat,
      GreatMEquaLon,
      GreatMEquaLat
    };
  };
  const moonEcliGuimao = (NowSmd) => {
    const MoonParallaxMidMax = 0.95833333333333; // 太陰中距最大地半徑差 57分30秒
    const MoonRadMid = 0.26125; // 940.5 / 3600
    const SunRadMid = 0.26833333333333; // 中距太陽視半徑16分6秒
    const SunParallax = 0.00277777777778; // 10秒
    /// ///// 【一】實望用時
    /// ///// 【二】食甚實緯、食甚時刻
    const SunNow = sunQing(Name, SunRoot, SperiRoot, NowSmd);
    const SunOnehAft = sunQing(Name, SunRoot, SperiRoot, NowSmd + 1 / 24);
    const MoonNow = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      NowSmd,
      SunNow.SunCorr,
      SunNow.SunGong,
      SunNow.Speri,
      SunNow.Sorb
    );
    const MoonOnehAft = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      NowSmd + 1 / 24,
      SunOnehAft.SunCorr,
      SunOnehAft.SunGong,
      SunOnehAft.Speri,
      SunOnehAft.Sorb
    );
    // 斜距交角差。本時此時二月離白道實行相減，得一小時太陰白道實行——「本時」應該是實望用時
    const AngEquiWhite = qiexian(
      SunOnehAft.SunGong - SunNow.SunGong,
      MoonOnehAft.Whitegong - MoonNow.Whitegong,
      MoonNow.Mobliq
    ).Ashort; // 斜距交角差（斜距黃道交角與黃白交角之差，也就是斜距與白道交角。暫且將斜距稱為equilibrium）
    const AngEquiEclp = MoonNow.Mobliq + AngEquiWhite; // 斜距黃道交角
    const Dist = abs(cosd(AngEquiEclp) * MoonNow.MoonLat); // 食甚實緯，即食甚兩心實距，南北與兩心實望黃道實緯同。
    const EquiVd =
      (((SunOnehAft.SunGong - SunNow.SunGong) * sind(MoonNow.Mobliq)) /
        sind(AngEquiWhite)) *
      24; // 一小時兩經斜距. 已知邊角邊，求另一邊c：sinA=h/c, sinC=h/a, 得c=asinC/sinA
    const ArcGreatNow = abs(sind(AngEquiEclp) * MoonNow.MoonLat); // 食甚距弧
    const GreatNowDif =
      ((MoonNow.Whitelongi % 180 < 90 ? -1 : 1) * ArcGreatNow) / EquiVd; // 食甚距時。月距正交初宮六宮為減，五宮十一宮為加
    const GreatSmd = NowSmd + GreatNowDif;
    const SunGreat = sunQing(Name, SunRoot, SperiRoot, GreatSmd);
    const MoonGreat = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      GreatSmd,
      SunGreat.SunCorr,
      SunGreat.SunGong,
      SunGreat.Speri,
      SunGreat.Sorb
    );
    /// ///// 【三】食分
    const AcrMorb = MoonNow.Morb + MoonGreat.Corr1;
    const AcrSorb = SunNow.Sorb + SunGreat.SunCorr;
    const MDist = distEllipseA(AcrMorb, MoonNow.MoonC);
    const MoonParallax = MoonParallaxMidMax / MDist; // 太陰地半徑差。此一弧度代正弦算。
    const SunRad = SunRadMid / distEllipseA(AcrSorb, 0.0169); // 太陽視半徑。
    const ShadowRad = MoonParallax + SunParallax - SunRad + MoonParallax / 69; // 實影半徑=月半徑差+日半徑差-日半徑+影差。太陽地半徑差10秒。
    const MoonRad = MoonRadMid / MDist; // 太陰視半徑
    const RadSum = MoonRad + ShadowRad; // 併徑——也就是出現月食的最大極限
    // const RadDif = MoonRad - ShadowRad // 兩徑較
    const Magni = ((100 * (RadSum - Dist)) / (MoonRad * 2)).toFixed(1); // 若食甚實緯大於併徑，則月與地影不相切，則不食，即不必算。上編卷七：併徑大於距緯之較，即爲月食之分
    if (+Magni < 1) return;
    /// ///// 【四】初虧復圓時刻
    const ArcStartGreat = sqr((RadSum + Dist) * (RadSum - Dist)); // 初虧復圓距弧。就是直角三角形已知兩邊
    const T_StartGreat = ArcStartGreat / EquiVd; // 初虧復圓距時
    /// ///// 【五】食既生光時刻
    /// ///// 【六】食甚太陰黃道經緯宿度
    const LengGreatNow =
      GreatNowDif * (MoonOnehAft.Whitegong - MoonNow.Whitegong) * 24; // 距時月實行
    const GreatWhitelongi = MoonNow.Whitelongi + LengGreatNow; // 食甚月距正交
    const { MoonLon: GreatMLon, MoonLat: GreatMLat } = White2Eclp(
      MoonNow.Mobliq,
      MoonNow.Node,
      GreatWhitelongi
    );
    /// ///// 【七】食甚太陰赤道經緯宿度
    const { EquaLon: GreatMEquaLon, EquaLat: GreatMEquaLat } =
      moonEclp2EquaGuimao(Sobliq, GreatMLon, GreatMLat);
    return {
      Start: fix(deci(GreatSmd - T_StartGreat)),
      End: fix(deci(GreatSmd + T_StartGreat)),
      Great: fix(deci(GreatSmd)),
      Magni,
      GreatMLon,
      GreatMLat,
      GreatMEquaLon,
      GreatMEquaLat
    };
  };
  const iteration = (Smd, step, isNewm) => {
    // 後編迭代求實朔實時
    let {
      Speri: SperiBef,
      Sorb: SorbBef,
      SunCorr: SunCorrBef,
      SunLon: SunLonBef,
      SunGong: SunGongBef
    } = sunQing(Name, SunRoot, SperiRoot, Smd - step); // 如實望泛時爲丑正二刻，則以丑正初刻爲前時，寅初初刻爲後時——為什麼不說前後一時呢
    const { MoonLon: MoonLonBef } = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      Smd - step,
      SunCorrBef,
      SunGongBef,
      SperiBef,
      SorbBef
    );
    SunLonBef += isNewm ? 0 : 180;
    SunLonBef %= 360;
    let {
      Speri: SperiAft,
      Sorb: SorbAft,
      SunCorr: SunCorrAft,
      SunLon: SunLonAft,
      SunGong: SunGongAft
    } = sunQing(Name, SunRoot, SperiRoot, Smd + step);
    const { MoonLon: MoonLonAft } = moonGuimao(
      Name,
      MoonRoot,
      NodeRoot,
      MapoRoot,
      Smd + step,
      SunCorrAft,
      SunGongAft,
      SperiAft,
      SorbAft
    );
    SunLonAft += isNewm ? 0 : 180;
    SunLonAft %= 360;
    const Deci =
      deci(Smd) -
      step +
      (fm360(SunLonBef - MoonLonBef) /
        (fm360(MoonLonAft - MoonLonBef) - fm360(SunLonAft - SunLonBef))) *
        step *
        2; // 一小時月距日實行
    return Math.trunc(Smd) + Deci; // 實朔實時距冬至次日的時間
  };
  const term = (i, isMid) => {
    const TermGong = ((2 * i + (isMid ? 2 : 1)) * 15) % 360;
    const TermSmd = (i + (isMid ? 1 : 0.5)) * TermLeng - (1 - SolsDeci);
    const TermSc = ScList[(SolsmorScOrder + Math.trunc(TermSmd)) % 60];
    const TermDeci = fix(deci(TermSmd));
    const TermSperiMidn = SperiRoot + SperiVd * Math.trunc(TermSmd);
    const TermSunCorr = sunCorrQing(Name, TermGong - TermSperiMidn).Corr;
    const AcrlineBSmd = TermSmd - TermSunCorr / SunAvgVd; // 下編之平氣推定氣法。算這步是為了確定注曆定氣是在哪天
    // 推節氣時刻法。沒有推逐日太陽宮度，為了少點麻煩，只用泛時本日次日，不考慮再昨天或明天的情況。與曆書相較密合。
    const SunTod = sunQing(Name, SunRoot, SperiRoot, Math.trunc(AcrlineBSmd));
    const SunMor = sunQing(
      Name,
      SunRoot,
      SperiRoot,
      Math.trunc(AcrlineBSmd) + 1
    );
    const Tod = SunTod.SunGong;
    const Mor = SunMor.SunGong;
    const AcrlineSmd =
      Math.trunc(AcrlineBSmd) +
      (TermGong - Tod + (TermGong === 0 ? 360 : 0)) / ((Mor - Tod + 360) % 360);
    const NowlineSmd =
      AcrlineSmd +
      timeAvg2Real(Name, Sobliq, Gong2Lon(TermGong), SunTod.SunCorr);
    const NowlineSc = ScList[(SolsmorScOrder + Math.trunc(NowlineSmd)) % 60];
    // const NowlineDeci = fix(deci(NowlineSmd), 3)
    const NowlineDeci = clockQingB(deci(NowlineSmd) * 100);
    const { Eclp: TermEclp, Equa: TermEqua } = mansQing(Name, Y, TermGong);
    // 再加上迭代。曆書用的本日次日比例法，少部分密合，大部分相差5-15分鐘。輸出的是視時
    const tmp =
      TermGong - sunQing(Name, SunRoot, SperiRoot, AcrlineSmd).SunGong; // 預防冬至0宮的問題
    const AcrSmd = AcrlineSmd + (abs(tmp) > 180 ? tmp + 360 : tmp) / SunAvgVd; // 迭代
    const NowSmd =
      AcrSmd +
      timeAvg2Real(
        Name,
        Sobliq,
        Gong2Lon(TermGong),
        sunQing(Name, SunRoot, SperiRoot, AcrSmd).SunCorr
      );
    const NowDeci = fix(deci(NowSmd), 3);
    return {
      TermSc,
      TermDeci,
      TermAcrSmd: NowlineSmd,
      TermAcrSc: NowlineSc,
      TermAcrDeci: NowlineDeci,
      TermNowDeci: NowDeci,
      TermEqua,
      TermEclp
    }; // 為了和古曆統一，此處改名
  };
  const main = (isNewm, LeapNumTerm) => {
    const AvgSc = [];
    const AvgDeci = [];
    const NowSc = [];
    const NowlineSmd = [];
    const NowlineDeci = [];
    const NowSmd = [];
    const NowDeci = [];
    const Eclp = [];
    const Equa = [];
    const TermSc = [];
    const TermDeci = [];
    const TermAcrSmd = [];
    const TermAcrSc = [];
    const TermAcrDeci = [];
    const TermNowDeci = [];
    const Term1Sc = [];
    const Term1Deci = [];
    const TermEqua = [];
    const TermEclp = [];
    const Term1AcrSmd = [];
    const Term1AcrSc = [];
    const Term1AcrDeci = [];
    const Term1NowDeci = [];
    const Term1Equa = [];
    const Term1Eclp = [];
    const Ecli = [];
    const Rise = [];
    // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
    for (let i = 0; i <= 14; i++) {
      /// ///// 平朔望
      // const AvgSmd = 212 // 1921算例
      const AvgSmd = ChouSmd + (i + (isNewm ? 0 : 0.5)) * Lunar; // 各月平朔望到冬至次日子正日分
      const AvgSmdMidn = Math.trunc(AvgSmd);
      AvgSc[i] = ScList[(SolsmorScOrder + AvgSmdMidn) % 60];
      AvgDeci[i] = fix(deci(AvgSmd));
      let AcrSmd = 0;
      let AcrlineDeci = 0;
      let AcrSunGong = 0;
      let AcrWhitelongi = 0;
      let AcrSunCorr = 0;
      let AcrMorb = 0;
      let AcrMoonCorr1 = 0;
      let AcrSorb = 0;
      // 月離曆法·推合朔弦望法：直接用本日次日太陽太陰實行求，但必須先確定本日次日是哪日
      let AcrlineSmdMidn = AvgSmdMidn;
      const acrlineDeci = (SmdMidn) => {
        const {
          Speri: SperiTod,
          Sorb: SorbTod,
          SunCorr: SunCorrTod,
          SunLon: SunLonTodRaw,
          SunGong: SunGongTod
        } = sunQing(Name, SunRoot, SperiRoot, SmdMidn);
        const { MoonLon: MoonLonTod } = moonQing(
          Name,
          MoonRoot,
          NodeRoot,
          MapoRoot,
          SmdMidn,
          SunCorrTod,
          SunGongTod,
          SperiTod,
          SorbTod
        );
        const SunLonTod = (SunLonTodRaw + (isNewm ? 0 : 180)) % 360;
        const {
          Speri: SperiMor,
          Sorb: SorbMor,
          SunCorr: SunCorrMor,
          SunLon: SunLonMorRaw,
          SunGong: SunGongMor
        } = sunQing(Name, SunRoot, SperiRoot, SmdMidn + 1);
        const { MoonLon: MoonLonMor } = moonQing(
          Name,
          MoonRoot,
          NodeRoot,
          MapoRoot,
          SmdMidn + 1,
          SunCorrMor,
          SunGongMor,
          SperiMor,
          SorbMor
        );
        const SunLonMor = (SunLonMorRaw + (isNewm ? 0 : 180)) % 360;
        return {
          MoonLonTod,
          SunLonTod,
          MoonLonMor,
          SunLonMor,
          AcrlineDeci:
            fm360(SunLonTod - MoonLonTod) /
            (fm360(MoonLonMor - MoonLonTod) - fm360(SunLonMor - SunLonTod))
        };
      };
      const {
        MoonLonTod,
        SunLonTod,
        MoonLonMor,
        SunLonMor,
        AcrlineDeci: AcrlineDeciTmp
      } = acrlineDeci(AvgSmdMidn);
      AcrlineDeci = AcrlineDeciTmp;
      if (fm360(MoonLonTod - SunLonTod) > 180) {
        if (fm360(MoonLonMor - SunLonMor) > 180) {
          // 如次日太陰實行仍未及太陽，則次日爲實朔日
          AcrlineSmdMidn++;
          AcrlineDeci = acrlineDeci(AcrlineSmdMidn).AcrlineDeci;
        }
      } else {
        // 如太陰實行未及太陽，則平朔日為實朔本日
        AcrlineSmdMidn--;
        AcrlineDeci = acrlineDeci(AcrlineSmdMidn).AcrlineDeci;
      }
      const AcrlineSmd = AcrlineSmdMidn + AcrlineDeci; // 用今明兩日線性內插注曆
      // 以下是交食用的精確朔望
      if (Name === "Guimao") {
        /// ///// 實朔望泛時。甲子元曆尚把注曆的朔望和交食的朔望分開，癸卯元曆就合一了。癸卯元求泛時是只固定用平朔望今明兩天，而甲子元則是選用定朔望今明兩天，此處我統一用甲子元的辦法
        /// ///// 實朔望實時
        const Acr0Smd = iteration(AcrlineSmd, 0.5 / 24, isNewm);
        AcrSmd = iteration(Acr0Smd, 0.1 / 24, isNewm); // 我再加一次迭代
        const {
          Speri: AcrSperi,
          Sorb: AcrSorbTmp,
          SunCorr: AcrSunCorrTmp,
          SunGong: AcrSunGongTmp
        } = sunQing(Name, SunRoot, SperiRoot, AcrSmd);
        AcrWhitelongi = moonGuimao(
          Name,
          MoonRoot,
          NodeRoot,
          MapoRoot,
          AcrSmd,
          AcrSunCorrTmp,
          AcrSunGongTmp,
          AcrSperi,
          AcrSorbTmp
        ).Whitelongi;
        AcrSunGong = AcrSunGongTmp;
        AcrSunCorr = AcrSunCorrTmp;
      } else {
        // 月食曆法·推實朔用時法
        // 原術是用首朔算（註釋算法）我直接改成積日
        // const AvgSunGong = (ChouSun + (i + (isNewm ? 0 : .5)) * SunAvgVm) % 360 // 平望太阳平行
        const AvgSunGong = fm360(SunRoot + AvgSmd * SunAvgVd);
        // const AvgSorb = (ChouSorb + (i + (isNewm ? 0 : .5)) * SorbVm) % 360 // 算例99°21′54.11″=99.3650305556
        const AvgSperi = SperiVd * AvgSmdMidn + SperiRoot;
        const AvgSorb = fm360(AvgSunGong - AvgSperi);
        const AvgMapo = MapoVd * AvgSmdMidn + MapoRoot;
        // const AvgMorb = (ChouMorb + i * MorbVm + (isNewm ? 0 : (MorbVm + 360) / 2)) % 360 // 1949算例200°22′05.77″=200.3682694444
        const AvgMoonGong = fm360(MoonRoot + AvgSmd * MoonAvgVd);
        const AvgMorb = fm360(AvgMoonGong - AvgMapo);
        const AvgSunCorr = sunCorrQing(Name, AvgSorb).Corr; // 平望太陽均數
        const AvgMoonCorr1 = corrRingC(AvgMorb, 0.0435).Corr; // 平望太陰均數.1949算例1°46′58.30″=1.7828611111
        const AvgT_MSDif = (AvgSunCorr - AvgMoonCorr1) / MSAvgVdDif; // 距時=距弧（日月相距之弧）/速度差。算例27m56s=0.01939814815
        AcrSorb = AvgSorb + AvgT_MSDif * SorbVd; // 太陽實引=平引+引弧。算例99°23′2.94″=99.38415
        AcrMorb = AvgMorb + AvgT_MSDif * MorbVd; // 太陰實引.1949算例200°37′18.14″=200.6217055556
        AcrSunCorr = sunCorrQing(Name, AcrSorb).Corr; // 太陽實均.1949算例2°01′15.89″=2.02108055556
        AcrMoonCorr1 = corrRingC(AcrMorb, 0.0435).Corr; // 太陰實均。1949算例1°48′14.36″=1.8039888889
        const AcrT_MSDif = (AcrSunCorr - AcrMoonCorr1) / MSAvgVdDif; // 實距時=實距弧/速度差。1949算例：25m39s=0.0178125
        AcrSmd = AvgSmd + AcrT_MSDif; // 實望
        const S_MoonPlusNode = AcrT_MSDif * MoonNodeVdSum; // 交周距弧
        // const AvgWhitelongi = (ChouWhitelongi + i * MoonNodeVmSum + (isNewm ? 0 : (MoonNodeVmSum + 360) / 2)) % 360
        const AvgWhitelongi = fm360(
          MoonRoot - NodeRoot + AvgSmd * MoonNodeVdSum
        );
        AcrWhitelongi = fm360(AvgWhitelongi + S_MoonPlusNode + AcrMoonCorr1); // 實望實交周=實望平交周（平望太陰交周+交周距弧）+太陰實均。1949算例：175°17′16.62″+14′8.34″+1°48′14.36″=177°19′39.36″，175.28795+0.23565+1.8039888889=177.327588889
        AcrSunGong = AvgSunGong + AcrT_MSDif * SunAvgVd + AcrSunCorr; // 太陽黃經=實望太陽平行（平望+太陽距弧（平望至實望太陽本輪心行度））+太陽實均 // 1949算例23°5′9.38″=23.08593888889
      }
      const AcrSunLon = Gong2Lon(AcrSunGong);
      const { SunCorr: SunCorrLineMidn, SunLon: SunLonLineMidn } = sunQing(
        Name,
        SunRoot,
        SperiRoot,
        AcrlineSmdMidn
      ); // 為了寫得方便，索性重算一遍
      NowlineSmd[i] =
        AcrlineSmd +
        (Name === "Guimao"
          ? timeAvg2Real(Name, Sobliq, SunLonLineMidn, SunCorrLineMidn)
          : 0); // 新法、永年、甲子的時差放在月離裡面
      // NowlineDeci[i] = fix(deci(NowlineSmd[i]), 3)
      NowlineDeci[i] = clockQingB(deci(NowlineSmd[i]) * 100);
      NowSmd[i] = AcrSmd + timeAvg2Real(Name, Sobliq, AcrSunLon, AcrSunCorr); // 朔望只有月離初均，沒有日差，所以都要加。不清楚新法的交食用那種日差
      NowSc[i] = ScList[(SolsmorScOrder + Math.trunc(NowSmd[i])) % 60];
      NowDeci[i] = fix(deci(NowSmd[i]), 3);
      const Func = mansQing(Name, Y, AcrSunGong);
      Eclp[i] = Func.Eclp;
      Equa[i] = Func.Equa;
      /// ///// 交食
      let isEcli = false; // 入食限可以入算
      const tmp = t3(AcrWhitelongi); // 距離0、180的度數
      if (isNewm)
        isEcli =
          AcrWhitelongi % 180 < 180
            ? tmp < SunLimitYinAcr
            : tmp < SunLimitYangAcr;
      else isEcli = tmp < MoonLimit;
      if (isEcli) {
        Rise[i] = sunRise(RiseLat, HighLon2FlatLat(Sobliq, AcrSunLon)).t0;
        if (isNewm) {
          if (
            deci(NowSmd[i]) < Rise[i] - 5 / 96 ||
            deci(NowSmd[i]) > 1 - Rise[i] + 5 / 96
          ) {
          } else if (Name === "Xinfa" || Name === "Yongnian")
            Ecli[i] = sunEcliJiazi(
              NowSmd[i],
              AcrWhitelongi,
              AcrMorb,
              AcrMoonCorr1,
              AcrSorb,
              AcrSunLon
            );
          else if (Name === "Jiazi")
            Ecli[i] = sunEcliJiazi(
              NowSmd[i],
              AcrWhitelongi,
              AcrMorb,
              AcrMoonCorr1,
              AcrSorb,
              AcrSunLon
            );
          else
            Ecli[i] = sunEcliGuimao(
              NowSmd[i],
              AcrWhitelongi,
              AcrMorb,
              AcrMoonCorr1,
              AcrSorb,
              AcrSunLon
            );
        } else if (
          deci(NowSmd[i]) > Rise[i] + 9 / 96 &&
          deci(NowSmd[i]) < 1 - Rise[i] - 9 / 96
        ) {
        } // 日出入前後9刻以內入算
        else if (Name === "Xinfa" || Name === "Yongnian")
          Ecli[i] = moonEcliJiazi(
            NowSmd[i],
            AcrWhitelongi,
            AcrMorb,
            AcrMoonCorr1,
            AcrSorb,
            AcrSunLon
          );
        else if (Name === "Jiazi")
          Ecli[i] = moonEcliJiazi(
            NowSmd[i],
            AcrWhitelongi,
            AcrMorb,
            AcrMoonCorr1,
            AcrSorb,
            AcrSunLon
          );
        else
          Ecli[i] = moonEcliGuimao(
            NowSmd[i],
            AcrWhitelongi,
            AcrMorb,
            AcrMoonCorr1,
            AcrSorb,
            AcrSunLon
          );
      }

      /// ///// 節氣
      if (isNewm) {
        const Func = term(i, true);
        TermSc[i] = Func.TermSc;
        TermDeci[i] = Func.TermDeci;
        TermAcrSmd[i] = Func.TermAcrSmd;
        TermAcrSc[i] = Func.TermAcrSc;
        TermAcrDeci[i] = Func.TermAcrDeci;
        TermNowDeci[i] = Func.TermNowDeci;
        TermEclp[i] = Func.TermEclp;
        TermEqua[i] = Func.TermEqua;
        const Func1 = term(i, false);
        Term1Sc[i] = Func1.TermSc;
        Term1Deci[i] = Func1.TermDeci;
        Term1AcrSmd[i] = Func1.TermAcrSmd;
        Term1AcrSc[i] = Func1.TermAcrSc;
        Term1AcrDeci[i] = Func1.TermAcrDeci;
        Term1NowDeci[i] = Func1.TermNowDeci;
        Term1Eclp[i] = Func1.TermEclp;
        Term1Equa[i] = Func1.TermEqua;
      }
    }
    /// ///// 置閏
    LeapNumTerm = LeapNumTerm || 0;
    if (isNewm) {
      for (let i = 1; i <= 12; i++) {
        if (
          Math.trunc(TermAcrSmd[i]) < Math.trunc(NowlineSmd[i + 1]) &&
          Math.trunc(TermAcrSmd[i + 1]) >= Math.trunc(NowlineSmd[i + 2])
        ) {
          LeapNumTerm = i; // 閏Leap月，第Leap+1月爲閏月
          break;
        }
      }
    }
    /// ///// 朔閏表信息
    const EcliPrint = [];
    for (let i = 1; i <= 13; i++) {
      let NoleapMon = i;
      if (LeapNumTerm) {
        if (i === LeapNumTerm + 1) NoleapMon = "閏";
        else if (i > LeapNumTerm + 1) NoleapMon = i - 1;
      }
      // 1738年NoleapMon會因為去年不閏而閏多一個月，暫時不想解決
      if (Ecli[i]) {
        if (isNewm) {
          EcliPrint[i] = [
            NoleapMon + "日食",
            Ecli[i].Magni,
            fix(Rise[i]),
            Ecli[i].Start,
            Ecli[i].Great,
            Ecli[i].End,
            fix(1 - Rise[i]),
            deg2Hms(Ecli[i].GreatSLon),
            "",
            deg2Hms(Ecli[i].GreatSEquaLon),
            lat2NS1(Ecli[i].GreatSLat)
          ];
        } else {
          EcliPrint[i] = [
            NoleapMon + "月食",
            Ecli[i].Magni,
            fix(1 - Rise[i]),
            Ecli[i].Start,
            Ecli[i].Great,
            Ecli[i].End,
            fix(Rise[i]),
            deg2Hms(Ecli[i].GreatMLon),
            lat2NS1(Ecli[i].GreatMLat),
            deg2Hms(Ecli[i].GreatMEquaLon),
            lat2NS1(Ecli[i].GreatMEquaLat)
          ];
        }
        if (Ecli[i].Magni >= 99) {
          NowSc[i] += "●";
        } else if (Ecli[i].Magni > 10) {
          NowSc[i] += "◐";
        } else if (Ecli[i].Magni > 0) {
          NowSc[i] += "◔";
        }
      }
    }
    return {
      AvgSc,
      AvgDeci,
      NowSc,
      NowlineSmd,
      NowlineDeci,
      NowDeci,
      NowSmd,
      Eclp,
      Equa,
      TermSc,
      TermDeci,
      TermAcrSc,
      TermAcrDeci,
      TermNowDeci,
      TermEqua,
      TermEclp,
      Term1Sc,
      Term1Deci,
      Term1AcrSmd,
      Term1AcrSc,
      Term1AcrDeci,
      Term1NowDeci,
      Term1Equa,
      Term1Eclp,
      EcliPrint,
      LeapNumTerm
    };
  };
  const {
    AvgSc: NewmAvgSc,
    AvgDeci: NewmAvgDeci,
    NowlineSmd: NewmNowlineSmd,
    NowlineDeci: NewmNowlineDeci,
    NowSc: NewmSc,
    NowDeci: NewmDeci,
    NowSmd: NewmSmd,
    Equa: NewmEqua,
    Eclp: NewmEclp,
    EcliPrint: SunEcli,
    TermSc,
    TermDeci,
    TermAcrSc,
    TermAcrDeci,
    TermNowDeci,
    TermEqua,
    TermEclp,
    Term1Sc,
    Term1Deci,
    Term1AcrSmd,
    Term1AcrSc,
    Term1AcrDeci,
    Term1NowDeci,
    Term1Equa,
    Term1Eclp,
    LeapNumTerm
  } = main(true);
  const {
    NowlineDeci: SyzygyNowlineDeci,
    NowSc: SyzygySc,
    NowDeci: SyzygyDeci,
    EcliPrint: MoonEcli
  } = main(false, LeapNumTerm);
  return {
    LeapNumTerm,
    NewmAvgSc,
    NewmAvgDeci,
    NewmSc,
    NewmNowlineSmd,
    NewmNowlineDeci,
    NewmDeci,
    NewmEqua,
    NewmEclp,
    SyzygySc,
    SyzygyNowlineDeci,
    SyzygyDeci,
    SunEcli,
    MoonEcli,
    TermSc,
    TermDeci,
    TermAcrSc,
    TermAcrDeci,
    TermNowDeci,
    TermEqua,
    TermEclp,
    Term1Sc,
    Term1Deci,
    Term1AcrSmd,
    Term1AcrSc,
    Term1AcrDeci,
    Term1NowDeci,
    Term1Equa,
    Term1Eclp,
    /// / 曆書用
    SunRoot,
    SperiRoot,
    MoonRoot,
    MapoRoot,
    NodeRoot,
    SolsAccum,
    MansDaySolsmor,
    NewmSmd,
    Sols,
    SolsmorScOrder
  };
};

// console.log(N4("Jiazi", -720)); 
// console.log(N4("Jiazi", -676)); // 《後編》卷三《日食食甚真時及兩心視距》葉64算例：1730六月日食，見說明文檔
// console.log(N4("Xinfa", -548)) // https://zhuanlan.zhihu.com/p/513322727 1949月食算例。1921月離算例https://zhuanlan.zhihu.com/p/512380296 。2009日食算例https://zhuanlan.zhihu.com/p/670820567
// console.log(sunQing(Name,SunRoot, SperiRoot,313)) // 日躔與這個驗算無誤 https://zhuanlan.zhihu.com/p/526578717 算例：Smd=313，SunRoot=0+38/60+26.223/3600，SperiRoot=166*(1/60+2.9975/3600)
// 月離與這個驗算無誤 https://zhuanlan.zhihu.com/p/527394104
// Sorb = 298 + 6 / 60 + 9.329 / 3600
// AcrMoon0 = 295.5279086111
// AvgMapo1 = 100.82456
// AvgNode1 = 95 + 42 / 60 + 47.522 / 3600
// SunCorr = -(1 + 43 / 60 + 6.462 / 3600)
// SunLon = 217 + 25 / 60 + 46.766 / 3600
// Speri = 281 + 2 / 60 + 43.899 / 3600 - 270

// 以下是三條月亮初均驗算
// console.log(Corr1(.04904625, 206 + 22 / 60 + 21.88 / 3600))
// 小均 4331900  +572,725
// 2+13/60+57/3600=2.2325// 6宮26度20分
// 2+14/60+46/3600=2.2461111111 +.0136111111 //30分
// 2.2325+.0136111111*.2=2.2352222222
// 中 5505050 +1173150
// 2+52/60+36/3600=2.8766666667// 6宮26度20分
// 2+53/60+39/3600=2.8941666667 +.0175// 2.8766666667+.0175*.2=2.8801666667
// 572,725/1173150=.4881941781. 2.8801666667-2.2352222222=.6449444445
// 結果2.5500803452
// console.log(Corr1(.0446505, 107 + 41 / 60 + 27 / 3600 + 22 / 216000)) // 《十月之交細草》卷上葉25, Corr = -(4 + 57 / 60 + 13 / 3600 + 19 / 216000)=-4.9536990741
// // 3宮17度
// 4+48/60+14/3600=4.8038888889
// 4+48/60+1/3600 =4.8002777778  -.0036111111。4.8035277778
// 6+7/60+43/3600=6.1286111111
// 6+7/60+27/3600=6.1241666667 -.0044444444。6.1281666667
// 13,315/117315=.1134978477。6.1281666667-4.8035277778=1.3246388889，4.8035277778+1.3246388889*.1134978477=4.9538714407
// console.log(Corr1(.0455941, 108 + 43 / 60)) // 考成後編表

// console.log(atand(cosd(23.9) * tand((340))))
// console.log(atand(.1328888016451028/sind(18.7)))

// console.log(32n % 5n)
