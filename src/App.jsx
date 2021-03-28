import React from 'react'
import './App.css'
import { CalNameList, CalNameDayList } from './Shangshu-calendar/constant'
import MenuSelect from './MenuSelect'
import DynamicList, { createCache } from 'react-window-dynamic-list'
import Modulo from './Modulo'
import Equation from './Equation'
import Astronomy from './Astronomy'
import Converter from './Converter'

const TableRowNameMap = {
  MonthPrint: '月序',
  NewmAvgScPrint: '平朔',
  NewmAvgDecimalPrint: '分',
  NewmScPrint: '定朔',
  NewmMmddPrint: '公曆',
  NewmDecimal3Print: '三次',
  NewmDecimal2Print: '二次',
  NewmDecimal1Print: '一次',
  NewmMansionPrint: '赤度',
  SyzygyScPrint: '望',
  SyzygyDecimalPrint: '分',
  TermNamePrint: '氣名',
  TermAcrScPrint: '定氣',
  TermAcrDecimalPrint: '分',
  TermScPrint: '平氣',
  TermDecimalPrint: '分',
  TermMansionPrint: '赤度',
  TermMidstarPrint: '昏中'
}
const TableDayRowNameMap = {
  Sc: '干支',
  SunRise: '日出',
  SunEquatorLati: '日去極',
  Dial: '晷長',
  MidstarPrint: '昏中星',
  EquartorPrint: '日赤',
  EclipticPrint: '日黃',
  MoonEquartorPrint: '月赤',
  MoonEquatorLati: '黃白距',
  HouName: '候土卦',
}

const heightCache = createCache();
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.tabTitles = ['朔望氣閏食', '曆書', '五星', '同餘', '方程', '天文', '時間']
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: '',
      YearEnd: '',
      // YearMode: '0',
      AutoMode: 0,
      output: '',
      loading: false,
      activeTab: 0,
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
    if (this.state.activeTab === 0) {
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
    } else if (this.state.activeTab === 1) {
      callWorker('Day')
    } else if (this.state.activeTab === 2) {
      // 敬請期待
    }
  }

  renderTabs() {
    return (<span className="section-select-container">
      {this.tabTitles.map((title, index) => (<span className={"section-select" + (this.state.activeTab === index ? ' active' : '')} onClick={(e) => {
        if (this.state.activeTab === index) {
          return
        }
        if (index === 2) {
          alert('[五星] 預計2023年推出，敬請期待～')
          return
        }
        this.setState({
          activeTab: index,
          // AutoMode: 0,
          output: '',
          loading: false,
        })
      }} >{title}</span>))}
    </span>)
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
          });
          yearGroup.push(<div />); // todo 分隔符
          return yearGroup;
        })}
      </div>
    );
  }

  renderTableList() {
    // 二维数组拍扁成一维，每个表格平均高度 350
    // TODO: cache 是否需要 clear？需要 data 中包含 id 属性
    const list = (this.state.output || []).flat();
    if (list.length === 0) {
      return null
    }
    let calCount = this.state.calendars.length
    return (
      <section className='main-render'>
        <DynamicList
          height={window.innerHeight}
          width={(window.innerWidth) * 0.93}
          cache={heightCache}
          data={list}
          overscanCount={5}
        >
          {({ index, style }) => {
            const CalInfo = list[index]
            return (
              <div className="single-cal" style={style}>
                {index % calCount === 0 ? <h3>{CalInfo.AnnoDomini}</h3> : null}
                <p>{CalInfo.YearInfo}</p>
                <table>
                  <tr>{this.RenderTableContent(CalInfo)}</tr>
                </table>
              </div>
            );
          }}
        </DynamicList>
      </section>
    );
  }

  RenderTableContent(CalInfo) {
    return Object.entries(CalInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && ((this.state.activeTab === 0 && TableRowNameMap[key]) || (this.state.activeTab === 1 && TableDayRowNameMap[key]))) {
        return <tr className={key}>{
          [<th>{TableRowNameMap[key]}</th>].concat(value.map((x) => (<td>{x}</td>)))
        }</tr>
      }
      return null
    })
  }

  // renderMode() {
  //   return (
  //     <div
  //       onChange={(e) => {
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

  renderInput() {
    return (
      <span className='year-select'>
        <input
          value={this.state.YearStart}
          onChange={(e) => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        {/* {this.state.mode === '1' ? ( */}
        <span className='year-end'>
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={(e) => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          <span>年</span>
        </span>
        {/* ) : null} */}
      </span>
    );
  }

  renderCalendar() {
    let cals = {}
    if (this.state.activeTab === 0) {
      cals = CalNameList
    }
    if (this.state.activeTab === 1) {
      cals = CalNameDayList
    }
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

  // renderLoading() {
  //   return this.state.loading ? (
  //     <div className="loading-view">
  //       <p className="loading-text">计算中，请稍候...</p>
  //     </div>
  //   ) : null;
  // }

  renderTabContent() {
    if (this.state.activeTab === 0) {
      return (
        <>
          {this.renderCalendar()}
          {this.renderInput()}
          <button onClick={this.handleRetrieve} className='button1'>天霝〻地霝〻</button>
          {this.renderDownload()}
          {this.renderTableList()}
        </>
      )
    } else if (this.state.activeTab === 1) {
      return (
        <>
          {this.renderCalendar()}
          {this.renderInput()}
          <button onClick={this.handleRetrieve} className='button2'>㤂〻如勑令</button>
          {this.renderDownload()}
          {this.renderTableList()}
        </>
      )
    } else if (this.state.activeTab === 3) {
      return (
        <Modulo />
      )
    } else if (this.state.activeTab === 4) {
      return (
        <Equation />
      )
    } else if (this.state.activeTab === 5) {
      return (
        <Astronomy />
      )
    } else if (this.state.activeTab === 6) {
      return (
        <Converter />
      )
    }
  }

  render() {
    return (
      <div className='App'>
        {this.renderTabs()}
        {/* {this.renderLoading()} */}
        {/* {this.renderMode()} */}
        {this.renderTabContent()}
      </div>
    );
  }
}
