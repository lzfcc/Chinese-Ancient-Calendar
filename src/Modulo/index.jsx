import React from "react"
import Dayanqiuyi from "./Qiuyi"
import Gcdlcm from "./GcdLcm"
import Fraclcm from "./FracLcm"
import IndetermEqua1 from "./IndetermEqua1"
import IndetermEqua from "./IndetermEqua"
import Sunzi from "./Sunzi"
import ContinuedFrac from "./ContinuedFrac"
import ContinuedFrac1 from "./ContinuedFrac1"
import Denom from "./Denom"
import Zhang from "./Zhang"
import Origin from "./Origin"
import Origin2 from "./Origin2"
import ExhauDenom from './ExhauDenom'
import ExhauOrigin from './ExhauOrigin'
import ExhauConst from './ExhauConst'

export default class Converter extends React.Component {
  render() {
    return (
      <>
        <section className="modulo">
          <h2>大衍之什</h2>
          <Dayanqiuyi />
          <IndetermEqua1 />
          <Sunzi />
          <h2>調日法之什</h2>
          <IndetermEqua />
          <Denom />
          <ContinuedFrac />
          <p></p>
          <ContinuedFrac1 />
          <h2>章蔀之什</h2>
          <Gcdlcm />
          <Fraclcm />
          <Zhang />
          <h2>上元演紀之什</h2>
          <Origin2 />
          <Origin />
          <h2>從零開始造唐宋曆</h2>
          <ExhauDenom />
          <ExhauOrigin />
          <ExhauConst />
          <article></article>
        </section>
        <hr/>
        <article>
          <h2 id="3-">調日法說明</h2>
          <p>一個朔望月是 29.5305 日有餘，在<v>授時</v>以前都用分數來表示朔分。自何承天始，以 彊子26 / 彊母47 爲彊率，以 弱子9 / 弱母17 爲弱率，則 朔餘 / 日法 可表示爲 (26m+9n) / (49m+17n) ，m 卽陽率<n>彊數</n>，n 卽陰率<n>弱數</n>，彊弱率之間的任何數都可以作如上表示。調日法是南系、隋系、唐系、宋系的不傳之祕，直到乾嘉時期李銳纔闡明此法<n>更多見 劉鈍<v> 李銳、顧觀光調日法工作述評</v>，<v>自然科學史研究</v>1987(2)；陳久金<v>調日法研究</v>1984(3)；李繼閩<v>關於調日法的數學原理</v>，西北大學學報 1985(2)；<a href="https://kqh.me/tutorial/calendar4">赫赫金鑰</a></n>。</p>
          <p>無窮調日法是我自己的一點點小改進。彊弱率需滿足如下條件：<img src="https://pic.imgdb.cn/item/604db4765aedab222ce451f5.png" alt="" width='140'></img>，卽 <code>彊子 * 弱母 - 彊母 * 弱子 = 1</code> 。那麼推廣開來，26/47 和 9/17 只是一種可能性而已，適合求朔分 0.5305 附近的數，而任何滿足這個條件的彊弱二率，都可以用來調制。只需要輸入分母<n>卽曆法中的日法</n>、彊率，便會自動根據大衍求一術求出弱率，再根據李銳公式求出分子<n>卽曆法中的朔餘</n>和彊弱數<n>卽加權</n> ；也可以同時輸入分子和分母，根據累彊弱之數、李銳、顧觀光-陳久金三種方法各自生成彊弱數。這推廣開來的調日法就是無窮調日法。輸入框中默認是何承天彊率。不過李銳公式有一個限制，必須滿足 弱數&lt;彊母，例如玄始曆 47251 / 89052 ，李銳公式解得 47252 = 26×1816 + 9×4，累強弱、顧-陳公式解得 47251 = 26×1799 + 9×53，卽 47251 / 89052 和 47252 / 89052 都滿足調日法，但李銳公式求不出前者。</p>
          <p>更多說明見 <a href="https://kqh.me/tutorial/calendar4">赫赫金鑰</a>。</p>
        </article>
      </>
    );
  }
}
