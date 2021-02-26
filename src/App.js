import React from 'react';
import './App.css'
import calculate from '../src/Shangshu-calendar';
import { CalNameList } from '../src/Shangshu-calendar/constant'
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
      calendars: ['Yin'],
      mode: '0',
      YearStart: '',
      yearEnd: '',
      output: ''
    };
  }

  handleRetrieve(e) {
    const YearStart = Number(this.state.YearStart);
    const yearEnd = Number(this.state.yearEnd);
    let result = [];
    if (this.state.mode === '0') {
      if (this.state.YearStart.length === 0 || Number.isNaN(YearStart)) {
        alert('输入年份不合法！');
        return;
      }
      result = this.state.calendars.map(cal => calculate(cal, YearStart))
    } else {
      if (
        this.state.YearStart.length === 0 ||
        Number.isNaN(YearStart) ||
        this.state.yearEnd.length === 0 ||
        Number.isNaN(yearEnd)
      ) {
        alert('输入年份不合法！');
        return;
      }
      if (YearStart > yearEnd) {
        alert('起始年份不可以大于终止年份！');
        return;
      }
      // alert(this.state.year);
      for (let y = YearStart; y <= yearEnd; ++y) {
        for (const cal of this.state.calendars) {
          result.push(calculate(cal, y));
        }
      }
    }

    const getFileName = () => {
      let calString = `${this.state.calendars}_${this.state.YearStart}`
      if (this.state.yearEnd) {
        calString += `_${this.state.yearEnd}`
      }
      calString += '_'
      const date = new Date();
      let dateString = date.getFullYear().toString();
      [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].forEach((num) => {
        dateString = dateString + num.toString().padStart(2, '0')
      })
      return calString + dateString
    }

    // todo: result 格式化 md
    const blob = new Blob([JSON.stringify(result)]);
    const sizeLimit = 1 << 18; // 256 kB
    if ((this.downloadRef && this.downloadRef.checked) || blob.size > sizeLimit) {
        var fileName = `calendar_${getFileName()}.md`;
        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
        a = null;
    }
    if (blob.size > sizeLimit) {
      alert('生成内容过多，为避免浏览器展示性能问题，已自动下载文件到本地');
    } else {
      this.setState({ output: result });
    }
  }

  renderTableList() {
    return (
      <div>
        {(this.state.output || []).map((CalData) => {
         return (<div class='single-cal'>
           <p>{CalData.YearInfo}</p>
           <table>
            <tr> {this.RenderTableContent(CalData)}</tr>
          </table></div>)
        })}
      </div>
    );
  }

  RenderTableContent (CalData) {
    return Object.entries(CalData).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        return <tr className={key}>{
         [<th>{TableRowNameMap[key]}</th>].concat(value.map((x) => (<td>{x}</td>)))
         }</tr>
      }
      return null
     })
  }

  renderMode() {
    return (
      <div
        onChange={(e) => {
          this.setState({ mode: e.target.value });
        }}
      >
        <span>
          <input type='radio' name='retrieve-mode' value='0' defaultChecked />
          <label for='0'>特定年</label>
        </span>
        <span>
          <input type='radio' name='retrieve-mode' value='1' />
          <label for='1'>年區閒</label>
        </span>
      </div>
    );
  }

  renderInput() {
    return (
      <span class='year-select'>
        <span class='note'>（1=公元1年，0=公元前1年，-1=公元前2年）</span>
        <input
          onChange={(e) => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        <span>年</span>
        {this.state.mode === '1' ? (
          <span class='year-end'>
            <span>—</span>
            <input
              onChange={(e) => {
                this.setState({ yearEnd: e.currentTarget.value });
              }}
            />
            <span>年</span>
          </span>
        ) : null}
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
      <div>
        <input type='checkbox' name='download-file' ref={(ref) => {
          this.downloadRef = ref
        }}/>
        <label>保存为文件</label>
      </div>
    )
  }

  render() {
    return (
      <div class='App'>
        {this.renderMode()}
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handleRetrieve}>计算!</button>
        {this.renderDownload()}
        {this.renderTableList()}
      </div>
    );
  }
}
