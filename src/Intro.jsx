import React from 'react'

export default class Intro extends React.Component {
  render() {
    return (
      <>
        <article>
          <h2 id="-">簡介</h2>
          <ol>
            <li>本工具的使用對象是古代天文曆法研究者。對於一般文史研究者，推薦使用下面的友情鏈接<n>當然，「時間」板塊的三個工具還是挺有用的</n>。</li>
            <li>目前的古代朔閏査詢網站都是根據工具書、文獻材料手動調整的<n>參考中研院 <a href="https://sinocal.sinica.edu.tw/lusodoc.html" target="_blank" rel="noreferrer">兩千年中西曆轉換說明書</a>，廖育棟 <a href="https://ytliu0.github.io/ChineseCalendar/computation_chinese.html" target="_blank" rel="noreferrer">本網站的農曆編算</a></n>。本工具可提供古代實行未實行的 60 餘部曆法<n>包括我復原的 8 部魏晉南北朝曆法、2 部隋曆、3 部唐曆、5 部宋曆、1 部金曆</n>的計算，完全遵照各曆算法進行全自動計算，無手動干預。主要有三大功能區：<ol>
              <li>【朔閏表】每年的積年、冬至大小餘、閏餘；冬至時刻的入轉日、入交泛日、入週天度。各月定朔<n>線性內插、二次三次內插</n>、平朔，定朔時刻日月所在赤道度，定望，平氣、定氣、定氣日昏中星。日月食食甚時刻、食分。</li>
              <li>【曆書】包含天文曆、具注曆兩部份。<ol>
                <li>天文曆：每日太陽赤經、極黃經宿度，日赤緯、日出時刻、正午晷長，月赤經、月赤緯。預計 2023 年將推出五星計算。</li>
                <li>具注曆：每年「術數年」積年、男女九宮，年干支五行、納音、魁罡之月，23 種歲神，年九宮色。每月月建、月神、吉時、月九宮色。每日干支、儒略日、公曆日期、納音五行、建除、黃道吉日黑道凶日、七星值日、二十八宿二十八禽值日，二十四節氣時刻、七十二候時刻、土王用事時刻、卦用事時刻，人神、日遊神、血支血忌，10 種日神。</li>
              </ol>
              </li>
              <li>【數學工具】包含同餘、方程、天文、時間四個板塊。<ol>
                <li>同餘：大衍求一術、解一次同餘式、大衍總數術，擬秦九韶調日法、淸人調日法三種、連分數，最大公因數、章蔀紀元法，古曆入元、秦九韶演紀法，從零開始造唐宋曆。</li>
                <li>方程：九章算術開方術、累減開方術，二分迭代法解高次方程，隙積術芻童垛、三角垛落一形垛、四角垛方垛，招差術、拉格朗日內插，會圓術、弧矢割圓術、三斜求積術。</li>
                <li>天文：日躔月離及誤差，太陽赤黃經轉換及誤差，太陽去極度、赤緯、日出、晷長及誤差，月亮極白經、赤經、極黃緯，現代天文任意時刻太陽高度、方位角、晷長。</li>
                <li>時間：將萬分小數轉換爲辰刻，儒略日、日期轉換，公元年、年干支轉換。</li>
              </ol>
              </li>
            </ol>
            </li>
            <li>如您發現任何問題，可通過評論框或郵件向我反饋。本程序目前未經過文獻檢驗，且急就草創，錯漏叢生，<b>尙不能用於正式學術研究</b>。目前完全可靠的是古四分曆，可完全替代朱桂昌<v>顓頊日曆表</v>、<v>太初日曆表</v>、<v>後漢四分日曆表</v>三部大轉頭。若您在研究過程中發現程序結果與文獻不符，望不吝提供線索。這個工具是根據研究需要而開發的，如果您有任何功能需求，敬請與我聯繫，我會在力所能及的範圍內儘量實現。</li>
            <li>各時期曆法的行用情況見 <a href="https://kqh.me/tutorial/calendar4/" target="_blank" rel="noreferrer">赫赫金鑰｜中國古代曆法史</a>。</li>
            <li>編程理念：以研究需求爲中心；設計理念：以用戶體驗爲中心，傻瓜式操作。關於朔閏表表格的設計：採用加粗—正常——淺灰三層結構，用戶一眼就看到了定朔、平朔、平氣的干支，第二眼看到的是小分，最後看到的是不甚重要的昬中星。定朔平朔之間、定氣平氣之閒用細線，朔望氣之間用粗線。數字都用的等寬字體。每欄中間不設線，間隔恰到好處，不會太寬，讓視線跳躍得很累，也不會太緊，不易分辨。</li>
            <li>本工具完全開源，如您需要査詢、核査各曆的詳細參數與算法，請前往源碼倉庫。如您不嫌麻煩，可以下載源碼，在本地運行程序。更多技術特徵見開發者說明。【隱私聲明】本站使用了 Google Analytics 進行流量分析；評論系統採用 Hyvor Talk；服務器託管在 Netlify 平臺。運算均在本地瀏覽器進行。</li>
          </ol>

          <h2>網站推薦</h2>
          <h3>年表</h3>
          <ul>
            <li><a href='https://ytliu0.github.io/ChineseCalendar/index_chinese.html'
              target="_blank" rel="noreferrer">廖育棟的網站</a>年曆、氣朔時刻、中國歷史年表、儒略日干支轉換等</li>
            <li>中研院 <a href='https://sinocal.sinica.edu.tw/'>兩千年中西曆轉換</a></li>
            <li><a href='https://www.lishichelun.com/calendar/switch' target="_blank" rel="noreferrer">歷史車輪中西曆轉換器</a></li>
          </ul>
          <h3>實行曆法</h3>
          <ul>
            <li><a href='https://ytliu.epizy.com/Shixian/index_chinese.html?i=1' target="_blank" rel="noreferrer">時憲曆計算</a></li>
            <li><a href='https://kanasimi.github.io/CeJS/_test%20suite/era.htm' target="_blank" rel="noreferrer">紀年轉換工具</a>世界各國曆法</li>
          </ul>
          <h3>現代天文學中曆</h3>
          <ul>
            <li><a href='http://www.tianqihoubao.com/calendar/calendar.htm' target="_blank" rel="noreferrer">日梭萬年曆</a>似乎是中科院背景</li>
            <li><a href='http://www.nongli.net/sxwnl/' target="_blank" rel="noreferrer">壽星天文曆</a>許劍偉、鄭彥山</li>
            <li><a href='https://vert.neocities.org/cld/' target="_blank" rel="noreferrer">萬年天文夏曆</a>哂蟹齋</li>
          </ul>
          <h3>現代天文學朔閏、交食</h3>
          <ul>
            <li><a href="https://eclipse.gsfc.nasa.gov/" target="_blank" rel="noreferrer">NASA Eclipse</a></li>
            <li><a href="http://www.moshier.net/#Cephes" target="_blank" rel="noreferrer">Astronomy and numerical software source codes</a>
            </li>
          </ul>
        </article>
        <article>
          <h2 id="-">开发者说明</h2>
          <h3>1. </h3>
          <ul>
            <li>计算程序采用 JavaScript 编写</li>
            <li>前端框架采用 React</li>
            <li>本地框架为 Node。在本地运行本程序，需要安装 Node 13.2 以上版本</li>
            <li>朔闰表、历书采用 Web Worker，实现 UI 线程与计算线程分离</li>
            <li>朔闰表采用懒加载，大幅压缩渲染时间</li>
            <li>采用 WebPack 打包</li>
            <li>采用 <a href="https://mikemcl.github.io/decimal.js/" target="_blank" rel="noreferrer">Decimal.js</a><span className="decimal64">.64</span>进行小数点后 64 位大数字运算，采用 <a href='https://www.npmjs.com/package/fraction.js' target="_blank" rel="noreferrer">fraction.js</a><span className="decimal64">n/d</span>进行分数运算，采用 <a href="https://blog.whyoop.com/nzh/docs" target="_blank" rel="noreferrer">nzh</a> 进行阿拉伯数字、汉字转换</li>
          </ul>
          <p><del>本仓库基于组件化、工程化的考量，将核心模块<n>计算逻辑</n>拆分到了单独的仓库<n>ancient-calendar</n>中，通过子模块进行依赖，从而前端展示<n>View</n>和计算逻辑<n>Model</n>可以独立开发，前端直接引用子模块的函数进行运算。</del></p>
          <p>由于运算都在前端进行，在进行大量运算时会卡住 UI，体验较差。为了改进这一问题，我们决定改用 Web Worker<n>前端的多线程</n>。这样就必须将 <code>Worker()</code> 构造函数的参数文件独立放在 public 目录下<n>不能参与 webpack 打包</n>，因而不能直接引用子模块，必须将子模块打包成一个文件：</p>
          <ol>
            <li>全局安装 webpack，webpack-CLI<pre><code class="lang-shell">$ npm install -g webpack webpack-<span class="hljs-keyword">cli</span>
            </code></pre>
            </li>
            <li>打包  main.js<pre><code class="lang-shell">$ webpack .<span class="hljs-regexp">/src/</span>Cal<span class="hljs-regexp">/output_frontend-worker.mjs -o ./</span><span class="hljs-keyword">public</span>
            </code></pre>
            </li>
            <li><pre><code class="lang-shell">$ npm <span class="hljs-keyword">run</span><span class="bash"> build</span>
            </code></pre></li>
          </ol>
          <h3>2. </h3>
          <p>核心计算程序在 <code>/src/Cal</code> 目录下，有 9 个板块，各文件功能说明：</p>
          <ul>
            <li><code>para_</code> 参数<ul>
              <li><code>para_constant</code> 常量参数</li>
              <li><code>para_1</code> 四分魏晋南北系历法参数</li>
              <li><code>para_2</code> 隋唐宋元历法参数</li>
            </ul>
            </li>
            <li><code>newm_</code> 朔闰表模块<ul>
              <li><code>newm</code> 朔闰计算</li>
              <li><code>newm_quar</code> 四分历朔闰计算</li>
              <li><code>newm_index</code> 朔闰计算汇总调整输出</li>
            </ul>
            </li>
            <li><code>day_</code> 历书模块<ul>
              <li><code>day</code> 历书计算</li>
              <li><code>day_luck</code> 历书中岁神、日神的计算</li>
            </ul>
            </li>
            <li><code>astronomy_</code> 天文模块<ul>
              <li><code>astronomy_acrv</code> 日月速度改正</li>
              <li><code>astronomy_eclipse</code> 日月交食</li>
              <li><code>astronomy_deg2mansion</code> 黄赤道积度转换为入宿度</li>
              <li><code>astronomy_formula</code> 使用公式进行计算的历法，<code>astronomy_table</code> 使用表格进行计算的历法，<code>astronomy_west</code> 使用现代方法进行计算。包含黄赤转换、经纬转换、月亮坐标转换</li>
            </ul>
            </li>
            <li><code>modulo_</code> 同馀模块<ul>
              <li><code>modulo_continued-frac</code> 分数连分数</li>
              <li><code>modulo_continued-frac1</code> 小数连分数</li>
              <li><code>modulo_denom</code> 调日法</li>
              <li><code>modulo_exhaustion</code> 从零开始造宋历</li>
              <li><code>modulo_gcdlcm</code> 最大公因数</li>
              <li><code>modulo_origin</code> 演纪</li>
              <li><code>modulo_qiuyi</code> 大衍求一术</li>
            </ul>
            </li>
            <li><code>equa_</code> 方程模块<ul>
              <li><code>equa_geometry</code> 几何</li>
              <li><code>equa_high</code> 解高次方程</li>
              <li><code>equa_math</code> 数字格式转换</li>
              <li><code>equa_sn</code> 垛积</li>
              <li><code>equa_sqrt</code> 开方</li>
            </ul>
            </li>
            <li><code>time_</code> 时间模块<ul>
              <li><code>time_decimal2clock</code> 日分转换为辰刻</li>
              <li><code>time_era</code> 年干支转换</li>
              <li><code>time_jd2date</code> 儒略日、日期转换</li>
            </ul>
            </li>
            <li><code>bind_</code> 路由模块<ul>
              <li><code>bind</code> 根据历法自动选择朔闰计算</li>
              <li><code>bind_astronomy</code> 根据历法自动选择天文计算</li>
            </ul>
            </li>
            <li><code>output_</code>其他<ul>
              <li><code>output</code> 输出准备</li>
              <li><code>output_print</code> 本地打印入口。<code>const printData = outputFile(2, 1255, 1255, 0</code> 第一个数字为模式，<code>1</code> 为朔闰表，<code>2</code> 为历书；第二三个数字为起始年、终止年；第四个数字为自动长历模式开关，目前暂不支持</li>
              <li><code>output_frontend-worker</code> Web Worker，朔闰表、历书两个模块的前端调用入口</li>
            </ul>
            </li>
          </ul>

          <h2>更新日誌</h2>
          <h4 id="2021-01-03">2021-01-03</h4>
          <p>立項。</p>
          <h4 id="2-23">2-23</h4>
          <p>內測上線。2-24 加入readme；加入評論；加入 GA；加入更新日誌。2-26 加入合朔日月赤度、節氣日赤度。2-28 採用滾動數組，減少計算次數，重構數據結構，本地端速度提高 40%；前端相應調整，採用  Web Worker 多線程。避免 UI 與計算的衝突。今天突然發現望都不對，想了半天才發現，之前都是入曆日+1/2朔望月近點月之差，實際上應該是朔入曆+朔望月/2。3-02 採用懶加載策略，只加載當前屏幕的信息。現在可以秒加載了，看來絕大部分時間都消耗在渲染上。魏晉時期的日月食基本完成。3-15 增加日書、轉換tab。增加魏晉日書，轉換工具。</p>
          <h4 id="-">……</h4>
          <h4 id="04-21">4-21 公測上線</h4>
          <p>版本：核心 <code>0.90</code> 前端 <code>1.00</code></p>
          <h4 id="04-25">4-25 <code>0.91 1.01</code></h4>
          <p>4 月 24 日本站編入 Google 索引【核心】增加時刻轉辰刻。日赤緯、日出公式曆法加上了日躔，至少紀元能跟論文合。授時明天還不對。訂正躔離：重新整理月離表的邊界；修改明天躔離；唐系日躔改用不等間距內插。宋志「紹興四年（1193）十二月（紀元）小餘七千六百八十，太史不進，故十一月小盡」。一個迷思：若索引從 1 開始，小餘 8285 左右，與大統相合，若索引從 0 開始，則是 7681，雖與引文相合，但與大統差了太多。我目前還是從 1 開始索引。修改定朔望小餘問題；修改定氣問題。【前端】調整文件結構：拆分時間板塊；拆分朔閏表板塊；加入曆書年份限制。</p>
          <h4 id="04-29">4-29 <code>0.92 1.01.1</code></h4>
          <p>【核心】天文模塊增加交食、交食週期與交點月換算。增加魏晋南北系、大業、戊寅、麟徳、大衍交食。元嘉非常奇怪，原來的交會差，單算入交日的話跟其他曆都不一樣，但是最後結果是一樣的，迷惑。現在已有的食甚改正，有些方向都是相反的，奇怪。調整魏晉系閏餘單位，本來想把古六曆閏餘改成 19，發現顓頊不好改，放棄。增加 fraction.js。【前端】文件改名。升級依賴。辰刻轉換由文字換成表格。修改表格 css</p>
          <h4 id="04-29">4-29 晚 <code>0.92.1 1.01.2</code></h4>
          <p>【核心】修復四分曆跑不來的小問題：未把調用交食排除。調用交食模塊之前先用去交日篩選，大大節省算力。30 以內的阿拉伯數字轉漢字換成列表，能快一點；朔閏表月序改成漢字【前端】實現了``內 html 標籤：曆書九宮色添加背景色；朔閏表表頭增加樣式，交食進朔符號添加顏色</p>
          <h4 id="04-29">5-02<code>0.93</code></h4>
          <p>【核心】重要更新：重構躔離。此前一直用的 (日盈縮積 - 月遲疾積) / (分母) 來計算日月改正，發現並不是這麼回事，大部分曆法都能適用，但是崇玄、應天、儀天、崇天、統元、大衍、乾元這七部曆法的月行改正分母並不固定，算出來大衍的差距能達到 8 刻之巨，所以只好重新錄入所有曆法的朓朒積，再直接用招差術或拉格朗日內插計算。數據已根據陳美東的日躔月離表兩篇論文訂正<n>乾元陳美東843改成850，奇怪，「四十三」和「五十」怎麼會錯呢</n>。修改宣明、應天、儀天月離，此三曆較特殊，月離表分爲兩截，此前我都合爲一個。給所有曆法補上定氣積日表。大幅精簡天文模塊 bind 的代碼。修改望也進朔的小 bug。</p>
          <h4 id="todo-list-">todo list:</h4>
          <ul>
            <li>完善交食</li>
            <li>完善星度、昏中星、月亮位置</li>
            <li>唐宋的推卦好像跟魏晉不一樣</li>
            <li>自動長曆功能</li>
            <li>其他 bug</li>
          </ul>
        </article>
      </>
    )
  }
}
