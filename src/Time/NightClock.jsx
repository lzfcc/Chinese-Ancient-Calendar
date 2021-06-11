import React from "react"
import { BindNightClock } from "../Cal/time_decimal2clock"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 8,
      b: 25,
      c: 2.5
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>所求時刻 0.</span>
        <input
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>日出 0.</span>
        <input
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>昏明刻</span>
        <input
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
      </span>

    );
  }

  handle() {
    try {
      const Print = BindNightClock(this.state.a, this.state.b, this.state.c);
      this.setState({ output: Print });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output) {
      return null;
    }
    return (
      <div className="ans table2">
        <table>
          {(this.state.output || []).map(row => {
            return (
              <tr>
                <td className="RowTitle">{row.title}</td>
                <td>{row.data}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>時刻 ⇒ 夜籌更點</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-1">
          NightClock
        </button>
        {this.result()}
      </div>
    );
  }
}
