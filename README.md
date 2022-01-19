---
author: ["柯棋瀚"]
title: "曆藏（中國古曆編製器）說明"
date: 2021-02-24
lastmod: 2021-04-21
---

簡介
-----

1.  本工具的使用對象是古代天文曆法研究者。對於一般文史研究者，推薦使用頁腳的友情鏈接（當然，「時間」板塊的三個工具還是挺有用的）。
2.  目前的古代朔閏査詢網站都是根據工具書、文獻材料手動調整的（參考中研院 [兩千年中西曆轉換說明書](https://sinocal.sinica.edu.tw/lusodoc.html)，廖育棟 [本網站的農曆編算](https://ytliu0.github.io/ChineseCalendar/computation_chinese.html)）。本工具可提供古代實行未實行的 60 餘部曆法（包括我復原的 8 部魏晉南北朝曆法、2 部隋曆、3 部唐曆、5 部宋曆、1 部金曆）的計算，完全遵照各曆算法進行全自動計算，無手動干預。主要有三大功能區：
    1. 【朔閏表】每年的積年、冬至大小餘、閏餘；冬至時刻的入轉日、入交泛日、入週天度。各月定朔（線性內插、二次三次內插）、平朔，定朔時刻日月所在赤道度，定望，平氣、定氣、定氣日昏中星。日月食食甚時刻、食分。
    2. 【曆書】包含天文曆、具注曆兩部份。
       1. 天文曆：每日太陽赤經、極黃經宿度，日赤緯、日出時刻、正午晷長，月赤經、月赤緯。
       2. 具注曆：每年「術數年」積年、男女九宮，年干支五行、納音、魁罡之月，23 種歲神，年九宮色。每月月建、月神、吉時、月九宮色。每日干支、儒略日、公曆日期、納音五行、建除、黃道吉日黑道凶日、七星值日、二十八宿二十八禽值日，二十四節氣時刻、七十二候時刻、土王用事時刻、卦用事時刻，人神、日遊神、血支血忌，10 種日神。
    3. 【數學工具】包含同餘、方程、天文、時間四個板塊。
       1. 同餘：大衍求一術、解一次同餘式、大衍總數術，擬秦九韶調日法、淸人調日法三種、連分數，最大公因數、章蔀紀元法，古曆入元、秦九韶演紀法，從零開始造唐宋曆。
       2. 方程：九章算術開方術、累減開方術，二分迭代法解高次方程，隙積術芻童垛、三角垛落一形垛、四角垛方垛，招差術、拉格朗日內插，會圓術、弧矢割圓術、三斜求積術。
       3. 天文：日躔月離及誤差，太陽赤黃經轉換及誤差，太陽去極度、赤緯、日出、晷長及誤差，月亮極白經、赤經、極黃緯，現代天文任意時刻太陽高度、方位角、晷長。
       4. 時間：將萬分小數轉換爲辰刻，儒略日、日期轉換，公元年、年干支轉換。
3.  如您發現任何問題，可通過評論框或郵件向我反饋。本程序目前未經過文獻檢驗，且急就草創，錯漏叢生，**尙不能用於正式學術研究**。目前完全可靠的是古四分曆，可完全替代朱桂昌《顓頊日曆表》、《太初日曆表》、《後漢四分日曆表》三部大轉頭。若您在研究過程中發現程序結果與文獻不符，望不吝提供線索。這個工具是根據研究需要而開發的，如果您有任何功能需求，敬請與我聯繫，我會在力所能及的範圍內儘量實現。
4.  各時期曆法的行用情況見 [赫赫金鑰｜中國古代曆法史](https://kqh.me/tutorial/calendar4/)。
5.  編程理念：以研究需求爲中心；設計理念：以用戶體驗爲中心，傻瓜式操作。關於朔閏表表格的設計：採用加粗—正常——淺灰三層結構，用戶一眼就看到了定朔、平朔、平氣的干支，第二眼看到的是小分，最後看到的是不甚重要的昬中星。定朔平朔之間、定氣平氣之閒用細線，朔望氣之間用粗線。數字都用的等寬字體。每欄中間不設線，間隔恰到好處，不會太寬，讓視線跳躍得很累，也不會太緊，不易分辨。
6.  本工具完全開源，如您需要査詢、核査各曆的詳細參數與算法，請前往 [源碼倉庫](https://github.com/lzfcc/react-calendar/tree/kqh-main/src/Cal)。如您不嫌麻煩，可以下載源碼，在本地運行程序。更多技術特徵見開發者說明。【隱私聲明】本站使用了 Google Analytics 進行流量分析；評論系統採用 Hyvor Talk；服務器託管在 Netlify 平臺。運算均在本地瀏覽器進行。

## 开发者说明

### 1.

- 计算程序采用 JavaScript 编写
- 前端框架采用 React
- 本地框架为 Node。在本地运行本程序，需要安装 Node 13.2 以上版本
- 采用 Web Worker 将 UI 线程与计算线程分离
- 采用懒加载，大幅压缩渲染时间
- 采用 WebPack 打包
- 采用 [Decimal.js](https://mikemcl.github.io/decimal.js/) 进行大数字运算，采用 [nzh](https://blog.whyoop.com/nzh/docs) 进行阿拉伯数字、汉字转换

~~本仓库基于组件化、工程化的考量，将核心模块<n>计算逻辑</n>拆分到了单独的仓库<n>ancient-calendar</n>中，通过子模块进行依赖，从而前端展示<n>View</n>和计算逻辑<n>Model</n>可以独立开发，前端直接引用子模块的函数进行运算。~~

由于运算都在前端进行，在进行大量运算时会卡住 UI，体验较差。为了改进这一问题，我们决定改用 Web Worker<n>前端的多线程</n>。这样就必须将 `Worker()` 构造函数的参数文件独立放在 public 目录下<n>不能参与 webpack 打包</n>，因而不能直接引用子模块，必须将子模块打包成一个文件：

1. 全局安装 webpack，webpack-CLI
```shell
$ npm install -g webpack webpack-cli
```
2. 打包  main.js
```shell
$ webpack ./src/Cal/frontend-worker.js -o ./public
```
3. 

```shell
$ npm run build
```

### 2.

核心计算程序在 `/src/Cal` 目录下，有 10 个板块，各文件功能说明：

- `para_` 参数
  - `para_constant` 常量参数
  - `para_1` 四分魏晋南北系历法参数
  - `para_2` 隋唐宋元历法参数
- `newm_` 朔闰表模块
  - `newm` 朔闰计算
  - `newm_quar` 四分历朔闰计算
  - `newm_index` 朔闰计算汇总调整输出
- `day_` 历书模块
  - `day` 历书计算
  - `day_luck` 历书中岁神、日神的计算
- `modulo_` 同馀模块
  - `modulo_continued-frac` 分数连分数
  - `modulo_continued-frac1` 小数连分数
  - `modulo_denom` 调日法
  - `modulo_exhaustion` 从零开始造宋历
  - `modulo_gcdlcm` 最大公因数
  - `modulo_origin` 演纪
  - `modulo_qiuyi` 大衍求一术
- `equa_` 方程模块
  - `equa_geometry` 几何
  - `equa_high` 解高次方程
  - `equa_math` 数字格式转换
  - `equa_sn` 垛积
  - `equa_sqrt` 开方
- `astronomy_` 天文模块
  - `astronomy_acrv` 日月速度改正
  - `astronomy_deg2mansion` 黄赤道积度转换为入宿度
  - `astronomy_formula` 使用公式进行计算的历法，`astronomy_table` 使用表格进行计算的历法，`astronomy_west` 使用现代方法进行计算。包含黄赤转换、经纬转换、月亮坐标转换
- `time_` 时间模块
  - `time_decimal2clock` 日分转换为辰刻
  - `time_era` 年干支转换
  - `time_jd2date` 儒略日、日期转换
- `eclipse_` 交食
  - `eclipse_formula` 使用公式进行交食计算的历法
  - `eclipse_table` 使用表格进行交食计算的历法
- `bind_` 自动选择
  - `bind` 根据历法自动选择朔闰计算
  - `astronomy_bind` 根据历法自动选择天文计算
- 输出
  - `output` 输出准备
  - `print` 本地打印入口。`const printData = outputFile(2, 1255, 1255, 0` 第一个数字为模式，`1` 为朔闰表，`2` 为历书；第二三个数字为起始年、终止年；第四个数字为自动长历模式开关，目前暂不支持
  - `frontend-worker` Web Worker，朔闰表、历书两个模块的前端调用入口

## 命名規範

### 天文參數 Astronomy constants

- Solar 回歸年 solar year
- Sidereal 恆星年 sidereal year
- Lunar 朔望月 Synodic month
- Anoma 近點月 anoma month
- Node 交點月 node month
- SunLimit 日食食限
- MoonLimit 月食食限
- LeapLimit 閏限 The limit for arranging a leap
- Equa 赤道 equator
- Eclp 黃道 ecliptic
- Ecli 交食 eclipse
- Longi 經度 longitude
- Lati 緯度 latitude

### 變量 Variables

- Origin 上元以來的
- Winsols 冬至 winter solstice
- Newm 朔 new moon
- Syzygy 望 syzygy
- First 天正月，卽冬至所在月 The month in which the winter solstice falls
- Zheng 正月，建正
- LeapSur 閏餘 leap surplus
- GreatSur 大餘，干支的整數部分
- SmallSur 小餘，干支的小數部分
- LeapNumTerm 無中氣置閏法的閏月
- Duskstar 昬中星
- Accum 積日。OriginAccum 上元至年前冬至積日 AnomaAccum 入轉日 NodeAccum 入交日

### 常量 Constants

- Sc 干支 sexagenary cycle 
- Stem 天干
- Branch 地支
- CalName 曆法名 calendar name
- Hexagram 八卦
- Mansion 宿
- MoonGod 月神
- ManGod 人神

### 時間長度

- Leng 長度 length
- Range 長度
- Term 十二中氣 HalfTerm 二十四節氣
- Hou 七十二候
- Zhang 章
- Bu 蔀
- Ji 紀
- Tong 統
- Yuan 元

### 其他

- Raw 未經某種處理的變量 Variables before processing in some way 
- V 速度 velocity
- Corr 修正改正 correction
- Tcorr 日月速度改正，或交食食甚時刻改正
- DifAccum 日盈縮積、月遲疾積
- Mcorr 食分修正
- Avg 平均的 average
- Acr  精確的 accurate
- Deg 度數 degree
- Dif 兩個常數之差 The difference between constants A and B. WinsolsDif 某日距離年前冬至的積日
- Halfxxx 某常數的一半 Half of a constant
- xxxHalf 某變量的一半 Half of a variable
- Numer 分子 numerator
- Denom 分母 denominator
- Num 序號 number