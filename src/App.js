import React from "react";
import './App.css'
import  calculate  from "../src/Shangshu-calendar";
import {CalNameList} from "../src/Shangshu-calendar/constant" 

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
      
      result.push(calculate(this.state.calendar, yearStart)) 
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
         return <table>
         {
         Object.entries(data).map(([key,value]) => {
          return (            
           <tr>
            <th>{key}</th>
           {typeof value=='string' ?<td>{value}</td>:(
             value.map((x)=><td>{x}</td>)
           ) }
           </tr>
            )
           })  
         }
           </table>
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
          
           {Object.entries(CalNameList).map(([key,value])=>{
            return <option value={key}>{value}</option>
           })}        
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
