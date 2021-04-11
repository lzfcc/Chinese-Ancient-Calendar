import React from 'react'
import './App.css'
import { CalNameDayList } from './Shangshu-calendar/constant'
import MenuSelect from './MenuSelect'

// const TableDayRowNameMap = {
//   Sc: '干支',
//   Sunrise: '日出',
//   Lati: '日去極',
//   Dial: '晷長',
//   MidstarPrint: '昏中星',
//   EquartorPrint: '日赤',
//   EclipticPrint: '日黃',
//   MoonEquartorPrint: '月赤',
//   MoonEquatorLati: '黃白距',
//   HouName: '候土卦',
//   FiveName: '五行'
// }

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
      showDate: 0
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
        <h2>{this.state.output.Era}{CalNameDayList[this.state.calendars]}天文具注曆</h2>
        <p className='DayAccum'>{this.state.output.DayAccum}</p>
        <p>{this.state.output.YearGod}</p>
        <span className='YearColor'>
          <table>
            {(this.state.output.YearColor || []).map((row) => {
              return (
                <tr>
                  {row.map((d) => {
                    return <td>{d}</td>;
                  })}
                </tr>
              );
            })}
          </table>
        </span>
        {list.map((MonthInfo, index) => {
          return (
            <div className="single-cal">
              <h3>{MonName[index + 1]}</h3>
              <p>{MonInfo[index + 1]}</p>
              <span className='YearColor'>
                <table>
                  {(MonColor[index + 1] || []).map((row) => {
                    return (
                      <tr>
                        {row.map((d) => {
                          return <td>{d}</td>;
                        })}
                      </tr>
                    );
                  })}
                </table>
              </span>
              <div>
                {this.RenderDayTableContent(index + 1, MonthInfo)}
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  RenderDayTableContent(month, MonthInfo) {
    const COL = 10
    const rows = []
    for (let k = 1; k < MonthInfo.length; k++) {
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
            {this.renderDayDetail(MonthInfo, month, k)}
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

  renderDayDetail(MonthInfo, month, day) {
    // if (this.state.showMonth !== month || this.state.showDate !== day) {
    //   return null
    // }
    return (
      <div>
        {
          Object.entries(MonthInfo[day]).map(([key, value]) => {
            if ({ key } == 'MonColor') { } else {
              return (
                /* {TableDayRowNameMap[key]}:  */
                <p className={key}>{value}</p>
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
      return;
    }
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      alert('請輸入起始年或終止年！');
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('格式不合法！');
      return;
    }
    if (Number.isNaN(YearStart)) {
      if (this.state.YearStart.length === 0) {
        YearStart = YearEnd;
        this.setState({ YearStart })
      } else {
        alert('起始年不合法！');
        return;
      }
    }
    if (Number.isNaN(YearEnd)) {
      if (this.state.YearEnd.length === 0) {
        YearEnd = YearStart;
        this.setState({ YearEnd })
      } else {
        alert('終止年不合法！');
        return;
      }
    }
    if (YearStart > YearEnd) {
      alert('起始年不可大於終止年！');
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
          onChange={(e) => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        <span>年</span>
        {/* <span className='year-end'>
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={(e) => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          
        </span> */}
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
        <p>黑色：日序、干支。<span className='EquartorPrint'>紅色：太陽赤道宿度</span>；<span className='EclipticPrint'>黃色：太陽黃道宿度</span>；<span className='Lati'>綠色：太陽赤緯，日出刻度，正午晷長，昏中星</span>；<span className='MoonEquartorPrint'>藍色：月黃緯，月赤道宿度</span>；<span className=''>灰色：七十二候，卦用事，土王用事</span></p>
        {this.renderDayTableList()}
      </>
    )
  }
}
