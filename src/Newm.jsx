import React from 'react'
import { CalNameList } from './Cal/para_constant'
import MenuSelect from './MenuSelect'
import DynamicList, { createCache } from 'react-window-dynamic-list'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import md1 from './note/newm.md';
const TableRowNameMap = {
  MonthPrint: ' ',
  NewmAvgScPrint: '平朔',
  NewmAvgDeciPrint: ' ',
  NewmScPrint: '定朔',
  NewmMmddPrint: '公曆',
  NewmDeci3Print: '三次',
  NewmDeci2Print: '二次',
  NewmDeci1Print: '線性',
  NewmEquaPrint: '赤度',
  SyzygyScPrint: '望',
  SyzygyDeciPrint: ' ',
  TermNamePrint: '氣名',
  TermAcrScPrint: '定氣',
  TermAcrDeciPrint: ' ',
  TermScPrint: '平氣',
  TermDeciPrint: ' ',
  TermEquaPrint: '氣赤',
  TermDuskstarPrint: '旦昏中'
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
  // instance() {
  //   return (
  //     <div>
  //       <TagPicker data={data3} groupBy="role" style={{ width: 300 }} />
  //     </div>);
  // }
  renderCalendar() {
    const cals = CalNameList
    return (
      <span>
        <MenuSelect
          calMap={cals}
          onSelect={selected => {
            this.setState({ calendars: selected })
          }}
        />
      </span>
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
    const isAuto = (this.isAuto && this.isAuto.checked) || false
    if (this.state.calendars.length === 0 && isAuto === false) {
      alert('Please choose a calendar');
      return;
    }
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      alert('Please input year(s)');
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    if (isAuto) {
      if (YearStart < -721 || YearStart > 1662 || YearEnd < -721 || YearEnd > 1683) {
        alert('Year range of AutoChoose mode: -721 to 1683');
        return;
      }
    } else if (YearStart < -3807 || YearStart > 9999 || YearEnd < -3807 || YearEnd > 9999) { // -3808爲景初曆上元
      alert('Year range: -3807 to 9999');
      return;
    }
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('illegal input!');
      return;
    }
    if (Number.isNaN(YearEnd)) {
      if (this.state.YearEnd.length === 0) {
        YearEnd = YearStart;
        this.setState({ YearEnd })
      } else {
        alert('illegal end year!');
        return;
      }
    } else if (Number.isNaN(YearStart)) {
      if (this.state.YearStart.length === 0) {
        YearStart = YearEnd;
        this.setState({ YearStart })
      } else {
        alert('illegal start year!');
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
        YearStart,
        YearEnd,
        isAuto,
        ...this.state
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
        <input type='checkbox' name='download-file' ref={ref => {
          this.downloadRef = ref
        }} />
        <label>保存爲.md文件</label>
      </span>
    )
  }

  renderAutoCal() {
    return (
      <span className='save-file'>
        <input type='checkbox' name='isAuto' ref={ref => {
          this.isAuto = ref
        }}
        />
        <label>自動選擇當年曆法</label>
      </span>
    )
  }

  renderTableList() {
    const list = (this.state.output || []).flat(); // 二维数组拍扁成一维，每个表格平均高度 350
    if (!list.length) {
      return null
    }
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
            const calInfo = list[index]
            const calCount = calInfo.Count
            return (
              <div className="single-cal" style={style}>
                {index % calCount === 0 ? <h3>{calInfo.Era}</h3> : null}
                <p style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: calInfo.YearInfo }}></p>
                <table>
                  <tr>{this.RenderTableContent(calInfo)}</tr>
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
        {(this.state.output || []).map(CalData => {
          const yearGroup = CalData.map(calInfo => {
            return (
              <div className='single-cal'>
                <p>{calInfo.YearInfo}</p>
                <table>
                  <tr>
                    {this.RenderTableContent(calInfo)}
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

  RenderTableContent(calInfo) {
    return Object.entries(calInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && TableRowNameMap[key]) {
        return <tr className={key}>{
          [<th>{TableRowNameMap[key]}</th>].concat(value.map(x => (<td dangerouslySetInnerHTML={{ __html: x }}></td>)))
        }</tr>
      }
      return null
    })
  }

  render() {
    const { md } = this.state
    return (
      <>
        <div className='calendar-select'>
          {this.renderCalendar()}
          {this.renderAutoCal()}
        </div>
        {this.renderInput()}
        <button onClick={this.handleRetrieve} className='button1'>天霝〻地霝〻</button>
        {this.renderDownload()}
        {this.renderTableList()}
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw, gfm]} children={md} />
        </article>
      </>
    )
  }
}
