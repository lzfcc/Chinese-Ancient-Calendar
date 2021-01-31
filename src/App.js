import React from "react";
import './App.css'
import { calculate } from "../src/Shangshu-calendar";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.handleRetrieve = this.handleRetrieve.bind(this);

    this.renderTable = this.renderTable.bind(this);
    this.renderMode = this.renderMode.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);

    this.state = {
      calendar: "Yin",
      mode: "0",
      yearStart: "",
      yearEnd: "",
      output: ""
    };
  }

  handleRetrieve(e) {
    const yearStart = Number(this.state.yearStart);
    const yearEnd = Number(this.state.yearEnd);
    let result = [];
    if (this.state.mode === "0") {
      console.log(this.state.yearStart, yearStart);
      if (this.state.yearStart.length === 0 || Number.isNaN(yearStart)) {
        alert("输入年份不合法！" + this.state.calendar);
        return;
      }
      result.push(calculate(this.state.calendar, yearStart));
    } else {
      if (
        this.state.yearStart.length === 0 ||
        Number.isNaN(yearStart) ||
        this.state.yearEnd.length === 0 ||
        Number.isNaN(yearEnd)
      ) {
        alert("输入年份不合法！");
        return;
      }
      if (yearStart > yearEnd) {
        alert("起始年份不可以大于终止年份！");
        return;
      }
      // alert(this.state.year);
      for (let y = yearStart; y <= yearEnd; ++y) {
        result.push(calculate(this.state.calendar, y));
      }
    }
    this.setState({ output: result });
  }

  renderTable() {
    return (
      <div>
        {(this.state.output || []).map((data) => {
          const {
            FirstDecimalPrint,
            FirstSCPrint,
            MonthPrint,
            SyzygyDecimalPrint,
            SyzygySCPrint,
            TermNamePrint,
            TermDecimalPrint,
            TermSCPrint
          } = data;
          return (
            <div>
              <p>{data.YearInfo}</p>
              <table border="2">
              <tr>
                  {(MonthPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(FirstSCPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(FirstDecimalPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(SyzygySCPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(SyzygyDecimalPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(TermNamePrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(TermSCPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(TermDecimalPrint || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
               
              </table>
            </div>
          );
        })}
      </div>
    );
  }

  renderMode() {
    return (
      <div
        onChange={(e) => {
          this.setState({ mode: e.target.value });
        }}
      >
        <p>查询模式：</p>
        <div>
          <input type="radio" name="retrieve-mode" value="0" defaultChecked />
          <label for="0">特定年份</label>
        </div>
        <div>
          <input type="radio" name="retrieve-mode" value="1" />
          <label for="1">年份区间</label>
        </div>
      </div>
    );
  }

  renderInput() {
    return (
      <div className="year-select">
        <input
          onChange={(e) => {
            this.setState({ yearStart: e.currentTarget.value });
          }}
        />
        {this.state.mode === "1" ? (
          <div className="year-end">
            <p>~</p>
            <input
              onChange={(e) => {
                this.setState({ yearEnd: e.currentTarget.value });
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  renderCalendar() {
    return (
      <div className="calendar-select">
        <p>历法：</p>
        <select
          value={this.state.calendar}
          onChange={(e) => {
            this.setState({ calendar: e.currentTarget.value });
          }}
        >
          <option value="Yin">殷</option>
          <option value="Santong">三统</option>
          <option value="XiaA">冬夏</option>
          <option value="Shoushi">授时</option>
        </select>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        {this.renderMode()}
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handleRetrieve}>查询</button>
        {this.renderTable()}
      </div>
    );
  }
}
