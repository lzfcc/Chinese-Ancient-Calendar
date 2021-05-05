import React from 'react'
// import ReactDOM from 'react-dom';
import { CalNameList } from './Cal/para_constant'
import MenuSelect from './MenuSelect'
import DynamicList, { createCache } from 'react-window-dynamic-list'
import { TagPicker } from 'rsuite';
import data3 from './data3.mjs'

const TableRowNameMap = {
  MonthPrint: ' ',
  NewmAvgScPrint: '平朔',
  NewmAvgDecimalPrint: ' ',
  NewmScPrint: '定朔',
  NewmMmddPrint: '公曆',
  NewmDecimal3Print: '三次',
  NewmDecimal2Print: '二次',
  NewmDecimal1Print: '線性',
  NewmMansionPrint: '赤度',
  SyzygyScPrint: '望',
  SyzygyDecimalPrint: ' ',
  TermNamePrint: '氣名',
  TermAcrScPrint: '定氣',
  TermAcrDecimalPrint: ' ',
  TermScPrint: '平氣',
  TermDecimalPrint: ' ',
  TermMidstarPrint: '昏中'
}
const heightCache = createCache();

export default class Newm extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: '',
      YearEnd: '',
      // YearMode: '0',
      output: '',
      // loading: false,
    };
  }

  componentDidMount() {
    this.worker = new Worker('main.js');
    this.worker.addEventListener('message', ({ data }) => {
      if (data instanceof Blob) { // 约定：存为文件时 web worker 发送 Blob 对象
        this.setState({ output: [] });
        var fileName = `calendar_${this._getFileName()}.md`;
        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(data);
        a.click();
        URL.revokeObjectURL(a.href);
        a = null;
      } else { // 约定：页面展示时 web worker 发送 Object 对象
        this.setState({ output: data });
      }
      this.setState({ loading: false });
    })
  }

  componentWillUnmount() {
    this.worker.terminate()
  }

  _getFileName() {
    let calString = `${this.state.calendars}_${this.state.YearStart}`
    if (this.state.YearEnd) {
      calString += `_${this.state.YearEnd}`
    }
    calString += '_'
    const date = new Date();
    let dateString = date.getFullYear().toString();
    [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()].forEach((num) => {
      dateString = dateString + num.toString().padStart(2, '0')
    })
    return calString + dateString
  }

  // renderMode() {
  //   return (
  //     <div
  //       onChange={e => {
  //         this.setState({ mode: e.target.value });
  //       }}
  //     >
  //       <span>
  //         <input type='radio' name='retrieve-mode' value='0'/>
  //         <label for='0'>特定年</label>
  //       </span>
  //       <span>
  //         <input type='radio' name='retrieve-mode' value='1' defaultChecked  />
  //         <label for='1'>年區閒</label>
  //       </span>
  //     </div>
  //   );
  // }
  instance() {
    return (
      <div>
        <TagPicker data={data3} groupBy="role" style={{ width: 300 }} />
      </div>);
  }
  renderCalendar() {
    const cals = CalNameList
    return (
      <div className='calendar-select'>
        <MenuSelect
          calMap={cals}
          onSelect={(selected) => {
            this.setState({ calendars: selected })
          }}
        />
      </div>
    );
  }

  renderInput() {
    return (
      <span className='year-select'>
        <input
          value={this.state.YearStart}
          onChange={e => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        {/* {this.state.mode === '1' ? ( */}
        <span className='year-end'>
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={e => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          <span>年</span>
        </span>
        {/* ) : null} */}
      </span>
    );
  }

  handleRetrieve() {
    if (this.state.calendars.length === 0) {
      alert('Please choose a calendar');
      return;
    }
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      alert('Please input year(s)');
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    if (YearStart < -3807 || YearStart > 9999 || YearEnd < -3807 || YearEnd > 9999) { // -3808爲景初曆上元
      alert('year range: -3807 to 9999');
      return;
    }
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('illegal input!');
      return;
    }
    if (Number.isNaN(YearStart)) {
      if (this.state.YearStart.length === 0) {
        YearStart = YearEnd;
        this.setState({ YearStart })
      } else {
        alert('illegal start year!');
        return;
      }
    }
    if (Number.isNaN(YearEnd)) {
      if (this.state.YearEnd.length === 0) {
        YearEnd = YearStart;
        this.setState({ YearEnd })
      } else {
        alert('illegal end year!');
        return;
      }
    }
    if (YearStart > YearEnd) {
      [YearStart, YearEnd] = [YearEnd, YearStart]
    }
    const callWorker = eventName => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        ...this.state,
        YearStart,
        YearEnd
      })
    }
    if (this.downloadRef && this.downloadRef.checked) {
      callWorker('print');
      return;
    }
    if (this.state.calendars.length * (YearEnd - YearStart) > 400) {
      alert('內容過多，爲避免瀏覽器展示性能問題，將自動下載.md文件到本地');
      callWorker('print');
      return;
    }
    callWorker('display')
  }

  // renderLoading() {
  //   return this.state.loading ? (
  //     <div className="loading-view">
  //       <p className="loading-text">计算中，请稍候...</p>
  //     </div>
  //   ) : null;
  // }

  renderDownload() {
    return (
      <span className='save-file'>
        <input type='checkbox' name='download-file' ref={(ref) => {
          this.downloadRef = ref
        }} />
        <label>保存爲.md文件</label>
      </span>
    )
  }

  renderTableList() {
    // 二维数组拍扁成一维，每个表格平均高度 350
    const list = (this.state.output || []).flat();
    if (list.length === 0) {
      return null
    }
    let calCount = this.state.calendars.length
    return (
      <section className='main-render'>
        <DynamicList
          height={(window.innerHeight) * 0.98}
          width={(window.innerWidth) * 0.93}
          cache={heightCache}
          data={list}
          overscanCount={5}
        >
          {({ index, style }) => {
            const CalInfo = list[index]
            return (
              <div className="single-cal" style={style}>
                {index % calCount === 0 ? <h3>{CalInfo.Era}</h3> : null}
                <p style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: CalInfo.YearInfo }}></p>
                <table>
                  <tr>{this.RenderTableContent(CalInfo)}</tr>
                </table>
              </div>
            )
          }}
        </DynamicList>
      </section>
    );
  }

  BACKUP_renderTableList() {
    return (
      <div>
        {(this.state.output || []).map((CalData) => {
          const yearGroup = CalData.map((CalInfo) => {
            return (
              <div className='single-cal'>
                <p>{CalInfo.YearInfo}</p>
                <table>
                  <tr>
                    {this.RenderTableContent(CalInfo)}
                  </tr>
                </table>
              </div>)
          })
          yearGroup.push(<div />) // todo 分隔符
          return yearGroup;
        })}
      </div>
    );
  }

  RenderTableContent(CalInfo) {
    return Object.entries(CalInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && TableRowNameMap[key]) {
        return <tr className={key}>{
          [<th>{TableRowNameMap[key]}</th>].concat(value.map((x) => (<td dangerouslySetInnerHTML={{ __html: x }}></td>)))
        }</tr>
      }
      return null
    })
  }

  render() {
    return (
      <>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handleRetrieve} className='button1'>天霝〻地霝〻</button>
        {this.renderDownload()}
        {this.renderTableList()}
        <hr />
        <article><h2 id="-">朔閏表說明</h2>
          <ol>
            <li>可多選曆法；1 爲公元 1 年，0 爲公元前 1 年，-1 爲公元前 2 年；若僅需計算一年，在任意一框輸入年份卽可。 一曆一年爲 1 單位，最多可展示 400 單位的朔閏表，若超過 400 會自動下載到本地。</li>
            <li>第一行爲整年的情況，例如「積2759228 天紀己卯蔀49 大51小747 冬至12.5 閏餘6842閏11」的意思是：此年上元積年爲 2759228 年，入天紀己卯蔀 49 年，天正月大餘 51、小餘 747，冬至日數 12.5，閏餘 0.6842，按照閏餘法，11 月爲閏月。大餘加上蔀或紀名干支卽爲天正朔干支，如上例，己卯 16 + 大餘 51 = 67，mod (67, 60) = 7，正月朔爲庚午。四分曆日法爲 940，小餘 747 轉換爲十進制就是 747 / 940 ≒ 0.7947。冬至 12.5 同樣需要加上蔀干支。閏餘爲十進制，若以章法19爲單位，就是0.6842×19=13。</li>
            <li>「轉」表示冬至時刻入轉<n>近點月</n>日，「交」表示冬至時刻入交泛日<n>未加日月速度改正的入交點月日數</n>，「週」表示入週天度<n>恆星年</n>。</li>
            <li>劉歆<v>世經</v>論<v>三統</v>上元積年多爲算外，但也有用算上的；<v>殷曆</v> <v>周曆</v>等古四分曆，歷代學者論上元積年多用算上，但也有用算外的。統一起見，本表各曆上元積年均爲算外，入蔀<n>統</n>年均爲算上。</li>
            <li>置閏共有三種方法：閏餘法、無中氣法、固定冬至法，閏餘法可分爲年中置閏、年末置閏兩種，無中氣法閏月必在年中<n>當然也可能在最後一個月</n> ，固定冬至法閏月必在年末。漢代以後均採用無中氣法。古六曆並不確定採用何種置閏法，本工具能同時顯示三種置閏法的結果<n>超級獨家技術</n> ，以固定冬至法爲主。第一行最後標注的是閏餘年中置閏法的閏月，若採用閏餘年末置閏法，最後一個月就是閏月。中氣一行採用無中氣置閏法，有「□□」的年份爲無中氣置閏法的閏年，「□□」表示該月無中氣，爲閏月。需要留意的是，若固定冬至法閏年在閏餘法、無中氣法的上一年，那麼該年的閏餘法、無中氣法閏月數需要加 1 ，因爲固定冬至法把該年的第一個月往上年奪去了。固定冬至法的閏月必定置於年末；無中氣法的閏月可能比閏餘年中法提前或延後一個月：中氣與朔同在一日，中氣的時刻比朔早，則閏餘未達到閏準，還不能置閏；但是由於中氣與朔已經在一日了，上個月無中氣，需要置閏。</li>
            <li>本工具的另一個獨家技術是「算三年以求一年」：秦漢以後置閏採用無中氣置閏法，如果閏月在十二或一月，在特殊情況下閏年會推後或提前一年，因此欲求一年，需同時算前後一年，以應對特殊情況。這也就意味著，如果想算 10 年的朔閏，需要算 30 年。鑒於此，我們採用滾動數組，將之前的運算結果存儲下來，以空間換時間，算 10 年朔閏只需要算 12 年，經測試，這能減少近一半的計算時間。</li>
            <li>判斷大小月的方法：看天干是否相同。如一、二、三月的朔分別是辛亥、辛巳、庚戌，辛亥、辛巳天干一樣，說明一月有 30 日，爲大月；辛巳、庚戌天干不同，說明二月有 29 日，爲小月。</li>
            <li>「平朔」卽未考慮日月速度變化而得出的朔日，「平氣」卽未考慮日速度變化而得出的中氣日，「定朔」卽加上日月速度改正而得出的朔日，「定氣」卽加上日速度改正而得出的中氣日。干支下的數字爲小分，均爲十進制小數，如「8184」卽0.8184，換算成24小時制爲：0.8184 × 24 = 19.6416，0.6416 × 60 = 38.496，0.496 × 60 ≒ 30，卽19點38分30秒。小分到取小數點後四位，卽精度爲 8.64 s。各曆均有不同的辰法，需要您手動進行轉換。未來我可能會加入辰法自動轉換。</li>
            <li>「二次」表示用二次差內插法計算出的小分，「一次」表示用線性內插法計算出的小分，「三次」表示用三次差公式計算出的小分。若某曆有二次差定朔計算，則望干支及小餘爲二次差定望，其餘曆法同理。</li>
            <li>雖然漢末<v>乾象曆</v>便出現了定朔推步，但直到唐初<v>麟德曆</v>纔正式開始用定朔編排曆書，此前都是平朔注曆，定朔僅用於交食推步。雖然隋劉焯<v>皇極曆</v> 便發明了二次差計算定朔，但編排曆書時僅採用簡單的線性內插進行計算，二次差僅用於交食推步，本表進朔標準是高次內插所得小分。雖然<v>皇極曆</v>開始便可以計算定氣，但直到淸<v>時憲曆</v> 纔開始用定氣編排曆書，之前都是平氣注曆。本程序在平朔注曆時代用平朔編排閏月；在定朔推曆時代用二次差編排閏月、進朔，若遇一次差與二次差存在臨界差異，用戶大可進行手動調整，但這種極端情況應該不大可能出現。</li>
            <li><v>元嘉</v>規定若月食發生在黎明之前，則屬上日，我把此規定用於所有的魏晉系曆法。干支減去1的，在定朔干支一格加上「-」，小分不變。<v>麟德</v>至<v>授時</v>之前行進朔法，我目前暫時簡單將 0.75 作爲進朔標準，進朔的月在干支後加上「+」來表示，僅將干支加 1，小分不變。如「乙丑+」表示原本的干支是甲子，進朔爲乙丑，而小分與進朔前一致。如果遇到與文獻不一致的情況，用戶可根據小分自行調整進朔與置閏。</li>
            <li>日食在朔，月食在望。<code>● ◐ ◔</code> 分別表示全食、偏食、光影相接虧蝕微少。隋代以前的交食計算非常原始，僅能根據交食週期判斷是否可能發生日月食。<v>乾象</v>僅能計算月食所在月，<v>景初</v>能根據去交度分判斷虧蝕程度，<v>正光</v>提出食分計算方法，<v>大明</v>沒有虧食的計算，<v>大業</v>以前的魏晉南北曆法均無全食限，均無法計算日食，僅能判斷是否交會。整齊起見，我將食分、虧蝕程度一槪補全。<v>大業</v>、<v>戊寅</v>沒有計算日食持續時間的方法，我姑且用月食來補。</li>
          </ol>
        </article>
      </>
    )
  }
}
