import React from 'react'
import { CalNameDayList } from './Cal/para_constant'
import MenuSelect from './MenuSelect'

export default class Day extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: '',
      YearEnd: '',
      AutoMode: 0,
      output: null,
      loading: false,
      showMonth: 0,
      showDate: 0,
    };
  }

  componentDidMount() {
    this.worker = new Worker('main.js');
    this.worker.addEventListener('message', ({ data }) => {
      this.setState({ output: data, loading: false });
    });
  }

  renderDayTableList() {
    if (!this.state.output) {
      return null
    }
    const MonName = this.state.output.MonName
    const MonInfo = this.state.output.MonInfo
    const MonColor = this.state.output.MonColor
    const list = this.state.output.DayData.slice(1)
    if (list.length === 0) {
      return null
    }
    list.forEach((item, index) => {
      item.id = index
    })
    return (
      <section className='day-render'>
        <h2>{this.state.output.Era}{CalNameDayList[this.state.calendars]}萬年天文具注曆</h2>
        <p className='DayAccum'>{this.state.output.DayAccum}</p>
        <p>{this.state.output.YearGod}</p>
        <span className='YearColor'>
          <table>
            {(this.state.output.YearColor || []).map((row) => {
              return (
                <tr>
                  {row.map(d => {
                    return <td dangerouslySetInnerHTML={{ __html: d }}></td>
                  })}
                </tr>
              );
            })}
          </table>
        </span>
        {list.map((info, index) => {
          return (
            <div className="single-cal">
              <h3>{MonName[index + 1]}</h3>
              <p>{MonInfo[index + 1]}</p>
              <span className='YearColor'>
                <table>
                  {(MonColor[index + 1] || []).map((row) => {
                    return (
                      <tr>
                        {row.map(d => {
                          return <td dangerouslySetInnerHTML={{ __html: d }}></td>
                        })}
                      </tr>
                    );
                  })}
                </table>
              </span>
              <div>
                {this.RenderDayTableContent(index + 1, info)}
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  RenderDayTableContent(month, info) {
    const COL = 10
    const rows = []
    for (let k = 1; k < info.length; k++) {
      const r = Math.floor((k - 1) / COL)
      if (!rows[r]) {
        rows[r] = []
      }
      rows[r].push(
        (
          <td
            key={month + '-' + k}
            className="day-table-cell"
          >
            {this.renderDayDetail(info, k)}
          </td>
        )
      )
    }
    return (
      <div className='day-table'>
        <table>
          {rows.map((row) => (
            <tr>{row}</tr>
          ))}
        </table>
      </div>
    )
  }

  renderDayDetail(info, day) {
    // if (this.state.showMonth !== month || this.state.showDate !== day) {
    //   return null
    // }
    return (
      <div>
        {
          Object.entries(info[day]).map(([key, value]) => {
            if ({ key } == 'MonColor') { } else {
              return (
                /* {TableDayRowNameMap[key]}:  */
                <p className={key} dangerouslySetInnerHTML={{ __html: value }}></p>
              )
            }
          })
        }
      </div>
    )
  }

  handleRetrieve(e) {
    if (this.state.calendars.length === 0) {
      alert('請選擇曆法！');
      return
    }
    if (this.state.YearStart.length === 0) {
      alert('請輸入年份！');
      return
    }
    let YearStart = parseInt(this.state.YearStart)
    if (YearStart < -4710 || YearStart > 3000) {
      alert('年份範圍 -1500 至 2500');
      return
    }
    let YearEnd = YearStart
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('格式不合法！');
      return;
    }
    const callWorker = (eventName) => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        ...this.state,
        YearStart,
        YearEnd
      })
    }
    callWorker('Day')
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
        <span>年</span>
      </span>
    );
  }

  renderCalendar() {
    let cals = CalNameDayList
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

  render() {
    return (
      <>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handleRetrieve} className='button2'>㤂〻如勑令</button>
        <article><ul>
          <li><span className='Jd'>灰色：儒略日、公曆日期</span></li>
          <li><span className='Nayin'>黑色：納音、建除、黃道黑道；七曜值日、星期幾、二十八宿值日、二十八禽值日</span></li>
          <li><span className='EquartorPrint'>紅色：太陽赤道宿度</span></li>
          <li><span className='EclipticPrint'>黃色：太陽黃道宿度</span></li>
          <li><span className='Lati'>綠色：太陽赤緯、日出刻度、正午晷長、昏中星</span></li>
          <li><span className='MoonEquartorPrint'>藍色：月黃緯、月赤道宿度</span></li>
          <li><span className='HouName'>黑色：七十二候、卦用事、土王用事</span></li>
          <li><span className='ManGod'>灰色：人神、血支血忌、日遊神</span></li>
          <li><span className='Luck'>紅色：各種日神</span></li>
        </ul>
        </article>
        {this.renderDayTableList()}
        <hr />
        <article><h2 id="-">曆書說明</h2>
          <p>曆書按月提供全年每一日的信息，中間彩色爲天文曆部分，其餘爲具注曆部分。由於內容很多，曆書只能計算一曆一年。</p>
          <p>天文曆：</p>
          <ul>
            <li>【昏中星】太陽落山後約 2.5 刻<n>夜漏開始時刻</n>，正南的星宿。</li>
            <li>【黃白距】月與日的緯度差，日去極 + 黃白距 = 月去極。月在陽曆<n>黃道以南、外道</n>爲正，月在陰曆<n>黃道以北、內道</n>爲負。</li>
          </ul>
          <p>具注曆：</p>
          <p>以下是一些日神歲神對應的宜忌：</p>
          <ul>
            <li>【魁罡之月】切不得修造動土，大凶。</li>
            <li>【七曜對應】蜜=日，莫=月，雲漢=火，嘀=水，溫沒斯=木，那頡=金，雞緩=土【七曜値日吉凶】太陽直日，宜見官、出行、求財，走失必得，吉事重吉，凶事重凶；太陰直日，納財、治病、服藥、修井灶門戶，忌見官；火直日，宜買六畜、治病、合伙造書契、合市，忌針灸；水直日，宜入學造功德，一切工巧皆成，六畜走失自來；木直日，宜見官、禮事、買莊宅、下文狀、洗頭；金直日，宜受法、市口馬、著新衣、修門戶，忌見官；土直日，宜典莊田、市買牛馬，利加萬倍，修倉庫。</li>
            <li>【三元紫白詩】上利與功紫白方，碧綠之地患癰瘡，黃赤之方遭疾病，黑方動土主凶喪。</li>
            <li>【長短星】不宜市貿、交易、裁衣、納財</li>
            <li>【人神】人神所在及血忌血支不可鍼灸出血。</li>
            <li>【日遊】日遊在房內，產婦不宜於方位上安牀帳，及掃舍皆凶。<n>赵贞<v>敦煌具注历中的「蜜日」探研</v>、楊帥<v>出土文獻所見 7-14 世紀中國曆注研究</v>、鄧文寬<v>敦煌文獻 S2620 號唐年神方位圖試釋</v>。鄧文寬<v>敦煌古曆叢識</v>還有一部分歲神，以後補充。<v>敦煌曆日探研</v>，<v>出土文獻研究</v>第七輯</n></li>
            <li>【黃道黑道】青龍黃道，天乙星；明堂黃道，貴人星；金匱黃道，福德星；天德黃道，寶光星；玉堂黃道，少微星，天開星；司命黃道，鳳輦星，月仙星；天刑黑道，天刑星；白虎黑道，天殺星；朱雀黑道，天訟星；天牢黑道，鎮神星；玄武黑道，天獄星；勾陳黑道，地獄星。<n>具體內容自己搜索</n></li>
            <li>【往亡】不可起土功。分往亡、氣往亡兩類，爲示區分，我將第一類稱爲往亡，第二類稱爲氣亡。往亡=土忌、土禁、地杓、大徼、土司空。</li>
            <li>【復日】魁罡所擊之辰，忌爲凶事，利爲吉事。</li>
            <li>【重日】凶事重凶。</li>
            <li>【反支】反支日公車不受章奏，漢明帝「蠲其制」。流行於秦漢。推算方法仍有待研究。我暫且用 554433221166</li>
            <li>【大時小時】頁 257</li>
            <li>【歸忌】忌遠行、歸家、移徙、娶婦</li>
            <li>【天李】=天理=天獄。不可入官、入室</li>
            <li>【臨日】=赤帝臨日，忌臨民、訴訟。<n>以上王強<v>出土戰國秦漢數術文獻神煞研究</v></n></li>
          </ul>
          <p>儒略日轉換為公曆日期的方法：之前都是每部曆法分別歸算出上元的儒略日數，再將積日等同於儒略日積日，算出公曆日期。這樣很麻煩，因為每部曆法要單獨歸算，更重要的是經常會出現一日的誤差，找不到原因。現在新方法非常妙：假設公元 1000 年年前冬至 12 月 16 日乙酉儒略日 2086292 爲曆元，算出該年假想冬至儒略日 <code>OriginJdAccum = 2086292 + Math.floor(365.243 * (year - 1000))</code> ，換算成干支序。另計算該曆冬至積日，兩者相減，卽 <code>OriginJdDif = (OriginAccum % 60 + 60) % 60 - Math.round((Math.round(OriginJdAccum) % 60 + 110) % 60.1)</code>。<code>OriginJdAccum + OriginJdDif</code> 卽爲該曆冬至儒略日，各加距冬至日數得每日儒略日。</p>
        </article>
      </>
    )
  }
}
