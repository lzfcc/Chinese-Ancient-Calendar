import React from 'react';
import './App.css'
import { CalNameList } from './Shangshu-calendar/constant'
import MenuSelect from './MenuSelect';

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
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleRetrieve = this.handleRetrieve.bind(this);

    this.state = {
      calendars: [],
      YearStart: '',
      YearEnd: '',
      YearMode: '0',
      AutoMode: 0,
      output: '',
      loading: false
    };

    this.worker = new Worker('main.js')
  }

  componentDidMount () {
    this.worker.addEventListener('message', ({ data }) => {
      if (data instanceof Blob) { // 输出文件结果
        this.setState({ output: [], loading: false });
        var fileName = `calendar_${this._getFileName()}.md`;
        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(data);
        a.click();
        URL.revokeObjectURL(a.href);
        a = null;
      } else {
        this.setState({ output: data });
      }
      this.setState({ loading: false });
    })
  }

  componentWillUnmount () {
    this.worker.terminate()
  }

  _getFileName () {
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
      alert('请选择何种历法！');
      return;
    }
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      alert('请输入起始年或終止年！');
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('输入年格式不合法！');
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

    const generateFile = () => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName: 'print',
        ...this.state
      })
    }

    if (this.downloadRef && this.downloadRef.checked) {
      generateFile();
      return;
    }

    if (this.state.calendars.length * (YearEnd - YearStart) > 400) {
      alert('展示内容过多，为避免浏览器性能问题，将自动下载文件到本地');
      generateFile();
      return;
    }

    this.setState({ loading: true });
    this.worker.postMessage({
      eventName: 'display',
      ...this.state
    });
  }

  renderTableList() {
    return (
      <div>
        {(this.state.output || []).map((CalData) => {
          const yearGroup = CalData.map((CalInfo) => {
            return (
              <div class='single-cal'>
                <p>{CalInfo.YearInfo}</p>
                <table>
                  <tr>
                    {this.RenderTableContent(CalInfo)}
                  </tr>
                  </table>
              </div>)
          });
          yearGroup.push(<div/>); // todo 分隔符
          return yearGroup;
        })}
      </div>
    );
  }

  RenderTableContent (CalInfo) {
    return Object.entries(CalInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
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
      <span class='year-select'>
        <input
          value={this.state.YearStart}
          onChange={(e) => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        {/* {this.state.mode === '1' ? ( */}
          <span class='year-end'>
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
    return (
      <div class='calendar-select'>
        <MenuSelect
          calMap={CalNameList}
          onSelect={(selected) => {
            this.setState({ calendars: selected })
          }}
        />
      </div>
    );
  }

  renderDownload () {
    return (
      <span class='save-file'>
        <input type='checkbox' name='download-file' ref={(ref) => {
          this.downloadRef = ref
        }}/>
        <label>保存爲.md文件</label>
      </span>
    )
  }

  renderLoading() {
    return this.state.loading ? (
      <div className="loading-view">
        <p className="loading-text">计算中，请稍候...</p>
      </div>
    ) : null;
  }

  render() {
    return (
      <div className='App'>
          {this.renderLoading()}
          {/* {this.renderMode()} */}
          {this.renderCalendar()}
          {this.renderInput()}
          <button onClick={this.handleRetrieve}>天霝〻地霝〻</button>
          {this.renderDownload()}
          {this.renderTableList()}
      </div>
    );
  }
}
