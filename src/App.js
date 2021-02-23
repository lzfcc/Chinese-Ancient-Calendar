import React from 'react';
import './App.css'
import calculate from '../src/Shangshu-calendar';
import { CalNameList } from '../src/Shangshu-calendar/constant'

const TableRowNameMap = {
  MonthPrint: '月序',
  NewmAvgSCPrint: '平朔',
  NewmAvgDecimalPrint: '分',
  NewmSCPrint: '定朔',
  NewmMmddPrint: '公曆',
  NewmDecimal3Print: '三次',
  NewmDecimal2Print: '二次',
  NewmDecimal1Print: '一次',
  SyzygySCPrint: '望',
  SyzygyDecimalPrint: '分',
  TermNamePrint: '氣名',
  TermAcrSCPrint: '定氣',
  TermAcrDecimalPrint: '分',
  TermSCPrint: '平氣',
  TermDecimalPrint: '分',
}

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.handleRetrieve = this.handleRetrieve.bind(this);

    this.renderTableList = this.renderTableList.bind(this);
    this.RenderTableContent = this.RenderTableContent.bind(this);
    this.renderMode = this.renderMode.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);

    this.state = {
      calendar: 'Yin',
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
      console.log(this.state.YearStart, YearStart);
      if (this.state.YearStart.length === 0 || Number.isNaN(YearStart)) {
        alert('输入年份不合法！' + this.state.calendar);
        return;
      }

      result.push(calculate(this.state.calendar, YearStart))
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
        result.push(calculate(this.state.calendar, y));
      }
    }
    this.setState({ output: result });
   
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
        <select
          value={this.state.calendar}
          onChange={(e) => {
            this.setState({ calendar: e.currentTarget.value });
          }}
        >
           {Object.entries(CalNameList).map(([key,value])=>{
            return <option value={key}>{value}</option>
           })}
        </select>
      </div>
    );
  }

  render() {
    return (
      <div class='App'>
        {this.renderMode()}
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handleRetrieve}>click!</button>
        {this.renderTableList()}
      </div>
    );
  }
}
