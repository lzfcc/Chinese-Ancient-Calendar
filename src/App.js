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
            MonthPrint,
            NewmAvgSCPrint,
            NewmAvgDecimalPrint,
            NewmSCPrint,
            NewmDecimal3Print,
            NewmDecimal2Print,
            NewmDecimal1Print,
            NewmMmddPrint,
            SyzygySCPrint,
            SyzygyDecimalPrint,
            TermNamePrint,
            TermAcrSCPrint,
            TermAcrDecimalPrint,
            TermSCPrint,
            TermDecimalPrint,
            SClist
          } = data;
          // const YearSC = SClist[((y - 3) % 60 + 60) % 60]
          return (
            <div>
                {/* <p>if (y > 0) {
            AnnoDomini = ('   \n公元 ' + y + ' 年 ' + YearSC + ' —————————————————————————   \n')
        } else {
            AnnoDomini = ('   \n公元前 ' + (1 - y) + ' 年 ' + YearSC + ' ————————————————————————— \n')
        }</p> */}
            <p>{data.YearInfo}</p>
            <table>
            <tr>
                <th>月</th>
                {(MonthPrint || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
            <tr class="tr dividerB">
            <th>定朔</th>
            {(NewmSCPrint || []).map((x) => (
            <td>{x}</td>
            ))}
            </tr>
            {/* <tr>
            <th>日期</th> 
            {(NewmMmddPrint|| []).map((x) => (
            <td>{x}</td>
            ))}
            </tr> */}
            <tr>
                    <th>三次</th>
                    {(NewmDecimal3Print || []).map((x) => (
                        <td>{x}</td>
                    ))}
                </tr>
                <tr>
                    <th>二次</th>
                    {(NewmDecimal2Print || []).map((x) => (
                        <td>{x}</td>
                    ))}
                </tr>
                <tr>
                    <th>一次</th>
                    {(NewmDecimal1Print || []).map((x) => (
                        <td>{x}</td>
                    ))}
                </tr>
                <tr class="tr dividerA">
                <th>平朔</th>
                {(NewmAvgSCPrint || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
            <tr>
            <th>分</th>
            {(NewmAvgDecimalPrint || []).map((x) => (
                <td>{x}</td>
            ))}
            </tr>
            <tr class="tr dividerB">
                <th>望</th>
                {(SyzygySCPrint || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
            <tr>
                <th>分</th>
                {(SyzygyDecimalPrint || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
            <tr class="tr dividerB">
                <th>中氣</th>
                {(TermNamePrint || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
            <tr>
            <th>定氣</th>
            {(TermAcrSCPrint|| []).map((x) => (
            <td>{x}</td>
            ))}
            </tr>
            <tr>
            <th>分</th>
            {( TermAcrDecimalPrint|| []).map((x) => (
            <td>{x}</td>
            ))}
            </tr>
            <tr class="tr dividerA">
                <th>平氣</th>
                {(TermSCPrint || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
            <tr>
                <th>分</th>
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
        <span>
          <input type="radio" name="retrieve-mode" value="0" defaultChecked />
          <label for="0">特定年份</label>
        </span>
        <span>
          <input type="radio" name="retrieve-mode" value="1" />
          <label for="1">年份区间</label>
        </span>
      </div>
    );
  }

  renderInput() {
    return (
      <span className="year-select">
        <span>（1=公元1年，0=公元前1年，-1=公元前2年）</span>
        <input
          onChange={(e) => {
            this.setState({ yearStart: e.currentTarget.value });
          }}
        />
        <span>年</span>
        {this.state.mode === "1" ? (
          <span className="year-end">
            <span>至</span>
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
      <div className="calendar-select">
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
          <option value="Huangji">皇極</option>
          <option value="Wuyin">戊寅</option>
          <option value="Shenlong">神龍(擬)</option>
          <option value="Linde">麟德</option>
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
        <button onClick={this.handleRetrieve}>click!</button>
        {this.renderTable()}
      </div>
    );
  }
}
