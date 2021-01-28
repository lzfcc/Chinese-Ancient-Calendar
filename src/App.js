import React from "react";
import "./App.css";
import Calculate from "./ancientcalendar";
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderTable = this.renderTable.bind(this);

    this.state = { year: "", output: "" };
  }

  handleChange(e) {
    this.setState({ year: e.currentTarget.value });
  }

  handleClick(e) {
    const year = Number(this.state.year);
    if (Number.isNaN(year)) {
      alert("输入年份不合法！");
      return;
    }
    // alert(this.state.year);
    const result = Calculate(year);
    this.setState({ output: result });
  }

  renderTable() {
    return (
      <div>
        <text>{this.state.output.title || "柯柯的历法查询"}</text>
        {(this.state.output.data || []).map((item, index) => {
          const { info, sc, sy, gc } = item;
          return (
            <div>
              {/* <text>{name}</text> */}
              <text>{info}</text>
              <table border="2">
                <tr>
                  {(sc || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(sy || []).map((x) => (
                    <td>{x}</td>
                  ))}
                </tr>
                <tr>
                  {(gc || []).map((x) => (
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

  render() {
    return (
      <div className="App">
        <input onChange={this.handleChange} />
        <button onClick={this.handleClick}>Gan!</button>
        {this.renderTable()}
      </div>
    );
  }
}
