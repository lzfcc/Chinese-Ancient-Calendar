---
author: ["柯棋瀚"]
title: "中國古曆編製器說明"
date: 2021-02-24
lastmod: 2021-03-08
---

## 本工具簡介

1. 目前的古代朔閏査詢網站都是根據工具書、文獻材料手動調整的<n>參考中研院 [兩千年中西曆轉換說明書](https://sinocal.sinica.edu.tw/lusodoc.html)，廖育棟 [本網站的農曆編算](https://ytliu0.github.io/ChineseCalendar/computation_chinese.html)</n>。本工具可提供古代實行未實行的 60 餘部曆法的朔望氣閏計算，完全遵照各曆算法進行全自動計算，無手動干預。這有如下獨特之處：
   1.  提供每年的積年、閏餘、每日的確切時刻
   2. 定朔時刻日月所在赤道度、定氣時刻日所在赤道度<n>20210226v2.02</n>
   3. 漢魏晉南北朝的交食計算<n>0302v2.05</n>
3. 本工具完全開源，如您需要査詢、核査各曆的詳細參數與算法，請前往 源碼倉庫<n>內測階段暫不開放</n>。如您不嫌麻煩，可以下載源碼，在本地運行程序。如您不想每次都在線查詢，可下載 離線打包文件，直接通過瀏覽器打開卽可。
4. 如您發現任何問題，可通過評論框或郵件向我反饋。本程序目前未經過文獻檢驗，我也暫時沒有機會把歷代的材料全部梳理一遍。若您在研究過程中發現程序結果與文獻不符，望不吝提供線索。這個工具是根據研究需要而開發的，如果您有任何功能需求，敬請與我聯繫，我會在力所能及的範圍內儘量實現。更多信息見頁腳。
5. 各時期曆法的行用情況見 [赫赫金鑰｜中國古代曆法史](https://kqh.me/tutorial/calendar4/)。
6.  編程理念：以研究需求爲中心；設計理念：以用戶體驗爲中心，傻瓜式操作。關於表格的設計：採用加粗—正常——淺灰三層結構，用戶一眼就看到了定朔、平朔、平氣的干支，第二眼看到的是小分，最後如果要看公曆日期和節氣名字的話，纔會去看最不起眼的灰色。不同分類採用橫線隔開，並且有兩種粗細。同一分類就沒有線，避免視線錯亂。定朔平朔之間、定氣平氣之閒用細線，朔望氣之間用粗線。數字都用的等寬字體。每欄中間不設線，間隔恰到好處，不會太寬，讓視線跳躍得很累，也不會太緊，不易分辨。
6.   計算程序採用 JavaScript 編寫，採用滾動數組，減少近一半的計算時間。前端框架採用 React，採用 Web Worker 將 UI 線程與計算線程分離，採用懶加載，大幅壓縮渲染時間。更多技術特徵見 README。【隱私聲明】本站使用了 Google Analytics 進行流量分析；評論系統採用 Hyvor Talk；服務器託管在 Netlify 平臺。運算均在本地進行。

## 凡例

### 1、朔望氣閏食

1. 第一行爲整年的情況，例如「積2759228 天紀己卯蔀49  大51小747  冬至12.5  閏餘6842閏11」的意思是：此年上元積年爲 2759228 年，入天紀己卯蔀 49 年，天正月大餘 51、小餘 747，冬至日數 12.5，閏餘 0.6842，按照閏餘法，11 月爲閏月。大餘加上蔀或紀名干支卽爲天正朔干支，如上例，己卯 16 + 大餘 51  = 67，mod (67, 60) = 7，正月朔爲庚午。四分曆日法爲 940，小餘 747 轉換爲十進制就是 747 / 940 ≒ 0.7947。冬至 12.5 同樣需要加上蔀干支。閏餘爲十進制，若以章法19爲單位，就是0.6842×19=13。
2. 劉歆<v>世經</v>論<v>三統</v>上元積年多爲算外，但也有用算上的；<v>殷曆</v><v>周曆</v>等古四分曆，歷代學者論上元積年多用算上，但也有用算外的。統一起見，本表各曆上元積年均爲算外，入蔀<n>統</n>年均爲算上。
3. 由於我暫時想不明白的原因，朔干支轉換成公曆日期的功能<n>該算法移植自廖育棟</n>，一年中可能有一個月有1天誤差<n>如甲子應該是2月2日，顯示的是2月1日</n>，並且有可能一整年會前後錯開一個月<n>如正月朔對應的是二月的公曆日期</n>。本工具提供的公曆日期僅供參考，如需使用公曆日期，請使用廖育棟的 [儒略日數和日干支計算器](https://ytliu0.github.io/ChineseCalendar/Julian_chinese.html) 進行覆核。
4. 置閏共有三種方法：閏餘法、無中氣法、固定冬至法，閏餘法可分爲年中置閏、年末置閏兩種，無中氣法閏月必在年中<n>當然也可能在最後一個月</n>，固定冬至法閏月必在年末。漢代以後均採用無中氣法。古六曆並不確定採用何種置閏法，本工具能同時顯示三種置閏法的結果<n>絕對獨家技術</n>，以固定冬至法為主。第一行最後標注的是閏餘年中置閏法的閏月，若採用閏餘年末置閏法，最後一個月就是閏月。中氣一行採用無中氣置閏法，有「□□」的年份爲無中氣置閏法的閏年，「□□」表示該月無中氣，爲閏月。需要留意的是，若固定冬至法閏年在閏餘法、無中氣法的上一年，那麼該年的閏餘法、無中氣法閏月數需要加 1 ，因為固定冬至法把該年的第一個月往上年奪去了。固定冬至法的閏月必定置於年末；無中氣法的閏月可能比閏餘年中法提前或延後一個月：中氣與朔同在一日，中氣的時刻比朔早，則閏餘未達到閏準，還不能置閏；但是由於中氣與朔已經在一日了，上個月無中氣，需要置閏。
5. 判斷大小月的方法：看天干是否相同。如一、二、三月的朔分別是辛亥、辛巳、庚戌，辛亥、辛巳天干一樣，說明一月有 30 日，爲大月；辛巳、庚戌天干不同，說明二月有 29 日，爲小月。
6. 「平朔」卽未考慮日月速度變化而得出的朔日，「平氣」卽未考慮日速度變化而得出的中氣日，「定朔」卽加上日月速度改正而得出的朔日，「定氣」卽加上日速度改正而得出的中氣日。干支下的數字為小分，均為十進制小數，如「8184」卽0.8184，換算成24小時制爲：0.8184 × 24 = 19.6416，0.6416 × 60 = 38.496，0.496 × 60 ≒ 30，卽19點38分30秒。小分到取小數點後四位，卽精度爲 8.64 s。各曆均有不同的辰法，需要您手動進行轉換。未來我可能會加入辰法自動轉換。
7. 「二次」表示用二次差內插法計算出的小分，「一次」表示用線性內插法計算出的小分，「三次」表示用三次差公式計算出的小分。若某曆有二次差定朔計算，則望干支及小餘爲二次差定望，其餘曆法同理。
8. 雖然漢末<v>乾象曆</v>便出現了定朔推步，但直到唐初<v>麟德曆</v>纔正式開始用定朔編排曆書，此前都是平朔注曆，定朔僅用於交食推步。雖然隋劉焯<v>皇極曆</v>便發明了二次差計算定朔，但編排曆書時僅採用簡單的線性內插進行計算，二次差僅用於交食推步。雖然<v>皇極曆</v>開始便可以計算定氣，但直到淸<v>時憲曆</v>纔開始用定氣編排曆書，之前都是平氣注曆。本程序在平朔注曆時代用平朔編排閏月；在定朔推曆時代用二次差編排閏月、進朔，若遇一次差與二次差存在臨界差異，用戶大可進行手動調整，但這種極端情況應該不大可能出現。
9. <v>元嘉</v>規定若月食發生在黎明之前，則屬上日，我把此規定用於所有的魏晉系曆法。干支減去1的，在定朔干支一格加上「-」，小分不變。<v>麟德</v>開始行進朔法，我目前暫時簡單將 0.75 作爲進朔標準，進朔的月在干支後加上「+」來表示，僅將干支加 1，小分不變。如「乙丑+」表示原本的干支是甲子，進朔爲乙丑，而小分與進朔前一致。如果遇到與文獻不一致的情況，用戶可根據小分自行調整進朔與置閏。          
10. 日食定在朔，月食定在望。「● ◐ ○」分別表示全食、偏食、虧蝕微少。乾象、大明沒有虧食程序的計算，大業以前沒有全食限，整齊起見，我一槪補齊。

### 2、日書

【尚未完工】日書按月提供全年每一日的信息：

1. 第幾日、干支
2. 【日赤】日所在赤道度
3. 【日黃】日所在黃道度
4. 【日去極】日黃道去極度、日視赤緯。
5. 【晷長】以尺爲單位
6. 【日出】日出時刻。與朔閏表一樣，四位數前省略了「0.」，0.2500 卽 24 * 0.25 = 6 點
7. 【昏中星】太陽落山後約 2.5 刻的時候，正南的星宿。所謂「日短星昴」
8. 【月赤】月所在赤道度
9. 【黃白距】月與日的緯度差，日去極 + 黃白距 = 月去極。月在陽曆<n>黃道以南</n>爲正，月在陰曆<n>黃道以北</n>爲負
10. 【候土卦】發斂<n>七十二候</n>、土王用事、卦用事三個合在一起。

### 3、五星

預計 2023 年推出，敬請期待。

### 4、大衍

本頁面所有輸入均需爲整數（連分數的小數逼近除外）。

此頁面提供了幾個轉換工具：

#### 大衍求一術 

大衍求一術爲萬法之法，孫子定理、不定方程、調日法、演紀都需要求一術。衍數、定母需互質。。輸入兩個 <b>互質</b> 的整數 a, b，求方程 `a * x ≡ 1 (mod b)` 的解 x 。可以 a>b ，也可 a<b 。更多內容可參考 [中国剩余定理和大衍求一术](https://zhuanlan.zhihu.com/p/272302805)。

#### 一次同餘式　二元一次不定方程

ax - by = c 等價於 ax ≡ c (mod b)，有解的充要條件：(a,b)|c，卽 c 能被 a、b的最大公因數整除。

#### 調日法與無窮調日法

##### 1、擬秦九韶法

##### 2、清人三種

一個朔望月是 29.5305 日有餘，在<v>授時</v>以前都用分數來表示朔分。自何承天始，以 彊子26 / 彊母47 爲彊率，以 弱子9 / 弱母17 爲弱率，則 朔餘 / 日法 可表示爲 (26m+9n) / (49m+17n) ，m 卽陽率<n>彊數</n>，n 卽陰率<n>弱數</n>，彊弱率之間的任何數都可以作如上表示。調日法是南系、隋系、唐系、宋系的不傳之祕，直到乾嘉時期李銳纔闡明此法<n>更多見 劉鈍<v>李銳、顧觀光調日法工作述評</v>，<v>自然科學史研究</v>1987(2)；陳久金<v>調日法研究</v>1984(3)；李繼閩<v>關於調日法的數學原理</v>，西北大學學報 1985(2)</n>。

無窮調日法是我自己的一點點小改進。彊弱率需滿足如下條件：<img src="https://pic.imgdb.cn/item/604db4765aedab222ce451f5.png" width="170">，卽 `彊子 * 弱母 - 彊母 * 弱子 = 1` 。那麼推廣開來，26/49 和 9/17 只是一種可能性而已，適合求朔分 0.5305 附近的數，而任何滿足這個條件的彊弱二率，都可以用來調制。只需要輸入分母<n>卽曆法中的日法</n>、彊率，便會自動根據大衍求一術求出弱率，再根據李銳公式求出分子<n>卽曆法中的朔餘</n>和彊弱數<n>卽加權</n>；也可以同時輸入分子和分母，根據累彊弱之數、李銳、顧觀光-陳久金三種方法各自生成彊弱數。這推廣開來的調日法就是無窮調日法。輸入框中默認是何承天彊率。不過李銳公式有一個限制，必須滿足 弱數<彊母，例如玄始曆 47251 / 89052 ，李銳公式解得 47252 = 26×1816 + 9×4，累強弱、顧-陳公式解得 47251 = 26×1799 + 9×53，卽 47251 / 89052 和  47252 / 89052 都滿足調日法，但李銳公式求不出前者。

更多說明見 [赫赫金鑰](https://kqh.me/tutorial/calendar4)。

#### 連分數逼近

輸入一個分數的分子、分母，求其最大公因數、連分數、各漸進連分數。連分數逼近非常適合與調日法參照。李繼閔認為，何承天在漸進分數法基礎上發展出調日法，強弱二率是魏晉時期各曆共有的最密近的二相鄰近分數。<n><v>關於調日法的數學原理</v></n>

#### 齊同

##### 1、整數最大公因數　最小公倍數

求多個數的最大公因數 gcd、最小公倍數 lcm。

##### 2、分數最小公倍數

求多組分數的共同週期，依次輸入各組分子、分母整數分母用 1 表示。求曆法的元法，依次鍵入歲實、歲實分母、朔實、日法、甲子數、1。四分曆所得卽元法，不用再除以章法。可用任意標點符號隔開；組數不限。

##### 3、章法　元法

求章法、元法。依次輸入斗分、歲實分母、朔餘、日法。

先明確一下概念：

- 章法：置閏週期，在一章內置幾個閏月。閏月數卽章閏。
- 蔀法（四分曆、北系稱蔀，魏晉、南系稱紀）：經過一蔀，天正經朔回到夜半。
- 元法（四分曆稱紀）：經過一元，冬至回到天正經朔夜半。
- 而北系之統、紀的概念，是把元再細分而得，只是爲了化小數字，並無實際意義。

古人造曆先有章法再有歲實，而我們可以用歲實反求章法、蔀（紀）法、元法。方法如下：求最小公倍數、解同餘式連用，可求得章法；用大衍總數術，可求得蔀法、元法（以 SolarNumerRaw, SolarDenom, LunarNumerRaw, Denom, 60 入大衍總數術，可得元法，以 SolarNumerRaw, SolarDenom, LunarNumerRaw, Denom, 1 入之，可得蔀法）。唐宋曆法以日法統領各參數，所以我直接用分數最小公倍數來求。

#### 大衍總數術（解一次同餘式組、秦九韶推廣之孫子定理）

求解多組 x ≡ ri (mod mi) 。依次輸入各組餘數 r、元數 m；在孫子定理中，模數需兩兩互質，而秦九韶將不互質的元數變爲互質的定母，進而可以使用孫子定理求解；可用任意標點符號隔開；組數不限。

#### 唐宋演紀

根據秦九韶治曆演紀章。

歲策 = 365 + 斗分 / 日法，朔策 = 29 + 朔餘 / 日法。實測冬至 = 干支 + 氣餘 / 日法，冬至分子 = 干支 × 日法 + 氣餘。天正朔分子= 干支 × 日法 + 朔餘。冬至分子需爲 60 的整數倍。

### 5、轉換

#### 儒略日與日期互轉

核心計算程序移植自 [廖育棟](https://ytliu0.github.io/ChineseCalendar/Julian.js) 教授，表示衷心感謝！我增加了毫秒計算，雖然沒什麼用。

#### 黃赤轉換

黃道積度、赤道積度的相互轉換<n>如230度</n>。不用在意輸入的是黃道還是赤道，因為黃赤差都是一樣的，會自動生成黃道度和赤道度兩個結果，輸入的是黃道度，則選用生成的赤道度卽可，反之亦然。

若想進行黃赤入宿度的相互轉換<n>如斗3度</n>，直接在日書進行線性內插卽可。

#### 辰刻轉換

將萬分小數轉換爲辰數。

## 开发者说明

本仓库基于组件化、工程化的考量，将核心模块<n>计算逻辑</n>拆分到了单独的仓库<n>ancient-calendar</n>中，通过子模块进行依赖，从而前端展示<n>View</n>和计算逻辑<n>Model</n>可以独立开发，前端直接引用子模块的函数进行运算。

由于运算都在前端进行，在进行大量运算时会卡住 UI，体验较差。为了改进这一问题，我们决定改用 Web Worker<n>前端的多线程</n>。这样就必须将 `Worker()` 构造函数的参数文件独立放在 public 目录下<n>不能参与 webpack 打包</n>，因而不能直接引用子模块，必须将子模块打包成一个文件：

1. 全局安装 webpack，webpack-CLI
```shell
$ npm install -g webpack webpack-cli
```
2. 在 npm run build 后运行 webpack
```shell
$ npm run build
$ webpack ./src/Shangshu-calendar/frontend-worker.js -o ./public
```
在 build 目录下生成 main.js。此过程也许可以通过配置 webpack.config.js 来自动完成。
