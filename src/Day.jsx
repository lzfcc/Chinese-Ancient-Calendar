import React from 'react'
import { CalNameDayList } from './Cal/para_constant'
import MenuSelect from './MenuSelect'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import md1 from './note/day.md';

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
      md: ''
    };
  }
  componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
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
    if (!list.length) {
      return null
    }
    list.forEach((item, index) => {
      item.id = index
    })
    return (
      <section className='day-render' style={{ whiteSpace: "pre-wrap" }}>

        <div className='daytitle-wrap'>
          <h2><span className='daytitle-1'>{this.state.output.Era}</span><br />{CalNameDayList[this.state.calendars]}萬年天文具注曆日</h2>
          <p className='DayAccum'>{this.state.output.DayAccum}</p>
          <p>{this.state.output.YearGod}</p>
          <div className='YearColor'>
            <table>
              {(this.state.output.YearColor || []).map(row => {
                return (
                  <tr>
                    {row.map(d => {
                      return <td dangerouslySetInnerHTML={{ __html: d }}></td>
                    })}
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        <hr />
          {list.map((info, index) => {
            return (
              <div className="single-cal">
                <h3>{MonName[index + 1]}</h3>
                <p dangerouslySetInnerHTML={{ __html: MonInfo[index + 1] }}></p>
                <span className='YearColor'>
                  <table>
                    {(MonColor[index + 1] || []).map(row => {
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
          {rows.map(row => (
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
            if ({ key } === 'MonColor') { } else {
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
      alert('Please choose a calendar');
      return
    }
    if (this.state.YearStart.length === 0) {
      alert('Please input year(s)');
      return
    }
    let YearStart = parseInt(this.state.YearStart)
    if (YearStart < -1500 || YearStart > 3000) {
      alert('year range: -1500 to 3000');
      return
    }
    let YearEnd = YearStart
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('illegal input!');
      return;
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
          onSelect={selected => {
            this.setState({ calendars: selected })
          }}
        />
      </div>
    );
  }

  render() {
    const { md } = this.state
    return (
      <>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handleRetrieve} className='button2'>㤂〻如勑令</button>
        <article><ul>
          <li><span className='Jd'>灰色：儒略日、儒略曆或格利高里曆日期</span></li>
          <li><span className='Nayin'>黑色：納音、建除、黃道黑道；七曜值日、星期幾、二十八宿值日、二十八禽值日</span></li>
          <li><span className='Equa'>紅色：太陽赤道宿度</span></li>
          <li><span className='Eclp'>黃色：太陽黃道宿度</span></li>
          <li><span className='Lati'>綠色：太陽赤緯、日出刻度、正午晷長、昏中星</span></li>
          <li><span className='MoonEclp'>藍色：月行九道、月黃緯、月道度所入黃道宿度</span></li>
          <li><span className='HouName'>黑色：沒滅、二十四節氣、七十二候、卦用事、土王用事</span></li>
          <li><span className='ManGod'>灰色：人神、血支血忌、日遊神</span></li>
          <li><span className='Luck'>紅色：各種日神</span></li>
        </ul>
        </article>
        {this.renderDayTableList()}
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} children={md} />
        </article>
      </>
    )
  }
}
